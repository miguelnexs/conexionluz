import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { 
  BookOpen, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  ListChecks, 
  PlayCircle,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Sparkles,
  Menu,
  X,
  Award,
  HelpCircle,
  FileText,
  Volume2,
  Wand2,
  LayoutDashboard
} from 'lucide-react';

import SessionGeneratorModal from '../components/autohipnosis/SessionGeneratorModal';
import AutohipnosisAudioPlayer from '../components/autohipnosis/AutohipnosisAudioPlayer';
import AutohipnosisDiary from '../components/autohipnosis/AutohipnosisDiary';
import AutohipnosisCertificate from '../components/autohipnosis/AutohipnosisCertificate';
import AutohipnosisDashboard from '../components/autohipnosis/AutohipnosisDashboard';
import { CustomVideoPlayer } from '../components/ui/CustomVideoPlayer';

// Hipnosis Ericksoniana Components
import EricksonianaLaboratorio from '../components/ericksoniana/EricksonianaLaboratorio';
import EricksonianaAnalizador from '../components/ericksoniana/EricksonianaAnalizador';
import EricksonianaMetaphorBuilder from '../components/ericksoniana/EricksonianaMetaphorBuilder';
import EricksonianaSessionBuilder from '../components/ericksoniana/EricksonianaSessionBuilder';
import EricksonianaCaseStudies from '../components/ericksoniana/EricksonianaCaseStudies';
import EricksonianaBiblioteca from '../components/ericksoniana/EricksonianaBiblioteca';
import EricksonianaEthicsNotice from '../components/ericksoniana/EricksonianaEthicsNotice';
import EricksonianaCertificate from '../components/ericksoniana/EricksonianaCertificate';

// TCC Components
import TCCLaboratorio from '../components/tcc/TCCLaboratorio';
import TCCRegistroCognitivo from '../components/tcc/TCCRegistroCognitivo';
import TCCAnalizadorABC from '../components/tcc/TCCAnalizadorABC';
import TCCDistorsionesIdentificador from '../components/tcc/TCCDistorsionesIdentificador';
import TCCResolucionProblemas from '../components/tcc/TCCResolucionProblemas';
import TCCCasosEstudio from '../components/tcc/TCCCasosEstudio';
import TCCGlosario from '../components/tcc/TCCGlosario';
import TCCBiblioteca from '../components/tcc/TCCBiblioteca';
import TCCEticaNotice from '../components/tcc/TCCEticaNotice';
import TCCCertificate from '../components/tcc/TCCCertificate';

// Desarrollo Personal Components
import DPLaboratorio from '../components/desarrollo-personal/DPLaboratorio';
import DPMapaPersonal from '../components/desarrollo-personal/DPMapaPersonal';
import DPBrujulaValores from '../components/desarrollo-personal/DPBrujulaValores';
import DPConstructorObjetivos from '../components/desarrollo-personal/DPConstructorObjetivos';
import DPSeguimientoHabitos from '../components/desarrollo-personal/DPSeguimientoHabitos';
import DPDiarioEmocional from '../components/desarrollo-personal/DPDiarioEmocional';
import DPRetosCrecimiento from '../components/desarrollo-personal/DPRetosCrecimiento';
import DPCasosEstudio from '../components/desarrollo-personal/DPCasosEstudio';
import DPGlosario from '../components/desarrollo-personal/DPGlosario';
import DPBiblioteca from '../components/desarrollo-personal/DPBiblioteca';
import DPEticaNotice from '../components/desarrollo-personal/DPEticaNotice';
import DPCertificate from '../components/desarrollo-personal/DPCertificate';

// Inteligencia Emocional Components
import IELaboratorio from '../components/inteligencia-emocional/IELaboratorio';
import IEMapaEmocional from '../components/inteligencia-emocional/IEMapaEmocional';
import IERuedaEmocional from '../components/inteligencia-emocional/IERuedaEmocional';
import IEPausaConsciente from '../components/inteligencia-emocional/IEPausaConsciente';
import IEConstructorComunicacion from '../components/inteligencia-emocional/IEConstructorComunicacion';
import IEAutoevaluacion from '../components/inteligencia-emocional/IEAutoevaluacion';
import IEDiarioEmocional from '../components/inteligencia-emocional/IEDiarioEmocional';
import IERetosEmocionales from '../components/inteligencia-emocional/IERetosEmocionales';
import IECasosEstudio from '../components/inteligencia-emocional/IECasosEstudio';
import IEGlosario from '../components/inteligencia-emocional/IEGlosario';
import IEBiblioteca from '../components/inteligencia-emocional/IEBiblioteca';
import IEEticaNotice from '../components/inteligencia-emocional/IEEticaNotice';
import IECertificate from '../components/inteligencia-emocional/IECertificate';

