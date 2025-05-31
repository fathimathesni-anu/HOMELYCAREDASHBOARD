import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import ScheduleForm from '../Staff/SheduleForm';

const ScheduleList = ({ doctorId, token, userRole }) => {
  const [schedules, setSchedules] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchSchedules = async () => {
    if (!doctorId) return;

    try {
      const response = await axiosInstance.get(`/doctorschedule/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSchedules(Array.isArray(response.data?.schedules) ? response.data.schedules : []);
    } catch (err) {
      console.error('Error fetching schedules:', err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [doctorId]);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingIndex(null);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingIndex(null);
    fetchSchedules();
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-center sm:text-left">Doctor Schedules</h2>

      <div className="flex justify-center sm:justify-start">
        <button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-semibold transition"
        >
          Add New Schedule
        </button>
      </div>

      {schedules.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">No schedules found.</p>
      ) : (
        <ul className="space-y-4">
          {schedules.map((schedule, index) => (
            <li
              key={schedule._id || index}
              className="p-4 border rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 flex-1 min-w-0">
                <p className="font-medium truncate">
                  {schedule.doctorName || 'Doctor'} — {schedule.specialization || 'N/A'}
                </p>
                <p className="text-gray-600 truncate">{(schedule.availableDays || []).join(', ')}</p>
                <p className="text-gray-600 truncate">
                  {schedule.startTime} - {schedule.endTime}
                </p>
              </div>
              <button
                onClick={() => handleEdit(index)}
                className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition self-stretch sm:self-auto"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <div className="mt-6">
          <ScheduleForm
            doctorId={doctorId}
            token={token}
            scheduleIndex={editingIndex}
            existingSchedule={editingIndex !== null ? schedules[editingIndex] : null}
            onSuccess={handleSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default ScheduleList;




