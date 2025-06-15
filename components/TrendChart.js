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
  console.log('TrendChart received data:', data); // Debug log

  // Convert data to simple format for chart
  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.x);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }),
    datasets: [
      {
        label: 'SPO2 Level',
        data: data.map(item => item.y),
        borderColor: '#4361ee',
        backgroundColor: 'rgba(67, 97, 238, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 4,
        pointBackgroundColor: '#4361ee',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {      x: {
        title: {
          display: true,
          text: 'Timeline (All Readings)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          maxTicksLimit: 12,
          callback: function(value, index) {
            // Show every nth label to avoid overcrowding
            if (data.length > 20) {
              return index % Math.ceil(data.length / 12) === 0 ? this.getLabelForValue(value) : '';
            }
            return this.getLabelForValue(value);
          }
        },
      },
      y: {
        min: Math.min(85, ...data.map(item => item.y)) - 2,
        max: Math.max(100, ...data.map(item => item.y)) + 2,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'SPO2 (%)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        cornerRadius: 4,
        callbacks: {
          title: (context) => {
            const index = context[0].dataIndex;
            const date = new Date(data[index].x);
            return date.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
          },
          label: (context) => `SPO2: ${context.parsed.y}%`,
        },
      },
    },
  };

  return (
    <div className="w-full h-full">
      {data.length === 0 ? (        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <div className="text-lg font-medium">No Data Available</div>
            <div className="text-sm">No SPO2 readings found in database</div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full">
          <div className="text-xs text-gray-500 mb-2">
            Displaying {data.length} SPO2 readings from database
          </div>
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}
