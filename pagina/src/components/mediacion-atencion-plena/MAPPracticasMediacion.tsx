import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  Compass, 
  Brain, 
  Wind, 
  Clock, 
  Radio, 
  BellRing
} from 'lucide-react';

interface PracticeMode {
  id: '5min' | '10min' | '15min';
  title: string;
  subtitle: string;
  durationMinutes: number;
  badge: string;
  description: string;
  steps: Array<{
    minuteStart: number;
    title: string;
    focus: string;
    instruction: string;
    internalCue: string;
    externalCue: string;
  }>;
}

const PRACTICES: PracticeMode[] = [
  {
    id: '5min',
    title: 'Pausa de Observación',
    subtitle: '5 Minutos de Reconexión con el Presente',
    durationMinutes: 5,
    badge: '⚡ Práctica Rápida',
    description: 'Una intervención breve para detener el piloto automático, registrar sensaciones corporales y abrir la atención a los sonidos del entorno.',
    steps: [
      {
        minuteStart: 0,
        title: 'Fase 1: Anclaje Corporal',
        focus: 'Cuerpo y Respiración',
        instruction: 'Toma asiento cómodamente. Nota los puntos de apoyo de tu cuerpo y siente el flujo natural de tu respiración.',
        internalCue: 'Siento el peso en la silla y el aire en la nariz.',
        externalCue: 'Reconozco la luz de la habitación y la temperatura.'
      },
      {
        minuteStart: 2,
        title: 'Fase 2: Expansión Sensorial',
        focus: 'Entorno y Sonidos',
        instruction: 'Sin moverte, abre tu atención a los sonidos que te rodean. Escúchalos sin juzgarlos como agradables o molestos.',
        internalCue: 'Observo mis pensamientos pasar como nubes.',
        externalCue: 'Registro sonidos lejanos y cercanos en este instante.'
      },
      {
        minuteStart: 4,
        title: 'Fase 3: Integración Presente',
        focus: 'Simultaneidad y Cierre',
        instruction: 'Siente tu cuerpo completo respirando mientras percibes todo el entorno alrededor. Prepárate para retomar tus actividades.',
        internalCue: 'Reconozco mi estado interior en calma.',
        externalCue: 'Listo para responder conscientemente a mi entorno.'
      }
    ]
  },
  {
    id: '10min',
    title: 'Mediación Interna y Externa',
    subtitle: '10 Minutos de Práctica de Simultaneidad',
    durationMinutes: 10,
    badge: '🧘 Práctica Fundamental',
    description: 'Entrenamiento sistemático para alternar y unificar la observación del mundo interior (mente, emoción, cuerpo) y el mundo exterior (espacio, estímulos).',
    steps: [
      {
        minuteStart: 0,
        title: 'Fase 1: Asentamiento y Postura',
        focus: 'Estabilización del Observador',
        instruction: 'Adopta una postura digna y relajada. Deja que los ojos descansen con una mirada suave o semicerrada.',
        internalCue: 'Suelto tensiones en mandíbula, cuello y hombros.',
        externalCue: 'Percibo la dimensión del espacio en el que me encuentro.'
      },
      {
        minuteStart: 3,
        title: 'Fase 2: Observación del Mundo Interno',
        focus: 'Pensamientos y Emociones',
        instruction: 'Lleva la linterna de tu atención hacia adentro: ¿Qué pensamientos cruzan tu mente? ¿Qué tono emocional está presente?',
        internalCue: 'No me peleo con los pensamientos; los nombro y observo.',
        externalCue: 'Mantengo conciencia de fondo del entorno sonoro.'
      },
      {
        minuteStart: 6,
        title: 'Fase 3: Observación del Mundo Externo',
        focus: 'Fenómenos Ambientales',
        instruction: 'Expande la atención hacia afuera: texturas auditivas, corrientes de aire, variaciones sutiles de luz.',
        internalCue: 'Noto las sensaciones de calor o frescor en la piel.',
        externalCue: 'El entorno fluye con sus propios ritmos y acontecimientos.'
      },
      {
        minuteStart: 8,
        title: 'Fase 4: Puente de Simultaneidad',
        focus: 'Conciencia Unificada en el Presente',
        instruction: 'Une ambos campos: soy consciente de lo que ocurre dentro de mí mientras ocurre lo que ocurre fuera de mí.',
        internalCue: 'Observador consciente y presente.',
        externalCue: 'Integración plena con la realidad presente.'
      }
    ]
  },
  {
    id: '15min',
    title: 'Mediación Integral Profunda',
    subtitle: '15 Minutos de Metaconciencia y Exaptación Emocional',
    durationMinutes: 15,
    badge: '🌟 Práctica Avanzada',
    description: 'Exploración completa de los cuatro niveles: cuerpo, mente, sistema emocional puesto al servicio de la conciencia y presencia activa.',
    steps: [
      {
        minuteStart: 0,
        title: 'Fase 1: Anclaje y Propiocepción',
        focus: 'Enraizamiento Somático',
        instruction: 'Inicia con tres respiraciones profundas y conscientes. Recorre tu cuerpo desde la coronilla hasta las plantas de los pies.',
        internalCue: 'Habito mi cuerpo plenamente en este segundo.',
        externalCue: 'Siento el contacto con la gravedad y el soporte terrestre.'
      },
      {
        minuteStart: 4,
        title: 'Fase 2: Metacognición y Desfusión',
        focus: 'El Observador del Pensamiento',
        instruction: 'Observa la fábrica mental de pensamientos. Reconoce: "Estoy observando el pensamiento de...". Crea distancia saludable.',
        internalCue: 'Un pensamiento es solo un evento mental, no una orden.',
        externalCue: 'El espacio a mi alrededor contiene este instante.'
      },
      {
        minuteStart: 8,
        title: 'Fase 3: El Sistema Emocional al Servicio de la Conciencia',
        focus: 'Exaptación Emocional Lúcida',
        instruction: 'Detecta cualquier rastro emocional. En lugar de reaccionar, acógelo como datos informativos sobre tus valores y necesidades.',
        internalCue: '¿Qué me está informando esta emoción en este momento?',
        externalCue: 'Observo cómo el entorno interactúa con mi estado interno.'
      },
      {
        minuteStart: 12,
        title: 'Fase 4: Metaconciencia y Presencia 360°',
        focus: 'Observar al Observador',
        instruction: 'Descansa en el espacio que se da cuenta. Nota la conciencia misma que observa tanto lo interno como lo externo.',
        internalCue: 'Me doy cuenta de que soy el espacio consciente.',
        externalCue: 'Presente, lúcido y dispuesto a responder con sabiduría.'
      }
    ]
  }
];

