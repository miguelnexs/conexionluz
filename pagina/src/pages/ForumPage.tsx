import { useEffect, useMemo, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { MessageSquareText, Search, Sparkles, Calendar, MessageCircle, Pin, Lock, ChevronRight } from 'lucide-react';
import { api } from '../api/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type ForumTopic = {
  id: number;
  title: string;
  description: string;
  descriptionHtml?: string;
  category: string;
  imageUrl: string | null;
  isPinned: boolean;
  isLocked: boolean;
  isActive: boolean;
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
};

const ForumPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const res = await api.get<ForumTopic[]>('/api/public/forum/');
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
    const cats = new Set(items.map((t) => t.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [items]);

  const filtered = useMemo(() => {
    let list = items;
    if (selectedCategory) {
      list = list.filter((t) => t.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, selectedCategory, search]);

  const stats = useMemo(() => {
    return {
      total: items.length,
      categories: new Set(items.map((t) => t.category).filter(Boolean)).size,
      totalReplies: items.reduce((sum, t) => sum + t.repliesCount, 0),
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
                  <MessageSquareText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-gray-700">Foro de Discusión</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Comunidad ConexiónLuz
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Un espacio seguro para compartir experiencias, resolver dudas y conectar con otros en el camino del bienestar.
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
                      <div className="text-sm font-semibold text-gray-800">Comunidad</div>
                      <div className="text-xs text-gray-500">Temas activos</div>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center border border-gray-200">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center">
                      <div className="text-2xl font-bold text-gray-800">{loading ? '—' : stats.total}</div>
                      <div className="text-xs text-gray-600">Temas</div>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center">
                      <div className="text-2xl font-bold text-gray-800">{loading ? '—' : stats.totalReplies}</div>
                      <div className="text-xs text-gray-600">Respuestas</div>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center">
                      <div className="text-2xl font-bold text-gray-800">{loading ? '—' : stats.categories}</div>
                      <div className="text-xs text-gray-600">Categorías</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search + Filter + Topics */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Search & Filters */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6 bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-gray-100 shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por título, descripción o categoría..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white/80 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {categories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pr-4 border-r border-gray-200">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        !selectedCategory
                          ? 'bg-primary text-white shadow-md shadow-primary/20'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Todos
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                          selectedCategory === cat
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* New Topic Button (Placeholder for functionality as public API might not allow POST directly without specific auth handling) */}
                {typeof window !== 'undefined' && localStorage.getItem('conexionluz:token') && (
                  <Button 
                    onClick={() => navigate('/mi-perfil')} // Redirect to profile or a future create topic page
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-all"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Nuevo Tema
                  </Button>
                )}
              </div>
            </div>

            {/* Result count */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Mostrando <span className="text-gray-900 font-bold">{filtered.length}</span> tema{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>

            {error ? <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div> : null}

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-3xl border border-gray-100 bg-gray-50/50 p-6 h-48 animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 rounded-[2rem] border border-dashed border-gray-200 bg-gray-50/50">
                <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-6">
                  <MessageSquareText className="h-9 w-9 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {search || selectedCategory ? 'No hay resultados' : 'El foro está tranquilo'}
                </h3>
                <p className="text-sm text-gray-500 max-w-xs text-center leading-relaxed">
                  {search ? 'Prueba con otros términos o limpia los filtros para ver todos los temas.' : '¡Sé el primero en iniciar una conversación compartiendo tus pensamientos!'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 stagger-animation">
                {filtered.map((topic, index) => (
                  <div
                    key={topic.id}
                    onClick={() => navigate(`/foro/${topic.id}`)}
                    className={cn(
                      "group cursor-pointer relative overflow-hidden rounded-[2rem] border transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 bg-white",
                      topic.isPinned ? "border-amber-100 bg-amber-50/20" : "border-gray-100"
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {topic.isPinned && (
                      <div className="absolute top-0 right-0 px-4 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-bl-2xl flex items-center gap-1.5 z-10">
                        <Pin className="h-3 w-3" /> Destacado
                      </div>
                    )}
                    
                    <div className="p-8 h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        {topic.category && (
                          <span className="inline-flex items-center rounded-xl bg-primary/5 px-3 py-1 text-[11px] font-bold text-primary border border-primary/10">
                            {topic.category}
                          </span>
                        )}
                        {topic.isLocked && <Lock className="h-3.5 w-3.5 text-rose-400" />}
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight mb-3">
                        {topic.title}
                      </h3>
                      
                      <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-6 flex-1">
                        {topic.description || (topic.descriptionHtml ? topic.descriptionHtml.replace(/<[^>]*>/g, '').slice(0, 160) + '...' : 'Sin descripción disponible para este tema.')}
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                          <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                            <MessageCircle className="h-3.5 w-3.5" />
                            {topic.repliesCount}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(topic.updatedAt)}
                          </span>
                        </div>
                        <div className="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                          <ChevronRight className="h-5 w-5" />
                        </div>
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

export default ForumPage;
