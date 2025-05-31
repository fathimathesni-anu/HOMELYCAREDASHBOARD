import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import DoctorSelector from '../../Components/Admin/DoctorSelector';
import ScheduleViewer from '../../Components/ScheduleViewer';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    contactInfo: {
      phone: '',
      email: '',
      address: ''
    },
    medicalHistory: [],
    assignedDoctor: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axiosInstance.get('/patient');
      setPatients(res.data);
    } catch (err) {
      console.error('Error fetching patients', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('contactInfo.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [field]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.put(`/patient/update/${editingId}`, formData);
      } else {
        await axiosInstance.post('/patient/create', formData);
      }
      fetchPatients();
      resetForm();
    } catch (err) {
      console.error('Error saving patient:', err.response?.data || err.message);
    }
  };

  const handleEdit = (patient) => {
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      contactInfo: patient.contactInfo,
      medicalHistory: patient.medicalHistory,
      assignedDoctor: patient.assignedDoctor
    });
    setEditingId(patient._id);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/patient/delete/${id}`);
      fetchPatients();
    } catch (err) {
      console.error('Error deleting patient', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      gender: '',
      contactInfo: {
        phone: '',
        email: '',
        address: ''
      },
      medicalHistory: [],
      assignedDoctor: ''
    });
    setEditingId(null);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Patient' : 'Add New Patient'}</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="border p-3 rounded-md w-full focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <input
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          type="number"
          required
          className="border p-3 rounded-md w-full focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="border p-3 rounded-md w-full focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input
          name="contactInfo.phone"
          value={formData.contactInfo.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border p-3 rounded-md w-full focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <input
          name="contactInfo.email"
          value={formData.contactInfo.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-3 rounded-md w-full focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <input
          name="contactInfo.address"
          value={formData.contactInfo.address}
          onChange={handleChange}
          placeholder="Address"
          className="border p-3 rounded-md w-full focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        <DoctorSelector
          onDoctorSelect={(doctorId) =>
            setFormData((prev) => ({ ...prev, assignedDoctor: doctorId }))
          }
        />

        {formData.assignedDoctor && (
          <div className="border rounded-md p-4 bg-gray-50 mt-4">
            <h4 className="font-semibold mb-3 text-lg">Doctor's Schedule</h4>
            <ScheduleViewer
              doctorId={formData.assignedDoctor._id}
              token={localStorage.getItem('token')}
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          {editingId ? 'Update' : 'Create'}
        </button>
      </form>

      <hr className="my-8" />

      <h2 className="text-2xl font-bold mb-4">Patients List</h2>
      <ul className="space-y-4">
        {patients.map((patient) => (
          <li
            key={patient._id}
            className="border p-4 rounded-md flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white shadow-sm"
          >
            <div className="mb-3 sm:mb-0">
              <strong className="text-lg">{patient.name}</strong> — {patient.age} yrs — {patient.gender}
              <br />
              <span className="text-gray-600">
                📞 {patient.contactInfo.phone || '-'} | 📧 {patient.contactInfo.email || '-'}
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleEdit(patient)}
                className="bg-yellow-400 px-4 py-2 rounded-md hover:bg-yellow-500 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(patient._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientList;



