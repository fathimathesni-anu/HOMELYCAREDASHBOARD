import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const BloodBankManager = () => {
  const [formData, setFormData] = useState({
    bloodGroup: '',
    availableUnits: '',
  });

  const [bloodBankEntries, setBloodBankEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ bloodGroup: '', availableUnits: '' });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const fetchBloodBankEntries = async () => {
    try {
      const res = await axiosInstance.get('/bloodbank');
      if (Array.isArray(res.data)) {
        setBloodBankEntries(res.data);
      } else {
        setBloodBankEntries([]);
        console.error('Expected array but got:', res.data);
      }
    } catch (err) {
      setError('Failed to fetch entries');
    }
  };

  useEffect(() => {
    fetchBloodBankEntries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await axiosInstance.post('/bloodbank/create', formData);
      setMessage('Entry created successfully!');
      setFormData({ bloodGroup: '', availableUnits: '' });
      fetchBloodBankEntries();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating entry');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/bloodbank/delete/${id}`);
      setMessage('Entry deleted');
      fetchBloodBankEntries();
    } catch (err) {
      setError('Failed to delete entry');
    }
  };

  // Edit handlers
  const handleEditClick = (entry) => {
    setEditingId(entry._id);
    setEditFormData({
      bloodGroup: entry.bloodGroup,
      availableUnits: entry.availableUnits,
    });
    setError('');
    setMessage('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditFormData({ bloodGroup: '', availableUnits: '' });
  };

  const handleEditSave = async (id) => {
    setError('');
    setMessage('');
    try {
      await axiosInstance.put(`/bloodbank/update/${id}`, editFormData);
      setMessage('Entry updated successfully!');
      setEditingId(null);
      setEditFormData({ bloodGroup: '', availableUnits: '' });
      fetchBloodBankEntries();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating entry');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Blood Bank Management</h2>

      {message && <div className="text-green-600 mb-2 text-sm">{message}</div>}
      {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white p-4 rounded shadow-sm">
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <div className="flex-1">
            <label className="block text-sm mb-1 font-medium">Blood Group</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded text-sm"
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 mt-4 sm:mt-0">
            <label className="block text-sm mb-1 font-medium">Available Units</label>
            <input
              type="number"
              name="availableUnits"
              value={formData.availableUnits}
              onChange={handleChange}
              required
              min="0"
              className="w-full border p-2 rounded text-sm"
            />
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Entry
          </button>
        </div>
      </form>

      <h3 className="text-xl font-semibold mb-3">Current Inventory</h3>

      <div className="overflow-x-auto bg-white rounded shadow-sm">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border">Blood Group</th>
              <th className="p-3 border">Units</th>
              <th className="p-3 border">Last Updated</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bloodBankEntries.length > 0 ? (
              bloodBankEntries.map(entry => (
                <tr key={entry._id} className="hover:bg-gray-50">
                  {editingId === entry._id ? (
                    <>
                      <td className="p-3 border">
                        <select
                          name="bloodGroup"
                          value={editFormData.bloodGroup}
                          onChange={handleEditChange}
                          className="w-full border p-1 rounded text-sm"
                        >
                          {bloodGroups.map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3 border">
                        <input
                          type="number"
                          name="availableUnits"
                          value={editFormData.availableUnits}
                          onChange={handleEditChange}
                          min="0"
                          className="w-full border p-1 rounded text-sm"
                        />
                      </td>
                      <td className="p-3 border">{new Date(entry.lastUpdated).toLocaleString()}</td>
                      <td className="p-3 border text-center space-x-2">
                        <button
                          onClick={() => handleEditSave(entry._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 text-xs"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 border">{entry.bloodGroup}</td>
                      <td className="p-3 border">{entry.availableUnits}</td>
                      <td className="p-3 border">{new Date(entry.lastUpdated).toLocaleString()}</td>
                      <td className="p-3 border text-center space-x-2">
                        <button
                          onClick={() => handleEditClick(entry)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">No entries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BloodBankManager;




