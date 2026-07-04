import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.CATEGORIES.LIST);
      return data?.data || data;
    },
  });
};

export const useCategoryDetailQuery = (id) => {
  return useQuery({
    queryKey: ['category-detail', id],
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.CATEGORIES.DETAIL(id));
      return data?.data || data;
    },
    enabled: !!id,
  });
};

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCategory) => {
      const { data } = await api.post(ENDPOINTS.CATEGORIES.CREATE, newCategory);
      return data?.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategoryMutation = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates) => {
      const { data } = await api.patch(ENDPOINTS.CATEGORIES.UPDATE(id), updates);
      return data?.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category-detail', id] });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(ENDPOINTS.CATEGORIES.DELETE(id));
      return data?.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
