import { useState, useEffect } from "react"
import { Button, Form, Input, Row, Col, InputNumber, Divider, Spin, Layout, message, Table, Space, Typography, Pagination, Modal, Switch } from "antd"
import TextArea from "antd/es/input/TextArea"
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import axios from "../../../axios"

const Materials = () => {
  const [materials, setMaterials] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const [loading, setLoading] = useState(false)

  const [addForm] = Form.useForm()
  const [addModalVisible, setAddModalVisible] = useState(false)

  const [editForm] = Form.useForm()
  const [editModalVisible, setEditModalVisible] = useState(false)

  const [messageApi, contextHolder] = message.useMessage()

  const { Content } = Layout
  const { Title } = Typography

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Quantity",
      dataIndex: "totalQuantity",
      key: "totalQuantity"
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description"
    },
    {
      title: "Availability",
      dataIndex: "availability",
      key: "availability",
      render: (_, item) => <Switch checked={item.availability} onChange={(checked) => handleAvailabilityChange(item._id, checked)} />
    },
    {
      title: "Action",
      key: "action",
      render: (_, item) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleUpdate(item._id)}>
            Update
          </Button>
          <Button className="decline-btn" icon={<DeleteOutlined />} onClick={() => handleDelete(item._id)}>
            Delete
          </Button>
        </Space>
      )
    }
  ]

  //fetch
  const fetchMaterials = async (page) => {
    try {
      setLoading(true)
      await axios
        .get(`/materials/method/pagination?page=${page}`)
        .then((res) => {
          setMaterials(res.data.materials)
          setTotalPages(res.data.total_pages)
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

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    fetchMaterials(currentPage)
  }, [currentPage])

  //update
  const handleUpdate = async (id) => {
    try {
      setLoading(true)
      await axios
        .get(`/materials/${id}`)
        .then((res) => {
          editForm.resetFields()
          editForm.setFieldsValue(res.data)
          setEditModalVisible(true)
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.error("Error occurred while fetching category:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditModalCancel = () => {
    setEditModalVisible(false)
  }

  const handleEditModalOk = () => {
    editForm.submit()
  }

  const onFinishEdit = async (values) => {
    try {
      setLoading(true)
      await axios
        .put(`/materials/${values._id}`, {
          name: values.name,
          totalQuantity: values.totalQuantity,
          description: values.description
        })
        .then((res) => {
          setEditModalVisible(false)
          fetchMaterials(currentPage)
          messageApi.success(res.data.message)
        })
        .catch((err) => {
          console.log(err)
          messageApi.error(err.response.data.error)
        })
    } catch (error) {
      console.error("Error occurred while updating material:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAvailabilityChange = async (id, checked) => {
    try {
      setLoading(true)
      await axios
        .put(`/materials/state/${id}`, { availability: checked })
        .then((res) => {
          fetchMaterials(currentPage)
          messageApi.success(res.data.message)
        })
        .catch((err) => {
          console.log(err)
          messageApi.error(err.response.data.error)
        })
    } catch (error) {
      console.error("Error occurred while updating availability:", error)
    } finally {
      setLoading(false)
    }
  }

  //Add section
  const handleAddModalCancel = () => {
    addForm.resetFields(["name", "color"])
    setAddModalVisible(false)
  }

  const handleAddModalOk = () => {
    addForm.submit()
  }

  const onFinishAdd = async (values) => {
    try {
      setLoading(true)
      await axios
        .post("/materials", values)
        .then((res) => {
          addForm.resetFields()
          setAddModalVisible(false)
          fetchMaterials(currentPage)
          messageApi.success(res.data.message)
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.error("Error occurred while saving material:", error)
    } finally {
      setLoading(false)
    }
  }

  //Delete section
  const showConfirmModal = (title, content, onOk) => {
    Modal.confirm({
      title,
      content,
      onOk,
      onCancel() {
        messageApi.info("Action canceled")
      },
      okText: "Yes",
      cancelText: "No"
    })
  }
  const handleDelete = (id) => {
    const onOk = async () => {
      try {
        setLoading(true)
        await axios
          .delete(`/materials/${id}`)
          .then((res) => {
            console.log(res)
            fetchMaterials(currentPage)
            messageApi.success(res.data.message)
          })
          .catch((err) => {
            console.log(err)
            messageApi.error(err.response.data.error)
          })
      } catch (error) {
        console.error("Error occurred while deleting material:", error)
      } finally {
        setLoading(false)
      }
    }

    showConfirmModal("Delete Material", "Are you sure you want to delete this material?", onOk)
  }

  return (
    <Spin spinning={loading} tip="Loading...">
      {contextHolder}
      <Content
        style={{
          width: "80%",
          margin: "auto",
          padding: "10px",
          marginTop: "20px"
        }}
      >
        <Row>
          <Col span={12} style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
            <Title level={4} style={{ margin: 0 }}>
              List of Materials
            </Title>
          </Col>
          <Col span={12} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <Button type="default" onClick={() => setAddModalVisible(true)} icon={<PlusOutlined />}>
              Add Material
            </Button>
          </Col>
        </Row>

        <Divider />
        <Layout
          style={{
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            padding: "20px",
            borderRadius: "10px",
            background: localStorage.getItem("theme") === "dark" ? "#1a1a24" : "#f0f2f5"
          }}
        >
          <Table columns={columns} dataSource={materials.map((material) => ({ ...material, key: material._id }))} pagination={false} />
          {totalPages > 0 && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Pagination current={currentPage} total={totalPages * 10} onChange={handlePageChange} />
            </div>
          )}
        </Layout>
        <Modal title="Add Material" open={addModalVisible} onCancel={handleAddModalCancel} onOk={handleAddModalOk} confirmLoading={loading}>
          <Form form={addForm} name="add-material-form" onFinish={onFinishAdd}>
            <Row gutter={24}>
              <Col span={14}>
                <Form.Item name="name" label="Name" colon={false} rules={[{ required: true, message: "Name is required" }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  name="totalQuantity"
                  label="Quantity"
                  colon={false}
                  rules={[
                    { required: true, message: "Quantity is required" },
                    { type: "number", min: 1, message: "Quantity must be a positive number" }
                  ]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name="description" label="Description" colon={false}>
                  <TextArea />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>

        {editForm && (
          <Modal title="Edit Material" open={editModalVisible} onCancel={handleEditModalCancel} onOk={handleEditModalOk} confirmLoading={loading}>
            <Form form={editForm} name="edit-material-form" onFinish={onFinishEdit}>
              <Row gutter={24}>
                <Col span={14}>
                  <Form.Item name="name" label="Name" colon={false} rules={[{ required: true, message: "Name is required" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    name="totalQuantity"
                    label="Quantity"
                    colon={false}
                    rules={[
                      { required: true, message: "Quantity is required" },
                      { type: "number", min: 1, message: "Quantity must be a positive number" }
                    ]}
                  >
                    <InputNumber />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name="description" label="Description" colon={false}>
                    <TextArea />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="_id" hidden>
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        )}
      </Content>
    </Spin>
  )
}

export default Materials
