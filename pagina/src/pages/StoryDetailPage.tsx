import { useEffect, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { ArrowLeft, BookOpen, Calendar, Clock, ImageIcon, Tag, User } from 'lucide-react';
import { api } from '../api/client';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';

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
};

const StoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await api.get<Story>(`/api/public/stories/${id}/`);
      if (res.ok === false) {
        setError(res.error);
        setLoading(false);
        return;
      }
      setStory(res.data);
      setLoading(false);
    };
    void load();
  }, [id]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

  // Loading
  if (loading) {
    return (
      <PublicLayout contentClassName="p-0">
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-72 rounded-2xl bg-gray-200 animate-pulse" />
          <div className="h-10 w-3/4 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${95 - i * 5}%` }} />
            ))}
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Error / Not found
  if (error || !story) {
    return (
      <PublicLayout contentClassName="p-0">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={() => navigate('/historias')}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-10"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a historias
          </button>
          <div className="flex flex-col items-center justify-center py-20 rounded-3xl border border-gray-100 bg-gray-50">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <BookOpen className="h-7 w-7 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-1">Historia no encontrada</p>
            <p className="text-sm text-gray-500">{error || 'La historia que buscas no existe o fue eliminada.'}</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout contentClassName="p-0">
      {/* Hero image */}
      <div className="relative">
        {story.imageUrl ? (
          <div className="relative w-full h-64 md:h-96 overflow-hidden">
            <img
              src={story.imageUrl}
              alt={story.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="max-w-4xl mx-auto">
                {story.category && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-gray-700 shadow-sm mb-4">
                    <Tag className="h-3 w-3" />
                    {story.category}
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {story.title}
                </h1>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-48 md:h-64 bg-gradient-to-br from-primary/10 via-white to-accent/10 flex items-center justify-center">
            <ImageIcon className="h-20 w-20 text-gray-200" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="max-w-4xl mx-auto">
                {story.category && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-gray-700 shadow-sm mb-4">
                    <Tag className="h-3 w-3" />
                    {story.category}
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                  {story.title}
                </h1>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content area */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {/* Back link */}
          <button
            onClick={() => navigate('/historias')}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a historias
          </button>

          {/* Meta info cards */}
          <div className="flex flex-wrap items-center gap-3">
            {story.author && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-gray-700">{story.author}</span>
              </div>
            )}
            <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
              <Calendar className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">{formatDate(story.createdAt)}</span>
            </div>
            {story.updatedAt !== story.createdAt && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Actualizada el {formatDate(story.updatedAt)} a las {formatTime(story.updatedAt)}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {story.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {story.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Story content */}
          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 md:p-10">
            <div
              className="prose prose-base md:prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl prose-p:text-gray-700 prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: story.content }}
            />
          </div>

          {/* CTA */}
          <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-primary/5 to-accent/5 p-8 text-center space-y-4">
            <h3 className="text-xl font-bold text-gray-800">¿Te identificas con esta historia?</h3>
            <p className="text-sm text-gray-600 max-w-lg mx-auto">
              Cada paso hacia el bienestar comienza con una decisión. Si sientes que es tu momento, estamos aquí para acompañarte.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={() => navigate('/agenda')} className="bg-gradient-to-r from-primary to-accent text-white rounded-xl">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar cita
              </Button>
              <Button variant="outline" onClick={() => navigate('/historias')} className="rounded-xl border-primary text-primary hover:bg-primary/10 hover:text-primary">
                <BookOpen className="h-4 w-4 mr-2" />
                Ver más historias
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default StoryDetailPage;
