import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDoctorDashboardStats } from '../../api/dashboardStats'; // Adjust path as necessary

const DoctorHomepage = () => {
  const [stats, setStats] = useState({
    totalAppointmentsToday: 0,
    totalPatients: 0,
    totalUnreadMessages: 0,
    totalPendingFeedback: 0,
  });

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchDoctorDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching doctor stats:', error);
      }
    };

    getStats();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100 max-w-6xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Doctor Dashboard</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-3xl">
        Welcome! Here's a quick overview of your activity today.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/dashboard/appointments" className="group">
          <div className="bg-blue-100 dark:bg-blue-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col justify-center">
            <h2 className="text-lg font-semibold mb-2 group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors duration-300">
              Today's Appointments
            </h2>
            <p className="text-3xl font-extrabold">{stats.totalAppointmentsToday}</p>
          </div>
        </Link>

        <Link to="/dashboard/patients" className="group">
          <div className="bg-green-100 dark:bg-green-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col justify-center">
            <h2 className="text-lg font-semibold mb-2 group-hover:text-green-900 dark:group-hover:text-green-300 transition-colors duration-300">
              New Patients
            </h2>
            <p className="text-3xl font-extrabold">{stats.totalPatients}</p>
          </div>
        </Link>

        <Link to="/dashboard/chat" className="group">
          <div className="bg-yellow-100 dark:bg-yellow-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col justify-center">
            <h2 className="text-lg font-semibold mb-2 group-hover:text-yellow-900 dark:group-hover:text-yellow-300 transition-colors duration-300">
              Unread Messages
            </h2>
            <p className="text-3xl font-extrabold">{stats.totalUnreadMessages}</p>
          </div>
        </Link>

        <Link to="/dashboard/feedback" className="group col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="bg-red-100 dark:bg-red-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col justify-center">
            <h2 className="text-lg font-semibold mb-2 group-hover:text-red-900 dark:group-hover:text-red-300 transition-colors duration-300">
              Pending Feedback
            </h2>
            <p className="text-3xl font-extrabold">{stats.totalPendingFeedback}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DoctorHomepage;




