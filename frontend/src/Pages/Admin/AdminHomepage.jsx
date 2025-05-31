
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

      {/* Appointments Overview */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
          Appointments Overview
        </h2>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          12 Appointments scheduled today
        </p>
        <Link to="/admin/dashboard/appointments" className="mt-3 flex items-center text-blue-500 hover:underline">
          <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
          <span>View All Appointments</span>
        </Link>
      </div>

      {/* System Notifications */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
          System Notifications
        </h2>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="flex items-start">
            <BellIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <p className="text-gray-600 dark:text-gray-300">Backup completed successfully.</p>
          </li>
          <li className="flex items-start">
            <BellIcon className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
            <p className="text-gray-600 dark:text-gray-300">Low inventory in Blood Bank.</p>
          </li>
        </ul>
      </div>

      {/* Reports (optional) */}
      {/*
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
          Reports & Analytics
        </h2>
        <Link to="/admin/dashboard/reports" className="mt-4 flex items-center text-blue-500 hover:underline">
          <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
          <span>View Reports</span>
        </Link>
      </div>
      */}

      {/* System Settings (optional) */}
      {/*
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
          System Settings
        </h2>
        <Link to="/admin/dashboard/settings" className="mt-4 flex items-center text-blue-500 hover:underline">
          <WrenchIcon className="h-5 w-5 text-gray-500 mr-2" />
          <span>Manage System Config</span>
        </Link>
      </div>
      */}
    </div>
  );
}
