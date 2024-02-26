import { useState } from "react"
import { Button, DatePicker, Form, Input, Spin } from "antd"
import {
  AimOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  UserAddOutlined
} from "@ant-design/icons"
import "./Signup.css"
import axios from "../../../axios"

const Signup = () => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values) => {
    try {
      setLoading(true)
      await axios
        .post("/auths/register", values)
        .then((res) => {
          console.log(res)
          setLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
    } catch (error) {
      console.error("Error occurred while registering user:", error)
    }
  }

  const renderForm = () => {
    return (
      <Form
        className="signup-form"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        style={{ maxWidth: 700 }}
        variant="filled"
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
          <Input suffix={<InfoCircleOutlined />} />
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
          <Input suffix={<InfoCircleOutlined />} />
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
        <Form.Item
          label="Address"
          name="address"
          rules={[
            {
              required: false,
              message: "Enter your address (optional)"
            }
          ]}
        >
          <Input suffix={<AimOutlined />} />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phone_number"
          rules={[
            {
              required: false,
              message: "Enter your phone number (optional)"
            }
          ]}
        >
          <Input suffix={<PhoneOutlined />} />
        </Form.Item>
        <Form.Item
          label="Birth Date"
          name="birth_date"
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
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 12, span: 16 }}>
          <Button type="primary" htmlType="submit" icon={<UserAddOutlined />}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    )
  }

  return <>{loading ? <Spin tip="Loading...">{renderForm()}</Spin> : renderForm()}</>
}

export default Signup
