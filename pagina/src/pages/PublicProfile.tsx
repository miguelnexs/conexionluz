import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { api } from '../api/client';
import { cn } from '@/lib/utils';
import {
  Sun,
  Wind,
  Send,
  ArrowLeft,
  Calendar,
  Sparkles,
  Heart,
  MessageCircle,
  Pencil,
  Trash2,
  HeartHandshake,
  Activity,
  Camera,
  BookOpen,
  Lock,
  PlayCircle,
  Settings,
  LogOut,
  User,
  ChevronRight,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sliders,
  Move
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
  image?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  isSystemPost?: boolean;
}

const FEELINGS_LIST = [
  { emoji: '🌱', label: 'En calma', color: 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)] hover:border-emerald-300' },
  { emoji: '⚡', label: 'Con energía', color: 'bg-amber-50 text-amber-700 border-amber-100 shadow-[0_0_15px_-3px_rgba(245,158,11,0.15)] hover:border-amber-355 hover:border-amber-300' },
  { emoji: '🌪️', label: 'Abrumado/a', color: 'bg-rose-50 text-rose-700 border-rose-100 shadow-[0_0_15px_-3px_rgba(244,63,94,0.15)] hover:border-rose-300' },
  { emoji: '✨', label: 'Inspirado/a', color: 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-[0_0_15px_-3px_rgba(99,102,241,0.15)] hover:border-indigo-300' },
  { emoji: '💤', label: 'Cansado/a', color: 'bg-slate-50 text-slate-700 border-slate-100 shadow-[0_0_15px_-3px_rgba(71,85,105,0.12)] hover:border-slate-300' },
];

const getPurchaseKey = (slug: string) => `conexionluz:purchased:${slug}`;

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

