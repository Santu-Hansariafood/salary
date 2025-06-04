'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignLeaves = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [casualLeaves, setCasualLeaves] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employee');
      setEmployees(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch employees');
      setLoading(false);
    }
  };

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      }
      return [...prev, employeeId];
    });
  };

  const handleAssignToAll = () => {
    setSelectedEmployees(employees.map(emp => emp._id));
  };

  const handleSubmit = async () => {
    if (!casualLeaves || casualLeaves < 0) {
      setError('Please enter a valid number of casual leaves');
      return;
    }

    if (selectedEmployees.length === 0) {
      setError('Please select at least one employee');
      return;
    }

    // Here you would implement the API call to update leaves
    console.log('Assigning', casualLeaves, 'leaves to', selectedEmployees);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex gap-4 p-4">
      {/* Left side - Employee List */}
      <div className="w-1/2 border rounded p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Company List</h2>
          <button
            onClick={handleAssignToAll}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Assign to All
          </button>
        </div>
        <div className="space-y-2">
          {employees.map(employee => (
            <div
              key={employee._id}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
            >
              <input
                type="checkbox"
                checked={selectedEmployees.includes(employee._id)}
                onChange={() => handleEmployeeSelect(employee._id)}
                className="h-4 w-4"
              />
              <span>{employee.name}</span>
              <span className="text-gray-500">({employee._id})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Assign Leaves */}
      <div className="w-1/2 border rounded p-4">
        <h2 className="text-xl font-bold mb-4">Assign Casual Leaves</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Casual Leaves
            </label>
            <input
              type="number"
              value={casualLeaves}
              onChange={(e) => setCasualLeaves(e.target.value)}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignLeaves;