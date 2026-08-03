import React, { useRef, useState, type HTMLAttributes } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '../utils/cn'
import { useTheme } from './ThemeProvider'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Users, BarChart3, Sun, Moon, Languages, Sparkles,
  Video, Star, LibraryBig, UserRound, CalendarDays, ChevronRight,
  ChevronLeft, BookOpen, MessageSquareText, Crown, Settings, LogOut,
  Newspaper, Dumbbell, Wind, ClipboardList,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/logo.png'

type SidebarProps = HTMLAttributes<HTMLDivElement>

const SECTIONS = [
  {
    id: 'resumen',
    title: 'Resumen',
    icon: LayoutDashboard,
    color: '#6366f1',
    links: [
      { name: 'Panel de Control', href: '/dashboard', icon: LayoutDashboard, desc: 'Vista general' },
      { name: 'Analítica', href: '/analitica', icon: BarChart3, desc: 'Métricas y estadísticas' },
      { name: 'Calendario', href: '/calendario', icon: CalendarDays, desc: 'Citas y eventos' },
      { name: 'Chat en Vivo', href: '/chat', icon: MessageSquareText, desc: 'Chat en vivo con visitantes' },
    ],
  },
  {
    id: 'contenido',
    title: 'Contenido',
    icon: Sparkles,
    color: '#10b981',
    links: [
      { name: 'Servicios', href: '/servicios', icon: Sparkles, desc: 'Gestión de servicios' },
      { name: 'Cursos', href: '/cursos', icon: LibraryBig, desc: 'Contenido educativo' },
      { name: 'Conversatorios', href: '/conversatorios', icon: Video, desc: 'Sesiones grupales' },
      { name: 'Testimonios', href: '/testimonios', icon: Star, desc: 'Reseñas de usuarios' },
      { name: 'Historia', href: '/historia', icon: BookOpen, desc: 'Casos y relatos' },
      { name: 'Foro', href: '/foro', icon: MessageSquareText, desc: 'Hilos de comunidad' },
    ],
  },
  {
    id: 'actividades',
    title: 'Autocuidado',
    icon: Dumbbell,
    color: '#8b5cf6',
    links: [
      { name: 'Ejercicios Guiados', href: '/actividades/ejercicios', icon: Dumbbell, desc: 'Gestión de ejercicios' },
      { name: 'Técnicas de Respiración', href: '/actividades/relajacion', icon: Wind, desc: 'Gestión de respiración' },
      { name: 'Tests de Bienestar', href: '/actividades/tests', icon: ClipboardList, desc: 'Gestión de cuestionarios' },
    ],
  },
  {
    id: 'gestion',
    title: 'Gestión',
    icon: Users,
    color: '#f59e0b',
    links: [
      { name: 'Usuarios', href: '/pacientes', icon: UserRound, desc: 'Base de usuarios' },
      { name: 'Terapeutas', href: '/terapeutas', icon: Users, desc: 'Equipo profesional' },
      { name: 'Membresías', href: '/membresias', icon: Crown, desc: 'Planes y suscripciones' },
      { name: 'Publicaciones', href: '/publicaciones', icon: Newspaper, desc: 'Permisos para publicar' },
    ],
  },
  {
    id: 'sistema',
    title: 'Sistema',
    icon: Settings,
    color: '#0ea5e9',
    links: [
      { name: 'Configuración', href: '/configuracion', icon: Settings, desc: 'Ajustes generales' },
    ],
  },
]

// How long to wait before closing flyout after mouse leaves (ms)
const CLOSE_DELAY = 350

