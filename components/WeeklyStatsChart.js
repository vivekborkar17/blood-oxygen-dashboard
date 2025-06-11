// components/WeeklyStatsChart.js
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function WeeklyStatsChart({ weeklyData }) {
  const data = {
    labels: weeklyData.map((d) => d.day),
    datasets: [
      {
        label: 'Avg SPO2',
        data: weeklyData.map((d) => d.avg),
        backgroundColor: '#4895ef',
        borderRadius: 6,
      },
      {
        label: 'Min SPO2',
        data: weeklyData.map((d) => d.min),
        backgroundColor: '#f72585',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 80, max: 100, ticks: { stepSize: 5 } },
    },
    plugins: { legend: { position: 'bottom' } },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-[300px]">
      <h2 className="text-lg font-semibold mb-4">Weekly SPO2 Stats</h2>
      <Bar data={data} options={options} />
    </div>
  );
}
