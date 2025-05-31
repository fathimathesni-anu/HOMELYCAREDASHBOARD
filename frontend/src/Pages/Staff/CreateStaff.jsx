import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance'; // Adjust path as needed

const CreateStaff = () => {
  const [formData, setFormData] = useState({
    userId: '',
    position: '',
    department: '',
    contactInfo: {
      phone: '',
      email: '',
    },
    schedule: [{ day: '', startTime: '', endTime: '' }],
    assignedTasks: [],
  });

  const [message, setMessage] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [searchDept, setSearchDept] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchStaffList = async () => {
      try {
        const response = await axiosInstance.get('/staff');
        setStaffList(response.data);
      } catch (error) {
        console.error('Failed to fetch staff list:', error);
      }
    };
    fetchStaffList();
  }, []);

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
      await axiosInstance.post('/staff/create', formData);
      setMessage('Staff member created successfully!');
      const response = await axiosInstance.get('/staff');
      setStaffList(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create staff');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    try {
      await axiosInstance.delete(`/staff/delete/${id}`);
      setStaffList((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete staff');
    }
  };

  const filteredStaff = staffList.filter((staff) =>
    staff.department?.toLowerCase().includes(searchDept.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Staff Member</h2>
      {message && <div className="mb-4 text-red-500 text-center">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={formData.userId}
          onChange={handleChange}
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={formData.position}
          onChange={handleChange}
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.contactInfo.phone}
            onChange={(e) => handleChange(e, 'contactInfo')}
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.contactInfo.email}
            onChange={(e) => handleChange(e, 'contactInfo')}
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <h3 className="font-semibold mb-3">Schedule</h3>
          {formData.schedule.map((slot, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3"
            >
              <input
                type="text"
                name="day"
                placeholder="Day"
                value={slot.day}
                onChange={(e) => handleChange(e, 'schedule', index)}
                className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="startTime"
                placeholder="Start Time"
                value={slot.startTime}
                onChange={(e) => handleChange(e, 'schedule', index)}
                className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="endTime"
                placeholder="End Time"
                value={slot.endTime}
                onChange={(e) => handleChange(e, 'schedule', index)}
                className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSchedule}
            className="text-blue-600 hover:underline"
          >
            + Add Schedule Slot
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Create Staff
        </button>
      </form>

      {/* Staff List Section */}
      <div className="mt-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
          <h3 className="text-xl font-semibold">Staff List</h3>
          <input
            type="text"
            placeholder="Filter by department"
            className="border p-3 rounded w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchDept}
            onChange={(e) => {
              setSearchDept(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {currentStaff.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No staff found.</p>
        ) : (
          <div className="overflow-auto max-h-[400px] border rounded">
            <table className="min-w-full text-sm table-auto">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Position</th>
                  <th className="px-4 py-3 text-left">Department</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStaff.map((staff) => (
                  <tr key={staff._id} className="border-t even:bg-gray-50">
                    <td className="px-4 py-2">{staff.userId?.name || 'N/A'}</td>
                    <td className="px-4 py-2">{staff.position}</td>
                    <td className="px-4 py-2">{staff.department}</td>
                    <td className="px-4 py-2">{staff.contactInfo?.phone}</td>
                    <td className="px-4 py-2">{staff.contactInfo?.email}</td>
                    <td className="px-4 py-2 space-x-3 whitespace-nowrap">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => alert('Edit feature coming soon')}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(staff._id)}
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

        <div className="flex justify-center mt-6 space-x-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded transition ${
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




