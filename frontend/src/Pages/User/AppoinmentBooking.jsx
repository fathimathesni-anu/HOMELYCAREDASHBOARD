import React from 'react';
import DoctorSelector from '../../Components/Admin/DoctorSelector'; // adjust path if needed
import useAppointment from '../../hooks/User/UseAppoinment'; // adjust path if needed

export default function AppointmentBooking() {
  const {
    doctors,
    selectedDoctorId,
    setSelectedDoctorId,
    selectedDoctor,
    appointmentDate,
    setAppointmentDate,
    appointmentTime,
    setAppointmentTime,
    bookAppointment,
    message,
    loading,
  } = useAppointment();

  if (loading) return <p>Loading doctors...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md space-y-4">
      <h2 className="text-xl font-bold">Book an Appointment</h2>

      {/* Doctor dropdown */}
      <DoctorSelector onDoctorSelect={setSelectedDoctorId} />

      {/* Show doctor details */}
      {selectedDoctor && (
        <div className="p-3 bg-gray-50 border rounded">
          <p><strong>Name:</strong> {selectedDoctor.name}</p>
          <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
          {/* Add more fields if needed like available times, etc. */}
        </div>
      )}

      {/* Date and Time Inputs */}
      <input
        type="date"
        value={appointmentDate}
        onChange={(e) => setAppointmentDate(e.target.value)}
        className="w-full px-4 py-2 border rounded"
      />
      <input
        type="time"
        value={appointmentTime}
        onChange={(e) => setAppointmentTime(e.target.value)}
        className="w-full px-4 py-2 border rounded"
      />

      {/* Book Button */}
      <button
        onClick={bookAppointment}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Book Appointment
      </button>

      {/* Feedback Message */}
      {message && <p className="text-sm text-red-600 mt-2">{message}</p>}
    </div>
  );
}







