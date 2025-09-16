// Expense management API services
import apiClient from '../lib/api.js';

export const expenseAPI = {
  // Create expense (Admin only)
  createExpense: async (expenseData) => {
    const response = await apiClient.post('/expenses', expenseData);
    return response.data;
  },

  // Get all expenses (Admin only)
  getAllExpenses: async (params = {}) => {
    const response = await apiClient.get('/expenses', { params });
    return response.data;
  },

  // Get expense by ID (Admin only)
  getExpenseById: async (id) => {
    const response = await apiClient.get(`/expenses/${id}`);
    return response.data;
  },

  // Update expense (Admin only)
  updateExpense: async (id, updateData) => {
    const response = await apiClient.put(`/expenses/${id}`, updateData);
    return response.data;
  },

  // Delete expense (Admin only)
  deleteExpense: async (id) => {
    const response = await apiClient.delete(`/expenses/${id}`);
    return response.data;
  },
};