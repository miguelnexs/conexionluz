import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  Brain, 
  Compass, 
  Activity, 
  Radio, 
  ChevronRight, 
  Layers, 
  HelpCircle,
  Volume2
} from 'lucide-react';

interface Experimento {
  id: number;
  titulo: string;
  subtitulo: string;
  icono: string;
  categoria: 'Básico' | 'Dual' | 'Multidimensional' | 'Metaconsciente';
  duracionSugerida: string;
  proposito: string;
  guiaPasoAPaso: string[];
  preguntaReflexion: string;
}

const EXPERIMENTOS: Experimento[] = [
  {
    id: 1,
    titulo: 'Experimento 1: Observar un Pensamiento',
    subtitulo: 'Distanciamiento cognitivo elemental',
    icono: '💭',
    categoria: 'Básico',
    duracionSugerida: '2 minutos',
    proposito: 'Reconocer que el pensamiento es un evento que ocurre en la mente y no una orden que deba seguirse de inmediato.',
    guiaPasoAPaso: [
      'Siéntate con calma y espera a que surja el próximo pensamiento voluntario o espontáneo.',
      'En cuanto aparezca una frase, imagen o recuerdo, di mentalmente: "Observo que estoy pensando en X".',
      'Nota si puedes contemplar ese pensamiento sin empujarlo ni retenerlo, como un tren que pasa por la estación.'
    ],
    preguntaReflexion: '¿Pudiste notar la diferencia entre "estar pensando" y "darte cuenta de que estás pensando"?'
  },
  {
    id: 2,
    titulo: 'Experimento 2: Observar una Emoción',
    subtitulo: 'Aceptación y no reactividad afectiva',
    icono: '❤️',
    categoria: 'Básico',
    duracionSugerida: '3 minutos',
    proposito: 'Explorar la emoción como una onda fisiológica e informativa sin intentar suprimirla ni reaccionar impulsivamente.',
    guiaPasoAPaso: [
      'Identifica el clima emocional presente (serenidad, inquietud, cansancio, curiosidad).',
      'Nombra la emoción con una palabra precisa y permítele estar en tu cuerpo durante 60 segundos.',
      'Pregúntate: "¿Qué mensaje o necesidad me está señalando esta emoción?".'
    ],
    preguntaReflexion: '¿Qué ocurre con la intensidad de la emoción cuando dejas de pelear con ella y simplemente la observas?'
  },
  {
    id: 3,
    titulo: 'Experimento 3: Observar una Sensación Corporal',
    subtitulo: 'Interocepción y propiocepción en el presente',
    icono: '🧘',
    categoria: 'Básico',
    duracionSugerida: '2 minutos',
    proposito: 'Anclar la mente en las sensaciones físicas reales, que solo pueden existir en el tiempo presente.',
    guiaPasoAPaso: [
      'Lleva tu atención exclusivamente a las plantas de los pies o al punto de contacto de tus manos.',
      'Nota el hormigueo, la temperatura y la presión sin moverte.',
      'Si tu mente se distrae con juicios ("esto pica", "es incómodo"), reconócelo y regresa a la sensación pura.'
    ],
    preguntaReflexion: '¿Cómo cambia tu nivel de agitación mental cuando la atención se apoya firmemente en el cuerpo?'
  },
  {
    id: 4,
    titulo: 'Experimento 4: Observar un Sonido',
    subtitulo: 'Recepción auditiva sin etiquetas',
    icono: '🔊',
    categoria: 'Básico',
    duracionSugerida: '2 minutos',
    proposito: 'Desactivar la tendencia a clasificar los estímulos externos como agradables o molestos.',
    guiaPasoAPaso: [
      'Cierra o relaja los ojos y escucha el sonido más lejano que puedas percibir.',
      'Luego escucha el sonido más cercano (incluso tu respiración o un zumbido sutil).',
      'Despréndete de la etiqueta conceptual ("es un carro", "es una puerta") y escucha solo la vibración sonora.'
    ],
    preguntaReflexion: '¿Puedes permitir que el sonido aparezca y desaparezca en el espacio sin oponer resistencia?'
  },
  {
    id: 5,
    titulo: 'Experimento 5: Observar Pensamiento + Entorno',
    subtitulo: 'Primer puente de simultaneidad',
    icono: '🌉',
    categoria: 'Dual',
    duracionSugerida: '3 minutos',
    proposito: 'Sostener en un mismo campo de conciencia el mundo mental interno y la percepción del espacio físico.',
    guiaPasoAPaso: [
      'Mantén los ojos abiertos mirando el espacio frente a ti (pared, ventana o mesa).',
      'Al mismo tiempo, mantén un canal abierto hacia tu diálogo interno.',
      'Comprueba que puedes ver el entorno MIENTRAS notas lo que piensas, sin que uno anule al otro.'
    ],
    preguntaReflexion: '¿Qué se siente no quedar hipnotizado por la mente mientras sigues conectado con el mundo?'
  },
  {
    id: 6,
    titulo: 'Experimento 6: Observar Emoción + Entorno',
    subtitulo: 'Integración afectiva y ambiental',
    icono: '🌱',
    categoria: 'Dual',
    duracionSugerida: '3 minutos',
    proposito: 'Aprender a estar en el entorno con la emoción que tengamos sin proyectarla distorsionadamente sobre el ambiente.',
    guiaPasoAPaso: [
      'Siente la emoción que esté presente en tu pecho o estómago.',
      'A la vez, mira a tu alrededor y escucha los sonidos del lugar.',
      'Reconoce: "Tengo esta emoción adentro Y el mundo afuera sigue su curso armónico".'
    ],
    preguntaReflexion: '¿Te ayuda esta doble observación a no exagerar la emoción como si fuera la totalidad del universo?'
  },
  {
    id: 7,
    titulo: 'Experimento 7: Pensamiento + Emoción + Cuerpo',
    subtitulo: 'Tríada de la realidad interna integrada',
    icono: '🧬',
    categoria: 'Multidimensional',
    duracionSugerida: '4 minutos',
    proposito: 'Mapear la interconexión directa entre cognición, afecto y fisiología somática.',
    guiaPasoAPaso: [
      'Nota un pensamiento presente.',
      'Rastrea qué emoción despierta ese pensamiento en ti.',
      'Localiza en qué parte exacta del cuerpo se refleja esa emoción (tensión, calor, opresión).',
      'Observa los tres elementos simultáneamente como un sistema dinámico interconectado.'
    ],
    preguntaReflexion: '¿Cómo influyen tus pensamientos en la postura de tu cuerpo y en tu respiración?'
  },
  {
    id: 8,
    titulo: 'Experimento 8: Pensamiento + Emoción + Cuerpo + Entorno',
    subtitulo: 'La Mediación Plena 360°',
    icono: '🌐',
    categoria: 'Multidimensional',
    duracionSugerida: '5 minutos',
    proposito: 'Entrenamiento de la arquitectura completa del curso: observación holística en el presente.',
    guiaPasoAPaso: [
      '1. Siente la base de tu cuerpo y respiración (Cuerpo).',
      '2. Reconoce el tono afectivo de este instante (Emoción).',
      '3. Nota el flujo de ideas sin aferrarte (Pensamiento).',
      '4. Percibe el espacio, la luz y los sonidos que te envuelven (Entorno).',
      'Permanece durante 2 minutos contemplando este campo unificado de existencia.'
    ],
    preguntaReflexion: '¿Puedes notar que toda esta experiencia diversa está ocurriendo dentro del mismo presente exacto?'
  },
  {
    id: 9,
    titulo: 'Experimento 9: Observar la Atención',
    subtitulo: 'Metacognición pura sobre el foco atencional',
    icono: '🔦',
    categoria: 'Metaconsciente',
    duracionSugerida: '3 minutos',
    proposito: 'Descubrir que la atención es un haz móvil que puedes dirigir voluntariamente.',
    guiaPasoAPaso: [
      'Mueve tu atención a tu mano derecha.',
      'Ahora muévela a un sonido lejano.',
      'Ahora a tu respiración.',
      'Ahora al pensamiento más reciente.',
      'Observa el "músculo" atencional que ejecuta ese movimiento: ¿Quién está dirigiendo la linterna?'
    ],
    preguntaReflexion: '¿Qué poder te otorga saber que tú puedes elegir dónde posar tu linterna atencional?'
  },
  {
    id: 10,
    titulo: 'Experimento 10: Observar al Observador',
    subtitulo: 'La cumbre de la Metaconciencia',
    icono: '👁️',
    categoria: 'Metaconsciente',
    duracionSugerida: '4 minutos',
    proposito: 'Reconocer el espacio de conciencia silencioso y lúcido que presencia todos los fenómenos.',
    guiaPasoAPaso: [
      'Nota todo lo que puedes percibir: objetos, sonidos, pensamientos, sensaciones.',
      'Pregúntate en silencio: "¿Quién o qué está dándose cuenta de todo esto?".',
      'No busques una respuesta lógica en palabras. Simplemente descansa en la certeza de estar despierto y consciente.'
    ],
    preguntaReflexion: '¿Qué cualidad tiene el observador? ¿Es sereno, amplio, inmutable ante los cambios?'
  }
];

