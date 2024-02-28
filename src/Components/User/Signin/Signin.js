import { useEffect, useState } from "react"
import { Button, Form, Input, Spin, Typography, message } from "antd"
import { EyeInvisibleOutlined, EyeTwoTone, LoginOutlined, MailOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import axios from "../../../axios"
import "./Signin.css"

const Signin = () => {
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
        .post("/auths/login", values)
        .then((res) => {
          console.log(res)
          setLoading(false)
          message.success(res.data.message)
          localStorage.setItem("token", res.data.token)
          localStorage.setItem("user", JSON.stringify(res.data.user))
          navigate("/dashboard")
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
        <Typography.Link
          style={{ display: "flex", justifyContent: "flex-end", marginRight: 50 }}
          href="/reset-password"
        >
          Forgot password?
        </Typography.Link>
        <Form.Item wrapperCol={{ offset: 10, span: 16 }} style={{ marginTop: 40 }}>
          <Button type="primary" htmlType="submit" icon={<LoginOutlined />}>
            Login
          </Button>
        </Form.Item>
      </Form>
    )
  }

  return <>{loading ? <Spin tip="Loading...">{renderForm()}</Spin> : renderForm()}</>
}

export default Signin
