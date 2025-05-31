import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import ScheduleForm from '../Admin/SheduleForm'; // Fixed typo

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
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-semibold mb-4">Doctor Schedules</h2>

      <button
        onClick={handleAdd}
        className="mb-6 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md transition"
      >
        Add New Schedule
      </button>

      {schedules.length === 0 ? (
        <p className="text-center text-gray-500">No schedules found.</p>
      ) : (
        <ul className="space-y-4">
          {schedules.map((schedule, index) => (
            <li
              key={schedule._id || index}
              className="p-4 border rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-sm"
            >
              <div className="mb-3 sm:mb-0">
                <p className="font-medium text-lg">
                  {schedule.doctorName || 'Doctor'} — <span className="text-gray-600">{schedule.specialization || 'N/A'}</span>
                </p>
                <p className="text-gray-700">{(schedule.availableDays || []).join(', ')}</p>
                <p className="text-gray-700">
                  {schedule.startTime} - {schedule.endTime}
                </p>
              </div>
              <button
                onClick={() => handleEdit(index)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md transition self-start sm:self-auto"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <div className="mt-8">
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




