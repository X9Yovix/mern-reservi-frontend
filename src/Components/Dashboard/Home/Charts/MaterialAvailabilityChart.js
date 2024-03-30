import { Bar } from "react-chartjs-2"
import PropTypes from "prop-types"

const MaterialAvailabilityChart = ({ materials }) => {
  const materialLabels = materials.map((material) => material.name)
  const totalQuantities = materials.map((material) => material.totalQuantity)
  const availableQuantities = materials.map((material) => material.availableQuantity)
  const data = {
    labels: materialLabels,
    datasets: [
      {
        label: "Available Quantity",
        backgroundColor: "rgba(255, 99, 132, 0.4)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255, 99, 132, 0.6)",
        hoverBorderColor: "rgba(255, 99, 132, 1)",
        data: availableQuantities
      },
      {
        label: "Total Quantity",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75, 192, 192, 0.4)",
        hoverBorderColor: "rgba(75, 192, 192, 1)",
        data: totalQuantities
      }
    ]
  }
  const options = {
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true
      }
    }
  }
  return <Bar data={data} options={options} />
}

MaterialAvailabilityChart.propTypes = {
  materials: PropTypes.array.isRequired
}

export default MaterialAvailabilityChart
