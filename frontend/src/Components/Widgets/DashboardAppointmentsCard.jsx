import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon } from '@heroicons/react/24/outline';
import axiosInstance from '../../api/axiosInstance';

const DashboardAppointmentsCard = ({ limit = 5, compact = false }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get('/appointment');
        const data = response.data.appointments || response.data;
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const AppointmentItem = ({ appointment }) => {
    const doctorName =
      typeof appointment.doctorId === 'string'
        ? appointment.doctorId
        : appointment.doctorId?.userId?.name || appointment.doctorId?.name || 'Unknown Doctor';

    return (
      <div className={`py-2 ${compact ? 'text-sm' : 'p-2'} border-b border-gray-200 dark:border-gray-700 flex justify-between`}>
        <div>
          <p className="font-medium text-gray-700 dark:text-gray-300">
            {appointment.patientId?.name || 'Unknown Patient'}
          </p>
          {!compact && (
            <>
              <p className="text-xs text-gray-500 dark:text-gray-400">Doctor: {doctorName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </>
          )}
        </div>
        <span
          className={`text-xs font-semibold ${
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

  return (
    <div className={`${compact ? '' : 'bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md'} `}>
      {!compact && (
        <>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Appointments Overview</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {loading ? 'Loading...' : `${appointments.length} Appointment${appointments.length !== 1 ? 's' : ''} in total`}
          </p>
        </>
      )}

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">Loading...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">No appointments available.</p>
      ) : (
        <div className={`divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto ${compact ? 'max-h-48' : 'max-h-72'} rounded`}>
          {appointments.slice(0, limit).map((appointment) => (
            <AppointmentItem key={appointment._id} appointment={appointment} />
          ))}
        </div>
      )}

      {!compact && (
        <Link to="/admin/dashboard/appointments" className="flex items-center text-blue-500 hover:underline mt-4">
          <CalendarIcon className="h-5 w-5 mr-2" />
          <span>Add New Appointment</span>
        </Link>
      )}
    </div>
  );
};

export default DashboardAppointmentsCard;


