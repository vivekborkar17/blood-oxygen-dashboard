// components/BloodComposition.js
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BloodComposition({ spo2 = 0 }) {
  const data = {
    labels: ['Oxygenated Blood', 'Deoxygenated Blood'],
    datasets: [
      {
        data: [spo2, 100 - spo2],
        backgroundColor: [
          'rgba(67, 97, 238, 0.8)', // Blue for oxygenated
          'rgba(247, 37, 133, 0.8)'  // Red/Pink for deoxygenated
        ],
        borderColor: [
          '#4361ee',
          '#f72585'
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(67, 97, 238, 0.9)',
          'rgba(247, 37, 133, 0.9)'
        ],
        hoverBorderWidth: 3,
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
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            weight: '500'
          },
          color: '#374151'
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        cornerRadius: 8,
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 min-h-0 mb-4">
        <Pie data={data} options={options} />
      </div>
      <div className="mt-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-blue-700">Oxygenated</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">{spo2}%</span>
          </div>
          <div className="bg-gradient-to-r from-pink-50 to-red-100 rounded-xl p-4 border border-pink-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <span className="text-sm font-medium text-pink-700">Deoxygenated</span>
            </div>
            <span className="text-2xl font-bold text-pink-600">{100 - spo2}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
