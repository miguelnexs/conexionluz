import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import AWEDailyWidget from '../components/awe/AWEDailyWidget';
import { api } from '../api/client';
import { cn, formatTimeAgo } from '@/lib/utils';
import { ExpandableText } from '@/components/ui/ExpandableText';
import { CustomVideoPlayer } from '@/components/ui/CustomVideoPlayer';
import { PostDetailModal, CommentItem } from '@/components/ui/PostDetailModal';
import { ShareMenuModal } from '@/components/ui/ShareMenuModal';
import { encodePostSlug, decodePostSlug } from '@/utils/postSlug';
import { useTherapists } from '../hooks/useTherapists';
import { useCommunityPosts, Post, Comment } from '../hooks/useCommunityPosts';
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
  Sprout,
  Image as LucideImage,
  Video,
  Maximize2,
  Share2
} from 'lucide-react';

const isVideoMedia = (url?: string): boolean => {
  if (!url) return false;
  const lower = url.toLowerCase().trim();
  if (lower.startsWith('data:')) {
    return lower.startsWith('data:video/');
  }
  if (lower.startsWith('blob:')) {
    return true;
  }
  if (lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('vimeo.com')) {
    return true;
  }
  const videoExtensions = ['.mp4', '.webm', '.mov', '.m4v', '.avi', '.mkv', '.ogv', '.3gp'];
  return videoExtensions.some((ext) => lower.includes(ext));
};

