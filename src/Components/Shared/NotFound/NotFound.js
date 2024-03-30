import { Button, Layout, Result, theme } from "antd"
import { Link } from "react-router-dom"
const NotFound = () => {
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  return (
    <Layout
      style={{
        background: colorBgContainer,
        minHeight: "95vh"
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link to="/home">
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    </Layout>
  )
}

export default NotFound
