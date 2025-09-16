// Milk collection API services
import apiClient from '../lib/api.js';

export const milkCollectionAPI = {
  // Create milk collection (Admin only)
  createMilkCollection: async (collectionData) => {
    const response = await apiClient.post('/milk-collections', collectionData);
    return response.data;
  },

  // Get all milk collections (Admin only)
  getAllMilkCollections: async (params = {}) => {
    const response = await apiClient.get('/milk-collections', { params });
    return response.data;
  },

  // Get milk collection by ID (Admin only)
  getMilkCollectionById: async (id) => {
    const response = await apiClient.get(`/milk-collections/${id}`);
    return response.data;
  },

  // Update milk collection (Admin only)
  updateMilkCollection: async (id, updateData) => {
    const response = await apiClient.put(`/milk-collections/${id}`, updateData);
    return response.data;
  },

  // Delete milk collection (Admin only)
  deleteMilkCollection: async (id) => {
    const response = await apiClient.delete(`/milk-collections/${id}`);
    return response.data;
  },
};