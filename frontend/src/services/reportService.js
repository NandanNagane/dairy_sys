// Reports API services
import apiClient from '../lib/api.js';

export const reportAPI = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await apiClient.get('/reports/dashboard-stats');
    return response.data;
  },

  // Generate farmer statement PDF
  generateFarmerStatement: async (userId, params = {}) => {
    const response = await apiClient.get(`/reports/farmer-statement/${userId}`, {
      params,
      responseType: 'blob', // For PDF download
    });
    return response;
  },
};