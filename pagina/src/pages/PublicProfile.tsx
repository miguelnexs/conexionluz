import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { api } from '../api/client';
import { safeSaveFeedPosts } from '../hooks/useCommunityPosts';
import { cn, formatTimeAgo } from '@/lib/utils';
import { therapists } from '@/data/mockData';
import { ExpandableText } from '@/components/ui/ExpandableText';
import { PostDetailModal, CommentItem } from '@/components/ui/PostDetailModal';
import { CustomVideoPlayer } from '@/components/ui/CustomVideoPlayer';
import { ShareMenuModal } from '@/components/ui/ShareMenuModal';
import {
  Sun,
  Wind,
  Send,
  ArrowLeft,
  Calendar,
  Sparkles,
  Heart,
  MessageCircle,
  Pencil,
  Trash2,
  HeartHandshake,
  Activity,
  Camera,
  BookOpen,
  Lock,
  PlayCircle,
  Settings,
  LogOut,
  User,
  ChevronRight,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sliders,
  Move,
  GitBranch,
  RotateCcw,
  Check,
  Sprout,
  Smile,
  Video,
  Maximize2,
  Share2,
  X
} from 'lucide-react';


import { calcularDiagnosticoArbol, DiagnosticResultEngine } from '../utils/arbolDiagnosticoMotor';

const isVideoMedia = (url?: string): boolean => {
  if (!url) return false;
  const lower = url.toLowerCase().trim();
  if (lower.startsWith('data:')) {
    return lower.startsWith('data:video/');
  }
  if (lower.startsWith('blob:')) {
    return true;
  }
  if (lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('vimeo.com')) {
    return true;
  }
  const videoExtensions = ['.mp4', '.webm', '.mov', '.m4v', '.avi', '.mkv', '.ogv', '.3gp'];
  return videoExtensions.some((ext) => lower.includes(ext));
};

