import React, { useState, useEffect } from 'react';
import { Flame, CheckCircle2, Award, Heart, Compass, Sparkles } from 'lucide-react';

const CHALLENGES = [
  {
    id: 1,
    title: "Reto 1: Observar (7 Días)",
    desc: "Durante 7 días, registra una experiencia cotidiana y describe qué pensamientos y emociones te generó sin juzgarte.",
    benefit: "Desarrolla el músculo de la autoobservación consciente y reduce el juicio automático."
  },
  {
    id: 2,
    title: "Reto 2: Escucharte (7 Días)",
    desc: "Haz una pausa de 2 minutos al mediodía para preguntarte: '¿Qué necesito en este momento para sentirme en paz?'",
    benefit: "Te reconecta con tus necesidades físicas, emocionales y de descanso."
  },
  {
    id: 3,
    title: "Reto 3: Valores en Acción (7 Días)",
    desc: "Observa una decisión cotidiana y analiza cuál de tus 5 valores rectores la está orientando.",
    benefit: "Aumenta la coherencia entre tus principios profundos y tus actos diarios."
  },
  {
    id: 4,
    title: "Reto 4: Registro Afectivo Somático (7 Días)",
    desc: "Registra diariamente una emoción y ubica con precisión en qué parte del cuerpo la sentiste físicamente.",
    benefit: "Calibra tu mapa interoceptivo y previene la somatización del estrés."
  },
  {
    id: 5,
    title: "Reto 5: El Observador de Pensamientos (7 Días)",
    desc: "Identifica un pensamiento repetitivo al día y pregúntate: '¿Esto es un hecho comprobable o es sólo una interpretación?'",
    benefit: "Favorece la desidentificación cognitiva y la flexibilidad mental."
  },
  {
    id: 6,
    title: "Reto 6: Fortalezas Cotidianas (7 Días)",
    desc: "Reconoce cada noche una capacidad o recurso personal que utilizaste para resolver un reto del día.",
    benefit: "Consolida una autoestima sana basada en hechos reales y no en exigencias imposibles."
  },
  {
    id: 7,
    title: "Reto 7: Integración y Autocompasión (7 Días)",
    desc: "Escribe un breve párrafo agradeciendo a tu persona por el camino recorrido y los aprendizajes asimilados.",
    benefit: "Cierra el ciclo fortaleciendo una relación amable y consciente contigo mismo."
  }
];

export default function ACRetos() {
  const [progress, setProgress] = useState<Record<number, boolean[]>>({});

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:ac_challenges');
    if (local) {
      try { setProgress(JSON.parse(local)); } catch (e) {}
    }
  }, []);

  const toggleDay = (challengeId: number, dayIdx: number) => {
    const currentDays = progress[challengeId] || [false, false, false, false, false, false, false];
    const newDays = [...currentDays];
    newDays[dayIdx] = !newDays[dayIdx];

    const updated = { ...progress, [challengeId]: newDays };
    setProgress(updated);
    localStorage.setItem('conexionluz:ac_challenges', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            ⚡ RETOS DE 7 DÍAS
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Retos de Exploración Personal</h2>
        <p className="text-indigo-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Ejercicios voluntarios y estructurados en ciclos de 7 días para asentar hábitos de autoobservación, escucha de necesidades y coherencia interior.
        </p>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        {CHALLENGES.map((ch) => {
          const days = progress[ch.id] || [false, false, false, false, false, false, false];
          const completedCount = days.filter(Boolean).length;
          const isAllDone = completedCount === 7;

          return (
            <div
              key={ch.id}
              className={`bg-white border rounded-3xl p-6 space-y-4 shadow-2xs transition-all ${
                isAllDone ? 'border-indigo-300 bg-indigo-50/20' : 'border-slate-200/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    {ch.title}
                    {isAllDone && (
                      <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                        ¡Completado!
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{ch.desc}</p>
                </div>
                <span className="text-xs font-black text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full self-start sm:self-center">
                  {completedCount} / 7 Días
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-[11px] text-slate-500 italic max-w-md">
                  <strong>Impacto:</strong> {ch.benefit}
                </p>

                {/* Days buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((dayNum, idx) => {
                    const isDone = days[idx];
                    return (
                      <button
                        key={dayNum}
                        onClick={() => toggleDay(ch.id, idx)}
                        className={`h-9 w-9 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                          isDone
                            ? 'bg-indigo-600 text-white shadow-xs'
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
