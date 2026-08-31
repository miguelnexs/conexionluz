import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  StatusBar,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ChevronLeft,
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Zap,
  Lock,
  ArrowRight,
  AlertCircle,
  Video,
  Award,
  Check,
} from 'lucide-react-native';
import { mobileApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const TIME_SLOTS_MORNING = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
];

const TIME_SLOTS_AFTERNOON = [
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export default function AgendaScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const params = useLocalSearchParams<{ serviceId?: string; therapistId?: string }>();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [services, setServices] = useState<any[]>([]);
  const [therapists, setTherapists] = useState<any[]>([]);

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(() => {
    return params.serviceId ? Number(params.serviceId) : null;
  });
  const [selectedTherapistId, setSelectedTherapistId] = useState<number | null>(() => {
    return params.therapistId ? Number(params.therapistId) : null;
  });

  // Calendar Date State
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    // Default to tomorrow or next business day if today is late
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1); // skip sunday
    return d;
  });

  const [selectedTime, setSelectedTime] = useState<string>('');
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState<boolean>(false);

  // Patient Info State
  const [patientName, setPatientName] = useState<string>(user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : '');
  const [patientEmail, setPatientEmail] = useState<string>(user?.email || '');
  const [patientPhone, setPatientPhone] = useState<string>(user?.phone || '');
  const [patientReason, setPatientReason] = useState<string>('');
  const [patientAge, setPatientAge] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<'lumi' | 'mercadopago'>('lumi');

  const [lumiBalance, setLumiBalance] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const cachedBal = await AsyncStorage.getItem('conexionluz:lumis-balance');
      if (cachedBal) setLumiBalance(parseInt(cachedBal, 10) || 0);

      const [servRes, therRes, wallRes] = await Promise.all([
        mobileApi.fetchServices(),
        mobileApi.fetchTherapists(),
        mobileApi.fetchLumiWallet(),
      ]);

      if (servRes.ok && Array.isArray(servRes.data)) {
        setServices(servRes.data);
        if (!selectedServiceId && servRes.data.length > 0) {
          setSelectedServiceId(servRes.data[0].id);
        }
      }

      if (therRes.ok && Array.isArray(therRes.data)) {
        setTherapists(therRes.data);
        if (!selectedTherapistId && therRes.data.length > 0) {
          setSelectedTherapistId(therRes.data[0].id);
        }
      }

      if (wallRes.ok && wallRes.data && typeof wallRes.data.balance === 'number') {
        setLumiBalance(wallRes.data.balance);
        await AsyncStorage.setItem('conexionluz:lumis-balance', String(wallRes.data.balance));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch occupied times whenever therapist or date changes
  useEffect(() => {
    if (!selectedTherapistId || !selectedDate) return;
    const fetchTimes = async () => {
      setLoadingTimes(true);
      const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
      try {
        const res = await mobileApi.fetchOccupiedTimes(selectedTherapistId, dateStr);
        if (res.ok && res.data && Array.isArray(res.data.times)) {
          setOccupiedTimes(res.data.times);
        } else {
          setOccupiedTimes([]);
        }
      } catch {
        setOccupiedTimes([]);
      } finally {
        setLoadingTimes(false);
      }
    };
    fetchTimes();
  }, [selectedTherapistId, selectedDate]);

  const selectedService = useMemo(() => {
    return services.find((s) => s.id === selectedServiceId) || services[0] || null;
  }, [services, selectedServiceId]);

  const selectedTherapist = useMemo(() => {
    return therapists.find((t) => t.id === selectedTherapistId) || therapists[0] || null;
  }, [therapists, selectedTherapistId]);

  const requiredLumis = useMemo(() => {
    if (!selectedService) return 200;
    const priceCOP = selectedService.price_cop || selectedService.priceCOP || 50000;
    return Math.max(100, Math.round(priceCOP / 250));
  }, [selectedService]);

  const servicePriceCOP = useMemo(() => {
    if (!selectedService) return 50000;
    return selectedService.price_cop || selectedService.priceCOP || 50000;
  }, [selectedService]);

  const hasEnoughLumis = lumiBalance >= requiredLumis;

  // Calendar Day Generation
  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{ dayNumber: number; date: Date; isCurrentMonth: boolean; isPast: boolean; isSunday: boolean }> = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: 0, date: new Date(year, month, 0), isCurrentMonth: false, isPast: true, isSunday: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      dateObj.setHours(0, 0, 0, 0);
      const isPast = dateObj < today;
      const isSunday = dateObj.getDay() === 0;
      days.push({ dayNumber: d, date: dateObj, isCurrentMonth: true, isPast, isSunday });
    }

    return days;
  }, [currentMonthDate]);

  const handleSelectDay = (dayObj: any) => {
    if (!dayObj.isCurrentMonth || dayObj.isPast || dayObj.isSunday) return;
    setSelectedDate(dayObj.date);
    setSelectedTime('');
  };

  const handlePrevMonth = () => {
    const prev = new Date(currentMonthDate);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonthDate(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonthDate);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonthDate(next);
  };

  // STEP NAVIGATION & VALIDATION
  const handleProceedToStep2 = () => {
    if (!selectedServiceId) {
      Alert.alert('Selecciona un Servicio', 'Por favor selecciona el servicio terapéutico que deseas.');
      return;
    }
    if (!selectedTherapistId) {
      Alert.alert('Selecciona un Terapeuta', 'Por favor elige al profesional para tu consulta.');
      return;
    }
    setCurrentStep(2);
  };

  const handleProceedToStep3 = () => {
    if (!selectedDate) {
      Alert.alert('Selecciona una Fecha', 'Por favor elige un día en el calendario.');
      return;
    }
    if (!selectedTime) {
      Alert.alert('Selecciona un Horario', 'Por favor elige una franja horaria disponible.');
      return;
    }
    setCurrentStep(3);
  };

  // SUBMIT APPOINTMENT
  const handleConfirmAppointment = async () => {
    if (!patientName.trim()) {
      Alert.alert('Nombre Requerido', 'Por favor ingresa tu nombre completo.');
      return;
    }
    if (!patientEmail.trim() || !patientEmail.includes('@')) {
      Alert.alert('Correo Inválido', 'Por favor ingresa un correo electrónico válido para enviarte el enlace de la sesión.');
      return;
    }
    if (!patientPhone.trim()) {
      Alert.alert('Teléfono Requerido', 'Ingresa un número de celular o WhatsApp de contacto.');
      return;
    }

    if (paymentMode === 'lumi' && !hasEnoughLumis) {
      Alert.alert(
        'Lumis Insuficientes',
        `Esta cita requiere ${requiredLumis} Lumis y tienes ${lumiBalance} Lumis. Puedes recargar con Mercado Pago.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Recargar Lumis', onPress: () => router.push('/comprar-lumis' as any) },
        ]
      );
      return;
    }

    setIsSubmitting(true);
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

    try {
      const res = await mobileApi.createAppointment({
        serviceId: selectedService.id,
        therapistId: selectedTherapist.id,
        date: dateStr,
        time: selectedTime,
        clientName: patientName.trim(),
        clientEmail: patientEmail.trim(),
        clientPhone: patientPhone.trim(),
        clientAge: patientAge.trim() || undefined,
        reason: patientReason.trim() || 'Consulta Terapéutica ConexiónLuz',
        payWithLumi: paymentMode === 'lumi',
      });

      setIsSubmitting(false);

      if (res.ok) {
        if (paymentMode === 'lumi') {
          const newBal = Math.max(0, lumiBalance - requiredLumis);
          setLumiBalance(newBal);
          await AsyncStorage.setItem('conexionluz:lumis-balance', String(newBal));
        }

        setConfirmedBooking({
          serviceName: selectedService.title || selectedService.name,
          therapistName: selectedTherapist.name,
          dateFormatted: selectedDate.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
          time: selectedTime,
          priceCOP: servicePriceCOP,
          lumisPaid: paymentMode === 'lumi' ? requiredLumis : 0,
        });
      } else {
        Alert.alert('Error al Agendar', res.error || 'No se pudo reservar la cita en este momento. Intenta con otro horario.');
      }
    } catch (e: any) {
      setIsSubmitting(false);
      Alert.alert('Error de Conexión', e.message || 'Error al conectar con el servidor.');
    }
  };

  const formatSlotLabel = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${m === 0 ? '00' : m} ${period}`;
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={true} />

      {/* ── TOP HEADER ── */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackBtn} activeOpacity={0.7}>
          <ChevronLeft color="#0F172A" size={24} />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerMainTitle}>Agendar Cita</Text>
          <Text style={styles.headerSubTitle}>⚡ Terapia Profesional & ConexiónLuz</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/mi-calendario' as any)}
          style={styles.calendarNavBtn}
          activeOpacity={0.8}
        >
          <CalendarIcon color="#059669" size={16} />
          <Text style={styles.calendarNavText}>Mi Calendario</Text>
        </TouchableOpacity>
      </View>

      {/* ── STEP PROGRESS BAR ── */}
      <View style={styles.stepProgressBar}>
        <View style={[styles.stepTab, currentStep >= 1 && styles.stepTabActive]}>
          <View style={[styles.stepCircle, currentStep >= 1 && styles.stepCircleActive]}>
            <Text style={[styles.stepCircleText, currentStep >= 1 && styles.stepCircleTextActive]}>1</Text>
          </View>
          <Text style={[styles.stepLabel, currentStep >= 1 && styles.stepLabelActive]} numberOfLines={1}>
            Servicio
          </Text>
        </View>

        <View style={styles.stepDivider} />

        <View style={[styles.stepTab, currentStep >= 2 && styles.stepTabActive]}>
          <View style={[styles.stepCircle, currentStep >= 2 && styles.stepCircleActive]}>
            <Text style={[styles.stepCircleText, currentStep >= 2 && styles.stepCircleTextActive]}>2</Text>
          </View>
          <Text style={[styles.stepLabel, currentStep >= 2 && styles.stepLabelActive]} numberOfLines={1}>
            Horario
          </Text>
        </View>

        <View style={styles.stepDivider} />

        <View style={[styles.stepTab, currentStep >= 3 && styles.stepTabActive]}>
          <View style={[styles.stepCircle, currentStep >= 3 && styles.stepCircleActive]}>
            <Text style={[styles.stepCircleText, currentStep >= 3 && styles.stepCircleTextActive]}>3</Text>
          </View>
          <Text style={[styles.stepLabel, currentStep >= 3 && styles.stepLabelActive]} numberOfLines={1}>
            Confirmación
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Cargando terapeutas y servicios disponibles...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ══════════════════════════════════════════════════════════════════
              PASO 1: SELECCIÓN DE SERVICIO & TERAPEUTA
          ══════════════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <View style={styles.stepContainer}>
              {/* SELECCIÓN DE SERVICIO */}
              <View style={styles.cardBox}>
                <View style={styles.cardHeaderRow}>
                  <Sparkles color="#059669" size={17} />
                  <Text style={styles.cardSectionTitle}>1. Elige tu Servicio Terapéutico</Text>
                </View>

                <View style={styles.servicesList}>
                  {services.map((s) => {
                    const isSelected = selectedServiceId === s.id;
                    const price = s.price_cop || s.priceCOP || 50000;
                    const lumis = Math.max(100, Math.round(price / 250));
                    return (
                      <TouchableOpacity
                        key={s.id}
                        onPress={() => setSelectedServiceId(s.id)}
                        style={[styles.serviceCard, isSelected && styles.serviceCardActive]}
                        activeOpacity={0.85}
                      >
                        <View style={{ flex: 1 }}>
                          <View style={styles.serviceTopRow}>
                            <Text style={[styles.serviceTitle, isSelected && styles.serviceTitleActive]}>
                              {s.title || s.name}
                            </Text>
                            <View style={styles.durationBadge}>
                              <Clock color="#64748B" size={11} />
                              <Text style={styles.durationBadgeText}>{s.duration_minutes || 60} min</Text>
                            </View>
                          </View>

                          <Text style={styles.serviceDesc} numberOfLines={2}>
                            {s.description || 'Sesión terapéutica personalizada con evaluación clínica y seguimiento.'}
                          </Text>

                          <View style={styles.servicePriceRow}>
                            <Text style={styles.servicePriceCOP}>${price.toLocaleString('es-CO')} COP</Text>
                            <View style={styles.serviceLumiPill}>
                              <Sparkles color="#B45309" size={12} />
                              <Text style={styles.serviceLumiPillText}>o {lumis} Lumis</Text>
                            </View>
                          </View>
                        </View>

                        {isSelected && (
                          <View style={styles.checkCircleSelected}>
                            <Check color="#FFFFFF" size={14} />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* SELECCIÓN DE TERAPEUTA */}
              <View style={styles.cardBox}>
                <View style={styles.cardHeaderRow}>
                  <User color="#059669" size={17} />
                  <Text style={styles.cardSectionTitle}>2. Elige tu Especialista</Text>
                </View>

                <View style={styles.therapistsList}>
                  {therapists.map((t) => {
                    const isSelected = selectedTherapistId === t.id;
                    return (
                      <TouchableOpacity
                        key={t.id}
                        onPress={() => setSelectedTherapistId(t.id)}
                        style={[styles.therapistItem, isSelected && styles.therapistItemActive]}
                        activeOpacity={0.85}
                      >
                        <View style={styles.therapistAvatarContainer}>
                          {t.avatar ? (
                            <Image source={{ uri: t.avatar }} style={styles.therapistAvatarImg} />
                          ) : (
                            <View style={styles.therapistAvatarFallback}>
                              <Text style={styles.therapistAvatarInitial}>{(t.name || 'T')[0]}</Text>
                            </View>
                          )}
                          <View style={styles.onlineDot} />
                        </View>

                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={[styles.therapistItemName, isSelected && { color: '#059669' }]}>
                            {t.name}
                          </Text>
                          <Text style={styles.therapistItemRole} numberOfLines={1}>
                            {t.role || t.title || 'Psicólogo Clínico · Terapeuta Holístico'}
                          </Text>
                          <Text style={styles.therapistItemRating}>⭐ 4.9 · Consulta Online Certificada</Text>
                        </View>

                        {isSelected && (
                          <View style={styles.checkCircleSelected}>
                            <Check color="#FFFFFF" size={14} />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <TouchableOpacity
                onPress={handleProceedToStep2}
                style={styles.primaryCtaBtn}
                activeOpacity={0.88}
              >
                <Text style={styles.primaryCtaBtnText}>Continuar a Seleccionar Fecha y Hora</Text>
                <ArrowRight color="#FFFFFF" size={18} />
              </TouchableOpacity>
            </View>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              PASO 2: FECHA & CALENDARIO INTERACTIVO
          ══════════════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <View style={styles.stepContainer}>
              {/* CALENDARIO MENSUAL TÁCTIL */}
              <View style={styles.cardBox}>
                <View style={styles.monthNavRow}>
                  <TouchableOpacity onPress={handlePrevMonth} style={styles.monthNavBtn} activeOpacity={0.7}>
                    <ChevronLeft color="#0F172A" size={20} />
                  </TouchableOpacity>

                  <Text style={styles.monthTitleText}>
                    {MONTH_NAMES[currentMonthDate.getMonth()]} {currentMonthDate.getFullYear()}
                  </Text>

                  <TouchableOpacity onPress={handleNextMonth} style={styles.monthNavBtn} activeOpacity={0.7}>
                    <ChevronRight color="#0F172A" size={20} />
                  </TouchableOpacity>
                </View>

                {/* CABECERA DÍAS DE LA SEMANA */}
                <View style={styles.weekDaysHeader}>
                  {DAYS_OF_WEEK.map((d, i) => (
                    <Text key={i} style={[styles.weekDayLabel, i === 0 && { color: '#EF4444' }]}>
                      {d}
                    </Text>
                  ))}
                </View>

                {/* GRID DE DÍAS DEL MES */}
                <View style={styles.calendarGrid}>
                  {calendarDays.map((item, idx) => {
                    if (!item.isCurrentMonth) {
                      return <View key={idx} style={styles.emptyDayCell} />;
                    }

                    const isSelected =
                      selectedDate &&
                      selectedDate.getDate() === item.dayNumber &&
                      selectedDate.getMonth() === currentMonthDate.getMonth() &&
                      selectedDate.getFullYear() === currentMonthDate.getFullYear();

                    const isDisabled = item.isPast || item.isSunday;

                    return (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => handleSelectDay(item)}
                        disabled={isDisabled}
                        style={[
                          styles.dayCell,
                          isSelected && styles.dayCellActive,
                          isDisabled && styles.dayCellDisabled,
                        ]}
                        activeOpacity={0.75}
                      >
                        <Text
                          style={[
                            styles.dayCellText,
                            isSelected && styles.dayCellTextActive,
                            isDisabled && styles.dayCellTextDisabled,
                          ]}
                        >
                          {item.dayNumber}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.selectedDateBanner}>
                  <CalendarIcon color="#059669" size={16} />
                  <Text style={styles.selectedDateBannerText}>
                    {selectedDate.toLocaleDateString('es-CO', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>

              {/* HORARIOS DISPONIBLES EN TIEMPO REAL */}
              <View style={styles.cardBox}>
                <View style={styles.cardHeaderRow}>
                  <Clock color="#059669" size={17} />
                  <Text style={styles.cardSectionTitle}>Franja Horaria Disponible</Text>
                </View>

                {loadingTimes ? (
                  <View style={styles.timesLoadingBox}>
                    <ActivityIndicator size="small" color="#059669" />
                    <Text style={styles.timesLoadingText}>Consultando disponibilidad en vivo...</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.slotGroupLabel}>☀️ Turno Mañana</Text>
                    <View style={styles.slotsRow}>
                      {TIME_SLOTS_MORNING.map((slot) => {
                        const isOccupied = occupiedTimes.includes(slot);
                        const isSelected = selectedTime === slot;
                        return (
                          <TouchableOpacity
                            key={slot}
                            disabled={isOccupied}
                            onPress={() => setSelectedTime(slot)}
                            style={[
                              styles.timeSlotPill,
                              isSelected && styles.timeSlotPillActive,
                              isOccupied && styles.timeSlotPillOccupied,
                            ]}
                            activeOpacity={0.8}
                          >
                            <Text
                              style={[
                                styles.timeSlotText,
                                isSelected && styles.timeSlotTextActive,
                                isOccupied && styles.timeSlotTextOccupied,
                              ]}
                            >
                              {formatSlotLabel(slot)}
                            </Text>
                            {isOccupied && <Text style={styles.occupiedTag}>Ocupado</Text>}
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <Text style={[styles.slotGroupLabel, { marginTop: 12 }]}>🌤️ Turno Tarde</Text>
                    <View style={styles.slotsRow}>
                      {TIME_SLOTS_AFTERNOON.map((slot) => {
                        const isOccupied = occupiedTimes.includes(slot);
                        const isSelected = selectedTime === slot;
                        return (
                          <TouchableOpacity
                            key={slot}
                            disabled={isOccupied}
                            onPress={() => setSelectedTime(slot)}
                            style={[
                              styles.timeSlotPill,
                              isSelected && styles.timeSlotPillActive,
                              isOccupied && styles.timeSlotPillOccupied,
                            ]}
                            activeOpacity={0.8}
                          >
                            <Text
                              style={[
                                styles.timeSlotText,
                                isSelected && styles.timeSlotTextActive,
                                isOccupied && styles.timeSlotTextOccupied,
                              ]}
                            >
                              {formatSlotLabel(slot)}
                            </Text>
                            {isOccupied && <Text style={styles.occupiedTag}>Ocupado</Text>}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </>
                )}
              </View>

              <View style={styles.stepActionsRow}>
                <TouchableOpacity
                  onPress={() => setCurrentStep(1)}
                  style={styles.secondaryBackBtn}
                  activeOpacity={0.8}
                >
                  <ChevronLeft color="#475569" size={20} />
                  <Text style={styles.secondaryBackBtnText}>Atrás</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleProceedToStep3}
                  style={[styles.primaryCtaBtn, { flex: 1, marginTop: 0 }]}
                  activeOpacity={0.88}
                >
                  <Text style={styles.primaryCtaBtnText}>Confirmar Datos</Text>
                  <ArrowRight color="#FFFFFF" size={18} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              PASO 3: DATOS DEL PACIENTE & MÉTODO DE PAGO
          ══════════════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <View style={styles.stepContainer}>
              {/* RESUMEN DE LA CITA */}
              <View style={styles.summaryAppointmentCard}>
                <View style={styles.summaryTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.summaryServiceTitle}>{selectedService.title || selectedService.name}</Text>
                    <Text style={styles.summaryTherapistName}>Terapeuta: {selectedTherapist.name}</Text>
                  </View>
                  <View style={styles.summaryVideoTag}>
                    <Video color="#059669" size={14} />
                    <Text style={styles.summaryVideoTagText}>Online / Meet</Text>
                  </View>
                </View>

                <View style={styles.summaryDateRow}>
                  <View style={styles.summaryDateItem}>
                    <CalendarIcon color="#059669" size={15} />
                    <Text style={styles.summaryDateText}>
                      {selectedDate.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Text>
                  </View>
                  <View style={styles.summaryDateItem}>
                    <Clock color="#059669" size={15} />
                    <Text style={styles.summaryDateText}>{formatSlotLabel(selectedTime)}</Text>
                  </View>
                </View>
              </View>

              {/* FORMULARIO DE DATOS DEL PACIENTE */}
              <View style={styles.cardBox}>
                <View style={styles.cardHeaderRow}>
                  <User color="#059669" size={17} />
                  <Text style={styles.cardSectionTitle}>Datos del Paciente</Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Nombre Completo *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ej: María Rodríguez"
                    placeholderTextColor="#94A3B8"
                    value={patientName}
                    onChangeText={setPatientName}
                  />

                  <Text style={styles.inputLabel}>Correo Electrónico (Para enviar enlace Meet) *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="correo@ejemplo.com"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={patientEmail}
                    onChangeText={setPatientEmail}
                  />

                  <Text style={styles.inputLabel}>WhatsApp / Celular *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ej: 3001234567"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    value={patientPhone}
                    onChangeText={setPatientPhone}
                  />

                  <Text style={styles.inputLabel}>Motivo de Consulta (Opcional)</Text>
                  <TextInput
                    style={[styles.textInput, { height: 75, textAlignVertical: 'top', paddingTop: 8 }]}
                    placeholder="Describe brevemente en qué te gustaría trabajar..."
                    placeholderTextColor="#94A3B8"
                    multiline={true}
                    value={patientReason}
                    onChangeText={setPatientReason}
                  />
                </View>
              </View>

              {/* SELECCIÓN DE PAGO CON LUMIS O MERCADO PAGO */}
              <View style={styles.cardBox}>
                <View style={styles.cardHeaderRow}>
                  <CreditCard color="#059669" size={17} />
                  <Text style={styles.cardSectionTitle}>Forma de Pago de la Sesión</Text>
                </View>

                {/* OPCIÓN 1: PAGAR CON LUMIS */}
                <TouchableOpacity
                  onPress={() => setPaymentMode('lumi')}
                  style={[
                    styles.paymentOptionCard,
                    paymentMode === 'lumi' && styles.paymentOptionCardActive,
                  ]}
                  activeOpacity={0.85}
                >
                  <View style={styles.paymentOptionLeft}>
                    <View style={styles.lumiIconBg}>
                      <Sparkles color="#D97706" size={18} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.paymentOptionTitle}>Pagar con Lumis de Billetera</Text>
                      <Text style={styles.paymentOptionDesc}>
                        Costo: <Text style={{ fontWeight: '900', color: '#B45309' }}>{requiredLumis} Lumis</Text> (Saldo: {lumiBalance} Lumis)
                      </Text>
                      {!hasEnoughLumis && (
                        <Text style={styles.lumiInsufficientAlert}>
                          ⚠️ Saldo insuficiente. Te faltan {requiredLumis - lumiBalance} Lumis.
                        </Text>
                      )}
                    </View>
                  </View>

                  <View style={[styles.radioCircle, paymentMode === 'lumi' && styles.radioCircleActive]}>
                    {paymentMode === 'lumi' && <View style={styles.radioInnerDot} />}
                  </View>
                </TouchableOpacity>

                {/* BOTÓN RÁPIDO PARA RECARGAR LUMIS SI NO ALCANZA */}
                {!hasEnoughLumis && (
                  <TouchableOpacity
                    onPress={() => router.push('/comprar-lumis' as any)}
                    style={styles.rechargeLumisQuickBtn}
                    activeOpacity={0.8}
                  >
                    <Sparkles color="#D97706" size={14} />
                    <Text style={styles.rechargeLumisQuickText}>Recargar Lumis con Mercado Pago →</Text>
                  </TouchableOpacity>
                )}

                {/* OPCIÓN 2: PAGAR CON MERCADO PAGO */}
                <TouchableOpacity
                  onPress={() => setPaymentMode('mercadopago')}
                  style={[
                    styles.paymentOptionCard,
                    paymentMode === 'mercadopago' && styles.paymentOptionCardActive,
                  ]}
                  activeOpacity={0.85}
                >
                  <View style={styles.paymentOptionLeft}>
                    <View style={[styles.lumiIconBg, { backgroundColor: '#F0FDF4' }]}>
                      <CreditCard color="#059669" size={18} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.paymentOptionTitle}>Pagar en Línea con Mercado Pago</Text>
                      <Text style={styles.paymentOptionDesc}>
                        ${servicePriceCOP.toLocaleString('es-CO')} COP · PSE, Tarjeta o Nequi
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.radioCircle, paymentMode === 'mercadopago' && styles.radioCircleActive]}>
                    {paymentMode === 'mercadopago' && <View style={styles.radioInnerDot} />}
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.stepActionsRow}>
                <TouchableOpacity
                  onPress={() => setCurrentStep(2)}
                  style={styles.secondaryBackBtn}
                  activeOpacity={0.8}
                >
                  <ChevronLeft color="#475569" size={20} />
                  <Text style={styles.secondaryBackBtnText}>Atrás</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleConfirmAppointment}
                  disabled={isSubmitting}
                  style={[styles.primaryCtaBtn, { flex: 1, marginTop: 0 }, isSubmitting && { opacity: 0.7 }]}
                  activeOpacity={0.88}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Lock color="#FFFFFF" size={17} />
                      <Text style={styles.primaryCtaBtnText}>
                        {paymentMode === 'lumi'
                          ? `Confirmar con ${requiredLumis} Lumis`
                          : `Pagar $${servicePriceCOP.toLocaleString('es-CO')} COP`}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* ── MODAL DE CONFIRMACIÓN EXITOSA ── */}
      <Modal
        visible={Boolean(confirmedBooking)}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmedBooking(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <CheckCircle2 color="#059669" size={40} />
            </View>

            <Text style={styles.successTitle}>¡Cita Agendada con Éxito! 🌿</Text>
            <Text style={styles.successDesc}>
              Hemos reservado tu sesión y la hemos sincronizado automáticamente con tu calendario.
            </Text>

            <View style={styles.bookingReceiptBox}>
              <View style={styles.receiptItem}>
                <Text style={styles.receiptLabel}>Servicio:</Text>
                <Text style={styles.receiptVal}>{confirmedBooking?.serviceName}</Text>
              </View>
              <View style={styles.receiptItem}>
                <Text style={styles.receiptLabel}>Terapeuta:</Text>
                <Text style={styles.receiptVal}>{confirmedBooking?.therapistName}</Text>
              </View>
              <View style={styles.receiptItem}>
                <Text style={styles.receiptLabel}>Fecha:</Text>
                <Text style={styles.receiptVal}>{confirmedBooking?.dateFormatted}</Text>
              </View>
              <View style={styles.receiptItem}>
                <Text style={styles.receiptLabel}>Hora:</Text>
                <Text style={styles.receiptVal}>{formatSlotLabel(confirmedBooking?.time || '08:00')}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                setConfirmedBooking(null);
                router.push('/mi-calendario' as any);
              }}
              style={styles.goToCalendarBtn}
              activeOpacity={0.88}
            >
              <CalendarIcon color="#FFFFFF" size={17} />
              <Text style={styles.goToCalendarBtnText}>Ver en Mi Calendario</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setConfirmedBooking(null);
                router.back();
              }}
              style={styles.backHomeBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.backHomeBtnText}>Volver al Inicio</Text>
            </TouchableOpacity>
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerMainTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  headerSubTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    marginTop: 1,
  },
  calendarNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  calendarNavText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },

  // STEP PROGRESS BAR
  stepProgressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  stepTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    opacity: 0.45,
  },
  stepTabActive: {
    opacity: 1,
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#059669',
  },
  stepCircleText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#64748B',
  },
  stepCircleTextActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  stepLabelActive: {
    color: '#0F172A',
    fontWeight: '900',
  },
  stepDivider: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },

  scrollContent: {
    padding: 16,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },

  stepContainer: {
    gap: 16,
  },
  cardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },

  // SERVICES
  servicesList: {
    gap: 10,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
  },
  serviceCardActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
    borderWidth: 2,
  },
  serviceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    flex: 1,
  },
  serviceTitleActive: {
    color: '#047857',
    fontWeight: '900',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  durationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  serviceDesc: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 16,
  },
  servicePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  servicePriceCOP: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  serviceLumiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  serviceLumiPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#B45309',
  },
  checkCircleSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  // THERAPISTS
  therapistsList: {
    gap: 10,
  },
  therapistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 10,
  },
  therapistItemActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
    borderWidth: 2,
  },
  therapistAvatarContainer: {
    position: 'relative',
  },
  therapistAvatarImg: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E2E8F0',
  },
  therapistAvatarFallback: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  therapistAvatarInitial: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  therapistItemName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  therapistItemRole: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  therapistItemRating: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '700',
    marginTop: 2,
  },

  // CALENDAR
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  monthNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitleText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  weekDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  weekDayLabel: {
    width: (width - 64) / 7,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: (width - 64) / 7,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: 2,
  },
  emptyDayCell: {
    width: (width - 64) / 7,
    height: 36,
  },
  dayCellActive: {
    backgroundColor: '#059669',
  },
  dayCellDisabled: {
    opacity: 0.25,
  },
  dayCellText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  dayCellTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  dayCellTextDisabled: {
    color: '#94A3B8',
  },
  selectedDateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 4,
  },
  selectedDateBannerText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#047857',
    textTransform: 'capitalize',
  },

  // TIME SLOTS
  timesLoadingBox: {
    padding: 20,
    alignItems: 'center',
    gap: 6,
  },
  timesLoadingText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  slotGroupLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 4,
  },
  slotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlotPill: {
    width: (width - 64 - 16) / 3,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSlotPillActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
    borderWidth: 2,
  },
  timeSlotPillOccupied: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.5,
  },
  timeSlotText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1E293B',
  },
  timeSlotTextActive: {
    color: '#059669',
    fontWeight: '900',
  },
  timeSlotTextOccupied: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  occupiedTag: {
    fontSize: 8,
    fontWeight: '700',
    color: '#EF4444',
    marginTop: 1,
  },

  // SUMMARY CARD IN STEP 3
  summaryAppointmentCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryServiceTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  summaryTherapistName: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '600',
  },
  summaryVideoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  summaryVideoTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#34D399',
  },
  summaryDateRow: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
  },
  summaryDateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  summaryDateText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#F8FAFC',
  },

  // FORM
  formGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#334155',
    marginTop: 2,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },

  // PAYMENT OPTIONS
  paymentOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
  },
  paymentOptionCardActive: {
    backgroundColor: '#FFFBEB',
    borderColor: '#D97706',
    borderWidth: 2,
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lumiIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentOptionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  paymentOptionDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  lumiInsufficientAlert: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EF4444',
    marginTop: 2,
  },
  rechargeLumisQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  rechargeLumisQuickText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#B45309',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  radioCircleActive: {
    borderColor: '#D97706',
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D97706',
  },

  // CTA BUTTONS
  primaryCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryCtaBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  stepActionsRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  secondaryBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  secondaryBackBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },

  // SUCCESS MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#A7F3D0',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  successDesc: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 17,
  },
  bookingReceiptBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
    marginVertical: 4,
  },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '700',
  },
  receiptVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  goToCalendarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 14,
    width: '100%',
    marginTop: 4,
  },
  goToCalendarBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  backHomeBtn: {
    paddingVertical: 8,
  },
  backHomeBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
});
