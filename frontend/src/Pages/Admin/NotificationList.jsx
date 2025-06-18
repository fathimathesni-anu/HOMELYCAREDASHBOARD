import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Notification from '../../Components/Notification';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');
  const [editingNotification, setEditingNotification] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get('/notification');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      const response = await axiosInstance.put(`/notification/markread/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? response.data.notification : n))
      );
    } catch (error) {
      console.error('Error marking notification as read', error);
    }
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!message.trim()) return; // Avoid empty messages

      if (editingNotification) {
        const response = await axiosInstance.put(
          `/notification/update/${editingNotification._id}`,
          { message }
        );
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === editingNotification._id ? response.data.notification : n
          )
        );
        setEditingNotification(null);
      } else {
        const response = await axiosInstance.post('/notification/create', {
          message,
        });
        setNotifications((prev) => [response.data.notification, ...prev]);
      }
      setMessage('');
    } catch (error) {
      console.error('Error saving notification', error);
    }
  };

  const handleEdit = (notification) => {
    setEditingNotification(notification);
    setMessage(notification.message);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/notification/delete/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error('Error deleting notification', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingNotification(null);
    setMessage('');
  };

  return (
    <div className="notification-list p-6 max-w-3xl mx-auto space-y-6">
      <form
        onSubmit={handleAddOrUpdate}
        className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter notification message"
          className="border p-3 rounded-md flex-grow focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
          required
        />
        <div className="flex space-x-2">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            {editingNotification ? 'Update' : 'Add'} Notification
          </button>
          {editingNotification && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-3 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Notification
              key={notification._id}
              notification={notification}
              onMarkRead={handleMarkRead}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;












