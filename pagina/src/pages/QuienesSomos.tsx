import React from 'react';
import PublicLayout from '@/components/PublicLayout';
import {
  Building2,
  Heart,
  Target,
  Eye,
  Sparkles,
  ShieldCheck,
  Award,
  ChevronRight,
  Lightbulb,
  Globe,
  Compass,
  CheckCircle2,
  HeartHandshake,
  Scale,
  GraduationCap,
  Cpu,
  Layers,
  ArrowRight,
  BookOpen,
  Brain,
  Smile,
  Activity,
  UserCheck,
  Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';

const INSTITUTIONAL_VALUES = [
  {
    icon: Heart,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    glow: 'group-hover:shadow-rose-100',
    title: 'Empatía',
    desc: 'Comprendemos la historia y las necesidades de cada persona sin emitir juicios.',
  },
  {
    icon: HeartHandshake,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    glow: 'group-hover:shadow-emerald-100',
    title: 'Respeto',
    desc: 'Valoramos la dignidad, la diversidad y la autonomía de cada consultante.',
  },
  {
    icon: Scale,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    glow: 'group-hover:shadow-indigo-100',
    title: 'Ética',
    desc: 'Actuamos con responsabilidad, confidencialidad e integridad profesional.',
  },
  {
    icon: Compass,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    glow: 'group-hover:shadow-sky-100',
    title: 'Compromiso',
    desc: 'Acompañamos cada proceso con dedicación y responsabilidad.',
  },
  {
    icon: Award,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    glow: 'group-hover:shadow-amber-100',
    title: 'Excelencia',
    desc: 'Buscamos mejorar continuamente nuestros conocimientos, procesos y servicios.',
  },
  {
    icon: Lightbulb,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    glow: 'group-hover:shadow-teal-100',
    title: 'Innovación',
    desc: 'Integramos metodologías y tecnologías que aporten valor al proceso terapéutico.',
  },
  {
    icon: Sparkles,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    glow: 'group-hover:shadow-purple-100',
    title: 'Humanismo',
    desc: 'Creemos en el potencial de las personas para aprender, crecer y transformar su vida.',
  },
];

const QUALITY_POLICIES = [
  'Brindar una atención personalizada, respetuosa y centrada en las necesidades de cada persona.',
  'Mantener altos estándares de ética, confidencialidad y responsabilidad profesional en todos nuestros procesos.',
  'Promover metodologías de intervención fundamentadas en el conocimiento, la experiencia clínica y la mejora continua.',
  'Fortalecer permanentemente las competencias de nuestro equipo mediante procesos de formación y actualización.',
  'Escuchar y valorar la retroalimentación de nuestros consultantes para mejorar continuamente nuestros servicios.',
  'Incorporar herramientas tecnológicas que faciliten el acceso, seguimiento y acompañamiento de nuestros procesos terapéuticos.',
  'Fomentar una cultura organizacional basada en el respeto, la empatía, la transparencia y el compromiso con el desarrollo humano.',
];

const SCHOOL_PRINCIPLES = [
  {
    num: '01',
    title: 'Autoconocimiento',
    icon: Brain,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    desc: 'Toda transformación comienza al comprender quiénes somos, cómo pensamos y cómo interpretamos nuestras experiencias.',
  },
  {
    num: '02',
    title: 'Responsabilidad Personal',
    icon: UserCheck,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    desc: 'Reconocer la capacidad de participar activamente en nuestras decisiones y procesos de cambio, diferenciando aquello que podemos transformar de aquello que debemos aprender a afrontar.',
  },
  {
    num: '03',
    title: 'Conciencia Emocional',
    icon: Heart,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    desc: 'Aprender a identificar, comprender y regular las emociones para responder de forma más saludable a los desafíos de la vida.',
  },
  {
    num: '04',
    title: 'Aprendizaje Permanente',
    icon: GraduationCap,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    desc: 'Cada experiencia puede convertirse en una oportunidad para crecer, adquirir nuevas habilidades y ampliar nuestra comprensión.',
  },
  {
    num: '05',
    title: 'Bienestar Integral',
    icon: Activity,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    desc: 'Promover el equilibrio entre la salud emocional, mental, relacional y el desarrollo personal, entendiendo que estos aspectos se influyen mutuamente.',
  },
  {
    num: '06',
    title: 'Relaciones Conscientes',
    icon: HeartHandshake,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    desc: 'Fomentar vínculos basados en el respeto, la comunicación, la empatía y la corresponsabilidad.',
  },
  {
    num: '07',
    title: 'Ética y Respeto',
    icon: Scale,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    desc: 'Toda intervención y proceso educativo se fundamenta en la dignidad humana, la confidencialidad y el respeto por las decisiones y creencias de cada persona.',
  },
  {
    num: '08',
    title: 'Transformación con Propósito',
    icon: Flame,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    desc: 'El conocimiento cobra sentido cuando se traduce en acciones que mejoran la vida propia y aportan positivamente a la comunidad.',
  },
];

export default function QuienesSomosPage() {
  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-16">

        {/* ══════════════════════════════════════════════════════════
            HERO SECTION CON LEMA INSTITUCIONAL
        ══════════════════════════════════════════════════════════ */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[hsl(193,85%,25%)] to-[hsl(180,75%,18%)] p-8 md:p-14 text-white shadow-2xl border border-white/10">
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.4) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
          <div className="absolute -bottom-16 -right-16 h-72 w-72 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-16 -left-16 h-72 w-72 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/20 shadow-sm">
              <Building2 className="h-4 w-4 text-emerald-300" />
              <span className="text-xs md:text-sm font-black tracking-wide uppercase text-emerald-200">
                Conexión Luz · Quiénes Somos
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight drop-shadow-sm text-balance">
                Acompañamiento Terapéutico Integral y Escuela de Conciencia
              </h1>
              
              {/* Lema Institucional */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 w-fit">
                <p className="text-emerald-300 font-black text-sm md:text-base italic tracking-wide">
                  “Comprender para transformar. Transformar para vivir con propósito.”
                </p>
              </div>
            </div>

            <p className="text-white/90 text-base md:text-lg leading-relaxed font-normal text-justify [text-justify:inter-word] [text-align-last:left]">
              En Conexión Luz integramos dos grandes pilares sinérgicos: nuestro <strong className="text-white font-bold">Centro Terapéutico Especializado</strong> y la <strong className="text-emerald-300 font-bold">Escuela de Conciencia Conexión Luz</strong>, uniendo la ciencia clínica y la educación para el despertar del potencial humano.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/agenda"
                className="inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all active:scale-95"
              >
                <span>Agendar Consulta</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/cursos"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-2xl border border-white/20 backdrop-blur-md transition-all"
              >
                <BookOpen className="h-4 w-4 text-emerald-300" />
                <span>Explorar Cursos de la Escuela</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            PROPÓSITO INSTITUCIONAL (CONEXIÓN LUZ)
        ══════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-200/50 p-8 md:p-12 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-emerald-500 to-teal-500" />
          
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Esencia y Razón de Ser</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">Propósito Institucional</h2>
            </div>
          </div>

          <div className="space-y-4 text-slate-700 text-base md:text-lg leading-relaxed text-justify [text-justify:inter-word] [text-align-last:left]">
            <p>
              En <strong className="text-slate-900 font-bold">Conexión Luz</strong> creemos que toda persona posee la capacidad de comprender su historia, desarrollar nuevos recursos y construir una vida con mayor equilibrio, bienestar y sentido.
            </p>
            <p>
              Nuestro propósito es acompañar procesos de transformación personal mediante un enfoque humano, ético e integrador, ofreciendo espacios terapéuticos y educativos que favorezcan el autoconocimiento, la gestión emocional y el desarrollo consciente de las capacidades de cada individuo.
            </p>
            <p className="bg-slate-50 p-5 rounded-2xl border border-slate-150 font-medium text-slate-800 text-sm md:text-base">
              Más que resolver un problema puntual, buscamos que las personas adquieran herramientas para comprenderse mejor, afrontar los desafíos de la vida con mayor confianza y fortalecer una relación saludable consigo mismas y con quienes las rodean.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            DOS PILARES FUNDAMENTALES (CENTRO TERAPÉUTICO & ESCUELA)
        ══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Pilar 1: Centro Terapéutico */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-200 p-7 md:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-teal-600">Pilar Terapéutico</span>
                  <h3 className="text-xl font-black text-slate-900">Institución Terapéutica</h3>
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed text-justify [text-justify:inter-word] [text-align-last:left]">
                Atención clínica personalizada que aborda el origen profundo de las dificultades mediante hipnosis clínica, hipnoanálisis, terapia cognitivo-conductual y enfoques humanistas de vanguardia.
              </p>

              <ul className="space-y-2 text-xs font-semibold text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-teal-500" /> Acompañamiento individualizado y confidencial</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-teal-500" /> Terapeutas certificados y colegiados</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-teal-500" /> Modalidad online y presencial</li>
              </ul>
            </div>

            <Link
              to="/servicios"
              className="inline-flex items-center justify-between w-full bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs px-4 py-3 rounded-xl transition-colors"
            >
              <span>Ver Servicios Terapéuticos</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Pilar 2: Escuela de Conciencia */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-white rounded-3xl border border-indigo-100 p-7 md:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Pilar Educativo y Formativo</span>
                  <h3 className="text-xl font-black text-slate-900">Escuela de Conciencia</h3>
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed text-justify [text-justify:inter-word] [text-align-last:left]">
                Espacio de formación y desarrollo humano donde transformamos el conocimiento en experiencia práctica a través de cursos, programas interactivos, talleres y herramientas de autogestión emocional.
              </p>

              <ul className="space-y-2 text-xs font-semibold text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" /> Cursos online y programas guiados</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" /> Metodologías de transformación práctica</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" /> Comunidad de aprendizaje continuo</li>
              </ul>
            </div>

            <Link
              to="/cursos"
              className="inline-flex items-center justify-between w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs px-4 py-3 rounded-xl transition-colors"
            >
              <span>Explorar Cursos y Talleres</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════
            MISIÓN Y VISIÓN
        ══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Misión */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-200/50 p-7 md:p-9 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-emerald-300/80 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-primary" />
            
            <div className="space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Nuestro Compromiso</span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">Nuestra Misión</h2>
                </div>
              </div>

              <div className="space-y-3.5 text-slate-700 text-sm md:text-base leading-relaxed text-justify [text-justify:inter-word] [text-align-last:left]">
                <p>
                  En <strong className="text-slate-900 font-bold">Conexión Luz</strong> acompañamos a las personas en su proceso de transformación personal mediante servicios terapéuticos personalizados que integran herramientas como la <span className="font-semibold text-primary">hipnosis clínica</span>, el <span className="font-semibold text-primary">hipnoanálisis</span>, la <span className="font-semibold text-primary">terapia cognitivo-conductual</span> y otras metodologías de desarrollo humano, adaptadas a las necesidades de cada consultante.
                </p>
                <p>
                  Nuestro propósito es ofrecer un espacio seguro, profesional y empático que facilite la comprensión de los patrones que afectan el bienestar emocional, fortaleciendo la capacidad de cada persona para afrontar sus desafíos, desarrollar nuevas habilidades y mejorar su calidad de vida.
                </p>
                <p className="bg-slate-50 p-4 rounded-2xl border border-slate-100 italic text-slate-600 text-xs md:text-sm">
                  "Creemos que cada proceso terapéutico es único y merece una atención cercana, ética y basada en el respeto por la historia, las necesidades y el ritmo de cada individuo."
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Acompañamiento individualizado, ético y científico</span>
            </div>
          </div>

          {/* Visión */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-200/50 p-7 md:p-9 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-indigo-300/80 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-indigo-500 to-purple-500" />
            
            <div className="space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
                  <Eye className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Nuestro Horizonte</span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">Nuestra Visión</h2>
                </div>
              </div>

              <div className="space-y-3.5 text-slate-700 text-sm md:text-base leading-relaxed text-justify [text-justify:inter-word] [text-align-last:left]">
                <p>
                  Ser un <strong className="text-slate-900 font-bold">referente nacional e internacional</strong> en el acompañamiento terapéutico integral, reconocido por promover el bienestar emocional, el desarrollo personal y la transformación consciente de las personas mediante metodologías innovadoras, fundamentadas en el respeto por la dignidad humana, la ética profesional y la mejora continua.
                </p>
                <p>
                  Aspiramos a construir una comunidad donde cada persona pueda comprender el origen de sus dificultades, desarrollar sus recursos internos y avanzar hacia una vida con mayor equilibrio, bienestar y propósito.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-indigo-700">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span>Transformación consciente con alcance global</span>
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════
            VISIÓN DE FUTURO / ECOSISTEMA INTEGRAL
        ══════════════════════════════════════════════════════════ */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 h-64 w-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -translate-x-12 translate-y-12 h-64 w-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Visión de Futuro</span>
                  <h3 className="text-xl md:text-2xl font-black text-white">Ecosistema Integral de Bienestar</h3>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4 text-sky-400" /> Educación</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Cpu className="h-4 w-4 text-indigo-400" /> Tecnología</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-emerald-400" /> Comunidad</span>
              </div>
            </div>

            <blockquote className="text-lg md:text-2xl font-medium text-slate-100 leading-relaxed text-justify [text-justify:inter-word] [text-align-last:left] italic">
              "Construir un ecosistema integral de bienestar y desarrollo humano que combine atención terapéutica, educación, tecnología e investigación para acercar herramientas de crecimiento personal a personas de habla hispana, promoviendo procesos de transformación conscientes, éticos y accesibles."
            </blockquote>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            SECCIÓN ESPECIAL: ESCUELA DE CONCIENCIA CONEXIÓN LUZ
        ══════════════════════════════════════════════════════════ */}
        <div id="escuela-de-conciencia" className="bg-gradient-to-b from-indigo-50/40 via-white to-slate-50/60 rounded-3xl border border-indigo-100 p-8 md:p-14 space-y-12 shadow-xl shadow-indigo-100/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          {/* Header Escuela */}
          <div className="space-y-5 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
              <GraduationCap className="h-4 w-4" />
              <span>Escuela de Conciencia Conexión Luz</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Propósito de la Escuela de Conciencia
            </h2>

            <div className="space-y-4 text-slate-700 text-base md:text-lg leading-relaxed text-justify [text-justify:inter-word] [text-align-last:left]">
              <p>
                La <strong className="text-slate-900 font-bold">Escuela de Conciencia Conexión Luz</strong> nace con el propósito de formar personas conscientes de sí mismas, capaces de comprender el origen de sus pensamientos, emociones y comportamientos para desarrollar una vida más libre, responsable y coherente con sus valores.
              </p>
              <p>
                Entendemos la <strong className="text-indigo-700 font-bold">conciencia</strong> como la capacidad de observar, comprender y transformar la manera en que nos relacionamos con nosotros mismos, con los demás y con nuestro entorno.
              </p>
              <p>
                Nuestra escuela busca convertir el conocimiento en experiencia práctica, promoviendo procesos de aprendizaje que integren el desarrollo emocional, el pensamiento crítico, la comunicación consciente, la responsabilidad personal y el crecimiento humano.
              </p>
              <p className="font-semibold text-slate-800 bg-white p-4 rounded-2xl border border-indigo-100 shadow-xs">
                Creemos que una sociedad cambia cuando las personas desarrollan mayor comprensión de sí mismas y utilizan ese conocimiento para construir relaciones más saludables, tomar mejores decisiones y contribuir positivamente a su comunidad.
              </p>
            </div>
          </div>

          {/* Filosofía de la Escuela Card */}
          <div className="p-7 md:p-9 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-xl border border-indigo-800/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-indigo-300">Filosofía de la Escuela</span>
            </div>

            <blockquote className="text-base md:text-xl font-serif italic text-indigo-50 leading-relaxed text-justify [text-justify:inter-word] [text-align-last:left]">
              "La verdadera transformación comienza cuando una persona deja de reaccionar automáticamente a su historia y desarrolla la capacidad de comprenderla, aprender de ella y construir, de manera consciente, nuevas formas de pensar, sentir y actuar. La conciencia no es un estado reservado para unos pocos; es una habilidad que puede cultivarse mediante el conocimiento, la reflexión, la práctica y el acompañamiento adecuado."
            </blockquote>
          </div>

          {/* 8 Principios de la Escuela */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Fundamentos Pedagógicos</span>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900">8 Principios de la Escuela de Conciencia</h3>
              <p className="text-slate-500 text-sm">Ejes rectores que articulan cada una de nuestras experiencias de formación.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {SCHOOL_PRINCIPLES.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.num}
                    className={`bg-white rounded-3xl border ${item.border} p-5 shadow-xs hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between space-y-4`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`h-10 w-10 rounded-2xl ${item.bg} border ${item.border} flex items-center justify-center ${item.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-black text-slate-300 font-mono">{item.num}</span>
                      </div>
                      <h4 className="font-black text-slate-900 text-base leading-snug">{item.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed text-justify [text-justify:inter-word] [text-align-last:left]">
                        {item.desc}
                      </p>
                    </div>
                    
                    <div className="pt-2 border-t border-slate-50 text-[10px] font-bold text-slate-400">
                      Principio de Conciencia
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ENLACE ADAPTATIVO A LOS CURSOS */}
          <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-primary to-emerald-600 p-8 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                <BookOpen className="h-3.5 w-3.5 text-emerald-300" />
                <span>Oferta Formativa y Cursos Online</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black">Aprende, cultiva y transforma tu vida</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Descubre los programas interactivos, cursos estructurados y herramientas de la Escuela de Conciencia diseñados para tu evolución personal.
              </p>
            </div>

            <Link
              to="/cursos"
              className="inline-flex items-center gap-2.5 bg-white text-slate-950 font-black px-7 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 active:scale-95 shrink-0"
            >
              <span>Explorar Cursos de la Escuela</span>
              <ArrowRight className="h-5 w-5 text-indigo-600" />
            </Link>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            POLÍTICA DE CALIDAD
        ══════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-200/50 p-8 md:p-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-100">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Compromiso Institucional</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">Política de Calidad</h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed text-justify [text-justify:inter-word] [text-align-last:left]">
                En <strong className="text-slate-900 font-bold">Conexión Luz</strong> estamos comprometidos con la prestación de servicios terapéuticos de alta calidad, orientados al bienestar integral de nuestros consultantes.
              </p>
            </div>

            <div className="shrink-0 bg-slate-50 border border-slate-150 rounded-2xl p-4 text-center">
              <span className="text-3xl font-black text-emerald-600">100%</span>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Enfoque en Calidad y Ética</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Para cumplir este compromiso nos proponemos:</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {QUALITY_POLICIES.map((policy, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-150 hover:bg-white hover:border-emerald-200 hover:shadow-sm transition-all duration-200"
                >
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                    ✓
                  </div>
                  <p className="text-xs md:text-sm font-medium text-slate-700 leading-relaxed text-justify [text-justify:inter-word] [text-align-last:left]">
                    {policy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-100 text-center">
            <p className="text-xs md:text-sm font-bold text-slate-700 leading-relaxed">
              Nuestro objetivo es generar experiencias de atención que contribuyan al crecimiento personal de quienes depositan su confianza en Conexión Luz.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            NUESTROS VALORES INSTITUCIONALES (7 VALORES)
        ══════════════════════════════════════════════════════════ */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-primary">Pilares que nos guían</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Nuestros Valores</h2>
            <p className="text-slate-500 text-sm md:text-base text-balance">
              Principios éticos e institucionales que fundamentan cada una de nuestras interacciones y procesos terapéuticos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {INSTITUTIONAL_VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className={`group bg-white rounded-3xl border ${val.border} p-6 shadow-sm hover:shadow-xl ${val.glow} transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4`}
                >
                  <div className="space-y-3">
                    <div className={`h-12 w-12 rounded-2xl ${val.bg} border ${val.border} flex items-center justify-center ${val.color} shadow-xs group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-black text-slate-900 text-lg leading-snug">{val.title}</h3>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed text-justify [text-justify:inter-word] [text-align-last:left]">
                      {val.desc}
                    </p>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>Principio Institucional</span>
                    <span className={val.color}>●</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            CTA FINAL CON LEMA Y ENLACES
        ══════════════════════════════════════════════════════════ */}
        <div className="rounded-3xl bg-gradient-to-r from-primary via-[hsl(180,75%,28%)] to-accent p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold">
              Comprender para transformar · Transformar para vivir con propósito
            </div>

            <h3 className="text-2xl md:text-3xl font-black">¿Listo para comenzar tu proceso de transformación?</h3>
            <p className="text-white/90 text-sm md:text-base leading-relaxed text-balance">
              Da el primer paso hacia una vida con mayor equilibrio, bienestar y sentido. Explora nuestra Escuela de Conciencia o agenda tu sesión con terapeutas certificados.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/agenda"
                className="inline-flex items-center gap-2 bg-white text-slate-950 font-black px-7 py-3.5 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 active:scale-95"
              >
                <span>Agendar Consulta</span>
                <ArrowRight className="h-4 w-4 text-emerald-600" />
              </Link>
              <Link
                to="/cursos"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold px-7 py-3.5 rounded-2xl border border-white/20 backdrop-blur-md transition-all"
              >
                <BookOpen className="h-4 w-4 text-emerald-300" />
                <span>Ver Cursos de la Escuela</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </PublicLayout>
  );
}
