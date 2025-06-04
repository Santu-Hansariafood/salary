import mongoose from 'mongoose';

const SalarySchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  empid: {
    type: String,
    required: true
  },
  grossSalary: {
    type: Number,
    required: true
  },
  increment: {
    type: Number,
    default: 0
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.models.Salary || mongoose.model('Salary', SalarySchema);