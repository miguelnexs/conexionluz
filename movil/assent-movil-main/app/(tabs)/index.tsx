import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Sparkles,
  Heart,
  MessageCircle,
  Send,
  User,
  Plus,
  ChevronRight,
  Smile,
  LucideImage,
  Lock,
  LogIn,
  ShieldCheck,
  X,
  UserPlus,
  LogOut,
  RefreshCw,
  Eye,
} from 'lucide-react-native';
import { mobileApi, PatientUser, setAuthToken } from '../../api/client';
import { UserProfileModal } from '../../components/UserProfileModal';

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

const FEELINGS = [
  { emoji: '🌱', label: 'En calma' },
  { emoji: '⚡', label: 'Con energía' },
  { emoji: '🌪️', label: 'Abrumado/a' },
  { emoji: '✨', label: 'Inspirado/a' },
  { emoji: '💤', label: 'Cansado/a' },
];

function getInitials(name: string): string {
  if (!name) return 'U';
  const clean = name.replace(/^(Dra\.|Dr\.|Lic\.|Ing\.)\s+/i, '').trim();
  const parts = clean.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0]?.[0]?.toUpperCase() || 'U';
}

function getAvatarBgColor(name: string): string {
  const colors = ['#059669', '#0284C7', '#7C3AED', '#DB2777', '#D97706', '#0D9488', '#4F46E5'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function AuthorAvatar({ name, avatarUrl, size = 42 }: { name: string; avatarUrl?: string; size?: number }) {
  const hasValidImage =
    avatarUrl &&
    typeof avatarUrl === 'string' &&
    avatarUrl.trim().length > 10 &&
    (avatarUrl.startsWith('http') || avatarUrl.startsWith('data:'));

  if (hasValidImage) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
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

const INITIAL_FALLBACK_POSTS: Post[] = [
  {
    id: 'post-1',
    authorName: 'Dra. Elena Rossi',
    authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    authorRole: 'Psicóloga Clínica',
    content:
      'Un recordatorio cariñoso para cerrar la semana: la respiración es tu ancla constante. Si sientes que la mente se acelera o el estrés te abruma, detente un momento y prueba la respiración 4-7-8. Inhala por la nariz en 4s, retén en 7s y exhala en 8s. ¿Quién se une a respirar hondo hoy? 🌿🧘‍♂️',
    feeling: 'En calma',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    likes: ['Elena Rossi', 'Marcos Gómez', 'Sofía Varela'],
    comments: [
      {
        id: 'c-1',
        authorName: 'Carlos Mendoza',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
        authorRole: 'Miembro',
        content: 'Lo acabo de probar antes de ver la publicación. ¡Qué diferencia tan profunda se siente! Gracias Dra. Elena 🙌',
        createdAt: 'Hace 2h',
      },
    ],
    createdAt: 'Hace 3 horas',
  },
  {
    id: 'post-2',
    authorName: 'Carlos Mendoza',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
    authorRole: 'Miembro Activo',
    content:
      'Llevo 10 días seguidos registrando mi sentir en el Diario Emocional de la sección Actividades. Al principio me costaba ser constante, pero ver el gráfico de mi progreso emocional me ha abierto los ojos. ¡Les aconsejo darle una oportunidad! 📓✨',
    feeling: 'Inspirado/a',
    likes: ['Dra. Elena Rossi', 'Ana Lucía'],
    comments: [
      {
        id: 'c-2',
        authorName: 'Ana Lucía Viteri',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
        authorRole: 'Miembro',
        content: '¡Qué gran avance Carlos! Los ejercicios guiados también me han cambiado la perspectiva.',
        createdAt: 'Hace 1h',
      },
    ],
    createdAt: 'Hace 5 horas',
  },
  {
    id: 'post-3',
    authorName: 'Lic. Marcos Gómez',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    authorRole: 'Terapeuta de Conciencia',
    content:
      'Recordatorio diario: No necesitas tener todo resuelto para merecer descanso. El sobreesfuerzo no te hace más valioso; tu valía es intrínseca. Haz una pausa hoy. ☕✨',
    feeling: 'En calma',
    image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=800',
    likes: ['Dra. Elena Rossi', 'Carlos Mendoza', 'Valentina R.'],
    comments: [],
    createdAt: 'Hace 8 horas',
  },
];

export default function Home() {
  const router = useRouter();
  
  // AUTH STATE
  const [currentUser, setCurrentUser] = useState<PatientUser | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // USER PROFILE MODAL STATE
  const [showUserProfileModal, setShowUserProfileModal] = useState<boolean>(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState<{
    authorName: string;
    authorAvatar?: string;
    authorRole?: string;
  } | null>(null);

  // LOGIN / REGISTER FORM INPUTS
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');

  // POSTS STATE & LOADING
  const [posts, setPosts] = useState<Post[]>(INITIAL_FALLBACK_POSTS);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
  const [newPostText, setNewPostText] = useState('');
  const [selectedFeeling, setSelectedFeeling] = useState('En calma');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // LOAD POSTS FROM BACKEND ON MOUNT
  useEffect(() => {
    loadPostsFromBackend();
  }, []);

  const loadPostsFromBackend = async () => {
    setLoadingPosts(true);
    const res = await mobileApi.fetchCommunityPosts();
    if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
      const formattedPosts: Post[] = res.data.map((item: any) => ({
        id: String(item.id),
        authorName: item.authorName || item.author || 'Miembro Conexión Luz',
        authorAvatar: item.authorAvatarUrl || item.authorAvatar || item.profilePictureUrl || item.avatarUrl || '',
        authorRole: item.authorRole || 'Miembro',
        content: item.content || item.title || '',
        feeling: item.feeling || 'En calma',
        image: item.imageUrl || item.image || undefined,
        likes: Array.isArray(item.likes) ? item.likes : item.likesCount ? Array(item.likesCount).fill('Usuario') : [],
        comments: Array.isArray(item.comments)
          ? item.comments.map((c: any) => ({
              id: String(c.id),
              authorName: c.authorName || 'Miembro',
              authorAvatar: c.authorAvatarUrl || c.authorAvatar || '',
              authorRole: c.authorRole || 'Miembro',
              content: c.content || '',
              createdAt: c.createdAt || 'Reciente',
            }))
          : [],
        createdAt: item.createdAt || 'Reciente',
      }));
      setPosts(formattedPosts);
    }
    setLoadingPosts(false);
  };

  const handleOpenUserProfile = (authorName: string, authorAvatar?: string, authorRole?: string) => {
    setSelectedUserProfile({
      authorName,
      authorAvatar,
      authorRole,
    });
    setShowUserProfileModal(true);
  };

  // HANDLE AUTH SUBMIT (CONNECT TO BACKEND /api/auth/login/)
  const handleAuthSubmit = async () => {
    if (!emailInput.trim() || !passwordInput.trim()) {
      Alert.alert('Campos requeridos', 'Por favor ingresa correo y contraseña.');
      return;
    }

    setAuthLoading(true);

    if (authMode === 'login') {
      const res = await mobileApi.login(emailInput.trim(), passwordInput.trim());
      setAuthLoading(false);

      if (res.ok) {
        setCurrentUser(res.patient);
        setIsGuest(false);
        setShowAuthModal(false);
        Alert.alert('¡Bienvenido/a!', `Sesión iniciada correctamente como ${res.patient.firstName || 'Usuario'}`);
      } else {
        Alert.alert('Error de Inicio de Sesión', res.error || 'Credenciales incorrectas');
      }
    } else {
      if (!firstNameInput.trim()) {
        setAuthLoading(false);
        Alert.alert('Campo requerido', 'Por favor ingresa tu nombre.');
        return;
      }

      const res = await mobileApi.register(
        firstNameInput.trim(),
        lastNameInput.trim(),
        emailInput.trim(),
        passwordInput.trim()
      );
      setAuthLoading(false);

      if (res.ok) {
        setCurrentUser(res.patient);
        setIsGuest(false);
        setShowAuthModal(false);
        Alert.alert('¡Registro exitoso!', `Bienvenido a Conexión Luz®, ${res.patient.firstName}`);
      } else {
        Alert.alert('Error de Registro', res.error || 'No se pudo crear la cuenta');
      }
    }
  };

  // QUICK DEMO LOGIN (REAL PATIENT CREDENTIALS)
  const handleQuickDemoLogin = async () => {
    setAuthLoading(true);
    const res = await mobileApi.login('paciente@ejemplo.com', 'paciente123');
    setAuthLoading(false);

    if (res.ok) {
      setCurrentUser(res.patient);
      setIsGuest(false);
      setShowAuthModal(false);
    } else {
      // Fallback local authenticated user if offline backend
      setCurrentUser({
        id: 999,
        firstName: 'Sofía',
        lastName: 'Varela',
        email: 'sofia@conexionluz.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        userType: 'paciente',
        canPublish: true,
      });
      setIsGuest(false);
      setShowAuthModal(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setIsGuest(true);
  };

  // CREATE POST WITH PERMISSION CHECK
  const handleCreatePost = async () => {
    if (isGuest || !currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (currentUser.canPublish === false) {
      Alert.alert(
        'Permiso Requerido',
        'Tu cuenta requiere autorización de un terapeuta para publicar en el muro oficial.'
      );
      return;
    }

    if (!newPostText.trim()) return;

    // Call API backend create
    const res = await mobileApi.createCommunityPost(newPostText.trim(), selectedFeeling);

    const newPostObj: Post = {
      id: `post-${Date.now()}`,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
      authorAvatar: currentUser.avatarUrl || '',
      authorRole: currentUser.userType === 'paciente' ? 'Paciente' : 'Miembro',
      content: newPostText.trim(),
      feeling: selectedFeeling,
      likes: [],
      comments: [],
      createdAt: 'Justo ahora',
    };

    setPosts([newPostObj, ...posts]);
    setNewPostText('');
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
            authorRole: 'Miembro',
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

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* CLEAN WHITE APP HEADER */}
        <View style={styles.headerBar}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Sparkles color="#059669" size={20} />
            </View>
            <View>
              <Text style={styles.brandTitle}>CONEXIÓN LUZ®</Text>
              <Text style={styles.brandSubtitle}>Muro de la Comunidad</Text>
            </View>
          </View>

          {/* AUTHENTICATION STATUS */}
          {!isGuest && currentUser ? (
            <TouchableOpacity onPress={handleLogout} style={styles.userStatusBadge}>
              <ShieldCheck color="#059669" size={14} />
              <Text style={styles.userStatusText}>{currentUser.firstName}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setShowAuthModal(true)} style={styles.loginHeaderBtn}>
              <LogIn color="#FFFFFF" size={14} />
              <Text style={styles.loginHeaderBtnText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* BANNER DE MODO INVITADO (GUEST MODE) */}
          {isGuest && (
            <View style={styles.guestNoticeBanner}>
              <View style={styles.guestIconBox}>
                <Eye color="#0284C7" size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.guestPillRow}>
                  <Text style={styles.guestPillText}>Modo Invitado</Text>
                </View>
                <Text style={styles.guestTitle}>Explorando publicaciones públicas</Text>
                <Text style={styles.guestDesc}>
                  Inicia sesión o regístrate para publicar tu sentir, responder comentarios e interactuar con la comunidad.
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowAuthModal(true)} style={styles.guestActionBtn}>
                <Text style={styles.guestActionText}>Iniciar Sesión</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* CAJA DE CREAR PUBLICACIÓN (SOLO PARA USUARIOS AUTENTICADOS) */}
          {!isGuest && currentUser ? (
            <View style={styles.createPostCard}>
              <View style={styles.createPostHeader}>
                <TouchableOpacity
                  onPress={() =>
                    handleOpenUserProfile(
                      `${currentUser.firstName} ${currentUser.lastName}`.trim(),
                      currentUser.avatarUrl,
                      currentUser.userType === 'paciente' ? 'Paciente' : 'Miembro'
                    )
                  }
                >
                  <AuthorAvatar
                    name={`${currentUser.firstName} ${currentUser.lastName}`.trim()}
                    avatarUrl={currentUser.avatarUrl}
                    size={40}
                  />
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                  <Text style={styles.createPostPrompt}>
                    ¿Cómo te sientes en tu proceso hoy, {currentUser.firstName}?
                  </Text>
                  <Text style={styles.permissionBadgeText}>✓ Permisos de Publicación Activos</Text>
                </View>
              </View>

              {/* Selector de Sentir / Emoción */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.feelingsRow}>
                {FEELINGS.map((feel) => {
                  const isSelected = selectedFeeling === feel.label;
                  return (
                    <TouchableOpacity
                      key={feel.label}
                      onPress={() => setSelectedFeeling(feel.label)}
                      style={[styles.feelPill, isSelected && styles.feelPillSelected]}
                    >
                      <Text style={styles.feelEmoji}>{feel.emoji}</Text>
                      <Text style={[styles.feelLabel, isSelected && styles.feelLabelSelected]}>{feel.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <TextInput
                value={newPostText}
                onChangeText={setNewPostText}
                placeholder="Escribe una reflexión, vivencia o aprendizaje para la comunidad..."
                placeholderTextColor="#94A3B8"
                multiline
                style={styles.postInput}
              />

              <View style={styles.createPostFooter}>
                <TouchableOpacity style={styles.mediaActionBtn}>
                  <LucideImage color="#059669" size={18} />
                  <Text style={styles.mediaActionText}>Imagen</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleCreatePost} style={styles.publishBtn}>
                  <Send color="#FFFFFF" size={14} />
                  <Text style={styles.publishBtnText}>Publicar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setShowAuthModal(true)} style={styles.guestCreatePlaceholder}>
              <View style={styles.placeholderHeader}>
                <View style={styles.placeholderAvatar} />
                <Text style={styles.placeholderText}>Inicia sesión para publicar tu experiencia hoy...</Text>
              </View>
              <View style={styles.placeholderLockPill}>
                <Lock color="#059669" size={12} />
                <Text style={styles.placeholderLockText}>Iniciar Sesión / Registrarse</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* SECCIÓN DEL FEED DE PUBLICACIONES */}
          <View style={styles.feedHeaderRow}>
            <View>
              <Text style={styles.feedTitle}>Publicaciones de la Comunidad</Text>
              <Text style={styles.feedSubtitle}>Toca la foto o nombre para ver el perfil de cualquier autor</Text>
            </View>
            <TouchableOpacity onPress={loadPostsFromBackend} style={styles.refreshBtn}>
              <RefreshCw color="#059669" size={16} />
            </TouchableOpacity>
          </View>

          {loadingPosts && (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color="#059669" />
              <Text style={styles.loadingText}>Cargando publicaciones del servidor...</Text>
            </View>
          )}

          {/* FEED ITEMS LIST */}
          <View style={styles.feedList}>
            {posts.map((post) => {
              const userName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : 'Tú';
              const isLiked = post.likes.includes(userName);
              const showComments = expandedComments[post.id];

              return (
                <View key={post.id} style={styles.postCard}>
                  
                  {/* Author Header (Tappable to view author profile) */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleOpenUserProfile(post.authorName, post.authorAvatar, post.authorRole)}
                    style={styles.postHeader}
                  >
                    <AuthorAvatar
                      name={post.authorName}
                      avatarUrl={post.authorAvatar}
                      size={42}
                    />
                    <View style={styles.postAuthorMeta}>
                      <View style={styles.postAuthorNameRow}>
                        <Text style={styles.postAuthorName}>{post.authorName}</Text>
                        {post.feeling && (
                          <View style={styles.postFeelingTag}>
                            <Text style={styles.postFeelingText}>🌱 {post.feeling}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.postAuthorRole}>{post.authorRole} · {post.createdAt}</Text>
                    </View>
                    <ChevronRight color="#CBD5E1" size={18} />
                  </TouchableOpacity>

                  {/* Post Content Body */}
                  <Text style={styles.postContent}>{post.content}</Text>

                  {/* Optional Image */}
                  {post.image && (
                    <Image source={{ uri: post.image }} style={styles.postImage} resizeMode="cover" />
                  )}

                  {/* Action Bar (Iluminar / Comentar) */}
                  <View style={styles.postActionBar}>
                    <TouchableOpacity
                      onPress={() => handleToggleLike(post.id)}
                      style={[styles.postActionBtn, isLiked && styles.postActionBtnLiked]}
                    >
                      <Heart color={isLiked ? '#EF4444' : '#64748B'} size={18} fill={isLiked ? '#EF4444' : 'transparent'} />
                      <Text style={[styles.postActionText, isLiked && styles.postActionTextLiked]}>
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
                      style={styles.postActionBtn}
                    >
                      <MessageCircle color="#64748B" size={18} />
                      <Text style={styles.postActionText}>Comentarios ({post.comments.length})</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Comments Section */}
                  {showComments && (
                    <View style={styles.commentsSection}>
                      {post.comments.map((comment) => (
                        <View key={comment.id} style={styles.commentItem}>
                          <TouchableOpacity
                            onPress={() => handleOpenUserProfile(comment.authorName, comment.authorAvatar, comment.authorRole)}
                          >
                            <AuthorAvatar
                              name={comment.authorName}
                              avatarUrl={comment.authorAvatar}
                              size={28}
                            />
                          </TouchableOpacity>
                          <View style={styles.commentBubble}>
                            <View style={styles.commentHeaderRow}>
                              <Text
                                onPress={() => handleOpenUserProfile(comment.authorName, comment.authorAvatar, comment.authorRole)}
                                style={styles.commentAuthor}
                              >
                                {comment.authorName}
                              </Text>
                              <Text style={styles.commentRole}>{comment.authorRole}</Text>
                            </View>
                            <Text style={styles.commentBody}>{comment.content}</Text>
                            <Text style={styles.commentTime}>{comment.createdAt}</Text>
                          </View>
                        </View>
                      ))}

                      {/* Add Comment Input */}
                      <View style={styles.addCommentRow}>
                        <TextInput
                          value={commentInputs[post.id] || ''}
                          onChangeText={(text) => setCommentInputs({ ...commentInputs, [post.id]: text })}
                          placeholder={isGuest ? 'Inicia sesión para comentar' : 'Escribe un comentario...'}
                          placeholderTextColor="#94A3B8"
                          style={styles.commentInput}
                        />
                        <TouchableOpacity
                          onPress={() => handleAddComment(post.id)}
                          style={styles.sendCommentBtn}
                        >
                          <Send color="#FFFFFF" size={14} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                </View>
              );
            })}
          </View>

        </ScrollView>

        {/* PUBLIC USER PROFILE MODAL */}
        <UserProfileModal
          visible={showUserProfileModal}
          onClose={() => setShowUserProfileModal(false)}
          user={selectedUserProfile}
          userPosts={posts}
        />

        {/* AUTHENTICATION & REGISTRATION MODAL */}
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

              {/* TOGGLE TAB LOGIN / REGISTER */}
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
                {authMode === 'login' ? 'Acceso a Conexión Luz®' : 'Crear Cuenta en Conexión Luz®'}
              </Text>
              <Text style={styles.modalSubtitle}>
                {authMode === 'login'
                  ? 'Ingresa con tus credenciales de paciente o miembro para publicar en el muro.'
                  : 'Crea tu perfil para conectarte con la comunidad e interactuar.'}
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

              <TouchableOpacity onPress={handleQuickDemoLogin} style={styles.demoLoginBtn}>
                <ShieldCheck color="#059669" size={16} />
                <Text style={styles.demoLoginBtnText}>Entrar con Usuario Demo Conexión Luz®</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '700',
  },
  loginHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#059669',
  },
  loginHeaderBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  userStatusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  guestNoticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
  },
  guestIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestPillRow: {
    alignSelf: 'flex-start',
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  guestPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  guestTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0369A1',
  },
  guestDesc: {
    fontSize: 11,
    color: '#075985',
    lineHeight: 15,
  },
  guestActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#0284C7',
  },
  guestActionText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  guestCreatePlaceholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  placeholderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  placeholderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
  },
  placeholderText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
  },
  placeholderLockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  placeholderLockText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
  createPostCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  createPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  createPostPrompt: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  permissionBadgeText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '700',
  },
  feelingsRow: {
    gap: 8,
    marginBottom: 12,
  },
  feelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  feelPillSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#34D399',
  },
  feelEmoji: {
    fontSize: 14,
  },
  feelLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  feelLabelSelected: {
    color: '#065F46',
    fontWeight: '900',
  },
  postInput: {
    minHeight: 80,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  createPostFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mediaActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
  },
  mediaActionText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 12,
  },
  publishBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  feedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  feedSubtitle: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
  },
  refreshBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  feedList: {
    gap: 16,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  postAuthorMeta: {
    flex: 1,
  },
  postAuthorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postAuthorName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  postFeelingTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#ECFDF5',
  },
  postFeelingText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
  },
  postAuthorRole: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  postContent: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
    fontWeight: '500',
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 14,
    marginBottom: 12,
  },
  postActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  postActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postActionBtnLiked: {
    opacity: 0.9,
  },
  postActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  postActionTextLiked: {
    color: '#EF4444',
    fontWeight: '900',
  },
  commentsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 10,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 8,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  commentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  commentRole: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
  },
  commentBody: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
  },
  commentTime: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 4,
  },
  addCommentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
    color: '#0F172A',
  },
  sendCommentBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
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
    padding: 6,
  },
  modalTabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  modalTabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  modalTabBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  modalTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  modalTabTextActive: {
    color: '#059669',
    fontWeight: '900',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    fontWeight: '500',
    marginBottom: 16,
  },
  modalFormGroup: {
    marginBottom: 12,
  },
  modalInputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 6,
  },
  modalSubmitBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  demoLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 10,
  },
  demoLoginBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
});
