import React, { type HTMLAttributes } from 'react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '../utils/cn'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { useTheme } from './ThemeProvider'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, Users, BarChart3, Sun, Moon, Languages, Sparkles, Video, Star, LibraryBig, UserRound, CalendarDays, ChevronLeft, ChevronRight, BookOpen, MessageSquareText, Crown, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/logo.png'

type SidebarProps = HTMLAttributes<HTMLDivElement>

export function Sidebar({ className }: SidebarProps): JSX.Element {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { t, i18n } = useTranslation()
  const { logout, username } = useAuth()
  const [isExpanded, setIsExpanded] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }
  
  const sections = [
    {
      title: t('sidebar.section_overview', 'Resumen'),
      links: [
        { name: t('sidebar.control_panel', 'Panel de Control'), href: '/dashboard', icon: LayoutDashboard },
        { name: t('sidebar.analytics', 'Analítica'), href: '/analitica', icon: BarChart3 },
        { name: t('sidebar.calendar', 'Calendario'), href: '/calendario', icon: CalendarDays },
      ]
    },
    {
      title: t('sidebar.section_content', 'Contenido'),
      links: [
        { name: t('sidebar.services', 'Servicios'), href: '/servicios', icon: Sparkles },
        { name: t('sidebar.courses', 'Cursos'), href: '/cursos', icon: LibraryBig },
        { name: t('sidebar.talks', 'Conversatorios'), href: '/conversatorios', icon: Video },
        { name: t('sidebar.testimonials', 'Testimonios'), href: '/testimonios', icon: Star },
        { name: t('sidebar.history', 'Historia'), href: '/historia', icon: BookOpen },
        { name: t('sidebar.forum', 'Foro'), href: '/foro', icon: MessageSquareText },
      ]
    },
    {
      title: t('sidebar.section_management', 'Gestión'),
      links: [
        { name: t('sidebar.patients', 'Pacientes'), href: '/pacientes', icon: UserRound },
        { name: t('sidebar.therapists', 'Terapeutas'), href: '/terapeutas', icon: Users },
        { name: t('sidebar.memberships', 'Membresías'), href: '/membresias', icon: Crown },
      ]
    },
    {
      title: t('sidebar.section_system', 'Sistema'),
      links: [
        { name: t('sidebar.settings', 'Configuración'), href: '/configuracion', icon: Settings },
      ]
    }
  ]

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es'
    i18n.changeLanguage(newLang)
  }

  return (
    <div className={cn("pb-12 border-r bg-card flex flex-col justify-between h-full transition-all duration-300 ease-in-out relative group", isExpanded ? "w-64" : "w-20", className)}>
      <Button 
        variant="secondary" 
        size="icon" 
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "absolute -right-4 top-6 z-10 w-8 h-8 rounded-full shadow-md border opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-sm", 
          !isExpanded && "opacity-100"
        )}
      >
        {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      <ScrollArea className="h-full overflow-hidden">
        <div className="space-y-6 py-6">
          <div className={cn("py-2 transition-all duration-300", isExpanded ? "px-6" : "px-3")}>
            <div className={cn("mb-8 flex items-center transition-all duration-300", isExpanded ? "px-2 gap-3" : "justify-center")}>
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-gradient-to-br from-primary/25 to-accent/10 ring-1 ring-border flex items-center justify-center overflow-hidden shadow-sm">
                <img src={logo} alt="logo" className="h-6 w-6 object-contain" />
              </div>
              <div className={cn("leading-tight overflow-hidden transition-all duration-300", isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0")}>
                <div className="text-sm font-bold tracking-tight whitespace-nowrap text-foreground">{t('sidebar.brand', 'Conexión Luz')}</div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60 whitespace-nowrap">{t('sidebar.brand_subtitle', 'Centro Holístico')}</div>
              </div>
            </div>
            
            <div className="space-y-6">
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  {isExpanded && (
                    <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-2">
                      {section.title}
                    </h3>
                  )}
                  {!isExpanded && <div className="h-px bg-border/50 mx-2 my-4" />}
                  <div className="space-y-1">
                    {section.links.map((link) => (
                      <Button
                        key={link.href}
                        variant={location.pathname === link.href ? "secondary" : "ghost"}
                        className={cn(
                          "justify-start transition-all duration-300 overflow-hidden group/btn", 
                          isExpanded ? "h-11 px-4 w-full rounded-xl" : "h-12 w-12 px-0 mx-auto justify-center rounded-xl"
                        )}
                        asChild
                        title={!isExpanded ? link.name : undefined}
                      >
                        <Link to={link.href} className="flex flex-1 items-center">
                          <link.icon className={cn(
                            "h-5 w-5 shrink-0 transition-all duration-300", 
                            isExpanded ? "mr-3" : "mr-0",
                            location.pathname === link.href ? "text-primary" : "text-muted-foreground group-hover/btn:text-foreground"
                          )} />
                          <span className={cn(
                            "whitespace-nowrap transition-all duration-300 font-medium text-sm", 
                            isExpanded ? "opacity-100 flex-1" : "opacity-0 w-0 hidden",
                            location.pathname === link.href ? "text-foreground" : "text-muted-foreground group-hover/btn:text-foreground"
                          )}>
                            {link.name}
                          </span>
                          {isExpanded && location.pathname === link.href && (
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          )}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
      
      <div className={cn("p-4 border-t bg-muted/5 flex flex-col gap-2 transition-all duration-300", isExpanded ? "items-stretch px-6" : "items-center px-2")}>
        <div className={cn("flex items-center", isExpanded ? "justify-between px-2" : "justify-center")}>
          <span className={cn("text-xs font-semibold text-muted-foreground uppercase tracking-wider transition-all duration-300 overflow-hidden", isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 hidden")}>
            {t('sidebar.theme', 'Tema')}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={cn("rounded-xl transition-all shrink-0 hover:bg-accent", isExpanded ? "h-9 w-9" : "h-12 w-12")}
            title={t('sidebar.theme', 'Tema')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <div className={cn("flex items-center", isExpanded ? "justify-between px-2" : "justify-center")}>
          <span className={cn("text-xs font-semibold text-muted-foreground uppercase tracking-wider transition-all duration-300 overflow-hidden", isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 hidden")}>
            {t('sidebar.language', 'Idioma')}
          </span>
          <Button
            variant="ghost"
            onClick={toggleLanguage}
            className={cn("font-bold transition-all shrink-0 rounded-xl hover:bg-accent", isExpanded ? "h-9 px-3 text-xs" : "h-12 w-12 px-0 justify-center")}
            title={t('sidebar.language', 'Idioma')}
          >
            {!isExpanded ? (
              <Languages className="h-5 w-5 text-muted-foreground" />
            ) : (
              <div className="flex items-center text-muted-foreground">
                <Languages className="mr-2 h-4 w-4" />
                <span className="uppercase tracking-widest font-bold">{i18n.language}</span>
              </div>
            )}
          </Button>
        </div>

        {/* Logout */}
        <div className={cn("flex items-center pt-1 border-t border-border/40", isExpanded ? "justify-between px-2" : "justify-center")}>
          {isExpanded && username && (
            <span className="text-xs text-muted-foreground truncate max-w-[100px]" title={username}>
              {username}
            </span>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shrink-0 rounded-xl",
              isExpanded ? "h-9 px-3 gap-2 text-xs" : "h-12 w-12 px-0 justify-center"
            )}
            title="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
            {isExpanded && <span>Salir</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
