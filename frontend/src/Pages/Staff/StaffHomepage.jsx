import React, { useEffect, useState } from 'react';
import DoctorListWidget from '../../Components/Widgets/DoctorListWidget';
import TaskListWidget from '../../Components/Widgets/TaskList';
import TotalStaffListWidget from '../../Components/Widgets/Totalstaff';
import BloodBankInventoryWidget from '../../Components/Widgets/BloodBankInventoryWidget';
import { fetchStaffDashboardStats } from '../../api/staffDashboardStats'; // ✅ Import the function

const StaffHomepage = () => {
  const [stats, setStats] = useState({
    totalStaff: 0,
    pendingTasks: 0,
    bloodInventory: 0,
    totalDoctor: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchStaffDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        Staff Dashboard
      </h1>

      {/* Grid structure as before... */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-100 dark:bg-blue-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">Total Staff</h2>
          <p className="text-3xl font-extrabold mb-4 text-blue-900 dark:text-white">{stats.totalStaff}</p>
          <TotalStaffListWidget />
        </div>

        <div className="bg-purple-100 dark:bg-purple-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-200 mb-2">Doctors On Duty</h2>
           <p className="text-3xl font-extrabold mb-4 text-green-900 dark:text-white">{stats.totalDoctor}</p>
          <DoctorListWidget />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-100 dark:bg-green-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">Pending Tasks</h2>
          <p className="text-3xl font-extrabold mb-4 text-green-900 dark:text-white">{stats.pendingTasks}</p>
          <TaskListWidget />
        </div>

        <div className="bg-yellow-100 dark:bg-yellow-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Blood Bank Inventory</h2>
          <p className="text-3xl font-extrabold mb-4 text-yellow-900 dark:text-white">{stats.bloodInventory}</p>
          <BloodBankInventoryWidget />
        </div>
      </div>
    </div>
  );
};

export default StaffHomepage;











