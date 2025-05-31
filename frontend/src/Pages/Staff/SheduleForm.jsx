import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const ScheduleForm = ({
  doctorId,
  scheduleIndex = null,
  existingSchedule = null,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    doctorName: existingSchedule?.doctorName || '',
    specialization: existingSchedule?.specialization || '',
    availableDays: Array.isArray(existingSchedule?.availableDays) ? existingSchedule.availableDays : [],
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

      if (scheduleIndex !== null) {
        await axiosInstance.put(url, formData);
      } else {
        await axiosInstance.post(url, formData);
      }

      alert(`Schedule ${scheduleIndex !== null ? 'updated' : 'added'} successfully.`);
      onSuccess?.();
    } catch (err) {
      console.error('Error submitting schedule:', err);
      alert('Failed to submit schedule');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    try {
      const url = `/doctorschedule/${doctorId}/schedules/${scheduleIndex}`;
      await axiosInstance.delete(url);

      alert('Schedule deleted successfully.');
      onSuccess?.();
    } catch (err) {
      console.error('Error deleting schedule:', err);
      alert('Failed to delete schedule');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 mt-6 border rounded-lg p-5 bg-white shadow-md max-w-lg mx-auto"
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700">Doctor Name</label>
        <input
          type="text"
          name="doctorName"
          value={formData.doctorName}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Specialization</label>
        <input
          type="text"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Available Days</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {daysOfWeek.map((day) => (
            <label
              key={day}
              className="flex items-center space-x-2 cursor-pointer text-gray-700"
            >
              <input
                type="checkbox"
                checked={formData.availableDays.includes(day)}
                onChange={() => handleCheckboxChange(day)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="select-none">{day}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:space-x-6 gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700">End Time</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0">
        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold
            px-6 py-2 rounded-md transition"
        >
          {scheduleIndex !== null ? 'Update Schedule' : 'Add Schedule'}
        </button>

        {scheduleIndex !== null && (
          <button
            type="button"
            onClick={handleDelete}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold
              px-6 py-2 rounded-md transition"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
};

export default ScheduleForm;







