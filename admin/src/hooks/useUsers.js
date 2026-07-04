import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.USERS.LIST);
      // Backend might wrap response in { success: true, data: [...] }
      return data?.data || data;
    },
  });
};

export const useUserDetailQuery = (id) => {
  return useQuery({
    queryKey: ['user-detail', id],
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.USERS.DETAIL(id));
      return data?.data || data;
    },
    enabled: !!id,
  });
};

export const useCreateAdminMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newAdmin) => {
      const { data } = await api.post(ENDPOINTS.USERS.CREATE, newAdmin);
      return data?.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUserMutation = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates) => {
      const { data } = await api.patch(ENDPOINTS.USERS.UPDATE(id), updates);
      return data?.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-detail', id] });
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(ENDPOINTS.USERS.DELETE(id));
      return data?.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
