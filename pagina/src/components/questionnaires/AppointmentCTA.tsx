import React from 'react';
import { Calendar, Mail, CheckCircle2, HeartHandshake } from 'lucide-react';

interface AppointmentCTAProps {
  ctaData: {
    title: string;
    text: string;
    primaryButton: string;
    secondaryButton: string;
    trustBadges: string[];
  };
  onSchedule: () => void;
  onMoreInfo: () => void;
}

export const AppointmentCTA: React.FC<AppointmentCTAProps> = ({
  ctaData,
  onSchedule,
  onMoreInfo,
}) => {
  return (
    <div className="bg-gradient-to-br from-indigo-900 via-indigo-850 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl border border-indigo-700/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
            <HeartHandshake className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-300 block">
              Acompañamiento Profesional
            </span>
            <h4 className="text-xl md:text-2xl font-black leading-tight text-white">
              {ctaData.title}
            </h4>
          </div>
        </div>

        <p className="text-indigo-100/85 text-xs md:text-sm leading-relaxed font-normal">
          {ctaData.text}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onSchedule}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            {ctaData.primaryButton}
          </button>

          <button
            onClick={onMoreInfo}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-indigo-100 font-bold text-sm border border-white/15 hover:border-white/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            {ctaData.secondaryButton}
          </button>
        </div>

        {/* Trust Badges */}
        <div className="pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {ctaData.trustBadges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[11px] font-medium text-indigo-200/90">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
