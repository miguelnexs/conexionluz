import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sun,
  Sprout,
  Send,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Trash2,
  Sparkles,
  MessageCircle,
  Share2,
  Pencil,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CustomVideoPlayer } from './CustomVideoPlayer';
import { encodePostSlug } from '@/utils/postSlug';

interface CommentReply {
  id: string;
  patientId?: number | null;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
  createdAt: string;
  likes?: string[];
}

interface Comment {
  id: string;
  patientId?: number | null;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
  createdAt: string;
  likes?: string[];
  replies?: Comment[];
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

interface PostDetailModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => Promise<void>;
  onLikeComment?: (postId: string, commentId: string) => void;
  onAddReply?: (postId: string, commentId: string, replyText: string) => Promise<void>;
  onEditComment?: (postId: string, commentId: string, text: string) => Promise<void>;
  onDeleteComment?: (postId: string, commentId: string) => Promise<void>;
  myName?: string;
  isLikedByMe: boolean;
  isAuthed: boolean;
  hasPrev?: boolean;
  hasNext?: boolean;
  onPrevPost?: () => void;
  onNextPost?: () => void;
  initialTime?: number;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
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
  if (typeof iso === 'string' && (iso.startsWith('Hace') || iso === 'Ahora')) return iso;
  try {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return 'Hace un momento';
    const diff = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diff < 1) return 'Ahora';
    if (diff < 60) return `Hace ${diff} min`;
    const h = Math.floor(diff / 60);
    if (h < 24) return `Hace ${h} h`;
    return `Hace ${Math.floor(h / 24)} d`;
  } catch {
    return 'Hace un momento';
  }
};

