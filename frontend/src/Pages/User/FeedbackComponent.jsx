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
        const res = await axios.put(`/feedback/update/${editingFeedbackId}`, newFeedback, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setFeedbacks(prev =>
          prev.map(fb => (fb._id === editingFeedbackId ? res.data.feedback : fb))
        );
        setEditingFeedbackId(null);
      } else {
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
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-700">
        {editingFeedbackId ? 'Edit' : 'Submit'} Feedback
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          placeholder="Write your feedback..."
          value={newFeedback.feedbackText}
          onChange={e => setNewFeedback({ ...newFeedback, feedbackText: e.target.value })}
          rows={4}
          required
          aria-label="Feedback Text"
        />
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={newFeedback.rating}
          onChange={e => setNewFeedback({ ...newFeedback, rating: parseInt(e.target.value, 10) })}
          aria-label="Rating"
        >
          {[1, 2, 3, 4, 5].map(n => (
            <option key={n} value={n}>
              {n} Star{n > 1 ? 's' : ''}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
          aria-label={editingFeedbackId ? 'Update Feedback' : 'Submit Feedback'}
        >
          {editingFeedbackId ? 'Update Feedback' : 'Submit Feedback'}
        </button>
      </form>

      <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center">All Feedback</h3>
      <div className="space-y-6">
        {feedbacks.map(fb => (
          <div
            key={fb._id}
            className="border border-gray-300 p-4 rounded-lg bg-gray-50 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center"
          >
            <div className="mb-3 sm:mb-0 sm:flex-1">
              <p className="mb-2 text-gray-800 whitespace-pre-wrap">{fb.feedbackText}</p>
              <p className="text-sm text-gray-600 font-medium">Rating: {fb.rating} ⭐</p>
              <p className="text-xs text-gray-400 mt-1">
                By: {fb.userId?.name || 'Unknown'} on {new Date(fb.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-4 sm:flex-col sm:space-x-0 sm:space-y-2">
              <button
                onClick={() => handleEdit(fb)}
                className="text-blue-600 hover:underline text-sm font-semibold"
                aria-label="Edit Feedback"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(fb._id)}
                className="text-red-600 hover:underline text-sm font-semibold"
                aria-label="Delete Feedback"
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








