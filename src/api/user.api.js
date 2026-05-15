import api from './axios';

export const userApi = {
  list: (search = '') => api.get('/users', { params: { search } }).then((r) => r.data),
  updateMe: (data) => api.patch('/users/me', data).then((r) => r.data),
  // Admin only
  getUser: (id) => api.get(`/users/${id}`).then((r) => r.data),
  adminUpdate: (id, data) => api.patch(`/users/${id}`, data).then((r) => r.data),
  adminDelete: (id) => api.delete(`/users/${id}`).then((r) => r.data),
};
