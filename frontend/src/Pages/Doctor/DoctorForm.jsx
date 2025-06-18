import React, { useState, useEffect } from 'react'; 
import axiosInstance from '../../api/axiosInstance';

const DoctorForm = () => {
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
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
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/userole/users'); // Should only return doctors
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
      setError('Failed to load users');
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
        {
          doctorName: '',
          specialization: '',
          availableDays: [],
          startTime: '',
          endTime: '',
        },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (!formData.userId || !formData.specialization) {
        setError('User and Specialization are required');
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
      schedule: doctor.schedule || [],
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
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">{editMode ? 'Edit Doctor' : 'Add Doctor'}</h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-6">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
        <select
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        >
          <option value="">Select a Doctor User</option>
          {users
            .filter((user) => user.role === 'doctor') // Optional frontend safeguard
            .map((user) => (
              <option key={user._id} value={user._id}>
                {user.name || user.email || user.username}
              </option>
            ))}
        </select>

        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />

        <button
          type="button"
          onClick={addScheduleField}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Schedule
        </button>

        {formData.schedule.map((sched, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border"
          >
            <input
              type="text"
              placeholder="Doctor Name"
              value={sched.doctorName}
              onChange={(e) => handleScheduleChange(index, 'doctorName', e.target.value)}
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              placeholder="Schedule Specialization"
              value={sched.specialization}
              onChange={(e) => handleScheduleChange(index, 'specialization', e.target.value)}
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              placeholder="Available Days (comma separated)"
              value={sched.availableDays.join(', ')}
              onChange={(e) =>
                handleScheduleChange(index, 'availableDays', e.target.value.split(',').map(day => day.trim()))
              }
              className="border rounded-lg p-2 col-span-1 md:col-span-2 lg:col-span-3"
            />
            <input
              type="time"
              value={sched.startTime}
              onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
              className="border rounded-lg p-2"
            />
            <input
              type="time"
              value={sched.endTime}
              onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
              className="border rounded-lg p-2"
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          {editMode ? 'Update Doctor' : 'Create Doctor'}
        </button>
      </form>

      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4">All Doctors</h3>
        <input
          type="text"
          placeholder="Filter by specialization..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg p-3 w-full mb-6"
        />

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {filteredDoctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-white p-5 rounded-xl shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
            >
              <div>
                <p className="text-lg font-semibold">{doc.specialization}</p>
                <p className="text-sm text-gray-600">{doc.userId?.name || 'No user name'}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(doc)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorForm;



