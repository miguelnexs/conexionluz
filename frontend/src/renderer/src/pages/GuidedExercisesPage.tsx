import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '@/api/client'
import { Button } from '@/components/ui/button'
import { 
  Plus, Edit, Trash2, Dumbbell, Check, X, Loader2, AlertCircle, Eye, EyeOff
} from 'lucide-react'

type Step = {
  title: string
  body: string
  duration: number
}

type GuidedExercise = {
  id: number
  title: string
  subtitle: string
  category: string
  color: string
  gradient: string
  benefits: string[]
  steps: Step[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function GuidedExercisesPage(): JSX.Element {
  const { t } = useTranslation()
  const [exercises, setExercises] = useState<GuidedExercise[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  
  // Fields
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [category, setCategory] = useState('Mindfulness')
  const [color, setColor] = useState('#6366f1')
  const [gradient, setGradient] = useState('from-indigo-500 to-blue-600')
  const [isActive, setIsActive] = useState(true)
  const [benefitsText, setBenefitsText] = useState('')
  const [steps, setSteps] = useState<Step[]>([
    { title: 'Inicio', body: 'Prepárate en una posición cómoda.', duration: 15 }
  ])

  const fetchExercises = async () => {
    setLoading(true)
    const res = await api.get<GuidedExercise[]>('/api/admin/guided-exercises/')
    if (res.ok) {
      setExercises(res.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchExercises()
  }, [])

  // Open creation form
  const handleOpenCreate = () => {
    setEditingId(null)
    setTitle('')
    setSubtitle('')
    setCategory('Mindfulness')
    setColor('#6366f1')
    setGradient('from-indigo-500 to-blue-600')
    setIsActive(true)
    setBenefitsText('')
    setSteps([{ title: 'Inicio', body: 'Prepárate en una posición cómoda.', duration: 15 }])
    setIsFormOpen(true)
  }

  // Open edit form
  const handleOpenEdit = (ex: GuidedExercise) => {
    setEditingId(ex.id)
    setTitle(ex.title)
    setSubtitle(ex.subtitle)
    setCategory(ex.category)
    setColor(ex.color)
    setGradient(ex.gradient)
    setIsActive(ex.isActive)
    setBenefitsText(ex.benefits?.join(', ') || '')
    setSteps(ex.steps?.length ? ex.steps : [{ title: 'Inicio', body: 'Prepárate en una posición cómoda.', duration: 15 }])
    setIsFormOpen(true)
  }

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const benefitsList = benefitsText
      .split(',')
      .map(b => b.trim())
      .filter(b => b.length > 0)

    const payload = {
      title,
      subtitle,
      category,
      color,
      gradient,
      benefits: benefitsList,
      steps,
      isActive
    }

    let res
    if (editingId) {
      res = await api.put<GuidedExercise>(`/api/admin/guided-exercises/${editingId}/`, payload)
    } else {
      res = await api.post<GuidedExercise>('/api/admin/guided-exercises/', payload)
    }

    if (res.ok) {
      await fetchExercises()
      setIsFormOpen(false)
    }
  }

  // Delete exercise
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este ejercicio?')) return
    const res = await api.del(`/api/admin/guided-exercises/${id}/`)
    if (res.ok) {
      setExercises(prev => prev.filter(e => e.id !== id))
    }
  }

  // Toggle active switch
  const handleToggleActive = async (ex: GuidedExercise) => {
    const res = await api.put<GuidedExercise>(`/api/admin/guided-exercises/${ex.id}/`, {
      ...ex,
      isActive: !ex.isActive
    })
    if (res.ok) {
      setExercises(prev =>
        prev.map(item => (item.id === ex.id ? { ...item, isActive: !item.isActive } : item))
      )
    }
  }

  // Steps helpers
  const addStep = () => {
    setSteps([...steps, { title: '', body: '', duration: 30 }])
  }
  const removeStep = (idx: number) => {
    setSteps(steps.filter((_, i) => i !== idx))
  }
  const updateStep = (idx: number, field: string, val: any) => {
    setSteps(
      steps.map((s, i) => (i === idx ? { ...s, [field]: val } : s))
    )
  }

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">Ejercicios Guiados</h2>
          <p className="text-sm text-muted-foreground">Administra las técnicas terapéuticas guiadas paso a paso con temporizador para la web pública.</p>
        </div>
        <Button onClick={handleOpenCreate} className="rounded-xl px-5 gap-2 font-bold shadow-lg shadow-primary/20">
          <Plus className="h-5 w-5" />
          <span>Nuevo Ejercicio</span>
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-semibold">Cargando ejercicios...</p>
        </div>
      ) : exercises.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border border-dashed rounded-3xl bg-card/45 max-w-3xl">
          <AlertCircle className="h-10 w-10 text-primary opacity-45 mb-2" />
          <h4 className="font-bold text-foreground">No hay ejercicios creados</h4>
          <p className="text-xs text-center mt-1 max-w-sm">Haz clic en "Nuevo Ejercicio" para comenzar a poblar el sitio con material dinámico.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map(ex => (
            <div 
              key={ex.id} 
              className="bg-card border border-border rounded-3xl p-5 shadow-sm flex flex-col justify-between group transition-all duration-300 hover:shadow-md hover:border-primary/20"
            >
              <div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[10px] font-black uppercase bg-muted px-2.5 py-1 rounded-full border border-border text-muted-foreground tracking-wider">
                    {ex.category || 'Mindfulness'}
                  </span>
                  
                  <button 
                    onClick={() => handleToggleActive(ex)}
                    className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    title={ex.isActive ? "Desactivar" : "Activar"}
                  >
                    {ex.isActive ? (
                      <Eye className="h-4.5 w-4.5 text-emerald-500" />
                    ) : (
                      <EyeOff className="h-4.5 w-4.5 text-muted-foreground/60" />
                    )}
                  </button>
                </div>

                <h3 className="font-black text-lg text-foreground mt-4 leading-tight group-hover:text-primary transition-colors">
                  {ex.title}
                </h3>
                <p className="text-xs text-muted-foreground/80 mt-1 font-bold">{ex.subtitle}</p>
                
                {/* Benefits */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {ex.benefits?.map(b => (
                    <span key={b} className="text-[9px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {b}
                    </span>
                  ))}
                </div>

                {/* Meta */}
                <div className="mt-4 pt-4 border-t border-border/80 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div>
                    <span className="font-semibold block text-[10px] text-muted-foreground/60 uppercase">Pasos</span>
                    <span className="font-bold text-foreground">
                      {ex.steps?.length || 0} pasos
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold block text-[10px] text-muted-foreground/60 uppercase">Duración Total</span>
                    <span className="font-bold text-foreground">
                      {Math.round((ex.steps?.reduce((acc, step) => acc + step.duration, 0) || 0) / 60)} min
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center gap-2.5 pt-4 border-t border-border/60">
                <Button 
                  onClick={() => handleOpenEdit(ex)} 
                  variant="secondary" 
                  size="sm" 
                  className="flex-1 rounded-xl font-bold py-3.5 border border-border"
                >
                  <Edit className="h-3.5 w-3.5 mr-1.5" />
                  <span>Editar</span>
                </Button>
                <Button 
                  onClick={() => handleDelete(ex.id)} 
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
          <div className="bg-card w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-black text-lg text-foreground">
                {editingId ? 'Editar Ejercicio Guiado' : 'Nuevo Ejercicio Guiado'}
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
                    placeholder="Ej. Grounding 5-4-3-2-1"
                    className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Subtítulo</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={e => setSubtitle(e.target.value)}
                    placeholder="Ej. Ejercicio de anclaje mental rápido"
                    className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Categoría</label>
                  <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    placeholder="Ej. Corporal, Emocional, Mindfulness"
                    className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Beneficios (Separados por comas)</label>
                  <input
                    type="text"
                    value={benefitsText}
                    onChange={e => setBenefitsText(e.target.value)}
                    placeholder="Ej. Calma el pánico, Reduce estrés, Anclaje corporal"
                    className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary/50"
                  />
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
                    placeholder="Ej. from-indigo-500 to-blue-600"
                    className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary/50 font-mono"
                  />
                </div>
              </div>

              {/* Steps builder */}
              <div className="space-y-3 pt-4 border-t border-border/60">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center gap-1">
                    <Dumbbell className="h-4 w-4 text-primary" /> Pasos del Ejercicio
                  </label>
                  <Button type="button" variant="outline" size="sm" onClick={addStep} className="rounded-lg font-bold gap-1 text-xs">
                    <Plus className="h-3.5 w-3.5" /> Añadir Paso
                  </Button>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {steps.map((step, idx) => (
                    <div key={idx} className="bg-muted/40 p-4 rounded-2xl border border-border/70 relative space-y-3">
                      <button 
                        type="button" 
                        onClick={() => removeStep(idx)}
                        disabled={steps.length <= 1}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-red-500 disabled:opacity-30"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 space-y-1">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Nombre del Paso {idx + 1}</span>
                          <input
                            type="text"
                            required
                            value={step.title}
                            onChange={e => updateStep(idx, 'title', e.target.value)}
                            placeholder="Ej. Planta los pies en la tierra"
                            className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-foreground text-xs focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Duración (seg)</span>
                          <input
                            type="number"
                            required
                            min={5}
                            value={step.duration}
                            onChange={e => updateStep(idx, 'duration', intValue(e.target.value))}
                            className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-foreground text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Instrucciones / Descripción</span>
                        <textarea
                          required
                          value={step.body}
                          onChange={e => updateStep(idx, 'body', e.target.value)}
                          placeholder="Instrucciones paso a paso..."
                          rows={2}
                          className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-foreground text-xs focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
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
                  Publicar ejercicio en la web pública inmediatamente.
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
  return isNaN(parsed) ? 10 : parsed
}
