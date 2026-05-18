import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
const normalizedApiUrl = rawApiUrl
  ? rawApiUrl.replace(/\/$/, '').endsWith('/api')
    ? rawApiUrl.replace(/\/$/, '')
    : `${rawApiUrl.replace(/\/$/, '')}/api`
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: normalizedApiUrl,
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
