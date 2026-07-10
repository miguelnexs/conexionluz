import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { api } from '@/api/client'
import {
  MessageSquareText,
  Plus,
  Search,
  LayoutGrid,
  LayoutList,
  Eye,
  EyeOff,
  Trash2,
  Calendar,
  AlertTriangle,
  Loader2,
  Filter,
  Sparkles,
  Pin,
  Lock,
  MessageCircle,
  Unlock,
  ImageIcon
} from 'lucide-react'

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

type FilterMode = 'all' | 'active' | 'inactive'

export function ForumPage(): JSX.Element {
  const navigate = useNavigate()
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('forum-view') as 'grid' | 'list') || 'grid'
  })
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const loadTopics = async () => {
    setLoading(true)
    const res = await api.get<ForumTopic[]>('/api/forum/')
    if (!res.ok) {
      setError(res.error)
      setLoading(false)
      return
    }
    setTopics(res.data)
    setLoading(false)
  }

  useEffect(() => {
    loadTopics()
  }, [])

  useEffect(() => {
    localStorage.setItem('forum-view', viewMode)
  }, [viewMode])

  const stats = useMemo(() => {
    const active = topics.filter((t) => t.isActive).length
    const categories = new Set(topics.map((t) => t.category).filter(Boolean))
    const totalReplies = topics.reduce((sum, t) => sum + t.repliesCount, 0)
    return { total: topics.length, active, inactive: topics.length - active, categories: categories.size, totalReplies }
  }, [topics])

  const filteredTopics = useMemo(() => {
    let list = topics
    if (filterMode === 'active') list = list.filter((t) => t.isActive)
    if (filterMode === 'inactive') list = list.filter((t) => !t.isActive)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      )
    }
    return list
  }, [topics, filterMode, search])

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    const res = await api.del(`/api/forum/${id}/`)
    if (res.ok) {
      setTopics((prev) => prev.filter((t) => t.id !== id))
    }
    setDeletingId(null)
    setConfirmDeleteId(null)
  }

  const handleToggleActive = async (topic: ForumTopic) => {
    setTogglingId(topic.id)
    const res = await api.patch<ForumTopic>(`/api/forum/${topic.id}/`, { isActive: !topic.isActive })
    if (res.ok) {
      setTopics((prev) => prev.map((t) => (t.id === topic.id ? { ...t, isActive: !t.isActive } : t)))
    }
    setTogglingId(null)
  }

  const handleTogglePin = async (topic: ForumTopic) => {
    const res = await api.patch<ForumTopic>(`/api/forum/${topic.id}/`, { isPinned: !topic.isPinned })
    if (res.ok) {
      setTopics((prev) => prev.map((t) => (t.id === topic.id ? { ...t, isPinned: !t.isPinned } : t)))
    }
  }

  const handleToggleLock = async (topic: ForumTopic) => {
    const res = await api.patch<ForumTopic>(`/api/forum/${topic.id}/`, { isLocked: !topic.isLocked })
    if (res.ok) {
      setTopics((prev) => prev.map((t) => (t.id === topic.id ? { ...t, isLocked: !t.isLocked } : t)))
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
  const item = { hidden: { y: 16, opacity: 0 }, show: { y: 0, opacity: 1 } }

  const StatCard = ({
    icon: Icon,
    label,
    value,
    accent
  }: {
    icon: React.ElementType
    label: string
    value: string | number
    accent: string
  }) => (
    <motion.div
      variants={item}
      className="rounded-2xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm flex items-center gap-4"
    >
      <div className={`h-11 w-11 rounded-2xl ${accent} flex items-center justify-center ring-1 ring-border`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        <div className="h-10 w-48 bg-muted/50 rounded-xl animate-pulse mx-auto" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted/50 animate-pulse" />
          ))}
        </div>
        <div className="h-12 rounded-2xl bg-muted/50 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-muted/50 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-border">
            <MessageSquareText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Foro de Discusión</h1>
            <p className="text-sm text-muted-foreground">Gestiona los temas del foro</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/foro/nuevo')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-sm"
        >
          <Plus className="h-4 w-4" />
          Nuevo Tema
        </button>
      </motion.div>

      {error && (
        <motion.div
          variants={item}
          className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-center text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Stats */}
      <motion.div variants={container} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={MessageSquareText} label="Total temas" value={stats.total} accent="bg-primary/10 text-primary" />
        <StatCard icon={Eye} label="Activos" value={stats.active} accent="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" />
        <StatCard icon={MessageCircle} label="Respuestas" value={stats.totalReplies} accent="bg-violet-500/10 text-violet-600 dark:text-violet-400" />
        <StatCard icon={Filter} label="Categorías" value={stats.categories} accent="bg-amber-500/10 text-amber-600 dark:text-amber-400" />
      </motion.div>

      {/* Search + Filters + View toggle */}
      <motion.div variants={item} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por título, descripción o categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background/80 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        <div className="flex items-center gap-1 rounded-xl border bg-background/80 p-1">
          {([
            { key: 'all' as FilterMode, label: 'Todos' },
            { key: 'active' as FilterMode, label: 'Activos' },
            { key: 'inactive' as FilterMode, label: 'Inactivos' }
          ]).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterMode(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterMode === f.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-xl border bg-background/80 p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'grid' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutList className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* Result count */}
      <motion.p variants={item} className="text-xs text-muted-foreground flex items-center gap-1.5">
        <Filter className="h-3.5 w-3.5" />
        {filteredTopics.length} tema{filteredTopics.length !== 1 ? 's' : ''}
        {search || filterMode !== 'all' ? ' encontrado' + (filteredTopics.length !== 1 ? 's' : '') : ''}
      </motion.p>

      {/* Topics Grid / List */}
      {filteredTopics.length === 0 ? (
        <motion.div
          variants={item}
          className="col-span-full flex flex-col items-center justify-center py-20 rounded-2xl border bg-card/70 backdrop-blur-sm"
        >
          <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Sparkles className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium mb-1">No se encontraron temas</p>
          <p className="text-sm text-muted-foreground mb-6">
            {search ? 'Intenta con otros términos de búsqueda' : 'Comienza creando tu primer tema de discusión'}
          </p>
          {!search && (
            <button
              onClick={() => navigate('/foro/nuevo')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Crear Tema
            </button>
          )}
        </motion.div>
      ) : viewMode === 'grid' ? (
        <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <motion.div
              key={topic.id}
              variants={item}
              layout
              className={`rounded-2xl border bg-card/70 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/20 group overflow-hidden flex flex-col ${
                !topic.isActive ? 'opacity-60' : ''
              }`}
            >
              {/* Image */}
              <div className="cursor-pointer" onClick={() => navigate(`/foro/${topic.id}`)}>
                {topic.imageUrl ? (
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={topic.imageUrl}
                      alt={topic.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                ) : (
                  <div className="h-24 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                    <MessageSquareText className="h-8 w-8 text-muted-foreground/20" />
                  </div>
                )}
              </div>

              {/* Header area */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {topic.isPinned && <Pin className="h-3.5 w-3.5 text-amber-500" />}
                    {topic.isLocked && <Lock className="h-3.5 w-3.5 text-red-400" />}
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
                </div>

                <h2
                  className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2 cursor-pointer"
                  onClick={() => navigate(`/foro/${topic.id}`)}
                >
                  {topic.title}
                </h2>

                {topic.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{topic.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-xs text-muted-foreground">
                  {topic.category && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                      {topic.category}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {topic.repliesCount} respuesta{topic.repliesCount !== 1 ? 's' : ''}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(topic.createdAt)}
                  </span>
                </div>

                <div className="flex-1" />

                {/* Actions */}
                <div className="flex items-center gap-1 pt-3 border-t flex-wrap">
                  <button
                    onClick={() => handleTogglePin(topic)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      topic.isPinned
                        ? 'text-amber-700 dark:text-amber-300 hover:bg-amber-500/10'
                        : 'text-muted-foreground hover:bg-muted/50'
                    }`}
                    title={topic.isPinned ? 'Desfijar' : 'Fijar'}
                  >
                    <Pin className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleToggleLock(topic)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      topic.isLocked
                        ? 'text-red-600 dark:text-red-400 hover:bg-red-500/10'
                        : 'text-muted-foreground hover:bg-muted/50'
                    }`}
                    title={topic.isLocked ? 'Desbloquear' : 'Bloquear'}
                  >
                    {topic.isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => handleToggleActive(topic)}
                    disabled={togglingId === topic.id}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      topic.isActive
                        ? 'text-amber-700 dark:text-amber-300 hover:bg-amber-500/10'
                        : 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10'
                    }`}
                  >
                    {togglingId === topic.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : topic.isActive ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={() => setConfirmDeleteId(topic.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={container} className="space-y-3">
          {filteredTopics.map((topic) => (
            <motion.div
              key={topic.id}
              variants={item}
              layout
              className={`rounded-2xl border bg-card/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20 flex gap-4 p-4 ${
                !topic.isActive ? 'opacity-60' : ''
              }`}
            >
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                {topic.imageUrl ? (
                  <img src={topic.imageUrl} alt={topic.title} className="w-full h-full object-cover" />
                ) : (
                  <MessageSquareText className="h-6 w-6 text-primary" />
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h2
                    className="text-base font-semibold truncate cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/foro/${topic.id}`)}
                  >{topic.title}</h2>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {topic.isPinned && <Pin className="h-3.5 w-3.5 text-amber-500" />}
                    {topic.isLocked && <Lock className="h-3.5 w-3.5 text-red-400" />}
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        topic.isActive
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                          : 'bg-red-500/15 text-red-700 dark:text-red-300'
                      }`}
                    >
                      {topic.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>

                {topic.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{topic.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
                  {topic.category && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                      {topic.category}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {topic.repliesCount} respuesta{topic.repliesCount !== 1 ? 's' : ''}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(topic.createdAt)}
                  </span>
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-2 mt-3">
                  <button
                    className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                    onClick={() => navigate(`/foro/${topic.id}`)}
                  >
                    Ver tema
                  </button>
                  <div className="flex-1" />
                  <button onClick={() => handleTogglePin(topic)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-all" title={topic.isPinned ? 'Desfijar' : 'Fijar'}>
                    <Pin className={`h-3.5 w-3.5 ${topic.isPinned ? 'text-amber-500' : ''}`} />
                  </button>
                  <button onClick={() => handleToggleLock(topic)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-all" title={topic.isLocked ? 'Desbloquear' : 'Bloquear'}>
                    {topic.isLocked ? <Lock className="h-3.5 w-3.5 text-red-400" /> : <Unlock className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => handleToggleActive(topic)}
                    disabled={togglingId === topic.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      topic.isActive
                        ? 'text-amber-700 dark:text-amber-300 hover:bg-amber-500/10'
                        : 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10'
                    }`}
                  >
                    {togglingId === topic.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : topic.isActive ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(topic.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmDeleteId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setConfirmDeleteId(null)}
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
                    onClick={() => setConfirmDeleteId(null)}
                    className="flex-1 px-4 py-2.5 rounded-xl border text-sm font-medium hover:bg-muted/50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleDelete(confirmDeleteId)}
                    disabled={deletingId === confirmDeleteId}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-all inline-flex items-center justify-center gap-2"
                  >
                    {deletingId === confirmDeleteId ? (
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

export default ForumPage
