'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const PaymentList = () => {
  const [salaryData, setSalaryData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const res = await axios.get('/api/salary');
        setSalaryData(res.data);
        toast.success('Salary data loaded successfully');
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch salary data');
      }
    };

    fetchSalaries();
  }, []);

  const handleView = (id) => {
    router.push(`/paymentlist/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4 text-center">Salary Payment List</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Emp ID</th>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Gross Salary</th>
              <th className="border px-4 py-2 text-left">Payment Date</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {salaryData.map((item) => (
              <tr key={item._id}>
                <td 
                  className="border px-4 py-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                  onClick={() => handleView(item._id)}
                >
                  {item.empid}
                </td>
                <td className="border px-4 py-2">{item.employee?.name}</td>
                <td className="border px-4 py-2">₹{item.grossSalary.toLocaleString()}</td>
                <td className="border px-4 py-2">
                  {new Date(item.paymentDate).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2 capitalize">{item.status}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleView(item._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {salaryData.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentList;
