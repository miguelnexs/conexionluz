import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  StatusBar,
  Animated,
  LayoutAnimation,
  UIManager,
  Share,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Globe,
  ExternalLink,
  Shield,
  Heart,
  Sparkles,
  Compass,
  Award,
  Lightbulb,
  Scale,
  Brain,
  Layers,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Calendar,
  UserCheck,
  BookOpen,
  HelpCircle,
  FileText,
  Lock,
  Flame,
  ClipboardList,
  Smile,
  Activity,
  Coins,
  Send,
  Users,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Share2,
} from 'lucide-react-native';

// ─── TABS DEFINITION ───
type InfoTab = 'quienes-somos' | 'faq' | 'contacto' | 'legal' | 'enlaces';

const TABS: { id: InfoTab; label: string; icon: string }[] = [
  { id: 'quienes-somos', label: 'Quiénes Somos', icon: '🏛️' },
  { id: 'faq', label: 'Preguntas Frecuentes', icon: '❓' },
  { id: 'contacto', label: 'Contacto Directo', icon: '📞' },
  { id: 'legal', label: 'Política de Privacidad', icon: '🛡️' },
  { id: 'enlaces', label: 'Todos los Enlaces', icon: '🔗' },
];

// ─── 7 INSTITUTIONAL VALUES ───
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

// ─── METODOLOGÍA AWE PILARES ───
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

// ─── COMPLETE DIRECTORY OF LINKS ───
interface LinkItem {
  title: string;
  subtitle: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  badge?: string;
  badgeBg?: string;
  route?: string;
  webUrl?: string;
}

interface LinkCategory {
  categoryTitle: string;
  categoryDesc: string;
  items: LinkItem[];
}

