import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Form, Input, Layout, Spin, Typography, message, theme } from "antd"
import { EyeInvisibleOutlined, EyeTwoTone, LoginOutlined, MailOutlined } from "@ant-design/icons"
import axios from "../../../axios"
import "./Signin.css"

const Signin = () => {
  const [loading, setLoading] = useState(false)

  const [messageApi, contextHolder] = message.useMessage()

  const {
    token: { colorBgContainer }
  } = theme.useToken()

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
        .post("/auths/login", values)
        .then((res) => {
          messageApi.success(res.data.message)
          localStorage.setItem("token", res.data.token)
          localStorage.setItem("user", JSON.stringify(res.data.user))
          navigate("/dashboard")
        })
        .catch((err) => {
          console.log(err)
          messageApi.error(err.response.data.error)
        })
    } catch (error) {
      console.error("Error occurred while registering user:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout style={{ background: colorBgContainer }}>
      <Spin spinning={loading} tip="Loading...">
        {contextHolder}
        <Form
          className="signin-form"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          style={{ maxWidth: 500 }}
          variant="outlined"
          onFinish={handleSubmit}
        >
          <Form.Item label="Email" name="email" colon={false} rules={[{ required: true, message: "Enter your email" }]}>
            <Input suffix={<MailOutlined />} />
          </Form.Item>
          <Form.Item label="Password" name="password" colon={false} rules={[{ required: true, message: "Enter your password" }]}>
            <Input.Password iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
          </Form.Item>
          <Typography.Link style={{ display: "flex", justifyContent: "flex-end", marginRight: 50 }} href="/reset-password">
            Forgot password?
          </Typography.Link>
          <Form.Item wrapperCol={{ offset: 10, span: 16 }} style={{ marginTop: 40 }}>
            <Button type="primary" htmlType="submit" icon={<LoginOutlined />}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Layout>
  )
}

export default Signin
