import { useEffect, useState } from "react"
import { Button, DatePicker, Form, Input, Layout, Spin, message, theme } from "antd"
import { AimOutlined, EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined, MailOutlined, PhoneOutlined, UserAddOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import axios from "../../../axios"
import "./Signup.css"

const Signup = () => {
  const [loading, setLoading] = useState(false)

  const {
    token: { colorBgContainer }
  } = theme.useToken()

  const navigate = useNavigate()
  const isAuthenticated = localStorage.getItem("token")

  const currentDate = new Date()
  const requiredDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate())

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [])

  const handleSubmit = async (values) => {
    try {
      setLoading(true)
      await axios
        .post("/auths/register", values)
        .then((res) => {
          console.log(res)
          setLoading(false)
          message.success(res.data.message)
          navigate("/login")
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
          if (err.response.status === 400) {
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
          className="signup-form"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          style={{ maxWidth: 700 }}
          variant="outlined"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[
              {
                required: true,
                message: "Enter your first name"
              }
            ]}
          >
            <Input placeholder="Enter your first name: ex: Test1" suffix={<InfoCircleOutlined />} />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[
              {
                required: true,
                message: "Enter your last name"
              }
            ]}
          >
            <Input placeholder="Enter your last name ex: Test2" suffix={<InfoCircleOutlined />} />
          </Form.Item>
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
            <Input placeholder="Enter your email ex: example@test.com" suffix={<MailOutlined />} />
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
            <Input.Password placeholder="Enter your password" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
          </Form.Item>
          <Form.Item
            label="Birth Date"
            name="birthday"
            rules={[
              {
                required: true,
                message: "Choose your birthdate"
              }
            ]}
          >
            <DatePicker
              style={{
                width: "100%"
              }}
              showNow={false}
              format={"YYYY-MM-DD"}
              disabledDate={(current) => current && current > requiredDate}
              placeholder="Select your birthdate"
            />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: false
              }
            ]}
          >
            <Input placeholder="Enter your address (optional)" suffix={<AimOutlined />} />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              {
                required: false,
                message: "Enter your phone number (optional)"
              }
            ]}
          >
            <Input placeholder="Enter your phone number (optional)" suffix={<PhoneOutlined />} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 12, span: 16 }}>
            <Button type="primary" htmlType="submit" icon={<UserAddOutlined />}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Layout>
  )
}

export default Signup
