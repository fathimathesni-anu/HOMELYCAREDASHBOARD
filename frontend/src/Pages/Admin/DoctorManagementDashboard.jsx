import React, { useEffect, useState } from 'react';
import DoctorForm from './DoctorForm';
import ScheduleList from './ScheduleList';
import axiosInstance from '../../api/axiosInstance';

const DoctorManagementDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [token, setToken] = useState(''); // Replace with actual auth logic

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axiosInstance.get('/doctor');
      setDoctors(res.data);
    } catch (error) {
      console.error('Failed to fetch doctors', error);
    }
  };

  const handleScheduleClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowScheduleModal(true);
  };

  const closeScheduleModal = () => {
    setSelectedDoctor(null);
    setShowScheduleModal(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center md:text-left">
        Doctor Management Dashboard
      </h1>

      <div className="mb-12">
        <DoctorForm />
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6">Doctors List</h2>
        <ul className="divide-y divide-gray-300 max-h-[400px] overflow-auto rounded">
          {doctors.length === 0 && (
            <li className="py-4 text-center text-gray-500">No doctors found.</li>
          )}
          {doctors.map((doc) => (
            <li
              key={doc._id}
              className="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0"
            >
              <div>
                <p className="font-semibold text-lg">{doc.userId?.name || 'Unnamed Doctor'}</p>
                <p className="text-sm text-gray-600">{doc.specialization}</p>
              </div>
              <div>
                <button
                  onClick={() => handleScheduleClick(doc)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto transition"
                  aria-label={`Manage schedule for ${doc.userId?.name || 'doctor'}`}
                >
                  Manage Schedule
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && selectedDoctor && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          aria-modal="true"
          role="dialog"
          aria-labelledby="schedule-modal-title"
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative p-6 md:p-8">
            <button
              onClick={closeScheduleModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-3xl leading-none"
              aria-label="Close schedule modal"
            >
              &times;
            </button>
            <h2
              id="schedule-modal-title"
              className="text-2xl font-bold mb-6 text-center md:text-left"
            >
              Manage Schedule for {selectedDoctor.userId?.name || 'Doctor'}
            </h2>

            <ScheduleList
              doctorId={selectedDoctor._id}
              token={token}
              userRole="admin" // Or derive from user context
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagementDashboard;









