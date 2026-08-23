import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Award, Calendar, Compass, Flame, ShieldCheck } from 'lucide-react';

const CHALLENGES = [
  {
    id: 1,
    title: "Reto 1: Autoobservación Consciente (7 Días)",
    desc: "Durante 7 días, dedica 3 momentos al día a notar tu diálogo interno sin juzgarte.",
    benefit: "Desarrolla la corteza prefrontal y reduce la reactividad automática ante el estrés."
  },
  {
    id: 2,
    title: "Reto 2: Tres Evidencias de Capacidad / Gratitud Diaria",
    desc: "Anota cada noche 3 hechos concretos que hiciste bien o por los que sientes genuina gratitud.",
    benefit: "Entrena al cerebro para notar los recursos disponibles y fortalece la autoestima."
  },
  {
    id: 3,
    title: "Reto 3: Comunicación Consciente y Límites",
    desc: "Practica decir 'no' a una solicitud menor con amabilidad y firmeza, o expresa una necesidad con claridad.",
    benefit: "Protege tu energía vital y cultiva relaciones basadas en la honestidad recíproca."
  },
  {
    id: 4,
    title: "Reto 4: El Micro-Hábito de 2 Minutos",
    desc: "Ejecuta una acción minúscula (leer 2 páginas, 5 flexiones, 2 minutos de respiración) sin fallar ningún día.",
    benefit: "Vence la resistencia neuronal y establece la identidad del que cumple sus promesas."
  },
  {
    id: 5,
    title: "Reto 5: Acción Alineada con tu Valor Central",
    desc: "Dedica 20 minutos diarios a una actividad directamente inspirada en tu valor prioritario.",
    benefit: "Aumenta la satisfacción vital y la coherencia existencial."
  },
  {
    id: 6,
    title: "Reto 6: Escucha Activa sin Interrumpir",
    desc: "En una conversación diaria, escucha con atención plena sin preparar tu respuesta mentalmente mientras el otro habla.",
    benefit: "Profundiza los vínculos emocionales y mejora la empatía interpersonal."
  },
  {
    id: 7,
    title: "Reto 7: Del Pensamiento a la Acción Inmediata",
    desc: "Elige una tarea postergada y ejecuta su primer micro-paso de 5 minutos inmediatamente.",
    benefit: "Desactiva la trampa de la procrastinación a través del movimiento."
  }
];

export default function DPRetosCrecimiento() {
  const [progress, setProgress] = useState<Record<number, boolean[]>>({});

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:dp_challenges');
    if (local) {
      try {
        setProgress(JSON.parse(local));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleDay = (challengeId: number, dayIdx: number) => {
    const currentDays = progress[challengeId] || [false, false, false, false, false, false, false];
    const newDays = [...currentDays];
    newDays[dayIdx] = !newDays[dayIdx];

    const updated = { ...progress, [challengeId]: newDays };
    setProgress(updated);
    localStorage.setItem('conexionluz:dp_challenges', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Flame className="h-3 w-3" /> RETOS DE 7 DÍAS
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Retos Prácticos de Crecimiento</h2>
        <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Ejercicios voluntarios estructurados en ciclos de 7 días para llevar la teoría a la práctica cotidiana con constancia y motivación.
        </p>
      </div>

      {/* Challenges Grid */}
      <div className="space-y-4">
        {CHALLENGES.map((ch) => {
          const days = progress[ch.id] || [false, false, false, false, false, false, false];
          const completedCount = days.filter(Boolean).length;
          const isAllDone = completedCount === 7;

          return (
            <div
              key={ch.id}
              className={`bg-white border rounded-3xl p-6 space-y-4 shadow-2xs transition-all ${
                isAllDone ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    {ch.title}
                    {isAllDone && (
                      <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                        ¡Completado!
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{ch.desc}</p>
                </div>
                <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full self-start sm:self-center">
                  {completedCount} / 7 Días
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-[11px] text-slate-500 italic max-w-md">
                  <strong>Impacto:</strong> {ch.benefit}
                </p>

                {/* Day Checkboxes */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((dayNum, idx) => {
                    const isDone = days[idx];
                    return (
                      <button
                        key={dayNum}
                        onClick={() => toggleDay(ch.id, idx)}
                        className={`h-9 w-9 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                          isDone
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="h-4 w-4" /> : `D${dayNum}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
