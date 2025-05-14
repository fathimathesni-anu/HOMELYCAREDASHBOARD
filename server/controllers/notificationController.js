import { Notification } from '../models/notificationmodel.js';

// Create a notification
export const createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json({ message: 'Notification created successfully', notification });
  } catch (error) {
    res.status(400).json({ message: 'Error creating notification', error });
  }
};

// Get all notifications
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate('userId');
    res.status(200).json(notifications);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching notifications', error });
  }
};

// Get notification by ID
export const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id).populate('userId');
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json(notification);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching notification', error });
  }
};

// Update notification
export const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json({ message: 'Notification updated successfully', notification });
  } catch (error) {
    res.status(400).json({ message: 'Error updating notification', error });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting notification', error });
  }
};

