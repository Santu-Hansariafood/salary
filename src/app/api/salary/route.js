import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Salary from '@/models/Salary';

// GET all salaries
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const mobile = searchParams.get("mobile");
    const month = parseInt(searchParams.get("month"));
    const year = parseInt(searchParams.get("year"));

    if (mobile && month && year) {
      const timesheet = await Timesheet.findOne({ mobile, month, year });
      if (!timesheet) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ timesheet });
    }

    // If no query params, return all
    const allSheets = await Timesheet.find();
    return NextResponse.json(allSheets);
  } catch (error) {
    console.error("GET timesheet error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


// POST new salary
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const salary = await Salary.create(data);
    return NextResponse.json(salary, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}