import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Input, Row, Col } from "antd"

const MeetingRooms = () => {
  const [form] = Form.useForm()
  const onFinish = (values) => {
    console.log("Received values of form: ", values)
  }

  return (
    <Form
      form={form}
      name="register"
      onFinish={onFinish}
      style={{
        width: "80%",
        margin: "auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        marginTop: "20px"
      }}
    >
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: "email",
            message: "The input is not valid E-mail!"
          },
          {
            required: true,
            message: "Please input your E-mail!"
          }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: "email",
            message: "The input is not valid E-mail!"
          },
          {
            required: true,
            message: "Please input your E-mail!"
          }
        ]}
      >
        <Input />
      </Form.Item>

      <Row>
        <Col span={8} >
          <Form.Item
            width={"100px"}
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!"
              },
              {
                required: true,
                message: "Please input your E-mail!"
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!"
              },
              {
                required: true,
                message: "Please input your E-mail!"
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!"
              },
              {
                required: true,
                message: "Please input your E-mail!"
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.List
            name="names"
            rules={[
              {
                validator: async (_, names) => {
                  if (!names || names.length < 2) {
                    return Promise.reject(new Error('At least 2 materials'));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    label={index === 0 ? 'Materials' : ''}
                    wrapperCol={
                      index === 0 ?
                        {
                          xs: { span: 4, offset: 0 },
                          sm: { span: 20, offset: 0 },
                        }
                        :
                        {
                          xs: { span: 24, offset: 0 },
                          sm: { span: 20, offset: 4 },
                        }
                    }

                    labelCol={
                      index === 0 ?
                        {
                          xs: { span: 24 },
                          sm: { span: 4 },
                        }
                        :
                        {
                          xs: { span: 24, offset: 0 },
                          sm: { span: 20, offset: 4 },
                        }
                    }
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please input material's name or delete this field.",
                        },
                      ]}
                      noStyle
                    >
                      <Input placeholder="Material name" style={{ width: '60%' }} />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item
                  wrapperCol={
                    {
                      xs: { span: 4, offset: 0 },
                      sm: { span: 10, offset: 7 },
                    }
                  }

                  labelCol={
                    {
                      xs: { span: 24 },
                      sm: { span: 4 },
                    }
                  }
                >
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '60%' }}
                    icon={<PlusOutlined />}
                  >
                    Add Material
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
      <Form.Item >
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form >
  )
}

export default MeetingRooms
