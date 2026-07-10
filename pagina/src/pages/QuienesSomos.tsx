import React from 'react';
import PublicLayout from '@/components/PublicLayout';
import { Building2, Heart, Target, Eye, Sparkles, Users, Award, ChevronRight, Star, Leaf, Sun, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const VALUES = [
  {
    icon: Heart,
    color: '#ec4899',
    title: 'Empatía',
    desc: 'Escuchamos desde el corazón, sin juicios. Cada persona es única y merece ser comprendida en su totalidad.',
  },
  {
    icon: Leaf,
    color: '#10b981',
    title: 'Bienestar Integral',
    desc: 'Abordamos la salud mental desde una perspectiva de conciencia integral: cuerpo, mente, emociones y espíritu.',
  },
  {
    icon: Globe,
    color: '#6366f1',
    title: 'Accesibilidad',
    desc: 'Creemos que el apoyo psicológico debe estar al alcance de todos, sin importar su situación.',
  },
  {
    icon: Star,
    color: '#f59e0b',
    title: 'Excelencia',
    desc: 'Nuestros profesionales están certificados y en constante formación para ofrecerte lo mejor.',
  },
  {
    icon: Sun,
    color: '#f97316',
    title: 'Esperanza',
    desc: 'Creemos en la capacidad de transformación de cada persona. Siempre hay un camino hacia la luz.',
  },
  {
    icon: Users,
    color: '#0ea5e9',
    title: 'Comunidad',
    desc: 'Construimos espacios seguros donde las personas se sienten acompañadas y no juzgadas.',
  },
];

const TEAM = [
  {
    name: 'Dra. Valentina Ríos',
    role: 'Fundadora & Directora',
    specialty: 'Psicología Clínica · Terapia Humanista',
    years: '12 años de experiencia',
    color: '#6366f1',
    initials: 'VR',
  },
  {
    name: 'Mg. Carlos Montoya',
    role: 'Terapeuta Senior',
    specialty: 'Mindfulness · TCC · Trauma',
    years: '8 años de experiencia',
    color: '#10b981',
    initials: 'CM',
  },
  {
    name: 'Ps. Alejandra Vargas',
    role: 'Especialista en Ansiedad',
    specialty: 'Terapia de Aceptación · ACT',
    years: '6 años de experiencia',
    color: '#ec4899',
    initials: 'AV',
  },
  {
    name: 'Mg. Daniel Herrera',
    role: 'Psicólogo Educativo',
    specialty: 'Adolescentes · Familia · Crianza',
    years: '9 años de experiencia',
    color: '#f59e0b',
    initials: 'DH',
  },
];

const MILESTONES = [
  { year: '2018', label: 'Fundación', desc: 'ConexiónLuz nace con la misión de democratizar la salud mental.' },
  { year: '2019', label: 'Primer Centro', desc: 'Abrimos nuestro primer espacio de atención presencial.' },
  { year: '2021', label: 'Plataforma Digital', desc: 'Lanzamos nuestra plataforma online para llegar a más personas.' },
  { year: '2023', label: '+2.000 pacientes', desc: 'Alcanzamos a más de 2.000 personas en su proceso de bienestar.' },
  { year: '2024', label: 'Comunidad', desc: 'Creamos foros, conversatorios y recursos de libre acceso.' },
  { year: '2025', label: 'Actividades', desc: 'Incorporamos herramientas interactivas de autogestión emocional.' },
];

export default function QuienesSomosPage() {
  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl mb-12 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 p-8 md:p-14 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '45px 45px' }} />
          <div className="absolute -bottom-10 -right-10 h-48 w-48 bg-white/5 rounded-full" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-bold">Sobre ConexiónLuz</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
              Somos tu compañía en el camino hacia la salud mental
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Nacimos con una convicción: toda persona merece acceso a apoyo psicológico de calidad, sin estigmas y con calidez humana.
            </p>
            <div className="flex flex-wrap gap-6 mt-8">
              {[['2.000+', 'Personas atendidas'], ['15+', 'Terapeutas'], ['7', 'Años de trayectoria']].map(([v, l]) => (
                <div key={v}>
                  <div className="text-3xl font-black">{v}</div>
                  <div className="text-white/60 text-sm">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Misión, Visión, Propósito */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {[
            { icon: Target, color: '#6366f1', title: 'Misión', text: 'Brindar acompañamiento psicológico profesional, cálido y accesible a toda persona que busque mejorar su bienestar emocional y mental.' },
            { icon: Eye, color: '#10b981', title: 'Visión', text: 'Ser la plataforma de referencia en salud mental y expansión de conciencia en Latinoamérica, integrando lo clínico con lo humano y lo digital con lo presencial.' },
            { icon: Sparkles, color: '#ec4899', title: 'Propósito', text: 'Encender la luz interior de cada persona, acompañándola con herramientas, comunidad y profesionales comprometidos con su transformación.' },
          ].map(({ icon: Icon, color, title, text }) => (
            <div key={title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${color}12` }}>
                <Icon className="h-6 w-6" style={{ color }} />
              </div>
              <h3 className="font-black text-slate-800 text-lg mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-sky-500">Nuestros pilares</span>
            <h2 className="text-3xl font-black text-slate-800 mt-2">Valores que nos guían</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {VALUES.map(v => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${v.color}12` }}>
                    <Icon className="h-5 w-5" style={{ color: v.color }} />
                  </div>
                  <h4 className="font-black text-slate-800 mb-1">{v.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-sky-500">Nuestra historia</span>
            <h2 className="text-3xl font-black text-slate-800 mt-2">El camino recorrido</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-200 via-indigo-200 to-pink-200 hidden md:block" />
            <div className="space-y-6">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className="flex gap-4 md:gap-8 items-start">
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="h-16 w-16 rounded-2xl flex flex-col items-center justify-center font-black text-white shadow-lg text-sm"
                      style={{ background: `hsl(${210 + i * 25}, 80%, 55%)` }}>
                      {m.year}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex-1 hover:shadow-md transition-shadow">
                    <div className="font-black text-slate-800">{m.label}</div>
                    <p className="text-sm text-slate-500 mt-1">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-sky-500">Nuestro equipo</span>
            <h2 className="text-3xl font-black text-slate-800 mt-2">Las personas detrás de ConexiónLuz</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map(member => (
              <div key={member.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-3 text-white text-xl font-black shadow-md"
                  style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}cc)` }}>
                  {member.initials}
                </div>
                <h4 className="font-black text-slate-800 text-sm leading-tight">{member.name}</h4>
                <p className="text-xs font-bold mt-0.5" style={{ color: member.color }}>{member.role}</p>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{member.specialty}</p>
                <div className="mt-3 inline-flex items-center gap-1 bg-slate-50 rounded-full px-2.5 py-1">
                  <Award className="h-3 w-3 text-slate-400" />
                  <span className="text-[10px] text-slate-400 font-bold">{member.years}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-black mb-2">¿Listo para comenzar?</h3>
          <p className="text-white/80 mb-5 text-sm">Da el primer paso hacia tu bienestar. Nuestro equipo está aquí para acompañarte.</p>
          <Link to="/agenda" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-black px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            Agendar consulta <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </PublicLayout>
  );
}
