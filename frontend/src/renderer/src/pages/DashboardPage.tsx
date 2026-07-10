import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { 
  Heart, Sparkles, BarChart3, Users, Video, Star, ArrowRight, 
  BookOpen, CalendarDays, UserRound, LibraryBig, Clock, TrendingUp, 
  Award, ShieldAlert, MessageCircle
} from 'lucide-react'
import logo from '../assets/logo.png'
import { useTranslation } from 'react-i18next'
import { api } from '@/api/client'
import { cn } from '../utils/cn'

type DashboardCounts = {
  courses: number
  therapists: number
  services: number
  talks: number
  testimonials: number
  stories: number
  sessions?: number
  patients?: number
}

// Custom data for visual analytics charts
const WEEKLY_SESSIONS = [
  { day: 'Lun', sessions: 12, growth: '+15%' },
  { day: 'Mar', sessions: 19, growth: '+25%' },
  { day: 'Mié', sessions: 15, growth: '-8%' },
  { day: 'Jue', sessions: 25, growth: '+40%' },
  { day: 'Vie', sessions: 22, growth: '+10%' },
  { day: 'Sáb', sessions: 30, growth: '+50%' },
  { day: 'Dom', sessions: 18, growth: '-12%' }
]

const SPECIALTY_DISTRIBUTION = [
  { name: 'Sanación Reconectiva', count: 35, color: 'bg-teal-500' },
  { name: 'Reiki & Armonización', count: 28, color: 'bg-emerald-500' },
  { name: 'Meditaciones Guiadas', count: 22, color: 'bg-indigo-500' },
  { name: 'Yoga & Consciencia', count: 18, color: 'bg-purple-500' }
]

