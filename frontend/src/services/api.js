import axios from 'axios';

const api = axios.create({
  // Fallback ke '/api' jika env tidak diset
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

console.log('✅ api.js loaded, baseURL:', api.defaults.baseURL);

export default api;

// ==================== AUTH ====================
export const register = (userData) => api.post('/register', userData);
export const login = (data) => api.post('/login', data);

// ==================== MATERI ====================
export const getContents = () => api.get('/contents');
export const getContentById = (id) => api.get(`/contents/${id}`);

// ==================== REKOMENDASI (Random Forest) ====================
export const getRecommendations = () => api.get('/recommendations');

// ==================== TRACKING ====================
export const trackOpen = (data) => api.post('/track', { ...data, action: 'open' });
export const trackClose = (data) => api.post('/track', { ...data, action: 'close' });
export const trackComplete = (data) => api.post('/track', { ...data, action: 'complete' });

// ==================== POSTTEST ====================
export const submitPosttest = (data) => api.post('/posttest', data);

// ==================== USER ====================
export const getUserProgress = () => api.get('/user/progress');
export const getUserAchievements = () => api.get('/user/achievements');
export const getUserWeeklyActivity = () => api.get('/user/weekly-activity');
export const updateUserProfile = (data) => api.put('/users/me', data);
export const submitFeedback = (data) => api.post('/feedback', data);

// ==================== PUBLIK ====================
export const getStats = () => api.get('/stats');

// ==================== ADMIN ====================
export const getAdminStats = () => api.get('/admin/stats');
export const getAdminUsers = () => api.get('/admin/users');
export const getAdminFeedbacks = () => api.get('/admin/feedbacks');
export const createMateri = (data) => api.post('/admin/materi', data);
export const updateMateri = (id, data) => api.put(`/admin/materi/${id}`, data);
export const deleteMateri = (id) => api.delete(`/admin/materi/${id}`);
export const getAllPosttests = () => api.get('/posttests');