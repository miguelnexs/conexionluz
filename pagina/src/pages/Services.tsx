
import React from 'react';
import PublicLayout from '../components/PublicLayout';
import { Brain, Heart, Users, Shield, Zap, Smile, Sparkles, Sun } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useServices } from '../hooks/useServices';
import type { Service } from '@/types/models';

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
    // Redirigir a la agenda con el servicio específico
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
        <div className="py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando servicios...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout contentClassName="p-0">
      
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/10 via-white to-accent/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-16 w-24 h-24 bg-accent/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Nuestros Servicios
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Descubre nuestra amplia gama de servicios terapéuticos diseñados específicamente para tu bienestar mental y emocional
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
            {services.map((service: Service, index: number) => {
              const IconComponent = iconMap[service.title] || Brain;
              const includes = splitLines(service.includes);
              const benefits = splitLines(service.benefits);
              
              return (
                <div 
                  key={service.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 p-8 border border-gray-100 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Price and Duration */}
                  <div className="flex justify-between items-center mb-4 text-sm">
                    <span className="text-primary font-semibold">
                      {service.priceCOP > 0 ? `$${service.priceCOP.toLocaleString()}` : 'Consultar'}
                    </span>
                    <span className="text-gray-500">
                      {typeof service.durationMinutes === 'number' && service.durationMinutes > 0 ? `${service.durationMinutes} minutos` : 'Duración a confirmar'}
                    </span>
                  </div>

                  {service.modality ? (
                    <div className="text-sm text-gray-500 mb-4">
                      Modalidad: <span className="font-semibold text-gray-700">{service.modality}</span>
                    </div>
                  ) : null}

                  {includes.length ? (
                    <div className="mb-5">
                      <div className="text-sm font-semibold text-gray-800 mb-2">Incluye</div>
                      <ul className="space-y-2">
                        {includes.slice(0, 6).map((line, i) => (
                          <li key={i} className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {benefits.length ? (
                    <div className="mb-6">
                      <div className="text-sm font-semibold text-gray-800 mb-2">Beneficios</div>
                      <ul className="space-y-2">
                        {benefits.slice(0, 6).map((line, i) => (
                          <li key={i} className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* CTA */}
                  <button 
                    onClick={() => handleServiceClick(service)}
                    className="w-full bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 py-3 rounded-xl font-medium hover:from-primary hover:to-accent hover:text-white transition-all duration-300 transform hover:scale-105"
                  >
                    Agendar Consulta
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 text-center animate-fade-in">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para Comenzar tu Viaje de Sanación?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Da el primer paso y agenda una consulta. Nuestro equipo está aquí para acompañarte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/agenda"
              className="bg-white text-primary px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Agenda tu Primera Consulta
            </Link>
            <Link 
              to="/contacto"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary transition-all duration-300"
            >
              Consulta Gratuita
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
};

export default ServicesPage;
