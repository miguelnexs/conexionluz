import React, { useState } from 'react';
import { Layers, ChevronRight, CheckCircle2, Save, Download, Sparkles } from 'lucide-react';

const STAGES = [
  { step: 1, title: "1. Preparación", goal: "Establecer encuadre seguro, consentimiento y objetivo claro.", hint: "Definir qué desea cultivar o explorar el consultante." },
  { step: 2, title: "2. Rapport", goal: "Construir sintonía comunicacional y presencia empática.", hint: "Ajustar tono vocal, ritmo y lenguaje no verbal." },
  { step: 3, title: "3. Observación", goal: "Identificar señales de calibración fisiológica observable.", hint: "Notar respiración, tono muscular y micro-cambios." },
  { step: 4, title: "4. Pacing", goal: "Acompañar la experiencia presente con afirmaciones indiscutibles.", hint: "Describir estímulos presentes ('Escuchas mi voz, sientes tu postura...')." },
  { step: 5, title: "5. Inducción", goal: "Orientar progresivamente la atención hacia la experiencia interna.", hint: "Invitar a cerrar los ojos o focalizar la mirada con lenguaje permisivo." },
  { step: 6, title: "6. Profundización", goal: "Facilitar la absorción cómoda en el trance ericksoniano.", hint: "Utilizar pausas, ritmo pausado y metáforas de descenso placentero." },
  { step: 7, title: "7. Intervención", goal: "Presentar metáforas y sugestiones permisivas orientadas a recursos.", hint: "Ofrecer cuentos análogos o sugestiones indirectas." },
  { step: 8, title: "8. Integración", goal: "Consolidar los aprendizajes y recursos descubiertos por el inconsciente.", hint: "Permitir un tiempo de asimilación tranquila." },
  { step: 9, title: "9. Salida", goal: "Facilitar el retorno gradual y cómodo al estado habitual de alerta.", hint: "Conteo regresivo pausado reorientando sensaciones y tono muscular." },
  { step: 10, title: "10. Cierre", goal: "Reflexión final y seguimiento práctico en la vida cotidiana.", hint: "Revisar impresiones conscientes sin sobre-analizar el trance." }
];

export default function EricksonianaSessionBuilder() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentStage = STAGES.find(s => s.step === activeStep) || STAGES[0];

  const handleNoteChange = (text: string) => {
    setNotes(prev => ({ ...prev, [activeStep]: text }));
  };

  const handleSaveAll = () => {
    localStorage.setItem('conexionluz:ericksoniana_session_design', JSON.stringify(notes));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-purple-500/30 border border-purple-400/40 text-purple-200 px-3 py-1 rounded-full">
            🛠️ ARQUITECTURA DE SESIÓN
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Constructor de Sesión Ericksoniana</h2>
        <p className="text-purple-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Diseña paso a paso la estructura de 10 etapas para una intervención comunicacional profesional.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stages Sidebar */}
        <div className="space-y-2 lg:col-span-1">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 px-1 mb-2">
            Las 10 Etapas de la Sesión
          </h3>
          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
            {STAGES.map((s) => {
              const isFilled = Boolean(notes[s.step]?.trim());
              const isActive = s.step === activeStep;

              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-purple-50 border-purple-300 text-purple-950 font-bold shadow-2xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">{s.title}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{s.goal}</div>
                  </div>
                  {isFilled && (
                    <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage Content & Note Editor */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xs">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
              Etapa {currentStage.step} de 10
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-2">{currentStage.title}</h3>
            <p className="text-xs font-bold text-slate-700 mt-1">Objetivo: {currentStage.goal}</p>
            <div className="mt-2 bg-purple-50/70 border border-purple-100 rounded-xl p-3 text-xs text-purple-900">
              💡 <strong>Sugerencia de diseño:</strong> {currentStage.hint}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ✍️ Tu Diseño Específico para esta Etapa:
            </label>
            <textarea
              rows={8}
              value={notes[activeStep] || ''}
              onChange={(e) => handleNoteChange(e.target.value)}
              placeholder={`Escribe aquí las frases, observaciones o metáforas que emplearás en la etapa de ${currentStage.title}...`}
              className="w-full text-xs sm:text-sm p-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans leading-relaxed select-text"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4" /> Diseño guardado en tu progreso
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">Diseño editable paso a paso.</span>
            )}

            <div className="flex items-center gap-2">
              {activeStep < 10 && (
                <button
                  onClick={() => setActiveStep(prev => Math.min(10, prev + 1))}
                  className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  <span>Siguiente Etapa</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}

              <button
                onClick={handleSaveAll}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Save className="h-4 w-4" /> Guardar Diseño Completo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
