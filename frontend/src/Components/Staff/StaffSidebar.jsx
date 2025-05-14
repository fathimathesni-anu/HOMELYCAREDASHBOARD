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
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`flex flex-col h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between p-4">
        <button onClick={toggleSidebar} className="text-gray-500 dark:text-gray-400 focus:outline-none">
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
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
