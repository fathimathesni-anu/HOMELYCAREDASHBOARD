import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DoctorRoutes from './routes/doctorRoutes';
import LoginSignup from './Components/LoginSignup';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import StaffRoutes from './routes/StaffRoutes'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginSignup />} />
      <Route path="/*" element={<DoctorRoutes />} /> 
      <Route path="/user/*" element={<UserRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/staff/*" element={<StaffRoutes />} />
    </Routes>
  );
}

export default App;



