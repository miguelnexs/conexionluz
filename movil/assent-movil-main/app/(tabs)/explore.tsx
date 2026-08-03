import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Sparkles,
  Users,
  Activity,
  Video,
  MessageCircle,
  BookOpen,
  MessageSquareText,
  Star,
  ClipboardList,
  Dumbbell,
  NotebookPen,
  Wind,
  BarChart2,
  ChevronRight,
  Search,
  X,
  ArrowRight,
  Info,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface SubLinkItem {
  id: string;
  name: string;
  desc: string;
  badge: string;
  icon: any;
  color: string;
  bgColor: string;
  detailInfo: string;
  features: string[];
}

interface SectionCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  bgColor: string;
  items: SubLinkItem[];
}

const SECTIONS_DATA: SectionCategory[] = [
  {
    id: 'comunidad',
    title: 'Comunidad & Conexión',
    subtitle: 'Espacios de diálogo, aprendizaje y apoyo mutuo',
    icon: Users,
    color: '#059669',
    bgColor: '#ECFDF5',
    items: [
      {
        id: 'cursos',
        name: 'Cursos en Línea',
        desc: 'Programas de autoconocimiento y salud mental a tu ritmo',
        badge: 'Educación',
        icon: Video,
        color: '#6366F1',
        bgColor: '#EEF2FF',
        detailInfo: 'Cursos estructurados por psicólogos sobre manejo de ansiedad, relaciones sanas y autoestima.',
        features: ['Lecciones en video', 'Guías descargables', 'Certificado de avance'],
      },
      {
        id: 'conversatorios',
        name: 'Conversatorios en Vivo',
        desc: 'Espacios grupales de diálogo dirigidos por terapeutas',
        badge: 'En Vivo',
        icon: MessageCircle,
        color: '#0EA5E9',
        bgColor: '#E0F2FE',
        detailInfo: 'Encuentros virtuales semanales donde compartimos experiencias en un ambiente seguro.',
        features: ['Sesiones interactivas', 'Preguntas en directo', 'Moderación profesional'],
      },
      {
        id: 'historias',
        name: 'Historias de Sanación',
        desc: 'Relatos inspiradores de superación y crecimiento personal',
        badge: 'Inspiración',
        icon: BookOpen,
        color: '#8B5CF6',
        bgColor: '#F5F3FF',
        detailInfo: 'Testimonios en profundidad escritos por miembros que han recorrido caminos de sanación.',
        features: ['Lectura introspectiva', 'Filtro por temática', 'Espacio para comentar'],
      },
      {
        id: 'foro',
        name: 'Foro de Discusión',
        desc: 'Comparte tus dudas, consultas y reflexiones abiertas',
        badge: 'Foro Abierto',
        icon: MessageSquareText,
        color: '#10B981',
        bgColor: '#ECFDF5',
        detailInfo: 'Comunidad interactiva dividida por categorías de bienestar y desarrollo emocional.',
        features: ['Respuestas de miembros', 'Supervisión de equipo', 'Debates respetuosos'],
      },
      {
        id: 'testimonios',
        name: 'Voces & Testimonios',
        desc: 'Experiencias reales de pacientes de la plataforma',
        badge: 'Comunidad',
        icon: Star,
        color: '#F59E0B',
        bgColor: '#FFFBEB',
        detailInfo: 'Calificaciones y reseñas de usuarios sobre su proceso con la metodología Conexión Luz®.',
        features: ['Valoraciones reales', 'Casos de éxito', 'Impacto en calidad de vida'],
      },
    ],
  },
  {
    id: 'actividades',
    title: 'Actividades Terapéuticas',
    subtitle: 'Herramientas interactivas para tu práctica diaria',
    icon: Activity,
    color: '#EC4899',
    bgColor: '#FDF2F8',
    items: [
      {
        id: 'tests',
        name: 'Tests de Bienestar',
        desc: 'Evaluaciones clínicas de estrés, ánimo y salud emocional',
        badge: 'Diagnóstico',
        icon: ClipboardList,
        color: '#059669',
        bgColor: '#ECFDF5',
        detailInfo: 'Cuestionarios validados para identificar factores de estrés, calidad de sueño y balance emocional.',
        features: ['Resultado inmediato', 'Recomendaciones personalizadas', 'Gráfico de estado'],
      },
      {
        id: 'ejercicios',
        name: 'Ejercicios Guiados',
        desc: 'Prácticas clínicas paso a paso para cultivar virtudes',
        badge: 'Práctica',
        icon: Dumbbell,
        color: '#8B5CF6',
        bgColor: '#F5F3FF',
        detailInfo: 'Módulos prácticos para reestructuración cognitiva y regulación del sistema nervioso.',
        features: ['Pasos interactivos', 'Filtro por objetivo', 'Refuerzo de virtudes'],
      },
      {
        id: 'diario',
        name: 'Diario Emocional',
        desc: 'Registra y procesa tu sentir diario en espacio privado',
        badge: 'Introspección',
        icon: NotebookPen,
        color: '#F59E0B',
        bgColor: '#FFFBEB',
        detailInfo: 'Bitácora personal para volcar pensamientos, emociones y desencadenantes del día a día.',
        features: ['Escritura segura', 'Categorización por emoción', 'Historial de registros'],
      },
      {
        id: 'relajacion',
        name: 'Relajación & Mindfulness',
        desc: 'Audios de meditación e hipnosis para calmar la mente',
        badge: 'Mindfulness',
        icon: Wind,
        color: '#0EA5E9',
        bgColor: '#E0F2FE',
        detailInfo: 'Sesiones de audio guiadas para desarticular la tensión corporal y favorecer el sueño.',
        features: ['Audios de alta calidad', 'Duración variable', 'Técnica 4-7-8 de respiración'],
      },
      {
        id: 'progreso',
        name: 'Mi Progreso Personal',
        desc: 'Visualiza tus gráficos de evolución y hábitos de bienestar',
        badge: 'Evolución',
        icon: BarChart2,
        color: '#EC4899',
        bgColor: '#FDF2F8',
        detailInfo: 'Tablero dinámico de seguimiento donde observas tu avance en el tiempo.',
        features: ['Métricas semanales', 'Racha de prácticas', 'Indicador de bienestar IGA'],
      },
    ],
  },
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'todas' | 'comunidad' | 'actividades'>('todas');
  const [activeSubItem, setActiveSubItem] = useState<SubLinkItem | null>(null);

  // Filter sections and items based on search and category tab
  const filteredSections = SECTIONS_DATA.filter((sec) => {
    if (selectedCategory !== 'todas' && sec.id !== selectedCategory) return false;
    return true;
  }).map((sec) => {
    if (!searchQuery.trim()) return sec;
    const filteredItems = sec.items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.badge.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...sec, items: filteredItems };
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* HEADER BAR */}
        <View style={styles.headerBar}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Sparkles color="#059669" size={20} />
            </View>
            <View>
              <Text style={styles.brandTitle}>Explorar</Text>
              <Text style={styles.brandSubtitle}>Comunidad & Actividades Conexión Luz®</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* SEARCH BAR */}
          <View style={styles.searchContainer}>
            <Search color="#94A3B8" size={18} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar cursos, ejercicios, diario, foro..."
              placeholderTextColor="#94A3B8"
              style={styles.searchInput}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X color="#94A3B8" size={18} />
              </TouchableOpacity>
            )}
          </View>

          {/* CATEGORY FILTER TABS */}
          <View style={styles.tabBarRow}>
            <TouchableOpacity
              onPress={() => setSelectedCategory('todas')}
              style={[styles.tabFilterPill, selectedCategory === 'todas' && styles.tabFilterPillActive]}
            >
              <Text style={[styles.tabFilterText, selectedCategory === 'todas' && styles.tabFilterTextActive]}>Todas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedCategory('comunidad')}
              style={[styles.tabFilterPill, selectedCategory === 'comunidad' && styles.tabFilterPillActive]}
            >
              <Users color={selectedCategory === 'comunidad' ? '#059669' : '#64748B'} size={14} />
              <Text style={[styles.tabFilterText, selectedCategory === 'comunidad' && styles.tabFilterTextActive]}>Comunidad</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedCategory('actividades')}
              style={[styles.tabFilterPill, selectedCategory === 'actividades' && styles.tabFilterPillActive]}
            >
              <Activity color={selectedCategory === 'actividades' ? '#059669' : '#64748B'} size={14} />
              <Text style={[styles.tabFilterText, selectedCategory === 'actividades' && styles.tabFilterTextActive]}>Actividades</Text>
            </TouchableOpacity>
          </View>

          {/* SECTIONS LIST */}
          {filteredSections.map((section) => {
            if (section.items.length === 0) return null;
            const SectionIcon = section.icon;

            return (
              <View key={section.id} style={styles.sectionBlock}>
                
                {/* Section Title Header */}
                <View style={styles.sectionTitleRow}>
                  <View style={[styles.sectionIconBadge, { backgroundColor: section.bgColor }]}>
                    <SectionIcon color={section.color} size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
                  </View>
                </View>

                {/* Sub-links Cards Grid */}
                <View style={styles.itemsGrid}>
                  {section.items.map((subItem) => {
                    const ItemIcon = subItem.icon;

                    return (
                      <TouchableOpacity
                        key={subItem.id}
                        activeOpacity={0.85}
                        onPress={() => setActiveSubItem(subItem)}
                        style={styles.subItemCard}
                      >
                        <View style={styles.subItemHeader}>
                          <View style={[styles.subItemIconBox, { backgroundColor: subItem.bgColor }]}>
                            <ItemIcon color={subItem.color} size={20} />
                          </View>
                          <View style={[styles.subItemBadge, { backgroundColor: subItem.bgColor }]}>
                            <Text style={[styles.subItemBadgeText, { color: subItem.color }]}>{subItem.badge}</Text>
                          </View>
                        </View>

                        <Text style={styles.subItemTitle}>{subItem.name}</Text>
                        <Text style={styles.subItemDesc}>{subItem.desc}</Text>

                        <View style={styles.subItemFooter}>
                          <Text style={[styles.subItemLinkText, { color: subItem.color }]}>Explorar sub-enlace</Text>
                          <ChevronRight color={subItem.color} size={14} />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

              </View>
            );
          })}

        </ScrollView>

        {/* SUB-LINK DETAIL PREVIEW MODAL */}
        <Modal visible={activeSubItem !== null} transparent animationType="fade">
          {activeSubItem && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                
                <View style={styles.modalTopRow}>
                  <View style={[styles.modalIconBox, { backgroundColor: activeSubItem.bgColor }]}>
                    {React.createElement(activeSubItem.icon, { color: activeSubItem.color, size: 24 })}
                  </View>
                  <TouchableOpacity onPress={() => setActiveSubItem(null)} style={styles.modalCloseBtn}>
                    <X color="#64748B" size={20} />
                  </TouchableOpacity>
                </View>

                <View style={[styles.modalBadgePill, { backgroundColor: activeSubItem.bgColor }]}>
                  <Text style={[styles.modalBadgeText, { color: activeSubItem.color }]}>{activeSubItem.badge}</Text>
                </View>

                <Text style={styles.modalItemTitle}>{activeSubItem.name}</Text>
                <Text style={styles.modalItemDesc}>{activeSubItem.detailInfo}</Text>

                <Text style={styles.modalFeaturesHeader}>Lo que encontrarás en esta sección:</Text>

                <View style={styles.featuresList}>
                  {activeSubItem.features.map((feat, i) => (
                    <View key={i} style={styles.featureItemRow}>
                      <View style={[styles.featureDot, { backgroundColor: activeSubItem.color }]} />
                      <Text style={styles.featureText}>{feat}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={() => setActiveSubItem(null)}
                  style={[styles.modalActionBtn, { backgroundColor: activeSubItem.color }]}
                >
                  <Text style={styles.modalActionBtnText}>Ingresar a {activeSubItem.name}</Text>
                  <ArrowRight color="#FFFFFF" size={16} />
                </TouchableOpacity>

              </View>
            </View>
          )}
        </Modal>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  tabBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  tabFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabFilterPillActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#34D399',
  },
  tabFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  tabFilterTextActive: {
    color: '#065F46',
    fontWeight: '900',
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  sectionIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  itemsGrid: {
    gap: 12,
  },
  subItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  subItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  subItemIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subItemBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  subItemBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  subItemTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  subItemDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    fontWeight: '500',
    marginBottom: 12,
  },
  subItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subItemLinkText: {
    fontSize: 12,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    elevation: 10,
  },
  modalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalBadgePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  modalBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  modalItemTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  modalItemDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 16,
  },
  modalFeaturesHeader: {
    fontSize: 11,
    fontWeight: '900',
    color: '#334155',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  featuresList: {
    gap: 8,
    marginBottom: 20,
  },
  featureItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  modalActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
  modalActionBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
