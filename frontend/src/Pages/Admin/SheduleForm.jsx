import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const ScheduleForm = ({ doctorId, scheduleIndex = null, existingSchedule = null, token, onSuccess }) => {
  const [formData, setFormData] = useState({
    doctorName: existingSchedule?.doctorName || '',
    specialization: existingSchedule?.specialization || '',
    availableDays: existingSchedule?.availableDays || [],
    startTime: existingSchedule?.startTime || '',
    endTime: existingSchedule?.endTime || '',
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = scheduleIndex !== null
        ? `/doctorschedule/${doctorId}/schedules/${scheduleIndex}`
        : `/doctorschedule/${doctorId}/schedules`;

      const method = scheduleIndex !== null ? 'put' : 'post';

      const response = await axiosInstance[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(`Schedule ${scheduleIndex !== null ? 'updated' : 'added'} successfully.`);
      if (onSuccess) onSuccess(response.data);
    } catch (err) {
      console.error('Error submitting schedule:', err);
      alert('Failed to submit schedule');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Doctor Name</label>
        <input
          type="text"
          name="doctorName"
          value={formData.doctorName}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Specialization</label>
        <input
          type="text"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Available Days</label>
        <div className="grid grid-cols-2 gap-2">
          {daysOfWeek.map((day) => (
            <label key={day} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.availableDays.includes(day)}
                onChange={() => handleCheckboxChange(day)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>{day}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none"
        >
          {scheduleIndex !== null ? 'Update Schedule' : 'Add Schedule'}
        </button>
      </div>
    </form>
  );
};

export default ScheduleForm;


