import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Home, Users, Sparkles, Video, Star, Phone, Calendar, UserRound, MessageCircle, LogIn, Menu, BookOpen, MessageSquareText, Crown, Bell, Heart, CalendarPlus } from 'lucide-react';
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

  type NotificationItem = {
    id: number;
    notificationType: string;
    senderName: string;
    title: string;
    message: string;
    targetUrl: string;
    isRead: boolean;
    createdAt: string;
  };

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const fetchNotifications = async () => {
    if (!isAuthed) return;
    const res = await api.get<NotificationItem[]>('/api/portal/notifications/');
    if (res.ok) {
      setNotifications(res.data);
    }
  };

  useEffect(() => {
    if (isAuthed) {
      api.get<any>('/api/portal/me/').then(res => {
        if (res.ok) {
          setHasSubscription(res.data.hasActiveSubscription);
        }
      });
      void fetchNotifications();
      const interval = setInterval(() => {
        void fetchNotifications();
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [isAuthed]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = async () => {
    const res = await api.post('/api/portal/notifications/read/', { all: true });
    if (res.ok) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    setShowNotifDropdown(false);
    if (!notif.isRead) {
      await api.post('/api/portal/notifications/read/', { ids: [notif.id] });
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    }
    const currentPath = location.pathname;
    const targetPath = notif.targetUrl;
    if (currentPath === targetPath) {
      window.location.reload();
    }
  };

  const formatTimeAgo = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours} h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} d`;
  };

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
        <Sidebar variant="inset" collapsible="icon" className="border-r">
          <SidebarHeader className="p-4">
            <Link to="/" className="flex items-center gap-3 rounded-xl px-2 py-1 hover:bg-sidebar-accent transition-colors">
              <div className="relative">
                <Sun className="h-9 w-9 text-amber-400 animate-pulse-slow" />
                <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-md animate-pulse"></div>
              </div>
              <div className="leading-tight group-data-[collapsible=icon]:hidden">
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
                              <span className="font-medium group-data-[collapsible=icon]:hidden">{item.name}</span>
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
              <span className="group-data-[collapsible=icon]:hidden">Agendar cita</span>
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
                    {/* Campana de Notificaciones */}
                    <div className="relative shrink-0">
                      <button
                        onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                        className={cn(
                          "relative p-2.5 rounded-full text-gray-600 hover:bg-white hover:shadow-sm hover:text-primary transition-all duration-300 border border-transparent",
                          showNotifDropdown && "bg-white shadow-sm border-gray-100 text-primary"
                        )}
                        aria-label="Notificaciones"
                      >
                        <Bell className="h-4.5 w-4.5" />
                        {unreadCount > 0 && (
                          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white">
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      {showNotifDropdown && (
                        <>
                          <div 
                            className="fixed inset-0 z-40 bg-transparent" 
                            onClick={() => setShowNotifDropdown(false)} 
                          />
                          <div className="fixed top-14 left-4 right-4 sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:w-96 mt-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 py-3 z-50">
                            <div className="flex items-center justify-between px-4 pb-2.5 border-b border-gray-100">
                              <span className="font-black text-gray-800 text-sm">Notificaciones</span>
                              {unreadCount > 0 && (
                                <button
                                  onClick={() => void handleMarkAllRead()}
                                  className="text-[11px] text-primary font-bold hover:underline"
                                >
                                  Marcar leídas
                                </button>
                              )}
                            </div>
                            <div className="max-h-80 overflow-y-auto mt-2">
                              {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                                  <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3 border border-gray-100/50">
                                    <Bell className="h-6 w-6 text-gray-300" />
                                  </div>
                                  <p className="text-xs text-gray-400 font-bold">No tienes notificaciones aún</p>
                                </div>
                              ) : (
                                notifications.map((notif) => {
                                  const Icon = notif.notificationType.includes('like') ? Heart : MessageCircle;
                                  const iconClass = notif.notificationType.includes('like')
                                    ? 'text-rose-500 fill-rose-500 bg-rose-50'
                                    : 'text-primary bg-primary/5';
                                  return (
                                    <Link
                                      key={notif.id}
                                      to={notif.targetUrl}
                                      onClick={() => void handleNotificationClick(notif)}
                                      className={cn(
                                        "flex items-start gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors border-b border-gray-50/50 last:border-b-0",
                                        !notif.isRead && "bg-primary/5"
                                      )}
                                    >
                                      <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border border-gray-100/30", iconClass)}>
                                        <Icon className="h-4 w-4" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                            {notif.title}
                                          </p>
                                          <span className="text-[9px] font-bold text-gray-400 shrink-0">
                                            {formatTimeAgo(notif.createdAt)}
                                          </span>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1 leading-relaxed break-words">
                                          {notif.message}
                                        </p>
                                      </div>
                                      {!notif.isRead && (
                                        <div className="h-2 w-2 rounded-full bg-primary shrink-0 self-center" />
                                      )}
                                    </Link>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <Link
                      to="/mi-calendario"
                      className="p-2.5 rounded-full text-gray-600 hover:bg-white hover:shadow-sm hover:text-primary transition-all duration-300 border border-transparent shrink-0"
                      title="Mi calendario"
                    >
                      <Calendar className="h-4.5 w-4.5" />
                    </Link>
                    <Link
                      to="/mi-perfil"
                      className="p-2.5 rounded-full text-gray-600 hover:bg-white hover:shadow-sm hover:text-primary transition-all duration-300 border border-transparent shrink-0"
                      title="Mi perfil"
                    >
                      <UserRound className="h-4.5 w-4.5" />
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="bg-white/80 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-sm inline-flex items-center gap-2 shrink-0"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden xs:inline">Iniciar sesión</span>
                  </Link>
                )}
                <Link
                  to="/agenda"
                  className="p-2.5 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center shrink-0"
                  title="Agendar cita"
                >
                  <CalendarPlus className="h-4.5 w-4.5" />
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
      className="inline-flex items-center justify-center rounded-xl border border-white/50 bg-white/70 backdrop-blur-sm px-3 py-2 shadow-sm hover:shadow-md transition-all"
      aria-label="Abrir menú"
    >
      <Menu className="h-5 w-5 text-gray-800" />
    </button>
  );
};

export default PublicLayout;
