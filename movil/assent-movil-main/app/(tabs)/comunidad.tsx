import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Users,
  Video,
  BookOpen,
  MessageSquareText,
  Star,
  Sparkles,
  CheckCircle2,
  Radio,
  ArrowRight,
} from 'lucide-react-native';
import { useTabBarVisibility } from '../../context/TabBarVisibilityContext';
import { LumiHeaderBadge } from '../../components/LumiHeaderBadge';
import { LumiWalletModal } from '../../components/LumiWalletModal';

interface SubjectItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  accentBg: string;
  highlights: string[];
  actionText: string;
}

const ASIGNATURAS_COMUNIDAD: SubjectItem[] = [
  {
    id: 'guias-de-luz',
    title: 'Guías de Luz & Terapeutas',
    subtitle: 'Conoce los perfiles de nuestros psicólogos y terapeutas, mira sus aportes o agenda tu cita.',
    badge: 'EQUIPO CLÍNICO',
    icon: Sparkles,
    color: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    accentBg: '#059669',
    highlights: ['Perfiles verificados', 'Publicaciones & Consejos', 'Agendamiento directo'],
    actionText: 'Conocer Terapeutas',
  },
  {
    id: 'conversatorios',
    title: 'Conversatorios en Vivo',
    subtitle: 'Encuentros grupales con terapeutas en tiempo real para dialogar y sanar.',
    badge: 'EN DIRECTO',
    icon: Radio,
    color: '#0284C7',
    bgColor: '#F0F9FF',
    borderColor: '#BAE6FD',
    accentBg: '#0284C7',
    highlights: ['Preguntas en vivo', 'Terapeutas expertos', 'Grabaciones'],
    actionText: 'Entrar a Conversatorios',
  },
  {
    id: 'cursos',
    title: 'Cursos & Talleres Cuánticos',
    subtitle: 'Programas de hipnosis, reprogramación subconsciente y transformación interior.',
    badge: 'FORMACIÓN',
    icon: Video,
    color: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    accentBg: '#059669',
    highlights: ['Clases en video', 'Ejercicios prácticos', 'A tu propio ritmo'],
    actionText: 'Explorar Cursos',
  },
  {
    id: 'historias',
    title: 'Historias de Sanación',
    subtitle: 'Relatos conmovedores de resiliencia y superación compartidos por miembros.',
    badge: 'INSPIRACIÓN',
    icon: BookOpen,
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    accentBg: '#7C3AED',
    highlights: ['Casos reales', 'Crecimiento personal', 'Comentarios compasivos'],
    actionText: 'Leer Historias',
  },
  {
    id: 'foro',
    title: 'Foro de la Tribu',
    subtitle: 'Pregunta, comparte tus vivencias y recibe respuestas respetuosas y amorosas.',
    badge: 'DIÁLOGO ABIERTO',
    icon: MessageSquareText,
    color: '#DB2777',
    bgColor: '#FDF2F8',
    borderColor: '#FBCFE8',
    accentBg: '#DB2777',
    highlights: ['Sin juicios', 'Moderación activa', 'Hilos temáticos'],
    actionText: 'Participar en el Foro',
  },
  {
    id: 'testimonios',
    title: 'Testimonios de Pacientes',
    subtitle: 'Voces reales y transformaciones de personas que sanaron con Conexión Luz®.',
    badge: 'VOCES REALES',
    icon: Star,
    color: '#D97706',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    accentBg: '#D97706',
    highlights: ['Resultados reales', 'Audios y videos', 'Pacientes verificados'],
    actionText: 'Ver Testimonios',
  },
];

