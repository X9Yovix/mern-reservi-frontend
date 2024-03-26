import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import PropTypes from "prop-types"
import { Menu, Switch, message } from "antd"
import {
  ContactsOutlined,
  DashboardOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  MoonOutlined,
  PlusCircleOutlined,
  SunOutlined
} from "@ant-design/icons"

const Header = ({ theme, toggleTheme }) => {
  const [current, setCurrent] = useState(null)

  const [messageApi, contextHolder] = message.useMessage()

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const activeItem = items.find((item) => location.pathname.startsWith(item.to))
    if (activeItem) {
      setCurrent(activeItem.key)
    }
  }, [location.pathname, current])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    messageApi.success("Logged out successfully")
    navigate("/")
  }

  const items = [
    {
      label: <Link to="/dashboard">Dashboard</Link>,
      key: "dashboard",
      icon: <DashboardOutlined />,
      to: "/dashboard"
    },
    {
      label: <Link to="/home">Home</Link>,
      key: "home",
      icon: <HomeOutlined />,
      to: "/home"
    },
    {
      label: <Link to="/reservations">My Reservations</Link>,
      key: "reservations",
      icon: <ContactsOutlined />,
      to: "/reservations"
    },
    {
      label: <Link to="/login">Sign In</Link>,
      key: "login",
      icon: <LoginOutlined />,
      to: "/login"
    },
    {
      label: <Link to="/register">Sign Up</Link>,
      key: "register",
      icon: <PlusCircleOutlined />,
      to: "/register"
    },
    {
      label: (
        <Link to="/login" onClick={handleLogout}>
          Logout
        </Link>
      ),
      key: "logout",
      icon: <LogoutOutlined />
    },
    {
      label: (
        <>
          {theme === "dark" ? (
            <MoonOutlined style={{ color: "#1668dc", fontSize: "16px", marginRight: "8px" }} />
          ) : (
            <SunOutlined style={{ color: "orange", fontSize: "16px", marginRight: "8px" }} />
          )}
          <Switch checked={theme === "dark"} onChange={toggleTheme} checkedChildren="Dark" unCheckedChildren="Light" />
        </>
      ),
      key: "theme"
    }
  ]

  const isAuthenticated = localStorage.getItem("token")
  const filteredItems = isAuthenticated
    ? items.filter((item) => ["dashboard", "home", "reservations", "logout", "theme"].includes(item.key))
    : items.filter((item) => ["login", "register", "theme"].includes(item.key))

  const onClick = (e) => {
    setCurrent(e.key)
  }

  return (
    <>
      {contextHolder}
      <Menu onClick={onClick} defaultSelectedKeys={[current]} selectedKeys={[current]} mode="horizontal" items={filteredItems}>
        {/* {filteredItems.map((item) => (
        item.key !== "logout" && (
          <Menu.Item key={item.key} icon={item.icon}>
            {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
          </Menu.Item>
        )
      ))}

      {filteredItems.map((item) => (
        item.key === "logout" && (
          <Menu.Item key={item.key} icon={item.icon} style={{ marginLeft: "auto" }}>
            {item.label}
          </Menu.Item>
        )
      ))}

      <Menu.Item key="theme" onClick={() => setCurrent(current)} >
        <Switch
          checked={theme === "dark"}
          onChange={toggleTheme}
          checkedChildren="Dark"
          unCheckedChildren="Light"
        />
        {theme === "dark" ? (
          <MoonOutlined style={{ color: "#1668dc", fontSize: '16px', marginLeft: "8px" }} />
        ) : (
          <SunOutlined style={{ color: "orange", fontSize: '16px', marginLeft: "8px" }} />
        )}
      </Menu.Item> */}
      </Menu>
    </>
  )
}

Header.propTypes = {
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired
}

export default Header
