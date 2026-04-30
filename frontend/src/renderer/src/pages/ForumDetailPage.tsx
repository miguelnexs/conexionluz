import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '@/api/client'
import {
  ArrowLeft,
  MessageSquareText,
  Calendar,
  Eye,
  EyeOff,
  Trash2,
  Loader2,
  AlertTriangle,
  Clock,
  Pin,
  Lock,
  MessageCircle,
  Send,
  User
} from 'lucide-react'
import type React from 'react'

interface ForumReply {
  id: number
  topicId: number
  content: string
  authorName: string
  patientId: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

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
  replies: ForumReply[]
}

export function ForumDetailPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [topic, setTopic] = useState<ForumTopic | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [togglingActive, setTogglingActive] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deletingReplyId, setDeletingReplyId] = useState<number | null>(null)

  // Admin reply form
  const [replyContent, setReplyContent] = useState('')
  const [replyAuthor, setReplyAuthor] = useState('Administrador')
  const [sendingReply, setSendingReply] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const res = await api.get<ForumTopic>(`/api/forum/${id}/`)
      if (!res.ok) {
        setError(res.error)
        setLoading(false)
        return
      }
      setTopic(res.data)
      setLoading(false)
    }
    load()
  }, [id])

  const handleToggleActive = async () => {
    if (!topic) return
    setTogglingActive(true)
    const res = await api.patch<ForumTopic>(`/api/forum/${topic.id}/`, { isActive: !topic.isActive })
    if (res.ok) {
      setTopic({ ...topic, isActive: !topic.isActive })
    }
    setTogglingActive(false)
  }

  const handleDelete = async () => {
    if (!topic) return
    setDeleting(true)
    const res = await api.del(`/api/forum/${topic.id}/`)
    if (res.ok) {
      navigate('/foro')
    }
    setDeleting(false)
    setConfirmDelete(false)
  }

  const handleDeleteReply = async (replyId: number) => {
    setDeletingReplyId(replyId)
    const res = await api.del(`/api/forum/replies/${replyId}/`)
    if (res.ok && topic) {
      setTopic({
        ...topic,
        replies: topic.replies.filter((r) => r.id !== replyId),
        repliesCount: topic.repliesCount - 1
      })
    }
    setDeletingReplyId(null)
  }

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic || !replyContent.trim()) return
    setSendingReply(true)
    const res = await api.post<ForumReply>(`/api/forum/${topic.id}/replies/`, {
      content: replyContent.trim(),
      authorName: replyAuthor.trim() || 'Administrador'
    })
    if (res.ok) {
      setTopic({
        ...topic,
        replies: [...topic.replies, res.data],
        repliesCount: topic.repliesCount + 1
      })
      setReplyContent('')
    }
    setSendingReply(false)
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

  const formatShortDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })

  const item = { hidden: { y: 16, opacity: 0 }, show: { y: 0, opacity: 1 } }

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        <div className="h-8 w-32 bg-muted/50 rounded-lg animate-pulse" />
        <div className="h-48 rounded-2xl bg-muted/50 animate-pulse" />
        <div className="h-10 w-3/4 bg-muted/50 rounded-xl animate-pulse" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-muted/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/foro')}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al foro
        </button>
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border bg-card/70 backdrop-blur-sm">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <MessageSquareText className="h-7 w-7 text-destructive" />
          </div>
          <p className="text-lg font-medium mb-1">Tema no encontrado</p>
          <p className="text-sm text-muted-foreground">{error || 'El tema que buscas no existe o fue eliminado.'}</p>
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
          onClick={() => navigate('/foro')}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al foro
        </button>
      </motion.div>

      {/* Topic header */}
      <motion.div variants={item} className="rounded-2xl border bg-card/70 backdrop-blur-sm shadow-sm overflow-hidden">
        {topic.imageUrl && (
          <div className="relative h-52 md:h-64 overflow-hidden">
            <img src={topic.imageUrl} alt={topic.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}
        <div className="p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-border shrink-0">
            <MessageSquareText className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {topic.isPinned && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                  <Pin className="h-3 w-3" /> Fijado
                </span>
              )}
              {topic.isLocked && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-red-700 dark:text-red-300">
                  <Lock className="h-3 w-3" /> Bloqueado
                </span>
              )}
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  topic.isActive
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : 'bg-red-500/15 text-red-700 dark:text-red-300'
                }`}
              >
                {topic.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-3">{topic.title}</h1>

            {topic.description && (
              <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {topic.category && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {topic.category}
                </span>
              )}
              <div className="inline-flex items-center gap-2 rounded-xl border bg-background/60 px-3 py-2">
                <MessageCircle className="h-4 w-4 text-violet-500" />
                <span className="font-medium">{topic.repliesCount} respuesta{topic.repliesCount !== 1 ? 's' : ''}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border bg-background/60 px-3 py-2">
                <Calendar className="h-4 w-4 text-amber-500" />
                <span className="font-medium">{formatDate(topic.createdAt)}</span>
              </div>
              {topic.updatedAt !== topic.createdAt && (
                <div className="inline-flex items-center gap-2 rounded-xl border bg-background/60 px-3 py-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Actualizado {formatShortDate(topic.updatedAt)} a las {formatTime(topic.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </motion.div>

      {/* Replies */}
      <motion.div variants={item}>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Respuestas ({topic.replies.length})
        </h2>

        {topic.replies.length === 0 ? (
          <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-8 text-center">
            <p className="text-muted-foreground text-sm">Aún no hay respuestas en este tema.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topic.replies.map((reply, index) => (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm ${!reply.isActive ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{reply.authorName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatShortDate(reply.createdAt)} a las {formatTime(reply.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteReply(reply.id)}
                    disabled={deletingReplyId === reply.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    {deletingReplyId === reply.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-sm mt-3 whitespace-pre-wrap">{reply.content}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Admin reply form */}
      {!topic.isLocked && (
        <motion.div variants={item}>
          <form onSubmit={handleSendReply} className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Send className="h-4 w-4 text-primary" />
              Responder como administrador
            </h3>
            <input
              type="text"
              value={replyAuthor}
              onChange={(e) => setReplyAuthor(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border bg-background/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              placeholder="Nombre del autor"
            />
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border bg-background/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
              placeholder="Escribe una respuesta..."
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={sendingReply || !replyContent.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-sm font-medium disabled:opacity-50"
              >
                {sendingReply ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Enviar respuesta
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Actions bar */}
      <motion.div
        variants={item}
        className="flex flex-wrap items-center gap-3 rounded-2xl border bg-card/70 backdrop-blur-sm p-4 shadow-sm"
      >
        <button
          onClick={() => navigate(`/foro/${topic.id}/editar`)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 border border-primary/30 transition-all"
        >
          Editar tema
        </button>
        <button
          onClick={handleToggleActive}
          disabled={togglingActive}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            topic.isActive
              ? 'text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 border border-amber-300/30'
              : 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 border border-emerald-300/30'
          }`}
        >
          {togglingActive ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : topic.isActive ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          {topic.isActive ? 'Ocultar tema' : 'Mostrar tema'}
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
                <h3 className="text-xl font-bold mb-2">¿Eliminar tema?</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Esta acción no se puede deshacer. El tema y todas sus respuestas serán eliminados permanentemente.
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

export default ForumDetailPage
