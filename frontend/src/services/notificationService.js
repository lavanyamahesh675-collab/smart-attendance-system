import api from './api';

export const getUserNotifications = async (userId) => {
  const response = await api.get(`/notifications/user/${userId}`);
  return response.data;
};

export const getUnreadCount = async (userId) => {
  const response = await api.get(`/notifications/user/${userId}/unread-count`);
  return response.data.count;
};

export const markAsRead = async (id) => {
  await api.put(`/notifications/${id}/read`);
};

export const markAllAsRead = async (userId) => {
  await api.put(`/notifications/user/${userId}/read-all`);
};
