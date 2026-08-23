import React from 'react';
import { Sparkles, ShieldCheck, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LumiConfirmUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemTitle: string;
  itemCategory: string;
  lumiPrice: number;
  userBalance: number;
  loading?: boolean;
}

export const LumiConfirmUnlockModal: React.FC<LumiConfirmUnlockModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemTitle,
  itemCategory,
  lumiPrice,
  userBalance,
  loading = false,
}) => {
  if (!isOpen) return null;

  const hasEnough = userBalance >= lumiPrice;
  const balanceAfter = userBalance - lumiPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header Icon */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <Sparkles className="h-6 w-6 text-emerald-600 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
                {itemCategory}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">¿Confirmar Desbloqueo?</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Details */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-700 leading-relaxed">
            ¿Estás seguro de que deseas utilizar <strong className="text-slate-900 font-black">✨ {lumiPrice} Lumis</strong> para desbloquear de forma permanente:
          </p>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Contenido Elegido</span>
            <h4 className="text-base font-black text-slate-900 leading-tight">{itemTitle}</h4>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 pt-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Acceso Permanente e Inlimitado a tu Cuenta
            </span>
          </div>
        </div>

        {/* Balance Breakdown */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Tu Saldo Actual:</span>
            <span className="font-black text-slate-900">✨ {userBalance} Lumis</span>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Costo de Desbloqueo:</span>
            <span className="font-black text-emerald-700">- ✨ {lumiPrice} Lumis</span>
          </div>

          <div className="border-t border-emerald-200/60 pt-2 flex items-center justify-between text-xs font-extrabold text-slate-900">
            <span>Saldo Restante tras Compra:</span>
            <span className={hasEnough ? 'text-slate-900 font-black' : 'text-rose-600 font-black'}>
              ✨ {hasEnough ? balanceAfter : 'Saldo Insuficiente'} Lumis
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {!hasEnough ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl text-xs font-medium">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>Te faltan {lumiPrice - userBalance} Lumis para completar este desbloqueo.</span>
            </div>

            <Link
              to="/comprar-lumis"
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-black text-xs py-3.5 rounded-2xl shadow-md transition-all"
            >
              <span>Recargar Lumis en la Tienda</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3.5 rounded-2xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-black text-xs py-3.5 rounded-2xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? "Desbloqueando..." : `Confirmar (✨ ${lumiPrice} Lumis)`}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
