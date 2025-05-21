import React, { useEffect, useState } from 'react';
import DoctorForm from './DoctorForm';
import ScheduleForm from './SheduleForm';
import axiosInstance from '../../api/axiosInstance';

const DoctorManagementDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [token, setToken] = useState(''); // Replace with auth token logic

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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Doctor Management Dashboard</h1>

      <div className="mb-10">
        <DoctorForm />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Doctors List</h2>
        <ul className="divide-y divide-gray-200">
          {doctors.map((doc) => (
            <li key={doc._id} className="py-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{doc.userId?.name || 'Unnamed Doctor'}</p>
                <p className="text-sm text-gray-500">{doc.specialization}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleScheduleClick(doc)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Manage Schedule
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showScheduleModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-2xl relative">
            <button
              onClick={closeScheduleModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Manage Schedule for {selectedDoctor.userId?.name}</h2>

            {selectedDoctor.schedule?.map((sched, index) => (
              <div key={index} className="mb-6">
                <ScheduleForm
                  doctorId={selectedDoctor._id}
                  scheduleIndex={index}
                  existingSchedule={sched}
                  token={token}
                  onSuccess={fetchDoctors}
                />
              </div>
            ))}

            <div className="mt-6">
              <ScheduleForm
                doctorId={selectedDoctor._id}
                token={token}
                onSuccess={fetchDoctors}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagementDashboard;







