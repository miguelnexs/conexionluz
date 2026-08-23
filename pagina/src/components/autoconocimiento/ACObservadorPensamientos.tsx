import React, { useState, useEffect } from 'react';
import { Eye, Sparkles, Save, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';

type ThoughtEntry = {
  id: string;
  date: string;
  situation: string;
  thought: string;
  emotion: string;
  interpretation: string;
  alternativePerspective: string;
};

export default function ACObservadorPensamientos() {
  const [entries, setEntries] = useState<ThoughtEntry[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form
  const [situation, setSituation] = useState('');
  const [thought, setThought] = useState('');
  const [emotion, setEmotion] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [alternativePerspective, setAlternativePerspective] = useState('');

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:ac_thought_observer');
    if (local) {
      try { setEntries(JSON.parse(local)); } catch (e) {}
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim() || !thought.trim()) return;

    const newEntry: ThoughtEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      situation,
      thought,
      emotion,
      interpretation,
      alternativePerspective
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('conexionluz:ac_thought_observer', JSON.stringify(updated));

    // Reset
    setSituation('');
    setThought('');
    setEmotion('');
    setInterpretation('');
    setAlternativePerspective('');

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('conexionluz:ac_thought_observer', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            👁️ HERRAMIENTA CLAVE
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">El Observador de Pensamientos</h2>
        <p className="text-indigo-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Aprende a observar tu diálogo interno como hipótesis y no como hechos absolutos, generando perspectivas alternativas más flexibles y compasivas.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600" /> Registro de Observación Cognitiva
          </h3>
          <span className="text-xs text-slate-400 font-bold">{new Date().toLocaleDateString('es-ES')}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              1. Situación (¿Qué hecho ocurrió?)
            </label>
            <textarea
              rows={3}
              required
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="Describe el hecho objetivo sin emitir juicios..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              2. Pensamiento Automático (¿Qué te dijiste a ti mismo?)
            </label>
            <textarea
              rows={3}
              required
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="ej: 'No voy a ser capaz', 'Seguro que están disconformes conmigo'..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              3. Emoción Consecuente (¿Qué sentiste?)
            </label>
            <input
              type="text"
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              placeholder="ej: Inseguridad, aprensión, frustración"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              4. Interpretación / Suposición Implícita
            </label>
            <input
              type="text"
              value={interpretation}
              onChange={(e) => setInterpretation(e.target.value)}
              placeholder="ej: Asumo que si cometo un error perderé todo el respeto"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-indigo-950 font-black flex items-center gap-1.5">
            <RefreshCw className="h-4 w-4 text-indigo-600" /> 5. Perspectiva Alternativa y Compasiva
          </label>
          <textarea
            rows={2}
            value={alternativePerspective}
            onChange={(e) => setAlternativePerspective(e.target.value)}
            placeholder="ej: Este reto es nuevo para mí; cometer errores es parte del aprendizaje y tengo recursos para resolverlo paso a paso..."
            className="w-full bg-indigo-50/70 border border-indigo-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          {savedSuccess ? (
            <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ¡Observación cognitiva guardada!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Observar sin identificarte te devuelve la calma y la claridad.</span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" /> Guardar Observación
          </button>
        </div>
      </form>

      {/* History */}
      {entries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider px-1">
            Mis Registros de Pensamiento ({entries.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-full">{entry.date}</span>
                    <span className="text-[10px] font-bold text-slate-600">{entry.emotion}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">Situación:</span>
                    <p className="text-slate-800">{entry.situation}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">Pensamiento Inicial:</span>
                    <p className="text-slate-700 italic">"{entry.thought}"</p>
                  </div>
                  <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100">
                    <span className="font-bold text-indigo-950 uppercase text-[10px] block">Perspectiva Alternativa:</span>
                    <p className="text-indigo-900 font-medium">{entry.alternativePerspective || 'En observación consciente'}</p>
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
