import React, { useState } from 'react';
import { Sparkles, Brain, ArrowRight, CheckCircle2, RefreshCw, Lightbulb, HelpCircle, Layers } from 'lucide-react';

const PRESET_THOUGHTS = [
  {
    thought: "Si no me sale todo perfecto a la primera, soy un completo fracaso.",
    distortion: "Pensamiento Dicotómico (Todo o Nada)",
    explanation: "Se evalúa la realidad en dos categorías extremas opuestas sin aceptar los múltiples puntos intermedios ni el aprendizaje gradual.",
    alternative: "Cometer errores es parte natural del aprendizaje; un desempeño no perfecto sigue siendo valioso y mejorable."
  },
  {
    thought: "No me ha respondido el WhatsApp, seguro que ya no le importo y está molesto conmigo.",
    distortion: "Lectura de Mente / Inferencia Arbitraria",
    explanation: "Se asume como hecho comprobado lo que otra persona siente o piensa sin tener evidencia fáctica ni haber preguntado.",
    alternative: "Puede estar ocupado, sin batería o concentrado en otra actividad. Preguntaré amablemente cuando sea oportuno."
  },
  {
    thought: "Todo me sale mal, siempre arruino las oportunidades que me dan.",
    distortion: "Sobregeneralización",
    explanation: "Se extrae una ley universal y absoluta a partir de un evento o dificultad puntual mediante términos como 'siempre', 'nunca' o 'todo'.",
    alternative: "Esta situación puntual no salió como deseaba, pero en muchas otras ocasiones he tenido logros y resultados favorables."
  },
  {
    thought: "Seguro que en la entrevista me pondré nervioso, se me olvidará todo y haré el ridículo.",
    distortion: "Adivinación del Futuro / Catastrofismo",
    explanation: "Se predice con certeza una catástrofe futura y se experimenta la angustia en el presente como si ya estuviera ocurriendo.",
    alternative: "Sentir algo de nervios es normal; me prepararé bien con mis puntos clave y responderé con calma."
  },
  {
    thought: "Me dieron el ascenso solo por suerte, en realidad no estoy preparado.",
    distortion: "Descalificación de lo Positivo / Minimización",
    explanation: "Se anulan las propias capacidades y méritos reales atribuyendo los resultados positivos a la casualidad o a factores externos.",
    alternative: "Reconocieron mi dedicación y competencias de estos meses; asumo este reto paso a paso."
  },
  {
    thought: "Debería ser capaz de trabajar 10 horas seguidas sin cansarme nunca.",
    distortion: "Tiranía de los 'Debería'",
    explanation: "Demandas rígidas e inflexibles impuestas sobre el organismo humano que no contemplan las necesidades biológicas de descanso.",
    alternative: "Es saludable y necesario hacer pausas; descansar optimiza mi rendimiento y cuida mi salud."
  }
];

