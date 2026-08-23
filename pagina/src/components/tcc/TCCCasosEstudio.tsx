import React, { useState } from 'react';
import { BookOpen, CheckCircle2, HelpCircle, Sparkles, Brain, ArrowRight } from 'lucide-react';

const CASES = [
  {
    id: 1,
    title: "Caso 1: Dificultad para iniciar un informe académico / laboral",
    profile: "Escenario Ficticio: Persona adulta que posterga reiteradamente la redacción de un documento clave porque experimenta ansiedad cada vez que se sienta frente a la pantalla en blanco.",
    breakdown: {
      situation: "Sentarse frente al ordenador para redactar la primera página.",
      thought: "'Tiene que quedar impecable desde el inicio; si no está perfecto, no sirvo para este trabajo.'",
      emotion: "Ansiedad (85/100) y frustración.",
      behavior: "Cerrar el archivo, abrir redes sociales y limpiar el escritorio.",
      consequence: "Alivio temporal inmediato, pero aumento exponencial de la culpa y retraso acumulado."
    },
    questions: [
      {
        q: "¿Qué distorsión cognitiva predomina en el pensamiento automático?",
        options: [
          "Pensamiento Dicotómico (Todo o nada) y Tiranía de los 'Debería'.",
          "Lectura de mente.",
          "Pensamiento mágico."
        ],
        correct: 0,
        explanation: "La exigencia de perfección absoluta sin admitir un primer borrador imperfecto genera parálisis por sobreexigencia."
      },
      {
        q: "¿Qué intervención de la TCC es la más adecuada para desbloquear la conducta?",
        options: [
          "Activación conductual por pasos mínimos: escribir un borrador deliberadamente imperfecto durante solo 10 minutos.",
          "Esperar semanas hasta que la inspiración y la motivación aparezcan solas.",
          "Insultarse a uno mismo para forzar la disciplina."
        ],
        correct: 0,
        explanation: "La acción precede a la motivación. Reducir la exigencia y permitir un borrador inicial desactiva la respuesta de evitación."
      }
    ]
  },
  {
    id: 2,
    title: "Caso 2: Inseguridad y lectura de mente en reuniones de equipo",
    profile: "Escenario Ficticio: Integrante de un equipo de trabajo que guarda silencio en las reuniones semanales por temor a hacer el ridículo.",
    breakdown: {
      situation: "El facilitador de la reunión pide opiniones abiertas sobre una propuesta.",
      thought: "'Si hablo, se notará mi nerviosismo y todos pensarán que no domino el tema.'",
      emotion: "Temor (75/100), taquicardia y rubor facial.",
      behavior: "Mirar hacia abajo, no levantar la mano y permanecer en silencio.",
      consequence: "Disminución inmediata del riesgo percibido, pero frustración y sensación de invisibilidad posterior."
    },
    questions: [
      {
        q: "¿Qué evidencia fáctica objetiva cuestiona el pensamiento automático?",
        options: [
          "En reuniones anteriores, cuando ha intervenido brevemente, los compañeros han escuchado con respeto y tomado notas útiles.",
          "Ninguna, porque es seguro que todos juzgan duramente siempre.",
          "Solo la suerte evitó problemas en el pasado."
        ],
        correct: 0,
        explanation: "Revisar la evidencia histórica objetiva desmantela la inferencia arbitraria de catástrofe social."
      }
    ]
  },
  {
    id: 3,
    title: "Caso 3: Descalificación de los propios logros y síndrome del impostor",
    profile: "Escenario Ficticio: Profesional que recibe una felicitación formal por liderar un proyecto exitoso pero atribuye el resultado a la casualidad.",
    breakdown: {
      situation: "El director general le envía un correo felicitándole por las métricas alcanzadas.",
      thought: "'Cualquiera lo habría hecho; tuve suerte con los clientes que me asignaron.'",
      emotion: "Inseguridad (60/100) e incomodidad.",
      behavior: "Minimizar el mérito ante sus colegas diciendo 'no fue nada especial'.",
      consequence: "Dificultad para consolidar la autoeficacia y autoexigencia desmedida."
    },
    questions: [
      {
        q: "¿Qué alternativa de pensamiento equilibrado promueve la TCC?",
        options: [
          "Reconocer las horas de planificación, esfuerzo y habilidades técnicas aplicadas, aceptando que la suerte puede influir pero el mérito propio es real.",
          "Creer que uno es un genio infalible superior a todos los demás.",
          "Ignorar los datos del informe y renunciar al empleo."
        ],
        correct: 0,
        explanation: "El pensamiento equilibrado integra la evidencia de las propias competencias sin caer en la grandiosidad ni en la autodescalificación."
      }
    ]
  }
];

