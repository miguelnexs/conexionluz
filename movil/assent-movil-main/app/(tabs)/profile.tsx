import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Activity,
  BookOpen,
  Settings,
  LogOut,
  Sparkles,
  CheckCircle2,
  Lock,
  Camera,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Heart,
  Shield,
  Save,
  LogIn,
  UserPlus,
  ShieldCheck,
  X,
  ArrowRight,
  Eye,
} from 'lucide-react-native';
import { mobileApi, PatientUser, getAuthToken, setAuthToken } from '../../api/client';

const { width } = Dimensions.get('window');

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  city: string;
  occupation: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'wellbeing' | 'courses' | 'settings'>('wellbeing');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // AUTH STATE
  const [me, setMe] = useState<PatientUser | null>(null);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // LOGIN / REGISTER INPUTS
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');

  // Daily Checkin state
  const [dailyEnergy, setDailyEnergy] = useState<string | null>(null);

  // Profile Form state
  const [form, setForm] = useState<ProfileFormData>({
    firstName: 'Sofía',
    lastName: 'Varela',
    email: 'sofia@conexionluz.com',
    phone: '+57 300 123 4567',
    birthDate: '1995-06-15',
    gender: 'Femenino',
    city: 'Bogotá',
    occupation: 'Diseñadora de Experiencias',
    address: 'Calle 100 # 15-20, Apto 402',
    emergencyContactName: 'Carlos Varela',
    emergencyContactPhone: '+57 310 987 6543',
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    const token = getAuthToken();
    if (token) {
      const res = await mobileApi.getMe();
      if (res.ok && res.patient) {
        setMe(res.patient);
        setIsAuthed(true);
        setForm((prev) => ({
          ...prev,
          firstName: res.patient.firstName || prev.firstName,
          lastName: res.patient.lastName || prev.lastName,
          email: res.patient.email || prev.email,
        }));
      } else {
        setIsAuthed(false);
      }
    } else {
      setIsAuthed(false);
    }
    setLoading(false);
  };

  const handleAuthSubmit = async () => {
    if (!emailInput.trim() || !passwordInput.trim()) {
      Alert.alert('Campos requeridos', 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    setAuthLoading(true);

    if (authMode === 'login') {
      const res = await mobileApi.login(emailInput.trim(), passwordInput.trim());
      setAuthLoading(false);

      if (res.ok) {
        setMe(res.patient);
        setIsAuthed(true);
        setShowAuthModal(false);
        setForm((prev) => ({
          ...prev,
          firstName: res.patient.firstName || prev.firstName,
          lastName: res.patient.lastName || prev.lastName,
          email: res.patient.email || prev.email,
        }));
      } else {
        Alert.alert('Error de inicio de sesión', res.error || 'Credenciales incorrectas');
      }
    } else {
      if (!firstNameInput.trim()) {
        setAuthLoading(false);
        Alert.alert('Campo requerido', 'Por favor ingresa tu nombre.');
        return;
      }

      const res = await mobileApi.register(
        firstNameInput.trim(),
        lastNameInput.trim(),
        emailInput.trim(),
        passwordInput.trim()
      );
      setAuthLoading(false);

      if (res.ok) {
        setMe(res.patient);
        setIsAuthed(true);
        setShowAuthModal(false);
      } else {
        Alert.alert('Error de registro', res.error || 'No se pudo crear la cuenta');
      }
    }
  };

  const handleQuickDemoLogin = async () => {
    setAuthLoading(true);
    const res = await mobileApi.login('paciente@ejemplo.com', 'paciente123');
    setAuthLoading(false);

    if (res.ok) {
      setMe(res.patient);
      setIsAuthed(true);
      setShowAuthModal(false);
    } else {
      // Fallback auth
      const mockPatient: PatientUser = {
        id: 999,
        firstName: 'Sofía',
        lastName: 'Varela',
        email: 'sofia@conexionluz.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        userType: 'paciente',
        canPublish: true,
      };
      setMe(mockPatient);
      setIsAuthed(true);
      setShowAuthModal(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Alert.alert('¡Éxito!', 'Tu información personal ha sido actualizada correctamente.');
    }, 800);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setMe(null);
    setIsAuthed(false);
  };

  const initials = me
    ? `${me.firstName?.[0] || ''}${me.lastName?.[0] || ''}`.toUpperCase()
    : 'SV';

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* HEADER SECTION */}
        <View style={styles.profileHeader}>
          <View style={styles.headerTopRow}>
            
            {/* AVATAR */}
            <View style={styles.avatarContainer}>
              {(() => {
                const avatarSrc = me?.profilePictureUrl || me?.avatarUrl;
                const hasValidAvatar = isAuthed && avatarSrc && typeof avatarSrc === 'string' && avatarSrc.trim().length > 10 && (avatarSrc.startsWith('http') || avatarSrc.startsWith('data:'));

                if (hasValidAvatar) {
                  return <Image source={{ uri: avatarSrc }} style={styles.avatarImage} />;
                }

                return (
                  <View style={styles.avatarInitialsBox}>
                    {isAuthed ? (
                      <Text style={styles.avatarInitialsText}>{initials}</Text>
                    ) : (
                      <User color="#64748B" size={28} />
                    )}
                  </View>
                );
              })()}
              {isAuthed && (
                <View style={styles.cameraPill}>
                  <Camera color="#FFFFFF" size={12} />
                </View>
              )}
            </View>

            {/* NAME AND DETAILS */}
            <View style={styles.headerInfo}>
              <Text style={styles.welcomeTitle}>
                {isAuthed && me ? `Hola, ${me.firstName}` : 'Perfil de Usuario'}
              </Text>
              <Text style={styles.welcomeSubtitle}>
                {isAuthed
                  ? 'Bienvenido/a a tu espacio personal de sanación y crecimiento.'
                  : 'Inicia sesión para gestionar tus datos y diagnósticos.'}
              </Text>
              
              <View style={styles.memberTagRow}>
                {isAuthed ? (
                  <>
                    <Sparkles color="#059669" size={12} />
                    <Text style={styles.memberTagText}>Miembro Activo · Conexión Luz®</Text>
                  </>
                ) : (
                  <>
                    <Lock color="#D97706" size={12} />
                    <Text style={styles.guestTagText}>Modo Invitado · Acceso Limitado</Text>
                  </>
                )}
              </View>
            </View>

          </View>

          {/* ACTION BUTTONS */}
          <View style={styles.headerActionsRow}>
            {isAuthed ? (
              <TouchableOpacity onPress={handleLogout} style={styles.logoutHeaderBtn}>
                <LogOut color="#EF4444" size={14} />
                <Text style={styles.logoutHeaderBtnText}>Cerrar sesión</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setShowAuthModal(true)} style={styles.loginHeaderBtn}>
                <LogIn color="#FFFFFF" size={14} />
                <Text style={styles.loginHeaderBtnText}>Iniciar Sesión</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* ===== SI NO ESTÁ AUTENTICADO: INVITACIÓN PROMINENTE A INICIAR SESIÓN ===== */}
          {!isAuthed ? (
            <View style={styles.guestPromptContainer}>
              
              {/* MAIN LOGIN INVITATION CARD */}
              <View style={styles.loginInviteCard}>
                <View style={styles.inviteIconBox}>
                  <Lock color="#059669" size={28} />
                </View>

                <Text style={styles.inviteTitle}>Inicia Sesión en tu Perfil</Text>
                <Text style={styles.inviteDesc}>
                  Accede a tus diagnósticos de bienestar, registros del diario emocional, cursos inscritos e información personal en Conexión Luz®.
                </Text>

                <TouchableOpacity onPress={() => setShowAuthModal(true)} style={styles.mainLoginCtaBtn}>
                  <LogIn color="#FFFFFF" size={16} />
                  <Text style={styles.mainLoginCtaText}>Iniciar Sesión / Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setAuthMode('register');
                    setShowAuthModal(true);
                  }}
                  style={styles.mainRegisterCtaBtn}
                >
                  <UserPlus color="#059669" size={16} />
                  <Text style={styles.mainRegisterCtaText}>Crear Cuenta Nueva</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleQuickDemoLogin} style={styles.quickDemoBtn}>
                  <ShieldCheck color="#059669" size={14} />
                  <Text style={styles.quickDemoBtnText}>Probar con Usuario Demo (1 Clic)</Text>
                </TouchableOpacity>
              </View>

              {/* LOCKED FEATURES PREVIEW */}
              <Text style={styles.lockedFeaturesTitle}>Secciones de tu Perfil al Iniciar Sesión:</Text>

              <View style={styles.lockedFeatureRow}>
                <View style={styles.lockedIconBox}>
                  <Activity color="#64748B" size={18} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lockedItemTitle}>Mi Bienestar & Check-in Diario</Text>
                  <Text style={styles.lockedItemDesc}>Registra tu energía diaria y visualiza tus resúmenes emocionales.</Text>
                </View>
                <Lock color="#94A3B8" size={16} />
              </View>

              <View style={styles.lockedFeatureRow}>
                <View style={styles.lockedIconBox}>
                  <BookOpen color="#64748B" size={18} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lockedItemTitle}>Mis Cursos & Lecciones</Text>
                  <Text style={styles.lockedItemDesc}>Accede a tu biblioteca de cursos y reprogramación personal.</Text>
                </View>
                <Lock color="#94A3B8" size={16} />
              </View>

              <View style={styles.lockedFeatureRow}>
                <View style={styles.lockedIconBox}>
                  <Settings color="#64748B" size={18} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lockedItemTitle}>Ajustes & Datos de Emergencia</Text>
                  <Text style={styles.lockedItemDesc}>Gestiona tus datos de contacto, dirección y ciudad.</Text>
                </View>
                <Lock color="#94A3B8" size={16} />
              </View>

            </View>
          ) : (
            <>
              {/* ===== SI ESTÁ AUTENTICADO: TAB SELECTION BAR & FULL PROFILE ===== */}
              <View style={styles.tabsRow}>
                <TouchableOpacity
                  onPress={() => setActiveTab('wellbeing')}
                  style={[styles.tabBtn, activeTab === 'wellbeing' && styles.tabBtnActive]}
                >
                  <Activity color={activeTab === 'wellbeing' ? '#059669' : '#64748B'} size={16} />
                  <Text style={[styles.tabBtnText, activeTab === 'wellbeing' && styles.tabBtnTextActive]}>Mi Bienestar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setActiveTab('courses')}
                  style={[styles.tabBtn, activeTab === 'courses' && styles.tabBtnActive]}
                >
                  <BookOpen color={activeTab === 'courses' ? '#059669' : '#64748B'} size={16} />
                  <Text style={[styles.tabBtnText, activeTab === 'courses' && styles.tabBtnTextActive]}>Mis Cursos</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setActiveTab('settings')}
                  style={[styles.tabBtn, activeTab === 'settings' && styles.tabBtnActive]}
                >
                  <Settings color={activeTab === 'settings' ? '#059669' : '#64748B'} size={16} />
                  <Text style={[styles.tabBtnText, activeTab === 'settings' && styles.tabBtnTextActive]}>Ajustes</Text>
                </TouchableOpacity>
              </View>

              {/* TAB 1: MI BIENESTAR */}
              {activeTab === 'wellbeing' && (
                <View style={styles.tabPanelContent}>
                  
                  {/* DAILY CHECK-IN CARD */}
                  <View style={styles.checkinCard}>
                    <Text style={styles.checkinHeaderTitle}>Check-in Diario de Energía</Text>
                    <Text style={styles.checkinHeaderDesc}>¿Cómo sientes tu energía y estado de ánimo hoy?</Text>
                    
                    <View style={styles.energyOptionsGrid}>
                      {[
                        { id: 'high', label: 'Radiante', emoji: '✨', color: '#10B981' },
                        { id: 'good', label: 'En calma', emoji: '🌱', color: '#0EA5E9' },
                        { id: 'tired', label: 'Agotado/a', emoji: '🫂', color: '#F59E0B' },
                        { id: 'low', label: 'Bajo/a', emoji: '🌧️', color: '#6366F1' },
                      ].map((item) => {
                        const isSelected = dailyEnergy === item.id;
                        return (
                          <TouchableOpacity
                            key={item.id}
                            onPress={() => setDailyEnergy(item.id)}
                            style={[styles.energyPillBtn, isSelected && { borderColor: item.color, backgroundColor: '#ECFDF5' }]}
                          >
                            <Text style={styles.energyEmoji}>{item.emoji}</Text>
                            <Text style={[styles.energyLabel, isSelected && { color: item.color, fontWeight: '900' }]}>
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {dailyEnergy && (
                      <View style={styles.checkinStatusNotice}>
                        <CheckCircle2 color="#059669" size={16} />
                        <Text style={styles.checkinStatusText}>Tu registro de hoy fue guardado. ¡Gracias por escucharte!</Text>
                      </View>
                    )}
                  </View>

                  {/* WELLBEING DIAGNOSTIC SUMMARY CARD */}
                  <View style={styles.summaryCard}>
                    <View style={styles.summaryTitleRow}>
                      <View style={styles.summaryIconBox}>
                        <Activity color="#059669" size={20} />
                      </View>
                      <View>
                        <Text style={styles.summaryBadge}>Diagnóstico Inicial</Text>
                        <Text style={styles.summaryCardTitle}>Tu Perfil de Bienestar</Text>
                      </View>
                    </View>

                    <View style={styles.quoteBubble}>
                      <Text style={styles.quoteText}>
                        "Tu proceso muestra una búsqueda activa de balance. Has demostrado fortaleza para identificar factores de tensión y dar pasos firmes hacia la autorregulación."
                      </Text>
                    </View>

                    <View style={styles.summaryActionsRow}>
                      <TouchableOpacity style={styles.summaryCtaBtnPrimary}>
                        <Text style={styles.summaryCtaTextPrimary}>Agendar sesión de apoyo</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                </View>
              )}

              {/* TAB 2: MIS CURSOS */}
              {activeTab === 'courses' && (
                <View style={styles.tabPanelContent}>
                  <View style={styles.emptyCoursesCard}>
                    <View style={styles.emptyIconBox}>
                      <BookOpen color="#94A3B8" size={32} />
                    </View>
                    <Text style={styles.emptyTitle}>Tus Cursos Inscritos</Text>
                    <Text style={styles.emptyDesc}>
                      Aquí aparecerán los cursos de reprogramación y salud mental a los que te inscribas.
                    </Text>
                    <TouchableOpacity style={styles.browseCoursesBtn}>
                      <Text style={styles.browseCoursesBtnText}>Explorar Biblioteca de Cursos</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* TAB 3: AJUSTES & DATOS PERSONALES */}
              {activeTab === 'settings' && (
                <View style={styles.tabPanelContent}>
                  
                  {/* FORMULARIO DE INFORMACIÓN PERSONAL COMPLETO */}
                  <View style={styles.formCard}>
                    <View style={styles.formHeaderRow}>
                      <View style={styles.formIconBox}>
                        <User color="#059669" size={20} />
                      </View>
                      <Text style={styles.formSectionTitle}>Información Personal</Text>
                    </View>

                    {/* NOMBRE Y APELLIDOS */}
                    <View style={styles.formGridRow}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Nombre</Text>
                        <TextInput
                          value={form.firstName}
                          onChangeText={(text) => setForm({ ...form, firstName: text })}
                          style={styles.textInput}
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Apellidos</Text>
                        <TextInput
                          value={form.lastName}
                          onChangeText={(text) => setForm({ ...form, lastName: text })}
                          style={styles.textInput}
                        />
                      </View>
                    </View>

                    {/* CORREO Y TELÉFONO */}
                    <View style={styles.formGridRow}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Correo Electrónico</Text>
                        <TextInput
                          value={form.email}
                          onChangeText={(text) => setForm({ ...form, email: text })}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          style={styles.textInput}
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Teléfono</Text>
                        <TextInput
                          value={form.phone}
                          onChangeText={(text) => setForm({ ...form, phone: text })}
                          keyboardType="phone-pad"
                          style={styles.textInput}
                        />
                      </View>
                    </View>

                    {/* FECHA DE NACIMIENTO Y GÉNERO */}
                    <View style={styles.formGridRow}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Fecha de Nacimiento</Text>
                        <TextInput
                          value={form.birthDate}
                          onChangeText={(text) => setForm({ ...form, birthDate: text })}
                          placeholder="YYYY-MM-DD"
                          style={styles.textInput}
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Género</Text>
                        <TextInput
                          value={form.gender}
                          onChangeText={(text) => setForm({ ...form, gender: text })}
                          style={styles.textInput}
                        />
                      </View>
                    </View>

                    {/* CIUDAD Y OCUPACIÓN */}
                    <View style={styles.formGridRow}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Ciudad</Text>
                        <TextInput
                          value={form.city}
                          onChangeText={(text) => setForm({ ...form, city: text })}
                          style={styles.textInput}
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Ocupación</Text>
                        <TextInput
                          value={form.occupation}
                          onChangeText={(text) => setForm({ ...form, occupation: text })}
                          style={styles.textInput}
                        />
                      </View>
                    </View>

                    {/* DIRECCIÓN COMPLETA */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Dirección Completa</Text>
                      <TextInput
                        value={form.address}
                        onChangeText={(text) => setForm({ ...form, address: text })}
                        style={styles.textInput}
                      />
                    </View>

                    {/* CONTACTO DE EMERGENCIA */}
                    <View style={styles.emergencySectionDivider} />

                    <Text style={styles.emergencyTitle}>Contacto de Emergencia</Text>
                    <View style={styles.formGridRow}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Nombre de Contacto</Text>
                        <TextInput
                          value={form.emergencyContactName}
                          onChangeText={(text) => setForm({ ...form, emergencyContactName: text })}
                          style={styles.textInput}
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Teléfono de Emergencia</Text>
                        <TextInput
                          value={form.emergencyContactPhone}
                          onChangeText={(text) => setForm({ ...form, emergencyContactPhone: text })}
                          keyboardType="phone-pad"
                          style={styles.textInput}
                        />
                      </View>
                    </View>

                    {/* SAVE BUTTON */}
                    <TouchableOpacity onPress={handleSaveProfile} disabled={saving} style={styles.saveProfileBtn}>
                      {saving ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <>
                          <Save color="#FFFFFF" size={16} />
                          <Text style={styles.saveProfileBtnText}>Guardar Cambios</Text>
                        </>
                      )}
                    </TouchableOpacity>

                  </View>

                  {/* ACCOUNT SECURITY CARD */}
                  <View style={styles.accountCard}>
                    <Text style={styles.accountTitle}>Información de Cuenta & Seguridad</Text>
                    <View style={styles.accountRow}>
                      <CheckCircle2 color="#10B981" size={18} />
                      <Text style={styles.accountRowText}>Email verificado: {form.email}</Text>
                    </View>
                  </View>

                </View>
              )}
            </>
          )}

        </ScrollView>

        {/* AUTHENTICATION MODAL */}
        <Modal visible={showAuthModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeaderRow}>
                <View style={styles.modalIconBadge}>
                  <Lock color="#059669" size={24} />
                </View>
                <TouchableOpacity onPress={() => setShowAuthModal(false)} style={styles.closeModalBtn}>
                  <X color="#64748B" size={20} />
                </TouchableOpacity>
              </View>

              {/* TOGGLE TAB LOGIN / REGISTER */}
              <View style={styles.modalTabRow}>
                <TouchableOpacity
                  onPress={() => setAuthMode('login')}
                  style={[styles.modalTabBtn, authMode === 'login' && styles.modalTabBtnActive]}
                >
                  <Text style={[styles.modalTabText, authMode === 'login' && styles.modalTabTextActive]}>Iniciar Sesión</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setAuthMode('register')}
                  style={[styles.modalTabBtn, authMode === 'register' && styles.modalTabBtnActive]}
                >
                  <Text style={[styles.modalTabText, authMode === 'register' && styles.modalTabTextActive]}>Registrarse</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalTitle}>
                {authMode === 'login' ? 'Acceso a tu Perfil Conexión Luz®' : 'Crear Cuenta en Conexión Luz®'}
              </Text>
              <Text style={styles.modalSubtitle}>
                {authMode === 'login'
                  ? 'Ingresa tus credenciales para acceder a tus datos y diagnósticos.'
                  : 'Crea tu perfil personal para dar seguimiento a tu salud emocional.'}
              </Text>

              {authMode === 'register' && (
                <>
                  <View style={styles.modalFormGroup}>
                    <Text style={styles.modalInputLabel}>Nombre</Text>
                    <TextInput
                      value={firstNameInput}
                      onChangeText={setFirstNameInput}
                      placeholder="Sofía"
                      placeholderTextColor="#94A3B8"
                      style={styles.modalInput}
                    />
                  </View>
                  <View style={styles.modalFormGroup}>
                    <Text style={styles.modalInputLabel}>Apellido</Text>
                    <TextInput
                      value={lastNameInput}
                      onChangeText={setLastNameInput}
                      placeholder="Varela"
                      placeholderTextColor="#94A3B8"
                      style={styles.modalInput}
                    />
                  </View>
                </>
              )}

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalInputLabel}>Correo Electrónico</Text>
                <TextInput
                  value={emailInput}
                  onChangeText={setEmailInput}
                  placeholder="ejemplo@conexionluz.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.modalFormGroup}>
                <Text style={styles.modalInputLabel}>Contraseña</Text>
                <TextInput
                  value={passwordInput}
                  onChangeText={setPasswordInput}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  style={styles.modalInput}
                />
              </View>

              <TouchableOpacity onPress={handleAuthSubmit} disabled={authLoading} style={styles.modalSubmitBtn}>
                {authLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <LogIn color="#FFFFFF" size={16} />
                    <Text style={styles.modalSubmitBtnText}>
                      {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={handleQuickDemoLogin} style={styles.demoLoginBtn}>
                <ShieldCheck color="#059669" size={16} />
                <Text style={styles.demoLoginBtnText}>Entrar con Usuario Demo Conexión Luz®</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  profileHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 20,
  },
  avatarInitialsBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#34D399',
  },
  avatarInitialsText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#065F46',
  },
  cameraPill: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 2,
  },
  welcomeSubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginBottom: 6,
  },
  memberTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  memberTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
  },
  guestTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  loginHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#059669',
  },
  loginHeaderBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  logoutHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutHeaderBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  guestPromptContainer: {
    gap: 16,
  },
  loginInviteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  inviteIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  inviteTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  inviteDesc: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  mainLoginCtaBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  mainLoginCtaText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  mainRegisterCtaBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 12,
  },
  mainRegisterCtaText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  quickDemoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickDemoBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    textDecorationLine: 'underline',
  },
  lockedFeaturesTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#64748B',
    textTransform: 'uppercase',
    marginTop: 8,
  },
  lockedFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lockedIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedItemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  lockedItemDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabBtnActive: {
    backgroundColor: '#ECFDF5',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#065F46',
    fontWeight: '900',
  },
  tabPanelContent: {
    gap: 16,
  },
  checkinCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  checkinHeaderTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 2,
  },
  checkinHeaderDesc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
  },
  energyOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  energyPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  energyEmoji: {
    fontSize: 16,
  },
  energyLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  checkinStatusNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    padding: 10,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
  },
  checkinStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  summaryIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryBadge: {
    fontSize: 9,
    fontWeight: '900',
    color: '#059669',
    textTransform: 'uppercase',
  },
  summaryCardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  quoteBubble: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
  },
  quoteText: {
    fontSize: 12,
    color: '#334155',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  summaryActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryCtaBtnPrimary: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  summaryCtaTextPrimary: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emptyCoursesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 17,
  },
  browseCoursesBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  browseCoursesBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  formHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  formIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  formGridRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputGroup: {
    flex: 1,
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  emergencySectionDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 6,
  },
  emergencyTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  saveProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 8,
  },
  saveProfileBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  accountTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accountRowText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
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
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeModalBtn: {
    padding: 6,
  },
  modalTabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  modalTabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  modalTabBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  modalTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  modalTabTextActive: {
    color: '#059669',
    fontWeight: '900',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    fontWeight: '500',
    marginBottom: 16,
  },
  modalFormGroup: {
    marginBottom: 12,
  },
  modalInputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 6,
  },
  modalSubmitBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  demoLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 10,
  },
  demoLoginBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
});
