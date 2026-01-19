import { create } from 'zustand';

/**
 * UI Store - For client-only UI state
 * (dialogs, sidebars, themes, etc.)
 */
export const useUIStore = create((set) => ({
  // Dialog states

  // Sidebar state

  // Theme
  theme: 'light',
  
  // Active filters (if needed)
  filters: {},
  
  // Actions
  setTheme: (theme) => set({ theme }),
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
}));
