import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { 
  BarChart2, 
  TrendingUp, 
  Award, 
  Calendar, 
  Flame, 
  Target, 
  CheckCircle2, 
  Star, 
  Heart, 
  Brain, 
  Wind, 
  NotebookPen,
  Sparkles,
  Compass,
  ArrowRight,
  Clock,
  ShieldCheck,
  Smile,
  Edit3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getProgressStats, setUserGoal, ActivityHistoryItem } from '@/utils/progressTracker';

// ─── Types ────────────────────────────────────────────────────────────────────
type Badge = { id: string; icon: string; title: string; desc: string; unlocked: boolean; condition: string };

const GOAL_OPTIONS = [
  'Reducción de Estrés y Ansiedad',
  'Mejora del Sueño y Descanso',
  'Hipnosis y Reprogramación Mental',
  'Equilibrio Emocional y Autoestima',
  'Crecimiento Espiritual y Claridad'
];

function getLevelInfo(progress: number) {
  if (progress >= 95) {
    return {
      title: '💎 Maestro del Bienestar',
      subtitle: 'Transformación plena y dominio de hábitos conscientes',
      badgeColor: 'from-amber-400 to-yellow-500 text-slate-950'
    };
  }
  if (progress >= 75) {
    return {
      title: '🌟 Guardián de Paz Interior',
      subtitle: 'Conexión elevada y práctica sostenida',
      badgeColor: 'from-indigo-500 to-purple-600 text-white'
    };
  }
  if (progress >= 50) {
    return {
      title: '🌸 Mente en Equilibrio',
      subtitle: 'Constancia activa y regulación emocional efectiva',
      badgeColor: 'from-emerald-500 to-teal-600 text-white'
    };
  }
  if (progress >= 20) {
    return {
      title: '🌿 Buscador de Calma',
      subtitle: 'Desarrollando hábitos de bienestar diario',
      badgeColor: 'from-teal-600 to-cyan-700 text-white'
    };
  }
  return {
    title: '🌱 Semilla de Luz',
    subtitle: 'Iniciando el camino hacia tu bienestar integral',
    badgeColor: 'from-slate-700 to-slate-900 text-white'
  };
}

function buildBadges(diaryCount: number, streak: number, exercises: number, tests: number, avgMood: number): Badge[] {
  return [
    { id: 'primera-entrada', icon: '📓', title: 'Primera Entrada', desc: 'Escribiste tu primera reflexión en el diario', unlocked: diaryCount >= 1, condition: '1 entrada en el diario' },
    { id: 'semana-constante', icon: '🔥', title: 'Semana Constante', desc: 'Racha de 7 días consecutivos en el diario', unlocked: streak >= 7, condition: '7 días de racha' },
    { id: 'reflexivo', icon: '🌱', title: 'Mente Reflexiva', desc: 'Tienes 5 o más entradas en tu diario', unlocked: diaryCount >= 5, condition: '5 entradas' },
    { id: 'primer-ejercicio', icon: '🧘', title: 'Primer Ejercicio', desc: 'Completaste tu primer ejercicio guiado o respiración', unlocked: exercises >= 1, condition: '1 ejercicio completado' },
    { id: 'practicante', icon: '⚡', title: 'Practicante Frecuente', desc: 'Completaste 5 ejercicios guiados', unlocked: exercises >= 5, condition: '5 ejercicios' },
    { id: 'primer-test', icon: '📋', title: 'Evaluación Inicial', desc: 'Completaste tu primer test de bienestar', unlocked: tests >= 1, condition: '1 test realizado' },
    { id: 'autoconocimiento', icon: '🔬', title: 'Autoconocimiento', desc: 'Completaste 3 tests de bienestar', unlocked: tests >= 3, condition: '3 tests' },
    { id: 'bienestar-alto', icon: '🌟', title: 'Mente Clara', desc: 'Tu estado de ánimo promedio esta semana fue ≥ 4', unlocked: avgMood >= 4, condition: 'Promedio ≥ 4 en 7 días' },
    { id: 'hito-50', icon: '💎', title: 'Paso Firme', desc: 'Alcanzaste el 50% en tu nivel de evolución global', unlocked: (diaryCount * 8 + exercises * 7 + tests * 12.5) >= 50, condition: '50% nivel global' },
    { id: 'comprometido', icon: '🏆', title: 'Guardián Constante', desc: 'Alcanzaste 10 entradas en tu diario', unlocked: diaryCount >= 10, condition: '10 entradas' },
  ];
}

