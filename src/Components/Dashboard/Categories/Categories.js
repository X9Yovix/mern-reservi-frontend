import { useEffect, useState } from "react"
import { Button, Form, Input, Row, Col, Divider, Spin, ColorPicker, Layout, Table, Pagination, Modal, Typography, Space, message } from "antd"
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import { ColorFactory } from "antd/es/color-picker/color"
import axios from "../../../axios"

const componentToHex = (c) => {
  const hex = Math.round(c).toString(16)
  return hex.length === 1 ? "0" + hex : hex
}

const rgbToHex = (r, g, b) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const [addForm] = Form.useForm()
  const [addModalVisible, setAddModalVisible] = useState(false)

  const [editForm] = Form.useForm()
  const [editModalVisible, setEditModalVisible] = useState(false)

  const [loading, setLoading] = useState(false)
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
      title: "Color",
      dataIndex: "color",
      key: "color",
      render: (color) => <div style={{ backgroundColor: color, width: "30px", height: "30px" }}></div>
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
  const fetchCategories = async (page) => {
    try {
      setLoading(true)
      await axios
        .get(`/categories/method/pagination?page=${page}`)
        .then((res) => {
          setCategories(res.data.categories)
          setTotalPages(res.data.totalPages)
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.error("Error occurred while fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    fetchCategories(currentPage)
  }, [currentPage])

  //edit
  const onFinishEdit = async (values) => {
    try {
      setLoading(true)
      const { r, g, b } = values.color.metaColor
      const hexColor = rgbToHex(r, g, b)
      values.color = hexColor

      await axios
        .put(`categories/${values._id}`, {
          name: values.name,
          color: values.color
        })
        .then((res) => {
          setEditModalVisible(false)
          fetchCategories(currentPage)
          messageApi.success(res.data.message)
        })
        .catch((err) => {
          console.log(err)
          messageApi.error(err.response.data.error)
        })
    } catch (error) {
      console.error("Error occurred while updating meeting room:", error)
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

  const handleUpdate = async (id) => {
    try {
      setLoading(true)
      await axios
        .get(`/categories/${id}`)
        .then((res) => {
          editForm.resetFields()
          editForm.setFieldsValue({
            _id: res.data._id,
            name: res.data.name,
            color: new ColorFactory(res.data.color)
          })
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

  //add
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
      const { r, g, b } = values.color.metaColor
      const hexColor = rgbToHex(r, g, b)
      values.color = hexColor

      await axios
        .post("/categories", values)
        .then((res) => {
          addForm.resetFields()
          setAddModalVisible(false)
          fetchCategories(currentPage)
          messageApi.success(res.data.message)
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.error("Error occurred while saving categorie:", error)
    } finally {
      setLoading(false)
    }
  }

  //delete
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
          .delete(`/categories/${id}`)
          .then((res) => {
            fetchCategories(currentPage)
            messageApi.success(res.data.message)
          })
          .catch((err) => {
            console.log(err)
            messageApi.error(err.response.data.error)
          })
      } catch (error) {
        console.error("Error occurred while deleting category:", error)
      } finally {
        setLoading(false)
      }
    }

    showConfirmModal("Delete Category", "Are you sure you want to delete this category?", onOk)
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
              List of Categories
            </Title>
          </Col>
          <Col span={12} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <Button type="default" onClick={() => setAddModalVisible(true)} icon={<PlusOutlined />}>
              Add Category
            </Button>
          </Col>
        </Row>
        <Divider />
        <Table columns={columns} dataSource={categories.map((category) => ({ ...category, key: category._id }))} pagination={false} />
        {totalPages > 0 && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Pagination current={currentPage} total={totalPages * 10} onChange={handlePageChange} />
          </div>
        )}

        <Modal title="Add Category" open={addModalVisible} onCancel={handleAddModalCancel} onOk={handleAddModalOk} confirmLoading={loading}>
          <Form form={addForm} name="add-category-form" onFinish={onFinishAdd}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item name="name" label="Name" colon={false} rules={[{ required: true, message: "Please input name" }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="color" label="Color" colon={false} rules={[{ required: true, message: "Please choose color" }]}>
                  <ColorPicker />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
        {editForm && (
          <Modal title="Edit Category" open={editModalVisible} onCancel={handleEditModalCancel} onOk={handleEditModalOk} confirmLoading={loading}>
            <Form form={editForm} name="edit-category-form" onFinish={onFinishEdit}>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item name="name" label="Name" colon={false} rules={[{ required: true, message: "Please input name" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="color" label="Color" colon={false} rules={[{ required: true, message: "Please choose color" }]}>
                    <ColorPicker />
                  </Form.Item>
                </Col>
                <Form.Item name="_id" hidden>
                  <Input />
                </Form.Item>
              </Row>
            </Form>
          </Modal>
        )}
      </Content>
    </Spin>
  )
}

export default Categories
