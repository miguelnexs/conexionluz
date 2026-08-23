import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface MotivationMessageProps {
  message: string;
  onContinue: () => void;
}

export const MotivationMessage: React.FC<MotivationMessageProps> = ({
  message,
  onContinue,
}) => {
  return (
    <div className="p-8 text-center flex flex-col items-center justify-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
        <Sparkles className="w-8 h-8 animate-pulse text-indigo-500" />
      </div>

      <div className="space-y-2 max-w-sm">
        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">
          <Heart className="w-3 h-3 text-indigo-500 fill-indigo-500" /> Pausa de Reflexión
        </span>
        <p className="text-slate-800 font-bold text-lg leading-snug">
          "{message}"
        </p>
      </div>

      <button
        onClick={onContinue}
        className="mt-2 py-3 px-6 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 active:scale-95 transition-all shadow-md cursor-pointer"
      >
        Continuar cuestionario →
      </button>
    </div>
  );
};
