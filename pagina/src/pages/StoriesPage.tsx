import { useEffect, useMemo, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { BookOpen, Calendar, Search, Sparkles, Heart, MessageCircle } from 'lucide-react';
import { api } from '../api/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

type Story = {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  author: string;
  category: string;
  tags: string[];
  patientId: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  likesCount?: number;
  commentsCount?: number;
};

const StoriesPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const res = await api.get<Story[]>('/api/public/stories/');
    if (res.ok === false) {
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

  const categories = useMemo(() => {
    const cats = new Set(items.map((s) => s.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [items]);

  const filtered = useMemo(() => {
    let list = items;
    if (selectedCategory) {
      list = list.filter((s) => s.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          (s.title || '').toLowerCase().includes(q) ||
          (s.author || '').toLowerCase().includes(q) ||
          (s.category || '').toLowerCase().includes(q) ||
          (s.tags || []).some((t) => (t || '').toLowerCase().includes(q))
      );
    }
    return list;
  }, [items, selectedCategory, search]);

  const stats = useMemo(() => {
    return {
      total: items.length,
      categories: new Set(items.map((s) => s.category).filter(Boolean)).size,
      authors: new Set(items.map((s) => s.author).filter(Boolean)).size,
    };
  }, [items]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <PublicLayout contentClassName="p-0">
      {/* Hero */}
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
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-gray-700">Historias</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Historias que inspiran
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Cada historia es un paso hacia la transformación. Conoce las experiencias de quienes ya han recorrido este camino.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => navigate('/agenda')} className="bg-gradient-to-r from-primary to-accent text-white rounded-xl">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar cita
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/testimonios')} className="rounded-xl border-primary text-primary hover:bg-primary/10 hover:text-primary">
                    Ver testimonios
                  </Button>
                </div>
              </div>

              <div className="w-full lg:max-w-sm">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-xl p-6 space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-gray-800">Resumen</div>
                      <div className="text-xs text-gray-500">Historias publicadas</div>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center border border-gray-200">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center">
                      <div className="text-2xl font-bold text-gray-800">{loading ? '—' : stats.total}</div>
                      <div className="text-xs text-gray-600">Historias</div>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center">
                      <div className="text-2xl font-bold text-gray-800">{loading ? '—' : stats.categories}</div>
                      <div className="text-xs text-gray-600">Categorías</div>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center">
                      <div className="text-2xl font-bold text-gray-800">{loading ? '—' : stats.authors}</div>
                      <div className="text-xs text-gray-600">Autores</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search + Filter + Stories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por título, autor o etiqueta..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
              {categories.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                      !selectedCategory
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-primary/30 hover:text-primary'
                    }`}
                  >
                    Todas
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                        selectedCategory === cat
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-primary/30 hover:text-primary'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Result count */}
            <p className="text-sm text-gray-500">
              {filtered.length} historia{filtered.length !== 1 ? 's' : ''}
              {search || selectedCategory ? ' encontrada' + (filtered.length !== 1 ? 's' : '') : ''}
            </p>

            {error ? <div className="text-sm text-red-600">{error}</div> : null}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden">
                    <div className="h-48 bg-gray-200 animate-pulse" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-11/12 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-3xl border border-gray-100 bg-gray-50">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <BookOpen className="h-7 w-7 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-1">
                  {search || selectedCategory ? 'No se encontraron historias' : 'Aún no hay historias publicadas'}
                </p>
                <p className="text-sm text-gray-500">
                  {search ? 'Intenta con otros términos de búsqueda' : 'Pronto compartiremos más experiencias'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-animation">
                {filtered.map((story, index) => (
                  <div
                    key={story.id}
                    onClick={() => navigate(`/historias/${story.id}`)}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] animate-fade-in group cursor-pointer"
                    style={{ animationDelay: `${index * 0.06}s` }}
                  >
                    {/* Image */}
                    {story.imageUrl && (
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={story.imageUrl}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                    )}

                    {/* Title & Stats */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-2 flex-1 mb-4">
                        {story.title}
                      </h3>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-xs font-bold text-gray-400">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-full group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                            {story.likesCount || 0}
                          </span>
                          <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-full group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                            <MessageCircle className="h-3.5 w-3.5 text-primary" />
                            {story.commentsCount || 0}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(story.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default StoriesPage;
