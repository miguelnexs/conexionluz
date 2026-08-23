import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sun, Home, Users, Sparkles, Video, Star, Phone, Calendar,
  UserRound, MessageCircle, LogIn, LogOut, Menu, BookOpen, MessageSquareText,
  Bell, Heart, CalendarPlus, ChevronRight, ChevronLeft, X, Info,
  ClipboardList, Dumbbell, NotebookPen, Wind, BarChart2, Activity,
  HelpCircle, FileText, Shield, Newspaper, Building2, Send, UserPlus, Coins
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '../api/client';

type PublicLayoutProps = {
  children: React.ReactNode;
  contentClassName?: string;
};

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

type PortalMe = {
  id: number;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  lumiBalance?: number;
};

const SIDEBAR_W = 248;

const navSections = [
  {
    id: 'comunidad',
    title: 'Comunidad',
    icon: Users,
    color: '#10b981',
    items: [
      { name: 'Cursos', href: '/cursos', icon: Video, desc: 'Aprende a tu ritmo' },
      { name: 'Conversatorios', href: '/conversatorios', icon: MessageCircle, desc: 'Diálogo en grupo' },
      { name: 'Historias', href: '/historias', icon: BookOpen, desc: 'Relatos de sanación' },
      { name: 'Foro', href: '/foro', icon: MessageSquareText, desc: 'Comparte y conecta' },
      { name: 'Testimonios', href: '/testimonios', icon: Star, desc: 'Voces de la comunidad' },
    ],
  },
  {
    id: 'mi-cuenta',
    title: 'Mi Cuenta',
    icon: UserRound,
    color: '#f59e0b',
    requiresAuth: true,
    items: [
      { name: 'Mi perfil', href: '/mi-perfil', icon: UserRound, desc: 'Tu espacio personal' },
      { name: 'Comprar Lumis', href: '/comprar-lumis', icon: Coins, desc: 'Billetera y Recargas COP' },
      { name: 'Mi calendario', href: '/mi-calendario', icon: Calendar, desc: 'Tus sesiones y eventos' },
      { name: 'Mi Progreso', href: '/mi-progreso', icon: BarChart2, desc: 'Sigue tu evolución personal' },
    ],
  },
  {
    id: 'actividades',
    title: 'Actividades',
    icon: Activity,
    color: '#ec4899',
    items: [
      { name: 'Tests de Bienestar', href: '/actividades/tests', icon: ClipboardList, desc: 'Evalúa tu estado emocional' },
      { name: 'Ejercicios Guiados', href: '/actividades/ejercicios', icon: Dumbbell, desc: 'Práctica paso a paso' },
      { name: 'Diario Emocional', href: '/actividades/diario', icon: NotebookPen, desc: 'Registra tu sentir diario' },
      { name: 'Relajación & Mindfulness', href: '/actividades/relajacion', icon: Wind, desc: 'Técnicas para calmar la mente' },
    ],
  },
  {
    id: 'informacion',
    title: 'Información',
    icon: Info,
    color: '#0ea5e9',
    items: [
      { name: 'Servicios', href: '/servicios', icon: Sparkles, desc: 'Nuestros servicios' },
      { name: 'Terapeutas', href: '/terapeutas', icon: Users, desc: 'Conoce al equipo' },
      { name: 'Quiénes somos', href: '/quienes-somos', icon: Building2, desc: 'Nuestra misión y equipo' },
      { name: 'Blog & Artículos', href: '/blog', icon: Newspaper, desc: 'Contenido sobre bienestar' },
      { name: 'Preguntas Frecuentes', href: '/faq', icon: HelpCircle, desc: 'Resolvemos tus dudas' },
      { name: 'Contacto', href: '/contacto', icon: Phone, desc: 'Escríbenos directamente' },
      { name: 'Política de Privacidad', href: '/privacidad', icon: Shield, desc: 'Cómo cuidamos tus datos' },
      { name: 'Términos y Condiciones', href: '/terminos', icon: FileText, desc: 'Condiciones del servicio' },
    ],
  },
];

