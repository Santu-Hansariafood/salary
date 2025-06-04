
import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import axios from 'axios';

// Register fonts with correct configuration
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlfBBc9.ttf', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  box: {
    border: '1px solid #000',
    padding: 8,
    marginBottom: 10,
  },
  header: {
    marginBottom: 15,
    borderBottom: '2px solid #000',
    paddingBottom: 8,
  },
  companyName: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyAddress: {
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  col50: {
    width: '50%',
  },
  label: {
    width: '35%',
    fontWeight: 'bold',
    fontSize: 9,
  },
  value: {
    width: '65%',
    fontSize: 9,
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
    border: '1px solid #000',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 6,
    fontWeight: 'bold',
    borderBottom: '1px solid #000',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 6,
    borderBottom: '1px solid #ccc',
    fontSize: 9,
  },
  col33: {
    width: '33.33%',
    borderRight: '1px solid #ccc',
    paddingHorizontal: 4,
  },
  totalRow: {
    flexDirection: 'row',
    padding: 6,
    backgroundColor: '#f9f9f9',
    fontWeight: 'bold',
    fontSize: 9,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  signature: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingTop: 15,
    borderTop: '1px solid #000',
    fontSize: 9,
  }
});

const calculatePTax = (grossSalary) => {
  const monthlyGross = grossSalary;
  if (monthlyGross <= 10000) return 0;
  if (monthlyGross <= 15000) return 150;
  if (monthlyGross <= 25000) return 130;
  if (monthlyGross <= 40000) return 150;
  return 200;
};

const calculateSalaryComponents = (grossSalary) => {
  const basic = grossSalary * 0.65;
  const hra = grossSalary * 0.25;
  const conveyance = grossSalary * 0.10;
  
  // Deductions
  const pf = basic * 0.12;
  const esic = basic * 0.0075;
  const ptax = calculatePTax(grossSalary);
  
  const totalEarnings = basic + hra + conveyance;
  const totalDeductions = pf + esic + ptax;
  const netPayable = totalEarnings - totalDeductions;

  return {
    basic,
    hra,
    conveyance,
    pf,
    esic,
    ptax,
    totalEarnings,
    totalDeductions,
    netPayable
  };
};

const formatCurrency = (amount) => {
  return `Rs. ${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
};

const PaySlipPDF = ({ mobile }) => {
  const [employeeData, setEmployeeData] = useState(null);
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data for mobile:', mobile);
      
      if (!mobile) {
        setError('Mobile number is required');
        setLoading(false);
        return;
      }
      
      try {
        const employeeResponse = await axios.get('/api/employee', {
          params: { mobile }
        });
        console.log('Employee API response:', employeeResponse.data);

        if (!employeeResponse.data) {
          setError('Employee not found');
          setLoading(false);
          return;
        }

        const employee = employeeResponse.data;
        console.log('Found employee:', employee);
        
        // Use employee._id instead of empid for salary lookup
        const salaryResponse = await axios.get('/api/salary', {
          params: { empid: employee._id }
        });
        console.log('Salary API response:', salaryResponse.data);

        if (!salaryResponse.data) {
          setError('Salary data not found');
          setLoading(false);
          return;
        }

        setEmployeeData(employee);
        setSalaryData(salaryResponse.data);
        console.log('Set employee and salary data:', {
          employee: employee,
          salary: salaryResponse.data
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [mobile]);

  if (loading) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Loading payslip data...</Text>
        </Page>
      </Document>
    );
  }

  if (error || !employeeData || !salaryData) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>{error || 'Unable to generate payslip'}</Text>
        </Page>
      </Document>
    );
  }

  const salaryComponents = calculateSalaryComponents(salaryData.grossSalary);
  const paymentDate = new Date(salaryData.paymentDate);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>Hansaria Food Private Limited</Text>
          <Text style={styles.companyAddress}>Primarc Square, Plot No.1, Salt Lake Bypass, LA Block, Sector: 3, Bidhannagar, Kolkata, West Bengal 700098</Text>
          <Text style={styles.title}>SALARY SLIP - {paymentDate.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase()}</Text>
        </View>

        <View style={styles.box}>
          <View style={styles.row}>
            <View style={styles.col50}>
              <View style={styles.row}>
                <Text style={styles.label}>Employee ID:</Text>
                <Text style={styles.value}>{employeeData.empid}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{employeeData.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Position:</Text>
                <Text style={styles.value}>{employeeData.position}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value}>{`${employeeData.village}, ${employeeData.district}, ${employeeData.state} - ${employeeData.zip}`}</Text>
              </View>
            </View>
            <View style={styles.col50}>
              <View style={styles.row}>
                <Text style={styles.label}>Pay Period:</Text>
                <Text style={styles.value}>{paymentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Pay Date:</Text>
                <Text style={styles.value}>{paymentDate.toLocaleDateString()}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Date of Joining:</Text>
                <Text style={styles.value}>{new Date(employeeData.dateOfJoin).toLocaleDateString()}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.box}>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Bank Details</Text>
          <View style={styles.row}>
            <View style={styles.col50}>
              <View style={styles.row}>
                <Text style={styles.label}>Bank Name:</Text>
                <Text style={styles.value}>{employeeData.bankName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Account No:</Text>
                <Text style={styles.value}>{employeeData.accountNumber}</Text>
              </View>
            </View>
            <View style={styles.col50}>
              <View style={styles.row}>
                <Text style={styles.label}>IFSC Code:</Text>
                <Text style={styles.value}>{employeeData.ifsc}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>PAN:</Text>
                <Text style={styles.value}>{employeeData.pan}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col33}>Earnings</Text>
            <Text style={styles.col33}>Amount (Rs.)</Text>
            <Text style={styles.col33}>Deductions</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.col33}>Basic Salary</Text>
            <Text style={styles.col33}>{formatCurrency(salaryComponents.basic)}</Text>
            <Text style={styles.col33}>PF (12%): {formatCurrency(salaryComponents.pf)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.col33}>HRA</Text>
            <Text style={styles.col33}>{formatCurrency(salaryComponents.hra)}</Text>
            <Text style={styles.col33}>ESIC (0.75%): {formatCurrency(salaryComponents.esic)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.col33}>Conveyance</Text>
            <Text style={styles.col33}>{formatCurrency(salaryComponents.conveyance)}</Text>
            <Text style={styles.col33}>Professional Tax: {formatCurrency(salaryComponents.ptax)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.col33}>Total Earnings</Text>
            <Text style={styles.col33}>{formatCurrency(salaryComponents.totalEarnings)}</Text>
            <Text style={styles.col33}>Total Deductions: {formatCurrency(salaryComponents.totalDeductions)}</Text>
          </View>
        </View>

        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.label}>Net Payable:</Text>
            <Text style={styles.value}>{formatCurrency(salaryComponents.netPayable)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.signature}>
            <Text>Employee Signature</Text>
            <Text>Authorized Signature</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PaySlipPDF;