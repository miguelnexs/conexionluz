
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { api } from '@/api/client'
import { Save, Trash2, Eye, X, Sparkles, Clock, MapPin, CheckCircle2, ArrowRight } from 'lucide-react'

type Mode = 'create' | 'edit'

type Props = {
  mode: Mode
}

type Service = {
  id: number
  title: string
  description: string
  priceCOP: number
  durationMinutes?: number
  modality?: string
  audience?: string
  includes?: string
  benefits?: string
  bookingUrl?: string
  descriptionHtml?: string
  isActive: boolean
}

export function ServiceFormPage({ mode }: Props): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = mode === 'edit'
  const serviceId = isEdit ? Number(id) : null

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFullPreview, setShowFullPreview] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    priceCOP: 0,
    durationMinutes: 0,
    modality: '',
    audience: '',
    includes: '',
    benefits: '',
    bookingUrl: '',
    descriptionHtml: '',
    isActive: true
  })
  const [activeTab, setActiveTab] = useState<'text' | 'html'>('text')

  useEffect(() => {
    if (!isEdit || !serviceId) return
    void (async () => {
      setLoading(true)
      setError(null)
      const res = await api.get<Service>(`/api/services/${serviceId}/`)
      if (!res.ok) {
        setError(res.error)
        setLoading(false)
        return
      }
      const s = res.data
      setForm({
        title: s.title || '',
        description: s.description || '',
        priceCOP: Number.isFinite(s.priceCOP as number) ? (s.priceCOP as number) : 0,
        durationMinutes: Number.isFinite(s.durationMinutes as number) ? (s.durationMinutes as number) : 0,
        modality: s.modality || '',
        audience: s.audience || '',
        includes: s.includes || '',
        benefits: s.benefits || '',
        bookingUrl: s.bookingUrl || '',
        descriptionHtml: s.descriptionHtml || '',
        isActive: s.isActive !== false
      })
      if (s.descriptionHtml) setActiveTab('html')
      setLoading(false)
    })()
  }, [isEdit, serviceId])

  const canSubmit = useMemo(() => form.title.trim().length > 0 && !saving, [form.title, saving])

  const modalityLabel = (value: string): string => {
    if (value === 'online') return t('services_admin.modality_online')
    if (value === 'presential') return t('services_admin.modality_presential')
    if (value === 'hybrid') return t('services_admin.modality_hybrid')
    return value
  }

  const submit = async () => {
    const title = form.title.trim()
    if (!title) return

    setSaving(true)
    setError(null)
    const payload = {
      title,
      description: form.description.trim(),
      priceCOP: Math.max(0, Math.round(form.priceCOP || 0)),
      durationMinutes: Math.max(0, Math.round(form.durationMinutes || 0)),
      modality: form.modality.trim(),
      audience: form.audience.trim(),
      includes: form.includes.trim(),
      benefits: form.benefits.trim(),
      bookingUrl: form.bookingUrl.trim(),
      descriptionHtml: form.descriptionHtml.trim(),
      isActive: form.isActive
    }

    const res =
      isEdit && serviceId ? await api.patch<Service>(`/api/services/${serviceId}/`, payload) : await api.post<Service>('/api/services/', payload)

    if (!res.ok) {
      setError(res.error)
      setSaving(false)
      return
    }

    setSaving(false)
    navigate('/servicios', { replace: true })
  }

  const deleteService = async () => {
    if (!isEdit || !serviceId) return
    const ok = window.confirm(t('services_admin.confirm_delete'))
    if (!ok) return
    setError(null)
    const res = await api.del<unknown>(`/api/services/${serviceId}/`)
    if (!res.ok) {
      setError(res.error)
      return
    }
    navigate('/servicios', { replace: true })
  }

  const splitLines = (value?: string) =>
    (value || '')
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">
            {isEdit ? t('services_admin.page_edit') : t('services_admin.page_create')}
          </h2>
          <p className="text-muted-foreground">{t('services_admin.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowFullPreview(true)}>
             <Eye className="mr-2 h-4 w-4" />
             {t('services_admin.preview', 'Vista Previa')}
          </Button>
          <Button onClick={() => void submit()} disabled={!canSubmit}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? t('services_admin.saving') : t('services_admin.save')}
          </Button>
        </div>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      {loading ? (
        <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm space-y-4">
          <div className="h-6 w-1/3 bg-muted rounded-md" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-12 bg-muted rounded-xl md:col-span-2" />
            <div className="h-24 bg-muted rounded-xl md:col-span-2" />
            <div className="h-12 bg-muted rounded-xl" />
            <div className="h-12 bg-muted rounded-xl" />
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm space-y-6"
        >
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl border bg-card/60 p-5">
                <div className="text-sm font-semibold">{t('services_admin.section_basic')}</div>
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">{t('services_admin.title_label')}</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                      className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder={t('services_admin.title_placeholder')}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold">{t('services_admin.description_label')}</label>
                      <div className="flex bg-muted rounded-lg p-1 scale-90 origin-right">
                        <button
                          type="button"
                          onClick={() => setActiveTab('text')}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                            activeTab === 'text' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'
                          }`}
                        >
                          Texto Simple
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('html')}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                            activeTab === 'html' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'
                          }`}
                        >
                          HTML
                        </button>
                      </div>
                    </div>

                    {activeTab === 'text' ? (
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                        className="w-full min-h-[140px] rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                        placeholder={t('services_admin.description_placeholder')}
                      />
                    ) : (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <textarea
                          value={form.descriptionHtml}
                          onChange={(e) => setForm((p) => ({ ...p, descriptionHtml: e.target.value }))}
                          className="w-full min-h-[200px] rounded-xl border bg-background px-4 py-3 text-sm font-mono outline-none focus:ring-2 focus:ring-ring transition-all"
                          placeholder="<p>Escribe tu contenido HTML aquí...</p>"
                        />
                        <div className="p-5 rounded-xl border bg-background/30 backdrop-blur-sm min-h-[100px]">
                          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 opacity-50">Vista Previa Rápida</div>
                          <div 
                            className="prose prose-sm dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: form.descriptionHtml }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-card/60 p-5">
                <div className="text-sm font-semibold">{t('services_admin.section_details')}</div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">{t('services_admin.price_label')}</label>
                    <input
                      value={form.priceCOP}
                      onChange={(e) => setForm((p) => ({ ...p, priceCOP: Number(e.target.value) }))}
                      type="number"
                      min={0}
                      step={1000}
                      className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder="99000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">{t('services_admin.duration_label')}</label>
                    <input
                      value={form.durationMinutes}
                      onChange={(e) => setForm((p) => ({ ...p, durationMinutes: Number(e.target.value) }))}
                      type="number"
                      min={0}
                      step={5}
                      className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder="60"
                    />
                    <div className="text-xs text-muted-foreground">{t('services_admin.duration_help')}</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">{t('services_admin.modality_label')}</label>
                    <select
                      value={form.modality}
                      onChange={(e) => setForm((p) => ({ ...p, modality: e.target.value }))}
                      className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">{t('services_admin.select_option')}</option>
                      <option value="online">{t('services_admin.modality_online')}</option>
                      <option value="presential">{t('services_admin.modality_presential')}</option>
                      <option value="hybrid">{t('services_admin.modality_hybrid')}</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">{t('services_admin.booking_url_label')}</label>
                    <input
                      value={form.bookingUrl}
                      onChange={(e) => setForm((p) => ({ ...p, bookingUrl: e.target.value }))}
                      className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder={t('services_admin.booking_url_placeholder')}
                    />
                    <div className="text-xs text-muted-foreground">{t('services_admin.booking_url_help')}</div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold">{t('services_admin.audience_label')}</label>
                    <textarea
                      value={form.audience}
                      onChange={(e) => setForm((p) => ({ ...p, audience: e.target.value }))}
                      className="w-full min-h-[90px] rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder={t('services_admin.audience_placeholder')}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-card/60 p-5">
                <div className="text-sm font-semibold">{t('services_admin.section_marketing')}</div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">{t('services_admin.includes_label')}</label>
                    <textarea
                      value={form.includes}
                      onChange={(e) => setForm((p) => ({ ...p, includes: e.target.value }))}
                      className="w-full min-h-[120px] rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder={t('services_admin.includes_placeholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">{t('services_admin.benefits_label')}</label>
                    <textarea
                      value={form.benefits}
                      onChange={(e) => setForm((p) => ({ ...p, benefits: e.target.value }))}
                      className="w-full min-h-[120px] rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder={t('services_admin.benefits_placeholder')}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border bg-card/60 p-5">
                <div className="text-sm font-semibold">{t('services_admin.preview')}</div>
                <div className="mt-4 space-y-3 text-left">
                  <div className="text-lg font-semibold">{form.title || t('services_admin.preview_title')}</div>
                  {form.description ? (
                    <div className="text-sm text-muted-foreground leading-relaxed">{form.description}</div>
                  ) : null}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">{t('services_admin.price_label')}</span>
                    <span className="font-semibold">
                      {form.priceCOP > 0
                        ? form.priceCOP.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
                        : '—'}
                    </span>
                  </div>
                  {form.durationMinutes > 0 ? (
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">{t('services_admin.duration_label')}</span>
                      <span className="text-sm font-semibold">{form.durationMinutes} min</span>
                    </div>
                  ) : null}
                  {form.modality ? (
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">{t('services_admin.modality_label')}</span>
                      <span className="text-sm font-semibold">{modalityLabel(form.modality)}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border bg-card/60 p-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold">{t('services_admin.active')}</div>
                  <div className="text-xs text-muted-foreground">{t('services_admin.active_help')}</div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.isActive}
                  onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                  className={`relative inline-flex h-9 w-16 items-center rounded-full border transition-colors ${
                    form.isActive ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-muted border-border'
                  }`}
                >
                  <span
                    className={`inline-flex h-7 w-7 transform items-center justify-center rounded-full bg-background shadow-sm transition-transform ${
                      form.isActive ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {isEdit && (
                <Button
                  variant="outline"
                  onClick={() => void deleteService()}
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('services_admin.delete')}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Full Preview Modal */}
      <AnimatePresence>
        {showFullPreview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFullPreview(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-card rounded-[2.5rem] border shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                     <Eye className="h-5 w-5" />
                   </div>
                   <h3 className="font-black">Vista Web del Servicio</h3>
                </div>
                <button onClick={() => setShowFullPreview(false)} className="p-2 rounded-full hover:bg-muted">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-zinc-950">
                 {/* This mimics the card on the public website */}
                 <div className="relative h-full bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 p-8 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/5">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Inversión</span>
                        <span className="text-lg font-black text-gray-900 dark:text-white">
                          {form.priceCOP > 0 ? `$${form.priceCOP.toLocaleString()}` : 'Consulta'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 flex-1 text-left">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                        {form.title || 'Título del Servicio'}
                      </h3>
                      
                      {activeTab === 'html' ? (
                        <div 
                          className="prose prose-sm dark:prose-invert max-w-none text-gray-500"
                          dangerouslySetInnerHTML={{ __html: form.descriptionHtml }}
                        />
                      ) : (
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {form.description || 'Descripción del servicio...'}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-50 dark:border-zinc-800 my-6">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-amber-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase text-gray-400 tracking-tighter text-left">Duración</span>
                          <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">
                            {form.durationMinutes ? `${form.durationMinutes} min` : '60 min'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-left">
                        <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">Modalidad</span>
                          <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">
                            {modalityLabel(form.modality) || 'Online / Presencial'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8 space-y-3 text-left">
                       {splitLines(form.benefits).slice(0, 2).map((b, i) => (
                         <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-zinc-400">
                           <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                           <span>{b}</span>
                         </div>
                       ))}
                    </div>

                    <button className="w-full h-14 bg-gray-900 dark:bg-white dark:text-zinc-950 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3">
                      Agendar Ahora
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
              </div>

              <div className="p-6 bg-muted/30 border-t flex justify-center">
                 <button
                   onClick={() => setShowFullPreview(false)}
                   className="px-10 py-3 bg-foreground text-background rounded-2xl font-black text-sm hover:scale-105 transition-transform"
                 >
                   Cerrar Vista Previa
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
