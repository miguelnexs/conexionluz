import React, { useState, useEffect, useRef } from 'react';
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
  NativeSyntheticEvent,
  NativeScrollEvent,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Users,
  Video,
  MessageCircle,
  BookOpen,
  MessageSquareText,
  Star,
  Sparkles,
  ChevronRight,
  X,
  Send,
  Heart,
  Calendar,
  CheckCircle2,
} from 'lucide-react-native';
import { mobileApi, normalizeMediaUrl } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useTabBarVisibility } from '../../context/TabBarVisibilityContext';

interface SubLinkItem {
  id: string;
  name: string;
  desc: string;
  icon: any;
  color: string;
  bgColor: string;
  badge: string;
}

const COMUNIDAD_SUBLINKS: SubLinkItem[] = [
  {
    id: 'cursos',
    name: 'Cursos en Línea',
    desc: 'Programas de autoconocimiento, gestión emocional y salud mental a tu ritmo.',
    icon: Video,
    color: '#6366F1',
    bgColor: '#EEF2FF',
    badge: 'Educación',
  },
  {
    id: 'conversatorios',
    name: 'Conversatorios en Vivo',
    desc: 'Espacios grupales de diálogo dirigidos por terapeutas sobre temas de bienestar.',
    icon: MessageCircle,
    color: '#0EA5E9',
    bgColor: '#E0F2FE',
    badge: 'En Vivo',
  },
  {
    id: 'historias',
    name: 'Historias de Sanación',
    desc: 'Relatos inspiradores de superación, resiliencia y aprendizaje en comunidad.',
    icon: BookOpen,
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    badge: 'Inspiración',
  },
  {
    id: 'foro',
    name: 'Foro de Discusión',
    desc: 'Pregunta, comparte vivencias y recibe respuestas respetuosas de miembros.',
    icon: MessageSquareText,
    color: '#EC4899',
    bgColor: '#FDF2F8',
    badge: 'Comunidad',
  },
  {
    id: 'testimonios',
    name: 'Testimonios',
    desc: 'Voces reales de personas que han transformado su vida con Conexión Luz®.',
    icon: Star,
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    badge: 'Voces',
  },
];

