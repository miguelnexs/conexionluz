import React, { useState } from 'react';
import { api } from '../../api/client';
import AWEDailyWidget from './AWEDailyWidget';

interface OnboardingProps {
  firstName: string;
  onCompleted: () => void;
  onClose?: () => void;
}

// ─── Intake Options ───────────────────────────────────────────────────────────

const GOALS = [
  {
    id: 'calm',
    psychProfile: 'Vigilante',
    title: 'Encontrar paz y reducir la ansiedad',
    subtitle: 'Busco herramientas para calmar la mente, frenar la sobrepensación y recuperar la tranquilidad cotidiana.',
    icon: '🧘',
    badge: 'Serenidad y Calma',
  },
  {
    id: 'exhaustion',
    psychProfile: 'Guerrero Agotado',
    title: 'Recuperarme del agotamiento o burnout',
    subtitle: 'He dado más de lo que tenía. Necesito aprender a descansar sin culpa y reconstruir mi energía vital.',
    icon: '🔋',
    badge: 'Restauración y Límites',
  },
  {
    id: 'meaning',
    psychProfile: 'Buscador de Sentido',
    title: 'Descubrir mi propósito y dirección de vida',
    subtitle: 'Siento que algo falta o estoy en una encrucijada. Quiero alinear mis decisiones con mis valores reales.',
    icon: '🌟',
    badge: 'Propósito y Claridad',
  },
  {
    id: 'emotional',
    psychProfile: 'Corazón Abierto',
    title: 'Sanar relaciones y procesar emociones profundas',
    subtitle: 'Estoy transitando un duelo, una separación o una carga emocional y deseo ser escuchado con compasión.',
    icon: '🫂',
    badge: 'Vínculos y Autoestima',
  },
  {
    id: 'mind',
    psychProfile: 'Mente Analítica',
    title: 'Entender mis patrones y tomar mejores decisiones',
    subtitle: 'Quiero comprender el porqué de mis comportamientos con estructura, claridad y perspectiva racional.',
    icon: '🧠',
    badge: 'Reestructuración y Hábitos',
  },
];

const EMOTIONS = [
  { id: 'ansiedad', label: 'Ansiedad o Inquietud', icon: '🌀' },
  { id: 'agotamiento', label: 'Agotamiento Físico/Mental', icon: '🔋' },
  { id: 'tristeza', label: 'Tristeza o Vacío', icon: '🌧️' },
  { id: 'miedo', label: 'Miedo al Futuro', icon: '🛡️' },
  { id: 'enojo', label: 'Frustración o Irritabilidad', icon: '⚡' },
  { id: 'soledad', label: 'Sensación de Soledad', icon: '🍃' },
  { id: 'culpa', label: 'Culpa o Autocrítica', icon: '🪞' },
  { id: 'confusion', label: 'Confusión o Desorientación', icon: '🔍' },
  { id: 'esperanza', label: 'Deseo de Cambio y Esperanza', icon: '🌱' },
  { id: 'gratitud', label: 'Gratitud por un Nuevo Comienzo', icon: '✨' },
];

const MOMENTS = [
  { id: 'mañana', label: 'En la Mañana', desc: 'Comenzar el día con intención y presencia.', icon: '🌅' },
  { id: 'tarde', label: 'En la Tarde', desc: 'Una pausa revitalizante a mitad de jornada.', icon: '☀️' },
  { id: 'noche', label: 'En la Noche', desc: 'Soltar el día y preparar un descanso profundo.', icon: '🌙' },
  { id: 'cualquiera', label: 'Cualquier Momento', desc: 'Cuando el motor detecte la necesidad.', icon: '✨' },
];

