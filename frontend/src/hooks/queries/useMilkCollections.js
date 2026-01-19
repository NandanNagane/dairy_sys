import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { milkCollectionAPI } from '../../services/milkCollectionService';
import { reportAPI } from '../../services/reportService';
import { toast } from 'sonner';

// ============================================
// QUERY KEYS (centralized)
// ============================================
export const milkCollectionKeys = {
  all: ['milkCollections'],
  lists: () => [...milkCollectionKeys.all, 'list'],
  list: (filters) => [...milkCollectionKeys.lists(), filters],
  details: () => [...milkCollectionKeys.all, 'detail'],
  detail: (id) => [...milkCollectionKeys.details(), id],
  farmer: (farmerId) => [...milkCollectionKeys.all, 'farmer', farmerId],
  stats: () => [...milkCollectionKeys.all, 'stats'],
  dashboardStats: () => ['dashboardStats'],
};

// ============================================
// QUERIES
// ============================================

/**
 * Fetch all milk collections with pagination
 * @param {Object} params - Query parameters (page, limit, filters)
 */
export const useMilkCollections = (params = {}) => {
  return useQuery({
    queryKey: milkCollectionKeys.list(params),
    queryFn: () => milkCollectionAPI.getAllMilkCollections(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => ({
      collections: data.milkCollections || [],
      summary: data.summary,
      pagination: data.pagination,
      totalCollections: data.pagination?.totalCount || 0,
    }),
  });
};

/**
 * Fetch single milk collection by ID
 * @param {string} collectionId - Collection ID
 */
export const useMilkCollection = (collectionId) => {
  return useQuery({
    queryKey: milkCollectionKeys.detail(collectionId),
    queryFn: () => milkCollectionAPI.getCollectionById(collectionId),
    enabled: !!collectionId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch farmer's milk collections
 * @param {string} farmerId - Farmer ID
 * @param {Object} params - Query parameters
 */
export const useFarmerCollections = (farmerId, params = {}) => {
  return useQuery({
    queryKey: milkCollectionKeys.farmer(farmerId),
    queryFn: () => milkCollectionAPI.getFarmerCollections(farmerId, params),
    enabled: !!farmerId,
    staleTime: 5 * 60 * 1000,
    select: (data) => ({
      collections: data.milkCollections || [],
      summary: data.summary,
      pagination: data.pagination,
    }),
  });
};

/**
 * Fetch dashboard statistics
 * Auto-refreshes every 60 seconds
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: milkCollectionKeys.dashboardStats(),
    queryFn: async () => {
      const data = await reportAPI.getDashboardStats();
      
      // Transform the data
      return {
        totalMilk: data.totalMilkToday || 0,
        percentageChange: data.percentageChange || 0,
        avgFat: data.avgFatContent || 0,
        avgSNF: data.avgSnf || 0,
        payoutDue: data.payoutDue || 0,
        farmerCount: data.farmerCount || 0,
        // Mock data for features not yet implemented
        lowStock: 3,
        deviceStatus: { online: 8, offline: 2 },
        alerts: 5,
        todayCollections: data.totalMilkToday || 0,
        activeDevices: 8,
      };
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Auto-refetch every 60 seconds
    refetchOnWindowFocus: true,
  });
};

/**
 * Fetch collection statistics
 * @param {Object} params - Filter parameters (dateRange, etc.)
 */
export const useCollectionStats = (params = {}) => {
  return useQuery({
    queryKey: [...milkCollectionKeys.stats(), params],
    queryFn: () => milkCollectionAPI.getCollectionStats(params),
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// MUTATIONS
// ============================================

/**
 * Create new milk collection with optimistic update
 */
export const useCreateMilkCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionData) => {
      return milkCollectionAPI.createMilkCollection(collectionData);
    },
    
    // Optimistic update
    onMutate: async (newCollection) => {
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: milkCollectionKeys.dashboardStats() 
      });

      // Snapshot the previous value
      const previousStats = queryClient.getQueryData(
        milkCollectionKeys.dashboardStats()
      );

      // Optimistically update dashboard stats
      if (previousStats) {
        queryClient.setQueryData(
          milkCollectionKeys.dashboardStats(),
          (old) => {
            const collectionCount = 1; // Simplified - in reality track this
            const newTotalMilk = old.totalMilk + newCollection.quantity;
            
            return {
              ...old,
              totalMilk: newTotalMilk,
              todayCollections: newTotalMilk,
              avgFat: ((old.avgFat * collectionCount) + newCollection.fat) / (collectionCount + 1),
              avgSNF: ((old.avgSNF * collectionCount) + (newCollection.snf || 8.5)) / (collectionCount + 1),
            };
          }
        );
      }

      // Return context with snapshot
      return { previousStats };
    },
    
    onSuccess: (data) => {
      // Refetch dashboard stats in background (no loading state)
      queryClient.invalidateQueries({ 
        queryKey: milkCollectionKeys.dashboardStats(),
        refetchType: 'active' // Only refetch active queries
      });
      
      // Invalidate collections lists
      queryClient.invalidateQueries({ 
        queryKey: milkCollectionKeys.lists() 
      });
      
      toast.success('Milk collection recorded successfully!');
    },
    
    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (context?.previousStats) {
        queryClient.setQueryData(
          milkCollectionKeys.dashboardStats(),
          context.previousStats
        );
      }
      
      toast.error(
        error.response?.data?.error || 'Failed to record milk collection'
      );
    },
  });
};

/**
 * Update existing milk collection
 */
export const useUpdateMilkCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, collectionData }) => {
      return milkCollectionAPI.updateCollection(collectionId, collectionData);
    },
    
    onSuccess: (updatedCollection, variables) => {
      // Update the specific collection in cache
      queryClient.setQueryData(
        milkCollectionKeys.detail(variables.collectionId),
        updatedCollection
      );
      
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ 
        queryKey: milkCollectionKeys.lists() 
      });
      
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ 
        queryKey: milkCollectionKeys.dashboardStats() 
      });
      
      toast.success('Collection updated successfully!');
    },
    
    onError: (error) => {
      toast.error(
        error.response?.data?.error || 'Failed to update collection'
      );
    },
  });
};

/**
 * Delete milk collection
 */
export const useDeleteMilkCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionId) => {
      return milkCollectionAPI.deleteCollection(collectionId);
    },
    
    onMutate: async (collectionId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: milkCollectionKeys.lists() 
      });

      // Snapshot previous value
      const previousCollections = queryClient.getQueriesData({ 
        queryKey: milkCollectionKeys.lists() 
      });

      // Optimistically remove from all list queries
      queryClient.setQueriesData(
        { queryKey: milkCollectionKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            collections: (old.collections || []).filter(
              (collection) => collection.id !== collectionId
            ),
            pagination: {
              ...old.pagination,
              total: (old.pagination?.total || 0) - 1,
            },
          };
        }
      );

      return { previousCollections };
    },
    
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: milkCollectionKeys.all 
      });
      queryClient.invalidateQueries({ 
        queryKey: milkCollectionKeys.dashboardStats() 
      });
      toast.success('Collection deleted successfully!');
    },
    
    onError: (error, variables, context) => {
      // Rollback
      if (context?.previousCollections) {
        context.previousCollections.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(
        error.response?.data?.error || 'Failed to delete collection'
      );
    },
  });
};
