import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/api/client'
import { Crown, Plus, Trash2, Edit2, Users, CheckCircle, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Plan = {
  id: number
  name: string
  slug: string
  description: string
  priceCOP: number
  priceUSD: number
  priceEUR: number
  annualPriceCOP: number
  annualPriceUSD: number
  annualPriceEUR: number
  monthlyDiscountPercent: number
  annualDiscountPercent: number
  sessionsPerMonth: number
  sessionsBreakdown: { name: string; count: number; description: string }[]
  benefits: string[]
  isActive: boolean
  isFeatured: boolean
}

type Subscription = {
  id: number
  patientId: number
  patientName: string
  planId: number
  planName: string
  status: string
  paymentMethod: string
  startsAt: string
  endsAt: string | null
  sessionsUsed: number
  notes: string
}

type Patient = { id: number; firstName: string; lastName: string }

const STATUS_LABELS: Record<string, string> = {
  active: 'Activa',
  paused: 'Pausada',
  cancelled: 'Cancelada',
  expired: 'Vencida',
}
const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  paused: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300',
  cancelled: 'bg-muted text-muted-foreground',
  expired: 'bg-red-500/15 text-red-700 dark:text-red-300',
}

export function MembershipsPage(): JSX.Element {
  const navigate = useNavigate()
  const [plans, setPlans] = useState<Plan[]>([])
  const [subs, setSubs] = useState<Subscription[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'plans' | 'subs'>('plans')
  const [showSubForm, setShowSubForm] = useState(false)
  const [subForm, setSubForm] = useState({ patientId: '', planId: '', startsAt: '', endsAt: '', paymentMethod: 'transfer', notes: '', status: 'active' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null)

  const load = async () => {
    setLoading(true)
    const [p, s, pat] = await Promise.all([
      api.get<Plan[]>('/api/memberships/plans/'),
      api.get<Subscription[]>('/api/memberships/subscriptions/'),
      api.get<Patient[]>('/api/patients/'),
    ])
    if (p.ok) setPlans(p.data)
    if (s.ok) setSubs(s.data)
    if (pat.ok) setPatients(pat.data)
    setLoading(false)
  }

  useEffect(() => { void load() }, [])

  const deletePlan = async (id: number) => {
    if (!window.confirm('¿Eliminar este plan?')) return
    const res = await api.del(`/api/memberships/plans/${id}/`)
    if (!res.ok) {
      alert(res.error)
    } else {
      await load()
    }
  }

  const saveSub = async () => {
    setSaving(true); setError(null)
    const payload = { patientId: Number(subForm.patientId), planId: Number(subForm.planId), startsAt: subForm.startsAt, endsAt: subForm.endsAt || null, paymentMethod: subForm.paymentMethod, notes: subForm.notes, status: subForm.status }
    const res = await api.post<Subscription>('/api/memberships/subscriptions/', payload)
    setSaving(false)
    if (!res.ok) { setError(res.error); return }
    setShowSubForm(false); setSubForm({ patientId: '', planId: '', startsAt: '', endsAt: '', paymentMethod: 'transfer', notes: '', status: 'active' }); await load()
  }

  const updateSubStatus = async (id: number, status: string) => {
    await api.patch(`/api/memberships/subscriptions/${id}/`, { status }); await load()
  }

  const deleteSubscription = async (id: number) => {
    if (!window.confirm('¿Eliminar esta suscripción permanentemente?')) return
    const res = await api.del(`/api/memberships/subscriptions/${id}/`)
    if (!res.ok) {
      alert(res.error)
    } else {
      await load()
    }
  }

  const activeSubs = subs.filter(s => s.status === 'active').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-500/10 flex items-center justify-center ring-1 ring-border">
              <Crown className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Membresías</h2>
              <p className="text-muted-foreground">Gestión de planes y suscripciones Premium</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setShowSubForm(true); setError(null) }}>
            <Users className="mr-2 h-4 w-4" /> Nueva Suscripción
          </Button>
          <Button onClick={() => navigate('/membresias/planes/nuevo')} className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Plan
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Planes Activos', value: plans.filter(p => p.isActive).length, color: 'text-yellow-500' },
          { label: 'Suscripciones Activas', value: activeSubs, color: 'text-emerald-500' },
          { label: 'Total Suscripciones', value: subs.length, color: 'text-blue-500' },
          { label: 'Sesiones Usadas (mes)', value: subs.filter(s => s.status === 'active').reduce((a, b) => a + b.sessionsUsed, 0), color: 'text-violet-500' },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm">
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {(['plans', 'subs'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${tab === t ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {t === 'plans' ? `Planes (${plans.length})` : `Suscripciones (${subs.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Cargando...</div>
      ) : tab === 'plans' ? (
        <div className="space-y-4">
          {plans.length === 0 && <div className="rounded-2xl border bg-card/70 p-8 text-center text-muted-foreground">No hay planes. Crea uno con el botón de arriba.</div>}
          {plans.map(plan => (
            <div key={plan.id} className="rounded-2xl border bg-card/70 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="p-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-500/10 flex items-center justify-center ring-1 ring-border shrink-0">
                    <Crown className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-lg">{plan.name}</span>
                      {plan.isFeatured && <span className="text-xs bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded-full font-semibold">Destacado</span>}
                      {!plan.isActive && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Inactivo</span>}
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                      <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
                        <span className="font-semibold text-foreground">Mensual:</span>
                        <span>🇨🇴 ${plan.priceCOP.toLocaleString()} COP</span>
                        <span>🇺🇸 ${plan.priceUSD} USD</span>
                        <span>🇪🇺 €{plan.priceEUR}</span>
                        {plan.monthlyDiscountPercent > 0 && <span className="text-emerald-500">(-{plan.monthlyDiscountPercent}%)</span>}
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
                        <span className="font-semibold text-foreground">Anual:</span>
                        <span>🇨🇴 ${plan.annualPriceCOP.toLocaleString()} COP</span>
                        <span>🇺🇸 ${plan.annualPriceUSD} USD</span>
                        <span>🇪🇺 €{plan.annualPriceEUR}</span>
                        {plan.annualDiscountPercent > 0 && <span className="text-emerald-500">(-{plan.annualDiscountPercent}%)</span>}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <span>{plan.sessionsPerMonth} sesiones al mes</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}>
                    {expandedPlan === plan.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/membresias/planes/${plan.id}/editar`)}><Edit2 className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => void deletePlan(plan.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              {expandedPlan === plan.id && (
                <div className="border-t p-5 grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-3">SESIONES INCLUIDAS</div>
                    <div className="space-y-3">
                      {plan.sessionsBreakdown.map((s, i) => (
                        <div key={i} className="rounded-xl border bg-background p-3">
                          <div className="font-semibold text-sm">{s.count > 0 ? `${s.count}x ` : ''}{s.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{s.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-3">BENEFICIOS</div>
                    <div className="space-y-2">
                      {plan.benefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {subs.length === 0 && <div className="rounded-2xl border bg-card/70 p-8 text-center text-muted-foreground">No hay suscripciones todavía.</div>}
          {subs.map(sub => (
            <div key={sub.id} className="rounded-2xl border bg-card/70 backdrop-blur-sm p-4 flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-500/10 flex items-center justify-center ring-1 ring-border shrink-0">
                  <Crown className="h-4 w-4 text-yellow-500" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{sub.patientName}</div>
                  <div className="text-xs text-muted-foreground">{sub.planName} · Desde {sub.startsAt}{sub.endsAt ? ` hasta ${sub.endsAt}` : ''}</div>
                  <div className="text-xs text-muted-foreground">Sesiones usadas: {sub.sessionsUsed}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[sub.status] || 'bg-muted'}`}>{STATUS_LABELS[sub.status] || sub.status}</span>
                <select value={sub.status} onChange={e => void updateSubStatus(sub.id, e.target.value)} className="text-xs rounded-xl border bg-background px-2 py-1.5 outline-none">
                  {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8" onClick={() => void deleteSubscription(sub.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subscription Form Modal */}
      {showSubForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <button className="absolute inset-0 bg-black/50" onClick={() => setShowSubForm(false)} />
          <div className="relative w-full max-w-lg rounded-3xl bg-card border shadow-xl overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <div className="font-bold text-lg">Nueva Suscripción</div>
              <button onClick={() => setShowSubForm(false)} className="h-9 w-9 rounded-xl border bg-background flex items-center justify-center hover:shadow-sm transition-all"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="rounded-xl border bg-red-50 dark:bg-red-950/20 p-3 text-sm text-red-500">{error}</div>}
              <div className="space-y-1.5"><label className="text-sm font-semibold">Paciente</label>
                <select value={subForm.patientId} onChange={e => setSubForm(p => ({ ...p, patientId: e.target.value }))} className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Selecciona un paciente...</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
                </select>
              </div>
              <div className="space-y-1.5"><label className="text-sm font-semibold">Plan</label>
                <select value={subForm.planId} onChange={e => setSubForm(p => ({ ...p, planId: e.target.value }))} className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Selecciona un plan...</option>
                  {plans.filter(p => p.isActive).map(p => <option key={p.id} value={p.id}>{p.name} — ${p.priceCOP.toLocaleString()} COP</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-sm font-semibold">Fecha de Inicio</label><input type="date" value={subForm.startsAt} onChange={e => setSubForm(p => ({ ...p, startsAt: e.target.value }))} className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></div>
                <div className="space-y-1.5"><label className="text-sm font-semibold">Fecha de Fin (opcional)</label><input type="date" value={subForm.endsAt} onChange={e => setSubForm(p => ({ ...p, endsAt: e.target.value }))} className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></div>
              </div>
              <div className="space-y-1.5"><label className="text-sm font-semibold">Método de Pago</label>
                <select value={subForm.paymentMethod} onChange={e => setSubForm(p => ({ ...p, paymentMethod: e.target.value }))} className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                  <option value="transfer">Transferencia Bancaria</option>
                  <option value="cash">Efectivo</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              <div className="space-y-1.5"><label className="text-sm font-semibold">Notas</label><textarea value={subForm.notes} onChange={e => setSubForm(p => ({ ...p, notes: e.target.value }))} className="w-full min-h-[70px] rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></div>
            </div>
            <div className="p-5 border-t flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowSubForm(false)} disabled={saving}>Cancelar</Button>
              <Button onClick={() => void saveSub()} disabled={saving} className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:opacity-90">{saving ? 'Guardando...' : 'Crear Suscripción'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
