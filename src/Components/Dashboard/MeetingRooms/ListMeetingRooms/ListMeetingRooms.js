import { useState, useEffect } from "react"
import { Button, Row, Col, Divider, Spin, Layout, Table, Space, Typography, Pagination, Modal, Switch, message, Carousel } from "antd"
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import axios from "../../../../axios"
import { Link, useNavigate } from "react-router-dom"

const ListMeetingRooms = () => {
  const [meetingRooms, setMeetingRooms] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [descriptionRoom, setDescriptionRoom] = useState(null)
  const [loading, setLoading] = useState(false)

  const [messageApi, contextHolder] = message.useMessage()
  const navigate = useNavigate()

  const { Content } = Layout
  const { Title } = Typography

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, item) => (
        <Link to={`/rooms/details/${item._id}`}>
          <span>{item.name}</span>
        </Link>
      )
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity"
    },
    {
      title: "Size (WxHxL)",
      dataIndex: "dimensions",
      key: "dimensions",
      render: (_, item) => (
        <span>
          {item.width} x {item.height} x {item.length}
        </span>
      )
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (_, { description }) =>
        description && description.length > 0 ? (
          <Button type="text" onClick={() => handleDescription(description)}>
            View Description
          </Button>
        ) : (
          "No description"
        )
    },
    {
      title: "Materials",
      dataIndex: "materials",
      key: "materials",
      render: (_, item) => (
        <span>
          {item.materials
            .map((material) => {
              const dataMaterial = item.materialsDetails.find((mat) => mat._id === material._id)
              return `${dataMaterial.name}(${material.reservedQuantity})`
            })
            .join(", ")}
        </span>
      )
    },
    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      render: (_, item) => (
        <Carousel style={{ width: "150px" }}>
          {item.images.map((image, index) => (
            <div key={index}>
              <img
                alt={`${image}-${index}`}
                src={`${process.env.REACT_APP_BACKEND_STATIC_URL}${image}`}
                style={{ width: "140px", height: "140px", objectFit: "cover" }}
              />
            </div>
          ))}
        </Carousel>
      )
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
  const fetchMeetingRooms = async (page) => {
    try {
      setLoading(true)
      await axios
        .get(`/meeting_rooms/method/pagination?page=${page}&pageSize=10`)
        .then((res) => {
          setMeetingRooms(res.data.meeting_rooms)
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

  const handleDescription = (description) => {
    setDescriptionRoom(description)
  }

  const handleCloseModal = () => {
    setDescriptionRoom(null)
  }

  useEffect(() => {
    fetchMeetingRooms(currentPage)
  }, [currentPage])

  const handleAvailabilityChange = async (id, checked) => {
    try {
      setLoading(true)
      await axios
        .put(`/meeting_rooms/state/${id}`, { availability: checked })
        .then((res) => {
          fetchMeetingRooms(currentPage)
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

  //update
  const handleUpdate = (id) => {
    navigate(`/dashboard/meeting-rooms/update/${id}`)
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
          .delete(`/meeting_rooms/${id}`)
          .then((res) => {
            fetchMeetingRooms(currentPage)
            messageApi.success(res.data.message)
          })
          .catch((err) => {
            console.log(err)
            messageApi.error(err.response.data.error)
          })
      } catch (error) {
        console.error("Error occurred while deleting meeting room:", error)
      } finally {
        setLoading(false)
      }
    }
    showConfirmModal("Delete Meeting Room", "Are you sure you want to delete this meeting room?", onOk)
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
              List of Meeting Rooms
            </Title>
          </Col>
          <Col span={12} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <Link to="/dashboard/meeting-rooms/add">
              <Button type="default" icon={<PlusOutlined />}>
                Add Meeting Room
              </Button>
            </Link>
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
          <Table columns={columns} dataSource={meetingRooms.map((meetingRoom) => ({ ...meetingRoom, key: meetingRoom._id }))} pagination={false} />
          {totalPages > 0 && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Pagination current={currentPage} total={totalPages * 10} onChange={handlePageChange} />
            </div>
          )}
        </Layout>
        <Modal title="Description" open={!!descriptionRoom} onCancel={handleCloseModal} footer={null}>
          <p>{descriptionRoom}</p>
        </Modal>
      </Content>
    </Spin>
  )
}

export default ListMeetingRooms
