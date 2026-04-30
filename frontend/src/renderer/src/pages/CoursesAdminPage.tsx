import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Plus, Eye, EyeOff, Pencil, Trash2, Image as ImageIcon, Layers, Video, Tag, Folder, Clock, AlertTriangle, X } from 'lucide-react'
import { api } from '@/api/client'
import { Link } from 'react-router-dom'

type CourseStatus = 'draft' | 'published'

type Course = {
  id: number
  title: string
  slug: string
  priceCOP: number
  status: CourseStatus
  isActive?: boolean
  coverUrl?: string | null
}

type CourseStats = {
  total: number
  active: number
  published: number
  draft: number
  withPromoVideo: number
  mediaCount: number
  mediaSizeBytes: number
  avgPriceCOP: number
  categoryCount: number
  uniqueTagsCount: number
  draftContent: { sections: number; items: number; videos: number; html: number; quizzes: number; questions: number }
  publishedContent: { sections: number; items: number; videos: number; html: number; quizzes: number; questions: number }
  lastUpdatedAt?: string | null
}

function formatCOP(value: number): string {
  return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = bytes
  let idx = 0
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024
    idx += 1
  }
  const decimals = idx === 0 ? 0 : idx <= 2 ? 1 : 2
  return `${value.toFixed(decimals)} ${units[idx]}`
}

