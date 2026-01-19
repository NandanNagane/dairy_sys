import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseAPI } from '../../services/expenseService';
import { toast } from 'sonner';

// ============================================
// QUERY KEYS
// ============================================
export const expenseKeys = {
  all: ['expenses'],
  lists: () => [...expenseKeys.all, 'list'],
  list: (filters) => [...expenseKeys.lists(), filters],
  details: () => [...expenseKeys.all, 'detail'],
  detail: (id) => [...expenseKeys.details(), id],
  stats: () => [...expenseKeys.all, 'stats'],
  category: (category) => [...expenseKeys.all, 'category', category],
};

// ============================================
// QUERIES
// ============================================

/**
 * Fetch all expenses
 */
export const useExpenses = (params = {}) => {
  return useQuery({
    queryKey: expenseKeys.list(params),
    queryFn: () => expenseAPI.getAllExpenses(params),
    staleTime: 2 * 60 * 1000,
    select: (data) => ({
      expenses: data.expenses || [],
      pagination: data.pagination,
      totalExpenses: data.pagination?.total || 0,
    }),
  });
};

/**
 * Fetch single expense
 */
export const useExpense = (expenseId) => {
  return useQuery({
    queryKey: expenseKeys.detail(expenseId),
    queryFn: () => expenseAPI.getExpenseById(expenseId),
    enabled: !!expenseId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch expense statistics
 */
export const useExpenseStats = (params = {}) => {
  return useQuery({
    queryKey: [...expenseKeys.stats(), params],
    queryFn: () => expenseAPI.getExpenseStats(params),
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// MUTATIONS
// ============================================

/**
 * Create new expense
 */
export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseData) => expenseAPI.createExpense(expenseData),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      toast.success('Expense created successfully!');
    },
    
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create expense');
    },
  });
};

/**
 * Update expense
 */
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ expenseId, expenseData }) => 
      expenseAPI.updateExpense(expenseId, expenseData),
    
    onSuccess: (updatedExpense, variables) => {
      queryClient.setQueryData(
        expenseKeys.detail(variables.expenseId),
        updatedExpense
      );
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      toast.success('Expense updated successfully!');
    },
    
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update expense');
    },
  });
};

/**
 * Delete expense
 */
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseId) => expenseAPI.deleteExpense(expenseId),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      toast.success('Expense deleted successfully!');
    },
    
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete expense');
    },
  });
};
