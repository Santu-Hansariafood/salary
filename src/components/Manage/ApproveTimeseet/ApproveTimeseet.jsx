"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Utility function to calculate working days, half days, total working hours, and overtime
const calculateWorkStats = (entries) => {
  let workingDays = 0;
  let totalWorkingHours = 0;
  let totalOvertime = 0;

  if (!entries || !Array.isArray(entries))
    return { workingDays, totalWorkingHours, totalOvertime };

  entries.forEach((entry) => {
    const { workStatus, startTime, endTime } = entry;
    const isWorking =
      workStatus &&
      !workStatus.toLowerCase().includes("leave") &&
      startTime &&
      endTime;
    if (isWorking) {
      const start = new Date(`1970-01-01T${startTime}:00`);
      const end = new Date(`1970-01-01T${endTime}:00`);
      if (!isNaN(start) && !isNaN(end) && end > start) {
        const hours = (end - start) / (1000 * 60 * 60);
        totalWorkingHours += hours;
        if (hours >= 8) {
          workingDays++;
        }
        if (hours > 9) {
          totalOvertime += hours - 9;
        }
      }
    }
  });
  return {
    workingDays,
    totalWorkingHours: Number(totalWorkingHours.toFixed(2)),
    totalOvertime: Number(totalOvertime.toFixed(2)),
  };
};

const ApproveTimesheet = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [timesheets, setTimesheets] = useState({});
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState({});

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const empRes = await axios.get("/api/employee");
      const employees = empRes.data;
      const timesheetData = {};
      for (const emp of employees) {
        try {
          const tsRes = await axios.get("/api/timesheet", {
            params: { mobile: emp.mobile, month, year },
          });
          timesheetData[emp.mobile] = tsRes.data.timesheet;
        } catch (err) {
          timesheetData[emp.mobile] = null;
        }
      }
      setEmployeeList(employees);
      setTimesheets(timesheetData);
    } catch (error) {
      toast.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [month, year]);

  const handleApprove = async (mobile) => {
    const timesheet = timesheets[mobile];
    if (!timesheet || !timesheet.entries) return;
    setApproving((prev) => ({ ...prev, [mobile]: true }));
    const { workingDays, totalWorkingHours, totalOvertime } =
      calculateWorkStats(timesheet.entries);
    try {
      await axios.post("/api/timesheet/approve", {
        mobile,
        month,
        year,
        workingDays,
        totalWorkingHours,
        totalOvertime,
        entries: timesheet.entries,
      });
      toast.success("Timesheet approved!");
      const tsRes = await axios.get("/api/timesheet", {
        params: { mobile, month, year },
      });
      setTimesheets((prev) => ({ ...prev, [mobile]: tsRes.data.timesheet }));
    } catch (err) {
      toast.error("Approval failed.");
    } finally {
      setApproving((prev) => ({ ...prev, [mobile]: false }));
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        All Employee Timesheets
      </h2>
      <div className="flex gap-4 mb-6 justify-center">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border rounded px-3 py-2 shadow"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border rounded px-3 py-2 shadow"
        >
          {[2023, 2024, 2025].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p className="text-center text-lg">Loading timesheets...</p>
      ) : (
        <div className="space-y-8">
          {employeeList.map((emp) => {
            const ts = timesheets[emp.mobile];
            const { workingDays, totalWorkingHours, totalOvertime } =
              calculateWorkStats(ts?.entries || []);

            return (
              <div
                key={emp.mobile}
                className="border rounded-lg p-6 bg-white shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {emp.name}{" "}
                    <span className="text-gray-500">({emp.mobile})</span>
                    {ts?.approved && (
                      <span className="ml-2 text-green-600 font-medium">
                        (Approved)
                      </span>
                    )}
                  </h3>
                  <button
                    className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-5 py-2 rounded shadow hover:from-green-500 hover:to-blue-600 transition disabled:opacity-50"
                    onClick={() => handleApprove(emp.mobile)}
                    disabled={approving[emp.mobile] || !ts}
                  >
                    {approving[emp.mobile] ? "Approving..." : "Approve"}
                  </button>
                </div>
                {!ts ? (
                  <p className="text-red-500">No timesheet found.</p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-2">
                      Working Days: <strong>{workingDays}</strong> | Total
                      Hours: <strong>{totalWorkingHours}</strong> | Overtime:{" "}
                      <strong>{totalOvertime}</strong>
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full mt-2 border text-sm rounded-lg overflow-hidden">
                        <thead className="bg-blue-100">
                          <tr>
                            <th className="border px-2 py-1">Date</th>
                            <th className="border px-2 py-1">Day</th>
                            <th className="border px-2 py-1">Start Time</th>
                            <th className="border px-2 py-1">End Time</th>
                            <th className="border px-2 py-1">Work Status</th>
                            <th className="border px-2 py-1">
                              Description / Leave
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {ts.entries.map((entry) => {
                            const dateObj = new Date(entry.date);
                            const dayIdx = dateObj.getDay();
                            const isSunday = dayIdx === 0;
                            const isMonday = dayIdx === 1;
                            const leave =
                              entry.workStatus &&
                              entry.workStatus.toLowerCase().includes("leave");
                            return (
                              <tr
                                key={entry.date}
                                className={
                                  isSunday
                                    ? "bg-red-100"
                                    : isMonday
                                    ? "bg-yellow-50"
                                    : leave
                                    ? "bg-orange-100"
                                    : ""
                                }
                              >
                                <td className="border px-2 py-1 font-medium">
                                  {entry.date}
                                </td>
                                <td className="border px-2 py-1">
                                  {dayNames[dayIdx]}
                                </td>
                                <td className="border px-2 py-1">
                                  {entry.startTime || "-"}
                                </td>
                                <td className="border px-2 py-1">
                                  {entry.endTime || "-"}
                                </td>
                                <td className="border px-2 py-1">
                                  {entry.workStatus}
                                </td>
                                <td className="border px-2 py-1">
                                  {leave ? (
                                    <span className="text-orange-600 font-semibold">
                                      {entry.description || "On Leave"}
                                    </span>
                                  ) : (
                                    entry.description
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApproveTimesheet;
