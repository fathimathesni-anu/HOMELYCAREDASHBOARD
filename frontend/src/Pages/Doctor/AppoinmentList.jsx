import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const Appointment = ({ appointment, onEdit, onDelete, onMarkStatus }) => {
  return (
    <div className="appointment p-4 border rounded-md shadow-sm flex justify-between items-center">
      <div className="appointment-content">
        <h4 className="text-lg font-semibold">Patient: {appointment.patientId?.name}</h4>
        <p><strong>Doctor:</strong> {appointment.doctorId?.name}</p>
        <p><strong>Appointment Date:</strong> {new Date(appointment.appointmentDate).toLocaleString()}</p>
        <p><strong>Status:</strong> {appointment.status}</p>
        <p><strong>Reason:</strong> {appointment.reason}</p>
        <p><strong>Notes:</strong> {appointment.notes}</p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(appointment)}
          className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(appointment._id)}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
        >
          Delete
        </button>
        <button
          onClick={() => onMarkStatus(appointment._id, 'Completed')}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
        >
          Mark as Completed
        </button>
        <button
          onClick={() => onMarkStatus(appointment._id, 'Cancelled')}
          className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600"
        >
          Mark as Cancelled
        </button>
      </div>
    </div>
  );
};

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    reason: '',
    status: 'Scheduled',
    notes: '',
  });
  const [editingAppointment, setEditingAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get('/appoinment');
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments', error);
      }
    };

    fetchAppointments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        // Update appointment
        const response = await axiosInstance.put(`/appoinment/update/${editingAppointment._id}`, formData);
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment._id === editingAppointment._id ? response.data : appointment
          )
        );
        setEditingAppointment(null);
      } else {
        // Create a new appointment
        const response = await axiosInstance.post('/appoinment/create', formData);
        setAppointments((prev) => [response.data, ...prev]);
      }

      setFormData({
        patientId: '',
        doctorId: '',
        appointmentDate: '',
        reason: '',
        status: 'Scheduled',
        notes: '',
      });
    } catch (error) {
      console.error('Error saving appointment', error);
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      patientId: appointment.patientId._id,
      doctorId: appointment.doctorId._id,
      appointmentDate: new Date(appointment.appointmentDate).toISOString().split('T')[0], // Format date
      reason: appointment.reason,
      status: appointment.status,
      notes: appointment.notes,
    });
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
      console.error('Error marking status', error);
    }
  };

  return (
    <div className="appointment-list p-6 space-y-6">
      <form onSubmit={handleSubmit} className="space-x-2">
        <input
          type="text"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Enter reason for appointment"
          className="border p-2 rounded-md w-2/3"
          required
        />
        <input
          type="datetime-local"
          name="appointmentDate"
          value={formData.appointmentDate}
          onChange={handleChange}
          className="border p-2 rounded-md w-2/3"
          required
        />
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Enter notes"
          className="border p-2 rounded-md w-2/3"
        />
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
            }}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 ml-2"
          >
            Cancel
          </button>
        )}
      </form>

      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">No appointments</p>
      ) : (
        appointments.map((appointment) => (
          <Appointment
            key={appointment._id}
            appointment={appointment}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMarkStatus={handleMarkStatus}
          />
        ))
      )}
    </div>
  );
};

export default AppointmentList;