// ─── Mini Mood Chart ──────────────────────────────────────────────────────────
function MoodChart({ data }: { data: Array<{ date: string; mood: { value: number; emoji: string } }> }) {
  const colors: Record<number, string> = { 5: '#10b981', 4: '#6366f1', 3: '#f59e0b', 2: '#f97316', 1: '#ef4444' };

  return (
    <div className="flex items-end gap-2 h-24 pt-2">
      {[...data].reverse().map((entry, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
          <span className="text-xs">{entry.mood?.emoji || '😐'}</span>
          <div
            className="w-full rounded-t-lg transition-all shadow-sm"
            style={{ height: `${((entry.mood?.value || 3) / 5) * 60}px`, background: colors[entry.mood?.value || 3] || '#94a3b8' }}
          />
          <span className="text-[10px] text-slate-400 font-bold">
            {new Date(entry.date).toLocaleDateString('es-CO', { weekday: 'short' })}
          </span>
        </div>
      ))}
      {data.length === 0 && (
        <div className="w-full text-center text-slate-400 text-sm py-6 font-medium">
          Aún no has registrado estados de ánimo en tu diario esta semana.
        </div>
      )}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, sub }: { icon: React.ElementType; label: string; value: string | number; color: string; sub?: string }) {
  const Icon = icon;
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-11 w-11 rounded-2xl flex items-center justify-center shadow-inner" style={{ background: `${color}15` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span>
      </div>
      <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
      {sub && <div className="text-xs text-slate-400 font-medium mt-1">{sub}</div>}
    </div>
  );
}

