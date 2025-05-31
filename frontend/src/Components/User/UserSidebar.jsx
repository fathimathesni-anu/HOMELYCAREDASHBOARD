import { useState } from 'react';
import {
  HomeIcon,
  CalendarIcon,
  ChatBubbleLeftEllipsisIcon,
  BellIcon,
  PencilSquareIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', icon: HomeIcon, path: '/user/dashboard' },
  { name: 'Appointments', icon: CalendarIcon, path: '/user/dashboard/appointments' },
  { name: 'Chat', icon: ChatBubbleLeftEllipsisIcon, path: '/user/dashboard/chat' },
  { name: 'Feedback', icon: PencilSquareIcon, path: '/user/dashboard/feedback' },
  { name: 'Notifications', icon: BellIcon, path: '/user/dashboard/notifications' },
];

export default function UserSidebar() {
  const [isOpen, setIsOpen] = useState(false); // Closed by default on mobile
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar container */}
      <div
        className={`fixed z-40 top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-0'} md:w-64 md:relative md:block`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 md:hidden">
          <span className="text-lg font-semibold text-blue-600 dark:text-white">Menu</span>
          <button onClick={toggleSidebar} className="text-gray-600 dark:text-gray-400">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)} // Auto close on mobile after click
                className={`flex items-center p-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-md md:hidden"
      >
        <Bars3Icon className="h-6 w-6 text-gray-800 dark:text-white" />
      </button>
    </>
  );
}

