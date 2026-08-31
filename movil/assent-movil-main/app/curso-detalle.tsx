import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  StatusBar,
  Platform,
  Alert,
  Dimensions,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Lock,
  Unlock,
  Clock,
  Layers,
  Award,
  Video,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Share2,
  GraduationCap,
  Eye,
  Check,
  FileText,
  HelpCircle,
  RotateCcw,
  Info,
  ShieldCheck,
} from 'lucide-react-native';
import { mobileApi, normalizeMediaUrl } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { CustomVideoPlayer } from '../components/CustomVideoPlayer';
import { ALL_MASTER_COURSES, CourseItem, CourseLesson, CourseModule } from '../data/coursesData';

const { width } = Dimensions.get('window');

export default function CursoDetalleScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 16);
  const router = useRouter();
  const params = useLocalSearchParams<{ slug?: string; id?: string }>();
  const { user: me, isAuthenticated: isAuthed } = useAuth();

  const slug = params.slug || 'autohipnosis';

  // Current Course State
  const initialCourse = useMemo(() => {
    return ALL_MASTER_COURSES.find((c) => c.slug === slug) || ALL_MASTER_COURSES[0];
  }, [slug]);

  const [course, setCourse] = useState<CourseItem>(initialCourse);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'study' | 'curriculum' | 'certificate' | 'about'>('study');
  
  // Lesson & Progress State
  const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(
    initialCourse.modules?.[0]?.lessons?.[0] || null
  );
  const [completedLessons, setCompletedLessons] = useState<{ [lessonId: string]: boolean }>({});
  const [expandedModules, setExpandedModules] = useState<{ [modId: string]: boolean }>({
    m1: true,
    m2: true,
    m3: true,
    'erick-m1': true,
    'tcc-m1': true,
    'dp-m1': true,
    'ie-m1': true,
    'ac-m1': true,
    'map-m1': true,
  });

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizResultScore, setQuizResultScore] = useState<{ correct: number; total: number; passed: boolean } | null>(null);

  // Lumis / Unlock State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  const [userBalance, setUserBalance] = useState<number>(150);

  useEffect(() => {
    const loadCourseDetail = async () => {
      try {
        setLoading(true);
        // Find local course first
        const foundLocal = ALL_MASTER_COURSES.find((c) => c.slug === slug) || ALL_MASTER_COURSES[0];
        setCourse(foundLocal);

        if (isAuthed) {
          // Check Lumi wallet
          try {
            const wRes = await mobileApi.fetchLumiWallet();
            if (wRes.ok && wRes.data) {
              setUserBalance(wRes.data.balance ?? 150);
              const unlockedList = (wRes.data.unlockedItems || []).map((u: any) => u.itemId);
              if (slug === 'autohipnosis' || unlockedList.includes(slug)) {
                setIsUnlocked(true);
              }
            }
          } catch {}

          // Fetch course detail from backend if available
          try {
            const res = await mobileApi.fetchPortalCourseDetail(slug);
            if (res.ok && res.data) {
              const backendCourse = res.data;
              if (backendCourse.progress?.completedItemIds) {
                const map: { [k: string]: boolean } = {};
                backendCourse.progress.completedItemIds.forEach((id: string) => {
                  map[id] = true;
                });
                setCompletedLessons(map);

                if (backendCourse.progress.lastItemId) {
                  // Find lesson with this ID
                  let targetLesson: CourseLesson | null = null;
                  (foundLocal.modules || []).forEach((m) => {
                    m.lessons.forEach((l) => {
                      if (l.id === backendCourse.progress.lastItemId) targetLesson = l;
                    });
                  });
                  if (targetLesson) setActiveLesson(targetLesson);
                }
              }
            }
          } catch {}
        }

        // Default lesson if not set
        if (!activeLesson) {
          setActiveLesson(foundLocal.modules?.[0]?.lessons?.[0] || null);
        }
      } catch (e) {
        console.warn('Error loading course:', e);
      } finally {
        setLoading(false);
      }
    };

    loadCourseDetail();
  }, [slug, isAuthed]);

  const flatLessons = useMemo(() => {
    const list: { lesson: CourseLesson; moduleTitle: string }[] = [];
    (course.modules || []).forEach((m) => {
      (m.lessons || []).forEach((l) => {
        list.push({ lesson: l, moduleTitle: m.title });
      });
    });
    return list;
  }, [course]);

  const quizLessons = useMemo(() => {
    return flatLessons.filter((item) => item.lesson.type === 'quiz');
  }, [flatLessons]);

  const completedQuizCount = useMemo(() => {
    return quizLessons.filter((item) => !!completedLessons[item.lesson.id]).length;
  }, [quizLessons, completedLessons]);

  const currentLessonIndex = useMemo(() => {
    if (!activeLesson) return 0;
    return flatLessons.findIndex((item) => item.lesson.id === activeLesson.id);
  }, [flatLessons, activeLesson]);

  const completedCount = useMemo(() => {
    return flatLessons.filter((item) => !!completedLessons[item.lesson.id]).length;
  }, [flatLessons, completedLessons]);

  const progressPercent = useMemo(() => {
    if (flatLessons.length === 0) return 0;
    return Math.round((completedCount / flatLessons.length) * 100);
  }, [completedCount, flatLessons]);

  const markLessonAsCompleted = (lessonId: string) => {
    if (completedLessons[lessonId]) return;
    const updated = { ...completedLessons, [lessonId]: true };
    setCompletedLessons(updated);

    const completedIds = Object.keys(updated).filter((k) => updated[k]);
    mobileApi.updateCourseProgress(course.slug, {
      completedItemIds: completedIds,
      lastItemId: lessonId,
    });

    if (completedIds.length === flatLessons.length && flatLessons.length > 0) {
      setTimeout(() => {
        setActiveTab('certificate');
      }, 400);
    }
  };

  const toggleLessonCompleted = (lessonId: string) => {
    const target = flatLessons.find((x) => x.lesson.id === lessonId)?.lesson;
    if (target?.type === 'quiz' && !completedLessons[lessonId]) {
      Alert.alert(
        '⚠️ Evaluación Requerida',
        'Para marcar como completada esta evaluación debes responder el 100% de las preguntas correctamente en el cuestionario.'
      );
      return;
    }

    const next = !completedLessons[lessonId];
    const updated = { ...completedLessons, [lessonId]: next };
    setCompletedLessons(updated);

    const completedIds = Object.keys(updated).filter((k) => updated[k]);
    mobileApi.updateCourseProgress(course.slug, {
      completedItemIds: completedIds,
      lastItemId: lessonId,
    });

    if (completedIds.length === flatLessons.length && flatLessons.length > 0) {
      setTimeout(() => {
        setActiveTab('certificate');
      }, 400);
    }
  };

  const handleSubmitEvaluation = () => {
    if (!activeLesson || !activeLesson.quiz) return;

    const questions = activeLesson.quiz.questions;
    let correctCount = 0;

    // Check all questions answered
    const unanswered = questions.some((q) => !quizAnswers[q.id]);
    if (unanswered) {
      Alert.alert('Respuestas pendientes', 'Debes responder todas las preguntas antes de verificar.');
      return;
    }

    questions.forEach((q) => {
      const selectedId = quizAnswers[q.id];
      const correctChoice = q.choices.find((c) => c.isCorrect);
      if (correctChoice && correctChoice.id === selectedId) {
        correctCount += 1;
      }
    });

    const is100Percent = correctCount === questions.length;
    setQuizSubmitted(true);
    setQuizResultScore({ correct: correctCount, total: questions.length, passed: is100Percent });

    if (is100Percent) {
      markLessonAsCompleted(activeLesson.id);
      Alert.alert(
        '🎉 ¡Evaluación Aprobada al 100%!',
        `Excelente dominio conceptual. Has respondido correctamente ${correctCount} de ${questions.length} preguntas. Esta lección ha sido validada para tu título.`
      );
    } else {
      Alert.alert(
        '❌ Calificación Insuficiente',
        `Obtuviste ${correctCount} de ${questions.length} aciertos. Para acreditar tu título debes tener el 100% correcto. Revisa las explicaciones pedagógicas e inténtalo de nuevo.`
      );
    }
  };

  const handleNextLesson = () => {
    // If current lesson is a quiz and hasn't been approved 100%, block advancing
    if (activeLesson?.type === 'quiz' && !completedLessons[activeLesson.id]) {
      Alert.alert(
        '🔒 Evaluación No Aprobada',
        'Debes resolver todas las preguntas con el 100% de aciertos para poder avanzar y reclamar tu título.'
      );
      return;
    }

    // Auto-complete reading/video lessons
    if (activeLesson && activeLesson.type !== 'quiz') {
      markLessonAsCompleted(activeLesson.id);
    }

    // Advance to next lesson
    if (currentLessonIndex < flatLessons.length - 1) {
      const nextItem = flatLessons[currentLessonIndex + 1];
      setActiveLesson(nextItem.lesson);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizResultScore(null);
      setActiveTab('study');
    } else {
      // If it was the last lesson, show completion diploma
      setActiveTab('certificate');
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      const prevItem = flatLessons[currentLessonIndex - 1];
      setActiveLesson(prevItem.lesson);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setActiveTab('study');
    }
  };

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleShareCourse = async () => {
    try {
      await Share.share({
        message: `🌟 Estoy aprendiendo en el Curso Master "${course.title}" en Conexión Luz®. Descúbrelo aquí: https://conexionluz.com/cursos`,
        title: course.title,
      });
    } catch {}
  };

  const diplomaShotRef = useRef<any>(null);
  const [isExportingDiploma, setIsExportingDiploma] = useState<boolean>(false);

  const handleShareDiplomaPng = async () => {
    if (progressPercent < 100) {
      Alert.alert(
        '🔒 Diploma Bloqueado',
        `Actualmente llevas el ${progressPercent}% del curso. Completa el 100% de las lecciones para poder emitir y compartir tu Diploma Oficial en PNG.`
      );
      return;
    }

    if (!diplomaShotRef.current) return;

    try {
      setIsExportingDiploma(true);
      const uri = await captureRef(diplomaShotRef, {
        format: 'png',
        quality: 1.0,
        result: 'tmpfile',
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `Diploma Oficial - ${course.title}`,
          UTI: 'public.png',
        });
      } else {
        await Share.share({
          title: `Diploma Oficial - ${course.title}`,
          message: `🎓 Certificado de Culminación de ${studentName} en el curso "${course.title}" por Conexión Luz®.`,
          url: uri,
        });
      }
    } catch (error: any) {
      console.warn('Error capturando diploma PNG:', error);
      Alert.alert('Error', error?.message || 'No se pudo generar la imagen del diploma.');
    } finally {
      setIsExportingDiploma(false);
    }
  };

  const studentName = me
    ? `${me.firstName || ''} ${me.lastName || ''}`.trim() || 'Estudiante de Conexión Luz'
    : 'Estudiante de Conexión Luz';

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={true} />

      {/* ===== 1. TOP HEADER EXCLUSIVO DEL CURSO ===== */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft color="#0F172A" size={22} />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <View style={styles.headerBadgeRow}>
            <View style={styles.categoryBadge}>
              <Sparkles color="#047857" size={11} />
              <Text style={styles.categoryBadgeText}>{course.badge}</Text>
            </View>
            <Text style={styles.progressPercentText}>{progressPercent}% Completado</Text>
          </View>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {course.title}
          </Text>
        </View>

        <TouchableOpacity onPress={handleShareCourse} style={styles.shareBtn} activeOpacity={0.7}>
          <Share2 color="#059669" size={18} />
        </TouchableOpacity>
      </View>

      {/* OVERALL PROGRESS BAR */}
      <View style={styles.progressBarWrapper}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>

      {/* ===== 2. TABS DE NAVEGACIÓN DENTRO DEL CURSO ===== */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          onPress={() => setActiveTab('study')}
          style={[styles.tabBtn, activeTab === 'study' && styles.tabBtnActive]}
        >
          <BookOpen color={activeTab === 'study' ? '#059669' : '#64748B'} size={15} />
          <Text style={[styles.tabBtnText, activeTab === 'study' && styles.tabBtnTextActive]}>
            Estudiar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('curriculum')}
          style={[styles.tabBtn, activeTab === 'curriculum' && styles.tabBtnActive]}
        >
          <Layers color={activeTab === 'curriculum' ? '#059669' : '#64748B'} size={15} />
          <Text style={[styles.tabBtnText, activeTab === 'curriculum' && styles.tabBtnTextActive]}>
            Temario ({completedCount}/{flatLessons.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('certificate')}
          style={[styles.tabBtn, activeTab === 'certificate' && styles.tabBtnActive]}
        >
          <Award color={activeTab === 'certificate' ? '#059669' : '#64748B'} size={15} />
          <Text style={[styles.tabBtnText, activeTab === 'certificate' && styles.tabBtnTextActive]}>
            Diploma
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('about')}
          style={[styles.tabBtn, activeTab === 'about' && styles.tabBtnActive]}
        >
          <Info color={activeTab === 'about' ? '#059669' : '#64748B'} size={15} />
          <Text style={[styles.tabBtnText, activeTab === 'about' && styles.tabBtnTextActive]}>
            Info
          </Text>
        </TouchableOpacity>
      </View>

      {/* ===== 3. BODY VIEW SEGÚN EL TAB ACTIVO ===== */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* --- TAB 1: ESTUDIO & LECCIÓN ACTUAL --- */}
        {activeTab === 'study' && (
          <View style={styles.tabContentContainer}>
            {activeLesson ? (
              <View style={styles.lessonStage}>
                {/* LESSON HEADER & TYPE */}
                <View style={styles.lessonMetaRow}>
                  <View style={styles.lessonTypePill}>
                    {activeLesson.type === 'video' ? (
                      <>
                        <Video color="#0284C7" size={13} />
                        <Text style={styles.lessonTypePillText}>Video Clase</Text>
                      </>
                    ) : activeLesson.type === 'quiz' ? (
                      <>
                        <HelpCircle color="#D97706" size={13} />
                        <Text style={[styles.lessonTypePillText, { color: '#D97706' }]}>
                          Evaluación de Conocimientos
                        </Text>
                      </>
                    ) : (
                      <>
                        <FileText color="#059669" size={13} />
                        <Text style={[styles.lessonTypePillText, { color: '#059669' }]}>
                          Lectura Teórico-Práctica
                        </Text>
                      </>
                    )}
                  </View>

                  <TouchableOpacity
                    onPress={() => toggleLessonCompleted(activeLesson.id)}
                    style={[
                      styles.markDonePill,
                      completedLessons[activeLesson.id] && styles.markDonePillActive,
                    ]}
                  >
                    <CheckCircle2 color="#FFFFFF" size={14} />
                    <Text style={styles.markDonePillText}>
                      {completedLessons[activeLesson.id] ? '✓ Completado' : 'Completar Lección'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.lessonHeading}>{activeLesson.title}</Text>

                {/* 1. REPRODUCTOR DE VIDEO SI LA LECCIÓN TIENE VIDEO */}
                {activeLesson.type === 'video' && activeLesson.videoUrl && (
                  <View style={styles.videoPlayerContainer}>
                    <CustomVideoPlayer
                      src={activeLesson.videoUrl}
                      height={Math.round(width * 0.54)}
                      fullBleed={true}
                      contentFit="contain"
                      autoPlay={false}
                      defaultMuted={false}
                      style={{ width: width - 32 }}
                    />
                  </View>
                )}

                {/* 2. TEXTO COMPLETO Y CONTENIDO DE LECTURA */}
                {activeLesson.contentText && (
                  <View style={styles.readingCard}>
                    <Text style={styles.readingBodyText}>{activeLesson.contentText}</Text>

                    {/* PUNTOS CLAVE DESTACADOS */}
                    {activeLesson.keyPoints && activeLesson.keyPoints.length > 0 && (
                      <View style={styles.keyPointsCard}>
                        <View style={styles.keyPointsHeader}>
                          <Sparkles color="#047857" size={15} />
                          <Text style={styles.keyPointsTitle}>Puntos Clave para Recordar</Text>
                        </View>

                        {activeLesson.keyPoints.map((pt, idx) => (
                          <View key={idx} style={styles.keyPointRow}>
                            <View style={styles.keyPointDot}>
                              <Check color="#047857" size={12} />
                            </View>
                            <Text style={styles.keyPointText}>{pt}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                {/* 3. EVALUACIÓN / QUIZ INTERACTIVO */}
                {activeLesson.type === 'quiz' && activeLesson.quiz && (
                  <View style={styles.quizCard}>
                    <Text style={styles.quizInstructions}>
                      Responde a las siguientes preguntas para evaluar tu asimilación de los conceptos:
                    </Text>

                    {activeLesson.quiz.questions.map((q, qIdx) => (
                      <View key={q.id} style={styles.questionContainer}>
                        <Text style={styles.questionPrompt}>
                          {qIdx + 1}. {q.prompt}
                        </Text>

                        <View style={styles.choicesColumn}>
                          {q.choices.map((c) => {
                            const isSelected = quizAnswers[q.id] === c.id;
                            let choiceBoxStyle = styles.choiceBox;
                            let choiceTextStyle = styles.choiceText;

                            if (isSelected) {
                              choiceBoxStyle = styles.choiceBoxSelected;
                              choiceTextStyle = styles.choiceTextSelected;
                            }

                            if (quizSubmitted) {
                              if (c.isCorrect) {
                                choiceBoxStyle = styles.choiceBoxCorrect;
                                choiceTextStyle = styles.choiceTextCorrect;
                              } else if (isSelected && !c.isCorrect) {
                                choiceBoxStyle = styles.choiceBoxIncorrect;
                                choiceTextStyle = styles.choiceTextIncorrect;
                              }
                            }

                            return (
                              <TouchableOpacity
                                key={c.id}
                                disabled={quizSubmitted}
                                onPress={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: c.id }))}
                                style={choiceBoxStyle}
                                activeOpacity={0.8}
                              >
                                <View style={styles.radioDot}>
                                  {isSelected && <View style={styles.radioDotInner} />}
                                </View>
                                <Text style={choiceTextStyle}>{c.text}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>

                        {quizSubmitted && q.explanation && (
                          <View style={styles.explanationBox}>
                            <Text style={styles.explanationText}>💡 {q.explanation}</Text>
                          </View>
                        )}
                      </View>
                    ))}

                    {quizSubmitted && quizResultScore && (
                      <View
                        style={[
                          styles.quizScoreResultBanner,
                          quizResultScore.passed
                            ? styles.quizScoreBannerPassed
                            : styles.quizScoreBannerFailed,
                        ]}
                      >
                        {quizResultScore.passed ? (
                          <>
                            <CheckCircle2 color="#059669" size={20} />
                            <View style={{ flex: 1 }}>
                              <Text style={styles.quizScoreTitlePassed}>
                                ¡Evaluación Aprobada con 100% de Excelencia!
                              </Text>
                              <Text style={styles.quizScoreSubPassed}>
                                {quizResultScore.correct} de {quizResultScore.total} preguntas correctas. Has acreditado este módulo para tu título.
                              </Text>
                            </View>
                          </>
                        ) : (
                          <>
                            <HelpCircle color="#DC2626" size={20} />
                            <View style={{ flex: 1 }}>
                              <Text style={styles.quizScoreTitleFailed}>
                                Calificación: {quizResultScore.correct} de {quizResultScore.total} aciertos (Requiere 100%)
                              </Text>
                              <Text style={styles.quizScoreSubFailed}>
                                Para ganar tu título debes responder todas las preguntas correctamente. Revisa las explicaciones de abajo y reintenta la prueba.
                              </Text>
                            </View>
                          </>
                        )}
                      </View>
                    )}

                    <View style={styles.quizFooter}>
                      {!quizSubmitted ? (
                        <TouchableOpacity
                          onPress={handleSubmitEvaluation}
                          style={styles.submitQuizButton}
                        >
                          <Text style={styles.submitQuizButtonText}>Verificar y Validar Evaluación</Text>
                        </TouchableOpacity>
                      ) : !quizResultScore?.passed ? (
                        <TouchableOpacity
                          onPress={() => {
                            setQuizSubmitted(false);
                            setQuizAnswers({});
                            setQuizResultScore(null);
                          }}
                          style={styles.retryQuizButton}
                        >
                          <RotateCcw color="#059669" size={15} />
                          <Text style={styles.retryQuizButtonText}>Reintentar para Obtener el 100%</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={handleNextLesson}
                          style={styles.passedNextBtn}
                        >
                          <Text style={styles.passedNextBtnText}>Continuar a la Siguiente Lección →</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}

                {/* BOTTOM NAVIGATION ACTIONS */}
                <View style={styles.navBarFooter}>
                  <TouchableOpacity
                    onPress={handlePrevLesson}
                    disabled={currentLessonIndex <= 0}
                    style={[styles.navStepBtn, currentLessonIndex <= 0 && styles.navStepBtnDisabled]}
                  >
                    <ChevronLeft color={currentLessonIndex <= 0 ? '#94A3B8' : '#0F172A'} size={18} />
                    <Text
                      style={[
                        styles.navStepBtnText,
                        currentLessonIndex <= 0 && styles.navStepBtnTextDisabled,
                      ]}
                    >
                      Anterior
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.lessonCounterBadge}>
                    Lección {currentLessonIndex + 1} de {flatLessons.length}
                  </Text>

                  <TouchableOpacity
                    onPress={handleNextLesson}
                    style={[
                      styles.navStepBtn,
                      styles.navStepBtnNext,
                    ]}
                  >
                    <Text
                      style={[
                        styles.navStepBtnText,
                        styles.navStepBtnTextNext,
                      ]}
                    >
                      {currentLessonIndex >= flatLessons.length - 1 ? 'Finalizar Curso' : 'Siguiente'}
                    </Text>
                    <ChevronRight
                      color="#FFFFFF"
                      size={18}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
        )}

        {/* --- TAB 2: TEMARIO COMPLETO (ACCORDION) --- */}
        {activeTab === 'curriculum' && (
          <View style={styles.tabContentContainer}>
            <View style={styles.curriculumHeaderCard}>
              <View>
                <Text style={styles.curriculumCardTitle}>Estructura Académica</Text>
                <Text style={styles.curriculumCardSubtitle}>
                  {course.modules?.length} Módulos • {flatLessons.length} Lecciones
                </Text>
              </View>
              <View style={styles.curriculumScoreBadge}>
                <Text style={styles.curriculumScoreText}>{progressPercent}%</Text>
              </View>
            </View>

            {(course.modules || []).map((module) => {
              const isExpanded = !!expandedModules[module.id];
              const completedInMod = module.lessons.filter((l) => !!completedLessons[l.id]).length;

              return (
                <View key={module.id} style={styles.moduleSectionCard}>
                  <TouchableOpacity
                    onPress={() => toggleModule(module.id)}
                    style={styles.moduleSectionHeader}
                    activeOpacity={0.8}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.moduleSectionTitle}>{module.title}</Text>
                      <Text style={styles.moduleSectionSubtitle}>
                        {completedInMod}/{module.lessons.length} completadas • {module.description || 'Contenido disponible'}
                      </Text>
                    </View>
                    {isExpanded ? <ChevronUp color="#475569" size={18} /> : <ChevronDown color="#475569" size={18} />}
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.lessonsColumn}>
                      {module.lessons.map((lesson) => {
                        const isDone = !!completedLessons[lesson.id];
                        const isCurrent = activeLesson?.id === lesson.id;

                        return (
                          <TouchableOpacity
                            key={lesson.id}
                            onPress={() => {
                              setActiveLesson(lesson);
                              setQuizAnswers({});
                              setQuizSubmitted(false);
                              setActiveTab('study');
                            }}
                            style={[styles.lessonItemRow, isCurrent && styles.lessonItemRowActive]}
                            activeOpacity={0.8}
                          >
                            <View style={styles.lessonIconBubble}>
                              {lesson.type === 'quiz' ? (
                                <HelpCircle color="#D97706" size={16} />
                              ) : lesson.type === 'video' ? (
                                <PlayCircle color="#0284C7" size={16} />
                              ) : (
                                <FileText color="#059669" size={16} />
                              )}
                            </View>

                            <View style={{ flex: 1 }}>
                              <Text
                                style={[
                                  styles.lessonItemTitle,
                                  isCurrent && styles.lessonItemTitleActive,
                                ]}
                              >
                                {lesson.title}
                              </Text>
                              <Text style={styles.lessonItemDuration}>
                                {lesson.duration || '10 min'} • {lesson.type === 'quiz' ? 'Evaluación' : lesson.type === 'video' ? 'Video' : 'Lectura'}
                              </Text>
                            </View>

                            <TouchableOpacity
                              onPress={() => toggleLessonCompleted(lesson.id)}
                              style={styles.checkIconBtn}
                            >
                              <CheckCircle2 color={isDone ? '#059669' : '#CBD5E1'} size={24} />
                            </TouchableOpacity>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* --- TAB 3: DIPLOMA / CERTIFICADO OFICIAL --- */}
        {activeTab === 'certificate' && (
          <View style={styles.tabContentContainer}>
            <View style={styles.certificateOuterCard}>
              
              {/* VIEWSHOT CAPTURABLE PNG FRAME */}
              <ViewShot
                ref={diplomaShotRef}
                options={{ format: 'png', quality: 1.0 }}
                style={styles.diplomaCaptureWrapper}
              >
                <View style={styles.diplomaFrameBorder}>
                  {/* WATERMARK OR TOP EMBLEM */}
                  <View style={styles.certIconContainer}>
                    <Award color="#D97706" size={32} />
                  </View>

                  <Text style={styles.certHeading}>CERTIFICADO DE CULMINACIÓN</Text>
                  <Text style={styles.certSubheading}>Academia Internacional Conexión Luz®</Text>
                  <Text style={styles.certSerialCode}>
                    REGISTRO: CL-2026-{course.slug.toUpperCase().slice(0, 4)}-{Math.abs(course.title.length * 137)}
                  </Text>

                  <View style={styles.certDividerLine} />

                  <Text style={styles.certOtorgadoA}>Se otorga el presente reconocimiento a:</Text>
                  <Text style={styles.certStudentNameDisplay}>{studentName}</Text>

                  <Text style={styles.certAcredita}>
                    Por haber cursado, participado y acreditado satisfactoriamente el 100% de los módulos formativos, ejercicios reflexivos y evaluaciones del programa:
                  </Text>

                  <Text style={styles.certCourseNameDisplay}>"{course.title}"</Text>
                  <Text style={styles.certModalidadText}>
                    Modalidad 100% Online • {course.duration || '6 Horas Académicas'}
                  </Text>

                  {/* FORMAL DISCLAIMER */}
                  <Text style={styles.certFormalDisclaimer}>
                    * Certificación de formación continua y aprovechamiento académico emitida por Conexión Luz®. Este programa corresponde a desarrollo y crecimiento personal; no constituye título profesional regulado.
                  </Text>

                  <View style={styles.certFooterDivider} />

                  {/* SIGNATURES AND SEAL ROW */}
                  <View style={styles.certSignaturesRow}>
                    <View style={styles.certSigBox}>
                      <View style={styles.certSignatureLine} />
                      <Text style={styles.certSigTitle}>Luz Amparo Valencia</Text>
                      <Text style={styles.certSigRole}>Dirección General Conexión Luz</Text>
                    </View>

                    <View style={styles.certSealBadge}>
                      <ShieldCheck color="#059669" size={20} />
                      <Text style={styles.certSealText}>VERIFICADO</Text>
                    </View>

                    <View style={styles.certSigBox}>
                      <View style={styles.certSignatureLine} />
                      <Text style={styles.certSigTitle}>Juan David Martínez</Text>
                      <Text style={styles.certSigRole}>Facilitador & Mentor</Text>
                    </View>
                  </View>
                </View>
              </ViewShot>

              {/* REQUIREMENTS TRACKER */}
              <View style={styles.certReqTrackerBox}>
                <Text style={styles.certReqTrackerTitle}>Requisitos Obligatorios para Obtener el Título:</Text>

                <View style={styles.certReqRow}>
                  <View style={[styles.certReqBadge, completedCount - completedQuizCount === flatLessons.length - quizLessons.length && styles.certReqBadgeDone]}>
                    {completedCount - completedQuizCount === flatLessons.length - quizLessons.length ? (
                      <CheckCircle2 color="#059669" size={14} />
                    ) : (
                      <Clock color="#64748B" size={14} />
                    )}
                  </View>
                  <Text style={styles.certReqText}>
                    Lecciones Teórico-Prácticas: {completedCount - completedQuizCount} de {flatLessons.length - quizLessons.length} leídas
                  </Text>
                </View>

                <View style={styles.certReqRow}>
                  <View style={[styles.certReqBadge, completedQuizCount === quizLessons.length && quizLessons.length > 0 && styles.certReqBadgeDone]}>
                    {completedQuizCount === quizLessons.length && quizLessons.length > 0 ? (
                      <CheckCircle2 color="#059669" size={14} />
                    ) : (
                      <HelpCircle color="#D97706" size={14} />
                    )}
                  </View>
                  <Text style={styles.certReqText}>
                    Evaluaciones Aprobadas al 100%: {completedQuizCount} de {quizLessons.length} módulos
                  </Text>
                </View>
              </View>

              {/* STATUS BANNER */}
              {progressPercent === 100 && completedQuizCount === quizLessons.length ? (
                <View style={styles.certCompletedBanner}>
                  <ShieldCheck color="#059669" size={18} />
                  <Text style={styles.certCompletedBannerText}>
                    🎉 ¡Mérito Académico Alcanzado! Has respondido todas las preguntas al 100% y completado el curso. Tu diploma está listo para compartir en PNG.
                  </Text>
                </View>
              ) : (
                <View style={styles.certPendingBanner}>
                  <Lock color="#D97706" size={16} />
                  <Text style={styles.certPendingBannerText}>
                    {completedQuizCount < quizLessons.length
                      ? `⚠️ Título Bloqueado: Aún tienes ${quizLessons.length - completedQuizCount} evaluación(es) pendiente(s) por aprobar al 100%. Responde todas las preguntas correctamente para reclamar tu título.`
                      : `Llevas el ${progressPercent}% del curso. Completa todas las lecciones pendientes para desbloquear tu Título en PNG.`}
                  </Text>
                </View>
              )}

              {/* SHARE / DOWNLOAD DIPLOMA PNG BUTTON */}
              <TouchableOpacity
                onPress={handleShareDiplomaPng}
                disabled={isExportingDiploma}
                style={[
                  styles.shareDiplomaBtn,
                  progressPercent < 100 && styles.shareDiplomaBtnLocked,
                ]}
                activeOpacity={progressPercent === 100 ? 0.85 : 1}
              >
                {isExportingDiploma ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : progressPercent === 100 ? (
                  <>
                    <Share2 color="#FFFFFF" size={16} />
                    <Text style={styles.shareDiplomaBtnText}>Compartir Diploma (Imagen PNG)</Text>
                  </>
                ) : (
                  <>
                    <Lock color="#FFFFFF" size={16} />
                    <Text style={styles.shareDiplomaBtnText}>
                      Completa el 100% para Compartir (PNG)
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* --- TAB 4: SOBRE EL CURSO --- */}
        {activeTab === 'about' && (
          <View style={styles.tabContentContainer}>
            <View style={styles.aboutCard}>
              <Image source={{ uri: course.coverUrl }} style={styles.aboutCoverImage} />

              <View style={styles.aboutInfoBox}>
                <Text style={styles.aboutTitle}>{course.title}</Text>
                <Text style={styles.aboutDesc}>{course.longDescription || course.description}</Text>

                {course.highlights && course.highlights.length > 0 && (
                  <View style={styles.aboutHighlightsBox}>
                    <Text style={styles.aboutHighlightsHeading}>✨ Puntos Clave del Programa:</Text>
                    {course.highlights.map((h, idx) => (
                      <View key={idx} style={styles.aboutHighlightRow}>
                        <CheckCircle2 color="#059669" size={14} style={{ marginTop: 2 }} />
                        <Text style={styles.aboutHighlightText}>{h}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.aboutDetailsList}>
                  <View style={styles.aboutDetailRow}>
                    <Clock color="#059669" size={16} />
                    <Text style={styles.aboutDetailText}>Duración estimada: {course.duration}</Text>
                  </View>
                  <View style={styles.aboutDetailRow}>
                    <GraduationCap color="#4F46E5" size={16} />
                    <Text style={styles.aboutDetailText}>Instructor: {course.instructor}</Text>
                  </View>
                  <View style={styles.aboutDetailRow}>
                    <Award color="#D97706" size={16} />
                    <Text style={styles.aboutDetailText}>Incluye Diploma de Finalización</Text>
                  </View>
                </View>

                <Text style={styles.aboutTagsHeading}>Temas Clave:</Text>
                <View style={styles.aboutTagsRow}>
                  {course.tags.map((tag, i) => (
                    <View key={i} style={styles.aboutTagPill}>
                      <Text style={styles.aboutTagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#065F46',
  },
  progressPercentText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  shareBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
  },
  progressBarWrapper: {
    height: 4,
    backgroundColor: '#E2E8F0',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#059669',
  },

  // TABS ROW
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 8,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: '#059669',
  },
  tabBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#059669',
    fontWeight: '900',
  },

  scrollContent: {
    padding: 16,
  },
  tabContentContainer: {
    gap: 16,
  },

  // LESSON STAGE
  lessonStage: {
    gap: 12,
  },
  lessonMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lessonTypePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  lessonTypePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
  },
  markDonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#64748B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  markDonePillActive: {
    backgroundColor: '#059669',
  },
  markDonePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  lessonHeading: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 25,
  },
  videoPlayerContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#020617',
  },
  readingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  readingBodyText: {
    fontSize: 14,
    lineHeight: 23,
    color: '#334155',
  },
  keyPointsCard: {
    marginTop: 16,
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  keyPointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  keyPointsTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#065F46',
  },
  keyPointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  keyPointDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  keyPointText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#047857',
    flex: 1,
  },

  // QUIZ CARD
  quizCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quizInstructions: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 16,
  },
  questionContainer: {
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  questionPrompt: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 10,
  },
  choicesColumn: {
    gap: 8,
  },
  choiceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    borderRadius: 12,
  },
  choiceBoxSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  choiceBoxCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  choiceBoxIncorrect: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  radioDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
  },
  choiceText: {
    fontSize: 12.5,
    color: '#334155',
    flex: 1,
  },
  choiceTextSelected: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1D4ED8',
    flex: 1,
  },
  choiceTextCorrect: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#065F46',
    flex: 1,
  },
  choiceTextIncorrect: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#991B1B',
    flex: 1,
  },
  explanationBox: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
  },
  explanationText: {
    fontSize: 11.5,
    color: '#15803D',
    lineHeight: 16,
  },
  quizScoreResultBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
  },
  quizScoreBannerPassed: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  quizScoreBannerFailed: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  quizScoreTitlePassed: {
    fontSize: 13,
    fontWeight: '900',
    color: '#065F46',
  },
  quizScoreSubPassed: {
    fontSize: 11.5,
    color: '#047857',
    marginTop: 2,
    lineHeight: 16,
  },
  quizScoreTitleFailed: {
    fontSize: 13,
    fontWeight: '900',
    color: '#991B1B',
  },
  quizScoreSubFailed: {
    fontSize: 11.5,
    color: '#B91C1C',
    marginTop: 2,
    lineHeight: 16,
  },
  quizFooter: {
    marginTop: 10,
  },
  submitQuizButton: {
    backgroundColor: '#059669',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitQuizButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  retryQuizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryQuizButtonText: {
    color: '#DC2626',
    fontSize: 12.5,
    fontWeight: '800',
  },
  passedNextBtn: {
    backgroundColor: '#059669',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  passedNextBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  // NAV BAR FOOTER
  navBarFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  navStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  navStepBtnNext: {
    backgroundColor: '#059669',
  },
  navStepBtnDisabled: {
    backgroundColor: '#F8FAFC',
    opacity: 0.5,
  },
  navStepBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  navStepBtnTextNext: {
    color: '#FFFFFF',
  },
  navStepBtnTextDisabled: {
    color: '#94A3B8',
  },
  lessonCounterBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },

  // CURRICULUM SECTION
  curriculumHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  curriculumCardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  curriculumCardSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  curriculumScoreBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  curriculumScoreText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#059669',
  },
  moduleSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  moduleSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#F8FAFC',
  },
  moduleSectionTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  moduleSectionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  lessonsColumn: {
    padding: 6,
  },
  lessonItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 12,
  },
  lessonItemRowActive: {
    backgroundColor: '#ECFDF5',
  },
  lessonIconBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonItemTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  lessonItemTitleActive: {
    color: '#047857',
    fontWeight: '900',
  },
  lessonItemDuration: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  checkIconBtn: {
    padding: 4,
  },

  // CERTIFICATE TAB & VIEWSHOT PNG CAPTURE
  certificateOuterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  diplomaCaptureWrapper: {
    width: '100%',
    backgroundColor: '#FFFDF7',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
  },
  diplomaFrameBorder: {
    borderWidth: 3,
    borderColor: '#D97706',
    borderRadius: 16,
    padding: 18,
    margin: 4,
    backgroundColor: '#FFFDF7',
    alignItems: 'center',
  },
  certIconContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  certHeading: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  certSubheading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
    marginTop: 2,
    textAlign: 'center',
  },
  certSerialCode: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 3,
    letterSpacing: 0.5,
  },
  certDividerLine: {
    width: '80%',
    height: 1,
    backgroundColor: '#FDE68A',
    marginVertical: 10,
  },
  certOtorgadoA: {
    fontSize: 11,
    color: '#78350F',
    fontWeight: '700',
    textAlign: 'center',
  },
  certStudentNameDisplay: {
    fontSize: 20,
    fontWeight: '900',
    color: '#064E3B',
    marginVertical: 6,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  certAcredita: {
    fontSize: 11.5,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 17,
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  certCourseNameDisplay: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#059669',
    textAlign: 'center',
    marginVertical: 4,
    lineHeight: 20,
  },
  certModalidadText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0284C7',
    textAlign: 'center',
    marginBottom: 8,
  },
  certFormalDisclaimer: {
    fontSize: 8.5,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 12,
    fontStyle: 'italic',
    paddingHorizontal: 12,
    marginVertical: 6,
  },
  certFooterDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  certSignaturesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  certSigBox: {
    alignItems: 'center',
    flex: 1,
  },
  certSignatureLine: {
    width: 60,
    height: 1,
    backgroundColor: '#CBD5E1',
    marginBottom: 4,
  },
  certSigTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  certSigRole: {
    fontSize: 8.5,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 1,
  },
  certSealBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  certSealText: {
    fontSize: 7.5,
    fontWeight: '900',
    color: '#059669',
    marginTop: 1,
  },
  certReqTrackerBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  certReqTrackerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  certReqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  certReqBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  certReqBadgeDone: {
    backgroundColor: '#ECFDF5',
  },
  certReqText: {
    fontSize: 11.5,
    color: '#334155',
    fontWeight: '700',
    flex: 1,
  },
  certCompletedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  certCompletedBannerText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#065F46',
    flex: 1,
    lineHeight: 16,
  },
  certPendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  certPendingBannerText: {
    fontSize: 11,
    color: '#92400E',
    flex: 1,
    lineHeight: 15,
    fontWeight: '700',
  },
  shareDiplomaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    backgroundColor: '#059669',
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  shareDiplomaBtnLocked: {
    backgroundColor: '#64748B',
    shadowOpacity: 0,
    elevation: 0,
  },
  shareDiplomaBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  // ABOUT TAB
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  aboutCoverImage: {
    width: '100%',
    height: 180,
  },
  aboutInfoBox: {
    padding: 16,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  aboutDesc: {
    fontSize: 13,
    lineHeight: 20,
    color: '#475569',
    marginBottom: 14,
  },
  aboutHighlightsBox: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  aboutHighlightsHeading: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#166534',
    marginBottom: 6,
  },
  aboutHighlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 4,
  },
  aboutHighlightText: {
    fontSize: 11.5,
    color: '#15803D',
    fontWeight: '700',
    flex: 1,
    lineHeight: 16,
  },
  aboutDetailsList: {
    gap: 8,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  aboutDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aboutDetailText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '700',
  },
  aboutTagsHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  aboutTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  aboutTagPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  aboutTagText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
});
