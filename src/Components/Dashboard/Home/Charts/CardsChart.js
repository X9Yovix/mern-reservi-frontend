import { Card, Col, Row, Statistic } from "antd"
import { AppstoreOutlined, CalendarOutlined, ContainerOutlined, ControlOutlined, TeamOutlined } from "@ant-design/icons"
import PropTypes from "prop-types"

const CardsChart = ({ users, rooms, materials, categories, reservations }) => {
  return (
    <Row gutter={24}>
      <Col>
        <Card bordered={false}>
          <Statistic title="Users" value={users} prefix={<TeamOutlined />} />
        </Card>
      </Col>
      <Col>
        <Card bordered={false}>
          <Statistic title="Materials" prefix={<ContainerOutlined />} value={materials} />
        </Card>
      </Col>
      <Col>
        <Card bordered={false}>
          <Statistic title="Rooms" prefix={<AppstoreOutlined />} value={rooms} />
        </Card>
      </Col>
      <Col>
        <Card bordered={false}>
          <Statistic title="Reservation" prefix={<CalendarOutlined />} value={reservations} />
        </Card>
      </Col>
      <Col>
        <Card bordered={false}>
          <Statistic title="Categories" prefix={<ControlOutlined />} value={categories} />
        </Card>
      </Col>
    </Row>
  )
}

CardsChart.propTypes = {
  users: PropTypes.number.isRequired,
  rooms: PropTypes.number.isRequired,
  materials: PropTypes.number.isRequired,
  categories: PropTypes.number.isRequired,
  reservations: PropTypes.number.isRequired
}

export default CardsChart
