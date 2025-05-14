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
    <div>
      <h1 className="text-2xl font-bold text-gray-700 dark:text-white mb-4">
        {loading ? 'Loading...' : `Welcome, ${userName}`}
      </h1>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading your information...</p>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400">Error: {error}</p>
      ) : (
        <div className="text-gray-600 dark:text-gray-300 mb-4">
          Logged in as: <strong>{userName}</strong> | Role: <strong>{userRole}</strong>
        </div>
      )}

      {!loading && !error && <AdminHomepage />}
    </div>
  );
};

export default AdminDashboard;








