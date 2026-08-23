import React, { useState, useEffect, useRef } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { Wind, Play, Pause, RotateCcw, Volume2, VolumeX, Waves, Leaf, CloudRain, Music, Sparkles, Brain, CheckCircle2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EXERCISES, Exercise, ActiveExercise, getCategoryMeta } from './EjerciciosGuiados';
import { AuthPromptModal, isUserLoggedIn } from '@/components/AuthPromptModal';
import { LumiConfirmUnlockModal } from '@/components/LumiConfirmUnlockModal';
import { useToast } from '@/components/ui/use-toast';
import { api } from '../../api/client';
import { recordExerciseActivity } from '@/utils/progressTracker';

type Technique = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  gradient: string;
  icon: React.ElementType;
  animation: 'breathe' | 'wave' | 'pulse' | 'expand';
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  cycles: number;
  price?: number;
};

const TECHNIQUES: Technique[] = [
  {
    id: 'box',
    title: 'Respiración Cuadrada',
    subtitle: 'Box Breathing (Navy SEALs)',
    description: 'Técnica usada por fuerzas especiales. Equilibra el sistema nervioso y mejora el enfoque.',
    color: '#0d9488',
    gradient: 'from-teal-500 to-emerald-600',
    icon: Wind,
    animation: 'breathe',
    inhale: 4, hold1: 4, exhale: 4, hold2: 4,
    cycles: 4,
    price: 20,
  },
  {
    id: '4-7-8',
    title: 'Respiración 4-7-8',
    subtitle: 'Técnica del Dr. Andrew Weil',
    description: 'Activa el sistema nervioso parasimpático. Ideal para reducir ansiedad y conciliar el sueño.',
    color: '#4f46e5',
    gradient: 'from-indigo-500 to-blue-600',
    icon: Waves,
    animation: 'wave',
    inhale: 4, hold1: 7, exhale: 8, hold2: 0,
    cycles: 4,
    price: 20,
  },
  {
    id: 'coherente',
    title: 'Respiración Coherente',
    subtitle: '5 respiraciones por minuto',
    description: 'Sincroniza el corazón y el cerebro. Reduce la variabilidad del ritmo cardíaco y el estrés.',
    color: '#059669',
    gradient: 'from-emerald-500 to-teal-600',
    icon: Leaf,
    animation: 'expand',
    inhale: 6, hold1: 0, exhale: 6, hold2: 0,
    cycles: 5,
    price: 20,
  },
  {
    id: 'calma',
    title: 'Respiración de Calma',
    subtitle: 'Exhale prolongado',
    description: 'La exhalación larga activa el nervio vago. Reduce el estrés agudo en menos de 2 minutos.',
    color: '#2563eb',
    gradient: 'from-blue-500 to-cyan-600',
    icon: CloudRain,
    animation: 'pulse',
    inhale: 4, hold1: 0, exhale: 8, hold2: 0,
    cycles: 5,
    price: 20,
  },
];

type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2' | 'idle';

const PHASE_LABELS: Record<Phase, string> = {
  inhale: 'Inhala…',
  hold1: 'Retén…',
  exhale: 'Exhala…',
  hold2: 'Pausa…',
  idle: 'Listo',
};

function BreathingVisualizer({ phase, progress, color }: { phase: Phase; progress: number; color: string }) {
  const scale = phase === 'inhale' ? 0.6 + (progress * 0.4) : phase === 'exhale' ? 1 - (progress * 0.4) : phase === 'hold1' ? 1 : 0.6;
  const opacity = phase === 'idle' ? 0.4 : 0.75;

  return (
    <div className="relative flex items-center justify-center h-56 w-56 mx-auto my-4">
      {[1, 2, 3].map(i => (
        <div 
          key={i}
          className="absolute rounded-full transition-all duration-1000"
          style={{
            width: `${(i * 25 + 50) * scale}%`,
            height: `${(i * 25 + 50) * scale}%`,
            background: `${color}${Math.round(opacity * (0.15 / i) * 255).toString(16).padStart(2, '0')}`,
            transform: `scale(${scale})`,
            transition: 'all 1s ease-in-out',
          }}
        />
      ))}
      <div 
        className="relative z-10 h-32 w-32 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-all duration-1000"
        style={{
          backgroundColor: color,
          transform: `scale(${scale})`,
          boxShadow: `0 0 40px ${color}60`,
        }}
      >
        <span className="text-base font-black tracking-wide text-white drop-shadow">{PHASE_LABELS[phase]}</span>
      </div>
    </div>
  );
}

