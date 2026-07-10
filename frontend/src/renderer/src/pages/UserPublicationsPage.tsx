import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { api, getBaseUrl } from '@/api/client'
import { 
  ArrowLeft, 
  Newspaper, 
  Trash2, 
  MessageSquare, 
  Heart, 
  Smile, 
  Calendar, 
  AlertTriangle,
  CheckCircle2,
  X,
  UserRound,
  Sparkles,
  Loader2
} from 'lucide-react'
import { cn } from '@/utils/cn'

type Patient = {
  id: number
  firstName: string
  lastName: string
  email: string
  userType?: string
  occupation?: string
  canPublish: boolean
  isActive: boolean
}

type Comment = {
  id: number
  authorName: string
  authorAvatarUrl: string
  authorRole: string
  content: string
  createdAt: string
}

type CommunityPost = {
  id: number
  patientId: number | null
  authorName: string
  authorAvatarUrl: string
  authorRole: string
  content: string
  imageUrl?: string
  feeling?: string
  likesCount: number
  commentsCount: number
  comments?: Comment[]
  isApproved: boolean
  isActive: boolean
  createdAt: string
}

const getFullImageUrl = (url?: string) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }
  const baseUrl = getBaseUrl().replace(/\/$/, '')
  const relativeUrl = url.startsWith('/') ? url : `/${url}`
  return `${baseUrl}${relativeUrl}`
}