const ALL_LINKS: LinkCategory[] = [
  {
    categoryTitle: 'Terapia y Acompañamiento Clínico',
    categoryDesc: 'Sesiones personalizadas con terapeutas certificados y Guías de Luz.',
    items: [
      {
        title: 'Agendar Cita Terapéutica',
        subtitle: 'Elige tu terapeuta, fecha, hora y modalidad de consulta.',
        icon: Calendar,
        iconBg: '#E0F2FE',
        iconColor: '#0284C7',
        badge: 'App 📲',
        badgeBg: '#0284C7',
        route: '/agenda',
      },
      {
        title: 'Directorio de Guías de Luz',
        subtitle: 'Conoce los perfiles profesionales, especialidades y reseñas.',
        icon: UserCheck,
        iconBg: '#EDE9FE',
        iconColor: '#7C3AED',
        badge: 'App 📲',
        badgeBg: '#7C3AED',
        route: '/guias-de-luz',
      },
      {
        title: 'Catálogo de Servicios Clínicos',
        subtitle: 'Psicoterapia, hipnosis clínica, constelaciones y bioemoción.',
        icon: Layers,
        iconBg: '#FEF3C7',
        iconColor: '#D97706',
        badge: 'Web 🌐',
        badgeBg: '#D97706',
        webUrl: 'https://conexionluz.com/#/servicios',
      },
      {
        title: 'Mi Calendario de Sesiones',
        subtitle: 'Consulta el estado de tus citas programadas y pasadas.',
        icon: Clock,
        iconBg: '#ECFDF5',
        iconColor: '#059669',
        badge: 'App 📲',
        badgeBg: '#059669',
        route: '/mi-calendario',
      },
    ],
  },
  {
    categoryTitle: 'Formación y Crecimiento Personal',
    categoryDesc: 'Cursos interactivos, talleres magistrales y conversatorios en vivo.',
    items: [
      {
        title: 'Cursos y Talleres Cuánticos',
        subtitle: 'Aprende a tu propio ritmo con lecciones en video y audio.',
        icon: BookOpen,
        iconBg: '#FDF2F8',
        iconColor: '#DB2777',
        badge: 'App 📲',
        badgeBg: '#DB2777',
        route: '/cursos',
      },
      {
        title: 'Conversatorios en Vivo',
        subtitle: 'Encuentros grupales mensuales sobre expansión de consciencia.',
        icon: Users,
        iconBg: '#F0F9FF',
        iconColor: '#0284C7',
        badge: 'App 📲',
        badgeBg: '#0284C7',
        route: '/conversatorios',
      },
      {
        title: 'Hipnosis Interdimensional',
        subtitle: 'Accede al programa insignia de reprogramación subconsciente.',
        icon: Brain,
        iconBg: '#EDE9FE',
        iconColor: '#7C3AED',
        badge: 'Web 🌐',
        badgeBg: '#7C3AED',
        webUrl: 'https://conexionluz.com/#/cursos/hipnosis-interdimencional',
      },
    ],
  },
  {
    categoryTitle: 'Comunidad y Red de Apoyo',
    categoryDesc: 'Espacios sagrados para compartir tu sentir, inspirar y ser inspirado.',
    items: [
      {
        title: 'Destellos de la Comunidad (Feed)',
        subtitle: 'Publicaciones diarias de miembros, reflexiones y vivencias.',
        icon: Sparkles,
        iconBg: '#FEF3C7',
        iconColor: '#D97706',
        badge: 'App 📲',
        badgeBg: '#D97706',
        route: '/(tabs)',
      },
      {
        title: 'Foro de Transformación Emocional',
        subtitle: 'Preguntas abiertas, respuestas terapéuticas y debates.',
        icon: MessageCircle,
        iconBg: '#E0F2FE',
        iconColor: '#0284C7',
        badge: 'App 📲',
        badgeBg: '#0284C7',
        route: '/foro',
      },
      {
        title: 'Relatos e Historias de Vida',
        subtitle: 'Testimonios en profundidad de personas que sanaron su historia.',
        icon: BookOpen,
        iconBg: '#ECFDF5',
        iconColor: '#059669',
        badge: 'App 📲',
        badgeBg: '#059669',
        route: '/historias',
      },
      {
        title: 'Muro de Testimonios',
        subtitle: 'Comentarios y valoraciones de pacientes reales.',
        icon: Award,
        iconBg: '#FFFBEB',
        iconColor: '#B45309',
        badge: 'App 📲',
        badgeBg: '#B45309',
        route: '/testimonios',
      },
    ],
  },
  {
    categoryTitle: 'Laboratorio de Bienestar Diario',
    categoryDesc: 'Herramientas interactivas de autoconocimiento y regulación somática.',
    items: [
      {
        title: 'Tests de Bienestar Emocional',
        subtitle: 'Evalúa tus niveles de ansiedad, depresión, estrés e IGA.',
        icon: ClipboardList,
        iconBg: '#FEE2E2',
        iconColor: '#DC2626',
        badge: 'App 📲',
        badgeBg: '#DC2626',
        route: '/test-detalle?id=ansiedad',
      },
      {
        title: 'Ejercicios Guiados de Respiración',
        subtitle: 'Respiración 4-7-8, coherencia cardíaca y calma mental.',
        icon: Activity,
        iconBg: '#E0F2FE',
        iconColor: '#0284C7',
        badge: 'App 📲',
        badgeBg: '#0284C7',
        route: '/ejercicio-detalle?id=respiracion-478',
      },
      {
        title: 'Diario Emocional Íntimo',
        subtitle: 'Registra tus emociones, reflexiones y gratitud sin juicios.',
        icon: BookOpen,
        iconBg: '#FEF3C7',
        iconColor: '#D97706',
        badge: 'App 📲',
        badgeBg: '#D97706',
        route: '/diario-emocional',
      },
      {
        title: 'Técnicas de Relajación Cuántica',
        subtitle: 'Escaneo corporal, visualización curativa y descompresión.',
        icon: Smile,
        iconBg: '#EDE9FE',
        iconColor: '#7C3AED',
        badge: 'App 📲',
        badgeBg: '#7C3AED',
        route: '/relajacion-detalle?id=escaneo-corporal',
      },
      {
        title: 'Seguimiento de Mi Progreso',
        subtitle: 'Gráficos de evolución, constancia y métricas personales.',
        icon: Activity,
        iconBg: '#ECFDF5',
        iconColor: '#059669',
        badge: 'App 📲',
        badgeBg: '#059669',
        route: '/progreso',
      },
    ],
  },
  {
    categoryTitle: 'Economía y Cuenta Personal',
    categoryDesc: 'Gestión de tu perfil, billetera virtual y beneficios exclusivos.',
    items: [
      {
        title: 'Billetera y Tienda de Lumis',
        subtitle: 'Adquiere paquetes de Lumis para canjear por consultas y cursos.',
        icon: Coins,
        iconBg: '#FEF3C7',
        iconColor: '#B45309',
        badge: 'App 📲',
        badgeBg: '#B45309',
        route: '/comprar-lumis',
      },
      {
        title: 'Mi Perfil de Usuario',
        subtitle: 'Edita tu información, fotos de portada y avatar personal.',
        icon: UserCheck,
        iconBg: '#F1F5F9',
        iconColor: '#475569',
        badge: 'App 📲',
        badgeBg: '#475569',
        route: '/(tabs)/profile',
      },
      {
        title: 'Sitio Web Principal (conexionluz.com)',
        subtitle: 'Acceso directo a la plataforma web oficial de Conexión Luz.',
        icon: Globe,
        iconBg: '#E0F2FE',
        iconColor: '#0284C7',
        badge: 'Web 🌐',
        badgeBg: '#0284C7',
        webUrl: 'https://conexionluz.com',
      },
    ],
  },
];

