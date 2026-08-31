import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  MessageSquareText,
  Search,
  ChevronLeft,
  Pin,
  Heart,
  MessageCircle,
  Plus,
  X,
  Send,
  Eye,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Clock,
  Tag,
  Lock,
} from 'lucide-react-native';
import { mobileApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export interface ForumReply {
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
}

export interface ForumTopic {
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
  likesCount?: number;
  createdAt: string;
  updatedAt: string;
  createdById?: number | null;
}

export default function ForoScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const { user } = useAuth();
  const isAuthed = !!user;

  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Modal para crear nuevo tema
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('General');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const stripHtml = (html?: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
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

  // Cargar temas REALES de la base de datos
  const loadTopics = async () => {
    try {
      setLoading(true);
      const res = await mobileApi.fetchForumTopics();
      if (res.ok && Array.isArray(res.data)) {
        setTopics(res.data);
      } else {
        setTopics([]);
      }
    } catch (e) {
      console.warn('Error fetching forum topics from database:', e);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTopics();
    setRefreshing(false);
  };

  // Categorías dinámicas derivadas de la base de datos
  const categories = useMemo(() => {
    const cats = new Set(topics.map((t) => t.category).filter(Boolean));
    const dynamicList = Array.from(cats).sort();
    if (dynamicList.length === 0) {
      return ['Todos', 'General', 'Ansiedad', 'Relaciones', 'Duelo', 'Crecimiento', 'Espiritualidad'];
    }
    return ['Todos', ...dynamicList];
  }, [topics]);

  // Filtrado
  const filteredTopics = useMemo(() => {
    let list = topics;
    if (selectedCategory && selectedCategory !== 'Todos') {
      list = list.filter((t) => t.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.descriptionHtml && stripHtml(t.descriptionHtml).toLowerCase().includes(q)) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }
    return list;
  }, [topics, selectedCategory, search]);

  // Estadísticas reales desde la base de datos
  const stats = useMemo(() => {
    const totalTopics = topics.length;
    const totalReplies = topics.reduce((acc, t) => acc + (t.repliesCount || 0), 0);
    const uniqueCats = new Set(topics.map((t) => t.category).filter(Boolean)).size;
    return {
      totalTopics,
      totalReplies,
      categoriesCount: uniqueCats || 1,
    };
  }, [topics]);

  // Manejar apertura de tema
  const handleOpenTopic = (topic: ForumTopic) => {
    router.push({
      pathname: '/foro-detalle',
      params: { id: String(topic.id) },
    } as any);
  };

  // Publicar nuevo tema directamente a la base de datos
  const handlePublishTopic = async () => {
    if (!newTitle.trim()) {
      Alert.alert('Título requerido', 'Por favor ingresa un título para el tema.');
      return;
    }
    if (!newDescription.trim()) {
      Alert.alert('Descripción requerida', 'Por favor escribe el contenido de tu tema.');
      return;
    }

    setIsPublishing(true);
    try {
      const res = await mobileApi.createForumTopic({
        title: newTitle.trim(),
        description: newDescription.trim(),
        category: newCategory.trim() || 'General',
      });

      if (res.ok) {
        setIsCreateModalOpen(false);
        setNewTitle('');
        setNewDescription('');
        await loadTopics();
        Alert.alert('🎉 ¡Tema Creado!', 'Tu publicación ha sido guardada en la base de datos del foro.');
      } else {
        Alert.alert('Error', res.error || 'No se pudo crear el tema.');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Error al conectar con el servidor.');
    } finally {
      setIsPublishing(false);
    }
  };

  const getExcerpt = (topic: ForumTopic) => {
    if (topic.description && topic.description.trim()) {
      return topic.description.trim();
    }
    if (topic.descriptionHtml) {
      return stripHtml(topic.descriptionHtml);
    }
    return 'Conversación abierta en la comunidad de Conexión Luz.';
  };

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
            <MessageSquareText color="#DB2777" size={16} />
            <Text style={styles.headerTagText}>FORO DE DISCUSIÓN</Text>
          </View>
          <Text style={styles.headerMainTitle}>Comunidad Conexión Luz</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            if (!isAuthed) {
              Alert.alert('Inicia sesión', 'Inicia sesión para crear un tema en el foro.', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Ir a Mi Perfil', onPress: () => router.push('/(tabs)/profile' as any) },
              ]);
              return;
            }
            setIsCreateModalOpen(true);
          }}
          style={styles.headerCreateBtn}
          activeOpacity={0.85}
        >
          <Plus color="#FFFFFF" size={18} />
          <Text style={styles.headerCreateBtnText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#DB2777']} />}
      >
        {/* 2. HERO STATS BANNER */}
        <View style={styles.heroBanner}>
          <View style={styles.heroGlowBadge}>
            <Sparkles color="#DB2777" size={14} />
            <Text style={styles.heroGlowBadgeText}>Espacio de Sanación & Diálogo</Text>
          </View>

          <Text style={styles.heroTitle}>Foro Comunitario</Text>
          <Text style={styles.heroSubtitle}>
            Un espacio seguro para compartir experiencias, resolver dudas y conectar con otros en el camino del bienestar.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalTopics}</Text>
              <Text style={styles.statLabel}>Temas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalReplies}</Text>
              <Text style={styles.statLabel}>Respuestas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.categoriesCount}</Text>
              <Text style={styles.statLabel}>Categorías</Text>
            </View>
          </View>
        </View>

        {/* 3. SEARCH BAR */}
        <View style={styles.searchContainer}>
          <Search color="#94A3B8" size={18} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por tema, pregunta o categoría..."
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

        {/* 4. CATEGORIES HORIZONTAL FILTER */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryPillText, isSelected && styles.categoryPillTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 5. TOPIC LISTING */}
        <View style={styles.topicsSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'Todos' ? 'Todos los Temas' : selectedCategory}
            </Text>
            <Text style={styles.sectionCountText}>
              {filteredTopics.length} {filteredTopics.length === 1 ? 'tema' : 'temas'}
            </Text>
          </View>

          {loading && !refreshing ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color="#DB2777" size="large" />
              <Text style={styles.loadingText}>Cargando temas del foro...</Text>
            </View>
          ) : filteredTopics.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MessageSquareText color="#CBD5E1" size={48} />
              <Text style={styles.emptyTitle}>No hay temas en esta sección</Text>
              <Text style={styles.emptySubtitle}>
                Sé la primera persona en abrir una conversación en el foro.
              </Text>
              <TouchableOpacity
                onPress={() => setIsCreateModalOpen(true)}
                style={styles.emptyCreateBtn}
                activeOpacity={0.85}
              >
                <Plus color="#FFFFFF" size={16} />
                <Text style={styles.emptyCreateBtnText}>Crear Nuevo Tema</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredTopics.map((topic) => {
              return (
                <TouchableOpacity
                  key={topic.id}
                  onPress={() => handleOpenTopic(topic)}
                  style={[styles.topicCard, topic.isPinned && styles.topicCardPinned]}
                  activeOpacity={0.9}
                >
                  {/* Top Badges */}
                  <View style={styles.topicCardTopRow}>
                    <View style={styles.categoryBadge}>
                      <Tag color="#DB2777" size={11} />
                      <Text style={styles.categoryBadgeText}>{topic.category || 'General'}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      {topic.isPinned && (
                        <View style={styles.pinnedBadge}>
                          <Pin color="#D97706" size={11} />
                          <Text style={styles.pinnedBadgeText}>Fijado</Text>
                        </View>
                      )}
                      {topic.isLocked && (
                        <View style={styles.lockedBadge}>
                          <Lock color="#64748B" size={11} />
                          <Text style={styles.lockedBadgeText}>Cerrado</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Title */}
                  <Text style={styles.topicTitle}>{topic.title}</Text>

                  {/* Excerpt */}
                  <Text style={styles.topicExcerpt} numberOfLines={2}>
                    {getExcerpt(topic)}
                  </Text>

                  {/* Date & Author info */}
                  <View style={styles.authorRow}>
                    <View style={styles.timeRow}>
                      <Clock color="#94A3B8" size={12} />
                      <Text style={styles.timeText}>{formatDate(topic.createdAt)}</Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View style={styles.cardDivider} />

                  {/* Bottom Stats & Action */}
                  <View style={styles.cardBottomRow}>
                    <View style={styles.cardMetricsRow}>
                      <View style={styles.metricItem}>
                        <Heart color="#E11D48" size={14} />
                        <Text style={styles.metricText}>{topic.likesCount ?? 0}</Text>
                      </View>

                      <View style={styles.metricItem}>
                        <MessageCircle color="#0284C7" size={14} />
                        <Text style={styles.metricText}>{topic.repliesCount ?? 0}</Text>
                      </View>
                    </View>

                    <View style={styles.participateBtn}>
                      <Text style={styles.participateBtnText}>Ver Conversación</Text>
                      <ChevronRight color="#DB2777" size={14} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* 6. MODAL PARA CREAR NUEVO TEMA */}
      <Modal
        visible={isCreateModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCreateModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Crear Nuevo Tema</Text>
                <Text style={styles.modalSubtitle}>Comparte tu pregunta o reflexión en la comunidad</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsCreateModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
              {/* Categoría */}
              <Text style={styles.inputLabel}>Categoría</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, marginBottom: 16 }}
              >
                {categories.filter((c) => c !== 'Todos').map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setNewCategory(cat)}
                    style={[
                      styles.modalCatPill,
                      newCategory === cat && styles.modalCatPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalCatPillText,
                        newCategory === cat && styles.modalCatPillTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Título */}
              <Text style={styles.inputLabel}>Título del Tema *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej. ¿Cómo empezar a practicar meditación diaria?"
                placeholderTextColor="#94A3B8"
                value={newTitle}
                onChangeText={setNewTitle}
                maxLength={120}
              />

              {/* Descripción */}
              <Text style={styles.inputLabel}>Cuerpo del Tema *</Text>
              <TextInput
                style={[styles.textInput, styles.textAreaInput]}
                placeholder="Escribe tu reflexión o consulta con claridad y respeto..."
                placeholderTextColor="#94A3B8"
                value={newDescription}
                onChangeText={setNewDescription}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />

              <View style={styles.safetyBox}>
                <ShieldCheck color="#059669" size={18} />
                <Text style={styles.safetyText}>
                  Espacio moderado. Recuerda mantener un tono constructivo y empático.
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={handlePublishTopic}
              disabled={isPublishing}
              style={styles.publishBtn}
              activeOpacity={0.85}
            >
              {isPublishing ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Send color="#FFFFFF" size={16} />
                  <Text style={styles.publishBtnText}>Publicar Tema</Text>
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
    color: '#DB2777',
    letterSpacing: 0.8,
  },
  headerMainTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerCreateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DB2777',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#DB2777',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerCreateBtnText: {
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
    borderColor: '#FCE7F3',
    shadowColor: '#DB2777',
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
    backgroundColor: '#FDF2F8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  heroGlowBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DB2777',
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
    backgroundColor: '#FFF1F2',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#BE123C',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9F1239',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#FECDD3',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
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
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: '#DB2777',
    borderColor: '#DB2777',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  topicsSection: {
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
  topicCard: {
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
  topicCardPinned: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFEFA',
  },
  topicCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FDF2F8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DB2777',
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pinnedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  lockedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  topicTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 21,
    marginBottom: 6,
  },
  topicExcerpt: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#64748B',
    marginBottom: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  participateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  participateBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DB2777',
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
  emptyCreateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DB2777',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  emptyCreateBtnText: {
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
  modalCatPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  modalCatPillActive: {
    backgroundColor: '#DB2777',
  },
  modalCatPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  modalCatPillTextActive: {
    color: '#FFFFFF',
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
    height: 100,
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
    backgroundColor: '#DB2777',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#DB2777',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  publishBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
