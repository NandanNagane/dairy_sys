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
      const data = await authAPI.login(credentials); // { token, user }

      // Token is stored in HTTP-only cookie by backend
      // Only store user data in state (not localStorage for security)
      set({
        user: data.user,
        token: null, // Don't store token in state, rely on cookie
        isAuthenticated: true,
      });
      return true; // success
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Invalid email or password';
      set({
        error: message,
        isAuthenticated: false,
        user: null,
        token: null,
      });
      return false; // do NOT throw; signal failure
    } finally {
      set({ isLoading: false });
    }
  },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(userData);
          const { user } = response;
          
          // Token is stored in HTTP-only cookie by backend
          set({
            user,
            token: null, // Don't store token, rely on cookie
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
          const { user } = response;
          
          // Token is stored in HTTP-only cookie by backend
          set({
            user,
            token: null, // Don't store token, rely on cookie
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

      logout: async () => {
        try {
          // Call backend to clear cookie
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear state (no localStorage to clear, using cookies only)
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
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
        // Don't persist token - it's in HTTP-only cookie
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);