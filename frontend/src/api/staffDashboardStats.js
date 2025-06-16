// src/api/staffDashboard.js
import axios from './axiosInstance';

export const fetchStaffDashboardStats = async () => {
  const [staff, tasks, blood, doctor] = await Promise.all([
    axios.get('/staff/count'),
    axios.get('/task/count'),
    axios.get('/bloodbank/count'),
    axios.get('/doctor/count')
  ]);

  return {
    totalStaff: staff.data.count,
    pendingTasks: tasks.data.pendingCount,
    bloodInventory: blood.data.count,
    totalDoctor: doctor.data.count
  };
};



