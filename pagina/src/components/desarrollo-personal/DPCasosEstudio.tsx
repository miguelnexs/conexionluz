import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2, ChevronRight, HelpCircle, ArrowRight } from 'lucide-react';

const CASES = [
  {
    id: 1,
    title: "Caso 1: Superando la Procrastinación y la Parálisis por Análisis",
    student: "Elena, 32 años",
    context: "Elena lleva tres meses postergando el inicio de su proyecto personal. Siente que necesita leer más libros y diseñar la web perfecta antes de dar el primer paso.",
    question: "¿Cuál es la intervención más constructiva desde el enfoque del desarrollo personal?",
    options: [
      { id: "a", text: "Esperar a tener el 100% de la información y la inspiración perfecta antes de empezar.", feedback: "Incorrecto. La perfección es una forma encubierta de evitación y procrastinación.", isCorrect: false },
      { id: "b", text: "Definir un micro-paso de 5 minutos y publicar un borrador mínimo viable esta semana.", feedback: "¡Exacto! La acción imperfecta genera retroalimentación real y activa la motivación intrínseca.", isCorrect: true },
      { id: "c", text: "Abandonar el proyecto asumiendo que no tiene suficiente fuerza de voluntad.", feedback: "Incorrecto. La procrastinación es un problema de gestión emocional, no de capacidad personal.", isCorrect: false }
    ],
    keyInsight: "La acción precede a la motivación. La regla del micro-paso reduce la fricción inicial."
  },
  {
    id: 2,
    title: "Caso 2: El Arte de Establecer Límites Asertivos",
    student: "Carlos, 28 años",
    context: "Carlos acepta sistemáticamente favores y tareas extra que le piden sus compañeros, llegando a casa exhausto y sin tiempo para sus propios proyectos.",
    question: "¿Cómo puede Carlos responder con asertividad sin caer en la agresividad ni en la sumisión?",
    options: [
      { id: "a", text: "Aceptar la tarea pero quejarse y mostrarse distante con sus compañeros.", feedback: "Incorrecto. La pasivo-agresividad deteriora los vínculos y mantiene el agotamiento.", isCorrect: false },
      { id: "b", text: "Decir con serenidad: 'Agradezco que confíes en mí, pero actualmente mi agenda está completa y no podré asumir esta tarea adicional'.", feedback: "¡Excelente! Comunica con claridad, respeto y firmeza sin necesidad de dar excusas excesivas.", isCorrect: true },
      { id: "c", text: "Explotar y gritar que todo el mundo abusa de su bondad.", feedback: "Incorrecto. La reactividad agresiva genera conflicto innecesario.", isCorrect: false }
    ],
    keyInsight: "Decir 'no' a las demandas ajenas es decirte 'sí' a tus prioridades y a tu autocuidado."
  },
  {
    id: 3,
    title: "Caso 3: Transformando la Autocrítica tras un Error",
    student: "Laura, 40 años",
    context: "Tras equivocarse en un informe, Laura se dice internamente: 'Siempre lo arruino todo, soy un desastre total'.",
    question: "¿Cómo reestructurar este diálogo interno hacia una perspectiva de crecimiento?",
    options: [
      { id: "a", text: "Reconocer: 'Cometí un error en este informe concreto; lo corregiré y aprenderé a revisar dos veces antes de enviar'.", feedback: "¡Correcto! Pasa de una etiqueta global descalificante a un hecho concreto con plan de aprendizaje.", isCorrect: true },
      { id: "b", text: "Ignorar el error y fingir que fue culpa de otra persona.", feedback: "Incorrecto. La evasión no genera responsabilidad ni madurez personal.", isCorrect: false },
      { id: "c", text: "Repetirse frases positivas irreales sin corregir el informe.", feedback: "Incorrecto. El optimismo ciego desconectado de la acción no soluciona el problema.", isCorrect: false }
    ],
    keyInsight: "Un error es un evento en el tiempo, no una definición de tu valor como persona."
  }
];

export default function DPCasosEstudio() {
  const [selectedCaseId, setSelectedCaseId] = useState(1);
  const [selectedOption, setSelectedOption] = useState<Record<number, string>>({});

  const activeCase = CASES.find(c => c.id === selectedCaseId) || CASES[0];
  const userChoice = selectedOption[activeCase.id];
  const chosenObj = activeCase.options.find(o => o.id === userChoice);

  const handleSelectOption = (optId: string) => {
    setSelectedOption({ ...selectedOption, [activeCase.id]: optId });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <BookOpen className="h-3 w-3" /> CASOS PRÁCTICOS
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Estudios de Caso y Escenarios de Crecimiento</h2>
        <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Analiza situaciones cotidianas reales y practica la toma de decisiones consciente, asertiva y orientada a valores.
        </p>
      </div>

      {/* Case Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CASES.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCaseId(c.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCaseId === c.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700'
            }`}
          >
            {c.title.split(':')[0]}
          </button>
        ))}
      </div>

      {/* Active Case Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            {activeCase.student}
          </span>
          <h3 className="text-lg font-black text-slate-900 mt-2">{activeCase.title}</h3>
        </div>

        {/* Context Box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          <strong>Contexto del Caso:</strong> {activeCase.context}
        </div>

        {/* Question & Options */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
            {activeCase.question}
          </h4>

          <div className="space-y-2">
            {activeCase.options.map((opt) => {
              const isSelected = userChoice === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer text-xs font-medium leading-relaxed ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                        : 'bg-rose-50 border-rose-200 text-rose-950 font-bold'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`h-6 w-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? (opt.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white') : 'bg-slate-100 text-slate-600'
                    }`}>
                      {opt.id.toUpperCase()}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Section */}
        {chosenObj && (
          <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 animate-in fade-in duration-200 ${
            chosenObj.isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}>
            <div className="font-bold flex items-center gap-1.5">
              {chosenObj.isCorrect ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <HelpCircle className="h-4 w-4 text-amber-600" />
              )}
              {chosenObj.feedback}
            </div>
            <p className="text-[11px] text-slate-600 border-t border-emerald-200/60 pt-1.5 mt-1">
              <strong>Clave Pedagógica:</strong> {activeCase.keyInsight}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
