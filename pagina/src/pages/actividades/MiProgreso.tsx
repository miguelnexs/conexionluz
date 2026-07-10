import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { BarChart2, TrendingUp, Award, Calendar, Flame, Target, CheckCircle2, Star, Heart, Brain, Wind, NotebookPen } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
type Badge = { id: string; icon: string; title: string; desc: string; unlocked: boolean; condition: string };

// ─── Load data from sibling pages ────────────────────────────────────────────
function loadDiaryEntries(): Array<{ date: string; mood: { value: number; emoji: string }; text: string; gratitude: string }> {
  try { return JSON.parse(localStorage.getItem('conexionluz:diario-emocional') || '[]'); } catch { return []; }
}

function getDiaryStats() {
  const entries = loadDiaryEntries();
  const last7 = entries.slice(0, 7);
  const avgMood = last7.length ? last7.reduce((s, e) => s + e.mood.value, 0) / last7.length : 0;

  // Streak: consecutive days
  let streak = 0;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = new Set(entries.map(e => new Date(e.date).toDateString()));
  for (let i = 0; i < 30; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    if (days.has(d.toDateString())) streak++;
    else break;
  }

  return { count: entries.length, avgMood: Math.round(avgMood * 10) / 10, streak, last7 };
}

// Dummy exercise completions from sessionStorage
function getExerciseSessions(): number {
  try { return parseInt(localStorage.getItem('conexionluz:ejercicios-completados') || '0'); } catch { return 0; }
}

// Simulated test completions
function getTestCount(): number {
  try { return parseInt(localStorage.getItem('conexionluz:tests-completados') || '0'); } catch { return 0; }
}

// ─── Badges definition ────────────────────────────────────────────────────────
function buildBadges(diary: ReturnType<typeof getDiaryStats>, exercises: number, tests: number): Badge[] {
  return [
    { id: 'primera-entrada', icon: '📓', title: 'Primera Entrada', desc: 'Escribiste tu primera entrada en el diario', unlocked: diary.count >= 1, condition: '1 entrada en el diario' },
    { id: 'semana-constante', icon: '🔥', title: 'Semana Constante', desc: 'Escribiste en el diario 7 días seguidos', unlocked: diary.streak >= 7, condition: '7 días de racha' },
    { id: 'reflexivo', icon: '🌱', title: 'Reflexivo/a', desc: 'Tienes 5 o más entradas en tu diario', unlocked: diary.count >= 5, condition: '5 entradas' },
    { id: 'primer-ejercicio', icon: '🧘', title: 'Primer Ejercicio', desc: 'Completaste tu primer ejercicio guiado', unlocked: exercises >= 1, condition: '1 ejercicio completado' },
    { id: 'practicante', icon: '⚡', title: 'Practicante', desc: 'Completaste 5 ejercicios guiados', unlocked: exercises >= 5, condition: '5 ejercicios' },
    { id: 'primer-test', icon: '📋', title: 'Primer Test', desc: 'Completaste tu primer test de bienestar', unlocked: tests >= 1, condition: '1 test realizado' },
    { id: 'conocerse', icon: '🔬', title: 'Autoconocimiento', desc: 'Completaste 3 tests de bienestar', unlocked: tests >= 3, condition: '3 tests' },
    { id: 'bienestar-alto', icon: '🌟', title: 'Mente Clara', desc: 'Tu estado de ánimo promedio esta semana fue ≥ 4', unlocked: diary.avgMood >= 4, condition: 'Promedio ≥ 4 en 7 días' },
    { id: 'gratitud', icon: '💛', title: 'Corazón Agradecido', desc: 'Escribiste gratitud en 3 entradas del diario', unlocked: loadDiaryEntries().filter(e => e.gratitude).length >= 3, condition: '3 entradas con gratitud' },
    { id: 'comprometido', icon: '🏆', title: 'Comprometido/a', desc: 'Alcanzaste 10 entradas en tu diario', unlocked: diary.count >= 10, condition: '10 entradas' },
  ];
}

// ─── Mini mood chart ──────────────────────────────────────────────────────────
function MoodChart({ data }: { data: Array<{ date: string; mood: { value: number; emoji: string } }> }) {
  const emojis: Record<number, string> = { 5: '🤩', 4: '😊', 3: '😐', 2: '😔', 1: '😢' };
  const colors: Record<number, string> = { 5: '#10b981', 4: '#6366f1', 3: '#f59e0b', 2: '#f97316', 1: '#ef4444' };

  return (
    <div className="flex items-end gap-2 h-20">
      {[...data].reverse().map((entry, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <div
            className="w-full rounded-t-lg transition-all"
            style={{ height: `${(entry.mood.value / 5) * 56}px`, background: colors[entry.mood.value] || '#94a3b8', opacity: 0.85 }}
          />
          <span className="text-xs">{entry.mood.emoji}</span>
          <span className="text-[9px] text-slate-400 font-bold">
            {new Date(entry.date).toLocaleDateString('es', { weekday: 'short' })}
          </span>
        </div>
      ))}
      {data.length === 0 && (
        <div className="w-full text-center text-slate-300 text-sm py-6">Sin datos aún</div>
      )}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, sub }: { icon: React.ElementType; label: string; value: string | number; color: string; sub?: string }) {
  const Icon = icon;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <span className="text-sm font-bold text-slate-500">{label}</span>
      </div>
      <div className="text-3xl font-black text-slate-800">{value}</div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}

