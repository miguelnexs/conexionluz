import React, { useState } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { Newspaper, Clock, Tag, Search, ChevronRight, Heart, Brain, Leaf, Smile, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type Article = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  color: string;
  icon: React.ElementType;
  featured?: boolean;
  tags: string[];
};

const ARTICLES: Article[] = [
  {
    id: '1',
    title: '5 señales de que tu ansiedad necesita atención profesional',
    excerpt: 'La ansiedad es una respuesta normal al estrés, pero cuando interfiere con tu vida cotidiana, es momento de buscar ayuda. Te contamos cuáles son las señales clave que no debes ignorar.',
    category: 'Ansiedad',
    readTime: '5 min',
    date: '20 May 2025',
    color: '#6366f1',
    icon: Brain,
    featured: true,
    tags: ['Ansiedad', 'Salud mental', 'Ayuda profesional'],
  },
  {
    id: '2',
    title: 'Cómo el mindfulness transforma tu relación con las emociones',
    excerpt: 'La práctica de la atención plena no es solo meditación. Descubre cómo el mindfulness puede cambiar la forma en que procesas y respondes a tus emociones difíciles.',
    category: 'Mindfulness',
    readTime: '7 min',
    date: '15 May 2025',
    color: '#10b981',
    icon: Leaf,
    featured: true,
    tags: ['Mindfulness', 'Emociones', 'Bienestar'],
  },
  {
    id: '3',
    title: 'El duelo: aprender a vivir con la pérdida',
    excerpt: 'El duelo no sigue un camino recto. Conoce las diferentes formas en que las personas viven el proceso y cómo acompañarse a uno mismo y a otros en este camino.',
    category: 'Duelo',
    readTime: '8 min',
    date: '10 May 2025',
    color: '#8b5cf6',
    icon: Heart,
    tags: ['Duelo', 'Pérdida', 'Acompañamiento'],
  },
  {
    id: '4',
    title: 'Autocompasión: el antídoto para la autocrítica destructiva',
    excerpt: 'La autocrítica excesiva puede ser un obstáculo enorme para la salud mental. Aprende técnicas basadas en la ciencia para tratarte con la misma amabilidad que le darías a un amigo.',
    category: 'Autoestima',
    readTime: '6 min',
    date: '5 May 2025',
    color: '#ec4899',
    icon: Smile,
    tags: ['Autoestima', 'Autocompasión', 'Autocrítica'],
  },
  {
    id: '5',
    title: 'El sueño y la salud mental: una relación bidireccional',
    excerpt: '¿Sabes que el insomnio y la depresión se alimentan mutuamente? Exploramos la ciencia del sueño y técnicas prácticas para mejorar tanto el descanso como el bienestar emocional.',
    category: 'Hábitos',
    readTime: '6 min',
    date: '28 Abr 2025',
    color: '#0ea5e9',
    icon: Brain,
    tags: ['Sueño', 'Depresión', 'Hábitos saludables'],
  },
  {
    id: '6',
    title: 'Terapia de pareja: ¿cuándo es el momento de ir?',
    excerpt: 'Muchas parejas esperan demasiado tiempo antes de buscar ayuda. Te contamos los indicadores que sugieren que una terapia de pareja puede ser un antes y un después en tu relación.',
    category: 'Relaciones',
    readTime: '5 min',
    date: '20 Abr 2025',
    color: '#f59e0b',
    icon: Heart,
    tags: ['Pareja', 'Comunicación', 'Terapia'],
  },
  {
    id: '7',
    title: 'Inteligencia emocional en el trabajo: más allá del rendimiento',
    excerpt: 'La inteligencia emocional es uno de los predictores más sólidos de éxito profesional y satisfacción laboral. Descubre sus cuatro pilares y cómo desarrollarla.',
    category: 'Trabajo',
    readTime: '7 min',
    date: '12 Abr 2025',
    color: '#10b981',
    icon: Brain,
    tags: ['IE', 'Trabajo', 'Burnout'],
  },
  {
    id: '8',
    title: 'La soledad en la era de las redes sociales',
    excerpt: 'Paradójicamente, somos la generación más "conectada" y también la más sola. Exploramos por qué las conexiones digitales no satisfacen nuestras necesidades relacionales profundas.',
    category: 'Relaciones',
    readTime: '9 min',
    date: '5 Abr 2025',
    color: '#6366f1',
    icon: Smile,
    tags: ['Soledad', 'Redes sociales', 'Conexión'],
  },
];

