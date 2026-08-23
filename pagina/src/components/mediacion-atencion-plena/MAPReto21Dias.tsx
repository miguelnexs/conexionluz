import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  Trophy, 
  Brain, 
  Eye, 
  Compass, 
  ChevronRight, 
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface DayChallenge {
  day: number;
  phase: string;
  title: string;
  focus: string;
  task: string;
  reflectionPrompt: string;
}

const CHALLENGES_21: DayChallenge[] = [
  // DÍAS 1-3: Observación del presente
  {
    day: 1,
    phase: 'Fase 1: Observación del Presente',
    title: 'Día 1: Los 3 Anclajes del Presente',
    focus: 'Sentidos y respiración',
    task: 'Realiza 3 pausas de 1 minuto a lo largo del día. Nombra 3 cosas que ves, 2 que escuchas y 1 que sientes físicamente.',
    reflectionPrompt: '¿Cuántas veces al día te descubres viviendo en piloto automático?'
  },
  {
    day: 2,
    phase: 'Fase 1: Observación del Presente',
    title: 'Día 2: El Sonido como Espacio',
    focus: 'Audición consciente',
    task: 'Durante 5 minutos escucha los sonidos a tu alrededor sin intentar cambiarlos ni juzgarlos como ruido.',
    reflectionPrompt: '¿Pudiste escuchar los sonidos sin ponerles etiquetas de "bueno" o "malo"?'
  },
  {
    day: 3,
    phase: 'Fase 1: Observación del Presente',
    title: 'Día 3: El Presente sin Escapar',
    focus: 'Estar donde estás',
    task: 'Cuando sientas ganas de tomar el teléfono sin motivo en una pausa, detente 30 segundos y observa el impulso antes de actuar.',
    reflectionPrompt: '¿Qué sensación interna te impulsaba a buscar una distracción rápida?'
  },

  // DÍAS 4-6: Observación del cuerpo
  {
    day: 4,
    phase: 'Fase 2: Observación del Cuerpo',
    title: 'Día 4: Mapa de Tensión Muscular',
    focus: 'Propiocepción corporal',
    task: 'Escanea tres veces al día tu mandíbula, hombros y estómago. Suelta la contracción innecesaria.',
    reflectionPrompt: '¿En qué zona de tu cuerpo acumulas más tensión inconsciente durante el día?'
  },
  {
    day: 5,
    phase: 'Fase 2: Observación del Cuerpo',
    title: 'Día 5: La Cadencia Respiratoria',
    focus: 'Ritmo somático',
    task: 'Observa 10 respiraciones seguidas sintiendo el aire en el abdomen sin forzar el ritmo.',
    reflectionPrompt: '¿Cómo responde tu estado mental cuando le permites al cuerpo respirar a su propio ritmo?'
  },
  {
    day: 6,
    phase: 'Fase 2: Observación del Cuerpo',
    title: 'Día 6: El Contacto con el Suelo',
    focus: 'Enraizamiento al caminar',
    task: 'Camina durante 3 minutos prestando atención exclusiva al contacto de las plantas de los pies con el suelo.',
    reflectionPrompt: '¿Qué estabilidad te brinda sentir el soporte físico bajo tus pasos?'
  },

  // DÍAS 7-9: Observación del pensamiento
  {
    day: 7,
    phase: 'Fase 3: Observación del Pensamiento',
    title: 'Día 7: "Estoy observando el pensamiento de..."',
    focus: 'Metacognición y desfusión',
    task: 'Cada vez que notes un juicio o preocupación, reformúlalo mentalmente: "Observo que estoy pensando X".',
    reflectionPrompt: '¿Qué distancia se crea cuando no te identificas ciegamente con lo que piensas?'
  },
  {
    day: 8,
    phase: 'Fase 3: Observación del Pensamiento',
    title: 'Día 8: Cazador de Suposiciones',
    focus: 'Hechos vs Interpretaciones',
    task: 'Identifica al menos 2 situaciones donde supusiste la intención de otra persona y pregúntate: "¿Es un hecho o una interpretación?".',
    reflectionPrompt: '¿Qué interpretaciones automáticas sueles dar por ciertas sin pruebas?'
  },
  {
    day: 9,
    phase: 'Fase 3: Observación del Pensamiento',
    title: 'Día 9: El Río de los Pensamientos',
    focus: 'No retener ni empujar',
    task: 'Siéntate 5 minutos y visualiza tus pensamientos como hojas que flotan río abajo sin subirte a ninguna.',
    reflectionPrompt: '¿Pudiste dejar pasar un pensamiento sin engancharte en su historia?'
  },

  // DÍAS 10-12: Observación emocional
  {
    day: 10,
    phase: 'Fase 4: Observación Emocional',
    title: 'Día 10: La Emoción como Información',
    focus: 'Exaptación emocional',
    task: 'Cuando surja una emoción intensa, pregúntate con curiosidad: "¿Qué información relevante me está aportando?".',
    reflectionPrompt: '¿Qué necesidad o valor importante protegía esa emoción?'
  },
  {
    day: 11,
    phase: 'Fase 4: Observación Emocional',
    title: 'Día 11: Espacio entre Emoción y Reacción',
    focus: 'Pausa consciente',
    task: 'Ante una molestia o frustración, respira 3 veces antes de responder verbal o físicamente.',
    reflectionPrompt: '¿Qué diferencia hubo entre reaccionar de inmediato y responder tras la pausa?'
  },
  {
    day: 12,
    phase: 'Fase 4: Observación Emocional',
    title: 'Día 12: Aceptación Radical del Clima Interno',
    focus: 'No luchar contra el sentir',
    task: 'Permite que una emoción incómoda habite en tu cuerpo durante 2 minutos sin intentar cambiarla a la fuerza.',
    reflectionPrompt: '¿Qué sucede cuando dejas de pelear con lo que ya estás sintiendo?'
  },

  // DÍAS 13-15: Observación externa
  {
    day: 13,
    phase: 'Fase 5: Observación Externa',
    title: 'Día 13: La Riqueza Visual del Entorno',
    focus: 'Percepción visual abierta',
    task: 'Observa un objeto cotidiano (una planta, una taza, una ventana) durante 2 minutos como si fuera la primera vez que lo ves.',
    reflectionPrompt: '¿Qué detalles nuevos descubriste en algo que dabas por sentado?'
  },
  {
    day: 14,
    phase: 'Fase 5: Observación Externa',
    title: 'Día 14: Escuchar a los Demás con Presencia',
    focus: 'Escucha atenta no reactiva',
    task: 'En una conversación, escucha a la otra persona durante 2 minutos sin preparar tu respuesta mientras habla.',
    reflectionPrompt: '¿Cómo cambia la calidad del vínculo cuando escuchas con presencia total?'
  },
  {
    day: 15,
    phase: 'Fase 5: Observación Externa',
    title: 'Día 15: Conciencia Espacial Amplia',
    focus: 'Visión periférica y espacio',
    task: 'Durante una caminata o trayecto, abre tu visión periférica y nota la inmensidad del cielo o del espacio que te envuelve.',
    reflectionPrompt: '¿Cómo alivia el estrés ampliar el campo visual más allá de una pantalla estrecha?'
  },

  // DÍAS 16-18: Observación interna + externa
  {
    day: 16,
    phase: 'Fase 6: Simultaneidad Interna + Externa',
    title: 'Día 16: El Puente de Mediación',
    focus: 'Simultaneidad básica',
    task: 'Mientras estás sentado trabajando o descansando, mantén 50% de atención en tu respiración y 50% en el entorno.',
    reflectionPrompt: '¿Pudiste sostener ambos mundos en la misma conciencia?'
  },
  {
    day: 17,
    phase: 'Fase 6: Simultaneidad Interna + Externa',
    title: 'Día 17: Comer con Mediación Simultánea',
    focus: 'Alimentación consciente y entorno',
    task: 'Durante una comida, mastica notando el sabor y la textura MIENTRAS registras el ambiente a tu alrededor.',
    reflectionPrompt: '¿Cómo cambió el ritmo de tu comida al estar verdaderamente presente?'
  },
  {
    day: 18,
    phase: 'Fase 6: Simultaneidad Interna + Externa',
    title: 'Día 18: Mediación en Conversación',
    focus: 'Vínculo y autoobservación',
    task: 'Durante una charla importante, observa tu tono de voz y postura MIENTRAS miras con atención el rostro del otro.',
    reflectionPrompt: '¿Te ayudó la mediación a mantener la calma y la empatía?'
  },

  // DÍAS 19-20: Actividades cotidianas
  {
    day: 19,
    phase: 'Fase 7: Mediación en Acción Cotidiana',
    title: 'Día 19: Tareas Automáticas Transformadas',
    focus: 'Fregar, limpiar o ducharse',
    task: 'Convierte una tarea doméstica rutinaria en una práctica de mediación de 5 minutos.',
    reflectionPrompt: '¿Qué pasa con el aburrimiento cuando prestas atención real a la experiencia directa?'
  },
  {
    day: 20,
    phase: 'Fase 7: Mediación en Acción Cotidiana',
    title: 'Día 20: El Tiempo de Espera como Oportunidad',
    focus: 'Filas, semáforos y pausas',
    task: 'Usa cualquier momento de espera hoy como una práctica de mediación en lugar de mirar el teléfono de inmediato.',
    reflectionPrompt: '¿Cómo se transforma la impaciencia cuando conviertes la espera en presencia?'
  },

  // DÍA 21: Integración
  {
    day: 21,
    phase: 'Fase 8: Integración Final',
    title: 'Día 21: Mi Sistema de Mediación Consolidado',
    focus: 'Consagración de la práctica',
    task: 'Completa la práctica integral de 15 minutos y escribe tu decálogo de mediación para los próximos meses.',
    reflectionPrompt: '¿Quién eres ahora en relación con tu capacidad de observar antes de responder?'
  }
];

