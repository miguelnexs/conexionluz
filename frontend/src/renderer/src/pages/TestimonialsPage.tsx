import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Pencil, Quote, Search, Star, Trash2, UserRound, AlertTriangle, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '@/api/client'
import { Button } from '@/components/ui/button'

type Testimonial = {
  id: number
  patientId?: number | null
  name: string
  title: string
  quote: string
  rating: number
  likesCount?: number
  isActive?: boolean
  createdAt?: string | null
  updatedAt?: string | null
}

type Filter = 'all' | 'active' | 'inactive'

export function TestimonialsPage(): JSX.Element {
  const { t } = useTranslation()
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [detail, setDetail] = useState<Testimonial | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const [edit, setEdit] = useState<{ title: string; quote: string; rating: number; isActive: boolean } | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    const res = await api.get<Testimonial[]>('/api/testimonials/')
    if (!res.ok) {
      setError(res.error)
      setLoading(false)
      return
    }
    setItems(res.data)
    setLoading(false)
  }

  useEffect(() => {
    void load()
  }, [])

  const ui = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = items.filter((x) => {
      const isActive = x.isActive !== false
      if (filter === 'active' && !isActive) return false
      if (filter === 'inactive' && isActive) return false
      if (!q) return true
      const haystack = `${x.name} ${x.title} ${x.quote} ${x.patientId ?? ''}`.toLowerCase()
      return haystack.includes(q)
    })
    filtered.sort((a, b) => (b.updatedAt || b.createdAt || '').localeCompare(a.updatedAt || a.createdAt || ''))
    return filtered
  }, [filter, items, query])

  const stats = useMemo(() => {
    const total = items.length
    const active = items.filter((x) => x.isActive !== false).length
    const inactive = total - active
    const avgRating = total ? items.reduce((acc, x) => acc + (x.rating || 0), 0) / total : 0
    const avgRounded = avgRating ? Math.round(avgRating * 10) / 10 : 0
    const fiveStars = items.filter((x) => (x.rating || 0) >= 5).length
    const totalLikes = items.reduce((acc, x) => acc + (x.likesCount || 0), 0)
    const avgLikes = total ? Math.round((totalLikes / total) * 10) / 10 : 0
    const lastUpdatedAt = items
      .map((x) => x.updatedAt || x.createdAt || null)
      .filter(Boolean)
      .sort()
      .at(-1)
    return { total, active, inactive, avgRounded, fiveStars, totalLikes, avgLikes, lastUpdatedAt }
  }, [items])

  const openDetail = (x: Testimonial) => {
    setDetail(x)
    setEdit({ title: x.title || '', quote: x.quote || '', rating: x.rating || 5, isActive: x.isActive !== false })
  }

  const closeDetail = () => {
    setDetail(null)
    setEdit(null)
  }

  const saveDetail = async () => {
    if (!detail || !edit) return
    if (!edit.quote.trim() || !edit.title.trim()) return
    setSaving(true)
    const res = await api.patch<Testimonial>(`/api/testimonials/${detail.id}/`, {
      title: edit.title.trim(),
      quote: edit.quote.trim(),
      rating: edit.rating,
      isActive: edit.isActive
    })
    setSaving(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setItems((prev) => prev.map((x) => (x.id === detail.id ? res.data : x)))
    setDetail(res.data)
  }

  const toggleActive = async (x: Testimonial) => {
    const next = !(x.isActive !== false)
    const res = await api.patch<Testimonial>(`/api/testimonials/${x.id}/`, { isActive: next })
    if (!res.ok) {
      setError(res.error)
      return
    }
    setItems((prev) => prev.map((p) => (p.id === x.id ? res.data : p)))
    setDetail((p) => (p?.id === x.id ? res.data : p))
    setEdit((p) => (detail?.id === x.id && p ? { ...p, isActive: res.data.isActive !== false } : p))
  }

  const executeDeleteItem = async (id: number) => {
    setDeletingId(id)
    const res = await api.del<unknown>(`/api/testimonials/${id}/`)
    if (!res.ok) {
      setError(res.error)
      setDeletingId(null)
      setConfirmDeleteId(null)
      return
    }
    setItems((prev) => prev.filter((p) => p.id !== id))
    setDetail((p) => (p?.id === id ? null : p))
    setDeletingId(null)
    setConfirmDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{t('testimonials.title')}</h2>
          <p className="text-muted-foreground max-w-2xl">{t('testimonials.subtitle')}</p>
        </div>
        <Button variant="secondary" onClick={() => void load()} className="shrink-0">
          {t('testimonials.refresh')}
        </Button>
      </div>

      {error ? <div className="rounded-2xl border bg-card/70 p-4 text-sm text-red-500">{error}</div> : null}

      {!loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm lg:col-span-2">
            <div className="text-sm font-semibold">{t('testimonials.stats_total')}</div>
            <div className="mt-2 text-3xl font-bold">{stats.total}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {t('testimonials.stats_active')}: {stats.active} · {t('testimonials.stats_inactive')}: {stats.inactive}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {t('testimonials.stats_likes')}: {stats.totalLikes} · {t('testimonials.stats_likes_avg')}: {stats.avgLikes}
            </div>
          </div>
          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm">
            <div className="text-sm font-semibold">{t('testimonials.stats_avg')}</div>
            <div className="mt-2 text-3xl font-bold">{stats.avgRounded || '—'}</div>
            <div className="mt-1 text-xs text-muted-foreground">{t('testimonials.stats_scale')}</div>
          </div>
          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm">
            <div className="text-sm font-semibold">{t('testimonials.stats_five')}</div>
            <div className="mt-2 text-3xl font-bold">{stats.fiveStars}</div>
            <div className="mt-1 text-xs text-muted-foreground">{t('testimonials.stats_five_desc')}</div>
          </div>
          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm lg:col-span-2">
            <div className="text-sm font-semibold">{t('testimonials.stats_updated')}</div>
            <div className="mt-2 text-sm font-semibold">{stats.lastUpdatedAt ? new Date(stats.lastUpdatedAt).toLocaleString() : '—'}</div>
            <div className="mt-1 text-xs text-muted-foreground">{t('testimonials.stats_updated_desc')}</div>
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-border shrink-0">
              <Search className="h-5 w-5" />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('testimonials.search')}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            {query.trim() ? (
              <Button variant="outline" onClick={() => setQuery('')} className="shrink-0">
                {t('testimonials.clear')}
              </Button>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            <Button variant={filter === 'all' ? 'secondary' : 'outline'} onClick={() => setFilter('all')}>
              {t('testimonials.filter_all')}
            </Button>
            <Button variant={filter === 'active' ? 'secondary' : 'outline'} onClick={() => setFilter('active')}>
              {t('testimonials.filter_active')}
            </Button>
            <Button variant={filter === 'inactive' ? 'secondary' : 'outline'} onClick={() => setFilter('inactive')}>
              {t('testimonials.filter_inactive')}
            </Button>
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          {t('testimonials.results')}: {ui.length}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
              <div className="h-4 w-24 bg-muted rounded-md" />
              <div className="mt-4 h-16 w-full bg-muted rounded-xl" />
              <div className="mt-4 h-10 w-full bg-muted rounded-xl" />
            </div>
          ))}
        {!loading && items.length === 0 ? (
          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-8 text-muted-foreground">{t('testimonials.empty')}</div>
        ) : null}
        {!loading && items.length > 0 && ui.length === 0 ? (
          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-8 text-muted-foreground">{t('testimonials.no_matches')}</div>
        ) : null}

        {ui.map((item, index) => {
          const isActive = item.isActive !== false
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={[
                'relative overflow-hidden rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all',
                isActive ? '' : 'opacity-80'
              ].join(' ')}
            >
              <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-primary/15 blur-2xl" />
              <div className="relative space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.max(1, Math.min(5, item.rating || 5)) }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <div className="text-sm font-semibold truncate">{item.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{item.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {t('testimonials.likes')}: {item.likesCount || 0}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => openDetail(item)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      {t('testimonials.edit')}
                    </Button>
                    {item.patientId ? (
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/pacientes/${item.patientId}`}>
                          <UserRound className="mr-2 h-4 w-4" />
                          {t('testimonials.patient')}
                        </Link>
                      </Button>
                    ) : null}
                    <Button size="sm" variant="outline" onClick={() => void toggleActive(item)}>
                      {isActive ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                      {isActive ? t('testimonials.hide') : t('testimonials.show')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmDeleteId(item.id)}
                      disabled={deletingId === item.id}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {deletingId === item.id ? t('common.deleting', 'Eliminando...') : t('testimonials.delete')}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{isActive ? t('testimonials.status_active') : t('testimonials.status_inactive')}</span>
                  <Quote className="h-4 w-4 text-muted-foreground/70" />
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed line-clamp-6 whitespace-pre-wrap">{item.quote}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {detail && edit ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <button type="button" className="absolute inset-0 bg-black/50" aria-label={t('testimonials.close')} onClick={closeDetail} />
          <div role="dialog" aria-modal="true" className="relative w-full max-w-3xl rounded-3xl bg-card border shadow-xl overflow-hidden">
            <div className="p-5 border-b flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="text-lg font-bold truncate">{t('testimonials.detail')}</div>
                <div className="text-sm text-muted-foreground truncate">{detail.name}</div>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <Button variant="outline" onClick={closeDetail}>
                  {t('testimonials.close')}
                </Button>
                <Button onClick={() => void saveDetail()} disabled={saving || !edit.title.trim() || !edit.quote.trim()}>
                  {saving ? t('testimonials.saving') : t('testimonials.save')}
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm font-semibold">{t('testimonials.field_title')}</div>
                  <input
                    value={edit.title}
                    onChange={(e) => setEdit((p) => (p ? { ...p, title: e.target.value } : p))}
                    className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-semibold">{t('testimonials.field_status')}</div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={edit.isActive ? 'secondary' : 'outline'}
                      onClick={() => setEdit((p) => (p ? { ...p, isActive: true } : p))}
                    >
                      {t('testimonials.status_active')}
                    </Button>
                    <Button
                      type="button"
                      variant={!edit.isActive ? 'secondary' : 'outline'}
                      onClick={() => setEdit((p) => (p ? { ...p, isActive: false } : p))}
                    >
                      {t('testimonials.status_inactive')}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-semibold">{t('testimonials.field_rating')}</div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setEdit((p) => (p ? { ...p, rating: n } : p))}
                      className="p-1"
                      aria-label={`${t('testimonials.field_rating')} ${n}`}
                    >
                      <Star className={`h-5 w-5 ${n <= edit.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-semibold">{t('testimonials.field_quote')}</div>
                <textarea
                  value={edit.quote}
                  onChange={(e) => setEdit((p) => (p ? { ...p, quote: e.target.value } : p))}
                  className="w-full min-h-[160px] rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring whitespace-pre-wrap"
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => void toggleActive(detail)}
                  disabled={saving}
                >
                  {detail.isActive !== false ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                  {detail.isActive !== false ? t('testimonials.hide') : t('testimonials.show')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setConfirmDeleteId(detail.id)}
                  disabled={deletingId === detail.id}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {deletingId === detail.id ? t('common.deleting', 'Eliminando...') : t('testimonials.delete')}
                </Button>
              </div>
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
                  {t('testimonials.confirm_delete_title', '¿Estás seguro?')}
                </h3>
                
                <p className="mb-8 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {t('testimonials.confirm_delete_desc', 'Esta acción no se puede deshacer. El testimonio será eliminado permanentemente de la plataforma.')}
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
                    onClick={() => void executeDeleteItem(confirmDeleteId)}
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
                        {t('testimonials.confirm_delete_button', 'Sí, eliminar')}
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
