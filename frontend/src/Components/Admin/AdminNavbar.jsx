import React, { useEffect, useState } from 'react';
import {
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import axiosinstance from '../../api/axiosInstance';
import ProfilePictureUploader from '../ProfilePictureUploader'; // Update path if needed

export default function AdminNavbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [admin, setAdmin] = useState({});
  const [profilePic, setProfilePic] = useState(null);

  const navigate = useNavigate();

  // Fetch admin profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosinstance.get('/userole/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setAdmin(response.data.data);
        setProfilePic(response.data.data.profilePic);
      } catch (err) {
        console.error('Failed to fetch admin profile', err);
      }
    };
    fetchProfile();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center">
      <div className="text-xl font-semibold text-blue-600 dark:text-white">
        HomelyCare
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Theme toggle */}
        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
          {isDarkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2"
          >
            <img
              src={
                profilePic
                  ? `/admin/uploads/${profilePic}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name || 'Admin')}&background=random&size=128`
              }
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover border"
            />
            <span className="text-gray-700 dark:text-white">{admin.name || 'Admin'}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-600 dark:text-white" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-12 right-0 w-64 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg z-50 p-4 space-y-2">
              <ProfilePictureUploader
                currentPic={profilePic}
                name={admin.name || 'Admin'}
                onUpload={(newPic) => {
                  setProfilePic(newPic);
                  setDropdownOpen(false); // optionally close after upload
                }}
              />

              <Link
                to="/admin/profile"
                className="block px-2 py-1 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                View Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-2 py-1 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}



