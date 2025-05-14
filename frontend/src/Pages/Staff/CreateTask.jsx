import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance'; // ✅ Use your axios instance

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    notes: [],
  });

  const [staffList, setStaffList] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axiosInstance.get('/staff', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const staffData = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.staff)
          ? res.data.staff
          : [];

        setStaffList(staffData);
      } catch (err) {
        console.error('Failed to load staff', err);
        setStaffList([]);
      }
    };

    fetchStaff();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNoteChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      notes: [{ body: e.target.value, date: new Date() }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post('/task/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Task created successfully!');
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
        notes: [],
      });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Create Task</h2>
      {message && <div className="mb-4 text-red-500">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Assign to Staff</option>
          {staffList.map((staff) => (
            <option key={staff._id} value={staff._id}>
              {staff.userId?.name || staff.position || 'Unnamed'}
            </option>
          ))}
        </select>

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="note"
          placeholder="Optional Note"
          onChange={handleNoteChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default CreateTask;



