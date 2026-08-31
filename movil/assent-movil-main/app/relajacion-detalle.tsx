import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Wind,
  Waves,
  Leaf,
  CloudRain,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
} from 'lucide-react-native';

export interface BreathingTech {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bg: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  cycles: number;
}

export const ALL_BREATHING: Record<string, BreathingTech> = {
  box: {
    id: 'box',
    title: 'Respiración Cuadrada',
    subtitle: 'Box Breathing (Navy SEALs)',
    description: 'Técnica usada para el control agudo del pánico y estrés. Equilibra el sistema nervioso y mejora el enfoque.',
    color: '#0EA5E9',
    bg: '#E0F2FE',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    cycles: 4,
  },
  '4-7-8': {
    id: '4-7-8',
    title: 'Respiración 4-7-8',
    subtitle: 'Técnica del Dr. Andrew Weil',
    description: 'Activa el sistema nervioso parasimpático. Ideal para reducir la ansiedad profunda y conciliar el sueño.',
    color: '#6366F1',
    bg: '#EEF2FF',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    cycles: 4,
  },
  coherente: {
    id: 'coherente',
    title: 'Respiración Coherente',
    subtitle: '5 respiraciones por minuto (5-5)',
    description: 'Sincroniza el corazón y el cerebro. Reduce la variabilidad del ritmo cardíaco y la tensión emocional.',
    color: '#10B981',
    bg: '#ECFDF5',
    inhale: 5,
    hold1: 0,
    exhale: 5,
    hold2: 0,
    cycles: 6,
  },
  calma: {
    id: 'calma',
    title: 'Respiración de Calma',
    subtitle: 'Exhalación Prolongada (4-8)',
    description: 'La exhalación larga estimula el nervio vago. Reduce el estrés y la hiperreactividad en menos de 2 minutos.',
    color: '#2563EB',
    bg: '#EFF6FF',
    inhale: 4,
    hold1: 0,
    exhale: 8,
    hold2: 0,
    cycles: 5,
  },
};

