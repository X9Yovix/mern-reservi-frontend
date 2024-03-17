import { Card, Carousel, Spin, Row, Col, Button } from "antd"
import { useEffect, useState } from "react"
import axios from "../../../axios"
import { CalendarOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom"
import "./Home.css"
const { Meta } = Card

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [meetingRooms, setMeetingRooms] = useState([])

  const fetchMeetingRooms = async () => {
    try {
      setLoading(true)
      await axios
        .get("/meeting_rooms")
        .then((res) => {
          console.log(res)
          //setMeetingRooms(res.data.meeting_rooms.filter((meetingRoom) => meetingRoom.availability === true))
          setMeetingRooms(res.data.meeting_rooms)
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

  const renderForm = () => {
    return (
      <div style={{ background: "#f0f2f5", padding: "20px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Meeting Rooms</h1>
        <Row
          style={{
            margin: "auto",
            width: "100%"
          }}
        >
          {meetingRooms.map((meetingRoom, index) => (
            <Col span={8} key={index}>
              <div style={{ padding: "10px" }}>
                <Card bordered={true} className="room-card">
                  <Carousel autoplay>
                    {meetingRoom.images.map((image, index) => (
                      <div key={index}>
                        <img alt={meetingRoom.name + "-" + index} src={process.env.REACT_APP_BACKEND_STATIC_URL + image} className="carousel-image" />
                      </div>
                    ))}
                  </Carousel>
                  <Meta
                    description={
                      <Link to={`/rooms/details/${meetingRoom._id}`} className="room-link">
                        <Button icon={<CalendarOutlined />} className="discover-button">
                          Discover the room
                        </Button>
                      </Link>
                    }
                  />
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    )
  }

  return <>{loading ? <Spin tip="Loading...">{renderForm()}</Spin> : renderForm()}</>
}

export default Home
