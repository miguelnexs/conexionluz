import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { api } from '../api/client';
import { cn } from '@/lib/utils';
import { useTherapists } from '../hooks/useTherapists';
import {
  Sun,
  Sparkles,
  Wind,
  Send,
  UserRound,
  Calendar,
  ClipboardList,
  Dumbbell,
  NotebookPen,
  Activity,
  ChevronRight,
  Loader2,
  Heart,
  MessageCircle,
  Sparkle,
  Bookmark,
  Smile,
  X,
  Compass,
  Zap,
  Flame,
  Pencil,
  Trash2,
  Image as LucideImage
} from 'lucide-react';

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
  image?: string; // Base64 data URL or external URL
  likes: string[]; // List of user names who illuminated this post
  comments: Comment[];
  createdAt: string;
  isSystemPost?: boolean;
  isLocal?: boolean;
}

const FEELINGS_LIST = [
  { emoji: '🌱', label: 'En calma', color: 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)] hover:border-emerald-300' },
  { emoji: '⚡', label: 'Con energía', color: 'bg-amber-50 text-amber-700 border-amber-100 shadow-[0_0_15px_-3px_rgba(245,158,11,0.15)] hover:border-amber-355 hover:border-amber-300' },
  { emoji: '🌪️', label: 'Abrumado/a', color: 'bg-rose-50 text-rose-700 border-rose-100 shadow-[0_0_15px_-3px_rgba(244,63,94,0.15)] hover:border-rose-300' },
  { emoji: '✨', label: 'Inspirado/a', color: 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-[0_0_15px_-3px_rgba(99,102,241,0.15)] hover:border-indigo-300' },
  { emoji: '💤', label: 'Cansado/a', color: 'bg-slate-50 text-slate-700 border-slate-100 shadow-[0_0_15px_-3px_rgba(71,85,105,0.12)] hover:border-slate-300' },
];

const INITIAL_MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    authorName: 'Dra. Elena Rossi',
    authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    authorRole: 'Psicóloga Clínica',
    content: 'Un recordatorio cariñoso para cerrar la semana: la respiración es tu ancla constante. Si sientes que la mente se acelera o el estrés te abruma, detente un momento y prueba la respiración 4-7-8. Inhala por la nariz en 4 segundos, retén el aire durante 7 segundos y exhala lentamente por la boca en 8 segundos. Hacer esto 4 veces le indica a tu sistema nervioso que está a salvo. ¿Quién se une a respirar hondo hoy? 🌿🧘‍♂️',
    feeling: 'En calma',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    likes: ['Elena Rossi', 'Marcos Gómez', 'Sofía Varela'],
    comments: [
      {
        id: 'comment-1-1',
        authorName: 'Carlos Mendoza',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
        authorRole: 'Miembro',
        content: 'Lo acabo de hacer justo antes de abrir esta publicación. ¡Qué diferencia hace! Gracias por recordárnoslo, Dra. Elena. 🙌',
        createdAt: 'Hace 2 horas'
      },
      {
        id: 'comment-1-2',
        authorName: 'Lic. Marcos Gómez',
        authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
        authorRole: 'Terapeuta de Conciencia',
        content: 'Totalmente de acuerdo. En mi consulta siempre sugiero esta técnica antes de comenzar a trabajar en las sesiones más complejas.',
        createdAt: 'Hace 1 hora'
      }
    ],
    createdAt: 'Hace 3 horas',
    isSystemPost: true
  },
  {
    id: 'post-2',
    authorName: 'Carlos Mendoza',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
    authorRole: 'Miembro',
    content: 'Lrevó 10 días seguidos registrando mi sentir en el Diario Emocional de la sección Actividades. Al principio me costaba ser constante, pero ver el gráfico de mi progreso emocional me ha abierto los ojos. He aprendido a notar que mis picos de ansiedad suelen relacionarse con la falta de sueño de la noche anterior. ¡Si no han empezado su diario, les aconsejo darle una oportunidad! 📓✨',
    feeling: 'Inspirado/a',
    likes: ['Clara Méndez', 'Diego Cruz'],
    comments: [
      {
        id: 'comment-2-1',
        authorName: 'Dra. Clara Méndez',
        authorAvatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300',
        authorRole: 'Psiquiatra',
        content: '¡Excelente observación, Carlos! El sueño es el pilar invisible de la estabilidad mental. Identificar esos disparadores es la mitad del camino.',
        createdAt: 'Hace 4 horas'
      }
    ],
    createdAt: 'Hace 5 horas',
    isSystemPost: true
  },
  {
    id: 'post-3',
    authorName: 'Lic. Marcos Gómez',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    authorRole: 'Terapeuta de Conciencia',
    content: 'El cansancio mental acumulado no se quita únicamente durmiendo. Hay diferentes tipos de descanso que necesitamos: descanso social (estar con personas nutritivas), descanso sensorial (desconexión total de pantallas) y descanso creativo (disfrutar del arte o la naturaleza sin objetivos de productividad). Hoy, regálate al menos un espacio de 10 minutos de desconexión. Tu cuerpo y mente te lo agradecerán. 🔋🌱',
    feeling: 'En calma',
    image: 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&q=80&w=800',
    likes: ['Elena Rossi', 'Patricia Rojas', 'Laura Peña', 'Andrés Silva'],
    comments: [
      {
        id: 'comment-3-1',
        authorName: 'Laura Peña',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
        authorRole: 'Miembro',
        content: 'Wow, nunca lo había pensado de esa manera. Definitivamente hoy necesito descanso sensorial, mis ojos y mi mente están agotados de las videollamadas.',
        createdAt: 'Hace 6 horas'
      }
    ],
    createdAt: 'Hace 7 horas',
    isSystemPost: true
  },
  {
    id: 'post-4',
    authorName: 'Dra. Clara Méndez',
    authorAvatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300',
    authorRole: 'Psiquiatra',
    content: '¿Sabías que una mala calidad del sueño duplica la probabilidad de sufrir ansiedad severa al día siguiente? La luz azul de las pantallas antes de acostarse inhibe la melatonina, manteniendo tu cerebro en estado de alerta constante. Mi recomendación práctica de hoy: apaga tu celular 1 hora antes de dormir y reemplázalo por un libro físico o música ambiental. 🌙💤',
    feeling: 'Inspirado/a',
    likes: ['Marcos Gómez', 'Sofía Varela', 'Diego Cruz', 'Elena Rossi', 'Andrés Silva'],
    comments: [
      {
        id: 'comment-4-1',
        authorName: 'Diego Cruz',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
        authorRole: 'Miembro',
        content: 'Acepto el reto hoy, Dra. Clara. Dejaré el celular fuera de la habitación esta noche.',
        createdAt: 'Hace 8 horas'
      }
    ],
    createdAt: 'Hace 9 horas',
    isSystemPost: true
  },
  {
    id: 'post-5',
    authorName: 'Sofía Varela',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    authorRole: 'Miembro de la Comunidad',
    content: 'Hoy completé el test de bienestar psicológico en la sección Actividades. Me arrojó un nivel de estrés elevado, lo que me asustó al principio, pero me motivó a dar el paso y agendar mi primera sesión de terapia a través del portal de Conexión Luz. Me siento aliviada por haber decidido pedir ayuda en lugar de seguir cargando con todo yo sola. 🌱🌻',
    feeling: 'Con energía',
    likes: ['Elena Rossi', 'Patricia Rojas', 'Clara Méndez'],
    comments: [],
    createdAt: 'Hace 1 día',
    isSystemPost: true
  },
  {
    id: 'post-6',
    authorName: 'Lic. Patricia Rojas',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    authorRole: 'Psicoterapeuta Familiar',
    content: 'Aceptar nuestra realidad actual y nuestras emociones incómodas no significa resignación; significa quitarnos la venda de la negación para poder empezar a sanar desde un lugar de amor propio, honestidad y compasión. Date permiso de sentir enojo, tristeza o cansancio hoy. Es parte del proceso. ❤️✨',
    feeling: 'Inspirado/a',
    likes: ['Laura Peña', 'Carlos Mendoza', 'Elena Rossi'],
    comments: [
      {
        id: 'comment-6-1',
        authorName: 'Andrés Silva',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
        authorRole: 'Miembro',
        content: 'Hermoso mensaje. A veces nos juzgamos muy duro por no estar siempre felices.',
        createdAt: 'Hace 1 día'
      }
    ],
    createdAt: 'Hace 1 día',
    isSystemPost: true
  }
];

