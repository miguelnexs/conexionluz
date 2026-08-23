import React from 'react';
import TherapistCard from './TherapistCard';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTherapists } from '../hooks/useTherapists';
import type { Therapist } from '@/types/models';

const Therapists = () => {
  const { data: therapists = [], isLoading } = useTherapists();

  if (isLoading) {
    return (
      <section id="terapeutas" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-sm font-bold text-slate-600">Cargando terapeutas...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="terapeutas" className="py-20 bg-slate-50/60 border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-3.5 py-1 rounded-full shadow-sm">
            🌿 NUESTRO EQUIPO
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Conoce a Nuestros Terapeutas
          </h2>
          <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
            Explora sus perfiles en la comunidad, conoce su trayectoria o agenda tu consulta de servicio personalizada.
          </p>
        </div>

        {/* Therapists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {therapists.map((therapist: Therapist) => (
            <div key={therapist.id}>
              <TherapistCard 
                id={therapist.id}
                name={therapist.name}
                specialty={therapist.specialty}
                image={therapist.image_url}
                rating={therapist.rating}
                experience={therapist.years_experience > 0 ? `${therapist.years_experience} años de experiencia` : ''}
                description={therapist.description}
                certifications={therapist.certifications || []}
                cvUrl={therapist.cv_url}
              />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm max-w-2xl mx-auto space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-slate-900">
              ¿Deseas orientación personalizada para tu proceso?
            </h3>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Nuestro equipo de orientación te escuchará para recomendarte el servicio o facilitador ideal según tus objetivos.
            </p>
            <div className="pt-2">
              <Link 
                to="/contacto"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md hover:scale-105 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>Recibir Orientación Gratuita</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Therapists;
