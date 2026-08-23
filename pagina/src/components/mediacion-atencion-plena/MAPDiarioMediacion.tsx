import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Plus, 
  Trash2, 
  Download, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Eye, 
  Brain, 
  Heart, 
  Activity, 
  CheckCircle2, 
  ChevronRight, 
  Layers
} from 'lucide-react';

export interface DiarioMediacionEntry {
  id: string;
  fecha: string;
  situacion: string;
  observacionExterna: string;
  observacionInterna: string;
  pensamiento: string;
  emocion: string;
  sensacionCorporal: string;
  impulso: string;
  respuesta: string;
  aprendizaje: string;
  nivelAtencion: number; // 1 to 10
  reflexion: string;
  createdAt: number;
}

const STORAGE_KEY = 'conexionluz_map_diario_entries';

const INITIAL_ENTRIES: DiarioMediacionEntry[] = [
  {
    id: 'demo-1',
    fecha: new Date().toISOString().split('T')[0],
    situacion: 'Reunión de trabajo con opiniones encontradas y retraso en entregables.',
    observacionExterna: 'Voces aceleradas, gestos tensos en el ambiente, luz artificial intensa.',
    observacionInterna: 'Presión en el pecho, respiración superficial, juicio crítico sobre el ritmo.',
    pensamiento: '"Vamos a perder el tiempo y no llegaremos al objetivo".',
    emocion: 'Frustración e impaciencia moderada.',
    sensacionCorporal: 'Mandíbula apretada y calor en el cuello.',
    impulso: 'Interrumpir bruscamente para imponer mi punto de vista.',
    respuesta: 'Hice una pausa de observación de 5 segundos, solté los hombros y pregunté con asertividad: "¿Cuál es el siguiente paso prioritario?".',
    aprendizaje: 'Observar el impulso antes de hablar me permitió no escalar el conflicto.',
    nivelAtencion: 8,
    reflexion: 'El espacio entre sentir el impulso y responder es donde reside mi libertad de actuar.',
    createdAt: Date.now() - 3600000 * 24
  }
];

