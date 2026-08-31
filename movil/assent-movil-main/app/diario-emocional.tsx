import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ChevronLeft,
  NotebookPen,
  Heart,
  Sparkles,
  Send,
  Trash2,
  Search,
  CheckCircle2,
  Zap,
  Flame,
  Award,
  BookOpen,
  Sun,
  ShieldCheck,
} from 'lucide-react-native';
import { mobileApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { LumiHeaderBadge } from '../components/LumiHeaderBadge';
import { LumiWalletModal } from '../components/LumiWalletModal';

export interface MoodItem {
  id: string;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  border: string;
  positiveMessage: string;
  physicalActivity: string;
}

export const MOODS_LIST: MoodItem[] = [
  {
    id: 'excelente',
    label: 'Excelente',
    emoji: '🤩',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
    positiveMessage: '¡Qué alegría! Aprovecha esta ola de energía positiva para celebrar tus logros y compartir tu luz.',
    physicalActivity: 'Celebración Corporal: Pon una canción alegre durante 3 minutos y baila libremente sintiendo la expansión en tu pecho.',
  },
  {
    id: 'bien',
    label: 'Bien',
    emoji: '😊',
    color: '#4F46E5',
    bg: '#EEF2FF',
    border: '#C7D2FE',
    positiveMessage: 'Te encuentras en un buen estado de calma y claridad mental. Es un gran momento para avanzar con serenidad.',
    physicalActivity: 'Estiramiento Consciente: Dedica 3 minutos a estirar tus brazos al cielo, hombros y cuello para disolver la tensión.',
  },
  {
    id: 'regular',
    label: 'Regular',
    emoji: '😐',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    positiveMessage: 'Está bien sentirse neutro o sin mucha energía. Escucha a tu cuerpo, no te exijas de más.',
    physicalActivity: 'Caminata de Conexión: Da un paseo de 5 minutos, concentrándote en la planta de tus pies tocando el suelo.',
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
    physicalActivity: 'Sacudida Corporal (Shaking): De pie, sacude tus manos, brazos y piernas suavemente durante 1 a 2 minutos.',
  },
];

const TAGS_OPTIONS = [
  'Paz',
  'Gratitud',
  'Salud',
  'Familia',
  'Trabajo',
  'Relaciones',
  'Sueño',
  'Ejercicio',
  'Logro',
  'Sanación',
];

const INSPIRATIONAL_QUOTES = [
  '«Tu sentir de hoy no define tu mañana, pero registrarlo te ayuda a sanar hoy.»',
  '«Una sola cosa agradecida con el corazón basta para transformar todo tu día.»',
  '«Cada emoción es un mensajero, no un enemigo. Escúchala sin juzgar.»',
  '«Sé paciente contigo mismo. Crecer es un proceso silencioso y gradual.»',
  '«Tu espacio seguro está aquí. Respira hondo y escribe con total libertad.»',
];

const STORAGE_KEY = 'conexionluz:diario-emocional-entries';

export interface JournalEntry {
  id: string;
  moodId: string;
  moodLabel: string;
  moodEmoji: string;
  moodColor: string;
  gratitude: string;
  reflection: string;
  tags: string[];
  createdAt: string;
}

export default function DiarioEmocionalScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const { user } = useAuth();

  const [selectedMoodId, setSelectedMoodId] = useState<string>('bien');
  const [gratitude, setGratitude] = useState<string>('');
  const [reflectionText, setReflectionText] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Gratitud', 'Paz']);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showLumiWalletModal, setShowLumiWalletModal] = useState<boolean>(false);
  const [quoteIdx] = useState<number>(() => Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length));

  const currentMood = MOODS_LIST.find((m) => m.id === selectedMoodId) || MOODS_LIST[1];

  useEffect(() => {
    loadSavedEntries();
  }, []);

  const loadSavedEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEntries(JSON.parse(stored));
      } else {
        const initial: JournalEntry[] = [
          {
            id: 'init-1',
            moodId: 'excelente',
            moodLabel: 'Excelente',
            moodEmoji: '🤩',
            moodColor: '#059669',
            gratitude: 'Tener salud, paz mental y la oportunidad de empezar un nuevo día con esperanza.',
            reflection: 'Hoy sentí una profunda calma durante mi mañana. Reconozco que cada paso cuenta y me permito disfrutar el presente.',
            tags: ['Salud', 'Gratitud', 'Paz'],
            createdAt: 'Ayer, 8:30 PM',
          },
        ];
        setEntries(initial);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      }
    } catch {}
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSaveEntry = async () => {
    if (!reflectionText.trim() && !gratitude.trim()) {
      Alert.alert('Escribe en tu diario', 'Por favor ingresa una reflexión o tu motivo de gratitud de hoy.');
      return;
    }

    setIsSaving(true);
    const now = new Date();
    const formattedDate = `Hoy, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      moodId: currentMood.id,
      moodLabel: currentMood.label,
      moodEmoji: currentMood.emoji,
      moodColor: currentMood.color,
      gratitude: gratitude.trim(),
      reflection: reflectionText.trim(),
      tags: selectedTags,
      createdAt: formattedDate,
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      await mobileApi.submitDailyCheckin({ energyLevel: currentMood.id });
    } catch {}

    setGratitude('');
    setReflectionText('');
    setIsSaving(false);
    Alert.alert('✨ Entrada Guardada', 'Tu diario ha sido guardado con éxito.');
  };

  const handleDeleteEntry = (entryId: string) => {
    Alert.alert('Eliminar página', '¿Deseas eliminar este registro de tu diario?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const filtered = entries.filter((e) => e.id !== entryId);
          setEntries(filtered);
          try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
          } catch {}
        },
      },
    ]);
  };

  const filteredEntries = entries.filter((e) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.reflection?.toLowerCase().includes(q) ||
      e.gratitude?.toLowerCase().includes(q) ||
      e.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent={true} />

      {/* TOP HEADER */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackBtn} activeOpacity={0.7}>
          <ChevronLeft color="#0F172A" size={24} />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={styles.headerBadgeRow}>
            <Sparkles color="#059669" size={13} />
            <Text style={styles.headerBadgeText}>SANTUARIO INTERIOR</Text>
          </View>
          <Text style={styles.headerMainTitle} numberOfLines={1}>Diario de Sanación & Gratitud</Text>
        </View>

        <View style={styles.streakPill}>
          <Flame color="#EA580C" size={15} fill="#EA580C" />
          <Text style={styles.streakPillText}>{entries.length} Páginas</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* BANNER DE INSPIRACIÓN ELEGANTE */}
        <View style={styles.quoteBanner}>
          <Sparkles color="#6366F1" size={18} />
          <Text style={styles.quoteText}>{INSPIRATIONAL_QUOTES[quoteIdx]}</Text>
        </View>

        {/* 1. SELECCIÓN DE ESTADO DE ÁNIMO (AMPLIO Y TÁCTIL) */}
        <View style={styles.cardWrapper}>
          <Text style={styles.sectionHeaderTitle}>¿Cómo te sientes en este momento?</Text>
          <Text style={styles.sectionHeaderSub}>Selecciona tu estado emocional para recibir guía personalizada</Text>

          <View style={styles.moodsGrid}>
            {MOODS_LIST.map((m) => {
              const isSelected = selectedMoodId === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => setSelectedMoodId(m.id)}
                  style={[
                    styles.moodButton,
                    isSelected && { backgroundColor: m.bg, borderColor: m.color, borderWidth: 2, transform: [{ scale: 1.04 }] },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.moodEmoji}>{m.emoji}</Text>
                  <Text style={[styles.moodBtnLabel, isSelected && { color: m.color, fontWeight: '900' }]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Feedback Terapéutico */}
          <View style={[styles.feedbackBox, { backgroundColor: currentMood.bg, borderColor: currentMood.border }]}>
            <Text style={[styles.feedbackMsg, { color: currentMood.color }]}>
              "{currentMood.positiveMessage}"
            </Text>
            <View style={styles.activityRow}>
              <Zap color={currentMood.color} size={16} />
              <Text style={[styles.activityText, { color: currentMood.color }]}>
                {currentMood.physicalActivity}
              </Text>
            </View>
          </View>
        </View>

        {/* 2. LA GRATITUD DEL DÍA (UN SOLO MOTIVO PROFUNDO) */}
        <View style={styles.gratitudeCard}>
          <View style={styles.gratitudeHeaderRow}>
            <View style={styles.gratitudeIconBox}>
              <Heart color="#D97706" size={20} fill="#FDE68A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.gratitudeCardTitle}>Una sola cosa por la que doy gracias hoy</Text>
              <Text style={styles.gratitudeCardSub}>Enfoca tu mente en un detalle especial que ilumina tu presente</Text>
            </View>
          </View>

          <TextInput
            style={styles.gratitudeSpaciousInput}
            placeholder="Ej: Agradezco por la conversación de hoy, por mi respiración o por este momento de descanso..."
            placeholderTextColor="#94A3B8"
            value={gratitude}
            onChangeText={setGratitude}
            multiline={true}
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* 3. TU REFLEXIÓN PERSONAL (CANVAS ESPACIOSO) */}
        <View style={styles.reflectionCard}>
          <View style={styles.reflectionHeaderRow}>
            <View style={styles.reflectionIconBox}>
              <NotebookPen color="#059669" size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.reflectionCardTitle}>Tu Desahogo & Reflexión Libre</Text>
              <Text style={styles.reflectionCardSub}>Escribe tus pensamientos, sentires o aprendizajes sin juicios</Text>
            </View>
          </View>

          <TextInput
            style={styles.reflectionSpaciousTextArea}
            placeholder="¿Qué ha estado pasando por tu mente? ¿Qué sientes en el pecho o en el cuerpo? Este espacio es 100% privado y seguro..."
            placeholderTextColor="#94A3B8"
            value={reflectionText}
            onChangeText={setReflectionText}
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
          />

          {/* Etiquetas Temáticas */}
          <Text style={styles.tagsLabel}>Áreas de tu Vida:</Text>
          <View style={styles.tagsRow}>
            {TAGS_OPTIONS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  onPress={() => handleToggleTag(tag)}
                  style={[styles.tagChip, isSelected && styles.tagChipActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tagChipText, isSelected && styles.tagChipTextActive]}>
                    #{tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Botón Guardar Principal */}
          <TouchableOpacity
            onPress={handleSaveEntry}
            disabled={isSaving}
            style={styles.saveEntryBtn}
            activeOpacity={0.85}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Send color="#FFFFFF" size={18} />
                <Text style={styles.saveEntryBtnText}>Guardar en mi Diario</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* 4. HISTORIAL DE PÁGINAS GUARDADAS */}
        <View style={styles.historySection}>
          <View style={styles.historyHeaderRow}>
            <Text style={styles.historyTitle}>Tus Páginas Guardadas ({filteredEntries.length})</Text>
          </View>

          {/* Buscador */}
          <View style={styles.searchBar}>
            <Search color="#94A3B8" size={16} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar en tus recuerdos y reflexiones..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Listado de Entradas */}
          {filteredEntries.map((item) => (
            <View key={item.id} style={styles.entryCardItem}>
              {/* Header de la entrada */}
              <View style={styles.entryHeaderRow}>
                <View style={styles.entryMoodPill}>
                  <Text style={{ fontSize: 18 }}>{item.moodEmoji}</Text>
                  <Text style={[styles.entryMoodPillText, { color: item.moodColor }]}>
                    {item.moodLabel}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={styles.entryDate}>{item.createdAt}</Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteEntry(item.id)}
                    style={styles.deleteBtn}
                    activeOpacity={0.7}
                  >
                    <Trash2 color="#94A3B8" size={16} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Gratitud destacada */}
              {item.gratitude ? (
                <View style={styles.entryGratitudeHighlightBox}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Heart color="#D97706" size={13} fill="#D97706" />
                    <Text style={styles.entryGratitudeHighlightTitle}>Agradezco hoy:</Text>
                  </View>
                  <Text style={styles.entryGratitudeHighlightText}>"{item.gratitude}"</Text>
                </View>
              ) : null}

              {/* Reflexión libre */}
              {item.reflection ? (
                <Text style={styles.entryReflectionText}>"{item.reflection}"</Text>
              ) : null}

              {/* Tags */}
              {item.tags?.length > 0 && (
                <View style={styles.entryTagsRow}>
                  {item.tags.map((t, idx) => (
                    <Text key={idx} style={styles.entryTagSpan}>#{t}</Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

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
  headerBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.6,
  },
  headerMainTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  streakPill: {
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
  streakPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EA580C',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  quoteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EEF2FF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  quoteText: {
    flex: 1,
    fontSize: 13,
    fontStyle: 'italic',
    color: '#4338CA',
    lineHeight: 19,
    fontWeight: '600',
  },

  // CARD WRAPPER
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 2,
  },
  sectionHeaderSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
  },
  moodsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  moodButton: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    minWidth: 56,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodBtnLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  feedbackBox: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  feedbackMsg: {
    fontSize: 12.5,
    fontStyle: 'italic',
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 8,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activityText: {
    fontSize: 11.5,
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },

  // GRATITUDE CARD (ESPACIOSO)
  gratitudeCard: {
    backgroundColor: '#FFFDF5',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  gratitudeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  gratitudeIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gratitudeCardTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#92400E',
  },
  gratitudeCardSub: {
    fontSize: 11.5,
    color: '#B45309',
    marginTop: 1,
  },
  gratitudeSpaciousInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    lineHeight: 22,
    color: '#78350F',
    minHeight: 80,
  },

  // REFLECTION CARD (CANVAS ESPACIOSO)
  reflectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  reflectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  reflectionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  reflectionCardTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  reflectionCardSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  reflectionSpaciousTextArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    lineHeight: 22,
    color: '#1E293B',
    minHeight: 140,
    marginBottom: 14,
  },
  tagsLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  tagChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  tagChipActive: {
    backgroundColor: '#059669',
  },
  tagChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  tagChipTextActive: {
    color: '#FFFFFF',
  },
  saveEntryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 15,
    borderRadius: 18,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  saveEntryBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '900',
  },

  // HISTORIAL
  historySection: {
    marginTop: 4,
    gap: 12,
  },
  historyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },
  entryCardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  entryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryMoodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  entryMoodPillText: {
    fontSize: 14,
    fontWeight: '900',
  },
  entryDate: {
    fontSize: 11.5,
    color: '#94A3B8',
  },
  deleteBtn: {
    padding: 4,
  },
  entryGratitudeHighlightBox: {
    backgroundColor: '#FFFDF5',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  entryGratitudeHighlightTitle: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#92400E',
  },
  entryGratitudeHighlightText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#78350F',
    lineHeight: 19,
  },
  entryReflectionText: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 21,
  },
  entryTagsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  entryTagSpan: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
  },
});
