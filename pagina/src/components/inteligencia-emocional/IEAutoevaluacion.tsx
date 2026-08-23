import React, { useState, useEffect } from 'react';
import { Sliders, Sparkles, CheckCircle2, Save, Compass, BarChart2, ShieldCheck, Heart } from 'lucide-react';

type DimensionScore = {
  dimension: string;
  name: string;
  desc: string;
  score: number; // 1 to 5
};

const INITIAL_DIMENSIONS: DimensionScore[] = [
  { dimension: "autoconocimiento", name: "1. Autoconocimiento Afectivo", desc: "Reconozco con facilidad lo que siento en el cuerpo y distingo matices en mis emociones.", score: 3 },
  { dimension: "autorregulacion", name: "2. Autorregulación y Pausa", desc: "Hago pausas conscientes antes de reaccionar impulsivamente ante momentos de tensión.", score: 3 },
  { dimension: "empatia", name: "3. Empatía y Validación", desc: "Escucho con curiosidad y respeto a los demás sin precipitarme a juzgar ni dar consejos no solicitados.", score: 4 },
  { dimension: "asertividad", name: "4. Asertividad y Límites", desc: "Expreso mis necesidades y límites con claridad y firmeza sin agredir ni callarme por complacer.", score: 3 },
  { dimension: "conflictos", name: "5. Resolución de Desacuerdos", desc: "Afronto los conflictos buscando acuerdos constructivos en lugar de cerrarme o atacar.", score: 3 }
];

export default function IEAutoevaluacion() {
  const [dimensions, setDimensions] = useState<DimensionScore[]>(INITIAL_DIMENSIONS);
  const [reflection, setReflection] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:ie_self_assessment');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed.dimensions) setDimensions(parsed.dimensions);
        if (parsed.reflection) setReflection(parsed.reflection);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleScoreChange = (dim: string, newScore: number) => {
    setDimensions(prev => prev.map(d => d.dimension === dim ? { ...d, score: newScore } : d));
  };

  const handleSave = () => {
    const payload = {
      dimensions,
      reflection,
      updatedAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    localStorage.setItem('conexionluz:ie_self_assessment', JSON.stringify(payload));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const averageScore = (dimensions.reduce((acc, curr) => acc + curr.score, 0) / dimensions.length).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/30 border border-teal-400/40 text-teal-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            📊 AUTOEVALUACIÓN FORMATIVA
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Mapa de Competencias Emocionales</h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Evalúa tus competencias afectivas actuales para identificar fortalezas y definir áreas prioritarias de práctica consciente.
        </p>
      </div>

      {/* Evaluation Sliders Grid */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Sliders className="h-4 w-4 text-teal-600" /> 5 Dimensiones Clave (Escala 1 a 5)
          </h3>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full">
            Promedio Actual: {averageScore} / 5.0
          </span>
        </div>

        <div className="space-y-5">
          {dimensions.map((dim) => (
            <div key={dim.dimension} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h4 className="text-xs font-black text-slate-900">{dim.name}</h4>
                  <p className="text-[11px] text-slate-600 font-medium">{dim.desc}</p>
                </div>
                <span className="text-xs font-black text-teal-700 self-end sm:self-center">
                  Nivel {dim.score} de 5
                </span>
              </div>

              {/* Slider / Button scale */}
              <div className="flex items-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleScoreChange(dim.dimension, lvl)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      dim.score === lvl
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Reflection */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold text-slate-800">
            Reflexión Personal: ¿En qué dimensión deseas enfocar tu práctica durante este curso?
          </label>
          <textarea
            rows={3}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="ej: Deseo entrenar la pausa consciente en mis conversaciones laborales y no asumir lo que otros sienten..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          {savedSuccess ? (
            <span className="text-xs font-bold text-teal-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ¡Autoevaluación guardada!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Este ejercicio es puramente educativo y no constituye un diagnóstico clínico.</span>
          )}

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" /> Guardar Mapa de Desarrollo
          </button>
        </div>
      </div>
    </div>
  );
}
