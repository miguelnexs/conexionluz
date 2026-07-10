
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '@/api/client'
import {
  ArrowLeft,
  MessageSquareText,
  Loader2,
  Save,
  ImageIcon,
  X,
  Upload,
  Layout,
  Settings,
  Eye,
  Info,
  Pin,
  Lock,
  EyeOff,
  Maximize2
} from 'lucide-react'
import type React from 'react'

interface ForumTopic {
  id: number
  title: string
  description: string
  descriptionHtml: string
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
  const [descriptionHtml, setDescriptionHtml] = useState('')
  const [category, setCategory] = useState('')
  const [isPinned, setIsPinned] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [activeTab, setActiveTab] = useState<'text' | 'html'>('text')
  const [showFullPreview, setShowFullPreview] = useState(false)

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
      setDescriptionHtml(res.data.descriptionHtml || '')
      setCategory(res.data.category)
      setIsPinned(res.data.isPinned)
      setIsLocked(res.data.isLocked)
      setIsActive(res.data.isActive)
      if (res.data.imageUrl) setImagePreview(res.data.imageUrl)
      if (res.data.descriptionHtml) setActiveTab('html')
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
    fd.append('descriptionHtml', descriptionHtml)
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

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const item = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
        <div className="h-8 w-32 bg-muted/50 rounded-lg animate-pulse" />
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
           <div className="space-y-4">
              <div className="h-14 bg-muted/50 rounded-2xl animate-pulse" />
              <div className="h-64 bg-muted/50 rounded-2xl animate-pulse" />
           </div>
           <div className="h-96 bg-muted/50 rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 max-w-7xl mx-auto space-y-8"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <motion.button
            variants={item}
            onClick={() => navigate('/foro')}
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all"
          >
            <div className="p-1 rounded-md bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
            </div>
            Volver al foro
          </motion.button>
          
