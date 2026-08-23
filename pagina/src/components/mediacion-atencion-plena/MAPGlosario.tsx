import React, { useState } from 'react';
import { 
  BookMarked, 
  Search, 
  Sparkles, 
  Brain, 
  Eye, 
  Layers, 
  Compass,
  Tag
} from 'lucide-react';

interface Termino {
  id: string;
  termino: string;
  categoria: 'Conciencia & Atención' | 'Procesos Mentales' | 'Sistema Emocional' | 'Acción & Práctica';
  definicion: string;
  explicacion: string;
  ejemplo: string;
  aplicacionMediacion: string;
}

const GLOSARIO_TERMINOS: Termino[] = [
  {
    id: 'atencion-plena',
    termino: 'Atención Plena',
    categoria: 'Conciencia & Atención',
    definicion: 'Capacidad humana básica de estar completamente presente, consciente de dónde estamos y qué estamos haciendo.',
    explicacion: 'No consiste en forzar la mente a estar en blanco, sino en observar la experiencia momento a momento sin reaccionar ciegamente.',
    ejemplo: 'Sentir la temperatura del agua mientras te lavas las manos sin perderte en preocupaciones futuras.',
    aplicacionMediacion: 'Sirve como la actitud base de apertura y curiosidad que sostiene toda la práctica de observación.'
  },
  {
    id: 'mediacion',
    termino: 'Mediación',
    categoria: 'Acción & Práctica',
    definicion: 'Práctica de observación consciente desarrollada por ConexiónLuz que unifica la realidad interna y la realidad externa en el presente.',
    explicacion: 'Entrena la capacidad de simultaneidad: percibir pensamientos, emociones y sensaciones corporales MIENTRAS se está plenamente en contacto con el entorno.',
    ejemplo: 'Estar en una junta laboral observando tu respiración y calma interna mientras escuchas activamente a tus colegas.',
    aplicacionMediacion: 'Es el eje central de este programa formativo.'
  },
  {
    id: 'conciencia',
    termino: 'Conciencia',
    categoria: 'Conciencia & Atención',
    definicion: 'El estado de percatación y experiencia subjetiva directa de los fenómenos.',
    explicacion: 'Es el espacio donde se manifiestan los pensamientos, emociones, imágenes y sensaciones sensoriales.',
    ejemplo: '"Sé que estoy despierto y sintiendo frío en las manos".',
    aplicacionMediacion: 'Es el escenario donde ocurre tanto lo interno como lo externo.'
  },
  {
    id: 'metacognicion',
    termino: 'Metacognición',
    categoria: 'Procesos Mentales',
    definicion: 'La capacidad reflexiva de observar y supervisar los propios procesos de pensamiento.',
    explicacion: 'Pensar sobre cómo pensamos, identificando sesgos, suposiciones, atajos mentales e interpretaciones.',
    ejemplo: 'Preguntarte: "¿Por qué estoy asumiendo que esta persona me está juzgando?".',
    aplicacionMediacion: 'Permite cuestionar la validez de los pensamientos automáticos antes de actuar.'
  },
  {
    id: 'metaconciencia',
    termino: 'Metaconciencia',
    categoria: 'Conciencia & Atención',
    definicion: 'La observación consciente y explícita de la propia experiencia en curso ("darse cuenta de que uno se está dando cuenta").',
    explicacion: 'Introduce una distancia observacional lúcida respecto a cualquier contenido mental o sensorial.',
    ejemplo: '"Me doy cuenta de que mi mente se había ido a planificar las compras de mañana".',
    aplicacionMediacion: 'Es el interruptor que apaga el piloto automático y activa el retorno al presente.'
  },
  {
    id: 'pensamiento',
    termino: 'Pensamiento',
    categoria: 'Procesos Mentales',
    definicion: 'Evento cognitivo transitorio en forma de lenguaje interno, imagen, memoria o idea.',
    explicacion: 'Una hipótesis o producción de la mente que no necesariamente equivale a un hecho objetivo.',
    ejemplo: '"No voy a terminar a tiempo".',
    aplicacionMediacion: 'Se observa como un objeto mental que pasa por el campo de conciencia sin fusionarse con él.'
  },
  {
    id: 'observacion',
    termino: 'Observación',
    categoria: 'Acción & Práctica',
    definicion: 'Acto voluntario y receptivo de presenciar un fenómeno sin juzgarlo inmediatamente ni intentar modificarlo.',
    explicacion: 'Permite que la experiencia se revele con claridad antes de emitir cualquier juicio o intervención.',
    ejemplo: 'Escuchar el zumbido de un ventilador sin etiquetarlo como insoportable.',
    aplicacionMediacion: 'Es el primer paso innegociable de la secuencia de ConexiónLuz.'
  },
  {
    id: 'autoobservacion',
    termino: 'Autoobservación',
    categoria: 'Acción & Práctica',
    definicion: 'Observación deliberada dirigida hacia los fenómenos del mundo interior propio.',
    explicacion: 'Monitoreo amable de las sensaciones somáticas, el diálogo interno y los estados emocionales.',
    ejemplo: 'Notar que tu tono de voz se acelera cuando te sientes inseguro.',
    aplicacionMediacion: 'Aporta la información interna necesaria para equilibrar con el mundo externo.'
  },
  {
    id: 'emocion',
    termino: 'Emoción',
    categoria: 'Sistema Emocional',
    definicion: 'Respuesta psicofisiológica multidimensional y adaptativa ante estímulos internos o externos.',
    explicacion: 'Aporta datos valiosos sobre nuestras necesidades, límites y valores en relación con la situación presente.',
    ejemplo: 'El miedo señalando la necesidad de protección o precaución.',
    aplicacionMediacion: 'Se acoge como una fuente de información relevante y no como una orden reactiva.'
  },
  {
    id: 'sistema-emocional',
    termino: 'Sistema Emocional',
    categoria: 'Sistema Emocional',
    definicion: 'Conjunto integrado de estructuras neurobiológicas, hormonales y afectivas que procesan el valor de las vivencias.',
    explicacion: 'Diseñado evolutivamente para la supervivencia y la adaptación rápida.',
    ejemplo: 'El circuito de la amígdala y el sistema límbico respondiendo ante amenazas o recompensas.',
    aplicacionMediacion: 'Se pone conscientemente al servicio de la metaconciencia.'
  },
  {
    id: 'conciencia-corporal',
    termino: 'Conciencia Corporal',
    categoria: 'Acción & Práctica',
    definicion: 'Percepción consciente y directa de las señales somáticas, interoceptivas y propioceptivas del organismo.',
    explicacion: 'El cuerpo físico solo habita el tiempo presente, convirtiéndose en el ancla más estable para la atención.',
    ejemplo: 'Sentir los latidos del corazón, el calor en las manos o la distensión del abdomen al respirar.',
    aplicacionMediacion: 'Ancla la mente divagante en la realidad concreta del momento.'
  },
  {
    id: 'presente',
    termino: 'Presente',
    categoria: 'Conciencia & Atención',
    definicion: 'La única dimensión temporal donde ocurren de manera simultánea la vida real, la percepción y la acción.',
    explicacion: 'El pasado solo existe como memoria actual y el futuro como proyección imaginada en el presente.',
    ejemplo: 'Este instante exacto en el que tus ojos leen estas palabras.',
    aplicacionMediacion: 'El campo unificado donde confluyen la realidad interna y la externa.'
  },
  {
    id: 'atencion',
    termino: 'Atención',
    categoria: 'Conciencia & Atención',
    definicion: 'Mecanismo cognitivo que selecciona, focaliza y filtra la información relevante dentro del flujo de la conciencia.',
    explicacion: 'Funciona como una linterna cuyo haz puede concentrarse en un punto o abrirse panorámicamente.',
    ejemplo: 'Enfocar la mirada en una persona que habla en medio de un salón concurrido.',
    aplicacionMediacion: 'Es la herramienta ejecutable que movemos con voluntad y amabilidad.'
  },
  {
    id: 'distraccion',
    termino: 'Distracción',
    categoria: 'Procesos Mentales',
    definicion: 'Desviación espontánea de la atención hacia un estímulo secundario o un pensamiento derivado.',
    explicacion: 'Es un fenómeno natural del cerebro asociativo que no constituye un fracaso personal.',
    ejemplo: 'Estar leyendo y de pronto recordar que olvidaste comprar pan.',
    aplicacionMediacion: 'Se utiliza como el detonante que permite ejercitar el retorno voluntario.'
  },
  {
    id: 'exaptacion',
    termino: 'Exaptación',
    categoria: 'Sistema Emocional',
    definicion: 'Concepto biológico que describe cuando una estructura evolutiva adopta una nueva función; aplicado en el curso como metáfora educativa.',
    explicacion: 'Utilizar el sistema emocional, diseñado para respuestas rápidas de supervivencia, como sensor de información para la metaconciencia.',
    ejemplo: 'Usar la ira no para agredir físicamente, sino para identificar con claridad un límite que ha sido vulnerado.',
    aplicacionMediacion: 'Transforma la emoción reactiva en sabiduría y discernimiento.'
  },
  {
    id: 'percepcion',
    termino: 'Percepción',
    categoria: 'Procesos Mentales',
    definicion: 'Proceso de organización e interpretación de los datos sensoriales brutos en experiencias significativas.',
    explicacion: 'El puente entre el mundo físico externo y la representación mental interna.',
    ejemplo: 'Reconocer que ciertas ondas de luz corresponden al rostro sonriente de un amigo.',
    aplicacionMediacion: 'Se observa como la segunda fase en el Mapa de Mediación.'
  },
  {
    id: 'respuesta',
    termino: 'Respuesta',
    categoria: 'Acción & Práctica',
    definicion: 'Conducta deliberada, consciente y alineada con valores emitida tras una pausa de observación.',
    explicacion: 'Opuesta a la reacción refleja automática; nace de la libertad y el discernimiento.',
    ejemplo: 'Elegir dialogar con serenidad ante una provocación en vez de gritar.',
    aplicacionMediacion: 'Es el fruto y culminación del proceso de mediación en la vida real.'
  },
  {
    id: 'reaccion',
    termino: 'Reacción',
    categoria: 'Sistema Emocional',
    definicion: 'Conducta automática, refleja e impulsiva disparada sin mediación consciente previa.',
    explicacion: 'Gobernada por patrones aprendidos o circuitos de supervivencia de corto plazo.',
    ejemplo: 'Responder con sarcasmo instantáneo ante una crítica laboral.',
    aplicacionMediacion: 'Es el patrón que la mediación aprende a pausar y desactivar.'
  },
  {
    id: 'impulso',
    termino: 'Impulso',
    categoria: 'Sistema Emocional',
    definicion: 'Carga de energía psicofisiológica que empuja a realizar una acción inmediata.',
    explicacion: 'Se manifiesta somáticamente como una urgencia motora o verbal antes de que la razón intervenga.',
    ejemplo: 'La urgencia de interrumpir a alguien mientras habla.',
    aplicacionMediacion: 'Se reconoce en el cuerpo para permitir que pase sin convertirse automáticamente en acción.'
  },
  {
    id: 'experiencia',
    termino: 'Experiencia',
    categoria: 'Conciencia & Atención',
    definicion: 'La totalidad viva de lo que acontece en la conciencia en un momento dado.',
    explicacion: 'Abarca percepciones, pensamientos, emociones, sensaciones y el contacto con el entorno.',
    ejemplo: 'La vivencia integral de caminar por un bosque sintiendo el viento, la fatiga y el asombro.',
    aplicacionMediacion: 'Es el territorio vivo y dinámico que la mediación abraza sin excluir nada.'
  }
];

