export interface ForumReplyItem {
  id: string | number;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  likesCount?: number;
  parentId?: number | string | null;
}

export interface ForumTopicItem {
  id: number;
  title: string;
  description: string;
  category: string;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  imageUrl?: string | null;
  isPinned?: boolean;
  isLocked?: boolean;
  viewsCount: number;
  likesCount: number;
  repliesCount: number;
  createdAt: string;
  tags?: string[];
  replies?: ForumReplyItem[];
}

export const MASTER_FORUM_TOPICS: ForumTopicItem[] = [
  {
    id: 1,
    title: '¿Cómo manejas los pensamientos intrusivos antes de dormir?',
    description:
      'Llevo un par de semanas donde al apagar la luz mi mente empieza a repasar pendientes, conversaciones pasadas y miedos futuros. ¿Qué técnicas o rituales de calma les han funcionado de verdad para desacelerar la mente y conciliar el sueño en paz?',
    category: 'Ansiedad & Calma',
    authorName: 'Camila Morales',
    authorRole: 'Miembro de la Tribu',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    isPinned: true,
    viewsCount: 420,
    likesCount: 54,
    repliesCount: 16,
    createdAt: 'Hace 2 horas',
    tags: ['Insomnio', 'Ansiedad', 'RitualesNocturnos', 'Mindfulness'],
    replies: [
      {
        id: 'r1-1',
        authorName: 'Dr. Julián R.',
        authorRole: 'Terapeuta de Sueño & Hipnosis',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        content:
          'Hola Camila. Te recomiendo la "Descarga Cerebral": ten una libreta en tu mesa de noche y escribe durante 3 minutos todo lo pendiente antes de acostarte. Dile a tu mente: "Está a salvo en el papel, mañana me ocupo". Luego aplica 4 ciclos de respiración 4-7-8.',
        createdAt: 'Hace 1 hora',
        likesCount: 22,
      },
      {
        id: 'r1-2',
        authorName: 'Marcos Herrera',
        authorRole: 'Miembro',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        content:
          'A mí me cambió la vida escuchar las frecuencias 432 Hz y no tocar el celular 45 minutos antes de acostarme. ¡Mucho ánimo!',
        createdAt: 'Hace 45 minutos',
        likesCount: 14,
      },
    ],
  },
  {
    id: 2,
    title: 'Normas y Valores Sagrados de nuestra Tribu Conexión Luz®',
    description:
      'Bienvenidas y bienvenidos a nuestro foro comunitario. Este es un santuario libre de juicios, basado en el respeto mutuo, la empatía compasiva y la confidencialidad. Aquí compartimos desde la vulnerabilidad y nos sostenemos con amor.',
    category: 'Comunidad & Anuncios',
    authorName: 'Equipo Conexión Luz',
    authorRole: 'Moderación & Acompañamiento',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    isPinned: true,
    viewsCount: 1250,
    likesCount: 180,
    repliesCount: 42,
    createdAt: 'Publicación Permanente',
    tags: ['Normas', 'Tribu', 'Bienestar', 'Respeto'],
    replies: [
      {
        id: 'r2-1',
        authorName: 'Elena Ramos',
        authorRole: 'Miembro',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
        content:
          'Gracias por crear un espacio tan seguro y luminoso. Da mucha paz saber que podemos expresarnos sin miedo a ser juzgados.',
        createdAt: 'Hace 1 día',
        likesCount: 35,
      },
    ],
  },
  {
    id: 3,
    title: 'Poner límites sanos a familiares sin sentir culpa: Mi experiencia',
    description:
      'Durante años fui complaciente con todo lo que me pedían por miedo a ser "la mala de la familia". Ayer finalmente dije "No puedo asistir" con calma y respeto. Sentí un nudo en el pecho al inicio, pero hoy me levanté con una paz inmensa. ¿Cómo ha sido su proceso con los límites?',
    category: 'Relaciones & Vínculos',
    authorName: 'Valeria Gómez',
    authorRole: 'Miembro',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    viewsCount: 680,
    likesCount: 92,
    repliesCount: 28,
    createdAt: 'Hace 5 horas',
    tags: ['Límites', 'Familia', 'AmorPropio', 'Culpa'],
    replies: [
      {
        id: 'r3-1',
        authorName: 'Dra. Sofía Alarcón',
        authorRole: 'Terapeuta de Pareja & Vínculos',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
        content:
          '¡Felicidades Valeria! Recuerda siempre: "Poner un límite no es atacar al otro, es cuidar la relación contigo misma". La culpa inicial es solo el eco de viejos condicionamientos desaprendiéndose.',
        createdAt: 'Hace 3 horas',
        likesCount: 48,
      },
      {
        id: 'r3-2',
        authorName: 'Santiago Mejía',
        authorRole: 'Miembro',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        content:
          'Me siento tan identificado. Al principio se enojan, pero con el tiempo empiezan a respetarte mucho más.',
        createdAt: 'Hace 2 horas',
        likesCount: 19,
      },
    ],
  },
  {
    id: 4,
    title: 'El duelo no lineal: Días donde parece que retrocedes 10 pasos',
    description:
      'Pensé que ya había sanado mi pérdida afectiva después de 6 meses de avances, pero hoy un olor y una canción me desmoronaron en lágrimas. Me frustra sentir que vuelvo al inicio. ¿Es normal esta montaña rusa?',
    category: 'Duelo & Sanación',
    authorName: 'Daniel Cárdenas',
    authorRole: 'Miembro de la Tribu',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    viewsCount: 510,
    likesCount: 76,
    repliesCount: 19,
    createdAt: 'Hace 8 horas',
    tags: ['Duelo', 'Emociones', 'Paciencia', 'Proceso'],
    replies: [
      {
        id: 'r4-1',
        authorName: 'Mariana Duarte',
        authorRole: 'Acompañante de Duelo',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        content:
          'Daniel, el duelo es una espiral ascendente, nunca una línea recta. No volviste al inicio; estás revisitando la herida con un nivel más alto de sabiduría y resiliencia. Llora lo que necesites, las lágrimas también son abono de sanación.',
        createdAt: 'Hace 6 horas',
        likesCount: 31,
      },
    ],
  },
  {
    id: 5,
    title: 'Pequeñas victorias del día: ¿Por qué te sientes agradecido hoy?',
    description:
      'Abro este hilo diario para celebrar lo simple. No tiene que ser un logro gigante: haber tomado agua, haber salido a caminar 10 minutos, o haberte mirado con ternura al espejo. Cuéntanos tu victoria de hoy.',
    category: 'Gratitud & Hábitos',
    authorName: 'Lucía Benítez',
    authorRole: 'Miembro',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    viewsCount: 890,
    likesCount: 135,
    repliesCount: 53,
    createdAt: 'Hace 1 día',
    tags: ['Gratitud', 'PequeñasVictorias', 'Positividad', 'Mindfulness'],
    replies: [
      {
        id: 'r5-1',
        authorName: 'Carlos M.',
        authorRole: 'Miembro',
        content: 'Mi victoria de hoy fue no revisar el correo del trabajo en mi hora de almuerzo y disfrutar de la comida con calma.',
        createdAt: 'Hace 18 horas',
        likesCount: 27,
      },
      {
        id: 'r5-2',
        authorName: 'Andrea P.',
        authorRole: 'Miembro',
        content: 'Logré meditar 5 minutos por la mañana sin sentir impaciencia. ¡Poco a poco!',
        createdAt: 'Hace 12 horas',
        likesCount: 19,
      },
    ],
  },
  {
    id: 6,
    title: '¿Alguien más experimenta agotamiento por sobrepensar todo?',
    description:
      'Siento que gasto el 80% de mi energía diaria analizando escenarios hipotéticos que el 95% de las veces nunca suceden. ¿Qué anclaje sensorial o ejercicio físico les ayuda a volver al cuerpo cuando se quedan atrapados en la cabeza?',
    category: 'Autohipnosis & Mente',
    authorName: 'Mateo Osorio',
    authorRole: 'Miembro',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    viewsCount: 620,
    likesCount: 88,
    repliesCount: 24,
    createdAt: 'Hace 2 días',
    tags: ['Sobrepensar', 'Rumiación', 'Cuerpo', 'Somatico'],
    replies: [
      {
        id: 'r6-1',
        authorName: 'Dr. Santiago Varela',
        authorRole: 'Neurobiólogo',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        content:
          'Prueba la técnica 5-4-3-2-1: Nombra 5 cosas que ves, 4 que puedes tocar, 3 que escuchas, 2 que hueles y 1 que saboreas. Esto obliga a la corteza sensorial a retomar el mando y apaga la hiperactividad de la red por defecto.',
        createdAt: 'Hace 1 día',
        likesCount: 42,
      },
    ],
  },
];
