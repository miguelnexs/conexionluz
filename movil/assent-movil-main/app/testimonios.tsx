import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Alert,
  StatusBar,
  Platform,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Star,
  ChevronLeft,
  Heart,
  MessageSquareQuote,
  ShieldCheck,
  Plus,
  X,
  Send,
  Sparkles,
  CheckCircle2,
  Share2,
  Clock,
  Search,
  Award,
  Users,
} from 'lucide-react-native';
import { mobileApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export interface TestimonialItem {
  id: number;
  patientId?: number | null;
  name: string;
  title?: string;
  quote: string;
  rating: number;
  likesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function TestimoniosScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const { user } = useAuth();
  const isAuthed = !!user;

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<string>('Todos');

  // Interacción de Me Gusta
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());

  // Modal para compartir testimonio propio
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [myRating, setMyRating] = useState<number>(5);
  const [myTitle, setMyTitle] = useState<string>('');
  const [myQuote, setMyQuote] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Iniciales del autor
  const getInitials = (name: string) => {
    const parts = (name || '').trim().split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] || '';
    const b = parts.length > 1 ? parts[parts.length - 1]?.[0] || '' : '';
    return (a + b).toUpperCase() || 'CL';
  };

  const formatDate = (iso?: string) => {
    if (!iso) return 'Reciente';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  // Cargar testimonios REALES de la base de datos
  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const res = await mobileApi.fetchTestimonials();
      if (res.ok && Array.isArray(res.data)) {
        setTestimonials(res.data);
      } else {
        setTestimonials([]);
      }

      // Si está autenticado, cargar su propio testimonio si existe
      if (isAuthed) {
        try {
          const myRes = await mobileApi.fetchMyTestimonial();
          if (myRes.ok && myRes.data) {
            setMyTitle(myRes.data.title || '');
            setMyQuote(myRes.data.quote || '');
            setMyRating(myRes.data.rating || 5);
          }
        } catch {}
      }
    } catch (e) {
      console.warn('Error loading testimonials from database:', e);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, [isAuthed]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTestimonials();
    setRefreshing(false);
  };

  // Manejar Me Gusta contra el backend
  const handleToggleLike = async (item: TestimonialItem) => {
    if (!isAuthed) {
      Alert.alert('Inicia sesión', 'Inicia sesión para interactuar y dar me gusta a los testimonios.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ir a Mi Perfil', onPress: () => router.push('/(tabs)/profile' as any) },
      ]);
      return;
    }

    const isLiked = likedIds.has(item.id);
    const nextSet = new Set(likedIds);
    if (isLiked) {
      nextSet.delete(item.id);
    } else {
      nextSet.add(item.id);
    }
    setLikedIds(nextSet);

    // Actualizar conteo visual optimista
    setTestimonials((prev) =>
      prev.map((t) => (t.id === item.id ? { ...t, likesCount: Math.max(0, (t.likesCount || 0) + (isLiked ? -1 : 1)) } : t))
    );

    try {
      if (isLiked) {
        await mobileApi.unlikeTestimonial(item.id);
      } else {
        await mobileApi.likeTestimonial(item.id);
      }
    } catch (e) {
      console.warn('Error liking testimonial:', e);
    }
  };

  // Compartir testimonio
  const handleShare = async (item: TestimonialItem) => {
    try {
      await Share.share({
        message: `🌟 Testimonio de ${item.name} en Conexión Luz®:\n"${item.quote}"\n\nConoce más historias de sanación en: https://conexionluz.com/testimonios`,
        title: `Testimonio de ${item.name}`,
      });
    } catch {}
  };

  // Guardar mi testimonio
  const handleSaveMyTestimonial = async () => {
    if (myQuote.trim().length < 20) {
      Alert.alert('Testimonio muy corto', 'Por favor escribe al menos 20 caracteres para relatar tu experiencia.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await mobileApi.submitMyTestimonial({
        title: myTitle.trim() || undefined,
        quote: myQuote.trim(),
        rating: myRating,
      });

      if (res.ok) {
        setIsModalOpen(false);
        await loadTestimonials();
        Alert.alert('🎉 ¡Gracias por tu testimonio!', 'Tu mensaje de sanación ha sido publicado e inspirará a muchas personas.');
      } else {
        Alert.alert('Error', res.error || 'No se pudo guardar tu testimonio.');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Error al conectar con el servidor.');
    } finally {
      setIsSaving(false);
    }
  };

  // Estadísticas calculadas en base a datos reales
  const stats = useMemo(() => {
    const total = testimonials.length;
    const avg = total ? testimonials.reduce((acc, x) => acc + (x.rating || 5), 0) / total : 5;
    const avgRounded = avg ? Math.round(avg * 10) / 10 : 5.0;
    const fiveStarsCount = total ? testimonials.filter((x) => (x.rating || 5) === 5).length : 0;
    const satisfactionPct = total ? Math.round((fiveStarsCount / total) * 100) : 100;
    return {
      total,
      avgRounded: avgRounded.toFixed(1),
      satisfactionPct,
    };
  }, [testimonials]);

  // Testimonio destacado
  const featured = useMemo(() => {
    if (!testimonials.length) return null;
    const sorted = [...testimonials].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0) || (b.rating || 5) - (a.rating || 5));
    return sorted[0] || testimonials[0];
  }, [testimonials]);

  // Filtrado
  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((t) => {
      const matchRating =
        ratingFilter === 'Todos' ||
        (ratingFilter === '5 Estrellas' && (t.rating || 5) === 5) ||
        (ratingFilter === '4+ Estrellas' && (t.rating || 5) >= 4);

      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        (t.name && t.name.toLowerCase().includes(q)) ||
        (t.quote && t.quote.toLowerCase().includes(q)) ||
        (t.title && t.title.toLowerCase().includes(q));

      return matchRating && matchSearch;
    });
  }, [testimonials, ratingFilter, search]);

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent={true} />

      {/* 1. TOP HEADER */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBackBtn}
          activeOpacity={0.7}
        >
          <ChevronLeft color="#0F172A" size={24} />
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <View style={styles.headerTagRow}>
            <Star color="#D97706" fill="#D97706" size={14} />
            <Text style={styles.headerTagText}>VOCES REALES</Text>
          </View>
          <Text style={styles.headerMainTitle}>Testimonios de Pacientes</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            if (!isAuthed) {
              Alert.alert('Inicia sesión', 'Inicia sesión para compartir tu testimonio.', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Ir a Mi Perfil', onPress: () => router.push('/(tabs)/profile' as any) },
              ]);
              return;
            }
            setIsModalOpen(true);
          }}
          style={styles.headerAddBtn}
          activeOpacity={0.85}
        >
          <Plus color="#FFFFFF" size={16} />
          <Text style={styles.headerAddBtnText}>Opinar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#D97706']} />}
      >
        {/* 2. STATS HERO BANNER */}
        <View style={styles.heroBanner}>
          <View style={styles.heroGlowBadge}>
            <ShieldCheck color="#D97706" size={14} />
            <Text style={styles.heroGlowBadgeText}>Pacientes 100% Verificados</Text>
          </View>

          <Text style={styles.heroTitle}>Transformaciones de Luz</Text>
          <Text style={styles.heroSubtitle}>
            Historias reales de personas que superaron la ansiedad, el duelo y los bloqueos emocionales a través de nuestras terapias.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statScoreRow}>
                <Star color="#F59E0B" fill="#F59E0B" size={16} />
                <Text style={styles.statNumber}>{stats.avgRounded}</Text>
              </View>
              <Text style={styles.statLabel}>Calificación Promedio</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Testimonios</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.satisfactionPct}%</Text>
              <Text style={styles.statLabel}>Satisfacción</Text>
            </View>
          </View>
        </View>

        {/* 3. TESTIMONIO DESTACADO */}
        {featured && (
          <View style={styles.featuredCard}>
            <View style={styles.featuredBadgeRow}>
              <View style={styles.featuredBadge}>
                <Sparkles color="#B45309" size={12} />
                <Text style={styles.featuredBadgeText}>TESTIMONIO DESTACADO</Text>
              </View>

              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    color="#F59E0B"
                    fill={s <= (featured.rating || 5) ? '#F59E0B' : 'transparent'}
                    size={15}
                  />
                ))}
              </View>
            </View>

            <MessageSquareQuote color="#FDE68A" size={32} style={{ marginBottom: 4 }} />
            <Text style={styles.featuredQuote}>"{featured.quote}"</Text>

            <View style={styles.featuredAuthorRow}>
              <View style={styles.featuredAvatarBox}>
                <Text style={styles.featuredAvatarText}>{getInitials(featured.name)}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={styles.featuredAuthorName}>{featured.name}</Text>
                  <CheckCircle2 color="#059669" size={14} />
                </View>
                <Text style={styles.featuredAuthorTitle}>
                  {featured.title || 'Paciente Acompañamiento Psicológico'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => handleToggleLike(featured)}
                style={[styles.likeMiniBtn, likedIds.has(featured.id) && styles.likeMiniBtnActive]}
                activeOpacity={0.8}
              >
                <Heart
                  color={likedIds.has(featured.id) ? '#E11D48' : '#64748B'}
                  fill={likedIds.has(featured.id) ? '#E11D48' : 'transparent'}
                  size={15}
                />
                <Text style={[styles.likeMiniBtnText, likedIds.has(featured.id) && styles.likeMiniBtnTextActive]}>
                  {featured.likesCount || 0}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 4. SEARCH & RATING FILTERS */}
        <View style={styles.searchContainer}>
          <Search color="#94A3B8" size={18} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o palabra clave..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearSearchBtn}>
              <X color="#94A3B8" size={16} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filtersRow}>
          {['Todos', '5 Estrellas', '4+ Estrellas'].map((filter) => {
            const isSelected = ratingFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                onPress={() => setRatingFilter(filter)}
                style={[styles.filterPill, isSelected && styles.filterPillActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 5. LISTA COMPLETA DE TESTIMONIOS */}
        <View style={styles.listSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Experiencias Compartidas</Text>
            <Text style={styles.sectionCountText}>
              {filteredTestimonials.length} {filteredTestimonials.length === 1 ? 'testimonio' : 'testimonios'}
            </Text>
          </View>

          {loading && !refreshing ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color="#D97706" size="large" />
              <Text style={styles.loadingText}>Cargando testimonios de la comunidad...</Text>
            </View>
          ) : filteredTestimonials.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MessageSquareQuote color="#CBD5E1" size={48} />
              <Text style={styles.emptyTitle}>No encontramos testimonios</Text>
              <Text style={styles.emptySubtitle}>
                Sé la primera persona en compartir tu experiencia de sanación.
              </Text>
              <TouchableOpacity
                onPress={() => setIsModalOpen(true)}
                style={styles.emptyAddBtn}
                activeOpacity={0.85}
              >
                <Plus color="#FFFFFF" size={16} />
                <Text style={styles.emptyAddBtnText}>Escribir Testimonio</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredTestimonials.map((item) => {
              const isLiked = likedIds.has(item.id);
              return (
                <View key={item.id} style={styles.testimonialCard}>
                  {/* Top Author & Rating */}
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.authorAvatarBox}>
                      <Text style={styles.authorAvatarText}>{getInitials(item.name)}</Text>
                    </View>

                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={styles.cardAuthorName}>{item.name}</Text>
                        <CheckCircle2 color="#059669" size={13} />
                      </View>
                      <Text style={styles.cardAuthorTitle}>
                        {item.title || 'Paciente Verificado'}
                      </Text>
                    </View>

                    <View style={styles.cardStarsRow}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          color="#F59E0B"
                          fill={s <= (item.rating || 5) ? '#F59E0B' : 'transparent'}
                          size={13}
                        />
                      ))}
                    </View>
                  </View>

                  {/* Quote Content */}
                  <Text style={styles.cardQuoteText}>"{item.quote}"</Text>

                  {/* Bottom Date & Actions */}
                  <View style={styles.cardFooterRow}>
                    <View style={styles.dateRow}>
                      <Clock color="#94A3B8" size={12} />
                      <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
                    </View>

                    <View style={styles.cardActionsRight}>
                      <TouchableOpacity
                        onPress={() => handleShare(item)}
                        style={styles.cardShareBtn}
                        activeOpacity={0.7}
                      >
                        <Share2 color="#64748B" size={15} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleToggleLike(item)}
                        style={[styles.cardLikeBtn, isLiked && styles.cardLikeBtnActive]}
                        activeOpacity={0.8}
                      >
                        <Heart
                          color={isLiked ? '#E11D48' : '#64748B'}
                          fill={isLiked ? '#E11D48' : 'transparent'}
                          size={14}
                        />
                        <Text style={[styles.cardLikeBtnText, isLiked && styles.cardLikeBtnTextActive]}>
                          {item.likesCount || 0}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* 6. MODAL PARA CREAR / EDITAR TESTIMONIO */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Tu Testimonio de Luz</Text>
                <Text style={styles.modalSubtitle}>Comparte tu proceso e inspira a otros a sanar</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
              {/* Selector de Estrellas */}
              <Text style={styles.inputLabel}>Tu Calificación General</Text>
              <View style={styles.modalStarPicker}>
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <TouchableOpacity
                    key={starVal}
                    onPress={() => setMyRating(starVal)}
                    style={styles.starTouchItem}
                    activeOpacity={0.7}
                  >
                    <Star
                      color="#F59E0B"
                      fill={starVal <= myRating ? '#F59E0B' : 'transparent'}
                      size={28}
                    />
                  </TouchableOpacity>
                ))}
                <Text style={styles.starPickerScoreText}>{myRating} de 5 Estrellas</Text>
              </View>

              {/* Título */}
              <Text style={styles.inputLabel}>Título o Área de tu Consulta (Opcional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej. Sanación de Ansiedad / Terapia de Pareja"
                placeholderTextColor="#94A3B8"
                value={myTitle}
                onChangeText={setMyTitle}
                maxLength={80}
              />

              {/* Relato / Cita */}
              <Text style={styles.inputLabel}>Tu Testimonio o Mensaje * (Mínimo 20 caracteres)</Text>
              <TextInput
                style={[styles.textInput, styles.textAreaInput]}
                placeholder="Cuéntanos cómo fue tu proceso terapéutico, qué cambios sentiste y qué mensaje le darías a alguien que está dudando en iniciar su camino..."
                placeholderTextColor="#94A3B8"
                value={myQuote}
                onChangeText={setMyQuote}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />

              <View style={styles.safetyBox}>
                <ShieldCheck color="#059669" size={18} />
                <Text style={styles.safetyText}>
                  Tu testimonio se mostrará con tu nombre de usuario verificado de Conexión Luz®.
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={handleSaveMyTestimonial}
              disabled={isSaving || myQuote.trim().length < 20}
              style={[
                styles.publishBtn,
                (myQuote.trim().length < 20 || isSaving) && styles.publishBtnDisabled,
              ]}
              activeOpacity={0.85}
            >
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Send color="#FFFFFF" size={16} />
                  <Text style={styles.publishBtnText}>Publicar mi Testimonio</Text>
                </>
              )}
            </TouchableOpacity>
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitleBox: {
    flex: 1,
    marginLeft: 12,
  },
  headerTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerTagText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.8,
  },
  headerMainTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D97706',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerAddBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroBanner: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  heroGlowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  heroGlowBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#92400E',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#78350F',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#FDE68A',
  },
  featuredCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#FFFDF5',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  featuredBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#B45309',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  featuredQuote: {
    fontSize: 14.5,
    fontStyle: 'italic',
    lineHeight: 22,
    color: '#78350F',
    marginBottom: 14,
  },
  featuredAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#FEF3C7',
  },
  featuredAvatarBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredAvatarText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  featuredAuthorName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  featuredAuthorTitle: {
    fontSize: 11,
    color: '#92400E',
    marginTop: 1,
  },
  likeMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  likeMiniBtnActive: {
    backgroundColor: '#FFE4E6',
    borderColor: '#FDA4AF',
  },
  likeMiniBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  likeMiniBtnTextActive: {
    color: '#E11D48',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 13,
    color: '#0F172A',
  },
  clearSearchBtn: {
    padding: 4,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  listSection: {
    paddingHorizontal: 16,
    marginTop: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  loadingBox: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#64748B',
  },
  testimonialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorAvatarBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  authorAvatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  cardAuthorName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardAuthorTitle: {
    fontSize: 10.5,
    color: '#64748B',
  },
  cardStarsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  cardQuoteText: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#334155',
    marginBottom: 12,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  cardActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardShareBtn: {
    padding: 6,
  },
  cardLikeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardLikeBtnActive: {
    backgroundColor: '#FFE4E6',
    borderColor: '#FDA4AF',
  },
  cardLikeBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  cardLikeBtnTextActive: {
    color: '#E11D48',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 18,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D97706',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  emptyAddBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 6,
  },
  modalStarPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  starTouchItem: {
    padding: 2,
  },
  starPickerScoreText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
    marginLeft: 8,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 14,
  },
  textAreaInput: {
    height: 110,
  },
  safetyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 16,
  },
  safetyText: {
    flex: 1,
    fontSize: 11,
    color: '#065F46',
    lineHeight: 16,
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D97706',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  publishBtnDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
  },
  publishBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
