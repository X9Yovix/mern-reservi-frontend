import { useEffect, useState } from "react"
import { Button, Modal, Pagination, Space, Spin, Table, Tag, message } from "antd"
import axios from "../../../axios"
import "./Reservations.css"
import { CloseCircleOutlined } from "@ant-design/icons"

const Reservations = () => {
  const [loading, setLoading] = useState(false)
  const [reservations, setReservations] = useState([])
  const [additionalInfo, setAdditionalInfo] = useState(null)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const handleAdditionalInfo = (additional_info) => {
    setAdditionalInfo(additional_info)
  }

  const handleCloseModal = () => {
    setAdditionalInfo(null)
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, { room }) => <a href={`${process.env.REACT_APP_BASE_URL}/rooms/details/${room[0]}`}>{room[1]}</a>
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      render: (_, { categories }) => (
        <>
          {categories &&
            categories.map((category) => {
              return <Tag key={category._id}>{category.name.toUpperCase()}</Tag>
            })}
        </>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <>
          {status == "pending" ? (
            <Tag color="blue">Pending</Tag>
          ) : status == "confirmed" ? (
            <Tag color="green">Approved</Tag>
          ) : status == "rejected" ? (
            <Tag color="green">Rejected</Tag>
          ) : (
            <Tag color="orange">Canceled</Tag>
          )}
        </>
      )
    },
    {
      title: "Participants",
      dataIndex: "participants",
      key: "participants"
    },
    {
      title: "Start date",
      dataIndex: "start_date",
      key: "start_date"
    },
    {
      title: "End date",
      dataIndex: "end_date",
      key: "end_date"
    },
    {
      title: "Additional Information",
      dataIndex: "additional_info",
      key: "additional_info",
      render: (_, { additional_info }) => (
        <Button type="text" onClick={() => handleAdditionalInfo(additional_info)}>
          View Info
        </Button>
      )
    },
    {
      title: "Action",
      key: "action",
      render: (_, { key, status }) =>
        status === "pending" && (
          <Space size="middle">
            <Button className="decline-btn" icon={<CloseCircleOutlined />} onClick={() => handleCancelRequest(key)}>
              Cancel
            </Button>
          </Space>
        )
    }
  ]

  const handleCancelRequest = async (reservationId) => {
    try {
      setLoading(true)
      await axios.put(`reservations/user/${reservationId}?page=${currentPage}`).then((res) => {
        const data = []
        res.data.reservations.map((reservation) => {
          data.push({
            key: reservation._id,
            room: [reservation.meeting_rooms._id, reservation.meeting_rooms.name],
            categories: reservation.meeting_rooms.categories,
            start_date: new Date(reservation.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
            end_date: new Date(reservation.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
            participants: reservation.participants,
            additional_info: reservation.additional_info,
            status: reservation.status
          })
        })
        setReservations(data)
        setTotalPages(res.data.totalPages)
        setLoading(false)
        message.success(res.data.message)
      })
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const fetchUserReservations = async (page) => {
    setLoading(true)
    try {
      const userId = JSON.parse(localStorage.getItem("user"))._id
      await axios
        .get(`reservations/user/${userId}?page=${page}`)
        .then((res) => {
          const data = []
          res.data.reservations.map((reservation) => {
            data.push({
              key: reservation._id,
              room: [reservation.meeting_rooms._id, reservation.meeting_rooms.name],
              categories: reservation.meeting_rooms.categories,
              start_date: new Date(reservation.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
              end_date: new Date(reservation.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
              participants: reservation.participants,
              additional_info: reservation.additional_info,
              status: reservation.status
            })
          })
          setReservations(data)
          setTotalPages(res.data.totalPages)
          setLoading(false)
        })
        .catch((error) => {
          console.error(error)
          setLoading(false)
        })
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    fetchUserReservations(currentPage)
  }, [currentPage])

  return (
    <Spin spinning={loading} tip="Loading...">
      <Table columns={columns} dataSource={reservations} pagination={false} />
      {totalPages > 0 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Pagination current={currentPage} total={totalPages * 10} onChange={handlePageChange} />
        </div>
      )}
      <Modal title="Additional Information" open={!!additionalInfo} onCancel={handleCloseModal} footer={null}>
        <p>{additionalInfo}</p>
      </Modal>
    </Spin>
  )
}

export default Reservations
