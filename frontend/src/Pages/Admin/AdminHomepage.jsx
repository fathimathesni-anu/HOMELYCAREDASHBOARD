import {
  ClipboardDocumentListIcon,
  CalendarIcon,
  BellIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ChartBarIcon,
  WrenchIcon,
} from '@heroicons/react/24/outline';

export default function AdminHomepage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Staff Management Widget */}
      <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Staff Management</h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-center">
            <UserGroupIcon className="h-5 w-5 text-indigo-500 mr-2" />
            <span className="text-blue-500 cursor-pointer">View Staff List</span>
          </div>
          <div className="flex items-center">
            <BriefcaseIcon className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-blue-500 cursor-pointer">Add New Staff</span>
          </div>
        </div>
      </div>

      {/* Appointments Overview */}
      <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Appointments Overview</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300">12 Appointments scheduled today</p>
        <div className="mt-4 flex items-center">
          <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-blue-500 cursor-pointer">View All Appointments</span>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white">System Notifications</h2>
        <ul className="mt-4 space-y-3">
          <li className="flex items-center">
            <BellIcon className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-gray-600 dark:text-gray-300">Backup completed successfully.</p>
          </li>
          <li className="flex items-center">
            <BellIcon className="h-5 w-5 text-yellow-500 mr-2" />
            <p className="text-gray-600 dark:text-gray-300">Low inventory in Blood Bank.</p>
          </li>
        </ul>
      </div>

      {/* Reports */}
      <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Reports & Analytics</h2>
        <div className="mt-4 flex items-center">
          <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-blue-500 cursor-pointer">View Reports</span>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white">System Settings</h2>
        <div className="mt-4 flex items-center">
          <WrenchIcon className="h-5 w-5 text-gray-500 mr-2" />
          <span className="text-blue-500 cursor-pointer">Manage System Config</span>
        </div>
      </div>
    </div>
  );
}

