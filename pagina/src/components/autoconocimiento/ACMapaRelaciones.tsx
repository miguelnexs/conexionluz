import React, { useState, useEffect } from 'react';
import { Users, Heart, ShieldCheck, Sparkles, Save, CheckCircle2 } from 'lucide-react';

type RelationshipArea = {
  id: string;
  name: string;
  emoji: string;
  aporta: string;
  necesito: string;
  comunico: string;
  limites: string;
  mejorar: string;
};

const DEFAULT_AREAS: RelationshipArea[] = [
  {
    id: "familia",
    name: "Familia de Origen / Hogar",
    emoji: "🏡",
    aporta: "Pertenencia, historia compartida y afecto.",
    necesito: "Respeto a mi autonomía y a mis tiempos de descanso.",
    comunico: "Mi agradecimiento y mi disposición a ayudar.",
    limites: "No permitir que tomen decisiones por mí sobre mi vida profesional.",
    mejorar: "Tener más paciencia en las reuniones familiares."
  },
  {
    id: "pareja",
    name: "Pareja / Vínculo Afectivo",
    emoji: "❤️",
    aporta: "Complicidad, intimidad emocional y proyectos conjuntos.",
    necesito: "Validación emocional, escucha activa y tiempo de calidad a solas.",
    comunico: "Mis temores y deseos con transparencia.",
    limites: "Cuidar nuestros espacios de individualidad y aficiones propias.",
    mejorar: "Expresar mi malestar en el momento y no esperar a que se acumule."
  },
  {
    id: "amistades",
    name: "Amistades Significativas",
    emoji: "🤝",
    aporta: "Diversión, risas, desahogo sincero y apoyo mutuo.",
    necesito: "Reciprocidad e interés genuino en nuestras vidas.",
    comunico: "Presencia en momentos difíciles y alegría por sus logros.",
    limites: "Poder decir 'no' a un plan si estoy cansado sin sentir culpa.",
    mejorar: "Proponer encuentros más regulares con mis amigos más cercanos."
  },
  {
    id: "trabajo",
    name: "Entorno Laboral / Estudio",
    emoji: "💼",
    aporta: "Desarrollo profesional, retos intelectuales y retribución.",
    necesito: "Claridad en las funciones y respeto a los horarios acordados.",
    comunico: "Mis propuestas con profesionalismo y objetividad.",
    limites: "No responder correos de trabajo fuera del horario laboral pactado.",
    mejorar: "Delegar más tareas y no asumir responsabilidades ajenas."
  }
];

export default function ACMapaRelaciones() {
  const [areas, setAreas] = useState<RelationshipArea[]>(DEFAULT_AREAS);
  const [activeAreaId, setActiveAreaId] = useState<string>("familia");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:ac_relationships_map');
    if (local) {
      try { setAreas(JSON.parse(local)); } catch (e) {}
    }
  }, []);

  const activeArea = areas.find(a => a.id === activeAreaId) || areas[0];

  const handleFieldChange = (field: keyof RelationshipArea, val: string) => {
    const updated = areas.map(a => a.id === activeAreaId ? { ...a, [field]: val } : a);
    setAreas(updated);
  };

  const handleSave = () => {
    localStorage.setItem('conexionluz:ac_relationships_map', JSON.stringify(areas));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            🤝 HERRAMIENTA CLAVE
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Mapa de Relaciones y Límites Personales</h2>
        <p className="text-indigo-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Explora la salud de tus vínculos afectivos, laborales y sociales, definiendo con claridad qué aportas, qué necesitas y qué límites protegen tu energía.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {areas.map((a) => {
          const isSelected = a.id === activeAreaId;
          return (
            <button
              key={a.id}
              onClick={() => setActiveAreaId(a.id)}
              className={`p-4 rounded-3xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700 shadow-2xs'
              }`}
            >
              <span className="text-2xl">{a.emoji}</span>
              <span className="text-xs font-black">{a.name.split('/')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Detail Form Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-600" /> Exploración de Vínculo: {activeArea.name}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              1. ¿Qué me aporta esta relación? (Nutrición y valor)
            </label>
            <textarea
              rows={3}
              value={activeArea.aporta}
              onChange={(e) => handleFieldChange('aporta', e.target.value)}
              placeholder="Afecto, seguridad, crecimiento, aprendizajes..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              2. ¿Qué necesito de esta relación? (Mis necesidades afectivas)
            </label>
            <textarea
              rows={3}
              value={activeArea.necesito}
              onChange={(e) => handleFieldChange('necesito', e.target.value)}
              placeholder="Escucha, consideración, espacio, tiempo de calidad..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              3. ¿Qué comunico activamente? (Mi contribución al vínculo)
            </label>
            <textarea
              rows={2}
              value={activeArea.comunico}
              onChange={(e) => handleFieldChange('comunico', e.target.value)}
              placeholder="¿Cómo transmito mis intenciones, afecto y opiniones?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-indigo-950 font-black">
              4. ¿Qué límites existen o deseo establecer? (Autoprotección)
            </label>
            <textarea
              rows={2}
              value={activeArea.limites}
              onChange={(e) => handleFieldChange('limites', e.target.value)}
              placeholder="Límites de tiempo, temas delicados, respeto mutuo..."
              className="w-full bg-indigo-50/70 border border-indigo-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800">
            5. ¿Qué deseo mejorar de manera consciente en este ámbito?
          </label>
          <textarea
            rows={2}
            value={activeArea.mejorar}
            onChange={(e) => handleFieldChange('mejorar', e.target.value)}
            placeholder="Ajustes en mi actitud, mayor asertividad, expresar agradecimiento..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          {savedSuccess ? (
            <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ¡Mapa de relaciones guardado con éxito!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Poner límites claros cuida la salud de tus vínculos.</span>
          )}

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" /> Guardar Mapa de Relaciones
          </button>
        </div>
      </div>
    </div>
  );
}
