import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Send,
  Sparkles,
  Pencil,
  Trash2,
  CornerDownRight,
  X,
  Share2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from 'lucide-react-native';
import { CustomVideoPlayer } from './CustomVideoPlayer';
import { SharePostModal } from './SharePostModal';

const { width } = Dimensions.get('window');

export interface CommentReplyItem {
  id: string;
  parentId?: string | number;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
  likesCount?: number;
  likedByMe?: boolean;
  likes?: string[];
  createdAt: string;
}

export interface CommentItem {
  id: string;
  parentId?: string | number;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
  likesCount?: number;
  likedByMe?: boolean;
  likes?: string[];
  replies?: CommentReplyItem[];
  createdAt: string;
}

export interface PostDetailItem {
  id: string;
  patientId?: number | null;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
  feeling?: string;
  image?: string;
  likes: string[];
  likesCount?: number;
  comments: CommentItem[];
  createdAt: string;
}

export function countTotalSembrados(comments?: CommentItem[]): number {
  if (!comments || !Array.isArray(comments)) return 0;
  let total = 0;
  for (const c of comments) {
    total += 1;
    if (c.replies && Array.isArray(c.replies)) {
      total += c.replies.length;
    }
  }
  return total;
}

interface PostDetailModalProps {
  visible: boolean;
  post: PostDetailItem | null;
  onClose: () => void;
  currentUser: any;
  isGuest: boolean;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => Promise<void>;
  onToggleLikeComment?: (commentId: string, postId: string) => void;
  onReplyComment?: (commentId: string, postId: string, text: string) => Promise<void>;
  onOpenUserProfile?: (name: string, avatar?: string, role?: string) => void;
  isAuthor?: boolean;
  onEditPost?: (post: PostDetailItem) => void;
  onDeletePost?: (postId: string) => void;
  onRequireAuth?: () => void;
}

const getInitials = (name?: string) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const getAvatarBgColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['#0D9488', '#0284C7', '#7C3AED', '#DB2777', '#EA580C', '#059669', '#4F46E5'];
  return colors[Math.abs(hash) % colors.length];
};

const isVideoMedia = (url?: string | null) => {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.endsWith('.mp4') ||
    lower.endsWith('.mov') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.m4v') ||
    lower.includes('youtube.com') ||
    lower.includes('youtu.be') ||
    lower.includes('vimeo.com')
  );
};

