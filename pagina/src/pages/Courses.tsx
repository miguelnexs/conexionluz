import React, { useEffect, useMemo, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, PlayCircle, X, CheckCircle2, Lock } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '@/components/ui/use-toast';
import { LumiConfirmUnlockModal } from '@/components/LumiConfirmUnlockModal';

const CoursesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = typeof window !== 'undefined' ? localStorage.getItem('conexionluz:token') : null;
  const isAuthed = Boolean(token);
  const [loading, setLoading] = useState(false);
  const [unlockedCourseSlugs, setUnlockedCourseSlugs] = useState<Set<string>>(new Set());
  const [userBalance, setUserBalance] = useState<number>(150);
  const [pendingCourse, setPendingCourse] = useState<{ title: string; slug: string; priceLumis: number } | null>(null);
  const [unlocking, setUnlocking] = useState(false);

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

  const fetchWalletAndUnlocked = async () => {
    if (!isAuthed) return;
    const res = await api.get<any>('/api/portal/lumi/wallet/');
    if (res.ok && res.data) {
      setUserBalance(res.data.balance);
      const unlockedSet = new Set<string>();
      if (Array.isArray(res.data.unlockedItems)) {
        res.data.unlockedItems.forEach((u: any) => {
          if (u.itemType === 'course') {
            unlockedSet.add(u.itemId);
          }
        });
      }
      setUnlockedCourseSlugs(unlockedSet);
    }
  };

  useEffect(() => {
    void fetchWalletAndUnlocked();
  }, [isAuthed]);

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

  const DEFAULT_COURSES: PortalCourse[] = [
    {
      title: 'AUTOHIPNOSIS: Aprende a transformar tu diálogo interno y dirigir tu mente',
      slug: 'autohipnosis',
      description: 'Un viaje hacia el conocimiento consciente de tu propia mente. Aprende a entrar en relajación profunda y utilizar la autohipnosis para cultivar hábitos, autoestima, concentración y bienestar emocional.',
      category: 'Autohipnosis & Neurociencia',
      tags: ['Autohipnosis', 'Neurociencia', 'Sugestión', 'Relajación', 'Trance', 'Hábitos', 'Autoestima', 'Conexión Luz'],
      priceCOP: 0,
      coverUrl: '/cursos/autohipnosis_cover.png'
    },
    {
      title: 'HIPNOSIS ERICKSONIANA: El Arte de Acompañar el Cambio',
      slug: 'hipnosis-ericksoniana',
      description: 'Programa estructurado para estudiar los fundamentos de la Hipnosis Ericksoniana, el lenguaje permisivo, la utilización, el rapport, las metáforas, las inducciones y el diseño de experiencias hipnóticas.',
      category: 'Hipnosis Ericksoniana & Comunicación',
      tags: ['Hipnosis Ericksoniana', 'Milton Erickson', 'Lenguaje Permisivo', 'Sugestión Indirecta', 'Metáforas Terapéuticas', 'Pacing y Leading', 'Rapport', 'Trance Ericksoniano', 'Conexión Luz'],
      priceCOP: 0,
      coverUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80'
    },
    {
      title: 'Curso Básico: Hipnosis Clínica y Transformación del Inconsciente',
      slug: 'hipnosis-clinica-transpersonal',
      description: 'Formación profesional completa en Hipnosis Clínica, Hipnoanálisis Ericksoniano y Técnicas de Reprogramación del Subconsciente. Diseñado para terapeutas, profesionales de la salud mental y personas en búsqueda de transformación profunda.',
      category: 'Hipnosis Clínica & Sanación',
      tags: ['Hipnosis', 'Hipnoanálisis', 'Subconsciente', 'Transpersonal', 'Autohipnosis', 'Regresión', 'Terapia'],
      priceCOP: 0,
      coverUrl: '/cursos/hipnosis_cover.png'
    },
    {
      title: 'TERAPIA COGNITIVO-CONDUCTUAL (TCC): Comprende la relación entre pensamientos, emociones y conductas',
      slug: 'terapia-cognitivo-conductual',
      description: 'Programa educativo estructurado para el estudio de los fundamentos de la Terapia Cognitivo-Conductual, el modelo cognitivo, reestructuración de pensamientos, análisis conductual ABC, laboratorio interactivo y resolución de problemas.',
      category: 'Terapia Cognitivo-Conductual & Psicología',
      tags: ['TCC', 'Modelo Cognitivo', 'Pensamientos Automáticos', 'Distorsiones', 'Reestructuración', 'Análisis ABC', 'Conexión Luz'],
      priceCOP: 0,
      coverUrl: '/cursos/tcc_cover.png'
    },
    {
      title: 'DESARROLLO PERSONAL: Un camino de autoconocimiento, crecimiento y transformación consciente',
      slug: 'desarrollo-personal',
      description: 'Programa educativo diseñado para acompañar al estudiante en un proceso estructurado de autoconocimiento, definición de objetivos, construcción de hábitos, inteligencia emocional, comunicación, resiliencia y planificación personal.',
      category: 'Desarrollo Personal & Crecimiento',
      tags: ['Desarrollo Personal', 'Autoconocimiento', 'Autoestima', 'Hábitos', 'Metas SMART', 'Valores', 'Asertividad', 'Conexión Luz'],
      priceCOP: 0,
      coverUrl: '/cursos/desarrollo_personal_cover.png'
    },
    {
      title: 'INTELIGENCIA EMOCIONAL: Comprende tus emociones, desarrolla conciencia y mejora tu manera de relacionarte',
      slug: 'inteligencia-emocional',
      description: 'Programa educativo diseñado para desarrollar conocimientos y habilidades relacionadas con el autoconocimiento emocional, autorregulación, empatía, comunicación, motivación y relaciones interpersonales.',
      category: 'Inteligencia Emocional & Relaciones',
      tags: ['Inteligencia Emocional', 'Autoconocimiento', 'Autorregulación', 'Empatía', 'Comunicación Asertiva', 'Pausa Consciente', 'Conexión Luz'],
      priceCOP: 0,
      coverUrl: '/cursos/inteligencia_emocional_cover.png'
    },
    {
      title: 'AUTOCONOCIMIENTO: Conócete, comprende tu mundo interior y construye una relación más consciente contigo mismo',
      slug: 'autoconocimiento',
      description: 'Programa educativo diseñado para acompañar al estudiante en un proceso progresivo de exploración personal mediante ejercicios de reflexión, identificación de valores, reconocimiento de emociones, observación de pensamientos, análisis de hábitos, exploración de relaciones y construcción de objetivos personales.',
      category: 'Autoconocimiento & Filosofía de Vida',
      tags: ['Autoconocimiento', 'Identidad', 'Valores', 'Fortalezas', 'Línea de Vida', 'Relaciones', 'Patrones', 'Introspección', 'Conexión Luz'],
      priceCOP: 0,
      coverUrl: '/cursos/autoconocimiento_cover.png'
    },
    {
      title: 'MEDIACIÓN Y ATENCIÓN PLENA: Observación interna y externa de la realidad presente a través de la conciencia',
      slug: 'mediacion-atencion-plena',
      description: 'Un programa de exploración de la experiencia presente basado en la observación consciente de pensamientos, emociones, sensaciones corporales y realidad externa. El curso introduce los conceptos de mediación, metacognición y metaconciencia, desarrollando una práctica orientada a observar antes de reaccionar y a poner el sistema emocional al servicio de una conciencia más amplia de la experiencia.',
      category: 'Mediación & Metaconciencia',
      tags: ['Mediación', 'Atención Plena', 'Metacognición', 'Metaconciencia', 'Observación', 'Exaptación Emocional', 'Presencia', 'Conexión Luz'],
      priceCOP: 0,
      coverUrl: '/cursos/mediacion_cover.png'
    }
  ];

  const courses = useMemo(() => {
    const list = isAuthed 
      ? (portalCourses.length ? portalCourses : DEFAULT_COURSES)
      : (publicCourses.length ? publicCourses : DEFAULT_COURSES);

    return list.map((c) => ({
      title: c.title,
      slug: c.slug,
      description: c.description || '',
      badge: c.category || 'Curso Master',
      icon: Sparkles,
      priceLabel: typeof c.priceCOP === 'number' && c.priceCOP > 0 
      ? `$${c.priceCOP.toLocaleString('es-CO')} COP` 
      : unlockedCourseSlugs.has(c.slug) ? '🔓 Inscrito / Desbloqueado' : '✨ 500 Lumis',
      coverUrl: c.coverUrl || (
        c.slug === 'autohipnosis' ? '/cursos/autohipnosis_cover.png' :
        c.slug === 'hipnosis-clinica-transpersonal' ? '/cursos/hipnosis_cover.png' :
        c.slug === 'terapia-cognitivo-conductual' ? '/cursos/tcc_cover.png' :
        c.slug === 'desarrollo-personal' ? '/cursos/desarrollo_personal_cover.png' :
        c.slug === 'inteligencia-emocional' ? '/cursos/inteligencia_emocional_cover.png' :
        c.slug === 'autoconocimiento' ? '/cursos/autoconocimiento_cover.png' :
        'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80'
      ),
      promoVideoUrl: c.promoVideoUrl || null,
      tags: c.tags || []
    }));
  }, [isAuthed, portalCourses, publicCourses, unlockedCourseSlugs]);

  const handleEnrollClick = (course: { title: string; slug: string }) => {
    if (!isAuthed) {
      navigate('/login');
      return;
    }

    if (unlockedCourseSlugs.has(course.slug)) {
      navigate(`/cursos/${course.slug}`);
      return;
    }

    setPendingCourse({
      title: course.title,
      slug: course.slug,
      priceLumis: 500
    });
  };

  const handleConfirmCourseUnlock = async () => {
    if (!pendingCourse) return;
    setUnlocking(true);

    const res = await api.post<any>('/api/portal/lumi/spend/', {
      itemType: 'course',
      itemId: pendingCourse.slug,
      lumiAmount: pendingCourse.priceLumis,
      description: `Curso Master: ${pendingCourse.title}`
    });

    if (res.ok && res.data) {
      const newBal = res.data.balance;
      setUserBalance(newBal);
      window.dispatchEvent(new CustomEvent('lumi-balance-updated', { detail: newBal }));

      setUnlockedCourseSlugs(prev => new Set(prev).add(pendingCourse.slug));

      toast({
        title: "🎉 ¡Curso Desbloqueado Permanentemente!",
        description: `Has desbloqueado "${pendingCourse.title}". ¡Acceso ilimitado activado de por vida!`,
      });

      const targetSlug = pendingCourse.slug;
      setPendingCourse(null);
      navigate(`/cursos/${targetSlug}`);
    } else {
      toast({
        title: "Saldo Insuficiente de Lumis",
        description: (res as any).error || "Necesitas 500 Lumis para desbloquear este curso. ¡Puedes recargar en la tienda!",
        variant: "destructive"
      });
    }
    setUnlocking(false);
  };

  return (
    <PublicLayout contentClassName="p-0">
      <section className="py-12 md:py-16 bg-slate-50/60 min-h-[70vh]">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-3.5 py-1 rounded-full shadow-2xs">
              📚 PLATAFORMA EDUCATIVA
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Cursos & Programas
            </h1>
            <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
              Explora programas profesionales estructurados para tu crecimiento personal, sanación integral y autorregulación emocional.
            </p>
          </div>

          {loading ? (
            <div className="max-w-4xl mx-auto text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto mb-3"></div>
              <p className="text-sm font-bold text-slate-600">Cargando cursos disponibles...</p>
            </div>
          ) : null}

          {!loading && courses.length === 0 ? (
            <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-sm">
              <div className="text-2xl font-black text-slate-900">Aún no hay cursos disponibles</div>
              <div className="mt-2 text-slate-600 text-sm font-medium">
                Cuando se publiquen nuevos cursos desde el panel de administración, aparecerán aquí automáticamente.
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/mi-perfil"
                  className="bg-slate-100 text-slate-700 px-8 py-3 rounded-2xl font-bold border border-slate-200 text-center text-sm"
                >
                  Ir a mi perfil
                </Link>
                <Link
                  to="/contacto"
                  className="bg-gradient-to-r from-emerald-600 to-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-md text-center text-sm"
                >
                  Contacto
                </Link>
              </div>
            </div>
          ) : null}

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course) => {
              const isUnlocked = unlockedCourseSlugs.has(course.slug);
              return (
                <div
                  key={course.slug}
                  className="group bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1"
                >
                  {/* Image Banner Header */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                    {course.coverUrl ? (
                      <img
                        src={course.coverUrl}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-700 via-indigo-900 to-slate-900 flex items-center justify-center p-6 text-center">
                        <Sparkles className="h-16 w-16 text-emerald-400 opacity-80 animate-pulse" />
                      </div>
                    )}
                    
                    {/* Subtle Top & Bottom Gradient for badge readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                      <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black text-emerald-800 shadow-sm border border-emerald-100">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                        {course.badge}
                      </span>

                      <span className={`inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-xs font-bold shadow-md ${
                        isUnlocked ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-emerald-600 text-white'
                      }`}>
                        {course.priceLabel}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <h2 className="text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                        {course.title}
                      </h2>
                      
                      <p className="text-slate-600 text-sm font-medium leading-relaxed line-clamp-3">
                        {course.description}
                      </p>

                      {course.tags?.length ? (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {course.tags.slice(0, 5).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 border border-slate-200/60"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => handleEnrollClick(course)}
                        className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all text-center cursor-pointer ${
                          isUnlocked 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                            : 'bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white'
                        }`}
                      >
                        <span>{isUnlocked ? "Ingresar al Curso" : "Desbloquear Curso (✨ 500 Lumis)"}</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>

                      {course.promoVideoUrl ? (
                        <button
                          type="button"
                          onClick={() => setPromoModal({ title: course.title, url: course.promoVideoUrl as string })}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          <PlayCircle className="h-4 w-4 text-emerald-600" />
                          <span>Ver Demo</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promo Modal */}
      {promoModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            aria-label="Cerrar"
            onClick={() => setPromoModal(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Video de presentación: ${promoModal.title}`}
            className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200 z-10"
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3">
              <div className="text-lg font-bold text-slate-900">{promoModal.title}</div>
              <button
                type="button"
                onClick={() => setPromoModal(null)}
                className="h-10 w-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-all cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5 text-slate-700" />
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
      {/* Lumi Confirmation Unlock Modal */}
      <LumiConfirmUnlockModal
        isOpen={Boolean(pendingCourse)}
        onClose={() => setPendingCourse(null)}
        onConfirm={() => void handleConfirmCourseUnlock()}
        itemTitle={pendingCourse?.title || ''}
        itemCategory="Curso Master"
        lumiPrice={500}
        userBalance={userBalance}
        loading={unlocking}
      />
    </PublicLayout>
  );
};

export default CoursesPage;
