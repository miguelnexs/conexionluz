import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  Scale, 
  BookOpen, 
  HeartHandshake,
  CheckCircle2,
  Brain
} from 'lucide-react';

export default function MAPEticaNotice() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/20 border border-teal-400/30 text-teal-200 px-3.5 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-300" />
            MARCO ÉTICO Y EPISTEMOLÓGICO
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Distinción Científica y Enfoque Filosófico
        </h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Transparencia pedagógica de ConexiónLuz sobre el sustento científico, el modelo conceptual del curso y el carácter estrictamente formativo de este programa.
        </p>
      </div>

      {/* Main Dual Epistemological Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Box 1: Conocimiento Científico */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="h-8 w-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Brain className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Conocimiento Científico</h3>
              <span className="text-[10px] font-bold text-blue-700 uppercase">Respaldado por la investigación</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 font-medium leading-relaxed">
            <p>
              • <strong>Atención y Metacognición:</strong> Procesos cognitivos ampliamente estudiados por la psicología cognitiva y las neurociencias en relación con la corteza prefrontal y las redes de control ejecutivo.
            </p>
            <p>
              • <strong>Psicofisiología Emocional:</strong> Respuestas adaptativas del sistema nervioso autónomo (simpático y parasimpático) ante demandas ambientales y estímulos internos.
            </p>
            <p>
              • <strong>Exaptación Biológica:</strong> Concepto formal de la biología evolutiva (Gould & Vrba) que describe estructuras biológicas que adquieren funciones distintas a las originales.
            </p>
          </div>
        </div>

        {/* Box 2: Modelo Conceptual ConexiónLuz */}
        <div className="bg-white border border-teal-200/90 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="h-8 w-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Modelo Conceptual ConexiónLuz</h3>
              <span className="text-[10px] font-bold text-teal-700 uppercase">Marco Pedagógico & Formativo</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 font-medium leading-relaxed">
            <p>
              • <strong>Concepto de Mediación:</strong> Planteamiento pedagógico original de ConexiónLuz para entrenar la observación simultánea interna y externa en el presente.
            </p>
            <p>
              • <strong>Exaptación del Sistema Emocional:</strong> Aplicación metafórica y didáctica para aprender a utilizar las emociones como datos lúcidos para la metaconciencia, sin pretender que la evolución biológica diseñó las emociones para este fin intencional.
            </p>
            <p>
              • <strong>Secuencia Pedagógica:</strong> Esquema de 6 fases diseñado para facilitar la asimilación y la práctica en la vida cotidiana.
            </p>
          </div>
        </div>

      </div>

      {/* Critical Ethical Disclaimers */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4 text-amber-950">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0" />
          <h3 className="text-base font-black uppercase tracking-wide">
            Aclaración Ética y Delimitación de Alcance
          </h3>
        </div>

        <div className="space-y-2 text-xs leading-relaxed font-medium">
          <p>
            1. <strong>Carácter Educativo:</strong> Este programa es una experiencia formativa y de desarrollo de la conciencia personal. No constituye terapia psicológica, psicoterapia clínica ni tratamiento psiquiátrico.
          </p>
          <p>
            2. <strong>No es Diagnóstico:</strong> Ninguna de las evaluaciones, registros ni ejercicios interactivos debe utilizarse como instrumento de diagnóstico clínico de trastornos de ansiedad, depresión u otras condiciones de salud mental.
          </p>
          <p>
            3. <strong>Acompañamiento Profesional:</strong> Si te encuentras atravesando una crisis emocional aguda, un duelo no resuelto o una condición clínica, recomendamos buscar el acompañamiento de un profesional de la salud mental debidamente acreditado.
          </p>
        </div>
      </div>
    </div>
  );
}
