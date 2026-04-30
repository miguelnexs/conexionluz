import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { api } from '@/api/client'
import { FileText, Image as ImageIcon, Upload, Trash2 } from 'lucide-react'

type Mode = 'create' | 'edit'

type Props = {
  mode: Mode
}

type Therapist = {
  id: number
  name: string
  title: string
  description?: string
  specialties: string[]
  modality: string
  location: string
  priceFromCOP?: number
  sessionDurationMinutes?: number
  photoUrl?: string | null
  cvUrl?: string | null
  isActive?: boolean
}

export function TherapistFormPage({ mode }: Props): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = mode === 'edit'
  const therapistId = isEdit ? Number(id) : null

  const [loading, setLoading] = useState(isEdit)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    title: '',
    modality: '',
    location: '',
    specialties: '',
    description: '',
    priceFromCOP: 0,
    sessionDurationMinutes: 0,
    isActive: true
  })

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const photoInputRef = useRef<HTMLInputElement | null>(null)
  const cvInputRef = useRef<HTMLInputElement | null>(null)
  const [dragging, setDragging] = useState(false)
  const [draggingCv, setDraggingCv] = useState(false)

  useEffect(() => {
    if (photoFile) {
      const url = URL.createObjectURL(photoFile)
      setPhotoPreview(url)
      return () => URL.revokeObjectURL(url)
    }
    setPhotoPreview(null)
  }, [photoFile])

  useEffect(() => {
    if (!isEdit || !therapistId) return
    void (async () => {
      setLoading(true)
      const res = await api.get<{ id: number } & Therapist>(`/api/therapists/${therapistId}/`)
      if (!res.ok) {
        setError(res.error)
        setLoading(false)
        return
      }
      const data = res.data
      setForm({
        name: data.name || '',
        title: data.title || '',
        modality: data.modality || '',
        location: data.location || '',
        specialties: (data.specialties || []).join(', '),
        description: data.description || '',
        priceFromCOP: Number.isFinite(data.priceFromCOP as number) ? (data.priceFromCOP as number) : 0,
        sessionDurationMinutes: Number.isFinite(data.sessionDurationMinutes as number)
          ? (data.sessionDurationMinutes as number)
          : 0,
        isActive: data.isActive !== false
      })
      setLoading(false)
    })()
  }, [isEdit, therapistId])

  const canSubmit = useMemo(() => form.name.trim().length > 0, [form.name])

  const handlePhotoChange = (file: File | null) => {
    if (!file) {
      setPhotoFile(null)
      return
    }
    const name = (file.name || '').toLowerCase()
    const isImage = name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.webp')
    if (!isImage) return
    setPhotoFile(file)
  }

  const onPhotoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePhotoChange(e.target.files?.[0] || null)
  }
  const onSelectPhotoClick = () => photoInputRef.current?.click()

  const onDropPhoto = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handlePhotoChange(file)
  }
  const onDragOverPhoto = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
  }
  const onDragLeavePhoto = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
  }

  const handleCvChange = (file: File | null) => {
    if (!file) {
      setCvFile(null)
      return
    }
    const name = (file.name || '').toLowerCase()
    if (!name.endsWith('.pdf')) return
    setCvFile(file)
  }

  const onCvInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleCvChange(e.target.files?.[0] || null)
  }

  const onSelectCvClick = () => cvInputRef.current?.click()

  const onDropCv = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggingCv(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleCvChange(file)
  }

  const onDragOverCv = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDraggingCv(true)
  }

  const onDragLeaveCv = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDraggingCv(false)
  }

  const submit = async () => {
    if (!canSubmit) return
    setError(null)
    const fd = new FormData()
    fd.append('name', form.name.trim())
    fd.append('title', form.title.trim())
    fd.append('modality', form.modality.trim())
    fd.append('location', form.location.trim())
    fd.append('specialties', form.specialties.trim())
    fd.append('description', form.description.trim())
    fd.append('priceFromCOP', String(Math.max(0, Math.round(form.priceFromCOP || 0))))
    fd.append('sessionDurationMinutes', String(Math.max(0, Math.round(form.sessionDurationMinutes || 0))))
    fd.append('isActive', form.isActive ? 'true' : 'false')
    if (photoFile) fd.append('photoFile', photoFile)
    if (cvFile) fd.append('cvFile', cvFile)

    const res = isEdit && therapistId
      ? await api.patchForm<Therapist>(`/api/therapists/${therapistId}/`, fd)
      : await api.postForm<Therapist>('/api/therapists/', fd)

    if (!res.ok) {
      setError(res.error)
      return
    }
    navigate('/terapeutas', { replace: true })
  }

  const deleteTherapist = async () => {
    if (!isEdit || !therapistId) return
    const ok = window.confirm(t('therapists_admin.confirm_delete'))
    if (!ok) return
    setError(null)
    const res = await api.del<unknown>(`/api/therapists/${therapistId}/`)
    if (!res.ok) {
      setError(res.error)
      return
    }
    navigate('/terapeutas', { replace: true })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">
            {isEdit ? t('therapists_admin.page_edit') : t('therapists_admin.page_create')}
          </h2>
          <p className="text-muted-foreground">
            {t('therapists.subtitle')}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-4 text-sm text-red-500">
          {error}
        </div>
      )}

      {loading && (
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
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm space-y-4"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold">{t('therapists_admin.name')}</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder={t('therapists_admin.name_placeholder')}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">{t('therapists_admin.title')}</label>
            <input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder={t('therapists_admin.title_placeholder')}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">{t('therapists_admin.modality')}</label>
            <input
              value={form.modality}
              onChange={(e) => setForm((p) => ({ ...p, modality: e.target.value }))}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder={t('therapists_admin.modality_placeholder')}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">{t('therapists_admin.location')}</label>
            <input
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder={t('therapists_admin.location_placeholder')}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">{t('therapists_admin.price_from')}</label>
            <input
              value={form.priceFromCOP}
              onChange={(e) => setForm((p) => ({ ...p, priceFromCOP: Number(e.target.value) }))}
              type="number"
              min={0}
              step={1000}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="99000"
            />
            <div className="text-xs text-muted-foreground">{t('therapists_admin.price_from_help')}</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">{t('therapists_admin.duration')}</label>
            <input
              value={form.sessionDurationMinutes}
              onChange={(e) => setForm((p) => ({ ...p, sessionDurationMinutes: Number(e.target.value) }))}
              type="number"
              min={0}
              step={5}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="60"
            />
            <div className="text-xs text-muted-foreground">{t('therapists_admin.duration_help')}</div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold">{t('therapists_admin.specialties')}</label>
            <input
              value={form.specialties}
              onChange={(e) => setForm((p) => ({ ...p, specialties: e.target.value }))}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder={t('therapists_admin.specialties_placeholder')}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold">{t('therapists_admin.description')}</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full min-h-[120px] rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder={t('therapists_admin.description_placeholder')}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 md:col-span-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('therapists_admin.photo')}</label>
              <div
                onDrop={onDropPhoto}
                onDragOver={onDragOverPhoto}
                onDragLeave={onDragLeavePhoto}
                className={`relative rounded-2xl border-2 border-dashed p-4 transition-all ${
                  dragging ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
              >
                <input ref={photoInputRef} type="file" accept="image/*" onChange={onPhotoInputChange} className="hidden" />
                {photoPreview ? (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={photoPreview} alt="Preview" className="h-16 w-16 rounded-xl object-cover ring-1 ring-border" />
                      <div className="space-y-1">
                        <div className="text-sm font-semibold">{photoFile?.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={onSelectPhotoClick}>
                        <Upload className="mr-2 h-4 w-4" />
                        {t('therapists_admin.photo')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => setPhotoFile(null)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('therapists_admin.cancel')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 ring-1 ring-border flex items-center justify-center">
                        <ImageIcon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-semibold">{t('therapists_admin.photo_drop')}</div>
                        <div className="text-xs text-muted-foreground">{t('therapists_admin.photo_help')}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={onSelectPhotoClick}>
                      <Upload className="mr-2 h-4 w-4" />
                      {t('therapists_admin.select')}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('therapists_admin.cv')}</label>
              <div
                onDrop={onDropCv}
                onDragOver={onDragOverCv}
                onDragLeave={onDragLeaveCv}
                className={`relative rounded-2xl border-2 border-dashed p-4 transition-all ${
                  draggingCv ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
              >
                <input ref={cvInputRef} type="file" accept="application/pdf" onChange={onCvInputChange} className="hidden" />
                {cvFile ? (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 ring-1 ring-border flex items-center justify-center">
                        <FileText className="h-7 w-7 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-semibold">{cvFile.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {cvFile.size > 0 ? `${Math.round((cvFile.size / 1024) * 10) / 10} KB` : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={onSelectCvClick}>
                        <Upload className="mr-2 h-4 w-4" />
                        {t('therapists_admin.cv')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => setCvFile(null)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('therapists_admin.cancel')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 ring-1 ring-border flex items-center justify-center">
                        <FileText className="h-7 w-7 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-semibold">{t('therapists_admin.cv_drop')}</div>
                        <div className="text-xs text-muted-foreground">{t('therapists_admin.cv_help')}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={onSelectCvClick}>
                      <Upload className="mr-2 h-4 w-4" />
                      {t('therapists_admin.select')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card/60 p-4 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-sm font-semibold">{t('therapists_admin.active')}</div>
            <div className="text-xs text-muted-foreground">{t('therapists_admin.active_help')}</div>
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
          <Button onClick={submit} disabled={!canSubmit}>
            {isEdit ? t('therapists_admin.save') : t('therapists_admin.save')}
          </Button>
          <Button variant="outline" onClick={() => navigate('/terapeutas')}>
            {t('therapists_admin.cancel')}
          </Button>
          {isEdit && (
            <Button
              variant="outline"
              onClick={() => void deleteTherapist()}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('therapists_admin.delete')}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
