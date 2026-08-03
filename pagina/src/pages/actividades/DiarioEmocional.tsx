import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { 
  NotebookPen, Plus, Smile, Meh, Frown, Angry, Heart, Trash2, 
  Calendar, TrendingUp, ChevronDown, ChevronUp, Tag, Search, 
  Lock, SmilePlus, Award, Sparkles, BookOpen,
  Feather, PenLine, ArrowRight, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
type Mood = { 
  label: string; 
  icon: React.ElementType; 
  color: string; 
  value: number; 
  emoji: string; 
  bgLight: string; 
  textDark: string;
  positiveMessage: string;
  physicalActivity: string;
};
type Entry = { id: string; date: string; mood: Mood; text: string; tags: string[]; gratitude: string };

const MOODS: Mood[] = [
  { label: 'Excelente', icon: Heart, color: '#10b981', value: 5, emoji: '🤩', bgLight: 'bg-emerald-50 text-emerald-800', textDark: 'text-emerald-500', positiveMessage: '¡Qué alegría! Aprovecha esta ola de energía positiva para celebrar tus logros y compartir tu luz con quienes te rodean.', physicalActivity: 'Celebración Corporal: Pon una canción alegre durante 3 minutos y baila libremente. Deja que el movimiento te ayude a identificar el gozo expandiéndose por tu pecho.' },
  { label: 'Bien', icon: Smile, color: '#6366f1', value: 4, emoji: '😊', bgLight: 'bg-indigo-50 text-indigo-800', textDark: 'text-indigo-500', positiveMessage: 'Te encuentras en un buen estado de calma y claridad mental. Es un gran momento para avanzar con paso firme y reflexionar con serenidad.', physicalActivity: 'Estiramiento Consciente: Dedica 3 minutos a estirar tus brazos al cielo, hombros y cuello. Siente la tensión muscular acumulada disolverse con cada exhalación.' },
  { label: 'Regular', icon: Meh, color: '#f59e0b', value: 3, emoji: '😐', bgLight: 'bg-amber-50 text-amber-800', textDark: 'text-amber-500', positiveMessage: 'Está bien sentirse neutro o sin mucha energía. Escucha a tu cuerpo, no te exijas de más. Este espacio es ideal para recuperar tu centro.', physicalActivity: 'Caminata de Conexión: Da un paseo de 5 minutos, concentrándote en la planta de tus pies tocando el suelo. Esto ayuda a anclar tu mente y liberar presión mental.' },
  { label: 'Mal', icon: Frown, color: '#f97316', value: 2, emoji: '😔', bgLight: 'bg-orange-50 text-orange-800', textDark: 'text-orange-500', positiveMessage: 'Permítete sentir la melancolía o el desánimo. No tienes que fingir estar bien siempre. Estás en un proceso natural de asimilación.', physicalActivity: 'Apertura de Pecho y Respiración: Siéntate derecho, abre los brazos al inhalar, y abrázate a ti mismo al exhalar. Hazlo por 2 minutos para liberar la opresión física en el pecho.' },
  { label: 'Muy mal', icon: Angry, color: '#ef4444', value: 1, emoji: '😢', bgLight: 'bg-red-50 text-red-800', textDark: 'text-red-500', positiveMessage: 'Aunque la emoción se sienta abrumadora, recuerda que estás a salvo y esto también pasará. Respira despacio, estamos contigo.', physicalActivity: 'Sacudida Corporal Liberadora (Tapping/Shaking): De pie, sacude tus manos, brazos y piernas vigorosamente durante 1 o 2 minutos. Ayuda al cuerpo a descargar la adrenalina y el cortisol acumulados.' },
];

const TAGS_OPTIONS = ['Familia', 'Trabajo', 'Salud', 'Relaciones', 'Sueño', 'Ejercicio', 'Alimentación', 'Estrés', 'Logro', 'Gratitud', 'Hobby', 'Amigos'];
const STORAGE_KEY = 'conexionluz:diario-emocional';
const INSPIRATIONAL_QUOTES = [
  "«Tu sentir de hoy no define tu mañana, pero registrarlo te ayuda a sanar hoy.»",
  "«Cada emoción es un mensajero, no un enemigo. Escúchala sin juzgar.»",
  "«Sé paciente contigo mismo. Crecer es un proceso silencioso y gradual.»",
  "«La gratitud transforma lo que tenemos en suficiente.»",
  "«Tu espacio seguro está aquí. Respira hondo y escribe con total libertad.»"
];

function loadEntries(): Entry[] { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } }
function saveEntries(entries: Entry[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }
function formatDate(iso: string) { return new Date(iso).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); }

