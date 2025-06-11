// components/BloodComposition.js
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BloodComposition({ spo2 = 0 }) {
  const data = {
    labels: ['Oxygenated', 'Deoxygenated'],
    datasets: [
      {
        data: [spo2, 100 - spo2],
        backgroundColor: ['#4361ee', '#f72585'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
      },
    },
  };

  return (
    <div className="relative h-full">
      <div className="chart-container">
        <Pie data={data} options={options} />
      </div>
      <div className="mt-4">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Oxygenated</span>
            <span className="stat-value text-primary">{spo2}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Deoxygenated</span>
            <span className="stat-value text-danger">{100 - spo2}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
