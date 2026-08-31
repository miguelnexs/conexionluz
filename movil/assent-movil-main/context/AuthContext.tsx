import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mobileApi, PatientUser, getAuthToken, setAuthToken } from '../api/client';

const USER_KEY = 'conexionluz:mobile_user';
const TOKEN_KEY = 'conexionluz:mobile_token';

interface AuthContextType {
  user: PatientUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginWithGoogle: (credentialToken: string) => Promise<{ ok: boolean; error?: string }>;
  register: (firstName: string, lastName: string, username: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: (newUser: PatientUser | null | ((prev: PatientUser | null) => PatientUser | null)) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<PatientUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize Auth State from AsyncStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (storedToken) {
          setAuthToken(storedToken);
          const storedUser = await AsyncStorage.getItem(USER_KEY);
          if (storedUser) {
            setUserState(JSON.parse(storedUser));
          }
          // Optionally refresh the user data from the server in the background
          refreshUser();
        }
      } catch (e) {
        console.error('Failed to load auth state', e);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const setUser = async (
    newUser: PatientUser | null | ((prev: PatientUser | null) => PatientUser | null)
  ) => {
    setUserState((prev) => {
      const updated = typeof newUser === 'function' ? newUser(prev) : newUser;
      if (updated) {
        AsyncStorage.setItem(USER_KEY, JSON.stringify(updated)).catch(() => {});
      } else {
        AsyncStorage.removeItem(USER_KEY).catch(() => {});
      }
      return updated;
    });
  };

  const refreshUser = async () => {
    const token = getAuthToken();
    if (token) {
      const res = await mobileApi.getMe();
      if (res.ok && res.patient) {
        setUser(res.patient);
      }
    }
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await mobileApi.login(username, password);
      if (res.ok && res.patient) {
        if (res.token) {
          await AsyncStorage.setItem(TOKEN_KEY, res.token);
        }
        setUser(res.patient);
        return { ok: true };
      }
      return { ok: false, error: res.error || 'Credenciales inválidas' };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'Error inesperado' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (credentialToken: string) => {
    setIsLoading(true);
    try {
      const res = await mobileApi.googleLogin(credentialToken);
      if (res.ok && res.patient) {
        if (res.token) {
          await AsyncStorage.setItem(TOKEN_KEY, res.token);
        }
        setUser(res.patient);
        return { ok: true };
      }
      return { ok: false, error: res.error || 'Error al iniciar sesión con Google' };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'Error inesperado con Google' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await mobileApi.register(firstName, lastName, username, email, password);
      if (res.ok && res.patient) {
        if (res.token) {
          await AsyncStorage.setItem(TOKEN_KEY, res.token);
        }
        setUser(res.patient);
        return { ok: true };
      }
      return { ok: false, error: res.error || 'Error en el registro' };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'Error inesperado' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setAuthToken(null);
    setUser(null);
    await AsyncStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshUser,
        setUser,
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
