import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const CreateStaff = () => {
  const emptyForm = {
    userId: '',
    position: '',
    department: '',
    contactInfo: {
      phone: '',
      email: '',
    },
    schedule: [{ day: '', startTime: '', endTime: '' }],
    assignedTasks: [],
  };

  const [formData, setFormData] = useState(emptyForm);
  const [staffList, setStaffList] = useState([]);
  const [message, setMessage] = useState('');
  const [searchDept, setSearchDept] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null); // Track which staff is being edited

  const itemsPerPage = 5;

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      const res = await axiosInstance.get('/staff');
      setStaffList(res.data);
    } catch (err) {
      console.error('Failed to fetch staff:', err);
    }
  };

  const handleChange = (e, field, index = null) => {
    const { name, value } = e.target;

    if (field === 'contactInfo') {
      setFormData({
        ...formData,
        contactInfo: {
          ...formData.contactInfo,
          [name]: value,
        },
      });
    } else if (field === 'schedule') {
      const updatedSchedule = [...formData.schedule];
      updatedSchedule[index][name] = value;
      setFormData({
        ...formData,
        schedule: updatedSchedule,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddSchedule = () => {
    setFormData({
      ...formData,
      schedule: [...formData.schedule, { day: '', startTime: '', endTime: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.put(`/staff/update/${editingId}`, formData);
        setMessage('Staff updated successfully!');
      } else {
        await axiosInstance.post('/staff/create', formData);
        setMessage('Staff created successfully!');
      }

      fetchStaffList();
      resetForm();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Submission failed');
    }
  };

  const handleEdit = (staff) => {
    setFormData({
      userId: staff.userId?._id || staff.userId || '',
      position: staff.position || '',
      department: staff.department || '',
      contactInfo: staff.contactInfo || { phone: '', email: '' },
      schedule: staff.schedule.length ? staff.schedule : [{ day: '', startTime: '', endTime: '' }],
      assignedTasks: staff.assignedTasks || [],
    });
    setEditingId(staff._id);
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this staff member?')) return;
    try {
      await axiosInstance.delete(`/staff/delete/${id}`);
      setStaffList((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete staff');
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const filteredStaff = staffList.filter((staff) =>
    staff.department?.toLowerCase().includes(searchDept.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const currentStaff = filteredStaff.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-xl mt-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700">
        {editingId ? 'Update Staff Member' : 'Create Staff Member'}
      </h2>

      {message && <div className="mb-4 text-green-600">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="userId"
            placeholder="User ID"
            value={formData.userId}
            onChange={handleChange}
            className="border p-3 rounded w-full"
            required
          />
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={formData.position}
            onChange={handleChange}
            className="border p-3 rounded w-full"
            required
          />
        </div>

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.contactInfo.phone}
            onChange={(e) => handleChange(e, 'contactInfo')}
            className="border p-3 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.contactInfo.email}
            onChange={(e) => handleChange(e, 'contactInfo')}
            className="border p-3 rounded"
          />
        </div>

        <div>
          <h3 className="font-semibold mb-2">Schedule</h3>
          {formData.schedule.map((slot, index) => (
            <div key={index} className="grid sm:grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                name="day"
                placeholder="Day"
                value={slot.day}
                onChange={(e) => handleChange(e, 'schedule', index)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="startTime"
                placeholder="Start Time"
                value={slot.startTime}
                onChange={(e) => handleChange(e, 'schedule', index)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="endTime"
                placeholder="End Time"
                value={slot.endTime}
                onChange={(e) => handleChange(e, 'schedule', index)}
                className="border p-2 rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSchedule}
            className="text-blue-600 font-medium hover:underline mt-2"
          >
            + Add Schedule Slot
          </button>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded hover:bg-blue-700 transition"
          >
            {editingId ? 'Update Staff' : 'Create Staff'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Staff List */}
      <div className="mt-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Staff List</h3>
          <input
            type="text"
            placeholder="Filter by department"
            className="border p-2 rounded w-full sm:w-64"
            value={searchDept}
            onChange={(e) => {
              setSearchDept(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {currentStaff.length === 0 ? (
          <p className="text-gray-500">No staff found.</p>
        ) : (
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-sm table-auto">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Position</th>
                  <th className="px-4 py-2">Department</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStaff.map((staff) => (
                  <tr key={staff._id} className="border-t">
                    <td className="px-4 py-2">{staff.userId?.name || 'N/A'}</td>
                    <td className="px-4 py-2">{staff.position}</td>
                    <td className="px-4 py-2">{staff.department}</td>
                    <td className="px-4 py-2">{staff.contactInfo?.phone}</td>
                    <td className="px-4 py-2">{staff.contactInfo?.email}</td>
                    <td className="px-4 py-2">
                      <div className="space-x-2">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => handleEdit(staff)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDelete(staff._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-1 rounded-full border transition ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateStaff;




