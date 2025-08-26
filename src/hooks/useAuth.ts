import { useState, useEffect } from 'react';
import type { User, RegisterData } from '../types';
import { apiClient } from '../services/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('goat-auth-token');
      if (token) {
        try {
          const response = await apiClient.verifyToken();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Invalid token, remove it
            localStorage.removeItem('goat-auth-token');
          }
        } catch {
          // Token verification failed, remove it
          localStorage.removeItem('goat-auth-token');
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.login({ email, password });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return true;
      } else {
        setError(response.message || 'Login failed');
        return false;
      }
    } catch (err: unknown) {
      setError(err.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.register(userData);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return true;
      } else {
        setError(response.message || 'Registration failed');
        return false;
      }
    } catch (err: unknown) {
      setError(err.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  const updateProfile = async (data: { name?: string; phone?: string }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.updateProfile(data);
      
      if (response.success && response.data) {
        setUser(response.data);
        return true;
      } else {
        setError(response.message || 'Profile update failed');
        return false;
      }
    } catch (err: unknown) {
      setError(err.message || 'Profile update failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.changePassword({ currentPassword, newPassword });
      
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Password change failed');
        return false;
      }
    } catch (err: unknown) {
      setError(err.message || 'Password change failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    isLoading: isLoading || !isInitialized,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };
}