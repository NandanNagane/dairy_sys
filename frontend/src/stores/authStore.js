// Authentication store using Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/authService.js';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,    //. here we changed and made it true by default
      isLoading: false,
      error: null,
     

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          const { user, token } = response;
          
          // Store token in localStorage for API interceptor
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.error || 'Login failed',
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(userData);
          const { user, token } = response;
          
          // Store token in localStorage for API interceptor
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.error || 'Registration failed',
          });
          throw error;
        }
      },

      initializeAdmin: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.initializeAdmin(userData);
          const { user, token } = response;
          
          // Store token in localStorage for API interceptor
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.error || 'Admin initialization failed',
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

    //   Check if user is admin
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'ADMIN';
      },
   

    //   Check if user is farmer
      isFarmer: () => {
        const { user } = get();
        return user?.role === 'FARMER';
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
     
    }),
})
);