export default function MAPDiarioMediacion() {
  const [entries, setEntries] = useState<DiarioMediacionEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<DiarioMediacionEntry | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    situacion: '',
    observacionExterna: '',
    observacionInterna: '',
    pensamiento: '',
    emocion: '',
    sensacionCorporal: '',
    impulso: '',
    respuesta: '',
    aprendizaje: '',
    nivelAtencion: 7,
    reflexion: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        setEntries(INITIAL_ENTRIES);
      }
    } else {
      setEntries(INITIAL_ENTRIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ENTRIES));
    }
  }, []);

  const saveEntries = (newEntries: DiarioMediacionEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.situacion.trim()) return;

    const newEntry: DiarioMediacionEntry = {
      id: 'entry-' + Date.now(),
      ...formData,
      createdAt: Date.now()
    };

    const updated = [newEntry, ...entries];
    saveEntries(updated);
    setIsModalOpen(false);
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      situacion: '',
      observacionExterna: '',
      observacionInterna: '',
      pensamiento: '',
      emocion: '',
      sensacionCorporal: '',
      impulso: '',
      respuesta: '',
      aprendizaje: '',
      nivelAtencion: 7,
      reflexion: ''
    });
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    saveEntries(updated);
    if (selectedEntry?.id === id) setSelectedEntry(null);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `diario_mediacion_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredEntries = entries.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      e.situacion.toLowerCase().includes(q) ||
      e.pensamiento.toLowerCase().includes(q) ||
      e.emocion.toLowerCase().includes(q) ||
      e.observacionInterna.toLowerCase().includes(q) ||
      e.observacionExterna.toLowerCase().includes(q) ||
      e.aprendizaje.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/20 border border-teal-400/30 text-teal-200 px-3.5 py-1 rounded-full flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-teal-300" />
            REGISTRO DE OBSERVACIÓN CONSCIENTE
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-teal-100 text-xs font-bold transition-all cursor-pointer"
              title="Descargar copia del diario"
            >
              <Download className="h-3.5 w-3.5" /> Exportar
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs font-black shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Nueva Entrada
            </button>
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Mi Diario de Mediación
        </h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Registra tus observaciones de la realidad interna (pensamiento, emoción, cuerpo) y externa (entorno, acontecimientos), consolidando el hábito de observar antes de responder.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por situación, pensamiento, emoción o aprendizaje..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs font-medium"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">
          {filteredEntries.length} {filteredEntries.length === 1 ? 'registro' : 'registros'}
        </span>
      </div>

      {/* Entries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEntries.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200/80 rounded-3xl p-12 text-center text-slate-500 space-y-3">
            <BookOpen className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No hay registros de mediación aún</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Haz clic en "Nueva Entrada" para registrar tu primera observación simultánea interna y externa.
            </p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => setSelectedEntry(entry)}
              className="bg-white border border-slate-200/80 hover:border-teal-400/80 rounded-3xl p-5 shadow-2xs transition-all duration-200 cursor-pointer space-y-4 hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-teal-800 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {entry.fecha}
                    </span>
                    <span className="text-[11px] font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      Atención: {entry.nivelAtencion}/10
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(entry.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                    title="Eliminar entrada"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2 mt-3">
                  <h4 className="text-sm font-black text-slate-900 line-clamp-1">
                    {entry.situacion}
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-medium pt-1">
                    <div className="p-2 rounded-xl bg-indigo-50/60 border border-indigo-100">
                      <span className="font-bold text-indigo-900 block truncate">🧠 Interno</span>
                      <p className="text-indigo-800 line-clamp-2 mt-0.5">{entry.observacionInterna || entry.pensamiento}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <span className="font-bold text-emerald-900 block truncate">🌍 Externo</span>
                      <p className="text-emerald-800 line-clamp-2 mt-0.5">{entry.observacionExterna || entry.situacion}</p>
                    </div>
                  </div>

                  {entry.respuesta && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700">
                      <span className="font-bold text-slate-900 block">✨ Respuesta Consciente:</span>
                      <p className="line-clamp-2 mt-0.5">{entry.respuesta}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-teal-700 pt-2 border-t border-slate-50">
                <span>Ver registro completo</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: View Detailed Entry */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black text-teal-700 uppercase tracking-wider">
                  Detalle del Registro de Mediación
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">{selectedEntry.situacion}</h3>
                <span className="text-xs text-slate-500 font-bold">{selectedEntry.fecha} · Nivel de atención: {selectedEntry.nivelAtencion}/10</span>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-medium text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-1">
                  <h4 className="font-black text-indigo-900 text-xs uppercase flex items-center gap-1.5">
                    🧠 ¿Qué observé internamente?
                  </h4>
                  <p className="text-indigo-800 leading-relaxed">{selectedEntry.observacionInterna || '—'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                  <h4 className="font-black text-emerald-900 text-xs uppercase flex items-center gap-1.5">
                    🌍 ¿Qué observé externamente?
                  </h4>
                  <p className="text-emerald-800 leading-relaxed">{selectedEntry.observacionExterna || '—'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900 block">Pensamiento</span>
                  <p className="text-slate-600">{selectedEntry.pensamiento || '—'}</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900 block">Emoción</span>
                  <p className="text-slate-600">{selectedEntry.emocion || '—'}</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900 block">Cuerpo</span>
                  <p className="text-slate-600">{selectedEntry.sensacionCorporal || '—'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                  <span className="font-bold text-amber-950 block">Impulso Automático Notado</span>
                  <p className="text-amber-900">{selectedEntry.impulso || '—'}</p>
                </div>
                <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl space-y-1">
                  <span className="font-bold text-teal-950 block">Respuesta Consciente Elegida</span>
                  <p className="text-teal-900">{selectedEntry.respuesta || '—'}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <h4 className="font-black text-slate-900 text-xs uppercase">Aprendizaje y Reflexión</h4>
                <p className="text-slate-700 leading-relaxed font-semibold">"{selectedEntry.aprendizaje || selectedEntry.reflexion}"</p>
                {selectedEntry.reflexion && selectedEntry.aprendizaje && (
                  <p className="text-slate-600 leading-relaxed text-[11px]">{selectedEntry.reflexion}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create New Entry */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleCreate} className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                  NUEVO REGISTRO
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Registrar Observación de Mediación</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Fecha</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nivel de Atención y Presencia (1 al 10): {formData.nivelAtencion}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.nivelAtencion}
                  onChange={(e) => setFormData({ ...formData, nivelAtencion: Number(e.target.value) })}
                  className="w-full accent-teal-600 mt-2"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Situación (¿Qué estaba ocurriendo?)</label>
                <input
                  type="text"
                  placeholder="Ej: En una videollamada de trabajo con desacuerdo en el presupuesto..."
                  value={formData.situacion}
                  onChange={(e) => setFormData({ ...formData, situacion: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-indigo-900 block mb-1">🧠 ¿Qué observé internamente?</label>
                <textarea
                  rows={2}
                  placeholder="Pensamientos, tono emocional, palpitaciones, calor, recuerdos..."
                  value={formData.observacionInterna}
                  onChange={(e) => setFormData({ ...formData, observacionInterna: e.target.value })}
                  className="w-full p-3 bg-indigo-50/40 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-emerald-900 block mb-1">🌍 ¿Qué observé externamente?</label>
                <textarea
                  rows={2}
                  placeholder="Entorno físico, ruidos, posturas ajenas, luz, temperatura..."
                  value={formData.observacionExterna}
                  onChange={(e) => setFormData({ ...formData, observacionExterna: e.target.value })}
                  className="w-full p-3 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pensamiento Notado</label>
                <input
                  type="text"
                  placeholder='Ej: "No me están tomando en serio"'
                  value={formData.pensamiento}
                  onChange={(e) => setFormData({ ...formData, pensamiento: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Emoción Notada</label>
                <input
                  type="text"
                  placeholder="Ej: Frustración, inquietud, inseguridad"
                  value={formData.emocion}
                  onChange={(e) => setFormData({ ...formData, emocion: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Sensación Corporal</label>
                <input
                  type="text"
                  placeholder="Ej: Tensión en el trapecio, respiración corta"
                  value={formData.sensacionCorporal}
                  onChange={(e) => setFormData({ ...formData, sensacionCorporal: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-amber-900 block mb-1">Impulso Automático</label>
                <input
                  type="text"
                  placeholder="Ej: Levantar la voz o cortar la llamada"
                  value={formData.impulso}
                  onChange={(e) => setFormData({ ...formData, impulso: e.target.value })}
                  className="w-full p-2.5 bg-amber-50/50 border border-amber-200 rounded-xl font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-teal-900 block mb-1">Respuesta Consciente Elegida</label>
                <textarea
                  rows={2}
                  placeholder="¿Qué hice tras observar? (Ej: Hice una respiración profunda, validé el argumento del compañero y propuse una alternativa ordenada)."
                  value={formData.respuesta}
                  onChange={(e) => setFormData({ ...formData, respuesta: e.target.value })}
                  className="w-full p-3 bg-teal-50/40 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Aprendizaje y Reflexión</label>
                <textarea
                  rows={2}
                  placeholder="¿Qué descubrí sobre mis patrones y mi capacidad de observar antes de actuar?"
                  value={formData.aprendizaje}
                  onChange={(e) => setFormData({ ...formData, aprendizaje: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-black shadow-sm"
              >
                Guardar Registro
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
