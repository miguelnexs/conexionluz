import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
  Alert,
  Share,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Sparkles,
  Heart,
  MessageCircle,
  Clock,
  User,
  Share2,
  Lock,
  Unlock,
  CheckCircle2,
  Calendar,
  Send,
  Sparkle,
  Type,
  Sun,
  Moon,
  ChevronRight,
  BookOpen,
} from 'lucide-react-native';
import { mobileApi, normalizeMediaUrl } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ALL_MASTER_STORIES, StoryItem, StoryComment } from '../data/storiesData';

const { width } = Dimensions.get('window');

type ReadingTheme = 'light' | 'sepia' | 'dark';

export default function HistoriaDetalleScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { user: me, isAuthenticated: isAuthed } = useAuth();

  const [story, setStory] = useState<StoryItem>(ALL_MASTER_STORIES[0]);
  const [loading, setLoading] = useState<boolean>(true);

  // Reading Mode Customizations
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>('light');
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0); // -2 to +4

  // Likes and Comments
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(story.likesCount || 0);
  const [comments, setComments] = useState<StoryComment[]>([]);
  const [commentText, setCommentText] = useState<string>('');
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);

  // Lumis / Unlock State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  const [userBalance, setUserBalance] = useState<number>(150);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);

  useEffect(() => {
    const loadStory = async () => {
      try {
        setLoading(true);
        // Find local fallback
        const found =
          ALL_MASTER_STORIES.find((s) => s.slug === slug || String(s.id) === String(slug)) ||
          ALL_MASTER_STORIES[0];
        setStory(found);
        setLikesCount(found.likesCount || 0);
        setComments(found.comments || []);
        setIsUnlocked(true);

        if (isAuthed) {
          try {
            const wRes = await mobileApi.fetchLumiWallet();
            if (wRes.ok && wRes.data) {
              setUserBalance(wRes.data.balance ?? 150);
            }
          } catch {}

          // Fetch story detail and fresh comments from backend
          try {
            const res = await mobileApi.fetchStoryDetail(found.id);
            if (res.ok && res.data) {
              const backendStory = res.data;
              if (backendStory.likesCount !== undefined) {
                setLikesCount(backendStory.likesCount);
              }
              if (Array.isArray(backendStory.comments) && backendStory.comments.length > 0) {
                const mappedComments: StoryComment[] = backendStory.comments.map((c: any) => ({
                  id: c.id,
                  authorName: c.authorName || c.author_name || 'Miembro de Conexión Luz',
                  authorRole: 'Miembro de la Comunidad',
                  content: c.content,
                  createdAt: c.createdAt || 'Reciente',
                }));
                setComments(mappedComments);
              }
            }
          } catch {}
        }
      } catch (e) {
        console.warn('Error loading story detail:', e);
      } finally {
        setLoading(false);
      }
    };

    loadStory();
  }, [slug, isAuthed]);

  const handleToggleLike = async () => {
    if (!isAuthed) {
      Alert.alert('Inicia sesión', 'Inicia sesión para dejar tu reacción de apoyo.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ir a Mi Perfil', onPress: () => router.push('/(tabs)/profile' as any) },
      ]);
      return;
    }

    const nextLiked = !hasLiked;
    setHasLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await mobileApi.likeStory(story.id);
    } catch {}
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    if (!isAuthed) {
      Alert.alert('Inicia sesión', 'Inicia sesión para compartir tu testimonio o comentario.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ir a Mi Perfil', onPress: () => router.push('/(tabs)/profile' as any) },
      ]);
      return;
    }

    const newComm: StoryComment = {
      id: Date.now().toString(),
      authorName: me ? `${me.firstName || ''} ${me.lastName || ''}`.trim() || 'Tú' : 'Tú',
      authorRole: 'Miembro Verificado',
      content: commentText.trim(),
      createdAt: 'Hace un momento',
      likesCount: 0,
    };

    setComments((prev) => [newComm, ...prev]);
    const toSend = commentText.trim();
    setCommentText('');

    try {
      setIsSubmittingComment(true);
      await mobileApi.commentStory(story.id, toSend);
    } catch {
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleUnlockStory = async () => {
    if (!isAuthed) {
      Alert.alert('Inicia sesión', 'Inicia sesión para canjear tus Lumis y desbloquear este relato.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ir a Mi Perfil', onPress: () => router.push('/(tabs)/profile' as any) },
      ]);
      return;
    }

    const price = story.priceLumis || 15;
    if (userBalance < price) {
      Alert.alert(
        'Saldo Insuficiente de Lumis',
        `Requieres ✨ ${price} Lumis para desbloquear esta historia. Tu saldo actual es ✨ ${userBalance} Lumis.`
      );
      return;
    }

    setIsUnlocking(true);
    try {
      const res = await mobileApi.spendLumis(
        'story',
        `story-${story.id}`,
        price,
        `Desbloqueo de Historia: ${story.title}`
      );

      if (res.ok && res.data) {
        const newBal = res.data.balance ?? Math.max(0, userBalance - price);
        setUserBalance(newBal);
        setIsUnlocked(true);
        Alert.alert('🎉 ¡Historia Desbloqueada!', 'Has desbloqueado el relato completo.');
      } else {
        Alert.alert('Error', res.error || 'No se pudo completar el canje de Lumis');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Error al desbloquear');
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleShareStory = async () => {
    try {
      await Share.share({
        message: `✨ Estoy leyendo "${story.title}" en Conexión Luz®. Un relato transformacional para sanar el alma: https://conexionluz.com/historias/${story.slug || story.id}`,
        title: story.title,
      });
    } catch {}
  };

  const relatedStories = useMemo(() => {
    return ALL_MASTER_STORIES.filter((s) => s.id !== story.id).slice(0, 3);
  }, [story]);

  // Reading styles based on theme and font size
  const themeColors = {
    light: {
      bg: '#F8FAFC',
      cardBg: '#FFFFFF',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      borderColor: '#E2E8F0',
      quoteBg: '#F5F3FF',
      quoteBorder: '#7C3AED',
      quoteText: '#4C1D95',
    },
    sepia: {
      bg: '#FBF0D9',
      cardBg: '#F4E8C1',
      textPrimary: '#2D2013',
      textSecondary: '#5C4A33',
      borderColor: '#E4D5A7',
      quoteBg: '#EFE0B6',
      quoteBorder: '#B45309',
      quoteText: '#451A03',
    },
    dark: {
      bg: '#0B0F17',
      cardBg: '#131B2E',
      textPrimary: '#F1F5F9',
      textSecondary: '#94A3B8',
      borderColor: '#1E293B',
      quoteBg: '#1E1B4B',
      quoteBorder: '#818CF8',
      quoteText: '#E0E7FF',
    },
  }[readingTheme];

  const baseFontSize = 14 + fontSizeOffset;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.bg, paddingTop: topPadding }]}>
      <StatusBar
        barStyle={readingTheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={themeColors.cardBg}
        translucent={true}
      />

      {/* ===== 1. TOP READER HEADER ===== */}
      <View
        style={[
          styles.header,
          { backgroundColor: themeColors.cardBg, borderBottomColor: themeColors.borderColor },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.headerIconBtn, { backgroundColor: readingTheme === 'dark' ? '#1E293B' : '#F1F5F9' }]}
          activeOpacity={0.7}
        >
          <ArrowLeft color={themeColors.textPrimary} size={20} />
        </TouchableOpacity>

        <View style={styles.headerControls}>
          {/* THEME SWITCHER */}
          <TouchableOpacity
            onPress={() => {
              if (readingTheme === 'light') setReadingTheme('sepia');
              else if (readingTheme === 'sepia') setReadingTheme('dark');
              else setReadingTheme('light');
            }}
            style={[styles.headerControlPill, { borderColor: themeColors.borderColor }]}
          >
            {readingTheme === 'dark' ? (
              <Moon color="#FDE047" size={14} />
            ) : readingTheme === 'sepia' ? (
              <Sun color="#B45309" size={14} />
            ) : (
              <Sun color="#64748B" size={14} />
            )}
            <Text style={[styles.controlText, { color: themeColors.textPrimary }]}>
              {readingTheme.toUpperCase()}
            </Text>
          </TouchableOpacity>

          {/* FONT SIZE TOGGLE */}
          <TouchableOpacity
            onPress={() => {
              setFontSizeOffset((prev) => (prev >= 4 ? -2 : prev + 2));
            }}
            style={[styles.headerControlPill, { borderColor: themeColors.borderColor }]}
          >
            <Type color={themeColors.textPrimary} size={14} />
            <Text style={[styles.controlText, { color: themeColors.textPrimary }]}>
              {fontSizeOffset === -2 ? 'A-' : fontSizeOffset === 0 ? 'A' : fontSizeOffset === 2 ? 'A+' : 'A++'}
            </Text>
          </TouchableOpacity>

          {/* SHARE BUTTON */}
          <TouchableOpacity
            onPress={handleShareStory}
            style={[styles.headerIconBtn, { backgroundColor: readingTheme === 'dark' ? '#1E293B' : '#F1F5F9' }]}
            activeOpacity={0.7}
          >
            <Share2 color={themeColors.textPrimary} size={17} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ===== 2. ARTICLE SCROLL VIEW ===== */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* HERO IMAGE */}
        <View style={styles.heroImageContainer}>
          <Image source={{ uri: story.coverUrl }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.categoryPillOverlay}>
            <Sparkles color="#7C3AED" size={11} />
            <Text style={styles.categoryPillText}>{story.category}</Text>
          </View>
        </View>

        {/* TITLE & META CARD */}
        <View style={[styles.articleCard, { backgroundColor: themeColors.cardBg, borderColor: themeColors.borderColor }]}>
          <Text style={[styles.articleTitle, { color: themeColors.textPrimary }]}>
            {story.title}
          </Text>

          {/* AUTHOR & DATE ROW */}
          <View style={[styles.authorRow, { borderBottomColor: themeColors.borderColor }]}>
            {story.authorAvatar ? (
              <Image source={{ uri: story.authorAvatar }} style={styles.authorAvatar} />
            ) : (
              <View style={styles.authorAvatarFallback}>
                <User color="#7C3AED" size={16} />
              </View>
            )}

            <View style={{ flex: 1 }}>
              <Text style={[styles.authorName, { color: themeColors.textPrimary }]}>
                {story.author}
              </Text>
              <Text style={[styles.authorRole, { color: themeColors.textSecondary }]}>
                {story.authorRole || 'Especialista Conexión Luz'}
              </Text>
            </View>

            <View style={styles.readingTimeBadge}>
              <Clock color="#059669" size={12} />
              <Text style={styles.readingTimeText}>{story.readingTime}</Text>
            </View>
          </View>

          {/* ILLUMINATED QUOTE BOX */}
          {story.quote && (
            <View style={[styles.quoteBox, { backgroundColor: themeColors.quoteBg, borderLeftColor: themeColors.quoteBorder }]}>
              <Text style={[styles.quoteText, { color: themeColors.quoteText, fontSize: baseFontSize }]}>
                "{story.quote}"
              </Text>
              <Text style={[styles.quoteAuthor, { color: themeColors.quoteBorder }]}>
                — {story.author}
              </Text>
            </View>
          )}

          {/* INTRO EXCERPT */}
          <Text style={[styles.introParagraph, { color: themeColors.textPrimary, fontSize: baseFontSize + 1 }]}>
            {story.plainExcerpt}
          </Text>

          {/* LOCKED / UNLOCKED BODY CONTENT */}
          {!isUnlocked ? (
            <View style={styles.lockedSectionCard}>
              <View style={styles.lockedIconBox}>
                <Lock color="#D97706" size={28} />
              </View>

              <Text style={styles.lockedHeading}>Historia Completa Bloqueada</Text>
              <Text style={styles.lockedSubheading}>
                Este relato incluye capítulos terapéuticos en profundidad, ejercicios somáticos guiados y
                conclusiones de integración. Desbloquéalo con tus Lumis de la comunidad.
              </Text>

              <View style={styles.lockedPricePill}>
                <Sparkle color="#B45309" size={14} />
                <Text style={styles.lockedPriceText}>✨ {story.priceLumis} Lumis</Text>
              </View>

              <TouchableOpacity
                onPress={handleUnlockStory}
                disabled={isUnlocking}
                style={styles.unlockDirectBtn}
                activeOpacity={0.85}
              >
                {isUnlocking ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Unlock color="#FFFFFF" size={16} />
                    <Text style={styles.unlockDirectBtnText}>Desbloquear Historia Ahora</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.storyBodyContainer}>
              {/* CHAPTERS */}
              {(story.chapters || []).map((ch) => (
                <View key={ch.number} style={styles.chapterBlock}>
                  <View style={styles.chapterHeader}>
                    <View style={styles.chapterNumberCircle}>
                      <Text style={styles.chapterNumberText}>{ch.number}</Text>
                    </View>
                    <Text style={[styles.chapterTitle, { color: themeColors.textPrimary }]}>
                      {ch.title}
                    </Text>
                  </View>

                  {ch.paragraphs.map((p, pIdx) => (
                    <Text
                      key={pIdx}
                      style={[
                        styles.bodyParagraph,
                        { color: themeColors.textSecondary, fontSize: baseFontSize },
                      ]}
                    >
                      {p}
                    </Text>
                  ))}
                </View>
              ))}

              {/* KEY TAKEAWAYS BOX */}
              {story.keyTakeaways && story.keyTakeaways.length > 0 && (
                <View style={styles.takeawaysCard}>
                  <View style={styles.takeawaysHeader}>
                    <Sparkles color="#7C3AED" size={16} />
                    <Text style={styles.takeawaysTitle}>Herramientas Somáticas & Aprendizajes</Text>
                  </View>

                  {story.keyTakeaways.map((takeaway, tIdx) => (
                    <View key={tIdx} style={styles.takeawayRow}>
                      <CheckCircle2 color="#059669" size={15} style={{ marginTop: 2 }} />
                      <Text style={styles.takeawayText}>{takeaway}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* TAGS */}
              {story.tags && story.tags.length > 0 && (
                <View style={styles.tagsRow}>
                  {story.tags.map((t, idx) => (
                    <View key={idx} style={styles.tagPill}>
                      <Text style={styles.tagPillText}>#{t}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* ===== 3. INTERACTIVE LIKES AND SHARE BAR ===== */}
          <View style={[styles.interactionBar, { borderTopColor: themeColors.borderColor }]}>
            <TouchableOpacity
              onPress={handleToggleLike}
              style={[
                styles.likeBtn,
                hasLiked && styles.likeBtnActive,
              ]}
              activeOpacity={0.8}
            >
              <Heart
                color={hasLiked ? '#E11D48' : '#64748B'}
                fill={hasLiked ? '#E11D48' : 'none'}
                size={18}
              />
              <Text
                style={[
                  styles.likeBtnText,
                  hasLiked && styles.likeBtnTextActive,
                ]}
              >
                {likesCount} {likesCount === 1 ? 'Reacción' : 'Reacciones'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShareStory}
              style={styles.shareArticleBtn}
              activeOpacity={0.8}
            >
              <Share2 color="#7C3AED" size={16} />
              <Text style={styles.shareArticleBtnText}>Compartir</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== 4. COMMENTS SECTION ===== */}
        <View style={[styles.commentsCard, { backgroundColor: themeColors.cardBg, borderColor: themeColors.borderColor }]}>
          <View style={styles.commentsHeader}>
            <MessageCircle color="#7C3AED" size={18} />
            <Text style={[styles.commentsHeading, { color: themeColors.textPrimary }]}>
              Reflexiones de la Comunidad ({comments.length})
            </Text>
          </View>

          {/* ADD COMMENT INPUT */}
          <View style={styles.addCommentRow}>
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Escribe tu reflexión o testimonio..."
              placeholderTextColor="#94A3B8"
              style={[styles.commentInput, { color: themeColors.textPrimary }]}
              multiline={true}
            />
            <TouchableOpacity
              onPress={handleAddComment}
              disabled={isSubmittingComment || !commentText.trim()}
              style={[
                styles.sendCommentBtn,
                !commentText.trim() && styles.sendCommentBtnDisabled,
              ]}
            >
              {isSubmittingComment ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Send color="#FFFFFF" size={16} />
              )}
            </TouchableOpacity>
          </View>

          {/* COMMENTS LIST */}
          <View style={styles.commentsList}>
            {comments.map((comm) => (
              <View key={comm.id} style={[styles.commentItem, { borderBottomColor: themeColors.borderColor }]}>
                <View style={styles.commentHeader}>
                  <View style={styles.commentAvatar}>
                    <Text style={styles.commentAvatarText}>
                      {comm.authorName.slice(0, 1).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.commentAuthorName, { color: themeColors.textPrimary }]}>
                      {comm.authorName}
                    </Text>
                    <Text style={styles.commentDate}>{comm.createdAt}</Text>
                  </View>
                </View>
                <Text style={[styles.commentBody, { color: themeColors.textSecondary }]}>
                  {comm.content}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ===== 5. RELATED STORIES CAROUSEL ===== */}
        <View style={styles.relatedSection}>
          <Text style={[styles.relatedHeading, { color: themeColors.textPrimary }]}>
            Otras Historias Recomendadas
          </Text>

          <View style={styles.relatedGrid}>
            {relatedStories.map((rel) => (
              <TouchableOpacity
                key={rel.id}
                onPress={() => router.push({ pathname: '/historia-detalle', params: { slug: rel.slug || rel.id } } as any)}
                style={[styles.relatedCard, { backgroundColor: themeColors.cardBg, borderColor: themeColors.borderColor }]}
                activeOpacity={0.85}
              >
                <Image source={{ uri: rel.coverUrl }} style={styles.relatedCover} />
                <View style={styles.relatedInfo}>
                  <Text style={styles.relatedCategory}>{rel.category}</Text>
                  <Text style={[styles.relatedTitle, { color: themeColors.textPrimary }]} numberOfLines={2}>
                    {rel.title}
                  </Text>
                  <View style={styles.relatedMeta}>
                    <Text style={styles.relatedAuthor}>{rel.author}</Text>
                    <ChevronRight color="#7C3AED" size={14} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerControlPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  controlText: {
    fontSize: 11,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },

  // HERO IMAGE
  heroImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 14,
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  categoryPillOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7C3AED',
  },

  // ARTICLE CARD
  articleCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 28,
    marginBottom: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    marginBottom: 14,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorAvatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorName: {
    fontSize: 13,
    fontWeight: '800',
  },
  authorRole: {
    fontSize: 11,
    marginTop: 1,
  },
  readingTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  readingTimeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#047857',
  },

  // QUOTE BOX
  quoteBox: {
    padding: 14,
    borderRadius: 14,
    borderLeftWidth: 4,
    marginBottom: 16,
  },
  quoteText: {
    fontStyle: 'italic',
    lineHeight: 22,
  },
  quoteAuthor: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 6,
    textAlign: 'right',
  },

  introParagraph: {
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 16,
  },

  // LOCKED SECTION
  lockedSectionCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginVertical: 14,
  },
  lockedIconBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  lockedHeading: {
    fontSize: 16,
    fontWeight: '900',
    color: '#92400E',
    marginBottom: 6,
  },
  lockedSubheading: {
    fontSize: 12,
    color: '#B45309',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  lockedPricePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 14,
  },
  lockedPriceText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#92400E',
  },
  unlockDirectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  unlockDirectBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // STORY BODY
  storyBodyContainer: {
    marginTop: 8,
  },
  chapterBlock: {
    marginBottom: 20,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  chapterNumberCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterNumberText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#7C3AED',
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  bodyParagraph: {
    lineHeight: 24,
    marginBottom: 12,
  },

  // TAKEAWAYS
  takeawaysCard: {
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    marginVertical: 14,
  },
  takeawaysHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  takeawaysTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#5B21B6',
  },
  takeawayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  takeawayText: {
    fontSize: 12.5,
    color: '#4C1D95',
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tagPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },

  // INTERACTION BAR
  interactionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 14,
    marginTop: 16,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  likeBtnActive: {
    backgroundColor: '#FFE4E6',
  },
  likeBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  likeBtnTextActive: {
    color: '#E11D48',
  },
  shareArticleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F5F3FF',
  },
  shareArticleBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7C3AED',
  },

  // COMMENTS SECTION
  commentsCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  commentsHeading: {
    fontSize: 14.5,
    fontWeight: '900',
  },
  addCommentRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  commentInput: {
    flex: 1,
    fontSize: 12.5,
    maxHeight: 80,
  },
  sendCommentBtn: {
    backgroundColor: '#7C3AED',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendCommentBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  commentsList: {
    gap: 12,
  },
  commentItem: {
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentAvatarText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  commentAuthorName: {
    fontSize: 12,
    fontWeight: '800',
  },
  commentDate: {
    fontSize: 10,
    color: '#94A3B8',
  },
  commentBody: {
    fontSize: 12,
    lineHeight: 17,
    marginLeft: 36,
  },

  // RELATED STORIES
  relatedSection: {
    marginTop: 10,
  },
  relatedHeading: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 12,
  },
  relatedGrid: {
    gap: 10,
  },
  relatedCard: {
    flexDirection: 'row',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    padding: 8,
    gap: 10,
  },
  relatedCover: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  relatedInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  relatedCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    marginBottom: 2,
  },
  relatedTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    lineHeight: 17,
    marginBottom: 4,
  },
  relatedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  relatedAuthor: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
});
