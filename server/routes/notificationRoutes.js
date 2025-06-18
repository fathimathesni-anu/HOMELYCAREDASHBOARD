import express from 'express';
import {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  markNotificationAsRead,
} from '../controllers/notificationController.js';

const router = express.Router();

router.post('/create', createNotification);
router.get('/', getAllNotifications);
router.get('/:id', getNotificationById);
router.put('/update/:id', updateNotification);
router.put('/markread/:id', markNotificationAsRead);
router.delete('/delete/:id', deleteNotification);

export const notificationRouter = router;






