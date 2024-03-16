import { Card, Carousel, Avatar, Spin, Row, Col, Button } from "antd"
import { useEffect, useState } from "react"
import axios from "../../axios"
import { CalendarOutlined, EllipsisOutlined } from "@ant-design/icons"
const { Meta } = Card

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [meetingRooms, setMeetingRooms] = useState([])
  const fetchMeetingRomms = async () => {
    try {
      setLoading(true)
      await axios
        .get("/meeting_rooms")
        .then((res) => {
          console.log(res)
          setMeetingRooms(res.data.meeting_rooms.filter((meetingRoom) => meetingRoom.availability === true))
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
    fetchMeetingRomms()
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
                <Card
                  hoverable
                  bordered={true}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "0px",
                    paddingTop: "1px",
                    width: 340,
                    margin: "auto",
                    boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px"
                  }}
                  cover={
                    <Carousel autoplay>
                      {meetingRoom.images.map((image, index) => (
                        <div key={index}>
                          <img
                            alt={meetingRoom.name + "-" + index}
                            src={process.env.REACT_APP_BACKEND_STATIC_URL + image}
                            style={{ width: "100%", height: "200px", objectFit: "contain" }}
                          />
                        </div>
                      ))}
                    </Carousel>
                  }
                  actions={[
                    <Button type="dashed" danger ghost shape="round" icon={<EllipsisOutlined />} key="details">
                      Details
                    </Button>,
                    <Button type="primary" ghost shape="round" icon={<CalendarOutlined />} key="reserve">
                      Reserve
                    </Button>
                  ]}
                >
                  <Meta
                    avatar={<Avatar size={40} shape="square" src={process.env.REACT_APP_BACKEND_STATIC_URL + meetingRoom.images[0]} />}
                    title={meetingRoom.name}
                    description={
                      <div style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {meetingRoom.description}
                      </div>
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
