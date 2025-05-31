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
    <div className="appointment p-4 border rounded-md shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 bg-white">
      <div className="appointment-content flex-1 space-y-1 text-gray-800">
        <h4 className="text-lg font-semibold">Patient: {appointment.patientId?.name}</h4>
        <p><strong>Doctor:</strong> {doctorName}</p>
        <p><strong>Appointment Date:</strong> {new Date(appointment.appointmentDate).toLocaleString()}</p>
        <p><strong>Status:</strong> {appointment.status}</p>
        <p><strong>Reason:</strong> {appointment.reason}</p>
        <p><strong>Notes:</strong> {appointment.notes || '-'}</p>
      </div>
      <div className="flex flex-wrap gap-2 sm:flex-col sm:space-y-2">
        <button
          onClick={() => onEdit(appointment)}
          className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(appointment._id)}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition"
        >
          Delete
        </button>
        <button
          onClick={() => onMarkStatus(appointment._id, 'Completed')}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition"
        >
          Mark as Completed
        </button>
        <button
          onClick={() => onMarkStatus(appointment._id, 'Cancelled')}
          className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition"
        >
          Mark as Cancelled
        </button>
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
          axiosInstance.get('/appoinment'),
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        const response = await axiosInstance.put(
          `/appoinment/update/${editingAppointment._id}`,
          formData
        );
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment._id === editingAppointment._id
              ? response.data.appointment
              : appointment
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
    <div className="appointment-list max-w-4xl mx-auto p-6 space-y-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-md shadow-md"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select patient</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.name}
              </option>
            ))}
          </select>

          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.userId?.name || doctor.name || `${doctor.firstName || ''} ${doctor.lastName || ''}`}
              </option>
            ))}
          </select>
        </div>

        {formData.doctorId && (
          <div className="mb-4">
            <ScheduleViewer
              doctorId={formData.doctorId}
              token={localStorage.getItem('token')}
            />
          </div>
        )}

        <DatePicker
          selected={formData.appointmentDate ? new Date(formData.appointmentDate) : null}
          onChange={(date) =>
            setFormData((prev) => ({
              ...prev,
              appointmentDate: date ? date.toISOString() : '',
            }))
          }
          showTimeSelect
          timeIntervals={30}
          dateFormat="Pp"
          placeholderText="Select appointment date and time"
          className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!formData.doctorId}
          wrapperClassName="w-full"
        />

        <input
          type="text"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Reason for appointment"
          className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
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
              className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">No appointments</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Appointment
              key={appointment._id}
              appointment={appointment}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMarkStatus={handleMarkStatus}
              doctors={doctors}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;





