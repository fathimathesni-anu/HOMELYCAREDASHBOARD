// src/layouts/UserLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from '../User/UserSidebar';
import UserNavbar from '../User/UserNavbar';
import Footer from '../Footer';

export default function UserLayout() {
  return (
    <div className="flex flex-col h-screen">
      <UserNavbar />
      <div className="flex flex-1">
        <UserSidebar />
        <main className="flex-1 p-4 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}


