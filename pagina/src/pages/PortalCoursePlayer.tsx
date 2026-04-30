import React, { useEffect, useMemo, useRef, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { api } from '../api/client';
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, ListChecks, PlayCircle } from 'lucide-react';

type CourseItemType = 'video' | 'html' | 'quiz';

type CourseItem = {
  id: string;
  type: CourseItemType;
  title: string;
  html?: string;
  mediaUrl?: string;
  quiz?: {
    questions: Array<{
      id: string;
      type: 'multiple' | 'truefalse' | 'short';
      prompt: string;
      choices?: Array<{ id: string; text: string; isCorrect: boolean }>;
      correctBool?: boolean;
      correctText?: string;
    }>;
  };
};

type CourseSection = {
  id: string;
  title: string;
  items: CourseItem[];
};

type CourseDetail = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  descriptionHtml?: string;
  coverUrl?: string | null;
  promoVideoUrl?: string | null;
  category?: string;
  tags?: string[];
  priceCOP?: number;
  content: { sections?: CourseSection[] };
  progress?: ProgressState;
};

type ProgressState = {
  introWatched?: boolean;
  lastItemId?: string;
  completedItemIds?: string[];
  videoSecondsByItemId?: Record<string, number>;
};

function safeHtml(value: string): string {
  const noScripts = value.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  const noOnHandlers = noScripts.replace(/\son\w+="[^"]*"/gi, '');
  const noJsUrls = noOnHandlers.replace(/href="javascript:[^"]*"/gi, 'href="#"');
  return noJsUrls;
}