export function UserPublicationsPage(): JSX.Element {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const patientId = id ? parseInt(id, 10) : null

  const [patient, setPatient] = useState<Patient | null>(null)
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingPost, setDeletingPost] = useState<CommunityPost | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const [approvingPostId, setApprovingPostId] = useState<number | null>(null)

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  const loadData = async () => {
    if (!patientId) return
    setLoading(true)
    setError(null)

    // Load patient details
    const patientRes = await api.get<Patient>(`/api/patients/${patientId}/`)
    if (!patientRes.ok) {
      setError(patientRes.error || 'Error al cargar los datos del usuario')
      setLoading(false)
      return
    }
    setPatient(patientRes.data)

    // Load all posts
    const postsRes = await api.get<CommunityPost[]>('/api/admin/community-posts/')
    if (!postsRes.ok) {
      setError(postsRes.error || 'Error al cargar las publicaciones')
      setLoading(false)
      return
    }

    // Filter by patient ID
    const userPosts = postsRes.data.filter(p => p.patientId === patientId)
    setPosts(userPosts)
    setLoading(false)
  }

  useEffect(() => {
    void loadData()
  }, [patientId])

  const handleDelete = async (post: CommunityPost) => {
    setIsDeleting(true)
    const res = await api.del(`/api/admin/community-posts/${post.id}/`)
    if (res.ok) {
      setPosts(prev => prev.filter(p => p.id !== post.id))
      showToast('Publicación eliminada correctamente.', true)
    } else {
      showToast('Error al eliminar la publicación.', false)
    }
    setIsDeleting(false)
    setDeletingPost(null)
  }

  const handleApprove = async (post: CommunityPost) => {
    setApprovingPostId(post.id)
    const res = await api.patch<{ ok: boolean; data: any }>(`/api/admin/community-posts/${post.id}/`, {
      isApproved: true
    })
    if (res.ok) {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, isApproved: true } : p))
      showToast('Publicación aprobada con éxito.', true)
    } else {
      showToast('Error al aprobar la publicación.', false)
    }
    setApprovingPostId(null)
  }

  const fullName = patient ? `${patient.firstName} ${patient.lastName}`.trim() : ''
  const initials = patient ? `${patient.firstName?.[0] || ''}${patient.lastName?.[0] || ''}`.toUpperCase() : ''

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/publicaciones')}
          className="h-10 w-10 rounded-2xl border bg-card hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0 shadow-sm"
          title="Regresar a publicaciones"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Publicaciones de Usuario</h2>
          <p className="text-muted-foreground text-sm">
            Ver y moderar el contenido publicado por este miembro.
          </p>
        </div>
      </div>

      {loading && (
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card/70 p-6 flex items-center gap-4 animate-pulse">
            <div className="h-14 w-14 rounded-2xl bg-muted shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-48 bg-muted rounded" />
              <div className="h-3.5 w-32 bg-muted rounded" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border bg-card/70 p-6 space-y-4 animate-pulse h-48" />
            ))}
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3">{error}</div>
      )}

      {!loading && patient && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* User profile card */}
          <div className="rounded-2xl border border-violet-300/40 dark:border-violet-700/30 bg-violet-500/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-violet-500/15 text-violet-600 dark:text-violet-400 ring-1 ring-violet-300/50 dark:ring-violet-700/50 flex items-center justify-center font-bold text-lg shrink-0">
                {initials || <UserRound className="h-6 w-6" />}
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-xl truncate">{fullName}</div>
                <div className="text-sm text-muted-foreground truncate">{patient.email}</div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider rounded-full px-2.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                    {patient.userType || 'Miembro'}
                  </span>
                  {patient.occupation && (
                    <span className="text-[10px] text-muted-foreground bg-muted rounded-full px-2.5 py-0.5 max-w-[200px] truncate">
                      {patient.occupation}
                    </span>
                  )}
                  {patient.canPublish ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider rounded-full px-2.5 py-0.5">
                      <Sparkles className="h-2.5 w-2.5" />
                      Editor Habilitado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider rounded-full px-2.5 py-0.5">
                      Sin Permiso de Publicación
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-foreground">Total Publicaciones</div>
                <div className="text-2xl font-black text-violet-600 dark:text-violet-400">{posts.length}</div>
              </div>
            </div>
          </div>

          {/* Posts list */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-muted-foreground" />
              Publicaciones creadas ({posts.length})
            </h3>

            {posts.length === 0 ? (
              <div className="rounded-2xl border bg-card/50 p-12 text-center text-muted-foreground">
                Este usuario aún no ha realizado ninguna publicación en la comunidad.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                <AnimatePresence>
                  {posts.map(post => {
                    const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })

                    return (
                      <motion.div
                        key={post.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="rounded-2xl border bg-card/85 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200"
                      >
                        <div className="space-y-4">
                          {/* Post Meta */}
                          <div className="flex items-center justify-between gap-2 border-b pb-3">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{formattedDate}</span>
                              {post.isApproved ? (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                  Aprobado
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse">
                                  Pendiente
                                </span>
                              )}
                            </div>
                            {post.feeling && (
                              <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full px-2 py-0.5">
                                <Smile className="h-3.5 w-3.5" />
                                <span>{post.feeling}</span>
                              </div>
                            )}
                          </div>

                          {/* Post Content */}
                          <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line font-medium">
                            {post.content}
                          </p>

                          {/* Post Image */}
                          {post.imageUrl && (
                            <div className="rounded-xl overflow-hidden border max-h-48 flex items-center justify-center bg-muted/30">
                              <img 
                                src={getFullImageUrl(post.imageUrl)} 
                                alt="Adjunto de publicación" 
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                        </div>

                        {/* Post Footer / Actions */}
                        <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-border/60">
                          <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4 text-rose-500/70" />
                              {post.likesCount} me gusta
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {post.commentsCount} comentarios
                            </span>
                          </div>

                          <div className="flex gap-2">
                            {!post.isApproved && (
                              <button
                                type="button"
                                onClick={() => handleApprove(post)}
                                disabled={approvingPostId === post.id}
                                className="h-8 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 text-xs font-bold"
                                title="Aprobar publicación"
                              >
                                {approvingPostId === post.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                )}
                                Aprobar
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setDeletingPost(post)}
                              className="h-8 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold"
                              title="Eliminar publicación"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.25 }}
              className="relative w-full max-w-sm rounded-3xl border bg-card/95 p-8 shadow-2xl backdrop-blur-xl mx-4"
            >
              <button
                onClick={() => setDeletingPost(null)}
                className="absolute right-5 top-5 rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors"
                disabled={isDeleting}
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col items-center text-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-sm">
                  <AlertTriangle className="h-8 w-8" />
                </div>

                <div>
                  <h3 className="text-xl font-bold tracking-tight">¿Eliminar publicación?</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Esta acción no se puede deshacer y removerá permanentemente la publicación del feed de la comunidad.
                  </p>
                </div>

                <div className="flex w-full gap-3 mt-2">
                  <button
                    onClick={() => setDeletingPost(null)}
                    className="flex-1 h-10 rounded-xl border font-semibold text-sm hover:bg-muted transition-colors"
                    disabled={isDeleting}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => void handleDelete(deletingPost)}
                    className="flex-1 h-10 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                        className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      'Sí, eliminar'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              'fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border px-4 py-3 shadow-xl text-sm font-semibold',
              toast.ok
                ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-destructive/10 border-destructive/30 text-destructive'
            )}
          >
            {toast.ok ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