const DailyCheckinCard = ({ onComplete }: { onComplete: (level: string) => void }) => {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSelect = async (level: string) => {
    setSaving(true);
    const res = await api.post('/api/portal/daily-checkin/', { energyLevel: level });
    if (res.ok) {
      if (level === 'tired') setMessage('Está bien sentirse así. Tu cuerpo pide descanso, escúchalo hoy. 💙');
      else if (level === 'low') setMessage('Respira profundo. Recuerda que todo pasa y esto también pasará. Te abrazamos. 🌟');
      else if (level === 'good') setMessage('¡Qué alegría! Mantén esa bonita energía durante todo tu día. ✨');
      else if (level === 'high') setMessage('¡Estás radiante! Aprovecha este impulso para avanzar en tus sueños. 🔥');
      
      setTimeout(() => {
        onComplete(level);
      }, 4000);
    }
    setSaving(false);
  };

  if (message) {
    return (
      <div className="mb-8 rounded-2xl sm:rounded-[2.5rem] bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 p-6 sm:p-8 md:p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 flex items-center justify-center text-center">
        <p className="text-lg sm:text-xl font-bold text-gray-800 animate-pulse">{message}</p>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-2xl sm:rounded-[2.5rem] bg-white border border-gray-100 p-6 sm:p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Activity className="w-32 h-32 text-primary" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Tu Termómetro Emocional</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">¿Cómo está tu energía hoy?</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { id: 'high', label: 'Radiante', emoji: '⚡', color: 'from-amber-400 to-orange-500', glow: 'rgba(245, 158, 11, 0.4)' },
            { id: 'good', label: 'Bien', emoji: '🌤️', color: 'from-emerald-400 to-teal-500', glow: 'rgba(52, 211, 153, 0.4)' },
            { id: 'tired', label: 'Agotado/a', emoji: '☁️', color: 'from-blue-400 to-indigo-500', glow: 'rgba(96, 165, 250, 0.4)' },
            { id: 'low', label: 'Difícil', emoji: '🌧️', color: 'from-slate-400 to-gray-500', glow: 'rgba(148, 163, 184, 0.4)' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => void handleSelect(opt.id)}
              disabled={saving}
              className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 flex flex-col items-center justify-center gap-2"
              style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 25px ${opt.glow}`;
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#f3f4f6';
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br transition-opacity duration-300 pointer-events-none" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
              <span className="text-3xl sm:text-4xl mb-1 group-hover:scale-110 transition-transform duration-300">{opt.emoji}</span>
              <span className="text-sm font-bold text-gray-700">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const PublicProfile = () => {
  const { name: rawName } = useParams<{ name: string }>();
  const name = decodeURIComponent(rawName || '');
  const navigate = useNavigate();

  const token = typeof window !== 'undefined' ? localStorage.getItem('conexionluz:token') : null;
  const isAuthed = Boolean(token);

  // States
  const [me, setMe] = useState<any | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  
  // Custom Profile Settings State (Cover only)
  const [profileSettings, setProfileSettings] = useState<{
    cover?: string;
    coverY?: number;
    avatarY?: number;
  }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`conexionluz:profile_settings:${name}`);
      return saved ? JSON.parse(saved) : { coverY: 50, avatarY: 50 };
    }
    return { coverY: 50, avatarY: 50 };
  });

  const [editingCoverPosition, setEditingCoverPosition] = useState(false);
  const [editingAvatarPosition, setEditingAvatarPosition] = useState(false);

  const coverY = profileSettings.coverY ?? 50;
  const avatarY = profileSettings.avatarY ?? 50;

  // Edit/Delete States
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingPostContent, setEditingPostContent] = useState('');
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<'posts' | 'wellbeing' | 'courses' | 'settings'>('posts');

  // Personal Wellbeing / Settings Tab States
  const [dailyCheckin, setDailyCheckin] = useState<{hasCheckedIn: boolean, energyLevel: string|null}>({hasCheckedIn: true, energyLevel: null});
  const [profileForm, setProfileForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', birthDate: '', gender: '',
    occupation: '', city: '', address: '', emergencyContactName: '', emergencyContactPhone: '',
    userType: 'miembro'
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  // Followers / Following States
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loadingFollow, setLoadingFollow] = useState(false);

  // Load user details & checkin status
  useEffect(() => {
    if (isAuthed) {
      api.get('/api/portal/me/').then(res => {
        if (res.ok) {
          setMe(res.data);
          setProfileForm({
            firstName: res.data.firstName || '',
            lastName: res.data.lastName || '',
            email: res.data.email || '',
            phone: res.data.phone || '',
            birthDate: res.data.birthDate || '',
            gender: res.data.gender || '',
            occupation: res.data.occupation || '',
            city: res.data.city || '',
            address: res.data.address || '',
            emergencyContactName: res.data.emergencyContactName || '',
            emergencyContactPhone: res.data.emergencyContactPhone || '',
            userType: res.data.userType || 'miembro'
          });
        }
      });
      // Load daily checkin status
      api.get<{hasCheckedIn: boolean, energyLevel: string|null}>('/api/portal/daily-checkin/').then(res => {
        if (res.ok) setDailyCheckin(res.data);
      });
    }
  }, [isAuthed]);

  // Load follow status and follower/following counts
  useEffect(() => {
    if (isAuthed && name) {
      api.get<any>(`/api/portal/follow/patient/status/?name=${encodeURIComponent(name)}`).then(res => {
        if (res.ok) {
          setIsFollowing(res.data.isFollowing);
          setFollowersCount(res.data.followersCount);
          setFollowingCount(res.data.followingCount);
        }
      });
    }
  }, [isAuthed, name]);

  const handleFollowToggle = async () => {
    if (!isAuthed) {
      navigate('/login');
      return;
    }
    setLoadingFollow(true);
    const res = await api.post<any>('/api/portal/follow/patient/toggle/', { name });
    if (res.ok) {
      setIsFollowing(res.data.isFollowing);
      setFollowersCount(res.data.followersCount);
      setFollowingCount(res.data.followingCount);
    } else {
      alert(res.error || 'Error al procesar la solicitud.');
    }
    setLoadingFollow(false);
  };

  // Load posts
  useEffect(() => {
    const saved = localStorage.getItem('conexionluz:feed_posts');
    if (saved) {
      try {
        setAllPosts(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const savePosts = (updatedPosts: Post[]) => {
    setAllPosts(updatedPosts);
    localStorage.setItem('conexionluz:feed_posts', JSON.stringify(updatedPosts));
  };

  const saveProfileSettings = (settings: typeof profileSettings) => {
    try {
      setProfileSettings(settings);
      localStorage.setItem(`conexionluz:profile_settings:${name}`, JSON.stringify(settings));
    } catch (e) {
      console.error("Error saving profile settings:", e);
      alert("No se pudo guardar la imagen de portada. Es posible que el archivo sea demasiado grande o que el almacenamiento de tu navegador esté lleno.");
    }
  };

  // Filter posts for this specific user
  const userPosts = allPosts.filter(post => post.authorName === name);

  // Find user's avatar from their latest post, or use current user picture if it is them
  const meFullName = me ? `${me.firstName || ''} ${me.lastName || ''}`.trim().toLowerCase() : '';
  const urlName = name.trim().toLowerCase();
  // isMe: exact match OR the URL name is contained in me's full name (handles middle-name differences)
  const isMe = me != null && (meFullName === urlName || meFullName.includes(urlName) || urlName.includes(meFullName));
  const latestPostWithAvatar = userPosts.find(post => post.authorAvatar);
  const userAvatar = isMe ? (me.profilePictureUrl || '') : (latestPostWithAvatar?.authorAvatar || '');
  
  // Determine role: always use live API data for current user; fall back to cached post role for others
  const resolveRole = (userData: any, isPremium: boolean) => {
    if (userData?.occupation?.trim()) {
      const occ = userData.occupation.trim();
      return occ.charAt(0).toUpperCase() + occ.slice(1);
    }
    if (userData?.userType) {
      const ut = userData.userType.toLowerCase();
      if (ut === 'paciente') return 'Paciente';
      if (ut === 'miembro') return isPremium ? 'Miembro Premium ✨' : 'Miembro';
      // custom type (e.g. "terapeuta")
      return userData.userType.charAt(0).toUpperCase() + userData.userType.slice(1);
    }
    return isPremium ? 'Miembro Premium ✨' : 'Miembro';
  };

  const userRole = isMe && me
    ? resolveRole(me, Boolean(me.hasActiveSubscription))
    : (userPosts[0]?.authorRole || 'Miembro de la Comunidad');


  // Stats
  const postsCount = userPosts.length;
  const likesCount = userPosts.reduce((sum, post) => sum + post.likes.length, 0);
  const commentsCount = userPosts.reduce((sum, post) => sum + post.comments.length, 0);

  // Bio and cover styling based on role
  const isTherapist = userRole.includes('Terapeuta') || userRole.includes('Psicó') || userRole.includes('Psiqui');
  
  const coverGradient = isTherapist
    ? 'from-teal-400 via-primary/30 to-accent/40'
    : 'from-indigo-400 via-primary/20 to-amber-300/40';

  const defaultBio = isTherapist
    ? `Guía de Luz y profesional especializado(a) en salud mental, comprometido(a) con brindar herramientas terapéuticas, meditación y acompañamiento compasivo para restaurar el bienestar integral.`
    : `Sembrador(a) en la comunidad Conexión Luz, compartiendo reflexiones, aprendizajes y destellos de bienestar para caminar juntos hacia la sanación.`;

  // Like handler
  const handleLikePost = (postId: string) => {
    if (!isAuthed) {
      navigate('/login');
      return;
    }
    const myName = me ? `${me.firstName} ${me.lastName}` : '';
    const updated = allPosts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(myName);
        const newLikes = isLiked
          ? post.likes.filter(name => name !== myName)
          : [...post.likes, myName];
        return { ...post, likes: newLikes };
      }
      return post;
    });
    savePosts(updated);
  };

  // Comment handler
  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthed) {
      navigate('/login');
      return;
    }
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

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

    const updated = allPosts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    });
    savePosts(updated);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // Edit post handler
  const handleEditPostSubmit = (postId: string) => {
    const post = allPosts.find(p => p.id === postId);
    if (!editingPostContent.trim() && !post?.image) return;
    const updated = allPosts.map(p => {
      if (p.id === postId) {
        return { ...p, content: editingPostContent.trim() };
      }
      return p;
    });
    savePosts(updated);
    setEditingPostId(null);
    setEditingPostContent('');
  };

  // Delete post handler
  const handleDeletePostSubmit = (postId: string) => {
    const updated = allPosts.filter(post => post.id !== postId);
    savePosts(updated);
    setDeletingPostId(null);
  };

  // Edit comment handler
  const handleEditCommentSubmit = (postId: string, commentId: string) => {
    if (!editingCommentContent.trim()) return;
    const updated = allPosts.map(post => {
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
    const updated = allPosts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.filter(c => c.id !== commentId);
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    savePosts(updated);
    setDeletingCommentId(null);
  };

  // Upload Profile Picture handler
  const handleUploadPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingPicture(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/portal/me/picture/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.ok && me) {
        setMe({ ...me, profilePictureUrl: data.data.profilePictureUrl });
      } else {
        alert(data.error || 'Error uploading picture');
      }
    } catch (err) {
      alert('Error uploading picture');
    } finally {
      setUploadingPicture(false);
    }
  };

  // Save Settings handler
  const saveProfile = async () => {
    setSavingProfile(true);
    const res = await api.patch<any>('/api/portal/me/', profileForm);
    if (res.ok) { 
      setMe(res.data);
      // Update local storage posts written by this user
      const saved = localStorage.getItem('conexionluz:feed_posts');
      if (saved) {
        try {
          const posts = JSON.parse(saved);
          const userName = `${res.data.firstName} ${res.data.lastName}`;
          const newRole = res.data.occupation?.trim()
            ? (res.data.occupation.trim().charAt(0).toUpperCase() + res.data.occupation.trim().slice(1))
            : (res.data.userType
              ? (['miembro', 'paciente'].includes(res.data.userType.toLowerCase())
                ? (res.data.userType.toLowerCase() === 'paciente' ? 'Paciente' : (res.data.hasActiveSubscription ? 'Miembro Premium' : 'Miembro'))
                : (res.data.userType.charAt(0).toUpperCase() + res.data.userType.slice(1)))
              : 'Miembro');
          const newAvatar = res.data.profilePictureUrl || '';
          const updated = posts.map((post: any) => {
            if (post.authorName === userName) {
              return { ...post, authorRole: newRole, authorAvatar: newAvatar };
            }
            return post;
          });
          localStorage.setItem('conexionluz:feed_posts', JSON.stringify(updated));
          setAllPosts(updated); // Sync local state too!
        } catch (e) {
          console.error(e);
        }
      }
      alert('Información guardada exitosamente.');
    } else {
      alert(res.error || 'Error al guardar la información.');
    }
    setSavingProfile(false);
  };

  const getMoodColor = (mood: string | undefined) => {
    if (!mood) return 'border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]';
    const match = FEELINGS_LIST.find(f => f.label === mood);
    return match ? match.color : 'border-slate-100';
  };

  const myName = me ? `${me.firstName} ${me.lastName}` : 'Miembro Invitado';
  const userInitials = name ? `${name.split(' ')[0]?.[0] || ''}${name.split(' ')[1]?.[0] || ''}`.toUpperCase() : 'M';
  const myInitials = me ? `${me.firstName?.[0] || ''}${me.lastName?.[0] || ''}`.toUpperCase() : 'M';

  // Custom styling applications
  const coverStyle: React.CSSProperties = profileSettings.cover
    ? profileSettings.cover.startsWith('data:image') || profileSettings.cover.startsWith('http')
      ? { backgroundImage: `url(${profileSettings.cover})`, backgroundSize: 'cover', backgroundPosition: `center ${coverY}%` }
      : { background: profileSettings.cover }
    : {};

  const hasHipnosis = localStorage.getItem(getPurchaseKey('hipnosis-interdimencional')) === '1';

  return (
    <PublicLayout contentClassName="p-0">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        {/* Back navigation button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>

        {/* ══════════════════════════════════════════════════════════
            PROFILE HEADER CARD (Facebook Style)
        ══════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden mb-8 relative">
          
          {/* Cover gradient / image (uploaded to this banner box) */}
          <div className={cn("h-48 md:h-64 bg-gradient-to-br relative transition-all duration-300", !profileSettings.cover && coverGradient)} style={coverStyle}>
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-4 right-4 bg-white/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-800 border border-white/20">
              Conexión Luz
            </div>

            {isMe && (
              <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                <input
                  type="file"
                  id="cover-upload-input"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      console.log("Cover image file selected:", file.name, "size:", file.size);
                      try {
                        const compressed = await compressImage(file);
                        console.log("Cover image compressed successfully. Base64 length:", compressed.length);
                        saveProfileSettings({ ...profileSettings, cover: compressed });
                      } catch (err) {
                        console.error("Error setting cover image:", err);
                        alert("Error al procesar la imagen de portada: " + (err instanceof Error ? err.message : String(err)));
                      }
                    }
                    e.target.value = '';
                  }}
                />
                
                {profileSettings.cover && (
                  <button
                    type="button"
                    onClick={() => setEditingCoverPosition(!editingCoverPosition)}
                    className="bg-white/80 hover:bg-white text-slate-700 font-bold text-xs py-1.5 px-3 rounded-xl shadow-md backdrop-blur-sm transition-all flex items-center gap-1.5"
                  >
                    <Move className="h-3.5 w-3.5" />
                    <span>Ajustar Posición</span>
                  </button>
                )}

                <label
                  htmlFor="cover-upload-input"
                  className="bg-white/80 hover:bg-white text-slate-700 font-bold text-xs py-1.5 px-3 rounded-xl shadow-md backdrop-blur-sm transition-all flex items-center gap-1.5 cursor-pointer animate-in fade-in duration-300"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>Subir Portada</span>
                </label>

                {editingCoverPosition && (
                  <div className="absolute bottom-12 right-0 bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-4 flex flex-col gap-3 w-64 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                        <Sliders className="h-3.5 w-3.5 text-primary" /> Posición Portada
                      </span>
                      <span className="text-xs font-bold text-slate-500">{coverY}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={coverY}
                      onChange={(e) => {
                        saveProfileSettings({ ...profileSettings, coverY: parseInt(e.target.value) });
                      }}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingCoverPosition(false)}
                        className="bg-primary text-white font-bold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg shadow-sm hover:bg-primary/95 transition-all"
                      >
                        Aceptar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile details section */}
          <div className="px-6 md:px-12 pb-8 pt-0 relative flex flex-col md:flex-row md:items-end gap-6 -mt-12 md:-mt-16 z-10">
            
            {/* User Avatar with Hover Upload for Owner */}
            <div className="relative shrink-0 group">
              <div className="h-36 w-36 md:h-44 md:w-44 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-slate-50 relative">
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt={name} 
                    className="h-full w-full object-cover" 
                    style={{ objectPosition: `center ${avatarY}%` }}
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-650 text-4xl">
                    {userInitials}
                  </div>
                )}
                {isMe && (
                  <label
                    htmlFor="avatar-upload-input"
                    className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 animate-in fade-in duration-150 cursor-pointer"
                  >
                    <Camera className="h-6 w-6 mb-1" />
                    <span className="text-[10px] font-bold">Cambiar Foto</span>
                  </label>
                )}
              </div>
              
              {isMe && (
                <>
                  <input
                    type="file"
                    id="avatar-upload-input"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadPicture}
                    disabled={uploadingPicture}
                  />

                  {userAvatar && (
                    <button
                      type="button"
                      onClick={() => setEditingAvatarPosition(!editingAvatarPosition)}
                      className="absolute bottom-0 right-11 h-10 w-10 bg-white hover:bg-slate-50 text-slate-700 rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-20 cursor-pointer"
                      title="Ajustar posición de foto de perfil"
                    >
                      <Move className="h-5 w-5 text-slate-650" />
                    </button>
                  )}

                  <label
                    htmlFor="avatar-upload-input"
                    className="absolute bottom-0 right-0 h-10 w-10 bg-white hover:bg-slate-50 text-slate-700 rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-20 cursor-pointer"
                    title="Cambiar Foto de Perfil"
                  >
                    <Camera className="h-5 w-5 text-slate-600" />
                  </label>

                  {editingAvatarPosition && (
                    <div className="absolute top-12 left-0 bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-4 flex flex-col gap-3 w-64 z-30 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                          <Sliders className="h-3.5 w-3.5 text-primary" /> Posición Avatar
                        </span>
                        <span className="text-xs font-bold text-slate-500">{avatarY}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={avatarY}
                        onChange={(e) => {
                          saveProfileSettings({ ...profileSettings, avatarY: parseInt(e.target.value) });
                        }}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingAvatarPosition(false)}
                          className="bg-primary text-white font-bold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg shadow-sm hover:bg-primary/95 transition-all"
                        >
                          Aceptar
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-2 md:pb-3 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-2xl md:text-4.5xl font-black tracking-tight text-slate-800 leading-none">
                  {name}
                </h1>
                
                {/* Role Tag */}
                <span className={cn(
                  'text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider w-fit',
                  isTherapist
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                    : 'bg-slate-100 text-slate-500 border border-slate-200/50'
                )}>
                  {userRole}
                </span>

                {!isMe && (
                  <button
                    type="button"
                    onClick={handleFollowToggle}
                    disabled={loadingFollow}
                    className={cn(
                      "text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm transition-all duration-300 flex items-center gap-1 hover:scale-105 active:scale-95 disabled:opacity-50",
                      isFollowing
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-650 border border-slate-200"
                        : "bg-primary hover:bg-primary/95 text-white"
                    )}
                  >
                    {isFollowing ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Siguiendo</span>
                      </>
                    ) : (
                      <>
                        <User className="h-3 w-3" />
                        <span>Seguir</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Bio snippet */}
              <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
                {defaultBio}
              </p>
            </div>
          </div>

          {/* Stat counters bar */}
          <div className="grid grid-cols-3 sm:grid-cols-5 border-t border-slate-100 bg-slate-50/50 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="py-4 text-center">
              <span className="block text-xl md:text-2xl font-black text-slate-800">{postsCount}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destellos</span>
            </div>
            <div className="py-4 text-center">
              <span className="block text-xl md:text-2xl font-black text-slate-800">{followersCount}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Seguidores</span>
            </div>
            <div className="py-4 text-center">
              <span className="block text-xl md:text-2xl font-black text-slate-800">{followingCount}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Siguiendo</span>
            </div>
            <div className="py-4 text-center">
              <span className="block text-xl md:text-2xl font-black text-slate-800">{likesCount}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Iluminaciones</span>
            </div>
            <div className="py-4 text-center">
              <span className="block text-xl md:text-2xl font-black text-slate-800">{commentsCount}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resonancias</span>
            </div>
          </div>
        </div>

        {/* Tabs - Only for the profile owner */}
        {isMe && (
          <div className="flex w-full sm:w-fit items-center gap-1 p-1 bg-slate-100/50 backdrop-blur-md rounded-2xl mb-8 border border-slate-250/20">
            {[
              { id: 'posts', label: 'Mis Destellos', icon: Sparkles },
              { id: 'wellbeing', label: 'Mi Bienestar', icon: Activity },
              { id: 'courses', label: 'Mis Cursos', icon: BookOpen },
              { id: 'settings', label: 'Ajustes', icon: Settings },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={cn(
                  'flex flex-1 sm:flex-initial items-center justify-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300',
                  activeTab === t.id
                    ? 'bg-white shadow-md text-slate-800 scale-[1.02]'
                    : 'text-slate-500 hover:text-slate-800'
                )}
              >
                <t.icon className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', activeTab === t.id ? 'text-primary' : 'text-slate-400')} />
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            LAYOUT COLUMNS / TABS CONTENT
        ══════════════════════════════════════════════════════════ */}
        <div className="animate-in fade-in duration-300">
          
          {/* TAB 1: Posts (or Default viewing mode) */}
          {(!isMe || activeTab === 'posts') && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: About card */}
              <aside className="lg:col-span-4 space-y-6">
                
                {/* About card */}
                <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 space-y-5">
                  <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                    <HeartHandshake className="h-4.5 w-4.5 text-primary" />
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                      Presentación
                    </h3>
                  </div>

                  <div className="space-y-4 text-xs font-semibold text-slate-600">
                    <div className="flex items-start gap-3">
                      <Activity className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-slate-800 font-bold">Comunidad</span>
                        <span className="text-slate-400 font-medium">Miembro desde 2026</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-slate-800 font-bold">Estado</span>
                        <span className="text-slate-400 font-medium">{isTherapist ? 'Disponible para sesiones' : 'Activo(a) en el feed'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* RIGHT COLUMN: User Posts Feed */}
              <main className="lg:col-span-8 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4.5 w-4.5 text-primary" />
                  <h2 className="font-black text-slate-700 text-sm uppercase tracking-widest">
                    Destellos de {name.split(' ')[0]}
                  </h2>
                </div>

                {userPosts.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-12 text-center text-slate-400">
                    <Sun className="h-10 w-10 text-slate-300 mx-auto mb-3 animate-spin-slow" />
                    <p className="font-bold text-sm">Este usuario no ha sembrado ningún destello todavía.</p>
                    <p className="text-xs text-slate-400 mt-1">Los destellos de luz aparecerán aquí una vez publicados.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userPosts.map(post => {
                      const isLikedByMe = post.likes.includes(myName);
                      const isCommentsOpen = activeCommentsPostId === post.id;
                      const feelingData = FEELINGS_LIST.find(f => f.label === post.feeling);
                      const displayRole = isMe && me
                        ? resolveRole(me, Boolean(me.hasActiveSubscription))
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
                              <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-sm relative z-10">
                                {post.authorAvatar ? (
                                  <img src={post.authorAvatar} alt="Avatar" className="h-full w-full object-cover" />
                                ) : (
                                  <div className="h-full w-full bg-slate-50 flex items-center justify-center font-bold text-slate-655 text-xs font-bold text-slate-660 text-slate-600 text-xs">
                                    {post.authorName?.[0] || 'M'}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-slate-800 text-sm leading-tight">
                                    {post.authorName}
                                  </span>
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
                                  disabled={!editingPostContent.trim() && !post.image}
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
                                      <div className="h-7 w-7 rounded-lg overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center font-bold text-[9px] text-slate-550 bg-slate-50">
                                        {comment.authorAvatar ? (
                                          <img src={comment.authorAvatar} alt="Avatar" className="h-full w-full object-cover" />
                                        ) : (
                                          comment.authorName?.[0] || 'M'
                                        )}
                                      </div>
                                      <div className="flex-1 bg-slate-50/70 rounded-2xl px-3.5 py-2.5 border border-slate-150/40">
                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                          <div className="flex items-center gap-1.5 flex-wrap">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                              <span className="font-bold text-xs text-slate-800 leading-tight">
                                                {comment.authorName}
                                              </span>
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
                                                  className="text-slate-400 hover:text-primary p-0.5 hover:bg-slate-100 rounded transition-colors"
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
                                                  className="text-slate-400 hover:text-rose-500 p-0.5 hover:bg-slate-100 rounded transition-colors"
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
                                                className="bg-slate-100 hover:bg-slate-200 text-slate-655 text-slate-650 font-bold text-[8px] py-1 px-2.5 rounded-lg shadow-sm transition-all"
                                              >
                                                Cancelar
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <p className="text-slate-600 text-xs leading-relaxed mt-1 whitespace-pre-wrap">
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
                )}
              </main>
            </div>
          )}

          {/* TAB 2: Wellbeing (Mi Bienestar) */}
          {isMe && activeTab === 'wellbeing' && (
            <div className="max-w-4xl mx-auto space-y-8">
              {!dailyCheckin.hasCheckedIn && (
                <DailyCheckinCard onComplete={(level) => setDailyCheckin({ hasCheckedIn: true, energyLevel: level })} />
              )}
              {me?.intakeSummary ? (
                <div className="group relative rounded-[2.5rem] bg-white border border-slate-200/60 p-8 sm:p-12 shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="absolute top-8 right-8 h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-6">Tu resumen de bienestar</h3>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line italic">
                      "{me.intakeSummary}"
                    </p>
                  </div>
                  <div className="mt-10 flex flex-col sm:flex-row gap-4 pt-10 border-t border-slate-100">
                    <Link to="/agenda" className="w-full sm:w-auto text-center px-8 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:scale-105 transition-all text-sm">
                      Agendar sesión de apoyo
                    </Link>
                    <Link to="/mi-calendario" className="w-full sm:w-auto text-center px-8 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-gray-50 transition-all text-sm">
                      Ver mi calendario
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200/50 px-4">
                  <p className="text-slate-400 font-medium">Completa tu evaluación para ver tu resumen aquí.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Courses (Mis Cursos) */}
          {isMe && activeTab === 'courses' && (
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hasHipnosis ? (
                  <Link to="/cursos/hipnosis-interdimencional" className="group block">
                    <div className="h-full rounded-[2.5rem] bg-white border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                      <div className="aspect-[16/10] bg-slate-900 relative overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop"
                          alt="Hipnosis"
                          className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 block">Mis Cursos</span>
                          <h4 className="text-xl font-black text-white">Hipnosis Interdimencional</h4>
                        </div>
                      </div>
                      <div className="p-8">
                        <p className="text-slate-500 text-sm line-clamp-2 mb-6">Accede a las herramientas de reprogramación subconsciente.</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <PlayCircle className="h-4 w-4" />
                            Continuar viendo
                          </div>
                          <ChevronRight className="h-5 w-5 text-slate-350 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="md:col-span-3 text-center py-20 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm px-4">
                    <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-6 border border-slate-100">
                      <Lock className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">Aún no tienes cursos</h3>
                    <p className="text-slate-500 text-sm mb-10 max-w-md mx-auto">Explora nuestra biblioteca y empieza tu transformación hoy mismo.</p>
                    <Link to="/cursos" className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-primary text-white font-black shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-sm">
                      Explorar Biblioteca
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Settings (Ajustes) */}
          {isMe && activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Personal Information Form */}
              <div className="rounded-[2.5rem] bg-white border border-slate-200/60 p-8 sm:p-12 shadow-sm">
                <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                  <User className="h-6 w-6 text-primary" />
                  Información Personal
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nombre</label>
                      <input
                        value={profileForm.firstName}
                        onChange={e => setProfileForm(p => ({ ...p, firstName: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Apellidos</label>
                      <input
                        value={profileForm.lastName}
                        onChange={e => setProfileForm(p => ({ ...p, lastName: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Correo Electrónico</label>
                      <input
                        value={profileForm.email}
                        onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                        type="email"
                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Teléfono</label>
                      <input
                        value={profileForm.phone}
                        onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Fecha de Nacimiento</label>
                      <input
                        type="date"
                        value={profileForm.birthDate}
                        onChange={e => setProfileForm(p => ({ ...p, birthDate: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Género</label>
                      <select
                        value={profileForm.gender}
                        onChange={e => setProfileForm(p => ({ ...p, gender: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Otro">Otro</option>
                        <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Tipo de Usuario</label>
                      <select
                        value={profileForm.userType}
                        onChange={e => setProfileForm(p => ({ ...p, userType: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                      >
                        <option value="miembro">Miembro</option>
                        <option value="paciente">Paciente</option>
                        <option value="terapeuta">Terapeuta</option>
                        {profileForm.userType && !['miembro', 'paciente', 'terapeuta'].includes(profileForm.userType) && (
                          <option value={profileForm.userType}>
                            {profileForm.userType.charAt(0).toUpperCase() + profileForm.userType.slice(1)}
                          </option>
                        )}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Ciudad</label>
                      <input
                        value={profileForm.city}
                        onChange={e => setProfileForm(p => ({ ...p, city: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Ocupación</label>
                      <input
                        value={profileForm.occupation}
                        onChange={e => setProfileForm(p => ({ ...p, occupation: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Dirección Completa</label>
                      <input
                        value={profileForm.address}
                        onChange={e => setProfileForm(p => ({ ...p, address: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nombre Contacto de Emergencia</label>
                      <input
                        value={profileForm.emergencyContactName}
                        onChange={e => setProfileForm(p => ({ ...p, emergencyContactName: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Teléfono de Emergencia</label>
                      <input
                        value={profileForm.emergencyContactPhone}
                        onChange={e => setProfileForm(p => ({ ...p, emergencyContactPhone: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => void saveProfile()}
                    disabled={savingProfile}
                    className="w-full bg-slate-900 hover:bg-slate-850 text-white py-4 rounded-2xl font-black shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 mt-4 text-sm"
                  >
                    {savingProfile ? 'Guardando...' : 'Guardar Información Personal'}
                  </button>
                </div>
              </div>

              {/* Account Security Information details */}
              <div className="rounded-[2.5rem] bg-slate-50 border border-slate-200/60 p-8 sm:p-12">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Información de Cuenta</h3>
                <p className="text-slate-500 text-sm mb-6">Gestiona la seguridad y accesos de tu cuenta.</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      <span className="text-xs sm:text-sm font-bold text-slate-700">Email verificado: {me?.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-500 shrink-0" />
                      <span className="text-xs sm:text-sm font-bold text-slate-700">Última evaluación: {me?.intakeCompleted ? 'Completada' : 'Pendiente'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default PublicProfile;
