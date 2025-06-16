import React, { useEffect, useState } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const TodaysAppointmentsWidget = () => {
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [loadingToday, setLoadingToday] = useState(true);
  const [loadingAll, setLoadingAll] = useState(true);
  const [errorToday, setErrorToday] = useState(null);
  const [errorAll, setErrorAll] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchTodaysAppointments = async () => {
      try {
        const res = await axiosInstance.get('/appointmentschedule/today', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodaysAppointments(res.data.appointments || []);
      } catch (err) {
        setErrorToday("Could not load today's appointments");
      } finally {
        setLoadingToday(false);
      }
    };

    const fetchAllAppointments = async () => {
      try {
        const res = await axiosInstance.get('/appointmentschedule/my-appointments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllAppointments(res.data.appointments || []);
      } catch (err) {
        setErrorAll("Could not load all appointments");
      } finally {
        setLoadingAll(false);
      }
    };

    fetchTodaysAppointments();
    fetchAllAppointments();
  }, []);

  const renderAppointmentItem = (appointment) => (
    <li key={appointment._id} className="text-gray-600 dark:text-gray-300 text-sm">
      With <strong>{appointment.doctorId?.userId?.name || 'Unknown Doctor'}</strong>
      {appointment.reason && <> for <strong>{appointment.reason}</strong></>},
      at {new Date(`${appointment.date}T${appointment.time}`).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}
    </li>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 flex flex-col">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">Today's Appointments</h2>

      {loadingToday ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading today's appointments...</p>
      ) : errorToday ? (
        <p className="text-red-500 text-sm">{errorToday}</p>
      ) : todaysAppointments.length > 0 ? (
        <ul className="space-y-3 mb-6">{todaysAppointments.map(renderAppointmentItem)}</ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">You have no appointments today.</p>
      )}

      {/* <Link
        to="/user/dashboard/appointments"
        className="mb-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
      >
        <CalendarIcon className="h-5 w-5 mr-2" />
        <span>View All Appointments</span>
      </Link> */}

      <h3 className="text-lg font-semibold text-gray-700 dark:text-white mt-4 mb-2">All Appointments</h3>

      {loadingAll ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading all appointments...</p>
      ) : errorAll ? (
        <p className="text-red-500 text-sm">{errorAll}</p>
      ) : allAppointments.length > 0 ? (
        <ul className="space-y-3">{allAppointments.map(renderAppointmentItem)}</ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">You have no appointments.</p>
      )}
    </div>
  );
};

export default TodaysAppointmentsWidget;




