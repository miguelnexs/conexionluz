import React, { useState, useEffect } from 'react';
import { Sparkles, Save, CheckCircle2, Heart, Trash2, Sliders, ShieldCheck } from 'lucide-react';

type EmotionalMapEntry = {
  id: string;
  date: string;
  situation: string;
  emotion: string;
  intensity: number;
  thought: string;
  automaticReaction: string;
  perceivedNeed: string;
  consciousResponse: string;
};

export default function IEMapaEmocional() {
  const [entries, setEntries] = useState<EmotionalMapEntry[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [situation, setSituation] = useState('');
  const [emotion, setEmotion] = useState('Inquietud');
  const [intensity, setIntensity] = useState(70);
  const [thought, setThought] = useState('');
  const [automaticReaction, setAutomaticReaction] = useState('');
  const [perceivedNeed, setPerceivedNeed] = useState('Seguridad y Claridad');
  const [consciousResponse, setConsciousResponse] = useState('');

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:ie_emotional_map');
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
    if (!situation.trim() || !thought.trim()) return;

    const newEntry: EmotionalMapEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      situation,
      emotion,
      intensity,
      thought,
      automaticReaction,
      perceivedNeed,
      consciousResponse
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('conexionluz:ie_emotional_map', JSON.stringify(updated));

    // Reset
    setSituation('');
    setThought('');
    setAutomaticReaction('');
    setConsciousResponse('');

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('conexionluz:ie_emotional_map', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/30 border border-teal-400/40 text-teal-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            🗺️ HERRAMIENTA CLAVE
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Mapa Emocional: Desglose de Experiencias</h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Estructura y analiza tus episodios afectivos para comprender qué necesidad subyace tras la emoción y elegir respuestas conscientes en lugar de reacciones impulsivas.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-600" /> Registro de Episodio Emocional
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              1. Situación Desencadenante (¿Qué ocurrió?)
            </label>
            <textarea
              rows={3}
              required
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="Describe el hecho objetivo sin emitir juicios ni interpretaciones todavía..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              2. Pensamiento o Interpretación Automática
            </label>
            <textarea
              rows={3}
              required
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="¿Qué te dijiste a ti mismo sobre la situación? ('Esto no es justo', 'No podré con esto')..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>

        {/* Emotion & Need Controls */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">3. Emoción Identificada</label>
              <input
                type="text"
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                placeholder="ej: Frustración, Ansiedad, Tristeza, Celos"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Intensidad:</span>
                <span className="text-teal-700 font-black">{intensity} / 100</span>
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
              <label className="block text-xs font-bold text-slate-800 mb-1">4. Necesidad Psicológica Subyacente</label>
              <select
                value={perceivedNeed}
                onChange={(e) => setPerceivedNeed(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800"
              >
                <option value="Seguridad y Claridad">Seguridad y Claridad</option>
                <option value="Límites y Respeto">Límites y Respeto</option>
                <option value="Validación y Escucha">Validación y Escucha</option>
                <option value="Conexión y Afecto">Conexión y Afecto</option>
                <option value="Descanso y Autocuidado">Descanso y Autocuidado</option>
                <option value="Autonomía y Espacio">Autonomía y Espacio</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              5. Impulso o Reacción Automática (Lo que te apetecía hacer)
            </label>
            <textarea
              rows={2}
              value={automaticReaction}
              onChange={(e) => setAutomaticReaction(e.target.value)}
              placeholder="ej: Gritar, retirarme de la conversación sin decir nada, mandar un mensaje impulsivo..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-teal-950 font-black">
              6. Respuesta Consciente y Saludable Elegida
            </label>
            <textarea
              rows={2}
              value={consciousResponse}
              onChange={(e) => setConsciousResponse(e.target.value)}
              placeholder="ej: Hacer una pausa de 5 minutos para respirar y luego expresar mi límite con asertividad..."
              className="w-full bg-teal-50/70 border border-teal-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          {savedSuccess ? (
            <span className="text-xs font-bold text-teal-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ¡Episodio guardado en tu mapa emocional!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Este ejercicio es de autorreflexión formativa, no diagnóstica.</span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" /> Guardar en Mi Mapa
          </button>
        </div>
      </form>

      {/* History Grid */}
      {entries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider px-1">
            Mis Registros Emocionales ({entries.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">{entry.date}</span>
                    <span className="text-[10px] font-bold text-slate-600">{entry.emotion} ({entry.intensity}%)</span>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
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
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">Pensamiento:</span>
                    <p className="text-slate-700 italic">"{entry.thought}"</p>
                  </div>
                  <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-100">
                    <span className="font-bold text-teal-950 uppercase text-[10px] block">Respuesta Consciente ({entry.perceivedNeed}):</span>
                    <p className="text-teal-900 font-medium">{entry.consciousResponse || 'Pausa y observación'}</p>
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
