// Users store using Zustand
import { create } from 'zustand';
import { userAPI } from '../services/userService.js';

export const useUserStore = create((set, get) => ({
  // State
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  totalUsers: 0,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },

  // Actions
  fetchUsers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userAPI.getAllUsers(params);
      const { users, pagination } = response;
      
      set({
        users,
        pagination,
        totalUsers: pagination.total,
        isLoading: false,
        error: null,
      });
      
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to fetch users',
      });
      throw error;
    }
  },

  fetchUserById: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const user = await userAPI.getUserById(userId);
      set({
        currentUser: user,
        isLoading: false,
        error: null,
      });
      return user;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to fetch user',
      });
      throw error;
    }
  },

  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await userAPI.createUser(userData);
      
      // Add new user to the list
      set((state) => ({
        users: [newUser, ...state.users],
        totalUsers: state.totalUsers + 1,
        isLoading: false,
        error: null,
      }));
      
      return newUser;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to create user',
      });
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await userAPI.updateUser(userId, userData);
      
      // Update user in the list
      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId ? updatedUser : user
        ),
        currentUser: state.currentUser?.id === userId ? updatedUser : state.currentUser,
        isLoading: false,
        error: null,
      }));
      
      return updatedUser;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to update user',
      });
      throw error;
    }
  },

  deleteUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      await userAPI.deleteUser(userId);
      
      // Remove user from the list
      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
        currentUser: state.currentUser?.id === userId ? null : state.currentUser,
        totalUsers: state.totalUsers - 1,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to delete user',
      });
      throw error;
    }
  },

  changeUserPassword: async (userId, passwordData) => {
    set({ isLoading: true, error: null });
    try {
      await userAPI.changePassword(userId, passwordData);
      set({
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to change password',
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearCurrentUser: () => {
    set({ currentUser: null });
  },

  // Utility functions
  getUserById: (userId) => {
    const { users } = get();
    return users.find((user) => user.id === userId);
  },

  getFarmers: () => {
    const { users } = get();
    return users.filter((user) => user.role === 'FARMER');
  },

  getAdmins: () => {
    const { users } = get();
    return users.filter((user) => user.role === 'ADMIN');
  },
}));