import React, { useEffect, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { Link, Navigate, useLocation } from 'react-router-dom';
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

type IntakeAnswers = {
  stress: number;
  anxiety: number;
  mood: number;
  sleep: number;
  energy: number;
  focus: number;
  goal: string;
};

type IntakeScaleKey = Exclude<keyof IntakeAnswers, 'goal'>;

// ─── Intake step configurations ────────────────────────────────────────────────

const INTAKE_STEPS = [
  {
    key: 'stress',
    icon: '🌿',
    title: 'Tu ritmo interior',
    subtitle: 'El estrés es una señal que merece atención, no juicio. ¿Con qué frecuencia has sentido tensión, presión o agobio en los últimos días?',
    compassionNote: 'Está bien si has sentido mucho estrés. Aquí estamos para acompañarte.',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    glow: 'rgba(16, 185, 129, 0.3)',
    bgAccent: 'rgba(16, 185, 129, 0.05)',
    borderAccent: 'rgba(16, 185, 129, 0.2)',
    options: [
      { value: 0, label: 'En calma', emoji: '🌱', description: 'Me he sentido relajado(a) y fluyendo', color: '#059669' },
      { value: 1, label: 'Con algunas olas', emoji: '🌊', description: 'Momentos de tensión que logré surfear', color: '#d97706' },
      { value: 2, label: 'Bajo presión', emoji: '🕰️', description: 'El agobio me ha acompañado seguido', color: '#ea580c' },
      { value: 3, label: 'Al límite', emoji: '🔥', description: 'Me cuesta mucho encontrar la calma', color: '#dc2626' }
    ]
  },
  {
    key: 'anxiety',
    icon: '🌊',
    title: 'Tu mente y la calma',
    subtitle: 'A veces la mente no puede parar, y eso agota. ¿Has experimentado pensamientos acelerados, inquietud o sensación de estar "alerta" sin razón aparente?',
    compassionNote: 'La ansiedad es mucho más común de lo que se habla. No estás solo(a) en esto.',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    glow: 'rgba(99, 102, 241, 0.3)',
    bgAccent: 'rgba(99, 102, 241, 0.05)',
    borderAccent: 'rgba(99, 102, 241, 0.2)',
    options: [
      { value: 0, label: 'Mente despejada', emoji: '☁️', description: 'Pensamientos claros y tranquilos', color: '#059669' },
      { value: 1, label: 'Rumia ocasional', emoji: '🤔', description: 'Algunas dudas o alertas esporádicas', color: '#d97706' },
      { value: 2, label: 'Inquietud constante', emoji: '🌪️', description: 'Me cuesta apagar el ruido mental', color: '#ea580c' },
      { value: 3, label: 'Alerta máxima', emoji: '⚡', description: 'Sensación de peligro o miedo frecuente', color: '#dc2626' }
    ]
  },
  {
    key: 'mood',
    icon: '☀️',
    title: 'Tu mundo emocional',
    subtitle: 'Tus emociones son válidas, todas ellas. ¿Cómo ha estado tu estado de ánimo en general? ¿Has sentido tristeza, vacío o poca motivación últimamente?',
    compassionNote: 'No tienes que estar bien todo el tiempo. Lo que sientes importa y merece espacio.',
    gradient: 'linear-gradient(135deg, #f59e0b, #ea580c)',
    glow: 'rgba(245, 158, 11, 0.3)',
    bgAccent: 'rgba(245, 158, 11, 0.05)',
    borderAccent: 'rgba(245, 158, 11, 0.2)',
    options: [
      { value: 0, label: 'Luminoso', emoji: '🌻', description: 'Me siento con ilusión y motivación', color: '#059669' },
      { value: 1, label: 'Cambiante', emoji: '⛅', description: 'Días buenos y días más grises', color: '#d97706' },
      { value: 2, label: 'Apagado(a)', emoji: '🍂', description: 'Me cuesta encontrar alegría', color: '#ea580c' },
      { value: 3, label: 'En la sombra', emoji: '🌧️', description: 'Siento mucha tristeza o desconexión', color: '#dc2626' }
    ]
  },
  {
    key: 'sleep',
    icon: '🌙',
    title: 'Tu descanso y recuperación',
    subtitle: 'Dormir bien es una necesidad básica, no un lujo. ¿Has logrado descansar de manera reparadora? ¿O el sueño ha sido difícil, interrumpido o poco restaurador?',
    compassionNote: 'Cuando el sueño falla, todo se vuelve más pesado. Lo entendemos.',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    glow: 'rgba(59, 130, 246, 0.3)',
    bgAccent: 'rgba(59, 130, 246, 0.05)',
    borderAccent: 'rgba(59, 130, 246, 0.2)',
    options: [
      { value: 0, label: 'Reparador', emoji: '🛌', description: 'Duermo bien y despierto con energía', color: '#059669' },
      { value: 1, label: 'Intermitente', emoji: '🥱', description: 'Me despierto a veces, pero descanso algo', color: '#d97706' },
      { value: 2, label: 'Difícil', emoji: '🕰️', description: 'Me cuesta dormir o me despierto mucho', color: '#ea580c' },
      { value: 3, label: 'Agotador', emoji: '🦉', description: 'No logro descansar casi nada', color: '#dc2626' }
    ]
  },
  {
    key: 'energy',
    icon: '✨',
    title: 'Tu vitalidad y fuerza',
    subtitle: 'La energía refleja cómo estamos por dentro. ¿Has tenido la fuerza para hacer lo que quieres hacer, o sientes que la fatiga o el agotamiento te limitan?',
    compassionNote: 'Sentirse sin energía no es flojera. Es una señal que tu cuerpo y mente te están enviando.',
    gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)',
    glow: 'rgba(20, 184, 166, 0.3)',
    bgAccent: 'rgba(20, 184, 166, 0.05)',
    borderAccent: 'rgba(20, 184, 166, 0.2)',
    options: [
      { value: 0, label: 'Con fuerza', emoji: '🔋', description: 'Tengo energía para mi día a día', color: '#059669' },
      { value: 1, label: 'A medio tanque', emoji: '🪫', description: 'Me canso, pero logro hacer mis cosas', color: '#d97706' },
      { value: 2, label: 'Pesadez', emoji: '🐢', description: 'Todo me cuesta el doble de esfuerzo', color: '#ea580c' },
      { value: 3, label: 'Agotamiento', emoji: '🫠', description: 'Siento que no tengo energía para nada', color: '#dc2626' }
    ]
  },
  {
    key: 'focus',
    icon: '🔮',
    title: 'Tu claridad mental',
    subtitle: 'La mente dispersa no es una falla tuya, a veces es una carga emocional que pide atención. ¿Has podido concentrarte en tus actividades, o sientes que la mente "se va" con facilidad?',
    compassionNote: 'La dificultad para concentrarse muchas veces esconde algo más profundo que merece explorarse.',
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
    glow: 'rgba(236, 72, 153, 0.3)',
    bgAccent: 'rgba(236, 72, 153, 0.05)',
    borderAccent: 'rgba(236, 72, 153, 0.2)',
    options: [
      { value: 0, label: 'Enfoque claro', emoji: '🎯', description: 'Me concentro con facilidad', color: '#059669' },
      { value: 1, label: 'Leve dispersión', emoji: '🦋', description: 'A veces me distraigo, pero vuelvo', color: '#d97706' },
      { value: 2, label: 'Neblina mental', emoji: '🌫️', description: 'Me cuesta retener información o enfocarme', color: '#ea580c' },
      { value: 3, label: 'Desconexión', emoji: '🧩', description: 'Siento que mi mente está en otro lado', color: '#dc2626' }
    ]
  },
  {
    key: 'goal',
    icon: '💫',
    title: 'Lo que te trajo aquí',
    subtitle: 'No hay respuesta incorrecta. Cuéntanos, con tus propias palabras, qué te motivó a buscar este espacio. ¿Qué quieres sanar, descubrir o transformar en tu vida?',
    compassionNote: 'El primer paso siempre es el más valioso. Gracias por estar aquí.',
    gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    glow: 'rgba(14, 165, 233, 0.3)',
    bgAccent: 'rgba(14, 165, 233, 0.05)',
    borderAccent: 'rgba(14, 165, 233, 0.2)',
    options: []
  },
] as const;

