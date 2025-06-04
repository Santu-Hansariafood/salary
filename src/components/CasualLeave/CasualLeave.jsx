"use client";

import React, { useState } from 'react';
import InputBox from '../common/InputBox/InputBox';

const mockEmployees = [
  { id: 1, name: 'John Doe', casualLeave: 0 },
  { id: 2, name: 'Jane Smith', casualLeave: 0 },
  { id: 3, name: 'Alice Brown', casualLeave: 0 }
];

const CasualLeave = () => {
  const [employees, setEmployees] = useState(mockEmployees);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (id, value) => {
    setEmployees(prev =>
      prev.map(emp =>
        emp.id === id ? { ...emp, casualLeave: value === '' ? '' : Number(value) } : emp
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you can process the assigned casual leaves for each employee
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 py-8">
      <div className="w-full max-w-2xl bg-white bg-opacity-80 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Assign Casual Leave</h2>
        <form onSubmit={handleSubmit}>
          <table className="min-w-full bg-white rounded-lg mb-6">
            <thead>
              <tr className="bg-blue-200 text-gray-700">
                <th className="py-2 px-4">Employee ID</th>
                <th className="py-2 px-4">Employee Name</th>
                <th className="py-2 px-4">Casual Leave</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} className="border-b last:border-b-0">
                  <td className="py-2 px-4">{emp.id}</td>
                  <td className="py-2 px-4">{emp.name}</td>
                  <td className="py-2 px-4">
                    <InputBox
                      type="number"
                      name={`casualLeave-${emp.id}`}
                      value={emp.casualLeave}
                      onChange={e => handleChange(emp.id, e.target.value)}
                      min={0}
                      required
                      onWheel={e => e.target.blur()}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition w-full"
            disabled={submitted}
          >
            {submitted ? 'Leaves Assigned' : 'Assign Leaves'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CasualLeave;