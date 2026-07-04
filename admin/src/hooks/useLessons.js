import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';

export const useLessonsQuery = () => {
  return useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.LESSONS.LIST);
      return data?.data || data;
    },
  });
};

export const useLessonDetailQuery = (id) => {
  return useQuery({
    queryKey: ['lesson-detail', id],
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.LESSONS.DETAIL(id));
      return data?.data || data;
    },
    enabled: !!id,
  });
};

export const useCreateLessonMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newLesson) => {
      // Handles FormData for video uploads
      const { data } = await api.post(ENDPOINTS.LESSONS.CREATE, newLesson, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data?.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
};

export const useUpdateLessonMutation = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates) => {
      const { data } = await api.patch(ENDPOINTS.LESSONS.UPDATE(id), updates);
      return data?.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['lesson-detail', id] });
    },
  });
};

export const useDeleteLessonMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(ENDPOINTS.LESSONS.DELETE(id));
      return data?.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
};