export default function TCCDistorsionesIdentificador() {
  const [inputThought, setInputThought] = useState('');
  const [result, setResult] = useState<{
    distortion: string;
    description: string;
    questionsToReflect: string[];
    alternativeFraming: string;
  } | null>(null);

  const handleAnalyze = (textToAnalyze?: string) => {
    const target = (textToAnalyze || inputThought).trim();
    if (!target) return;

    const lower = target.toLowerCase();
    
    // Check matched presets first
    const preset = PRESET_THOUGHTS.find(p => p.thought.toLowerCase() === lower);
    if (preset) {
      setResult({
        distortion: preset.distortion,
        description: preset.explanation,
        questionsToReflect: [
          "¿Qué hechos objetivos respaldan este pensamiento?",
          "¿Qué datos concretos lo contradicen?",
          "¿Cómo vería esta situación una persona neutral y compasiva?"
        ],
        alternativeFraming: preset.alternative
      });
      return;
    }

    // Heuristic detection for custom user inputs
    let detected = "Inferencia o Sesgo Cognitivo General";
    let desc = "El pensamiento contiene interpretaciones rápidas que merecen ser examinadas a la luz de los hechos objetivos.";
    let alternative = "Evalúa la evidencia objetiva antes de dar por sentado que este pensamiento refleja la realidad.";

    if (lower.includes('todo') || lower.includes('nada') || lower.includes('perfecto') || lower.includes('fracaso') || lower.includes('inútil')) {
      detected = "Pensamiento Dicotómico (Todo o Nada)";
      desc = "Tendencia a clasificar la experiencia en extremos polares sin reconocer los matices.";
      alternative = "¿En qué punto del 0 al 100 se sitúa realmente esta situación? Busca los grises y puntos intermedios.";
    } else if (lower.includes('siempre') || lower.includes('nunca') || lower.includes('nadie') || lower.includes('todos')) {
      detected = "Sobregeneralización";
      desc = "Extensión indebida de un evento aislado hacia una regla universal.";
      alternative = "¿Existe al menos una excepción en la que esto no haya ocurrido exactamente así?";
    } else if (lower.includes('seguro que piensa') || lower.includes('piensan de mí') || lower.includes('me odia') || lower.includes('sabe que')) {
      detected = "Lectura de Mente";
      desc = "Atribución de intenciones o juicios ajenos sin comprobación fáctica.";
      alternative = "¿Tienes pruebas fehacientes o estás adivinando lo que la otra persona piensa?";
    } else if (lower.includes('va a salir mal') || lower.includes('desastre') || lower.includes('arruinar') || lower.includes('terrible')) {
      detected = "Catastrofismo / Adivinación del Futuro";
      desc = "Anticipación del peor escenario posible como si fuera la única opción probable.";
      alternative = "¿Cuál es el escenario más probable y realista? ¿Qué recursos tienes para afrontarlo si ocurriera?";
    } else if (lower.includes('debería') || lower.includes('tengo que obligatoriamente') || lower.includes('debo')) {
      detected = "Afirmaciones de 'Debería'";
      desc = "Reglas absolutistas que generan frustración y autoexigencia desmedida.";
      alternative = "Cambia el 'debería' por 'me gustaría' o 'sería preferible', reconociendo la flexibilidad.";
    }

    setResult({
      distortion: detected,
      description: desc,
      questionsToReflect: [
        "¿Estoy confundiendo una emoción con un hecho demostrado?",
        "¿Qué evidencia tengo a favor y en contra de esta conclusión?",
        "¿En qué me ayuda pensar de este modo en este momento?"
      ],
      alternativeFraming: alternative
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/30 border border-teal-400/40 text-teal-200 px-3 py-1 rounded-full">
            🔍 DETECTOR DE SESGOS
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Identificador de Distorsiones Cognitivas</h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Escribe un pensamiento automático o selecciona un ejemplo para identificar los sesgos de procesamiento y aprender alternativas socráticas de análisis.
        </p>
      </div>

      {/* Input Box */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
        <label className="block text-xs font-bold text-slate-800">
          Escribe o pega el pensamiento automático que deseas analizar:
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputThought}
            onChange={(e) => setInputThought(e.target.value)}
            placeholder="ej: Si cometo un error en la presentación, nadie me respetará jamás..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            onKeyDown={(e) => { if (e.key === 'Enter') handleAnalyze(); }}
          />
          <button
            onClick={() => handleAnalyze()}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" /> Analizar Patrón
          </button>
        </div>

        {/* Example Pills */}
        <div className="pt-2">
          <span className="text-[11px] font-bold text-slate-500 block mb-2">
            O selecciona una frase de práctica cotidiana:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_THOUGHTS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputThought(preset.thought);
                  handleAnalyze(preset.thought);
                }}
                className="text-left text-xs bg-slate-100 hover:bg-teal-50 hover:border-teal-200 border border-slate-200/80 text-slate-700 px-3 py-1.5 rounded-xl transition-all font-medium cursor-pointer"
              >
                "{preset.thought.slice(0, 45)}..."
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Result */}
      {result && (
        <div className="bg-white border-2 border-teal-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              🏷️ Patrón Detectado: {result.distortion}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase">¿En qué consiste este patrón?</h4>
              <p className="text-sm text-slate-800 font-medium mt-1 leading-relaxed">{result.description}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-200/80">
              <h4 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-teal-600" /> Preguntas Socráticas para Flexibilizar:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                {result.questionsToReflect.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>

            <div className="bg-teal-50/80 rounded-2xl p-4 border border-teal-200 space-y-1">
              <h4 className="text-xs font-black text-teal-950 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-700" /> Alternativa de Pensamiento Equilibrado:
              </h4>
              <p className="text-xs text-teal-900 font-medium leading-relaxed">{result.alternativeFraming}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
