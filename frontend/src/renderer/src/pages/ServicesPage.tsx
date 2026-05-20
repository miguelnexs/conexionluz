import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Pencil, Sparkles, AlertTriangle, X, BarChart3, CheckCircle2, Wallet, TrendingUp } from 'lucide-react'
import { api } from '@/api/client'
import { Link } from 'react-router-dom'

type Service = {
  id: number
  title: string
  description: string
  priceCOP: number
  durationMinutes?: number
  modality?: string
  bookingUrl?: string
  isActive: boolean
  createdAt?: string | null
  updatedAt?: string | null
}

export function ServicesPage(): JSX.Element {
  const { t } = useTranslation()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  useEffect(() => {
    void (async () => {
      setLoading(true)
      setError(null)
      const res = await api.get<Service[]>('/api/services/')
      if (!res.ok) {
        setError(res.error)
        setLoading(false)
        return
      }
      setServices(res.data)
      setLoading(false)
    })()
  }, [])

  const formatCOP = (value: number) =>
    value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

  const modalityLabel = (value: string): string => {
    if (value === 'online') return t('services_admin.modality_online')
    if (value === 'presential') return t('services_admin.modality_presential')
    if (value === 'hybrid') return t('services_admin.modality_hybrid')
    return value
  }

  const stats = useMemo(() => {
    const total = services.length
    const active = services.filter((s) => s.isActive).length
    const inactive = total - active
    const totalPrice = services.reduce((acc, s) => acc + (s.priceCOP || 0), 0)
    const avgPrice = total > 0 ? totalPrice / total : 0
    const premium = services.filter((s) => s.priceCOP > 250000).length

    return { total, active, inactive, avgPrice, premium }
  }, [services])

  const sorted = useMemo(() => {
    const list = [...services]
    list.sort((a, b) => {
      const activeA = a.isActive ? 0 : 1
      const activeB = b.isActive ? 0 : 1
      if (activeA !== activeB) return activeA - activeB
      return a.title.localeCompare(b.title)
    })
    return list
  }, [services])

  const executeDeleteService = async (id: number) => {
    setDeletingId(id)
    setError(null)
    const res = await api.del<unknown>(`/api/services/${id}/`)
    if (!res.ok) {
      setError(res.error)
      setDeletingId(null)
      setConfirmDeleteId(null)
      return
    }
    setServices((prev) => prev.filter((s) => s.id !== id))
    setDeletingId(null)
    setConfirmDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{t('services_admin.title')}</h2>
          <p className="text-muted-foreground max-w-2xl">{t('services_admin.subtitle')}</p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/servicios/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            {t('services_admin.new')}
          </Link>
        </Button>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      {/* Statistics Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-card/60 backdrop-blur-sm p-5 shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <BarChart3 className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Total</span>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Servicios registrados</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border bg-card/60 backdrop-blur-sm p-5 shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Activos</span>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">{stats.inactive} servicios inactivos</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border bg-card/60 backdrop-blur-sm p-5 shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Promedio</span>
          </div>
          <div>
            <div className="text-2xl font-bold">{formatCOP(stats.avgPrice)}</div>
            <p className="text-xs text-muted-foreground">Inversión promedio</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border bg-card/60 backdrop-blur-sm p-5 shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Premium</span>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.premium}</div>
            <p className="text-xs text-muted-foreground">{t('services_admin.premium_desc', 'Servicios de alta gama')}</p>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="h-10 w-10 rounded-2xl bg-muted" />
                <div className="h-6 w-16 bg-muted rounded-full" />
              </div>
              <div className="mt-4 h-5 w-2/3 bg-muted rounded-md" />
              <div className="mt-3 h-4 w-full bg-muted rounded-md" />
              <div className="mt-2 h-4 w-5/6 bg-muted rounded-md" />
              <div className="mt-5 h-9 w-full bg-muted rounded-xl" />
            </div>
          ))}

        {!loading && sorted.length === 0 && (
          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-8 text-muted-foreground md:col-span-2 lg:col-span-3">
            {t('services_admin.empty')}
          </div>
        )}

        {sorted.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-border">
                <Sparkles className="h-6 w-6" />
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                  s.isActive
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {s.isActive ? t('services_admin.active_on') : t('services_admin.active_off')}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-lg font-semibold">{s.title}</div>
              {s.description ? (
                <div className="text-sm text-muted-foreground leading-relaxed">{s.description}</div>
              ) : null}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">{t('services_admin.table_price')}</div>
              <div className="font-semibold">{s.priceCOP > 0 ? formatCOP(s.priceCOP) : '—'}</div>
            </div>

            {(typeof s.durationMinutes === 'number' && s.durationMinutes > 0) || s.modality ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {typeof s.durationMinutes === 'number' && s.durationMinutes > 0 ? (
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                    {s.durationMinutes} min
                  </span>
                ) : null}
                {s.modality ? (
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                    {modalityLabel(s.modality)}
                  </span>
                ) : null}
              </div>
            ) : null}

            {s.bookingUrl ? (
              <div className="mt-3 text-xs text-muted-foreground break-all">
                {t('services_admin.booking_url_label')}: {s.bookingUrl}
              </div>
            ) : null}

            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link to={`/servicios/${s.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  {t('services_admin.edit')}
                </Link>
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                disabled={deletingId === s.id}
                onClick={() => setConfirmDeleteId(s.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deletingId === s.id ? t('services_admin.deleting', 'Eliminando...') : t('services_admin.delete', 'Eliminar')}
              </Button>
            </div>
          </div>
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
                  {t('services_admin.confirm_delete_title', '¿Estás seguro?')}
                </h3>
                
                <p className="mb-8 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {t('services_admin.confirm_delete_desc', 'Esta acción no se puede deshacer. El servicio será eliminado permanentemente de la plataforma.')}
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
                    onClick={() => void executeDeleteService(confirmDeleteId)}
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
                        {t('services_admin.deleting', 'Eliminando...')}
                      </span>
                    ) : (
                      <span className="flex items-center font-medium">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('services_admin.confirm_delete_button', 'Sí, eliminar')}
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
