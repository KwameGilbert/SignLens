import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';

export const useTranslationsQuery = () => {
  return useQuery({
    queryKey: ['translations'],
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.TRANSLATIONS.LIST);
      return data?.data || data;
    },
  });
};
