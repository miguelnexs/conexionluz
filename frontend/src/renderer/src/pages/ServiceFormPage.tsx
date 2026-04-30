import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { api } from '@/api/client'
import { Save, Trash2 } from 'lucide-react'

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
    isActive: true
  })

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
        isActive: s.isActive !== false
      })
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

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">
            {isEdit ? t('services_admin.page_edit') : t('services_admin.page_create')}
          </h2>
          <p className="text-muted-foreground">{t('services_admin.subtitle')}</p>
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

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">{t('services_admin.description_label')}</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                      className="w-full min-h-[140px] rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder={t('services_admin.description_placeholder')}
                    />
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
                <div className="mt-4 space-y-3">
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
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">{t('services_admin.active')}</span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        form.isActive
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {form.isActive ? t('services_admin.active_on') : t('services_admin.active_off')}
                    </span>
                  </div>
                </div>
              </div>
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

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void submit()} disabled={!canSubmit}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? t('services_admin.saving') : t('services_admin.save')}
            </Button>
            <Button variant="outline" onClick={() => navigate('/servicios')}>
              {t('services_admin.cancel')}
            </Button>
            {isEdit && (
              <Button
                variant="outline"
                onClick={() => void deleteService()}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('services_admin.delete')}
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
