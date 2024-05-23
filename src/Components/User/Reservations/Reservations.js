import { useCallback, useEffect, useState } from "react"
import {
  Spin,
  Tag,
  Form,
  Button,
  DatePicker,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Table,
  Space,
  theme,
  Layout,
  message,
  Typography,
  Row,
  Col,
  Divider
} from "antd"
import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons"
import axios from "../../../axios"
import dayjs from "dayjs"
import { jwtDecode } from "jwt-decode"
import "./Reservations.css"

const { TextArea } = Input
const { RangePicker } = DatePicker

const Reservations = () => {
  const [loading, setLoading] = useState(false)
  const [reservations, setReservations] = useState([])
  const [additionalInfo, setAdditionalInfo] = useState(null)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editReservation, setEditReservation] = useState(null)
  const [reservedDates, setReservedDates] = useState([])

  const [messageApi, contextHolder] = message.useMessage()
  const [editReservationForm] = Form.useForm()
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  const { Content } = Layout
  const { Title } = Typography

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, { room }) => <a href={`${process.env.REACT_APP_BASE_URL}/rooms/details/${room[0]}`}>{room[1]}</a>
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      render: (_, { categories }) => (
        <>
          {categories &&
            categories.map((category) => {
              return <Tag key={category._id}>{category.name.toUpperCase()}</Tag>
            })}
        </>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <>
          {status == "pending" ? (
            <Tag color="blue">Pending</Tag>
          ) : status == "confirmed" ? (
            <Tag color="green">Approved</Tag>
          ) : status == "rejected" ? (
            <Tag color="red">Rejected</Tag>
          ) : (
            <Tag color="orange">Canceled</Tag>
          )}
        </>
      )
    },
    {
      title: "Participants",
      dataIndex: "participants",
      key: "participants"
    },
    {
      title: "Start date",
      dataIndex: "start_date",
      key: "start_date"
    },
    {
      title: "End date",
      dataIndex: "end_date",
      key: "end_date"
    },
    {
      title: "Additional Information",
      dataIndex: "additional_info",
      key: "additional_info",
      render: (_, { additional_info }) =>
        additional_info && additional_info.length > 0 ? (
          <Button type="text" onClick={() => handleAdditionalInfo(additional_info)}>
            View Info
          </Button>
        ) : (
          "No additional information"
        )
    },

    {
      title: "Action",
      key: "action",
      render: (_, item) =>
        item.status === "pending" && (
          <Space size="middle">
            <Button className="decline-btn" icon={<CloseCircleOutlined />} onClick={() => handleCancelRequest(item.key)}>
              Cancel
            </Button>
            <Button icon={<EditOutlined />} onClick={() => handleUpdate(item)}>
              Update
            </Button>
          </Space>
        )
    }
  ]

  const handleAdditionalInfo = (additional_info) => {
    setAdditionalInfo(additional_info)
  }

  const handleCloseModal = () => {
    setAdditionalInfo(null)
  }

  //fetch
  const fetchUserReservations = async (page) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (token) {
        const decodedToken = jwtDecode(token)
        const userId = decodedToken._id
        await axios
          .get(`reservations/user/${userId}?page=${page}`)
          .then((res) => {
            const data = []
            res.data.reservations.map((reservation) => {
              data.push({
                key: reservation._id,
                room: [reservation.meeting_rooms._id, reservation.meeting_rooms.name],
                categories: reservation.meeting_rooms.categories,
                capacity: reservation.meeting_rooms.capacity,
                start_date: new Date(reservation.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
                end_date: new Date(reservation.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
                participants: reservation.participants,
                additional_info: reservation.additional_info,
                status: reservation.status
              })
            })
            setReservations(data)
            setTotalPages(res.data.total_pages)
          })
          .catch((error) => {
            console.error(error)
          })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    fetchUserReservations(currentPage)
    const reservation_message = localStorage.getItem("reservation_message")
    if (reservation_message) {
      messageApi.success(reservation_message)
      localStorage.removeItem("reservation_message")
    }
  }, [currentPage])

  //update
  const fetchReservedDates = async (roomId) => {
    try {
      setLoading(true)
      await axios
        .get(`/reservations/${roomId}`)
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

  const cellRender = useCallback(
    (date, info) => {
      if (info.type !== "date") {
        return info.originNode
      }
      if (typeof date === "number") {
        return <div className="ant-picker-cell-inner">{date}</div>
      }

      const reservedPendingDates = reservedDates.filter((reservation) => reservation.status === "pending" && reservation._id !== editReservation.key)
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

  const handleUpdate = (item) => {
    const formattedStartDate = dayjs(item.start_date)
    const formattedEndDate = dayjs(item.end_date)
    const updatedItem = {
      ...item,
      start_date: formattedStartDate,
      end_date: formattedEndDate
    }
    fetchReservedDates(item.room[0])
    editReservationForm.setFieldsValue({
      participants: updatedItem.participants,
      reservation_range: [updatedItem.start_date, updatedItem.end_date],
      additional_info: updatedItem.additional_info
    })
    //console.log(updatedItem)
    setEditReservation(updatedItem)
    setEditModalVisible(true)
  }

  const handleEditModalCancel = () => {
    editReservationForm.resetFields(["participants", "reservation_range", "additional_info"])
    setEditModalVisible(false)
    setEditReservation(null)
  }

  const handleEditModalOk = () => {
    editReservationForm.submit()
  }

  const onFinishEdit = async (values) => {
    try {
      setLoading(true)
      const reservationId = editReservation.key
      const payload = {
        participants: values.participants,
        reservation_range: values.reservation_range,
        additional_info: values.additional_info,
        meeting_rooms: editReservation.room[0]
      }
      await axios.put(`reservations/user/update/${reservationId}`, payload).then((res) => {
        fetchUserReservations(currentPage)
        messageApi.success(res.data.message)
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  //cancel
  const handleCancelRequest = async (reservationId) => {
    try {
      setLoading(true)
      await axios.put(`/reservations/state/decision/client/${reservationId}`, { state: 2 }).then((res) => {
        fetchUserReservations(currentPage)
        messageApi.success(res.data.message)
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout
      style={{
        background: colorBgContainer,
        minHeight: "95vh"
      }}
    >
      <Spin spinning={loading} tip="Loading...">
        {contextHolder}
        <Content
          style={{
            width: "80%",
            margin: "auto",
            padding: "10px",
            marginTop: "20px"
          }}
        >
          <Row>
            <Col span={24}>
              <Title level={4} style={{ margin: 0 }}>
                List of my reservations
              </Title>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col span={24}>
              <Table columns={columns} dataSource={reservations} pagination={false} />
            </Col>
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
        <Modal title="Additional Information" open={!!additionalInfo} onCancel={handleCloseModal} footer={null}>
          <p>{additionalInfo}</p>
        </Modal>

        <Modal title="Edit Reservation" open={editModalVisible} onCancel={handleEditModalCancel} onOk={handleEditModalOk} confirmLoading={loading}>
          {editReservation && (
            <Form form={editReservationForm} name="edit-reservation-form" onFinish={onFinishEdit}>
              <Form.Item
                name="participants"
                label="Participants"
                rules={[
                  { required: true, message: "Please input number of participants" },
                  { type: "number", min: 1, message: "Number of participants must be at least 1" },
                  () => ({
                    validator(_, value) {
                      if (value && value > editReservation.capacity) {
                        return Promise.reject(`Number of participants cannot exceed ${editReservation.capacity}`)
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
                          // check if its in old range dates
                          if (
                            (editReservation.start_date >= startDate && editReservation.start_date <= endDate) ||
                            (editReservation.end_date >= startDate && editReservation.end_date <= endDate) ||
                            (editReservation.start_date <= startDate && editReservation.end_date >= endDate)
                          ) {
                            continue
                          }
                          // check if it overlaps with other reservations
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
                      (reservation) =>
                        reservation.status !== "rejected" && reservation.status !== "canceled" && reservation._id !== editReservation.key
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
              <Form.Item name="additional_info" label="Additional Information">
                <TextArea rows={4} />
              </Form.Item>
            </Form>
          )}
        </Modal>
      </Spin>
    </Layout>
  )
}

export default Reservations
