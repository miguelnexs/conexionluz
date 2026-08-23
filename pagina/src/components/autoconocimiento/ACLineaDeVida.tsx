import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Edit3, Save, CheckCircle2, Sparkles, Flag, Calendar } from 'lucide-react';

type Milestone = {
  id: string;
  yearOrStage: string;
  event: string;
  meaning: string;
  emotion: string;
  learning: string;
  impactType: 'Transformador' | 'Desafiante' | 'Positivo' | 'Punto de Inflexión';
};

const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: "m-1",
    yearOrStage: "Infancia / Primeros Años",
    event: "Descubrimiento de la lectura y actividades creativas en solitario.",
    meaning: "El inicio de mi mundo reflexivo interior.",
    emotion: "Curiosidad y fascinación",
    learning: "Aprendí a disfrutar de mi propia compañía y a buscar respuestas en los libros.",
    impactType: "Positivo"
  },
  {
    id: "m-2",
    yearOrStage: "Adolescencia / Juventud",
    event: "Primera gran crisis vocacional y cambio de rumbo formativo.",
    meaning: "Romper con expectativas familiares y elegir mi propio camino.",
    emotion: "Incertidumbre inicial y posterior alivio",
    learning: "Que equivocarme es necesario para saber qué quiero de verdad.",
    impactType: "Punto de Inflexión"
  },
  {
    id: "m-3",
    yearOrStage: "Etapa Actual",
    event: "Inicio de este proceso estructurado de autoconocimiento en Conexión Luz.",
    meaning: "Priorizar mi bienestar emocional y la coherencia en mis relaciones.",
    emotion: "Esperanza y serenidad",
    learning: "Que conocerme es el mejor regalo para mí y para quienes me rodean.",
    impactType: "Transformador"
  }
];

export default function ACLineaDeVida() {
  const [milestones, setMilestones] = useState<Milestone[]>(DEFAULT_MILESTONES);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form
  const [yearOrStage, setYearOrStage] = useState('');
  const [event, setEvent] = useState('');
  const [meaning, setMeaning] = useState('');
  const [emotion, setEmotion] = useState('');
  const [learning, setLearning] = useState('');
  const [impactType, setImpactType] = useState<Milestone['impactType']>('Transformador');

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:ac_timeline');
    if (local) {
      try { setMilestones(JSON.parse(local)); } catch (e) {}
    }
  }, []);

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yearOrStage.trim() || !event.trim()) return;

    const newMilestone: Milestone = {
      id: Date.now().toString(),
      yearOrStage,
      event,
      meaning,
      emotion,
      learning,
      impactType
    };

    const updated = [...milestones, newMilestone];
    setMilestones(updated);
    localStorage.setItem('conexionluz:ac_timeline', JSON.stringify(updated));

    // Reset
    setYearOrStage('');
    setEvent('');
    setMeaning('');
    setEmotion('');
    setLearning('');

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDelete = (id: string) => {
    const updated = milestones.filter(m => m.id !== id);
    setMilestones(updated);
    localStorage.setItem('conexionluz:ac_timeline', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            ⏳ HERRAMIENTA CLAVE
          </span>
          <span className="text-xs text-indigo-300 font-bold">
            {milestones.length} Hitos Registrados
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Mi Línea de Vida Interactiva</h2>
        <p className="text-indigo-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Mapea cronológicamente los acontecimientos y etapas significativas de tu historia, reconociendo el significado personal y los aprendizajes que forjaron tu resiliencia.
        </p>
      </div>

      {/* Add New Milestone Form */}
      <form onSubmit={handleAddMilestone} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Plus className="h-4 w-4 text-indigo-600" /> Añadir Hito a Mi Historia Personal
          </h3>
          <span className="text-xs text-slate-400 font-bold">Cronología Privada</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Año o Etapa Vital</label>
            <input
              type="text"
              required
              value={yearOrStage}
              onChange={(e) => setYearOrStage(e.target.value)}
              placeholder="ej: 2018, A los 25 años, Niñez"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Emoción / Clima Afectivo</label>
            <input
              type="text"
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              placeholder="ej: Miedo, ilusión, asombro"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Tipo de Impacto</label>
            <select
              value={impactType}
              onChange={(e) => setImpactType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800"
            >
              <option value="Transformador">Transformador</option>
              <option value="Punto de Inflexión">Punto de Inflexión</option>
              <option value="Positivo">Positivo</option>
              <option value="Desafiante">Desafiante</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Acontecimiento o Suceso Clave
            </label>
            <textarea
              rows={2}
              required
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              placeholder="¿Qué hecho relevante ocurrió?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Significado Personal
            </label>
            <textarea
              rows={2}
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              placeholder="¿Qué representó para ti en ese momento?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-indigo-950 font-black">
            Aprendizaje o Recurso Descubierto a Través de esa Experiencia
          </label>
          <textarea
            rows={2}
            value={learning}
            onChange={(e) => setLearning(e.target.value)}
            placeholder="¿Qué lección vital o fortaleza personal emergió de este acontecimiento?"
            className="w-full bg-indigo-50/70 border border-indigo-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          {savedSuccess ? (
            <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ¡Hito agregado a tu línea de vida!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Tus vivencias te han traído hasta la persona sabia que eres hoy.</span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Registrar Hito
          </button>
        </div>
      </form>

      {/* Visual Chronological Timeline */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider px-1">
          Mi Trayectoria Vital ({milestones.length} Hitos)
        </h3>

        <div className="relative border-l-2 border-indigo-200 ml-4 space-y-6 pl-6 py-2">
          {milestones.map((m) => (
            <div key={m.id} className="relative bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-3">
              {/* Timeline Bullet */}
              <div className="absolute -left-[31px] top-6 h-4 w-4 rounded-full bg-indigo-600 border-4 border-white shadow-xs" />

              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-indigo-900 bg-indigo-50 px-3 py-0.5 rounded-full border border-indigo-100">
                    {m.yearOrStage}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {m.impactType}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(m.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{m.event}</h4>
                  {m.meaning && <p className="text-slate-600 mt-0.5 font-medium">{m.meaning}</p>}
                </div>

                {m.learning && (
                  <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                    <span className="font-bold text-indigo-950 uppercase text-[10px] block">Aprendizaje Clave:</span>
                    <p className="text-indigo-900 font-medium">{m.learning}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
