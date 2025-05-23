import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/* const Appointment = ({ appointment, onEdit, onDelete, onMarkStatus }) => {
  return (
    <div className="appointment p-4 border rounded-md shadow-sm flex justify-between items-center">
      <div className="appointment-content">
        <h4 className="text-lg font-semibold">Patient: {appointment.patientId?.name}</h4>
        <p><strong>Doctor:</strong> {appointment.doctorId?.userId?.name || appointment.doctorId?.name}</p>
        <p><strong>Appointment Date:</strong> {new Date(appointment.appointmentDate).toLocaleString()}</p>
        <p><strong>Status:</strong> {appointment.status}</p>
        <p><strong>Reason:</strong> {appointment.reason}</p>
        <p><strong>Notes:</strong> {appointment.notes}</p>
      </div>
      <div className="flex space-x-2">
        <button onClick={() => onEdit(appointment)} className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600">Edit</button>
        <button onClick={() => onDelete(appointment._id)} className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">Delete</button>
        <button onClick={() => onMarkStatus(appointment._id, 'Completed')} className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">Mark as Completed</button>
        <button onClick={() => onMarkStatus(appointment._id, 'Cancelled')} className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600">Mark as Cancelled</button>
      </div>
    </div>
  );
}; */

const Appointment = ({ appointment, onEdit, onDelete, onMarkStatus, doctors }) => {
  const doctor = typeof appointment.doctorId === 'string'
    ? doctors.find((doc) => doc._id === appointment.doctorId)
    : appointment.doctorId;

  const doctorName = doctor?.userId?.name || doctor?.name || 'Unknown Doctor';

  return (
    <div className="appointment p-4 border rounded-md shadow-sm flex justify-between items-center">
      <div className="appointment-content">
        <h4 className="text-lg font-semibold">Patient: {appointment.patientId?.name}</h4>
        <p><strong>Doctor:</strong> {doctorName}</p>
        <p><strong>Appointment Date:</strong> {new Date(appointment.appointmentDate).toLocaleString()}</p>
        <p><strong>Status:</strong> {appointment.status}</p>
        <p><strong>Reason:</strong> {appointment.reason}</p>
        <p><strong>Notes:</strong> {appointment.notes}</p>
      </div>
      <div className="flex space-x-2">
        <button onClick={() => onEdit(appointment)} className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600">Edit</button>
        <button onClick={() => onDelete(appointment._id)} className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">Delete</button>
        <button onClick={() => onMarkStatus(appointment._id, 'Completed')} className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">Mark as Completed</button>
        <button onClick={() => onMarkStatus(appointment._id, 'Cancelled')} className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600">Mark as Cancelled</button>
      </div>
    </div>
  );
};

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorSchedule, setDoctorSchedule] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    reason: '',
    status: 'Scheduled',
    notes: '',
  });
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
          axiosInstance.get('/appoinment'),
          axiosInstance.get('/patient'),
          axiosInstance.get('/doctor')
        ]);
        setAppointments(appointmentsRes.data);
        setPatients(patientsRes.data);
        setDoctors(doctorsRes.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  const fetchDoctorSchedule = async (doctorId) => {
    setLoadingSchedule(true);
    try {
      const res = await axiosInstance.get(`/doctor/${doctorId}`);
      setDoctorSchedule(res.data.schedule || []);
    } catch (error) {
      console.error('Failed to fetch doctor schedule', error);
      setDoctorSchedule([]);
    } finally {
      setLoadingSchedule(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'doctorId') {
      setFormData((prev) => ({
        ...prev,
        appointmentDate: '',
        doctorId: value,
      }));
      fetchDoctorSchedule(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        const response = await axiosInstance.put(`/appoinment/update/${editingAppointment._id}`, formData);
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment._id === editingAppointment._id ? response.data.appointment : appointment
          )
        );
        setEditingAppointment(null);
      } else {
        const response = await axiosInstance.post('/appoinment/create', formData);
        setAppointments((prev) => [response.data.appointment, ...prev]);
      }

      setFormData({
        patientId: '',
        doctorId: '',
        appointmentDate: '',
        reason: '',
        status: 'Scheduled',
        notes: '',
      });
      setDoctorSchedule([]);
    } catch (error) {
      console.error('Error saving appointment', error);
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      patientId: appointment.patientId?._id || appointment.patientId,
      doctorId: appointment.doctorId?._id || appointment.doctorId,
      appointmentDate: new Date(appointment.appointmentDate).toISOString(),
      reason: appointment.reason,
      status: appointment.status,
      notes: appointment.notes,
    });
    if (appointment.doctorId?._id) {
      fetchDoctorSchedule(appointment.doctorId._id);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/appoinment/delete/${id}`);
      setAppointments((prev) => prev.filter((appointment) => appointment._id !== id));
    } catch (error) {
      console.error('Error deleting appointment', error);
    }
  };

  const handleMarkStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/appoinment/update/${id}`, { status });
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === id ? { ...appointment, status } : appointment
        )
      );
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  return (
    <div className="appointment-list p-6 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Patient Select */}
        <select
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          className="border p-2 rounded-md w-full"
          required
        >
          <option value="">Select patient</option>
          {patients.map((patient) => (
            <option key={patient._id} value={patient._id}>
              {patient.name}
            </option>
          ))}
        </select>

        {/* Doctor Select */}
        <select
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          className="border p-2 rounded-md w-full"
          required
        >
          <option value="">Select doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>
              {doctor.userId?.name || doctor.name || `${doctor.firstName || ''} ${doctor.lastName || ''}`}
            </option>
          ))}
        </select>

        {/* Date Picker */}
        {loadingSchedule ? (
          <p>Loading available schedule...</p>
        ) : (
          <DatePicker
            selected={formData.appointmentDate ? new Date(formData.appointmentDate) : null}
            onChange={(date) =>
              setFormData((prev) => ({
                ...prev,
                appointmentDate: date.toISOString(),
              }))
            }
            includeDates={doctorSchedule
              .map((slot) => {
                const date = new Date(slot);
                return isNaN(date.getTime()) ? null : date;
              })
              .filter(Boolean)}
            showTimeSelect
            timeIntervals={30}
            dateFormat="Pp"
            placeholderText="Select available appointment date and time"
            className="border p-2 rounded-md w-full"
            disabled={!formData.doctorId}
          />
        )}

        {/* Reason */}
        <input
          type="text"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Reason for appointment"
          className="border p-2 rounded-md w-full"
          required
        />

        {/* Notes */}
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="border p-2 rounded-md w-full"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            {editingAppointment ? 'Update' : 'Create'} Appointment
          </button>
          {editingAppointment && (
            <button
              type="button"
              onClick={() => {
                setEditingAppointment(null);
                setFormData({
                  patientId: '',
                  doctorId: '',
                  appointmentDate: '',
                  reason: '',
                  status: 'Scheduled',
                  notes: '',
                });
                setDoctorSchedule([]);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">No appointments</p>
      ) : (
        /*  appointments.map((appointment) => (
           <Appointment
             key={appointment._id}
             appointment={appointment}
             onEdit={handleEdit}
             onDelete={handleDelete}
             onMarkStatus={handleMarkStatus}
           />
         )) */
        appointments.map((appointment) => (
          <Appointment
            key={appointment._id}
            appointment={appointment}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMarkStatus={handleMarkStatus}
            doctors={doctors} // ← add this
          />
        ))

      )}
    </div>
  );
};

export default AppointmentList;






