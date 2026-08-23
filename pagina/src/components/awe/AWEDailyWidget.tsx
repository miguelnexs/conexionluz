import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../api/client';

interface AWEResource {
  id: number;
  tipo: string;
  escuela: string;
  tema: string;
  emocion: string[];
  perfil: string[];
  nivel: string;
  energia: string;
  momento: string;
  duracion: string;
  semana_terapeutica: number[];
  tags: string[];
  texto: string;
  accion: string | null;
  pregunta: string | null;
}

interface AWEWidgetProps {
  compact?: boolean;
  className?: string;
}

const SCHOOL_META: Record<string, { icon: string; gradientStart: string; gradientEnd: string; label: string }> = {
  stoicism: { icon: '⚖️', gradientStart: '#059669', gradientEnd: '#0f766e', label: 'Estoicismo' },
  tcc: { icon: '🧠', gradientStart: '#0284c7', gradientEnd: '#3730a3', label: 'T.Cognitivo Conductual' },
  humanismo: { icon: '🌱', gradientStart: '#10b981', gradientEnd: '#065f46', label: 'Humanismo' },
  positiva: { icon: '✨', gradientStart: '#d97706', gradientEnd: '#92400e', label: 'Psicología Positiva' },
  logoterapia: { icon: '🌟', gradientStart: '#8b5cf6', gradientEnd: '#4c1d95', label: 'Logoterapia' },
};

const TIPO_META: Record<string, { icon: string; badge: string }> = {
  reflexion: { icon: '💭', badge: 'Reflexión' },
  consejo: { icon: '🗝️', badge: 'Consejo Terapéutico' },
  esperanza: { icon: '🕯️', badge: 'Mensaje de Esperanza' },
  ejercicio: { icon: '🎯', badge: 'Ejercicio' },
  respiracion: { icon: '🌬️', badge: 'Respiración Guiada' },
  microhabito: { icon: '🌿', badge: 'Micro-Hábito' },
  pregunta: { icon: '🔍', badge: 'Para Reflexionar' },
  motivacional: { icon: '💫', badge: 'Motivación' },
};

const EMOTIONS_LIST = [
  'ansiedad','tristeza','enojo','miedo','soledad',
  'culpa','esperanza','gratitud','serenidad','confusión','agotamiento','vergüenza',
];
const PROFILES = ['Vigilante','Guerrero Agotado','Buscador de Sentido','Corazón Abierto','Mente Analítica'];

