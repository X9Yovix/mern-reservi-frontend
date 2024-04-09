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
    children: [
      {
        label: "Add Meeting Room",
        key: "3-1",
        to: "/dashboard/meeting-rooms/add"
      },
      {
        label: "List Meeting Rooms",
        key: "3-2",
        to: "/dashboard/meeting-rooms/list"
      }
    ]
    //to: "/dashboard/meeting-rooms"
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
    const activeItem = findActiveItem(items, location.pathname)
    if (activeItem) {
      setCurrent(activeItem.key)
    } else if (location.pathname.includes("/dashboard/meeting-rooms/update")) {
      setCurrent("3-2")
    }
  }, [location.pathname])

  const findActiveItem = (items, pathname) => {
    for (const item of items) {
      if (pathname.startsWith(item.to)) {
        return item
      }
      if (item.children) {
        const activeChildItem = findActiveItem(item.children, pathname)
        if (activeChildItem) {
          return activeChildItem
        }
      }
    }
    return null
  }

  const onClick = (e) => {
    setCurrent(e.key)
    const selectedItem = findItemByKey(items, e.key)
    if (selectedItem) {
      if (selectedItem.to) {
        navigate(selectedItem.to)
      } else if (selectedItem.children) {
        const firstChildItem = selectedItem.children[0]
        if (firstChildItem) {
          navigate(firstChildItem.to)
        }
      }
    }
  }

  const findItemByKey = (items, key) => {
    for (const item of items) {
      if (item.key === key) {
        return item
      }
      if (item.children) {
        const foundItem = findItemByKey(item.children, key)
        if (foundItem) {
          return foundItem
        }
      }
    }
    return null
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
