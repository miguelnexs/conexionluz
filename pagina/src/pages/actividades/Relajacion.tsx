import React, { useState, useEffect, useRef } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { Wind, Play, Pause, RotateCcw, Volume2, VolumeX, Waves, Leaf, CloudRain, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

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
};

const TECHNIQUES: Technique[] = [
  {
    id: 'box',
    title: 'Respiración Cuadrada',
    subtitle: 'Box Breathing (Navy SEALs)',
    description: 'Técnica usada por fuerzas especiales. Equilibra el sistema nervioso y mejora el enfoque.',
    color: '#6366f1',
    gradient: 'from-indigo-500 to-blue-600',
    icon: Wind,
    animation: 'breathe',
    inhale: 4, hold1: 4, exhale: 4, hold2: 4,
    cycles: 4,
  },
  {
    id: '4-7-8',
    title: 'Respiración 4-7-8',
    subtitle: 'Técnica del Dr. Andrew Weil',
    description: 'Activa el sistema nervioso parasimpático. Ideal para reducir ansiedad y conciliar el sueño.',
    color: '#8b5cf6',
    gradient: 'from-violet-500 to-purple-600',
    icon: Waves,
    animation: 'wave',
    inhale: 4, hold1: 7, exhale: 8, hold2: 0,
    cycles: 4,
  },
  {
    id: 'coherente',
    title: 'Respiración Coherente',
    subtitle: '5 respiraciones por minuto',
    description: 'Sincroniza el corazón y el cerebro. Reduce la variabilidad del ritmo cardíaco y el estrés.',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-600',
    icon: Leaf,
    animation: 'expand',
    inhale: 6, hold1: 0, exhale: 6, hold2: 0,
    cycles: 5,
  },
  {
    id: 'calma',
    title: 'Respiración de Calma',
    subtitle: 'Exhale prolongado',
    description: 'La exhalación larga activa el nervio vago. Reduce el estrés agudo en menos de 2 minutos.',
    color: '#0ea5e9',
    gradient: 'from-sky-500 to-cyan-600',
    icon: CloudRain,
    animation: 'pulse',
    inhale: 4, hold1: 0, exhale: 8, hold2: 0,
    cycles: 5,
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

function BreathingVisualizer({ phase, progress, color, animation }: { phase: Phase; progress: number; color: string; animation: string }) {
  const scale = phase === 'inhale' ? 0.6 + (progress * 0.4) : phase === 'exhale' ? 1 - (progress * 0.4) : phase === 'hold1' ? 1 : 0.6;
  const opacity = phase === 'idle' ? 0.4 : 0.75;

  return (
    <div className="relative flex items-center justify-center h-56 w-56 mx-auto my-4">
      {/* Outer glow rings */}
      {[1, 2, 3].map(i => (
        <div key={i}
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
      {/* Core circle */}
      <div
        className="relative z-10 rounded-full flex items-center justify-center transition-all duration-1000 shadow-2xl"
        style={{
          width: `${50 * scale + 30}%`,
          height: `${50 * scale + 30}%`,
          background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color})`,
          transition: 'all 1s ease-in-out',
          boxShadow: `0 0 ${40 * scale}px ${color}60`,
        }}
      >
        <span className="text-white font-black text-xl select-none">{PHASE_LABELS[phase]}</span>
      </div>
    </div>
  );
}

function ActiveBreathing({ tech, onClose }: { tech: Technique; onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [phaseDur, setPhaseDur] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [running, setRunning] = useState(false);
  const [muted, setMuted] = useState(false);
  const phaseRef = useRef<Phase>('idle');
  const cycleRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phases: { name: Phase; dur: number }[] = [
    { name: 'inhale', dur: tech.inhale },
    ...(tech.hold1 > 0 ? [{ name: 'hold1' as Phase, dur: tech.hold1 }] : []),
    { name: 'exhale', dur: tech.exhale },
    ...(tech.hold2 > 0 ? [{ name: 'hold2' as Phase, dur: tech.hold2 }] : []),
  ];

  const runCycle = (phaseIdx: number, currentCycle: number) => {
    if (phaseIdx >= phases.length) {
      const nextCycle = currentCycle + 1;
      if (nextCycle >= tech.cycles) {
        setRunning(false);
        setPhase('idle');
        setCycle(tech.cycles);
        return;
      }
      cycleRef.current = nextCycle;
      setCycle(nextCycle);
      runCycle(0, nextCycle);
      return;
    }
    const p = phases[phaseIdx];
    phaseRef.current = p.name;
    setPhase(p.name);
    setPhaseDur(p.dur);
    setTimeLeft(p.dur);
    let t = p.dur;
    timerRef.current = setInterval(() => {
      t -= 1;
      setTimeLeft(t);
      if (t <= 0) {
        clearInterval(timerRef.current!);
        runCycle(phaseIdx + 1, cycleRef.current);
      }
    }, 1000);
  };

  const start = () => {
    setRunning(true);
    setCycle(0);
    cycleRef.current = 0;
    runCycle(0, 0);
  };

  const stop = () => {
    clearInterval(timerRef.current!);
    setRunning(false);
    setPhase('idle');
    setCycle(0);
    cycleRef.current = 0;
  };

  useEffect(() => () => clearInterval(timerRef.current!), []);

  const progress = phaseDur > 0 ? 1 - (timeLeft / phaseDur) : 0;
  const totalProgress = tech.cycles > 0 ? (cycle / tech.cycles) * 100 : 0;
  const isDone = cycle >= tech.cycles && !running;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-300">
        <div className={`bg-gradient-to-r ${tech.gradient} px-6 py-5 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-lg">{tech.title}</h3>
              <p className="text-white/70 text-xs">{tech.subtitle}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setMuted(!muted)} className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <button onClick={onClose} className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors font-bold text-sm">✕</button>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs opacity-70 mb-1">
              <span>Ciclo {Math.min(cycle + (running ? 1 : 0), tech.cycles)} de {tech.cycles}</span>
              <span>{Math.round(totalProgress)}%</span>
            </div>
            <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${totalProgress}%` }} />
            </div>
          </div>
        </div>

        <div className="p-6 text-center">
          {isDone ? (
            <>
              <div className="text-5xl mb-3">🌟</div>
              <h4 className="font-black text-slate-800 text-xl mb-1">¡Completado!</h4>
              <p className="text-slate-400 text-sm mb-5">Tu sistema nervioso te lo agradece.</p>
              <div className="flex gap-3">
                <button onClick={stop} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
                  <RotateCcw className="h-4 w-4" /> Repetir
                </button>
                <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-sm text-white" style={{ background: tech.color }}>Volver</button>
              </div>
            </>
          ) : (
            <>
              <BreathingVisualizer phase={phase} progress={progress} color={tech.color} animation={tech.animation} />
              {timeLeft > 0 && running && (
                <div className="text-4xl font-black text-slate-800 -mt-2 mb-4">{timeLeft}</div>
              )}
              <div className="flex gap-3 justify-center">
                {!running ? (
                  <button onClick={start} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-white shadow-xl hover:scale-105 transition-all" style={{ background: tech.color }}>
                    <Play className="h-5 w-5 fill-white" /> Comenzar
                  </button>
                ) : (
                  <button onClick={stop} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
                    <Pause className="h-5 w-5" /> Detener
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { api } from '../../api/client';

const getIconForBreathing = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('cuadrada') || t.includes('box')) return Wind;
  if (t.includes('4-7-8') || t.includes('ansiedad')) return Waves;
  if (t.includes('coherente')) return Leaf;
  return Wind;
};

const getAnimation = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('4-7-8')) return 'wave';
  if (t.includes('coherente')) return 'expand';
  return 'breathe';
};

export default function RelajacionPage() {
  const [active, setActive] = useState<Technique | null>(null);
  const [techniquesList, setTechniquesList] = useState<Technique[]>([]);

  useEffect(() => {
    const loadTechniques = async () => {
      const res = await api.get<any[]>('/api/portal/breathing-techniques/');
      if (res.ok && res.data && res.data.length > 0) {
        const mapped: Technique[] = res.data.map(item => {
          return {
            id: String(item.id),
            title: item.title,
            subtitle: item.subtitle,
            description: item.description,
            color: item.color,
            gradient: item.gradient,
            icon: getIconForBreathing(item.title),
            animation: getAnimation(item.title),
            inhale: item.inhale || 4,
            hold1: item.hold1 || 0,
            exhale: item.exhale || 4,
            hold2: item.hold2 || 0,
            cycles: item.cycles || 4
          };
        });
        setTechniquesList(mapped);
      } else {
        setTechniquesList(TECHNIQUES);
      }
    };
    loadTechniques();
  }, []);

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl mb-10 bg-gradient-to-br from-sky-500 via-blue-500 to-violet-600 p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(ellipse at 50% 50%, white 1px, transparent 1px)', backgroundSize: '35px 35px' }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <Wind className="h-4 w-4" />
              <span className="text-sm font-bold">Regulación del Sistema Nervioso</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3">Relajación & Mindfulness</h1>
            <p className="text-white/80 text-lg max-w-xl leading-relaxed">
              Técnicas de respiración guiadas con animación interactiva. Calma la mente en minutos.
            </p>
            <div className="flex flex-wrap gap-6 mt-8 text-center">
              {[['5 min', 'por día'], ['98%', 'efectividad'], ['Inmediato', 'efecto']].map(([v, l]) => (
                <div key={v}>
                  <div className="text-2xl font-black">{v}</div>
                  <div className="text-white/60 text-xs font-semibold">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Techniques grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {techniquesList.map(tech => {
            const Icon = tech.icon;
            return (
              <div key={tech.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className={`bg-gradient-to-br ${tech.gradient} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute -right-6 -bottom-6 h-24 w-24 bg-white/10 rounded-full" />
                  <Icon className="h-8 w-8 mb-3 relative z-10" />
                  <h3 className="font-black text-xl relative z-10">{tech.title}</h3>
                  <p className="text-white/70 text-xs mt-1 relative z-10">{tech.subtitle}</p>
                </div>
                <div className="p-5">
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{tech.description}</p>
                  {/* Pattern pills */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: `${tech.color}12`, color: tech.color }}>
                      Inhala: {tech.inhale}s
                    </span>
                    {tech.hold1 > 0 && <span className="text-[11px] font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">Retén: {tech.hold1}s</span>}
                    <span className="text-[11px] font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">Exhala: {tech.exhale}s</span>
                    {tech.hold2 > 0 && <span className="text-[11px] font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">Pausa: {tech.hold2}s</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{tech.cycles} ciclos</span>
                    <button
                      onClick={() => setActive(tech)}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm text-white hover:scale-105 transition-all shadow-md"
                      style={{ background: tech.color }}
                    >
                      <Play className="h-3.5 w-3.5 fill-white" /> Practicar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info box */}
        <div className="mt-10 bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Music className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-black text-blue-800 mb-1">Consejo de práctica</h4>
              <p className="text-sm text-blue-600 leading-relaxed">
                Practica en un lugar tranquilo, preferiblemente a la misma hora cada día. 5 minutos diarios de respiración consciente pueden reducir el cortisol (hormona del estrés) hasta un 20% en 4 semanas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {active && <ActiveBreathing tech={active} onClose={() => setActive(null)} />}
    </PublicLayout>
  );
}
