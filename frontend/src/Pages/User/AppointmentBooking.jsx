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

  // Track editing appointment ID and temp form data for editing
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editDoctorId, setEditDoctorId] = useState('');
  const [editSelectedDoctor, setEditSelectedDoctor] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');

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
      fetchAppointments();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axiosInstance.get('/appoinmentschedule/my-appointments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error('Failed to fetch appointments', err);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axiosInstance.put(
        `/appoinmentschedule/${appointmentId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments((prev) =>
        prev.map((a) => (a._id === appointmentId ? res.data.appointment : a))
      );
    } catch (err) {
      console.error('Status update failed', err);
    }
  };

  // New: Update full appointment
  const updateAppointment = async (appointmentId) => {
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await axiosInstance.put(
        `/appoinmentschedule/${appointmentId}`,
        {
          date: editDate,
          time: editTime,
          status: editStatus,
          doctorId: editDoctorId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments((prev) =>
        prev.map((a) => (a._id === appointmentId ? res.data.appointment : a))
      );
      setMessage('Appointment updated');
      setEditingId(null);
      setEditDate('');
      setEditTime('');
      setEditStatus('');
      setEditDoctorId('');
      setEditSelectedDoctor(null);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  // New: Delete appointment
  const deleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;

    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/appoinmentschedule/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments((prev) => prev.filter((a) => a._id !== appointmentId));
      setMessage('Appointment deleted');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getWorkingHoursForDate = (schedule, selectedDate) => {
    if (!selectedDate || !schedule) return null;
    const weekday = new Date(selectedDate).toLocaleString('en-US', { weekday: 'long' });
    return schedule.find((s) => s.availableDays.includes(weekday));
  };

  const workingHours = selectedDoctor ? getWorkingHoursForDate(selectedDoctor.schedule, date) : null;

  // Handle edit button click - populate edit fields
  const startEditing = (appt) => {
    setEditingId(appt._id);
    setEditDate(appt.date);
    setEditTime(appt.time);
    setEditStatus(appt.status);
    setEditDoctorId(appt.doctorId?._id || '');
    setEditSelectedDoctor(appt.doctorId || null);
  };

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
            {date ? (
              workingHours ? (
                <>
                  Working Hours on {new Date(date).toLocaleDateString()}: <strong>{workingHours.startTime}</strong> -{' '}
                  <strong>{workingHours.endTime}</strong>
                </>
              ) : (
                <>Doctor is not available on selected date</>
              )
            ) : (
              <>Select a date to view availability</>
            )}
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
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>

        {message && (
          <div className="mt-4 text-center text-sm font-medium text-green-600">{message}</div>
        )}
      </form>

      <div className="mt-8">
        <label className="block font-medium mb-1">Filter Appointments by Date</label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">My Appointments</h3>
        {appointments.length === 0 ? (
          <p className="text-sm text-gray-500">No appointments yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {appointments
              .filter((appt) => !filterDate || appt.date === filterDate)
              .map((appt) => (
                <li key={appt._id} className="py-2">
                  <div className="flex justify-between items-center">
                    <div>
                      {editingId === appt._id ? (
                        <>
                          <input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="border rounded p-1 mb-1"
                          />
                          <input
                            type="time"
                            value={editTime}
                            onChange={(e) => setEditTime(e.target.value)}
                            className="border rounded p-1 mb-1"
                          />
                          <DoctorSelector
                            onDoctorSelect={(doctor) => {
                              setEditSelectedDoctor(doctor);
                              setEditDoctorId(doctor._id);
                            }}
                            selectedDoctor={editSelectedDoctor}
                          />
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="border rounded px-2 py-1 text-sm mb-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </>
                      ) : (
                        <>
                          <div>
                            {new Date(appt.date).toLocaleDateString()} at {appt.time}
                          </div>
                          <div className="text-sm text-gray-600">
                            Doctor: {appt.doctorId?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-600">Status: {appt.status}</div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {editingId === appt._id ? (
                        <>
                          <button
                            onClick={() => updateAppointment(appt._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                            disabled={loading}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 text-sm"
                            disabled={loading}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(appt)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteAppointment(appt._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
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

















