import React, { useState, useEffect, useRef } from 'react';
import PublicLayout from '../components/PublicLayout';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Crown, Eye, EyeOff, Sparkles, Shield, Heart, Users, Star, Zap } from 'lucide-react';
import { api } from '../api/client';

const getTokenKey = () => 'conexionluz:token';

type LoginResponse = {
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
  { icon: Heart, label: 'Bienestar personalizado', sub: 'Tu camino de salud, a tu ritmo', color: '#f472b6' },
  { icon: Shield, label: 'Privacidad garantizada', sub: 'Tus datos siempre seguros', color: '#34d399' },
  { icon: Users, label: 'Comunidad de apoyo', sub: 'Conecta con quienes te comprenden', color: '#60a5fa' },
  { icon: Sparkles, label: 'Experiencia única', sub: 'Atención diseñada solo para ti', color: '#fbbf24' },
];

// Floating particle component
const Particle = ({ style }: { style: React.CSSProperties }) => (
  <div style={{
    position: 'absolute',
    borderRadius: '50%',
    pointerEvents: 'none',
    ...style,
  }} />
);

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = (location.state as any)?.from as string | undefined;
  const fromMembresia = fromPath === '/membresia';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const [googleEnabled, setGoogleEnabled] = useState(false);

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
        });
        const btnContainer = document.getElementById('google-btn-container');
        if (btnContainer) {
          g.accounts.id.renderButton(btnContainer, {
            theme: 'outline',
            size: 'large',
            width: btnContainer.clientWidth || 360,
            text: 'signin_with',
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
      if ((window as any).google) {
        setTimeout(initializeGoogleSignIn, 100);
      } else {
        const oldOnload = script.onload;
        script.onload = (e) => {
          if (oldOnload) (oldOnload as any)(e);
          setTimeout(initializeGoogleSignIn, 100);
        };
      }
    }
  }, [googleEnabled, googleClientId]);

  const handleGoogleCallback = async (response: any) => {
    setError(null);
    setLoading(true);
    const res = await api.post<LoginResponse>('/api/auth/google/', { credential: response.credential });
    if (res.ok === false) {
      setError(res.error);
      setLoading(false);
      return;
    }
    localStorage.setItem(getTokenKey(), res.data.token);
    setLoading(false);
    navigate(fromPath || '/mi-perfil', { replace: true });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setError(null);
    setLoading(true);
    const res = await api.post<LoginResponse>('/api/auth/login/', { username, password });
    if (res.ok === false) {
      setError(res.error);
      setLoading(false);
      return;
    }
    localStorage.setItem(getTokenKey(), res.data.token);
    setLoading(false);
    navigate(fromPath || '/mi-perfil', { replace: true });
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
        }} className="login-left-panel">

          {/* Brand */}
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            marginBottom: '3rem',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '50px', padding: '0.6rem 1.25rem',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              marginBottom: '2.5rem',
            }}>
              <Sparkles size={16} color="#059669" />
              <span style={{ color: '#059669', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                CONEXIÓNLUZ
              </span>
            </div>

            <h2 style={{
              fontSize: '3.2rem', fontWeight: 900, lineHeight: 1.1,
              color: '#111827', margin: 0,
              letterSpacing: '-0.02em',
            }}>
              Tu espacio de<br />
              <span style={{
                background: 'linear-gradient(135deg, #10b981, #0ea5e9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>bienestar integral</span>
            </h2>
            <p style={{
              color: '#4b5563', fontSize: '1rem',
              lineHeight: 1.7, maxWidth: '340px', marginTop: '1rem', marginBottom: 0,
            }}>
              Accede a tu portal personalizado y acompaña tu proceso de crecimiento.
            </p>
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '3rem' }}>
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
                  transitionDelay: `${0.6 + i * 0.1}s`,
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


        </div>

        {/* ── Right panel – form ── */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem 1.5rem',
          position: 'relative', zIndex: 1,
        }}>
          {/* Form card */}
          <div style={{
            width: '100%', maxWidth: '460px',
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
            }} className="login-mobile-brand">
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

            {/* Membership notice */}
            {fromMembresia && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                background: 'rgba(251,191,36,0.1)',
                border: '1px solid rgba(251,191,36,0.25)',
                borderRadius: '16px', padding: '1rem 1.25rem',
                marginBottom: '1.75rem',
              }}>
                <Crown size={18} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ fontWeight: 700, color: '#fbbf24', fontSize: '0.875rem', margin: 0 }}>
                    Inicia sesión para suscribirte
                  </p>
                  <p style={{ color: 'rgba(251,191,36,0.7)', fontSize: '0.78rem', margin: '3px 0 0' }}>
                    Volverás directamente al proceso de pago de tu plan.
                  </p>
                </div>
              </div>
            )}

            {/* Heading */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '50px',
                padding: '0.35rem 0.9rem', marginBottom: '1rem',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}>
                <Lock size={12} color="#059669" />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', letterSpacing: '0.1em' }}>
                  ACCESO SEGURO
                </span>
              </div>
              <h1 style={{
                fontSize: '2rem', fontWeight: 900,
                color: '#111827', lineHeight: 1.2, margin: 0,
                letterSpacing: '-0.02em',
              }}>
                Bienvenido de vuelta ✨
              </h1>
              <p style={{ color: '#4b5563', marginTop: '0.5rem', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Tu espacio te está esperando.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '14px', padding: '0.85rem 1.1rem',
                color: '#fc8585', fontSize: '0.875rem',
                marginBottom: '1.25rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                animation: 'shakeX 0.4s ease',
              }}>
                <span style={{ fontSize: '1.1rem' }}>⚠</span>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Username */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Usuario
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    type="text"
                    autoComplete="username"
                    placeholder="tu.usuario"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '0.9rem 1.2rem',
                      borderRadius: '14px',
                      border: focusedField === 'username'
                        ? '1.5px solid #10b981'
                        : '1.5px solid #d1d5db',
                      background: focusedField === 'username'
                        ? '#ffffff'
                        : '#f9fafb',
                      fontSize: '0.95rem', color: '#111827',
                      outline: 'none',
                      transition: 'all 0.25s ease',
                      boxShadow: focusedField === 'username' ? '0 0 0 3px rgba(16, 185, 129, 0.15)' : 'none',
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '0.9rem 3.2rem 0.9rem 1.2rem',
                      borderRadius: '14px',
                      border: focusedField === 'password'
                        ? '1.5px solid #10b981'
                        : '1.5px solid #d1d5db',
                      background: focusedField === 'password'
                        ? '#ffffff'
                        : '#f9fafb',
                      fontSize: '0.95rem', color: '#111827',
                      outline: 'none',
                      transition: 'all 0.25s ease',
                      boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(16, 185, 129, 0.15)' : 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{
                      position: 'absolute', right: '1rem', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#9ca3af', padding: '4px',
                      display: 'flex', alignItems: 'center',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#4b5563'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; }}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '1rem',
                  borderRadius: '14px', border: 'none',
                  background: loading
                    ? '#e5e7eb'
                    : 'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
                  color: loading ? '#9ca3af' : '#fff', fontWeight: 800, fontSize: '0.95rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: loading ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.4)',
                  letterSpacing: '0.04em',
                  marginTop: '0.5rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.5)';
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = loading ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.4)';
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem' }}>
                    <span style={{
                      width: '16px', height: '16px', border: '2.5px solid rgba(255,255,255,0.25)',
                      borderTopColor: '#fff', borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite', display: 'inline-block',
                    }} />
                    Entrando a tu mundo...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Zap size={16} />
                    Iniciar sesión
                  </span>
                )}
              </button>
            </form>

            {/* Divider + Google */}
            {googleEnabled && googleClientId && (
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                  <span style={{ color: '#9ca3af', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                    O CONTINUAR CON
                  </span>
                  <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', minHeight: '44px' }}>
                  <div id="google-btn-container" style={{ width: '100%' }} />
                </div>
              </div>
            )}

            {/* Register link */}
            <div style={{
              marginTop: '1.75rem', textAlign: 'center',
              padding: '1rem', borderRadius: '14px',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
            }}>
              <span style={{ color: '#6b7280', fontSize: '0.88rem' }}>¿No tienes cuenta?{' '}</span>
              <Link
                to="/registro"
                style={{
                  color: '#10b981', fontWeight: 700,
                  textDecoration: 'none', fontSize: '0.88rem',
                  borderBottom: '1.5px solid rgba(16, 185, 129, 0.4)',
                  paddingBottom: '1px', transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = '#059669';
                  (e.currentTarget as HTMLElement).style.borderColor = '#059669';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = '#10b981';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(16, 185, 129, 0.4)';
                }}
              >
                Crear cuenta gratuita →
              </Link>
            </div>

            {/* Privacy note */}
            <p style={{
              marginTop: '1rem', textAlign: 'center',
              color: '#9ca3af', fontSize: '0.73rem', lineHeight: 1.5,
            }}>
              Al ingresar, aceptas nuestra{' '}
              <a href="#" style={{ color: '#4b5563', textDecoration: 'underline' }}>política de privacidad</a>
              {' '}y{' '}
              <a href="#" style={{ color: '#4b5563', textDecoration: 'underline' }}>términos de uso</a>.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes orb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(80px, 40px) scale(1.1); }
          66% { transform: translate(-40px, 80px) scale(0.9); }
        }
        @keyframes orb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-60px, -30px) scale(1.1); }
          66% { transform: translate(50px, -60px) scale(0.95); }
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
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px);          }
        }
        input::placeholder {
          color: #9ca3af !important;
        }
        @media (min-width: 900px) {
          .login-left-panel {
            display: flex !important;
          }
          .login-mobile-brand {
            display: none !important;
          }
        }
      `}</style>
    </PublicLayout>
  );
};

export default LoginPage;
