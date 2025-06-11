// components/TrendChart.js
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler, Legend);

export default function TrendChart({ dataPoints }) {
  const chartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'SPO2 Level',
        data: dataPoints,
        fill: true,
        backgroundColor: 'rgba(67, 97, 238, 0.1)',
        borderColor: '#4361ee',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 80,
        max: 100,
        ticks: { stepSize: 5 },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-[300px]">
      <h2 className="text-lg font-semibold mb-4">SPO2 Trend (Last 24 Hours)</h2>
      <Line data={chartData} options={options} />
    </div>
  );
}
