import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance'; // Adjust path as needed

const CreateStaff = () => {
  const [formData, setFormData] = useState({
    userId: '',
    position: '',
    department: '',
    contactInfo: {
      phone: '',
      email: '',
    },
    schedule: [{ day: '', startTime: '', endTime: '' }],
    assignedTasks: [],
  });

  const [message, setMessage] = useState('');

  const handleChange = (e, field, index = null) => {
    const { name, value } = e.target;

    if (field === 'contactInfo') {
      setFormData({
        ...formData,
        contactInfo: {
          ...formData.contactInfo,
          [name]: value,
        },
      });
    } else if (field === 'schedule') {
      const updatedSchedule = [...formData.schedule];
      updatedSchedule[index][name] = value;
      setFormData({
        ...formData,
        schedule: updatedSchedule,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddSchedule = () => {
    setFormData({
      ...formData,
      schedule: [...formData.schedule, { day: '', startTime: '', endTime: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/staff/create', formData);
      setMessage('Staff member created successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create staff');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Create Staff Member</h2>
      {message && <div className="mb-4 text-red-500">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={formData.userId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={formData.position}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.contactInfo.phone}
            onChange={(e) => handleChange(e, 'contactInfo')}
            className="border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.contactInfo.email}
            onChange={(e) => handleChange(e, 'contactInfo')}
            className="border p-2 rounded"
          />
        </div>

        <div>
          <h3 className="font-semibold mb-2">Schedule</h3>
          {formData.schedule.map((slot, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                name="day"
                placeholder="Day"
                value={slot.day}
                onChange={(e) => handleChange(e, 'schedule', index)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="startTime"
                placeholder="Start Time"
                value={slot.startTime}
                onChange={(e) => handleChange(e, 'schedule', index)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="endTime"
                placeholder="End Time"
                value={slot.endTime}
                onChange={(e) => handleChange(e, 'schedule', index)}
                className="border p-2 rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSchedule}
            className="text-blue-500 hover:underline"
          >
            + Add Schedule Slot
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Staff
        </button>
      </form>
    </div>
  );
};

export default CreateStaff;



