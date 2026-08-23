import React from 'react';
import { ShieldCheck, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { getWarmIntroData } from '@/utils/RecommendationEngine';

interface WarmIntroProps {
  testTitle: string;
  testSubtitle: string;
  testColor: string;
  gradient: string;
  duration: string;
  questionsCount: number;
  onStart: () => void;
  onClose: () => void;
}

export const WarmIntroModal: React.FC<WarmIntroProps> = ({
  testTitle,
  testSubtitle,
  testColor,
  gradient,
  duration,
  questionsCount,
  onStart,
  onClose,
}) => {
  const intro = getWarmIntroData();

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="intro-title"
      >
        {/* Header card banner */}
        <div className="bg-white border-b border-slate-100 px-6 py-6 text-slate-800 relative">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5" /> Evaluación Terapéutica
            </span>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors font-bold text-xs text-slate-600 cursor-pointer"
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          </div>

          <h2 id="intro-title" className="text-2xl font-black text-slate-900 mb-0.5 leading-tight">{testTitle}</h2>
          <p className="text-slate-500 text-sm font-medium">{testSubtitle}</p>
        </div>

        {/* Content body */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="bg-amber-50/80 border border-amber-200/70 rounded-2xl p-4 flex items-start gap-3 text-amber-900">
            <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed font-medium">
              <strong className="block text-amber-950 font-bold mb-0.5">{intro.disclaimer}</strong>
              {intro.purpose}
            </div>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3 text-slate-700 text-sm">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-bold text-xs">
                ⏱
              </div>
              <div>
                <span className="font-bold block text-xs text-slate-500 uppercase tracking-wider">Duración estimada</span>
                <span className="font-semibold text-slate-800">{duration} ({questionsCount} preguntas)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-700 text-sm">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-xs">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold block text-xs text-slate-500 uppercase tracking-wider">Espacio Seguro</span>
                <span className="font-semibold text-slate-800">100% Anónimo y confidencial</span>
              </div>
            </div>
          </div>

          <p className="text-slate-600 text-sm text-center italic font-medium">
            "{intro.reassurance}"
          </p>

          <div className="pt-2">
            <button
              onClick={onStart}
              className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              {intro.buttonText}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