export function Sidebar({ className }: SidebarProps): JSX.Element {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { i18n } = useTranslation()
  const { logout, username } = useAuth()

  const [isCollapsed, setIsCollapsed] = useState(true)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [flyoutTop, setFlyoutTop] = useState(80)
  const [flyoutCardH, setFlyoutCardH] = useState(200)

  const sidebarRef = useRef<HTMLDivElement>(null)
  const flyoutRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<number | null>(null)
  // Track which section the flyout belongs to so we don't flicker re-renders
  const activeSectionRef = useRef<string | null>(null)

  // Wider Sidebar widths: 80px when collapsed, 280px when expanded
  const sidebarW = isCollapsed ? 80 : 280

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')
  }

  const clearTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const scheduleClose = () => {
    clearTimer()
    closeTimerRef.current = window.setTimeout(() => {
      setActiveSection(null)
      activeSectionRef.current = null
    }, CLOSE_DELAY)
  }

  const openFlyout = (sectionId: string, anchor: HTMLElement) => {
    clearTimer()
    const section = SECTIONS.find(s => s.id === sectionId)
    if (!section) return
    const cardH = section.links.length * 68 + 60
    setFlyoutCardH(cardH)
    const rect = anchor.getBoundingClientRect()
    const maxTop = window.innerHeight - cardH - 16
    const newTop = Math.min(Math.max(rect.top, 12), maxTop)

    // Only update state if section actually changed (avoids re-render flicker)
    if (activeSectionRef.current !== sectionId) {
      activeSectionRef.current = sectionId
      setFlyoutTop(newTop)
      setActiveSection(sectionId)
    }
  }

  const isActive = (href: string) =>
    location.pathname === href || (href !== '/dashboard' && location.pathname.startsWith(href))

  const sectionHasActive = (s: typeof SECTIONS[0]) => s.links.some(l => isActive(l.href))

  const activeNav = SECTIONS.find(s => s.id === activeSection) ?? null

  return (
    <>
      {/* ── Sidebar ───────────────────────────────────────────── */}
      <div
        ref={sidebarRef}
        style={{ width: sidebarW, zIndex: 45 }}
        className={cn(
          'h-full flex flex-col shrink-0 relative',
          'bg-card border-r transition-all duration-300 ease-in-out',
          className
        )}
      >
        {/* Toggle button */}
        <button
          type="button"
          onClick={() => { setIsCollapsed(v => !v); setActiveSection(null); activeSectionRef.current = null }}
          className="absolute -right-3.5 top-6 h-7 w-7 rounded-full border bg-card shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all z-40"
          title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Logo */}
        <div className={cn('flex items-center gap-3 border-b px-4 py-5 shrink-0', !isCollapsed && 'px-6')}>
          <div className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 ring-1 ring-border flex items-center justify-center overflow-hidden shadow-sm">
            <img src={logo} alt="logo" className="h-6 w-6 object-contain" />
          </div>
          {!isCollapsed && (
            <div className="leading-tight overflow-hidden animate-in fade-in duration-200">
              <div className="text-base font-extrabold tracking-tight whitespace-nowrap text-foreground">Conexión Luz</div>
              <div className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/60 whitespace-nowrap">Escuela de Conciencia</div>
            </div>
          )}
        </div>

        {/* Nav sections */}
        <nav className="flex-1 py-4 px-2.5 overflow-y-auto overflow-x-hidden space-y-1">
          {!isCollapsed && (
            <div className="px-3.5 pt-1 pb-2">
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground/50">Navegación</span>
            </div>
          )}

          {SECTIONS.map(section => {
            const isOpen = activeSection === section.id
            const hasActive = sectionHasActive(section)
            const showLabel = !isCollapsed

            return (
              <button
                key={section.id}
                type="button"
                onMouseEnter={e => openFlyout(section.id, e.currentTarget)}
                onMouseLeave={scheduleClose}
                onClick={e => {
                  if (section.links.length > 0) {
                    navigate(section.links[0].href)
                  }
                  if (activeSection === section.id) {
                    setActiveSection(null)
                    activeSectionRef.current = null
                  } else {
                    openFlyout(section.id, e.currentTarget)
                  }
                }}
                className={cn(
                  'w-full flex items-center rounded-2xl transition-all duration-200 text-left group relative',
                  showLabel ? 'gap-4 px-3.5 py-3.5' : 'justify-center px-0 py-3.5',
                  isOpen
                    ? 'bg-muted text-foreground shadow-sm'
                    : hasActive
                      ? 'bg-muted/50 text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
                title={!showLabel ? section.title : undefined}
              >
                {/* Active left accent */}
                {(isOpen || hasActive) && (
                  <div
                    className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full"
                    style={{ background: section.color }}
                  />
                )}

                {/* Icon */}
                <div
                  className={cn(
                    'h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200',
                    isOpen ? 'opacity-100' : 'opacity-60 group-hover:opacity-90'
                  )}
                  style={{
                    background: isOpen || hasActive
                      ? `${section.color}18`
                      : 'rgba(128,128,128,0.08)',
                  }}
                >
                  <section.icon
                    className="h-5 w-5"
                    style={{ color: isOpen || hasActive ? section.color : undefined }}
                  />
                </div>

                {showLabel && (
                  <span className="flex-1 text-base font-extrabold tracking-tight animate-in fade-in duration-200 truncate">
                    {section.title}
                  </span>
                )}

                {showLabel && hasActive && !isOpen && (
                  <div className="h-2 w-2 rounded-full shrink-0" style={{ background: section.color }} />
                )}

                {showLabel && (
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform duration-200',
                      isOpen && 'rotate-90 text-muted-foreground'
                    )}
                  />
                )}

                {/* Dot when collapsed + active */}
                {!showLabel && hasActive && (
                  <div
                    className="absolute bottom-2 right-2 h-2 w-2 rounded-full"
                    style={{ background: section.color }}
                  />
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className={cn(
          'p-4 border-t shrink-0 flex transition-all duration-300',
          isCollapsed ? 'flex-col items-center gap-2.5' : 'flex-col gap-2'
        )}>
          {/* Theme toggle */}
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            className={cn(
              'flex items-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200',
              isCollapsed ? 'h-11 w-11 justify-center' : 'h-11 px-4 gap-3 w-full'
            )}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 shrink-0" /> : <Moon className="h-5 w-5 shrink-0" />}
            {!isCollapsed && <span className="text-sm font-bold animate-in fade-in duration-200">Tema</span>}
          </button>

          {/* Language toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            title="Idioma"
            className={cn(
              'flex items-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200',
              isCollapsed ? 'h-11 w-11 justify-center' : 'h-11 px-4 gap-3 w-full'
            )}
          >
            <Languages className="h-5 w-5 shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-bold uppercase tracking-widest animate-in fade-in duration-200">
                {i18n.language}
              </span>
            )}
          </button>

          {/* Divider + Logout */}
          <div className={cn(
            'pt-3 border-t border-border/40 flex transition-all duration-300',
            isCollapsed ? 'flex-col items-center gap-2.5' : 'items-center justify-between px-1'
          )}>
            {!isCollapsed && username && (
              <span className="text-sm font-bold text-muted-foreground truncate max-w-[150px]" title={username}>
                {username}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              title="Cerrar sesión"
              className={cn(
                'flex items-center rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200',
                isCollapsed ? 'h-11 w-11 justify-center' : 'h-11 px-4 gap-3'
              )}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="text-sm font-bold animate-in fade-in duration-200">Salir</span>}
            </button>
          </div>
        </div>
      </div>

      {/* ── Flyout (outside sidebar DOM so no layout interference) ── */}
      {activeNav && (
        <>
          {/* Invisible backdrop to catch outside clicks */}
          <div className="fixed inset-0 z-40" onClick={() => { setActiveSection(null); activeSectionRef.current = null }} />

          {/*
            Bridge: fills the gap between sidebar edge and flyout card
            so the mouse never leaves a hot-zone when crossing
          */}
          <div
            className="fixed"
            style={{
              left: sidebarW - 4,
              top: flyoutTop - 8,
              width: 24,
              height: flyoutCardH + 16,
              zIndex: 49,
            }}
            onMouseEnter={clearTimer}
            onMouseLeave={scheduleClose}
          />

          <div
            ref={flyoutRef}
            className="fixed z-50"
            style={{ left: sidebarW + 6, top: flyoutTop }}
            onMouseEnter={clearTimer}
            onMouseLeave={scheduleClose}
          >
            <div
              className="bg-muted rounded-2xl shadow-2xl border overflow-hidden animate-in slide-in-from-left-2 fade-in duration-150"
              style={{ width: 280 }}
            >
              {/* Header */}
              <div
                className="flex items-center gap-3 px-4 py-3.5 border-b border-border/50"
                style={{ background: `${activeNav.color}10` }}
              >
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${activeNav.color}20` }}
                >
                  <activeNav.icon className="h-4 w-4" style={{ color: activeNav.color }} />
                </div>
                <span className="text-[12px] font-black uppercase tracking-widest text-foreground/70">
                  {activeNav.title}
                </span>
              </div>

              {/* Links */}
              <div className="p-2 space-y-0.5">
                {activeNav.links.map(link => {
                  const active = isActive(link.href)
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => { setActiveSection(null); activeSectionRef.current = null }}
                      className={cn(
                        'flex items-start gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-150 group',
                        active ? 'bg-card shadow-sm' : 'hover:bg-card/70 hover:shadow-sm'
                      )}
                    >
                      <div
                        className={cn(
                          'h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                          active ? 'opacity-100' : 'opacity-50 group-hover:opacity-90'
                        )}
                        style={{ background: `${activeNav.color}18` }}
                      >
                        <link.icon className="h-4 w-4" style={{ color: activeNav.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          'text-base font-bold leading-tight truncate',
                          active ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                        )}>
                          {link.name}
                        </div>
                        <div className="text-xs text-muted-foreground/60 mt-0.5 leading-tight truncate">
                          {link.desc}
                        </div>
                      </div>
                      {active && (
                        <div
                          className="h-2 w-2 rounded-full shrink-0 mt-2.5"
                          style={{ background: activeNav.color }}
                        />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
