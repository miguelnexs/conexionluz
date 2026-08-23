import React, { useState } from 'react';
import { Search, BookOpen, Sparkles } from 'lucide-react';

const GLOSSARY_ITEMS = [
  {
    term: "Inteligencia Emocional",
    category: "Fundamento",
    definition: "Capacidad de reconocer, comprender, regular y expresar eficazmente las propias emociones, así como conectar con las de los demás para mejorar la convivencia.",
    simpleExplanation: "Llevarse bien con las propias emociones y saber comunicarse con empatía con las personas.",
    example: "Hacer una pausa antes de gritar cuando estás enojado y expresar lo que necesitas con serenidad."
  },
  {
    term: "Emoción",
    category: "Fundamento",
    definition: "Respuesta psicofisiológica automática, rápida e intensa ante un estímulo interno o externo que prepara al cuerpo para la acción.",
    simpleExplanation: "El impulso biológico inmediato que sientes ante un suceso.",
    example: "El sobresalto y aceleración del corazón al escuchar un frenazo repentino en la calle."
  },
  {
    term: "Sentimiento",
    category: "Fundamento",
    definition: "Experiencia consciente y duradera que surge tras procesar cognitivamente una emoción con pensamientos e interpretaciones.",
    simpleExplanation: "Lo que queda en tu mente una vez que entiendes y razonas la emoción inicial.",
    example: "El sentimiento de gratitud hacia un amigo tras reflexionar sobre su apoyo constante."
  },
  {
    term: "Granularidad Emocional",
    category: "Autoconocimiento",
    definition: "Habilidad para identificar y distinguir con alta precisión los matices afectivos en lugar de utilizar etiquetas globales.",
    simpleExplanation: "Poder decir 'siento desazón y aprensión' en lugar de un vago 'me siento mal'.",
    example: "Reconocer que detrás de tu mal humor hay cansancio físico y hambre, no enfado real."
  },
  {
    term: "Pausa Consciente",
    category: "Autorregulación",
    definition: "Interrupción voluntaria del piloto automático para desactivar la reactividad somática antes de responder ante un estímulo.",
    simpleExplanation: "Contar hasta diez o respirar profundamente antes de reaccionar impulsivamente.",
    example: "Respirar 30 segundos antes de enviar un mensaje en caliente."
  },
  {
    term: "Validación Emocional",
    category: "Empatía",
    definition: "Reconocimiento y aceptación explícita de que la experiencia afectiva de otra persona es comprensible y legítima.",
    simpleExplanation: "Decirle a alguien 'entiendo que te sientas así' sin juzgarlo ni minimizar su dolor.",
    example: "Escuchar a tu hijo triste por perder un juguete sin decirle 'no es para tanto'."
  },
  {
    term: "Comunicación Asertiva",
    category: "Relaciones",
    definition: "Forma de expresión clara, honesta y respetuosa que transmite necesidades y límites sin recurrir a la agresión ni a la sumisión.",
    simpleExplanation: "Poner tus límites y decir lo que piensas con firmeza y amabilidad.",
    example: "'No puedo asumir esta tarea hoy, pero mañana con gusto la revisamos'."
  },
  {
    term: "Escucha Activa",
    category: "Empatía",
    definition: "Atención plena a las palabras, lenguaje corporal y tono del interlocutor sin planear la respuesta mental mientras habla.",
    simpleExplanation: "Escuchar con los ojos, el cuerpo y el corazón sin interrumpir.",
    example: "Hacer preguntas de curiosidad genuina para entender mejor el punto de vista del otro."
  }
];

export default function IEGlosario() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');

  const categories = ['Todos', 'Fundamento', 'Autoconocimiento', 'Autorregulación', 'Empatía', 'Relaciones'];

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
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/30 border border-teal-400/40 text-teal-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            📚 DICCIONARIO CONCEPTUAL
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Glosario de Inteligencia Emocional</h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Consulta términos clave, definiciones académicas, explicaciones sencillas y ejemplos aplicados a la vida cotidiana.
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
            placeholder="Buscar término o concepto..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                category === cat
                  ? 'bg-teal-600 text-white shadow-xs'
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
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border bg-teal-50 text-teal-800 border-teal-200">
                {item.category}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Definición:</span>
                <p className="text-slate-700 leading-relaxed">{item.definition}</p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="font-bold text-teal-950 uppercase text-[10px] block">En Palabras Sencillas:</span>
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
