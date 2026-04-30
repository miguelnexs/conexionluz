import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { api } from '@/api/client'
import { Plus, Trash2, Pencil, UserRound, AlertTriangle, X } from 'lucide-react'
import { Link } from 'react-router-dom'

type Patient = {
  id: number
  firstName: string
  lastName: string
  documentNumber?: string
  email: string
  phone: string
  city?: string
  notes: string
  isActive: boolean
  intakeCompleted?: boolean
  createdAt?: string | null
  updatedAt?: string | null
}

function formatDate(value?: string | null): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('es-CO')
}

export function PatientsPage(): JSX.Element {
  const { t } = useTranslation()
  const [items, setItems] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const sorted = useMemo(() => {
    const list = [...items]
    list.sort((a, b) => {
      const activeA = a.isActive ? 0 : 1
      const activeB = b.isActive ? 0 : 1
      if (activeA !== activeB) return activeA - activeB
      const aName = `${a.firstName} ${a.lastName}`.trim()
      const bName = `${b.firstName} ${b.lastName}`.trim()
      return aName.localeCompare(bName)
    })
    return list
  }, [items])

  const load = async () => {
    setLoading(true)
    setError(null)
    const res = await api.get<Patient[]>('/api/patients/')
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

  const executeDeletePatient = async (id: number) => {
    setDeletingId(id)
    setError(null)
    const res = await api.del<unknown>(`/api/patients/${id}/`)
    if (!res.ok) {
      setError(res.error)
      setDeletingId(null)
      setConfirmDeleteId(null)
      return
    }
    setItems((prev) => prev.filter((p) => p.id !== id))
    setDeletingId(null)
    setConfirmDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">{t('patients_admin.title')}</h2>
          <p className="text-muted-foreground">{t('patients_admin.subtitle')}</p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/pacientes/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            {t('patients_admin.new')}
          </Link>
        </Button>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="h-12 w-12 rounded-2xl bg-muted" />
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
            {t('patients_admin.empty')}
          </div>
        )}

        {sorted.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-border">
                <UserRound className="h-6 w-6" />
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                  p.isActive
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {p.isActive ? t('patients_admin.active_on') : t('patients_admin.active_off')}
              </span>
            </div>

            <div className="mt-4 space-y-1">
              <div className="text-lg font-semibold">{`${p.firstName} ${p.lastName}`.trim()}</div>
              {p.documentNumber ? <div className="text-xs text-muted-foreground">{p.documentNumber}</div> : null}
              <div className="flex flex-wrap gap-2 pt-1">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                    p.intakeCompleted
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {p.intakeCompleted ? t('patients_admin.intake_done') : t('patients_admin.intake_pending')}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-1 text-sm">
              <div className="text-muted-foreground">{t('patients_admin.table_contact')}</div>
              {p.email ? <div>{p.email}</div> : <div className="text-muted-foreground">—</div>}
              {p.phone ? <div className="text-xs text-muted-foreground">{p.phone}</div> : null}
              {p.city ? <div className="text-xs text-muted-foreground">{p.city}</div> : null}
            </div>

            {p.notes ? <div className="mt-4 text-sm text-muted-foreground leading-relaxed">{p.notes}</div> : null}

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">{t('patients_admin.table_created')}</div>
              <div className="text-sm text-muted-foreground">{formatDate(p.createdAt) || '—'}</div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link to={`/pacientes/${p.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  {t('patients_admin.edit')}
                </Link>
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                disabled={deletingId === p.id}
                onClick={() => setConfirmDeleteId(p.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deletingId === p.id ? t('patients_admin.deleting', 'Eliminando...') : t('patients_admin.delete', 'Eliminar')}
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
                  {t('patients_admin.confirm_delete_title', '¿Estás seguro?')}
                </h3>
                
                <p className="mb-8 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {t('patients_admin.confirm_delete_desc', 'Esta acción no se puede deshacer. El paciente será eliminado permanentemente de la plataforma.')}
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
                    onClick={() => void executeDeletePatient(confirmDeleteId)}
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
                        {t('patients_admin.deleting', 'Eliminando...')}
                      </span>
                    ) : (
                      <span className="flex items-center font-medium">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('patients_admin.confirm_delete_button', 'Sí, eliminar')}
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
