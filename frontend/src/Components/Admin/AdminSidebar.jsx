import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  ClipboardIcon,
  ChatBubbleLeftEllipsisIcon,
  BellIcon,
  HeartIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', icon: HomeIcon, path: '/admin/dashboard' },
  { name: 'Appointments', icon: CalendarIcon, path: '/admin/dashboard/appointments' },
  { name: 'Patients', icon: UserGroupIcon, path: '/admin/dashboard/patients' },
  { name: 'Doctors', icon: UserIcon, path: '/admin/dashboard/doctors' },
  { name: 'Staff', icon: ClipboardDocumentListIcon, path: '/admin/dashboard/staff' },
  { name: 'Tasks', icon: ClipboardIcon, path: '/admin/dashboard/tasks' },
  { name: 'Blood Bank', icon: HeartIcon, path: '/admin/dashboard/blood-bank' },
  { name: 'Chat', icon: ChatBubbleLeftEllipsisIcon, path: '/admin/dashboard/chat' },
  { name: 'Notifications', icon: BellIcon, path: '/admin/dashboard/notifications' },
  { name: 'Feedback', icon: PencilSquareIcon, path: '/admin/dashboard/feedback' },
];

export default function AdminSidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 md:static h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:justify-center">
          <span className="text-xl font-semibold text-blue-600 dark:text-white">HomelyCare</span>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-500 dark:text-gray-400"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 pb-4 space-y-2 overflow-y-auto">
          {menuItems.map(({ name, icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={name}
                to={path}
                className={`flex items-center p-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span>{name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}







