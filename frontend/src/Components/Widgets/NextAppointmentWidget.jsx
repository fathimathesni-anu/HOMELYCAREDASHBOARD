import React, { useEffect, useState } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const NextAppointmentWidget = () => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNextAppointment = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axiosInstance.get('/appointmentschedule/my-appointments', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const all = res.data.appointments || [];

        const now = new Date();

        const upcoming = all
          .filter((appt) => appt.status === 'booked')
          .filter((appt) => {
            const dateTime = new Date(`${appt.date}T${appt.time}`);
            return dateTime > now;
          })
          .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

        setAppointment(upcoming[0] || null);
      } catch (err) {
        setError('Could not load next appointment');
      } finally {
        setLoading(false);
      }
    };

    fetchNextAppointment();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 flex flex-col justify-between">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">Next Appointment</h2>
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : appointment ? (
        <div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Your next appointment is with <strong>{appointment.doctorId?.userId?.name || 'Unknown Doctor'}</strong>
            {appointment.reason && <> for <strong>{appointment.reason}</strong></>}.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Date: {new Date(`${appointment.date}T${appointment.time}`).toLocaleDateString()} | Time: {new Date(`${appointment.date}T${appointment.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming appointments.</p>
      )}

      <Link
        to="/user/dashboard/appointments"
        className="mt-6 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
      >
        <CalendarIcon className="h-5 w-5 mr-2" />
        <span>View Appointment</span>
      </Link>
    </div>
  );
};

export default NextAppointmentWidget;


