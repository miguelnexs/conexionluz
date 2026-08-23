import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { ClipboardList, ChevronRight, CheckCircle2, AlertCircle, Smile, Frown, Heart, Lock, Sparkles } from 'lucide-react';
import { QuestionWizard, TestData } from '@/components/questionnaires/QuestionWizard';
import { AuthPromptModal, isUserLoggedIn } from '@/components/AuthPromptModal';
import { useToast } from '@/components/ui/use-toast';
import { LumiConfirmUnlockModal } from '@/components/LumiConfirmUnlockModal';
import { api } from '../../api/client';

// ─── Types ────────────────────────────────────────────────────────────────────
type QuestionOption = { label: string; value: number };
type Question = { id: number; text: string; options?: QuestionOption[] };
type Test = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  questions: Question[];
  color: string;
  gradient: string;
  icon: React.ElementType;
  tag: string;
};

// ─── Tests data ───────────────────────────────────────────────────────────────
const TESTS: Test[] = [
  {
    id: 'ansiedad',
    title: 'Nivel de Ansiedad',
    subtitle: 'Escala GAD-7',
    description: 'Evalúa qué tan seguido te han molestado los síntomas de ansiedad en las últimas 2 semanas.',
    duration: '3 min',
    color: '#6366f1',
    gradient: 'from-indigo-500 to-purple-600',
    icon: AlertCircle,
    tag: 'Clínico',
    questions: [
      {
        id: 1,
        text: 'Me he sentido nervioso/a, ansioso/a o con los nervios de punta.',
        options: [
          { label: 'Nunca me he sentido así', value: 0 },
          { label: 'Varios días he sentido cierta tensión', value: 1 },
          { label: 'Más de la mitad de los días he estado ansioso/a', value: 2 },
          { label: 'Casi todos los días me siento con los nervios de punta', value: 3 },
        ],
      },
      {
        id: 2,
        text: 'No he sido capaz de dejar de preocuparme o controlar mi preocupación.',
        options: [
          { label: 'Puedo controlar mis preocupaciones con facilidad', value: 0 },
          { label: 'A veces me cuesta trabajo soltar los pensamientos', value: 1 },
          { label: 'Con frecuencia pierdo el control sobre lo que me preocupa', value: 2 },
          { label: 'Incapacidad constante para frenar las preocupaciones', value: 3 },
        ],
      },
      {
        id: 3,
        text: 'Me he preocupado demasiado por diferentes cosas.',
        options: [
          { label: 'Sin preocupaciones excesivas', value: 0 },
          { label: 'Preocupaciones ocasionales sobre temas específicos', value: 1 },
          { label: 'Preocupación constante por múltiples áreas de mi vida', value: 2 },
          { label: 'Sensación continua de estar abrumado/a por todo', value: 3 },
        ],
      },
      {
        id: 4,
        text: 'He tenido dificultades para relajarme.',
        options: [
          { label: 'Me he relajado y descansado sin problema', value: 0 },
          { label: 'Me cuesta un poco soltar la tensión física o mental', value: 1 },
          { label: 'La mayor parte del tiempo me cuesta lograr la calma', value: 2 },
          { label: 'Me resulta casi imposible relajarme', value: 3 },
        ],
      },
      {
        id: 5,
        text: 'Me he sentido tan inquieto/a que no he podido quedarme sentado/a tranquilo/a.',
        options: [
          { label: 'Sin inquietud motora ni intranquilidad', value: 0 },
          { label: 'Inquietud en momentos puntuales', value: 1 },
          { label: 'Impaciencia física recurrente', value: 2 },
          { label: 'Agitación constante, no consigo estar en calma', value: 3 },
        ],
      },
      {
        id: 6,
        text: 'Me he irritado o enojado con facilidad.',
        options: [
          { label: 'He mantenido paciencia y tolerancia', value: 0 },
          { label: 'Ligeros momentos de molestia o impaciencia', value: 1 },
          { label: 'Con frecuencia me irrito o pierdo la calma', value: 2 },
          { label: 'Casi cualquier detalle me molesta de inmediato', value: 3 },
        ],
      },
      {
        id: 7,
        text: 'He sentido miedo de que algo terrible pudiera pasar.',
        options: [
          { label: 'Sin temores ni presagios amenazantes', value: 0 },
          { label: 'Temores o presagios aislados', value: 1 },
          { label: 'Sensación frecuente de que ocurrirá una desgracia', value: 2 },
          { label: 'Miedo constante y sobrecogedor a un peligro inminente', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'estado-animo',
    title: 'Estado de Ánimo',
    subtitle: 'Escala PHQ-9',
    description: 'Detecta síntomas depresivos y su impacto en tu vida cotidiana durante las últimas dos semanas.',
    duration: '4 min',
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-600',
    icon: Frown,
    tag: 'Clínico',
    questions: [
      {
        id: 1,
        text: 'Poco interés o placer en hacer las cosas.',
        options: [
          { label: 'Conservo pleno interés y disfrute por lo que hago', value: 0 },
          { label: 'He sentido algo de desinterés en ciertos días', value: 1 },
          { label: 'La mayoría de las actividades han perdido interés', value: 2 },
          { label: 'Pérdida total de motivación e interés cotidiano', value: 3 },
        ],
      },
      {
        id: 2,
        text: 'Me he sentido decaído/a, deprimido/a o sin esperanza.',
        options: [
          { label: 'Mi ánimo se percibe alegre y optimista', value: 0 },
          { label: 'Leves momentos de desánimo o tristeza', value: 1 },
          { label: 'Sensación frecuente de decaimiento o pesadez', value: 2 },
          { label: 'Tristeza profunda o falta constante de esperanza', value: 3 },
        ],
      },
      {
        id: 3,
        text: 'He tenido problemas para dormir, o he dormido demasiado.',
        options: [
          { label: 'Mi descanso nocturno ha sido estable y reparador', value: 0 },
          { label: 'Ligeras variaciones o dificultad ocasional para dormir', value: 1 },
          { label: 'Insomnio frecuente o necesidad excesiva de dormir', value: 2 },
          { label: 'Desvelos continuos o hipersomnia severa', value: 3 },
        ],
      },
      {
        id: 4,
        text: 'Me he sentido cansado/a o con poca energía.',
        options: [
          { label: 'Con energía suficiente para mis actividades', value: 0 },
          { label: 'Fatiga o cansancio ligero al final del día', value: 1 },
          { label: 'Agotamiento notorio durante la jornada', value: 2 },
          { label: 'Falta extrema de energía para cualquier tarea', value: 3 },
        ],
      },
      {
        id: 5,
        text: 'He tenido poco apetito o he comido en exceso.',
        options: [
          { label: 'Apetito y hábitos alimenticios habituales', value: 0 },
          { label: 'Cambios ligeros en el apetito o antojos por ansiedad', value: 1 },
          { label: 'Inapetencia marcada o impulsos frecuentes de comer', value: 2 },
          { label: 'Alteración severa en el apetito', value: 3 },
        ],
      },
      {
        id: 6,
        text: 'Me he sentido mal conmigo mismo/a o he sentido que soy un fracaso.',
        options: [
          { label: 'Me siento conforme y en paz con quien soy', value: 0 },
          { label: 'Ocasionalmente surgen dudas o autocríticas', value: 1 },
          { label: 'Pensamientos frecuentes de desvalorización', value: 2 },
          { label: 'Sensación constante de haber fallado en todo', value: 3 },
        ],
      },
      {
        id: 7,
        text: 'He tenido dificultad para concentrarme en actividades.',
        options: [
          { label: 'Mi concentración se ha mantenido clara', value: 0 },
          { label: 'Leves distracciones al leer o trabajar', value: 1 },
          { label: 'Dificultad evidente para enfocar la mente', value: 2 },
          { label: 'Incapacidad casi total para concentrarme', value: 3 },
        ],
      },
      {
        id: 8,
        text: 'Me he movido o hablado tan lento que los demás lo han notado.',
        options: [
          { label: 'Mi ritmo físico y verbal ha sido normal', value: 0 },
          { label: 'Lentitud o inquietud casi imperceptible', value: 1 },
          { label: 'Movimientos pausados o intranquilidad visible', value: 2 },
          { label: 'Lentitud extrema o agitación que otros notaron', value: 3 },
        ],
      },
      {
        id: 9,
        text: 'He tenido pensamientos de que estaría mejor muerto/a o de hacerme daño.',
        options: [
          { label: 'Nunca he tenido pensamientos de ese tipo', value: 0 },
          { label: 'Ideas fugaces en momentos de gran agotamiento', value: 1 },
          { label: 'Deseo recurrente de no continuar', value: 2 },
          { label: 'Pensamientos persistentes de autolesión o desesperación', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'bienestar',
    title: 'Bienestar General',
    subtitle: 'Escala WHO-5',
    description: 'Mide tu bienestar subjetivo y calidad de vida emocional en las últimas dos semanas.',
    duration: '2 min',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-600',
    icon: Smile,
    tag: 'Bienestar',
    questions: [
      {
        id: 1,
        text: 'Me he sentido alegre y de buen humor.',
        options: [
          { label: 'Plenamente alegre y de excelente humor', value: 3 },
          { label: 'Alegre la mayor parte del tiempo', value: 2 },
          { label: 'Con buen humor en algunos momentos', value: 1 },
          { label: 'Sin alegría ni buen humor', value: 0 },
        ],
      },
      {
        id: 2,
        text: 'Me he sentido tranquilo/a y relajado/a.',
        options: [
          { label: 'Con profunda tranquilidad y paz', value: 3 },
          { label: 'Tranquilo/a la mayor parte de los días', value: 2 },
          { label: 'Momentos aislados de relajación', value: 1 },
          { label: 'Tensión constante o agitación', value: 0 },
        ],
      },
      {
        id: 3,
        text: 'Me he sentido activo/a y vigoroso/a.',
        options: [
          { label: 'Lleno/a de vitalidad y energía', value: 3 },
          { label: 'Activo/a y en buen ritmo', value: 2 },
          { label: 'Energía moderada o variable', value: 1 },
          { label: 'Sensación de debilidad o desgano', value: 0 },
        ],
      },
      {
        id: 4,
        text: 'Me he despertado fresco/a y descansado/a.',
        options: [
          { label: 'Renovado/a y listo/a para iniciar el día', value: 3 },
          { label: 'Descansado/a casi todas las mañanas', value: 2 },
          { label: 'Cansancio ligero al despertar', value: 1 },
          { label: 'Fatiga intensa al despertar', value: 0 },
        ],
      },
      {
        id: 5,
        text: 'Mi vida cotidiana ha estado llena de cosas que me interesan.',
        options: [
          { label: 'Plenamente motivado/a con mis proyectos y rutina', value: 3 },
          { label: 'Con varias actividades de mi interés', value: 2 },
          { label: 'Pocos momentos estimulantes en el día', value: 1 },
          { label: 'Sensación de monotonía o desinterés', value: 0 },
        ],
      },
    ],
  },
  {
    id: 'autoestima',
    title: 'Autoestima',
    subtitle: 'Escala de Rosenberg',
    description: 'Evalúa tu nivel de autoestima y cómo te percibes a ti mismo/a en distintas áreas de la vida.',
    duration: '3 min',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
    icon: Heart,
    tag: 'Personal',
    questions: [
      {
        id: 1,
        text: 'Siento que soy una persona digna de aprecio, al menos en igual medida que los demás.',
        options: [
          { label: 'Totalmente de acuerdo, reconozco mi valor', value: 3 },
          { label: 'De acuerdo en general', value: 2 },
          { label: 'En desacuerdo, me cuesta valorar mi aprecio', value: 1 },
          { label: 'Totalmente en desacuerdo, no me siento digno/a de aprecio', value: 0 },
        ],
      },
      {
        id: 2,
        text: 'Creo que tengo una serie de buenas cualidades.',
        options: [
          { label: 'Totalmente de acuerdo, poseo grandes cualidades', value: 3 },
          { label: 'De acuerdo, reconozco mis virtudes', value: 2 },
          { label: 'En desacuerdo, veo pocas cualidades en mí', value: 1 },
          { label: 'Totalmente en desacuerdo, no veo aspectos positivos', value: 0 },
        ],
      },
      {
        id: 3,
        text: 'Soy capaz de hacer las cosas tan bien como la mayoría de las personas.',
        options: [
          { label: 'Totalmente de acuerdo, confío en mi capacidad', value: 3 },
          { label: 'De acuerdo, logro desenvolverme bien', value: 2 },
          { label: 'En desacuerdo, siento que me cuesta más que a otros', value: 1 },
          { label: 'Totalmente en desacuerdo, me siento incapaz', value: 0 },
        ],
      },
      {
        id: 4,
        text: 'Tengo una actitud positiva hacia mí mismo/a.',
        options: [
          { label: 'Totalmente de acuerdo, me trato con respeto y amor', value: 3 },
          { label: 'De acuerdo la mayor parte del tiempo', value: 2 },
          { label: 'En desacuerdo, tiendo a la autocrítica', value: 1 },
          { label: 'Totalmente en desacuerdo, mi actitud hacia mí es dura', value: 0 },
        ],
      },
      {
        id: 5,
        text: 'En general, estoy satisfecho/a de mí mismo/a.',
        options: [
          { label: 'Totalmente de acuerdo, me siento satisfecho/a con quien soy', value: 3 },
          { label: 'De acuerdo en gran medida', value: 2 },
          { label: 'En desacuerdo, me siento insatisfecho/a conmigo', value: 1 },
          { label: 'Totalmente en desacuerdo, insatisfacción profunda', value: 0 },
        ],
      },
      {
        id: 6,
        text: 'Siento que no tengo mucho de lo que enorgullecerme.',
        options: [
          { label: 'Totalmente en desacuerdo, tengo muchos motivos de orgullo', value: 3 },
          { label: 'En desacuerdo, valoro mis logros y avances', value: 2 },
          { label: 'De acuerdo, me cuesta encontrar motivos de orgullo', value: 1 },
          { label: 'Totalmente de acuerdo, siento que no tengo de qué enorgullecerme', value: 0 },
        ],
      },
      {
        id: 7,
        text: 'En general, me inclino a pensar que soy un/a fracasado/a.',
        options: [
          { label: 'Totalmente en desacuerdo, no me considero un fracaso', value: 3 },
          { label: 'En desacuerdo, cometo errores pero avanzo', value: 2 },
          { label: 'De acuerdo, me siento derrotado/a a veces', value: 1 },
          { label: 'Totalmente de acuerdo, me siento un fracaso total', value: 0 },
        ],
      },
      {
        id: 8,
        text: 'Me gustaría poder sentir más respeto por mí mismo/a.',
        options: [
          { label: 'Totalmente en desacuerdo, ya mantengo un profundo respeto por mí', value: 3 },
          { label: 'En desacuerdo, cuido y respeto mi persona', value: 2 },
          { label: 'De acuerdo, siento vacíos en mi autorrespeto', value: 1 },
          { label: 'Totalmente de acuerdo, me falta mucho respeto propio', value: 0 },
        ],
      },
      {
        id: 9,
        text: 'Hay veces que realmente me siento inútil.',
        options: [
          { label: 'Totalmente en desacuerdo, conozco mi utilidad y valor', value: 3 },
          { label: 'En desacuerdo, rara vez experimento esa sensación', value: 2 },
          { label: 'De acuerdo, a veces me embarga esa sensación', value: 1 },
          { label: 'Totalmente de acuerdo, me siento inútil con frecuencia', value: 0 },
        ],
      },
    ],
  },
];

import { cn } from '@/lib/utils';

// ─── Sub-components ────────────────────────────────────────────────────────────
const getIconForTest = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('ansiedad')) return AlertCircle;
  if (t.includes('animo') || t.includes('depresi')) return Frown;
  if (t.includes('autoestima')) return Heart;
  return ClipboardList;
};

export function getTestMeta(testId: string) {
  const id = (testId || '').toLowerCase();
  if (id.includes('ansiedad') || id.includes('gad-7')) {
    return {
      bar: 'bg-indigo-600',
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      btn: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20',
      color: '#4f46e5',
    };
  }
  if (id.includes('animo') || id.includes('depresi') || id.includes('phq-9')) {
    return {
      bar: 'bg-blue-600',
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      badge: 'bg-blue-50 text-blue-700 border-blue-100',
      btn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20',
      color: '#2563eb',
    };
  }
  if (id.includes('bienestar') || id.includes('who-5')) {
    return {
      bar: 'bg-teal-600',
      iconBg: 'bg-teal-50 text-teal-600 border-teal-100',
      badge: 'bg-teal-50 text-teal-700 border-teal-100',
      btn: 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20',
      color: '#0d9488',
    };
  }
  if (id.includes('autoestima') || id.includes('rosenberg')) {
    return {
      bar: 'bg-amber-600',
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      badge: 'bg-amber-50 text-amber-700 border-amber-100',
      btn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
      color: '#d97706',
    };
  }
  return {
    bar: 'bg-indigo-600',
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    btn: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20',
    color: '#4f46e5',
  };
}

function TestCard({ test, isLocked, isUnlocked, onStart }: { test: Test; isLocked?: boolean; isUnlocked?: boolean; onStart: () => void }) {
  const Icon = test.icon;
  const meta = getTestMeta(test.id);

  return (
    <div 
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer flex flex-col justify-between" 
      onClick={onStart}
    >
      <div className={cn("h-1.5 w-full", meta.bar)} />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("h-12 w-12 rounded-xl border flex items-center justify-center shrink-0", meta.iconBg)}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            {isUnlocked ? (
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 🔓 Desbloqueado
              </span>
            ) : isLocked ? (
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                <Lock className="w-3 h-3 text-indigo-600" /> Requiere Registro
              </span>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" /> ✨ 50 Lumis
              </span>
            )}
            <span className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-full">
              ⏱ {test.duration}
            </span>
          </div>
        </div>
        <h3 className="font-black text-slate-900 text-lg leading-tight">{test.title}</h3>
        <p className="text-xs font-semibold text-slate-500 mt-0.5 mb-3">{test.subtitle}</p>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">{test.description}</p>
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500">{test.questions.length || '7-10'} preguntas</span>
          {isUnlocked ? (
            <button
              className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all duration-200 group-hover:scale-105"
            >
              Realizar Test <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : isLocked ? (
            <button
              className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl bg-slate-900 text-white shadow-md transition-all duration-200 group-hover:scale-105"
            >
              <Lock className="h-3.5 w-3.5" /> Regístrate
            </button>
          ) : (
            <button
              className={cn("flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-all duration-200 group-hover:scale-105 shadow-md", meta.btn)}
            >
              Desbloquear (✨ 50 Lumis) <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TestsBienestarPage() {
  const { toast } = useToast();
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [testsList, setTestsList] = useState<Test[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [lockedTitle, setLockedTitle] = useState('');
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [userBalance, setUserBalance] = useState<number>(150);
  const [pendingUnlockTest, setPendingUnlockTest] = useState<Test | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const isLoggedIn = isUserLoggedIn();

  const fetchWalletAndUnlocked = async () => {
    if (!isLoggedIn) return;
    const res = await api.get<any>('/api/portal/lumi/wallet/');
    if (res.ok && res.data) {
      setUserBalance(res.data.balance);
      const unlockedSet = new Set<string>();
      if (Array.isArray(res.data.unlockedItems)) {
        res.data.unlockedItems.forEach((u: any) => {
          if (u.itemType === 'test') {
            unlockedSet.add(u.itemId);
          }
        });
      }
      setUnlockedIds(unlockedSet);
    }
  };

  useEffect(() => {
    void fetchWalletAndUnlocked();
    const loadTests = async () => {
      const res = await api.get<any[]>('/api/portal/wellbeing-tests/');
      if (res.ok && res.data && res.data.length > 0) {
        const mapped: Test[] = res.data.map(item => ({
          id: String(item.id),
          title: item.title,
          subtitle: item.subtitle,
          description: item.description,
          duration: item.durationLabel || '3 min',
          color: item.color || '#4f46e5',
          gradient: item.gradient || 'from-indigo-600 to-indigo-800',
          icon: getIconForTest(item.title),
          tag: item.tag || 'Clínico',
          questions: item.questions || []
        }));
        setTestsList(mapped);
      } else {
        setTestsList(TESTS);
      }
    };
    loadTests();
  }, []);

  const handleStartTestClick = (test: Test) => {
    if (!isLoggedIn) {
      setLockedTitle(`el test "${test.title}"`);
      setShowAuthModal(true);
      return;
    }

    if (unlockedIds.has(test.id)) {
      setActiveTest(test);
      return;
    }

    setPendingUnlockTest(test);
  };

  const handleConfirmUnlock = async () => {
    if (!pendingUnlockTest) return;
    setUnlocking(true);

    const res = await api.post<any>('/api/portal/lumi/spend/', {
      itemType: 'test',
      itemId: pendingUnlockTest.id,
      lumiAmount: 50,
      description: `Test de Bienestar: ${pendingUnlockTest.title}`
    });

    if (res.ok && res.data) {
      const newBal = res.data.balance;
      setUserBalance(newBal);
      window.dispatchEvent(new CustomEvent('lumi-balance-updated', { detail: newBal }));
      
      setUnlockedIds(prev => new Set(prev).add(pendingUnlockTest.id));
      
      toast({
        title: "✨ Test Desbloqueado Permanentemente",
        description: `Has desbloqueado "${pendingUnlockTest.title}". ¡Acceso ilimitado activado!`,
      });

      const current = pendingUnlockTest;
      setPendingUnlockTest(null);
      setActiveTest(current);
    } else {
      toast({
        title: "Saldo Insuficiente de Lumis",
        description: (res as any).error || "Necesitas 50 Lumis para realizar este test.",
        variant: "destructive"
      });
    }
    setUnlocking(false);
  };

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl mb-10 bg-white border border-slate-100 p-8 md:p-12 text-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
              <ClipboardList className="h-4 w-4" />
              <span>Evaluación Psicológica</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">Tests de Bienestar</h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed font-medium">
            Instrumentos clínicos validados para conocer mejor tu salud mental. Breves, anónimos y orientativos.
          </p>
          <div className="flex flex-wrap gap-3 pt-2 text-xs md:text-sm">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 text-slate-700 font-bold rounded-full px-3.5 py-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 100% Anónimo
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 text-slate-700 font-bold rounded-full px-3.5 py-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Escalas validadas
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 text-slate-700 font-bold rounded-full px-3.5 py-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Resultado inmediato
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 mb-8">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 font-medium leading-relaxed">
            <strong className="text-amber-950 font-bold">Nota importante:</strong> Estos tests son herramientas de orientación. No reemplazan la evaluación de un profesional de salud mental. Si los resultados te preocupan, te invitamos a agendar una consulta.
          </p>
        </div>

        {/* Tests grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {testsList.map((test, index) => (
            <TestCard 
              key={test.id} 
              test={test} 
              isLocked={!isLoggedIn && index > 0} 
              isUnlocked={unlockedIds.has(test.id)}
              onStart={() => handleStartTestClick(test)} 
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-white rounded-3xl border border-slate-100 shadow-xl p-8 md:p-10 space-y-3">
          <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-2">
            <Heart className="h-7 w-7 text-indigo-600 fill-indigo-400" />
          </div>
          <h3 className="font-black text-slate-900 text-xl md:text-2xl">¿Necesitas hablar con alguien?</h3>
          <p className="text-slate-600 text-sm md:text-base max-w-md mx-auto font-medium">
            Nuestros terapeutas están disponibles para acompañarte en tu proceso de bienestar con empatía y profesionalismo.
          </p>
          <div className="pt-2">
            <a href="#/agenda" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all duration-200">
              Agendar consulta <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Active Questionnaire Wizard */}
        {activeTest && (
          <QuestionWizard
            test={{
              id: activeTest.id,
              title: activeTest.title,
              questions: activeTest.questions,
            }}
            onClose={() => setActiveTest(null)}
          />
        )}

        {/* Auth prompt modal if locked */}
        <AuthPromptModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          featureName={lockedTitle}
        />

        {/* Lumi Permanent Unlock Confirmation Modal */}
        <LumiConfirmUnlockModal
          isOpen={Boolean(pendingUnlockTest)}
          onClose={() => setPendingUnlockTest(null)}
          onConfirm={() => void handleConfirmUnlock()}
          itemTitle={pendingUnlockTest?.title || ''}
          itemCategory="Test de Bienestar"
          lumiPrice={50}
          userBalance={userBalance}
          loading={unlocking}
        />
      </div>
    </PublicLayout>
  );
}
