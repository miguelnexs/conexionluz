import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { Calendar as CalendarIcon, Clock, MessageCircle, Video } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '../api/client';
import { addDays, addMonths, endOfMonth, format, isSameDay, parseISO, startOfDay, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

type CalendarEvent =
  | {
      type: 'appointment';
      id: number;
      title: string;
      startAt: string;
      endAt: string;
      status: 'scheduled' | 'cancelled' | 'completed';
      serviceId?: number | null;
      serviceTitle?: string | null;
    }
  | {
      type: 'talk';
      id: number;
      title: string;
      startAt: string;
      endAt: string;
      topic?: string;
      speaker?: string;
    };

type CalendarResponse = {
  events: CalendarEvent[];
};

function hasToken(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem('conexionluz:token'));
}

function formatTimeRange(startIso: string, endIso: string): string {
  const start = parseISO(startIso);
  const end = parseISO(endIso);
  return `${format(start, 'h:mm a', { locale: es })} - ${format(end, 'h:mm a', { locale: es })}`;
}

const MiCalendarioPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const authed = hasToken();

  const focusRaw = searchParams.get('focus');
  const focusDate = useMemo(() => {
    if (!focusRaw) return null;
    const d = parseISO(focusRaw);
    return Number.isFinite(d.getTime()) ? d : null;
  }, [focusRaw]);

  const [month, setMonth] = useState<Date>(() => focusDate || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => focusDate || new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectDay = useCallback((d: Date) => {
    const day = startOfDay(d);
    setSelectedDate(day);
    setMonth(startOfMonth(day));
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('focus', format(day, 'yyyy-MM-dd'));
      return p;
    });
  }, [setSearchParams]);

  useEffect(() => {
    if (!focusDate) return;
    selectDay(focusDate);
  }, [focusDate, selectDay]);

  useEffect(() => {
    if (!authed) return;
    void (async () => {
      setLoading(true);
      setError(null);
      const today = new Date();
      const start = startOfMonth(addMonths(today, -1));
      const end = addDays(endOfMonth(addMonths(today, 6)), 1);
      const res = await api.get<CalendarResponse>(
        `/api/public/calendar/?start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`
      );
      if (!res.ok) {
        setError(res.error);
        setLoading(false);
        return;
      }
      setEvents(res.data.events || []);
      setLoading(false);
    })();
  }, [authed]);

  const eventDates = useMemo(() => {
    return events.map((e) => startOfDay(parseISO(e.startAt)));
  }, [events]);

  const pendingEvents = useMemo(() => {
    const now = Date.now();
    return [...events]
      .filter((e) => {
        const start = parseISO(e.startAt).getTime();
        if (!Number.isFinite(start)) return false;
        if (start < now) return false;
        if (e.type === 'appointment') return e.status === 'scheduled';
        return true;
      })
      .sort((a, b) => parseISO(a.startAt).getTime() - parseISO(b.startAt).getTime());
  }, [events]);

  const pendingDates = useMemo(() => {
    const seen = new Set<string>();
    const dates: Date[] = [];
    for (const e of pendingEvents) {
      const d = startOfDay(parseISO(e.startAt));
      const key = format(d, 'yyyy-MM-dd');
      if (seen.has(key)) continue;
      seen.add(key);
      dates.push(d);
    }
    return dates;
  }, [pendingEvents]);

  const pendingByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of pendingEvents) {
      const d = startOfDay(parseISO(e.startAt));
      const key = format(d, 'yyyy-MM-dd');
      const prev = map.get(key) || [];
      prev.push(e);
      map.set(key, prev);
    }
    return map;
  }, [pendingEvents]);

  const selectedEvents = useMemo(() => {
    if (!selectedDate) return [];
    return events
      .filter((e) => isSameDay(parseISO(e.startAt), selectedDate))
      .sort((a, b) => parseISO(a.startAt).getTime() - parseISO(b.startAt).getTime());
  }, [events, selectedDate]);

  useEffect(() => {
    if (loading) return;
    if (focusDate) return;
    if (!events.length) return;

    const selectedHasEvents = selectedDate ? events.some((e) => isSameDay(parseISO(e.startAt), selectedDate)) : false;
    if (selectedHasEvents) return;

    const today = startOfDay(new Date());
    const sorted = [...events].sort((a, b) => parseISO(a.startAt).getTime() - parseISO(b.startAt).getTime());
    const upcoming = sorted.find((e) => startOfDay(parseISO(e.startAt)).getTime() >= today.getTime()) || sorted[0];
    if (!upcoming) return;
    const nextDay = startOfDay(parseISO(upcoming.startAt));
    selectDay(nextDay);
  }, [events, focusDate, loading, selectedDate, selectDay]);

  if (!authed) return <Navigate to="/login" replace />;

  return (
    <PublicLayout contentClassName="p-0">
      <section className="py-10 bg-gradient-to-br from-primary/10 via-white to-accent/10 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Mi calendario
              </h1>
              <p className="text-gray-600 max-w-2xl">
                Aquí ves tus citas agendadas y los conversatorios a los que te registraste, con la hora exacta de atención.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate('/agenda')} className="bg-gradient-to-r from-primary to-accent text-white rounded-xl">
                Agendar cita
              </Button>
              <Button variant="outline" onClick={() => navigate('/conversatorios')} className="rounded-xl border-primary text-primary hover:bg-primary/10 hover:text-primary">
                Ver conversatorios
              </Button>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="container mx-auto px-4 pt-8">
          <div className="max-w-6xl mx-auto rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        </div>
      ) : null}

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Calendario
                </h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => {
                    if (!d) return;
                    selectDay(d);
                  }}
                  month={month}
                  onMonthChange={setMonth}
                  className="rounded-md border bg-white"
                  modifiers={{ hasEvent: eventDates, hasPending: pendingDates }}
                  modifiersClassNames={{
                    hasEvent: 'bg-primary/20 font-bold text-primary rounded-full',
                    hasPending: 'ring-2 ring-accent/40'
                  }}
                  locale={es}
                />
                <p className="mt-4 text-sm text-gray-500 italic">* Las fechas sombreadas tienen eventos.</p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-gray-800">Pendientes</div>
                    <div className="text-sm text-gray-600">Todo lo próximo que tienes agendado (citas y conversatorios).</div>
                  </div>
                  <Badge variant="outline" className="text-primary border-primary">
                    {pendingEvents.length}
                  </Badge>
                </div>

                {loading ? (
                  <div className="mt-4 text-sm text-gray-600">Cargando...</div>
                ) : pendingEvents.length === 0 ? (
                  <div className="mt-4 text-sm text-gray-600">No tienes pendientes.</div>
                ) : (
                  <div className="mt-4 space-y-4">
                    {Array.from(pendingByDay.entries())
                      .sort(([a], [b]) => a.localeCompare(b))
                      .slice(0, 8)
                      .map(([dayKey, list]) => {
                        const day = parseISO(dayKey);
                        return (
                          <div key={dayKey} className="rounded-2xl border border-gray-100 bg-white p-4">
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-sm font-bold text-gray-800">{format(day, "EEEE d 'de' MMMM", { locale: es })}</div>
                              <Button
                                variant="outline"
                                onClick={() => selectDay(day)}
                                className="rounded-xl border-primary text-primary hover:bg-primary/10 hover:text-primary"
                              >
                                Ver
                              </Button>
                            </div>
                            <div className="mt-3 space-y-2">
                              {list.slice(0, 4).map((ev) => (
                                <div key={`${ev.type}:${ev.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    {ev.type === 'appointment' ? (
                                      <Badge className="bg-primary text-white">Cita</Badge>
                                    ) : (
                                      <Badge className="bg-accent text-white">Conversatorio</Badge>
                                    )}
                                    <span className="text-sm text-gray-700 truncate">{ev.title}</span>
                                  </div>
                                  <div className="text-sm text-gray-600 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    {formatTimeRange(ev.startAt, ev.endAt)}
                                  </div>
                                </div>
                              ))}
                              {list.length > 4 ? <div className="text-xs text-gray-500">+{list.length - 4} más</div> : null}
                            </div>
                          </div>
                        );
                      })}
                    {pendingByDay.size > 8 ? <div className="text-xs text-gray-500">+{pendingByDay.size - 8} días más con pendientes</div> : null}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedDate ? format(selectedDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es }) : 'Eventos'}
                </h2>
                <Badge variant="outline" className="text-primary border-primary">
                  {selectedEvents.length} eventos
                </Badge>
              </div>

              {loading ? (
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 text-gray-600">Cargando...</div>
              ) : selectedEvents.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 text-gray-600">
                  No tienes eventos para este día.
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedEvents.map((ev) => (
                    <div key={`${ev.type}:${ev.id}`} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            {ev.type === 'appointment' ? (
                              <Badge className="bg-primary text-white">Cita</Badge>
                            ) : (
                              <Badge className="bg-accent text-white">Conversatorio</Badge>
                            )}
                            <span className="text-sm text-gray-700 flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              {formatTimeRange(ev.startAt, ev.endAt)}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">{ev.title}</h3>
                          {ev.type === 'appointment' ? (
                            <div className="text-sm text-gray-600">
                              {ev.serviceTitle ? (
                                <span className="inline-flex items-center gap-2">
                                  <MessageCircle className="h-4 w-4 text-primary" />
                                  Servicio: {ev.serviceTitle}
                                </span>
                              ) : null}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-600">
                              {ev.topic ? <span className="mr-3">Tema: {ev.topic}</span> : null}
                              {ev.speaker ? <span>Ponente: {ev.speaker}</span> : null}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 justify-end">
                          {ev.type === 'talk' ? (
                            <Button variant="outline" onClick={() => navigate('/conversatorios')} className="rounded-xl border-primary text-primary hover:bg-primary/10 hover:text-primary">
                              <Video className="h-4 w-4 mr-2" />
                              Ver conversatorios
                            </Button>
                          ) : (
                            <Button variant="outline" onClick={() => navigate('/agenda')} className="rounded-xl border-primary text-primary hover:bg-primary/10 hover:text-primary">
                              Reagendar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default MiCalendarioPage;
