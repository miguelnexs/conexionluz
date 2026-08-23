import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Save, Trash2, Plus, Calendar, Clock, Flame } from 'lucide-react';

type HabitItem = {
  id: string;
  name: string;
  cue: string;
  routine: string;
  reward: string;
  frequency: string;
  daysCompleted: Record<string, boolean>; // e.g. "2026-08-20": true
};

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function DPSeguimientoHabitos() {
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [cue, setCue] = useState('');
  const [routine, setRoutine] = useState('');
  const [reward, setReward] = useState('');
  const [frequency, setFrequency] = useState('Diario');

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:dp_habits');
    if (local) {
      try {
        setHabits(JSON.parse(local));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !routine.trim()) return;

    const newHabit: HabitItem = {
      id: Date.now().toString(),
      name,
      cue,
      routine,
      reward,
      frequency,
      daysCompleted: {}
    };

    const updated = [newHabit, ...habits];
    setHabits(updated);
    localStorage.setItem('conexionluz:dp_habits', JSON.stringify(updated));

    // Reset
    setName('');
    setCue('');
    setRoutine('');
    setReward('');

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const toggleDay = (habitId: string, dayKey: string) => {
    const updated = habits.map(h => {
      if (h.id === habitId) {
        const nextDays = { ...h.daysCompleted, [dayKey]: !h.daysCompleted[dayKey] };
        return { ...h, daysCompleted: nextDays };
      }
      return h;
    });
    setHabits(updated);
    localStorage.setItem('conexionluz:dp_habits', JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    const updated = habits.filter(h => h.id !== id);
    setHabits(updated);
    localStorage.setItem('conexionluz:dp_habits', JSON.stringify(updated));
  };

  // Get current week dates (Mon to Sun)
  const getWeekDates = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 is Sun, 1 is Mon
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(now);
    monday.setDate(now.getDate() + distanceToMonday);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push({
        label: DAYS_OF_WEEK[i],
        dayNum: d.getDate(),
        key: d.toISOString().split('T')[0],
        isToday: d.toISOString().split('T')[0] === now.toISOString().split('T')[0]
      });
    }
    return week;
  };

  const weekDates = getWeekDates();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Flame className="h-3 w-3" /> ARQUITECTURA DE HÁBITOS
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Constructor y Seguimiento de Hábitos</h2>
        <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Construye hábitos sostenibles mediante el bucle Señal → Rutina → Recompensa. Haz seguimiento visual a tu constancia semanal.
        </p>
      </div>

      {/* Habit Builder Form */}
      <form onSubmit={handleCreateHabit} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Plus className="h-4 w-4 text-emerald-600" /> Crear Nuevo Hábito
          </h3>
          <span className="text-xs text-slate-500 font-bold">El bucle del hábito</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              1. Nombre del Hábito
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej: Caminar 20 minutos al aire libre, Meditación de 5 min"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              2. Señal / Disparador (¿Cuándo y Dónde?)
            </label>
            <input
              type="text"
              value={cue}
              onChange={(e) => setCue(e.target.value)}
              placeholder="ej: Justo después de tomar mi café matutino..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-950 font-black">
              3. Rutina (Acción Concreta Mínima)
            </label>
            <input
              type="text"
              required
              value={routine}
              onChange={(e) => setRoutine(e.target.value)}
              placeholder="ej: Ponerme las zapatillas y caminar 20 minutos a paso cómodo"
              className="w-full bg-emerald-50/70 border border-emerald-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              4. Recompensa / Sensación Positiva
            </label>
            <input
              type="text"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              placeholder="ej: Sensación de energía y claridad mental para el día"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ¡Hábito creado con éxito!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">La repetición constante y el entorno facilitador consolidan el hábito.</span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Añadir Hábito
          </button>
        </div>
      </form>

      {/* Habit Tracker Table */}
      {habits.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Seguimiento Semanal ({habits.length} Hábitos)
            </h3>
            <span className="text-xs text-slate-400 font-bold">Semana en Curso</span>
          </div>

          <div className="space-y-4">
            {habits.map((h) => {
              const completedDaysCount = Object.values(h.daysCompleted).filter(Boolean).length;
              return (
                <div key={h.id} className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{h.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        <strong>Señal:</strong> {h.cue || 'Al comenzar el día'} → <strong>Rutina:</strong> {h.routine}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        {completedDaysCount} días cumplidos
                      </span>
                      <button
                        onClick={() => handleDelete(h.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Day Checkboxes */}
                  <div className="grid grid-cols-7 gap-2 pt-1">
                    {weekDates.map((day) => {
                      const isDone = Boolean(h.daysCompleted[day.key]);
                      return (
                        <button
                          key={day.key}
                          onClick={() => toggleDay(h.id, day.key)}
                          className={`p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center ${
                            isDone
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                              : day.isToday
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                              : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                          }`}
                        >
                          <span className="text-[10px] font-bold uppercase">{day.label}</span>
                          <span className="text-xs font-black mt-0.5">{day.dayNum}</span>
                          {isDone && <CheckCircle2 className="h-3.5 w-3.5 mt-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
