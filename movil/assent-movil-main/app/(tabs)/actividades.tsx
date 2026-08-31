import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Activity,
  Wind,
  Dumbbell,
  ClipboardList,
  NotebookPen,
  Sparkles,
  Flame,
  CheckCircle2,
  ChevronRight,
  Heart,
  Smile,
  Meh,
  Frown,
  Angry,
  Zap,
  ShieldCheck,
  Send,
  Plus,
  Compass,
  ArrowRight,
  BarChart2,
  Lock,
  Tag,
  Calendar as CalendarIcon,
} from 'lucide-react-native';
import { mobileApi } from '../../api/client';
import { LumiHeaderBadge } from '../../components/LumiHeaderBadge';
import { LumiWalletModal } from '../../components/LumiWalletModal';
import { useAuth } from '../../context/AuthContext';

// 5 Estados de Ánimo con mensaje clínico y actividad física recomendada
const MOODS_DATA = [
  {
    id: 'excelente',
    label: 'Excelente',
    emoji: '🤩',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
    positiveMessage: '¡Qué alegría! Aprovecha esta ola de energía positiva para celebrar tus logros y compartir tu luz.',
    physicalActivity: 'Celebración Corporal: Pon una canción alegre durante 3 minutos y baila libremente.',
  },
  {
    id: 'bien',
    label: 'Bien',
    emoji: '😊',
    color: '#4F46E5',
    bg: '#EEF2FF',
    border: '#C7D2FE',
    positiveMessage: 'Te encuentras en un buen estado de calma y claridad mental. Es un gran momento para avanzar con serenidad.',
    physicalActivity: 'Estiramiento Consciente: Dedica 3 minutos a estirar tus brazos al cielo, hombros y cuello.',
  },
  {
    id: 'regular',
    label: 'Regular',
    emoji: '😐',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    positiveMessage: 'Está bien sentirse neutro o sin mucha energía. Escucha a tu cuerpo, no te exijas de más.',
    physicalActivity: 'Caminata de Conexión: Da un paseo de 5 minutos sintiendo la planta de tus pies tocar el suelo.',
  },
  {
    id: 'desanimado',
    label: 'Desanimado',
    emoji: '😔',
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    positiveMessage: 'Permítete sentir el cansancio o el desánimo. Trátate con la compasión y paciencia de un buen amigo/a.',
    physicalActivity: 'Apertura de Pecho: Abre los brazos al inhalar y abrázate a ti mismo al exhalar durante 2 minutos.',
  },
  {
    id: 'abrumado',
    label: 'Abrumado',
    emoji: '😢',
    color: '#E11D48',
    bg: '#FFF1F2',
    border: '#FECDD3',
    positiveMessage: 'Aunque la emoción se sienta pesada hoy, recuerda que estás a salvo y este estado es transitorio.',
    physicalActivity: 'Sacudida Corporal (Shaking): De pie, sacude tus manos, brazos y piernas suavemente durante 1 minuto.',
  },
];

// 4 Tests de Bienestar Clínicos
const TESTS_DATA = [
  {
    id: 'ansiedad',
    title: 'Nivel de Ansiedad',
    subtitle: 'Escala GAD-7',
    desc: 'Evalúa síntomas de tensión, inquietud y preocupación en las últimas 2 semanas.',
    duration: '3 min',
    color: '#4F46E5',
    bg: '#EEF2FF',
    tag: 'Clínico',
  },
  {
    id: 'estado-animo',
    title: 'Estado de Ánimo',
    subtitle: 'Escala PHQ-9',
    desc: 'Detecta fatiga, desánimo y su impacto en tu vida cotidiana.',
    duration: '4 min',
    color: '#2563EB',
    bg: '#EFF6FF',
    tag: 'Clínico',
  },
  {
    id: 'bienestar',
    title: 'Bienestar General',
    subtitle: 'Índice WHO-5 (OMS)',
    desc: 'Mide tu vitalidad, tranquilidad y calidad de vida emocional.',
    duration: '2 min',
    color: '#059669',
    bg: '#ECFDF5',
    tag: 'Bienestar',
  },
  {
    id: 'autoestima',
    title: 'Escala de Autoestima',
    subtitle: 'Escala de Rosenberg',
    desc: 'Evalúa tu nivel de autovaloración y respeto hacia ti mismo/a.',
    duration: '3 min',
    color: '#D97706',
    bg: '#FFFBEB',
    tag: 'Personal',
  },
];

