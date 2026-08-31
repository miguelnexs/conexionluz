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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Dumbbell,
  Wind,
  Brain,
  Zap,
  Moon,
  Heart,
  Award,
  Clock,
  ShieldCheck,
} from 'lucide-react-native';

export interface ExerciseData {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  duration: number; // in seconds
  color: string;
  benefits: string[];
  steps: { title: string; body: string; duration: number }[];
}

export const ALL_EXERCISES: Record<string, ExerciseData> = {
  'respiracion-4-7-8': {
    id: 'respiracion-4-7-8',
    title: 'Respiración 4-7-8',
    subtitle: 'Técnica de Relajación Profunda',
    category: 'Respiración',
    duration: 120,
    color: '#6366F1',
    benefits: ['Reduce ansiedad rápidamente', 'Mejora la calidad del sueño', 'Calma el sistema nervioso simpático'],
    steps: [
      { title: '1. Prepárate', body: 'Siéntate en una posición cómoda. Coloca la punta de tu lengua justo detrás de tus dientes superiores. Cierra los ojos y relaja tus hombros.', duration: 15 },
      { title: '2. Inhala por 4 segundos', body: 'Inhala silenciosamente por la nariz contando mentalmente hasta 4. Siente cómo tu pecho y abdomen se expanden suavemente.', duration: 4 },
      { title: '3. Retén por 7 segundos', body: 'Mantén el aire en tus pulmones contando hasta 7. No te tensiones — simplemente retén el oxígeno con serenidad.', duration: 7 },
      { title: '4. Exhala por 8 segundos', body: 'Exhala completamente por la boca emitiendo un suave sonido de alivio, contando hasta 8. Siente cómo sueltas la tensión.', duration: 8 },
      { title: '5. Repite el ciclo', body: 'Este es un ciclo completo. Repite este patrón 3 veces más. Notarás cómo tu mente y cuerpo se relajan con cada ciclo.', duration: 15 },
    ],
  },
  'mindfulness-5': {
    id: 'mindfulness-5',
    title: 'Mindfulness de 5 Sentidos',
    subtitle: 'Técnica de Anclaje al Presente (Grounding)',
    category: 'Mindfulness',
    duration: 180,
    color: '#10B981',
    benefits: ['Frena pensamientos intrusivos y rumiación', 'Mejora la concentración', 'Ancla al momento presente'],
    steps: [
      { title: '5 cosas que VES', body: 'Mira a tu alrededor y nombra mentalmente 5 cosas que puedes ver ahora mismo. Observa los detalles: colores, texturas y formas.', duration: 30 },
      { title: '4 cosas que TOCAS', body: 'Siente 4 cosas que puedes tocar en este momento. Puede ser tu ropa, la silla, el suelo bajo tus pies o un objeto cercano.', duration: 30 },
      { title: '3 cosas que OYES', body: 'Cierra los ojos un momento y distingue 3 sonidos a tu alrededor. El viento, el tráfico lejano, el murmullo o tu propia respiración.', duration: 30 },
      { title: '2 cosas que HUELES', body: 'Identifica 2 aromas en tu entorno. Si no los hay, recuerda vívidamente tu aroma favorito (café, lluvia, flores).', duration: 30 },
      { title: '1 cosa que SABOREAS', body: 'Toma conciencia de 1 sabor en tu boca. O simplemente sonríe suavemente observando cómo se relajan los músculos de tu rostro.', duration: 30 },
    ],
  },
  'pmr-progreso': {
    id: 'pmr-progreso',
    title: 'Relajación Muscular de Jacobson',
    subtitle: 'Tensión y Liberación Corporal Progresiva',
    category: 'Corporal',
    duration: 240,
    color: '#059669',
    benefits: ['Libera contracturas por estrés', 'Alivia dolor de cuello y hombros', 'Mejora la conexión mente-cuerpo'],
    steps: [
      { title: 'Pies y Pantorrillas', body: 'Tensa fuertemente los músculos de tus pies y pantorrillas durante 5 segundos. Luego suelta de golpe y siente el calor de la relajación por 15 segundos.', duration: 20 },
      { title: 'Muslos y Glúteos', body: 'Aprieta tus muslos y glúteos firmemente. Siente la tensión acumulada... 1, 2, 3, 4, 5. Suelta completamente y respira hondo.', duration: 20 },
      { title: 'Abdomen y Pecho', body: 'Tensa tu abdomen como si fueras a recibir un impacto. Mantén... y libera. Siente la libertad y espacio en cada exhalación.', duration: 20 },
      { title: 'Hombros y Cuello', body: 'Lleva tus hombros hacia arriba intentando tocar tus orejas. Tensa... y déjalos caer suavemente. Siente el peso liberado.', duration: 20 },
      { title: 'Rostro y Mandíbula', body: 'Aprieta suavemente tu mandíbula y arruga la frente. Mantén 5 segundos... y relaja totalmente la cara. Sonríe suavemente.', duration: 20 },
    ],
  },
  'visualizacion-lugar-seguro': {
    id: 'visualizacion-lugar-seguro',
    title: 'Visualización: Tu Lugar Seguro',
    subtitle: 'Viaje Guiado al Santuario Interior',
    category: 'Visualización',
    duration: 180,
    color: '#8B5CF6',
    benefits: ['Induce profunda paz interior', 'Estimula la calma y la seguridad', 'Herramienta de autorregulación'],
    steps: [
      { title: '1. Cierra los ojos', body: 'Toma tres respiraciones lentas y profundas. Deja que tus párpados se sientan pesados y cómodos.', duration: 20 },
      { title: '2. Imagina tu santuario', body: 'Visualiza un lugar donde te sientas 100% a salvo y en paz. Puede ser una playa al atardecer, un bosque sereno o una habitación acogedora.', duration: 40 },
      { title: '3. Siente los detalles', body: 'Observa la luz suave, escucha los sonidos tranquilizadores, siente la temperatura perfecta en tu piel. Este espacio es solo tuyo.', duration: 40 },
      { title: '4. Ancla la sensación', body: 'Siente esa paz llenando cada célula de tu cuerpo. Recuerda que puedes volver a este lugar mental siempre que lo necesites.', duration: 40 },
      { title: '5. Regresa despacio', body: 'Empieza a mover suavemente tus dedos. Toma una respiración profunda y abre los ojos cuando estés listo/a.', duration: 20 },
    ],
  },
  'compasion-emocional': {
    id: 'compasion-emocional',
    title: 'Autocompasión y Aceptación',
    subtitle: 'Abrazo Consciente a tus Emociones',
    category: 'Emocional',
    duration: 150,
    color: '#D97706',
    benefits: ['Reduce la autocrítica destructiva', 'Fomenta la paz mental y el autorrespeto', 'Sanación emocional integradora'],
    steps: [
      { title: '1. Mano en el pecho', body: 'Coloca una o ambas manos sobre tu corazón. Siente el calor de tu palma y el latido constante de tu vida.', duration: 20 },
      { title: '2. Reconoce el momento', body: 'Dite en voz baja o mentalmente: "Este es un momento de dificultad o malestar. Sentirse así es parte de ser humano".', duration: 30 },
      { title: '3. Frase de bondad', body: 'Repite suavemente: "Que yo pueda darme la compasión que necesito. Que pueda ser amable conmigo mismo/a hoy".', duration: 40 },
      { title: '4. Respiración de afecto', body: 'Inhala sintiendo que te cuidas a ti mismo/a; exhala soltando la exigencia y el juicio. Permítete descansar.', duration: 40 },
    ],
  },
};

