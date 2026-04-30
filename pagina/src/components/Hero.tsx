
import React from 'react';
import { Sparkles, Heart, Shield, ArrowRight, Star, Clock, Users, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <>
      {/* ── HERO ── */}
      <section id="inicio" className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-amber-50 animate-gradient opacity-70"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float"></div>
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-accent/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-16 w-12 h-12 bg-amber-400/10 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-10 h-10 bg-primary/5 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-14 h-14 bg-accent/5 rounded-full animate-float" style={{ animationDelay: '5s' }}></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto stagger-animation">

            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg border border-white/40">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-gray-700">Tu bienestar emocional comienza aquí</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-amber-500 bg-clip-text text-transparent">
                Mereces sentirte
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-500 via-primary to-accent bg-clip-text text-transparent">
                bien contigo
              </span>
            </h1>

            {/* Subheading – emotional, empathetic */}
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              No tienes que caminar solo. Te acompañamos con terapia y asesoría, 
              <span className="text-primary font-medium"> calidez humana</span> y un espacio seguro para sanar, crecer y reconectar con tu luz interior.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14">
              <Link
                to="/agenda"
                className="group bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 group-hover:animate-pulse" />
                  <span>Agenda tu primera sesión</span>
                  <ArrowRight className="h-4 w-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                </span>
              </Link>

              <Link
                to="/terapeutas"
                className="group bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200 hover:border-primary/30"
              >
                Conoce al equipo
              </Link>
            </div>

            {/* Stats – datos reales y relevantes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-5 shadow-sm border border-white/50 group hover:shadow-md transition-all">
                <div className="text-3xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform duration-300">500+</div>
                <div className="text-sm text-gray-600">Vidas transformadas</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-5 shadow-sm border border-white/50 group hover:shadow-md transition-all">
                <div className="text-3xl font-bold text-accent mb-1 group-hover:scale-110 transition-transform duration-300">10+</div>
                <div className="text-sm text-gray-600">Años de experiencia</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-5 shadow-sm border border-white/50 group hover:shadow-md transition-all">
                <div className="text-3xl font-bold text-amber-500 mb-1 group-hover:scale-110 transition-transform duration-300">98%</div>
                <div className="text-sm text-gray-600">Pacientes satisfechos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── POR QUÉ ELEGIRNOS ── */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-green-50/50 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-2 rounded-full mb-4">
                <Leaf className="h-3.5 w-3.5" />
                ¿Por qué ConexiónLuz?
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Un espacio donde tu bienestar es la prioridad
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Cada persona merece un acompañamiento con respeto, empatía y profesionalismo. Así es como lo hacemos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Espacio seguro',
                  desc: 'Confidencialidad absoluta y un entorno libre de juicios donde puedes ser tú mismo.',
                  color: 'text-primary',
                  bg: 'bg-primary/10',
                },
                {
                  icon: Heart,
                  title: 'Terapia con calidez',
                  desc: 'Profesionales que combinan ciencia con sensibilidad humana para acompañarte en cada paso.',
                  color: 'text-rose-500',
                  bg: 'bg-rose-500/10',
                },
                {
                  icon: Clock,
                  title: 'A tu ritmo',
                  desc: 'Sesiones flexibles presenciales u online. Tu proceso, tu tiempo, tu comodidad.',
                  color: 'text-amber-500',
                  bg: 'bg-amber-500/10',
                },
                {
                  icon: Users,
                  title: 'Comunidad',
                  desc: 'Talleres, foros y grupos de apoyo para que sientas que no estás solo en tu camino.',
                  color: 'text-accent',
                  bg: 'bg-accent/10',
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group animate-fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIO DESTACADO ── */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-white to-accent/5 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary/5 rounded-full animate-float" />
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-accent/5 rounded-full animate-float" style={{ animationDelay: '3s' }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed mb-8 italic">
              "Llegar a ConexiónLuz fue un punto de inflexión. Por primera vez sentí que alguien realmente me escuchaba sin juzgarme. Hoy puedo decir que volví a confiar en mí."
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">MC</div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">María C.</p>
                <p className="text-xs text-gray-500">Paciente desde 2024</p>
              </div>
            </div>
            <div className="mt-10">
              <Link
                to="/testimonios"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline transition-colors"
              >
                Ver más testimonios
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-accent rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tu primer paso puede cambiar todo
              </h2>
              <p className="text-white/85 text-lg mb-8 max-w-2xl mx-auto">
                No necesitas tener todo claro para empezar. Solo necesitas querer sentirte mejor. Estamos aquí para ti.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/agenda"
                  className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Heart className="h-5 w-5" />
                  Agendar mi cita
                </Link>
                <Link
                  to="/servicios"
                  className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/25 hover:bg-white/25 transform hover:scale-105 transition-all duration-300"
                >
                  Explorar servicios
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
