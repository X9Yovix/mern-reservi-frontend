import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Col, Form, Input, Layout, Row, Spin, Typography, message, theme } from "antd"
import { MailOutlined, ReloadOutlined } from "@ant-design/icons"
import axios from "../../../axios"
import "./ResetPassword.css"

const ResetPassword = () => {
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
  }, [])

  const handleSubmit = async (values) => {
    try {
      setLoading(true)
      await axios
        .post("/auths/reset-password/request", values)
        .then((res) => {
          messageApi.success(res.data.message)
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
        <Content className="request-reset-content">
          <Row>
            <Col span={24} style={{ textAlign: "center" }}>
              <Title level={4} style={{ fontWeight: "bold", margin: 0 }}>
                Reset your password
              </Title>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form
                className="reset-request-form"
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
                <Form.Item wrapperCol={{ offset: 10, span: 10 }}>
                  <Button type="primary" htmlType="submit" icon={<ReloadOutlined />}>
                    Reset
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

export default ResetPassword
