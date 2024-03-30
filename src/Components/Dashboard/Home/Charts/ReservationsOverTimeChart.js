import { Line } from "react-chartjs-2"
import PropTypes from "prop-types"

const ReservationsOverTimeChart = ({ reservations }) => {
  const reservationsCount = {}
  reservations.forEach((reservation) => {
    if (reservation.status == "confirmed") {
      const date = new Date(reservation.start_date).toDateString()
      reservationsCount[date] = (reservationsCount[date] || 0) + 1
    }
  })
  const sortedDates = Object.keys(reservationsCount).sort((a, b) => new Date(a) - new Date(b))
  const labels = sortedDates
  const data = labels.map((date) => reservationsCount[date] || 0)
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Reservations",
        data: data,
        fill: false,
        borderColor: "rgba(75, 192, 192, 0.6)",
        tension: 0.2
      }
    ]
  }
  const options = {
    scales: {
      y: {
        ticks: {
          stepSize: 1,
          suggestedMin: 0
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }
  return <Line data={chartData} options={options} />
}

ReservationsOverTimeChart.propTypes = {
  reservations: PropTypes.arrayOf(
    PropTypes.shape({
      start_date: PropTypes.string.isRequired
    })
  ).isRequired
}

export default ReservationsOverTimeChart
