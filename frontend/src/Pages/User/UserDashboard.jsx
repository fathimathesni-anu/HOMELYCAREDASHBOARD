import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import UserHomepage from './UserHomepage';

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('user/profile', {
          withCredentials: true,
        });
        setUserName(res.data.data.name);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center px-4 py-10 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-white mb-8 text-center max-w-xl">
        {loading
          ? 'Loading...'
          : error
          ? 'Error loading user'
          : `Welcome, ${userName}`}
      </h1>

      {!loading && !error && (
        <div className="w-full max-w-5xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 sm:p-10">
          <UserHomepage />
        </div>
      )}
    </div>
  );
};

export default UserDashboard;