export default function Comunidad() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const { user: currentUser } = useAuth();
  const { isTabBarVisible, setIsTabBarVisible } = useTabBarVisibility();
  const lastScrollYRef = useRef<number>(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollYRef.current;

    if (currentY <= 50) {
      if (!isTabBarVisible) setIsTabBarVisible(true);
      lastScrollYRef.current = currentY;
      return;
    }

    if (diff > 10 && isTabBarVisible) {
      setIsTabBarVisible(false);
    } else if (diff < -6 && !isTabBarVisible) {
      setIsTabBarVisible(true);
    }

    lastScrollYRef.current = currentY;
  };

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeSubLink) {
      await handleOpenSubLink(activeSubLink);
    }
    setRefreshing(false);
  };

  const [activeSubLink, setActiveSubLink] = useState<SubLinkItem | null>(null);
  const [modalData, setModalData] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  // Load backend content for sublinks
  const handleOpenSubLink = async (sublink: SubLinkItem) => {
    setActiveSubLink(sublink);
    setModalLoading(true);
    setModalData([]);

    try {
      if (sublink.id === 'cursos') {
        const res = await mobileApi.fetchPublicCourses();
        if (res.ok && Array.isArray(res.data)) setModalData(res.data);
      } else if (sublink.id === 'conversatorios') {
        const res = await mobileApi.fetchPublicTalks();
        if (res.ok && Array.isArray(res.data)) setModalData(res.data);
      } else if (sublink.id === 'historias') {
        const res = await mobileApi.fetchStories();
        if (res.ok && Array.isArray(res.data)) setModalData(res.data);
      } else if (sublink.id === 'foro') {
        const res = await mobileApi.fetchForumTopics();
        if (res.ok && Array.isArray(res.data)) setModalData(res.data);
      } else if (sublink.id === 'testimonios') {
        const res = await mobileApi.fetchTestimonials();
        if (res.ok && Array.isArray(res.data)) setModalData(res.data);
      }
    } catch (e) {
      console.log('Error loading sublink:', e);
    }
    setModalLoading(false);
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent={true} />

      {/* HEADER BAR WITH LOGO */}
      <View style={styles.headerBar}>
        <View style={styles.brandLogoRow}>
          <View style={styles.logoBadgeIcon}>
            <Users color="#059669" size={20} />
          </View>
          <View>
            <Text style={styles.brandTitleText}>COMUNIDAD</Text>
            <Text style={styles.brandSubtitleText}>Subenlaces & Espacios de Conexión</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#059669', '#0D9488']}
            tintColor="#059669"
          />
        }
      >
        <Text style={styles.sectionHeading}>Secciones de Comunidad</Text>
        <Text style={styles.sectionSubheading}>Selecciona cualquier enlace para explorar los contenidos oficiales.</Text>

        {/* SUBLINKS LIST */}
        <View style={styles.sublinksList}>
          {COMUNIDAD_SUBLINKS.map((item) => {
            const IconComp = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleOpenSubLink(item)}
                style={styles.sublinkCard}
                activeOpacity={0.8}
              >
                <View style={[styles.sublinkIconBox, { backgroundColor: item.bgColor }]}>
                  <IconComp color={item.color} size={22} />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.sublinkTitleRow}>
                    <Text style={styles.sublinkNameText}>{item.name}</Text>
                    <View style={[styles.badgePill, { backgroundColor: item.bgColor }]}>
                      <Text style={[styles.badgeText, { color: item.color }]}>{item.badge}</Text>
                    </View>
                  </View>
                  <Text style={styles.sublinkDescText} numberOfLines={2}>
                    {item.desc}
                  </Text>
                </View>

                <ChevronRight color="#CBD5E1" size={18} />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* DETAILED SUBLINK MODAL SHEET */}
      <Modal visible={!!activeSubLink} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              {activeSubLink && (
                <View style={[styles.sublinkIconBox, { backgroundColor: activeSubLink.bgColor }]}>
                  {React.createElement(activeSubLink.icon, { color: activeSubLink.color, size: 22 })}
                </View>
              )}
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.modalTitle}>{activeSubLink?.name}</Text>
                <Text style={styles.modalSubtitle}>{activeSubLink?.desc}</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveSubLink(null)} style={styles.closeModalBtn}>
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            {modalLoading ? (
              <ActivityIndicator size="small" color="#059669" style={{ marginVertical: 30 }} />
            ) : (
              <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
                {modalData.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <Sparkles color="#059669" size={24} />
                    <Text style={styles.emptyText}>Contenidos actualizados constantemente en la plataforma.</Text>
                  </View>
                ) : (
                  modalData.map((dataItem: any, idx: number) => (
                    <View key={dataItem.id || idx} style={styles.detailItemCard}>
                      <Text style={styles.detailItemTitle}>
                        {dataItem.title || dataItem.name || dataItem.authorName || 'Publicación en Comunidad'}
                      </Text>
                      <Text style={styles.detailItemDesc} numberOfLines={3}>
                        {dataItem.description || dataItem.content || dataItem.comment || 'Contenido disponible en Conexión Luz®.'}
                      </Text>
                    </View>
                  ))
                )}
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  brandLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadgeIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  brandTitleText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  brandSubtitleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    marginTop: -2,
  },
  scrollContent: {
    padding: 16,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  sectionSubheading: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 16,
  },
  sublinksList: {
    gap: 12,
  },
  sublinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  sublinkIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sublinkTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  sublinkNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  badgePill: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  sublinkDescText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeModalBtn: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  emptyBox: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
  detailItemCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailItemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  detailItemDesc: {
    fontSize: 11,
    color: '#475569',
    marginTop: 4,
  },
});
