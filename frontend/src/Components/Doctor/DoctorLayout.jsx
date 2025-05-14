import { Outlet } from 'react-router-dom';
import DoctorSidebar from './DoctorSidebar';
import DoctorNavbar from './DoctorNavbar';
import Footer from '../Footer';

export default function DoctorLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col">
        <DoctorNavbar />
        <div className="flex-1 flex flex-col justify-between overflow-auto">
          <main className="p-6 flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

