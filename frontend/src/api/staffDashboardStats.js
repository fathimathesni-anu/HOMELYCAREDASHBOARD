import axios from './axiosInstance'; // or 'axios' if you're using plain axios

export const fetchStaffDashboardStats = async () => {
  const [staff, tasks, blood] = await Promise.all([
    axios.get('/staff'),
    axios.get('/tasks'),
    axios.get('/bloodbank'),
  ]);

  return {
    totalStaff: staff.data.length,
    pendingTasks: tasks.data.filter(task => task.status === 'pending').length,
    bloodInventory: blood.data.length,
  };
};

