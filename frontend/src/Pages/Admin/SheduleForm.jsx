import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance'; // Make sure the path is correct

const ScheduleForm = ({ doctorId, scheduleIndex = null, existingSchedule = null, token }) => {
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
        ? `/doctors/${doctorId}/schedules/${scheduleIndex}`
        : `/doctors/${doctorId}/schedules`;

      const method = scheduleIndex !== null ? 'put' : 'post';

      const response = await axiosInstance[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // If needed for secure endpoints
        },
      });

      alert(`Schedule ${scheduleIndex !== null ? 'updated' : 'added'} successfully.`);
      console.log(response.data);
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Failed to submit schedule');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Doctor Name:</label>
        <input name="doctorName" value={formData.doctorName} onChange={handleChange} required />
      </div>
      <div>
        <label>Specialization:</label>
        <input name="specialization" value={formData.specialization} onChange={handleChange} required />
      </div>
      <div>
        <label>Available Days:</label>
        {daysOfWeek.map((day) => (
          <label key={day}>
            <input
              type="checkbox"
              checked={formData.availableDays.includes(day)}
              onChange={() => handleCheckboxChange(day)}
            />
            {day}
          </label>
        ))}
      </div>
      <div>
        <label>Start Time:</label>
        <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
      </div>
      <div>
        <label>End Time:</label>
        <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
      </div>
      <button type="submit">{scheduleIndex !== null ? 'Update' : 'Add'} Schedule</button>
    </form>
  );
};

export default ScheduleForm;

