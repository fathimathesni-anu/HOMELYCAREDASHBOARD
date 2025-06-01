import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DoctorSidebar from './DoctorSidebar';
import DoctorNavbar from './DoctorNavbar';
import Footer from '../Footer';

export default function DoctorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <DoctorSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <DoctorNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-800">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}



