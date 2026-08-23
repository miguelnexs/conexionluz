import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Info,
  Building2,
  Newspaper,
  HelpCircle,
  Phone,
  Shield,
  FileText,
  ChevronRight,
  X,
  Sparkles,
  Mail,
  MapPin,
} from 'lucide-react-native';

interface SubLinkItem {
  id: string;
  name: string;
  desc: string;
  icon: any;
  color: string;
  bgColor: string;
  badge: string;
  details: string;
}

const INFORMACION_SUBLINKS: SubLinkItem[] = [
  {
    id: 'quienes-somos',
    name: 'Quiénes Somos',
    desc: 'Conoce la historia, misión, visión y principios de Conexión Luz®.',
    icon: Building2,
    color: '#059669',
    bgColor: '#ECFDF5',
    badge: 'Misión',
    details:
      'Conexión Luz® nació con el firme propósito de democratizar el acompañamiento psicológico y el bienestar emocional. Creemos en un enfoque humano, cálido e integral.',
  },
  {
    id: 'blog',
    name: 'Blog & Artículos',
    desc: 'Lecturas sobre psicología, regulación emocional, espiritualidad y relaciones.',
    icon: Newspaper,
    color: '#0EA5E9',
    bgColor: '#E0F2FE',
    badge: 'Lecturas',
    details:
      'Artículos escritos por terapeutas y especialistas con consejos prácticos para tu vida cotidiana.',
  },
  {
    id: 'faq',
    name: 'Preguntas Frecuentes',
    desc: 'Respuestas rápidas sobre cómo agendar citas, métodos de pago y modalidades.',
    icon: HelpCircle,
    color: '#6366F1',
    bgColor: '#EEF2FF',
    badge: 'Ayuda',
    details:
      '¿Cómo reservo una sesión? ¿Cuáles son los horarios? ¿Qué métodos de pago aceptan? Encuentra todas las respuestas aquí.',
  },
  {
    id: 'contacto',
    name: 'Contacto Directo',
    desc: 'Comunícate con nuestro equipo de atención y soporte.',
    icon: Phone,
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    badge: 'Soporte',
    details: 'Correo: contacto@conexionluz.com\nTeléfono: +57 300 123 4567\nHorario de atención: Lunes a Sábado de 8:00 AM a 7:00 PM.',
  },
  {
    id: 'privacidad',
    name: 'Política de Privacidad',
    desc: 'Cómo protegemos la confidencialidad de tus datos e información personal.',
    icon: Shield,
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    badge: 'Seguridad',
    details:
      'Toda tu información personal y clínica está encriptada y protegida bajo los más altos estándares de confidencialidad.',
  },
  {
    id: 'terminos',
    name: 'Términos y Condiciones',
    desc: 'Normas comunitarias y condiciones de uso de nuestros servicios.',
    icon: FileText,
    color: '#EC4899',
    bgColor: '#FDF2F8',
    badge: 'Legal',
    details:
      'Condiciones de uso, políticas de cancelación de sesiones y compromiso de respeto dentro de la comunidad Conexión Luz®.',
  },
];

export default function Informacion() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);

  const [activeSubLink, setActiveSubLink] = useState<SubLinkItem | null>(null);

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent={true} />

      {/* HEADER BAR */}
      <View style={styles.headerBar}>
        <View style={styles.brandLogoRow}>
          <View style={styles.logoBadgeIcon}>
            <Info color="#059669" size={20} />
          </View>
          <View>
            <Text style={styles.brandTitleText}>INFORMACIÓN</Text>
            <Text style={styles.brandSubtitleText}>Subenlaces & Portal Institucional</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeading}>Secciones Informativas</Text>
        <Text style={styles.sectionSubheading}>Consulta los detalles institucionales, preguntas y canales de contacto.</Text>

        <View style={styles.sublinksList}>
          {INFORMACION_SUBLINKS.map((item) => {
            const IconComp = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setActiveSubLink(item)}
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

            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              <View style={styles.detailBox}>
                <Sparkles color="#059669" size={24} style={{ marginBottom: 8 }} />
                <Text style={styles.detailText}>{activeSubLink?.details}</Text>
              </View>
            </ScrollView>
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
  detailBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  detailText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#065F46',
  },
});
