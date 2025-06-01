import React, { useEffect, useState } from "react";
import {
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import axiosinstance from "../../api/axiosInstance";

export default function AdminNavbar({ toggleSidebar }) {
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
        const token = localStorage.getItem("token");
        const res = await axiosinstance.get("/userole/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
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
          {isDarkMode ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
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
                (profilePic
                  ? `/admin/uploads/${profilePic}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      admin.name || "Admin"
                    )}&background=random&size=128`)
              }
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover border"
            />
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-white">
              {admin.name || "Admin"}
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
                      (profilePic
                        ? `/admin/uploads/${profilePic}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            admin.name || "Admin"
                          )}&background=random&size=128`)
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









