import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Save, Trash2, CheckCircle2, Heart, Award, Target, Calendar } from 'lucide-react';

type DiaryEntry = {
  id: string;
  date: string;
  situation: string;
  learning: string;
  emotion: string;
  intensity: number;
  difficulty: string;
  achievement: string;
  nextAction: string;
};

export default function DPDiarioEmocional() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [situation, setSituation] = useState('');
  const [learning, setLearning] = useState('');
  const [emotion, setEmotion] = useState('Serenidad');
  const [intensity, setIntensity] = useState(70);
  const [difficulty, setDifficulty] = useState('');
  const [achievement, setAchievement] = useState('');
  const [nextAction, setNextAction] = useState('');

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:dp_diary_entries');
    if (local) {
      try {
        setEntries(JSON.parse(local));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim() || !learning.trim()) return;

    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      situation,
      learning,
      emotion,
      intensity,
      difficulty,
      achievement,
      nextAction
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('conexionluz:dp_diary_entries', JSON.stringify(updated));

    // Reset
    setSituation('');
    setLearning('');
    setDifficulty('');
    setAchievement('');
    setNextAction('');

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('conexionluz:dp_diary_entries', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <BookOpen className="h-3 w-3" /> MI DIARIO PERSONAL
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Diario de Desarrollo Personal y Emociones</h2>
        <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Registra tus aprendizajes, logros diarios, momentos de dificultad y pequeñas victorias. Un espacio privado de autorreflexión consciente.
        </p>
      </div>

      {/* New Entry Form */}
      <form onSubmit={handleSaveEntry} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" /> Nueva Entrada en Mi Diario
          </h3>
          <span className="text-xs text-slate-400 font-bold">{new Date().toLocaleDateString('es-ES')}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              1. Experiencia o Situación Destacada del Día
            </label>
            <textarea
              rows={3}
              required
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="¿Qué ocurrió hoy que merezca un momento de pausa y reflexión?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-950 font-black">
              2. Aprendizaje o Revelación Personal
            </label>
            <textarea
              rows={3}
              required
              value={learning}
              onChange={(e) => setLearning(e.target.value)}
              placeholder="¿Qué aprendiste sobre ti mismo, tus límites o tus emociones?"
              className="w-full bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Emotion & Intensity */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Emoción Predominante</label>
              <input
                type="text"
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                placeholder="ej: Serenidad, Gratitud, Inquietud, Alegría"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                <span>Intensidad Emocional:</span>
                <span className="text-emerald-700 font-black text-xs">{intensity} / 100</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Dificultad o Reto Afrontado
            </label>
            <textarea
              rows={2}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              placeholder="¿Qué obstáculo o incomodidad experimentaste?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Logro o Motivo de Gratitud
            </label>
            <textarea
              rows={2}
              value={achievement}
              onChange={(e) => setAchievement(e.target.value)}
              placeholder="¿Qué pequeño avance o gesto agradeces hoy?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Siguiente Acción Consciente
            </label>
            <textarea
              rows={2}
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="¿Qué paso darás mañana?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ¡Entrada guardada en tu diario!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Tus entradas quedan guardadas de manera privada en tu navegador.</span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" /> Guardar Entrada
          </button>
        </div>
      </form>

      {/* Entries List */}
      {entries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider px-1">
            Entradas Anteriores ({entries.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">{entry.date}</span>
                    <span className="text-[10px] font-bold text-slate-500">{entry.emotion} ({entry.intensity}%)</span>
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
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">Experiencia:</span>
                    <p className="text-slate-800">{entry.situation}</p>
                  </div>

                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="font-bold text-emerald-950 uppercase text-[10px] block">Aprendizaje:</span>
                    <p className="text-emerald-900 font-medium">{entry.learning}</p>
                  </div>

                  {entry.achievement && (
                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[10px] block">Gratitud / Logro:</span>
                      <p className="text-slate-700">{entry.achievement}</p>
                    </div>
                  )}

                  {entry.nextAction && (
                    <div className="text-[11px] text-slate-500 font-semibold pt-1 border-t border-slate-100">
                      <strong>Siguiente paso:</strong> {entry.nextAction}
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
