import { useEffect, useState } from "react"
import { List, Spin, Button, Space, message, Pagination } from "antd"
import { DislikeOutlined, LikeOutlined } from "@ant-design/icons"
import axios from "../../../../axios"

const PendingReservations = () => {
  const [loading, setLoading] = useState(false)
  const [reservations, setReservations] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchReservations = async (page) => {
    try {
      setLoading(true)
      const response = await axios.get(`/reservations/state/pendings?page=${page}`)
      setReservations(response.data.reservations)
      setTotalPages(response.data.totalPages)
      setLoading(false)
    } catch (error) {
      console.error("Error occurred while fetching pending reservations:", error)
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
    setLoading(true)
    await axios
      .put(`/reservations/state/decision/${item._id}`, { state: 1 })
      .then((res) => {
        console.log(res)
        message.success(res.data.message)
        fetchReservations()
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        message.error(err.message)
        setLoading(false)
      })
  }

  const declineReservation = async (item) => {
    setLoading(true)
    await axios
      .put(`/reservations/state/decision/${item._id}`, { state: 0 })
      .then((res) => {
        console.log(res)
        message.success(res.data.message)
        fetchReservations()
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        message.error(err.message)
        setLoading(false)
      })
  }
  /* const [loading, setLoading] = useState(false)
  const [reservations, setReservations] = useState([])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      await axios
        .get("/reservations/state/pendings")
        .then((res) => {
          console.log(res)
          setReservations(res.data.reservations)
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
    fetchReservations()
  }, [])

  const confirmReservation = async (item) => {
    setLoading(true)
    await axios.put(`/reservations/state/decision/${item._id}`, { state: 1 })
      .then((res) => {
        console.log(res)
        message.success(res.data.message)
        fetchReservations()
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        message.error(err.message)
        setLoading(false)
      })
  }

  const declineReservation = async (item) => {
    setLoading(true)
    await axios.put(`/reservations/state/decision/${item._id}`, { state: 0 })
      .then((res) => {
        console.log(res)
        message.success(res.data.message)
        fetchReservations()
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        message.error(err.message)
        setLoading(false)
      })
  } */

  return (
    <>
      {loading ? (
        <Spin spinning={loading} tip="Loading...">
          <div style={{ height: "100vh" }}></div>
        </Spin>
      ) : (
        <Spin spinning={loading} tip="Loading...">
          <div style={{ width: "80%", margin: "auto", padding: "10px", marginTop: "20px" }}>
            <List
              itemLayout="vertical"
              size="large"
              dataSource={reservations}
              renderItem={(item) => (
                <List.Item
                  style={{ borderBottom: "1px solid #dbd8d8" }}
                  key={item._id}
                  actions={[
                    <Space key={1} style={{ marginLeft: "50px" }}>
                      <Button icon={<LikeOutlined />} onClick={() => confirmReservation(item)}>
                        Confirm
                      </Button>
                      <Button icon={<DislikeOutlined />} onClick={() => declineReservation(item)}>
                        Decline
                      </Button>
                    </Space>
                  ]}
                  // Other List.Item.Meta and content remain unchanged
                />
              )}
            />
            {totalPages > 0 && (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Pagination
                  current={currentPage}
                  total={totalPages * 10} // Assuming 10 items per page
                  onChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </Spin>
      )}
    </>
  )
}

export default PendingReservations
/*   return (
    <>
      {loading ? <Spin spinning={loading} tip="Loading..."><div style={{ height: "100vh" }}></div></Spin> :
        <Spin spinning={loading} tip="Loading...">
          <div
            style={{
              width: "80%",
              margin: "auto",
              padding: "10px",
              marginTop: "20px"
            }}
          >
            <List
              itemLayout="vertical"
              size="large"
              pagination={{ pageSize: 3 }}
              dataSource={reservations}
              footer={<div><b>ant design</b> footer part</div>}
              renderItem={(item) => (
                <>
                  <List.Item
                    style={{ borderBottom: "1px solid #dbd8d8" }}
                    key={item.title}
                    actions={[
                      <Space key={1} style={{ marginLeft: "50px" }}>
                        <Button icon={<LikeOutlined />} onClick={() => confirmReservation(item)}>Confirm</Button>
                        <Button icon={<DislikeOutlined />} onClick={() => declineReservation(item)}>Decline</Button>
                      </Space>
                    ]}
                    extra={
                      <Carousel style={{ width: "120px", marginTop: "12px" }}>
                        {item.meeting_rooms.images && item.meeting_rooms.images.map((image, index) => (
                          <div key={index}>
                            <img
                              alt={`${image}-${index}`}
                              src={`${process.env.REACT_APP_BACKEND_STATIC_URL}${image}`}
                              style={{ width: '100%' }}
                            />
                          </div>
                        ))}
                      </Carousel>
                    }
                  >
                    <List.Item.Meta
                      avatar={
                        item.users ? (
                          <Avatar src={`${process.env.REACT_APP_BACKEND_STATIC_URL}${item.users.avatar}`} />
                        ) : (
                          <Avatar icon={<UserOutlined />} />
                        )
                      }
                      title={
                        <span style={{ color: "rgba(0, 0, 0, 0.7)" }}>
                          {item.users && item.users.first_name} {item.users && item.users.last_name}
                        </span>
                      }
                      //description={<span>{item.start_date} {item.end_date}</span>}
                      description={
                        <div style={{ color: "rgba(0, 0, 0, 0.6)" }}>
                          <div><span><BankOutlined style={{ marginRight: 8 }} /></span> Room: {item.meeting_rooms.name}</div>
                          <div><span><ScheduleOutlined style={{ marginRight: 8 }} /></span> Participants: {item.participants}</div>
                          <div>
                            <span><ClockCircleOutlined style={{ marginRight: 8 }} /></span> Reservation: {new Date(item.start_date).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })} - {new Date(item.end_date).toLocaleDateString("en-US", { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                      }
                    />
                    {item.content}
                  </List.Item>
                </>
              )}
            />
          </div>
        </Spin>
      }
    </>
  )
}

export default PendingReservations */
