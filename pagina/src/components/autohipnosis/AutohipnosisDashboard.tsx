import React from 'react';
import { Award, CheckCircle2, Flame, Clock, BookOpen, Sparkles, Wand2, Volume2, Trophy } from 'lucide-react';

interface AutohipnosisDashboardProps {
  progressPercent: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  streakDays?: number;
  totalMinutes?: number;
  onOpenGenerator: () => void;
  onOpenAudios: () => void;
  onOpenDiary: () => void;
  onOpenCertificate: () => void;
}

export default function AutohipnosisDashboard({
  progressPercent,
  completedLessonsCount,
  totalLessonsCount,
  streakDays = 3,
  totalMinutes = 45,
  onOpenGenerator,
  onOpenAudios,
  onOpenDiary,
  onOpenCertificate
}: AutohipnosisDashboardProps) {

  const badges = [
    {
      id: 'b1',
      title: 'Primera Práctica',
      desc: 'Completaste tu primer ejercicio de respiración o inducción',
      unlocked: completedLessonsCount >= 1,
      icon: Sparkles,
      color: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    {
      id: 'b2',
      title: 'Explorador de la Mente',
      desc: 'Completaste el Módulo 1 y desmentiste los mitos de la hipnosis',
      unlocked: completedLessonsCount >= 7,
      icon: BookOpen,
      color: 'bg-indigo-100 text-indigo-900 border-indigo-300'
    },
    {
      id: 'b3',
      title: 'Maestro de la Relajación',
      desc: 'Registraste 3 o más prácticas en tu Diario de Autohipnosis',
      unlocked: totalMinutes >= 30,
      icon: Wand2,
      color: 'bg-purple-100 text-purple-900 border-purple-300'
    },
    {
      id: 'b4',
      title: '7 Días de Constancia',
      desc: 'Mantuviste tu racha de práctica durante una semana',
      unlocked: streakDays >= 7,
      icon: Flame,
      color: 'bg-rose-100 text-rose-900 border-rose-300'
    },
    {
      id: 'b5',
      title: 'Curso Completado',
      desc: 'Completaste los 8 módulos y aprobaste el examen final',
      unlocked: progressPercent >= 100,
      icon: Trophy,
      color: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    }
  ];

  return (
    <div className="space-y-6 select-text">
      
      {/* Student Progress Overview Header */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-amber-50 text-slate-900 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 border border-indigo-100">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-white border border-indigo-200 px-3 py-1 rounded-full inline-flex items-center gap-1 shadow-2xs">
              <Sparkles className="h-3 w-3 text-amber-500" /> DASHBOARD DEL ALUMNO
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">Tu Avance en Autohipnosis</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Sigue tu progreso de aprendizaje, días consecutivos de práctica e insignias alcanzadas.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenGenerator}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Wand2 className="h-4 w-4" /> Generar Sesión
            </button>
            <button
              onClick={onOpenDiary}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <BookOpen className="h-4 w-4" /> Mi Diario
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span>PROGRESO DEL CURSO: {progressPercent}%</span>
            <span className="text-indigo-700">{completedLessonsCount} de {totalLessonsCount} lecciones completadas</span>
          </div>
          <div className="w-full bg-white h-3 rounded-full overflow-hidden p-0.5 border border-slate-200 shadow-inner">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Gamification Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-bold">
          <div className="p-3 bg-white border border-slate-200/80 rounded-2xl flex items-center gap-3 shadow-2xs">
            <Flame className="h-6 w-6 text-rose-500 shrink-0" />
            <div>
              <div className="text-base font-black text-slate-900">{streakDays} Días</div>
              <div className="text-[10px] text-slate-500 font-medium">Racha de Práctica</div>
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200/80 rounded-2xl flex items-center gap-3 shadow-2xs">
            <Clock className="h-6 w-6 text-amber-500 shrink-0" />
            <div>
              <div className="text-base font-black text-slate-900">{totalMinutes} Min</div>
              <div className="text-[10px] text-slate-500 font-medium">Minutos Acumulados</div>
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200/80 rounded-2xl flex items-center gap-3 shadow-2xs">
            <Volume2 className="h-6 w-6 text-purple-600 shrink-0" />
            <div>
              <div className="text-base font-black text-slate-900">10 Audios</div>
              <div className="text-[10px] text-slate-500 font-medium">Biblioteca de Guiadas</div>
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200/80 rounded-2xl flex items-center gap-3 shadow-2xs">
            <Trophy className="h-6 w-6 text-emerald-600 shrink-0" />
            <div>
              <div className="text-base font-black text-slate-900">{progressPercent >= 100 ? 'Disponible' : 'En Avance'}</div>
              <div className="text-[10px] text-slate-500 font-medium">Certificado Digital</div>
            </div>
          </div>
        </div>

      </div>

      {/* Badges System Grid */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-2xs">
        <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          <span>Insignias de Logro & Gamificación</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div 
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                  badge.unlocked 
                    ? `${badge.color} shadow-2xs font-bold` 
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div className="h-9 w-9 rounded-xl bg-white border border-current/20 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-black flex items-center gap-1">
                    <span>{badge.title}</span>
                    {badge.unlocked && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                  </div>
                  <p className="text-[11px] font-medium leading-tight opacity-90">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
