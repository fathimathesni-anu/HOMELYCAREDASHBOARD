import express from 'express';
const router = express.Router();

import {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification
} from '../controllers/notificationController.js';

import { userAuth } from '../middleware/userAuth.js';

// Routes
router.post('/create', userAuth, createNotification);
router.get('/', userAuth, getAllNotifications);
router.get('/:id', userAuth, getNotificationById);
router.put('/update/:id', userAuth, updateNotification);
router.delete('/delete/:id', userAuth, deleteNotification);

export { router as notificationRouter };



