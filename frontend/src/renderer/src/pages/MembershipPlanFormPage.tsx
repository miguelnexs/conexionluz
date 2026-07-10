import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '@/api/client'
import { Crown, ArrowLeft, Plus, Trash2, CheckCircle, Save, RefreshCw, Link as LinkIcon, Link2Off } from 'lucide-react'
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

const EMPTY_PLAN: Omit<Plan, 'id'> = {
  name: '',
  slug: '',
  description: '',
  priceCOP: 280000,
  priceUSD: 70,
  priceEUR: 70,
  annualPriceCOP: 2800000,
  annualPriceUSD: 700,
  annualPriceEUR: 700,
  monthlyDiscountPercent: 0,
  annualDiscountPercent: 0,
  sessionsPerMonth: 3,
  sessionsBreakdown: [
    { name: 'Hipnoanálisis', count: 1, description: 'Exploramos el origen profundo de tus bloqueos, creencias y patrones.' },
    { name: 'Sesiones de Hipnosis Clínica', count: 2, description: 'Reprogramación subconsciente para cambios profundos y duraderos.' },
  ],
  benefits: ['Reducción del Estrés y la Ansiedad', 'Transformación de Creencias', 'Mejora tu Confianza y Autoestima', 'Claridad y Enfoque', 'Bienestar Físico y Emocional'],
  isActive: true,
  isFeatured: true,
}

