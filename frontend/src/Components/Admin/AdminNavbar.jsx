import React, { useEffect, useState } from "react";
import {
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import axiosinstance from "../../api/axiosInstance";

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
        const res = await axiosinstance.get("/userole/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAdmin(res.data.data);
        setProfilePic(res.data.data.profilePic);
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
    localStorage.removeItem("user");
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
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      setUploading(true);
      const res = await axiosinstance.post(
        "/admin/upload-profile-pic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProfilePic(res.data.profilePic);
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm px-4 md:px-6 py-3 flex justify-between items-center sticky top-0 z-50 border-b dark:border-gray-700">
      {/* Logo */}
      <div className="text-xl font-bold text-blue-600 dark:text-white">
        HomelyCare
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 relative">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:scale-105 transition-transform"
        >
          {isDarkMode ? (
            <SunIcon className="w-5 h-5 text-yellow-500" />
          ) : (
            <MoonIcon className="w-5 h-5 text-gray-700" />
          )}
        </button>

        {/* Profile & Dropdown */}
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
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      admin.name || "Admin"
                    )}&background=random&size=128`)
              }
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border"
            />
            <span className="text-sm text-gray-700 dark:text-white font-medium hidden sm:inline">
              {admin.name || "Admin"}
            </span>
            <ChevronDownIcon className="w-4 h-4 text-gray-600 dark:text-white hidden sm:inline" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50 p-4 space-y-3">
              <div className="text-sm font-semibold text-gray-800 dark:text-white">
                Update Profile Picture
              </div>

              <div className="flex items-center space-x-3">
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
                  className="text-xs w-full"
                />
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full px-4 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
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







