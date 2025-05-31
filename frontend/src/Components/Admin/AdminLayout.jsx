import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import Footer from '../Footer';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auto-close sidebar on resize (desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Mobile Sidebar Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow md:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-white" />
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300">
        <AdminNavbar />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </div>

        {/* Optional: show footer only on desktop */}
        <div className="hidden md:block">
          <Footer />
        </div>
      </div>
    </div>
  );
}






