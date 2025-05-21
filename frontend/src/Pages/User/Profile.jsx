// src/Pages/User/Profile.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    profilePic: "", // camelCase here
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/user/profile")
      .then((res) => {
        console.log("User profile data:", res.data.data); // Debug log
        setUser(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to load profile");
      });
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("mobile", user.mobile);
    if (file) {
      formData.append("profilePic", file);
    }

    try {
      const res = await axiosInstance.put("/user/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data.data);
      setMessage("Profile updated successfully");
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>

      {message && (
        <div className="mb-4 text-sm text-white px-4 py-2 rounded bg-blue-600 text-center">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-4"
      >
        <div className="flex justify-center">
          <img
            src={
              user.profilePic
                ? `user/uploads/${user.profilePic}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name || "User"
                  )}&background=random&size=128`
            }
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile</label>
          <input
            type="text"
            name="mobile"
            value={user.mobile}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <input
            type="file"
            name="profilePic"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;




