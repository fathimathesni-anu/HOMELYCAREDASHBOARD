import React, { useState, useEffect } from 'react';
import axiosinstance from '../api/axiosInstance';

export default function ProfilePictureUploader({ currentPic, name, onUpload }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);

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
      const res = await axiosinstance.post('/userole/upload-profile-pic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      onUpload(res.data.profilePic); // Send new filename to parent
      setFile(null);
      setPreview(null);
      setUploadMessage('Upload successful!');
    } catch (err) {
      console.error('Upload failed', err);
      setUploadMessage('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (uploadMessage) {
      const timer = setTimeout(() => setUploadMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadMessage]);

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-700 dark:text-white">Update Profile Picture</div>

      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full overflow-hidden border">
          <img
            src={
              preview ||
              (currentPic
                ? `/admin/uploads/${currentPic}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`)
            }
            alt="Preview"
            className="object-cover w-full h-full"
          />
        </div>
        <input type="file" onChange={handleFileChange} accept="image/*" className="text-sm" />
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="block w-full px-2 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {uploadMessage && (
        <div className="text-sm text-green-600 dark:text-green-400">{uploadMessage}</div>
      )}
    </div>
  );
}