// ─── Activity heatmap (last 30 days) ─────────────────────────────────────────
function ActivityHeatmap() {
  const entries = loadDiaryEntries();
  const days = new Set(entries.map(e => new Date(e.date).toDateString()));

  const cells = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (34 - i));
    const hasEntry = days.has(d.toDateString());
    const isToday = d.toDateString() === new Date().toDateString();
    return { date: d, hasEntry, isToday };
  });

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5">
        {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-400">{d}</div>
        ))}
        {cells.map((cell, i) => (
          <div
            key={i}
            title={cell.date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })}
            className={cn(
              'h-6 w-full rounded-md transition-all',
              cell.isToday ? 'ring-2 ring-pink-400 ring-offset-1' : '',
              cell.hasEntry ? 'bg-pink-400' : 'bg-slate-100'
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 mt-2">
        <span className="text-[10px] text-slate-400">Sin entrada</span>
        <div className="h-3.5 w-3.5 rounded bg-slate-100" />
        <div className="h-3.5 w-3.5 rounded bg-pink-400" />
        <span className="text-[10px] text-slate-400">Con entrada</span>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function MiProgresoPage() {
  const [diary, setDiary] = useState(getDiaryStats());
  const [exercises, setExercises] = useState(getExerciseSessions());
  const [tests, setTests] = useState(getTestCount());

  useEffect(() => {
    setDiary(getDiaryStats());
    setExercises(getExerciseSessions());
    setTests(getTestCount());
  }, []);

  const badges = buildBadges(diary, exercises, tests);
  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl mb-10 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <BarChart2 className="h-4 w-4" />
              <span className="text-sm font-bold">Tu Evolución Personal</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3">Mi Progreso</h1>
            <p className="text-white/80 text-lg max-w-xl">
              Visualiza tu recorrido de bienestar. Cada pequeño paso cuenta.
            </p>
            <div className="flex items-center gap-2 mt-5 bg-white/15 rounded-xl p-3 w-fit">
              <Award className="h-5 w-5 text-yellow-300" />
              <span className="font-bold">{unlockedCount}/{badges.length} logros desbloqueados</span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={NotebookPen} label="Entradas en diario" value={diary.count} color="#ec4899" sub="Registros totales" />
          <StatCard icon={Flame} label="Racha actual" value={`${diary.streak}d`} color="#f97316" sub="Días consecutivos" />
          <StatCard icon={TrendingUp} label="Estado de ánimo" value={diary.avgMood || '—'} color="#6366f1" sub="Promedio últimos 7 días" />
          <StatCard icon={Target} label="Actividades" value={exercises + tests} color="#10b981" sub="Ejercicios + tests" />
        </div>

        {/* Mood trend */}
        {diary.last7.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              <h3 className="font-black text-slate-800">Estado de ánimo — Últimos 7 días</h3>
            </div>
            <MoodChart data={diary.last7} />
          </div>
        )}

        {/* Activity heatmap */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-pink-500" />
            <h3 className="font-black text-slate-800">Actividad en el diario — Últimos 35 días</h3>
          </div>
          <ActivityHeatmap />
        </div>

        {/* Badges */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-amber-500" />
            <h3 className="font-black text-slate-800 text-xl">Logros</h3>
            <span className="text-sm text-slate-400 ml-1">{unlockedCount} de {badges.length} desbloqueados</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {badges.map(badge => (
              <div
                key={badge.id}
                className={cn(
                  'relative flex flex-col items-center text-center p-4 rounded-2xl border transition-all duration-200',
                  badge.unlocked
                    ? 'bg-white border-amber-200 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                    : 'bg-slate-50 border-slate-100 opacity-50 grayscale'
                )}
              >
                {badge.unlocked && (
                  <div className="absolute -top-2 -right-2 h-5 w-5 bg-amber-400 rounded-full flex items-center justify-center shadow">
                    <Star className="h-3 w-3 text-white fill-white" />
                  </div>
                )}
                <span className="text-3xl mb-2">{badge.icon}</span>
                <span className={cn('text-xs font-black leading-tight', badge.unlocked ? 'text-slate-800' : 'text-slate-400')}>{badge.title}</span>
                <span className="text-[10px] text-slate-400 mt-1 leading-tight">{badge.condition}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
          <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
            <Heart className="h-4 w-4 text-pink-500" /> Sugerencias para ti
          </h3>
          <div className="space-y-3">
            {diary.count === 0 && (
              <div className="flex items-start gap-3 bg-white rounded-xl p-3 shadow-sm">
                <NotebookPen className="h-5 w-5 text-pink-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600">Empieza tu <strong>Diario Emocional</strong> hoy. Solo 2 minutos al día pueden hacer una gran diferencia.</p>
              </div>
            )}
            {exercises === 0 && (
              <div className="flex items-start gap-3 bg-white rounded-xl p-3 shadow-sm">
                <Brain className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600">Prueba un <strong>Ejercicio Guiado</strong> de respiración. En menos de 5 minutos notarás la diferencia.</p>
              </div>
            )}
            {tests === 0 && (
              <div className="flex items-start gap-3 bg-white rounded-xl p-3 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600">Realiza un <strong>Test de Bienestar</strong> para entender mejor tu estado emocional actual.</p>
              </div>
            )}
            {diary.count > 0 && exercises > 0 && tests > 0 && (
              <div className="flex items-start gap-3 bg-white rounded-xl p-3 shadow-sm">
                <Star className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600">¡Excelente constancia! Sigue construyendo tu hábito de bienestar. La consistencia es la clave.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
