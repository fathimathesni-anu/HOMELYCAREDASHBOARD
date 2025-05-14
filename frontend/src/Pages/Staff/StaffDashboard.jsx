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
    <div>
      <h1 className="text-2xl font-bold text-gray-700 dark:text-white mb-4">
        {loading ? 'Loading...' : error ? 'Error loading profile' : `Welcome, ${userName}`}
      </h1>

      {!loading && !error && (
        <div className="text-gray-600 dark:text-gray-300 mb-4">
          Logged in as: <strong>{userName}</strong> ({userRole})
        </div>
      )}

      {error && <p className="text-red-500 dark:text-red-400">Error: {error}</p>}

      {!loading && !error && (
        <>
          {userRole === 'staff' && (
            <p className="text-blue-500">Staff access granted. You can manage assigned tasks.</p>
          )}
          {/* Add other roles if needed */}
          <StaffHomepage />
        </>
      )}
    </div>
  );
};

export default StaffDashboard;



