// components/HistoryTable.js
export default function HistoryTable({ history }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Recent Readings</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="pb-2 text-gray-500">Time</th>
            <th className="pb-2 text-gray-500">SPO2</th>
            <th className="pb-2 text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((reading, idx) => {
            const status =
              reading.spo2 >= 95
                ? 'Normal'
                : reading.spo2 >= 90
                ? 'Low'
                : 'Critical';
            const statusColor =
              status === 'Normal'
                ? 'text-green-500'
                : status === 'Low'
                ? 'text-yellow-500'
                : 'text-red-500';

            const time = new Date(reading.inserted_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <tr key={idx}>
                <td className="py-2">{time}</td>
                <td className="py-2">{reading.spo2}%</td>
                <td className={`py-2 font-medium ${statusColor}`}>{status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
