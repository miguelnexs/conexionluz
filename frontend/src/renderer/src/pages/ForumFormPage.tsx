import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '@/api/client'
import {
  ArrowLeft,
  MessageSquareText,
  Loader2,
  Save,
  ImageIcon,
  X,
  Upload
} from 'lucide-react'
import type React from 'react'

interface ForumTopic {
  id: number
  title: string
  description: string
  category: string
  imageUrl: string | null
  isPinned: boolean
  isLocked: boolean
  isActive: boolean
  repliesCount: number
  createdAt: string
  updatedAt: string
}

export function ForumFormPage({ mode }: { mode: 'create' | 'edit' }): React.ReactElement {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [isPinned, setIsPinned] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [removeImage, setRemoveImage] = useState(false)

  useEffect(() => {
    if (mode !== 'edit' || !id) return
    const load = async () => {
      setLoading(true)
      const res = await api.get<ForumTopic>(`/api/forum/${id}/`)
      if (!res.ok) {
        setError(res.error)
        setLoading(false)
        return
      }
      setTitle(res.data.title)
      setDescription(res.data.description)
      setCategory(res.data.category)
      setIsPinned(res.data.isPinned)
      setIsLocked(res.data.isLocked)
      setIsActive(res.data.isActive)
      if (res.data.imageUrl) setImagePreview(res.data.imageUrl)
      setLoading(false)
    }
    load()
  }, [mode, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const fd = new FormData()
    fd.append('title', title)
    fd.append('description', description)
    fd.append('category', category)
    fd.append('isPinned', String(isPinned))
    fd.append('isLocked', String(isLocked))
    fd.append('isActive', String(isActive))
    if (imageFile) fd.append('imageFile', imageFile)
    if (removeImage) fd.append('removeImage', 'true')

    const res =
      mode === 'create'
        ? await api.postForm<ForumTopic>('/api/forum/', fd)
        : await api.patchForm<ForumTopic>(`/api/forum/${id}/`, fd)

    if (!res.ok) {
      setError(res.error)
      setSaving(false)
      return
    }
    navigate('/foro')
  }

  const item = { hidden: { y: 16, opacity: 0 }, show: { y: 0, opacity: 1 } }

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
        <div className="h-8 w-32 bg-muted/50 rounded-lg animate-pulse" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.08 }}
      className="p-4 md:p-8 max-w-3xl mx-auto space-y-6"
    >
      <motion.div variants={item}>
        <button
          onClick={() => navigate('/foro')}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al foro
        </button>
      </motion.div>

      <motion.div variants={item} className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-border">
          <MessageSquareText className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {mode === 'create' ? 'Nuevo Tema' : 'Editar Tema'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === 'create' ? 'Crea un nuevo tema de discusión' : 'Modifica los datos del tema'}
          </p>
        </div>
      </motion.div>

      {error && (
        <motion.div
          variants={item}
          className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-center text-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.form variants={item} onSubmit={handleSubmit} className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 md:p-8 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Título *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border bg-background/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            placeholder="Título del tema de discusión"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl border bg-background/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
            placeholder="Describe el tema de discusión..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Categoría</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border bg-background/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            placeholder="Ej: General, Bienestar, Terapia..."
          />
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Imagen</label>
          {(imagePreview && !removeImage) ? (
            <div className="relative rounded-xl overflow-hidden border bg-background/50">
              <img
                src={imageFile ? imagePreview : imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  if (imageFile) {
                    setImageFile(null)
                    setImagePreview(mode === 'edit' ? imagePreview : null)
                  } else {
                    setRemoveImage(true)
                  }
                }}
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all"
              >
                <X className="h-4 w-4" />
              </button>
              {/* Change image button */}
              <label className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs font-medium cursor-pointer transition-all">
                <Upload className="h-3.5 w-3.5" />
                Cambiar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setImageFile(file)
                      setImagePreview(URL.createObjectURL(file))
                      setRemoveImage(false)
                    }
                  }}
                />
              </label>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed border-muted bg-background/50 cursor-pointer hover:bg-background/80 hover:border-primary/30 transition-all">
              <ImageIcon className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <span className="text-sm text-muted-foreground">Haz clic para subir una imagen</span>
              <span className="text-xs text-muted-foreground/70 mt-1">JPG, PNG o WebP</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setImageFile(file)
                    setImagePreview(URL.createObjectURL(file))
                    setRemoveImage(false)
                  }
                }}
              />
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 rounded-xl border bg-background/50 p-3 cursor-pointer hover:bg-background/80 transition-all">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="rounded border-muted"
            />
            <span className="text-sm font-medium">Fijado</span>
          </label>
          <label className="flex items-center gap-3 rounded-xl border bg-background/50 p-3 cursor-pointer hover:bg-background/80 transition-all">
            <input
              type="checkbox"
              checked={isLocked}
              onChange={(e) => setIsLocked(e.target.checked)}
              className="rounded border-muted"
            />
            <span className="text-sm font-medium">Bloqueado</span>
          </label>
          <label className="flex items-center gap-3 rounded-xl border bg-background/50 p-3 cursor-pointer hover:bg-background/80 transition-all">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-muted"
            />
            <span className="text-sm font-medium">Activo</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/foro')}
            className="px-5 py-2.5 rounded-xl border text-sm font-medium hover:bg-muted/50 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-sm"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {mode === 'create' ? 'Crear Tema' : 'Guardar Cambios'}
              </>
            )}
          </button>
        </div>
      </motion.form>
    </motion.div>
  )
}

export default ForumFormPage
