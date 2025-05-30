// AppointmentBooking.js
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
        '/appointmentschedule/book',
        { doctorId, date, time },
        { headers: { Authorization: `Bearer ${token}` } }
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
      const res = await axiosInstance.get('/appointmentschedule/my-appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error('Failed to fetch appointments', err);
    }
  };

  const updateAppointment = async (appointmentId) => {
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await axiosInstance.put(
        `/appointmentschedule/${appointmentId}`,
        { date: editDate, time: editTime, status: editStatus, doctorId: editDoctorId },
        { headers: { Authorization: `Bearer ${token}` } }
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

  const deleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/appointmentschedule/${appointmentId}`, {
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

  const startEditing = (appt) => {
    setEditingId(appt._id);
    setEditDate(appt.date);
    setEditTime(appt.time);
    setEditStatus(appt.status);
    setEditDoctorId(appt.doctorId?._id || '');
    setEditSelectedDoctor(appt.doctorId || null);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book an Appointment</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <DoctorSelector
          onDoctorSelect={(doctor) => {
            setSelectedDoctor(doctor);
            setDoctorId(doctor?._id || '');
          }}
          selectedDoctor={selectedDoctor}
        />

        {selectedDoctor && (
          <div className="text-sm text-blue-700">
            {!date && <>Select a date to view availability</>}
            {date && !workingHours && <>Doctor is not available on this date</>}
            {date && workingHours && (
              <>
                Working Hours on {new Date(date).toLocaleDateString()}: <strong>{workingHours.startTime}</strong> - <strong>{workingHours.endTime}</strong>
              </>
            )}
          </div>
        )}

        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" required />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" required />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold"
          disabled={loading}
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>

        {message && <div className="text-center text-green-600 font-medium">{message}</div>}
      </form>

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Appointments</h3>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="mb-6 border border-gray-300 rounded px-3 py-2"
        />

        <div className="space-y-4">
          {appointments
            .filter((appt) => !filterDate || appt.date === filterDate)
            .map((appt) => (
              <div key={appt._id} className="bg-white p-6 rounded-lg shadow border">
                {editingId === appt._id ? (
                  <div className="space-y-3">
                    <DoctorSelector
                      onDoctorSelect={(doc) => {
                        setEditSelectedDoctor(doc);
                        setEditDoctorId(doc?._id || '');
                      }}
                      selectedDoctor={editSelectedDoctor}
                    />
                    <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="w-full border rounded px-3 py-2" />
                    <input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} className="w-full border rounded px-3 py-2" />
                    <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="w-full border rounded px-3 py-2">
                      <option value="booked">Booked</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <div className="flex gap-4">
                      <button onClick={() => updateAppointment(appt._id)} className="bg-green-600 text-white px-4 py-2 rounded">Update</button>
                      <button onClick={() => setEditingId(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700"><strong>Doctor:</strong> {appt.doctorId?.userId?.name}</p>
                    <p className="text-gray-700"><strong>Date:</strong> {appt.date}</p>
                    <p className="text-gray-700"><strong>Time:</strong> {appt.time}</p>
                    <p className="text-gray-700"><strong>Status:</strong> {appt.status}</p>
                    <div className="mt-4 flex gap-4">
                      <button onClick={() => startEditing(appt)} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
                      <button onClick={() => deleteAppointment(appt._id)} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;




























