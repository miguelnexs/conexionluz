import React, { useState } from 'react';
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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  Globe,
  Sparkles,
  Heart,
  ChevronRight,
  ShieldCheck,
  User,
} from 'lucide-react-native';

export default function ContactoDirectoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Consulta General');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendForm = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Campos requeridos', 'Por favor ingresa tu nombre, correo y mensaje.');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      Alert.alert(
        '¡Mensaje Enviado! 🌿',
        'Gracias por comunicarte con Conexión Luz. Un coordinador terapéutico te responderá a la mayor brevedad.',
        [{ text: 'Aceptar', onPress: () => {
          setName('');
          setEmail('');
          setPhone('');
          setMessage('');
        }}]
      );
    }, 1000);
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
          <Text style={styles.navTitleText} numberOfLines={1}>Contacto Directo</Text>
          <Text style={styles.navSubtitleText} numberOfLines={1}>Atención & Orientación Terapéutica</Text>
        </View>

        <TouchableOpacity
          onPress={() => Linking.openURL('https://wa.me/573013317868')}
          style={styles.navActionBtn}
          activeOpacity={0.8}
        >
          <MessageCircle color="#FFFFFF" size={19} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO BANNER */}
        <View style={styles.heroCard}>
          <Heart color="#FFFFFF" size={26} />
          <Text style={styles.heroTitle}>Estamos para Escucharte</Text>
          <Text style={styles.heroSubtitle}>
            Comunícate con nuestro equipo de atención personalizada. Estamos listos para orientarte en tu proceso de sanación y responder cualquier duda.
          </Text>
        </View>

        {/* DIRECT ACTION CARDS */}
        <View style={styles.directChannelsList}>
          {/* WHATSAPP PRINCIPAL */}
          <TouchableOpacity
            onPress={() => Linking.openURL('https://wa.me/573013317868')}
            style={styles.channelCard}
            activeOpacity={0.8}
          >
            <View style={[styles.channelIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <MessageCircle color="#16A34A" size={24} />
            </View>
            <View style={styles.channelContent}>
              <Text style={styles.channelLabel}>WhatsApp Principal</Text>
              <Text style={styles.channelMainText}>+57 301 331 7868</Text>
              <Text style={styles.channelDesc}>Atención inmediata y citas terapéuticas</Text>
            </View>
            <ChevronRight color="#16A34A" size={20} />
          </TouchableOpacity>

          {/* WHATSAPP ALTERNO */}
          <TouchableOpacity
            onPress={() => Linking.openURL('https://wa.me/573158663910')}
            style={styles.channelCard}
            activeOpacity={0.8}
          >
            <View style={[styles.channelIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <MessageCircle color="#16A34A" size={24} />
            </View>
            <View style={styles.channelContent}>
              <Text style={styles.channelLabel}>WhatsApp Alterno & Soporte</Text>
              <Text style={styles.channelMainText}>+57 315 866 3910</Text>
              <Text style={styles.channelDesc}>Consultas sobre cursos y soporte técnico</Text>
            </View>
            <ChevronRight color="#16A34A" size={20} />
          </TouchableOpacity>

          {/* CORREO ELECTRÓNICO */}
          <TouchableOpacity
            onPress={() => Linking.openURL('mailto:contacto@conexionluz.com')}
            style={styles.channelCard}
            activeOpacity={0.8}
          >
            <View style={[styles.channelIconCircle, { backgroundColor: '#E0F2FE' }]}>
              <Mail color="#0284C7" size={24} />
            </View>
            <View style={styles.channelContent}>
              <Text style={styles.channelLabel}>Correo Electrónico</Text>
              <Text style={styles.channelMainText}>contacto@conexionluz.com</Text>
              <Text style={styles.channelDesc}>Respuesta garantizada en menos de 24h</Text>
            </View>
            <ChevronRight color="#0284C7" size={20} />
          </TouchableOpacity>
        </View>

        {/* FORMULARIO DE MENSAJE DIRECTO */}
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Send color="#0D9488" size={20} />
            <Text style={styles.formTitle}>Enviar un Mensaje</Text>
          </View>
          <Text style={styles.formSubtitle}>
            Déjanos tus datos y nos pondremos en contacto contigo por correo o WhatsApp.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tu Nombre Completo *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ej. Carolina Gómez"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
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
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Teléfono / WhatsApp (Opcional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="+57 300 000 0000"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
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
              value={message}
              onChangeText={setMessage}
            />
          </View>

          <TouchableOpacity
            onPress={handleSendForm}
            disabled={isSending}
            style={styles.sendButton}
            activeOpacity={0.85}
          >
            {isSending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Send color="#FFFFFF" size={16} />
                <Text style={styles.sendButtonText}>Enviar Mensaje</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* UBICACIÓN Y HORARIOS */}
        <View style={styles.infoBoxCard}>
          <View style={styles.infoRow}>
            <MapPin color="#D97706" size={22} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.infoTitle}>Sede Principal</Text>
              <Text style={styles.infoDesc}>Pereira, Risaralda, Colombia (Consultas presenciales y virtuales internacionales)</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { marginTop: 14 }]}>
            <Clock color="#059669" size={22} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.infoTitle}>Horarios de Atención</Text>
              <Text style={styles.infoDesc}>Lunes a Sábado: 8:00 AM – 8:00 PM (Hora Colombia)</Text>
            </View>
          </View>
        </View>

        {/* REDES SOCIALES */}
        <View style={styles.socialsCard}>
          <Text style={styles.socialsTitle}>Nuestras Redes Oficiales</Text>
          <Text style={styles.socialsSubtitle}>Conéctate con nuestra comunidad en redes sociales:</Text>

          <View style={styles.socialsGrid}>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://instagram.com/conexionluzoficial')}
              style={[styles.socialPill, { backgroundColor: '#FDF2F8', borderColor: '#FBCFE8' }]}
              activeOpacity={0.8}
            >
              <Text style={styles.socialPillIcon}>📸</Text>
              <Text style={[styles.socialPillText, { color: '#BE185D' }]}>Instagram</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL('https://youtube.com/@conexionluz')}
              style={[styles.socialPill, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}
              activeOpacity={0.8}
            >
              <Text style={styles.socialPillIcon}>▶️</Text>
              <Text style={[styles.socialPillText, { color: '#B91C1C' }]}>YouTube</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL('https://facebook.com/conexionluzoficial')}
              style={[styles.socialPill, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}
              activeOpacity={0.8}
            >
              <Text style={styles.socialPillIcon}>👥</Text>
              <Text style={[styles.socialPillText, { color: '#1D4ED8' }]}>Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL('https://conexionluz.com')}
              style={[styles.socialPill, { backgroundColor: '#F0FDFA', borderColor: '#99F6E4' }]}
              activeOpacity={0.8}
            >
              <Text style={styles.socialPillIcon}>🌐</Text>
              <Text style={[styles.socialPillText, { color: '#0F766E' }]}>Sitio Web</Text>
            </TouchableOpacity>
          </View>
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
  directChannelsList: {
    gap: 10,
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  channelIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelContent: {
    flex: 1,
  },
  channelLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  channelMainText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 1,
  },
  channelDesc: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 1,
  },
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
  infoBoxCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoTitle: {
    color: '#0F172A',
    fontSize: 13.5,
    fontWeight: '800',
    marginBottom: 2,
  },
  infoDesc: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 17,
  },
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
  socialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  socialPill: {
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
  socialPillIcon: {
    fontSize: 16,
  },
  socialPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
