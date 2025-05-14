import React from 'react';

export default function StaffHomePage() {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-semibold mb-4">Staff Dashboard</h1>
      <p className="mb-6">Welcome to the staff management area. Here you can manage staff records, view schedules, assign tasks, and more.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 bg-blue-100 dark:bg-blue-800 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-2">Total Staff</h2>
          <p className="text-2xl">34</p>
        </div>
        <div className="p-4 bg-green-100 dark:bg-green-800 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-2">Pending Tasks</h2>
          <p className="text-2xl">12</p>
        </div>
        <div className="p-4 bg-yellow-100 dark:bg-yellow-700 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-2">Upcoming Shifts</h2>
          <p className="text-2xl">5</p>
        </div>
      </div>
    </div>
  );
}

