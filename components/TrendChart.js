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

export default function TrendChart({ data = [] }) {
  // Generate time labels for the last 24 hours
  const generateTimeLabels = () => {
    const labels = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 3600000); // subtract hours in milliseconds
      labels.push(time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    }
    return labels;
  };

  const chartData = {
    labels: generateTimeLabels(),
    datasets: [
      {
        label: 'SPO2 Level',
        data: data,
        borderColor: '#4361ee',
        backgroundColor: 'rgba(67, 97, 238, 0.1)',
        borderWidth: 2,
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
        min: 80,
        max: 100,
        ticks: {
          stepSize: 5,
        },
        title: {
          display: true,
          text: 'SPO2 (%)',
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
        title: {
          display: true,
          text: 'Time',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `SPO2: ${context.parsed.y}%`,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-[300px]">
      <h2 className="text-lg font-semibold mb-4">SPO2 Trend (Last 24 Hours)</h2>
      <Line data={chartData} options={options} />
    </div>
  );
}
