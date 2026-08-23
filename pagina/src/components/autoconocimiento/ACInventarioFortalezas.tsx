import React, { useState, useEffect } from 'react';
import { Sparkles, Save, CheckCircle2, Award, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

type StrengthInventory = {
  hagoBien: string;
  aprendiendo: string;
  quieroMejorar: string;
  quieroDescubrir: string;
  recursosTengo: string;
  recursosNecesito: string;
};

const DEFAULT_INVENTORY: StrengthInventory = {
  hagoBien: "Escucha empática, capacidad de análisis reflexivo, constancia cuando me comprometo.",
  aprendiendo: "Gestión de la autoexigencia y comunicación directa de mis necesidades.",
  quieroMejorar: "La paciencia ante la incertidumbre y la tolerancia a las equivocaciones cotidianas.",
  quieroDescubrir: "Mis habilidades de liderazgo consciente y expresión creativa.",
  recursosTengo: "Capacidad de autorreflexión, hábitos de lectura y perseverancia.",
  recursosNecesito: "Mayor claridad para poner límites y redes de apoyo afines."
};

export default function ACInventarioFortalezas() {
  const [inventory, setInventory] = useState<StrengthInventory>(DEFAULT_INVENTORY);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:ac_strength_inventory');
    if (local) {
      try { setInventory(JSON.parse(local)); } catch (e) {}
    }
  }, []);

  const handleChange = (field: keyof StrengthInventory, val: string) => {
    setInventory(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = () => {
    localStorage.setItem('conexionluz:ac_strength_inventory', JSON.stringify(inventory));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            💎 HERRAMIENTA CLAVE
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Inventario Personal de Fortalezas</h2>
        <p className="text-indigo-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Reconoce los recursos y capacidades que ya habitan en ti, y define con claridad qué nuevas competencias deseas cultivar.
        </p>
      </div>

      {/* Grid of 6 Areas */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lo que hago bien */}
          <div className="p-5 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-2">
            <label className="block text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-4 w-4 text-indigo-600" /> 1. Lo que Hago Bien (Fortalezas Consolidadas)
            </label>
            <textarea
              rows={3}
              value={inventory.hagoBien}
              onChange={(e) => handleChange('hagoBien', e.target.value)}
              placeholder="¿Qué habilidades o fortalezas reconoces en ti?"
              className="w-full bg-white border border-indigo-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Lo que estoy aprendiendo */}
          <div className="p-5 bg-purple-50/60 border border-purple-100 rounded-2xl space-y-2">
            <label className="block text-xs font-black text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-purple-600" /> 2. Lo que Estoy Aprendiendo (En Proceso)
            </label>
            <textarea
              rows={3}
              value={inventory.aprendiendo}
              onChange={(e) => handleChange('aprendiendo', e.target.value)}
              placeholder="¿Qué habilidades estás practicando activamente?"
              className="w-full bg-white border border-purple-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          {/* Lo que quiero mejorar */}
          <div className="p-5 bg-amber-50/60 border border-amber-100 rounded-2xl space-y-2">
            <label className="block text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowUpRight className="h-4 w-4 text-amber-600" /> 3. Lo que Quiero Mejorar (Áreas de Crecimiento)
            </label>
            <textarea
              rows={3}
              value={inventory.quieroMejorar}
              onChange={(e) => handleChange('quieroMejorar', e.target.value)}
              placeholder="¿Qué aspectos deseas pulir con paciencia?"
              className="w-full bg-white border border-amber-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Lo que quiero descubrir */}
          <div className="p-5 bg-cyan-50/60 border border-cyan-100 rounded-2xl space-y-2">
            <label className="block text-xs font-black text-cyan-950 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-cyan-600" /> 4. Lo que Quiero Descubrir (Curiosidades)
            </label>
            <textarea
              rows={3}
              value={inventory.quieroDescubrir}
              onChange={(e) => handleChange('quieroDescubrir', e.target.value)}
              placeholder="¿Qué potenciales o facetas aún no exploradas intuyes en ti?"
              className="w-full bg-white border border-cyan-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          {/* Recursos que ya tengo */}
          <div className="p-5 bg-emerald-50/60 border border-emerald-100 rounded-2xl space-y-2">
            <label className="block text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> 5. Recursos que ya Tengo (Soportes Internos)
            </label>
            <textarea
              rows={3}
              value={inventory.recursosTengo}
              onChange={(e) => handleChange('recursosTengo', e.target.value)}
              placeholder="¿Qué experiencias, hábitos y apoyos forman tu base de seguridad?"
              className="w-full bg-white border border-emerald-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Recursos que necesito desarrollar */}
          <div className="p-5 bg-teal-50/60 border border-teal-100 rounded-2xl space-y-2">
            <label className="block text-xs font-black text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-teal-600" /> 6. Recursos que Necesito Desarrollar
            </label>
            <textarea
              rows={3}
              value={inventory.recursosNecesito}
              onChange={(e) => handleChange('recursosNecesito', e.target.value)}
              placeholder="¿Qué herramientas o apoyos te gustaría incorporar?"
              className="w-full bg-white border border-teal-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          {savedSuccess ? (
            <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ¡Inventario de fortalezas guardado!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Revisar este inventario te ayuda a recordar tu capacidad de resiliencia.</span>
          )}

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" /> Guardar Mi Inventario
          </button>
        </div>
      </div>
    </div>
  );
}
