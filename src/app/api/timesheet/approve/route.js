import dbConnect from "@/lib/db";
import ApprovedTimesheet from "@/models/ApprovedTimesheet";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();

    const {
      mobile,
      month,
      year,
      workingDays,
      totalWorkingHours,
      entries,
    } = data;

    if (
      !mobile ||
      !month ||
      !year ||
      workingDays == null ||
      totalWorkingHours == null ||
      !Array.isArray(entries)
    ) {
      return new Response(JSON.stringify({ error: "Invalid data" }), {
        status: 400,
      });
    }

    // Save/Update just one timesheet (for one mobile)
    await ApprovedTimesheet.findOneAndUpdate(
      { mobile, month, year },
      {
        mobile,
        month,
        year,
        workingDays,
        totalWorkingHours,
        entries,
        approvedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Approve error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
