import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, CheckCircle2, Save, ArrowRight, Layers, Sliders } from 'lucide-react';

const AVAILABLE_VALUES = [
  { id: "familia", name: "Familia y Afecto", desc: "Cuidado, cercanía y presencia con seres queridos." },
  { id: "aprendizaje", name: "Aprendizaje Continuo", desc: "Curiosidad intelectual y adquisición constante de conocimiento." },
  { id: "libertad", name: "Libertad y Autonomía", desc: "Capacidad de elegir con independencia de criterio." },
  { id: "creatividad", name: "Creatividad y Expresión", desc: "Innovación, arte y exploración de nuevas ideas." },
  { id: "bienestar", name: "Bienestar y Salud", desc: "Cuidado integral del cuerpo, descanso y nutrición." },
  { id: "responsabilidad", name: "Responsabilidad y Compromiso", desc: "Cumplimiento ético de la palabra dada." },
  { id: "crecimiento", name: "Crecimiento Personal", desc: "Superación constante y madurez emocional." },
  { id: "servicio", name: "Servicio y Contribución", desc: "Aportar valor y ayudar a la comunidad." },
  { id: "seguridad", name: "Seguridad y Estabilidad", desc: "Tranquilidad financiera, orden y certidumbre." },
  { id: "relaciones", name: "Amistad y Conexión", desc: "Vínculos sinceros, empatía y nutrición relacional." },
  { id: "honestidad", name: "Honestidad e Integridad", desc: "Coherencia entre pensamiento, palabra y acción." },
  { id: "paz", name: "Paz y Serenidad", desc: "Calma interior, reducción del conflicto y templanza." }
];

export default function DPBrujulaValores() {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [coherenceRatings, setCoherenceRatings] = useState<Record<string, number>>({});
  const [reflection, setReflection] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:dp_values_compass');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        setSelectedValues(parsed.selectedValues || []);
        setCoherenceRatings(parsed.coherenceRatings || {});
        setReflection(parsed.reflection || '');
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleValue = (id: string) => {
    if (selectedValues.includes(id)) {
      setSelectedValues(selectedValues.filter(v => v !== id));
    } else {
      if (selectedValues.length < 5) {
        setSelectedValues([...selectedValues, id]);
        if (coherenceRatings[id] === undefined) {
          setCoherenceRatings(prev => ({ ...prev, [id]: 70 }));
        }
      }
    }
  };

  const handleRatingChange = (id: string, val: number) => {
    setCoherenceRatings(prev => ({ ...prev, [id]: val }));
  };

  const handleSave = () => {
    const payload = {
      selectedValues,
      coherenceRatings,
      reflection,
      updatedAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    localStorage.setItem('conexionluz:dp_values_compass', JSON.stringify(payload));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Compass className="h-3 w-3" /> BRÚJULA DE VALORES
          </span>
          <span className="text-xs text-emerald-300 font-bold">
            {selectedValues.length} de 5 Valores Seleccionados
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Mi Brújula de Valores y Coherencia</h2>
        <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Selecciona tus 5 valores rectores más significativos y evalúa qué tan coherente es tu vida cotidiana actual con cada uno de ellos.
        </p>
      </div>

      {/* Value Selector Grid */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
          1. Elige hasta 5 valores prioritarios para tu vida:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {AVAILABLE_VALUES.map((val) => {
            const isSelected = selectedValues.includes(val.id);
            const rank = selectedValues.indexOf(val.id) + 1;
            return (
              <button
                key={val.id}
                onClick={() => toggleValue(val.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
                    : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/80 text-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black">{val.name}</span>
                    {isSelected && (
                      <span className="h-5 w-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">
                        #{rank}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{val.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Coherence Sliders Card */}
      {selectedValues.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            2. Nivel de Coherencia Actual (0% a 100%)
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            ¿En qué medida tus acciones, tiempo y energía reales de esta semana están alineados con cada valor?
          </p>

          <div className="space-y-4">
            {selectedValues.map((valId) => {
              const valObj = AVAILABLE_VALUES.find(v => v.id === valId);
              const rating = coherenceRatings[valId] ?? 70;
              return (
                <div key={valId} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                    <span>{valObj?.name}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                      rating >= 75 ? 'bg-emerald-100 text-emerald-900' :
                      rating >= 50 ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'
                    }`}>
                      {rating}% de Coherencia
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={rating}
                    onChange={(e) => handleRatingChange(valId, Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              );
            })}
          </div>

          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-slate-800">
              Reflexión: ¿Qué pequeño ajuste de conducta te acercaría más a tus valores prioritarios?
            </label>
            <textarea
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="ej: Deseo dedicar 30 minutos sin pantallas a la cena con mi familia y respetar mi horario de descanso..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> ¡Brújula de Valores guardada!
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">Revisa tu brújula periódicamente para calibrar tu rumbo.</span>
            )}

            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Save className="h-4 w-4" /> Guardar Brújula
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
