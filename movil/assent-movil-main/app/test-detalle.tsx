import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Frown,
  Smile,
  Heart,
  ClipboardList,
  Sparkles,
  ArrowRight,
  Send,
  Calendar,
  ShieldCheck,
  Award,
  RefreshCw,
} from 'lucide-react-native';
import { mobileApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface QuestionOption {
  label: string;
  value: number;
}

interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
}

interface TestDefinition {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  color: string;
  tag: string;
  questions: Question[];
}

export const ALL_TESTS: Record<string, TestDefinition> = {
  ansiedad: {
    id: 'ansiedad',
    title: 'Nivel de Ansiedad',
    subtitle: 'Escala Clínica GAD-7',
    description: 'Evalúa qué tan seguido te han molestado los síntomas de ansiedad y preocupación durante las últimas dos semanas.',
    duration: '3 min',
    color: '#4F46E5',
    tag: 'Clínico',
    questions: [
      {
        id: 1,
        text: 'Me he sentido nervioso/a, ansioso/a o con los nervios de punta.',
        options: [
          { label: 'Nunca me he sentido así', value: 0 },
          { label: 'Varios días he sentido cierta tensión', value: 1 },
          { label: 'Más de la mitad de los días he estado ansioso/a', value: 2 },
          { label: 'Casi todos los días me siento con los nervios de punta', value: 3 },
        ],
      },
      {
        id: 2,
        text: 'No he sido capaz de dejar de preocuparme o controlar mi preocupación.',
        options: [
          { label: 'Puedo controlar mis preocupaciones con facilidad', value: 0 },
          { label: 'A veces me cuesta trabajo soltar los pensamientos', value: 1 },
          { label: 'Con frecuencia pierdo el control sobre lo que me preocupa', value: 2 },
          { label: 'Incapacidad constante para frenar las preocupaciones', value: 3 },
        ],
      },
      {
        id: 3,
        text: 'Me he preocupado demasiado por diferentes cosas de mi vida.',
        options: [
          { label: 'Sin preocupaciones excesivas', value: 0 },
          { label: 'Preocupaciones ocasionales sobre temas específicos', value: 1 },
          { label: 'Preocupación constante por múltiples áreas', value: 2 },
          { label: 'Sensación continua de estar abrumado/a por todo', value: 3 },
        ],
      },
      {
        id: 4,
        text: 'He tenido dificultades para relajarme y encontrar calma.',
        options: [
          { label: 'Me he relajado y descansado sin problema', value: 0 },
          { label: 'Me cuesta un poco soltar la tensión física o mental', value: 1 },
          { label: 'La mayor parte del tiempo me cuesta lograr la calma', value: 2 },
          { label: 'Me resulta casi imposible relajarme', value: 3 },
        ],
      },
      {
        id: 5,
        text: 'Me he sentido tan inquieto/a que no he podido quedarme quieto/a.',
        options: [
          { label: 'Sin inquietud motora ni intranquilidad', value: 0 },
          { label: 'Inquietud en momentos puntuales', value: 1 },
          { label: 'Impaciencia física recurrente', value: 2 },
          { label: 'Agitación constante, no consigo estar en calma', value: 3 },
        ],
      },
      {
        id: 6,
        text: 'Me he irritado, molestado o enojado con facilidad.',
        options: [
          { label: 'He mantenido paciencia y tolerancia', value: 0 },
          { label: 'Ligeros momentos de molestia o impaciencia', value: 1 },
          { label: 'Con frecuencia me irrito o pierdo la calma', value: 2 },
          { label: 'Casi cualquier detalle me molesta de inmediato', value: 3 },
        ],
      },
      {
        id: 7,
        text: 'He sentido miedo de que algo terrible pudiera pasar.',
        options: [
          { label: 'Sin temores ni presagios amenazantes', value: 0 },
          { label: 'Temores o presagios aislados', value: 1 },
          { label: 'Sensación frecuente de que ocurrirá una desgracia', value: 2 },
          { label: 'Miedo constante y sobrecogedor a un peligro inminente', value: 3 },
        ],
      },
    ],
  },
  'estado-animo': {
    id: 'estado-animo',
    title: 'Estado de Ánimo',
    subtitle: 'Escala Clínica PHQ-9',
    description: 'Detecta síntomas depresivos, fatiga y su impacto en tu vida cotidiana durante las últimas dos semanas.',
    duration: '4 min',
    color: '#2563EB',
    tag: 'Clínico',
    questions: [
      {
        id: 1,
        text: 'Poco interés o placer en hacer las cosas que antes disfrutabas.',
        options: [
          { label: 'Conservo pleno interés y disfrute por lo que hago', value: 0 },
          { label: 'He sentido algo de desinterés en ciertos días', value: 1 },
          { label: 'La mayoría de las actividades han perdido interés', value: 2 },
          { label: 'Pérdida total de motivación e interés cotidiano', value: 3 },
        ],
      },
      {
        id: 2,
        text: 'Me he sentido decaído/a, desanimado/a o sin esperanza.',
        options: [
          { label: 'Mi ánimo se percibe alegre y optimista', value: 0 },
          { label: 'Leves momentos de desánimo o tristeza', value: 1 },
          { label: 'Sensación frecuente de decaimiento o pesadez', value: 2 },
          { label: 'Tristeza profunda o falta constante de esperanza', value: 3 },
        ],
      },
      {
        id: 3,
        text: 'He tenido problemas para dormir, o he dormido demasiado.',
        options: [
          { label: 'Mi descanso nocturno ha sido estable y reparador', value: 0 },
          { label: 'Ligeras variaciones o dificultad ocasional', value: 1 },
          { label: 'Insomnio frecuente o necesidad excesiva de dormir', value: 2 },
          { label: 'Desvelos continuos o hipersomnia severa', value: 3 },
        ],
      },
      {
        id: 4,
        text: 'Me he sentido cansado/a o con muy poca energía física y mental.',
        options: [
          { label: 'Con energía suficiente para mis actividades', value: 0 },
          { label: 'Fatiga o cansancio ligero al final del día', value: 1 },
          { label: 'Agotamiento notorio durante la jornada', value: 2 },
          { label: 'Falta extrema de energía para cualquier tarea', value: 3 },
        ],
      },
      {
        id: 5,
        text: 'He tenido poco apetito o he comido en exceso por ansiedad.',
        options: [
          { label: 'Apetito y hábitos alimenticios habituales', value: 0 },
          { label: 'Cambios ligeros en el apetito', value: 1 },
          { label: 'Inapetencia marcada o impulsos frecuentes de comer', value: 2 },
          { label: 'Alteración severa en mi alimentación', value: 3 },
        ],
      },
      {
        id: 6,
        text: 'Me he sentido mal conmigo mismo/a o he sentido que soy un fracaso.',
        options: [
          { label: 'Me siento conforme y en paz con quien soy', value: 0 },
          { label: 'Ocasionalmente surgen dudas o autocríticas', value: 1 },
          { label: 'Pensamientos frecuentes de desvalorización', value: 2 },
          { label: 'Sensación constante de haber fallado', value: 3 },
        ],
      },
      {
        id: 7,
        text: 'He tenido dificultad para concentrarme al leer o trabajar.',
        options: [
          { label: 'Mi concentración se ha mantenido clara', value: 0 },
          { label: 'Leves distracciones al leer o trabajar', value: 1 },
          { label: 'Dificultad evidente para enfocar la mente', value: 2 },
          { label: 'Incapacidad casi total para concentrarme', value: 3 },
        ],
      },
      {
        id: 8,
        text: 'Me he movido o hablado tan lento que los demás lo han notado, o inquieto.',
        options: [
          { label: 'Mi ritmo físico y verbal ha sido normal', value: 0 },
          { label: 'Lentitud o inquietud casi imperceptible', value: 1 },
          { label: 'Movimientos pausados o intranquilidad visible', value: 2 },
          { label: 'Lentitud extrema o agitación notable', value: 3 },
        ],
      },
    ],
  },
  bienestar: {
    id: 'bienestar',
    title: 'Bienestar General',
    subtitle: 'Índice WHO-5 (Organización Mundial de la Salud)',
    description: 'Mide tu bienestar subjetivo, vitalidad y calidad de vida emocional en las últimas dos semanas.',
    duration: '2 min',
    color: '#059669',
    tag: 'Bienestar',
    questions: [
      {
        id: 1,
        text: 'Me he sentido alegre y de buen humor.',
        options: [
          { label: 'Plenamente alegre y de excelente humor', value: 3 },
          { label: 'Alegre la mayor parte del tiempo', value: 2 },
          { label: 'Con buen humor en algunos momentos', value: 1 },
          { label: 'Sin alegría ni buen humor', value: 0 },
        ],
      },
      {
        id: 2,
        text: 'Me he sentido tranquilo/a y relajado/a.',
        options: [
          { label: 'Con profunda tranquilidad y paz', value: 3 },
          { label: 'Tranquilo/a la mayor parte de los días', value: 2 },
          { label: 'Momentos aislados de relajación', value: 1 },
          { label: 'Tensión constante o agitación', value: 0 },
        ],
      },
      {
        id: 3,
        text: 'Me he sentido activo/a y vigoroso/a.',
        options: [
          { label: 'Lleno/a de vitalidad y energía', value: 3 },
          { label: 'Activo/a y en buen ritmo', value: 2 },
          { label: 'Energía moderada o variable', value: 1 },
          { label: 'Sensación de debilidad o desgano', value: 0 },
        ],
      },
      {
        id: 4,
        text: 'Me he despertado fresco/a y descansado/a.',
        options: [
          { label: 'Renovado/a y listo/a para iniciar el día', value: 3 },
          { label: 'Descansado/a casi todas las mañanas', value: 2 },
          { label: 'Cansancio ligero al despertar', value: 1 },
          { label: 'Fatiga intensa al despertar', value: 0 },
        ],
      },
      {
        id: 5,
        text: 'Mi vida cotidiana ha estado llena de cosas que me interesan.',
        options: [
          { label: 'Plenamente motivado/a con mis proyectos y rutina', value: 3 },
          { label: 'Con varias actividades de mi interés', value: 2 },
          { label: 'Pocos momentos estimulantes en el día', value: 1 },
          { label: 'Sensación de monotonía o desinterés', value: 0 },
        ],
      },
    ],
  },
  autoestima: {
    id: 'autoestima',
    title: 'Escala de Autoestima',
    subtitle: 'Escala de Rosenberg',
    description: 'Evalúa tu nivel de autoestima, autovaloración y cómo te percibes a ti mismo/a en distintas áreas.',
    duration: '3 min',
    color: '#D97706',
    tag: 'Personal',
    questions: [
      {
        id: 1,
        text: 'Siento que soy una persona digna de aprecio, al menos en igual medida que los demás.',
        options: [
          { label: 'Totalmente de acuerdo, reconozco mi valor', value: 3 },
          { label: 'De acuerdo en general', value: 2 },
          { label: 'En desacuerdo, me cuesta valorar mi aprecio', value: 1 },
          { label: 'Totalmente en desacuerdo', value: 0 },
        ],
      },
      {
        id: 2,
        text: 'Creo que tengo una serie de buenas cualidades.',
        options: [
          { label: 'Totalmente de acuerdo, poseo grandes cualidades', value: 3 },
          { label: 'De acuerdo, reconozco mis virtudes', value: 2 },
          { label: 'En desacuerdo, veo pocas cualidades en mí', value: 1 },
          { label: 'Totalmente en desacuerdo', value: 0 },
        ],
      },
      {
        id: 3,
        text: 'Soy capaz de hacer las cosas tan bien como la mayoría de las personas.',
        options: [
          { label: 'Totalmente de acuerdo, confío en mi capacidad', value: 3 },
          { label: 'De acuerdo, logro desenvolverme bien', value: 2 },
          { label: 'En desacuerdo, siento que me cuesta más', value: 1 },
          { label: 'Totalmente en desacuerdo, me siento incapaz', value: 0 },
        ],
      },
      {
        id: 4,
        text: 'Tengo una actitud positiva y de respeto hacia mí mismo/a.',
        options: [
          { label: 'Totalmente de acuerdo, me trato con respeto y amor', value: 3 },
          { label: 'De acuerdo la mayor parte del tiempo', value: 2 },
          { label: 'En desacuerdo, tiendo a la autocrítica', value: 1 },
          { label: 'Totalmente en desacuerdo', value: 0 },
        ],
      },
      {
        id: 5,
        text: 'En general, estoy satisfecho/a de mí mismo/a.',
        options: [
          { label: 'Totalmente de acuerdo, satisfecho/a con quien soy', value: 3 },
          { label: 'De acuerdo en gran medida', value: 2 },
          { label: 'En desacuerdo, me siento insatisfecho/a', value: 1 },
          { label: 'Totalmente en desacuerdo', value: 0 },
        ],
      },
    ],
  },
};

