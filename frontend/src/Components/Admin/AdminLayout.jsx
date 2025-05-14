import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import Footer from '../Footer';
export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <div className="flex-1 flex flex-col justify-between overflow-auto">
          <main className="p-6 flex-1">
            <Outlet />{/* This line ensures nested routes render */}
          </main>
          <Footer />
        </div>
      </div>
    </div >
  );
}



