import { useEffect, useMemo, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { ExpandableText } from '@/components/ui/ExpandableText';
import { ArrowLeft, BookOpen, Calendar, Clock, ImageIcon, Tag, User, Heart, MessageCircle, Sparkles } from 'lucide-react';
import { api } from '../api/client';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { notifyLumiBalanceUpdated } from '@/utils/lumiPricing';

type StoryComment = {
  id: number;
  storyId: number;
  content: string;
  authorName: string;
  patientId: number | null;
  clientId?: string | null;
  parentId?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type Story = {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  author: string;
  category: string;
  tags: string[];
  patientId: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  likesCount?: number;
  commentsCount?: number;
  comments?: StoryComment[];
};

const StoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storyIdNum = story ? story.id : Number(id);

  const priceInfo = useMemo(() => {
    if (story) {
      const isFreeTag = story.tags?.some((t) => t.toLowerCase() === 'gratis');
      if (isFreeTag) return { isFree: true, lumis: 0, cop: 0 };
      const lumiTag = story.tags?.find((t) => t.startsWith('Lumis:'));
      if (lumiTag) {
        const val = parseInt(lumiTag.replace('Lumis:', '').trim(), 10);
        if (!isNaN(val) && val > 0) return { isFree: false, lumis: val, cop: val * 50 };
      }
    }
    const freeIds = [1, 3, 6];
    if (freeIds.includes(storyIdNum)) return { isFree: true, lumis: 0, cop: 0 };
    const priceMap: Record<number, number> = {
      2: 10,
      4: 20,
      5: 30,
      7: 45,
      8: 60,
      9: 80,
      10: 100,
    };
    const lumis = priceMap[storyIdNum] || 15;
    return { isFree: false, lumis, cop: lumis * 50 };
  }, [story, storyIdNum]);

  const isFreeStory = priceInfo.isFree;
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (isFreeStory) return true;
    if (typeof window === 'undefined') return false;
    return (
      localStorage.getItem(`conexionluz:unlocked_story:${storyIdNum}`) === '1' ||
      (id && localStorage.getItem(`conexionluz:unlocked_story:${id}`) === '1')
    );
  });

  useEffect(() => {
    if (isFreeStory) {
      setIsUnlocked(true);
    } else if (typeof window !== 'undefined' && story) {
      const unlocked =
        localStorage.getItem(`conexionluz:unlocked_story:${story.id}`) === '1' ||
        (id && localStorage.getItem(`conexionluz:unlocked_story:${id}`) === '1') ||
        (story.slug && localStorage.getItem(`conexionluz:unlocked_story:${story.slug}`) === '1');
      setIsUnlocked(Boolean(unlocked));
    }
  }, [isFreeStory, story, id]);

  const [isUnlocking, setIsUnlocking] = useState(false);
  const STORY_LUMI_PRICE = priceInfo.lumis;

  const handleUnlockStory = async () => {
    if (!isAuthed) {
      navigate('/login', { state: { from: `/historias/${id || storyIdNum}` } });
      return;
    }

    setIsUnlocking(true);
    try {
      const balRes = await api.get<{ balance: number }>('/api/portal/lumi/wallet/');
      const currentBal = balRes.ok && balRes.data && typeof balRes.data.balance === 'number' ? balRes.data.balance : 0;

      if (currentBal < STORY_LUMI_PRICE) {
        toast({
          title: "Saldo Insuficiente de Lumis",
          description: `Requieres ✨ ${STORY_LUMI_PRICE} Lumis ($${priceInfo.cop.toLocaleString('es-CO')} COP) para desbloquear esta historia. Tu saldo actual es ✨ ${currentBal} Lumis.`,
          variant: "destructive"
        });
        setIsUnlocking(false);
        return;
      }

      const spendRes = await api.post<{ balance?: number }>('/api/portal/lumi/spend/', {
        itemType: 'story',
        itemId: `story-${story?.id || storyIdNum}`,
        lumiAmount: STORY_LUMI_PRICE,
        description: `Desbloqueo de historia: ${story?.title || 'Experiencia'}`
      });

      if (!spendRes.ok) {
        toast({
          title: "Error al procesar",
          description: (spendRes as any).error || "No se pudo realizar el descuento de Lumis.",
          variant: "destructive"
        });
        setIsUnlocking(false);
        return;
      }

      if (spendRes.data?.balance !== undefined) {
        notifyLumiBalanceUpdated(spendRes.data.balance);
      }

      if (story) localStorage.setItem(`conexionluz:unlocked_story:${story.id}`, '1');
      if (id) localStorage.setItem(`conexionluz:unlocked_story:${id}`, '1');
      setIsUnlocked(true);
      toast({
        title: "✨ Historia Desbloqueada",
        description: "¡Has desbloqueado este relato de sanación con éxito!",
      });
    } catch (err) {
      toast({
        title: "Error de red",
        description: "Intenta de nuevo en un momento.",
        variant: "destructive"
      });
    } finally {
      setIsUnlocking(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await api.get<Story>(`/api/public/stories/${id}/`);
      if (res.ok === false) {
        setError(res.error);
        setLoading(false);
        return;
      }
      setStory(res.data);
      setLoading(false);
    };
    void load();
  }, [id]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('conexionluz:token') : null;
  const isAuthed = Boolean(token);
  const [userType, setUserType] = useState<string | null>(null);
  const publishBlocked = false;
  
  const [patientName, setPatientName] = useState<string | null>(null);
  const [likedIds, setLikedIdsState] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem('conexionluz:likedStories');
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editingError, setEditingError] = useState<string | null>(null);
  const [savingComment, setSavingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<number | null>(null);

  const [replyingCommentId, setReplyingCommentId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [collapsedCommentIds, setCollapsedCommentIds] = useState<number[]>([]);

  const repliesByParentId = useMemo(() => {
    const map: Record<number, StoryComment[]> = {};
    story?.comments?.forEach((c) => {
      if (c.parentId) {
        if (!map[c.parentId]) map[c.parentId] = [];
        map[c.parentId].push(c);
      }
    });
    return map;
  }, [story?.comments]);

  const rootComments = useMemo(() => {
    return story?.comments?.filter((c) => !c.parentId) || [];
  }, [story?.comments]);

  const toggleReplies = (commentId: number) => {
    setCollapsedCommentIds((prev) =>
      prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId]
    );
  };

  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientId(localStorage.getItem('conexionluz:clientId'));
    }
  }, [story]);

  useEffect(() => {
    if (isAuthed) {
      api.get<any>('/api/portal/me/').then(res => {
        if (res.ok) {
          setPatientName(`${res.data.firstName} ${res.data.lastName}`.trim() || res.data.firstName);
          setPatientId(res.data.id);
          setUserType((res.data.userType || '').trim() || null);
        }
      });
    } else {
      setPatientName(null);
      setPatientId(null);
      setUserType(null);
    }
  }, [isAuthed]);

  const isLiked = story ? likedIds.includes(story.id) : false;

  const toggleLike = async () => {
    if (!story) return;
    if (!isAuthed) {
      navigate('/login', { state: { from: `/historias/${story.id}` } });
      return;
    }
    const nextLiked = !isLiked;

    setStory(prev => prev ? {
      ...prev,
      likesCount: (prev.likesCount || 0) + (nextLiked ? 1 : -1)
    } : null);

    const nextIds = nextLiked
      ? [...likedIds, story.id]
      : likedIds.filter(x => x !== story.id);
    setLikedIdsState(nextIds);
    localStorage.setItem('conexionluz:likedStories', JSON.stringify(Array.from(new Set(nextIds))));

    const res = nextLiked
      ? await api.post<{ storyId: number; likesCount: number; liked: boolean }>(`/api/public/stories/${story.id}/like/`, {})
      : await api.del<{ storyId: number; likesCount: number; liked: boolean }>(`/api/public/stories/${story.id}/like/`);

    if (res.ok) {
      setStory(prev => prev ? {
        ...prev,
        likesCount: res.data.likesCount
      } : null);
      const updatedIds = res.data.liked
        ? [...likedIds, story.id]
        : likedIds.filter(x => x !== story.id);
      setLikedIdsState(updatedIds);
      localStorage.setItem('conexionluz:likedStories', JSON.stringify(Array.from(new Set(updatedIds))));
    } else {
      setStory(prev => prev ? {
        ...prev,
        likesCount: (prev.likesCount || 0) + (nextLiked ? -1 : 1)
      } : null);
      const revertedIds = !nextLiked
        ? [...likedIds, story.id]
        : likedIds.filter(x => x !== story.id);
      setLikedIdsState(revertedIds);
      localStorage.setItem('conexionluz:likedStories', JSON.stringify(Array.from(new Set(revertedIds))));
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!story) return;
    if (!commentText.trim()) return;
    if (!isAuthed) {
      setCommentError('Inicia sesión para comentar.');
      return;
    }
    if (publishBlocked) {
      setCommentError('Tu cuenta no tiene permisos para publicar.');
      return;
    }

    setSubmittingComment(true);
    setCommentError(null);

    const res = await api.post<StoryComment>(`/api/public/stories/${story.id}/comment/`, {
      content: commentText.trim(),
    });

    if (res.ok === false) {
      setCommentError(res.error);
    } else {
      const newComment = res.data;
      setStory(prev => prev ? {
        ...prev,
        commentsCount: (prev.commentsCount || 0) + 1,
        comments: [...(prev.comments || []), newComment]
      } : null);
      setCommentText('');
    }
    setSubmittingComment(false);
  };

  const canModifyComment = (comment: StoryComment) => {
    if (comment.patientId !== null && comment.patientId !== undefined) {
      return isAuthed && comment.patientId === patientId;
    }
    return comment.clientId ? comment.clientId === clientId : false;
  };

  const isWithinEditWindow = (createdAtStr: string) => {
    const createdAt = new Date(createdAtStr).getTime();
    const now = new Date().getTime();
    const diffMs = now - createdAt;
    return diffMs < 30 * 60 * 1000;
  };

  const getEditTimeRemaining = (createdAtStr: string): string => {
    const createdAt = new Date(createdAtStr).getTime();
    const now = new Date().getTime();
    const diffMs = now - createdAt;
    const remainingMs = (30 * 60 * 1000) - diffMs;
    if (remainingMs <= 0) return 'Tiempo de edición expirado';
    const remainingMins = Math.ceil(remainingMs / (1000 * 60));
    return `Editar (quedan ${remainingMins} min)`;
  };

  const startEditing = (comment: StoryComment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
    setEditingError(null);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditContent('');
    setEditingError(null);
  };

  const saveEdit = async (commentId: number) => {
    if (!editContent.trim()) return;
    setSavingComment(true);
    setEditingError(null);
    const res = await api.patch<StoryComment>(`/api/public/stories/comments/${commentId}/`, {
      content: editContent.trim()
    });
    if (res.ok === false) {
      setEditingError(res.error);
    } else {
      setStory(prev => prev ? {
        ...prev,
        comments: prev.comments?.map(c => c.id === commentId ? res.data : c)
      } : null);
      setEditingCommentId(null);
      setEditContent('');
    }
    setSavingComment(false);
  };

  const executeDelete = async (commentId: number) => {
    setEditingError(null);
    const res = await api.del<{ ok: boolean }>(`/api/public/stories/comments/${commentId}/`);
    if (res.ok === false) {
      setEditingError(res.error);
    } else {
      setStory(prev => {
        if (!prev) return null;
        const removedComments = prev.comments?.filter(c => c.id === commentId || c.parentId === commentId) || [];
        const removedCount = removedComments.length;
        return {
          ...prev,
          commentsCount: Math.max(0, (prev.commentsCount || 0) - removedCount),
          comments: prev.comments?.filter(c => c.id !== commentId && c.parentId !== commentId)
        };
      });
      setDeletingCommentId(null);
    }
  };

  const submitReply = async (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    if (!story) return;
    if (!replyText.trim()) return;
    if (!isAuthed) {
      setCommentError('Inicia sesión para responder.');
      return;
    }
    if (publishBlocked) {
      setCommentError('Tu cuenta no tiene permisos para publicar.');
      return;
    }

    setSubmittingReply(true);
    setCommentError(null);

    const res = await api.post<StoryComment>(`/api/public/stories/${story.id}/comment/`, {
      content: replyText.trim(),
      parentId: parentId
    });

    if (res.ok === false) {
      setCommentError(res.error);
    } else {
      const newComment = res.data;
      setStory(prev => prev ? {
        ...prev,
        commentsCount: (prev.commentsCount || 0) + 1,
        comments: [...(prev.comments || []), newComment]
      } : null);
      setReplyText('');
      setReplyingCommentId(null);
    }
    setSubmittingReply(false);
  };

  const renderComment = (comment: StoryComment, isReply = false, rootCommentId: number) => {
    const initial = comment.authorName ? comment.authorName.charAt(0).toUpperCase() : '?';
    const isEditing = editingCommentId === comment.id;

    return (
      <div key={comment.id} className={cn(
        "flex gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm animate-fade-in",
        isReply && "bg-gray-50/50"
      )}>
        <div className={cn(
          "h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-base shrink-0",
          isReply && "h-8 w-8 text-sm rounded-lg"
        )}>
          {initial}
        </div>
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <span className="font-bold text-gray-800 text-sm truncate">{comment.authorName}</span>
            <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(comment.createdAt)}</span>
          </div>
          
          {isEditing ? (
            <div className="space-y-3 mt-1">
              {editingError && (
                <div className="p-2 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-medium">
                  {editingError}
                </div>
              )}
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 leading-relaxed"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => void saveEdit(comment.id)}
                  disabled={savingComment || !editContent.trim()}
                  className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/95 transition-colors disabled:opacity-50"
                >
                  {savingComment ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  onClick={cancelEditing}
                  disabled={savingComment}
                  className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <ExpandableText
                text={comment.content}
                maxLength={220}
                className="text-gray-700 text-sm leading-relaxed break-words"
              />
              
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-50 mt-2">
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                  <button
                    onClick={() => {
                      setReplyingCommentId(comment.id);
                      setReplyText(isReply ? `@${comment.authorName} ` : '');
                      setCommentError(null);
                    }}
                    disabled={!isAuthed || publishBlocked}
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Responder
                  </button>

                  {canModifyComment(comment) && (
                    <>
                      {isWithinEditWindow(comment.createdAt) ? (
                        <button
                          onClick={() => startEditing(comment)}
                          className="text-primary hover:text-primary/80 transition-colors font-medium"
                        >
                          {getEditTimeRemaining(comment.createdAt)}
                        </button>
                      ) : (
                        <span className="text-gray-400 cursor-not-allowed">
                          Tiempo de edición expirado
                        </span>
                      )}
                      <button
                        onClick={() => setDeletingCommentId(comment.id)}
                        className="text-rose-600 hover:text-rose-700 transition-colors font-medium"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
                
                {deletingCommentId === comment.id && (
                  <div className="flex flex-col gap-2 mt-2 p-3 bg-rose-50 rounded-xl border border-rose-100 text-xs animate-scale-in">
                    {editingError && (
                      <div className="p-2 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-medium w-full">
                        {editingError}
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <span className="text-rose-700 font-medium">¿Estás seguro de que deseas eliminar este comentario?</span>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => void executeDelete(comment.id)}
                          className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 transition-colors"
                        >
                          Sí, eliminar
                        </button>
                        <button
                          onClick={() => setDeletingCommentId(null)}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Reply Form (inline under the specific comment being replied to) */}
          {replyingCommentId === comment.id && (
            <form onSubmit={(e) => void submitReply(e, rootCommentId)} className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
              <h5 className="text-xs font-bold text-gray-700">Responder a {comment.authorName}</h5>
              {commentError && (
                <div className="p-2 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-medium">
                  {commentError}
                </div>
              )}
              <p className="text-[10px] font-bold text-gray-500">
                Respondiendo como <span className="text-primary">{patientName || 'Usuario Registrado'}</span>
              </p>
              <div className="space-y-1">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Escribe tu respuesta..."
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 leading-relaxed"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submittingReply || !replyText.trim() || publishBlocked}
                  className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/95 transition-colors disabled:opacity-50"
                >
                  {submittingReply ? 'Enviando...' : 'Enviar respuesta'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReplyingCommentId(null);
                    setReplyText('');
                    setCommentError(null);
                  }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

  // Loading
  if (loading) {
    return (
      <PublicLayout contentClassName="p-0">
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-6">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-72 rounded-2xl bg-gray-200 animate-pulse" />
          <div className="h-10 w-3/4 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${95 - i * 5}%` }} />
            ))}
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Error / Not found
  if (error || !story) {
    return (
      <PublicLayout contentClassName="p-0">
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-8 py-12">
          <button
            onClick={() => navigate('/historias')}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-10"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a historias
          </button>
          <div className="flex flex-col items-center justify-center py-20 rounded-3xl border border-gray-100 bg-gray-50">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <BookOpen className="h-7 w-7 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-1">Historia no encontrada</p>
            <p className="text-sm text-gray-500">{error || 'La historia que buscas no existe o fue eliminada.'}</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout contentClassName="p-0">
      {/* Hero image */}
      <div className="relative">
        {story.imageUrl ? (
          <div className="relative w-full h-64 md:h-96 overflow-hidden">
            <img
              src={story.imageUrl}
              alt={story.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="max-w-6xl xl:max-w-7xl mx-auto">
                {story.category && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-gray-700 shadow-sm mb-4">
                    <Tag className="h-3 w-3" />
                    {story.category}
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {story.title}
                </h1>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-48 md:h-64 bg-gradient-to-br from-primary/10 via-white to-accent/10 flex items-center justify-center">
            <ImageIcon className="h-20 w-20 text-gray-200" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="max-w-6xl xl:max-w-7xl mx-auto">
                {story.category && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-gray-700 shadow-sm mb-4">
                    <Tag className="h-3 w-3" />
                    {story.category}
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                  {story.title}
                </h1>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content area */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-8 space-y-8">
          {/* Back link */}
          <div className="px-4 sm:px-0">
            <button
              onClick={() => navigate('/historias')}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a historias
            </button>
          </div>

          {/* Meta info cards */}
          <div className="flex flex-wrap items-center gap-3 px-4 sm:px-0">
            {story.author && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-gray-700">{story.author}</span>
              </div>
            )}
            <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
              <Calendar className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">{formatDate(story.createdAt)}</span>
            </div>
            {story.updatedAt !== story.createdAt && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Actualizada el {formatDate(story.updatedAt)}</span>
              </div>
            )}
            {/* Like Button */}
            <button
              onClick={() => void toggleLike()}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-semibold transition-all duration-300 transform active:scale-95",
                isLiked 
                  ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm" 
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              )}
            >
              <Heart className={cn("h-4 w-4 transition-transform", isLiked ? "fill-rose-500 text-rose-500 scale-110" : "text-gray-400")} />
              <span className="text-sm">{story.likesCount || 0}</span>
            </button>
          </div>

          {/* Tags */}
          {story.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 sm:px-0">
              {story.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Story content */}
          {isUnlocked ? (
            <div className="rounded-none sm:rounded-3xl border-0 sm:border border-gray-100 bg-transparent sm:bg-gray-50 p-0 sm:p-6 md:p-10">
              <div
                className="prose prose-base md:prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl prose-p:text-gray-700 prose-p:leading-relaxed w-full max-w-full break-words [word-break:break-word]"
                dangerouslySetInnerHTML={{ __html: story.content }}
              />
            </div>
          ) : (
            <div className="relative rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50 p-6 md:p-10 space-y-6 overflow-hidden">
              {/* Preview snippet */}
              <div className="relative max-h-44 overflow-hidden select-none">
                <div
                  className="prose prose-base md:prose-lg max-w-none text-gray-500 blur-[2.5px]"
                  dangerouslySetInnerHTML={{ __html: story.content.slice(0, 350) + '...' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
              </div>

              {/* Unlock Callout Box */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xl text-center space-y-4 relative z-10 max-w-xl mx-auto">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
                  <Sparkles className="w-8 h-8 text-emerald-600 animate-pulse" />
                </div>

                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Historia de Transformación Exclusiva
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Accede al relato completo de sanación por solo <strong>✨ {priceInfo.lumis} Lumis (${priceInfo.cop.toLocaleString('es-CO')} COP)</strong>. Tendrás acceso ilimitado de por vida a esta experiencia y sus reflexiones.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleUnlockStory}
                    disabled={isUnlocking}
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isUnlocking ? 'Procesando canje...' : `🔓 Desbloquear por ✨ ${priceInfo.lumis} Lumis`}
                  </button>

                  {isAuthed && (
                    <button
                      onClick={() => navigate('/comprar-lumis')}
                      className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white font-bold text-xs py-3.5 px-5 rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      🛒 Recargar Lumis
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="px-4 sm:px-0 space-y-6">
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-primary" />
              Comentarios ({story.comments?.length || 0})
            </h3>

            {/* Comments List */}
            {rootComments.length > 0 ? (
              <div className="space-y-6">
                {rootComments.map((rootComment) => {
                  const replies = repliesByParentId[rootComment.id] || [];
                  const hasReplies = replies.length > 0;
                  const isCollapsed = collapsedCommentIds.includes(rootComment.id);

                  return (
                    <div key={rootComment.id} className="space-y-4">
                      {/* Render Root Comment */}
                      {renderComment(rootComment, false, rootComment.id)}

                      {/* Render Replies Toggle */}
                      {hasReplies && (
                        <div className="pl-4 md:pl-10">
                          <button
                            onClick={() => toggleReplies(rootComment.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                          >
                            {isCollapsed ? (
                              <span>Mostrar respuestas ({replies.length})</span>
                            ) : (
                              <span>Ocultar respuestas</span>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Render Replies List */}
                      {hasReplies && !isCollapsed && (
                        <div className="pl-6 md:pl-12 space-y-4 border-l-2 border-gray-100/80 ml-5 md:ml-10">
                          {replies.map((reply) => renderComment(reply, true, rootComment.id))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50">
                <p className="text-sm text-gray-500 font-medium">Aún no hay comentarios. ¡Sé el primero en compartir tu opinión!</p>
              </div>
            )}

            {/* Comment Form */}
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 sm:p-8 space-y-4">
              <h4 className="font-bold text-gray-800 text-lg">Escribir un comentario</h4>
              {commentError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                  {commentError}
                </div>
              )}
              {!isAuthed ? (
                <div className="rounded-2xl border border-gray-100 bg-white p-5 text-sm text-gray-600">
                  Inicia sesión para comentar.
                  <div className="mt-3">
                    <Link to="/login" state={{ from: `/historias/${story.id}` }} className="text-primary font-bold hover:underline">
                      Ir a iniciar sesión
                    </Link>
                  </div>
                </div>
              ) : publishBlocked ? (
                <div className="rounded-2xl border border-gray-100 bg-white p-5 text-sm text-gray-600">
                  Tu cuenta no tiene permisos para publicar comentarios.
                </div>
              ) : (
                <form onSubmit={(e) => void submitComment(e)} className="space-y-4">
                  <p className="text-xs font-bold text-gray-500 ml-1">
                    Comentando como <span className="text-primary">{patientName || 'Usuario Registrado'}</span>
                  </p>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Mensaje</label>
                    <textarea
                      rows={4}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Escribe tu comentario aquí..."
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 leading-relaxed"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submittingComment || !commentText.trim() || publishBlocked}
                    className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-xl font-bold transition-all animate-scale-in"
                  >
                    {submittingComment ? 'Enviando...' : 'Publicar Comentario'}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="mx-4 sm:mx-0 rounded-3xl border border-gray-100 bg-gradient-to-br from-primary/5 to-accent/5 p-8 text-center space-y-4">
            <h3 className="text-xl font-bold text-gray-800">¿Te identificas con esta historia?</h3>
            <p className="text-sm text-gray-600 max-w-lg mx-auto">
              Cada paso hacia el bienestar comienza con una decisión. Si sientes que es tu momento, estamos aquí para acompañarte.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={() => navigate('/agenda')} className="bg-gradient-to-r from-primary to-accent text-white rounded-xl">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar cita
              </Button>
              <Button variant="outline" onClick={() => navigate('/historias')} className="rounded-xl border-primary text-primary hover:bg-primary/10 hover:text-primary">
                <BookOpen className="h-4 w-4 mr-2" />
                Ver más historias
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default StoryDetailPage;
