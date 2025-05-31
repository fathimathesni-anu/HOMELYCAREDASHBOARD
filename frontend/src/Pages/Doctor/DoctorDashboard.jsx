import React, { useState, useEffect } from 'react';
import DoctorHomepage from './DoctorHomepage';
import axiosInstance from '../../api/axiosInstance';

const DoctorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('userole/profile', { withCredentials: true });
        const data = res?.data?.data;
        if (data) {
          setUserName(data.name || '');
          setUserRole(data.role || '');
        } else {
          setError("Invalid user data received");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 dark:text-white mb-6 text-center sm:text-left">
        {loading ? 'Welcome...' : `Welcome, Dr. ${userName}`}
      </h1>

      {loading ? (
        <p className="text-center sm:text-left text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-6">
          Loading your information...
        </p>
      ) : error ? (
        <p className="text-center sm:text-left text-red-500 dark:text-red-400 text-sm sm:text-base mb-6">
          Error: {error}
        </p>
      ) : (
        <div className="text-center sm:text-left text-gray-600 dark:text-gray-300 mb-6 text-sm sm:text-base">
          Logged in as: <strong>{userName}</strong> | Role: <strong>{userRole}</strong>
        </div>
      )}

      {!loading && !error && (
        userRole === 'doctor' ? (
          <DoctorHomepage />
        ) : (
          <p className="text-center sm:text-left text-red-500 text-sm sm:text-base">
            Error: user role not authorised
          </p>
        )
      )}
    </div>
  );
};

export default DoctorDashboard;






