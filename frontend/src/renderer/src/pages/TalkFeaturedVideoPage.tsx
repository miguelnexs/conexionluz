import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { api } from '@/api/client'
import { Loader2, Trash2, Video } from 'lucide-react'

type Talk = {
  id: number
  title: string
  featuredVideoUrl?: string | null
}

function getApiBaseUrl(): string {
  const value = (import.meta as any).env?.VITE_API_URL as string | undefined
  return (value && value.trim()) || 'https://conexionluz.com'
}

export function TalkFeaturedVideoPage(): JSX.Element {
  const { t } = useTranslation()
  const { id } = useParams()
  const idNormalized = typeof id === 'string' ? id.replace(/^:/, '') : ''
  const talkId = Number(idNormalized)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [talk, setTalk] = useState<Talk | null>(null)
  const [featuredVideoUrl, setFeaturedVideoUrl] = useState<string | null>(null)
  const [upload, setUpload] = useState<{ uploading: boolean; progress: number; error: string | null }>({
    uploading: false,
    progress: 0,
    error: null
  })
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const invalidId = useMemo(() => !Number.isFinite(talkId) || talkId <= 0, [talkId])

  useEffect(() => {
    if (invalidId) {
      setError(t('talks.invalid_id'))
      setLoading(false)
      return
    }
    void (async () => {
      setLoading(true)
      setError(null)
      const res = await api.get<Talk>(`/api/talks/${talkId}/`)
      if (!res.ok) {
        setError(res.error)
        setLoading(false)
        return
      }
      setTalk(res.data)
      setFeaturedVideoUrl(res.data.featuredVideoUrl || null)
      setLoading(false)
    })()
  }, [invalidId, t, talkId])

  const uploadFeatured = async (file: File) => {
    const name = file.name.toLowerCase()
    if (!name.endsWith('.mp4') && !name.endsWith('.avi') && !name.endsWith('.mov')) {
      setUpload({ uploading: false, progress: 0, error: t('talks.upload_invalid_type') })
      return
    }
    const maxSize = 1024 * 1024 * 500
    if (file.size > maxSize) {
      setUpload({ uploading: false, progress: 0, error: t('talks.upload_too_large') })
      return
    }
    if (!Number.isFinite(talkId) || talkId <= 0) return

    const fd = new FormData()
    fd.append('featuredVideoFile', file)

    setUpload({ uploading: true, progress: 0, error: null })
    try {
      const res = await axios.patch(`${getApiBaseUrl()}/api/talks/${talkId}/`, fd, {
        onUploadProgress: (evt: any) => {
          const total = evt.total || file.size
          const pct = total > 0 ? Math.round((evt.loaded / total) * 100) : 0
          setUpload((p) => (p.uploading ? { ...p, progress: pct } : p))
        }
      })
      const json = res.data
      const nextUrl = (json?.data?.featuredVideoUrl as string | undefined) || null
      setFeaturedVideoUrl(nextUrl)
      setUpload({ uploading: false, progress: 0, error: null })
    } catch (e: any) {
      const apiError = e?.response?.data?.error as string | undefined
      setUpload({ uploading: false, progress: 0, error: apiError || e?.message || t('talks.upload_failed') })
    }
  }

  const removeFeatured = async () => {
    if (!Number.isFinite(talkId) || talkId <= 0) return
    setSaving(true)
    setError(null)
    const res = await api.patch<Talk>(`/api/talks/${talkId}/`, { removeFeaturedVideo: true })
    setSaving(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setFeaturedVideoUrl(null)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-1/3 rounded-md bg-muted" />
        <div className="h-64 rounded-2xl border bg-card/70" />
      </div>
    )
  }

  if (invalidId) {
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
          <h2 className="text-3xl font-bold tracking-tight">{t('talks.featured_page_title')}</h2>
          <p className="text-muted-foreground">{t('talks.featured_page_help')}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link to="/conversatorios">{t('talks.back')}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/conversatorios/${talkId}`}>{t('talks.edit')}</Link>
          </Button>
        </div>
      </div>

      {error ? <div className="rounded-2xl border bg-card/70 p-4 text-sm text-red-500">{error}</div> : null}
      {upload.error ? <div className="rounded-2xl border bg-card/70 p-4 text-sm text-red-500">{upload.error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm space-y-4 lg:col-span-2"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="text-sm font-semibold">{t('talks.featured_video')}</div>
              <div className="text-xs text-muted-foreground">{t('talks.featured_video_help')}</div>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={upload.uploading}>
                <Video className="mr-2 h-4 w-4" />
                {t('talks.select_featured_video')}
              </Button>
              {featuredVideoUrl ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void removeFeatured()}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                  disabled={saving || upload.uploading}
                >
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  {t('talks.remove_featured_video')}
                </Button>
              ) : null}
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp4,.avi,.mov,video/mp4,video/quicktime,video/x-msvideo"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  void uploadFeatured(file)
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

          {featuredVideoUrl ? (
            <video controls className="w-full rounded-2xl border bg-black">
              <source src={featuredVideoUrl} />
            </video>
          ) : (
            <div className="rounded-2xl border bg-background p-4 text-sm text-muted-foreground">{t('talks.featured_video_empty')}</div>
          )}
        </motion.div>

        <div className="space-y-6">
          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm space-y-2">
            <div className="text-sm font-semibold">{t('talks.summary')}</div>
            <div className="text-muted-foreground">{talk?.title || t('talks.summary_placeholder')}</div>
          </div>
          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm space-y-2">
            <div className="text-sm font-semibold">{t('talks.featured_usage')}</div>
            <div className="text-sm text-muted-foreground">{t('talks.featured_usage_desc')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
