import { useEffect, useState } from "react"
import { Button, Form, Input, Spin, message } from "antd"
import { EyeInvisibleOutlined, EyeTwoTone, LoginOutlined, MailOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import axios from "../../../axios"
import "./Signin.css"

const Signin = () => {
  const [loading, setLoading] = useState(false)
  const [alertMessage, contextHolder] = message.useMessage()

  const navigate = useNavigate()
  const isAuthenticated = localStorage.getItem("token")

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard")
  }, [])

  const handleSubmit = async (values) => {
    try {
      setLoading(true)
      await axios
        .post("/auths/login", values)
        .then((res) => {
          console.log(res)
          setLoading(false)
          alertMessage.open({
            type: "success",
            content: res.data.message
          })
          localStorage.setItem("token", res.data.token)
          navigate("/dashboard")
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
          if (err.response.status == 400) {
            alertMessage.open({
              type: "error",
              content: err.response.data.error
            })
            return
          }
          alertMessage.open({
            type: "error",
            content: err.message
          })
        })
    } catch (error) {
      console.error("Error occurred while registering user:", error)
    }
  }

  const renderForm = () => {
    return (
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
          <Input.Password
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 12, span: 16 }}>
          <Button type="primary" htmlType="submit" icon={<LoginOutlined />}>
            Login
          </Button>
        </Form.Item>
      </Form>
    )
  }

  return (
    <>
      {contextHolder}
      {loading ? <Spin tip="Loading...">{renderForm()}</Spin> : renderForm()}
    </>
  )
}

export default Signin
