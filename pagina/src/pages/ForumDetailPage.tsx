import { useEffect, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { ArrowLeft, MessageSquareText, Calendar, Clock, Pin, Lock, MessageCircle, Send, User, LogIn } from 'lucide-react';
import { api } from '../api/client';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams, Link } from 'react-router-dom';

type ForumReply = {
  id: number;
  topicId: number;
  content: string;
  authorName: string;
  patientId: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type ForumTopic = {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string | null;
  isPinned: boolean;
  isLocked: boolean;
  isActive: boolean;
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
  replies: ForumReply[];
};

const ForumDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthed = typeof window !== 'undefined' && Boolean(localStorage.getItem('conexionluz:token'));

  // Reply form
  const [replyContent, setReplyContent] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await api.get<ForumTopic>(`/api/public/forum/${id}/`);
      if (res.ok === false) {
        setError(res.error);
        setLoading(false);
        return;
      }
      setTopic(res.data);
      setLoading(false);
    };
    void load();
  }, [id]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !replyContent.trim()) return;
    setSendingReply(true);
    setReplyError(null);

    const res = await api.post<ForumReply>(`/api/public/forum/${topic.id}/reply/`, { content: replyContent.trim() });
    if (res.ok === false) {
      setReplyError(res.error);
      setSendingReply(false);
      return;
    }
    setTopic({
      ...topic,
      replies: [...topic.replies, res.data],
      repliesCount: topic.repliesCount + 1,
    });
    setReplyContent('');
    setSendingReply(false);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

  const formatShortDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });

  // Loading
  if (loading) {
    return (
      <PublicLayout contentClassName="p-0">
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-32 rounded-2xl bg-gray-200 animate-pulse" />
          <div className="h-10 w-3/4 bg-gray-200 rounded-xl animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Error / Not found
  if (error || !topic) {
    return (
      <PublicLayout contentClassName="p-0">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={() => navigate('/foro')}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-10"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al foro
          </button>
          <div className="flex flex-col items-center justify-center py-20 rounded-3xl border border-gray-100 bg-gray-50">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MessageSquareText className="h-7 w-7 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-1">Tema no encontrado</p>
            <p className="text-sm text-gray-500">{error || 'El tema que buscas no existe o fue eliminado.'}</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout contentClassName="p-0">
      {/* Topic header */}
      <section className="py-10 bg-gradient-to-br from-primary/10 via-white to-accent/10">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate('/foro')}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al foro
          </button>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {topic.isPinned && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                <Pin className="h-3 w-3" /> Fijado
              </span>
            )}
            {topic.isLocked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                <Lock className="h-3 w-3" /> Cerrado
              </span>
            )}
            {topic.category && (
              <span className="inline-flex items-center rounded-full bg-white/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-primary border border-gray-200">
                {topic.category}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-4">
            {topic.title}
          </h1>

          {topic.imageUrl && (
            <div className="relative h-52 md:h-64 rounded-2xl overflow-hidden mb-4">
              <img src={topic.imageUrl} alt={topic.title} className="w-full h-full object-cover" />
            </div>
          )}

          {topic.description && (
            <p className="text-base text-gray-600 mb-4">{topic.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-4 py-2.5">
              <MessageCircle className="h-4 w-4 text-violet-500" />
              <span className="font-medium text-gray-700">{topic.repliesCount} respuesta{topic.repliesCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-4 py-2.5">
              <Calendar className="h-4 w-4 text-amber-500" />
              <span className="font-medium text-gray-700">{formatDate(topic.createdAt)}</span>
            </div>
            {topic.updatedAt !== topic.createdAt && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-4 py-2.5">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Actualizado {formatShortDate(topic.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Replies */}
      <section className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Respuestas ({topic.replies.length})
          </h2>

          {topic.replies.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center">
              <p className="text-gray-500 text-sm">Sé el primero en responder a este tema.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topic.replies.map((reply, index) => (
                <div
                  key={reply.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-5 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{reply.authorName}</p>
                      <p className="text-xs text-gray-400">
                        {formatShortDate(reply.createdAt)} a las {formatTime(reply.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{reply.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Reply form */}
          {topic.isLocked ? (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center">
              <Lock className="h-5 w-5 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Este tema está cerrado y no admite nuevas respuestas.</p>
            </div>
          ) : !isAuthed ? (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center space-y-3">
              <LogIn className="h-5 w-5 text-primary mx-auto" />
              <p className="text-sm text-gray-700 font-medium">Inicia sesión para participar en el foro</p>
              <p className="text-xs text-gray-500">Solo los usuarios registrados pueden responder a los temas de discusión.</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
              >
                <LogIn className="h-4 w-4" />
                Iniciar sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSendReply} className="rounded-2xl border border-gray-100 bg-gray-50 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Send className="h-4 w-4 text-primary" />
                Deja tu respuesta
              </h3>

              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                placeholder="Escribe tu respuesta..."
                required
              />

              {replyError && (
                <p className="text-sm text-red-600">{replyError}</p>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={sendingReply || !replyContent.trim()}
                  className="bg-gradient-to-r from-primary to-accent text-white rounded-xl"
                >
                  {sendingReply ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" /></svg>
                      Enviando...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Enviar respuesta
                    </span>
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* CTA */}
          <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-primary/5 to-accent/5 p-8 text-center space-y-4">
            <h3 className="text-xl font-bold text-gray-800">¿Necesitas ayuda profesional?</h3>
            <p className="text-sm text-gray-600 max-w-lg mx-auto">
              Nuestro equipo de terapeutas está listo para acompañarte en tu proceso de bienestar.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={() => navigate('/agenda')} className="bg-gradient-to-r from-primary to-accent text-white rounded-xl">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar cita
              </Button>
              <Button variant="outline" onClick={() => navigate('/foro')} className="rounded-xl border-primary text-primary hover:bg-primary/10 hover:text-primary">
                <MessageSquareText className="h-4 w-4 mr-2" />
                Volver al foro
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default ForumDetailPage;
