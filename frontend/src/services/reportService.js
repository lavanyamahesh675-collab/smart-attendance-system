import api from './api';

export const getDailyReport = async (date) => {
  const response = await api.get('/reports/daily', { params: { date } });
  return response.data;
};

export const getRangeReport = async (startDate, endDate) => {
  const response = await api.get('/reports/range', { params: { startDate, endDate } });
  return response.data;
};

export const getLowAttendanceReport = async (threshold = 75.0) => {
  const response = await api.get('/reports/low-attendance', { params: { threshold } });
  return response.data;
};

export const getLeaveReport = async () => {
  const response = await api.get('/reports/leaves');
  return response.data;
};
