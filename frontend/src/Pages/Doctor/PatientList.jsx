import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance'; // adjust path based on your project structure

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
  const [doctors, setDoctors] = useState([]);

  // Fetch patients and doctors
  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axiosInstance.get('/patient');
      setPatients(res.data);
    } catch (err) {
      console.error('Error fetching patients', err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axiosInstance.get('/doctor');
      setDoctors(res.data);
    } catch (err) {
      console.error('Error fetching doctors', err);
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
    } catch (err) {
      console.error('Error saving patient:', err);
    }
  };

  const handleEdit = (patient) => {
    setFormData(patient);
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Patient' : 'Add New Patient'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="border p-2 w-full" />
        <input name="age" value={formData.age} onChange={handleChange} placeholder="Age" type="number" required className="border p-2 w-full" />
        <select name="gender" value={formData.gender} onChange={handleChange} required className="border p-2 w-full">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input name="contactInfo.phone" value={formData.contactInfo.phone} onChange={handleChange} placeholder="Phone" className="border p-2 w-full" />
        <input name="contactInfo.email" value={formData.contactInfo.email} onChange={handleChange} placeholder="Email" className="border p-2 w-full" />
        <input name="contactInfo.address" value={formData.contactInfo.address} onChange={handleChange} placeholder="Address" className="border p-2 w-full" />

        <select name="assignedDoctor" value={formData.assignedDoctor} onChange={handleChange} required className="border p-2 w-full">
          <option value="">Select Doctor</option>
          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>{doc.name}</option>
          ))}
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingId ? 'Update' : 'Create'}</button>
      </form>

      <hr className="my-6" />

      <h2 className="text-xl font-bold mb-2">Patients List</h2>
      <ul>
        {patients.map((patient) => (
          <li key={patient._id} className="border p-3 flex justify-between items-center my-2">
            <div>
              <strong>{patient.name}</strong> — {patient.age} yrs — {patient.gender}
              <br />
              📞 {patient.contactInfo.phone} | 📧 {patient.contactInfo.email}
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(patient)} className="bg-yellow-400 px-2 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(patient._id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientList;

