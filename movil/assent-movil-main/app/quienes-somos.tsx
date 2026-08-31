import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  StatusBar,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Globe,
  ExternalLink,
  Heart,
  Sparkles,
  Compass,
  Award,
  Lightbulb,
  Scale,
  Brain,
  Layers,
  ChevronRight,
  Phone,
  HelpCircle,
  Shield,
  Flame,
  UserCheck,
  Eye,
  CheckCircle2,
  Share2,
} from 'lucide-react-native';

const VALUES = [
  {
    title: 'Empatía',
    desc: 'Comprendemos la historia, el dolor y las aspiraciones de cada persona sin emitir juicios ni prejuicios.',
    icon: Heart,
    color: '#EC4899',
    bgColor: '#FDF2F8',
  },
  {
    title: 'Respeto',
    desc: 'Honramos la dignidad, diversidad, autonomía y ritmos individuales de cada consultante.',
    icon: UserCheck,
    color: '#059669',
    bgColor: '#ECFDF5',
  },
  {
    title: 'Ética y Confidencialidad',
    desc: 'Actuamos bajo el más riguroso secreto profesional, honestidad clínica e integridad moral.',
    icon: Scale,
    color: '#6366F1',
    bgColor: '#EEF2FF',
  },
  {
    title: 'Compromiso',
    desc: 'Acompañamos cada camino de sanación con entrega, calidez humana y constante presencia.',
    icon: Compass,
    color: '#0284C7',
    bgColor: '#F0F9FF',
  },
  {
    title: 'Excelencia',
    desc: 'Actualizamos continuamente nuestros conocimientos, técnicas terapéuticas y calidad humana.',
    icon: Award,
    color: '#D97706',
    bgColor: '#FFFBEB',
  },
  {
    title: 'Innovación',
    desc: 'Integramos neurociencia, psicología cuántica y tecnología digital accesible para tu bienestar.',
    icon: Lightbulb,
    color: '#0D9488',
    bgColor: '#F0FDFA',
  },
  {
    title: 'Humanismo',
    desc: 'Creemos profundamente en el potencial innato de todo ser para transformarse y reconectar con su luz.',
    icon: Sparkles,
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
  },
];

const AWE_PILLARS = [
  {
    pillar: 'A - AWARENESS (Consciencia)',
    subtitle: 'El despertar del observador consciente',
    desc: 'Identificar patrones inconscientes, heridas emocionales primarias y estados somáticos con compasión y sin juicio.',
    icon: Eye,
    color: '#0284C7',
    bg: '#E0F2FE',
  },
  {
    pillar: 'W - WISDOM (Sabiduría)',
    subtitle: 'La resignificación e integración profunda',
    desc: 'Comprender el aprendizaje detrás del dolor, reprogramar creencias limitantes y alinear mente, emoción y cuerpo.',
    icon: Brain,
    color: '#7C3AED',
    bg: '#EDE9FE',
  },
  {
    pillar: 'E - EVOLUTION (Evolución)',
    subtitle: 'La manifestación de tu nueva realidad',
    desc: 'Consolidar hábitos de autocuidado, maestría emocional y propósito de vida en coherencia cuántica y diaria.',
    icon: Flame,
    color: '#059669',
    bg: '#D1FAE5',
  },
];

const QUALITY_POLICIES = [
  'Atención clínica personalizada, ética y centrada en la singularidad de cada ser.',
  'Uso exclusivo de metodologías fundamentadas en la neurociencia y la psicoterapia integrativa.',
  'Garantía absoluta de confidencialidad y protección de historias de vida.',
  'Acompañamiento continuo y cercano durante todo tu proceso de transformación.',
];

