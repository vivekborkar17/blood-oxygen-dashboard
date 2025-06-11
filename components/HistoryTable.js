// components/HistoryTable.js
export default function HistoryTable({ data = [] }) {
  return (
    <div className="w-full min-w-[640px]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm font-semibold text-gray-600">
              Time
            </th>
            <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm font-semibold text-gray-600">
              SPO2
            </th>
            <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm font-semibold text-gray-600">
              Heart Rate
            </th>
            <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm font-semibold text-gray-600">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((reading, index) => (
            <tr
              key={index}
              className="border-b last:border-0 border-gray-100"
            >
              <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm text-gray-600">
                {new Date(reading.inserted_at).toLocaleTimeString()}
              </td>
              <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium">
                {reading.spo2}%
              </td>
              <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium">
                {reading.heart_rate} BPM
              </td>
              <td className="py-2 px-3 sm:px-4">
                <span
                  className={`status-badge ${
                    reading.spo2 >= 95
                      ? 'normal'
                      : reading.spo2 >= 90
                      ? 'warning'
                      : 'critical'
                  }`}
                >
                  {reading.spo2 >= 95
                    ? 'Normal'
                    : reading.spo2 >= 90
                    ? 'Warning'
                    : 'Critical'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
