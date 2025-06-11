import React, { useEffect, useState } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const TodaysAppointmentsWidget = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodaysAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axiosInstance.get('/appointmentschedule/today', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAppointments(res.data.appointments || []);
      } catch (err) {
        setError('Could not load today\'s appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchTodaysAppointments();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 flex flex-col justify-between">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">Today's Appointments</h2>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : appointments.length > 0 ? (
        <ul className="space-y-3">
          {appointments.map((appointment) => (
            <li key={appointment._id} className="text-gray-600 dark:text-gray-300 text-sm">
              With <strong>{appointment.doctorId?.userId?.name || 'Unknown Doctor'}</strong>
              {appointment.reason && <> for <strong>{appointment.reason}</strong></>},
              at {new Date(`${appointment.date}T${appointment.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">You have no appointments today.</p>
      )}

      <Link
        to="/user/dashboard/appointments"
        className="mt-6 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
      >
        <CalendarIcon className="h-5 w-5 mr-2" />
        <span>View All Appointments</span>
      </Link>
    </div>
  );
};

export default TodaysAppointmentsWidget; 



