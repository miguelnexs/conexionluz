import React, { useState } from 'react';
import { 
  GitCommit, 
  ArrowDown, 
  Sparkles, 
  Eye, 
  Brain, 
  Compass, 
  Layers, 
  Radio, 
  CheckCircle2,
  Info
} from 'lucide-react';

interface StageNode {
  step: number;
  id: string;
  name: string;
  badge: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  icon: string;
  description: string;
  example: string;
  keyQuestion: string;
}

const STAGES: StageNode[] = [
  {
    step: 1,
    id: 'externa',
    name: '1. REALIDAD EXTERNA',
    badge: 'Acontecimiento',
    colorBg: 'bg-emerald-50',
    colorBorder: 'border-emerald-200',
    colorText: 'text-emerald-900',
    icon: '🌍',
    description: 'El entorno físico, los acontecimientos objetivos, las palabras de otra persona, los sonidos y el ambiente tal cual existen en el mundo.',
    example: 'Ej: Un compañero de trabajo cancela una reunión 5 minutos antes.',
    keyQuestion: '¿Qué ocurrió exactamente en los hechos objetivos sin mis juicios?'
  },
  {
    step: 2,
    id: 'percepcion',
    name: '2. PERCEPCIÓN',
    badge: 'Entrada Sensorial',
    colorBg: 'bg-teal-50',
    colorBorder: 'border-teal-200',
    colorText: 'text-teal-900',
    icon: '👁️',
    description: 'La captación de los estímulos a través de los órganos de los sentidos (vista, oído, tacto) y su transmisión inicial al sistema nervioso.',
    example: 'Ej: Leer el mensaje de texto en la pantalla y escuchar el tono de notificación.',
    keyQuestion: '¿Qué información sensorial directa captó mi cuerpo?'
  },
  {
    step: 3,
    id: 'interna',
    name: '3. EXPERIENCIA INTERNA',
    badge: 'Reacción Automática',
    colorBg: 'bg-indigo-50',
    colorBorder: 'border-indigo-200',
    colorText: 'text-indigo-900',
    icon: '🧠',
    description: 'El surgimiento inmediato de pensamientos espontáneos, memorias, interpretaciones, emociones y sensaciones fisiológicas automáticas.',
    example: 'Ej: Pensamiento: "No respeta mi tiempo". Emoción: Molestia. Sensación: Tensión en el cuello.',
    keyQuestion: '¿Qué se activó adentro mío de manera automática?'
  },
  {
    step: 4,
    id: 'observacion',
    name: '4. OBSERVACIÓN CONSCIENTE',
    badge: 'Pausa de Mediación',
    colorBg: 'bg-amber-50',
    colorBorder: 'border-amber-200',
    colorText: 'text-amber-900',
    icon: '🔍',
    description: 'El acto voluntario de notar lo que está ocurriendo dentro y fuera sin actuar inmediatamente por el impulso de la emoción o del pensamiento.',
    example: 'Ej: Detenerme 4 segundos, notar la molestia y no redactar una respuesta agresiva por impulso.',
    keyQuestion: '¿Puedo contemplar la emoción y el pensamiento sin fusionarme con ellos?'
  },
  {
    step: 5,
    id: 'metaconciencia',
    name: '5. METACONCIENCIA & EXAPTACIÓN',
    badge: 'Inteligencia de Conciencia',
    colorBg: 'bg-purple-50',
    colorBorder: 'border-purple-200',
    colorText: 'text-purple-900',
    icon: '🧬',
    description: 'La conciencia lúcida que comprende: "Me doy cuenta de que estoy sintiendo molestia porque valoro la puntualidad. Puedo usar esta emoción como información útil".',
    example: 'Ej: Reconozco que mi molestia señala mi necesidad de orden y claridad.',
    keyQuestion: '¿Qué información valiosa me aporta este momento para mi crecimiento?'
  },
  {
    step: 6,
    id: 'respuesta',
    name: '6. RESPUESTA CONSCIENTE',
    badge: 'Acción Deliberada',
    colorBg: 'bg-emerald-50',
    colorBorder: 'border-emerald-300',
    colorText: 'text-emerald-950',
    icon: '✨',
    description: 'La conducta elegida deliberadamente desde los valores, la asertividad y la presencia, en lugar de una reacción automática o impulsiva.',
    example: 'Ej: Escribir: "Entendido. Reprogramemos para mañana a primera hora para coordinar bien".',
    keyQuestion: '¿Cuál es la respuesta más sabia y constructiva en este presente?'
  }
];

