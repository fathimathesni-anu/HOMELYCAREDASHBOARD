// components/ScheduleViewer.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const ScheduleViewer = ({ doctorId, token }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!doctorId) return;

    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/doctorschedule/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedules(response.data?.schedules || []);
      } catch (err) {
        console.error('Failed to load schedule:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [doctorId]);

  if (!doctorId) return null;

  return (
    <div className="mt-4 p-4 border rounded bg-gray-50">
      <h3 className="text-md font-semibold mb-2">Available Schedule</h3>
      {loading ? (
        <p>Loading...</p>
      ) : schedules.length === 0 ? (
        <p className="text-gray-500">No schedule available.</p>
      ) : (
        <ul className="list-disc pl-4 space-y-1">
          {schedules.map((schedule, index) => (
            <li key={index}>
              <span className="font-medium">{schedule.availableDays?.join(', ') || 'N/A'}</span>
              {' '}— {schedule.startTime} to {schedule.endTime}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScheduleViewer;

