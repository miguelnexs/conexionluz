import React, { useEffect, useMemo, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Lock, PlayCircle, X } from 'lucide-react';
import { api } from '../api/client';

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
      <section className="py-12 bg-gradient-to-br from-blue-50 via-green-50 to-amber-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-70 animate-gradient" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <PlayCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-gray-700">Cursos y contenido</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-amber-500 bg-clip-text text-transparent">
              Cursos
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Explora programas por módulos y lecciones. Compra una vez y accede desde tu perfil.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/mi-perfil"
                className="bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200"
              >
                Ir a mi perfil
              </Link>
              <Link
                to="/registro"
                className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Crear cuenta
              </Link>
            </div>
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
