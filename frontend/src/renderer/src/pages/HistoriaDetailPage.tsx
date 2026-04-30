import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '@/api/client'
import {
  ArrowLeft,
  BookOpen,
  User,
  Tag,
  Calendar,
  Eye,
  EyeOff,
  Trash2,
  ImageIcon,
  Loader2,
  AlertTriangle,
  Clock,
  Pencil
} from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import type React from 'react'

interface Story {
  id: number
  title: string
  content: string
  imageUrl: string | null
  author: string
  category: string
  tags: string[]
  patientId: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function HistoriaDetailPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [togglingActive, setTogglingActive] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const res = await api.get<Story>(`/api/stories/${id}/`)
      if (!res.ok) {
        setError(res.error)
        setLoading(false)
        return
      }
      setStory(res.data)
      setLoading(false)
    }
    load()
  }, [id])

  const handleToggleActive = async () => {
    if (!story) return
    setTogglingActive(true)
    const res = await api.patch<Story>(`/api/stories/${story.id}/`, { isActive: !story.isActive })
    if (res.ok) {
      setStory({ ...story, isActive: !story.isActive })
    }
    setTogglingActive(false)
  }

  const handleDelete = async () => {
    if (!story) return
    setDeleting(true)
    const res = await api.del(`/api/stories/${story.id}/`)
    if (res.ok) {
      navigate('/historia')
    }
    setDeleting(false)
    setConfirmDelete(false)
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })

  const item = { hidden: { y: 16, opacity: 0 }, show: { y: 0, opacity: 1 } }

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        <div className="h-8 w-32 bg-muted/50 rounded-lg animate-pulse" />
        <div className="h-72 rounded-2xl bg-muted/50 animate-pulse" />
        <div className="h-10 w-3/4 bg-muted/50 rounded-xl animate-pulse" />
        <div className="h-6 w-1/2 bg-muted/50 rounded-lg animate-pulse" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-muted/50 rounded animate-pulse" style={{ width: `${90 - i * 8}%` }} />
          ))}
        </div>
      </div>
    )
  }

  // Error / not found
  if (error || !story) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/historia')}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a historias
        </button>
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border bg-card/70 backdrop-blur-sm">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <BookOpen className="h-7 w-7 text-destructive" />
          </div>
          <p className="text-lg font-medium mb-1">Historia no encontrada</p>
          <p className="text-sm text-muted-foreground">{error || 'La historia que buscas no existe o fue eliminada.'}</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.08 }}
      className="p-4 md:p-8 max-w-4xl mx-auto space-y-6"
    >
      {/* Back button */}
      <motion.div variants={item}>
        <button
          onClick={() => navigate('/historia')}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a historias
        </button>
      </motion.div>

      {/* Hero image */}
      <motion.div variants={item}>
        {story.imageUrl ? (
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <img
              src={story.imageUrl}
              alt={story.title}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md ${
                  story.isActive
                    ? 'bg-emerald-500/20 text-emerald-100 ring-1 ring-emerald-400/30'
                    : 'bg-red-500/20 text-red-100 ring-1 ring-red-400/30'
                }`}
              >
                {story.isActive ? 'Activa' : 'Inactiva'}
              </span>
            </div>
          </div>
        ) : (
          <div className="relative rounded-2xl h-48 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 flex items-center justify-center border">
            <ImageIcon className="h-16 w-16 text-muted-foreground/20" />
            <div className="absolute top-4 right-4">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  story.isActive
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : 'bg-red-500/15 text-red-700 dark:text-red-300'
                }`}
              >
                {story.isActive ? 'Activa' : 'Inactiva'}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Title */}
      <motion.h1 variants={item} className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
        {story.title}
      </motion.h1>

      {/* Meta info */}
      <motion.div variants={item} className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {story.author && (
          <div className="inline-flex items-center gap-2 rounded-xl border bg-background/60 px-3 py-2">
            <User className="h-4 w-4 text-primary" />
            <span className="font-medium">{story.author}</span>
          </div>
        )}
        {story.category && (
          <div className="inline-flex items-center gap-2 rounded-xl border bg-background/60 px-3 py-2">
            <Tag className="h-4 w-4 text-violet-500" />
            <span className="font-medium">{story.category}</span>
          </div>
        )}
        <div className="inline-flex items-center gap-2 rounded-xl border bg-background/60 px-3 py-2">
          <Calendar className="h-4 w-4 text-amber-500" />
          <span className="font-medium">{formatDate(story.createdAt)}</span>
        </div>
        {story.updatedAt !== story.createdAt && (
          <div className="inline-flex items-center gap-2 rounded-xl border bg-background/60 px-3 py-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Actualizada {formatDate(story.updatedAt)} a las {formatTime(story.updatedAt)}</span>
          </div>
        )}
      </motion.div>

      {/* Tags */}
      {story.tags.length > 0 && (
        <motion.div variants={item} className="flex flex-wrap gap-2">
          {story.tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        variants={item}
        className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 md:p-8 shadow-sm"
      >
        <div
          className="prose prose-sm md:prose-base max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: story.content }}
        />
      </motion.div>

      {/* Actions bar */}
      <motion.div
        variants={item}
        className="flex flex-wrap items-center gap-3 rounded-2xl border bg-card/70 backdrop-blur-sm p-4 shadow-sm"
      >
        <button
          onClick={() => navigate(`/historia/${story.id}/editar`)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 border border-primary/30 transition-all"
        >
          <Pencil className="h-4 w-4" />
          Editar
        </button>
        <button
          onClick={handleToggleActive}
          disabled={togglingActive}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            story.isActive
              ? 'text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 border border-amber-300/30'
              : 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 border border-emerald-300/30'
          }`}
        >
          {togglingActive ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : story.isActive ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          {story.isActive ? 'Ocultar historia' : 'Mostrar historia'}
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setConfirmDelete(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 border border-red-300/30 transition-all"
        >
          <Trash2 className="h-4 w-4" />
          Eliminar
        </button>
      </motion.div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setConfirmDelete(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-md rounded-3xl border bg-card/95 p-8 shadow-2xl backdrop-blur-xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <AlertTriangle className="h-7 w-7 text-red-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">¿Eliminar historia?</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Esta acción no se puede deshacer. La historia será eliminada permanentemente.
                </p>
                <div className="flex items-center gap-3 w-full">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border text-sm font-medium hover:bg-muted/50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-all inline-flex items-center justify-center gap-2"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Sí, eliminar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default HistoriaDetailPage
