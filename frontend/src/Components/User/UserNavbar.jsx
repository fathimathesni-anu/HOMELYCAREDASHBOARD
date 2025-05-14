import React, { useEffect, useState } from 'react';
import {
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

export default function UserNavbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  // ✅ Fetch user profile
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

  // 🖼 Handle file input
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // ⬆️ Upload new profile picture
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
    <header className="bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center">
      <div className="text-xl font-semibold text-blue-600 dark:text-white">
        HomelyCare
      </div>

      <div className="flex items-center gap-4 relative">
        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
          {isDarkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2"
          >
            <img
              src={
                preview ||
                (profilePic
                  ? `user/uploads/${profilePic}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random&size=128`)
              }
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover border"
            />
            <span className="text-gray-700 dark:text-white">{user.name || 'User'}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-600 dark:text-white" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-12 right-0 w-64 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg z-50 p-4 space-y-2">
              <div className="text-sm text-gray-700 dark:text-white mb-2">Update Profile Picture</div>

              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden border">
                  <img
                    src={preview || (profilePic ? `user/uploads/${profilePic}` : 'https://ui-avatars.com/api/?name=User&background=random&size=128')}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                </div>
                <input type="file" onChange={handleFileChange} accept="image/*" className="text-sm" />
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="block w-full text-left px-2 py-1 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>

              <Link
                to="/profile"
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



