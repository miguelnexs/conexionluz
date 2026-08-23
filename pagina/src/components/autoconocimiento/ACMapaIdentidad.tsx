import React, { useState, useEffect } from 'react';
import { Sparkles, Save, CheckCircle2, Heart, User, Compass, Layers } from 'lucide-react';

type IdentityMap = {
  soy: string;
  interesa: string;
  valoro: string;
  facilita: string;
  aprendiendo: string;
  desarrollar: string;
  dejarAtras: string;
  explorar: string;
};

const DEFAULT_MAP: IdentityMap = {
  soy: "Una persona reflexiva, comprometida con mi crecimiento continuo y atenta a mi bienestar.",
  interesa: "La psicología, el aprendizaje, la creatividad y las relaciones humanas auténticas.",
  valoro: "La honestidad, la serenidad, la libertad, el respeto y la coherencia.",
  facilita: "Escuchar con empatía, organizar ideas complejas y perseverar ante los retos.",
  aprendiendo: "A poner límites con firmeza y amabilidad sin sentir culpa.",
  desarrollar: "Mayor confianza en mi intuición y una práctica diaria de autoobservación.",
  dejarAtras: "La autocrítica excesiva y la necesidad de complacer a todo el mundo.",
  explorar: "Nuevas disciplinas artísticas y espacios de silencio reflexivo."
};

export default function ACMapaIdentidad() {
  const [map, setMap] = useState<IdentityMap>(DEFAULT_MAP);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:ac_identity_map');
    if (local) {
      try {
        setMap(JSON.parse(local));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleChange = (field: keyof IdentityMap, value: string) => {
    setMap(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('conexionluz:ac_identity_map', JSON.stringify(map));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            🪞 HERRAMIENTA CLAVE
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Mi Mapa de Identidad Personal</h2>
        <p className="text-indigo-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Construye una radiografía consciente de quién eres, qué te nutre, qué estás aprendiendo y qué deseas transformar, sin encasillarte en etiquetas rígidas.
        </p>
      </div>

      {/* Grid of 8 Identity Pillars */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Soy */}
          <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-2">
            <label className="block text-xs font-black text-indigo-950 uppercase tracking-wider">
              1. Soy... (Cualidades nucleares y esencia)
            </label>
            <textarea
              rows={2}
              value={map.soy}
              onChange={(e) => handleChange('soy', e.target.value)}
              placeholder="¿Cómo te describes en esencia?"
              className="w-full bg-white border border-indigo-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Me Interesa */}
          <div className="p-5 bg-purple-50/50 border border-purple-100 rounded-2xl space-y-2">
            <label className="block text-xs font-black text-purple-950 uppercase tracking-wider">
              2. Me interesa... (Curiosidades y pasiones)
            </label>
            <textarea
              rows={2}
              value={map.interesa}
              onChange={(e) => handleChange('interesa', e.target.value)}
              placeholder="¿Qué temas o actividades despiertan tu curiosidad?"
              className="w-full bg-white border border-purple-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          {/* Valoro */}
          <div className="p-5 bg-teal-50/50 border border-teal-100 rounded-2xl space-y-2">
            <label className="block text-xs font-black text-teal-950 uppercase tracking-wider">
              3. Valoro... (Principios innegociables)
            </label>
            <textarea
              rows={2}
              value={map.valoro}
              onChange={(e) => handleChange('valoro', e.target.value)}
              placeholder="¿Qué cualidades o actitudes consideras fundamentales?"
              className="w-full bg-white border border-teal-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Se me Facilita */}
          <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-2">
            <label className="block text-xs font-black text-blue-950 uppercase tracking-wider">
              4. Se me facilita... (Talentos y fortalezas naturales)
            </label>
            <textarea
              rows={2}
              value={map.facilita}
              onChange={(e) => handleChange('facilita', e.target.value)}
              placeholder="¿Qué habilidades fluyen en ti con naturalidad?"
              className="w-full bg-white border border-blue-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Estoy Aprendiendo */}
          <div className="p-5 bg-amber-50/50 border border-amber-100 rounded-2xl space-y-2">
            <label className="block text-xs font-black text-amber-950 uppercase tracking-wider">
              5. Estoy aprendiendo... (Áreas en desarrollo actual)
            </label>
            <textarea
              rows={2}
              value={map.aprendiendo}
              onChange={(e) => handleChange('aprendiendo', e.target.value)}
              placeholder="¿Qué habilidades o actitudes estás integrando ahora?"
              className="w-full bg-white border border-amber-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Quiero Desarrollar */}
          <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2">
            <label className="block text-xs font-black text-emerald-950 uppercase tracking-wider">
              6. Quiero desarrollar... (Aspiraciones a mediano plazo)
            </label>
            <textarea
              rows={2}
              value={map.desarrollar}
              onChange={(e) => handleChange('desarrollar', e.target.value)}
              placeholder="¿Qué competencia personal deseas cultivar?"
              className="w-full bg-white border border-emerald-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Quiero Dejar Atrás */}
          <div className="p-5 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-2">
            <label className="block text-xs font-black text-rose-950 uppercase tracking-wider">
              7. Quiero dejar atrás... (Hábitos o mandatos obsoletos)
            </label>
            <textarea
              rows={2}
              value={map.dejarAtras}
              onChange={(e) => handleChange('dejarAtras', e.target.value)}
              placeholder="¿Qué conductas o juicios ya no te son útiles?"
              className="w-full bg-white border border-rose-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          {/* Quiero Explorar */}
          <div className="p-5 bg-cyan-50/50 border border-cyan-100 rounded-2xl space-y-2">
            <label className="block text-xs font-black text-cyan-950 uppercase tracking-wider">
              8. Quiero explorar... (Nuevas vivencias y horizontes)
            </label>
            <textarea
              rows={2}
              value={map.explorar}
              onChange={(e) => handleChange('explorar', e.target.value)}
              placeholder="¿Qué experiencias novedosas quieres probar?"
              className="w-full bg-white border border-cyan-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          {savedSuccess ? (
            <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ¡Mapa de Identidad guardado con éxito!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Puedes actualizar este mapa tantas veces como evolucione tu autoconocimiento.</span>
          )}

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" /> Guardar Mi Mapa de Identidad
          </button>
        </div>
      </div>
    </div>
  );
}
