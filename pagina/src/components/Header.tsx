
import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const [lumiBalance, setLumiBalance] = useState<number>(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('conexionluz:lumi_wallet_balance') : null;
    return cached ? Number(cached) : 0;
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    const checkCachedBalance = () => {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('conexionluz:lumi_wallet_balance');
        if (cached) {
          const val = Number(cached);
          if (!isNaN(val)) {
            setLumiBalance(prev => (prev !== val ? val : prev));
          }
        }
      }
    };

    const handleLumiUpdate = (e: Event) => {
      const customEv = e as CustomEvent;
      if (typeof customEv.detail === 'number') {
        setLumiBalance(customEv.detail);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'conexionluz:lumi_wallet_balance' && e.newValue) {
        const val = Number(e.newValue);
        if (!isNaN(val)) {
          setLumiBalance(val);
        }
      }
    };

    window.addEventListener('lumi-balance-updated', handleLumiUpdate);
    window.addEventListener('storage', handleStorage);

    const interval = setInterval(checkCachedBalance, 4000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('lumi-balance-updated', handleLumiUpdate);
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Terapeutas', href: '/terapeutas' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Cursos', href: '/cursos' },
    { name: 'Mi perfil', href: '/mi-perfil' },
    { name: 'Conversatorios', href: '/conversatorios' },
    { name: 'Historias', href: '/historias' },
    { name: 'Foro', href: '/foro' },
    { name: 'Testimonios', href: '/testimonios' },
    { name: 'Contacto', href: '/contacto' },
    { name: 'Membresía', href: '/membresia', special: true }
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'glass-effect shadow-lg' : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Sun className="h-8 w-8 text-amber-400 animate-pulse-slow group-hover:rotate-180 transition-transform duration-500" />
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-md animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ConexiónLuz
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative transition-colors duration-300 group ${
                  isActiveRoute(item.href) 
                    ? (item.special ? 'text-amber-600 font-bold' : 'text-primary font-semibold')
                    : (item.special ? 'text-amber-500 font-bold hover:text-amber-600' : 'text-gray-700 hover:text-primary')
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                  item.special ? 'bg-amber-400' : 'bg-gradient-to-r from-primary to-accent'
                } ${
                  isActiveRoute(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
          </div>

          {/* CTA Button & Lumi Wallet */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/comprar-lumis"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-1.5 rounded-full font-black text-xs shadow-sm hover:shadow-md hover:scale-[1.03] transition-all duration-300 group cursor-pointer"
              title="Tienda de Lumis - Recargar con COP"
            >
              <div className="relative flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-emerald-600 group-hover:rotate-12 transition-transform" />
                <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-2xs animate-pulse" />
              </div>
              <span className="font-black text-slate-900 text-xs">{lumiBalance}</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Lumis</span>
            </Link>

            <Link
              to="/agenda"
              className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm"
            >
              Agendar Cita
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 glass-effect rounded-lg p-4 animate-fadeInUp">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block py-3 transition-colors duration-300 ${
                  isActiveRoute(item.href) 
                    ? (item.special ? 'text-amber-600 font-bold' : 'text-primary font-semibold')
                    : (item.special ? 'text-amber-500 font-bold' : 'text-gray-700 hover:text-primary')
                }`}
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/agenda"
              className="block mt-4 bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-full font-semibold text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Agendar Cita
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
