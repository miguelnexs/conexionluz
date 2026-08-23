import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  RotateCcw, 
  Brain, 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  Check, 
  X,
  Compass
} from 'lucide-react';

interface Question {
  id: number;
  domain: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }>;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    domain: 'Atención Plena',
    question: '¿En qué consiste fundamentalmente la atención plena según el enfoque pedagógico de ConexiónLuz?',
    options: [
      { id: 'a', text: 'Observar la experiencia presente con apertura y sin juicio, en lugar de intentar forzar la mente en blanco.', isCorrect: true, explanation: 'Exacto: la atención plena entrena la observación lúcida de la realidad presente, no la supresión artificial del pensamiento.' },
      { id: 'b', text: 'Entrar en un estado de trance místico donde se anula la percepción sensorial.', isCorrect: false, explanation: 'Incorrecto: no es un estado alterado ni esotérico, sino presencia consciente en la vida real.' },
      { id: 'c', text: 'Aislarse de todo estímulo sonoro o visual para no perturbarse.', isCorrect: false, explanation: 'Incorrecto: el entorno externo es parte fundamental del campo de observación.' }
    ]
  },
  {
    id: 2,
    domain: 'Mediación',
    question: '¿Cuál es el rasgo distintivo de la "Mediación" frente a la meditación tradicional de aislamiento?',
    options: [
      { id: 'a', text: 'La observación simultánea de la realidad interna (pensamientos, emociones, cuerpo) y la realidad externa (entorno, sonidos).', isCorrect: true, explanation: 'Correcto: la mediación entrena la simultaneidad para vivir despiertos dentro de la acción cotidiana.' },
      { id: 'b', text: 'La exigencia de no moverse durante horas en una postura específica de loto.', isCorrect: false, explanation: 'Incorrecto: no depende de posturas rígidas ni de inmovilidad forzada.' },
      { id: 'c', text: 'El olvido intencional de lo que ocurre en el entorno exterior.', isCorrect: false, explanation: 'Incorrecto: la mediación integra activamente el entorno en el presente.' }
    ]
  },
  {
    id: 3,
    domain: 'Metacognición',
    question: '¿Qué es la metacognición en la práctica del curso?',
    options: [
      { id: 'a', text: 'La habilidad de observar y reflexionar sobre los propios procesos de pensamiento ("¿Cómo estoy construyendo esta interpretación?").', isCorrect: true, explanation: '¡Correcto! Es la capacidad de pensar sobre el propio pensamiento y notar sesgos o suposiciones.' },
      { id: 'b', text: 'La memoria fotográfica para recordar datos del pasado.', isCorrect: false, explanation: 'Incorrecto: no es memorización, sino supervisión reflexiva del pensamiento.' },
      { id: 'c', text: 'La afirmación de que todo pensamiento que surge es siempre 100% verídico.', isCorrect: false, explanation: 'Incorrecto: precisamente permite cuestionar las interpretaciones automáticas.' }
    ]
  },
  {
    id: 4,
    domain: 'Metaconciencia',
    question: '¿Qué diferencia a la "Conciencia" básica de la "Metaconciencia"?',
    options: [
      { id: 'a', text: 'La conciencia experimenta el pensamiento ("estoy pensando"), mientras la metaconciencia se da cuenta de que está ocurriendo esa experiencia ("me doy cuenta de que estoy pensando").', isCorrect: true, explanation: 'Excelente distinción: la metaconciencia introduce una distancia lúcida que nos desengancha de la reacción ciega.' },
      { id: 'b', text: 'No existe ninguna diferencia, son términos idénticos.', isCorrect: false, explanation: 'Incorrecto: representan distintos niveles de perspectiva observacional.' },
      { id: 'c', text: 'La metaconciencia es un diagnóstico psiquiátrico de disociación.', isCorrect: false, explanation: 'Incorrecto: es una capacidad cognitiva humana saludable y entrenable.' }
    ]
  },
  {
    id: 5,
    domain: 'Observación del Pensamiento',
    question: '¿Qué logramos al reformular "No puedo hacer esto" a "Estoy observando el pensamiento de que no puedo hacer esto"?',
    options: [
      { id: 'a', text: 'Generar distancia observacional para no actuar automáticamente gobernados por una hipótesis mental transitoria.', isCorrect: true, explanation: 'Exacto: desacopla el evento mental de la conducta impulsiva.' },
      { id: 'b', text: 'Eliminar para siempre cualquier duda del cerebro.', isCorrect: false, explanation: 'Incorrecto: no elimina el pensamiento, sino que cambia nuestra relación con él.' },
      { id: 'c', text: 'Hacer que el pensamiento se vuelva realidad de forma mágica.', isCorrect: false, explanation: 'Incorrecto: evita precisamente el pensamiento mágico.' }
    ]
  },
  {
    id: 6,
    domain: 'Observación Emocional',
    question: '¿Cómo plantea el curso la relación con las emociones difíciles?',
    options: [
      { id: 'a', text: 'Como fuentes valiosas de información que deben ser sentidas, observadas y comprendidas antes de elegir una respuesta.', isCorrect: true, explanation: 'Brillante: las emociones no son enemigas ni mandatos incuestionables; son datos para la conciencia.' },
      { id: 'b', text: 'Como fallos biológicos que deben ser reprimidos de inmediato.', isCorrect: false, explanation: 'Incorrecto: la represión suele incrementar la reactividad.' },
      { id: 'c', text: 'Como impulsos obligatorios a los que debemos obedecer ciegamente.', isCorrect: false, explanation: 'Incorrecto: sentir no obliga a reaccionar sin pensar.' }
    ]
  },
  {
    id: 7,
    domain: 'Exaptación Emocional',
    question: '¿Qué significa metafóricamente "poner el sistema emocional al servicio de la conciencia"?',
    options: [
      { id: 'a', text: 'Cooptar la sensibilidad del sistema emocional para alimentar la metaconciencia y guiar decisiones más sabias y adaptativas.', isCorrect: true, explanation: '¡Correcto! Es la aplicación conceptual de la exaptación desarrollada para este curso.' },
      { id: 'b', text: 'Reemplazar las emociones por un algoritmo matemático frío.', isCorrect: false, explanation: 'Incorrecto: no busca la frialdad, sino la integración lúcida.' },
      { id: 'c', text: 'Creer que las emociones fueron diseñadas exclusivamente para meditar.', isCorrect: false, explanation: 'Incorrecto: el curso aclara el marco metafórico y formativo.' }
    ]
  },
  {
    id: 8,
    domain: 'Conciencia Corporal',
    question: '¿Por qué el cuerpo físico es considerado un ancla inmejorable para la mediación?',
    options: [
      { id: 'a', text: 'Porque las sensaciones fisiológicas y somáticas solo ocurren en el tiempo presente real.', isCorrect: true, explanation: 'Exacto: la mente viaja al pasado o futuro, pero el cuerpo físico solo habita el ahora.' },
      { id: 'b', text: 'Porque sustituye cualquier consulta o diagnóstico médico.', isCorrect: false, explanation: 'Incorrecto: la práctica somática es educativa y de presencia, no clínica.' },
      { id: 'c', text: 'Porque es insensible a los estímulos del ambiente.', isCorrect: false, explanation: 'Incorrecto: el cuerpo es sumamente sensible al entorno.' }
    ]
  },
  {
    id: 9,
    domain: 'Atención y Retorno',
    question: '¿Qué representa el instante en que notas que te has distraído durante la práctica?',
    options: [
      { id: 'a', text: 'El despertar de la metaconciencia que te brinda la oportunidad voluntaria de regresar al presente.', isCorrect: true, explanation: '¡Totalmente cierto! Notar la distracción es un éxito del observador, no un fracaso.' },
      { id: 'b', text: 'Una confirmación de que nunca podrás aprender a observar.', isCorrect: false, explanation: 'Incorrecto: distraerse es un proceso neurológico natural.' },
      { id: 'c', text: 'Una razón para abandonar el curso.', isCorrect: false, explanation: 'Incorrecto: el entrenamiento reside en el retorno amable.' }
    ]
  },
  {
    id: 10,
    domain: 'Integración en la Acción',
    question: '¿Cuál es la fórmula integral de la mediación cotidiana en ConexiónLuz?',
    options: [
      { id: 'a', text: 'CUERPO + PENSAMIENTO + EMOCIÓN + ENTORNO + ACCIÓN (Observar antes de responder).', isCorrect: true, explanation: '¡Excelente! Esa es la síntesis de la conciencia en acción.' },
      { id: 'b', text: 'Aislamiento total y desconexión social permanente.', isCorrect: false, explanation: 'Incorrecto: la meta es vivir plenamente conectados y lúcidos.' },
      { id: 'c', text: 'Actuar por impulso rápido sin importar las consecuencias.', isCorrect: false, explanation: 'Incorrecto: eso representa la reactividad automática.' }
    ]
  }
];

