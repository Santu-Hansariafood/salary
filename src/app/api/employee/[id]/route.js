 import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Employee from '@/models/Employee';

// GET employee by ID
export async function GET(req, { params }) {
  try {
    await connectDB();
    const employee = await Employee.findById(params.id);

    if (!employee) {
      return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error('GET by ID error:', error);
    return NextResponse.json({ message: 'Failed to fetch employee' }, { status: 500 });
  }
}

// PUT update employee
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const data = await req.json();

    const exists = await Employee.findOne({
      _id: { $ne: params.id },
      $or: [
        { email: data.email },
        { mobile: data.mobile },
        { pan: data.pan },
        { adhar: data.adhar }
      ]
    });

    if (exists) {
      return NextResponse.json(
        { message: 'These details are already registered with another employee' },
        { status: 400 }
      );
    }

    const updated = await Employee.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ message: 'Failed to update employee' }, { status: 500 });
  }
}

// DELETE employee
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const deleted = await Employee.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ message: 'Failed to delete employee' }, { status: 500 });
  }
}
