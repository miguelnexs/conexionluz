import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Layers, 
  ChevronRight, 
  Activity, 
  Heart, 
  Compass, 
  ArrowRight
} from 'lucide-react';

interface PensamientoObservado {
  id: string;
  situacion: string;
  pensamiento: string;
  observacionMetacognitiva: string;
  emocion: string;
  cuerpo: string;
  entorno: string;
  respuesta: string;
  conciencia: string;
  createdAt: number;
}

const STORAGE_KEY = 'conexionluz_map_observador_pensamientos';

const INITIAL_DATA: PensamientoObservado[] = [
  {
    id: 'obs-1',
    situacion: 'Enviando un informe de trabajo importante al comité de dirección.',
    pensamiento: '"Seguro encontrarán algún error y cuestionarán mi capacidad profesional".',
    observacionMetacognitiva: 'Noto que mi mente está cayendo en adivinación del futuro y catastrofismo preventivo.',
    emocion: 'Ansiedad anticipatoria e inseguridad (6/10).',
    cuerpo: 'Respiración superficial y contracción en la boca del estómago.',
    entorno: 'Oficina en silencio, monitor con la bandeja de salida abierta.',
    respuesta: 'Revisé el documento con calma, validé los datos y lo envié sin postergarlo.',
    conciencia: 'Pude observar que el pensamiento era solo un intento de mi cerebro por prepararse, no una realidad inevitable.',
    createdAt: Date.now() - 86400000
  }
];

