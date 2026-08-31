import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  ActivityIndicator,
  StatusBar,
  Platform,
  Alert,
  RefreshControl,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Heart,
  MessageCircle,
  Search,
  X,
  Clock,
  Award,
  ChevronRight,
  Share2,
  Lock,
  Unlock,
  Eye,
  Calendar,
  Sparkle,
  User,
  CheckCircle2,
} from 'lucide-react-native';
import { mobileApi, normalizeMediaUrl } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ALL_MASTER_STORIES, StoryItem } from '../data/storiesData';

export default function HistoriasScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const { user: me, isAuthenticated: isAuthed } = useAuth();

  const [stories, setStories] = useState<StoryItem[]>(ALL_MASTER_STORIES);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Presentation / Preview Modal State
  const [previewStory, setPreviewStory] = useState<StoryItem | null>(null);

  // Lumis & Unlocking State
  const [userBalance, setUserBalance] = useState<number>(150);
  const [unlockedStoryIds, setUnlockedStoryIds] = useState<Set<string | number>>(new Set([1, 3, 6]));
  const [pendingUnlockStory, setPendingUnlockStory] = useState<StoryItem | null>(null);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);

  const loadStoriesData = async () => {
    try {
      setLoading(true);

      if (isAuthed) {
        try {
          const wRes = await mobileApi.fetchLumiWallet();
          if (wRes.ok && wRes.data) {
            setUserBalance(wRes.data.balance ?? 150);
            const unlockedSet = new Set<string | number>([1, 3, 6]);
            if (Array.isArray(wRes.data.unlockedItems)) {
              wRes.data.unlockedItems.forEach((u: any) => {
                if (u.itemType === 'story') {
                  const cleaned = String(u.itemId).replace('story-', '');
                  unlockedSet.add(cleaned);
                  unlockedSet.add(Number(cleaned));
                  unlockedSet.add(u.itemId);
                }
              });
            }
            setUnlockedStoryIds(unlockedSet);
          }
        } catch {}
      }

      // Fetch from backend API
      const res = await mobileApi.fetchStories();
      if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: StoryItem[] = res.data.map((s: any) => {
          const fallback = ALL_MASTER_STORIES.find((d) => d.id === s.id || d.slug === s.slug) || ALL_MASTER_STORIES[0];
          const isFree = s.tags?.some((t: string) => t.toLowerCase() === 'gratis') || [1, 3, 6].includes(s.id);
          return {
            id: s.id,
            slug: s.slug || fallback.slug,
            title: s.title || fallback.title,
            author: s.author || fallback.author,
            authorRole: fallback.authorRole || 'Colaborador Conexión Luz',
            authorAvatar: fallback.authorAvatar,
            category: s.category || fallback.category,
            tags: Array.isArray(s.tags) && s.tags.length > 0 ? s.tags : fallback.tags,
            coverUrl: normalizeMediaUrl(s.imageUrl || s.image_url) || fallback.coverUrl,
            plainExcerpt: s.content?.replace(/<[^>]*>?/gm, '').slice(0, 180) || fallback.plainExcerpt,
            contentHtml: s.content || fallback.contentHtml,
            quote: fallback.quote,
            readingTime: fallback.readingTime || '8 min de lectura',
            createdAt: s.createdAt || s.created_at || fallback.createdAt,
            priceLumis: fallback.priceLumis ?? (isFree ? 0 : 15),
            isFree: isFree,
            likesCount: s.likesCount ?? fallback.likesCount ?? 25,
            commentsCount: s.commentsCount ?? fallback.commentsCount ?? 3,
            chapters: fallback.chapters,
            keyTakeaways: fallback.keyTakeaways,
            comments: fallback.comments,
          };
        });
        setStories(mapped);
      }
    } catch (e) {
      console.warn('Error loading stories:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStoriesData();
  }, [isAuthed]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStoriesData();
    setRefreshing(false);
  };

  const categoriesList = useMemo(() => {
    const cats = new Set<string>();
    stories.forEach((s) => {
      if (s.category) cats.add(s.category);
    });
    return ['Todos', ...Array.from(cats)];
  }, [stories]);

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      const matchCat = selectedCategory === 'Todos' || story.category === selectedCategory;
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        story.title.toLowerCase().includes(q) ||
        story.author.toLowerCase().includes(q) ||
        story.category.toLowerCase().includes(q) ||
        (story.tags || []).some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [stories, selectedCategory, searchTerm]);

  const isStoryUnlocked = (story: StoryItem) => {
    if (story.isFree || story.priceLumis === 0) return true;
    return (
      unlockedStoryIds.has(story.id) ||
      unlockedStoryIds.has(Number(story.id)) ||
      unlockedStoryIds.has(`story-${story.id}`) ||
      unlockedStoryIds.has(story.slug)
    );
  };

  const handleOpenStory = (story: StoryItem) => {
    // Direct navigation to dedicated full story reading page
    router.push({
      pathname: '/historia-detalle',
      params: { slug: story.slug || story.id },
    } as any);
  };

  const handlePreviewAction = (story: StoryItem) => {
    setPreviewStory(null);

    if (isStoryUnlocked(story)) {
      router.push({
        pathname: '/historia-detalle',
        params: { slug: story.slug || story.id },
      } as any);
    } else {
      if (!isAuthed) {
        Alert.alert(
          'Inicia sesión',
          'Inicia sesión en Conexión Luz para canjear tus Lumis y desbloquear esta historia.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Ir a Mi Perfil', onPress: () => router.push('/(tabs)/profile' as any) },
          ]
        );
        return;
      }
      setPendingUnlockStory(story);
    }
  };

  const handleConfirmUnlock = async () => {
    if (!pendingUnlockStory) return;
    setIsUnlocking(true);
    const amount = pendingUnlockStory.priceLumis || 15;

    try {
      const res = await mobileApi.spendLumis(
        'story',
        `story-${pendingUnlockStory.id}`,
        amount,
        `Historia de Sanación: ${pendingUnlockStory.title}`
      );

      if (res.ok && res.data) {
        const newBal = res.data.balance ?? Math.max(0, userBalance - amount);
        setUserBalance(newBal);
        setUnlockedStoryIds((prev) => {
          const next = new Set(prev);
          next.add(pendingUnlockStory.id);
          next.add(Number(pendingUnlockStory.id));
          next.add(`story-${pendingUnlockStory.id}`);
          next.add(pendingUnlockStory.slug);
          return next;
        });

        Alert.alert(
          '🎉 ¡Historia Desbloqueada!',
          `Has desbloqueado "${pendingUnlockStory.title}". Tienes acceso completo e ilimitado de por vida.`
        );

        const targetSlug = pendingUnlockStory.slug || pendingUnlockStory.id;
        setPendingUnlockStory(null);
        router.push({
          pathname: '/historia-detalle',
          params: { slug: targetSlug },
        } as any);
      } else {
        Alert.alert(
          'Saldo Insuficiente de Lumis',
          res.error ||
            `Necesitas ✨ ${amount} Lumis para desbloquear esta historia. Participa en la comunidad para acumular Lumis.`
        );
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudo completar el desbloqueo');
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleShareStory = async (story: StoryItem) => {
    try {
      await Share.share({
        message: `📖 Te invito a leer esta historia de sanación y transformación en Conexión Luz®: "${story.title}". Léela aquí: https://conexionluz.com/historias/${story.slug || story.id}`,
        title: story.title,
      });
    } catch {}
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent={true} />

      {/* ===== 1. TOP NAVIGATION HEADER ===== */}
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft color="#0F172A" size={22} />
        </TouchableOpacity>

        <View style={styles.navTitleBox}>
          <Text style={styles.navTitle}>HISTORIAS DE LUZ</Text>
          <Text style={styles.navSubtitle}>Relatos Transformacionales & Sanación</Text>
        </View>

        <View style={styles.navBalanceBadge}>
          <Sparkles color="#D97706" size={13} />
          <Text style={styles.navBalanceText}>{userBalance} Lumis</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#7C3AED', '#6D28D9']}
            tintColor="#7C3AED"
          />
        }
      >
        {/* ===== 2. HERO BANNER ===== */}
        <View style={styles.heroBanner}>
          <View style={styles.heroBadgeRow}>
            <Sparkles color="#7C3AED" size={14} />
            <Text style={styles.heroBadgeText}>ESPACIO DE INSPIRACIÓN & REFLEXIÓN</Text>
          </View>
          <Text style={styles.heroHeading}>
            Historias Reales para Sanar y Expandir tu Consciencia
          </Text>
          <Text style={styles.heroSubheading}>
            Testimonios profundos, sabiduría terapéutica y herramientas somáticas para iluminar los
            momentos difíciles de la vida.
          </Text>

          <View style={styles.heroCountersRow}>
            <View style={styles.counterBox}>
              <Text style={styles.counterVal}>{stories.length}</Text>
              <Text style={styles.counterLabel}>Historias</Text>
            </View>
            <View style={styles.counterDivider} />
            <View style={styles.counterBox}>
              <Text style={styles.counterVal}>100%</Text>
              <Text style={styles.counterLabel}>Inspiradoras</Text>
            </View>
            <View style={styles.counterDivider} />
            <View style={styles.counterBox}>
              <Text style={styles.counterVal}>Ilimitado</Text>
              <Text style={styles.counterLabel}>Acceso</Text>
            </View>
          </View>
        </View>

        {/* ===== 3. SEARCH BAR & CATEGORIES ===== */}
        <View style={styles.searchBox}>
          <Search color="#94A3B8" size={18} />
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Buscar por título, ansiedad, perdón, autor..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <X color="#94A3B8" size={18} />
            </TouchableOpacity>
          )}
        </View>

        {/* CATEGORIES SCROLL PILLS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                activeOpacity={0.75}
              >
                <Text style={[styles.categoryPillText, isSelected && styles.categoryPillTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ===== 4. LISTA DE HISTORIAS ===== */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7C3AED" />
            <Text style={styles.loadingText}>Cargando relatos de sanación...</Text>
          </View>
        ) : filteredStories.length === 0 ? (
          <View style={styles.emptyCard}>
            <BookOpen color="#CBD5E1" size={40} />
            <Text style={styles.emptyTitle}>No se encontraron historias con este filtro</Text>
            <Text style={styles.emptyDesc}>
              Intenta buscar con otros términos o selecciona otra categoría.
            </Text>
          </View>
        ) : (
          <View style={styles.storiesGrid}>
            {filteredStories.map((story) => {
              const unlocked = isStoryUnlocked(story);

              return (
                <View key={story.id} style={styles.storyCard}>
                  {/* COVER IMAGE & TOP BADGES */}
                  <TouchableOpacity
                    onPress={() => handleOpenStory(story)}
                    activeOpacity={0.9}
                    style={styles.coverImageWrapper}
                  >
                    <Image
                      source={{ uri: story.coverUrl }}
                      style={styles.storyCoverImage}
                      resizeMode="cover"
                    />
                    <View style={styles.coverGradientOverlay} />

                    {/* BADGES ON IMAGE */}
                    <View style={styles.coverTopBadgesRow}>
                      <View style={styles.categoryBadgePill}>
                        <Sparkles color="#7C3AED" size={11} />
                        <Text style={styles.categoryBadgeText}>{story.category}</Text>
                      </View>

                      <View
                        style={[
                          styles.priceBadgePill,
                          unlocked ? styles.priceBadgeUnlocked : styles.priceBadgeLocked,
                        ]}
                      >
                        {unlocked ? (
                          <>
                            <Unlock color="#065F46" size={12} />
                            <Text style={styles.priceBadgeUnlockedText}>
                              {story.isFree ? 'Gratis' : 'Desbloqueado'}
                            </Text>
                          </>
                        ) : (
                          <>
                            <Sparkle color="#FFFFFF" size={12} />
                            <Text style={styles.priceBadgeLockedText}>
                              ✨ {story.priceLumis} Lumis
                            </Text>
                          </>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* TITLE */}
                  <TouchableOpacity onPress={() => handleOpenStory(story)} activeOpacity={0.85}>
                    <Text style={styles.storyTitle}>{story.title}</Text>
                  </TouchableOpacity>

                  {/* AUTHOR & READING TIME META */}
                  <View style={styles.storyMetaRow}>
                    <View style={styles.metaAuthorItem}>
                      <User color="#64748B" size={13} />
                      <Text style={styles.metaAuthorText}>{story.author}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Clock color="#059669" size={13} />
                      <Text style={styles.metaItemText}>{story.readingTime}</Text>
                    </View>
                  </View>

                  {/* EXCERPT WITH POPUP PREVIEW TRIGGER */}
                  <TouchableOpacity
                    onPress={() => setPreviewStory(story)}
                    activeOpacity={0.75}
                    style={styles.storyExcerptTouchable}
                  >
                    <Text style={styles.storyExcerpt} numberOfLines={3}>
                      {story.plainExcerpt}
                    </Text>
                    <View style={styles.viewFullPresTriggerRow}>
                      <Text style={styles.viewFullPresTriggerText}>Ver presentación completa...</Text>
                      <Eye color="#7C3AED" size={13} />
                    </View>
                  </TouchableOpacity>

                  {/* TAGS ROW */}
                  {story.tags && story.tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                      {story.tags.slice(0, 4).map((tag, idx) => (
                        <View key={idx} style={styles.tagPill}>
                          <Text style={styles.tagPillText}>#{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* SOCIAL STATS AND ACTIONS BAR */}
                  <View style={styles.cardActionsRow}>
                    <View style={styles.socialStatsRow}>
                      <View style={styles.socialStatItem}>
                        <Heart color="#E11D48" size={14} />
                        <Text style={styles.socialStatText}>{story.likesCount}</Text>
                      </View>
                      <View style={styles.socialStatItem}>
                        <MessageCircle color="#64748B" size={14} />
                        <Text style={styles.socialStatText}>{story.commentsCount}</Text>
                      </View>
                    </View>

                    <View style={styles.btnActionsRight}>
                      <TouchableOpacity
                        onPress={() => handleShareStory(story)}
                        style={styles.shareBtn}
                        activeOpacity={0.8}
                      >
                        <Share2 color="#7C3AED" size={15} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleOpenStory(story)}
                        style={[
                          styles.primaryActionBtn,
                          styles.primaryActionBtnUnlocked,
                        ]}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.primaryActionBtnText}>Leer Historia</Text>
                        <ChevronRight color="#FFFFFF" size={15} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>

      {/* ===== 5. MODAL DE CONFIRMACIÓN DE DESBLOQUEO CON LUMIS ===== */}
      <Modal
        visible={!!pendingUnlockStory}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setPendingUnlockStory(null)}
      >
        <View style={styles.unlockModalOverlay}>
          <View style={styles.unlockModalCard}>
            <View style={styles.unlockModalIconCircle}>
              <Sparkles color="#D97706" size={28} />
            </View>

            <Text style={styles.unlockModalTitle}>Desbloquear Historia de Sanación</Text>
            <Text style={styles.unlockModalStoryTitle}>
              "{pendingUnlockStory?.title}"
            </Text>

            <View style={styles.unlockDetailsBox}>
              <View style={styles.unlockDetailRow}>
                <Text style={styles.unlockDetailLabel}>Costo de Desbloqueo:</Text>
                <Text style={styles.unlockDetailValue}>
                  ✨ {pendingUnlockStory?.priceLumis} Lumis
                </Text>
              </View>
              <View style={styles.unlockDetailRow}>
                <Text style={styles.unlockDetailLabel}>Tu Saldo Disponible:</Text>
                <Text style={styles.unlockDetailValue}>{userBalance} Lumis</Text>
              </View>
              <View style={[styles.unlockDetailRow, { borderBottomWidth: 0, paddingTop: 8 }]}>
                <Text style={styles.unlockDetailLabel}>Acceso:</Text>
                <Text style={styles.unlockDetailValue}>Ilimitado de por vida</Text>
              </View>
            </View>

            <View style={styles.unlockActionsRow}>
              <TouchableOpacity
                onPress={() => setPendingUnlockStory(null)}
                style={styles.cancelUnlockBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelUnlockBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmUnlock}
                disabled={isUnlocking}
                style={styles.confirmUnlockBtn}
                activeOpacity={0.85}
              >
                {isUnlocking ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Unlock color="#FFFFFF" size={16} />
                    <Text style={styles.confirmUnlockBtnText}>Confirmar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ===== 6. MODAL DE PRESENTACIÓN / VISTA PREVIA COMPLETA ===== */}
      <Modal
        visible={!!previewStory}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setPreviewStory(null)}
      >
        <View style={styles.presModalOverlay}>
          <View style={styles.presModalCard}>
            {/* HEADER */}
            <View style={styles.presModalHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <View style={styles.presCategoryBadge}>
                  <Sparkles color="#7C3AED" size={11} />
                  <Text style={styles.presCategoryBadgeText}>
                    {previewStory?.category || 'Historia de Sanación'}
                  </Text>
                </View>
                <Text style={styles.presModalHeaderTitle} numberOfLines={2}>
                  {previewStory?.title}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setPreviewStory(null)}
                style={styles.closePresBtn}
                activeOpacity={0.8}
              >
                <X color="#0F172A" size={18} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.presScrollContent}
            >
              {/* COVER BANNER */}
              {previewStory?.coverUrl ? (
                <View style={styles.presCoverWrapper}>
                  <Image
                    source={{ uri: previewStory.coverUrl }}
                    style={styles.presCoverImage}
                    resizeMode="cover"
                  />
                  <View style={styles.presCoverOverlay}>
                    <View style={styles.presCoverDurationPill}>
                      <Clock color="#FFFFFF" size={12} />
                      <Text style={styles.presCoverDurationText}>
                        {previewStory.readingTime || '8 min'}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}

              {/* INSTRUCTOR & MODAL METAS */}
              <View style={styles.presMetaRow}>
                <View style={styles.presMetaItem}>
                  <User color="#7C3AED" size={14} />
                  <Text style={styles.presMetaItemText}>
                    {previewStory?.author || 'Conexión Luz®'}
                  </Text>
                </View>
                <View style={styles.presMetaItem}>
                  <Award color="#D97706" size={14} />
                  <Text style={styles.presMetaItemText}>
                    {previewStory?.isFree ? 'Lectura Gratuita' : `✨ ${previewStory?.priceLumis} Lumis`}
                  </Text>
                </View>
              </View>

              {/* QUOTE BANNER */}
              {previewStory?.quote && (
                <View style={styles.presQuoteBox}>
                  <Text style={styles.presQuoteText}>"{previewStory.quote}"</Text>
                  <Text style={styles.presQuoteAuthor}>— {previewStory.author}</Text>
                </View>
              )}

              {/* 1. DE QUÉ TRATA ESTA HISTORIA */}
              <View style={styles.presSectionBox}>
                <Text style={styles.presSectionHeading}>📖 Sinopsis & Transformación</Text>
                <Text style={styles.presBodyText}>
                  {previewStory?.plainExcerpt}
                </Text>
              </View>

              {/* 2. KEY TAKEAWAYS */}
              {previewStory?.keyTakeaways && previewStory.keyTakeaways.length > 0 && (
                <View style={styles.presHighlightsBox}>
                  <Text style={styles.presHighlightsHeading}>✨ ¿Qué herramientas descubrirás?</Text>
                  {previewStory.keyTakeaways.map((h, i) => (
                    <View key={i} style={styles.presHighlightRow}>
                      <CheckCircle2 color="#7C3AED" size={15} style={{ marginTop: 2 }} />
                      <Text style={styles.presHighlightText}>{h}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* 3. CAPÍTULOS INCLUIDOS */}
              {previewStory?.chapters && previewStory.chapters.length > 0 && (
                <View style={styles.presSectionBox}>
                  <Text style={styles.presSectionHeading}>
                    📑 Estructura de la Lectura ({previewStory.chapters.length} Capítulos)
                  </Text>
                  {previewStory.chapters.map((ch) => (
                    <View key={ch.number} style={styles.presModuleItem}>
                      <Text style={styles.presModuleTitle}>
                        {ch.number}. {ch.title}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* 4. TAGS */}
              {previewStory?.tags && previewStory.tags.length > 0 && (
                <View style={styles.presTagsRow}>
                  {previewStory.tags.map((tag, idx) => (
                    <View key={idx} style={styles.presTagPill}>
                      <Text style={styles.presTagPillText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            {/* MODAL FOOTER */}
            <View style={styles.presFooter}>
              <TouchableOpacity
                onPress={() => setPreviewStory(null)}
                style={styles.presCloseBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.presCloseBtnText}>Cerrar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (previewStory) handlePreviewAction(previewStory);
                }}
                style={styles.presEnterBtn}
                activeOpacity={0.85}
              >
                <Text style={styles.presEnterBtnText}>
                  {previewStory && isStoryUnlocked(previewStory)
                    ? 'Leer Relato Completo'
                    : `✨ Desbloquear por ${previewStory?.priceLumis} Lumis`}
                </Text>
                <ChevronRight color="#FFFFFF" size={16} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  navTitleBox: {
    flex: 1,
    marginHorizontal: 12,
  },
  navTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.4,
  },
  navSubtitle: {
    fontSize: 11,
    color: '#7C3AED',
    fontWeight: '700',
  },
  navBalanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  navBalanceText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#B45309',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // HERO BANNER
  heroBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#7C3AED',
    letterSpacing: 0.5,
  },
  heroHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 24,
    marginBottom: 6,
  },
  heroSubheading: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  heroCountersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  counterBox: {
    flex: 1,
    alignItems: 'center',
  },
  counterVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  counterLabel: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 1,
  },
  counterDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#CBD5E1',
  },

  // SEARCH & CATEGORIES
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  categoriesScroll: {
    gap: 8,
    paddingBottom: 14,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },

  // LOADING & EMPTY
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },

  // STORIES GRID & CARDS
  storiesGrid: {
    gap: 16,
  },
  storyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  coverImageWrapper: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  storyCoverImage: {
    width: '100%',
    height: '100%',
  },
  coverGradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
  },
  coverTopBadgesRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#7C3AED',
  },
  priceBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceBadgeUnlocked: {
    backgroundColor: '#ECFDF5',
  },
  priceBadgeUnlockedText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#065F46',
  },
  priceBadgeLocked: {
    backgroundColor: '#D97706',
  },
  priceBadgeLockedText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  storyTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 6,
  },
  storyMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaAuthorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  metaAuthorText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaItemText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  storyExcerptTouchable: {
    marginBottom: 8,
  },
  storyExcerpt: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
  viewFullPresTriggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  viewFullPresTriggerText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#7C3AED',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tagPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagPillText: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '700',
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  socialStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  socialStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  socialStatText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#64748B',
  },
  btnActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  primaryActionBtnUnlocked: {
    backgroundColor: '#059669',
  },
  primaryActionBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // UNLOCK CONFIRMATION MODAL
  unlockModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  unlockModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
  },
  unlockModalIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  unlockModalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
    textAlign: 'center',
  },
  unlockModalStoryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
    textAlign: 'center',
    marginBottom: 16,
  },
  unlockDetailsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  unlockDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  unlockDetailLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  unlockDetailValue: {
    fontSize: 12.5,
    color: '#0F172A',
    fontWeight: '900',
  },
  unlockActionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelUnlockBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelUnlockBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#64748B',
  },
  confirmUnlockBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
  },
  confirmUnlockBtnText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // PRESENTATION MODAL STYLES
  presModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 30,
  },
  presModalCard: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presModalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  presCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  presCategoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
  },
  presModalHeaderTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 20,
  },
  closePresBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presScrollContent: {
    padding: 18,
    paddingBottom: 10,
  },
  presCoverWrapper: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  presCoverImage: {
    width: '100%',
    height: '100%',
  },
  presCoverOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  presCoverDurationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  presCoverDurationText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  presMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  presMetaItemText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#334155',
  },
  presQuoteBox: {
    backgroundColor: '#F5F3FF',
    padding: 14,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
    marginBottom: 14,
  },
  presQuoteText: {
    fontSize: 12.5,
    fontStyle: 'italic',
    color: '#4C1D95',
    lineHeight: 18,
  },
  presQuoteAuthor: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7C3AED',
    marginTop: 6,
    textAlign: 'right',
  },
  presSectionBox: {
    marginBottom: 16,
  },
  presSectionHeading: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
  },
  presBodyText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 19,
  },
  presHighlightsBox: {
    backgroundColor: '#F5F3FF',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  presHighlightsHeading: {
    fontSize: 13,
    fontWeight: '900',
    color: '#5B21B6',
    marginBottom: 8,
  },
  presHighlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  presHighlightText: {
    fontSize: 12,
    color: '#6D28D9',
    fontWeight: '700',
    flex: 1,
    lineHeight: 17,
  },
  presModuleItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presModuleTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  presTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
    marginBottom: 14,
  },
  presTagPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  presTagPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  presFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  presCloseBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  presCloseBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#64748B',
  },
  presEnterBtn: {
    flex: 1.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
  },
  presEnterBtnText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
