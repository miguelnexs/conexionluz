import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, CheckCircle2, Save, BookOpen, Layers, Compass, Sprout } from 'lucide-react';

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
  { id: 1, name: "Laboratorio 1: Mapa Personal de Identidad", description: "Mapeo de fortalezas, valores nucleares, intereses personales y áreas de crecimiento prioritarias." },
  { id: 2, name: "Laboratorio 2: Evidencias de Capacidad y Autoestima", description: "Identificación de logros pasados y transformación consciente del diálogo autocrítico en autoapoyo." },
  { id: 3, name: "Laboratorio 3: Jerarquía y Brújula de Valores", description: "Selección de los 5 valores rectores y examen de coherencia entre prioridades declaradas y tiempo real." },
  { id: 4, name: "Laboratorio 4: Diseño de Metas SMART", description: "Formulación de un objetivo clave desglosado en criterios específicos, medibles, alcanzables y temporales." },
  { id: 5, name: "Laboratorio 5: Arquitectura de Hábitos Sostenibles", description: "Diseño del bucle de hábito: optimización de la señal ambiental, rutina mínima de 2 minutos y recompensa." },
  { id: 6, name: "Laboratorio 6: Del Pensamiento a la Acción", description: "Desactivación de la procrastinación mediante la partición de grandes proyectos en micro-pasos inmediatos." },
  { id: 7, name: "Laboratorio 7: Autorregulación e Inteligencia Emocional", description: "Práctica de nombrar la emoción, validar su mensaje adaptativo y elegir una respuesta consciente." },
  { id: 8, name: "Laboratorio 8: Comunicación Asertiva y Límites", description: "Diseño de respuestas respetuosas para decir 'no' y expresar necesidades con claridad y empatía." },
  { id: 9, name: "Laboratorio 9: Resiliencia y Crecimiento ante Errores", description: "Reencuadre de una dificultad reciente identificando aprendizajes, recursos utilizados y flexibilidad mental." },
  { id: 10, name: "Laboratorio 10: Plan Maestro de Desarrollo Personal", description: "Integración de los 10 pilares en una visión coherente de vida con compromisos y métricas de avance." }
];

export default function DPLaboratorio() {
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
    const local = localStorage.getItem('conexionluz:dp_labs');
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
    localStorage.setItem('conexionluz:dp_labs', JSON.stringify(updated));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const completedCount = Object.keys(logs).length;
  const currentLab = LABS.find(l => l.id === selectedLabId) || LABS[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Sprout className="h-3 w-3" /> LABORATORIO DE CRECIMIENTO
          </span>
          <span className="text-xs text-emerald-300 font-bold">
            {completedCount} de 10 Prácticas Registradas
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Laboratorio de Desarrollo Personal</h2>
        <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Espacio de práctica y registro para consolidar tu autoconocimiento, alinear tus valores, construir hábitos y diseñar tu plan personal de crecimiento.
        </p>
      </div>

      {/* Grid: Selector + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Lab Selector (4 Cols) */}
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
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs font-bold'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`h-6 w-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {lab.id}
                    </span>
                    <span className="text-xs font-bold truncate">{lab.name}</span>
                  </div>
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-slate-200 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Lab Form (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
          
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                Ejercicio #{currentLab.id}
              </span>
              {logs[currentLab.id] && (
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
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
                  <Calendar className="h-3.5 w-3.5 text-emerald-600" /> Fecha
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-emerald-600" /> Tiempo de Reflexión
                </label>
                <input
                  type="text"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(e.target.value)}
                  placeholder="ej. 20 min"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Actividad o Enfoque Desarrollado
              </label>
              <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="Describe brevemente la actividad o reflexión realizada"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reflexión y Descubrimientos Personales
              </label>
              <textarea
                rows={4}
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="¿Qué aprendiste sobre ti mismo? ¿Qué patrones observaste? ¿Qué aspectos de tu diálogo interno o hábitos identificaste?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Acción Concreta o Compromiso de Práctica
              </label>
              <textarea
                rows={3}
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="¿Qué acción pequeña y específica vas a practicar a partir de esta reflexión?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div className="text-[11px] text-slate-500">
              {savedSuccess ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> ¡Guardado en tu perfil de aprendizaje!
                </span>
              ) : (
                <span>Tus reflexiones se guardan en tu navegador de forma privada.</span>
              )}
            </div>

            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Save className="h-4 w-4" /> Guardar en Mi Laboratorio
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
