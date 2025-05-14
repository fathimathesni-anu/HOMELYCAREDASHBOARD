import { PaperClipIcon, CalendarIcon, BellIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

export default function UserHomepage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Next Appointment Widget */}
      <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Next Appointment</h2>
        <div className="mt-4">
          <p className="text-gray-600 dark:text-gray-300">
            Your next appointment is with Dr. John Doe for a routine check-up.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Date: April 28, 2025 | Time: 10:30 AM
          </p>
        </div>
        <div className="mt-4 flex items-center">
          <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-blue-500 cursor-pointer">View Appointment</span>
        </div>
      </div>

      {/* Notifications Widget */}
      <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Notifications</h2>
        <ul className="mt-4 space-y-3">
          <li className="flex items-center">
            <BellIcon className="h-5 w-5 text-blue-500 mr-2" />
            <p className="text-gray-600 dark:text-gray-300">Your appointment with Dr. Smith is confirmed for tomorrow at 10 AM.</p>
          </li>
          <li className="flex items-center">
            <BellIcon className="h-5 w-5 text-blue-500 mr-2" />
            <p className="text-gray-600 dark:text-gray-300">New feedback received from your recent appointment.</p>
          </li>
        </ul>
      </div>

      {/* Quick Actions Widget */}
      <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Quick Actions</h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-center">
            <PencilSquareIcon className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-blue-500 cursor-pointer">Book Appointment</span>
          </div>
          <div className="flex items-center">
            <PaperClipIcon className="h-5 w-5 text-purple-500 mr-2" />
            <span className="text-blue-500 cursor-pointer">View Medical Records</span>
          </div>
          <div className="flex items-center">
            <PencilSquareIcon className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-blue-500 cursor-pointer">Update Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
}
