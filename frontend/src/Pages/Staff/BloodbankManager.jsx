import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance'; // ✅ use custom instance

const BloodBankManager = () => {
  const [formData, setFormData] = useState({
    bloodGroup: '',
    availableUnits: '',
  });

  const [bloodBankEntries, setBloodBankEntries] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const fetchBloodBankEntries = async () => {
    try {
      const res = await axiosInstance.get('/bloodbank');
      console.log('API response:', res.data);
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

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Blood Bank Management</h2>

      {message && <div className="text-green-600 mb-2">{message}</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block">Blood Group</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block">Available Units</label>
          <input
            type="number"
            name="availableUnits"
            value={formData.availableUnits}
            onChange={handleChange}
            required
            min="0"
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Entry
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Current Inventory</h3>
      <table className="w-full border table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Blood Group</th>
            <th className="p-2 border">Units</th>
            <th className="p-2 border">Last Updated</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(bloodBankEntries) && bloodBankEntries.length > 0 ? (
            bloodBankEntries.map(entry => (
              <tr key={entry._id} className="text-center">
                <td className="border p-2">{entry.bloodGroup}</td>
                <td className="border p-2">{entry.availableUnits}</td>
                <td className="border p-2">{new Date(entry.lastUpdated).toLocaleString()}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDelete(entry._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-4 text-gray-500">No entries found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BloodBankManager;



