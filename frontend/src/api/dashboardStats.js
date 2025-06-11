import axiosInstance from './axiosInstance';

export const fetchDoctorDashboardStats = async () => {
  const [
    appointmentsRes,
    appointmentCountRes,
    patientsRes,
    chatCountRes,
    feedbackCountRes // ✅ fetch feedback count only
  ] = await Promise.all([
    axiosInstance.get('/appointment'),           // Full appointment list
    axiosInstance.get('/appointment/count'),     // Total appointment count
    axiosInstance.get('/patient'),
    axiosInstance.get('/chat/count'),            // Chat count only
    axiosInstance.get('/feedback/count'),        // ✅ Feedback count only
  ]);

  const appointments = appointmentsRes.data.appointments || appointmentsRes.data;
  const todayStr = new Date().toISOString().split('T')[0];

  const todayAppointments = appointments.filter(app => {
    const appDate = new Date(app.appointmentDate).toISOString().split('T')[0];
    return appDate === todayStr;
  });

  return {
    totalAppointmentsToday: todayAppointments.length,
    totalAppointments: appointmentCountRes.data.totalAppointments,
    totalPatients: patientsRes.data.length,
    totalChats: chatCountRes.data.totalChats,
    totalPendingFeedback: feedbackCountRes.data.totalFeedback, // ✅ total feedback count
  };
};







