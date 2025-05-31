import { useState } from 'react';
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

export default function AdminSidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      <aside
        className={`
          fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          z-50 transform transition-transform duration-300 ease-in-out
          w-64
          md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:static md:inset-auto md:transform-none
          flex flex-col
        `}
      >
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 md:hidden">
          <span className="text-xl font-bold text-blue-600 dark:text-white">HomelyCare</span>
          <button
            onClick={toggleSidebar}
            className="text-gray-500 dark:text-gray-400 focus:outline-none"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => isOpen && toggleSidebar()} // Close on mobile after click
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
      </aside>
    </>
  );
}