// 5 Ejercicios Guiados
const EXERCISES_DATA = [
  {
    id: 'respiracion-4-7-8',
    title: 'Respiración 4-7-8',
    subtitle: 'Técnica de Relajación Profunda',
    category: 'Respiración',
    duration: '2 min',
    color: '#6366F1',
    bg: '#EEF2FF',
  },
  {
    id: 'mindfulness-5',
    title: 'Mindfulness de 5 Sentidos',
    subtitle: 'Anclaje Sensorial (Grounding)',
    category: 'Mindfulness',
    duration: '3 min',
    color: '#10B981',
    bg: '#ECFDF5',
  },
  {
    id: 'pmr-progreso',
    title: 'Relajación Muscular de Jacobson',
    subtitle: 'Tensión y Liberación Corporal',
    category: 'Corporal',
    duration: '4 min',
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    id: 'visualizacion-lugar-seguro',
    title: 'Visualización: Tu Lugar Seguro',
    subtitle: 'Santuario Mental y Serenidad',
    category: 'Visualización',
    duration: '3 min',
    color: '#8B5CF6',
    bg: '#F5F3FF',
  },
  {
    id: 'compasion-emocional',
    title: 'Autocompasión y Aceptación',
    subtitle: 'Abrazo Consciente a tus Emociones',
    category: 'Emocional',
    duration: '2.5 min',
    color: '#D97706',
    bg: '#FFFBEB',
  },
];

