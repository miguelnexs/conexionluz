import React, { useState, useEffect } from 'react';
import { PauseCircle, Play, RotateCcw, Sparkles, CheckCircle2, Heart, Wind, Eye, Tag, CheckSquare } from 'lucide-react';

const STEPS = [
  {
    step: 1,
    name: "DETENERSE",
    icon: PauseCircle,
    desc: "Haz una pausa inmediata. Suelta lo que estés haciendo y no tomes decisiones apresuradas en este instante.",
    prompt: "Pon tus pies en el suelo, suelta los hombros y nota que estás en este momento presente."
  },
  {
    step: 2,
    name: "RESPIRAR",
    icon: Wind,
    desc: "Inhala suavemente por la nariz y exhala más lentamente por la boca para activar tu sistema parasimpático.",
    prompt: "Inhala en 4 segundos... y exhala en 6 segundos. Siente cómo tu ritmo cardíaco se suaviza."
  },
  {
    step: 3,
    name: "OBSERVAR",
    icon: Eye,
    desc: "Observa con curiosidad sin juzgarte: ¿Dónde sientes la emoción en el cuerpo? ¿Qué pensamientos pasan por tu mente?",
    prompt: "Escanea tu pecho, mandíbula y estómago. Permite que la sensación esté ahí sin intentar expulsarla a la fuerza."
  },
  {
    step: 4,
    name: "NOMBRAR",
    icon: Tag,
    desc: "Nombra con precisión lo que estás sintiendo: 'Siento frustración', 'Siento aprensión', 'Siento tristeza'.",
    prompt: "Poner palabras a la emoción reduce de inmediato la reactividad de la amígdala cerebral."
  },
  {
    step: 5,
    name: "ELEGIR",
    icon: CheckSquare,
    desc: "Pregúntate: ¿Cuál es la respuesta más sabia, amable y constructiva que puedo elegir ahora?",
    prompt: "Elige responder desde tus valores y dignidad, en lugar de reaccionar desde el impulso automático."
  }
];

export default function IEPausaConsciente() {
  const [currentStep, setCurrentStep] = useState(1);
  const [breathingPhase, setBreathingPhase] = useState<'Inhala' | 'Retén' | 'Exhala'>('Inhala');
  const [seconds, setSeconds] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            if (breathingPhase === 'Inhala') {
              setBreathingPhase('Retén');
              return 2;
            } else if (breathingPhase === 'Retén') {
              setBreathingPhase('Exhala');
              return 6;
            } else {
              setBreathingPhase('Inhala');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathingPhase]);

  const activeStepObj = STEPS.find(s => s.step === currentStep) || STEPS[0];
  const StepIcon = activeStepObj.icon;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/30 border border-teal-400/40 text-teal-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            🧘 ENTRENAMIENTO DE AUTORREGULACIÓN
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">La Pausa Consciente: 5 Pasos</h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          El protocolo breve para desactivar la reactividad automática ante momentos de tensión o desborde emocional.
        </p>
      </div>

      {/* Steps Navigation Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {STEPS.map((s) => {
          const isSelected = s.step === currentStep;
          const Icon = s.icon;
          return (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                isSelected
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon className="h-4 w-4" />
                <span className="text-[11px] font-black">{s.step}. {s.name}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xs text-center max-w-2xl mx-auto">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-16 w-16 rounded-3xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center shadow-inner">
            <StepIcon className="h-8 w-8" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-0.5 rounded-full border border-teal-100">
            Paso {activeStepObj.step} de 5
          </span>
          <h3 className="text-2xl font-black text-slate-900">{activeStepObj.name}</h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-lg">
            {activeStepObj.desc}
          </p>
        </div>

        {/* Breathing Animation Circle (Step 2 Highlight) */}
        {currentStep === 2 ? (
          <div className="p-6 bg-teal-50/50 rounded-3xl border border-teal-100 flex flex-col items-center space-y-4">
            <div className={`h-32 w-32 rounded-full border-4 border-teal-400 bg-teal-100/50 flex flex-col items-center justify-center transition-all duration-1000 ${
              breathingPhase === 'Inhala' ? 'scale-110 shadow-lg' : breathingPhase === 'Retén' ? 'scale-105' : 'scale-95 shadow-inner'
            }`}>
              <span className="text-sm font-black text-teal-950 uppercase">{breathingPhase}</span>
              <span className="text-2xl font-black text-teal-800">{seconds}s</span>
            </div>

            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              {isBreathingActive ? <PauseCircle className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isBreathingActive ? 'Pausar Guía Respiratoria' : 'Iniciar Guía Respiratoria'}
            </button>
          </div>
        ) : (
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 italic font-medium leading-relaxed">
            "{activeStepObj.prompt}"
          </div>
        )}

        {/* Step Progression Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
          >
            ← Paso Anterior
          </button>

          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Siguiente Paso →
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reiniciar Pausa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
