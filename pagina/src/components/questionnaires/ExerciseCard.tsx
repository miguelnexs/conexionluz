import React, { useState } from 'react';
import { Wind, Eye, Compass, Activity, Heart, Clock, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { ExerciseItem } from '@/utils/RecommendationEngine';

const getExerciseIcon = (iconName: string) => {
  switch (iconName) {
    case 'Wind':
      return Wind;
    case 'Eye':
      return Eye;
    case 'Compass':
      return Compass;
    case 'Activity':
      return Activity;
    case 'Heart':
      return Heart;
    default:
      return Sparkles;
  }
};

interface ExerciseCardProps {
  exercise: ExerciseItem;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  const [expanded, setExpanded] = useState(false);
  const IconComponent = getExerciseIcon(exercise.icon);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/60">
              <IconComponent className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full inline-block mb-0.5">
                {exercise.category}
              </span>
              <h5 className="font-black text-slate-800 text-base leading-snug">
                {exercise.title}
              </h5>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full shrink-0 border border-slate-100">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{exercise.duration}</span>
          </div>
        </div>

        <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium mb-4">
          {exercise.description}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors py-1 cursor-pointer"
        >
          <span>{expanded ? 'Ocultar paso a paso' : 'Ver paso a paso de la práctica'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2.5 animate-in fade-in zoom-in-95 duration-200">
            {exercise.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
