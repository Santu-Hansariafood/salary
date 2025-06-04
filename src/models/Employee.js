import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  empid: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  email: String,
  mobile: String,
  gender: String,
  position: String,
  dateOfJoin: Date,
  dob: Date,
  accountNumber: String,
  ifsc: String,
  bankName: String,
  pan: String,
  adhar: String,
  village: String,
  post: String,
  policeStation: String,
  district: String,
  state: String,
  zip: String,
  password: String,
  role: {
    type: String,
    enum: ['employee', 'admin'],
    default: 'employee'
  },
  esicNumber: String,  // Add this field
  pfNumber: String,    // Add this field for PF tracking
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
