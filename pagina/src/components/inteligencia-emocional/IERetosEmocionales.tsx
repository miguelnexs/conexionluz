import React, { useState, useEffect } from 'react';
import { Flame, CheckCircle2, Award, Heart, Compass, Sparkles } from 'lucide-react';

const CHALLENGES = [
  {
    id: 1,
    title: "Reto 1: Observa tus Emociones (7 Días)",
    desc: "Durante 7 días consecutivos, haz una pausa de 2 minutos para registrar la emoción predominante del día.",
    benefit: "Desarrolla la autoobservación consciente y reduce el piloto automático afectivo."
  },
  {
    id: 2,
    title: "Reto 2: Nombra con Precisión (7 Días)",
    desc: "Amplía tu vocabulario afectivo nombrando matices precisos (ej: 'nostálgico', 'aprensivo', 'entusiasmado').",
    benefit: "Aumenta la granularidad emocional y facilita la autorregulación biológica."
  },
  {
    id: 3,
    title: "Reto 3: La Pausa de 60 Segundos (7 Días)",
    desc: "Antes de responder a un mensaje difícil o ante una provocación, respira 1 minuto conscientemente.",
    benefit: "Desactiva la reactividad impulsiva de la amígdala cerebral."
  },
  {
    id: 4,
    title: "Reto 4: Escucha Activa sin Interrumpir (7 Días)",
    desc: "En una conversación diaria, escucha a la otra persona con atención plena sin formular tu réplica mental.",
    benefit: "Profundiza la conexión interpersonal y cultiva un clima de respeto y empatía."
  },
  {
    id: 5,
    title: "Reto 5: Validación Empática (7 Días)",
    desc: "Haz una pregunta genuina ('¿Cómo te hace sentir eso?') y valida la experiencia sin juzgar.",
    benefit: "Fortalece la seguridad psicológica en los vínculos significativos."
  },
  {
    id: 6,
    title: "Reto 6: Expresión Asertiva de Necesidades (7 Días)",
    desc: "Comunica una petición o límite personal utilizando la estructura en primera persona ('Yo necesito...').",
    benefit: "Previene la acumulación de resentimiento y fomenta acuerdos claros."
  },
  {
    id: 7,
    title: "Reto 7: Integración y Autocompasión (7 Días)",
    desc: "Cierra el día reconociendo tu humanidad, tus esfuerzos y tratándote con amabilidad incondicional.",
    benefit: "Consolida la paz interior y la madurez emocional a largo plazo."
  }
];

export default function IERetosEmocionales() {
  const [progress, setProgress] = useState<Record<number, boolean[]>>({});

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:ie_challenges');
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
    localStorage.setItem('conexionluz:ie_challenges', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/30 border border-teal-400/40 text-teal-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            ⚡ RETOS DE 7 DÍAS
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Retos de Entrenamiento Afectivo</h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Ejercicios prácticos estructurados en ciclos de 7 días para llevar la inteligencia emocional del aula a tus interacciones diarias.
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
                isAllDone ? 'border-teal-300 bg-teal-50/20' : 'border-slate-200/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    {ch.title}
                    {isAllDone && (
                      <span className="text-[10px] font-black bg-teal-600 text-white px-2 py-0.5 rounded-full">
                        ¡Completado!
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{ch.desc}</p>
                </div>
                <span className="text-xs font-black text-teal-800 bg-teal-50 px-3 py-1 rounded-full self-start sm:self-center">
                  {completedCount} / 7 Días
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-[11px] text-slate-500 italic max-w-md">
                  <strong>Impacto:</strong> {ch.benefit}
                </p>

                {/* Days */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((dayNum, idx) => {
                    const isDone = days[idx];
                    return (
                      <button
                        key={dayNum}
                        onClick={() => toggleDay(ch.id, idx)}
                        className={`h-9 w-9 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                          isDone
                            ? 'bg-teal-600 text-white shadow-xs'
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
