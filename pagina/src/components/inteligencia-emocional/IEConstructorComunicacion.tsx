import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles, CheckCircle2, Save, Trash2, Copy, ArrowRight } from 'lucide-react';

type ScriptItem = {
  id: string;
  date: string;
  situation: string;
  emotion: string;
  need: string;
  objective: string;
  iMessage: string;
  request: string;
  fullScript: string;
};

export default function IEConstructorComunicacion() {
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Form states
  const [situation, setSituation] = useState('');
  const [emotion, setEmotion] = useState('');
  const [need, setNeed] = useState('');
  const [objective, setObjective] = useState('');
  const [request, setRequest] = useState('');

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:ie_scripts');
    if (local) {
      try {
        setScripts(JSON.parse(local));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const generatedScript = situation && emotion && need && request
    ? `Cuando ${situation.trim()}, me siento ${emotion.trim()} porque para mí es importante ${need.trim()}. Por eso, ¿estarías dispuesto a ${request.trim()}?`
    : '';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedScript) return;

    const newScript: ScriptItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      situation,
      emotion,
      need,
      objective,
      iMessage: `Me siento ${emotion} cuando ${situation}`,
      request,
      fullScript: generatedScript
    };

    const updated = [newScript, ...scripts];
    setScripts(updated);
    localStorage.setItem('conexionluz:ie_scripts', JSON.stringify(updated));

    // Reset
    setSituation('');
    setEmotion('');
    setNeed('');
    setObjective('');
    setRequest('');

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const handleDelete = (id: string) => {
    const updated = scripts.filter(s => s.id !== id);
    setScripts(updated);
    localStorage.setItem('conexionluz:ie_scripts', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/30 border border-teal-400/40 text-teal-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            💬 CONSTRUCTOR ASERTIVO
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Constructor de Comunicación Emocional</h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Estructura conversaciones difíciles transformando reproches o quejas en expresiones claras de hechos, sentimientos, necesidades y peticiones concretas.
        </p>
      </div>

      {/* Builder Form */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-600" /> Fórmula de Comunicación No Violenta (CNV)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              1. Hecho Objetivo (Sin juicios ni exageraciones como 'siempre' o 'nunca')
            </label>
            <input
              type="text"
              required
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="ej: llegas 25 minutos tarde a nuestra reunión acordada"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              2. Emoción en Primera Persona ('Yo me siento...')
            </label>
            <input
              type="text"
              required
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              placeholder="ej: frustrado, preocupado, poco valorado"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              3. Necesidad o Valor Subyacente ('Porque para mí es importante...')
            </label>
            <input
              type="text"
              required
              value={need}
              onChange={(e) => setNeed(e.target.value)}
              placeholder="ej: la puntualidad, el respeto al tiempo ajeno, el orden"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              4. Petición Concreta y Realizable ('¿Estarías dispuesto a...?')
            </label>
            <input
              type="text"
              required
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="ej: avisarme por mensaje con 15 minutos de anticipación si vas a demorarte"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>

        {/* Live Preview Box */}
        {generatedScript && (
          <div className="p-5 bg-teal-50 border border-teal-200 rounded-2xl space-y-2 animate-in fade-in duration-200">
            <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider block">
              ✨ Guión Asertivo Generado:
            </span>
            <p className="text-xs sm:text-sm font-semibold text-teal-950 leading-relaxed">
              "{generatedScript}"
            </p>
          </div>
        )}

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          {savedSuccess ? (
            <span className="text-xs font-bold text-teal-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ¡Guión guardado en tus recursos!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Practica decir el mensaje en voz alta con tono tranquilo y respiración pausada.</span>
          )}

          <button
            type="submit"
            disabled={!generatedScript}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" /> Guardar Guión
          </button>
        </div>
      </form>

      {/* History */}
      {scripts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider px-1">
            Mis Guiones de Comunicación ({scripts.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scripts.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">{item.date}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(item.fullScript)}
                      className="text-xs text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copiar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  "{item.fullScript}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
