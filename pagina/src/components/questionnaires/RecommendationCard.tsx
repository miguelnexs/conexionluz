import React from 'react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

interface RecommendationCardProps {
  index: number;
  text: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ index, text }) => {
  return (
    <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-indigo-100/50">
        <Lightbulb className="w-4 h-4 text-indigo-500" />
      </div>
      <div className="flex-1 text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
        {text}
      </div>
      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1 opacity-70" />
    </div>
  );
};
