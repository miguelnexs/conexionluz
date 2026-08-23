import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { api } from '../api/client';
import { CustomVideoPlayer } from '../components/ui/CustomVideoPlayer';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import {
  Sun,
  Sprout,
  Send,
  ArrowLeft,
  Share2,
  Check,
  Sparkles,
  MessageCircle,
  Clock,
  User,
  Trash2
} from 'lucide-react';

interface Comment {
  id: string;
  patientId?: number | null;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
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
  viewsCount?: number;
  comments: Comment[];
  createdAt: string;
}

const FEELINGS_LIST = [
  { emoji: '🌱', label: 'En calma', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { emoji: '⚡', label: 'Con energía', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { emoji: '🌪️', label: 'Abrumado/a', color: 'bg-rose-50 text-rose-700 border-rose-100' },
  { emoji: '✨', label: 'Inspirado/a', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  { emoji: '💤', label: 'Cansado/a', color: 'bg-slate-50 text-slate-700 border-slate-100' },
];

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

const formatTimeAgo = (iso: string) => {
  if (!iso) return 'Hace un momento';
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return 'Ahora';
  if (diff < 60) return `Hace ${diff} min`;
  const h = Math.floor(diff / 60);
  if (h < 24) return `Hace ${h} h`;
  return `Hace ${Math.floor(h / 24)} d`;
};

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('conexionluz:token') : null;
  const isAuthed = Boolean(token);

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [me, setMe] = useState<any | null>(null);

  const myName = me ? `${me.firstName || ''} ${me.lastName || ''}`.trim() : '';

  useEffect(() => {
    if (!isAuthed) return;
    api.get<any>('/api/portal/me/').then((res) => {
      if (res.ok) setMe(res.data);
    });
  }, [isAuthed]);

  const fetchPost = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Try fetching from portal or public endpoint
      const endpoint = isAuthed ? `/api/portal/community-posts/${id}/` : `/api/public/community-posts/${id}/`;
      let res = await api.get<any>(endpoint);
      if (!res.ok && isAuthed) {
        res = await api.get<any>(`/api/public/community-posts/${id}/`);
      }

      if (res.ok && res.data) {
        const p = res.data;
        const mapped: Post = {
          id: String(p.id),
          patientId: p.patientId || null,
          authorName: p.authorName || 'Miembro',
          authorAvatar: p.authorAvatarUrl || p.authorAvatar || undefined,
          authorRole: p.authorRole || 'Miembro',
          content: p.content || '',
          feeling: p.feeling || undefined,
          image: p.imageUrl || undefined,
          likes: p.likedByMe ? [myName || 'Usuario'] : [],
          viewsCount: typeof p.viewsCount === 'number' ? p.viewsCount : (p.views_count || 0),
          comments: p.comments ? p.comments.map((c: any) => ({
            id: String(c.id),
            patientId: c.patientId || null,
            authorName: c.authorName || 'Miembro',
            authorAvatar: c.authorAvatarUrl || c.authorAvatar || undefined,
            authorRole: c.authorRole || 'Miembro',
            content: c.content || '',
            createdAt: c.createdAt ? formatTimeAgo(c.createdAt) : 'Hace un momento'
          })) : [],
          createdAt: p.createdAt ? formatTimeAgo(p.createdAt) : 'Hace un momento'
        };
        setPost(mapped);
      } else {
        // Fallback: check localStorage cached posts
        const cached = localStorage.getItem('conexionluz:feed_posts');
        if (cached) {
          const parsed: Post[] = JSON.parse(cached);
          const found = parsed.find(item => String(item.id) === String(id));
          if (found) {
            setPost(found);
          } else {
            setError('Publicación no encontrada.');
          }
        } else {
          setError('Publicación no encontrada.');
        }
      }
    } catch (err) {
      setError('Error al cargar la publicación.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPost();
  }, [id, isAuthed]);

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/#/publicacion/${id}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    toast({
      title: '¡Enlace copiado!',
      description: 'El enlace directo a la publicación se guardó en tu portapapeles.'
    });
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleLike = async () => {
    if (!post) return;
    if (!isAuthed) {
      navigate('/login');
      return;
    }
    const isLiked = post.likes.includes(myName);
    const updatedLikes = isLiked
      ? post.likes.filter(name => name !== myName)
      : [...post.likes, myName];

    setPost({ ...post, likes: updatedLikes });
    await api.post(`/api/portal/community-posts/${post.id}/like/`, {});
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !commentText.trim() || submittingComment) return;
    if (!isAuthed) {
      navigate('/login');
      return;
    }

    setSubmittingComment(true);
    try {
      const res = await api.post<any>(`/api/portal/community-posts/${post.id}/comment/`, {
        content: commentText.trim()
      });
      if (res.ok) {
        setCommentText('');
        await fetchPost();
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout contentClassName="p-0">
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          <p className="text-sm font-bold text-slate-500">Cargando publicación...</p>
        </div>
      </PublicLayout>
    );
  }

  if (error || !post) {
    return (
      <PublicLayout contentClassName="p-0">
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="max-w-md space-y-4 bg-white border border-slate-200 p-8 rounded-3xl shadow-lg">
            <div className="text-xl font-black text-rose-600">Publicación no disponible</div>
            <p className="text-sm text-slate-600">{error || 'La publicación no existe o fue eliminada.'}</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm">
              <ArrowLeft className="h-4 w-4" /> Volver al Inicio
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const feelingObj = post.feeling ? FEELINGS_LIST.find(f => f.label === post.feeling) : null;
  const isLikedByMe = post.likes.includes(myName);

  return (
    <PublicLayout contentClassName="p-0">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-6">
        
        {/* Top Action Bar */}
        <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer border border-slate-200/80"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 font-bold text-xs transition-all cursor-pointer shadow-sm"
              title="Copiar enlace permanente"
            >
              {copiedLink ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4 text-emerald-600" />}
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
            </button>
          </div>
        </div>

        {/* Main Post Card (Large Standalone View) */}
        <article className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden animate-in fade-in duration-300">
          
          {/* Post Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-emerald-50/30">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl overflow-hidden shrink-0 border border-slate-200 shadow-md bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-lg">
                {post.authorAvatar ? (
                  <img src={post.authorAvatar} alt={post.authorName} className="h-full w-full object-cover" />
                ) : (
                  post.authorName?.[0] || 'M'
                )}
              </div>
              <div>
                <h1 className="font-black text-slate-900 text-base md:text-lg">{post.authorName}</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                    {post.authorRole}
                  </span>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs text-slate-400 font-medium">{formatTimeAgo(post.createdAt)}</span>
                </div>
              </div>
            </div>

            {feelingObj && (
              <span className={cn('text-xs font-black px-3.5 py-1.5 rounded-full border shadow-sm flex items-center gap-1.5', feelingObj.color)}>
                <span>{feelingObj.emoji}</span>
                <span>{feelingObj.label}</span>
              </span>
            )}
          </div>

          {/* Post Content */}
          <div className="p-6 md:p-8 space-y-6">
            {post.content && (
              <p className="text-slate-800 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-medium text-justify [text-justify:inter-word] [text-align-last:left]">
                {post.content}
              </p>
            )}

            {/* Media Player / Image */}
            {post.image && (
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 w-full max-h-[640px] shadow-2xl">
                {isVideoMedia(post.image) ? (
                  <CustomVideoPlayer
                    src={post.image}
                    className="w-full"
                    viewsCount={post.viewsCount || 0}
                    onPlay={() => {
                      if (post?.id && !isNaN(Number(post.id))) {
                        api.post(`/api/public/community-posts/${post.id}/view/`, {});
                      }
                    }}
                  />
                ) : (
                  <img src={post.image} alt="Publicación" className="w-full h-full object-contain mx-auto max-h-[640px]" />
                )}
              </div>
            )}
          </div>

          {/* Actions & Resonances Section */}
          <div className="bg-slate-50/60 p-6 border-t border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleLike}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm',
                  isLikedByMe
                    ? 'text-amber-600 bg-amber-50 border border-amber-200'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                )}
              >
                <Sun className={cn('h-5 w-5', isLikedByMe && 'fill-amber-500 text-amber-500 animate-spin-slow')} />
                <span>Iluminar ({post.likes.length})</span>
              </button>

              <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                <MessageCircle className="h-5 w-5 text-emerald-600" />
                <span>{post.comments.length} resonancias</span>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4 pt-4 border-t border-slate-200/80">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Sprout className="h-4 w-4 text-emerald-600" /> Resonancias de la comunidad
              </h3>

              {isAuthed ? (
                <form onSubmit={handleAddComment} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Sembrar una resonancia..."
                    className="flex-1 text-sm text-slate-800 placeholder-slate-400 bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-xs"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim() || submittingComment}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-md cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <Send className="h-4 w-4" />
                    <span>Resonar</span>
                  </button>
                </form>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                  <p className="text-xs text-slate-500 font-bold">
                    Inicia sesión para dejar tu resonancia en esta publicación.
                  </p>
                  <Link to="/login" className="mt-2 inline-block text-xs font-black text-emerald-600 hover:underline">
                    Iniciar Sesión →
                  </Link>
                </div>
              )}

              {post.comments && post.comments.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                            {comment.authorAvatar ? (
                              <img src={comment.authorAvatar} alt={comment.authorName} className="h-full w-full object-cover" />
                            ) : (
                              comment.authorName?.[0] || 'C'
                            )}
                          </div>
                          <span className="font-bold text-xs text-slate-900">{comment.authorName}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{comment.createdAt}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium pl-9">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-white border border-dashed border-slate-200 text-center text-slate-400 text-xs font-medium">
                  Aún no hay resonancias en esta publicación. ¡Sé el primero en aportar luz! 🌿
                </div>
              )}
            </div>
          </div>
        </article>

      </div>
    </PublicLayout>
  );
}