// ─── FAQ QUESTIONS ───
const FAQS = [
  {
    id: 'faq-1',
    q: '¿Cómo funciona el agendamiento y pago de sesiones?',
    a: 'Puedes agendar directamente desde la sección "Agendar Cita" seleccionando al terapeuta de tu preferencia, fecha y hora disponible. El pago se procesa de forma 100% segura a través de pasarelas de pago certificadas o canjeando tus Lumis acumulados.',
  },
  {
    id: 'faq-2',
    q: '¿Las sesiones son virtuales o presenciales?',
    a: 'Ofrecemos ambas modalidades. La gran mayoría de nuestras consultas son virtuales a través de videollamadas privadas y encriptadas, permitiéndote conectarte desde cualquier lugar del mundo. También contamos con atención presencial en nuestra sede principal de Pereira, Colombia.',
  },
  {
    id: 'faq-3',
    q: '¿Qué formación tienen los Guías de Luz y Terapeutas?',
    a: 'Todos los profesionales vinculados a Conexión Luz cuentan con títulos universitarios certificados en Psicología, Psicoterapia, Neuropsicología o terapias complementarias avaladas, además de una rigurosa especialización en la Metodología AWE.',
  },
  {
    id: 'faq-4',
    q: '¿Qué es y cómo funciona la Metodología AWE?',
    a: 'AWE es un modelo terapéutico integrativo compuesto por 3 etapas: Awareness (Toma de consciencia y diagnóstico somático), Wisdom (Comprensión, resignificación del trauma y reprogramación mental) y Evolution (Consolidación de hábitos, coherencia cuántica y maestría vital).',
  },
  {
    id: 'faq-5',
    q: '¿Qué son los Lumis y para qué sirven?',
    a: 'Los Lumis son la unidad de bienestar y moneda oficial del ecosistema Conexión Luz. Te permiten acceder a contenidos exclusivos, talleres especializados y obtener importantes descuentos en tus sesiones terapéuticas.',
  },
  {
    id: 'faq-6',
    q: '¿Qué pasa si necesito cancelar o reprogramar una cita?',
    a: 'Puedes reprogramar o cancelar tu sesión sin ningún costo avisando con al menos 24 horas de antelación desde la sección "Mi Calendario" o contactando a nuestro equipo de WhatsApp de soporte.',
  },
  {
    id: 'faq-7',
    q: '¿Mis datos de salud y registros emocionales son confidenciales?',
    a: 'Absolutamente sí. Toda tu información personal, historias clínicas y registros en el diario emocional están protegidos con cifrado de grado médico y amparados bajo la Ley 1581 de Protección de Datos Personales y el secreto profesional.',
  },
  {
    id: 'faq-8',
    q: '¿Conexión Luz atiende emergencias psiquiátricas de urgencia?',
    a: 'No. Conexión Luz es una plataforma de acompañamiento psicoterapéutico y bienestar programado. En caso de emergencias psiquiátricas agudas o ideación de riesgo inminente, debes comunicarte de inmediato con la línea de emergencias de tu localidad (Línea 123 o 106 en Colombia).',
  },
];