// Autoconocimiento Components
import ACLaboratorio from '../components/autoconocimiento/ACLaboratorio';
import ACMapaIdentidad from '../components/autoconocimiento/ACMapaIdentidad';
import ACBrujulaValores from '../components/autoconocimiento/ACBrujulaValores';
import ACInventarioFortalezas from '../components/autoconocimiento/ACInventarioFortalezas';
import ACObservadorPensamientos from '../components/autoconocimiento/ACObservadorPensamientos';
import ACLineaDeVida from '../components/autoconocimiento/ACLineaDeVida';
import ACMapaRelaciones from '../components/autoconocimiento/ACMapaRelaciones';
import ACDetectorPatrones from '../components/autoconocimiento/ACDetectorPatrones';
import ACAutoevaluacion from '../components/autoconocimiento/ACAutoevaluacion';
import ACDiario from '../components/autoconocimiento/ACDiario';
import ACRetos from '../components/autoconocimiento/ACRetos';
import ACCasosEstudio from '../components/autoconocimiento/ACCasosEstudio';
import ACGlosario from '../components/autoconocimiento/ACGlosario';
import ACBiblioteca from '../components/autoconocimiento/ACBiblioteca';
import ACEticaNotice from '../components/autoconocimiento/ACEticaNotice';
import ACCertificate from '../components/autoconocimiento/ACCertificate';

