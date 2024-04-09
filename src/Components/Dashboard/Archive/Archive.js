import { Segmented, Divider, Layout, Avatar } from "antd"
import { AppstoreOutlined, UserOutlined } from "@ant-design/icons"
import ArchivedMeetingRooms from "./ArchivedMeetingRooms/ArchivedMeetingRooms"
import { useState } from "react"

const Archive = () => {
  const [showContent, setShowContent] = useState("meeting_rooms")
  const { Content } = Layout

  const handleShowContent = (value) => {
    if (value === "meeting_rooms") {
      setShowContent("meeting_rooms")
    }
    if (value === "users") {
      setShowContent("users")
    }
  }

  return (
    <Content
      style={{
        width: "80%",
        margin: "auto",
        padding: "10px",
        marginTop: "20px"
      }}
    >
      <Divider />
      <Layout
        style={{
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          padding: "20px",
          borderRadius: "10px",
          background: localStorage.getItem("theme") === "dark" ? "#1a1a24" : "#f0f2f5"
        }}
      >
        <Segmented
          onChange={(value) => handleShowContent(value)}
          options={[
            {
              label: (
                <div style={{ padding: 4 }}>
                  <Avatar style={{ backgroundColor: "#87d068" }} icon={<AppstoreOutlined />} />
                  <div>Meeting Rooms</div>
                </div>
              ),
              value: "meeting_rooms"
            },
            {
              label: (
                <div style={{ padding: 4 }}>
                  <Avatar style={{ backgroundColor: "#f56a00" }} icon={<UserOutlined />} />
                  <div>Users</div>
                </div>
              ),
              value: "users"
            }
          ]}
        />
        <Divider />
        {showContent === "meeting_rooms" && <ArchivedMeetingRooms />}
        {showContent === "users" && <p>test</p>}
      </Layout>
    </Content>
  )
}

export default Archive