const AWE_DEFAULT_RESOURCES: AWEResource[] = [
  {
    id: 101,
    tipo: 'reflexion',
    escuela: 'stoicism',
    tema: 'Aceptación y Paz Interior',
    emocion: ['ansiedad', 'serenidad'],
    perfil: ['Buscador de Sentido'],
    nivel: 'intermedio',
    energia: 'media',
    momento: 'mañana',
    duracion: '3 min',
    semana_terapeutica: [1],
    tags: ['paz', 'claridad', 'estoicismo'],
    texto: '**La Dicotomía del Control**\nNo puedes controlar las tormentas externas ni las reacciones de los demás, pero siempre tienes el poder soberano sobre tu actitud y tu respuesta interna. Cuando distingues entre lo que depende de ti y lo que no, experimentas una liberación profunda.',
    accion: 'Escribe en una nota 2 cosas que te preocupan hoy y clasifícalas: ¿está bajo tu control directo o debes soltar el resultado?',
    pregunta: '¿Qué carga estás sosteniendo hoy que realmente no te pertenece llevar?'
  },
  {
    id: 102,
    tipo: 'consejo',
    escuela: 'tcc',
    tema: 'Reestructuración Cognitiva',
    emocion: ['ansiedad', 'agotamiento'],
    perfil: ['Mente Analítica'],
    nivel: 'básico',
    energia: 'alta',
    momento: 'tarde',
    duracion: '2 min',
    semana_terapeutica: [1],
    tags: ['mente', 'tcc', 'calma'],
    texto: '**Cuestionando tus Pensamientos**\nTu mente intenta protegerte anticipando escenarios difíciles, pero un pensamiento ansioso no es un hecho verídico. Cuando aparezca la duda, pregúntate: "¿Tengo evidencia real y objetiva de esto hoy?"',
    accion: 'Inhala profundamente contando hasta 4, mantén 4 segundos y exhala suavemente en 6 segundos por 3 ciclos.',
    pregunta: '¿Cómo le hablarías a un amigo querido que tiene el mismo temor que tú sientes ahora?'
  },
  {
    id: 103,
    tipo: 'esperanza',
    escuela: 'logoterapia',
    tema: 'Propósito y Sentido',
    emocion: ['tristeza', 'esperanza'],
    perfil: ['Guerrero Agotado'],
    nivel: 'avanzado',
    energia: 'suave',
    momento: 'noche',
    duracion: '4 min',
    semana_terapeutica: [2],
    tags: ['sentido', 'esperanza', 'resiliencia'],
    texto: '**Encontrando Significado en el Presente**\nIncluso en las etapas de sombra y pausa, estás sembrando fortaleza. Viktor Frankl nos recuerda que cuando ya no podemos cambiar una situación, tenemos el desafío de transformarnos a nosotros mismos.',
    accion: 'Identifica una pequeña acción compasiva que puedas hacer hoy por ti o por alguien más.',
    pregunta: '¿Qué aprendizaje valioso está tratando de enseñarte esta etapa de tu vida?'
  },
  {
    id: 104,
    tipo: 'microhabito',
    escuela: 'positiva',
    tema: 'Gratitud Consciente',
    emocion: ['gratitud', 'serenidad'],
    perfil: ['Corazón Abierto'],
    nivel: 'básico',
    energia: 'alta',
    momento: 'cualquiera',
    duracion: '2 min',
    semana_terapeutica: [1],
    tags: ['gratitud', 'positivity', 'bienestar'],
    texto: '**El Ancla de la Gratitud**\nCentrar la atención en lo humilde pero luminoso reprograma suavemente nuestro sistema nervioso hacia la calma. No se trata de ignorar la dificultad, sino de nutrir la luz cotidiana.',
    accion: 'Agradece en voz alta o mentalmente 3 detalles simples que viviste en las últimas horas.',
    pregunta: '¿Qué pequeño regalo cotidiano diste por sentado hoy?'
  }
];

const CACHE_RESOURCE_KEY = 'conexionluz:awe_daily_resource';

const getInitialResource = (): AWEResource => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(CACHE_RESOURCE_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* silent */ }
  }
  // Default to deterministic fallback based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return AWE_DEFAULT_RESOURCES[dayOfYear % AWE_DEFAULT_RESOURCES.length];
};

