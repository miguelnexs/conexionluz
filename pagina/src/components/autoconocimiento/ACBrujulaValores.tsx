import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, CheckCircle2, Save, Star, Heart } from 'lucide-react';

const ALL_VALUES = [
  { id: "libertad", name: "Libertad", desc: "Autonomía para decidir y expresar mi verdad." },
  { id: "familia", name: "Familia", desc: "Cuidado, lealtad y presencia con mis seres queridos." },
  { id: "conocimiento", name: "Conocimiento", desc: "Curiosidad, estudio y comprensión profunda." },
  { id: "seguridad", name: "Seguridad", desc: "Estabilidad, previsión y tranquilidad." },
  { id: "creatividad", name: "Creatividad", desc: "Innovación, arte y nuevas formas de expresión." },
  { id: "respeto", name: "Respeto", desc: "Dignidad, consideración mutua y límites claros." },
  { id: "honestidad", name: "Honestidad", desc: "Transparencia, verdad y coherencia interior." },
  { id: "crecimiento", name: "Crecimiento", desc: "Evolución continua y superación consciente." },
  { id: "solidaridad", name: "Solidaridad", desc: "Apoyo desinteresado y empatía con otros." },
  { id: "autonomia", name: "Autonomía", desc: "Independencia de criterio y autosuficiencia." },
  { id: "estabilidad", name: "Estabilidad", desc: "Paz mental, orden y equilibrio vital." },
  { id: "aventura", name: "Aventura", desc: "Exploración de nuevos horizontes y dinamismo." },
  { id: "responsabilidad", name: "Responsabilidad", desc: "Compromiso ético con mis actos y palabras." },
  { id: "conexion", name: "Conexión", desc: "Vínculos afectivos profundos y significativos." },
  { id: "aprendizaje", name: "Aprendizaje", desc: "Mentalidad abierta y asimilación de lecciones." }
];

export default function ACBrujulaValores() {
  const [selectedValues, setSelectedValues] = useState<string[]>(["honestidad", "crecimiento", "respeto", "libertad", "conexion"]);
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const localVals = localStorage.getItem('conexionluz:ac_selected_values');
    const localRefs = localStorage.getItem('conexionluz:ac_value_reflections');
    if (localVals) {
      try { setSelectedValues(JSON.parse(localVals)); } catch (e) {}
    }
    if (localRefs) {
      try { setReflections(JSON.parse(localRefs)); } catch (e) {}
    }
  }, []);

  const toggleValue = (id: string) => {
    if (selectedValues.includes(id)) {
      setSelectedValues(prev => prev.filter(v => v !== id));
    } else {
      if (selectedValues.length < 5) {
        setSelectedValues(prev => [...prev, id]);
      } else {
        alert("Selecciona un máximo de 5 valores principales para mantener el foco.");
      }
    }
  };

  const handleReflectionChange = (id: string, text: string) => {
    setReflections(prev => ({ ...prev, [id]: text }));
  };

  const handleSave = () => {
    localStorage.setItem('conexionluz:ac_selected_values', JSON.stringify(selectedValues));
    localStorage.setItem('conexionluz:ac_value_reflections', JSON.stringify(reflections));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            🧭 HERRAMIENTA CLAVE
          </span>
          <span className="text-xs text-indigo-300 font-bold">
            {selectedValues.length} de 5 Seleccionados
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Brújula de Valores Rectores</h2>
        <p className="text-indigo-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Selecciona y prioriza tus 5 valores fundamentales para alinear tus decisiones cotidianas con lo que es verdaderamente prioritario para ti.
        </p>
      </div>

      {/* Values Selection Grid */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Compass className="h-4 w-4 text-indigo-600" /> Catálogo de Valores (Elige hasta 5)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {ALL_VALUES.map((val) => {
            const isSelected = selectedValues.includes(val.id);
            return (
              <button
                key={val.id}
                onClick={() => toggleValue(val.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black">{val.name}</span>
                  {isSelected && <Star className="h-3.5 w-3.5 text-yellow-300 fill-yellow-300" />}
                </div>
                <p className={`text-[10px] leading-tight font-medium ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {val.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Values Reflections */}
        {selectedValues.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-black uppercase text-indigo-950 tracking-wider">
              Mis 5 Valores Principales y Coherencia Práctica:
            </h4>

            <div className="space-y-3">
              {selectedValues.map((valId) => {
                const valObj = ALL_VALUES.find(v => v.id === valId);
                if (!valObj) return null;
                return (
                  <div key={valId} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 text-indigo-600" /> {valObj.name}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">{valObj.desc}</span>
                    </div>

                    <textarea
                      rows={2}
                      value={reflections[valId] || ''}
                      onChange={(e) => handleReflectionChange(valId, e.target.value)}
                      placeholder={`¿Cómo expresas actualmente el valor de ${valObj.name} en tus decisiones o relaciones?`}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          {savedSuccess ? (
            <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ¡Brújula de valores guardada!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Tus valores son tu guía interior para evaluar dilemas vitales.</span>
          )}

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" /> Guardar Mi Brújula
          </button>
        </div>
      </div>
    </div>
  );
}