const CATEGORIES = ['Todos', 'Ansiedad', 'Mindfulness', 'Duelo', 'Autoestima', 'Hábitos', 'Relaciones', 'Trabajo'];

function ArticleCard({ article }: { article: Article }) {
  const Icon = article.icon;
  return (
    <article className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
      {/* Top color bar */}
      <div className="h-1.5 w-full" style={{ background: article.color }} />
      <div className="p-5 flex flex-col flex-1">
        {/* Category & time */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: `${article.color}12`, color: article.color }}>
            {article.category}
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="h-3 w-3" /> {article.readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-black text-slate-800 leading-tight text-[15px] mb-2 group-hover:text-indigo-700 transition-colors">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">{article.excerpt}</p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
          <span className="text-xs text-slate-400">{article.date}</span>
          <button className="flex items-center gap-1 text-xs font-bold transition-all duration-200" style={{ color: article.color }}>
            Leer más <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
}

function FeaturedCard({ article }: { article: Article }) {
  const Icon = article.icon;
  return (
    <article className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 bg-white border border-slate-100">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, black 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${article.color}, ${article.color}88)` }} />
      <div className="p-7">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${article.color}12` }}>
            <Icon className="h-7 w-7" style={{ color: article.color }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: `${article.color}12`, color: article.color }}>{article.category}</span>
              <span className="text-[10px] font-bold text-white px-2.5 py-1 rounded-full bg-amber-400">Destacado</span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto"><Clock className="h-3 w-3" />{article.readTime}</span>
            </div>
            <h3 className="font-black text-slate-800 text-xl leading-tight mb-2 group-hover:text-indigo-700 transition-colors">{article.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{article.excerpt}</p>
            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map(t => (
                  <span key={t} className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
              <button className="flex items-center gap-1.5 font-bold text-sm px-4 py-2 rounded-xl transition-all hover:scale-105" style={{ background: `${article.color}15`, color: article.color }}>
                Leer <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function BlogPage() {
  const [cat, setCat] = useState('Todos');
  const [search, setSearch] = useState('');

  const featured = ARTICLES.filter(a => a.featured);
  const filtered = ARTICLES.filter(a => {
    const matchCat = cat === 'Todos' || a.category === cat;
    const matchSearch = search === '' || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch && !a.featured;
  });

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl mb-10 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '35px 35px' }} />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <Newspaper className="h-4 w-4" />
              <span className="text-sm font-bold">Conocimiento para tu bienestar</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3">Blog & Artículos</h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-lg">
              Contenido terapéutico de calidad, escrito y revisado por nuestros profesionales. Aprende, reflexiona y crece.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar artículos…"
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 flex-wrap mb-8 overflow-x-auto pb-1">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn('px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap', cat === c ? 'bg-indigo-500 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600')}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Featured (only when no search/filter) */}
        {cat === 'Todos' && search === '' && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-amber-500" />
              <h2 className="font-black text-slate-800 text-lg">Artículos destacados</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {featured.map(a => <FeaturedCard key={a.id} article={a} />)}
            </div>
          </div>
        )}

        {/* All articles */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-slate-800">{cat === 'Todos' && !search ? 'Todos los artículos' : 'Resultados'}</h2>
            <span className="text-xs text-slate-400">{filtered.length} artículo{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-14">
              <div className="text-5xl mb-3">📰</div>
              <h3 className="font-black text-slate-700">No encontramos artículos</h3>
              <p className="text-slate-400 text-sm mt-1">Intenta con otras palabras o categorías.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(a => <ArticleCard key={a.id} article={a} />)}
            </div>
          )}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-7 text-white text-center">
          <Newspaper className="h-8 w-8 mx-auto mb-3 opacity-80" />
          <h3 className="text-xl font-black mb-2">Recibe contenido de bienestar cada semana</h3>
          <p className="text-white/75 text-sm mb-5">Artículos, recursos y herramientas terapéuticas directamente en tu correo.</p>
          <Link to="/contacto" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-black px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            Suscribirme <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </PublicLayout>
  );
}
