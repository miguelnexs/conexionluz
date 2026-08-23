import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, Play, RefreshCw, Wand2, BookOpen, Volume2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SessionGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionGeneratorModal({ isOpen, onClose }: SessionGeneratorModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  // Form parameters
  const [objective, setObjective] = useState<string>('relajacion');
  const [duration, setDuration] = useState<string>('10');
  const [inductionStyle, setInductionStyle] = useState<string>('respiracion');
  const [relaxationType, setRelaxationType] = useState<string>('corporal');
  const [visualScenario, setVisualScenario] = useState<string>('playa');
  const [customAffirmation, setCustomAffirmation] = useState<string>('Conservo la calma y el control en todo momento.');

  // Generated Script Output
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = () => {
    let objTitle = "Relajación y Liberación de Estrés";
    if (objective === 'autoestima') objTitle = "Autoconfianza y Autoestima Elevada";
    if (objective === 'concentracion') objTitle = "Concentración y Estado de Flow";
    if (objective === 'habitos') objTitle = "Refuerzo de Hábitos Saludables";
    if (objective === 'motivacion') objTitle = "Motivación e Impulso Vital";

    let indText = "Toma una respiración profunda por la nariz en 4 segundos, sostén 4 segundos y exhala lentamente en 6 segundos. Siente cómo con cada exhalación tu cuerpo se suelta el doble de profundo.";
    if (inductionStyle === 'regresiva') indText = "Visualiza una cómoda escalera de 10 escalones. Cuenta mentalmente de 10 a 1 a medida que desciendes cada escalón, sintiendo cómo con cada número te sumerges en un estado de serenidad absoluta.";
    if (inductionStyle === 'fijacion') indText = "Fija tu mirada suavemente en un punto elevado. Mantén tus párpados pesados hasta que deseen cerrarse solos, permitiendo una grata sensación de descanso.";

    let scnText = "Te encuentras caminando descalzo por una playa de arena dorada al atardecer. Sientes la brisa suave y el sonido rítmico de las olas trayéndote paz absoluta.";
    if (visualScenario === 'bosque') scnText = "Caminas por un bosque frondoso lleno de luz tibia entre las hojas. Respiras el aire puro y sientes la firmeza y vida de la naturaleza renovándote.";
    if (visualScenario === 'escenario_exito') scnText = "Te observas en el futuro cercano actuando con absoluta fluidez, seguridad y serenidad, logrando tus metas con total soltura.";

    const script = `
=== GUION DE AUTOHIPNOSIS PERSONALIZADO ===
Objetivo: ${objTitle} | Duración: ${duration} Minutos | Conexión Luz

1. PREPARACIÓN Y ENCUADRE:
Adopta tu postura cómoda con la espalda recta pero relajada. Cierra suavemente los ojos y desconéctate del exterior.

2. INDUCCIÓN (${inductionStyle.toUpperCase()}):
${indText}

3. PROFUNDIZACIÓN (${relaxationType.toUpperCase()}):
Siente cómo una luz tibia recorre desde tu cabeza hasta tus pies, liberando cualquier tensión acumulada. Tu cuerpo pesa agradablemente y tu mente permanece serena y clara.

4. VISUALIZACIÓN MULTISENSORIAL:
${scnText}

5. SUGESTIÓN Y REESTRUCTURACIÓN:
Repite mentalmente con emoción y convicción:
"${customAffirmation}"
"Cada día y en todo aspecto me siento más fuerte, sereno y confiado."

6. SALIDA Y RETORNO SEGURO (1 A 5):
Voy a contar de 1 a 5. A la cuenta de 5 abrirás los ojos sintiéndote completamente despierto, lleno de energía, calma y vitalidad.
1... Reconociendo tu respiración.
2... Sintiendo tus manos y pies.
3... Trayendo la serenidad contigo.
4... Inhalando aire fresco.
5... ¡Ojos abiertos, completamente despierto y renovado!
============================================
`.trim();

    setGeneratedScript(script);
    setStep(2);
  };

  const handleCopy = () => {
    if (!generatedScript) return;
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    toast({
      title: "📋 ¡Guion copiado!",
      description: "El guion de autohipnosis se ha copiado a tu portapapeles."
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Wand2 className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-black text-slate-900 text-base">Generador de Sesiones de Autohipnosis</h3>
              <p className="text-xs text-slate-500 font-medium">Diseña tu guion personalizado de autohipnosis</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {step === 1 ? (
            <div className="space-y-5">
              
              {/* Objective Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">1. Objetivo Principal</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'relajacion', label: '🌿 Relajación & Estrés' },
                    { id: 'autoestima', label: '💎 Autoestima & Confianza' },
                    { id: 'concentracion', label: '🎯 Concentración & Enfoque' },
                    { id: 'habitos', label: '🔄 Hábitos Saludables' },
                    { id: 'motivacion', label: '🔥 Motivación & Impulso' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setObjective(item.id)}
                      className={`p-3 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer ${
                        objective === item.id 
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-2xs' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration & Induction */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">2. Duración Estimada</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800"
                  >
                    <option value="5">5 Minutos (Sesión Flash)</option>
                    <option value="10">10 Minutos (Recomendado)</option>
                    <option value="15">15 Minutos (Profunda)</option>
                    <option value="20">20 Minutos (Completa)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">3. Estilo de Inducción</label>
                  <select
                    value={inductionStyle}
                    onChange={(e) => setInductionStyle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800"
                  >
                    <option value="respiracion">Respiración Diafragmática (4-7-8)</option>
                    <option value="regresiva">Cuenta Regresiva Escalera (10 a 1)</option>
                    <option value="fijacion">Fijación Visual y Párpados Pesados</option>
                  </select>
                </div>
              </div>

              {/* Visual Scenario */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">4. Escenario de Visualización</label>
                <select
                  value={visualScenario}
                  onChange={(e) => setVisualScenario(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800"
                >
                  <option value="playa">Playa Serena al Atardecer</option>
                  <option value="bosque">Bosque Frondoso y Luz Tibia</option>
                  <option value="escenario_exito">Proyección de Éxito Futuro</option>
                </select>
              </div>

              {/* Custom Affirmation */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">5. Afirmación / Sugestión Clave</label>
                <input
                  type="text"
                  value={customAffirmation}
                  onChange={(e) => setCustomAffirmation(e.target.value)}
                  placeholder="Ej: Conservo la calma y la confianza en todo momento."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>Generar Guion Personalizado</span>
              </button>

            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 font-mono text-xs leading-relaxed overflow-x-auto select-text shadow-inner">
                <pre className="whitespace-pre-wrap">{generatedScript}</pre>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? "¡Copiado!" : "Copiar Guion"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Crear Otro</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
