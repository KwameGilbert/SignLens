import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
      return data;
    },
    onSuccess: (response) => {
      // The backend wraps the payload in a 'data' object.
      // E.g., { success: true, data: { token: '...', user: {...} } }
      const payload = response?.data || response;
      const token = payload?.token;
      
      if (token) {
        localStorage.setItem('token', token);
      } else {
        console.warn("Token not found in login response!");
      }
      
      // Seed the query cache with the user data
      if (payload?.user) {
        queryClient.setQueryData(['user'], payload.user);
      }
    },
  });

  // Fetch Current Profile
  const profileQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.AUTH.PROFILE);
      return data;
    },
    // Only run this query if we have a token
    enabled: !!localStorage.getItem('token'),
  });

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    queryClient.removeQueries({ queryKey: ['user'] });
    // api.post(ENDPOINTS.AUTH.LOGOUT); // Call if backend requires it
    window.location.href = '/login'; // Force redirect and clear state
  };

  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    
    user: profileQuery.data,
    isLoadingProfile: profileQuery.isLoading,
    profileError: profileQuery.error,

    logout,
    isAuthenticated: !!localStorage.getItem('token'),
  };
};
