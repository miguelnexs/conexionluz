import React, { useState } from 'react';
import { Search, BookOpen, Sparkles } from 'lucide-react';

const GLOSSARY_ITEMS = [
  {
    term: "Autoconocimiento",
    category: "Identidad",
    definition: "Capacidad reflexiva de observar, comprender y reconocer los propios pensamientos, emociones, valores, motivaciones y patrones de conducta.",
    simpleExplanation: "Saber quién eres realmente, qué te mueve y cómo reaccionas ante lo que te pasa.",
    example: "Notar que te pones irritable cuando tienes hambre o cuando no has descansado suficiente."
  },
  {
    term: "Autoestima",
    category: "Identidad",
    definition: "Valoración afectiva y respeto incondicional hacia uno mismo como ser humano, independiente de los éxitos o fracasos momentáneos.",
    simpleExplanation: "El afecto y respeto que te tienes por el simple hecho de existir.",
    example: "Tratarte con amabilidad y comprensión tras cometer una equivocación en el trabajo."
  },
  {
    term: "Autoconcepto",
    category: "Identidad",
    definition: "Conjunto de creencias, percepciones e ideas descriptivas que una persona tiene estructuradas sobre sí misma.",
    simpleExplanation: "La imagen mental y la historia que te cuentas sobre cómo eres.",
    example: "'Me considero una persona creativa y constante, aunque a veces me cuesta hablar en público'."
  },
  {
    term: "Valores Personales",
    category: "Dirección",
    definition: "Principios y convicciones fundamentales que guían las decisiones, prioridades y el sentido ético de la existencia.",
    simpleExplanation: "Las direcciones que marcan el rumbo de tu brújula vital.",
    example: "Elegir un trabajo con mayor flexibilidad horaria porque la familia es tu valor prioritario."
  },
  {
    term: "Objetivo SMART",
    category: "Acción",
    definition: "Metodología de formulación de metas que asegura que sean Específicas, Medibles, Alcanzables, Relevantes y Temporales.",
    simpleExplanation: "Una meta bien explicada que tiene fecha, medida exacta y pasos realizables.",
    example: "'Caminar 20 minutos 3 veces por semana durante el mes de septiembre'."
  },
  {
    term: "Bucle del Hábito",
    category: "Hábitos",
    definition: "Estructura neurológica compuesta por una Señal disparadora, una Rutina conductual y una Recompensa reforzadora.",
    simpleExplanation: "El circuito automático con el que el cerebro automatiza tareas para no gastar energía.",
    example: "Señal: Alarma matutina → Rutina: Beber vaso de agua → Recompensa: Sensación de frescor e hidratación."
  },
  {
    term: "Procrastinación",
    category: "Acción",
    definition: "Postergación voluntaria de una tarea importante a pesar de anticipar consecuencias negativas, motivada por la regulación del malestar emocional.",
    simpleExplanation: "Huir momentáneamente de una tarea que produce incomodidad o miedo al fracaso.",
    example: "Revisar las redes sociales en lugar de redactar un informe difícil."
  },
  {
    term: "Comunicación Asertiva",
    category: "Relaciones",
    definition: "Estilo de comunicación que expresa sentimientos, necesidades y límites con claridad, firmeza y respeto mutuo.",
    simpleExplanation: "Decir lo que piensas y necesitas sin agredir al otro ni anularte a ti mismo.",
    example: "'Entiendo tu urgencia, pero hoy no podré ayudarte porque tengo que entregar mi proyecto'."
  },
  {
    term: "Resiliencia",
    category: "Crecimiento",
    definition: "Capacidad psicológica de afrontar situaciones adversas, adaptarse con flexibilidad y extraer aprendizajes formativos.",
    simpleExplanation: "La flexibilidad del bambú: doblarse ante la tormenta sin romperse y volver a crecer con fuerza.",
    example: "Reorganizar un plan de vida tras la pérdida de un empleo, buscando nuevas oportunidades formativas."
  },
  {
    term: "Autorregulación Emocional",
    category: "Emociones",
    definition: "Habilidad para reconocer, aceptar y modular la intensidad y expresión de las respuestas afectivas sin reprimirlas ni desbordarse.",
    simpleExplanation: "Hacer una pausa entre lo que sientes y lo que decides hacer al respecto.",
    example: "Tomar tres respiraciones profundas antes de responder a un correo provocador."
  }
];

export default function DPGlosario() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');

  const categories = ['Todos', 'Identidad', 'Dirección', 'Acción', 'Hábitos', 'Relaciones', 'Emociones', 'Crecimiento'];

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
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            📚 DICCIONARIO PEDAGÓGICO
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Glosario de Desarrollo Personal</h2>
        <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Consulta definiciones claras, explicaciones sencillas y ejemplos cotidianos de los conceptos clave para tu proceso de crecimiento.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar concepto o término..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                category === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Glossary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-black text-slate-900">{item.term}</h3>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200">
                {item.category}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Definición:</span>
                <p className="text-slate-700 leading-relaxed">{item.definition}</p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="font-bold text-emerald-950 uppercase text-[10px] block">En Palabras Sencillas:</span>
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
