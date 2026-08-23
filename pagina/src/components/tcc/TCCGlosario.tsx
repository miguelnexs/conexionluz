import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, Brain, Tag } from 'lucide-react';

const GLOSSARY_ITEMS = [
  {
    term: "Pensamiento Automático (P.A.)",
    category: "Cognitivo",
    definition: "Evaluaciones, juicios o imágenes ultrarrápidas e involuntarias que surgen en la mente ante situaciones cotidianas.",
    simpleExplanation: "La voz interna espontánea que comenta todo lo que nos pasa antes de que lo razonemos con calma.",
    example: "Ver una llamada perdida y pensar instantáneamente: 'Seguro ocurrió una emergencia grave'."
  },
  {
    term: "Creencia Nuclear (Core Belief / Esquema)",
    category: "Cognitivo",
    definition: "Estructuras profundas, globales y rígidas que la persona mantiene sobre sí misma, sobre los demás y sobre el mundo.",
    simpleExplanation: "Las gafas básicas con las que miramos la vida; ideas arraigadas que asumimos como verdades incuestionables.",
    example: "'Soy incapaz', 'El mundo es peligroso', 'No soy digno de afecto'."
  },
  {
    term: "Creencia Intermedia (Supuesto o Regla)",
    category: "Cognitivo",
    definition: "Actitudes, normas y premisas condicionales que median entre las creencias nucleares y los pensamientos automáticos.",
    simpleExplanation: "Las 'reglas de supervivencia' que nos imponemos para sentirnos seguros o evitar fracasos.",
    example: "'Si siempre complazco a los demás, evitaré que me rechacen'."
  },
  {
    term: "Distorsión Cognitiva",
    category: "Cognitivo",
    definition: "Sesgo sistemático o error en el procesamiento de la información que distorsiona la realidad objetiva.",
    simpleExplanation: "Trampas mentales o filtros deformantes que exageran lo negativo y omiten los hechos reales.",
    example: "Pensamiento todo o nada: 'Si no es perfecto, es una basura'."
  },
  {
    term: "Reestructuración Cognitiva",
    category: "Técnica",
    definition: "Proceso psicoterapéutico estructurado para identificar, evaluar y modificar pensamientos desadaptativos mediante el diálogo socrático.",
    simpleExplanation: "Aprender a actuar como un 'abogado neutral' de nuestros propios pensamientos, buscando pruebas reales.",
    example: "Cuestionar el pensamiento 'todos me odian' revisando cuántas personas realmente me tratan con aprecio."
  },
  {
    term: "Análisis Funcional ABC",
    category: "Conductual",
    definition: "Metodología conductual que evalúa la relación entre Antecedentes (A), Conducta observable (B) y Consecuencias (C).",
    simpleExplanation: "El mapa que explica qué dispara una acción y qué beneficio o alivio hace que la sigamos repitiendo.",
    example: "A: Estrés de estudio → B: Jugar videojuegos → C: Alivio momentáneo de la tensión (refuerzo negativo)."
  },
  {
    term: "Activación Conductual",
    category: "Conductual",
    definition: "Estrategia conductual estructurada que promueve la realización gradual de actividades gratificantes y de dominio personal.",
    simpleExplanation: "Hacer cosas positivas paso a paso sin esperar a 'sentir ganas', porque la acción activa el ánimo.",
    example: "Caminar 15 minutos en la mañana aunque se sienta cansancio inicial."
  },
  {
    term: "Evitación Conductual",
    category: "Conductual",
    definition: "Estrategia de escape o no afrontamiento ante estímulos que generan malestar, manteniendo el ciclo ansioso.",
    simpleExplanation: "Huir de lo que nos asusta; calma a corto plazo pero agranda el miedo con el paso del tiempo.",
    example: "Inventar una excusa para no asistir a una reunión por timidez."
  },
  {
    term: "Experimento Conductual",
    category: "Técnica",
    definition: "Prueba práctica diseñada para poner a prueba una creencia o predicción catastrófica en el mundo real.",
    simpleExplanation: "Hacer un ensayo controlado para comprobar si lo que tememos realmente ocurre.",
    example: "Hacer una pregunta tonta a propósito para comprobar si el grupo se burla o responde con normalidad."
  },
  {
    term: "Cuestionamiento Socrático",
    category: "Técnica",
    definition: "Método de indagación mediante preguntas abiertas que estimulan el razonamiento crítico y el descubrimiento guiado.",
    simpleExplanation: "Hacerse buenas preguntas en lugar de aceptar sin dudar el primer pensamiento que nos viene a la cabeza.",
    example: "'¿Qué es lo peor que podría pasar de forma realista? ¿Qué recursos tengo para afrontarlo?'"
  }
];

export default function TCCGlosario() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Cognitivo', 'Conductual', 'Técnica'];

  const filtered = GLOSSARY_ITEMS.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.simpleExplanation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/30 border border-teal-400/40 text-teal-200 px-3 py-1 rounded-full">
            📚 DICCIONARIO CONCEPTUAL
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Glosario de Términos TCC</h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Consulta la definición académica, la explicación sencilla y los ejemplos cotidianos de los conceptos clave de la Terapia Cognitivo-Conductual.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar término o concepto..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Glossary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-black text-slate-900">{item.term}</h3>
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                item.category === 'Cognitivo' 
                  ? 'bg-teal-50 text-teal-800 border-teal-200' 
                  : item.category === 'Conductual'
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : 'bg-indigo-50 text-indigo-800 border-indigo-200'
              }`}>
                {item.category}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Definición Técnica:</span>
                <p className="text-slate-700 leading-relaxed">{item.definition}</p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="font-bold text-teal-800 uppercase text-[10px] block">En Palabras Sencillas:</span>
                <p className="text-slate-800 font-medium mt-0.5">{item.simpleExplanation}</p>
              </div>

              <div className="text-[11px] text-slate-500 italic">
                <strong>Ejemplo:</strong> {item.example}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
