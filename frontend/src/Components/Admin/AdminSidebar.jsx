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

export default function AdminSidebar() {
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
    handleResize(); // initial setup

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {!isDesktop && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden"
          onClick={toggleSidebar}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static z-50 top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isDesktop ? 'w-64' : 'w-64'} md:flex md:flex-col`}
        role="navigation"
      >
        {/* Header with close button on mobile */}
        <div className="flex items-center justify-between p-4 md:justify-end border-b border-gray-200 dark:border-gray-700">
          {!isDesktop && (
            <button
              onClick={toggleSidebar}
              className="text-gray-500 dark:text-gray-400"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          )}
          {/* Show title on desktop */}
          {isDesktop && (
            <span className="text-xl font-semibold text-blue-600 dark:text-white">
              HomelyCare
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {menuItems.map(({ name, icon: Icon, path }) => {
            const isActive = location.pathname.startsWith(path);
            return (
              <Link
                key={name}
                to={path}
                className={`flex items-center p-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                }`}
                onClick={() => !isDesktop && toggleSidebar()} // close sidebar on link click on mobile
              >
                <Icon className="h-5 w-5 mr-3" />
                <span>{name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile toggle button */}
      {!isDesktop && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-900 border rounded-md shadow-md md:hidden"
          aria-label="Open sidebar"
        >
          <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
        </button>
      )}
    </>
  );
}









