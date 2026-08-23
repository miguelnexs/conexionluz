import React, { useState } from 'react';
import { Sparkles, BookOpen, Edit3, Copy, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function EricksonianaMetaphorBuilder() {
  const [situation, setSituation] = useState('');
  const [protagonist, setProtagonist] = useState('Un viajero paciente');
  const [difficulty, setDifficulty] = useState('Un camino cubierto por una niebla imprevista');
  const [resource, setResource] = useState('La capacidad de detenerse a escuchar los sonidos profundos del bosque');
  const [learning, setLearning] = useState('Descubrir que la niebla no impide dar pasos seguros cuando el ritmo es sereno');
  const [transformation, setTransformation] = useState('El viento disipa gradualmente la bruma revelando un sendero firme');
  const [closure, setClosure] = useState('Continuar el viaje con mayor confianza interna en los propios pasos');

  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const story = `Érase una vez ${protagonist.toLowerCase()} que se encontraba en una situación donde ${situation ? situation.toLowerCase() : 'deseaba explorar nuevos horizontes'}.

En su camino, se presentó un desafío: ${difficulty.toLowerCase()}. Al principio, parecía que avanzar requería un gran esfuerzo consciente. Sin embargo, a medida que continuaba observando la situación con calma, descubrió algo valioso: ${resource.toLowerCase()}.

Ese hallazgo le permitió comprender un aprendizaje profundo: ${learning.toLowerCase()}. Poco a poco, la experiencia comenzó a cambiar, y ${transformation.toLowerCase()}.

Finalmente, ${closure.toLowerCase()}, recordando que cada paso ofrece su propia certeza.`;

    setGeneratedStory(story);
  };

  const handleCopy = () => {
    if (!generatedStory) return;
    navigator.clipboard.writeText(generatedStory);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/30 border border-teal-400/40 text-teal-200 px-3 py-1 rounded-full">
            📖 TALLER NARRATIVO
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Constructor de Metáforas Ericksonianas</h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Diseña e integra cuentos e historias terapéuticas organizando los 7 elementos estructurales de la metáfora análoga.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Fields */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-2xs">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Edit3 className="h-4 w-4 text-emerald-600" /> Campos del Diseño Narrativo
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">1. Situación Inicial (Encuadre del Consultante)</label>
              <input
                type="text"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="Ej: Dificultad para relajarse antes de hablar en público"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">2. Persona / Protagonista Simbólico</label>
              <input
                type="text"
                value={protagonist}
                onChange={(e) => setProtagonist(e.target.value)}
                placeholder="Ej: Un músico experimentado o un árbol flexible"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">3. Dificultad / Desafío Paralelo</label>
              <input
                type="text"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                placeholder="Ej: Un viento fuerte imprevisto sobre el escenario"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">4. Recurso Descubierto</label>
              <input
                type="text"
                value={resource}
                onChange={(e) => setResource(e.target.value)}
                placeholder="Ej: Afinar el instrumento escuchando la armonía propia"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">5. Aprendizaje / Iluminación Analógica</label>
              <input
                type="text"
                value={learning}
                onChange={(e) => setLearning(e.target.value)}
                placeholder="Ej: La música fluye mejor cuando no se fuerza el sonido"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">6. Transformación Progresiva</label>
              <input
                type="text"
                value={transformation}
                onChange={(e) => setTransformation(e.target.value)}
                placeholder="Ej: La melodía resonó con claridad contagiando serenidad"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">7. Cierre e Integración</label>
              <input
                type="text"
                value={closure}
                onChange={(e) => setClosure(e.target.value)}
                placeholder="Ej: Reconocer la propia voz con tranquilidad renovada"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" /> Generar Estructura Narrativa Editable
          </button>
        </div>

        {/* Narrative Output Column */}
        <div className="space-y-4">
          {generatedStory ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                  Estructura Narrativa Generada
                </span>
                <button
                  onClick={handleCopy}
                  className="text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
                </button>
              </div>

              <div>
                <textarea
                  rows={14}
                  value={generatedStory}
                  onChange={(e) => setGeneratedStory(e.target.value)}
                  className="w-full text-xs sm:text-sm p-4 rounded-2xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed select-text"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-[11px] text-amber-950 leading-relaxed">
                <strong>Aviso Pedagógico:</strong> La metáfora generada es una estructura de práctica narrativa. No constituye automáticamente una intervención clínica completa sin la calibración en tiempo real del consultante.
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center text-slate-500 space-y-3 shadow-2xs">
              <BookOpen className="h-10 w-10 text-teal-500 mx-auto" />
              <div className="text-base font-bold text-slate-800">Constructor de Metáforas Listo</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Completa o modifica los 7 campos del panel lateral y haz clic en "Generar" para construir tu narración terapéutica estructurada.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
