// components/HeartRateChart.js
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler);

export default function HeartRateChart({ heartRates }) {
  const chartData = {
    labels: Array.from({ length: heartRates.length }, (_, i) => `${i * 2}s`),
    datasets: [
      {
        label: 'Heart Rate',
        data: heartRates,
        borderColor: '#f72585',
        backgroundColor: 'rgba(247, 37, 133, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 50,
        max: 120,
        ticks: { stepSize: 10 },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-[300px]">
      <h2 className="text-lg font-semibold mb-4">Heart Rate (Live)</h2>
      <Line data={chartData} options={options} />
    </div>
  );
}
