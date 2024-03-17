import { useCallback, useEffect, useState } from "react"
import { Spin, Row, Col, Carousel, Tag, Form, Input, Button, DatePicker, InputNumber, message, Collapse, Typography } from "antd"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../../../axios"
import "./RoomDetails.css"
const { TextArea } = Input
const { RangePicker } = DatePicker

const RoomDetails = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  //usefull with time picker
  //const [selectedStartDate, setSelectedStartDate] = useState(null)
  //const [disabledDateEnd, setDisabledDateEnd] = useState(true)
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

      const isReserved = reservedDates.some((reservation) => {
        const startDate = new Date(reservation.start_date).setHours(0, 0, 0, 0)
        const endDate = new Date(reservation.end_date).setHours(0, 0, 0, 0)
        return date && new Date(date).getTime() >= startDate && new Date(date).getTime() <= endDate
      })

      const style = { backgroundColor: "darkred", color: "white" }

      return (
        <div className="ant-picker-cell-inner" style={isReserved ? style : {}}>
          {date.date()}
        </div>
      )
    },
    [reservedDates]
  )

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
                  rules={[
                    { required: true, message: "Please select reservation date and time" },
                    ({ getFieldValue }) => ({
                      validator() {
                        const selectedDates = getFieldValue("reservation_range")
                        const selectedRange = [selectedDates[0].toDate(), selectedDates[1].toDate()]

                        for (const reservation of reservedDates) {
                          const startDate = new Date(reservation.start_date)
                          const endDate = new Date(reservation.end_date)

                          if (
                            (selectedRange[0] >= startDate && selectedRange[0] <= endDate) ||
                            (selectedRange[1] >= startDate && selectedRange[1] <= endDate) ||
                            (selectedRange[0] <= startDate && selectedRange[1] >= endDate)
                          ) {
                            return Promise.reject("Selected date range is overlapping with an existing reservation")
                          }
                        }
                        return Promise.resolve()
                      }
                    })
                  ]}
                >
                  <RangePicker
                    /* showTime={{ format: 'HH:mm' }} */
                    /* disabledDate={
                      disabledDateEnd
                        ? () => true
                        : (current) => {
                          const today = new Date()
                          today.setHours(0, 0, 0, 0)
                          return disabledDateEnd || (current && current < today)
                        }
                    } */
                    /* cellRender={(date) => {
                      for (const reservation of reservedDates) {
                        const startDate = new Date(reservation.start_date).setHours(0, 0, 0, 0);
                        const endDate = new Date(reservation.end_date).setHours(0, 0, 0, 0);
                        if (date && (new Date(date.$d) >= startDate && new Date(date.$d) <= endDate)) {
                          return (
                            <div className="reserved-date">
                              <span>{date.$D}</span>
                            </div>
                          );
                        }
                      }
                      return (
                        <div className="normal-date">
                          <span>{date.$D}</span>
                        </div>
                      );
                    }} */
                    cellRender={cellRender}
                    disabledDate={
                      /* 
                      // usefull with time picker
                      disabledDateEnd
                        ? () => true
                        : */
                      (current) => {
                        for (const reservation of reservedDates) {
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
                      }
                    }
                    // usefull with time picker
                    /* onFocus={(_, i) => {
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

                      if (dates[0] && dates[0].$d) {
                        //setSelectedStartDate(dates[0].toDate())
                        setSelectedStartDate(new Date(dates[0].$d))
                      }
                    }} */
                    /* disabledTime={(selectedDate, type) => {
                    if (type === "start") {
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
                      const selectedHour = selectedStartDate.getHours() + 1
                      const disabledEndHours = selectedDate.$d.getDate() === new Date().getDate() ? [...Array(selectedHour).keys()] : []

                      return {
                        disabledHours: () => disabledEndHours
                      }
                    }
                  }} */
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
