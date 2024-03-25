import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, registerables } from "chart.js"
import { Bar } from "react-chartjs-2"
import PropTypes from "prop-types"
import "./Home.css"
const MaterialAvailabilityChart = ({ materials }) => {
  ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, ...registerables)

  const materialLabels = materials.map((material) => material.name)
  const totalQuantities = materials.map((material) => material.totalQuantity)
  const availableQuantities = materials.map((material) => material.availableQuantity)
  console.log(materialLabels)
  console.log(totalQuantities)
  console.log(availableQuantities)
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
        //barThickness: 30,
      },
      {
        label: "Total Quantity",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75, 192, 192, 0.4)",
        hoverBorderColor: "rgba(75, 192, 192, 1)",
        data: totalQuantities
        //barThickness: 30,
      }
    ]
  }
  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: false
      }
    }
  }
  /* .container-chart {
  width: 100%;
  max-width: 1000px;
  overflow-x: scroll;
}

.container-chart-body {
  height: 500px;
}
 */
  /* const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false
      },
      y: {
        stacked: false
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    }
  } */
  /* <div className="container-chart">
      <div className="container-chart-body">
        <Bar options={options} data={data} />
      </div>
    </div> */
  if (materialLabels.length > 7) {
    const containerChartBody = document.querySelector(".container-chart-body")
    if (containerChartBody) {
      containerChartBody.style.width = "1800px"
    }
  }
  return (
    <div className="container-chart">
      <div className="container-chart-body">
        <Bar options={options} data={data} />
      </div>
    </div>
  )
}

MaterialAvailabilityChart.propTypes = {
  materials: PropTypes.array.isRequired
}

export default MaterialAvailabilityChart