// 4 Técnicas de Respiración
const BREATHING_DATA = [
  {
    id: 'box',
    title: 'Respiración Cuadrada (4-4-4-4)',
    subtitle: 'Box Breathing (Navy SEALs)',
    desc: 'Equilibra el sistema nervioso y controla el pánico o estrés agudo.',
    color: '#0EA5E9',
    bg: '#E0F2FE',
  },
  {
    id: '4-7-8',
    title: 'Respiración 4-7-8',
    subtitle: 'Técnica del Dr. Andrew Weil',
    desc: 'Activa el sistema parasimpático para reducir ansiedad y dormir mejor.',
    color: '#6366F1',
    bg: '#EEF2FF',
  },
  {
    id: 'coherente',
    title: 'Respiración Coherente (5-5)',
    subtitle: '5 respiraciones por minuto',
    desc: 'Sincroniza corazón y cerebro para una óptima variabilidad cardíaca.',
    color: '#10B981',
    bg: '#ECFDF5',
  },
  {
    id: 'calma',
    title: 'Respiración de Calma (4-8)',
    subtitle: 'Exhalación Prolongada',
    desc: 'Estimula el nervio vago y disminuye el estrés en menos de 2 minutos.',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
];

const TAGS_OPTIONS = ['Familia', 'Trabajo', 'Salud', 'Relaciones', 'Sueño', 'Ejercicio', 'Estrés', 'Gratitud'];

export default function ActividadesScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const { user } = useAuth();

  // Tab activa
  const [activeSection, setActiveSection] = useState<'tests' | 'ejercicios' | 'relajacion' | 'diario' | 'progreso'>('tests');

  // Check-in diario
  const [selectedMoodId, setSelectedMoodId] = useState<string>('bien');
  const [checkinSaved, setCheckinSaved] = useState<boolean>(false);
  const [streakDays, setStreakDays] = useState<number>(3);
  const [showLumiWalletModal, setShowLumiWalletModal] = useState<boolean>(false);

  // Sabiduría AWE
  const [wisdom, setWisdom] = useState<any>({
    titulo: 'La calma es tu superpoder interior',
    texto: 'No puedes controlar todas las tormentas del exterior, pero puedes ser el refugio dentro de ti mismo.',
    autor: 'Psicología Cuántica & Mindfulness',
    habito: 'Toma 3 respiraciones profundas antes de responder a un mensaje difícil.',
  });

  // Diario Emocional Form
  const [journalMood, setJournalMood] = useState<string>('bien');
  const [gratitude1, setGratitude1] = useState<string>('');
  const [gratitude2, setGratitude2] = useState<string>('');
  const [gratitude3, setGratitude3] = useState<string>('');
  const [journalText, setJournalText] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Gratitud']);
  const [journalList, setJournalList] = useState<Array<{ id: string; moodEmoji: string; moodLabel: string; text: string; gratitudes: string[]; date: string; tags: string[] }>>([
    {
      id: '1',
      moodEmoji: '🤩',
      moodLabel: 'Excelente',
      text: 'Hoy sentí una gran paz durante mi meditación matutina y avancé en mis proyectos.',
      gratitudes: ['Mi salud y energía', 'Un café caliente en la mañana', 'El apoyo de mi familia'],
      date: 'Ayer, 8:45 PM',
      tags: ['Salud', 'Gratitud'],
    },
  ]);

  const currentMoodObj = MOODS_DATA.find((m) => m.id === selectedMoodId) || MOODS_DATA[1];

  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        const aweRes = await mobileApi.fetchAweDaily();
        if (aweRes.ok && aweRes.resource) {
          const r = aweRes.resource;
          setWisdom({
            titulo: r.titulo || r.tema || 'Píldora de Sabiduría',
            texto: r.contenido || r.texto || r.descripcion,
            autor: r.escuela || 'Conexión Luz®',
            habito: r.accion_sugerida || 'Dedica 5 minutos a la introspección.',
          });
        }
      } catch {}
    };
    fetchDailyData();
  }, []);

  const handleSaveCheckin = async () => {
    setCheckinSaved(true);
    setStreakDays((prev) => prev + 1);
    try {
      await mobileApi.submitDailyCheckin({
        energyLevel: selectedMoodId,
      });
    } catch {}
    Alert.alert('🎉 ¡Check-in Guardado!', 'Has registrado tu sintonía emocional de hoy con éxito.');
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSaveJournal = () => {
    if (!journalText.trim() && !gratitude1.trim()) {
      Alert.alert('Escribe tu reflexión', 'Por favor escribe tu sentir o al menos un motivo de gratitud de hoy.');
      return;
    }

    const moodObj = MOODS_DATA.find((m) => m.id === journalMood) || MOODS_DATA[1];
    const grats = [gratitude1, gratitude2, gratitude3].filter(Boolean);

    const newEntry = {
      id: Date.now().toString(),
      moodEmoji: moodObj.emoji,
      moodLabel: moodObj.label,
      text: journalText.trim(),
      gratitudes: grats,
      date: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tags: selectedTags,
    };

    setJournalList([newEntry, ...journalList]);
    setJournalText('');
    setGratitude1('');
    setGratitude2('');
    setGratitude3('');
    Alert.alert('📖 Entrada Guardada', 'Tu diario de sanación ha sido actualizado con éxito.');
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent={true} />

      {/* HEADER BAR */}
      <View style={styles.topHeader}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Activity color="#059669" size={20} />
          </View>
          <View>
            <Text style={styles.brandTitle}>SANTUARIO DE ACTIVIDADES</Text>
            <Text style={styles.brandSubtitle}>Herramientas de Sanación Diaria</Text>
          </View>
        </View>

        <View style={styles.streakBadge}>
          <Flame color="#EA580C" size={15} fill="#EA580C" />
          <Text style={styles.streakText}>{streakDays} Días</Text>
        </View>
      </View>

      {/* FIXED LUMIS BANNER */}
      <LumiHeaderBadge
        variant="banner"
        onPress={() => router.push('/comprar-lumis' as any)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. CHECK-IN DIARIO CON MENSAJE TERAPÉUTICO */}
        <View style={styles.checkinCard}>
          <View style={styles.checkinTopRow}>
            <View>
              <Text style={styles.checkinTag}>CHECK-IN EMOCIONAL</Text>
              <Text style={styles.checkinTitle}>¿Cómo te sientes hoy?</Text>
            </View>
            <View style={[styles.lumiBadge, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
              <Sparkles color="#059669" size={13} />
              <Text style={[styles.lumiBadgeText, { color: '#047857' }]}>Diario</Text>
            </View>
          </View>

          {/* Emojis selector */}
          <View style={styles.moodsRow}>
            {MOODS_DATA.map((m) => {
              const isSelected = selectedMoodId === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => setSelectedMoodId(m.id)}
                  style={[
                    styles.moodItem,
                    isSelected && { backgroundColor: m.bg, borderColor: m.color, borderWidth: 1.5 },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.moodEmoji}>{m.emoji}</Text>
                  <Text style={[styles.moodLabel, isSelected && { color: m.color, fontWeight: '800' }]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Mensaje de apoyo clínico y actividad sugerida */}
          <View style={[styles.moodFeedbackCard, { backgroundColor: currentMoodObj.bg, borderColor: currentMoodObj.border }]}>
            <Text style={[styles.moodFeedbackMessage, { color: currentMoodObj.color }]}>
              "{currentMoodObj.positiveMessage}"
            </Text>
            <View style={styles.moodActivityRow}>
              <Zap color={currentMoodObj.color} size={15} />
              <Text style={[styles.moodActivityText, { color: currentMoodObj.color }]}>
                {currentMoodObj.physicalActivity}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSaveCheckin}
            disabled={checkinSaved}
            style={[styles.saveCheckinBtn, checkinSaved && styles.saveCheckinBtnDone]}
            activeOpacity={0.85}
          >
            {checkinSaved ? (
              <>
                <CheckCircle2 color="#FFFFFF" size={16} />
                <Text style={styles.saveCheckinBtnText}>¡Check-in Registrado Hoy!</Text>
              </>
            ) : (
              <>
                <CheckCircle2 color="#FFFFFF" size={16} />
                <Text style={styles.saveCheckinBtnText}>Registrar mi Check-in</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* 2. PÍLDORA DE SABIDURÍA (AWE) */}
        {wisdom && (
          <View style={styles.wisdomCard}>
            <View style={styles.wisdomTopRow}>
              <View style={styles.wisdomBadge}>
                <Sparkles color="#6366F1" size={12} />
                <Text style={styles.wisdomBadgeText}>SABIDURÍA CUÁNTICA</Text>
              </View>
              <Text style={styles.wisdomAuthor}>{wisdom.autor}</Text>
            </View>

            <Text style={styles.wisdomTitle}>{wisdom.titulo}</Text>
            <Text style={styles.wisdomText}>"{wisdom.texto}"</Text>

            <View style={styles.wisdomHabitBox}>
              <Compass color="#4F46E5" size={16} />
              <View style={{ flex: 1 }}>
                <Text style={styles.wisdomHabitLabel}>Micro-Práctica del Día:</Text>
                <Text style={styles.wisdomHabitText}>{wisdom.habito}</Text>
              </View>
            </View>
          </View>
        )}

        {/* HERO BANNER BUTTON: DIARIO EMOCIONAL INDEPENDIENTE */}
        <TouchableOpacity
          onPress={() => router.push('/diario-emocional' as any)}
          style={styles.diarioHeroBtn}
          activeOpacity={0.88}
        >
          <View style={styles.diarioHeroIconBox}>
            <NotebookPen color="#047857" size={24} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.diarioHeroTagRow}>
              <Sparkles color="#047857" size={12} />
              <Text style={styles.diarioHeroTagText}>ESPACIO CONFIDENCIAL DE SANACIÓN</Text>
            </View>
            <Text style={styles.diarioHeroTitle}>Diario Emocional & Gratitud</Text>
            <Text style={styles.diarioHeroSub}>
              Registra tu estado de ánimo, 3 gratitudes y reflexiones en tu página independiente.
            </Text>
          </View>
          <View style={styles.diarioHeroArrowCircle}>
            <ArrowRight color="#FFFFFF" size={16} />
          </View>
        </TouchableOpacity>

        {/* 3. NAVEGACIÓN POR PESTAÑAS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollRow}>
          {[
            { id: 'agenda', label: 'Agendar Cita', icon: CalendarIcon, color: '#059669' },
            { id: 'mi-calendario', label: 'Mi Calendario', icon: CalendarIcon, color: '#0EA5E9' },
            { id: 'tests', label: 'Tests de Bienestar', icon: ClipboardList, color: '#4F46E5' },
            { id: 'ejercicios', label: 'Ejercicios Guiados', icon: Dumbbell, color: '#059669' },
            { id: 'relajacion', label: 'Relajación & Respiración', icon: Wind, color: '#0EA5E9' },
            { id: 'diario', label: 'Diario Emocional', icon: NotebookPen, color: '#D97706' },
            { id: 'progreso', label: 'Mi Progreso', icon: BarChart2, color: '#EC4899' },
          ].map((tab) => {
            const isSelected = activeSection === tab.id;
            const Icon = tab.icon;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => {
                  if (tab.id === 'agenda') {
                    router.push('/agenda' as any);
                  } else if (tab.id === 'mi-calendario') {
                    router.push('/mi-calendario' as any);
                  } else if (tab.id === 'diario') {
                    router.push('/diario-emocional' as any);
                  } else if (tab.id === 'progreso') {
                    router.push('/progreso' as any);
                  } else {
                    setActiveSection(tab.id as any);
                  }
                }}
                style={[styles.tabChip, isSelected && styles.tabChipActive]}
                activeOpacity={0.8}
              >
                <Icon color={isSelected ? '#FFFFFF' : tab.color} size={15} />
                <Text style={[styles.tabChipText, isSelected && styles.tabChipTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 4. CONTENIDO SEGÚN SECCIÓN */}

        {/* SECCIÓN 1: TESTS DE BIENESTAR */}
        {activeSection === 'tests' && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Tests de Bienestar Clínicos</Text>
              <Text style={styles.sectionSubtitle}>Cuestionarios validados con diagnóstico y recomendaciones</Text>
            </View>

            {TESTS_DATA.map((t) => (
              <TouchableOpacity
                key={t.id}
                onPress={() => router.push({ pathname: '/test-detalle', params: { id: t.id } } as any)}
                style={styles.cardItem}
                activeOpacity={0.88}
              >
                <View style={[styles.cardIconBox, { backgroundColor: t.bg }]}>
                  <ClipboardList color={t.color} size={22} />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.badgeCategory}>
                    <Text style={[styles.badgeCategoryText, { color: t.color }]}>
                      {t.subtitle} • {t.duration}
                    </Text>
                  </View>
                  <Text style={styles.cardItemTitle}>{t.title}</Text>
                  <Text style={styles.cardItemDesc}>{t.desc}</Text>
                </View>

                <ChevronRight color="#94A3B8" size={20} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* SECCIÓN 2: EJERCICIOS GUIADOS */}
        {activeSection === 'ejercicios' && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Protocolos Clínicos Paso a Paso</Text>
              <Text style={styles.sectionSubtitle}>Técnicas de regulación corporal, anclaje y autocompasión</Text>
            </View>

            {EXERCISES_DATA.map((ex) => (
              <TouchableOpacity
                key={ex.id}
                onPress={() => router.push({ pathname: '/ejercicio-detalle', params: { id: ex.id } } as any)}
                style={styles.cardItem}
                activeOpacity={0.88}
              >
                <View style={[styles.cardIconBox, { backgroundColor: ex.bg }]}>
                  <Dumbbell color={ex.color} size={22} />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.badgeCategory}>
                    <Text style={[styles.badgeCategoryText, { color: ex.color }]}>
                      {ex.category} • {ex.duration}
                    </Text>
                  </View>
                  <Text style={styles.cardItemTitle}>{ex.title}</Text>
                  <Text style={styles.cardItemDesc}>{ex.subtitle}</Text>
                </View>

                <ChevronRight color="#94A3B8" size={20} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* SECCIÓN 3: RELAJACIÓN & RESPIRACIÓN */}
        {activeSection === 'relajacion' && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Respiración & Mindfulness</Text>
              <Text style={styles.sectionSubtitle}>Visualizador de respiración guiada para calma inmediata</Text>
            </View>

            {BREATHING_DATA.map((b) => (
              <TouchableOpacity
                key={b.id}
                onPress={() => router.push({ pathname: '/relajacion-detalle', params: { id: b.id } } as any)}
                style={styles.cardItem}
                activeOpacity={0.88}
              >
                <View style={[styles.cardIconBox, { backgroundColor: b.bg }]}>
                  <Wind color={b.color} size={22} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.cardItemTitle}>{b.title}</Text>
                  <Text style={styles.cardItemDesc}>{b.desc}</Text>
                </View>

                <ChevronRight color="#94A3B8" size={20} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* SECCIÓN 4: DIARIO EMOCIONAL */}
        {activeSection === 'diario' && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Diario de Sanación & Gratitud</Text>
              <Text style={styles.sectionSubtitle}>Registra tu sentir sin juicios en tu espacio seguro</Text>
            </View>

            {/* Formulario de nueva entrada */}
            <View style={styles.journalFormCard}>
              <Text style={styles.inputLabel}>1. Estado de Ánimo</Text>
              <View style={styles.journalMoodsRow}>
                {MOODS_DATA.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    onPress={() => setJournalMood(m.id)}
                    style={[
                      styles.journalMoodBtn,
                      journalMood === m.id && { backgroundColor: m.bg, borderColor: m.color, borderWidth: 1.5 },
                    ]}
                  >
                    <Text style={{ fontSize: 18 }}>{m.emoji}</Text>
                    <Text style={[styles.journalMoodBtnText, journalMood === m.id && { color: m.color, fontWeight: '800' }]}>
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>2. Una sola cosa por la que doy gracias hoy</Text>
              <TextInput
                style={styles.gratitudeSpaciousInput}
                placeholder="Agradezco de corazón por..."
                placeholderTextColor="#94A3B8"
                value={gratitude1}
                onChangeText={setGratitude1}
              />

              <Text style={styles.inputLabel}>3. Tu Reflexión Personal</Text>
              <TextInput
                style={styles.journalTextArea}
                placeholder="¿Qué pensamientos o emociones estás procesando hoy? Escribe con libertad..."
                placeholderTextColor="#94A3B8"
                value={journalText}
                onChangeText={setJournalText}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />

              <Text style={styles.inputLabel}>4. Áreas Relacionadas</Text>
              <View style={styles.tagsRow}>
                {TAGS_OPTIONS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      onPress={() => handleToggleTag(tag)}
                      style={[styles.tagChip, isSelected && styles.tagChipActive]}
                    >
                      <Text style={[styles.tagChipText, isSelected && styles.tagChipTextActive]}>
                        #{tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity onPress={handleSaveJournal} style={styles.saveJournalBtn} activeOpacity={0.85}>
                <Send color="#FFFFFF" size={16} />
                <Text style={styles.saveJournalBtnText}>Guardar en mi Diario de Luz</Text>
              </TouchableOpacity>
            </View>

            {/* Listado de entradas anteriores */}
            <Text style={[styles.sectionTitle, { marginTop: 14, marginBottom: 8 }]}>Entradas Guardadas</Text>
            {journalList.map((entry) => (
              <View key={entry.id} style={styles.entryCard}>
                <View style={styles.entryTopRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: 16 }}>{entry.moodEmoji}</Text>
                    <Text style={styles.entryMoodLabel}>{entry.moodLabel}</Text>
                  </View>
                  <Text style={styles.entryDateText}>{entry.date}</Text>
                </View>

                {entry.gratitudes?.length > 0 && (
                  <View style={styles.entryGratitudesBox}>
                    <Text style={styles.entryGratitudeHeading}>Gratitudes:</Text>
                    {entry.gratitudes.map((g, i) => (
                      <Text key={i} style={styles.entryGratitudeItem}>• {g}</Text>
                    ))}
                  </View>
                )}

                {entry.text ? <Text style={styles.entryBodyText}>"{entry.text}"</Text> : null}

                {entry.tags?.length > 0 && (
                  <View style={styles.entryTagsRow}>
                    {entry.tags.map((t, idx) => (
                      <Text key={idx} style={styles.entryTagItem}>#{t}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* SECCIÓN 5: MI PROGRESO */}
        {activeSection === 'progreso' && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Evolución & Racha de Autocuidado</Text>
              <Text style={styles.sectionSubtitle}>Seguimiento a tus hábitos y transformaciones</Text>
            </View>

            <View style={styles.progresoStatsCard}>
              <View style={styles.statBox}>
                <Flame color="#EA580C" size={24} fill="#EA580C" />
                <Text style={styles.statBoxNumber}>{streakDays} Días</Text>
                <Text style={styles.statBoxLabel}>Racha Activa</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Sparkles color="#D97706" size={24} />
                <Text style={styles.statBoxNumber}>150</Text>
                <Text style={styles.statBoxLabel}>Lumis Ganados</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <CheckCircle2 color="#059669" size={24} />
                <Text style={styles.statBoxNumber}>4</Text>
                <Text style={styles.statBoxLabel}>Prácticas</Text>
              </View>
            </View>

            <View style={styles.progresoBanner}>
              <ShieldCheck color="#059669" size={20} />
              <View style={{ flex: 1 }}>
                <Text style={styles.progresoBannerTitle}>Tu compromiso está floreciendo</Text>
                <Text style={styles.progresoBannerDesc}>
                  Dedicar solo 5 minutos al día a tu salud mental reduce significativamente el cortisol y la ansiedad.
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 60 }} />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  streakText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#EA580C',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },

  // CHECKIN CARD
  checkinCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  checkinTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkinTag: {
    fontSize: 10,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.6,
  },
  checkinTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 1,
  },
  lumiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  lumiBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
  },
  moodsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  moodItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 54,
  },
  moodEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  moodLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#64748B',
  },
  moodFeedbackCard: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  moodFeedbackMessage: {
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  moodActivityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moodActivityText: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
    lineHeight: 15,
  },
  saveCheckinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingVertical: 11,
    borderRadius: 12,
  },
  saveCheckinBtnDone: {
    backgroundColor: '#10B981',
  },
  saveCheckinBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },

  // WISDOM CARD
  wisdomCard: {
    backgroundColor: '#F5F3FF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  wisdomTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wisdomBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  wisdomBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#6366F1',
  },
  wisdomAuthor: {
    fontSize: 11,
    color: '#7C3AED',
    fontWeight: '600',
  },
  wisdomTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4C1D95',
    marginBottom: 4,
  },
  wisdomText: {
    fontSize: 12.5,
    fontStyle: 'italic',
    color: '#5B21B6',
    lineHeight: 18,
    marginBottom: 12,
  },
  wisdomHabitBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  wisdomHabitLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4338CA',
  },
  wisdomHabitText: {
    fontSize: 11.5,
    color: '#3730A3',
  },

  // TABS HORIZONTAL
  tabsScrollRow: {
    gap: 8,
    paddingVertical: 4,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  tabChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  tabChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // SECTION ITEMS
  sectionContainer: {
    gap: 10,
  },
  sectionHeaderRow: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCategory: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 3,
  },
  badgeCategoryText: {
    fontSize: 10,
    fontWeight: '800',
  },
  cardItemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardItemDesc: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },

  // DIARIO FORM
  journalFormCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: 6,
  },
  journalMoodsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  journalMoodBtn: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  journalMoodBtnText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  gratitudeSpaciousInput: {
    backgroundColor: '#FFFDF5',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: '#78350F',
    marginBottom: 10,
  },
  journalTextArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12.5,
    color: '#0F172A',
    height: 80,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  tagChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagChipActive: {
    backgroundColor: '#059669',
  },
  tagChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '700',
  },
  tagChipTextActive: {
    color: '#FFFFFF',
  },
  saveJournalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 14,
  },
  saveJournalBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  // ENTRIES LIST
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  entryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  entryMoodLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  entryDateText: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  entryGratitudesBox: {
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: 10,
    marginBottom: 6,
  },
  entryGratitudeHeading: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 2,
  },
  entryGratitudeItem: {
    fontSize: 11.5,
    color: '#78350F',
    lineHeight: 16,
  },
  entryBodyText: {
    fontSize: 12.5,
    fontStyle: 'italic',
    color: '#334155',
    lineHeight: 18,
    marginBottom: 6,
  },
  entryTagsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  entryTagItem: {
    fontSize: 10.5,
    color: '#059669',
    fontWeight: '700',
  },

  // PROGRESO
  progresoStatsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statBoxNumber: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 4,
  },
  statBoxLabel: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E2E8F0',
  },
  progresoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#ECFDF5',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 10,
  },
  progresoBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
    marginBottom: 2,
  },
  progresoBannerDesc: {
    fontSize: 11.5,
    color: '#047857',
    lineHeight: 16,
  },
  diarioHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    gap: 12,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  diarioHeroIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  diarioHeroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  diarioHeroTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#047857',
    letterSpacing: 0.5,
  },
  diarioHeroTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#065F46',
  },
  diarioHeroSub: {
    fontSize: 11.5,
    color: '#059669',
    marginTop: 2,
    lineHeight: 16,
  },
  diarioHeroArrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
