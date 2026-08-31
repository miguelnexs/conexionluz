import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Radio,
  Calendar,
  Clock,
  Users,
  Search,
  CheckCircle2,
  PlayCircle,
  Sparkles,
  ChevronRight,
  Share2,
  Video,
  X,
  AlertCircle,
  MapPin,
  Globe,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { mobileApi, normalizeMediaUrl } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { CustomVideoPlayer, isVideoMedia } from '../components/CustomVideoPlayer';

const { width } = Dimensions.get('window');

interface PublicTalk {
  id: number;
  title: string;
  description?: string;
  topic?: string;
  speaker?: string;
  organizer?: string;
  modality?: string;
  startAt: string;
  endAt?: string | null;
  format?: 'online' | 'presential';
  audience?: string;
  agenda?: string[];
  participants?: number;
  status?: 'past' | 'future';
  isRegistered?: boolean;
  videoUrl?: string | null;
  featuredVideoUrl?: string | null;
}

export default function ConversatoriosScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const { user: me, isAuthenticated: isAuthed } = useAuth();

  const [talks, setTalks] = useState<PublicTalk[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Todos');
  const [activeTab, setActiveTab] = useState<'future' | 'past'>('future');
  const [registeringId, setRegisteringId] = useState<number | null>(null);
  const [expandedCards, setExpandedCards] = useState<{ [key: number]: boolean }>({});

  // Video playback modal state
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);

  const loadTalks = async () => {
    try {
      setLoading(true);
      const res = await mobileApi.fetchPublicTalks();
      if (res.ok && Array.isArray(res.data)) {
        setTalks(res.data);
      }
    } catch (e) {
      console.warn('Error loading talks:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTalks();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTalks();
    setRefreshing(false);
  };

  const topicsList = useMemo(() => {
    const set = new Set<string>();
    talks.forEach((t) => {
      if (t.topic && t.topic.trim()) set.add(t.topic.trim());
    });
    return ['Todos', ...Array.from(set)];
  }, [talks]);

  const filteredTalks = useMemo(() => {
    return talks.filter((t) => {
      // 1. Tab filter (future vs past)
      const isPast = t.status === 'past' || (t.startAt && new Date(t.startAt).getTime() < Date.now() - 3600 * 1000);
      if (activeTab === 'future' && isPast) return false;
      if (activeTab === 'past' && !isPast) return false;

      // 2. Topic filter
      if (selectedTopic !== 'Todos' && t.topic !== selectedTopic) return false;

      // 3. Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchTitle = (t.title || '').toLowerCase().includes(term);
        const matchSpeaker = (t.speaker || '').toLowerCase().includes(term);
        const matchDesc = (t.description || '').toLowerCase().includes(term);
        return matchTitle || matchSpeaker || matchDesc;
      }

      return true;
    });
  }, [talks, activeTab, selectedTopic, searchTerm]);

  const toggleExpand = (id: number) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleRegistration = async (talk: PublicTalk) => {
    if (!isAuthed) {
      Alert.alert(
        'Inicia sesión',
        'Necesitas una cuenta en Conexión Luz para inscribirte a los conversatorios en vivo.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ir a Mi Cuenta', onPress: () => router.push('/(tabs)/profile' as any) },
        ]
      );
      return;
    }

    setRegisteringId(talk.id);
    try {
      if (talk.isRegistered) {
        const res = await mobileApi.unregisterTalk(talk.id);
        if (res.ok) {
          Alert.alert('Registro cancelado', `Has cancelado tu inscripción al conversatorio "${talk.title}".`);
          setTalks((prev) =>
            prev.map((t) =>
              t.id === talk.id
                ? { ...t, isRegistered: false, participants: Math.max(0, (t.participants || 1) - 1) }
                : t
            )
          );
        } else {
          Alert.alert('Error', res.error || 'No se pudo cancelar el registro');
        }
      } else {
        const fullName = me ? `${me.firstName || ''} ${me.lastName || ''}`.trim() : undefined;
        const res = await mobileApi.registerTalk(talk.id, fullName, me?.email, me?.phone);
        if (res.ok) {
          Alert.alert(
            '¡Inscripción Exitosa! 🎉',
            `Te has registrado correctamente al conversatorio:\n"${talk.title}"\n\nTe esperamos puntualmente en la sala virtual.`
          );
          setTalks((prev) =>
            prev.map((t) =>
              t.id === talk.id
                ? { ...t, isRegistered: true, participants: (t.participants || 0) + 1 }
                : t
            )
          );
        } else {
          Alert.alert('Error', res.error || 'No se pudo completar el registro');
        }
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Ocurrió un error inesperado');
    } finally {
      setRegisteringId(null);
    }
  };

  const handleShareTalk = async (talk: PublicTalk) => {
    try {
      await Share.share({
        message: `🌟 Te invito al Conversatorio de Luz: "${talk.title}" con ${talk.speaker || 'Conexión Luz'}. Únete aquí: https://conexionluz.com/conversatorios`,
        title: talk.title,
      });
    } catch (e) {
      // ignore
    }
  };

  const formatTalkDate = (dateStr: string) => {
    if (!dateStr) return 'Fecha por confirmar';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      };
      return d.toLocaleDateString('es-ES', options);
    } catch (e) {
      return dateStr;
    }
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
          <Text style={styles.navTitle}>CONVERSATORIOS DE LUZ</Text>
          <Text style={styles.navSubtitle}>Espacios en Vivo & Grabaciones</Text>
        </View>
        <View style={styles.navLiveBadge}>
          <View style={styles.navLiveDot} />
          <Text style={styles.navLiveText}>Online</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0284C7', '#059669']}
            tintColor="#0284C7"
          />
        }
      >
        {/* ===== 2. HERO BANNER PRINCIPAL ===== */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />
          <View style={styles.heroTopTagRow}>
            <View style={styles.heroTagPill}>
              <Radio color="#BAE6FD" size={12} />
              <Text style={styles.heroTagText}>ENCUENTROS TERAPÉUTICOS</Text>
            </View>
            <Text style={styles.heroTagOrg}>Conexión Luz®</Text>
          </View>

          <Text style={styles.heroTitle}>Diálogo, Reflexión y Sanación en Vivo</Text>
          <Text style={styles.heroDesc}>
            Salas virtuales guiadas por terapeutas certificados para profundizar en emociones, hipnosis, duelo, relaciones y despertar de consciencia.
          </Text>

          <View style={styles.heroCountersRow}>
            <View style={styles.counterBox}>
              <Text style={styles.counterVal}>{talks.length}</Text>
              <Text style={styles.counterLabel}>Sesiones</Text>
            </View>
            <View style={styles.counterDivider} />
            <View style={styles.counterBox}>
              <Text style={styles.counterVal}>100%</Text>
              <Text style={styles.counterLabel}>Gratuito</Text>
            </View>
            <View style={styles.counterDivider} />
            <View style={styles.counterBox}>
              <Text style={styles.counterVal}>Zoom</Text>
              <Text style={styles.counterLabel}>Modalidad</Text>
            </View>
          </View>
        </View>

        {/* ===== 3. SEARCH BAR & TABS ===== */}
        <View style={styles.searchBox}>
          <Search color="#94A3B8" size={18} />
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Buscar por tema, título o terapeuta..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <X color="#94A3B8" size={18} />
            </TouchableOpacity>
          )}
        </View>

        {/* MAIN TABS: PRÓXIMOS vs GRABACIONES */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            onPress={() => setActiveTab('future')}
            style={[styles.mainTabBtn, activeTab === 'future' && styles.mainTabBtnActive]}
            activeOpacity={0.8}
          >
            <Radio color={activeTab === 'future' ? '#0284C7' : '#64748B'} size={16} />
            <Text style={[styles.mainTabBtnText, activeTab === 'future' && styles.mainTabBtnTextActive]}>
              Próximos Encuentros
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('past')}
            style={[styles.mainTabBtn, activeTab === 'past' && styles.mainTabBtnActive]}
            activeOpacity={0.8}
          >
            <PlayCircle color={activeTab === 'past' ? '#0284C7' : '#64748B'} size={16} />
            <Text style={[styles.mainTabBtnText, activeTab === 'past' && styles.mainTabBtnTextActive]}>
              Grabaciones Pasadas
            </Text>
          </TouchableOpacity>
        </View>

        {/* TOPICS SCROLL PILLS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topicsScroll}
        >
          {topicsList.map((topic) => {
            const isSelected = selectedTopic === topic;
            return (
              <TouchableOpacity
                key={topic}
                onPress={() => setSelectedTopic(topic)}
                style={[styles.topicPill, isSelected && styles.topicPillActive]}
                activeOpacity={0.75}
              >
                <Text style={[styles.topicPillText, isSelected && styles.topicPillTextActive]}>
                  {topic}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ===== 4. LISTA DE CONVERSATORIOS ===== */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0284C7" />
            <Text style={styles.loadingText}>Cargando conversatorios...</Text>
          </View>
        ) : filteredTalks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Radio color="#CBD5E1" size={40} />
            <Text style={styles.emptyTitle}>
              {activeTab === 'future'
                ? 'No hay conversatorios programados en este momento'
                : 'No se encontraron grabaciones con este filtro'}
            </Text>
            <Text style={styles.emptyDesc}>
              Pronto publicaremos nuevas fechas y temas. Mantente atento/a a la comunidad.
            </Text>
          </View>
        ) : (
          <View style={styles.talksGrid}>
            {filteredTalks.map((talk) => {
              const isExpanded = !!expandedCards[talk.id];
              const isPast = talk.status === 'past' || (talk.startAt && new Date(talk.startAt).getTime() < Date.now() - 3600 * 1000);
              const videoSrc =
                talk.videoUrl ||
                talk.featuredVideoUrl ||
                ((talk as any).mediaUrl && isVideoMedia((talk as any).mediaUrl) ? (talk as any).mediaUrl : null);

              return (
                <View key={talk.id} style={styles.talkCard}>
                  {/* CARD TOP ROW: BADGE & ACTIONS */}
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.cardBadgePill}>
                      <View style={[styles.statusDot, { backgroundColor: isPast ? '#64748B' : '#0284C7' }]} />
                      <Text style={styles.cardBadgeText}>
                        {isPast ? 'GRABACIÓN' : 'EN VIVO'} • {talk.topic || 'General'}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleShareTalk(talk)} style={styles.shareIconBtn}>
                      <Share2 color="#64748B" size={16} />
                    </TouchableOpacity>
                  </View>

                  {/* TITLE */}
                  <Text style={styles.talkTitle}>{talk.title}</Text>

                  {/* DATE & TIME & MODALITY */}
                  <View style={styles.talkMetaGrid}>
                    <View style={styles.talkMetaItem}>
                      <Calendar color="#0284C7" size={14} />
                      <Text style={styles.talkMetaText}>{formatTalkDate(talk.startAt)}</Text>
                    </View>
                    <View style={styles.talkMetaItem}>
                      <Globe color="#059669" size={14} />
                      <Text style={styles.talkMetaText}>
                        {talk.modality || (talk.format === 'presential' ? 'Presencial' : 'Online vía Zoom')}
                      </Text>
                    </View>
                  </View>

                  {/* DESCRIPTION */}
                  {talk.description && (
                    <Text style={styles.talkDesc} numberOfLines={isExpanded ? undefined : 3}>
                      {talk.description}
                    </Text>
                  )}

                  {/* EXPAND AGENDA & DETAILS */}
                  {talk.agenda && talk.agenda.length > 0 && isExpanded && (
                    <View style={styles.agendaBox}>
                      <Text style={styles.agendaHeading}>Puntos clave de la sesión:</Text>
                      {talk.agenda.map((p, idx) => (
                        <View key={idx} style={styles.agendaItemRow}>
                          <CheckCircle2 color="#0284C7" size={12} style={{ marginTop: 2 }} />
                          <Text style={styles.agendaItemText}>{p}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* SPEAKER BOX */}
                  <View style={styles.speakerRow}>
                    <View style={styles.speakerAvatar}>
                      <Text style={styles.speakerAvatarText}>
                        {talk.speaker
                          ? talk.speaker
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .substring(0, 2)
                              .toUpperCase()
                          : 'CL'}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.speakerName}>{talk.speaker || 'Facilitador Conexión Luz'}</Text>
                      <Text style={styles.speakerRole}>Terapeuta & Facilitador</Text>
                    </View>
                    <View style={styles.participantsBadge}>
                      <Users color="#0284C7" size={12} />
                      <Text style={styles.participantsBadgeText}>
                        {talk.participants || 0} inscritos
                      </Text>
                    </View>
                  </View>

                  {/* VIDEO PLAYER (IF RECORDING HAS VIDEO) */}
                  {videoSrc && (
                    <View style={styles.inlineVideoWrapper}>
                      <CustomVideoPlayer
                        src={videoSrc}
                        height={Math.round(width * 0.95)}
                        fullBleed={true}
                        contentFit="contain"
                        autoPlay={false}
                        defaultMuted={false}
                        style={{ width: width }}
                      />
                    </View>
                  )}

                  {/* CARD ACTIONS ROW */}
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      onPress={() => toggleExpand(talk.id)}
                      style={styles.expandToggleBtn}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.expandToggleText}>
                        {isExpanded ? 'Menos' : 'Agenda'}
                      </Text>
                      {isExpanded ? <ChevronUp color="#64748B" size={14} /> : <ChevronDown color="#64748B" size={14} />}
                    </TouchableOpacity>

                    <View style={styles.cardRightBtnsRow}>
                      {/* BOTÓN COMPARTIR EN LA PARTE DE ABAJO */}
                      <TouchableOpacity
                        onPress={() => handleShareTalk(talk)}
                        style={styles.bottomShareBtn}
                        activeOpacity={0.8}
                      >
                        <Share2 color="#0284C7" size={14} />
                        <Text style={styles.bottomShareBtnText}>Compartir</Text>
                      </TouchableOpacity>

                      {!isPast && (
                        <TouchableOpacity
                          onPress={() => handleToggleRegistration(talk)}
                          disabled={registeringId === talk.id}
                          style={[
                            styles.registerBtn,
                            talk.isRegistered && styles.registerBtnActive,
                          ]}
                          activeOpacity={0.85}
                        >
                          {registeringId === talk.id ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                          ) : talk.isRegistered ? (
                            <>
                              <CheckCircle2 color="#FFFFFF" size={14} />
                              <Text style={styles.registerBtnText}>Inscrito</Text>
                            </>
                          ) : (
                            <>
                              <Radio color="#FFFFFF" size={14} />
                              <Text style={styles.registerBtnText}>Inscribirme</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
    color: '#0284C7',
  },
  navLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  navLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0284C7',
  },
  navLiveText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0284C7',
    textTransform: 'uppercase',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },

  // HERO CARD
  heroCard: {
    backgroundColor: '#0369A1',
    borderRadius: 22,
    padding: 18,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0284C7',
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
    backgroundColor: '#38BDF8',
    opacity: 0.3,
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
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  heroTagText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#BAE6FD',
    letterSpacing: 0.5,
  },
  heroTagOrg: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7DD3FC',
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
    color: '#E0F2FE',
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
    color: '#BAE6FD',
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

  // TABS ROW
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 3,
  },
  mainTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 12,
  },
  mainTabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  mainTabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  mainTabBtnTextActive: {
    color: '#0284C7',
    fontWeight: '900',
  },

  // TOPICS SCROLL
  topicsScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  topicPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topicPillActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  topicPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  topicPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // TALKS LIST
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
  talksGrid: {
    marginHorizontal: -16,
    gap: 10,
    backgroundColor: '#F1F5F9',
  },
  talkCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  cardBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cardBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0284C7',
  },
  shareIconBtn: {
    padding: 4,
  },
  talkTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 22,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  talkMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  talkMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  talkMetaText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  talkDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: '#475569',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  agendaBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  agendaHeading: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  agendaItemRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  agendaItemText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
    flex: 1,
  },
  speakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginBottom: 10,
  },
  speakerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerAvatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  speakerName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  speakerRole: {
    fontSize: 10.5,
    color: '#64748B',
  },
  participantsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  participantsBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0284C7',
  },
  inlineVideoWrapper: {
    width: width,
    marginBottom: 12,
    marginTop: 6,
    backgroundColor: '#020617',
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  expandToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expandToggleText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  cardRightBtnsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bottomShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  bottomShareBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0284C7',
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0284C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  registerBtnActive: {
    backgroundColor: '#059669',
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});

