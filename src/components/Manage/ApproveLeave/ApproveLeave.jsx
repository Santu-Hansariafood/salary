"use client"

import React, { useState } from 'react';

const mockLeaveRequests = [
  {
    id: 1,
    employee: 'John Doe',
    type: 'Sick Leave',
    days: 2,
    halfDay: false,
    description: 'Fever and cold',
    status: 'Pending'
  },
  {
    id: 2,
    employee: 'Jane Smith',
    type: 'Casual Leave',
    days: 1,
    halfDay: true,
    description: 'Personal work',
    status: 'Pending'
  }
];

const ApproveLeave = () => {
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests);

  const handleAction = (id, action) => {
    setLeaveRequests(prev => prev.map(lr =>
      lr.id === id ? { ...lr, status: action } : lr
    ));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-2xl bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Approve Leave Requests</h2>
        {leaveRequests.length === 0 ? (
          <div className="text-center text-gray-500">No leave requests pending approval.</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-2 border">Employee</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Days</th>
                <th className="p-2 border">Half Day</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map(req => (
                <tr key={req.id} className="text-center">
                  <td className="p-2 border">{req.employee}</td>
                  <td className="p-2 border">{req.type}</td>
                  <td className="p-2 border">{req.days}</td>
                  <td className="p-2 border">{req.halfDay ? 'Yes' : 'No'}</td>
                  <td className="p-2 border">{req.description}</td>
                  <td className="p-2 border font-semibold">
                    {req.status === 'Pending' ? <span className="text-yellow-600">Pending</span> : req.status === 'Approved' ? <span className="text-green-600">Approved</span> : <span className="text-red-600">Rejected</span>}
                  </td>
                  <td className="p-2 border">
                    {req.status === 'Pending' && (
                      <>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                          onClick={() => handleAction(req.id, 'Approved')}
                        >Approve</button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          onClick={() => handleAction(req.id, 'Rejected')}
                        >Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ApproveLeave;