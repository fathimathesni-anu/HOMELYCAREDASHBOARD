
  // DoctorSelector.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function DoctorSelector({ onDoctorSelect, selectedDoctor }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedId, setSelectedId] = useState(selectedDoctor?._id || '');

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
    const selectedDoc = doctors.find((doc) => doc._id === doctorId);
    onDoctorSelect(selectedDoc);
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





