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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFeedbackId) {
        // Update existing feedback
        const res = await axios.put(`/feedback/update/${editingFeedbackId}`, newFeedback, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setFeedbacks((prev) =>
          prev.map((fb) => (fb._id === editingFeedbackId ? res.data.feedback : fb))
        );
        setEditingFeedbackId(null);
      } else {
        // Create new feedback
        const res = await axios.post('/feedback/create', newFeedback, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setFeedbacks((prev) => [...prev, res.data.feedback]);
      }
      setNewFeedback({ feedbackText: '', rating: 5 });
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };

  const handleEdit = (fb) => {
    setEditingFeedbackId(fb._id);
    setNewFeedback({ feedbackText: fb.feedbackText, rating: fb.rating });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/feedback/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFeedbacks((prev) => prev.filter((fb) => fb._id !== id));
    } catch (err) {
      console.error('Error deleting feedback:', err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        {editingFeedbackId ? 'Edit' : 'Submit'} Feedback
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5 mb-8">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          rows={4}
          placeholder="Write your feedback..."
          value={newFeedback.feedbackText}
          onChange={(e) => setNewFeedback({ ...newFeedback, feedbackText: e.target.value })}
          required
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <label htmlFor="rating" className="mb-1 sm:mb-0 font-semibold text-gray-700 dark:text-gray-300">
            Rating:
          </label>
          <select
            id="rating"
            className="w-full sm:w-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
            value={newFeedback.rating}
            onChange={(e) =>
              setNewFeedback({ ...newFeedback, rating: parseInt(e.target.value, 10) })
            }
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} Star{n > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition"
        >
          {editingFeedbackId ? 'Update Feedback' : 'Submit Feedback'}
        </button>
      </form>

      <h3 className="text-xl sm:text-2xl font-semibold mb-5 text-center sm:text-left">All Feedback</h3>

      <div className="space-y-6 max-h-[60vh] overflow-y-auto">
        {feedbacks.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">No feedback available.</p>
        )}
        {feedbacks.map((fb) => (
          <div
            key={fb._id}
            className="border border-gray-300 dark:border-gray-700 p-5 rounded-md bg-gray-50 dark:bg-gray-900"
          >
            <p className="mb-3 text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{fb.feedbackText}</p>
            <p className="text-sm text-yellow-500 font-semibold mb-1">
              Rating: {fb.rating} ⭐
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              By: {fb.patientId?.name || 'Unknown'} on{' '}
              {new Date(fb.createdAt).toLocaleDateString()}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleEdit(fb)}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(fb._id)}
                className="text-red-600 hover:underline text-sm font-medium"
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