function ActiveBreathing({ tech, onClose }: { tech: Technique; onClose: () => void }) {
  const [running, setRunning] = useState(true);
  const [phase, setPhase] = useState<Phase>('idle');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [soundOn, setSoundOn] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTone = (freq: number) => {
    if (!soundOn) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {}
  };

  useEffect(() => {
    if (!running) return;

    let currentPhase: Phase = 'inhale';
    let currentCycle = 1;
    let elapsed = 0;

    playTone(440);
    setPhase('inhale');

    const getPhaseDuration = (p: Phase) => {
      if (p === 'inhale') return tech.inhale;
      if (p === 'hold1') return tech.hold1;
      if (p === 'exhale') return tech.exhale;
      if (p === 'hold2') return tech.hold2;
      return 1;
    };

    const getNextPhase = (p: Phase): Phase => {
      if (p === 'inhale') return tech.hold1 > 0 ? 'hold1' : 'exhale';
      if (p === 'hold1') return 'exhale';
      if (p === 'exhale') return tech.hold2 > 0 ? 'hold2' : 'inhale';
      if (p === 'hold2') return 'inhale';
      return 'inhale';
    };

    const interval = setInterval(() => {
      elapsed += 0.1;
      const duration = getPhaseDuration(currentPhase);
      const prog = Math.min(1, elapsed / duration);
      setPhaseProgress(prog);

      if (elapsed >= duration) {
        elapsed = 0;
        const next = getNextPhase(currentPhase);

        if (next === 'inhale') {
          currentCycle += 1;
          if (currentCycle > tech.cycles) {
            clearInterval(interval);
            setRunning(false);
            setPhase('idle');
            return;
          }
          setCycle(currentCycle);
        }

        currentPhase = next;
        setPhase(next);

        if (next === 'inhale') playTone(440);
        if (next === 'hold1') playTone(520);
        if (next === 'exhale') playTone(350);
        if (next === 'hold2') playTone(300);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [running, tech]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 text-center animate-in zoom-in-95 duration-300 relative border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">
              {tech.title}
            </span>
            <span className="text-[10px] font-bold text-slate-500">Ciclo {cycle} de {tech.cycles}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSoundOn(!soundOn)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50">
              {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 font-bold text-xs">
              ✕
            </button>
          </div>
        </div>

        <BreathingVisualizer phase={phase} progress={phaseProgress} color={tech.color} />

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setRunning(!running)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg transition-all hover:scale-105"
            style={{ backgroundColor: tech.color }}
          >
            {running ? <><Pause className="h-4 w-4" /> Pausar</> : <><Play className="h-4 w-4 fill-white" /> Reanudar</>}
          </button>
        </div>
      </div>
    </div>
  );
}

const getPurchaseKey = (idOrTitle: string) => `conexionluz:unlocked_item:${idOrTitle.toLowerCase().trim()}`;

export default function RelajacionPage() {
  const { toast } = useToast();
  const [activeTech, setActiveTech] = useState<Technique | null>(null);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [lockedTitle, setLockedTitle] = useState('');
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [unlockedTitlesList, setUnlockedTitlesList] = useState<string[]>([]);
  const [userBalance, setUserBalance] = useState<number>(150);
  const [pendingUnlockItem, setPendingUnlockItem] = useState<{
    id: string;
    title: string;
    category: string;
    itemType: 'breathing' | 'exercise';
    lumiPrice: number;
    targetObj: Technique | Exercise;
  } | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const isLoggedIn = isUserLoggedIn();

  const fetchWalletAndUnlocked = async () => {
    if (!isLoggedIn) return;

    const unlockedSet = new Set<string>();
    const titlesList: string[] = [];

    // 1. Initialize from localStorage
    [...TECHNIQUES, ...EXERCISES].forEach(item => {
      const itemId = String(item.id).toLowerCase().trim();
      const itemTitle = item.title.toLowerCase().trim();
      if (
        localStorage.getItem(getPurchaseKey(itemId)) === '1' ||
        localStorage.getItem(getPurchaseKey(itemTitle)) === '1' ||
        localStorage.getItem(`conexionluz:purchased:${itemId}`) === '1' ||
        localStorage.getItem(`conexionluz:purchased:${itemTitle}`) === '1' ||
        localStorage.getItem(`conexionluz:unlocked_exercise:${itemId}`) === '1' ||
        localStorage.getItem(`conexionluz:unlocked_exercise:${itemTitle}`) === '1'
      ) {
        unlockedSet.add(itemId);
        unlockedSet.add(itemTitle);
        titlesList.push(itemTitle);
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
          if (typeof window !== 'undefined') localStorage.setItem(getPurchaseKey(uId), '1');
        }
        if (u.itemTitle) {
          const rawTitle = String(u.itemTitle).toLowerCase().trim();
          unlockedSet.add(rawTitle);
          titlesList.push(rawTitle);

          const cleanTitle = rawTitle.replace(/^(ejercicio guiado|técnica de respiración|técnica):\s*/i, '').trim();
          unlockedSet.add(cleanTitle);
          titlesList.push(cleanTitle);
          if (typeof window !== 'undefined') localStorage.setItem(getPurchaseKey(cleanTitle), '1');
        }
      });
    }

    setUnlockedIds(unlockedSet);
    setUnlockedTitlesList(titlesList);
  };

  useEffect(() => {
    void fetchWalletAndUnlocked();
  }, []);

  const isItemUnlocked = (id: string, title: string): boolean => {
    const itemId = String(id).toLowerCase().trim();
    const itemTitle = String(title).toLowerCase().trim();

    if (unlockedIds.has(itemId) || unlockedIds.has(itemTitle)) return true;
    if (typeof window !== 'undefined') {
      if (
        localStorage.getItem(getPurchaseKey(itemId)) === '1' ||
        localStorage.getItem(getPurchaseKey(itemTitle)) === '1' ||
        localStorage.getItem(`conexionluz:purchased:${itemId}`) === '1' ||
        localStorage.getItem(`conexionluz:purchased:${itemTitle}`) === '1' ||
        localStorage.getItem(`conexionluz:unlocked_exercise:${itemId}`) === '1' ||
        localStorage.getItem(`conexionluz:unlocked_exercise:${itemTitle}`) === '1'
      ) return true;
    }

    return unlockedTitlesList.some(t => t.includes(itemTitle) || itemTitle.includes(t) || t.includes(itemId));
  };

  const handleStartTech = (tech: Technique, index: number) => {
    if (!isLoggedIn) {
      setLockedTitle(`la técnica "${tech.title}"`);
      setShowAuthModal(true);
      return;
    }

    if (isItemUnlocked(tech.id, tech.title)) {
      recordExerciseActivity(tech.title);
      setActiveTech(tech);
      return;
    }

    setPendingUnlockItem({
      id: tech.id,
      title: tech.title,
      category: 'Técnica de Respiración',
      itemType: 'breathing',
      lumiPrice: tech.price || 20,
      targetObj: tech,
    });
  };

  const handleStartExercise = (ex: Exercise, index: number) => {
    if (!isLoggedIn) {
      setLockedTitle(`el ejercicio "${ex.title}"`);
      setShowAuthModal(true);
      return;
    }

    if (isItemUnlocked(ex.id, ex.title)) {
      recordExerciseActivity(ex.title);
      setActiveExercise(ex);
      return;
    }

    setPendingUnlockItem({
      id: ex.id,
      title: ex.title,
      category: 'Ejercicio Guiado',
      itemType: 'exercise',
      lumiPrice: 30,
      targetObj: ex,
    });
  };

  const handleConfirmUnlock = async () => {
    if (!pendingUnlockItem) return;
    setUnlocking(true);

    const res = await api.post<any>('/api/portal/lumi/spend/', {
      itemType: pendingUnlockItem.itemType,
      itemId: pendingUnlockItem.id,
      lumiAmount: pendingUnlockItem.lumiPrice,
      description: `${pendingUnlockItem.category}: ${pendingUnlockItem.title}`
    });

    if (res.ok && res.data) {
      const payload = res.data.data || res.data;
      const newBal = payload.balance ?? res.data.balance;
      if (typeof newBal === 'number') {
        setUserBalance(newBal);
        window.dispatchEvent(new CustomEvent('lumi-balance-updated', { detail: newBal }));
      }

      const itemId = String(pendingUnlockItem.id).toLowerCase().trim();
      const itemTitle = pendingUnlockItem.title.toLowerCase().trim();

      if (typeof window !== 'undefined') {
        localStorage.setItem(getPurchaseKey(itemId), '1');
        localStorage.setItem(getPurchaseKey(itemTitle), '1');
        if (pendingUnlockItem.itemType === 'exercise') {
          localStorage.setItem(`conexionluz:unlocked_exercise:${itemId}`, '1');
          localStorage.setItem(`conexionluz:unlocked_exercise:${itemTitle}`, '1');
        }
      }

      setUnlockedIds(prev => {
        const next = new Set(prev);
        next.add(itemId);
        next.add(itemTitle);
        return next;
      });

      setUnlockedTitlesList(prev => [...prev, itemTitle]);

      toast({
        title: "✨ Contenido Desbloqueado Permanentemente",
        description: `Has desbloqueado "${pendingUnlockItem.title}". ¡Acceso ilimitado activado!`,
      });

      const current = pendingUnlockItem;
      setPendingUnlockItem(null);
      if (current.itemType === 'breathing') {
        setActiveTech(current.targetObj as Technique);
      } else {
        setActiveExercise(current.targetObj as Exercise);
      }
    } else {
      toast({
        title: "Saldo Insuficiente de Lumis",
        description: (res as any).error || `Necesitas ${pendingUnlockItem.lumiPrice} Lumis para desbloquear este contenido.`,
        variant: "destructive"
      });
    }
    setUnlocking(false);
  };

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Title Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">Relajación & Mindfulness</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Técnicas terapéuticas guiadas y ejercicios de regulación automática del sistema nervioso.
            </p>
          </div>
        </div>

        {/* Breathing Visualizers section */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Wind className="h-5 w-5 text-teal-600" /> Pases de Respiración Guiada
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TECHNIQUES.map((tech, index) => {
              const Icon = tech.icon;
              const isLocked = !isLoggedIn && index > 0;
              const isUnlocked = isItemUnlocked(tech.id, tech.title);
              const price = tech.price || 20;

              return (
                <div 
                  key={tech.id} 
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between cursor-pointer"
                  onClick={() => handleStartTech(tech, index)}
                >
                  <div className="h-1.5 w-full" style={{ backgroundColor: tech.color }} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-12 w-12 rounded-xl border border-slate-100 flex items-center justify-center shrink-0" style={{ backgroundColor: `${tech.color}15`, color: tech.color }}>
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
                          <Sparkles className="w-3 h-3 text-emerald-600" /> ✨ {price} Lumis
                        </span>
                      )}
                    </div>

                    <h3 className="font-black text-slate-900 text-lg leading-tight">{tech.title}</h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5 mb-3">{tech.subtitle}</p>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium mb-4">{tech.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-xs font-semibold text-slate-500">Inhala {tech.inhale}s · Exhala {tech.exhale}s</span>
                      {isUnlocked ? (
                        <button
                          className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all duration-200 group-hover:scale-105"
                        >
                          <Play className="h-3.5 w-3.5 fill-white" /> Practicar
                        </button>
                      ) : isLocked ? (
                        <button
                          className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl bg-slate-900 text-white shadow-md transition-all duration-200 group-hover:scale-105"
                        >
                          <Lock className="h-3.5 w-3.5" /> Regístrate
                        </button>
                      ) : (
                        <button
                          className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl text-white shadow-md hover:scale-105 transition-all cursor-pointer"
                          style={{ backgroundColor: tech.color }}
                        >
                          <Play className="h-3.5 w-3.5 fill-white" /> Practicar (✨ {price} Lumis)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guided Exercises Section (Integrated catalog) */}
        <div className="space-y-4 pt-4 border-t border-slate-200/60">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600" /> Prácticas Guiadas Automáticas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EXERCISES.map((ex, index) => {
              const meta = getCategoryMeta(ex.category);
              const Icon = ex.icon;
              const isLocked = !isLoggedIn && index > 0;
              const isUnlocked = isItemUnlocked(ex.id, ex.title);

              return (
                <div 
                  key={ex.id} 
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between cursor-pointer"
                  onClick={() => handleStartExercise(ex, index)}
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
                          <Lock className="h-3.5 w-3.5" /> Regístrate
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
            })}
          </div>
        </div>
      </div>

      {activeTech && <ActiveBreathing tech={activeTech} onClose={() => setActiveTech(null)} />}
      {activeExercise && <ActiveExercise ex={activeExercise} onClose={() => setActiveExercise(null)} />}

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Desbloquea el catálogo completo de Mindfulness"
        featureName={lockedTitle}
      />

      {/* Lumi Confirmation Unlock Modal */}
      <LumiConfirmUnlockModal
        isOpen={Boolean(pendingUnlockItem)}
        onClose={() => setPendingUnlockItem(null)}
        onConfirm={() => void handleConfirmUnlock()}
        itemTitle={pendingUnlockItem?.title || ''}
        itemCategory={pendingUnlockItem?.category || 'Práctica'}
        lumiPrice={pendingUnlockItem?.lumiPrice || 20}
        userBalance={userBalance}
        loading={unlocking}
      />
    </PublicLayout>
  );
}

