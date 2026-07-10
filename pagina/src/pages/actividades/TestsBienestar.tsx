import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { ClipboardList, ChevronRight, ChevronLeft, CheckCircle2, RotateCcw, AlertCircle, Smile, Meh, Frown, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
type Question = { id: number; text: string };
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
      { id: 1, text: 'Me he sentido nervioso/a, ansioso/a o con los nervios de punta.' },
      { id: 2, text: 'No he sido capaz de dejar de preocuparme o controlar mi preocupación.' },
      { id: 3, text: 'Me he preocupado demasiado por diferentes cosas.' },
      { id: 4, text: 'He tenido dificultades para relajarme.' },
      { id: 5, text: 'Me he sentido tan inquieto/a que no he podido quedarme sentado/a tranquilo/a.' },
      { id: 6, text: 'Me he irritado o enojado con facilidad.' },
      { id: 7, text: 'He sentido miedo de que algo terrible pudiera pasar.' },
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
      { id: 1, text: 'Poco interés o placer en hacer las cosas.' },
      { id: 2, text: 'Me he sentido decaído/a, deprimido/a o sin esperanza.' },
      { id: 3, text: 'He tenido problemas para dormir, o he dormido demasiado.' },
      { id: 4, text: 'Me he sentido cansado/a o con poca energía.' },
      { id: 5, text: 'He tenido poco apetito o he comido en exceso.' },
      { id: 6, text: 'Me he sentido mal conmigo mismo/a o he sentido que soy un fracaso.' },
      { id: 7, text: 'He tenido dificultad para concentrarme en actividades.' },
      { id: 8, text: 'Me he movido o hablado tan lento que los demás lo han notado.' },
      { id: 9, text: 'He tenido pensamientos de que estaría mejor muerto/a o de hacerme daño.' },
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
      { id: 1, text: 'Me he sentido alegre y de buen humor.' },
      { id: 2, text: 'Me he sentido tranquilo/a y relajado/a.' },
      { id: 3, text: 'Me he sentido activo/a y vigoroso/a.' },
      { id: 4, text: 'Me he despertado fresco/a y descansado/a.' },
      { id: 5, text: 'Mi vida cotidiana ha estado llena de cosas que me interesan.' },
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
      { id: 1, text: 'Siento que soy una persona digna de aprecio, al menos en igual medida que los demás.' },
      { id: 2, text: 'Creo que tengo una serie de buenas cualidades.' },
      { id: 3, text: 'Soy capaz de hacer las cosas tan bien como la mayoría de las personas.' },
      { id: 4, text: 'Tengo una actitud positiva hacia mí mismo/a.' },
      { id: 5, text: 'En general, estoy satisfecho/a de mí mismo/a.' },
      { id: 6, text: 'Siento que no tengo mucho de lo que enorgullecerme.' },
      { id: 7, text: 'En general, me inclino a pensar que soy un/a fracasado/a.' },
      { id: 8, text: 'Me gustaría poder sentir más respeto por mí mismo/a.' },
      { id: 9, text: 'Hay veces que realmente me siento inútil.' },
      { id: 10, text: 'A veces creo que no soy buena persona.' },
    ],
  },
];

const OPTIONS = [
  { label: 'Nunca', value: 0 },
  { label: 'Varios días', value: 1 },
  { label: 'Más de la mitad de los días', value: 2 },
  { label: 'Casi todos los días', value: 3 },
];

