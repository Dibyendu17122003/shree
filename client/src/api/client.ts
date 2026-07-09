import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const sessionApi = {
  create: () => api.post('/session/create').then(r => r.data),
  track: (sessionId: string, page: string) => api.post('/session/track', { sessionId, page }),
  update: (data: any) => api.put('/session/update', data),
  get: (sessionId: string) => api.get(`/session/${sessionId}`).then(r => r.data),
};

export const answersApi = {
  save: (data: any) => api.post('/answers/save', data).then(r => r.data),
  get: (sessionId: string) => api.get(`/answers/${sessionId}`).then(r => r.data),
  saveDateSelection: (data: any) => api.post('/answers/date-selection', data).then(r => r.data),
  getDateSelection: (sessionId: string) => api.get(`/answers/date-selection/${sessionId}`).then(r => r.data),
};

export const adminApi = {
  login: (username: string, password: string) => api.post('/admin/login', { username, password }).then(r => r.data),
  checkAuth: () => api.get('/admin/check').then(r => r.data),
  getStats: () => api.get('/analytics/stats').then(r => r.data),
  getAnswers: () => api.get('/analytics/answers').then(r => r.data),
  getCharts: () => api.get('/analytics/charts').then(r => r.data),
  search: (params: any) => api.get('/analytics/search', { params }).then(r => r.data),
  deleteSession: (sessionId: string) => api.delete(`/analytics/session/${sessionId}`).then(r => r.data),
  exportData: (format: string) => api.get('/analytics/export', { params: { format }, responseType: 'blob' }).then(r => r.data),
};

export default api;
