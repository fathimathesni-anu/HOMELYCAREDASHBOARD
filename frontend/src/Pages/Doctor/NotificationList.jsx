import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const Notification = ({ notification, onMarkRead, onEdit, onDelete }) => {
  return (
    <div
      className={`notification p-4 border rounded-md shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 ${
        notification.isRead ? 'bg-gray-100' : 'bg-blue-100'
      }`}
    >
      <div className="notification-content flex-1">
        <h4 className="text-lg font-semibold text-gray-900">{notification.message}</h4>
        <small className="text-xs text-gray-600">
          {new Date(notification.createdAt).toLocaleString()}
        </small>
      </div>
      <div className="flex flex-wrap sm:flex-nowrap space-x-2">
        {!notification.isRead && (
          <button
            onClick={() => onMarkRead(notification._id)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
          >
            Mark as Read
          </button>
        )}
        <button
          onClick={() => onEdit(notification)}
          className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(notification._id)}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition"
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

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingNotification) {
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
        const response = await axiosInstance.post('/notification/create', { message });
        setNotifications((prev) => [response.data, ...prev]);
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

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      <form
        onSubmit={handleAddOrUpdate}
        className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter notification message"
          className="flex-grow border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="px-5 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
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
            className="px-5 py-3 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        )}
      </form>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications available.</p>
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








