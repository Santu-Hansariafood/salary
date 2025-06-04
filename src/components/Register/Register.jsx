"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import InputBox from '../common/InputBox/InputBox';
import Buttons from '../common/Buttons/Buttons';
import DropdownBox from '../common/DropdownBox/DropdownBox';

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [lastEmpId, setLastEmpId] = useState(0);
  const [nextEmpId, setNextEmpId] = useState('');

  useEffect(() => {
    // Fetch the last employee to get the latest empid number
    const fetchLastEmployee = async () => {
      try {
        const response = await axios.get('/api/employee');
        const employees = response.data;
        if (employees.length > 0) {
          const empIds = employees
            .map(emp => emp.empid)
            .filter(id => id && id.startsWith('HANS'))
            .map(id => parseInt(id.replace('HANS', ''), 10));
          const maxId = Math.max(...empIds, 0);
          setLastEmpId(maxId);
          setNextEmpId(`HANS${(maxId + 1).toString().padStart(4, '0')}`);
        } else {
          setNextEmpId('HANS0001');
        }
      } catch (error) {
        console.error('Error fetching last employee:', error);
      }
    };
    fetchLastEmployee();
  }, []);

  const initialForm = {
    empid: '',
    name: '', 
    email: '', 
    mobile: '', 
    gender: '', 
    position: '', 
    dateOfJoin: '', 
    dob: '', 
    accountNumber: '', 
    ifsc: '', 
    bankName: '', 
    pan: '', 
    adhar: '', 
    pfNumber: '',  // Add PF number field
    esicNumber: '', // Add ESIC number field
    village: '', 
    post: '', 
    policeStation: '', 
    district: '', 
    state: '', 
    zip: ''
  };
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading('Registering employee...');

    try {
      const dataWithEmpId = { ...form, empid: nextEmpId };

      const response = await axios.post('/api/employee', dataWithEmpId);
      
      toast.success('Employee registered successfully!', {
        id: loadingToast,
      });
      
      resetForm();
      router.push('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to register employee';
      toast.error(errorMessage, {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="w-full max-w-4xl p-8 rounded-2xl shadow-2xl bg-white/60 backdrop-blur-md border border-white/40">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">Employee Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputBox 
              label="Employee ID" 
              name="empid" 
              value={nextEmpId} 
              readOnly 
              className="bg-gray-100"
            />
            <InputBox label="Name of Employee" name="name" value={form.name} onChange={handleChange} required />
            <InputBox label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <InputBox label="Mobile" name="mobile" type="tel" value={form.mobile} onChange={handleChange} required />
            <DropdownBox
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              options={[
                { label: 'Male', value: 'Male' },
                { label: 'Female', value: 'Female' },
                { label: 'Other', value: 'Other' }
              ]}
              placeholder="Select Gender"
            />
            <DropdownBox
              label="Position"
              name="position"
              value={form.position}
              onChange={handleChange}
              required
              options={[
                { label: 'Manager', value: 'Manager' },
                { label: 'Developer', value: 'Developer' },
                { label: 'Accounts', value: 'Accounts' },
                { label: 'Marketting', value: 'Marketting' },
                { label: 'Field', value: 'Field' }
              ]}
              placeholder="Select Position"
            />
            <InputBox label="Date of Join" name="dateOfJoin" type="date" value={form.dateOfJoin} onChange={handleChange} required />
            <InputBox label="Account Number" name="accountNumber" value={form.accountNumber} onChange={handleChange} required />
            <InputBox label="IFSC Code" name="ifsc" value={form.ifsc} onChange={handleChange} required />
            <InputBox label="Bank Name" name="bankName" value={form.bankName} onChange={handleChange} required />
            <InputBox label="PAN Number" name="pan" value={form.pan} onChange={handleChange} required />
            <InputBox label="Adhar Number" name="adhar" value={form.adhar} onChange={handleChange} required />
            <InputBox label="PF Number" name="pfNumber" value={form.pfNumber} onChange={handleChange} />
            <InputBox label="ESIC Number" name="esicNumber" value={form.esicNumber} onChange={handleChange} />
            <InputBox label="Village/Town" name="village" value={form.village} onChange={handleChange} required />
            <InputBox label="Post" name="post" value={form.post} onChange={handleChange} required />
            <InputBox label="Police Station" name="policeStation" value={form.policeStation} onChange={handleChange} required />
            <InputBox label="District" name="district" value={form.district} onChange={handleChange} required />
            <InputBox label="State" name="state" value={form.state} onChange={handleChange} required />
            <InputBox label="Zip" name="zip" value={form.zip} onChange={handleChange} required />
            <InputBox label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} required />
          </div>
          <div className="flex justify-center mt-10">
            <Buttons 
              size="lg" 
              color="primary" 
              type="submit" 
              className="w-48 shadow-lg"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Buttons>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;