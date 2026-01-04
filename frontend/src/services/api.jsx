import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
};

// Job endpoints
export const jobAPI = {
  getPublicJobs: () => api.get('/jobs/public/'),
  getEmployerJobs: () => api.get('/jobs/employer/'),
  createJob: (data) => api.post('/jobs/employer/', data),
  updateJob: (id, data) => api.put(`/jobs/employer/${id}/`, data),
  deleteJob: (id) => api.delete(`/jobs/employer/${id}/`),
};

// Application endpoints
export const applicationAPI = {
  apply: (data) => api.post('/applications/apply/', data),
  getJobApplications: (jobId) => api.get(`/applications/job/${jobId}/`),
  updateStatus: (id, status) => api.patch(`/applications/${id}/status/`, { status }),
  getDashboard: () => api.get('/applications/employer/dashboard/'),
  getMyApplications: () => api.get('/applications/my-applications/'),
};

export default api;