import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DoctorSidebar from './DoctorSidebar';
import DoctorNavbar from './DoctorNavbar';
import Footer from '../Footer';

export default function DoctorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      const wide = window.innerWidth >= 768;
      setIsDesktop(wide);
      setSidebarOpen(wide); // open on desktop by default
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // call on mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed z-40 inset-y-0 left-0 transition-transform duration-300 ease-in-out md:relative ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <DoctorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay on small screens */}
      {!isDesktop && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <DoctorNavbar onToggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <main className="p-4 md:p-6">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}


