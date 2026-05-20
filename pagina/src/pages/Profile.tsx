import React, { useEffect, useMemo, useState } from 'react';
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
  CreditCard,
  ChevronRight,
  CheckCircle2,
  Clock
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

const scaleOptions = [
  { value: 0, label: 'Nunca', color: 'bg-emerald-500' },
  { value: 1, label: 'A veces', color: 'bg-yellow-500' },
  { value: 2, label: 'Frecuente', color: 'bg-orange-500' },
  { value: 3, label: 'Casi siempre', color: 'bg-red-500' }
];

const IntakeScreen = ({ onCompleted }: { onCompleted: () => void }) => {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<IntakeAnswers>({
    stress: 0,
    anxiety: 0,
    mood: 0,
    sleep: 0,
    energy: 0,
    focus: 0,
    goal: ''
  });

  const steps = [
    { key: 'stress', title: 'Nivel de Estrés', subtitle: '¿Qué tan a menudo te has sentido estresado(a) esta semana?' },
    { key: 'anxiety', title: 'Ansiedad', subtitle: '¿Has sentido preocupación excesiva o inquietud?' },
    { key: 'mood', title: 'Estado de Ánimo', subtitle: '¿Te has sentido desanimado(a) o sin motivación?' },
    { key: 'sleep', title: 'Calidad del Sueño', subtitle: '¿Has tenido dificultades para descansar bien?' },
    { key: 'energy', title: 'Nivel de Energía', subtitle: '¿Sientes fatiga o falta de vitalidad?' },
    { key: 'focus', title: 'Concentración', subtitle: '¿Te ha costado mantener el foco en tus tareas?' },
    { key: 'goal', title: 'Tu Propósito', subtitle: '¿Cuál es tu principal objetivo para este proceso?' }
  ] as const;

  const current = steps[step];
  const progress = Math.round(((step + 1) / steps.length) * 100);

  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

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
    onCompleted();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl animate-in fade-in zoom-in duration-700">
        <div className="rounded-[2.5rem] border border-white/40 bg-white/70 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Paso {step + 1} de {steps.length}</span>
                <span className="text-xs font-bold text-primary">{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">{current.title}</h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-10">{current.subtitle}</p>

            {error && <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-500 text-sm font-medium border border-red-100">{error}</div>}

            <div className="space-y-3">
              {current.key === 'goal' ? (
                <textarea
                  value={answers.goal}
                  onChange={(e) => setAnswers((p) => ({ ...p, goal: e.target.value }))}
                  className="w-full min-h-[160px] rounded-3xl border border-gray-100 bg-white/50 px-6 py-5 text-lg outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-300"
                  placeholder="Escribe aquí tu intención..."
                  autoFocus
                />
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {scaleOptions.map((opt) => {
                    const key = current.key as IntakeScaleKey;
                    const active = answers[key] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setAnswers((p) => ({ ...p, [key]: opt.value } as IntakeAnswers));
                          if (step < steps.length - 1) setTimeout(next, 300);
                        }}
                        className={cn(
                          "group relative flex items-center justify-between rounded-2xl border-2 p-5 transition-all duration-300",
                          active 
                            ? "border-primary bg-primary/5 shadow-md scale-[1.02]" 
                            : "border-gray-50 bg-white/50 hover:border-gray-200 hover:bg-white"
                        )}
                      >
                        <span className={cn("font-bold text-lg", active ? "text-primary" : "text-gray-700")}>{opt.label}</span>
                        <div className={cn("h-3 w-3 rounded-full transition-all duration-500", active ? opt.color : "bg-gray-100 group-hover:bg-gray-200")} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-12 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={back}
                disabled={step === 0 || saving}
                className="text-gray-400 font-bold hover:text-gray-600 disabled:opacity-0 transition-all"
              >
                Atrás
              </button>

              <button
                type="button"
                onClick={step === steps.length - 1 ? () => void submit() : next}
                disabled={saving}
                className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50"
              >
                {saving ? 'Guardando...' : step === steps.length - 1 ? 'Empezar mi viaje' : 'Siguiente'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem(getTokenKey()) : null;
  const isAuthed = Boolean(token);
  const [me, setMe] = useState<PortalMe | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [activeTab, setActiveTab] = useState<'wellbeing' | 'courses' | 'settings'>('wellbeing');
  const [prefs, setPrefs] = useState({ title: '', message: '', color: '' });
  const [savingPrefs, setSavingPrefs] = useState(false);

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
      color: res.data.portalAccentColor || ''
    });
    setLoadingMe(false);
  };

  useEffect(() => {
    if (!isAuthed) {
      setLoadingMe(false);
      setMe(null);
      return;
    }
    void loadMe();
  }, [isAuthed]);

  const accent = me?.portalAccentColor || '#22c55e';
  const hasHipnosis = localStorage.getItem(getPurchaseKey('hipnosis-interdimencional')) === '1';

  if (!isAuthed) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (loadingMe) return <div className="min-h-screen bg-white" />;
  if (me && me.intakeCompleted === false) return <IntakeScreen onCompleted={() => void loadMe()} />;

  const logout = () => {
    localStorage.removeItem(getTokenKey());
    window.location.href = '/login';
  };

  const savePreferences = async () => {
    setSavingPrefs(true);
    const res = await api.patch<PortalMe>('/api/portal/me/', {
      portalWelcomeTitle: prefs.title,
      portalWelcomeMessage: prefs.message,
      portalAccentColor: prefs.color
    });
    if (res.ok) {
      setMe(res.data);
      setSavingPrefs(false);
    }
    setSavingPrefs(false);
  };

  const initials = `${me?.firstName?.[0] || ''}${me?.lastName?.[0] || ''}`.toUpperCase();

  return (
    <PublicLayout contentClassName="p-0">
      <div className="min-h-screen bg-[#fcfcfc]">
        {/* Header Section */}
        <header 
          className="relative py-20 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${accent}15 0%, rgba(255,255,255,1) 50%, ${accent}08 100%)` }}
        >
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="relative group">
                  <div className="h-32 w-32 rounded-[2.5rem] bg-white shadow-2xl flex items-center justify-center text-4xl font-black text-gray-800 ring-4 ring-white border border-gray-100 transform group-hover:rotate-6 transition-transform duration-500">
                    {initials || <User className="h-12 w-12 text-gray-300" />}
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-white shadow-lg flex items-center justify-center border border-gray-50">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-4">
                    {me?.portalWelcomeTitle || `Hola, ${me?.firstName}`}
                  </h1>
                  <p className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-8">
                    {me?.portalWelcomeMessage || 'Bienvenido(a) a tu espacio personal de sanación y crecimiento.'}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    {me?.hasActiveSubscription && (
                      <div className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                        Membresía Activa
                      </div>
                    )}
                    <button 
                      onClick={logout}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-gray-100 text-gray-600 text-sm font-bold shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
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

        {/* Dashboard Content */}
        <main className="container mx-auto px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            {/* Tabs Navigation */}
            <div className="flex items-center gap-1 p-1.5 bg-gray-100/50 rounded-2xl mb-12 w-fit mx-auto md:mx-0">
              {[
                { id: 'wellbeing', label: 'Mi Bienestar', icon: Activity },
                { id: 'courses', label: 'Mis Cursos', icon: BookOpen },
                { id: 'settings', label: 'Ajustes', icon: Settings },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                    activeTab === t.id 
                      ? "bg-white shadow-md text-gray-900 scale-[1.02]" 
                      : "text-gray-500 hover:text-gray-800"
                  )}
                >
                  <t.icon className={cn("h-4 w-4", activeTab === t.id ? "text-primary" : "text-gray-400")} />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'wellbeing' && (
                <div className="space-y-8">
                  {me?.intakeSummary ? (
                    <div className="group relative rounded-[2.5rem] bg-white border border-gray-100 p-8 md:p-12 shadow-sm hover:shadow-xl transition-all duration-500">
                      <div className="absolute top-8 right-8 h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                        <Activity className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-6">Tu resumen de bienestar</h3>
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line italic">
                          "{me.intakeSummary}"
                        </p>
                      </div>
                      <div className="mt-10 flex flex-wrap gap-4 pt-10 border-t border-gray-50">
                        <Link to="/agenda" className="px-8 py-3 rounded-2xl bg-gray-900 text-white font-bold hover:scale-105 transition-all">
                          Agendar sesión de apoyo
                        </Link>
                        <Link to="/mi-calendario" className="px-8 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all">
                          Ver mi calendario
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                      <p className="text-gray-400 font-medium">Completa tu evaluación para ver tu resumen aquí.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'courses' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hasHipnosis ? (
                    <Link to="/cursos/hipnosis-interdimencional" className="group block">
                      <div className="h-full rounded-[2.5rem] bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
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
                        <div className="p-8">
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
                    <div className="md:col-span-3 text-center py-32 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                      <div className="h-20 w-20 rounded-3xl bg-gray-50 flex items-center justify-center mx-auto mb-6">
                        <Lock className="h-8 w-8 text-gray-300" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-2">Aún no tienes cursos</h3>
                      <p className="text-gray-500 mb-10 max-w-md mx-auto">Explora nuestra biblioteca y empieza tu transformación hoy mismo.</p>
                      <Link to="/cursos" className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-primary text-white font-black shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                        Explorar Biblioteca
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-3xl space-y-8">
                  <div className="rounded-[2.5rem] bg-white border border-gray-100 p-8 md:p-12 shadow-sm">
                    <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                      <Sparkles className="h-6 w-6 text-primary" />
                      Personalización del Portal
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Título Personalizado</label>
                          <input
                            value={prefs.title}
                            onChange={(e) => setPrefs((p) => ({ ...p, title: e.target.value }))}
                            className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-6 py-4 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                            placeholder="Ej. Hola, María"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Color de Acento (HEX)</label>
                          <div className="flex gap-3">
                            <input
                              value={prefs.color}
                              onChange={(e) => setPrefs((p) => ({ ...p, color: e.target.value }))}
                              className="flex-1 rounded-2xl border border-gray-100 bg-gray-50/50 px-6 py-4 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-mono font-bold"
                              placeholder="#22c55e"
                            />
                            <div className="h-14 w-14 rounded-2xl border-4 border-white shadow-md shadow-inner shrink-0 transition-colors duration-500" style={{ backgroundColor: prefs.color || accent }} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Mensaje Motivador</label>
                        <textarea
                          value={prefs.message}
                          onChange={(e) => setPrefs((p) => ({ ...p, message: e.target.value }))}
                          className="w-full min-h-[120px] rounded-2xl border border-gray-100 bg-gray-50/50 px-6 py-4 text-gray-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all leading-relaxed"
                          placeholder="Un mensaje para recordarte tu poder..."
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => void savePreferences()}
                        disabled={savingPrefs}
                        className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4"
                      >
                        {savingPrefs ? 'Guardando...' : 'Aplicar mis cambios'}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-[2.5rem] bg-gray-50 border border-gray-100 p-8 md:p-12">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Información de Cuenta</h3>
                    <p className="text-gray-500 text-sm mb-6">Gestiona la seguridad y accesos de tu cuenta.</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-50">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          <span className="text-sm font-bold text-gray-700">Email verificado: {me?.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-50">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-blue-500" />
                          <span className="text-sm font-bold text-gray-700">Última evaluación: {me?.intakeCompleted ? 'Completada' : 'Pendiente'}</span>
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
