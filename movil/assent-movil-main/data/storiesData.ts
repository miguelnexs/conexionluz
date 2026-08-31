export interface StoryComment {
  id: string | number;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  likesCount?: number;
}

export interface StoryChapter {
  number: number;
  title: string;
  paragraphs: string[];
}

export interface StoryItem {
  id: number | string;
  slug: string;
  title: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  coverUrl: string;
  contentHtml?: string;
  plainExcerpt: string;
  quote?: string;
  readingTime: string;
  createdAt: string;
  priceLumis: number;
  isFree: boolean;
  likesCount: number;
  commentsCount: number;
  chapters?: StoryChapter[];
  keyTakeaways?: string[];
  comments?: StoryComment[];
}

export const ALL_MASTER_STORIES: StoryItem[] = [
  {
    id: 1,
    slug: 'el-despertar-tras-la-tormenta',
    title: 'El Despertar tras la Tormenta: El Sendero hacia la Paz Interior',
    author: 'Dra. Elena Ramos',
    authorRole: 'Psicóloga Clínica & Especialista en Trauma',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    category: 'Ansiedad & Resiliencia',
    tags: ['Gratis', 'Ansiedad', 'Resiliencia', 'Paz Interior', 'Conexión Luz'],
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    plainExcerpt:
      'Una travesía real, neurobiológica y compasiva para desarmar los ataques de pánico, comprender la alquimia del sistema nervioso y habitar la calma plena en el presente.',
    quote:
      'La ansiedad no es un defecto de tu carácter ni una falla espiritual. Es el grito desesperado de un sistema nervioso agotado que ruega que regreses al instante presente.',
    readingTime: '8 min de lectura',
    createdAt: '2025-01-15',
    priceLumis: 0,
    isFree: true,
    likesCount: 142,
    commentsCount: 28,
    chapters: [
      {
        number: 1,
        title: 'El Día en que el Mundo se Detuvo',
        paragraphs: [
          'Eran las tres de la mañana de un martes cualquiera cuando desperté con la sensación ineludible de que mi cuerpo sucumbía. El corazón martillaba contra mi tórax con una violencia abrumadora, el oxígeno parecía haberse evaporado de la habitación y una ola de calor helado descendió en picada por mi columna vertebral.',
          'Durante más de seis meses intenté camuflar aquellos episodios bajo la etiqueta inofensiva de "estrés acumulado por el trabajo". Continué cumpliendo jornadas de catorce horas, sonriendo en videoconferencias y repitiendo de memoria que todo marchaba excelente. Sin embargo, la biología posee una contabilidad inexorable.',
          'Aquel ataque de pánico no fue un accidente fortuito; fue el colapso de un estilo de vida basado en la hipervigilancia permanente. Me di cuenta de que llevaba años viviendo en estado de guerra interior, exigiendo a mi cuerpo rendimientos sobrehumanos mientras ignoraba su necesidad básica de descanso y seguridad.',
        ],
      },
      {
        number: 2,
        title: 'La Neurociencia de la Desmovilización Emocional',
        paragraphs: [
          'El verdadero punto de inflexión ocurrió cuando decidí estudiar la fisiología del miedo en lugar de temerle. Comprendí que el nervio vago actúa como el freno biológico de nuestro cuerpo. Cuando percibimos amenaza, el sistema nervioso simpático activa la respuesta de "lucha o huida".',
          'Cuando la mente interpreta que la taquicardia es peligrosa, se genera un bucle cerrado: el cerebro envía más adrenalina porque cree que el peligro aumenta. Para romper este círculo vicioso, debemos enviar señales somáticas inversas a través del cuerpo, mediante la respiración extendida y el ablandamiento muscular.',
        ],
      },
      {
        number: 3,
        title: 'El Protocolo Práctico de la Aceptación Radical',
        paragraphs: [
          'Desarrollé una práctica diaria basada en tres pilares: en lugar de huir cuando la opresión torácica aparecía, me sentaba en el suelo, apoyaba la espalda contra la pared, colocaba una mano en el corazón y otra en el diafragma y repetía internamente: "Acepto esta sensación. Es solo energía atravesando mis nervios. Estoy a salvo en este instante".',
          'Al no ofrecer resistencia, la ola biológica alcanzaba su cresta y descendía naturalmente en menos de dos minutos. Sin miedo al miedo, la ansiedad pierde su veneno.',
        ],
      },
    ],
    keyTakeaways: [
      'Exhalación Prolongada (4-8): Inhala en 4s por la nariz y exhala en 8s por la boca para activar el nervio vago.',
      'Orientación Espacial: Nombra 5 colores, 4 texturas, 3 sonidos y 2 olores para desenganchar el pánico.',
      'Aceptación Somática: El cuerpo procesa una descarga de adrenalina en menos de 90 segundos si no le agregas pensamientos alarmistas.',
    ],
    comments: [
      {
        id: 'c1',
        authorName: 'Camila Restrepo',
        authorRole: 'Miembro de la Comunidad',
        content: 'Este relato me dio una perspectiva completamente nueva sobre mis crisis. Las técnicas somáticas funcionan de verdad.',
        createdAt: 'Hace 2 días',
        likesCount: 14,
      },
      {
        id: 'c2',
        authorName: 'Mauricio Gómez',
        authorRole: 'Practicante Cuántico',
        content: 'La distinción entre luchar contra el síntoma y permitirlo me cambió la vida. ¡Gracias por compartir tanta luz!',
        createdAt: 'Hace 4 días',
        likesCount: 9,
      },
    ],
  },
  {
    id: 2,
    slug: 'la-metamorfosis-del-silencio',
    title: 'La Metamorfosis del Silencio: Sanando las Heridas de la Infancia',
    author: 'Carlos Mendoza',
    authorRole: 'Facilitador de Reparentalización Consciente',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    category: 'Sanación Emocional & Niño Interior',
    tags: ['Lumis: 10', 'Niño Interior', 'Sanación', 'Autocompasión', 'Trauma'],
    coverUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80',
    plainExcerpt:
      'Un análisis íntimo sobre cómo las palabras reprimidas en los primeros años esculpen los bloqueos del adulto, y la metodología para liberar tu voz genuina.',
    quote:
      'El niño que fuiste sigue aguardando en algún rincón de tu mente a que el adulto en el que te convertiste lo tome de la mano y le diga: "Ya no tienes que complacer a nadie; yo soy tu refugio".',
    readingTime: '10 min de lectura',
    createdAt: '2025-01-20',
    priceLumis: 10,
    isFree: false,
    likesCount: 98,
    commentsCount: 19,
    chapters: [
      {
        number: 1,
        title: 'El Escudo del "Buen Niño" y la Complacencia Neurótica',
        paragraphs: [
          'Crecí bajo el mandato implícito de que para ser aceptado debía volverme invisible. En la estructura de mi hogar, las demostraciones de vulnerabilidad o el enojo eran recibidas con el castigo de la indiferencia prolongada o la desaprobación severa.',
          'Lo que en la infancia operó como una estrategia adaptativa de supervivencia emocional se convirtió en una condena durante mi vida adulta. Me transformé en una persona incapaz de establecer límites sanos, que toleraba faltas de respeto por el terror a provocar discordia.',
        ],
      },
      {
        number: 2,
        title: 'El Despertar de la Rabia Sagrada y el Auto-Cuidado',
        paragraphs: [
          'El verdadero quiebre terapéutico se produjo el día en que me atreví a experimentar rabia sin culpa. Descubrí que la rabia saludable es el fuego instintivo que delimita nuestra soberanía personal y defiende nuestra dignidad.',
          'Lloré amargamente las lágrimas que el niño de ocho años tuvo que reprimirse. El proceso de sanar no es volverse químicamente "positivo", sino permitirse la totalidad de la experiencia humana con autocompasión.',
        ],
      },
    ],
    keyTakeaways: [
      'Contacto Visual de Espejo: Mírate a los ojos dos minutos al despertar y valida tus emociones sin juzgarte.',
      'Cartas de Descarga Emocional: Escribe sin censura lo que dolió y quema la carta como acto simbólico de liberación.',
      'Soberanía de Límites: Decir "no" a los demás es el primer acto de decirte "sí" a ti mismo.',
    ],
    comments: [
      {
        id: 'c3',
        authorName: 'Patricia Morales',
        authorRole: 'Miembro',
        content: 'Me sentí tan identificada con la trampa del niño bueno. Este texto me hizo llorar y sanar mucho.',
        createdAt: 'Hace 1 día',
        likesCount: 11,
      },
    ],
  },
  {
    id: 3,
    slug: 'el-arte-de-soltar-el-control',
    title: 'El Arte de Soltar el Control: Cuando Rendirse es la Mayor Victoria',
    author: 'Luz Amparo Valencia',
    authorRole: 'Fundadora de Conexión Luz® & Mentora Espiritual',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    category: 'Crecimiento Espiritual & Mindfulness',
    tags: ['Gratis', 'Mindfulness', 'Desapego', 'Confianza', 'Paz'],
    coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    plainExcerpt:
      'Aprender a distinguir entre dirigir tu energía con intención y obsesionarte con los resultados. La sabiduría del fluir con la vida.',
    quote:
      'Rendirse no significa resignarse a la derrota; significa dejar de luchar contra la realidad para poder transformarla desde la serenidad.',
    readingTime: '7 min de lectura',
    createdAt: '2025-01-25',
    priceLumis: 0,
    isFree: true,
    likesCount: 215,
    commentsCount: 42,
    chapters: [
      {
        number: 1,
        title: 'La Agotadora Ilusión de la Omnipotencia',
        paragraphs: [
          'Pasamos décadas creyendo que si planeamos cada contingencia, si monitoreamos cada detalle de las vidas ajenas y si nos preocupamos lo suficiente, podremos blindarnos contra la incertidumbre.',
          'La preocupación crónica es una trampa de la mente que confunde la rumiación ansiosa con la acción productiva. Entre más intentas sujetar la arena con el puño cerrado, más rápido se escapa entre tus dedos.',
        ],
      },
      {
        number: 2,
        title: 'El Salto a la Confianza Primaria',
        paragraphs: [
          'Cuando abres la palma de la mano, la arena permanece. Confiar no es asegurar que nada malo sucederá; es saber que posees la sabiduría y la fuerza interior para responder ante lo que acontezca.',
        ],
      },
    ],
    keyTakeaways: [
      'Diferencia entre Círculo de Control y Círculo de Preocupación.',
      'Práctica de Pausa Consciente: Cuando sientas urgencia mental, inhala profundo y suelta los hombros.',
      'El poder de la entrega: Enfócate en tu intención y desapégate del resultado inmediato.',
    ],
    comments: [
      {
        id: 'c4',
        authorName: 'Andrés Felipe',
        authorRole: 'Miembro',
        content: 'La analogía de la arena en el puño me dejó reflexionando profundamente. Extraordinario artículo.',
        createdAt: 'Hace 3 días',
        likesCount: 18,
      },
    ],
  },
  {
    id: 4,
    slug: 'renacer-tras-la-ruptura-amorosa',
    title: 'Renacer tras la Ruptura: El Duelo Afectivo como Oportunidad Cuántica',
    author: 'Dra. Sofía Alarcón',
    authorRole: 'Terapeuta de Pareja & Vínculos Afectivos',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    category: 'Relaciones Conscientes & Duelo',
    tags: ['Lumis: 20', 'Duelo', 'Pareja', 'Autoestima', 'Amor Propio'],
    coverUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
    plainExcerpt:
      'Cómo transitar el dolor de la separación sin perder tu identidad y reconstruir un apego seguro contigo mismo antes de volver a amar.',
    quote:
      'El fin de una relación no es el fin de tu capacidad de amar; es el comienzo de la relación más importante de tu existencia: la que mantienes contigo.',
    readingTime: '9 min de lectura',
    createdAt: '2025-02-01',
    priceLumis: 20,
    isFree: false,
    likesCount: 112,
    commentsCount: 23,
    chapters: [
      {
        number: 1,
        title: 'El Síndrome de Abstinencia Afectiva',
        paragraphs: [
          'La neurociencia ha demostrado que el desamor activa en el cerebro los mismos circuitos neuronales que el dolor físico y la privación de sustancias. La obsesión por mirar las redes sociales del ex es un intento desesperado del sistema de recompensa por obtener una dosis de dopamina.',
          'Comprender esto nos permite tratarnos con inmensa compasión en lugar de juzgarnos como débiles.',
        ],
      },
      {
        number: 2,
        title: 'Reclamando tu Energía Dispersa',
        paragraphs: [
          'El duelo no se supera olvidando, sino resignificando. Cada lágrima derramada limpia la mirada para permitirte ver con claridad qué patrones repetías y qué mereces verdaderamente en tu vida.',
        ],
      },
    ],
    keyTakeaways: [
      'Contacto Cero como medicina de desintoxicación neurológica.',
      'Inventario de Aprendizajes: Qué descubrí sobre mis necesidades emocionales no negociables.',
      'Reconstrucción del Templo Propio: Retoma pasiones, amistades y proyectos individuales.',
    ],
    comments: [],
  },
  {
    id: 5,
    slug: 'el-poder-sanador-del-perdon',
    title: 'El Poder Sanador del Perdón: Liberando las Cadenas del Resentimiento',
    author: 'Juan David Martínez',
    authorRole: 'Facilitador de Hipnosis & Filosofía Holística',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    category: 'Sanación Emocional & Niño Interior',
    tags: ['Lumis: 30', 'Perdón', 'Liberación', 'Paz Interior', 'Sanación'],
    coverUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80',
    plainExcerpt:
      'El perdón no justifica el daño ajeno: es el acto soberano mediante el cual decides no cargar más el veneno del rencor en tu propio corazón.',
    quote:
      'Guardar rencor es como beber veneno y esperar que la otra persona muera. El perdón es el antídoto que te devuelves a ti mismo.',
    readingTime: '8 min de lectura',
    createdAt: '2025-02-05',
    priceLumis: 30,
    isFree: false,
    likesCount: 165,
    commentsCount: 31,
    chapters: [
      {
        number: 1,
        title: 'Desmontando los Mitos del Perdón',
        paragraphs: [
          'Perdonar no requiere reconciliación ni contacto con quien causó el agravio. No es minimizar lo ocurrido ni conceder impunidad. Es romper el lazo energético que te ata al evento traumático del pasado.',
        ],
      },
    ],
    keyTakeaways: [
      'El perdón es un proceso, no un evento único.',
      'Autoperdón: Libérate de la culpa por no haber sabido en el pasado lo que sabes hoy.',
    ],
    comments: [],
  },
  {
    id: 6,
    slug: 'neuroplasticidad-y-creencias-limitantes',
    title: 'Neuroplasticidad Aplicada: Cómo Reescribir el Código de tu Mente',
    author: 'Dr. Santiago Varela',
    authorRole: 'Neurobiólogo & Investigador en Neuroplasticidad',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    category: 'Autohipnosis & Neurociencia',
    tags: ['Gratis', 'Neurociencia', 'Neuroplasticidad', 'Mente', 'Hábitos'],
    coverUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80',
    plainExcerpt:
      'Tu cerebro no es una estructura fija, sino un mapa dinámico capaz de crear nuevas redes neuronales a cualquier edad mediante la repetición y la emoción consciente.',
    quote:
      'Las neuronas que disparan juntas, se conectan juntas. Cada pensamiento recurrente es un surco que refuerzas en la arquitectura de tu cerebro.',
    readingTime: '11 min de lectura',
    createdAt: '2025-02-10',
    priceLumis: 0,
    isFree: true,
    likesCount: 189,
    commentsCount: 35,
    chapters: [
      {
        number: 1,
        title: 'La Maleabilidad del Tejido Cerebral',
        paragraphs: [
          'Durante décadas la ciencia creyó erróneamente que el cerebro adulto era inmutable. Hoy sabemos que la neuroplasticidad nos acompaña hasta el último día de vida.',
          'Si practicas la autocrítica durante años, tu cerebro se vuelve un experto en encontrar tus defectos. Si entrenas la gratitud y la autoafirmación, tus circuitos sinápticos se reorganizan para reflejar esa nueva realidad.',
        ],
      },
    ],
    keyTakeaways: [
      'Regla de los 21/66 días para la poda sináptica y consolidación de hábitos.',
      'La emoción como pegamento neuroquímico de las nuevas creencias.',
    ],
    comments: [],
  },
  {
    id: 7,
    slug: 'abrazando-la-sombra-psicologia-junguiana',
    title: 'Abrazando la Sombra: El Tesoro Oculto en lo que Rechazas de Ti',
    author: 'Luz Amparo Valencia',
    authorRole: 'Mentora Holística',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    category: 'Crecimiento Espiritual & Mindfulness',
    tags: ['Lumis: 45', 'Sombra', 'Jung', 'Integración', 'Psicología'],
    coverUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80',
    plainExcerpt:
      'Una guía profunda para integrar aquellos aspectos reprimidos de tu personalidad y convertirlos en tu mayor fuente de autenticidad, creatividad y fuerza.',
    quote:
      'Uno no se ilumina fantaseando figuras de luz, sino haciendo consciente su propia oscuridad.',
    readingTime: '12 min de lectura',
    createdAt: '2025-02-14',
    priceLumis: 45,
    isFree: false,
    likesCount: 134,
    commentsCount: 22,
    chapters: [
      {
        number: 1,
        title: 'El Oro Enterrado en la Sombra',
        paragraphs: [
          'La sombra no es maldad; es la bolsa donde guardamos todas las partes de nosotros mismos que fueron censuradas en la infancia para ser aceptados socialmente.',
        ],
      },
    ],
    keyTakeaways: [
      'Proyección de la Sombra: Lo que más te irrita de los demás es un espejo de lo no integrado en ti.',
      'Diálogo compasivo con tus partes exiliadas.',
    ],
    comments: [
      {
        id: 'c7',
        authorName: 'Gabriel V.',
        authorRole: 'Practicante Cuántico',
        content: 'Integrar la sombra me quitó un peso gigantesco de encima. Extraordinario enfoque junguiano.',
        createdAt: 'Hace 5 días',
        likesCount: 8,
      },
    ],
  },
  {
    id: 8,
    slug: 'comunicacion-no-violenta-en-la-pareja',
    title: 'Comunicación No Violenta: Cómo Transformar Discusiones en Intimidad',
    author: 'Dra. Sofía Alarcón',
    authorRole: 'Terapeuta de Pareja',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    category: 'Relaciones Conscientes & Duelo',
    tags: ['Lumis: 60', 'Comunicación', 'Pareja', 'Empatía', 'Asertividad'],
    coverUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    plainExcerpt:
      'Las cuatro etapas de la CNV aplicadas a las relaciones amorosas para expresar necesidades profundas sin atacar ni ponerse a la defensiva.',
    quote:
      'Detrás de todo reproche o agresión verbal, se oculta una necesidad humana insatisfecha que clama por ser escuchada.',
    readingTime: '10 min de lectura',
    createdAt: '2025-02-18',
    priceLumis: 60,
    isFree: false,
    likesCount: 145,
    commentsCount: 27,
    chapters: [
      {
        number: 1,
        title: 'El Ciclo del Ataque y la Defensiva en los Vínculos',
        paragraphs: [
          'En la mayoría de las discusiones conyugales no se debate el tema de fondo (el orden de la casa, los horarios o las finanzas), sino la sensación subyacente de no ser visto, valorado o respetado.',
          'Cuando decimos "tú siempre haces lo mismo", el sistema de defensa del otro se activa instantáneamente. Para conectar, debemos aprender a describir hechos neutros y revelar nuestros propios sentimientos con honestidad radical.',
        ],
      },
      {
        number: 2,
        title: 'Las 4 Fases de la Comunicación Consciente (CNV)',
        paragraphs: [
          '1. Observación sin juicio: Describe los hechos concretos sin adjetivos descalificadores.',
          '2. Expresión del sentimiento: Revela lo que experimentas (tristeza, miedo, confusión) en lugar de culpar.',
          '3. Identificación de la necesidad: Nombra qué valor requieres (colaboración, afecto, claridad).',
          '4. Petición concreta y negociable: Solicita acciones específicas que el otro pueda realizar con libertad.',
        ],
      },
    ],
    keyTakeaways: [
      'Reemplazar "Tú me haces sentir" por "Cuando ocurre esto, yo experimento...".',
      'Pausa de Enfriamiento de 20 minutos cuando el pulso cardíaco supere los 100 bpm durante un conflicto.',
    ],
    comments: [
      {
        id: 'c8',
        authorName: 'Lorena & Esteban',
        authorRole: 'Miembros',
        content: 'Aplicamos las 4 fases de la CNV anoche y por primera vez tuvimos una conversación pacífica sin herirnos.',
        createdAt: 'Hace 2 días',
        likesCount: 15,
      },
    ],
  },
  {
    id: 9,
    slug: 'respiracion-consciente-y-coherencia-cardiaca',
    title: 'Coherencia Cardíaca: La Sincronización entre el Corazón y el Cerebro',
    author: 'Dr. Santiago Varela',
    authorRole: 'Neurobiólogo',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    category: 'Autohipnosis & Neurociencia',
    tags: ['Lumis: 80', 'Coherencia Cardíaca', 'Respiración', 'Biofeedback', 'Salud'],
    coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    plainExcerpt:
      'El corazón posee más de 40.000 neuronas sensoriales y emite el campo electromagnético más potente del organismo. Aprende a sincronizarlo con tu mente.',
    quote:
      'Cuando el ritmo cardíaco se vuelve armónico, el cerebro responde enviando oleadas de claridad mental, reducción del cortisol y equilibrio hormonal.',
    readingTime: '13 min de lectura',
    createdAt: '2025-02-22',
    priceLumis: 80,
    isFree: false,
    likesCount: 178,
    commentsCount: 39,
    chapters: [
      {
        number: 1,
        title: 'El Cerebro del Corazón y la Variabilidad Cardíaca (VFC)',
        paragraphs: [
          'Investigaciones contemporáneas han descubierto que el corazón envía más información al cerebro a través del nervio vago de la que recibe de él. Cuando experimentamos gratitud o compasión, la gráfica de latido se torna suave y sinodal.',
          'Este estado de coherencia sincroniza las ondas cerebrales Alfa y optimiza el rendimiento cognitivo, el sistema inmune y la estabilidad emocional.',
        ],
      },
      {
        number: 2,
        title: 'El Protocolo 5-5 de Coherencia Diaria',
        paragraphs: [
          'Inhala suavemente durante 5 segundos dirigiendo la atención al centro del pecho.',
          'Exhala con serenidad durante 5 segundos mientras evocas un recuerdo de aprecio o amor sincero.',
          'Realiza este ciclo durante 5 minutos, tres veces al día, para restablecer la homeostasis fisiológica.',
        ],
      },
    ],
    keyTakeaways: [
      'Respiración a 0.1 Hz (6 respiraciones por minuto) como sintonizador del sistema nervioso autónomo.',
      'El poder transformador de la gratitud sentida en el cuerpo en lugar de solo pensada.',
    ],
    comments: [
      {
        id: 'c9',
        authorName: 'Felipe H.',
        authorRole: 'Miembro',
        content: 'La práctica 5-5 me bajó la presión arterial y me devolvió el sueño reparador. ¡Oro puro!',
        createdAt: 'Hace 1 día',
        likesCount: 12,
      },
    ],
  },
  {
    id: 10,
    slug: 'el-despertar-de-la-intuicion-cuantica',
    title: 'El Despertar de la Intuición Cuántica: Escuchando la Guía Interior',
    author: 'Luz Amparo Valencia',
    authorRole: 'Mentora Cuántica',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    category: 'Crecimiento Espiritual & Mindfulness',
    tags: ['Lumis: 100', 'Intuición', 'Conciencia', 'Espiritualidad', 'Guía'],
    coverUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    plainExcerpt:
      'Cómo acallar el ruido mental incesante para sintonizar con la sabiduría no local del campo cuántico y tomar decisiones con total certeza espiritual.',
    quote:
      'La intuición no es magia; es la percepción instantánea de la inteligencia universal antes de que el ego intente justificarla.',
    readingTime: '15 min de lectura',
    createdAt: '2025-02-26',
    priceLumis: 100,
    isFree: false,
    likesCount: 240,
    commentsCount: 56,
    chapters: [
      {
        number: 1,
        title: 'El Susurro Silencioso de la Intuición vs. el Grito del Miedo',
        paragraphs: [
          'La mente condicionada opera mediante el análisis lineal, la duda recurrente y el miedo a la equivocación. La intuición cuántica, en cambio, se manifiesta como una certeza sutil, tranquila y sin urgencia que surge en el silencio.',
          'Para escuchar tu sabiduría intuitiva debes desacelerar el ritmo frenético de la vida diaria y aprender a confiar en las corazonadas somáticas del cuerpo.',
        ],
      },
      {
        number: 2,
        title: 'Tres Pasos para Activar tu Conexión Cuántica',
        paragraphs: [
          '1. Silencio Mental: 10 minutos diarios de no-acción y respiración consciente.',
          '2. Pregunta Intencionada: Formula una duda con claridad antes de dormir.',
          '3. Escucha Corporal: Atiende a las señales de ligereza o pesadez en el plexo solar ante cada opción.',
        ],
      },
    ],
    keyTakeaways: [
      'El cuerpo como antena biológica de la intuición cuántica.',
      'Diferenciar entre impulso ansioso (urgencia) y guía intuitiva (calma certera).',
    ],
    comments: [
      {
        id: 'c10',
        authorName: 'Adriana M.',
        authorRole: 'Miembro de Luz',
        content: 'Una joya de sabiduría. Este artículo me ayudó a tomar una de las decisiones más importantes de mi vida con paz.',
        createdAt: 'Hace 6 horas',
        likesCount: 21,
      },
    ],
  },
];
