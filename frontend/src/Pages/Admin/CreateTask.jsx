import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

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
  const [taskList, setTaskList] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchStaff = async () => {
      try {
        const res = await axiosInstance.get('/staff', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const staffData = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.staff)
          ? res.data.staff
          : [];
        setStaffList(staffData);
      } catch (err) {
        console.error('Failed to load staff', err);
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await axiosInstance.get('/task', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTaskList(Array.isArray(res.data) ? res.data : res.data.tasks || []);
      } catch (err) {
        console.error('Failed to load tasks', err);
      }
    };

    fetchStaff();
    fetchTasks();
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
        headers: { Authorization: `Bearer ${token}` },
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
      // Refresh task list
      const res = await axiosInstance.get('/task', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTaskList(Array.isArray(res.data) ? res.data : res.data.tasks || []);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl space-y-8">
      <div>
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

      {/* Task List Section */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Existing Tasks</h3>
        {taskList.length === 0 ? (
          <p className="text-gray-500">No tasks found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border px-4 py-2">Title</th>
                  <th className="border px-4 py-2">Assigned To</th>
                  <th className="border px-4 py-2">Priority</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {taskList.map((task) => (
                  <tr key={task._id}>
                    <td className="border px-4 py-2">{task.title}</td>
                    <td className="border px-4 py-2">
                      {task.assignedTo?.userId?.name || task.assignedTo?.position || 'N/A'}
                    </td>
                    <td className="border px-4 py-2">{task.priority}</td>
                    <td className="border px-4 py-2">{task.status}</td>
                    <td className="border px-4 py-2">{task.dueDate?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTask;




