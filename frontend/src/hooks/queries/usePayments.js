import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentAPI } from '../../services/paymentService';
import { toast } from 'sonner';

// ============================================
// QUERY KEYS
// ============================================
export const paymentKeys = {
  all: ['payments'],
  lists: () => [...paymentKeys.all, 'list'],
  list: (filters) => [...paymentKeys.lists(), filters],
  details: () => [...paymentKeys.all, 'detail'],
  detail: (id) => [...paymentKeys.details(), id],
  farmer: (farmerId) => [...paymentKeys.all, 'farmer', farmerId],
  stats: () => [...paymentKeys.all, 'stats'],
  pending: () => [...paymentKeys.all, 'pending'],
  completed: () => [...paymentKeys.all, 'completed'],
};

// ============================================
// QUERIES
// ============================================

/**
 * Fetch all payments
 */
export const usePayments = (params = {}) => {
  return useQuery({
    queryKey: paymentKeys.list(params),
    queryFn: () => paymentAPI.getAllPayments(params),
    staleTime: 2 * 60 * 1000,
    select: (data) => ({
      payments: data.payments || [],
      pagination: data.pagination,
      totalPayments: data.pagination?.total || 0,
    }),
  });
};

/**
 * Fetch single payment
 */
export const usePayment = (paymentId) => {
  return useQuery({
    queryKey: paymentKeys.detail(paymentId),
    queryFn: () => paymentAPI.getPaymentById(paymentId),
    enabled: !!paymentId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch farmer's payments
 */
export const useFarmerPayments = (farmerId, params = {}) => {
  return useQuery({
    queryKey: paymentKeys.farmer(farmerId),
    queryFn: () => paymentAPI.getFarmerPayments(farmerId, params),
    enabled: !!farmerId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch payment statistics
 */
export const usePaymentStats = (params = {}) => {
  return useQuery({
    queryKey: [...paymentKeys.stats(), params],
    queryFn: () => paymentAPI.getPaymentStats(params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch pending payments
 */
export const usePendingPayments = (params = {}) => {
  return useQuery({
    queryKey: paymentKeys.pending(),
    queryFn: () => paymentAPI.getAllPayments({ ...params, status: 'PENDING' }),
    staleTime: 2 * 60 * 1000,
    select: (data) => data.payments || [],
  });
};

// ============================================
// MUTATIONS
// ============================================

/**
 * Create new payment
 */
export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentData) => paymentAPI.createPayment(paymentData),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Payment created successfully!');
    },
    
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create payment');
    },
  });
};

/**
 * Update payment
 */
export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, paymentData }) => 
      paymentAPI.updatePayment(paymentId, paymentData),
    
    onSuccess: (updatedPayment, variables) => {
      queryClient.setQueryData(
        paymentKeys.detail(variables.paymentId),
        updatedPayment
      );
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      toast.success('Payment updated successfully!');
    },
    
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update payment');
    },
  });
};

/**
 * Process payment (mark as completed)
 */
export const useProcessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, paymentData }) => 
      paymentAPI.processPayment(paymentId, paymentData),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Payment processed successfully!');
    },
    
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to process payment');
    },
  });
};

/**
 * Delete payment
 */
export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId) => paymentAPI.deletePayment(paymentId),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Payment deleted successfully!');
    },
    
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete payment');
    },
  });
};
