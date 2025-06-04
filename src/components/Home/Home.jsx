"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Title from '../common/Title/Title'
import Cards from '../common/Cards/Cards'
import Buttons from '../common/Buttons/Buttons'
import TimeSheet from '../TimeSheet/TimeSheet'
import Leaves from '../Leaves/Leaves'
import PaySlip from '../PaySlip/PaySlip'

const Home = () => {
  const { data: session } = useSession();
  const [openContact, setOpenContact] = useState(null);
  const [showTimeSheet, setShowTimeSheet] = useState(false);
  const [showLeaves, setShowLeaves] = useState(false);
  const [showPaySlip, setShowPaySlip] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.mobile) {
        try {
          const response = await axios.get('/api/employee', {
            params: { mobile: session.user.mobile }
          });
          setUserData(response.data);
        } catch (err) {
          setError('Failed to load user data');
        }
      }
    };

    fetchUserData();
  }, [session]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('/api/contacts');
        setContacts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load contacts');
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleDownloadPayslip = () => {
    // Add logic to download payslip
    console.log('Downloading payslip...');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Title>
        Welcome {userData?.name || 'to'} Hansaria Food Work Space
      </Title>
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        {/* Left Column: Celebration */}
        <div className="flex-1">
          <Cards>
            <h2 className="text-xl font-semibold mb-4">Celebration</h2>
            <div className="mb-4">
              <h3 className="font-bold">Birth Days</h3>
              <div className="text-gray-600">🎂 John Doe - 12th May</div>
            </div>
            <div className="mb-4">
              <h3 className="font-bold">Work Anniversary</h3>
              <div className="text-gray-600">🎉 Jane Smith - 3 Years</div>
            </div>
            <div className="mb-4">
              <h3 className="font-bold">Leaves</h3>
              <div className="text-gray-600">No leaves today</div>
            </div>
            <div className="mb-4">
              <h3 className="font-bold">Upcoming Holidays</h3>
              <div className="text-gray-600">Independence Day - 15th Aug</div>
            </div>
            <div className="mb-4">
              <h3 className="font-bold">Anniversary</h3>
              <div className="text-gray-600">No anniversaries today</div>
            </div>
            <div>
              <h3 className="font-bold">New Joinee</h3>
              <div className="text-gray-600">👋 Alex Brown</div>
            </div>
          </Cards>
        </div>
        {/* Right Column: Contacts */}
        <div className="flex-1">
          <Cards>
            <h2 className="text-xl font-semibold mb-4">Contacts</h2>
            {loading ? (
              <div className="text-gray-600">Loading contacts...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : contacts.length === 0 ? (
              <div className="text-gray-600">No contacts found</div>
            ) : (
              contacts.map((contact, idx) => (
                <div key={contact._id || idx} className="mb-4">
                  <button
                    className="text-blue-600 font-medium hover:underline focus:outline-none"
                    onClick={() => setOpenContact(openContact === idx ? null : idx)}
                  >
                    {contact.name}
                  </button>
                  {openContact === idx && (
                    <div className="mt-2 ml-4">
                      <div>
                        <span className="font-semibold">Mobile:</span>{' '}
                        <a href={`tel:${contact.mobile}`} className="text-blue-500 hover:underline">
                          {contact.mobile}
                        </a>
                      </div>
                      <div>
                        <span className="font-semibold">Email:</span>{' '}
                        <a href={`mailto:${contact.email}`} className="text-blue-500 hover:underline">
                          {contact.email}
                        </a>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <a
                          href={`tel:${contact.mobile}`}
                          className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Click to Call
                        </a>
                        <a
                          href={`mailto:${contact.email}`}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Click to Email
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </Cards>
        </div>
      </div>
      {/* Action Buttons Centered Below */}
      <div className="flex justify-center gap-4 mt-8">
        <Buttons size="md" color="primary" onClick={() => setShowTimeSheet(true)}>
          Fill Time Sheets
        </Buttons>
        <Buttons size="md" color="secondary" onClick={() => setShowLeaves(true)}>
          Apply Leave
        </Buttons>
        <Buttons size="md" color="success" onClick={() => setShowPaySlip(true)}>
          Download Payslip
        </Buttons>
      </div>
      {showTimeSheet && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setShowTimeSheet(false)}
            >
              &times;
            </button>
            <TimeSheet mobile={session?.user?.mobile} />
            </div>
        </div>
      )}
      {showLeaves && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setShowLeaves(false)}
            >
              &times;
            </button>
            <Leaves mobile={session?.user?.mobile} />
          </div>
        </div>
      )}
      {showPaySlip && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setShowPaySlip(false)}
            >
              &times;
            </button>
            <PaySlip mobile={session?.user?.mobile} onDownload={handleDownloadPayslip} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;