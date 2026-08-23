import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import PublicLayout from '../components/PublicLayout';
import { ExpandableText } from '@/components/ui/ExpandableText';
import { ArrowLeft, MessageSquareText, Calendar, Clock, Pin, Lock, MessageCircle, Send, User, LogIn, ImageIcon, Heart } from 'lucide-react';
import { api } from '../api/client';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

type ForumReply = {
  id: number;
  topicId: number;
  content: string;
  contentHtml?: string;
  authorName: string;
  patientId: number | null;
  parentId?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type ForumTopic = {
  id: number;
  title: string;
  description: string;
  descriptionHtml?: string;
  category: string;
  imageUrl: string | null;
  isPinned: boolean;
  isLocked: boolean;
  isActive: boolean;
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
  replies: ForumReply[];
  likesCount?: number;
};

const ForumDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthed = typeof window !== 'undefined' && Boolean(localStorage.getItem('conexionluz:token'));

  // Reply form
  const [replyContent, setReplyContent] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const [patientId, setPatientId] = useState<number | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const publishBlocked = false;
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [savingReply, setSavingReply] = useState(false);
  const [deletingReplyId, setDeletingReplyId] = useState<number | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const [likedIds, setLikedIdsState] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem('conexionluz:likedForumTopics');
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const isLiked = topic ? likedIds.includes(topic.id) : false;

  const toggleLike = async () => {
    if (!topic) return;
    if (!isAuthed) {
      navigate('/login', { state: { from: `/foro/${topic.id}` } });
      return;
    }
    const nextLiked = !isLiked;

    setTopic(prev => prev ? {
      ...prev,
      likesCount: (prev.likesCount || 0) + (nextLiked ? 1 : -1)
    } : null);

    const nextIds = nextLiked
      ? [...likedIds, topic.id]
      : likedIds.filter(x => x !== topic.id);
    setLikedIdsState(nextIds);
    localStorage.setItem('conexionluz:likedForumTopics', JSON.stringify(Array.from(new Set(nextIds))));

    const res = nextLiked
      ? await api.post<{ topicId: number; likesCount: number; liked: boolean }>(`/api/public/forum/${topic.id}/like/`, {})
      : await api.del<{ topicId: number; likesCount: number; liked: boolean }>(`/api/public/forum/${topic.id}/like/`);

    if (res.ok) {
      setTopic(prev => prev ? {
        ...prev,
        likesCount: res.data.likesCount
      } : null);
      const updatedIds = res.data.liked
        ? [...likedIds, topic.id]
        : likedIds.filter(x => x !== topic.id);
      setLikedIdsState(updatedIds);
      localStorage.setItem('conexionluz:likedForumTopics', JSON.stringify(Array.from(new Set(updatedIds))));
    } else {
      setTopic(prev => prev ? {
        ...prev,
        likesCount: (prev.likesCount || 0) + (nextLiked ? -1 : 1)
      } : null);
      const revertedIds = !nextLiked
        ? [...likedIds, topic.id]
        : likedIds.filter(x => x !== topic.id);
      setLikedIdsState(revertedIds);
      localStorage.setItem('conexionluz:likedForumTopics', JSON.stringify(Array.from(new Set(revertedIds))));
    }
  };

  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [savingTopic, setSavingTopic] = useState(false);
  const [topicEditError, setTopicEditError] = useState<string | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingTopic, setDeletingTopic] = useState(false);

  const handleStartEditTopic = () => {
    if (!topic) return;
    setEditTitle(topic.title);
    setEditCategory(topic.category || '');
    setEditDescription(topic.description || '');
    setTopicEditError(null);
    setIsEditingTopic(true);
  };

  const handleSaveTopicEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    setSavingTopic(true);
    setTopicEditError(null);

    const res = await api.patch<ForumTopic>(`/api/public/forum/${topic.id}/`, {
      title: editTitle.trim(),
      category: editCategory.trim(),
      description: editDescription.trim(),
      descriptionHtml: '',
    });

    if (res.ok === false) {
      setTopicEditError(res.error);
    } else {
      setTopic(prev => prev ? {
        ...prev,
        title: res.data.title,
        category: res.data.category,
        description: res.data.description,
        descriptionHtml: res.data.descriptionHtml,
      } : null);
      setIsEditingTopic(false);
    }
    setSavingTopic(false);
  };

  const executeDeleteTopic = async () => {
    if (!topic) return;
    setDeletingTopic(true);
    const res = await api.del<{ ok: boolean }>(`/api/public/forum/${topic.id}/`);
    if (res.ok === false) {
      alert(res.error);
      setDeletingTopic(false);
    } else {
      navigate('/foro');
    }
  };

  const [replyingReplyId, setReplyingReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [replyFormError, setReplyFormError] = useState<string | null>(null);
  const [collapsedReplyIds, setCollapsedReplyIds] = useState<number[]>([]);

  const repliesByParentId = useMemo(() => {
    const map: Record<number, ForumReply[]> = {};
    topic?.replies?.forEach((r) => {
      if (r.parentId) {
        if (!map[r.parentId]) map[r.parentId] = [];
        map[r.parentId].push(r);
      }
    });
    return map;
  }, [topic?.replies]);

  const rootReplies = useMemo(() => {
    return topic?.replies?.filter((r) => !r.parentId) || [];
  }, [topic?.replies]);

  const toggleReplies = (replyId: number) => {
    setCollapsedReplyIds((prev) =>
      prev.includes(replyId) ? prev.filter((id) => id !== replyId) : [...prev, replyId]
    );
  };

  useEffect(() => {
    if (isAuthed) {
      api.get<any>('/api/portal/me/').then((res) => {
        if (res.ok) {
          setPatientId(res.data.id);
          setUserType((res.data.userType || '').trim() || null);
        }
      });
    } else {
      setPatientId(null);
      setUserType(null);
    }
  }, [isAuthed]);

  const startEditingReply = (reply: ForumReply) => {
    setEditingReplyId(reply.id);
    setEditContent(reply.content);
    setEditError(null);
  };

  const cancelEditingReply = () => {
    setEditingReplyId(null);
    setEditContent('');
    setEditError(null);
  };

  const saveEditReply = async (replyId: number) => {
    if (!editContent.trim()) return;
    setSavingReply(true);
    setEditError(null);
    const res = await api.patch<ForumReply>(`/api/public/forum/replies/${replyId}/`, {
      content: editContent.trim()
    });
    if (res.ok === false) {
      setEditError(res.error);
    } else {
      if (topic) {
        setTopic({
          ...topic,
          replies: topic.replies.map(r => r.id === replyId ? res.data : r)
        });
      }
      setEditingReplyId(null);
      setEditContent('');
    }
    setSavingReply(false);
  };

  const executeDeleteReply = async (replyId: number) => {
    setEditError(null);
    const res = await api.del<{ ok: boolean }>(`/api/public/forum/replies/${replyId}/`);
    if (res.ok === false) {
      setEditError(res.error);
    } else {
      if (topic) {
        const removedReplies = topic.replies.filter(r => r.id === replyId || r.parentId === replyId);
        const removedCount = removedReplies.length;
        setTopic({
          ...topic,
          replies: topic.replies.filter(r => r.id !== replyId && r.parentId !== replyId),
          repliesCount: Math.max(0, topic.repliesCount - removedCount)
        });
      }
      setDeletingReplyId(null);
    }
  };

  const submitNestedReply = async (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    if (publishBlocked) {
      setReplyFormError('Tu cuenta no tiene permisos para publicar.');
      return;
    }
    if (!topic || !replyText.trim()) return;
    setSubmittingReply(true);
    setReplyFormError(null);

    const res = await api.post<ForumReply>(`/api/public/forum/${topic.id}/reply/`, {
      content: replyText.trim(),
      parentId: parentId
    });

    if (res.ok === false) {
      setReplyFormError(res.error);
    } else {
      setTopic({
        ...topic,
        replies: [...topic.replies, res.data],
        repliesCount: topic.repliesCount + 1,
      });
      setReplyText('');
      setReplyingReplyId(null);
    }
    setSubmittingReply(false);
  };

  const renderReply = (reply: ForumReply, isReply = false, rootReplyId: number) => {
    const initial = reply.authorName.charAt(0).toUpperCase();
    const isOwner = isAuthed && reply.patientId === patientId;
    const isEditing = editingReplyId === reply.id;

    return (
      <motion.div
        key={reply.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 md:p-8 shadow-sm transition-all hover:shadow-md",
          isReply && "bg-gray-50/50"
        )}
      >
        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          <div className={cn(
            "h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0 border border-primary/5 text-primary font-black",
            isReply && "h-8 w-8 text-sm rounded-lg sm:rounded-xl"
          )}>
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <p className="text-sm sm:text-base font-bold text-gray-900">{reply.authorName}</p>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-400">
                {formatShortDate(reply.createdAt)} • {formatTime(reply.createdAt)}
              </p>
            </div>
            <div className="h-0.5 w-8 bg-primary/20 rounded-full mt-1.5" />
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3 mt-2">
            {editError && (
              <div className="p-2 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-medium">
                {editError}
              </div>
            )}
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 leading-relaxed"
            />
            <div className="flex gap-2">
              <button
                onClick={() => void saveEditReply(reply.id)}
                disabled={savingReply || !editContent.trim()}
                className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/95 transition-colors disabled:opacity-50"
              >
                {savingReply ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={cancelEditingReply}
                disabled={savingReply}
                className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            {reply.contentHtml ? (
              <div 
                className="prose prose-sm dark:prose-invert max-w-none text-gray-700 break-words"
                dangerouslySetInnerHTML={{ __html: reply.contentHtml }}
              />
            ) : (
              <ExpandableText
                text={reply.content}
                maxLength={280}
                className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words"
              />
            )}

            <div className="flex flex-col gap-2 pt-2 border-t border-gray-50 mt-4">
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                {isAuthed && !topic?.isLocked && (
                  <button
                    onClick={() => {
                      setReplyingReplyId(reply.id);
                      setReplyText(isReply ? `@${reply.authorName} ` : '');
                      setReplyFormError(null);
                    }}
                    disabled={publishBlocked}
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Responder
                  </button>
                )}

                {isOwner && (
                  <>
                    <button
                      onClick={() => startEditingReply(reply)}
                      className="text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setDeletingReplyId(reply.id)}
                      className="text-rose-600 hover:text-rose-700 transition-colors font-medium"
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </div>

              {deletingReplyId === reply.id && (
                <div className="flex flex-col gap-2 mt-2 p-3 bg-rose-50 rounded-xl border border-rose-100 text-xs animate-scale-in">
                  {editError && (
                    <div className="p-2 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-medium w-full">
                      {editError}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <span className="text-rose-700 font-medium">¿Estás seguro de que deseas eliminar esta respuesta?</span>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => void executeDeleteReply(reply.id)}
                        className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 transition-colors"
                      >
                        Sí, eliminar
                      </button>
                      <button
                        onClick={() => setDeletingReplyId(null)}
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

        {/* Inline Reply Form */}
        {replyingReplyId === reply.id && (
          <form onSubmit={(e) => void submitNestedReply(e, rootReplyId)} className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 space-y-3">
            <h5 className="text-xs font-bold text-gray-700">Responder a {reply.authorName}</h5>
            {replyFormError && (
              <div className="p-2 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-medium">
                {replyFormError}
              </div>
            )}
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 leading-relaxed"
            />
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
                  setReplyingReplyId(null);
                  setReplyText('');
                  setReplyFormError(null);
                }}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </motion.div>
    );
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await api.get<ForumTopic>(`/api/public/forum/${id}/`);
      if (res.ok === false) {
        setError(res.error);
        setLoading(false);
        return;
      }
      setTopic(res.data);
      setLoading(false);
    };
    void load();
  }, [id]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (publishBlocked) {
      setReplyError('Tu cuenta no tiene permisos para publicar.');
      return;
    }
    if (!topic || !replyContent.trim()) return;
    setSendingReply(true);
    setReplyError(null);

    const res = await api.post<ForumReply>(`/api/public/forum/${topic.id}/reply/`, { content: replyContent.trim() });
    if (res.ok === false) {
      setReplyError(res.error);
      setSendingReply(false);
      return;
    }
    setTopic({
      ...topic,
      replies: [...topic.replies, res.data],
      repliesCount: topic.repliesCount + 1,
    });
    setReplyContent('');
    setSendingReply(false);
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

  const formatShortDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });

  // Loading
  if (loading) {
    return (
      <PublicLayout contentClassName="p-0">
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-32 rounded-2xl bg-gray-200 animate-pulse" />
          <div className="h-10 w-3/4 bg-gray-200 rounded-xl animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Error / Not found
  if (error || !topic) {
    return (
      <PublicLayout contentClassName="p-0">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={() => navigate('/foro')}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-10"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al foro
          </button>
          <div className="flex flex-col items-center justify-center py-20 rounded-3xl border border-gray-100 bg-gray-50">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MessageSquareText className="h-7 w-7 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-1">Tema no encontrado</p>
            <p className="text-sm text-gray-500">{error || 'El tema que buscas no existe o fue eliminado.'}</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout contentClassName="p-0">
      {/* Banner / Header area (Edge-to-edge on mobile) */}
      <div className="relative">
        {topic.imageUrl ? (
          <div className="relative w-full h-64 md:h-96 overflow-hidden">
            <img
              src={topic.imageUrl}
              alt={topic.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-4 py-6 md:p-10">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  {topic.isPinned && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/90 backdrop-blur-sm px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white border border-amber-400/20 shadow-sm">
                      <Pin className="h-3 w-3" /> Fijado
                    </span>
                  )}
                  {topic.isLocked && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/90 backdrop-blur-sm px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white border border-rose-400/20 shadow-sm">
                      <Lock className="h-3 w-3" /> Cerrado
                    </span>
                  )}
                  {topic.category && (
                    <span className="inline-flex items-center rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gray-700 shadow-sm">
                      {topic.category}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                  {topic.title}
                </h1>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-48 md:h-64 bg-gradient-to-br from-primary/10 via-white to-accent/10 flex items-center justify-center">
            <div className="absolute bottom-0 left-0 right-0 px-4 py-6 md:p-10">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  {topic.isPinned && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-600 border border-amber-100">
                      <Pin className="h-3 w-3" /> Fijado
                    </span>
                  )}
                  {topic.isLocked && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-rose-600 border border-rose-100">
                      <Lock className="h-3 w-3" /> Cerrado
                    </span>
                  )}
                  {topic.category && (
                    <span className="inline-flex items-center rounded-full bg-primary/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
                      {topic.category}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                  {topic.title}
                </h1>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content area */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-4xl mx-auto px-0 sm:px-4 space-y-8">
          {/* Back link */}
          <div className="px-4 sm:px-0">
            <button
              onClick={() => navigate('/foro')}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al foro
            </button>
          </div>

          {isEditingTopic ? (
            <form onSubmit={(e) => void handleSaveTopicEdit(e)} className="mx-4 sm:mx-0 rounded-3xl border border-gray-100 bg-gray-50 p-5 sm:p-8 space-y-4 shadow-sm animate-scale-in">
              <h3 className="text-lg font-black text-gray-900">Editar tema del foro</h3>
              {topicEditError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-medium">
                  {topicEditError}
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Título del tema</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium text-gray-800"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Categoría</label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium text-gray-800"
                  placeholder="Ej. Convivencia, Bienestar"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Descripción / Contenido</label>
                <textarea
                  rows={8}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none leading-relaxed font-medium text-gray-700"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  disabled={savingTopic}
                  className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/95 transition-colors disabled:opacity-50"
                >
                  {savingTopic ? 'Guardando...' : 'Guardar cambios'}
                </Button>
                <button
                  type="button"
                  onClick={() => setIsEditingTopic(false)}
                  disabled={savingTopic}
                  className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Meta info cards */}
              <div className="flex flex-wrap items-center gap-3 px-4 sm:px-0">
                <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-gray-700">Comunidad ConexiónLuz</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-gray-700">{formatDate(topic.createdAt)}</span>
                </div>
                {topic.updatedAt !== topic.createdAt && (
                  <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Actualizado el {formatDate(topic.updatedAt)}</span>
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
                  <span className="text-sm">{topic.likesCount || 0}</span>
                </button>

                {/* Edit & Delete Controls */}
                {isAuthed && topic.createdById === patientId && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleStartEditTopic}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-semibold text-gray-600 hover:bg-gray-100 hover:text-primary transition-all active:scale-95 text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 font-semibold text-rose-600 hover:bg-rose-100 transition-all active:scale-95 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>

              {showDeleteConfirm && (
                <div className="mx-4 sm:mx-0 p-4 bg-rose-50 rounded-2xl border border-rose-100 space-y-3 animate-scale-in">
                  <p className="text-xs sm:text-sm font-bold text-rose-700">
                    ¿Estás seguro de que deseas eliminar este tema? Esta acción no se puede deshacer y borrará también todas las respuestas.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => void executeDeleteTopic()}
                      disabled={deletingTopic}
                      className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors disabled:opacity-50"
                    >
                      {deletingTopic ? 'Eliminando...' : 'Sí, eliminar'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={deletingTopic}
                      className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Topic content / description (Edge-to-edge read style on mobile, card style on desktop) */}
              {(topic.descriptionHtml || topic.description) && (
                <div className="rounded-none sm:rounded-3xl border-0 sm:border border-gray-100 bg-transparent sm:bg-gray-50 p-0 sm:p-8 shadow-none sm:shadow-sm">
                  {topic.descriptionHtml ? (
                    <div
                      className="prose prose-base md:prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl prose-p:text-gray-700 prose-p:leading-relaxed w-full max-w-full break-words [word-break:break-word]"
                      dangerouslySetInnerHTML={{ __html: topic.descriptionHtml }}
                    />
                  ) : (
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words px-4 sm:px-0">
                      {topic.description}
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Replies / Discussion Section */}
          <div className="px-4 sm:px-0 space-y-6">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              Discusión <span className="text-primary">({topic.replies.length})</span>
            </h2>

            {topic.replies.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 sm:p-16 text-center">
                <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                  <MessageSquareText className="h-7 w-7 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">Aún no hay respuestas. ¡Inicia la conversación!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {rootReplies.map((rootReply) => {
                  const replies = repliesByParentId[rootReply.id] || [];
                  const hasReplies = replies.length > 0;
                  const isCollapsed = collapsedReplyIds.includes(rootReply.id);

                  return (
                    <div key={rootReply.id} className="space-y-4">
                      {/* Render Root Reply */}
                      {renderReply(rootReply, false, rootReply.id)}

                      {/* Render Replies Toggle */}
                      {hasReplies && (
                        <div className="pl-3 sm:pl-4 md:pl-10">
                          <button
                            onClick={() => toggleReplies(rootReply.id)}
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
                        <div className="pl-4 sm:pl-6 md:pl-12 space-y-4 border-l-2 border-gray-100/80 ml-4 sm:ml-5 md:ml-10">
                          {replies.map((reply) => renderReply(reply, true, rootReply.id))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Reply form / Authentication request */}
            <div className="pt-4">
              {topic.isLocked ? (
                <div className="rounded-3xl border border-rose-100 bg-rose-50/30 p-6 sm:p-8 text-center">
                  <Lock className="h-6 w-6 text-rose-400 mx-auto mb-3" />
                  <p className="text-sm font-bold text-rose-600 uppercase tracking-widest">Tema Cerrado</p>
                  <p className="text-xs text-rose-500 mt-1">Este debate ya no acepta más contribuciones.</p>
                </div>
              ) : !isAuthed ? (
                <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-10 text-center shadow-xl shadow-primary/5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-primary/5 flex items-center justify-center mx-auto mb-6">
                    <LogIn className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">Únete a la conversación</h3>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-6 sm:mb-8 leading-relaxed">
                    Para participar y compartir tu opinión, necesitas estar registrado en nuestra comunidad.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2.5 bg-primary text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all"
                  >
                    <LogIn className="h-4 w-4" />
                    Iniciar sesión ahora
                  </Link>
                </div>
              ) : publishBlocked ? (
                <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-10 text-center shadow-xl shadow-primary/5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-primary/5 flex items-center justify-center mx-auto mb-6">
                    <User className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">Publicación restringida</h3>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                    Tu cuenta no tiene permisos para publicar en el foro.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendReply} className="rounded-3xl border border-gray-100 bg-white p-5 sm:p-8 md:p-10 shadow-xl shadow-primary/5 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                      <Send className="h-5 w-5 text-indigo-500" />
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-gray-900">Escribir una respuesta</h3>
                  </div>

                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={5}
                    className="w-full px-4 sm:px-6 py-4 sm:py-5 rounded-2xl sm:rounded-3xl border border-gray-100 bg-gray-50 text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all resize-none"
                    placeholder="Tu contribución es importante..."
                    required
                  />

                  {replyError && (
                    <p className="text-xs font-bold text-rose-500 px-2">{replyError}</p>
                  )}

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={sendingReply || !replyContent.trim() || publishBlocked}
                      className="h-12 sm:h-14 px-6 sm:px-10 bg-primary text-white rounded-xl sm:rounded-2xl font-black shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all text-xs sm:text-sm"
                    >
                      {sendingReply ? (
                        <span className="inline-flex items-center gap-2">
                          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" /></svg>
                          Publicando...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Publicar respuesta
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* CTA Section */}
            <div className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-gray-900 p-6 sm:p-10 md:p-14 text-center">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-[100px]" />
              </div>
              
              <div className="relative z-10 space-y-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">¿Buscas apoyo personalizado?</h3>
                <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                  A veces la conversación grupal es el primer paso, pero un acompañamiento individual puede marcar la diferencia definitiva.
                </p>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <Button onClick={() => navigate('/agenda')} className="h-12 sm:h-14 px-6 sm:px-8 bg-white text-gray-900 rounded-xl sm:rounded-2xl font-black hover:bg-gray-100 transition-all text-xs sm:text-sm">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Agendar Sesión
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/foro')} className="h-12 sm:h-14 px-6 sm:px-8 border-white/20 text-white rounded-xl sm:rounded-2xl font-black hover:bg-white/5 transition-all text-xs sm:text-sm">
                    Explorar otros temas
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};


export default ForumDetailPage;
