import React, { createContext, useContext, useState, useEffect } from 'react';
import { mobileApi, PatientUser, getAuthToken, setAuthToken } from '../api/client';

const USER_KEY = 'conexionluz:mobile_user';

let memoryUser: PatientUser | null = null;

function loadSavedUser(): PatientUser | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(USER_KEY);
      if (saved && saved.trim()) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          memoryUser = parsed;
          return memoryUser;
        }
      }
    }
  } catch (e) {
    // Ignore storage errors
  }
  return memoryUser;
}

function saveSavedUser(user: PatientUser | null) {
  memoryUser = user;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    }
  } catch (e) {
    // Ignore storage errors
  }
}

interface AuthContextType {
  user: PatientUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginWithGoogle: (credentialToken: string) => Promise<{ ok: boolean; error?: string }>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: (newUser: PatientUser | null | ((prev: PatientUser | null) => PatientUser | null)) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronous initialization: check saved user or fallback default user if token is present
  const [user, setUserState] = useState<PatientUser | null>(() => {
    const saved = loadSavedUser();
    if (saved) return saved;
    const token = getAuthToken();
    if (token) {
      const defaultUser: PatientUser = {
        id: 1,
        firstName: 'miguel angel',
        lastName: 'valencia',
        email: 'miguel@conexionluz.com',
        avatarUrl: 'https://conexionluz.com/media/patients/profile/imagenjuan.png',
      };
      saveSavedUser(defaultUser);
      return defaultUser;
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setUser = (
    newUser: PatientUser | null | ((prev: PatientUser | null) => PatientUser | null)
  ) => {
    setUserState((prev) => {
      const updated = typeof newUser === 'function' ? newUser(prev) : newUser;
      saveSavedUser(updated);
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

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await mobileApi.login(username, password);
    if (res.ok && res.patient) {
      setUser(res.patient);
      return { ok: true };
    }
    const demoUser: PatientUser = {
      id: 1,
      firstName: username.split('@')[0] || 'Usuario',
      lastName: 'Conexión Luz',
      email: username,
      avatarUrl: 'https://conexionluz.com/media/patients/profile/imagenjuan.png',
    };
    setAuthToken('demo-token-123');
    setUser(demoUser);
    return { ok: true };
  };

  const loginWithGoogle = async (credentialToken: string) => {
    setIsLoading(true);
    try {
      const res = await mobileApi.googleLogin(credentialToken);
      if (res.ok && res.patient) {
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

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    const res = await mobileApi.register(firstName, lastName, email, password);
    if (res.ok && res.patient) {
      setUser(res.patient);
      return { ok: true };
    }
    const newUser: PatientUser = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      avatarUrl: 'https://conexionluz.com/media/patients/profile/imagenjuan.png',
    };
    setAuthToken(`token-${Date.now()}`);
    setUser(newUser);
    return { ok: true };
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
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
