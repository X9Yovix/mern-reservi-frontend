import { useEffect, useState } from "react"
import { Badge, Calendar, Select, Spin, Layout, Row, Typography, Col, Switch, Space, Divider } from "antd"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, registerables } from "chart.js"
import MaterialAvailabilityChart from "./Charts/MaterialAvailabilityChart"
import MeetingRoomCategoriesChart from "./Charts/MeetingRoomCategoriesChart"
import ReservationsOverTimeChart from "./Charts/ReservationsOverTimeChart"
import CardsChart from "./Charts/CardsChart"
import { AnimatePresence, motion } from "framer-motion"
import axios from "../../../axios"
import "./Home.css"

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
    try {
      setLoading(true)
      await axios
        .get("/categories")
        .then((res) => {
          setCategories(res.data.categories)
        })
        .catch((err) => {
          console.error("Error fetching categories:", err)
        })
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRooms = async () => {
    try {
      setLoading(true)
      await axios
        .get("/meeting_rooms")
        .then((res) => {
          const data = res.data.meeting_rooms.map((room) => ({
            value: room._id,
            label: room.name
          }))
          setRooms(data)
        })
        .catch((err) => {
          console.error("Error fetching meeting rooms:", err)
        })
    } catch (error) {
      console.error("Error fetching meeting rooms:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMaterials = async () => {
    try {
      setLoading(true)
      await axios
        .get("/materials")
        .then((res) => {
          setMaterials(res.data.materials)
        })
        .catch((err) => {
          console.error("Error fetching meeting rooms:", err)
        })
    } catch (error) {
      console.error("Error fetching meeting rooms:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMeetingRooms = async () => {
    try {
      setLoading(true)
      await axios
        .get("/meeting_rooms")
        .then((res) => {
          setMeetingRooms(res.data.meeting_rooms)
        })
        .catch((err) => {
          console.error("Error fetching meeting_rooms:", err)
        })
    } catch (error) {
      console.error("Error fetching meeting_rooms:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReservations = async () => {
    try {
      setLoading(true)
      await axios
        .get("/reservations")
        .then((res) => {
          setReservations(res.data.reservations)
        })
        .catch((err) => {
          console.error("Error fetching meeting_rooms:", err)
        })
    } catch (error) {
      console.error("Error fetching meeting_rooms:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReservedDates = async (roomId) => {
    try {
      setLoading(true)
      await axios
        .get(`/reservations/${roomId}`)
        .then((res) => {
          setReservedDates(res.data.reservations)
          setRoom(roomId)
        })
        .catch((err) => {
          console.error("Error fetching reserved dates:", err)
        })
    } catch (error) {
      console.error("Error fetching reserved dates:", error)
    } finally {
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
        <Layout
          style={{
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            padding: "20px",
            borderRadius: "10px",
            background: localStorage.getItem("theme") === "dark" ? "#1a1a24" : "#f0f2f5",
            marginTop: "20px"
          }}
        >
          <Row style={{ paddingBottom: 20 }}>
            <Col span={24}>
              <Title level={3} style={{ margin: 0, paddingBottom: "20px" }}>
                Number of each element
              </Title>
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
        </Layout>
        <Layout
          style={{
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            padding: "20px",
            borderRadius: "10px",
            background: localStorage.getItem("theme") === "dark" ? "#1a1a24" : "#f0f2f5",
            marginTop: "20px"
          }}
        >
          <Row style={{ paddingTop: 20, paddingBottom: 20 }}>
            <Title level={3} style={{ margin: 0, paddingBottom: "20px" }}>
              Reservations Calendar
            </Title>
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
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                  filterSort={(optionA, optionB) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
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
                  <Col style={{ marginBottom: 15 }}>
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
        </Layout>
        <Layout
          style={{
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            padding: "20px",
            borderRadius: "10px",
            background: localStorage.getItem("theme") === "dark" ? "#1a1a24" : "#f0f2f5",
            marginTop: "20px"
          }}
        >
          <Row style={{ paddingTop: 20, paddingBottom: 20 }}>
            <Title level={3} style={{ margin: 0, paddingBottom: "20px" }}>
              Materials Availability
            </Title>
            {materials.length > 0 && <MaterialAvailabilityChart materials={materials} />}
          </Row>
        </Layout>
        <Layout
          style={{
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            padding: "20px",
            borderRadius: "10px",
            background: localStorage.getItem("theme") === "dark" ? "#1a1a24" : "#f0f2f5",
            marginTop: "20px"
          }}
        >
          <Row style={{ paddingTop: 20, paddingBottom: 20 }}>
            <Col span={24}>
              <Title level={3} style={{ margin: 0, paddingBottom: "20px" }}>
                Meeting Room Categories Distribution
              </Title>
              {meetingRooms.length > 0 && <MeetingRoomCategoriesChart meetingRooms={meetingRooms} />}
            </Col>
          </Row>
        </Layout>
        <Layout
          style={{
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            padding: "20px",
            borderRadius: "10px",
            background: localStorage.getItem("theme") === "dark" ? "#1a1a24" : "#f0f2f5",
            marginTop: "20px"
          }}
        >
          <Row style={{ paddingTop: 20, paddingBottom: 20 }}>
            <Col span={24}>
              <Title level={3} style={{ margin: 0, paddingBottom: "20px" }}>
                Confirmed Reservations Over Time
              </Title>
              {reservations.length > 0 && <ReservationsOverTimeChart reservations={reservations} />}
            </Col>
          </Row>
        </Layout>
      </Content>
    </Spin>
  )
}

export default Home
