import React, { useState } from 'react';

const HoliDays = () => {
  const [holidays, setHolidays] = useState([
    { date: '', name: '' }
  ]);

  const handleChange = (idx, field, value) => {
    setHolidays(prev => prev.map((h, i) => i === idx ? { ...h, [field]: value } : h));
  };

  const handleAddMore = () => {
    setHolidays(prev => [...prev, { date: '', name: '' }]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-2xl bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Add Holidays</h2>
        <table className="w-full border border-gray-300 mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">SL No</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Name</th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((holiday, idx) => (
              <tr key={idx}>
                <td className="p-2 border text-center">{idx + 1}</td>
                <td className="p-2 border">
                  <input
                    type="date"
                    className="border rounded px-2 py-1 w-full"
                    value={holiday.date}
                    onChange={e => handleChange(idx, 'date', e.target.value)}
                    required
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    className="border rounded px-2 py-1 w-full"
                    value={holiday.name}
                    onChange={e => handleChange(idx, 'name', e.target.value)}
                    placeholder="Holiday Name"
                    required
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
            onClick={handleAddMore}
          >
            Add More
          </button>
        </div>
      </div>
    </div>
  );
};

export default HoliDays;