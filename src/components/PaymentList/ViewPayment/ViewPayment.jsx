"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const ViewPayment = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!params.id) {
        toast.error("Payment ID is required");
        setLoading(false);
        return;
      }

      try {
        const salaryResponse = await axios.get(`/api/salary/${params.id}`);
        const salary = salaryResponse.data;

        const employeeResponse = await axios.get(`/api/employee`);
        const employees = employeeResponse.data;
        const employee = employees.find(emp => emp.empid === salary.empid);

        // Calculate components based on gross salary and round off
        const basic = Math.round(salary.grossSalary * 0.65);
        const hra = Math.round(salary.grossSalary * 0.25);
        const conveyance = Math.round(salary.grossSalary * 0.1);

        let pf = null;
        let esic = null;

        if (employee?.pfNumber && employee.pfNumber !== "0") {
          pf = salary.grossSalary >= 21000 ? 1800 : Math.round(basic * 0.12);
        }

        if (
          employee?.esicNumber &&
          employee.esicNumber !== "0" &&
          salary.grossSalary < 21000
        ) {
          esic = Math.round(salary.grossSalary * 0.0075);
        }

        const ptax = calculatePTax(salary.grossSalary);

        setPaymentDetails({
          id: salary.empid,
          name: employee?.name || "N/A",
          grossSalary: Math.round(salary.grossSalary),
          earnings: {
            basic,
            hra,
            conveyance,
          },
          deductions: {
            pf,
            esic,
            ptax,
          },
          payableDate: salary.paymentDate,
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [params.id]);

  const calculatePTax = (grossSalary) => {
    if (grossSalary <= 10000) return 0;
    if (grossSalary <= 15000) return 150;
    if (grossSalary <= 25000) return 130;
    if (grossSalary <= 40000) return 150;
    return 200;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Payment details not found</p>
      </div>
    );
  }

  const totalDeductions =
    paymentDetails.deductions.pf +
    paymentDetails.deductions.esic +
    paymentDetails.deductions.ptax;

  const inHandPayment = paymentDetails.grossSalary - totalDeductions;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4 text-center">Payment Details</h2>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <tbody>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
            <td className="border border-gray-300 px-4 py-2">
              {paymentDetails.id}
            </td>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Employee Name
            </th>
            <td className="border border-gray-300 px-4 py-2">
              {paymentDetails.name}
            </td>
          </tr>

          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Gross Salary
            </th>
            <td colSpan="3" className="border border-gray-300 px-4 py-2">
              ₹{paymentDetails.grossSalary.toLocaleString()}
            </td>
          </tr>

          <tr className="bg-gray-100">
            <th
              colSpan="4"
              className="border border-gray-300 px-4 py-2 text-left"
            >
              Earnings
            </th>
          </tr>
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Basic
            </th>
            <td className="border border-gray-300 px-4 py-2">
              ₹{paymentDetails.earnings.basic.toLocaleString()}
            </td>
            <th className="border border-gray-300 px-4 py-2 text-left">HRA</th>
            <td className="border border-gray-300 px-4 py-2">
              ₹{paymentDetails.earnings.hra.toLocaleString()}
            </td>
          </tr>
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Conveyance
            </th>
            <td className="border border-gray-300 px-4 py-2" colSpan="3">
              ₹{paymentDetails.earnings.conveyance.toLocaleString()}
            </td>
          </tr>

          <tr className="bg-gray-100">
            <th
              colSpan="4"
              className="border border-gray-300 px-4 py-2 text-left"
            >
              Deductions
            </th>
          </tr>
          {paymentDetails.deductions.pf !== null && (
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">PF</th>
              <td className="border border-gray-300 px-4 py-2">
                ₹{paymentDetails.deductions.pf.toLocaleString()}
              </td>
              {paymentDetails.deductions.esic !== null ? (
                <>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    ESIC
                  </th>
                  <td className="border border-gray-300 px-4 py-2">
                    ₹{paymentDetails.deductions.esic.toLocaleString()}
                  </td>
                </>
              ) : (
                <>
                  <th className="border border-gray-300 px-4 py-2 text-left"></th>
                  <td className="border border-gray-300 px-4 py-2"></td>
                </>
              )}
            </tr>
          )}

          {paymentDetails.deductions.pf === null &&
            paymentDetails.deductions.esic !== null && (
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  ESIC
                </th>
                <td className="border border-gray-300 px-4 py-2" colSpan="3">
                  ₹{paymentDetails.deductions.esic.toLocaleString()}
                </td>
              </tr>
            )}

          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">PTax</th>
            <td className="border border-gray-300 px-4 py-2" colSpan="3">
              ₹{paymentDetails.deductions.ptax.toLocaleString()}
            </td>
          </tr>

          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              In-Hand Payment
            </th>
            <td
              className="border border-gray-300 px-4 py-2 text-green-700 font-semibold"
              colSpan="3"
            >
              ₹{inHandPayment.toLocaleString()}
            </td>
          </tr>

          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Payable Date
            </th>
            <td className="border border-gray-300 px-4 py-2" colSpan="3">
              {new Date(paymentDetails.payableDate).toLocaleDateString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ViewPayment;
