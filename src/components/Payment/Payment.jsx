"use client";

import React, { useState, useEffect } from "react";
import InputBox from "../common/InputBox/InputBox";
import axios from "axios";
import { toast } from "react-hot-toast";

const Payment = () => {
  const [employees, setEmployees] = useState([]);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeesAndSalaries = async () => {
      try {
        const [employeesRes, salariesRes] = await Promise.all([
          axios.get("/api/employee"),
          axios.get("/api/salary"),
        ]);

        const salaryMap = new Map(
          salariesRes.data.map((salary) => [salary.employee, salary])
        );

        const employeeData = employeesRes.data.map((emp) => {
          const existingSalary = salaryMap.get(emp._id);
          return {
            id: emp._id,
            empid: emp.empid,
            name: emp.name,
            grossSalary: existingSalary ? existingSalary.grossSalary : 0,
            salaryId: existingSalary ? existingSalary._id : null,
          };
        });

        setEmployees(employeeData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        toast.error("Failed to fetch employee data");
        setLoading(false);
      }
    };

    fetchEmployeesAndSalaries();
  }, []);

  const handleChange = (id, field, value) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? { ...emp, [field]: value === "" ? "" : Number(value) }
          : emp
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const salaryPromises = employees.map((emp) => {
        const salaryData = {
          employee: emp.id,
          empid: emp.empid,
          grossSalary: emp.grossSalary,
          status: "paid",
        };

        return emp.salaryId
          ? axios.put(`/api/salary/${emp.salaryId}`, salaryData)
          : axios.post("/api/salary", salaryData);
      });

      await Promise.all(salaryPromises);
      setPaid(true);
      toast.success("Salary submitted successfully!");
    } catch (err) {
      setError("Failed to save salary data");
      toast.error("Failed to submit salary data");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 py-8">
      <div className="w-full max-w-4xl bg-white bg-opacity-80 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Salary Payment
        </h2>
        <form onSubmit={handleSubmit}>
          <table className="min-w-full bg-white rounded-lg mb-6">
            <thead>
              <tr className="bg-blue-200 text-gray-700">
                <th className="py-2 px-4">Employee ID</th>
                <th className="py-2 px-4">Employee Name</th>
                <th className="py-2 px-4">Gross Salary</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b last:border-b-0">
                  <td className="py-2 px-4">{emp.empid}</td>
                  <td className="py-2 px-4">{emp.name}</td>
                  <td className="py-2 px-4">
                    <InputBox
                      type="number"
                      name={`grossSalary-${emp.id}`}
                      value={emp.grossSalary}
                      onChange={(e) =>
                        handleChange(emp.id, "grossSalary", e.target.value)
                      }
                      required
                      min={0}
                      step={1}
                      onWheel={(e) => e.target.blur()}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition w-full"
            disabled={paid}
          >
            {paid ? "Salary Paid" : "Submit Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
