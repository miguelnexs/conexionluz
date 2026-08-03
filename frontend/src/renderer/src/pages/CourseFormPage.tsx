import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { CourseEnrollments } from './CourseEnrollments'
import axios from 'axios'
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { api } from '@/api/client'
import {
  BadgeDollarSign,
  Check,
  Copy,
  GripVertical,
  Image as ImageIcon,
  LayoutList,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Video
} from 'lucide-react'

type Mode = 'create' | 'edit'

type Props = {
  mode: Mode
}

type CourseStatus = 'draft' | 'published'

type Course = {
  id: number
  title: string
  slug: string
  description?: string
  descriptionHtml?: string
  coverUrl?: string | null
  promoVideoUrl?: string | null
  promoMediaId?: number | null
  category?: string
  tags?: string[]
  priceCOP: number
  status: CourseStatus
  isActive?: boolean
  draftContent?: CourseContent
  publishedContent?: CourseContent
}

type CourseContent = {
  version?: number
  sections?: CourseSection[]
}

type CourseSection = {
  id: string
  title: string
  items: CourseItem[]
}

type CourseItemType = 'video' | 'html' | 'quiz'

type QuizQuestionType = 'multiple' | 'truefalse' | 'short'

type QuizChoice = {
  id: string
  text: string
  isCorrect: boolean
}

type QuizQuestion = {
  id: string
  type: QuizQuestionType
  prompt: string
  choices?: QuizChoice[]
  correctBool?: boolean
  correctText?: string
}

type QuizContent = {
  questions: QuizQuestion[]
}

type CourseItem = {
  id: string
  type: CourseItemType
  title: string
  html?: string
  mediaId?: number
  mediaUrl?: string
  quiz?: QuizContent
}

type UploadState = {
  uploadingItemId: string | null
  progress: number
  error: string | null
}

function createId(prefix: string): string {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function safeHtml(value: string): string {
  const noScripts = value.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  const noOnHandlers = noScripts.replace(/\son\w+="[^"]*"/gi, '')
  const noJsUrls = noOnHandlers.replace(/href="javascript:[^"]*"/gi, 'href="#"')
  return noJsUrls
}

function formatCOP(value: number): string {
  return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
}

function getApiBaseUrl(): string {
  const value = (import.meta as any).env?.VITE_API_URL as string | undefined
  return (value && value.trim()) || 'https://conexionluz.com'
}

function SortableRow({
  id,
  children
}: {
  id: string
  children: (opts: { attributes: any; listeners: any; setActivatorNodeRef: (el: HTMLElement | null) => void; style: any }) => JSX.Element
}): JSX.Element {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1
  }
  return (
    <div ref={setNodeRef} style={style}>
      {children({ attributes, listeners, setActivatorNodeRef, style })}
    </div>
  )
}