export default function MAPPracticasMediacion() {
  const [selectedPractice, setSelectedPractice] = useState<'5min' | '10min' | '15min'>('10min');
  const [isRunning, setIsRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(10 * 60);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(null);

  const activeConfig = PRACTICES.find((p) => p.id === selectedPractice) || PRACTICES[1];

  useEffect(() => {
    const saved = localStorage.getItem('conexionluz_map_completed_practices');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompletedSessions(parsed.count || 0);
        setLastCompletedDate(parsed.lastDate || null);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    setIsRunning(false);
    setSecondsRemaining(activeConfig.durationMinutes * 60);
  }, [selectedPractice]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleSessionCompleted();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const handleSessionCompleted = () => {
    setIsRunning(false);
    const newCount = completedSessions + 1;
    const nowStr = new Date().toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    setCompletedSessions(newCount);
    setLastCompletedDate(nowStr);
    localStorage.setItem('conexionluz_map_completed_practices', JSON.stringify({
      count: newCount,
      lastDate: nowStr
    }));

    // Play subtle chime sound via Web Audio API if sound enabled
    if (soundEnabled && typeof window !== 'undefined') {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(528, ctx.currentTime); // 528Hz Solfeggio / calm bell
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 3);
        }
      } catch (e) {
        // AudioContext not allowed or unsupported
      }
    }
  };

  const elapsedSeconds = activeConfig.durationMinutes * 60 - secondsRemaining;
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  const currentStep = activeConfig.steps.slice().reverse().find((st) => elapsedMinutes >= st.minuteStart) || activeConfig.steps[0];

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercent = Math.round((elapsedSeconds / (activeConfig.durationMinutes * 60)) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/20 border border-teal-400/30 text-teal-200 px-3.5 py-1 rounded-full flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-teal-300" />
            SALA DE PRÁCTICAS DE MEDIACIÓN
          </span>
          <div className="flex items-center gap-2 text-xs text-teal-200 font-bold bg-white/10 px-3 py-1 rounded-xl">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{completedSessions} prácticas completadas</span>
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Prácticas Guiadas de Mediación
        </h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Entrena la capacidad de observar simultáneamente tu realidad interna y externa dentro de la experiencia presente. No se trata de poner la mente en blanco, sino de presenciar lo que ocurre con metaconciencia.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PRACTICES.map((p) => {
          const isSelected = p.id === selectedPractice;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPractice(p.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                  : 'bg-slate-50/80 hover:bg-white border-slate-200/80 text-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-black text-teal-700 uppercase tracking-wider">
                    {p.badge}
                  </span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-md bg-teal-50 border border-teal-100 text-teal-800">
                    {p.durationMinutes} MIN
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900">{p.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Practice Studio */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-black text-teal-700 uppercase tracking-wider">
              {activeConfig.badge}
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{activeConfig.title}</h3>
            <p className="text-xs text-slate-600 font-medium">{activeConfig.subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                soundEnabled 
                  ? 'bg-teal-50 border-teal-200 text-teal-700' 
                  : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}
              title={soundEnabled ? "Sonido de campana activado" : "Sonido desactivado"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                setSecondsRemaining(activeConfig.durationMinutes * 60);
              }}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all cursor-pointer"
              title="Reiniciar temporizador"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Circular Progress & Visual Anchor Stage */}
        <div className="flex flex-col items-center justify-center py-4 space-y-6">
          <div className="relative flex items-center justify-center">
            {/* Ambient Pulse Ring when Running */}
            {isRunning && (
              <div className="absolute inset-0 rounded-full bg-teal-400/20 animate-ping duration-1000 scale-110" />
            )}
            
            <div className="w-56 h-56 rounded-full bg-gradient-to-br from-teal-50 via-slate-50 to-indigo-50 border-4 border-teal-500/30 flex flex-col items-center justify-center shadow-inner relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-700">
                {isRunning ? 'Práctica en curso' : 'Listo para iniciar'}
              </span>
              <span className="text-4xl font-black text-slate-900 font-mono tracking-tight my-1">
                {formatTime(secondsRemaining)}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {progressPercent}% completado
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4" /> Pausar Práctica
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Iniciar Mediación
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Instructional Guidance Display */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-600 animate-pulse" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Fase Actual: {currentStep.title}
              </h4>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
              Foco: {currentStep.focus}
            </span>
          </div>

          <p className="text-sm font-semibold text-slate-800 leading-relaxed">
            {currentStep.instruction}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-1">
              <span className="text-[10px] font-black uppercase text-indigo-900 tracking-wider flex items-center gap-1.5">
                🧠 Observación Interna
              </span>
              <p className="text-xs text-indigo-800 font-medium leading-relaxed">
                "{currentStep.internalCue}"
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
              <span className="text-[10px] font-black uppercase text-emerald-900 tracking-wider flex items-center gap-1.5">
                🌍 Observación Externa
              </span>
              <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                "{currentStep.externalCue}"
              </p>
            </div>
          </div>
        </div>

        {/* Timeline of Steps */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">
            Estructura de la Práctica
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {activeConfig.steps.map((st, i) => {
              const isPastOrCurrent = elapsedMinutes >= st.minuteStart;
              return (
                <div
                  key={i}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    isPastOrCurrent
                      ? 'bg-teal-50/70 border-teal-200 text-teal-950 font-bold'
                      : 'bg-white border-slate-200 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-600">
                      Min {st.minuteStart}
                    </span>
                    {isPastOrCurrent && <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />}
                  </div>
                  <p className="font-bold text-xs truncate">{st.title}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