          <motion.div variants={item} className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-3xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20 shadow-inner">
              <MessageSquareText className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight leading-none mb-1">
                {mode === 'create' ? 'Nuevo Tema' : 'Editar Tema'}
              </h1>
              <p className="text-sm text-muted-foreground">
                Configura el contenido y la visibilidad del foro
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div variants={item} className="flex items-center gap-3 self-end md:self-center">
          <button
            type="button"
            onClick={() => setShowFullPreview(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border bg-background hover:bg-muted font-bold text-sm transition-all"
          >
            <Maximize2 className="h-4 w-4" />
            Vista Previa
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all duration-300 shadow-xl shadow-primary/20 hover:shadow-primary/30 font-black text-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {mode === 'create' ? 'Publicar Tema' : 'Guardar Cambios'}
          </button>
        </motion.div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-3xl bg-destructive/10 border border-destructive/20 text-destructive text-center text-sm font-bold flex items-center justify-center gap-3"
        >
          <Info className="h-4 w-4" />
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Main content column */}
        <div className="space-y-6">
          <motion.div variants={item} className="rounded-3xl border bg-card/60 backdrop-blur-xl p-8 shadow-sm space-y-6 border-primary/5">
            <div className="flex items-center gap-3 pb-4 border-b border-muted">
              <Layout className="h-5 w-5 text-primary" />
              <h3 className="font-black text-lg">Contenido Principal</h3>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Título del Tema</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-5 py-4 rounded-2xl border bg-background/50 text-base font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-muted-foreground/30"
                  placeholder="¿De qué trata esta discusión?"
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cuerpo del Tema</label>
                  <div className="flex bg-muted/50 rounded-xl p-1 scale-90 origin-right border">
                    <button
                      type="button"
                      onClick={() => setActiveTab('text')}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        activeTab === 'text' ? 'bg-background shadow-md text-primary' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Texto Simple
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('html')}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        activeTab === 'html' ? 'bg-background shadow-md text-primary' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      HTML / Pro
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'text' ? (
                    <motion.div
                      key="text"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={8}
                        className="w-full px-5 py-4 rounded-2xl border bg-background/50 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none leading-relaxed"
                        placeholder="Escribe una descripción clara para que los pacientes se unan a la conversación..."
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="html"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4"
                    >
                      <textarea
                        value={descriptionHtml}
                        onChange={(e) => setDescriptionHtml(e.target.value)}
                        rows={12}
                        className="w-full px-5 py-4 rounded-2xl border bg-background/50 text-sm font-mono focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none leading-relaxed"
                        placeholder="<div class='custom-article'>\n  <h2>¡Hola!</h2>\n  <p>Contenido enriquecido...</p>\n</div>"
                      />
                      <div className="p-6 rounded-2xl border bg-background/30 backdrop-blur-sm min-h-[140px] shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                        <div className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-4 flex items-center gap-2">
                          <Eye className="h-3 w-3" />
                          Vista Previa Rápida
                        </div>
                        <div 
                          className="prose prose-sm dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                        />
                        {descriptionHtml.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-10 opacity-20 italic text-sm">
                            No hay contenido HTML para previsualizar
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar settings column */}
        <div className="space-y-6 lg:sticky lg:top-8">
          <motion.div variants={item} className="rounded-3xl border bg-card/60 backdrop-blur-xl p-8 shadow-sm space-y-6 border-primary/5">
             <div className="flex items-center gap-3 pb-4 border-b border-muted">
              <Settings className="h-5 w-5 text-primary" />
              <h3 className="font-black text-lg">Ajustes del Tema</h3>
            </div>

            <div className="space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Categoría</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border bg-background/50 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                  placeholder="Ej: Meditación"
                />
              </div>

              {/* Toggles */}
              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => setIsPinned(!isPinned)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    isPinned ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300' : 'bg-muted/30 hover:bg-muted/50 border-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Pin className={`h-4 w-4 ${isPinned ? 'fill-current' : ''}`} />
                    <span className="text-xs font-black uppercase tracking-widest">Fijar Tema</span>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${isPinned ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-muted'}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsLocked(!isLocked)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    isLocked ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300' : 'bg-muted/30 hover:bg-muted/50 border-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Lock className="h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Bloquear</span>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${isLocked ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-muted'}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    isActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    <span className="text-xs font-black uppercase tracking-widest">{isActive ? 'Público' : 'Oculto'}</span>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
                </button>
              </div>

              {/* Image upload */}
              <div className="space-y-3 pt-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Imagen de Portada</label>
                {(imagePreview && !removeImage) ? (
                  <div className="relative rounded-2xl overflow-hidden border bg-background/50 group/img">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover transition-transform group-hover/img:scale-110 duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="p-2 rounded-full bg-white text-gray-900 cursor-pointer hover:bg-primary hover:text-white transition-all scale-90 group-hover/img:scale-100 duration-300">
                        <Upload className="h-4 w-4" />
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
                        className="p-2 rounded-full bg-white text-rose-600 hover:bg-rose-600 hover:text-white transition-all scale-90 group-hover/img:scale-100 duration-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-40 rounded-2xl border-2 border-dashed border-muted bg-background/50 cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-all group/up">
                    <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover/up:bg-primary/10 transition-colors">
                      <ImageIcon className="h-5 w-5 text-primary opacity-40 group-hover/up:opacity-100 transition-all" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-muted-foreground mt-3 tracking-widest">Subir Imagen</span>
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
            </div>
          </motion.div>
        </div>
      </form>

      {/* Full Preview Modal */}
      <AnimatePresence>
        {showFullPreview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFullPreview(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-[2.5rem] border shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                     <Eye className="h-5 w-5" />
                   </div>
                   <h3 className="font-black">Vista Previa Final</h3>
                </div>
                <button
                  onClick={() => setShowFullPreview(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12">
                <div className="max-w-3xl mx-auto space-y-10">
                   {/* Meta */}
                   <div className="space-y-4 text-center">
                     <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                       {category || 'Sin Categoría'}
                     </div>
                     <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
                       {title || 'Título del Tema'}
                     </h1>
                     <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                           <Pin className={`h-3 w-3 ${isPinned ? 'text-amber-500 fill-amber-500' : ''}`} />
                           {isPinned ? 'Fijado' : 'Normal'}
                        </div>
                        <span>•</span>
                        <div>Hace un momento</div>
                     </div>
                   </div>

                   {/* Image */}
                   {(imagePreview && !removeImage) && (
                     <div className="rounded-3xl overflow-hidden border aspect-video shadow-lg">
                       <img src={imagePreview} className="w-full h-full object-cover" alt="Cover" />
                     </div>
                   )}

                   {/* Content */}
                   <div className="prose prose-lg dark:prose-invert max-w-none pb-20">
                      {activeTab === 'html' ? (
                        <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                      ) : (
                        <p className="whitespace-pre-wrap">{description}</p>
                      )}
                      {(activeTab === 'html' && !descriptionHtml) && (
                        <p className="text-muted-foreground italic text-center py-10 opacity-50">No hay contenido HTML para mostrar</p>
                      )}
                      {(activeTab === 'text' && !description) && (
                        <p className="text-muted-foreground italic text-center py-10 opacity-50">No hay contenido de texto para mostrar</p>
                      )}
                   </div>
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t flex justify-center">
                 <button
                   onClick={() => setShowFullPreview(false)}
                   className="px-10 py-3 bg-foreground text-background rounded-2xl font-black text-sm hover:scale-105 transition-transform"
                 >
                   Cerrar Vista Previa
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ForumFormPage