export function DashboardPage(): JSX.Element {
  const { t } = useTranslation()
  const [counts, setCounts] = useState<DashboardCounts | null>(null)
  const [hoveredDay, setHoveredDay] = useState<any | null>(null)

  useEffect(() => {
    void (async () => {
      const res = await api.get<DashboardCounts>('/api/dashboard/')
      if (!res.ok) return
      
      const anaRes = await api.get<any>('/api/analytics/')
      if (anaRes.ok) {
        setCounts({
          ...res.data,
          sessions: anaRes.data.sessions,
          patients: anaRes.data.patients
        })
      } else {
        setCounts(res.data)
      }
    })()
  }, [])

  const [unreadChats, setUnreadChats] = useState(0)

  useEffect(() => {
    const fetchChatUnread = async () => {
      const res = await api.get<any[]>('/api/admin/chat/sessions/')
      if (res.ok) {
        const totalUnread = res.data.reduce((acc: number, s: any) => acc + (s.unreadCount || 0), 0)
        setUnreadChats(totalUnread)
      }
    }
    fetchChatUnread()
    const iv = setInterval(fetchChatUnread, 5000)
    return () => clearInterval(iv)
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  const item = {
    hidden: { y: 15, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 25 } }
  }

  // Linear path nodes list (Lun - Dom)
  const chartPoints = [
    { cx: 30, cy: 110, val: 12, day: 'Lun' },
    { cx: 100, cy: 75, val: 19, day: 'Mar' },
    { cx: 170, cy: 95, val: 15, day: 'Mié' },
    { cx: 240, cy: 68, val: 25, day: 'Jue' },
    { cx: 310, cy: 78, val: 22, day: 'Vie' },
    { cx: 380, cy: 40, val: 30, day: 'Sáb' },
    { cx: 450, cy: 60, val: 18, day: 'Dom' }
  ]

  // Quick Action Buttons
  const QUICK_ACTIONS = [
    { 
      name: 'Agendar Cita', 
      desc: 'Crear citas médicas o consultas', 
      icon: CalendarDays, 
      href: '/calendario', 
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15' 
    },
    { 
      name: 'Registrar Paciente', 
      desc: 'Añadir usuario a la ficha clínica', 
      icon: UserRound, 
      href: '/pacientes', 
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15' 
    },
    { 
      name: 'Nuevo Terapeuta', 
      desc: 'Registrar profesional o psicólogo', 
      icon: Users, 
      href: '/terapeutas', 
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/15' 
    },
    { 
      name: 'Publicar Curso', 
      desc: 'Subir material o talleres de conciencia', 
      icon: LibraryBig, 
      href: '/cursos', 
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/15' 
    },
    { 
      name: 'Chat en Vivo', 
      desc: 'Atender visitas de la web en tiempo real', 
      icon: MessageCircle, 
      href: '/chat', 
      color: 'text-pink-500 bg-pink-500/10 border-pink-500/20 hover:bg-pink-500/15' 
    },
    { 
      name: 'Analíticas y KPIs', 
      desc: 'Ver métricas de rendimiento', 
      icon: BarChart3, 
      href: '/analitica', 
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/15' 
    }
  ]

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 py-6"
    >
      {/* ── SECCIÓN 1: BIENVENIDA HERO ────────────────────────── */}
      <motion.section 
        variants={item}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-background to-accent/10 border border-primary/10 p-8 md:p-12 shadow-xl"
      >
        <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 text-center md:text-left space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-sm px-4 py-2 shadow-sm border border-border/60">
                <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
                <span className="text-sm font-bold text-foreground/80">{t('dashboard.badge')}</span>
              </div>
              <h2 className="mt-4 text-4xl md:text-5.5xl font-black tracking-tight leading-none text-foreground">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-foreground">
                  {t('dashboard.hero_title')}
                </span>
              </h2>
              <p className="mt-3 text-lg md:text-xl font-bold text-foreground/90">
                {t('dashboard.hero_subtitle')}
              </p>
            </div>
            
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto md:mx-0 font-medium">
              {t('dashboard.hero_description')}
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
              <Button asChild size="lg" className="rounded-2xl px-6 py-6 text-base font-extrabold shadow-lg shadow-primary/25 hover:shadow-primary/45 transition-all">
                <Link to="/terapeutas">
                  <Heart className="mr-2.5 h-5 w-5 fill-primary-foreground" />
                  {t('dashboard.cta_therapists')}
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="rounded-2xl px-6 py-6 text-base font-bold shadow-sm">
                <Link to="/servicios">
                  {t('dashboard.cta_services')}
                  <ArrowRight className="ml-2.5 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="md:col-span-4 flex justify-center md:justify-end">
            <motion.div
              whileHover={{ scale: 1.06, rotate: 3 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <img 
                src={logo} 
                alt="Logo" 
                className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-3xl"
              />
            </motion.div>
          </div>
        </div>
        
        {/* Glow ambient blobs */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-80 h-80 bg-primary/20 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-10 translate-y-12 w-64 h-64 bg-accent/20 rounded-full blur-3xl opacity-60 pointer-events-none" />
      </motion.section>

      {/* ── SECCIÓN 2: TARJETAS DE ESTADÍSTICAS OPERATIVAS ────── */}
      <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Sesiones Agendadas',
            desc: '+12.4% este mes',
            icon: CalendarDays,
            color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
            count: counts?.sessions ?? '—',
            trend: 'up'
          },
          {
            title: 'Pacientes Activos',
            desc: '+8.3% nuevos registros',
            icon: Users,
            color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
            count: counts?.patients ?? '—',
            trend: 'up'
          },
          {
            title: 'Conversatorios',
            desc: '4 en vivo programados',
            icon: Video,
            color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
            count: counts?.talks ?? '—',
            trend: 'neutral'
          },
          {
            title: 'Soporte en Vivo',
            desc: unreadChats > 0 ? `${unreadChats} mensajes nuevos` : 'Sin mensajes pendientes',
            icon: MessageCircle,
            color: unreadChats > 0 ? "text-pink-500 bg-pink-500/10 border-pink-500/20" : "text-slate-500 bg-slate-500/10 border-slate-500/20",
            count: unreadChats,
            trend: unreadChats > 0 ? 'up' : 'neutral',
            href: '/chat'
          }
        ].map((feature, i) => {
          const CardContent = (
            <div className="h-full flex flex-col justify-between">
              <div className="flex items-center justify-between gap-4">
                <div className={`size-12 rounded-xl ${feature.color} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-3xl font-black tracking-tight text-foreground">
                    {feature.count}
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    {feature.trend === 'up' && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
                    <span className="text-xs text-muted-foreground font-semibold">{feature.desc}</span>
                  </div>
                </div>
              </div>
              <h3 className="mt-5 font-bold text-base text-foreground/80">{feature.title}</h3>
            </div>
          )

          return (
            <motion.div 
              key={i}
              variants={item}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20 group cursor-pointer"
            >
              {feature.href ? (
                <Link to={feature.href}>{CardContent}</Link>
              ) : (
                CardContent
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* ── SECCIÓN 3: ESTADÍSTICAS PROFESIONALES (GRAFICOS) ─── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Gráfico 1: Área de Sesiones Semanales (Custom SVG) */}
        <motion.div 
          variants={item}
          className="lg:col-span-8 p-6 rounded-3xl border bg-card/65 backdrop-blur-sm shadow-sm flex flex-col justify-between relative overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-foreground">Actividad de Sesiones Semanales</h3>
                <p className="text-xs text-muted-foreground font-medium">Volumen de consultas del staff médico</p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                <TrendingUp className="h-4 w-4" />
                <span>Rendimiento Óptimo</span>
              </div>
            </div>

            {/* SVG Chart area */}
            <div className="relative h-48 w-full mt-4 flex items-end">
              <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal Guide lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="currentColor" className="text-border/40" strokeDasharray="4 4" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="currentColor" className="text-border/40" strokeDasharray="4 4" />
                <line x1="0" y1="130" x2="500" y2="130" stroke="currentColor" className="text-border/40" strokeDasharray="4 4" />

                {/* Glow Area Path under the line (Linear connection) */}
                <path 
                  d="M 30,110 L 100,75 L 170,95 L 240,68 L 310,78 L 380,40 L 450,60 L 450,150 L 30,150 Z" 
                  fill="url(#areaGrad)" 
                />

                {/* Neon Glow behind the main line */}
                <path 
                  d="M 30,110 L 100,75 L 170,95 L 240,68 L 310,78 L 380,40 L 450,60" 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="8"
                  className="opacity-20"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Main Curved Line Path */}
                <path 
                  d="M 30,110 L 100,75 L 170,95 L 240,68 L 310,78 L 380,40 L 450,60" 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Absolute circular HTML dots - they remain perfectly round without stretching */}
              {chartPoints.map((pt, idx) => {
                const leftPct = (pt.cx / 500) * 100
                const bottomPct = ((150 - pt.cy) / 150) * 100
                return (
                  <div 
                    key={idx}
                    className="absolute -translate-x-1/2 translate-y-1/2 z-20"
                    style={{ left: `${leftPct}%`, bottom: `${bottomPct}%` }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.3 }}
                      className="h-4.5 w-4.5 rounded-full border-3 border-primary bg-background shadow-md transition-all cursor-pointer focus:outline-none"
                      onMouseEnter={() => setHoveredDay(pt)}
                      onMouseLeave={() => setHoveredDay(null)}
                    />
                  </div>
                )
              })}

              {/* Tooltip dynamic window */}
              <AnimatePresence>
                {hoveredDay && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bg-popover text-popover-foreground border shadow-md rounded-xl p-3 text-xs font-bold flex flex-col gap-1 z-30 pointer-events-none -translate-x-1/2"
                    style={{ 
                      left: `${(hoveredDay.cx / 500) * 100}%`, 
                      bottom: `${((150 - hoveredDay.cy) / 150) * 100 + 8}%` 
                    }}
                  >
                    <span className="text-[10px] text-muted-foreground uppercase">{hoveredDay.day}</span>
                    <span className="text-sm font-black text-primary whitespace-nowrap">{hoveredDay.val} Sesiones</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Days labels */}
            <div className="flex justify-between px-6 text-xs font-bold text-muted-foreground/80 mt-4 border-t pt-4">
              {WEEKLY_SESSIONS.map((d, i) => (
                <div key={i} className="text-center">
                  <div>{d.day}</div>
                  <div className="text-[10px] text-emerald-500 font-extrabold mt-0.5">{d.growth}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Gráfico 2: Distribución por Especialidades */}
        <motion.div 
          variants={item}
          className="lg:col-span-4 p-6 rounded-3xl border bg-card/65 backdrop-blur-sm shadow-sm flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-black text-foreground">Distribución de Especialidades</h3>
              <p className="text-xs text-muted-foreground font-medium">Áreas terapéuticas preferidas</p>
            </div>

            <div className="space-y-4 pt-2">
              {SPECIALTY_DISTRIBUTION.map((spec, i) => {
                const total = SPECIALTY_DISTRIBUTION.reduce((acc, curr) => acc + curr.count, 0)
                const percentage = Math.round((spec.count / total) * 100)
                
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-foreground/80">{spec.name}</span>
                      <span className="text-muted-foreground">{percentage}% ({spec.count})</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-border/40 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${spec.color}`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 border-t pt-4 flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <div className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-emerald-500" />
              <span>Alta Preferencia</span>
            </div>
            <span>Total: 103 Sesiones</span>
          </div>
        </motion.div>
      </div>

      {/* ── SECCIÓN 4: BOTONES A ENLACES RÁPIDOS ─────────────── */}
      <motion.section variants={item} className="space-y-4">
        <div>
          <h3 className="text-xl font-black text-foreground">Enlaces Rápidos y Accesos Directos</h3>
          <p className="text-sm text-muted-foreground font-medium">Acciones operativas inmediatas para terapeutas y coordinadores</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUICK_ACTIONS.map((action, i) => (
            <Link
              key={i}
              to={action.href}
              className={cn(
                "group flex items-start gap-4 p-5 rounded-2xl border bg-card/60 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02]",
                action.color.split(' ').slice(0, 3).join(' ') // extracts bg-color & border-color for dynamic border highlight
              )}
            >
              <div className={cn(
                "size-12 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110",
                action.color.split(' ').slice(0, 3).join(' ') // apply color styles
              )}>
                <action.icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                  {action.name}
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                </h4>
                <p className="text-xs text-muted-foreground font-semibold mt-1 leading-normal">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>
    </motion.div>
  )
}
