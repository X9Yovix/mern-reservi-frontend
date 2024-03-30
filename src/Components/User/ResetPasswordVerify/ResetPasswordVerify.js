import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button, Form, Input, Layout, Row, Col, Spin, Typography, message, theme } from "antd"
import { EyeInvisibleOutlined, EyeTwoTone, SyncOutlined } from "@ant-design/icons"
import axios from "../../../axios"
import "./ResetPasswordVerify.css"

const ResetPasswordVerify = () => {
  const [loading, setLoading] = useState(false)

  const [messageApi, contextHolder] = message.useMessage()

  const {
    token: { colorBgContainer }
  } = theme.useToken()
  const { Content } = Layout
  const { Title } = Typography

  const { token } = useParams()

  const navigate = useNavigate()
  const isAuthenticated = localStorage.getItem("token")

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard")
  }, [])

  const handleSubmit = async (values) => {
    try {
      setLoading(true)
      await axios
        .post(`/auths/reset-password/reset/${token}`, values)
        .then((res) => {
          messageApi.success(res.data.message)
          navigate("/login")
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
        <Content className="reset-verif-content">
          <Row>
            <Col span={24} style={{ textAlign: "center" }}>
              <Title level={4} style={{ fontWeight: "bold", margin: 0 }}>
                Enter your new password
              </Title>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form
                className="reset-verif-form"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: 600 }}
                variant="outlined"
                onFinish={handleSubmit}
              >
                <Form.Item label="Password" name="password" colon={false} rules={[{ required: true, message: "Enter your password" }]}>
                  <Input.Password iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                </Form.Item>
                <Form.Item
                  label="Confirm Password"
                  name="confirm_password"
                  colon={false}
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    { required: true, message: "Please confirm your password!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error("The new password that you entered do not match"))
                      }
                    })
                  ]}
                >
                  <Input.Password iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 10, span: 10 }}>
                  <Button type="primary" htmlType="submit" icon={<SyncOutlined />}>
                    Update
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

export default ResetPasswordVerify