export default function MAPMapaMediacion() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const selectedStage = STAGES.find((s) => s.step === activeStep) || STAGES[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/20 border border-teal-400/30 text-teal-200 px-3.5 py-1 rounded-full flex items-center gap-1.5">
            <GitCommit className="h-3.5 w-3.5 text-teal-300" />
            MODELO PEDAGÓGICO DE CONEXIÓNLUZ
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Mapa Secuencial de la Mediación
        </h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Visualiza el flujo que transforma una experiencia externa automática en una respuesta humana deliberada y consciente.
        </p>
      </div>

      {/* Epistemological Alert Notice */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-950 font-medium">
        <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Marco Pedagógico del Curso:</strong> Esta secuencia se presenta como un modelo didáctico propio desarrollado por ConexiónLuz para estructurar la práctica reflexiva, y no como un modelo universal de la neurociencia ni un axioma clínico.
        </p>
      </div>

      {/* Interactive Flow Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Sequential Step Chain (6 Cols) */}
        <div className="lg:col-span-6 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 px-2">
            La Secuencia Pedagógica
          </h3>

          <div className="space-y-2">
            {STAGES.map((st, idx) => {
              const isSelected = st.step === activeStep;
              return (
                <React.Fragment key={st.id}>
                  <button
                    onClick={() => setActiveStep(st.step)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                        : `${st.colorBg} ${st.colorBorder} hover:bg-white text-slate-700`
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{st.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">{st.name}</span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${st.colorBg} ${st.colorText}`}>
                            {st.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{st.description}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />}
                  </button>

                  {idx < STAGES.length - 1 && (
                    <div className="flex justify-center my-0.5">
                      <ArrowDown className="h-4 w-4 text-slate-300" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right: Step Deep Dive Card (6 Cols) */}
        <div className="lg:col-span-6 sticky top-4 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedStage.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase text-teal-700 tracking-wider">
                    Fase {selectedStage.step} de 6
                  </span>
                  <h3 className="text-xl font-black text-slate-900">{selectedStage.name}</h3>
                </div>
              </div>
              <span className={`text-xs font-black px-3 py-1 rounded-full ${selectedStage.colorBg} ${selectedStage.colorText} border ${selectedStage.colorBorder}`}>
                {selectedStage.badge}
              </span>
            </div>

            <div className="space-y-4 text-xs font-medium text-slate-700">
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  ¿Qué ocurre en esta etapa?
                </h4>
                <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                  {selectedStage.description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                <h4 className="text-[10px] font-black uppercase text-indigo-900 tracking-wider">
                  Ejemplo Práctico en la Vida Cotidiana:
                </h4>
                <p className="text-xs text-indigo-950 font-semibold leading-relaxed">
                  {selectedStage.example}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 space-y-1">
                <h4 className="text-[10px] font-black uppercase text-teal-900 tracking-wider">
                  Pregunta de Autoobservación Clave:
                </h4>
                <p className="text-xs text-teal-950 font-bold leading-relaxed">
                  "{selectedStage.keyQuestion}"
                </p>
              </div>
            </div>

            {/* Step Navigation */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                disabled={activeStep <= 1}
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold disabled:opacity-40"
              >
                ← Fase Anterior
              </button>
              <button
                disabled={activeStep >= STAGES.length}
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold disabled:opacity-40"
              >
                Siguiente Fase →
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
