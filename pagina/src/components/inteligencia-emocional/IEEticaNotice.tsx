import React from 'react';
import { AlertTriangle, Scale, HeartHandshake, Brain, Lock, ShieldAlert } from 'lucide-react';

export default function IEEticaNotice() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/30 border border-teal-400/40 text-teal-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            🛡️ INTELIGENCIA EMOCIONAL RESPONSABLE
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Ética, Límites y Rigor Afectivo</h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          La inteligencia emocional promueve una relación honesta y compasiva con el mundo afectivo, reconociendo la validez de todas las emociones humanas.
        </p>
      </div>

      {/* Main Notice Box */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="text-base font-black text-amber-950">Aviso Educativo y Delimitación Sanitaria</h3>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
              Este programa tiene un propósito estrictamente pedagógico y formativo. <strong>No constituye psicoterapia clínica ni tratamiento médico o psiquiátrico</strong>. Las herramientas de autoobservación y regulación no emiten diagnósticos clínicos y no sustituyen el acompañamiento de profesionales de la salud mental colegiados.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black">
              <Scale className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">1. Validez de Todas las Emociones</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            No existen emociones 'malas' que deban extirparse. Sentir tristeza, miedo o enojo es una respuesta humana natural e informativa ante las circunstancias de la vida.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-black">
              <Brain className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">2. Regular vs. Reprimir</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Autorregularse no significa anestesiarse ni sonreír forzadamente. Significa hacer espacio a la emoción en el cuerpo y elegir una conducta que no dañe a otros ni a uno mismo.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black">
              <HeartHandshake className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">3. Derivación Oportuna</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Ante cuadros depresivos, ansiedad paralizante, ataques de pánico o traumas complejos, fomentamos activamente la consulta con profesionales acreditados de la psicología clínica y psiquiatría.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-black">
              <Lock className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">4. Confidencialidad y Seguridad</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Todos los mapas, registros del diario y reflexiones quedan resguardados de forma privada para el usuario autenticado en su dispositivo, respetando la intimidad de su proceso.
          </p>
        </div>
      </div>
    </div>
  );
}
