import React, { useState, useEffect, useCallback } from 'react';
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
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  User,
  Activity,
  BookOpen,
  Settings,
  LogOut,
  Sparkles,
  CheckCircle2,
  Lock,
  Camera,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Heart,
  Shield,
  Save,
  LogIn,
  UserPlus,
  ShieldCheck,
  X,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  PlayCircle,
  MessageCircle,
  Share2,
  TreeDeciduous,
  Clock,
  RotateCcw,
  Zap,
  Plus,
  Image as ImageIcon,
  Send,
  Smile,
  TrendingUp,
  Flame,
  Award,
  Info,
} from 'lucide-react-native';
import { mobileApi, PatientUser, normalizeMediaUrl } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { PostDetailModal, PostDetailItem, countTotalSembrados } from '../../components/PostDetailModal';
import { SharePostModal } from '../../components/SharePostModal';
import { LumiHeaderBadge } from '../../components/LumiHeaderBadge';
import { LumiWalletModal } from '../../components/LumiWalletModal';

const { width } = Dimensions.get('window');

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  city: string;
  occupation: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  portalWelcomeTitle: string;
  portalWelcomeMessage: string;
  portalAccentColor: string;
}

// ─── Question Tree Data Definition for AWE Calibration ─────────────────────────
type TreeNodeOption = {
  id: string;
  label: string;
  emoji: string;
  description: string;
  nextNodeId: string;
  scores: { stress: number; mood: number; sleep: number; energy: number; focus: number };
};

type TreeNode = {
  id: string;
  stepNumber: number;
  stageName: string;
  icon: string;
  title: string;
  subtitle: string;
  compassionNote: string;
  options: TreeNodeOption[];
};

const QUESTION_TREE: Record<string, TreeNode> = {
  root: {
    id: 'root',
    stepNumber: 1,
    stageName: 'Área de Enfoque Principal',
    icon: '🌱',
    title: '¿Cuál es tu prioridad o necesidad principal en este momento?',
    subtitle: 'Cada proceso es único. Selecciona el camino que mejor representa lo que deseas transformar o cuidar hoy.',
    compassionNote: 'Tómate un momento para respirar. No hay respuestas correctas o incorrectas, solo tu sentir honesto.',
    options: [
      {
        id: 'opt_stress',
        label: 'Estrés y Carga Mental',
        emoji: '🌪️',
        description: 'Tensión acumulada, agobio diario, pensamientos acelerados o ansiedad.',
        nextNodeId: 'node_stress_focus',
        scores: { stress: 40, mood: 20, sleep: 25, energy: 20, focus: 25 },
      },
      {
        id: 'opt_mood',
        label: 'Estado de Ánimo y Emociones',
        emoji: '🌤️',
        description: 'Sentimientos de tristeza, desánimo, apatía o búsqueda de equilibrio interior.',
        nextNodeId: 'node_mood_focus',
        scores: { stress: 20, mood: 45, sleep: 20, energy: 25, focus: 20 },
      },
      {
        id: 'opt_sleep',
        label: 'Descanso y Vitalidad Física',
        emoji: '🌙',
        description: 'Insomnio, cansancio crónico, falta de energía o sueño no reparador.',
        nextNodeId: 'node_sleep_focus',
        scores: { stress: 25, mood: 20, sleep: 50, energy: 40, focus: 20 },
      },
      {
        id: 'opt_growth',
        label: 'Claridad y Crecimiento Espiritual',
        emoji: '🔮',
        description: 'Búsqueda de propósito, conexión interior, meditación y autoconocimiento.',
        nextNodeId: 'node_growth_focus',
        scores: { stress: 15, mood: 15, sleep: 15, energy: 30, focus: 45 },
      },
    ],
  },
  node_stress_focus: {
    id: 'node_stress_focus',
    stepNumber: 2,
    stageName: 'Manifestación del Estrés',
    icon: '⚡',
    title: '¿Cómo se manifiesta la tensión principalmente en tu vida?',
    subtitle: 'Identificar el canal por donde el cuerpo y la mente se expresan es el primer paso para sanar.',
    compassionNote: 'Reconocer lo que sentimos con honestidad libera gran parte de la presión acumulada.',
    options: [
      {
        id: 'opt_s_mental',
        label: 'En la Mente: Rumiación y Alerta',
        emoji: '🧠',
        description: 'Pensamientos en bucle, preocupación constante e incapacidad de desconectar.',
        nextNodeId: 'node_frequency',
        scores: { stress: 40, mood: 10, sleep: 20, energy: 15, focus: 30 },
      },
      {
        id: 'opt_s_body',
        label: 'En el Cuerpo: Rigidez y Tensión',
        emoji: '🔋',
        description: 'Tensión muscular en cuello o espalda, nudo en el pecho o estómago.',
        nextNodeId: 'node_frequency',
        scores: { stress: 35, mood: 15, sleep: 25, energy: 30, focus: 15 },
      },
      {
        id: 'opt_s_exhaustion',
        label: 'Agotamiento: Batería en Cero',
        emoji: '🪫',
        description: 'Sensación de estar sobrepasado(a) por las responsabilidades cotidianas.',
        nextNodeId: 'node_frequency',
        scores: { stress: 30, mood: 25, sleep: 30, energy: 40, focus: 20 },
      },
    ],
  },
  node_mood_focus: {
    id: 'node_mood_focus',
    stepNumber: 2,
    stageName: 'Exploración Emocional',
    icon: '🌧️',
    title: '¿Qué sensación emocional resuena más contigo hoy?',
    subtitle: 'Tus emociones son mensajeras de tu mundo interior.',
    compassionNote: 'Permítete sentir sin juzgarte. Todo estado es transitorio.',
    options: [
      {
        id: 'opt_m_sadness',
        label: 'Tristeza o Pérdida de Ilusión',
        emoji: '💧',
        description: 'Falta de motivación, melancolía o sensación de vacío.',
        nextNodeId: 'node_frequency',
        scores: { stress: 15, mood: 45, sleep: 25, energy: 30, focus: 20 },
      },
      {
        id: 'opt_m_lonely',
        label: 'Desconexión o Soledad',
        emoji: '🍃',
        description: 'Sentir que nadie comprende lo que estás pasando realmente.',
        nextNodeId: 'node_frequency',
        scores: { stress: 20, mood: 40, sleep: 15, energy: 20, focus: 25 },
      },
      {
        id: 'opt_m_frustration',
        label: 'Frustración e Impotencia',
        emoji: '🌋',
        description: 'Sensación de que las cosas no avanzan al ritmo que deseas.',
        nextNodeId: 'node_frequency',
        scores: { stress: 35, mood: 35, sleep: 20, energy: 25, focus: 25 },
      },
    ],
  },
  node_sleep_focus: {
    id: 'node_sleep_focus',
    stepNumber: 2,
    stageName: 'Patrón de Descanso',
    icon: '🌙',
    title: '¿Cómo experimentas tus dificultades con el descanso?',
    subtitle: 'El sueño es el pilar de la regeneración física, mental y emocional.',
    compassionNote: 'Tu cuerpo sabe cómo descansar; solo necesita reencontrar su ritmo natural.',
    options: [
      {
        id: 'opt_sl_start',
        label: 'Dificultad para Conciliar el Sueño',
        emoji: '🦉',
        description: 'Dar vueltas en la cama con la mente activa por horas.',
        nextNodeId: 'node_frequency',
        scores: { stress: 35, mood: 15, sleep: 45, energy: 25, focus: 25 },
      },
      {
        id: 'opt_sl_wake',
        label: 'Despertares Nocturnos Frecuentes',
        emoji: '⏰',
        description: 'Despertar a mitad de la noche con dificultad para volver a dormir.',
        nextNodeId: 'node_frequency',
        scores: { stress: 25, mood: 20, sleep: 45, energy: 35, focus: 20 },
      },
      {
        id: 'opt_sl_tired',
        label: 'Cansancio al Despertar',
        emoji: '🥱',
        description: 'Dormir suficientes horas pero sentir que no fue reparador.',
        nextNodeId: 'node_frequency',
        scores: { stress: 20, mood: 20, sleep: 40, energy: 45, focus: 25 },
      },
    ],
  },
  node_growth_focus: {
    id: 'node_growth_focus',
    stepNumber: 2,
    stageName: 'Búsqueda Interior',
    icon: '✨',
    title: '¿Hacia dónde se orienta tu búsqueda en este momento?',
    subtitle: 'El crecimiento personal florece cuando conectamos con lo que es auténtico para nosotros.',
    compassionNote: 'Cada paso de autoconocimiento es un acto de amor hacia ti mismo(a).',
    options: [
      {
        id: 'opt_g_purpose',
        label: 'Claridad en Mi Propósito',
        emoji: '🧭',
        description: 'Encontrar dirección, sentido y foco en mis metas personales.',
        nextNodeId: 'node_frequency',
        scores: { stress: 15, mood: 20, sleep: 10, energy: 25, focus: 45 },
      },
      {
        id: 'opt_g_peace',
        label: 'Paz Interior y Meditación',
        emoji: '🕊️',
        description: 'Aprender a silenciar el ruido mental y cultivar serenidad diaria.',
        nextNodeId: 'node_frequency',
        scores: { stress: 25, mood: 20, sleep: 20, energy: 20, focus: 40 },
      },
      {
        id: 'opt_g_healing',
        label: 'Sanación de Patrones del Pasado',
        emoji: '🌿',
        description: 'Soltar cargas antiguas y reconciliarme con mi historia personal.',
        nextNodeId: 'node_frequency',
        scores: { stress: 30, mood: 35, sleep: 20, energy: 20, focus: 30 },
      },
    ],
  },
  node_frequency: {
    id: 'node_frequency',
    stepNumber: 3,
    stageName: 'Frecuencia & Momento',
    icon: '⏳',
    title: '¿Con qué frecuencia sientes que esto impacta tu día a día?',
    subtitle: 'Comprender el ritmo nos ayuda a adaptar los ejercicios diarios del motor AWE.',
    compassionNote: 'Avanzamos un paso a la vez, con paciencia y respeto por tu proceso.',
    options: [
      {
        id: 'opt_f_daily',
        label: 'A Diario o Casi Todo el Tiempo',
        emoji: '🌊',
        description: 'Es una presencia constante que condiciona gran parte de mis actividades.',
        nextNodeId: 'finish',
        scores: { stress: 25, mood: 20, sleep: 20, energy: 25, focus: 20 },
      },
      {
        id: 'opt_f_weekly',
        label: 'Varias Veces por Semana',
        emoji: '🌤️',
        description: 'Aparece en momentos específicos de tensión o fatiga.',
        nextNodeId: 'finish',
        scores: { stress: 15, mood: 15, sleep: 15, energy: 15, focus: 15 },
      },
      {
        id: 'opt_f_occasional',
        label: 'Ocasionalmente / En Periodos Puntuales',
        emoji: '🍃',
        description: 'Ocurre ante cambios o situaciones extraordinarias.',
        nextNodeId: 'finish',
        scores: { stress: 10, mood: 10, sleep: 10, energy: 10, focus: 10 },
      },
    ],
  },
};

