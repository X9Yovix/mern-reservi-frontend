import { Link } from "react-router-dom"
import { Menu } from "antd"
import { HomeOutlined, LoginOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { useState } from "react"
import axios from "../../axios"

const items = [
  {
    label: <Link to="/">Home</Link>,
    key: "home",
    icon: <HomeOutlined />
  },
  {
    label: <Link to="/login">Sign Ip</Link>,
    key: "login",
    icon: <LoginOutlined />
  },
  {
    label: <Link to="/register">Sign Up</Link>,
    key: "register",
    icon: <PlusCircleOutlined />
  }
]

const Header = () => {
  const [current, setCurrent] = useState("home")

  const onClick = (e) => {
    setCurrent(e.key)
    axios
      .get(`/users`)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <>
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
    </>
  )
}

export default Header