const OnboardingWelcomeWizard: React.FC<OnboardingProps> = ({ firstName, onCompleted, onClose }) => {
  const [step, setStep] = useState<number>(0);
  const [selectedGoal, setSelectedGoal] = useState<typeof GOALS[0] | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedMoment, setSelectedMoment] = useState<string>('cualquiera');
  const [riskLevel, setRiskLevel] = useState<string>('leve');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const toggleEmotion = (id: string) => {
    setSelectedEmotions(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const handleFinish = async () => {
    setSubmitting(true);
    const psychProfile = selectedGoal ? selectedGoal.psychProfile : 'Buscador de Sentido';
    const emotions = selectedEmotions.length > 0 ? selectedEmotions : ['ansiedad'];

    try {
      // 1. Update AWE profile in backend
      await api.patch('/api/portal/awe/profile/', {
        psych_profile: psychProfile,
        current_emotions: emotions,
        risk_level: riskLevel,
        preferred_moment: selectedMoment,
      });

      // 2. Complete portal intake
      await api.post('/api/portal/intake/', {
        answers: {
          goal_title: selectedGoal?.title || 'Bienestar integral',
          psych_profile: psychProfile,
          emotions: emotions,
          moment: selectedMoment,
          risk_level: riskLevel,
        },
      });

      setStep(4); // Advance to revelation step
    } catch {
      setStep(4);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-emerald-100 overflow-hidden relative transition-all my-auto">
        
        {/* Top Accent Header */}
        <div className="h-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-700" />

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-lg transition-all"
            title="Cerrar"
          >
            ✕
          </button>
        )}

        <div className="p-6 sm:p-10">
          
          {/* Progress Bar (Steps 1-3) */}
          {step > 0 && step < 4 && (
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                <span>Paso {step} de 3</span>
                <span>{step === 1 ? 'Tu Propósito' : step === 2 ? 'Tus Emociones' : 'Tu Ritmo'}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              STEP 0: WARM BIENVENIDA
          ══════════════════════════════════════════════════════════ */}
          {step === 0 && (
            <div className="text-center py-4 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-4xl shadow-inner">
                🌿
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 block mb-2">
                  Bienvenido a Conexión Luz®
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                  Hola, {firstName || 'bienvenido/a'}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-lg mx-auto leading-relaxed">
                  Has dado un paso valioso al priorizar tu bienestar. Queremos conocerte mejor para adaptar nuestro **Adaptive Wisdom Engine (AWE)** a lo que necesitas en este momento.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 text-left">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-lg">🎯</span>
                  <p className="font-bold text-xs text-slate-800 mt-1">100% Personalizado</p>
                  <p className="text-[10px] text-slate-500">Recursos según tu momento</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-lg">⚖️</span>
                  <p className="font-bold text-xs text-slate-800 mt-1">5 Escuelas</p>
                  <p className="text-[10px] text-slate-500">Estoicismo, TCC, Logoterapia...</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-lg">🛡️</span>
                  <p className="font-bold text-xs text-slate-800 mt-1">Privado y Seguro</p>
                  <p className="text-[10px] text-slate-500">Tu espacio confidencial</p>
                </div>
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
              >
                Comenzar mi evaluación (2 min) →
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              STEP 1: BÚSQUEDA PRINCIPAL / PERFIL
          ══════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  ¿Qué buscas principalmente hoy en Conexión Luz?
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Selecciona la opción que más resuene con tu presente actual.
                </p>
              </div>

              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {GOALS.map(goal => (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                      selectedGoal?.id === goal.id
                        ? 'border-emerald-500 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-2xl shrink-0 mt-0.5">
                      {goal.icon}
                    </div>
                    <div className="flex-1">
                      <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full mb-1">
                        {goal.badge}
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm">{goal.title}</h4>
                      <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{goal.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setStep(0)}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  ← Atrás
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedGoal}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                    selectedGoal
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:scale-[1.01]'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Siguiente paso →
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              STEP 2: CHECKLIST EMOCIONAL
          ══════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  ¿Qué emociones han estado más presentes últimamente?
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Selecciona hasta 3 emociones (esto calibra la empatía del motor).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                {EMOTIONS.map(emo => {
                  const active = selectedEmotions.includes(emo.id);
                  return (
                    <button
                      key={emo.id}
                      onClick={() => toggleEmotion(emo.id)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        active
                          ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-900 shadow-sm'
                          : 'border-slate-100 bg-white hover:border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="text-xl">{emo.icon}</span>
                      <span className="text-xs">{emo.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Nivel de intensidad */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700 mb-2">¿Con qué intensidad sientes este malestar actualmente?</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'leve', label: 'Leve / Manejable', color: 'border-emerald-200 bg-emerald-50/50 text-emerald-800' },
                    { id: 'moderado', label: 'Moderada / Frecuente', color: 'border-amber-200 bg-amber-50/50 text-amber-800' },
                    { id: 'severo', label: 'Alta / Intensa', color: 'border-rose-200 bg-rose-50/50 text-rose-800' },
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      onClick={() => setRiskLevel(lvl.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        riskLevel === lvl.id ? `${lvl.color} ring-2 ring-emerald-500/20` : 'border-slate-100 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  ← Atrás
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={selectedEmotions.length === 0}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                    selectedEmotions.length > 0
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:scale-[1.01]'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Siguiente paso →
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              STEP 3: MOMENTO PREFERIDO Y RITMO
          ══════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  ¿En qué momento del día prefieres conectar con tu sabiduría?
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Tu cápsula de sabiduría AWE se adaptará a tu horario natural.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {MOMENTS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMoment(m.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedMoment === m.id
                        ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className="text-2xl mb-2">{m.icon}</div>
                    <h4 className="font-bold text-slate-800 text-sm">{m.label}</h4>
                    <p className="text-slate-500 text-xs mt-1 leading-snug">{m.desc}</p>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
                <span className="text-xl shrink-0">✨</span>
                <div>
                  <h5 className="font-bold text-xs text-emerald-900">Configuración completa</h5>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Al confirmar, el **Adaptive Wisdom Engine** calibrará tus preferencias y te entregará tu primera cápsula de sabiduría adaptada.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  ← Atrás
                </button>
                <button
                  onClick={handleFinish}
                  disabled={submitting}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm hover:scale-[1.01] transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Calibrar y Ver mi Sabiduría Inicial ✨'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              STEP 4: REVELACIÓN Y PRIMERA CÁPSULA AWE
          ══════════════════════════════════════════════════════════ */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold mb-1 shadow-xs">
                  <span>✨</span>
                  <span>Evaluación Completada y Calibrada</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  ¡Tu Perfil Inicial AWE está listo!
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  Tu perfil ha sido configurado como{' '}
                  <strong className="font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md inline-block">
                    {selectedGoal?.psychProfile || 'Buscador de Sentido'}
                  </strong>
                  . Aquí tienes tu primera cápsula de sabiduría personalizada:
                </p>
              </div>

              {/* Direct AWE Daily Widget embed */}
              <AWEDailyWidget className="shadow-2xl rounded-3xl" />

              <button
                onClick={onCompleted}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.005] active:scale-[0.995] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Ir a mi espacio personal de bienestar</span>
                <span className="text-lg">→</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OnboardingWelcomeWizard;
