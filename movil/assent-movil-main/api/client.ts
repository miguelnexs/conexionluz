import { Platform } from 'react-native';

let memoryToken: string | null = null;

// Dynamic Base URL detection for Expo (Physical devices, Emulators, Web)
const API_URLS = [
  'http://192.168.101.10:8001/api', // Local Wi-Fi IP (Expo Go on physical devices)
  'http://10.0.2.2:8001/api',       // Android Emulator loopback
  'http://localhost:8001/api',      // Web & iOS Simulator
  'http://127.0.0.1:8001/api',      // Localhost fallback
];

let activeBaseUrl = API_URLS[0];

export function setAuthToken(token: string | null) {
  memoryToken = token;
}

export function getAuthToken(): string | null {
  return memoryToken;
}

export interface PatientUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  profilePictureUrl?: string;
  userType?: string;
  canPublish?: boolean;
}

export interface ApiPost {
  id: string | number;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
  feeling?: string;
  image?: string;
  likesCount?: number;
  likes?: string[];
  comments?: any[];
  createdAt: string;
  isLiked?: boolean;
}

// Resilient request helper that tries candidate URLs if network connection drops
async function fetchWithFallback(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  // First try active URL
  try {
    const res = await fetch(`${activeBaseUrl}${endpoint}`, { ...options, headers });
    const data = await res.json();
    return { ok: res.ok && (data.ok !== false), data: data.data || data, error: data.error };
  } catch (err) {
    // If active URL failed, attempt candidates sequentially
    for (const baseUrl of API_URLS) {
      if (baseUrl === activeBaseUrl) continue;
      try {
        const res = await fetch(`${baseUrl}${endpoint}`, { ...options, headers });
        const data = await res.json();
        activeBaseUrl = baseUrl; // Remember working endpoint
        return { ok: res.ok && (data.ok !== false), data: data.data || data, error: data.error };
      } catch (e) {
        // Continue trying next candidate
      }
    }
    return { ok: false, error: 'No se pudo conectar con el servidor backend de Conexión Luz' };
  }
}

export const mobileApi = {
  async login(username: string, password: string) {
    const res = await fetchWithFallback('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (res.ok && res.data && res.data.token) {
      setAuthToken(res.data.token);
      return { ok: true, token: res.data.token, patient: res.data.patient };
    }
    return { ok: false, error: res.error || 'Credenciales de inicio de sesión inválidas' };
  },

  async register(firstName: string, lastName: string, email: string, password: string) {
    const res = await fetchWithFallback('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, email, username: email, password }),
    });

    if (res.ok && res.data && res.data.token) {
      setAuthToken(res.data.token);
      return { ok: true, token: res.data.token, patient: res.data.patient };
    }
    return { ok: false, error: res.error || 'No se pudo registrar la cuenta' };
  },

  async getMe() {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'No autenticado' };

    const res = await fetchWithFallback('/portal/me/');
    if (res.ok) {
      return { ok: true, patient: res.data };
    }
    return { ok: false, error: res.error || 'No autorizado' };
  },

  async fetchCommunityPosts() {
    const token = getAuthToken();
    const endpoint = token ? '/portal/community-posts/' : '/public/community-posts/';
    const res = await fetchWithFallback(endpoint);

    if (res.ok && Array.isArray(res.data)) {
      return { ok: true, data: res.data };
    }
    return { ok: false, error: res.error || 'Error al obtener publicaciones' };
  },

  async createCommunityPost(content: string, feeling?: string, imageUrl?: string) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para publicar.' };

    const res = await fetchWithFallback('/portal/community-posts/', {
      method: 'POST',
      body: JSON.stringify({ content, feeling, imageUrl }),
    });

    if (res.ok) {
      return { ok: true, data: res.data };
    }
    return { ok: false, error: res.error || 'Error al publicar en el servidor' };
  },

  async likeCommunityPost(postId: string | number) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para iluminar.' };

    const res = await fetchWithFallback(`/portal/community-posts/${postId}/like/`, {
      method: 'POST',
    });
    return res;
  },

  async commentCommunityPost(postId: string | number, content: string) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para comentar.' };

    const res = await fetchWithFallback(`/portal/community-posts/${postId}/comment/`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return res;
  },
};
