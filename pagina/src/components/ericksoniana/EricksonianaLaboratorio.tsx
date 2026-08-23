import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, CheckCircle2, Save, BookOpen, Layers } from 'lucide-react';

type LabLog = {
  labId: number;
  activity: string;
  date: string;
  timeSpent: string;
  reflection: string;
  result: string;
  observations: string;
};

const LABS = [
  { id: 1, name: "Laboratorio 1: Observación", description: "Práctica de identificación de calibraciones fisiológicas, tono muscular, respiración y cambios de atención." },
  { id: 2, name: "Laboratorio 2: Rapport", description: "Práctica de sintonización empática, postura espejo y escucha activa sin juicio." },
  { id: 3, name: "Laboratorio 3: Pacing", description: "Construcción de afirmaciones descriptivas sobre la experiencia presente observable." },
  { id: 4, name: "Laboratorio 4: Leading", description: "Transición sutil desde el acompañamiento hacia invitaciones de reorientación." },
  { id: 5, name: "Laboratorio 5: Lenguaje Permisivo", description: "Reformulación de mandatos directos en sugerencias orientadas a posibilidades." },
  { id: 6, name: "Laboratorio 6: Presuposiciones", description: "Diseño de frases que presuponen el acceso natural a recursos internos." },
  { id: 7, name: "Laboratorio 7: Metáforas", description: "Construcción e hilo narrativo de cuentos analógicos de transformación." },
  { id: 8, name: "Laboratorio 8: Inducciones", description: "Práctica de guiones conversacionales y naturalistas por focalización." },
  { id: 9, name: "Laboratorio 9: Profundización", description: "Facilitación de trances cómodos y estabilización de la atención." },
  { id: 10, name: "Laboratorio 10: Diseño de Sesión", description: "Integración de las 10 etapas en una simulación estructurada." }
];

export default function EricksonianaLaboratorio() {
  const [selectedLabId, setSelectedLabId] = useState<number>(1);
  const [logs, setLogs] = useState<Record<number, LabLog>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [activity, setActivity] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSpent, setTimeSpent] = useState('20 min');
  const [reflection, setReflection] = useState('');
  const [result, setResult] = useState('');
  const [observations, setObservations] = useState('');

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:ericksoniana_labs');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        setLogs(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    const current = logs[selectedLabId];
    if (current) {
      setActivity(current.activity || '');
      setDate(current.date || new Date().toISOString().split('T')[0]);
      setTimeSpent(current.timeSpent || '20 min');
      setReflection(current.reflection || '');
      setResult(current.result || '');
      setObservations(current.observations || '');
    } else {
      setActivity('');
      setDate(new Date().toISOString().split('T')[0]);
      setTimeSpent('20 min');
      setReflection('');
      setResult('');
      setObservations('');
    }
  }, [selectedLabId, logs]);

  const handleSave = () => {
    const updated: LabLog = {
      labId: selectedLabId,
      activity: activity || `Práctica del ${LABS.find(l => l.id === selectedLabId)?.name}`,
      date,
      timeSpent,
      reflection,
      result,
      observations
    };
    const nextLogs = { ...logs, [selectedLabId]: updated };
    setLogs(nextLogs);
    localStorage.setItem('conexionluz:ericksoniana_labs', JSON.stringify(nextLogs));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const selectedLab = LABS.find(l => l.id === selectedLabId) || LABS[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-3 py-1 rounded-full">
            🧪 PRÁCTICA EXPERIENCIAL
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Laboratorio Ericksoniano</h2>
        <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Registra y documenta tus prácticas de observación, rapport, pacing, lenguaje permisivo y metáforas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lab Selector Sidebar */}
        <div className="space-y-2 lg:col-span-1">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 px-1 mb-2">
            Módulos de Práctica (1-10)
          </h3>
          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
            {LABS.map((lab) => {
              const isLogged = Boolean(logs[lab.id]?.reflection);
              const isActive = lab.id === selectedLabId;

              return (
                <button
                  key={lab.id}
                  onClick={() => setSelectedLabId(lab.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-2xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">{lab.name}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{lab.description}</div>
                  </div>
                  {isLogged && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lab Registration Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xs">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              {selectedLab.name}
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-2">{selectedLab.name}</h3>
            <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">{selectedLab.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-emerald-600" /> Nombre de la Actividad
              </label>
              <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="Ej: Ejercicio de Pacing verbal con acompañante"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-indigo-600" /> Fecha
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-amber-600" /> Tiempo de Práctica
              </label>
              <input
                type="text"
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                placeholder="Ej: 25 min"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              💭 Reflexión Personal
            </label>
            <textarea
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="¿Qué notaste durante la práctica? ¿Cómo fluyó la atención o la voz?"
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                🎯 Resultado Obtenido
              </label>
              <textarea
                rows={3}
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="Ej: Sincronización fluida, respuestas de relajación observadas."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                📝 Observaciones y Aprendizajes
              </label>
              <textarea
                rows={3}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Aspectos a pulir en la siguiente sesión de práctica."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4" /> Registro guardado correctamente
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">Los datos se guardan de forma segura en tu progreso local.</span>
            )}

            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Save className="h-4 w-4" /> Guardar Bitácora del Laboratorio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
