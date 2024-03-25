import { Button, Form, Input, Row, Col, InputNumber, Divider, Spin, message, Layout } from "antd"
import { useState } from "react"
import axios from "../../../axios"
import TextArea from "antd/es/input/TextArea"

const Materials = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const { Content } = Layout

  const onFinish = async (values) => {
    try {
      setLoading(true)
      await axios
        .post("/materials", values)
        .then((res) => {
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

  return (
    <Spin spinning={loading} tip="Loading...">
      <Content
        style={{
          width: "80%",
          margin: "auto",
          padding: "10px",
          /* border: "1px solid #ccc",
          borderRadius: "10px", */
          marginTop: "20px"
        }}
      >
        <Form form={form} name="material-form" onFinish={onFinish}>
          <Row gutter={24}>
            <Col span={16}>
              <Form.Item name="name" label="Name of material" colon={false} rules={[{ required: true, message: "Please input name" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="totalQuantity"
                label="Quantity of material"
                colon={false}
                rules={[
                  { required: true, message: "Please input material" },
                  { type: "number", min: 1, message: "Quantity must be a positive number" }
                ]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col span={24}>
              <Form.Item name="description" label="Descritpion" colon={false}>
                <TextArea />
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
      </Content>
    </Spin>
  )
}

export default Materials