// ─── LEGAL SECTIONS ───
const LEGAL_DOCS = [
  {
    title: '1. Aceptación de Términos y Condiciones',
    icon: CheckCircle2,
    color: '#059669',
    text: 'Al acceder o registrarte en Conexión Luz, aceptas plenamente los términos y condiciones de uso de la plataforma. La plataforma facilita el encuentro con terapeutas independientes y provee herramientas educativas de bienestar.',
  },
  {
    title: '2. Exención de Responsabilidad Médica y Urgencias',
    icon: AlertTriangle,
    color: '#DC2626',
    text: 'Conexión Luz NO es un servicio de urgencias médicas. Las herramientas digitales (tests, diarios, ejercicios) son de apoyo personal y autoconocimiento, no reemplazan una evaluación psiquiátrica de urgencia.',
  },
  {
    title: '3. Política de Privacidad y Habeas Data (Ley 1581 de 2012)',
    icon: Shield,
    color: '#0284C7',
    text: 'Tus datos personales y de salud son tratados con máxima confidencialidad. No compartimos ni vendemos tu información a terceros bajo ninguna circunstancia. Puedes solicitar rectificación o supresión de datos cuando lo desees.',
  },
  {
    title: '4. Políticas de Cancelación y Reembolsos',
    icon: Clock,
    color: '#D97706',
    text: 'Las cancelaciones realizadas con más de 24 horas de antelación se reprograman sin costo o se reembolsan en su totalidad. Cancelaciones con menos de 24 horas o inasistencias injustificadas conllevan el cobro respectivo de la reserva.',
  },
  {
    title: '5. Normas de Convivencia y Foros Comunitarios',
    icon: Users,
    color: '#7C3AED',
    text: 'Fomentamos un espacio seguro, respetuoso y libre de juicios. Queda terminantemente prohibido el acoso, lenguaje de odio o cualquier forma de discriminación en foros y destellos.',
  },
  {
    title: '6. Propiedad Intelectual',
    icon: Lock,
    color: '#475569',
    text: 'Todos los contenidos, cursos, diseños, audios de relajación y la metodología AWE son propiedad exclusiva de Conexión Luz® y se encuentran protegidos por leyes de derechos de autor.',
  },
];

