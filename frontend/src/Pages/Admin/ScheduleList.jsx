import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import ScheduleForm from '../Admin/SheduleForm';

const ScheduleList = ({ doctorId, token, userRole }) => {
  const [schedules, setSchedules] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchSchedules = async () => {
    if (!doctorId) return;

    try {
      const response = await axiosInstance.get(`/doctorschedule/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }, // Optional if axiosInstance handles auth globally
      });
      setSchedules(response.data?.schedules || []);
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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Doctor Schedules</h2>

      <button
        onClick={handleAdd}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add New Schedule
      </button>

      {schedules.length === 0 ? (
        <p className="text-gray-500">No schedules found.</p>
      ) : (
        <ul className="space-y-2">
          {schedules.map((schedule, index) => (
            <li
              key={index}
              className="p-4 border rounded-md flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  {schedule.doctorName || 'Doctor'} — {schedule.specialization || 'N/A'}
                </p>
                <p>{(schedule.availableDays || []).join(', ')}</p>
                <p>{schedule.startTime} - {schedule.endTime}</p>
              </div>
              <button
                onClick={() => handleEdit(index)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <ScheduleForm
          doctorId={doctorId}
          token={token}
          scheduleIndex={editingIndex}
          existingSchedule={editingIndex !== null ? schedules[editingIndex] : null}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default ScheduleList;


