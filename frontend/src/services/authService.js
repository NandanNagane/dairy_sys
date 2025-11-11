// Authentication API services
import apiClient from '../lib/api.js';

export const authAPI = {
  // Initialize admin user (one-time setup)
  initializeAdmin: async (userData) => {
    const response = await apiClient.post('/auth/initialize-admin', userData);
    return response.data;
  },

  // Register farmer
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    console.log(response.data);
    
    return response.data;
  },

  // Logout user (clears cookie)
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};