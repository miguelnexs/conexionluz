import { Platform } from 'react-native';
import Constants from 'expo-constants';

let memoryToken: string | null = null;

const TOKEN_KEY = 'conexionluz:mobile_token';

// Persistent token initialization for Web & Mobile
function loadSavedToken(): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(TOKEN_KEY);
    }
  } catch (e) {
    // Ignore storage errors
  }
  return memoryToken;
}

function saveToken(token: string | null) {
  memoryToken = token;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  } catch (e) {
    // Ignore storage errors
  }
}

// Initial attempt to load token from storage
memoryToken = loadSavedToken();

export function setAuthToken(token: string | null) {
  saveToken(token);
}

export function getAuthToken(): string | null {
  if (!memoryToken) {
    memoryToken = loadSavedToken();
  }
  return memoryToken;
}

let memoryClientId: string | null = null;
const CLIENT_ID_KEY = 'conexionluz:mobile_client_id';

export function getClientId(): string {
  if (memoryClientId) return memoryClientId;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(CLIENT_ID_KEY);
      if (saved && saved.trim()) {
        memoryClientId = saved.trim();
        return memoryClientId;
      }
    }
  } catch (e) {}

  const id = `mobile_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
  memoryClientId = id;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(CLIENT_ID_KEY, id);
    }
  } catch (e) {}
  return id;
}

// Dynamic Base URL detection for Expo (Physical devices via Expo Go, Emulators, Web)
const debuggerHost =
  Constants.expoConfig?.hostUri ||
  (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ||
  (Constants as any).manifest?.debuggerHost;

const rawHostIp = debuggerHost ? debuggerHost.split(':')[0] : null;
const hostIp = (rawHostIp && !rawHostIp.includes('exp.direct')) ? rawHostIp : null;

// Primary Production URL for Server API: https://conexionluz.com/api
const PROD_API_URL = 'https://conexionluz.com/api';

const rawUrls = [
  PROD_API_URL,                     // Primary Server API
  'http://192.168.101.8:8000/api',  // Host LAN IP (Port 8000)
  ...(hostIp ? [`http://${hostIp}:8000/api`] : []),
  'http://10.0.2.2:8000/api',       // Android Emulator loopback
  'http://localhost:8000/api',      // Web & iOS Simulator
  'http://127.0.0.1:8000/api',      // Localhost fallback
];

const API_URLS: string[] = Array.from(new Set(rawUrls));
let activeBaseUrl = API_URLS[0];

export function getActiveBaseUrl(): string {
  return activeBaseUrl;
}

export function getAllCandidateUrls(): string[] {
  return API_URLS;
}

export function normalizeMediaUrl(url?: string | null): string | undefined {
  if (!url || typeof url !== 'string') return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  const rootDomain = activeBaseUrl.replace(/\/api\/?$/, '');
  return `${rootDomain}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
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
  perfilArbol?: string;
  igaScore?: number;
  bio?: string;
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

// Resilient fetch helper with Promise.race timeout (avoids AbortController RN bugs)
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 7000): Promise<Response> {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timeout (${timeoutMs}ms)`)), timeoutMs);
  });

  try {
    const response = await Promise.race([fetch(url, options), timeoutPromise]);
    clearTimeout(timer);
    return response;
  } catch (error) {
    clearTimeout(timer);
    throw error;
  }
}

