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
  Shield,
  Lock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Mail,
  ExternalLink,
  Share2,
  Phone,
} from 'lucide-react-native';

const LEGAL_SECTIONS = [
  {
    title: '1. Aceptación de Términos y Condiciones',
    icon: CheckCircle2,
    color: '#059669',
    content:
      'Al registrarte, navegar o utilizar cualquier servicio del ecosistema Conexión Luz® (en adelante "la Plataforma"), aceptas de manera libre, voluntaria e informada los presentes Términos y Condiciones y nuestra Política de Privacidad. Si no estás de acuerdo con la totalidad de estas cláusulas, debes abstenerte de hacer uso de la plataforma.',
  },
  {
    title: '2. Exención de Responsabilidad Médica y Urgencias',
    icon: AlertTriangle,
    color: '#DC2626',
    content:
      'AVISO IMPORTANTE: Conexión Luz NO es un servicio de atención médica o psiquiátrica de urgencias. Las herramientas digitales (tests, diarios, relajaciones) son de apoyo personal y autoconocimiento, y no constituyen un diagnóstico médico.\n\nEn caso de crisis psiquiátrica aguda, ideación de riesgo inminente o emergencias de salud, debes acudir de inmediato al centro de salud más cercano o comunicarte con la línea de emergencias de tu país (Línea 123 o 106 en Colombia).',
  },
  {
    title: '3. Tratamiento de Datos Personales (Ley 1581 de 2012)',
    icon: Shield,
    color: '#0284C7',
    content:
      'En estricto cumplimiento del Régimen General de Protección de Datos Personales (Habeas Data), Conexión Luz garantiza que tus datos personales y sensibles (incluyendo notas terapéuticas, registros emocionales y datos de contacto) son tratados bajo altos estándares de cifrado y seguridad informática.\n\nNo vendemos, alquilamos ni compartimos tus datos con terceros bajo ninguna circunstancia con fines comerciales.',
  },
  {
    title: '4. Secreto Profesional y Confidencialidad Terapéutica',
    icon: Lock,
    color: '#7C3AED',
    content:
      'Todos los terapeutas y Guías de Luz vinculados a Conexión Luz están sujetos al secreto profesional ético y legal que rige el ejercicio de la psicología y la psicoterapia. Todo lo conversado dentro de una sesión terapéutica tiene carácter estrictamente confidencial.',
  },
  {
    title: '5. Políticas de Cancelación, Reagendamiento y Reembolsos',
    icon: Clock,
    color: '#D97706',
    content:
      '• Cancelaciones con +24 horas de antelación: Se permite reagendar la sesión sin ningún costo o solicitar reembolso del 100%.\n• Cancelaciones con menos de 24 horas: Generan un cargo del 50% por reserva y disponibilidad del profesional.\n• Inasistencias (No-show): La no presentación tras 15 minutos de iniciada la sesión sin aviso previo conlleva la pérdida total del valor abonado.',
  },
  {
    title: '6. Normas de Convivencia y Usos Prohibidos',
    icon: Users,
    color: '#0D9488',
    content:
      'Fomentamos un espacio seguro, empático y libre de juicios. Queda estrictamente prohibido en los foros y destellos el acoso, la discriminación, el lenguaje de odio, la suplantación de identidad y la divulgación no autorizada de información de otros consultantes.',
  },
  {
    title: '7. Derechos ARCO y Canales de Contacto Legal',
    icon: Mail,
    color: '#475569',
    content:
      'Como titular de los datos, tienes derecho a Conocer, Actualizar, Rectificar y Solicitar la Supresión de tu información en cualquier momento mediante solicitud formal a:\n\n✉️ privacidad@conexionluz.com / contacto@conexionluz.com\n📞 WhatsApp: +57 301 331 7868\n📍 Pereira, Risaralda, Colombia',
  },
];

export default function PrivacidadScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);

  const handleShare = async () => {
    try {
      await Share.share({
        title: 'Política de Privacidad - Conexión Luz®',
        message: 'Consulta la política de privacidad y términos legales de Conexión Luz®: https://conexionluz.com/#/privacidad',
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
          <Text style={styles.navTitleText} numberOfLines={1}>Política de Privacidad</Text>
          <Text style={styles.navSubtitleText} numberOfLines={1}>Términos & Habeas Data Legal</Text>
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
        {/* HERO BADGE */}
        <View style={styles.heroCard}>
          <Shield color="#FFFFFF" size={26} />
          <Text style={styles.heroTitle}>Protección & Transparencia</Text>
          <Text style={styles.heroSubtitle}>
            Tu privacidad y la seguridad de tu información de salud mental son nuestra máxima prioridad. Conoce nuestro marco de cumplimiento legal y bioético.
          </Text>
        </View>

        {/* LEGAL SECTIONS */}
        <View style={styles.sectionsList}>
          {LEGAL_SECTIONS.map((sec, index) => {
            const SecIcon = sec.icon;
            return (
              <View key={index} style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIconBox, { backgroundColor: `${sec.color}15` }]}>
                    <SecIcon color={sec.color} size={20} />
                  </View>
                  <Text style={styles.sectionTitle}>{sec.title}</Text>
                </View>

                <Text style={styles.sectionContent}>{sec.content}</Text>
              </View>
            );
          })}
        </View>

        {/* WEB BUTTONS */}
        <View style={styles.webBtnBox}>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://conexionluz.com/#/terminos')}
            style={styles.webBtn}
            activeOpacity={0.8}
          >
            <FileText color="#0284C7" size={16} />
            <Text style={styles.webBtnText}>Ver Términos en la Web</Text>
            <ExternalLink color="#0284C7" size={14} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL('https://conexionluz.com/#/privacidad')}
            style={styles.webBtn}
            activeOpacity={0.8}
          >
            <Lock color="#059669" size={16} />
            <Text style={styles.webBtnText}>Ver Privacidad en la Web</Text>
            <ExternalLink color="#059669" size={14} />
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View style={styles.footerBranding}>
          <Text style={styles.footerLogo}>✨ Conexión Luz® Legal</Text>
          <Text style={styles.footerCopyright}>
            Última actualización: Enero {new Date().getFullYear()} · República de Colombia
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
    gap: 14,
  },
  heroCard: {
    backgroundColor: '#064E3B',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 4,
  },
  heroSubtitle: {
    color: '#A7F3D0',
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionsList: {
    gap: 12,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  sectionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14.5,
    fontWeight: '800',
  },
  sectionContent: {
    color: '#475569',
    fontSize: 12.5,
    lineHeight: 19,
  },
  webBtnBox: {
    gap: 10,
    marginTop: 4,
  },
  webBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  webBtnText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
  },
  footerBranding: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerLogo: {
    color: '#064E3B',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 2,
  },
  footerCopyright: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
  },
});
