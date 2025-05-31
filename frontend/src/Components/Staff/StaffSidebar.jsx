import { useState, useEffect } from 'react';
import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  ClipboardIcon,
  ChatBubbleLeftEllipsisIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
  { name: 'Appointments', icon: CalendarIcon, path: '/staff/dashboard/appointments' },
  { name: 'Patients', icon: UserGroupIcon, path: '/staff/dashboard/patients' },
  { name: 'Doctors', icon: UserIcon, path: '/staff/dashboard/doctors' },
  { name: 'Staff', icon: ClipboardDocumentListIcon, path: '/staff/dashboard/staff' },
  { name: 'Tasks', icon: ClipboardIcon, path: '/staff/dashboard/tasks' },
  { name: 'Blood Bank', icon: HeartIcon, path: '/staff/dashboard/blood-bank' },
  { name: 'Chat', icon: ChatBubbleLeftEllipsisIcon, path: '/staff/dashboard/chat' },
  { name: 'Notifications', icon: BellIcon, path: '/staff/dashboard/notifications' },
  { name: 'Feedback', icon: PencilSquareIcon, path: '/staff/dashboard/feedback' },
];

export default function StaffSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleResize = () => {
      const wide = window.innerWidth >= 768;
      setIsDesktop(wide);
      setIsOpen(wide); // auto open on desktop
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // initialize

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Sidebar overlay for mobile */}
      {!isDesktop && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`fixed md:static z-50 top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isDesktop ? 'w-64' : 'w-64'} md:flex md:flex-col`}
      >
        {/* Header with toggle button */}
        <div className="flex items-center justify-between p-4 md:justify-end">
          {!isDesktop && (
            <button onClick={toggleSidebar} className="text-gray-500 dark:text-gray-400">
              <XMarkIcon className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2 space-y-2 overflow-y-auto">
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

      {/* Toggle Button (visible on mobile only) */}
      {!isDesktop && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-900 border rounded-md shadow-md md:hidden"
        >
          <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
        </button>
      )}
    </>
  );
}

