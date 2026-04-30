import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { api } from '@/api/client'
import {
  BookOpen,
  Plus,
  Search,
  LayoutGrid,
  LayoutList,
  Eye,
  EyeOff,
  Trash2,
  ChevronDown,
  User,
  Tag,
  Calendar,
  AlertTriangle,
  ImageIcon,
  Loader2,
  Filter,
  Sparkles
} from 'lucide-react'

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

type FilterMode = 'all' | 'active' | 'inactive'

export function HistoriaPage(): JSX.Element {
  const navigate = useNavigate()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('historias-view') as 'grid' | 'list') || 'grid'
  })
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const loadStories = async () => {
    setLoading(true)
    const res = await api.get<Story[]>('/api/stories/')
    if (!res.ok) {
      setError(res.error)
      setLoading(false)
      return
    }
    setStories(res.data)
    setLoading(false)
  }

  useEffect(() => {
    loadStories()
  }, [])

  useEffect(() => {
    localStorage.setItem('historias-view', viewMode)
  }, [viewMode])

  // --- Stats ---
  const stats = useMemo(() => {
    const active = stories.filter((s) => s.isActive).length
    const categories = new Set(stories.map((s) => s.category).filter(Boolean))
    const lastUpdated = stories.length
      ? new Date(
          Math.max(...stories.map((s) => new Date(s.updatedAt).getTime()))
        ).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
      : '—'
    return { total: stories.length, active, inactive: stories.length - active, categories: categories.size, lastUpdated }
  }, [stories])

  // --- Filtered stories ---
  const filteredStories = useMemo(() => {
    let list = stories
    if (filterMode === 'active') list = list.filter((s) => s.isActive)
    if (filterMode === 'inactive') list = list.filter((s) => !s.isActive)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.author.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    return list
  }, [stories, filterMode, search])

  // --- Actions ---
  const handleDelete = async (id: number) => {
    setDeletingId(id)
    const res = await api.del(`/api/stories/${id}/`)
    if (res.ok) {
      setStories((prev) => prev.filter((s) => s.id !== id))
    }
    setDeletingId(null)
    setConfirmDeleteId(null)
  }

  const handleToggleActive = async (story: Story) => {
    setTogglingId(story.id)
    const res = await api.patch<Story>(`/api/stories/${story.id}/`, { isActive: !story.isActive })
    if (res.ok) {
      setStories((prev) => prev.map((s) => (s.id === story.id ? { ...s, isActive: !s.isActive } : s)))
    }
    setTogglingId(null)
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })

  // --- Framer variants ---
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
  const item = { hidden: { y: 16, opacity: 0 }, show: { y: 0, opacity: 1 } }

  // --- Stat card component ---
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

  // --- Loading skeleton ---
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
            <div key={i} className="h-72 rounded-2xl bg-muted/50 animate-pulse" />
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
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Historias</h1>
            <p className="text-sm text-muted-foreground">Gestiona las historias publicadas</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/historia/nueva')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-sm"
        >
          <Plus className="h-4 w-4" />
          Nueva Historia
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
        <StatCard icon={BookOpen} label="Total" value={stats.total} accent="bg-primary/10 text-primary" />
        <StatCard icon={Eye} label="Activas" value={stats.active} accent="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" />
        <StatCard icon={Tag} label="Categorías" value={stats.categories} accent="bg-violet-500/10 text-violet-600 dark:text-violet-400" />
        <StatCard icon={Calendar} label="Última actualización" value={stats.lastUpdated} accent="bg-amber-500/10 text-amber-600 dark:text-amber-400" />
      </motion.div>

      {/* Search + Filters + View toggle */}
      <motion.div variants={item} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por título, autor, categoría o etiqueta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background/80 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 rounded-xl border bg-background/80 p-1">
          {([
            { key: 'all' as FilterMode, label: 'Todas' },
            { key: 'active' as FilterMode, label: 'Activas' },
            { key: 'inactive' as FilterMode, label: 'Inactivas' }
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

        {/* View toggle */}
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
        {filteredStories.length} historia{filteredStories.length !== 1 ? 's' : ''}
        {search || filterMode !== 'all' ? ' encontrada' + (filteredStories.length !== 1 ? 's' : '') : ''}
      </motion.p>

      {/* Stories Grid / List */}
      {filteredStories.length === 0 ? (
        <motion.div
          variants={item}
          className="col-span-full flex flex-col items-center justify-center py-20 rounded-2xl border bg-card/70 backdrop-blur-sm"
        >
          <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Sparkles className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium mb-1">No se encontraron historias</p>
          <p className="text-sm text-muted-foreground mb-6">
            {search ? 'Intenta con otros términos de búsqueda' : 'Comienza creando tu primera historia'}
          </p>
          {!search && (
            <button
              onClick={() => navigate('/historia/nueva')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Crear Historia
            </button>
          )}
        </motion.div>
      ) : viewMode === 'grid' ? (
        /* ===================== GRID VIEW ===================== */
        <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <motion.div
              key={story.id}
              variants={item}
              layout
              className={`rounded-2xl border bg-card/70 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/20 group overflow-hidden flex flex-col ${
                !story.isActive ? 'opacity-60' : ''
              }`}
            >
              {/* Image - clickable */}
              <div className="cursor-pointer" onClick={() => navigate(`/historia/${story.id}`)}>
              {story.imageUrl ? (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-md ${
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
                <div className="relative h-32 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                  <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
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
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h2
                  className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2 cursor-pointer"
                  onClick={() => navigate(`/historia/${story.id}`)}
                >
                  {story.title}
                </h2>

                {/* Author & category */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-xs text-muted-foreground">
                  {story.author && (
                    <span className="inline-flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {story.author}
                    </span>
                  )}
                  {story.category && (
                    <span className="inline-flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {story.category}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(story.createdAt)}
                  </span>
                </div>

                {/* Tags */}
                {story.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {story.tags.slice(0, 4).map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                    {story.tags.length > 4 && (
                      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                        +{story.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* View full story */}
                <button
                  className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline mb-3 w-fit"
                  onClick={() => navigate(`/historia/${story.id}`)}
                >
                  Ver historia completa <ChevronDown className="h-3 w-3" />
                </button>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t">
                  <button
                    onClick={() => handleToggleActive(story)}
                    disabled={togglingId === story.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      story.isActive
                        ? 'text-amber-700 dark:text-amber-300 hover:bg-amber-500/10'
                        : 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10'
                    }`}
                  >
                    {togglingId === story.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : story.isActive ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                    {story.isActive ? 'Ocultar' : 'Mostrar'}
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={() => setConfirmDeleteId(story.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* ===================== LIST VIEW ===================== */
        <motion.div variants={container} className="space-y-3">
          {filteredStories.map((story) => (
            <motion.div
              key={story.id}
              variants={item}
              layout
              className={`rounded-2xl border bg-card/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20 flex gap-4 p-4 ${
                !story.isActive ? 'opacity-60' : ''
              }`}
            >
              {/* Thumbnail */}
              {story.imageUrl ? (
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  className="w-28 h-28 object-cover rounded-xl shrink-0 hidden sm:block"
                />
              ) : (
                <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center shrink-0 hidden sm:block">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h2
                    className="text-base font-semibold truncate cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/historia/${story.id}`)}
                  >{story.title}</h2>
                  <span
                    className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      story.isActive
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                        : 'bg-red-500/15 text-red-700 dark:text-red-300'
                    }`}
                  >
                    {story.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                  {story.author && (
                    <span className="inline-flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {story.author}
                    </span>
                  )}
                  {story.category && (
                    <span className="inline-flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {story.category}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(story.createdAt)}
                  </span>
                </div>

                {story.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {story.tags.slice(0, 5).map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                    {story.tags.length > 5 && (
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                        +{story.tags.length - 5}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex-1" />

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                    onClick={() => navigate(`/historia/${story.id}`)}
                  >
                    Ver completa
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={() => handleToggleActive(story)}
                    disabled={togglingId === story.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      story.isActive
                        ? 'text-amber-700 dark:text-amber-300 hover:bg-amber-500/10'
                        : 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10'
                    }`}
                  >
                    {togglingId === story.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : story.isActive ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                    {story.isActive ? 'Ocultar' : 'Mostrar'}
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(story.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Eliminar
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
                <h3 className="text-xl font-bold mb-2">¿Eliminar historia?</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Esta acción no se puede deshacer. La historia será eliminada permanentemente.
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

export default HistoriaPage