interface Comment {
  id: string;
  patientId?: number | null;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

interface Post {
  id: string;
  patientId?: number | null;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
  feeling?: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  isSystemPost?: boolean;
}

const FEELINGS_LIST = [
  { emoji: '🌱', label: 'En calma', color: 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)] hover:border-emerald-300' },
  { emoji: '⚡', label: 'Con energía', color: 'bg-amber-50 text-amber-700 border-amber-100 shadow-[0_0_15px_-3px_rgba(245,158,11,0.15)] hover:border-amber-355 hover:border-amber-300' },
  { emoji: '🌪️', label: 'Abrumado/a', color: 'bg-rose-50 text-rose-700 border-rose-100 shadow-[0_0_15px_-3px_rgba(244,63,94,0.15)] hover:border-rose-300' },
  { emoji: '✨', label: 'Inspirado/a', color: 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-[0_0_15px_-3px_rgba(99,102,241,0.15)] hover:border-indigo-300' },
  { emoji: '💤', label: 'Cansado/a', color: 'bg-slate-50 text-slate-700 border-slate-100 shadow-[0_0_15px_-3px_rgba(71,85,105,0.12)] hover:border-slate-300' },
];

const getPurchaseKey = (slug: string) => `conexionluz:purchased:${slug}`;

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const DailyCheckinCard = ({ onComplete }: { onComplete: (level: string) => void }) => {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSelect = async (level: string) => {
    setSaving(true);
    const res = await api.post('/api/portal/daily-checkin/', { energyLevel: level });
    if (res.ok) {
      if (level === 'tired') setMessage('Está bien sentirse así. Tu cuerpo pide descanso, escúchalo hoy. 💙');
      else if (level === 'low') setMessage('Respira profundo. Recuerda que todo pasa y esto también pasará. Te abrazamos. 🌟');
      else if (level === 'good') setMessage('¡Qué alegría! Mantén esa bonita energía durante todo tu día. ✨');
      else if (level === 'high') setMessage('¡Estás radiante! Aprovecha este impulso para avanzar en tus sueños. 🔥');
      
      setTimeout(() => {
        onComplete(level);
      }, 4000);
    }
    setSaving(false);
  };

  if (message) {
    return (
      <div className="mb-8 rounded-2xl sm:rounded-[2.5rem] bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 p-6 sm:p-8 md:p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 flex items-center justify-center text-center">
        <p className="text-lg sm:text-xl font-bold text-gray-800 animate-pulse">{message}</p>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-2xl sm:rounded-[2.5rem] bg-white border border-gray-100 p-6 sm:p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Activity className="w-32 h-32 text-primary" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Tu Termómetro Emocional</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">¿Cómo está tu energía hoy?</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { id: 'high', label: 'Radiante', emoji: '⚡', color: 'from-amber-400 to-orange-500', glow: 'rgba(245, 158, 11, 0.4)' },
            { id: 'good', label: 'Bien', emoji: '🌤️', color: 'from-emerald-400 to-teal-500', glow: 'rgba(52, 211, 153, 0.4)' },
            { id: 'tired', label: 'Agotado/a', emoji: '☁️', color: 'from-blue-400 to-indigo-500', glow: 'rgba(96, 165, 250, 0.4)' },
            { id: 'low', label: 'Difícil', emoji: '🌧️', color: 'from-slate-400 to-gray-500', glow: 'rgba(148, 163, 184, 0.4)' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => void handleSelect(opt.id)}
              disabled={saving}
              className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 flex flex-col items-center justify-center gap-2"
              style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 25px ${opt.glow}`;
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#f3f4f6';
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br transition-opacity duration-300 pointer-events-none" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
              <span className="text-3xl sm:text-4xl mb-1 group-hover:scale-110 transition-transform duration-300">{opt.emoji}</span>
              <span className="text-sm font-bold text-gray-700">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Question Tree Data Definition ─────────────────────────────────────────────

type TreeNodeOption = {
  id: string;
  label: string;
  emoji: string;
  description: string;
  nextNodeId: string;
  scores: { stress: number; mood: number; sleep: number; energy: number; focus: number };
};

type TreeNode = {
  id: string;
  stepNumber: number;
  stageName: string;
  icon: string;
  title: string;
  subtitle: string;
  compassionNote: string;
  options: TreeNodeOption[];
};

type TreePathHistoryItem = {
  nodeId: string;
  nodeTitle: string;
  optionId: string;
  optionLabel: string;
  emoji: string;
};

const QUESTION_TREE: Record<string, TreeNode> = {
  root: {
    id: 'root',
    stepNumber: 1,
    stageName: 'Tierra & Raíces',
    icon: '🌱',
    title: '¿Cuál es tu Necesidad Dominante o búsqueda prioritaria hoy?',
    subtitle: 'El Árbol Interior explora la necesidad legítima que intenta ser satisfecha en tu momento presente.',
    compassionNote: 'Respira con calma. Toda necesidad humana es legítima y merece ser escuchada sin juicio.',
    options: [
      {
        id: 'opt_stress',
        label: 'Seguridad y Protección',
        emoji: '🛡️',
        description: 'Tranquilidad, resguardo ante la incertidumbre o reducción de la tensión y la alerta.',
        nextNodeId: 'node_heridas_vigilante',
        scores: { stress: 45, mood: 20, sleep: 25, energy: 20, focus: 25 },
      },
      {
        id: 'opt_mood',
        label: 'Pertenencia y Vínculo Afectivo',
        emoji: '🤝',
        description: 'Sentirme acompañado/a, superando la soledad interna o la sensación de falta de apoyo.',
        nextNodeId: 'node_heridas_caminante',
        scores: { stress: 20, mood: 50, sleep: 20, energy: 25, focus: 20 },
      },
      {
        id: 'opt_sleep',
        label: 'Reconocimiento y Valía Personal',
        emoji: '🌟',
        description: 'Autovaloración, soltar la autoexigencia extrema y descansar sin culpabilidad.',
        nextNodeId: 'node_heridas_guerrero',
        scores: { stress: 35, mood: 20, sleep: 45, energy: 35, focus: 20 },
      },
      {
        id: 'opt_coherencia',
        label: 'Coherencia y Autenticidad',
        emoji: '⚖️',
        description: 'Soltar la rigidez y el temor al error para expresarme con total libertad.',
        nextNodeId: 'node_heridas_prisionero',
        scores: { stress: 25, mood: 25, sleep: 20, energy: 30, focus: 40 },
      },
      {
        id: 'opt_growth',
        label: 'Sentido y Propósito Existencial',
        emoji: '🔮',
        description: 'Comprender el significado profundo de mis vivencias y trascender el vacío.',
        nextNodeId: 'node_heridas_explorador',
        scores: { stress: 15, mood: 20, sleep: 15, energy: 30, focus: 50 },
      },
      {
        id: 'opt_direccion',
        label: 'Dirección y Claridad de Rumbo',
        emoji: '🧭',
        description: 'Claridad en mis próximos pasos, superando la dispersión o la postergación.',
        nextNodeId: 'node_heridas_navegante',
        scores: { stress: 20, mood: 25, sleep: 20, energy: 40, focus: 45 },
      },
    ],
  },

  // ── STEP 2: HERIDAS ORGANIZADORAS ──
  node_heridas_vigilante: {
    id: 'node_heridas_vigilante',
    stepNumber: 2,
    stageName: 'Grietas de las Raíces',
    icon: '🪵',
    title: '¿Qué experiencia o vivencia del pasado activó tu necesidad de protección?',
    subtitle: 'Comprender la herida primaria origen ayuda a desarmar el control automático.',
    compassionNote: 'Toda estrategia de protección fue una respuesta inteligente para sobrevivir en su momento.',
    options: [
      {
        id: 'opt_s_mental',
        label: 'Experiencias de Impredecibilidad o Traición',
        emoji: '👁️',
        description: 'Aprendí que confiar plenamente era peligroso y que debía vigilarlo todo.',
        nextNodeId: 'node_savia_verguenza',
        scores: { stress: 35, mood: 15, sleep: 25, energy: 15, focus: 35 },
      },
      {
        id: 'opt_s_somatic',
        label: 'Sobrecarga de Responsabilidad Temprana',
        emoji: '🏋️',
        description: 'Tuve que asumir el control y cuidar de otros antes de tiempo.',
        nextNodeId: 'node_savia_verguenza',
        scores: { stress: 40, mood: 10, sleep: 30, energy: 25, focus: 15 },
      },
    ],
  },

  node_heridas_caminante: {
    id: 'node_heridas_caminante',
    stepNumber: 2,
    stageName: 'Grietas de las Raíces',
    icon: '🪵',
    title: '¿De dónde proviene la sensación de soledad o distancia afectiva?',
    subtitle: 'Identificar la marca del Abandono permite reconstruir el verdadero autoacompañamiento.',
    compassionNote: 'No estás solo/a en este momento; tu historia merece ser abrazada.',
    options: [
      {
        id: 'opt_m_apathy',
        label: 'Distancia o Separación Afectiva Temprana',
        emoji: '🍂',
        description: 'Sentí que debía buscar fuera el calor y la presencia que me faltaban dentro.',
        nextNodeId: 'node_savia_verguenza',
        scores: { stress: 15, mood: 45, sleep: 15, energy: 30, focus: 25 },
      },
      {
        id: 'opt_m_grief',
        label: 'Transiciones de Vida o Duelos no Procesados',
        emoji: '🌧️',
        description: 'Conservo una nostalgia profunda de un momento donde me sentía en plenitud.',
        nextNodeId: 'node_savia_verguenza',
        scores: { stress: 25, mood: 50, sleep: 20, energy: 20, focus: 15 },
      },
    ],
  },

  node_heridas_guerrero: {
    id: 'node_heridas_guerrero',
    stepNumber: 2,
    stageName: 'Grietas de las Raíces',
    icon: '🪵',
    title: '¿Qué alimentó la necesidad de demostrar constantemente tu valor?',
    subtitle: 'La Herida de Humillación o Desvalorización enseña que valemos solo por lo que rendimos.',
    compassionNote: 'Tu valor es intrínseco. No necesitas ganar tu derecho a existir.',
    options: [
      {
        id: 'opt_m_burnout',
        label: 'Entorno de Exigencia Condicionada',
        emoji: '🪫',
        description: 'Aprendí que el afecto o la aprobación dependían exclusivamente de mis logros.',
        nextNodeId: 'node_savia_verguenza',
        scores: { stress: 40, mood: 25, sleep: 30, energy: 40, focus: 20 },
      },
      {
        id: 'opt_sl_fatigue',
        label: 'Experiencias de Crítica o Humillación',
        emoji: '🥱',
        description: 'Construí una armadura de hiperactividad para no sentirme vulnerable o inferior.',
        nextNodeId: 'node_savia_verguenza',
        scores: { stress: 30, mood: 20, sleep: 35, energy: 45, focus: 20 },
      },
    ],
  },

  node_heridas_prisionero: {
    id: 'node_heridas_prisionero',
    stepNumber: 2,
    stageName: 'Grietas de las Raíces',
    icon: '🪵',
    title: '¿Por qué aprendiste a ocultar o filtrar tu espontaneidad auténtica?',
    subtitle: 'La Herida de Rechazo e Injusticia crea prisiones mentales defensivas.',
    compassionNote: 'Es seguro mostrarte. Tu verdad es valiosa tal como es.',
    options: [
      {
        id: 'opt_s_emotional',
        label: 'Temor al Rechazo o Exclusión Social',
        emoji: '🔥',
        description: 'Aprendí a adaptarme o volverme invisible para evitar ser criticado o juzgado.',
        nextNodeId: 'node_savia_verguenza',
        scores: { stress: 30, mood: 35, sleep: 15, energy: 20, focus: 20 },
      },
      {
        id: 'opt_sl_init',
        label: 'Normas Rígidas e Injustas de Perfección',
        emoji: '🕰️',
        description: 'Sentí que cualquier error me expondría al rechazo, por lo que busqué la perfección.',
        nextNodeId: 'node_savia_verguenza',
        scores: { stress: 35, mood: 15, sleep: 40, energy: 25, focus: 30 },
      },
    ],
  },

  node_heridas_explorador: {
    id: 'node_heridas_explorador',
    stepNumber: 2,
    stageName: 'Grietas de las Raíces',
    icon: '🪵',
    title: '¿Por qué la mente se convirtió en tu principal refugio?',
    subtitle: 'Racionalizar suele ser una forma de proteger el corazón de sentir demasiado.',
    compassionNote: 'Saber no sustituye a sentir. El cuerpo también es una fuente de sabiduría.',
    options: [
      {
        id: 'opt_g_calm',
        label: 'Emociones Abrumadoras no Procesadas',
        emoji: '🧘',
        description: 'Descubrí que analizando el porqué de las cosas lograba distanciarme del dolor.',
        nextNodeId: 'node_savia_verguenza',
        scores: { stress: 15, mood: 15, sleep: 15, energy: 25, focus: 50 },
      },
      {
        id: 'opt_g_journal',
        label: 'Búsqueda de Coherencia e Injusticia Existencial',
        emoji: '📓',
        description: 'Necesitaba entender las razones detrás de situaciones que no tenían sentido.',
        nextNodeId: 'node_savia_verguenza',
        scores: { stress: 20, mood: 25, sleep: 10, energy: 20, focus: 45 },
      },
    ],
  },

  node_heridas_navegante: {
    id: 'node_heridas_navegante',
    stepNumber: 2,
    stageName: 'Grietas de las Raíces',
    icon: '🪵',
    title: '¿En qué momento sentiste que perdiste la brújula o dirección personal?',
    subtitle: 'La Desorientación aparece cuando probamos rumbos sin anclaje en el centro.',
    compassionNote: 'No saber el destino final no te impide dar el siguiente paso con valor.',
    options: [
      {
        id: 'opt_sl_interr',
        label: 'Giros Inesperados o Ruptura de Planes',
        emoji: '🦉',
        description: 'Mi rumbo cambió drásticamente y desde entonces me cuesta mantener una dirección fija.',
        nextNodeId: 'node_savia_verguenza',
        scores: { stress: 25, mood: 20, sleep: 40, energy: 30, focus: 20 },
      },
      {
        id: 'opt_g_guidance',
        label: 'Múltiples Opciones sin Enfoque Unificado',
        emoji: '💬',
        description: 'Exploro muchos caminos pero me cuesta comprometerme a largo plazo con uno.',
        nextNodeId: 'node_savia_verguenza',
        scores: { stress: 20, mood: 30, sleep: 15, energy: 35, focus: 35 },
      },
    ],
  },

  // ── STEP 3: EL MANTO DE VERGÜENZA® & SAVIA INTERNA ──
  node_savia_verguenza: {
    id: 'node_savia_verguenza',
    stepNumber: 3,
    stageName: 'La Savia Interna (El Manto de Vergüenza®)',
    icon: '💧',
    title: '¿Qué aspecto de tu vulnerabilidad sueles ocultar para protegerte?',
    subtitle: 'El Manto de Vergüenza® es el filtro protector que oculta lo que tememos expuesto.',
    compassionNote: 'Detrás de todo ocultamiento hay un deseo profundo de ser aceptado y protegido.',
    options: [
      {
        id: 'opt_f_mild',
        label: 'Mis Temores o Sensación de Inseguridad',
        emoji: '🌱',
        description: 'Oculto mi miedo para mostrarme fuerte, autosuficiente y en control.',
        nextNodeId: 'node_tronco_creencia',
        scores: { stress: 15, mood: 15, sleep: 15, energy: 20, focus: 20 },
      },
      {
        id: 'opt_f_mod',
        label: 'Mi Necesidad de Afecto o Tristeza',
        emoji: '🌊',
        description: 'Oculto mi sensibilidad para no parecer dependiente o abrumar a otros.',
        nextNodeId: 'node_tronco_creencia',
        scores: { stress: 25, mood: 30, sleep: 20, energy: 25, focus: 25 },
      },
      {
        id: 'opt_f_high',
        label: 'Mis Errores e Imperfecciones',
        emoji: '⚡',
        description: 'Oculto la duda o la falla rindiendo al máximo para no ser juzgado.',
        nextNodeId: 'node_tronco_creencia',
        scores: { stress: 45, mood: 35, sleep: 35, energy: 40, focus: 30 },
      },
    ],
  },

  // ── STEP 4: TRONCO & CORTEZA (CREENCIAS NÚCLEO) ──
  node_tronco_creencia: {
    id: 'node_tronco_creencia',
    stepNumber: 4,
    stageName: 'El Tronco y la Corteza',
    icon: '🌳',
    title: '¿Cuál de estas frases resuena más con tu diálogo interno automático?',
    subtitle: 'El tronco sostiene la estructura de la identidad que construiste para responder al entorno.',
    compassionNote: 'Una creencia que te protegió ayer puede cuestionarse compasivamente hoy.',
    options: [
      {
        id: 'opt_c_step1',
        label: '“Debo vigilar y estar en alerta para estar a salvo”',
        emoji: '🛡️',
        description: 'La creencia organizadora del perfil Vigilante centrada en la protección.',
        nextNodeId: 'node_ramas_conductas',
        scores: { stress: 30, mood: 15, sleep: 20, energy: 20, focus: 30 },
      },
      {
        id: 'opt_c_guided',
        label: '“Debo demostrar mi valor a través de mi esfuerzo”',
        emoji: '🏆',
        description: 'La creencia del Guerrero Agotado basada en la valía ligada al rendimiento.',
        nextNodeId: 'node_ramas_conductas',
        scores: { stress: 35, mood: 20, sleep: 30, energy: 35, focus: 25 },
      },
      {
        id: 'opt_c_full',
        label: '“Si me expongo auténticamente sin filtro, seré juzgado”',
        emoji: '🌫️',
        description: 'La creencia del Prisionero Invisible que promueve el ocultamiento.',
        nextNodeId: 'node_ramas_conductas',
        scores: { stress: 25, mood: 35, sleep: 20, energy: 25, focus: 35 },
      },
    ],
  },

  // ── STEP 5: LAS RAMAS EXTERIORES (CONDUCTAS ADAPTATIVAS) ──
  node_ramas_conductas: {
    id: 'node_ramas_conductas',
    stepNumber: 5,
    stageName: 'Las Ramas Exteriores',
    icon: '🌿',
    title: '¿Qué conducta defensiva notas que se activa automáticamente?',
    subtitle: 'Las ramas del árbol representan las acciones repetitivas de protección.',
    compassionNote: 'Al observar tus patrones sin culpa, abres la puerta al cambio consciente.',
    options: [
      {
        id: 'opt_ca_control',
        label: 'Exceso de Control, Hipervigilancia o Rigidez',
        emoji: '🎛️',
        description: 'Intento anticipar cualquier cambio para evitar sorpresas o dolor.',
        nextNodeId: 'node_frutos_luz',
        scores: { stress: 40, mood: 20, sleep: 30, energy: 20, focus: 25 },
      },
      {
        id: 'opt_ca_complacencia',
        label: 'Complacencia, Autosacrificio o Invisibilidad',
        emoji: '🤝',
        description: 'Renuncio a mis necesidades prioritarias para mantener la paz y la aceptación.',
        nextNodeId: 'node_frutos_luz',
        scores: { stress: 25, mood: 40, sleep: 20, energy: 25, focus: 25 },
      },
      {
        id: 'opt_ca_autoexigencia',
        label: 'Autoexigencia Extrema, Sobreesfuerzo o Intelectualización',
        emoji: '🏋️',
        description: 'Lucho incesantemente por rendir o analizar todo sin permitirme parar.',
        nextNodeId: 'node_frutos_luz',
        scores: { stress: 35, mood: 25, sleep: 35, energy: 40, focus: 30 },
      },
    ],
  },

  // ── STEP 6: FRUTOS Y LUZ (SERVICIOS Y RECURSOS) ──
  node_frutos_luz: {
    id: 'node_frutos_luz',
    stepNumber: 6,
    stageName: 'Frutos y Luz Evolutiva',
    icon: '✨',
    title: '¿Qué servicio o práctica te inspiraría integrar desde hoy para tu evolución?',
    subtitle: 'La luz en la copa del árbol representa tu potencial transformador e integración consciente.',
    compassionNote: 'Estás listo/a para dar el paso hacia tu estado evolutivo integrado.',
    options: [
      {
        id: 'opt_serv_relajacion',
        label: 'Relajación & Meditación Guiada',
        emoji: '🧘',
        description: 'Audios clínicos de calma para desarticular la tensión y regular el sistema nervioso.',
        nextNodeId: 'results',
        scores: { stress: 10, mood: 25, sleep: 45, energy: 30, focus: 40 },
      },
      {
        id: 'opt_serv_diario',
        label: 'Diario Emocional Introspectivo',
        emoji: '📓',
        description: 'Procesar El Manto de Vergüenza® en un espacio seguro de desahogo y verdad.',
        nextNodeId: 'results',
        scores: { stress: 15, mood: 45, sleep: 20, energy: 25, focus: 45 },
      },
      {
        id: 'opt_serv_ejercicios',
        label: 'Ejercicios Guiados de Transformación',
        emoji: '🏋️',
        description: 'Paso a paso para cultivar tu Virtud Evolutiva y soltar los obstáculos.',
        nextNodeId: 'results',
        scores: { stress: 20, mood: 30, sleep: 20, energy: 45, focus: 40 },
      },
      {
        id: 'opt_serv_consulta',
        label: 'Acompañamiento Terapéutico Profesional',
        emoji: '💬',
        description: 'Profundizar en tu informe con orientación humana personalizada.',
        nextNodeId: 'results',
        scores: { stress: 25, mood: 35, sleep: 25, energy: 35, focus: 35 },
      },
    ],
  },
};

const TreeDiagnosticTest = ({
  firstName,
  userKey,
  onCompleted,
  onClose,
}: {
  firstName: string;
  userKey: string;
  onCompleted: () => void;
  onClose?: () => void;
}) => {
  const storageKey = `conexionluz:user_diagnostic:${userKey.toLowerCase().replace(/\s+/g, '_')}`;

  const [savedUserRecord, setSavedUserRecord] = useState<any | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [mode, setMode] = useState<'view' | 'test'>(savedUserRecord ? 'view' : 'test');
  const [currentNodeId, setCurrentNodeId] = useState<string>('root');
  const [historyPath, setHistoryPath] = useState<TreePathHistoryItem[]>([]);
  const [scores, setScores] = useState({ stress: 20, mood: 20, sleep: 20, energy: 20, focus: 20 });
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [animatingBranch, setAnimatingBranch] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [leavesVisible, setLeavesVisible] = useState(false);
  const [panelVisible, setPanelVisible] = useState(true);
  const [panelKey, setPanelKey] = useState(0);
  const [rippleId, setRippleId] = useState<string | null>(null);

  const currentNode = QUESTION_TREE[currentNodeId];
  const isResults = currentNodeId === 'results';
  const treeStep = historyPath.length; // 0-4 steps visible on tree

  React.useEffect(() => {
    setLeavesVisible(true);
  }, []);

  const handleSelectOption = (option: TreeNodeOption) => {
    if (animatingBranch) return;
    setSelectedOption(option.id);
    setRippleId(option.id);
    setAnimatingBranch(true);
    // Slide panel out
    setPanelVisible(false);

    setTimeout(() => {
      setScores(prev => ({
        stress: Math.min(100, prev.stress + option.scores.stress),
        mood: Math.min(100, prev.mood + option.scores.mood),
        sleep: Math.min(100, prev.sleep + option.scores.sleep),
        energy: Math.min(100, prev.energy + option.scores.energy),
        focus: Math.min(100, prev.focus + option.scores.focus),
      }));

      const newHistoryItem: TreePathHistoryItem = {
        nodeId: currentNode.id,
        nodeTitle: currentNode.stageName,
        optionId: option.id,
        optionLabel: option.label,
        emoji: option.emoji,
      };
      setHistoryPath(prev => [...prev, newHistoryItem]);
      setCurrentNodeId(option.nextNodeId);
      setAnimatingBranch(false);
      setSelectedOption(null);
      setRippleId(null);
      // Slide next panel in
      setPanelKey(k => k + 1);
      setPanelVisible(true);
    }, 620);
  };

  const handleBackToNode = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= historyPath.length) return;
    const targetNodeId = historyPath[targetIndex].nodeId;
    setHistoryPath(prev => prev.slice(0, targetIndex));
    setCurrentNodeId(targetNodeId);
  };

  const handleResetTree = () => {
    setPanelVisible(false);
    setTimeout(() => {
      setCurrentNodeId('root');
      setHistoryPath([]);
      setScores({ stress: 20, mood: 20, sleep: 20, energy: 20, focus: 20 });
      setSelectedOption(null);
      setAnimatingBranch(false);
      setPanelKey(k => k + 1);
      setPanelVisible(true);
    }, 300);
  };

  const generateDiagnosticSummary = () => {
    if (historyPath.length === 0) return 'Evaluación general realizada.';
    const focusArea = historyPath[0]?.optionLabel || 'Bienestar integral';
    const detail = historyPath[1]?.optionLabel || 'Atención personal';
    const freq = historyPath[2]?.optionLabel || 'Frecuencia moderada';
    const coping = historyPath[3]?.optionLabel || 'Autogestión';

    return `Diagnóstico Integral de Bienestar (Test en Árbol):
• Área de Enfoque Principal: ${focusArea}
• Manifestación: ${detail}
• Frecuencia / Intensidad: ${freq}
• Disposición: ${coping}

Resumen:
Hola ${firstName}, tu evaluación indica un enfoque prioritario en ${focusArea.toLowerCase()}, expresado principalmente a través de ${detail.toLowerCase()} con una intensidad ${freq.toLowerCase()}.
Te recomendamos priorizar el registro en tu Diario Emocional, prácticas de relajación guiada y considerar agendar una sesión de apoyo para profundizar en tu proceso.`;
  };

  const handleSaveDiagnostic = async () => {
    setIsSaving(true);
    const summaryText = generateDiagnosticSummary();
    const formattedDate = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

    const userRecord = {
      id: `diag_${Date.now()}`,
      userName: firstName,
      date: formattedDate,
      timestamp: Date.now(),
      historyPath,
      scores,
      summary: summaryText,
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(userRecord));
      setSavedUserRecord(userRecord);
    } catch (e) {
      console.error('Error saving user diagnostic record locally:', e);
    }

    const res = await api.post<{ completed: boolean; summary: string }>('/api/portal/intake/', {
      answers: scores,
      summary: summaryText,
    });

    setIsSaving(false);
    if (res.ok) {
      setSavedSuccess(true);
      setTimeout(() => {
        onCompleted();
        setMode('view');
      }, 1200);
    }
  };

  // Tree branch path points — trunk + 4 branching levels
  // Each level has left and right branch targets
  const TRUNK_X = 240;
  const TRUNK_Y_START = 440;
  const TRUNK_Y_END = 320;

  // Branch endpoints per step (growing upward)
  const branchLevels = [
    { y: 300, leftX: 140, rightX: 340 },
    { y: 230, leftX: 100, rightX: 380 },
    { y: 170, leftX: 80,  rightX: 400 },
    { y: 120, leftX: 60,  rightX: 420 },
  ];

  const getTreePath = (step: number) => {
    // Returns how far up the trunk + branches grow based on progress
    return step;
  };

  const activeBranches = getTreePath(treeStep);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f8faf8] text-slate-800 font-sans flex flex-col">
      {/* Animated CSS Keyframes */}
      <style>{`
        @keyframes sway { 0%,100%{transform:rotate(-0.8deg) translateX(0)} 33%{transform:rotate(0.8deg) translateX(1px)} 66%{transform:rotate(-0.5deg) translateX(-1px)} }
        @keyframes leaf-float { 0%,100%{transform:translateY(0) rotate(-4deg) scale(1)} 50%{transform:translateY(-8px) rotate(4deg) scale(1.06)} }
        @keyframes branch-grow { 0%{stroke-dashoffset:200;opacity:0.3} 40%{opacity:1} 100%{stroke-dashoffset:0;opacity:1} }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.4)} 50%{box-shadow:0 0 0 10px rgba(16,185,129,0)} }
        @keyframes climb-up { 0%{transform:translateY(28px) scale(0.75);opacity:0} 55%{transform:translateY(-4px) scale(1.06);opacity:1} 100%{transform:translateY(0) scale(1);opacity:1} }
        @keyframes answer-bubble { 0%{transform:translateY(0) scale(1);opacity:1} 30%{transform:translateY(-16px) scale(1.1);opacity:1} 70%{transform:translateY(-32px) scale(1.05);opacity:0.7} 100%{transform:translateY(-55px) scale(0.8);opacity:0} }
        @keyframes trunk-grow { from{stroke-dashoffset:300;opacity:0} 30%{opacity:0.7} to{stroke-dashoffset:0;opacity:1} }
        @keyframes sparkle-pop { 0%{transform:scale(0);opacity:0} 50%{transform:scale(1.15);opacity:1} 100%{transform:scale(1);opacity:0.9} }
        @keyframes root-pulse { 0%,100%{opacity:0.25;transform:scaleX(1)} 50%{opacity:0.55;transform:scaleX(1.04)} }
        @keyframes fade-up { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slide-out-left { 0%{opacity:1;transform:translateX(0) scale(1)} 100%{opacity:0;transform:translateX(-28px) scale(0.97)} }
        @keyframes slide-in-right { 0%{opacity:0;transform:translateX(28px) scale(0.97)} 100%{opacity:1;transform:translateX(0) scale(1)} }
        @keyframes step-reveal { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
        @keyframes ripple-ring { 0%{transform:scale(0.8);opacity:0.7;border-width:3px} 100%{transform:scale(2.2);opacity:0;border-width:1px} }
        @keyframes dot-move { 0%{opacity:0;transform:scale(0.5)} 60%{opacity:1;transform:scale(1.2)} 100%{opacity:1;transform:scale(1)} }
        @keyframes card-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.0)} 50%{box-shadow:0 0 0 6px rgba(16,185,129,0.15)} }
        @keyframes cloud-drift { 0%{transform:translateX(0)} 50%{transform:translateX(12px)} 100%{transform:translateX(0)} }
        @keyframes cloud-drift-slow { 0%{transform:translateX(0)} 50%{transform:translateX(-8px)} 100%{transform:translateX(0)} }
        @keyframes bird-fly { 0%{transform:translateX(0) translateY(0)} 25%{transform:translateX(8px) translateY(-4px)} 50%{transform:translateX(18px) translateY(0)} 75%{transform:translateX(26px) translateY(-3px)} 100%{transform:translateX(36px) translateY(0);opacity:0} }
        @keyframes grass-sway { 0%,100%{transform:rotate(-3deg) scaleY(1)} 50%{transform:rotate(3deg) scaleY(1.04)} }
        .sway { animation: sway 5s ease-in-out infinite; transform-origin: bottom center; }
        .leaf-float { animation: leaf-float 3.5s ease-in-out infinite; }
        .branch-grow { stroke-dasharray:200; animation: branch-grow 0.85s cubic-bezier(0.22,1,0.36,1) forwards; }
        .pulse-glow { animation: pulse-glow 1.8s ease-in-out infinite; }
        .climb-up { animation: climb-up 0.65s cubic-bezier(0.34,1.45,0.64,1) forwards; }
        .answer-bubble { animation: answer-bubble 0.65s cubic-bezier(0.4,0,0.2,1) forwards; }
        .trunk-grow { stroke-dasharray:300; animation: trunk-grow 1.4s cubic-bezier(0.22,1,0.36,1) forwards; }
        .sparkle-pop { animation: sparkle-pop 0.65s cubic-bezier(0.34,1.4,0.64,1) forwards; }
        .root-pulse { animation: root-pulse 3.5s ease-in-out infinite; }
        .fade-up { animation: fade-up 0.5s cubic-bezier(0.22,1,0.36,1) forwards; }
        .panel-out { animation: slide-out-left 0.3s cubic-bezier(0.4,0,1,1) forwards; }
        .panel-in { animation: slide-in-right 0.4s cubic-bezier(0.22,1,0.36,1) forwards; }
        .step-reveal { animation: step-reveal 0.4s cubic-bezier(0.22,1,0.36,1) forwards; }
        .ripple-ring { animation: ripple-ring 0.7s cubic-bezier(0.4,0,0.2,1) forwards; border-radius:1rem; border:3px solid #10b981; position:absolute; inset:0; pointer-events:none; }
        .dot-move { animation: dot-move 0.5s cubic-bezier(0.34,1.45,0.64,1) forwards; }
        .card-pulse { animation: card-pulse 1.2s ease-in-out 1; }
        .cloud-drift { animation: cloud-drift 7s ease-in-out infinite; }
        .cloud-drift-slow { animation: cloud-drift-slow 11s ease-in-out infinite; }
        .bird-fly { animation: bird-fly 6s linear infinite; }
        .grass-sway { animation: grass-sway 2.5s ease-in-out infinite; transform-origin: bottom center; }
      `}</style>

      {/* Soft background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/40 via-transparent to-teal-50/30 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-emerald-300/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-teal-300/8 blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10 shrink-0 flex items-center justify-between gap-4 px-4 sm:px-8 py-4 border-b border-slate-200/70 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all flex items-center gap-2 text-xs font-bold"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Mi Perfil</span>
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xl">🌳</span>
            <div>
              <div className="text-sm font-black text-slate-900">Test del Árbol</div>
              <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Diagnóstico de Bienestar</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress pips */}
          {mode === 'test' && !isResults && (
            <div className="hidden sm:flex items-center gap-1.5">
              {[0,1,2,3,4,5].map(i => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-500",
                    i < treeStep ? "bg-emerald-500 scale-110" : i === treeStep ? "bg-emerald-300 animate-pulse" : "bg-slate-200"
                  )}
                />
              ))}
            </div>
          )}
          {historyPath.length > 0 && mode === 'test' && (
            <button
              onClick={handleResetTree}
              className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-all text-xs font-bold flex items-center gap-1.5"
              title="Reiniciar árbol"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="relative z-10 flex-1 overflow-y-auto lg:overflow-hidden flex flex-col min-h-0">
        {/* ===== VIEW MODE: Saved Record ===== */}
        {mode === 'view' && savedUserRecord ? (
          <div className="flex-1 overflow-y-auto min-h-0">
          <div className="max-w-3xl mx-auto px-4 py-8 pb-24 space-y-6 fade-up">
            <div className="text-center space-y-2">
              <div className="text-5xl mb-3">🌳</div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider">
                🌱 Tu Diagnóstico Personal Registrado
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Árbol de {savedUserRecord.userName}
              </h2>
              <p className="text-slate-500 text-sm font-medium">Evaluado el {savedUserRecord.date}</p>
            </div>

            {savedUserRecord.historyPath?.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                  <GitBranch className="h-4 w-4 text-emerald-600" /> Tu Camino en el Árbol
                </div>
                <div className="flex flex-col gap-2">
                  {savedUserRecord.historyPath.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">{i+1}</div>
                      <span className="text-base">{item.emoji}</span>
                      <div>
                        <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">{item.nodeTitle}</div>
                        <div className="text-sm font-bold text-slate-800">{item.optionLabel}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {savedUserRecord.scores && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700">
                  <Activity className="h-4 w-4" /> Balanza de Estado Personal
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: 'Estrés / Tensión', value: savedUserRecord.scores.stress, color: 'bg-rose-500' },
                    { label: 'Equilibrio Emocional', value: savedUserRecord.scores.mood, color: 'bg-indigo-500' },
                    { label: 'Calidad de Descanso', value: savedUserRecord.scores.sleep, color: 'bg-blue-500' },
                    { label: 'Energía', value: savedUserRecord.scores.energy, color: 'bg-teal-500' },
                    { label: 'Claridad Mental', value: savedUserRecord.scores.focus, color: 'bg-emerald-500' },
                  ].map(item => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>{item.label}</span><span>{item.value}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", item.color)} style={{ width: `${Math.max(10, item.value)}%`, transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <Sparkles className="h-4 w-4 text-emerald-600" /> Tu Informe Personalizado
              </div>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-medium">{savedUserRecord.summary}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pb-6">
              <button
                onClick={() => { handleResetTree(); setMode('test'); }}
                className="flex-1 py-4 px-6 rounded-xl font-black text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                🌳 Nuevo Diagnóstico
              </button>
              <Link to="/actividades/diario" className="py-4 px-6 rounded-xl font-bold text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all text-center flex items-center justify-center">
                Ir al Diario Emocional
              </Link>
            </div>
          </div>
          </div>
        ) : (
          /* ===== TEST MODE ===== */
          <div className="flex-1 relative lg:flex lg:flex-row h-full min-h-0">

            {/* ── Tree Panel: BACKGROUND on mobile, LEFT SIDEBAR on desktop */}
            <div
              className="
                /* Mobile: absolute background, barely visible */
                absolute inset-0 opacity-[0.12] pointer-events-none
                /* Desktop: normal sidebar */
                lg:relative lg:opacity-100 lg:pointer-events-auto
                lg:w-[480px] xl:w-[540px] shrink-0 flex flex-col items-center justify-between
                bg-gradient-to-b from-sky-100/70 via-emerald-50/50 to-emerald-100/80
                lg:border-r border-slate-200/60 overflow-hidden min-h-0
              "
            >
              {/* Sky clouds */}
              <div className="absolute top-5 left-10 w-28 h-8 bg-white/60 rounded-full blur-md opacity-80" />
              <div className="absolute top-12 right-16 w-20 h-5 bg-white/50 rounded-full blur-sm opacity-60" />
              <div className="absolute top-3 left-1/2 w-16 h-6 bg-white/40 rounded-full blur-sm opacity-50" />

              {/* Ambient light glow */}
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-sky-200/30 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-emerald-200/30 to-transparent pointer-events-none" />

              {/* Floating leaves */}
              {leavesVisible && [0,1,2,3,4,5,6,7].map(i => (
                <div
                  key={i}
                  className="absolute select-none pointer-events-none leaf-float"
                  style={{
                    left: `${8 + (i * 12) % 82}%`,
                    top: `${4 + (i * 13) % 55}%`,
                    fontSize: `${14 + (i*4)%12}px`,
                    opacity: 0.18 + (i%3)*0.06,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${3.5 + i * 0.4}s`,
                  }}
                >
                  {['🍃','🍀','🌿','🍃','🌱'][i%5]}
                </div>
              ))}

              {/* Animated Answer bubble floating up */}
              {animatingBranch && (
                <div
                  className="absolute bottom-48 left-1/2 -translate-x-1/2 z-20 text-3xl answer-bubble pointer-events-none"
                  style={{ animationDuration: '0.65s' }}
                >
                  {historyPath[historyPath.length - 1]?.emoji || '🌿'}
                </div>
              )}

              {/* ── DOMINANT SVG TREE ── */}
              <div className="flex-1 flex flex-col items-center justify-end w-full px-4 pt-4 min-h-0" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <svg
                  viewBox="0 0 520 560"
                  className="w-full max-w-[420px] xl:max-w-[480px] sway"
                  style={{
                    filter: 'drop-shadow(0 12px 32px rgba(16,185,129,0.18)) drop-shadow(0 4px 12px rgba(120,85,15,0.12))',
                  }}
                >
                  {/* ── Sky gradient background ── */}
                  <defs>
                    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.5" />
                      <stop offset="60%" stopColor="#d1fae5" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.15" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="520" height="560" fill="url(#skyGrad)" />

                  {/* ── Clouds ── */}
                  {/* Cloud 1 — large, left */}
                  <g className="cloud-drift" style={{ animationDuration: '8s' }}>
                    <ellipse cx="80" cy="55" rx="38" ry="18" fill="white" opacity="0.88" />
                    <ellipse cx="108" cy="48" rx="28" ry="20" fill="white" opacity="0.92" />
                    <ellipse cx="52" cy="58" rx="22" ry="14" fill="white" opacity="0.80" />
                    <ellipse cx="130" cy="56" rx="18" ry="13" fill="white" opacity="0.78" />
                    <ellipse cx="90" cy="65" rx="45" ry="12" fill="white" opacity="0.60" />
                  </g>
                  {/* Cloud 2 — medium, right */}
                  <g className="cloud-drift-slow" style={{ animationDuration: '11s', animationDelay: '2s' }}>
                    <ellipse cx="400" cy="42" rx="30" ry="15" fill="white" opacity="0.80" />
                    <ellipse cx="424" cy="36" rx="22" ry="16" fill="white" opacity="0.85" />
                    <ellipse cx="378" cy="46" rx="18" ry="11" fill="white" opacity="0.72" />
                    <ellipse cx="442" cy="44" rx="14" ry="10" fill="white" opacity="0.65" />
                    <ellipse cx="408" cy="52" rx="36" ry="10" fill="white" opacity="0.50" />
                  </g>
                  {/* Cloud 3 — small, center-right */}
                  <g className="cloud-drift" style={{ animationDuration: '13s', animationDelay: '4s' }}>
                    <ellipse cx="310" cy="28" rx="20" ry="10" fill="white" opacity="0.70" />
                    <ellipse cx="328" cy="23" rx="15" ry="11" fill="white" opacity="0.75" />
                    <ellipse cx="294" cy="30" rx="13" ry="8" fill="white" opacity="0.60" />
                    <ellipse cx="318" cy="35" rx="24" ry="7" fill="white" opacity="0.45" />
                  </g>

                  {/* ── Birds (tiny V shapes flying across) ── */}
                  <g className="bird-fly" style={{ animationDuration: '9s', animationDelay: '1s' }}>
                    <path d="M160 80 Q163 76 166 80" stroke="#475569" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
                    <path d="M170 74 Q173 70 176 74" stroke="#475569" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4" />
                  </g>
                  <g className="bird-fly" style={{ animationDuration: '12s', animationDelay: '5s' }}>
                    <path d="M60 100 Q63 96 66 100" stroke="#64748b" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4" />
                  </g>

                  {/* ── Ground / Soil ── */}
                  <ellipse cx="260" cy="550" rx="180" ry="16" fill="#d1fae5" opacity="0.5" className="root-pulse" />
                  <ellipse cx="260" cy="550" rx="130" ry="11" fill="#6ee7b7" opacity="0.3" className="root-pulse" style={{ animationDelay: '0.4s' }} />
                  <ellipse cx="260" cy="553" rx="90" ry="7" fill="#34d399" opacity="0.4" />

                  {/* ── GROUND GRASS STRIPS ── */}
                  {/* Left side grass */}
                  {[65,80,95,110,125,140,155].map((x, i) => (
                    <path key={i}
                      d={`M${x} 553 Q${x-4} ${538 - (i%3)*4} ${x} ${524 - (i%2)*3}`}
                      stroke="#22c55e" strokeWidth={2 + (i%2)} fill="none" strokeLinecap="round"
                      opacity={0.55 + (i%3)*0.1}
                      className="grass-sway"
                      style={{ animationDelay: `${i * 0.18}s`, animationDuration: `${2.2 + i*0.15}s` }}
                    />
                  ))}
                  {/* Right side grass */}
                  {[365,380,395,410,425,440,455].map((x, i) => (
                    <path key={i}
                      d={`M${x} 553 Q${x+4} ${538 - (i%3)*4} ${x} ${524 - (i%2)*3}`}
                      stroke="#16a34a" strokeWidth={2 + (i%2)} fill="none" strokeLinecap="round"
                      opacity={0.5 + (i%3)*0.1}
                      className="grass-sway"
                      style={{ animationDelay: `${i * 0.2}s`, animationDuration: `${2.4 + i*0.12}s` }}
                    />
                  ))}

                  {/* ── LEFT BUSH ── */}
                  {/* Bush base/shadow */}
                  <ellipse cx="110" cy="544" rx="55" ry="12" fill="#15803d" opacity="0.2" />
                  {/* Bush body — layered circles */}
                  <circle cx="85"  cy="530" r="22" fill="#16a34a" opacity="0.90" />
                  <circle cx="108" cy="524" r="26" fill="#22c55e" opacity="0.88" />
                  <circle cx="130" cy="529" r="20" fill="#16a34a" opacity="0.85" />
                  <circle cx="72"  cy="535" r="16" fill="#15803d" opacity="0.80" />
                  <circle cx="145" cy="534" r="15" fill="#15803d" opacity="0.78" />
                  <circle cx="95"  cy="516" r="16" fill="#4ade80" opacity="0.70" />
                  <circle cx="118" cy="512" r="18" fill="#34d399" opacity="0.65" />
                  <circle cx="108" cy="508" r="10" fill="#86efac" opacity="0.55" />
                  {/* Bush highlight dots */}
                  <circle cx="100" cy="518" r="5" fill="#bbf7d0" opacity="0.50" />
                  <circle cx="120" cy="514" r="4" fill="#bbf7d0" opacity="0.45" />
                  {/* Small flower on bush */}
                  <circle cx="134" cy="520" r="4" fill="#fde68a" opacity="0.90" />
                  <circle cx="134" cy="516" r="3" fill="#fbbf24" opacity="0.80" />

                  {/* ── RIGHT BUSH ── */}
                  <ellipse cx="400" cy="544" rx="55" ry="12" fill="#15803d" opacity="0.2" />
                  <circle cx="375" cy="530" r="20" fill="#15803d" opacity="0.85" />
                  <circle cx="396" cy="524" r="26" fill="#22c55e" opacity="0.88" />
                  <circle cx="418" cy="529" r="22" fill="#16a34a" opacity="0.90" />
                  <circle cx="362" cy="534" r="15" fill="#15803d" opacity="0.78" />
                  <circle cx="432" cy="534" r="16" fill="#15803d" opacity="0.80" />
                  <circle cx="386" cy="516" r="18" fill="#34d399" opacity="0.65" />
                  <circle cx="408" cy="512" r="16" fill="#4ade80" opacity="0.70" />
                  <circle cx="397" cy="507" r="10" fill="#86efac" opacity="0.55" />
                  <circle cx="382" cy="518" r="5" fill="#bbf7d0" opacity="0.50" />
                  <circle cx="408" cy="514" r="4" fill="#bbf7d0" opacity="0.45" />
                  {/* Small flower on right bush */}
                  <circle cx="376" cy="521" r="4" fill="#fda4af" opacity="0.90" />
                  <circle cx="376" cy="517" r="3" fill="#fb7185" opacity="0.80" />

                  {/* ── Small wildflowers on ground ── */}
                  {[[175,548,"#fde68a"],[195,546,"#fda4af"],[320,547,"#fde68a"],[340,549,"#c4b5fd"],[358,546,"#fda4af"]].map(([x,y,fill],i)=>(
                    <g key={i}>
                      <circle cx={x} cy={y} r={4} fill={fill as string} opacity={0.85} />
                      <circle cx={x} cy={y} r={2} fill="#fbbf24" opacity={0.9} />
                      <path d={`M${x} ${y+4} L${x} ${(y as number)+10}`} stroke="#22c55e" strokeWidth="1.5" opacity="0.7" />
                    </g>
                  ))}

                  {/* ── Root System ── */}
                  <path d="M245 540 Q210 548 175 545 Q155 545 140 552" stroke="#92400e" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.5" />
                  <path d="M255 542 Q230 555 205 555" stroke="#a16207" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.35" />
                  <path d="M275 540 Q310 548 345 545 Q365 545 380 552" stroke="#92400e" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.5" />
                  <path d="M265 542 Q290 555 315 555" stroke="#a16207" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.35" />
                  <path d="M250 544 Q240 560 225 562" stroke="#a16207" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.25" />
                  <path d="M270 544 Q280 560 295 562" stroke="#a16207" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.25" />

                  {/* ── MAIN TRUNK — THICK & DOMINANT ── */}
                  {/* Shadow/depth layer */}
                  <path
                    d="M268 542 C266 500 264 465 262 430 C260 400 257 370 255 340 C253 315 252 295 254 272 C256 252 258 238 260 222"
                    stroke="#78350f"
                    strokeWidth="34"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.25"
                  />
                  {/* Main trunk */}
                  <path
                    d="M260 542 C258 500 256 465 254 430 C252 400 249 370 247 340 C245 315 244 295 246 272 C248 252 252 238 254 222"
                    stroke="#92400e"
                    strokeWidth="28"
                    fill="none"
                    strokeLinecap="round"
                    className="trunk-grow"
                  />
                  {/* Highlight stripe */}
                  <path
                    d="M255 530 C254 495 253 460 252 430 C251 400 250 375 250 350 C250 325 251 305 252 285"
                    stroke="#b45309"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.4"
                    className="trunk-grow"
                  />
                  {/* Bark texture lines */}
                  <path d="M257 510 C256 490 255 470 254 450" stroke="#78350f" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.35" />
                  <path d="M263 500 C262 480 261 460 260 440" stroke="#78350f" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.25" />
                  <path d="M258 480 Q270 475 268 468" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.3" />
                  <path d="M256 430 Q244 425 246 418" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.3" />
                  {/* Knot */}
                  <ellipse cx="252" cy="390" rx="6" ry="4" fill="#78350f" opacity="0.35" />

                  {/* ── LEVEL 1 BRANCHES (step 1) — Fat & Wide ── */}
                  {activeBranches >= 1 && (
                    <>
                      {/* Left branch — thick, sweeping */}
                      <path
                        d="M249 345 C228 328 200 318 168 310 C148 305 128 305 108 308"
                        stroke="#92400e" strokeWidth="16" fill="none" strokeLinecap="round"
                        className="branch-grow" style={{ animationDuration: '0.9s' }}
                      />
                      <path
                        d="M249 345 C228 328 200 318 168 310 C148 305 128 305 108 308"
                        stroke="#b45309" strokeWidth="5" fill="none" strokeLinecap="round"
                        opacity="0.3" className="branch-grow" style={{ animationDuration: '0.9s' }}
                      />
                      {/* Right branch */}
                      <path
                        d="M249 345 C270 328 300 318 332 312 C352 307 374 306 396 308"
                        stroke="#92400e" strokeWidth="16" fill="none" strokeLinecap="round"
                        className="branch-grow" style={{ animationDuration: '0.9s', animationDelay: '0.12s' }}
                      />
                      <path
                        d="M249 345 C270 328 300 318 332 312 C352 307 374 306 396 308"
                        stroke="#b45309" strokeWidth="5" fill="none" strokeLinecap="round"
                        opacity="0.3" className="branch-grow" style={{ animationDuration: '0.9s', animationDelay: '0.12s' }}
                      />
                      {/* LEFT foliage cluster — lush */}
                      {[
                        [108,295,28],[90,308,20],[96,322,16],[78,316,13],
                        [118,282,16],[70,302,12],[106,332,11]
                      ].map(([cx,cy,r],i) => (
                        <circle key={i} cx={cx} cy={cy} r={r}
                          fill={['#4ade80','#22c55e','#16a34a','#86efac','#34d399','#4ade80','#22c55e'][i]}
                          opacity={0.9 - i*0.07} className="sparkle-pop"
                          style={{ animationDelay: `${0.65+i*0.08}s` }} />
                      ))}
                      {/* RIGHT foliage cluster */}
                      {[
                        [396,295,28],[414,308,20],[408,322,16],[426,316,13],
                        [386,282,16],[434,302,12],[398,332,11]
                      ].map(([cx,cy,r],i) => (
                        <circle key={i} cx={cx} cy={cy} r={r}
                          fill={['#34d399','#4ade80','#22c55e','#86efac','#16a34a','#34d399','#4ade80'][i]}
                          opacity={0.9 - i*0.07} className="sparkle-pop"
                          style={{ animationDelay: `${0.75+i*0.08}s` }} />
                      ))}
                      <text x="85" y="275" fontSize="18" textAnchor="middle" className="sparkle-pop" style={{ animationDelay: '1s' }}>
                        {historyPath[0]?.emoji || ''}
                      </text>
                    </>
                  )}

                  {/* ── LEVEL 2 BRANCHES (step 2) ── */}
                  {activeBranches >= 2 && (
                    <>
                      <path
                        d="M247 295 C224 278 196 268 162 262 C142 258 120 258 98 260"
                        stroke="#a16207" strokeWidth="12" fill="none" strokeLinecap="round"
                        className="branch-grow" style={{ animationDuration: '0.85s' }}
                      />
                      <path
                        d="M247 295 C224 278 196 268 162 262 C142 258 120 258 98 260"
                        stroke="#ca8a04" strokeWidth="4" fill="none" strokeLinecap="round"
                        opacity="0.3" className="branch-grow" style={{ animationDuration: '0.85s' }}
                      />
                      <path
                        d="M247 295 C270 278 298 268 332 262 C352 258 374 258 398 260"
                        stroke="#a16207" strokeWidth="12" fill="none" strokeLinecap="round"
                        className="branch-grow" style={{ animationDuration: '0.85s', animationDelay: '0.12s' }}
                      />
                      <path
                        d="M247 295 C270 278 298 268 332 262 C352 258 374 258 398 260"
                        stroke="#ca8a04" strokeWidth="4" fill="none" strokeLinecap="round"
                        opacity="0.3" className="branch-grow" style={{ animationDuration: '0.85s', animationDelay: '0.12s' }}
                      />
                      {[
                        [98,248,24],[80,260,18],[86,274,14],[68,268,12],
                        [108,238,14],[62,255,11],[95,282,10]
                      ].map(([cx,cy,r],i) => (
                        <circle key={i} cx={cx} cy={cy} r={r}
                          fill={['#22c55e','#16a34a','#4ade80','#86efac','#22c55e','#15803d','#4ade80'][i]}
                          opacity={0.92 - i*0.06} className="sparkle-pop"
                          style={{ animationDelay: `${0.6+i*0.07}s` }} />
                      ))}
                      {[
                        [398,248,24],[416,260,18],[410,274,14],[428,268,12],
                        [388,238,14],[434,255,11],[401,282,10]
                      ].map(([cx,cy,r],i) => (
                        <circle key={i} cx={cx} cy={cy} r={r}
                          fill={['#10b981','#22c55e','#16a34a','#34d399','#4ade80','#059669','#22c55e'][i]}
                          opacity={0.92 - i*0.06} className="sparkle-pop"
                          style={{ animationDelay: `${0.7+i*0.07}s` }} />
                      ))}
                      <text x="76" y="230" fontSize="18" textAnchor="middle" className="sparkle-pop" style={{ animationDelay: '0.95s' }}>
                        {historyPath[1]?.emoji || ''}
                      </text>
                    </>
                  )}

                  {/* ── LEVEL 3 BRANCHES (step 3) ── */}
                  {activeBranches >= 3 && (
                    <>
                      <path
                        d="M248 258 C228 242 202 234 172 228 C152 224 130 223 108 225"
                        stroke="#a16207" strokeWidth="10" fill="none" strokeLinecap="round"
                        className="branch-grow" style={{ animationDuration: '0.8s' }}
                      />
                      <path
                        d="M248 258 C268 242 294 234 324 228 C344 224 368 223 392 225"
                        stroke="#a16207" strokeWidth="10" fill="none" strokeLinecap="round"
                        className="branch-grow" style={{ animationDuration: '0.8s', animationDelay: '0.12s' }}
                      />
                      {[
                        [108,212,22],[90,223,16],[96,236,13],[74,228,11],
                        [118,202,13],[68,218,10],[103,244,9]
                      ].map(([cx,cy,r],i) => (
                        <circle key={i} cx={cx} cy={cy} r={r}
                          fill={['#16a34a','#22c55e','#4ade80','#15803d','#22c55e','#16a34a','#4ade80'][i]}
                          opacity={0.93 - i*0.06} className="sparkle-pop"
                          style={{ animationDelay: `${0.55+i*0.07}s` }} />
                      ))}
                      {[
                        [392,212,22],[410,223,16],[404,236,13],[426,228,11],
                        [382,202,13],[432,218,10],[397,244,9]
                      ].map(([cx,cy,r],i) => (
                        <circle key={i} cx={cx} cy={cy} r={r}
                          fill={['#059669','#10b981','#22c55e','#065f46','#16a34a','#059669','#22c55e'][i]}
                          opacity={0.93 - i*0.06} className="sparkle-pop"
                          style={{ animationDelay: `${0.65+i*0.07}s` }} />
                      ))}
                      <text x="86" y="196" fontSize="18" textAnchor="middle" className="sparkle-pop" style={{ animationDelay: '0.9s' }}>
                        {historyPath[2]?.emoji || ''}
                      </text>
                    </>
                  )}

                  {/* ── LEVEL 4 BRANCHES + MASSIVE CROWN (step 4) ── */}
                  {activeBranches >= 4 && (
                    <>
                      <path
                        d="M250 228 C232 212 210 204 184 198 C164 194 144 194 124 196"
                        stroke="#a16207" strokeWidth="8" fill="none" strokeLinecap="round"
                        className="branch-grow" style={{ animationDuration: '0.75s' }}
                      />
                      <path
                        d="M250 228 C268 212 290 204 316 198 C336 194 358 194 380 196"
                        stroke="#a16207" strokeWidth="8" fill="none" strokeLinecap="round"
                        className="branch-grow" style={{ animationDuration: '0.75s', animationDelay: '0.12s' }}
                      />
                      {/* Massive multi-layer canopy */}
                      <ellipse cx="254" cy="185" rx="140" ry="100" fill="#14532d" opacity="0.08" className="sparkle-pop" style={{ animationDelay: '0.4s' }} />
                      <ellipse cx="254" cy="178" rx="118" ry="84" fill="#15803d" opacity="0.14" className="sparkle-pop" style={{ animationDelay: '0.5s' }} />
                      <ellipse cx="254" cy="170" rx="96" ry="70" fill="#16a34a" opacity="0.22" className="sparkle-pop" style={{ animationDelay: '0.6s' }} />
                      <ellipse cx="254" cy="162" rx="76" ry="56" fill="#22c55e" opacity="0.35" className="sparkle-pop" style={{ animationDelay: '0.7s' }} />
                      <ellipse cx="254" cy="152" rx="56" ry="42" fill="#4ade80" opacity="0.5" className="sparkle-pop" style={{ animationDelay: '0.8s' }} />
                      <ellipse cx="254" cy="140" rx="38" ry="30" fill="#86efac" opacity="0.65" className="sparkle-pop" style={{ animationDelay: '0.9s' }} />
                      {/* Individual crown leaf clusters */}
                      {[
                        [204,148,20],[170,162,16],[186,130,14],
                        [304,148,20],[338,162,16],[318,130,14],
                        [254,110,22],[226,120,15],[282,120,15],
                      ].map(([cx,cy,r],i) => (
                        <circle key={i} cx={cx} cy={cy} r={r}
                          fill={['#22c55e','#16a34a','#4ade80','#10b981','#059669','#22c55e','#4ade80','#34d399','#22c55e'][i]}
                          opacity={0.7 - i*0.02} className="sparkle-pop"
                          style={{ animationDelay: `${0.75+i*0.07}s` }} />
                      ))}
                      {/* Top glow star */}
                      <circle cx="254" cy="90" r="18" fill="#fde047" opacity="0.85" className="sparkle-pop" style={{ animationDelay: '1.1s' }} />
                      <circle cx="254" cy="90" r="12" fill="#fbbf24" opacity="0.9" className="sparkle-pop" style={{ animationDelay: '1.2s' }} />
                      <text x="254" y="97" fontSize="18" textAnchor="middle" className="sparkle-pop" style={{ animationDelay: '1.3s' }}>⭐</text>
                      <text x="120" y="188" fontSize="18" textAnchor="middle" className="sparkle-pop" style={{ animationDelay: '0.95s' }}>
                        {historyPath[3]?.emoji || ''}
                      </text>
                    </>
                  )}

                  {/* ── Smooth gliding dot on trunk ── */}
                  {!isResults && (
                    <>
                      <circle
                        cx="254" cy={542 - treeStep * 68}
                        r="18" fill="none" stroke="#059669" strokeWidth="2"
                        opacity="0.2"
                        style={{ transition: 'cy 0.9s cubic-bezier(0.34,1.3,0.64,1)' }}
                      />
                      <circle
                        cx="254" cy={542 - treeStep * 68}
                        r="14" fill="#10b981" opacity="0.3"
                        className="pulse-glow"
                        style={{ transition: 'cy 0.9s cubic-bezier(0.34,1.3,0.64,1)' }}
                      />
                      <circle
                        cx="254" cy={542 - treeStep * 68}
                        r="8" fill="#ecfdf5" stroke="#059669" strokeWidth="2.5"
                        className="dot-move"
                        style={{ transition: 'cy 0.9s cubic-bezier(0.34,1.3,0.64,1)' }}
                      />
                    </>
                  )}

                  {/* Completion glow */}
                  {isResults && (
                    <>
                      <circle cx="254" cy="140" r="70" fill="#fef9c3" opacity="0.25" className="sparkle-pop" style={{ animationDelay: '0.2s' }} />
                      <text x="254" y="60" fontSize="30" textAnchor="middle" className="sparkle-pop" style={{ animationDelay: '0.5s' }}>🎉</text>
                    </>
                  )}
                </svg>
              </div>

              {/* Step history chips below tree — hidden on mobile */}
              <div className="hidden lg:block w-full px-4 pb-5 pt-3 space-y-1.5">
                {historyPath.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleBackToNode(i)}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/90 border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all text-left step-reveal shadow-sm"
                    style={{ animationDelay: `${i * 0.07}s` }}
                  >
                    <span className="text-lg shrink-0">{item.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider truncate">{item.nodeTitle}</div>
                      <div className="text-xs font-bold text-slate-700 truncate">{item.optionLabel}</div>
                    </div>
                    <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
                  </button>
                ))}
                {historyPath.length === 0 && (
                  <div className="text-center text-xs text-slate-400/80 font-medium py-1.5">
                    🌿 Tus respuestas subirán por el árbol
                  </div>
                )}
              </div>
            </div>


            {/* ── Right Panel: Questions / Results — full-width on mobile, flex-1 on desktop */}
            <div className="relative z-10 flex-1 flex flex-col overflow-y-auto min-h-0">
              {!isResults && currentNode && (
                <div
                  key={panelKey}
                  className={cn(
                    "max-w-2xl mx-auto w-full px-4 sm:px-8 py-4 sm:py-8 flex flex-col gap-4 sm:gap-5",
                    panelVisible ? "panel-in" : "panel-out"
                  )}
                >
                  {/* Stage pill + step counter */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider">
                      <span>{currentNode.icon}</span>
                      <span>Paso {currentNode.stepNumber} de 6 · {currentNode.stageName}</span>
                    </div>
                    {/* Mini step dots */}
                    <div className="flex items-center gap-1.5 sm:hidden">
                      {[0,1,2,3,4,5].map(i => (
                        <div key={i} className={cn(
                          "rounded-full transition-all duration-500",
                          i < treeStep ? "w-4 h-2 bg-emerald-500" : i === treeStep ? "w-4 h-2 bg-emerald-300" : "w-2 h-2 bg-slate-200"
                        )} />
                      ))}
                    </div>
                  </div>

                  {/* Question */}
                  <div className="space-y-1">
                    <h2 className="text-base sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                      {currentNode.title}
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">{currentNode.subtitle}</p>
                  </div>

                  {/* Compassion note */}
                  <div className="flex items-center gap-2 px-3 py-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-emerald-50/80 border border-emerald-200/60 text-emerald-800 text-xs font-semibold">
                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 shrink-0" />
                    <span className="line-clamp-2 sm:line-clamp-none">{currentNode.compassionNote}</span>
                  </div>

                  {/* Options */}
                  <div className="flex flex-col gap-2">
                    {currentNode.options.map((opt, idx) => {
                      const isSelected = selectedOption === opt.id;
                      const isOther = animatingBranch && !isSelected;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption(opt)}
                          disabled={animatingBranch}
                          className={cn(
                            "group relative rounded-xl sm:rounded-2xl border text-left flex items-center gap-3 cursor-pointer overflow-hidden",
                            "px-3 py-2.5 sm:p-5 sm:flex-col sm:gap-3",
                            "transition-all duration-300 ease-out",
                            isSelected
                              ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg shadow-emerald-200/60 scale-[0.98] card-pulse"
                              : isOther
                              ? "border-slate-100 bg-white/60 opacity-40 scale-[0.97] shadow-none"
                              : "border-slate-200/80 bg-white/90 shadow-sm hover:border-emerald-400 hover:bg-emerald-50/30 hover:shadow-md hover:shadow-emerald-100/60"
                          )}
                          style={{ animationDelay: `${idx * 0.06}s` }}
                        >
                          {/* Ripple ring on selected */}
                          {isSelected && <div className="ripple-ring" />}

                          {/* Climbing emoji particle */}
                          {isSelected && (
                            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                              <div
                                className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xl answer-bubble"
                                style={{ animationDuration: '0.65s' }}
                              >{opt.emoji}</div>
                            </div>
                          )}

                          {/* Emoji */}
                          <span className={cn(
                            "shrink-0 transition-all duration-300",
                            isSelected ? "text-2xl sm:text-4xl" : "text-xl sm:text-3xl group-hover:scale-110"
                          )}>{opt.emoji}</span>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <h3 className={cn(
                              "text-sm sm:text-base font-black leading-snug transition-colors duration-200",
                              isSelected ? "text-emerald-800" : "text-slate-900 group-hover:text-emerald-800"
                            )}>{opt.label}</h3>
                            <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed font-medium mt-0.5 line-clamp-2 sm:line-clamp-none">{opt.description}</p>
                          </div>

                          {/* Arrow */}
                          <div className={cn(
                            "w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                            isSelected ? "bg-emerald-600 text-white rotate-90" : "bg-slate-100 text-slate-400 group-hover:bg-emerald-600 group-hover:text-white"
                          )}>
                            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                          </div>

                          {/* Progress bar */}
                          {isSelected && (
                            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width:'100%', animation:'branch-grow 0.6s cubic-bezier(0.22,1,0.36,1) forwards', strokeDasharray:'unset' }}
                              />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Results Screen ── */}
              {isResults && (() => {
                const diagEngine = calcularDiagnosticoArbol(historyPath, scores);
                const perfil = diagEngine.perfilPrincipal;
                const ruta = diagEngine.rutaTransformacion;
                const informe = diagEngine.informeOficialACM10;

                return (
                  <div className="max-w-2xl mx-auto w-full px-4 sm:px-8 py-6 pb-24 space-y-6 fade-up">
                    <div className="text-center space-y-2">
                      <div className="text-5xl mb-2">🌳</div>
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider">
                        Sistema Oficial del Árbol Interior® (Motor ACM-1.0)
                      </div>
                      <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        Informe Diagnóstico Oficial
                      </h2>
                      <p className="text-slate-500 text-sm font-medium max-w-md mx-auto">
                        Evaluación Integral de Adaptación, Recursos y Potencial Evolutivo
                      </p>
                    </div>

                    {/* ÍNDICE GENERAL DEL ÁRBOL (IGA) & MÉTRICAS AIC-60® */}
                    <div className="bg-white border-2 border-emerald-200 rounded-3xl p-6 shadow-lg space-y-4">
                      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Índice General del Árbol (IGA)</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-slate-900">{informe.igaMetrics.igaScore}</span>
                            <span className="text-sm text-slate-400 font-bold">/ 5.0</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={cn("px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider inline-block mb-1 shadow-xs", informe.igaMetrics.igaColor)}>
                            {informe.igaMetrics.igaLabel}
                          </span>
                          <span className="text-xs font-bold text-slate-500 block">Perfil Global: {informe.igaMetrics.perfilGlobal}</span>
                        </div>
                      </div>

                      {/* INDICES IAD & IPE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Índice de Adaptación Defensiva (IAD)</span>
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-black text-[10px]">{informe.seccion9_iad.nivel}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] font-medium leading-relaxed">{informe.seccion9_iad.interpretacion}</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Índice Potencial Evolutivo (IPE)</span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[10px]">{informe.seccion11_ipe.nivel}</span>
                          </div>
                          <p className="text-emerald-900 text-[11px] font-medium leading-relaxed">{informe.seccion11_ipe.interpretacion}</p>
                        </div>
                      </div>
                    </div>

                    {/* TARJETA MAESTRA DEL PERFIL ADAPTATIVO */}
                    <div className={cn(
                      "relative rounded-3xl p-6 sm:p-8 border-2 shadow-xl overflow-hidden bg-gradient-to-br",
                      perfil.colorTheme.border,
                      perfil.colorTheme.bgGradient
                    )}>
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className={cn("px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest border", perfil.colorTheme.badge)}>
                          Perfil Dominante
                        </div>
                        <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <span>Estado Evolutivo:</span>
                          <span className="font-black text-slate-800 underline">{perfil.estadoEvolutivo}</span>
                        </div>
                      </div>

                      <h3 className="text-3xl font-black text-slate-900 mb-2">{perfil.nombre}</h3>
                      <p className="text-slate-700 text-sm font-medium leading-relaxed mb-4">
                        {perfil.descripcionDetallada}
                      </p>

                      {/* PREGUNTA CENTRAL DE REFLEXIÓN (DOC 2) */}
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-6 flex items-start gap-3">
                        <span className="text-2xl shrink-0">💡</span>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 block">Pregunta Central de Reflexión</span>
                          <p className="text-base font-black text-amber-950 italic">"{perfil.preguntaCentral}"</p>
                        </div>
                      </div>

                      {/* MATRIZ DE TRANSFORMACIÓN MAESTRA (DOC 1 & 2) */}
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/80 space-y-4 shadow-sm">
                        <div className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-emerald-600" /> Matriz de Transformación Evolutiva
                          </div>
                          <span className="text-[10px] text-slate-400 font-normal">Edición 1.0</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Necesidad Dominante</span>
                            <span className="font-black text-slate-800 text-sm">{ruta.necesidad}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100">
                            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">Herida Principal</span>
                            <span className="font-black text-rose-900 text-sm">{ruta.herida}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 sm:col-span-2">
                            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Creencia Núcleo</span>
                            <span className="font-bold text-amber-950 italic">{ruta.creencia}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">Emoción Principal</span>
                            <span className="font-black text-indigo-900 text-sm">{ruta.emocion}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-100">
                            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">Obstáculo Principal</span>
                            <span className="font-black text-orange-950 text-sm">{ruta.obstaculo}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 sm:col-span-2">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Virtud Evolutiva a Desarrollar</span>
                            <span className="font-black text-emerald-900 text-sm">{ruta.virtud}</span>
                          </div>
                        </div>

                        {/* OBJETIVO TERAPÉUTICO */}
                        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 block">Objetivo Terapéutico</span>
                          <span className="font-black text-sm block">{ruta.objetivo}</span>
                        </div>
                      </div>
                    </div>

                    {/* EL MANTO DE VERGÜENZA® (DOC 3) */}
                    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                        <Lock className="w-28 h-28 text-purple-300" />
                      </div>

                      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-purple-400" />
                          <span className="text-xs font-black uppercase tracking-widest text-purple-300">El Manto de Vergüenza®</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Modelo Conexión Luz®</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        Mecanismo de regulación protectora que busca ocultar aspectos vulnerables para evitar rechazo o pérdida de valor.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                        <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-1">
                          <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider block">Emoción Oculta</span>
                          <span className="font-bold text-slate-200 text-xs block">{ruta.mantoVerguenza.emocionOculta}</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-1">
                          <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">Necesidad Velada</span>
                          <span className="font-bold text-slate-200 text-xs block">{ruta.mantoVerguenza.necesidadVelada}</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-1">
                          <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider block">Identidad Protegida</span>
                          <span className="font-bold text-slate-200 text-xs block">{ruta.mantoVerguenza.identidadProtegida}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Conductas Adaptativas:</span>
                        {ruta.conductasAdaptativas.map((cond, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/60 text-purple-200 text-[11px] font-bold">
                            🛡️ {cond}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* ANATOMÍA DEL ÁRBOL INTERIOR® (DOC 3) */}
                    <div className="bg-gradient-to-b from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
                      <div className="flex items-center justify-between gap-3 border-b border-emerald-800/80 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🌳</span>
                          <span className="text-xs font-black uppercase tracking-widest text-emerald-300">Anatomía del Árbol Interior®</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Simbolismo Clínico</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-2xl bg-emerald-900/60 border border-emerald-800/60 space-y-1">
                          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">🌱 Tierra (Contexto)</span>
                          <span className="text-emerald-100 font-medium leading-snug block">{ruta.anatomiaArbol.tierra}</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-emerald-900/60 border border-emerald-800/60 space-y-1">
                          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">🪵 Raíces (Necesidades & Herida)</span>
                          <span className="text-emerald-100 font-medium leading-snug block">{ruta.anatomiaArbol.raices}</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-emerald-900/60 border border-emerald-800/60 space-y-1">
                          <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block">💧 Savia (Manto de Vergüenza®)</span>
                          <span className="text-emerald-100 font-medium leading-snug block">{ruta.anatomiaArbol.savia}</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-emerald-900/60 border border-emerald-800/60 space-y-1">
                          <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block">🌳 Tronco (Creencias e Identidad)</span>
                          <span className="text-emerald-100 font-medium leading-snug block">{ruta.anatomiaArbol.tronco}</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-emerald-900/60 border border-emerald-800/60 space-y-1">
                          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">🌿 Ramas (Conductas Adaptativas)</span>
                          <span className="text-emerald-100 font-medium leading-snug block">{ruta.anatomiaArbol.ramas}</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-emerald-900/60 border border-emerald-800/60 space-y-1">
                          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">🍎 Frutos (Resultados)</span>
                          <span className="text-emerald-100 font-medium leading-snug block">{ruta.anatomiaArbol.frutos}</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black text-xs flex items-center gap-3 shadow-md">
                        <span className="text-xl">✨</span>
                        <div>
                          <span className="text-[9px] uppercase tracking-widest text-amber-900 block font-black">Luz Evolutiva</span>
                          <span className="text-sm block">{ruta.anatomiaArbol.luz}</span>
                        </div>
                      </div>
                    </div>

                    {/* SÍNTOMAS Y RECURSOS NATURALES */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
                        <div className="text-xs font-black uppercase tracking-wider text-slate-500">Recursos Naturales</div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {perfil.recursosNaturales.map((rec, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                              ✨ {rec}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
                        <div className="text-xs font-black uppercase tracking-wider text-slate-500">Indicadores de Integración</div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {perfil.indicadoresIntegracion.map((ind, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                              🌱 {ind}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Path chips */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                        <GitBranch className="h-4 w-4 text-emerald-600" /> Ramas Recorridas
                      </div>
                      <div className="flex flex-col gap-2">
                        {historyPath.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 climb-up" style={{ animationDelay: `${i*0.12}s` }}>
                            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">{i+1}</div>
                            <span className="text-base">{item.emoji}</span>
                            <div>
                              <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">{item.nodeTitle}</div>
                              <div className="text-sm font-bold text-slate-800">{item.optionLabel}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Score bars */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700">
                        <Activity className="h-4 w-4" /> Tu Balance Personal
                      </div>
                      <div className="space-y-2.5">
                        {[
                          { label: 'Estrés / Tensión', value: scores.stress, color: 'bg-rose-500' },
                          { label: 'Equilibrio Emocional', value: scores.mood, color: 'bg-indigo-500' },
                          { label: 'Calidad de Descanso', value: scores.sleep, color: 'bg-blue-500' },
                          { label: 'Energía', value: scores.energy, color: 'bg-teal-500' },
                          { label: 'Claridad Mental', value: scores.focus, color: 'bg-emerald-500' },
                        ].map(item => (
                          <div key={item.label} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-600">
                              <span>{item.label}</span><span>{item.value}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={cn("h-full rounded-full transition-all duration-1000", item.color)}
                                style={{ width: `${Math.max(10, item.value)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* RECOMENDACIONES PERSONALIZADAS (SECCIÓN 14 - ACM-1.0) */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800">
                        <Sparkles className="h-4 w-4 text-emerald-600" /> Recomendaciones Personalizadas de Evolución (ACM-1.0)
                      </div>
                      <div className="space-y-2 pt-1">
                        {informe.seccion14_recomendaciones.map((rec, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                            <span className="text-sm shrink-0">🎯</span>
                            <span className="text-xs font-bold text-slate-700 leading-relaxed">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>



                    {/* CONCLUSIÓN OFICIAL (SECCIÓN 15 - ACM-1.0) */}
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 shadow-md space-y-2">
                      <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Conclusión del Sistema Conexión Luz®</div>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium italic">
                        "{informe.seccion15_conclusion}"
                      </p>
                    </div>

                    {/* Summary */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 space-y-2 shadow-sm">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                        <Sparkles className="h-4 w-4 text-emerald-600" /> Síntesis Clínica Diagnóstica
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-medium">{diagEngine.resumenClinico}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pb-8">
                      <button
                        onClick={handleSaveDiagnostic}
                        disabled={isSaving || savedSuccess}
                        className="flex-1 py-4 px-6 rounded-xl font-black text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {savedSuccess ? (
                          <><Check className="h-5 w-5" /> ¡Guardado en tu Perfil!</>
                        ) : isSaving ? 'Guardando...' : (
                          <><GitBranch className="h-5 w-5" /> Guardar Mi Árbol de Bienestar</>
                        )}
                      </button>
                      {onClose && (
                        <button
                          onClick={onClose}
                          className="py-4 px-6 rounded-xl font-bold text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
                        >
                          Volver a Mi Perfil
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>


    </div>
  );
};



const PublicProfile = () => {
  const { name: rawName } = useParams<{ name: string }>();
  const name = decodeURIComponent(rawName || '');
  const navigate = useNavigate();

  const token = typeof window !== 'undefined' ? localStorage.getItem('conexionluz:token') : null;
  const isAuthed = Boolean(token);

  // States
  const [me, setMe] = useState<any | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  
  // Custom Profile Settings State (Cover only)
  const [profileSettings, setProfileSettings] = useState<{
    cover?: string;
    coverY?: number;
    avatarY?: number;
  }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`conexionluz:profile_settings:${name}`);
      return saved ? JSON.parse(saved) : { coverY: 50, avatarY: 50 };
    }
    return { coverY: 50, avatarY: 50 };
  });

  const [editingCoverPosition, setEditingCoverPosition] = useState(false);
  const [editingAvatarPosition, setEditingAvatarPosition] = useState(false);
  const [savingCover, setSavingCover] = useState(false);
  const [hasUnsavedCover, setHasUnsavedCover] = useState(false);

  const coverY = profileSettings.coverY ?? 50;
  const avatarY = profileSettings.avatarY ?? 50;

  // Edit/Delete States
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingPostContent, setEditingPostContent] = useState('');
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  // Profile Post Creator States
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [newPostFile, setNewPostFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadStatusText, setUploadStatusText] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [showFeelingSelector, setShowFeelingSelector] = useState(false);
  const [creatingPost, setCreatingPost] = useState(false);
  const uploadAbortRef = useRef<AbortController | null>(null);


  // Tab State
  const [activeTab, setActiveTab] = useState<'posts' | 'wellbeing' | 'courses' | 'test' | 'settings'>('posts');

  // Personal Wellbeing / Settings Tab States
  const [dailyCheckin, setDailyCheckin] = useState<{hasCheckedIn: boolean, energyLevel: string|null}>({hasCheckedIn: true, energyLevel: null});
  const [profileForm, setProfileForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', birthDate: '', gender: '',
    occupation: '', city: '', address: '', emergencyContactName: '', emergencyContactPhone: '',
    userType: 'miembro'
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  // Followers / Following States
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loadingFollow, setLoadingFollow] = useState(false);

  // Load user details & checkin status
  useEffect(() => {
    if (isAuthed) {
      api.get('/api/portal/me/').then(res => {
        if (res.ok) {
          setMe(res.data);
          if (res.data.coverPictureUrl || res.data.coverPositionY !== undefined) {
            setProfileSettings(prev => ({
              ...prev,
              cover: res.data.coverPictureUrl || prev.cover || '',
              coverY: res.data.coverPositionY ?? prev.coverY ?? 50
            }));
          }
          setProfileForm({
            firstName: res.data.firstName || '',
            lastName: res.data.lastName || '',
            email: res.data.email || '',
            phone: res.data.phone || '',
            birthDate: res.data.birthDate || '',
            gender: res.data.gender || '',
            occupation: res.data.occupation || '',
            city: res.data.city || '',
            address: res.data.address || '',
            emergencyContactName: res.data.emergencyContactName || '',
            emergencyContactPhone: res.data.emergencyContactPhone || '',
            userType: res.data.userType || 'miembro'
          });
        }
      });
      // Load daily checkin status
      api.get<{hasCheckedIn: boolean, energyLevel: string|null}>('/api/portal/daily-checkin/').then(res => {
        if (res.ok) setDailyCheckin(res.data);
      });
    }
  }, [isAuthed]);

  // Load follow status and follower/following counts
  useEffect(() => {
    if (isAuthed && name) {
      api.get<any>(`/api/portal/follow/patient/status/?name=${encodeURIComponent(name)}`).then(res => {
        if (res.ok) {
          setIsFollowing(res.data.isFollowing);
          setFollowersCount(res.data.followersCount);
          setFollowingCount(res.data.followingCount);
          if (res.data.coverPictureUrl || res.data.coverPositionY !== undefined) {
            setProfileSettings(prev => ({
              ...prev,
              cover: res.data.coverPictureUrl || prev.cover || '',
              coverY: res.data.coverPositionY ?? prev.coverY ?? 50
            }));
          }
        }
      });
    }
  }, [isAuthed, name]);

  const handleFollowToggle = async () => {
    if (!isAuthed) {
      navigate('/login');
      return;
    }
    setLoadingFollow(true);
    const res = await api.post<any>('/api/portal/follow/patient/toggle/', { name });
    if (res.ok) {
      setIsFollowing(res.data.isFollowing);
      setFollowersCount(res.data.followersCount);
      setFollowingCount(res.data.followingCount);
    } else {
      alert(res.error || 'Error al procesar la solicitud.');
    }
    setLoadingFollow(false);
  };

  // Load posts helper from backend API with localStorage fallback
  const loadPosts = async () => {
    try {
      const endpoint = isAuthed ? '/api/portal/community-posts/' : '/api/public/community-posts/';
      const res = await api.get<any[]>(endpoint);
      let fetchedPosts: Post[] = [];

      if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
        const myName = me ? `${me.firstName || ''} ${me.lastName || ''}`.trim() : '';
        fetchedPosts = res.data.map(p => {
          const likesList: string[] = [];
          if (p.likedByMe && myName) {
            likesList.push(myName);
          }
          const remainingLikes = (p.likesCount || 0) - likesList.length;
          for (let i = 0; i < remainingLikes; i++) {
            likesList.push(`Usuario ${i}`);
          }
          return {
            id: String(p.id),
            patientId: p.patientId || null,
            authorName: p.authorName || 'Miembro',
            authorAvatar: p.authorAvatarUrl || p.authorAvatar || undefined,
            authorRole: p.authorRole || 'Miembro',
            content: p.content || '',
            feeling: p.feeling || undefined,
            image: p.imageUrl || undefined,
            likes: likesList,
            comments: p.comments ? p.comments.map((c: any) => ({
              id: String(c.id),
              patientId: c.patientId || null,
              authorName: c.authorName || 'Miembro',
              authorAvatar: c.authorAvatarUrl || c.authorAvatar || undefined,
              authorRole: c.authorRole || 'Miembro',
              content: c.content || '',
              createdAt: typeof c.createdAt === 'string' ? c.createdAt : 'reciente'
            })) : [],
            createdAt: typeof p.createdAt === 'string' ? p.createdAt : 'reciente'
          };
        });
      }

      // Merge with localStorage posts if any
      const saved = localStorage.getItem('conexionluz:feed_posts');
      if (saved) {
        try {
          const localPosts: Post[] = JSON.parse(saved);
          const existingIds = new Set(fetchedPosts.map(p => p.id));
          localPosts.forEach(lp => {
            if (!existingIds.has(lp.id)) {
              fetchedPosts.push(lp);
            }
          });
        } catch (e) {
          console.error(e);
        }
      }

      setAllPosts(fetchedPosts);
    } catch (e) {
      console.error("Error cargando destellos en perfil:", e);
      const saved = localStorage.getItem('conexionluz:feed_posts');
      if (saved) {
        try {
          setAllPosts(JSON.parse(saved));
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  useEffect(() => {
    loadPosts();
  }, [name, me, isAuthed]);

  const savePosts = (updatedPosts: Post[]) => {
    setAllPosts(updatedPosts);
    safeSaveFeedPosts(updatedPosts);
  };

  const saveProfileSettings = (settings: typeof profileSettings) => {
    setProfileSettings(settings);
    setHasUnsavedCover(true);
    try {
      localStorage.setItem(`conexionluz:profile_settings:${name}`, JSON.stringify(settings));
    } catch (e) {
      console.error("Error saving profile settings locally:", e);
    }
  };

  const handleSaveCoverToDB = async () => {
    setSavingCover(true);
    try {
      const res = await api.post<any>('/api/portal/me/cover/', {
        cover: profileSettings.cover || '',
        coverPositionY: coverY
      });
      if (res.ok) {
        setHasUnsavedCover(false);
        setEditingCoverPosition(false);
        if (res.data && res.data.coverPictureUrl) {
          setProfileSettings(prev => ({ ...prev, cover: res.data.coverPictureUrl }));
        }
        alert('¡Imagen de portada guardada con éxito en la base de datos!');
      } else {
        alert(res.error || 'Error al guardar la portada en la base de datos.');
      }
    } catch (err) {
      alert('Error al guardar la portada.');
    } finally {
      setSavingCover(false);
    }
  };

  // Filter posts for this specific user
  const decodedName = name ? decodeURIComponent(name).trim() : '';
  const normalizedTargetName = decodedName.toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ');
  const meFullName = me ? `${me.firstName || ''} ${me.lastName || ''}`.trim() : '';
  const normalizedMeFullName = meFullName.toLowerCase().replace(/\s+/g, ' ');

  const isMe = me != null && (
    name === 'mi-perfil' ||
    normalizedMeFullName === normalizedTargetName ||
    (normalizedMeFullName && normalizedTargetName && normalizedMeFullName.includes(normalizedTargetName)) ||
    (normalizedMeFullName && normalizedTargetName && normalizedTargetName.includes(normalizedMeFullName))
  );

  const userPosts = allPosts.filter(post => {
    if (!post) return false;

    // 1. If viewer is viewing own profile (isMe) and post has matching patientId
    if (isMe && me && post.patientId && String(post.patientId) === String(me.id)) {
      return true;
    }

    const postAuthor = (post.authorName || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (!postAuthor) return false;

    // 2. Exact or space/hyphen normalized match with URL target name
    if (postAuthor === normalizedTargetName) return true;

    // 3. Substring match
    if (normalizedTargetName && (postAuthor.includes(normalizedTargetName) || normalizedTargetName.includes(postAuthor))) {
      return true;
    }

    // 4. If viewing own profile, match with logged-in user name
    if (isMe && normalizedMeFullName) {
      if (postAuthor === normalizedMeFullName || postAuthor.includes(normalizedMeFullName) || normalizedMeFullName.includes(postAuthor)) {
        return true;
      }
    }

    return false;
  });

  // Lightbox post detail modal reactive state
  const [selectedLightboxPostId, setSelectedLightboxPostId] = useState<string | null>(null);
  const [sharePostId, setSharePostId] = useState<string | null>(null);
  const [sharePostContent, setSharePostContent] = useState<string>('');
  const videoTimesRef = useRef<Record<string, number>>({});
  const [modalInitialTime, setModalInitialTime] = useState<number>(0);

  const handleOpenLightbox = (post: any, explicitTime?: number) => {
    document.querySelectorAll('video').forEach((v) => {
      try {
        v.pause();
      } catch {}
    });
    const time = typeof explicitTime === 'number' && explicitTime > 0
      ? explicitTime
      : (videoTimesRef.current[post.id] || 0);
    videoTimesRef.current[post.id] = time;
    setModalInitialTime(time);
    setSelectedLightboxPostId(String(post.id));
  };

  const selectedLightboxPost = React.useMemo(() => {
    if (!selectedLightboxPostId) return null;
    return userPosts.find(p => String(p.id) === String(selectedLightboxPostId)) || null;
  }, [selectedLightboxPostId, userPosts]);

  // Find user's avatar from therapist info, latest post, or user profile picture
  const therapistMatch = therapists.find(t => t.name.toLowerCase().includes((name || '').toLowerCase()) || (name || '').toLowerCase().includes(t.name.toLowerCase()));
  const latestPostWithAvatar = userPosts.find(post => post.authorAvatar);
  const userAvatar = isMe 
    ? (me.profilePictureUrl || therapistMatch?.image_url || '') 
    : (latestPostWithAvatar?.authorAvatar || therapistMatch?.image_url || '');
  
  // Determine role: always use live API data for current user; fall back to cached post role for others
  const resolveRole = (userData: any, isPremium: boolean) => {
    if (userData?.occupation?.trim()) {
      const occ = userData.occupation.trim();
      return occ.charAt(0).toUpperCase() + occ.slice(1);
    }
    if (userData?.userType) {
      const ut = userData.userType.toLowerCase();
      if (ut === 'paciente') return 'Paciente';
      if (ut === 'miembro') return isPremium ? 'Miembro Premium ✨' : 'Miembro';
      return userData.userType.charAt(0).toUpperCase() + userData.userType.slice(1);
    }
    return isPremium ? 'Miembro Premium ✨' : 'Miembro';
  };

  const userRole = isMe && me
    ? resolveRole(me, Boolean(me.hasActiveSubscription))
    : (userPosts[0]?.authorRole || 'Miembro de la Comunidad');

  // Stats
  const postsCount = userPosts.length;
  const likesCount = userPosts.reduce((sum, post) => sum + post.likes.length, 0);
  const commentsCount = userPosts.reduce((sum, post) => sum + post.comments.length, 0);

  // Bio and cover styling based on role
  const isTherapist = userRole.includes('Terapeuta') || userRole.includes('Psicó') || userRole.includes('Psiqui');
  
  const coverGradient = isTherapist
    ? 'from-teal-400 via-primary/30 to-accent/40'
    : 'from-indigo-400 via-primary/20 to-amber-300/40';

  const defaultBio = isTherapist
    ? `Guía de Luz y profesional especializado(a) en salud mental, comprometido(a) con brindar herramientas terapéuticas, meditación y acompañamiento compasivo para restaurar el bienestar integral.`
    : `Sembrador(a) en la comunidad Conexión Luz, compartiendo reflexiones, aprendizajes y destellos de bienestar para caminar juntos hacia la sanación.`;

  // Create Post handler for Profile page
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() && !newPostImage && !newPostFile) return;

    // Cancel any previous upload
    if (uploadAbortRef.current) {
      uploadAbortRef.current.abort();
    }
    const abortController = new AbortController();
    uploadAbortRef.current = abortController;

    setCreatingPost(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadStatusText('Preparando publicación...');

    const resetUploadState = (errMsg?: string) => {
      setUploadProgress(null);
      setUploadStatusText('');
      setCreatingPost(false);
      uploadAbortRef.current = null;
      if (errMsg) setUploadError(errMsg);
    };

    if (isAuthed) {
      let response;
      if (newPostFile) {
        const formData = new FormData();
        formData.append('content', newPostContent.trim());
        if (selectedFeeling) formData.append('feeling', selectedFeeling);
        formData.append('file', newPostFile);
        response = await api.postFormWithProgress<any>(
          '/api/portal/community-posts/',
          formData,
          (percent) => {
            if (abortController.signal.aborted) return;
            setUploadProgress(percent);
            if (percent < 96) {
              setUploadStatusText(`Subiendo archivo (${percent}%)...`);
            } else if (percent >= 96 && percent < 100) {
              setUploadStatusText('¡Procesando en el servidor!');
            } else {
              setUploadStatusText('¡Publicado con éxito!');
            }
          },
          abortController.signal
        );
      } else {
        response = await api.post<any>('/api/portal/community-posts/', {
          content: newPostContent.trim(),
          imageUrl: newPostImage || undefined,
          feeling: selectedFeeling || undefined
        });
      }

      if (abortController.signal.aborted) return;

      if (response.ok) {
        setUploadProgress(100);
        setUploadStatusText('¡Publicado con éxito!');
        setTimeout(() => {
          void loadPosts();
          setNewPostContent('');
          setNewPostImage(null);
          setNewPostFile(null);
          setSelectedFeeling(null);
          setShowFeelingSelector(false);
          setUploadError(null);
          resetUploadState();
        }, 500);
        return;
      } else {
        resetUploadState(response.error || 'Error al publicar el destello.');
        return;
      }
    } else {
      const authorName = me ? `${me.firstName} ${me.lastName}` : 'Miembro Invitado';
      const authorAvatar = me?.profilePictureUrl || '';
      const newPost: Post = {
        id: `post-${Date.now()}`,
        patientId: me?.id || null,
        authorName,
        authorAvatar,
        authorRole: userRole,
        content: newPostContent.trim(),
        feeling: selectedFeeling || undefined,
        image: newPostImage || undefined,
        likes: [],
        comments: [],
        createdAt: 'Hace un momento'
      };
      const updated = [newPost, ...allPosts];
      savePosts(updated);
      setNewPostContent('');
      setNewPostImage(null);
      setNewPostFile(null);
      setSelectedFeeling(null);
      setShowFeelingSelector(false);
      setCreatingPost(false);
    }
  };

  // Like handler with API sync
  const handleLikePost = async (postId: string) => {
    if (!isAuthed) {
      navigate('/login');
      return;
    }
    const myName = me ? `${me.firstName} ${me.lastName}` : '';
    const updated = allPosts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(myName);
        const newLikes = isLiked
          ? post.likes.filter(name => name !== myName)
          : [...post.likes, myName];
        return { ...post, likes: newLikes };
      }
      return post;
    });
    savePosts(updated);

    if (!isNaN(Number(postId))) {
      try {
        await api.post(`/api/portal/community-posts/${postId}/like/`, {});
      } catch (err) {
        console.error("Error liking post on API:", err);
      }
    }
  };

  // Comment handler with API sync
  const handleAddComment = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthed) {
      navigate('/login');
      return;
    }
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    const authorName = me ? `${me.firstName} ${me.lastName}` : '';
    const authorAvatar = me?.profilePictureUrl || '';
    const authorRole = me?.hasActiveSubscription ? 'Miembro Premium' : 'Miembro';

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      patientId: me?.id || null,
      authorName,
      authorAvatar,
      authorRole,
      content: commentText,
      createdAt: 'Hace un momento'
    };

    const updated = allPosts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    });
    savePosts(updated);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));

    if (!isNaN(Number(postId))) {
      try {
        const res = await api.post<any>(`/api/portal/community-posts/${postId}/comment/`, { content: commentText });
        if (res.ok) {
          await loadPosts();
        }
      } catch (err) {
        console.error("Error adding comment to backend:", err);
      }
    }
  };

  // Edit post handler with API sync
  const handleEditPostSubmit = async (postId: string) => {
    const post = allPosts.find(p => p.id === postId);
    if (!editingPostContent.trim() && !post?.image) return;
    const updated = allPosts.map(p => {
      if (p.id === postId) {
        return { ...p, content: editingPostContent.trim() };
      }
      return p;
    });
    savePosts(updated);
    setEditingPostId(null);

    if (!isNaN(Number(postId))) {
      try {
        await api.patch(`/api/portal/community-posts/${postId}/`, { content: editingPostContent.trim() });
      } catch (err) {
        console.error("Error editing post on backend:", err);
      }
    }
    setEditingPostContent('');
  };

  // Delete post handler with API sync
  const handleDeletePostSubmit = async (postId: string) => {
    const updated = allPosts.filter(post => post.id !== postId);
    savePosts(updated);
    setDeletingPostId(null);

    if (!isNaN(Number(postId))) {
      try {
        await api.del(`/api/portal/community-posts/${postId}/`);
      } catch (err) {
        console.error("Error deleting post from backend:", err);
      }
    }
  };

  // Edit comment handler
  const handleEditCommentSubmit = async (postId: string, commentId: string) => {
    if (!editingCommentContent.trim()) return;
    const cleanId = String(commentId).replace('comment-', '');
    if (!isNaN(Number(cleanId))) {
      try {
        await api.patch(`/api/portal/community-posts/comments/${cleanId}/`, {
          content: editingCommentContent.trim()
        });
      } catch (err) {
        console.error("Error editing comment on backend:", err);
      }
    }
    const updated = allPosts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(c => {
          if (String(c.id) === String(commentId)) {
            return { ...c, content: editingCommentContent.trim() };
          }
          return c;
        });
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    savePosts(updated);
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  // Delete comment handler
  const handleDeleteCommentSubmit = async (postId: string, commentId: string) => {
    const cleanId = String(commentId).replace('comment-', '');
    if (!isNaN(Number(cleanId))) {
      try {
        await api.delete(`/api/portal/community-posts/comments/${cleanId}/`);
      } catch (err) {
        console.error("Error deleting comment from backend:", err);
      }
    }
    const updated = allPosts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.filter(c => String(c.id) !== String(commentId));
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    savePosts(updated);
    setDeletingCommentId(null);
  };


  // Upload Profile Picture handler
  const handleUploadPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingPicture(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/portal/me/picture/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.ok && me) {
        const newPic = data.data.profilePictureUrl;
        setMe({ ...me, profilePictureUrl: newPic });
        const saved = localStorage.getItem('conexionluz:feed_posts');
        if (saved) {
          try {
            const posts = JSON.parse(saved);
            const userName = `${me.firstName} ${me.lastName}`.trim();
            const updated = posts.map((post: any) => {
              if (post.authorName === userName || post.patientId === me.id) {
                return { ...post, authorAvatar: newPic, authorAvatarUrl: newPic };
              }
              return post;
            });
            safeSaveFeedPosts(updated);
            setAllPosts(updated);
          } catch (err) {
            console.error(err);
          }
        }
      } else {
        alert(data.error || 'Error uploading picture');
      }
    } catch (err) {
      alert('Error uploading picture');
    } finally {
      setUploadingPicture(false);
    }
  };

  // Save Settings handler
  const saveProfile = async () => {
    setSavingProfile(true);
    const res = await api.patch<any>('/api/portal/me/', profileForm);
    if (res.ok) { 
      setMe(res.data);
      // Update local storage posts written by this user
      const saved = localStorage.getItem('conexionluz:feed_posts');
      if (saved) {
        try {
          const posts = JSON.parse(saved);
          const userName = `${res.data.firstName} ${res.data.lastName}`;
          const newRole = res.data.occupation?.trim()
            ? (res.data.occupation.trim().charAt(0).toUpperCase() + res.data.occupation.trim().slice(1))
            : (res.data.userType
              ? (['miembro', 'paciente'].includes(res.data.userType.toLowerCase())
                ? (res.data.userType.toLowerCase() === 'paciente' ? 'Paciente' : (res.data.hasActiveSubscription ? 'Miembro Premium' : 'Miembro'))
                : (res.data.userType.charAt(0).toUpperCase() + res.data.userType.slice(1)))
              : 'Miembro');
          const newAvatar = res.data.profilePictureUrl || '';
          const updated = posts.map((post: any) => {
            if (post.authorName === userName) {
              return { ...post, authorRole: newRole, authorAvatar: newAvatar };
            }
            return post;
          });
          safeSaveFeedPosts(updated);
          setAllPosts(updated); // Sync local state too!
        } catch (e) {
          console.error(e);
        }
      }
      alert('Información guardada exitosamente.');
    } else {
      alert(res.error || 'Error al guardar la información.');
    }
    setSavingProfile(false);
  };

  const getMoodColor = (mood: string | undefined) => {
    if (!mood) return 'border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]';
    const match = FEELINGS_LIST.find(f => f.label === mood);
    return match ? match.color : 'border-slate-100';
  };

  const myName = me ? `${me.firstName} ${me.lastName}` : 'Miembro Invitado';
  const userInitials = name ? `${name.split(' ')[0]?.[0] || ''}${name.split(' ')[1]?.[0] || ''}`.toUpperCase() : 'M';
  const myInitials = me ? `${me.firstName?.[0] || ''}${me.lastName?.[0] || ''}`.toUpperCase() : 'M';

  // Custom styling applications
  const coverStyle: React.CSSProperties = profileSettings.cover
    ? profileSettings.cover.startsWith('data:image') || profileSettings.cover.startsWith('http')
      ? { backgroundImage: `url(${profileSettings.cover})`, backgroundSize: 'cover', backgroundPosition: `center ${coverY}%` }
      : { background: profileSettings.cover }
    : {};

  const hasHipnosis = localStorage.getItem(getPurchaseKey('hipnosis-interdimencional')) === '1';

  return (
    <PublicLayout contentClassName="p-0">
      <div className="w-full px-4 md:px-6 py-6 md:py-8">
        
        {/* Back navigation button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>

        {/* ══════════════════════════════════════════════════════════
            PROFILE HEADER CARD (Facebook Style)
        ══════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden mb-8 relative">
          
          {/* Cover gradient / image (uploaded to this banner box) */}
          <div className={cn("h-48 md:h-64 bg-gradient-to-br relative transition-all duration-300", !profileSettings.cover && coverGradient)} style={coverStyle}>
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-4 right-4 bg-white/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-800 border border-white/20">
              Conexión Luz
            </div>

            {isMe && (
              <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2 z-20">
                <input
                  type="file"
                  id="cover-upload-input"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const compressed = await compressImage(file);
                        saveProfileSettings({ ...profileSettings, cover: compressed });
                      } catch (err) {
                        alert("Error al procesar la imagen de portada: " + (err instanceof Error ? err.message : String(err)));
                      }
                    }
                    e.target.value = '';
                  }}
                />

                <label
                  htmlFor="cover-upload-input"
                  className="bg-white/90 hover:bg-white text-slate-800 font-bold text-xs py-2 px-3.5 rounded-xl shadow-md backdrop-blur-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Camera className="h-3.5 w-3.5 text-slate-600" />
                  <span>Subir Portada</span>
                </label>

                {profileSettings.cover && (
                  <button
                    type="button"
                    onClick={() => setEditingCoverPosition(!editingCoverPosition)}
                    className="bg-white/90 hover:bg-white text-slate-800 font-bold text-xs py-2 px-3.5 rounded-xl shadow-md backdrop-blur-sm transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Move className="h-3.5 w-3.5 text-slate-600" />
                    <span>Ajustar Posición</span>
                  </button>
                )}

                {hasUnsavedCover && (
                  <button
                    type="button"
                    onClick={handleSaveCoverToDB}
                    disabled={savingCover}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2 px-4 rounded-xl shadow-lg backdrop-blur-sm transition-all flex items-center gap-1.5 animate-pulse shrink-0"
                  >
                    <Check className="h-4 w-4" />
                    <span>{savingCover ? 'Guardando...' : 'Guardar Portada'}</span>
                  </button>
                )}

                {editingCoverPosition && (
                  <div className="absolute top-4 left-4 right-4 sm:left-auto sm:right-0 sm:top-auto sm:bottom-full sm:mb-2 bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl p-3.5 flex flex-col gap-2.5 sm:w-64 z-30 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                        <Sliders className="h-3.5 w-3.5 text-primary" /> Posición Vertical
                      </span>
                      <span className="text-xs font-bold text-slate-500">{coverY}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={coverY}
                      onChange={(e) => {
                        saveProfileSettings({ ...profileSettings, coverY: parseInt(e.target.value) });
                      }}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] text-slate-400 font-medium">Desliza y guarda</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingCoverPosition(false)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[10px] py-1 px-2.5 rounded-md transition-all"
                        >
                          Cerrar
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveCoverToDB}
                          disabled={savingCover}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-1 px-3 rounded-lg shadow-sm transition-all flex items-center gap-1"
                        >
                          <Check className="h-3 w-3" />
                          <span>Guardar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Profile details section */}
          <div className="px-6 md:px-12 pb-8 pt-0 relative flex flex-col md:flex-row md:items-end gap-6 -mt-12 md:-mt-16 z-10">
            
            {/* User Avatar with Hover Upload for Owner */}
            <div className="relative shrink-0 group">
              <div className="h-36 w-36 md:h-44 md:w-44 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-slate-50 relative">
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt={name} 
                    className="h-full w-full object-cover" 
                    style={{ objectPosition: `center ${avatarY}%` }}
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-650 text-4xl">
                    {userInitials}
                  </div>
                )}
                {isMe && (
                  <label
                    htmlFor="avatar-upload-input"
                    className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 animate-in fade-in duration-150 cursor-pointer"
                  >
                    <Camera className="h-6 w-6 mb-1" />
                    <span className="text-[10px] font-bold">Cambiar Foto</span>
                  </label>
                )}
              </div>
              
              {isMe && (
                <>
                  <input
                    type="file"
                    id="avatar-upload-input"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadPicture}
                    disabled={uploadingPicture}
                  />

                  {userAvatar && (
                    <button
                      type="button"
                      onClick={() => setEditingAvatarPosition(!editingAvatarPosition)}
                      className="absolute bottom-0 right-11 h-10 w-10 bg-white hover:bg-slate-50 text-slate-700 rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-20 cursor-pointer"
                      title="Ajustar posición de foto de perfil"
                    >
                      <Move className="h-5 w-5 text-slate-650" />
                    </button>
                  )}

                  <label
                    htmlFor="avatar-upload-input"
                    className="absolute bottom-0 right-0 h-10 w-10 bg-white hover:bg-slate-50 text-slate-700 rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-20 cursor-pointer"
                    title="Cambiar Foto de Perfil"
                  >
                    <Camera className="h-5 w-5 text-slate-600" />
                  </label>

                  {editingAvatarPosition && (
                    <div className="absolute top-12 left-0 bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-4 flex flex-col gap-3 w-64 z-30 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                          <Sliders className="h-3.5 w-3.5 text-primary" /> Posición Avatar
                        </span>
                        <span className="text-xs font-bold text-slate-500">{avatarY}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={avatarY}
                        onChange={(e) => {
                          saveProfileSettings({ ...profileSettings, avatarY: parseInt(e.target.value) });
                        }}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingAvatarPosition(false)}
                          className="bg-primary text-white font-bold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg shadow-sm hover:bg-primary/95 transition-all"
                        >
                          Aceptar
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-2 md:pb-3 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-2xl md:text-4.5xl font-black tracking-tight text-slate-800 leading-none">
                  {name}
                </h1>
                
                {/* Role Tag */}
                <span className={cn(
                  'text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider w-fit',
                  isTherapist
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                    : 'bg-slate-100 text-slate-500 border border-slate-200/50'
                )}>
                  {userRole}
                </span>

                {!isMe && (
                  <button
                    type="button"
                    onClick={handleFollowToggle}
                    disabled={loadingFollow}
                    className={cn(
                      "text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm transition-all duration-300 flex items-center gap-1 hover:scale-105 active:scale-95 disabled:opacity-50",
                      isFollowing
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-650 border border-slate-200"
                        : "bg-primary hover:bg-primary/95 text-white"
                    )}
                  >
                    {isFollowing ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Siguiendo</span>
                      </>
                    ) : (
                      <>
                        <User className="h-3 w-3" />
                        <span>Seguir</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Bio snippet */}
              <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
                {defaultBio}
              </p>
            </div>
          </div>

          {/* Stat counters bar */}
          <div className="grid grid-cols-3 sm:grid-cols-5 border-t border-slate-100 bg-slate-50/50 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="py-4 text-center">
              <span className="block text-xl md:text-2xl font-black text-slate-800">{postsCount}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destellos</span>
            </div>
            <div className="py-4 text-center">
              <span className="block text-xl md:text-2xl font-black text-slate-800">{followersCount}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Seguidores</span>
            </div>
            <div className="py-4 text-center">
              <span className="block text-xl md:text-2xl font-black text-slate-800">{followingCount}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Siguiendo</span>
            </div>
            <div className="py-4 text-center">
              <span className="block text-xl md:text-2xl font-black text-slate-800">{likesCount}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Iluminaciones</span>
            </div>
            <div className="py-4 text-center">
              <span className="block text-xl md:text-2xl font-black text-slate-800">{commentsCount}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resonancias</span>
            </div>
          </div>
        </div>

        {/* Tabs - Only for the profile owner */}
        {isMe && (
          <div className="w-full mb-8">
            {/* Mobile: scrollable pill bar */}
            <div className="flex sm:hidden w-full overflow-x-auto scrollbar-hide gap-2 pb-1">
              {[
                { id: 'posts', label: 'Destellos', icon: Sparkles },
                { id: 'wellbeing', label: 'Bienestar', icon: Activity },
                { id: 'courses', label: 'Cursos', icon: BookOpen },
                { id: 'test', label: 'Test', icon: GitBranch },
                { id: 'settings', label: 'Ajustes', icon: Settings },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={cn(
                    'flex items-center gap-1.5 whitespace-nowrap shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300',
                    activeTab === t.id
                      ? 'bg-white shadow-md text-slate-800 border border-slate-200'
                      : 'bg-slate-100/80 text-slate-500'
                  )}
                >
                  <t.icon className={cn('h-3.5 w-3.5 shrink-0', activeTab === t.id ? 'text-primary' : 'text-slate-400')} />
                  {t.label}
                </button>
              ))}
            </div>
            {/* Desktop: pill bar normal */}
            <div className="hidden sm:flex w-fit items-center gap-1 p-1 bg-slate-100/50 backdrop-blur-md rounded-2xl border border-slate-200/20">
              {[
                { id: 'posts', label: 'Mis Destellos', icon: Sparkles },
                { id: 'wellbeing', label: 'Mi Bienestar', icon: Activity },
                { id: 'courses', label: 'Mis Cursos', icon: BookOpen },
                { id: 'test', label: 'Test en Árbol', icon: GitBranch },
                { id: 'settings', label: 'Ajustes', icon: Settings },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={cn(
                    'flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300',
                    activeTab === t.id
                      ? 'bg-white shadow-md text-slate-800 scale-[1.02]'
                      : 'text-slate-500 hover:text-slate-800'
                  )}
                >
                  <t.icon className={cn('h-4 w-4 shrink-0', activeTab === t.id ? 'text-primary' : 'text-slate-400')} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            LAYOUT COLUMNS / TABS CONTENT
        ══════════════════════════════════════════════════════════ */}
        <div className="animate-in fade-in duration-300">
          
          {/* TAB 1: Posts (or Default viewing mode) */}
          {(!isMe || activeTab === 'posts') && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: About card */}
              <aside className="lg:col-span-4 space-y-6">
                
                {/* About card */}
                <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 space-y-5">
                  <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                    <HeartHandshake className="h-4.5 w-4.5 text-primary" />
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                      Presentación
                    </h3>
                  </div>

                  <div className="space-y-4 text-xs font-semibold text-slate-600">
                    <div className="flex items-start gap-3">
                      <Activity className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-slate-800 font-bold">Comunidad</span>
                        <span className="text-slate-400 font-medium">Miembro desde 2026</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-slate-800 font-bold">Estado</span>
                        <span className="text-slate-400 font-medium">{isTherapist ? 'Disponible para sesiones' : 'Activo(a) en el feed'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* RIGHT COLUMN: User Posts Feed */}
              <main className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-primary" />
                    <h2 className="font-black text-slate-700 text-sm uppercase tracking-widest">
                      Destellos de {decodedName.split(' ')[0]} ({userPosts.length})
                    </h2>
                  </div>
                </div>

                {/* Creator card for logged in user's own profile - ONLY if user has permission */}
                {isMe && me?.canPublish && (
                  <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                        {userAvatar ? (
                          <img src={userAvatar} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 text-xs">
                            {me?.firstName?.[0] || 'M'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-bold text-slate-800 block">Comparte un nuevo destello de luz</span>
                        <span className="text-[10px] text-slate-400">¿Qué reflexión o sensación quieres sembrar en la comunidad?</span>
                      </div>
                    </div>

                    <form onSubmit={handleCreatePost} className="space-y-3">
                      <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Escribe tu destello de luz aquí..."
                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-400 focus:bg-white text-sm outline-none resize-none min-h-[90px] transition-all"
                      />

                      {newPostImage && (
                        <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 max-h-64 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 shadow-lg">
                          {/* Cinematic accent bar */}
                          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-emerald-500 z-10" />
                          {newPostFile?.type.startsWith('video/') || newPostImage.startsWith('blob:') && newPostFile?.type.includes('video') ? (
                            <div className="relative">
                              <video src={newPostImage} controls className="w-full max-h-60 object-contain mx-auto" />
                              <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                <span>▶</span> VIDEO
                              </div>
                            </div>
                          ) : (
                            <img src={newPostImage} alt="Post preview" className="w-full h-full object-cover" />
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setNewPostImage(null);
                              setNewPostFile(null);
                            }}
                            className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur-sm text-white rounded-full p-1.5 text-xs hover:bg-rose-600 z-10 transition-all shadow-lg"
                          >
                            ✕
                          </button>
                        </div>
                      )}

                      {/* Upload Progress Bar (White System Design) */}
                      {uploadProgress !== null && (
                        <div className="bg-white text-slate-900 rounded-2xl p-4 shadow-md border border-slate-200/90 animate-in fade-in duration-200 space-y-3">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="relative h-7 w-7 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                                <span className="h-2 w-2 rounded-full bg-indigo-600 animate-ping absolute" />
                                <span className="h-2 w-2 rounded-full bg-indigo-600 relative" />
                              </div>
                              <span className="text-slate-900 font-bold truncate">{uploadStatusText || `Subiendo archivo (${uploadProgress}%)...`}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="tabular-nums font-black text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-xl text-xs">{uploadProgress}%</span>
                              <button
                                type="button"
                                title="Cancelar subida"
                                onClick={() => {
                                  if (uploadAbortRef.current) {
                                    uploadAbortRef.current.abort();
                                    uploadAbortRef.current = null;
                                  }
                                  setUploadProgress(null);
                                  setUploadStatusText('');
                                  setUploadError(null);
                                  setCreatingPost(false);
                                }}
                                className="text-slate-400 hover:text-rose-600 transition-colors rounded-full p-1 hover:bg-rose-50 border border-transparent hover:border-rose-100"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 shadow-inner">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 transition-all duration-300 rounded-full shadow-xs"
                              style={{ width: `${Math.max(4, uploadProgress)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Upload Error Message */}
                      {uploadError && uploadProgress === null && (
                        <div className="flex items-start gap-2 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">
                          <span className="mt-0.5 shrink-0">⚠️</span>
                          <div className="flex-1">
                            <p className="font-bold mb-0.5">Error al subir</p>
                            <p>{uploadError}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setUploadError(null)}
                            className="shrink-0 text-red-400 hover:text-red-600 transition-colors"
                          >✕</button>
                        </div>
                      )}

                      {/* Emotion selector toggle */}
                      {showFeelingSelector && (
                        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                          {FEELINGS_LIST.map(f => (
                            <button
                              key={f.label}
                              type="button"
                              onClick={() => setSelectedFeeling(selectedFeeling === f.label ? null : f.label)}
                              className={cn(
                                'text-xs font-bold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5',
                                selectedFeeling === f.label ? f.color : 'bg-slate-50 text-slate-600 border-slate-200/60'
                              )}
                            >
                              <span>{f.emoji}</span>
                              <span>{f.label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <label className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors flex items-center gap-1 text-xs font-bold">
                            <Camera className="w-4 h-4 text-indigo-500" />
                            <span className="hidden sm:inline">Foto</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setNewPostFile(file);
                                  const objectUrl = URL.createObjectURL(file);
                                  setNewPostImage(objectUrl);
                                }
                                e.target.value = '';
                              }}
                            />
                          </label>

                          <label className="p-2 rounded-xl text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors flex items-center gap-1 text-xs font-bold border border-transparent hover:border-emerald-100">
                            <Video className="w-4 h-4 text-emerald-600" />
                            <span className="hidden sm:inline">Video</span>
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setNewPostFile(file);
                                  const objectUrl = URL.createObjectURL(file);
                                  setNewPostImage(objectUrl);
                                }
                                e.target.value = '';
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => setShowFeelingSelector(!showFeelingSelector)}
                            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-bold"
                          >
                            <Smile className="w-4 h-4 text-amber-500" />
                            <span className="hidden sm:inline">Sentimiento</span>
                          </button>
                        </div>

                        <button
                          type="submit"
                          disabled={creatingPost || (!newPostContent.trim() && !newPostImage && !newPostFile)}
                          className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{creatingPost ? 'Publicando...' : 'Sembrar destello'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {userPosts.length === 0 ? (

                  <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-12 text-center text-slate-400">
                    <Sun className="h-10 w-10 text-slate-300 mx-auto mb-3 animate-spin-slow" />
                    <p className="font-bold text-sm">Este usuario no ha sembrado ningún destello todavía.</p>
                    <p className="text-xs text-slate-400 mt-1">Los destellos de luz aparecerán aquí una vez publicados.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userPosts.map(post => {
                      const isLikedByMe = post.likes.includes(myName);
                      const isCommentsOpen = activeCommentsPostId === post.id;
                      const feelingData = FEELINGS_LIST.find(f => f.label === post.feeling);
                      const displayRole = isMe && me
                        ? resolveRole(me, Boolean(me.hasActiveSubscription))
                        : post.authorRole;

                      return (
                        <article
                          key={post.id}
                          className={cn(
                            'bg-white rounded-3xl border transition-all duration-300 p-5 space-y-4 relative group',
                            getMoodColor(post.feeling)
                          )}
                        >
                          
                          {/* Post Author / Header */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full overflow-hidden shrink-0 border border-slate-200/80 shadow-xs relative z-10">
                                {post.authorAvatar ? (
                                  <img src={post.authorAvatar} alt="Avatar" className="h-full w-full object-cover" />
                                ) : (
                                  <div className="h-full w-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                                    {post.authorName?.[0] || 'M'}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-slate-800 text-sm leading-tight">
                                    {post.authorName}
                                  </span>
                                  <span className={cn(
                                    'text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider',
                                    displayRole.includes('Terapeuta') || displayRole.includes('Psicó') || displayRole.includes('Psiqui')
                                      ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                                      : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                                  )}>
                                    {displayRole}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-400 font-medium block mt-0.5">
                                  {formatTimeAgo(post.createdAt)}
                                </span>
                              </div>
                            </div>

                            {/* Emotion Tag or Edit/Delete Controls */}
                            <div className="flex items-center gap-2">
                              {post.feeling && feelingData && (
                                <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border shadow-xs', feelingData.color)}>
                                  <span>{feelingData.emoji}</span>
                                  <span>{feelingData.label}</span>
                                </span>
                              )}

                              {post.authorName === myName && !post.isSystemPost && (
                                <div className="flex items-center gap-0.5 bg-slate-50 border border-slate-200/60 rounded-xl p-1 shadow-2xs">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingPostId(post.id);
                                      setEditingPostContent(post.content);
                                      setDeletingPostId(null);
                                    }}
                                    className="text-slate-400 hover:text-primary p-1.5 hover:bg-white rounded-lg transition-all cursor-pointer"
                                    title="Editar destello"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDeletingPostId(post.id);
                                      setEditingPostId(null);
                                    }}
                                    className="text-slate-400 hover:text-rose-500 p-1.5 hover:bg-white rounded-lg transition-all cursor-pointer"
                                    title="Eliminar destello"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Post Content / Edit Area */}
                          {deletingPostId === post.id ? (
                            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                              <div className="text-xs text-rose-700 font-bold">
                                ¿Estás seguro de que deseas eliminar este destello? Esta acción no se puede deshacer.
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleDeletePostSubmit(post.id)}
                                  className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] py-1.5 px-4 rounded-xl shadow-sm transition-all"
                                >
                                  Eliminar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletingPostId(null)}
                                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold text-[10px] py-1.5 px-4 rounded-xl shadow-sm transition-all"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : editingPostId === post.id ? (
                            <div className="space-y-3 animate-in fade-in duration-200">
                              <textarea
                                rows={3}
                                value={editingPostContent}
                                onChange={e => setEditingPostContent(e.target.value)}
                                className="w-full text-sm text-slate-700 placeholder-slate-400 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 resize-none transition-all duration-200"
                              />
                              <div className="flex gap-2 justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleEditPostSubmit(post.id)}
                                  disabled={!editingPostContent.trim() && !post.image}
                                  className="bg-gradient-to-r from-primary to-accent text-white font-bold text-[10px] py-1.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                                >
                                  Guardar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingPostId(null);
                                    setEditingPostContent('');
                                  }}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold text-[10px] py-1.5 px-4 rounded-xl shadow-sm transition-all"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {post.content && (
                                <ExpandableText
                                  text={post.content}
                                  className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium"
                                />
                              )}
                              {post.image && (
                                <div className="relative rounded-2xl overflow-hidden mt-3 group/media cursor-pointer">
                                  {isVideoMedia(post.image) ? (
                                    <div className="relative group/vid">
                                      <CustomVideoPlayer
                                        src={post.image}
                                        autoPlay={false}
                                        autoPlayOnScroll={false}
                                        viewsCount={post.viewsCount || 0}
                                        isPaused={Boolean(selectedLightboxPostId)}
                                        onTimeUpdate={(currentTime) => {
                                          videoTimesRef.current[post.id] = currentTime;
                                        }}
                                        onClickContainer={(_e, currentTime) => {
                                          handleOpenLightbox(post, currentTime);
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <div onClick={() => handleOpenLightbox(post)} className="relative group/img">
                                      <img src={post.image} alt="Publicación" loading="lazy" decoding="async" className="w-full h-full object-cover max-h-[560px] group-hover/img:scale-[1.01] transition-transform duration-300" />
                                      <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-1.5 shadow-xl">
                                          <Maximize2 className="h-3.5 w-3.5 text-emerald-400" /> Ver en pantalla completa con comentarios
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}

                          {/* Interactive Actions Row */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-xs text-slate-400">
                            
                            {/* Illuminate Spark (like) button */}
                            <button
                              type="button"
                              onClick={() => handleLikePost(post.id)}
                              className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all duration-200',
                                isLikedByMe
                                  ? 'text-amber-500 bg-amber-50/70 border border-amber-100 shadow-sm scale-102'
                                  : 'hover:bg-slate-50 hover:text-slate-700 text-slate-450'
                              )}
                            >
                              <Sun className={cn('h-4.5 w-4.5', isLikedByMe && 'fill-amber-400 animate-spin-slow text-amber-500')} />
                              <span>Iluminar ({post.likes.length})</span>
                            </button>

                            {/* Sembrar (comment) button */}
                            <button
                              type="button"
                              onClick={() => setActiveCommentsPostId(isCommentsOpen ? null : post.id)}
                              className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer',
                                isCommentsOpen
                                  ? 'text-emerald-600 bg-emerald-50/80 border border-emerald-200 shadow-sm'
                                  : 'hover:bg-slate-50 hover:text-slate-700 text-slate-450'
                              )}
                            >
                              <Sprout className={cn('h-4.5 w-4.5 text-emerald-600', isCommentsOpen && 'fill-emerald-400')} />
                              <span>Sembrar ({post.comments.length})</span>
                            </button>

                            {/* Compartir Button with WhatsApp, Facebook, Instagram and Link Copy */}
                            <button
                              type="button"
                              onClick={() => {
                                setSharePostId(post.id);
                                setSharePostContent(post.content || '');
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold hover:bg-emerald-50 hover:text-emerald-700 text-slate-450 transition-all duration-200 border border-transparent hover:border-emerald-100 cursor-pointer"
                              title="Compartir publicación"
                            >
                              <Share2 className="h-4 w-4 text-emerald-600" />
                              <span>Compartir</span>
                            </button>

                          </div>

                          {/* Resonances (Comments) Accordion */}
                          {isCommentsOpen && (
                            <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-1 duration-200">
                              {/* New resonance input */}
                              {isAuthed ? (
                                <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-lg overflow-hidden shrink-0 border border-slate-150 flex items-center justify-center font-bold text-[10px] text-slate-700 bg-slate-50">
                                    {me?.profilePictureUrl ? (
                                      <img src={me.profilePictureUrl} alt="Avatar" className="h-full w-full object-cover" />
                                    ) : (
                                      myInitials
                                    )}
                                  </div>
                                  <input
                                    type="text"
                                    value={commentInputs[post.id] || ''}
                                    onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                    placeholder="Aporta una resonancia compasiva..."
                                    className="flex-1 bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all"
                                  />
                                  <button
                                    type="submit"
                                    disabled={!commentInputs[post.id]?.trim()}
                                    className={cn(
                                      'p-2 rounded-xl transition-all duration-200 shrink-0',
                                      commentInputs[post.id]?.trim()
                                        ? 'bg-primary text-white hover:scale-[1.05] shadow-sm'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    )}
                                  >
                                    <Send className="h-3.5 w-3.5" />
                                  </button>
                                </form>
                              ) : (
                                <Link
                                  to="/login"
                                  className="flex items-center gap-2 bg-slate-50 border border-slate-150 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                                >
                                  <Wind className="h-3.5 w-3.5 text-sky-400" />
                                  <span>Inicia sesión para aportar una resonancia</span>
                                </Link>
                              )}

                              {/* Resonances list with full multi-level replies, likes, editing & deletion */}
                              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                                {post.comments.length === 0 ? (
                                  <p className="text-[10px] text-slate-400 text-center py-2 italic">
                                    Aún no hay resonancias. Comparte tus palabras de apoyo o reflexión.
                                  </p>
                                ) : (
                                  post.comments.map(comment => (
                                    <CommentItem
                                      key={comment.id}
                                      comment={comment}
                                      postId={post.id}
                                      level={0}
                                      onLikeComment={likeComment}
                                      onAddReply={addReply}
                                      onEditComment={editComment}
                                      onDeleteComment={handleDeleteCommentSubmit}
                                      myName={myName}
                                      isAuthed={isAuthed}
                                    />
                                  ))
                                )}
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </main>
            </div>
          )}

          {/* TAB 2: Wellbeing (Mi Bienestar) */}
          {isMe && activeTab === 'wellbeing' && (
            <div className="max-w-4xl mx-auto space-y-8">
              {!dailyCheckin.hasCheckedIn && (
                <DailyCheckinCard onComplete={(level) => setDailyCheckin({ hasCheckedIn: true, energyLevel: level })} />
              )}
              {me?.intakeSummary ? (
                <div className="group relative rounded-[2.5rem] bg-white border border-slate-200/60 p-8 sm:p-12 shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="absolute top-8 right-8 h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-6">Tu resumen de bienestar</h3>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line italic">
                      "{me.intakeSummary}"
                    </p>
                  </div>
                  <div className="mt-10 flex flex-col sm:flex-row gap-4 pt-10 border-t border-slate-100">
                    <Link to="/agenda" className="w-full sm:w-auto text-center px-8 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:scale-105 transition-all text-sm">
                      Agendar sesión de apoyo
                    </Link>
                    <Link to="/mi-calendario" className="w-full sm:w-auto text-center px-8 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-gray-50 transition-all text-sm">
                      Ver mi calendario
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200/50 px-4">
                  <p className="text-slate-400 font-medium">Completa tu evaluación para ver tu resumen aquí.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Courses (Mis Cursos) */}
          {isMe && activeTab === 'courses' && (
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hasHipnosis ? (
                  <Link to="/cursos/hipnosis-interdimencional" className="group block">
                    <div className="h-full rounded-[2.5rem] bg-white border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                      <div className="aspect-[16/10] bg-slate-900 relative overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop"
                          alt="Hipnosis"
                          className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 block">Mis Cursos</span>
                          <h4 className="text-xl font-black text-white">Hipnosis Interdimencional</h4>
                        </div>
                      </div>
                      <div className="p-8">
                        <p className="text-slate-500 text-sm line-clamp-2 mb-6">Accede a las herramientas de reprogramación subconsciente.</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <PlayCircle className="h-4 w-4" />
                            Continuar viendo
                          </div>
                          <ChevronRight className="h-5 w-5 text-slate-350 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="md:col-span-3 text-center py-20 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm px-4">
                    <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-6 border border-slate-100">
                      <Lock className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">Aún no tienes cursos</h3>
                    <p className="text-slate-500 text-sm mb-10 max-w-md mx-auto">Explora nuestra biblioteca y empieza tu transformación hoy mismo.</p>
                    <Link to="/cursos" className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-primary text-white font-black shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-sm">
                      Explorar Biblioteca
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Settings (Ajustes) */}
          {isMe && activeTab === 'settings' && (
            <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Personal Information Form */}
              <div className="bg-white border border-slate-200/60 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-3">
                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    Información Personal
                  </h3>
                  <button
                    type="button"
                    onClick={() => void saveProfile()}
                    disabled={savingProfile}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-md transition-all disabled:opacity-50 text-sm self-start sm:self-auto"
                  >
                    {savingProfile ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre</label>
                    <input
                      value={profileForm.firstName}
                      onChange={e => setProfileForm(p => ({ ...p, firstName: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Apellidos</label>
                    <input
                      value={profileForm.lastName}
                      onChange={e => setProfileForm(p => ({ ...p, lastName: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Correo Electrónico</label>
                    <input
                      value={profileForm.email}
                      onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                      type="email"
                      className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Teléfono</label>
                    <input
                      value={profileForm.phone}
                      onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      value={profileForm.birthDate}
                      onChange={e => setProfileForm(p => ({ ...p, birthDate: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Género</label>
                    <select
                      value={profileForm.gender}
                      onChange={e => setProfileForm(p => ({ ...p, gender: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Otro">Otro</option>
                      <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Ciudad</label>
                    <input
                      value={profileForm.city}
                      onChange={e => setProfileForm(p => ({ ...p, city: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Ocupación</label>
                    <input
                      value={profileForm.occupation}
                      onChange={e => setProfileForm(p => ({ ...p, occupation: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Dirección Completa</label>
                    <input
                      value={profileForm.address}
                      onChange={e => setProfileForm(p => ({ ...p, address: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Contacto Emergencia</label>
                    <input
                      value={profileForm.emergencyContactName}
                      onChange={e => setProfileForm(p => ({ ...p, emergencyContactName: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Teléfono Emergencia</label>
                    <input
                      value={profileForm.emergencyContactPhone}
                      onChange={e => setProfileForm(p => ({ ...p, emergencyContactPhone: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Account Security Information details */}
              <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 w-full">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Información de Cuenta</h3>
                <p className="text-slate-500 text-sm mb-6">Gestiona la seguridad y accesos de tu cuenta.</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      <span className="text-xs sm:text-sm font-bold text-slate-700">Email verificado: {me?.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <GitBranch className="h-5 w-5 text-emerald-600 shrink-0" />
                      <div>
                        <span className="block text-xs sm:text-sm font-bold text-slate-700">Estado del Test en Árbol</span>
                        <span className="block text-[11px] font-medium text-slate-400">
                          {me?.intakeCompleted ? 'Test del árbol realizado' : 'Test del árbol pendiente'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        const res = await api.patch<any>('/api/portal/me/', {
                          intakeCompleted: !me?.intakeCompleted
                        });
                        if (res.ok) {
                          setMe(res.data);
                        }
                      }}
                      title={me?.intakeCompleted ? 'Test realizado (Clic para cambiar)' : 'Test pendiente (Clic para cambiar)'}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <span className={cn(
                        "text-xs font-bold transition-colors",
                        me?.intakeCompleted ? "text-emerald-700" : "text-slate-400"
                      )}>
                        {me?.intakeCompleted ? 'Realizado' : 'Pendiente'}
                      </span>

                      {/* Interruptor Switch Track */}
                      <div className={cn(
                        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-300",
                        me?.intakeCompleted ? "bg-emerald-600" : "bg-slate-300"
                      )}>
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-in-out",
                            me?.intakeCompleted ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Tree Diagnostic Test */}
          {isMe && activeTab === 'test' && (
            <TreeDiagnosticTest
              firstName={me?.firstName || name?.split(' ')[0] || ''}
              userKey={me?.email || name || 'usuario'}
              onCompleted={() => {
                if (isAuthed) {
                  api.get('/api/portal/me/').then(res => {
                    if (res.ok) setMe(res.data);
                  });
                }
              }}
              onClose={() => setActiveTab('wellbeing')}
            />
          )}
        </div>
      </div>

      {/* Fullscreen Post Lightbox Modal */}
      <PostDetailModal
        post={selectedLightboxPost}
        isOpen={Boolean(selectedLightboxPost)}
        initialTime={modalInitialTime}
        onTimeUpdate={(currentTime) => {
          if (selectedLightboxPost) {
            videoTimesRef.current[selectedLightboxPost.id] = currentTime;
          }
        }}
        onClose={() => setSelectedLightboxPostId(null)}
        onLike={(postId) => handleLikePost(postId)}
        onAddComment={async (postId, text) => {
          await handleAddComment(postId, { preventDefault: () => {} } as any);
        }}
        onDeleteComment={async (postId, commentId) => {
          if (handleDeleteCommentSubmit) {
            await handleDeleteCommentSubmit(postId, commentId);
          }
        }}
        myName={myName}
        isLikedByMe={selectedLightboxPost ? selectedLightboxPost.likes.includes(myName) : false}
        isAuthed={isAuthed}
        hasPrev={Boolean(selectedLightboxPost && userPosts.findIndex(p => p.id === selectedLightboxPost.id) > 0)}
        hasNext={Boolean(selectedLightboxPost && userPosts.findIndex(p => p.id === selectedLightboxPost.id) < userPosts.length - 1)}
        onPrevPost={() => {
          if (!selectedLightboxPost) return;
          const idx = userPosts.findIndex(p => p.id === selectedLightboxPost.id);
          if (idx > 0) {
            const prevPost = userPosts[idx - 1];
            const time = videoTimesRef.current[prevPost.id] || 0;
            handleOpenLightbox(prevPost, time);
          }
        }}
        onNextPost={() => {
          if (!selectedLightboxPost) return;
          const idx = userPosts.findIndex(p => p.id === selectedLightboxPost.id);
          if (idx >= 0 && idx < userPosts.length - 1) {
            const nextPost = userPosts[idx + 1];
            const time = videoTimesRef.current[nextPost.id] || 0;
            handleOpenLightbox(nextPost, time);
          }
        }}
      />

      {/* Share Modal */}
      <ShareMenuModal
        postId={sharePostId || ''}
        postContent={sharePostContent}
        isOpen={Boolean(sharePostId)}
        onClose={() => setSharePostId(null)}
      />
    </PublicLayout>
  );
};

export default PublicProfile;
