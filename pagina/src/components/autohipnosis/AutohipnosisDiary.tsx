import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Calendar, Smile, Frown, Sparkles, Trash2, TrendingUp, Award, Activity } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export interface DiaryEntry {
  id: string;
  date: string;
  durationMinutes: number;
  exerciseTitle: string;
  relaxationLevel: number; // 1 - 10
  emotionalStateBefore: string;
  emotionalStateAfter: string;
  notes: string;
}

export default function AutohipnosisDiary() {
  const { toast } = useToast();
  const STORAGE_KEY = 'conexionluz:autohipnosis_diary';

  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [
        {
          id: '1',
          date: new Date().toISOString().split('T')[0],
          durationMinutes: 10,
          exerciseTitle: 'Autohipnosis Estándar de 10 Minutos',
          relaxationLevel: 9,
          emotionalStateBefore: 'Estrés acumulado por trabajo',
          emotionalStateAfter: 'Calma serena y claridad mental',
          notes: 'Logré visualizar la playa con alta nitidez. La respiración 4-7-8 me ayudó a soltar los hombros.'
        }
      ];
    } catch {
      return [];
    }
  });

  const [showForm, setShowForm] = useState<boolean>(false);
  
  // Form State
  const [exerciseTitle, setExerciseTitle] = useState<string>('Autohipnosis de 10 minutos');
  const [durationMinutes, setDurationMinutes] = useState<number>(10);
  const [relaxationLevel, setRelaxationLevel] = useState<number>(8);
  const [emotionalStateBefore, setEmotionalStateBefore] = useState<string>('Tensión moderada');
  const [emotionalStateAfter, setEmotionalStateAfter] = useState<string>('Serenidad y descanso');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      durationMinutes,
      exerciseTitle,
      relaxationLevel,
      emotionalStateBefore,
      emotionalStateAfter,
      notes
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    setShowForm(false);
    setNotes('');

    toast({
      title: "📓 ¡Entrada registrada en tu Diario!",
      description: "Tu sesión de autohipnosis ha sido guardada en tus estadísticas personales."
    });
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    toast({
      title: "Registro eliminado",
      description: "La entrada ha sido removida de tu diario."
    });
  };

  const avgRelaxation = entries.length > 0
    ? (entries.reduce((acc, curr) => acc + curr.relaxationLevel, 0) / entries.length).toFixed(1)
    : '0';

  const totalMinutes = entries.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  return (
    <div className="space-y-8 select-text">
      
      {/* Header Banner & Stats */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-amber-50 text-slate-900 rounded-3xl p-6 sm:p-8 shadow-xs border border-indigo-100 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-white text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full inline-flex items-center gap-1 shadow-2xs">
              <Sparkles className="h-3 w-3 text-amber-500" /> REGISTRO PERSONAL DE PRÁCTICA
            </span>
            <h3 className="text-2xl sm:text-3xl font-black mt-2 text-slate-900">Mi Diario de Autohipnosis</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Observa tu evolución emocional y registra los niveles de relajación alcanzados en cada sesión.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>{showForm ? 'Cancelar' : 'Registrar Nueva Sesión'}</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-slate-900">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
            <Activity className="h-8 w-8 text-amber-500 shrink-0" />
            <div>
              <div className="text-xl font-black">{entries.length}</div>
              <div className="text-[11px] text-slate-500 font-medium">Sesiones Registradas</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
            <TrendingUp className="h-8 w-8 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xl font-black">{avgRelaxation} / 10</div>
              <div className="text-[11px] text-slate-500 font-medium">Promedio Relajación</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3 col-span-2 sm:col-span-1 shadow-2xs">
            <Award className="h-8 w-8 text-indigo-600 shrink-0" />
            <div>
              <div className="text-xl font-black">{totalMinutes} Min</div>
              <div className="text-[11px] text-slate-500 font-medium">Minutos Acumulados</div>
            </div>
          </div>
        </div>

      </div>

      {/* New Entry Form */}
      {showForm && (
        <form onSubmit={handleSaveEntry} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 animate-in fade-in duration-300">
          <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <span>Registrar Nueva Sesión de Autohipnosis</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">Ejercicio Realizado</label>
              <input
                type="text"
                value={exerciseTitle}
                onChange={(e) => setExerciseTitle(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">Duración (Minutos)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                min={1}
                max={120}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Relaxation Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Nivel de Relajación Alcanzado</span>
              <span className="text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">{relaxationLevel} / 10</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={relaxationLevel}
              onChange={(e) => setRelaxationLevel(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>1 (Muy Ligero)</span>
              <span>5 (Relajación Media)</span>
              <span>10 (Trance Profundo)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">Estado Emocional Antes</label>
              <input
                type="text"
                value={emotionalStateBefore}
                onChange={(e) => setEmotionalStateBefore(e.target.value)}
                placeholder="Ej: Ansiedad ligera, fatiga mental"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">Estado Emocional Después</label>
              <input
                type="text"
                value={emotionalStateAfter}
                onChange={(e) => setEmotionalStateAfter(e.target.value)}
                placeholder="Ej: Calma serena, mente despejada"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase">Experiencia & Observaciones</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Describe lo que sentiste en la sesión, sugestiones integradas o imágenes mentales..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            Guardar en Mi Diario
          </button>
        </form>
      )}

      {/* Diary Logs List */}
      <div className="space-y-4">
        <h4 className="font-black text-slate-900 text-base">Historial de Registros</h4>

        {entries.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 font-bold text-xs">
            Aún no has registrado ninguna sesión. ¡Haz clic en "Registrar Nueva Sesión" para comenzar tu historial!
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {item.relaxationLevel}
                    </span>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">{item.exerciseTitle}</h5>
                      <span className="text-[10px] text-slate-400 font-medium">{item.date} · {item.durationMinutes} Minutos</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteEntry(item.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Eliminar registro"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Antes:</span>
                    <span className="text-slate-700 font-medium">{item.emotionalStateBefore}</span>
                  </div>

                  <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block">Después:</span>
                    <span className="text-emerald-950 font-bold">{item.emotionalStateAfter}</span>
                  </div>
                </div>

                {item.notes && (
                  <p className="text-xs text-slate-600 font-medium leading-relaxed italic bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    "{item.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
