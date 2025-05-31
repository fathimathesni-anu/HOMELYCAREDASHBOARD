import { PaperClipIcon, CalendarIcon, BellIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function UserHomepage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Next Appointment Widget */}
      <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 flex flex-col justify-between">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">Next Appointment</h2>
        <div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Your next appointment is with <strong>Dr. John Doe</strong> for a routine check-up.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Date: April 28, 2025 | Time: 10:30 AM
          </p>
        </div>
        <Link
          to="/user/dashboard/appointments"
          className="mt-6 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
        >
          <CalendarIcon className="h-5 w-5 mr-2" />
          <span>View Appointment</span>
        </Link>
      </div>

      {/* Notifications Widget */}
      <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">Notifications</h2>
        <ul className="space-y-4 max-h-64 overflow-y-auto">
          <li className="flex items-start">
            <BellIcon className="h-6 w-6 text-blue-500 flex-shrink-0 mr-3 mt-1" />
            <p className="text-gray-600 dark:text-gray-300 leading-snug">
              Your appointment with Dr. Smith is confirmed for tomorrow at 10 AM.
            </p>
          </li>
          <li className="flex items-start">
            <BellIcon className="h-6 w-6 text-blue-500 flex-shrink-0 mr-3 mt-1" />
            <p className="text-gray-600 dark:text-gray-300 leading-snug">
              New feedback received from your recent appointment.
            </p>
          </li>
        </ul>
      </div>

      {/* Quick Actions Widget */}
      <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">Quick Actions</h2>
        <div className="space-y-4">
          <Link
            to="/user/dashboard/appointments"
            className="flex items-center text-green-600 dark:text-green-400 hover:underline focus:outline-none focus:ring-2 focus:ring-green-400 rounded"
          >
            <PencilSquareIcon className="h-5 w-5 mr-2" />
            <span>Book Appointment</span>
          </Link>
          <Link
            to="/user/dashboard/chat"
            className="flex items-center text-purple-600 dark:text-purple-400 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-400 rounded"
          >
            <PaperClipIcon className="h-5 w-5 mr-2" />
            <span>View Chats</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

