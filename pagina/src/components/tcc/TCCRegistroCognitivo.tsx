import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Save, Trash2, CheckCircle2, ArrowRight, RefreshCw, Layers } from 'lucide-react';

type ThoughtRecord = {
  id: string;
  date: string;
  situation: string;
  automaticThought: string;
  initialEmotion: string;
  initialIntensity: number;
  evidenceFor: string;
  evidenceAgainst: string;
  alternativeThought: string;
  balancedThought: string;
  finalEmotion: string;
  finalIntensity: number;
};

export default function TCCRegistroCognitivo() {
  const [records, setRecords] = useState<ThoughtRecord[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form inputs
  const [situation, setSituation] = useState('');
  const [automaticThought, setAutomaticThought] = useState('');
  const [initialEmotion, setInitialEmotion] = useState('Ansiedad');
  const [initialIntensity, setInitialIntensity] = useState(80);
  const [evidenceFor, setEvidenceFor] = useState('');
  const [evidenceAgainst, setEvidenceAgainst] = useState('');
  const [alternativeThought, setAlternativeThought] = useState('');
  const [balancedThought, setBalancedThought] = useState('');
  const [finalEmotion, setFinalEmotion] = useState('Alivio / Claridad');
  const [finalIntensity, setFinalIntensity] = useState(35);

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:tcc_thought_records');
    if (local) {
      try {
        setRecords(JSON.parse(local));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim() || !automaticThought.trim()) return;

    const newRecord: ThoughtRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      situation,
      automaticThought,
      initialEmotion,
      initialIntensity,
      evidenceFor,
      evidenceAgainst,
      alternativeThought,
      balancedThought,
      finalEmotion,
      finalIntensity
    };

    const updated = [newRecord, ...records];
    setRecords(updated);
    localStorage.setItem('conexionluz:tcc_thought_records', JSON.stringify(updated));
    
    // Reset form
    setSituation('');
    setAutomaticThought('');
    setEvidenceFor('');
    setEvidenceAgainst('');
    setAlternativeThought('');
    setBalancedThought('');
    setInitialIntensity(80);
    setFinalIntensity(35);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDelete = (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    localStorage.setItem('conexionluz:tcc_thought_records', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/30 border border-teal-400/40 text-teal-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Brain className="h-3 w-3" /> HERRAMIENTA CLAVE TCC
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Registro y Reestructurador Cognitivo</h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          El registro de pensamientos de 7 columnas es el instrumento insignia de la TCC para examinar la validez de los pensamientos automáticos y construir conclusiones fundamentadas.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSaveRecord} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-600" /> Nuevo Registro de Pensamiento
          </h3>
          <span className="text-xs text-slate-500 font-bold">Paso a paso guiado</span>
        </div>

        {/* Step 1 & 2: Situation & Automatic Thought */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              1. Situación Desencadenante (Hecho Objetivo)
            </label>
            <textarea
              rows={3}
              required
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="¿Dónde estabas? ¿Con quién? ¿Qué ocurrió exactamente de forma descriptiva?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              2. Pensamiento Automático Inicial
            </label>
            <textarea
              rows={3}
              required
              value={automaticThought}
              onChange={(e) => setAutomaticThought(e.target.value)}
              placeholder="¿Qué pasó por tu mente en ese instante? (ej: 'No voy a ser capaz', 'Todos me juzgan')"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>

        {/* Step 3: Initial Emotion & Slider */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">
            3. Emoción Inicial e Intensidad (0 - 100)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Emoción experimentada</label>
              <input
                type="text"
                value={initialEmotion}
                onChange={(e) => setInitialEmotion(e.target.value)}
                placeholder="ej: Ansiedad, Rabia, Tristeza, Vergüenza"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                <span>Intensidad inicial:</span>
                <span className="text-teal-700 font-black text-xs">{initialIntensity} / 100</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={initialIntensity}
                onChange={(e) => setInitialIntensity(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Step 4 & 5: Evidence For and Against */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" /> 4. Evidencia que apoya el pensamiento
            </label>
            <textarea
              rows={3}
              value={evidenceFor}
              onChange={(e) => setEvidenceFor(e.target.value)}
              placeholder="¿Qué datos fácticos y comprobables respaldan este pensamiento?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-teal-500 inline-block" /> 5. Evidencia que NO apoya / cuestiona
            </label>
            <textarea
              rows={3}
              value={evidenceAgainst}
              onChange={(e) => setEvidenceAgainst(e.target.value)}
              placeholder="¿Qué datos contradicen esta idea? ¿Qué ha pasado en ocasiones similares?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>

        {/* Step 6 & 7: Alternative & Balanced Thought */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              6. Interpretaciones Alternativas
            </label>
            <textarea
              rows={3}
              value={alternativeThought}
              onChange={(e) => setAlternativeThought(e.target.value)}
              placeholder="¿Qué otra explicación plausible existe? ¿Qué le dirías a un buen amigo?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-teal-950 font-black">
              7. Pensamiento Equilibrado & Realista
            </label>
            <textarea
              rows={3}
              value={balancedThought}
              onChange={(e) => setBalancedThought(e.target.value)}
              placeholder="Sintetiza una perspectiva ponderada que integre toda la evidencia real."
              className="w-full bg-teal-50/70 border border-teal-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>

        {/* Final Emotion Outcome */}
        <div className="bg-teal-50 border border-teal-200/90 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-teal-900">
            8. Reevaluación Emocional Posterior
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-[11px] font-bold text-teal-900 mb-1">Emoción tras reestructurar</label>
              <input
                type="text"
                value={finalEmotion}
                onChange={(e) => setFinalEmotion(e.target.value)}
                placeholder="ej: Calma, Aceptación, Claridad"
                className="w-full bg-white border border-teal-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-bold text-teal-900 mb-1">
                <span>Intensidad reevaluada:</span>
                <span className="text-teal-900 font-black text-xs">{finalIntensity} / 100</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={finalIntensity}
                onChange={(e) => setFinalIntensity(Number(e.target.value))}
                className="w-full accent-teal-700 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs font-bold text-teal-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ¡Registro guardado exitosamente!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Guarda tus registros para consultarlos cuando desees.</span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" /> Guardar Registro Cognitivo
          </button>
        </div>
      </form>

      {/* History of Saved Records */}
      {records.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider px-1">
            Historial de Registros ({records.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((rec) => (
              <div key={rec.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-2xs relative group">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-bold text-slate-400">{rec.date}</span>
                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Eliminar registro"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[10px] block">Situación:</span>
                    <p className="text-slate-800 font-medium">{rec.situation}</p>
                  </div>

                  <div>
                    <span className="font-bold text-rose-600 uppercase text-[10px] block">Pensamiento Automático:</span>
                    <p className="text-slate-700 italic">"{rec.automaticThought}"</p>
                  </div>

                  <div className="flex items-center gap-2 py-1">
                    <span className="text-[11px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md font-bold">
                      {rec.initialEmotion} ({rec.initialIntensity}%)
                    </span>
                    <ArrowRight className="h-3 w-3 text-slate-400" />
                    <span className="text-[11px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md font-bold">
                      {rec.finalEmotion} ({rec.finalIntensity}%)
                    </span>
                  </div>

                  {rec.balancedThought && (
                    <div className="bg-teal-50/60 border border-teal-100 rounded-xl p-2.5 mt-2">
                      <span className="font-bold text-teal-950 uppercase text-[10px] block">Pensamiento Equilibrado:</span>
                      <p className="text-teal-900 font-medium text-xs mt-0.5">{rec.balancedThought}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
