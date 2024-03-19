import { useCallback, useEffect, useState } from "react"
import { Spin, Row, Col, Carousel, Tag, Form, Input, Button, DatePicker, InputNumber, message, Collapse, Typography, Tooltip, Divider } from "antd"
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../../../axios"
import "./RoomDetails.css"

const { TextArea } = Input
const { RangePicker } = DatePicker

const RoomDetails = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [reservedDates, setReservedDates] = useState([])

  const [reservationForm] = Form.useForm()
  const params = useParams()
  const navigate = useNavigate()

  const fetchMeetingRooms = async () => {
    try {
      await axios
        .get(`/meeting_rooms/${params.id}`)
        .then((res) => {
          setData(res.data)
          console.log(res.data)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
    } catch (error) {
      console.error("Error occurred while fetching meeting rooms:", error)
    }
  }

  const fetchReservedDates = async () => {
    try {
      await axios
        .get(`/reservations/${params.id}`)
        .then((res) => {
          setReservedDates(res.data.reservations)
          console.log(res.data)
          setLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
    } catch (error) {
      console.error("Error occurred while fetching reserved dates:", error)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchMeetingRooms()
    fetchReservedDates()
  }, [])

  const onFinish = async (values) => {
    try {
      values.meeting_rooms = params.id
      values.users = JSON.parse(localStorage.getItem("user"))._id
      values.reservation_range = values.reservation_range.map((date) => date.$d)
      await axios
        .post("/reservations", values)
        .then((res) => {
          console.log(res)
          message.success(res.data.message)
          navigate("/")
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.error("Error occurred while submitting reservation:", error)
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
    <Spin spinning={loading} tip="Loading...">
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
          <Row style={{ background: "#f0f2f5", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <Col span={24}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", marginTop: "10px" }}>
                <div>
                  <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
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
                  </h1>
                  <span style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>Capacity: {data.meeting_room.capacity}</span>
                </div>
              </div>

              <div>
                {data.categories.map((item) => (
                  <Tag color={item.color} key={item._id} style={{ marginRight: "8px" }}>
                    {item.name}
                  </Tag>
                ))}
              </div>
              <Divider />
              <div>
                <p style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "0" }}>{data.meeting_room.description}</p>
              </div>
            </Col>
          </Row>

          <Row style={{ marginTop: "20px" }}>
            <Col span={24}>
              <Collapse
                items={[
                  {
                    key: "1",
                    label: "Materials of this room",
                    children: (
                      <ul>
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
          <Row style={{ background: "#f0f2f5", padding: "20px", marginTop: "20px" }}>
            <Col span={24}>
              <Typography.Title level={3}>Reservation Form</Typography.Title>
              <Form form={reservationForm} name="reservation-form" onFinish={onFinish} layout="vertical">
                <Form.Item
                  name="participants"
                  label="Number of Participants"
                  rules={[
                    { required: true, message: "Please input number of participants" },
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
                  <InputNumber disabled={data.meeting_room.availability ? false : true} min={1} />
                </Form.Item>
                <Form.Item
                  name="reservation_range"
                  label="Reservation Date & Time"
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
                    disabled={data.meeting_room.availability ? false : true}
                    cellRender={cellRender}
                    disabledDate={(current) => {
                      const reservationsFiltered = reservedDates.filter((reservation) => reservation.status !== "rejected")
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
                <Form.Item name="additional_info" label="Additional Information">
                  <TextArea disabled={data.meeting_room.availability ? false : true} rows={4} />
                </Form.Item>
                <Form.Item>
                  <Button disabled={data.meeting_room.availability ? false : true} type="primary" htmlType="submit">
                    Submit Reservation
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </>
      )}
    </Spin>
  )
}

export default RoomDetails
