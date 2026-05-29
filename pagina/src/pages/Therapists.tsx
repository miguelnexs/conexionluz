
import React from 'react';
import PublicLayout from '../components/PublicLayout';
import TherapistCard from '../components/TherapistCard';
import { Users, Award, Heart, Brain, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTherapists } from '../hooks/useTherapists';
import type { Therapist } from '@/types/models';

const TherapistsPage = () => {
  const { data: therapists = [], isLoading, error } = useTherapists();



  if (isLoading) {
    return (
      <PublicLayout contentClassName="p-0">
        <div className="py-12 bg-gradient-to-br from-primary/10 via-white to-accent/10">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Cargando terapeutas...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout contentClassName="p-0">
        <div className="py-12 bg-gradient-to-br from-primary/10 via-white to-accent/10">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xl text-red-600">Error al cargar los terapeutas</p>
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
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-amber-400/5 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Nuestros Terapeutas
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Conoce a nuestro equipo de profesionales certificados, comprometidos con tu bienestar y crecimiento personal
            </p>
          </div>
        </div>
      </section>



      {/* Therapists Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Conoce a Nuestro Equipo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cada uno de nuestros terapeutas está especializado en diferentes áreas para brindarte la mejor atención
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
            {therapists.map((therapist: Therapist, index: number) => (
              <div key={therapist.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <TherapistCard 
                  id={therapist.id}
                  name={therapist.name}
                  specialty={therapist.specialty}
                  image={therapist.image_url}
                  rating={therapist.rating}
                  experience={therapist.years_experience > 0 ? `${therapist.years_experience} años de experiencia` : ''}
                  description={therapist.description}
                  certifications={therapist.certifications || []}
                  priceFrom={therapist.price_from}
                  sessionDuration={therapist.session_duration}
                  cvUrl={therapist.cv_url}
                />
              </div>
            ))}
          </div>
        </div>
      </section>



    </PublicLayout>
  );
};

export default TherapistsPage;
