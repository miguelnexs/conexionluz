import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/api/client';

export interface CommentReply {
  id: string;
  patientId?: number | null;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
  createdAt: string;
  likes: string[];
}

export interface Comment {
  id: string;
  patientId?: number | null;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
  createdAt: string;
  likes: string[];
  replies?: CommentReply[];
}

export interface Post {
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
  isSystemPost?: boolean;
  isLocal?: boolean;
}

const CACHE_KEY = 'conexionluz:feed_posts';
const INITIAL_BATCH_SIZE = 6;
const BATCH_INCREMENT = 4;

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

const getCachedPosts = (): Post[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

function dataURItoBlob(dataURI: string): Blob {
  const parts = dataURI.split(',');
  const byteString = atob(parts[1]);
  const mimeString = parts[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

export const safeSaveFeedPosts = (posts: Post[]) => {
  if (typeof window === 'undefined') return;
  try {
    const recentPosts = posts.slice(0, 15);
    const safePosts = recentPosts.map(p => {
      if (p.image && (p.image.startsWith('data:') || p.image.startsWith('blob:') || p.image.length > 20000)) {
        return { ...p, image: undefined };
      }
      return p;
    });
    localStorage.setItem(CACHE_KEY, JSON.stringify(safePosts));
  } catch (e) {
    try {
      localStorage.removeItem(CACHE_KEY);
      const minimalPosts = posts.slice(0, 5).map(p => ({
        id: String(p.id),
        authorName: p.authorName,
        content: p.content,
        createdAt: p.createdAt,
        likes: [],
        comments: []
      }));
      localStorage.setItem(CACHE_KEY, JSON.stringify(minimalPosts));
    } catch {
      // Ignore quota exceptions safely
    }
  }
};

const saveCachedPosts = (posts: Post[]) => {
  safeSaveFeedPosts(posts);
};

const mapBackendComment = (c: any, myName: string): Comment => {
  const commentLikes: string[] = Array.isArray(c.likes)
    ? c.likes
    : (c.likedByMe && myName ? [myName] : []);
  const remainingLikes = (c.likesCount || 0) - commentLikes.length;
  for (let i = 0; i < remainingLikes; i++) {
    if (!commentLikes.includes(`Usuario ${i}`)) {
      commentLikes.push(`Usuario ${i}`);
    }
  }

  return {
    id: String(c.id),
    patientId: c.patientId || null,
    authorName: c.authorName || 'Miembro',
    authorAvatar: c.authorAvatarUrl || c.authorAvatar || undefined,
    authorRole: c.authorRole || 'Miembro',
    content: c.content || '',
    createdAt: c.createdAt ? formatRelativeTime(c.createdAt) : 'Hace un momento',
    likes: commentLikes,
    replies: Array.isArray(c.replies) ? c.replies.map((r: any) => mapBackendComment(r, myName)) : []
  };
};

const mapBackendPost = (p: any, myName: string): Post => {
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
    patientId: p.patientId || null,
    authorName: p.authorName || 'Miembro',
    authorAvatar: p.authorAvatarUrl || p.authorAvatar || undefined,
    authorRole: p.authorRole || 'Miembro',
    content: p.content || '',
    feeling: p.feeling || undefined,
    image: p.imageUrl || undefined,
    likes: likesList,
    viewsCount: typeof p.viewsCount === 'number' ? p.viewsCount : (p.views_count || 0),
    comments: p.comments
      ? p.comments.map((c: any) => mapBackendComment(c, myName))
      : [],
    createdAt: p.createdAt ? formatRelativeTime(p.createdAt) : 'Hace un momento'
  };
};

export const useCommunityPosts = (me: any | null, isAuthed: boolean) => {
  const [posts, setPosts] = useState<Post[]>(getCachedPosts);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH_SIZE);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const myName = me ? `${me.firstName || ''} ${me.lastName || ''}`.trim() : '';

  // Function to persist & update local posts state
  const updatePostsState = useCallback((newPosts: Post[]) => {
    setPosts(newPosts);
    saveCachedPosts(newPosts);
  }, []);

  // Fetch posts from backend with Stale-While-Revalidate pattern
  const refreshPosts = useCallback(async () => {
    setIsSyncing(true);
    try {
      const endpoint = isAuthed ? '/api/portal/community-posts/' : '/api/public/community-posts/';
      let res = await api.get<any[]>(endpoint);
      
      // Fallback if portal endpoint fails
      if (!res.ok && isAuthed) {
        res = await api.get<any[]>('/api/public/community-posts/');
      }

      if (res.ok && Array.isArray(res.data)) {
        const fetched = res.data.map(p => mapBackendPost(p, myName));
        setPosts(prevPosts => {
          const pendingLocals = prevPosts.filter(p => p.isLocal && !fetched.some(f => f.id === p.id || (f.content === p.content && f.authorName === p.authorName)));
          const combined = [...pendingLocals, ...fetched];
          saveCachedPosts(combined);
          return combined;
        });
      }
    } catch (err) {
      console.error('Error refreshing community posts:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [isAuthed, myName, updatePostsState]);

  // Initial mount load
  useEffect(() => {
    refreshPosts();
  }, [isAuthed]); // Removed 'me' to avoid duplicate refetching loop!

  // Reveal next batch of posts for infinite scroll
  const loadMore = useCallback(() => {
    if (isFetchingMore) return;
    setIsFetchingMore(true);
    // Instant or next-tick update so UI never blocks
    requestAnimationFrame(() => {
      setVisibleCount(prev => prev + BATCH_INCREMENT);
      setIsFetchingMore(false);
    });
  }, [isFetchingMore]);

  // IntersectionObserver for seamless infinite scrolling 300px before end of page
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, posts.length]);

  // Post Creation with Backend Storage & Media Persistence
  const createPost = useCallback(async (
    content: string,
    imageUrl?: string,
    feeling?: string,
    mediaFile?: File | null,
    onUploadProgress?: (percent: number) => void,
    signal?: AbortSignal
  ): Promise<{ ok: boolean; error?: string }> => {
    const authorName = myName || 'Miembro';
    const authorAvatar = me?.profilePictureUrl || '';
    const authorRole = me?.hasActiveSubscription ? 'Miembro Premium' : 'Miembro';

    const tempId = `temp-${Date.now()}`;
    const tempPost: Post = {
      id: tempId,
      authorName,
      authorAvatar,
      authorRole,
      content: content.trim(),
      feeling: feeling || undefined,
      image: imageUrl || undefined,
      likes: [],
      comments: [],
      createdAt: 'Hace un momento',
      isLocal: true
    };

    // 1. Show immediate optimistic preview in UI
    updatePostsState([tempPost, ...posts]);

    if (isAuthed) {
      try {
        let response;
        if (mediaFile) {
          // Direct file upload — never read file into memory as DataURL/blob
          const formData = new FormData();
          formData.append('content', content.trim());
          if (feeling) formData.append('feeling', feeling);
          formData.append('file', mediaFile);
          response = await api.postFormWithProgress<any>('/api/portal/community-posts/', formData, onUploadProgress, signal);
        } else if (imageUrl && imageUrl.startsWith('data:')) {
          // DataURL images (small compressed images only) — upload as blob
          const formData = new FormData();
          formData.append('content', content.trim());
          if (feeling) formData.append('feeling', feeling);
          try {
            const blob = dataURItoBlob(imageUrl);
            formData.append('file', blob, `media_${Date.now()}.jpg`);
            response = await api.postFormWithProgress<any>('/api/portal/community-posts/', formData, onUploadProgress, signal);
          } catch {
            // Fallback: send as plain JSON
            response = await api.post<any>('/api/portal/community-posts/', {
              content: content.trim(),
              imageUrl: imageUrl.length < 500000 ? imageUrl : undefined,
              feeling: feeling || undefined
            });
          }
        } else {
          // Plain URL or no media
          response = await api.post<any>('/api/portal/community-posts/', {
            content: content.trim(),
            imageUrl: imageUrl || undefined,
            feeling: feeling || undefined
          });
        }

        if (signal?.aborted) {
          updatePostsState(posts.filter(p => p.id !== tempId));
          return { ok: false, error: 'Subida cancelada.' };
        }

        if (response.ok && response.data) {
          const savedPost = mapBackendPost(response.data, myName);
          // Replace temp post with server-persisted post (with permanent media URL)
          const updated = posts.map(p => p.id === tempId ? savedPost : p);
          if (!updated.some(p => p.id === savedPost.id)) {
            updatePostsState([savedPost, ...posts.filter(p => p.id !== tempId)]);
          } else {
            updatePostsState(updated);
          }
          await refreshPosts();
          return { ok: true };
        } else {
          const errorMsg = !response.ok ? (response as any).error : 'Error al guardar en el servidor.';
          console.error("Backend error creating post:", errorMsg);
          updatePostsState(posts.filter(p => p.id !== tempId));
          return { ok: false, error: errorMsg };
        }
      } catch (err: any) {
        console.error("Error sending post to backend:", err);
        updatePostsState(posts.filter(p => p.id !== tempId));
        return { ok: false, error: err?.message || "Error al enviar la publicación." };
      }
    }

    return { ok: true };
  }, [isAuthed, myName, me, posts, refreshPosts, updatePostsState]);

  // Optimistic Like / Illuminate Post
  const likePost = useCallback(async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Optimistic UI update
    const isLiked = post.likes.includes(myName);
    const updatedLikes = isLiked
      ? post.likes.filter(name => name !== myName)
      : [...post.likes, myName];

    const updated = posts.map(p => p.id === postId ? { ...p, likes: updatedLikes } : p);
    updatePostsState(updated);

    if (isAuthed && !post.isLocal && !isNaN(Number(postId))) {
      const response = await api.post<any>(`/api/portal/community-posts/${postId}/like/`, {});
      if (!response.ok) {
        // Rollback on failure
        updatePostsState(posts);
      }
    }
  }, [posts, myName, isAuthed, updatePostsState]);

  // Optimistic Add Comment / Resonancia
  const addComment = useCallback(async (postId: string, commentText: string) => {
    if (!commentText.trim()) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const authorAvatar = me?.profilePictureUrl || '';
    const authorRole = me?.hasActiveSubscription ? 'Miembro Premium' : 'Miembro';

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      authorName: myName || 'Miembro',
      authorAvatar,
      authorRole,
      content: commentText.trim(),
      createdAt: 'Hace un momento',
      likes: [],
      replies: []
    };

    const updated = posts.map(p =>
      p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
    );
    updatePostsState(updated);

    if (isAuthed && !post.isLocal && !isNaN(Number(postId))) {
      const response = await api.post<any>(`/api/portal/community-posts/${postId}/comment/`, {
        content: commentText.trim()
      });
      if (response.ok) {
        await refreshPosts();
      }
    }
  }, [posts, me, myName, isAuthed, updatePostsState, refreshPosts]);

  // Edit Post
  const editPost = useCallback(async (postId: string, newContent: string, newImage?: string | null) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const updatedImg = newImage !== undefined ? (newImage || '') : (post.image || '');

    const updated = posts.map(p =>
      p.id === postId ? { ...p, content: newContent.trim(), image: updatedImg } : p
    );
    updatePostsState(updated);

    if (isAuthed && !post.isLocal && !isNaN(Number(postId))) {
      const res = await api.patch<any>(`/api/portal/community-posts/${postId}/`, {
        content: newContent.trim(),
        imageUrl: updatedImg
      });
      if (res.ok) {
        await refreshPosts();
      }
    }
  }, [posts, isAuthed, updatePostsState, refreshPosts]);

  // Delete Post
  const deletePost = useCallback(async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const updated = posts.filter(p => p.id !== postId);
    updatePostsState(updated);

    if (isAuthed && !post.isLocal && !isNaN(Number(postId))) {
      await api.del<any>(`/api/portal/community-posts/${postId}/`);
    }
  }, [posts, isAuthed, updatePostsState]);

  // Recursive Tree Helpers
  const toggleLikeInTree = (list: Comment[], targetId: string, username: string): Comment[] => {
    return list.map(c => {
      if (String(c.id) === String(targetId)) {
        const isLiked = (c.likes || []).includes(username);
        const newLikes = isLiked
          ? (c.likes || []).filter(name => name !== username)
          : [...(c.likes || []), username];
        return { ...c, likes: newLikes };
      }
      if (c.replies && c.replies.length > 0) {
        return { ...c, replies: toggleLikeInTree(c.replies as any, targetId, username) as any };
      }
      return c;
    });
  };

  const addReplyInTree = (list: Comment[], targetId: string, newReply: Comment): Comment[] => {
    return list.map(c => {
      if (String(c.id) === String(targetId)) {
        const existingReplies = c.replies || [];
        return { ...c, replies: [...existingReplies, newReply] };
      }
      if (c.replies && c.replies.length > 0) {
        return { ...c, replies: addReplyInTree(c.replies as any, targetId, newReply) as any };
      }
      return c;
    });
  };

  const editCommentInTree = (list: Comment[], targetId: string, newText: string): Comment[] => {
    return list.map(c => {
      if (String(c.id) === String(targetId)) {
        return { ...c, content: newText };
      }
      if (c.replies && c.replies.length > 0) {
        return { ...c, replies: editCommentInTree(c.replies as any, targetId, newText) as any };
      }
      return c;
    });
  };

  const deleteCommentInTree = (list: Comment[], targetId: string): Comment[] => {
    return list
      .filter(c => String(c.id) !== String(targetId))
      .map(c => {
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: deleteCommentInTree(c.replies as any, targetId) as any };
        }
        return c;
      });
  };

  // Edit Comment (Recursive at any depth)
  const editComment = useCallback(async (postId: string, commentId: string, newContent: string) => {
    const cleanId = String(commentId).replace('comment-', '').replace('reply-', '');

    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: editCommentInTree(p.comments, commentId, newContent.trim()) };
      }
      return p;
    });
    updatePostsState(updated);

    if (!isNaN(Number(cleanId))) {
      await api.patch(`/api/portal/community-posts/comments/${cleanId}/`, {
        content: newContent.trim()
      });
    }
  }, [posts, updatePostsState]);

  // Delete Comment (Recursive at any depth)
  const deleteComment = useCallback(async (postId: string, commentId: string) => {
    const cleanId = String(commentId).replace('comment-', '').replace('reply-', '');

    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: deleteCommentInTree(p.comments, commentId) };
      }
      return p;
    });
    updatePostsState(updated);

    if (!isNaN(Number(cleanId))) {
      await api.delete(`/api/portal/community-posts/comments/${cleanId}/`);
    }
  }, [posts, updatePostsState]);

  // Like / Illuminate Comment (Recursive at any depth)
  const likeComment = useCallback(async (postId: string, commentId: string) => {
    const userIdentifier = myName || 'Usuario';
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: toggleLikeInTree(p.comments, commentId, userIdentifier) };
      }
      return p;
    });
    updatePostsState(updated);

    const cleanId = String(commentId).replace('comment-', '').replace('reply-', '');
    if (isAuthed && !isNaN(Number(cleanId))) {
      await api.post(`/api/portal/community-posts/comments/${cleanId}/like/`, {});
    }
  }, [posts, myName, isAuthed, updatePostsState]);

  // Add Reply to Comment (Recursive at any depth)
  const addReply = useCallback(async (postId: string, commentId: string, replyText: string) => {
    if (!replyText.trim()) return;

    const authorAvatar = me?.profilePictureUrl || '';
    const authorRole = me?.hasActiveSubscription ? 'Miembro Premium' : 'Miembro';

    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      authorName: myName || 'Miembro',
      authorAvatar,
      authorRole,
      content: replyText.trim(),
      createdAt: 'Hace un momento',
      likes: [],
      replies: []
    };

    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: addReplyInTree(p.comments, commentId, newReply) };
      }
      return p;
    });
    updatePostsState(updated);

    const cleanId = String(commentId).replace('comment-', '').replace('reply-', '');
    if (isAuthed && !isNaN(Number(cleanId))) {
      const res = await api.post<any>(`/api/portal/community-posts/comments/${cleanId}/reply/`, {
        content: replyText.trim()
      });
      if (res.ok) {
        await refreshPosts();
      }
    }
  }, [posts, me, myName, isAuthed, updatePostsState, refreshPosts]);

  // Track video reproduction / post views with deduplication
  const viewedPostsRef = useRef<Set<string>>(new Set());

  const trackPostView = useCallback(async (postId: string) => {
    if (!postId || viewedPostsRef.current.has(String(postId))) return;
    viewedPostsRef.current.add(String(postId));

    // Optimistic UI update
    setPosts(prevPosts => {
      const updated = prevPosts.map(p => {
        if (String(p.id) === String(postId)) {
          return { ...p, viewsCount: (p.viewsCount || 0) + 1 };
        }
        return p;
      });
      saveCachedPosts(updated);
      return updated;
    });

    try {
      const cleanId = String(postId).replace('temp-', '');
      if (!isNaN(Number(cleanId))) {
        await api.post(`/api/public/community-posts/${cleanId}/view/`, {});
      }
    } catch (err) {
      console.warn('Error tracking post view:', err);
    }
  }, []);

  return {
    posts,
    displayedPosts: posts.slice(0, visibleCount),
    totalPosts: posts.length,
    visibleCount,
    hasMore: visibleCount < posts.length,
    isSyncing,
    isFetchingMore,
    sentinelRef,
    loadMore,
    refreshPosts,
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
  };
};
