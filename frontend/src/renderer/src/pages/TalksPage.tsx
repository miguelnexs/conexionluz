import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { CalendarDays, Clock, EyeOff, LayoutGrid, LayoutList, Layers, Pencil, Plus, Search, Trash2, Video, UsersRound, AlertTriangle, X } from 'lucide-react'
import { api } from '@/api/client'
import { Link, useNavigate } from 'react-router-dom'

type Talk = {
  id: number
  title: string
  description?: string
  topic?: string
  speaker?: string
  organizer?: string
  modality?: string
  startAt?: string | null
  endAt?: string | null
  format: string
  audience: string
  participants?: number
  agenda?: string[]
  videoUrl?: string | null
  featuredVideoUrl?: string | null
  isActive?: boolean
}

type TalkUi = {
  id: number
  title: string
  description: string
  topic: string
  speaker: string
  organizer: string
  modality: string
  audience: string
  dateLabel: string
  timeLabel: string
  formatLabel: string
  participants: number
  agenda: string[]
  isActive: boolean
  isUpcoming: boolean
  hasVideo: boolean
  videoUrl: string | null
  hasFeaturedVideo: boolean
  featuredVideoUrl: string | null
}

export function TalksPage(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [talksData, setTalksData] = useState<Talk[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [featuredPickerOpen, setFeaturedPickerOpen] = useState(false)
  const [featuredQuery, setFeaturedQuery] = useState('')
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(() => {
    if (typeof window === 'undefined') return 'list'
    const raw = localStorage.getItem('conexionluz:talks:view')
    return raw === 'grid' ? 'grid' : 'list'
  })

  const load = async () => {
    setLoading(true)
    setError(null)
    const res = await api.get<Talk[]>('/api/talks/')
    if (!res.ok) {
      setError(res.error)
      setLoading(false)
      return
    }
    setTalksData(res.data)
    setLoading(false)
  }

  useEffect(() => {
    void load()
  }, [])

  const talksUi: TalkUi[] = useMemo(() => {
    const now = Date.now()
    const mapped = talksData.map((talk) => {
      const formatLabel = talk.format === 'presential' ? t('talks.format_presential') : t('talks.format_online')
      const start = talk.startAt ? new Date(talk.startAt) : null
      const end = talk.endAt ? new Date(talk.endAt) : null
      const dateLabel = start
        ? start.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })
        : t('talks.no_date')
      const timeLabel = start
        ? `${start.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}${end ? ` – ${end.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}` : ''}`
        : t('talks.no_time')
      const isActive = talk.isActive !== false
      const isUpcoming = Boolean(start && start.getTime() >= now)
      const hasVideo = Boolean(talk.videoUrl)
      const hasFeaturedVideo = Boolean(talk.featuredVideoUrl)
      return {
        id: talk.id,
        title: talk.title,
        description: talk.description || '',
        topic: talk.topic || '',
        speaker: talk.speaker || '',
        organizer: talk.organizer || '',
        modality: talk.modality || '',
        audience: talk.audience || '',
        dateLabel,
        timeLabel,
        formatLabel,
        participants: typeof talk.participants === 'number' && Number.isFinite(talk.participants) ? talk.participants : 0,
        agenda: Array.isArray(talk.agenda) ? talk.agenda : [],
        isActive,
        isUpcoming,
        hasVideo,
        videoUrl: talk.videoUrl || null,
        hasFeaturedVideo,
        featuredVideoUrl: talk.featuredVideoUrl || null
      }
    })
    mapped.sort((a, b) => {
      if (a.isUpcoming !== b.isUpcoming) return a.isUpcoming ? -1 : 1
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1
      return b.id - a.id
    })
    return mapped
  }, [talksData, t])

  const stats = useMemo(() => {
    const total = talksUi.length
    const active = talksUi.filter((x) => x.isActive).length
    const inactive = total - active
    const upcoming = talksUi.filter((x) => x.isActive && x.isUpcoming).length
    const withVideo = talksUi.filter((x) => x.hasVideo).length
    const withFeaturedVideo = talksUi.filter((x) => x.hasFeaturedVideo).length
    return { total, active, inactive, upcoming, withVideo, withFeaturedVideo }
  }, [talksUi])

  const executeDeleteTalk = async (id: number) => {
    setDeletingId(id)
    setError(null)
    const res = await api.del<unknown>(`/api/talks/${id}/`)
    if (!res.ok) {
      setError(res.error)
      setDeletingId(null)
      setConfirmDeleteId(null)
      return
    }
    setTalksData((prev) => prev.filter((x) => x.id !== id))
    setDeletingId(null)
    setConfirmDeleteId(null)
  }

  const filteredForPicker = useMemo(() => {
    const q = featuredQuery.trim().toLowerCase()
    if (!q) return talksUi
    return talksUi.filter((x) => `${x.title} ${x.audience} ${x.dateLabel}`.toLowerCase().includes(q))
  }, [featuredQuery, talksUi])

  const filteredTalks = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return talksUi
    return talksUi.filter((x) => {
      const haystack = `${x.title} ${x.description} ${x.topic} ${x.speaker} ${x.organizer} ${x.modality} ${x.audience} ${x.dateLabel} ${x.timeLabel} ${x.formatLabel} ${x.agenda.join(' ')}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [query, talksUi])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{t('talks.title')}</h2>
          <p className="text-muted-foreground max-w-2xl">{t('talks.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="shrink-0">
            <Link to="/conversatorios/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              {t('talks.new')}
            </Link>
          </Button>
          <Button
            className="shrink-0"
            variant="outline"
            onClick={() => setFeaturedPickerOpen(true)}
            disabled={!loading && talksUi.length === 0}
          >
            <Video className="mr-2 h-4 w-4" />
            {t('talks.featured_video')}
          </Button>
          <Button className="shrink-0" variant="secondary" asChild>
            <Link to="/calendario">
              <CalendarDays className="mr-2 h-4 w-4" />
              {t('talks.cta')}
            </Link>
          </Button>
        </div>
      </div>

      {error ? <div className="rounded-2xl border bg-card/70 p-4 text-sm text-red-500">{error}</div> : null}

      {!loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm lg:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-sm font-semibold">{t('talks.stats_total')}</div>
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-xs text-muted-foreground">
                  {t('talks.stats_active')}: {stats.active}
                </div>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-border">
                <Layers className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-sm font-semibold">{t('talks.stats_upcoming')}</div>
                <div className="text-3xl font-bold">{stats.upcoming}</div>
                <div className="text-xs text-muted-foreground">{t('talks.stats_only_active')}</div>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-border">
                <CalendarDays className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-sm font-semibold">{t('talks.stats_with_video')}</div>
                <div className="text-3xl font-bold">{stats.withVideo}</div>
                <div className="text-xs text-muted-foreground">{t('talks.video_optional')}</div>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-border">
                <Video className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-sm font-semibold">{t('talks.stats_featured_video')}</div>
                <div className="text-3xl font-bold">{stats.withFeaturedVideo}</div>
                <div className="text-xs text-muted-foreground">{t('talks.featured_video')}</div>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-border">
                <Video className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-sm font-semibold">{t('talks.stats_inactive')}</div>
                <div className="text-3xl font-bold">{stats.inactive}</div>
                <div className="text-xs text-muted-foreground">{t('talks.stats_hidden')}</div>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center ring-1 ring-border">
                <EyeOff className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-border shrink-0">
              <Search className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('talks.search')}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                const el = document.activeElement as HTMLElement | null
                if (el) el.blur()
              }}
              className="shrink-0"
            >
              {t('talks.search_button')}
            </Button>
            {query.trim() ? (
              <Button variant="outline" onClick={() => setQuery('')} className="shrink-0">
                {t('talks.clear')}
              </Button>
            ) : null}
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'outline'}
              onClick={() => {
                setViewMode('list')
                localStorage.setItem('conexionluz:talks:view', 'list')
              }}
            >
              <LayoutList className="mr-2 h-4 w-4" />
              {t('talks.view_list')}
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'outline'}
              onClick={() => {
                setViewMode('grid')
                localStorage.setItem('conexionluz:talks:view', 'grid')
              }}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              {t('talks.view_grid')}
            </Button>
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          {t('talks.results')}: {filteredTalks.length}
        </div>
      </div>

      <div className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3' : 'grid gap-4'}>
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
              <div className="h-5 w-2/3 bg-muted rounded-md" />
              <div className="mt-3 h-4 w-1/3 bg-muted rounded-md" />
              <div className="mt-6 h-9 w-full bg-muted rounded-xl" />
            </div>
          ))}
        {!loading && talksUi.length === 0 && (
          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-8 text-muted-foreground">
            {t('talks.empty')}
          </div>
        )}
        {!loading && talksUi.length > 0 && filteredTalks.length === 0 ? (
          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-8 text-muted-foreground">{t('talks.no_matches')}</div>
        ) : null}
        {filteredTalks.map((talk, index) => (
          <motion.div
            key={talk.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className={[
              'rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all',
              talk.isActive ? '' : 'opacity-80'
            ].join(' ')}
          >
            <div className={viewMode === 'grid' ? 'flex items-start justify-between gap-4' : 'flex flex-col lg:flex-row items-start justify-between gap-6'}>
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-lg font-semibold truncate">{talk.title}</div>
                  {talk.topic ? (
                    <span className="inline-flex items-center rounded-full bg-secondary/60 px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                      {talk.topic}
                    </span>
                  ) : null}
                  {talk.isUpcoming && talk.isActive ? (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {t('talks.upcoming')}
                    </span>
                  ) : null}
                  {!talk.isActive ? (
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                      {t('talks.inactive')}
                    </span>
                  ) : null}
                  {talk.hasVideo ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-secondary/60 px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                      <Video className="h-3.5 w-3.5" />
                      {t('talks.has_video')}
                    </span>
                  ) : null}
                  {talk.hasFeaturedVideo ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      <Video className="h-3.5 w-3.5" />
                      {t('talks.featured')}
                    </span>
                  ) : null}
                </div>

                {talk.description ? (
                  <div className={viewMode === 'grid' ? 'text-sm text-muted-foreground line-clamp-2' : 'text-sm text-muted-foreground line-clamp-4'}>
                    {talk.description}
                  </div>
                ) : null}

                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-2'}>
                  <div className="rounded-xl border bg-background/60 p-3">
                    <div className="text-xs font-semibold text-muted-foreground">{t('talks.card_date')}</div>
                    <div className="text-sm font-semibold">{talk.dateLabel}</div>
                  </div>
                  <div className="rounded-xl border bg-background/60 p-3">
                    <div className="text-xs font-semibold text-muted-foreground">{t('talks.card_time')}</div>
                    <div className="text-sm font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{talk.timeLabel}</span>
                    </div>
                  </div>
                  <div className="rounded-xl border bg-background/60 p-3">
                    <div className="text-xs font-semibold text-muted-foreground">{t('talks.field_format')}</div>
                    <div className="text-sm font-semibold">{talk.formatLabel}</div>
                  </div>
                  <div className="rounded-xl border bg-background/60 p-3">
                    <div className="text-xs font-semibold text-muted-foreground">{t('talks.field_audience')}</div>
                    <div className="text-sm font-semibold flex items-center gap-2">
                      <UsersRound className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{talk.audience || t('talks.audience_general')}</span>
                    </div>
                  </div>
                  <div className="rounded-xl border bg-background/60 p-3">
                    <div className="text-xs font-semibold text-muted-foreground">{t('talks.field_speaker')}</div>
                    <div className="text-sm font-semibold truncate">{talk.speaker || '—'}</div>
                  </div>
                  <div className="rounded-xl border bg-background/60 p-3">
                    <div className="text-xs font-semibold text-muted-foreground">{t('talks.field_participants')}</div>
                    <div className="text-sm font-semibold">{talk.participants}</div>
                  </div>
                </div>

                {talk.organizer || talk.modality || talk.agenda.length ? (
                  <div className="rounded-2xl border bg-background/60 p-4 space-y-2">
                    {talk.organizer ? (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{t('talks.field_organizer')}:</span> {talk.organizer}
                      </div>
                    ) : null}
                    {talk.modality ? (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{t('talks.field_modality')}:</span> {talk.modality}
                      </div>
                    ) : null}
                    {talk.agenda.length ? (
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-muted-foreground">{t('talks.field_agenda')}</div>
                        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1'}>
                          {talk.agenda.slice(0, viewMode === 'grid' ? 6 : 9).map((x) => (
                            <div key={x} className="text-sm text-muted-foreground truncate">
                              • {x}
                            </div>
                          ))}
                        </div>
                        {talk.agenda.length > (viewMode === 'grid' ? 6 : 9) ? (
                          <div className="text-xs text-muted-foreground">+{talk.agenda.length - (viewMode === 'grid' ? 6 : 9)}</div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className={viewMode === 'grid' ? 'flex flex-col gap-2 shrink-0' : 'flex flex-wrap gap-2 shrink-0 justify-end'}>
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/conversatorios/${talk.id}`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    {t('talks.edit')}
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/conversatorios/${talk.id}/destacado`}>
                    <Video className="mr-2 h-4 w-4" />
                    {t('talks.featured_video')}
                  </Link>
                </Button>
                {talk.videoUrl ? (
                  <Button size="sm" variant="secondary" asChild>
                    <a href={talk.videoUrl} target="_blank" rel="noreferrer">
                      <Video className="mr-2 h-4 w-4" />
                      {t('talks.view_video')}
                    </a>
                  </Button>
                ) : null}
                {talk.featuredVideoUrl ? (
                  <Button size="sm" variant="secondary" asChild>
                    <a href={talk.featuredVideoUrl} target="_blank" rel="noreferrer">
                      <Video className="mr-2 h-4 w-4" />
                      {t('talks.view_featured_video')}
                    </a>
                  </Button>
                ) : null}
                <Button size="sm" variant="secondary" asChild>
                  <Link to="/calendario">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {t('talks.cta')}
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={deletingId === talk.id}
                  onClick={() => setConfirmDeleteId(talk.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {deletingId === talk.id ? t('common.deleting', 'Eliminando...') : t('talks.delete')}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {featuredPickerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label={t('talks.close')}
            onClick={() => setFeaturedPickerOpen(false)}
          />
          <div role="dialog" aria-modal="true" className="relative w-full max-w-3xl rounded-3xl bg-card border shadow-xl overflow-hidden">
            <div className="p-5 border-b flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-lg font-bold">{t('talks.pick_featured_title')}</div>
                <div className="text-sm text-muted-foreground">{t('talks.pick_featured_help')}</div>
              </div>
              <Button variant="outline" onClick={() => setFeaturedPickerOpen(false)}>
                {t('talks.close')}
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <input
                value={featuredQuery}
                onChange={(e) => setFeaturedQuery(e.target.value)}
                placeholder={t('talks.search')}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              {filteredForPicker.length === 0 ? (
                <div className="rounded-2xl border bg-background p-4 text-sm text-muted-foreground">{t('talks.no_results')}</div>
              ) : (
                <div className="grid gap-3">
                  {filteredForPicker.slice(0, 20).map((talk) => (
                    <button
                      key={talk.id}
                      type="button"
                      onClick={() => {
                        setFeaturedPickerOpen(false)
                        setFeaturedQuery('')
                        navigate(`/conversatorios/${talk.id}/destacado`)
                      }}
                      className="rounded-2xl border bg-background p-4 text-left hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="text-sm font-semibold">{talk.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {talk.dateLabel} · {talk.timeLabel} · {talk.formatLabel}
                          </div>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                          {t('talks.select')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {!loading && talksUi.length > 20 ? (
                <div className="text-xs text-muted-foreground">{t('talks.showing_first', { count: 20 })}</div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <AnimatePresence>
        {confirmDeleteId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border bg-card/95 p-8 shadow-2xl backdrop-blur-xl m-4"
            >
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="absolute right-6 top-6 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
             >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-500" />
                </div>
                
                <h3 className="mb-2 text-2xl font-bold tracking-tight">
                  {t('talks.confirm_delete_title', '¿Estás seguro?')}
                </h3>
                
                <p className="mb-8 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {t('talks.confirm_delete_desc', 'Esta acción no se puede deshacer. El conversatorio será eliminado permanentemente de la plataforma.')}
                </p>

                <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto px-8"
                    onClick={() => setConfirmDeleteId(null)}
                    disabled={deletingId === confirmDeleteId}
                  >
                    {t('common.cancel', 'Cancelar')}
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full sm:w-auto px-8 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 transition-all hover:shadow-red-600/40"
                    onClick={() => void executeDeleteTalk(confirmDeleteId)}
                    disabled={deletingId === confirmDeleteId}
                  >
                    {deletingId === confirmDeleteId ? (
                      <span className="flex items-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="mr-2"
                        >
                          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </motion.div>
                        {t('common.deleting', 'Eliminando...')}
                      </span>
                    ) : (
                      <span className="flex items-center font-medium">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('talks.confirm_delete_button', 'Sí, eliminar')}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
