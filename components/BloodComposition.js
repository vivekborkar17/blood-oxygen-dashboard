// components/BloodComposition.js
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

export default function BloodComposition({ spo2 }) {
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Blood Composition</h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6">
        <div className="w-40 h-40">
          <Pie data={data} />
        </div>
        <div className="w-full md:w-1/2 flex gap-2 items-end h-32">
          <div
            className="flex-1 bg-blue-600 rounded-t text-center text-xs text-white"
            style={{ height: `${spo2}%` }}
          >
            Oxygenated
          </div>
          <div
            className="flex-1 bg-red-500 rounded-t text-center text-xs text-white"
            style={{ height: `${100 - spo2}%` }}
          >
            Deoxygenated
          </div>
        </div>
      </div>
    </div>
  );
}
