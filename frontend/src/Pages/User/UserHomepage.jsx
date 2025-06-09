import { PaperClipIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import DashboardNotificationWidget from '../../Components/Widgets/DashboardNotificationWidget';
import NextAppointmentWidget from '../../Components/Widgets/NextAppointmentWidget'; // <- import here

export default function UserHomepage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Dynamic Next Appointment Widget */}
      <NextAppointmentWidget />

      {/* Notifications Widget (Dynamic) */}
      <DashboardNotificationWidget />

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



