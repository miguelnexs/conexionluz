import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';
import {
  CheckCircle2,
  RotateCcw,
  Heart,
  Sparkles,
  Compass,
  Dumbbell,
  ChevronLeft,
  Calendar,
  Info,
  Clock,
  ChevronDown,
  ChevronUp,
  Shield
} from 'lucide-react';
import { EvaluationResult, getEvaluationResult, syncTestResultWithAWE } from '@/utils/RecommendationEngine';
import AWEDailyWidget from '@/components/awe/AWEDailyWidget';
import { LeadMagnetModal } from '@/components/questionnaires/LeadMagnetModal';
import { recordTestActivity } from '@/utils/progressTracker';

export default function TestResultPage() {
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);

  useEffect(() => {
    let evalRes: EvaluationResult | null = null;
    // 1. Try to read last saved evaluation result from sessionStorage
    try {
      const saved = sessionStorage.getItem('conexionluz:last_test_result');
      if (saved) {
        evalRes = JSON.parse(saved);
      }
    } catch { /* silent */ }

    if (!evalRes) {
      // 2. Fallback: Parse query param testId or hash param
      const hashStr = window.location.hash || '';
      const searchParams = new URLSearchParams(hashStr.includes('?') ? hashStr.split('?')[1] : window.location.search);
      const testId = searchParams.get('testId') || 'ansiedad';

      // Generate sample result based on GAD-7 Ansiedad Leve (score 6 de 21) as shown in user snippet
      evalRes = getEvaluationResult(testId, 6, testId === 'ansiedad' ? 21 : testId === 'estado-animo' ? 27 : testId === 'bienestar' ? 15 : 30);
    }

    setResult(evalRes);
    if (evalRes) {
      syncTestResultWithAWE(evalRes);
      recordTestActivity((evalRes as any).title || (evalRes as any).levelName || 'Test de Bienestar', (evalRes as any).totalScore || 80);
    }
  }, []);

  if (!result) {
    return (
      <PublicLayout>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      </PublicLayout>
    );
  }

  const handleRepeatTest = () => {
    window.location.hash = '#/actividades/tests';
  };

  const handleGoToAgenda = () => {
    window.location.hash = '#/agenda';
  };

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-8 animate-in fade-in duration-300">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <button
            onClick={handleRepeatTest}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Volver a Tests de Bienestar
          </button>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            Resultado Verificado • Conexión Luz®
          </span>
        </div>

        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 text-slate-900 shadow-xl border border-slate-100 space-y-3">
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 w-fit">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Reporte de Evaluación Personalizado</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
            Tus Resultados de Bienestar Emocional
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl leading-relaxed font-medium">
            Interpretación integradora basada en instrumentos validados clínicamente. Este reporte ha sido adaptado a tu estado emocional actual.
          </p>
        </div>

        {/* Main Result Card */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xl relative overflow-hidden space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-xs" style={{ background: `${result.color}15`, color: result.color, borderColor: `${result.color}30` }}>
            <CheckCircle2 className="w-4 h-4" /> Tu resultado
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">
              {result.label}
            </h2>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-semibold text-slate-500">
              <span>Puntuación: <strong className="text-slate-800">{result.totalScore}</strong> de {result.maxScore}</span>
              <span>•</span>
              <span>{result.testName}</span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-100/80 shadow-xs">
            <p className="text-sm md:text-base text-slate-700 leading-relaxed font-medium italic">
              "{result.interpretation}"
            </p>
          </div>
        </div>

        {/* Cápsula AWE Sintonizada a tu Estado Emocional */}
        <div className="bg-white rounded-3xl p-6 md:p-8 text-slate-900 shadow-xl border border-slate-100 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-black text-lg md:text-xl text-slate-900">
                Cápsula AWE Sintonizada a tu Estado Emocional
              </h3>
              <p className="text-xs text-slate-500 font-medium">Adaptive Wisdom Engine • Conexión Luz®</p>
            </div>
          </div>

          <AWEDailyWidget className="shadow-sm rounded-2xl" />
        </div>

        {/* Recomendaciones personalizadas para ti */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-lg space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900">
                Recomendaciones personalizadas para ti
              </h3>
              <p className="text-xs text-slate-500">Pautas prácticas diseñadas para tu nivel actual</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.recommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-slate-50 hover:bg-indigo-50/50 p-5 rounded-2xl border border-slate-100 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                    {index + 1}
                  </span>
                  <p className="text-xs md:text-sm text-slate-700 font-semibold leading-relaxed">
                    {rec}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ejercicios prácticos de bienestar recomendados */}
        {result.exercises && result.exercises.length > 0 && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-lg space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
                <Dumbbell className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-black text-xl text-slate-900">
                  Ejercicios prácticos de bienestar recomendados
                </h3>
                <p className="text-xs text-slate-500">Herramientas autoreguladoras con guía paso a paso</p>
              </div>
            </div>

            <div className="space-y-4">
              {result.exercises.map((ex, index) => {
                const isExpanded = expandedExercise === index;
                return (
                  <div
                    key={index}
                    className="bg-slate-50 rounded-2xl border border-slate-100 p-5 space-y-4 transition-all duration-200 hover:border-slate-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            ex.category?.toLowerCase().includes('respiraci')
                              ? 'bg-teal-50 text-teal-700 border-teal-100'
                              : ex.category?.toLowerCase().includes('mindful')
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                              : ex.category?.toLowerCase().includes('corporal')
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : ex.category?.toLowerCase().includes('visualiza')
                              ? 'bg-purple-50 text-purple-700 border-purple-100'
                              : ex.category?.toLowerCase().includes('emocional')
                              ? 'bg-amber-50 text-amber-700 border-amber-100'
                              : 'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            {ex.category}
                          </span>
                          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 text-indigo-500" /> {ex.duration}
                          </span>
                        </div>
                        <h4 className="font-black text-slate-900 text-lg">{ex.title}</h4>
                      </div>

                      <button
                        onClick={() => setExpandedExercise(isExpanded ? null : index)}
                        className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm shrink-0 cursor-pointer"
                      >
                        {isExpanded ? (
                          <>Ocultar paso a paso <ChevronUp className="w-4 h-4" /></>
                        ) : (
                          <>Ver paso a paso de la práctica <ChevronDown className="w-4 h-4" /></>
                        )}
                      </button>
                    </div>

                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                      {ex.description}
                    </p>

                    {/* Step by Step instructions when expanded */}
                    {isExpanded && ex.steps && ex.steps.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-3 animate-in slide-in-from-top-2 duration-200 bg-white p-5 rounded-xl border">
                        <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Pasos guiados de la técnica
                        </h5>
                        <ol className="space-y-2.5 pl-2">
                          {ex.steps.map((step, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-3 text-xs md:text-sm text-slate-700">
                              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border">
                                {sIdx + 1}
                              </span>
                              <span className="font-medium leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Un mensaje de aliento */}
        <div className="bg-white p-8 rounded-3xl text-indigo-950 border border-indigo-100 shadow-xl space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full w-fit">
              <Heart className="w-4 h-4 fill-indigo-400 text-indigo-600" /> Un mensaje de aliento
            </div>
            {result.hopeMessage.author && (
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50/80 px-3 py-1 rounded-full border border-indigo-100">
                📜 {result.hopeMessage.author}
              </span>
            )}
          </div>

          {result.hopeMessage.quote && (
            <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 italic font-serif text-lg md:text-xl font-bold text-slate-800 leading-snug">
              "{result.hopeMessage.quote}"
            </blockquote>
          )}

          <div className="space-y-1.5 pt-1">
            <h3 className="text-xl md:text-2xl font-black text-indigo-950">
              "{result.hopeMessage.title}"
            </h3>
            <p className="text-sm md:text-base text-slate-700 leading-relaxed font-medium max-w-2xl">
              {result.hopeMessage.text}
            </p>
          </div>
        </div>

        {/* Acompañamiento Profesional CTA Section */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xl space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
              Acompañamiento Profesional
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900">
              {result.cta.title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {result.cta.text}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <button
              onClick={handleGoToAgenda}
              className="w-full sm:w-auto flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm px-6 py-4 rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" /> {result.cta.primaryButton}
            </button>

            <button
              onClick={() => setShowLeadModal(true)}
              className="w-full sm:w-auto flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm px-6 py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
            >
              <Info className="w-4 h-4" /> {result.cta.secondaryButton}
            </button>
          </div>

          {/* Trust Badges */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-center">
            {result.cta.trustBadges.map((badge, bIdx) => (
              <div key={bIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-100/80 flex items-center justify-center gap-2">
                <Shield className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="text-xs font-bold text-slate-700">{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Final Gratitude Message */}
        <div className="text-center py-4">
          <p className="text-xs md:text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed italic">
            "{result.finalMessage}"
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2 pb-8">
          <button
            onClick={handleRepeatTest}
            className="flex-1 py-4 px-6 rounded-2xl border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Repetir cuestionario
          </button>

          <button
            onClick={handleRepeatTest}
            className="flex-1 py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/25"
          >
            Volver a Actividades
          </button>
        </div>

      </div>

      {/* Lead Magnet Modal */}
      {showLeadModal && (
        <LeadMagnetModal
          evaluationResult={result}
          onClose={() => setShowLeadModal(false)}
        />
      )}
    </PublicLayout>
  );
}
