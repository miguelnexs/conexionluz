import React, { useEffect, useMemo, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { PlayCircle, Sparkles } from 'lucide-react';

type PublicCourse = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  descriptionHtml?: string;
  coverUrl?: string | null;
  promoVideoUrl?: string | null;
  category?: string;
  tags?: string[];
  priceCOP?: number;
};

function safeHtml(value: string): string {
  const noScripts = value.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  const noOnHandlers = noScripts.replace(/\son\w+="[^"]*"/gi, '');
  const noJsUrls = noOnHandlers.replace(/href="javascript:[^"]*"/gi, 'href="#"');
  return noJsUrls;
}

export default function PublicCoursePreview({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<PublicCourse | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError(null);
      const res = await api.get<PublicCourse>(`/api/public/courses/${slug}/`);
      if (cancelled) return;
      if (!res.ok) {
        setError(res.error);
        setCourse(null);
        setLoading(false);
        return;
      }
      setCourse(res.data);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const tags = useMemo(() => course?.tags || [], [course?.tags]);

  if (loading) {
    return <div className="min-h-screen bg-white" />;
  }

  if (!course) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="text-xl font-bold text-gray-800">Curso no disponible</div>
            <div className="mt-2 text-gray-600">{error || 'No encontramos este curso.'}</div>
            <Link to="/cursos" className="mt-6 inline-flex items-center gap-2 text-primary font-semibold">
              Volver a cursos
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout contentClassName="p-0">
      <section className="py-12 bg-gradient-to-br from-blue-50 via-green-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-gray-700">{course.category || 'Curso'}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">{course.title}</h1>
                {course.description ? <p className="text-gray-600 max-w-2xl">{course.description}</p> : null}
                {tags.length ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {tags.slice(0, 10).map((tag) => (
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
                    to="/registro"
                    className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center"
                  >
                    Crear cuenta para acceder
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200 text-center"
                  >
                    Ya tengo cuenta
                  </Link>
                </div>
              </div>

              {course.coverUrl ? (
                <img
                  src={course.coverUrl}
                  alt={course.title}
                  className="w-full lg:w-[360px] h-[240px] lg:h-[280px] rounded-3xl object-cover border border-gray-200 shadow-sm"
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {course.promoVideoUrl ? (
                <div className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden bg-white">
                  <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-gray-100 flex items-center justify-center">
                      <PlayCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-lg font-bold text-gray-800">Video de presentación (gratis)</div>
                      <div className="text-sm text-gray-600">Mira una introducción al curso antes de registrarte.</div>
                    </div>
                  </div>
                  <div className="aspect-video bg-black">
                    <video controls className="w-full h-full object-cover" preload="metadata">
                      <source src={course.promoVideoUrl} />
                    </video>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 text-gray-600">
                  Este curso aún no tiene video de presentación.
                </div>
              )}

              {course.descriptionHtml ? (
                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: safeHtml(course.descriptionHtml) }} />
                </div>
              ) : null}
            </div>

            <aside className="lg:col-span-1 space-y-6">
              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="text-lg font-bold text-gray-800">Acceso completo</div>
                <div className="mt-2 text-gray-600">
                  Para ver todas las secciones, videos y quizzes, inicia sesión o crea tu cuenta.
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    to="/registro"
                    className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center"
                  >
                    Crear cuenta
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white text-gray-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200 text-center"
                  >
                    Iniciar sesión
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