// ─── Welcome Splash Screen ────────────────────────────────────────────────────

const WelcomeSplash = ({ name, onStart }: { name: string; onStart: () => void }) => {
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    const pInterval = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(pInterval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fcfcfc',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', padding: '2rem',
    }}>
      {/* Animated background orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-15%', left: '-10%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
          animation: 'splashOrb1 10s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-15%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          animation: 'splashOrb2 13s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '50%', right: '20%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)',
          animation: 'splashOrb3 18s ease-in-out infinite',
        }} />
        {/* Floating sparkles */}
        {['8%', '20%', '75%', '85%', '40%', '60%'].map((left, i) => (
          <div key={i} style={{
            position: 'absolute',
            left, top: `${15 + i * 14}%`,
            width: i % 2 === 0 ? '6px' : '4px',
            height: i % 2 === 0 ? '6px' : '4px',
            borderRadius: '50%',
            background: ['#60d8ff', '#34d399', '#a78bfa', '#fbbf24', '#f472b6', '#60d8ff'][i],
            boxShadow: `0 0 12px ${['#60d8ff', '#34d399', '#a78bfa', '#fbbf24', '#f472b6', '#60d8ff'][i]}`,
            animation: `sparkle${(i % 3) + 1} ${6 + i}s ease-in-out infinite ${i * 0.5}s`,
          }} />
        ))}
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '70px 70px',
        }} />
      </div>

      {/* Main card */}
      <div style={{
        width: '100%', maxWidth: '560px',
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.95)',
        transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative', zIndex: 1,
      }}>

        {/* Glowing orb icon */}
        <div style={{
          position: 'relative', display: 'inline-block', marginBottom: '2rem',
        }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '30px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto',
            boxShadow: pulse
              ? '0 0 60px rgba(16, 185, 129, 0.4), 0 0 120px rgba(16, 185, 129, 0.15)'
              : '0 0 40px rgba(16, 185, 129, 0.25)',
            transition: 'box-shadow 2s ease',
            animation: 'iconFloat 4s ease-in-out infinite',
          }}>
            <span style={{ fontSize: '2.5rem' }}>✨</span>
          </div>
          {/* Orbit ring */}
          <div style={{
            position: 'absolute', inset: '-16px',
            borderRadius: '50%',
            border: '1.5px solid rgba(16, 185, 129, 0.25)',
            animation: 'orbit 8s linear infinite',
          }}>
            <div style={{
              position: 'absolute', top: '0', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '10px', height: '10px', borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 10px #10b981',
            }} />
          </div>
        </div>

        {/* Greeting */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '50px',
          padding: '0.35rem 1rem',
          marginBottom: '1.5rem',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.3s',
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', letterSpacing: '0.1em' }}>
            BIENVENIDO(A) A TU ESPACIO
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 900,
          color: '#111827',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          margin: '0 0 1rem',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease 0.2s',
        }}>
          Hola, <span style={{
            background: 'linear-gradient(135deg, #10b981, #0ea5e9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>{name}</span> 🌱
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: '#4b5563',
          lineHeight: 1.7,
          maxWidth: '440px',
          margin: '0 auto 0.75rem',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.4s',
        }}>
          Antes de empezar, queremos conocerte mejor.
        </p>
        <p style={{
          fontSize: '0.95rem',
          color: '#6b7280',
          lineHeight: 1.7,
          maxWidth: '420px',
          margin: '0 auto 2.5rem',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.5s',
        }}>
          En menos de 2 minutos haremos un diagnóstico personalizado de tu bienestar para acompañarte de la mejor manera.
        </p>

        {/* Steps preview pills */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem',
          marginBottom: '2.5rem',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.6s',
        }}>
          {['🔥 Estrés', '😰 Ansiedad', '🌤️ Ánimo', '🌙 Sueño', '⚡ Energía', '🎯 Foco', '🌟 Propósito'].map((label, i) => (
            <span key={i} style={{
              padding: '0.35rem 0.85rem',
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: '50px',
              fontSize: '0.78rem',
              color: '#4b5563',
              fontWeight: 600,
            }}>
              {label}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <button
          id="intake-start-btn"
          onClick={onStart}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
            padding: '1.1rem 2.5rem',
            borderRadius: '18px', border: 'none',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff', fontWeight: 800, fontSize: '1.05rem',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4), 0 1px 0 rgba(255,255,255,0.15) inset',
            letterSpacing: '0.02em',
            transition: 'all 0.3s ease',
            opacity: visible ? 1 : 0,
            transitionDelay: '0.7s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px) scale(1.02)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.5), 0 1px 0 rgba(255,255,255,0.15) inset';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0) scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4), 0 1px 0 rgba(255,255,255,0.15) inset';
          }}
        >
          Comenzar mi diagnóstico
          <ArrowRight size={18} />
        </button>

        <p style={{
          marginTop: '1.25rem',
          fontSize: '0.78rem',
          color: '#9ca3af',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.8s',
        }}>
          🔒 Tus respuestas son completamente confidenciales
        </p>
      </div>

      <style>{`
        @keyframes splashOrb1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(60px,30px) scale(1.1); }
          66% { transform: translate(-30px,60px) scale(0.9); }
        }
        @keyframes splashOrb2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-50px,-40px) scale(1.1); }
        }
        @keyframes splashOrb3 {
          0%,100% { transform: translate(-50%,-50%) scale(1); }
          50% { transform: translate(-50%,-50%) scale(1.4); }
        }
        @keyframes sparkle1 {
          0%,100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-30px) scale(1.2); opacity: 1; }
        }
        @keyframes sparkle2 {
          0%,100% { transform: translateY(0) translateX(0); opacity: 0.5; }
          50% { transform: translateY(25px) translateX(-15px); opacity: 0.9; }
        }
        @keyframes sparkle3 {
          0%,100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
        }
        @keyframes iconFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// ─── Celebration Screen ────────────────────────────────────────────────────────

const CelebrationScreen = ({ name }: { name: string }) => {
  const [visible, setVisible] = useState(false);
  const [confettiItems] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: ['#60d8ff', '#34d399', '#a78bfa', '#fbbf24', '#f472b6', '#ff6b6b'][i % 6],
      size: 6 + Math.random() * 8,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
    }))
  );

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fcfcfc',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', padding: '2rem',
    }}>
      {/* Confetti */}
      {confettiItems.map(item => (
        <div key={item.id} style={{
          position: 'absolute',
          left: item.left, top: '-20px',
          width: item.size, height: item.size,
          borderRadius: item.id % 3 === 0 ? '50%' : '2px',
          background: item.color,
          boxShadow: `0 0 8px ${item.color}`,
          animation: `confettiFall ${item.duration}s ease-in ${item.delay}s infinite`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Background orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '800px', height: '800px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
          transform: 'translate(-50%,-50%)',
          animation: 'celebPulse 4s ease-in-out infinite',
        }} />
      </div>

      <div style={{
        width: '100%', maxWidth: '520px',
        textAlign: 'center',
        position: 'relative', zIndex: 1,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
        transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>

        {/* Big emoji */}
        <div style={{
          fontSize: '5rem', marginBottom: '1.5rem',
          animation: 'celebBounce 1s ease 0.5s both, iconFloat 4s ease-in-out 1.5s infinite',
          display: 'block',
        }}>
          🎉
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(52,211,153,0.12)',
          border: '1px solid rgba(52,211,153,0.3)',
          borderRadius: '50px',
          padding: '0.4rem 1.1rem',
          marginBottom: '1.5rem',
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', letterSpacing: '0.1em' }}>
            ✓ DIAGNÓSTICO COMPLETADO
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)',
          fontWeight: 900,
          color: '#111827',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          margin: '0 0 1rem',
        }}>
          ¡Tu camino de <span style={{
            background: 'linear-gradient(135deg, #10b981, #0ea5e9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>sanación</span> comienza ahora!
        </h1>

        <p style={{
          fontSize: '1rem',
          color: '#4b5563',
          lineHeight: 1.7,
          maxWidth: '400px',
          margin: '0 auto 2.5rem',
        }}>
          Hemos recibido tu evaluación, {name}. Estamos preparando tu perfil de bienestar personalizado. 🌱
        </p>

        <div style={{
          display: 'flex', flexDirection: 'column', gap: '0.75rem',
          padding: '1.5rem',
          background: '#ffffff',
          border: '1px solid #f3f4f6',
          borderRadius: '20px',
          marginBottom: '2rem',
          textAlign: 'left',
          boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
        }}>
          {[
            { emoji: '🧠', text: 'Análisis de tu bienestar completado' },
            { emoji: '💌', text: 'Tu terapeuta revisará tu perfil pronto' },
            { emoji: '🗓️', text: 'Puedes agendar tu primera sesión' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '0.85rem',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-20px)',
              transition: `all 0.6s ease ${0.5 + i * 0.15}s`,
            }}>
              <span style={{ fontSize: '1.4rem' }}>{item.emoji}</span>
              <span style={{ color: '#374151', fontSize: '0.9rem', fontWeight: 500 }}>{item.text}</span>
            </div>
          ))}
        </div>

        <p style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
          Cargando tu portal personalizado...
        </p>

        <div style={{
          height: '4px', background: '#f3f4f6',
          borderRadius: '100px', overflow: 'hidden',
          maxWidth: '200px', margin: '0 auto',
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #10b981, #0ea5e9)',
            borderRadius: '100px',
            animation: 'loadBar 2.5s ease forwards',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes celebPulse {
          0%,100% { transform: translate(-50%,-50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%,-50%) scale(1.2); opacity: 1; }
        }
        @keyframes celebBounce {
          0% { transform: scale(0) rotate(-20deg); opacity: 0; }
          60% { transform: scale(1.2) rotate(5deg); }
          80% { transform: scale(0.95) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes loadBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes iconFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
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

// ─── Profile Page ─────────────────────────────────────────────────────────────

const ProfilePage = () => {
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem(getTokenKey()) : null;
  const isAuthed = Boolean(token);
  const [me, setMe] = useState<PortalMe | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [activeTab, setActiveTab] = useState<'wellbeing' | 'courses' | 'settings'>('wellbeing');
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
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.ok && me) {
        setMe({ ...me, profilePictureUrl: data.data.profilePictureUrl });
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
    setLoadingMe(true);
    const res = await api.get<PortalMe>('/api/portal/me/');
    if (!res.ok) {
      localStorage.removeItem(getTokenKey());
      setMe(null);
      setLoadingMe(false);
      return;
    }
    setMe(res.data);
    setPrefs({
      title: res.data.portalWelcomeTitle || '',
      message: res.data.portalWelcomeMessage || '',
      color: res.data.portalAccentColor || '',
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
    setLoadingMe(false);
  };

  useEffect(() => {
    if (!isAuthed) { setLoadingMe(false); setMe(null); return; }
    void loadMe();
    
    // Load daily checkin status
    api.get<{hasCheckedIn: boolean, energyLevel: string|null}>('/api/portal/daily-checkin/').then(res => {
      if (res.ok) setDailyCheckin(res.data);
    });
  }, [isAuthed]);

  const accent = me?.portalAccentColor || '#22c55e';
  const hasHipnosis = localStorage.getItem(getPurchaseKey('hipnosis-interdimencional')) === '1';

  if (!isAuthed) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (loadingMe) return <div className="min-h-screen bg-white" />;
  if (me && me.intakeCompleted === false) {
    return (
      <IntakeScreen
        firstName={me.firstName}
        onCompleted={() => void loadMe()}
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
          localStorage.setItem('conexionluz:feed_posts', JSON.stringify(updated));
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
      <div className="min-h-screen bg-[#fcfcfc]">
        {/* Header */}
        <header
          className="relative py-10 md:py-20 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${accent}15 0%, rgba(255,255,255,1) 50%, ${accent}08 100%)` }}
        >
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                <div className="relative group">
                  <label className={cn("h-24 w-24 sm:h-32 sm:w-32 rounded-2xl sm:rounded-[2.5rem] bg-white shadow-2xl flex items-center justify-center text-3xl sm:text-4xl font-black text-gray-800 ring-4 ring-white border border-gray-100 transform group-hover:rotate-6 transition-transform duration-500 cursor-pointer overflow-hidden relative", uploadingPicture && "opacity-50")}>
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
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-3 sm:mb-4">
                    {me?.portalWelcomeTitle || `Hola, ${me?.firstName}`}
                  </h1>
                  <p className="text-base md:text-lg text-gray-500 max-w-2xl leading-relaxed mb-6 sm:mb-8">
                    {me?.portalWelcomeMessage || 'Bienvenido(a) a tu espacio personal de sanación y crecimiento.'}
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <button
                      onClick={logout}
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white border border-gray-100 text-gray-600 text-sm font-bold shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
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
        <main className="container mx-auto px-4 md:px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            {/* Tabs */}
            <div className="flex w-full sm:w-fit items-center gap-1 p-1 bg-gray-100/50 rounded-xl sm:rounded-2xl mb-8 sm:mb-12">
              {[
                { id: 'wellbeing', label: 'Mi Bienestar', icon: Activity },
                { id: 'courses', label: 'Mis Cursos', icon: BookOpen },
                { id: 'settings', label: 'Ajustes', icon: Settings },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={cn(
                    'flex flex-1 sm:flex-initial items-center justify-center gap-1.5 px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300',
                    activeTab === t.id
                      ? 'bg-white shadow-md text-gray-900 scale-[1.02]'
                      : 'text-gray-500 hover:text-gray-800'
                  )}
                >
                  <t.icon className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', activeTab === t.id ? 'text-primary' : 'text-gray-400')} />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab panels */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'wellbeing' && (
                <div className="space-y-8">
                  {!dailyCheckin.hasCheckedIn && (
                    <DailyCheckinCard onComplete={(level) => setDailyCheckin({ hasCheckedIn: true, energyLevel: level })} />
                  )}
                  {me?.intakeSummary ? (
                    <div className="group relative rounded-2xl sm:rounded-[2.5rem] bg-white border border-gray-100 p-6 sm:p-8 md:p-12 shadow-sm hover:shadow-xl transition-all duration-500">
                      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary/5 flex items-center justify-center">
                        <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 sm:mb-6">Tu resumen de bienestar</h3>
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 text-base sm:text-lg leading-relaxed whitespace-pre-line italic">
                          "{me.intakeSummary}"
                        </p>
                      </div>
                      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 pt-8 sm:pt-10 border-t border-gray-50">
                        <Link to="/agenda" className="w-full sm:w-auto text-center px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl bg-gray-900 text-white font-bold hover:scale-105 transition-all text-sm sm:text-base">
                          Agendar sesión de apoyo
                        </Link>
                        <Link to="/mi-calendario" className="w-full sm:w-auto text-center px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all text-sm sm:text-base">
                          Ver mi calendario
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 sm:py-20 bg-white rounded-2xl sm:rounded-[2.5rem] border-2 border-dashed border-gray-100 px-4">
                      <p className="text-gray-400 font-medium text-sm sm:text-base">Completa tu evaluación para ver tu resumen aquí.</p>
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
                <div className="max-w-3xl space-y-8">
                  {/* Información Personal */}
                  <div className="rounded-2xl sm:rounded-[2.5rem] bg-white border border-gray-100 p-6 sm:p-8 md:p-12 shadow-sm">
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                      <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      Información Personal
                    </h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Nombre</label>
                          <input
                            value={profileForm.firstName}
                            onChange={e => setProfileForm(p => ({ ...p, firstName: e.target.value }))}
                            className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Apellidos</label>
                          <input
                            value={profileForm.lastName}
                            onChange={e => setProfileForm(p => ({ ...p, lastName: e.target.value }))}
                            className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Correo Electrónico</label>
                          <input
                            value={profileForm.email}
                            onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                            type="email"
                            className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Teléfono</label>
                          <input
                            value={profileForm.phone}
                            onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                            className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Fecha de Nacimiento</label>
                          <input
                            type="date"
                            value={profileForm.birthDate}
                            onChange={e => setProfileForm(p => ({ ...p, birthDate: e.target.value }))}
                            className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Género</label>
                          <select
                            value={profileForm.gender}
                            onChange={e => setProfileForm(p => ({ ...p, gender: e.target.value }))}
                            className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                          >
                            <option value="">Seleccionar...</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Otro">Otro</option>
                            <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Tipo de Usuario</label>
                          <div className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-gray-800 text-sm">
                            {me?.userType ? (me.userType.charAt(0).toUpperCase() + me.userType.slice(1)) : 'Miembro'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Ciudad</label>
                          <input
                            value={profileForm.city}
                            onChange={e => setProfileForm(p => ({ ...p, city: e.target.value }))}
                            className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Ocupación</label>
                          <input
                            value={profileForm.occupation}
                            onChange={e => setProfileForm(p => ({ ...p, occupation: e.target.value }))}
                            className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Dirección Completa</label>
                          <input
                            value={profileForm.address}
                            onChange={e => setProfileForm(p => ({ ...p, address: e.target.value }))}
                            className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Nombre Contacto de Emergencia</label>
                          <input
                            value={profileForm.emergencyContactName}
                            onChange={e => setProfileForm(p => ({ ...p, emergencyContactName: e.target.value }))}
                            className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Teléfono de Emergencia</label>
                          <input
                            value={profileForm.emergencyContactPhone}
                            onChange={e => setProfileForm(p => ({ ...p, emergencyContactPhone: e.target.value }))}
                            className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => void saveProfile()}
                        disabled={savingProfile}
                        className="w-full bg-gray-900 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4 text-sm sm:text-base"
                      >
                        {savingProfile ? 'Guardando...' : 'Guardar Información Personal'}
                      </button>
                    </div>
                  </div>


                  <div className="rounded-2xl sm:rounded-[2.5rem] bg-gray-50 border border-gray-100 p-6 sm:p-8 md:p-12">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Información de Cuenta</h3>
                    <p className="text-gray-500 text-sm mb-6">Gestiona la seguridad y accesos de tu cuenta.</p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl sm:rounded-2xl border border-gray-50 overflow-x-auto">
                        <div className="flex items-center gap-3 whitespace-nowrap">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                          <span className="text-xs sm:text-sm font-bold text-gray-700">Email verificado: {me?.email}</span>
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
