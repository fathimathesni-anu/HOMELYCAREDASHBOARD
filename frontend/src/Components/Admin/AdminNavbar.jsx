import React, { useEffect, useState } from 'react';
import {
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import axiosinstance from '../../api/axiosInstance';

export default function AdminNavbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [admin, setAdmin] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

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
      const res = await axiosinstance.post('/admin/upload-profile-pic', formData, {
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
    <header className="bg-white dark:bg-gray-900 shadow-md px-4 md:px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Branding */}
      <div className="text-lg md:text-xl font-semibold text-blue-600 dark:text-white truncate">
        HomelyCare
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-3 md:gap-4 relative">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:scale-105 transition-transform"
        >
          {isDarkMode ? (
            <SunIcon className="h-5 w-5 text-yellow-500" />
          ) : (
            <MoonIcon className="h-5 w-5 text-gray-800" />
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <img
              src={
                preview ||
                (profilePic
                  ? `/admin/uploads/${profilePic}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name || 'Admin')}&background=random&size=128`)
              }
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover border"
            />
            {/* <span className="text-sm font-medium text-gray-700 dark:text-white hidden sm:inline">
              {admin.name || 'Admin'}
            </span> */}
            <span className="text-sm font-medium text-gray-700 dark:text-white hidden sm:inline">
              {admin.name || 'Admin'}
            </span>

            <ChevronDownIcon className="h-4 w-4 text-gray-600 dark:text-white hidden sm:inline" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-50 p-4 space-y-2">
              <div className="text-sm font-semibold text-gray-700 dark:text-white mb-2">
                Update Profile Picture
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden border">
                  <img
                    src={
                      preview ||
                      (profilePic
                        ? `/admin/uploads/${profilePic}`
                        : `https://ui-avatars.com/api/?name=${admin.name}&background=random&size=128`)
                    }
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="text-xs"
                />
              </div>

              <button
                onClick={handleUpload}
                className="w-full px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
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





