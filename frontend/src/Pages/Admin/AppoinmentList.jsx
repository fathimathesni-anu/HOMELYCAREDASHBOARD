
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ScheduleViewer from '../../Components/ScheduleViewer';

const Appointment = ({ appointment, onEdit, onDelete, onMarkStatus, doctors }) => {
  const doctor = typeof appointment.doctorId === 'string'
    ? doctors.find((doc) => doc._id === appointment.doctorId)
    : appointment.doctorId;

  const doctorName = doctor?.userId?.name || doctor?.name || 'Unknown Doctor';

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 space-y-2 md:space-y-0 md:flex md:justify-between md:items-center">
      <div className="space-y-1 text-sm md:text-base">
        <h4 className="font-semibold">Patient: {appointment.patientId?.name}</h4>
        <p><strong>Doctor:</strong> {doctorName}</p>
        <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleString()}</p>
        <p><strong>Status:</strong> {appointment.status}</p>
        <p><strong>Reason:</strong> {appointment.reason}</p>
        <p><strong>Notes:</strong> {appointment.notes}</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-4 md:mt-0 md:ml-4">
        <button onClick={() => onEdit(appointment)} className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600">Edit</button>
        <button onClick={() => onDelete(appointment._id)} className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">Delete</button>
        <button onClick={() => onMarkStatus(appointment._id, 'Completed')} className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">Mark Completed</button>
        <button onClick={() => onMarkStatus(appointment._id, 'Cancelled')} className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600">Cancel</button>
      </div>
    </div>
  );
};

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
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
    const fetchData = async () => {
      try {
        const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
          axiosInstance.get('/appointment'),
          axiosInstance.get('/patient'),
          axiosInstance.get('/doctor'),
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        const response = await axiosInstance.put(
          `/appointment/update/${editingAppointment._id}`,
          formData
        );
        setAppointments((prev) =>
          prev.map((a) => (a._id === editingAppointment._id ? response.data.appointment : a))
        );
        setEditingAppointment(null);
      } else {
        const response = await axiosInstance.post('/appointment/create', formData);
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
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/appointment/delete/${id}`);
      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error('Error deleting appointment', error);
    }
  };

  const handleMarkStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/appointment/update/${id}`, { status });
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <select
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          className="border p-2 rounded-md w-full"
          required
        >
          <option value="">Select patient</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          className="border p-2 rounded-md w-full"
          required
        >
          <option value="">Select doctor</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>
              {d.userId?.name || d.name || `${d.firstName || ''} ${d.lastName || ''}`}
            </option>
          ))}
        </select>

        {formData.doctorId && (
          <div className="md:col-span-2">
            <ScheduleViewer doctorId={formData.doctorId} token={localStorage.getItem('token')} />
          </div>
        )}

        <div className="md:col-span-2">
          <DatePicker
            selected={formData.appointmentDate ? new Date(formData.appointmentDate) : null}
            onChange={(date) =>
              setFormData((prev) => ({ ...prev, appointmentDate: date.toISOString() }))
            }
            showTimeSelect
            timeIntervals={30}
            dateFormat="Pp"
            placeholderText="Select appointment date and time"
            className="border p-2 rounded-md w-full"
            disabled={!formData.doctorId}
          />
        </div>

        <input
          type="text"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Reason for appointment"
          className="border p-2 rounded-md w-full"
          required
        />

        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="border p-2 rounded-md w-full"
        />

        <div className="md:col-span-2 flex flex-col sm:flex-row gap-2">
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
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
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
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
              doctors={doctors}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentList;








