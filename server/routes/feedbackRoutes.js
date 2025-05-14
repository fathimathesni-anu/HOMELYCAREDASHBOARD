import express from 'express';
const router = express.Router();

import {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback
} from '../controllers/feedbackController.js';

import { userAuth } from '../middleware/userAuth.js';

// Routes
router.post('/create', userAuth, createFeedback);
router.get('/', userAuth, getAllFeedback);
router.get('/:id', userAuth, getFeedbackById);
router.put('/update/:id', userAuth, updateFeedback);
router.delete('/delete/:id', userAuth, deleteFeedback);

export { router as feedbackRouter };