const STORAGE_KEY = 'conexionluz_map_lab_notes';

export default function MAPLaboratorio() {
  const [selectedExpId, setSelectedExpId] = useState<number>(1);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [completedExps, setCompletedExps] = useState<number[]>([]);
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const activeExp = EXPERIMENTOS.find((e) => e.id === selectedExpId) || EXPERIMENTOS[0];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotes(parsed.notes || {});
        setCompletedExps(parsed.completed || []);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    setIsTimerRunning(false);
    setTimerSeconds(180);
  }, [selectedExpId]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleNoteChange = (text: string) => {
    const updated = { ...notes, [selectedExpId]: text };
    setNotes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ notes: updated, completed: completedExps }));
  };

  const toggleCompleted = (id: number) => {
    let updated: number[];
    if (completedExps.includes(id)) {
      updated = completedExps.filter((x) => x !== id);
    } else {
      updated = [...completedExps, id];
    }
    setCompletedExps(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ notes, completed: updated }));
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/20 border border-teal-400/30 text-teal-200 px-3.5 py-1 rounded-full flex items-center gap-1.5">
            <FlaskConical className="h-3.5 w-3.5 text-teal-300" />
            INVESTIGACIÓN VIVENCIAL
          </span>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-200 bg-white/10 px-3 py-1 rounded-xl">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{completedExps.length} de 10 experimentos realizados</span>
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Laboratorio de Metaconciencia
        </h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          10 experimentos prácticos y secuenciales para explorar de primera mano la mecánica de tu mente, tus emociones, tus sentidos y el observador consciente.
        </p>
      </div>

      {/* Main Grid: Experiments Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Experiments List Menu (4 Cols) */}
        <div className="lg:col-span-5 space-y-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 px-2">
            Catálogo de Experimentos
          </h3>
          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {EXPERIMENTOS.map((exp) => {
              const isSelected = exp.id === selectedExpId;
              const isDone = completedExps.includes(exp.id);
              return (
                <button
                  key={exp.id}
                  onClick={() => setSelectedExpId(exp.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                      : 'bg-white/80 hover:bg-white border-slate-200/80 text-slate-700'
                  }`}
                >
                  <span className="text-xl shrink-0 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    {exp.icono}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-teal-700">
                        Exp {exp.id} · {exp.categoria}
                      </span>
                      {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                    </div>
                    <h4 className="text-xs font-black text-slate-900 truncate mt-0.5">
                      {exp.titulo.replace(`Experimento ${exp.id}: `, '')}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">{exp.subtitulo}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Experiment Stage (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Header of Active Experiment */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{activeExp.icono}</span>
                  <span className="text-xs font-black uppercase text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-full">
                    {activeExp.categoria} · {activeExp.duracionSugerida}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1">{activeExp.titulo}</h3>
                <p className="text-xs font-bold text-slate-500">{activeExp.subtitulo}</p>
              </div>

              <button
                onClick={() => toggleCompleted(activeExp.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  completedExps.includes(activeExp.id)
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{completedExps.includes(activeExp.id) ? 'Realizado' : 'Marcar Realizado'}</span>
              </button>
            </div>

            {/* Purpose Box */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 space-y-1">
              <h4 className="text-[10px] font-black uppercase text-teal-900 tracking-wider flex items-center gap-1.5">
                🎯 Propósito del Experimento
              </h4>
              <p className="text-xs text-teal-950 font-medium leading-relaxed">
                {activeExp.proposito}
              </p>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-700">
                Protocolo de Exploración
              </h4>
              <div className="space-y-2.5">
                {activeExp.guiaPasoAPaso.map((step, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                    <span className="h-5 w-5 rounded-full bg-teal-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timer Auxiliary for Experimentation */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase text-teal-300 tracking-wider block">
                  Cronómetro del Experimento
                </span>
                <span className="text-2xl font-black font-mono tracking-tight text-white">
                  {formatTime(timerSeconds)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    isTimerRunning ? 'bg-amber-500 text-slate-950' : 'bg-teal-500 text-slate-950 hover:bg-teal-400'
                  }`}
                >
                  {isTimerRunning ? 'Pausar' : 'Iniciar Tiempo'}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(180);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  title="Reiniciar"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Reflection and Notes Box */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-black text-indigo-900">
                <Brain className="h-4 w-4 text-indigo-600" />
                <span>Pregunta de Reflexión:</span>
              </div>
              <p className="text-xs text-slate-700 italic font-medium">
                "{activeExp.preguntaReflexion}"
              </p>

              <label className="text-[11px] font-bold text-slate-700 block mt-3">
                Bitácora de Descubrimientos (Guardado automático):
              </label>
              <textarea
                rows={3}
                placeholder="Escribe lo que notaste durante este experimento (sensaciones, sorpresas, resistencia mental, claridad)..."
                value={notes[activeExp.id] || ''}
                onChange={(e) => handleNoteChange(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
