import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Lock, Award, HeartHandshake } from 'lucide-react';

export default function EricksonianaEthicsNotice() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/30 border border-amber-400/40 text-amber-200 px-3 py-1 rounded-full">
            🛡️ MARCO ÉTICO PROFESIONAL
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Ética en Hipnosis Ericksoniana</h2>
        <p className="text-amber-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          El aprendizaje de las herramientas comunicacionales e inductivas de Milton H. Erickson exige un compromiso absoluto con la responsabilidad, la autonomía y la seguridad del consultante.
        </p>
      </div>

      {/* Main Notice Box */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="text-base font-black text-amber-950">Advertencia Legal e Informativa Oficial</h3>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
              Este curso tiene finalidad estrictamente educativa y de desarrollo profesional en comunicación. El aprendizaje de técnicas de hipnosis no sustituye una formación sanitaria, psicológica o clínica universitaria regulada por la ley, ni otorga por sí mismo autorización legal para ejercer una profesión sanitaria o realizar diagnósticos médicos/psiquiátricos.
            </p>
          </div>
        </div>
      </div>

      {/* Ethical Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
              <HeartHandshake className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">1. Consentimiento Informado</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Toda práctica o interacción debe realizarse con el consentimiento previo, voluntario y claro de la persona, explicando siempre la naturaleza colaborativa del proceso.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-black">
              <Lock className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">2. Confidencialidad y Respeto</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Respetar rigurosamente la privacidad y dignidad del consultante, manteniendo la confidencialidad absoluta sobre cualquier experiencia compartida.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">3. No Manipulación ni Coerción</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Queda rotundamente prohibido el uso de patrones de lenguaje para manipular, coercionar o pretender controlar las decisiones autónomas de otras personas.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
              <Award className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">4. Límites de Competencia y Derivación</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Reconocer con humildad los límites de la propia disciplina y derivar de manera inmediata a profesionales sanitarios (psiquiatría/psicología clínica) ante cuadros de dolor severo o sintomatología grave.
          </p>
        </div>
      </div>
    </div>
  );
}
