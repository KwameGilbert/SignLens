import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';

export const useSettingsQuery = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.SETTINGS.LIST);
      return data?.data || data;
    },
  });
};

export const useUpdateSettingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }) => {
      const { data } = await api.put(ENDPOINTS.SETTINGS.UPDATE(key), { value });
      return data?.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};
