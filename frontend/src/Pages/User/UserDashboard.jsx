import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../api/axiosInstance'; // adjust path as needed
import UserHomepage from './UserHomepage';

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("user/profile", { withCredentials: true });
        setUserName(res.data.data.name);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]); // Correct dependency

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-700 dark:text-white">
        {loading ? 'Loading...' : error ? 'Error loading user' : `Welcome,  ${userName} `}
      </h1>

      {!loading && !error && <UserHomepage />}
    </div>
  );
};

export default UserDashboard;








