import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const ScheduleForm = ({ doctorId, scheduleIndex = null, existingSchedule = null, token, onSuccess }) => {
  const [formData, setFormData] = useState({
    availableDays: existingSchedule?.availableDays || [],
    startTime: existingSchedule?.startTime || '',
    endTime: existingSchedule?.endTime || '',
  });

  const [loading, setLoading] = useState(false);
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
    setLoading(true);

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

      alert(`Schedule ${scheduleIndex !== null ? 'updated' : 'added'} successfully`);
      onSuccess?.();
    } catch (err) {
      console.error('Error submitting schedule:', err);
      alert('Failed to submit schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    try {
      const url = `/doctorschedule/${doctorId}/schedules/${scheduleIndex}`;
      await axiosInstance.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Schedule deleted successfully');
      onSuccess?.();
    } catch (err) {
      console.error('Error deleting schedule:', err);
      alert('Failed to delete schedule');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
      <div>
        <label className="block font-semibold mb-1">Available Days:</label>
        <div className="flex flex-wrap gap-3">
          {daysOfWeek.map((day) => (
            <label key={day} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={formData.availableDays.includes(day)}
                onChange={() => handleCheckboxChange(day)}
              />
              <span>{day}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">Start Time:</label>
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">End Time:</label>
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {scheduleIndex !== null ? 'Update' : 'Add'} Schedule
        </button>

        {scheduleIndex !== null && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            disabled={loading}
          >
            Delete Schedule
          </button>
        )}
      </div>
    </form>
  );
};

export default ScheduleForm;