// ─── Inline styles for the unique paper/journal aesthetic ──────────────────────
const paperBg = { background: '#faf9f6' };
const linedPaper = {
  backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(16,120,100,0.06) 27px, rgba(16,120,100,0.06) 28px)',
  backgroundAttachment: 'local' as const,
};
const marginLine = {
  borderLeft: '2px solid rgba(16,120,100,0.08)',
  paddingLeft: '1rem',
};

// ─── New entry form ────────────────────────────────────────────────────────────
function NewEntryForm({ onSave, onCancel }: { onSave: (e: Entry) => void; onCancel: () => void }) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [text, setText] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [quote] = useState(() => INSPIRATIONAL_QUOTES[Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)]);

  const toggleTag = (t: string) => setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleSave = () => {
    if (!selectedMood) return;
    onSave({ id: Date.now().toString(), date: new Date().toISOString(), mood: selectedMood, text, tags: selectedTags, gratitude });
  };

  return (
    <div className="relative" style={{ perspective: '1200px' }}>
      {/* Stacked paper sheets behind */}
      <div className="absolute inset-0 rounded-2xl border border-gray-200/60 rotate-[1deg] translate-y-1 translate-x-1" style={paperBg} />
      <div className="absolute inset-0 rounded-2xl border border-gray-200/40 rotate-[0.5deg] translate-y-0.5" style={paperBg} />

      {/* Main paper */}
      <div className="relative rounded-2xl border border-gray-200 shadow-xl overflow-hidden" style={paperBg}>
        {/* Red margin line along left */}
        <div className="absolute left-10 md:left-14 top-0 bottom-0 w-px bg-rose-200/50 hidden md:block" />

        {/* Header: date strip */}
        <div className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-gray-200/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <PenLine className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-base text-gray-800">Nueva página de tu diario</h2>
              <p className="text-[11px] text-gray-400 font-medium">{formatDate(new Date().toISOString())}</p>
            </div>
          </div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400 flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full">
            <Lock className="h-3 w-3 text-primary/70" /> Privado
          </span>
        </div>

        <div className="p-5 md:p-8 space-y-6">
          {/* Quote — handwritten feel */}
          <div className="text-center py-2.5 border-y border-dashed border-primary/10">
            <p className="text-[13px] italic text-primary/70 font-medium">{quote}</p>
          </div>

          {/* Form Content: 2 Columns on desktop to expand sideways */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Mood & Tags & Guidance */}
            <div className="lg:col-span-5 space-y-6">
              {/* Mood selection */}
              <div>
                <label className="text-xs font-bold text-gray-600 mb-3 block uppercase tracking-wider flex items-center gap-1.5">
                  <SmilePlus className="h-3.5 w-3.5 text-primary" /> ¿Cómo te sientes hoy?
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {MOODS.map(mood => (
                    <button
                      key={mood.label}
                      onClick={() => setSelectedMood(mood)}
                      className={cn(
                        'flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border-2 transition-all duration-300',
                        selectedMood?.value === mood.value 
                          ? 'scale-105 shadow-md' 
                          : 'border-transparent bg-white hover:bg-gray-50 shadow-sm'
                      )}
                      style={selectedMood?.value === mood.value ? { background: `${mood.color}10`, borderColor: mood.color, boxShadow: `0 6px 20px ${mood.color}25` } : {}}
                    >
                      <span className="text-2xl sm:text-3xl">{mood.emoji}</span>
                      <span className="text-[9px] font-bold text-gray-600 leading-tight text-center truncate w-full px-1">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood advice */}
              {selectedMood && (
                <div className={cn("rounded-xl p-4 border text-sm space-y-3 animate-fade-in shadow-sm", selectedMood.bgLight.split(' ')[0], "border-gray-100/50")}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    <h4 className="font-bold text-gray-800 text-[13px]">Guía: {selectedMood.label}</h4>
                  </div>
                  <div className="space-y-3 text-[13px]">
                    <div className="space-y-1">
                      <h5 className="text-[9px] uppercase font-bold tracking-wider opacity-60">Mensaje</h5>
                      <p className="text-gray-700 leading-relaxed">{selectedMood.positiveMessage}</p>
                    </div>
                    <div className="space-y-1 border-t border-gray-200/40 pt-2">
                      <h5 className="text-[9px] uppercase font-bold tracking-wider opacity-60">Actividad Física</h5>
                      <p className="text-gray-700 leading-relaxed">{selectedMood.physicalActivity}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="text-xs font-bold text-gray-600 mb-2.5 block uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-primary" /> Temas del día
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TAGS_OPTIONS.map(t => (
                    <button key={t} onClick={() => toggleTag(t)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 border',
                        selectedTags.includes(t)
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-primary/30 hover:text-primary'
                      )}
                    >{t}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Writing Textarea & Gratitude */}
            <div className="lg:col-span-7 space-y-6 flex flex-col justify-between h-full">
              {/* Text textarea with lined paper effect */}
              <div className="flex-1 flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-2 block uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-primary" /> Escribe libremente
                </label>
                <textarea
                  value={text} onChange={e => setText(e.target.value)} rows={7}
                  placeholder="Este es tu espacio seguro, sin juicios..."
                  className="w-full flex-1 min-h-[180px] rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-350 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 resize-none transition-all leading-[28px]"
                  style={{ ...linedPaper, ...paperBg }}
                />
              </div>

              {/* Gratitude */}
              <div>
                <label className="text-xs font-bold text-gray-600 mb-2 block uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Gratitud
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-base">💛</span>
                  <input value={gratitude} onChange={e => setGratitude(e.target.value)}
                    placeholder="Hoy agradezco..."
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm text-gray-700 placeholder:text-gray-350 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 transition-all"
                    style={paperBg}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onCancel}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors"
                >Cancelar</button>
                <button type="button" onClick={handleSave} disabled={!selectedMood}
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-primary shadow-md hover:shadow-lg hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  <Feather className="h-4 w-4" /> Guardar Entrada
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Entry card — journal page style with custom deletion ──────────────────────
function EntryCard({ entry, onDelete }: { entry: Entry; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const d = new Date(entry.date);

  return (
    <div className="flex gap-3 h-full">
      {/* Left: vertical date column with connector line */}
      <div className="shrink-0 flex flex-col items-center w-11">
        <div className="text-center bg-white border border-gray-200/80 rounded-lg py-1 px-1.5 shadow-sm w-full">
          <div className="text-lg font-black text-gray-800 leading-none">{d.getDate()}</div>
          <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">{d.toLocaleDateString('es-CO', { month: 'short' }).replace('.','')}</div>
        </div>
        <div className="w-0.5 flex-1 mt-1.5 rounded-full" style={{ backgroundColor: `${entry.mood.color}35` }} />
      </div>

      {/* Right: card */}
      <div className="flex-1 min-w-0 pb-1">
        <div className={cn(
          "rounded-xl border shadow-sm transition-all duration-300 overflow-hidden h-full flex flex-col justify-between",
          confirmDelete ? "border-rose-300 ring-2 ring-rose-500/20 bg-rose-50/30" : "border-gray-200/80 hover:shadow-md"
        )} style={paperBg}>
          {/* Top accent stripe */}
          <div className="h-1.5 w-full" style={{ background: confirmDelete ? '#f43f5e' : `linear-gradient(90deg, ${entry.mood.color}, ${entry.mood.color}60)` }} />

          {confirmDelete ? (
            /* Custom Delete Confirmation Banner inside Card */
            <div className="p-4 flex-1 flex flex-col justify-between space-y-4 animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-100/80 border border-rose-200 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-gray-900 leading-snug">¿Eliminar esta página de tu diario?</h4>
                  <p className="text-xs text-rose-700/80 font-medium">Esta acción quitará el registro de tu dispositivo permanentemente.</p>
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-rose-200/60">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors shadow-xs"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  className="px-4 py-2 rounded-lg bg-rose-600 text-white font-bold text-xs shadow-md hover:bg-rose-700 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Sí, eliminar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 flex-1 flex flex-col justify-between">
                <div className="flex items-start gap-2.5">
                  <span className="text-2xl shrink-0">{entry.mood.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-sm text-gray-800 block">{entry.mood.label}</span>
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.tags.map(t => (
                          <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {(entry.text || entry.gratitude) && (
                      <button onClick={() => setExpanded(!expanded)} className="p-1.5 text-gray-400 hover:text-primary rounded-lg transition-colors">
                        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    )}
                    <button 
                      onClick={() => setConfirmDelete(true)} 
                      title="Eliminar entrada" 
                      className="p-1.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Preview text if collapsed */}
                {!expanded && entry.text && (
                  <p className="text-xs text-gray-500 line-clamp-2 mt-2 font-medium italic">
                    "{entry.text}"
                  </p>
                )}
              </div>

              {expanded && (
                <div className="px-4 pb-4 pt-2 space-y-3 border-t border-gray-100">
                  {entry.text && (
                    <div className="text-sm text-gray-600 leading-[28px] whitespace-pre-wrap" style={{ ...linedPaper, ...marginLine }}>
                      {entry.text}
                    </div>
                  )}
                  {entry.gratitude && (
                    <div className="flex gap-2.5 p-3 rounded-lg bg-amber-50/60 border border-amber-100/50">
                      <span className="text-lg shrink-0">✨</span>
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-amber-600 font-bold mb-0.5">Gratitud</div>
                        <p className="text-sm text-amber-800 font-medium">{entry.gratitude}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function DiarioEmocionalPage() {
  const [entries, setEntries] = useState<Entry[]>(loadEntries());
  const [writing, setWriting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState<string>('todos');
  const [filterTag, setFilterTag] = useState<string>('todos');

  useEffect(() => saveEntries(entries), [entries]);

  const addEntry = (e: Entry) => { setEntries(prev => [e, ...prev]); setWriting(false); };
  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const last7 = entries.slice(0, 7);
  const avgMood = last7.length ? (last7.reduce((s, e) => s + e.mood.value, 0) / last7.length).toFixed(1) : null;
  const topTag = (() => {
    const freq: Record<string, number> = {};
    entries.forEach(e => e.tags.forEach(t => { freq[t] = (freq[t] || 0) + 1; }));
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0];
  })();

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchQuery.trim() === '' || entry.text.toLowerCase().includes(searchQuery.toLowerCase()) || entry.gratitude.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = filterMood === 'todos' || entry.mood.label === filterMood;
    const matchesTag = filterTag === 'todos' || entry.tags.includes(filterTag);
    return matchesSearch && matchesMood && matchesTag;
  });

  const allUsedTags = Array.from(new Set(entries.flatMap(e => e.tags)));

  return (
    <PublicLayout contentClassName="p-0">
      <div style={paperBg} className="min-h-screen">
        {/* ─── Hero: asymmetric journal cover ────────────────────────────── */}
        <div className="relative overflow-hidden border-b border-gray-200/60">
          {/* Watercolor-style blobs — organic, not circles */}
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-[40%_60%_60%_40%/60%_30%_70%_40%] bg-primary/[0.04] rotate-12 blur-sm pointer-events-none" />
          <div className="absolute bottom-0 -left-16 w-80 h-80 rounded-[60%_40%_50%_50%/40%_60%_40%_60%] bg-accent/[0.04] -rotate-6 blur-sm pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-12 md:py-16 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                {/* Left: large decorative icon */}
                <div className="shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white border border-gray-200/80 shadow-lg flex items-center justify-center rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
                    <span className="text-4xl md:text-5xl select-none">📓</span>
                  </div>
                </div>

                {/* Right: text */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">Solo para ti · Cifrado local</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tight leading-[1.1]">
                    Diario <span className="text-primary">Emocional</span>
                  </h1>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl">
                    Tu santuario personal para registrar lo que sientes. Todo se guarda de forma privada en tu dispositivo.
                  </p>
                </div>
              </div>

              {!writing && (
                <button
                  onClick={() => setWriting(true)}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all self-start md:self-auto shrink-0"
                >
                  <PenLine className="h-4 w-4" /> Escribir Nueva Entrada
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── Main Content Container (Expanded Horizontally max-w-7xl) ──── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-8 space-y-8">

          {/* ─── Top Dashboard: Stats & Mood Trend Side-by-Side ────────────── */}
          {entries.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Stats: horizontal metric cards */}
              <div className="lg:col-span-5 flex items-stretch gap-0 rounded-2xl border border-gray-200/80 overflow-hidden bg-white shadow-sm">
                <div className="flex-1 px-4 py-5 text-center border-r border-gray-100 flex flex-col justify-center">
                  <div className="text-3xl font-black text-primary">{entries.length}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Entradas Totales</div>
                </div>
                <div className="flex-1 px-4 py-5 text-center border-r border-gray-100 flex flex-col justify-center">
                  <div className="text-3xl font-black text-primary">{avgMood ?? '—'}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Ánimo Promedio (×7)</div>
                </div>
                <div className="flex-1 px-4 py-5 text-center flex flex-col justify-center">
                  <div className="text-xl font-black text-primary truncate px-1">{topTag ?? '—'}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Foco Principal</div>
                </div>
              </div>

              {/* Mood trend: horizontal bar chart */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-primary" /> Historial Reciente de Ánimo
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold">Últimas {last7.length} entradas</span>
                </div>
                {last7.length > 0 ? (
                  <div className="flex items-end gap-2 h-16 pt-2">
                    {[...last7].reverse().map((e) => (
                      <div key={e.id} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                        <div className="absolute bottom-full mb-1.5 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-[9px] font-bold px-2 py-1 rounded shadow-md pointer-events-none transition-opacity z-20 whitespace-nowrap">
                          {e.mood.label} · {formatDate(e.date)}
                        </div>
                        <div
                          className="w-full rounded-md transition-all duration-300 group-hover:opacity-100"
                          style={{ height: `${(e.mood.value / 5) * 44}px`, backgroundColor: e.mood.color, opacity: 0.7 }}
                        />
                        <span className="text-xs select-none">{e.mood.emoji}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 italic text-center py-4">Agrega entradas para ver la tendencia gráfica.</div>
                )}
              </div>

            </div>
          )}

          {/* ─── New entry form ──────────────────────────────────────────── */}
          {writing && (
            <NewEntryForm onSave={addEntry} onCancel={() => setWriting(false)} />
          )}

          {/* ─── Search and filters bar (Wide layout) ───────────────────── */}
          {entries.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Buscar en tus notas o gratitudes..."
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-medium"
                    style={paperBg}
                  />
                </div>
                <div className="flex gap-2.5 w-full sm:w-auto shrink-0">
                  <div className="relative flex-1 sm:w-40">
                    <select value={filterMood} onChange={e => setFilterMood(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-gray-200 pl-3.5 pr-8 py-2.5 text-xs text-gray-700 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                      <option value="todos">Todo ánimo</option>
                      {MOODS.map(m => <option key={m.label} value={m.label}>{m.emoji} {m.label}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1 sm:w-40">
                    <select value={filterTag} onChange={e => setFilterTag(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-gray-200 pl-3.5 pr-8 py-2.5 text-xs text-gray-700 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                      <option value="todos">Toda etiqueta</option>
                      {allUsedTags.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              {(searchQuery || filterMood !== 'todos' || filterTag !== 'todos') && (
                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  <span className="text-[11px] text-primary font-bold">Mostrando {filteredEntries.length} de {entries.length} entradas</span>
                  <button onClick={() => { setSearchQuery(''); setFilterMood('todos'); setFilterTag('todos'); }}
                    className="text-[11px] font-bold text-rose-500 hover:text-rose-600 uppercase tracking-wider transition-colors"
                  >Limpiar Filtros</button>
                </div>
              )}
            </div>
          )}

          {/* ─── Entries Grid: 2 Columns on MD/LG screens to expand sideways ──── */}
          <div>
            {filteredEntries.length === 0 && !writing && (
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm py-16 text-center">
                <div className="text-5xl mb-4 select-none">📓</div>
                <h3 className="font-bold text-gray-800 text-base mb-1">
                  {entries.length === 0 ? 'Comienza tu viaje emocional' : 'Sin resultados'}
                </h3>
                <p className="text-gray-400 text-xs max-w-xs mx-auto leading-relaxed mb-6">
                  {entries.length === 0
                    ? 'Registrar lo que sientes te ayuda a verte con más claridad.'
                    : 'Intenta ajustar los criterios de búsqueda o filtros.'}
                </p>
                {entries.length === 0 && (
                  <button onClick={() => setWriting(true)}
                    className="inline-flex items-center gap-2 bg-primary text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:brightness-110 transition-all"
                  >
                    <PenLine className="h-4 w-4" /> Escribir mi primera nota
                  </button>
                )}
              </div>
            )}

            {filteredEntries.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {filteredEntries.map(e => <EntryCard key={e.id} entry={e} onDelete={() => deleteEntry(e.id)} />)}
              </div>
            )}
          </div>

          {entries.length > 0 && (
            <div className="flex items-center justify-center gap-1.5 text-gray-400 text-[11px] py-4 border-t border-dashed border-gray-200/60">
              <Lock className="h-3.5 w-3.5 text-primary/60" />
              <span className="font-medium">Tus datos están cifrados localmente en este dispositivo.</span>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
