
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
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-white to-accent/10 relative overflow-hidden">
        {/* Decorative floating shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-12 left-8 w-36 h-36 bg-primary/5 rounded-full animate-float" />
          <div className="absolute bottom-16 right-12 w-28 h-28 bg-accent/5 rounded-full animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-amber-400/5 rounded-full animate-float" style={{ animationDelay: '4s' }} />
          <div className="absolute top-1/4 right-1/3 w-14 h-14 bg-primary/5 rounded-full animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute bottom-1/3 left-[15%] w-10 h-10 bg-accent/8 rounded-full animate-float" style={{ animationDelay: '5s' }} />
          {/* Subtle gradient orbs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2.5 shadow-md border border-primary/10"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span className="text-sm font-semibold text-gray-700 tracking-wide">Excelencia Terapéutica</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              <span className="text-gray-800">Servicios que </span>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Transforman</span>
              <span className="text-gray-800"> Vidas</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
            >
              Unimos la ciencia del bienestar con un acompañamiento profundamente humano para guiarte en tu proceso de sanación y evolución personal.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
            >
              <Link
                to="/mi-perfil"
                className="bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200"
              >
                Ir a mi perfil
              </Link>
              <Link
                to="/agenda"
                className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                Agendar cita
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap items-center justify-center gap-6 md:gap-10 pt-6"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{services.length || '—'}</span>
                <span className="text-xs md:text-sm text-gray-500 font-medium">Servicios disponibles</span>
              </div>
              <div className="w-px h-10 bg-gray-200 hidden sm:block" />
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">100%</span>
                <span className="text-xs md:text-sm text-gray-500 font-medium">Personalizado</span>
              </div>
              <div className="w-px h-10 bg-gray-200 hidden sm:block" />
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Online</span>
                <span className="text-xs md:text-sm text-gray-500 font-medium">& Presencial</span>
              </div>
            </motion.div>
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



    </PublicLayout>
  );
};

export default ServicesPage;
