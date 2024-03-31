import { useCallback, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Spin,
  Row,
  Col,
  Carousel,
  Tag,
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Typography,
  Tooltip,
  Divider,
  message,
  Collapse,
  theme,
  Layout,
  Modal
} from "antd"
import { CheckCircleOutlined, CloseCircleOutlined, SubnodeOutlined } from "@ant-design/icons"
import { jwtDecode } from "jwt-decode"
import axios from "../../../axios"
import "./RoomDetails.css"

const RoomDetails = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [reservedDates, setReservedDates] = useState([])
  const [modalVisible, setModalVisible] = useState(false)

  const showModal = () => {
    setModalVisible(true)
  }

  const hideModal = () => {
    setModalVisible(false)
  }
  const ellipsis = {
    rows: 7,
    expandable: false,
    symbol: "...",
    suffix: (
      <Button key="btn-more" type="link" onClick={showModal}>
        more
      </Button>
    )
  }

  const [messageApi, contextHolder] = message.useMessage()

  const {
    token: { colorBgContainer }
  } = theme.useToken()
  const { Content } = Layout
  const { Title, Paragraph } = Typography
  const { TextArea } = Input
  const { RangePicker } = DatePicker

  const [reservationForm] = Form.useForm()
  const params = useParams()
  const navigate = useNavigate()

  const fetchMeetingRoom = async () => {
    try {
      setLoading(true)
      await axios
        .get(`/meeting_rooms/${params.id}`)
        .then((res) => {
          setData(res.data)
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

  const fetchReservedDates = async () => {
    try {
      setLoading(true)
      await axios
        .get(`/reservations/${params.id}`)
        .then((res) => {
          setReservedDates(res.data.reservations)
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.error("Error occurred while fetching reserved dates:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchMeetingRoom()
    fetchReservedDates()
  }, [])

  const onFinish = async (values) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (token) {
        const decodedToken = jwtDecode(token)
        const userId = decodedToken._id
        values.meeting_rooms = params.id
        values.users = userId
        values.reservation_range = values.reservation_range.map((date) => date.$d)
        await axios
          .post("/reservations", values)
          .then((res) => {
            localStorage.setItem("reservation_message", res.data.message)
            navigate("/reservations")
          })
          .catch((err) => {
            console.log(err)
            messageApi.error(err.response.data.error)
          })
      }
    } catch (error) {
      console.error("Error occurred while submitting reservation:", error)
    } finally {
      setLoading(false)
    }
  }

  const cellRender = useCallback(
    (date, info) => {
      if (info.type !== "date") {
        return info.originNode
      }
      if (typeof date === "number") {
        return <div className="ant-picker-cell-inner">{date}</div>
      }

      const reservedPendingDates = reservedDates.filter((reservation) => reservation.status === "pending")
      const isPending = reservedPendingDates.some((reservation) => {
        const startDate = new Date(reservation.start_date).setHours(0, 0, 0, 0)
        const endDate = new Date(reservation.end_date).setHours(0, 0, 0, 0)
        return date && new Date(date).getTime() >= startDate && new Date(date).getTime() <= endDate
      })

      const reservedAcceptedDates = reservedDates.filter((reservation) => reservation.status === "confirmed")
      const isReserved = reservedAcceptedDates.some((reservation) => {
        const startDate = new Date(reservation.start_date).setHours(0, 0, 0, 0)
        const endDate = new Date(reservation.end_date).setHours(0, 0, 0, 0)
        return date && new Date(date).getTime() >= startDate && new Date(date).getTime() <= endDate
      })

      const styleIsPending = { backgroundColor: "darkred", color: "white" }
      const styleIsReserved = { backgroundColor: "green", color: "white" }

      const cellStyle = isPending ? styleIsPending : isReserved ? styleIsReserved : {}

      return (
        <div className="ant-picker-cell-inner" style={cellStyle}>
          {date.date()}
        </div>
      )
    },
    [reservedDates]
  )

  return (
    <Layout
      style={{
        background: colorBgContainer,
        minHeight: "95vh"
      }}
    >
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
          {data && reservedDates && (
            <>
              <Row>
                <Col span={24}>
                  <Carousel autoplay>
                    {data.meeting_room.images.map((image, index) => (
                      <div key={index}>
                        <img
                          alt={image + "-" + index}
                          src={process.env.REACT_APP_BACKEND_STATIC_URL + image}
                          style={{ width: "100%", height: "450px", objectFit: "contain" }}
                        />
                      </div>
                    ))}
                  </Carousel>
                </Col>
              </Row>
              <Row
                style={{
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  padding: "20px",
                  borderRadius: "10px",
                  background: localStorage.getItem("theme") === "dark" ? "#1a1a24" : "#f0f2f5",
                  marginTop: "20px"
                }}
              >
                <Col span={5}>
                  <Title style={{ fontWeight: "bold", margin: 0 }}>
                    {data.meeting_room.name}
                    {data.meeting_room.availability ? (
                      <Tooltip title="This room is currently available for reservation">
                        <CheckCircleOutlined style={{ fontSize: "16px", color: "#87d068", marginLeft: "8px" }} />
                      </Tooltip>
                    ) : (
                      <Tooltip title="This room is currently unavailable for reservation">
                        <CloseCircleOutlined style={{ fontSize: "16px", color: "#f50", marginLeft: "8px" }} />
                      </Tooltip>
                    )}
                  </Title>
                  <div style={{ marginTop: "20px" }}>
                    {data.categories.map((item) => (
                      <Tag color={item.color} key={item._id} style={{ marginRight: "8px", marginTop: "8px" }}>
                        {item.name}
                      </Tag>
                    ))}
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <Title level={5} style={{ margin: 0 }}>
                      Capacity of this room: {data.meeting_room.capacity}
                    </Title>
                  </div>
                </Col>
                <Col span={14}>
                  <div style={{ marginTop: "20px" }}>
                    <Paragraph ellipsis={ellipsis}>{data.meeting_room.description}</Paragraph>
                  </div>
                  <Modal title="Full Description" open={modalVisible} onCancel={hideModal} footer={null}>
                    <Paragraph>{data.meeting_room.description}</Paragraph>
                  </Modal>
                </Col>
                <Col span={1}>
                  <Divider type="vertical" style={{ height: "100%" }} />
                </Col>
                <Col span={4}>
                  <Collapse
                    size="small"
                    items={[
                      {
                        key: "1",
                        label: "Materials of this room",
                        children: (
                          <ul className="list-materials">
                            {data.materials.map((material, index) => {
                              const roomMaterial = data.meeting_room.materials.find((roomMat) => roomMat._id === material._id)
                              if (roomMaterial) {
                                material.reservedQuantity = roomMaterial.reservedQuantity
                              }
                              return (
                                <li key={index}>
                                  {material.name} x {material.reservedQuantity || 0}
                                </li>
                              )
                            })}
                          </ul>
                        )
                      }
                    ]}
                  />
                </Col>
              </Row>
              {data.meeting_room.availability ? (
                <Row
                  style={{
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    padding: "20px",
                    borderRadius: "10px",
                    background: localStorage.getItem("theme") === "dark" ? "#1a1a24" : "#f0f2f5",
                    marginTop: "20px"
                  }}
                >
                  <Col span={24}>
                    <Title level={3} style={{ margin: 0 }}>
                      Reservation Form
                    </Title>
                    <Form
                      form={reservationForm}
                      name="reservation-form"
                      onFinish={onFinish}
                      layout="horizontal"
                      style={{ marginTop: "15px" }}
                      //disabled={data.meeting_room.availability ? false : true}
                    >
                      <Row>
                        <Col span={5}>
                          <Form.Item
                            name="participants"
                            label="Number of Participants"
                            colon={false}
                            rules={[
                              { required: true, message: "Number of participants is required" },
                              { type: "number", min: 1, message: "Number of participants must be at least 1" },
                              () => ({
                                validator(_, value) {
                                  if (value && value > data.meeting_room.capacity) {
                                    return Promise.reject(`Number of participants cannot exceed ${data.meeting_room.capacity}`)
                                  }
                                  return Promise.resolve()
                                }
                              })
                            ]}
                          >
                            <InputNumber min={1} />
                          </Form.Item>
                        </Col>
                        <Col span={10}>
                          <Form.Item
                            labelCol={{
                              span: 10
                            }}
                            wrapperCol={{
                              span: 12
                            }}
                            name="reservation_range"
                            label="Reservation Date & Time"
                            colon={false}
                            rules={[
                              { required: true, message: "Please select reservation date and time" },
                              ({ getFieldValue }) => ({
                                validator() {
                                  const selectedDates = getFieldValue("reservation_range")
                                  if (!selectedDates || !selectedDates[0] || !selectedDates[1]) {
                                    return Promise.resolve()
                                  }
                                  const selectedRange = [selectedDates[0].toDate(), selectedDates[1].toDate()]

                                  for (const reservation of reservedDates) {
                                    const startDate = new Date(reservation.start_date)
                                    const endDate = new Date(reservation.end_date)

                                    if (
                                      (selectedRange[0] >= startDate && selectedRange[0] <= endDate) ||
                                      (selectedRange[1] >= startDate && selectedRange[1] <= endDate) ||
                                      (selectedRange[0] <= startDate && selectedRange[1] >= endDate)
                                    ) {
                                      if (reservation.status === "pending" || reservation.status === "confirmed") {
                                        return Promise.reject("Selected date range is overlapping with an existing reservation")
                                      }
                                    }
                                  }
                                  return Promise.resolve()
                                }
                              })
                            ]}
                          >
                            <RangePicker
                              cellRender={cellRender}
                              disabledDate={(current) => {
                                const reservationsFiltered = reservedDates.filter(
                                  (reservation) => reservation.status !== "rejected" && reservation.status !== "canceled"
                                )
                                for (const reservation of reservationsFiltered) {
                                  const startDate = new Date(reservation.start_date).setHours(0, 0, 0, 0)
                                  const endDate = new Date(reservation.end_date).setHours(0, 0, 0, 0)
                                  if (current && new Date(current.$d) >= startDate && new Date(current.$d) <= endDate) {
                                    return true
                                  }
                                }
                                //const today = new Date().setHours(0, 0, 0, 0)
                                const today = new Date()
                                if (current < today) {
                                  return true
                                }
                                return false
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={9}>
                          <Form.Item ame="additional_info" label="Additional Information" colon={false}>
                            <TextArea rows={1} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <Form.Item style={{ textAlign: "center", marginTop: "10px" }}>
                            <Button htmlType="submit" icon={<SubnodeOutlined />}>
                              Submit Reservation
                            </Button>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Row>
              ) : null}
            </>
          )}
        </Content>
      </Spin>
    </Layout>
  )
}

export default RoomDetails
