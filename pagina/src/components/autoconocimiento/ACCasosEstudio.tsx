import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';

const CASES = [
  {
    id: 1,
    title: "Caso 1: Clarificación Vocacional y Valores",
    participant: "Marta, 31 años",
    context: "Marta siente insatisfacción constante en su trabajo corporativo aunque recibe un buen sueldo. Cambia frecuentemente de proyectos sin saber con certeza qué busca.",
    question: "¿Qué ejercicio de autoconocimiento le aportará mayor claridad sobre su malestar?",
    options: [
      { id: "a", text: "Realizar una Brújula de Valores para clarificar si su trabajo actual colisiona con sus prioridades de creatividad, autonomía y tiempo en familia.", feedback: "¡Excelente! Cuando nuestras decisiones diarias no respetan nuestros valores rectores, surge un vacío y una sensación de desorientación.", isCorrect: true },
      { id: "b", text: "Renunciar inmediatamente de forma impulsiva sin analizar qué necesita realmente.", feedback: "Incorrecto. Actuar impulsivamente sin autocomprensión suele repetir los mismos patrones en el nuevo empleo.", isCorrect: false },
      { id: "c", text: "Asumir que ella es incapaz de ser constante y conformarse con la frustración.", feedback: "Incorrecto. Encasillarse en juicios autocríticos bloquea la exploración constructiva.", isCorrect: false }
    ],
    keyInsight: "La claridad vocacional no surge de la nada; nace de alinear tus actividades diarias con tus valores innegociables."
  },
  {
    id: 2,
    title: "Caso 2: Dificultad para Reconocer Fortalezas",
    participant: "Javier, 28 años",
    context: "Javier recibe felicitaciones constantes de sus clientes, pero en su diálogo interno piensa: 'Fue solo suerte, en cualquier momento descubrirán que no sé nada'.",
    question: "¿Cómo puede Javier reestructurar su percepción mediante el autoconocimiento?",
    options: [
      { id: "a", text: "Utilizar el Observador de Pensamientos para contrastar la idea 'fue suerte' con la evidencia de su esfuerzo y crear un Inventario Personal de Fortalezas.", feedback: "¡Exacto! Reconocer objetivamente los recursos propios y desactivar la distorsión de descalificar lo positivo consolida una autoestima sana.", isCorrect: true },
      { id: "b", text: "Exigirse el doble de horas de trabajo para intentar demostrar su valía.", feedback: "Incorrecto. Aumentar la autoexigencia alimenta el ciclo de agotamiento e inseguridad.", isCorrect: false },
      { id: "c", text: "Fingir una falsa seguridad arrogante ante los demás.", feedback: "Incorrecto. La máscara de arrogancia aumenta la soledad y el miedo a equivocarse.", isCorrect: false }
    ],
    keyInsight: "Las fortalezas no se inventan; se descubren y validan a través de los hechos cotidianos."
  },
  {
    id: 3,
    title: "Caso 3: Establecimiento de Límites y Cuidado Personal",
    participant: "Lucía, 39 años",
    context: "Lucía acepta todas las peticiones laborales y favores familiares por miedo a parecer egoísta, terminando las semanas con fatiga extrema.",
    question: "¿Qué paso consciente le permitirá a Lucía cuidar su energía?",
    options: [
      { id: "a", text: "Diseñar su Mapa de Relaciones y Límites, practicando decir 'no puedo asumir esto hoy' desde el respeto mutuo y la autocompasión.", feedback: "¡Correcto! Poner límites claros no es egoísmo, es la condición necesaria para poder cuidar de uno mismo y de los demás.", isCorrect: true },
      { id: "b", text: "Desaparecer y cortar contacto con todos sus amigos y compañeros sin avisar.", feedback: "Incorrecto. La evitación drástica genera malentendidos y no entrena la asertividad.", isCorrect: false },
      { id: "c", text: "Seguir aceptando todo y quejarse amargamente en privado.", feedback: "Incorrecto. La resignación pasiva desgasta el cuerpo y acumula resentimiento.", isCorrect: false }
    ],
    keyInsight: "Decir 'no' a las demandas excesivas es decirte 'sí' a tu salud y bienestar."
  }
];

export default function ACCasosEstudio() {
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
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            🎯 ESCENARIOS DE INTROSPECCIÓN
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Casos de Estudio y Dilemas Personales</h2>
        <p className="text-indigo-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Analiza situaciones formativas ficticias para entrenar tu capacidad de aplicar las herramientas de autoconocimiento ante encrucijadas reales.
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
                ? 'bg-indigo-600 text-white shadow-xs'
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
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
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
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold'
                        : 'bg-rose-50 border-rose-200 text-rose-950 font-bold'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`h-6 w-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? (opt.isCorrect ? 'bg-indigo-600 text-white' : 'bg-rose-600 text-white') : 'bg-slate-100 text-slate-600'
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
            chosenObj.isCorrect ? 'bg-indigo-50 border-indigo-200 text-indigo-950' : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}>
            <div className="font-bold flex items-center gap-1.5">
              {chosenObj.isCorrect ? (
                <CheckCircle2 className="h-4 w-4 text-indigo-600" />
              ) : (
                <HelpCircle className="h-4 w-4 text-amber-600" />
              )}
              {chosenObj.feedback}
            </div>
            <p className="text-[11px] text-slate-600 border-t border-indigo-200/60 pt-1.5 mt-1">
              <strong>Clave de Autoconocimiento:</strong> {activeCase.keyInsight}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
