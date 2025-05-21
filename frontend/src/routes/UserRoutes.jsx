import { Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from '../Components/User/UserLayout';
import UserDashboard from '../Pages/User/UserDashboard';
import UserAppointments from '../Pages/User/AppointmentBooking';
import UserNotifications from '../Pages/User/NotificationList';
import UserFeedback from '../Pages/User/FeedbackComponent';
import UserChat from '../Pages/User/ChatComponent';
import Profile from '../Pages/User/Profile';

// Private Route for Users
function UserPrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "user") {
    return <Navigate to="/" />;
  }

  return children;
}

function UserRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<UserPrivateRoute><UserLayout /></UserPrivateRoute>}>
        <Route index element={<UserDashboard />} />
        <Route path="appointments" element={<UserAppointments />} />
        <Route path="notifications" element={<UserNotifications />} />
        <Route path="feedback" element={<UserFeedback />} />
        <Route path="chat" element={<UserChat />} />
        <Route path="profile" element={<Profile />} /> {/* ✅ Fixed path */}
      </Route>
    </Routes>
  );
}

export default UserRoutes;


