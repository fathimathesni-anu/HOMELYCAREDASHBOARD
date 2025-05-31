import React, { useEffect, useState } from 'react';
import {
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import axiosinstance from '../../api/axiosInstance';

export default function DoctorNavbar({ onToggleSidebar }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [doctor, setDoctor] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosinstance.get('/userole/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setDoctor(res.data.data);
        setProfilePic(res.data.data.profilePic);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      setUploading(true);
      const res = await axiosinstance.post('/doctor/upload-profile-pic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProfilePic(res.data.profilePic);
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md px-4 py-3 flex justify-between items-center md:px-6">
      {/* Left: Logo and Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-gray-600 dark:text-gray-300"
          onClick={onToggleSidebar}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <span className="text-xl font-semibold text-blue-600 dark:text-white">HomelyCare</span>
      </div>

      {/* Right: Profile and Controls */}
      <div className="flex items-center gap-4 relative">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
        >
          {isDarkMode ? (
            <SunIcon className="h-6 w-6" />
          ) : (
            <MoonIcon className="h-6 w-6" />
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2"
          >
            <img
              src={
                preview ||
                (profilePic
                  ? `/doctor/uploads/${profilePic}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      doctor.name || 'Doctor'
                    )}&background=random&size=128`)
              }
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover border"
            />
            <span className="text-gray-700 dark:text-white hidden sm:inline">
              {doctor.name || 'Doctor'}
            </span>
            <ChevronDownIcon className="h-4 w-4 text-gray-600 dark:text-white" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-12 right-0 w-64 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg z-50 p-4 space-y-2">
              <div className="text-sm text-gray-700 dark:text-white mb-2">
                Update Profile Picture
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden border">
                  <img
                    src={
                      preview ||
                      (profilePic
                        ? `/doctor/uploads/${profilePic}`
                        : `https://ui-avatars.com/api/?name=${doctor.name}&background=random&size=128`)
                    }
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="text-sm"
                />
              </div>

              <button
                onClick={handleUpload}
                className="block w-full px-2 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>

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



