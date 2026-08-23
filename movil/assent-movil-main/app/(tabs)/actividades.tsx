import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Activity,
  ClipboardList,
  Dumbbell,
  NotebookPen,
  Wind,
  BarChart2,
  ChevronRight,
  X,
  Sparkles,
  CheckCircle2,
} from 'lucide-react-native';
import { mobileApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

interface SubLinkItem {
  id: string;
  name: string;
  desc: string;
  icon: any;
  color: string;
  bgColor: string;
  badge: string;
}

const ACTIVIDADES_SUBLINKS: SubLinkItem[] = [
  {
    id: 'tests',
    name: 'Tests de Bienestar',
    desc: 'Evalúa tu estado emocional, nivel de estrés e indicador IGA con test rápidos.',
    icon: ClipboardList,
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    badge: 'Evaluación',
  },
  {
    id: 'ejercicios',
    name: 'Ejercicios Guiados',
    desc: 'Prácticas paso a paso desarrolladas por terapeutas para liberar tensión acumulada.',
    icon: Dumbbell,
    color: '#6366F1',
    bgColor: '#EEF2FF',
    badge: 'Práctica',
  },
  {
    id: 'diario',
    name: 'Diario Emocional',
    desc: 'Registra tu sentir diario, tus intenciones y reflexiones de sanación personal.',
    icon: NotebookPen,
    color: '#059669',
    bgColor: '#ECFDF5',
    badge: 'Hábito',
  },
  {
    id: 'relajacion',
    name: 'Relajación & Mindfulness',
    desc: 'Técnicas de respiración profunda e introspección guiada en momentos de caos.',
    icon: Wind,
    color: '#0EA5E9',
    bgColor: '#E0F2FE',
    badge: 'Calma',
  },
  {
    id: 'progreso',
    name: 'Mi Progreso',
    desc: 'Sigue la evolución de tu salud mental, racha de hábitos y avance en el tiempo.',
    icon: BarChart2,
    color: '#EC4899',
    bgColor: '#FDF2F8',
    badge: 'Evolución',
  },
];

export default function Actividades() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const { isAuthenticated } = useAuth();

  const [activeSubLink, setActiveSubLink] = useState<SubLinkItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [itemsData, setItemsData] = useState<any[]>([]);

  const handleOpenSubLink = async (item: SubLinkItem) => {
    setActiveSubLink(item);
    setLoading(true);
    setItemsData([]);

    try {
      if (item.id === 'ejercicios') {
        const res = await mobileApi.fetchGuidedExercises();
        if (res.ok && Array.isArray(res.data)) setItemsData(res.data);
      } else if (item.id === 'relajacion') {
        const res = await mobileApi.fetchBreathingTechniques();
        if (res.ok && Array.isArray(res.data)) setItemsData(res.data);
      } else if (item.id === 'tests') {
        const res = await mobileApi.fetchWellbeingTests();
        if (res.ok && Array.isArray(res.data)) setItemsData(res.data);
      }
    } catch (e) {
      console.log('Error fetching activity sublink:', e);
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent={true} />

      {/* HEADER BAR */}
      <View style={styles.headerBar}>
        <View style={styles.brandLogoRow}>
          <View style={styles.logoBadgeIcon}>
            <Activity color="#059669" size={20} />
          </View>
          <View>
            <Text style={styles.brandTitleText}>ACTIVIDADES</Text>
            <Text style={styles.brandSubtitleText}>Subenlaces & Salud Mental Práctica</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeading}>Herramientas de Salud Mental</Text>
        <Text style={styles.sectionSubheading}>Elige una actividad para practicar, evaluar o registrar tu progreso diario.</Text>

        <View style={styles.sublinksList}>
          {ACTIVIDADES_SUBLINKS.map((item) => {
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

            {loading ? (
              <ActivityIndicator size="small" color="#059669" style={{ marginVertical: 30 }} />
            ) : (
              <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
                {itemsData.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <Sparkles color="#059669" size={24} />
                    <Text style={styles.emptyText}>
                      {isAuthenticated
                        ? 'Contenidos prácticos listos para iniciar tu sesión.'
                        : 'Inicia sesión en Mi Cuenta para guardar tu progreso personal.'}
                    </Text>
                  </View>
                ) : (
                  itemsData.map((dataItem: any, idx: number) => (
                    <View key={dataItem.id || idx} style={styles.detailItemCard}>
                      <Text style={styles.detailItemTitle}>
                        {dataItem.name || dataItem.title || 'Ejercicio Guiado'}
                      </Text>
                      <Text style={styles.detailItemDesc} numberOfLines={3}>
                        {dataItem.description || dataItem.instructions || 'Práctica recomendada por psicólogos.'}
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