export default function EjercicioDetalleScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const params = useLocalSearchParams();
  const exerciseId = (params.id as string) || 'mindfulness-5';

  const exercise = ALL_EXERCISES[exerciseId] || ALL_EXERCISES['mindfulness-5'];

  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [stepTimer, setStepTimer] = useState<number>(exercise.steps[0]?.duration || 30);
  const timerRef = useRef<any>(null);

  const currentStep = exercise.steps[currentStepIdx] || exercise.steps[0];

  useEffect(() => {
    setStepTimer(currentStep.duration || 30);
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [currentStepIdx]);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setStepTimer((prev) => {
        if (prev > 1) return prev - 1;

        // Auto avanzar paso
        setCompletedSteps((set) => new Set([...set, currentStepIdx]));
        if (currentStepIdx + 1 < exercise.steps.length) {
          setCurrentStepIdx((idx) => idx + 1);
        } else {
          setIsPlaying(false);
          Alert.alert('🎉 ¡Ejercicio Completado!', 'Has completado todos los pasos de este protocolo terapéutico (+15 Lumis).');
        }
        return 0;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentStepIdx, exercise.steps.length]);

  const toggleStepDone = (idx: number) => {
    const next = new Set(completedSteps);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setCompletedSteps(next);
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
          <Text style={[styles.categoryBadgeText, { color: exercise.color }]}>{exercise.category.toUpperCase()}</Text>
          <Text style={styles.headerMainTitle}>{exercise.title}</Text>
        </View>

        <View style={styles.timerBadge}>
          <Clock color="#64748B" size={13} />
          <Text style={styles.timerBadgeText}>{Math.round(exercise.duration / 60)} min</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* PLAYER INTERACTIVO DEL PASO ACTUAL */}
        <View style={[styles.activeStepCard, { borderColor: exercise.color }]}>
          <View style={styles.activeStepTopRow}>
            <View style={[styles.activeStepBadge, { backgroundColor: exercise.color }]}>
              <Text style={styles.activeStepBadgeText}>PASO {currentStepIdx + 1} DE {exercise.steps.length}</Text>
            </View>
            <Text style={[styles.timerCountdownText, { color: exercise.color }]}>{stepTimer}s</Text>
          </View>

          <Text style={styles.activeStepTitle}>{currentStep.title}</Text>
          <Text style={styles.activeStepBody}>{currentStep.body}</Text>

          {/* CONTROLES DE REPRODUCCIÓN */}
          <View style={styles.playerControlsRow}>
            <TouchableOpacity
              onPress={() => {
                setStepTimer(currentStep.duration || 30);
                setIsPlaying(false);
              }}
              style={styles.resetBtn}
              activeOpacity={0.7}
            >
              <RotateCcw color="#64748B" size={18} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsPlaying(!isPlaying)}
              style={[styles.playBtn, { backgroundColor: exercise.color }]}
              activeOpacity={0.85}
            >
              {isPlaying ? (
                <>
                  <Pause color="#FFFFFF" size={18} />
                  <Text style={styles.playBtnText}>Pausar</Text>
                </>
              ) : (
                <>
                  <Play color="#FFFFFF" size={18} fill="#FFFFFF" />
                  <Text style={styles.playBtnText}>Iniciar Guía</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setCompletedSteps(new Set([...completedSteps, currentStepIdx]));
                if (currentStepIdx + 1 < exercise.steps.length) {
                  setCurrentStepIdx(currentStepIdx + 1);
                } else {
                  Alert.alert('🎉 ¡Completado!', 'Has finalizado este ejercicio.');
                }
              }}
              style={styles.nextBtn}
              activeOpacity={0.7}
            >
              <CheckCircle2 color="#059669" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* LISTA COMPLETA DE PASOS */}
        <Text style={styles.sectionHeading}>Secuencia de la Práctica</Text>
        <View style={styles.stepsList}>
          {exercise.steps.map((st, idx) => {
            const isDone = completedSteps.has(idx);
            const isCurrent = currentStepIdx === idx;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  setCurrentStepIdx(idx);
                  toggleStepDone(idx);
                }}
                style={[
                  styles.stepItemCard,
                  isCurrent && { borderColor: exercise.color, borderWidth: 1.5 },
                  isDone && styles.stepItemCardDone,
                ]}
                activeOpacity={0.8}
              >
                <View style={[styles.stepNumberCircle, isDone && styles.stepNumberCircleDone]}>
                  {isDone ? (
                    <CheckCircle2 color="#FFFFFF" size={15} />
                  ) : (
                    <Text style={[styles.stepNumberText, isCurrent && { color: exercise.color }]}>{idx + 1}</Text>
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.stepItemTitle, isDone && styles.stepItemTitleDone]}>{st.title}</Text>
                  <Text style={styles.stepItemDesc} numberOfLines={2}>{st.body}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* BENEFICIOS CLÍNICOS */}
        <View style={styles.benefitsCard}>
          <View style={styles.benefitsHeaderRow}>
            <Award color="#4F46E5" size={18} />
            <Text style={styles.benefitsHeaderTitle}>Beneficios Terapéuticos</Text>
          </View>
          {exercise.benefits.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <CheckCircle2 color="#059669" size={14} style={{ marginTop: 2 }} />
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
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
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  headerMainTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  timerBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  activeStepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  activeStepTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeStepBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeStepBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  timerCountdownText: {
    fontSize: 20,
    fontWeight: '900',
  },
  activeStepTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
  },
  activeStepBody: {
    fontSize: 14,
    lineHeight: 22,
    color: '#334155',
    marginBottom: 18,
  },
  playerControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  resetBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    flex: 1,
    marginHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 16,
  },
  playBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  nextBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 6,
  },
  stepsList: {
    gap: 10,
  },
  stepItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  stepItemCardDone: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  stepNumberCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberCircleDone: {
    backgroundColor: '#059669',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#64748B',
  },
  stepItemTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  stepItemTitleDone: {
    color: '#065F46',
    textDecorationLine: 'line-through',
  },
  stepItemDesc: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  benefitsCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  benefitsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  benefitsHeaderTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#3730A3',
  },
  benefitRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  benefitText: {
    flex: 1,
    fontSize: 12.5,
    color: '#4338CA',
    lineHeight: 18,
  },
});
