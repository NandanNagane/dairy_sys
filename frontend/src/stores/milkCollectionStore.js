// Milk Collections store using Zustand
import { create } from 'zustand';
import { milkCollectionAPI } from '../services/milkCollectionService.js';

export const useMilkCollectionStore = create((set, get) => ({
  // State
  collections: [],
  currentCollection: null,
  isLoading: false,
  error: null,
  totalCollections: 0,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  // Summary stats
  stats: {
    totalQuantity: 0,
    averageQuality: 0,
    totalValue: 0,
  },

  // Actions
  fetchCollections: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await milkCollectionAPI.getAllCollections(params);
      const { collections, pagination } = response;
      
      set({
        collections,
        pagination,
        totalCollections: pagination.total,
        isLoading: false,
        error: null,
      });
      
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to fetch collections',
      });
      throw error;
    }
  },

  fetchCollectionById: async (collectionId) => {
    set({ isLoading: true, error: null });
    try {
      const collection = await milkCollectionAPI.getCollectionById(collectionId);
      set({
        currentCollection: collection,
        isLoading: false,
        error: null,
      });
      return collection;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to fetch collection',
      });
      throw error;
    }
  },

  createCollection: async (collectionData) => {
    set({ isLoading: true, error: null });
    try {
      const newCollection = await milkCollectionAPI.createCollection(collectionData);
      
      // Add new collection to the list
      set((state) => ({
        collections: [newCollection, ...state.collections],
        totalCollections: state.totalCollections + 1,
        isLoading: false,
        error: null,
      }));
      
      return newCollection;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to create collection',
      });
      throw error;
    }
  },

  updateCollection: async (collectionId, collectionData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCollection = await milkCollectionAPI.updateCollection(collectionId, collectionData);
      
      // Update collection in the list
      set((state) => ({
        collections: state.collections.map((collection) =>
          collection.id === collectionId ? updatedCollection : collection
        ),
        currentCollection: state.currentCollection?.id === collectionId ? updatedCollection : state.currentCollection,
        isLoading: false,
        error: null,
      }));
      
      return updatedCollection;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to update collection',
      });
      throw error;
    }
  },

  deleteCollection: async (collectionId) => {
    set({ isLoading: true, error: null });
    try {
      await milkCollectionAPI.deleteCollection(collectionId);
      
      // Remove collection from the list
      set((state) => ({
        collections: state.collections.filter((collection) => collection.id !== collectionId),
        currentCollection: state.currentCollection?.id === collectionId ? null : state.currentCollection,
        totalCollections: state.totalCollections - 1,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to delete collection',
      });
      throw error;
    }
  },

  fetchFarmerCollections: async (farmerId, params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await milkCollectionAPI.getFarmerCollections(farmerId, params);
      const { collections, pagination } = response;
      
      set({
        collections,
        pagination,
        totalCollections: pagination.total,
        isLoading: false,
        error: null,
      });
      
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to fetch farmer collections',
      });
      throw error;
    }
  },

  fetchCollectionStats: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const stats = await milkCollectionAPI.getCollectionStats(params);
      
      set({
        stats,
        isLoading: false,
        error: null,
      });
      
      return stats;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error || 'Failed to fetch collection stats',
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearCurrentCollection: () => {
    set({ currentCollection: null });
  },

  // Utility functions
  getCollectionById: (collectionId) => {
    const { collections } = get();
    return collections.find((collection) => collection.id === collectionId);
  },

  getCollectionsByFarmer: (farmerId) => {
    const { collections } = get();
    return collections.filter((collection) => collection.farmerId === farmerId);
  },

  getCollectionsByDateRange: (startDate, endDate) => {
    const { collections } = get();
    return collections.filter((collection) => {
      const collectionDate = new Date(collection.collectionDate);
      return collectionDate >= new Date(startDate) && collectionDate <= new Date(endDate);
    });
  },

  getTotalQuantityByFarmer: (farmerId) => {
    const farmerCollections = get().getCollectionsByFarmer(farmerId);
    return farmerCollections.reduce((total, collection) => total + collection.quantity, 0);
  },

  getAverageQualityByFarmer: (farmerId) => {
    const farmerCollections = get().getCollectionsByFarmer(farmerId);
    if (farmerCollections.length === 0) return 0;
    
    const totalQuality = farmerCollections.reduce((total, collection) => total + collection.qualityScore, 0);
    return totalQuality / farmerCollections.length;
  },
}));