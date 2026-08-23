import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, CheckCircle2, Save, BookOpen, Layers, Heart, Activity } from 'lucide-react';

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
  { id: 1, name: "Laboratorio 1: Mi Punto de Partida Emocional", description: "Autoobservación del vocabulario afectivo, reacciones automáticas y objetivos de desarrollo." },
  { id: 2, name: "Laboratorio 2: Mapeo y Desencadenantes", description: "Desglose de la secuencia: Situación → Emoción → Intensidad → Pensamiento → Respuesta." },
  { id: 3, name: "Laboratorio 3: Calibración de Intensidad Afectiva", description: "Reconocimiento de señales somáticas tempranas de activación en la escala de 0 a 100." },
  { id: 4, name: "Laboratorio 4: El Filtro Interpretativo", description: "Exploración de interpretaciones alternativas ante situaciones ambiguas o desafiantes." },
  { id: 5, name: "Laboratorio 5: Práctica de la Pausa Consciente", description: "Entrenamiento del protocolo: Detener → Respirar → Observar → Nombrar → Elegir." },
  { id: 6, name: "Laboratorio 6: Autorregulación y Modulación", description: "Estrategias de tolerancia al malestar y desescalada psicofisiológica." },
  { id: 7, name: "Laboratorio 7: Empatía y Validación", description: "Práctica de escucha activa sin aconsejar apresuradamente ni juzgar la experiencia ajena." },
  { id: 8, name: "Laboratorio 8: Estructuración Asertiva", description: "Conversión de reacciones defensivas en expresiones claras de necesidades y peticiones." },
  { id: 9, name: "Laboratorio 9: Mediación y Resolución de Conflictos", description: "Separación del problema respecto a la persona y diseño de acuerdos constructivos." },
  { id: 10, name: "Laboratorio 10: Plan Maestro de Inteligencia Emocional", description: "Integración de hábitos de autorregulación y compromisos relacionales sostenibles." }
];

export default function IELaboratorio() {
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
    const local = localStorage.getItem('conexionluz:ie_labs');
    if (local) {
      try {
        setLogs(JSON.parse(local));
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
      const defaultLab = LABS.find(l => l.id === selectedLabId);
      setActivity(defaultLab ? defaultLab.name : '');
      setDate(new Date().toISOString().split('T')[0]);
      setTimeSpent('20 min');
      setReflection('');
      setResult('');
      setObservations('');
    }
  }, [selectedLabId, logs]);

  const handleSave = () => {
    const updated: Record<number, LabLog> = {
      ...logs,
      [selectedLabId]: {
        labId: selectedLabId,
        activity,
        date,
        timeSpent,
        reflection,
        result,
        observations
      }
    };
    setLogs(updated);
    localStorage.setItem('conexionluz:ie_labs', JSON.stringify(updated));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const completedCount = Object.keys(logs).length;
  const currentLab = LABS.find(l => l.id === selectedLabId) || LABS[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/30 border border-teal-400/40 text-teal-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Activity className="h-3 w-3" /> LABORATORIO EMOCIONAL
          </span>
          <span className="text-xs text-teal-300 font-bold">
            {completedCount} de 10 Prácticas Registradas
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Laboratorio de Inteligencia Emocional</h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Espacio experimental para entrenar el reconocimiento afectivo, la pausa consciente, la empatía y la comunicación asertiva en situaciones cotidianas.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Selector */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 px-1 mb-2">
            Módulos Prácticos (1 al 10)
          </h3>
          <div className="space-y-1.5">
            {LABS.map((lab) => {
              const isSelected = lab.id === selectedLabId;
              const isDone = Boolean(logs[lab.id]?.reflection);
              return (
                <button
                  key={lab.id}
                  onClick={() => setSelectedLabId(lab.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 border-teal-300 text-teal-950 shadow-xs font-bold'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`h-6 w-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {lab.id}
                    </span>
                    <span className="text-xs font-bold truncate">{lab.name}</span>
                  </div>
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 ml-2" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-slate-200 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                Ejercicio #{currentLab.id}
              </span>
              {logs[currentLab.id] && (
                <span className="text-[11px] text-teal-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Registrado
                </span>
              )}
            </div>
            <h3 className="text-xl font-black text-slate-900">{currentLab.name}</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">{currentLab.description}</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-teal-600" /> Fecha
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-teal-600" /> Tiempo de Práctica
                </label>
                <input
                  type="text"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(e.target.value)}
                  placeholder="ej. 20 min"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Situación o Enfoque de Práctica
              </label>
              <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="Describe la situación cotidiana en la que aplicaste el ejercicio"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Observación y Descubrimientos Afectivos
              </label>
              <textarea
                rows={4}
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="¿Qué sensaciones somáticas notaste? ¿Qué pensamientos surgieron? ¿Cómo influyó la emoción en tu tendencia de acción?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estrategia Aplicada y Aprendizaje Relacional
              </label>
              <textarea
                rows={3}
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="¿Qué respuesta consciente elegiste y qué aprendiste para futuras interacciones?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20 leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div className="text-[11px] text-slate-500">
              {savedSuccess ? (
                <span className="text-teal-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> ¡Práctica registrada en tu perfil!
                </span>
              ) : (
                <span>Tus reflexiones se guardan de forma privada en tu navegador.</span>
              )}
            </div>

            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Save className="h-4 w-4" /> Guardar en Mi Laboratorio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
