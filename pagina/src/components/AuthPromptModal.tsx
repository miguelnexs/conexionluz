import React from 'react';
import { Lock, LogIn, UserPlus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function isUserLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('conexionluz:token');
  return Boolean(token && token.trim() && token !== 'null' && token !== 'undefined');
}

export function AuthPromptModal({ 
  isOpen, 
  onClose, 
  title = "Contenido Exclusivo para Miembros",
  featureName = "esta función" 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title?: string;
  featureName?: string;
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 text-center animate-in zoom-in-95 duration-300 relative border border-slate-100 space-y-5">
        <button 
          onClick={onClose} 
          className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-500 font-bold text-xs cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8 text-indigo-600" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
            Acceso con Cuenta Gratuita
          </span>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
            {title}
          </h3>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            Para realizar {featureName} y guardar tu historial de bienestar en tu cuenta, por favor inicia sesión o regístrate gratis.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => { onClose(); navigate('/login'); }}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
          >
            <LogIn className="w-4 h-4" /> Iniciar Sesión
          </button>
          
          <button
            onClick={() => { onClose(); navigate('/registro'); }}
            className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-indigo-600" /> Crear Cuenta Gratuita
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 font-semibold">
            ✨ El registro es 100% gratuito y tus datos permanecen protegidos.
          </p>
        </div>
      </div>
    </div>
  );
}