interface CommentItemProps {
  comment: Comment;
  postId: string;
  level?: number;
  onLikeComment?: (postId: string, commentId: string) => void;
  onAddReply?: (postId: string, commentId: string, replyText: string) => Promise<void>;
  onEditComment?: (postId: string, commentId: string, text: string) => Promise<void>;
  onDeleteComment?: (postId: string, commentId: string) => Promise<void>;
  myName?: string;
  isAuthed: boolean;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  postId,
  level = 0,
  onLikeComment,
  onAddReply,
  onEditComment,
  onDeleteComment,
  myName,
  isAuthed
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const likesCount = comment.likes?.length || 0;
  const isLikedByMe = Boolean(myName && comment.likes?.includes(myName));
  const hasReplies = Boolean(comment.replies && comment.replies.length > 0);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || submittingReply) return;
    setSubmittingReply(true);
    try {
      if (onAddReply) await onAddReply(postId, comment.id, replyText.trim());
      setReplyText('');
      setIsReplying(false);
      setIsCollapsed(false);
    } catch (err) {
      console.error('Error adding reply:', err);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editText.trim() || submittingEdit) return;
    setSubmittingEdit(true);
    try {
      if (onEditComment) await onEditComment(postId, comment.id, editText.trim());
      setIsEditing(false);
    } catch (err) {
      console.error('Error editing comment:', err);
    } finally {
      setSubmittingEdit(false);
    }
  };

  return (
    <div className={cn(
      "rounded-2xl border transition-all space-y-2 group/comment",
      level === 0 ? "p-3.5 bg-slate-50/80 border-slate-100" : "p-2.5 bg-white border-slate-100/90 shadow-2xs"
    )}>
      {/* Header Row: Avatar, Author, Time, Edit/Delete Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "rounded-full overflow-hidden bg-slate-200 flex items-center justify-center font-bold text-slate-600 shrink-0 border border-slate-200",
            level === 0 ? "h-7 w-7 text-[10px]" : "h-6 w-6 text-[9px]"
          )}>
            {comment.authorAvatar && !comment.authorAvatar.includes('community-posts') && !comment.authorAvatar.includes('media_') ? (
              <img src={comment.authorAvatar} alt={comment.authorName} className="h-full w-full object-cover" />
            ) : (
              comment.authorName?.[0] || 'C'
            )}
          </div>
          <span className={cn("font-bold text-slate-900", level === 0 ? "text-xs" : "text-[11px]")}>{comment.authorName}</span>
          <span className="text-[9px] text-slate-400 font-medium">{formatTimeAgo(comment.createdAt)}</span>
        </div>

        {/* Action Buttons: Edit & Delete */}
        <div className="flex items-center gap-1.5">
          {onEditComment && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(!isEditing);
                setEditText(comment.content);
              }}
              className="text-slate-400 hover:text-emerald-600 p-1 transition-colors cursor-pointer flex items-center gap-0.5 text-[10px] font-bold"
              title="Editar comentario"
            >
              <Pencil className="h-3 w-3" />
              <span className="hidden sm:inline">Editar</span>
            </button>
          )}

          {onDeleteComment && (
            <button
              type="button"
              onClick={() => onDeleteComment(postId, comment.id)}
              className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer flex items-center gap-0.5 text-[10px] font-bold"
              title="Eliminar comentario"
            >
              <Trash2 className="h-3 w-3" />
              <span className="hidden sm:inline">Eliminar</span>
            </button>
          )}
        </div>
      </div>

      {/* Comment Body / Edit Form */}
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="pl-7 pt-1 space-y-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full text-xs text-slate-800 bg-white border border-emerald-400 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            autoFocus
          />
          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-700 text-[10px] font-bold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!editText.trim() || submittingEdit}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-[10px] cursor-pointer"
            >
              Guardar
            </button>
          </div>
        </form>
      ) : (
        <p className={cn("text-slate-700 leading-relaxed font-medium pl-7 text-justify [text-justify:inter-word] [text-align-last:left]", level === 0 ? "text-xs" : "text-[11px]")}>
          {comment.content}
        </p>
      )}

      {/* Action Row: Iluminar, Responder, Ocultar/Ver Respuestas */}
      <div className="flex items-center justify-between pl-7 pt-1 text-[11px] text-slate-500 font-bold">
        <div className="flex items-center gap-4">
          {/* Iluminar / Me Gusta */}
          <button
            type="button"
            onClick={() => onLikeComment?.(postId, comment.id)}
            className={cn(
              "flex items-center gap-1 hover:text-amber-600 transition-all cursor-pointer",
              isLikedByMe && "text-amber-600 font-black"
            )}
          >
            <Sun className={cn("h-3.5 w-3.5 text-amber-500", isLikedByMe && "fill-amber-400 animate-spin-slow")} />
            <span>Iluminar {likesCount > 0 ? `(${likesCount})` : ''}</span>
          </button>

          {/* Responder */}
          <button
            type="button"
            onClick={() => {
              setIsReplying(!isReplying);
              setReplyText('');
            }}
            className="flex items-center gap-1 hover:text-emerald-600 transition-all cursor-pointer text-slate-600"
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>Responder</span>
          </button>
        </div>

        {/* Esconder / Ver Respuestas Toggle */}
        {hasReplies && (
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1 text-[10px] text-emerald-700 hover:text-emerald-800 font-bold transition-all cursor-pointer bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200/60"
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="h-3 w-3 text-emerald-600" />
                <span>Ver {comment.replies!.length} {comment.replies!.length === 1 ? 'respuesta' : 'respuestas'}</span>
              </>
            ) : (
              <>
                <ChevronUp className="h-3 w-3 text-emerald-600" />
                <span>Ocultar respuestas</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Reply Form */}
      {isReplying && (
        <div className="pl-7 pt-2 animate-in fade-in slide-in-from-top-1 duration-150">
          <form onSubmit={handleReplySubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Responder a ${comment.authorName}...`}
              className="flex-1 text-xs text-slate-800 placeholder-slate-400 bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              autoFocus
            />
            <button
              type="submit"
              disabled={!replyText.trim() || submittingReply}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-xs cursor-pointer shrink-0"
            >
              Responder
            </button>
          </form>
        </div>
      )}

      {/* Recursive Child Thread (Indented) */}
      {hasReplies && !isCollapsed && (
        <div className={cn(
          "mt-2 pl-2 sm:pl-3 border-l-2 border-emerald-500/30 space-y-2.5",
          level < 4 ? "ml-3 sm:ml-4" : "ml-1"
        )}>
          {comment.replies!.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              level={level + 1}
              onLikeComment={onLikeComment}
              onAddReply={onAddReply}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
              myName={myName}
              isAuthed={isAuthed}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  isOpen,
  onClose,
  onLike,
  onAddComment,
  onLikeComment,
  onAddReply,
  onEditComment,
  onDeleteComment,
  myName,
  isLikedByMe,
  isAuthed,
  onPrevPost,
  onNextPost,
  hasPrev,
  hasNext,
  initialTime,
  onTimeUpdate
}) => {
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation & Esc listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev && onPrevPost) onPrevPost();
      if (e.key === 'ArrowRight' && hasNext && onNextPost) onNextPost();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrev, hasNext, onPrevPost, onNextPost, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const [copied, setCopied] = useState(false);

  if (!isOpen || !post) return null;

  const handleCopyLink = () => {
    const slug = encodePostSlug(post.id);
    const fullUrl = `${window.location.origin}/#/publicacion/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      await onAddComment(post.id, commentText.trim());
      setCommentText('');
      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error("Error submitting comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const feelingObj = post.feeling ? FEELINGS_LIST.find(f => f.label === post.feeling) : null;
  const hasMedia = Boolean(post.image);

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center overflow-hidden animate-in fade-in duration-200">
      
      {/* Top Bar for Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopyLink}
          className="h-10 px-3.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-emerald-500/40 flex items-center gap-1.5 text-xs font-bold transition-all shadow-xl backdrop-blur-md cursor-pointer active:scale-95"
          title="Copiar enlace permanente"
        >
          <Share2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>{copied ? '¡Copiado!' : 'Copiar Enlace'}</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="h-10 w-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/60 flex items-center justify-center transition-all shadow-xl backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95"
          title="Cerrar (Esc)"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Fullscreen Grid Layout */}
      <div className="w-full h-full flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* ─── LEFT: MEDIA / THEATER AREA (74% desktop width) ─── */}
        <div className="flex-1 lg:w-[74%] h-[60vh] lg:h-full bg-slate-950 relative flex items-center justify-center overflow-hidden select-none">
          
          {/* Ambient Blurred Background Glow (Vibrant atmospheric colors) */}
          {hasMedia && !isVideoMedia(post.image) && (
            <div 
              className="absolute inset-0 bg-cover bg-center blur-3xl opacity-45 scale-150 pointer-events-none transition-all duration-700"
              style={{ backgroundImage: `url(${post.image})` }}
            />
          )}

          {/* Previous Post Arrow Button */}
          {hasPrev && onPrevPost && (
            <button
              type="button"
              onClick={onPrevPost}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40 h-12 w-12 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-emerald-500/40 flex items-center justify-center transition-all shadow-2xl backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95 group"
              title="Publicación anterior (←)"
            >
              <ChevronLeft className="h-7 w-7 text-slate-200 group-hover:text-emerald-400 transition-colors" />
            </button>
          )}

          {/* Next Post Arrow Button */}
          {hasNext && onNextPost && (
            <button
              type="button"
              onClick={onNextPost}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40 h-12 w-12 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-emerald-500/40 flex items-center justify-center transition-all shadow-2xl backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95 group"
              title="Siguiente publicación (→)"
            >
              <ChevronRight className="h-7 w-7 text-slate-200 group-hover:text-emerald-400 transition-colors" />
            </button>
          )}

          {/* Media Content Display */}
          {hasMedia ? (
            <div className="w-full h-full flex items-center justify-center p-1 sm:p-3 md:p-5 relative z-10">
              {isVideoMedia(post.image) ? (
                <div className="w-full h-full flex items-center justify-center max-w-6xl">
                  <CustomVideoPlayer
                    src={post.image || ''}
                    className="w-full max-h-[90vh] rounded-2xl shadow-2xl"
                    initialTime={initialTime}
                    viewsCount={post.viewsCount || 0}
                    autoPlay={true}
                    defaultMuted={false}
                    onTimeUpdate={onTimeUpdate}
                  />
                </div>
              ) : (
                <img
                  src={post.image}
                  alt="Publicación en pantalla completa"
                  className="w-full h-full max-w-full max-h-[92vh] object-contain rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-slate-700/60 transition-transform duration-300"
                />
              )}
            </div>
          ) : (
            /* Text-only post full screen quote card design */
            <div className="max-w-2xl w-full p-8 md:p-12 text-center space-y-6 relative z-10 animate-in zoom-in-95 duration-300">
              <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-indigo-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl">
                <Sparkles className="h-8 w-8 text-emerald-400 animate-pulse" />
              </div>

              {feelingObj && (
                <span className={cn('inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest shadow-md', feelingObj.color)}>
                  <span>{feelingObj.emoji}</span>
                  <span>{feelingObj.label}</span>
                </span>
              )}

              <blockquote className="text-xl md:text-2xl font-serif font-medium text-slate-100 leading-relaxed italic drop-shadow-md">
                "{post.content}"
              </blockquote>

              <p className="text-xs font-black uppercase tracking-widest text-emerald-400">
                — {post.authorName} ({post.authorRole})
              </p>
            </div>
          )}

        </div>

        {/* ─── RIGHT: DETAILS & COMMENTS PANEL (32% desktop width) ─── */}
        <div className="lg:w-[32%] w-full h-[45vh] lg:h-full bg-white border-t lg:border-t-0 lg:border-l border-slate-200/80 flex flex-col z-30 shadow-2xl">
          
          {/* Post Header */}
          <div className="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-11 w-11 rounded-2xl overflow-hidden shrink-0 border border-slate-200 shadow-sm bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
                {post.authorAvatar ? (
                  <img src={post.authorAvatar} alt={post.authorName} className="h-full w-full object-cover" />
                ) : (
                  `${post.authorName?.[0] || 'M'}`
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-slate-900 truncate">{post.authorName}</h3>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold text-slate-400">{post.authorRole}</span>
                  <span className="text-[10px] text-slate-300">•</span>
                  <span className="text-[10px] text-slate-400 font-medium">{formatTimeAgo(post.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Desktop Close button */}
            <button
              type="button"
              onClick={onClose}
              className="hidden lg:flex h-9 w-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 items-center justify-center transition-all cursor-pointer"
              title="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable Content & Comments Section */}
          <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5 custom-scrollbar">
            
            {/* Post text (if media post) */}
            {hasMedia && post.content && (
              <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-150 space-y-2">
                {feelingObj && (
                  <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold mb-1', feelingObj.color)}>
                    <span>{feelingObj.emoji}</span>
                    <span>{feelingObj.label}</span>
                  </span>
                )}
                <p className="text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap text-justify [text-justify:inter-word] [text-align-last:left]">
                  {post.content}
                </p>
              </div>
            )}

            {/* Interactive Stats & Like Button Bar */}
            <div className="flex items-center justify-between py-3 border-y border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => onLike(post.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer',
                  isLikedByMe
                    ? 'text-amber-600 bg-amber-50 border border-amber-200 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                )}
              >
                <Sun className={cn('h-4 w-4', isLikedByMe && 'fill-amber-500 text-amber-500 animate-spin-slow')} />
                <span>Iluminar ({post.likes?.length || 0})</span>
              </button>

              <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs">
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>{post.comments?.length || 0} resonancias</span>
              </div>
            </div>

            {/* Comments List Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sprout className="h-3.5 w-3.5 text-emerald-600" /> Resonancias de la comunidad
              </span>
            </div>

            {/* Comments Items */}
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    postId={post.id}
                    level={0}
                    onLikeComment={onLikeComment}
                    onAddReply={onAddReply}
                    onEditComment={onEditComment}
                    onDeleteComment={onDeleteComment}
                    myName={myName}
                    isAuthed={isAuthed}
                  />
                ))}
                <div ref={commentsEndRef} />
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200">
                Aún no hay resonancias en este destello. ¡Sé la primera persona en dejar tu reflexión! 🌿
              </div>
            )}

          </div>

          {/* Sticky Comment Box Footer */}
          <div className="p-4 border-t border-slate-100 bg-white shrink-0">
            {isAuthed ? (
              <form onSubmit={handleSubmitComment} className="flex items-center gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Sembrar una resonancia..."
                  className="flex-1 text-xs text-slate-800 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim() || submittingComment}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 disabled:opacity-40 text-white font-bold transition-all shadow-md cursor-pointer shrink-0"
                  title="Enviar resonancia"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <p className="text-center text-xs text-slate-400 font-bold py-1">
                Inicia sesión para dejar una resonancia 🌿
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
