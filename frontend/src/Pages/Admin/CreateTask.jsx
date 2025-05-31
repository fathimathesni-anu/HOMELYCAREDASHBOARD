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

  const [editTaskId, setEditTaskId] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
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

    fetchStaff();
    fetchTasks();
  }, []);

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
      if (editTaskId) {
        await axiosInstance.put(`/task/update/${editTaskId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Task updated successfully!');
      } else {
        await axiosInstance.post('/task/create', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Task created successfully!');
      }

      resetForm();
      fetchTasks();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo?._id || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate?.slice(0, 10) || '',
      notes: task.notes || [],
    });
    setEditTaskId(task._id);
    setMessage('');
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axiosInstance.delete(`/task/delete/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Task deleted.');
      fetchTasks();
    } catch (err) {
      setMessage('Failed to delete task.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
      notes: [],
    });
    setEditTaskId(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-blue-700">
          {editTaskId ? 'Update Task' : 'Create Task'}
        </h2>
        {message && <p className="text-green-600 font-medium">{message}</p>}

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="col-span-2 border p-3 rounded w-full"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="col-span-2 border p-3 rounded w-full h-24 resize-none"
          />

          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="border p-3 rounded"
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
            className="border p-3 rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-3 rounded"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="border p-3 rounded"
          />

          <textarea
            name="note"
            placeholder="Optional Note"
            onChange={handleNoteChange}
            className="col-span-2 border p-3 rounded resize-none"
          />

          <div className="col-span-2 flex flex-col sm:flex-row gap-4 mt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {editTaskId ? 'Update Task' : 'Create Task'}
            </button>
            {editTaskId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-6 py-3 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Task List */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Existing Tasks</h3>
        {taskList.length === 0 ? (
          <p className="text-gray-500">No tasks found.</p>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Assigned To</th>
                  <th className="px-4 py-2 text-left">Priority</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {taskList.map((task) => (
                  <tr key={task._id} className="border-t">
                    <td className="px-4 py-2">{task.title}</td>
                    <td className="px-4 py-2">
                      {task.assignedTo?.userId?.name ||
                        task.assignedTo?.position ||
                        'N/A'}
                    </td>
                    <td className="px-4 py-2">{task.priority}</td>
                    <td className="px-4 py-2">{task.status}</td>
                    <td className="px-4 py-2">{task.dueDate?.slice(0, 10)}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
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





