import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, DatePicker, Form, Input, Layout, Row, Col, Modal, Upload, Spin, Typography, message, theme } from "antd"
import {
  AimOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  UserAddOutlined
} from "@ant-design/icons"
import axios from "../../../axios"
import "./Signup.css"

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

const Signup = () => {
  const [loading, setLoading] = useState(false)

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState("")
  const [previewTitle, setPreviewTitle] = useState("")
  const [fileList, setFileList] = useState([])

  const handleCancel = () => setPreviewOpen(false)
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1))
  }
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none"
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8
        }}
      >
        Upload
      </div>
    </button>
  )

  const [messageApi, contextHolder] = message.useMessage()

  const {
    token: { colorBgContainer }
  } = theme.useToken()

  const { Content } = Layout
  const { Title } = Typography

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
      const formData = new FormData()
      formData.append("first_name", values.first_name)
      formData.append("last_name", values.last_name)
      formData.append("email", values.email)
      formData.append("password", values.password)
      formData.append("birthday", values.birthday || "")
      formData.append("address", values.address || null)
      formData.append("phone", values.phone || null)
      if (fileList.length != 0) {
        formData.append("avatar", fileList[0].originFileObj)
      } else {
        formData.append("avatar", null)
      }
      await axios
        .post("/auths/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then((res) => {
          const message = {
            success: res.data.message,
            info: "Please login to continue"
          }
          localStorage.setItem("account_created", JSON.stringify(message))
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
        <Content className="signup-content">
          <Row>
            <Col span={24} style={{ textAlign: "center" }}>
              <Title level={4} style={{ fontWeight: "bold", margin: 0 }}>
                Sign Up
              </Title>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form
                className="signup-form"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 18 }}
                layout="horizontal"
                style={{ maxWidth: 700 }}
                variant="outlined"
                onFinish={handleSubmit}
              >
                <Form.Item label="First Name" name="first_name" colon={false} rules={[{ required: true, message: "Enter your first name" }]}>
                  <Input placeholder="Enter your first name: ex: Test1" suffix={<InfoCircleOutlined />} />
                </Form.Item>
                <Form.Item label="Last Name" name="last_name" colon={false} rules={[{ required: true, message: "Enter your last name" }]}>
                  <Input placeholder="Enter your last name ex: Test2" suffix={<InfoCircleOutlined />} />
                </Form.Item>
                <Form.Item label="Email" name="email" colon={false} rules={[{ required: true, message: "Enter your email" }]}>
                  <Input placeholder="Enter your email ex: example@test.com" suffix={<MailOutlined />} />
                </Form.Item>
                <Form.Item label="Password" name="password" colon={false} rules={[{ required: true, message: "Enter your password" }]}>
                  <Input.Password placeholder="Enter your password" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                </Form.Item>
                <Form.Item label="Birth Date" name="birthday" colon={false} rules={[{ required: true, message: "Choose your birthdate" }]}>
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
                <Form.Item label="Address" name="address" colon={false}>
                  <Input placeholder="Enter your address (optional)" suffix={<AimOutlined />} />
                </Form.Item>
                <Form.Item label="Phone Number" name="phone" colon={false}>
                  <Input placeholder="Enter your phone number (optional)" suffix={<PhoneOutlined />} />
                </Form.Item>
                <Row>
                  <Col span={24}>
                    <Form.Item label="Profile Picture" colon={false}>
                      <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        beforeUpload={() => false}
                        accept="image/*"
                      >
                        {fileList.length >= 1 ? null : uploadButton}
                      </Upload>
                    </Form.Item>
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                      <img
                        alt="example"
                        style={{
                          width: "100%"
                        }}
                        src={previewImage}
                      />
                    </Modal>
                  </Col>
                </Row>
                <Form.Item wrapperCol={{ offset: 10, span: 10 }}>
                  <Button type="primary" htmlType="submit" icon={<UserAddOutlined />}>
                    Submit
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

export default Signup
