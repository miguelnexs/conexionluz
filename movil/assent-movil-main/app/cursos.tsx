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
  Dimensions,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Lock,
  Unlock,
  Search,
  X,
  Clock,
  Layers,
  Award,
  ChevronRight,
  Share2,
  GraduationCap,
  Sparkle,
  Eye,
  Info,
} from 'lucide-react-native';
import { mobileApi, normalizeMediaUrl } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { CustomVideoPlayer } from '../components/CustomVideoPlayer';
import { ALL_MASTER_COURSES, CourseItem } from '../data/coursesData';

const { width } = Dimensions.get('window');

export default function CursosScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const { user: me, isAuthenticated: isAuthed } = useAuth();

  const [courses, setCourses] = useState<CourseItem[]>(ALL_MASTER_COURSES);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Presentation Modal State
  const [presentationCourse, setPresentationCourse] = useState<CourseItem | null>(null);

  // Lumis & Unlocking State
  const [userBalance, setUserBalance] = useState<number>(150);
  const [unlockedCourseSlugs, setUnlockedCourseSlugs] = useState<Set<string>>(new Set(['autohipnosis']));
  const [pendingUnlockCourse, setPendingUnlockCourse] = useState<CourseItem | null>(null);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [promoVideoModal, setPromoVideoModal] = useState<{ title: string; url: string } | null>(null);

  const loadCoursesData = async () => {
    try {
      setLoading(true);
      if (isAuthed) {
        try {
          const wRes = await mobileApi.fetchLumiWallet();
          if (wRes.ok && wRes.data) {
            setUserBalance(wRes.data.balance ?? 150);
            const unlockedSet = new Set<string>();
            if (Array.isArray(wRes.data.unlockedItems)) {
              wRes.data.unlockedItems.forEach((u: any) => {
                if (u.itemType === 'course') unlockedSet.add(u.itemId);
              });
            }
            unlockedSet.add('autohipnosis');
            setUnlockedCourseSlugs(unlockedSet);
          }
        } catch {}
      }

      let res: any;
      if (isAuthed && typeof mobileApi.fetchMyCourses === 'function') {
        res = await mobileApi.fetchMyCourses();
      } else if (typeof mobileApi.fetchPublicCourses === 'function') {
        res = await mobileApi.fetchPublicCourses();
      } else {
        res = { ok: true, data: ALL_MASTER_COURSES };
      }

      if (res && res.ok && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: CourseItem[] = res.data.map((c: any) => {
          const fallback = ALL_MASTER_COURSES.find((d) => d.slug === c.slug) || ALL_MASTER_COURSES[0];
          return {
            id: c.id || c.slug,
            slug: c.slug || fallback.slug,
            title: c.title || fallback.title,
            description: c.description || fallback.description,
            category: c.category || fallback.category,
            badge: c.category || fallback.badge,
            tags: Array.isArray(c.tags) && c.tags.length > 0 ? c.tags : fallback.tags,
            coverUrl: normalizeMediaUrl(c.coverUrl || c.cover_file) || fallback.coverUrl,
            promoVideoUrl: normalizeMediaUrl(c.promoVideoUrl) || fallback.promoVideoUrl,
            priceCOP: c.priceCOP ?? 0,
            priceLumis: 500,
            modulesCount: fallback.modulesCount || 3,
            duration: fallback.duration || '6 horas de contenido',
            instructor: fallback.instructor || 'Conexión Luz®',
            modules: fallback.modules || [],
          };
        });
        setCourses(mapped);
      } else {
        setCourses(ALL_MASTER_COURSES);
      }
    } catch (e) {
      console.warn('Error loading courses:', e);
      setCourses(ALL_MASTER_COURSES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoursesData();
  }, [isAuthed]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCoursesData();
    setRefreshing(false);
  };

  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.category) {
        const primary = c.category.split('&')[0].trim();
        set.add(primary);
      }
    });
    return ['Todos', ...Array.from(set)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (selectedCategory !== 'Todos') {
        const catMatch = c.category.toLowerCase().includes(selectedCategory.toLowerCase());
        const tagMatch = c.tags.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase()));
        if (!catMatch && !tagMatch) return false;
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(term);
        const matchDesc = c.description.toLowerCase().includes(term);
        const matchTag = c.tags.some((t) => t.toLowerCase().includes(term));
        const matchInst = (c.instructor || '').toLowerCase().includes(term);
        return matchTitle || matchDesc || matchTag || matchInst;
      }
      return true;
    });
  }, [courses, selectedCategory, searchTerm]);

  const handleOpenCourse = (course: CourseItem) => {
    // If locked, ALWAYS show full presentation modal FIRST so the user learns what the course is about
    if (!unlockedCourseSlugs.has(course.slug)) {
      setPresentationCourse(course);
      return;
    }

    if (!isAuthed) {
      Alert.alert(
        'Inicia sesión',
        'Necesitas una cuenta en Conexión Luz para ingresar a los cursos.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ir a Mi Perfil', onPress: () => router.push('/(tabs)/profile' as any) },
        ]
      );
      return;
    }

    // Direct navigation to dedicated course full page
    router.push({
      pathname: '/curso-detalle',
      params: { slug: course.slug },
    } as any);
  };

  const handlePresentationAction = (course: CourseItem) => {
    setPresentationCourse(null);

    if (unlockedCourseSlugs.has(course.slug)) {
      if (!isAuthed) {
        Alert.alert(
          'Inicia sesión',
          'Necesitas una cuenta en Conexión Luz para ingresar a los cursos.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Ir a Mi Perfil', onPress: () => router.push('/(tabs)/profile' as any) },
          ]
        );
        return;
      }
      router.push({
        pathname: '/curso-detalle',
        params: { slug: course.slug },
      } as any);
    } else {
      // User has now read the full presentation; proceed to Lumis unlock confirmation
      if (!isAuthed) {
        Alert.alert(
          'Inicia sesión',
          'Inicia sesión en Conexión Luz para canjear tus Lumis y desbloquear este curso.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Ir a Mi Perfil', onPress: () => router.push('/(tabs)/profile' as any) },
          ]
        );
        return;
      }
      setPendingUnlockCourse(course);
    }
  };

  const handleConfirmUnlock = async () => {
    if (!pendingUnlockCourse) return;
    setIsUnlocking(true);
    try {
      const res = await mobileApi.spendLumis(
        'course',
        pendingUnlockCourse.slug,
        500,
        `Curso Master: ${pendingUnlockCourse.title}`
      );

      if (res.ok && res.data) {
        const newBal = res.data.balance ?? Math.max(0, userBalance - 500);
        setUserBalance(newBal);
        setUnlockedCourseSlugs((prev) => new Set(prev).add(pendingUnlockCourse.slug));

        Alert.alert(
          '🎉 ¡Curso Desbloqueado!',
          `Has desbloqueado "${pendingUnlockCourse.title}". Tienes acceso completo e ilimitado de por vida.`
        );

        const targetSlug = pendingUnlockCourse.slug;
        setPendingUnlockCourse(null);
        router.push({
          pathname: '/curso-detalle',
          params: { slug: targetSlug },
        } as any);
      } else {
        Alert.alert(
          'Saldo Insuficiente de Lumis',
          res.error || 'Necesitas 500 Lumis para desbloquear este curso. Participa en la comunidad o actividades para acumular Lumis.'
        );
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudo completar el desbloqueo');
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleShareCourse = async (course: CourseItem) => {
    try {
      await Share.share({
        message: `🌟 Te recomiendo este Curso Master en Conexión Luz®: "${course.title}". Aprende a tu propio ritmo aquí: https://conexionluz.com/cursos`,
        title: course.title,
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
          <Text style={styles.navTitle}>CURSOS & PROGRAMAS</Text>
          <Text style={styles.navSubtitle}>Plataforma Educativa Cuántica</Text>
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
            colors={['#059669', '#0284C7']}
            tintColor="#059669"
          />
        }
      >
        {/* ===== 2. HERO BANNER PRINCIPAL ===== */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />
          <View style={styles.heroTopTagRow}>
            <View style={styles.heroTagPill}>
              <GraduationCap color="#A7F3D0" size={13} />
              <Text style={styles.heroTagText}>ACADEMIA CONEXIÓN LUZ</Text>
            </View>
            <Text style={styles.heroTagOrg}>100% Online</Text>
          </View>

          <Text style={styles.heroTitle}>Transformación, Hipnosis y Crecimiento Integral</Text>
          <Text style={styles.heroDesc}>
            Programas profesionales estructurados para tu crecimiento personal, sanación de heridas emocionales, autohipnosis y reprogramación subconsciente.
          </Text>

          <View style={styles.heroCountersRow}>
            <View style={styles.counterBox}>
              <Text style={styles.counterVal}>{courses.length}</Text>
              <Text style={styles.counterLabel}>Cursos Master</Text>
            </View>
            <View style={styles.counterDivider} />
            <View style={styles.counterBox}>
              <Text style={styles.counterVal}>Ilimitado</Text>
              <Text style={styles.counterLabel}>Acceso</Text>
            </View>
            <View style={styles.counterDivider} />
            <View style={styles.counterBox}>
              <Text style={styles.counterVal}>Certificado</Text>
              <Text style={styles.counterLabel}>Al culminar</Text>
            </View>
          </View>
        </View>

        {/* ===== 3. SEARCH BAR & CATEGORIES ===== */}
        <View style={styles.searchBox}>
          <Search color="#94A3B8" size={18} />
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Buscar por tema, hipnosis, TCC, hábitos..."
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

        {/* ===== 4. LISTA DE CURSOS A ANCHO COMPLETO ===== */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Cargando catálogo de cursos...</Text>
          </View>
        ) : filteredCourses.length === 0 ? (
          <View style={styles.emptyCard}>
            <BookOpen color="#CBD5E1" size={40} />
            <Text style={styles.emptyTitle}>No se encontraron cursos con este filtro</Text>
            <Text style={styles.emptyDesc}>
              Intenta buscar con otros términos o selecciona otra categoría.
            </Text>
          </View>
        ) : (
          <View style={styles.coursesGrid}>
            {filteredCourses.map((course) => {
              const isUnlocked = unlockedCourseSlugs.has(course.slug);

              return (
                <View key={course.slug} style={styles.courseCard}>
                  {/* COVER IMAGE & TOP BADGES */}
                  <TouchableOpacity
                    onPress={() => handleOpenCourse(course)}
                    activeOpacity={0.9}
                    style={styles.coverImageWrapper}
                  >
                    <Image
                      source={{ uri: course.coverUrl }}
                      style={styles.courseCoverImage}
                      resizeMode="cover"
                    />
                    <View style={styles.coverGradientOverlay} />

                    {/* BADGES ON IMAGE */}
                    <View style={styles.coverTopBadgesRow}>
                      <View style={styles.categoryBadgePill}>
                        <Sparkles color="#047857" size={11} />
                        <Text style={styles.categoryBadgeText}>{course.badge}</Text>
                      </View>

                      <View
                        style={[
                          styles.priceBadgePill,
                          isUnlocked ? styles.priceBadgeUnlocked : styles.priceBadgeLocked,
                        ]}
                      >
                        {isUnlocked ? (
                          <>
                            <Unlock color="#065F46" size={12} />
                            <Text style={styles.priceBadgeUnlockedText}>Desbloqueado</Text>
                          </>
                        ) : (
                          <>
                            <Sparkle color="#FFFFFF" size={12} />
                            <Text style={styles.priceBadgeLockedText}>✨ 500 Lumis</Text>
                          </>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* TITLE */}
                  <TouchableOpacity onPress={() => handleOpenCourse(course)} activeOpacity={0.85}>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                  </TouchableOpacity>

                  {/* INSTRUCTOR & DURATION ROW */}
                  <View style={styles.courseMetaRow}>
                    <View style={styles.metaItem}>
                      <Clock color="#059669" size={13} />
                      <Text style={styles.metaItemText}>{course.duration || '6 horas'}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Layers color="#4F46E5" size={13} />
                      <Text style={styles.metaItemText}>{course.modules?.length || 3} Módulos</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Award color="#D97706" size={13} />
                      <Text style={styles.metaItemText}>Certificado Oficial</Text>
                    </View>
                  </View>

                  {/* DESCRIPTION WITH POPUP PRESENTATION TRIGGER */}
                  <TouchableOpacity
                    onPress={() => setPresentationCourse(course)}
                    activeOpacity={0.75}
                    style={styles.courseDescTouchable}
                  >
                    <Text style={styles.courseDesc} numberOfLines={3}>
                      {course.description}
                    </Text>
                    <View style={styles.viewFullPresTriggerRow}>
                      <Text style={styles.viewFullPresTriggerText}>Ver presentación completa...</Text>
                      <Eye color="#059669" size={13} />
                    </View>
                  </TouchableOpacity>

                  {/* TAGS ROW */}
                  {course.tags && course.tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                      {course.tags.slice(0, 4).map((tag, idx) => (
                        <View key={idx} style={styles.tagPill}>
                          <Text style={styles.tagPillText}>#{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* ACTIONS BAR */}
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      onPress={() => setPresentationCourse(course)}
                      style={styles.viewCurriculumBtn}
                      activeOpacity={0.8}
                    >
                      <BookOpen color="#475569" size={14} />
                      <Text style={styles.viewCurriculumBtnText}>Ver Detalles</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleShareCourse(course)}
                      style={styles.shareBtn}
                      activeOpacity={0.8}
                    >
                      <Share2 color="#059669" size={15} />
                    </TouchableOpacity>

                    {course.promoVideoUrl && (
                      <TouchableOpacity
                        onPress={() => setPromoVideoModal({ title: course.title, url: course.promoVideoUrl! })}
                        style={styles.demoVideoBtn}
                        activeOpacity={0.8}
                      >
                        <PlayCircle color="#059669" size={14} />
                        <Text style={styles.demoVideoBtnText}>Demo</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      onPress={() => handleOpenCourse(course)}
                      style={[
                        styles.primaryActionBtn,
                        isUnlocked && styles.primaryActionBtnUnlocked,
                      ]}
                      activeOpacity={0.85}
                    >
                      {isUnlocked ? (
                        <>
                          <Text style={styles.primaryActionBtnText}>Estudiar</Text>
                          <ChevronRight color="#FFFFFF" size={15} />
                        </>
                      ) : (
                        <>
                          <Sparkles color="#FFFFFF" size={14} />
                          <Text style={styles.primaryActionBtnText}>Conocer y Desbloquear</Text>
                        </>
                      )}
                    </TouchableOpacity>
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
        visible={!!pendingUnlockCourse}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setPendingUnlockCourse(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.unlockModalCard}>
            <View style={styles.unlockModalIconBox}>
              <Sparkles color="#D97706" size={28} />
            </View>

            <Text style={styles.unlockModalTitle}>Desbloquear Curso Master</Text>
            <Text style={styles.unlockModalSubtitle}>
              ¿Deseas canjear tus Lumis para obtener acceso vitalicio al curso:
            </Text>
            <Text style={styles.unlockModalCourseTitle}>"{pendingUnlockCourse?.title}"</Text>

            <View style={styles.unlockBalanceBox}>
              <View style={styles.unlockBalanceRow}>
                <Text style={styles.unlockBalanceLabel}>Costo del curso:</Text>
                <Text style={styles.unlockBalanceCost}>✨ 500 Lumis</Text>
              </View>
              <View style={styles.unlockBalanceDivider} />
              <View style={styles.unlockBalanceRow}>
                <Text style={styles.unlockBalanceLabel}>Tu saldo actual:</Text>
                <Text style={styles.unlockBalanceCurrent}>✨ {userBalance} Lumis</Text>
              </View>
            </View>

            <View style={styles.unlockActionsRow}>
              <TouchableOpacity
                onPress={() => setPendingUnlockCourse(null)}
                style={styles.cancelUnlockBtn}
              >
                <Text style={styles.cancelUnlockBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmUnlock}
                disabled={isUnlocking}
                style={styles.confirmUnlockBtn}
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

      {/* ===== 6. MODAL DE VIDEO DEMO ===== */}
      <Modal
        visible={!!promoVideoModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPromoVideoModal(null)}
      >
        <View style={styles.demoModalOverlay}>
          <View style={styles.demoModalCard}>
            <View style={styles.demoModalHeader}>
              <Text style={styles.demoModalTitle} numberOfLines={1}>
                {promoVideoModal?.title}
              </Text>
              <TouchableOpacity
                onPress={() => setPromoVideoModal(null)}
                style={styles.closeDemoBtn}
              >
                <X color="#0F172A" size={18} />
              </TouchableOpacity>
            </View>
            {promoVideoModal && (
              <CustomVideoPlayer
                src={promoVideoModal.url}
                height={260}
                fullBleed={true}
                contentFit="contain"
                autoPlay={true}
                defaultMuted={false}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* ===== 7. MODAL DE PRESENTACIÓN COMPLETA DEL CURSO ===== */}
      <Modal
        visible={!!presentationCourse}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setPresentationCourse(null)}
      >
        <View style={styles.presModalOverlay}>
          <View style={styles.presModalCard}>
            {/* HEADER */}
            <View style={styles.presModalHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <View style={styles.presCategoryBadge}>
                  <Sparkles color="#047857" size={11} />
                  <Text style={styles.presCategoryBadgeText}>
                    {presentationCourse?.badge || 'Programa Master'}
                  </Text>
                </View>
                <Text style={styles.presModalHeaderTitle} numberOfLines={2}>
                  {presentationCourse?.title}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setPresentationCourse(null)}
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
              {presentationCourse?.coverUrl ? (
                <View style={styles.presCoverWrapper}>
                  <Image
                    source={{ uri: presentationCourse.coverUrl }}
                    style={styles.presCoverImage}
                    resizeMode="cover"
                  />
                  <View style={styles.presCoverOverlay}>
                    <View style={styles.presCoverDurationPill}>
                      <Clock color="#FFFFFF" size={12} />
                      <Text style={styles.presCoverDurationText}>
                        {presentationCourse.duration || '6 Horas'}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}

              {/* INSTRUCTOR & MODAL METAS */}
              <View style={styles.presMetaRow}>
                <View style={styles.presMetaItem}>
                  <GraduationCap color="#059669" size={14} />
                  <Text style={styles.presMetaItemText}>
                    {presentationCourse?.instructor || 'Conexión Luz®'}
                  </Text>
                </View>
                <View style={styles.presMetaItem}>
                  <Award color="#D97706" size={14} />
                  <Text style={styles.presMetaItemText}>Diploma al 100%</Text>
                </View>
              </View>

              {/* 1. DE QUÉ TRATA EL CURSO */}
              <View style={styles.presSectionBox}>
                <Text style={styles.presSectionHeading}>🎯 Presentación del Programa</Text>
                <Text style={styles.presBodyText}>
                  {presentationCourse?.longDescription || presentationCourse?.description}
                </Text>
              </View>

              {/* 2. HIGHLIGHTS / LO QUE APRENDERÁS */}
              {presentationCourse?.highlights && presentationCourse.highlights.length > 0 && (
                <View style={styles.presHighlightsBox}>
                  <Text style={styles.presHighlightsHeading}>✨ ¿Qué dominarás en este curso?</Text>
                  {presentationCourse.highlights.map((h, i) => (
                    <View key={i} style={styles.presHighlightRow}>
                      <CheckCircle2 color="#059669" size={15} style={{ marginTop: 2 }} />
                      <Text style={styles.presHighlightText}>{h}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* 3. TEMARIO Y MÓDULOS INCLUIDOS */}
              <View style={styles.presSectionBox}>
                <Text style={styles.presSectionHeading}>
                  📚 Contenido Académico ({presentationCourse?.modules?.length || 0} Módulos)
                </Text>
                {(presentationCourse?.modules || []).map((m, mIdx) => (
                  <View key={m.id} style={styles.presModuleItem}>
                    <Text style={styles.presModuleTitle}>
                      Módulo {mIdx + 1}: {m.title}
                    </Text>
                    {m.description ? (
                      <Text style={styles.presModuleDesc}>{m.description}</Text>
                    ) : null}

                    {/* Lesson titles preview */}
                    <View style={styles.presLessonsList}>
                      {m.lessons.map((les, lIdx) => (
                        <View key={les.id} style={styles.presLessonBulletRow}>
                          <View style={styles.presLessonTypeDot}>
                            {les.type === 'video' ? (
                              <PlayCircle color="#059669" size={11} />
                            ) : les.type === 'quiz' ? (
                              <Sparkles color="#D97706" size={11} />
                            ) : (
                              <BookOpen color="#3B82F6" size={11} />
                            )}
                          </View>
                          <Text style={styles.presLessonBulletText} numberOfLines={1}>
                            {les.title}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>

              {/* 4. TAGS */}
              {presentationCourse?.tags && presentationCourse.tags.length > 0 && (
                <View style={styles.presTagsRow}>
                  {presentationCourse.tags.map((tag, idx) => (
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
                onPress={() => setPresentationCourse(null)}
                style={styles.presCloseBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.presCloseBtnText}>Cerrar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (presentationCourse) handlePresentationAction(presentationCourse);
                }}
                style={styles.presEnterBtn}
                activeOpacity={0.85}
              >
                <Text style={styles.presEnterBtnText}>
                  {unlockedCourseSlugs.has(presentationCourse?.slug || '') ? 'Entrar a Estudiar' : '✨ Desbloquear por 500 Lumis'}
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
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  navTitleBox: {
    flex: 1,
    marginLeft: 12,
  },
  navTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.4,
  },
  navSubtitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#059669',
  },
  navBalanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  navBalanceText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#B45309',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },

  // HERO CARD
  heroCard: {
    backgroundColor: '#064E3B',
    borderRadius: 22,
    padding: 18,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  heroGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#34D399',
    opacity: 0.25,
  },
  heroTopTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  heroTagText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#A7F3D0',
    letterSpacing: 0.5,
  },
  heroTagOrg: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6EE7B7',
  },
  heroTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 25,
    marginBottom: 6,
  },
  heroDesc: {
    fontSize: 12,
    color: '#D1FAE5',
    lineHeight: 17,
    marginBottom: 14,
  },
  heroCountersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  counterBox: {
    alignItems: 'center',
  },
  counterVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  counterLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A7F3D0',
    marginTop: 1,
  },
  counterDivider: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  // SEARCH BOX
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },

  // CATEGORIES SCROLL
  categoriesScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  categoryPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  categoryPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // COURSES GRID (FULL WIDTH)
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
  },
  coursesGrid: {
    marginHorizontal: -16,
    gap: 12,
    backgroundColor: '#F1F5F9',
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%',
  },
  coverImageWrapper: {
    position: 'relative',
    width: width,
    height: Math.round(width * 0.52),
    backgroundColor: '#020617',
    marginBottom: 10,
  },
  courseCoverImage: {
    width: '100%',
    height: '100%',
  },
  coverGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  coverTopBadgesRow: {
    position: 'absolute',
    top: 10,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#065F46',
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
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  priceBadgeUnlockedText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#065F46',
  },
  priceBadgeLocked: {
    backgroundColor: '#059669',
  },
  priceBadgeLockedText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 22,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  courseMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaItemText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  courseDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: '#475569',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tagPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },
  viewCurriculumBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  viewCurriculumBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
  },
  shareBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  demoVideoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  demoVideoBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingVertical: 9,
    borderRadius: 10,
  },
  primaryActionBtnUnlocked: {
    backgroundColor: '#0D9488',
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  // UNLOCK CONFIRMATION MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  unlockModalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  unlockModalIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  unlockModalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  unlockModalSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 6,
  },
  unlockModalCourseTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#059669',
    textAlign: 'center',
    marginBottom: 16,
  },
  unlockBalanceBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  unlockBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unlockBalanceLabel: {
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '700',
  },
  unlockBalanceCost: {
    fontSize: 12,
    fontWeight: '900',
    color: '#D97706',
  },
  unlockBalanceDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  unlockBalanceCurrent: {
    fontSize: 12,
    fontWeight: '900',
    color: '#059669',
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
    backgroundColor: '#059669',
  },
  confirmUnlockBtnText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // DEMO VIDEO MODAL
  demoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  demoModalCard: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 20,
    overflow: 'hidden',
  },
  demoModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  demoModalTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 10,
  },
  closeDemoBtn: {
    padding: 6,
    backgroundColor: '#1E293B',
    borderRadius: 10,
  },

  // PRESENTATION TRIGGER ON COURSE CARD
  courseDescTouchable: {
    marginBottom: 8,
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
    color: '#059669',
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
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  presCategoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
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
    backgroundColor: '#F0FDF4',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  presHighlightsHeading: {
    fontSize: 13,
    fontWeight: '900',
    color: '#166534',
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
    color: '#15803D',
    fontWeight: '700',
    flex: 1,
    lineHeight: 17,
  },
  presModuleItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presModuleTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1E293B',
  },
  presModuleDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  presLessonsList: {
    marginTop: 8,
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
  },
  presLessonBulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  presLessonTypeDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presLessonBulletText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
    flex: 1,
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
    backgroundColor: '#059669',
  },
  presEnterBtnText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
