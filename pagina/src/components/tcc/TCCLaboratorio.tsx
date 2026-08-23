import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, CheckCircle2, Save, BookOpen, Layers, Brain } from 'lucide-react';

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
  { id: 1, name: "Laboratorio 1: El Modelo Cognitivo", description: "Práctica de descomposición de un acontecimiento en Situación → Pensamiento → Emoción → Conducta → Consecuencia." },
  { id: 2, name: "Laboratorio 2: Pensamientos Automáticos", description: "Detección de pensamientos ultrarrápidos involuntarios en situaciones de estrés o incertidumbre." },
  { id: 3, name: "Laboratorio 3: Distorsiones Cognitivas", description: "Identificación de sesgos de procesamiento (catastrofismo, sobregeneralización, lectura de mente)." },
  { id: 4, name: "Laboratorio 4: Registro de Pensamientos", description: "Completado del registro estructurado de 7 columnas para examinar la validez de las interpretaciones." },
  { id: 5, name: "Laboratorio 5: Reestructuración Cognitiva", description: "Formulación de preguntas socráticas para contrastar la evidencia fáctica y construir alternativas equilibradas." },
  { id: 6, name: "Laboratorio 6: Análisis Funcional ABC", description: "Evaluación de la triple contingencia: Antecedentes contextuales, Conducta emitida y Consecuencias reforzadoras." },
  { id: 7, name: "Laboratorio 7: Conductas de Evitación", description: "Mapeo de conductas de seguridad y evitación que alivian la incomodidad a corto plazo pero mantienen el malestar." },
  { id: 8, name: "Laboratorio 8: Resolución de Problemas", description: "Aplicación de la metodología sistemática de 7 pasos ante un desafío concreto y operativo." },
  { id: 9, name: "Laboratorio 9: Planificación y Activación Conductual", description: "Diseño de un cronograma gradual de actividades orientadas al placer, dominio y bienestar personal." },
  { id: 10, name: "Laboratorio 10: Caso Integrador TCC", description: "Formulación integral de un escenario ficticio aplicando todas las herramientas cognitivo-conductuales aprendidas." }
];

export default function TCCLaboratorio() {
  const [selectedLabId, setSelectedLabId] = useState<number>(1);
  const [logs, setLogs] = useState<Record<number, LabLog>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [activity, setActivity] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSpent, setTimeSpent] = useState('25 min');
  const [reflection, setReflection] = useState('');
  const [result, setResult] = useState('');
  const [observations, setObservations] = useState('');

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:tcc_labs');
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
      setTimeSpent(current.timeSpent || '25 min');
      setReflection(current.reflection || '');
      setResult(current.result || '');
      setObservations(current.observations || '');
    } else {
      const defaultLab = LABS.find(l => l.id === selectedLabId);
      setActivity(defaultLab ? defaultLab.name : '');
      setDate(new Date().toISOString().split('T')[0]);
      setTimeSpent('25 min');
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
    localStorage.setItem('conexionluz:tcc_labs', JSON.stringify(updated));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const completedCount = Object.keys(logs).length;
  const currentLab = LABS.find(l => l.id === selectedLabId) || LABS[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-cyan-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/30 border border-teal-400/40 text-teal-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Brain className="h-3 w-3" /> LABORATORIO PRÁCTICO TCC
          </span>
          <span className="text-xs text-teal-300 font-bold">
            {completedCount} de 10 Prácticas Registradas
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Laboratorio Cognitivo-Conductual</h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Espacio de autorreflexión y registro de ejercicios prácticos estructurados. Registra tus observaciones, análisis de pensamientos y experimentos de activación.
        </p>
      </div>

      {/* Grid Layout: Selector + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Lab Selector (4 Cols) */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 px-1 mb-2">
            Módulos de Laboratorio (1 al 10)
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

        {/* Right: Lab Form (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
          
          {/* Header of Active Lab */}
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

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-teal-600" /> Fecha del Ejercicio
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
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
                  placeholder="ej. 25 min"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Situación o Ejercicio Desarrollado
              </label>
              <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="Describe brevemente la situación o dinámica analizada"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reflexión del Modelo Cognitivo-Conductual
              </label>
              <textarea
                rows={4}
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="¿Qué pensamientos automáticos identificaste? ¿Qué distorsión o interpretación sesgada apareció? ¿Cómo influyó en tu emoción y conducta?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pensamiento Equilibrado o Alternativa de Acción
              </label>
              <textarea
                rows={3}
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="¿Cuál es la interpretación alternativa realista basada en evidencia? ¿Qué conducta alternativa constructiva se planificó?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 leading-relaxed"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div className="text-[11px] text-slate-500">
              {savedSuccess ? (
                <span className="text-teal-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> ¡Guardado en tu progreso local!
                </span>
              ) : (
                <span>Los datos quedan guardados en tu perfil de navegación.</span>
              )}
            </div>

            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Save className="h-4 w-4" /> Guardar Registro
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
