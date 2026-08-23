import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Heart, Sparkles, Compass, Dumbbell } from 'lucide-react';
import { EvaluationResult } from '@/utils/RecommendationEngine';
import { RecommendationCard } from './RecommendationCard';
import { ExerciseCard } from './ExerciseCard';
import { AppointmentCTA } from './AppointmentCTA';
import { LeadMagnetModal } from './LeadMagnetModal';
import AWEDailyWidget from '../awe/AWEDailyWidget';

interface ResultSummaryProps {
  result: EvaluationResult;
  onRepeat: () => void;
  onClose: () => void;
  onSchedule: () => void;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  result,
  onRepeat,
  onClose,
  onSchedule,
}) => {
  const [showLeadModal, setShowLeadModal] = useState(false);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
      >
        {/* Fixed Header */}
        <div className="bg-white px-6 py-4 text-slate-800 flex items-center justify-between shrink-0 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            <span className="font-black text-sm tracking-wide text-slate-900">Resultados de Evaluación</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-xs font-bold text-slate-600 cursor-pointer"
            aria-label="Cerrar resultados"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto text-slate-800">
          
          {/* Main Level Card */}
          <div className="text-center bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border shadow-xs" style={{ background: `${result.color}15`, color: result.color, borderColor: `${result.color}30` }}>
              <CheckCircle2 className="w-4 h-4" /> Tu resultado
            </div>

            <h3 id="result-title" className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
              {result.label}
            </h3>

            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 mb-4">
              <span>Puntuación: <strong>{result.totalScore}</strong> de {result.maxScore}</span>
              <span>•</span>
              <span>{result.testName}</span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto bg-white p-4 rounded-2xl border border-slate-100 shadow-xs font-medium">
              "{result.interpretation}"
            </p>
          </div>

          {/* AWE Engine Synchronized Wisdom Capsule */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h4 className="font-black text-lg text-slate-900">
                Cápsula AWE Sintonizada a tu Estado Emocional
              </h4>
            </div>
            <AWEDailyWidget className="shadow-lg rounded-3xl" />
          </div>

          {/* 3 Tailored Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h4 className="font-black text-lg text-slate-900">
                Recomendaciones personalizadas para ti
              </h4>
            </div>

            <div className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <RecommendationCard key={index} index={index} text={rec} />
              ))}
            </div>
          </div>

          {/* Practical Exercises Section */}
          {result.exercises && result.exercises.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-indigo-600" />
                <h4 className="font-black text-lg text-slate-900">
                  Ejercicios prácticos de bienestar recomendados
                </h4>
              </div>

              <div className="space-y-4">
                {result.exercises.map((ex, index) => (
                  <ExerciseCard key={index} exercise={ex} />
                ))}
              </div>
            </div>
          )}

          {/* Message of Hope Block */}
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-3xl border border-indigo-100/70 text-indigo-950 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                <Heart className="w-4 h-4 fill-indigo-400 text-indigo-500" /> Un mensaje de aliento
              </div>
              {result.hopeMessage.author && (
                <span className="text-[11px] font-bold text-indigo-700 bg-white/80 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  📜 {result.hopeMessage.author}
                </span>
              )}
            </div>

            {result.hopeMessage.quote && (
              <blockquote className="border-l-3 border-indigo-500 pl-3 py-0.5 italic font-serif text-base md:text-lg font-bold text-slate-800">
                "{result.hopeMessage.quote}"
              </blockquote>
            )}

            <div className="space-y-1">
              <h4 className="text-base md:text-lg font-black text-indigo-950">
                "{result.hopeMessage.title}"
              </h4>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                {result.hopeMessage.text}
              </p>
            </div>
          </div>

          {/* Appointment Conversion CTA */}
          <AppointmentCTA
            ctaData={result.cta}
            onSchedule={onSchedule}
            onMoreInfo={() => setShowLeadModal(true)}
          />

          {/* Final Gratitude Message */}
          <div className="text-center pt-2 pb-4">
            <p className="text-xs md:text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed italic">
              "{result.finalMessage}"
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onRepeat}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Repetir cuestionario
            </button>

            <button
              onClick={onClose}
              className="flex-1 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all duration-200 shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              Volver a Actividades
            </button>
          </div>

        </div>
      </div>

      {/* Lead Magnet Modal */}
      {showLeadModal && (
        <LeadMagnetModal
          evaluationResult={result}
          onClose={() => setShowLeadModal(false)}
        />
      )}
    </div>
  );
};
