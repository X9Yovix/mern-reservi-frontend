import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  InputNumber,
  Divider,
  Space,
  Modal,
  Upload,
  AutoComplete,
  Spin,
  Select,
  Tag,
  Layout,
  message,
  Typography
} from "antd"
import TextArea from "antd/es/input/TextArea"
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import axios from "../../../axios"

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

const MeetingRooms = () => {
  const [form] = Form.useForm()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState("")
  const [previewTitle, setPreviewTitle] = useState("")
  const [fileList, setFileList] = useState([])
  const [materials, setMaterials] = useState([])
  const [selectedMaterials, setSelectedMaterials] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  const [messageApi, contextHolder] = message.useMessage()

  const { Content } = Layout
  const { Title } = Typography

  const fetchMaterials = async () => {
    try {
      setLoading(true)
      await axios
        .get("/materials")
        .then((res) => {
          setMaterials(res.data.materials.filter((material) => material.availableQuantity > 0 && material.availability === true))
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.error("Error occurred while fetching materials:", error)
    } finally {
      setLoading(false)
    }
  }
  const fetchCategories = async () => {
    try {
      setLoading(true)
      await axios
        .get("/categories")
        .then((res) => {
          var categories = []
          res.data.categories.map((category) => {
            categories.push({
              value: category._id,
              label: category.name,
              color: category.color
            })
          })
          setCategories(categories)
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.error("Error occurred while fetching materials:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMaterials()
    fetchCategories()
  }, [])

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props
    const onPreventMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }
    const category = categories.find((category) => category.value === value)
    if (category) {
      return (
        <Tag
          color={category.color}
          onMouseDown={onPreventMouseDown}
          closable={closable}
          onClose={onClose}
          style={{
            marginInlineEnd: 4
          }}
        >
          {label}
        </Tag>
      )
    }
    return null
  }

  const handleCancel = () => setPreviewOpen(false)
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1))
  }
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none"
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8
        }}
      >
        Upload
      </div>
    </button>
  )

  const onFinish = async (values) => {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("description", values.description)
    formData.append("capacity", values.capacity)
    formData.append("length", values.length)
    formData.append("width", values.width)
    formData.append("height", values.height)

    var categoriesData = []
    values.categories.map((category) => {
      categoriesData.push({
        _id: category
      })
    })
    formData.append("categories", JSON.stringify(categoriesData))

    var materialsData = []
    values.materials.map((material, index) => {
      materialsData.push({
        _id: selectedMaterials[index]._id,
        reservedQuantity: material.quantity
      })
    })

    formData.append("materials", JSON.stringify(materialsData))

    fileList.map((file) => {
      formData.append("images", file.originFileObj)
    })

    try {
      setLoading(true)
      await axios
        .post("/meeting_rooms", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then((res) => {
          messageApi.success(res.data.message)
          form.resetFields()
          setFileList([])
          setSelectedMaterials([])
        })
        .catch((err) => {
          console.log(err)
          messageApi.error(err.response.data.error)
        })
    } catch (error) {
      console.error("Error occurred while saving meeting room:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Spin spinning={loading} tip="Loading...">
      <Content
        style={{
          width: "80%",
          margin: "auto",
          padding: "10px",
          marginTop: "20px"
        }}
      >
        {contextHolder}
        <Row>
          <Col span={12} style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
            <Title level={4} style={{ margin: 0 }}>
              Add Meeting room
            </Title>
          </Col>
        </Row>
        <Divider />
        <Layout
          style={{
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            padding: "20px",
            borderRadius: "10px",
            background: localStorage.getItem("theme") === "dark" ? "#1a1a24" : "#f0f2f5",
            marginTop: "20px"
          }}
        >
          <Form form={form} name="meeting-room-form" onFinish={onFinish}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="name" label="Name" colon={false} rules={[{ required: true, message: "Name is required" }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  labelCol={{
                    span: 10
                  }}
                  wrapperCol={{
                    span: 10
                  }}
                  name="capacity"
                  label="Capacity"
                  colon={false}
                  rules={[
                    { required: true, message: "Capacity is required" },
                    { type: "number", min: 1, message: "Capacity must be a positive number" }
                  ]}
                >
                  <InputNumber min={1} />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="Dimensions" colon={false} required={true}>
                  <Space.Compact size="middle">
                    <Form.Item
                      noStyle
                      style={{ marginBottom: 0 }}
                      name="length"
                      rules={[
                        { required: true, message: "Length is required" },
                        { type: "number", min: 1, message: "Length must be a positive number" }
                      ]}
                    >
                      <InputNumber min={1} style={{ width: "50%" }} placeholder="Length" />
                    </Form.Item>
                    <Form.Item
                      noStyle
                      style={{ marginBottom: 0 }}
                      name="width"
                      rules={[
                        { required: true, message: "Width is required" },
                        { type: "number", min: 1, message: "Width must be a positive number" }
                      ]}
                    >
                      <InputNumber min={1} style={{ width: "50%" }} placeholder="Width" />
                    </Form.Item>
                    <Form.Item
                      noStyle
                      style={{ marginBottom: 0 }}
                      name="height"
                      rules={[
                        { required: true, message: "Height is required" },
                        { type: "number", min: 1, message: "Height must be a positive number" }
                      ]}
                    >
                      <InputNumber min={1} style={{ width: "50%" }} placeholder="Height" />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col span={24}>
                <Form.Item name="description" label="Description" colon={false}>
                  <TextArea />
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Form.Item
              name="categories"
              label="Categories"
              colon={false}
              rules={[{ required: true, message: "Please select at least one category" }]}
            >
              <Select
                mode="multiple"
                style={{
                  width: "100%"
                }}
                placeholder="Select category"
                optionLabelProp="label"
                filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                filterSort={(optionA, optionB) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
                options={categories}
                tagRender={(props) => tagRender(props)}
              />
            </Form.Item>
            <Divider />
            <Row>
              <Col span={24}>
                <Form.List
                  name="materials"
                  rules={[
                    {
                      validator: async (_, materials) => {
                        if (!materials || materials.length < 2) {
                          return Promise.reject(new Error("Select at least 2 materials"))
                        }
                      }
                    }
                  ]}
                >
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map((field, index) => (
                        <Form.Item
                          labelCol={{ span: 24 }}
                          label={index === 0 ? "Materials" : ""}
                          required={true}
                          key={field.key}
                          style={{ marginBottom: 15 }}
                        >
                          <Row gutter={8}>
                            <Col flex="auto">
                              <Form.Item
                                {...field}
                                name={[field.name, "name"]}
                                key={[field.key, "key"]}
                                validateTrigger={["onChange", "onBlur"]}
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message: "Missing material name or delete this field"
                                  },
                                  {
                                    validator: async (_, value) => {
                                      const optionExists = materials.some((material) => material.name === value)
                                      if (!optionExists) {
                                        return Promise.reject(new Error("Please select a valid material"))
                                      }
                                      return Promise.resolve()
                                    }
                                  }
                                ]}
                                style={{ marginBottom: 0 }}
                              >
                                <AutoComplete
                                  allowClear
                                  options={materials
                                    .filter((material) => !selectedMaterials.some((selected) => selected.name === material.name))
                                    .map((material) => ({
                                      value: material.name,
                                      label: `${material.name} (${material.availableQuantity})`
                                    }))}
                                  onSelect={(value) => {
                                    const selectedMaterial = materials.find((material) => material.name === value)
                                    if (selectedMaterial && selectedMaterial != "") {
                                      const fieldKey = field.key
                                      if (selectedMaterials.some((material) => material.fieldKey === fieldKey)) {
                                        const indexToRemove = selectedMaterials.findIndex((material) => material.fieldKey === fieldKey)
                                        if (indexToRemove !== -1) {
                                          selectedMaterials.splice(indexToRemove, 1)
                                        }
                                      }
                                      setSelectedMaterials([...selectedMaterials, { ...selectedMaterial, fieldKey }])
                                    }
                                  }}
                                  placeholder="Material name"
                                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                                  filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                                  }
                                />
                              </Form.Item>
                            </Col>
                            <Col flex="none">
                              <Form.Item
                                name={[field.name, "quantity"]}
                                style={{ marginBottom: 0 }}
                                rules={[{ required: true, message: "Missing quantity" }]}
                              >
                                <InputNumber min={1} placeholder="Quantity" />
                              </Form.Item>
                            </Col>
                            <Col flex="none">
                              <MinusCircleOutlined
                                className="dynamic-delete-button"
                                onClick={() => {
                                  const indexToRemove = selectedMaterials.findIndex((material) => material.fieldKey === field.key)
                                  if (indexToRemove !== -1) {
                                    selectedMaterials.splice(indexToRemove, 1)
                                    remove(field.name)
                                  } else {
                                    remove(field.name)
                                  }
                                }}
                              />
                            </Col>
                          </Row>
                        </Form.Item>
                      ))}

                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} style={{ width: "100%" }} icon={<PlusOutlined />}>
                          Add Material
                        </Button>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col span={24}>
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  beforeUpload={() => false}
                  accept="image/*"
                >
                  {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                  <img
                    alt="example"
                    style={{
                      width: "100%"
                    }}
                    src={previewImage}
                  />
                </Modal>
              </Col>
            </Row>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
            </Form.Item>
          </Form>
        </Layout>
      </Content>
    </Spin>
  )
}

MeetingRooms.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  closable: PropTypes.bool,
  onClose: PropTypes.func,
  color: PropTypes.string
}
export default MeetingRooms
