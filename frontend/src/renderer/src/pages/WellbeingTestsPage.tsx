import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '@/api/client'
import { Button } from '@/components/ui/button'
import { 
  Plus, Edit, Trash2, ClipboardList, Check, X, Loader2, AlertCircle, Eye, EyeOff
} from 'lucide-react'

type Question = {
  id: number
  text: string
}

type WellbeingTest = {
  id: number
  title: string
  subtitle: string
  description: string
  durationLabel: string
  color: string
  gradient: string
  tag: string
  questions: Question[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function WellbeingTestsPage(): JSX.Element {
  const { t } = useTranslation()
  const [tests, setTests] = useState<WellbeingTest[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  
  // Fields
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')
  const [durationLabel, setDurationLabel] = useState('3 min')
  const [color, setColor] = useState('#ec4899')
  const [gradient, setGradient] = useState('from-pink-500 to-rose-600')
  const [tag, setTag] = useState('Clínico')
  const [questions, setQuestions] = useState<string[]>([''])
  const [isActive, setIsActive] = useState(true)

  const fetchTests = async () => {
    setLoading(true)
    const res = await api.get<WellbeingTest[]>('/api/admin/wellbeing-tests/')
    if (res.ok) {
      setTests(res.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTests()
  }, [])

  // Open creation form
  const handleOpenCreate = () => {
    setEditingId(null)
    setTitle('')
    setSubtitle('')
    setDescription('')
    setDurationLabel('3 min')
    setColor('#ec4899')
    setGradient('from-pink-500 to-rose-600')
    setTag('Clínico')
    setQuestions([''])
    setIsActive(true)
    setIsFormOpen(true)
  }

  // Open edit form
  const handleOpenEdit = (tst: WellbeingTest) => {
    setEditingId(tst.id)
    setTitle(tst.title)
    setSubtitle(tst.subtitle)
    setDescription(tst.description)
    setDurationLabel(tst.durationLabel || '3 min')
    setColor(tst.color)
    setGradient(tst.gradient)
    setTag(tst.tag || 'Clínico')
    setQuestions(tst.questions?.length ? tst.questions.map(q => q.text) : [''])
    setIsActive(tst.isActive)
    setIsFormOpen(true)
  }

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    const formattedQuestions = questions
      .map((text, idx) => ({ id: idx + 1, text: text.trim() }))
      .filter(q => q.text.length > 0)

    const payload = {
      title,
      subtitle,
      description,
      durationLabel,
      color,
      gradient,
      tag,
      questions: formattedQuestions,
      isActive
    }

    let res
    if (editingId) {
      res = await api.put<WellbeingTest>(`/api/admin/wellbeing-tests/${editingId}/`, payload)
    } else {
      res = await api.post<WellbeingTest>('/api/admin/wellbeing-tests/', payload)
    }

    if (res.ok) {
      await fetchTests()
      setIsFormOpen(false)
    }
  }

  // Delete test
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este test?')) return
    const res = await api.del(`/api/admin/wellbeing-tests/${id}/`)
    if (res.ok) {
      setTests(prev => prev.filter(t => t.id !== id))
    }
  }

  // Toggle active switch
  const handleToggleActive = async (tst: WellbeingTest) => {
    const res = await api.put<WellbeingTest>(`/api/admin/wellbeing-tests/${tst.id}/`, {
      ...tst,
      isActive: !tst.isActive
    })
    if (res.ok) {
      setTests(prev =>
        prev.map(item => (item.id === tst.id ? { ...item, isActive: !item.isActive } : item))
      )
    }
  }

  // Question helpers
  const addQuestion = () => {
    setQuestions([...questions, ''])
  }
  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx))
  }
  const updateQuestion = (idx: number, val: string) => {
    setQuestions(questions.map((q, i) => (i === idx ? val : q)))
  }

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">Tests de Bienestar</h2>
          <p className="text-sm text-muted-foreground">Administra los tests y cuestionarios de autoevaluación clínica y personal para los usuarios.</p>
        </div>
        <Button onClick={handleOpenCreate} className="rounded-xl px-5 gap-2 font-bold shadow-lg shadow-primary/20">
          <Plus className="h-5 w-5" />
          <span>Nuevo Test</span>
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-semibold">Cargando tests...</p>
        </div>
      ) : tests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border border-dashed rounded-3xl bg-card/45 max-w-3xl">
          <AlertCircle className="h-10 w-10 text-primary opacity-45 mb-2" />
          <h4 className="font-bold text-foreground">No hay tests creados</h4>
          <p className="text-xs text-center mt-1 max-w-sm">Haz clic en "Nuevo Test" para comenzar a poblar el sitio con material dinámico.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map(tst => (
            <div 
              key={tst.id} 
              className="bg-card border border-border rounded-3xl p-5 shadow-sm flex flex-col justify-between group transition-all duration-300 hover:shadow-md hover:border-primary/20"
            >
              <div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[10px] font-black uppercase bg-muted px-2.5 py-1 rounded-full border border-border text-muted-foreground tracking-wider">
                    {tst.tag || 'Clínico'}
                  </span>
                  
                  <button 
                    onClick={() => handleToggleActive(tst)}
                    className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    title={tst.isActive ? "Desactivar" : "Activar"}
                  >
                    {tst.isActive ? (
                      <Eye className="h-4.5 w-4.5 text-emerald-500" />
                    ) : (
                      <EyeOff className="h-4.5 w-4.5 text-muted-foreground/60" />
                    )}
                  </button>
                </div>

                <h3 className="font-black text-lg text-foreground mt-4 leading-tight group-hover:text-primary transition-colors">
                  {tst.title}
                </h3>
                <p className="text-xs text-muted-foreground/80 mt-1 font-bold">{tst.subtitle}</p>
                <p className="text-xs text-muted-foreground/90 mt-3 line-clamp-3 leading-relaxed">{tst.description}</p>
                
                {/* Meta */}
                <div className="mt-4 pt-4 border-t border-border/80 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div>
                    <span className="font-semibold block text-[10px] text-muted-foreground/60 uppercase">Preguntas</span>
                    <span className="font-bold text-foreground">
                      {tst.questions?.length || 0} items
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold block text-[10px] text-muted-foreground/60 uppercase">Tiempo Est.</span>
                    <span className="font-bold text-foreground">
                      {tst.durationLabel || '3 min'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center gap-2.5 pt-4 border-t border-border/60">
                <Button 
                  onClick={() => handleOpenEdit(tst)} 
                  variant="secondary" 
                  size="sm" 
                  className="flex-1 rounded-xl font-bold py-3.5 border border-border"
                >
                  <Edit className="h-3.5 w-3.5 mr-1.5" />
                  <span>Editar</span>
                </Button>
                <Button 
                  onClick={() => handleDelete(tst.id)} 
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
                {editingId ? 'Editar Test de Bienestar' : 'Nuevo Test de Bienestar'}
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
                    placeholder="Ej. Nivel de Ansiedad (GAD-7)"
                    className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Subtítulo</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={e => setSubtitle(e.target.value)}
                    placeholder="Ej. Escala GAD-7"
                    className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Etiqueta</label>
                  <input
                    type="text"
                    value={tag}
                    onChange={e => setTag(e.target.value)}
                    placeholder="Ej. Clínico, Personal"
                    className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Etiqueta de Duración</label>
                  <input
                    type="text"
                    value={durationLabel}
                    onChange={e => setDurationLabel(e.target.value)}
                    placeholder="Ej. 3 min"
                    className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Descripción</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detalla qué mide este test o bajo qué escala clínica está validado..."
                  rows={2}
                  className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary/50 resize-none"
                />
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
                    placeholder="from-pink-500 to-rose-600"
                    className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary/50 font-mono"
                  />
                </div>
              </div>

              {/* Questions builder */}
              <div className="space-y-3 pt-4 border-t border-border/60">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center gap-1">
                    <ClipboardList className="h-4 w-4 text-pink-500" /> Preguntas del Test
                  </label>
                  <Button type="button" variant="outline" size="sm" onClick={addQuestion} className="rounded-lg font-bold gap-1 text-xs">
                    <Plus className="h-3.5 w-3.5" /> Añadir Pregunta
                  </Button>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {questions.map((q, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-xs font-bold text-muted-foreground w-6 text-right shrink-0">#{idx + 1}</span>
                      <input
                        type="text"
                        required
                        value={q}
                        onChange={e => updateQuestion(idx, e.target.value)}
                        placeholder="Ej. Me he sentido nervioso/a o con los nervios de punta."
                        className="flex-1 bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground text-xs focus:outline-none focus:border-primary/50"
                      />
                      <button 
                        type="button" 
                        onClick={() => removeQuestion(idx)}
                        disabled={questions.length <= 1}
                        className="p-2 text-muted-foreground hover:text-red-500 disabled:opacity-30"
                      >
                        <X className="h-4 w-4" />
                      </button>
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
                  Publicar test en la web pública inmediatamente.
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
