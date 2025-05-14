import { Routes, Route, Navigate } from 'react-router-dom';
import DoctorLayout from '../Components/Doctor/DoctorLayout';
import DoctorDashboard from '../Pages/Doctor/DoctorDashboard';
import Appointments from '../Pages/Doctor/AppoinmentList';
import Patients from '../Pages/Doctor/PatientList';
import Chat from '../Pages/Doctor/ChatComponent';
import Notifications from '../Pages/Doctor/NotificationList';
import Feedback from '../Pages/Doctor/FeedbackComponent';

// Private Route Component
function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  
  // Check if user exists and has doctor role
  if (!user || user.role !== "doctor") {
    // Redirect to login page if user is not a doctor or not logged in
    return <Navigate to="/" />;
  }
  
  return children; // If user is authenticated and has the doctor role, show the children routes
}

function DoctorRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<PrivateRoute><DoctorLayout /></PrivateRoute>}>
        <Route index element={<DoctorDashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="patients" element={<Patients />} />
        <Route path="chat" element={<Chat />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="feedback" element={<Feedback />} />
      </Route>
    </Routes>
  );
}

export default DoctorRoutes;

