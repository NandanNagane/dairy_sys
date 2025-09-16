// Payment and billing API services
import apiClient from '../lib/api.js';

export const paymentAPI = {
  // Generate billing from unbilled collections (Admin only)
  generateBilling: async (billingData) => {
    const response = await apiClient.post('/billing/generate', billingData);
    return response.data;
  },

  // Get all payments (Admin only)
  getAllPayments: async (params = {}) => {
    const response = await apiClient.get('/payments', { params });
    return response.data;
  },

  // Get payment by ID (Admin only)
  getPaymentById: async (id) => {
    const response = await apiClient.get(`/payments/${id}`);
    return response.data;
  },

  // Update payment status (Admin only)
  updatePaymentStatus: async (id, statusData) => {
    const response = await apiClient.patch(`/payments/${id}`, statusData);
    return response.data;
  },
};