// Reports API services
import apiClient from '../lib/api.js';

export const reportAPI = {
  // Generate farmer statement PDF
  generateFarmerStatement: async (userId, params = {}) => {
    const response = await apiClient.get(`/reports/farmer-statement/${userId}`, {
      params,
      responseType: 'blob', // For PDF download
    });
    return response;
  },
};