export default function TCCCasosEstudio() {
  const [selectedCaseId, setSelectedCaseId] = useState<number>(1);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  const currentCase = CASES.find(c => c.id === selectedCaseId) || CASES[0];

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [`${selectedCaseId}-${qIdx}`]: optIdx
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/30 border border-teal-400/40 text-teal-200 px-3 py-1 rounded-full">
            📖 CASOS DE ESTUDIO FICTICIOS
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Biblioteca de Casos Clínico-Educativos</h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Analiza escenarios pedagógicos basados en situaciones humanas comunes. Practica la formulación cognitivo-conductual sin emitir juicios ni diagnósticos.
        </p>
      </div>

      {/* Case Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {CASES.map((c) => {
          const isSelected = c.id === selectedCaseId;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700'
              }`}
            >
              {c.title.split(':')[0]}
            </button>
          );
        })}
      </div>

      {/* Active Case Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div>
          <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
            Análisis de Caso Pedagógico #{currentCase.id}
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-2">{currentCase.title}</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">{currentCase.profile}</p>
        </div>

        {/* Cognitive Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">1. Situación:</span>
            <p className="text-xs text-slate-800 font-medium mt-0.5">{currentCase.breakdown.situation}</p>
          </div>

          <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl">
            <span className="text-[10px] font-bold text-rose-700 uppercase block">2. Pensamiento Automático:</span>
            <p className="text-xs text-rose-950 font-medium mt-0.5 italic">{currentCase.breakdown.thought}</p>
          </div>

          <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl">
            <span className="text-[10px] font-bold text-indigo-700 uppercase block">3. Emoción:</span>
            <p className="text-xs text-indigo-950 font-medium mt-0.5">{currentCase.breakdown.emotion}</p>
          </div>

          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl sm:col-span-2 lg:col-span-1">
            <span className="text-[10px] font-bold text-amber-700 uppercase block">4. Conducta de Evitación:</span>
            <p className="text-xs text-amber-950 font-medium mt-0.5">{currentCase.breakdown.behavior}</p>
          </div>

          <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-2xl sm:col-span-2 lg:col-span-2">
            <span className="text-[10px] font-bold text-teal-800 uppercase block">5. Consecuencia (Ciclo de Mantenimiento):</span>
            <p className="text-xs text-teal-950 font-medium mt-0.5">{currentCase.breakdown.consequence}</p>
          </div>
        </div>

        {/* Formulative Questions */}
        <div className="border-t border-slate-100 pt-6 space-y-6">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Brain className="h-4 w-4 text-teal-600" /> Preguntas de Formulación y Análisis:
          </h4>

          <div className="space-y-6">
            {currentCase.questions.map((qItem, qIdx) => {
              const selectedOpt = userAnswers[`${selectedCaseId}-${qIdx}`];
              const hasAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === qItem.correct;

              return (
                <div key={qIdx} className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <p className="text-xs font-bold text-slate-800">{qItem.q}</p>

                  <div className="space-y-2">
                    {qItem.options.map((opt, oIdx) => {
                      const isThisSelected = selectedOpt === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(qIdx, oIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                            isThisSelected
                              ? oIdx === qItem.correct
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                                : 'bg-rose-50 border-rose-300 text-rose-950 font-bold'
                              : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span>{opt}</span>
                          {isThisSelected && (
                            oIdx === qItem.correct 
                              ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />
                              : <span className="text-xs text-rose-600 font-black shrink-0 ml-2">✕</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {hasAnswered && (
                    <div className={`p-3 rounded-xl text-xs leading-relaxed mt-2 border ${
                      isCorrect ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      <strong className="block mb-0.5">{isCorrect ? '✓ ¡Excelente análisis!' : '💡 Retroalimentación pedagógica:'}</strong>
                      {qItem.explanation}
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
