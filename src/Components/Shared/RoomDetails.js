import { useEffect, useState } from "react"
import { Spin, Row, Col, Carousel, Tag, Form, Input, Button, DatePicker, InputNumber, message, Collapse, Typography } from "antd"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../../axios"

const { TextArea } = Input
const { RangePicker } = DatePicker

const RoomDetails = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [selectedStartDate, setSelectedStartDate] = useState(null)
  const [disabledDateEnd, setDisabledDateEnd] = useState(true)

  const [reservationForm] = Form.useForm()
  const params = useParams()
  const navigate = useNavigate()

  const fetchMeetingRooms = async () => {
    setLoading(true)
    try {
      await axios
        .get(`/meeting_rooms/${params.id}`)
        .then((res) => {
          setData(res.data)
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
    fetchMeetingRooms()
  }, [])

  const onFinish = async (values) => {
    try {
      values.room_id = params.id
      values.reservationDateTime = values.reservationDateTime.map((date) => date.$d)
      await axios
        .post("/reservation", values)
        .then((res) => {
          console.log(res)
          message.success("Reservation submitted successfully")
          navigate("/")
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.error("Error occurred while submitting reservation:", error)
    }
  }

  return (
    <Spin spinning={loading} tip="Loading...">
      {data && (
        <>
          <Row gutter={[16, 16]}>
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
          <Row gutter={[16, 16]} style={{ background: "#f0f2f5", padding: "20px" }}>
            <Col span={24}>
              <h1>{data.meeting_room.name}</h1>
              <p>
                {data.categories.map((item) => (
                  <Tag color={item.color} key={item._id}>
                    {item.name}
                  </Tag>
                ))}
              </p>
              <p>Capacity of this room: {data.meeting_room.capacity}</p>
              <p>{data.meeting_room.description}</p>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
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
          <Row gutter={[16, 16]} style={{ background: "#f0f2f5", padding: "20px", marginTop: "20px" }}>
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
                  <InputNumber min={1} />
                </Form.Item>
                <Form.Item
                  name="reservation_range"
                  label="Reservation Date & Time"
                  rules={[{ required: true, message: "Please select reservation date and time" }]}
                >
                  <RangePicker
                    showTime
                    disabledDate={
                      disabledDateEnd
                        ? () => true
                        : (current) => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            return disabledDateEnd || (current && current < today)
                          }
                    }
                    onFocus={(_, i) => {
                      //console.log(i)
                      if (i.range === "end") {
                        setDisabledDateEnd(true)
                      }
                      if (i.range === "end" && selectedStartDate) {
                        setDisabledDateEnd(false)
                      }
                      if (i.range === "start") {
                        setDisabledDateEnd(false)
                      }
                    }}
                    onCalendarChange={(dates) => {
                      //console.log("hna", dates[0].$d)
                      //if (dates && dates.length > 0) {
                      //if (dates && dates[0].$d) {
                      if (dates[0] && dates[0].$d) {
                        setSelectedStartDate(dates[0].toDate())
                      }
                    }}
                    disabledTime={(selectedDate, type) => {
                      if (type === "start") {
                        /* const currentHourStart = new Date().getHours() + 1
                        return {
                          disabledHours: () => [...Array(currentHourStart).keys()]
                        } */
                        //
                        const currentHour = new Date().getHours() + 1
                        const disabledStartHours = selectedDate.$d.getDate() === new Date().getDate() ? [...Array(currentHour).keys()] : []

                        return {
                          disabledHours: () => disabledStartHours
                        }
                      } else if (type === "end" && !selectedStartDate) {
                        return {
                          disabledHours: () => [...Array(24).keys()],
                          disabledMinutes: () => [...Array(60).keys()],
                          disabledSeconds: () => [...Array(60).keys()]
                        }
                      } else if (type === "end" && selectedStartDate) {
                        /* const startHour = selectedStartDate.getHours() + 1
                        return {
                          disabledHours: () => [...Array(startHour).keys()]
                        } */
                        const selectedHour = selectedStartDate.getHours() + 1
                        const disabledEndHours = selectedDate.$d.getDate() === new Date().getDate() ? [...Array(selectedHour).keys()] : []

                        return {
                          disabledHours: () => disabledEndHours
                        }
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item name="additional_info" label="Additional Information">
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
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
