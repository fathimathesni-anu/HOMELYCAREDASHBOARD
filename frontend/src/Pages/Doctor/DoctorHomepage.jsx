import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDoctorDashboardStats } from '../../api/dashboardStats';
import BloodBankInventoryWidget from '../../Components/Widgets/BloodBankInventoryWidget';
import DoctorListWidget from '../../Components/Widgets/DoctorListWidget';
import DashboardAppointmentsCard from '../../Components/Widgets/DashboardAppointmentsCard';
import PatientsOverview from '../../Components/Widgets/PatientsOverview';
import axiosInstance from '../../api/axiosInstance'; // import axiosInstance to fetch patients

const DoctorHomepage = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalAppointmentsToday: 0,
    totalPatients: 0, // Will update from patients data
    totalChats: 0,
    totalPendingFeedback: 0,
  });

  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientsError, setPatientsError] = useState(null);

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchDoctorDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching doctor stats:', error);
      }
    };

    const fetchPatients = async () => {
      try {
        const res = await axiosInstance.get('/patient');
        setPatients(res.data || []);
        setStats(prev => ({
          ...prev,
          totalPatients: (res.data && res.data.length) || 0,
        }));
      } catch (err) {
        console.error('Error fetching patients:', err);
        setPatientsError('Failed to load patients');
      } finally {
        setPatientsLoading(false);
      }
    };

    getStats();
    fetchPatients();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100 max-w-6xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Doctor Dashboard</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-3xl">
        Welcome! Here's a quick overview of your activity today.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Appointments with Embedded Card */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="bg-indigo-100 dark:bg-indigo-800 p-4 rounded-lg shadow-md h-full flex flex-col">
            <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300 mb-2">Total Appointments</h2>
            <p className="text-3xl font-extrabold mb-4">{stats.totalAppointments}</p>
            <DashboardAppointmentsCard limit={3} compact />
          </div>
        </div>

        {/* Today's Appointments */}
        <Link to="/dashboard/appointments" className="group">
          <div className="bg-blue-100 dark:bg-blue-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col justify-center">
            <h2 className="text-lg font-semibold mb-2 group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors duration-300">
              Today's Appointments
            </h2>
            <p className="text-3xl font-extrabold">{stats.totalAppointmentsToday}</p>
          </div>
        </Link>

        {/* Total Patients */}
        <Link to="/dashboard/patients" className="group">
          <div className="bg-green-100 dark:bg-green-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col justify-center">
            <h2 className="text-lg font-semibold mb-2 group-hover:text-green-900 dark:group-hover:text-green-300 transition-colors duration-300">
              Total Patients
            </h2>
            <p className="text-3xl font-extrabold">{stats.totalPatients}</p>
          </div>
        </Link>

        {/* Pending Feedback */}
        <Link to="/dashboard/feedback" className="group col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="bg-red-100 dark:bg-red-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col justify-center">
            <h2 className="text-lg font-semibold mb-2 group-hover:text-red-900 dark:group-hover:text-red-300 transition-colors duration-300">
              Pending Feedback
            </h2>
            <p className="text-3xl font-extrabold">{stats.totalPendingFeedback}</p>
          </div>
        </Link>
      </div>

      {/* Widgets Below Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {/* Blood Bank Inventory Widget */}
        <div className="bg-yellow-100 dark:bg-yellow-700 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-4">Blood Inventory Snapshot</h3>
          <BloodBankInventoryWidget />
        </div>

        {/* Doctors On Duty */}
        <div className="bg-purple-100 dark:bg-purple-700 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">Doctors On Duty</h3>
          <DoctorListWidget />
        </div>

        {/* Patients Overview with patients data */}
        <div className="bg-green-100 dark:bg-green-700 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">Patients Overview</h3>
          <PatientsOverview 
            patients={patients} 
            loading={patientsLoading} 
            error={patientsError} 
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorHomepage;










