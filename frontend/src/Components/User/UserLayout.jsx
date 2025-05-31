import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from '../User/UserSidebar';
import UserNavbar from '../User/UserNavbar';
import Footer from '../Footer';

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar with toggle button for sidebar on mobile */}
      <UserNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md 
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:relative md:translate-x-0 md:flex-shrink-0
          `}
        >
          <UserSidebar closeSidebar={() => setSidebarOpen(false)} />
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-30 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 md:ml-64">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}



