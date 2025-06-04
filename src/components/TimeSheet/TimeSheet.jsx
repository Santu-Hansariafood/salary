"use client";
import React, { useEffect, useState } from "react";
import {
  getCurrentMonthDates,
  holidays,
  isSunday,
  workDescriptionTemplate,
} from "../common/Lists/Lists";
import axios from "axios";
import { toast } from "react-hot-toast";

const getHolidayName = (dateObj) => {
  const dateStr = dateObj.toISOString().slice(0, 10);
  const holiday = holidays.find((h) => h.date === dateStr);
  return holiday ? holiday.name : "";
};

const TimeSheet = ({ mobile }) => {
  const defaultDates = getCurrentMonthDates();
  const [entries, setEntries] = useState(
    defaultDates.map(({ date }) => ({
      date: date.toISOString().slice(0, 10),
      ...workDescriptionTemplate,
    }))
  );
  const [loading, setLoading] = useState(true);
  const [errorIdx, setErrorIdx] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/timesheet", {
          params: {
            mobile,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          },
        });
        if (res.data?.timesheet?.entries?.length > 0) {
          setEntries(res.data.timesheet.entries);
        }
      } catch (err) {
        toast.error("Failed to load timesheet");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mobile]);

  const handleTimeChange = (idx, field, value) => {
    setEntries((prev) => {
      const updated = prev.map((en, i) =>
        i === idx ? { ...en, [field]: value } : en
      );
      // Validation: if both times are filled, check order
      const entry = updated[idx];
      if (entry.startTime && entry.endTime) {
        if (entry.endTime <= entry.startTime) {
          setErrorIdx(idx);
          setErrorMsg("End time must be after start time");
        } else {
          setErrorIdx(null);
          setErrorMsg("");
        }
      } else {
        setErrorIdx(null);
        setErrorMsg("");
      }
      return updated;
    });
  };

  const handleSave = async () => {
    // Prevent save if any error
    if (errorIdx !== null) {
      toast.error("Please fix errors before saving.");
      return;
    }
    try {
      await axios.post("/api/timesheet", {
        mobile,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        entries,
      });
      toast.success("Timesheet saved successfully!");
    } catch (err) {
      toast.error("Failed to save timesheet");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4 text-center">
          Time Sheet -{" "}
          {new Date().toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="overflow-x-auto">
          <div className="overflow-y-auto max-h-[400px] border rounded-lg">
            <table className="min-w-[900px] w-full border border-gray-300">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Day</th>
                  <th className="p-2 border">Holiday</th>
                  <th className="p-2 border">Start Time</th>
                  <th className="p-2 border">End Time</th>
                  <th className="p-2 border">Work Description</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => {
                  const date = new Date(entry.date);
                  const isHoliday = !!getHolidayName(date);
                  const sunday = isSunday(date);
                  const dayName = date.toLocaleDateString("default", {
                    weekday: "short",
                  });
                  // Only disable for holiday or Sunday
                  const isReadOnly = isHoliday || sunday;
                  return (
                    <tr
                      key={entry.date}
                      className={
                        isHoliday
                          ? "bg-yellow-100"
                          : sunday
                          ? "bg-red-100"
                          : ""
                      }
                    >
                      <td className="p-2 border">{date.toLocaleDateString()}</td>
                      <td className="p-2 border">{dayName}</td>
                      <td className="p-2 border">
                        {isHoliday
                          ? getHolidayName(date)
                          : sunday
                          ? "Sunday"
                          : ""}
                      </td>
                      <td className="p-2 border">
                        <input
                          type="time"
                          className="border rounded px-2 py-1 w-28"
                          value={entry.startTime}
                          onChange={(e) =>
                            handleTimeChange(idx, "startTime", e.target.value)
                          }
                          disabled={isReadOnly}
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="time"
                          className="border rounded px-2 py-1 w-28"
                          value={entry.endTime}
                          onChange={(e) =>
                            handleTimeChange(idx, "endTime", e.target.value)
                          }
                          disabled={isReadOnly}
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          className="border rounded px-2 py-1 w-48"
                          value={entry.description}
                          onChange={(e) =>
                            setEntries((prev) =>
                              prev.map((en, i) =>
                                i === idx
                                  ? { ...en, description: e.target.value }
                                  : en
                              )
                            )
                          }
                          disabled={isReadOnly}
                        />
                        {errorIdx === idx && errorMsg && (
                          <div className="text-red-500 text-xs mt-1">{errorMsg}</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500 text-center">
          <span className="bg-yellow-100 px-2 py-1 rounded mr-2">Holiday</span>
          <span className="bg-red-100 px-2 py-1 rounded">Sunday</span>
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeSheet;
