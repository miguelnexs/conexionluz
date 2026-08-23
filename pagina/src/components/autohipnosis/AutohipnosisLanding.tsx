import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  PlayCircle, 
  CheckCircle2, 
  Brain, 
  ShieldCheck, 
  Compass, 
  Award, 
  Volume2, 
  BookOpen, 
  HelpCircle, 
  ChevronDown, 
  Layers,
  Heart,
  Zap
} from 'lucide-react';

interface AutohipnosisLandingProps {
  onEnroll: () => void;
  isUnlocked: boolean;
  priceLabel: string;
}

export default function AutohipnosisLanding({ onEnroll, isUnlocked, priceLabel }: AutohipnosisLandingProps) {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const keyLearnings = [
    "Qué es la hipnosis y la autohipnosis desde la perspectiva científica.",
    "Fundamentos neurobiológicos: Ondas Alfa y Theta para calmar el sistema nervioso.",
    "Cómo disolver mitos y falsas creencias sobre el trance y el control voluntario.",
    "Técnicas de preparación del espacio, postura adecuada y luz favorable.",
    "Respiración consciente diafragmática (Método 4-7-8 de relajación).",
    "Focalización de la atención y anclas sensoriales.",
    "Inducción mediante fijación visual y pesadez de párpados.",
    "Inducción rítmica y cuenta regresiva de profundización.",
    "Reconocimiento de señales físicas de relajación profunda.",
    "Profundización mental mediante el escenario de la escalera o la playa serena.",
    "Formulación de sugestiones positivas afirmativas en tiempo presente.",
    "Lenguaje dirigido a uno mismo para reestructurar el diálogo interno.",
    "Visualización multisensorial (vista, oído, tacto y emoción).",
    "Trabajo focalizado con objetivos de vida personales.",
    "Reforzamiento de hábitos positivos y motivación de acción.",
    "Desarrollo de autoconfianza, autoestima e identidad serena.",
    "Concentración profunda y entrada en estados de flujo (Flow).",
    "Manejo cotidiano del estrés mediante micro-sesiones de autohipnosis.",
    "Creación y diseño de una sesión personal de autohipnosis personalizada.",
    "Procedimiento de terminación y salida progresiva y segura del ejercicio (1 a 5)."
  ];

  const modules = [
    { num: 1, title: "Conociendo tu Mente", desc: "Neurociencia, mitos, atención y el papel del subconsciente." },
    { num: 2, title: "Preparando el Terreno", desc: "Espacio, postura, respiración diafragmática y desactivación de distracciones." },
    { num: 3, title: "Entrando en Trance", desc: "Técnicas de inducción, cuenta regresiva, señales fisiológicas y profundización." },
    { num: 4, title: "El Poder de la Sugestión", desc: "Lenguaje afirmativo, formulación en presente y visualización multisensorial." },
    { num: 5, title: "Autosugestión y Transformación", desc: "Autoestima, motivación, hábitos, concentración y manejo cotidiano del estrés." },
    { num: 6, title: "Creando tu Propia Sesión", desc: "Los 10 pasos estructurales + Generador interactivo de guiones de autohipnosis." },
    { num: 7, title: "Prácticas Guiadas", desc: "Biblioteca de 10 audios de autohipnosis de 5, 10 y 15 minutos." },
    { num: 8, title: "Integración y Plan Personal", desc: "Rutinas semanales, evaluación final y Certificado Oficial Conexión Luz." }
  ];

  const faqs = [
    {
      q: "¿Necesito experiencia previa en meditación u otra disciplina?",
      a: "No. El curso está diseñado pedagógicamente desde cero. Aprenderás paso a paso la teoría neurobiológica y los ejercicios prácticos de manera progresiva y amigable."
    },
    {
      q: "¿Cuánto dura el programa?",
      a: "El curso consta de 8 módulos completos que puedes realizar a tu propio ritmo. Se recomienda dedicar de 15 a 20 minutos diarios para completar el programa en aproximadamente 2 a 3 semanas."
    },
    {
      q: "¿Puedo realizar la autohipnosis desde casa?",
      a: "Sí. Todo lo que necesitas es un espacio tranquilo donde puedas sentarte cómodamente sin interrupciones."
    },
    {
      q: "¿Puedo repetir las sesiones y audios guiados?",
      a: "Acceso ilimitado de por vida. Puedes volver a escuchar los audios guiados y utilizar el Generador de Sesiones cuantas veces lo requieras."
    },
    {
      q: "¿La autohipnosis sustituye la terapia médica o psicológica profesional?",
      a: "No. La autohipnosis en este programa es un recurso educativo de bienestar, autorregulación y desarrollo personal. No reemplaza el tratamiento médico o psicoterapéutico profesional."
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans select-none overflow-x-hidden">
      
      {/* ══════════════════════════════════════════════════════════
          1. HERO SECTION (Luminous Light Ambiance)
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-indigo-50/90 via-purple-50/40 to-slate-50 border-b border-slate-200/80">
        
        {/* Soft Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-amber-200/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center space-y-8">
          
          {/* Brand Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            <span>CONEXIÓN LUZ · ACADEMIA DIGITAL</span>
          </div>

          {/* Featured Course Cover Image Preview */}
          <div className="max-w-md mx-auto aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
            <img
              src="/cursos/autohipnosis_cover.png"
              alt="AUTOHIPNOSIS Conexión Luz"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 leading-none">
              AUTOHIPNOSIS
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-700">
              "Aprende a transformar tu diálogo interno y dirigir tu mente"
            </p>
            <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
              Un viaje consciente hacia el autoconocimiento, la autorregulación emocional y la reprogramación positiva de tu mente subconsciente.
            </p>
          </div>

          {/* Key Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs">
              <Brain className="h-4 w-4 text-indigo-600" /> Neurociencia & Psicología
            </span>
            <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs">
              <Volume2 className="h-4 w-4 text-purple-600" /> 10 Audios Guiados
            </span>
            <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs">
              <Zap className="h-4 w-4 text-amber-500" /> Generador de Sesiones
            </span>
            <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs">
              <Award className="h-4 w-4 text-emerald-600" /> Certificado Incluido
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={onEnroll}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{isUnlocked ? "INGRESAR AL CURSO" : "COMENZAR EL CURSO"}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            {isUnlocked ? "🔓 Tienes acceso completo activado" : `Acceso ilimitado por ${priceLabel}`}
          </p>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. METHODOLOGY (Aprende -> Practica -> Observa -> Repite -> Integra)
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-3.5 py-1 rounded-full">
              METODOLOGÍA EDUCATIVA
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              Un Método Progresivo en 5 Etapas
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            {[
              { step: "1", title: "APRENDE", desc: "Fundamentos teóricos y neurobiología", color: "border-indigo-200 bg-indigo-50/50 text-indigo-800" },
              { step: "2", title: "PRACTICA", desc: "Ejercicios de respiración e inducción", color: "border-purple-200 bg-purple-50/50 text-purple-800" },
              { step: "3", title: "OBSERVA", desc: "Registro en tu Diario de Autohipnosis", color: "border-amber-200 bg-amber-50/50 text-amber-800" },
              { step: "4", title: "REPITE", desc: "Consolidación de autopistas neuronales", color: "border-emerald-200 bg-emerald-50/50 text-emerald-800" },
              { step: "5", title: "INTEGRA", desc: "Rutina personal y transformación", color: "border-blue-200 bg-blue-50/50 text-blue-800" }
            ].map((m) => (
              <div key={m.step} className={`border ${m.color} rounded-2xl p-4 flex flex-col items-center space-y-2 shadow-2xs`}>
                <span className="h-8 w-8 rounded-full bg-white font-black text-xs shadow-xs flex items-center justify-center">
                  {m.step}
                </span>
                <span className="font-black text-xs tracking-wider">{m.title}</span>
                <p className="text-[11px] text-slate-600 font-medium leading-tight">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. WHAT WILL YOU LEARN? (20 Core Competencies Grid)
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-slate-50/60">
        <div className="container mx-auto px-4 max-w-5xl space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-3.5 py-1 rounded-full">
              OBJETIVOS DEL PROGRAMA
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              ¿Qué Aprenderás en este Curso?
            </h2>
            <p className="text-slate-600 text-sm font-medium max-w-xl mx-auto">
              20 competencias teórico-prácticas para dominar el arte de la autohipnosis responsable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {keyLearnings.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-200/80 hover:border-indigo-300 p-4 rounded-2xl flex items-start gap-3 transition-colors shadow-2xs"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. COURSE MODULES STRUCTURE (8 Modules)
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="container mx-auto px-4 max-w-5xl space-y-10">
          
          <div className="text-center space-y-3">
            <span className="text-[11px] font-black uppercase tracking-widest text-purple-700 bg-purple-50 border border-purple-100 px-3.5 py-1 rounded-full">
              ESTRUCTURA DE CONTENIDO
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              8 Módulos de Aprendizaje Estructurado
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((m) => (
              <div 
                key={m.num}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 flex items-start gap-4 hover:border-purple-300 transition-colors shadow-2xs"
              >
                <span className="h-10 w-10 rounded-xl bg-purple-100 border border-purple-200 text-purple-800 font-black flex items-center justify-center text-sm shrink-0">
                  M{m.num}
                </span>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-slate-900">{m.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. FAQ & DISCLAIMER NOTICE
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-slate-50/60">
        <div className="container mx-auto px-4 max-w-4xl space-y-12">
          
          {/* FAQ Accordion */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Preguntas Frecuentes</h2>
              <p className="text-xs text-slate-600">Resuelve todas tus dudas antes de iniciar tu práctica.</p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-800 hover:text-indigo-700 cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180 text-amber-500' : 'text-slate-400'}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Medical Disclaimer Banner */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-3xl p-6 sm:p-8 space-y-3 text-amber-950 text-xs leading-relaxed shadow-sm">
            <div className="flex items-center gap-2 text-amber-800 font-black text-sm uppercase tracking-wider">
              <ShieldCheck className="h-5 w-5 text-amber-600" />
              <span>Aviso de Responsabilidad & Ética</span>
            </div>
            <p>
              La autohipnosis presentada en este programa está estrictamente orientada al aprendizaje, el autoconocimiento, la relajación profunda y el desarrollo personal. No sustituye diagnóstico, tratamiento médico, psicológico ni psiquiátrico profesional. Las prácticas deben realizarse en condiciones seguras y nunca mientras se conduce, se opera maquinaria pesada o se realizan actividades que requieran atención plena.
            </p>
          </div>

          {/* Final Bottom CTA */}
          <div className="text-center pt-4">
            <button
              onClick={onEnroll}
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-base shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              <span>INICIAR MI PRÁCTICA DE AUTOHIPNOSIS</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
