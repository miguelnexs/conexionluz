
import React, { useEffect, useMemo, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { Calendar, Heart, MessageSquareQuote, ShieldCheck, Star, TrendingUp } from 'lucide-react';
import { api } from '../api/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ExpandableText } from '@/components/ui/ExpandableText';

type Testimonial = {
  id: number;
  patientId?: number | null;
  name: string;
  title?: string;
  quote: string;
  rating: number;
  likesCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

type PortalMe = {
  userType?: string;
};

function hasToken(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem('conexionluz:token'));
}

function initials(name: string): string {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] || '';
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] || '' : '';
  return (a + b).toUpperCase();
}

function getLikedIds(): number[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem('conexionluz:likedTestimonials');
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((x) => Number(x)).filter((x) => Number.isFinite(x));
  } catch {
    return [];
  }
}

function setLikedIds(ids: number[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('conexionluz:likedTestimonials', JSON.stringify(Array.from(new Set(ids))));
}

const TestimonialsPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const authed = hasToken();
  const [publishBlocked, setPublishBlocked] = useState(false);

  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [myLoading, setMyLoading] = useState(authed);
  const [myError, setMyError] = useState<string | null>(null);
  const [my, setMy] = useState<Testimonial | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formQuote, setFormQuote] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const [likedIds, setLikedIdsState] = useState<number[]>(() => getLikedIds());
  const likedSet = useMemo(() => new Set(likedIds), [likedIds]);

  const canSave = useMemo(() => formQuote.trim().length >= 20 && !saving, [formQuote, saving]);

  const stats = useMemo(() => {
    const total = items.length;
    const avg = total ? items.reduce((acc, x) => acc + (x.rating || 5), 0) / total : 0;
    const avgRounded = avg ? Math.round(avg * 10) / 10 : 0;
    const fiveStars = total ? items.filter((x) => (x.rating || 5) === 5).length : 0;
    return { total, avgRounded, fiveStars };
  }, [items]);

  const featured = useMemo(() => {
    if (!items.length) return null;
    const sorted = [...items].sort((a, b) => (b.rating || 5) - (a.rating || 5));
    return sorted[0] || null;
  }, [items]);

  const load = async () => {
    setLoading(true);
    setError(null);
    const res = await api.get<Testimonial[]>('/api/public/testimonials/');
    if (!res.ok) {
      setError(res.error);
      setLoading(false);
      return;
    }
    setItems(res.data);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);



  useEffect(() => {
    if (!authed) return;
    void (async () => {
      setMyLoading(true);
      setMyError(null);
      const res = await api.get<Testimonial | null>('/api/public/testimonials/me/');
      if (!res.ok) {
        setMyError(res.error);
        setMyLoading(false);
        return;
      }
      setMy(res.data || null);
      setFormTitle(res.data?.title || '');
      setFormQuote(res.data?.quote || '');
      setFormRating(typeof res.data?.rating === 'number' ? res.data.rating : 5);
      setMyLoading(false);
    })();
  }, [authed]);

  const saveMy = async () => {
    if (!canSave) return;
    if (publishBlocked) {
      setMyError('Tu cuenta no tiene permisos para publicar testimonios.');
      return;
    }
    setSaving(true);
    setMyError(null);
    const res = await api.post<Testimonial>('/api/public/testimonials/me/', {
      title: formTitle.trim(),
      quote: formQuote.trim(),
      rating: formRating
    });
    setSaving(false);
    if (!res.ok) {
      setMyError(res.error);
      return;
    }
    setMy(res.data);
    toast({ title: 'Gracias', description: 'Tu testimonio se guardó correctamente.' });
    void load();
    setFormOpen(false);
  };

  const toggleLike = async (id: number) => {
    if (!authed) {
      navigate('/login', { state: { from: '/testimonios' } });
      return;
    }
    const liked = likedSet.has(id);
    const res = liked
      ? await api.del<{ testimonialId: number; likesCount: number; liked: boolean }>(`/api/public/testimonials/${id}/like/`)
      : await api.post<{ testimonialId: number; likesCount: number; liked: boolean }>(`/api/public/testimonials/${id}/like/`, {});
    if (!res.ok) {
      toast({ title: 'Error', description: res.error, variant: 'destructive' });
      return;
    }
    setItems((prev) =>
      prev.map((t) => (t.id === res.data.testimonialId ? { ...t, likesCount: res.data.likesCount } : t))
    );
    const next = res.data.liked ? Array.from(new Set([...likedIds, id])) : likedIds.filter((x) => x !== id);
    setLikedIds(next);
    setLikedIdsState(next);
  };

  return (
    <PublicLayout contentClassName="p-0">
      <section className="py-14 bg-gradient-to-br from-primary/10 via-white to-accent/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-16 left-10 w-32 h-32 bg-primary/5 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/5 rounded-full animate-float animation-delay-2000"></div>
          <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-primary/3 rounded-full animate-float animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-sm border border-gray-200">
                  <MessageSquareQuote className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-gray-700">Testimonios</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Opiniones reales del proceso
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Cada historia ayuda a que otras personas se animen a dar el paso. Si ya viviste el proceso, deja tu opinión aquí.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => navigate('/agenda')} className="bg-gradient-to-r from-primary to-accent text-white rounded-xl">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar cita
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/conversatorios')} className="rounded-xl border-primary text-primary hover:bg-primary/10 hover:text-primary">
                    Ver conversatorios
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!authed) {
                        navigate('/login');
                        return;
                      }
                      if (publishBlocked) {
                        toast({ title: 'Acceso restringido', description: 'Tu cuenta no tiene permisos para publicar testimonios.', variant: 'destructive' });
                        return;
                      }
                      setFormOpen(true);
                    }}
                    className="rounded-xl border-primary text-primary hover:bg-primary/10 hover:text-primary"
                  >
                    <MessageSquareQuote className="h-4 w-4 mr-2" />
                    Escribir testimonio
                  </Button>
                </div>
              </div>

              <div className="w-full lg:max-w-sm">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-xl p-6 space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-gray-800">Resumen</div>
                      <div className="text-xs text-gray-500">Basado en testimonios publicados</div>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center border border-gray-200">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center">
                      <div className="text-2xl font-bold text-gray-800">{loading ? '—' : stats.total}</div>
                      <div className="text-xs text-gray-600">Testimonios</div>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center">
                      <div className="text-2xl font-bold text-gray-800">{loading ? '—' : stats.avgRounded}</div>
                      <div className="text-xs text-gray-600">Promedio</div>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center">
                      <div className="text-2xl font-bold text-gray-800">{loading ? '—' : stats.fiveStars}</div>
                      <div className="text-xs text-gray-600">5 estrellas</div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      Privacidad
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      Tu testimonio se muestra con tu nombre. Si quieres que sea anónimo, dímelo y lo ajustamos.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-12 space-y-6">
              {featured ? (
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border border-gray-100 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-gray-800">Testimonio destacado</div>
                      <div className="text-sm text-gray-600">Una experiencia que puede inspirar a otras personas.</div>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-white/80 flex items-center justify-center border border-gray-200">
                      <Star className="h-5 w-5 text-amber-400 fill-current" />
                    </div>
                  </div>
                  <div className="mt-5 bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center font-bold text-lg">
                        {initials(featured.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-lg font-bold text-gray-800 truncate">{featured.name}</div>
                            {featured.title ? <div className="text-sm text-gray-600 truncate">{featured.title}</div> : null}
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(Math.max(1, Math.min(5, featured.rating || 5)))].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="mt-4 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{featured.quote}</p>
                        <div className="mt-5 flex items-center justify-between gap-3">
                          <div className="text-xs text-gray-500">{loading ? '' : `${stats.total} testimonios publicados`}</div>
                          <button
                            type="button"
                            onClick={() => void toggleLike(featured.id)}
                            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            <Heart className={`h-4 w-4 ${likedSet.has(featured.id) ? 'text-rose-500 fill-current' : 'text-gray-500'}`} />
                            <span>{featured.likesCount || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {error ? <div className="text-sm text-red-600">{error}</div> : null}

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                      <div className="h-5 w-1/2 bg-gray-200 rounded mb-4" />
                      <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                      <div className="h-4 w-11/12 bg-gray-200 rounded mb-2" />
                      <div className="h-4 w-10/12 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8 text-gray-600">
                  Aún no hay testimonios publicados.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-animation">
                  {items.map((testimonial, index) => (
                    <div
                      key={testimonial.id}
                      className="bg-gray-50 rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] animate-fade-in"
                      style={{ animationDelay: `${index * 0.06}s` }}
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center font-bold">
                          {initials(testimonial.name)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-gray-800 truncate">{testimonial.name}</h4>
                          {testimonial.title ? <p className="text-sm text-gray-600 truncate">{testimonial.title}</p> : null}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(Math.max(1, Math.min(5, testimonial.rating || 5)))].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                        ))}
                      </div>

                      <ExpandableText
                        text={testimonial.quote}
                        maxLength={220}
                        className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap"
                      />

                      <div className="mt-5 flex items-center justify-between gap-3">
                        <div className="text-xs text-gray-500">{testimonial.updatedAt ? 'Actualizado' : ''}</div>
                        <button
                          type="button"
                          onClick={() => void toggleLike(testimonial.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          <Heart className={`h-4 w-4 ${likedSet.has(testimonial.id) ? 'text-rose-500 fill-current' : 'text-gray-500'}`} />
                          <span>{testimonial.likesCount || 0}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {formOpen && authed ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <button type="button" className="absolute inset-0 bg-black/50" aria-label="Cerrar" onClick={() => setFormOpen(false)} />
          <div role="dialog" aria-modal="true" className="relative w-full max-w-2xl rounded-3xl bg-white border shadow-xl overflow-hidden">
            <div className="p-5 border-b flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-lg font-bold text-gray-800">Tu testimonio</div>
                <div className="text-sm text-gray-600">Comparte tu opinión del proceso.</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setFormOpen(false)} className="rounded-xl">
                  Cerrar
                </Button>
                <Button onClick={() => void saveMy()} disabled={!canSave} className="bg-gradient-to-r from-primary to-accent text-white rounded-xl">
                  {saving ? 'Guardando...' : my ? 'Actualizar' : 'Enviar'}
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {myError ? <div className="text-sm text-red-600">{myError}</div> : null}
              {myLoading ? <div className="text-sm text-gray-600">Cargando...</div> : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Título (opcional)</label>
                  <input
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Ej. Me siento en paz"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Calificación</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} type="button" onClick={() => setFormRating(n)} className="p-1" aria-label={`Calificación ${n}`}>
                        <Star className={`h-5 w-5 ${n <= formRating ? 'text-amber-400 fill-current' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">Tu opinión</label>
                <textarea
                  value={formQuote}
                  onChange={(e) => setFormQuote(e.target.value)}
                  className="w-full min-h-[180px] rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Cuéntanos cómo fue tu proceso (mínimo 20 caracteres)."
                />
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Privacidad
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  Comparte lo que te haga sentir cómodo, sin detalles sensibles. Tu testimonio se muestra con tu nombre.
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </PublicLayout>
  );
};

export default TestimonialsPage;
