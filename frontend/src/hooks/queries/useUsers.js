import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../../services/userService';
import { toast } from 'sonner';

// ============================================
// QUERY KEYS
// ============================================
export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  list: (filters) => [...userKeys.lists(), filters],
  details: () => [...userKeys.all, 'detail'],
  detail: (id) => [...userKeys.details(), id],
  farmers: () => [...userKeys.all, 'farmers'],
  admins: () => [...userKeys.all, 'admins'],
};

// ============================================
// QUERIES
// ============================================

/**
 * Fetch all users with pagination and filters
 */
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userAPI.getAllUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => ({
      users: data.users || [],
      pagination: data.pagination,
      totalUsers: data.pagination?.total || 0,
    }),
  });
};

/**
 * Fetch single user by ID
 */
export const useUser = (userId) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => userAPI.getUserById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch only farmers (for dropdowns, etc.)
 */
export const useFarmers = (params = {}) => {
  return useQuery({
    queryKey: userKeys.farmers(),
    queryFn: async () => {
      const response = await userAPI.getAllUsers({ ...params, role: 'FARMER' });
      return response.users || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (farmers don't change often)
  });
};

/**
 * Fetch only admins
 */
export const useAdmins = (params = {}) => {
  return useQuery({
    queryKey: userKeys.admins(),
    queryFn: async () => {
      const response = await userAPI.getAllUsers({ ...params, role: 'ADMIN' });
      return response.users || [];
    },
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// MUTATIONS
// ============================================

/**
 * Create new user (farmer/admin)
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData) => {
      console.log('📤 Creating user:', userData);
      return userAPI.createUser(userData);
    },
    
    onMutate: async (newUser) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });

      // Snapshot previous value
      const previousUsers = queryClient.getQueriesData({ 
        queryKey: userKeys.lists() 
      });

      // Optimistically update all user lists
      queryClient.setQueriesData(
        { queryKey: userKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            users: [{ ...newUser, id: 'temp-id' }, ...(old.users || [])],
            pagination: {
              ...old.pagination,
              total: (old.pagination?.total || 0) + 1,
            },
          };
        }
      );

      return { previousUsers };
    },
    
    onSuccess: (newUser) => {
      console.log('✅ User created successfully:', newUser);
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      
      // Invalidate farmers/admins lists
      if (newUser.role === 'FARMER') {
        queryClient.invalidateQueries({ queryKey: userKeys.farmers() });
      } else if (newUser.role === 'ADMIN') {
        queryClient.invalidateQueries({ queryKey: userKeys.admins() });
      }
      
      // Invalidate dashboard stats (farmer count)
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      
      toast.success(`${newUser.role === 'FARMER' ? 'Farmer' : 'User'} added successfully!`);
    },
    
    onError: (error, variables, context) => {
      console.error('❌ Failed to create user:', error);
      
      // Rollback optimistic update
      if (context?.previousUsers) {
        context.previousUsers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      
      toast.error(error.response?.data?.error || 'Failed to create user');
    },
  });
};

/**
 * Update existing user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, userData }) => {
      return userAPI.updateUser(userId, userData);
    },
    
    onSuccess: (updatedUser, variables) => {
      // Update the specific user in cache
      queryClient.setQueryData(
        userKeys.detail(variables.userId),
        updatedUser
      );
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.farmers() });
      queryClient.invalidateQueries({ queryKey: userKeys.admins() });
      
      toast.success('User updated successfully!');
    },
    
    onError: (error) => {
      console.error('❌ Failed to update user:', error);
      toast.error(error.response?.data?.error || 'Failed to update user');
    },
  });
};

/**
 * Delete user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => {
      return userAPI.deleteUser(userId);
    },
    
    onMutate: async (userId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });

      // Snapshot
      const previousUsers = queryClient.getQueriesData({ 
        queryKey: userKeys.lists() 
      });

      // Optimistically remove from all lists
      queryClient.setQueriesData(
        { queryKey: userKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            users: (old.users || []).filter((user) => user.id !== userId),
            pagination: {
              ...old.pagination,
              total: (old.pagination?.total || 0) - 1,
            },
          };
        }
      );

      return { previousUsers };
    },
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('User deleted successfully!');
    },
    
    onError: (error, variables, context) => {
      // Rollback
      if (context?.previousUsers) {
        context.previousUsers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(error.response?.data?.error || 'Failed to delete user');
    },
  });
};

/**
 * Change user password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ userId, passwordData }) => {
      return userAPI.changePassword(userId, passwordData);
    },
    
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    
    onError: (error) => {
      console.error('❌ Failed to change password:', error);
      toast.error(error.response?.data?.error || 'Failed to change password');
    },
  });
};
