import React, { useState } from 'react';

const LEAVE_TYPES = ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity Leave'];
const INITIAL_PENDING_LEAVES = 10; // Replace with actual value from API or props if needed

const Leaves = () => {
  const [showForm, setShowForm] = useState(false);
  const [pendingLeaves, setPendingLeaves] = useState(INITIAL_PENDING_LEAVES);
  const [leaveType, setLeaveType] = useState(LEAVE_TYPES[0]);
  const [days, setDays] = useState(1);
  const [halfDay, setHalfDay] = useState(false);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleApply = () => {
    if (days > pendingLeaves) {
      setError('Cannot apply for more than your pending leaves.');
      return;
    }
    setError('');
    // Replace with API call or approval logic
    alert(`Leave applied!\nType: ${leaveType}\nDays: ${days}${halfDay ? ' (Half Day)' : ''}\nDescription: ${description}`);
    setPendingLeaves(prev => prev - days);
    setShowForm(false);
    setDays(1);
    setHalfDay(false);
    setDescription('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Leaves</h2>
        <div className="mb-4 text-center">
          <span className="font-semibold">Your Pending Leaves: </span>
          <span className="text-blue-600 font-bold">{pendingLeaves}</span>
        </div>
        {!showForm ? (
          <div className="flex justify-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
              onClick={() => setShowForm(true)}
            >
              Apply Leave
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleApply(); }}>
            <div>
              <label className="block mb-1 font-medium">Leave Type</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={leaveType}
                onChange={e => setLeaveType(e.target.value)}
              >
                {LEAVE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Days</label>
              <input
                type="number"
                min={1}
                max={pendingLeaves}
                className="w-full border rounded px-2 py-1"
                value={days}
                onChange={e => setDays(Number(e.target.value))}
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="halfDay"
                checked={halfDay}
                onChange={e => setHalfDay(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="halfDay">Apply for Half Day</label>
            </div>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                className="w-full border rounded px-2 py-1"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="flex justify-between">
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow"
                disabled={days > pendingLeaves}
              >
                Send for Approval
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Leaves;