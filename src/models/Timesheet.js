import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
  date: { type: String, required: true },
  startTime: { type: String, default: "" },
  endTime: { type: String, default: "" },
  description: { type: String, default: "" },
});

const timesheetSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    match: /^\d{10}$/,
  },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  entries: [entrySchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Timesheet || mongoose.model("Timesheet", timesheetSchema);
