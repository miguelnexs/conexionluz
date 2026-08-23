import React, { useState } from 'react';
import { Sparkles, MessageSquare, ArrowRight, Lightbulb, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function EricksonianaAnalizador() {
  const [inputPhrase, setInputPhrase] = useState('');
  const [analysisResult, setAnalysisResult] = useState<{
    original: string;
    languageType: string;
    directivityLevel: string;
    permissiveElements: string[];
    presuppositions: string[];
    sensoryElements: string[];
    reformulated: string;
    whyExplanation: string;
  } | null>(null);

  const samplePhrases = [
    "Relájate ahora y no pienses en tus problemas.",
    "Tienes que cerrar los ojos y concentrarte en mi voz.",
    "Quiero que dejes ir toda la tensión de tu cuerpo inmediatamente."
  ];

  const handleAnalyze = (phraseToAnalyze?: string) => {
    const text = (phraseToAnalyze || inputPhrase).trim();
    if (!text) return;

    const lower = text.toLowerCase();
    
    // Determine characteristics based on pedagogical rules
    const isDirect = lower.includes('ahora') || lower.includes('tienes que') || lower.includes('quiero que') || lower.includes('debes') || lower.includes('inmediatamente');
    
    let languageType = isDirect ? "Directivo / Tradicional" : "Permisivo / Sugestivo";
    let directivityLevel = isDirect ? "Alta directividad (Instrucción explícita)" : "Baja directividad (Invitación respetuosa)";
    
    let permissiveElements: string[] = [];
    if (lower.includes('puedes') || lower.includes('notar') || lower.includes('quizás') || lower.includes('tal vez') || lower.includes('a tu ritmo')) {
      permissiveElements.push("Uso de verbos de posibilidad ('puedes', 'notar')");
      permissiveElements.push("Respeto por el ritmo individual del consultante");
    } else {
      permissiveElements.push("Ausencia de modificadores permisivos (frase estructurada como mandato directivo)");
    }

    let presuppositions: string[] = [];
    if (lower.includes('relaj') || lower.includes('calm') || lower.includes('tranquilidad')) {
      presuppositions.push("Presupone la capacidad interna del organismo para relajarse");
    }
    presuppositions.push("Presupone que la atención puede reorientarse de manera voluntaria");

    let sensoryElements: string[] = [];
    if (lower.includes('ojos') || lower.includes('voz') || lower.includes('escuchar') || lower.includes('sentir') || lower.includes('cuerpo') || lower.includes('tensión')) {
      if (lower.includes('ojos')) sensoryElements.push("Canal Visual (foco kinésico)");
      if (lower.includes('voz') || lower.includes('escuchar')) sensoryElements.push("Canal Auditivo");
      if (lower.includes('sentir') || lower.includes('cuerpo') || lower.includes('tensión')) sensoryElements.push("Canal Cinestésico / Somático");
    } else {
      sensoryElements.push("Canal Cognitivo General");
    }

    // Generate educational reformulation
    let reformulated = "";
    let whyExplanation = "";

    if (lower.includes('relájate ahora')) {
      reformulated = "Puedes comenzar a notar en qué medida alguna parte de ti ya sabe cómo relajarse a su propio ritmo...";
      whyExplanation = "Sustituye la orden imperativa por una invitación abierta que no genera resistencias conscientes y presupone la capacidad que ya posee el consultante.";
    } else if (lower.includes('tienes que cerrar los ojos')) {
      reformulated = "Y mientras escuchas mi voz, tus párpados pueden volverse confortablemente pesados cuando tu mente esté lista...";
      whyExplanation = "Transforma la obligación en un proceso natural progresivo, vinculando la atención auditiva con la sensación física cómoda.";
    } else if (lower.includes('quiero que dejes ir toda la tensión')) {
      reformulated = "Es interesante notar cómo esa tensión puede comenzar a suavizarse poco a poco, de la forma que sea más cómoda para ti...";
      whyExplanation = "Desplaza el foco desde los deseos del profesional hacia la experiencia subjetiva autorregulada del propio consultante.";
    } else {
      // General algorithm for any input
      reformulated = `Y mientras te tomas un momento, puedes empezar a descubrir cómo ${text.toLowerCase().replace(/ahora|inmediatamente|tienes que|quiero que|debes/g, '')} de una manera suave y completamente natural a tu propio ritmo...`;
      whyExplanation = "La formulación ericksoniana suaviza la directividad mediante presuposiciones permisivas, permitiendo que la mente inconsciente interprete la frase según sus propios recursos sin sentirse forzada.";
    }

    setAnalysisResult({
      original: text,
      languageType,
      directivityLevel,
      permissiveElements,
      presuppositions,
      sensoryElements,
      reformulated,
      whyExplanation
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-800 via-purple-800 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 px-3 py-1 rounded-full">
            💬 HERRAMIENTA EDUCATIVA
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Analizador de Lenguaje Ericksoniano</h2>
        <p className="text-indigo-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Introduce una frase tradicional o directiva para analizar sus componentes comunicacionales y descubrir su reformulación permisiva orientada a posibilidades.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-2xs">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-indigo-600" /> Frase a Analizar
          </h3>

          <div>
            <textarea
              rows={4}
              value={inputPhrase}
              onChange={(e) => setInputPhrase(e.target.value)}
              placeholder="Escribe o pega aquí una frase (ej: Relájate ahora y no pienses en nada...)"
              className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => handleAnalyze()}
            disabled={!inputPhrase.trim()}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" /> Analizar Pedagógicamente
          </button>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 block">Ejemplos de prueba rápida:</span>
            <div className="space-y-1.5">
              {samplePhrases.map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputPhrase(phrase);
                    handleAnalyze(phrase);
                  }}
                  className="w-full text-left text-[11px] p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 text-slate-700 hover:text-indigo-900 transition-all cursor-pointer font-medium"
                >
                  "{phrase}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2 space-y-4">
          {analysisResult ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs animate-in fade-in duration-200">
              
              {/* Top Banner: Original vs Type */}
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Frase Original Analizada</span>
                <div className="text-sm font-bold text-slate-900 font-mono">"{analysisResult.original}"</div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-800">
                    Tipo: {analysisResult.languageType}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-800">
                    Directividad: {analysisResult.directivityLevel}
                  </span>
                </div>
              </div>

              {/* Analysis Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-2xl space-y-1.5">
                  <strong className="text-emerald-950 font-bold block flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Elementos Permisivos
                  </strong>
                  <ul class="list-disc list-inside text-emerald-900 space-y-1">
                    {analysisResult.permissiveElements.map((el, i) => (
                      <li key={i}>{el}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl space-y-1.5">
                  <strong className="text-indigo-950 font-bold block flex items-center gap-1">
                    <Lightbulb className="h-3.5 w-3.5 text-indigo-600" /> Presuposiciones
                  </strong>
                  <ul class="list-disc list-inside text-indigo-900 space-y-1">
                    {analysisResult.presuppositions.map((el, i) => (
                      <li key={i}>{el}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-purple-50/70 border border-purple-100 p-4 rounded-2xl space-y-1.5">
                  <strong className="text-purple-950 font-bold block flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-purple-600" /> Canales Sensoriales
                  </strong>
                  <ul class="list-disc list-inside text-purple-900 space-y-1">
                    {analysisResult.sensoryElements.map((el, i) => (
                      <li key={i}>{el}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Reformulation Box */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                    Posible Reformulación Ericksoniana
                  </span>
                </div>
                <p className="text-sm font-bold text-emerald-950 italic leading-relaxed">
                  "{analysisResult.reformulated}"
                </p>
                <div className="pt-2 border-t border-emerald-200/80">
                  <span className="text-xs font-bold text-emerald-900 block mb-0.5">¿Por qué cambia la estructura comunicacional?</span>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    {analysisResult.whyExplanation}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center text-slate-500 space-y-3 shadow-2xs">
              <Sparkles className="h-10 w-10 text-indigo-400 mx-auto" />
              <div className="text-base font-bold text-slate-800">Analizador Ericksoniano Listo</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Ingresa una frase en el panel de la izquierda o selecciona uno de los ejemplos para ver su desglose comunicacional.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
