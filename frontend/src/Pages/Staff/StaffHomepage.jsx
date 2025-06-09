import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchStaffDashboardStats } from '../../api/staffDashboardStats'; // adjust path if needed

const StaffHomepage = () => {
  const [stats, setStats] = useState({
    totalStaff: 0,
    pendingTasks: 0,
    bloodInventory: 0,
  });

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchStaffDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching staff dashboard stats:', error);
      }
    };

    getStats();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100 max-w-6xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Staff Dashboard</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-3xl">
        Welcome to the staff management area. Here you can manage staff records, view assign tasks,BloodBank Inventory , and more.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/staff/dashboard/staff" className="group">
          <div className="bg-blue-100 dark:bg-blue-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <h2 className="text-lg font-semibold mb-2 group-hover:text-blue-900 dark:group-hover:text-blue-300">
              Total Staff
            </h2>
            <p className="text-3xl font-extrabold">{stats.totalStaff}</p>
          </div>
        </Link>

        <Link to="/staff/dashboard/tasks" className="group">
          <div className="bg-green-100 dark:bg-green-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <h2 className="text-lg font-semibold mb-2 group-hover:text-green-900 dark:group-hover:text-green-300">
              Pending Tasks
            </h2>
            <p className="text-3xl font-extrabold">{stats.pendingTasks}</p>
          </div>
        </Link>

        <Link to="/staff/dashboard/blood-bank" className="group">
          <div className="bg-yellow-100 dark:bg-yellow-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <h2 className="text-lg font-semibold mb-2 group-hover:text-yellow-900 dark:group-hover:text-yellow-300">
              Blood Bank Inventory
            </h2>
            <p className="text-3xl font-extrabold">{stats.bloodInventory}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default StaffHomepage;




