import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';

export const useActivityLogsQuery = () => {
  return useQuery({
    queryKey: ['activity-logs'],
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.ACTIVITY_LOGS.LIST);
      return data?.data || data;
    },
  });
};
