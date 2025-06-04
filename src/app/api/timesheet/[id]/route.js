import { NextResponse } from "next/server";
import Timesheet from "@/models/Timesheet";
import dbConnect from "@/lib/db";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const timesheet = await Timesheet.findById(params.id);

    if (!timesheet) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(timesheet);
  } catch (error) {
    console.error("GET one timesheet error:", error);
    return NextResponse.json({ error: "Invalid ID or server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const deleted = await Timesheet.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE timesheet error:", error);
    return NextResponse.json({ error: "Invalid ID or server error" }, { status: 500 });
  }
}
