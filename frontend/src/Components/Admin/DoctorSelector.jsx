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
    <div className="mb-6 w-full max-w-md mx-auto px-4">
      <label
        htmlFor="doctor-select"
        className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold text-lg"
      >
        Select Doctor
      </label>
      <select
        id="doctor-select"
        value={selectedId}
        onChange={handleChange}
        className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition"
        aria-label="Select a doctor"
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