const SUGGESTED_THERAPISTS = [
  {
    name: 'Dra. Elena Rossi',
    role: 'Psicóloga Clínica',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150',
    tags: ['Ansiedad', 'Estrés']
  },
  {
    name: 'Lic. Marcos Gómez',
    role: 'Terapeuta de Conciencia',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150',
    tags: ['Mindfulness', 'Burnout']
  },
  {
    name: 'Lic. Patricia Rojas',
    role: 'Psicoterapeuta Familiar',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    tags: ['Relaciones', 'Duelo']
  }
];

const MOTIVATIONAL_QUOTES = [
  "La salud mental no es un destino al que se llega, sino un camino que se recorre día a día con paciencia.",
  "No tienes que controlar tus pensamientos; solo debes dejar de permitir que ellos te controlen a ti.",
  "Eres mucho más fuerte y capaz de lo que tu mente ansiosa te hace creer.",
  "Pedir ayuda no es un signo de debilidad; es un acto de valentía absoluta y amor propio.",
  "Tu valor personal no se mide por tu productividad. Tienes derecho a descansar y simplemente existir."
];

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffSec < 60) return 'Hace un momento';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHrs < 24) return `Hace ${diffHrs} ${diffHrs === 1 ? 'hora' : 'horas'}`;
    if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  } catch (e) {
    return 'Hace un momento';
  }
}

