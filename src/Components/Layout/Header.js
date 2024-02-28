import { Link, useNavigate } from "react-router-dom"
import { Menu, message } from "antd"
import {
  DashboardOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  PlusCircleOutlined
} from "@ant-design/icons"
import { useState } from "react"

const Header = () => {
  const [current, setCurrent] = useState()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    message.success("Logged out successfully")
    navigate("/")
  }

  const items = [
    {
      label: <Link to="/dashboard">Dashboard</Link>,
      key: "dashboard",
      icon: <DashboardOutlined />
    },
    {
      label: <Link to="/">Home</Link>,
      key: "home",
      icon: <HomeOutlined />
    },
    {
      label: <Link to="/login">Sign In</Link>,
      key: "login",
      icon: <LoginOutlined />
    },
    {
      label: <Link to="/register">Sign Up</Link>,
      key: "register",
      icon: <PlusCircleOutlined />
    },
    {
      label: (
        <Link to="/home" onClick={handleLogout}>
          Logout
        </Link>
      ),
      key: "logout",
      icon: <LogoutOutlined />
    }
  ]

  const isAuthenticated = localStorage.getItem("token")
  const filteredItems = isAuthenticated
    ? items.filter((item) => ["dashboard", "home", "logout"].includes(item.key))
    : items.filter((item) => ["home", "login", "register"].includes(item.key))

  const onClick = (e) => {
    setCurrent(e.key)
  }

  return (
    <>
      <Menu
        onClick={onClick}
        selectedKeys={[current ? current : filteredItems[0].key]}
        mode="horizontal"
        items={filteredItems}
      />
    </>
  )
}

export default Header
