import { useEffect, useState } from "react"
import { Button, Form, Input, Spin, message } from "antd"
import { MailOutlined, ReloadOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import axios from "../../../axios"
import "./ResetPassword.css"

const ResetPassword = () => {
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const isAuthenticated = localStorage.getItem("token")

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [])

  const handleSubmit = async (values) => {
    try {
      setLoading(true)
      await axios
        .post("/auths/reset-password/request", values)
        .then((res) => {
          console.log(res)
          setLoading(false)
          message.success(res.data.message)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
          if (err.response.status == 400) {
            message.error(err.response.data.error)
            return
          }
          message.error(err.message)
        })
    } catch (error) {
      console.error("Error occurred while registering user:", error)
    }
  }

  return (
    <Spin spinning={loading} tip="Loading...">
      <Form
        className="signin-form"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        style={{ maxWidth: 500 }}
        variant="filled"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Enter your email"
            }
          ]}
        >
          <Input suffix={<MailOutlined />} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 14, span: 16 }}>
          <Button type="primary" htmlType="submit" icon={<ReloadOutlined />}>
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  )
}

export default ResetPassword
