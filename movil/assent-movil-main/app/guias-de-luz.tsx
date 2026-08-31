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
  Dimensions,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import {
  ChevronLeft,
  Search,
  Sparkles,
  Award,
  Calendar,
  Heart,
  Users,
  MessageCircle,
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
  User,
  UserCheck,
  CheckCircle2,
  Share2,
  X,
  Plus,
  Send,
} from 'lucide-react-native';
import { mobileApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const SPECIALTY_FILTERS = [
  'Todos',
  'Psicología Clínica',
  'Ansiedad & Estrés',
  'Terapia de Pareja',
  'Duelo & Tanatología',
  'Mindfulness',
];

export interface TherapistItem {
  id: number;
  name: string;
  role?: string;
  title?: string;
  specialty?: string;
  avatar?: string;
  image_url?: string;
  bio?: string;
  description?: string;
  rating?: number;
  years_experience?: number;
  experience?: string;
  certifications?: string[];
  followersCount?: number;
  online?: boolean;
}

export default function GuiasDeLuzScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [therapists, setTherapists] = useState<TherapistItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('Todos');

  // Follow states mapped by therapist id
  const [followMap, setFollowMap] = useState<Record<number, { isFollowing: boolean; count: number }>>({});
  const [loadingFollowId, setLoadingFollowId] = useState<number | null>(null);

  // Community profile modal state
  const [selectedTherapistProfile, setSelectedTherapistProfile] = useState<TherapistItem | null>(null);

  useEffect(() => {
    loadTherapistsData();
  }, []);

  const loadTherapistsData = async () => {
    setLoading(true);
    try {
      const res = await mobileApi.fetchTherapists();
      if (res.ok && Array.isArray(res.data)) {
        const list = res.data.map((t: any) => ({
          ...t,
          rating: t.rating || 4.9,
          certifications: t.certifications && t.certifications.length > 0
            ? t.certifications
            : ['Psicología Clínica Basada en Evidencia', 'Terapia Cognitivo-Conductual', 'Mindfulness y Regulación Emocional'],
          followersCount: t.followers_count || Math.floor(Math.random() * 80) + 40,
        }));
        setTherapists(list);

        // Fetch follow status for each therapist if logged in
        if (isAuthenticated) {
          const statuses: Record<number, { isFollowing: boolean; count: number }> = {};
          await Promise.all(
            list.map(async (th: any) => {
              try {
                const st = await mobileApi.getTherapistFollowStatus(th.id);
                if (st.ok && st.data) {
                  statuses[th.id] = {
                    isFollowing: Boolean(st.data.isFollowing),
                    count: typeof st.data.followersCount === 'number' ? st.data.followersCount : (th.followersCount || 50),
                  };
                }
              } catch {}
            })
          );
          setFollowMap(statuses);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFollow = async (therapist: TherapistItem) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Inicia Sesión',
        'Crea una cuenta o inicia sesión para seguir a los Guías de Luz y recibir sus publicaciones en tu comunidad.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ir a Inicio', onPress: () => router.push('/(tabs)/profile' as any) },
        ]
      );
      return;
    }

    setLoadingFollowId(therapist.id);
    try {
      const res = await mobileApi.toggleFollowTherapist(therapist.id);
      if (res.ok && res.data) {
        setFollowMap((prev) => ({
          ...prev,
          [therapist.id]: {
            isFollowing: Boolean(res.data.isFollowing),
            count: typeof res.data.followersCount === 'number' ? res.data.followersCount : (prev[therapist.id]?.count || 50),
          },
        }));
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo actualizar el seguimiento.');
    } finally {
      setLoadingFollowId(null);
    }
  };

  const handleShareTherapist = async (therapist: TherapistItem) => {
    try {
      await Share.share({
        title: `Guía de Luz: ${therapist.name} - ConexiónLuz`,
        message: `Te recomiendo a ${therapist.name}, especialista en bienestar y acompañamiento psicológico en ConexiónLuz®: https://conexionluz.com/terapeutas`,
      });
    } catch {}
  };

  const filteredTherapists = useMemo(() => {
    return therapists.filter((t) => {
      const matchSearch =
        !searchQuery.trim() ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.role && t.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.specialty && t.specialty.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchFilter =
        activeFilter === 'Todos' ||
        (t.role && t.role.toLowerCase().includes(activeFilter.toLowerCase())) ||
        (t.specialty && t.specialty.toLowerCase().includes(activeFilter.toLowerCase())) ||
        (t.description && t.description.toLowerCase().includes(activeFilter.toLowerCase()));

      return matchSearch && matchFilter;
    });
  }, [therapists, searchQuery, activeFilter]);

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={true} />

      {/* ── TOP HEADER ── */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackBtn} activeOpacity={0.7}>
          <ChevronLeft color="#0F172A" size={24} />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerMainTitle}>Guías de Luz</Text>
          <Text style={styles.headerSubTitle}>🌿 Terapeutas & Miembros Oficiales</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/agenda' as any)}
          style={styles.agendaQuickBtn}
          activeOpacity={0.85}
        >
          <Calendar color="#FFFFFF" size={15} />
          <Text style={styles.agendaQuickBtnText}>Agendar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── HERO BANNER ── */}
        <View style={styles.heroBanner}>
          <View style={styles.heroBadge}>
            <Sparkles color="#D97706" size={13} />
            <Text style={styles.heroBadgeText}>EQUIPO CLÍNICO & COMUNIDAD</Text>
          </View>

          <Text style={styles.heroTitle}>Conoce a Nuestros Guías de Luz</Text>
          <Text style={styles.heroDesc}>
            Profesionales de la salud mental y bienestar integral disponibles en la comunidad. Síguelos para ver sus consejos o agenda tu sesión personalizada.
          </Text>
        </View>

        {/* ── SEARCH BAR ── */}
        <View style={styles.searchBarBox}>
          <Search color="#94A3B8" size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar terapeuta por nombre o especialidad..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
              <X color="#64748B" size={16} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── SPECIALTY FILTER CHIPS ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollRow}
        >
          {SPECIALTY_FILTERS.map((f) => {
            const isSelected = activeFilter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setActiveFilter(f)}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── LIST OF THERAPISTS / GUIDES OF LIGHT ── */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Cargando Guías de Luz de la comunidad...</Text>
          </View>
        ) : filteredTherapists.length > 0 ? (
          <View style={styles.therapistsCardsList}>
            {filteredTherapists.map((therapist) => {
              const avatarUrl = therapist.avatar || therapist.image_url;
              const followInfo = followMap[therapist.id] || {
                isFollowing: false,
                count: therapist.followersCount || 48,
              };

              return (
                <View key={therapist.id} style={styles.therapistCard}>
                  {/* CARD TOP DECORATIVE BANNER */}
                  <View style={styles.cardCoverBanner}>
                    <View style={styles.verifiedTagPill}>
                      <ShieldCheck color="#047857" size={12} />
                      <Text style={styles.verifiedTagPillText}>GUÍA DE LUZ OFICIAL</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleShareTherapist(therapist)}
                      style={styles.cardShareBtn}
                      activeOpacity={0.7}
                    >
                      <Share2 color="#475569" size={16} />
                    </TouchableOpacity>
                  </View>

                  {/* AVATAR & BASIC INFO */}
                  <View style={styles.cardMainHeader}>
                    <TouchableOpacity
                      onPress={() => {
                        router.push({
                          pathname: '/perfil-usuario',
                          params: {
                            authorName: therapist.name,
                            therapistId: String(therapist.id),
                            avatarUrl: avatarUrl || '',
                            coverUrl: therapist.cover_image || therapist.cover_url || therapist.coverPictureUrl || therapist.cover || '',
                            role: therapist.role || 'GUÍA DE LUZ',
                            bio: therapist.description || therapist.bio || '',
                          },
                        } as any);
                      }}
                      activeOpacity={0.85}
                      style={styles.avatarTouchWrapper}
                    >
                      {avatarUrl ? (
                        <Image source={{ uri: avatarUrl }} style={styles.therapistAvatarImg} />
                      ) : (
                        <View style={styles.avatarFallback}>
                          <Text style={styles.avatarFallbackInitial}>{(therapist.name || 'T')[0]}</Text>
                        </View>
                      )}
                      <View style={styles.onlineBadgeDot} />
                    </TouchableOpacity>

                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <TouchableOpacity
                        onPress={() => {
                          router.push({
                            pathname: '/perfil-usuario',
                            params: {
                              authorName: therapist.name,
                              therapistId: String(therapist.id),
                              avatarUrl: avatarUrl || '',
                              coverUrl: therapist.cover_image || therapist.cover_url || therapist.coverPictureUrl || therapist.cover || '',
                              role: therapist.role || 'GUÍA DE LUZ',
                              bio: therapist.description || therapist.bio || '',
                            },
                          } as any);
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.therapistCardName}>{therapist.name}</Text>
                      </TouchableOpacity>

                      <Text style={styles.therapistCardRole} numberOfLines={1}>
                        {therapist.role || therapist.specialty || 'Psicólogo Clínico & Terapeuta'}
                      </Text>

                      <View style={styles.ratingAndExpRow}>
                        <View style={styles.ratingPill}>
                          <Star color="#F59E0B" size={11} fill="#F59E0B" />
                          <Text style={styles.ratingPillText}>{therapist.rating || '4.9'}</Text>
                        </View>
                        <Text style={styles.expText}>
                          • {therapist.years_experience ? `${therapist.years_experience} años exp.` : 'Consulta Certificada'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* BIO / DESCRIPTION */}
                  <Text style={styles.therapistBioText} numberOfLines={3}>
                    {therapist.description ||
                      therapist.bio ||
                      'Especialista en salud mental, regulación emocional y acompañamiento clínico en el portal ConexiónLuz®.'}
                  </Text>

                  {/* CERTIFICATIONS PILLS */}
                  {therapist.certifications && therapist.certifications.length > 0 && (
                    <View style={styles.certificationsRow}>
                      {therapist.certifications.slice(0, 2).map((cert, idx) => (
                        <View key={idx} style={styles.certBadge}>
                          <Award color="#059669" size={11} />
                          <Text style={styles.certBadgeText} numberOfLines={1}>
                            {cert}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* COMMUNITY STATS & FOLLOW BUTTON */}
                  <View style={styles.cardCommunityFooter}>
                    <View style={styles.followersStatItem}>
                      <Users color="#64748B" size={14} />
                      <Text style={styles.followersStatText}>
                        <Text style={{ fontWeight: '900', color: '#0F172A' }}>{followInfo.count}</Text> seguidores
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleToggleFollow(therapist)}
                      disabled={loadingFollowId === therapist.id}
                      style={[
                        styles.followActionBtn,
                        followInfo.isFollowing && styles.followActionBtnActive,
                      ]}
                      activeOpacity={0.8}
                    >
                      {loadingFollowId === therapist.id ? (
                        <ActivityIndicator size="small" color={followInfo.isFollowing ? '#475569' : '#FFFFFF'} />
                      ) : followInfo.isFollowing ? (
                        <>
                          <UserCheck color="#059669" size={14} />
                          <Text style={styles.followActionBtnTextActive}>Siguiendo</Text>
                        </>
                      ) : (
                        <>
                          <Plus color="#FFFFFF" size={14} />
                          <Text style={styles.followActionBtnText}>Seguir</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>

                  {/* DUAL ACTION BUTTONS */}
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      onPress={() => {
                        router.push({
                          pathname: '/perfil-usuario',
                          params: {
                            authorName: therapist.name,
                            therapistId: String(therapist.id),
                            avatarUrl: avatarUrl || '',
                            coverUrl: therapist.cover_image || therapist.cover_url || therapist.coverPictureUrl || therapist.cover || '',
                            role: therapist.role || 'GUÍA DE LUZ',
                            bio: therapist.description || therapist.bio || '',
                          },
                        } as any);
                      }}
                      style={styles.viewCommunityProfileBtn}
                      activeOpacity={0.8}
                    >
                      <User color="#0F172A" size={15} />
                      <Text style={styles.viewCommunityProfileBtnText}>Ver Perfil de Usuario</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        router.push({
                          pathname: '/agenda',
                          params: { therapistId: String(therapist.id) },
                        } as any);
                      }}
                      style={styles.agendarCitaCardBtn}
                      activeOpacity={0.88}
                    >
                      <Calendar color="#FFFFFF" size={15} />
                      <Text style={styles.agendarCitaCardBtnText}>Agendar Cita</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyStateBox}>
            <Sparkles color="#94A3B8" size={36} />
            <Text style={styles.emptyStateTitle}>No se encontraron Guías de Luz</Text>
            <Text style={styles.emptyStateDesc}>
              Prueba cambiando los filtros de especialidad o la búsqueda.
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── MODAL: FULL COMMUNITY PROFILE OF GUÍA DE LUZ ── */}
      <Modal
        visible={Boolean(selectedTherapistProfile)}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedTherapistProfile(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.profileModalCard}>
            {selectedTherapistProfile && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
                {/* MODAL HEADER & CLOSE */}
                <View style={styles.profileModalTopRow}>
                  <Text style={styles.profileModalTitleHeader}>Perfil de Miembro en Comunidad</Text>
                  <TouchableOpacity
                    onPress={() => setSelectedTherapistProfile(null)}
                    style={styles.modalCloseBtn}
                    activeOpacity={0.7}
                  >
                    <X color="#64748B" size={20} />
                  </TouchableOpacity>
                </View>

                {/* USER PROFILE CARD HEADER */}
                <View style={styles.profileHeaderBox}>
                  <View style={styles.profileAvatarBigWrapper}>
                    {selectedTherapistProfile.avatar || selectedTherapistProfile.image_url ? (
                      <Image
                        source={{ uri: selectedTherapistProfile.avatar || selectedTherapistProfile.image_url }}
                        style={styles.profileAvatarBigImg}
                      />
                    ) : (
                      <View style={[styles.avatarFallback, { width: 72, height: 72, borderRadius: 36 }]}>
                        <Text style={[styles.avatarFallbackInitial, { fontSize: 28 }]}>
                          {(selectedTherapistProfile.name || 'T')[0]}
                        </Text>
                      </View>
                    )}
                    <View style={[styles.onlineBadgeDot, { width: 14, height: 14, borderRadius: 7 }]} />
                  </View>

                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <View style={styles.memberBadgeOfficial}>
                      <ShieldCheck color="#047857" size={13} />
                      <Text style={styles.memberBadgeOfficialText}>GUÍA DE LUZ OFICIAL</Text>
                    </View>

                    <Text style={styles.profileBigName}>{selectedTherapistProfile.name}</Text>
                    <Text style={styles.profileBigRole}>
                      {selectedTherapistProfile.role || selectedTherapistProfile.specialty || 'Psicología Clínica & Bienestar'}
                    </Text>
                  </View>
                </View>

                {/* COMMUNITY REPUTATION STATS */}
                <View style={styles.communityStatsCard}>
                  <View style={styles.statCol}>
                    <Text style={styles.statNumber}>
                      {followMap[selectedTherapistProfile.id]?.count || selectedTherapistProfile.followersCount || 52}
                    </Text>
                    <Text style={styles.statLabel}>Seguidores</Text>
                  </View>
                  <View style={styles.statColDivider} />
                  <View style={styles.statCol}>
                    <Text style={styles.statNumber}>{selectedTherapistProfile.rating || 4.9} ⭐</Text>
                    <Text style={styles.statLabel}>Calificación</Text>
                  </View>
                  <View style={styles.statColDivider} />
                  <View style={styles.statCol}>
                    <Text style={styles.statNumber}>100%</Text>
                    <Text style={styles.statLabel}>Respuesta</Text>
                  </View>
                </View>

                {/* ABOUT / BIOGRAPHY */}
                <View style={styles.profileSectionBox}>
                  <Text style={styles.profileSectionHeading}>🌿 Acerca del Especialista</Text>
                  <Text style={styles.profileSectionBody}>
                    {selectedTherapistProfile.description ||
                      selectedTherapistProfile.bio ||
                      'Profesional dedicado al acompañamiento terapéutico, transformación emocional y bienestar de los miembros de la comunidad ConexiónLuz®.'}
                  </Text>
                </View>

                {/* CERTIFICATIONS & FORMATION */}
                {selectedTherapistProfile.certifications && (
                  <View style={styles.profileSectionBox}>
                    <Text style={styles.profileSectionHeading}>🎓 Certificaciones y Acreditaciones</Text>
                    <View style={styles.certificationsGrid}>
                      {selectedTherapistProfile.certifications.map((c, i) => (
                        <View key={i} style={styles.modalCertItem}>
                          <CheckCircle2 color="#059669" size={15} />
                          <Text style={styles.modalCertItemText}>{c}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* ACTIONS IN MODAL */}
                <View style={styles.modalCtasRow}>
                  <TouchableOpacity
                    onPress={() => {
                      const t = selectedTherapistProfile;
                      setSelectedTherapistProfile(null);
                      router.push({
                        pathname: '/agenda',
                        params: { therapistId: String(t.id) },
                      } as any);
                    }}
                    style={styles.modalAgendarPrimaryBtn}
                    activeOpacity={0.88}
                  >
                    <Calendar color="#FFFFFF" size={17} />
                    <Text style={styles.modalAgendarPrimaryBtnText}>Agendar Cita con {selectedTherapistProfile.name.split(' ')[0]}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerMainTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  headerSubTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    marginTop: 1,
  },
  agendaQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  agendaQuickBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  scrollContent: {
    padding: 16,
    gap: 14,
  },

  // HERO BANNER
  heroBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  heroDesc: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },

  // SEARCH BAR
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },

  // FILTERS
  filtersScrollRow: {
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 12,
  },
  filterChipActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#047857',
    fontWeight: '900',
  },

  // THERAPIST CARD
  therapistsCardsList: {
    gap: 16,
  },
  therapistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    gap: 12,
  },
  cardCoverBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: -4,
  },
  verifiedTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedTagPillText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#047857',
  },
  cardShareBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarTouchWrapper: {
    position: 'relative',
  },
  therapistAvatarImg: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E2E8F0',
  },
  avatarFallback: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackInitial: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  onlineBadgeDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  therapistCardName: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  therapistCardRole: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  ratingAndExpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  ratingPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#B45309',
  },
  expText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },

  therapistBioText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
  certificationsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  certBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  certBadgeText: {
    fontSize: 10.5,
    color: '#334155',
    fontWeight: '700',
    maxWidth: width * 0.65,
  },

  cardCommunityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  followersStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  followersStatText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  followActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  followActionBtnActive: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  followActionBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  followActionBtnTextActive: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#047857',
  },

  // CARD ACTIONS
  cardActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  viewCommunityProfileBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingVertical: 10,
    borderRadius: 12,
  },
  viewCommunityProfileBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  agendarCitaCardBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 12,
  },
  agendarCitaCardBtnText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  emptyStateBox: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  emptyStateDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },

  // PROFILE MODAL
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  profileModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    padding: 20,
  },
  profileModalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  profileModalTitleHeader: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHeaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatarBigWrapper: {
    position: 'relative',
  },
  profileAvatarBigImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E2E8F0',
  },
  memberBadgeOfficial: {
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
  memberBadgeOfficialText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#047857',
  },
  profileBigName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  profileBigRole: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  communityStatsCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statColDivider: {
    width: 1,
    backgroundColor: '#CBD5E1',
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 2,
  },
  profileSectionBox: {
    marginBottom: 16,
    gap: 6,
  },
  profileSectionHeading: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  profileSectionBody: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
  certificationsGrid: {
    gap: 6,
  },
  modalCertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 10,
  },
  modalCertItemText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  modalCtasRow: {
    marginTop: 8,
  },
  modalAgendarPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  modalAgendarPrimaryBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
