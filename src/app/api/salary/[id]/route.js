import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Salary from '@/models/Salary';

// GET salary by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const salary = await Salary.findById(params.id).populate('employee', 'name empid');
    if (!salary) {
      return NextResponse.json({ error: 'Salary not found' }, { status: 404 });
    }
    return NextResponse.json(salary);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update salary
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const data = await request.json();
    const salary = await Salary.findByIdAndUpdate(params.id, data, { new: true });
    if (!salary) {
      return NextResponse.json({ error: 'Salary not found' }, { status: 404 });
    }
    return NextResponse.json(salary);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE salary
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const salary = await Salary.findByIdAndDelete(params.id);
    if (!salary) {
      return NextResponse.json({ error: 'Salary not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Salary deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}