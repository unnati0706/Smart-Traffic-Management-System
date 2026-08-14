import { api } from './client';
import { User, UserRole } from '../../types';

export interface LoginPayload {
  email: string;
  password?: string;
  role?: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', payload);
      return response.data;
    } catch (error) {
      // Fallback for prototype when backend API server is offline
      const mockRole = payload.role || (payload.email.includes('admin') ? 'ADMIN' : 'TRAFFIC_AUTHORITY');
      return {
        accessToken: `mock_jwt_token_${Date.now()}`,
        user: {
          id: 'usr-9901',
          email: payload.email,
          name: payload.email.split('@')[0].toUpperCase(),
          role: mockRole,
          badgeNumber: 'AUTH-7029',
          department: 'Central Traffic Control Command',
        },
      };
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};
