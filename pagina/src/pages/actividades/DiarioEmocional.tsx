import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { 
  NotebookPen, Plus, Smile, Meh, Frown, Angry, Heart, Trash2, 
  Calendar, TrendingUp, ChevronDown, ChevronUp, Tag, Search, 
  Lock, SmilePlus, Award, Sparkles, BookOpen,
  Feather, PenLine, ArrowRight, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '../../api/client';

// ─── Types ────────────────────────────────────────────────────────────────────
type Mood = { 
  label: string; 
  icon: React.ElementType; 
  color: string; 
  value: number; 
  emoji: string; 
  bgBadge: string; 
  textDark: string;
  positiveMessage: string;
  physicalActivity: string;
};
type Entry = { id: string; date: string; mood: Mood; text: string; tags: string[]; gratitude: string };

const MOODS: Mood[] = [
  { 
    label: 'Excelente', 
    icon: Heart, 
    color: '#059669', 
    value: 5, 
    emoji: '🤩', 
    bgBadge: 'bg-emerald-50 text-emerald-700 border-emerald-100', 
    textDark: 'text-emerald-600', 
    positiveMessage: '¡Qué alegría! Aprovecha esta ola de energía positiva para celebrar tus logros y compartir tu luz con quienes te rodean.', 
    physicalActivity: 'Celebración Corporal: Pon una canción alegre durante 3 minutos y baila libremente. Deja que el movimiento te ayude a identificar la expansión de la calma en tu pecho.' 
  },
  { 
    label: 'Bien', 
    icon: Smile, 
    color: '#4f46e5', 
    value: 4, 
    emoji: '😊', 
    bgBadge: 'bg-indigo-50 text-indigo-700 border-indigo-100', 
    textDark: 'text-indigo-600', 
    positiveMessage: 'Te encuentras en un buen estado de calma y claridad mental. Es un gran momento para avanzar con paso firme y reflexionar con serenidad.', 
    physicalActivity: 'Estiramiento Consciente: Dedica 3 minutos a estirar tus brazos al cielo, hombros y cuello. Siente la tensión muscular acumulada disolverse con cada exhalación.' 
  },
  { 
    label: 'Regular', 
    icon: Meh, 
    color: '#d97706', 
    value: 3, 
    emoji: '😐', 
    bgBadge: 'bg-amber-50 text-amber-700 border-amber-100', 
    textDark: 'text-amber-600', 
    positiveMessage: 'Está bien sentirse neutro o sin mucha energía. Escucha a tu cuerpo, no te exijas de más. Este espacio es ideal para recuperar tu centro.', 
    physicalActivity: 'Caminata de Conexión: Da un paseo de 5 minutos, concentrándote en la planta de tus pies tocando el suelo. Esto ayuda a anclar tu mente y liberar presión mental.' 
  },
  { 
    label: 'Desanimado', 
    icon: Frown, 
    color: '#2563eb', 
    value: 2, 
    emoji: '😔', 
    bgBadge: 'bg-blue-50 text-blue-700 border-blue-100', 
    textDark: 'text-blue-600', 
    positiveMessage: 'Permítete sentir el cansancio o el desánimo. No tienes que estar bien el 100% del tiempo. Trátate con la compasión de un buen amigo/a.', 
    physicalActivity: 'Apertura de Pecho y Respiración: Siéntate derecho, abre los brazos al inhalar, y abrázate a ti mismo al exhalar. Hazlo por 2 minutos para liberar la opresión física en el pecho.' 
  },
  { 
    label: 'Abrumado', 
    icon: Angry, 
    color: '#e11d48', 
    value: 1, 
    emoji: '😢', 
    bgBadge: 'bg-rose-50 text-rose-700 border-rose-100', 
    textDark: 'text-rose-600', 
    positiveMessage: 'Aunque la emoción se sienta pesada hoy, recuerda que estás a salvo y este estado es transitorio. Respira despacio, estamos contigo.', 
    physicalActivity: 'Sacudida Corporal Liberadora (Shaking): De pie, sacude tus manos, brazos y piernas suavemente durante 1 o 2 minutos. Ayuda al cuerpo a descargar la adrenalina acumulada.' 
  },
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
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 md:p-8 space-y-6 animate-in zoom-in-95 duration-300">
      {/* Header: Date strip */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <PenLine className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-black text-slate-900 text-lg md:text-xl">Nueva página de tu diario</h2>
            <p className="text-xs font-semibold text-slate-500">{formatDate(new Date().toISOString())}</p>
          </div>
        </div>
        <span className="text-[11px] uppercase font-bold tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5" /> Privado
        </span>
      </div>

      {/* Quote Banner */}
      <div className="bg-indigo-50/70 border border-indigo-100/80 p-4 rounded-2xl text-center text-xs md:text-sm font-medium italic text-indigo-950">
        {quote}
      </div>

      {/* Form Content: 2 Columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column: Mood & Tags & Guidance */}
        <div className="lg:col-span-5 space-y-6">
          {/* Mood selection */}
          <div>
            <label className="text-xs font-bold text-slate-600 mb-3 block uppercase tracking-wider flex items-center gap-1.5">
              <SmilePlus className="h-4 w-4 text-indigo-600" /> ¿Cómo te sientes hoy?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {MOODS.map(mood => {
                const isSelected = selectedMood?.value === mood.value;
                return (
                  <button
                    key={mood.label}
                    onClick={() => setSelectedMood(mood)}
                    type="button"
                    className={cn(
                      'flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer',
                      isSelected 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105' 
                        : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'
                    )}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className={cn('text-[10px] font-bold truncate w-full text-center px-1', isSelected ? 'text-white' : 'text-slate-700')}>
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mood advice */}
          {selectedMood && (
            <div className={cn('rounded-2xl p-4 border text-sm space-y-3 animate-fade-in shadow-sm', selectedMood.bgBadge)}>
              <div className="flex items-center gap-2">
                <span className="text-lg">💡</span>
                <h4 className="font-bold text-slate-900 text-sm">Guía: {selectedMood.label}</h4>
              </div>
              <div className="space-y-2.5 text-xs md:text-sm">
                <div>
                  <h5 className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-0.5">Mensaje Terapéutico</h5>
                  <p className="text-slate-800 leading-relaxed font-medium">{selectedMood.positiveMessage}</p>
                </div>
                <div className="border-t border-slate-200/60 pt-2">
                  <h5 className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-0.5">Práctica Recomendada</h5>
                  <p className="text-slate-800 leading-relaxed font-medium">{selectedMood.physicalActivity}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="text-xs font-bold text-slate-600 mb-2.5 block uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-indigo-600" /> Temas del día
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TAGS_OPTIONS.map(t => {
                const isSelected = selectedTags.includes(t);
                return (
                  <button 
                    key={t} 
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border cursor-pointer',
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Writing Textarea & Gratitude */}
        <div className="lg:col-span-7 space-y-5 flex flex-col justify-between h-full">
          {/* Text area */}
          <div className="flex-1 flex flex-col">
            <label className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-indigo-600" /> Escribe libremente
            </label>
            <textarea
              value={text} 
              onChange={e => setText(e.target.value)} 
              rows={7}
              placeholder="Este es tu espacio seguro. Expresa tus pensamientos, sensaciones y vivencias sin juicios..."
              className="w-full flex-1 min-h-[180px] rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 resize-none transition-all leading-relaxed"
            />
          </div>

          {/* Gratitude */}
          <div>
            <label className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" /> Gratitud del día
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-base">💛</span>
              <input 
                value={gratitude} 
                onChange={e => setGratitude(e.target.value)}
                placeholder="Hoy agradezco por..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              onClick={handleSave} 
              disabled={!selectedMood}
              className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-[0.99] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
            >
              <Feather className="h-4 w-4" /> Guardar Entrada
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Entry card ────────────────────────────────────────────────────────────────
function EntryCard({ entry, onDelete }: { entry: Entry; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const d = new Date(entry.date);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden p-6 space-y-4 flex flex-col justify-between">
      <div className="h-1.5 w-full -mt-6 -mx-6 mb-2" style={{ background: entry.mood.color }} />

      {confirmDelete ? (
        <div className="space-y-4 py-2">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">¿Eliminar esta entrada de tu diario?</h4>
              <p className="text-xs text-slate-500 font-medium">Esta acción no se puede deshacer.</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md hover:bg-rose-700 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" /> Sí, eliminar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{entry.mood.emoji}</span>
              <div>
                <span className={cn('text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border', entry.mood.bgBadge)}>
                  {entry.mood.label}
                </span>
                <p className="text-xs font-semibold text-slate-500 mt-1">{formatDate(entry.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {(entry.text || entry.gratitude) && (
                <button onClick={() => setExpanded(!expanded)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer">
                  {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              )}
              <button 
                onClick={() => setConfirmDelete(true)} 
                title="Eliminar entrada" 
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.map(t => (
                <span key={t} className="text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200/60 rounded-full px-2.5 py-0.5">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {!expanded && entry.text && (
            <p className="text-xs md:text-sm text-slate-600 line-clamp-2 font-medium italic">
              "{entry.text}"
            </p>
          )}

          {expanded && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              {entry.text && (
                <p className="text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                  {entry.text}
                </p>
              )}
              {entry.gratitude && (
                <div className="flex gap-3 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100/80">
                  <span className="text-xl shrink-0">✨</span>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-indigo-700 font-bold mb-0.5">Gratitud</div>
                    <p className="text-xs md:text-sm text-slate-800 font-medium">{entry.gratitude}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { AuthPromptModal, isUserLoggedIn } from '@/components/AuthPromptModal';

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function DiarioEmocionalPage() {
  const [entries, setEntries] = useState<Entry[]>(loadEntries());
  const [writing, setWriting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState<string>('todos');
  const [filterTag, setFilterTag] = useState<string>('todos');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const isLoggedIn = isUserLoggedIn();

  useEffect(() => saveEntries(entries), [entries]);

  const handleStartWriting = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    setWriting(true);
  };

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
    <PublicLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header bar with Action button */}
        {!writing && (
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">Diario Emocional</h1>
            <button
              onClick={handleStartWriting}
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all cursor-pointer"
            >
              {isLoggedIn ? (
                <><PenLine className="h-4 w-4" /> Escribir Nueva Entrada</>
              ) : (
                <><Lock className="h-4 w-4" /> Escribir Nueva Entrada (Requiere Cuenta)</>
              )}
            </button>
          </div>
        )}

        {!isLoggedIn && (
          <div className="bg-indigo-50/80 border border-indigo-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Espacio Personal e Historial Protegido</h4>
                <p className="text-xs text-slate-600 font-medium">Inicia sesión o crea tu cuenta gratuita para guardar y mantener tu Diario Emocional sin límites.</p>
              </div>
            </div>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
            >
              🔒 Iniciar Sesión / Registro
            </button>
          </div>
        )}

        {/* ─── Top Dashboard: Stats & Mood Trend ──────────────────────── */}
        {entries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
              <div className="text-3xl font-black text-indigo-600">{entries.length}</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Entradas Totales</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
              <div className="text-3xl font-black text-indigo-600">{avgMood ?? '—'}</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Ánimo Promedio (×7)</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
              <div className="text-xl font-black text-indigo-600 truncate">{topTag ?? '—'}</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Foco Principal</div>
            </div>
          </div>
        )}

        {/* ─── New entry form ──────────────────────────────────────────── */}
        {writing && (
          <NewEntryForm onSave={addEntry} onCancel={() => setWriting(false)} />
        )}

        {/* ─── Search and filters bar ─────────────────────────────────── */}
        {entries.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar en tus notas o gratitudes..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                />
              </div>
              <div className="flex gap-2.5 w-full sm:w-auto shrink-0">
                <div className="relative flex-1 sm:w-40">
                  <select 
                    value={filterMood} 
                    onChange={e => setFilterMood(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 pl-3.5 pr-8 py-2.5 text-xs text-slate-800 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 cursor-pointer"
                  >
                    <option value="todos">Todo ánimo</option>
                    {MOODS.map(m => <option key={m.label} value={m.label}>{m.emoji} {m.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>
                <div className="relative flex-1 sm:w-40">
                  <select 
                    value={filterTag} 
                    onChange={e => setFilterTag(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 pl-3.5 pr-8 py-2.5 text-xs text-slate-800 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 cursor-pointer"
                  >
                    <option value="todos">Toda etiqueta</option>
                    {allUsedTags.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
            {(searchQuery || filterMood !== 'todos' || filterTag !== 'todos') && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-indigo-600 font-bold">Mostrando {filteredEntries.length} de {entries.length} entradas</span>
                <button 
                  onClick={() => { setSearchQuery(''); setFilterMood('todos'); setFilterTag('todos'); }}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Limpiar Filtros
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── Entries Grid ───────────────────────────────────────────── */}
        <div>
          {filteredEntries.length === 0 && !writing && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl py-16 px-6 text-center space-y-4">
              <div className="h-16 w-16 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-3xl select-none">
                📓
              </div>
              <h3 className="font-black text-slate-900 text-xl">
                {entries.length === 0 ? 'Comienza tu viaje emocional' : 'Sin resultados'}
              </h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed font-medium">
                {entries.length === 0
                  ? 'Registrar lo que sientes te ayuda a procesar tus emociones con claridad y autocompasión.'
                  : 'Intenta ajustar los criterios de búsqueda o filtros.'}
              </p>
              {entries.length === 0 && (
                <div className="pt-2">
                  <button 
                    onClick={handleStartWriting}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all cursor-pointer"
                  >
                    <PenLine className="h-4 w-4" /> Escribir mi primera nota
                  </button>
                </div>
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
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs py-4 border-t border-slate-100">
            <Lock className="h-3.5 w-3.5 text-indigo-500" />
            <span className="font-medium">Tus datos están cifrados localmente en este dispositivo.</span>
          </div>
        )}
      </div>

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Desbloquea tu Diario Emocional"
        featureName="el Diario Emocional"
      />
    </PublicLayout>
  );
}
