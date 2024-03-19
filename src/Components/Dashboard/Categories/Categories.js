import { Button, Form, Input, Row, Col, Divider, Spin, message, ColorPicker } from "antd"
import { useState } from "react"
import axios from "../../../axios"

const componentToHex = (c) => {
  const hex = Math.round(c).toString(16)
  return hex.length === 1 ? "0" + hex : hex
}

const rgbToHex = (r, g, b) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

const Categories = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    try {
      const { r, g, b } = values.color.metaColor
      const hexColor = rgbToHex(r, g, b)
      values.color = hexColor
      setLoading(true)
      await axios
        .post("/categories", values)
        .then((res) => {
          console.log(res)
          setLoading(false)
          message.success(res.data.message)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
    } catch (error) {
      console.error("Error occurred while saving meeting room:", error)
    }
  }

  const renderForm = () => {
    return (
      <Form
        form={form}
        name="material-form"
        onFinish={onFinish}
        style={{
          width: "80%",
          margin: "auto",
          padding: "10px",
          /* border: "1px solid #ccc",
          borderRadius: "10px", */
          marginTop: "20px"
        }}
      >
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item name="name" label="Name of category" colon={false} rules={[{ required: true, message: "Please input name" }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="ColorPicker" name="color">
              <ColorPicker />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>
    )
  }
  return <>{loading ? <Spin tip="Loading...">{renderForm()}</Spin> : renderForm()}</>
}

export default Categories
