import axios from 'axios';

// In production (Render static site), VITE_API_URL must point to the backend URL.
// In development, we use the Vite proxy ('/api/') so no env var is needed.
const isProduction = import.meta.env.PROD;
const apiUrl = import.meta.env.VITE_API_URL;

const getBaseHost = () => {
  if (apiUrl) return apiUrl.replace(/\/+$/, '');
  return 'http://127.0.0.1:8000';
};

export const BASE_HOST = getBaseHost();

// Production → full URL to backend (e.g. https://kleerinfini-backend.onrender.com/api/)
// Development → relative path leveraging Vite proxy
const getBaseUrl = () => {
  if (isProduction && apiUrl) {
    return `${apiUrl.replace(/\/+$/, '')}/api/`;
  }
  return '/api/';
};

console.log('[AXIOS] Mode:', isProduction ? 'production' : 'development');
console.log('[AXIOS] BaseURL:', getBaseUrl());

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

// Interceptor to attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token.trim()}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh');

      if (refreshToken) {
        try {
          console.log('[AXIOS] Attempting token refresh...');
          // Use axios directly to avoid interceptor loop
          const response = await axios.post(`${BASE_HOST}/api/token/refresh/`, {
            refresh: refreshToken
          });

          const { access } = response.data;
          localStorage.setItem('token', access);

          // Retry original request
          api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
          originalRequest.headers['Authorization'] = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error('[AXIOS] Refresh failed', refreshError);
          // If refresh fails, we can't do anything here, let AuthContext handle it if needed
          // or we could force a logout here, but better to let the App handle state
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

