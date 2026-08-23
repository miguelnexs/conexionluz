import React, { useEffect, useState } from 'react';
import { Loader2, BrainCircuit } from 'lucide-react';

interface AnalyzingScreenProps {
  onComplete: () => void;
}

export const AnalyzingScreen: React.FC<AnalyzingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const steps = [
      { target: 20, delay: 400 },
      { target: 40, delay: 900 },
      { target: 70, delay: 1500 },
      { target: 100, delay: 2300 },
    ];

    const timers: Array<ReturnType<typeof setTimeout>> = [];

    steps.forEach(({ target, delay }) => {
      const timer = setTimeout(() => {
        setProgress(target);
        if (target === 100) {
          const finalTimer = setTimeout(() => {
            onComplete();
          }, 400);
          timers.push(finalTimer);
        }
      }, delay);
      timers.push(timer);
    });

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [onComplete]);

  return (
    <div className="p-8 md:p-12 text-center flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-300">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center text-indigo-600 shadow-md">
          <BrainCircuit className="w-10 h-10 animate-pulse text-indigo-600" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
        </div>
      </div>

      <div className="space-y-2 max-w-sm">
        <h3 className="text-xl font-black text-slate-800">Analizando respuestas...</h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">
          Estamos preparando una interpretación personalizada.
        </p>
      </div>

      {/* Animated progress bar */}
      <div className="w-full max-w-xs space-y-2">
        <div 
          className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-bold text-slate-500 block text-right">
          {progress}%
        </span>
      </div>
    </div>
  );
};
