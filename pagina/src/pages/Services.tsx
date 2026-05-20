
import React from 'react';
import PublicLayout from '../components/PublicLayout';
import { 
  Brain, 
  Heart, 
  Users, 
  Shield, 
  Zap, 
  Smile, 
  Sparkles, 
  Sun, 
  CheckCircle2, 
  ArrowRight, 
  Star,
  Clock,
  MapPin,
  Calendar
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useServices } from '../hooks/useServices';
import type { Service } from '@/types/models';
import { motion } from 'framer-motion';

const ServicesPage = () => {
  const navigate = useNavigate();
  const { data: services = [], isLoading } = useServices();

  const iconMap: Record<string, React.ElementType> = {
    'Terapia Individual': Brain,
    'Hipnosis Clínica': Sparkles,
    'Hipnoanálisis': Brain,
    'Conexión Humano Luz': Sun,
    'Terapia de Pareja': Heart,
    'Terapia Familiar': Users,
    'Trauma y PTSD': Shield,
    'Coaching de Vida': Zap,
    'Bienestar Mental': Smile
  };

  const handleServiceClick = (service: Service) => {
    navigate(`/agenda?service=${service.id}&serviceName=${encodeURIComponent(service.title)}`);
  };

  const splitLines = (value?: string) =>
    (value || '')
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean);

  if (isLoading) {
    return (
      <PublicLayout contentClassName="p-0">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="space-y-4 text-center">
            <div className="relative">
               <div className="h-24 w-24 rounded-3xl border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
               <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary animate-pulse" />
            </div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Preparando Experiencias...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout contentClassName="p-0">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-white">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/2 -right-24 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-black uppercase tracking-widest text-primary">Excelencia Terapéutica</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight"
            >
              Servicios que <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Transforman</span> Vidas
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto"
            >
              Unimos la ciencia del bienestar con un acompañamiento profundamente humano para guiarte en tu proceso de sanación y evolución personal.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {services.map((service: Service, index: number) => {
              const IconComponent = iconMap[service.title] || Brain;
              const includes = splitLines(service.includes);
              const benefits = splitLines(service.benefits);
              
              return (
                <motion.div 
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative h-full"
                >
                  <div className="relative h-full bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 flex flex-col">
                    
                    {/* Top decoration */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Icon & Category */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-primary/5 group-hover:scale-110 transition-transform duration-500">
                        <IconComponent className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-500" />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Inversión</span>
                        <span className="text-lg font-black text-gray-900">
                          {service.priceCOP > 0 ? `$${service.priceCOP.toLocaleString()}` : 'Consulta'}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-4 flex-1">
                      <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors leading-tight">
                        {service.title}
                      </h3>
                      
                      {service.descriptionHtml ? (
                        <div 
                          className="prose prose-sm dark:prose-invert max-w-none text-gray-500 line-clamp-4"
                          dangerouslySetInnerHTML={{ __html: service.descriptionHtml }}
                        />
                      ) : (
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-4">
                          {service.description}
                        </p>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-50 my-6">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                          <Clock className="h-4 w-4 text-amber-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">Duración</span>
                          <span className="text-xs font-bold text-gray-700">
                            {service.durationMinutes ? `${service.durationMinutes} min` : '60 min'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <MapPin className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">Modalidad</span>
                          <span className="text-xs font-bold text-gray-700">
                            {service.modality || 'Online / Presencial'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Features Snippet */}
                    {(benefits.length > 0 || includes.length > 0) && (
                      <div className="mb-8 space-y-3">
                         {(benefits.slice(0, 2)).map((b, i) => (
                           <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                             <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                             <span className="font-medium">{b}</span>
                           </div>
                         ))}
                      </div>
                    )}

                    {/* Action */}
                    <button 
                      onClick={() => handleServiceClick(service)}
                      className="w-full h-14 bg-gray-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all duration-300 hover:bg-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 group/btn"
                    >
                      Agendar Ahora
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                  Un Enfoque Diferente para una <span className="text-primary">Nueva Vida</span>
                </h2>
                <p className="text-lg text-gray-500 leading-relaxed">
                  En ConexiónLuz no solo tratamos síntomas; buscamos el origen emocional y energético para lograr una transformación duradera y profunda.
                </p>
              </div>

              <div className="grid gap-6">
                {[
                  { title: 'Excelencia Clínica', desc: 'Metodologías probadas y actualización constante.', icon: Star, color: 'bg-amber-100 text-amber-600' },
                  { title: 'Enfoque Holístico', desc: 'Vemos al ser humano en su totalidad: mente, cuerpo y luz.', icon: Sun, color: 'bg-primary/10 text-primary' },
                  { title: 'Espacio Seguro', desc: 'Privacidad absoluta y un entorno libre de juicios.', icon: Shield, color: 'bg-emerald-100 text-emerald-600' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-6 rounded-[2rem] border border-gray-50 bg-gray-50/30 hover:bg-white hover:shadow-xl transition-all group">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${item.color} group-hover:scale-110 transition-transform`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 relative">
               <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                 <img 
                   src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800" 
                   alt="Bienestar" 
                   className="w-full h-auto object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                 
                 {/* Floating badge */}
                 <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl flex items-center gap-4 animate-float">
                   <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0">
                     <Heart className="h-6 w-6" />
                   </div>
                   <div>
                     <p className="text-sm font-black text-gray-900">+1000 Pacientes</p>
                     <p className="text-xs text-gray-500">Han transformado su vida con nosotros.</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary rounded-full blur-[200px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent rounded-full blur-[200px]" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10 space-y-10">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
              ¿Listo para tu <span className="text-primary">Evolución</span>?
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              El primer paso es el más valiente. Estamos aquí para guiarte en cada etapa de tu camino hacia la plenitud.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={() => navigate('/agenda')}
              className="h-16 px-10 bg-primary text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center gap-3"
            >
              <Calendar className="h-5 w-5" />
              Agendar Sesión
            </button>
            <button 
              onClick={() => navigate('/contacto')}
              className="h-16 px-10 border-2 border-white/10 text-white rounded-2xl font-black text-lg hover:bg-white hover:text-gray-900 transition-all flex items-center gap-3"
            >
              Consultar Dudas
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
};

export default ServicesPage;
