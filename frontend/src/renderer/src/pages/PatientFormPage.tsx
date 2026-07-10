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

type Patient = {
  id: number
  firstName: string
  lastName: string
  documentNumber: string
  birthDate?: string | null
  email: string
  phone: string
  city: string
  notes: string
  username?: string | null
  hasPassword?: boolean
  portalWelcomeTitle?: string
  portalWelcomeMessage?: string
  portalAccentColor?: string
  intakeCompleted?: boolean
  intakeSummary?: string
  intakeSubmittedAt?: string | null
  isActive: boolean
  userType?: string
}

export function PatientFormPage({ mode }: Props): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = mode === 'edit'
  const patientId = isEdit ? Number(id) : null

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [intake, setIntake] = useState<{ completed: boolean; summary: string; submittedAt: string | null } | null>(null)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    documentNumber: '',
    birthDate: '',
    email: '',
    phone: '',
    city: '',
    notes: '',
    username: '',
    password: '',
    portalWelcomeTitle: '',
    portalWelcomeMessage: '',
    portalAccentColor: '',
    isActive: true,
    userType: 'miembro'
  })

  useEffect(() => {
    if (!isEdit || !patientId) return
    void (async () => {
      setLoading(true)
      setError(null)
      const res = await api.get<Patient>(`/api/patients/${patientId}/`)
      if (!res.ok) {
        setError(res.error)
        setLoading(false)
        return
      }
      const p = res.data
      setIntake({
        completed: p.intakeCompleted === true,
        summary: p.intakeSummary || '',
        submittedAt: p.intakeSubmittedAt || null
      })
      setForm({
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        documentNumber: p.documentNumber || '',
        birthDate: p.birthDate || '',
        email: p.email || '',
        phone: p.phone || '',
        city: p.city || '',
        notes: p.notes || '',
        username: (p.username || '') as string,
        password: '',
        portalWelcomeTitle: p.portalWelcomeTitle || '',
        portalWelcomeMessage: p.portalWelcomeMessage || '',
        portalAccentColor: p.portalAccentColor || '',
        isActive: p.isActive !== false,
        userType: p.userType || 'miembro'
      })
      setLoading(false)
    })()
  }, [isEdit, patientId])

  const canSubmit = useMemo(() => form.firstName.trim().length > 0 && !saving, [form.firstName, saving])

  const submit = async () => {
    const firstName = form.firstName.trim()
    if (!firstName) return

    setSaving(true)
    setError(null)
    const payload: Record<string, unknown> = {
      firstName,
      lastName: form.lastName.trim(),
      documentNumber: form.documentNumber.trim(),
      birthDate: form.birthDate ? form.birthDate : null,
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      notes: form.notes.trim(),
      username: form.username.trim() || null,
      portalWelcomeTitle: form.portalWelcomeTitle.trim(),
      portalWelcomeMessage: form.portalWelcomeMessage.trim(),
      portalAccentColor: form.portalAccentColor.trim(),
      isActive: form.isActive,
      userType: form.userType
    }
    if (form.password.trim()) payload.password = form.password.trim()

    const res =
      isEdit && patientId ? await api.patch<Patient>(`/api/patients/${patientId}/`, payload) : await api.post<Patient>('/api/patients/', payload)

    if (!res.ok) {
      setError(res.error)
      setSaving(false)
      return
    }

    setSaving(false)
    navigate('/pacientes', { replace: true })
  }

  const deletePatient = async () => {
    if (!isEdit || !patientId) return
    const ok = window.confirm(t('patients_admin.confirm_delete'))
    if (!ok) return
    setError(null)
    const res = await api.del<unknown>(`/api/patients/${patientId}/`)
    if (!res.ok) {
      setError(res.error)
      return
    }
    navigate('/pacientes', { replace: true })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">
            {isEdit ? t('patients_admin.page_edit') : t('patients_admin.page_create')}
          </h2>
          <p className="text-muted-foreground">{t('patients_admin.subtitle')}</p>
        </div>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      {loading ? (
        <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm space-y-4">
          <div className="h-6 w-1/3 bg-muted rounded-md" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-12 bg-muted rounded-xl" />
            <div className="h-12 bg-muted rounded-xl" />
            <div className="h-12 bg-muted rounded-xl" />
            <div className="h-12 bg-muted rounded-xl" />
            <div className="h-24 bg-muted rounded-xl md:col-span-2" />
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm space-y-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('patients_admin.first_name')}</label>
              <input
                value={form.firstName}
                onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('patients_admin.first_name_placeholder')}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('patients_admin.last_name')}</label>
              <input
                value={form.lastName}
                onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('patients_admin.last_name_placeholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('patients_admin.document_number')}</label>
              <input
                value={form.documentNumber}
                onChange={(e) => setForm((p) => ({ ...p, documentNumber: e.target.value }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('patients_admin.document_number_placeholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('patients_admin.birth_date')}</label>
              <input
                value={form.birthDate}
                onChange={(e) => setForm((p) => ({ ...p, birthDate: e.target.value }))}
                type="date"
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('patients_admin.email')}</label>
              <input
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                type="email"
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('patients_admin.email_placeholder')}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('patients_admin.phone')}</label>
              <input
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('patients_admin.phone_placeholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('patients_admin.city')}</label>
              <input
                value={form.city}
                onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('patients_admin.city_placeholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('patients_admin.user_type')}</label>
              <select
                value={['miembro', 'paciente', 'terapeuta'].includes(form.userType) ? form.userType : 'otro'}
                onChange={(e) => {
                  const val = e.target.value
                  if (val !== 'otro') {
                    setForm((p) => ({ ...p, userType: val }))
                  } else {
                    setForm((p) => ({ ...p, userType: '' }))
                  }
                }}
                className="w-full rounded-xl border bg-background px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="miembro">{t('patients_admin.user_type_member')}</option>
                <option value="paciente">{t('patients_admin.user_type_patient')}</option>
                <option value="terapeuta">{t('patients_admin.user_type_therapist')}</option>
                <option value="otro">{t('patients_admin.user_type_other')}</option>
              </select>
              {!['miembro', 'paciente', 'terapeuta'].includes(form.userType) && (
                <div className="mt-2">
                  <input
                    value={form.userType}
                    onChange={(e) => setForm((p) => ({ ...p, userType: e.target.value }))}
                    className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder={t('patients_admin.user_type_other_placeholder')}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('patients_admin.username')}</label>
              <input
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('patients_admin.username_placeholder')}
              />
              <div className="text-xs text-muted-foreground">{t('patients_admin.username_help')}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('patients_admin.password')}</label>
              <input
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                type="password"
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('patients_admin.password_placeholder')}
              />
              <div className="text-xs text-muted-foreground">{t('patients_admin.password_help')}</div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">{t('patients_admin.portal_welcome_title')}</label>
              <input
                value={form.portalWelcomeTitle}
                onChange={(e) => setForm((p) => ({ ...p, portalWelcomeTitle: e.target.value }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('patients_admin.portal_welcome_title_placeholder')}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">{t('patients_admin.portal_welcome_message')}</label>
              <textarea
                value={form.portalWelcomeMessage}
                onChange={(e) => setForm((p) => ({ ...p, portalWelcomeMessage: e.target.value }))}
                className="w-full min-h-[110px] rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('patients_admin.portal_welcome_message_placeholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('patients_admin.portal_accent_color')}</label>
              <input
                value={form.portalAccentColor}
                onChange={(e) => setForm((p) => ({ ...p, portalAccentColor: e.target.value }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="#22c55e"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">{t('patients_admin.notes')}</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                className="w-full min-h-[110px] rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('patients_admin.notes_placeholder')}
              />
            </div>
          </div>

          {isEdit && intake && (
            <div className="rounded-2xl border bg-card/60 p-5 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">{t('patients_admin.intake_title')}</div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                    intake.completed
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {intake.completed ? t('patients_admin.intake_done') : t('patients_admin.intake_pending')}
                </span>
              </div>
              {intake.summary ? (
                <div className="text-sm text-muted-foreground leading-relaxed">{intake.summary}</div>
              ) : (
                <div className="text-sm text-muted-foreground">{t('patients_admin.intake_empty')}</div>
              )}
              {intake.submittedAt ? (
                <div className="text-xs text-muted-foreground">
                  {t('patients_admin.intake_submitted_at')}: {new Date(intake.submittedAt).toLocaleString()}
                </div>
              ) : null}
            </div>
          )}

          <div className="rounded-2xl border bg-card/60 p-4 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-sm font-semibold">{t('patients_admin.active')}</div>
              <div className="text-xs text-muted-foreground">{t('patients_admin.active_help')}</div>
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
              {saving ? t('patients_admin.saving') : t('patients_admin.save')}
            </Button>
            <Button variant="outline" onClick={() => navigate('/pacientes')}>
              {t('patients_admin.cancel')}
            </Button>
            {isEdit && (
              <Button
                variant="outline"
                onClick={() => void deletePatient()}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('patients_admin.delete')}
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
