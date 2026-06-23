import { api } from './client.js';

export const authApi = {
  register: (payload) => api.post('/auth/register', payload).then((res) => res.data.data),
  login: (payload) => api.post('/auth/login', payload).then((res) => res.data.data),
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload),
  resetPassword: (payload) => api.post('/auth/reset-password', payload)
};

export const userApi = {
  me: () => api.get('/users/me').then((res) => res.data.data),
  update: (payload) => api.patch('/users/me', payload).then((res) => res.data.data)
};

export const emissionApi = {
  list: (params) => api.get('/emissions', { params }).then((res) => res.data.data),
  create: (payload) => api.post('/emissions', payload).then((res) => res.data.data),
  update: (id, payload) => api.patch(`/emissions/${id}`, payload).then((res) => res.data.data),
  remove: (id) => api.delete(`/emissions/${id}`)
};

export const goalApi = {
  list: () => api.get('/goals').then((res) => res.data.data),
  create: (payload) => api.post('/goals', payload).then((res) => res.data.data),
  update: (id, payload) => api.patch(`/goals/${id}`, payload).then((res) => res.data.data)
};

export const tipApi = {
  list: (params) => api.get('/tips', { params }).then((res) => res.data.data),
  create: (payload) => api.post('/tips', payload).then((res) => res.data.data),
  toggleLike: (id) => api.post(`/tips/${id}/like`).then((res) => res.data.data)
};

export const dashboardApi = {
  overview: () => api.get('/dashboard').then((res) => res.data.data)
};

export const notificationApi = {
  list: () => api.get('/notifications').then((res) => res.data.data),
  markRead: (id) => api.patch(`/notifications/${id}/read`).then((res) => res.data.data),
  updatePrefs: (payload) => api.patch('/notifications/prefs', payload).then((res) => res.data.data)
};

export const businessApi = {
  create: (payload) => api.post('/business', payload).then((res) => res.data.data),
  dashboard: () => api.get('/business/dashboard').then((res) => res.data.data)
};
