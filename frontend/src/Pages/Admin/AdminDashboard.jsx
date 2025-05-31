
import React, { useState, useEffect } from 'react';
import AdminHomepage from './AdminHomepage';
import axiosInstance from '../../api/axiosInstance';

const AdminDashboard = () => {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 dark:text-white mb-4">
          {loading ? 'Loading...' : `Welcome, ${userName}`}
        </h1>

        {loading ? (
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Loading your information...
          </p>
        ) : error ? (
          <p className="text-sm sm:text-base text-red-500 dark:text-red-400">
            Error: {error}
          </p>
        ) : (
          <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
            Logged in as: <strong>{userName}</strong> | Role: <strong>{userRole}</strong>
          </div>
        )}

        {!loading && !error && (
          userRole === 'admin' ? (
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-md">
              <AdminHomepage />
            </div>
          ) : (
            <p className="text-sm sm:text-base text-red-500">
              Error: user role not authorised
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;









