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
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`flex flex-col h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* Logo and Toggle Button */}
      <div className="flex items-center justify-between p-4">
        <button onClick={toggleSidebar} className="text-gray-500 dark:text-gray-400 focus:outline-none">
          {isOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center p-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className={`${isOpen ? 'inline' : 'hidden'} transition-opacity duration-300`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