// Mediación y Atención Plena Components
import MAPPracticasMediacion from '../components/mediacion-atencion-plena/MAPPracticasMediacion';
import MAPDiarioMediacion from '../components/mediacion-atencion-plena/MAPDiarioMediacion';
import MAPLaboratorio from '../components/mediacion-atencion-plena/MAPLaboratorio';
import MAPReto21Dias from '../components/mediacion-atencion-plena/MAPReto21Dias';
import MAPObservadorPensamiento from '../components/mediacion-atencion-plena/MAPObservadorPensamiento';
import MAPInternoExterno from '../components/mediacion-atencion-plena/MAPInternoExterno';
import MAPMapaMediacion from '../components/mediacion-atencion-plena/MAPMapaMediacion';
import MAPAutoevaluacion from '../components/mediacion-atencion-plena/MAPAutoevaluacion';
import MAPCasosEstudio from '../components/mediacion-atencion-plena/MAPCasosEstudio';
import MAPGlosario from '../components/mediacion-atencion-plena/MAPGlosario';
import MAPBiblioteca from '../components/mediacion-atencion-plena/MAPBiblioteca';
import MAPEticaNotice from '../components/mediacion-atencion-plena/MAPEticaNotice';
import MAPCertificate from '../components/mediacion-atencion-plena/MAPCertificate';

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
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('conexionluz:token') : null;
  const isAuthed = Boolean(token);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<CourseDetail | null>(null);

  const [progress, setProgress] = useState<ProgressState>({});
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, unknown>>({});
  const [quizResult, setQuizResult] = useState<{ ok: boolean; score: number; total: number } | null>(null);
  
  // Immersive UI States
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
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

  const activeSection = useMemo(() => {
    const found = flatItems.find((x) => x.item.id === activeItemId);
    return found?.section || null;
  }, [flatItems, activeItemId]);

  const persistProgress = async (state: ProgressState) => {
    setProgress(state);
    const now = Date.now();
    if (now - lastProgressSentRef.current < 1500) return;
    lastProgressSentRef.current = now;
    await api.patch<{ state: ProgressState }>(`/api/portal/courses/${slug}/progress/`, { state });
  };

  // Course Interactive Tabs State
  const [activeTab, setActiveTab] = useState<string>('lessons');
  const [generatorOpen, setGeneratorOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('Estudiante de Conexión Luz');

  useEffect(() => {
    if (!isAuthed) return;
    api.get<any>('/api/portal/me/').then((res) => {
      if (res.ok && res.data) {
        const full = `${res.data.firstName || ''} ${res.data.lastName || ''}`.trim();
        if (full) setUserName(full);
      }
    });
  }, [isAuthed]);

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

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="text-sm font-bold text-slate-600">Cargando experiencia de aprendizaje...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="h-screen w-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center text-slate-800">
        <div className="max-w-md space-y-4 bg-white border border-slate-200 p-8 rounded-3xl shadow-lg">
          <div className="text-xl font-black text-rose-600">No se pudo cargar el curso</div>
          <p className="text-sm text-slate-600">{error || 'Intenta de nuevo más tarde.'}</p>
          <Link to="/cursos" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm">
            <ArrowLeft className="h-4 w-4" /> Volver al catálogo de cursos
          </Link>
        </div>
      </div>
    );
  }

  const sections = course.content?.sections || [];
  const activeIndex = flatItems.findIndex((x) => x.item.id === activeItemId);
  const prevId = activeIndex > 0 ? flatItems[activeIndex - 1].item.id : null;
  const nextId = activeIndex >= 0 && activeIndex < flatItems.length - 1 ? flatItems[activeIndex + 1].item.id : null;

  const completed = new Set(progress.completedItemIds || []);
  const progressPercent = flatItems.length > 0 ? Math.round((completed.size / flatItems.length) * 100) : 0;

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
    <div ref={containerRef} className="h-screen w-screen bg-slate-50 text-slate-900 flex flex-col overflow-hidden font-sans select-none">
      
      {/* ══════════════════════════════════════════════════════════
          1. STUDIO TOP BAR (Clean White Header)
      ══════════════════════════════════════════════════════════ */}
      <header className="h-16 shrink-0 bg-white border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between z-30 shadow-sm">
        
        {/* Left: Back & Course Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate('/cursos')}
            className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-2xs"
            title="Volver a Cursos"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="min-w-0 flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1 w-max">
              <Sparkles className="h-3 w-3" /> {course.category || 'Estudio de Aprendizaje'}
            </span>
            <h1 className="text-sm md:text-base font-black text-slate-900 truncate max-w-xs md:max-w-md mt-0.5">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Center: Overall Progress Bar */}
        <div className="hidden md:flex items-center gap-4 max-w-xs w-full px-4">
          <div className="flex-1 bg-slate-100 border border-slate-200/80 h-2.5 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div 
              className="bg-gradient-to-r from-emerald-600 to-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-black text-emerald-700 shrink-0">{progressPercent}%</span>
        </div>

        {/* Right: Actions (Toggle Sidebar & Fullscreen) */}
        <div className="flex items-center gap-2">
          {active && (
            <button
              onClick={() => void markCompleted(active.id)}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                completed.has(active.id)
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : 'bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{completed.has(active.id) ? 'Completado' : 'Marcar Completado'}</span>
            </button>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-2xs"
            title={sidebarOpen ? "Ocultar temario" : "Mostrar temario"}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <ListChecks className="h-5 w-5 text-emerald-600" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-2xs"
            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5 text-indigo-600" />}
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════
          2. MAIN BODY (Clean Sidebar + White Stage)
      ══════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* ─── LEFT SIDEBAR (Clean White Accordion Menu) ─── */}
        <aside 
          className={`shrink-0 bg-white border-r border-slate-200/80 flex flex-col transition-all duration-300 z-20 ${
            sidebarOpen ? 'w-80 md:w-96' : 'w-0 overflow-hidden border-none'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Temario del Curso</h2>
              <p className="text-xs text-slate-600 font-medium mt-0.5">{completed.size} de {flatItems.length} lecciones completadas</p>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 shadow-2xs">
              {progressPercent}%
            </span>
          </div>

          {/* Module Sections List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
            {sections.map((s, secIdx) => {
              const secCompleted = s.items.filter(it => completed.has(it.id)).length;
              return (
                <div key={s.id} className="space-y-2">
                  <div className="px-2 py-1 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                      <span className="h-5 w-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-black">
                        {secIdx + 1}
                      </span>
                      {s.title}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {secCompleted}/{s.items.length}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {s.items.map((it) => {
                      const isActive = it.id === activeItemId;
                      const isDone = completed.has(it.id);

                      return (
                        <button
                          key={it.id}
                          onClick={() => {
                            setQuizResult(null);
                            setActiveItemId(it.id);
                            void persistProgress({ ...progress, lastItemId: it.id });
                          }}
                          className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                            isActive 
                              ? 'bg-emerald-50/80 border border-emerald-200/90 text-slate-900 shadow-sm font-bold' 
                              : 'bg-white hover:bg-slate-50 border border-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="shrink-0">
                            {isDone ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            ) : it.type === 'video' ? (
                              <PlayCircle className={`h-5 w-5 ${isActive ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
                            ) : it.type === 'quiz' ? (
                              <HelpCircle className={`h-5 w-5 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
                            ) : (
                              <FileText className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold truncate leading-tight">{it.title}</p>
                            <span className="text-[10px] text-slate-500 font-medium capitalize mt-0.5 block">
                              {it.type === 'video' ? 'Video instructivo' : it.type === 'html' ? 'Lectura guiada' : 'Evaluación'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ─── STAGE VIEWER AREA (Clean Bright Display) ─── */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-slate-50/60 relative">

          {/* Hipnosis Ericksoniana Navigation Bar */}
          {slug === 'hipnosis-ericksoniana' && (
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200/80 px-4 py-2 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shadow-2xs">
              {[
                { id: 'lessons', label: '📖 Lecciones' },
                { id: 'laboratorio', label: '🧪 Laboratorio' },
                { id: 'analizador', label: '💬 Analizador' },
                { id: 'metaphor', label: '📖 Metáforas' },
                { id: 'session', label: '🛠️ Sesión' },
                { id: 'cases', label: '🎯 Casos' },
                { id: 'biblioteca', label: '📚 Biblioteca' },
                { id: 'ethics', label: '🛡️ Ética' },
                { id: 'certificate', label: '📜 Certificado' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* TCC Navigation Bar */}
          {slug === 'terapia-cognitivo-conductual' && (
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200/80 px-4 py-2 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shadow-2xs">
              {[
                { id: 'lessons', label: '📖 Lecciones' },
                { id: 'laboratorio', label: '🧪 Laboratorio TCC' },
                { id: 'registro', label: '📝 Registro Cognitivo' },
                { id: 'abc', label: '🔄 Analizador ABC' },
                { id: 'distorsiones', label: '🔍 Distorsiones' },
                { id: 'problemas', label: '🎯 Resolución Problemas' },
                { id: 'casos', label: '📖 Casos' },
                { id: 'glosario', label: '📚 Glosario' },
                { id: 'biblioteca', label: '📁 Biblioteca' },
                { id: 'etica', label: '🛡️ Ética' },
                { id: 'certificate', label: '📜 Certificado' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-teal-600 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* TCC Dedicated Views */}
          {slug === 'terapia-cognitivo-conductual' && activeTab === 'laboratorio' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <TCCLaboratorio />
            </div>
          )}

          {slug === 'terapia-cognitivo-conductual' && activeTab === 'registro' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <TCCRegistroCognitivo />
            </div>
          )}

          {slug === 'terapia-cognitivo-conductual' && activeTab === 'abc' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <TCCAnalizadorABC />
            </div>
          )}

          {slug === 'terapia-cognitivo-conductual' && activeTab === 'distorsiones' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <TCCDistorsionesIdentificador />
            </div>
          )}

          {slug === 'terapia-cognitivo-conductual' && activeTab === 'problemas' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <TCCResolucionProblemas />
            </div>
          )}

          {slug === 'terapia-cognitivo-conductual' && activeTab === 'casos' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <TCCCasosEstudio />
            </div>
          )}

          {slug === 'terapia-cognitivo-conductual' && activeTab === 'glosario' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <TCCGlosario />
            </div>
          )}

          {slug === 'terapia-cognitivo-conductual' && activeTab === 'biblioteca' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <TCCBiblioteca />
            </div>
          )}

          {slug === 'terapia-cognitivo-conductual' && activeTab === 'etica' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <TCCEticaNotice />
            </div>
          )}

          {slug === 'terapia-cognitivo-conductual' && activeTab === 'certificate' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <TCCCertificate studentName={userName} />
            </div>
          )}

          {/* Desarrollo Personal Navigation Bar */}
          {slug === 'desarrollo-personal' && (
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200/80 px-4 py-2 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shadow-2xs">
              {[
                { id: 'lessons', label: '📖 Lecciones' },
                { id: 'laboratorio', label: '🧪 Laboratorio' },
                { id: 'mapa', label: '🧭 Mapa Personal' },
                { id: 'brujula', label: '🎯 Brújula Valores' },
                { id: 'objetivos', label: '🏆 Metas SMART' },
                { id: 'habitos', label: '🔥 Hábitos' },
                { id: 'diario', label: '📝 Mi Diario' },
                { id: 'retos', label: '⚡ Retos 7 Días' },
                { id: 'casos', label: '📖 Casos' },
                { id: 'glosario', label: '📚 Glosario' },
                { id: 'biblioteca', label: '📁 Biblioteca' },
                { id: 'etica', label: '🛡️ Ética' },
                { id: 'certificate', label: '📜 Certificado' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Desarrollo Personal Dedicated Views */}
          {slug === 'desarrollo-personal' && activeTab === 'laboratorio' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <DPLaboratorio />
            </div>
          )}

          {slug === 'desarrollo-personal' && activeTab === 'mapa' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <DPMapaPersonal />
            </div>
          )}

          {slug === 'desarrollo-personal' && activeTab === 'brujula' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <DPBrujulaValores />
            </div>
          )}

          {slug === 'desarrollo-personal' && activeTab === 'objetivos' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <DPConstructorObjetivos />
            </div>
          )}

          {slug === 'desarrollo-personal' && activeTab === 'habitos' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <DPSeguimientoHabitos />
            </div>
          )}

          {slug === 'desarrollo-personal' && activeTab === 'diario' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <DPDiarioEmocional />
            </div>
          )}

          {slug === 'desarrollo-personal' && activeTab === 'retos' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <DPRetosCrecimiento />
            </div>
          )}

          {slug === 'desarrollo-personal' && activeTab === 'casos' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <DPCasosEstudio />
            </div>
          )}

          {slug === 'desarrollo-personal' && activeTab === 'glosario' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <DPGlosario />
            </div>
          )}

          {slug === 'desarrollo-personal' && activeTab === 'biblioteca' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <DPBiblioteca />
            </div>
          )}

          {slug === 'desarrollo-personal' && activeTab === 'etica' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <DPEticaNotice />
            </div>
          )}

          {slug === 'desarrollo-personal' && activeTab === 'certificate' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <DPCertificate studentName={userName} />
            </div>
          )}

          {/* Inteligencia Emocional Navigation Bar */}
          {slug === 'inteligencia-emocional' && (
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200/80 px-4 py-2 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shadow-2xs">
              {[
                { id: 'lessons', label: '📖 Lecciones' },
                { id: 'laboratorio', label: '🧪 Laboratorio' },
                { id: 'mapa', label: '🗺️ Mapa Emocional' },
                { id: 'rueda', label: '🎡 Rueda Emocional' },
                { id: 'pausa', label: '🧘 Pausa Consciente' },
                { id: 'comunicacion', label: '💬 Asertividad' },
                { id: 'autoevaluacion', label: '📊 Autoevaluación' },
                { id: 'diario', label: '📔 Mi Diario' },
                { id: 'retos', label: '⚡ Retos 7 Días' },
                { id: 'casos', label: '🎯 Casos' },
                { id: 'glosario', label: '📚 Glosario' },
                { id: 'biblioteca', label: '📁 Biblioteca' },
                { id: 'etica', label: '🛡️ Ética' },
                { id: 'certificate', label: '📜 Certificado' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-teal-600 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Inteligencia Emocional Dedicated Views */}
          {slug === 'inteligencia-emocional' && activeTab === 'laboratorio' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <IELaboratorio />
            </div>
          )}

          {slug === 'inteligencia-emocional' && activeTab === 'mapa' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <IEMapaEmocional />
            </div>
          )}

          {slug === 'inteligencia-emocional' && activeTab === 'rueda' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <IERuedaEmocional />
            </div>
          )}

          {slug === 'inteligencia-emocional' && activeTab === 'pausa' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <IEPausaConsciente />
            </div>
          )}

          {slug === 'inteligencia-emocional' && activeTab === 'comunicacion' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <IEConstructorComunicacion />
            </div>
          )}

          {slug === 'inteligencia-emocional' && activeTab === 'autoevaluacion' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <IEAutoevaluacion />
            </div>
          )}

          {slug === 'inteligencia-emocional' && activeTab === 'diario' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <IEDiarioEmocional />
            </div>
          )}

          {slug === 'inteligencia-emocional' && activeTab === 'retos' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <IERetosEmocionales />
            </div>
          )}

          {slug === 'inteligencia-emocional' && activeTab === 'casos' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <IECasosEstudio />
            </div>
          )}

          {slug === 'inteligencia-emocional' && activeTab === 'glosario' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <IEGlosario />
            </div>
          )}

          {slug === 'inteligencia-emocional' && activeTab === 'biblioteca' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <IEBiblioteca />
            </div>
          )}

          {slug === 'inteligencia-emocional' && activeTab === 'etica' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <IEEticaNotice />
            </div>
          )}

          {slug === 'inteligencia-emocional' && activeTab === 'certificate' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <IECertificate studentName={userName} />
            </div>
          )}

          {/* Autoconocimiento Navigation Bar */}
          {slug === 'autoconocimiento' && (
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200/80 px-4 py-2 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shadow-2xs">
              {[
                { id: 'lessons', label: '📖 Lecciones' },
                { id: 'laboratorio', label: '🧪 Laboratorio' },
                { id: 'identidad', label: '🪞 Mapa de Identidad' },
                { id: 'valores', label: '🧭 Brújula de Valores' },
                { id: 'fortalezas', label: '💎 Fortalezas' },
                { id: 'pensamientos', label: '👁️ Observador' },
                { id: 'timeline', label: '⏳ Línea de Vida' },
                { id: 'relaciones', label: '🤝 Relaciones' },
                { id: 'patrones', label: '🔄 Patrones' },
                { id: 'autoevaluacion', label: '📊 Autoevaluación' },
                { id: 'diario', label: '📔 Mi Diario' },
                { id: 'retos', label: '⚡ Retos 7 Días' },
                { id: 'casos', label: '🎯 Casos' },
                { id: 'glosario', label: '📚 Glosario' },
                { id: 'biblioteca', label: '📁 Biblioteca' },
                { id: 'etica', label: '🛡️ Ética' },
                { id: 'certificate', label: '📜 Certificado' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Mediación y Atención Plena Navigation Bar */}
          {slug === 'mediacion-atencion-plena' && (
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200/80 px-4 py-2 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shadow-2xs">
              {[
                { id: 'lessons', label: '📖 Lecciones' },
                { id: 'practicas', label: '🧘 Prácticas de Mediación' },
                { id: 'diario', label: '📔 Mi Diario' },
                { id: 'laboratorio', label: '🧪 Laboratorio' },
                { id: 'reto', label: '⚡ Reto 21 Días' },
                { id: 'observador', label: '👁️ Observador Pensamiento' },
                { id: 'simultaneidad', label: '⚖️ Interno + Externo' },
                { id: 'mapa', label: '🗺️ Mapa Mediación' },
                { id: 'casos', label: '🎯 Casos' },
                { id: 'autoevaluacion', label: '📊 Autoevaluación' },
                { id: 'glosario', label: '📚 Glosario' },
                { id: 'biblioteca', label: '📁 Biblioteca' },
                { id: 'etica', label: '🛡️ Ética' },
                { id: 'certificate', label: '📜 Certificado' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-teal-600 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Autoconocimiento Dedicated Views */}
          {slug === 'autoconocimiento' && activeTab === 'laboratorio' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <ACLaboratorio />
            </div>
          )}

          {slug === 'autoconocimiento' && activeTab === 'identidad' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <ACMapaIdentidad />
            </div>
          )}

          {slug === 'autoconocimiento' && activeTab === 'valores' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <ACBrujulaValores />
            </div>
          )}

          {slug === 'autoconocimiento' && activeTab === 'fortalezas' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <ACInventarioFortalezas />
            </div>
          )}

          {slug === 'autoconocimiento' && activeTab === 'pensamientos' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <ACObservadorPensamientos />
            </div>
          )}

          {slug === 'autoconocimiento' && activeTab === 'timeline' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <ACLineaDeVida />
            </div>
          )}

          {slug === 'autoconocimiento' && activeTab === 'relaciones' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <ACMapaRelaciones />
            </div>
          )}

          {slug === 'autoconocimiento' && activeTab === 'patrones' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <ACDetectorPatrones />
            </div>
          )}

          {slug === 'autoconocimiento' && activeTab === 'autoevaluacion' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <ACAutoevaluacion />
            </div>
          )}

          {slug === 'autoconocimiento' && activeTab === 'diario' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <ACDiario />
            </div>
          )}

          {slug === 'autoconocimiento' && activeTab === 'retos' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <ACRetos />
            </div>
          )}

          {slug === 'autoconocimiento' && activeTab === 'casos' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <ACCasosEstudio />
            </div>
          )}

          {slug === 'autoconocimiento' && activeTab === 'glosario' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <ACGlosario />
            </div>
          )}

          {slug === 'autoconocimiento' && activeTab === 'biblioteca' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <ACBiblioteca />
            </div>
          )}

          {slug === 'autoconocimiento' && activeTab === 'etica' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <ACEticaNotice />
            </div>
          )}

          {slug === 'autoconocimiento' && activeTab === 'certificate' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <ACCertificate studentName={userName} />
            </div>
          )}

          {/* Mediación y Atención Plena Dedicated Views */}
          {slug === 'mediacion-atencion-plena' && activeTab === 'practicas' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <MAPPracticasMediacion />
            </div>
          )}

          {slug === 'mediacion-atencion-plena' && activeTab === 'diario' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <MAPDiarioMediacion />
            </div>
          )}

          {slug === 'mediacion-atencion-plena' && activeTab === 'laboratorio' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <MAPLaboratorio />
            </div>
          )}

          {slug === 'mediacion-atencion-plena' && activeTab === 'reto' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <MAPReto21Dias />
            </div>
          )}

          {slug === 'mediacion-atencion-plena' && activeTab === 'observador' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <MAPObservadorPensamiento />
            </div>
          )}

          {slug === 'mediacion-atencion-plena' && activeTab === 'simultaneidad' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <MAPInternoExterno />
            </div>
          )}

          {slug === 'mediacion-atencion-plena' && activeTab === 'mapa' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <MAPMapaMediacion />
            </div>
          )}

          {slug === 'mediacion-atencion-plena' && activeTab === 'casos' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <MAPCasosEstudio />
            </div>
          )}

          {slug === 'mediacion-atencion-plena' && activeTab === 'autoevaluacion' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <MAPAutoevaluacion />
            </div>
          )}

          {slug === 'mediacion-atencion-plena' && activeTab === 'glosario' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <MAPGlosario />
            </div>
          )}

          {slug === 'mediacion-atencion-plena' && activeTab === 'biblioteca' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <MAPBiblioteca />
            </div>
          )}

          {slug === 'mediacion-atencion-plena' && activeTab === 'etica' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <MAPEticaNotice />
            </div>
          )}

          {slug === 'mediacion-atencion-plena' && activeTab === 'certificate' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <MAPCertificate studentName={userName} />
            </div>
          )}

          {/* Hipnosis Ericksoniana Dedicated Views */}
          {slug === 'hipnosis-ericksoniana' && activeTab === 'laboratorio' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <EricksonianaLaboratorio />
            </div>
          )}

          {slug === 'hipnosis-ericksoniana' && activeTab === 'analizador' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <EricksonianaAnalizador />
            </div>
          )}

          {slug === 'hipnosis-ericksoniana' && activeTab === 'metaphor' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <EricksonianaMetaphorBuilder />
            </div>
          )}

          {slug === 'hipnosis-ericksoniana' && activeTab === 'session' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <EricksonianaSessionBuilder />
            </div>
          )}

          {slug === 'hipnosis-ericksoniana' && activeTab === 'cases' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <EricksonianaCaseStudies />
            </div>
          )}

          {slug === 'hipnosis-ericksoniana' && activeTab === 'biblioteca' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <EricksonianaBiblioteca />
            </div>
          )}

          {slug === 'hipnosis-ericksoniana' && activeTab === 'ethics' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <EricksonianaEthicsNotice />
            </div>
          )}

          {slug === 'hipnosis-ericksoniana' && activeTab === 'certificate' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <EricksonianaCertificate studentName={userName} />
            </div>
          )}
          
          {/* Autohipnosis Dedicated Views */}
          {slug === 'autohipnosis' && activeTab === 'dashboard' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <AutohipnosisDashboard
                progressPercent={progressPercent}
                completedLessonsCount={completed.size}
                totalLessonsCount={flatItems.length}
                streakDays={3}
                totalMinutes={45}
                onOpenGenerator={() => setGeneratorOpen(true)}
                onOpenAudios={() => setActiveTab('audios')}
                onOpenDiary={() => setActiveTab('diary')}
                onOpenCertificate={() => setActiveTab('certificate')}
              />
            </div>
          )}

          {slug === 'autohipnosis' && activeTab === 'audios' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <AutohipnosisAudioPlayer />
            </div>
          )}

          {slug === 'autohipnosis' && activeTab === 'diary' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <AutohipnosisDiary />
            </div>
          )}

          {slug === 'autohipnosis' && activeTab === 'certificate' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
              <AutohipnosisCertificate studentName={userName} />
            </div>
          )}

          {/* Default Lessons View */}
          {activeTab === 'lessons' && (
            active ? (
              <div className={`flex-1 flex flex-col p-4 md:p-8 w-full transition-all space-y-6 ${
                isFullscreen ? 'max-w-7xl mx-auto justify-center items-center' : 'max-w-5xl mx-auto'
              }`}>
              
              {/* Active Lesson Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 w-full">
                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-0.5 rounded-full inline-block">
                    {activeSection?.title || 'Contenido del Curso'}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">
                    {active.title}
                  </h2>
                </div>

                <button
                  onClick={() => void markCompleted(active.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                    completed.has(active.id)
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                      : 'bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{completed.has(active.id) ? 'Completado' : 'Marcar Completado'}</span>
                </button>
              </div>

              {/* ─── TYPE 1: VIDEO PLAYER ─── */}
              {active.type === 'video' && active.mediaUrl && (
                <div className="space-y-4 animate-in fade-in duration-300 w-full flex-1 flex flex-col justify-center">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/40 bg-slate-950 p-0.5 group w-full">
                    {/* Top Verdoso Light Bar */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-500 z-40 opacity-90 shadow-[0_0_12px_rgba(16,185,129,0.9)]" />

                    <CustomVideoPlayer
                      src={active.mediaUrl}
                      initialTime={progress.videoSecondsByItemId?.[active.id] || 0}
                      onTimeUpdate={(currentTime) => {
                        const seconds = Math.floor(currentTime || 0);
                        const next = {
                          ...progress,
                          lastItemId: active.id,
                          videoSecondsByItemId: { ...(progress.videoSecondsByItemId || {}), [active.id]: seconds }
                        };
                        void persistProgress(next);
                      }}
                      onEnded={() => void markCompleted(active.id)}
                      className="rounded-2xl"
                    />
                  </div>

                  {/* Lesson info card below video */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50/60 via-white to-teal-50/40 border border-emerald-200/80 rounded-2xl px-5 py-3.5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 flex items-center justify-center shrink-0 shadow-md text-white">
                        <PlayCircle className="h-5 w-5 fill-white/20 text-white" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm font-black text-slate-800">{active.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/90 border border-emerald-200 px-2 py-0.5 rounded-full">
                            🌱 Conexión Verdosa
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">Lección {activeIndex + 1} de {flatItems.length}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => void markCompleted(active.id)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                        completed.has(active.id)
                          ? 'bg-emerald-100 border border-emerald-300 text-emerald-800'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/20'
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{completed.has(active.id) ? '✓ Completado' : 'Marcar visto'}</span>
                    </button>
                  </div>
                </div>
              )}


              {/* ─── TYPE 2: HTML LESSON CONTENT ─── */}
              {active.type === 'html' && (
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 animate-in fade-in duration-300">
                  <div 
                    dangerouslySetInnerHTML={{ __html: active.html || '<p>Sin contenido.</p>' }} 
                    className="prose prose-slate max-w-none prose-headings:font-black prose-a:text-indigo-600"
                  />
                  
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => void markCompleted(active.id)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Completar y Continuar</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ─── TYPE 3: EVALUACIÓN / QUIZ ─── */}
              {active.type === 'quiz' && (
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 animate-in fade-in duration-300">
                  
                  <div className="border-b border-slate-100 pb-4 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                      EVALUACIÓN DE CONOCIMIENTOS DE RESPUESTA ÚNICA
                    </span>
                    <h3 className="text-xl font-black text-slate-900">Responde las preguntas de selección única (A, B, C, D)</h3>
                  </div>

                  <div className="space-y-6">
                    {(active.quiz?.questions || []).map((q, idx) => (
                      <div key={q.id} className="space-y-3 p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                        <div className="font-bold text-sm text-slate-900 flex items-start gap-2">
                          <span className="h-6 w-6 rounded-lg bg-indigo-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span>{q.prompt}</span>
                        </div>

                        {/* Multiple Choice / Single Choice (A, B, C, D) */}
                        {q.type === 'multiple' && (
                          <div className="space-y-2 pt-1">
                            {(q.choices || []).map((c) => {
                              const selectedVal = quizAnswers[q.id];
                              const isChecked = Array.isArray(selectedVal)
                                ? selectedVal.includes(c.id)
                                : selectedVal === c.id;
                              return (
                                <label 
                                  key={c.id} 
                                  className={`flex items-center gap-3 rounded-xl border p-3.5 transition-all cursor-pointer ${
                                    isChecked 
                                      ? 'bg-emerald-50 border-emerald-300 text-slate-900 font-bold shadow-2xs' 
                                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`question-${q.id}`}
                                    checked={isChecked}
                                    onChange={() => {
                                      setQuizAnswers((p) => ({ ...p, [q.id]: c.id }));
                                    }}
                                    className="h-4 w-4 accent-emerald-600 cursor-pointer shrink-0"
                                  />
                                  <span className="text-sm">{c.text}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {/* True / False */}
                        {q.type === 'truefalse' && (
                          <div className="flex gap-3 pt-1">
                            {[true, false].map((v) => {
                              const activeVal = quizAnswers[q.id] === v;
                              return (
                                <button
                                  key={String(v)}
                                  type="button"
                                  onClick={() => setQuizAnswers((p) => ({ ...p, [q.id]: v }))}
                                  className={`flex-1 rounded-xl border py-3 text-sm font-bold transition-all cursor-pointer ${
                                    activeVal 
                                      ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-2xs' 
                                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                  }`}
                                >
                                  {v ? '✓ Verdadero' : '✕ Falso'}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => void submitQuiz()}
                      className="w-full bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                      Enviar y Verificar Respuestas
                    </button>

                    {quizResult && (
                      <div className={`rounded-2xl border p-6 text-center space-y-2 animate-in fade-in duration-200 ${
                        quizResult.ok 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}>
                        <div className="text-xl font-black">
                          Resultado: {quizResult.score} / {quizResult.total}
                        </div>
                        <p className="text-sm font-medium">
                          {quizResult.ok ? '🎉 ¡Excelente trabajo! Has aprobado esta lección.' : 'Inténtalo de nuevo para consolidar tu conocimiento.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 text-slate-500 font-bold text-sm">
              Selecciona una lección del temario para comenzar.
            </div>
          ))}

          {/* ─── STICKY BOTTOM NAV BAR (Clean White Footer) ─── */}
          <footer className="h-16 shrink-0 bg-white border-t border-slate-200/80 px-4 md:px-8 flex items-center justify-between z-20 shadow-sm">
            <button
              onClick={() => {
                if (!prevId) return;
                setQuizResult(null);
                setActiveItemId(prevId);
                void persistProgress({ ...progress, lastItemId: prevId });
              }}
              disabled={!prevId}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer border border-slate-200/80"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Anterior</span>
            </button>

            {active && (
              <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                Lección {activeIndex + 1} de {flatItems.length}
              </span>
            )}

            <button
              onClick={() => {
                if (!nextId) return;
                setQuizResult(null);
                setActiveItemId(nextId);
                void persistProgress({ ...progress, lastItemId: nextId });
              }}
              disabled={!nextId}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <span>Siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </footer>

        </main>
      </div>

      {/* Autohipnosis Session Generator Modal */}
      <SessionGeneratorModal
        isOpen={generatorOpen}
        onClose={() => setGeneratorOpen(false)}
      />

    </div>
  );
}
