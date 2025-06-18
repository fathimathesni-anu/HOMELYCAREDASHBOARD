import React from 'react';

const Notification = ({ notification, onMarkRead, onEdit, onDelete }) => {
  return (
    <div
      className={`notification p-4 border rounded-md shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 ${
        notification.isRead ? 'bg-gray-200' : 'bg-blue-100'
      }`}
    >
      <div className="notification-content flex-1">
        <h4 className="text-lg font-semibold">{notification.message}</h4>
        <small className="text-sm text-gray-500">
          {new Date(notification.createdAt).toLocaleString()}
        </small>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-0">
        {!notification.isRead && (
          <button
            onClick={() => onMarkRead(notification._id)}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition"
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
          className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Notification;



