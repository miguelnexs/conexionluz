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
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { NotificationsModal } from '../../components/NotificationsModal';

const { width } = Dimensions.get('window');

interface Comment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

interface Post {
  id: string;
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

interface TherapistItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online?: boolean;
}

const THERAPISTS_LIST: TherapistItem[] = [
  {
    id: '1',
    name: 'Luz Amparo ...',
    role: 'Terapeuta',
    avatar: 'https://conexionluz.com/media/therapists/profile/luz_amparo.jpg',
    online: true,
  },
  {
    id: '2',
    name: 'Juan David ...',
    role: 'Terapeuta',
    avatar: 'https://conexionluz.com/media/therapists/profile/juan_david.jpg',
    online: true,
  },
  {
    id: '3',
    name: 'Valentina Ríos',
    role: 'Terapeuta',
    avatar: 'https://conexionluz.com/media/therapists/profile/valentina.jpg',
    online: false,
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

  if (normalizedUrl && !hasError) {
    return (
      <Image
        source={{ uri: normalizedUrl }}
        style={{ width: size, height: size, borderRadius: size / 2.5 }}
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
        borderRadius: size / 2.5,
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

const INITIAL_FALLBACK_POSTS: Post[] = [
  {
    id: '1',
    authorName: 'miguel angel valencia',
    authorAvatar: 'https://conexionluz.com/media/patients/profile/imagenjuan.png',
    authorRole: 'MIEMBRO',
    content:
      'La resiliencia no significa no sentir dolor o frustración; significa darnos permiso de sentir, aprender de la experiencia y continuar caminando con esperanza. Agradezco a cada uno de ustedes por hacer de Conexión Luz una comunidad más cálida y humana cada día. 🌟❤️',
    feeling: 'En calma',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    likes: ['Usuario'],
    comments: [],
    createdAt: 'Hace 18 horas',
  },
  {
    id: '2',
    authorName: 'Luz Amparo Valencia',
    authorAvatar: 'https://conexionluz.com/media/therapists/profile/luz_amparo.jpg',
    authorRole: 'TERAPEUTA',
    content:
      'Recordatorio para hoy: Respirar profundo 3 veces cuando sientas tensión en los hombros. Regálate ese espacio de luz y reconexión.',
    feeling: 'Inspirado/a',
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

  const [posts, setPosts] = useState<Post[]>(INITIAL_FALLBACK_POSTS);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
  const [newPostText, setNewPostText] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

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
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>([]);
  const [chatMessagesList, setChatMessagesList] = useState<ChatMessageItem[]>([]);

  const { isTabBarVisible, setIsTabBarVisible } = useTabBarVisibility();
  const lastScrollYRef = useRef<number>(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollYRef.current;

    // Keep visible near top of screen
    if (currentY <= 50) {
      if (!isTabBarVisible) setIsTabBarVisible(true);
      lastScrollYRef.current = currentY;
      return;
    }

    // Scroll Down -> Hide bottom tab links
    if (diff > 10 && isTabBarVisible) {
      setIsTabBarVisible(false);
    }
    // Scroll Up a little -> Show bottom tab links
    else if (diff < -6 && !isTabBarVisible) {
      setIsTabBarVisible(true);
    }

    lastScrollYRef.current = currentY;
  };

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      loadPostsFromBackend(),
      loadNotifications(),
      loadInitialChatMessages(),
    ]);
    setRefreshing(false);
  };

  const unreadNotificationsCount = notificationsList.filter((n) => !n.isRead).length;
  const unreadChatAdminCount = chatMessagesList.filter(
    (m) => m.sender === 'admin' && !m.isRead
  ).length;

  const loadNotifications = async () => {
    try {
      const res = await mobileApi.fetchNotifications();
      if (res.ok && Array.isArray(res.data)) {
        setNotificationsList(res.data);
      }
    } catch (e) {}
  };

  const loadInitialChatMessages = async () => {
    try {
      const res = await mobileApi.fetchChatMessages();
      if (res.ok && Array.isArray(res.data)) {
        setChatMessagesList(res.data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadPostsFromBackend();
    loadNotifications();
    loadInitialChatMessages();

    const interval = setInterval(() => {
      if (isAuthenticated) loadNotifications();
      loadInitialChatMessages();
    }, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const loadPostsFromBackend = async () => {
    setLoadingPosts(true);
    try {
      const res = await mobileApi.fetchCommunityPosts();
      if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
        const validItems = res.data.filter(
          (item: any) => (item.content && item.content.trim().length > 0) || item.imageUrl
        );
        const formattedPosts: Post[] = validItems.map((item: any) => ({
          id: String(item.id),
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
                authorName: c.authorName || 'Miembro',
                authorAvatar: normalizeMediaUrl(c.authorAvatarUrl || c.authorAvatar) || '',
                authorRole: (c.authorRole || 'MIEMBRO').toUpperCase(),
                content: c.content || '',
                createdAt: formatPostDate(c.createdAt),
              }))
            : [],
          createdAt: formatPostDate(item.createdAt),
        }));
        setPosts(formattedPosts);
      }
    } catch (e: any) {
      console.log('[Home] Exception loading posts:', e?.message || String(e));
    }
    setLoadingPosts(false);
  };

  const handleOpenUserProfile = (authorName: string, authorAvatar?: string, authorRole?: string) => {
    setSelectedUserProfile({ authorName, authorAvatar, authorRole });
    setShowUserProfileModal(true);
  };

  const handleCreatePost = async () => {
    if (isGuest) {
      setShowAuthModal(true);
      return;
    }
    if (!newPostText.trim()) {
      Alert.alert('Escribe un mensaje', 'Por favor ingresa tu reflexión para publicar.');
      return;
    }
    await mobileApi.createCommunityPost(newPostText.trim());
    setNewPostText('');
    setShowCreateModal(false);
    loadPostsFromBackend();
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
          return { ...post, likes: updatedLikes };
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
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const newComment: Comment = {
            id: `c-${Date.now()}`,
            authorName: userName,
            authorAvatar: currentUser?.avatarUrl || '',
            authorRole: 'MIEMBRO',
            content: text.trim(),
            createdAt: 'Justo ahora',
          };
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      })
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    mobileApi.commentCommunityPost(postId, text.trim());
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
      const res = await authRegister(
        firstNameInput.trim(),
        lastNameInput.trim(),
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
            onPress={() => {
              setSelectedTherapist(THERAPISTS_LIST[0]);
              setShowAppointmentModal(true);
            }}
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
        scrollEventThrottle={16}
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
            onPress={() => router.push('/(tabs)/actividades')}
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
            onPress={() => router.push('/(tabs)/actividades')}
            style={styles.labCard}
            activeOpacity={0.8}
          >
            <View style={[styles.labIconCircle, { backgroundColor: '#EEF2FF' }]}>
              <Dumbbell color="#6366F1" size={22} />
            </View>
            <Text style={styles.labCardText}>Ejercicios</Text>
          </TouchableOpacity>

          {/* CARD 3: DIARIO */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/actividades')}
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
            onPress={() => router.push('/(tabs)/actividades')}
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
          <TouchableOpacity onPress={() => router.push('/(tabs)/informacion')}>
            <Text style={styles.verTodosLink}>Ver todos →</Text>
          </TouchableOpacity>
        </View>

        {/* HORIZONTAL SCROLL OF THERAPISTS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.therapistsHorizontalList}
        >
          {THERAPISTS_LIST.map((therapist) => (
            <View key={therapist.id} style={styles.therapistCard}>
              <View style={styles.therapistAvatarWrapper}>
                <Image source={{ uri: therapist.avatar }} style={styles.therapistAvatarImage} />
                {therapist.online && <View style={styles.onlineBadgeDot} />}
              </View>

              <Text style={styles.therapistNameText} numberOfLines={1}>
                {therapist.name}
              </Text>
              <Text style={styles.therapistRoleText}>{therapist.role}</Text>

              <TouchableOpacity
                onPress={() => {
                  setSelectedTherapist(therapist);
                  setShowAppointmentModal(true);
                }}
                style={styles.agendarPillBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.agendarPillBtnText}>Agendar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* 5. DESTELLOS DE LA COMUNIDAD SECTION */}
        <View style={[styles.sectionHeaderRow, { marginTop: 18 }]}>
          <MessageCircle color="#64748B" size={18} style={{ marginRight: 6 }} />
          <Text style={styles.sectionTitleLabel}>DESTELLOS DE LA COMUNIDAD</Text>
        </View>

        {/* CREATE POST QUICK INPUT */}
        <TouchableOpacity
          onPress={() => {
            if (isGuest) {
              setShowAuthModal(true);
            } else {
              setShowCreateModal(true);
            }
          }}
          style={styles.createPostBoxCard}
          activeOpacity={0.9}
        >
          <View style={styles.createPostPillInput}>
            <AuthorAvatar
              name={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'miguel angel valencia'}
              avatarUrl={currentUser?.avatarUrl || 'https://conexionluz.com/media/patients/profile/imagenjuan.png'}
              size={34}
            />
            <Text style={styles.createPostPillText} numberOfLines={1}>
              ✨ Comparte un destello de luz, intención o reflexión...
            </Text>
            <Sparkles color="#38BDF8" size={18} />
          </View>
        </TouchableOpacity>

        {/* COMMUNITY FEED POSTS */}
        <View style={styles.feedPostsContainer}>
          {posts.map((post) => {
            const userName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : 'Tú';
            const isLiked = post.likes.includes(userName);
            const showComments = expandedComments[post.id];

            return (
              <View key={post.id} style={styles.feedPostCard}>
                <View style={styles.feedPostHeader}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleOpenUserProfile(post.authorName, post.authorAvatar, post.authorRole)}
                    style={styles.feedAuthorAvatarRow}
                  >
                    <AuthorAvatar name={post.authorName} avatarUrl={post.authorAvatar} size={44} />
                    <View style={styles.feedAuthorMetaCol}>
                      <View style={styles.feedAuthorNameBadgeRow}>
                        <Text style={styles.feedAuthorNameText}>{post.authorName}</Text>
                        <View style={styles.miembroRoleBadge}>
                          <Text style={styles.miembroRoleBadgeText}>{post.authorRole || 'MIEMBRO'}</Text>
                        </View>
                      </View>
                      <Text style={styles.feedPostTimeText}>{post.createdAt}</Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.feedActionIconsRow}>
                    <TouchableOpacity
                      onPress={() => {
                        if (isGuest) setShowAuthModal(true);
                        else Alert.alert('Editar publicación', 'Puedes modificar tu mensaje.');
                      }}
                      style={styles.iconBtnAction}
                    >
                      <Pencil color="#64748B" size={16} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (isGuest) setShowAuthModal(true);
                        else
                          Alert.alert('Eliminar publicación', '¿Deseas eliminar este destello?', [
                            { text: 'Cancelar', style: 'cancel' },
                            {
                              text: 'Eliminar',
                              style: 'destructive',
                              onPress: () => setPosts((prev) => prev.filter((p) => p.id !== post.id)),
                            },
                          ]);
                      }}
                      style={styles.iconBtnAction}
                    >
                      <Trash2 color="#64748B" size={16} />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.feedPostContentText}>{post.content}</Text>
                {post.image && (
                  <Image source={{ uri: post.image }} style={styles.feedPostImage} resizeMode="cover" />
                )}

                <View style={styles.postFooterBar}>
                  <TouchableOpacity
                    onPress={() => handleToggleLike(post.id)}
                    style={[styles.postActionFooterBtn, isLiked && styles.postActionFooterBtnLiked]}
                  >
                    <Heart color={isLiked ? '#EF4444' : '#64748B'} size={18} fill={isLiked ? '#EF4444' : 'transparent'} />
                    <Text style={[styles.postActionFooterText, isLiked && styles.postActionFooterTextLiked]}>
                      {isLiked ? 'Iluminado' : 'Iluminar'} ({post.likes.length})
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      if (isGuest) {
                        setShowAuthModal(true);
                      } else {
                        setExpandedComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }));
                      }
                    }}
                    style={styles.postActionFooterBtn}
                  >
                    <MessageCircle color="#64748B" size={18} />
                    <Text style={styles.postActionFooterText}>Comentarios ({post.comments.length})</Text>
                  </TouchableOpacity>
                </View>

                {showComments && (
                  <View style={styles.commentsSection}>
                    {post.comments.map((c) => (
                      <View key={c.id} style={styles.commentItem}>
                        <AuthorAvatar name={c.authorName} avatarUrl={c.authorAvatar} size={28} />
                        <View style={styles.commentBubble}>
                          <Text style={styles.commentAuthorName}>{c.authorName}</Text>
                          <Text style={styles.commentContentText}>{c.content}</Text>
                          <Text style={styles.commentTimeText}>{c.createdAt}</Text>
                        </View>
                      </View>
                    ))}

                    <View style={styles.addCommentRow}>
                      <TextInput
                        value={commentInputs[post.id] || ''}
                        onChangeText={(t) => setCommentInputs({ ...commentInputs, [post.id]: t })}
                        placeholder="Escribe un comentario..."
                        placeholderTextColor="#94A3B8"
                        style={styles.addCommentInput}
                      />
                      <TouchableOpacity onPress={() => handleAddComment(post.id)} style={styles.sendCommentBtn}>
                        <Send color="#FFFFFF" size={14} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

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

      {/* --- MODAL: CREATE POST MODAL --- */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalIconBadge}>
                <Sparkles color="#059669" size={24} />
              </View>
              <TouchableOpacity onPress={() => setShowCreateModal(false)} style={styles.closeModalBtn}>
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>Compartir un Destello de Luz</Text>
            <Text style={styles.modalSubtitle}>Escribe tu reflexión, intención o aprendizaje para la comunidad.</Text>

            <TextInput
              value={newPostText}
              onChangeText={setNewPostText}
              placeholder="Escribe aquí tu mensaje..."
              placeholderTextColor="#94A3B8"
              multiline
              style={[styles.modalInput, { height: 110, textAlignVertical: 'top', marginTop: 10 }]}
            />

            <TouchableOpacity onPress={handleCreatePost} style={[styles.modalSubmitBtn, { marginTop: 16 }]}>
              <Send color="#FFFFFF" size={16} />
              <Text style={styles.modalSubmitBtnText}>Publicar en Muro</Text>
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

      {/* FLOATING LIVE CHAT ACTION BUTTON (FAB) */}
      <TouchableOpacity
        style={styles.floatingChatFab}
        onPress={() => setShowLiveChatModal(true)}
        activeOpacity={0.85}
      >
        <MessageCircle color="#FFFFFF" size={24} />
        {unreadChatAdminCount > 0 && (
          <View style={styles.fabBadgeCircle}>
            <Text style={styles.fabBadgeText}>
              {unreadChatAdminCount > 9 ? '9+' : unreadChatAdminCount}
            </Text>
          </View>
        )}
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
    backgroundColor: '#0D9488',
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

  // 5. CREATE POST & FEED
  createPostBoxCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  createPostPillInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
  },
  createPostPillText: {
    flex: 1,
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },

  feedPostsContainer: {
    gap: 14,
  },
  feedPostCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  feedPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  feedAuthorAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  feedAuthorMetaCol: {
    justifyContent: 'center',
  },
  feedAuthorNameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  feedAuthorNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  miembroRoleBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  miembroRoleBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
  },
  feedPostTimeText: {
    fontSize: 10,
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
  feedPostContentText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#334155',
    marginBottom: 12,
  },
  feedPostImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 12,
  },
  postFooterBar: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  postActionFooterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postActionFooterBtnLiked: {},
  postActionFooterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  postActionFooterTextLiked: {
    color: '#EF4444',
  },
  commentsSection: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
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
  commentTimeText: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 4,
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
  floatingChatFab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0D9488',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    zIndex: 999,
  },
  fabBadgeCircle: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#F43F5E',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  fabBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
});
