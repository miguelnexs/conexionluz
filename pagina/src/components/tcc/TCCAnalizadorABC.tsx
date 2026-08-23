import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Layers, Save, Trash2, CheckCircle2, HelpCircle } from 'lucide-react';

type ABCRecord = {
  id: string;
  date: string;
  title: string;
  antecedent: string;
  behavior: string;
  consequenceShort: string;
  consequenceLong: string;
  functionalRole: string;
  alternativeBehavior: string;
};

export default function TCCAnalizadorABC() {
  const [records, setRecords] = useState<ABCRecord[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [antecedent, setAntecedent] = useState('');
  const [behavior, setBehavior] = useState('');
  const [consequenceShort, setConsequenceShort] = useState('');
  const [consequenceLong, setConsequenceLong] = useState('');
  const [functionalRole, setFunctionalRole] = useState('Refuerzo Negativo (Alivio momentáneo del malestar)');
  const [alternativeBehavior, setAlternativeBehavior] = useState('');

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:tcc_abc_records');
    if (local) {
      try {
        setRecords(JSON.parse(local));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!antecedent.trim() || !behavior.trim()) return;

    const newRecord: ABCRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      title: title || 'Análisis Funcional',
      antecedent,
      behavior,
      consequenceShort,
      consequenceLong,
      functionalRole,
      alternativeBehavior
    };

    const updated = [newRecord, ...records];
    setRecords(updated);
    localStorage.setItem('conexionluz:tcc_abc_records', JSON.stringify(updated));

    // Reset
    setTitle('');
    setAntecedent('');
    setBehavior('');
    setConsequenceShort('');
    setConsequenceLong('');
    setAlternativeBehavior('');

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDelete = (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    localStorage.setItem('conexionluz:tcc_abc_records', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-blue-500/30 border border-blue-400/40 text-blue-200 px-3 py-1 rounded-full">
            🔄 ANÁLISIS FUNCIONAL CONDUCTUAL
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Analizador ABC de la Conducta</h2>
        <p className="text-blue-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Comprende por qué se mantienen los hábitos y conductas mediante la descomposición de Antecedentes (A), Conducta observable (B) y Consecuencias reforzadoras (C).
        </p>
      </div>

      {/* Visual Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-teal-200 rounded-2xl p-5 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-teal-800 font-black text-sm">
            <span className="h-6 w-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">A</span>
            Antecedente
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            El contexto, estímulo, lugar, hora o pensamiento disparador que activa la respuesta.
          </p>
        </div>

        <div className="bg-white border border-blue-200 rounded-2xl p-5 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-blue-800 font-black text-sm">
            <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">B</span>
            Behavior (Conducta)
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            La acción manifiesta o patrón de evitación que la persona ejecuta físicamente.
          </p>
        </div>

        <div className="bg-white border border-indigo-200 rounded-2xl p-5 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-indigo-800 font-black text-sm">
            <span className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-bold">C</span>
            Consecuencia
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            El impacto posterior: alivio inmediato o costes a largo plazo que consolidan el ciclo.
          </p>
        </div>
      </div>

      {/* Interactive Form */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
          Nuevo Análisis Funcional
        </h3>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Título o Tema de la Situación</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ej. Procrastinación al redactar un informe, Evitación de una llamada"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-teal-900">
              A — Antecedente (¿Qué ocurrió antes?)
            </label>
            <textarea
              rows={4}
              required
              value={antecedent}
              onChange={(e) => setAntecedent(e.target.value)}
              placeholder="Situación, lugar, presencia de ciertas personas o pensamiento previo."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-blue-900">
              B — Conducta (¿Qué hizo la persona?)
            </label>
            <textarea
              rows={4}
              required
              value={behavior}
              onChange={(e) => setBehavior(e.target.value)}
              placeholder="Acción concreta: posponer, revisar el móvil, aislarse o confrontar."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-indigo-900">
              C — Consecuencia Inmediata (Corto Plazo)
            </label>
            <textarea
              rows={4}
              required
              value={consequenceShort}
              onChange={(e) => setConsequenceShort(e.target.value)}
              placeholder="Sensación de alivio temporal de la tensión, evasión momentánea del estrés."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-rose-900">
              Consecuencia a Largo Plazo (Coste Real)
            </label>
            <textarea
              rows={3}
              value={consequenceLong}
              onChange={(e) => setConsequenceLong(e.target.value)}
              placeholder="Mayor acumulación de tareas, incremento de culpa y mantenimiento de la inseguridad."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-900">
              Alternativa de Conducta Constructiva
            </label>
            <textarea
              rows={3}
              value={alternativeBehavior}
              onChange={(e) => setAlternativeBehavior(e.target.value)}
              placeholder="¿Qué conducta gradual o activación por pasos pequeños rompería este ciclo?"
              className="w-full bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {savedSuccess ? (
            <span className="text-xs font-bold text-teal-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ¡Análisis ABC guardado!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Analiza el patrón funcional para diseñar nuevas conductas.</span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" /> Guardar Análisis ABC
          </button>
        </div>
      </form>

      {/* History */}
      {records.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider px-1">
            Análisis Guardados ({records.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((rec) => (
              <div key={rec.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-black text-slate-900">{rec.title}</span>
                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-teal-50/70 rounded-xl">
                    <span className="font-bold text-teal-900 block text-[10px] uppercase">A — Antecedente:</span>
                    <p className="text-teal-950">{rec.antecedent}</p>
                  </div>

                  <div className="p-2 bg-blue-50/70 rounded-xl">
                    <span className="font-bold text-blue-900 block text-[10px] uppercase">B — Conducta:</span>
                    <p className="text-blue-950">{rec.behavior}</p>
                  </div>

                  <div className="p-2 bg-indigo-50/70 rounded-xl">
                    <span className="font-bold text-indigo-900 block text-[10px] uppercase">C — Consecuencia (Alivio vs Coste):</span>
                    <p className="text-indigo-950">Inmediata: {rec.consequenceShort}</p>
                    {rec.consequenceLong && <p className="text-rose-700 mt-1">Largo plazo: {rec.consequenceLong}</p>}
                  </div>

                  {rec.alternativeBehavior && (
                    <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200/80">
                      <span className="font-bold text-emerald-900 block text-[10px] uppercase">Conducta Alternativa:</span>
                      <p className="text-emerald-950 font-medium">{rec.alternativeBehavior}</p>
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
