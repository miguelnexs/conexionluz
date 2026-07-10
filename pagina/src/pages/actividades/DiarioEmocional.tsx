import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { NotebookPen, Plus, Smile, Meh, Frown, Angry, Heart, Trash2, Calendar, TrendingUp, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
type Mood = { label: string; icon: React.ElementType; color: string; value: number; emoji: string };
type Entry = { id: string; date: string; mood: Mood; text: string; tags: string[]; gratitude: string };

const MOODS: Mood[] = [
  { label: 'Excelente', icon: Heart, color: '#10b981', value: 5, emoji: '🤩' },
  { label: 'Bien', icon: Smile, color: '#6366f1', value: 4, emoji: '😊' },
  { label: 'Regular', icon: Meh, color: '#f59e0b', value: 3, emoji: '😐' },
  { label: 'Mal', icon: Frown, color: '#f97316', value: 2, emoji: '😔' },
  { label: 'Muy mal', icon: Angry, color: '#ef4444', value: 1, emoji: '😢' },
];

const TAGS_OPTIONS = ['Familia', 'Trabajo', 'Salud', 'Relaciones', 'Sueño', 'Ejercicio', 'Alimentación', 'Estrés', 'Logro', 'Gratitud'];

const STORAGE_KEY = 'conexionluz:diario-emocional';

function loadEntries(): Entry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function saveEntries(entries: Entry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── New entry form ────────────────────────────────────────────────────────────
function NewEntryForm({ onSave, onCancel }: { onSave: (e: Entry) => void; onCancel: () => void }) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [text, setText] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (t: string) => setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleSave = () => {
    if (!selectedMood) return;
    const entry: Entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: selectedMood,
      text,
      tags: selectedTags,
      gratitude,
    };
    onSave(entry);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4 text-white">
        <h2 className="font-black text-lg">Nueva entrada · {new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })}</h2>
        <p className="text-white/75 text-sm">Tómate un momento para registrar cómo te sientes hoy</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Mood */}
        <div>
          <label className="text-sm font-black text-slate-700 mb-3 block">¿Cómo te sientes hoy?</label>
          <div className="flex gap-3 flex-wrap">
            {MOODS.map(mood => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(mood)}
                className={cn('flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200', selectedMood?.value === mood.value ? 'border-transparent scale-110 shadow-lg' : 'border-slate-100 hover:border-slate-200')}
                style={selectedMood?.value === mood.value ? { background: `${mood.color}15`, borderColor: mood.color } : {}}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-[11px] font-bold text-slate-600">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm font-black text-slate-700 mb-3 flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5" /> Temas de hoy
          </label>
          <div className="flex flex-wrap gap-2">
            {TAGS_OPTIONS.map(t => (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className={cn('px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150', selectedTags.includes(t) ? 'bg-pink-500 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}
              >{t}</button>
            ))}
          </div>
        </div>

        {/* Text */}
        <div>
          <label className="text-sm font-black text-slate-700 mb-2 block">¿Qué quieres expresar? <span className="font-normal text-slate-400">(opcional)</span></label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={4}
            placeholder="Escribe libremente… este es tu espacio seguro. Nadie más lo verá."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent placeholder:text-slate-300 leading-relaxed"
          />
        </div>

        {/* Gratitude */}
        <div>
          <label className="text-sm font-black text-slate-700 mb-2 block">💛 Una cosa por la que estés agradecido/a hoy</label>
          <input
            value={gratitude}
            onChange={e => setGratitude(e.target.value)}
            placeholder="Hoy estoy agradecido/a por…"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent placeholder:text-slate-300"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-colors">Cancelar</button>
          <button
            onClick={handleSave}
            disabled={!selectedMood}
            className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            Guardar entrada ✨
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Entry card ───────────────────────────────────────────────────────────────
function EntryCard({ entry, onDelete }: { entry: Entry; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderLeft: `4px solid ${entry.mood.color}` }}>
        <span className="text-2xl">{entry.mood.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-slate-800">{entry.mood.label}</span>
            {entry.tags.map(t => (
              <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{t}</span>
            ))}
          </div>
          <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {formatDate(entry.date)}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {(entry.text || entry.gratitude) && (
            <button onClick={() => setExpanded(!expanded)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
          <button onClick={onDelete} className="p-2 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      {expanded && (
        <div className="px-5 pb-4 pt-1 space-y-2.5 border-t border-slate-50">
          {entry.text && <p className="text-sm text-slate-600 leading-relaxed">{entry.text}</p>}
          {entry.gratitude && (
            <div className="flex items-start gap-2 bg-amber-50 rounded-lg px-3 py-2">
              <span className="text-base">💛</span>
              <p className="text-sm text-amber-700 font-medium">{entry.gratitude}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function DiarioEmocionalPage() {
  const [entries, setEntries] = useState<Entry[]>(loadEntries());
  const [writing, setWriting] = useState(false);

  useEffect(() => saveEntries(entries), [entries]);

  const addEntry = (e: Entry) => { setEntries(prev => [e, ...prev]); setWriting(false); };
  const deleteEntry = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));

  // Stats
  const last7 = entries.slice(0, 7);
  const avgMood = last7.length ? (last7.reduce((s, e) => s + e.mood.value, 0) / last7.length).toFixed(1) : null;
  const topTag = (() => {
    const freq: Record<string, number> = {};
    entries.forEach(e => e.tags.forEach(t => { freq[t] = (freq[t] || 0) + 1; }));
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0];
  })();

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl mb-8 bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '25px 25px' }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <NotebookPen className="h-4 w-4" />
              <span className="text-sm font-bold">Tu espacio privado</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-2">Diario Emocional</h1>
            <p className="text-white/80 text-base max-w-md">Registra cómo te sientes cada día. Solo tú puedes ver tus entradas — guardadas en tu dispositivo.</p>
          </div>
        </div>

        {/* Stats */}
        {entries.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <div className="text-2xl font-black text-slate-800">{entries.length}</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">Entradas</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <div className="text-2xl font-black text-slate-800">{avgMood ?? '—'}</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">Estado promedio</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <div className="text-lg font-black text-slate-800 truncate">{topTag ?? '—'}</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">Tema frecuente</div>
            </div>
          </div>
        )}

        {/* Mood trend mini bar */}
        {last7.length > 1 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-pink-500" />
              <span className="text-sm font-black text-slate-700">Tendencia últimos 7 días</span>
            </div>
            <div className="flex items-end gap-2 h-12">
              {[...last7].reverse().map((e, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg transition-all" style={{ height: `${(e.mood.value / 5) * 40}px`, background: e.mood.color, opacity: 0.8 }} />
                  <span className="text-[10px] text-slate-400">{e.mood.emoji}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New entry button / form */}
        {!writing ? (
          <button
            onClick={() => setWriting(true)}
            className="w-full flex items-center gap-3 bg-white rounded-2xl border-2 border-dashed border-pink-200 p-5 text-left hover:border-pink-400 hover:bg-pink-50/30 transition-all duration-200 mb-6 group"
          >
            <div className="h-10 w-10 rounded-xl bg-pink-50 flex items-center justify-center group-hover:bg-pink-100 transition-colors">
              <Plus className="h-5 w-5 text-pink-500" />
            </div>
            <div>
              <div className="font-black text-slate-700 text-sm">Nueva entrada</div>
              <div className="text-xs text-slate-400">¿Cómo te sientes hoy?</div>
            </div>
          </button>
        ) : (
          <div className="mb-6">
            <NewEntryForm onSave={addEntry} onCancel={() => setWriting(false)} />
          </div>
        )}

        {/* Entries */}
        <div className="space-y-3">
          {entries.length === 0 && !writing && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📓</div>
              <h3 className="font-black text-slate-700 text-xl mb-2">Tu diario está vacío</h3>
              <p className="text-slate-400 text-sm">Empieza registrando cómo te sientes hoy. Es un hábito poderoso para tu bienestar.</p>
            </div>
          )}
          {entries.map(e => <EntryCard key={e.id} entry={e} onDelete={() => deleteEntry(e.id)} />)}
        </div>

        {entries.length > 0 && (
          <p className="text-center text-xs text-slate-300 mt-6">🔒 Tus entradas se guardan localmente en este dispositivo. Nadie más puede verlas.</p>
        )}
      </div>
    </PublicLayout>
  );
}
