import React, { useState, useEffect, useRef } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { Dumbbell, Play, Pause, RotateCcw, CheckCircle2, ChevronRight, Wind, Brain, Heart, Zap, Moon, Timer, Lock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthPromptModal, isUserLoggedIn } from '@/components/AuthPromptModal';
import { LumiConfirmUnlockModal } from '@/components/LumiConfirmUnlockModal';
import { useToast } from '@/components/ui/use-toast';
import { api } from '../../api/client';

export type Exercise = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  duration: number; // seconds
  color: string;
  gradient: string;
  icon: React.ElementType;
  steps: { title: string; body: string; duration: number }[];
  benefits: string[];
};

export const EXERCISES: Exercise[] = [
  {
    id: 'respiracion-4-7-8',
    title: 'Respiración 4-7-8',
    subtitle: 'Técnica de relajación profunda',
    category: 'Respiración',
    duration: 120,
    color: '#6366f1',
    gradient: 'from-indigo-500 to-blue-600',
    icon: Wind,
    benefits: ['Reduce ansiedad', 'Mejora el sueño', 'Calma el sistema nervioso'],
    steps: [
      { title: 'Prepárate', body: 'Siéntate en una posición cómoda. Coloca la punta de tu lengua justo detrás de tus dientes superiores. Cierra los ojos y relaja tus hombros.', duration: 15 },
      { title: 'Inhala por 4 segundos', body: 'Inhala silenciosamente por la nariz contando mentalmente hasta 4. Siente cómo tu pecho y abdomen se expanden.', duration: 4 },
      { title: 'Retén por 7 segundos', body: 'Mantén el aire en tus pulmones contando hasta 7. No te tensiones — simplemente retén con calma.', duration: 7 },
      { title: 'Exhala por 8 segundos', body: 'Exhala completamente por la boca emitiendo un suave sonido "whoosh", contando hasta 8. Siente cómo sueltas la tensión.', duration: 8 },
      { title: 'Repite el ciclo', body: 'Este es un ciclo completo. Repite este patrón 3 veces más. Notarás cómo tu mente y cuerpo se relajan con cada ciclo.', duration: 15 },
    ],
  },
  {
    id: 'mindfulness-5',
    title: 'Mindfulness de 5 Sentidos',
    subtitle: 'Técnica de anclaje al presente',
    category: 'Mindfulness',
    duration: 180,
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-600',
    icon: Brain,
    benefits: ['Reduce el estrés', 'Mejora la concentración', 'Ancla al momento presente'],
    steps: [
      { title: '5 cosas que VES', body: 'Mira a tu alrededor y nombra mentalmente 5 cosas que puedes ver ahora mismo. Observa los detalles: colores, texturas, formas.', duration: 30 },
      { title: '4 cosas que TOCAS', body: 'Siente 4 cosas que puedes tocar en este momento. Puede ser tu ropa, la silla, el suelo bajo tus pies. Presta atención a cada textura.', duration: 30 },
      { title: '3 cosas que OYES', body: 'Cierra los ojos un momento y escucha 3 sonidos a tu alrededor. El viento, el tráfico lejano, tu propia respiración.', duration: 30 },
      { title: '2 cosas que HUELES', body: 'Identifica 2 olores en tu entorno. Si no los hay, recuerda tu aroma favorito (café, lluvia, flores).', duration: 30 },
      { title: '1 cosa que SABOREAS', body: 'Toma conciencia de 1 sabor en tu boca. O simplemente sonríe suavemente observando cómo se siente tu rostro.', duration: 30 },
    ],
  },
  {
    id: 'pmr-progreso',
    title: 'Relajación Muscular Progresiva',
    subtitle: 'Tensión y liberación corporal',
    category: 'Corporal',
    duration: 240,
    color: '#059669',
    gradient: 'from-teal-500 to-emerald-600',
    icon: Zap,
    benefits: ['Libera tensión muscular', 'Reduce dolor por estrés', 'Conexión mente-cuerpo'],
    steps: [
      { title: 'Pies y Pantorrillas', body: 'Tensa fuertemente los músculos de tus pies y pantorrillas durante 5 segundos. Luego suelta de golpe y siente el calor de la relajación por 15 segundos.', duration: 20 },
      { title: 'Muslos y Glúteos', body: 'Aprieta tus muslos y glúteos firmemente. Siente la tensión acumulada... 1, 2, 3, 4, 5. Suelta completamente y respira hondo.', duration: 20 },
      { title: 'Abdomen y Pecho', body: 'Tensa tu abdomen como si fueras a recibir un impacto. Mantén... y libera. Siente la libertad en cada exhalación.', duration: 20 },
      { title: 'Hombros y Cuello', body: 'Lleva tus hombros hacia arriba intentando tocar tus orejas. Tensa... y déjalos caer suavemente. Siente el peso liberado.', duration: 20 },
      { title: 'Rostro y Mandíbula', body: 'Aprieta suavemente tu mandíbula y arruga la frente. Mantén 5 segundos... y relaja totalmente la cara. Sonríe suavemente.', duration: 20 },
    ],
  },
  {
    id: 'visualizacion-lugar-seguro',
    title: 'Visualización: Tu Lugar Seguro',
    subtitle: 'Viaje guiado a la tranquilidad',
    category: 'Visualización',
    duration: 180,
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-indigo-600',
    icon: Moon,
    benefits: ['Paz interior', 'Induce la calma', 'Estimula la creatividad'],
    steps: [
      { title: 'Cierra los ojos', body: 'Toma tres respiraciones lentas y profundas. Deja que tus párpados se sientan pesados y cómodos.', duration: 20 },
      { title: 'Imagina tu santuario', body: 'Visualiza un lugar donde te sientas 100% a salvo y en paz. Puede ser una playa al atardecer, un bosque sereno o una habitación acogedora.', duration: 40 },
      { title: 'Siente los detalles', body: 'Observa la luz suave, escucha los sonidos tranquilizadores, siente la temperatura perfecta en tu piel. Este espacio es solo tuyo.', duration: 40 },
      { title: 'Ancla la sensación', body: 'Siente esa paz llenando cada célula de tu cuerpo. Sabe que puedes volver a este lugar mental siempre que lo necesites.', duration: 40 },
      { title: 'Regresa despacio', body: 'Empieza a mover suavemente tus dedos. Toma una respiración profunda y abre los ojos cuando estés listo/a.', duration: 20 },
    ],
  },
  {
    id: 'compasion-emocional',
    title: 'Autocompasión y Aceptación',
    subtitle: 'Abrazo consciente a tus emociones',
    category: 'Emocional',
    duration: 150,
    color: '#d97706',
    gradient: 'from-amber-500 to-orange-600',
    icon: Heart,
    benefits: ['Reduce la autocrítica', 'Fomenta la paz mental', 'Sanación emocional'],
    steps: [
      { title: 'Mano en el pecho', body: 'Coloca una o ambas manos sobre tu corazón. Siente el calor de tu palma y el latido constante de tu vida.', duration: 20 },
      { title: 'Reconoce el momento', body: 'Dite en voz baja o mentalmente: "Este es un momento de dificultad o malestar. Sentirse así es parte de ser humano".', duration: 30 },
      { title: 'Frase de bondad', body: 'Repite suavemente: "Que yo pueda darme la compasión que necesito. Que pueda ser amable conmigo mismo/a hoy".', duration: 40 },
      { title: 'Respiración de afecto', body: 'Inhala sintiendo que te cuidas a ti mismo/a; exhala soltando la exigencia y el juicio. Permítete descansar.', duration: 40 },
    ],
  },
];

