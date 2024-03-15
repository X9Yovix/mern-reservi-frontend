import { AppstoreOutlined, CalendarOutlined, ContainerOutlined } from "@ant-design/icons"
import { Col, Menu, Row } from "antd"
import { useNavigate } from "react-router-dom"
import PropTypes from "prop-types"
import { useState } from "react"

const items = [
  {
    label: "Materials",
    key: "1",
    icon: <ContainerOutlined />,
    to: "/dashboard/materials"
  },
  {
    label: "Meeting Rooms",
    key: "2",
    icon: <AppstoreOutlined />,
    to: "/dashboard/meeting-rooms"
  },
  {
    label: "Reservations",
    key: "3",
    to: "/dashboard/reservations",
    icon: <CalendarOutlined />
  }
]
const Dashboard = ({ cmp }) => {
  const [current, setCurrent] = useState("1")
  const navigate = useNavigate()

  const onClick = (e) => {
    setCurrent(e.key)
    const selectedItem = items.find((item) => item.key === e.key)
    if (selectedItem) {
      navigate(selectedItem.to)
    }
  }

  return (
    <>
      <Row>
        <Col span={4}>
          <Menu
            onClick={onClick}
            style={{
              width: 256,
              height: "95vh"
            }}
            defaultSelectedKeys={[current]}
            selectedKeys={[current]}
            items={items}
          />
        </Col>
        <Col span={20}>
          <div style={{ paddingTop: "20px" }}>{cmp}</div>
        </Col>
      </Row>
    </>
  )
}

Dashboard.propTypes = {
  cmp: PropTypes.node
}

export default Dashboard