const STORAGE_KEY = 'conexionluz_map_reto_21_progress';

export default function MAPReto21Dias() {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [reflections, setReflections] = useState<Record<number, string>>({});
  const [selectedDay, setSelectedDay] = useState<number>(1);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompletedDays(parsed.completed || []);
        setReflections(parsed.reflections || {});
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const saveProgress = (newCompleted: number[], newReflections: Record<number, string>) => {
    setCompletedDays(newCompleted);
    setReflections(newReflections);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      completed: newCompleted,
      reflections: newReflections
    }));
  };

  const toggleDay = (day: number) => {
    let updated: number[];
    if (completedDays.includes(day)) {
      updated = completedDays.filter((d) => d !== day);
    } else {
      updated = [...completedDays, day];
    }
    saveProgress(updated, reflections);
  };

  const handleReflectionChange = (day: number, text: string) => {
    const updated = { ...reflections, [day]: text };
    saveProgress(completedDays, updated);
  };

  const resetReto = () => {
    if (window.confirm('¿Deseas reiniciar el progreso del Reto de 21 Días?')) {
      saveProgress([], {});
    }
  };

  const currentChallenge = CHALLENGES_21.find((c) => c.day === selectedDay) || CHALLENGES_21[0];
  const progressPercent = Math.round((completedDays.length / 21) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/20 border border-teal-400/30 text-teal-200 px-3.5 py-1 rounded-full flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-teal-300" />
            PROGRAMA DE CONSOLIDACIÓN
          </span>
          <button
            onClick={resetReto}
            className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-bold bg-white/10 hover:bg-white/20 px-3 py-1 rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" /> Reiniciar Reto
          </button>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Reto de 21 Días de Mediación
        </h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Un viaje progresivo de 3 semanas para anclar la observación consciente en tus hábitos diarios: desde el presente sensorial hasta la mediación simultánea en plena acción.
        </p>

        {/* Global Progress */}
        <div className="mt-6 bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-500/30 border border-teal-400/40 flex items-center justify-center text-teal-300 font-black">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-teal-200">Tu Progreso del Reto</span>
              <p className="text-sm font-bold text-white">{completedDays.length} de 21 días completados</p>
            </div>
          </div>
          <div className="flex items-center gap-3 min-w-[200px] flex-1 max-w-xs">
            <div className="flex-1 bg-black/30 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-black text-teal-300">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Grid of 21 Days + Active Day Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Days Matrix (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 px-2">
            Matriz de los 21 Días
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-7 lg:grid-cols-3 gap-2">
            {CHALLENGES_21.map((c) => {
              const isSelected = c.day === selectedDay;
              const isDone = completedDays.includes(c.day);
              return (
                <button
                  key={c.day}
                  onClick={() => setSelectedDay(c.day)}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                      : isDone
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">Día {c.day}</span>
                    {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 truncate mt-1">{c.focus}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Day Detail Card (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">
                  {currentChallenge.phase}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">{currentChallenge.title}</h3>
                <span className="text-xs font-bold text-slate-500">Foco: {currentChallenge.focus}</span>
              </div>

              <button
                onClick={() => toggleDay(currentChallenge.day)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  completedDays.includes(currentChallenge.day)
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{completedDays.includes(currentChallenge.day) ? 'Completado' : 'Marcar Día Completado'}</span>
              </button>
            </div>

            {/* Practical Task */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                📋 Práctica y Tarea del Día
              </h4>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                {currentChallenge.task}
              </p>
            </div>

            {/* Reflection Box */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-black text-indigo-900">
                <Brain className="h-4 w-4 text-indigo-600" />
                <span>Pregunta Reflexiva del Día:</span>
              </div>
              <p className="text-xs text-slate-700 italic font-medium">
                "{currentChallenge.reflectionPrompt}"
              </p>

              <label className="text-[11px] font-bold text-slate-700 block mt-2">
                Tu Respuesta y Registro Diario:
              </label>
              <textarea
                rows={3}
                placeholder="Escribe tu reflexión del día tras realizar la práctica..."
                value={reflections[currentChallenge.day] || ''}
                onChange={(e) => handleReflectionChange(currentChallenge.day, e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>

            {/* Navigation between days */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                disabled={selectedDay <= 1}
                onClick={() => setSelectedDay(selectedDay - 1)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold disabled:opacity-40"
              >
                ← Día Anterior
              </button>
              <button
                disabled={selectedDay >= 21}
                onClick={() => setSelectedDay(selectedDay + 1)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold disabled:opacity-40"
              >
                Día Siguiente →
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