export default function MAPGlosario() {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<Termino | null>(null);

  const categories = ['all', 'Conciencia & Atención', 'Procesos Mentales', 'Sistema Emocional', 'Acción & Práctica'];

  const filtered = GLOSARIO_TERMINOS.filter((t) => {
    const matchesCat = selectedCat === 'all' || t.categoria === selectedCat;
    const q = search.toLowerCase();
    const matchesSearch = 
      t.termino.toLowerCase().includes(q) ||
      t.definicion.toLowerCase().includes(q) ||
      t.explicacion.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/20 border border-teal-400/30 text-teal-200 px-3.5 py-1 rounded-full flex items-center gap-1.5">
            <BookMarked className="h-3.5 w-3.5 text-teal-300" />
            MARCO CONCEPTUAL CONEXIÓNLUZ
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Glosario de Mediación y Atención Plena
        </h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Los 20 conceptos fundamentales del programa explicados con rigor pedagógico: Definición, Explicación, Ejemplo cotidiano y Aplicación práctica en la Mediación.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar término, concepto o palabra clave..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCat === cat
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'Todos (20)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedTerm(item)}
            className="bg-white border border-slate-200/90 hover:border-teal-400/90 rounded-3xl p-5 shadow-2xs transition-all duration-200 cursor-pointer space-y-3 hover:shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <h3 className="text-base font-black text-slate-900">{item.termino}</h3>
                <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-full">
                  {item.categoria}
                </span>
              </div>

              <p className="text-xs text-slate-700 font-medium leading-relaxed mt-2.5">
                {item.definicion}
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl text-[11px] text-slate-600 mt-3 space-y-1">
                <span className="font-bold text-slate-900 block">💡 Ejemplo:</span>
                <p className="italic leading-relaxed">{item.ejemplo}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-teal-700">
              <span>Ver aplicación en mediación</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Full Term Deep Dive */}
      {selectedTerm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                  {selectedTerm.categoria}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{selectedTerm.termino}</h3>
              </div>
              <button
                onClick={() => setSelectedTerm(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-medium text-slate-700">
              <div className="space-y-1">
                <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-wider">1. Definición Formal</h4>
                <p className="text-sm font-semibold text-slate-800 leading-relaxed">{selectedTerm.definicion}</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-wider">2. Explicación Pedagógica</h4>
                <p className="text-slate-600 leading-relaxed">{selectedTerm.explicacion}</p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-wider">3. Ejemplo Cotidiano</h4>
                <p className="italic text-slate-700 leading-relaxed">"{selectedTerm.ejemplo}"</p>
              </div>

              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-1">
                <h4 className="font-black text-teal-950 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-teal-600" /> 4. Aplicación en la Práctica de Mediación
                </h4>
                <p className="text-teal-900 font-semibold leading-relaxed">{selectedTerm.aplicacionMediacion}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTerm(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
