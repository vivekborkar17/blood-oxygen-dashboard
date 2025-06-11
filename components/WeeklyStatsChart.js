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

export default function WeeklyStatsChart({ data = [] }) {
  // Format dates to show date and day of week
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const chartData = {
    labels: data.map(item => formatDate(item.date)), // The view already provides day names (Mon, Tue, etc.)
    datasets: [{
      label: 'Average SPO2',
      data: data.map(item => item.avgSpo2 || 0), // Use 0 if value is falsy
      backgroundColor: '#4895ef',
      borderRadius: 6
    }, {
      label: 'Average Heart Rate',
      data: data.map(item => item.avgHeartRate || 0), // Use 0 if value is falsy
      backgroundColor: '#f72585',
      borderRadius: 6
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 120, // Increased to accommodate heart rate values that can go above 100
        ticks: {
          stepSize: 20
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        cornerRadius: 4,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            if (value === 0) {
              return `${context.dataset.label}: No data`;
            }
            return `${context.dataset.label}: ${value.toFixed(1)}`;
          }
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
}