export function getCategoryMeta(category: string) {
  const c = (category || '').toLowerCase();
  if (c.includes('respiraci')) {
    return {
      badge: 'bg-teal-50 text-teal-700 border-teal-100',
      iconBg: 'bg-teal-50 text-teal-600 border-teal-100',
      bar: 'bg-teal-600',
      btn: 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20',
      color: '#0d9488',
    };
  }
  if (c.includes('mindful')) {
    return {
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      bar: 'bg-indigo-600',
      btn: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20',
      color: '#4f46e5',
    };
  }
  if (c.includes('corporal')) {
    return {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      bar: 'bg-emerald-600',
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
      color: '#059669',
    };
  }
  if (c.includes('visualiza')) {
    return {
      badge: 'bg-purple-50 text-purple-700 border-purple-100',
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      bar: 'bg-purple-600',
      btn: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20',
      color: '#7c3aed',
    };
  }
  if (c.includes('emocional')) {
    return {
      badge: 'bg-amber-50 text-amber-700 border-amber-100',
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      bar: 'bg-amber-600',
      btn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
      color: '#d97706',
    };
  }
  return {
    badge: 'bg-blue-50 text-blue-700 border-blue-100',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
    bar: 'bg-blue-600',
    btn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20',
    color: '#2563eb',
  };
}