const PublicLayout = ({ children, contentClassName }: PublicLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('conexionluz:token') : null;
  const isAuthed = Boolean(token);

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [flyoutTop, setFlyoutTop] = useState(80);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileBottomSection, setMobileBottomSection] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showSidebarNotif, setShowSidebarNotif] = useState(false);
  const [me, setMe] = useState<PortalMe | null>(null);

  // ── Live Chat ────────────────────────────────────────────────
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChatMessages = async () => {
    const res = await api.get<any[]>('/api/portal/chat/messages/');
    if (res.ok) {
      setChatMessages(res.data);
    }
  };

  // Poll chat messages when open
  useEffect(() => {
    if (chatOpen) {
      fetchChatMessages();
      const iv = setInterval(() => void fetchChatMessages(), 3000);
      return () => clearInterval(iv);
    }
  }, [chatOpen]);

  // Scroll to bottom when messages change or chat is opened
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatOpen]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setChatInput('');
    setChatLoading(true);

    const res = await api.post<any>('/api/portal/chat/send/', { message: text });
    if (res.ok) {
      setChatMessages(prev => [...prev, res.data]);
    }
    setChatLoading(false);
  };

  // Collapse sidebar state (persisted in localStorage)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('conexionluz:sidebar_collapsed');
      return saved === 'true';
    }
    return false;
  });

  // Track if screen is desktop (>= 1024px)
  const [isDesktop, setIsDesktop] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('conexionluz:sidebar_collapsed', String(next));
      return next;
    });
  };

  const currentSidebarW = isDesktop ? (isCollapsed ? 80 : 248) : 248;

  const handleLogout = () => {
    localStorage.removeItem('conexionluz:token');
    window.location.href = '/login';
  };

  const fetchMe = async () => {
    if (!isAuthed) return;
    const res = await api.get<PortalMe>('/api/portal/me/');
    if (res.ok) setMe(res.data);
  };

  const initials = me
    ? `${me.firstName?.[0] || ''}${me.lastName?.[0] || ''}`.toUpperCase()
    : '';

  const flyoutRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const closeFlyoutTimerRef = useRef<number | null>(null);

  const visibleSections = navSections.filter(s => !s.requiresAuth || isAuthed);

  // ── Close on navigation ──────────────────────────────────────
  useEffect(() => {
    setActiveSection(null);
    setMobileOpen(false);
  }, [location.pathname]);

  // ── Close flyout on outside click ────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        flyoutRef.current && !flyoutRef.current.contains(target) &&
        sidebarRef.current && !sidebarRef.current.contains(target)
      ) {
        setActiveSection(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Notifications ────────────────────────────────────────────
  const fetchNotifications = async () => {
    if (!isAuthed) return;
    const res = await api.get<NotificationItem[]>('/api/portal/notifications/');
    if (res.ok) setNotifications(res.data);
  };

  useEffect(() => {
    const handleLumiEvent = (e: Event) => {
      const customEv = e as CustomEvent;
      if (typeof customEv.detail === 'number') {
        setMe(prev => prev ? { ...prev, lumiBalance: customEv.detail } : null);
        localStorage.setItem('conexionluz:lumi_wallet_balance', String(customEv.detail));
      }
      if (isAuthed) void fetchMe();
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'conexionluz:lumi_wallet_balance' && e.newValue) {
        const val = Number(e.newValue);
        if (!isNaN(val)) {
          setMe(prev => prev ? { ...prev, lumiBalance: val } : null);
        }
      }
    };

    window.addEventListener('lumi-balance-updated', handleLumiEvent);
    window.addEventListener('storage', handleStorageEvent);

    if (isAuthed) {
      void fetchMe();
      void fetchNotifications();
      
      const ivNotif = setInterval(() => void fetchNotifications(), 60000);
      const ivMe = setInterval(() => void fetchMe(), 30000);

      return () => {
        clearInterval(ivNotif);
        clearInterval(ivMe);
        window.removeEventListener('lumi-balance-updated', handleLumiEvent);
        window.removeEventListener('storage', handleStorageEvent);
      };
    }

    return () => {
      window.removeEventListener('lumi-balance-updated', handleLumiEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [isAuthed]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = async () => {
    const res = await api.post('/api/portal/notifications/read/', { all: true });
    if (res.ok) setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    setShowNotifDropdown(false);
    if (!notif.isRead) {
      await api.post('/api/portal/notifications/read/', { ids: [notif.id] });
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    }
    if (location.pathname === notif.targetUrl) window.location.reload();
  };

  const formatTimeAgo = (iso: string) => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (diff < 1) return 'Ahora';
    if (diff < 60) return `Hace ${diff} min`;
    const h = Math.floor(diff / 60);
    if (h < 24) return `Hace ${h} h`;
    return `Hace ${Math.floor(h / 24)} d`;
  };

  const clearCloseFlyoutTimer = () => {
    if (closeFlyoutTimerRef.current) {
      window.clearTimeout(closeFlyoutTimerRef.current);
      closeFlyoutTimerRef.current = null;
    }
  };

  const scheduleCloseFlyout = (delayMs: number) => {
    clearCloseFlyoutTimer();
    closeFlyoutTimerRef.current = window.setTimeout(() => {
      setActiveSection(null);
    }, delayMs);
  };

  const openSectionFlyout = (sectionId: string, anchor: HTMLElement) => {
    const section = visibleSections.find(s => s.id === sectionId);
    if (!section) return;
    const rect = anchor.getBoundingClientRect();
    const cardHeight = section.items.length * 64 + 60;
    const maxTop = window.innerHeight - cardHeight - 16;
    setFlyoutTop(Math.min(Math.max(rect.top, 16), maxTop));
    setActiveSection(sectionId);
  };

  // ── Section click handler ─────────────────────────────────────
  const handleSectionClick = (sectionId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (activeSection === sectionId) {
      setActiveSection(null);
      return;
    }
    openSectionFlyout(sectionId, e.currentTarget);
  };

  const activeNav = visibleSections.find(s => s.id === activeSection) ?? null;

  const isItemActive = (href: string) =>
    location.pathname === href || (href !== '/' && location.pathname.startsWith(href));

  const sectionHasActive = (s: typeof navSections[0]) =>
    s.items.some(item => isItemActive(item.href));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-emerald-50/30">

      {/* ── Mobile overlay ─────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ══════════════════════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════════════════════ */}
      <aside
        ref={sidebarRef}
        style={{ width: mobileOpen ? 248 : currentSidebarW }}
        className={cn(
          'fixed left-0 top-0 bottom-0 z-50 flex flex-col',
          'bg-white border-r border-slate-200/80 shadow-sm',
          'transition-all duration-300 ease-in-out',
          !mobileOpen && '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Toggle Collapse Button (Desktop only) */}
        {isDesktop && (
          <button
            type="button"
            onClick={toggleCollapse}
            className="absolute top-6.5 -right-3 h-6 w-6 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 shadow-md transition-all duration-200 z-50"
            title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        )}

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-200/80">
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setMobileOpen(false)}
          >
            <div className="relative shrink-0">
              <Sun className="h-9 w-9 text-amber-400" />
              <div className="absolute inset-0 bg-amber-400/25 rounded-full blur-lg" />
            </div>
            {(!isCollapsed || mobileOpen) && (
              <div className="leading-tight animate-in fade-in duration-300">
                <div className="text-[15px] font-black tracking-tight text-slate-800">ConexiónLuz</div>
              </div>
            )}
          </Link>
          {(!isCollapsed || mobileOpen) && (
            <button
              className="ml-auto lg:hidden text-slate-400 hover:text-slate-600 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Nav sections */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-0.5">
          {(!isCollapsed || mobileOpen) && (
            <div className="px-3 pt-1 pb-2">
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                Navegación
              </span>
            </div>
          )}

          {visibleSections.map(section => {
            const isOpen = activeSection === section.id;
            const hasActive = sectionHasActive(section);
            const showFull = !isCollapsed || mobileOpen;

            return (
              <div key={section.id}>
                <button
                  onClick={(e) => handleSectionClick(section.id, e)}
                  onMouseEnter={(e) => {
                    if (!isDesktop || mobileOpen) return;
                    clearCloseFlyoutTimer();
                    openSectionFlyout(section.id, e.currentTarget);
                  }}
                  onMouseLeave={() => {
                    if (!isDesktop || mobileOpen) return;
                    scheduleCloseFlyout(180);
                  }}
                  className={cn(
                    'w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 text-left group relative',
                    showFull ? 'gap-3' : 'justify-center',
                    isOpen
                      ? 'bg-slate-100 text-slate-900 shadow-sm'
                      : hasActive
                        ? 'bg-slate-50 text-slate-800'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  )}
                  title={!showFull ? section.title : undefined}
                >
                  {/* Colored left accent when active */}
                  {(isOpen || hasActive) && (
                    <div
                      className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full"
                      style={{ background: section.color }}
                    />
                  )}

                  <div
                    className={cn(
                      'h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200',
                      isOpen ? 'opacity-100' : 'opacity-60 group-hover:opacity-90'
                    )}
                    style={{
                      background: isOpen || hasActive
                        ? `${section.color}18`
                        : 'rgba(0,0,0,0.04)',
                    }}
                  >
                    <section.icon
                      className="h-4 w-4 transition-colors duration-200"
                      style={{ color: isOpen || hasActive ? section.color : undefined }}
                    />
                  </div>

                  {showFull && (
                    <span className="flex-1 text-sm font-bold tracking-tight text-inherit animate-in fade-in duration-300">{section.title}</span>
                  )}

                  {showFull && hasActive && !isOpen && (
                    <div
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ background: section.color }}
                    />
                  )}

                  {showFull && (
                    <ChevronRight
                      className={cn(
                        'h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200',
                        isOpen && 'rotate-90 text-slate-600'
                      )}
                    />
                  )}

                  {!showFull && hasActive && (
                    <div
                      className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full"
                      style={{ background: section.color }}
                    />
                  )}
                </button>

                {/* Mobile accordion (visible only on mobile) */}
                <div
                  className={cn(
                    'lg:hidden overflow-hidden transition-all duration-300 ml-3',
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="py-1 space-y-0.5">
                    {section.items.map(item => {
                      const active = isItemActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                            active
                              ? 'text-slate-900 font-bold bg-slate-100'
                              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-medium'
                          )}
                        >
                          <item.icon className="h-3.5 w-3.5 shrink-0" style={{ color: active ? section.color : undefined }} />
                          <span>{item.name}</span>
                          {active && (
                            <div className="ml-auto h-1.5 w-1.5 rounded-full" style={{ background: section.color }} />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {(() => {
          const showFull = !isCollapsed || mobileOpen;
          return (
            <div className={cn('p-3 border-t border-slate-200/80 bg-slate-50/50 transition-all duration-300 flex flex-col', showFull ? 'space-y-1.5' : 'space-y-3 flex-col items-center')}>
              <Link
                to="/agenda"
                className={cn(
                  'flex items-center justify-center bg-gradient-to-r from-primary to-accent text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300',
                  showFull
                    ? 'w-full gap-2 px-4 py-2.5 rounded-xl text-sm'
                    : 'h-11 w-11 p-0 rounded-full'
                )}
                title="Agendar cita"
              >
                <CalendarPlus className="h-4.5 w-4.5" />
                {showFull && <span className="animate-in fade-in duration-300">Agendar cita</span>}
              </Link>
              {isAuthed ? (
                <div className={cn('pt-1.5 border-t border-slate-200/50 relative w-full flex flex-col', showFull ? 'space-y-2' : 'space-y-3 items-center')}>
                  <div className={cn('flex items-center justify-center', showFull ? 'gap-2 w-full' : 'flex-col gap-3')}>
                    <Link
                      to="/mi-perfil"
                      className={cn(
                        'h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 relative border overflow-hidden shrink-0 shadow-sm hover:scale-[1.1]',
                        isItemActive('/mi-perfil')
                          ? 'bg-slate-100 border-slate-350 text-slate-800 ring-2 ring-slate-100'
                          : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      )}
                      title="Mi perfil"
                    >
                      {me?.profilePictureUrl ? (
                        <img src={me.profilePictureUrl} alt="Perfil" className="h-full w-full object-cover rounded-xl" />
                      ) : initials ? (
                        <span className="text-xs font-black text-slate-600 tracking-tighter">{initials}</span>
                      ) : (
                        <UserRound className="h-5 w-5" />
                      )}
                    </Link>
                    <Link
                      to="/mi-calendario"
                      className={cn(
                        'h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 relative border shrink-0 shadow-sm hover:scale-[1.1]',
                        isItemActive('/mi-calendario')
                          ? 'bg-slate-100 border-slate-350 text-slate-800 ring-2 ring-slate-100'
                          : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      )}
                      title="Mi calendario"
                    >
                      <Calendar className="h-5 w-5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setShowSidebarNotif(!showSidebarNotif)}
                      className={cn(
                        'h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 relative border shrink-0 shadow-sm hover:scale-[1.1]',
                        showSidebarNotif
                          ? 'bg-slate-100 border-slate-350 text-slate-800 ring-2 ring-slate-100'
                          : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      )}
                      title="Notificaciones"
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-1 ring-white animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="h-10 w-10 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-red-500 hover:text-red-700 hover:bg-red-50 hover:scale-[1.1] transition-all duration-200 shrink-0 shadow-sm"
                      title="Cerrar sesión"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                  {showSidebarNotif && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowSidebarNotif(false)} />
                      <div
                        className="absolute z-50 max-h-72 overflow-y-auto bg-white rounded-2xl p-3 border border-slate-200 shadow-xl space-y-2 animate-in slide-in-from-bottom-3 fade-in duration-200"
                        style={{
                          bottom: showFull ? '48px' : '0px',
                          left: showFull ? '0px' : '64px',
                          right: showFull ? '0px' : 'auto',
                          width: showFull ? 'auto' : '260px',
                        }}
                      >
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Notificaciones
                          </span>
                          {unreadCount > 0 && (
                            <button
                              type="button"
                              onClick={() => void handleMarkAllRead()}
                              className="text-[9px] text-primary font-bold hover:underline"
                            >
                              Marcar leídas
                            </button>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          {notifications.length === 0 ? (
                            <div className="py-6 text-center text-xs text-slate-400 font-medium">
                              No hay notificaciones
                            </div>
                          ) : (
                            notifications.map(notif => {
                              let Icon = MessageCircle;
                              if (notif.notificationType.includes('like')) Icon = Heart;
                              if (notif.notificationType === 'new_follower') Icon = UserPlus;
                              if (notif.notificationType === 'new_talk') Icon = Calendar;
                              return (
                                <Link
                                  key={notif.id}
                                  to={notif.targetUrl}
                                  onClick={() => void handleNotificationClick(notif)}
                                  className={cn(
                                    'block p-2.5 rounded-xl text-left transition-colors border border-transparent shadow-sm',
                                    notif.isRead
                                      ? 'bg-slate-50 hover:bg-slate-100 text-slate-605'
                                      : 'bg-primary/5 hover:bg-primary/10 border-primary/10 text-slate-800 font-bold'
                                  )}
                                >
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                      {notif.title}
                                    </span>
                                    <span className="text-[8px] text-slate-400">
                                      {formatTimeAgo(notif.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-[11px] leading-snug mt-1 break-words">
                                    {notif.message}
                                  </p>
                                </Link>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className={cn(
                    "flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 font-semibold text-sm transition-all duration-200",
                    showFull ? "w-full py-2 rounded-xl" : "h-11 w-11 p-0 rounded-full"
                  )}
                  title="Iniciar sesión"
                >
                  <LogIn className="h-4 w-4" />
                  {showFull && <span className="animate-in fade-in duration-300">Iniciar sesión</span>}
                </Link>
              )}
            </div>
          );
        })()}
      </aside>

      {/* ══════════════════════════════════════════════════════════
          FLYOUT CARD (Desktop only)
      ══════════════════════════════════════════════════════════ */}
      {activeNav && (
        <>
          {/* Invisible backdrop */}
          <div
            className="fixed inset-0 z-40 hidden lg:block"
            onClick={() => setActiveSection(null)}
          />

          <div
            ref={flyoutRef}
            className="fixed z-50 hidden lg:block transition-all duration-300"
            style={{
              left: currentSidebarW + 10,
              top: flyoutTop,
            }}
            onMouseEnter={() => clearCloseFlyoutTimer()}
            onMouseLeave={() => scheduleCloseFlyout(180)}
          >
            <div
              className="bg-slate-100 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-left-3 fade-in duration-200"
              style={{ width: 224 }}
            >
              {/* Card header */}
              <div
                className="flex items-center gap-2.5 px-4 py-3.5 bg-slate-200/60"
                style={{ borderBottom: `1px solid rgba(0,0,0,0.08)` }}
              >
                <div
                  className="h-7 w-7 rounded-lg flex items-center justify-center"
                  style={{ background: `${activeNav.color}20` }}
                >
                  <activeNav.icon className="h-3.5 w-3.5" style={{ color: activeNav.color }} />
                </div>
                <span className="font-black text-slate-700 text-sm tracking-tight uppercase text-[11px] tracking-widest">
                  {activeNav.title}
                </span>
              </div>

              {/* Card items */}
              <div className="p-2">
                {activeNav.items.map(item => {
                  const active = isItemActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setActiveSection(null)}
                      className={cn(
                        'flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group',
                        active
                          ? 'bg-white shadow-sm'
                          : 'hover:bg-white/70 hover:shadow-sm'
                      )}
                    >
                      <div
                        className={cn(
                          'h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all duration-150',
                          active ? 'opacity-100' : 'opacity-55 group-hover:opacity-90'
                        )}
                        style={{ background: `${activeNav.color}18` }}
                      >
                        <item.icon className="h-4 w-4" style={{ color: activeNav.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          'text-sm font-bold leading-tight',
                          active ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'
                        )}>
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                          {item.desc}
                        </div>
                      </div>
                      {active && (
                        <div
                          className="h-1.5 w-1.5 rounded-full shrink-0 mt-2.5"
                          style={{ background: activeNav.color }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════════ */}
      <div 
        style={{ paddingLeft: isDesktop ? currentSidebarW : 0 }} 
        className="transition-all duration-300 ease-in-out"
      >

        {/* Top bar */}
        <div className="sticky top-0 z-30 border-b border-white/40 bg-white/70 backdrop-blur-md">
          <div className="px-4 py-3 flex items-center justify-between gap-3">

            {/* Left: Brand */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="relative shrink-0">
                  <Sun className="h-6 w-6 text-amber-400 transition-transform duration-500 group-hover:rotate-180" />
                  <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-md" />
                </div>
                <span className="text-sm font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
                  ConexiónLuz
                </span>
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Lumi Currency Wallet Badge */}
              {isAuthed && (
                <Link
                  to="/comprar-lumis"
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-1.5 rounded-full font-black text-xs shadow-sm hover:shadow-md hover:scale-[1.03] transition-all duration-300 group cursor-pointer shrink-0"
                  title="Tienda de Lumis - Recargar con COP"
                >
                  <div className="relative flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-emerald-600 group-hover:rotate-12 transition-transform" />
                    <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-2xs animate-pulse" />
                  </div>
                  <span className="font-black text-slate-900 text-xs">
                    {typeof me?.lumiBalance === 'number'
                      ? me.lumiBalance
                      : (typeof window !== 'undefined' && localStorage.getItem('conexionluz:lumi_wallet_balance')
                          ? Number(localStorage.getItem('conexionluz:lumi_wallet_balance'))
                          : 0)}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    Lumis
                  </span>
                </Link>
              )}
              {/* Desktop login button */}
              {!isAuthed && (
                <Link
                  to="/login"
                  className="hidden lg:inline-flex bg-white/80 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-sm items-center gap-2 shrink-0"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Iniciar sesión</span>
                </Link>
              )}

              {/* Mobile: login icon if not authed */}
              {!isAuthed && (
                <Link
                  to="/login"
                  className="lg:hidden p-2.5 rounded-full bg-white border border-gray-200/60 text-gray-600 shadow-sm hover:shadow-md transition-all flex items-center justify-center shrink-0"
                  title="Iniciar sesión"
                >
                  <LogIn className="h-4.5 w-4.5" />
                </Link>
              )}

              {/* Header Notifications dropdown button */}
              {isAuthed && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifDropdown(!showNotifDropdown);
                      if (chatOpen) setChatOpen(false);
                    }}
                    className={cn(
                      'p-2.5 rounded-full bg-white border border-gray-200/60 text-gray-600 shadow-sm hover:shadow-md transition-all flex items-center justify-center shrink-0 relative',
                      showNotifDropdown && 'bg-slate-100 ring-2 ring-primary/20'
                    )}
                    title="Notificaciones"
                  >
                    <Bell className="h-4.5 w-4.5 text-gray-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-1 ring-white animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Header Notifications Dropdown */}
                  {showNotifDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifDropdown(false)} />
                      <div className="absolute right-0 mt-2 z-50 w-72 sm:w-80 max-h-80 overflow-y-auto bg-white rounded-2xl p-3 border border-slate-200 shadow-2xl space-y-2 animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                            Notificaciones
                          </span>
                          {unreadCount > 0 && (
                            <button
                              type="button"
                              onClick={() => void handleMarkAllRead()}
                              className="text-[10px] text-primary font-bold hover:underline"
                            >
                              Marcar leídas
                            </button>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          {notifications.length === 0 ? (
                            <div className="py-6 text-center text-xs text-slate-400 font-medium">
                              No hay notificaciones
                            </div>
                          ) : (
                            notifications.map(notif => {
                              let Icon = MessageCircle;
                              if (notif.notificationType.includes('like')) Icon = Heart;
                              if (notif.notificationType === 'new_follower') Icon = UserPlus;
                              if (notif.notificationType === 'new_talk') Icon = Calendar;
                              return (
                                <Link
                                  key={notif.id}
                                  to={notif.targetUrl}
                                  onClick={() => {
                                    setShowNotifDropdown(false);
                                    void handleNotificationClick(notif);
                                  }}
                                  className={cn(
                                    'block p-2.5 rounded-xl text-left transition-colors border border-transparent shadow-sm',
                                    notif.isRead
                                      ? 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                                      : 'bg-primary/5 hover:bg-primary/10 border-primary/10 text-slate-800 font-bold'
                                  )}
                                >
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                      {notif.title}
                                    </span>
                                    <span className="text-[8px] text-slate-400">
                                      {formatTimeAgo(notif.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-[11px] leading-snug mt-1 break-words">
                                    {notif.message}
                                  </p>
                                </Link>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}



              {/* Mobile: profile icon if authed */}
              {isAuthed && (
                <Link
                  to="/mi-perfil"
                  className="h-9 w-9 rounded-full overflow-hidden border-2 border-primary/30 shadow-sm hover:shadow-md transition-all flex items-center justify-center shrink-0 bg-slate-100"
                  title="Mi perfil"
                >
                  {me?.profilePictureUrl ? (
                    <img src={me.profilePictureUrl} alt="Perfil" className="h-full w-full object-cover" />
                  ) : initials ? (
                    <span className="text-xs font-black text-slate-600">{initials}</span>
                  ) : (
                    <UserRound className="h-4 w-4 text-slate-500" />
                  )}
                </Link>
              )}

              {/* Calendar / Agenda button */}
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

        {/* ══════════════════════════════════════════════════════════
            MOBILE BOTTOM NAVIGATION BAR
        ══════════════════════════════════════════════════════════ */}
        {/* Sub-link sheet — slides up when a section is tapped */}
        {mobileBottomSection && (
          <>
            {/* Backdrop */}
            <div
              className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileBottomSection(null)}
            />
            {/* Sheet panel */}
            <div className="lg:hidden fixed bottom-16 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl border-t border-slate-200/80 max-h-[60vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
              {(() => {
                const section = visibleSections.find(s => s.id === mobileBottomSection);
                if (!section) return null;
                return (
                  <div className="p-4">
                    {/* Sheet handle */}
                    <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
                    <div className="flex items-center gap-2 mb-4 px-1">
                      <div
                        className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${section.color}18` }}
                      >
                        <section.icon className="h-4 w-4" style={{ color: section.color }} />
                      </div>
                      <span className="font-black text-slate-800 text-sm uppercase tracking-widest">
                        {section.title}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {section.items.map(item => {
                        const active = isItemActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setMobileBottomSection(null)}
                            className={cn(
                              'flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-150',
                              active
                                ? 'bg-slate-100 text-slate-900 font-bold shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50 font-medium'
                            )}
                          >
                            <div
                              className={cn(
                                'h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-all',
                                active ? 'opacity-100' : 'opacity-60'
                              )}
                              style={{ background: `${section.color}15` }}
                            >
                              <item.icon className="h-4.5 w-4.5" style={{ color: section.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm leading-tight">{item.name}</div>
                              <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                            </div>
                            {active && (
                              <div className="h-2 w-2 rounded-full shrink-0" style={{ background: section.color }} />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </>
        )}

        {/* Bottom Nav Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200/80 shadow-lg">
          <div className="flex items-center justify-around px-2 py-2">
            {/* Home shortcut */}
            <Link
              to="/"
              onClick={() => setMobileBottomSection(null)}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-150 min-w-0',
                isItemActive('/') ? 'text-primary' : 'text-slate-400 hover:text-slate-700'
              )}
            >
              <Home className={cn('h-5 w-5', isItemActive('/') && 'text-primary')} />
              <span className="text-[9px] font-bold uppercase tracking-wider truncate">Inicio</span>
            </Link>

            {/* Dynamic section buttons */}
            {visibleSections.filter(s => s.id !== 'explorar').map(section => {
              const isActive = mobileBottomSection === section.id;
              const hasActive = sectionHasActive(section);
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setMobileBottomSection(isActive ? null : section.id)}
                  className={cn(
                    'flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-150 min-w-0 relative',
                    isActive ? 'text-slate-900' : hasActive ? 'text-slate-700' : 'text-slate-400'
                  )}
                >
                  {/* Active dot */}
                  {hasActive && !isActive && (
                    <span
                      className="absolute top-1.5 right-2.5 h-1.5 w-1.5 rounded-full"
                      style={{ background: section.color }}
                    />
                  )}
                  <div
                    className={cn(
                      'h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-150',
                      isActive ? 'shadow-sm scale-105' : ''
                    )}
                    style={{
                      background: isActive || hasActive ? `${section.color}18` : 'transparent',
                    }}
                  >
                    <section.icon
                      className="h-5 w-5 transition-colors"
                      style={{ color: isActive || hasActive ? section.color : undefined }}
                    />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider truncate">
                    {section.title}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Safe area spacer for iOS */}
          <div className="h-safe-area-inset-bottom" />
        </nav>

        <div className={cn('px-4 py-8 pb-24 lg:pb-8', contentClassName)}>
          {children}
        </div>
      </div>

      {/* Floating Chat Support Widget */}
      <div className="fixed right-4 bottom-20 lg:right-6 lg:bottom-6 z-50 flex flex-col items-end gap-3">
        {/* Chat Window */}
        {chatOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]" onClick={() => setChatOpen(false)} />
            <div className="relative z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-sm h-[480px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-accent px-4 py-3.5 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-sm leading-tight text-white">Chat de Soporte</h3>
                    <p className="text-[10px] text-white/80">En línea - Conexión Luz</p>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors text-white"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
                    <MessageSquareText className="h-8 w-8 mb-2 opacity-50 text-primary" />
                    <p className="text-xs font-medium">¡Hola! ¿En qué podemos ayudarte hoy?</p>
                    <p className="text-[10px] mt-1">Escribe tu mensaje para iniciar una conversación en vivo.</p>
                  </div>
                ) : (
                  chatMessages.map(msg => {
                    const isAdmin = msg.sender === 'admin';
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          'flex flex-col max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-sm',
                          isAdmin
                            ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 mr-auto border border-slate-100 dark:border-slate-700/50 rounded-tl-none'
                            : 'bg-primary text-white ml-auto rounded-tr-none'
                        )}
                      >
                        <span className="text-[10px] opacity-75 font-semibold mb-0.5">
                          {isAdmin ? 'Soporte Conexión Luz' : (msg.senderName || 'Tú')}
                        </span>
                        <p className="whitespace-pre-wrap leading-relaxed break-words">{msg.message}</p>
                        {msg.createdAt && (
                          <span className="text-[8px] opacity-60 text-right mt-1 self-end">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  disabled={chatLoading}
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/50 text-slate-800 dark:text-slate-200"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  className="bg-primary text-white p-2 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:scale-100 disabled:shadow-none flex items-center justify-center shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </>
        )}

          {/* Floating Toggle Button */}
          <button
            type="button"
            onClick={() => {
              setChatOpen(!chatOpen);
              if (showNotifDropdown) setShowNotifDropdown(false);
            }}
            className={cn(
              'p-3.5 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center relative',
              chatOpen && 'ring-4 ring-primary/20'
            )}
            title="Chat de Soporte"
          >
            <MessageSquareText className="h-6 w-6 text-white" />
            {chatMessages.filter(m => m.sender === 'admin' && !m.isRead).length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white animate-pulse">
                {chatMessages.filter(m => m.sender === 'admin' && !m.isRead).length}
              </span>
            )}
          </button>
        </div>
      </div>
  );
};

export default PublicLayout;
