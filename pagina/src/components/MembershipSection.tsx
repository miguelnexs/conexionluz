import React from 'react';
import { Crown, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MembershipSection = () => {
  return (
    <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="stagger-animation">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 text-sm text-amber-300 font-medium mb-6">
                <Crown className="h-4 w-4" />
                Membresía Exclusiva
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Tu bienestar merece un <br />
                <span className="text-amber-400">compromiso real</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Únete a nuestra membresía mensual y accede a un proceso continuo de sanación y crecimiento. 
                Diseñada para quienes buscan resultados profundos y duraderos.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  'Sesiones individuales mensuales',
                  'Acceso prioritario a talleres',
                  'Contenido exclusivo de meditación',
                  'Descuentos en cursos premium'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="h-5 w-5 text-amber-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/membresia"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-amber-500/20 transform hover:scale-105 transition-all duration-300"
              >
                Ver planes de membresía
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Visual/Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-violet-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden">
                <div className="absolute top-0 right-0 p-6">
                  <Crown className="h-24 w-24 text-white/5" />
                </div>
                
                <div className="space-y-6">
                  <div className="h-1.5 w-20 bg-amber-500 rounded-full" />
                  <h3 className="text-2xl font-bold">Plan Bienestar Total</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">$280.000</span>
                    <span className="text-slate-400">/mes</span>
                  </div>
                  <p className="text-slate-400">Nuestro plan más popular para una transformación integral.</p>
                  
                  <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center mb-2 text-sm font-medium">
                      <span>Progreso de sanación</span>
                      <span className="text-amber-400">92%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 w-[92%] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;
