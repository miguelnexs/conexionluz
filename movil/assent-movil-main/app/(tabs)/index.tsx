import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Dimensions,
  Alert,
  ActivityIndicator,
  StatusBar,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
  RefreshControl,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import {
  Sun,
  Bell,
  MessageSquare,
  CalendarPlus,
  Sparkles,
  Heart,
  MessageCircle,
  Send,
  User,
  Plus,
  Pencil,
  Trash2,
  Lock,
  LogIn,
  ShieldCheck,
  X,
  UserPlus,
  LogOut,
  RefreshCw,
  Eye,
  LucideImage,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  BookOpen,
  Video,
  Users,
  ClipboardList,
  Dumbbell,
  NotebookPen,
  Wind,
  Share2,
  Info,
} from 'lucide-react-native';
import {
  mobileApi,
  PatientUser,
  setAuthToken,
  getAuthToken,
  getActiveBaseUrl,
  getAllCandidateUrls,
  normalizeMediaUrl,
  NotificationItem,
  ChatMessageItem,
} from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useTabBarVisibility } from '../../context/TabBarVisibilityContext';
import { UserProfileModal } from '../../components/UserProfileModal';
import { LiveChatModal } from '../../components/LiveChatModal';
import * as ImagePicker from 'expo-image-picker';
import { NotificationsModal } from '../../components/NotificationsModal';
import { CustomVideoPlayer, isVideoMedia } from '../../components/CustomVideoPlayer';
import { FeedSkeletonLoader, TherapistsSkeletonLoader } from '../../components/FeedSkeletonLoader';
import { PostDetailModal, countTotalSembrados } from '../../components/PostDetailModal';
import { SharePostModal } from '../../components/SharePostModal';
import { LumiHeaderBadge } from '../../components/LumiHeaderBadge';
import { LumiWalletModal } from '../../components/LumiWalletModal';
import { decodePostSlug } from '../../utils/postSlug';

const { width } = Dimensions.get('window');

