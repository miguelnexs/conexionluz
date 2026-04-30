import React, { type HTMLAttributes } from 'react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../utils/cn'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { useTheme } from './ThemeProvider'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, Users, BarChart3, Sun, Moon, Languages, Sparkles, Video, Star, LibraryBig, UserRound, CalendarDays, ChevronLeft, ChevronRight, BookOpen, MessageSquareText } from 'lucide-react'
import logo from '../assets/logo.png'

type SidebarProps = HTMLAttributes<HTMLDivElement>

export function Sidebar({ className }: SidebarProps): JSX.Element {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const { t, i18n } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(true)
  
  const links = [
    { name: t('sidebar.control_panel', 'Panel de Control'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('sidebar.analytics', 'Analítica'), href: '/analitica', icon: BarChart3 },
    { name: t('sidebar.therapists', 'Terapeutas'), href: '/terapeutas', icon: Users },
    { name: t('sidebar.patients', 'Pacientes'), href: '/pacientes', icon: UserRound },
    { name: t('sidebar.calendar', 'Calendario'), href: '/calendario', icon: CalendarDays },
    { name: t('sidebar.services', 'Servicios'), href: '/servicios', icon: Sparkles },
    { name: t('sidebar.courses', 'Cursos'), href: '/cursos', icon: LibraryBig },
    { name: t('sidebar.talks', 'Conversatorios'), href: '/conversatorios', icon: Video },
    { name: t('sidebar.testimonials', 'Testimonios'), href: '/testimonios', icon: Star },
    { name: t('sidebar.history', 'Historia'), href: '/historia', icon: BookOpen },
    { name: t('sidebar.forum', 'Foro'), href: '/foro', icon: MessageSquareText },
  ]

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es'
    i18n.changeLanguage(newLang)
  }

  return (
    <div className={cn("pb-12 border-r bg-card flex flex-col justify-between h-full transition-all duration-300 ease-in-out relative group", isExpanded ? "w-64" : "w-16", className)}>
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
        <div className="space-y-4 py-4">
          <div className={cn("py-2", isExpanded ? "px-4" : "px-2")}>
            <div className={cn("mb-6 flex items-center transition-all duration-300", isExpanded ? "px-2 gap-3" : "justify-center")}>
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-gradient-to-br from-primary/25 to-accent/10 ring-1 ring-border flex items-center justify-center overflow-hidden">
                <img src={logo} alt="logo" className="h-6 w-6 object-contain" />
              </div>
              <div className={cn("leading-tight overflow-hidden transition-all duration-300", isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0")}>
                <div className="text-sm font-semibold tracking-tight whitespace-nowrap">{t('sidebar.brand', 'Conexión Luz')}</div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">{t('sidebar.brand_subtitle', 'Centro Holístico')}</div>
              </div>
            </div>
            
            <div className="space-y-1">
              {links.map((link) => (
                <Button
                  key={link.href}
                  variant={location.pathname === link.href ? "secondary" : "ghost"}
                  className={cn(
                    "justify-start transition-all duration-300 overflow-hidden", 
                    isExpanded ? "h-11 px-4 w-full rounded-xl" : "h-11 w-11 px-0 mx-auto justify-center rounded-xl"
                  )}
                  asChild
                  title={!isExpanded ? link.name : undefined}
                >
                  <Link to={link.href} className="flex flex-1 items-center">
                    <link.icon className={cn("h-5 w-5 shrink-0 transition-all duration-300", isExpanded ? "mr-3" : "mr-0")} />
                    <span className={cn("whitespace-nowrap transition-all duration-300", isExpanded ? "opacity-100 flex-1" : "opacity-0 w-0 hidden")}>
                      {link.name}
                    </span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
      
      <div className={cn("p-4 border-t flex flex-col gap-2 transition-all duration-300", isExpanded ? "items-stretch" : "items-center px-1")}>
        <div className={cn("flex items-center", isExpanded ? "justify-between px-2" : "justify-center")}>
          <span className={cn("text-sm font-medium transition-all duration-300 overflow-hidden", isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 hidden")}>
            {t('sidebar.theme', 'Tema')}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={cn("rounded-full transition-all shrink-0", isExpanded ? "h-8 w-8" : "h-10 w-10")}
            title={t('sidebar.theme', 'Tema')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <div className={cn("flex items-center", isExpanded ? "justify-between px-2" : "justify-center")}>
          <span className={cn("text-sm font-medium transition-all duration-300 overflow-hidden", isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 hidden")}>
            {t('sidebar.language', 'Idioma')}
          </span>
          <Button
            variant="ghost"
            onClick={toggleLanguage}
            className={cn("font-bold transition-all shrink-0", isExpanded ? "h-8 px-2 text-xs" : "h-10 w-10 px-0 justify-center")}
            title={t('sidebar.language', 'Idioma')}
          >
            {!isExpanded ? (
              <Languages className="h-5 w-5" />
            ) : (
              <div className="flex items-center">
                <Languages className="mr-2 h-4 w-4" />
                {i18n.language.toUpperCase()}
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
