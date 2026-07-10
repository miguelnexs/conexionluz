import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Calendar, FileText, MapPin, Plus, Sparkles, Trash2, AlertTriangle, X } from 'lucide-react'
import { api } from '@/api/client'
import { Link } from 'react-router-dom'

type Therapist = {
  id: number
  name: string
  title: string
  description?: string
  specialties: string[]
  modality: string
  location: string
  priceFromCOP?: number
  cvUrl?: string | null
  photoUrl?: string | null
  isActive?: boolean
}

export function TherapistsPage(): JSX.Element {
  const { t } = useTranslation()
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const formatCOP = (value: number) =>
    value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

  useEffect(() => {
    void (async () => {
      setLoading(true)
      const res = await api.get<Therapist[]>('/api/therapists/')
      if (!res.ok) {
        setError(res.error)
        setLoading(false)
        return
      }
      setTherapists(res.data)
      setLoading(false)
    })()
  }, [])

  const executeDeleteTherapist = async (id: number) => {
    setDeletingId(id)
    setError(null)
    const res = await api.del<unknown>(`/api/therapists/${id}/`)
    if (!res.ok) {
      setError(res.error)
      setDeletingId(null)
      setConfirmDeleteId(null)
      return
    }
    setTherapists((prev) => prev.filter((t) => t.id !== id))
    setDeletingId(null)
    setConfirmDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{t('therapists.title')}</h2>
          <p className="text-muted-foreground max-w-2xl">{t('therapists.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button className="shrink-0" variant="secondary">
            <Sparkles className="mr-2 h-4 w-4" />
            {t('therapists.cta')}
          </Button>
          <Button asChild className="shrink-0">
            <Link to="/terapeutas/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              {t('therapists_admin.add')}
            </Link>
          </Button>
        </div>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
              <div className="h-5 w-2/3 bg-muted rounded-md" />
              <div className="mt-3 h-4 w-1/2 bg-muted rounded-md" />
              <div className="mt-6 h-20 w-full bg-muted rounded-xl" />
            </div>
          ))}
        {therapists.map((therapist, index) => (
          <motion.div
            key={therapist.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="group rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold">{therapist.name}</div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      therapist.isActive === false
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {therapist.isActive === false ? t('therapists_admin.active_off') : t('therapists_admin.active_on')}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">{therapist.title}</div>
              </div>
              <div className="relative h-16 w-16 shrink-0">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/35 via-accent/25 to-amber-400/25 blur-sm opacity-80" />
                <div className="absolute inset-0 rounded-full ring-1 ring-border bg-background/60 backdrop-blur-sm" />
                {therapist.photoUrl ? (
                  <img
                    src={therapist.photoUrl}
                    alt={therapist.name}
                    className="relative h-16 w-16 rounded-full object-cover ring-2 ring-background shadow-md"
                  />
                ) : (
                  <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-primary/25 to-accent/10 ring-2 ring-background shadow-md" />
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {therapist.specialties.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-secondary/60 px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {therapist.description && (
              <div className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {therapist.description}
              </div>
            )}

            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              {typeof therapist.priceFromCOP === 'number' && therapist.priceFromCOP > 0 && (
                <div className="flex items-center justify-between gap-3">
                  <span>{t('therapists_admin.price_from_short')}</span>
                  <span className="font-semibold text-foreground">{formatCOP(therapist.priceFromCOP)}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{therapist.modality}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{therapist.location}</span>
              </div>
              {therapist.cvUrl && (
                <a
                  href={therapist.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  {t('therapists_admin.view_cv')}
                </a>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <Button asChild className="flex-1" variant="outline">
                <Link to={`/terapeutas/${therapist.id}`}>{t('therapists_admin.edit')}</Link>
              </Button>
              <Button
                className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                variant="outline"
                disabled={deletingId === therapist.id}
                onClick={() => setConfirmDeleteId(therapist.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deletingId === therapist.id ? t('therapists_admin.deleting') : t('therapists_admin.delete')}
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
                  {t('therapists_admin.confirm_delete_title', '¿Estás seguro?')}
                </h3>
                
                <p className="mb-8 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {t('therapists_admin.confirm_delete_desc', 'Esta acción no se puede deshacer. El terapeuta será eliminado permanentemente de la plataforma.')}
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
                    onClick={() => void executeDeleteTherapist(confirmDeleteId)}
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
                        {t('therapists_admin.deleting', 'Eliminando...')}
                      </span>
                    ) : (
                      <span className="flex items-center font-medium">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('therapists_admin.confirm_delete_button', 'Sí, eliminar')}
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
