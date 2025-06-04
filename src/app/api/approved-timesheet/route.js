import dbConnect from "@/lib/dbConnect";
import ApprovedTimesheet from "@/models/ApprovedTimesheet";
import Timesheet from "@/models/Timesheet";
import Employee from "@/models/Employee";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  if (method === "GET") {
    try {
      const { mobile, month, year } = req.query;
      let query = {};
      if (mobile) query.mobile = mobile;
      if (month) query.month = parseInt(month);
      if (year) query.year = parseInt(year);

      const data = await ApprovedTimesheet.find(query);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ message: "Failed to fetch", error: err.message });
    }
  }

  if (method === "POST") {
    const { mobile, month, year } = req.body;

    try {
      const existing = await ApprovedTimesheet.findOne({ mobile, month, year });
      if (existing) return res.status(400).json({ message: "Already approved" });

      const employee = await Employee.findOne({ mobile });
      const timesheet = await Timesheet.findOne({ mobile, month, year });
      if (!employee || !timesheet) {
        return res.status(404).json({ message: "Employee or timesheet not found" });
      }

      let totalHours = 0;
      let workingDays = 0;

      const entries = timesheet.entries.map((entry) => {
        const { startTime, endTime, workStatus } = entry;
        let hours = 0;

        if (startTime && endTime) {
          const start = new Date(`1970-01-01T${startTime}:00`);
          const end = new Date(`1970-01-01T${endTime}:00`);
          hours = (end - start) / (1000 * 60 * 60);
          if (hours < 0) hours = 0;
        }

        const isLeave = workStatus?.toLowerCase().includes("leave");
        const isSunday = new Date(entry.date).getDay() === 0;

        if (!isSunday && !isLeave && hours > 0) workingDays += 1;
        totalHours += hours;

        return {
          ...entry,
          workingHours: parseFloat(hours.toFixed(2)),
        };
      });

      const approved = new ApprovedTimesheet({
        employeeName: employee.name,
        mobile,
        month,
        year,
        totalWorkingHours: parseFloat(totalHours.toFixed(2)),
        totalWorkingDays: workingDays,
        entries,
      });

      await approved.save();
      return res.status(200).json({ message: "Timesheet approved", approved });
    } catch (err) {
      return res.status(500).json({ message: "Failed to approve", error: err.message });
    }
  }

  if (method === "PUT") {
    try {
      const { _id, updates } = req.body;
      const updated = await ApprovedTimesheet.findByIdAndUpdate(_id, updates, { new: true });
      return res.status(200).json(updated);
    } catch (err) {
      return res.status(500).json({ message: "Failed to update", error: err.message });
    }
  }

  if (method === "DELETE") {
    try {
      const { _id } = req.body;
      await ApprovedTimesheet.findByIdAndDelete(_id);
      return res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Failed to delete", error: err.message });
    }
  }

  return res.status(405).end();
}
