import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../Components/Admin/AdminLayout';
import AdminDashboard from '../Pages/Admin/AdminDashboard';
import Appointments from '../Pages/Admin/AppoinmentList';
import Patients from '../Pages/Admin/PatientList';
import DoctorAdminPage from '../Pages/Admin/DoctorManagementDashboard';
import Staff from '../Pages/Admin/CreateStaff';
import Tasks from '../Pages/Admin/CreateTask';
import BloodBank from '../Pages/Admin/BloodbankManager';
import Chat from '../Pages/Admin/ChatComponent';
import Notifications from '../Pages/Admin/NotificationList';
import Feedback from '../Pages/Admin/FeedbackComponent';

// Private Route Component
function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  
  // Check if user exists and has doctor role
  if (!user || user.role !== "admin") {
    // Redirect to login page if user is not a doctor or not logged in
    return <Navigate to="/" />;
  }
  
  return children; // If user is authenticated and has the doctor role, show the children routes
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="patients" element={<Patients />} />
        <Route path="doctors" element={<DoctorAdminPage />} />
        <Route path="staff" element={<Staff />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="blood-bank" element={<BloodBank />} />
        <Route path="chat" element={<Chat />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="feedback" element={<Feedback />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;



