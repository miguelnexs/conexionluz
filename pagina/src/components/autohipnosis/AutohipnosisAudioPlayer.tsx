import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, CheckCircle2, RotateCcw, Sparkles, BookOpen, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export interface PracticeAudio {
  id: string;
  title: string;
  objective: string;
  durationLabel: string;
  durationSeconds: number;
  description: string;
  coverGradient: string;
  category: string;
  audioUrl?: string; // Optional MP3 file path
}

export const AUTOHIPNOSIS_PRACTICES: PracticeAudio[] = [
  {
    id: 'p1',
    title: 'Relajación Profunda Integral',
    objective: 'Soltar la tensión muscular y alcanzar un trance placentero',
    durationLabel: '15 Minutos',
    durationSeconds: 900,
    description: 'Una sesión paso a paso guiada por olas de relajación diafragmática y profundización mental.',
    coverGradient: 'from-indigo-50 via-purple-50 to-slate-50 border-indigo-200',
    category: 'Relajación'
  },
  {
    id: 'p2',
    title: 'Autohipnosis Flash de 5 Minutos',
    objective: 'Reset mental y calma en medio de la jornada',
    durationLabel: '5 Minutos',
    durationSeconds: 300,
    description: 'Una pausa rápida de 5 minutos para desacelerar las ondas cerebrales y recuperar el equilibrio.',
    coverGradient: 'from-emerald-50 via-teal-50 to-slate-50 border-emerald-200',
    category: 'Pausa Rápida'
  },
  {
    id: 'p3',
    title: 'Autohipnosis Estándar de 10 Minutos',
    objective: 'Calma mental y reprogramación ligera',
    durationLabel: '10 Minutos',
    durationSeconds: 600,
    description: 'Práctica rítmica de 10 minutos recomendada para sesiones diarias de mantenimiento.',
    coverGradient: 'from-blue-50 via-indigo-50 to-slate-50 border-blue-200',
    category: 'Diaria'
  },
  {
    id: 'p4',
    title: 'Autohipnosis Profunda de 15 Minutos',
    objective: 'Trance Theta profundo para integración de sugestiones',
    durationLabel: '15 Minutos',
    durationSeconds: 900,
    description: 'Desciende a través de la escalera mental regresiva para sembrar aficiones positivas.',
    coverGradient: 'from-purple-50 via-indigo-50 to-slate-50 border-purple-200',
    category: 'Profunda'
  },
  {
    id: 'p5',
    title: 'Concentración y Enfoque en Estado Flow',
    objective: 'Eliminar distracciones y aumentar el foco cognitivo',
    durationLabel: '10 Minutos',
    durationSeconds: 600,
    description: 'Despierta tu linterna atencional para trabajar o estudiar con fluidez sostenida.',
    coverGradient: 'from-amber-50 via-indigo-50 to-slate-50 border-amber-200',
    category: 'Enfoque'
  },
  {
    id: 'p6',
    title: 'Confianza y Autoestima Elevada',
    objective: 'Transformar el diálogo interno y disolver la duda',
    durationLabel: '12 Minutos',
    durationSeconds: 720,
    description: 'Fortalece la certidumbre en tus capacidades y cultiva una actitud serena de autovalía.',
    coverGradient: 'from-rose-50 via-purple-50 to-slate-50 border-rose-200',
    category: 'Autoestima'
  },
  {
    id: 'p7',
    title: 'Motivación e Impulso Vital',
    objective: 'Reconectar con tu propósito y tomar acción compasiva',
    durationLabel: '8 Minutos',
    durationSeconds: 480,
    description: 'Un disparo de energía limpia que te impulsa a dar el primer paso con firmeza.',
    coverGradient: 'from-orange-50 via-amber-50 to-slate-50 border-orange-200',
    category: 'Motivación'
  },
  {
    id: 'p8',
    title: 'Preparación Mental para un Objetivo',
    objective: 'Visualización multisensorial de metas de vida',
    durationLabel: '10 Minutos',
    durationSeconds: 600,
    description: 'Vive en tu mente la emoción de haber alcanzado tu objetivo con éxito.',
    coverGradient: 'from-teal-50 via-emerald-50 to-slate-50 border-teal-200',
    category: 'Objetivos'
  },
  {
    id: 'p9',
    title: 'Liberación de Tensión Cotidiana',
    objective: 'Soltar preocupaciones acumuladas en el día',
    durationLabel: '7 Minutos',
    durationSeconds: 420,
    description: 'Permite que la brisa de tu exhalación arrastre la tensión micro-contráctil.',
    coverGradient: 'from-slate-100 via-indigo-50 to-purple-50 border-slate-200',
    category: 'Descompresión'
  },
  {
    id: 'p10',
    title: 'Visualización Positiva del Futuro',
    objective: 'Sembrar imágenes de paz, serenidad y abundancia',
    durationLabel: '12 Minutos',
    durationSeconds: 720,
    description: 'Construye un puerto seguro en tu mente al que siempre podrás regresar.',
    coverGradient: 'from-indigo-50 via-amber-50 to-slate-50 border-indigo-200',
    category: 'Visualización'
  }
];

