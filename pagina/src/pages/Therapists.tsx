import React from 'react';
import PublicLayout from '../components/PublicLayout';
import TherapistCard from '../components/TherapistCard';
import { useTherapists } from '../hooks/useTherapists';
import type { Therapist } from '@/types/models';

const TherapistsPage = () => {
  const { data: therapists = [], isLoading, error } = useTherapists();

  if (isLoading) {
    return (
      <PublicLayout contentClassName="p-0">
        <div className="py-20 bg-slate-50 min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-sm font-bold text-slate-600">Cargando profesionales...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout contentClassName="p-0">
        <div className="py-20 bg-slate-50 min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-base font-bold text-rose-600">No se pudieron cargar los profesionales en este momento.</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout contentClassName="p-0">
      
      {/* ─── Therapists Main Section ─── */}
      <section className="py-16 md:py-20 bg-slate-50/60 min-h-[70vh]">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-3.5 py-1 rounded-full shadow-sm">
              🌿 NUESTRO EQUIPO
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Conoce a Nuestros Terapeutas
            </h1>
            <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
              Explora sus perfiles en la comunidad, conoce su trayectoria o agenda tu consulta de servicio personalizada.
            </p>
          </div>

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
        </div>
      </section>

    </PublicLayout>
  );
};

export default TherapistsPage;
