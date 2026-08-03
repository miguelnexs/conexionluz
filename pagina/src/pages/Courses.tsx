import React, { useEffect, useMemo, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Lock, PlayCircle, X } from 'lucide-react';
import { api } from '../api/client';
import { motion } from 'framer-motion';

const CoursesPage = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('conexionluz:token') : null;
  const isAuthed = Boolean(token);
  const [loading, setLoading] = useState(false);
  type PortalCourse = {
    title: string;
    slug: string;
    description?: string;
    coverUrl?: string | null;
    promoVideoUrl?: string | null;
    category?: string;
    tags?: string[];
    priceCOP?: number;
  };

  const [portalCourses, setPortalCourses] = useState<PortalCourse[]>([]);
  const [publicCourses, setPublicCourses] = useState<PortalCourse[]>([]);
  const [promoModal, setPromoModal] = useState<{ title: string; url: string } | null>(null);

  useEffect(() => {
    if (!isAuthed) return;
    void (async () => {
      setLoading(true);
      const res = await api.get<PortalCourse[]>('/api/portal/courses/');
      if (res.ok) setPortalCourses(res.data);
      setLoading(false);
    })();
  }, [isAuthed]);

  useEffect(() => {
    if (isAuthed) return;
    void (async () => {
      setLoading(true);
      const res = await api.get<PortalCourse[]>('/api/public/courses/');
      if (res.ok) setPublicCourses(res.data);
      setLoading(false);
    })();
  }, [isAuthed]);

  const courses = useMemo(() => {
    if (isAuthed && portalCourses.length) {
      return portalCourses.map((c) => ({
        title: c.title,
        slug: c.slug,
        description: c.description || '',
        badge: c.category || 'Curso',
        icon: Sparkles,
        priceLabel: typeof c.priceCOP === 'number' && c.priceCOP > 0 ? c.priceCOP.toLocaleString('es-CO') : 'Pago único',
        coverUrl: c.coverUrl || null,
        promoVideoUrl: c.promoVideoUrl || null,
        tags: c.tags || []
      }));
    }
    if (!isAuthed && publicCourses.length) {
      return publicCourses.map((c) => ({
        title: c.title,
        slug: c.slug,
        description: c.description || '',
        badge: c.category || 'Curso',
        icon: Sparkles,
        priceLabel: typeof c.priceCOP === 'number' && c.priceCOP > 0 ? c.priceCOP.toLocaleString('es-CO') : 'Gratis',
        coverUrl: c.coverUrl || null,
        promoVideoUrl: c.promoVideoUrl || null,
        tags: c.tags || []
      }));
    }
    return [];
  }, [isAuthed, portalCourses, publicCourses]);

  return (
    <PublicLayout contentClassName="p-0">
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
              <span className="text-sm font-semibold text-gray-700 tracking-wide">Plataforma Educativa</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              <span className="text-gray-800">Nuestros </span>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Cursos</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
            >
              Explora programas estructurados por módulos y lecciones. Compra una vez y accede desde tu perfil, a tu propio ritmo.
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
                to={isAuthed ? '/mi-perfil' : '/registro'}
                className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                {isAuthed ? 'Mis cursos' : 'Crear cuenta'}
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
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{courses.length || '—'}</span>
                <span className="text-xs md:text-sm text-gray-500 font-medium">Cursos disponibles</span>
              </div>
              <div className="w-px h-10 bg-gray-200 hidden sm:block" />
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">100%</span>
                <span className="text-xs md:text-sm text-gray-500 font-medium">A tu ritmo</span>
              </div>
              <div className="w-px h-10 bg-gray-200 hidden sm:block" />
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">∞</span>
                <span className="text-xs md:text-sm text-gray-500 font-medium">Acceso ilimitado</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="max-w-4xl mx-auto text-center text-gray-600 mb-10">Cargando cursos...</div>
          ) : null}
          {!loading && courses.length === 0 ? (
            <div className="max-w-4xl mx-auto rounded-3xl border border-gray-100 bg-gray-50 p-10 text-center">
              <div className="text-2xl font-bold text-gray-800">Aún no hay cursos disponibles</div>
              <div className="mt-2 text-gray-600">
                Cuando publiques un curso desde el dashboard, aparecerá aquí automáticamente.
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/mi-perfil"
                  className="bg-white text-gray-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200 text-center"
                >
                  Ir a mi perfil
                </Link>
                <Link
                  to="/contacto"
                  className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center"
                >
                  Contacto
                </Link>
              </div>
            </div>
          ) : null}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course) => (
              <div
                key={course.slug}
                className="group bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm border border-gray-100">
                      <Lock className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold text-gray-700">{course.badge}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs font-semibold text-gray-700">{course.priceLabel}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">{course.title}</h2>
                    <p className="text-gray-600 leading-relaxed max-w-xl">{course.description}</p>
                    {course.tags?.length ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {course.tags.slice(0, 6).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600 border border-gray-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Link
                        to={`/cursos/${course.slug}`}
                        className="inline-flex items-center gap-2 text-primary font-semibold"
                      >
                        Ver detalles
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                      {course.promoVideoUrl ? (
                        <button
                          type="button"
                          onClick={() => setPromoModal({ title: course.title, url: course.promoVideoUrl as string })}
                          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md transition-all"
                        >
                          <PlayCircle className="h-4 w-4 text-primary" />
                          Ver presentación
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="relative shrink-0">
                    {course.coverUrl ? (
                      <img
                        src={course.coverUrl}
                        alt={course.title}
                        className="w-20 h-20 rounded-3xl object-cover border border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                        <course.icon className="h-7 w-7 text-white" />
                      </div>
                    )}
                    {course.promoVideoUrl ? (
                      <button
                        type="button"
                        onClick={() => setPromoModal({ title: course.title, url: course.promoVideoUrl as string })}
                        className="absolute -bottom-2 -right-2 h-9 w-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:shadow-md transition-all"
                        aria-label={`Ver video de presentación de ${course.title}`}
                      >
                        <PlayCircle className="h-5 w-5 text-primary" />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {promoModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Cerrar"
            onClick={() => setPromoModal(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Video de presentación: ${promoModal.title}`}
            className="relative w-full max-w-5xl rounded-3xl bg-white shadow-xl overflow-hidden border border-gray-100"
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-3">
              <div className="text-lg font-bold text-gray-800">{promoModal.title}</div>
              <button
                type="button"
                onClick={() => setPromoModal(null)}
                className="h-10 w-10 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:shadow-sm transition-all"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <video controls className="w-full h-full object-cover" preload="metadata">
                <source src={promoModal.url} />
              </video>
            </div>
          </div>
        </div>
      ) : null}
    </PublicLayout>
  );
};

export default CoursesPage;
