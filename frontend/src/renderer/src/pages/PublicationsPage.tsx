import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '@/api/client'
import { Newspaper, UserRound, CheckCircle2, XCircle, Search, Sparkles, ShieldCheck, ShieldOff, X, AlertTriangle } from 'lucide-react'
import { cn } from '@/utils/cn'

type Patient = {
  id: number
  firstName: string
  lastName: string
  email: string
  userType?: string
  occupation?: string
  canPublish: boolean
  isActive: boolean
}

function userTypeBadgeClass(userType?: string): string {
  const ut = (userType || '').toLowerCase()
  if (ut === 'terapeuta') return 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
  if (ut === 'paciente') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
  return 'bg-muted text-muted-foreground'
}

function resolveLabel(userType?: string): string {
  if (!userType) return 'Miembro'
  const ut = userType.toLowerCase()
  if (ut === 'miembro') return 'Miembro'
  if (ut === 'paciente') return 'Paciente'
  if (ut === 'terapeuta') return 'Terapeuta'
  return userType.charAt(0).toUpperCase() + userType.slice(1)
}

export function PublicationsPage(): JSX.Element {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [confirmItem, setConfirmItem] = useState<Patient | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  const load = async () => {
    setLoading(true)
    setError(null)
    const res = await api.get<Patient[]>('/api/patients/')
    if (!res.ok) { setError(res.error); setLoading(false); return }
    setPatients(res.data)
    setLoading(false)
  }

  useEffect(() => { void load() }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return patients
      .filter(p => p.isActive)
      .filter(p =>
        !q ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        (p.email || '').toLowerCase().includes(q) ||
        (p.userType || '').toLowerCase().includes(q) ||
        (p.occupation || '').toLowerCase().includes(q)
      )
      .sort((a, b) => {
        // publishers first, then alphabetically
        if (a.canPublish !== b.canPublish) return a.canPublish ? -1 : 1
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
      })
  }, [patients, search])

  const publishers = patients.filter(p => p.canPublish && p.isActive).length

  const executeToggle = async (patient: Patient) => {
    setTogglingId(patient.id)
    setConfirmItem(null)
    const res = await api.patch<Patient>(`/api/patients/${patient.id}/`, {
      canPublish: !patient.canPublish,
    })
    if (res.ok) {
      setPatients(prev =>
        prev.map(p => p.id === patient.id ? { ...p, canPublish: !p.canPublish } : p)
      )
      showToast(
        patient.canPublish
          ? `${patient.firstName} ya no puede publicar.`
          : `${patient.firstName} ahora puede publicar.`,
        true
      )
    } else {
      showToast('Error al actualizar el permiso.', false)
    }
    setTogglingId(null)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-violet-500/10 flex items-center justify-center ring-1 ring-violet-500/20">
              <Newspaper className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Publicaciones</h2>
              <p className="text-muted-foreground text-sm">
                Gestiona quién puede publicar en el feed de la comunidad.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-2xl px-4 py-2.5">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
            {publishers} {publishers === 1 ? 'editor activo' : 'editores activos'}
          </span>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800/40 px-4 py-3">
        <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700 dark:text-amber-300">
          Solo los usuarios con permiso de publicación pueden crear posts en el feed de Conexión Luz. Activa o desactiva el permiso por usuario desde aquí.
        </p>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3">{error}</div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre, correo o rol..."
          className="w-full h-11 pl-10 pr-4 rounded-xl border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* User grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border bg-card/70 p-5 space-y-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-3 w-1/2 bg-muted rounded" />
              </div>
            </div>
            <div className="h-9 w-full bg-muted rounded-xl" />
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 rounded-2xl border bg-card/70 p-10 text-center text-muted-foreground">
            No se encontraron usuarios.
          </div>
        )}

        {!loading && filtered.map(p => {
          const isToggling = togglingId === p.id
          const fullName = `${p.firstName} ${p.lastName}`.trim()
          const initials = `${p.firstName?.[0] || ''}${p.lastName?.[0] || ''}`.toUpperCase()

          return (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'rounded-2xl border bg-card/80 backdrop-blur-sm p-5 shadow-sm transition-all duration-200 hover:shadow-md',
                p.canPublish && 'border-violet-300/60 dark:border-violet-700/40 ring-1 ring-violet-200 dark:ring-violet-800/30'
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'h-11 w-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ring-1',
                    p.canPublish
                      ? 'bg-violet-500/15 text-violet-600 dark:text-violet-400 ring-violet-300/50 dark:ring-violet-700/50'
                      : 'bg-muted text-muted-foreground ring-border'
                  )}>
                    {initials || <UserRound className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm truncate">{fullName}</div>
                    {p.email && <div className="text-xs text-muted-foreground truncate">{p.email}</div>}
                  </div>
                </div>
                {p.canPublish && (
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-[10px] font-black uppercase tracking-wider rounded-full px-2.5 py-1">
                      <Sparkles className="h-2.5 w-2.5" />
                      Editor
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className={cn('text-[11px] font-semibold rounded-full px-2.5 py-1', userTypeBadgeClass(p.userType))}>
                  {resolveLabel(p.userType)}
                </span>
                {p.occupation && (
                  <span className="text-[11px] text-muted-foreground bg-muted rounded-full px-2.5 py-1 truncate max-w-[140px]">
                    {p.occupation}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/publicaciones/usuario/${p.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl text-[11px] font-bold border hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
                >
                  <Newspaper className="h-3.5 w-3.5" />
                  Ver posts
                </Link>

                <button
                  type="button"
                  disabled={isToggling}
                  onClick={() => setConfirmItem(p)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl text-[11px] font-bold transition-all duration-200',
                    p.canPublish
                      ? 'bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 dark:text-rose-400'
                      : 'bg-violet-100 hover:bg-violet-200 text-violet-700 dark:bg-violet-900/30 dark:hover:bg-violet-900/50 dark:text-violet-400',
                    isToggling && 'opacity-60 cursor-not-allowed'
                  )}
                >
                  {isToggling ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                        className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full"
                      />
                    </span>
                  ) : p.canPublish ? (
                    <>
                      <ShieldOff className="h-3.5 w-3.5" />
                      Revocar
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Permitir
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirmItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.25 }}
              className="relative w-full max-w-sm rounded-3xl border bg-card/95 p-8 shadow-2xl backdrop-blur-xl mx-4"
            >
              <button
                onClick={() => setConfirmItem(null)}
                className="absolute right-5 top-5 rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col items-center text-center gap-4">
                <div className={cn(
                  'h-16 w-16 rounded-2xl flex items-center justify-center',
                  confirmItem.canPublish ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-violet-100 dark:bg-violet-900/30'
                )}>
                  {confirmItem.canPublish
                    ? <ShieldOff className="h-8 w-8 text-rose-600 dark:text-rose-400" />
                    : <ShieldCheck className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                  }
                </div>

                <div>
                  <h3 className="text-xl font-bold tracking-tight">
                    {confirmItem.canPublish ? 'Revocar permiso' : 'Conceder permiso'}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {confirmItem.canPublish
                      ? `${confirmItem.firstName} ${confirmItem.lastName} ya no podrá crear publicaciones en el feed.`
                      : `${confirmItem.firstName} ${confirmItem.lastName} podrá crear publicaciones en el feed de la comunidad.`
                    }
                  </p>
                </div>

                <div className="flex w-full gap-3 mt-2">
                  <button
                    onClick={() => setConfirmItem(null)}
                    className="flex-1 h-10 rounded-xl border font-semibold text-sm hover:bg-muted transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => void executeToggle(confirmItem)}
                    className={cn(
                      'flex-1 h-10 rounded-xl font-bold text-sm text-white transition-all shadow-lg',
                      confirmItem.canPublish
                        ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                        : 'bg-violet-600 hover:bg-violet-700 shadow-violet-600/20'
                    )}
                  >
                    {confirmItem.canPublish ? 'Sí, revocar' : 'Sí, conceder'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              'fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border px-4 py-3 shadow-xl text-sm font-semibold',
              toast.ok
                ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-destructive/10 border-destructive/30 text-destructive'
            )}
          >
            {toast.ok
              ? <CheckCircle2 className="h-4 w-4 shrink-0" />
              : <AlertTriangle className="h-4 w-4 shrink-0" />
            }
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
