import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Card, Carousel, Spin, Row, Col, Button, Pagination, Layout, Typography, theme } from "antd"
import { CalendarOutlined } from "@ant-design/icons"
import axios from "../../../axios"
import "./Home.css"

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [meetingRooms, setMeetingRooms] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const {
    token: { colorBgContainer }
  } = theme.useToken()
  const { Meta } = Card
  const { Content } = Layout
  const { Title } = Typography

  const fetchMeetingRooms = async (page) => {
    try {
      setLoading(true)
      await axios
        .get(`/meeting_rooms/method/pagination?page=${page}`)
        .then((res) => {
          setMeetingRooms(res.data.meeting_rooms)
          setTotalPages(res.data.total_pages)
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

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    fetchMeetingRooms(currentPage)
  }, [currentPage])

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
          <Title style={{ textAlign: "center", marginBottom: "10px" }}>Meeting Rooms</Title>
          <Row
            style={{
              margin: "auto",
              width: "100%"
            }}
          >
            {meetingRooms.map((meetingRoom, index) => (
              <Col span={8} key={index}>
                <div style={{ padding: "30px" }}>
                  <Card bordered={true} className="room-card">
                    <Carousel autoplay>
                      {meetingRoom.images.map((image, index) => (
                        <div key={index}>
                          <img
                            alt={meetingRoom.name + "-" + index}
                            src={process.env.REACT_APP_BACKEND_STATIC_URL + image}
                            className="carousel-image"
                          />
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
          <Row>
            <Col span={24}>
              {totalPages > 0 && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <Pagination current={currentPage} total={totalPages * 10} onChange={handlePageChange} />
                </div>
              )}
            </Col>
          </Row>
        </Content>
      </Spin>
    </Layout>
  )
}

export default Home
