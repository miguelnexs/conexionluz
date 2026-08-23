import React, { useEffect, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { safeSaveFeedPosts } from '../hooks/useCommunityPosts';
import AWEDailyWidget from '../components/awe/AWEDailyWidget';
import OnboardingWelcomeWizard from '../components/awe/OnboardingWelcomeWizard';
import {
  BookOpen,
  Lock,
  PlayCircle,
  Sparkles,
  Settings,
  LogOut,
  User,
  Activity,
  ChevronRight,
  CheckCircle2,
  Clock,
  ArrowRight,
  Camera,
  GitBranch,
  RotateCcw,
  ArrowLeft,
  Brain,
  TrendingUp,
  Zap,
  Check,
  NotebookPen,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { api } from '../api/client';
import { cn } from '@/lib/utils';

const getTokenKey = () => 'conexionluz:token';
const getPurchaseKey = (slug: string) => `conexionluz:purchased:${slug}`;

type PortalMe = {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  portalWelcomeTitle?: string;
  portalWelcomeMessage?: string;
  portalAccentColor?: string;
  intakeCompleted?: boolean;
  intakeSummary?: string;
  hasActiveSubscription?: boolean;
  profilePictureUrl?: string;
  birthDate?: string;
  gender?: string;
  occupation?: string;
  city?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  userType?: string;
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
    stageName: 'Área de Enfoque Principal',
    icon: '🌳',
    title: '¿Cuál es tu prioridad o necesidad principal en este momento?',
    subtitle: 'Cada proceso es único. Selecciona el camino que mejor representa lo que deseas transformar o cuidar hoy.',
    compassionNote: 'Tómate un momento para respirar. No hay respuestas correctas o incorrectas, solo tu sentir honesto.',
    options: [
      {
        id: 'opt_stress',
        label: 'Estrés y Carga Mental',
        emoji: '🌪️',
        description: 'Tensión acumulada, agobio diario, pensamientos acelerados o ansiedad.',
        nextNodeId: 'node_stress_focus',
        scores: { stress: 40, mood: 20, sleep: 25, energy: 20, focus: 25 },
      },
      {
        id: 'opt_mood',
        label: 'Estado de Ánimo y Emociones',
        emoji: '🌤️',
        description: 'Sentimientos de tristeza, desánimo, apatía o búsqueda de equilibrio interior.',
        nextNodeId: 'node_mood_focus',
        scores: { stress: 20, mood: 45, sleep: 20, energy: 25, focus: 20 },
      },
      {
        id: 'opt_sleep',
        label: 'Descanso y Vitalidad Física',
        emoji: '🌙',
        description: 'Insomnio, cansancio crónico, falta de energía o sueño no reparador.',
        nextNodeId: 'node_sleep_focus',
        scores: { stress: 25, mood: 20, sleep: 50, energy: 40, focus: 20 },
      },
      {
        id: 'opt_growth',
        label: 'Claridad y Crecimiento Espiritual',
        emoji: '🔮',
        description: 'Búsqueda de propósito, conexión interior, meditación y autoconocimiento.',
        nextNodeId: 'node_growth_focus',
        scores: { stress: 15, mood: 15, sleep: 15, energy: 30, focus: 45 },
      },
    ],
  },

  node_stress_focus: {
    id: 'node_stress_focus',
    stepNumber: 2,
    stageName: 'Manifestación del Estrés',
    icon: '⚡',
    title: '¿Cómo se manifiesta la tensión principalmente en tu vida?',
    subtitle: 'Identificar el canal por donde el cuerpo y la mente se expresan es el primer paso para sanar.',
    compassionNote: 'Reconocer lo que sentimos con honestidad libera gran parte de la presión acumulada.',
    options: [
      {
        id: 'opt_s_mental',
        label: 'En la Mente: Rumiación y Alerta',
        emoji: '🧠',
        description: 'Pensamientos en bucle, preocupación constante e incapacidad de desconectar.',
        nextNodeId: 'node_frequency',
        scores: { stress: 30, mood: 15, sleep: 20, energy: 15, focus: 35 },
      },
      {
        id: 'opt_s_somatic',
        label: 'En el Cuerpo: Tensión Física',
        emoji: '🏋️',
        description: 'Dolor en cuello o espalda, nudo en el estómago, presión en el pecho o migrañas.',
        nextNodeId: 'node_frequency',
        scores: { stress: 35, mood: 10, sleep: 25, energy: 30, focus: 15 },
      },
      {
        id: 'opt_s_emotional',
        label: 'En las Emociones: Irritabilidad',
        emoji: '🔥',
        description: 'Cambios de humor, hipersensibilidad, poca paciencia o llanto espontáneo.',
        nextNodeId: 'node_frequency',
        scores: { stress: 25, mood: 35, sleep: 15, energy: 20, focus: 20 },
      },
    ],
  },

  node_mood_focus: {
    id: 'node_mood_focus',
    stepNumber: 2,
    stageName: 'Origen y Sentir Emocional',
    icon: '💧',
    title: '¿Qué describe mejor tu estado emocional reciente?',
    subtitle: 'Tus emociones son un mensaje interno. Vamos a escuchar lo que necesitan decirte.',
    compassionNote: 'Todas las emociones son válidas y merecen su propio tiempo y espacio de asimilación.',
    options: [
      {
        id: 'opt_m_apathy',
        label: 'Desconexión o Desinterés',
        emoji: '🍂',
        description: 'Me cuesta sentir ilusión o entusiasmo por actividades que solía disfrutar.',
        nextNodeId: 'node_frequency',
        scores: { stress: 15, mood: 40, sleep: 15, energy: 35, focus: 25 },
      },
      {
        id: 'opt_m_grief',
        label: 'Proceso de Duelo o Transición',
        emoji: '🌧️',
        description: 'Estoy asimilando una pérdida, separación, cambio de vida o nostalgia profunda.',
        nextNodeId: 'node_frequency',
        scores: { stress: 25, mood: 45, sleep: 20, energy: 20, focus: 15 },
      },
      {
        id: 'opt_m_burnout',
        label: 'Agotamiento por Autoexigencia',
        emoji: '🪫',
        description: 'Siento que he dado demasiado de mí al trabajo o a otros y me quedé sin reservas.',
        nextNodeId: 'node_frequency',
        scores: { stress: 35, mood: 30, sleep: 25, energy: 40, focus: 20 },
      },
    ],
  },

  node_sleep_focus: {
    id: 'node_sleep_focus',
    stepNumber: 2,
    stageName: 'Patrón de Descanso',
    icon: '🛌',
    title: '¿En qué punto del sueño encuentras mayor dificultad?',
    subtitle: 'El sueño reparador restaura tu sistema nervioso y tu claridad mental.',
    compassionNote: 'El descanso no es un lujo, es una necesidad básica para cuidar de ti.',
    options: [
      {
        id: 'opt_sl_init',
        label: 'Dificultad para Conciliar el Sueño',
        emoji: '🕰️',
        description: 'Me acuesto pero la mente no se detiene y paso horas dando vueltas en la cama.',
        nextNodeId: 'node_frequency',
        scores: { stress: 30, mood: 15, sleep: 45, energy: 25, focus: 30 },
      },
      {
        id: 'opt_sl_interr',
        label: 'Despertares Nocturnos Frecuentes',
        emoji: '🦉',
        description: 'Me despierto varias veces en la madrugada y me cuesta volver a conciliar el sueño.',
        nextNodeId: 'node_frequency',
        scores: { stress: 25, mood: 20, sleep: 40, energy: 30, focus: 20 },
      },
      {
        id: 'opt_sl_fatigue',
        label: 'Sueño Superficial o No Reparador',
        emoji: '🥱',
        description: 'Duermo suficientes horas pero despierto con pesadez, como si no hubiera descansado.',
        nextNodeId: 'node_frequency',
        scores: { stress: 20, mood: 25, sleep: 35, energy: 45, focus: 20 },
      },
    ],
  },

  node_growth_focus: {
    id: 'node_growth_focus',
    stepNumber: 2,
    stageName: 'Camino de Crecimiento',
    icon: '✨',
    title: '¿Hacia dónde quieres enfocar tu proceso personal?',
    subtitle: 'El crecimiento comienza reconociendo lo que más anhela tu presente.',
    compassionNote: 'Cada paso que das en tu autoconocimiento transforma tu perspectiva de vida.',
    options: [
      {
        id: 'opt_gr_purpose',
        label: 'Claridad de Propósito y Sentido',
        emoji: '🌟',
        description: 'Deseo conectar con un propósito más profundo y dar dirección clara a mi vida.',
        nextNodeId: 'node_frequency',
        scores: { stress: 15, mood: 35, sleep: 10, energy: 30, focus: 40 },
      },
      {
        id: 'opt_gr_habits',
        label: 'Hábitos Saludables y Consistencia',
        emoji: '🌿',
        description: 'Quiero construir rutinas que me nutran sin exigencias ni culpabilidad.',
        nextNodeId: 'node_frequency',
        scores: { stress: 20, mood: 20, sleep: 20, energy: 35, focus: 30 },
      },
    ],
  },
};

// ─── Intake Diagnostic Screen ─────────────────────────────────────────────────

const IntakeScreen = ({ firstName, onCompleted }: { firstName: string; onCompleted: () => void }) => {
  const [phase, setPhase] = useState<'welcome' | 'questions' | 'celebration'>('welcome');
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<IntakeAnswers>({
    stress: 0, anxiety: 0, mood: 0, sleep: 0, energy: 0, focus: 0, goal: '',
  });
  const [selectedVisible, setSelectedVisible] = useState(true);

  const currentStep = INTAKE_STEPS[step];
  const progress = ((step + 1) / INTAKE_STEPS.length) * 100;
  const isLastStep = step === INTAKE_STEPS.length - 1;

  const animateToStep = (newStep: number, dir: 'forward' | 'back') => {
    if (animating) return;
    setAnimating(true);
    setSelectedVisible(false);
    setDirection(dir);
    setTimeout(() => {
      setStep(newStep);
      setSelectedVisible(true);
      setAnimating(false);
    }, 320);
  };

  const handleNext = () => {
    if (step < INTAKE_STEPS.length - 1) animateToStep(step + 1, 'forward');
  };
  const handleBack = () => {
    if (step > 0) animateToStep(step - 1, 'back');
  };

  const handleOptionSelect = (value: number) => {
    const key = currentStep.key as IntakeScaleKey;
    setAnswers(p => ({ ...p, [key]: value }));
    if (!isLastStep) {
      setTimeout(() => handleNext(), 350);
    }
  };

  const submit = async () => {
    setError(null);
    setSaving(true);
    const res = await api.post<{ completed: boolean; summary: string }>('/api/portal/intake/', { answers });
    if (!res.ok) {
      setError(res.error);
      setSaving(false);
      return;
    }
    setSaving(false);
    setPhase('celebration');
    setTimeout(() => onCompleted(), 4000);
  };

  if (phase === 'welcome') {
    return <WelcomeSplash name={firstName} onStart={() => setPhase('questions')} />;
  }
  if (phase === 'celebration') {
    return <CelebrationScreen name={firstName} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fcfcfc',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background ambient */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-15%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: `radial-gradient(circle, ${currentStep.glow.replace('0.3', '0.08')} 0%, transparent 70%)`,
          transition: 'background 0.8s ease',
          animation: 'bgPulse 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-15%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: `radial-gradient(circle, ${currentStep.glow.replace('0.3', '0.06')} 0%, transparent 70%)`,
          transition: 'background 0.8s ease',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '540px',
        background: '#ffffff',
        borderRadius: '28px',
        border: `1px solid #e5e7eb`,
        overflow: 'hidden',
        boxShadow: `0 25px 80px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)`,
        transition: 'border-color 0.6s ease, box-shadow 0.6s ease',
        position: 'relative', zIndex: 1,
      }}>

        {/* Progress Header */}
        <div style={{
          padding: '1.5rem 2rem 1.25rem',
          background: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem' }}>{currentStep.icon}</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6b7280', letterSpacing: '0.08em' }}>
                PASO {step + 1} DE {INTAKE_STEPS.length}
              </span>
            </div>
            <span style={{
              fontSize: '0.82rem', fontWeight: 800,
              background: currentStep.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {Math.round(progress)}%
            </span>
          </div>

          {/* Progress bar */}
          <div style={{
            height: '5px', background: '#e5e7eb',
            borderRadius: '100px', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: currentStep.gradient,
              borderRadius: '100px',
              transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: `0 0 12px ${currentStep.glow}`,
            }} />
          </div>

          {/* Step dots */}
          <div style={{ display: 'flex', gap: '5px', marginTop: '0.75rem', justifyContent: 'center' }}>
            {INTAKE_STEPS.map((s, i) => (
              <div key={i} style={{
                height: '4px',
                width: i === step ? '20px' : '6px',
                borderRadius: '100px',
                background: i <= step ? currentStep.gradient : '#e5e7eb',
                transition: 'all 0.4s ease',
              }} />
            ))}
          </div>
        </div>

        {/* Content area */}
        <div style={{
          padding: '2rem',
          opacity: selectedVisible ? 1 : 0,
          transform: selectedVisible
            ? 'translateX(0)'
            : direction === 'forward' ? 'translateX(30px)' : 'translateX(-30px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}>

          {/* Question */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{
              fontSize: 'clamp(1.4rem, 3.5vw, 1.9rem)',
              fontWeight: 900,
              color: '#111827',
              lineHeight: 1.15,
              margin: '0 0 0.6rem',
              letterSpacing: '-0.02em',
            }}>
              {currentStep.title}
            </h2>
            <p style={{
              color: '#4b5563',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              margin: '0 0 1rem',
            }}>
              {currentStep.subtitle}
            </p>

            {/* Compassion note — mensaje de acompañamiento */}
            {'compassionNote' in currentStep && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: `${currentStep.bgAccent}`,
                border: `1px solid ${currentStep.borderAccent}`,
                marginBottom: '0.25rem',
              }}>
                <span style={{ fontSize: '0.9rem', flexShrink: 0, marginTop: '1px' }}>💙</span>
                <p style={{
                  margin: 0,
                  fontSize: '0.82rem',
                  color: '#4b5563',
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                }}>
                  {(currentStep as any).compassionNote}
                </p>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: '1.25rem',
              padding: '0.85rem 1rem',
              borderRadius: '14px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#fc8585',
              fontSize: '0.875rem',
            }}>
              ⚠ {error}
            </div>
          )}

          {/* Options */}
          {currentStep.key === 'goal' ? (
            <div>
              <textarea
                value={answers.goal}
                onChange={e => setAnswers(p => ({ ...p, goal: e.target.value }))}
                placeholder="Ejemplo: Quiero aprender a manejar mi ansiedad, sentirme más tranquilo(a) y reconectar conmigo mismo(a)..."
                rows={5}
                autoFocus
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '1.1rem 1.25rem',
                  borderRadius: '16px',
                  border: `1px solid #d1d5db`,
                  background: '#f9fafb',
                  color: '#111827',
                  fontSize: '0.97rem',
                  lineHeight: 1.7,
                  outline: 'none',
                  resize: 'none',
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit',
                }}
                onFocus={e => {
                  (e.target as HTMLTextAreaElement).style.boxShadow = `0 0 0 3px ${currentStep.glow.replace('0.3', '0.2')}`;
                  (e.target as HTMLTextAreaElement).style.borderColor = currentStep.borderAccent.replace('0.2', '0.5');
                }}
                onBlur={e => {
                  (e.target as HTMLTextAreaElement).style.boxShadow = 'none';
                  (e.target as HTMLTextAreaElement).style.borderColor = '#d1d5db';
                }}
              />
              {/* Hint & counter */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginTop: '0.6rem', padding: '0 0.25rem',
              }}>
                <span style={{ fontSize: '0.76rem', color: '#6b7280', fontStyle: 'italic' }}>
                  No hay respuestas correctas o incorrectas 🤍
                </span>
                <span style={{
                  fontSize: '0.74rem', fontWeight: 700,
                  color: answers.goal.length > 10 ? '#10b981' : '#9ca3af',
                  transition: 'color 0.3s',
                }}>
                  {answers.goal.length} caracteres
                </span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {currentStep.options?.map(opt => {
                const key = currentStep.key as IntakeScaleKey;
                const isActive = answers[key] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    id={`intake-option-${currentStep.key}-${opt.value}`}
                    onClick={() => handleOptionSelect(opt.value)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '1rem 1.25rem',
                      borderRadius: '16px',
                      border: `1px solid ${isActive ? opt.color : '#e5e7eb'}`,
                      background: isActive ? `${opt.color}10` : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      textAlign: 'left',
                      transform: isActive ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: isActive ? `0 4px 15px ${opt.color}30` : 'none',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.background = '#f9fafb';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = '#d1d5db';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.background = '#ffffff';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb';
                      }
                    }}
                  >
                    <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{opt.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 700, fontSize: '0.95rem',
                        color: isActive ? opt.color : '#374151',
                        transition: 'color 0.2s',
                      }}>
                        {opt.label}
                      </div>
                      <div style={{
                        fontSize: '0.78rem',
                        color: isActive ? opt.color : '#6b7280',
                        transition: 'color 0.2s',
                        marginTop: '1px',
                      }}>
                        {opt.description}
                      </div>
                    </div>
                    {/* Active indicator */}
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      border: `2px solid ${isActive ? opt.color : '#d1d5db'}`,
                      background: isActive ? opt.color : 'transparent',
                      flexShrink: 0,
                      transition: 'all 0.25s ease',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isActive && (
                        <div style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          background: '#fff',
                        }} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div style={{
          padding: '1.25rem 2rem 1.75rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
          borderTop: '1px solid #e5e7eb',
        }}>
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0 || saving}
            style={{
              padding: '0.7rem 1.4rem',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              background: '#ffffff',
              color: step === 0 ? '#d1d5db' : '#4b5563',
              fontWeight: 700, fontSize: '0.88rem',
              cursor: step === 0 ? 'default' : 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              if (step > 0) (e.currentTarget as HTMLButtonElement).style.background = '#f3f4f6';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#ffffff';
            }}
          >
            ← Atrás
          </button>

          {isLastStep ? (
            <button
              id="intake-finish-btn"
              type="button"
              onClick={() => void submit()}
              disabled={saving || !answers.goal.trim()}
              style={{
                flex: 1, padding: '0.9rem 1.5rem',
                borderRadius: '14px', border: 'none',
                background: saving || !answers.goal.trim()
                  ? '#e5e7eb'
                  : 'linear-gradient(135deg, #10b981, #0ea5e9)',
                color: saving || !answers.goal.trim() ? '#9ca3af' : '#fff',
                fontWeight: 800, fontSize: '0.95rem',
                cursor: saving || !answers.goal.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: !saving && answers.goal.trim()
                  ? '0 4px 15px rgba(16, 185, 129, 0.4)'
                  : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
              }}
            >
              {saving ? (
                <>
                  <span style={{
                    width: '14px', height: '14px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite', display: 'inline-block',
                  }} />
                  Guardando...
                </>
              ) : (
                <>🌟 Completar mi diagnóstico</>
              )}
            </button>
          ) : (
            <button
              id="intake-next-btn"
              type="button"
              onClick={handleNext}
              disabled={animating}
              style={{
                flex: 1, padding: '0.9rem 1.5rem',
                borderRadius: '14px', border: 'none',
                background: currentStep.gradient,
                color: '#fff', fontWeight: 800, fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 20px ${currentStep.glow}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 28px ${currentStep.glow}`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 20px ${currentStep.glow}`;
              }}
            >
              Siguiente <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bgPulse {
          0%,100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// ─── Daily Checkin Card ───────────────────────────────────────────────────────

const DailyCheckinCard = ({ onComplete }: { onComplete: (level: string) => void }) => {
  const [saving, setSaving] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const handleSelect = async (level: string) => {
    setSaving(true);
    const res = await api.post('/api/portal/daily-checkin/', { energyLevel: level });
    // We proceed regardless to show the UI
    setSelectedLevel(level);
    setSaving(false);
  };

  const MOOD_CONTENT: Record<string, { title: string, text: string, action: string, emoji: string, colors: string, shadow: string, border: string }> = {
    high: {
      emoji: '✨',
      title: '¡Qué alegría verte brillar!',
      text: 'Tu energía hoy es un regalo. Aprovecha este estado de alta vibración para conectar con tu propósito, crear algo hermoso o simplemente disfrutar el momento presente. Tu luz inspira a los demás.',
      action: 'Hoy es un gran día para avanzar en tus metas o compartir tu alegría con alguien más.',
      colors: 'bg-gradient-to-br from-amber-50 to-orange-100 text-orange-900',
      shadow: 'shadow-orange-200',
      border: 'border-orange-200'
    },
    good: {
      emoji: '🌱',
      title: 'Un día a la vez, en equilibrio',
      text: 'Estar bien es un hermoso estado de serenidad. No necesitas estar eufórico para tener un buen día. Disfruta de esta calma, respira y fluye con las pequeñas cosas que la vida te ofrece hoy.',
      action: 'Tómate un té o un café con calma, y agradece tres cosas simples de tu día.',
      colors: 'bg-gradient-to-br from-emerald-50 to-teal-100 text-teal-900',
      shadow: 'shadow-teal-200',
      border: 'border-teal-200'
    },
    tired: {
      emoji: '🫂',
      title: 'Está bien necesitar descanso',
      text: 'Tu cuerpo es sabio y hoy te está pidiendo una pausa. El agotamiento no es debilidad, es una señal de que has dado mucho. Permítete bajar el ritmo, soltar la autoexigencia y ser amable contigo mismo.',
      action: 'Intenta dormir un poco más hoy, o tómate 10 minutos para recostarte y no hacer absolutamente nada.',
      colors: 'bg-gradient-to-br from-blue-50 to-indigo-100 text-indigo-900',
      shadow: 'shadow-indigo-200',
      border: 'border-indigo-200'
    },
    low: {
      emoji: '🌧️',
      title: 'Te abrazo en este momento difícil',
      text: 'Los días grises son válidos y necesarios. No tienes que ser fuerte todo el tiempo. Sea lo que sea que estés sintiendo, déjalo estar sin juzgarlo. Recuerda que las nubes pasan, y el cielo azul siempre sigue ahí detrás.',
      action: 'Escribe lo que sientes para sacarlo de tu mente, o abraza a alguien en quien confíes. No estás solo.',
      colors: 'bg-gradient-to-br from-slate-100 to-gray-200 text-gray-800',
      shadow: 'shadow-gray-300',
      border: 'border-gray-300'
    }
  };

  if (selectedLevel && MOOD_CONTENT[selectedLevel]) {
    const content = MOOD_CONTENT[selectedLevel];
    return (
      <div className={`mb-8 rounded-2xl sm:rounded-[2.5rem] border ${content.border} ${content.colors} p-6 sm:p-10 md:p-12 shadow-xl ${content.shadow} transition-all duration-700 animate-in fade-in zoom-in-95 relative overflow-hidden`}>
        {/* Decorative background circle */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/40 rounded-full blur-3xl pointer-events-none animate-pulse" />
        
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="text-5xl sm:text-6xl mb-6 animate-bounce" style={{ animationDuration: '3s' }}>{content.emoji}</div>
          <h3 className="text-2xl sm:text-3xl font-black mb-4 tracking-tight">{content.title}</h3>
          <p className="text-base sm:text-lg opacity-90 leading-relaxed font-medium mb-6">
            {content.text}
          </p>
          <div className="bg-white/50 rounded-xl p-4 sm:p-5 inline-block text-sm sm:text-base font-bold shadow-sm backdrop-blur-sm border border-white/60">
            💡 {content.action}
          </div>
          
          <div className="mt-10">
            <button 
              onClick={() => onComplete(selectedLevel)}
              className="px-6 py-3 bg-white/80 hover:bg-white text-gray-900 font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              Continuar a mi espacio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-2xl sm:rounded-[2.5rem] bg-white border border-gray-100 p-6 sm:p-8 md:p-12 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Activity className="w-40 h-40 text-primary" />
      </div>
      <div className="relative z-10 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-primary">Check-in Diario</span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">¿Cómo te sientes en este instante?</h3>
            <p className="text-gray-500 mt-2 text-sm sm:text-base font-medium">Tómate una pausa y sé honesto/a contigo mismo/a. Este es un espacio seguro.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'high', label: 'Radiante', desc: 'Con mucha energía', emoji: '✨', color: 'from-amber-100 to-orange-100 text-orange-700', border: 'border-orange-200' },
            { id: 'good', label: 'En calma', desc: 'Tranquilo(a) y estable', emoji: '🌱', color: 'from-emerald-100 to-teal-100 text-teal-700', border: 'border-teal-200' },
            { id: 'tired', label: 'Agotado/a', desc: 'Necesito descansar', emoji: '🫂', color: 'from-blue-100 to-indigo-100 text-indigo-700', border: 'border-indigo-200' },
            { id: 'low', label: 'Difícil', desc: 'Día gris o pesado', emoji: '🌧️', color: 'from-slate-100 to-gray-200 text-gray-700', border: 'border-gray-300' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => void handleSelect(opt.id)}
              disabled={saving}
              className={`group relative overflow-hidden rounded-2xl border ${opt.border} bg-gradient-to-br ${opt.color} p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg disabled:opacity-50 flex flex-col items-center justify-center gap-3 text-center active:scale-95`}
            >
              <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">{opt.emoji}</span>
              <div>
                <span className="block text-lg font-black">{opt.label}</span>
                <span className="block text-xs font-semibold opacity-80 mt-1">{opt.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Profile Page ─────────────────────────────────────────────────────────────

const ProfilePage = () => {
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem(getTokenKey()) : null;
  const isAuthed = Boolean(token);
  const [me, setMe] = useState<PortalMe | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [activeTab, setActiveTab] = useState<'wellbeing' | 'test' | 'courses' | 'settings'>('wellbeing');
  const [prefs, setPrefs] = useState({ title: '', message: '', color: '' });
  const [profileForm, setProfileForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', birthDate: '', gender: '',
    occupation: '', city: '', address: '', emergencyContactName: '', emergencyContactPhone: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [dailyCheckin, setDailyCheckin] = useState<{hasCheckedIn: boolean, energyLevel: string|null}>({hasCheckedIn: true, energyLevel: null});

  const handleUploadPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingPicture(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/portal/me/picture/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
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
  
  const loadMe = async () => {
    if (!token) { setLoadingMe(false); return; }
    const res = await api.get<PortalMe>('/api/portal/me/');
    if (res.ok) {
      setMe(res.data);
      setPrefs({
        title: res.data.portalWelcomeTitle || '',
        message: res.data.portalWelcomeMessage || '',
        color: res.data.portalAccentColor || '#22c55e',
      });
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
      });
    }
    setLoadingMe(false);
  };

  const [aweProfileData, setAweProfileData] = useState<{
    psych_profile: string;
    current_emotions: string[];
    risk_level: string;
    preferred_moment: string;
  } | null>(null);

  useEffect(() => {
    void loadMe();
    if (!isAuthed) return;
    api.get<{hasCheckedIn: boolean, energyLevel: string|null}>('/api/portal/daily-checkin/').then(res => {
      if (res.ok) setDailyCheckin(res.data);
    });
    api.get<{ok: boolean, profile: any}>('/api/portal/awe/profile/').then(res => {
      if (res.ok && res.data.profile) setAweProfileData(res.data.profile);
    });
  }, [isAuthed]);

  const accent = me?.portalAccentColor || '#22c55e';
  const hasHipnosis = localStorage.getItem(getPurchaseKey('hipnosis-interdimencional')) === '1';

  if (!isAuthed) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (loadingMe) return <div className="min-h-screen bg-white" />;

  const justRegistered = Boolean((location.state as any)?.justRegistered);

  // Render Full Page Onboarding Welcome Wizard if first time, just registered, or selected tab
  if ((me && (!me.intakeCompleted || justRegistered)) || activeTab === 'test') {
    return (
      <OnboardingWelcomeWizard
        firstName={me?.firstName || ''}
        onCompleted={() => {
          if (location.state) {
            window.history.replaceState({}, document.title);
          }
          void loadMe();
        }}
        onClose={activeTab === 'test' ? () => setActiveTab('wellbeing') : undefined}
      />
    );
  }

  const logout = () => {
    localStorage.removeItem(getTokenKey());
    window.location.href = '/login';
  };

  const savePreferences = async () => {
    setSavingPrefs(true);
    const res = await api.patch<PortalMe>('/api/portal/me/', {
      portalWelcomeTitle: prefs.title,
      portalWelcomeMessage: prefs.message,
      portalAccentColor: prefs.color,
    });
    if (res.ok) { setMe(res.data); }
    setSavingPrefs(false);
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    const res = await api.patch<PortalMe>('/api/portal/me/', profileForm);
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
        } catch (e) {
          console.error(e);
        }
      }
    }
    setSavingProfile(false);
  };

  const initials = `${me?.firstName?.[0] || ''}${me?.lastName?.[0] || ''}`.toUpperCase();

  return (
    <PublicLayout contentClassName="p-0">
      <div className="min-h-screen bg-[#fcfcfc] overflow-x-hidden">
        {/* Header */}
        <header
          className="relative py-10 md:py-16 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${accent}15 0%, rgba(255,255,255,1) 50%, ${accent}08 100%)` }}
        >
          <div className="w-full px-4 md:px-8 relative z-10">
            <div className="w-full">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                <div className="relative group">
                  <label className={cn("h-24 w-24 sm:h-28 sm:w-28 rounded-2xl sm:rounded-[2rem] bg-white shadow-2xl flex items-center justify-center text-3xl sm:text-4xl font-black text-gray-800 ring-4 ring-white border border-gray-100 transform group-hover:rotate-6 transition-transform duration-500 cursor-pointer overflow-hidden relative", uploadingPicture && "opacity-50")}>
                    {me?.profilePictureUrl ? (
                      <img src={me.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      initials || <User className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleUploadPicture} disabled={uploadingPicture} />
                  </label>
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 h-8 w-8 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-white shadow-lg flex items-center justify-center border border-gray-50">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-5xl lg:text-5xl font-black tracking-tight text-gray-900 mb-2 sm:mb-3">
                    {me?.portalWelcomeTitle || `Hola, ${me?.firstName}`}
                  </h1>
                  <p className="text-base md:text-lg text-gray-500 max-w-2xl leading-relaxed mb-6 sm:mb-6">
                    {me?.portalWelcomeMessage || 'Bienvenido(a) a tu espacio personal de sanación y crecimiento.'}
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <button
                      onClick={() => setActiveTab('test')}
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4" />
                      Calibrar Mi Sabiduría AWE
                    </button>
                    <button
                      onClick={logout}
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white border border-gray-100 text-gray-600 text-sm font-bold shadow-sm hover:shadow-md hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard */}
        <main className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pb-20 mt-6 overflow-x-hidden">
          <div className="w-full">
            {/* Tabs */}
            <div className="mb-8 sm:mb-12">
              <div className="grid grid-cols-2 sm:flex sm:w-fit items-center gap-1 p-1 bg-gray-100/50 rounded-xl sm:rounded-2xl">
              {[
                { id: 'wellbeing', label: 'Mi Bienestar', icon: Activity },
                { id: 'courses', label: 'Mis Cursos', icon: BookOpen },
                { id: 'test', label: 'Calibrar AWE', icon: Sparkles },
                { id: 'settings', label: 'Ajustes', icon: Settings },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={cn(
                    'flex items-center justify-center gap-1.5 px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 w-full',
                    activeTab === t.id
                      ? 'bg-white shadow-md text-gray-900 scale-[1.02]'
                      : 'text-gray-500 hover:text-gray-800'
                  )}
                >
                  <t.icon className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0', activeTab === t.id ? 'text-primary' : 'text-gray-400')} />
                  <span className="truncate">{t.label}</span>
                </button>
              ))}
              </div>
            </div>

            {/* Tab panels */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'wellbeing' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Estado de Bienestar y Calibración AWE Card */}
                  <div className="rounded-2xl sm:rounded-[2.5rem] bg-white border border-emerald-100/80 p-6 sm:p-8 md:p-10 shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl shrink-0">
                            🌱
                          </div>
                          <div>
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-600 block">
                              Calibración Adaptativa Motor AWE
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                              Tu Estado de Bienestar Actual
                            </h3>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveTab('test')}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-all border border-emerald-200 cursor-pointer"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Re-calibrar Evaluación
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Perfil Psicológico */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-teal-50/30 border border-emerald-100">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block mb-1">
                            Perfil Terapéutico
                          </span>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xl">
                              {aweProfileData?.psych_profile === 'Vigilante' ? '🧘' : aweProfileData?.psych_profile === 'Guerrero Agotado' ? '🔋' : aweProfileData?.psych_profile === 'Corazón Abierto' ? '🫂' : aweProfileData?.psych_profile === 'Mente Analítica' ? '🧠' : '🌟'}
                            </span>
                            <h4 className="font-black text-slate-800 text-base">
                              {aweProfileData?.psych_profile || 'Buscador de Sentido'}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Personalizado según tus metas en la plataforma.
                          </p>
                        </div>

                        {/* Nivel de Intensidad */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50/50 to-emerald-50/30 border border-teal-100">
                          <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 block mb-1">
                            Carga Emocional
                          </span>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xl">
                              {aweProfileData?.risk_level === 'intenso' ? '⚡' : aweProfileData?.risk_level === 'moderado' ? '🌤️' : '🍃'}
                            </span>
                            <h4 className="font-black text-slate-800 text-base capitalize">
                              {aweProfileData?.risk_level || 'Leve'}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Graduación de los ejercicios del motor AWE.
                          </p>
                        </div>

                        {/* Horario Preferido */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/30 border border-slate-200/60">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                            Horario Preferido
                          </span>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xl">
                              {aweProfileData?.preferred_moment === 'mañana' ? '🌅' : aweProfileData?.preferred_moment === 'tarde' ? '☀️' : aweProfileData?.preferred_moment === 'noche' ? '🌙' : '✨'}
                            </span>
                            <h4 className="font-black text-slate-800 text-base capitalize">
                              {aweProfileData?.preferred_moment || 'Cualquier Momento'}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Momento óptimo para tus reflexiones diarias.
                          </p>
                        </div>
                      </div>

                      {/* Emociones y Síntomas Detectados */}
                      <div className="pt-4 border-t border-slate-100">
                        <span className="text-xs font-bold text-slate-700 block mb-3">
                          Síntomas y Emociones Frecuentes Registradas en tu Formulario:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {aweProfileData?.current_emotions && aweProfileData.current_emotions.length > 0 ? (
                            aweProfileData.current_emotions.map((emoKey) => {
                              const emo = {
                                ansiedad: { label: 'Ansiedad o Inquietud', icon: '🌀' },
                                agotamiento: { label: 'Agotamiento Físico/Mental', icon: '🔋' },
                                tristeza: { label: 'Tristeza o Vacío', icon: '🌧️' },
                                miedo: { label: 'Miedo al Futuro', icon: '🛡️' },
                                enojo: { label: 'Frustración o Irritabilidad', icon: '⚡' },
                                soledad: { label: 'Sensación de Soledad', icon: '🍃' },
                                culpa: { label: 'Culpa o Autocrítica', icon: '🪞' },
                                confusion: { label: 'Confusión o Desorientación', icon: '🔍' },
                                esperanza: { label: 'Deseo de Cambio y Esperanza', icon: '🌱' },
                                gratitud: { label: 'Gratitud por un Nuevo Comienzo', icon: '✨' },
                              }[emoKey] || { label: emoKey, icon: '🌱' };
                              return (
                                <span
                                  key={emoKey}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm"
                                >
                                  <span>{emo.icon}</span>
                                  <span>{emo.label}</span>
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              Sin síntomas agudos registrados en la evaluación inicial.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Adaptive Wisdom Engine (AWE) Widget */}
                  <AWEDailyWidget className="shadow-xl" />

                  {/* Daily Check-in Widget */}
                  {dailyCheckin.hasCheckedIn && dailyCheckin.energyLevel ? (
                    <div className="rounded-2xl sm:rounded-[2.5rem] bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-3xl">
                          {dailyCheckin.energyLevel === 'high' ? '✨' : dailyCheckin.energyLevel === 'good' ? '🌱' : dailyCheckin.energyLevel === 'tired' ? '🫂' : '🌧️'}
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-gray-900">Tu energía de hoy está registrada</h4>
                          <p className="text-sm text-gray-600 font-medium mt-1">Gracias por escucharte. Si tu estado cambia, puedes actualizarlo.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setDailyCheckin({ hasCheckedIn: false, energyLevel: null })}
                        className="px-5 py-2.5 bg-white text-primary font-bold rounded-xl shadow-sm border border-primary/20 hover:bg-primary/5 transition-all text-sm"
                      >
                        Actualizar Check-in
                      </button>
                    </div>
                  ) : (
                    <DailyCheckinCard onComplete={(level) => setDailyCheckin({ hasCheckedIn: true, energyLevel: level })} />
                  )}

                  {/* Wellbeing Summary */}
                  {me?.intakeSummary ? (
                    <div className="group relative rounded-2xl sm:rounded-[2.5rem] bg-white border border-gray-100 p-6 sm:p-10 md:p-12 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                      {/* Decorative Background */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Activity className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <span className="text-xs font-black uppercase tracking-widest text-primary block">Diagnóstico Inicial</span>
                            <h3 className="text-xl sm:text-2xl font-black text-gray-900">Tu perfil de bienestar</h3>
                          </div>
                        </div>
                        
                        <div className="prose prose-gray max-w-none bg-gray-50/50 p-6 sm:p-8 rounded-2xl border border-gray-100/50">
                          <p className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line font-medium italic relative">
                            <span className="text-4xl text-primary/20 absolute -top-4 -left-2">"</span>
                            {me.intakeSummary}
                            <span className="text-4xl text-primary/20 absolute -bottom-6 -right-2">"</span>
                          </p>
                        </div>
                        
                        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 pt-8 sm:pt-10 border-t border-gray-100">
                          <Link to="/agenda" className="flex-1 text-center px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-gray-900 text-white font-black hover:scale-[1.02] active:scale-95 shadow-lg shadow-gray-900/20 transition-all text-sm sm:text-base leading-tight">
                            Agendar sesión de apoyo
                          </Link>
                          <Link to="/cursos" className="flex-1 text-center px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-primary/10 text-primary font-black hover:bg-primary/20 active:scale-95 transition-all text-sm sm:text-base leading-tight">
                            Explorar recursos y cursos
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative rounded-2xl sm:rounded-[2.5rem] bg-white border border-gray-100 p-8 sm:p-12 shadow-sm text-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />
                      <div className="relative z-10 max-w-md mx-auto">
                        <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                          <Sparkles className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-3">Estamos preparando tu resumen</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                          Tu evaluación ha sido registrada exitosamente. Nuestro equipo y algoritmos están construyendo un resumen personalizado de tu bienestar que aparecerá aquí muy pronto.
                        </p>
                        <button className="mt-8 px-6 py-3 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed">
                          Resumen en proceso...
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'courses' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hasHipnosis ? (
                    <Link to="/cursos/hipnosis-interdimencional" className="group block">
                      <div className="h-full rounded-2xl sm:rounded-[2.5rem] bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                        <div className="aspect-[16/10] bg-gray-900 relative overflow-hidden">
                          <img
                            src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop"
                            alt="Hipnosis"
                            className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                          <div className="absolute bottom-6 left-6 right-6">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 block">Mis Cursos</span>
                            <h4 className="text-xl font-black text-white">Hipnosis Interdimencional</h4>
                          </div>
                        </div>
                        <div className="p-6 sm:p-8">
                          <p className="text-gray-500 text-sm line-clamp-2 mb-6">Accede a las herramientas de reprogramación subconsciente.</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                              <PlayCircle className="h-4 w-4" />
                              Continuar viendo
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="md:col-span-3 text-center py-16 sm:py-32 bg-white rounded-2xl sm:rounded-[2.5rem] border border-gray-100 shadow-sm px-4">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl sm:rounded-3xl bg-gray-50 flex items-center justify-center mx-auto mb-6">
                        <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Aún no tienes cursos</h3>
                      <p className="text-gray-500 text-sm sm:text-base mb-8 sm:mb-10 max-w-md mx-auto">Explora nuestra biblioteca y empieza tu transformación hoy mismo.</p>
                      <Link to="/cursos" className="inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-primary text-white font-black shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-sm sm:text-base">
                        Explorar Biblioteca
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Información Personal */}
                  <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-3">
                        <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        Información Personal
                      </h3>
                      <button
                        type="button"
                        onClick={() => void saveProfile()}
                        disabled={savingProfile}
                        className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold shadow-md hover:bg-gray-800 transition-all disabled:opacity-50 text-sm self-start sm:self-auto"
                      >
                        {savingProfile ? 'Guardando...' : 'Guardar Cambios'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Nombre</label>
                        <input
                          value={profileForm.firstName}
                          onChange={e => setProfileForm(p => ({ ...p, firstName: e.target.value }))}
                          className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Apellidos</label>
                        <input
                          value={profileForm.lastName}
                          onChange={e => setProfileForm(p => ({ ...p, lastName: e.target.value }))}
                          className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Correo Electrónico</label>
                        <input
                          value={profileForm.email}
                          onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                          type="email"
                          className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Teléfono</label>
                        <input
                          value={profileForm.phone}
                          onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                          className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Fecha de Nacimiento</label>
                        <input
                          type="date"
                          value={profileForm.birthDate}
                          onChange={e => setProfileForm(p => ({ ...p, birthDate: e.target.value }))}
                          className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Género</label>
                        <select
                          value={profileForm.gender}
                          onChange={e => setProfileForm(p => ({ ...p, gender: e.target.value }))}
                          className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                        >
                          <option value="">Seleccionar...</option>
                          <option value="Femenino">Femenino</option>
                          <option value="Masculino">Masculino</option>
                          <option value="Otro">Otro</option>
                          <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Ciudad</label>
                        <input
                          value={profileForm.city}
                          onChange={e => setProfileForm(p => ({ ...p, city: e.target.value }))}
                          className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Ocupación</label>
                        <input
                          value={profileForm.occupation}
                          onChange={e => setProfileForm(p => ({ ...p, occupation: e.target.value }))}
                          className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Dirección Completa</label>
                        <input
                          value={profileForm.address}
                          onChange={e => setProfileForm(p => ({ ...p, address: e.target.value }))}
                          className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Contacto Emergencia</label>
                        <input
                          value={profileForm.emergencyContactName}
                          onChange={e => setProfileForm(p => ({ ...p, emergencyContactName: e.target.value }))}
                          className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Teléfono Emergencia</label>
                        <input
                          value={profileForm.emergencyContactPhone}
                          onChange={e => setProfileForm(p => ({ ...p, emergencyContactPhone: e.target.value }))}
                          className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>


                  <div className="bg-gray-50/80 border border-gray-100 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 w-full">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Información de Cuenta</h3>
                    <p className="text-gray-500 text-sm mb-6">Gestiona la seguridad y accesos de tu cuenta.</p>
                    <div className="space-y-4">
                      <div className="flex items-start p-4 bg-white rounded-xl sm:rounded-2xl border border-gray-50">
                        <div className="flex items-start gap-3 min-w-0">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm font-bold text-gray-700 break-all">Email verificado: {me?.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl sm:rounded-2xl border border-gray-50">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-blue-500 shrink-0" />
                          <span className="text-xs sm:text-sm font-bold text-gray-700">Última evaluación: {me?.intakeCompleted ? 'Completada' : 'Pendiente'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </PublicLayout>
  );
};

export default ProfilePage;
