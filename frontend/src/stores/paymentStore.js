// Payments store using Zustand
import { create } from 'zustand';
import { paymentAPI } from '../services/paymentService.js';

export const usePaymentStore = create((set, get) => ({
  // State
  payments: [],
  currentPayment: null,
  isLoading: false,
  error: null,
  totalPayments: 0,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  // Summary stats
  stats: {
    totalAmount: 0,
    pendingAmount: 0,
    paidAmount: 0,
  },

  // Actions
  fetchPayments: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await paymentAPI.getAllPayments(params);
      const { payments, pagination } = response;
      
      set({
        payments,
        pagination,
        totalPayments: pagination.total,
        isLoading: false,
        error: null,
      });
      
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to fetch payments',
      });
      throw error;
    }
  },

  fetchPaymentById: async (paymentId) => {
    set({ isLoading: true, error: null });
    try {
      const payment = await paymentAPI.getPaymentById(paymentId);
      set({
        currentPayment: payment,
        isLoading: false,
        error: null,
      });
      return payment;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to fetch payment',
      });
      throw error;
    }
  },

  createPayment: async (paymentData) => {
    set({ isLoading: true, error: null });
    try {
      const newPayment = await paymentAPI.createPayment(paymentData);
      
      // Add new payment to the list
      set((state) => ({
        payments: [newPayment, ...state.payments],
        totalPayments: state.totalPayments + 1,
        isLoading: false,
        error: null,
      }));
      
      return newPayment;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to create payment',
      });
      throw error;
    }
  },

  updatePayment: async (paymentId, paymentData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPayment = await paymentAPI.updatePayment(paymentId, paymentData);
      
      // Update payment in the list
      set((state) => ({
        payments: state.payments.map((payment) =>
          payment.id === paymentId ? updatedPayment : payment
        ),
        currentPayment: state.currentPayment?.id === paymentId ? updatedPayment : state.currentPayment,
        isLoading: false,
        error: null,
      }));
      
      return updatedPayment;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to update payment',
      });
      throw error;
    }
  },

  deletePayment: async (paymentId) => {
    set({ isLoading: true, error: null });
    try {
      await paymentAPI.deletePayment(paymentId);
      
      // Remove payment from the list
      set((state) => ({
        payments: state.payments.filter((payment) => payment.id !== paymentId),
        currentPayment: state.currentPayment?.id === paymentId ? null : state.currentPayment,
        totalPayments: state.totalPayments - 1,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to delete payment',
      });
      throw error;
    }
  },

  fetchFarmerPayments: async (farmerId, params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await paymentAPI.getFarmerPayments(farmerId, params);
      const { payments, pagination } = response;
      
      set({
        payments,
        pagination,
        totalPayments: pagination.total,
        isLoading: false,
        error: null,
      });
      
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to fetch farmer payments',
      });
      throw error;
    }
  },

  fetchPaymentStats: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const stats = await paymentAPI.getPaymentStats(params);
      
      set({
        stats,
        isLoading: false,
        error: null,
      });
      
      return stats;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to fetch payment stats',
      });
      throw error;
    }
  },

  processPayment: async (paymentId, paymentData) => {
    set({ isLoading: true, error: null });
    try {
      const processedPayment = await paymentAPI.processPayment(paymentId, paymentData);
      
      // Update payment status in the list
      set((state) => ({
        payments: state.payments.map((payment) =>
          payment.id === paymentId ? processedPayment : payment
        ),
        currentPayment: state.currentPayment?.id === paymentId ? processedPayment : state.currentPayment,
        isLoading: false,
        error: null,
      }));
      
      return processedPayment;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to process payment',
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearCurrentPayment: () => {
    set({ currentPayment: null });
  },

  // Utility functions
  getPaymentById: (paymentId) => {
    const { payments } = get();
    return payments.find((payment) => payment.id === paymentId);
  },

  getPaymentsByFarmer: (farmerId) => {
    const { payments } = get();
    return payments.filter((payment) => payment.farmerId === farmerId);
  },

  getPaymentsByStatus: (status) => {
    const { payments } = get();
    return payments.filter((payment) => payment.status === status);
  },

  getPaymentsByDateRange: (startDate, endDate) => {
    const { payments } = get();
    return payments.filter((payment) => {
      const paymentDate = new Date(payment.paymentDate);
      return paymentDate >= new Date(startDate) && paymentDate <= new Date(endDate);
    });
  },

  getPendingPayments: () => {
    return get().getPaymentsByStatus('PENDING');
  },

  getCompletedPayments: () => {
    return get().getPaymentsByStatus('COMPLETED');
  },

  getTotalAmountByFarmer: (farmerId) => {
    const farmerPayments = get().getPaymentsByFarmer(farmerId);
    return farmerPayments.reduce((total, payment) => total + payment.amount, 0);
  },

  getPendingAmountByFarmer: (farmerId) => {
    const farmerPayments = get().getPaymentsByFarmer(farmerId);
    const pendingPayments = farmerPayments.filter(payment => payment.status === 'PENDING');
    return pendingPayments.reduce((total, payment) => total + payment.amount, 0);
  },
}));