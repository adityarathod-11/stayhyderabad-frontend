import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { UserProfile, AuthResponse, Role } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<AuthResponse>;
  register: (data: { fullName: string; email: string; phone: string; password: string; role?: Role }) => Promise<AuthResponse>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  isUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('stayhyderabad_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('stayhyderabad_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('auth-logout', handleLogout);
    return () => window.removeEventListener('auth-logout', handleLogout);
  }, []);

  const refreshProfile = async () => {
    const currentToken = localStorage.getItem('stayhyderabad_token');
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get<UserProfile>('/auth/me');
      setUser(res.data);
      localStorage.setItem('stayhyderabad_user', JSON.stringify(res.data));
    } catch {
      localStorage.removeItem('stayhyderabad_token');
      localStorage.removeItem('stayhyderabad_user');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (email: string, pass: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password: pass });
    const authData = res.data;
    localStorage.setItem('stayhyderabad_token', authData.token);
    setToken(authData.token);
    await refreshProfile();
    return authData;
  };

  const register = async (data: { fullName: string; email: string; phone: string; password: string; role?: Role }): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    const authData = res.data;
    localStorage.setItem('stayhyderabad_token', authData.token);
    setToken(authData.token);
    await refreshProfile();
    return authData;
  };

  const logout = () => {
    localStorage.removeItem('stayhyderabad_token');
    localStorage.removeItem('stayhyderabad_user');
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!user && !!token;
  const isOwner = user?.role === 'ROLE_OWNER';
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isUser = user?.role === 'ROLE_USER';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        isAuthenticated,
        isOwner,
        isAdmin,
        isUser,
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