// Resilient request helper that tries candidate URLs if network connection fails
async function fetchWithFallback(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = getAuthToken();
  const clientId = getClientId();
  const headers = {
    'Content-Type': 'application/json',
    'X-Client-Id': clientId,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const errors: string[] = [];

  // Try active URL first (defaults to https://conexionluz.com/api)
  try {
    const fullUrl = `${activeBaseUrl}${endpoint}`;
    console.log(`[API Mobile] Calling active URL: ${fullUrl}`);
    const res = await fetchWithTimeout(fullUrl, { ...options, headers });
    let data: any;
    try {
      data = await res.json();
    } catch (e) {
      data = {};
    }
    console.log(`[API Mobile] ✅ Response from ${activeBaseUrl}${endpoint}, status=${res.status}`);
    return { ok: res.ok && (data.ok !== false), data: data.data !== undefined ? data.data : data, error: data.error };
  } catch (err: any) {
    const msg = err?.message || String(err);
    console.log(`[API Mobile] ❌ Failed ${activeBaseUrl}${endpoint}: ${msg}`);
    errors.push(`${activeBaseUrl}: ${msg}`);

    // If active URL failed, attempt candidates sequentially
    for (const baseUrl of API_URLS) {
      if (baseUrl === activeBaseUrl) continue;
      try {
        const fullUrl = `${baseUrl}${endpoint}`;
        console.log(`[API Mobile] Trying fallback URL: ${fullUrl}`);
        const res = await fetchWithTimeout(fullUrl, { ...options, headers });
        let data: any;
        try {
          data = await res.json();
        } catch (e) {
          data = {};
        }
        activeBaseUrl = baseUrl; // Remember working endpoint
        console.log(`[API Mobile] ✅ Fallback success from ${baseUrl}${endpoint}, status=${res.status}`);
        return { ok: res.ok && (data.ok !== false), data: data.data !== undefined ? data.data : data, error: data.error };
      } catch (e: any) {
        const fallbackMsg = e?.message || String(e);
        console.log(`[API Mobile] ❌ Fallback failed ${baseUrl}: ${fallbackMsg}`);
        errors.push(`${baseUrl}: ${fallbackMsg}`);
      }
    }
    const allErrors = errors.join(' | ');
    console.log(`[API Mobile] ❌❌ All URLs failed for ${endpoint}: ${allErrors}`);
    return { ok: false, error: `No se pudo conectar al servidor: ${allErrors}` };
  }
}

export const mobileApi = {
  // --- AUTHENTICATION & USER PROFILE ---
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

  async googleLogin(credentialToken: string) {
    const res = await fetchWithFallback('/auth/google/', {
      method: 'POST',
      body: JSON.stringify({ credential: credentialToken }),
    });

    if (res.ok && res.data && res.data.token) {
      setAuthToken(res.data.token);
      return { ok: true, token: res.data.token, patient: res.data.patient };
    }
    return { ok: false, error: res.error || 'Error en inicio de sesión con Google' };
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

  async updateProfile(data: Partial<PatientUser>) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'No autenticado' };

    const res = await fetchWithFallback('/portal/me/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return res;
  },

  // --- COMMUNITY POSTS / WALL ---
  async fetchCommunityPosts() {
    const token = getAuthToken();
    const endpoint = token ? '/portal/community-posts/' : '/public/community-posts/';
    const res = await fetchWithFallback(endpoint);

    if (res.ok && Array.isArray(res.data)) {
      return { ok: true, data: res.data };
    }
    return { ok: false, error: res.error || 'Error al obtener publicaciones del servidor' };
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

  // --- ONLINE COURSES ---
  async fetchPublicCourses() {
    const res = await fetchWithFallback('/public/courses/');
    if (res.ok && Array.isArray(res.data)) {
      return { ok: true, data: res.data };
    }
    return { ok: false, error: res.error || 'Error al obtener cursos del servidor' };
  },

  async fetchCourseDetail(slug: string) {
    const res = await fetchWithFallback(`/public/courses/${slug}/`);
    return res;
  },

  async enrollCourse(slug: string) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para inscribirte' };

    const res = await fetchWithFallback(`/portal/courses/${slug}/enroll/`, {
      method: 'POST',
    });
    return res;
  },

  async fetchMyCourses() {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'No autenticado' };

    const res = await fetchWithFallback('/portal/courses/');
    return res;
  },

  // --- LIVE TALKS / CONVERSATORIOS ---
  async fetchPublicTalks() {
    const res = await fetchWithFallback('/public/talks/');
    if (res.ok && Array.isArray(res.data)) {
      return { ok: true, data: res.data };
    }
    return { ok: false, error: res.error || 'Error al obtener conversatorios' };
  },

  async registerTalk(talkId: number | string, name: string, email: string, phone?: string) {
    const res = await fetchWithFallback(`/public/talks/${talkId}/register/`, {
      method: 'POST',
      body: JSON.stringify({ fullName: name, email, phone }),
    });
    return res;
  },

  // --- HEALING STORIES / HISTORIAS DE SANACIÓN ---
  async fetchStories() {
    const res = await fetchWithFallback('/public/stories/');
    if (res.ok && Array.isArray(res.data)) {
      return { ok: true, data: res.data };
    }
    return { ok: false, error: res.error || 'Error al obtener historias' };
  },

  async fetchStoryDetail(id: number | string) {
    const res = await fetchWithFallback(`/public/stories/${id}/`);
    return res;
  },

  async likeStory(id: number | string) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para reaccionar' };

    const res = await fetchWithFallback(`/public/stories/${id}/like/`, {
      method: 'POST',
    });
    return res;
  },

  async commentStory(id: number | string, content: string) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para comentar' };

    const res = await fetchWithFallback(`/public/stories/${id}/comment/`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return res;
  },

  // --- FORUM / FORO DE DISCUSIÓN ---
  async fetchForumTopics() {
    const res = await fetchWithFallback('/public/forum/');
    if (res.ok && Array.isArray(res.data)) {
      return { ok: true, data: res.data };
    }
    return { ok: false, error: res.error || 'Error al obtener temas del foro' };
  },

  async fetchForumTopicDetail(topicId: number | string) {
    const res = await fetchWithFallback(`/public/forum/${topicId}/`);
    return res;
  },

  async replyForumTopic(topicId: number | string, content: string) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para responder en el foro' };

    const res = await fetchWithFallback(`/public/forum/${topicId}/reply/`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return res;
  },

  // --- THERAPISTS, SERVICES & APPOINTMENTS ---
  async fetchTherapists() {
    const res = await fetchWithFallback('/therapists/');
    if (res.ok && Array.isArray(res.data)) {
      return { ok: true, data: res.data };
    }
    return { ok: false, error: res.error || 'Error al obtener terapeutas' };
  },

  async fetchServices() {
    const res = await fetchWithFallback('/services/');
    if (res.ok && Array.isArray(res.data)) {
      return { ok: true, data: res.data };
    }
    return { ok: false, error: res.error || 'Error al obtener servicios' };
  },

  async createAppointment(data: { therapistId: number; serviceId?: number; date: string; time: string; notes?: string }) {
    const res = await fetchWithFallback('/public/appointments/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res;
  },

  // --- WELLBEING & HEALTH TOOLS ---
  async fetchGuidedExercises() {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para acceder a ejercicios guiados' };

    const res = await fetchWithFallback('/portal/guided-exercises/');
    return res;
  },

  async fetchBreathingTechniques() {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para acceder a técnicas de respiración' };

    const res = await fetchWithFallback('/portal/breathing-techniques/');
    return res;
  },

  async fetchWellbeingTests() {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para realizar tests de bienestar' };

    const res = await fetchWithFallback('/portal/wellbeing-tests/');
    return res;
  },

  async submitDailyCheckin(mood: string, note?: string) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para registrar tu estado diario' };

    const res = await fetchWithFallback('/portal/daily-checkin/', {
      method: 'POST',
      body: JSON.stringify({ mood, note }),
    });
    return res;
  },

  // --- LIVE CHAT ---
  async sendChatMessage(messageText: string) {
    const clientId = getClientId();
    const res = await fetchWithFallback('/portal/chat/send/', {
      method: 'POST',
      body: JSON.stringify({ message: messageText, clientId }),
    });
    return res;
  },

  async fetchChatMessages() {
    const clientId = getClientId();
    const endpoint = `/portal/chat/messages/?clientId=${encodeURIComponent(clientId)}`;
    const res = await fetchWithFallback(endpoint);
    return res;
  },

  // --- NOTIFICATIONS ---
  async fetchNotifications() {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'No autenticado', data: [] };
    const res = await fetchWithFallback('/portal/notifications/');
    return res;
  },

  async markNotificationsRead(all: boolean = true, ids?: number[]) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'No autenticado' };
    const res = await fetchWithFallback('/portal/notifications/read/', {
      method: 'POST',
      body: JSON.stringify({ all, ids }),
    });
    return res;
  },

  // --- MEMBERSHIPS & TESTIMONIALS ---
  async fetchMembershipPlans() {
    const res = await fetchWithFallback('/public/memberships/plans/');
    return res;
  },

  async fetchTestimonials() {
    const res = await fetchWithFallback('/public/testimonials/');
    return res;
  },
};

export interface ChatMessageItem {
  id: number;
  clientId: string;
  patientId?: number | null;
  sender: 'client' | 'admin';
  senderName: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: number;
  notificationType: string;
  senderName: string;
  title: string;
  message: string;
  targetUrl: string;
  isRead: boolean;
  createdAt: string;
}
