import React, { useEffect, useState } from 'react';
import { User2Icon } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

const DoctorListWidget = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axiosInstance.get('/doctor'); // Adjust endpoint as needed
        if (Array.isArray(res.data)) {
          setDoctors(res.data.slice(0, 8)); // show only first 8
        } else {
          console.error('Unexpected response format:', res.data);
          setDoctors([]);
        }
      } catch (error) {
        console.error('Error fetching doctor list:', error);
      }
    };

    fetchDoctors();
    const interval = setInterval(fetchDoctors, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 w-full max-w-sm">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
        Doctors List
      </h2>
      <ul className="space-y-3 max-h-64 overflow-y-auto">
        {doctors.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            No doctors available.
          </p>
        ) : (
          doctors.map((doctor) => (
            <li key={doctor._id} className="flex justify-between items-center">
              <div className="flex items-center">
                <User2Icon className="h-5 w-5 text-blue-500 mr-2" />
                <div className="flex flex-col">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {doctor.userId?.name || 'No Name'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {doctor.specialization}
                  </span>
                </div>
              </div>
              <span
                className={`text-sm font-medium ${
                  doctor.availabilityStatus === 'Available'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {doctor.availabilityStatus}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default DoctorListWidget;


