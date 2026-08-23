import React, { useState, useEffect } from 'react';
import { Target, Sparkles, Save, CheckCircle2, Trash2, ArrowRight, Clock, ShieldAlert } from 'lucide-react';

type GoalItem = {
  id: string;
  date: string;
  goal: string;
  importance: string;
  metric: string;
  resources: string;
  obstacles: string;
  firstStep: string;
  startDate: string;
  measurement: string;
  isCompleted: boolean;
};

export default function DPConstructorObjetivos() {
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form inputs
  const [goal, setGoal] = useState('');
  const [importance, setImportance] = useState('');
  const [metric, setMetric] = useState('');
  const [resources, setResources] = useState('');
  const [obstacles, setObstacles] = useState('');
  const [firstStep, setFirstStep] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [measurement, setMeasurement] = useState('');

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:dp_goals');
    if (local) {
      try {
        setGoals(JSON.parse(local));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || !firstStep.trim()) return;

    const newGoal: GoalItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      goal,
      importance,
      metric,
      resources,
      obstacles,
      firstStep,
      startDate,
      measurement,
      isCompleted: false
    };

    const updated = [newGoal, ...goals];
    setGoals(updated);
    localStorage.setItem('conexionluz:dp_goals', JSON.stringify(updated));

    // Reset
    setGoal('');
    setImportance('');
    setMetric('');
    setResources('');
    setObstacles('');
    setFirstStep('');
    setMeasurement('');

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const toggleCompleted = (id: string) => {
    const updated = goals.map(g => g.id === id ? { ...g, isCompleted: !g.isCompleted } : g);
    setGoals(updated);
    localStorage.setItem('conexionluz:dp_goals', JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    localStorage.setItem('conexionluz:dp_goals', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Target className="h-3 w-3" /> METAS SMART
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Constructor de Objetivos Personales</h2>
        <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Transforma aspiraciones vagas en metas concretas, medibles y operativas con un plan de acción y gestión de obstáculos.
        </p>
      </div>

      {/* Goal Builder Form */}
      <form onSubmit={handleSaveGoal} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" /> Nuevo Objetivo Estructurado
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              1. ¿Qué quiero conseguir exactamente? (Específico)
            </label>
            <textarea
              rows={3}
              required
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="ej: Leer 20 páginas de un libro de desarrollo personal cada noche antes de dormir..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              2. ¿Por qué es importante para mí? (Motivación y Valor)
            </label>
            <textarea
              rows={3}
              value={importance}
              onChange={(e) => setImportance(e.target.value)}
              placeholder="ej: Porque nutre mi mente, reduce mi exposición a pantallas y apoya mi valor del aprendizaje..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              3. ¿Cómo sabré que lo conseguí? (Métrica Observable)
            </label>
            <input
              type="text"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              placeholder="ej: Haber leído 1 libro completo al final de cada mes."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              4. ¿Qué recursos o condiciones necesito?
            </label>
            <input
              type="text"
              value={resources}
              onChange={(e) => setResources(e.target.value)}
              placeholder="ej: Tener el libro en la mesa de noche y apagar el móvil a las 22:00."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              5. ¿Qué obstáculos podrían aparecer y cómo los sortearé?
            </label>
            <textarea
              rows={2}
              value={obstacles}
              onChange={(e) => setObstacles(e.target.value)}
              placeholder="Obstáculo: Cansancio excesivo. Solución: Leer solo 5 páginas en días de fatiga."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-950 font-black">
              6. ¿Cuál es mi primer paso concreto hoy?
            </label>
            <textarea
              rows={2}
              required
              value={firstStep}
              onChange={(e) => setFirstStep(e.target.value)}
              placeholder="ej: Elegir el libro de mi estantería y colocarlo en mi mesa de noche."
              className="w-full bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ¡Objetivo guardado en tu plan!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Revisa y marca tus objetivos a medida que los alcances.</span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" /> Guardar Objetivo
          </button>
        </div>
      </form>

      {/* Goals List */}
      {goals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider px-1">
            Mis Objetivos ({goals.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((g) => (
              <div
                key={g.id}
                className={`bg-white border rounded-3xl p-6 space-y-3 shadow-2xs transition-all ${
                  g.isCompleted ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-bold text-slate-400">{g.date}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCompleted(g.id)}
                      className={`text-xs px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                        g.isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {g.isCompleted ? '✓ Completado' : 'En progreso'}
                    </button>
                    <button
                      onClick={() => handleDelete(g.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <h4 className={`text-sm font-black ${g.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {g.goal}
                  </h4>
                  {g.importance && <p className="text-slate-600 text-[11px]"><strong>Motivo:</strong> {g.importance}</p>}
                  {g.metric && <p className="text-slate-600 text-[11px]"><strong>Métrica:</strong> {g.metric}</p>}
                  {g.firstStep && (
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-950 font-medium">
                      <strong>Primer Paso:</strong> {g.firstStep}
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
