// Expenses store using Zustand
import { create } from 'zustand';
import { expenseAPI } from '../services/expenseService.js';

export const useExpenseStore = create((set, get) => ({
  // State
  expenses: [],
  currentExpense: null,
  isLoading: false,
  error: null,
  totalExpenses: 0,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  // Summary stats
  stats: {
    totalAmount: 0,
    byCategory: {},
    monthlyTotal: 0,
  },

  // Actions
  fetchExpenses: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await expenseAPI.getAllExpenses(params);
      const { expenses, pagination } = response;
      
      set({
        expenses,
        pagination,
        totalExpenses: pagination.total,
        isLoading: false,
        error: null,
      });
      
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to fetch expenses',
      });
      throw error;
    }
  },

  fetchExpenseById: async (expenseId) => {
    set({ isLoading: true, error: null });
    try {
      const expense = await expenseAPI.getExpenseById(expenseId);
      set({
        currentExpense: expense,
        isLoading: false,
        error: null,
      });
      return expense;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to fetch expense',
      });
      throw error;
    }
  },

  createExpense: async (expenseData) => {
    set({ isLoading: true, error: null });
    try {
      const newExpense = await expenseAPI.createExpense(expenseData);
      
      // Add new expense to the list
      set((state) => ({
        expenses: [newExpense, ...state.expenses],
        totalExpenses: state.totalExpenses + 1,
        isLoading: false,
        error: null,
      }));
      
      return newExpense;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to create expense',
      });
      throw error;
    }
  },

  updateExpense: async (expenseId, expenseData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedExpense = await expenseAPI.updateExpense(expenseId, expenseData);
      
      // Update expense in the list
      set((state) => ({
        expenses: state.expenses.map((expense) =>
          expense.id === expenseId ? updatedExpense : expense
        ),
        currentExpense: state.currentExpense?.id === expenseId ? updatedExpense : state.currentExpense,
        isLoading: false,
        error: null,
      }));
      
      return updatedExpense;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to update expense',
      });
      throw error;
    }
  },

  deleteExpense: async (expenseId) => {
    set({ isLoading: true, error: null });
    try {
      await expenseAPI.deleteExpense(expenseId);
      
      // Remove expense from the list
      set((state) => ({
        expenses: state.expenses.filter((expense) => expense.id !== expenseId),
        currentExpense: state.currentExpense?.id === expenseId ? null : state.currentExpense,
        totalExpenses: state.totalExpenses - 1,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to delete expense',
      });
      throw error;
    }
  },

  fetchExpenseStats: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const stats = await expenseAPI.getExpenseStats(params);
      
      set({
        stats,
        isLoading: false,
        error: null,
      });
      
      return stats;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to fetch expense stats',
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearCurrentExpense: () => {
    set({ currentExpense: null });
  },

  // Utility functions
  getExpenseById: (expenseId) => {
    const { expenses } = get();
    return expenses.find((expense) => expense.id === expenseId);
  },

  getExpensesByCategory: (category) => {
    const { expenses } = get();
    return expenses.filter((expense) => expense.category === category);
  },

  getExpensesByDateRange: (startDate, endDate) => {
    const { expenses } = get();
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
    });
  },

  getTotalAmountByCategory: (category) => {
    const categoryExpenses = get().getExpensesByCategory(category);
    return categoryExpenses.reduce((total, expense) => total + expense.amount, 0);
  },

  getMonthlyExpenses: (month, year) => {
    const { expenses } = get();
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
    });
  },

  getMonthlyTotal: (month, year) => {
    const monthlyExpenses = get().getMonthlyExpenses(month, year);
    return monthlyExpenses.reduce((total, expense) => total + expense.amount, 0);
  },

  getCategoryBreakdown: () => {
    const { expenses } = get();
    const breakdown = {};
    
    expenses.forEach((expense) => {
      const category = expense.category;
      if (!breakdown[category]) {
        breakdown[category] = {
          total: 0,
          count: 0,
          percentage: 0,
        };
      }
      breakdown[category].total += expense.amount;
      breakdown[category].count += 1;
    });

    const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
    
    Object.keys(breakdown).forEach((category) => {
      breakdown[category].percentage = totalAmount > 0 
        ? (breakdown[category].total / totalAmount) * 100 
        : 0;
    });

    return breakdown;
  },

  // Common expense categories
  getExpenseCategories: () => {
    return [
      'FEED',
      'MEDICINE',
      'EQUIPMENT',
      'MAINTENANCE',
      'TRANSPORTATION',
      'UTILITIES',
      'LABOR',
      'INSURANCE',
      'OTHER',
    ];
  },
}));