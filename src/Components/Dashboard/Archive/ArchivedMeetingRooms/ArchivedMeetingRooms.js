import { useEffect, useState } from "react"
import { Table, Pagination, Spin, Carousel, Space, Button, message } from "antd"
import { UndoOutlined, DeleteOutlined } from "@ant-design/icons"
import axios from "../../../../axios"

const ArchivedMeetingRooms = () => {
  const [archivedMeetingRooms, setArchivedMeetingRooms] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const handleUndo = async (id) => {
    try {
      setLoading(true)
      await axios
        .patch(`/meeting_rooms/${id}/undo`)
        .then((res) => {
          messageApi.success(res.data.message)
          fetchArchivedMeetingRooms(currentPage)
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.error("Error occurred while undoing meeting room:", error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
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
      title: "Action",
      key: "action",
      render: (_, item) => (
        <Space size="middle">
          <Button icon={<UndoOutlined />} onClick={() => handleUndo(item._id)}>
            Restore
          </Button>
          <Button icon={<DeleteOutlined />} onClick={() => handleUndo(item._id)}>
            Delete permanently
          </Button>
        </Space>
      )
    }
  ]

  const fetchArchivedMeetingRooms = async (page) => {
    try {
      setLoading(true)
      await axios
        .get(`/meeting_rooms/archive/method/pagination?page=${page}&pageSize=10`)
        .then((res) => {
          setArchivedMeetingRooms(res.data.meeting_rooms)
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
    fetchArchivedMeetingRooms(currentPage)
  }, [currentPage])

  return (
    <Spin spinning={loading} tip="Loading...">
      {contextHolder}
      <Table
        columns={columns}
        dataSource={archivedMeetingRooms.map((meetingRoom) => ({ ...meetingRoom, key: meetingRoom._id }))}
        pagination={false}
      />
      {totalPages > 0 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Pagination current={currentPage} total={totalPages * 10} onChange={handlePageChange} />
        </div>
      )}
    </Spin>
  )
}

export default ArchivedMeetingRooms
