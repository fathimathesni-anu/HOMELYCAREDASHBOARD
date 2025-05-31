import React, { useEffect, useState } from 'react';
import {
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

export default function UserNavbar({ onToggleSidebar }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/user/profile');
        setUser(response.data.data);
        setProfilePic(response.data.data.profilePic);
      } catch (err) {
        console.error('❌ Failed to fetch profile:', err.response?.data || err.message);
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
      const res = await axiosInstance.post('/user/upload-profile-pic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfilePic(res.data.profilePic);
      setFile(null);
      setPreview(null);
      setDropdownOpen(false);
    } catch (err) {
      console.error('❌ Upload failed:', err.response?.data || err.message);
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
    <header className="bg-white dark:bg-gray-900 shadow-md px-4 py-3 flex items-center justify-between w-full">
      {/* Mobile Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring"
          onClick={onToggleSidebar}
        >
          <Bars3Icon className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="text-xl font-semibold text-blue-600 dark:text-white">HomelyCare</h1>
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Dark Mode Toggle */}
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
                preview ||
                (profilePic
                  ? `/user/uploads/${profilePic}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random&size=128`)
              }
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover border"
            />
            <span className="text-gray-700 dark:text-white text-sm hidden sm:block">
              {user.name || 'User'}
            </span>
            <ChevronDownIcon className="h-4 w-4 text-gray-600 dark:text-white" />
          </button>

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
                        ? `/user/uploads/${profilePic}`
                        : `https://ui-avatars.com/api/?name=${user.name}&background=random&size=128`)
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





