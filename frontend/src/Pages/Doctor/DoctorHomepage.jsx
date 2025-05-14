import React from 'react';

const DoctorHomepage = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-4">Doctor Dashboard</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">Welcome! Here's a quick overview of your activity today.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-1">Today's Appointments</h2>
          <p className="text-2xl font-bold">8</p>
        </div>

        <div className="bg-green-100 dark:bg-green-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-1">New Patients</h2>
          <p className="text-2xl font-bold">3</p>
        </div>

        <div className="bg-yellow-100 dark:bg-yellow-700 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-1">Unread Messages</h2>
          <p className="text-2xl font-bold">5</p>
        </div>

        <div className="bg-red-100 dark:bg-red-700 p-4 rounded-lg shadow col-span-1 sm:col-span-2 lg:col-span-1">
          <h2 className="text-lg font-semibold mb-1">Pending Feedback</h2>
          <p className="text-2xl font-bold">2</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorHomepage;

