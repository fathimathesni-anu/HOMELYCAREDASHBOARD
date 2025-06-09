import React, { useEffect, useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import axiosInstance from '../../api/axiosInstance';

const DashboardNotificationWidget = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get('/notification');
        // Show only latest 3 notifications (you can adjust this)
        setNotifications(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // every 30 seconds

  return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 w-full max-w-sm">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">Notifications</h2>
      <ul className="space-y-4 max-h-64 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            No recent notifications.
          </p>
        ) : (
          notifications.map((notification) => (
            <li key={notification._id} className="flex items-start">
              <BellIcon className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {notification.message}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default DashboardNotificationWidget;

