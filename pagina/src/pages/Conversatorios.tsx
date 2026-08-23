
import React, { useEffect, useMemo, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { Calendar as CalendarIcon, Users, Clock, Search, Bell, CheckCircle, Info, CalendarDays, PlayCircle, Sparkles } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { addDays, format, parseISO, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

type PublicTalk = {
  id: number;
  title: string;
  description?: string;
  topic?: string;
  speaker?: string;
  organizer?: string;
  modality?: string;
  startAt: string;
  endAt?: string | null;
  format: 'online' | 'presential';
  audience: string;
  agenda: string[];
  participants: number;
  status: 'past' | 'future';
  isRegistered?: boolean;
  videoUrl?: string | null;
  featuredVideoUrl?: string | null;
};

type ConversatorioUi = {
  id: string;
  title: string;
  description: string;
  date: string;
  end_date?: string;
  time: string;
  speaker: string;
  organizer?: string;
  modality?: string;
  participants: number;
  agenda: string[];
  status: 'past' | 'future';
  topic: string;
  isRegistered: boolean;
  videoUrl?: string | null;
  featuredVideoUrl?: string | null;
};

const ConversatoriosPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterTopic, setFilterTopic] = useState('Todos');
  const [talks, setTalks] = useState<PublicTalk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      setError(null);
      const res = await api.get<PublicTalk[]>('/api/public/talks/');
      if (!res.ok) {
        setError(res.error);
        setLoading(false);
        return;
      }
      const validTalks = (res.data || []).filter(
        (t) => t && typeof t.startAt === 'string' && !isNaN(new Date(t.startAt).getTime())
      );
      setTalks(validTalks);
      setLoading(false);
    })();
  }, []);

  const allConversatorios: ConversatorioUi[] = useMemo(() => {
    return talks.map((t) => {
      const topic = t.topic || 'General';
      const speaker = t.speaker || '—';
      const start = parseISO(t.startAt);
      const end = t.endAt && typeof t.endAt === 'string' && !isNaN(new Date(t.endAt).getTime()) ? parseISO(t.endAt) : null;
      const time = `${format(start, 'h:mm a', { locale: es })}${end ? ` - ${format(end, 'h:mm a', { locale: es })}` : ''}`;
      const modality = t.modality || (t.format === 'presential' ? 'Presencial' : 'Online');
      return {
        id: String(t.id),
        title: t.title,
        description: t.description || '',
        date: t.startAt,
        end_date: t.endAt || undefined,
        time,
        speaker,
        organizer: t.organizer || undefined,
        modality,
        participants: typeof t.participants === 'number' ? t.participants : 0,
        agenda: Array.isArray(t.agenda) ? t.agenda : [],
        status: t.status,
        topic,
        isRegistered: Boolean(t.isRegistered),
        videoUrl: t.videoUrl || null,
        featuredVideoUrl: t.featuredVideoUrl || null
      };
    });
  }, [talks]);

  const topics = useMemo(() => ['Todos', ...Array.from(new Set(allConversatorios.map((c) => c.topic)))], [allConversatorios]);

  const filteredConversatorios = useMemo(() => {
    return allConversatorios.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.speaker.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTopic = filterTopic === 'Todos' || c.topic === filterTopic;
      return matchesSearch && matchesTopic;
    });
  }, [allConversatorios, filterTopic, searchTerm]);

  const handleRegister = async (conv: ConversatorioUi) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('conexionluz:token') : null;
    if (!token) {
      toast({
        title: 'Inicia sesión',
        description: 'Necesitas iniciar sesión para registrarte a un conversatorio.',
      });
      navigate('/login');
      return;
    }
    const res = await api.post<{ talkId: number; participants: number; isRegistered: boolean }>(`/api/public/talks/${conv.id}/register/`, {});
    if (!res.ok) {
      toast({ title: 'Error', description: res.error, variant: 'destructive' });
      return;
    }
    setTalks((prev) =>
      prev.map((t) => (t.id === res.data.talkId ? { ...t, participants: res.data.participants, isRegistered: res.data.isRegistered } : t))
    );
    toast({
      title: 'Registro exitoso',
      description: `Te has registrado correctamente al conversatorio: ${conv.title}`,
    });
  };

  const handleUnregister = async (conv: ConversatorioUi) => {
    const res = await api.del<{ talkId: number; participants: number; isRegistered: boolean }>(`/api/public/talks/${conv.id}/register/`);
    if (!res.ok) {
      toast({ title: 'Error', description: res.error, variant: 'destructive' });
      return;
    }
    setTalks((prev) =>
      prev.map((t) => (t.id === res.data.talkId ? { ...t, participants: res.data.participants, isRegistered: res.data.isRegistered } : t))
    );
    toast({
      title: 'Registro cancelado',
      description: `Se canceló tu registro en: ${conv.title}`,
    });
  };

  const handleReminder = (title: string) => {
    toast({
      title: "Recordatorio agendado",
      description: `Recibirás una notificación antes del inicio de: ${title}`,
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === 'future') {
      return <Badge className="bg-green-500 hover:bg-green-600">Próximamente</Badge>;
    }
    return <Badge variant="secondary" className="bg-gray-200 text-gray-600">Realizado</Badge>;
  };

  // Marcar fechas con eventos en el calendario
  const eventDates = allConversatorios.flatMap((c: ConversatorioUi) => {
    const start = startOfDay(parseISO(c.date));
    const end = startOfDay(parseISO(c.end_date || c.date));
    const dates: Date[] = [];
    for (let current = start; current.getTime() <= end.getTime(); current = addDays(current, 1)) {
      dates.push(current);
    }
    return dates;
  });

  const formatDateLabel = (conv: ConversatorioUi) => {
    const start = parseISO(conv.date);
    if (!conv.end_date) {
      return format(start, "EEEE d 'de' MMMM", { locale: es });
    }
    const end = parseISO(conv.end_date);
    const sameMonth = format(start, 'yyyy-MM') === format(end, 'yyyy-MM');
    if (sameMonth) {
      return `${format(start, 'd', { locale: es })} al ${format(end, "d 'de' MMMM 'de' yyyy", { locale: es })}`;
    }
    return `${format(start, "d 'de' MMMM 'de' yyyy", { locale: es })} al ${format(end, "d 'de' MMMM 'de' yyyy", { locale: es })}`;
  };

  const featuredTalk = useMemo(() => talks.find((t) => t.featuredVideoUrl) || null, [talks]);
  const nextTalk = useMemo(() => talks.find((t) => t.status === 'future') || null, [talks]);
  const featuredConv = useMemo(
    () => (featuredTalk ? allConversatorios.find((c) => c.id === String(featuredTalk.id)) || null : null),
    [allConversatorios, featuredTalk]
  );
  const nextConv = useMemo(
    () => (nextTalk ? allConversatorios.find((c) => c.id === String(nextTalk.id)) || null : null),
    [allConversatorios, nextTalk]
  );

  return (
    <PublicLayout contentClassName="p-0">
      
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/10 via-white to-accent/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-16 w-24 h-24 bg-accent/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Conversatorios
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Espacios de diálogo y aprendizaje compartido sobre bienestar mental, crecimiento personal y relaciones saludables.
            </p>
          </div>
        </div>
      </section>

      {error ? (
        <div className="container mx-auto px-4 pt-8">
          <div className="max-w-6xl mx-auto rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        </div>
      ) : null}

      {/* Video Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <PlayCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Video Destacado</h2>
                    <p className="text-sm text-gray-500">Conoce más sobre nuestros conversatorios</p>
                  </div>
                </div>
              </div>
              <div className="aspect-video bg-black relative">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center text-sm text-white/80">Cargando...</div>
                ) : featuredTalk?.featuredVideoUrl ? (
                  <video controls className="w-full h-full object-contain">
                    <source src={featuredTalk.featuredVideoUrl} type="video/mp4" />
                    Tu navegador no soporta la reproducción de videos.
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-white/80">
                    Aún no hay video destacado.
                  </div>
                )}
              </div>
              {featuredConv ? (
                <div className="p-5 border-t border-gray-100 bg-white space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-800 truncate">{featuredConv.title}</div>
                      <div className="text-xs text-gray-500">{formatDateLabel(featuredConv)} · {featuredConv.time}</div>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary">
                      {featuredConv.participants} registrados
                    </Badge>
                  </div>
                  {featuredConv.status === 'future' ? (
                    <div className="flex flex-wrap gap-3">
                      {featuredConv.isRegistered ? (
                        <>
                          <Button disabled className="bg-green-600 text-white rounded-xl hover:bg-green-600">
                            Registrado
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => void handleUnregister(featuredConv)}
                            className="rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            Cancelar registro
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => void handleRegister(featuredConv)} className="bg-gradient-to-r from-primary to-accent text-white rounded-xl">
                          Registrarme ahora
                        </Button>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    <PlayCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Próximo Conversatorio</h2>
                    <p className="text-sm text-gray-500">Cuarto conversatorio</p>
                  </div>
                </div>
              </div>
              <div className="aspect-video bg-black relative">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center text-sm text-white/80">Cargando...</div>
                ) : nextTalk?.videoUrl ? (
                  <video controls className="w-full h-full object-contain">
                    <source src={nextTalk.videoUrl} type="video/mp4" />
                    Tu navegador no soporta la reproducción de videos.
                  </video>
                ) : nextTalk?.featuredVideoUrl ? (
                  <video controls className="w-full h-full object-contain">
                    <source src={nextTalk.featuredVideoUrl} type="video/mp4" />
                    Tu navegador no soporta la reproducción de videos.
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-white/80">
                    Aún no hay video para el próximo conversatorio.
                  </div>
                )}
              </div>
              {nextConv ? (
                <div className="p-5 border-t border-gray-100 bg-white space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-800 truncate">{nextConv.title}</div>
                      <div className="text-xs text-gray-500">{formatDateLabel(nextConv)} · {nextConv.time}</div>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary">
                      {nextConv.participants} registrados
                    </Badge>
                  </div>
                  {nextConv.status === 'future' ? (
                    <div className="flex flex-wrap gap-3">
                      {nextConv.isRegistered ? (
                        <>
                          <Button disabled className="bg-green-600 text-white rounded-xl hover:bg-green-600">
                            Registrado
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => void handleUnregister(nextConv)}
                            className="rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            Cancelar registro
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => void handleRegister(nextConv)} className="bg-gradient-to-r from-primary to-accent text-white rounded-xl">
                          Registrarme ahora
                        </Button>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar con Calendario y Filtros */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Calendario de Eventos
                </h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border bg-white"
                  modifiers={{
                    hasEvent: eventDates
                  }}
                  modifiersClassNames={{
                    hasEvent: "bg-primary/20 font-bold text-primary rounded-full"
                  }}
                  locale={es}
                />
                <p className="mt-4 text-sm text-gray-500 italic">
                  * Las fechas sombreadas tienen conversatorios programados.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Búsqueda y Filtros
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Buscar por título o ponente</label>
                    <Input 
                      placeholder="Ej: Ansiedad, Juan..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Tema</label>
                    <div className="flex flex-wrap gap-2">
                      {topics.map(topic => (
                        <button
                          key={topic}
                          onClick={() => setFilterTopic(topic)}
                          className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                            filterTopic === topic 
                            ? 'bg-primary text-white shadow-md' 
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Conversatorios */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {searchTerm || filterTopic !== 'Todos' ? 'Resultados de búsqueda' : 'Próximas reuniones y eventos virtuales'}
                </h2>
                <Badge variant="outline" className="text-primary border-primary">
                  {filteredConversatorios.length} eventos encontrados
                </Badge>
              </div>

              {filteredConversatorios.length > 0 ? (
                filteredConversatorios.map((conv, index) => (
                  <div 
                    key={conv.id} 
                    className="bg-white border border-gray-100 rounded-2xl p-8 min-h-[520px] shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(conv.status)}
                          <span className="text-sm text-accent font-medium uppercase tracking-wider">{conv.topic}</span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full ml-auto">
                            <Sparkles className="h-3 w-3 text-emerald-600" /> ✨ 100 Lumis
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                          {conv.title}
                        </h3>
                        <p className="text-gray-600 mb-6 line-clamp-3">{conv.description}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center gap-2 text-gray-700">
                            <CalendarIcon className="h-4 w-4 text-primary" />
                            <span className="text-sm">
                              {formatDateLabel(conv)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="text-sm">{conv.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="text-sm">Ponente: {conv.speaker}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Info className="h-4 w-4 text-primary" />
                            <span className="text-sm">{conv.participants} registrados</span>
                          </div>
                          {conv.organizer && (
                            <div className="flex items-center gap-2 text-gray-700 sm:col-span-2">
                              <Info className="h-4 w-4 text-primary" />
                              <span className="text-sm">Organiza: {conv.organizer}</span>
                            </div>
                          )}
                          {conv.modality && (
                            <div className="flex items-center gap-2 text-gray-700 sm:col-span-2">
                              <Info className="h-4 w-4 text-primary" />
                              <span className="text-sm">Modalidad: {conv.modality}</span>
                            </div>
                          )}
                        </div>

                        <div className="bg-gray-50 rounded-xl p-5 mb-6">
                          <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Agenda de la sesión
                          </h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                            {conv.agenda.map((item, i) => (
                              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="text-primary font-bold">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
                      {conv.status === 'future' ? (
                        <>
                          {conv.isRegistered ? (
                            <>
                              <Button disabled className="bg-green-600 text-white rounded-xl hover:bg-green-600">
                                Registrado
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => void handleUnregister(conv)}
                                className="rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                Cancelar registro
                              </Button>
                            </>
                          ) : (
                            <Button onClick={() => void handleRegister(conv)} className="bg-gradient-to-r from-primary to-accent text-white rounded-xl">
                              Registrarme ahora
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            onClick={() => handleReminder(conv.title)}
                            className="rounded-xl border-primary text-primary hover:bg-primary/10 hover:text-primary"
                          >
                            <Bell className="h-4 w-4 mr-2" />
                            Agendar Recordatorio
                          </Button>
                        </>
                      ) : (
                        <Button variant="ghost" disabled className="text-gray-400">
                          Este evento ya finalizó
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <Info className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No se encontraron conversatorios que coincidan con tu búsqueda.</p>
                  <Button 
                    variant="link" 
                    onClick={() => {setSearchTerm(''); setFilterTopic('Todos');}}
                    className="text-primary mt-2"
                  >
                    Limpiar todos los filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
};

export default ConversatoriosPage;