function ExerciseCard({ ex, isLocked, isUnlocked, onStart }: { ex: Exercise; isLocked?: boolean; isUnlocked?: boolean; onStart: () => void }) {
  const Icon = ex.icon;
  const meta = getCategoryMeta(ex.category);

  return (
    <div 
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between cursor-pointer"
      onClick={onStart}
    >
      <div className={cn('h-1.5 w-full', meta.bar)} />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('h-12 w-12 rounded-xl border flex items-center justify-center shrink-0', meta.iconBg)}>
            <Icon className="h-6 w-6" />
          </div>
          {isUnlocked ? (
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 🔓 Desbloqueado
            </span>
          ) : isLocked ? (
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-indigo-600" /> Requiere Registro
            </span>
          ) : (
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" /> ✨ 30 Lumis
            </span>
          )}
        </div>

        <h3 className="font-black text-slate-900 text-lg leading-tight">{ex.title}</h3>
        <p className="text-xs font-medium text-slate-500 mt-0.5 mb-3">{ex.subtitle}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {ex.benefits.map(b => (
            <span key={b} className="text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200/60 rounded-full px-2.5 py-0.5">
              {b}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-semibold">⏱ {Math.floor(ex.duration / 60)} min · {ex.steps.length} pasos</span>
          {isUnlocked ? (
            <button
              className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all duration-200 group-hover:scale-105"
            >
              <Play className="h-3.5 w-3.5 fill-white" /> Iniciar
            </button>
          ) : isLocked ? (
            <button
              className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl bg-slate-900 text-white shadow-md transition-all duration-200 group-hover:scale-105"
            >
              <Lock className="h-3.5 w-3.5" /> Registrate
            </button>
          ) : (
            <button
              className={cn('flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 shadow-md', meta.btn)}
            >
              <Play className="h-3.5 w-3.5 fill-white" /> Iniciar (✨ 30 Lumis)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const playChimeSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.6);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  } catch (e) {
  }
};

export function ActiveExercise({ ex, onClose }: { ex: Exercise; onClose: () => void }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ex.steps[0].duration);
  const [running, setRunning] = useState(true);
  const [done, setDone] = useState(false);
  const meta = getCategoryMeta(ex.category);

  const step = ex.steps[stepIdx];

  useEffect(() => {
    if (!running || done) return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          playChimeSound();
          if (stepIdx < ex.steps.length - 1) {
            const nextIdx = stepIdx + 1;
            setStepIdx(nextIdx);
            return ex.steps[nextIdx].duration;
          } else {
            setDone(true);
            setRunning(false);
            return 0;
          }
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running, done, stepIdx, ex.steps]);

  const toggleRun = () => setRunning(r => !r);

  const reset = () => {
    setRunning(false);
    setStepIdx(0);
    setTimeLeft(ex.steps[0].duration);
    setDone(false);
  };

  const prevStep = () => {
    if (stepIdx > 0) {
      const pIdx = stepIdx - 1;
      setStepIdx(pIdx);
      setTimeLeft(ex.steps[pIdx].duration);
    }
  };

  const nextStep = () => {
    if (stepIdx < ex.steps.length - 1) {
      const nIdx = stepIdx + 1;
      setStepIdx(nIdx);
      setTimeLeft(ex.steps[nIdx].duration);
    } else {
      setDone(true);
      setRunning(false);
    }
  };

  const progress = ((step.duration - timeLeft) / step.duration) * 100;
  const totalProgress = ((stepIdx + (step.duration - timeLeft) / step.duration) / ex.steps.length) * 100;

  if (done) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-in zoom-in-95 duration-300 space-y-4 border border-slate-100">
          <div className="h-16 w-16 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">¡Práctica Completada!</h3>
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            Has regalado a tu mente y cuerpo un valioso espacio de autorregulación. Observa cómo te sientes ahora.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            Volver a los ejercicios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
        {/* Header */}
        <div className="bg-white border-b border-slate-100 p-6 text-slate-800 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={cn('text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border', meta.badge)}>
                {ex.category}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {running ? 'En curso automático' : 'Pausado'}
              </span>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-xs font-bold text-slate-600 cursor-pointer">
              ✕
            </button>
          </div>
          <h2 className="text-xl font-black text-slate-900 leading-tight">{ex.title}</h2>
          <p className="text-slate-500 text-xs font-medium">{ex.subtitle}</p>

          {/* Overall progress bar */}
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-4">
            <div className={cn('h-full transition-all duration-1000', meta.bar)} style={{ width: `${totalProgress}%` }} />
          </div>
          {/* Steps dots */}
          <div className="flex gap-1.5 mt-2">
            {ex.steps.map((_, i) => (
              <div key={i} className={cn('h-1.5 flex-1 rounded-full transition-all duration-300', i <= stepIdx ? meta.bar : 'bg-slate-200')} />
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Paso {stepIdx + 1} de {ex.steps.length}</span>
            <span className="text-xs font-semibold text-slate-400">Avance automático</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-2">{step.title}</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">{step.body}</p>

          {/* Timer circle */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative h-28 w-28">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" strokeLinecap="round"
                  stroke={meta.color}
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900">{timeLeft}</span>
                <span className="text-[10px] text-slate-400 font-bold">seg</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={reset} title="Reiniciar" className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
              <RotateCcw className="h-4 w-4" />
            </button>
            
            {stepIdx > 0 && (
              <button onClick={prevStep} title="Paso anterior" className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
                ‹
              </button>
            )}

            <button
              onClick={toggleRun}
              className={cn('flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02] shadow-lg cursor-pointer', meta.btn)}
            >
              {running ? <><Pause className="h-4 w-4" /> Pausar</> : <><Play className="h-4 w-4 fill-white" /> Reanudar</>}
            </button>

            <button onClick={nextStep} title="Siguiente paso" className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CATEGORIES = ['Todos', 'Respiración', 'Mindfulness', 'Corporal', 'Visualización', 'Emocional'];

const getIconForCategory = (cat: string) => {
  const c = cat.toLowerCase();
  if (c.includes('respiraci')) return Wind;
  if (c.includes('mindful')) return Brain;
  if (c.includes('corporal')) return Zap;
  if (c.includes('visualiza')) return Moon;
  if (c.includes('emocional')) return Heart;
  return Timer;
};

const getExercisePurchaseKey = (idOrTitle: string) => `conexionluz:unlocked_exercise:${idOrTitle.toLowerCase().trim()}`;

export default function EjerciciosGuiadosPage() {
  const { toast } = useToast();
  const [active, setActive] = useState<Exercise | null>(null);
  const [cat, setCat] = useState('Todos');
  const [exercisesList, setExercisesList] = useState<Exercise[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [lockedTitle, setLockedTitle] = useState('');
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [unlockedTitlesList, setUnlockedTitlesList] = useState<string[]>([]);
  const [userBalance, setUserBalance] = useState<number>(150);
  const [pendingUnlock, setPendingUnlock] = useState<Exercise | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const isLoggedIn = isUserLoggedIn();

  const fetchWalletAndUnlocked = async () => {
    if (!isLoggedIn) return;

    const unlockedSet = new Set<string>();
    const titlesList: string[] = [];

    // 1. Initialize from localStorage
    EXERCISES.forEach(ex => {
      const exId = String(ex.id).toLowerCase().trim();
      const exTitle = ex.title.toLowerCase().trim();
      if (
        localStorage.getItem(getExercisePurchaseKey(exId)) === '1' ||
        localStorage.getItem(getExercisePurchaseKey(exTitle)) === '1' ||
        localStorage.getItem(`conexionluz:purchased:${exId}`) === '1' ||
        localStorage.getItem(`conexionluz:purchased:${exTitle}`) === '1'
      ) {
        unlockedSet.add(exId);
        unlockedSet.add(exTitle);
        titlesList.push(exTitle);
      }
    });

    // 2. Fetch from backend API
    const res = await api.get<any>('/api/portal/lumi/wallet/');
    if (res.ok && res.data) {
      const payload = res.data.data || res.data;
      if (typeof payload.balance === 'number') {
        setUserBalance(payload.balance);
      }

      const items = Array.isArray(payload.unlockedItems) ? payload.unlockedItems : [];
      items.forEach((u: any) => {
        if (u.itemId) {
          const uId = String(u.itemId).toLowerCase().trim();
          unlockedSet.add(uId);
          if (typeof window !== 'undefined') localStorage.setItem(getExercisePurchaseKey(uId), '1');
        }
        if (u.itemTitle) {
          const rawTitle = String(u.itemTitle).toLowerCase().trim();
          unlockedSet.add(rawTitle);
          titlesList.push(rawTitle);

          // Strip "Ejercicio Guiado: " or similar prefix
          const cleanTitle = rawTitle.replace(/^ejercicio guiado:\s*/i, '').trim();
          unlockedSet.add(cleanTitle);
          titlesList.push(cleanTitle);
          if (typeof window !== 'undefined') localStorage.setItem(getExercisePurchaseKey(cleanTitle), '1');
        }
      });
    }

    setUnlockedIds(unlockedSet);
    setUnlockedTitlesList(titlesList);
  };

  useEffect(() => {
    void fetchWalletAndUnlocked();
    const loadExercises = async () => {
      const res = await api.get<any[]>('/api/portal/guided-exercises/');
      if (res.ok && res.data && res.data.length > 0) {
        const mapped: Exercise[] = res.data.map(item => ({
          id: String(item.id),
          title: item.title,
          subtitle: item.subtitle,
          category: item.category,
          duration: item.steps?.reduce((acc: number, s: any) => acc + (s.duration || 0), 0) || 120,
          color: item.color,
          gradient: item.gradient,
          icon: getIconForCategory(item.category),
          benefits: item.benefits || [],
          steps: item.steps || []
        }));
        setExercisesList(mapped);
      } else {
        setExercisesList(EXERCISES);
      }
    };
    loadExercises();
  }, []);

  const filtered = cat === 'Todos' ? exercisesList : exercisesList.filter(e => e.category === cat);

  const isExUnlocked = (ex: Exercise): boolean => {
    const exId = String(ex.id).toLowerCase().trim();
    const exTitle = String(ex.title).toLowerCase().trim();

    // Direct match in set or localStorage
    if (unlockedIds.has(exId) || unlockedIds.has(exTitle)) return true;
    if (typeof window !== 'undefined') {
      if (localStorage.getItem(getExercisePurchaseKey(exId)) === '1') return true;
      if (localStorage.getItem(getExercisePurchaseKey(exTitle)) === '1') return true;
    }

    // Substring / fuzzy match against any title in titlesList
    return unlockedTitlesList.some(t => t.includes(exTitle) || exTitle.includes(t) || t.includes(exId));
  };

  const handleStartExerciseClick = (ex: Exercise) => {
    if (!isLoggedIn) {
      setLockedTitle(`el ejercicio "${ex.title}"`);
      setShowAuthModal(true);
      return;
    }

    if (isExUnlocked(ex)) {
      setActive(ex);
      return;
    }

    setPendingUnlock(ex);
  };

  const handleConfirmUnlock = async () => {
    if (!pendingUnlock) return;
    setUnlocking(true);

    const res = await api.post<any>('/api/portal/lumi/spend/', {
      itemType: 'exercise',
      itemId: pendingUnlock.id,
      lumiAmount: 30,
      description: `Ejercicio Guiado: ${pendingUnlock.title}`
    });

    if (res.ok && res.data) {
      const payload = res.data.data || res.data;
      const newBal = payload.balance ?? res.data.balance;
      if (typeof newBal === 'number') {
        setUserBalance(newBal);
        window.dispatchEvent(new CustomEvent('lumi-balance-updated', { detail: newBal }));
      }
      
      const exId = String(pendingUnlock.id).toLowerCase().trim();
      const exTitle = pendingUnlock.title.toLowerCase().trim();

      if (typeof window !== 'undefined') {
        localStorage.setItem(getExercisePurchaseKey(exId), '1');
        localStorage.setItem(getExercisePurchaseKey(exTitle), '1');
      }

      setUnlockedIds(prev => {
        const next = new Set(prev);
        next.add(exId);
        next.add(exTitle);
        next.add(`ejercicio guiado: ${exTitle}`);
        return next;
      });

      setUnlockedTitlesList(prev => [...prev, exTitle, `ejercicio guiado: ${exTitle}`]);
      
      toast({
        title: "✨ Ejercicio Desbloqueado Permanentemente",
        description: `Has desbloqueado "${pendingUnlock.title}". ¡Práctica disponible de por vida!`,
      });

      const current = pendingUnlock;
      setPendingUnlock(null);
      setActive(current);
    } else {
      toast({
        title: "Saldo Insuficiente de Lumis",
        description: (res as any).error || "Necesitas 30 Lumis para realizar este ejercicio.",
        variant: "destructive"
      });
    }
    setUnlocking(false);
  };

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900">Ejercicios Guiados</h1>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(c => {
            const isSelected = cat === c;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border cursor-pointer',
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                )}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ex, index) => (
            <ExerciseCard 
              key={ex.id} 
              ex={ex} 
              isLocked={!isLoggedIn && index > 0} 
              isUnlocked={isExUnlocked(ex)}
              onStart={() => handleStartExerciseClick(ex)} 
            />
          ))}
        </div>
      </div>

      {active && <ActiveExercise ex={active} onClose={() => setActive(null)} />}

      {/* Auth guidance modal for locked items */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        featureName={lockedTitle}
      />

      {/* Lumi Confirmation Unlock Modal */}
      <LumiConfirmUnlockModal
        isOpen={Boolean(pendingUnlock)}
        onClose={() => setPendingUnlock(null)}
        onConfirm={() => void handleConfirmUnlock()}
        itemTitle={pendingUnlock?.title || ''}
        itemCategory="Ejercicio Guiado"
        lumiPrice={30}
        userBalance={userBalance}
        loading={unlocking}
      />
    </PublicLayout>
  );
}
