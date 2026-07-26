import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';
import toast from 'react-hot-toast';

export const ADMIN_KEYS = {
  all: ['admin'] as const,
  stats: () => [...ADMIN_KEYS.all, 'stats'] as const,
  users: (page: number, search: string) => [...ADMIN_KEYS.all, 'users', page, search] as const,
  resources: (page: number, search: string) => [...ADMIN_KEYS.all, 'resources', page, search] as const,
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ADMIN_KEYS.stats(),
    queryFn: () => adminApi.getDashboardStats(),
  });
};

export const useUsers = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: ADMIN_KEYS.users(page, search),
    queryFn: () => adminApi.getUsers(page, limit, search),
    placeholderData: (prev) => prev, // keeps previous data while loading next page
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string, status: 'ACTIVE' | 'SUSPENDED' }) => adminApi.updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ADMIN_KEYS.all, 'users'] });
      toast.success('User status updated');
    },
    onError: () => toast.error('Failed to update user status')
  });
};

export const useResources = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: ADMIN_KEYS.resources(page, search),
    queryFn: () => adminApi.getResources(page, limit, search),
    placeholderData: (prev) => prev,
  });
};

export const useUpdateResourceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string, status: any }) => adminApi.updateResourceStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ADMIN_KEYS.all, 'resources'] });
      toast.success('Resource status updated');
    },
    onError: () => toast.error('Failed to update resource')
  });
};
