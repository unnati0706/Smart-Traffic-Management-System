import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { setAuthToken } from '../../services/api/client';
import { socketManager } from '../../services/websocket/socketManager';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  hasRole: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if session token exists in session memory/storage for prototype reloads
    const savedUser = sessionStorage.getItem('stms_user');
    const savedToken = sessionStorage.getItem('stms_token');

    if (savedUser && savedToken) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setAuthToken(savedToken);
      socketManager.connect(savedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, role: UserRole = 'TRAFFIC_AUTHORITY') => {
    setIsLoading(true);
    // Simulated auth response for prototype command center access
    const mockUser: User = {
      id: 'usr-9901',
      email,
      name: email.split('@')[0].toUpperCase(),
      role,
      badgeNumber: 'AUTH-7029',
      department: 'Central Traffic Control Command',
    };
    const mockAccessToken = `mock_jwt_${Date.now()}`;

    setUser(mockUser);
    setAuthToken(mockAccessToken);
    sessionStorage.setItem('stms_user', JSON.stringify(mockUser));
    sessionStorage.setItem('stms_token', mockAccessToken);

    socketManager.connect(mockAccessToken);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    sessionStorage.removeItem('stms_user');
    sessionStorage.removeItem('stms_token');
    socketManager.disconnect();
  };

  const hasRole = (allowedRoles: UserRole[]) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