export default function InformacionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);

  const [activeTab, setActiveTab] = useState<InfoTab>((params.tab as InfoTab) || 'quienes-somos');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  // Interactive Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSendingContact, setIsSendingContact] = useState(false);

  const handleSendContact = () => {
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      Alert.alert('Campos requeridos', 'Por favor ingresa tu nombre, correo y mensaje.');
      return;
    }
    setIsSendingContact(true);
    setTimeout(() => {
      setIsSendingContact(false);
      Alert.alert(
        '¡Mensaje Enviado! 🌿',
        'Gracias por comunicarte con Conexión Luz. Un coordinador terapéutico te responderá a la mayor brevedad.',
        [{ text: 'Aceptar', onPress: () => {
          setContactName('');
          setContactEmail('');
          setContactPhone('');
          setContactMessage('');
        }}]
      );
    }, 1000);
  };

  const toggleFaq = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  const handleOpenLink = async (item: LinkItem) => {
    if (item.route) {
      router.push(item.route as any);
    } else if (item.webUrl) {
      try {
        await Linking.openURL(item.webUrl);
      } catch {
        Alert.alert('Error', 'No se pudo abrir el enlace en el navegador.');
      }
    }
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        title: 'Conexión Luz®',
        message: 'Descubre Conexión Luz, el ecosistema de bienestar, terapia y expansión de consciencia: https://conexionluz.com',
        url: 'https://conexionluz.com',
      });
    } catch {
      // ignore
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#064E3B" translucent={true} />

      {/* ─── TOP NAVBAR ─── */}
      <View style={[styles.topNavbar, { paddingTop: topPadding + 6 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.navBackBtn}
          activeOpacity={0.8}
        >
          <ArrowLeft color="#FFFFFF" size={20} />
        </TouchableOpacity>

        <View style={styles.navTitleContainer}>
          <Text style={styles.navTitleText} numberOfLines={1}>Información Institucional</Text>
          <Text style={styles.navSubtitleText} numberOfLines={1}>Conexión Luz® Ecosistema</Text>
        </View>

        <TouchableOpacity
          onPress={handleShareApp}
          style={styles.navActionBtn}
          activeOpacity={0.8}
        >
          <Share2 color="#FFFFFF" size={19} />
        </TouchableOpacity>
      </View>

      {/* ─── SEGMENTED TABS BAR ─── */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setActiveTab(tab.id);
                }}
                style={[styles.tabPill, isSelected && styles.tabPillActive]}
                activeOpacity={0.8}
              >
                <Text style={styles.tabIcon}>{tab.icon}</Text>
                <Text style={[styles.tabPillText, isSelected && styles.tabPillTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ─── MAIN CONTENT SCROLL ─── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ═════════ TAB 1: QUIÉNES SOMOS ═════════ */}
        {activeTab === 'quienes-somos' && (
          <View style={styles.tabBody}>
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
                  <Heart color="#059669" size={22} />
                </View>
                <Text style={styles.mvCardTitle}>Nuestra Misión</Text>
                <Text style={styles.mvCardText}>
                  Democratizar el acceso a la salud mental y la transformación humana integral, brindando un espacio seguro, ético y de vanguardia para sanar las raíces del dolor emocional.
                </Text>
              </View>

              {/* VISIÓN */}
              <View style={styles.mvCard}>
                <View style={[styles.mvIconCircle, { backgroundColor: '#EDE9FE' }]}>
                  <Compass color="#7C3AED" size={22} />
                </View>
                <Text style={styles.mvCardTitle}>Nuestra Visión</Text>
                <Text style={styles.mvCardText}>
                  Ser la comunidad y plataforma de referencia en Iberoamérica en acompañamiento terapéutico y elevación de la consciencia colectiva, impactando a millones de vidas.
                </Text>
              </View>
            </View>

            {/* METODOLOGÍA AWE SECTION */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionCardHeader}>
                <Brain color="#0D9488" size={22} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.sectionCardTitle}>Metodología AWE</Text>
                  <Text style={styles.sectionCardSubtitle}>Awareness · Wisdom · Evolution</Text>
                </View>
              </View>

              <Text style={styles.sectionCardIntro}>
                Nuestro enfoque clínico e integrativo está fundamentado en 3 pilares progresivos que aseguran una transformación profunda, sostenible y medible:
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
                <Award color="#D97706" size={22} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.sectionCardTitle}>Nuestros Valores Institucionales</Text>
                  <Text style={styles.sectionCardSubtitle}>Los 7 pilares éticos que guían cada paso</Text>
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
          </View>
        )}

        {/* ═════════ TAB 2: TODOS LOS ENLACES ═════════ */}
        {activeTab === 'enlaces' && (
          <View style={styles.tabBody}>
            <View style={styles.infoBanner}>
              <Sparkles color="#0D9488" size={20} />
              <Text style={styles.infoBannerText}>
                Explora el ecosistema completo de Conexión Luz®. Puedes acceder directamente a cualquier sección dentro de la app o visitar nuestra plataforma web.
              </Text>
            </View>

            {ALL_LINKS.map((category, catIdx) => (
              <View key={catIdx} style={styles.categoryContainer}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryTitle}>{category.categoryTitle}</Text>
                  <Text style={styles.categoryDesc}>{category.categoryDesc}</Text>
                </View>

                <View style={styles.linksCard}>
                  {category.items.map((item, itemIdx) => {
                    const ItemIcon = item.icon;
                    const isLast = itemIdx === category.items.length - 1;
                    return (
                      <TouchableOpacity
                        key={itemIdx}
                        onPress={() => handleOpenLink(item)}
                        style={[styles.linkRow, !isLast && styles.linkRowBorder]}
                        activeOpacity={0.75}
                      >
                        <View style={[styles.linkIconCircle, { backgroundColor: item.iconBg }]}>
                          <ItemIcon color={item.iconColor} size={20} />
                        </View>

                        <View style={styles.linkInfo}>
                          <View style={styles.linkTitleRow}>
                            <Text style={styles.linkTitle}>{item.title}</Text>
                            {item.badge && (
                              <View style={[styles.linkBadge, { backgroundColor: item.badgeBg || '#0D9488' }]}>
                                <Text style={styles.linkBadgeText}>{item.badge}</Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.linkSubtitle}>{item.subtitle}</Text>
                        </View>

                        <ChevronRight color="#94A3B8" size={18} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ═════════ TAB 3: PREGUNTAS FRECUENTES (FAQ) ═════════ */}
        {activeTab === 'faq' && (
          <View style={styles.tabBody}>
            <View style={styles.infoBanner}>
              <HelpCircle color="#0284C7" size={20} />
              <Text style={styles.infoBannerText}>
                Respuestas claras a las dudas más comunes de nuestra comunidad y consultantes.
              </Text>
            </View>

            {FAQS.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <View key={faq.id} style={styles.faqCard}>
                  <TouchableOpacity
                    onPress={() => toggleFaq(faq.id)}
                    style={styles.faqQuestionRow}
                    activeOpacity={0.85}
                  >
                    <View style={styles.faqQBadge}>
                      <Text style={styles.faqQBadgeText}>?</Text>
                    </View>
                    <Text style={styles.faqQuestionText}>{faq.q}</Text>
                    {isExpanded ? (
                      <ChevronUp color="#0D9488" size={20} />
                    ) : (
                      <ChevronDown color="#64748B" size={20} />
                    )}
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.faqAnswerContainer}>
                      <Text style={styles.faqAnswerText}>{faq.a}</Text>
                    </View>
                  )}
                </View>
              );
            })}

            {/* NEED MORE HELP CARD */}
            <View style={styles.needHelpCard}>
              <MessageCircle color="#059669" size={28} />
              <Text style={styles.needHelpTitle}>¿Tienes una pregunta diferente?</Text>
              <Text style={styles.needHelpText}>
                Nuestro equipo de atención y soporte está listo para orientarte vía WhatsApp de manera personalizada.
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL('https://wa.me/573013317868')}
                style={styles.needHelpBtn}
                activeOpacity={0.85}
              >
                <Text style={styles.needHelpBtnText}>Consultar por WhatsApp 💬</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ═════════ TAB 4: POLÍTICAS Y LEGAL ═════════ */}
        {activeTab === 'legal' && (
          <View style={styles.tabBody}>
            <View style={styles.legalNoticeBanner}>
              <Shield color="#0D9488" size={22} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.legalNoticeTitle}>Compromiso Ético & Legal</Text>
                <Text style={styles.legalNoticeText}>
                  Operamos con estricto apego a las normas colombianas e internacionales de confidencialidad, protección de datos y código bioético en salud.
                </Text>
              </View>
            </View>

            {LEGAL_DOCS.map((doc, idx) => {
              const DocIcon = doc.icon;
              return (
                <View key={idx} style={styles.legalDocCard}>
                  <View style={styles.legalDocHeader}>
                    <View style={[styles.legalDocIconBox, { backgroundColor: `${doc.color}15` }]}>
                      <DocIcon color={doc.color} size={20} />
                    </View>
                    <Text style={styles.legalDocTitle}>{doc.title}</Text>
                  </View>
                  <Text style={styles.legalDocText}>{doc.text}</Text>
                </View>
              );
            })}

            {/* FULL LEGAL WEB BUTTONS */}
            <View style={styles.legalWebBtnRow}>
              <TouchableOpacity
                onPress={() => Linking.openURL('https://conexionluz.com/#/terminos')}
                style={styles.legalWebBtn}
                activeOpacity={0.8}
              >
                <FileText color="#0284C7" size={16} />
                <Text style={styles.legalWebBtnText}>Términos Completos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Linking.openURL('https://conexionluz.com/#/privacidad')}
                style={styles.legalWebBtn}
                activeOpacity={0.8}
              >
                <Lock color="#059669" size={16} />
                <Text style={styles.legalWebBtnText}>Política de Privacidad</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ═════════ TAB 5: CONTACTO Y REDES ═════════ */}
        {activeTab === 'contacto' && (
          <View style={styles.tabBody}>
            <View style={styles.contactHeroCard}>
              <Heart color="#FFFFFF" size={28} />
              <Text style={styles.contactHeroTitle}>Estamos para Escucharte</Text>
              <Text style={styles.contactHeroSubtitle}>
                Comunícate con nuestro equipo de coordinadores y soporte terapéutico. Te responderemos a la mayor brevedad.
              </Text>
            </View>

            {/* CONTACT DETAILS CARDS */}
            <View style={styles.contactList}>
              {/* WHATSAPP PRINCIPAL */}
              <TouchableOpacity
                onPress={() => Linking.openURL('https://wa.me/573013317868')}
                style={styles.contactItemCard}
                activeOpacity={0.8}
              >
                <View style={[styles.contactItemIcon, { backgroundColor: '#DCFCE7' }]}>
                  <MessageCircle color="#16A34A" size={24} />
                </View>
                <View style={styles.contactItemContent}>
                  <Text style={styles.contactItemTitle}>WhatsApp Principal</Text>
                  <Text style={styles.contactItemInfo}>+57 301 331 7868</Text>
                  <Text style={styles.contactItemDesc}>Atención inmediata y citas</Text>
                </View>
                <ChevronRight color="#16A34A" size={20} />
              </TouchableOpacity>

              {/* WHATSAPP ALTERNO */}
              <TouchableOpacity
                onPress={() => Linking.openURL('https://wa.me/573158663910')}
                style={styles.contactItemCard}
                activeOpacity={0.8}
              >
                <View style={[styles.contactItemIcon, { backgroundColor: '#DCFCE7' }]}>
                  <MessageCircle color="#16A34A" size={24} />
                </View>
                <View style={styles.contactItemContent}>
                  <Text style={styles.contactItemTitle}>WhatsApp Alterno & Soporte</Text>
                  <Text style={styles.contactItemInfo}>+57 315 866 3910</Text>
                  <Text style={styles.contactItemDesc}>Consultas técnicas y cursos</Text>
                </View>
                <ChevronRight color="#16A34A" size={20} />
              </TouchableOpacity>

              {/* CORREO ELECTRÓNICO */}
              <TouchableOpacity
                onPress={() => Linking.openURL('mailto:contacto@conexionluz.com')}
                style={styles.contactItemCard}
                activeOpacity={0.8}
              >
                <View style={[styles.contactItemIcon, { backgroundColor: '#E0F2FE' }]}>
                  <Mail color="#0284C7" size={24} />
                </View>
                <View style={styles.contactItemContent}>
                  <Text style={styles.contactItemTitle}>Correo Electrónico</Text>
                  <Text style={styles.contactItemInfo}>contacto@conexionluz.com</Text>
                  <Text style={styles.contactItemDesc}>Respuesta en menos de 24h</Text>
                </View>
                <ChevronRight color="#0284C7" size={20} />
              </TouchableOpacity>

              {/* FORMULARIO DE MENSAJE DIRECTO */}
              <View style={styles.formCard}>
                <View style={styles.formHeader}>
                  <Send color="#0D9488" size={18} />
                  <Text style={styles.formTitle}>Enviar un Mensaje Directo</Text>
                </View>
                <Text style={styles.formSubtitle}>
                  Escríbenos y un coordinador terapéutico te responderá a la mayor brevedad.
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Tu Nombre Completo *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ej. Carolina Gómez"
                    placeholderTextColor="#94A3B8"
                    value={contactName}
                    onChangeText={setContactName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Correo Electrónico *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="nombre@ejemplo.com"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={contactEmail}
                    onChangeText={setContactEmail}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Teléfono / WhatsApp (Opcional)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="+57 300 000 0000"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    value={contactPhone}
                    onChangeText={setContactPhone}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>¿En qué podemos ayudarte? *</Text>
                  <TextInput
                    style={[styles.textInput, styles.textAreaInput]}
                    placeholder="Escribe tu mensaje, inquietud o motivo de consulta..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={4}
                    value={contactMessage}
                    onChangeText={setContactMessage}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleSendContact}
                  disabled={isSendingContact}
                  style={styles.sendButton}
                  activeOpacity={0.85}
                >
                  {isSendingContact ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Send color="#FFFFFF" size={16} />
                      <Text style={styles.sendButtonText}>Enviar Mensaje</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* SEDE & HORARIOS */}
              <View style={styles.contactInfoBox}>
                <View style={styles.contactInfoRow}>
                  <MapPin color="#D97706" size={20} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.contactInfoTitle}>Ubicación Principal</Text>
                    <Text style={styles.contactInfoDesc}>Pereira, Risaralda, Colombia (Consultas presenciales y virtuales globales)</Text>
                  </View>
                </View>

                <View style={[styles.contactInfoRow, { marginTop: 14 }]}>
                  <Clock color="#059669" size={20} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.contactInfoTitle}>Horarios de Atención</Text>
                    <Text style={styles.contactInfoDesc}>Lunes a Sábado: 8:00 AM – 8:00 PM (Hora Colombia)</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* OFFICIAL REDES SOCIALES SECTION */}
            <View style={styles.socialsCard}>
              <Text style={styles.socialsTitle}>Nuestras Redes Oficiales</Text>
              <Text style={styles.socialsSubtitle}>Sigue nuestro contenido de sabiduría y bienestar diario:</Text>

              <View style={styles.socialBtnsGrid}>
                <TouchableOpacity
                  onPress={() => Linking.openURL('https://instagram.com/conexionluzoficial')}
                  style={[styles.socialBtn, { backgroundColor: '#FDF2F8', borderColor: '#FBCFE8' }]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.socialBtnIcon}>📸</Text>
                  <Text style={[styles.socialBtnText, { color: '#BE185D' }]}>Instagram</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => Linking.openURL('https://youtube.com/@conexionluz')}
                  style={[styles.socialBtn, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.socialBtnIcon}>▶️</Text>
                  <Text style={[styles.socialBtnText, { color: '#B91C1C' }]}>YouTube</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => Linking.openURL('https://facebook.com/conexionluzoficial')}
                  style={[styles.socialBtn, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.socialBtnIcon}>👥</Text>
                  <Text style={[styles.socialBtnText, { color: '#1D4ED8' }]}>Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => Linking.openURL('https://conexionluz.com')}
                  style={[styles.socialBtn, { backgroundColor: '#F0FDFA', borderColor: '#99F6E4' }]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.socialBtnIcon}>🌐</Text>
                  <Text style={[styles.socialBtnText, { color: '#0F766E' }]}>Sitio Web</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ─── FOOTER BRANDING ─── */}
        <View style={styles.footerBranding}>
          <Text style={styles.footerLogo}>✨ Conexión Luz®</Text>
          <Text style={styles.footerCopyright}>
            Todos los derechos reservados © {new Date().getFullYear()}
          </Text>
          <Text style={styles.footerDisclaim}>
            Desarrollado con amor y consciencia para tu evolución interior.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── STYLES ───
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

  // TABS
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 10,
  },
  tabsScrollContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  tabPillActive: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  tabIcon: {
    fontSize: 14,
  },
  tabPillText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  tabPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // SCROLL CONTENT
  scrollContent: {
    paddingBottom: 40,
  },
  tabBody: {
    padding: 16,
  },

  // HERO CARD
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

  // MISIÓN & VISIÓN
  mvRow: {
    flexDirection: 'column',
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

  // SECTION CARD
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

  // PILLARS
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

  // VALUES GRID
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

  // BANNER INFO
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  infoBannerText: {
    flex: 1,
    color: '#0F766E',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },

  // DIRECTORY LINKS
  categoryContainer: {
    marginBottom: 18,
  },
  categoryHeader: {
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  categoryTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800',
  },
  categoryDesc: {
    color: '#64748B',
    fontSize: 12,
  },
  linksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  linkRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  linkIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkInfo: {
    flex: 1,
  },
  linkTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  linkTitle: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  linkBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  linkBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  linkSubtitle: {
    color: '#64748B',
    fontSize: 11,
    lineHeight: 15,
  },

  // FAQ
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    overflow: 'hidden',
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  faqQBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqQBadgeText: {
    color: '#0D9488',
    fontSize: 13,
    fontWeight: '900',
  },
  faqQuestionText: {
    flex: 1,
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  faqAnswerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FAFAFA',
  },
  faqAnswerText: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 18,
  },
  needHelpCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  needHelpTitle: {
    color: '#065F46',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 4,
  },
  needHelpText: {
    color: '#047857',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 14,
  },
  needHelpBtn: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  needHelpBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  // LEGAL
  legalNoticeBanner: {
    flexDirection: 'row',
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    marginBottom: 16,
  },
  legalNoticeTitle: {
    color: '#0F766E',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  legalNoticeText: {
    color: '#115E59',
    fontSize: 12,
    lineHeight: 17,
  },
  legalDocCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  legalDocHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  legalDocIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legalDocTitle: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
  },
  legalDocText: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 18,
  },
  legalWebBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  legalWebBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  legalWebBtnText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
  },

  // CONTACT
  contactHeroCard: {
    backgroundColor: '#064E3B',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  contactHeroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 4,
  },
  contactHeroSubtitle: {
    color: '#A7F3D0',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  },
  contactList: {
    gap: 10,
    marginBottom: 16,
  },
  contactItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  contactItemIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactItemContent: {
    flex: 1,
  },
  contactItemTitle: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  contactItemInfo: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 1,
  },
  contactItemDesc: {
    color: '#94A3B8',
    fontSize: 11,
  },
  contactInfoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  contactInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  contactInfoTitle: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  contactInfoDesc: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 17,
  },

  // FORM CARD
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 4,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  formTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
  },
  formSubtitle: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  textAreaInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D9488',
    borderRadius: 14,
    paddingVertical: 12,
    gap: 8,
    marginTop: 4,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  // SOCIALS
  socialsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  socialsTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  socialsSubtitle: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 12,
  },
  socialBtnsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
    flexBasis: '48%',
    flexGrow: 1,
  },
  socialBtnIcon: {
    fontSize: 16,
  },
  socialBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // FOOTER
  footerBranding: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
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
    marginBottom: 2,
  },
  footerDisclaim: {
    color: '#CBD5E1',
    fontSize: 11,
    textAlign: 'center',
  },
});
