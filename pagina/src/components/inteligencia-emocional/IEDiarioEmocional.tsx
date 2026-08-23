import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Save, Trash2, CheckCircle2, Heart } from 'lucide-react';

type EmotionalDiaryItem = {
  id: string;
  date: string;
  situation: string;
  emotion: string;
  intensity: number;
  thought: string;
  response: string;
  learning: string;
  strategyUsed: string;
};

export default function IEDiarioEmocional() {
  const [entries, setEntries] = useState<EmotionalDiaryItem[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [situation, setSituation] = useState('');
  const [emotion, setEmotion] = useState('');
  const [intensity, setIntensity] = useState(60);
  const [thought, setThought] = useState('');
  const [response, setResponse] = useState('');
  const [learning, setLearning] = useState('');
  const [strategyUsed, setStrategyUsed] = useState('Pausa Consciente');

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:ie_diary_entries');
    if (local) {
      try {
        setEntries(JSON.parse(local));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim() || !emotion.trim()) return;

    const newEntry: EmotionalDiaryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      situation,
      emotion,
      intensity,
      thought,
      response,
      learning,
      strategyUsed
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('conexionluz:ie_diary_entries', JSON.stringify(updated));

    // Reset
    setSituation('');
    setEmotion('');
    setThought('');
    setResponse('');
    setLearning('');

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('conexionluz:ie_diary_entries', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/30 border border-teal-400/40 text-teal-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            📔 MI DIARIO EMOCIONAL
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Diario de Registro Afectivo</h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Espacio confidencial para asentar tus experiencias emocionales cotidianas, evaluar las estrategias aplicadas y consolidar tu autoconocimiento.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-600" /> Nueva Entrada en Mi Diario
          </h3>
          <span className="text-xs text-slate-400 font-bold">{new Date().toLocaleDateString('es-ES')}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              1. Situación Desencadenante
            </label>
            <textarea
              rows={3}
              required
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="¿Qué ocurrió hoy que activó una emoción significativa?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              2. Pensamiento / Diálogo Interno
            </label>
            <textarea
              rows={3}
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="¿Qué pensaste automáticamente ante esa situación?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>

        {/* Emotion & Strategy */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Emoción</label>
              <input
                type="text"
                required
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                placeholder="ej: Decepción, Entusiasmo, Resentimiento"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                <span>Intensidad:</span>
                <span className="text-teal-700 font-black text-xs">{intensity} / 100</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Estrategia Utilizada</label>
              <select
                value={strategyUsed}
                onChange={(e) => setStrategyUsed(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
              >
                <option value="Pausa Consciente">Pausa Consciente</option>
                <option value="Respiración y Calma">Respiración y Calma</option>
                <option value="Reevaluación de Perspectiva">Reevaluación de Perspectiva</option>
                <option value="Expresión Asertiva">Expresión Asertiva</option>
                <option value="Escucha Empática">Escucha Empática</option>
                <option value="Límite Respetuoso">Límite Respetuoso</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Respuesta Conductual Realizada
            </label>
            <textarea
              rows={2}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="¿Cómo actuaste finalmente?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-teal-950 font-black">
              Aprendizaje para la Próxima Ocasión
            </label>
            <textarea
              rows={2}
              value={learning}
              onChange={(e) => setLearning(e.target.value)}
              placeholder="¿Qué lección extraes sobre ti o sobre tus vínculos?"
              className="w-full bg-teal-50/70 border border-teal-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {savedSuccess ? (
            <span className="text-xs font-bold text-teal-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ¡Entrada guardada en tu diario!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Tus entradas quedan guardadas de manera privada en tu navegador.</span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" /> Guardar Entrada
          </button>
        </div>
      </form>

      {/* History */}
      {entries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider px-1">
            Entradas del Diario ({entries.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">{item.date}</span>
                    <span className="text-[10px] font-bold text-slate-600">{item.emotion} ({item.intensity}%)</span>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">Situación:</span>
                    <p className="text-slate-800">{item.situation}</p>
                  </div>
                  <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-100">
                    <span className="font-bold text-teal-950 uppercase text-[10px] block">Estrategia & Aprendizaje ({item.strategyUsed}):</span>
                    <p className="text-teal-900 font-medium">{item.learning || item.response}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