export function CoursesAdminPage(): JSX.Element {
  const { t } = useTranslation()

  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<CourseStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const loadCourses = async () => {
    setLoading(true)
    setError(null)
    const res = await api.get<Course[]>('/api/courses/')
    if (!res.ok) {
      setError(res.error)
      setLoading(false)
      return
    }
    setCourses(res.data)
    setLoading(false)
  }

  const loadStats = async () => {
    setLoadingStats(true)
    const res = await api.get<CourseStats>('/api/courses/stats/')
    if (!res.ok) {
      setLoadingStats(false)
      return
    }
    setStats(res.data)
    setLoadingStats(false)
  }

  useEffect(() => {
    void loadCourses()
    void loadStats()
  }, [])

  const sortedCourses = useMemo(() => {
    const priority = (s: CourseStatus) => (s === 'published' ? 0 : 1)
    return [...courses].sort((a, b) => {
      const byStatus = priority(a.status) - priority(b.status)
      if (byStatus !== 0) return byStatus
      return a.title.localeCompare(b.title)
    })
  }, [courses])

  const executeDeleteCourse = async (id: number) => {
    setDeletingId(id)
    setError(null)
    const res = await api.del<unknown>(`/api/courses/${id}/`)
    if (!res.ok) {
      setError(res.error)
      setDeletingId(null)
      setConfirmDeleteId(null)
      return
    }
    setCourses((prev) => prev.filter((c) => c.id !== id))
    setDeletingId(null)
    setConfirmDeleteId(null)
  }

  const toggleStatus = (id: number) => {
    void (async () => {
      const course = courses.find((c) => c.id === id)
      if (!course) return
      const nextStatus: CourseStatus = course.status === 'published' ? 'draft' : 'published'
      setError(null)
      const res =
        nextStatus === 'published'
          ? await api.post<Course>(`/api/courses/${id}/publish/`, {})
          : await api.patch<Course>(`/api/courses/${id}/`, { status: nextStatus })
      if (!res.ok) {
        setError(res.error)
        return
      }
      setCourses((prev) => prev.map((c) => (c.id === id ? res.data : c)))
    })()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">{t('courses_admin.title')}</h2>
          <p className="text-muted-foreground">{t('courses_admin.subtitle')}</p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/cursos/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            {t('courses_admin.new')}
          </Link>
        </Button>
      </div>

      {error && (
        <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-4 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {loadingStats ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm">
              <div className="h-4 w-24 bg-muted rounded-md" />
              <div className="mt-3 h-7 w-16 bg-muted rounded-md" />
              <div className="mt-3 h-4 w-28 bg-muted rounded-md" />
            </div>
          ))
        ) : stats ? (
          <>
            <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm lg:col-span-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-sm font-semibold">{t('courses_admin.stats_total')}</div>
                  <div className="text-3xl font-bold">{stats.total}</div>
                  <div className="text-xs text-muted-foreground">
                    {t('courses_admin.stats_active')}: {stats.active}
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
                  <div className="text-sm font-semibold">{t('courses_admin.stats_published')}</div>
                  <div className="text-3xl font-bold">{stats.published}</div>
                  <div className="text-xs text-muted-foreground">
                    {t('courses_admin.stats_items')}: {stats.publishedContent.items}
                  </div>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center ring-1 ring-border">
                  <Eye className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-sm font-semibold">{t('courses_admin.stats_draft')}</div>
                  <div className="text-3xl font-bold">{stats.draft}</div>
                  <div className="text-xs text-muted-foreground">
                    {t('courses_admin.stats_items')}: {stats.draftContent.items}
                  </div>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center ring-1 ring-border">
                  <EyeOff className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-sm font-semibold">{t('courses_admin.stats_media')}</div>
                  <div className="text-3xl font-bold">{stats.mediaCount}</div>
                  <div className="text-xs text-muted-foreground">{formatBytes(stats.mediaSizeBytes)}</div>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-border">
                  <Video className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-sm font-semibold">{t('courses_admin.stats_promo')}</div>
                  <div className="text-3xl font-bold">{stats.withPromoVideo}</div>
                  <div className="text-xs text-muted-foreground">
                    {t('courses_admin.stats_avg_price')}: {formatCOP(Math.round(stats.avgPriceCOP || 0))}
                  </div>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-border">
                  <PlayIcon />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm lg:col-span-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-sm font-semibold">{t('courses_admin.stats_taxonomy')}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                      <Folder className="mr-2 h-3.5 w-3.5" />
                      {stats.categoryCount} {t('courses_admin.stats_categories')}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                      <Tag className="mr-2 h-3.5 w-3.5" />
                      {stats.uniqueTagsCount} {t('courses_admin.stats_tags')}
                    </span>
                  </div>
                  {stats.lastUpdatedAt ? (
                    <div className="text-xs text-muted-foreground">
                      <Clock className="inline-block mr-2 h-3.5 w-3.5" />
                      {t('courses_admin.stats_last_update')}: {new Date(stats.lastUpdatedAt).toLocaleString()}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
              <div className="h-5 w-2/3 bg-muted rounded-md" />
              <div className="mt-3 h-4 w-1/2 bg-muted rounded-md" />
              <div className="mt-6 h-9 w-full bg-muted rounded-xl" />
            </div>
          ))}
        {sortedCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-lg font-semibold">{course.title}</div>
                <div className="text-sm text-muted-foreground">/{course.slug}</div>
              </div>
              {course.coverUrl ? (
                <img src={course.coverUrl} alt={course.title} className="h-12 w-12 rounded-2xl object-cover ring-1 ring-border" />
              ) : (
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-border">
                  <ImageIcon className="h-5 w-5" />
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                  course.status === 'published'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {course.status === 'published' ? t('courses_admin.status_published') : t('courses_admin.status_draft')}
              </span>
              <span className="text-sm font-semibold">{formatCOP(course.priceCOP)}</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/cursos/${course.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  {t('courses_admin.edit')}
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleStatus(course.id)}
                className="gap-2"
              >
                {course.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {course.status === 'published' ? t('courses_admin.unpublish') : t('courses_admin.publish')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={deletingId === course.id}
                onClick={() => setConfirmDeleteId(course.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deletingId === course.id ? t('common.deleting', 'Eliminando...') : t('courses_admin.delete')}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

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
                  {t('courses_admin.confirm_delete_title', '¿Estás seguro?')}
                </h3>
                
                <p className="mb-8 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {t('courses_admin.confirm_delete_desc', 'Esta acción no se puede deshacer. El curso será eliminado permanentemente de la plataforma.')}
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
                    onClick={() => void executeDeleteCourse(confirmDeleteId)}
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
                        {t('courses_admin.confirm_delete_button', 'Sí, eliminar')}
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

function PlayIcon(): JSX.Element {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path
        d="M8.5 7.5v9l8-4.5-8-4.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