export default function QuienesSomosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);

  const handleShare = async () => {
    try {
      await Share.share({
        title: 'Quiénes Somos - Conexión Luz®',
        message: 'Conoce Conexión Luz®, Centro Integral de Bienestar, Salud Mental y Expansión de Consciencia: https://conexionluz.com/#/quienes-somos',
        url: 'https://conexionluz.com',
      });
    } catch {
      // ignore
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#064E3B" translucent={true} />

      {/* TOP NAVBAR */}
      <View style={[styles.topNavbar, { paddingTop: topPadding + 6 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.navBackBtn}
          activeOpacity={0.8}
        >
          <ArrowLeft color="#FFFFFF" size={20} />
        </TouchableOpacity>

        <View style={styles.navTitleContainer}>
          <Text style={styles.navTitleText} numberOfLines={1}>Quiénes Somos</Text>
          <Text style={styles.navSubtitleText} numberOfLines={1}>Conexión Luz® Institucional</Text>
        </View>

        <TouchableOpacity
          onPress={handleShare}
          style={styles.navActionBtn}
          activeOpacity={0.8}
        >
          <Share2 color="#FFFFFF" size={19} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO IDENTITY CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Sparkles color="#FCD34D" size={14} />
            <Text style={styles.heroBadgeText}>PROPÓSITO & ALMA</Text>
          </View>

          <Text style={styles.heroTitle}>Conexión Luz®</Text>
          <Text style={styles.heroTagline}>
            Centro Integral de Bienestar, Salud Mental y Expansión de Consciencia
          </Text>
          <Text style={styles.heroDescription}>
            Somos una comunidad viva y un centro psicoterapéutico vanguardista que fusiona psicología clínica, neurociencia aplicada y sabiduría holística para acompañarte en tu retorno al equilibrio y tu más alta versión.
          </Text>

          <TouchableOpacity
            onPress={() => Linking.openURL('https://conexionluz.com')}
            style={styles.heroWebBtn}
            activeOpacity={0.85}
          >
            <Globe color="#FFFFFF" size={16} />
            <Text style={styles.heroWebBtnText}>Visitar conexionluz.com</Text>
            <ExternalLink color="#FFFFFF" size={14} style={{ opacity: 0.8 }} />
          </TouchableOpacity>
        </View>

        {/* MISIÓN & VISIÓN */}
        <View style={styles.mvRow}>
          {/* MISIÓN */}
          <View style={styles.mvCard}>
            <View style={[styles.mvIconCircle, { backgroundColor: '#ECFDF5' }]}>
              <Heart color="#059669" size={24} />
            </View>
            <Text style={styles.mvCardTitle}>Nuestra Misión</Text>
            <Text style={styles.mvCardText}>
              Democratizar el acceso a la salud mental y la transformación humana integral, brindando un espacio seguro, ético y de vanguardia para sanar las raíces del dolor emocional y florecer en bienestar.
            </Text>
          </View>

          {/* VISIÓN */}
          <View style={styles.mvCard}>
            <View style={[styles.mvIconCircle, { backgroundColor: '#EDE9FE' }]}>
              <Compass color="#7C3AED" size={24} />
            </View>
            <Text style={styles.mvCardTitle}>Nuestra Visión</Text>
            <Text style={styles.mvCardText}>
              Ser la comunidad y plataforma de referencia en Iberoamérica en acompañamiento terapéutico y elevación de la consciencia colectiva, impactando positivamente a millones de vidas.
            </Text>
          </View>
        </View>

        {/* METODOLOGÍA AWE SECTION */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <Brain color="#0D9488" size={24} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.sectionCardTitle}>Metodología AWE</Text>
              <Text style={styles.sectionCardSubtitle}>Awareness · Wisdom · Evolution</Text>
            </View>
          </View>

          <Text style={styles.sectionCardIntro}>
            Nuestro enfoque clínico integrativo está fundamentado en 3 pilares progresivos que aseguran una transformación profunda, sostenible y medible:
          </Text>

          {AWE_PILLARS.map((p, idx) => {
            const IconComp = p.icon;
            return (
              <View key={idx} style={[styles.pillarBox, { borderColor: `${p.color}30` }]}>
                <View style={[styles.pillarIconCircle, { backgroundColor: p.bg }]}>
                  <IconComp color={p.color} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.pillarTitle, { color: p.color }]}>{p.pillar}</Text>
                  <Text style={styles.pillarSubtitle}>{p.subtitle}</Text>
                  <Text style={styles.pillarDesc}>{p.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* 7 VALORES INSTITUCIONALES */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <Award color="#D97706" size={24} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.sectionCardTitle}>Nuestros Valores Institucionales</Text>
              <Text style={styles.sectionCardSubtitle}>Los 7 pilares éticos que guían cada acción</Text>
            </View>
          </View>

          <View style={styles.valuesGrid}>
            {VALUES.map((v, i) => {
              const VIcon = v.icon;
              return (
                <View key={i} style={styles.valueCard}>
                  <View style={[styles.valueIconBox, { backgroundColor: v.bgColor }]}>
                    <VIcon color={v.color} size={20} />
                  </View>
                  <Text style={styles.valueTitle}>{v.title}</Text>
                  <Text style={styles.valueDesc}>{v.desc}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* POLÍTICAS DE CALIDAD */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <CheckCircle2 color="#059669" size={24} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.sectionCardTitle}>Políticas de Calidad Clínica</Text>
              <Text style={styles.sectionCardSubtitle}>Estándares rigurosos de acompañamiento</Text>
            </View>
          </View>

          {QUALITY_POLICIES.map((item, idx) => (
            <View key={idx} style={styles.qualityItemRow}>
              <View style={styles.qualityDot} />
              <Text style={styles.qualityItemText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* QUICK NAVIGATION SHORTCUTS */}
        <View style={styles.shortcutsCard}>
          <Text style={styles.shortcutsHeading}>Explora más de Conexión Luz®</Text>

          <TouchableOpacity
            onPress={() => router.push('/faq' as any)}
            style={styles.shortcutRow}
            activeOpacity={0.8}
          >
            <View style={[styles.shortcutIconBox, { backgroundColor: '#E0F2FE' }]}>
              <HelpCircle color="#0284C7" size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.shortcutTitle}>Preguntas Frecuentes</Text>
              <Text style={styles.shortcutDesc}>Respuestas a dudas sobre citas, pagos y servicios</Text>
            </View>
            <ChevronRight color="#94A3B8" size={18} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/contacto' as any)}
            style={styles.shortcutRow}
            activeOpacity={0.8}
          >
            <View style={[styles.shortcutIconBox, { backgroundColor: '#DCFCE7' }]}>
              <Phone color="#16A34A" size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.shortcutTitle}>Contacto Directo & WhatsApp</Text>
              <Text style={styles.shortcutDesc}>Comunícate con nuestro equipo de atención</Text>
            </View>
            <ChevronRight color="#94A3B8" size={18} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/privacidad' as any)}
            style={[styles.shortcutRow, { borderBottomWidth: 0 }]}
            activeOpacity={0.8}
          >
            <View style={[styles.shortcutIconBox, { backgroundColor: '#F1F5F9' }]}>
              <Shield color="#475569" size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.shortcutTitle}>Política de Privacidad y Términos</Text>
              <Text style={styles.shortcutDesc}>Tratamiento de datos y garantías legales</Text>
            </View>
            <ChevronRight color="#94A3B8" size={18} />
          </TouchableOpacity>
        </View>

        {/* FOOTER BRANDING */}
        <View style={styles.footerBranding}>
          <Text style={styles.footerLogo}>✨ Conexión Luz®</Text>
          <Text style={styles.footerCopyright}>
            Todos los derechos reservados © {new Date().getFullYear()}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topNavbar: {
    backgroundColor: '#064E3B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  navBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  navTitleText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  navSubtitleText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  navActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#064E3B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(252, 211, 77, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(252, 211, 77, 0.3)',
    gap: 5,
    marginBottom: 12,
  },
  heroBadgeText: {
    color: '#FCD34D',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 4,
  },
  heroTagline: {
    color: '#A7F3D0',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 10,
  },
  heroDescription: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  heroWebBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    gap: 8,
  },
  heroWebBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  mvRow: {
    gap: 12,
    marginBottom: 16,
  },
  mvCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  mvIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  mvCardTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  mvCardText: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 19,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionCardTitle: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '800',
  },
  sectionCardSubtitle: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
  },
  sectionCardIntro: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  pillarBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    marginBottom: 10,
    gap: 12,
  },
  pillarIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  pillarSubtitle: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  pillarDesc: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 17,
  },
  valuesGrid: {
    gap: 10,
  },
  valueCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  valueIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  valueTitle: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  valueDesc: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 17,
  },
  qualityItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  qualityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
    marginTop: 6,
  },
  qualityItemText: {
    flex: 1,
    color: '#334155',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  shortcutsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  shortcutsHeading: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },
  shortcutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  shortcutIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutTitle: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
  },
  shortcutDesc: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 1,
  },
  footerBranding: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerLogo: {
    color: '#064E3B',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 4,
  },
  footerCopyright: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
});