export default function Comunidad() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const { isTabBarVisible, setIsTabBarVisible } = useTabBarVisibility();
  const lastScrollYRef = useRef<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showLumiWalletModal, setShowLumiWalletModal] = useState<boolean>(false);

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

  const handleOpenSubject = (subject: SubjectItem) => {
    if (subject.id === 'guias-de-luz') {
      router.push('/guias-de-luz' as any);
    } else if (subject.id === 'conversatorios') {
      router.push('/conversatorios' as any);
    } else if (subject.id === 'cursos') {
      router.push('/cursos' as any);
    } else if (subject.id === 'historias') {
      router.push('/historias' as any);
    } else if (subject.id === 'foro') {
      router.push('/foro' as any);
    } else if (subject.id === 'testimonios') {
      router.push('/testimonios' as any);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 400);
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={true} />

      {/* HEADER BAR */}
      <View style={styles.headerBar}>
        <View style={styles.headerBrand}>
          <View style={styles.logoBadge}>
            <Users color="#059669" size={20} />
          </View>
          <View>
            <Text style={styles.headerTitle}>COMUNIDAD DE LUZ</Text>
            <Text style={styles.headerSubtitle}>Elige tu asignatura y explora</Text>
          </View>
        </View>
        <View style={styles.headerPill}>
          <Sparkles color="#059669" size={13} />
          <Text style={styles.headerPillText}>Espacio Seguro</Text>
        </View>
      </View>

      {/* FIXED LUMIS BANNER */}
      <LumiHeaderBadge
        variant="banner"
        onPress={() => router.push('/comprar-lumis' as any)}
      />

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
        {/* BANNER COMPACTO Y VISUAL */}
        <View style={styles.introBanner}>
          <View style={styles.introLeft}>
            <Text style={styles.introTag}>SANTUARIO COLECTIVO</Text>
            <Text style={styles.introTitle}>Aprende, Dialoga y Sana</Text>
            <Text style={styles.introDesc}>
              Selecciona una asignatura para acceder a sus clases, encuentros y testimonios.
            </Text>
          </View>
          <View style={styles.introIconBubble}>
            <Sparkles color="#FFFFFF" size={22} />
          </View>
        </View>

        {/* LISTA DE CUADROS POR ASIGNATURA */}
        <View style={styles.subjectsContainer}>
          {ASIGNATURAS_COMUNIDAD.map((subject) => {
            const IconComp = subject.icon;
            return (
              <TouchableOpacity
                key={subject.id}
                onPress={() => handleOpenSubject(subject)}
                style={[
                  styles.subjectBox,
                  { backgroundColor: subject.bgColor, borderColor: subject.borderColor },
                ]}
                activeOpacity={0.88}
              >
                {/* TOP ROW: ICON + BADGE */}
                <View style={styles.subjectTopRow}>
                  <View style={[styles.subjectIconWrapper, { backgroundColor: subject.accentBg }]}>
                    <IconComp color="#FFFFFF" size={20} />
                  </View>
                  <View
                    style={[
                      styles.subjectBadge,
                      { borderColor: subject.borderColor, backgroundColor: '#FFFFFF' },
                    ]}
                  >
                    <Text style={[styles.subjectBadgeText, { color: subject.color }]}>
                      {subject.badge}
                    </Text>
                  </View>
                </View>

                {/* TITLE & DESCRIPTION */}
                <Text style={styles.subjectTitle}>{subject.title}</Text>
                <Text style={styles.subjectSubtitle}>{subject.subtitle}</Text>

                {/* HIGHLIGHT PILLS */}
                <View style={styles.highlightsRow}>
                  {subject.highlights.map((item, idx) => (
                    <View key={idx} style={styles.highlightChip}>
                      <CheckCircle2 color={subject.color} size={11} />
                      <Text style={styles.highlightChipText}>{item}</Text>
                    </View>
                  ))}
                </View>

                {/* ACTION CTA BUTTON */}
                <View style={[styles.subjectActionBtn, { backgroundColor: subject.accentBg }]}>
                  <Text style={styles.subjectActionBtnText}>{subject.actionText}</Text>
                  <ArrowRight color="#FFFFFF" size={15} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.4,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  headerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  headerPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#047857',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },

  // INTRO BANNER
  introBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#064E3B',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  introLeft: {
    flex: 1,
    paddingRight: 10,
  },
  introTag: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#A7F3D0',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  introTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  introDesc: {
    fontSize: 11.5,
    color: '#D1FAE5',
    lineHeight: 16,
  },
  introIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // SUBJECTS GRID / BOXES
  subjectsContainer: {
    gap: 14,
  },
  subjectBox: {
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  subjectTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  subjectBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  subjectBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  subjectTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  subjectSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: '#475569',
    marginBottom: 12,
  },
  highlightsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  highlightChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  highlightChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  subjectActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
  },
  subjectActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
