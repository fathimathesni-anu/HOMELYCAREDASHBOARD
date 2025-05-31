import { useState, useEffect } from 'react';
import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  UserIcon,
  ChatBubbleLeftEllipsisIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
  { name: 'Appointments', icon: CalendarIcon, path: '/dashboard/appointments' },
  { name: 'Patients', icon: UserGroupIcon, path: '/dashboard/patients' },
  { name: 'Doctors', icon: UserIcon, path: '/dashboard/doctors' },
  { name: 'Chat', icon: ChatBubbleLeftEllipsisIcon, path: '/dashboard/chat' },
  { name: 'Notifications', icon: BellIcon, path: '/dashboard/notifications' },
  { name: 'Feedback', icon: PencilSquareIcon, path: '/dashboard/feedback' },
];

export default function DoctorSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Sidebar toggle button (visible on small screens) */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <XMarkIcon className="h-6 w-6 text-gray-700 dark:text-white" /> : <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-white" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-50 md:static top-0 left-0 h-full transform transition-transform duration-300 ease-in-out
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        w-64 md:w-64`}
      >
        {/* Sidebar content */}
        <div className="h-full flex flex-col">
          {/* Logo/Header */}
          <div className="flex items-center justify-between p-4 md:justify-center">
            <span className="text-xl font-semibold text-blue-600 dark:text-white hidden md:block">
              HomelyCare
            </span>
            <button onClick={toggleSidebar} className="md:hidden text-gray-500 dark:text-gray-400">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
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
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}

