import React from 'react';
import { ShieldCheck, AlertTriangle, Scale, HeartHandshake, Brain, Lock } from 'lucide-react';

export default function DPEticaNotice() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            🛡️ DESARROLLO PERSONAL RESPONSABLE
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Ética, Límites y Realismo</h2>
        <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          El crecimiento personal genuino se basa en la autocompasión, el respeto por los propios tiempos y la comprensión realista de que los seres humanos vivimos en contextos complejos.
        </p>
      </div>

      {/* Main Notice Box */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="text-base font-black text-amber-950">Aviso Formativo y Delimitación Ética</h3>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
              Este programa tiene una finalidad exclusivamente educativa y de desarrollo personal continuo. <strong>No constituye psicoterapia clínica ni tratamiento médico</strong>. Ninguna de las actividades, reflexiones o herramientas interactivas presentadas sustituye la evaluación, diagnóstico o tratamiento por parte de profesionales de la salud mental colegiados y acreditados.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Responsible Personal Growth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
              <Scale className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">1. Rechazo a la Culpa y Positividad Tóxica</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Rechazamos los mensajes simplistas como "todo depende de tu mente" o "si no lo logras es porque no lo deseas suficiente". Reconocemos que las circunstancias, la biología y los contextos sociales influyen profundamente en la vida humana.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black">
              <HeartHandshake className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">2. Autocompasión y Paciencia</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            El cambio duradero es un proceso no lineal con avances, pausas y retrocesos. Tratarse con amabilidad y autocompasión es mucho más eficaz y saludable que la autocrítica destructiva.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-black">
              <Brain className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">3. Derivación Oportuna</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Ante cuadros de depresión, ansiedad severa, duelo complicado o sufrimiento emocional incapacitante, promovemos activamente acudir a profesionales de la psicología y psiquiatría.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-black">
              <Lock className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">4. Privacidad y Seguridad</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Todos los ejercicios, mapas y entradas del diario quedan resguardados de forma privada para el usuario en su entorno personal, respetando la intimidad de su proceso.
          </p>
        </div>
      </div>
    </div>
  );
}
