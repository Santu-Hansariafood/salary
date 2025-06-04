import mongoose from "mongoose";

const ApprovedTimesheetSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  workingDays: {
    type: Number,
    required: true,
  },
  totalWorkingHours: {
    type: Number,
    required: true,
  },
  entries: [
    {
      date: String,
      startTime: String,
      endTime: String,
      workStatus: String,
      description: String,
    },
  ],
  approvedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ApprovedTimesheet ||
  mongoose.model("ApprovedTimesheet", ApprovedTimesheetSchema);
