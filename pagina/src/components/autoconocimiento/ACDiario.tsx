import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Save, Trash2, CheckCircle2, Heart } from 'lucide-react';

type DiaryEntry = {
  id: string;
  date: string;
  experience: string;
  thought: string;
  emotion: string;
  learning: string;
  discovery: string;
  nextStep: string;
};

export default function ACDiario() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [experience, setExperience] = useState('');
  const [thought, setThought] = useState('');
  const [emotion, setEmotion] = useState('');
  const [learning, setLearning] = useState('');
  const [discovery, setDiscovery] = useState('');
  const [nextStep, setNextStep] = useState('');

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:ac_diary_entries');
    if (local) {
      try { setEntries(JSON.parse(local)); } catch (e) {}
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!experience.trim()) return;

    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      experience,
      thought,
      emotion,
      learning,
      discovery,
      nextStep
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('conexionluz:ac_diary_entries', JSON.stringify(updated));

    // Reset
    setExperience('');
    setThought('');
    setEmotion('');
    setLearning('');
    setDiscovery('');
    setNextStep('');

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('conexionluz:ac_diary_entries', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            📔 MI DIARIO DE AUTOCONOCIMIENTO
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Diario de Introspección</h2>
        <p className="text-indigo-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Registra tus reflexiones, descubrimientos cotidianos y decisiones conscientes en tu bitácora personal y privada.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600" /> Nueva Entrada en Mi Diario
          </h3>
          <span className="text-xs text-slate-400 font-bold">{new Date().toLocaleDateString('es-ES')}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              1. Experiencia Significativa de Hoy
            </label>
            <textarea
              rows={3}
              required
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="¿Qué suceso o vivencia te invitó a reflexionar hoy?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              2. Pensamiento y Emoción Presente
            </label>
            <textarea
              rows={3}
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="¿Qué pasaba por tu mente y qué sentías en tu cuerpo?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              3. Aprendizaje Extraído
            </label>
            <textarea
              rows={2}
              value={learning}
              onChange={(e) => setLearning(e.target.value)}
              placeholder="¿Qué comprendiste sobre ti?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              4. Descubrimiento Personal
            </label>
            <textarea
              rows={2}
              value={discovery}
              onChange={(e) => setDiscovery(e.target.value)}
              placeholder="¿Qué faceta tuya reconoces ahora?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-indigo-950 font-black">
              5. Siguiente Paso Consciente
            </label>
            <textarea
              rows={2}
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              placeholder="¿Qué pequeña acción o actitud eliges mañana?"
              className="w-full bg-indigo-50/70 border border-indigo-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {savedSuccess ? (
            <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ¡Entrada guardada en tu diario privado!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Tus notas están resguardadas de manera confidencial en tu navegador.</span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" /> Guardar Entrada
          </button>
        </div>
      </form>

      {/* History */}
      {entries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider px-1">
            Entradas Anteriores ({entries.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map((item) => (
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
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">Experiencia:</span>
                    <p className="text-slate-800">{item.experience}</p>
                  </div>
                  {item.learning && (
                    <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100">
                      <span className="font-bold text-indigo-950 uppercase text-[10px] block">Aprendizaje & Siguiente Paso:</span>
                      <p className="text-indigo-900 font-medium">{item.learning} — {item.nextStep}</p>
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
