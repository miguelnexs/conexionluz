import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { api } from '@/api/client'
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Trash2, X } from 'lucide-react'

type AppointmentStatus = 'scheduled' | 'cancelled' | 'completed'

type Appointment = {
  id: number
  title: string
  startAt: string
  endAt: string
  status: AppointmentStatus
  patientId?: number | null
  serviceId?: number | null
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  clientAge?: number | null
  emergencyContactName?: string
  emergencyContactPhone?: string
  reason?: string
  notes?: string
}

type Talk = {
  id: number
  title: string
  startAt?: string | null
  endAt?: string | null
  format: 'online' | 'presential'
  audience: string
  isActive?: boolean
}

type CalendarEvent =
  | ({ type: 'appointment' } & Appointment)
  | ({ type: 'talk' } & Talk & { startAt: string; endAt: string })

type Patient = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  isActive: boolean
}

type Service = {
  id: number
  title: string
  durationMinutes?: number
  priceCOP: number
  isActive?: boolean
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

function toLocalDateInputValue(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function toLocalTimeInputValue(d: Date): string {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
}

function startOfWeekMonday(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = (day + 6) % 7
  date.setDate(date.getDate() - diff)
  date.setHours(0, 0, 0, 0)
  return date
}

function endOfWeekSunday(d: Date): Date {
  const start = startOfWeekMonday(d)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return end
}

function addDays(d: Date, n: number): Date {
  const date = new Date(d)
  date.setDate(date.getDate() + n)
  return date
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function toIsoLocal(d: Date): string {
  const tzOffset = d.getTimezoneOffset() * 60000
  const local = new Date(d.getTime() - tzOffset)
  return local.toISOString().slice(0, 19)
}

function humanMonth(d: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(d)
}

function formatTime(iso: string, locale: string): string {
  const d = new Date(iso)
  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(d)
}

function eventPill(event: CalendarEvent): { cls: string; label: string } {
  if (event.type === 'talk') return { cls: 'bg-violet-500/15 text-violet-700 dark:text-violet-300', label: 'Conversatorio' }
  if (event.status === 'completed') return { cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300', label: 'Completada' }
  if (event.status === 'cancelled') return { cls: 'bg-muted text-muted-foreground', label: 'Cancelada' }
  return { cls: 'bg-primary/10 text-primary', label: 'Programada' }
}

export function CalendarPage(): JSX.Element {
  const { t, i18n } = useTranslation()
  const [viewDate, setViewDate] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([])

  const [patients, setPatients] = useState<Patient[]>([])
  const [loadingPatients, setLoadingPatients] = useState(true)
  const [services, setServices] = useState<Service[]>([])

  const [creatingForDate, setCreatingForDate] = useState<Date | null>(null)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [detail, setDetail] = useState<Appointment | null>(null)
  const [patientQuery, setPatientQuery] = useState('')
  const [form, setForm] = useState({
    title: '',
    date: toLocalDateInputValue(new Date()),
    startTime: '09:00',
    endTime: '10:00',
    notes: '',
    patientId: '' as string
  })

  const range = useMemo(() => {
    const first = startOfMonth(viewDate)
    const last = endOfMonth(viewDate)
    const start = startOfWeekMonday(first)
    const end = endOfWeekSunday(last)
    return { start, end }
  }, [viewDate])

  const days = useMemo(() => {
    const list: Date[] = []
    let cur = new Date(range.start)
    while (cur <= range.end) {
      list.push(new Date(cur))
      cur = addDays(cur, 1)
    }
    return list
  }, [range])

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const e of events) {
      const key = toLocalDateInputValue(new Date(e.startAt))
      const prev = map.get(key) || []
      prev.push(e)
      map.set(key, prev)
    }
    for (const [k, list] of map.entries()) {
      list.sort((x, y) => new Date(x.startAt).getTime() - new Date(y.startAt).getTime())
      map.set(k, list)
    }
    return map
  }, [events])

  const selectedKey = useMemo(() => toLocalDateInputValue(selectedDate), [selectedDate])
  const selectedEvents = eventsByDay.get(selectedKey) || []

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const start = range.start.toISOString()
    const end = range.end.toISOString()
    const [appointmentsRes, talksRes] = await Promise.all([
      api.get<Appointment[]>(`/api/appointments/?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`),
      api.get<Talk[]>(`/api/talks/?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`)
    ])
    if (!appointmentsRes.ok) {
      setError(appointmentsRes.error)
      setLoading(false)
      return
    }
    if (!talksRes.ok) {
      setError(talksRes.error)
      setLoading(false)
      return
    }
    const apptEvents: CalendarEvent[] = appointmentsRes.data.map((a) => ({ ...a, type: 'appointment' }))
    const talkEvents: CalendarEvent[] = talksRes.data
      .filter((x) => x.isActive !== false)
      .filter((x) => x.startAt && x.endAt)
      .map((x) => ({ ...x, type: 'talk', startAt: x.startAt as string, endAt: x.endAt as string }))
    setEvents([...apptEvents, ...talkEvents])
    setLoading(false)
  }, [range.end, range.start])

  const deleteAppointment = async (id: number) => {
    const ok = window.confirm(t('calendar.confirm_delete'))
    if (!ok) return
    setDetail((p) => (p?.id === id ? null : p))
    setDeletingId(`appointment:${id}`)
    const res = await api.del<unknown>(`/api/appointments/${id}/`)
    setDeletingId(null)
    if (!res.ok) {
      setError(res.error)
      return
    }
    await load()
  }

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    void (async () => {
      setLoadingPatients(true)
      const res = await api.get<Patient[]>('/api/patients/')
      if (res.ok) {
        setPatients(res.data)
      }
      setLoadingPatients(false)
    })()
  }, [])

  useEffect(() => {
    void (async () => {
      const res = await api.get<Service[]>('/api/services/')
      if (res.ok) {
        setServices(res.data)
      }
    })()
  }, [])

  const openCreate = (d: Date) => {
    if (d.getDay() === 0) {
      setError(t('calendar.closed_sunday'))
      return
    }
    const start = new Date(d)
    start.setHours(9, 0, 0, 0)
    const end = new Date(d)
    end.setHours(10, 0, 0, 0)
    setForm({
      title: '',
      date: toLocalDateInputValue(d),
      startTime: toLocalTimeInputValue(start),
      endTime: toLocalTimeInputValue(end),
      notes: '',
      patientId: ''
    })
    setCreateError(null)
    setPatientQuery('')
    setCreatingForDate(d)
  }

  const submitCreate = async () => {
    setCreateError(null)
    const title = form.title.trim()
    if (!title) {
      setCreateError(t('calendar.title_required'))
      return
    }
    const dateParts = form.date.split('-').map((x) => Number(x))
    if (dateParts.length !== 3) {
      setCreateError(t('calendar.invalid_date'))
      return
    }
    const [y, m, dd] = dateParts
    const [sh, sm] = form.startTime.split(':').map((x) => Number(x))
    const [eh, em] = form.endTime.split(':').map((x) => Number(x))
    const start = new Date(y, m - 1, dd, sh || 0, sm || 0, 0, 0)
    const end = new Date(y, m - 1, dd, eh || 0, em || 0, 0, 0)
    if (start.getDay() === 0) {
      setCreateError(t('calendar.closed_sunday'))
      return
    }
    if (end <= start) {
      setCreateError(t('calendar.end_after_start'))
      return
    }
    setCreating(true)
    const patientIdNum = form.patientId ? Number(form.patientId) : null
    const res = await api.post<Appointment>('/api/appointments/', {
      title,
      startAt: toIsoLocal(start),
      endAt: toIsoLocal(end),
      notes: form.notes.trim(),
      patientId: patientIdNum && Number.isFinite(patientIdNum) ? patientIdNum : null
    })
    setCreating(false)
    if (!res.ok) {
      setCreateError(res.error)
      return
    }
    setCreatingForDate(null)
    await load()
  }

  const weekDays = useMemo(() => {
    const base = startOfWeekMonday(new Date())
    return Array.from({ length: 7 }).map((_, i) => {
      const d = addDays(base, i)
      return new Intl.DateTimeFormat(i18n.language, { weekday: 'short' }).format(d)
    })
  }, [i18n.language])

  const filteredPatients = useMemo(() => {
    const q = patientQuery.trim().toLowerCase()
    const list = patients.filter((p) => p.isActive !== false)
    if (!q) return list
    return list.filter((p) => {
      const name = `${p.firstName} ${p.lastName}`.trim().toLowerCase()
      return name.includes(q) || (p.email || '').toLowerCase().includes(q) || (p.phone || '').toLowerCase().includes(q)
    })
  }, [patientQuery, patients])

  const selectedPatient = useMemo(() => {
    const id = form.patientId ? Number(form.patientId) : NaN
    if (!Number.isFinite(id)) return null
    return patients.find((p) => p.id === id) || null
  }, [form.patientId, patients])

  const serviceById = useMemo(() => new Map(services.map((s) => [s.id, s])), [services])

  const patientById = useMemo(() => new Map(patients.map((p) => [p.id, p])), [patients])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">{t('calendar.title')}</h2>
          <p className="text-muted-foreground">{t('calendar.subtitle')}</p>
        </div>
        <Button onClick={() => openCreate(new Date())} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          {t('calendar.new')}
        </Button>
      </div>

      {error ? <div className="rounded-2xl border bg-card/70 p-4 text-sm text-red-500">{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-border">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div className="text-xl font-bold capitalize">{humanMonth(viewDate, i18n.language)}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setViewDate(new Date())}>
                {t('calendar.today')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((w) => (
              <div key={w} className="text-xs font-semibold text-muted-foreground px-2">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((d) => {
              const key = toLocalDateInputValue(d)
              const isCurrentMonth = d.getMonth() === viewDate.getMonth()
              const isSelected = sameDay(d, selectedDate)
              const list = eventsByDay.get(key) || []
              const isSunday = d.getDay() === 0
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDate(d)}
                  onDoubleClick={() => {
                    if (!isSunday) openCreate(d)
                  }}
                  className={[
                    'rounded-2xl border p-2 text-left min-h-[96px] transition-all',
                    isSelected ? 'border-primary/40 bg-primary/10' : 'bg-background hover:shadow-sm',
                    isCurrentMonth ? 'opacity-100' : 'opacity-55',
                    isSunday ? 'bg-muted/30' : ''
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold">{d.getDate()}</div>
                    {list.length ? (
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        {list.length}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2 space-y-1">
                    {list.slice(0, 2).map((a) => (
                      <div key={`${a.type}:${a.id}`} className="truncate text-xs text-muted-foreground">
                        {formatTime(a.startAt, i18n.language)} · {a.title}
                      </div>
                    ))}
                    {list.length > 2 ? <div className="text-xs text-muted-foreground">+{list.length - 2}</div> : null}
                  </div>
                </button>
              )
            })}
          </div>

          {loading ? <div className="text-sm text-muted-foreground">{t('calendar.loading')}</div> : null}
          <div className="text-xs text-muted-foreground">{t('calendar.tip')}</div>
        </div>

        <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="text-sm font-semibold">{t('calendar.day')}</div>
              <div className="text-muted-foreground">{new Intl.DateTimeFormat(i18n.language, { dateStyle: 'full' }).format(selectedDate)}</div>
            </div>
            <Button variant="outline" size="sm" onClick={() => openCreate(selectedDate)} disabled={selectedDate.getDay() === 0}>
              <Plus className="mr-2 h-4 w-4" />
              {t('calendar.add')}
            </Button>
          </div>

          {selectedEvents.length === 0 ? (
            <div className="rounded-2xl border bg-background p-4 text-sm text-muted-foreground">{t('calendar.no_events')}</div>
          ) : (
            <div className="space-y-3">
              {selectedEvents.map((a) => {
                const pill = eventPill(a)
                const subtitle = a.type === 'appointment' ? (a.clientName ? a.clientName : a.title) : a.title
                return (
                  <button
                    key={`${a.type}:${a.id}`}
                    type="button"
                    onClick={() => {
                      if (a.type === 'appointment') setDetail(a)
                    }}
                    className="w-full text-left rounded-2xl border bg-background p-4 space-y-2 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="text-sm font-semibold">{subtitle}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(a.startAt, i18n.language)} – {formatTime(a.endAt, i18n.language)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${pill.cls}`}>
                          {pill.label}
                        </span>
                        {a.type === 'appointment' ? (
                          <button
                            type="button"
                            onClick={() => void deleteAppointment(a.id)}
                            disabled={Boolean(deletingId)}
                            className="h-9 w-9 rounded-2xl border bg-background flex items-center justify-center hover:shadow-sm transition-all text-red-500 hover:text-red-600 disabled:opacity-60"
                            aria-label={t('calendar.delete')}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClickCapture={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                    {a.type === 'appointment' && (a.clientEmail || a.clientPhone) ? (
                      <div className="text-xs text-muted-foreground">
                        {a.clientEmail ? <span className="mr-3">{a.clientEmail}</span> : null}
                        {a.clientPhone ? <span>{a.clientPhone}</span> : null}
                      </div>
                    ) : null}
                    {a.type === 'appointment' && a.notes ? (
                      <div className="text-xs text-muted-foreground whitespace-pre-wrap">{a.notes}</div>
                    ) : null}
                    {a.type === 'talk' ? (
                      <div className="text-xs text-muted-foreground">
                        {a.format === 'presential' ? t('talks.format_presential') : t('talks.format_online')}
                        {a.audience ? ` · ${a.audience}` : ''}
                      </div>
                    ) : null}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {creatingForDate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <button type="button" className="absolute inset-0 bg-black/50" onClick={() => setCreatingForDate(null)} aria-label={t('calendar.close')} />
          <div role="dialog" aria-modal="true" className="relative w-full max-w-2xl rounded-3xl bg-card border shadow-xl overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between gap-3">
              <div className="text-lg font-bold">{t('calendar.new')}</div>
              <button
                type="button"
                onClick={() => setCreatingForDate(null)}
                className="h-10 w-10 rounded-2xl bg-background border flex items-center justify-center hover:shadow-sm transition-all"
                aria-label={t('calendar.close')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {createError ? <div className="rounded-2xl border bg-background p-3 text-sm text-red-500">{createError}</div> : null}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold">{t('calendar.field_patient')}</label>
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      value={patientQuery}
                      onChange={(e) => setPatientQuery(e.target.value)}
                      className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder={t('calendar.patient_search')}
                      disabled={loadingPatients}
                    />
                    <select
                      value={form.patientId}
                      onChange={(e) => {
                        const value = e.target.value
                        const id = value ? Number(value) : NaN
                        const selected = Number.isFinite(id) ? patients.find((x) => x.id === id) : null
                        setForm((prev) => ({
                          ...prev,
                          patientId: value,
                          title: selected && !prev.title.trim() ? `${selected.firstName} ${selected.lastName}`.trim() : prev.title
                        }))
                      }}
                      className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      disabled={loadingPatients}
                    >
                      <option value="">{t('calendar.patient_none')}</option>
                      {filteredPatients.map((p) => (
                        <option key={p.id} value={String(p.id)}>
                          {`${p.firstName} ${p.lastName}`.trim()} · {p.email || p.phone || `#${p.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedPatient ? (
                    <div className="text-xs text-muted-foreground">
                      {selectedPatient.email ? <span className="mr-3">{selectedPatient.email}</span> : null}
                      {selectedPatient.phone ? <span>{selectedPatient.phone}</span> : null}
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold">{t('calendar.field_title')}</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder={t('calendar.title_placeholder')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t('calendar.field_date')}</label>
                  <input
                    value={form.date}
                    onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                    type="date"
                    className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t('calendar.field_start')}</label>
                  <input
                    value={form.startTime}
                    onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
                    type="time"
                    className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t('calendar.field_end')}</label>
                  <input
                    value={form.endTime}
                    onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))}
                    type="time"
                    className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold">{t('calendar.field_notes')}</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                    className="w-full min-h-[110px] rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder={t('calendar.notes_placeholder')}
                  />
                </div>
              </div>
            </div>
            <div className="p-5 border-t flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" onClick={() => setCreatingForDate(null)} disabled={creating}>
                {t('calendar.cancel')}
              </Button>
              <Button onClick={() => void submitCreate()} disabled={creating}>
                {creating ? t('calendar.creating') : t('calendar.create')}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {detail ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <button type="button" className="absolute inset-0 bg-black/50" onClick={() => setDetail(null)} aria-label={t('calendar.close')} />
          <div role="dialog" aria-modal="true" className="relative w-full max-w-3xl rounded-3xl bg-card border shadow-xl overflow-hidden">
            <div className="p-5 border-b flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-lg font-bold">{t('calendar.appointment_detail')}</div>
                <div className="text-sm text-muted-foreground">
                  {new Intl.DateTimeFormat(i18n.language, { dateStyle: 'full' }).format(new Date(detail.startAt))} · {formatTime(detail.startAt, i18n.language)} –{' '}
                  {formatTime(detail.endAt, i18n.language)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="h-10 w-10 rounded-2xl bg-background border flex items-center justify-center hover:shadow-sm transition-all"
                aria-label={t('calendar.close')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {(() => {
                const p = detail.patientId ? patientById.get(detail.patientId) : null
                const s = detail.serviceId ? serviceById.get(detail.serviceId) : null
                const name = p ? `${p.firstName} ${p.lastName}`.trim() : detail.clientName || t('calendar.anonymous')
                return (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border bg-background p-4 space-y-1">
                        <div className="text-xs font-semibold text-muted-foreground">{t('calendar.field_patient')}</div>
                        <div className="text-sm font-semibold">{name}</div>
                        {p?.email || detail.clientEmail ? <div className="text-xs text-muted-foreground">{p?.email || detail.clientEmail}</div> : null}
                        {p?.phone || detail.clientPhone ? <div className="text-xs text-muted-foreground">{p?.phone || detail.clientPhone}</div> : null}
                      </div>
                      <div className="rounded-2xl border bg-background p-4 space-y-1">
                        <div className="text-xs font-semibold text-muted-foreground">{t('calendar.field_service')}</div>
                        <div className="text-sm font-semibold">{s ? s.title : t('calendar.service_none')}</div>
                        {s && typeof s.durationMinutes === 'number' && s.durationMinutes > 0 ? (
                          <div className="text-xs text-muted-foreground">
                            {t('calendar.duration')}: {s.durationMinutes} min
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {detail.reason ? (
                      <div className="rounded-2xl border bg-background p-4 space-y-1">
                        <div className="text-xs font-semibold text-muted-foreground">{t('calendar.field_reason')}</div>
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap">{detail.reason}</div>
                      </div>
                    ) : null}

                    {detail.emergencyContactName || detail.emergencyContactPhone ? (
                      <div className="rounded-2xl border bg-background p-4 space-y-1">
                        <div className="text-xs font-semibold text-muted-foreground">{t('calendar.field_emergency')}</div>
                        <div className="text-sm text-muted-foreground">
                          {detail.emergencyContactName ? <span className="mr-3">{detail.emergencyContactName}</span> : null}
                          {detail.emergencyContactPhone ? <span>{detail.emergencyContactPhone}</span> : null}
                        </div>
                      </div>
                    ) : null}

                    {detail.notes ? (
                      <div className="rounded-2xl border bg-background p-4 space-y-1">
                        <div className="text-xs font-semibold text-muted-foreground">{t('calendar.field_notes')}</div>
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap">{detail.notes}</div>
                      </div>
                    ) : null}
                  </>
                )
              })()}
            </div>
            <div className="p-5 border-t flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" onClick={() => setDetail(null)}>
                {t('calendar.close')}
              </Button>
              <Button
                variant="outline"
                onClick={() => void deleteAppointment(detail.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('calendar.delete')}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