export default function MAPObservadorPensamiento() {
  const [items, setItems] = useState<PensamientoObservado[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PensamientoObservado | null>(null);

  const [form, setForm] = useState({
    situacion: '',
    pensamiento: '',
    observacionMetacognitiva: '',
    emocion: '',
    cuerpo: '',
    entorno: '',
    respuesta: '',
    conciencia: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        setItems(INITIAL_DATA);
      }
    } else {
      setItems(INITIAL_DATA);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    }
  }, []);

  const saveItems = (updated: PensamientoObservado[]) => {
    setItems(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pensamiento.trim()) return;

    const newItem: PensamientoObservado = {
      id: 'obs-' + Date.now(),
      ...form,
      createdAt: Date.now()
    };

    const updated = [newItem, ...items];
    saveItems(updated);
    setIsModalOpen(false);
    setForm({
      situacion: '',
      pensamiento: '',
      observacionMetacognitiva: '',
      emocion: '',
      cuerpo: '',
      entorno: '',
      respuesta: '',
      conciencia: ''
    });
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((x) => x.id !== id);
    saveItems(updated);
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/20 border border-teal-400/30 text-teal-200 px-3.5 py-1 rounded-full flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-teal-300" />
            HERRAMIENTA METACOGNITIVA
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs font-black shadow-sm transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Desarmar Pensamiento
          </button>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          El Observador del Pensamiento
        </h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Aprende a diferenciar el pensamiento en sí de la <em>observación del pensamiento</em>. Pasa de estar atrapado en la mente a contemplar la interacción entre mente, emoción, cuerpo y entorno.
        </p>
      </div>

      {/* Conceptual Formula Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">
          La Fórmula de la Distancia Observacional
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
            <span className="text-[10px] font-black uppercase text-rose-900">Fusión Reactiva (Sin Observador)</span>
            <p className="text-xs font-bold text-rose-950">
              "No puedo hacer esto, todo saldrá mal."
            </p>
            <span className="text-[11px] text-rose-800 block mt-1">El pensamiento se confunde con una verdad irrefutable.</span>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-black uppercase text-emerald-900">Observación Metacognitiva (ConexiónLuz)</span>
            <p className="text-xs font-bold text-emerald-950">
              "Estoy observando el pensamiento de: 'no puedo hacer esto'."
            </p>
            <span className="text-[11px] text-emerald-800 block mt-1">Se crea el espacio lúcido necesario para elegir una respuesta sabia.</span>
          </div>
        </div>
      </div>

      {/* List of Registered Thought Observations */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 px-2">
          Pensamientos Desarmados ({items.length})
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-white border border-slate-200/90 hover:border-teal-400/90 rounded-3xl p-5 sm:p-6 shadow-2xs transition-all duration-200 cursor-pointer space-y-4"
            >
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
                  <span className="text-xs font-black text-slate-700 uppercase">
                    Situación: {item.situacion}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Main Core: Thought vs Metacognition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-500">Pensamiento que apareció</span>
                  <p className="text-xs font-bold text-slate-900 italic leading-relaxed">
                    "{item.pensamiento}"
                  </p>
                </div>
                <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-100 space-y-1">
                  <span className="text-[10px] font-black uppercase text-indigo-900">Observación Metacognitiva</span>
                  <p className="text-xs font-bold text-indigo-950 leading-relaxed">
                    {item.observacionMetacognitiva}
                  </p>
                </div>
              </div>

              {/* Badges Flow: Emoción, Cuerpo, Entorno, Respuesta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-medium pt-1">
                <div className="p-2 bg-rose-50/60 rounded-xl border border-rose-100">
                  <span className="font-bold text-rose-900 block truncate">❤️ Emoción</span>
                  <span className="text-rose-800 truncate block mt-0.5">{item.emocion || '—'}</span>
                </div>
                <div className="p-2 bg-amber-50/60 rounded-xl border border-amber-100">
                  <span className="font-bold text-amber-900 block truncate">🧘 Cuerpo</span>
                  <span className="text-amber-800 truncate block mt-0.5">{item.cuerpo || '—'}</span>
                </div>
                <div className="p-2 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span className="font-bold text-emerald-900 block truncate">🌍 Entorno</span>
                  <span className="text-emerald-800 truncate block mt-0.5">{item.entorno || '—'}</span>
                </div>
                <div className="p-2 bg-teal-50/60 rounded-xl border border-teal-100">
                  <span className="font-bold text-teal-900 block truncate">✨ Respuesta</span>
                  <span className="text-teal-800 truncate block mt-0.5">{item.respuesta || '—'}</span>
                </div>
              </div>

              {item.conciencia && (
                <div className="p-3 bg-teal-50/80 rounded-2xl border border-teal-200 text-xs font-medium text-teal-950 flex items-start gap-2">
                  <Brain className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-teal-900">Espacio de Conciencia:</span> {item.conciencia}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Create Thought Breakdown */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleCreate} className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                  OBSERVADOR DEL PENSAMIENTO
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Desarmar un Pensamiento</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">1. Situación (¿Qué estaba ocurriendo?)</label>
                <input
                  type="text"
                  placeholder="Ej: Presentando una propuesta ante un cliente exigente..."
                  value={form.situacion}
                  onChange={(e) => setForm({ ...form, situacion: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">2. Pensamiento (¿Qué apareció en mi mente?)</label>
                <input
                  type="text"
                  placeholder='Ej: "No me están prestando atención, creen que esto no vale la pena"'
                  value={form.pensamiento}
                  onChange={(e) => setForm({ ...form, pensamiento: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-indigo-900 block mb-1">3. Observación Metacognitiva (¿Qué noto sobre ese pensamiento?)</label>
                <input
                  type="text"
                  placeholder="Ej: Noto que es una suposición rápida basada en el ceño fruncido del cliente..."
                  value={form.observacionMetacognitiva}
                  onChange={(e) => setForm({ ...form, observacionMetacognitiva: e.target.value })}
                  className="w-full p-3 bg-indigo-50/40 border border-indigo-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">4. Emoción</label>
                  <input
                    type="text"
                    placeholder="Ej: Inseguridad, tensión"
                    value={form.emocion}
                    onChange={(e) => setForm({ ...form, emocion: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">5. Cuerpo</label>
                  <input
                    type="text"
                    placeholder="Ej: Garganta seca"
                    value={form.cuerpo}
                    onChange={(e) => setForm({ ...form, cuerpo: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">6. Entorno</label>
                  <input
                    type="text"
                    placeholder="Ej: Sala iluminada"
                    value={form.entorno}
                    onChange={(e) => setForm({ ...form, entorno: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-teal-900 block mb-1">7. Respuesta Consciente (¿Qué hice?)</label>
                <input
                  type="text"
                  placeholder="Ej: Respiré, tomé un sorbo de agua y pregunté abiertamente: '¿Qué opinan de este punto?'"
                  value={form.respuesta}
                  onChange={(e) => setForm({ ...form, respuesta: e.target.value })}
                  className="w-full p-3 bg-teal-50/40 border border-teal-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">8. Conciencia (¿Qué pude observar antes de responder?)</label>
                <textarea
                  rows={2}
                  placeholder="Ej: Pude observar que el pensamiento era solo una hipótesis mía y no la realidad del cliente."
                  value={form.conciencia}
                  onChange={(e) => setForm({ ...form, conciencia: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-black shadow-sm"
              >
                Guardar Observación
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
