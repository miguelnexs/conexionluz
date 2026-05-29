import React, { useState, useEffect } from 'react';
import PublicLayout from '../components/PublicLayout';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, Sparkles, CheckCircle2, Star, Zap, Gift } from 'lucide-react';
import { api } from '../api/client';

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

const STEPS = [
  { icon: Star,  title: 'Acceso a tu portal personal', sub: 'Gestiona tus citas, cursos y progreso' },
  { icon: Zap,   title: 'Contenido exclusivo', sub: 'Recursos y talleres diseñados para ti' },
  { icon: Gift,  title: 'Primera consulta sin costo', sub: 'Comienza sin compromiso económico' },
];

// Password strength helper
const getStrength = (pwd: string) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score; // 0-4
};

const STRENGTH_LABELS = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
const STRENGTH_COLORS = ['#e2e8f0', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];

const inputStyle = (focused: boolean): React.CSSProperties => ({
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.8rem 1.1rem',
  borderRadius: '14px',
  border: focused ? '2px solid hsl(193,82%,40%)' : '2px solid #e2e8f0',
  background: focused ? 'hsl(193,82%,98%)' : '#f8fafc',
  fontSize: '0.9rem',
  color: '#0f172a',
  outline: 'none',
  transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
  boxShadow: focused ? '0 0 0 4px hsl(193,82%,92%)' : 'none',
});

const labelStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#374151',
  display: 'block',
  marginBottom: '0.45rem',
  letterSpacing: '0.02em',
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName]   = useState('');
  const [lastName, setLastName]     = useState('');
  const [username, setUsername]     = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [loading, setLoading]       = useState(false);
  const [focused, setFocused]       = useState<string | null>(null);

  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const [googleEnabled, setGoogleEnabled]   = useState(false);

  const strength = getStrength(password);

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
    navigate('/mi-perfil', { replace: true });
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
    navigate('/mi-perfil', { replace: true });
  };

  return (
    <PublicLayout contentClassName="p-0">
      <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>

        {/* ── Left brand panel ── */}
        <div
          style={{
            display: 'none', flex: 1, position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(150deg, hsl(142,76%,22%) 0%, hsl(160,70%,27%) 35%, hsl(193,82%,28%) 70%, hsl(193,82%,35%) 100%)',
          }}
          className="reg-left-panel"
        >
          {/* Orbs */}
          <div style={{ position:'absolute', top:'-60px', right:'-80px', width:'340px', height:'340px', borderRadius:'50%', background:'rgba(255,255,255,0.07)', filter:'blur(40px)' }} />
          <div style={{ position:'absolute', bottom:'-80px', left:'-60px', width:'380px', height:'380px', borderRadius:'50%', background:'rgba(255,255,255,0.06)', filter:'blur(50px)' }} />

          {/* Inner content */}
          <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', justifyContent:'center', height:'100%', padding:'3rem 3.5rem' }}>

            {/* Brand pill */}
            <div style={{ marginBottom:'3rem' }}>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:'0.75rem',
                background:'rgba(255,255,255,0.12)', borderRadius:'50px',
                padding:'0.6rem 1.25rem', backdropFilter:'blur(10px)',
                border:'1px solid rgba(255,255,255,0.2)',
              }}>
                <Sparkles size={18} color="rgba(255,255,255,0.9)" />
                <span style={{ color:'rgba(255,255,255,0.9)', fontSize:'0.85rem', fontWeight:600, letterSpacing:'0.05em' }}>ConexiónLuz</span>
              </div>
            </div>

            <h2 style={{ fontSize:'2.5rem', fontWeight:800, lineHeight:1.15, color:'#ffffff', marginBottom:'1rem', textShadow:'0 2px 20px rgba(0,0,0,0.15)' }}>
              Comienza tu<br />
              <span style={{ color:'rgba(255,255,255,0.72)' }}>camino de sanación</span>
            </h2>
            <p style={{ color:'rgba(255,255,255,0.68)', fontSize:'1rem', lineHeight:1.7, maxWidth:'340px', marginBottom:'2.5rem' }}>
              Únete a nuestra comunidad y accede a recursos de bienestar diseñados especialmente para ti.
            </p>

            {/* Benefits */}
            <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem', marginBottom:'3rem' }}>
              {STEPS.map(({ icon: Icon, title, sub }) => (
                <div key={title} style={{ display:'flex', alignItems:'flex-start', gap:'1rem' }}>
                  <div style={{
                    width:'42px', height:'42px', borderRadius:'12px', flexShrink:0,
                    background:'rgba(255,255,255,0.13)', border:'1px solid rgba(255,255,255,0.2)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    backdropFilter:'blur(6px)',
                  }}>
                    <Icon size={18} color="rgba(255,255,255,0.9)" />
                  </div>
                  <div>
                    <p style={{ color:'#fff', fontWeight:600, fontSize:'0.88rem', margin:0 }}>{title}</p>
                    <p style={{ color:'rgba(255,255,255,0.58)', fontSize:'0.77rem', margin:'2px 0 0' }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Already have account nudge */}
            <div style={{
              background:'rgba(255,255,255,0.1)', backdropFilter:'blur(8px)',
              border:'1px solid rgba(255,255,255,0.18)', borderRadius:'16px',
              padding:'1rem 1.25rem', display:'flex', alignItems:'center', gap:'0.75rem',
            }}>
              <CheckCircle2 size={18} color="rgba(255,255,255,0.85)" />
              <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'0.82rem', margin:0, lineHeight:1.5 }}>
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" style={{ color:'#fff', fontWeight:700, textDecoration:'underline', textUnderlineOffset:'3px' }}>
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div style={{
          flex:1, display:'flex', alignItems:'center', justifyContent:'center',
          padding:'2rem 1.5rem', background:'#ffffff', position:'relative', overflowY:'auto',
        }}>
          {/* Top-left decoration (mirror of login's top-right) */}
          <div style={{
            position:'absolute', top:0, left:0,
            width:'260px', height:'260px', borderRadius:'0 0 100% 0',
            background:'linear-gradient(135deg, hsl(142,76%,96%) 0%, hsl(193,82%,97%) 100%)',
            pointerEvents:'none',
          }} />

          <div style={{ width:'100%', maxWidth:'460px', position:'relative', zIndex:1 }}>

            {/* Mobile brand */}
            <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'1.75rem' }} className="reg-mobile-brand">
              <div style={{
                width:'36px', height:'36px', borderRadius:'10px',
                background:'linear-gradient(135deg, hsl(142,76%,36%), hsl(193,82%,31%))',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Sparkles size={16} color="#fff" />
              </div>
              <span style={{ fontWeight:700, fontSize:'1.05rem', color:'hsl(142,76%,28%)' }}>ConexiónLuz</span>
            </div>

            {/* Heading */}
            <div style={{ marginBottom:'1.75rem' }}>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:'0.5rem',
                background:'hsl(142,76%,95%)', borderRadius:'50px',
                padding:'0.35rem 0.9rem', marginBottom:'1rem',
                border:'1px solid hsl(142,76%,85%)',
              }}>
                <UserPlus size={13} color="hsl(142,76%,30%)" />
                <span style={{ fontSize:'0.75rem', fontWeight:600, color:'hsl(142,76%,25%)', letterSpacing:'0.04em' }}>
                  CREAR CUENTA GRATIS
                </span>
              </div>
              <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#0f172a', lineHeight:1.2, margin:0 }}>
                Empieza hoy
              </h1>
              <p style={{ color:'#64748b', marginTop:'0.5rem', fontSize:'0.92rem', lineHeight:1.6 }}>
                Crea tu perfil y accede a cursos, citas y tu comunidad.
              </p>
            </div>

            {/* Google first (above the fold) */}
            {googleEnabled && googleClientId && (
              <div style={{ marginBottom:'1.5rem' }}>
                <div style={{ display:'flex', justifyContent:'center', minHeight:'44px' }}>
                  <div id="google-register-btn" style={{ width:'100%' }} />
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginTop:'1.25rem', marginBottom:'0.25rem' }}>
                  <div style={{ flex:1, height:'1px', background:'#e2e8f0' }} />
                  <span style={{ color:'#94a3b8', fontSize:'0.75rem', fontWeight:600, letterSpacing:'0.06em', whiteSpace:'nowrap' }}>
                    O REGÍSTRATE CON EMAIL
                  </span>
                  <div style={{ flex:1, height:'1px', background:'#e2e8f0' }} />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'12px',
                padding:'0.85rem 1.1rem', color:'#dc2626', fontSize:'0.875rem',
                marginBottom:'1.1rem', display:'flex', alignItems:'center', gap:'0.5rem',
              }}>
                <span style={{ fontSize:'1.1rem' }}>⚠</span> {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister} style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>

              {/* Name row */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                <div>
                  <label style={labelStyle}>Nombre <span style={{ color:'#ef4444' }}>*</span></label>
                  <input
                    id="reg-firstname"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    onFocus={() => setFocused('fn')}
                    onBlur={() => setFocused(null)}
                    placeholder="Tu nombre"
                    autoComplete="given-name"
                    style={inputStyle(focused === 'fn')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Apellido</label>
                  <input
                    id="reg-lastname"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    onFocus={() => setFocused('ln')}
                    onBlur={() => setFocused(null)}
                    placeholder="Apellido"
                    autoComplete="family-name"
                    style={inputStyle(focused === 'ln')}
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label style={labelStyle}>Usuario <span style={{ color:'#ef4444' }}>*</span></label>
                <input
                  id="reg-username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onFocus={() => setFocused('un')}
                  onBlur={() => setFocused(null)}
                  placeholder="tu.usuario"
                  autoComplete="username"
                  style={inputStyle(focused === 'un')}
                />
                <p style={{ fontSize:'0.72rem', color:'#94a3b8', marginTop:'0.35rem' }}>
                  Letras, números y . _ – (mínimo 3 caracteres)
                </p>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  id="reg-email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused('em')}
                  onBlur={() => setFocused(null)}
                  type="email"
                  placeholder="tu@email.com (opcional)"
                  autoComplete="email"
                  style={inputStyle(focused === 'em')}
                />
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Contraseña <span style={{ color:'#ef4444' }}>*</span></label>
                <div style={{ position:'relative' }}>
                  <input
                    id="reg-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused('pw')}
                    onBlur={() => setFocused(null)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    style={{ ...inputStyle(focused === 'pw'), paddingRight:'3rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
                    style={{
                      position:'absolute', right:'1rem', top:'50%', transform:'translateY(-50%)',
                      background:'none', border:'none', cursor:'pointer',
                      color:'#94a3b8', padding:'4px', display:'flex', alignItems:'center',
                    }}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {/* Strength bar */}
                {password.length > 0 && (
                  <div style={{ marginTop:'0.5rem' }}>
                    <div style={{ display:'flex', gap:'4px', marginBottom:'4px' }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{
                          flex:1, height:'4px', borderRadius:'99px',
                          background: i <= strength ? STRENGTH_COLORS[strength] : '#e2e8f0',
                          transition:'background 0.3s',
                        }} />
                      ))}
                    </div>
                    <p style={{ fontSize:'0.72rem', color: strength > 0 ? STRENGTH_COLORS[strength] : '#94a3b8', margin:0, fontWeight:600 }}>
                      {strength > 0 ? `Contraseña ${STRENGTH_LABELS[strength]}` : 'Mínimo 8 caracteres'}
                    </p>
                  </div>
                )}
                {password.length === 0 && (
                  <p style={{ fontSize:'0.72rem', color:'#94a3b8', marginTop:'0.35rem' }}>Mínimo 8 caracteres</p>
                )}
              </div>

              {/* Submit */}
              <button
                id="reg-submit-btn"
                type="submit"
                disabled={loading}
                style={{
                  width:'100%', padding:'0.95rem',
                  borderRadius:'14px', border:'none',
                  background: loading
                    ? '#94a3b8'
                    : 'linear-gradient(135deg, hsl(142,76%,30%) 0%, hsl(160,70%,30%) 50%, hsl(193,82%,31%) 100%)',
                  color:'#fff', fontWeight:700, fontSize:'1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition:'all 0.25s',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(34,197,94,0.3)',
                  letterSpacing:'0.02em',
                  marginTop:'0.4rem',
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(34,197,94,0.42)';
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = loading ? 'none' : '0 4px 20px rgba(34,197,94,0.3)';
                }}
              >
                {loading ? (
                  <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.6rem' }}>
                    <span style={{
                      width:'16px', height:'16px', border:'2px solid rgba(255,255,255,0.3)',
                      borderTopColor:'#fff', borderRadius:'50%',
                      animation:'spin 0.7s linear infinite', display:'inline-block',
                    }} />
                    Creando tu cuenta...
                  </span>
                ) : 'Crear cuenta gratuita'}
              </button>
            </form>

            {/* Login link */}
            <div style={{
              marginTop:'1.5rem', textAlign:'center',
              padding:'1rem', borderRadius:'14px',
              background:'#f8fafc', border:'1px solid #e2e8f0',
            }}>
              <span style={{ color:'#64748b', fontSize:'0.9rem' }}>¿Ya tienes cuenta?{' '}</span>
              <Link
                to="/login"
                style={{
                  color:'hsl(142,76%,30%)', fontWeight:700,
                  textDecoration:'none', fontSize:'0.9rem',
                  borderBottom:'2px solid hsl(142,76%,80%)',
                  paddingBottom:'1px', transition:'border-color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'hsl(142,76%,30%)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'hsl(142,76%,80%)'; }}
              >
                Iniciar sesión →
              </Link>
            </div>

            {/* Legal */}
            <p style={{ marginTop:'1rem', textAlign:'center', color:'#94a3b8', fontSize:'0.72rem', lineHeight:1.5 }}>
              Al registrarte aceptas nuestra{' '}
              <a href="#" style={{ color:'hsl(193,82%,40%)', textDecoration:'none' }}>política de privacidad</a>
              {' '}y{' '}
              <a href="#" style={{ color:'hsl(193,82%,40%)', textDecoration:'none' }}>términos de uso</a>.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 900px) {
          .reg-left-panel  { display: flex !important; }
          .reg-mobile-brand { display: none !important; }
        }
      `}</style>
    </PublicLayout>
  );
};

export default RegisterPage;
