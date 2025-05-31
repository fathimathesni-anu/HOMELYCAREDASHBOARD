import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance'; // Make sure this includes auth headers if required

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
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axiosInstance.get('/doctor');
      setDoctors(res.data);
    } catch (error) {
      console.error('Failed to fetch doctors', error);
      setError('Failed to load doctors');
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
    setError('');
    try {
      if (!formData.userId || !formData.specialization) {
        setError('User ID and Specialization are required');
        return;
      }

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
      setError('Failed to save doctor. Ensure all fields are valid.');
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
    setError('');
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/doctor/delete/${id}`);
      fetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor', error);
      setError('Failed to delete doctor');
    }
  };

  const filteredDoctors = doctors.filter((doc) =>
    doc.specialization?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        {editMode ? 'Edit Doctor' : 'Add Doctor'}
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-6 max-w-full text-center sm:text-left">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow-md">
        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={formData.userId}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="button"
          onClick={addScheduleField}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Schedule
        </button>

        {formData.schedule.map((sched, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 p-4 rounded"
          >
            <input
              type="text"
              placeholder="Doctor Name"
              value={sched.doctorName}
              onChange={(e) => handleScheduleChange(index, 'doctorName', e.target.value)}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Schedule Specialization"
              value={sched.specialization}
              onChange={(e) => handleScheduleChange(index, 'specialization', e.target.value)}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex gap-2">
              <input
                type="time"
                value={sched.startTime}
                onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="time"
                value={sched.endTime}
                onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded text-lg font-semibold hover:bg-green-700 transition"
        >
          {editMode ? 'Update' : 'Create'}
        </button>
      </form>

      <div className="mt-10">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left">All Doctors</h3>
        <input
          type="text"
          placeholder="Filter by specialization..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <ul className="space-y-4">
          {filteredDoctors.map((doc) => (
            <li
              key={doc._id}
              className="bg-white p-4 rounded shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <p className="font-medium text-lg">{doc.specialization}</p>
                <p className="text-gray-600">{doc.userId?.name || 'No user name'}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(doc)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DoctorForm;



