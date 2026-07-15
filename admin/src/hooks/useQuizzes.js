import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';

export const useQuizzesQuery = () => {
  return useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.QUIZZES.LIST);
      return data?.data || data;
    },
  });
};

export const useQuizDetailQuery = (id) => {
  return useQuery({
    queryKey: ['quiz-detail', id],
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.QUIZZES.DETAIL(id));
      return data?.data || data;
    },
    enabled: !!id,
  });
};

export const useCreateQuizMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newQuiz) => {
      const { data } = await api.post(ENDPOINTS.QUIZZES.CREATE, newQuiz);
      return data?.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};

export const useUpdateQuizMutation = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates) => {
      const { data } = await api.patch(ENDPOINTS.QUIZZES.UPDATE(id), updates);
      return data?.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quiz-detail', id] });
    },
  });
};

export const useDeleteQuizMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(ENDPOINTS.QUIZZES.DELETE(id));
      return data?.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};