const AWEDailyWidget: React.FC<AWEWidgetProps> = ({ compact = false, className = '' }) => {
  const [resource, setResource] = useState<AWEResource | null>(getInitialResource);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [marked, setMarked] = useState(false);
  const [profile, setProfile] = useState({
    psych_profile: 'Buscador de Sentido',
    current_emotions: [] as string[],
    risk_level: 'leve',
    preferred_moment: 'cualquiera',
  });

  const saveResourceToCache = (res: AWEResource) => {
    setResource(res);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CACHE_RESOURCE_KEY, JSON.stringify(res));
      } catch { /* silent */ }
    }
  };

  const loadDaily = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await api.get<{ ok: boolean; resource: AWEResource }>('/api/portal/awe/daily/');
      if (res.ok && (res.data as { ok: boolean; resource: AWEResource }).resource) {
        const backendRes = (res.data as { ok: boolean; resource: AWEResource }).resource;
        saveResourceToCache(backendRes);
        setMarked(false);
        setShowAction(false);
        setRefreshing(false);
        setLoading(false);
        return;
      }
    } catch { /* silent */ }
    
    // Check if we have a test-synced or cached resource in localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(CACHE_RESOURCE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setResource(parsed);
          setMarked(false);
          setShowAction(false);
          setRefreshing(false);
          setLoading(false);
          return;
        }
      } catch { /* silent */ }
    }

    // Fallback: pick a curated resource
    setResource(prev => {
      if (prev) return prev;
      const nextRes = AWE_DEFAULT_RESOURCES[0];
      saveResourceToCache(nextRes);
      return nextRes;
    });
    setMarked(false);
    setShowAction(false);
    setRefreshing(false);
    setLoading(false);
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const res = await api.get<{ ok: boolean; profile: typeof profile }>('/api/portal/awe/profile/');
      if (res.ok) setProfile((res.data as { ok: boolean; profile: typeof profile }).profile);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    loadProfile();
    // Revalidate in background if authed
    loadDaily();
  }, []);

  const handleMarkRead = async () => {
    if (!resource || marked) return;
    setMarked(true);
    try {
      await api.post('/api/portal/awe/mark-read/', { resource_id: resource.id });
    } catch { /* silent */ }
  };

  const toggleEmotion = (e: string) => {
    setProfile(p => ({
      ...p,
      current_emotions: p.current_emotions.includes(e)
        ? p.current_emotions.filter(x => x !== e)
        : [...p.current_emotions.slice(-2), e],
    }));
  };

  const saveProfile = async () => {
    try {
      await api.patch('/api/portal/awe/profile/', profile);
      setShowConfig(false);
      await loadDaily();
    } catch { /* silent */ }
  };

  if (loading) {
    return (
      <div className={`rounded-3xl bg-white border border-emerald-100 p-5 shadow-sm space-y-3 animate-pulse ${className}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50" />
          <div className="h-4 bg-emerald-100/60 rounded w-1/2" />
        </div>
        <div className="h-16 bg-slate-50 rounded-2xl" />
      </div>
    );
  }

  const activeResource = resource || AWE_DEFAULT_RESOURCES[0];
  const school = SCHOOL_META[activeResource.escuela] || SCHOOL_META.humanismo;
  const tipo = TIPO_META[activeResource.tipo] || { icon: '💭', badge: activeResource.tipo };
  const paragraphs = activeResource.texto.split('\n\n').filter(Boolean);

  const renderText = (text: string) => text.replace(/\*\*(.*?)\*\*/g, '$1');

  if (compact) {
    return (
      <div
        className={`group relative rounded-3xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${className}`}
      >
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-base">
                {school.icon}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
                  {school.label}
                </span>
                <span className="text-xs font-bold text-slate-800">{tipo.badge}</span>
              </div>
            </div>
            <button
              onClick={e => { e.stopPropagation(); loadDaily(); }}
              disabled={refreshing}
              className="text-slate-400 hover:text-emerald-600 transition-colors text-xs p-1 cursor-pointer"
              title="Obtener otra sabiduría del día"
            >
              {refreshing ? '⏳' : '🔄'}
            </button>
          </div>

          <p className="text-slate-700 text-xs leading-relaxed font-medium bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 whitespace-pre-line">
            {renderText(activeResource.texto)}
          </p>

          {activeResource.accion && (
            <div className="bg-emerald-50/60 rounded-2xl p-3 border border-emerald-100 text-xs">
              <span className="font-bold text-emerald-800 block mb-0.5">🎯 Ejercicio de Hoy:</span>
              <p className="text-emerald-950 font-medium leading-relaxed">{activeResource.accion}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-bold">
            <div className="flex gap-1">
              {activeResource.tags.slice(0, 2).map(tag => (
                <span key={tag} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
            <span className="text-emerald-600 font-bold">⏱️ {activeResource.duracion}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-xl text-slate-800 ${className}`}
    >
        <div className="h-1.5 bg-indigo-600" />

      <div className="relative p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl shrink-0">
              {school.icon}
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-black">Sabiduría del Día</p>
              <p className="text-slate-900 font-black text-base">{school.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all border border-slate-200 cursor-pointer"
              title="Personalizar"
            >⚙️</button>
            <button
              onClick={loadDaily}
              disabled={refreshing}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all border border-slate-200 cursor-pointer"
              title="Nuevo recurso"
            >
              {refreshing
                ? <span className="w-4 h-4 border-2 border-slate-400 border-t-indigo-600 rounded-full animate-spin" />
                : '🔄'}
            </button>
          </div>
        </div>

        {/* Config Panel */}
        {showConfig && (
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
            <h4 className="text-slate-900 font-bold text-sm">Personaliza tu AWE</h4>
            <div>
              <p className="text-slate-500 text-xs mb-1.5 font-medium">Tu perfil</p>
              <div className="flex flex-wrap gap-1.5">
                {PROFILES.map(p => (
                  <button key={p} onClick={() => setProfile(prev => ({ ...prev, psych_profile: p }))}
                    className={`text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer ${profile.psych_profile === p ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                  >{p}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1.5 font-medium">¿Cómo te sientes? (máx 3)</p>
              <div className="flex flex-wrap gap-1.5">
                {EMOTIONS_LIST.map(e => (
                  <button key={e} onClick={() => toggleEmotion(e)}
                    className={`text-xs px-2.5 py-1 rounded-lg transition-all capitalize cursor-pointer ${profile.current_emotions.includes(e) ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                  >{e}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1.5 font-medium">Momento</p>
              <div className="flex gap-1.5">
                {['mañana','tarde','noche','cualquiera'].map(m => (
                  <button key={m} onClick={() => setProfile(prev => ({ ...prev, preferred_moment: m }))}
                    className={`text-xs px-2 py-1 rounded-lg transition-all capitalize flex-1 cursor-pointer ${profile.preferred_moment === m ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                  >{m}</button>
                ))}
              </div>
            </div>
            <button onClick={saveProfile} className="w-full bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
              Guardar y actualizar
            </button>
          </div>
        )}

        {/* Type Badge */}
        <div>
          <span className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-3 py-1.5 rounded-full font-bold">
            {tipo.icon} {tipo.badge} <span className="text-indigo-300">•</span> {activeResource.duracion}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {paragraphs.map((p, i) => {
            const clean = renderText(p);
            const isBoldTitle = p.startsWith('**') && !p.endsWith('**');
            if (isBoldTitle) {
              const lines = clean.split('\n');
              return (
                <div key={i} className="mb-3">
                  <h3 className="text-slate-900 font-black text-base mb-1.5 leading-snug">{lines[0]}</h3>
                  {lines.slice(1).map((l, li) => (
                    <p key={li} className="text-slate-700 text-sm leading-relaxed mb-1 font-medium">{l}</p>
                  ))}
                </div>
              );
            }
            if (p.startsWith('**') && p.endsWith('**')) {
              return <h3 key={i} className="text-slate-900 font-black text-base mb-2">{clean}</h3>;
            }
            return <p key={i} className="text-slate-700 text-sm md:text-base leading-relaxed font-medium">{clean}</p>;
          })}
        </div>

        {/* Action */}
        {activeResource.accion && (
          <div>
            <button
              onClick={() => setShowAction(!showAction)}
              className="w-full text-left bg-emerald-50/80 hover:bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span>🎯</span>
                  <span className="text-emerald-950 font-bold text-sm">Práctica de hoy</span>
                </div>
                <span className="text-emerald-700 text-xs font-bold">{showAction ? '▲' : '▼'}</span>
              </div>
              {showAction && <p className="text-emerald-900 text-xs md:text-sm font-medium leading-relaxed mt-3 pt-3 border-t border-emerald-200/60">{activeResource.accion}</p>}
            </button>
          </div>
        )}

        {/* Question */}
        {activeResource.pregunta && (
          <div>
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <span>🔍</span>
                <span className="text-amber-800 text-xs uppercase tracking-wider font-bold">Para reflexionar</span>
              </div>
              <p className="text-amber-950 text-xs md:text-sm italic leading-relaxed font-semibold">{activeResource.pregunta}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <div className="flex flex-wrap gap-1.5">
            {activeResource.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full font-semibold">#{tag}</span>
            ))}
          </div>
          {!marked
            ? <button onClick={handleMarkRead} className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all border border-indigo-200 cursor-pointer">✓ Leído</button>
            : <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">✓ Completado</span>
          }
        </div>

        <div className="border-t border-slate-100 pt-3">
          <p className="text-slate-400 text-xs text-center font-medium">Adaptive Wisdom Engine · Conexión Luz® · {school.label}</p>
        </div>
      </div>
    </div>
  );
};

export default AWEDailyWidget;
