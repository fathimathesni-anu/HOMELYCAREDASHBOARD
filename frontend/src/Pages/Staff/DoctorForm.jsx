import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const DoctorForm = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    specialization: '',
    schedule: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axiosInstance.get('/doctor');
      setDoctors(res.data);
    } catch (error) {
      console.error('Failed to fetch doctors', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setFormData({ ...formData, schedule: newSchedule });
  };

  const addScheduleField = () => {
    setFormData({
      ...formData,
      schedule: [
        ...formData.schedule,
        { doctorName: '', specialization: '', availableDays: [], startTime: '', endTime: '' },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axiosInstance.put(`/doctor/update/${editId}`, formData);
      } else {
        await axiosInstance.post('/doctor/create', formData);
      }
      setFormData({ userId: '', specialization: '', schedule: [] });
      setEditMode(false);
      fetchDoctors();
    } catch (error) {
      console.error('Error saving doctor', error);
    }
  };

  const handleEdit = (doctor) => {
    setFormData({
      userId: doctor.userId?._id || '',
      specialization: doctor.specialization,
      schedule: doctor.schedule,
    });
    setEditMode(true);
    setEditId(doctor._id);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/doctor/delete/${id}`);
      fetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor', error);
    }
  };

  const filteredDoctors = doctors.filter((doc) =>
    doc.specialization.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">{editMode ? 'Edit Doctor' : 'Add Doctor'}</h2>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="userId"
            placeholder="User ID"
            value={formData.userId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="specialization"
            placeholder="Specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="button"
          onClick={addScheduleField}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          Add Schedule
        </button>

        {formData.schedule.length === 0 && (
          <p className="text-gray-500 italic">No schedule entries yet.</p>
        )}

        {formData.schedule.map((sched, index) => (
          <div
            key={index}
            className="bg-gray-50 p-4 rounded-md grid grid-cols-1 md:grid-cols-5 gap-4 items-center"
          >
            <input
              type="text"
              placeholder="Doctor Name"
              value={sched.doctorName}
              onChange={(e) => handleScheduleChange(index, 'doctorName', e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Schedule Specialization"
              value={sched.specialization}
              onChange={(e) => handleScheduleChange(index, 'specialization', e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Available Days (comma separated)"
              value={sched.availableDays.join(', ')}
              onChange={(e) =>
                handleScheduleChange(
                  index,
                  'availableDays',
                  e.target.value.split(',').map((day) => day.trim())
                )
              }
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="time"
              value={sched.startTime}
              onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="time"
              value={sched.endTime}
              onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition"
        >
          {editMode ? 'Update' : 'Create'}
        </button>
      </form>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-center">All Doctors</h3>
        <input
          type="text"
          placeholder="Filter by specialization..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-md p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <ul className="space-y-3">
          {filteredDoctors.length === 0 ? (
            <p className="text-center text-gray-500">No doctors found.</p>
          ) : (
            filteredDoctors.map((doc) => (
              <li
                key={doc._id}
                className="bg-white p-4 rounded-md shadow flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0"
              >
                <div>
                  <p className="font-semibold text-lg">{doc.specialization}</p>
                  <p className="text-gray-600">{doc.userId?.name || 'No user name'}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(doc)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default DoctorForm;


