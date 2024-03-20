import { useEffect, useState } from "react"
import { List, Spin, Button, Space, message, Pagination, Avatar, Carousel, Modal } from "antd"
import {
  BankOutlined,
  ClockCircleOutlined,
  DislikeOutlined,
  InfoCircleOutlined,
  LikeOutlined,
  ScheduleOutlined,
  UserOutlined
} from "@ant-design/icons"
import axios from "../../../../axios"
import "./PendingReservations.css"

const PendingReservations = () => {
  const [loading, setLoading] = useState(false)
  const [reservations, setReservations] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const handleSeeMore = (additional_info) => {
    Modal.info({
      title: "Additional Information",
      content: <p>{additional_info}</p>
    })
  }

  const fetchReservations = async (page) => {
    try {
      setLoading(true)
      await axios
        .get(`/reservations/state/pendings?page=${page}`)
        .then((res) => {
          setReservations(res.data.reservations)
          setTotalPages(res.data.totalPages)
          setLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
    } catch (error) {
      console.error("Error occurred while fetching meeting rooms:", error)
    }
  }

  useEffect(() => {
    fetchReservations(currentPage)
  }, [currentPage])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const confirmReservation = async (item) => {
    setLoading(true)
    await axios
      .put(`/reservations/state/decision/${item._id}`, { state: 1 })
      .then((res) => {
        console.log(res)
        message.success(res.data.message)
        fetchReservations(currentPage)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        message.error(err.message)
        setLoading(false)
      })
  }

  const declineReservation = async (item) => {
    setLoading(true)
    await axios
      .put(`/reservations/state/decision/${item._id}`, { state: 0 })
      .then((res) => {
        console.log(res)
        message.success(res.data.message)
        fetchReservations(currentPage)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        message.error(err.message)
        setLoading(false)
      })
  }

  const showConfirmModal = (title, content, onOk) => {
    Modal.confirm({
      title,
      content,
      onOk,
      onCancel() {
        message.info("Action canceled")
      },
      okText: "Yes",
      cancelText: "No"
    })
  }

  return (
    <Spin spinning={loading} tip="Loading...">
      <div style={{ width: "80%", margin: "auto", padding: "10px", marginTop: "20px" }}>
        <List
          itemLayout="vertical"
          size="large"
          dataSource={reservations}
          renderItem={(item) => (
            <List.Item
              style={{ borderBottom: "1px solid #dbd8d8" }}
              key={item._id}
              extra={
                <Carousel style={{ width: "120px", marginTop: "12px" }}>
                  {item.meeting_rooms.images &&
                    item.meeting_rooms.images.map((image, index) => (
                      <div key={index}>
                        <img alt={`${image}-${index}`} src={`${process.env.REACT_APP_BACKEND_STATIC_URL}${image}`} style={{ width: "100%" }} />
                      </div>
                    ))}
                </Carousel>
              }
              actions={[
                <Space key={1} style={{ marginLeft: "50px" }}>
                  <Button
                    className="confirm-btn"
                    icon={<LikeOutlined />}
                    onClick={() =>
                      showConfirmModal("Confirm Reservation", "Are you sure to confirm this reservation?", () => confirmReservation(item))
                    }
                  >
                    Confirm
                  </Button>
                  <Button
                    className="decline-btn"
                    icon={<DislikeOutlined />}
                    onClick={() =>
                      showConfirmModal("Decline Reservation", "Are you sure to decline this reservation?", () => declineReservation(item))
                    }
                  >
                    Decline
                  </Button>
                </Space>
              ]}
            >
              <List.Item.Meta
                avatar={
                  item.users ? <Avatar src={`${process.env.REACT_APP_BACKEND_STATIC_URL}${item.users.avatar}`} /> : <Avatar icon={<UserOutlined />} />
                }
                title={
                  <span style={{ color: "rgba(0, 0, 0, 0.7)" }}>
                    {item.users && item.users.first_name} {item.users && item.users.last_name}
                  </span>
                }
                description={
                  <div style={{ color: "rgba(0, 0, 0, 0.6)" }}>
                    <div>
                      <span>
                        <BankOutlined style={{ marginRight: 8 }} />
                      </span>{" "}
                      Room: <span style={{ color: "rgba(0, 0, 0, 0.9)" }}>{item.meeting_rooms.name}</span>
                    </div>
                    <div>
                      <span>
                        <ScheduleOutlined style={{ marginRight: 8 }} />
                      </span>{" "}
                      Participants: <span style={{ color: "rgba(0, 0, 0, 0.9)" }}>{item.participants}</span>
                    </div>
                    <div>
                      <span>
                        <ClockCircleOutlined style={{ marginRight: 8 }} />
                      </span>{" "}
                      Reservation:{" "}
                      <span style={{ color: "rgba(0, 0, 0, 0.9)" }}>
                        {new Date(item.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} -{" "}
                        {new Date(item.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "rgba(0, 0, 0, 0.6)",
                        width: "80%",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <span>
                          <InfoCircleOutlined style={{ marginRight: 8 }} />
                        </span>
                        Additional Info:{" "}
                        {item.additional_info.length > 80 ? (
                          <span style={{ color: "rgba(0, 0, 0, 0.9)" }}>{item.additional_info.slice(0, 80) + "..."}</span>
                        ) : item.additional_info.length === 0 ? (
                          <span style={{ color: "rgba(0, 0, 0, 0.6)" }}>No additional information provided</span>
                        ) : (
                          <span style={{ color: "rgba(0, 0, 0, 0.9)" }}>{item.additional_info}</span>
                        )}
                      </div>
                      {item.additional_info.length > 80 && (
                        <div style={{ color: "#1890ff", cursor: "pointer", marginLeft: "10px" }} onClick={() => handleSeeMore(item.additional_info)}>
                          See more
                        </div>
                      )}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
        {totalPages > 0 && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Pagination current={currentPage} total={totalPages * 10} onChange={handlePageChange} />
          </div>
        )}
      </div>
    </Spin>
  )
}

export default PendingReservations
