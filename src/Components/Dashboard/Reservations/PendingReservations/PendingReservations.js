import { useEffect, useState } from "react"
import { List, Spin, Button, Space, Pagination, Avatar, Carousel, Modal, Layout, Typography, Row, message } from "antd"
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

  const [messageApi, contextHolder] = message.useMessage()

  const { Content } = Layout

  const { Paragraph, Text } = Typography

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
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.error("Error occurred while fetching meeting rooms:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations(currentPage)
  }, [currentPage])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const confirmReservation = async (item) => {
    try {
      setLoading(true)
      await axios
        .put(`/reservations/state/decision/${item._id}`, { state: 1 })
        .then((res) => {
          fetchReservations(currentPage)
          messageApi.success(res.data.message)
        })
        .catch((err) => {
          console.log(err)
          messageApi.error(err.response.data.error)
        })
    } catch (error) {
      console.error("Error occurred while confirming reservation:", error)
    } finally {
      setLoading(false)
    }
  }

  const declineReservation = async (item) => {
    try {
      setLoading(true)
      await axios
        .put(`/reservations/state/decision/${item._id}`, { state: 0 })
        .then((res) => {
          fetchReservations(currentPage)
          messageApi.success(res.data.message)
        })
        .catch((err) => {
          console.log(err)
          messageApi.error(err.response.data.error)
        })
    } catch (error) {
      console.error("Error occurred while declining reservation:", error)
    } finally {
      setLoading(false)
    }
  }

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
        <List
          itemLayout="vertical"
          size="large"
          dataSource={reservations}
          renderItem={(item) => (
            <List.Item
              style={{ borderBottom: "1px solid #dbd8d8" }}
              key={item._id}
              extra={
                <Carousel style={{ width: "200px", marginTop: "15px" }}>
                  {item.meeting_rooms.images &&
                    item.meeting_rooms.images.map((image, index) => (
                      <div key={index}>
                        <img alt={`${image}-${index}`} src={`${process.env.REACT_APP_BACKEND_STATIC_URL}${image}`} style={{ width: "100%" }} />
                      </div>
                    ))}
                </Carousel>
              }
              actions={[
                <Space key={1} style={{ marginLeft: "10px", padding: "5px" }}>
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
                title={
                  <>
                    {item.users.avatar != "" ? (
                      <Avatar src={`${process.env.REACT_APP_BACKEND_STATIC_URL}${item.users.avatar}`} />
                    ) : (
                      <Avatar icon={<UserOutlined />} />
                    )}
                    <span style={{ opacity: "0.7", marginLeft: "10px" }}>
                      {item.users && item.users.first_name} {item.users && item.users.last_name}
                    </span>
                  </>
                }
                description={
                  <>
                    <Row>
                      <BankOutlined style={{ marginRight: 8, marginBottom: 15 }} />
                      <Paragraph>
                        Room:{" "}
                        <Text style={{ opacity: "0.9" }} strong>
                          {item.meeting_rooms.name}
                        </Text>
                      </Paragraph>
                    </Row>
                    <Row>
                      <ScheduleOutlined style={{ marginRight: 8, marginBottom: 15 }} />
                      <Paragraph>
                        Participants:{" "}
                        <Text style={{ opacity: "0.9" }} strong>
                          {item.participants}
                        </Text>
                      </Paragraph>
                    </Row>
                    <Row>
                      <ClockCircleOutlined style={{ marginRight: 8, marginBottom: 15 }} />
                      <Paragraph>
                        Reservation:{" "}
                        <Text style={{ opacity: "0.9" }} strong>
                          {new Date(item.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} -{" "}
                          {new Date(item.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        </Text>
                      </Paragraph>
                    </Row>
                    <Row>
                      <InfoCircleOutlined style={{ marginRight: 8, marginBottom: 15 }} />
                      <Paragraph>
                        Additional Info:{" "}
                        {item.additional_info ? (
                          <Text style={{ opacity: "0.9" }} strong>
                            {item.additional_info.length > 80 ? (
                              <>
                                {item.additional_info.slice(0, 80) + "..."}
                                <span
                                  style={{ color: "#1890ff", cursor: "pointer", marginLeft: "10px" }}
                                  onClick={() => handleSeeMore(item.additional_info)}
                                >
                                  See more
                                </span>
                              </>
                            ) : (
                              <>{item.additional_info}</>
                            )}
                          </Text>
                        ) : (
                          <Text style={{ opacity: "0.9" }} strong>
                            No additional information provided
                          </Text>
                        )}
                      </Paragraph>
                    </Row>
                  </>
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
      </Content>
    </Spin>
  )
}

export default PendingReservations
