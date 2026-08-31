import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Sparkles,
  Phone,
  Shield,
  Calendar,
  Coins,
  Brain,
  X,
} from 'lucide-react-native';

interface FaqItem {
  id: string;
  category: 'citas' | 'awe' | 'lumis' | 'seguridad';
  categoryLabel: string;
  question: string;
  answer: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'citas',
    categoryLabel: 'Citas y Terapias',
    question: '¿Cómo funciona el agendamiento y pago de sesiones?',
    answer: 'Puedes agendar directamente desde la sección "Agendar Cita" seleccionando al terapeuta de tu preferencia, fecha y hora disponible. El pago se procesa de forma 100% segura a través de pasarelas de pago certificadas o canjeando tus Lumis acumulados.',
  },
  {
    id: 'faq-2',
    category: 'citas',
    categoryLabel: 'Citas y Terapias',
    question: '¿Las sesiones son virtuales o presenciales?',
    answer: 'Ofrecemos ambas modalidades. La gran mayoría de nuestras consultas son virtuales a través de videollamadas privadas y encriptadas, permitiéndote conectarte desde cualquier lugar del mundo. También contamos con atención presencial en nuestra sede principal de Pereira, Colombia.',
  },
  {
    id: 'faq-3',
    category: 'citas',
    categoryLabel: 'Citas y Terapias',
    question: '¿Qué pasa si necesito cancelar o reprogramar una cita?',
    answer: 'Puedes reprogramar o cancelar tu sesión sin costo avisando con al menos 24 horas de antelación desde la sección "Mi Calendario" o escribiendo a nuestro WhatsApp de soporte oficial.',
  },
  {
    id: 'faq-4',
    category: 'awe',
    categoryLabel: 'Metodología AWE',
    question: '¿Qué es y cómo funciona la Metodología AWE?',
    answer: 'AWE es nuestro modelo clínico e integrativo de 3 etapas: Awareness (Toma de consciencia y diagnóstico somático sin juicio), Wisdom (Resignificación del trauma y reprogramación de creencias limitantes) y Evolution (Consolidación de hábitos, coherencia cuántica y maestría de vida).',
  },
  {
    id: 'faq-5',
    category: 'awe',
    categoryLabel: 'Metodología AWE',
    question: '¿Qué formación tienen los Guías de Luz y Terapeutas?',
    answer: 'Todos los profesionales de Conexión Luz son psicólogos clínicos, neuropsicólogos o terapeutas con certificaciones universitarias acreditadas y formación rigurosa en neurociencia y la Metodología AWE.',
  },
  {
    id: 'faq-6',
    category: 'lumis',
    categoryLabel: 'Lumis y Economía',
    question: '¿Qué son los Lumis y para qué sirven?',
    answer: 'Los Lumis son la unidad de bienestar del ecosistema Conexión Luz. Te permiten acceder a cursos exclusivos, talleres, meditaciones avanzadas y canjearlos por importantes descuentos en tus sesiones terapéuticas.',
  },
  {
    id: 'faq-7',
    category: 'lumis',
    categoryLabel: 'Lumis y Economía',
    question: '¿Cómo puedo adquirir más Lumis?',
    answer: 'Puedes adquirir paquetes de Lumis desde la sección "Comprar Lumis" / Billetera con tarjeta débito, crédito o transferencias bancarias de forma inmediata.',
  },
  {
    id: 'faq-8',
    category: 'seguridad',
    categoryLabel: 'Privacidad y Seguridad',
    question: '¿Mis datos de salud y registros emocionales son confidenciales?',
    answer: 'Absolutamente sí. Toda tu información personal, historias clínicas y notas en el diario están resguardadas bajo cifrado de grado médico y protegidas bajo la Ley 1581 de Protección de Datos Personales y el secreto profesional.',
  },
  {
    id: 'faq-9',
    category: 'seguridad',
    categoryLabel: 'Privacidad y Seguridad',
    question: '¿Conexión Luz atiende emergencias psiquiátricas de urgencia?',
    answer: 'No. Conexión Luz es una plataforma de acompañamiento psicoterapéutico programado. En caso de crisis aguda o riesgo inminente, debes comunicarte de inmediato con los servicios de emergencia de tu localidad (Línea 123 o 106 en Colombia).',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Todas' },
  { id: 'citas', label: 'Citas y Terapias' },
  { id: 'awe', label: 'Metodología AWE' },
  { id: 'lumis', label: 'Lumis y Pagos' },
  { id: 'seguridad', label: 'Privacidad y Seguridad' },
];

