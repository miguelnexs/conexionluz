export interface CourseLesson {
  id: string;
  title: string;
  duration?: string;
  type: 'video' | 'reading' | 'quiz';
  videoUrl?: string | null;
  contentHtml?: string;
  contentText?: string;
  keyPoints?: string[];
  quiz?: {
    questions: Array<{
      id: string;
      prompt: string;
      choices: Array<{ id: string; text: string; isCorrect: boolean }>;
      explanation?: string;
    }>;
  };
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  lessons: CourseLesson[];
}

export interface CourseItem {
  id: string | number;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  highlights?: string[];
  category: string;
  badge: string;
  tags: string[];
  coverUrl: string;
  promoVideoUrl?: string | null;
  priceCOP?: number;
  priceLumis?: number;
  modulesCount?: number;
  duration?: string;
  instructor?: string;
  modules: CourseModule[];
}

export const ALL_MASTER_COURSES: CourseItem[] = [
  {
    id: 'autohipnosis',
    slug: 'autohipnosis',
    title: 'AUTOHIPNOSIS: Transforma tu Diálogo Interno y Dirige tu Mente',
    description:
      'Un viaje hacia el conocimiento consciente de tu propia mente. Aprende a entrar en relajación profunda y utilizar la autohipnosis para cultivar hábitos, autoestima, concentración y bienestar emocional.',
    longDescription:
      'La autohipnosis es una de las herramientas más potentes y validadas por la neurociencia moderna para reprogramar patrones automáticos, desactivar la hiperreactividad emocional y alinear el subconsciente con tus propósitos más elevados.\n\nEn este programa integral aprenderás el paso a paso científico para entrar en frecuencias de ondas cerebrales Alfa y Theta, diseñar autosugestiones de alto impacto positivo, crear anclajes somáticos para recuperar la calma instantáneamente y superar bloqueos de autoestima, concentración y hábitos limitantes.',
    highlights: [
      'Entrada al trance consciente en menos de 3 minutos con protocolos probados.',
      'Creación de anclajes somáticos para disolver la ansiedad en tiempo real.',
      'Neurobiología del cambio de ondas Beta a ritmos Alfa y Theta.',
      'Diseño de fórmulas cuánticas y reprogramación de creencias limitantes.',
    ],
    category: 'Autohipnosis & Neurociencia',
    badge: 'Autohipnosis & Neurociencia',
    tags: ['Autohipnosis', 'Neurociencia', 'Sugestión', 'Relajación', 'Trance', 'Hábitos', 'Autoestima'],
    coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    priceLumis: 500,
    modulesCount: 3,
    duration: '6 horas • 8 lecciones',
    instructor: 'Luz Amparo Valencia & Equipo Conexión Luz',
    modules: [
      {
        id: 'm1',
        title: 'Módulo 1: Fundamentos y Neurobiología del Trance',
        description: 'Bases científicas de la sugestión consciente y ondas cerebrales.',
        lessons: [
          {
            id: 'auto-l1',
            title: '1.1 ¿Qué es la Autohipnosis y cómo funciona el Subconsciente?',
            duration: '12 min',
            type: 'reading',
            contentText: `La autohipnosis es un estado natural de atención focalizada y relajación profunda en el cual la mente consciente se calma temporalmente, permitiendo que las sugestiones positivas alcancen directamente el subconsciente.\n\nContrario a los mitos populares, en ningún momento pierdes el control ni la voluntad. Al contrario: tomas el control directo sobre tus patrones de pensamiento, tus hábitos automáticos y tus respuestas emocionales.\n\nEl cerebro humano emite diferentes frecuencias eléctricas según el nivel de actividad mental. En la vigilia cotidiana operamos en ondas Beta. Al relajarnos profundamente pasamos a Alfa y Theta, donde la neuroplasticidad se incrementa exponencialmente y las sugestiones sanadoras se integran con facilidad.`,
            keyPoints: [
              'El subconsciente procesa el 95% de nuestras decisiones y hábitos diarios.',
              'En estado Alfa (8-12 Hz), la mente es altamente receptiva a reprogramaciones positivas.',
              'La repetición constante y la emoción elevada son el combustible que fija nuevas conexiones neuronales.',
            ],
          },
          {
            id: 'auto-l2',
            title: '1.2 Ondas Cerebrales: De Beta a Alfa y Theta',
            duration: '15 min',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            contentText: `Aprende cómo cambiar de la frecuencia Beta (estrés, hiperactividad mental) a la frecuencia Alfa y Theta mediante técnicas de respiración diafragmática y fijación visual.`,
            keyPoints: [
              'Ondas Beta (14-30 Hz): Estado de vigilia activa, análisis crítico y alerta.',
              'Ondas Alfa (8-13 Hz): Relajación consciente, visualización lúcida y meditación.',
              'Ondas Theta (4-7 Hz): Acceso al subconsciente profundo, creatividad y sanación emocional.',
            ],
          },
          {
            id: 'auto-l3',
            title: '1.3 Evaluación: Comprueba tus Conocimientos de Fundamentos',
            duration: '10 min',
            type: 'quiz',
            quiz: {
              questions: [
                {
                  id: 'q1',
                  prompt: '¿En qué estado de ondas cerebrales el subconsciente es más receptivo a las auto-sugestiones?',
                  choices: [
                    { id: 'c1', text: 'Ondas Beta altas (estado de estrés o alerta)', isCorrect: false },
                    { id: 'c2', text: 'Ondas Alfa y Theta (relajación profunda consciente)', isCorrect: true },
                    { id: 'c3', text: 'Ondas Gamma únicamente', isCorrect: false },
                  ],
                  explanation: 'En los ritmos Alfa y Theta disminuye el filtro crítico analítico, permitiendo la integración de nuevas sugestiones.',
                },
                {
                  id: 'q2',
                  prompt: '¿Se pierde el control o la voluntad durante la autohipnosis?',
                  choices: [
                    { id: 'c1', text: 'No, siempre mantienes el control, la lucidez y la conciencia de tu experiencia', isCorrect: true },
                    { id: 'c2', text: 'Sí, la persona queda completamente dormida e indefensa', isCorrect: false },
                  ],
                  explanation: 'La autohipnosis es un proceso de autocontrol consciente y empoderamiento personal.',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'm2',
        title: 'Módulo 2: Protocolos Prácticos de Inducción',
        description: 'Técnicas paso a paso para entrar en trance en menos de 3 minutos.',
        lessons: [
          {
            id: 'auto-l4',
            title: '2.1 El Método de Fijación Ocular y Cuenta Regresiva 10 a 1',
            duration: '18 min',
            type: 'reading',
            contentText: `Protocolo paso a paso para la inducción diaria:\n\n1. Encuentra una postura cómoda en una silla o sillón, con la espalda recta y las manos apoyadas sobre los muslos.\n2. Fija la mirada en un punto fijo del techo o pared ligeramente por encima de tu línea de visión natural.\n3. Respira profundamente en 4 tiempos y exhala lentamente en 6 tiempos por la boca.\n4. Con cada exhalación, permite que tus párpados se sientan más y más pesados hasta que se cierren suavemente por sí mismos.\n5. Inicia una cuenta regresiva del 10 al 1, imaginando que desciendes por una escalera de luz segura y relajante.`,
            keyPoints: [
              'No fuerces la relajación; permítete experimentarla con curiosidad y entrega.',
              'Si surgen pensamientos cotidianos, déjalos pasar como nubes en el cielo sin apegarte a ellos.',
              'La sensación de pesadez o ligereza en el cuerpo es una señal de trance óptimo.',
            ],
          },
          {
            id: 'auto-l5',
            title: '2.2 El Anclaje Somático de Seguridad y Serenidad',
            duration: '20 min',
            type: 'reading',
            contentText: `Un anclaje hipnótico es un disparador sensorial (como unir la yema del pulgar y el dedo índice de tu mano dominante) que evoca de forma automática un estado de profunda calma.\n\nEn esta lección aprenderás a cargar tu anclaje asociándolo a tus recuerdos más pacíficos y placenteros, reforzándolo cada día para usarlo en momentos de tensión, exámenes o situaciones retadoras.`,
            keyPoints: [
              'Crea un gesto discreto y reproducible en cualquier lugar público.',
              'Carga el anclaje en el momento de mayor intensidad emocional positiva.',
              'Practica el anclaje 3 veces al día durante 7 días consecutivos para consolidarlo.',
            ],
          },
        ],
      },
      {
        id: 'm3',
        title: 'Módulo 3: Auto-Sugestiones y Reprogramación',
        description: 'Fórmulas cuánticas para hábitos, autoestima y salud.',
        lessons: [
          {
            id: 'auto-l6',
            title: '3.1 Diseño de Afirmaciones Cuánticas en Presente y Positivo',
            duration: '15 min',
            type: 'reading',
            contentText: `Reglas de oro para crear autosugestiones altamente efectivas:\n\n1. Siempre en tiempo presente: "Yo elijo sentirme en paz", no "Yo me sentiré en paz".\n2. En positivo: Evita palabras de negación como "no", "nunca", "dejar de". El cerebro procesa primero el concepto visual.\n3. Breves y memorables: Frases con ritmo y carga emocional.\n4. Creíbles y progresivas: "Cada día me siento más confiado/a y capaz".`,
            keyPoints: [
              'El subconsciente responde a imágenes y emociones, no a discursos abstractos.',
              'Repite tu fórmula principal al entrar al trance y justo antes de salir.',
            ],
          },
          {
            id: 'auto-l7',
            title: '3.2 Evaluación Final del Curso de Autohipnosis',
            duration: '15 min',
            type: 'quiz',
            quiz: {
              questions: [
                {
                  id: 'q3',
                  prompt: '¿Cuál de las siguientes afirmaciones sigue correctamente las reglas de la autosugestión?',
                  choices: [
                    { id: 'c1', text: 'No voy a tener miedo al hablar en público', isCorrect: false },
                    { id: 'c2', text: 'Me siento seguro, tranquilo y fluido al expresar mis ideas con total claridad', isCorrect: true },
                    { id: 'c3', text: 'Espero que algún día se me quite la ansiedad', isCorrect: false },
                  ],
                  explanation: 'La opción B está en tiempo presente, redactada en positivo y evoca sensaciones claras de confianza.',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'hipnosis-ericksoniana',
    slug: 'hipnosis-ericksoniana',
    title: 'HIPNOSIS ERICKSONIANA: El Arte de Acompañar el Cambio',
    description:
      'Programa estructurado para estudiar los fundamentos de la Hipnosis Ericksoniana, el lenguaje permisivo, la utilización, el rapport, las metáforas, las inducciones y el diseño de experiencias hipnóticas.',
    category: 'Hipnosis Ericksoniana & Comunicación',
    badge: 'Hipnosis Ericksoniana',
    tags: ['Hipnosis Ericksoniana', 'Milton Erickson', 'Lenguaje Permisivo', 'Metáforas', 'Rapport', 'Trance'],
    coverUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80',
    priceLumis: 500,
    modulesCount: 2,
    duration: '8 horas • 5 lecciones',
    instructor: 'Juan David Martínez',
    modules: [
      {
        id: 'erick-m1',
        title: 'Módulo 1: La Filosofía y Lenguaje de Milton Erickson',
        lessons: [
          {
            id: 'erick-l1',
            title: '1.1 El Inconsciente como Reservorio de Recursos',
            duration: '18 min',
            type: 'reading',
            contentText: `Para Milton Erickson, el inconsciente no es un pozo de traumas reprimidos, sino un inmenso archivo de aprendizajes, memorias y habilidades olvidadas.\n\nEl rol del facilitador es crear las condiciones para que la persona conecte con esos recursos internos y genere sus propias soluciones de manera natural.`,
            keyPoints: [
              'Cada individuo tiene dentro de sí los recursos necesarios para sanar.',
              'La hipnosis no se impone: se co-crea en sintonía con el paciente.',
            ],
          },
          {
            id: 'erick-l2',
            title: '1.2 Lenguaje Permisivo vs. Directivo',
            duration: '20 min',
            type: 'reading',
            contentText: `A diferencia de la hipnosis clásica ('Cierra los ojos ahora'), Erickson utilizaba un lenguaje indirecto y respetuoso:\n\n- 'Y puedes preguntarte qué tan pronto notarás que tu respiración se vuelve más profunda...'\n- 'No sé si cerrarás los ojos con la próxima exhalación o con la siguiente...'\n\nEste patrón evita la resistencia y fomenta la cooperación voluntaria del inconsciente.`,
            keyPoints: [
              'Uso de dobles lazos terapéuticos.',
              'Pacing (acompañamiento) y Leading (conducción).',
            ],
          },
        ],
      },
      {
        id: 'erick-m2',
        title: 'Módulo 2: Metáforas Sanadoras e Historias Isomórficas',
        lessons: [
          {
            id: 'erick-l3',
            title: '2.1 Estructura de la Metáfora Ericksoniana',
            duration: '22 min',
            type: 'reading',
            contentText: `Las metáforas terapéuticas comunican verdades profundas sin activar las defensas del ego.\n\nAl relatar una historia sobre un árbol que supera el invierno, el inconsciente del oyente traslada la solución a sus propios desafíos cotidianos sin sentirse juzgado.`,
            keyPoints: [
              'El puente entre el personaje del cuento y la situación del oyente.',
              'Final abierto que permite la reinterpretación subconsciente.',
            ],
          },
          {
            id: 'erick-l4',
            title: '2.2 Evaluación de Hipnosis Ericksoniana',
            duration: '12 min',
            type: 'quiz',
            quiz: {
              questions: [
                {
                  id: 'eq1',
                  prompt: '¿Cuál es la característica principal del lenguaje permisivo ericksoniano?',
                  choices: [
                    { id: 'c1', text: 'Dar órdenes estrictas y demandar obediencia rápida', isCorrect: false },
                    { id: 'c2', text: 'Ofrecer opciones y sugerencias abiertas que respetan el ritmo de la persona', isCorrect: true },
                  ],
                  explanation: 'El lenguaje indirecto y permisivo disminuye la reactividad y permite una absorción cómoda del trance.',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'terapia-cognitivo-conductual',
    slug: 'terapia-cognitivo-conductual',
    title: 'TERAPIA COGNITIVO-CONDUCTUAL (TCC): Mente, Emoción y Conducta',
    description:
      'Comprende y transforma los patrones de pensamiento automático, distorsiones cognitivas y conductas desadaptativas mediante el modelo científico de la TCC aplicada al día a día.',
    category: 'TCC & Psicología Científica',
    badge: 'TCC & Psicología',
    tags: ['TCC', 'Modelo Cognitivo', 'Pensamientos Automáticos', 'Distorsiones', 'Reestructuración'],
    coverUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80',
    priceLumis: 500,
    modulesCount: 2,
    duration: '7 horas • 4 lecciones',
    instructor: 'Dr. Carlos Mendoza',
    modules: [
      {
        id: 'tcc-m1',
        title: 'Módulo 1: El Modelo Cognitivo de Aaron Beck',
        lessons: [
          {
            id: 'tcc-l1',
            title: '1.1 Situación - Pensamiento - Emoción - Conducta',
            duration: '16 min',
            type: 'reading',
            contentText: `La premisa central de la TCC es que no son las situaciones en sí mismas las que nos perturban, sino la interpretación que hacemos de ellas.\n\nAl identificar y cuestionar nuestros 'pensamientos automáticos negativos' (PANs), podemos regular la intensidad de la emoción y elegir conductas constructivas.`,
            keyPoints: [
              'El registro de pensamientos de 3 columnas.',
              'Distinción clara entre hechos reales e interpretaciones subjetivas.',
            ],
          },
          {
            id: 'tcc-l2',
            title: '1.2 Las 10 Distorsiones Cognitivas Más Comunes',
            duration: '22 min',
            type: 'reading',
            contentText: `Distorsiones comunes:\n\n1. Pensamiento Todo o Nada (Blanco o Negro).\n2. Catastrofización (Anticipar el peor escenario).\n3. Lectura del Pensamiento ('Seguro piensa mal de mí').\n4. Filtro Mental (Enfocarse solo en lo negativo).\n5. Deberías ('Debería ser perfecto').`,
            keyPoints: [
              'Aprende a etiquetar la distorsión para quitarle poder emocional.',
              'Busca evidencia objetiva a favor y en contra de cada pensamiento.',
            ],
          },
        ],
      },
      {
        id: 'tcc-m2',
        title: 'Módulo 2: Reestructuración y Cuestionamiento Socrático',
        lessons: [
          {
            id: 'tcc-l3',
            title: '2.1 Preguntas Socráticas para Desactivar la Ansiedad',
            duration: '20 min',
            type: 'reading',
            contentText: `Guía de preguntas socráticas:\n\n- ¿Qué evidencia real tengo de que esto va a suceder?\n- ¿Cuál es la probabilidad estadística real?\n- Si ocurriera lo peor, ¿qué recursos tengo para afrontarlo?\n- ¿Qué le diría a un buen amigo que tuviera este mismo pensamiento?`,
            keyPoints: [
              'El diálogo socrático transforma la catástrofe en un problema manejable.',
            ],
          },
          {
            id: 'tcc-l4',
            title: '2.2 Evaluación TCC',
            duration: '10 min',
            type: 'quiz',
            quiz: {
              questions: [
                {
                  id: 'tq1',
                  prompt: 'Según la TCC, ¿qué determina principalmente cómo nos sentimos ante un evento?',
                  choices: [
                    { id: 'c1', text: 'El evento externo de forma 100% directa', isCorrect: false },
                    { id: 'c2', text: 'El significado y pensamiento que asignamos al evento', isCorrect: true },
                  ],
                  explanation: 'Nuestras interpretaciones cognitivas son el motor que dispara la respuesta emocional y conductual.',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'desarrollo-personal',
    slug: 'desarrollo-personal',
    title: 'DESARROLLO PERSONAL: Crecimiento y Transformación Consciente',
    description:
      'Un camino estructurado de autoconocimiento, definición de metas trascendentes, construcción de hábitos atómicos, inteligencia emocional y resiliencia para florecer en todas las áreas de tu vida.',
    category: 'Desarrollo Personal & Crecimiento',
    badge: 'Desarrollo Personal',
    tags: ['Desarrollo Personal', 'Autoconocimiento', 'Hábitos', 'Metas SMART', 'Valores'],
    coverUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    priceLumis: 500,
    modulesCount: 2,
    duration: '8 horas • 4 lecciones',
    instructor: 'Dra. Laura Restrepo',
    modules: [
      {
        id: 'dp-m1',
        title: 'Módulo 1: La Brújula de Valores y Objetivos SMART',
        lessons: [
          {
            id: 'dp-l1',
            title: '1.1 Claridad de Valores Nucleares',
            duration: '15 min',
            type: 'reading',
            contentText: `Tus valores son los principios que definen lo que realmente importa para ti: paz, autenticidad, libertad, familia, aprendizaje.\n\nCuando tomas decisiones alineadas a tus valores, experimentas coherencia interna y desaparece la culpa o la indecisión crónica.`,
            keyPoints: [
              'Selecciona tus 5 valores no negociables.',
              'Evalúa el porcentaje de coherencia de tu semana respecto a ellos.',
            ],
          },
          {
            id: 'dp-l2',
            title: '1.2 Metas SMART Cuánticas',
            duration: '18 min',
            type: 'reading',
            contentText: `Estructura de metas:\n- Específica (Specific)\n- Medible (Measurable)\n- Alcanzable (Achievable)\n- Relevante (Relevant)\n- Temporalizada (Time-bound)\n\nAsocia cada meta a una emoción elevada para mantener la motivación constante.`,
            keyPoints: ['Divide metas grandes en micro-pasos diarios de 15 minutos.'],
          },
        ],
      },
      {
        id: 'dp-m2',
        title: 'Módulo 2: Hábitos Atómicos y Resiliencia',
        lessons: [
          {
            id: 'dp-l3',
            title: '2.1 El Bucle del Hábito: Señal, Deseo, Respuesta y Recompensa',
            duration: '20 min',
            type: 'reading',
            contentText: `Para cambiar un hábito no necesitas fuerza de voluntad bruta; necesitas optimizar el entorno.\n\nHaz que el buen hábito sea obvio, atractivo, fácil y satisfactorio. Haz que el mal hábito sea invisible, poco atractivo, difícil e insatisfactorio.`,
            keyPoints: ['Aplica la regla de los 2 minutos para iniciar cualquier hábito.'],
          },
          {
            id: 'dp-l4',
            title: '2.2 Evaluación de Desarrollo Personal',
            duration: '10 min',
            type: 'quiz',
            quiz: {
              questions: [
                {
                  id: 'dpq1',
                  prompt: '¿Cuál es la mejor estrategia para sostener un nuevo hábito a largo plazo?',
                  choices: [
                    { id: 'c1', text: 'Confiar solo en la motivación de un solo día', isCorrect: false },
                    { id: 'c2', text: 'Comenzar con pasos muy pequeños (micro-hábitos) y diseñar el entorno a favor', isCorrect: true },
                  ],
                  explanation: 'La constancia en micro-acciones supera a los arranques impulsivos.',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'inteligencia-emocional',
    slug: 'inteligencia-emocional',
    title: 'INTELIGENCIA EMOCIONAL: Autorregulación y Relaciones Conscientes',
    description:
      'Aprende a decodificar el mensaje oculto detrás de cada emoción, gestionar el estrés y la reactividad, y comunicarte desde el amor propio y la asertividad compasiva.',
    category: 'Inteligencia Emocional & Relaciones',
    badge: 'Inteligencia Emocional',
    tags: ['Inteligencia Emocional', 'Autorregulación', 'Empatía', 'Comunicación Asertiva'],
    coverUrl: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=1200&q=80',
    priceLumis: 500,
    modulesCount: 2,
    duration: '7 horas • 4 lecciones',
    instructor: 'Dra. Andrea Gómez',
    modules: [
      {
        id: 'ie-m1',
        title: 'Módulo 1: La Alquimia Emocional',
        lessons: [
          {
            id: 'ie-l1',
            title: '1.1 La Sabiduría Detrás de Cada Emoción',
            duration: '18 min',
            type: 'reading',
            contentText: `Ninguna emoción es 'mala'. Todas son mensajeras biológicas:\n\n- Miedo: Te pide protección y preparación.\n- Ira: Señala un límite violado o injusticia.\n- Tristeza: Invita al recogimiento y a soltar una pérdida.\n- Culpa: Te alerta de una incongruencia con tus valores.\n\nCuando escuchas el mensaje sin reprimirlo, la emoción fluye y se disuelve en minutos.`,
            keyPoints: [
              'Siente la emoción en el cuerpo durante 90 segundos sin alimentarla con pensamientos de queja.',
            ],
          },
        ],
      },
      {
        id: 'ie-m2',
        title: 'Módulo 2: Asertividad y Comunicación Consciente',
        lessons: [
          {
            id: 'ie-l2',
            title: '2.1 La Fórmula de Comunicación No Violenta (CNV)',
            duration: '22 min',
            type: 'reading',
            contentText: `Fórmula de 4 pasos de Marshall Rosenberg:\n\n1. Observación de hechos concretos (sin juicios).\n2. Expresión de mi sentimiento ('Me siento abrumado').\n3. Necesidad universal ('Porque necesito orden/apoyo').\n4. Petición clara y concreta en positivo ('¿Podrías ayudarme con...?').`,
            keyPoints: ['Habla desde el "Yo siento", no desde el "Tú eres".'],
          },
          {
            id: 'ie-l3',
            title: '2.2 Evaluación de Inteligencia Emocional',
            duration: '10 min',
            type: 'quiz',
            quiz: {
              questions: [
                {
                  id: 'ieq1',
                  prompt: '¿Qué función cumple la emoción de la ira cuando es escuchada conscientemente?',
                  choices: [
                    { id: 'c1', text: 'Atacar o herir a las personas cercanas', isCorrect: false },
                    { id: 'c2', text: 'Señalar un límite personal que debe ser comunicado con firmeza y respeto', isCorrect: true },
                  ],
                  explanation: 'La ira sana es energía para proteger nuestra dignidad y establecer límites claros.',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'autoconocimiento',
    slug: 'autoconocimiento',
    title: 'AUTOCONOCIMIENTO: La Maestría de tu Mundo Interior',
    description:
      'Exploración profunda de tu historia personal, mapa de fortalezas, heridas del niño interior y sistemas de creencias para vivir con autenticidad y libertad emocional.',
    category: 'Autoconocimiento & Filosofía',
    badge: 'Autoconocimiento',
    tags: ['Autoconocimiento', 'Identidad', 'Fortalezas', 'Introspección', 'Valores'],
    coverUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    priceLumis: 500,
    modulesCount: 2,
    duration: '8 horas • 4 lecciones',
    instructor: 'Equipo Conexión Luz',
    modules: [
      {
        id: 'ac-m1',
        title: 'Módulo 1: El Observador Consciente y la Sombra',
        lessons: [
          {
            id: 'ac-l1',
            title: '1.1 Des-identificándote del Personaje',
            duration: '18 min',
            type: 'reading',
            contentText: `Tú no eres tus pensamientos, ni tus títulos, ni tus errores del pasado. Eres el espacio de conciencia tranquila que observa todo lo anterior.\n\nCuando despiertas el rol de Observador, el drama pierde su fuerza hipnótica sobre ti.`,
            keyPoints: [
              'La diferencia entre reaccionar en piloto automático y responder con presencia.',
            ],
          },
        ],
      },
      {
        id: 'ac-m2',
        title: 'Módulo 2: Integración del Niño Interior',
        lessons: [
          {
            id: 'ac-l2',
            title: '2.1 El Abrazo a la Vulnerabilidad',
            duration: '20 min',
            type: 'reading',
            contentText: `Muchas de nuestras reacciones adultas (miedo al rechazo, necesidad de aprobación) provienen de un niño interior que sintió soledad o desprotección.\n\nEn este ejercicio visualizamos a ese niño, lo acogemos en el corazón y le aseguramos que el adulto que somos hoy se hace cargo con amor y seguridad.`,
            keyPoints: [
              'Conviértete en el padre/madre amoroso que tu niño siempre necesitó.',
            ],
          },
          {
            id: 'ac-l3',
            title: '2.2 Evaluación de Autoconocimiento',
            duration: '10 min',
            type: 'quiz',
            quiz: {
              questions: [
                {
                  id: 'acq1',
                  prompt: '¿Qué es el "Observador Consciente" en la práctica de introspección?',
                  choices: [
                    { id: 'c1', text: 'Una voz crítica que juzga severamente cada pensamiento', isCorrect: false },
                    { id: 'c2', text: 'La conciencia tranquila que atestigua las experiencias sin identificarse ciegamente con ellas', isCorrect: true },
                  ],
                  explanation: 'El Observador es presencia neutral que aporta claridad y paz interior.',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'mediacion-atencion-plena',
    slug: 'mediacion-atencion-plena',
    title: 'MEDIACIÓN Y ATENCIÓN PLENA: Presencia & Metaconciencia',
    description:
      'Un programa de exploración de la experiencia presente basado en la observación consciente de pensamientos, sensaciones y realidad externa. Desarrolla la capacidad de observar antes de reaccionar.',
    category: 'Mediación & Metaconciencia',
    badge: 'Atención Plena',
    tags: ['Mediación', 'Atención Plena', 'Metacognición', 'Presencia', 'Calma'],
    coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    priceLumis: 500,
    modulesCount: 2,
    duration: '9 horas • 4 lecciones',
    instructor: 'Juan David Martínez & Luz Amparo',
    modules: [
      {
        id: 'map-m1',
        title: 'Módulo 1: El Poder del Presente y la Respiración',
        lessons: [
          {
            id: 'map-l1',
            title: '1.1 Micro-Pausas Conscientes de 3 Minutos',
            duration: '16 min',
            type: 'reading',
            contentText: `No necesitas horas en una cueva para meditar. Las micro-pausas consisten en:\n\n1. Detente donde estés.\n2. Inhala profundo y siente el aire entrando por tus fosas nasales.\n3. Escucha 3 sonidos a tu alrededor sin juzgarlos.\n4. Continúa con tu actividad desde un estado de calma renovada.`,
            keyPoints: [
              'Integra 5 micro-pausas al día (al despertar, antes de comer, al pausar el trabajo, etc.).',
            ],
          },
        ],
      },
      {
        id: 'map-m2',
        title: 'Módulo 2: Metaconciencia y No-Reactividad',
        lessons: [
          {
            id: 'map-l2',
            title: '2.1 El Espacio entre Estímulo y Respuesta',
            duration: '22 min',
            type: 'reading',
            contentText: `Como escribió Viktor Frankl: 'Entre el estímulo y la respuesta hay un espacio. En ese espacio reside nuestro poder para elegir nuestra respuesta. En nuestra respuesta radica nuestro crecimiento y nuestra libertad.'`,
            keyPoints: [
              'La atención plena ensancha ese espacio para no ser rehenes de la impulsividad.',
            ],
          },
          {
            id: 'map-l3',
            title: '2.2 Evaluación de Atención Plena',
            duration: '10 min',
            type: 'quiz',
            quiz: {
              questions: [
                {
                  id: 'mapq1',
                  prompt: '¿Cuál es el objetivo primordial de la atención plena (Mindfulness)?',
                  choices: [
                    { id: 'c1', text: 'Poner la mente en blanco y no sentir nada', isCorrect: false },
                    { id: 'c2', text: 'Prestar atención al momento presente con aceptación, curiosidad y sin juzgar', isCorrect: true },
                  ],
                  explanation: 'Atención plena no es vaciar la mente, sino relacionarse amablemente con lo que ocurre aquí y ahora.',
                },
              ],
            },
          },
        ],
      },
    ],
  },
];
