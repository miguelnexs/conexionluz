import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '@/api/client'
import { Button } from '@/components/ui/button'
import { 
  Plus, Edit, Trash2, Wind, Check, X, Loader2, AlertCircle, Eye, EyeOff
} from 'lucide-react'

type BreathingTechnique = {
  id: number
  title: string
  subtitle: string
  description: string
  color: string
  gradient: string
  inhale: number
  hold1: number
  exhale: number
  hold2: number
  cycles: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function BreathingTechniquesPage(): JSX.Element {
  const { t } = useTranslation()
  const [techniques, setTechniques] = useState<BreathingTechnique[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  
  // Fields
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#10b981')
  const [gradient, setGradient] = useState('from-emerald-500 to-teal-600')
  const [inhale, setInhale] = useState(4)
  const [hold1, setHold1] = useState(0)
  const [exhale, setExhale] = useState(4)
  const [hold2, setHold2] = useState(0)
  const [cycles, setCycles] = useState(4)
  const [isActive, setIsActive] = useState(true)

  const fetchTechniques = async () => {
    setLoading(true)
    const res = await api.get<BreathingTechnique[]>('/api/admin/breathing-techniques/')
    if (res.ok) {
      setTechniques(res.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTechniques()
  }, [])

  // Open creation form
  const handleOpenCreate = () => {
    setEditingId(null)
    setTitle('')
    setSubtitle('')
    setDescription('')
    setColor('#10b981')
    setGradient('from-emerald-500 to-teal-600')
    setInhale(4)
    setHold1(0)
    setExhale(4)
    setHold2(0)
    setCycles(4)
    setIsActive(true)
    setIsFormOpen(true)
  }

  // Open edit form
  const handleOpenEdit = (tech: BreathingTechnique) => {
    setEditingId(tech.id)
    setTitle(tech.title)
    setSubtitle(tech.subtitle)
    setDescription(tech.description)
    setColor(tech.color)
    setGradient(tech.gradient)
    setInhale(tech.inhale)
    setHold1(tech.hold1)
    setExhale(tech.exhale)
    setHold2(tech.hold2)
    setCycles(tech.cycles)
    setIsActive(tech.isActive)
    setIsFormOpen(true)
  }

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      title,
      subtitle,
      description,
      color,
      gradient,
      inhale,
      hold1,
      exhale,
      hold2,
      cycles,
      isActive
    }

    let res
    if (editingId) {
      res = await api.put<BreathingTechnique>(`/api/admin/breathing-techniques/${editingId}/`, payload)
    } else {
      res = await api.post<BreathingTechnique>('/api/admin/breathing-techniques/', payload)
    }

    if (res.ok) {
      await fetchTechniques()
      setIsFormOpen(false)
    }
  }

  // Delete technique
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta técnica?')) return
    const res = await api.del(`/api/admin/breathing-techniques/${id}/`)
    if (res.ok) {
      setTechniques(prev => prev.filter(t => t.id !== id))
    }
  }

  // Toggle active switch
  const handleToggleActive = async (tech: BreathingTechnique) => {
    const res = await api.put<BreathingTechnique>(`/api/admin/breathing-techniques/${tech.id}/`, {
      ...tech,
      isActive: !tech.isActive
    })
    if (res.ok) {
      setTechniques(prev =>
        prev.map(item => (item.id === tech.id ? { ...item, isActive: !item.isActive } : item))
      )
    }
  }

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">Técnicas de Respiración</h2>
          <p className="text-sm text-muted-foreground">Administra las dinámicas de respiración y relajación consciente para regular el sistema nervioso.</p>
        </div>
        <Button onClick={handleOpenCreate} className="rounded-xl px-5 gap-2 font-bold shadow-lg shadow-primary/20">
          <Plus className="h-5 w-5" />
          <span>Nueva Técnica</span>
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-semibold">Cargando técnicas...</p>
        </div>
      ) : techniques.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border border-dashed rounded-3xl bg-card/45 max-w-3xl">
          <AlertCircle className="h-10 w-10 text-primary opacity-45 mb-2" />
          <h4 className="font-bold text-foreground">No hay técnicas creadas</h4>
          <p className="text-xs text-center mt-1 max-w-sm">Haz clic en "Nueva Técnica" para comenzar a poblar el sitio con material dinámico.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techniques.map(tech => (
            <div 
              key={tech.id} 
              className="bg-card border border-border rounded-3xl p-5 shadow-sm flex flex-col justify-between group transition-all duration-300 hover:shadow-md hover:border-primary/20"
            >
              <div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[10px] font-black uppercase bg-muted px-2.5 py-1 rounded-full border border-border text-muted-foreground tracking-wider">
                    Respiración
                  </span>
                  
                  <button 
                    onClick={() => handleToggleActive(tech)}
                    className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    title={tech.isActive ? "Desactivar" : "Activar"}
                  >
                    {tech.isActive ? (
                      <Eye className="h-4.5 w-4.5 text-emerald-500" />
                    ) : (
                      <EyeOff className="h-4.5 w-4.5 text-muted-foreground/60" />
                    )}
                  </button>
                </div>

                <h3 className="font-black text-lg text-foreground mt-4 leading-tight group-hover:text-primary transition-colors">
                  {tech.title}
                </h3>
                <p className="text-xs text-muted-foreground/80 mt-1 font-bold">{tech.subtitle}</p>
                <p className="text-xs text-muted-foreground/90 mt-3 line-clamp-3 leading-relaxed">{tech.description}</p>
                
                {/* Patterns */}
                <div className="flex gap-1.5 mt-4 flex-wrap text-[10px] font-bold">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">Inhala: {tech.inhale}s</span>
                  {tech.hold1 > 0 && <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600">Retén: {tech.hold1}s</span>}
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600">Exhala: {tech.exhale}s</span>
                  {tech.hold2 > 0 && <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600">Vacío: {tech.hold2}s</span>}
                </div>

                {/* Meta */}
                <div className="mt-4 pt-4 border-t border-border/80 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div>
                    <span className="font-semibold block text-[10px] text-muted-foreground/60 uppercase">Ciclos</span>
                    <span className="font-bold text-foreground">
                      {tech.cycles} ciclos
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold block text-[10px] text-muted-foreground/60 uppercase">Duración Est.</span>
                    <span className="font-bold text-foreground">
                      {Math.round(((tech.inhale + tech.hold1 + tech.exhale + tech.hold2) * tech.cycles) / 60)} min
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center gap-2.5 pt-4 border-t border-border/60">
                <Button 
                  onClick={() => handleOpenEdit(tech)} 
                  variant="secondary" 
                  size="sm" 
                  className="flex-1 rounded-xl font-bold py-3.5 border border-border"
                >
                  <Edit className="h-3.5 w-3.5 mr-1.5" />
                  <span>Editar</span>
                </Button>
                <Button 
                  onClick={() => handleDelete(tech.id)} 
                  variant="destructive" 
                  size="sm" 
                  className="rounded-xl px-3 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-black text-lg text-foreground">
                {editingId ? 'Editar Técnica de Respiración' : 'Nueva Técnica de Respiración'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Título</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Ej. Respiración Cuadrada"
                    className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Subtítulo</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={e => setSubtitle(e.target.value)}
                    placeholder="Ej. Para calmar la mente y enfocar la atención"
                    className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Descripción</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Instrucciones generales o propósitos de la técnica..."
                  rows={2}
                  className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary/50 resize-none"
                />
              </div>

              {/* Intervals */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 space-y-4">
                <label className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center gap-1">
                  <Wind className="h-4 w-4 text-emerald-500" /> Intervalos del Ciclo (Segundos)
                </label>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Inhalar</span>
                    <input
                      type="number"
                      required
                      min={1}
                      value={inhale}
                      onChange={e => setInhale(intValue(e.target.value))}
                      className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-foreground text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Retener (Lleno)</span>
                    <input
                      type="number"
                      required
                      min={0}
                      value={hold1}
                      onChange={e => setHold1(intValue(e.target.value))}
                      className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-foreground text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Exhalar</span>
                    <input
                      type="number"
                      required
                      min={1}
                      value={exhale}
                      onChange={e => setExhale(intValue(e.target.value))}
                      className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-foreground text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Retener (Vacío)</span>
                    <input
                      type="number"
                      required
                      min={0}
                      value={hold2}
                      onChange={e => setHold2(intValue(e.target.value))}
                      className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-foreground text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 col-span-2 md:col-span-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Ciclos</span>
                    <input
                      type="number"
                      required
                      min={1}
                      value={cycles}
                      onChange={e => setCycles(intValue(e.target.value))}
                      className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-foreground text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/60">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Color Representativo (Hex)</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={e => setColor(e.target.value)}
                      className="h-9 w-9 rounded-lg border border-border cursor-pointer p-0.5 bg-muted"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={e => setColor(e.target.value)}
                      className="flex-1 bg-muted/50 border border-border rounded-xl px-3 text-foreground focus:outline-none focus:border-primary/50 font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Gradiente de Fondo (Tailwind clases)</label>
                  <input
                    type="text"
                    value={gradient}
                    onChange={e => setGradient(e.target.value)}
                    placeholder="from-emerald-500 to-teal-600"
                    className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary/50 font-mono"
                  />
                </div>
              </div>

              {/* Publish switch */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs font-bold text-foreground cursor-pointer select-none">
                  Publicar técnica en la web pública inmediatamente.
                </label>
              </div>

              {/* Actions footer */}
              <div className="p-4 border-t border-border flex items-center justify-end gap-3 bg-muted/30 -mx-6 -mb-6">
                <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="rounded-xl font-bold">
                  Cancelar
                </Button>
                <Button type="submit" className="rounded-xl font-bold px-6">
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function intValue(val: string): number {
  const parsed = parseInt(val, 10)
  return isNaN(parsed) ? 0 : parsed
}
