import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../Components/Admin/AdminSidebar";
import AdminNavbar from "../../Components/Admin/AdminNavbar";
import Footer from "../../Components/Footer"; // add this if you want footer like staff layout

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <AdminNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-800">
          <Outlet />
        </main>

        {/* Footer (optional) */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;










