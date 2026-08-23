import React from 'react';
import { AlertTriangle, Scale, HeartHandshake, Brain, Lock, ShieldAlert } from 'lucide-react';

export default function ACEticaNotice() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            🛡️ AUTOCONOCIMIENTO RESPONSABLE
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Ética, Flexibilidad y Rigor Personal</h2>
        <p className="text-indigo-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          El autoconocimiento es un proceso vivo y continuo de exploración personal que busca comprensión y libertad interior, sin etiquetas deterministas ni juicios punitivos.
        </p>
      </div>

      {/* Main Notice Box */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="text-base font-black text-amber-950">Aviso Educativo y Delimitación Sanitaria</h3>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
              Este programa tiene una finalidad estrictamente pedagógica y de autorreflexión formativa. <strong>No constituye psicoterapia clínica ni evaluación diagnóstica de la personalidad</strong>. Ninguna herramienta pretende etiquetar de forma inmutable quién eres ni sustituye el criterio de profesionales sanitarios colegiados.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-black">
              <Scale className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">1. Las Personas Cambian</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Tus respuestas y reflexiones de hoy describen tu estado presente. El ser humano es dinámico y tiene capacidad constante de aprendizaje, adaptación y transformación.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black">
              <Brain className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">2. Sin Fórmulas Absolutas</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Evitamos el dogma de que 'todo tiene una causa oculta' o de que el autoconocimiento resuelve mágicamente cualquier desafío. La vida incluye incertidumbre y factores externos.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black">
              <HeartHandshake className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">3. Acompañamiento Profesional</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Si durante algún ejercicio surgen recuerdos dolorosos, angustia o sufrimiento significativo, recomendamos buscar el apoyo cercano de un profesional cualificado de la psicología.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-black">
              <Lock className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">4. Privacidad Absoluta</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Tus diarios, hitos de vida, mapas de relaciones y reflexiones son privados y permanecen seguros para tu consulta personal en tu navegador.
          </p>
        </div>
      </div>
    </div>
  );
}
