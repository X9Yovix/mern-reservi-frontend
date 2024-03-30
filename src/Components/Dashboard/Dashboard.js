import { AppstoreOutlined, BarChartOutlined, CalendarOutlined, ContainerOutlined, ControlOutlined } from "@ant-design/icons"
import { Layout, Menu, theme } from "antd"
import { useLocation, useNavigate } from "react-router-dom"
import PropTypes from "prop-types"
import { useEffect, useState } from "react"

const { Content, Sider } = Layout

const items = [
  {
    label: "Statistics",
    key: "1",
    icon: <BarChartOutlined />,
    to: "/dashboard/home"
  },
  {
    label: "Materials",
    key: "2",
    icon: <ContainerOutlined />,
    to: "/dashboard/materials"
  },
  {
    label: "Meeting Rooms",
    key: "3",
    icon: <AppstoreOutlined />,
    to: "/dashboard/meeting-rooms"
  },
  {
    label: "Reservations",
    key: "4",
    to: "/dashboard/reservations",
    icon: <CalendarOutlined />
  },
  {
    label: "Categories",
    key: "5",
    to: "/dashboard/categories",
    icon: <ControlOutlined />
  }
]
const Dashboard = ({ cmp }) => {
  const [current, setCurrent] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  useEffect(() => {
    const activeItem = items.find((item) => location.pathname.startsWith(item.to))
    if (activeItem) {
      setCurrent(activeItem.key)
    }
  }, [location.pathname])

  const onClick = (e) => {
    setCurrent(e.key)
    const selectedItem = items.find((item) => item.key === e.key)
    if (selectedItem) {
      navigate(selectedItem.to)
    }
  }

  return (
    <>
      <Layout
        style={{
          background: colorBgContainer,
          minHeight: "95vh"
        }}
      >
        <Sider style={{ background: colorBgContainer }}>
          <Menu
            onClick={onClick}
            style={{
              width: 210,
              height: "100%",
              padding: "10px 0"
            }}
            defaultSelectedKeys={[current]}
            selectedKeys={[current]}
            items={items}
          />
        </Sider>
        <Content style={{ padding: "0 24px" }}>{cmp}</Content>
      </Layout>
    </>
  )
}

Dashboard.propTypes = {
  cmp: PropTypes.node
}

export default Dashboard
