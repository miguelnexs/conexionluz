import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ChevronLeft,
  TrendingUp,
  Award,
  Flame,
  Target,
  CheckCircle2,
  Lock,
  Sparkles,
  Heart,
  Brain,
  Wind,
  NotebookPen,
  ClipboardList,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  Smile,
  Star,
  Activity,
} from 'lucide-react-native';
import { mobileApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { LumiWalletModal } from '../components/LumiWalletModal';

const GOAL_OPTIONS = [
  'Reducción de Estrés y Ansiedad',
  'Mejora del Sueño y Descanso',
  'Hipnosis y Reprogramación Mental',
  'Equilibrio Emocional y Autoestima',
  'Crecimiento Espiritual y Claridad',
];

interface Badge {
  id: string;
  icon: string;
  title: string;
  desc: string;
  unlocked: boolean;
  condition: string;
}

export default function ProgresoScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const { user } = useAuth();

  const [diaryCount, setDiaryCount] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<number>(3);
  const [exercisesCount, setExercisesCount] = useState<number>(2);
  const [testsCount, setTestsCount] = useState<number>(1);
  const [selectedGoal, setSelectedGoal] = useState<string>(GOAL_OPTIONS[0]);
  const [lumisBalance, setLumisBalance] = useState<number>(150);
  const [showLumiWalletModal, setShowLumiWalletModal] = useState<boolean>(false);

  useEffect(() => {
    loadRealProgressData();
  }, []);

  const loadRealProgressData = async () => {
    try {
      // 1. Cargar entradas de diario
      const storedDiary = await AsyncStorage.getItem('conexionluz:diario-emocional-entries');
      if (storedDiary) {
        const parsed = JSON.parse(storedDiary);
        if (Array.isArray(parsed)) {
          setDiaryCount(parsed.length);
        }
      } else {
        setDiaryCount(1);
      }

      // 2. Cargar meta elegida
      const storedGoal = await AsyncStorage.getItem('conexionluz:user-goal');
      if (storedGoal) {
        setSelectedGoal(storedGoal);
      }

      // 3. Cargar racha y Lumis
      const storedLumis = await AsyncStorage.getItem('conexionluz:lumis-balance');
      if (storedLumis) {
        setLumisBalance(Number(storedLumis) || 150);
      }
    } catch {}
  };

  const handleSelectGoal = async (goal: string) => {
    setSelectedGoal(goal);
    try {
      await AsyncStorage.setItem('conexionluz:user-goal', goal);
    } catch {}
    Alert.alert('🎯 Meta Actualizada', `Tu enfoque principal ahora es: "${goal}".`);
  };

  // Cálculo de nivel y porcentaje global
  const totalScore = Math.min(100, Math.round(diaryCount * 12 + exercisesCount * 15 + testsCount * 20 + streakDays * 5));

  const getLevelInfo = (score: number) => {
    if (score >= 90) {
      return {
        title: '💎 Maestro del Bienestar',
        subtitle: 'Transformación plena y dominio de hábitos conscientes',
        color: '#D97706',
        bg: '#FEF3C7',
        border: '#FDE68A',
      };
    }
    if (score >= 70) {
      return {
        title: '🌟 Guardián de Paz Interior',
        subtitle: 'Conexión elevada y práctica sostenida de autocuidado',
        color: '#6366F1',
        bg: '#EEF2FF',
        border: '#C7D2FE',
      };
    }
    if (score >= 45) {
      return {
        title: '🌸 Mente en Equilibrio',
        subtitle: 'Constancia activa y autorregulación emocional efectiva',
        color: '#059669',
        bg: '#ECFDF5',
        border: '#A7F3D0',
      };
    }
    if (score >= 20) {
      return {
        title: '🌿 Buscador de Calma',
        subtitle: 'Desarrollando hábitos y sembrando bienestar diario',
        color: '#0EA5E9',
        bg: '#E0F2FE',
        border: '#BAE6FD',
      };
    }
    return {
      title: '🌱 Semilla de Luz',
      subtitle: 'Iniciando el camino hacia tu bienestar integral',
      color: '#475569',
      bg: '#F1F5F9',
      border: '#E2E8F0',
    };
  };

  const level = getLevelInfo(totalScore);

  const badges: Badge[] = [
    {
      id: 'primera-entrada',
      icon: '📓',
      title: 'Primera Entrada',
      desc: 'Escribiste tu primera página en el diario',
      unlocked: diaryCount >= 1,
      condition: '1 página en diario',
    },
    {
      id: 'semana-constante',
      icon: '🔥',
      title: 'Semana Constante',
      desc: 'Racha de 7 días consecutivos de autocuidado',
      unlocked: streakDays >= 7,
      condition: '7 días de racha',
    },
    {
      id: 'primer-ejercicio',
      icon: '🧘',
      title: 'Primer Ejercicio',
      desc: 'Completaste una práctica o respiración guiada',
      unlocked: exercisesCount >= 1,
      condition: '1 ejercicio completado',
    },
    {
      id: 'primer-test',
      icon: '📋',
      title: 'Evaluación Inicial',
      desc: 'Completaste un test de bienestar clínico',
      unlocked: testsCount >= 1,
      condition: '1 test clínico realizado',
    },
    {
      id: 'autoconocimiento',
      icon: '🔬',
      title: 'Autoconocimiento',
      desc: 'Realizaste 3 tests de bienestar',
      unlocked: testsCount >= 3,
      condition: '3 tests realizados',
    },
    {
      id: 'practicante',
      icon: '⚡',
      title: 'Practicante Frecuente',
      desc: 'Completaste 5 ejercicios guiados',
      unlocked: exercisesCount >= 5,
      condition: '5 ejercicios guiados',
    },
    {
      id: 'mente-reflexiva',
      icon: '🌱',
      title: 'Mente Reflexiva',
      desc: 'Registraste 5 o más reflexiones en el diario',
      unlocked: diaryCount >= 5,
      condition: '5 entradas en diario',
    },
    {
      id: 'hito-50',
      icon: '💎',
      title: 'Paso Firme',
      desc: 'Alcanzaste el 50% de evolución consciente',
      unlocked: totalScore >= 50,
      condition: '50% nivel global',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent={true} />

      {/* HEADER */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackBtn} activeOpacity={0.7}>
          <ChevronLeft color="#0F172A" size={24} />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={styles.headerBadgeRow}>
            <Sparkles color="#6366F1" size={13} />
            <Text style={styles.headerBadgeText}>EVOLUCIÓN & AUTOCUIDADO</Text>
          </View>
          <Text style={styles.headerMainTitle}>Mi Progreso Consciente</Text>
        </View>

        <View style={styles.streakBadge}>
          <Flame color="#EA580C" size={15} fill="#EA580C" />
          <Text style={styles.streakBadgeText}>{streakDays} Días</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. TARJETA DE NIVEL GLOBAL */}
        <View style={[styles.levelCard, { borderColor: level.border }]}>
          <View style={styles.levelTopRow}>
            <View style={[styles.levelPill, { backgroundColor: level.bg, borderColor: level.border }]}>
              <Text style={[styles.levelPillText, { color: level.color }]}>{level.title}</Text>
            </View>
            <Text style={[styles.levelPercentText, { color: level.color }]}>{totalScore}%</Text>
          </View>

          <Text style={styles.levelSubtitle}>{level.subtitle}</Text>

          {/* Barra de progreso */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${totalScore}%`, backgroundColor: level.color }]} />
          </View>

          <View style={styles.levelMetaRow}>
            <Text style={styles.levelMetaLabel}>Nivel de Conciencia y Práctica</Text>
            <Text style={styles.levelMetaGoal}>Meta: 100% Maestro</Text>
          </View>
        </View>

        {/* 2. MÉTRICAS CLAVE EN CUADRÍCULA */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#FFF7ED' }]}>
              <Flame color="#EA580C" size={20} fill="#EA580C" />
            </View>
            <Text style={styles.statNumber}>{streakDays} Días</Text>
            <Text style={styles.statLabel}>Racha Activa</Text>
          </View>

          <TouchableOpacity
            style={[styles.statCard, { borderColor: '#FDE68A', borderWidth: 1.5, backgroundColor: '#FFFBEB' }]}
            onPress={() => router.push('/comprar-lumis' as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.statIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Sparkles color="#D97706" size={20} />
            </View>
            <Text style={[styles.statNumber, { color: '#B45309' }]}>{lumisBalance}</Text>
            <Text style={[styles.statLabel, { color: '#D97706', fontWeight: '800' }]}>✨ Recargar</Text>
          </TouchableOpacity>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#ECFDF5' }]}>
              <NotebookPen color="#059669" size={20} />
            </View>
            <Text style={styles.statNumber}>{diaryCount}</Text>
            <Text style={styles.statLabel}>Páginas Diario</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#EEF2FF' }]}>
              <ClipboardList color="#4F46E5" size={20} />
            </View>
            <Text style={styles.statNumber}>{testsCount}</Text>
            <Text style={styles.statLabel}>Tests Clínicos</Text>
          </View>
        </View>

        {/* 3. TU OBJETIVO PRINCIPAL */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeaderRow}>
            <Target color="#059669" size={20} />
            <View style={{ flex: 1 }}>
              <Text style={styles.goalTitle}>Tu Enfoque Terapéutico Principal</Text>
              <Text style={styles.goalSub}>Personaliza tu camino según tu prioridad actual</Text>
            </View>
          </View>

          <View style={styles.goalsList}>
            {GOAL_OPTIONS.map((g) => {
              const isSelected = selectedGoal === g;
              return (
                <TouchableOpacity
                  key={g}
                  onPress={() => handleSelectGoal(g)}
                  style={[styles.goalItemBtn, isSelected && styles.goalItemBtnSelected]}
                  activeOpacity={0.8}
                >
                  <View style={[styles.goalRadioCircle, isSelected && styles.goalRadioCircleSelected]}>
                    {isSelected && <View style={styles.goalRadioInner} />}
                  </View>
                  <Text style={[styles.goalItemText, isSelected && styles.goalItemTextSelected]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 4. MEDALLAS Y LOGROS CONSCIENTES */}
        <View style={styles.badgesSection}>
          <View style={styles.badgesHeaderRow}>
            <Award color="#D97706" size={20} />
            <Text style={styles.badgesSectionTitle}>Insignias & Logros Desbloqueados</Text>
          </View>

          <View style={styles.badgesGrid}>
            {badges.map((b) => (
              <View
                key={b.id}
                style={[
                  styles.badgeCard,
                  b.unlocked ? styles.badgeCardUnlocked : styles.badgeCardLocked,
                ]}
              >
                <View style={styles.badgeTopRow}>
                  <Text style={styles.badgeEmoji}>{b.icon}</Text>
                  {b.unlocked ? (
                    <CheckCircle2 color="#059669" size={16} />
                  ) : (
                    <Lock color="#94A3B8" size={14} />
                  )}
                </View>

                <Text style={[styles.badgeTitle, !b.unlocked && { color: '#64748B' }]}>{b.title}</Text>
                <Text style={styles.badgeDesc}>{b.desc}</Text>

                <View style={styles.badgeConditionPill}>
                  <Text style={styles.badgeConditionText}>{b.condition}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 5. CTA ACTIVIDADES RECOMENDADAS */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/actividades' as any)}
          style={styles.continueActivitiesBtn}
          activeOpacity={0.88}
        >
          <Zap color="#FFFFFF" size={18} />
          <Text style={styles.continueActivitiesBtnText}>Explorar Actividades Diarias</Text>
          <ArrowRight color="#FFFFFF" size={18} />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
    color: '#6366F1',
    letterSpacing: 0.6,
  },
  headerMainTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
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
  streakBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#EA580C',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },

  // LEVEL CARD
  levelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  levelTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  levelPillText: {
    fontSize: 13,
    fontWeight: '900',
  },
  levelPercentText: {
    fontSize: 24,
    fontWeight: '900',
  },
  levelSubtitle: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 14,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  levelMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelMetaLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  levelMetaGoal: {
    fontSize: 11,
    color: '#0F172A',
    fontWeight: '800',
  },

  // STATS GRID
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },

  // GOAL CARD
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  goalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  goalTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  goalSub: {
    fontSize: 11.5,
    color: '#64748B',
  },
  goalsList: {
    gap: 8,
  },
  goalItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  goalItemBtnSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  goalRadioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalRadioCircleSelected: {
    borderColor: '#059669',
  },
  goalRadioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
  },
  goalItemText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
  },
  goalItemTextSelected: {
    color: '#065F46',
    fontWeight: '800',
  },

  // BADGES SECTION
  badgesSection: {
    gap: 12,
  },
  badgesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgesSectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeCard: {
    width: '48%',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
  },
  badgeCardUnlocked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FDE68A',
  },
  badgeCardLocked: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.75,
  },
  badgeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeEmoji: {
    fontSize: 22,
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  badgeDesc: {
    fontSize: 10.5,
    color: '#64748B',
    lineHeight: 14,
    marginBottom: 8,
  },
  badgeConditionPill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeConditionText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#475569',
  },

  // CTA
  continueActivitiesBtn: {
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
  continueActivitiesBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '900',
  },
});
