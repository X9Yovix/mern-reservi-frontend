import { Pie } from "react-chartjs-2"
import PropTypes from "prop-types"

const MeetingRoomCategoriesChart = ({ meetingRooms }) => {
  const categoriesCount = {}
  meetingRooms.forEach((room) => {
    room.categories.forEach((category) => {
      categoriesCount[category.name] = (categoriesCount[category.name] || 0) + 1
    })
  })
  const labels = Object.keys(categoriesCount)
  const data = labels.map((label) => categoriesCount[label])
  const randomColor = () => {
    return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`
  }
  const backgroundColors = labels.map(() => randomColor())
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: backgroundColors,
        borderWidth: 1
      }
    ]
  }
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || ""
            const value = context.formattedValue || 0
            return `${label}: ${value} Rooms`
          }
        }
      }
    },
    aspectRatio: 2.0
  }
  return <Pie data={chartData} options={options} />
}

MeetingRoomCategoriesChart.propTypes = {
  meetingRooms: PropTypes.arrayOf(
    PropTypes.shape({
      categories: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          color: PropTypes.string.isRequired
        })
      ).isRequired
    })
  ).isRequired
}

export default MeetingRoomCategoriesChart
