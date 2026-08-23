import React from 'react';
import { Clock } from 'lucide-react';

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  testTitle: string;
  gradient: string;
  onClose: () => void;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  currentStep,
  totalSteps,
  testTitle,
  gradient,
  onClose,
}) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);
  const remainingQuestions = totalSteps - currentStep;
  // Estimate ~15-20 seconds per question remaining
  const remainingSeconds = remainingQuestions * 18;
  const minutes = Math.ceil(remainingSeconds / 60);

  const timeLabel =
    minutes <= 1 ? 'menos de 1 min' : `${minutes} min`;

  return (
    <div className="bg-white border-b border-slate-100 px-6 py-5 text-slate-800 relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">{testTitle}</span>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-xs font-bold text-slate-600 cursor-pointer"
          aria-label="Cerrar cuestionario"
        >
          ✕
        </button>
      </div>

      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
        <div className="flex items-center gap-2">
          <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
            Pregunta {currentStep} de {totalSteps}
          </span>
          <span className="font-black text-indigo-600">{percentage}%</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-slate-200">
          <Clock className="w-3 h-3 shrink-0 text-indigo-500" />
          <span>Tiempo restante: {timeLabel}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progreso del cuestionario ${percentage}%`}
      >
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
