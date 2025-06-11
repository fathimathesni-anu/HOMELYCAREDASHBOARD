import axios from './axiosInstance'; // or 'axios'

export const fetchStaffDashboardStats = async () => {
  const [staff, tasks, blood] = await Promise.all([
    axios.get('/staff/count'),       // { count: number }
    axios.get('/task/count'),        // { count: number, pendingCount: number } — see note below
    axios.get('/bloodbank/count'),   // { count: number }
  ]);

  return {
    totalStaff: staff.data.count,
    pendingTasks: tasks.data.pendingCount,  // updated to use pendingCount directly from API
    bloodInventory: blood.data.count,
  };
};


