import React, { useState, useEffect, useRef } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { Dumbbell, Play, Pause, RotateCcw, CheckCircle2, ChevronRight, Wind, Brain, Heart, Zap, Moon, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

type Exercise = {
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

const EXERCISES: Exercise[] = [
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
      { title: '3 cosas que ESCUCHAS', body: 'Cierra los ojos y escucha. Identifica 3 sonidos distintos en tu entorno. Cerca y lejos. Suaves o fuertes.', duration: 30 },
      { title: '2 cosas que HUELES', body: 'Presta atención a los aromas a tu alrededor. Puede ser el aire, tu ropa, algún alimento. Identifica 2 olores distintos.', duration: 30 },
      { title: '1 cosa que PRUEBAS', body: 'Toma conciencia del sabor en tu boca. Simplemente observa sin juzgar. Has completado el ejercicio de anclaje al presente.', duration: 30 },
    ],
  },
  {
    id: 'relajacion-muscular',
    title: 'Relajación Muscular Progresiva',
    subtitle: 'Técnica de Jacobson',
    category: 'Corporal',
    duration: 240,
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-500',
    icon: Zap,
    benefits: ['Libera tensión física', 'Mejora la conciencia corporal', 'Disminuye el estrés crónico'],
    steps: [
      { title: 'Manos y brazos', body: 'Aprieta los puños con fuerza durante 5 segundos. Luego suelta completamente y siente el contraste entre tensión y relajación. Nota el calor y hormigueo.', duration: 30 },
      { title: 'Hombros y cuello', body: 'Sube los hombros hacia las orejas con fuerza durante 5 segundos. Suelta y siente cómo caen. Repite si hay tensión residual.', duration: 30 },
      { title: 'Cara y frente', body: 'Arruga la frente y cierra los ojos con fuerza 5 segundos. Suelta. Después aprieta los labios y la mandíbula, luego relaja completamente.', duration: 30 },
      { title: 'Pecho y abdomen', body: 'Infla el pecho y contrae el abdomen simultáneamente durante 5 segundos. Exhala y deja que todo se afloje. Observa la diferencia.', duration: 30 },
      { title: 'Piernas y pies', body: 'Tensa los muslos, pantorrillas y pies apuntando los dedos hacia arriba durante 5 segundos. Suelta y siente el peso de tus piernas relajadas.', duration: 30 },
    ],
  },
  {
    id: 'visualizacion-lugar-seguro',
    title: 'Visualización del Lugar Seguro',
    subtitle: 'Meditación guiada de imagen mental',
    category: 'Visualización',
    duration: 300,
    color: '#8b5cf6',
    gradient: 'from-violet-500 to-purple-600',
    icon: Moon,
    benefits: ['Reduce la ansiedad aguda', 'Crea recursos internos', 'Fortalece la autoregulación'],
    steps: [
      { title: 'Cierra los ojos y respira', body: 'Cierra los ojos suavemente. Toma 3 respiraciones profundas. Con cada exhalación, siente cómo tu cuerpo se va asentando.', duration: 30 },
      { title: 'Imagina tu lugar seguro', body: 'Visualiza un lugar donde te sientas completamente tranquilo/a. Puede ser real o imaginario: un jardín, una playa, una habitación acogedora.', duration: 45 },
      { title: 'Activa todos tus sentidos', body: '¿Qué ves en ese lugar? ¿Qué sonidos hay? ¿Qué temperatura sientes? ¿Hay algún aroma? Déjate envolver completamente por ese espacio.', duration: 60 },
      { title: 'Siente la seguridad', body: 'Nota cómo tu cuerpo responde. Siente la calma, la protección, la tranquilidad. Sabes que puedes volver aquí cuando lo necesites.', duration: 45 },
      { title: 'Regresa suavemente', body: 'Toma conciencia del espacio donde estás. Mueve los dedos de las manos y los pies. Abre los ojos lentamente. Llevas contigo esa calma.', duration: 30 },
    ],
  },
  {
    id: 'autocompasion',
    title: 'Carta de Autocompasión',
    subtitle: 'Técnica de Kristin Neff',
    category: 'Emocional',
    duration: 180,
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-500',
    icon: Heart,
    benefits: ['Reduce la autocrítica', 'Fomenta la amabilidad propia', 'Alivia el dolor emocional'],
    steps: [
      { title: 'Identifica el dolor', body: 'Piensa en algo que te esté causando sufrimiento emocional: un error, una situación difícil, una crítica que te hiciste. No lo juzgues, solo obsérvalo.', duration: 30 },
      { title: 'Reconoce la humanidad compartida', body: 'Recuerda: el sufrimiento es parte de la experiencia humana. Todas las personas cometen errores y enfrentan dificultades. No estás solo/a en esto.', duration: 30 },
      { title: 'Ofrécete amabilidad', body: 'Pon una mano en tu corazón. Imagina que le hablas a un/a amigo/a querido/a que está pasando exactamente lo mismo. ¿Qué le dirías?', duration: 40 },
      { title: 'Escribe internamente', body: 'Repite mentalmente (o por escrito): "Que pueda ser amable conmigo mismo/a. Que pueda tratarme con la misma compasión que le daría a alguien que amo."', duration: 40 },
      { title: 'Integra la experiencia', body: 'Toma una respiración profunda. Siente el calor de tu mano sobre tu pecho. Reconoce que mereces comprensión y cuidado, incluso en tus momentos difíciles.', duration: 20 },
    ],
  },
  {
    id: 'grounding-tierra',
    title: 'Grounding / Tierra',
    subtitle: 'Ejercicio de anclaje emocional',
    category: 'Corporal',
    duration: 120,
    color: '#0ea5e9',
    gradient: 'from-sky-500 to-cyan-600',
    icon: Timer,
    benefits: ['Alivia ataques de pánico', 'Regula emociones intensas', 'Reconecta con el cuerpo'],
    steps: [
      { title: 'Planta los pies', body: 'Siéntate o párate. Siente el contacto de tus pies con el suelo. Presiona ligeramente hacia abajo. El suelo te sostiene firmemente.', duration: 20 },
      { title: 'Siente tu cuerpo', body: 'Toca algo concreto con tus manos: la silla, tu ropa, tus piernas. Aprieta suavemente. Nota la temperatura y textura.', duration: 20 },
      { title: 'Respira con intención', body: 'Inhala lentamente 4 tiempos, exhala 6 tiempos. Mientras respiras, di internamente: "Estoy aquí. Estoy seguro/a. Este momento pasará."', duration: 40 },
      { title: 'Nombra el entorno', body: 'Mira a tu alrededor y di en voz alta (o mentalmente) el nombre de 3 objetos que ves. Esto activa el córtex prefrontal y calma la amígdala.', duration: 20 },
      { title: 'Ancla tu identidad', body: 'Di tu nombre, dónde estás, y una cosa que planeas hacer hoy. Estás presente. Estás conectado/a. Estás bien.', duration: 20 },
    ],
  },
];

