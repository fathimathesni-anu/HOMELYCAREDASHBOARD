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
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        {editingFeedbackId ? 'Edit' : 'Submit'} Feedback
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <textarea
          className="w-full p-3 border rounded-md resize-none focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
          rows={4}
          placeholder="Write your feedback..."
          value={newFeedback.feedbackText}
          onChange={e => setNewFeedback({ ...newFeedback, feedbackText: e.target.value })}
          required
        />
        <select
          className="w-full p-3 border rounded-md focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
          value={newFeedback.rating}
          onChange={e => setNewFeedback({ ...newFeedback, rating: parseInt(e.target.value) })}
        >
          {[1, 2, 3, 4, 5].map(n => (
            <option key={n} value={n}>
              {n} Star{n > 1 ? 's' : ''}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition"
        >
          {editingFeedbackId ? 'Update Feedback' : 'Submit Feedback'}
        </button>
      </form>

      <h3 className="text-xl md:text-2xl font-semibold mt-10 mb-6">All Feedback</h3>
      <div className="space-y-5">
        {feedbacks.length === 0 && (
          <p className="text-center text-gray-500">No feedback available.</p>
        )}
        {feedbacks.map(fb => (
          <div
            key={fb._id}
            className="border rounded-md p-5 bg-gray-50 shadow-sm hover:shadow-md transition"
          >
            <p className="mb-3 text-gray-800">{fb.feedbackText}</p>
            <p className="text-sm text-yellow-600 font-semibold mb-1">Rating: {fb.rating} ⭐</p>
            <p className="text-xs text-gray-500">
              By: {fb.patientId?.name || 'Unknown'} on{' '}
              {new Date(fb.createdAt).toLocaleDateString()}
            </p>
            <div className="flex space-x-4 mt-3">
              <button
                onClick={() => handleEdit(fb)}
                className="text-blue-600 hover:underline text-sm md:text-base"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(fb._id)}
                className="text-red-600 hover:underline text-sm md:text-base"
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