const Index = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('conexionluz:token') : null;
  const isAuthed = Boolean(token);
  const navigate = useNavigate();

  // Fetch real therapists
  const { data: dbTherapists = [] } = useTherapists();

  // Helper to get initials
  const getInitials = (name: string) => {
    return (name || '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('');
  };

  // Helper to get short name
  const getShortName = (name: string) => {
    const parts = name.split(' ');
    if (parts[0]?.toLowerCase().startsWith('dr') || parts[0]?.toLowerCase().startsWith('lic')) {
      return parts.slice(1).join(' ');
    }
    return name;
  };

  // Map database therapists to the structure used by the view (or use them directly)
  const activeTherapists = dbTherapists.length > 0
    ? dbTherapists.slice(0, 4).map(t => ({
        id: t.id,
        name: t.name,
        role: t.specialty,
        avatar: t.image_url
      }))
    : SUGGESTED_THERAPISTS.map((t, idx) => ({
        id: `suggested-${idx}`,
        name: t.name,
        role: t.role,
        avatar: t.avatar
      }));

  // States
  const [posts, setPosts] = useState<Post[]>([]);
  const [me, setMe] = useState<any | null>(null);
  const [followingNames, setFollowingNames] = useState<string[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [showFeelingSelector, setShowFeelingSelector] = useState(false);
  const [visiblePostsCount, setVisiblePostsCount] = useState(3);
  const [loadingMore, setLoadingMore] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isCreatorExpanded, setIsCreatorExpanded] = useState(false);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Edit/Delete States
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingPostContent, setEditingPostContent] = useState('');
  const [editingPostImage, setEditingPostImage] = useState<string | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  // Load User Data & Followed Users List
  useEffect(() => {
    if (isAuthed) {
      api.get('/api/portal/me/').then(res => {
        if (res.ok) {
          const userData = res.data;
          setMe(userData);
          // Cascade the new role to all cached posts by this user
          const saved = localStorage.getItem('conexionluz:feed_posts');
          if (saved) {
            try {
              const cachedPosts = JSON.parse(saved);
              const userName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
              const isPremium = Boolean(userData.hasActiveSubscription);
              let newRole = '';
              if (userData.occupation?.trim()) {
                const occ = userData.occupation.trim();
                newRole = occ.charAt(0).toUpperCase() + occ.slice(1);
              } else if (userData.userType) {
                const ut = userData.userType.toLowerCase();
                if (ut === 'paciente') newRole = 'Paciente';
                else if (ut === 'miembro') newRole = isPremium ? 'Miembro Premium' : 'Miembro';
                else newRole = userData.userType.charAt(0).toUpperCase() + userData.userType.slice(1);
              } else {
                newRole = isPremium ? 'Miembro Premium' : 'Miembro';
              }
              const updated = cachedPosts.map((post: any) =>
                post.authorName === userName ? { ...post, authorRole: newRole } : post
              );
              localStorage.setItem('conexionluz:feed_posts', JSON.stringify(updated));
              setPosts(updated);
            } catch (e) {
              console.error(e);
            }
          }
        }
      });
      api.get<any>('/api/portal/follow/patients/following/').then(res => {
        if (res.ok) setFollowingNames(res.data.following || []);
      });
    }
  }, [isAuthed]);

  // Load Posts from Backend, fallback to LocalStorage or Mock Data
  const loadPosts = async () => {
    try {
      const res = await api.get<any[]>('/api/portal/community-posts/');
      if (res.ok && res.data && res.data.length > 0) {
        const myName = me ? `${me.firstName || ''} ${me.lastName || ''}`.trim() : '';
        const mappedPosts: Post[] = res.data.map(p => {
          const likesList: string[] = [];
          if (p.likedByMe && myName) {
            likesList.push(myName);
          }
          const remainingLikes = (p.likesCount || 0) - likesList.length;
          for (let i = 0; i < remainingLikes; i++) {
            likesList.push(`Usuario ${i}`);
          }
          return {
            id: String(p.id),
            authorName: p.authorName,
            authorAvatar: p.authorAvatarUrl || undefined,
            authorRole: p.authorRole,
            content: p.content,
            feeling: p.feeling || undefined,
            image: p.imageUrl || undefined,
            likes: likesList,
            comments: p.comments ? p.comments.map((c: any) => ({
              id: String(c.id),
              authorName: c.authorName,
              authorAvatar: c.authorAvatarUrl || undefined,
              authorRole: c.authorRole,
              content: c.content,
              createdAt: formatRelativeTime(c.createdAt)
            })) : [],
            createdAt: formatRelativeTime(p.createdAt)
          };
        });
        setPosts(mappedPosts);
      } else {
        const saved = localStorage.getItem('conexionluz:feed_posts');
        const fallback: Post[] = saved ? JSON.parse(saved) : INITIAL_MOCK_POSTS;
        setPosts(fallback.map(p => ({ ...p, isLocal: true })));
      }
    } catch (e) {
      console.error(e);
      const saved = localStorage.getItem('conexionluz:feed_posts');
      const fallback: Post[] = saved ? JSON.parse(saved) : INITIAL_MOCK_POSTS;
      setPosts(fallback.map(p => ({ ...p, isLocal: true })));
    }
  };

  useEffect(() => {
    loadPosts();
    setQuoteIndex(Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));
  }, [me]);

  // Save posts helper
  const savePosts = (updatedPosts: Post[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('conexionluz:feed_posts', JSON.stringify(updatedPosts));
  };

  // Edit post handler
  const handleEditPostSubmit = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    const hasImage = post?.image || editingPostImage;
    if (!editingPostContent.trim() && !hasImage) return;
    const updated = posts.map(post => {
      if (post.id === postId) {
        return { 
          ...post, 
          content: editingPostContent.trim(),
          image: editingPostImage || post.image
        };
      }
      return post;
    });
    savePosts(updated);
    setEditingPostId(null);
    setEditingPostContent('');
    setEditingPostImage(null);
  };

  // Delete post handler
  const handleDeletePostSubmit = (postId: string) => {
    const updated = posts.filter(post => post.id !== postId);
    savePosts(updated);
    setDeletingPostId(null);
  };

  // Edit comment handler
  const handleEditCommentSubmit = (postId: string, commentId: string) => {
    if (!editingCommentContent.trim()) return;
    const updated = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(c => {
          if (c.id === commentId) {
            return { ...c, content: editingCommentContent.trim() };
          }
          return c;
        });
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    savePosts(updated);
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  // Delete comment handler
  const handleDeleteCommentSubmit = (postId: string, commentId: string) => {
    const updated = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.filter(c => c.id !== commentId);
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    savePosts(updated);
    setDeletingCommentId(null);
  };

  // Create Spark/Intention
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() && !newPostImage) return;

    if (isAuthed) {
      const response = await api.post<any>('/api/portal/community-posts/', {
        content: newPostContent.trim(),
        imageUrl: newPostImage || undefined,
        feeling: selectedFeeling || undefined
      });
      if (response.ok) {
        await loadPosts();
        setNewPostContent('');
        setNewPostImage(null);
        setSelectedFeeling(null);
        setShowFeelingSelector(false);
        setIsCreatorExpanded(false);
      } else {
        alert(response.error || 'Error al publicar.');
      }
    } else {
      const authorName = me ? `${me.firstName} ${me.lastName}` : 'Miembro Invitado';
      const authorAvatar = me?.profilePictureUrl || '';
      const authorRole = me
        ? (me.occupation?.trim()
          ? (me.occupation.trim().charAt(0).toUpperCase() + me.occupation.trim().slice(1))
          : (me.userType
            ? (['miembro', 'paciente'].includes(me.userType.toLowerCase())
              ? (me.userType.toLowerCase() === 'paciente' ? 'Paciente' : (me.hasActiveSubscription ? 'Miembro Premium' : 'Miembro'))
              : (me.userType.charAt(0).toUpperCase() + me.userType.slice(1)))
            : 'Miembro'))
        : 'Miembro';

      const newPost: Post = {
        id: `post-${Date.now()}`,
        authorName,
        authorAvatar,
        authorRole,
        content: newPostContent.trim(),
        feeling: selectedFeeling || undefined,
        image: newPostImage || undefined,
        likes: [],
        comments: [],
        createdAt: 'Hace un momento'
      };

      const updated = [newPost, ...posts];
      savePosts(updated);

      setNewPostContent('');
      setNewPostImage(null);
      setSelectedFeeling(null);
      setShowFeelingSelector(false);
      setIsCreatorExpanded(false);
    }
  };

  // Illuminate Post (Optimistic Update)
  const handleLikePost = async (postId: string) => {
    if (!isAuthed) {
      navigate('/login');
      return;
    }
    const post = posts.find(p => p.id === postId);
    if (!post?.isLocal && !isNaN(Number(postId))) {
      const response = await api.post<any>(`/api/portal/community-posts/${postId}/like/`, {});
      if (response.ok) {
        await loadPosts();
        return;
      }
    }

    const userName = me ? `${me.firstName} ${me.lastName}` : '';
    const updated = posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(userName);
        const newLikes = isLiked
          ? post.likes.filter(name => name !== userName)
          : [...post.likes, userName];
        return { ...post, likes: newLikes };
      }
      return post;
    });
    savePosts(updated);
  };

  // Add Resonance (Comment)
  const handleAddComment = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthed) {
      navigate('/login');
      return;
    }
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    const post = posts.find(p => p.id === postId);
    if (!post?.isLocal && !isNaN(Number(postId))) {
      const response = await api.post<any>(`/api/portal/community-posts/${postId}/comment/`, {
        content: commentText
      });
      if (response.ok) {
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        await loadPosts();
        return;
      }
    }

    const authorName = me ? `${me.firstName} ${me.lastName}` : '';
    const authorAvatar = me?.profilePictureUrl || '';
    const authorRole = me?.hasActiveSubscription ? 'Miembro Premium' : 'Miembro';

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      authorName,
      authorAvatar,
      authorRole,
      content: commentText,
      createdAt: 'Hace un momento'
    };

    const updated = posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    });
    savePosts(updated);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const myName = me ? `${me.firstName} ${me.lastName}` : 'Miembro Invitado';

  // Prioritize followed users' posts first, showing community posts as a discovery fallback if none/few exist
  const prioritizedPosts = React.useMemo(() => {
    if (!isAuthed || followingNames.length === 0) {
      return posts;
    }
    
    // Own posts, posts from followed users, and system/professional posts are shown first
    const followed = posts.filter(post => 
      followingNames.includes(post.authorName) || 
      post.authorName === myName ||
      post.isSystemPost
    );
    
    const others = posts.filter(post => 
      !followingNames.includes(post.authorName) && 
      post.authorName !== myName &&
      !post.isSystemPost
    );
    
    return [...followed, ...others];
  }, [posts, followingNames, isAuthed, myName]);

  // Infinite Scroll Hook
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 150
      ) {
        if (!loadingMore && visiblePostsCount < prioritizedPosts.length) {
          setLoadingMore(true);
          setTimeout(() => {
            setVisiblePostsCount(prev => prev + 2);
            setLoadingMore(false);
          }, 1000);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, visiblePostsCount, prioritizedPosts.length]);

  const displayedPosts = prioritizedPosts.slice(0, visiblePostsCount);
  const myInitials = me ? `${me.firstName?.[0] || ''}${me.lastName?.[0] || ''}`.toUpperCase() : 'M';

  // Only users explicitly granted publish permission from the admin dashboard can create posts
  const canPublish = isAuthed && me != null && Boolean((me as any).canPublish);


  // Get mood colors dynamically
  const getMoodColor = (mood: string | undefined) => {
    if (!mood) return 'border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]';
    const match = FEELINGS_LIST.find(f => f.label === mood);
    return match ? match.color : 'border-slate-100';
  };

  return (
    <PublicLayout contentClassName="p-0">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        {/* ══════════════════════════════════════════════════════════
            MOBILE ONLY TOP BAR: SUGGESTED THERAPISTS (GUÍAS DE LUZ)
        ══════════════════════════════════════════════════════════ */}
        <div className="lg:hidden mb-6 bg-white/70 backdrop-blur-md rounded-3xl p-4 border border-slate-200/50 shadow-sm">
          <div className="flex items-center gap-1.5 mb-3 px-1">
            <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">
              Guías de Luz Disponibles
            </span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
            {activeTherapists.map((therapist) => (
              <div key={therapist.id} className="flex flex-col items-center text-center bg-white p-3 rounded-2xl border border-slate-100 shadow-sm shrink-0 w-28 space-y-1">
                <div className="relative">
                  <div className="h-10 w-10 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 font-bold text-xs text-slate-700">
                    {therapist.avatar ? (
                      <img src={therapist.avatar} alt={therapist.name} className="h-full w-full object-cover" />
                    ) : (
                      getInitials(therapist.name)
                    )}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-500 rounded-full border border-white" />
                </div>
                <h4 className="font-bold text-[10px] text-slate-800 truncate w-full">
                  {getShortName(therapist.name)}
                </h4>
                <p className="text-[8px] text-slate-400 truncate w-full">
                  {therapist.role}
                </p>
                <Link
                  to={`/agenda?therapist=${therapist.id}&therapistName=${encodeURIComponent(therapist.name)}`}
                  className="bg-primary text-white font-bold text-[8px] py-1 px-3.5 rounded-lg hover:bg-primary-dark transition-all mt-1"
                >
                  Agendar
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ══════════════════════════════════════════════════════════
              LEFT COLUMN: TU SINTONÍA (DESKTOP)
          ══════════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-3 hidden lg:block sticky top-24 space-y-6">
            
            {/* Tuning Profile widget */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-accent to-amber-300" />
              
              <div className="flex justify-center mb-4">
                <Link to="/mi-perfil">
                  <div className="h-20 w-20 rounded-2xl border-2 border-slate-100 shadow-lg overflow-hidden relative transition-transform duration-500 group-hover:rotate-3">
                    {me?.profilePictureUrl ? (
                      <img src={me.profilePictureUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-slate-50 flex items-center justify-center font-black text-slate-700 text-2xl">
                        {myInitials}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
              
              <h3 className="font-bold text-slate-800 text-lg leading-tight">
                {isAuthed ? `${me?.firstName || ''} ${me?.lastName || ''}` : 'Conexión Luz'}
              </h3>
              {isAuthed && (
                <Link to={`/perfil/${encodeURIComponent(`${me?.firstName || ''} ${me?.lastName || ''}`)}`} className="text-[10px] text-primary font-bold hover:underline mt-1 block">
                  Ver perfil público
                </Link>
              )}
              <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mt-1">
                {isAuthed ? (me?.hasActiveSubscription ? 'Miembro Premium ✨' : 'Sembrador/a') : 'Portal de Bienestar'}
              </p>
              
              {!isAuthed && (
                <Link
                  to="/login"
                  className="mt-5 w-full inline-flex items-center justify-center bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 font-bold text-xs py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>

            {/* Navigation shortcuts widget */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 px-3 pb-3 block border-b border-slate-50">
                Tu Laboratorio
              </span>
              <div className="space-y-1 pt-2">
                {[
                  { name: 'Tests de Bienestar', href: '/actividades/tests', icon: ClipboardList, color: 'text-rose-500' },
                  { name: 'Ejercicios Guiados', href: '/actividades/ejercicios', icon: Dumbbell, color: 'text-indigo-500' },
                  { name: 'Diario Emocional', href: '/actividades/diario', icon: NotebookPen, color: 'text-emerald-500' },
                  { name: 'Relajación y Calma', href: '/actividades/relajacion', icon: Wind, color: 'text-sky-500' },
                  { name: 'Mi Calendario', href: '/mi-calendario', icon: Calendar, color: 'text-amber-500' }
                ].map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className={cn('h-4.5 w-4.5', link.color)} />
                      <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                        {link.name}
                      </span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-350 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1 group-hover:translate-x-0" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* ══════════════════════════════════════════════════════════
              MIDDLE COLUMN: GLOWING INTENTIONS (THE SOCIAL FEED)
          ══════════════════════════════════════════════════════════ */}
          <main className="lg:col-span-6 space-y-6">
            
            {/* Interactive spark creator card — only visible for professional title holders */}
            {canPublish && (
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-4 md:p-5 space-y-4">
              {isCreatorExpanded ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Sembrar un Destello de Luz
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCreatorExpanded(false)}
                      className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center font-bold text-slate-750 bg-slate-50">
                      {me?.profilePictureUrl ? (
                        <img src={me.profilePictureUrl} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        myInitials
                      )}
                    </div>
                    <textarea
                      rows={3}
                      value={newPostContent}
                      onChange={e => setNewPostContent(e.target.value)}
                      placeholder="Comparte una experiencia, intención, duda o aprendizaje con la comunidad..."
                      className="w-full text-sm text-slate-700 placeholder-slate-400 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 resize-none transition-all duration-200"
                    />
                  </div>

                  {/* Image preview in creator */}
                  {newPostImage && (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-150 bg-slate-50 w-full max-h-64 mt-2 group/preview">
                      <img src={newPostImage} alt="Vista previa" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewPostImage(null)}
                        className="absolute top-2.5 right-2.5 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full p-1.5 transition-all shadow-md backdrop-blur-sm"
                        title="Quitar imagen"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Selected feeling display */}
                  {selectedFeeling && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-100 bg-slate-50/50 w-fit">
                      <span className="text-[11px] text-slate-500 font-medium">Sintonía:</span>
                      {(() => {
                        const feelingObj = FEELINGS_LIST.find(f => f.label === selectedFeeling);
                        return (
                          <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full border flex items-center gap-1', feelingObj?.color)}>
                            <span>{feelingObj?.emoji}</span>
                            <span>{feelingObj?.label}</span>
                          </span>
                        );
                      })()}
                      <button
                        type="button"
                        onClick={() => setSelectedFeeling(null)}
                        className="text-slate-400 hover:text-slate-600 ml-1.5 text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Actions row */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 relative">
                      <button
                        type="button"
                        onClick={() => setShowFeelingSelector(!showFeelingSelector)}
                        className={cn(
                          'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors',
                          showFeelingSelector && 'bg-slate-100 text-slate-800'
                        )}
                      >
                        <Smile className="h-4.5 w-4.5 text-amber-500" />
                        <span>Sintonizar Emoción</span>
                      </button>

                      <input
                        type="file"
                        id="new-post-image-input"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const compressed = await compressImage(file);
                              setNewPostImage(compressed);
                            } catch (err) {
                              console.error("Error compressing image:", err);
                            }
                          }
                          e.target.value = '';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('new-post-image-input')?.click()}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                      >
                        <LucideImage className="h-4.5 w-4.5 text-sky-500" />
                        <span>Añadir Imagen</span>
                      </button>

                      {/* Feeling selector panel */}
                      {showFeelingSelector && (
                        <div className="absolute top-10 left-0 bg-white border border-slate-200/80 rounded-2xl shadow-xl p-3.5 z-40 w-56 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                            ¿Cuál es tu sintonía hoy?
                          </span>
                          <div className="grid grid-cols-1 gap-1">
                            {FEELINGS_LIST.map(feel => (
                              <button
                                key={feel.label}
                                type="button"
                                onClick={() => {
                                  setSelectedFeeling(feel.label);
                                  setShowFeelingSelector(false);
                                }}
                                className="flex items-center gap-2 w-full text-left p-2 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold text-slate-700"
                              >
                                <span>{feel.emoji}</span>
                                <span>{feel.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleCreatePost}
                      disabled={!newPostContent.trim() && !newPostImage}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all duration-300',
                        newPostContent.trim() || newPostImage
                          ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:scale-[1.02]'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                      )}
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Sembrar Destello</span>
                    </button>
                  </div>
                </div>
              ) : isAuthed ? (
                <div
                  onClick={() => setIsCreatorExpanded(true)}
                  className="flex items-center justify-between bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-2xl p-3.5 cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 bg-white">
                      {me?.profilePictureUrl ? (
                        <img src={me.profilePictureUrl} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        myInitials
                      )}
                    </div>
                    <span className="text-xs md:text-sm font-bold text-slate-400 group-hover:text-slate-500">
                      ✨ Comparte un destello de luz, intención o reflexión...
                    </span>
                  </div>
                  <Sparkles className="h-4.5 w-4.5 text-primary/40 group-hover:text-primary transition-colors" />
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-between bg-gradient-to-r from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 border border-primary/20 rounded-2xl p-3.5 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs md:text-sm font-bold text-slate-500 group-hover:text-primary transition-colors">
                      Inicia sesión para sembrar un destello de luz...
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full shrink-0">
                    Entrar
                  </span>
                </Link>
              )}
            </div>
            )}

            {/* Glowing Threads (Posts feed) */}
            <div className="space-y-6 relative">
              {/* Subtle glowing vertical line behind cards on desktop */}
              <div className="absolute top-4 bottom-4 left-9 w-0.5 bg-gradient-to-b from-primary/10 via-accent/5 to-transparent hidden md:block pointer-events-none" />

              {displayedPosts.map(post => {
                const isLikedByMe = post.likes.includes(myName);
                const isCommentsOpen = activeCommentsPostId === post.id;
                const feelingData = FEELINGS_LIST.find(f => f.label === post.feeling);
                const resolveRoleIndex = (userData: any, isPremium: boolean) => {
                  if (userData?.occupation?.trim()) {
                    const occ = userData.occupation.trim();
                    return occ.charAt(0).toUpperCase() + occ.slice(1);
                  }
                  if (userData?.userType) {
                    const ut = userData.userType.toLowerCase();
                    if (ut === 'paciente') return 'Paciente';
                    if (ut === 'miembro') return isPremium ? 'Miembro Premium' : 'Miembro';
                    return userData.userType.charAt(0).toUpperCase() + userData.userType.slice(1);
                  }
                  return isPremium ? 'Miembro Premium' : 'Miembro';
                };
                const displayRole = post.authorName === myName && me
                  ? resolveRoleIndex(me, Boolean(me.hasActiveSubscription))
                  : post.authorRole;

                return (
                  <article
                    key={post.id}
                    className={cn(
                      'bg-white rounded-3xl border transition-all duration-300 p-5 space-y-4 relative group',
                      getMoodColor(post.feeling)
                    )}
                  >
                    
                    {/* Post Author / Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Link to={`/perfil/${encodeURIComponent(post.authorName)}`} className="hover:opacity-90 transition-opacity shrink-0 relative z-10">
                          <div className="h-10 w-10 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                            {post.authorAvatar ? (
                              <img src={post.authorAvatar} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full bg-slate-50 flex items-center justify-center font-bold text-slate-650 text-xs">
                                {post.authorName?.[0] || 'M'}
                              </div>
                            )}
                          </div>
                        </Link>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link to={`/perfil/${encodeURIComponent(post.authorName)}`} className="font-bold text-slate-800 text-sm leading-tight hover:text-primary transition-colors">
                              {post.authorName}
                            </Link>
                            {/* Role Tag */}
                            <span className={cn(
                              'text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider',
                              displayRole.includes('Terapeuta') || displayRole.includes('Psicó') || displayRole.includes('Psiqui')
                                ? 'bg-primary/10 text-primary border border-primary/15'
                                : 'bg-slate-100 text-slate-500 border border-slate-200/40'
                            )}>
                              {displayRole}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {post.createdAt}
                          </span>
                        </div>
                      </div>

                      {/* Emotion Tag or Edit/Delete Controls */}
                      <div className="flex items-center gap-2">
                        {post.feeling && feelingData && (
                          <span className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 border shadow-sm', feelingData.color)}>
                            <span>{feelingData.emoji}</span>
                            <span>{feelingData.label}</span>
                          </span>
                        )}

                        {post.authorName === myName && !post.isSystemPost && (
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPostId(post.id);
                                setEditingPostContent(post.content);
                                setDeletingPostId(null);
                              }}
                              className="text-slate-450 hover:text-primary p-1 hover:bg-slate-50 rounded-lg transition-colors"
                              title="Editar destello"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDeletingPostId(post.id);
                                setEditingPostId(null);
                              }}
                              className="text-slate-450 hover:text-rose-500 p-1 hover:bg-slate-50 rounded-lg transition-colors"
                              title="Eliminar destello"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Post Content / Edit Area */}
                    {deletingPostId === post.id ? (
                      <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                        <div className="text-xs text-rose-700 font-bold">
                          ¿Estás seguro de que deseas eliminar este destello? Esta acción no se puede deshacer.
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDeletePostSubmit(post.id)}
                            className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] py-1.5 px-4 rounded-xl shadow-sm transition-all"
                          >
                            Eliminar
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingPostId(null)}
                            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold text-[10px] py-1.5 px-4 rounded-xl shadow-sm transition-all"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : editingPostId === post.id ? (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <textarea
                          rows={3}
                          value={editingPostContent}
                          onChange={e => setEditingPostContent(e.target.value)}
                          className="w-full text-sm text-slate-700 placeholder-slate-400 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 resize-none transition-all duration-200"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => handleEditPostSubmit(post.id)}
                            disabled={!editingPostContent.trim() && !post.image && !editingPostImage}
                            className="bg-gradient-to-r from-primary to-accent text-white font-bold text-[10px] py-1.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                          >
                            Guardar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPostId(null);
                              setEditingPostContent('');
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold text-[10px] py-1.5 px-4 rounded-xl shadow-sm transition-all"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {post.content && (
                          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                            {post.content}
                          </p>
                        )}
                        {post.image && (
                          <div className="relative rounded-2xl overflow-hidden border border-slate-150 bg-slate-50 w-full max-h-96 mt-2">
                            <img src={post.image} alt="Publicación" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </>
                    )}

                    {/* Interactive Actions Row */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-xs text-slate-400">
                      
                      {/* Illuminate Spark button */}
                      <button
                        type="button"
                        onClick={() => handleLikePost(post.id)}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all duration-200',
                          isLikedByMe
                            ? 'text-amber-500 bg-amber-50/70 border border-amber-100 shadow-sm scale-102'
                            : 'hover:bg-slate-50 hover:text-slate-700 text-slate-450'
                        )}
                      >
                        <Sun className={cn('h-4.5 w-4.5', isLikedByMe && 'fill-amber-400 animate-spin-slow text-amber-500')} />
                        <span>Iluminar ({post.likes.length})</span>
                      </button>

                      {/* Resonate (comment) button */}
                      <button
                        type="button"
                        onClick={() => setActiveCommentsPostId(isCommentsOpen ? null : post.id)}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all duration-200',
                          isCommentsOpen
                            ? 'text-primary bg-primary/5 border border-primary/10 shadow-sm'
                            : 'hover:bg-slate-50 hover:text-slate-700 text-slate-450'
                        )}
                      >
                        <Wind className="h-4.5 w-4.5 text-sky-400" />
                        <span>Resonar ({post.comments.length})</span>
                      </button>

                    </div>

                    {/* Resonances (Comments) Accordion */}
                    {isCommentsOpen && (
                      <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-1 duration-200">
                        {/* New resonance input */}
                        {isAuthed ? (
                          <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg overflow-hidden shrink-0 border border-slate-150 flex items-center justify-center font-bold text-[10px] text-slate-700 bg-slate-50">
                              {me?.profilePictureUrl ? (
                                <img src={me.profilePictureUrl} alt="Avatar" className="h-full w-full object-cover" />
                              ) : (
                                myInitials
                              )}
                            </div>
                            <input
                              type="text"
                              value={commentInputs[post.id] || ''}
                              onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                              placeholder="Aporta una resonancia compasiva..."
                              className="flex-1 bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all"
                            />
                            <button
                              type="submit"
                              disabled={!commentInputs[post.id]?.trim()}
                              className={cn(
                                'p-2 rounded-xl transition-all duration-200 shrink-0',
                                commentInputs[post.id]?.trim()
                                  ? 'bg-primary text-white hover:scale-[1.05] shadow-sm'
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              )}
                            >
                              <Send className="h-3.5 w-3.5" />
                            </button>
                          </form>
                        ) : (
                          <Link
                            to="/login"
                            className="flex items-center gap-2 bg-slate-50 border border-slate-150 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                          >
                            <Wind className="h-3.5 w-3.5 text-sky-400" />
                            <span>Inicia sesión para aportar una resonancia</span>
                          </Link>
                        )}

                        {/* Resonances list */}
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                          {post.comments.length === 0 ? (
                            <p className="text-[10px] text-slate-400 text-center py-2 italic">
                              Aún no hay resonancias. Comparte tus palabras de apoyo o reflexión.
                            </p>
                          ) : (
                            post.comments.map(comment => (
                              <div key={comment.id} className="flex gap-2.5 items-start">
                                <Link to={`/perfil/${encodeURIComponent(comment.authorName)}`} className="hover:opacity-90 transition-opacity shrink-0">
                                  <div className="h-7 w-7 rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center font-bold text-[9px] text-slate-550 bg-slate-50">
                                    {comment.authorAvatar ? (
                                      <img src={comment.authorAvatar} alt="Avatar" className="h-full w-full object-cover" />
                                    ) : (
                                      comment.authorName?.[0] || 'M'
                                    )}
                                  </div>
                                </Link>
                                <div className="flex-1 bg-slate-50/70 rounded-2xl px-3.5 py-2.5 border border-slate-150/40">
                                  <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <Link to={`/perfil/${encodeURIComponent(comment.authorName)}`} className="font-bold text-xs text-slate-800 leading-tight hover:text-primary transition-colors">
                                          {comment.authorName}
                                        </Link>
                                        <span className="text-[7px] bg-slate-200/50 text-slate-550 font-black px-1.5 py-0.2 rounded-full uppercase">
                                          {comment.authorRole}
                                        </span>
                                      </div>

                                      {comment.authorName === myName && (
                                        <div className="flex items-center gap-0.5 ml-1">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setEditingCommentId(comment.id);
                                              setEditingCommentContent(comment.content);
                                              setDeletingCommentId(null);
                                            }}
                                            className="text-slate-400 hover:text-primary p-0.5 hover:bg-slate-105 rounded transition-colors"
                                            title="Editar comentario"
                                          >
                                            <Pencil className="h-2.5 w-2.5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setDeletingCommentId(comment.id);
                                              setEditingCommentId(null);
                                            }}
                                            className="text-slate-400 hover:text-rose-505 p-0.5 hover:bg-slate-105 rounded transition-colors"
                                            title="Eliminar comentario"
                                          >
                                            <Trash2 className="h-2.5 w-2.5" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                    <span className="text-[9px] text-slate-400">
                                      {comment.createdAt}
                                    </span>
                                  </div>
                                  
                                  {deletingCommentId === comment.id ? (
                                    <div className="mt-1 bg-rose-50/50 border border-rose-100 rounded-xl p-2 flex items-center justify-between gap-3 animate-in fade-in duration-150">
                                      <span className="text-[9px] text-rose-700 font-bold">
                                        ¿Eliminar resonancia?
                                      </span>
                                      <div className="flex gap-1 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteCommentSubmit(post.id, comment.id)}
                                          className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-[8px] py-1 px-2 rounded-lg shadow-sm transition-all"
                                        >
                                          Sí
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setDeletingCommentId(null)}
                                          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold text-[8px] py-1 px-2 rounded-lg shadow-sm transition-all"
                                        >
                                          No
                                        </button>
                                      </div>
                                    </div>
                                  ) : editingCommentId === comment.id ? (
                                    <div className="mt-1.5 space-y-2 animate-in fade-in duration-150">
                                      <input
                                        type="text"
                                        value={editingCommentContent}
                                        onChange={e => setEditingCommentContent(e.target.value)}
                                        className="w-full bg-white border border-slate-150 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all"
                                      />
                                      <div className="flex gap-1.5 justify-end">
                                        <button
                                          type="button"
                                          onClick={() => handleEditCommentSubmit(post.id, comment.id)}
                                          disabled={!editingCommentContent.trim()}
                                          className="bg-primary text-white font-bold text-[8px] py-1 px-2.5 rounded-lg shadow-sm hover:scale-[1.02] transition-all disabled:opacity-50"
                                        >
                                          Guardar
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditingCommentId(null);
                                            setEditingCommentContent('');
                                          }}
                                          className="bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold text-[8px] py-1 px-2.5 rounded-lg shadow-sm transition-all"
                                        >
                                          Cancelar
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-[11px] text-slate-600 mt-1 leading-normal whitespace-pre-wrap">
                                      {comment.content}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Scroll Infinite Loader */}
            {visiblePostsCount < prioritizedPosts.length && (
              <div className="flex justify-center py-6">
                {loadingMore ? (
                  <div className="flex items-center gap-2 text-slate-550 text-xs font-bold bg-white px-4.5 py-2.5 rounded-full shadow-sm border border-slate-150 animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Cargando más destellos de la comunidad...</span>
                  </div>
                ) : (
                  <div className="h-4" />
                )}
              </div>
            )}
            
            {visiblePostsCount >= prioritizedPosts.length && prioritizedPosts.length > 0 && (
              <p className="text-center text-xs text-slate-400 font-bold py-6">
                ✨ Has alcanzado la raíz de todos los destellos por hoy.
              </p>
            )}
          </main>

          {/* ══════════════════════════════════════════════════════════
              RIGHT COLUMN: GUÍAS DE LUZ & SEMILLAS (DESKTOP)
          ══════════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-3 hidden lg:block sticky top-24 space-y-6">
            
            {/* Suggested therapists widget */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">
                  Guías de Luz
                </span>
              </div>
              <div className="space-y-4">
                {activeTherapists.map((therapist) => (
                  <div key={therapist.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-9 w-9 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-sm flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 font-bold text-[10px] text-slate-700">
                        {therapist.avatar ? (
                          <img src={therapist.avatar} alt={therapist.name} className="h-full w-full object-cover" />
                        ) : (
                          getInitials(therapist.name)
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-slate-800 truncate leading-tight">
                          {therapist.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {therapist.role}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/agenda?therapist=${therapist.id}&therapistName=${encodeURIComponent(therapist.name)}`}
                      className="bg-primary/5 hover:bg-primary/10 text-primary font-bold text-[10px] py-1.5 px-3 rounded-lg transition-colors shrink-0 shadow-sm"
                    >
                      Agendar
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Seed of Light Widget */}
            <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-white rounded-3xl border border-primary/10 shadow-sm p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Sparkle className="w-24 h-24 text-primary" />
              </div>
              <div className="relative z-10 space-y-2">
                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Semilla de Luz
                </span>
                <p className="text-xs italic text-slate-650 font-semibold leading-relaxed">
                  "{MOTIVATIONAL_QUOTES[quoteIndex]}"
                </p>
              </div>
            </div>

            {/* Recommended Activity Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <Activity className="h-4.5 w-4.5 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">
                  Práctica Recomendada
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 space-y-2.5">
                <h4 className="font-bold text-xs text-slate-800">
                  🌬️ Ejercicio Respiración 4-7-8
                </h4>
                <p className="text-[10px] text-slate-450 leading-relaxed">
                  Ideal para bajar las pulsaciones, disminuir la rumiación mental y conciliar el sueño.
                </p>
                <Link
                  to="/actividades/ejercicios"
                  className="w-full inline-flex items-center justify-center gap-1 bg-gradient-to-r from-primary to-accent text-white font-bold text-[10px] py-2 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  Comenzar ahora
                </Link>
              </div>
            </div>

          </aside>

        </div>
      </div>
    </PublicLayout>
  );
};

export default Index;
