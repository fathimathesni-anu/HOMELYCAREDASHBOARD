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
  }, [doctorId, token]);

  if (!doctorId) return null;

  return (
    <div className="mt-6 p-4 sm:p-6 md:p-8 border rounded-lg bg-gray-50 max-w-full w-full md:max-w-xl mx-auto">
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-center md:text-left text-gray-800">
        Available Schedule
      </h3>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : schedules.length === 0 ? (
        <p className="text-center text-gray-500 italic">No schedule available.</p>
      ) : (
        <ul className="list-disc pl-5 space-y-3 text-gray-700">
          {schedules.map((schedule, index) => (
            <li
              key={index}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
              tabIndex={0} // keyboard focusable for accessibility
            >
              <span className="font-medium text-base sm:text-lg">
                {schedule.availableDays?.length
                  ? schedule.availableDays.join(', ')
                  : 'N/A'}
              </span>
              <span className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-0">
                {schedule.startTime} to {schedule.endTime}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScheduleViewer;



