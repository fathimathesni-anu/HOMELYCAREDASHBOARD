import React from 'react';
import { Outlet } from 'react-router-dom';
import StaffSidebar from './StaffSidebar';
import StaffNavbar from './StaffNavbar';
import Footer from '../Footer';

export default function StaffLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <StaffSidebar />
      <div className="flex-1 flex flex-col">
        <StaffNavbar />
        <div className="flex-1 flex flex-col justify-between overflow-auto">
          <main className="p-6 flex-1">
            <Outlet /> {/* Render nested routes here */}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

