import React, { useState, useEffect } from 'react';
import { Sparkles, Save, CheckCircle2, Sprout, Heart, Target, Lightbulb, Compass, Award } from 'lucide-react';

type PersonalMapData = {
  strengths: string;
  interests: string;
  coreValues: string;
  skills: string;
  growthAreas: string;
  lifeGoals: string;
  updatedAt: string;
};

export default function DPMapaPersonal() {
  const [data, setData] = useState<PersonalMapData>({
    strengths: '',
    interests: '',
    coreValues: '',
    skills: '',
    growthAreas: '',
    lifeGoals: '',
    updatedAt: ''
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:dp_personal_map');
    if (local) {
      try {
        setData(JSON.parse(local));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PersonalMapData = {
      ...data,
      updatedAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setData(updated);
    localStorage.setItem('conexionluz:dp_personal_map', JSON.stringify(updated));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Compass className="h-3 w-3" /> AUTOCONOCIMIENTO PROFUNDO
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Mi Mapa Personal</h2>
        <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Estructura y consolida tu identidad personal, reconociendo tus fortalezas reales, tus valores rectores y las áreas que deseas expandir conscientemente.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Sprout className="h-4 w-4 text-emerald-600" /> Dimensiones de Autoconocimiento
          </h3>
          {data.updatedAt && (
            <span className="text-[11px] text-slate-400 font-medium">Última actualización: {data.updatedAt}</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
            <label className="block text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-emerald-700" /> 1. Mis Fortalezas y Recursos Personales
            </label>
            <p className="text-[11px] text-emerald-800">¿Qué cualidades, actitudes o virtudes te reconoces y te han ayudado en momentos difíciles?</p>
            <textarea
              rows={3}
              value={data.strengths}
              onChange={(e) => setData({ ...data, strengths: e.target.value })}
              placeholder="ej: Perseverancia, empatía para escuchar, capacidad de adaptación, honestidad..."
              className="w-full bg-white border border-emerald-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5 bg-teal-50/50 border border-teal-100 rounded-2xl p-4">
            <label className="block text-xs font-bold text-teal-950 flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-teal-700" /> 2. Mis Intereses y Pasiones Genuinas
            </label>
            <p className="text-[11px] text-teal-800">¿Qué actividades, temas o aprendizajes te generan entusiasmo y te hacen perder la noción del tiempo?</p>
            <textarea
              rows={3}
              value={data.interests}
              onChange={(e) => setData({ ...data, interests: e.target.value })}
              placeholder="ej: Aprender sobre psicología, la naturaleza, escribir, proyectos creativos, servir a otros..."
              className="w-full bg-white border border-teal-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4">
            <label className="block text-xs font-bold text-indigo-950 flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-indigo-700" /> 3. Mis Valores Centrales
            </label>
            <p className="text-[11px] text-indigo-800">¿Cuáles son los 3 o 4 principios innegociables que guían tu comportamiento ético?</p>
            <textarea
              rows={3}
              value={data.coreValues}
              onChange={(e) => setData({ ...data, coreValues: e.target.value })}
              placeholder="ej: Libertad, coherencia, respeto, familia, crecimiento continuo..."
              className="w-full bg-white border border-indigo-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5 bg-cyan-50/50 border border-cyan-100 rounded-2xl p-4">
            <label className="block text-xs font-bold text-cyan-950 flex items-center gap-1.5">
              <Lightbulb className="h-4 w-4 text-cyan-700" /> 4. Habilidades y Competencias
            </label>
            <p className="text-[11px] text-cyan-800">¿Qué habilidades prácticas, sociales, técnicas o comunicativas has desarrollado a lo largo de tu vida?</p>
            <textarea
              rows={3}
              value={data.skills}
              onChange={(e) => setData({ ...data, skills: e.target.value })}
              placeholder="ej: Organización, resolución analítica, comunicación clara, cocina, redacción..."
              className="w-full bg-white border border-cyan-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5 bg-amber-50/50 border border-amber-100 rounded-2xl p-4">
            <label className="block text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <Target className="h-4 w-4 text-amber-700" /> 5. Áreas de Crecimiento Prioritarias
            </label>
            <p className="text-[11px] text-amber-800">¿Qué aspectos de tu vida deseas madurar o fortalecer en los próximos meses?</p>
            <textarea
              rows={3}
              value={data.growthAreas}
              onChange={(e) => setData({ ...data, growthAreas: e.target.value })}
              placeholder="ej: Gestión del tiempo matutino, poner límites asertivos, mantener constancia en el ejercicio..."
              className="w-full bg-white border border-amber-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5 bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-emerald-600" /> 6. Objetivos Personales de Vida
            </label>
            <p className="text-[11px] text-slate-600">¿Hacia dónde quieres orientar tus esfuerzos principales en esta etapa de tu vida?</p>
            <textarea
              rows={3}
              value={data.lifeGoals}
              onChange={(e) => setData({ ...data, lifeGoals: e.target.value })}
              placeholder="ej: Completar mi formación, cultivar relaciones más nutritivas, consolidar mi bienestar físico..."
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ¡Mapa Personal guardado exitosamente!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Puedes actualizar tu mapa personal a medida que evolucione tu autoconocimiento.</span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" /> Guardar Mi Mapa Personal
          </button>
        </div>
      </form>
    </div>
  );
}
