import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const AppointmentItem = ({ appointment }) => {
  const doctorName =
    typeof appointment.doctorId === 'string'
      ? appointment.doctorId
      : appointment.doctorId?.userId?.name || appointment.doctorId?.name || 'Unknown Doctor';

  return (
    <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Patient: {appointment.patientId?.name || 'Unknown Patient'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Doctor: {doctorName}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      <span
        className={`text-xs font-medium ${
          appointment.status === 'Completed'
            ? 'text-green-500'
            : appointment.status === 'Cancelled'
            ? 'text-red-500'
            : 'text-yellow-500'
        }`}
      >
        {appointment.status}
      </span>
    </div>
  );
};

const AppointmentsOverview = () => {
  const [appointments, setAppointments] = useState([]);
  const [appointmentCount, setAppointmentCount] = useState(0);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get('/appointment');
        const data = response.data.appointments || response.data;

        setAppointments(data);
        setAppointmentCount(data.length);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Appointments Overview</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {appointmentCount} Appointment{appointmentCount !== 1 ? 's' : ''} in total
      </p>

      {/* List of recent appointments */}
      {appointments.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">No appointments available.</p>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-72 overflow-y-auto rounded border border-gray-200 dark:border-gray-700 mb-4">
          {appointments.slice(0, 5).map((appointment) => (
            <AppointmentItem key={appointment._id} appointment={appointment} />
          ))}
        </div>
      )}

      {/* Add appointment link */}
      <Link to="/admin/dashboard/appointments" className="flex items-center text-blue-500 hover:underline">
        <CalendarIcon className="h-5 w-5 mr-2" />
        <span>Add New Appointment</span>
      </Link>
    </div>
  );
};

export default AppointmentsOverview;








