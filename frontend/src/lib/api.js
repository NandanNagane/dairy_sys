// API client configuration
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important: sends cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.error('Authentication failed - token may be expired or invalid');
      // Check if we're already on the login page to avoid redirect loop
      if (!window.location.pathname.includes('/login')) {
        console.log('Redirecting to login...');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;