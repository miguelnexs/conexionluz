import React, { useState, useEffect } from 'react';
import PublicLayout from '../components/PublicLayout';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, Sparkles, Shield, Heart, Users, Star, Zap, Gift, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';
import OnboardingWelcomeWizard from '../components/awe/OnboardingWelcomeWizard';

type RegisterResponse = {
  token: string;
  patient: {
    id: number;
    firstName: string;
    lastName: string;
    portalWelcomeTitle?: string;
    portalWelcomeMessage?: string;
    portalAccentColor?: string;
  };
};

const FEATURES = [
  { icon: Star, label: 'Portal personal exclusivo', sub: 'Gestiona tu progreso y consultas', color: '#10b981' },
  { icon: Zap, label: 'Contenido y ejercicios guiados', sub: 'Recursos diseñados para tu autorregulación', color: '#60a5fa' },
  { icon: Heart, label: 'Comunidad de apoyo y cuidado', sub: 'Un espacio seguro y confidencial', color: '#f472b6' },
  { icon: Sparkles, label: 'Acompañamiento a tu ritmo', sub: 'Herramientas de psicología positiva', color: '#fbbf24' },
];

const getStrength = (pwd: string) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};

const STRENGTH_LABELS = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
const STRENGTH_COLORS = ['#e5e7eb', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

const Particle = ({ style }: { style: React.CSSProperties }) => (
  <div style={{
    position: 'absolute',
    borderRadius: '50%',
    pointerEvents: 'none',
    ...style,
  }} />
);

const RegisterPage = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [registeredPatient, setRegisteredPatient] = useState<{ firstName: string } | null>(null);

  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const [googleEnabled, setGoogleEnabled] = useState(false);

  const strength = getStrength(password);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      const res = await api.get<{ googleClientId?: string; googleEnabled?: boolean }>('/api/public/settings/');
      if (res.ok && res.data?.googleEnabled && res.data?.googleClientId) {
        setGoogleClientId(res.data.googleClientId);
        setGoogleEnabled(true);
      }
    };
    void loadSettings();
  }, []);

  useEffect(() => {
    if (!googleEnabled || !googleClientId) return;

    const initializeGoogleSignIn = () => {
      const g = (window as any).google;
      if (g) {
        g.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCallback,
          ux_mode: 'popup',
          auto_select: false,
          itp_support: true,
        });
        const btnContainer = document.getElementById('google-register-btn');
        if (btnContainer) {
          g.accounts.id.renderButton(btnContainer, {
            theme: 'outline',
            size: 'large',
            width: btnContainer.clientWidth || 360,
            text: 'signup_with',
            shape: 'pill',
          });
        }
      }
    };

    const scriptId = 'google-jssdk';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => { setTimeout(initializeGoogleSignIn, 100); };
      document.body.appendChild(script);
    } else {
      if ((window as any).google) setTimeout(initializeGoogleSignIn, 100);
      else {
        const old = script.onload;
        script.onload = (e) => { if (old) (old as any)(e); setTimeout(initializeGoogleSignIn, 100); };
      }
    }
  }, [googleEnabled, googleClientId]);

  const handleGoogleCallback = async (response: any) => {
    setError(null);
    setLoading(true);
    const res = await api.post<RegisterResponse>('/api/auth/google/', { credential: response.credential });
    if (res.ok === false) { setError(res.error); setLoading(false); return; }
    localStorage.setItem('conexionluz:token', res.data.token);
    setLoading(false);
    setRegisteredPatient({ firstName: res.data.patient?.firstName || firstName || 'Bienvenido/a' });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !username || !password) return;
    setError(null);
    setLoading(true);
    const res = await api.post<RegisterResponse>('/api/auth/register/', { firstName, lastName, username, email, password });
    if (res.ok === false) { setError(res.error); setLoading(false); return; }
    localStorage.setItem('conexionluz:token', res.data.token);
    setLoading(false);
    setRegisteredPatient({ firstName: res.data.patient?.firstName || firstName || 'Bienvenido/a' });
  };

  if (registeredPatient) {
    return (
      <PublicLayout contentClassName="p-0">
        <OnboardingWelcomeWizard
          firstName={registeredPatient.firstName}
          onCompleted={() => {
            navigate('/mi-perfil', { replace: true });
          }}
        />
      </PublicLayout>
    );
  }

  const inputStyle = (fieldName: string): React.CSSProperties => {
    const isFocused = focusedField === fieldName;
    return {
      width: '100%',
      boxSizing: 'border-box',
      padding: '0.85rem 1.1rem',
      borderRadius: '14px',
      border: isFocused ? '1.5px solid #10b981' : '1.5px solid #d1d5db',
      background: isFocused ? '#ffffff' : '#f9fafb',
      fontSize: '0.92rem',
      color: '#111827',
      outline: 'none',
      transition: 'all 0.25s ease',
      boxShadow: isFocused ? '0 0 0 3px rgba(16, 185, 129, 0.15)' : 'none',
    };
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#6b7280',
    display: 'block',
    marginBottom: '0.45rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  };

  return (
    <PublicLayout contentClassName="p-0">
      <div style={{ minHeight: '100vh', display: 'flex', background: '#fcfcfc', overflow: 'hidden', position: 'relative' }}>

        {/* ── Animated Background Canvas ── */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {/* Large ambient orbs */}
          <div style={{
            position: 'absolute', top: '-20%', left: '-10%',
            width: '700px', height: '700px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
            animation: 'orb1 12s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '-20%', right: '-10%',
            width: '600px', height: '600px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
            animation: 'orb2 15s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', top: '40%', left: '30%',
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)',
            animation: 'orb3 20s ease-in-out infinite',
          }} />

          {/* Floating particles */}
          {[
            { w: 6, h: 6, top: '15%', left: '5%', bg: 'rgba(16, 185, 129, 0.4)', anim: 'particle1 8s ease-in-out infinite' },
            { w: 4, h: 4, top: '25%', left: '15%', bg: 'rgba(59, 130, 246, 0.3)', anim: 'particle2 11s ease-in-out infinite' },
            { w: 8, h: 8, top: '60%', left: '8%', bg: 'rgba(139, 92, 246, 0.3)', anim: 'particle3 14s ease-in-out infinite' },
            { w: 5, h: 5, top: '80%', left: '20%', bg: 'rgba(16, 185, 129, 0.3)', anim: 'particle1 9s ease-in-out infinite 2s' },
            { w: 3, h: 3, top: '10%', left: '40%', bg: 'rgba(245, 158, 11, 0.3)', anim: 'particle2 7s ease-in-out infinite 1s' },
          ].map((p, i) => (
            <Particle key={i} style={{
              width: p.w, height: p.h,
              top: p.top, left: p.left,
              background: p.bg,
              animation: p.anim,
              boxShadow: `0 0 ${p.w * 4}px ${p.bg}`,
            }} />
          ))}

          {/* Grid lines subtle */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} />
        </div>

        {/* ── Left panel – brand & features ── */}
        <div style={{
          display: 'none',
          flex: 1,
          position: 'relative',
          zIndex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '3rem 3.5rem',
        }} className="register-left-panel">

          {/* Brand */}
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            marginBottom: '2.5rem',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '50px', padding: '0.6rem 1.25rem',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              marginBottom: '2rem',
            }}>
              <Sparkles size={16} color="#059669" />
              <span style={{ color: '#059669', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                CONEXIÓNLUZ
              </span>
            </div>

            <h2 style={{
              fontSize: '3rem', fontWeight: 900, lineHeight: 1.15,
              color: '#111827', margin: 0,
              letterSpacing: '-0.02em',
            }}>
              Comienza tu<br />
              <span style={{
                background: 'linear-gradient(135deg, #10b981, #0ea5e9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>camino de bienestar</span>
            </h2>
            <p style={{
              color: '#4b5563', fontSize: '1rem',
              lineHeight: 1.7, maxWidth: '360px', marginTop: '1rem', marginBottom: 0,
            }}>
              Crea tu cuenta gratuita y accede a tus ejercicios guiados, tests clínicos y diario emocional personal.
            </p>
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
            {FEATURES.map(({ icon: Icon, label, sub, color }, i) => (
              <div
                key={label}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '0.9rem 1.1rem',
                  borderRadius: '16px',
                  background: hoveredFeature === i ? '#f9fafb' : '#ffffff',
                  border: `1px solid ${hoveredFeature === i ? '#d1d5db' : '#e5e7eb'}`,
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-30px)',
                  transitionDelay: `${0.4 + i * 0.1}s`,
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                  background: `${color}15`,
                  border: `1px solid ${color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: hoveredFeature === i ? `0 0 15px ${color}20` : 'none',
                }}>
                  <Icon size={17} color={color} />
                </div>
                <div>
                  <p style={{ color: '#1f2937', fontWeight: 600, fontSize: '0.88rem', margin: 0 }}>{label}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.76rem', margin: '2px 0 0' }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Already have account nudge */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb', borderRadius: '16px',
            padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
            opacity: mounted ? 1 : 0,
            transition: 'all 0.8s ease 0.8s',
          }}>
            <CheckCircle2 size={18} color="#10b981" />
            <p style={{ color: '#4b5563', fontSize: '0.85rem', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" style={{ color: '#059669', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        {/* ── Right panel – form ── */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem 1.5rem',
          position: 'relative', zIndex: 1, overflowY: 'auto',
        }}>
          {/* Form card */}
          <div style={{
            width: '100%', maxWidth: '480px',
            background: '#ffffff',
            borderRadius: '28px',
            border: '1px solid #e5e7eb',
            padding: '2.5rem',
            boxShadow: '0 25px 80px rgba(0,0,0,0.05)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.97)',
            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          }}>

            {/* Mobile brand pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '2rem',
            }} className="register-mobile-brand">
              <div style={{
                width: '38px', height: '38px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981, #0ea5e9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
              }}>
                <Sparkles size={16} color="#fff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827' }}>
                ConexiónLuz
              </span>
            </div>

            {/* Heading */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '50px',
                padding: '0.35rem 0.9rem', marginBottom: '1rem',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}>
                <UserPlus size={12} color="#059669" />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', letterSpacing: '0.1em' }}>
                  REGISTRO GRATUITO
                </span>
              </div>
              <h1 style={{
                fontSize: '2rem', fontWeight: 900,
                color: '#111827', lineHeight: 1.2, margin: 0,
                letterSpacing: '-0.02em',
              }}>
                Crea tu cuenta gratis ✨
              </h1>
              <p style={{ color: '#4b5563', marginTop: '0.5rem', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Únete para desbloquear todas las herramientas de bienestar.
              </p>
            </div>

            {/* Google register option */}
            {googleEnabled && googleClientId && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', minHeight: '44px' }}>
                  <div id="google-register-btn" style={{ width: '100%' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem', marginBottom: '0.5rem' }}>
                  <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                  <span style={{ color: '#9ca3af', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                    O REGÍSTRATE CON EMAIL
                  </span>
                  <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '14px', padding: '0.85rem 1.1rem',
                color: '#dc2626', fontSize: '0.875rem',
                marginBottom: '1.25rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                <span style={{ fontSize: '1.1rem' }}>⚠</span>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>

              {/* First Name & Last Name row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>
                    Nombre <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="reg-firstname"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onFocus={() => setFocusedField('firstName')}
                    onBlur={() => setFocusedField(null)}
                    type="text"
                    autoComplete="given-name"
                    placeholder="Tu nombre"
                    style={inputStyle('firstName')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Apellido</label>
                  <input
                    id="reg-lastname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onFocus={() => setFocusedField('lastName')}
                    onBlur={() => setFocusedField(null)}
                    type="text"
                    autoComplete="family-name"
                    placeholder="Apellido"
                    style={inputStyle('lastName')}
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label style={labelStyle}>
                  Usuario <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="reg-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  type="text"
                  autoComplete="username"
                  placeholder="crea_tu_usuario"
                  style={inputStyle('username')}
                />
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Correo Electrónico</label>
                <input
                  id="reg-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  type="email"
                  autoComplete="email"
                  placeholder="tu@email.com"
                  style={inputStyle('email')}
                />
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>
                  Contraseña <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Mínimo 8 caracteres"
                    style={{
                      ...inputStyle('password'),
                      paddingRight: '3.2rem',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '0.9rem', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none',
                      color: '#9ca3af', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password strength meter */}
                {password.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      {[1, 2, 3, 4].map(step => (
                        <div
                          key={step}
                          style={{
                            flex: 1, height: '4px', borderRadius: '2px',
                            backgroundColor: step <= strength ? STRENGTH_COLORS[strength] : '#e5e7eb',
                            transition: 'all 0.3s ease',
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: STRENGTH_COLORS[strength], fontWeight: 700 }}>
                      Fortaleza: {STRENGTH_LABELS[strength]}
                    </span>
                  </div>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || !firstName || !username || !password}
                style={{
                  marginTop: '0.75rem',
                  width: '100%',
                  padding: '0.95rem',
                  borderRadius: '14px',
                  border: 'none',
                  background: loading || !firstName || !username || !password
                    ? '#9ca3af'
                    : 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: loading || !firstName || !username || !password ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? 'Creando cuenta...' : 'Crear Mi Cuenta Gratuita'}
              </button>
            </form>

            {/* Footer Nudge */}
            <div style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #f3f4f6',
              textAlign: 'center',
            }}>
              <p style={{ color: '#4b5563', fontSize: '0.88rem', margin: 0, fontWeight: 500 }}>
                ¿Ya tienes una cuenta?{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#059669',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, 40px) scale(1.2); }
        }
        @keyframes orb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, -30px) scale(1.15); }
        }
        @keyframes orb3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.3); }
        }
        @keyframes particle1 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.6; }
          50% { transform: translateY(-40px) translateX(20px); opacity: 1; }
        }
        @keyframes particle2 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          50% { transform: translateY(30px) translateX(-20px); opacity: 0.9; }
        }
        @keyframes particle3 {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
          50% { transform: translateY(-25px) rotate(180deg); opacity: 0.8; }
        }
        input::placeholder {
          color: #9ca3af !important;
        }
        @media (min-width: 900px) {
          .register-left-panel {
            display: flex !important;
          }
          .register-mobile-brand {
            display: none !important;
          }
        }
      `}</style>
    </PublicLayout>
  );
};

export default RegisterPage;