export default function AutohipnosisAudioPlayer({ onCompletePractice }: { onCompletePractice?: (practiceId: string) => void }) {
  const { toast } = useToast();
  const [selectedPractice, setSelectedPractice] = useState<PracticeAudio>(AUTOHIPNOSIS_PRACTICES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [completedPractices, setCompletedPractices] = useState<Set<string>>(new Set());

  // Web Audio Synthetic Ambient Generator for Relaxation Soundscape
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerIntervalRef = useRef<any>(null);

  const startAudioSynth = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      if (audioCtxRef.current.state === 'suspended') {
        void audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const masterGain = ctx.createGain();
      masterGain.gain.value = isMuted ? 0 : volume * 0.15;
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Binaural/Relaxation Drone (108Hz Base + 4Hz Theta beat difference)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();

      osc1.type = 'sine';
      osc1.frequency.value = 108; // Left ear base frequency

      osc2.type = 'sine';
      osc2.frequency.value = 112; // Right ear (4Hz Theta binaural beat difference)

      osc1.connect(masterGain);
      osc2.connect(masterGain);

      osc1.start();
      osc2.start();

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
    } catch {
      // Audio synth fallback
    }
  };

  const stopAudioSynth = () => {
    try {
      if (osc1Ref.current) {
        osc1Ref.current.stop();
        osc1Ref.current.disconnect();
        osc1Ref.current = null;
      }
      if (osc2Ref.current) {
        osc2Ref.current.stop();
        osc2Ref.current.disconnect();
        osc2Ref.current = null;
      }
    } catch {
      // Ignore cleanup error
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudioSynth();
      setIsPlaying(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    } else {
      startAudioSynth();
      setIsPlaying(true);

      timerIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= selectedPractice.durationSeconds) {
            stopAudioSynth();
            setIsPlaying(false);
            clearInterval(timerIntervalRef.current);
            handleMarkCompleted(selectedPractice.id);
            return selectedPractice.durationSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleMarkCompleted = (practiceId: string) => {
    setCompletedPractices((prev) => new Set(prev).add(practiceId));
    if (onCompletePractice) onCompletePractice(practiceId);
    toast({
      title: "🎉 ¡Práctica de Autohipnosis Completada!",
      description: `Has completado "${selectedPractice.title}". ¡Excelente hábito de autorregulación!`,
    });
  };

  useEffect(() => {
    return () => {
      stopAudioSynth();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-8 select-text">
      
      {/* Active Audio Player Header Showcase */}
      <div className={`bg-gradient-to-r ${selectedPractice.coverGradient} text-slate-900 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 relative overflow-hidden border`}>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/90 text-indigo-800 border border-indigo-200 px-3 py-1 rounded-full inline-flex items-center gap-1 shadow-2xs">
              <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" /> {selectedPractice.category} · {selectedPractice.durationLabel}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">{selectedPractice.title}</h3>
            <p className="text-xs sm:text-sm text-slate-700 max-w-xl font-medium leading-relaxed">
              {selectedPractice.description}
            </p>
          </div>

          <button
            onClick={() => handleMarkCompleted(selectedPractice.id)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer ${
              completedPractices.has(selectedPractice.id)
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
            }`}
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{completedPractices.has(selectedPractice.id) ? 'Práctica Completada' : 'Marcar Completada'}</span>
          </button>
        </div>

        {/* Player Controls Bar */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 space-y-3 relative z-10 shadow-xs">
          
          {/* Progress Seekbar */}
          <div className="space-y-1">
            <input
              type="range"
              min={0}
              max={selectedPractice.durationSeconds}
              value={currentTime}
              onChange={(e) => setCurrentTime(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 font-bold">
              <span>{formatTime(currentTime)}</span>
              <span>{selectedPractice.durationLabel}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 pt-1">
            
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="h-12 w-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center font-bold shadow-md transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
              </button>

              <button
                onClick={() => setCurrentTime(0)}
                className="h-9 w-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer border border-slate-200"
                title="Reiniciar"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-20 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

          </div>

        </div>

      </div>

      {/* Practices Catalog Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <span>Biblioteca de Ejercicios Guiados ({AUTOHIPNOSIS_PRACTICES.length})</span>
          </h4>
          <span className="text-xs font-bold text-slate-500">
            {completedPractices.size} de {AUTOHIPNOSIS_PRACTICES.length} realizadas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AUTOHIPNOSIS_PRACTICES.map((practice) => {
            const isSelected = practice.id === selectedPractice.id;
            const isDone = completedPractices.has(practice.id);

            return (
              <div
                key={practice.id}
                onClick={() => {
                  if (isPlaying) stopAudioSynth();
                  setIsPlaying(false);
                  setCurrentTime(0);
                  setSelectedPractice(practice);
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected 
                    ? 'bg-indigo-50/90 border-indigo-300 shadow-xs ring-2 ring-indigo-500/20' 
                    : 'bg-white hover:bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-md">
                      {practice.category}
                    </span>
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {practice.durationLabel}
                    </span>
                  </div>

                  <h5 className="font-bold text-base text-slate-900">{practice.title}</h5>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{practice.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <span className={isSelected ? 'text-indigo-700' : 'text-slate-500'}>
                    {isSelected ? '▶ Seleccionada en reproductor' : 'Seleccionar práctica'}
                  </span>

                  {isDone && (
                    <span className="inline-flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" /> Completada
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
