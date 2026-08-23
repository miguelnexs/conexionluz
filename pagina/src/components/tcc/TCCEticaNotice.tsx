import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Lock, Award, HeartHandshake, Scale, Brain } from 'lucide-react';

export default function TCCEticaNotice() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/30 border border-amber-400/40 text-amber-200 px-3 py-1 rounded-full">
            🛡️ MARCO ÉTICO Y LEGAL
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Uso Responsable y Ética en TCC</h2>
        <p className="text-amber-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          El estudio de la Terapia Cognitivo-Conductual se fundamenta en el rigor científico, el respeto irrestricto por la persona y la clara delimitación entre el aprendizaje educativo y el ejercicio clínico profesional.
        </p>
      </div>

      {/* Official Warning Box */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="text-base font-black text-amber-950">Aviso Legal y Delimitación de Competencias</h3>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
              Este programa tiene un propósito estrictamente pedagógico, educativo y de autorreflexión personal. Completar este curso <strong>no otorga titulación universitaria en Psicología Clínica</strong>, no confiere licencia sanitaria ni habilita legalmente para diagnosticar trastornos mentales, formular tratamientos psicoterapéuticos a terceros o ejercer profesiones sanitarias reguladas por la legislación vigente.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Ethical Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black">
              <Scale className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">1. Finalidad Educativa y No Clínica</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Las herramientas de registro y cuestionamiento socrático son instrumentos de autoconocimiento reflexivo, no sustituyen el acompañamiento clínico personalizado.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black">
              <Brain className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">2. No Emisión de Diagnósticos</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            El sistema y sus ejercicios no generan diagnósticos automáticos ni recomendaciones médicas individualizadas. Los casos presentados son 100% ficticios y pedagógicos.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-black">
              <HeartHandshake className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">3. Derivación Oportuna</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Ante cuadros de depresión severa, crisis de pánico, ideación autolítica o sufrimiento incapacitante, se debe acudir siempre a profesionales de la salud mental colegiados y acreditados.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
              <Lock className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">4. Confidencialidad y Privacidad</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Toda información introducida en los ejercicios de autorreflexión queda almacenada en el entorno seguro del usuario, respetando plenamente su privacidad.
          </p>
        </div>
      </div>
    </div>
  );
}