function ExerciseCard({ ex, onStart }: { ex: Exercise; onStart: () => void }) {
  const Icon = ex.icon;
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className={`bg-gradient-to-r ${ex.gradient} p-5 text-white relative overflow-hidden`}>
        <div className="absolute -right-4 -top-4 h-20 w-20 bg-white/10 rounded-full" />
        <div className="absolute -right-2 -bottom-6 h-16 w-16 bg-white/10 rounded-full" />
        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 rounded-full px-2.5 py-1">{ex.category}</span>
            <h3 className="font-black text-xl mt-2 leading-tight">{ex.title}</h3>
            <p className="text-white/75 text-xs mt-1">{ex.subtitle}</p>
          </div>
          <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          {ex.benefits.map(b => (
            <span key={b} className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-1">{b}</span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-semibold">⏱ {Math.floor(ex.duration / 60)} min · {ex.steps.length} pasos</span>
          <button
            onClick={onStart}
            className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl text-white transition-all duration-200 hover:scale-105 shadow-md"
            style={{ background: ex.color }}
          >
            <Play className="h-3.5 w-3.5 fill-white" /> Iniciar
          </button>
        </div>
      </div>
    </div>
  );
}

function ActiveExercise({ ex, onClose }: { ex: Exercise; onClose: () => void }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ex.steps[0].duration);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = ex.steps[stepIdx];

  const start = () => {
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          if (stepIdx < ex.steps.length - 1) {
            const nextIdx = stepIdx + 1;
            setStepIdx(nextIdx);
            setTimeLeft(ex.steps[nextIdx].duration);
            setRunning(false);
          } else {
            setDone(true);
            setRunning(false);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const pause = () => {
    setRunning(false);
    clearInterval(intervalRef.current!);
  };

  const reset = () => {
    pause();
    setStepIdx(0);
    setTimeLeft(ex.steps[0].duration);
    setDone(false);
  };

  useEffect(() => () => clearInterval(intervalRef.current!), []);

  const progress = ((step.duration - timeLeft) / step.duration) * 100;
  const totalProgress = ((stepIdx + (step.duration - timeLeft) / step.duration) / ex.steps.length) * 100;

  if (done) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-in zoom-in-95 duration-300">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">¡Ejercicio completado!</h3>
          <p className="text-slate-500 text-sm mb-6">Tomaste {Math.floor(ex.duration / 60)} minutos para cuidar tu bienestar. ¡Eso cuenta mucho!</p>
          <div className="flex gap-3">
            <button onClick={reset} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
              <RotateCcw className="h-4 w-4" /> Repetir
            </button>
            <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all" style={{ background: ex.color }}>
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className={`bg-gradient-to-r ${ex.gradient} p-6 text-white`}>
          <div className="flex items-center justify-between mb-4">
            <span className="font-black text-lg">{ex.title}</span>
            <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity font-bold">✕</button>
          </div>
          {/* Total progress */}
          <div className="flex justify-between text-xs opacity-70 mb-1.5">
            <span>Progreso total</span><span>{Math.round(totalProgress)}%</span>
          </div>
          <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${totalProgress}%` }} />
          </div>
          {/* Steps dots */}
          <div className="flex gap-2 mt-3">
            {ex.steps.map((_, i) => (
              <div key={i} className={cn('h-1.5 flex-1 rounded-full transition-all duration-300', i < stepIdx ? 'bg-white' : i === stepIdx ? 'bg-white/60' : 'bg-white/25')} />
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ex.color }}>Paso {stepIdx + 1} de {ex.steps.length}</span>
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-3">{step.title}</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">{step.body}</p>

          {/* Timer circle */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative h-28 w-28">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" strokeLinecap="round"
                  stroke={ex.color}
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800">{timeLeft}</span>
                <span className="text-[10px] text-slate-400 font-bold">seg</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={reset} className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={running ? pause : start}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02] shadow-lg"
              style={{ background: ex.color }}
            >
              {running ? <><Pause className="h-4 w-4" /> Pausar</> : <><Play className="h-4 w-4 fill-white" /> {timeLeft === step.duration ? 'Iniciar paso' : 'Continuar'}</>}
            </button>
            {stepIdx < ex.steps.length - 1 && (
              <button
                onClick={() => { pause(); setStepIdx(i => i + 1); setTimeLeft(ex.steps[stepIdx + 1].duration); }}
                className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Category filter ──────────────────────────────────────────────────────────
const CATEGORIES = ['Todos', 'Respiración', 'Mindfulness', 'Corporal', 'Visualización', 'Emocional'];

import { api } from '../../api/client';

const getIconForCategory = (cat: string) => {
  const c = cat.toLowerCase();
  if (c.includes('respiraci')) return Wind;
  if (c.includes('mindful')) return Brain;
  if (c.includes('corporal')) return Zap;
  if (c.includes('visualiza')) return Moon;
  if (c.includes('emocional')) return Heart;
  return Timer;
};

export default function EjerciciosGuiadosPage() {
  const [active, setActive] = useState<Exercise | null>(null);
  const [cat, setCat] = useState('Todos');
  const [exercisesList, setExercisesList] = useState<Exercise[]>([]);

  useEffect(() => {
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

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl mb-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <Dumbbell className="h-4 w-4" />
              <span className="text-sm font-bold">Terapia Práctica</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3">Ejercicios Guiados</h1>
            <p className="text-white/80 text-lg max-w-xl leading-relaxed">
              Técnicas terapéuticas paso a paso con temporizador integrado. Respira, siente y regúlate.
            </p>
            <div className="flex flex-wrap gap-4 mt-6 text-sm">
              <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Temporizador guiado</div>
              <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Basados en evidencia</div>
              <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Sin registro requerido</div>
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn('px-4 py-2 rounded-full text-sm font-bold transition-all duration-200', cat === c ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600')}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(ex => (
            <ExerciseCard key={ex.id} ex={ex} onStart={() => setActive(ex)} />
          ))}
        </div>
      </div>

      {active && <ActiveExercise ex={active} onClose={() => setActive(null)} />}
    </PublicLayout>
  );
}