export function MembershipPlanFormPage({ mode }: { mode: 'create' | 'edit' }): JSX.Element {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<Omit<Plan, 'id'>>(EMPTY_PLAN)
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Currency Sync State
  const [rates, setRates] = useState<{ usd: number; eur: number } | null>(null)
  const [syncEnabled, setSyncEnabled] = useState(true)
  const [fetchingRates, setFetchingRates] = useState(false)

  useEffect(() => {
    // Fetch rates
    setFetchingRates(true)
    fetch('https://api.exchangerate-api.com/v4/latest/COP')
      .then(r => r.json())
      .then(data => {
        if (data.rates) {
          setRates({
            usd: data.rates.USD,
            eur: data.rates.EUR
          })
        }
      })
      .catch(err => console.error('Error fetching rates:', err))
      .finally(() => setFetchingRates(false))

    if (mode === 'edit' && id) {
      api.get<Plan>(`/api/memberships/plans/${id}/`).then(res => {
        if (res.ok) {
          setForm({
            name: res.data.name,
            slug: res.data.slug,
            description: res.data.description,
            priceCOP: res.data.priceCOP,
            priceUSD: res.data.priceUSD,
            priceEUR: res.data.priceEUR,
            annualPriceCOP: res.data.annualPriceCOP,
            annualPriceUSD: res.data.annualPriceUSD,
            annualPriceEUR: res.data.annualPriceEUR,
            monthlyDiscountPercent: res.data.monthlyDiscountPercent,
            annualDiscountPercent: res.data.annualDiscountPercent,
            sessionsPerMonth: res.data.sessionsPerMonth,
            sessionsBreakdown: [...res.data.sessionsBreakdown],
            benefits: [...res.data.benefits],
            isActive: res.data.isActive,
            isFeatured: res.data.isFeatured
          })
        } else {
          setError(res.error)
        }
        setLoading(false)
      })
    }
  }, [id, mode])

  // Sync Logic
  const syncCurrencies = (copValue: number, type: 'monthly' | 'annual') => {
    if (!syncEnabled || !rates) return
    
    const usdVal = Math.round(copValue * rates.usd)
    const eurVal = Math.round(copValue * rates.eur)

    if (type === 'monthly') {
      setForm(p => ({ ...p, priceUSD: usdVal, priceEUR: eurVal }))
    } else {
      setForm(p => ({ ...p, annualPriceUSD: usdVal, annualPriceEUR: eurVal }))
    }
  }

  const handleCopChange = (val: number, type: 'monthly' | 'annual') => {
    if (type === 'monthly') {
      setForm(p => ({ ...p, priceCOP: val }))
      syncCurrencies(val, 'monthly')
    } else {
      setForm(p => ({ ...p, annualPriceCOP: val }))
      syncCurrencies(val, 'annual')
    }
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    const payload = { ...form, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }
    const res = mode === 'edit'
      ? await api.patch<Plan>(`/api/memberships/plans/${id}/`, payload)
      : await api.post<Plan>('/api/memberships/plans/', payload)
    setSaving(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    navigate('/membresias')
  }

  // Helpers
  const addBenefit = () => setForm(p => ({ ...p, benefits: [...p.benefits, ''] }))
  const updateBenefit = (idx: number, val: string) => setForm(p => {
    const next = [...p.benefits]
    next[idx] = val
    return { ...p, benefits: next }
  })
  const removeBenefit = (idx: number) => setForm(p => ({ ...p, benefits: p.benefits.filter((_, i) => i !== idx) }))

  const addSession = () => setForm(p => ({ ...p, sessionsBreakdown: [...p.sessionsBreakdown, { name: '', count: 0, description: '' }] }))
  const updateSession = (idx: number, field: keyof Plan['sessionsBreakdown'][0], val: any) => setForm(p => {
    const next = [...p.sessionsBreakdown]
    next[idx] = { ...next[idx], [field]: val }
    return { ...p, sessionsBreakdown: next }
  })
  const removeSession = (idx: number) => setForm(p => ({ ...p, sessionsBreakdown: p.sessionsBreakdown.filter((_, i) => i !== idx) }))

  if (loading) return <div className="p-8 text-center text-muted-foreground">Cargando datos del plan...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/membresias')}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{mode === 'edit' ? 'Editar Plan' : 'Nuevo Plan de Membresía'}</h2>
            <p className="text-muted-foreground">Define las características y precios de tu membresía premium</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => void save()} disabled={saving} className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:opacity-90">
            <Save className="mr-2 h-4 w-4" /> {saving ? 'Guardando...' : 'Guardar Plan'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border bg-card p-6 space-y-6 shadow-sm">
            {error && <div className="rounded-xl border bg-red-50 dark:bg-red-950/20 p-3 text-sm text-red-500">{error}</div>}
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5"><label className="text-sm font-semibold">Nombre del Plan</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Membresía Premium" /></div>
              <div className="space-y-1.5"><label className="text-sm font-semibold">Slug (URL)</label><input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="membresia-premium" /></div>
            </div>

            <div className="space-y-1.5"><label className="text-sm font-semibold">Descripción General</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full min-h-[80px] rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Breve resumen de la membresía..." /></div>

            {/* Sessions Breakdown */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold">Desglose de Sesiones</label>
                <Button variant="outline" size="sm" onClick={addSession}><Plus className="mr-2 h-3 w-3" /> Añadir Sesión</Button>
              </div>
              <div className="space-y-3">
                {form.sessionsBreakdown.map((s, i) => (
                  <div key={i} className="p-4 rounded-2xl border bg-muted/20 space-y-3 relative group">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeSession(i)}><Trash2 className="h-4 w-4" /></Button>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="col-span-3 space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Nombre de la Sesión</label>
                        <input value={s.name} onChange={e => updateSession(i, 'name', e.target.value)} className="w-full rounded-lg border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Ej: Hipnoanálisis" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Cantidad</label>
                        <input type="number" value={s.count} onChange={e => updateSession(i, 'count', Number(e.target.value))} className="w-full rounded-lg border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Descripción</label>
                      <input value={s.description} onChange={e => updateSession(i, 'description', e.target.value)} className="w-full rounded-lg border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Breve explicación..." />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold">Beneficios del Plan</label>
              <Button variant="outline" size="sm" onClick={addBenefit}><Plus className="mr-2 h-3 w-3" /> Añadir Beneficio</Button>
            </div>
            <div className="space-y-2">
              {form.benefits.map((b, i) => (
                <div key={i} className="flex gap-2">
                  <div className="flex-1 relative">
                    <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <input value={b} onChange={e => updateBenefit(i, e.target.value)} className="w-full rounded-xl border bg-background pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Escribe un beneficio..." />
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => removeBenefit(i)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Settings */}
        <div className="space-y-6">
          {/* TRM Info & Sync */}
          <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
              {fetchingRates ? <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin" /> : <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Calculadora TRM</div>
              <button 
                onClick={() => setSyncEnabled(!syncEnabled)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black transition-all ${syncEnabled ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}
              >
                {syncEnabled ? <LinkIcon className="h-3 w-3" /> : <Link2Off className="h-3 w-3" />}
                {syncEnabled ? 'ENLAZADO' : 'MANUAL'}
              </button>
            </div>
            {rates ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">USD/COP</span>
                  <span className="font-bold">${(1/rates.usd).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">EUR/COP</span>
                  <span className="font-bold">${(1/rates.eur).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                {syncEnabled && (
                  <p className="text-[10px] text-muted-foreground italic mt-2">Los precios USD/EUR se actualizarán automáticamente al cambiar el precio COP.</p>
                )}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground animate-pulse">Obteniendo tasas de cambio reales...</div>
            )}
          </div>

          {/* Pricing */}
          <div className="rounded-2xl border bg-card p-6 space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Facturación Mensual</div>
              <div className="space-y-3">
                <div className="space-y-1.5"><label className="text-xs font-semibold">COP</label><input type="number" value={form.priceCOP} onChange={e => handleCopChange(Number(e.target.value), 'monthly')} className="w-full rounded-xl border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs font-semibold">USD</label><input type="number" value={form.priceUSD} onChange={e => setForm(p => ({ ...p, priceUSD: Number(e.target.value) }))} className={`w-full rounded-xl border px-4 py-2 text-sm outline-none transition-colors ${syncEnabled ? 'bg-muted/50 border-transparent cursor-not-allowed' : 'bg-background border-border'}`} readOnly={syncEnabled} /></div>
                <div className="space-y-1.5"><label className="text-xs font-semibold">EUR</label><input type="number" value={form.priceEUR} onChange={e => setForm(p => ({ ...p, priceEUR: Number(e.target.value) }))} className={`w-full rounded-xl border px-4 py-2 text-sm outline-none transition-colors ${syncEnabled ? 'bg-muted/50 border-transparent cursor-not-allowed' : 'bg-background border-border'}`} readOnly={syncEnabled} /></div>
                <div className="space-y-1.5"><label className="text-xs font-semibold text-emerald-600">Descuento Mensual (%)</label><input type="number" value={form.monthlyDiscountPercent} onChange={e => setForm(p => ({ ...p, monthlyDiscountPercent: Number(e.target.value) }))} className="w-full rounded-xl border border-emerald-100 bg-emerald-50/20 px-4 py-2 text-sm outline-none" /></div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Facturación Anual</div>
              <div className="space-y-3">
                <div className="space-y-1.5"><label className="text-xs font-semibold">COP</label><input type="number" value={form.annualPriceCOP} onChange={e => handleCopChange(Number(e.target.value), 'annual')} className="w-full rounded-xl border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs font-semibold">USD</label><input type="number" value={form.annualPriceUSD} onChange={e => setForm(p => ({ ...p, annualPriceUSD: Number(e.target.value) }))} className={`w-full rounded-xl border px-4 py-2 text-sm outline-none transition-colors ${syncEnabled ? 'bg-muted/50 border-transparent cursor-not-allowed' : 'bg-background border-border'}`} readOnly={syncEnabled} /></div>
                <div className="space-y-1.5"><label className="text-xs font-semibold">EUR</label><input type="number" value={form.annualPriceEUR} onChange={e => setForm(p => ({ ...p, annualPriceEUR: Number(e.target.value) }))} className={`w-full rounded-xl border px-4 py-2 text-sm outline-none transition-colors ${syncEnabled ? 'bg-muted/50 border-transparent cursor-not-allowed' : 'bg-background border-border'}`} readOnly={syncEnabled} /></div>
                <div className="space-y-1.5"><label className="text-xs font-semibold text-emerald-600">Descuento Anual (%)</label><input type="number" value={form.annualDiscountPercent} onChange={e => setForm(p => ({ ...p, annualDiscountPercent: Number(e.target.value) }))} className="w-full rounded-xl border border-emerald-100 bg-emerald-50/20 px-4 py-2 text-sm outline-none" /></div>
              </div>
            </div>
          </div>

          {/* Visibility & More */}
          <div className="rounded-2xl border bg-card p-6 space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Configuración Extra</div>
              <div className="space-y-1.5"><label className="text-xs font-semibold">Sesiones totales al mes (resumen)</label><input type="number" value={form.sessionsPerMonth} onChange={e => setForm(p => ({ ...p, sessionsPerMonth: Number(e.target.value) }))} className="w-full rounded-xl border bg-background px-4 py-2 text-sm outline-none" /></div>
              
              <div className="flex flex-col gap-3 pt-2">
                <label className="flex items-center justify-between gap-2 p-3 rounded-xl border bg-background cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="text-sm font-semibold text-foreground">Plan Activo</div>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="h-5 w-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500" />
                </label>
                <label className="flex items-center justify-between gap-2 p-3 rounded-xl border bg-background cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <div className="text-sm font-semibold text-foreground">Destacado</div>
                  </div>
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))} className="h-5 w-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