export default function FaqScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const filteredFaqs = useMemo(() => {
    return FAQ_LIST.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const cleanSearch = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !cleanSearch ||
        item.question.toLowerCase().includes(cleanSearch) ||
        item.answer.toLowerCase().includes(cleanSearch);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

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
          <Text style={styles.navTitleText} numberOfLines={1}>Preguntas Frecuentes</Text>
          <Text style={styles.navSubtitleText} numberOfLines={1}>Centro de Ayuda Conexión Luz®</Text>
        </View>

        <TouchableOpacity
          onPress={() => Linking.openURL('https://wa.me/573013317868')}
          style={styles.navActionBtn}
          activeOpacity={0.8}
        >
          <MessageCircle color="#FFFFFF" size={19} />
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBarBox}>
          <Search color="#94A3B8" size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar preguntas o palabras clave..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X color="#94A3B8" size={16} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* CATEGORIES PILLS */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryPillText, isSelected && styles.categoryPillTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* FAQS LIST */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerInfoBanner}>
          <Sparkles color="#0D9488" size={18} />
          <Text style={styles.headerInfoBannerText}>
            Encuentra respuestas rápidas y confiables sobre el uso de la plataforma, agendamientos y terapias.
          </Text>
        </View>

        {filteredFaqs.length === 0 ? (
          <View style={styles.emptyStateBox}>
            <HelpCircle color="#94A3B8" size={40} />
            <Text style={styles.emptyStateTitle}>No encontramos resultados</Text>
            <Text style={styles.emptyStateDesc}>
              Prueba con otras palabras o escríbenos directamente a nuestro WhatsApp de atención.
            </Text>
          </View>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <View key={faq.id} style={styles.faqCard}>
                <TouchableOpacity
                  onPress={() => setExpandedId((prev) => (prev === faq.id ? null : faq.id))}
                  style={styles.faqQuestionRow}
                  activeOpacity={0.85}
                >
                  <View style={styles.faqQBadge}>
                    <Text style={styles.faqQBadgeText}>?</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.faqCategoryLabel}>{faq.categoryLabel}</Text>
                    <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  </View>
                  {isExpanded ? (
                    <ChevronUp color="#0D9488" size={20} />
                  ) : (
                    <ChevronDown color="#64748B" size={20} />
                  )}
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            );
          })
        )}

        {/* DIRECT HELP BANNER */}
        <View style={styles.needHelpCard}>
          <MessageCircle color="#059669" size={28} />
          <Text style={styles.needHelpTitle}>¿Tienes una consulta específica?</Text>
          <Text style={styles.needHelpText}>
            Nuestro equipo de coordinadores terapéuticos está a tu disposición en tiempo real.
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://wa.me/573013317868')}
            style={styles.needHelpBtn}
            activeOpacity={0.85}
          >
            <Text style={styles.needHelpBtnText}>Contactar por WhatsApp 💬</Text>
          </TouchableOpacity>
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
  searchBarContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoriesScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 8,
    marginBottom: 14,
  },
  headerInfoBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#0F766E',
    fontWeight: '500',
    lineHeight: 16,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
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
  faqCategoryLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  faqQuestionText: {
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
    fontSize: 12.5,
    lineHeight: 19,
  },
  emptyStateBox: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
  },
  emptyStateDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  needHelpCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 14,
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
});
