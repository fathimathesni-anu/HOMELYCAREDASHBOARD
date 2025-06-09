import {
  ClipboardDocumentListIcon,
  CalendarIcon,
  BellIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ChartBarIcon,
  WrenchIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import DashboardNotificationWidget from '../../Components/Widgets/DashboardNotificationWidget';
import AppointmentsOverview from '../../Components/Widgets/AppointmentsOverview'; // <-- Add this import

export default function AdminHomepage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Staff Management Widget */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
          Staff Management
        </h2>
        <div className="mt-4 space-y-3">
          <Link to="/admin/dashboard/staff" className="flex items-center text-blue-500 hover:underline">
            <UserGroupIcon className="h-5 w-5 text-indigo-500 mr-2" />
            <span>View Staff List</span>
          </Link>
          <Link to="/admin/dashboard/staff" className="flex items-center text-blue-500 hover:underline">
            <BriefcaseIcon className="h-5 w-5 text-green-500 mr-2" />
            <span>Add New Staff</span>
          </Link>
        </div>
      </div>

      {/* Appointments Overview (Dynamic Widget) */}
      <AppointmentsOverview /> {/* <-- Replaces hardcoded widget */}

      {/* System Notifications Widget */}
      <DashboardNotificationWidget />
    </div>
  );
}