export default function Profile() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const { user: me, isAuthenticated: isAuthed, login: authLogin, register: authRegister, logout: authLogout, refreshUser, setUser } = useAuth();
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'wellbeing' | 'posts' | 'courses' | 'test' | 'settings'>('wellbeing');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [localCoverUri, setLocalCoverUri] = useState<string | null>(null);

  // Auth Modal state
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');

  // Daily Checkin state
  const [dailyEnergy, setDailyEnergy] = useState<string | null>(null);
  const [dailyMessage, setDailyMessage] = useState<string | null>(null);

  // AWE Profile Data from backend
  const [aweProfileData, setAweProfileData] = useState<{
    psych_profile?: string;
    current_emotions?: string[];
    risk_level?: string;
    preferred_moment?: string;
  } | null>(null);

  // User Posts
  const [userPosts, setUserPosts] = useState<PostDetailItem[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [selectedDetailPost, setSelectedDetailPost] = useState<PostDetailItem | null>(null);
  const [shareModalPost, setShareModalPost] = useState<PostDetailItem | null>(null);

  // New Post Creator Modal state
  const [showCreatePostModal, setShowCreatePostModal] = useState<boolean>(false);
  const [newPostContent, setNewPostContent] = useState<string>('');
  const [newPostFeeling, setNewPostFeeling] = useState<string>('🌱 En paz');
  const [newPostMediaUri, setNewPostMediaUri] = useState<string | null>(null);
  const [newPostMediaType, setNewPostMediaType] = useState<'image' | 'video' | null>(null);
  const [isPublishingPost, setIsPublishingPost] = useState<boolean>(false);
  const [showLumiWalletModal, setShowLumiWalletModal] = useState<boolean>(false);

  // Calibration Tree Wizard state
  const [currentNodeId, setCurrentNodeId] = useState<string>('root');
  const [pathHistory, setPathHistory] = useState<string[]>([]);
  const [accumulatedScores, setAccumulatedScores] = useState({
    stress: 0,
    mood: 0,
    sleep: 0,
    energy: 0,
    focus: 0,
  });
  const [submittingTest, setSubmittingTest] = useState(false);

  // Profile Form state
  const [form, setForm] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    city: '',
    occupation: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    portalWelcomeTitle: '',
    portalWelcomeMessage: '',
    portalAccentColor: '#059669',
  });

  // Sync profile form when auth user changes
  useEffect(() => {
    if (me) {
      setForm({
        firstName: me.firstName || '',
        lastName: me.lastName || '',
        email: me.email || '',
        phone: me.phone || '',
        birthDate: me.birthDate || '',
        gender: me.gender || '',
        city: me.city || '',
        occupation: me.occupation || '',
        address: me.address || '',
        emergencyContactName: me.emergencyContactName || '',
        emergencyContactPhone: me.emergencyContactPhone || '',
        portalWelcomeTitle: me.portalWelcomeTitle || '',
        portalWelcomeMessage: me.portalWelcomeMessage || '',
        portalAccentColor: me.portalAccentColor || '#059669',
      });
    }
  }, [me]);

  // Load User and Profile Data
  const loadProfileData = useCallback(async () => {
    if (!isAuthed) return;
    try {
      // 1. Daily check-in
      const checkRes = await mobileApi.getDailyCheckin();
      if (checkRes.ok && checkRes.data) {
        if (checkRes.data.energyLevel) {
          setDailyEnergy(checkRes.data.energyLevel);
        }
      }

      // 2. AWE profile
      const aweRes = await mobileApi.getAweProfile();
      if (aweRes.ok && aweRes.data && aweRes.data.profile) {
        setAweProfileData(aweRes.data.profile);
      }

      // 3. User Posts
      setLoadingPosts(true);
      const postsRes = await mobileApi.fetchCommunityPosts(true, 1, 50);
      if (postsRes.ok && Array.isArray(postsRes.data)) {
        if (!me) {
          setUserPosts([]);
        } else {
          const myId = me.id ? Number(me.id) : null;
          const myFullName = `${me.firstName || ''} ${me.lastName || ''}`.trim().toLowerCase();

          const filtered = postsRes.data.filter((p: any) => {
            // Strict ID match if present
            if (myId && p.patientId && Number(p.patientId) === myId) return true;
            if (myId && p.patient_id && Number(p.patient_id) === myId) return true;

            // Strict Full Name match only if length >= 3
            const pAuthor = (p.authorName || p.author_name || '').trim().toLowerCase();
            if (myFullName && myFullName.length >= 3 && pAuthor === myFullName) return true;

            return false;
          });
          setUserPosts(filtered);
        }
      } else {
        setUserPosts([]);
      }
    } catch (e) {
      console.warn('Error loading profile data:', e);
    } finally {
      setLoadingPosts(false);
    }
  }, [isAuthed, me]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  // Daily Checkin selection handler
  const handleSelectDailyEnergy = async (level: string) => {
    setDailyEnergy(level);
    if (level === 'tired') {
      setDailyMessage('Está bien necesitar una pausa. Tu cuerpo es sabio, escúchalo hoy. 💙');
    } else if (level === 'low') {
      setDailyMessage('Respira profundo. Recuerda que los días grises también pasan. Te abrazamos. 🌟');
    } else if (level === 'good') {
      setDailyMessage('¡Qué alegría! Mantén esa bonita energía durante todo tu día. ✨');
    } else if (level === 'high') {
      setDailyMessage('¡Estás radiante! Aprovecha este gran impulso para expandir tu luz. 🔥');
    }

    try {
      await mobileApi.submitDailyCheckin(level);
    } catch (e) {
      console.warn('Error submitting daily checkin:', e);
    }
  };

  // Image Upload handler
  const handlePickAndUploadAvatar = async () => {
    if (!isAuthed) {
      setShowAuthModal(true);
      return;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para cambiar tu foto.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        setUploadingPic(true);
        const uploadRes = await mobileApi.uploadProfilePicture(result.assets[0].uri);
        setUploadingPic(false);

        if (uploadRes.ok) {
          Alert.alert('¡Foto actualizada!', 'Tu nueva foto de perfil ha sido guardada.');
          await refreshUser();
        } else {
          Alert.alert('Error', uploadRes.error || 'No se pudo subir la foto.');
        }
      }
    } catch (e: any) {
      setUploadingPic(false);
      Alert.alert('Error', e?.message || 'Ocurrió un problema al seleccionar la imagen.');
    }
  };

  const [uploadingCover, setUploadingCover] = useState(false);

  // Profile Cover Upload handler
  const handlePickAndUploadCover = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para cambiar tu foto de portada.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        const pickedUri = result.assets[0].uri;
        setLocalCoverUri(pickedUri);
        setUploadingCover(true);
        const uploadRes = await mobileApi.uploadCoverPicture(pickedUri);
        setUploadingCover(false);

        if (uploadRes.ok) {
          const newCoverUrl = uploadRes.data?.coverPictureUrl || (uploadRes as any)?.coverPictureUrl;
          if (newCoverUrl && setUser) {
            setUser((prev: any) => (prev ? { ...prev, coverPictureUrl: newCoverUrl } : prev));
          }
          Alert.alert('¡Portada actualizada! 🌅', 'Tu nueva portada ha sido guardada exitosamente.');
          await refreshUser();
          await loadProfileData();
        } else {
          Alert.alert('Aviso', 'Tu foto de portada se actualizó localmente.');
        }
      }
    } catch (e: any) {
      setUploadingCover(false);
      Alert.alert('Error', e?.message || 'Ocurrió un problema al seleccionar la portada.');
    }
  };

  // Pick Media for New Post
  const handlePickMediaForPost = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para adjuntar archivos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        setNewPostMediaUri(result.assets[0].uri);
        setNewPostMediaType(result.assets[0].type === 'video' ? 'video' : 'image');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudo seleccionar el archivo');
    }
  };

  // Publish New Community Post
  const handlePublishPost = async () => {
    if (!newPostContent.trim()) {
      Alert.alert('Escribe algo', 'Por favor escribe tu reflexión o mensaje para sembrar en la comunidad.');
      return;
    }
    if (!isAuthed) {
      setShowAuthModal(true);
      return;
    }

    setIsPublishingPost(true);
    try {
      const res = await mobileApi.createCommunityPost(
        newPostContent.trim(),
        newPostFeeling,
        newPostMediaUri || undefined,
        newPostMediaType || undefined
      );

      if (res.ok) {
        Alert.alert('¡Destello Sembrado! ✨', 'Tu publicación ha sido compartida exitosamente.');
        setNewPostContent('');
        setNewPostMediaUri(null);
        setNewPostMediaType(null);
        setShowCreatePostModal(false);
        await loadProfileData();
      } else {
        Alert.alert('Error al publicar', res.error || 'No se pudo crear la publicación.');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Ocurrió un error inesperado al publicar.');
    } finally {
      setIsPublishingPost(false);
    }
  };

  // Profile Save handler
  const handleSaveProfile = async () => {
    if (!form.firstName.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa tu nombre.');
      return;
    }

    setSaving(true);
    const res = await mobileApi.updateProfile({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      birthDate: form.birthDate.trim(),
      gender: form.gender.trim(),
      city: form.city.trim(),
      occupation: form.occupation.trim(),
      address: form.address.trim(),
      emergencyContactName: form.emergencyContactName.trim(),
      emergencyContactPhone: form.emergencyContactPhone.trim(),
      portalWelcomeTitle: form.portalWelcomeTitle.trim(),
      portalWelcomeMessage: form.portalWelcomeMessage.trim(),
      portalAccentColor: form.portalAccentColor,
    });
    setSaving(false);

    if (res.ok) {
      Alert.alert('¡Cambios guardados!', 'Tu información de perfil ha sido actualizada exitosamente.');
      await refreshUser();
    } else {
      Alert.alert('Error al guardar', res.error || 'No se pudo guardar la información.');
    }
  };

  // Calibration Tree Wizard step handler
  const handleSelectOptionInTree = async (option: TreeNodeOption) => {
    const nextScores = {
      stress: accumulatedScores.stress + option.scores.stress,
      mood: accumulatedScores.mood + option.scores.mood,
      sleep: accumulatedScores.sleep + option.scores.sleep,
      energy: accumulatedScores.energy + option.scores.energy,
      focus: accumulatedScores.focus + option.scores.focus,
    };
    setAccumulatedScores(nextScores);

    if (option.nextNodeId === 'finish') {
      // Finish evaluation
      setSubmittingTest(true);
      try {
        const topCategory = Object.entries(nextScores).sort((a, b) => b[1] - a[1])[0][0];
        const psychProfile =
          topCategory === 'stress'
            ? 'Vigilante'
            : topCategory === 'mood'
            ? 'Caminante Emocional'
            : topCategory === 'sleep'
            ? 'Guerrero Agotado'
            : 'Buscador de Sentido';

        const intakeData = {
          psych_profile: psychProfile,
          risk_level: nextScores.stress > 50 ? 'intenso' : 'moderado',
          intakeSummary: `Tu diagnóstico refleja una búsqueda activa de autorregulación y balance en tu área de ${topCategory}. Tu motor AWE está calibrado para acompañarte en tu proceso con ejercicios diarios personalizados.`,
          scores: nextScores,
        };

        await mobileApi.submitIntake(intakeData);
        await refreshUser();
        await loadProfileData();
        Alert.alert('✨ ¡Calibración Completada!', 'Tu perfil de sabiduría AWE ha sido actualizado con éxito.');
        setActiveTab('wellbeing');
      } catch (e) {
        Alert.alert('Calibración registrada', 'Tus respuestas han sido procesadas.');
        setActiveTab('wellbeing');
      } finally {
        setSubmittingTest(false);
        setCurrentNodeId('root');
        setPathHistory([]);
      }
    } else {
      setPathHistory((prev) => [...prev, currentNodeId]);
      setCurrentNodeId(option.nextNodeId);
    }
  };

  const handleTreeBack = () => {
    if (pathHistory.length > 0) {
      const prevNode = pathHistory[pathHistory.length - 1];
      setPathHistory((prev) => prev.slice(0, prev.length - 1));
      setCurrentNodeId(prevNode);
    } else {
      setActiveTab('wellbeing');
    }
  };

  // Auth Submit
  const handleAuthSubmit = async () => {
    if (!emailInput.trim() || !passwordInput.trim()) {
      Alert.alert('Campos requeridos', 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    setAuthLoading(true);
    if (authMode === 'login') {
      const res = await authLogin(emailInput.trim(), passwordInput.trim());
      setAuthLoading(false);
      if (res.ok) {
        setShowAuthModal(false);
        loadProfileData();
      } else {
        Alert.alert('Error al entrar', res.error || 'Credenciales incorrectas');
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
        loadProfileData();
      } else {
        Alert.alert('Error de registro', res.error || 'No se pudo crear la cuenta');
      }
    }
  };

  const initials = me
    ? `${me.firstName?.[0] || ''}${me.lastName?.[0] || ''}`.toUpperCase()
    : 'CL';

  const accentColor = me?.portalAccentColor || '#059669';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      {/* ===== COVER BANNER SECTION ===== */}
      <View style={[styles.coverBannerContainer, { paddingTop: topPadding }]}>
        {(() => {
          const rawCover = localCoverUri || me?.coverPictureUrl || (me as any)?.cover_picture_url || (me as any)?.coverUrl;
          const coverSrc = normalizeMediaUrl(rawCover) || rawCover;
          if (isAuthed && coverSrc) {
            return <Image source={{ uri: coverSrc }} style={styles.coverBannerImage} resizeMode="cover" />;
          }
          return (
            <View style={styles.coverBannerFallback}>
              <Sparkles color="rgba(255, 255, 255, 0.25)" size={48} style={styles.coverSparkleIcon} />
            </View>
          );
        })()}

        <View style={styles.coverOverlayGradient} />

        {isAuthed && (
          <TouchableOpacity
            onPress={handlePickAndUploadCover}
            disabled={uploadingCover}
            style={[styles.editCoverFloatingBtn, { top: topPadding + 10 }]}
            activeOpacity={0.85}
          >
            {uploadingCover ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Camera color="#FFFFFF" size={13} strokeWidth={2.5} />
                <Text style={styles.editCoverFloatingBtnText}>Editar Portada</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* ===== HEADER HERO SECTION ===== */}
      <View style={[styles.profileHeader, { borderBottomColor: `${accentColor}25` }]}>
        <View style={styles.headerTopRow}>
          {/* AVATAR WITH CAMERA UPLOAD OVERLAPPING COVER */}
          <View style={styles.avatarWrapperContainer}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handlePickAndUploadAvatar}
              style={styles.avatarWrapper}
            >
              {(() => {
                const rawAvatar = me?.profilePictureUrl || me?.avatarUrl;
                const avatarSrc = normalizeMediaUrl(rawAvatar);
                if (isAuthed && avatarSrc) {
                  return <Image source={{ uri: avatarSrc }} style={styles.avatarImage} />;
                }
                return (
                  <View style={[styles.avatarInitialsBox, { backgroundColor: accentColor }]}>
                    {isAuthed ? (
                      <Text style={styles.avatarInitialsText}>{initials}</Text>
                    ) : (
                      <User color="#FFFFFF" size={32} />
                    )}
                  </View>
                );
              })()}

              {isAuthed && (
                <View style={[styles.cameraBadge, { backgroundColor: accentColor }]}>
                  {uploadingPic ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Camera color="#FFFFFF" size={12} strokeWidth={2.5} />
                  )}
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* USER INFO & GREETING */}
          <View style={styles.headerInfo}>
            <Text style={styles.welcomeTitle} numberOfLines={1}>
              {isAuthed && me
                ? me.portalWelcomeTitle || `Hola, ${me.firstName}`
                : 'Perfil de Usuario'}
            </Text>
            <Text style={styles.welcomeSubtitle} numberOfLines={2}>
              {isAuthed && me
                ? me.portalWelcomeMessage || 'Bienvenido(a) a tu espacio personal de sanación y crecimiento.'
                : 'Inicia sesión para gestionar tus datos, cursos y diagnósticos.'}
            </Text>

            <View style={styles.roleBadgeRow}>
              {isAuthed ? (
                <View style={styles.activeMemberBadge}>
                  <Sparkles color="#059669" size={12} />
                  <Text style={styles.activeMemberBadgeText}>
                    {me?.occupation?.trim() || (me?.userType === 'terapeuta' ? 'Terapeuta de Luz' : 'Miembro Conexión Luz®')}
                  </Text>
                </View>
              ) : (
                <View style={styles.guestBadge}>
                  <Lock color="#D97706" size={12} />
                  <Text style={styles.guestBadgeText}>Modo Invitado</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* QUICK ACTION BUTTONS */}
        <View style={styles.headerActionButtonsRow}>
          {isAuthed ? (
            <>
              <TouchableOpacity
                onPress={() => setActiveTab('test')}
                style={styles.calibrateAweBtn}
                activeOpacity={0.8}
              >
                <Sparkles color="#FFFFFF" size={14} />
                <Text style={styles.calibrateAweBtnText}>Calibrar Sabiduría AWE</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => authLogout()}
                style={styles.logoutBtn}
                activeOpacity={0.8}
              >
                <LogOut color="#EF4444" size={14} />
                <Text style={styles.logoutBtnText}>Salir</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={() => setShowAuthModal(true)}
              style={styles.loginHeaderCta}
              activeOpacity={0.85}
            >
              <LogIn color="#FFFFFF" size={16} />
              <Text style={styles.loginHeaderCtaText}>Iniciar Sesión / Entrar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ===== MAIN CONTENT AREA ===== */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!isAuthed ? (
          /* GUEST INVITATION CARD */
          <View style={styles.guestPromptContainer}>
            <View style={styles.loginInviteCard}>
              <View style={styles.inviteIconBox}>
                <Lock color="#059669" size={32} />
              </View>
              <Text style={styles.inviteTitle}>Tu Espacio Personal de Bienestar</Text>
              <Text style={styles.inviteDesc}>
                Inicia sesión para calibrar tu árbol de sabiduría AWE, registrar tu energía diaria, acceder a tus cursos y gestionar tu información en Conexión Luz®.
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                style={styles.mainLoginCtaBtn}
                activeOpacity={0.85}
              >
                <LogIn color="#FFFFFF" size={16} />
                <Text style={styles.mainLoginCtaText}>Iniciar Sesión</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setAuthMode('register');
                  setShowAuthModal(true);
                }}
                style={styles.mainRegisterCtaBtn}
                activeOpacity={0.85}
              >
                <UserPlus color="#059669" size={16} />
                <Text style={styles.mainRegisterCtaText}>Crear Cuenta Nueva</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {/* TAB SELECTION BAR */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsScrollContent}
              style={styles.tabsScrollView}
            >
              {[
                { id: 'wellbeing', label: 'Mi Espacio & Bienestar', icon: Activity },
                { id: 'progreso', label: 'Mi Progreso', icon: TrendingUp },
                { id: 'courses', label: 'Mis Cursos', icon: BookOpen },
                { id: 'test', label: 'Calibrar AWE', icon: TreeDeciduous },
                { id: 'settings', label: 'Ajustes', icon: Settings },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const IconComponent = tab.icon;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    onPress={() => {
                      if (tab.id === 'progreso') {
                        router.push('/progreso' as any);
                      } else {
                        setActiveTab(tab.id as any);
                      }
                    }}
                    style={[styles.tabPillBtn, isActive && styles.tabPillBtnActive]}
                    activeOpacity={0.8}
                  >
                    <IconComponent
                      color={isActive ? '#FFFFFF' : '#64748B'}
                      size={15}
                    />
                    <Text style={[styles.tabPillBtnText, isActive && styles.tabPillBtnTextActive]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* TAB 1: MI BIENESTAR & ESPACIO PERSONAL */}
            {activeTab === 'wellbeing' && (
              <View style={styles.tabPanel}>

                {/* 1.0 MI PROGRESO & EVOLUCIÓN HERO CARD (LIGHT THEME) */}
                <TouchableOpacity
                  onPress={() => router.push('/progreso' as any)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 22,
                    padding: 18,
                    marginBottom: 14,
                    borderWidth: 1.5,
                    borderColor: '#A7F3D0',
                    shadowColor: '#059669',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                  activeOpacity={0.88}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Sparkles color="#059669" size={14} />
                      <Text style={{ fontSize: 10.5, fontWeight: '900', color: '#059669', letterSpacing: 0.6 }}>
                        EVOLUCIÓN & AUTOCUIDADO
                      </Text>
                    </View>
                    <View style={{ backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#A7F3D0' }}>
                      <Text style={{ fontSize: 11, fontWeight: '900', color: '#047857' }}>🌸 Mente en Equilibrio</Text>
                    </View>
                  </View>

                  <Text style={{ fontSize: 16, fontWeight: '900', color: '#0F172A', marginBottom: 4 }}>
                    Mi Progreso Consciente
                  </Text>
                  <Text style={{ fontSize: 12, color: '#475569', lineHeight: 17, marginBottom: 12 }}>
                    Revisa tus rachas, insignias desbloqueadas, estadísticas de diario y tests clínicos completados.
                  </Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10 }}>
                    <Text style={{ fontSize: 12.5, fontWeight: '800', color: '#059669' }}>
                      Ver Mi Progreso Completo e Insignias
                    </Text>
                    <ArrowRight color="#059669" size={16} />
                  </View>
                </TouchableOpacity>
                
                {/* 1.1 ESTADO DE BIENESTAR Y MOTOR AWE CARD */}
                <View style={styles.aweCard}>
                  <View style={styles.aweCardHeaderRow}>
                    <View style={styles.aweIconBox}>
                      <Text style={{ fontSize: 22 }}>🌱</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.aweSubtitle}>CALIBRACIÓN ADAPTATIVA MOTOR AWE</Text>
                      <Text style={styles.aweTitle}>Tu Estado de Bienestar Actual</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setActiveTab('test')}
                      style={styles.recalibrateMiniBtn}
                      activeOpacity={0.7}
                    >
                      <Sparkles color="#059669" size={12} />
                      <Text style={styles.recalibrateMiniBtnText}>Re-evaluar</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.aweStatsGrid}>
                    {/* PERFIL TERAPÉUTICO */}
                    <View style={styles.aweStatBox}>
                      <Text style={styles.aweStatTag}>PERFIL TERAPÉUTICO</Text>
                      <View style={styles.aweStatValueRow}>
                        <Text style={{ fontSize: 18 }}>
                          {aweProfileData?.psych_profile === 'Vigilante'
                            ? '🧘'
                            : aweProfileData?.psych_profile === 'Guerrero Agotado'
                            ? '🔋'
                            : aweProfileData?.psych_profile === 'Corazón Abierto'
                            ? '🫂'
                            : aweProfileData?.psych_profile === 'Mente Analítica'
                            ? '🧠'
                            : '🌟'}
                        </Text>
                        <Text style={styles.aweStatValue}>
                          {aweProfileData?.psych_profile || 'Buscador de Sentido'}
                        </Text>
                      </View>
                      <Text style={styles.aweStatHint}>Personalizado según tus metas.</Text>
                    </View>

                    {/* CARGA EMOCIONAL */}
                    <View style={styles.aweStatBox}>
                      <Text style={styles.aweStatTag}>CARGA EMOCIONAL</Text>
                      <View style={styles.aweStatValueRow}>
                        <Text style={{ fontSize: 18 }}>
                          {aweProfileData?.risk_level === 'intenso' ? '⚡' : '🌤️'}
                        </Text>
                        <Text style={styles.aweStatValue}>
                          {aweProfileData?.risk_level === 'intenso' ? 'Intenso' : 'Moderado'}
                        </Text>
                      </View>
                      <Text style={styles.aweStatHint}>Graduación de ejercicios diarios.</Text>
                    </View>

                    {/* HORARIO PREFERIDO */}
                    <View style={styles.aweStatBox}>
                      <Text style={styles.aweStatTag}>HORARIO PREFERIDO</Text>
                      <View style={styles.aweStatValueRow}>
                        <Text style={{ fontSize: 18 }}>🌅</Text>
                        <Text style={styles.aweStatValue}>
                          {aweProfileData?.preferred_moment || 'Mañana & Noche'}
                        </Text>
                      </View>
                      <Text style={styles.aweStatHint}>Momento óptimo de reflexión.</Text>
                    </View>
                  </View>

                  {/* SÍNTOMAS Y EMOCIONES REGISTRADAS */}
                  <View style={styles.emotionsTagSection}>
                    <Text style={styles.emotionsSectionTitle}>
                      Síntomas y Emociones Frecuentes Registradas:
                    </Text>
                    <View style={styles.emotionsPillsRow}>
                      {[
                        { emoji: '🌀', label: 'Ansiedad o Inquietud' },
                        { emoji: '🔋', label: 'Agotamiento Físico/Mental' },
                        { emoji: '🌧️', label: 'Tristeza o Vacío' },
                        { emoji: '🌱', label: 'Deseo de Cambio & Esperanza' },
                      ].map((item, idx) => (
                        <View key={idx} style={styles.emotionPill}>
                          <Text style={{ fontSize: 13 }}>{item.emoji}</Text>
                          <Text style={styles.emotionPillText}>{item.label}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                {/* 1.2 CHECK-IN DIARIO DE ENERGÍA */}
                <View style={styles.checkinCard}>
                  <View style={styles.checkinHeaderRow}>
                    <Sparkles color="#F59E0B" size={16} />
                    <Text style={styles.checkinTag}>TU TERMÓMETRO EMOCIONAL</Text>
                  </View>
                  <Text style={styles.checkinTitle}>¿Cómo está tu energía hoy?</Text>
                  <Text style={styles.checkinDesc}>
                    Tómate una pausa y sé honesto/a contigo mismo/a. Este es un espacio seguro.
                  </Text>

                  <View style={styles.energyGrid}>
                    {[
                      { id: 'high', label: 'Radiante', emoji: '⚡', desc: 'Con mucha energía', color: '#F59E0B' },
                      { id: 'good', label: 'En calma', emoji: '🌱', desc: 'Tranquilo(a) y estable', color: '#10B981' },
                      { id: 'tired', label: 'Agotado/a', emoji: '🫂', desc: 'Necesito descansar', color: '#3B82F6' },
                      { id: 'low', label: 'Difícil', emoji: '🌧️', desc: 'Día gris o pesado', color: '#64748B' },
                    ].map((item) => {
                      const isSelected = dailyEnergy === item.id;
                      return (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => handleSelectDailyEnergy(item.id)}
                          style={[
                            styles.energyCardBtn,
                            isSelected && { borderColor: item.color, backgroundColor: `${item.color}15` },
                          ]}
                          activeOpacity={0.75}
                        >
                          <Text style={{ fontSize: 26 }}>{item.emoji}</Text>
                          <Text style={[styles.energyCardLabel, isSelected && { color: item.color, fontWeight: '900' }]}>
                            {item.label}
                          </Text>
                          <Text style={styles.energyCardDesc}>{item.desc}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {dailyMessage && (
                    <View style={styles.dailyFeedbackBox}>
                      <CheckCircle2 color="#059669" size={16} />
                      <Text style={styles.dailyFeedbackText}>{dailyMessage}</Text>
                    </View>
                  )}
                </View>

                {/* 1.3 MIS DESTELLOS Y REFLEXIONES EN LA COMUNIDAD (INMEDIATAMENTE DEBAJO) */}
                <View style={styles.myPostsSection}>
                  <View style={styles.postsHeadingRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                      <Sparkles color="#059669" size={16} />
                      <Text style={styles.postsHeadingText}>
                        MIS DESTELLOS Y REFLEXIONES ({userPosts.length})
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        if (!isAuthed) {
                          setShowAuthModal(true);
                          return;
                        }
                        setShowCreatePostModal(true);
                      }}
                      style={styles.newPostHeaderBtn}
                      activeOpacity={0.8}
                    >
                      <Plus color="#FFFFFF" size={13} strokeWidth={2.5} />
                      <Text style={styles.newPostHeaderBtnText}>Sembrar</Text>
                    </TouchableOpacity>
                  </View>

                  {loadingPosts ? (
                    <View style={styles.loadingBox}>
                      <ActivityIndicator color="#059669" size="small" />
                      <Text style={styles.loadingText}>Cargando tus destellos...</Text>
                    </View>
                  ) : userPosts.length === 0 ? (
                    <View style={styles.emptyPostsCard}>
                      <View style={styles.emptyPostsIconCircle}>
                        <Sparkles color="#059669" size={28} />
                      </View>
                      <Text style={styles.emptyPostsTitle}>Aún no has compartido destellos</Text>
                      <Text style={styles.emptyPostsDesc}>
                        Comparte tus sentires, reflexiones o preguntas con la comunidad desde aquí.
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          if (!isAuthed) {
                            setShowAuthModal(true);
                            return;
                          }
                          setShowCreatePostModal(true);
                        }}
                        style={styles.emptyPostCtaBtn}
                        activeOpacity={0.85}
                      >
                        <Plus color="#FFFFFF" size={16} strokeWidth={2.5} />
                        <Text style={styles.emptyPostCtaBtnText}>Sembrar mi primer destello</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    userPosts.map((post) => (
                      <TouchableOpacity
                        key={post.id}
                        activeOpacity={0.85}
                        onPress={() => setSelectedDetailPost(post)}
                        style={styles.userPostCard}
                      >
                        <View style={styles.userPostCardHeader}>
                          <View style={styles.userPostCardLeft}>
                            <Text style={styles.userPostTime}>{post.createdAt}</Text>
                            {post.feeling && (
                              <View style={styles.userPostFeelingPill}>
                                <Text style={styles.userPostFeelingText}>🌱 {post.feeling}</Text>
                              </View>
                            )}
                          </View>
                        </View>

                        <Text style={styles.userPostContent} numberOfLines={3}>
                          {post.content}
                        </Text>

                        {post.image && (
                          <Image source={{ uri: post.image }} style={styles.userPostThumb} resizeMode="cover" />
                        )}

                        <View style={styles.userPostFooter}>
                          <View style={styles.userPostStat}>
                            <Heart color="#EF4444" size={14} fill="#EF4444" />
                            <Text style={styles.userPostStatText}>
                              {Array.isArray(post.likes) ? post.likes.length : (post.likesCount || 0)} Iluminados
                            </Text>
                          </View>
                          <View style={styles.userPostStat}>
                            <MessageCircle color="#0D9488" size={14} />
                            <Text style={styles.userPostStatText}>
                              {countTotalSembrados(post.comments)} Sembrados
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => setShareModalPost(post)}
                            style={styles.userPostShareBtn}
                          >
                            <Share2 color="#0284C7" size={14} />
                            <Text style={styles.userPostShareBtnText}>Compartir</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </View>

              </View>
            )}

            {/* TAB 3: MIS CURSOS */}
            {activeTab === 'courses' && (
              <View style={styles.tabPanel}>
                <View style={styles.courseCard}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop' }}
                    style={styles.courseCover}
                  />
                  <View style={styles.courseBody}>
                    <Text style={styles.courseTag}>CURSO DISPONIBLE</Text>
                    <Text style={styles.courseTitle}>Hipnosis Interdimensional</Text>
                    <Text style={styles.courseDesc}>
                      Herramientas de reprogramación subconsciente y reconexión cuántica para la transformación personal.
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL('https://conexionluz.com/#/cursos/hipnosis-interdimencional');
                      }}
                      style={styles.courseCtaBtn}
                      activeOpacity={0.8}
                    >
                      <PlayCircle color="#FFFFFF" size={16} />
                      <Text style={styles.courseCtaBtnText}>Acceder al Curso</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {/* TAB 4: CALIBRAR AWE / ÁRBOL DE SABIDURÍA */}
            {activeTab === 'test' && (
              <View style={styles.tabPanel}>
                {(() => {
                  const node = QUESTION_TREE[currentNodeId] || QUESTION_TREE.root;
                  return (
                    <View style={styles.treeWizardCard}>
                      <View style={styles.treeWizardTopRow}>
                        <TouchableOpacity
                          onPress={handleTreeBack}
                          style={styles.treeBackBtn}
                          activeOpacity={0.7}
                        >
                          <ArrowLeft color="#0F172A" size={18} />
                          <Text style={styles.treeBackBtnText}>Atrás</Text>
                        </TouchableOpacity>
                        <View style={styles.treeStepBadge}>
                          <Text style={styles.treeStepBadgeText}>Paso {node.stepNumber} de 3</Text>
                        </View>
                      </View>

                      <View style={styles.treeHeaderBox}>
                        <Text style={{ fontSize: 32, marginBottom: 8 }}>{node.icon}</Text>
                        <Text style={styles.treeStageName}>{node.stageName.toUpperCase()}</Text>
                        <Text style={styles.treeQuestionTitle}>{node.title}</Text>
                        <Text style={styles.treeQuestionSubtitle}>{node.subtitle}</Text>
                      </View>

                      <View style={styles.treeOptionsList}>
                        {node.options.map((opt) => (
                          <TouchableOpacity
                            key={opt.id}
                            onPress={() => handleSelectOptionInTree(opt)}
                            disabled={submittingTest}
                            style={styles.treeOptionCard}
                            activeOpacity={0.8}
                          >
                            <Text style={{ fontSize: 26 }}>{opt.emoji}</Text>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.treeOptionLabel}>{opt.label}</Text>
                              <Text style={styles.treeOptionDesc}>{opt.description}</Text>
                            </View>
                            <ChevronRight color="#CBD5E1" size={18} />
                          </TouchableOpacity>
                        ))}
                      </View>

                      {submittingTest && (
                        <View style={styles.submittingBox}>
                          <ActivityIndicator color="#059669" size="small" />
                          <Text style={styles.submittingText}>Procesando tu calibración AWE...</Text>
                        </View>
                      )}

                      <View style={styles.treeCompassionBox}>
                        <Text style={styles.treeCompassionText}>🤍 {node.compassionNote}</Text>
                      </View>
                    </View>
                  );
                })()}
              </View>
            )}

            {/* TAB 5: AJUSTES & DATOS PERSONALES */}
            {activeTab === 'settings' && (
              <View style={styles.tabPanel}>
                <View style={styles.settingsFormCard}>
                  <View style={styles.settingsHeaderRow}>
                    <User color="#059669" size={20} />
                    <Text style={styles.settingsHeaderTitle}>Información Personal</Text>
                  </View>

                  <View style={styles.formGrid}>
                    <View style={styles.formField}>
                      <Text style={styles.fieldLabel}>Nombre</Text>
                      <TextInput
                        value={form.firstName}
                        onChangeText={(t) => setForm((p) => ({ ...p, firstName: t }))}
                        placeholder="Tu nombre"
                        style={styles.fieldInput}
                      />
                    </View>

                    <View style={styles.formField}>
                      <Text style={styles.fieldLabel}>Apellidos</Text>
                      <TextInput
                        value={form.lastName}
                        onChangeText={(t) => setForm((p) => ({ ...p, lastName: t }))}
                        placeholder="Tus apellidos"
                        style={styles.fieldInput}
                      />
                    </View>

                    <View style={styles.formField}>
                      <Text style={styles.fieldLabel}>Correo Electrónico</Text>
                      <TextInput
                        value={form.email}
                        editable={false}
                        style={[styles.fieldInput, { backgroundColor: '#F1F5F9', color: '#64748B' }]}
                      />
                    </View>

                    <View style={styles.formField}>
                      <Text style={styles.fieldLabel}>Teléfono</Text>
                      <TextInput
                        value={form.phone}
                        onChangeText={(t) => setForm((p) => ({ ...p, phone: t }))}
                        placeholder="+57 300 000 0000"
                        keyboardType="phone-pad"
                        style={styles.fieldInput}
                      />
                    </View>

                    <View style={styles.formField}>
                      <Text style={styles.fieldLabel}>Ocupación / Profesión</Text>
                      <TextInput
                        value={form.occupation}
                        onChangeText={(t) => setForm((p) => ({ ...p, occupation: t }))}
                        placeholder="Ej: Diseñadora, Terapeuta, etc."
                        style={styles.fieldInput}
                      />
                    </View>

                    <View style={styles.formField}>
                      <Text style={styles.fieldLabel}>Ciudad / País</Text>
                      <TextInput
                        value={form.city}
                        onChangeText={(t) => setForm((p) => ({ ...p, city: t }))}
                        placeholder="Ej: Bogotá, Colombia"
                        style={styles.fieldInput}
                      />
                    </View>

                    <View style={styles.formField}>
                      <Text style={styles.fieldLabel}>Dirección de Residencia</Text>
                      <TextInput
                        value={form.address}
                        onChangeText={(t) => setForm((p) => ({ ...p, address: t }))}
                        placeholder="Dirección completa"
                        style={styles.fieldInput}
                      />
                    </View>

                    <View style={styles.formDivider} />

                    <Text style={styles.sectionSubtitle}>Contacto de Emergencia</Text>

                    <View style={styles.formField}>
                      <Text style={styles.fieldLabel}>Nombre del Contacto</Text>
                      <TextInput
                        value={form.emergencyContactName}
                        onChangeText={(t) => setForm((p) => ({ ...p, emergencyContactName: t }))}
                        placeholder="Nombre completo"
                        style={styles.fieldInput}
                      />
                    </View>

                    <View style={styles.formField}>
                      <Text style={styles.fieldLabel}>Teléfono de Emergencia</Text>
                      <TextInput
                        value={form.emergencyContactPhone}
                        onChangeText={(t) => setForm((p) => ({ ...p, emergencyContactPhone: t }))}
                        placeholder="+57 300 000 0000"
                        keyboardType="phone-pad"
                        style={styles.fieldInput}
                      />
                    </View>

                    <View style={styles.formDivider} />

                    <Text style={styles.sectionSubtitle}>Personalización de Bienvenida</Text>

                    <View style={styles.formField}>
                      <Text style={styles.fieldLabel}>Título de Bienvenida</Text>
                      <TextInput
                        value={form.portalWelcomeTitle}
                        onChangeText={(t) => setForm((p) => ({ ...p, portalWelcomeTitle: t }))}
                        placeholder="Ej: Hola, Sofía"
                        style={styles.fieldInput}
                      />
                    </View>

                    <View style={styles.formField}>
                      <Text style={styles.fieldLabel}>Mensaje Inspiracional</Text>
                      <TextInput
                        value={form.portalWelcomeMessage}
                        onChangeText={(t) => setForm((p) => ({ ...p, portalWelcomeMessage: t }))}
                        placeholder="Tu mensaje motivacional del día"
                        multiline
                        numberOfLines={3}
                        style={[styles.fieldInput, { height: 80, textAlignVertical: 'top' }]}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={handleSaveProfile}
                    disabled={saving}
                    style={styles.saveProfileBtn}
                    activeOpacity={0.85}
                  >
                    {saving ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <Save color="#FFFFFF" size={16} />
                        <Text style={styles.saveProfileBtnText}>Guardar Cambios</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* ===== POST DETAIL MODAL (WHEN VIEWING A PUBLICATION) ===== */}
      <PostDetailModal
        visible={!!selectedDetailPost}
        post={selectedDetailPost}
        onClose={() => setSelectedDetailPost(null)}
        currentUser={me}
        isGuest={!isAuthed}
        onToggleLike={() => {}}
        onAddComment={async () => {}}
      />

      {/* ===== SHARE POST MODAL ===== */}
      <SharePostModal
        visible={!!shareModalPost}
        onClose={() => setShareModalPost(null)}
        postId={shareModalPost?.id}
        postContent={shareModalPost?.content}
        authorName={shareModalPost?.authorName}
      />

      {/* ===== AUTH MODAL (LOGIN / REGISTER) ===== */}
      <Modal
        visible={showAuthModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAuthModal(false)}
      >
        <View style={styles.authModalOverlay}>
          <View style={styles.authModalContent}>
            <View style={styles.authModalHeader}>
              <Text style={styles.authModalTitle}>
                {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </Text>
              <TouchableOpacity onPress={() => setShowAuthModal(false)} style={styles.closeAuthModalBtn}>
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.authModeToggleRow}>
              <TouchableOpacity
                onPress={() => setAuthMode('login')}
                style={[styles.authToggleBtn, authMode === 'login' && styles.authToggleBtnActive]}
              >
                <Text style={[styles.authToggleBtnText, authMode === 'login' && styles.authToggleBtnTextActive]}>
                  Ingresar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAuthMode('register')}
                style={[styles.authToggleBtn, authMode === 'register' && styles.authToggleBtnActive]}
              >
                <Text style={[styles.authToggleBtnText, authMode === 'register' && styles.authToggleBtnTextActive]}>
                  Registrarse
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              {authMode === 'register' && (
                <>
                  <View style={styles.authInputField}>
                    <Text style={styles.authInputLabel}>Nombre</Text>
                    <TextInput
                      value={firstNameInput}
                      onChangeText={setFirstNameInput}
                      placeholder="Tu nombre"
                      style={styles.authTextInput}
                    />
                  </View>
                  <View style={styles.authInputField}>
                    <Text style={styles.authInputLabel}>Apellidos</Text>
                    <TextInput
                      value={lastNameInput}
                      onChangeText={setLastNameInput}
                      placeholder="Tus apellidos"
                      style={styles.authTextInput}
                    />
                  </View>
                </>
              )}

              <View style={styles.authInputField}>
                <Text style={styles.authInputLabel}>Correo Electrónico</Text>
                <TextInput
                  value={emailInput}
                  onChangeText={setEmailInput}
                  placeholder="ejemplo@conexionluz.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.authTextInput}
                />
              </View>

              <View style={styles.authInputField}>
                <Text style={styles.authInputLabel}>Contraseña</Text>
                <TextInput
                  value={passwordInput}
                  onChangeText={setPasswordInput}
                  placeholder="Tu contraseña secreta"
                  secureTextEntry
                  style={styles.authTextInput}
                />
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={handleAuthSubmit}
              disabled={authLoading}
              style={styles.authSubmitBtn}
              activeOpacity={0.85}
            >
              {authLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.authSubmitBtnText}>
                  {authMode === 'login' ? 'Entrar a Mi Perfil' : 'Completar Registro'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ===== MODAL: SEMBRAR NUEVO DESTELLO ===== */}
      <Modal
        visible={showCreatePostModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreatePostModal(false)}
      >
        <View style={styles.authModalOverlay}>
          <View style={[styles.authModalContent, { maxHeight: '90%' }]}>
            <View style={styles.authModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Sparkles color="#059669" size={20} />
                <Text style={styles.authModalTitle}>Sembrar Destello</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowCreatePostModal(false)}
                style={styles.closeAuthModalBtn}
              >
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* SELECTOR DE SENTIR / EMOCIÓN */}
              <Text style={styles.createModalSectionLabel}>¿CÓMO VIBRA TU SENTIR?</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.feelingsScrollContent}
                style={{ marginBottom: 12 }}
              >
                {[
                  '🌱 En paz',
                  '✨ Gratitud',
                  '💡 Reflexión',
                  '🕊️ Sanación',
                  '❤️ Amor propio',
                  '🔥 Fuerza interior',
                  '🌊 Desahogo',
                ].map((feel) => {
                  const isSelected = newPostFeeling === feel;
                  return (
                    <TouchableOpacity
                      key={feel}
                      onPress={() => setNewPostFeeling(feel)}
                      style={[
                        styles.feelingPillOption,
                        isSelected && styles.feelingPillOptionActive,
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.feelingPillText,
                          isSelected && styles.feelingPillTextActive,
                        ]}
                      >
                        {feel}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* INPUT DE CONTENIDO */}
              <Text style={styles.createModalSectionLabel}>TU MENSAJE O REFLEXIÓN</Text>
              <TextInput
                value={newPostContent}
                onChangeText={setNewPostContent}
                placeholder="Escribe lo que nace de tu corazón para compartir con la comunidad..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                style={styles.createPostTextInput}
                textAlignVertical="top"
              />

              {/* ADJUNTAR IMAGEN / VIDEO */}
              {newPostMediaUri ? (
                <View style={styles.mediaPreviewContainer}>
                  <Image source={{ uri: newPostMediaUri }} style={styles.mediaPreviewThumb} resizeMode="cover" />
                  <TouchableOpacity
                    onPress={() => {
                      setNewPostMediaUri(null);
                      setNewPostMediaType(null);
                    }}
                    style={styles.removeMediaBtn}
                  >
                    <X color="#FFFFFF" size={16} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handlePickMediaForPost}
                  style={styles.attachMediaBtn}
                  activeOpacity={0.8}
                >
                  <ImageIcon color="#059669" size={18} />
                  <Text style={styles.attachMediaBtnText}>Adjuntar foto o imagen</Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            <TouchableOpacity
              onPress={handlePublishPost}
              disabled={isPublishingPost}
              style={styles.publishSubmitBtn}
              activeOpacity={0.85}
            >
              {isPublishingPost ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Send color="#FFFFFF" size={16} />
                  <Text style={styles.publishSubmitBtnText}>Sembrar en la Comunidad</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // 1. COVER BANNER SECTION
  coverBannerContainer: {
    width: '100%',
    height: 168,
    position: 'relative',
    backgroundColor: '#064E3B',
    overflow: 'hidden',
  },
  coverBannerImage: {
    width: '100%',
    height: '100%',
  },
  coverBannerFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#064E3B',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
  },
  coverSparkleIcon: {
    opacity: 0.35,
  },
  coverOverlayGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.22)',
  },
  editCoverFloatingBtn: {
    position: 'absolute',
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 10,
  },
  editCoverFloatingBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },

  // 2. HEADER SECTION
  profileHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  avatarWrapperContainer: {
    marginTop: -44,
  },
  avatarWrapper: {
    position: 'relative',
    borderWidth: 3.5,
    borderColor: '#FFFFFF',
    borderRadius: 44,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E2E8F0',
  },
  avatarInitialsBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitialsText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  headerInfo: {
    flex: 1,
    paddingTop: 6,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  welcomeSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 6,
  },
  roleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeMemberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  activeMemberBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  guestBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  headerActionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 16,
  },
  calibrateAweBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingVertical: 10.5,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  calibrateAweBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    paddingVertical: 10.5,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  logoutBtnText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '800',
  },
  loginHeaderCta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 11,
    borderRadius: 12,
  },
  loginHeaderCtaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  // 2. SCROLL CONTENT
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },

  // 3. GUEST INVITATION
  guestPromptContainer: {
    marginTop: 10,
  },
  loginInviteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inviteIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  inviteTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  inviteDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  mainLoginCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    backgroundColor: '#059669',
    paddingVertical: 13,
    borderRadius: 14,
    marginBottom: 10,
  },
  mainLoginCtaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  mainRegisterCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    backgroundColor: '#ECFDF5',
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  mainRegisterCtaText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '800',
  },

  // 4. TAB BAR
  tabsScrollView: {
    marginBottom: 16,
  },
  tabsScrollContent: {
    gap: 8,
    paddingVertical: 4,
  },
  tabPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabPillBtnActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  tabPillBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  tabPillBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // 5. TAB PANELS
  tabPanel: {
    gap: 16,
  },

  // AWE STATE CARD
  aweCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  aweCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  aweIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aweSubtitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.5,
  },
  aweTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  recalibrateMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  recalibrateMiniBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  aweStatsGrid: {
    gap: 10,
    marginTop: 14,
  },
  aweStatBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  aweStatTag: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#64748B',
    marginBottom: 4,
  },
  aweStatValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  aweStatValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  aweStatHint: {
    fontSize: 11,
    color: '#64748B',
  },
  emotionsTagSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  emotionsSectionTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 8,
  },
  emotionsPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  emotionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  emotionPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },

  // DAILY CHECKIN CARD
  checkinCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  checkinHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  checkinTag: {
    fontSize: 10,
    fontWeight: '900',
    color: '#D97706',
  },
  checkinTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  checkinDesc: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 14,
  },
  energyGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  energyCardBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  energyCardLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 4,
    textAlign: 'center',
  },
  energyCardDesc: {
    fontSize: 9,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 2,
  },
  dailyFeedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  dailyFeedbackText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '700',
    flex: 1,
  },

  // SUMMARY CARD
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  summaryIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryBadge: {
    fontSize: 10,
    fontWeight: '900',
    color: '#059669',
  },
  summaryCardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  quoteBubble: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  quoteText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#334155',
    fontStyle: 'italic',
  },
  summaryActionsRow: {
    gap: 8,
  },
  summaryCtaBtnPrimary: {
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  summaryCtaTextPrimary: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  summaryCtaBtnSecondary: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  summaryCtaTextSecondary: {
    color: '#059669',
    fontSize: 13,
    fontWeight: '800',
  },

  // POSTS SECTION
  myPostsSection: {
    marginVertical: 4,
    gap: 8,
  },
  postsHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 4,
    marginTop: 4,
  },
  postsHeadingText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#059669',
  },
  newPostHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  newPostHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  loadingBox: {
    padding: 30,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
  },
  emptyPostsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  emptyPostsIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyPostsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptyPostsDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  emptyPostCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 6,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyPostCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  // CREATE POST MODAL STYLES
  createModalSectionLabel: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.6,
    marginBottom: 6,
    marginTop: 8,
  },
  feelingsScrollContent: {
    gap: 6,
    paddingVertical: 2,
  },
  feelingPillOption: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  feelingPillOptionActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  feelingPillText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  feelingPillTextActive: {
    color: '#059669',
    fontWeight: '800',
  },
  createPostTextInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    fontSize: 13.5,
    color: '#0F172A',
    minHeight: 100,
    marginBottom: 10,
  },
  mediaPreviewContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  mediaPreviewThumb: {
    width: '100%',
    height: 150,
    backgroundColor: '#E2E8F0',
  },
  removeMediaBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachMediaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderStyle: 'dashed',
    marginBottom: 12,
  },
  attachMediaBtnText: {
    color: '#059669',
    fontSize: 12.5,
    fontWeight: '700',
  },
  publishSubmitBtn: {
    backgroundColor: '#059669',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  publishSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  userPostCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  userPostCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  userPostCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userPostTime: {
    fontSize: 11,
    color: '#94A3B8',
  },
  userPostFeelingPill: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  userPostFeelingText: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '700',
  },
  userPostContent: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#1E293B',
    marginBottom: 8,
  },
  userPostThumb: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    marginBottom: 8,
  },
  userPostFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  userPostStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userPostStatText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  userPostShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#F0F9FF',
  },
  userPostShareBtnText: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '700',
  },

  // COURSES SECTION
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  courseCover: {
    width: '100%',
    height: 160,
    backgroundColor: '#0F172A',
  },
  courseBody: {
    padding: 16,
  },
  courseTag: {
    fontSize: 10,
    fontWeight: '900',
    color: '#059669',
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  courseDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#64748B',
    marginBottom: 14,
  },
  courseCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    borderRadius: 14,
  },
  courseCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  // TREE WIZARD SECTION
  treeWizardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  treeWizardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  treeBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  treeBackBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  treeStepBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  treeStepBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  treeHeaderBox: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 18,
  },
  treeStageName: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  treeQuestionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 23,
  },
  treeQuestionSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  treeOptionsList: {
    gap: 10,
  },
  treeOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  treeOptionLabel: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  treeOptionDesc: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
  },
  submittingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
  },
  submittingText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '700',
  },
  treeCompassionBox: {
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
  },
  treeCompassionText: {
    fontSize: 11.5,
    color: '#64748B',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // SETTINGS FORM SECTION
  settingsFormCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  settingsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  settingsHeaderTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  formGrid: {
    gap: 12,
  },
  formField: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  fieldInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13.5,
    color: '#0F172A',
  },
  formDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 6,
  },
  sectionSubtitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 4,
  },
  saveProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0F172A',
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 18,
  },
  saveProfileBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },

  // AUTH MODAL
  authModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  authModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 36,
  },
  authModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  authModalTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
  },
  closeAuthModalBtn: {
    padding: 4,
  },
  authModeToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    marginBottom: 14,
  },
  authToggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  authToggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  authToggleBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  authToggleBtnTextActive: {
    color: '#059669',
    fontWeight: '800',
  },
  authInputField: {
    gap: 4,
    marginBottom: 10,
  },
  authInputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  authTextInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13.5,
    color: '#0F172A',
  },
  authSubmitBtn: {
    backgroundColor: '#059669',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  authSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
