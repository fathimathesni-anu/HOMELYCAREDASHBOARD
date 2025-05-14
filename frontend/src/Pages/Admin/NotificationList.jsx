import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const Notification = ({ notification, onMarkRead, onEdit, onDelete }) => {
  return (
    <div
      className={`notification p-4 border rounded-md shadow-sm flex justify-between items-center ${
        notification.isRead ? 'bg-gray-200' : 'bg-blue-100'
      }`}
    >
      <div className="notification-content">
        <h4 className="text-lg font-semibold">{notification.message}</h4>
        <small className="text-sm text-gray-500">
          {new Date(notification.createdAt).toLocaleString()}
        </small>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onMarkRead(notification._id)}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
        >
          Mark as Read
        </button>
        <button
          onClick={() => onEdit(notification)}
          className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(notification._id)}  // Delete button
          className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

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

  // Mark as Read handler
  const handleMarkRead = async (id) => {
    try {
      await axiosInstance.put(`/notification/update/${id}`, { isRead: true });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read', error);
    }
  };

  // Add or Update Notification handler
  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingNotification) {
        // Update existing notification
        const response = await axiosInstance.put(
          `/notification/update/${editingNotification._id}`,
          { message }
        );
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === editingNotification._id ? response.data : n
          )
        );
        setEditingNotification(null);
      } else {
        // Add new notification
        const response = await axiosInstance.post('/notification/create', {
          message,
        });
        setNotifications((prev) => [response.data, ...prev]);
      }

      setMessage('');
    } catch (error) {
      console.error('Error saving notification', error);
    }
  };

  // Edit Notification handler
  const handleEdit = (notification) => {
    setEditingNotification(notification);
    setMessage(notification.message);
  };

  // Delete Notification handler
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/notification/delete/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));  // Remove the deleted notification from the list
    } catch (error) {
      console.error('Error deleting notification', error);
    }
  };

  return (
    <div className="notification-list p-6 space-y-6">
      <form onSubmit={handleAddOrUpdate} className="space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter notification message"
          className="border p-2 rounded-md w-2/3"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          {editingNotification ? 'Update' : 'Add'} Notification
        </button>
        {editingNotification && (
          <button
            type="button"
            onClick={() => {
              setEditingNotification(null);
              setMessage('');
            }}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 ml-2"
          >
            Cancel
          </button>
        )}
      </form>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications</p>
      ) : (
        notifications.map((notification) => (
          <Notification
            key={notification._id}
            notification={notification}
            onMarkRead={handleMarkRead}
            onEdit={handleEdit}
            onDelete={handleDelete}  // Pass delete function to each Notification
          />
        ))
      )}
    </div>
  );
};

export default NotificationList;







