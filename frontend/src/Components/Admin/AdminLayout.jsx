import React, { useState } from "react";
import AdminNavbar from "../../Components/Admin/AdminNavbar";
import AdminSidebar from "../../Components/Admin/AdminSidebar";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <div className="sticky top-0 z-40 w-full">
          <AdminNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;









