import React, { useEffect, useMemo, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { BookOpen, Lock, PlayCircle, Sparkles } from 'lucide-react';
import { api } from '../api/client';

const getTokenKey = () => 'conexionluz:token';
const getPurchaseKey = (slug: string) => `conexionluz:purchased:${slug}`;

type PortalMe = {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  portalWelcomeTitle?: string;
  portalWelcomeMessage?: string;
  portalAccentColor?: string;
  intakeCompleted?: boolean;
  intakeSummary?: string;
};

type IntakeAnswers = {
  stress: number;
  anxiety: number;
  mood: number;
  sleep: number;
  energy: number;
  focus: number;
  goal: string;
};

type IntakeScaleKey = Exclude<keyof IntakeAnswers, 'goal'>;

const scaleOptions = [
  { value: 0, label: 'Nunca' },
  { value: 1, label: 'A veces' },
  { value: 2, label: 'Frecuente' },
  { value: 3, label: 'Casi siempre' }
];

const IntakeScreen = ({ onCompleted }: { onCompleted: () => void }) => {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<IntakeAnswers>({
    stress: 0,
    anxiety: 0,
    mood: 0,
    sleep: 0,
    energy: 0,
    focus: 0,
    goal: ''
  });

  const steps = [
    {
      key: 'stress',
      title: 'Estrés',
      subtitle: 'En la última semana, ¿qué tan a menudo te has sentido estresado(a)?'
    },
    {
      key: 'anxiety',
      title: 'Ansiedad',
      subtitle: 'En la última semana, ¿qué tan a menudo te has sentido ansioso(a) o con preocupación excesiva?'
    },
    {
      key: 'mood',
      title: 'Ánimo',
      subtitle: 'En la última semana, ¿qué tan a menudo te has sentido desanimado(a) o sin motivación?'
    },
    {
      key: 'sleep',
      title: 'Sueño',
      subtitle: 'En la última semana, ¿qué tan a menudo has tenido problemas para dormir o descansar?'
    },
    {
      key: 'energy',
      title: 'Energía',
      subtitle: 'En la última semana, ¿qué tan a menudo has sentido poca energía?'
    },
    {
      key: 'focus',
      title: 'Concentración',
      subtitle: 'En la última semana, ¿qué tan a menudo te ha costado concentrarte?'
    },
    {
      key: 'goal',
      title: 'Objetivo',
      subtitle: '¿Qué te gustaría lograr con tu proceso?'
    }
  ] as const;

  const current = steps[step];
  const progress = Math.round(((step + 1) / steps.length) * 100);

  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    setError(null);
    setSaving(true);
    const res = await api.post<{ completed: boolean; summary: string }>('/api/portal/intake/', { answers });
    if (!res.ok) {
      setError(res.error);
      setSaving(false);
      return;
    }
    setSaving(false);
    onCompleted();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="rounded-3xl border border-gray-100 shadow-lg p-8 bg-white">
          <div className="flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-5 py-2 border border-gray-100">
              <span className="text-xs font-semibold text-gray-600">Evaluación inicial</span>
            </div>
            <div className="text-xs font-semibold text-gray-500">{progress}%</div>
          </div>

          <h1 className="mt-5 text-3xl font-bold text-gray-800">{current.title}</h1>
          <p className="mt-2 text-gray-600">{current.subtitle}</p>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-8">
            {current.key === 'goal' ? (
              <textarea
                value={answers.goal}
                onChange={(e) => setAnswers((p) => ({ ...p, goal: e.target.value }))}
                className="w-full min-h-[140px] rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Ej. Reducir ansiedad, mejorar autoestima, manejar estrés..."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {scaleOptions.map((opt) => {
                  const key = current.key as IntakeScaleKey;
                  const active = answers[key] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAnswers((p) => ({ ...p, [key]: opt.value } as IntakeAnswers))}
                      className={`rounded-2xl border px-5 py-4 text-left transition-all ${
                        active
                          ? 'border-primary/40 bg-primary/10 shadow-sm'
                          : 'border-gray-200 bg-white hover:shadow-sm'
                      }`}
                    >
                      <div className="text-sm font-bold text-gray-800">{opt.label}</div>
                      <div className="mt-1 text-xs text-gray-500">Seleccionar</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={back}
              disabled={step === 0 || saving}
              className="bg-white text-gray-700 px-8 py-3 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Atrás
            </button>

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={next}
                disabled={saving}
                className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void submit()}
                disabled={saving}
                className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? 'Guardando...' : 'Finalizar'}
              </button>
            )}
          </div>

          <div className="mt-6 text-xs text-gray-500">
            Esta evaluación es un autorreporte y no constituye un diagnóstico clínico.
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem(getTokenKey()) : null;
  const isAuthed = Boolean(token);
  const [me, setMe] = useState<PortalMe | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [prefs, setPrefs] = useState({ title: '', message: '', color: '' });
  const [savingPrefs, setSavingPrefs] = useState(false);

  const loadMe = async () => {
    setLoadingMe(true);
    const res = await api.get<PortalMe>('/api/portal/me/');
    if (!res.ok) {
      localStorage.removeItem(getTokenKey());
      setMe(null);
      setLoadingMe(false);
      return;
    }
    setMe(res.data);
    setPrefs({
      title: res.data.portalWelcomeTitle || '',
      message: res.data.portalWelcomeMessage || '',
      color: res.data.portalAccentColor || ''
    });
    setLoadingMe(false);
  };

  useEffect(() => {
    if (!isAuthed) {
      setLoadingMe(false);
      setMe(null);
      return;
    }
    void loadMe();
  }, [isAuthed]);

  const welcomeTitle = useMemo(() => {
    if (me?.portalWelcomeTitle) return me.portalWelcomeTitle;
    const name = `${me?.firstName || ''}${me?.lastName ? ` ${me.lastName}` : ''}`.trim();
    return name ? `Hola, ${name}` : 'Mi perfil';
  }, [me]);

  const welcomeMessage = useMemo(() => {
    return me?.portalWelcomeMessage || 'Bienvenido(a) a tu espacio personal.';
  }, [me]);

  const accent = me?.portalAccentColor || '#22c55e';

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (loadingMe) {
    return <div className="min-h-screen bg-white" />;
  }

  if (me && me.intakeCompleted === false) {
    return <IntakeScreen onCompleted={() => void loadMe()} />;
  }

  const hasHipnosis = localStorage.getItem(getPurchaseKey('hipnosis-interdimencional')) === '1';

  const logout = () => {
    localStorage.removeItem(getTokenKey());
    window.location.href = '/login';
  };

  const savePreferences = async () => {
    setSavingPrefs(true);
    const res = await api.patch<PortalMe>('/api/portal/me/', {
      portalWelcomeTitle: prefs.title,
      portalWelcomeMessage: prefs.message,
      portalAccentColor: prefs.color
    });
    if (res.ok) {
      setMe(res.data);
      setSavingPrefs(false);
      return;
    }
    setSavingPrefs(false);
  };

  return (
    <PublicLayout contentClassName="p-0">
      <section
        className="py-12"
        style={{
          background: `linear-gradient(135deg, ${accent}22 0%, rgba(255,255,255,1) 45%, ${accent}14 100%)`
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-gray-700">Mi perfil</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">{welcomeTitle}</h1>
                <p className="text-gray-600">{welcomeMessage}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/cursos"
                  className="bg-white text-gray-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200"
                >
                  Explorar cursos
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="bg-white/60 text-gray-700 px-8 py-3 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>

            {me?.intakeSummary ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <div className="text-xl font-bold text-gray-800">Evaluación inicial</div>
                <div className="mt-2 text-gray-600">{me.intakeSummary}</div>
              </div>
            ) : null}

            {!me ? null : (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <div className="text-xl font-bold text-gray-800">Personaliza tu espacio</div>
                <div className="mt-2 text-gray-600">Ajusta el mensaje de bienvenida y el color principal de tu perfil.</div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Título de bienvenida</label>
                    <input
                      value={prefs.title}
                      onChange={(e) => setPrefs((p) => ({ ...p, title: e.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Ej. Hola, María"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Color principal</label>
                    <input
                      value={prefs.color}
                      onChange={(e) => setPrefs((p) => ({ ...p, color: e.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="#22c55e"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">Mensaje de bienvenida</label>
                    <textarea
                      value={prefs.message}
                      onChange={(e) => setPrefs((p) => ({ ...p, message: e.target.value }))}
                      className="mt-2 w-full min-h-[110px] rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Escribe un mensaje para ti..."
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => void savePreferences()}
                    disabled={savingPrefs}
                    className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {savingPrefs ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </div>
            )}

            {!hasHipnosis && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 border border-gray-100">
                    <Lock className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-gray-700">Sin compras</span>
                  </div>
                  <div className="text-xl font-bold text-gray-800">Aún no tienes cursos comprados</div>
                  <div className="text-gray-600">Compra un curso para que aparezca aquí y puedas acceder al contenido.</div>
                </div>
                <Link
                  to="/cursos"
                  className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Ver cursos
                </Link>
              </div>
            )}

            {hasHipnosis && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-accent/5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm border border-gray-100">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-xs font-semibold text-gray-700">Curso</span>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-800">Hipnosis Interdimencional</h2>
                      <p className="text-gray-600">Acceso completo a las lecciones en video.</p>
                    </div>
                    <Link
                      to="/cursos/hipnosis-interdimencional"
                      className="bg-white text-gray-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200"
                    >
                      Ver ficha del curso
                    </Link>
                  </div>
                </div>

                <div className="p-8">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center space-x-2 bg-gray-50 rounded-full px-6 py-3 mb-4 border border-gray-100">
                      <PlayCircle className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-gray-700">Lecciones en video</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">Contenido</h3>
                    <p className="text-gray-600 max-w-3xl mx-auto">Reproduce los videos y avanza a tu ritmo.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-50 rounded-3xl shadow-sm overflow-hidden border border-gray-100">
                      <div className="p-6 border-b border-gray-100 bg-white">
                        <h4 className="text-xl font-bold text-gray-800">Juan David</h4>
                        <p className="text-sm text-gray-500">Hipnosis Interdimencional</p>
                      </div>
                      <div className="aspect-video bg-black">
                        <video controls className="w-full h-full object-contain" preload="metadata">
                          <source src="/videos/juandavid.mp4" type="video/mp4" />
                          Tu navegador no soporta la reproducción de videos.
                        </video>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-3xl shadow-sm overflow-hidden border border-gray-100">
                      <div className="p-6 border-b border-gray-100 bg-white">
                        <h4 className="text-xl font-bold text-gray-800">Laura</h4>
                        <p className="text-sm text-gray-500">Hipnosis Interdimencional</p>
                      </div>
                      <div className="aspect-video bg-black">
                        <video controls className="w-full h-full object-contain" preload="metadata">
                          <source src="/videos/laura.mp4" type="video/mp4" />
                          Tu navegador no soporta la reproducción de videos.
                        </video>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default ProfilePage;
