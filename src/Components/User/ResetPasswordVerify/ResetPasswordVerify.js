import { useEffect, useState } from "react"
import { Button, Form, Input, Layout, Spin, message, theme } from "antd"
import { EyeInvisibleOutlined, EyeTwoTone, SyncOutlined } from "@ant-design/icons"
import { useNavigate, useParams } from "react-router-dom"
import axios from "../../../axios"
import "./ResetPasswordVerify.css"

const ResetPasswordVerify = () => {
  const [loading, setLoading] = useState(false)

  const {
    token: { colorBgContainer }
  } = theme.useToken()
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
          console.log(res)
          setLoading(false)
          message.success(res.data.message)
          navigate("/login")
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
    <Layout style={{ background: colorBgContainer }}>
      <Spin spinning={loading} tip="Loading...">
        <Form
          className="signin-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          style={{ maxWidth: 500 }}
          variant="filled"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Enter your password"
              }
            ]}
          >
            <Input.Password iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirm_password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!"
              },
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
          <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
            <Button type="primary" htmlType="submit" icon={<SyncOutlined />}>
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Layout>
  )
}

export default ResetPasswordVerify
