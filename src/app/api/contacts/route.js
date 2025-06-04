import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Employee from '@/models/Employee';

export async function GET() {
  try {
    await connectDB();
    const employees = await Employee.find()
      .select('name mobile email')
      .sort({ name: 1 })  // 1 for ascending order by name
      .collation({ locale: 'en' }); // For case-insensitive sorting
    return NextResponse.json(employees);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}