const FEELINGS_LIST = [
  { emoji: '🌱', label: 'En calma', bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' },
  { emoji: '⚡', label: 'Con energía', bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  { emoji: '✨', label: 'Inspirado/a', bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE' },
  { emoji: '🕊️', label: 'En paz', bg: '#F0FDFA', text: '#0F766E', border: '#99F6E4' },
  { emoji: '🌪️', label: 'Abrumado/a', bg: '#FFF1F2', text: '#BE123C', border: '#FECDD3' },
  { emoji: '💤', label: 'Cansado/a', bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' },
];

export interface CommentReply {
  id: string;
  parentId?: string | number;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
  likesCount?: number;
  likedByMe?: boolean;
  likes?: string[];
  createdAt: string;
}

export interface Comment {
  id: string;
  parentId?: string | number;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
  likesCount?: number;
  likedByMe?: boolean;
  likes?: string[];
  replies?: CommentReply[];
  createdAt: string;
}

interface Post {
  id: string;
  patientId?: number | null;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
  feeling?: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface TherapistItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online?: boolean;
}

const THERAPISTS_LIST: TherapistItem[] = [
  {
    id: '1',
    name: 'Luz Amparo Valencia',
    role: 'Terapeuta en Hipnosis Clínica',
    avatar: 'https://conexionluz.com/curriculo/amparo/amparo.png',
    online: true,
  },
  {
    id: '2',
    name: 'Juan David Martínez',
    role: 'Máster en Hipnosis',
    avatar: 'https://conexionluz.com/curriculo/juan/imagenjuan.png',
    online: true,
  },
  {
    id: '3',
    name: 'Dr. Carlos Mendoza',
    role: 'Psicólogo Clínico',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
    online: true,
  },
  {
    id: '4',
    name: 'Dra. Laura Restrepo',
    role: 'Terapeuta de Conciencia',
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300',
    online: false,
  },
  {
    id: '5',
    name: 'Dra. Andrea Gómez',
    role: 'Psicóloga Gestalt',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    online: true,
  },
];

function formatPostDate(rawDate?: string): string {
  if (!rawDate) return 'Hace un momento';
  if (rawDate.includes('Hace')) return rawDate;
  try {
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return 'Hace un momento';
    const diffMs = Date.now() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Hace un momento';
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} días`;
  } catch {
    return 'Hace un momento';
  }
}

function getInitials(name: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getAvatarBgColor(name: string): string {
  const colors = ['#10B981', '#6366F1', '#EC4899', '#F59E0B', '#3B82F6', '#8B5CF6'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function AuthorAvatar({ name, avatarUrl, size = 36 }: { name: string; avatarUrl?: string; size?: number }) {
  const [hasError, setHasError] = useState(false);
  const normalizedUrl = normalizeMediaUrl(avatarUrl);

  useEffect(() => {
    setHasError(false);
  }, [avatarUrl]);

  if (normalizedUrl && !hasError) {
    return (
      <Image
        source={{ uri: normalizedUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        onError={() => setHasError(true)}
      />
    );
  }

  const initials = getInitials(name);
  const bgColor = getAvatarBgColor(name);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bgColor,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: size * 0.38 }}>
        {initials}
      </Text>
    </View>
  );
}

function TherapistAvatar({
  name,
  avatarUrl,
  size = 54,
  online = true,
}: {
  name: string;
  avatarUrl: string;
  size?: number;
  online?: boolean;
}) {
  const [hasError, setHasError] = useState(false);
  const normalizedUrl = normalizeMediaUrl(avatarUrl) || avatarUrl;

  useEffect(() => {
    setHasError(false);
  }, [avatarUrl]);

  return (
    <View style={[styles.therapistAvatarWrapper, { width: size, height: size }]}>
      {normalizedUrl && !hasError ? (
        <Image
          source={{ uri: normalizedUrl }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <View
          style={[
            styles.therapistFallbackAvatar,
            { width: size, height: size, borderRadius: size / 2, backgroundColor: getAvatarBgColor(name) },
          ]}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: size * 0.36 }}>
            {getInitials(name)}
          </Text>
        </View>
      )}
      {online && <View style={styles.onlineBadgeDot} />}
    </View>
  );
}

const INITIAL_FALLBACK_POSTS: Post[] = [
  {
    id: '1',
    authorName: 'Juan David Martínez',
    authorAvatar: 'https://conexionluz.com/curriculo/juan/imagenjuan.png',
    authorRole: 'GUÍA DE LUZ',
    content:
      '✨ Meditación de Enraizamiento & Calma Mental: Tómate 2 minutos para conectar con tu respiración y permitir que tu sistema nervioso recupere su equilibrio natural.',
    feeling: 'En calma',
    image: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    likes: ['Miguel', 'Luz Amparo', 'Ana'],
    comments: [
      {
        id: 'c1',
        authorName: 'Luz Amparo Valencia',
        authorAvatar: 'https://conexionluz.com/curriculo/amparo/amparo.png',
        authorRole: 'TERAPEUTA',
        content: 'Hermoso recordatorio. La respiración consciente es el puente a nuestra paz interior.',
        createdAt: 'Hace 2 horas',
      },
    ],
    createdAt: 'Hace 3 horas',
  },
  {
    id: '2',
    authorName: 'miguel angel valencia',
    authorAvatar: 'https://conexionluz.com/curriculo/juan/imagenjuan.png',
    authorRole: 'MIEMBRO',
    content:
      'La resiliencia no significa no sentir dolor o frustración; significa darnos permiso de sentir, aprender de la experiencia y continuar caminando con esperanza. Agradezco a cada uno de ustedes por hacer de Conexión Luz una comunidad más cálida y humana cada día. 🌟❤️',
    feeling: 'Inspirado/a',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    likes: ['Usuario'],
    comments: [],
    createdAt: 'Hace 18 horas',
  },
  {
    id: '3',
    authorName: 'Luz Amparo Valencia',
    authorAvatar: 'https://conexionluz.com/curriculo/amparo/amparo.png',
    authorRole: 'TERAPEUTA',
    content:
      'Recordatorio para hoy: Respirar profundo 3 veces cuando sientas tensión en los hombros. Regálate ese espacio de luz y reconexión.',
    feeling: 'En calma',
    image: 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&q=80&w=800',
    likes: ['Miguel', 'Ana'],
    comments: [],
    createdAt: 'Hace 1 día',
  },
];

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user: currentUser, isAuthenticated, login: authLogin, register: authRegister } = useAuth();
  const isGuest = !isAuthenticated;

  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [therapists, setTherapists] = useState<TherapistItem[]>([]);
  const [loadingTherapists, setLoadingTherapists] = useState<boolean>(true);
  const [newPostText, setNewPostText] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingPostText, setEditingPostText] = useState('');

  // Interactive Spark Creator State (Emergent Window & Quick Trigger)
  const [showSparkModal, setShowSparkModal] = useState<boolean>(false);
  const [creatorText, setCreatorText] = useState<string>('');
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [selectedMediaUri, setSelectedMediaUri] = useState<string | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<'image' | 'video' | null>(null);
  const [showFeelingSelector, setShowFeelingSelector] = useState<boolean>(false);
  const [showVideoUrlInput, setShowVideoUrlInput] = useState<boolean>(false);
  const [videoUrlText, setVideoUrlText] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedPostsText, setExpandedPostsText] = useState<Record<string, boolean>>({});
  const [postsPage, setPostsPage] = useState<number>(1);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);
  const [loadingMorePosts, setLoadingMorePosts] = useState<boolean>(false);
  const params = useLocalSearchParams<{ postId?: string; post?: string; slug?: string }>();
  const [selectedDetailPost, setSelectedDetailPost] = useState<Post | null>(null);
  const [shareModalPost, setShareModalPost] = useState<Post | null>(null);

  // Deep Link & URL Post Detection (Web & Mobile Sync)
  useEffect(() => {
    const rawTarget = params?.postId || params?.post || params?.slug;
    if (rawTarget && posts.length > 0) {
      const decodedId = decodePostSlug(String(rawTarget));
      const matched = posts.find(
        (p) => String(p.id) === String(decodedId) || String(p.id) === String(rawTarget)
      );
      if (matched) {
        setSelectedDetailPost(matched);
      }
    }
  }, [params, posts]);

  const [showAppointmentModal, setShowAppointmentModal] = useState<boolean>(false);
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistItem | null>(null);

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  const [showUserProfileModal, setShowUserProfileModal] = useState<boolean>(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState<{
    authorName: string;
    authorAvatar?: string;
    authorRole?: string;
  } | null>(null);

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');

  const [appDate, setAppDate] = useState('2026-08-05');
  const [appTime, setAppTime] = useState('10:00 AM');
  const [appNotes, setAppNotes] = useState('');
  const [appLoading, setAppLoading] = useState(false);

  const [showLiveChatModal, setShowLiveChatModal] = useState<boolean>(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [showLumiWalletModal, setShowLumiWalletModal] = useState<boolean>(false);
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>([]);
  const [chatMessagesList, setChatMessagesList] = useState<ChatMessageItem[]>([]);

  const { isTabBarVisible, setIsTabBarVisible } = useTabBarVisibility();
  const lastScrollYRef = useRef<number>(0);
  const scrollOffsetYRef = useRef<number>(0);
  const scrollViewHeightRef = useRef<number>(0);

  // Auto-play / pause video in view tracking & Global sound sync
  const isScreenFocused = useIsFocused();
  const [activeVideoPostId, setActiveVideoPostId] = useState<string | number | null>(null);
  const [isGlobalMuted, setIsGlobalMuted] = useState<boolean>(true);
  const feedContainerYRef = useRef<number>(0);
  const postLayoutsRef = useRef<{ [id: string]: { y: number; height: number } }>({});
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isScreenFocused) {
      setActiveVideoPostId(null);
    } else {
      if (scrollViewHeightRef.current > 0) {
        checkActiveVideo(scrollOffsetYRef.current, scrollViewHeightRef.current);
      }
    }
  }, [isScreenFocused]);

  const checkActiveVideo = (currentY: number, viewHeight: number) => {
    if (!viewHeight || viewHeight <= 0) return;
    const viewportCenter = currentY + viewHeight * 0.5;

    let closestId: string | number | null = null;
    let minDistance = Infinity;

    for (const post of posts) {
      if (post.image && isVideoMedia(post.image)) {
        const layout = postLayoutsRef.current[String(post.id)];
        if (layout) {
          const postTop = (feedContainerYRef.current || 0) + layout.y;
          const postBottom = postTop + layout.height;
          // Check if post is visible within viewport
          const isVisible = postBottom > currentY + 40 && postTop < currentY + viewHeight - 40;
          if (isVisible) {
            const postCenter = postTop + layout.height / 2;
            const dist = Math.abs(postCenter - viewportCenter);
            if (dist < minDistance) {
              minDistance = dist;
              closestId = post.id;
            }
          }
        }
      }
    }

    setActiveVideoPostId((prev) => (prev !== closestId ? closestId : prev));
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const viewHeight = event.nativeEvent.layoutMeasurement.height;
    const contentHeight = event.nativeEvent.contentSize.height;
    scrollOffsetYRef.current = currentY;
    scrollViewHeightRef.current = viewHeight;

    const diff = currentY - lastScrollYRef.current;

    // Smooth tab bar hide/show with higher threshold to prevent laggy re-renders
    if (currentY <= 60) {
      if (!isTabBarVisible) setIsTabBarVisible(true);
      lastScrollYRef.current = currentY;
    } else if (diff > 25 && isTabBarVisible) {
      setIsTabBarVisible(false);
      lastScrollYRef.current = currentY;
    } else if (diff < -20 && !isTabBarVisible) {
      setIsTabBarVisible(true);
      lastScrollYRef.current = currentY;
    } else {
      lastScrollYRef.current = currentY;
    }

    // Debounced check for auto-playing the single video in view
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      checkActiveVideo(currentY, viewHeight);
    }, 70);

    // Progressive Pagination: Infinite Scroll Trigger near bottom
    if (contentHeight > 0 && currentY + viewHeight >= contentHeight - 350) {
      if (hasMorePosts && !loadingMorePosts && !loadingPosts) {
        loadMorePosts();
      }
    }
  };

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setPostsPage(1);
    await Promise.all([
      loadPostsFromBackend(true, 1),
      loadTherapists(true),
      loadNotifications(),
      loadInitialChatMessages(),
    ]);
    setRefreshing(false);
  };

  const unreadNotificationsCount = notificationsList.filter((n) => !n.isRead).length;
  const unreadChatAdminCount = chatMessagesList.filter(
    (m) => m.sender === 'admin' && !m.isRead
  ).length;

  const isFetchingNotificationsRef = useRef(false);
  const isFetchingChatRef = useRef(false);

  const loadNotifications = async () => {
    if (isFetchingNotificationsRef.current) return;
    isFetchingNotificationsRef.current = true;
    try {
      const res = await mobileApi.fetchNotifications();
      if (res.ok && Array.isArray(res.data)) {
        setNotificationsList(res.data);
      }
    } catch (e) {
    } finally {
      isFetchingNotificationsRef.current = false;
    }
  };

  const loadInitialChatMessages = async () => {
    if (isFetchingChatRef.current) return;
    isFetchingChatRef.current = true;
    try {
      const res = await mobileApi.fetchChatMessages();
      if (res.ok && Array.isArray(res.data)) {
        setChatMessagesList(res.data);
      }
    } catch (e) {
    } finally {
      isFetchingChatRef.current = false;
    }
  };

  const loadTherapists = async (bypassCache = false) => {
    setLoadingTherapists(true);
    try {
      const res = await mobileApi.fetchTherapists(bypassCache);
      if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
        const formatted: TherapistItem[] = res.data.map((t: any) => {
          let avatarFallback = 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300';
          if (t.name?.toLowerCase().includes('amparo') || t.name?.toLowerCase().includes('luz')) {
            avatarFallback = 'https://conexionluz.com/curriculo/amparo/amparo.png';
          } else if (t.name?.toLowerCase().includes('juan')) {
            avatarFallback = 'https://conexionluz.com/curriculo/juan/imagenjuan.png';
          }
          return {
            id: String(t.id),
            name: t.name,
            role: t.title || t.specialties?.[0] || 'Guía de Luz',
            avatar: normalizeMediaUrl(t.photoUrl || t.image_url || t.photo_file) || avatarFallback,
            online: t.isActive !== false,
          };
        });
        setTherapists(formatted);
      } else {
        setTherapists(THERAPISTS_LIST);
      }
    } catch (e) {
      setTherapists(THERAPISTS_LIST);
    } finally {
      setLoadingTherapists(false);
    }
  };

  useEffect(() => {
    loadPostsFromBackend();
    loadTherapists();
    loadNotifications();
    loadInitialChatMessages();

    const interval = setInterval(() => {
      if (isAuthenticated) {
        loadNotifications();
        loadInitialChatMessages();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollViewHeightRef.current > 0) {
        checkActiveVideo(scrollOffsetYRef.current, scrollViewHeightRef.current);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [posts]);

  const loadPostsFromBackend = async (bypassCache = false, page = 1) => {
    if (page === 1) {
      setLoadingPosts(true);
    } else {
      setLoadingMorePosts(true);
    }
    try {
      const res = await mobileApi.fetchCommunityPosts(bypassCache, page, 10);
      if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
        const validItems = res.data.filter(
          (item: any) => (item.content && item.content.trim().length > 0) || item.imageUrl
        );
        const formattedPosts: Post[] = validItems.map((item: any) => ({
          id: String(item.id),
          patientId: item.patientId || item.patient_id || (item.patient && typeof item.patient === 'object' ? item.patient.id : item.patient) || null,
          authorName: item.authorName || item.author || 'Miembro Conexión Luz',
          authorAvatar: normalizeMediaUrl(item.authorAvatarUrl || item.authorAvatar || item.profilePictureUrl || item.avatarUrl) || '',
          authorRole: (item.authorRole || 'MIEMBRO').toUpperCase(),
          content: item.content || item.title || '',
          feeling: item.feeling || 'En calma',
          image: normalizeMediaUrl(item.imageUrl || item.image),
          likes: Array.isArray(item.likes) ? item.likes : item.likesCount ? Array(item.likesCount).fill('Usuario') : [],
          comments: Array.isArray(item.comments)
            ? item.comments.map((c: any) => ({
                id: String(c.id),
                parentId: c.parentId || null,
                authorName: c.authorName || 'Miembro',
                authorAvatar: normalizeMediaUrl(c.authorAvatarUrl || c.authorAvatar) || '',
                authorRole: (c.authorRole || 'MIEMBRO').toUpperCase(),
                content: c.content || '',
                likesCount: typeof c.likesCount === 'number' ? c.likesCount : (Array.isArray(c.likes) ? c.likes.length : 0),
                likedByMe: Boolean(c.likedByMe),
                likes: Array.isArray(c.likes) ? c.likes : [],
                replies: Array.isArray(c.replies)
                  ? c.replies.map((r: any) => ({
                      id: String(r.id),
                      parentId: r.parentId || c.id,
                      authorName: r.authorName || 'Miembro',
                      authorAvatar: normalizeMediaUrl(r.authorAvatarUrl || r.authorAvatar) || '',
                      authorRole: (r.authorRole || 'MIEMBRO').toUpperCase(),
                      content: r.content || '',
                      likesCount: typeof r.likesCount === 'number' ? r.likesCount : 0,
                      likedByMe: Boolean(r.likedByMe),
                      likes: Array.isArray(r.likes) ? r.likes : [],
                      createdAt: formatPostDate(r.createdAt),
                    }))
                  : [],
                createdAt: formatPostDate(c.createdAt),
              }))
            : [],
          createdAt: formatPostDate(item.createdAt),
        }));

        if (page === 1) {
          setPosts(formattedPosts);
        } else {
          setPosts((prev) => {
            const map = new Map(prev.map((p) => [p.id, p]));
            formattedPosts.forEach((p) => map.set(p.id, p));
            return Array.from(map.values());
          });
        }
        setPostsPage(page);
        setHasMorePosts(!!res.hasMore && formattedPosts.length > 0);
      } else {
        if (page === 1) setPosts(INITIAL_FALLBACK_POSTS);
        setHasMorePosts(false);
      }
    } catch (e: any) {
      console.log('[Home] Exception loading posts:', e?.message || String(e));
      if (page === 1) setPosts(INITIAL_FALLBACK_POSTS);
      setHasMorePosts(false);
    } finally {
      if (page === 1) {
        setLoadingPosts(false);
      } else {
        setLoadingMorePosts(false);
      }
    }
  };

  const loadMorePosts = async () => {
    if (loadingMorePosts || loadingPosts || !hasMorePosts) return;
    const nextPage = postsPage + 1;
    await loadPostsFromBackend(true, nextPage);
  };

  const handleOpenUserProfile = (
    authorName: string,
    authorAvatar?: string,
    authorRole?: string,
    patientId?: string | number,
    coverUrl?: string
  ) => {
    router.push({
      pathname: '/perfil-usuario',
      params: {
        authorName,
        avatarUrl: authorAvatar || '',
        role: authorRole || 'MIEMBRO',
        patientId: patientId ? String(patientId) : '',
        coverUrl: coverUrl || '',
      },
    } as any);
  };

  const handleOpenSparkModal = (initialAction?: 'image' | 'video' | 'feeling') => {
    if (isGuest) {
      setShowAuthModal(true);
      return;
    }
    setShowSparkModal(true);
    if (initialAction === 'image') {
      setTimeout(() => handlePickImage(), 200);
    } else if (initialAction === 'video') {
      setTimeout(() => handlePickVideo(), 200);
    } else if (initialAction === 'feeling') {
      setShowFeelingSelector(true);
    }
  };

  const handlePickImage = async () => {
    if (isGuest) {
      setShowAuthModal(true);
      return;
    }
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso necesario', 'Se requiere acceso a la galería para seleccionar imágenes.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.85,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedMediaUri(result.assets[0].uri);
        setSelectedMediaType('image');
      }
    } catch (err: any) {
      console.warn('Image picker error:', err);
    }
  };

  const handlePickVideo = async () => {
    if (isGuest) {
      setShowAuthModal(true);
      return;
    }
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso necesario', 'Se requiere acceso a la galería para seleccionar videos.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedMediaUri(result.assets[0].uri);
        setSelectedMediaType('video');
      }
    } catch (err: any) {
      console.warn('Video picker error:', err);
    }
  };

  const handlePublishPost = async () => {
    if (isGuest) {
      setShowAuthModal(true);
      return;
    }
    if (!creatorText.trim() && !selectedMediaUri) {
      Alert.alert('Publicación vacía', 'Escribe una reflexión o adjunta una imagen/video para publicar.');
      return;
    }

    setIsPublishing(true);
    const contentToPublish = creatorText.trim();
    const feelingToPublish = selectedFeeling || undefined;
    const mediaUriToPublish = selectedMediaUri || undefined;
    const mediaTypeToPublish = selectedMediaType || undefined;

    // Optimistic insert for maximum fluidity
    const tempId = `temp-${Date.now()}`;
    const authorName = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() : 'Miembro';
    const authorAvatar = currentUser?.avatarUrl || currentUser?.profilePictureUrl || '';
    const newPostItem: Post = {
      id: tempId,
      patientId: currentUser?.id,
      authorName,
      authorAvatar,
      authorRole: currentUser?.userType ? currentUser.userType.toUpperCase() : 'MIEMBRO',
      content: contentToPublish,
      feeling: feelingToPublish || 'En calma',
      image: mediaUriToPublish,
      likes: [],
      comments: [],
      createdAt: 'Hace un momento',
    };
    setPosts((prev) => [newPostItem, ...prev]);

    // Close modal and reset creator state immediately
    setShowSparkModal(false);
    setCreatorText('');
    setSelectedFeeling(null);
    setSelectedMediaUri(null);
    setSelectedMediaType(null);
    setShowFeelingSelector(false);
    setShowVideoUrlInput(false);

    try {
      const res = await mobileApi.createCommunityPost(
        contentToPublish,
        feelingToPublish,
        mediaUriToPublish,
        mediaTypeToPublish
      );
      if (res.ok) {
        loadPostsFromBackend(true);
      }
    } catch (err: any) {
      console.warn('Error publishing post:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeletePost = (postId: string) => {
    Alert.alert('Eliminar publicación', '¿Deseas eliminar este destello de la comunidad?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          setPosts((prev) => prev.filter((p) => p.id !== postId));
          await mobileApi.deleteCommunityPost(postId);
        },
      },
    ]);
  };

  const handleSaveEditPost = async () => {
    if (!editingPost || !editingPostText.trim()) return;
    const targetId = editingPost.id;
    const newContent = editingPostText.trim();
    setPosts((prev) => prev.map((p) => (p.id === targetId ? { ...p, content: newContent } : p)));
    setEditingPost(null);
    await mobileApi.updateCommunityPost(targetId, newContent);
  };

  const handleToggleLike = async (postId: string) => {
    if (isGuest) {
      setShowAuthModal(true);
      return;
    }
    const userName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : 'Tú';
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const hasLiked = post.likes.includes(userName);
          const updatedLikes = hasLiked
            ? post.likes.filter((name) => name !== userName)
            : [...post.likes, userName];
          const updatedPost = { ...post, likes: updatedLikes };
          if (selectedDetailPost && selectedDetailPost.id === postId) {
            setSelectedDetailPost(updatedPost);
          }
          return updatedPost;
        }
        return post;
      })
    );
    mobileApi.likeCommunityPost(postId);
  };

  const handleAddComment = async (postId: string) => {
    if (isGuest) {
      setShowAuthModal(true);
      return;
    }
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    const userName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : 'Tú';
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      authorName: userName,
      authorAvatar: currentUser?.avatarUrl || '',
      authorRole: 'MIEMBRO',
      content: text.trim(),
      createdAt: 'Justo ahora',
    };
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const updated = { ...post, comments: [...post.comments, newComment] };
          if (selectedDetailPost && selectedDetailPost.id === postId) {
            setSelectedDetailPost(updated);
          }
          return updated;
        }
        return post;
      })
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    mobileApi.commentCommunityPost(postId, text.trim());
  };

  const handleAddCommentFromDetail = async (postId: string, text: string) => {
    if (isGuest) {
      setShowAuthModal(true);
      return;
    }
    if (!text || !text.trim()) return;
    const userName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : 'Tú';
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      authorName: userName,
      authorAvatar: currentUser?.avatarUrl || '',
      authorRole: 'MIEMBRO',
      content: text.trim(),
      createdAt: 'Justo ahora',
    };
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const updated = { ...post, comments: [...post.comments, newComment] };
          if (selectedDetailPost && selectedDetailPost.id === postId) {
            setSelectedDetailPost(updated);
          }
          return updated;
        }
        return post;
      })
    );
    await mobileApi.commentCommunityPost(postId, text.trim());
  };

  const handleToggleLikeComment = async (commentId: string | number, postId: string | number) => {
    if (isGuest) {
      setShowAuthModal(true);
      return;
    }
    const cIdStr = String(commentId);
    const pIdStr = String(postId);

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === pIdStr) {
          const updatedComments = post.comments.map((comment) => {
            if (comment.id === cIdStr) {
              const currentLiked = Boolean(comment.likedByMe);
              const currentCount = comment.likesCount || 0;
              return {
                ...comment,
                likedByMe: !currentLiked,
                likesCount: currentLiked ? Math.max(0, currentCount - 1) : currentCount + 1,
              };
            }
            // Check sub-replies
            if (comment.replies && comment.replies.length > 0) {
              const updatedReplies = comment.replies.map((reply) => {
                if (reply.id === cIdStr) {
                  const replyLiked = Boolean(reply.likedByMe);
                  const replyCount = reply.likesCount || 0;
                  return {
                    ...reply,
                    likedByMe: !replyLiked,
                    likesCount: replyLiked ? Math.max(0, replyCount - 1) : replyCount + 1,
                  };
                }
                return reply;
              });
              return { ...comment, replies: updatedReplies };
            }
            return comment;
          });

          const updatedPost = { ...post, comments: updatedComments };
          if (selectedDetailPost && selectedDetailPost.id === pIdStr) {
            setSelectedDetailPost(updatedPost);
          }
          return updatedPost;
        }
        return post;
      })
    );

    mobileApi.likeCommunityComment(commentId);
  };

  const handleReplyComment = async (
    commentId: string | number,
    postId: string | number,
    text: string
  ) => {
    if (isGuest) {
      setShowAuthModal(true);
      return;
    }
    if (!text || !text.trim()) return;
    const cIdStr = String(commentId);
    const pIdStr = String(postId);
    const userName = currentUser
      ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'Tú'
      : 'Miembro';

    const newReply: CommentReply = {
      id: `rep-${Date.now()}`,
      parentId: cIdStr,
      authorName: userName,
      authorAvatar: currentUser?.avatarUrl || '',
      authorRole: currentUser?.userType ? currentUser.userType.toUpperCase() : 'MIEMBRO',
      content: text.trim(),
      likesCount: 0,
      likedByMe: false,
      likes: [],
      createdAt: 'Justo ahora',
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === pIdStr) {
          const updatedComments = post.comments.map((comment) => {
            if (comment.id === cIdStr) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newReply],
              };
            }
            return comment;
          });
          const updatedPost = { ...post, comments: updatedComments };
          if (selectedDetailPost && selectedDetailPost.id === pIdStr) {
            setSelectedDetailPost(updatedPost);
          }
          return updatedPost;
        }
        return post;
      })
    );

    await mobileApi.replyCommunityComment(commentId, text.trim());
  };

  const handleAuthSubmit = async () => {
    if (!emailInput.trim() || !passwordInput.trim()) {
      Alert.alert('Campos requeridos', 'Por favor ingresa correo y contraseña.');
      return;
    }
    setAuthLoading(true);
    if (authMode === 'login') {
      const res = await authLogin(emailInput.trim(), passwordInput.trim());
      setAuthLoading(false);
      if (res.ok) {
        setShowAuthModal(false);
        Alert.alert('¡Bienvenido/a!', 'Sesión iniciada correctamente.');
        loadPostsFromBackend();
      } else {
        Alert.alert('Error de Inicio de Sesión', res.error || 'Credenciales incorrectas');
      }
    } else {
      if (!firstNameInput.trim()) {
        setAuthLoading(false);
        Alert.alert('Campo requerido', 'Por favor ingresa tu nombre.');
        return;
      }
      const usernameVal = emailInput.trim().split('@')[0] || firstNameInput.trim().toLowerCase();
      const res = await authRegister(
        firstNameInput.trim(),
        lastNameInput.trim(),
        usernameVal,
        emailInput.trim(),
        passwordInput.trim()
      );
      setAuthLoading(false);
      if (res.ok) {
        setShowAuthModal(false);
        Alert.alert('¡Registro exitoso!', 'Bienvenido a Conexión Luz®');
        loadPostsFromBackend();
      } else {
        Alert.alert('Error de Registro', res.error || 'No se pudo crear la cuenta');
      }
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedTherapist) return;
    setAppLoading(true);
    const res = await mobileApi.createAppointment({
      therapistId: Number(selectedTherapist.id) || 1,
      date: appDate,
      time: appTime,
      notes: appNotes,
    });
    setAppLoading(false);
    setShowAppointmentModal(false);
    if (res.ok) {
      Alert.alert('¡Cita Solicitada!', `Tu cita con ${selectedTherapist.name} fue reservada exitosamente para el ${appDate} a las ${appTime}.`);
    } else {
      Alert.alert('Solicitud enviada', `Hemos agendado tu consulta con ${selectedTherapist.name}.`);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent={true} />

      {/* 1. TOP HEADER BAR: SUN LOGO + NOTIFICATIONS, CHAT, PROFILE AVATAR & CALENDAR */}
      <View style={styles.topHeaderBar}>
        {/* BRAND LOGO CONEXIÓ N LUZ */}
        <View style={styles.brandLogoRow}>
          <Sun color="#F59E0B" size={24} />
          <Text style={styles.brandTitleText}>ConexiónLuz</Text>
        </View>

        {/* RIGHT HEADER ACTIONS */}
        <View style={styles.headerRightActionsRow}>
          {/* NOTIFICATION BELL BUTTON */}
          <TouchableOpacity
            onPress={() => {
              if (isGuest) {
                setShowAuthModal(true);
              } else {
                loadNotifications();
                setShowNotificationsModal(true);
              }
            }}
            style={styles.headerIconCircleBtn}
            activeOpacity={0.8}
          >
            <Bell color="#475569" size={18} />
            {unreadNotificationsCount > 0 && (
              <View style={styles.badgeCircle}>
                <Text style={styles.badgeText}>
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* CHAT / HELP BUTTON */}
          <TouchableOpacity
            onPress={() => setShowLiveChatModal(true)}
            style={styles.headerIconCircleBtn}
            activeOpacity={0.8}
          >
            <MessageSquare color="#475569" size={18} />
            {unreadChatAdminCount > 0 && (
              <View style={styles.badgeCircle}>
                <Text style={styles.badgeText}>
                  {unreadChatAdminCount > 9 ? '9+' : unreadChatAdminCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* USER PROFILE AVATAR BUTTON */}
          <TouchableOpacity
            onPress={() => {
              if (isGuest) {
                setShowAuthModal(true);
              } else {
                handleOpenUserProfile(
                  currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Mi Perfil',
                  currentUser?.avatarUrl,
                  'MIEMBRO'
                );
              }
            }}
            style={styles.headerAvatarCircleBtn}
            activeOpacity={0.8}
          >
            <AuthorAvatar
              name={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'miguel angel valencia'}
              avatarUrl={currentUser?.avatarUrl || 'https://conexionluz.com/media/patients/profile/imagenjuan.png'}
              size={36}
            />
          </TouchableOpacity>

          {/* CALENDAR APPOINTMENT LINK BUTTON */}
          <TouchableOpacity
            onPress={() => router.push('/agenda' as any)}
            style={styles.calendarPlusBtn}
            activeOpacity={0.85}
          >
            <CalendarPlus color="#FFFFFF" size={18} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={32}
        removeClippedSubviews={Platform.OS === 'android'}
        onMomentumScrollEnd={(e) => {
          checkActiveVideo(
            e.nativeEvent.contentOffset.y,
            e.nativeEvent.layoutMeasurement.height
          );
        }}
        onScrollEndDrag={(e) => {
          checkActiveVideo(
            e.nativeEvent.contentOffset.y,
            e.nativeEvent.layoutMeasurement.height
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0D9488', '#059669']}
            tintColor="#0D9488"
          />
        }
      >

        {/* 2. TU LABORATORIO SECTION */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitleLabel}>TU LABORATORIO</Text>
        </View>

        <View style={styles.laboratorioGridRow}>
          {/* CARD 1: TESTS */}
          <TouchableOpacity
            onPress={() => router.push('/test-detalle?id=ansiedad' as any)}
            style={styles.labCard}
            activeOpacity={0.8}
          >
            <View style={[styles.labIconCircle, { backgroundColor: '#FEF2F2' }]}>
              <ClipboardList color="#EF4444" size={22} />
            </View>
            <Text style={styles.labCardText}>Tests</Text>
          </TouchableOpacity>

          {/* CARD 2: EJERCICIOS */}
          <TouchableOpacity
            onPress={() => router.push('/ejercicio-detalle?id=mindfulness-5' as any)}
            style={styles.labCard}
            activeOpacity={0.8}
          >
            <View style={[styles.labIconCircle, { backgroundColor: '#EEF2FF' }]}>
              <Dumbbell color="#6366F1" size={22} />
            </View>
            <Text style={styles.labCardText}>Ejercicios</Text>
          </TouchableOpacity>

          {/* CARD 3: DIARIO (PÁGINA INDEPENDIENTE) */}
          <TouchableOpacity
            onPress={() => router.push('/diario-emocional' as any)}
            style={styles.labCard}
            activeOpacity={0.8}
          >
            <View style={[styles.labIconCircle, { backgroundColor: '#ECFDF5' }]}>
              <NotebookPen color="#10B981" size={22} />
            </View>
            <Text style={styles.labCardText}>Diario</Text>
          </TouchableOpacity>

          {/* CARD 4: RELAJACIÓN */}
          <TouchableOpacity
            onPress={() => router.push('/relajacion-detalle?id=box' as any)}
            style={styles.labCard}
            activeOpacity={0.8}
          >
            <View style={[styles.labIconCircle, { backgroundColor: '#E0F2FE' }]}>
              <Wind color="#0EA5E9" size={22} />
            </View>
            <Text style={styles.labCardText}>Relajación</Text>
          </TouchableOpacity>
        </View>

        {/* 3. SEMILLA DE LUZ BANNER CARD */}
        <View style={styles.semillaLuzCard}>
          <View style={styles.semillaIconBox}>
            <Sparkles color="#0D9488" size={18} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.semillaTagText}>SEMILLA DE LUZ</Text>
            <Text style={styles.semillaQuoteText}>
              "Eres mucho más fuerte y capaz de lo que tu mente ansiosa te hace creer."
            </Text>
          </View>
        </View>

        {/* 4. GUÍAS DE LUZ SECTION */}
        <View style={styles.sectionHeaderRowBetween}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Sparkles color="#F59E0B" size={18} />
            <Text style={styles.sectionTitleLabelDark}>GUÍAS DE LUZ</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/guias-de-luz' as any)}>
            <Text style={styles.verTodosLink}>Ver todos →</Text>
          </TouchableOpacity>
        </View>

        {/* HORIZONTAL SCROLL OF THERAPISTS / SKELETON */}
        {loadingTherapists ? (
          <TherapistsSkeletonLoader />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.therapistsHorizontalList}
          >
            {therapists.map((therapist) => (
              <View key={therapist.id} style={styles.therapistCard}>
                <TouchableOpacity
                  onPress={() => router.push('/guias-de-luz' as any)}
                  activeOpacity={0.8}
                  style={{ alignItems: 'center' }}
                >
                  <TherapistAvatar
                    name={therapist.name}
                    avatarUrl={therapist.avatar}
                    size={54}
                    online={therapist.online}
                  />

                  <Text style={styles.therapistNameText} numberOfLines={1}>
                    {therapist.name}
                  </Text>
                  <Text style={styles.therapistRoleText} numberOfLines={1}>{therapist.role}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: '/agenda',
                      params: { therapistId: String(therapist.id) },
                    } as any);
                  }}
                  style={styles.agendarPillBtn}
                  activeOpacity={0.8}
                >
                  <Text style={styles.agendarPillBtnText}>Agendar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* 5. DESTELLOS DE LA COMUNIDAD SECTION */}
        <View style={[styles.sectionHeaderRow, { marginTop: 18 }]}>
          <MessageCircle color="#64748B" size={18} style={{ marginRight: 6 }} />
          <Text style={styles.sectionTitleLabel}>DESTELLOS DE LA COMUNIDAD</Text>
        </View>

        {/* ─── QUICK SPARK TRIGGER BAR (OPENS EMERGENT MODAL) ─── */}
        <View style={styles.creatorCardCollapsed}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleOpenSparkModal()}
            style={styles.creatorCollapsedTopRow}
          >
            <AuthorAvatar
              name={currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() : 'Tú'}
              avatarUrl={currentUser?.avatarUrl || currentUser?.profilePictureUrl || ''}
              size={38}
            />
            <View style={styles.creatorCollapsedInputPlaceholder}>
              <Text style={styles.creatorCollapsedInputText} numberOfLines={1}>
                ✨ Comparte un destello, intención o reflexión...
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.creatorQuickShortcutsRow}>
            <TouchableOpacity
              style={styles.creatorQuickShortcutItem}
              onPress={() => handleOpenSparkModal('image')}
              activeOpacity={0.7}
            >
              <View style={[styles.creatorShortcutIconCircle, { backgroundColor: '#F0F9FF' }]}>
                <LucideImage color="#0284C7" size={17} />
              </View>
              <Text style={styles.creatorShortcutText}>Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.creatorQuickShortcutItem}
              onPress={() => handleOpenSparkModal('video')}
              activeOpacity={0.7}
            >
              <View style={[styles.creatorShortcutIconCircle, { backgroundColor: '#FAF5FF' }]}>
                <Video color="#9333EA" size={17} />
              </View>
              <Text style={styles.creatorShortcutText}>Video</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.creatorQuickShortcutItem}
              onPress={() => handleOpenSparkModal('feeling')}
              activeOpacity={0.7}
            >
              <View style={[styles.creatorShortcutIconCircle, { backgroundColor: '#FFFBEB' }]}>
                <Sun color="#D97706" size={17} />
              </View>
              <Text style={styles.creatorShortcutText}>Sintonía</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* COMMUNITY FEED POSTS / SKELETON LOADER */}
        {loadingPosts ? (
          <FeedSkeletonLoader />
        ) : (
          <View
            style={styles.feedPostsContainer}
            onLayout={(e) => {
              feedContainerYRef.current = e.nativeEvent.layout.y;
              setTimeout(() => {
                if (scrollViewHeightRef.current > 0) {
                  checkActiveVideo(scrollOffsetYRef.current, scrollViewHeightRef.current);
                }
              }, 100);
            }}
          >
            {posts.map((post) => {
              const userName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : 'Tú';
              const myFullName = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim().toLowerCase() : '';
              const myUsername = currentUser ? ((currentUser as any).username || currentUser.email || '').trim().toLowerCase() : '';
              const isAuthor = Boolean(
                currentUser && (
                  (post.patientId && currentUser.id === post.patientId) ||
                  (post.authorName && myFullName && post.authorName.toLowerCase().trim() === myFullName) ||
                  (post.authorName && myUsername && post.authorName.toLowerCase().trim() === myUsername) ||
                  currentUser.userType === 'admin' ||
                  currentUser.userType === 'terapeuta'
                )
              );
              const isLiked = post.likes.includes(userName);
              const showComments = expandedComments[post.id];

              return (
                <View
                  key={post.id}
                  style={styles.feedPostCard}
                  onLayout={(e) => {
                    postLayoutsRef.current[String(post.id)] = {
                      y: e.nativeEvent.layout.y,
                      height: e.nativeEvent.layout.height,
                    };
                  }}
                >
                  <View style={styles.feedPostHeader}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        handleOpenUserProfile(
                          post.authorName,
                          post.authorAvatar,
                          post.authorRole,
                          post.patientId,
                          (post as any).authorCoverUrl || (post as any).coverPictureUrl
                        )
                      }
                      style={styles.feedAuthorAvatarRow}
                    >
                      <AuthorAvatar name={post.authorName} avatarUrl={post.authorAvatar} size={44} />
                      <View style={styles.feedAuthorMetaCol}>
                        <Text style={styles.feedAuthorNameText}>{post.authorName}</Text>
                        <View style={styles.authorRoleUnderNameRow}>
                          <View
                            style={[
                              styles.rolePillUnderName,
                              (post.authorRole || '').toUpperCase().includes('GUÍA') ||
                              (post.authorRole || '').toUpperCase().includes('GUIA') ||
                              (post.authorRole || '').toUpperCase().includes('TERAPEUTA') ||
                              (post.authorRole || '').toUpperCase().includes('PSICÓLOG') ||
                              (post.authorRole || '').toUpperCase().includes('ADMIN')
                                ? styles.rolePillTherapist
                                : styles.rolePillMember,
                            ]}
                          >
                            {(post.authorRole || '').toUpperCase().includes('GUÍA') ||
                            (post.authorRole || '').toUpperCase().includes('GUIA') ||
                            (post.authorRole || '').toUpperCase().includes('TERAPEUTA') ||
                            (post.authorRole || '').toUpperCase().includes('PSICÓLOG') ||
                            (post.authorRole || '').toUpperCase().includes('ADMIN') ? (
                              <ShieldCheck color="#047857" size={11} strokeWidth={2.5} />
                            ) : (
                              <Sparkles color="#64748B" size={10} strokeWidth={2.5} />
                            )}
                            <Text
                              style={[
                                styles.rolePillTextUnderName,
                                (post.authorRole || '').toUpperCase().includes('GUÍA') ||
                                (post.authorRole || '').toUpperCase().includes('GUIA') ||
                                (post.authorRole || '').toUpperCase().includes('TERAPEUTA') ||
                                (post.authorRole || '').toUpperCase().includes('PSICÓLOG') ||
                                (post.authorRole || '').toUpperCase().includes('ADMIN')
                                  ? styles.rolePillTextTherapist
                                  : styles.rolePillTextMember,
                              ]}
                            >
                              {(post.authorRole || '').toUpperCase().includes('GUÍA') ||
                              (post.authorRole || '').toUpperCase().includes('GUIA') ||
                              (post.authorRole || '').toUpperCase().includes('TERAPEUTA') ||
                              (post.authorRole || '').toUpperCase().includes('PSICÓLOG') ||
                              (post.authorRole || '').toUpperCase().includes('ADMIN')
                                ? 'Terapeuta'
                                : 'Miembro'}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.feedPostTimeText}>{post.createdAt}</Text>
                      </View>
                    </TouchableOpacity>

                    {isAuthor && (
                      <View style={styles.feedActionIconsRow}>
                        <TouchableOpacity
                          onPress={() => {
                            setEditingPost(post);
                            setEditingPostText(post.content);
                          }}
                          style={styles.iconBtnAction}
                          activeOpacity={0.7}
                        >
                          <Pencil color="#64748B" size={16} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDeletePost(post.id)}
                          style={styles.iconBtnAction}
                          activeOpacity={0.7}
                        >
                          <Trash2 color="#EF4444" size={16} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setSelectedDetailPost(post)}
                    style={styles.feedPostTextContainer}
                  >
                    {(() => {
                      const isLong = post.content && post.content.length > 180;
                      const isExpanded = !!expandedPostsText[post.id];
                      const displayedText = isLong && !isExpanded
                        ? `${post.content.slice(0, 170).trim()}...`
                        : post.content;

                      return (
                        <Text style={[styles.feedPostContentText, !post.image && styles.feedPostContentTextOnly]}>
                          {displayedText}
                          {isLong && (
                            <Text
                              onPress={() => setSelectedDetailPost(post)}
                              style={styles.readMoreHighlightBtn}
                            >
                              {'  Ver más...'}
                            </Text>
                          )}
                        </Text>
                      );
                    })()}
                    {post.feeling && (
                      <View style={styles.feelingTagInPost}>
                        <Text style={styles.feelingTagInPostText}>🌱 {post.feeling}</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {post.image && (
                    isVideoMedia(post.image) ? (
                      <CustomVideoPlayer
                        src={post.image}
                        fullBleed={true}
                        isActive={activeVideoPostId === post.id && !selectedDetailPost}
                        isMuted={isGlobalMuted}
                        onMuteChange={(muted) => setIsGlobalMuted(muted)}
                        loop={true}
                        height={Math.round(width * 0.95)}
                        contentFit="contain"
                        style={{ width: width }}
                      />
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => setSelectedDetailPost(post)}
                      >
                        <Image
                          source={{ uri: normalizeMediaUrl(post.image) || post.image }}
                          style={styles.feedPostImage}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    )
                  )}

                  <View style={styles.postFooterBar}>
                    <TouchableOpacity
                      onPress={() => handleToggleLike(post.id)}
                      style={[styles.postActionFooterBtn, isLiked && styles.postActionFooterBtnLiked]}
                      activeOpacity={0.8}
                    >
                      <Heart
                        color={isLiked ? '#EF4444' : '#64748B'}
                        size={18}
                        fill={isLiked ? '#EF4444' : 'transparent'}
                      />
                      <Text style={[styles.postActionFooterText, isLiked && styles.postActionFooterTextLiked]}>
                        {isLiked ? 'Iluminado' : 'Iluminar'} ({post.likes.length})
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setSelectedDetailPost(post)}
                      style={styles.postActionFooterBtn}
                      activeOpacity={0.75}
                    >
                      <MessageCircle color="#0D9488" size={18} />
                      <Text style={[styles.postActionFooterText, { color: '#0F766E' }]}>
                        Sembrados ({countTotalSembrados(post.comments)})
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setShareModalPost(post)}
                      style={styles.postActionFooterBtn}
                      activeOpacity={0.75}
                    >
                      <Share2 color="#0284C7" size={18} />
                      <Text style={[styles.postActionFooterText, { color: '#0369A1' }]}>
                        Compartir
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* PROGRESSIVE PAGINATION / LOAD MORE FOOTER */}
        {!loadingPosts && (
          <View style={styles.feedPaginationFooter}>
            {loadingMorePosts ? (
              <View style={styles.feedLoadingMoreRow}>
                <ActivityIndicator color="#059669" size="small" />
                <Text style={styles.feedLoadingMoreText}>Cargando más destellos de luz...</Text>
              </View>
            ) : hasMorePosts ? (
              <TouchableOpacity
                onPress={loadMorePosts}
                style={styles.feedLoadMoreBtn}
                activeOpacity={0.8}
              >
                <Sparkles color="#059669" size={15} style={{ marginRight: 6 }} />
                <Text style={styles.feedLoadMoreBtnText}>Cargar más destellos</Text>
              </TouchableOpacity>
            ) : posts.length >= 10 ? (
              <View style={styles.feedEndOfPostsBox}>
                <Sparkles color="#94A3B8" size={16} style={{ marginBottom: 4 }} />
                <Text style={styles.feedEndOfPostsText}>
                  ✨ Has llegado al final de los destellos recientes.
                </Text>
              </View>
            ) : null}
          </View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* --- MODAL: APPOINTMENT MODAL --- */}
      <Modal visible={showAppointmentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalIconBadge}>
                <Calendar color="#059669" size={24} />
              </View>
              <TouchableOpacity onPress={() => setShowAppointmentModal(false)} style={styles.closeModalBtn}>
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>Agendar Cita de Acompañamiento</Text>
            <Text style={styles.modalSubtitle}>
              {selectedTherapist ? `Especialista: ${selectedTherapist.name}` : 'Selecciona fecha y hora para tu sesión.'}
            </Text>

            <View style={styles.modalFormGroup}>
              <Text style={styles.modalInputLabel}>Fecha (AAAA-MM-DD)</Text>
              <TextInput value={appDate} onChangeText={setAppDate} style={styles.modalInput} />
            </View>

            <View style={styles.modalFormGroup}>
              <Text style={styles.modalInputLabel}>Hora preferida</Text>
              <TextInput value={appTime} onChangeText={setAppTime} style={styles.modalInput} />
            </View>

            <View style={styles.modalFormGroup}>
              <Text style={styles.modalInputLabel}>Motivo o notas adicionales (Opcional)</Text>
              <TextInput
                value={appNotes}
                onChangeText={setAppNotes}
                placeholder="Ej. Primera consulta, manejo de ansiedad..."
                placeholderTextColor="#94A3B8"
                multiline
                style={[styles.modalInput, { height: 70 }]}
              />
            </View>

            <TouchableOpacity onPress={handleBookAppointment} disabled={appLoading} style={styles.modalSubmitBtn}>
              {appLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <CheckCircle2 color="#FFFFFF" size={16} />
                  <Text style={styles.modalSubmitBtnText}>Confirmar Cita</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>



      {/* --- MODAL: EDIT POST MODAL --- */}
      <Modal visible={!!editingPost} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={[styles.modalIconBadge, { backgroundColor: '#F0F9FF' }]}>
                <Pencil color="#0284C7" size={22} />
              </View>
              <TouchableOpacity onPress={() => setEditingPost(null)} style={styles.closeModalBtn}>
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>Editar Destello de Luz</Text>
            <Text style={styles.modalSubtitle}>Modifica el contenido de tu publicación compartida.</Text>

            <TextInput
              value={editingPostText}
              onChangeText={setEditingPostText}
              placeholder="Escribe aquí las modificaciones..."
              placeholderTextColor="#94A3B8"
              multiline
              style={[styles.modalInput, { height: 110, textAlignVertical: 'top', marginTop: 10 }]}
            />

            <TouchableOpacity
              onPress={handleSaveEditPost}
              style={[styles.modalSubmitBtn, { marginTop: 16, backgroundColor: '#0284C7' }]}
            >
              <CheckCircle2 color="#FFFFFF" size={16} />
              <Text style={styles.modalSubmitBtnText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- MODAL: AUTHENTICATION MODAL --- */}
      <Modal visible={showAuthModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalIconBadge}>
                <Lock color="#059669" size={24} />
              </View>
              <TouchableOpacity onPress={() => setShowAuthModal(false)} style={styles.closeModalBtn}>
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalTabRow}>
              <TouchableOpacity
                onPress={() => setAuthMode('login')}
                style={[styles.modalTabBtn, authMode === 'login' && styles.modalTabBtnActive]}
              >
                <Text style={[styles.modalTabText, authMode === 'login' && styles.modalTabTextActive]}>Iniciar Sesión</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setAuthMode('register')}
                style={[styles.modalTabBtn, authMode === 'register' && styles.modalTabBtnActive]}
              >
                <Text style={[styles.modalTabText, authMode === 'register' && styles.modalTabTextActive]}>Registrarse</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>
              {authMode === 'login' ? 'Acceso a Conexión Luz®' : 'Crear Cuenta'}
            </Text>

            {authMode === 'register' && (
              <>
                <View style={styles.modalFormGroup}>
                  <Text style={styles.modalInputLabel}>Nombre</Text>
                  <TextInput
                    value={firstNameInput}
                    onChangeText={setFirstNameInput}
                    placeholder="Sofía"
                    placeholderTextColor="#94A3B8"
                    style={styles.modalInput}
                  />
                </View>
                <View style={styles.modalFormGroup}>
                  <Text style={styles.modalInputLabel}>Apellido</Text>
                  <TextInput
                    value={lastNameInput}
                    onChangeText={setLastNameInput}
                    placeholder="Varela"
                    placeholderTextColor="#94A3B8"
                    style={styles.modalInput}
                  />
                </View>
              </>
            )}

            <View style={styles.modalFormGroup}>
              <Text style={styles.modalInputLabel}>Correo Electrónico</Text>
              <TextInput
                value={emailInput}
                onChangeText={setEmailInput}
                placeholder="ejemplo@conexionluz.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.modalInput}
              />
            </View>

            <View style={styles.modalFormGroup}>
              <Text style={styles.modalInputLabel}>Contraseña</Text>
              <TextInput
                value={passwordInput}
                onChangeText={setPasswordInput}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                style={styles.modalInput}
              />
            </View>

            <TouchableOpacity onPress={handleAuthSubmit} disabled={authLoading} style={styles.modalSubmitBtn}>
              {authLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <LogIn color="#FFFFFF" size={16} />
                  <Text style={styles.modalSubmitBtnText}>
                    {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* PUBLIC USER PROFILE MODAL */}
      <UserProfileModal
        visible={showUserProfileModal}
        onClose={() => setShowUserProfileModal(false)}
        user={selectedUserProfile}
        userPosts={posts}
      />

      {/* LIVE CHAT MODAL */}
      <LiveChatModal
        visible={showLiveChatModal}
        onClose={() => setShowLiveChatModal(false)}
        onMessagesUpdated={(msgs) => setChatMessagesList(msgs)}
      />

      {/* NOTIFICATIONS MODAL */}
      <NotificationsModal
        visible={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        notifications={notificationsList}
        onMarkAllRead={async () => {
          await mobileApi.markNotificationsRead(true);
          setNotificationsList((prev) => prev.map((n) => ({ ...n, isRead: true })));
        }}
      />

      {/* ─── VENTANA EMERGENTE: SEMBRAR DESTELLO DE LUZ (MODAL INMEDIATO) ─── */}
      <Modal visible={showSparkModal} transparent animationType="fade">
        <View style={styles.sparkModalOverlay}>
          <View style={styles.sparkModalCard}>
            {/* Modal Header */}
            <View style={styles.sparkModalHeader}>
              <View style={styles.creatorHeaderBadgeRow}>
                <View style={styles.sparkModalIconCircle}>
                  <Sparkles color="#059669" size={18} />
                </View>
                <Text style={styles.sparkModalTitleText}>SEMBRAR UN DESTELLO DE LUZ</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setShowSparkModal(false);
                  setShowFeelingSelector(false);
                  setShowVideoUrlInput(false);
                }}
                style={styles.sparkModalCloseBtn}
                activeOpacity={0.7}
              >
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            {/* Community Notice */}
            <View style={styles.sparkCommunityNotice}>
              <Text style={styles.sparkCommunityNoticeText}>
                🌱 Las publicaciones en Conexión Luz son compartidas con toda la comunidad bajo respeto, empatía y sanación consciente.
              </Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {/* Text Input Row */}
              <View style={styles.creatorInputRow}>
                <AuthorAvatar
                  name={currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() : 'Tú'}
                  avatarUrl={currentUser?.avatarUrl || currentUser?.profilePictureUrl || ''}
                  size={42}
                />
                <TextInput
                  value={creatorText}
                  onChangeText={setCreatorText}
                  placeholder="Comparte una experiencia, intención, duda o aprendizaje con la comunidad..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  style={styles.creatorTextInput}
                />
              </View>

              {/* Selected Feeling Badge */}
              {selectedFeeling && (
                <View style={styles.selectedFeelingContainer}>
                  <Text style={styles.selectedFeelingPrompt}>Sintonía:</Text>
                  {(() => {
                    const feel = FEELINGS_LIST.find((f) => f.label === selectedFeeling);
                    return (
                      <View
                        style={[
                          styles.selectedFeelingPill,
                          { backgroundColor: feel?.bg || '#ECFDF5', borderColor: feel?.border || '#A7F3D0' },
                        ]}
                      >
                        <Text style={{ fontSize: 13, marginRight: 4 }}>{feel?.emoji}</Text>
                        <Text style={[styles.selectedFeelingPillText, { color: feel?.text || '#047857' }]}>
                          {feel?.label}
                        </Text>
                        <TouchableOpacity onPress={() => setSelectedFeeling(null)} style={{ marginLeft: 6 }}>
                          <X color={feel?.text || '#047857'} size={12} />
                        </TouchableOpacity>
                      </View>
                    );
                  })()}
                </View>
              )}

              {/* Selected Media Preview */}
              {selectedMediaUri && (
                <View style={styles.mediaPreviewWrapper}>
                  {selectedMediaType === 'video' || isVideoMedia(selectedMediaUri) ? (
                    <View style={styles.videoPreviewBox}>
                      <Video color="#9333EA" size={36} />
                      <Text style={styles.videoPreviewTitle}>Video listo en vista previa</Text>
                      <Text style={styles.videoPreviewSubtitle} numberOfLines={1}>
                        {selectedMediaUri.split('/').pop() || 'Video adjunto'}
                      </Text>
                    </View>
                  ) : (
                    <Image source={{ uri: selectedMediaUri }} style={styles.imagePreviewImage} resizeMode="cover" />
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedMediaUri(null);
                      setSelectedMediaType(null);
                    }}
                    style={styles.removeMediaFloatingBtn}
                    activeOpacity={0.8}
                  >
                    <X color="#FFFFFF" size={15} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Video URL Input Popover */}
              {showVideoUrlInput && (
                <View style={styles.videoUrlPopover}>
                  <View style={styles.videoUrlPopoverHeader}>
                    <Text style={styles.videoUrlPopoverTitle}>🔗 Pegar Enlace de Video (YouTube, Vimeo, MP4)</Text>
                    <TouchableOpacity onPress={() => setShowVideoUrlInput(false)}>
                      <X color="#94A3B8" size={15} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.videoUrlInputRow}>
                    <TextInput
                      value={videoUrlText}
                      onChangeText={setVideoUrlText}
                      placeholder="https://www.youtube.com/watch?v=..."
                      placeholderTextColor="#94A3B8"
                      style={styles.videoUrlInputField}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        if (videoUrlText.trim()) {
                          setSelectedMediaUri(videoUrlText.trim());
                          setSelectedMediaType('video');
                          setVideoUrlText('');
                          setShowVideoUrlInput(false);
                        }
                      }}
                      style={styles.videoUrlAttachBtn}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.videoUrlAttachBtnText}>Cargar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Feelings Selector Palette */}
              {showFeelingSelector && (
                <View style={styles.feelingsPaletteCard}>
                  <Text style={styles.feelingsPaletteHeading}>¿CUÁL ES TU SINTONÍA HOY?</Text>
                  <View style={styles.feelingsChipRow}>
                    {FEELINGS_LIST.map((feel) => (
                      <TouchableOpacity
                        key={feel.label}
                        onPress={() => {
                          setSelectedFeeling(feel.label);
                          setShowFeelingSelector(false);
                        }}
                        style={[
                          styles.feelingChipBtn,
                          { backgroundColor: feel.bg, borderColor: feel.border },
                          selectedFeeling === feel.label && styles.feelingChipBtnSelected,
                        ]}
                        activeOpacity={0.7}
                      >
                        <Text style={{ fontSize: 14, marginRight: 5 }}>{feel.emoji}</Text>
                        <Text style={[styles.feelingChipText, { color: feel.text }]}>{feel.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Bottom Actions Row */}
            <View style={styles.creatorBottomBar}>
              <View style={styles.creatorActionIconsList}>
                <TouchableOpacity
                  onPress={() => setShowFeelingSelector(!showFeelingSelector)}
                  style={[styles.creatorActionIconButton, showFeelingSelector && styles.creatorActionIconButtonActive]}
                  activeOpacity={0.7}
                >
                  <Sun color="#D97706" size={18} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handlePickImage}
                  style={styles.creatorActionIconButton}
                  activeOpacity={0.7}
                >
                  <LucideImage color="#0284C7" size={18} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handlePickVideo}
                  style={styles.creatorActionIconButton}
                  activeOpacity={0.7}
                >
                  <Video color="#9333EA" size={18} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowVideoUrlInput(!showVideoUrlInput)}
                  style={[styles.creatorActionIconButton, showVideoUrlInput && styles.creatorActionIconButtonActive]}
                  activeOpacity={0.7}
                >
                  <Sparkles color="#059669" size={18} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handlePublishPost}
                disabled={isPublishing || (!creatorText.trim() && !selectedMediaUri)}
                style={[
                  styles.creatorSubmitPostBtn,
                  (!creatorText.trim() && !selectedMediaUri) && styles.creatorSubmitPostBtnDisabled,
                ]}
                activeOpacity={0.85}
              >
                {isPublishing ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Send color="#FFFFFF" size={14} style={{ marginRight: 6 }} />
                    <Text style={styles.creatorSubmitPostBtnText}>Publicar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* POST DETAIL MODAL (FULL PUBLICATION & CONVERSATION) */}
      <PostDetailModal
        visible={!!selectedDetailPost}
        post={selectedDetailPost}
        onClose={() => setSelectedDetailPost(null)}
        currentUser={currentUser}
        isGuest={isGuest}
        onToggleLike={handleToggleLike}
        onAddComment={async (postId, text) => {
          await handleAddCommentFromDetail(postId, text);
        }}
        onToggleLikeComment={handleToggleLikeComment}
        onReplyComment={handleReplyComment}
        onOpenUserProfile={(name, avatar, role) => {
          setSelectedDetailPost(null);
          handleOpenUserProfile(name, avatar, role);
        }}
        isAuthor={Boolean(
          selectedDetailPost &&
            currentUser &&
            ((selectedDetailPost.patientId && currentUser.id === selectedDetailPost.patientId) ||
              (selectedDetailPost.authorName &&
                currentUser.firstName &&
                selectedDetailPost.authorName.toLowerCase().trim() ===
                  `${currentUser.firstName} ${currentUser.lastName || ''}`.toLowerCase().trim()) ||
              currentUser.userType === 'admin' ||
              currentUser.userType === 'terapeuta')
        )}
        onEditPost={(post) => {
          setSelectedDetailPost(null);
          setEditingPost(post);
          setEditingPostText(post.content);
        }}
        onDeletePost={(postId) => {
          setSelectedDetailPost(null);
          handleDeletePost(postId);
        }}
        onRequireAuth={() => {
          setSelectedDetailPost(null);
          setShowAuthModal(true);
        }}
      />

      {/* SHARE POST MODAL (UNIVERSAL LINK FOR WEB & MOBILE) */}
      <SharePostModal
        visible={!!shareModalPost}
        onClose={() => setShareModalPost(null)}
        postId={shareModalPost?.id}
        postContent={shareModalPost?.content}
        authorName={shareModalPost?.authorName}
      />

      {/* FLOATING ACTION BUTTON: RIGHT CORNER (+) FOR ADDING POSTS */}
      <TouchableOpacity
        style={styles.floatingAddPostFabRight}
        onPress={() => handleOpenSparkModal()}
        activeOpacity={0.85}
      >
        <Plus color="#FFFFFF" size={30} strokeWidth={2.6} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // 1. TOP HEADER BAR
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  brandLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitleText: {
    fontSize: 19,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: -0.2,
  },
  headerRightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  calendarPlusBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  infoNavbarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  // 2. SECTIONS & LABORATORIO
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeaderRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  sectionTitleLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sectionTitleLabelDark: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1E293B',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  verTodosLink: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },

  laboratorioGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  labCard: {
    width: '23.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  labIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labCardText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 6,
  },

  // 3. SEMILLA DE LUZ BANNER
  semillaLuzCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  semillaIconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  semillaTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0D9488',
    letterSpacing: 0.5,
  },
  semillaQuoteText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#1E293B',
    lineHeight: 18,
    marginTop: 2,
  },

  // 4. GUÍAS DE LUZ
  therapistsHorizontalList: {
    paddingRight: 8,
    marginBottom: 14,
  },
  therapistCard: {
    width: 135,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 14,
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  therapistAvatarWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  therapistAvatarImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  therapistFallbackAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineBadgeDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  therapistNameText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  therapistRoleText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 10,
  },
  agendarPillBtn: {
    backgroundColor: '#0D9488',
    borderRadius: 14,
    paddingVertical: 7,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
  },
  agendarPillBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  // 5. INTERACTIVE SPARK CREATOR
  creatorCardCollapsed: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  creatorCollapsedTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  creatorCollapsedInputPlaceholder: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  creatorCollapsedInputText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  creatorQuickShortcutsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  creatorQuickShortcutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  creatorShortcutIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorShortcutText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },

  // EXPANDED CREATOR CARD
  creatorCardExpanded: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  creatorExpandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  creatorHeaderBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  creatorHeaderTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.8,
  },
  creatorCloseBtn: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  creatorInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  creatorTextInput: {
    flex: 1,
    minHeight: 120,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    color: '#0F172A',
    lineHeight: 21,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  selectedFeelingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  selectedFeelingPrompt: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  selectedFeelingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectedFeelingPillText: {
    fontSize: 11,
    fontWeight: '800',
  },

  // Media Preview
  mediaPreviewWrapper: {
    position: 'relative',
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#0F172A',
  },
  imagePreviewImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
  },
  videoPreviewBox: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF5FF',
    borderRadius: 16,
  },
  videoPreviewTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B21A8',
    marginTop: 6,
  },
  videoPreviewSubtitle: {
    fontSize: 10,
    color: '#9333EA',
    marginTop: 2,
    maxWidth: '90%',
  },
  removeMediaFloatingBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 14,
    padding: 6,
    zIndex: 10,
  },

  // Video URL popover
  videoUrlPopover: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  videoUrlPopoverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  videoUrlPopoverTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#334155',
  },
  videoUrlInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  videoUrlInputField: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 11,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  videoUrlAttachBtn: {
    backgroundColor: '#9333EA',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoUrlAttachBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  // Feelings Palette
  feelingsPaletteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  feelingsPaletteHeading: {
    fontSize: 9,
    fontWeight: '900',
    color: '#94A3B8',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  feelingsChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  feelingChipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  feelingChipBtnSelected: {
    borderWidth: 2,
  },
  feelingChipText: {
    fontSize: 11,
    fontWeight: '800',
  },

  // Creator Toolbar
  creatorBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  creatorActionIconsList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  creatorActionIconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  creatorActionIconButtonActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  creatorSubmitPostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D9488',
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 14,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  creatorSubmitPostBtnDisabled: {
    opacity: 0.45,
    shadowOpacity: 0,
    elevation: 0,
  },
  creatorSubmitPostBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  feedPostsContainer: {
    marginHorizontal: -16,
    gap: 10,
    backgroundColor: '#F1F5F9',
  },
  feedPostCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%',
  },
  feedPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  feedAuthorAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  feedAuthorMetaCol: {
    justifyContent: 'center',
    flex: 1,
    gap: 2,
  },
  feedAuthorNameText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  authorRoleUnderNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  rolePillUnderName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rolePillTherapist: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  rolePillMember: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rolePillTextUnderName: {
    fontSize: 10,
    fontWeight: '800',
  },
  rolePillTextTherapist: {
    color: '#047857',
  },
  rolePillTextMember: {
    color: '#64748B',
  },
  feedPostTimeText: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 1,
  },
  feedActionIconsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBtnAction: {
    padding: 4,
  },
  feedPostTextContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  feedPostContentText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#334155',
  },
  feedPostContentTextOnly: {
    fontSize: 15,
    lineHeight: 24,
    color: '#0F172A',
    fontWeight: '500',
    paddingVertical: 4,
  },
  readMoreHighlightBtn: {
    color: '#059669',
    fontWeight: '800',
    fontSize: 14,
  },
  feelingTagInPost: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  feelingTagInPostText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  feedPostImage: {
    width: width,
    height: Math.round(width * 0.95),
    backgroundColor: '#020617',
    marginBottom: 10,
  },
  postFooterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },
  postActionFooterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  postActionFooterBtnLiked: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECDD3',
  },
  postActionFooterBtnActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  postActionFooterText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  postActionFooterTextLiked: {
    color: '#EF4444',
    fontWeight: '800',
  },
  commentsSection: {
    marginTop: 12,
    paddingTop: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },
  commentsHeaderInlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentsSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  expandToModalBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  expandToModalBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  noCommentsInlineText: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
    paddingVertical: 4,
  },
  commentThreadInline: {
    marginBottom: 6,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 8,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 8,
  },
  commentAuthorName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  commentContentText: {
    fontSize: 11,
    color: '#334155',
    marginTop: 2,
  },
  commentFooterRowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  commentTimeText: {
    fontSize: 9,
    color: '#94A3B8',
  },
  commentActionsRowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  commentLikeMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 1,
  },
  commentLikeMiniCount: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
  },
  commentReplyMiniBtn: {
    paddingVertical: 1,
  },
  commentReplyMiniText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '700',
  },
  inlineRepliesContainer: {
    marginLeft: 28,
    marginTop: 4,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#E2E8F0',
    gap: 4,
  },
  replyBubbleInline: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 6,
  },
  addCommentRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  addCommentInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 11,
    color: '#0F172A',
  },
  sendCommentBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  feedPaginationFooter: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedLoadingMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  feedLoadingMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  feedLoadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  feedLoadMoreBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
  },
  feedEndOfPostsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  feedEndOfPostsText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    textAlign: 'center',
  },

  // MODALS
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeModalBtn: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
  },
  modalFormGroup: {
    marginBottom: 10,
  },
  modalInputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#0F172A',
  },
  modalSubmitBtn: {
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  modalTabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  modalTabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  modalTabBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  modalTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  modalTabTextActive: {
    color: '#059669',
  },
  badgeCircle: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  // EMERGENT SPARK CREATOR MODAL (CENTERED DIALOG)
  sparkModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  sparkModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 440,
    maxHeight: '92%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 24,
  },
  sparkModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
    paddingHorizontal: 28,
  },
  sparkModalIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkModalTitleText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#065F46',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  sparkModalCloseBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    zIndex: 10,
  },
  sparkCommunityNotice: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  sparkCommunityNoticeText: {
    fontSize: 11,
    color: '#166534',
    lineHeight: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  // FLOATING ACTION BUTTON (RIGHT CORNER)
  floatingAddPostFabRight: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 9,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 999,
  },


});
