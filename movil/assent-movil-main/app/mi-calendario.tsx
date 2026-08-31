import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
  Alert,
  Dimensions,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Video,
  User,
  Plus,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  XCircle,
  ExternalLink,
  MessageCircle,
} from 'lucide-react-native';
import { mobileApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export interface CalendarEvent {
  type: 'appointment' | 'talk';
  id: number;
  title: string;
  startAt: string;
  endAt: string;
  status?: 'scheduled' | 'cancelled' | 'completed';
  serviceTitle?: string | null;
  topic?: string;
  speaker?: string;
  meetUrl?: string;
}

export default function MiCalendarioScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const params = useLocalSearchParams<{ focus?: string }>();

  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    loadCalendarEvents();
  }, [isAuthenticated]);

  const loadCalendarEvents = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString();
      const end = new Date(today.getFullYear(), today.getMonth() + 6, 1).toISOString();

      const res = await mobileApi.fetchCalendarEvents(start, end);
      if (res.ok && res.data && Array.isArray(res.data.events)) {
        setEvents(res.data.events);
      } else {
        setEvents([]);
      }
    } catch (e) {
      console.error(e);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Calendar Day Generation
  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{ dayNumber: number; date: Date; isCurrentMonth: boolean; hasEvents: boolean }> = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: 0, date: new Date(year, month, 0), isCurrentMonth: false, hasEvents: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

      const hasEvents = events.some((e) => {
        if (!e.startAt) return false;
        return e.startAt.startsWith(dateStr) && e.status !== 'cancelled';
      });

      days.push({ dayNumber: d, date: dateObj, isCurrentMonth: true, hasEvents });
    }

    return days;
  }, [currentMonthDate, events]);

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

  // Events filtered for selected date
  const selectedDateStr = useMemo(() => {
    return `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  }, [selectedDate]);

  const dayEvents = useMemo(() => {
    return events.filter((e) => {
      if (!e.startAt) return false;
      return e.startAt.startsWith(selectedDateStr) && e.status !== 'cancelled';
    });
  }, [events, selectedDateStr]);

  // All upcoming events
  const upcomingEvents = useMemo(() => {
    const now = Date.now();
    return events
      .filter((e) => {
        if (!e.startAt) return false;
        const time = new Date(e.startAt).getTime();
        return time >= now && e.status !== 'cancelled';
      })
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  }, [events]);

  const formatEventTime = (startIso: string, endIso?: string) => {
    try {
      const start = new Date(startIso);
      const h = start.getHours();
      const m = start.getMinutes();
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      return `${displayH}:${m === 0 ? '00' : String(m).padStart(2, '0')} ${period}`;
    } catch {
      return '08:00 AM';
    }
  };

  const handleJoinMeeting = (event: CalendarEvent) => {
    const meetLink = event.meetUrl || 'https://meet.google.com/new';
    Linking.openURL(meetLink).catch(() => {
      Alert.alert('Videollamada Online', 'Tu sesión se habilitará 10 minutos antes del inicio a través de Google Meet.');
    });
  };

  const handleCancelAppointment = (event: CalendarEvent) => {
    Alert.alert(
      'Cancelar Cita',
      '¿Estás seguro de que deseas cancelar esta sesión terapéutica? Se liberará el horario en el sistema.',
      [
        { text: 'Volver', style: 'cancel' },
        {
          text: 'Sí, Cancelar Cita',
          style: 'destructive',
          onPress: async () => {
            setCancellingId(event.id);
            try {
              const res = await mobileApi.cancelAppointment(event.id);
              if (res.ok) {
                setEvents((prev) =>
                  prev.map((e) => (e.id === event.id ? { ...e, status: 'cancelled' } : e))
                );
                Alert.alert('Cita Cancelada', 'La sesión ha sido cancelada correctamente.');
              } else {
                Alert.alert('Error', res.error || 'No se pudo cancelar la cita.');
              }
            } catch (e: any) {
              Alert.alert('Error', e.message || 'Error al conectar.');
            } finally {
              setCancellingId(null);
            }
          },
        },
      ]
    );
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
          <Text style={styles.headerMainTitle}>Mi Calendario</Text>
          <Text style={styles.headerSubTitle}>⚡ Citas & Sesiones Terapéuticas</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/agenda' as any)}
          style={styles.newBookingBtn}
          activeOpacity={0.85}
        >
          <Plus color="#FFFFFF" size={15} />
          <Text style={styles.newBookingBtnText}>Agendar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. CALENDARIO MENSUAL TÁCTIL ── */}
        <View style={styles.calendarCard}>
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

          {/* DÍAS DE LA SEMANA */}
          <View style={styles.weekDaysHeader}>
            {DAYS_OF_WEEK.map((d, i) => (
              <Text key={i} style={[styles.weekDayLabel, i === 0 && { color: '#EF4444' }]}>
                {d}
              </Text>
            ))}
          </View>

          {/* GRID DE DÍAS */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((item, idx) => {
              if (!item.isCurrentMonth) {
                return <View key={idx} style={styles.emptyDayCell} />;
              }

              const isSelected =
                selectedDate.getDate() === item.dayNumber &&
                selectedDate.getMonth() === currentMonthDate.getMonth() &&
                selectedDate.getFullYear() === currentMonthDate.getFullYear();

              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    const d = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), item.dayNumber);
                    setSelectedDate(d);
                  }}
                  style={[styles.dayCell, isSelected && styles.dayCellActive]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.dayCellText, isSelected && styles.dayCellTextActive]}>
                    {item.dayNumber}
                  </Text>
                  {item.hasEvents && (
                    <View style={[styles.eventDot, isSelected && { backgroundColor: '#FFFFFF' }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── 2. CITAS DEL DÍA SELECCIONADO ── */}
        <View style={styles.sectionHeaderRow}>
          <CalendarIcon color="#059669" size={17} />
          <Text style={styles.sectionTitle}>
            Sesiones para el {selectedDate.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#059669" />
            <Text style={styles.loadingText}>Cargando tus citas del calendario...</Text>
          </View>
        ) : dayEvents.length > 0 ? (
          <View style={styles.eventsList}>
            {dayEvents.map((evt) => (
              <View key={evt.id} style={styles.eventCard}>
                <View style={styles.eventCardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.eventTitle}>{evt.serviceTitle || evt.title}</Text>
                    <Text style={styles.eventSpeaker}>
                      {evt.type === 'appointment' ? 'Consulta Terapéutica Individual' : `Ponente: ${evt.speaker || 'ConexiónLuz'}`}
                    </Text>
                  </View>

                  <View style={styles.scheduledStatusBadge}>
                    <CheckCircle2 color="#059669" size={12} />
                    <Text style={styles.scheduledStatusText}>Programada</Text>
                  </View>
                </View>

                <View style={styles.eventTimeRow}>
                  <Clock color="#64748B" size={14} />
                  <Text style={styles.eventTimeText}>{formatEventTime(evt.startAt)}</Text>
                  <Text style={styles.eventDurationText}>· 60 min · Sesión Online</Text>
                </View>

                <View style={styles.eventActionsRow}>
                  <TouchableOpacity
                    onPress={() => handleJoinMeeting(evt)}
                    style={styles.joinMeetBtn}
                    activeOpacity={0.88}
                  >
                    <Video color="#FFFFFF" size={15} />
                    <Text style={styles.joinMeetBtnText}>Unirme a Videollamada</Text>
                  </TouchableOpacity>

                  {evt.type === 'appointment' && (
                    <TouchableOpacity
                      onPress={() => handleCancelAppointment(evt)}
                      disabled={cancellingId === evt.id}
                      style={styles.cancelBtn}
                      activeOpacity={0.7}
                    >
                      {cancellingId === evt.id ? (
                        <ActivityIndicator size="small" color="#EF4444" />
                      ) : (
                        <Text style={styles.cancelBtnText}>Cancelar</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyDayBox}>
            <CalendarIcon color="#94A3B8" size={32} />
            <Text style={styles.emptyDayTitle}>No tienes sesiones este día</Text>
            <Text style={styles.emptyDayDesc}>
              Selecciona otra fecha en el calendario o agenda una nueva cita terapéutica.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/agenda' as any)}
              style={styles.emptyAgendarBtn}
              activeOpacity={0.85}
            >
              <Plus color="#059669" size={15} />
              <Text style={styles.emptyAgendarBtnText}>Agendar Cita en esta Fecha</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── 3. PRÓXIMAS SESIONES PROGRAMADAS ── */}
        <View style={[styles.sectionHeaderRow, { marginTop: 14 }]}>
          <Clock color="#059669" size={17} />
          <Text style={styles.sectionTitle}>Todas las Próximas Citas ({upcomingEvents.length})</Text>
        </View>

        {upcomingEvents.length > 0 ? (
          <View style={styles.upcomingList}>
            {upcomingEvents.slice(0, 5).map((evt) => {
              const dateFormatted = new Date(evt.startAt).toLocaleDateString('es-CO', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              });
              return (
                <TouchableOpacity
                  key={evt.id}
                  onPress={() => {
                    setSelectedDate(new Date(evt.startAt));
                  }}
                  style={styles.upcomingItem}
                  activeOpacity={0.8}
                >
                  <View style={styles.upcomingDateBadge}>
                    <Text style={styles.upcomingDateBadgeDay}>{new Date(evt.startAt).getDate()}</Text>
                    <Text style={styles.upcomingDateBadgeMonth}>
                      {MONTH_NAMES[new Date(evt.startAt).getMonth()].slice(0, 3)}
                    </Text>
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.upcomingTitle}>{evt.serviceTitle || evt.title}</Text>
                    <Text style={styles.upcomingTime}>
                      {dateFormatted} · {formatEventTime(evt.startAt)}
                    </Text>
                  </View>

                  <ChevronRight color="#CBD5E1" size={18} />
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyUpcomingBox}>
            <Sparkles color="#D97706" size={24} />
            <Text style={styles.emptyUpcomingText}>No tienes sesiones pendientes por realizar.</Text>
          </View>
        )}

        <View style={{ height: 36 }} />
      </ScrollView>
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
  newBookingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  newBookingBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },

  // CALENDAR CARD
  calendarCard: {
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
    gap: 10,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthNavBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitleText: {
    fontSize: 15.5,
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
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    marginVertical: 2,
    position: 'relative',
  },
  emptyDayCell: {
    width: (width - 64) / 7,
    height: 38,
  },
  dayCellActive: {
    backgroundColor: '#059669',
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
  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#059669',
    position: 'absolute',
    bottom: 4,
  },

  // SECTION HEADERS
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0F172A',
  },

  loadingBox: {
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },

  // EVENT CARD
  eventsList: {
    gap: 10,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 10,
  },
  eventCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  eventSpeaker: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  scheduledStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  scheduledStatusText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#047857',
  },
  eventTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 10,
  },
  eventTimeText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  eventDurationText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  eventActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  joinMeetBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 12,
  },
  joinMeetBtnText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E11D48',
  },

  // EMPTY STATE
  emptyDayBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  emptyDayTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  emptyDayDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
  emptyAgendarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 4,
  },
  emptyAgendarBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#047857',
  },

  // UPCOMING SESSIONS
  upcomingList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 6,
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  upcomingDateBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  upcomingDateBadgeDay: {
    fontSize: 14,
    fontWeight: '900',
    color: '#047857',
  },
  upcomingDateBadgeMonth: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
    textTransform: 'uppercase',
  },
  upcomingTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  upcomingTime: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  emptyUpcomingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  emptyUpcomingText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '700',
  },
});
