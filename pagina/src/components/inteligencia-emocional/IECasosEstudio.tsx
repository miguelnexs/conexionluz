import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';

const CASES = [
  {
    id: 1,
    title: "Caso 1: Reacción Impulsiva ante una Crítica Laboral",
    participant: "Marcos, 35 años",
    context: "Durante una reunión de equipo, el supervisor señala varios errores en el informe de Marcos. Marcos siente calor en el rostro y ganas inmediatas de interrumpir a la defensiva.",
    question: "¿Cuál es la respuesta de mayor madurez e inteligencia emocional?",
    options: [
      { id: "a", text: "Hacer una pausa consciente de 3 respiraciones, escuchar la retroalimentación y responder: 'Agradezco los puntos señalados; los revisaré con calma para incorporar las mejoras necesarias'.", feedback: "¡Excelente! Desactiva la reactividad impulsiva, modula la respuesta somática y mantiene el profesionalismo.", isCorrect: true },
      { id: "b", text: "Interrumpir de inmediato acusando a otros compañeros de haber cometido los mismos fallos.", feedback: "Incorrecto. La defensividad impulsiva escala el conflicto y deteriora la reputación.", isCorrect: false },
      { id: "c", text: "Guardar silencio, mostrarse resentido y negarse a colaborar durante el resto del día.", feedback: "Incorrecto. La pasivo-agresividad bloquea la comunicación constructiva.", isCorrect: false }
    ],
    keyInsight: "Entre el estímulo y tu respuesta, la pausa consciente te devuelve la libertad de elegir."
  },
  {
    id: 2,
    title: "Caso 2: Acompañamiento Empático en un Momento de Duelo",
    participant: "Sofía, 29 años",
    context: "La mejor amiga de Sofía acaba de sufrir una ruptura sentimental y le dice llorando: 'Siento que nunca volveré a ser feliz'.",
    question: "¿Qué respuesta favorece la validación afectiva y la escucha empática?",
    options: [
      { id: "a", text: "Decirle: 'No llores, hay muchos peces en el mar y el tiempo todo lo cura rápidamente'.", feedback: "Incorrecto. Minimizar o invalidar el dolor ajeno genera sensación de soledad e incomprensión.", isCorrect: false },
      { id: "b", text: "Sentarse a su lado, sostener su mirada con afecto y decirle: 'Entiendo que ahora mismo sientas ese dolor tan inmenso. Estoy aquí contigo para lo que necesites'.", feedback: "¡Exacto! Valida la emoción sin apresurarse a forzar un optimismo artificial ni dar consejos no solicitados.", isCorrect: true },
      { id: "c", text: "Contarle inmediatamente una historia propia sobre una ruptura peor que vivió hace años.", feedback: "Incorrecto. Centrar la atención en uno mismo desvía el foco de la persona que sufre.", isCorrect: false }
    ],
    keyInsight: "La empatía consiste en hacer espacio al dolor del otro sin intentar 'arreglarlo' de golpe."
  },
  {
    id: 3,
    title: "Caso 3: Establecimiento de Límites en la Familia",
    participant: "David, 42 años",
    context: "Los familiares de David suelen opinar de forma no solicitada sobre sus decisiones personales, generando incomodidad recurrente.",
    question: "¿Cómo puede David poner un límite asertivo respetando a la familia?",
    options: [
      { id: "a", text: "Expresar con tranquilidad: 'Agradezco su preocupación y cariño, pero en este asunto prefiero tomar mi propia decisión y les pido que respeten mi espacio'.", feedback: "¡Correcto! Combina afecto, firmeza y claridad sin caer en el reproche ni en la sumisión.", isCorrect: true },
      { id: "b", text: "Dejar de hablar a la familia durante un año sin dar ninguna explicación.", feedback: "Incorrecto. La evitación radical no soluciona el problema de fondo ni enseña límites.", isCorrect: false },
      { id: "c", text: "Fingir que está de acuerdo con todo y quejarse amargamente con terceros.", feedback: "Incorrecto. La complacencia sumisa acumula resentimiento tóxico.", isCorrect: false }
    ],
    keyInsight: "Poner límites no es distanciarse, sino enseñar a los demás cómo cuidarte en la relación."
  }
];

export default function IECasosEstudio() {
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
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/30 border border-teal-400/40 text-teal-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            🎯 ESCENARIOS RELACIONALES
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Estudios de Caso y Resolución Afectiva</h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Analiza dilemas cotidianos de comunicación, empatía y autorregulación, observando las consecuencias de cada respuesta.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CASES.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCaseId(c.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCaseId === c.id
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700'
            }`}
          >
            {c.title.split(':')[0]}
          </button>
        ))}
      </div>

      {/* Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
            {activeCase.participant}
          </span>
          <h3 className="text-lg font-black text-slate-900 mt-2">{activeCase.title}</h3>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          <strong>Contexto:</strong> {activeCase.context}
        </div>

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
                        ? 'bg-teal-50 border-teal-300 text-teal-950 font-bold'
                        : 'bg-rose-50 border-rose-200 text-rose-950 font-bold'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`h-6 w-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? (opt.isCorrect ? 'bg-teal-600 text-white' : 'bg-rose-600 text-white') : 'bg-slate-100 text-slate-600'
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

        {chosenObj && (
          <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 animate-in fade-in duration-200 ${
            chosenObj.isCorrect ? 'bg-teal-50 border-teal-200 text-teal-950' : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}>
            <div className="font-bold flex items-center gap-1.5">
              {chosenObj.isCorrect ? (
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
              ) : (
                <HelpCircle className="h-4 w-4 text-amber-600" />
              )}
              {chosenObj.feedback}
            </div>
            <p className="text-[11px] text-slate-600 border-t border-teal-200/60 pt-1.5 mt-1">
              <strong>Clave de Inteligencia Emocional:</strong> {activeCase.keyInsight}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
