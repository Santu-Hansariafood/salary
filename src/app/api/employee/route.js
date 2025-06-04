import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Employee from '@/models/Employee';

// GET all employees
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const mobile = searchParams.get('mobile');
    
    if (mobile) {
      const employee = await Employee.findOne({ mobile: mobile });
      if (!employee) {
        return NextResponse.json(null, { status: 404 });
      }
      return NextResponse.json(employee);
    }
    
    const employees = await Employee.find().sort({ createdAt: -1 });
    return NextResponse.json(employees);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST create employee
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    const existing = await Employee.findOne({
      $or: [
        { email: data.email },
        { mobile: data.mobile },
        { pan: data.pan },
        { adhar: data.adhar }
      ]
    });

    if (existing) {
      return NextResponse.json(
        { message: 'Employee already exists with these details' },
        { status: 400 }
      );
    }

    const newEmployee = await Employee.create(data);
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ message: 'Failed to create employee' }, { status: 500 });
  }
}
