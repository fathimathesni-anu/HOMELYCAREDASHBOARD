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
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-900 shadow-md text-gray-700 dark:text-gray-300 md:hidden"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          flex flex-col transition-all duration-300 z-50
          ${isOpen ? 'w-64' : 'w-20'}
          md:static md:translate-x-0 md:flex md:w-auto
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
        style={{ transitionProperty: 'width, transform' }}
      >
        {/* Logo and Toggle (hidden on mobile) */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 md:hidden">
          <div className="text-lg font-bold text-blue-600 dark:text-white">Admin Panel</div>
          <button
            onClick={toggleSidebar}
            className="text-gray-500 dark:text-gray-400 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        {/* Sidebar content */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center p-2 rounded-lg transition-colors duration-200
                  ${isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                  }
                `}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className={`${isOpen ? 'inline' : 'hidden'} transition-opacity duration-300 truncate`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Toggle button for desktop */}
        <div className="hidden md:flex items-center justify-center p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 dark:text-gray-400 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </>
  );
}