export function CourseFormPage({ mode }: Props): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()

  const isEdit = mode === 'edit'
  const courseId = isEdit ? Number(id) : null

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [autosaving, setAutosaving] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const dirtyBlockRef = useRef(true)

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)

  const [upload, setUpload] = useState<UploadState>({ uploadingItemId: null, progress: 0, error: null })
  const [promoVideoUrl, setPromoVideoUrl] = useState<string | null>(null)
  const [promoUpload, setPromoUpload] = useState<{ uploading: boolean; progress: number; error: string | null }>({
    uploading: false,
    progress: 0,
    error: null
  })
  const promoInputRef = useRef<HTMLInputElement | null>(null)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    priceCOP: 99000,
    status: 'draft' as CourseStatus,
    isActive: true,
    category: '',
    tagsText: '',
    description: '',
    descriptionHtml: ''
  })

  const [content, setContent] = useState<CourseContent>({
    version: 1,
    sections: [
      {
        id: createId('sec'),
        title: t('courses_builder.default_section'),
        items: []
      }
    ]
  })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const tags = useMemo(() => {
    return form.tagsText
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
  }, [form.tagsText])

  const canSubmit = useMemo(() => form.title.trim().length > 0 && form.slug.trim().length > 0 && !saving, [form, saving])

  useEffect(() => {
    if (isEdit) return
    const raw = localStorage.getItem('conexionluz:courseDraft:new')
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as any
      if (parsed?.form && typeof parsed.form === 'object') {
        setForm((p) => ({
          ...p,
          ...parsed.form
        }))
      }
      if (parsed?.content && typeof parsed.content === 'object') {
        setContent(parsed.content as CourseContent)
      }
    } catch {
      return
    }
  }, [isEdit])

  useEffect(() => {
    if (!coverFile) {
      setCoverPreview(null)
      return
    }
    const url = URL.createObjectURL(coverFile)
    setCoverPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [coverFile])

  useEffect(() => {
    if (!isEdit || !courseId) return
    void (async () => {
      dirtyBlockRef.current = true
      setIsDirty(false)
      setLoading(true)
      setError(null)
      const res = await api.get<Course>(`/api/courses/${courseId}/`)
      if (!res.ok) {
        setError(res.error)
        setLoading(false)
        dirtyBlockRef.current = false
        return
      }
      const c = res.data
      setPromoVideoUrl((c.promoVideoUrl || null) as string | null)
      setForm({
        title: c.title || '',
        slug: c.slug || '',
        priceCOP: Number.isFinite(c.priceCOP as number) ? (c.priceCOP as number) : 0,
        status: (c.status || 'draft') as CourseStatus,
        isActive: c.isActive !== false,
        category: c.category || '',
        tagsText: (c.tags || []).join(', '),
        description: c.description || '',
        descriptionHtml: c.descriptionHtml || ''
      })
      setContent(c.draftContent && typeof c.draftContent === 'object' ? (c.draftContent as CourseContent) : { version: 1, sections: [] })
      setLoading(false)
      dirtyBlockRef.current = false
    })()
  }, [isEdit, courseId])

  const persistDraft = useCallback(async (opts: { force?: boolean } = {}) => {
    if (!courseId) return
    if (!opts.force && saving) return
    setAutosaving(true)
    const res = await api.patch<Course>(`/api/courses/${courseId}/`, {
      title: form.title.trim(),
      slug: form.slug.trim(),
      priceCOP: Math.max(0, Math.round(form.priceCOP || 0)),
      status: form.status,
      isActive: form.isActive,
      category: form.category.trim(),
      tags,
      description: form.description.trim(),
      descriptionHtml: form.descriptionHtml,
      draftContent: content
    })
    setAutosaving(false)
    if (res.ok) {
      setLastSavedAt(new Date().toISOString())
      return
    }
    setError(res.error)
  }, [content, courseId, form, saving, tags])

  useEffect(() => {
    const key = courseId ? `conexionluz:courseDraft:${courseId}` : 'conexionluz:courseDraft:new'
    localStorage.setItem(
      key,
      JSON.stringify({
        form,
        content,
        updatedAt: Date.now()
      })
    )
  }, [form, content, courseId])

  useEffect(() => {
    if (!courseId) return
    if (dirtyBlockRef.current) return
    setIsDirty(true)
  }, [courseId, form, content, coverFile, promoVideoUrl])

  useEffect(() => {
    if (!courseId) return
    const handle = window.setTimeout(() => {
      void persistDraft()
    }, 1200)
    return () => window.clearTimeout(handle)
  }, [courseId, persistDraft])

  const createCourse = async () => {
    const title = form.title.trim()
    const slug = form.slug.trim() || toSlug(title)
    if (!title || !slug) return
    setSaving(true)
    setError(null)
    const res = await api.post<Course>('/api/courses/', {
      title,
      slug,
      priceCOP: Math.max(0, Math.round(form.priceCOP || 0)),
      status: form.status,
      isActive: form.isActive,
      category: form.category.trim(),
      tags,
      description: form.description.trim(),
      descriptionHtml: form.descriptionHtml,
      draftContent: content
    })
    setSaving(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    navigate(`/cursos/${res.data.id}`, { replace: true })
  }

  const saveCourse = async () => {
    if (!courseId) {
      await createCourse()
      return
    }
    setSaving(true)
    setError(null)
    const res = await api.patch<Course>(`/api/courses/${courseId}/`, {
      title: form.title.trim(),
      slug: form.slug.trim(),
      priceCOP: Math.max(0, Math.round(form.priceCOP || 0)),
      status: form.status,
      isActive: form.isActive,
      category: form.category.trim(),
      tags,
      description: form.description.trim(),
      descriptionHtml: form.descriptionHtml,
      draftContent: content
    })
    setSaving(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setLastSavedAt(new Date().toISOString())

    if (coverFile) {
      const fd = new FormData()
      fd.append('coverFile', coverFile)
      const coverRes = await api.patchForm<Course>(`/api/courses/${courseId}/`, fd)
      if (!coverRes.ok) {
        setError(coverRes.error)
        return
      }
      setCoverFile(null)
    }
  }

  const publish = async () => {
    if (!courseId) return
    setSaving(true)
    setError(null)
    const res = await api.post<Course>(`/api/courses/${courseId}/publish/`, {})
    setSaving(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    dirtyBlockRef.current = true
    setForm((p) => ({ ...p, status: 'published' }))
    setLastSavedAt(new Date().toISOString())
    setIsDirty(false)
    window.setTimeout(() => {
      dirtyBlockRef.current = false
    }, 0)
  }

  const addSection = () => {
    setContent((prev) => ({
      ...prev,
      sections: [
        ...(prev.sections || []),
        {
          id: createId('sec'),
          title: t('courses_builder.new_section'),
          items: []
        }
      ]
    }))
  }

  const deleteSection = (sectionId: string) => {
    setContent((prev) => ({ ...prev, sections: (prev.sections || []).filter((s) => s.id !== sectionId) }))
  }

  const addItem = (sectionId: string, type: CourseItemType) => {
    setContent((prev) => ({
      ...prev,
      sections: (prev.sections || []).map((s) => {
        if (s.id !== sectionId) return s
        const base: CourseItem = { id: createId('item'), type, title: t(`courses_builder.item_${type}`) }
        if (type === 'html') base.html = '<p></p>'
        if (type === 'quiz') base.quiz = { questions: [] }
        return { ...s, items: [...(s.items || []), base] }
      })
    }))
  }

  const deleteItem = (sectionId: string, itemId: string) => {
    setContent((prev) => ({
      ...prev,
      sections: (prev.sections || []).map((s) => (s.id !== sectionId ? s : { ...s, items: (s.items || []).filter((i) => i.id !== itemId) }))
    }))
  }

  const updateSectionTitle = (sectionId: string, title: string) => {
    setContent((prev) => ({
      ...prev,
      sections: (prev.sections || []).map((s) => (s.id !== sectionId ? s : { ...s, title }))
    }))
  }

  const updateItem = (sectionId: string, itemId: string, patch: Partial<CourseItem>) => {
    setContent((prev) => ({
      ...prev,
      sections: (prev.sections || []).map((s) => {
        if (s.id !== sectionId) return s
        return { ...s, items: (s.items || []).map((i) => (i.id !== itemId ? i : { ...i, ...patch })) }
      })
    }))
  }

  const onDragEndSections = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setContent((prev) => {
      const list = prev.sections || []
      const oldIndex = list.findIndex((x) => x.id === active.id)
      const newIndex = list.findIndex((x) => x.id === over.id)
      if (oldIndex < 0 || newIndex < 0) return prev
      return { ...prev, sections: arrayMove(list, oldIndex, newIndex) }
    })
  }

  const onDragEndItems = (sectionId: string) => (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setContent((prev) => {
      const sections = prev.sections || []
      return {
        ...prev,
        sections: sections.map((s) => {
          if (s.id !== sectionId) return s
          const list = s.items || []
          const oldIndex = list.findIndex((x) => x.id === active.id)
          const newIndex = list.findIndex((x) => x.id === over.id)
          if (oldIndex < 0 || newIndex < 0) return s
          return { ...s, items: arrayMove(list, oldIndex, newIndex) }
        })
      }
    })
  }

  const uploadVideo = async (itemId: string, file: File) => {
    if (!courseId) {
      setUpload({ uploadingItemId: null, progress: 0, error: t('courses_builder.upload_requires_save') })
      return
    }
    const name = file.name.toLowerCase()
    if (!name.endsWith('.mp4') && !name.endsWith('.avi') && !name.endsWith('.mov')) {
      setUpload({ uploadingItemId: null, progress: 0, error: t('courses_builder.upload_invalid_type') })
      return
    }
    const maxSize = 1024 * 1024 * 500
    if (file.size > maxSize) {
      setUpload({ uploadingItemId: null, progress: 0, error: t('courses_builder.upload_too_large') })
      return
    }
    setUpload({ uploadingItemId: itemId, progress: 0, error: null })
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await axios.post(`${getApiBaseUrl()}/api/courses/${courseId}/media/`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          const total = evt.total || file.size
          const pct = total > 0 ? Math.round((evt.loaded / total) * 100) : 0
          setUpload((p) => (p.uploadingItemId === itemId ? { ...p, progress: pct } : p))
        }
      })
      const json = res.data
      const mediaId = json?.data?.id as number | undefined
      const mediaUrl = json?.data?.url as string | undefined
      if (typeof mediaId === 'number' && typeof mediaUrl === 'string') {
        const { sectionId } = findItem(content, itemId)
        if (sectionId) updateItem(sectionId, itemId, { mediaId, mediaUrl })
        setUpload({ uploadingItemId: null, progress: 0, error: null })
        return
      }
      setUpload({ uploadingItemId: null, progress: 0, error: t('courses_builder.upload_failed') })
    } catch (e: any) {
      setUpload({ uploadingItemId: null, progress: 0, error: e?.message || t('courses_builder.upload_failed') })
    }
  }

  const uploadPromoVideo = async (file: File) => {
    if (!courseId) {
      setPromoUpload({ uploading: false, progress: 0, error: t('courses_builder.upload_requires_save') })
      return
    }
    const name = file.name.toLowerCase()
    if (!name.endsWith('.mp4') && !name.endsWith('.avi') && !name.endsWith('.mov')) {
      setPromoUpload({ uploading: false, progress: 0, error: t('courses_builder.upload_invalid_type') })
      return
    }
    const maxSize = 1024 * 1024 * 500
    if (file.size > maxSize) {
      setPromoUpload({ uploading: false, progress: 0, error: t('courses_builder.upload_too_large') })
      return
    }
    setPromoUpload({ uploading: true, progress: 0, error: null })
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await axios.post(`${getApiBaseUrl()}/api/courses/${courseId}/promo-video/`, fd, {
        onUploadProgress: (evt) => {
          const total = evt.total || file.size
          const pct = total > 0 ? Math.round((evt.loaded / total) * 100) : 0
          setPromoUpload((p) => (p.uploading ? { ...p, progress: pct } : p))
        }
      })
      const json = res.data
      const url = (json?.data?.promoVideoUrl as string | undefined) || null
      if (url) {
        setPromoVideoUrl(url)
        setPromoUpload({ uploading: false, progress: 0, error: null })
        return
      }
      setPromoUpload({ uploading: false, progress: 0, error: t('courses_builder.upload_failed') })
    } catch (e: any) {
      setPromoUpload({ uploading: false, progress: 0, error: e?.message || t('courses_builder.upload_failed') })
    }
  }

  const removePromoVideo = async () => {
    if (!courseId) return
    setPromoUpload({ uploading: false, progress: 0, error: null })
    const res = await api.del<Course>(`/api/courses/${courseId}/promo-video/`)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setPromoVideoUrl(null)
  }

  const addQuizQuestion = (sectionId: string, itemId: string, type: QuizQuestionType) => {
    setContent((prev) => ({
      ...prev,
      sections: (prev.sections || []).map((s) => {
        if (s.id !== sectionId) return s
        return {
          ...s,
          items: (s.items || []).map((it) => {
            if (it.id !== itemId) return it
            const quiz = it.quiz || { questions: [] }
            const q: QuizQuestion = {
              id: createId('q'),
              type,
              prompt: '',
              choices: type === 'multiple' ? [{ id: createId('c'), text: '', isCorrect: true }] : undefined,
              correctBool: type === 'truefalse' ? true : undefined,
              correctText: type === 'short' ? '' : undefined
            }
            return { ...it, quiz: { ...quiz, questions: [...quiz.questions, q] } }
          })
        }
      })
    }))
  }

  const updateQuizQuestion = (sectionId: string, itemId: string, qId: string, patch: Partial<QuizQuestion>) => {
    setContent((prev) => ({
      ...prev,
      sections: (prev.sections || []).map((s) => {
        if (s.id !== sectionId) return s
        return {
          ...s,
          items: (s.items || []).map((it) => {
            if (it.id !== itemId) return it
            const quiz = it.quiz || { questions: [] }
            return {
              ...it,
              quiz: {
                ...quiz,
                questions: quiz.questions.map((q) => (q.id !== qId ? q : { ...q, ...patch }))
              }
            }
          })
        }
      })
    }))
  }

  const deleteQuizQuestion = (sectionId: string, itemId: string, qId: string) => {
    setContent((prev) => ({
      ...prev,
      sections: (prev.sections || []).map((s) => {
        if (s.id !== sectionId) return s
        return {
          ...s,
          items: (s.items || []).map((it) => {
            if (it.id !== itemId) return it
            const quiz = it.quiz || { questions: [] }
            return { ...it, quiz: { ...quiz, questions: quiz.questions.filter((q) => q.id !== qId) } }
          })
        }
      })
    }))
  }

  const addChoice = (sectionId: string, itemId: string, qId: string) => {
    setContent((prev) => ({
      ...prev,
      sections: (prev.sections || []).map((s) => {
        if (s.id !== sectionId) return s
        return {
          ...s,
          items: (s.items || []).map((it) => {
            if (it.id !== itemId) return it
            const quiz = it.quiz || { questions: [] }
            return {
              ...it,
              quiz: {
                ...quiz,
                questions: quiz.questions.map((q) =>
                  q.id !== qId ? q : { ...q, choices: [...(q.choices || []), { id: createId('c'), text: '', isCorrect: false }] }
                )
              }
            }
          })
        }
      })
    }))
  }

  const updateChoice = (sectionId: string, itemId: string, qId: string, cId: string, patch: Partial<QuizChoice>) => {
    setContent((prev) => ({
      ...prev,
      sections: (prev.sections || []).map((s) => {
        if (s.id !== sectionId) return s
        return {
          ...s,
          items: (s.items || []).map((it) => {
            if (it.id !== itemId) return it
            const quiz = it.quiz || { questions: [] }
            return {
              ...it,
              quiz: {
                ...quiz,
                questions: quiz.questions.map((q) => {
                  if (q.id !== qId) return q
                  return { ...q, choices: (q.choices || []).map((c) => (c.id !== cId ? c : { ...c, ...patch })) }
                })
              }
            }
          })
        }
      })
    }))
  }

  const deleteChoice = (sectionId: string, itemId: string, qId: string, cId: string) => {
    setContent((prev) => ({
      ...prev,
      sections: (prev.sections || []).map((s) => {
        if (s.id !== sectionId) return s
        return {
          ...s,
          items: (s.items || []).map((it) => {
            if (it.id !== itemId) return it
            const quiz = it.quiz || { questions: [] }
            return {
              ...it,
              quiz: {
                ...quiz,
                questions: quiz.questions.map((q) => (q.id !== qId ? q : { ...q, choices: (q.choices || []).filter((c) => c.id !== cId) }))
              }
            }
          })
        }
      })
    }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-1/3 rounded-md bg-muted" />
        <div className="h-64 rounded-2xl border bg-card/70" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">
            {isEdit ? t('courses_builder.page_edit') : t('courses_builder.page_create')}
          </h2>
          <div className="text-muted-foreground">
            {autosaving ? t('courses_builder.autosaving') : lastSavedAt ? t('courses_builder.saved') : t('courses_builder.not_saved')}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link to="/cursos">{t('courses_builder.back')}</Link>
          </Button>
          <Button onClick={() => void saveCourse()} disabled={!canSubmit}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {t('courses_builder.save')}
          </Button>
          {isEdit && courseId && (form.status !== 'published' || isDirty) ? (
            <Button variant="secondary" onClick={() => void publish()} disabled={saving}>
              <Check className="mr-2 h-4 w-4" />
              {form.status === 'published' ? t('courses_builder.publish_changes') : t('courses_builder.publish')}
            </Button>
          ) : null}
        </div>
      </div>

      {error && <div className="rounded-2xl border bg-card/70 p-4 text-sm text-red-500">{error}</div>}

      {upload.error && <div className="rounded-2xl border bg-card/70 p-4 text-sm text-red-500">{upload.error}</div>}

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm space-y-6 lg:col-span-2"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">{t('courses_builder.title')}</label>
              <input
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value
                  setForm((p) => ({ ...p, title, slug: p.slug ? p.slug : toSlug(title) }))
                }}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('courses_builder.title_placeholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('courses_builder.slug')}</label>
              <input
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: toSlug(e.target.value) }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="mi-curso"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('courses_builder.price')}</label>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center rounded-xl border bg-background px-3 py-3 text-muted-foreground">
                  <BadgeDollarSign className="h-4 w-4" />
                </div>
                <input
                  value={form.priceCOP}
                  onChange={(e) => setForm((p) => ({ ...p, priceCOP: Number(e.target.value) }))}
                  type="number"
                  min={0}
                  step={1000}
                  className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="text-xs text-muted-foreground">{formatCOP(Math.max(0, form.priceCOP || 0))}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('courses_builder.category')}</label>
              <input
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('courses_builder.category_placeholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('courses_builder.tags')}</label>
              <input
                value={form.tagsText}
                onChange={(e) => setForm((p) => ({ ...p, tagsText: e.target.value }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('courses_builder.tags_placeholder')}
              />
              <div className="text-xs text-muted-foreground">{t('courses_builder.tags_help')}</div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">{t('courses_builder.description')}</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full min-h-[90px] rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('courses_builder.description_placeholder')}
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-card/60 p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-sm font-semibold">{t('courses_builder.promo_video')}</div>
                <div className="text-xs text-muted-foreground">{t('courses_builder.promo_video_help')}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => promoInputRef.current?.click()} disabled={promoUpload.uploading}>
                  <Video className="mr-2 h-4 w-4" />
                  {t('courses_builder.select_video')}
                </Button>
                {promoVideoUrl ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void removePromoVideo()}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    disabled={promoUpload.uploading}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('courses_builder.remove')}
                  </Button>
                ) : null}
                <input
                  ref={promoInputRef}
                  type="file"
                  accept=".mp4,.avi,.mov,video/mp4,video/quicktime,video/x-msvideo"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) void uploadPromoVideo(file)
                  }}
                />
              </div>
            </div>
            {promoUpload.error ? <div className="text-sm text-red-500">{promoUpload.error}</div> : null}
            {promoUpload.uploading ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t('courses_builder.uploading')}</span>
                  <span>{promoUpload.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-2 bg-primary" style={{ width: `${promoUpload.progress}%` }} />
                </div>
              </div>
            ) : null}
            {promoVideoUrl ? (
              <video controls className="w-full rounded-2xl border bg-black">
                <source src={promoVideoUrl} />
              </video>
            ) : null}
          </div>

          <div className="rounded-2xl border bg-card/60 p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold">{t('courses_builder.cover')}</div>
              <Button variant="outline" size="sm" onClick={() => coverInputRef.current?.click()}>
                <ImageIcon className="mr-2 h-4 w-4" />
                {t('courses_builder.select_cover')}
              </Button>
              <input
                ref={coverInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                className="hidden"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              />
            </div>
            {coverPreview ? (
              <img src={coverPreview} alt={t('courses_builder.cover')} className="w-full h-48 object-cover rounded-2xl ring-1 ring-border" />
            ) : null}
            <div className="text-xs text-muted-foreground">{t('courses_builder.cover_help')}</div>
          </div>

          <div className="rounded-2xl border bg-card/60 p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold">{t('courses_builder.structure')}</div>
              <Button variant="outline" size="sm" onClick={addSection}>
                <Plus className="mr-2 h-4 w-4" />
                {t('courses_builder.add_section')}
              </Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEndSections}>
              <SortableContext items={(content.sections || []).map((s) => s.id)}>
                <div className="space-y-4">
                  {(content.sections || []).map((section) => (
                    <SortableRow key={section.id} id={section.id}>
                      {({ attributes, listeners, setActivatorNodeRef }) => (
                        <div className="rounded-2xl border bg-background/60 p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2 flex-1">
                              <button
                                type="button"
                                ref={setActivatorNodeRef}
                                {...attributes}
                                {...listeners}
                                className="mt-2 inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-background text-muted-foreground"
                                aria-label={t('courses_builder.reorder_section')}
                              >
                                <GripVertical className="h-4 w-4" />
                              </button>
                              <div className="flex-1 space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground">{t('courses_builder.section_title')}</label>
                                <input
                                  value={section.title}
                                  onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                                  className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                />
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => deleteSection(section.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                              aria-label={t('courses_builder.delete_section')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => addItem(section.id, 'video')}>
                              <Video className="mr-2 h-4 w-4" />
                              {t('courses_builder.add_video')}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => addItem(section.id, 'html')}>
                              <Sparkles className="mr-2 h-4 w-4" />
                              {t('courses_builder.add_html')}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => addItem(section.id, 'quiz')}>
                              <LayoutList className="mr-2 h-4 w-4" />
                              {t('courses_builder.add_quiz')}
                            </Button>
                          </div>

                          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEndItems(section.id)}>
                            <SortableContext items={(section.items || []).map((i) => i.id)}>
                              <div className="space-y-3">
                                {(section.items || []).map((item) => (
                                  <SortableRow key={item.id} id={item.id}>
                                    {({ attributes: a2, listeners: l2, setActivatorNodeRef: act2 }) => (
                                      <div className="rounded-2xl border bg-card/60 p-4 space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                          <div className="flex items-start gap-2 flex-1">
                                            <button
                                              type="button"
                                              ref={act2}
                                              {...a2}
                                              {...l2}
                                              className="mt-2 inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-background text-muted-foreground"
                                              aria-label={t('courses_builder.reorder_item')}
                                            >
                                              <GripVertical className="h-4 w-4" />
                                            </button>
                                            <div className="flex-1 space-y-2">
                                              <div className="flex items-center justify-between gap-3">
                                                <label className="text-xs font-semibold text-muted-foreground">{t('courses_builder.item_title')}</label>
                                                <span className="text-xs font-semibold text-muted-foreground">{t(`courses_builder.type_${item.type}`)}</span>
                                              </div>
                                              <input
                                                value={item.title}
                                                onChange={(e) => updateItem(section.id, item.id, { title: e.target.value })}
                                                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                              />
                                            </div>
                                          </div>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => deleteItem(section.id, item.id)}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                            aria-label={t('courses_builder.delete_item')}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>

                                        {item.type === 'video' && (
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between gap-3">
                                              <div className="text-xs font-semibold text-muted-foreground">{t('courses_builder.video_file')}</div>
                                              <input
                                                type="file"
                                                accept=".mp4,.avi,.mov,video/mp4,video/quicktime,video/x-msvideo"
                                                onChange={(e) => {
                                                  const file = e.target.files?.[0]
                                                  if (file) void uploadVideo(item.id, file)
                                                }}
                                              />
                                            </div>

                                            {upload.uploadingItemId === item.id ? (
                                              <div className="space-y-2">
                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                  <span>{t('courses_builder.uploading')}</span>
                                                  <span>{upload.progress}%</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                                  <div className="h-2 bg-primary" style={{ width: `${upload.progress}%` }} />
                                                </div>
                                              </div>
                                            ) : null}

                                            {item.mediaUrl ? (
                                              <video controls className="w-full rounded-2xl border bg-black">
                                                <source src={item.mediaUrl} />
                                              </video>
                                            ) : null}
                                            <div className="text-xs text-muted-foreground">{t('courses_builder.video_help')}</div>
                                          </div>
                                        )}

                                        {item.type === 'html' && (
                                          <div className="space-y-3">
                                            <textarea
                                              value={item.html || ''}
                                              onChange={(e) => updateItem(section.id, item.id, { html: e.target.value })}
                                              className="w-full min-h-[130px] rounded-xl border bg-background px-4 py-3 text-sm font-mono outline-none focus:ring-2 focus:ring-ring"
                                              placeholder="<p>...</p>"
                                            />
                                            <div className="rounded-xl border bg-background p-4">
                                              <div className="text-xs font-semibold text-muted-foreground mb-2">{t('courses_builder.preview')}</div>
                                              <div
                                                className="prose prose-sm dark:prose-invert max-w-none"
                                                dangerouslySetInnerHTML={{ __html: safeHtml(item.html || '') }}
                                              />
                                            </div>
                                          </div>
                                        )}

                                        {item.type === 'quiz' && (
                                          <div className="space-y-4">
                                            <div className="flex flex-wrap gap-2">
                                              <Button variant="outline" size="sm" onClick={() => addQuizQuestion(section.id, item.id, 'multiple')}>
                                                {t('courses_builder.add_q_multiple')}
                                              </Button>
                                              <Button variant="outline" size="sm" onClick={() => addQuizQuestion(section.id, item.id, 'truefalse')}>
                                                {t('courses_builder.add_q_truefalse')}
                                              </Button>
                                              <Button variant="outline" size="sm" onClick={() => addQuizQuestion(section.id, item.id, 'short')}>
                                                {t('courses_builder.add_q_short')}
                                              </Button>
                                            </div>

                                            {(item.quiz?.questions || []).length === 0 ? (
                                              <div className="text-sm text-muted-foreground">{t('courses_builder.quiz_empty')}</div>
                                            ) : null}

                                            <div className="space-y-4">
                                              {(item.quiz?.questions || []).map((q, idx) => (
                                                <div key={q.id} className="rounded-2xl border bg-background/60 p-4 space-y-3">
                                                  <div className="flex items-start justify-between gap-3">
                                                    <div className="text-sm font-semibold">
                                                      {t('courses_builder.question')} {idx + 1} · {t(`courses_builder.qtype_${q.type}`)}
                                                    </div>
                                                    <Button
                                                      variant="outline"
                                                      size="icon"
                                                      onClick={() => deleteQuizQuestion(section.id, item.id, q.id)}
                                                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                                      aria-label={t('courses_builder.delete_question')}
                                                    >
                                                      <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                  <textarea
                                                    value={q.prompt}
                                                    onChange={(e) => updateQuizQuestion(section.id, item.id, q.id, { prompt: e.target.value })}
                                                    className="w-full min-h-[90px] rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                                    placeholder={t('courses_builder.prompt_placeholder')}
                                                  />

                                                  {q.type === 'multiple' && (
                                                    <div className="space-y-3">
                                                      <div className="flex items-center justify-between gap-3">
                                                        <div className="text-xs font-semibold text-muted-foreground">{t('courses_builder.choices')}</div>
                                                        <Button variant="outline" size="sm" onClick={() => addChoice(section.id, item.id, q.id)}>
                                                          <Plus className="mr-2 h-4 w-4" />
                                                          {t('courses_builder.add_choice')}
                                                        </Button>
                                                      </div>
                                                      <div className="space-y-2">
                                                        {(q.choices || []).map((c) => (
                                                          <div key={c.id} className="flex items-center gap-2">
                                                            <input
                                                              type="checkbox"
                                                              checked={c.isCorrect}
                                                              onChange={(e) =>
                                                                updateChoice(section.id, item.id, q.id, c.id, { isCorrect: e.target.checked })
                                                              }
                                                              aria-label={t('courses_builder.correct')}
                                                            />
                                                            <input
                                                              value={c.text}
                                                              onChange={(e) => updateChoice(section.id, item.id, q.id, c.id, { text: e.target.value })}
                                                              className="flex-1 rounded-xl border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                                              placeholder={t('courses_builder.choice_placeholder')}
                                                            />
                                                            <Button
                                                              variant="outline"
                                                              size="icon"
                                                              onClick={() => deleteChoice(section.id, item.id, q.id, c.id)}
                                                              aria-label={t('courses_builder.delete_choice')}
                                                            >
                                                              <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                          </div>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  )}

                                                  {q.type === 'truefalse' && (
                                                    <div className="space-y-2">
                                                      <label className="text-xs font-semibold text-muted-foreground">{t('courses_builder.correct_answer')}</label>
                                                      <select
                                                        value={q.correctBool ? 'true' : 'false'}
                                                        onChange={(e) =>
                                                          updateQuizQuestion(section.id, item.id, q.id, { correctBool: e.target.value === 'true' })
                                                        }
                                                        className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                                      >
                                                        <option value="true">{t('courses_builder.true')}</option>
                                                        <option value="false">{t('courses_builder.false')}</option>
                                                      </select>
                                                    </div>
                                                  )}

                                                  {q.type === 'short' && (
                                                    <div className="space-y-2">
                                                      <label className="text-xs font-semibold text-muted-foreground">{t('courses_builder.correct_answer')}</label>
                                                      <input
                                                        value={q.correctText || ''}
                                                        onChange={(e) => updateQuizQuestion(section.id, item.id, q.id, { correctText: e.target.value })}
                                                        className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                                        placeholder={t('courses_builder.short_answer_placeholder')}
                                                      />
                                                    </div>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </SortableRow>
                                ))}
                              </div>
                            </SortableContext>
                          </DndContext>
                        </div>
                      )}
                    </SortableRow>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {courseId && <CourseEnrollments courseId={courseId} />}
        </motion.div>

        <div className="space-y-6">
          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm space-y-4">
            <div className="text-sm font-semibold">{t('courses_builder.course_preview')}</div>
            <div className="space-y-2">
              <div className="text-lg font-semibold">{form.title || t('courses_builder.preview_title')}</div>
              {form.category ? <div className="text-xs text-muted-foreground">{form.category}</div> : null}
              {tags.length ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="text-sm text-muted-foreground">{form.description || t('courses_builder.preview_description')}</div>
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">{t('courses_builder.price')}</div>
                <div className="font-semibold">{formatCOP(Math.max(0, form.priceCOP || 0))}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm space-y-3">
            <div className="text-sm font-semibold">{t('courses_builder.structure_summary')}</div>
            <div className="text-sm text-muted-foreground">{t('courses_builder.sections_count', { count: (content.sections || []).length })}</div>
            <div className="text-sm text-muted-foreground">
              {t('courses_builder.items_count', { count: countItems(content) })}
            </div>
          </div>

          {courseId ? (
            <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm space-y-3">
              <div className="text-sm font-semibold">{t('courses_builder.public_url')}</div>
              <div className="text-sm text-muted-foreground break-all">/cursos/{form.slug}</div>
              <Button
                variant="outline"
                onClick={() => void navigator.clipboard?.writeText(`/cursos/${form.slug}`)}
                className="w-full"
              >
                <Copy className="mr-2 h-4 w-4" />
                {t('courses_builder.copy_url')}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function countItems(content: CourseContent): number {
  const sections = content.sections || []
  return sections.reduce((sum, s) => sum + (s.items || []).length, 0)
}

function findItem(content: CourseContent, itemId: string): { sectionId: string | null } {
  for (const s of content.sections || []) {
    for (const it of s.items || []) {
      if (it.id === itemId) return { sectionId: s.id }
    }
  }
  return { sectionId: null }
}