const getEmbedVideo = (url: string): { type: 'youtube' | 'vimeo' | 'native'; src: string } => {
  const lower = url.toLowerCase().trim();
  // YouTube: https://www.youtube.com/watch?v=ID or https://youtu.be/ID
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) {
    return { type: 'youtube', src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0` };
  }
  // Vimeo: https://vimeo.com/ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return { type: 'vimeo', src: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }
  return { type: 'native', src: url };
};

// NOTE: readVideoFile was removed intentionally.
// Loading large video files as DataURL into browser memory causes
// the browser tab to crash/freeze on files > 100MB.
// Videos are now sent directly as File via FormData.

const FEELINGS_LIST = [
  { emoji: '🌱', label: 'En calma', color: 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)] hover:border-emerald-300' },
  { emoji: '⚡', label: 'Con energía', color: 'bg-amber-50 text-amber-700 border-amber-100 shadow-[0_0_15px_-3px_rgba(245,158,11,0.15)] hover:border-amber-355 hover:border-amber-300' },
  { emoji: '🌪️', label: 'Abrumado/a', color: 'bg-rose-50 text-rose-700 border-rose-100 shadow-[0_0_15px_-3px_rgba(244,63,94,0.15)] hover:border-rose-300' },
  { emoji: '✨', label: 'Inspirado/a', color: 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-[0_0_15px_-3px_rgba(99,102,241,0.15)] hover:border-indigo-300' },
  { emoji: '💤', label: 'Cansado/a', color: 'bg-slate-50 text-slate-700 border-slate-100 shadow-[0_0_15px_-3px_rgba(71,85,105,0.12)] hover:border-slate-300' },
];


const SUGGESTED_THERAPISTS = [
  {
    name: 'Dr. Carlos Mendoza',
    role: 'Psicólogo Clínico',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150',
    tags: ['Ansiedad', 'Depresión']
  },
  {
    name: 'Dra. Laura Restrepo',
    role: 'Terapeuta de Conciencia',
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=150',
    tags: ['Reiki', 'Meditación']
  },
  {
    name: 'Dra. Andrea Gomez',
    role: 'Psicóloga Gestalt',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    tags: ['Gestalt', 'Duelo']
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
    if (!file.type.startsWith('image/')) {
      resolve('');
      return;
    }
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

const getCachedUserMe = () => {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem('conexionluz:user_me');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const getCachedFollowingNames = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('conexionluz:following_names');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

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

  // Map database therapists to the structure used by the view
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

  // User profile & follow state initialized from localStorage cache for instant render
  const [me, setMe] = useState<any | null>(getCachedUserMe);
  const [followingNames, setFollowingNames] = useState<string[]>(getCachedFollowingNames);

  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [newPostFile, setNewPostFile] = useState<File | null>(null);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const uploadAbortRef = useRef<AbortController | null>(null);
  const [showFeelingSelector, setShowFeelingSelector] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showVideoOptionMenu, setShowVideoOptionMenu] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoLoadProgress, setVideoLoadProgress] = useState(0);
  const videoTimesRef = useRef<Record<string, number>>({});
  const [modalInitialTime, setModalInitialTime] = useState<number>(0);
  const [isPublishingPost, setIsPublishingPost] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadStatusText, setUploadStatusText] = useState<string>('');
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

  // Hook for cached community posts, background SWR revalidation & infinite scroll sentinel
  const {
    posts,
    totalPosts,
    visibleCount,
    hasMore,
    isSyncing,
    isFetchingMore,
    sentinelRef,
    trackPostView,
    createPost,
    likePost,
    addComment,
    likeComment,
    addReply,
    editPost,
    deletePost,
    editComment,
    deleteComment
  } = useCommunityPosts(me, isAuthed);

  // Load User Data & Followed Users List with localStorage persistence
  useEffect(() => {
    if (isAuthed) {
      api.get('/api/portal/me/').then(res => {
        if (res.ok) {
          const userData = res.data;
          setMe(userData);
          localStorage.setItem('conexionluz:user_me', JSON.stringify(userData));
        }
      });
      api.get<any>('/api/portal/follow/patients/following/').then(res => {
        if (res.ok) {
          const names = res.data.following || [];
          setFollowingNames(names);
          localStorage.setItem('conexionluz:following_names', JSON.stringify(names));
        }
      });
    }
  }, [isAuthed]);

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));
  }, []);

  const myName = me ? `${me.firstName || ''} ${me.lastName || ''}`.trim() : 'Miembro Invitado';

  // Prioritize followed users' posts first, showing community posts as a discovery fallback if none/few exist
  const prioritizedPosts = useMemo(() => {
    if (!isAuthed || followingNames.length === 0) {
      return posts;
    }
    
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

  const visibleDisplayedPosts = useMemo(() => {
    return prioritizedPosts.slice(0, visibleCount);
  }, [prioritizedPosts, visibleCount]);

  // Edit post handler
  const handleEditPostSubmit = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const currentImg = editingPostImage !== null ? editingPostImage : (post.image || '');
    if (!editingPostContent.trim() && !currentImg) return;

    await editPost(postId, editingPostContent, currentImg);
    setEditingPostId(null);
    setEditingPostContent('');
    setEditingPostImage(null);
  };

  // Delete post handler
  const handleDeletePostSubmit = async (postId: string) => {
    await deletePost(postId);
    setDeletingPostId(null);
  };

  // Edit comment handler
  const handleEditCommentSubmit = async (postId: string, commentId: string) => {
    if (!editingCommentContent.trim()) return;
    await editComment(postId, commentId, editingCommentContent);
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  // Delete comment handler
  const handleDeleteCommentSubmit = async (postId: string, commentId: string) => {
    await deleteComment(postId, commentId);
    setDeletingCommentId(null);
  };

  // Create Spark/Intention
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() && !newPostImage && !newPostFile) return;
    if (isVideoLoading || isPublishingPost) return;

    // Cancel any in-flight upload first
    if (uploadAbortRef.current) {
      uploadAbortRef.current.abort();
    }
    const abortController = new AbortController();
    uploadAbortRef.current = abortController;

    setIsPublishingPost(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadStatusText('Preparando publicación...');

    const resetUpload = (errMsg?: string) => {
      setUploadProgress(null);
      setUploadStatusText('');
      setIsPublishingPost(false);
      uploadAbortRef.current = null;
      if (errMsg) setUploadError(errMsg);
    };

    try {
      const res = await createPost(
        newPostContent,
        newPostImage || undefined,
        selectedFeeling || undefined,
        newPostFile || undefined,
        (percent) => {
          if (abortController.signal.aborted) return;
          setUploadProgress(percent);
          if (percent < 96) {
            setUploadStatusText(`Subiendo video al servidor (${percent}%)...`);
          } else if (percent >= 96 && percent < 100) {
            setUploadStatusText('¡Video subido! Guardando y procesando en el servidor...');
          } else {
            setUploadStatusText('¡Publicación realizada exitosamente!');
          }
        },
        abortController.signal
      );

      if (abortController.signal.aborted) return;

      if (res.ok) {
        setUploadProgress(100);
        setUploadStatusText('¡Publicación realizada exitosamente!');
        setTimeout(() => {
          setNewPostContent('');
          setNewPostImage(null);
          setNewPostFile(null);
          setSelectedFeeling(null);
          setShowFeelingSelector(false);
          setShowVideoOptionMenu(false);
          setShowVideoModal(false);
          setIsCreatorExpanded(false);
          setUploadError(null);
          resetUpload();
        }, 600);
      } else {
        resetUpload(res.error || 'Error al publicar.');
      }
    } catch (err: any) {
      console.error("Error creating post:", err);
      resetUpload(err?.message || 'Error inesperado al publicar.');
    }
  };

  // Illuminate Post (Optimistic Update)
  const handleLikePost = (postId: string) => {
    if (!isAuthed) {
      navigate('/login');
      return;
    }
    likePost(postId);
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

    await addComment(postId, commentText);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const myInitials = me ? `${me.firstName?.[0] || ''}${me.lastName?.[0] || ''}`.toUpperCase() : 'M';

  // Only users explicitly granted publish permission from the admin dashboard can create posts
  const canPublish = isAuthed;


  const { postId } = useParams<{ postId?: string }>();

  // Lightbox post detail modal reactive state
  const [selectedLightboxPostId, setSelectedLightboxPostId] = useState<string | null>(null);
  const [sharePostId, setSharePostId] = useState<string | null>(null);
  const [sharePostContent, setSharePostContent] = useState<string>('');

  const selectedLightboxPost = useMemo(() => {
    if (!selectedLightboxPostId) return null;
    return posts.find(p => String(p.id) === String(selectedLightboxPostId)) || null;
  }, [selectedLightboxPostId, posts]);

  // Sync modal with URL route (e.g. /publicacion/destello-bHV6OjU)
  useEffect(() => {
    if (postId && posts.length > 0) {
      const rawId = decodePostSlug(postId);
      const targetPost = posts.find(p => String(p.id) === String(rawId) || String(p.id) === String(postId));
      if (targetPost) {
        setSelectedLightboxPostId(String(targetPost.id));
      }
    }
  }, [postId, posts]);

  const handleOpenLightbox = (post: Post, explicitTime?: number) => {
    trackPostView(post.id);
    // Pause all background video elements on homepage
    document.querySelectorAll('video').forEach((v) => {
      try {
        v.pause();
      } catch {}
    });

    const time = typeof explicitTime === 'number' && explicitTime > 0
      ? explicitTime
      : (videoTimesRef.current[post.id] || 0);

    videoTimesRef.current[post.id] = time;
    setModalInitialTime(time);
    setSelectedLightboxPostId(String(post.id));
    const slug = encodePostSlug(post.id);
    navigate(`/publicacion/${slug}`, { replace: false });
  };

  const handleCloseLightbox = () => {
    setSelectedLightboxPostId(null);
    if (postId) {
      navigate('/', { replace: false });
    }
  };

  // Get mood colors dynamically
  const getMoodColor = (mood: string | undefined) => {
    if (!mood) return 'border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]';
    const match = FEELINGS_LIST.find(f => f.label === mood);
    return match ? match.color : 'border-slate-100';
  };

  return (
    <PublicLayout contentClassName="p-0">
      <div className="max-w-[1420px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        


        {/* ══════════════════════════════════════════════════════════
            MOBILE ONLY: QUICK ACCESS ACTIVITY GRID (LABORATORIO)
        ══════════════════════════════════════════════════════════ */}
        <div className="lg:hidden mb-5">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-3 px-1">
            Tu Laboratorio
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { name: 'Tests', href: '/actividades/tests', icon: ClipboardList, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
              { name: 'Ejercicios', href: '/actividades/ejercicios', icon: Dumbbell, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100' },
              { name: 'Diario', href: '/actividades/diario', icon: NotebookPen, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
              { name: 'Relajación', href: '/actividades/relajacion', icon: Wind, color: 'text-sky-500', bg: 'bg-sky-50', border: 'border-sky-100' },
            ].map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="flex flex-col items-center text-center p-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-95 group"
              >
                <div className={`h-11 w-11 rounded-2xl ${link.bg} border ${link.border} flex items-center justify-center mb-1.5 shadow-xs`}>
                  <link.icon className={`h-5 w-5 ${link.color}`} />
                </div>
                <span className="font-bold text-[10px] text-slate-700 leading-tight">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>
        </div>


        {/* ══════════════════════════════════════════════════════════
            MOBILE ONLY: SUGGESTED THERAPISTS (GUÍAS DE LUZ)
        ══════════════════════════════════════════════════════════ */}
        <div className="lg:hidden mb-5">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-700">
                Guías de Luz
              </span>
            </div>
            <Link to="/agenda" className="text-[10px] font-bold text-primary hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{scrollbarWidth:'none'}}>
            {activeTherapists.map((therapist) => (
              <div key={therapist.id} className="flex flex-col items-center text-center bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm shrink-0 w-[110px] space-y-2">
                <div className="relative">
                  <div className="h-12 w-12 rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 font-bold text-xs text-slate-700">
                    {therapist.avatar ? (
                      <img src={therapist.avatar} alt={therapist.name} className="h-full w-full object-cover" />
                    ) : (
                      getInitials(therapist.name)
                    )}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div className="w-full">
                  <h4 className="font-bold text-[11px] text-slate-800 truncate">
                    {getShortName(therapist.name)}
                  </h4>
                  <p className="text-[9px] text-slate-400 truncate mt-0.5">
                    {therapist.role}
                  </p>
                </div>
                <Link
                  to={`/agenda?therapist=${therapist.id}&therapistName=${encodeURIComponent(therapist.name)}`}
                  className="w-full bg-gradient-to-r from-primary to-[hsl(180,70%,32%)] text-white font-bold text-[9px] py-1.5 rounded-xl hover:opacity-90 transition-all shadow-sm"
                >
                  Agendar
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE ONLY: Community Feed Label */}
        <div className="lg:hidden mb-3 px-1 flex items-center gap-2">
          <MessageCircle className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
            Destellos de la Comunidad
          </span>
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
            
            {/* ─── REAL-TIME UPLOAD PROGRESS BANNER (WHITE SYSTEM DESIGN) ─── */}
            {uploadProgress !== null && (
              <div className="bg-white text-slate-900 rounded-3xl p-5 shadow-xl shadow-slate-200/60 border border-slate-200/90 animate-in fade-in slide-in-from-top-3 duration-300 mb-6">
                <div className="flex items-center justify-between gap-3 mb-3.5">
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Icon container */}
                    <div className="relative h-11 w-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 shadow-xs">
                      <Video className="h-5 w-5 text-indigo-600" />
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-bold text-slate-900 truncate">
                        {uploadStatusText || `Subiendo video al servidor (${uploadProgress}%)...`}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[11px] text-slate-500 font-semibold truncate">
                          {uploadProgress >= 96 ? 'Procesando archivo en el servidor...' : 'Subida en tiempo real al servidor'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs md:text-sm font-black tabular-nums text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-2xl shadow-xs">
                      {uploadProgress}%
                    </span>
                    <button
                      type="button"
                      title="Cancelar subida"
                      onClick={() => {
                        if (uploadAbortRef.current) {
                          uploadAbortRef.current.abort();
                          uploadAbortRef.current = null;
                        }
                        setUploadProgress(null);
                        setUploadStatusText('');
                        setIsPublishingPost(false);
                      }}
                      className="text-slate-400 hover:text-rose-600 transition-colors rounded-full p-2 hover:bg-rose-50 border border-transparent hover:border-rose-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/70 shadow-inner relative">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300 shadow-sm",
                      uploadProgress >= 96
                        ? "bg-gradient-to-r from-indigo-500 via-emerald-400 to-indigo-600 animate-pulse"
                        : "bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500"
                    )}
                    style={{ width: `${Math.max(4, uploadProgress)}%` }}
                  />
                </div>

                {/* Step dots */}
                <div className="flex items-center justify-between mt-3 px-1">
                  {['Iniciando', 'Transfiriendo', 'Procesando', 'Listo'].map((step, i) => {
                    const stepPercent = [0, 33, 96, 100][i];
                    const isActive = uploadProgress >= stepPercent;
                    return (
                      <div key={step} className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full transition-all ${isActive ? 'bg-indigo-600 shadow-xs scale-110' : 'bg-slate-200'}`} />
                        <span className={`text-[11px] font-bold transition-colors ${isActive ? 'text-indigo-700' : 'text-slate-400'}`}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}


            {/* ─── UPLOAD ERROR PANEL ─── */}
            {uploadError && uploadProgress === null && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 mb-4 animate-in fade-in duration-200 shadow-sm">
                <span className="text-lg shrink-0">⚠️</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm mb-0.5">Error al publicar</p>
                  <p className="text-xs text-red-700">{uploadError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadError(null)}
                  className="shrink-0 text-red-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

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

                  {/* Video Loading Progress Indicator */}
                  {isVideoLoading && (
                    <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-4 space-y-2 animate-in fade-in duration-200 mt-2">
                      <div className="flex items-center justify-between text-xs font-bold text-purple-800">
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                          <span>Cargando y procesando video en vista previa...</span>
                        </span>
                        <span className="font-black text-purple-700">{videoLoadProgress}%</span>
                      </div>
                      <div className="w-full bg-purple-200/60 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full transition-all duration-150 rounded-full"
                          style={{ width: `${videoLoadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Media (Image or Video) preview in creator once loaded */}
                  {newPostImage && !isVideoLoading && (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-black w-full max-h-80 mt-2 group/preview">
                      {isVideoMedia(newPostImage) ? (
                        <div>
                          <div className="bg-slate-900/90 text-emerald-400 text-[11px] font-bold px-3 py-1.5 flex items-center justify-between border-b border-slate-800">
                            <span className="flex items-center gap-1.5">
                              <span>✓</span> Video listo en vista previa. Puedes reproducirlo antes de publicar.
                            </span>
                          </div>
                          {(() => {
                            const embed = getEmbedVideo(newPostImage);
                            if (embed.type === 'youtube' || embed.type === 'vimeo') {
                              return (
                                <div className="aspect-video w-full h-full min-h-[220px]">
                                  <iframe src={embed.src} className="w-full h-full border-0" allowFullScreen />
                                </div>
                              );
                            }
                            return (
                              <CustomVideoPlayer src={newPostImage} autoPlay={false} autoPlayOnScroll={false} />
                            );
                          })()}
                        </div>
                      ) : (
                        <img src={newPostImage} alt="Vista previa" className="w-full h-full object-cover max-h-72" />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setNewPostImage(null);
                          setNewPostFile(null);
                        }}
                        className="absolute top-2.5 right-2.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full p-1.5 transition-all shadow-md backdrop-blur-sm z-10 cursor-pointer"
                        title="Quitar multimedia"
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

                  {/* Video URL Modal / Popup Input */}
                  {showVideoModal && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Video className="h-4 w-4 text-purple-600" /> Pegar Enlace de Video (YouTube, Vimeo, MP4)
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowVideoModal(false)}
                          className="text-slate-400 hover:text-slate-600 p-1"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={videoUrlInput}
                          onChange={(e) => setVideoUrlInput(e.target.value)}
                          placeholder="Ej: https://www.youtube.com/watch?v=..."
                          className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (videoUrlInput.trim()) {
                              setNewPostImage(videoUrlInput.trim());
                              setVideoUrlInput('');
                              setShowVideoModal(false);
                            }
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
                        >
                          Cargar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 flex-wrap relative">
                      <button
                        type="button"
                        onClick={() => setShowFeelingSelector(!showFeelingSelector)}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors',
                          showFeelingSelector && 'bg-slate-100 text-slate-800'
                        )}
                      >
                        <Smile className="h-4.5 w-4.5 text-amber-500" />
                        <span>Sintonizar Emoción</span>
                      </button>

                      {/* Image upload button */}
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
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                      >
                        <LucideImage className="h-4.5 w-4.5 text-sky-500" />
                        <span>Añadir Imagen</span>
                      </button>

                      {/* Video option menu popover button */}
                      <input
                        type="file"
                        id="new-post-video-input"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewPostFile(file);
                            // Use objectURL for preview - never read large files into memory
                            const objectUrl = URL.createObjectURL(file);
                            setNewPostImage(objectUrl);
                            setIsVideoLoading(false); // No loading needed - objectURL is instant
                            setVideoLoadProgress(100);
                          }
                          e.target.value = '';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('new-post-video-input')?.click()}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors text-slate-500 hover:text-slate-800 hover:bg-slate-50 cursor-pointer"
                      >
                        <Video className="h-4.5 w-4.5 text-purple-500" />
                        <span>Añadir Video</span>
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
                      disabled={(!newPostContent.trim() && !newPostImage) || isVideoLoading || isPublishingPost}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all duration-300',
                        (newPostContent.trim() || newPostImage) && !isVideoLoading && !isPublishingPost
                          ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:scale-[1.02] cursor-pointer'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                      )}
                    >
                      {isPublishingPost ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Publicando...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          <span>Sembrar Destello</span>
                        </>
                      )}
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

              {/* Background Syncing Indicator */}
              {isSyncing && posts.length > 0 && (
                <div className="flex items-center justify-between bg-primary/5 border border-primary/10 rounded-2xl px-4 py-2 text-[11px] text-primary font-bold animate-pulse">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Sincronizando destellos en segundo plano...</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-primary/70">En vivo</span>
                </div>
              )}

              {/* Skeleton Loaders if initial posts array is empty and fetching */}
              {posts.length === 0 && isSyncing ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-200" />
                        <div className="space-y-2 flex-1">
                          <div className="h-3 w-1/3 bg-slate-200 rounded" />
                          <div className="h-2 w-1/4 bg-slate-150 rounded" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 w-full bg-slate-150 rounded" />
                        <div className="h-3 w-4/5 bg-slate-150 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : visibleDisplayedPosts.map(post => {
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
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Link to={`/perfil/${encodeURIComponent(post.authorName)}`} className="hover:opacity-90 transition-opacity shrink-0 relative z-10">
                          <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-200/80 shadow-xs">
                            {post.authorAvatar ? (
                              <img src={post.authorAvatar} alt="Avatar" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
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
                              'text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider',
                              displayRole.includes('Terapeuta') || displayRole.includes('Psicó') || displayRole.includes('Psiqui')
                                ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                                : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                            )}>
                              {displayRole}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 font-medium block mt-0.5">
                            {formatTimeAgo(post.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Emotion Tag or Edit/Delete Controls */}
                      <div className="flex items-center gap-2">
                        {post.feeling && feelingData && (
                          <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border shadow-xs', feelingData.color)}>
                            <span>{feelingData.emoji}</span>
                            <span>{feelingData.label}</span>
                          </span>
                        )}

                        {post.authorName === myName && !post.isSystemPost && (
                          <div className="flex items-center gap-0.5 bg-slate-50 border border-slate-200/60 rounded-xl p-1 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPostId(post.id);
                                setEditingPostContent(post.content);
                                setEditingPostImage(post.image || null);
                                setDeletingPostId(null);
                              }}
                              className="text-slate-400 hover:text-primary p-1.5 hover:bg-white rounded-lg transition-all cursor-pointer"
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
                              className="text-slate-450 hover:text-rose-500 p-1.5 hover:bg-white rounded-lg transition-all cursor-pointer"
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

                        {/* Media (Image or Video) Preview during Edit */}
                        {(editingPostImage || post.image) && (
                          <div className="relative rounded-2xl overflow-hidden border border-slate-150 bg-black w-full max-h-64 group/editimg">
                            {(() => {
                              const media = editingPostImage !== null ? editingPostImage : post.image;
                              if (!media) return null;
                              if (isVideoMedia(media)) {
                                const embed = getEmbedVideo(media);
                                if (embed.type === 'youtube' || embed.type === 'vimeo') {
                                  return (
                                    <div className="aspect-video w-full h-full min-h-[220px]">
                                      <iframe src={embed.src} className="w-full h-full border-0" allowFullScreen />
                                    </div>
                                  );
                                }
                                return <CustomVideoPlayer src={media} autoPlay={false} autoPlayOnScroll={false} />;
                              }
                              return <img src={media} alt="Imagen de publicación" loading="lazy" decoding="async" className="w-full h-full object-cover max-h-64" />;
                            })()}
                            <button
                              type="button"
                              onClick={() => setEditingPostImage('')}
                              className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-full transition-colors shadow-md z-10 cursor-pointer"
                              title="Quitar contenido multimedia"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              id={`edit-post-image-input-${post.id}`}
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const compressed = await compressImage(file);
                                    setEditingPostImage(compressed);
                                  } catch (err) {
                                    console.error("Error compressing image:", err);
                                  }
                                }
                                e.target.value = '';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => document.getElementById(`edit-post-image-input-${post.id}`)?.click()}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/60 shadow-sm"
                            >
                              <LucideImage className="h-4 w-4 text-sky-500" />
                              <span>{editingPostImage || post.image ? 'Cambiar Imagen' : 'Añadir Imagen'}</span>
                            </button>
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditPostSubmit(post.id)}
                              disabled={!editingPostContent.trim() && !editingPostImage && !(editingPostImage === null && post.image)}
                              className="bg-gradient-to-r from-primary to-accent text-white font-bold text-[10px] py-1.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                            >
                              Guardar
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPostId(null);
                                setEditingPostContent('');
                                setEditingPostImage(null);
                              }}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold text-[10px] py-1.5 px-4 rounded-xl shadow-sm transition-all"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {post.content && (
                          <ExpandableText
                            text={post.content}
                            className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium"
                          />
                        )}
                        {post.image && (
                          <div className="relative rounded-none sm:rounded-2xl overflow-hidden mt-3 group/media cursor-pointer -mx-5 sm:mx-0">
                            {isVideoMedia(post.image) ? (
                              <div className="relative group/vid">
                                <CustomVideoPlayer
                                  src={post.image}
                                  autoPlay={false}
                                  autoPlayOnScroll={false}
                                  viewsCount={post.viewsCount || 0}
                                  onPlay={() => trackPostView(post.id)}
                                  isPaused={Boolean(selectedLightboxPost)}
                                  onTimeUpdate={(currentTime) => {
                                    videoTimesRef.current[post.id] = currentTime;
                                  }}
                                  onClickContainer={(_e, currentTime) => {
                                    handleOpenLightbox(post, currentTime);
                                  }}
                                />
                              </div>
                            ) : (
                              <div onClick={() => handleOpenLightbox(post)} className="relative group/img">
                                <img src={post.image} alt="Publicación" loading="lazy" decoding="async" className="w-full h-full object-cover max-h-[560px] group-hover/img:scale-[1.01] transition-transform duration-300" />
                                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-1.5 shadow-xl">
                                    <Maximize2 className="h-3.5 w-3.5 text-emerald-400" /> Ver en pantalla completa con comentarios
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {/* Interactive Actions Row */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs text-slate-400">
                      
                      {/* Illuminate Spark (like) button */}
                      <button
                        type="button"
                        onClick={() => handleLikePost(post.id)}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer',
                          isLikedByMe
                            ? 'text-amber-500 bg-amber-50/70 border border-amber-100 shadow-sm scale-102'
                            : 'hover:bg-slate-50 hover:text-slate-700 text-slate-450'
                        )}
                      >
                        <Sun className={cn('h-4.5 w-4.5', isLikedByMe && 'fill-amber-400 animate-spin-slow text-amber-500')} />
                        <span>Iluminar ({post.likes.length})</span>
                      </button>

                      {/* Sembrar (comment) button */}
                      <button
                        type="button"
                        onClick={() => setActiveCommentsPostId(isCommentsOpen ? null : post.id)}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer',
                          isCommentsOpen
                            ? 'text-emerald-600 bg-emerald-50/80 border border-emerald-200 shadow-sm'
                            : 'hover:bg-slate-50 hover:text-slate-700 text-slate-450'
                        )}
                      >
                        <Sprout className={cn('h-4.5 w-4.5 text-emerald-600', isCommentsOpen && 'fill-emerald-400')} />
                        <span>Sembrar ({post.comments.length})</span>
                      </button>

                      {/* Compartir Button with WhatsApp, Facebook, Instagram and Link Copy */}
                      <button
                        type="button"
                        onClick={() => {
                          setSharePostId(post.id);
                          setSharePostContent(post.content || '');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold hover:bg-emerald-50 hover:text-emerald-700 text-slate-450 transition-all duration-200 border border-transparent hover:border-emerald-100 cursor-pointer"
                        title="Compartir publicación"
                      >
                        <Share2 className="h-4 w-4 text-emerald-600" />
                        <span>Compartir</span>
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
                                <img src={me.profilePictureUrl} alt="Avatar" loading="lazy" decoding="async" className="h-full w-full object-cover" />
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

                        {/* Resonances list with full multi-level replies, likes, editing & deletion */}
                        <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                          {post.comments.length === 0 ? (
                            <p className="text-[10px] text-slate-400 text-center py-2 italic">
                              Aún no hay resonancias. Comparte tus palabras de apoyo o reflexión.
                            </p>
                          ) : (
                            post.comments.map(comment => (
                              <CommentItem
                                key={comment.id}
                                comment={comment}
                                postId={post.id}
                                level={0}
                                onLikeComment={likeComment}
                                onAddReply={addReply}
                                onEditComment={editComment}
                                onDeleteComment={deleteComment}
                                myName={myName}
                                isAuthed={isAuthed}
                              />
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Scroll Infinite Loader & Sentinel */}
            <div ref={sentinelRef} className="h-4 w-full" />

            {visibleCount < prioritizedPosts.length && (
              <div className="flex justify-center py-6">
                <div className="flex items-center gap-2 text-slate-550 text-xs font-bold bg-white px-4.5 py-2.5 rounded-full shadow-sm border border-slate-150 animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Cargando más destellos de la comunidad...</span>
                </div>
              </div>
            )}
            
            {visibleCount >= prioritizedPosts.length && prioritizedPosts.length > 0 && (
              <p className="text-center text-xs text-slate-400 font-bold py-6">
                ✨ Has alcanzado la raíz de todos los destellos por hoy.
              </p>
            )}
          </main>

          {/* ══════════════════════════════════════════════════════════
              RIGHT COLUMN: SABIDURÍA DEL DÍA, GUÍAS DE LUZ & SEMILLAS (DESKTOP)
          ══════════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-3 hidden lg:block sticky top-24 space-y-6">
            
            {/* Adaptive Wisdom Engine (AWE) Widget - Sabiduría del Día */}
            <AWEDailyWidget compact />

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

          </aside>

        </div>
      </div>

      {/* Fullscreen Post Lightbox Modal (Facebook-style theater layout with original Conexión Luz design) */}
      <PostDetailModal
        post={selectedLightboxPost}
        isOpen={Boolean(selectedLightboxPost)}
        initialTime={modalInitialTime}
        onTimeUpdate={(currentTime) => {
          if (selectedLightboxPost) {
            videoTimesRef.current[selectedLightboxPost.id] = currentTime;
          }
        }}
        onClose={handleCloseLightbox}
        onLike={(postId) => handleLikePost(postId)}
        onAddComment={async (postId, text) => {
          await addComment(postId, text);
        }}
        onLikeComment={(postId, commentId) => {
          likeComment(postId, commentId);
        }}
        onAddReply={async (postId, commentId, replyText) => {
          await addReply(postId, commentId, replyText);
        }}
        onEditComment={async (postId, commentId, text) => {
          await editComment(postId, commentId, text);
        }}
        onDeleteComment={async (postId, commentId) => {
          await deleteComment(postId, commentId);
        }}
        myName={myName}
        isLikedByMe={selectedLightboxPost ? selectedLightboxPost.likes.includes(myName) : false}
        isAuthed={isAuthed}
        hasPrev={Boolean(selectedLightboxPost && prioritizedPosts.findIndex(p => p.id === selectedLightboxPost.id) > 0)}
        hasNext={Boolean(selectedLightboxPost && prioritizedPosts.findIndex(p => p.id === selectedLightboxPost.id) < prioritizedPosts.length - 1)}
        onPrevPost={() => {
          if (!selectedLightboxPost) return;
          const idx = prioritizedPosts.findIndex(p => p.id === selectedLightboxPost.id);
          if (idx > 0) handleOpenLightbox(prioritizedPosts[idx - 1]);
        }}
        onNextPost={() => {
          if (!selectedLightboxPost) return;
          const idx = prioritizedPosts.findIndex(p => p.id === selectedLightboxPost.id);
          if (idx >= 0 && idx < prioritizedPosts.length - 1) handleOpenLightbox(prioritizedPosts[idx + 1]);
        }}
      />

      {/* Share Modal (WhatsApp, Facebook, Instagram, Copy Link) */}
      <ShareMenuModal
        postId={sharePostId || ''}
        postContent={sharePostContent}
        isOpen={Boolean(sharePostId)}
        onClose={() => setSharePostId(null)}
      />
    </PublicLayout>
  );
};

export default Index;
