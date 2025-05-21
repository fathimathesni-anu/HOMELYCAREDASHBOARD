import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import DoctorSelector from '../../Components/Admin/DoctorSelector';

const AppointmentBooking = () => {
  const [doctorId, setDoctorId] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filterDate, setFilterDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem("token");

      const res = await axiosInstance.post(
        '/appoinmentschedule/book',
        { doctorId, date, time },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);
      setDate('');
      setTime('');
      setDoctorId('');
      setSelectedDoctor(null);
      fetchAppointments(); // Refresh list after booking
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axiosInstance.get(`/appoinmentschedule/my-appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error('Failed to fetch appointments', err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <DoctorSelector
          onDoctorSelect={(doctor) => {
            setSelectedDoctor(doctor);
            setDoctorId(doctor._id);
          }}
        />

        {selectedDoctor && (
          <div className="text-sm text-gray-600 mb-2">
            Working Hours: {selectedDoctor.startTime} - {selectedDoctor.endTime}
          </div>
        )}

        <div>
          <label className="block font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>

        {message && (
          <div className="mt-4 text-center text-sm font-medium text-green-600">
            {message}
          </div>
        )}
      </form>

      {/* Filter by Date */}
      <div className="mt-8">
        <label className="block font-medium mb-1">Filter Appointments by Date</label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />
      </div>

      {/* Appointment List */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">My Appointments</h3>
        {appointments.length === 0 ? (
          <p className="text-sm text-gray-500">No appointments yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {appointments
              .filter(appt => !filterDate || appt.date === filterDate)
              .map((appt) => (
                <li key={appt._id} className="py-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div>{new Date(appt.date).toLocaleDateString()} at {appt.time}</div>
                      <div className="text-sm text-gray-600">
                        Doctor: {appt.doctorId?.name || 'Unknown'}
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">Status: {appt.status || 'Pending'}</span>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;