export default function RelajacionDetalleScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const params = useLocalSearchParams();
  const techId = (params.id as string) || 'box';

  const [selectedTech, setSelectedTech] = useState<BreathingTech>(ALL_BREATHING[techId] || ALL_BREATHING.box);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [timer, setTimer] = useState<number>(selectedTech.inhale);
  const [cycle, setCycle] = useState<number>(1);

  const scaleAnim = useRef(new Animated.Value(0.4)).current;
  const intervalRef = useRef<any>(null);

  // Animación del círculo
  useEffect(() => {
    if (!isRunning) {
      scaleAnim.setValue(0.4);
      return;
    }

    if (phase === 'inhale') {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: selectedTech.inhale * 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else if (phase === 'exhale') {
      Animated.timing(scaleAnim, {
        toValue: 0.4,
        duration: selectedTech.exhale * 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [phase, isRunning, selectedTech]);

  // Temporizador de fases
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev > 1) return prev - 1;

        if (phase === 'inhale') {
          if (selectedTech.hold1 > 0) {
            setPhase('hold1');
            return selectedTech.hold1;
          } else {
            setPhase('exhale');
            return selectedTech.exhale;
          }
        } else if (phase === 'hold1') {
          setPhase('exhale');
          return selectedTech.exhale;
        } else if (phase === 'exhale') {
          if (selectedTech.hold2 > 0) {
            setPhase('hold2');
            return selectedTech.hold2;
          } else {
            setCycle((c) => {
              if (c >= selectedTech.cycles) {
                setIsRunning(false);
                Alert.alert('✨ ¡Sesión de Calma Completada!', 'Has completado los ciclos de respiración consciente (+10 Lumis).');
                return 1;
              }
              return c + 1;
            });
            setPhase('inhale');
            return selectedTech.inhale;
          }
        } else if (phase === 'hold2') {
          setCycle((c) => {
            if (c >= selectedTech.cycles) {
              setIsRunning(false);
              Alert.alert('✨ ¡Sesión de Calma Completada!', 'Has completado los ciclos de respiración consciente.');
              return 1;
            }
            return c + 1;
          });
          setPhase('inhale');
          return selectedTech.inhale;
        }
        return 4;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, phase, selectedTech]);

  const handleSelectTech = (tech: BreathingTech) => {
    setSelectedTech(tech);
    setIsRunning(false);
    setPhase('inhale');
    setTimer(tech.inhale);
    setCycle(1);
  };

  const handleTogglePlay = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhase('inhale');
    setTimer(selectedTech.inhale);
    setCycle(1);
    scaleAnim.setValue(0.4);
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent={true} />

      {/* HEADER */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackBtn} activeOpacity={0.7}>
          <ChevronLeft color="#0F172A" size={24} />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.headerBadgeText, { color: selectedTech.color }]}>MINDFULNESS & RESPIRACIÓN</Text>
          <Text style={styles.headerMainTitle}>{selectedTech.title}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* VISUALIZADOR PRINCIPAL DE RESPIRACIÓN */}
        <View style={styles.visualizerCard}>
          <Text style={styles.techSubtitle}>{selectedTech.subtitle}</Text>

          {/* Círculo animado */}
          <View style={styles.circleContainer}>
            <Animated.View
              style={[
                styles.breathingCircle,
                {
                  transform: [{ scale: scaleAnim }],
                  backgroundColor:
                    phase === 'inhale'
                      ? '#38BDF8'
                      : phase === 'hold1' || phase === 'hold2'
                      ? '#818CF8'
                      : '#34D399',
                },
              ]}
            />
            <View style={styles.circleInnerContent}>
              <Text style={styles.phaseTitle}>
                {phase === 'inhale' && 'INHALA'}
                {phase === 'hold1' && 'SOSTÉN'}
                {phase === 'exhale' && 'EXHALA'}
                {phase === 'hold2' && 'PAUSA'}
              </Text>
              <Text style={styles.timerLarge}>{timer}s</Text>
              <Text style={styles.cycleBadgeText}>Ciclo {cycle} de {selectedTech.cycles}</Text>
            </View>
          </View>

          {/* Controles de reproducción */}
          <View style={styles.controlsRow}>
            <TouchableOpacity onPress={handleReset} style={styles.circleControlBtn} activeOpacity={0.7}>
              <RotateCcw color="#64748B" size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleTogglePlay}
              style={[styles.mainPlayBtn, { backgroundColor: selectedTech.color }]}
              activeOpacity={0.85}
            >
              {isRunning ? (
                <>
                  <Pause color="#FFFFFF" size={20} />
                  <Text style={styles.mainPlayBtnText}>Pausar</Text>
                </>
              ) : (
                <>
                  <Play color="#FFFFFF" size={20} fill="#FFFFFF" />
                  <Text style={styles.mainPlayBtnText}>Comenzar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* EXPLICACIÓN CLÍNICA */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>¿Por qué funciona esta técnica?</Text>
          <Text style={styles.infoDesc}>{selectedTech.description}</Text>
        </View>

        {/* SELECTOR DE OTRAS TÉCNICAS */}
        <Text style={styles.sectionHeading}>Otras Técnicas de Respiración</Text>
        <View style={styles.techsList}>
          {Object.values(ALL_BREATHING).map((t) => {
            const isSelected = selectedTech.id === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                onPress={() => handleSelectTech(t)}
                style={[styles.techItemCard, isSelected && { borderColor: t.color, borderWidth: 1.5 }]}
                activeOpacity={0.8}
              >
                <View style={[styles.techIconBox, { backgroundColor: t.bg }]}>
                  <Wind color={t.color} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.techItemTitle}>{t.title}</Text>
                  <Text style={styles.techItemSub}>{t.subtitle}</Text>
                </View>
                {isSelected && <CheckCircle2 color={t.color} size={20} />}
              </TouchableOpacity>
            );
          })}
        </View>

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
  headerBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  headerMainTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  visualizerCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#99F6E4',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  techSubtitle: {
    fontSize: 13,
    color: '#0F766E',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  circleContainer: {
    width: 230,
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  breathingCircle: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    opacity: 0.75,
  },
  circleInnerContent: {
    alignItems: 'center',
  },
  phaseTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 2,
  },
  timerLarge: {
    fontSize: 40,
    fontWeight: '900',
    color: '#0F172A',
    marginVertical: 2,
  },
  cycleBadgeText: {
    fontSize: 11.5,
    color: '#0D9488',
    fontWeight: '800',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 20,
    width: '100%',
  },
  circleControlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  mainPlayBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 16,
  },
  mainPlayBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  infoDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#475569',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  techsList: {
    gap: 10,
  },
  techItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  techIconBox: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  techItemTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  techItemSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
});
