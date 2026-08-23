import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getEvaluationResult,
  getRandomMotivationalMessage,
  syncTestResultWithAWE,
  EvaluationResult,
} from '@/utils/RecommendationEngine';
import { WarmIntroModal } from './WarmIntroModal';
import { ProgressHeader } from './ProgressHeader';
import { MotivationMessage } from './MotivationMessage';
import { AnalyzingScreen } from './AnalyzingScreen';
import { ResultSummary } from './ResultSummary';

export interface QuestionOption {
  label: string;
  value: number;
}

export interface Question {
  id: number;
  text: string;
  options?: QuestionOption[];
}

export interface TestData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  questions: Question[];
  color: string;
  gradient: string;
  tag: string;
}

const DEFAULT_OPTIONS: QuestionOption[] = [
  { label: 'Nunca', value: 0 },
  { label: 'Varios días', value: 1 },
  { label: 'Más de la mitad de los días', value: 2 },
  { label: 'Casi todos los días', value: 3 },
];

interface QuestionWizardProps {
  test: TestData;
  onClose: () => void;
  onNavigateToAgenda?: () => void;
}

type WizardStage = 'INTRO' | 'QUESTIONING' | 'MOTIVATION' | 'ANALYZING' | 'RESULT';

export const QuestionWizard: React.FC<QuestionWizardProps> = ({
  test,
  onClose,
  onNavigateToAgenda,
}) => {
  const [stage, setStage] = useState<WizardStage>('INTRO');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedAnimValue, setSelectedAnimValue] = useState<number | null>(null);
  const [currentMotivationalMsg, setCurrentMotivationalMsg] = useState('');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const currentQuestion = test.questions[currentStepIndex];
  const totalQuestions = test.questions.length;
  const maxScore = totalQuestions * 3;

  // Handle keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleStartEvaluation = () => {
    setStage('QUESTIONING');
    setCurrentStepIndex(0);
    setAnswers({});
  };

  const handleSelectOption = (value: number) => {
    if (isTransitioning || !currentQuestion) return;

    setSelectedAnimValue(value);
    setIsTransitioning(true);

    const updatedAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(updatedAnswers);

    // Wait 250ms per UX prompt specifications
    setTimeout(() => {
      setSelectedAnimValue(null);
      setIsTransitioning(false);

      const nextIndex = currentStepIndex + 1;

      // Check if finished all questions
      if (nextIndex >= totalQuestions) {
        // Calculate result
        const totalScore = (Object.values(updatedAnswers) as number[]).reduce((a, b) => a + Number(b), 0);
        const calculatedResult = getEvaluationResult(test.id, totalScore, maxScore);
        syncTestResultWithAWE(calculatedResult);
        try {
          sessionStorage.setItem('conexionluz:last_test_result', JSON.stringify(calculatedResult));
        } catch { /* silent */ }
        setResult(calculatedResult);
        setStage('ANALYZING');
      } else {
        // Check if every 3 questions finished (e.g. index 3, 6, 9)
        if (nextIndex > 0 && nextIndex % 3 === 0) {
          setCurrentMotivationalMsg(getRandomMotivationalMessage());
          setCurrentStepIndex(nextIndex);
          setStage('MOTIVATION');
        } else {
          setCurrentStepIndex(nextIndex);
        }
      }
    }, 250);
  };

  const handleContinueFromMotivation = () => {
    setStage('QUESTIONING');
  };

  const handleRepeat = () => {
    setAnswers({});
    setCurrentStepIndex(0);
    setResult(null);
    setStage('INTRO');
  };

  const handleSchedule = () => {
    onClose();
    if (onNavigateToAgenda) {
      onNavigateToAgenda();
    } else {
      window.location.hash = '#/agenda';
    }
  };

  const handleFinishAnalyzing = () => {
    onClose();
    window.location.hash = `#/actividades/tests/resultado?testId=${encodeURIComponent(test.id)}`;
  };

  // Stage 1: Warm Intro Modal
  if (stage === 'INTRO') {
    return (
      <WarmIntroModal
        testTitle={test.title}
        testSubtitle={test.subtitle}
        testColor={test.color}
        gradient={test.gradient}
        duration={test.duration}
        questionsCount={totalQuestions}
        onStart={handleStartEvaluation}
        onClose={onClose}
      />
    );
  }

  // Stage 5: Results Summary Screen
  if (stage === 'RESULT' && result) {
    return (
      <ResultSummary
        result={result}
        onRepeat={handleRepeat}
        onClose={onClose}
        onSchedule={handleSchedule}
      />
    );
  }

  const activeOptions = currentQuestion?.options && currentQuestion.options.length > 0
    ? currentQuestion.options
    : DEFAULT_OPTIONS;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        ref={containerRef}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100"
        role="dialog"
        aria-modal="true"
        aria-label={test.title}
      >
        {/* Stage 2 & 3 Header */}
        <ProgressHeader
          currentStep={currentStepIndex + 1}
          totalSteps={totalQuestions}
          testTitle={test.title}
          gradient={test.gradient}
          onClose={onClose}
        />

        {/* Stage 3: Motivational Message overlay/view */}
        {stage === 'MOTIVATION' && (
          <MotivationMessage
            message={currentMotivationalMsg}
            onContinue={handleContinueFromMotivation}
          />
        )}

        {/* Stage 4: Analyzing Screen */}
        {stage === 'ANALYZING' && (
          <AnalyzingScreen
            onComplete={handleFinishAnalyzing}
          />
        )}

        {/* Stage 2: Question Wizard Assistant */}
        {stage === 'QUESTIONING' && currentQuestion && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Durante las últimas 2 semanas...
              </span>
              <h3 className="text-slate-800 font-black text-lg md:text-xl leading-relaxed">
                "{currentQuestion.text}"
              </h3>
            </div>

            {/* Answer Options list */}
            <div className="space-y-3 pt-2" role="radiogroup" aria-label="Opciones de respuesta">
              {activeOptions.map((opt) => {
                const isSelected =
                  selectedAnimValue === opt.value || answers[currentQuestion.id] === opt.value;

                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectOption(opt.value)}
                    disabled={isTransitioning}
                    role="radio"
                    aria-checked={isSelected}
                    className={cn(
                      'w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 font-semibold text-sm text-left active:scale-[0.99] touch-manipulation cursor-pointer',
                      isSelected
                        ? 'border-transparent text-white shadow-lg shadow-indigo-500/20'
                        : 'border-slate-100 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80'
                    )}
                    style={
                      isSelected
                        ? { background: test.color, borderColor: test.color }
                        : {}
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-transform"
                        style={
                          isSelected
                            ? { background: 'rgba(255,255,255,0.25)', color: '#fff' }
                            : { background: '#f1f5f9', color: '#64748b' }
                        }
                      >
                        {opt.value}
                      </span>
                      <span className="text-sm font-bold">{opt.label}</span>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center animate-in zoom-in-50 duration-150">
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Navigation back button */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setCurrentStepIndex((idx) => Math.max(0, idx - 1))}
                disabled={currentStepIndex === 0 || isTransitioning}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors py-2 px-3 rounded-xl cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
