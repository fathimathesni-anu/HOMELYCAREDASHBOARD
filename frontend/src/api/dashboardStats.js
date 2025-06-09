import axiosInstance from './axiosInstance';

export const fetchDoctorDashboardStats = async () => {
  const [appointmentsRes, patientsRes, messagesRes, feedbackRes] = await Promise.all([
    axiosInstance.get('/appointments'),
    axiosInstance.get('/patient'),
    axiosInstance.get('/chat'),
    axiosInstance.get('/feedback'),
  ]);

  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointmentsRes.data.filter(app => new Date(app.appointmentDate).toISOString().split('T')[0] === today);

  return {
    totalAppointmentsToday: todaysAppointments.length,
    totalPatients: patientsRes.data.length,
    totalUnreadMessages: messagesRes.data.filter(msg => !msg.read).length,
    totalPendingFeedback: feedbackRes.data.filter(fb => fb.status === 'pending').length,
  };
};

