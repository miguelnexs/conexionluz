import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Home, Users, Sparkles, Video, Star, Phone, Calendar, UserRound, MessageCircle, LogIn, Menu, BookOpen, MessageSquareText, Crown } from 'lucide-react';
import WhatsAppFloat from './WhatsAppFloat';
import { cn } from '@/lib/utils';
import { api } from '../api/client';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar
} from '@/components/ui/sidebar';

type PublicLayoutProps = {
  children: React.ReactNode;
  contentClassName?: string;
};

const PublicLayout = ({ children, contentClassName }: PublicLayoutProps) => {
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem('conexionluz:token') : null;
  const isAuthed = Boolean(token);
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    if (isAuthed) {
      api.get<any>('/api/portal/me/').then(res => {
        if (res.ok) {
          setHasSubscription(res.data.hasActiveSubscription);
        }
      });
    }
  }, [isAuthed]);

  const navSections = [
    {
      title: 'Explorar',
      items: [
        { name: 'Inicio', href: '/', icon: Home },
        { name: 'Servicios', href: '/servicios', icon: Sparkles },
        { name: 'Terapeutas', href: '/terapeutas', icon: Users }
      ]
    },
    {
      title: 'Comunidad',
      items: [
        { name: 'Cursos', href: '/cursos', icon: Video },
        { name: 'Conversatorios', href: '/conversatorios', icon: MessageCircle },
        { name: 'Historias', href: '/historias', icon: BookOpen },
        { name: 'Foro', href: '/foro', icon: MessageSquareText },
        { name: 'Testimonios', href: '/testimonios', icon: Star },
      ]
    },
    ...(isAuthed ? [{
      title: 'Mi Cuenta',
      items: [
        { name: 'Mi perfil', href: '/mi-perfil', icon: UserRound },
        { name: 'Mi calendario', href: '/mi-calendario', icon: Calendar },
      ]
    }] : []),
    {
      title: 'Información',
      items: [
        { name: 'Contacto', href: '/contacto', icon: Phone },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-amber-50">
      <SidebarProvider defaultOpen>
        <Sidebar variant="inset" collapsible="offcanvas" className="border-r">
          <SidebarHeader className="p-4">
            <Link to="/" className="flex items-center gap-3 rounded-xl px-2 py-1 hover:bg-sidebar-accent transition-colors">
              <div className="relative">
                <Sun className="h-9 w-9 text-amber-400 animate-pulse-slow" />
                <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-md animate-pulse"></div>
              </div>
              <div className="leading-tight">
                <div className="text-lg font-black tracking-tight text-sidebar-foreground">ConexiónLuz</div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-sidebar-foreground/50">Bienestar Holístico</div>
              </div>
            </Link>
          </SidebarHeader>

          <SidebarContent className="px-2 pb-4">
            {navSections.map((section, idx) => (
              <SidebarGroup key={idx}>
                <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40 mb-1">
                  {section.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton 
                            asChild 
                            isActive={isActive} 
                            tooltip={item.name}
                            className={cn(
                              "transition-all duration-300 rounded-xl h-10 px-4",
                              item.special && !isActive && "text-amber-600 font-bold hover:text-amber-700 hover:bg-amber-50",
                              item.special && isActive && "bg-amber-100 text-amber-700 font-bold"
                            )}
                          >
                            <Link to={item.href} className="flex items-center gap-3">
                              <item.icon className={cn("h-4.5 w-4.5", item.special && "text-amber-500")} />
                              <span className="font-medium">{item.name}</span>
                              {isActive && !item.special && (
                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter className="p-3">
            <Link
              to="/agenda"
              className={cn(
                "w-full bg-gradient-to-r from-primary to-accent text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2"
              )}
            >
              <Calendar className="h-4 w-4" />
              Agendar cita
            </Link>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="bg-transparent">
          <div className="sticky top-0 z-40 border-b border-white/40 bg-white/60 backdrop-blur-md">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <MobileMenuButton />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 hidden sm:inline">Conexión Luz</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isAuthed ? (
                  <>
                    <Link
                      to="/mi-calendario"
                      className="bg-white/80 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-sm"
                    >
                      Mi calendario
                    </Link>
                    <Link
                      to="/mi-perfil"
                      className="bg-white/80 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-sm"
                    >
                      Mi perfil
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="bg-white/80 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-sm inline-flex items-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Iniciar sesión
                  </Link>
                )}
                <Link
                  to="/agenda"
                  className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                >
                  Agendar
                </Link>
              </div>
            </div>
          </div>

          <WhatsAppFloat />

          <div className={cn("px-4 py-8", contentClassName)}>
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

const MobileMenuButton = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="md:hidden inline-flex items-center justify-center rounded-xl border border-white/50 bg-white/70 backdrop-blur-sm px-3 py-2 shadow-sm hover:shadow-md transition-all"
      aria-label="Abrir menú"
    >
      <Menu className="h-5 w-5 text-gray-800" />
    </button>
  );
};

export default PublicLayout;
