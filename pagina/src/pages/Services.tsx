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
  Calendar,
  Leaf,
  Feather,
  Activity,
  Compass,
  Flame,
  Flower2,
  X,
  Globe
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useServices } from '../hooks/useServices';
import type { Service } from '@/types/models';
import { motion, AnimatePresence } from 'framer-motion';

import { getLumiPriceForService } from '@/utils/lumiPricing';

const ServiceCard = ({ service, index, iconMap, fallbackIcons, onOpen, onSchedule }: any) => {
  const IconComponent = iconMap[service.title] || fallbackIcons[index % fallbackIcons.length];
  const lumiPrice = getLumiPriceForService(service.priceCOP);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative h-full"
    >
      <div className="relative h-full bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 flex flex-col">
        
        {/* Top decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="cursor-pointer flex-1 flex flex-col" onClick={onOpen}>
          {/* Icon & Category */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-primary/5 group-hover:scale-110 transition-transform duration-500">
              <IconComponent className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-500" />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1 flex items-center gap-1 border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-600" /> Tarifa Lumi
              </span>
              <div className="text-right">
                <span className="text-xl font-black text-slate-900 flex items-center gap-1 justify-end">
                  ✨ {lumiPrice > 0 ? lumiPrice.toLocaleString('es-CO') : 'Consulta'} <span className="text-xs text-emerald-700 font-extrabold">Lumis</span>
                </span>
                {service.priceCOP > 0 && (
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    (${service.priceCOP.toLocaleString('es-CO')} COP)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-3 flex-1 flex flex-col min-h-0">
            <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors leading-tight shrink-0">
              {service.title}
            </h3>
            
            <div className="flex-1">
              <div className="line-clamp-3 text-gray-500 text-sm leading-relaxed">
                {service.descriptionHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: service.descriptionHtml.replace(/<[^>]*>?/gm, '') }} />
                ) : (
                  service.description
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
          <button 
            onClick={onOpen}
            className="text-gray-500 hover:text-primary font-bold text-sm transition-colors flex items-center gap-1"
          >
            Ver más
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSchedule(service);
            }}
            className="flex-1 bg-gray-900 hover:bg-primary text-white text-sm font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 group/book"
          >
            Agendar Ahora
            <ArrowRight className="h-4 w-4 group-hover/book:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ServicesPage = () => {
  const navigate = useNavigate();
  const { data: services = [], isLoading } = useServices();
  const [selectedService, setSelectedService] = React.useState<Service | null>(null);

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

  const fallbackIcons = [
    Feather,
    Leaf,
    Activity,
    Compass,
    Flame,
    Flower2,
    Star,
    Smile,
    Zap,
    Heart
  ];

  const handleServiceClick = (service: Service) => {
    navigate(`/agenda?service=${service.id}&serviceName=${encodeURIComponent(service.title)}`);
  };

  const splitLines = (value?: string) => {
    if (!value) return [];
    return value
      .split(/[\n•]/)
      .map((x) => x.trim())
      .filter(Boolean);
  };

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

  // Pre-calculate Modal data if there's a selected service
  const selectedIcon = selectedService ? (iconMap[selectedService.title] || fallbackIcons[services.indexOf(selectedService) % fallbackIcons.length]) : null;
  const modalIncludes = selectedService ? splitLines(selectedService.includes) : [];
  const modalBenefits = selectedService ? splitLines(selectedService.benefits) : [];

  return (
    <PublicLayout contentClassName="p-0">
      
      {/* Header & Statistics Section */}
      <section className="pt-16 pb-12 bg-white relative overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-12">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
              Catálogo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Servicios</span>
            </h1>
            <p className="mt-4 text-gray-500 text-lg max-w-2xl">
              Explora nuestras terapias y enfoques diseñados para tu bienestar integral.
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">100%</div>
              <div className="text-sm font-semibold text-gray-500">Acompañamiento Humano</div>
            </div>

            <div className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 hover:shadow-lg hover:shadow-accent/5 hover:border-accent/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="h-6 w-6 text-accent" />
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">+15</div>
              <div className="text-sm font-semibold text-gray-500">Enfoques Terapéuticos</div>
            </div>

            <div className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 hover:shadow-lg hover:shadow-amber-500/5 hover:border-amber-500/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-amber-600" />
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">100%</div>
              <div className="text-sm font-semibold text-gray-500">Espacio Seguro</div>
            </div>

            <div className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-gray-900 mb-2">Flexible</div>
              <div className="text-sm font-semibold text-gray-500">Online & Presencial</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {services.map((service: Service, index: number) => (
              <ServiceCard 
                key={service.id}
                service={service} 
                index={index} 
                iconMap={iconMap} 
                fallbackIcons={fallbackIcons} 
                onOpen={() => setSelectedService(service)}
                onSchedule={handleServiceClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Service Modal */}
      <AnimatePresence>
        {selectedService && selectedIcon && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-md"
            />
            
            {/* Modal Container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[95vh]"
              >
                {/* Modal Header */}
                <div className="relative p-8 md:p-12 bg-gradient-to-br from-primary/10 via-white to-accent/5 shrink-0 border-b border-gray-100 overflow-hidden">
                  {/* Decorative blobs in header */}
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                  <button 
                    onClick={() => setSelectedService(null)}
                    className="absolute top-6 right-6 p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-gray-900 shadow-sm hover:shadow-md transition-all z-10"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 relative z-10 pr-12">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-[2rem] bg-white flex items-center justify-center border border-primary/15 shadow-xl shadow-primary/5 shrink-0">
                      {React.createElement(selectedIcon, { className: "h-12 w-12 md:h-14 md:w-14 text-primary" })}
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
                        {selectedService.title}
                      </h2>
                      <div className="inline-flex items-center gap-3 bg-emerald-50/80 px-5 py-2.5 rounded-full border border-emerald-200/80 backdrop-blur-sm">
                        <span className="text-xs font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Tarifa en Lumis
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-xl font-black text-slate-900">
                          ✨ {getLumiPriceForService(selectedService.priceCOP).toLocaleString('es-CO')} Lumis
                        </span>
                        {selectedService.priceCOP > 0 && (
                          <span className="text-xs font-semibold text-slate-500 border-l border-slate-200 pl-3">
                            ${selectedService.priceCOP.toLocaleString('es-CO')} COP
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="flex flex-col lg:flex-row overflow-y-auto custom-scrollbar flex-1 bg-white">
                  
                  {/* Left Column: Description & Meta */}
                  <div className="flex-1 p-8 md:p-12 lg:border-r border-gray-100">
                    
                    {/* Meta info */}
                    <div className="grid grid-cols-2 gap-4 md:gap-8 mb-12">
                      <div className="flex items-center gap-4 md:gap-5 bg-amber-50/40 p-6 rounded-[2rem] border border-amber-100/50">
                        <div className="h-14 w-14 rounded-2xl bg-amber-100/80 flex items-center justify-center shrink-0">
                          <Clock className="h-7 w-7 text-amber-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-1">Duración</span>
                          <span className="text-lg font-bold text-gray-800">
                            {selectedService.durationMinutes ? `${selectedService.durationMinutes} minutos` : '60 minutos'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 md:gap-5 bg-emerald-50/40 p-6 rounded-[2rem] border border-emerald-100/50">
                        <div className="h-14 w-14 rounded-2xl bg-emerald-100/80 flex items-center justify-center shrink-0">
                          <MapPin className="h-7 w-7 text-emerald-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-1">Modalidad</span>
                          <span className="text-lg font-bold text-gray-800">
                            {selectedService.modality || 'Online / Presencial'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Full Description */}
                    <div>
                      <h3 className="text-base font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                        <Star className="h-5 w-5 text-primary" />
                        Acerca de este servicio
                      </h3>
                      {selectedService.descriptionHtml ? (
                        <div 
                          className="prose prose-lg dark:prose-invert max-w-none text-gray-600 leading-relaxed prose-p:mb-5"
                          dangerouslySetInnerHTML={{ __html: selectedService.descriptionHtml }}
                        />
                      ) : (
                        <p className="text-gray-600 text-lg leading-relaxed">
                          {selectedService.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Features Sidebar */}
                  {(modalBenefits.length > 0 || modalIncludes.length > 0) && (
                    <div className="w-full lg:w-[450px] xl:w-[500px] p-8 md:p-12 shrink-0">
                      <div className="space-y-12">
                        {modalBenefits.length > 0 && (
                          <div className="space-y-6">
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-3 border-b border-gray-100 pb-4">
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                              Beneficios
                            </h4>
                            <div className="space-y-5">
                              {modalBenefits.map((b: string, i: number) => (
                                <div key={`modal-b-${i}`} className="flex items-start gap-4 text-base text-gray-600">
                                  <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2.5 opacity-60" />
                                  <span className="font-medium leading-relaxed">{b}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {modalIncludes.length > 0 && (
                          <div className="space-y-6">
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-3 border-b border-gray-100 pb-4">
                              <Sparkles className="h-5 w-5 text-accent" />
                              Lo que incluye
                            </h4>
                            <div className="space-y-5">
                              {modalIncludes.map((inc: string, i: number) => (
                                <div key={`modal-i-${i}`} className="flex items-start gap-4 text-base text-gray-600">
                                  <div className="h-2 w-2 rounded-full bg-accent shrink-0 mt-2.5 opacity-60" />
                                  <span className="font-medium leading-relaxed">{inc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <p className="text-base text-gray-500 hidden sm:block font-medium">
                    Da el primer paso hacia tu bienestar.
                  </p>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button 
                      onClick={() => setSelectedService(null)}
                      className="px-8 py-4 text-base font-bold text-gray-500 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-100 rounded-2xl transition-all w-full sm:w-auto"
                    >
                      Cerrar
                    </button>
                    <button 
                      onClick={() => handleServiceClick(selectedService)}
                      className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:bg-primary hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-1 group/btn w-full sm:w-auto"
                    >
                      Agendar Ahora
                      <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </PublicLayout>
  );
};

export default ServicesPage;
