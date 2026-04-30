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
};

const LibraryPage = () => {
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem(getTokenKey()) : null;
  const isAuthed = Boolean(token);
  const [me, setMe] = useState<PortalMe | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [prefs, setPrefs] = useState({ title: '', message: '', color: '' });
  const [savingPrefs, setSavingPrefs] = useState(false);

  useEffect(() => {
    if (!isAuthed) {
      setLoadingMe(false);
      setMe(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      setLoadingMe(true);
      const res = await api.get<PortalMe>('/api/portal/me/');
      if (cancelled) return;
      if (!res.ok) {
        localStorage.removeItem(getTokenKey());
        setLoadingMe(false);
        setMe(null);
        return;
      }
      setMe(res.data);
      setPrefs({
        title: res.data.portalWelcomeTitle || '',
        message: res.data.portalWelcomeMessage || '',
        color: res.data.portalAccentColor || ''
      });
      setLoadingMe(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthed]);

  const welcomeTitle = useMemo(() => {
    if (me?.portalWelcomeTitle) return me.portalWelcomeTitle;
    const name = `${me?.firstName || ''}${me?.lastName ? ` ${me.lastName}` : ''}`.trim();
    return name ? `Hola, ${name}` : 'Mi biblioteca';
  }, [me]);

  const welcomeMessage = useMemo(() => {
    return me?.portalWelcomeMessage || 'Aquí encontrarás el contenido que has comprado.';
  }, [me]);

  const accent = me?.portalAccentColor || '#22c55e';

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
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
                  <span className="text-sm font-medium text-gray-700">Mi biblioteca</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                  {loadingMe ? 'Cargando...' : welcomeTitle}
                </h1>
                <p className="text-gray-600">{loadingMe ? 'Obteniendo tu información...' : welcomeMessage}</p>
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

            {!loadingMe && me && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <div className="text-xl font-bold text-gray-800">Personaliza tu espacio</div>
                <div className="mt-2 text-gray-600">
                  Ajusta el mensaje de bienvenida y el color principal de tu biblioteca.
                </div>

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
                  <div className="text-gray-600">
                    Compra un curso para que aparezca aquí y puedas acceder al contenido.
                  </div>
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
                      <p className="text-gray-600">
                        Acceso completo a las lecciones en video.
                      </p>
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
                    <p className="text-gray-600 max-w-3xl mx-auto">
                      Reproduce los videos y avanza a tu ritmo.
                    </p>
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

export default LibraryPage;
