import { useEffect, useState } from "react"
import { Badge, Calendar, Select, Spin, Layout, Row, Typography, Col, Switch, Space, Divider } from "antd"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, registerables } from "chart.js"
import MaterialAvailabilityChart from "./MaterialAvailabilityChart"
import MeetingRoomCategoriesChart from "./MeetingRoomCategoriesChart"
import ReservationsOverTimeChart from "./ReservationsOverTimeChart"
import { AnimatePresence, motion } from "framer-motion"
import axios from "../../../axios"
import "./Home.css"
import CardsChart from "./CardsChart"

const variants = {
  open: { height: "auto", opacity: 1, transition: { duration: 0.6 } },
  closed: { height: 0, opacity: 0, transition: { duration: 0.6 } }
}

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [reservedDates, setReservedDates] = useState([])
  const [rooms, setRooms] = useState([])
  const [room, setRoom] = useState("Select a room")
  const [materials, setMaterials] = useState([])
  const [meetingRooms, setMeetingRooms] = useState([])
  const [reservations, setReservations] = useState([])
  const [categories, setCategories] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, ...registerables)

  const { Content } = Layout
  const { Title, Text } = Typography

  const fetchCategories = async () => {
    setLoading(true)
    try {
      await axios
        .get("/categories")
        .then((response) => {
          setCategories(response.data.categories)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching categories:", error)
          setLoading(false)
        })
    } catch (error) {
      console.error("Error fetching categories:", error)
      setLoading(false)
    }
  }

  const fetchRooms = async () => {
    setLoading(true)
    try {
      await axios
        .get("/meeting_rooms")
        .then((response) => {
          const data = response.data.meeting_rooms.map((room) => ({
            value: room._id,
            label: room.name
          }))
          setRooms(data)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching meeting rooms:", error)
          setLoading(false)
        })
    } catch (error) {
      console.error("Error fetching meeting rooms:", error)
      setLoading(false)
    }
  }

  const fetchMaterials = async () => {
    setLoading(true)
    try {
      await axios
        .get("/materials")
        .then((response) => {
          setMaterials(response.data.materials)
          console.log(response.data.materials)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching meeting rooms:", error)
          setLoading(false)
        })
    } catch (error) {
      console.error("Error fetching meeting rooms:", error)
      setLoading(false)
    }
  }

  const fetchMeetingRooms = async () => {
    setLoading(true)
    try {
      await axios
        .get("/meeting_rooms")
        .then((response) => {
          console.log(response)
          setMeetingRooms(response.data.meeting_rooms)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching meeting_rooms:", error)
          setLoading(false)
        })
    } catch (error) {
      console.error("Error fetching meeting_rooms:", error)
      setLoading(false)
    }
  }

  const fetchReservations = async () => {
    setLoading(true)
    try {
      await axios
        .get("/reservations")
        .then((response) => {
          console.log(response)
          setReservations(response.data.reservations)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching meeting_rooms:", error)
          setLoading(false)
        })
    } catch (error) {
      console.error("Error fetching meeting_rooms:", error)
      setLoading(false)
    }
  }

  const fetchReservedDates = async (roomId) => {
    setLoading(true)
    try {
      await axios
        .get(`/reservations/${roomId}`)
        .then((response) => {
          setReservedDates(response.data.reservations)
          setRoom(roomId)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching reserved dates:", error)
          setLoading(false)
        })
    } catch (error) {
      console.error("Error fetching reserved dates:", error)
      setLoading(false)
    }
  }

  const handleRoomChange = (value) => {
    fetchReservedDates(value)
  }

  useEffect(() => {
    fetchRooms()
    fetchMaterials()
    fetchMeetingRooms()
    fetchReservations()
    fetchCategories()
  }, [])

  const getMonthData = (value) => {
    const month = value.month() + 1
    const pendingReservationsInMonth = reservations.filter((reservation) => {
      const startDate = new Date(reservation.start_date)
      const reservationMonth = startDate.getMonth() + 1
      return reservationMonth === month && reservation.status === "pending"
    })
    return pendingReservationsInMonth.length
  }
  const monthCellRender = (value) => {
    const num = getMonthData(value)
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Pending Reservations</span>
      </div>
    ) : null
  }

  const getListData = (value) => {
    const date = value.toDate()
    const month = date.getMonth() + 1

    const reservedEvents = reservedDates.filter((reservation) => {
      const startDate = new Date(reservation.start_date)
      const endDate = new Date(reservation.end_date)

      const startMonth = startDate.getMonth() + 1
      const endMonth = endDate.getMonth() + 1

      return month >= startMonth && month <= endMonth && date >= startDate && date <= endDate
    })
    let listData = []
    reservedEvents.forEach((reservation) => {
      let type = ""
      switch (reservation.status) {
        case "rejected":
          type = "error"
          break
        case "pending":
          type = "processing"
          break
        case "confirmed":
          type = "success"
          break
        case "canceled":
          type = "warning"
          break
        default:
          break
      }
      listData.push({
        type: type
        //content: reservation.status
        //content: `Reserved (${reservation.status})`
      })
    })
    return listData
  }
  const dateCellRender = (value) => {
    const listData = getListData(value)
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    )
  }
  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current)
    if (info.type === "month") return monthCellRender(current)
    return info.originNode
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
        <Row style={{ paddingBottom: 20 }}>
          <Col span={24}>
            <Title level={3}>Number of each element</Title>
          </Col>
          <Col span={24}>
            {meetingRooms.length > 0 && (
              <CardsChart
                rooms={meetingRooms.length}
                users={meetingRooms.length}
                materials={materials.length}
                categories={categories.length}
                reservations={reservations.length}
              />
            )}
          </Col>
        </Row>
        <Row style={{ paddingTop: 20, paddingBottom: 20 }}>
          <Title level={3}>Reservations Calendar</Title>
        </Row>
        <Row>
          <Col span={12}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Text style={{ marginRight: "10px", marginBottom: "0" }}>Select room to view reserved dates</Text>
              <Select
                showSearch
                defaultValue={room}
                onSelect={handleRoomChange}
                style={{ width: 150 }}
                filterOption={(input, option) => (option?.label ?? "").includes(input)}
                options={rooms}
              />
            </div>
          </Col>
          <Col span={12} style={{ display: "flex", justifyContent: "flex-end" }}>
            <Switch
              checkedChildren="Hide the calendar"
              unCheckedChildren="Show the calendar"
              defaultChecked={false}
              onClick={() => {
                setIsOpen((isOpen) => !isOpen)
              }}
            />
          </Col>
        </Row>
        <Row>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="calendar-container"
                variants={variants}
                initial="closed"
                animate="open"
                exit="closed"
                style={{ overflow: "hidden" }}
              >
                <Col>
                  <Divider />
                  <Space size={"large"}>
                    <Badge status="success" text="Confirmed" />
                    <Badge status="processing" text="Pending" />
                    <Badge status="error" text="Rejected" />
                    <Badge status="warning" text="Canceled" />
                  </Space>
                </Col>
                <Col>{room !== "Select a room" && <Calendar cellRender={cellRender} />}</Col>
              </motion.div>
            )}
          </AnimatePresence>
        </Row>
        <Row style={{ paddingTop: 20, paddingBottom: 20 }}>
          <Title level={3}>Materials Availability</Title>
          {materials.length > 0 && <MaterialAvailabilityChart materials={materials} />}
        </Row>
        <Row style={{ paddingTop: 20, paddingBottom: 20 }}>
          <Col span={24}>
            <Title level={3}>Meeting Room Categories Distribution</Title>
            {meetingRooms.length > 0 && <MeetingRoomCategoriesChart meetingRooms={meetingRooms} />}
          </Col>
        </Row>
        <Row style={{ paddingTop: 20, paddingBottom: 20 }}>
          <Col span={24}>
            <Title level={3}>Reservations Over Time</Title>
            {reservations.length > 0 && <ReservationsOverTimeChart reservations={reservations} />}
          </Col>
        </Row>
      </Content>
    </Spin>
  )
}

export default Home