// ─── Result interpreter ────────────────────────────────────────────────────────
function getResult(testId: string, score: number, total: number) {
  const pct = (score / total) * 100;
  if (testId === 'bienestar') {
    if (pct >= 72) return { label: 'Excelente bienestar', color: '#10b981', emoji: '🌟', detail: 'Tu bienestar emocional es sólido. Sigue cultivando hábitos positivos.' };
    if (pct >= 52) return { label: 'Bienestar moderado', color: '#f59e0b', emoji: '😊', detail: 'Tienes una base saludable. Pequeñas mejoras pueden hacer una gran diferencia.' };
    return { label: 'Bienestar bajo', color: '#ef4444', emoji: '💙', detail: 'Considera hablar con un profesional. Hay muchas herramientas que pueden ayudarte.' };
  }
  if (pct <= 30) return { label: 'Sin síntomas significativos', color: '#10b981', emoji: '✨', detail: 'Tu puntuación indica que no presentas síntomas relevantes en este momento.' };
  if (pct <= 60) return { label: 'Síntomas leves o moderados', color: '#f59e0b', emoji: '🤔', detail: 'Es recomendable prestar atención y considerar hablar con un profesional.' };
  return { label: 'Síntomas severos', color: '#ef4444', emoji: '💙', detail: 'Te recomendamos buscar apoyo profesional. No estás solo/a.' };
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function TestCard({ test, onStart }: { test: Test; onStart: () => void }) {
  const Icon = test.icon;
  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer" onClick={onStart}>
      <div className={`h-1.5 w-full bg-gradient-to-r ${test.gradient}`} />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: `${test.color}15` }}>
            <Icon className="h-6 w-6" style={{ color: test.color }} />
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: `${test.color}12`, color: test.color }}>
              {test.tag}
            </span>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
              ⏱ {test.duration}
            </span>
          </div>
        </div>
        <h3 className="font-black text-slate-800 text-lg leading-tight">{test.title}</h3>
        <p className="text-xs font-semibold text-slate-400 mt-0.5 mb-3">{test.subtitle}</p>
        <p className="text-sm text-slate-500 leading-relaxed">{test.description}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs text-slate-400">{test.questions.length} preguntas</span>
          <button
            className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-all duration-200 group-hover:scale-105"
            style={{ background: `${test.color}15`, color: test.color }}
          >
            Comenzar <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ActiveTest({ test, onClose }: { test: Test; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);

  const q = test.questions[step];
  const totalQuestions = test.questions.length;
  const maxScore = totalQuestions * 3;
  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const result = done ? getResult(test.id, totalScore, maxScore) : null;
  const progress = ((step + (answers[q?.id] !== undefined ? 1 : 0)) / totalQuestions) * 100;

  const handleAnswer = (val: number) => {
    const newAnswers = { ...answers, [q.id]: val };
    setAnswers(newAnswers);
    if (step < totalQuestions - 1) {
      setTimeout(() => setStep(s => s + 1), 300);
    } else {
      setTimeout(() => setDone(true), 300);
    }
  };

  if (done && result) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-in zoom-in-95 duration-300">
          <div className="text-6xl mb-4">{result.emoji}</div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4" style={{ background: `${result.color}15`, color: result.color }}>
            <CheckCircle2 className="h-4 w-4" /> Resultado
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">{result.label}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-2">{result.detail}</p>
          <p className="text-xs text-slate-400 mb-6">Puntuación: <strong>{totalScore}</strong> de {maxScore}</p>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs text-amber-700 font-semibold">⚠️ Este test es orientativo y no reemplaza el diagnóstico de un profesional de salud mental.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setStep(0); setAnswers({}); setDone(false); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
              <RotateCcw className="h-4 w-4" /> Repetir
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white transition-all" style={{ background: test.color }}>
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className={`bg-gradient-to-r ${test.gradient} px-6 py-5 text-white`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold opacity-80">{test.title}</span>
            <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity text-sm font-bold">✕</button>
          </div>
          <div className="flex justify-between text-xs opacity-70 mb-2">
            <span>Pregunta {step + 1} de {totalQuestions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="p-8">
          <p className="text-slate-700 font-semibold text-lg leading-relaxed mb-8 text-center">
            Durante las últimas 2 semanas…<br />
            <span className="text-slate-900 font-black">"{q.text}"</span>
          </p>
          <div className="space-y-3">
            {OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className={cn(
                  'w-full flex items-center gap-4 px-5 py-3.5 rounded-xl border-2 transition-all duration-200 font-semibold text-sm text-left',
                  answers[q.id] === opt.value
                    ? 'border-transparent text-white shadow-lg'
                    : 'border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                )}
                style={answers[q.id] === opt.value ? { background: test.color, borderColor: test.color } : {}}
              >
                <span className="h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-xs font-black"
                  style={answers[q.id] === opt.value ? { background: 'rgba(255,255,255,0.25)' } : { background: '#f1f5f9' }}>
                  {opt.value}
                </span>
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { api } from '../../api/client';

const getIconForTest = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('ansiedad')) return AlertCircle;
  if (t.includes('animo') || t.includes('depresi')) return Frown;
  return ClipboardList;
};

export default function TestsBienestarPage() {
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [testsList, setTestsList] = useState<Test[]>([]);

  useEffect(() => {
    const loadTests = async () => {
      const res = await api.get<any[]>('/api/portal/wellbeing-tests/');
      if (res.ok && res.data && res.data.length > 0) {
        const mapped: Test[] = res.data.map(item => ({
          id: String(item.id),
          title: item.title,
          subtitle: item.subtitle,
          description: item.description,
          duration: item.durationLabel || '3 min',
          color: item.color,
          gradient: item.gradient,
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

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl mb-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <ClipboardList className="h-4 w-4" />
              <span className="text-sm font-bold">Evaluación Psicológica</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3">Tests de Bienestar</h1>
            <p className="text-white/80 text-lg max-w-xl leading-relaxed">
              Instrumentos clínicos validados para conocer mejor tu salud mental. Breves, anónimos y orientativos.
            </p>
            <div className="flex flex-wrap gap-4 mt-6 text-sm">
              <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> 100% Anónimo
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Escalas validadas
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Resultado inmediato
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">
            <strong>Nota importante:</strong> Estos tests son herramientas de orientación. No reemplazan la evaluación de un profesional de salud mental. Si los resultados te preocupan, te invitamos a agendar una consulta.
          </p>
        </div>

        {/* Tests grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {testsList.map(test => (
            <TestCard key={test.id} test={test} onStart={() => setActiveTest(test)} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-7 w-7 text-indigo-500" />
          </div>
          <h3 className="font-black text-slate-800 text-xl mb-2">¿Necesitas hablar con alguien?</h3>
          <p className="text-slate-500 text-sm mb-5 max-w-sm mx-auto">Nuestros terapeutas están disponibles para acompañarte en tu proceso de bienestar.</p>
          <a href="#/agenda" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
            Agendar consulta <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Modal */}
      {activeTest && <ActiveTest test={activeTest} onClose={() => setActiveTest(null)} />}
    </PublicLayout>
  );
}
