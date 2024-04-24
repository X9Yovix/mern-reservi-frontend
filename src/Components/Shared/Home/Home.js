import { Link } from "react-router-dom"
import "./Home.css"
import { Button, Layout, theme } from "antd"
import { AppstoreOutlined, LoginOutlined } from "@ant-design/icons"
import { Footer } from "antd/es/layout/layout"
import { useState } from "react"

const videoMp4 = require("../../../assets/videos/V1.mp4")
const videoWebm = require("../../../assets/videos/V2.webm")

const Home = () => {
  const [themeMode] = useState(localStorage.getItem("theme") || "light")
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  const isAuth = localStorage.getItem("token")

  return (
    <Layout
      style={{
        background: colorBgContainer,
        minHeight: "95vh"
      }}
    >
      <div className="video-container">
        <video autoPlay loop muted className="video-background">
          <source src={videoWebm} type="video/webm" />
          <source src={videoMp4} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="overlay"></div>
        <div className="container-center">
          <h1 style={{ color: "#fff", textAlign: "center" }}>Meeting Room Finder</h1>
          {isAuth ? (
            <Link to="/rooms">
              <Button type="text" size="large" icon={<AppstoreOutlined />} style={{ color: themeMode === "dark" ? "#fff" : "#000" }}>
                Discover meeting rooms
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button type="text" size="large" icon={<LoginOutlined />} style={{ color: themeMode === "dark" ? "#fff" : "#000" }}>
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
      <Footer style={{ textAlign: "center" }}>
        Created by{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="credits"
          href="https://www.linkedin.com/in/ouazzou/"
          style={{ color: theme === "dark" ? "#fff" : "#1677ff" }}
        >
          OUAZZOU
        </a>{" "}
        | {new Date().getFullYear()}
      </Footer>
    </Layout>
  )
}

export default Home
