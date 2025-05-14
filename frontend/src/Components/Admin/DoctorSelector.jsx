import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function DoctorSelector({ onDoctorSelect }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get('/doctor');
        setDoctors(response.data);
      } catch (error) {
        console.error('Failed to fetch doctors:', error.message);
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const doctorId = e.target.value;
    setSelectedId(doctorId);
    const selectedDoctor = doctors.find((doctor) => doctor._id === doctorId);
    if (selectedDoctor) {
      onDoctorSelect(selectedDoctor);
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium">Select Doctor</label>
      <select
        value={selectedId}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded"
      >
        <option value="">-- Choose a doctor --</option>
        {doctors.map((doc) => (
          <option key={doc._id} value={doc._id}>
            {doc.userId?.name} ({doc.specialization})
          </option>
        ))}
      </select>
    </div>
  );
}




