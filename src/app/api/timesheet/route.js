import { NextResponse } from "next/server";
import Timesheet from "@/models/Timesheet";
import dbConnect from "@/lib/db";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { mobile, entries } = body;

    if (!/^\d{10}$/.test(mobile)) {
      return NextResponse.json({ error: "Invalid mobile number" }, { status: 400 });
    }

    const now = new Date();
    const month = now.getMonth() + 1; // <-- FIXED: match frontend
    const year = now.getFullYear();

    const updated = await Timesheet.findOneAndUpdate(
      { mobile, month, year },
      { $set: { entries } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, timesheet: updated });
  } catch (error) {
    console.error("POST timesheet error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// /api/timesheet/route.js or route.ts
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const mobile = searchParams.get("mobile");
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));

    if (!month || !year) {
      return NextResponse.json({ error: "Missing month or year" }, { status: 400 });
    }

    // Case 1: Admin view — no mobile provided → return all timesheets for month/year
    if (!mobile) {
      const allTimesheets = await Timesheet.find({ month, year });
      return NextResponse.json({ timesheets: allTimesheets });
    }

    // Case 2: Regular user view → return one timesheet
    let timesheet = await Timesheet.findOne({ mobile, month, year });

    if (!timesheet) {
      const { getCurrentMonthDates, workDescriptionTemplate } = require("@/app/common/Lists/Lists");
      const defaultEntries = getCurrentMonthDates().map(({ date }) => ({
        date: date.toISOString().slice(0, 10),
        ...workDescriptionTemplate,
      }));

      timesheet = await Timesheet.create({ mobile, month, year, entries: defaultEntries });
    }

    return NextResponse.json({ timesheet });
  } catch (error) {
    console.error("GET timesheet error:", error);
    return NextResponse.json({ error: "Failed to fetch timesheet" }, { status: 500 });
  }
}
