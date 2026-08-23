import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, Save, Trash2, CheckCircle2, Sliders, ShieldCheck } from 'lucide-react';

type PatternItem = {
  id: string;
  date: string;
  situation: string;
  habitualResponse: string;
  consequence: string;
  learning: string;
  alternativeResponse: string;
};

export default function ACDetectorPatrones() {
  const [patterns, setPatterns] = useState<PatternItem[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form
  const [situation, setSituation] = useState('');
  const [habitualResponse, setHabitualResponse] = useState('');
  const [consequence, setConsequence] = useState('');
  const [learning, setLearning] = useState('');
  const [alternativeResponse, setAlternativeResponse] = useState('');

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:ac_pattern_detector');
    if (local) {
      try { setPatterns(JSON.parse(local)); } catch (e) {}
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim() || !habitualResponse.trim()) return;

    const newPattern: PatternItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      situation,
      habitualResponse,
      consequence,
      learning,
      alternativeResponse
    };

    const updated = [newPattern, ...patterns];
    setPatterns(updated);
    localStorage.setItem('conexionluz:ac_pattern_detector', JSON.stringify(updated));

    // Reset
    setSituation('');
    setHabitualResponse('');
    setConsequence('');
    setLearning('');
    setAlternativeResponse('');

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDelete = (id: string) => {
    const updated = patterns.filter(p => p.id !== id);
    setPatterns(updated);
    localStorage.setItem('conexionluz:ac_pattern_detector', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            🔄 HERRAMIENTA CLAVE
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Detector de Patrones de Conducta</h2>
        <p className="text-indigo-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Observa las secuencias automáticas que repites en tu día a día, comprende qué disparador las activa y ensaya alternativas conscientes.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600" /> Registro de Secuencia de Comportamiento
          </h3>
          <span className="text-xs text-slate-400 font-bold">{new Date().toLocaleDateString('es-ES')}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              1. Situación Desencadenante (¿Qué estímulo inicia el bucle?)
            </label>
            <textarea
              rows={3}
              required
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="ej: Tener una entrega laboral importante sin planificar con tiempo..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              2. Respuesta Habitual (¿Qué conducta automática haces?)
            </label>
            <textarea
              rows={3}
              required
              value={habitualResponse}
              onChange={(e) => setHabitualResponse(e.target.value)}
              placeholder="ej: Procrastinar mirando redes sociales durante horas para evitar la incomodidad..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              3. Consecuencia Percibida (¿Qué costo tiene esta respuesta?)
            </label>
            <textarea
              rows={2}
              value={consequence}
              onChange={(e) => setConsequence(e.target.value)}
              placeholder="ej: Aumento del estrés final, culpa y cansancio extremo..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              4. Aprendizaje / Necesidad Oculta
            </label>
            <textarea
              rows={2}
              value={learning}
              onChange={(e) => setLearning(e.target.value)}
              placeholder="ej: Mi cerebro busca aliviar la ansiedad de la tarea dividiéndola en pasos más pequeños..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-indigo-950 font-black flex items-center gap-1.5">
            <RefreshCw className="h-4 w-4 text-indigo-600" /> 5. Respuesta Alternativa Consciente
          </label>
          <textarea
            rows={2}
            value={alternativeResponse}
            onChange={(e) => setAlternativeResponse(e.target.value)}
            placeholder="ej: Hacer una pausa de 2 minutos, definir sólo el primer micro-paso de 10 minutos y comenzar sin juzgarme..."
            className="w-full bg-indigo-50/70 border border-indigo-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          {savedSuccess ? (
            <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ¡Patrón registrado exitosamente!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Reconocer el patrón es el primer paso para desactivar el piloto automático.</span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" /> Guardar Patrón
          </button>
        </div>
      </form>

      {/* History */}
      {patterns.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider px-1">
            Mis Patrones Detectados ({patterns.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patterns.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-full">{item.date}</span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">Disparador:</span>
                    <p className="text-slate-800">{item.situation}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">Respuesta Habitual:</span>
                    <p className="text-slate-700">{item.habitualResponse}</p>
                  </div>
                  <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100">
                    <span className="font-bold text-indigo-950 uppercase text-[10px] block">Alternativa Consciente:</span>
                    <p className="text-indigo-900 font-medium">{item.alternativeResponse || 'Pausa y observación'}</p>
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
