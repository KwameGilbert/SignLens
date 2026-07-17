import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';

export const useDashboardQuery = () => {
  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.DASHBOARD.SUMMARY);
      return data?.data || data;
    },
    staleTime: 1000 * 60 * 2, // Refresh every 2 minutes
  });
};
