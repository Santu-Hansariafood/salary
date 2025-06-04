'use client';
import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PaySlipPDF from './PaySlipPDF/PaySlipPDF';

const PaySlip = ({ mobile, onDownload }) => {
  if (!mobile) {
    return (
      <div className="text-center p-4">
        <h2 className="text-xl font-semibold mb-4">Error</h2>
        <p className="text-red-500">Unable to generate payslip: Missing employee information</p>
      </div>
    );
  }

  return (
    <div className="text-center p-4">
      <h2 className="text-xl font-semibold mb-4">Download Pay Slip</h2>
      <PDFDownloadLink
        document={<PaySlipPDF mobile={mobile} />}
        fileName={`PaySlip_Hansaria_${new Date().toLocaleDateString('en-GB')}.pdf`}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-flex items-center gap-2"
      >
        {({ loading, error }) => {
          if (error) {
            return (
              <span className="text-red-500">Error generating PDF</span>
            );
          }
          
          return loading ? (
            <>
              <span className="animate-spin">↻</span>
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <span>📄</span>
              <span>Download Pay Slip</span>
            </>
          );
        }}
      </PDFDownloadLink>
    </div>
  );
};

export default PaySlip;
