import { Platform } from 'react-native';
import Constants from 'expo-constants';

let memoryToken: string | null = null;
let memoryClientId: string | null = null;

export function setAuthToken(token: string | null) {
  memoryToken = token;
}

export function getAuthToken(): string | null {
  return memoryToken;
}

export function getClientId(): string {
  if (memoryClientId) return memoryClientId;
  memoryClientId = 'mobile-' + Math.random().toString(36).substring(2, 15);
  return memoryClientId;
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
  ...(hostIp ? [`http://${hostIp}:8000/api`] : []),
  'http://localhost:8000/api',      // Web & iOS Simulator fallback
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
  const base = activeBaseUrl && activeBaseUrl.startsWith('http') ? activeBaseUrl : 'https://conexionluz.com';
  const rootDomain = base.replace(/\/api\/?$/, '');
  return `${rootDomain}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
}

export interface PatientUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  occupation?: string;
  city?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  avatarUrl?: string;
  profilePictureUrl?: string;
  userType?: string;
  canPublish?: boolean;
  perfilArbol?: string;
  igaScore?: number;
  bio?: string;
  portalWelcomeTitle?: string;
  portalWelcomeMessage?: string;
  portalAccentColor?: string;
  intakeCompleted?: boolean;
  intakeSummary?: string;
  hasActiveSubscription?: boolean;
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
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 4500): Promise<Response> {
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

async function fetchWithFallback(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = getAuthToken();
  const clientId = getClientId();
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: Record<string, string> = {
    'X-Client-Id': clientId,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...((options.headers as any) || {}),
  };
  if (isFormData) {
    delete headers['Content-Type'];
  }

  const errors: string[] = [];

  // Try active URL first (defaults to https://conexionluz.com/api)
  try {
    const fullUrl = `${activeBaseUrl}${endpoint}`;
    const res = await fetchWithTimeout(fullUrl, { ...options, headers });
    let data: any;
    try {
      data = await res.json();
    } catch (e) {
      data = {};
    }
    return { ok: res.ok && (data.ok !== false), data: data.data !== undefined ? data.data : data, error: data.error };
  } catch (err: any) {
    const msg = err?.message || String(err);
    errors.push(`${activeBaseUrl}: ${msg}`);

    // If active URL failed, attempt next candidate once
    for (const baseUrl of API_URLS) {
      if (baseUrl === activeBaseUrl) continue;
      try {
        const fullUrl = `${baseUrl}${endpoint}`;
        const res = await fetchWithTimeout(fullUrl, { ...options, headers });
        let data: any;
        try {
          data = await res.json();
        } catch (e) {
          data = {};
        }
        activeBaseUrl = baseUrl; // Remember working endpoint
        return { ok: res.ok && (data.ok !== false), data: data.data !== undefined ? data.data : data, error: data.error };
      } catch (e: any) {
        const fallbackMsg = e?.message || String(e);
        errors.push(`${baseUrl}: ${fallbackMsg}`);
      }
    }
    const allErrors = errors.join(' | ');
    return { ok: false, error: `No se pudo conectar al servidor: ${allErrors}` };
  }
}

let cachedCommunityPosts: any[] | null = null;
let cachedTherapistsData: any[] | null = null;
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

  async register(firstName: string, lastName: string, username: string, email: string, password: string) {
    const res = await fetchWithFallback('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, username, email, password }),
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

  async uploadProfilePicture(imageUri: string) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'No autenticado' };

    const formData = new FormData();
    const filename = imageUri.split('/').pop() || 'profile.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const res = await fetchWithFallback('/portal/me/picture/', {
      method: 'POST',
      body: formData,
    });
    return res;
  },

  async uploadCoverPicture(imageUri: string) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'No autenticado' };

    const formData = new FormData();
    const filename = imageUri.split('/').pop() || 'cover.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const res = await fetchWithFallback('/portal/me/cover/', {
      method: 'POST',
      body: formData,
    });
    return res;
  },

  // --- APPOINTMENTS & CALENDAR ---
  async fetchServices() {
    const res = await fetchWithFallback('/services/');
    if (res.ok && Array.isArray(res.data)) {
      return { ok: true, data: res.data };
    }
    return { ok: false, error: res.error || 'Error al obtener servicios' };
  },

  async fetchTherapists(bypassCache = false) {
    if (!bypassCache && cachedTherapistsData && cachedTherapistsData.length > 0) {
      return { ok: true, data: cachedTherapistsData };
    }
    const res = await fetchWithFallback('/therapists/');
    if (res.ok && Array.isArray(res.data)) {
      cachedTherapistsData = res.data;
      return { ok: true, data: res.data };
    }
    return { ok: false, error: res.error || 'Error al obtener terapeutas' };
  },

  async toggleFollowTherapist(therapistId: number | string) {
    return await fetchWithFallback('/portal/follow/therapist/toggle/', {
      method: 'POST',
      body: JSON.stringify({ therapistId: Number(therapistId) }),
    });
  },

  async getTherapistFollowStatus(therapistId: number | string) {
    return await fetchWithFallback(`/portal/follow/therapist/status/?therapistId=${encodeURIComponent(String(therapistId))}`);
  },

  async toggleFollowPatient(name: string) {
    return await fetchWithFallback('/portal/follow/patient/toggle/', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  async getPatientFollowStatus(name: string) {
    return await fetchWithFallback(`/portal/follow/patient/status/?name=${encodeURIComponent(name)}`);
  },

  async fetchOccupiedTimes(therapistId: number | string, date: string) {
    const q = `/public/appointments/occupied/?therapist=${encodeURIComponent(String(therapistId))}&date=${encodeURIComponent(date)}`;
    return await fetchWithFallback(q);
  },

  async createAppointment(data: {
    serviceId: number;
    therapistId: number;
    date: string;
    time: string;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    clientAge?: number | string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    reason?: string;
    notes?: string;
    payWithLumi?: boolean;
  }) {
    return await fetchWithFallback('/public/appointments/', {
      method: 'POST',
      body: JSON.stringify({
        service_id: data.serviceId,
        therapist_id: data.therapistId,
        date: data.date,
        time: data.time,
        client_name: data.clientName,
        client_email: data.clientEmail,
        client_phone: data.clientPhone,
        client_age: data.clientAge,
        emergency_contact_name: data.emergencyContactName,
        emergency_contact_phone: data.emergencyContactPhone,
        reason: data.reason,
        notes: data.notes,
        pay_with_lumi: data.payWithLumi,
      }),
    });
  },

  async fetchCalendarEvents(startDate?: string, endDate?: string) {
    const startParam = startDate ? `&start=${encodeURIComponent(startDate)}` : '';
    const endParam = endDate ? `&end=${encodeURIComponent(endDate)}` : '';
    return await fetchWithFallback(`/public/calendar/?v=1${startParam}${endParam}`);
  },

  async cancelAppointment(appointmentId: number | string) {
    return await fetchWithFallback(`/appointments/${appointmentId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'cancelled' }),
    });
  },

  async getDailyCheckin() {
    return await fetchWithFallback('/portal/daily-checkin/');
  },

  async submitDailyCheckin(energyLevel: string) {
    return await fetchWithFallback('/portal/daily-checkin/', {
      method: 'POST',
      body: JSON.stringify({ energyLevel }),
    });
  },

  async getAweProfile() {
    return await fetchWithFallback('/portal/awe/profile/');
  },

  async submitIntake(data: any) {
    return await fetchWithFallback('/portal/intake/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // --- COMMUNITY POSTS / WALL WITH PROGRESSIVE PAGINATION ---
  async fetchCommunityPosts(bypassCache = false, page = 1, limit = 10) {
    if (!bypassCache && page === 1 && cachedCommunityPosts && cachedCommunityPosts.length > 0) {
      return { ok: true, data: cachedCommunityPosts, hasMore: true, page: 1 };
    }
    const token = getAuthToken();
    const basePath = token ? '/portal/community-posts/' : '/public/community-posts/';
    const endpoint = `${basePath}?page=${page}&limit=${limit}`;
    const res = await fetchWithFallback(endpoint);

    if (res.ok && Array.isArray(res.data)) {
      if (page === 1) {
        cachedCommunityPosts = res.data;
      }
      const hasMore = res.pagination ? !!res.pagination.hasMore : res.data.length === limit;
      return { ok: true, data: res.data, hasMore, page, pagination: res.pagination };
    }
    return { ok: false, error: res.error || 'Error al obtener publicaciones del servidor', data: [] };
  },

  async createCommunityPost(
    content: string,
    feeling?: string,
    mediaUri?: string,
    mediaType?: 'image' | 'video'
  ) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para publicar.' };

    if (
      mediaUri &&
      (mediaUri.startsWith('file:') ||
        mediaUri.startsWith('content:') ||
        mediaUri.startsWith('ph:') ||
        mediaUri.startsWith('blob:'))
    ) {
      const formData = new FormData();
      formData.append('content', content);
      if (feeling) formData.append('feeling', feeling);
      const filename = mediaUri.split('/').pop() || (mediaType === 'video' ? 'video.mp4' : 'image.jpg');
      const extMatch = /\.(\w+)$/.exec(filename);
      const ext = extMatch ? extMatch[1].toLowerCase() : (mediaType === 'video' ? 'mp4' : 'jpg');
      const mimeType = mediaType === 'video' ? `video/${ext}` : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
      formData.append('file', {
        uri: mediaUri,
        name: filename,
        type: mimeType,
      } as any);

      const res = await fetchWithFallback('/portal/community-posts/', {
        method: 'POST',
        body: formData,
      });
      return res;
    }

    const res = await fetchWithFallback('/portal/community-posts/', {
      method: 'POST',
      body: JSON.stringify({ content, feeling, imageUrl: mediaUri || '' }),
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

  async likeCommunityComment(commentId: string | number) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para dar me gusta al comentario.' };

    const res = await fetchWithFallback(`/portal/community-posts/comments/${commentId}/like/`, {
      method: 'POST',
    });
    return res;
  },

  async replyCommunityComment(commentId: string | number, content: string) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para responder.' };

    const res = await fetchWithFallback(`/portal/community-posts/comments/${commentId}/reply/`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return res;
  },

  async shareCommunityPost(postId: string | number, recipientIds?: (number | string)[]) {
    const res = await fetchWithFallback(`/portal/community-posts/${postId}/share/`, {
      method: 'POST',
      body: JSON.stringify({ recipientIds }),
    });
    return res;
  },

  async updateCommunityPost(postId: string | number, content: string, feeling?: string, imageUrl?: string) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para editar.' };

    const res = await fetchWithFallback(`/portal/community-posts/${postId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ content, feeling, imageUrl }),
    });
    return res;
  },

  async deleteCommunityPost(postId: string | number) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para eliminar.' };

    const res = await fetchWithFallback(`/portal/community-posts/${postId}/`, {
      method: 'DELETE',
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

  async fetchMyCourses() {
    const token = getAuthToken();
    const endpoint = token ? '/portal/courses/' : '/public/courses/';
    const res = await fetchWithFallback(endpoint);
    if (res.ok && Array.isArray(res.data)) {
      return { ok: true, data: res.data };
    }
    return { ok: false, error: res.error || 'Error al obtener cursos del usuario' };
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

  async fetchPortalCourseDetail(slug: string) {
    const res = await fetchWithFallback(`/portal/courses/${slug}/`);
    return res;
  },

  async updateCourseProgress(slug: string, state: any) {
    const res = await fetchWithFallback(`/portal/courses/${slug}/progress/`, {
      method: 'PATCH',
      body: JSON.stringify({ state }),
    });
    return res;
  },

  async fetchLumiWallet() {
    const res = await fetchWithFallback('/portal/lumi/wallet/');
    return res;
  },

  async claimDailyLumis() {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para reclamar tu recompensa diaria.' };
    const res = await fetchWithFallback('/portal/lumi/claim-daily/', {
      method: 'POST',
    });
    return res;
  },

  async spendLumis(itemType: string, itemId: string, lumiAmount: number, description?: string) {
    const res = await fetchWithFallback('/portal/lumi/spend/', {
      method: 'POST',
      body: JSON.stringify({ itemType, itemId, lumiAmount, description }),
    });
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

  async registerTalk(talkId: number | string, name?: string, email?: string, phone?: string) {
    const res = await fetchWithFallback(`/public/talks/${talkId}/register/`, {
      method: 'POST',
      body: JSON.stringify({ fullName: name, email, phone }),
    });
    return res;
  },

  async unregisterTalk(talkId: number | string) {
    const res = await fetchWithFallback(`/public/talks/${talkId}/register/`, {
      method: 'DELETE',
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

  async replyForumTopic(topicId: number | string, content: string, parentId?: number | null) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para responder en el foro' };

    const res = await fetchWithFallback(`/public/forum/${topicId}/reply/`, {
      method: 'POST',
      body: JSON.stringify({ content, parentId: parentId || null }),
    });
    return res;
  },

  async likeForumTopic(topicId: number | string) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para dar me gusta en el foro' };

    const res = await fetchWithFallback(`/public/forum/${topicId}/like/`, {
      method: 'POST',
    });
    return res;
  },

  async unlikeForumTopic(topicId: number | string) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para interactuar en el foro' };

    const res = await fetchWithFallback(`/public/forum/${topicId}/like/`, {
      method: 'DELETE',
    });
    return res;
  },

  async createForumTopic(data: { title: string; description: string; category?: string }) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para crear un tema en el foro' };

    const res = await fetchWithFallback('/public/forum/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res;
  },

  // --- WELLBEING & HEALTH TOOLS ---
  async fetchGuidedExercises() {
    const res = await fetchWithFallback('/portal/guided-exercises/');
    return res;
  },

  async fetchBreathingTechniques() {
    const res = await fetchWithFallback('/portal/breathing-techniques/');
    return res;
  },

  async fetchWellbeingTests() {
    const res = await fetchWithFallback('/portal/wellbeing-tests/');
    return res;
  },

  async fetchAweDaily() {
    const res = await fetchWithFallback('/portal/awe/daily/');
    return res;
  },

  async submitDailyCheckin(data: { energyLevel: string; intention?: string; mood?: string }) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para registrar tu racha y ganar Lumis' };
    const res = await fetchWithFallback('/portal/daily-checkin/', {
      method: 'POST',
      body: JSON.stringify(data),
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

  async fetchMyTestimonial() {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'No autenticado' };
    const res = await fetchWithFallback('/public/testimonials/me/');
    return res;
  },

  async submitMyTestimonial(data: { title?: string; quote: string; rating?: number }) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para compartir tu testimonio' };
    const res = await fetchWithFallback('/public/testimonials/me/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res;
  },

  async likeTestimonial(testimonialId: number | string) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para dar me gusta' };
    const res = await fetchWithFallback(`/public/testimonials/${testimonialId}/like/`, {
      method: 'POST',
    });
    return res;
  },

  async unlikeTestimonial(testimonialId: number | string) {
    const token = getAuthToken();
    if (!token) return { ok: false, error: 'Inicia sesión para interactuar' };
    const res = await fetchWithFallback(`/public/testimonials/${testimonialId}/like/`, {
      method: 'DELETE',
    });
    return res;
  },

  async createMercadoPagoPreference(data: {
    itemType?: string;
    packageId?: string;
    totalLumis: number;
    priceCOP: number;
    packageName?: string;
    payerEmail?: string;
    method?: string;
  }) {
    const token = getAuthToken();
    const res = await fetchWithFallback('/payments/mercadopago/preference/', {
      method: 'POST',
      body: JSON.stringify({
        itemType: data.itemType || 'lumi_package',
        packageId: data.packageId,
        totalLumis: data.totalLumis,
        priceCOP: data.priceCOP,
        packageName: data.packageName || 'Recarga de Lumis',
        payerEmail: data.payerEmail,
        method: data.method || 'card',
      }),
    });
    return res;
  },

  async processMercadoPagoPay(data: {
    itemType?: string;
    packageId?: string;
    totalLumis: number;
    priceCOP: number;
    payerEmail?: string;
    paymentMethod?: string;
    cardData?: any;
    formData?: any;
  }) {
    const token = getAuthToken();
    const res = await fetchWithFallback('/payments/mercadopago/pay/', {
      method: 'POST',
      body: JSON.stringify({
        itemType: data.itemType || 'lumi_package',
        packageId: data.packageId,
        totalLumis: data.totalLumis,
        priceCOP: data.priceCOP,
        payerEmail: data.payerEmail,
        paymentMethod: data.paymentMethod || 'card',
        cardData: data.cardData || data.formData,
      }),
    });
    return res;
  },

  async verifyMercadoPagoPayment(data: {
    paymentId: string;
    packageId: string;
    totalLumis: number;
    priceCOP: number;
  }) {
    const res = await fetchWithFallback('/payments/mercadopago/verify/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
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