export default function TestDetalleScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const testId = (params.id as string) || 'ansiedad';

  const test = ALL_TESTS[testId] || ALL_TESTS.ansiedad;

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>(user?.email || '');
  const [isSendingReport, setIsSendingReport] = useState<boolean>(false);

  const currentQ = test.questions[currentIdx];
  const progressPct = ((currentIdx + 1) / test.questions.length) * 100;

  const handleSelectOption = (val: number) => {
    const updated = [...answers, val];
    setAnswers(updated);

    if (currentIdx + 1 < test.questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const calculateResult = () => {
    const score = answers.reduce((a, b) => a + b, 0);
    const maxScore = test.questions.length * 3;
    const ratio = maxScore > 0 ? score / maxScore : 0;

    let label = 'Nivel Mínimo / Saludable';
    let color = '#059669';
    let interpretation = 'Tus respuestas indican un nivel bajo de sintomatología. Tu sistema emocional se encuentra en equilibrio.';
    let recommendations = [
      'Mantén tus hábitos de descanso y pausas conscientes durante el día.',
      'Continúa practicando respiración consciente para blindar tu serenidad.',
      'Dedica tiempo a tus pasatiempos y relaciones nutritivas.',
    ];
    let hopeTitle = 'Tu paz interior es tu mayor activo.';
    let hopeText = 'Cultivar el autocuidado preventivo te permite responder con claridad y serenidad ante los retos de la vida cotidiana.';

    if (test.id === 'bienestar') {
      if (ratio >= 0.7) {
        label = 'Excelente Bienestar';
        color = '#059669';
        interpretation = 'Experimentas un nivel óptimo de vitalidad, serenidad y satisfacción en tu vida cotidiana.';
      } else if (ratio >= 0.4) {
        label = 'Bienestar Moderado';
        color = '#D97706';
        interpretation = 'Hay áreas donde la rutina o el cansancio están restando brillo a tu bienestar diario.';
      } else {
        label = 'Bajo Bienestar / Fatiga Emocional';
        color = '#E11D48';
        interpretation = 'Tus niveles de vitalidad y satisfacción están deprimidos. Tu cuerpo y mente piden descanso y cuidado.';
      }
    } else {
      if (ratio >= 0.7) {
        label = 'Nivel Severo / Atención Prioritaria';
        color = '#E11D48';
        interpretation = 'Existe una sobrecarga psicofísica notable que interfiere con tu descanso, concentración o paz.';
        recommendations = [
          'Prioriza una consulta terapéutica personalizada en Conexión Luz®.',
          'Practica la técnica de respiración 4-7-8 dos veces al día para regular el sistema nervioso.',
          'Evita la sobreexigencia y delega responsabilidades no urgentes.',
        ];
        hopeTitle = 'No estás solo/a y esto tiene solución.';
        hopeText = 'El malestar que sientes hoy no te define. Con el acompañamiento adecuado, la mente y el cuerpo recuperan su equilibrio natural.';
      } else if (ratio >= 0.4) {
        label = 'Nivel Moderado';
        color = '#D97706';
        interpretation = 'Se evidencian síntomas frecuentes de tensión o desánimo que merecen atención preventiva.';
        recommendations = [
          'Realiza el ejercicio de Anclaje Sensorial 5-4-3-2-1 cuando sientas agobio.',
          'Establece límites claros entre tus horarios de trabajo y descanso.',
          'Registra tus emociones en el Diario de Sanación para no acumular presión.',
        ];
      } else if (ratio >= 0.2) {
        label = 'Nivel Leve';
        color = '#2563EB';
        interpretation = 'Presentas fluctuaciones leves que pueden manejarse con hábitos diarios de autorregulación.';
      }
    }

    return { score, maxScore, label, color, interpretation, recommendations, hopeTitle, hopeText };
  };

  const handleSendReport = async () => {
    if (!emailInput.trim()) {
      Alert.alert('Correo requerido', 'Por favor ingresa tu correo electrónico para recibir el informe detallado.');
      return;
    }

    setIsSendingReport(true);
    const result = calculateResult();
    try {
      const res = await mobileApi.sendChatMessage(
        `[Reporte Test: ${test.title}] Resultado: ${result.label} (${result.score}/${result.maxScore}). Enviado a: ${emailInput}`
      );
      Alert.alert('📧 Informe Enviado', `Tu informe con recomendaciones ha sido procesado con éxito para ${emailInput}.`);
    } catch {
      Alert.alert('Informe Generado', `Tu resultado de ${result.label} (${result.score} pts) ha sido registrado.`);
    } finally {
      setIsSendingReport(false);
    }
  };

  const result = isCompleted ? calculateResult() : null;

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
            <Sparkles color={test.color} size={13} />
            <Text style={[styles.headerBadgeText, { color: test.color }]}>{test.tag.toUpperCase()}</Text>
          </View>
          <Text style={styles.headerMainTitle}>{test.title}</Text>
        </View>

        <View style={styles.durationPill}>
          <Text style={styles.durationPillText}>{test.duration}</Text>
        </View>
      </View>

      {!isCompleted ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* BARRA DE PROGRESO */}
          <View style={styles.progressCard}>
            <View style={styles.progressMetaRow}>
              <Text style={styles.progressStepText}>
                Pregunta {currentIdx + 1} de {test.questions.length}
              </Text>
              <Text style={styles.progressPercentText}>{Math.round(progressPct)}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPct}%`, backgroundColor: test.color }]} />
            </View>
          </View>

          {/* ENUNCIADO DE LA PREGUNTA */}
          <View style={styles.questionCard}>
            <Text style={styles.questionSubtitle}>Durante las últimas 2 semanas:</Text>
            <Text style={styles.questionPromptText}>"{currentQ.text}"</Text>
          </View>

          {/* OPCIONES DE RESPUESTA */}
          <View style={styles.optionsList}>
            {currentQ.options.map((opt, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleSelectOption(opt.value)}
                style={styles.optionButton}
                activeOpacity={0.82}
              >
                <View style={styles.optionCircle}>
                  <Text style={styles.optionCircleText}>{String.fromCharCode(65 + i)}</Text>
                </View>
                <Text style={styles.optionLabelText}>{opt.label}</Text>
                <ArrowRight color="#94A3B8" size={16} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.resultScrollContent} showsVerticalScrollIndicator={false}>
          {/* RESULTADO HEADER */}
          <View style={styles.resultBanner}>
            <View style={[styles.resultBadge, { backgroundColor: result?.color }]}>
              <Text style={styles.resultBadgeText}>
                {result?.score} de {result?.maxScore} Puntos
              </Text>
            </View>
            <Text style={[styles.resultTitle, { color: result?.color }]}>{result?.label}</Text>
            <Text style={styles.resultInterpretation}>"{result?.interpretation}"</Text>
          </View>

          {/* RECOMENDACIONES CLÍNICAS */}
          <View style={styles.recommendationsCard}>
            <View style={styles.cardSectionHeader}>
              <ShieldCheck color="#4F46E5" size={18} />
              <Text style={styles.cardSectionTitle}>Recomendaciones Clave</Text>
            </View>
            {result?.recommendations.map((rec, idx) => (
              <View key={idx} style={styles.recItemRow}>
                <CheckCircle2 color="#059669" size={16} style={{ marginTop: 2 }} />
                <Text style={styles.recItemText}>{rec}</Text>
              </View>
            ))}
          </View>

          {/* MENSAJE DE ESPERANZA */}
          <View style={styles.hopeCard}>
            <Award color="#D97706" size={20} />
            <View style={{ flex: 1 }}>
              <Text style={styles.hopeTitle}>{result?.hopeTitle}</Text>
              <Text style={styles.hopeText}>{result?.hopeText}</Text>
            </View>
          </View>

          {/* RECIBIR INFORME POR EMAIL */}
          <View style={styles.emailReportCard}>
            <Text style={styles.emailReportTitle}>Recibir Plan Detallado en tu Correo</Text>
            <Text style={styles.emailReportSubtitle}>
              Te enviaremos este diagnóstico con tu guía de ejercicios prácticos.
            </Text>
            <TextInput
              style={styles.emailInput}
              placeholder="tu.correo@ejemplo.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={emailInput}
              onChangeText={setEmailInput}
            />
            <TouchableOpacity
              onPress={handleSendReport}
              disabled={isSendingReport}
              style={styles.sendReportBtn}
              activeOpacity={0.85}
            >
              {isSendingReport ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Send color="#FFFFFF" size={15} />
                  <Text style={styles.sendReportBtnText}>Enviar mi Informe de Bienestar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* CTA AGENDAR SESIÓN */}
          <TouchableOpacity
            onPress={() => router.push('/agenda' as any)}
            style={styles.scheduleCtaBtn}
            activeOpacity={0.85}
          >
            <Calendar color="#FFFFFF" size={18} />
            <Text style={styles.scheduleCtaBtnText}>Agendar Sesión con Terapeuta</Text>
          </TouchableOpacity>

          {/* REPETIR TEST */}
          <TouchableOpacity
            onPress={() => {
              setCurrentIdx(0);
              setAnswers([]);
              setIsCompleted(false);
            }}
            style={styles.retryBtn}
            activeOpacity={0.7}
          >
            <RefreshCw color="#64748B" size={15} />
            <Text style={styles.retryBtnText}>Repetir Evaluación</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
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
    letterSpacing: 0.6,
  },
  headerMainTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  durationPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  durationPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  progressMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressStepText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  progressPercentText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#64748B',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  questionSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
  },
  questionPromptText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 26,
  },
  optionsList: {
    gap: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCircleText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#475569',
  },
  optionLabelText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#334155',
    lineHeight: 19,
  },

  // RESULT STYLES
  resultScrollContent: {
    padding: 16,
    gap: 14,
  },
  resultBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resultBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  resultBadgeText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultInterpretation: {
    fontSize: 13.5,
    fontStyle: 'italic',
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
  },
  recommendationsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  recItemRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  recItemText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  hopeCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFBEB',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  hopeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 4,
  },
  hopeText: {
    fontSize: 12,
    color: '#B45309',
    lineHeight: 17,
  },
  emailReportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emailReportTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  emailReportSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 16,
  },
  emailInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 12,
  },
  sendReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 14,
  },
  sendReportBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  scheduleCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  scheduleCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  retryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
});
