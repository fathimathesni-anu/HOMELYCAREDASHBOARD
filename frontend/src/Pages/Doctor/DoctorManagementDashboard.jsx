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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center sm:text-left">
        Doctor Management Dashboard
      </h1>

      <div className="mb-12">
        <DoctorForm />
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">Doctors List</h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[60vh] overflow-y-auto">
          {doctors.map((doc) => (
            <li
              key={doc._id}
              className="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              <div className="mb-3 sm:mb-0">
                <p className="font-semibold text-lg dark:text-gray-100">
                  {doc.userId?.name || 'Unnamed Doctor'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {doc.specialization}
                </p>
              </div>
              <div>
                <button
                  onClick={() => handleScheduleClick(doc)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
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
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
          onClick={closeScheduleModal} // Close modal on backdrop click
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()} // Prevent modal close on content click
          >
            <button
              onClick={closeScheduleModal}
              className="absolute top-3 right-3 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white text-3xl font-bold focus:outline-none"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 dark:text-gray-100">
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









