import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function DoctorSelector({ onDoctorSelect }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  // Fetch doctors from the API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get('/doctor');
        setDoctors(response.data);  // Assuming doctors contain userId with name, specialization
      } catch (error) {
        console.error('Failed to fetch doctors:', error.message);
      }
    };
    fetchDoctors();
  }, []);

  // Handle doctor selection from dropdown
  const handleChange = (e) => {
    const doctorId = e.target.value;
    setSelectedId(doctorId);

    // Find selected doctor by ID
    const selectedDoctor = doctors.find((doctor) => doctor._id === doctorId);

    // Pass the selected doctor details to the parent component
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
            {/* Access the name from userId, and specialization from the doctor object */}
            {doc.userId?.name} ({doc.specialization}) 
          </option>
        ))}
      </select>
    </div>
  );
}



