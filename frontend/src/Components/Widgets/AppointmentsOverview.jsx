// src/Components/Widgets/AppointmentsOverview.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const AppointmentsOverview = () => {
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    const fetchTodayAppointments = async () => {
      try {
        const response = await axiosInstance.get('/appoinment');
        const allAppointments = response.data;

        const today = new Date().toISOString().split('T')[0];

        const todayAppointments = allAppointments.filter(appointment => {
          const appointmentDate = new Date(appointment.appointmentDate).toISOString().split('T')[0];
          return appointmentDate === today;
        });

        setTodayCount(todayAppointments.length);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchTodayAppointments();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
        Appointments Overview
      </h2>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        {todayCount} Appointments scheduled today
      </p>
      <Link to="/admin/dashboard/appointments" className="mt-3 flex items-center text-blue-500 hover:underline">
        <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
        <span>View All Appointments</span>
      </Link>
    </div>
  );
};

export default AppointmentsOverview;


