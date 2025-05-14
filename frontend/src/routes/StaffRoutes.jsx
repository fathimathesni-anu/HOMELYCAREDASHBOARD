import { Routes, Route, Navigate } from 'react-router-dom';
import StaffLayout from '../Components/Staff/StaffLayout';
import StaffDashboard from '../Pages/Staff/StaffDashboard';
import Appointments from '../Pages/Staff/AppoinmentList';
import Patients from '../Pages/Staff/PatientList';
import Doctors from '../Pages/Staff/DoctorManagementDashboard';
import Staff from '../Pages/Staff/CreateStaff';
import Tasks from '../Pages/Staff/CreateTask';
import BloodBank from '../Pages/Staff/BloodbankManager';
import Chat from '../Pages/Staff/ChatComponent';
import Notifications from '../Pages/Staff/NotificationList';
import Feedback from '../Pages/Staff/FeedbackComponent';

// Private Route Component
function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  
  // Check if user exists and has doctor role
  if (!user || user.role !== "staff") {
    // Redirect to login page if user is not a doctor or not logged in
    return <Navigate to="/" />;
  }
  
  return children; // If user is authenticated and has the doctor role, show the children routes
}

function StaffRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<PrivateRoute><StaffLayout /></PrivateRoute>}>
        <Route index element={<StaffDashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="patients" element={<Patients />} />
        <Route path="doctors" element={<Doctors />} />
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

export default StaffRoutes;
