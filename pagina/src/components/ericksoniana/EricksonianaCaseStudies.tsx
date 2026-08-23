import React, { useState } from 'react';
import { BookOpen, CheckCircle2, HelpCircle, ShieldAlert, Sparkles } from 'lucide-react';

const CASES = [
  {
    id: 1,
    title: "Caso 1: Dificultad para relajarse conscientemente",
    profile: "Escenario Ficticio: Persona adulta que manifiesta analitismo elevado y frustración al intentar 'forzar' la relajación en silencio.",
    questions: [
      {
        q: "¿Qué estrategia de observación y pacing es la más adecuada?",
        options: [
          "Acompañar la respiración rápida actual y utilizar la misma hipervigilancia consciente como foco de atención.",
          "Ordenar de forma autoritaria que deje de pensar inmediatamente.",
          "Ignorar su estado y pedirle que se duerma en 3 segundos."
        ],
        correct: 0,
        explanation: "En la utilización ericksoniana, se acepta la hipervigilancia del sujeto y se le da una tarea atencional (ej: notar en qué parte de los ojos siente la tensión) para transformar la resistencia en foco."
      },
      {
        q: "¿Qué tipo de lenguaje y metáfora resultaría más respetuoso?",
        options: [
          "Frases imperativas directas sin margen de libre elección.",
          "Lenguaje permisivo e indirecto con metáforas sobre elementos que se adaptan suavemente (ej: el junco ante la brisa o el agua buscando su cauce).",
          "Una confrontación agresiva sobre su rigidez mental."
        ],
        correct: 1,
        explanation: "Las metáforas de adaptación natural permiten sortear la barrera analítica sin forzar la mente consciente."
      }
    ]
  },
  {
    id: 2,
    title: "Caso 2: Deseo de mejorar concentración y foco de estudio",
    profile: "Escenario Ficticio: Estudiante que experimenta dispersión atencional y dudas sobre su capacidad de retención.",
    questions: [
      {
        q: "¿Cómo establecer rapport y presuposiciones constructivas?",
        options: [
          "Presuponer que la mente inconsciente ya sabe cómo procesar y almacenar información como cuando aprendió a andar en bicicleta.",
          "Decirle que su mente no funciona bien.",
          "Exigir que memorice guiones sin comprenderlos."
        ],
        correct: 0,
        explanation: "Conectar con aprendizajes automáticos del pasado (como andar en bicicleta o leer) reactiva la confianza en la capacidad natural del inconsciente."
      }
    ]
  },
  {
    id: 3,
    title: "Caso 3: Bloqueo frente a un objetivo personal",
    profile: "Escenario Ficticio: Persona con postergación recurrente de un proyecto creativo por temor al error.",
    questions: [
      {
        q: "¿Qué aproximación ericksoniana ayuda a desbloquear la perspectiva?",
        options: [
          "Utilizar una metáfora sobre el desarrollo de una semilla bajo tierra que no apresura la brotación pero crece con firmeza.",
          "Regañar a la persona por su postergación.",
          "Garantizarle un éxito financiero automático."
        ],
        correct: 0,
        explanation: "Las metáforas de crecimiento biológico ofrecen un ritmo de asimilación sin juzgar ni presionar por resultados inmediatos."
      }
    ]
  },
  {
    id: 4,
    title: "Caso 4: Desarrollo de recursos de autoconfianza",
    profile: "Escenario Ficticio: Persona en búsqueda de presencia y serenidad en situaciones de evaluación profesional.",
    questions: [
      {
        q: "¿Cómo estructurar una sugerencia de utilización de recursos?",
        options: [
          "Invitar a recuperar sensaciones de seguridad de momentos pasados no relacionados y proyectarlas en el escenario futuro.",
          "Dar una orden fija de que ya no sentirá ningún tipo de emoción.",
          "Afirmar que los problemas no existen."
        ],
        correct: 0,
        explanation: "La transposición de recursos pasados a situaciones futuras es una técnica ericksoniana clásica de reasociación positiva."
      }
    ]
  }
];

export default function EricksonianaCaseStudies() {
  const [selectedCaseId, setSelectedCaseId] = useState<number>(1);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  const activeCase = CASES.find(c => c.id === selectedCaseId) || CASES[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-3 py-1 rounded-full">
            📚 ANÁLISIS DE CASOS
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Casos de Estudio Hipotéticos</h2>
        <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Analiza escenarios pedagógicos ficticios y toma decisiones guiadas sobre observación, rapport, lenguaje y estructuración de la metáfora.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case Selector Sidebar */}
        <div className="space-y-2 lg:col-span-1">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 px-1 mb-2">
            Casos Disponibles (1-4)
          </h3>
          <div className="space-y-1.5">
            {CASES.map((c) => {
              const isActive = c.id === selectedCaseId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-2xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{c.title}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{c.profile}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Case Detail and Questions */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              Escenario Ficticio Pedagógico
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-2">{activeCase.title}</h3>
            <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">{activeCase.profile}</p>
          </div>

          <div className="space-y-6">
            {activeCase.questions.map((qObj, qIdx) => {
              const key = `${activeCase.id}-${qIdx}`;
              const selectedOpt = userAnswers[key];
              const isSubmitted = selectedOpt !== undefined;

              return (
                <div key={qIdx} className="space-y-3 p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                  <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-start gap-2">
                    <span className="h-5 w-5 rounded-md bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                      {qIdx + 1}
                    </span>
                    <span>{qObj.q}</span>
                  </div>

                  <div className="space-y-2 pt-1">
                    {qObj.options.map((optText, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      const isCorrect = optIdx === qObj.correct;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => setUserAnswers(prev => ({ ...prev, [key]: optIdx }))}
                          className={`w-full text-left text-xs p-3 rounded-xl border transition-all cursor-pointer ${
                            isChosen
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                                : 'bg-rose-50 border-rose-300 text-rose-950 font-bold'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          {optText}
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <div className={`p-4 rounded-xl text-xs space-y-1 animate-in fade-in ${
                      selectedOpt === qObj.correct ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                      <strong className="block font-bold">
                        {selectedOpt === qObj.correct ? '✓ Elección Ericksoniana Adecuada' : 'ℹ️ Análisis Pedagógico'}
                      </strong>
                      <p>{qObj.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
