import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { api } from '@/api/client'
import { Loader2, Save, Trash2, Video, X, AlertTriangle } from 'lucide-react'

type Mode = 'create' | 'edit'

type Props = {
  mode: Mode
}

type TalkFormat = 'online' | 'presential'

type Talk = {
  id: number
  title: string
  description?: string
  topic?: string
  speaker?: string
  organizer?: string
  modality?: string
  startAt?: string | null
  endAt?: string | null
  format: TalkFormat
  audience: string
  participants?: number
  agenda?: string[]
  videoUrl?: string | null
  featuredVideoUrl?: string | null
  isActive?: boolean
}

type TalkRegistration = {
  id: number
  patientId: number
  firstName: string
  lastName: string
  email: string
  phone: string
  createdAt: string
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

function toDateInputValue(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function toTimeInputValue(d: Date): string {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

function getApiBaseUrl(): string {
  const value = (import.meta as any).env?.VITE_API_URL as string | undefined
  return (value && value.trim()) || 'http://127.0.0.1:8000'
}

export function TalkFormPage({ mode }: Props): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()

  const isEdit = mode === 'edit'
  const idNormalized = typeof id === 'string' ? id.replace(/^:/, '') : ''
  const talkId = isEdit ? Number(idNormalized) : null

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const [justCreated, setJustCreated] = useState<boolean>(Boolean((location.state as any)?.justCreated))
  const [registrations, setRegistrations] = useState<TalkRegistration[]>([])
  const [loadingRegistrations, setLoadingRegistrations] = useState(isEdit)
  const [registrationsError, setRegistrationsError] = useState<string | null>(null)

  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [upload, setUpload] = useState<{ uploading: boolean; progress: number; error: string | null }>({
    uploading: false,
    progress: 0,
    error: null
  })
  const videoInputRef = useRef<HTMLInputElement | null>(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    topic: '',
    speaker: '',
    organizer: '',
    modality: '',
    date: toDateInputValue(new Date()),
    startTime: '19:00',
    endTime: '20:00',
    format: 'online' as TalkFormat,
    audience: '',
    participants: 0,
    agendaText: '',
    isActive: true
  })

  const canSubmit = useMemo(() => form.title.trim().length > 0 && !saving, [form.title, saving])
  const agendaItems = useMemo(() => form.agendaText.split('\n').map((x) => x.trim()).filter(Boolean), [form.agendaText])

  useEffect(() => {
    if (!isEdit) return
    if (!talkId || !Number.isFinite(talkId)) {
      setError(t('talks.invalid_id'))
      setLoading(false)
      return
    }
    void (async () => {
      setLoading(true)
      setError(null)
      setRegistrationsError(null)
      const res = await api.get<Talk>(`/api/talks/${talkId}/`)
      if (!res.ok) {
        setError(res.error)
        setLoading(false)
        return
      }
      const talk = res.data
      setVideoUrl(talk.videoUrl || null)
      const start = talk.startAt ? new Date(talk.startAt) : new Date()
      const end = talk.endAt ? new Date(talk.endAt) : new Date(start.getTime() + 60 * 60000)
      setForm({
        title: talk.title || '',
        description: talk.description || '',
        topic: talk.topic || '',
        speaker: talk.speaker || '',
        organizer: talk.organizer || '',
        modality: talk.modality || '',
        date: toDateInputValue(start),
        startTime: toTimeInputValue(start),
        endTime: toTimeInputValue(end),
        format: (talk.format || 'online') as TalkFormat,
        audience: talk.audience || '',
        participants: typeof talk.participants === 'number' && Number.isFinite(talk.participants) ? talk.participants : 0,
        agendaText: Array.isArray(talk.agenda) ? talk.agenda.join('\n') : '',
        isActive: talk.isActive !== false
      })
      setLoadingRegistrations(true)
      const regRes = await api.get<TalkRegistration[]>(`/api/talks/${talkId}/registrations/`)
      if (regRes.ok) {
        setRegistrations(regRes.data)
        setForm((p) => ({ ...p, participants: regRes.data.length }))
      } else {
        setRegistrationsError(regRes.error)
      }
      setLoadingRegistrations(false)
      setLoading(false)
    })()
  }, [isEdit, talkId, t])

  const refreshRegistrations = async () => {
    if (!talkId || !Number.isFinite(talkId)) return
    setRegistrationsError(null)
    setLoadingRegistrations(true)
    const regRes = await api.get<TalkRegistration[]>(`/api/talks/${talkId}/registrations/`)
    if (regRes.ok) {
      setRegistrations(regRes.data)
      setForm((p) => ({ ...p, participants: regRes.data.length }))
    } else {
      setRegistrationsError(regRes.error)
    }
    setLoadingRegistrations(false)
  }

  useEffect(() => {
    if (!justCreated) return
    const handle = window.setTimeout(() => setJustCreated(false), 4000)
    return () => window.clearTimeout(handle)
  }, [justCreated])

  const buildStartEnd = (): { startAt: string; endAt: string } => {
    const [y, m, d] = form.date.split('-').map((x) => Number(x))
    const [sh, sm] = form.startTime.split(':').map((x) => Number(x))
    const [eh, em] = form.endTime.split(':').map((x) => Number(x))
    const start = new Date(y, (m || 1) - 1, d || 1, sh || 0, sm || 0, 0, 0)
    const end = new Date(y, (m || 1) - 1, d || 1, eh || 0, em || 0, 0, 0)
    return { startAt: start.toISOString(), endAt: end.toISOString() }
  }

  const uploadVideo = async (file: File, opts: { create: boolean }) => {
    await uploadVideoWithField(file, opts, {
      fieldName: 'videoFile',
      getUrl: (data) => (data?.videoUrl as string | undefined) || null,
      setUrl: setVideoUrl,
      setState: setUpload
    })
  }

  const uploadVideoWithField = async (
    file: File,
    opts: { create: boolean },
    config: {
      fieldName: 'videoFile' | 'featuredVideoFile'
      getUrl: (data: any) => string | null
      setUrl: (url: string | null) => void
      setState: (value: { uploading: boolean; progress: number; error: string | null } | ((p: any) => any)) => void
    }
  ) => {
    if (opts.create && !form.title.trim()) {
      config.setState({ uploading: false, progress: 0, error: t('talks.title_required_for_upload') })
      return
    }
    const name = file.name.toLowerCase()
    if (!name.endsWith('.mp4') && !name.endsWith('.avi') && !name.endsWith('.mov')) {
      config.setState({ uploading: false, progress: 0, error: t('talks.upload_invalid_type') })
      return
    }
    const maxSize = 1024 * 1024 * 500
    if (file.size > maxSize) {
      config.setState({ uploading: false, progress: 0, error: t('talks.upload_too_large') })
      return
    }

    const { startAt, endAt } = buildStartEnd()
    const fd = new FormData()
    fd.append('title', form.title.trim())
    fd.append('description', form.description.trim())
    fd.append('topic', form.topic.trim())
    fd.append('speaker', form.speaker.trim())
    fd.append('organizer', form.organizer.trim())
    fd.append('modality', form.modality.trim())
    fd.append('startAt', startAt)
    fd.append('endAt', endAt)
    fd.append('format', form.format)
    fd.append('audience', form.audience.trim())
    fd.append('agenda', JSON.stringify(agendaItems))
    fd.append('isActive', form.isActive ? 'true' : 'false')
    fd.append(config.fieldName, file)

    config.setState({ uploading: true, progress: 0, error: null })
    try {
      const url = opts.create ? `${getApiBaseUrl()}/api/talks/` : `${getApiBaseUrl()}/api/talks/${talkId}/`
      const method = opts.create ? 'post' : 'patch'
      const res = await (axios as any)[method](url, fd, {
        onUploadProgress: (evt: any) => {
          const total = evt.total || file.size
          const pct = total > 0 ? Math.round((evt.loaded / total) * 100) : 0
          config.setState((p: any) => (p?.uploading ? { ...p, progress: pct } : p))
        }
      })
      const json = res.data
      const data = json?.data
      const createdId = data?.id as number | undefined
      const nextUrl = config.getUrl(data)
      if (nextUrl) config.setUrl(nextUrl)
      config.setState({ uploading: false, progress: 0, error: null })
      if (opts.create && typeof createdId === 'number') {
        navigate(`/conversatorios/${createdId}`, { replace: true, state: { justCreated: true } })
      }
    } catch (e: any) {
      const apiError = e?.response?.data?.error as string | undefined
      config.setState({ uploading: false, progress: 0, error: apiError || e?.message || t('talks.upload_failed') })
    }
  }

  const save = async () => {
    setError(null)
    const title = form.title.trim()
    if (!title) return
    const { startAt, endAt } = buildStartEnd()
    const start = new Date(startAt)
    const end = new Date(endAt)
    if (!(end.getTime() > start.getTime())) {
      setError(t('talks.end_after_start'))
      return
    }

    setSaving(true)
    if (!talkId) {
      const res = await api.post<Talk>('/api/talks/', {
        title,
        description: form.description.trim(),
        topic: form.topic.trim(),
        speaker: form.speaker.trim(),
        organizer: form.organizer.trim(),
        modality: form.modality.trim(),
        startAt,
        endAt,
        format: form.format,
        audience: form.audience.trim(),
        agenda: agendaItems,
        isActive: form.isActive
      })
      setSaving(false)
      if (!res.ok) {
        setError(res.error)
        return
      }
      navigate(`/conversatorios/${res.data.id}`, { replace: true, state: { justCreated: true } })
      return
    }

    const res = await api.patch<Talk>(`/api/talks/${talkId}/`, {
      title,
      description: form.description.trim(),
      topic: form.topic.trim(),
      speaker: form.speaker.trim(),
      organizer: form.organizer.trim(),
      modality: form.modality.trim(),
      startAt,
      endAt,
      format: form.format,
      audience: form.audience.trim(),
      agenda: agendaItems,
      isActive: form.isActive
    })
    setSaving(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setVideoUrl(res.data.videoUrl || videoUrl)
    setLastSavedAt(new Date().toISOString())
  }

  const removeVideo = async () => {
    if (!talkId) return
    setSaving(true)
    const res = await api.patch<Talk>(`/api/talks/${talkId}/`, { removeVideo: true })
    setSaving(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setVideoUrl(null)
  }


  const executeDeleteTalk = async () => {
    if (!talkId) return
    setSaving(true)
    const res = await api.del<unknown>(`/api/talks/${talkId}/`)
    setSaving(false)
    if (!res.ok) {
      setError(res.error)
      setConfirmDeleteOpen(false)
      return
    }
    navigate('/conversatorios', { replace: true })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-1/3 rounded-md bg-muted" />
        <div className="h-64 rounded-2xl border bg-card/70" />
      </div>
    )
  }

  if (isEdit && (!talkId || !Number.isFinite(talkId))) {
    return (
      <div className="space-y-6">
        {error ? <div className="rounded-2xl border bg-card/70 p-4 text-sm text-red-500">{error}</div> : null}
        <Button variant="outline" asChild>
          <Link to="/conversatorios">{t('talks.back')}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">{isEdit ? t('talks.page_edit') : t('talks.page_create')}</h2>
          <p className="text-muted-foreground">{t('talks.page_help')}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link to="/conversatorios">{t('talks.back')}</Link>
          </Button>
          {isEdit ? (
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteOpen(true)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              disabled={saving}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {saving && confirmDeleteOpen ? t('common.deleting', 'Eliminando...') : t('talks.delete')}
            </Button>
          ) : null}
          <Button onClick={() => void save()} disabled={!canSubmit}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {t('talks.save')}
          </Button>
        </div>
      </div>

      {error ? <div className="rounded-2xl border bg-card/70 p-4 text-sm text-red-500">{error}</div> : null}
      {upload.error ? <div className="rounded-2xl border bg-card/70 p-4 text-sm text-red-500">{upload.error}</div> : null}
      {justCreated ? <div className="rounded-2xl border bg-card/70 p-4 text-sm text-emerald-600">{t('talks.saved')}</div> : null}
      {lastSavedAt ? (
        <div className="rounded-2xl border bg-card/70 p-4 text-sm text-muted-foreground">
          {t('talks.last_saved')}: {new Date(lastSavedAt).toLocaleString()}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm space-y-6 lg:col-span-2"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">{t('talks.field_title')}</label>
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('talks.title_placeholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('talks.field_topic')}</label>
              <input
                value={form.topic}
                onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('talks.topic_placeholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('talks.field_speaker')}</label>
              <input
                value={form.speaker}
                onChange={(e) => setForm((p) => ({ ...p, speaker: e.target.value }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('talks.speaker_placeholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('talks.field_date')}</label>
              <input
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                type="date"
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('talks.field_format')}</label>
              <select
                value={form.format}
                onChange={(e) => setForm((p) => ({ ...p, format: e.target.value as TalkFormat }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="online">{t('talks.format_online')}</option>
                <option value="presential">{t('talks.format_presential')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('talks.field_modality')}</label>
              <input
                value={form.modality}
                onChange={(e) => setForm((p) => ({ ...p, modality: e.target.value }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('talks.modality_placeholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('talks.field_organizer')}</label>
              <input
                value={form.organizer}
                onChange={(e) => setForm((p) => ({ ...p, organizer: e.target.value }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('talks.organizer_placeholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('talks.field_start')}</label>
              <input
                value={form.startTime}
                onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
                type="time"
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('talks.field_end')}</label>
              <input
                value={form.endTime}
                onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))}
                type="time"
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">{t('talks.field_audience')}</label>
              <input
                value={form.audience}
                onChange={(e) => setForm((p) => ({ ...p, audience: e.target.value }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('talks.audience_placeholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('talks.field_participants')}</label>
              <input
                value={String(form.participants)}
                type="number"
                min={0}
                disabled
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('talks.participants_placeholder')}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">{t('talks.field_description')}</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full min-h-[120px] rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('talks.description_placeholder')}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">{t('talks.field_agenda')}</label>
              <textarea
                value={form.agendaText}
                onChange={(e) => setForm((p) => ({ ...p, agendaText: e.target.value }))}
                className="w-full min-h-[120px] rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('talks.agenda_placeholder')}
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-card/60 p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-sm font-semibold">{t('talks.video_optional')}</div>
                <div className="text-xs text-muted-foreground">{t('talks.video_help')}</div>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => videoInputRef.current?.click()} disabled={upload.uploading}>
                  <Video className="mr-2 h-4 w-4" />
                  {t('talks.select_video')}
                </Button>
                {videoUrl && talkId ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void removeVideo()}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    disabled={upload.uploading || saving}
                  >
                    <X className="mr-2 h-4 w-4" />
                    {t('talks.remove_video')}
                  </Button>
                ) : null}
                <input
                  ref={videoInputRef}
                  type="file"
                  accept=".mp4,.avi,.mov,video/mp4,video/quicktime,video/x-msvideo"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    if (talkId) void uploadVideo(file, { create: false })
                    else void uploadVideo(file, { create: true })
                  }}
                />
              </div>
            </div>

            {upload.uploading ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t('talks.uploading')}</span>
                  <span>{upload.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-2 bg-primary" style={{ width: `${upload.progress}%` }} />
                </div>
              </div>
            ) : null}

            {videoUrl ? (
              <video controls className="w-full rounded-2xl border bg-black">
                <source src={videoUrl} />
              </video>
            ) : (
              <div className="rounded-2xl border bg-background p-4 text-sm text-muted-foreground">{t('talks.video_empty')}</div>
            )}
          </div>
        </motion.div>

        <div className="space-y-6">
          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm space-y-2">
            <div className="text-sm font-semibold">{t('talks.summary')}</div>
            <div className="text-muted-foreground">{form.title || t('talks.summary_placeholder')}</div>
            <div className="text-xs text-muted-foreground">
              {form.date} · {form.startTime}–{form.endTime} · {form.format === 'presential' ? t('talks.format_presential') : t('talks.format_online')}
            </div>
            {form.topic ? <div className="text-xs text-muted-foreground">{t('talks.field_topic')}: {form.topic}</div> : null}
            {form.speaker ? <div className="text-xs text-muted-foreground">{t('talks.field_speaker')}: {form.speaker}</div> : null}
            <div className="text-xs text-muted-foreground">{t('talks.field_participants')}: {Math.max(0, Math.round(form.participants || 0))}</div>
          </div>

          {agendaItems.length ? (
            <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm space-y-2">
              <div className="text-sm font-semibold">{t('talks.field_agenda')}</div>
              <div className="space-y-1">
                {agendaItems.slice(0, 4).map((x) => (
                  <div key={x} className="text-sm text-muted-foreground">
                    • {x}
                  </div>
                ))}
                {agendaItems.length > 4 ? <div className="text-xs text-muted-foreground">+{agendaItems.length - 4}</div> : null}
              </div>
            </div>
          ) : null}

          {isEdit ? (
            <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-sm font-semibold">{t('talks.registrations')}</div>
                  <div className="text-xs text-muted-foreground">{t('talks.registrations_help')}</div>
                </div>
                <Button variant="outline" size="sm" onClick={() => void refreshRegistrations()} disabled={loadingRegistrations}>
                  {loadingRegistrations ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {t('talks.refresh')}
                </Button>
              </div>

              {registrationsError ? (
                <div className="rounded-2xl border bg-background p-3 text-sm text-red-500">{registrationsError}</div>
              ) : null}

              {loadingRegistrations ? (
                <div className="rounded-2xl border bg-background p-3 text-sm text-muted-foreground">{t('talks.loading')}</div>
              ) : registrations.length === 0 ? (
                <div className="rounded-2xl border bg-background p-3 text-sm text-muted-foreground">{t('talks.registrations_empty')}</div>
              ) : (
                <div className="space-y-2">
                  {registrations.slice(0, 8).map((r) => (
                    <div key={r.id} className="rounded-2xl border bg-background p-3">
                      <div className="text-sm font-semibold">{`${r.firstName} ${r.lastName}`.trim()}</div>
                      <div className="text-xs text-muted-foreground">
                        {r.email ? <span className="mr-3">{r.email}</span> : null}
                        {r.phone ? <span>{r.phone}</span> : null}
                      </div>
                    </div>
                  ))}
                  {registrations.length > 8 ? <div className="text-xs text-muted-foreground">+{registrations.length - 8}</div> : null}
                </div>
              )}
            </div>
          ) : null}

          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm space-y-2">
            <div className="text-sm font-semibold">{t('talks.calendar_hint')}</div>
            <div className="text-sm text-muted-foreground">{t('talks.calendar_hint_desc')}</div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {confirmDeleteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border bg-card/95 p-8 shadow-2xl backdrop-blur-xl m-4"
            >
              <button
                onClick={() => setConfirmDeleteOpen(false)}
                className="absolute right-6 top-6 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                disabled={saving}
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-500" />
                </div>
                
                <h3 className="mb-2 text-2xl font-bold tracking-tight">
                  {t('talks.confirm_delete_title', '¿Estás seguro?')}
                </h3>
                
                <p className="mb-8 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {t('talks.confirm_delete_desc', 'Esta acción no se puede deshacer. El conversatorio será eliminado permanentemente de la plataforma.')}
                </p>

                <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto px-8"
                    onClick={() => setConfirmDeleteOpen(false)}
                    disabled={saving}
                  >
                    {t('common.cancel', 'Cancelar')}
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full sm:w-auto px-8 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 transition-all hover:shadow-red-600/40"
                    onClick={() => void executeDeleteTalk()}
                    disabled={saving}
                  >
                    {saving ? (
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
                        {t('common.deleting', 'Eliminando...')}
                      </span>
                    ) : (
                      <span className="flex items-center font-medium">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('talks.confirm_delete_button', 'Sí, eliminar')}
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
