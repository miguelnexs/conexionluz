import { useEffect, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { ArrowLeft, MessageSquareText, Calendar, Clock, Pin, Lock, MessageCircle, Send, User, LogIn } from 'lucide-react';
import { api } from '../api/client';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

type ForumReply = {
  id: number;
  topicId: number;
  content: string;
  contentHtml?: string;
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
  descriptionHtml?: string;
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
      <section className="py-12 bg-gradient-to-b from-blue-50/50 via-white to-white">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate('/foro')}
            className="group inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-all mb-8"
          >
            <div className="h-8 w-8 rounded-full border border-gray-100 bg-white flex items-center justify-center group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
              <ArrowLeft className="h-4 w-4" />
            </div>
            Volver al foro
          </button>

          <div className="space-y-6">
            <div className="flex items-center gap-2 flex-wrap">
              {topic.isPinned && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-600 border border-amber-100">
                  <Pin className="h-3 w-3" /> Fijado
                </span>
              )}
              {topic.isLocked && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-rose-600 border border-rose-100">
                  <Lock className="h-3 w-3" /> Cerrado
                </span>
              )}
              {topic.category && (
                <span className="inline-flex items-center rounded-full bg-primary/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
                  {topic.category}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
              {topic.title}
            </h1>

            <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-3 w-3" />
                </div>
                <span className="text-gray-600">Comunidad ConexiónLuz</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-gray-300" />
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(topic.createdAt)}
              </div>
            </div>

            {topic.imageUrl && (
              <div className="relative rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl shadow-primary/5">
                <img src={topic.imageUrl} alt={topic.title} className="w-full h-auto object-cover max-h-[400px]" />
              </div>
            )}

            {topic.descriptionHtml ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-p:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: topic.descriptionHtml }}
                />
              </div>
            ) : topic.description ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">{topic.description}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Replies */}
      <section className="py-12 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              Discusion <span className="text-primary">({topic.replies.length})</span>
            </h2>
          </div>

          {topic.replies.length === 0 ? (
            <div className="rounded-[2.5rem] border border-dashed border-gray-200 bg-white p-16 text-center">
              <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <MessageSquareText className="h-7 w-7 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">Aún no hay respuestas. ¡Inicia la conversación!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {topic.replies.map((reply, index) => (
                <motion.div
                  key={reply.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0 border border-primary/5 text-primary font-black">
                      {reply.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <p className="text-base font-bold text-gray-900">{reply.authorName}</p>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                          {formatShortDate(reply.createdAt)} • {formatTime(reply.createdAt)}
                        </p>
                      </div>
                      <div className="h-0.5 w-8 bg-primary/20 rounded-full mt-2" />
                    </div>
                  </div>
                  {reply.contentHtml ? (
                    <div 
                      className="prose prose-sm dark:prose-invert max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: reply.contentHtml }}
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Reply form */}
          <div className="pt-8">
            {topic.isLocked ? (
              <div className="rounded-3xl border border-rose-100 bg-rose-50/30 p-8 text-center">
                <Lock className="h-6 w-6 text-rose-400 mx-auto mb-3" />
                <p className="text-sm font-bold text-rose-600 uppercase tracking-widest">Tema Cerrado</p>
                <p className="text-xs text-rose-500 mt-1">Este debate ya no acepta más contribuciones.</p>
              </div>
            ) : !isAuthed ? (
              <div className="rounded-[2.5rem] border border-gray-100 bg-white p-10 text-center shadow-xl shadow-primary/5">
                <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center mx-auto mb-6">
                  <LogIn className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Únete a la conversación</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
                  Para participar y compartir tu opinión, necesitas estar registrado en nuestra comunidad.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  Iniciar sesión ahora
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSendReply} className="rounded-[2.5rem] border border-gray-100 bg-white p-8 md:p-10 shadow-xl shadow-primary/5 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <Send className="h-5 w-5 text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900">Escribir una respuesta</h3>
                </div>

                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={5}
                  className="w-full px-6 py-5 rounded-3xl border border-gray-100 bg-gray-50 text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all resize-none"
                  placeholder="Tu contribución es importante..."
                  required
                />

                {replyError && (
                  <p className="text-xs font-bold text-rose-500 px-2">{replyError}</p>
                )}

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={sendingReply || !replyContent.trim()}
                    className="h-14 px-10 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                  >
                    {sendingReply ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" /></svg>
                        Publicando...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Publicar respuesta
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* CTA Section */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 p-10 md:p-14 text-center">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-[100px]" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl md:text-3xl font-black text-white">¿Buscas apoyo personalizado?</h3>
              <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                A veces la conversación grupal es el primer paso, pero un acompañamiento individual puede marcar la diferencia definitiva.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button onClick={() => navigate('/agenda')} className="h-14 px-8 bg-white text-gray-900 rounded-2xl font-black hover:bg-gray-100 transition-all">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Agendar Sesión
                </Button>
                <Button variant="outline" onClick={() => navigate('/foro')} className="h-14 px-8 border-white/20 text-white rounded-2xl font-black hover:bg-white/5 transition-all">
                  Explorar otros temas
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};


export default ForumDetailPage;
