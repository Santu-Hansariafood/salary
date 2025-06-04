'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const router = useRouter();

  const cards = [
    {
      title: 'Approve Leave',
      description: 'Manage and approve employee leave requests',
      icon: '🗓️',
      path: '/approveleave',
      color: 'from-blue-400 to-blue-600'
    },
    {
      title: 'Approve Timesheet',
      description: 'Review and approve employee timesheets',
      icon: '⏰',
      path: '/approvetimesheet',
      color: 'from-green-400 to-green-600'
    },
    {
      title: 'Assign Leaves',
      description: 'Assign and manage employee leave balances',
      icon: '📅',
      path: '/assignleaves',
      color: 'from-purple-400 to-purple-600'
    },
    {
      title: 'Register Employee',
      description: 'Add new employees to the system',
      icon: '👤',
      path: '/register',
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      title: 'Payment Management',
      description: 'Manage employee salaries and payments',
      icon: '💰',
      path: '/payment',
      color: 'from-red-400 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12 relative">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Manage Employee
          </span>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => router.push(card.path)}
              className="transform hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className={`bg-white rounded-2xl shadow-xl overflow-hidden h-full`}>
                <div className={`p-6 bg-gradient-to-r ${card.color}`}>
                  <div className="text-4xl mb-4 text-white">{card.icon}</div>
                  <h2 className="text-xl font-semibold text-white mb-2">{card.title}</h2>
                  <p className="text-white/80">{card.description}</p>
                </div>
                <div className="px-6 py-4 bg-gradient-to-b from-white to-gray-50">
                  <div className="flex items-center text-gray-600 hover:text-gray-900">
                    <span>Manage →</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;