export default function MAPAutoevaluacion() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qId: number, optId: string) => {
    if (submitted) return;
    setAnswers({ ...answers, [qId]: optId });
  };

  const calculateScore = () => {
    let score = 0;
    QUESTIONS.forEach((q) => {
      const selected = q.options.find((o) => o.id === answers[q.id]);
      if (selected?.isCorrect) score += 1;
    });
    return score;
  };

  const isAllAnswered = QUESTIONS.every((q) => answers[q.id]);

  const score = calculateScore();
  const scorePercent = Math.round((score / QUESTIONS.length) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/20 border border-teal-400/30 text-teal-200 px-3.5 py-1 rounded-full flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-teal-300" />
            EVALUACIÓN FORMATIVA INTEGRAL
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Autoevaluación de Mediación y Metaconciencia
        </h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Explora tu asimilación de los principios de atención plena, mediación simultánea, metacognición y respuesta consciente. Este cuestionario tiene fines exclusivamente formativos y educativos.
        </p>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {QUESTIONS.map((q, idx) => {
          const selectedOptId = answers[q.id];
          const hasAnswered = Boolean(selectedOptId);

          return (
            <div key={q.id} className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                  Pregunta {idx + 1} de {QUESTIONS.length} · {q.domain}
                </span>
                {submitted && (
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    q.options.find(o => o.id === selectedOptId)?.isCorrect
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {q.options.find(o => o.id === selectedOptId)?.isCorrect ? 'Correcta' : 'Revisar'}
                  </span>
                )}
              </div>

              <h3 className="text-sm md:text-base font-black text-slate-900 leading-snug">
                {q.question}
              </h3>

              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isChosen = selectedOptId === opt.id;
                  let optStyle = 'bg-slate-50/80 hover:bg-slate-100 border-slate-200 text-slate-700';

                  if (isChosen && !submitted) {
                    optStyle = 'bg-teal-50 border-teal-500 text-teal-950 font-bold shadow-xs';
                  }

                  if (submitted) {
                    if (opt.isCorrect) {
                      optStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                    } else if (isChosen && !opt.isCorrect) {
                      optStyle = 'bg-rose-50 border-rose-300 text-rose-950 opacity-80';
                    } else {
                      optStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(q.id, opt.id)}
                      disabled={submitted}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all duration-200 cursor-pointer flex items-start gap-3 ${optStyle}`}
                    >
                      <span className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 font-black text-[10px] mt-0.5 ${
                        isChosen ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {opt.id.toUpperCase()}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold leading-relaxed">{opt.text}</p>
                        {submitted && (opt.isCorrect || isChosen) && (
                          <p className={`text-[11px] mt-2 font-medium ${opt.isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                            💡 {opt.explanation}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action and Results Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs text-center space-y-4">
        {!submitted ? (
          <div>
            <button
              disabled={!isAllAnswered}
              onClick={() => setSubmitted(true)}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-black text-sm shadow-md transition-all disabled:opacity-40 cursor-pointer"
            >
              Comprobar Respuestas
            </button>
            {!isAllAnswered && (
              <p className="text-xs text-slate-500 font-medium mt-2">
                Responde todas las preguntas para ver tus resultados y explicaciones pedagógicas.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-50 border-4 border-teal-200 text-teal-700 text-2xl font-black mx-auto">
              {scorePercent}%
            </div>
            <h3 className="text-xl font-black text-slate-900">
              {score >= 8 ? '¡Excelente Asimilación de los Principios!' : 'Buen Progreso en tu Aprendizaje'}
            </h3>
            <p className="text-xs text-slate-600 font-medium max-w-lg mx-auto leading-relaxed">
              Has acertado {score} de {QUESTIONS.length} preguntas ({scorePercent}%). Continúa reforzando tu práctica cotidiana con el Diario de Mediación y el Laboratorio de Metaconciencia.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setAnswers({});
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" /> Intentar de nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
