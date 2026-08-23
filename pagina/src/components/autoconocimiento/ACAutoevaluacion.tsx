import React, { useState, useEffect } from 'react';
import { Sliders, Sparkles, CheckCircle2, Save, BarChart2, Compass, ShieldCheck } from 'lucide-react';

type AreaScore = {
  id: string;
  name: string;
  desc: string;
  score: number; // 1 to 5
};

const INITIAL_AREAS: AreaScore[] = [
  { id: "identidad", name: "1. Claridad de Identidad", desc: "Tengo consciencia de quién soy más allá de los roles y expectativas externas.", score: 3 },
  { id: "valores", name: "2. Coherencia con Valores", desc: "Mis decisiones cotidianas están alineadas con lo que considero verdaderamente importante.", score: 3 },
  { id: "emociones", name: "3. Conciencia Emocional", desc: "Reconozco con facilidad las señales somáticas de mis emociones sin reprimirlas.", score: 3 },
  { id: "pensamientos", name: "4. Observación de Pensamientos", desc: "Distingo entre hechos reales y suposiciones o diálogos internos automáticos.", score: 3 },
  { id: "fortalezas", name: "5. Reconocimiento de Fortalezas", desc: "Confío en mis recursos personales y sé apoyarme en ellos ante dificultades.", score: 3 },
  { id: "relaciones", name: "6. Salud Vincular y Límites", desc: "Establezco límites claros y cuido la reciprocidad en mis relaciones cercanas.", score: 3 },
  { id: "habitos", name: "7. Gestión de Hábitos", desc: "Detecto mis patrones automáticos y elijo respuestas alternativas saludables.", score: 3 },
  { id: "proposito", name: "8. Sentido de Dirección", desc: "Tengo claridad sobre los objetivos y el crecimiento que deseo cultivar.", score: 3 }
];

export default function ACAutoevaluacion() {
  const [areas, setAreas] = useState<AreaScore[]>(INITIAL_AREAS);
  const [reflection, setReflection] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:ac_self_assessment');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed.areas) setAreas(parsed.areas);
        if (parsed.reflection) setReflection(parsed.reflection);
      } catch (e) {}
    }
  }, []);

  const handleScoreChange = (id: string, newScore: number) => {
    setAreas(prev => prev.map(a => a.id === id ? { ...a, score: newScore } : a));
  };

  const handleSave = () => {
    const payload = {
      areas,
      reflection,
      updatedAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    localStorage.setItem('conexionluz:ac_self_assessment', JSON.stringify(payload));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const averageScore = (areas.reduce((acc, curr) => acc + curr.score, 0) / areas.length).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            📊 AUTOEVALUACIÓN FORMATIVA
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Mapa de Reflexión Personal</h2>
        <p className="text-indigo-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Evalúa tus 8 dimensiones de autoconocimiento para contrastar tu punto de partida con tus avances al finalizar el programa.
        </p>
      </div>

      {/* Grid */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Sliders className="h-4 w-4 text-indigo-600" /> Dimensiones de Autocomprensión (Escala 1 a 5)
          </h3>
          <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full">
            Promedio Actual: {averageScore} / 5.0
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {areas.map((a) => (
            <div key={a.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-900">{a.name}</h4>
                <span className="text-xs font-black text-indigo-700">Nivel {a.score} / 5</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{a.desc}</p>

              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleScoreChange(a.id, lvl)}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      a.score === lvl
                        ? 'bg-indigo-600 text-white shadow-xs'
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
            Reflexión Personal: ¿Qué área de tu vida deseas observar con mayor profundidad?
          </label>
          <textarea
            rows={3}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="ej: Deseo prestar más atención a mis límites en el trabajo y a no descuidar mis valores de descanso y familia..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          {savedSuccess ? (
            <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ¡Autoevaluación guardada!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Este ejercicio es formativo y no constituye una evaluación clínica.</span>
          )}

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" /> Guardar Mapa de Reflexión
          </button>
        </div>
      </div>
    </div>
  );
}
