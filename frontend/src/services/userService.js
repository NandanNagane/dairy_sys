// User management API services
import apiClient from '../lib/api.js';

export const userAPI = {
  // Get all users (Admin only)
  getAllUsers: async (params = {}) => {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  // Get user by ID (Admin only)
  getUserById: async (userId) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  // Create new user (Admin only - does not issue JWT token)
  createUser: async (userData) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  // Update user (Admin only)
  updateUser: async (userId, userData) => {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Delete user (Admin only)
  deleteUser: async (userId) => {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  },

  // Get user's milk collections
  getUserMilkCollections: async (userId, params = {}) => {
    const response = await apiClient.get(`/users/${userId}/milk-collections`, { params });
    return response.data;
  },

  // Get user's payment history
  getUserPayments: async (userId, params = {}) => {
    const response = await apiClient.get(`/users/${userId}/payments`, { params });
    return response.data;
  },
};