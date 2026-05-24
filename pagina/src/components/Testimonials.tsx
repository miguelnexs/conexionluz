
import React, { useMemo, useState, useEffect } from 'react';
import { Heart, Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../api/client';

type Testimonial = {
  id: number;
  name: string;
  title?: string;
  quote: string;
  rating: number;
  likesCount?: number;
};

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

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIdsState] = useState<number[]>(() => getLikedIds());
  const likedSet = useMemo(() => new Set(likedIds), [likedIds]);

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const toggleLike = async (id: number) => {
    const liked = likedSet.has(id);
    const res = liked
      ? await api.del<{ testimonialId: number; likesCount: number; liked: boolean }>(`/api/public/testimonials/${id}/like/`)
      : await api.post<{ testimonialId: number; likesCount: number; liked: boolean }>(`/api/public/testimonials/${id}/like/`, {});
    if (!res.ok) return;
    setTestimonials((prev) => prev.map((t) => (t.id === res.data.testimonialId ? { ...t, likesCount: res.data.likesCount } : t)));
    const next = res.data.liked ? Array.from(new Set([...likedIds, id])) : likedIds.filter((x) => x !== id);
    setLikedIds(next);
    setLikedIdsState(next);
  };

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const res = await api.get<Testimonial[]>('/api/public/testimonials/');
      if (res.ok) setTestimonials(res.data);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!testimonials.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    if (!testimonials.length) return;
    if (currentIndex < testimonials.length) return;
    setCurrentIndex(0);
  }, [currentIndex, testimonials.length]);

  if (!loading && testimonials.length === 0) return null;
  const current = testimonials[currentIndex];
  const total = testimonials.length;
  const avg = total ? testimonials.reduce((acc, x) => acc + (x.rating || 5), 0) / total : 0;
  const avgRounded = avg ? Math.round(avg * 10) / 10 : 0;
  const fiveStars = total ? testimonials.filter((x) => (x.rating || 5) === 5).length : 0;
  const likesTotal = total ? testimonials.reduce((acc, x) => acc + (x.likesCount || 0), 0) : 0;

  return (
    <section id="testimonios" className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg">
            <Quote className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-gray-700">Testimonios</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Historias de Transformación
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Conoce las experiencias reales de personas que han encontrado su camino hacia el bienestar
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-12">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative p-12 md:p-16">
              {/* Quote Icon */}
              <Quote className="h-16 w-16 text-primary/20 mb-8" />

              {/* Testimonial Content */}
              <div className="mb-8">
                <p className="text-2xl md:text-3xl text-gray-800 leading-relaxed mb-6 font-light">
                  "{loading ? 'Cargando…' : current?.quote || ''}"
                </p>
                {current?.title ? (
                  <div className="inline-block bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-full text-sm font-medium">
                    {current.title}
                  </div>
                ) : null}
                {!loading && current ? (
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => void toggleLike(current.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <Heart className={`h-4 w-4 ${likedSet.has(current.id) ? 'text-rose-500 fill-current' : 'text-gray-500'}`} />
                      <span>{current.likesCount || 0}</span>
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Author Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center font-bold text-xl shadow-lg">
                  {current?.name ? initials(current.name) : ''}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-800">
                    {loading ? '' : current?.name || ''}
                  </h4>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1 mt-2">
                    {[...Array(Math.max(1, Math.min(5, current?.rating || 5)))].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons - Outside overflow-hidden */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 sm:-left-6 z-10">
            <button
              onClick={prevTestimonial}
              className="bg-white shadow-lg rounded-full p-3 hover:shadow-xl transform hover:scale-110 transition-all duration-300 border border-gray-100"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 right-0 sm:-right-6 z-10">
            <button
              onClick={nextTestimonial}
              className="bg-white shadow-lg rounded-full p-3 hover:shadow-xl transform hover:scale-110 transition-all duration-300 border border-gray-100"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="group">
            <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
              {loading ? '—' : total}
            </div>
            <div className="text-gray-600">Testimonios</div>
          </div>
          <div className="group">
            <div className="text-4xl font-bold text-accent mb-2 group-hover:scale-110 transition-transform duration-300">
              {loading ? '—' : likesTotal}
            </div>
            <div className="text-gray-600">Me gusta</div>
          </div>
          <div className="group">
            <div className="text-4xl font-bold text-amber-500 mb-2 group-hover:scale-110 transition-transform duration-300">
              {loading ? '—' : `${avgRounded}★`}
            </div>
            <div className="text-gray-600">Calificación Promedio</div>
          </div>
          <div className="group">
            <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
              {loading ? '—' : fiveStars}
            </div>
            <div className="text-gray-600">5 estrellas</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
