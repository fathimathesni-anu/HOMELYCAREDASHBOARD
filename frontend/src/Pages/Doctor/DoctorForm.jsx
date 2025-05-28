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
      schedule: [...formData.schedule, { doctorName: '', specialization: '', availableDays: [], startTime: '', endTime: '' }],
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

  const filteredDoctors = doctors.filter(doc =>
    doc.specialization?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{editMode ? 'Edit Doctor' : 'Add Doctor'}</h2>

      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={formData.userId}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />

        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />

        <button
          type="button"
          onClick={addScheduleField}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Add Schedule
        </button>

        {formData.schedule.map((sched, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
            <input
              type="text"
              placeholder="Doctor Name"
              value={sched.doctorName}
              onChange={(e) => handleScheduleChange(index, 'doctorName', e.target.value)}
              className="border rounded p-2"
            />
            <input
              type="text"
              placeholder="Schedule Specialization"
              value={sched.specialization}
              onChange={(e) => handleScheduleChange(index, 'specialization', e.target.value)}
              className="border rounded p-2"
            />
            <input
              type="text"
              placeholder="Available Days (comma separated)"
              value={sched.availableDays.join(', ')}
              onChange={(e) =>
                handleScheduleChange(index, 'availableDays', e.target.value.split(',').map(day => day.trim()))
              }
              className="border rounded p-2"
            />
            <div className="flex gap-2">
              <input
                type="time"
                value={sched.startTime}
                onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                className="border rounded p-2 w-full"
              />
              <input
                type="time"
                value={sched.endTime}
                onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                className="border rounded p-2 w-full"
              />
            </div>
          </div>
        ))}

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          {editMode ? 'Update' : 'Create'}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">All Doctors</h3>
        <input
          type="text"
          placeholder="Filter by specialization..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded p-2 w-full mb-4"
        />
        <ul className="space-y-2">
          {filteredDoctors.map((doc) => (
            <li key={doc._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <p className="font-medium">{doc.specialization}</p>
                <p className="text-sm text-gray-600">{doc.userId?.name || 'No user name'}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(doc)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
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