const renderContentWithMentions = (
  text: string,
  onOpenUserProfile?: (name: string, avatar?: string, role?: string) => void,
  textStyle?: any,
  mentionStyle?: any
) => {
  if (!text) return null;

  const regex = /(@[A-Za-z0-9_ÁÉÍÓÚáéíóúñÑüÜ]+(?:\s+[A-Za-z0-9_ÁÉÍÓÚáéíóúñÑüÜ]+)?)/g;
  const parts = text.split(regex);

  if (parts.length <= 1) {
    return <Text style={textStyle}>{text}</Text>;
  }

  return (
    <Text style={textStyle}>
      {parts.map((part, index) => {
        if (part && part.startsWith('@')) {
          const cleanName = part.slice(1).trim();
          return (
            <Text
              key={index}
              onPress={() => {
                if (onOpenUserProfile && cleanName) {
                  onOpenUserProfile(cleanName);
                }
              }}
              suppressHighlighting={false}
              style={mentionStyle || styles.mentionLinkText}
            >
              {part}
            </Text>
          );
        }
        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
};

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  visible,
  post,
  onClose,
  currentUser,
  isGuest,
  onToggleLike,
  onAddComment,
  onToggleLikeComment,
  onReplyComment,
  onOpenUserProfile,
  isAuthor,
  onEditPost,
  onDeletePost,
  onRequireAuth,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: string; authorName: string } | null>(null);
  const [collapsedReplies, setCollapsedReplies] = useState<Record<string, boolean>>({});
  const textInputRef = useRef<TextInput>(null);

  const toggleCollapseReplies = (commentId: string) => {
    setCollapsedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  if (!post) return null;

  const currentUserName = currentUser
    ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.username || 'Tú'
    : 'Miembro';

  const isLiked = currentUser && post.likes.includes(currentUserName);

  const handleSendComment = async () => {
    if (isGuest) {
      if (onRequireAuth) onRequireAuth();
      return;
    }
    if (!commentText.trim()) return;

    const textToSend = commentText.trim();
    setCommentText('');
    setIsSubmittingComment(true);
    try {
      if (replyingTo && onReplyComment) {
        await onReplyComment(replyingTo.id, post.id, textToSend);
        setReplyingTo(null);
      } else {
        await onAddComment(post.id, textToSend);
      }
    } catch (e) {
      console.warn('Error sending comment:', e);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleStartReply = (commentId: string, authorName: string) => {
    if (isGuest) {
      if (onRequireAuth) onRequireAuth();
      return;
    }
    setReplyingTo({ id: commentId, authorName });
    const mention = `@${authorName} `;
    setCommentText((prev) => {
      if (prev.startsWith('@')) {
        return `${mention}${prev.replace(/^@[^ ]+ /, '')}`;
      }
      return `${mention}${prev}`;
    });
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 100);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setCommentText((prev) => prev.replace(/^@[^ ]+ /, ''));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* TOP APP BAR */}
        <View style={styles.topAppBar}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft color="#0F172A" size={22} />
          </TouchableOpacity>
          <View style={styles.appBarTitleCol}>
            <Text style={styles.appBarTitle}>Destello de Luz</Text>
            <Text style={styles.appBarSubtitle}>Comunidad Conexión Luz</Text>
          </View>

          <View style={styles.headerAuthorActions}>
            <TouchableOpacity
              onPress={() => setShowShareModal(true)}
              style={styles.iconActionBtn}
              activeOpacity={0.7}
            >
              <Share2 color="#0284C7" size={18} />
            </TouchableOpacity>

            {isAuthor && (
              <>
                {onEditPost && (
                  <TouchableOpacity
                    onPress={() => {
                      onClose();
                      onEditPost(post);
                    }}
                    style={styles.iconActionBtn}
                  >
                    <Pencil color="#0284C7" size={18} />
                  </TouchableOpacity>
                )}
                {onDeletePost && (
                  <TouchableOpacity
                    onPress={() => onDeletePost(post.id)}
                    style={styles.iconActionBtn}
                  >
                    <Trash2 color="#EF4444" size={18} />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>

        {/* SCROLLABLE POST & CONVERSATION CONTENT */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* AUTHOR ROW */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (onOpenUserProfile) {
                onOpenUserProfile(post.authorName, post.authorAvatar, post.authorRole);
              }
            }}
            style={styles.authorCardRow}
          >
            {post.authorAvatar && !avatarError ? (
              <Image
                source={{ uri: post.authorAvatar }}
                style={styles.authorAvatarImg}
                resizeMode="cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <View style={[styles.authorFallbackAvatar, { backgroundColor: getAvatarBgColor(post.authorName) }]}>
                <Text style={styles.authorFallbackText}>{getInitials(post.authorName)}</Text>
              </View>
            )}

            <View style={styles.authorDetailsCol}>
              <Text style={styles.authorNameText}>{post.authorName}</Text>
              <View style={styles.authorRoleUnderNameRow}>
                <View
                  style={[
                    styles.rolePillUnderName,
                    (post.authorRole || '').toUpperCase().includes('GUÍA') ||
                    (post.authorRole || '').toUpperCase().includes('GUIA') ||
                    (post.authorRole || '').toUpperCase().includes('TERAPEUTA') ||
                    (post.authorRole || '').toUpperCase().includes('PSICÓLOG') ||
                    (post.authorRole || '').toUpperCase().includes('ADMIN')
                      ? styles.rolePillTherapist
                      : styles.rolePillMember,
                  ]}
                >
                  {(post.authorRole || '').toUpperCase().includes('GUÍA') ||
                  (post.authorRole || '').toUpperCase().includes('GUIA') ||
                  (post.authorRole || '').toUpperCase().includes('TERAPEUTA') ||
                  (post.authorRole || '').toUpperCase().includes('PSICÓLOG') ||
                  (post.authorRole || '').toUpperCase().includes('ADMIN') ? (
                    <ShieldCheck color="#047857" size={11} strokeWidth={2.5} />
                  ) : (
                    <Sparkles color="#64748B" size={10} strokeWidth={2.5} />
                  )}
                  <Text
                    style={[
                      styles.rolePillTextUnderName,
                      (post.authorRole || '').toUpperCase().includes('GUÍA') ||
                      (post.authorRole || '').toUpperCase().includes('GUIA') ||
                      (post.authorRole || '').toUpperCase().includes('TERAPEUTA') ||
                      (post.authorRole || '').toUpperCase().includes('PSICÓLOG') ||
                      (post.authorRole || '').toUpperCase().includes('ADMIN')
                        ? styles.rolePillTextTherapist
                        : styles.rolePillTextMember,
                    ]}
                  >
                    {(post.authorRole || '').toUpperCase().includes('GUÍA') ||
                    (post.authorRole || '').toUpperCase().includes('GUIA') ||
                    (post.authorRole || '').toUpperCase().includes('TERAPEUTA') ||
                    (post.authorRole || '').toUpperCase().includes('PSICÓLOG') ||
                    (post.authorRole || '').toUpperCase().includes('ADMIN')
                      ? 'Terapeuta'
                      : 'Miembro'}
                  </Text>
                </View>
              </View>
              <Text style={styles.timeAgoText}>{post.createdAt}</Text>
            </View>
          </TouchableOpacity>

          {/* EMOTION / FEELING PILL */}
          {post.feeling && (
            <View style={styles.feelingBadgeContainer}>
              <Text style={styles.feelingBadgeText}>🌱 {post.feeling}</Text>
            </View>
          )}

          {/* FULL POST TEXT */}
          {renderContentWithMentions(post.content, onOpenUserProfile, styles.fullContentText)}

          {/* POST MEDIA (VIDEO OR IMAGE) - FULL WIDTH */}
          {post.image && (
            <View style={styles.mediaContainer}>
              {isVideoMedia(post.image) ? (
                <CustomVideoPlayer
                  src={post.image}
                  fullBleed={true}
                  isActive={true}
                  autoPlay={true}
                  isMuted={false}
                  loop={true}
                  height={Math.round(width * 0.95)}
                  contentFit="contain"
                  style={{ width: width }}
                />
              ) : (
                <Image
                  source={{ uri: post.image }}
                  style={styles.fullPostImage}
                  resizeMode="cover"
                />
              )}
            </View>
          )}

          {/* STATS & ACTIONS BAR */}
          <View style={styles.statsBar}>
            <TouchableOpacity
              onPress={() => onToggleLike(post.id)}
              style={[styles.statActionBtn, isLiked && styles.statActionBtnLiked]}
              activeOpacity={0.8}
            >
              <Heart
                color={isLiked ? '#EF4444' : '#64748B'}
                size={18}
                fill={isLiked ? '#EF4444' : 'transparent'}
              />
              <Text style={[styles.statActionText, isLiked && styles.statActionTextLiked]}>
                {isLiked ? 'Iluminado' : 'Iluminar'} ({post.likes.length})
              </Text>
            </TouchableOpacity>

            <View style={styles.statActionBtn}>
              <MessageCircle color="#0D9488" size={18} />
              <Text style={[styles.statActionText, { color: '#0F766E' }]}>
                Sembrados ({countTotalSembrados(post.comments)})
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setShowShareModal(true)}
              style={styles.statActionBtn}
              activeOpacity={0.8}
            >
              <Share2 color="#0284C7" size={18} />
              <Text style={[styles.statActionText, { color: '#0369A1' }]}>
                Compartir
              </Text>
            </TouchableOpacity>
          </View>

          {/* COMMUNITY COMMENTS / SEMBRADOS SECTION */}
          <View style={styles.commentsContainer}>
            <View style={styles.commentsHeadingRow}>
              <Sparkles color="#059669" size={16} />
              <Text style={styles.commentsHeadingText}>PALABRAS SEMBRADAS & CONVERSACIÓN</Text>
            </View>

            {post.comments.length === 0 ? (
              <View style={styles.emptyCommentsBox}>
                <Text style={styles.emptyCommentsText}>
                  ✨ Aún no hay palabras sembradas. Sé el primero en sembrar tu sentir o reflexión.
                </Text>
              </View>
            ) : (
              post.comments.map((comment) => {
                const commentLiked = Boolean(comment.likedByMe);
                const commentLikesCount = comment.likesCount || 0;
                const replies = comment.replies || [];

                return (
                  <View key={comment.id} style={styles.commentThreadWrapper}>
                    <View style={styles.commentItem}>
                      <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={() => {
                          if (onOpenUserProfile) {
                            onOpenUserProfile(comment.authorName, comment.authorAvatar, comment.authorRole);
                          }
                        }}
                      >
                        {comment.authorAvatar ? (
                          <Image
                            source={{ uri: comment.authorAvatar }}
                            style={styles.commentAvatarImg}
                            resizeMode="cover"
                          />
                        ) : (
                          <View
                            style={[
                              styles.commentFallbackAvatar,
                              { backgroundColor: getAvatarBgColor(comment.authorName) },
                            ]}
                          >
                            <Text style={styles.commentFallbackText}>{getInitials(comment.authorName)}</Text>
                          </View>
                        )}
                      </TouchableOpacity>

                      <View style={styles.commentBubble}>
                        <View style={styles.commentHeaderCol}>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                              if (onOpenUserProfile) {
                                onOpenUserProfile(comment.authorName, comment.authorAvatar, comment.authorRole);
                              }
                            }}
                          >
                            <Text style={styles.commentAuthorName}>{comment.authorName}</Text>
                          </TouchableOpacity>
                          <View style={styles.authorRoleUnderNameRow}>
                            <View
                              style={[
                                styles.rolePillUnderName,
                                { paddingVertical: 1, paddingHorizontal: 5 },
                                (comment.authorRole || '').toUpperCase().includes('GUÍA') ||
                                (comment.authorRole || '').toUpperCase().includes('GUIA') ||
                                (comment.authorRole || '').toUpperCase().includes('TERAPEUTA') ||
                                (comment.authorRole || '').toUpperCase().includes('PSICÓLOG') ||
                                (comment.authorRole || '').toUpperCase().includes('ADMIN')
                                  ? styles.rolePillTherapist
                                  : styles.rolePillMember,
                              ]}
                            >
                              {(comment.authorRole || '').toUpperCase().includes('GUÍA') ||
                              (comment.authorRole || '').toUpperCase().includes('GUIA') ||
                              (comment.authorRole || '').toUpperCase().includes('TERAPEUTA') ||
                              (comment.authorRole || '').toUpperCase().includes('PSICÓLOG') ||
                              (comment.authorRole || '').toUpperCase().includes('ADMIN') ? (
                                <ShieldCheck color="#047857" size={10} strokeWidth={2.5} />
                              ) : (
                                <Sparkles color="#64748B" size={9} strokeWidth={2.5} />
                              )}
                              <Text
                                style={[
                                  styles.rolePillTextUnderName,
                                  { fontSize: 9 },
                                  (comment.authorRole || '').toUpperCase().includes('GUÍA') ||
                                  (comment.authorRole || '').toUpperCase().includes('GUIA') ||
                                  (comment.authorRole || '').toUpperCase().includes('TERAPEUTA') ||
                                  (comment.authorRole || '').toUpperCase().includes('PSICÓLOG') ||
                                  (comment.authorRole || '').toUpperCase().includes('ADMIN')
                                    ? styles.rolePillTextTherapist
                                    : styles.rolePillTextMember,
                                ]}
                              >
                                {(comment.authorRole || '').toUpperCase().includes('GUÍA') ||
                                (comment.authorRole || '').toUpperCase().includes('GUIA') ||
                                (comment.authorRole || '').toUpperCase().includes('TERAPEUTA') ||
                                (comment.authorRole || '').toUpperCase().includes('PSICÓLOG') ||
                                (comment.authorRole || '').toUpperCase().includes('ADMIN')
                                  ? 'Terapeuta'
                                  : 'Miembro'}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.commentTime}>{comment.createdAt}</Text>
                        </View>
                        {renderContentWithMentions(comment.content, onOpenUserProfile, styles.commentText)}

                        {/* COMMENT ACTIONS: ILUMINAR & SEMBRAR RESPUESTA */}
                        <View style={styles.commentActionsBar}>
                          <TouchableOpacity
                            onPress={() => {
                              if (isGuest) {
                                if (onRequireAuth) onRequireAuth();
                              } else if (onToggleLikeComment) {
                                onToggleLikeComment(comment.id, post.id);
                              }
                            }}
                            style={styles.commentActionMiniBtn}
                            activeOpacity={0.7}
                          >
                            <Heart
                              color={commentLiked ? '#EF4444' : '#94A3B8'}
                              size={14}
                              fill={commentLiked ? '#EF4444' : 'transparent'}
                            />
                            {commentLikesCount > 0 && (
                              <Text
                                style={[
                                  styles.commentActionMiniText,
                                  commentLiked && { color: '#EF4444', fontWeight: '800' },
                                ]}
                              >
                                {commentLikesCount}
                              </Text>
                            )}
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => handleStartReply(comment.id, comment.authorName)}
                            style={styles.commentActionMiniBtn}
                            activeOpacity={0.7}
                          >
                            <CornerDownRight color="#0D9488" size={13} />
                            <Text style={[styles.commentActionMiniText, { color: '#0D9488', fontWeight: '800' }]}>
                              Sembrar respuesta
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    {/* NESTED SUB-REPLIES WITH COLLAPSIBLE TOGGLE */}
                    {replies.length > 0 && (
                      <View style={styles.repliesBlockWrapper}>
                        <TouchableOpacity
                          onPress={() => toggleCollapseReplies(comment.id)}
                          style={styles.toggleRepliesBtn}
                          activeOpacity={0.7}
                        >
                          <View style={styles.toggleRepliesLine} />
                          <View style={styles.toggleRepliesRow}>
                            {collapsedReplies[comment.id] ? (
                              <>
                                <ChevronDown color="#0D9488" size={14} />
                                <Text style={styles.toggleRepliesText}>
                                  Ver {replies.length} {replies.length === 1 ? 'respuesta' : 'respuestas'}
                                </Text>
                              </>
                            ) : (
                              <>
                                <ChevronUp color="#64748B" size={14} />
                                <Text style={[styles.toggleRepliesText, { color: '#64748B' }]}>
                                  Ocultar {replies.length === 1 ? 'respuesta' : 'respuestas'}
                                </Text>
                              </>
                            )}
                          </View>
                        </TouchableOpacity>

                        {!collapsedReplies[comment.id] && (
                          <View style={styles.repliesNestedContainer}>
                            {replies.map((reply) => {
                              const replyLiked = Boolean(reply.likedByMe);
                              const replyLikesCount = reply.likesCount || 0;

                              return (
                                <View key={reply.id} style={styles.replyItem}>
                                  <TouchableOpacity
                                    activeOpacity={0.75}
                                    onPress={() => {
                                      if (onOpenUserProfile) {
                                        onOpenUserProfile(reply.authorName, reply.authorAvatar, reply.authorRole);
                                      }
                                    }}
                                  >
                                    {reply.authorAvatar ? (
                                      <Image
                                        source={{ uri: reply.authorAvatar }}
                                        style={styles.replyAvatarImg}
                                        resizeMode="cover"
                                      />
                                    ) : (
                                      <View
                                        style={[
                                          styles.replyFallbackAvatar,
                                          { backgroundColor: getAvatarBgColor(reply.authorName) },
                                        ]}
                                      >
                                        <Text style={styles.replyFallbackText}>{getInitials(reply.authorName)}</Text>
                                      </View>
                                    )}
                                  </TouchableOpacity>

                                  <View style={styles.replyBubble}>
                                    <View style={styles.commentHeaderCol}>
                                      <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => {
                                          if (onOpenUserProfile) {
                                            onOpenUserProfile(reply.authorName, reply.authorAvatar, reply.authorRole);
                                          }
                                        }}
                                      >
                                        <Text style={styles.commentAuthorName}>{reply.authorName}</Text>
                                      </TouchableOpacity>
                                      <View style={styles.authorRoleUnderNameRow}>
                                        <View
                                          style={[
                                            styles.rolePillUnderName,
                                            { paddingVertical: 1, paddingHorizontal: 5 },
                                            (reply.authorRole || '').toUpperCase().includes('GUÍA') ||
                                            (reply.authorRole || '').toUpperCase().includes('GUIA') ||
                                            (reply.authorRole || '').toUpperCase().includes('TERAPEUTA') ||
                                            (reply.authorRole || '').toUpperCase().includes('PSICÓLOG') ||
                                            (reply.authorRole || '').toUpperCase().includes('ADMIN')
                                              ? styles.rolePillTherapist
                                              : styles.rolePillMember,
                                          ]}
                                        >
                                          {(reply.authorRole || '').toUpperCase().includes('GUÍA') ||
                                          (reply.authorRole || '').toUpperCase().includes('GUIA') ||
                                          (reply.authorRole || '').toUpperCase().includes('TERAPEUTA') ||
                                          (reply.authorRole || '').toUpperCase().includes('PSICÓLOG') ||
                                          (reply.authorRole || '').toUpperCase().includes('ADMIN') ? (
                                            <ShieldCheck color="#047857" size={9} strokeWidth={2.5} />
                                          ) : (
                                            <Sparkles color="#64748B" size={8} strokeWidth={2.5} />
                                          )}
                                          <Text
                                            style={[
                                              styles.rolePillTextUnderName,
                                              { fontSize: 8.5 },
                                              (reply.authorRole || '').toUpperCase().includes('GUÍA') ||
                                              (reply.authorRole || '').toUpperCase().includes('GUIA') ||
                                              (reply.authorRole || '').toUpperCase().includes('TERAPEUTA') ||
                                              (reply.authorRole || '').toUpperCase().includes('PSICÓLOG') ||
                                              (reply.authorRole || '').toUpperCase().includes('ADMIN')
                                                ? styles.rolePillTextTherapist
                                                : styles.rolePillTextMember,
                                            ]}
                                          >
                                            {(reply.authorRole || '').toUpperCase().includes('GUÍA') ||
                                            (reply.authorRole || '').toUpperCase().includes('GUIA') ||
                                            (reply.authorRole || '').toUpperCase().includes('TERAPEUTA') ||
                                            (reply.authorRole || '').toUpperCase().includes('PSICÓLOG') ||
                                            (reply.authorRole || '').toUpperCase().includes('ADMIN')
                                              ? 'Terapeuta'
                                              : 'Miembro'}
                                          </Text>
                                        </View>
                                      </View>
                                      <Text style={styles.commentTime}>{reply.createdAt}</Text>
                                    </View>
                                    {renderContentWithMentions(reply.content, onOpenUserProfile, styles.commentText)}

                                    {/* REPLY LIKE & REPLY BUTTONS */}
                                    <View style={styles.commentActionsBar}>
                                      <TouchableOpacity
                                        onPress={() => {
                                          if (isGuest) {
                                            if (onRequireAuth) onRequireAuth();
                                          } else if (onToggleLikeComment) {
                                            onToggleLikeComment(reply.id, post.id);
                                          }
                                        }}
                                        style={styles.commentActionMiniBtn}
                                        activeOpacity={0.7}
                                      >
                                        <Heart
                                          color={replyLiked ? '#EF4444' : '#94A3B8'}
                                          size={13}
                                          fill={replyLiked ? '#EF4444' : 'transparent'}
                                        />
                                        {replyLikesCount > 0 && (
                                          <Text
                                            style={[
                                              styles.commentActionMiniText,
                                              replyLiked && { color: '#EF4444', fontWeight: '800' },
                                            ]}
                                          >
                                            {replyLikesCount}
                                          </Text>
                                        )}
                                      </TouchableOpacity>

                                      <TouchableOpacity
                                        onPress={() => handleStartReply(comment.id, reply.authorName)}
                                        style={styles.commentActionMiniBtn}
                                        activeOpacity={0.7}
                                      >
                                        <CornerDownRight color="#0D9488" size={12} />
                                        <Text style={[styles.commentActionMiniText, { color: '#0D9488', fontWeight: '800' }]}>
                                          Sembrar respuesta
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </View>
                              );
                            })}
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* BOTTOM FIXED COMMENT INPUT BAR */}
        <View style={styles.bottomInputContainer}>
          {replyingTo && (
            <View style={styles.replyingToBanner}>
              <View style={styles.replyingToLeft}>
                <CornerDownRight color="#059669" size={14} />
                <Text style={styles.replyingToText}>
                  Sembrando respuesta a <Text style={{ fontWeight: '900' }}>@{replyingTo.authorName}</Text>
                </Text>
              </View>
              <TouchableOpacity onPress={handleCancelReply} style={styles.cancelReplyBtn}>
                <X color="#64748B" size={14} />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.bottomInputBar}>
            <TextInput
              ref={textInputRef}
              value={commentText}
              onChangeText={setCommentText}
              placeholder={
                replyingTo
                  ? `Sembrar respuesta a @${replyingTo.authorName}...`
                  : 'Siembra una palabra o reflexión consciente...'
              }
              placeholderTextColor="#94A3B8"
              multiline
              style={styles.inputField}
            />
            <TouchableOpacity
              onPress={handleSendComment}
              disabled={!commentText.trim() || isSubmittingComment}
              style={[
                styles.sendBtn,
                (!commentText.trim() || isSubmittingComment) && styles.sendBtnDisabled,
              ]}
              activeOpacity={0.85}
            >
              {isSubmittingComment ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Send color="#FFFFFF" size={16} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <SharePostModal
          visible={showShareModal}
          onClose={() => setShowShareModal(false)}
          postId={post.id}
          postContent={post.content}
          authorName={post.authorName}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topAppBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 52 : 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appBarTitleCol: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  appBarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  appBarSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  headerAuthorActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  authorCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  authorAvatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
  },
  authorFallbackAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorFallbackText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
  },
  authorDetailsCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  authorNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  authorRoleUnderNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  rolePillUnderName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rolePillTherapist: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  rolePillMember: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rolePillTextUnderName: {
    fontSize: 10,
    fontWeight: '800',
  },
  rolePillTextTherapist: {
    color: '#047857',
  },
  rolePillTextMember: {
    color: '#64748B',
  },
  timeAgoText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  feelingBadgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  feelingBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  fullContentText: {
    fontSize: 16,
    lineHeight: 25,
    color: '#1E293B',
    marginBottom: 16,
  },
  mediaContainer: {
    marginHorizontal: -16,
    width: width,
    backgroundColor: '#020617',
    marginBottom: 16,
    overflow: 'hidden',
  },
  fullPostImage: {
    width: width,
    height: Math.round(width * 0.95),
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    gap: 8,
  },
  statActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statActionBtnLiked: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECDD3',
  },
  statActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  statActionTextLiked: {
    color: '#E11D48',
  },
  commentsContainer: {
    marginTop: 4,
    gap: 12,
  },
  commentsHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  commentsHeadingText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.8,
  },
  emptyCommentsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emptyCommentsText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  commentThreadWrapper: {
    marginBottom: 12,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  commentAvatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    marginTop: 2,
  },
  commentFallbackAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  commentFallbackText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  commentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentHeaderCol: {
    marginBottom: 6,
    gap: 1,
  },
  commentAuthorName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  commentTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
  commentText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#334155',
  },
  mentionLinkText: {
    color: '#0D9488',
    fontWeight: '800',
  },
  commentActionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  commentActionMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
  },
  commentActionMiniText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  repliesBlockWrapper: {
    marginLeft: 36,
    marginTop: 6,
  },
  toggleRepliesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 8,
  },
  toggleRepliesLine: {
    width: 20,
    height: 1.5,
    backgroundColor: '#CBD5E1',
    borderRadius: 1,
  },
  toggleRepliesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toggleRepliesText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0D9488',
  },
  repliesNestedContainer: {
    marginTop: 6,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#CBD5E1',
    gap: 8,
  },
  replyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  replyAvatarImg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    marginTop: 2,
  },
  replyFallbackAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  replyFallbackText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 10,
  },
  replyBubble: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bottomInputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  replyingToBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#A7F3D0',
  },
  replyingToLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  replyingToText: {
    fontSize: 11,
    color: '#065F46',
  },
  cancelReplyBtn: {
    padding: 4,
  },
  bottomInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    gap: 10,
  },
  inputField: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 13,
    color: '#0F172A',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.5,
  },
});
