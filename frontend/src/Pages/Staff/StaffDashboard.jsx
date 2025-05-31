import React, { useState, useEffect } from 'react';
import StaffHomepage from './StaffHomepage'; // Update to your actual component
import axiosInstance from '../../api/axiosInstance';

const StaffDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('userole/profile', { withCredentials: true });
        const { name, role } = res.data.data || {};
        setUserName(name);
        setUserRole(role);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-white mb-6 text-center sm:text-left">
        {loading ? 'Loading...' : error ? 'Error loading profile' : `Welcome, ${userName}`}
      </h1>

      {!loading && !error && (
        <div className="text-center sm:text-left text-gray-600 dark:text-gray-300 mb-6 text-sm sm:text-base">
          Logged in as: <strong>{userName}</strong> | Role: <strong>{userRole}</strong>
        </div>
      )}

      {error && (
        <p className="text-center sm:text-left text-red-600 dark:text-red-400 mb-6 font-medium">
          Error: {error}
        </p>
      )}

      {!loading && !error && (
        userRole === 'staff' ? (
          <>
            <p className="text-center sm:text-left text-blue-600 dark:text-blue-400 mb-6 font-semibold">
              Staff access granted. You can manage assigned tasks.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
              <StaffHomepage />
            </div>
          </>
        ) : (
          <p className="text-center sm:text-left text-red-600 dark:text-red-400 font-semibold">
            Error: user role not authorised
          </p>
        )
      )}
    </div>
  );
};

export default StaffDashboard;




