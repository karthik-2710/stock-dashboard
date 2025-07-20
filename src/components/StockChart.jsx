import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function StockChart({ symbol, stockData, labels }) {
  const data = {
    labels: labels,
    datasets: [
      {
        label: `${symbol} Price`,
        data: stockData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: `${symbol} Stock Prices` },
    },
  };

  return (
    <div className="bg-gray-800 p-4 rounded shadow">
      <Line data={data} options={options} />
    </div>
  );
}

export default StockChart;
