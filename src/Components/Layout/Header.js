import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import PropTypes from "prop-types"
import { Avatar, Menu, Switch, Tooltip, message } from "antd"
import {
  ContactsOutlined,
  DashboardOutlined,
  GatewayOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  MoonOutlined,
  PlusCircleOutlined,
  SunOutlined,
  UserOutlined
} from "@ant-design/icons"
import { jwtDecode } from "jwt-decode"
import "./Header.css"

const Header = ({ theme, toggleTheme }) => {
  const [current, setCurrent] = useState(null)

  const [messageApi, contextHolder] = message.useMessage()

  const navigate = useNavigate()
  const location = useLocation()

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
      icon: <GatewayOutlined />,
      to: "/home"
    },
    {
      label: <Link to="/rooms">Rooms</Link>,
      key: "rooms",
      icon: <HomeOutlined />,
      to: "/rooms"
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
    },
    {
      label: (
        <Tooltip
          title={
            localStorage.getItem("user")
              ? `${JSON.parse(localStorage.getItem("user")).first_name} ${JSON.parse(localStorage.getItem("user")).last_name}`
              : null
          }
        >
          <Avatar
            style={{ backgroundColor: "#87d068" }}
            src={
              localStorage.getItem("user") ? `${process.env.REACT_APP_BACKEND_STATIC_URL}${JSON.parse(localStorage.getItem("user")).avatar}` : null
            }
            icon={!localStorage.getItem("user") ? <UserOutlined /> : null}
          />
        </Tooltip>
      ),
      key: "avatar"
    }
  ]

  useEffect(() => {
    let activePath = location.pathname
    if (activePath === "/") {
      activePath = "/home"
      setCurrent("home")
    } else {
      const activeItem = items.find((item) => location.pathname.startsWith(item.to))
      if (activeItem) {
        setCurrent(activeItem.key)
      }
    }
  }, [location.pathname])

  const token = localStorage.getItem("token")
  const decodedToken = token ? jwtDecode(token) : null
  let filteredItems = []

  if (!token) {
    filteredItems = items.filter((item) => ["home", "login", "register", "theme"].includes(item.key))
  } else if (decodedToken && decodedToken.role === "admin") {
    filteredItems = items.filter((item) => ["dashboard", "home", "rooms", "reservations", "logout", "theme", "avatar"].includes(item.key))
  } else if (decodedToken && decodedToken.role === "user") {
    filteredItems = items.filter((item) => ["home", "rooms", "reservations", "logout", "theme", "avatar"].includes(item.key))
  }

  const onClick = (e) => {
    setCurrent(e.key)
  }

  return (
    <>
      {contextHolder}
      <Menu
        onClick={onClick}
        defaultSelectedKeys={[current]}
        selectedKeys={[current]}
        mode="horizontal"
        items={filteredItems}
        style={{
          minHeight: "5vh",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          background: localStorage.getItem("theme") === "dark" ? "#1a1a24" : "#f0f2f5"
        }}
      />
    </>
  )
}

Header.propTypes = {
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired
}

export default Header