// ─── Activity Heatmap ────────────────────────────────────────────────────────
function ActivityHeatmap({ diaryEntries }: { diaryEntries: Array<{ date: string }> }) {
  const daysWithEntries = new Set(diaryEntries.map((e) => new Date(e.date).toDateString()));

  const cells = Array.from({ length: 35 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    const hasEntry = daysWithEntries.has(d.toDateString());
    const isToday = d.toDateString() === new Date().toDateString();
    return { date: d, hasEntry, isToday };
  });

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5">
        {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((d) => (
          <div key={d} className="text-center text-[10px] font-black text-slate-400">{d}</div>
        ))}
        {cells.map((cell, i) => (
          <div
            key={i}
            title={cell.date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })}
            className={cn(
              'h-7 w-full rounded-lg transition-all flex items-center justify-center text-[10px] font-bold',
              cell.isToday ? 'ring-2 ring-emerald-500 ring-offset-1 font-black' : '',
              cell.hasEntry ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 text-slate-300'
            )}
          >
            {cell.date.getDate()}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-3 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="h-3.5 w-3.5 rounded bg-slate-100 border border-slate-200" />
          <span className="text-[10px] text-slate-400 font-bold">Sin actividad</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3.5 w-3.5 rounded bg-emerald-500" />
          <span className="text-[10px] text-slate-400 font-bold">Con actividad</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────────
export default function MiProgresoPage() {
  const [stats, setStats] = useState(getProgressStats());
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  const refreshStats = () => {
    setStats(getProgressStats());
  };

  useEffect(() => {
    refreshStats();

    const handleUpdate = () => refreshStats();
    window.addEventListener('conexionluz:progreso-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('conexionluz:progreso-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const level = getLevelInfo(stats.overallProgress);
  const badges = buildBadges(stats.diaryCount, stats.diaryStreak, stats.exerciseCount, stats.testCount, stats.avgMood);
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const handleSelectGoal = (goal: string) => {
    setUserGoal(goal);
    setIsEditingGoal(false);
    refreshStats();
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('es-CO', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {/* Hero Banner - Luminous & Clear Design */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 p-8 md:p-12 text-white shadow-2xl border border-indigo-400/30">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/25">
                <BarChart2 className="h-4 w-4 text-amber-300" />
                <span className="text-xs font-black uppercase tracking-wider text-white">Tu Evolución Personal Real</span>
              </div>

              {/* Goal Badge */}
              <div className="relative">
                <button
                  onClick={() => setIsEditingGoal(!isEditingGoal)}
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-xs font-black px-4 py-1.5 rounded-full border border-white/30 transition-all cursor-pointer backdrop-blur-md"
                >
                  <Target className="w-3.5 h-3.5 text-amber-300" />
                  <span>Enfoque: {stats.userGoal}</span>
                  <Edit3 className="w-3 h-3 opacity-80" />
                </button>

                {isEditingGoal && (
                  <div className="absolute right-0 mt-2 w-72 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100 p-3 z-30 space-y-1 animate-scale-in">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-2 py-1">
                      Elige tu Objetivo Principal:
                    </span>
                    {GOAL_OPTIONS.map((g) => (
                      <button
                        key={g}
                        onClick={() => handleSelectGoal(g)}
                        className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                          stats.userGoal === g ? 'bg-indigo-50 text-indigo-800' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h1 className="text-3xl md:text-5xl font-black leading-tight text-white tracking-tight">
                Mi Progreso de Bienestar
              </h1>
              <p className="text-white/90 text-sm md:text-base max-w-xl leading-relaxed mt-2 font-medium">
                Métricas reales calculadas a partir de tus hábitos, reflexiones en el diario, ejercicios completados y evaluaciones de salud mental.
              </p>
            </div>

            {/* Progress Level Card */}
            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-6 border border-white/25 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs font-extrabold uppercase text-white/80 tracking-wider">Nivel Actual de Evolución</span>
                  <h3 className="text-xl md:text-2xl font-black text-white mt-0.5">{level.title}</h3>
                  <p className="text-xs text-white/85 font-medium">{level.subtitle}</p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-amber-300">{stats.overallProgress}%</span>
                  <span className="text-xs font-bold text-white/80 block">Completado</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-black/20 rounded-full h-3.5 p-0.5 overflow-hidden border border-white/20">
                <div
                  className="bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-300 h-full rounded-full transition-all duration-700 shadow-md"
                  style={{ width: `${stats.overallProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-white/85 pt-1">
                <span>🌱 Semilla de Luz (0%)</span>
                <span>💎 Maestro (100%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard icon={NotebookPen} label="Entradas en Diario" value={stats.diaryCount} color="#ec4899" sub={`Racha actual: ${stats.diaryStreak} días`} />
          <StatCard icon={Wind} label="Ejercicios Completados" value={stats.exerciseCount} color="#10b981" sub="Prácticas y respiración" />
          <StatCard icon={CheckCircle2} label="Tests Realizados" value={stats.testCount} color="#6366f1" sub="Evaluaciones clínicas" />
          <StatCard icon={Award} label="Logros Obtenidos" value={`${unlockedCount}/${badges.length}`} color="#f59e0b" sub="Medallas desbloqueadas" />
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/actividades/diario-emocional"
            className="bg-white hover:bg-pink-50/50 p-5 rounded-3xl border border-slate-100 hover:border-pink-200 shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
                <NotebookPen className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-800 group-hover:text-pink-600 transition-colors">Escribir en Diario</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/actividades/relajacion"
            className="bg-white hover:bg-teal-50/50 p-5 rounded-3xl border border-slate-100 hover:border-teal-200 shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center">
                <Wind className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-800 group-hover:text-teal-600 transition-colors">Practicar Respiración</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/actividades/tests"
            className="bg-white hover:bg-indigo-50/50 p-5 rounded-3xl border border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-800 group-hover:text-indigo-600 transition-colors">Hacer un Test</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/agenda"
            className="bg-white hover:bg-emerald-50/50 p-5 rounded-3xl border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-800 group-hover:text-emerald-600 transition-colors">Agendar Cita</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Charts & Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood Trend & Heatmap */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-indigo-500" />
                <h3 className="font-black text-slate-900 text-base">Estado de Ánimo — Últimos 7 días</h3>
              </div>
              <MoodChart data={stats.diaryEntries.slice(0, 7)} />
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-emerald-500" />
                <h3 className="font-black text-slate-900 text-base">Mapa de Actividad (Últimos 35 Días)</h3>
              </div>
              <ActivityHeatmap diaryEntries={stats.diaryEntries} />
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-teal-600" />
                  <h3 className="font-black text-slate-900 text-base">Historial Reciente de Actividades</h3>
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                  Tiempo Real
                </span>
              </div>

              {stats.history.length > 0 ? (
                <div className="space-y-4">
                  {stats.history.map((item) => (
                    <div key={item.id} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80">
                      <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-200/60 shadow-xs">
                        {item.type === 'diario' && <NotebookPen className="w-4 h-4 text-pink-500" />}
                        {item.type === 'ejercicio' && <Wind className="w-4 h-4 text-teal-500" />}
                        {item.type === 'test' && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
                        {item.type === 'cita' && <Calendar className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                          <span className="text-[10px] font-semibold text-slate-400 shrink-0">{formatDate(item.date)}</span>
                        </div>
                        {item.details && <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{item.details}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <Compass className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-500">Aún no hay actividades registradas.</p>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Completa un ejercicio guiado, escribe en tu diario o realiza un test de bienestar para ver tu evolución en tiempo real.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Badges System */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 text-amber-500" />
              <h3 className="font-black text-slate-900 text-xl">Insignias y Medallas</h3>
            </div>
            <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
              {unlockedCount} de {badges.length} desbloqueados
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={cn(
                  'relative flex flex-col items-center text-center p-4 rounded-3xl border transition-all duration-200',
                  badge.unlocked
                    ? 'bg-white border-amber-200 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                    : 'bg-slate-50/60 border-slate-100 opacity-50 grayscale'
                )}
              >
                {badge.unlocked && (
                  <div className="absolute -top-2 -right-2 h-5 w-5 bg-amber-400 rounded-full flex items-center justify-center shadow">
                    <Star className="h-3 w-3 text-white fill-white" />
                  </div>
                )}
                <span className="text-3xl mb-2">{badge.icon}</span>
                <span className={cn('text-xs font-black leading-tight', badge.unlocked ? 'text-slate-900' : 'text-slate-400')}>
                  {badge.title}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 leading-tight font-semibold">{badge.condition}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