export default function PortalCoursePlayer({ slug }: { slug: string }) {
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem('conexionluz:token') : null;
  const isAuthed = Boolean(token);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<CourseDetail | null>(null);

  const [progress, setProgress] = useState<ProgressState>({});
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, unknown>>({});
  const [quizResult, setQuizResult] = useState<{ ok: boolean; score: number; total: number } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastProgressSentRef = useRef<number>(0);

  const flatItems = useMemo(() => {
    const items: Array<{ section: CourseSection; item: CourseItem }> = [];
    for (const s of course?.content?.sections || []) {
      for (const it of s.items || []) items.push({ section: s, item: it });
    }
    return items;
  }, [course]);

  const active = useMemo(() => {
    const found = flatItems.find((x) => x.item.id === activeItemId);
    return found?.item || null;
  }, [flatItems, activeItemId]);

  const persistProgress = async (state: ProgressState) => {
    setProgress(state);
    const now = Date.now();
    if (now - lastProgressSentRef.current < 1500) return;
    lastProgressSentRef.current = now;
    await api.patch<{ state: ProgressState }>(`/api/portal/courses/${slug}/progress/`, { state });
  };

  useEffect(() => {
    if (!isAuthed) return;
    void (async () => {
      setLoading(true);
      setError(null);
      const res = await api.get<CourseDetail>(`/api/portal/courses/${slug}/`);
      if (!res.ok) {
        setError(res.error);
        setLoading(false);
        return;
      }
      setCourse(res.data);
      const initialProgress = res.data.progress || {};
      setProgress(initialProgress);
      const initialItemId =
        initialProgress.lastItemId ||
        res.data.content?.sections?.[0]?.items?.[0]?.id ||
        null;
      setActiveItemId(initialItemId);
      setLoading(false);
    })();
  }, [isAuthed, slug]);

  useEffect(() => {
    const item = active;
    if (!item || item.type !== 'video') return;
    const seconds = progress.videoSecondsByItemId?.[item.id] || 0;
    const v = videoRef.current;
    if (!v) return;
    const handler = () => {
      try {
        if (seconds > 0 && v.currentTime < 1) v.currentTime = seconds;
      } catch {
        return;
      }
    };
    v.addEventListener('loadedmetadata', handler);
    return () => v.removeEventListener('loadedmetadata', handler);
  }, [active, progress.videoSecondsByItemId]);

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (loading) {
    return <div className="min-h-screen bg-white" />;
  }

  if (!course) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="text-xl font-bold text-gray-800">No se pudo cargar el curso</div>
            <div className="mt-2 text-gray-600">{error || 'Intenta de nuevo.'}</div>
            <Link to="/cursos" className="mt-6 inline-flex items-center gap-2 text-primary font-semibold">
              Volver a cursos
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const sections = course.content?.sections || [];
  const showIntro = Boolean(course.promoVideoUrl && progress.introWatched !== true);

  if (showIntro) {
    return (
      <PublicLayout contentClassName="p-0">
        <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-5xl">
            <div className="rounded-3xl border border-gray-100 shadow-lg overflow-hidden bg-white">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-gray-500">Video de presentación</div>
                  <div className="text-2xl font-bold text-gray-800">{course.title}</div>
                  <div className="text-sm text-gray-600">Mira la introducción antes de entrar al contenido.</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = { ...progress, introWatched: true };
                    void persistProgress(next);
                  }}
                  className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-300"
                >
                  Entrar al curso
                </button>
              </div>
              <div className="aspect-video bg-black">
                <video controls className="w-full h-full object-cover" preload="metadata">
                  <source src={course.promoVideoUrl || undefined} />
                </video>
              </div>
              <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  El video de presentación es gratis. El progreso se guarda en tu perfil.
                </div>
                <Link to="/cursos" className="text-primary font-semibold hover:underline">
                  Volver al catálogo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const activeIndex = flatItems.findIndex((x) => x.item.id === activeItemId);
  const prevId = activeIndex > 0 ? flatItems[activeIndex - 1].item.id : null;
  const nextId = activeIndex >= 0 && activeIndex < flatItems.length - 1 ? flatItems[activeIndex + 1].item.id : null;

  const completed = new Set(progress.completedItemIds || []);

  const markCompleted = async (itemId: string) => {
    const next = {
      ...progress,
      lastItemId: itemId,
      completedItemIds: Array.from(new Set([...(progress.completedItemIds || []), itemId]))
    };
    await persistProgress(next);
  };

  const onVideoTimeUpdate = async () => {
    const item = active;
    const v = videoRef.current;
    if (!item || item.type !== 'video' || !v) return;
    const seconds = Math.floor(v.currentTime || 0);
    const next = {
      ...progress,
      lastItemId: item.id,
      videoSecondsByItemId: { ...(progress.videoSecondsByItemId || {}), [item.id]: seconds }
    };
    await persistProgress(next);
  };

  const submitQuiz = async () => {
    const item = active;
    if (!item || item.type !== 'quiz') return;
    const questions = item.quiz?.questions || [];
    let score = 0;
    for (const q of questions) {
      const a = quizAnswers[q.id];
      if (q.type === 'multiple') {
        const correct = (q.choices || []).filter((c) => c.isCorrect).map((c) => c.id);
        const selected = Array.isArray(a) ? (a as string[]) : [];
        if (correct.length && selected.length && correct.every((x) => selected.includes(x)) && selected.every((x: string) => correct.includes(x))) {
          score += 1;
        }
      } else if (q.type === 'truefalse') {
        if (typeof a === 'boolean' && a === Boolean(q.correctBool)) score += 1;
      } else if (q.type === 'short') {
        const expected = (q.correctText || '').trim().toLowerCase();
        const got = String(a || '').trim().toLowerCase();
        if (!expected || expected === got) score += 1;
      }
    }
    setQuizResult({ ok: score >= Math.ceil(questions.length * 0.6), score, total: questions.length });
    await markCompleted(item.id);
  };

  return (
    <PublicLayout contentClassName="p-0">
      <section className="py-10 bg-gradient-to-br from-blue-50 via-green-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-gray-700">{course.category || 'Curso'}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">{course.title}</h1>
            {course.description ? <p className="text-gray-600 max-w-3xl">{course.description}</p> : null}
          </div>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <aside className="lg:col-span-1">
              <div className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden bg-white">
                <div className="p-6 border-b border-gray-100">
                  <div className="text-lg font-bold text-gray-800">Contenido</div>
                  <div className="mt-1 text-sm text-gray-600">
                    {completed.size}/{flatItems.length} completado
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {sections.map((s) => (
                    <div key={s.id} className="space-y-2">
                      <div className="text-sm font-bold text-gray-800">{s.title}</div>
                      <div className="space-y-1">
                        {(s.items || []).map((it) => (
                          <button
                            key={it.id}
                            type="button"
                            onClick={() => {
                              setQuizResult(null);
                              setActiveItemId(it.id);
                              void persistProgress({ ...progress, lastItemId: it.id });
                            }}
                            className={`w-full flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                              it.id === activeItemId ? 'border-primary/40 bg-primary/10' : 'border-gray-200 bg-white hover:shadow-sm'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="text-sm font-semibold text-gray-800">{it.title}</div>
                              <div className="text-xs text-gray-500">
                                {it.type === 'video' ? 'Video' : it.type === 'html' ? 'Lectura' : 'Quiz'}
                              </div>
                            </div>
                            {completed.has(it.id) ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : null}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <main className="lg:col-span-2 space-y-6">
              {!active ? (
                <div className="rounded-3xl border border-gray-100 p-8 text-gray-600">Selecciona un elemento.</div>
              ) : (
                <div className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden bg-white">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-gray-500">
                        {active.type === 'video' ? 'Video' : active.type === 'html' ? 'Lectura' : 'Quiz'}
                      </div>
                      <div className="text-2xl font-bold text-gray-800">{active.title}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => void markCompleted(active.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md transition-all"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Marcar completado
                    </button>
                  </div>

                  <div className="p-6">
                    {active.type === 'video' && active.mediaUrl ? (
                      <div className="space-y-4">
                        <div className="aspect-video bg-black rounded-3xl overflow-hidden">
                          <video
                            ref={videoRef}
                            controls
                            className="w-full h-full object-contain"
                            onTimeUpdate={() => void onVideoTimeUpdate()}
                            onPause={() => void onVideoTimeUpdate()}
                          >
                            <source src={active.mediaUrl} />
                          </video>
                        </div>
                        <div className="text-sm text-gray-600">
                          Puedes pausar y retomar: el progreso se guarda automáticamente.
                        </div>
                      </div>
                    ) : null}

                    {active.type === 'html' ? (
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: safeHtml(active.html || '') }} />
                    ) : null}

                    {active.type === 'quiz' ? (
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 border border-gray-100">
                          <ListChecks className="h-4 w-4 text-primary" />
                          <span className="text-xs font-semibold text-gray-700">Evaluación</span>
                        </div>

                        {(active.quiz?.questions || []).map((q, idx) => (
                          <div key={q.id} className="rounded-3xl border border-gray-100 bg-gray-50 p-6">
                            <div className="text-sm font-bold text-gray-800">
                              {idx + 1}. {q.prompt}
                            </div>

                            {q.type === 'multiple' ? (
                              <div className="mt-4 space-y-2">
                                {(q.choices || []).map((c) => {
                                  const selected: string[] = Array.isArray(quizAnswers[q.id]) ? quizAnswers[q.id] : [];
                                  const checked = selected.includes(c.id);
                                  return (
                                    <label key={c.id} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={(e) => {
                                          const next = e.target.checked
                                            ? [...selected, c.id]
                                            : selected.filter((x) => x !== c.id);
                                          setQuizAnswers((p) => ({ ...p, [q.id]: next }));
                                        }}
                                      />
                                      <span className="text-sm text-gray-800">{c.text}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            ) : null}

                            {q.type === 'truefalse' ? (
                              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                                {[true, false].map((v) => {
                                  const activeVal = quizAnswers[q.id] === v;
                                  return (
                                    <button
                                      key={String(v)}
                                      type="button"
                                      onClick={() => setQuizAnswers((p) => ({ ...p, [q.id]: v }))}
                                      className={`rounded-2xl border px-5 py-3 text-sm font-semibold transition-all ${
                                        activeVal ? 'border-primary/40 bg-primary/10' : 'border-gray-200 bg-white'
                                      }`}
                                    >
                                      {v ? 'Verdadero' : 'Falso'}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : null}

                            {q.type === 'short' ? (
                              <div className="mt-4">
                                <input
                                  value={String(quizAnswers[q.id] || '')}
                                  onChange={(e) => setQuizAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                  placeholder="Tu respuesta"
                                />
                              </div>
                            ) : null}
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => void submitQuiz()}
                          className="w-full bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-300"
                        >
                          Enviar respuestas
                        </button>

                        {quizResult ? (
                          <div className="rounded-3xl border border-gray-100 bg-white p-6">
                            <div className="text-xl font-bold text-gray-800">
                              Resultado: {quizResult.score}/{quizResult.total}
                            </div>
                            <div className="mt-2 text-gray-600">
                              {quizResult.ok ? '¡Bien! Puedes continuar.' : 'Puedes intentarlo de nuevo.'}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!prevId) return;
                    setQuizResult(null);
                    setActiveItemId(prevId);
                    void persistProgress({ ...progress, lastItemId: prevId });
                  }}
                  disabled={!prevId}
                  className="flex-1 bg-white text-gray-700 px-8 py-3 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!nextId) return;
                    setQuizResult(null);
                    setActiveItemId(nextId);
                    void persistProgress({ ...progress, lastItemId: nextId });
                  }}
                  disabled={!nextId}
                  className="flex-1 bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center">
                  <PlayCircle className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-gray-800">Tip</div>
                  <div className="text-sm text-gray-600">
                    Tu progreso se guarda mientras ves videos y avanzas por secciones.
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
