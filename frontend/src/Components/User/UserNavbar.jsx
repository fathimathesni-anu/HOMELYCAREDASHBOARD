import React, { useEffect, useState } from "react";
import {
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

export default function UserNavbar({ toggleSidebar }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  // Your Cloudinary info - REPLACE with your actual values
  const cloudName = "dv9uopxjf";
  const uploadPreset = "unsigned_profile_pics";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get("/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.data);
        setProfilePic(res.data.data.profilepic || null);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    try {
      // Upload image file to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const cloudinaryData = await cloudinaryRes.json();

      if (!cloudinaryRes.ok) {
        throw new Error(cloudinaryData.error.message || "Cloudinary upload failed");
      }

      const uploadedUrl = cloudinaryData.secure_url;

      // Send the Cloudinary URL to your backend to save in DB
      const res = await axiosInstance.post(
        "/user/upload-profile-pic",
        { profilePic: uploadedUrl }, // JSON payload, not multipart/form-data
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update UI with the new profile picture URL
      setProfilePic(uploadedUrl);
      setFile(null);
      setPreview(null);
      setDropdownOpen(false);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-gray-900 shadow px-4 py-3 flex items-center justify-between md:px-6">
      {/* Mobile sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="md:hidden text-gray-600 dark:text-white"
        aria-label="Toggle sidebar"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      <div className="text-xl font-semibold text-blue-600 dark:text-white">
        HomelyCare
      </div>

      <div className="flex items-center gap-3 relative">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 focus:outline-none"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <img
              src={
                preview ||
                profilePic || // full Cloudinary URL from backend
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name || "User"
                )}&background=random&size=128`
              }
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover border"
            />
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-white">
              {user.name || "User"}
            </span>
            <ChevronDownIcon className="h-4 w-4 text-gray-600 dark:text-white" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 p-4 space-y-2">
              <div className="text-sm text-gray-700 dark:text-white mb-2">
                Update Profile Picture
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden border">
                  <img
                    src={
                      preview ||
                      profilePic ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name || "User"
                      )}&background=random&size=128`
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
                className="w-full px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
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







