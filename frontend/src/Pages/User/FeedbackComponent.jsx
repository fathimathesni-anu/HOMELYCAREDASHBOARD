import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance'; // Adjust path if needed

const FeedbackComponent = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({ feedbackText: '', rating: 5 });
  const [editingFeedbackId, setEditingFeedbackId] = useState(null);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('/feedback', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFeedbacks(res.data);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingFeedbackId) {
        // Update existing feedback
        const res = await axios.put(`/feedback/update/${editingFeedbackId}`, newFeedback, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setFeedbacks(prev =>
          prev.map(fb => (fb._id === editingFeedbackId ? res.data.feedback : fb))
        );
        setEditingFeedbackId(null);
      } else {
        // Create new feedback
        const res = await axios.post('/feedback/create', newFeedback, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setFeedbacks(prev => [...prev, res.data.feedback]);
      }
      setNewFeedback({ feedbackText: '', rating: 5 });
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };

  const handleEdit = fb => {
    setEditingFeedbackId(fb._id);
    setNewFeedback({ feedbackText: fb.feedbackText, rating: fb.rating });
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`/feedback/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFeedbacks(prev => prev.filter(fb => fb._id !== id));
    } catch (err) {
      console.error('Error deleting feedback:', err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{editingFeedbackId ? 'Edit' : 'Submit'} Feedback</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Write your feedback..."
          value={newFeedback.feedbackText}
          onChange={e => setNewFeedback({ ...newFeedback, feedbackText: e.target.value })}
          required
        />
        <select
          className="w-full p-2 border rounded"
          value={newFeedback.rating}
          onChange={e => setNewFeedback({ ...newFeedback, rating: parseInt(e.target.value) })}
        >
          {[1, 2, 3, 4, 5].map(n => (
            <option key={n} value={n}>
              {n} Star{n > 1 ? 's' : ''}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingFeedbackId ? 'Update Feedback' : 'Submit Feedback'}
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">All Feedback</h3>
      <div className="space-y-4">
        {feedbacks.map(fb => (
          <div key={fb._id} className="border p-4 rounded bg-gray-50">
            <p className="mb-2">{fb.feedbackText}</p>
            <p className="text-sm text-gray-600">Rating: {fb.rating} ⭐</p>
            <p className="text-sm text-gray-400">
              By: {fb.patientId?.name || 'Unknown'} on {new Date(fb.createdAt).toLocaleDateString()}
            </p>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => handleEdit(fb)}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(fb._id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackComponent;



