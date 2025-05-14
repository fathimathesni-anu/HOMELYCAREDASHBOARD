import React, { useEffect, useState } from 'react';
import DoctorForm from './DoctorForm';
import ScheduleForm from './SheduleForm';
import axiosInstance from '../../api/axiosInstance';

const DoctorManagementDashboard = ({ token }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const fetchDoctors = async () => {
    try {
      const response = await axiosInstance.get('/doctors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(response.data);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDoctorCreatedOrUpdated = () => {
    fetchDoctors();
    setSelectedDoctor(null);
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await axiosInstance.delete(`/doctors/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDoctors();
    } catch (err) {
      console.error('Failed to delete doctor:', err);
      alert('Failed to delete doctor');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center">Doctor Management Dashboard</h1>

      <DoctorForm
        editingDoctor={selectedDoctor}
        token={token}
        onSuccess={handleDoctorCreatedOrUpdated}
      />

      <hr />

      <div>
        <h2 className="text-xl font-semibold mb-2">Doctor List</h2>
        <ul className="space-y-2">
          {doctors.map((doc) => (
            <li key={doc._id} className="border p-4 flex justify-between items-center">
              <div>
                <p className="font-bold">{doc.userId}</p>
                <p className="text-sm text-gray-600">Specialization: {doc.specialization}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setSelectedDoctor(doc)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteDoctor(doc._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedDoctor && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Manage Schedules for {selectedDoctor.userId}</h2>
          <ScheduleForm doctorId={selectedDoctor._id} token={token} />
        </div>
      )}
    </div>
  );
};

export default DoctorManagementDashboard;






