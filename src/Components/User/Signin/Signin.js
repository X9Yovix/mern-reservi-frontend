import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Form, Input, Layout, Row, Col, Spin, Typography, message, theme } from "antd"
import { EyeInvisibleOutlined, EyeTwoTone, LoginOutlined, MailOutlined } from "@ant-design/icons"
import axios from "../../../axios"
import "./Signin.css"

const Signin = () => {
  const [loading, setLoading] = useState(false)

  const [messageApi, contextHolder] = message.useMessage()

  const {
    token: { colorBgContainer }
  } = theme.useToken()
  const { Content } = Layout
  const { Title } = Typography

  const navigate = useNavigate()
  const isAuthenticated = localStorage.getItem("token")

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
    if (localStorage.getItem("account_created")) {
      const message = JSON.parse(localStorage.getItem("account_created"))
      messageApi.success(message.success)
      messageApi.info(message.info)
      localStorage.removeItem("account_created")
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
    <Layout
      style={{
        background: colorBgContainer,
        minHeight: "95vh"
      }}
    >
      <Spin spinning={loading} tip="Loading...">
        {contextHolder}
        <Content className="signin-content">
          <Row>
            <Col span={24} style={{ textAlign: "center" }}>
              <Title level={4} style={{ fontWeight: "bold", margin: 0 }}>
                Sign In
              </Title>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
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
                <Link to="/reset-password">
                  <span style={{ display: "flex", justifyContent: "flex-end", marginRight: 50 }} href="/reset-password">
                    Forgot password?
                  </span>
                </Link>
                <Form.Item wrapperCol={{ offset: 10, span: 10 }} style={{ marginTop: 40 }}>
                  <Button type="primary" htmlType="submit" icon={<LoginOutlined />}>
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Content>
      </Spin>
    </Layout>
  )
}

export default Signin
