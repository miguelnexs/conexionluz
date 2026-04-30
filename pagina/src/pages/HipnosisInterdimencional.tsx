import React from 'react';
import PublicLayout from '../components/PublicLayout';
import { Brain, ShieldCheck, Sparkles, Video, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const getPurchaseKey = (slug: string) => `conexionluz:purchased:${slug}`;

const HipnosisInterdimencionalPage = () => {
  const hasAccess =
    typeof window !== 'undefined' &&
    localStorage.getItem(getPurchaseKey('hipnosis-interdimencional')) === '1';

  return (
    <PublicLayout contentClassName="p-0">
      <section className="py-12 bg-gradient-to-br from-primary/10 via-white to-accent/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-16 w-24 h-24 bg-accent/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-amber-400/5 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Hipnosis Interdimencional
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Terapia especializada que, a través de la hipnosis regresiva, busca acompañar procesos de liberación y
              armonización del campo energético del paciente, trabajando con contenidos del inconsciente desde un enfoque
              profundo y respetuoso.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {hasAccess ? (
                <Link
                  to="/mi-perfil"
                  className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Ir a mi perfil
                </Link>
              ) : (
                <Link
                  to="/checkout/hipnosis-interdimencional"
                  className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Comprar curso
                </Link>
              )}
              <Link
                to="/cursos"
                className="bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200"
              >
                Ver todos los cursos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-5">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">¿En qué consiste?</h2>
              <p className="text-gray-600 leading-relaxed">
                Se trata de un acompañamiento terapéutico basado en hipnosis regresiva, orientado a explorar memorias,
                sensaciones y patrones internos. En este proceso se trabaja con la intención de identificar y retirar
                posibles “sistemas de extracción energética” y presencia parasitaria en el cuerpo energético, según la
                experiencia subjetiva del paciente y su narrativa interna.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-5">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">¿Cómo se vive una sesión?</h2>
              <p className="text-gray-600 leading-relaxed">
                Un terapeuta debidamente capacitado y un auxiliar completamente entrenado utilizan la hipnosis regresiva.
                A través de la información proporcionada por el paciente, se facilita el acceso a la información
                contenida en su ADN. De esta manera, y mediante sus engramas no resueltos, es posible identificar su
                origen y liberarlo de los sistemas de control que, a lo largo de sus vidas, lo han limitado. Así se
                desarrolla un proceso de liberación para que la persona encuentre su ser de luz y pueda alcanzar todo su
                potencial.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-5">
                <ShieldCheck className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Importante</h2>
              <p className="text-gray-600 leading-relaxed">
                Este servicio se ofrece como acompañamiento complementario y no sustituye la atención médica o
                psiquiátrica. Si presentas síntomas intensos, crisis o una condición de salud, te recomendamos consultar a
                un profesional de la salud.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg">
              <Video className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-gray-700">Contenido del curso</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Accede a las lecciones en tu perfil</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Compra el curso y desbloquea el contenido en video. Podrás verlo cuando quieras desde “Mi perfil”.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {['Lección 1: Introducción', 'Lección 2: Proceso guiado'].map((title) => (
              <div
                key={title}
                className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
              >
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-accent/5 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <p className="text-sm text-gray-500">Hipnosis Interdimencional</p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 border border-gray-100">
                    <Lock className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-gray-700">Bloqueado</span>
                  </div>
                </div>
                <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                  <div className="text-center px-6">
                    <div className="text-white font-semibold">Disponible en tu biblioteca</div>
                    <div className="text-white/70 text-sm mt-1">Compra el curso para desbloquear</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">¿Quieres empezar hoy?</h3>
              <p className="text-gray-600 mb-6">
                Compra el curso para acceder a tu biblioteca, o agenda una sesión si prefieres acompañamiento 1:1.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to={hasAccess ? "/mi-biblioteca" : "/checkout/hipnosis-interdimencional"}
                  className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  {hasAccess ? 'Ir a mi biblioteca' : 'Comprar curso'}
                </Link>
                <Link
                  to="/agenda"
                  className="border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Agendar sesión
                </Link>
                <Link
                  to="/cursos"
                  className="text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary/5 transition-all duration-300 inline-flex items-center justify-center gap-2"
                >
                  Ver cursos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HipnosisInterdimencionalPage;
