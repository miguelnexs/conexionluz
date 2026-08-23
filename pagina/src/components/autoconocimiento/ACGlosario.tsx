import React, { useState } from 'react';
import { Search, BookOpen, Sparkles } from 'lucide-react';

const GLOSSARY_ITEMS = [
  {
    term: "Autoconocimiento",
    category: "Fundamento",
    definition: "Proceso reflexivo, progresivo y consciente mediante el cual una persona explora su identidad, valores, creencias, emociones, historia y patrones de conducta.",
    simpleExplanation: "Conocer quién eres por dentro para tomar mejores decisiones en tu vida.",
    example: "Notar que te gusta más el trabajo en proyectos autónomos que en entornos altamente jerárquicos."
  },
  {
    term: "Identidad",
    category: "Identidad",
    definition: "Conjunto dinámico de rasgos, valores, memorias y aspiraciones que definen el sentido de quién es una persona más allá de sus roles circunstanciales.",
    simpleExplanation: "Tu esencia profunda, no solo tu profesión o títulos.",
    example: "Reconocer que tu valor como ser humano no depende únicamente de tu rendimiento profesional."
  },
  {
    term: "Autoconcepto",
    category: "Identidad",
    definition: "La imagen, ideas y creencias que una persona tiene construidas sobre sus propias capacidades, límites y características.",
    simpleExplanation: "La opinión o descripción mental que tienes sobre ti mismo.",
    example: "Verte como una persona capaz de aprender cosas nuevas aunque al principio te cuesten."
  },
  {
    term: "Autoestima",
    category: "Identidad",
    definition: "La valoración afectiva y el grado de aprecio, respeto y amabilidad incondicional que una persona se profesa a sí misma.",
    simpleExplanation: "El cariño y respeto que te tienes, incluso cuando te equivocas.",
    example: "Tratarte con amabilidad tras cometer un error en lugar de insultarte mentalmente."
  },
  {
    term: "Valores",
    category: "Valores",
    definition: "Principios y convicciones profundas que actúan como brújula para discernir prioridades y orientar decisiones coherentes.",
    simpleExplanation: "Lo que consideras verdaderamente valioso e innegociable en tu vida.",
    example: "Priorizar el tiempo en familia por encima de horas extra no remuneradas."
  },
  {
    term: "Desidentificación Cognitiva",
    category: "Pensamientos",
    definition: "Capacidad de observar los pensamientos como eventos mentales pasajeros e hipótesis sin asumirlos automáticamente como hechos reales.",
    simpleExplanation: "Darme cuenta de que 'tengo el pensamiento de que no podré', pero eso no significa que sea verdad.",
    example: "Notar un pensamiento de duda y decidir actuar con prudencia en lugar de paralizarse."
  },
  {
    term: "Límites Personales",
    category: "Relaciones",
    definition: "Pautas claras y respetuosas que comunican a uno mismo y a los demás qué conductas son aceptables y cuáles transgreden el bienestar personal.",
    simpleExplanation: "Poner un cerco protector a tu tiempo, espacio y energía con amabilidad.",
    example: "'Agradezco la invitación, pero hoy necesito descansar en casa'."
  },
  {
    term: "Patrón de Conducta",
    category: "Hábitos",
    definition: "Secuencia aprendida y repetitiva de respuestas automáticas ante estímulos o situaciones específicas del entorno.",
    simpleExplanation: "Un hábito mental o de acción que haces en piloto automático.",
    example: "Evitar conversaciones difíciles comiendo dulces en lugar de dialogar."
  }
];

export default function ACGlosario() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');

  const categories = ['Todos', 'Fundamento', 'Identidad', 'Valores', 'Pensamientos', 'Relaciones', 'Hábitos'];

  const filtered = GLOSSARY_ITEMS.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.definition.toLowerCase().includes(search.toLowerCase()) ||
      item.simpleExplanation.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'Todos' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            📚 DICCIONARIO DE AUTOCONOCIMIENTO
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Glosario Conceptual</h2>
        <p className="text-indigo-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Consulta definiciones claras, explicaciones accesibles y ejemplos cotidianos de los conceptos clave de este programa.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar concepto o término..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                category === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-black text-slate-900">{item.term}</h3>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border bg-indigo-50 text-indigo-800 border-indigo-200">
                {item.category}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Definición:</span>
                <p className="text-slate-700 leading-relaxed">{item.definition}</p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="font-bold text-indigo-950 uppercase text-[10px] block">En Palabras Sencillas:</span>
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
