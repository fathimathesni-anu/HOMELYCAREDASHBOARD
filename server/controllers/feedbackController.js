import { Feedback } from '../models/feedbackmodel.js'; // Make sure your model file matches

// Create feedback
export const createFeedback = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    res.status(400).json({ message: 'Error submitting feedback', error });
  }
};

// Get all feedback
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('patientId');
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching feedback', error });
  }
};

// Get feedback by ID
export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate('patientId');
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching feedback', error });
  }
};

// Update feedback
export const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.status(200).json({ message: 'Feedback updated successfully', feedback });
  } catch (error) {
    res.status(400).json({ message: 'Error updating feedback', error });
  }
};

// Delete feedback
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting feedback', error });
  }
};


