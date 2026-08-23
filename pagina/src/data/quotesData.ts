export interface WisdomQuote {
  id: string;
  quote: string;
  author: string;
  category: 'ansiedad' | 'desanimo' | 'autoestima' | 'bienestar';
  levelKeys: Array<'bajo' | 'leve' | 'moderado' | 'alto'>;
  school: 'stoicism' | 'logoterapia' | 'humanismo' | 'positiva' | 'oriental';
  title: string;
  explanation: string;
}

export const WISDOM_QUOTES: WisdomQuote[] = [
  // --- ANSIEDAD & REGULACIÓN MENTAL (40 CITAS) ---
  {
    id: 'ans-1',
    quote: 'Sufrimos más a menudo en la imaginación que en la realidad.',
    author: 'Marco Aurelio (Emperador y Filósofo Estoico)',
    category: 'ansiedad',
    levelKeys: ['leve', 'moderado'],
    school: 'stoicism',
    title: 'Distingue la realidad presente de la preocupación futura.',
    explanation: 'La mente ansiosa tiende a fabricar catástrofes antes de que ocurran. Volver a tus sentidos en este instante disuelve la ilusión del miedo futuro.'
  },
  {
    id: 'ans-2',
    quote: 'Si estás en paz contigo mismo, estás en paz con el mundo.',
    author: 'Séneca (Filósofo Estoico)',
    category: 'ansiedad',
    levelKeys: ['bajo', 'leve'],
    school: 'stoicism',
    title: 'La serenidad es un templo interno que se cuida a diario.',
    explanation: 'Séneca nos enseña que la calma no es ausencia de ruidos externos, sino la decisión consciente de gobernar nuestro templo mental.'
  },
  {
    id: 'ans-3',
    quote: 'No son las cosas que nos pasan las que nos perturban, sino nuestra opinión sobre ellas.',
    author: 'Epicteto (Filósofo Estoico)',
    category: 'ansiedad',
    levelKeys: ['leve', 'moderado'],
    school: 'stoicism',
    title: 'El filtro mental determina tu tranquilidad.',
    explanation: 'Epicteto nos recuerda que entre el estímulo y tu reacción existe un espacio de libertad donde tú eliges el significado de lo que vives.'
  },
  {
    id: 'ans-4',
    quote: 'Hasta que lo inconsciente no se haga consciente, el subconsciente dirigirá tu vida y tú lo llamarás destino.',
    author: 'Carl Gustav Jung (Psiquiatra y Ensayista)',
    category: 'ansiedad',
    levelKeys: ['moderado', 'alto'],
    school: 'humanismo',
    title: 'Tu inquietud es un llamado a escuchar tus necesidades profundas.',
    explanation: 'Jung nos muestra que la tensión no surge para dañarte, sino como un mensajero inconsciente que pide límites, descanso y autocompasión.'
  },
  {
    id: 'ans-5',
    quote: 'Cuando ya no somos capaces de cambiar una situación, nos enfrentamos al desafío de cambiarnos a nosotros mismos.',
    author: 'Viktor Frankl (Creador de la Logoterapia)',
    category: 'ansiedad',
    levelKeys: ['moderado', 'alto'],
    school: 'logoterapia',
    title: 'En medio de la tormenta interna, la contención te devuelve el control.',
    explanation: 'Frankl descubrió que en la incertidumbre más profunda conservamos la libertad de elegir nuestra actitud y recibir el apoyo que merecemos.'
  },
  {
    id: 'ans-6',
    quote: 'La tranquilidad es nada más que el buen orden de la mente.',
    author: 'Marco Aurelio',
    category: 'ansiedad',
    levelKeys: ['bajo', 'leve'],
    school: 'stoicism',
    title: 'La mente ordenada cultiva la calma de forma natural.',
    explanation: 'Simplificar tus prioridades cotidianas y soltar la sobreexigencia permite que tu sistema nervioso recupere su ritmo biológico.'
  },
  {
    id: 'ans-7',
    quote: 'No anticipes los males ni te aflijas por cosas que tal vez nunca sucedan.',
    author: 'Benjamin Franklin',
    category: 'ansiedad',
    levelKeys: ['leve', 'moderado'],
    school: 'stoicism',
    title: 'Vive en el compartimento estanco de hoy.',
    explanation: 'Preocuparse por el mañana agota la energía que necesitas para cuidar de ti en el presente.'
  },
  {
    id: 'ans-8',
    quote: 'La paciencia es el arte de esperar sin perder la calma.',
    author: 'Jean-Jacques Rousseau',
    category: 'ansiedad',
    levelKeys: ['leve', 'moderado'],
    school: 'humanismo',
    title: 'Darle tiempo al cuerpo para procesar las emociones.',
    explanation: 'El alivio de la tensión requiere paciencia y compasión hacia el ritmo propio de tu biología.'
  },
  {
    id: 'ans-9',
    quote: 'Ningún mar en calma hizo experto a un marinero.',
    author: 'Proverbio de Sabiduría Clásica',
    category: 'ansiedad',
    levelKeys: ['moderado', 'alto'],
    school: 'stoicism',
    title: 'Los episodios de inquietud fortalecen tus herramientas emocionales.',
    explanation: 'Cada vez que navegas una ola de inquietud con respiración consciente, fortaleces tu resiliencia interna.'
  },
  {
    id: 'ans-10',
    quote: 'No puedes detener las olas, pero puedes aprender a surfear.',
    author: 'Jon Kabat-Zinn (Fundador de Mindfulness MBSR)',
    category: 'ansiedad',
    levelKeys: ['leve', 'moderado', 'alto'],
    school: 'oriental',
    title: 'Aceptación dinámica en lugar de resistencia desesperada.',
    explanation: 'Resistir el síntoma aumenta la tensión; fluir con la exhalación consciente permite que la ola pase suavemente.'
  },
  {
    id: 'ans-11',
    quote: 'Un deseo de control absoluto es la raíz de la agitación mental.',
    author: 'Cicerón',
    category: 'ansiedad',
    levelKeys: ['moderado', 'alto'],
    school: 'stoicism',
    title: 'Soltar la ilusión del control absoluto.',
    explanation: 'Reconocer lo que está en tu mano y soltar el resto devuelve la ligereza a tus hombros.'
  },
  {
    id: 'ans-12',
    quote: 'Donde hay gran amor, siempre hay milagros, porque el amor disipa el temor.',
    author: 'Willa Cather',
    category: 'ansiedad',
    levelKeys: ['moderado', 'alto'],
    school: 'humanismo',
    title: 'La compasión disuelve el miedo.',
    explanation: 'Tratar tu cuerpo con calidez amorosa neutraliza la química del estrés en tu cerebro.'
  },
  {
    id: 'ans-13',
    quote: 'La mente es su propio lugar, y en sí misma puede hacer un cielo del infierno o un infierno del cielo.',
    author: 'John Milton',
    category: 'ansiedad',
    levelKeys: ['leve', 'moderado'],
    school: 'humanismo',
    title: 'Reorientar la mirada hacia lo que nutre tu paz.',
    explanation: 'El enfoque con el que miras tus circunstancias decide el clima emocional en el que habitas.'
  },
  {
    id: 'ans-14',
    quote: 'La respiración es el puente que conecta la vida con la conciencia.',
    author: 'Thich Nhat Hanh (Maestro Zen)',
    category: 'ansiedad',
    levelKeys: ['bajo', 'leve', 'moderado'],
    school: 'oriental',
    title: 'Inhalar presencia y exhalar tensión.',
    explanation: 'Una exhalación larga envía la señal más rápida al sistema nervioso de que estás a salvo.'
  },
  {
    id: 'ans-15',
    quote: 'Nada le da tanta ventaja a una persona sobre otra como el permanecer sereno.',
    author: 'Thomas Jefferson',
    category: 'ansiedad',
    levelKeys: ['bajo', 'leve'],
    school: 'stoicism',
    title: 'La serenidad es tu superpoder ante la urgencia.',
    explanation: 'Responder en lugar de reaccionar te da el dominio de tu camino cotidiano.'
  },
  {
    id: 'ans-16',
    quote: 'La prisa es la enemiga de la sabiduría.',
    author: 'Séneca',
    category: 'ansiedad',
    levelKeys: ['leve', 'moderado'],
    school: 'stoicism',
    title: 'Desacelerar el ritmo para ver con claridad.',
    explanation: 'Reducir la velocidad de tus movimientos y palabras tranquiliza inmediatamente la aceleración mental.'
  },
  {
    id: 'ans-17',
    quote: 'Sostener la rabia o el miedo es como sujetar un carbón encendido: tú eres el primero en quemarse.',
    author: 'Buda',
    category: 'ansiedad',
    levelKeys: ['moderado', 'alto'],
    school: 'oriental',
    title: 'Liberar el peso para proteger tu bienestar.',
    explanation: 'Soltar la necesidad de resolver todo en este segundo es un acto de amor hacia ti mismo/a.'
  },
  {
    id: 'ans-18',
    quote: 'El secreto de la salud mental es no lamentar el pasado ni preocuparse por el futuro, sino vivir con sabiduría el presente.',
    author: 'Buda',
    category: 'ansiedad',
    levelKeys: ['bajo', 'leve', 'moderado'],
    school: 'oriental',
    title: 'Habitar plenamente el instante actual.',
    explanation: 'Tu fuerza existe únicamente en el aquí y el ahora; el pasado ya fue y el futuro se construye paso a paso.'
  },
  {
    id: 'ans-19',
    quote: 'Nada dura para siempre en este mundo, ni siquiera nuestros problemas.',
    author: 'Charlie Chaplin',
    category: 'ansiedad',
    levelKeys: ['moderado', 'alto'],
    school: 'humanismo',
    title: 'La impermanencia de la agitación.',
    explanation: 'Incluso la tormenta fisiológica más intensa de ansiedad disminuye progresivamente pasados unos minutos.'
  },
  {
    id: 'ans-20',
    quote: 'Tu hogar principal es tu propio cuerpo; cuídalo con ternura.',
    author: 'Thich Nhat Hanh',
    category: 'ansiedad',
    levelKeys: ['bajo', 'leve', 'moderado', 'alto'],
    school: 'oriental',
    title: 'Honrar el templo físico que te sostiene.',
    explanation: 'Darle masajes suaves a tus hombros o manos recuerda al cerebro tu lugar seguro.'
  },
  {
    id: 'ans-21',
    quote: 'No nos falta tiempo, lo que pasa es que perdemos mucho.',
    author: 'Séneca',
    category: 'ansiedad',
    levelKeys: ['bajo', 'leve'],
    school: 'stoicism',
    title: 'Proteger tus espacios sagrados de pausa.',
    explanation: 'Dedicar 10 minutos a no hacer nada productivo es esencial para la salud de tu sistema nervioso.'
  },
  {
    id: 'ans-22',
    quote: 'El valor no es la ausencia de miedo, sino el juicio de que algo más es más importante.',
    author: 'Ambrose Redmoon',
    category: 'ansiedad',
    levelKeys: ['moderado', 'alto'],
    school: 'humanismo',
    title: 'Avanzar suavemente a pesar de la duda.',
    explanation: 'Sentir temor es humano; actuar con ternura hacia ti en medio de la duda es valentía.'
  },
  {
    id: 'ans-23',
    quote: 'Aprende a estar solo y a disfrutarlo. No hay nada más liberador.',
    author: 'Bruce Lee',
    category: 'ansiedad',
    levelKeys: ['bajo', 'leve'],
    school: 'oriental',
    title: 'La soledad serena como refugio.',
    explanation: 'Estar a solas en silencio sin estímulos digitales recarga la pila de tu tranquilidad.'
  },
  {
    id: 'ans-24',
    quote: 'La paz viene de dentro. No la busques fuera.',
    author: 'Buda',
    category: 'ansiedad',
    levelKeys: ['bajo', 'leve', 'moderado'],
    school: 'oriental',
    title: 'Tu fuente interna de serenidad.',
    explanation: 'Ninguna validación externa reemplaza el abrazo cálido que te das a ti mismo/a.'
  },
  {
    id: 'ans-25',
    quote: 'El pensamiento es solo una propuesta de la mente, no un decreto divino.',
    author: 'Steven Hayes (Creador de la Terapia ACT)',
    category: 'ansiedad',
    levelKeys: ['leve', 'moderado', 'alto'],
    school: 'stoicism',
    title: 'Desengancharse de los pensamientos automáticos.',
    explanation: 'Observar los pensamientos pasar como nubes sin engancharte a ellos devuelve la libertad a tu conciencia.'
  },
  {
    id: 'ans-26',
    quote: 'La respiración profunda es el tranquilizante natural del cuerpo.',
    author: 'Andrew Weil (Médico e Investigador)',
    category: 'ansiedad',
    levelKeys: ['bajo', 'leve', 'moderado', 'alto'],
    school: 'positiva',
    title: 'La medicina gratuita de tu propio aliento.',
    explanation: 'Inhalar en 4 tiempos y exhalar en 7 calma la amígdala cerebral en cuestión de segundos.'
  },
  {
    id: 'ans-27',
    quote: 'El hombre que sufre antes de que sea necesario, sufre más de lo necesario.',
    author: 'Séneca',
    category: 'ansiedad',
    levelKeys: ['leve', 'moderado'],
    school: 'stoicism',
    title: 'Evitar el sufrimiento por anticipación.',
    explanation: 'Soltar las hipótesis trágicas libera una inmensa cantidad de energía física y vital.'
  },
  {
    id: 'ans-28',
    quote: 'Al final de la noche más oscura, siempre amanece.',
    author: 'Victor Hugo',
    category: 'ansiedad',
    levelKeys: ['moderado', 'alto'],
    school: 'humanismo',
    title: 'La certeza de la luz tras la tormenta.',
    explanation: 'Confía en que los estados de alerta alta son transitorios y tu cuerpo recobrará su compostura.'
  },
  {
    id: 'ans-29',
    quote: 'Sé como el agua que abre camino entre las rocas sin violencia.',
    author: 'Lao Tzu',
    category: 'ansiedad',
    levelKeys: ['bajo', 'leve', 'moderado'],
    school: 'oriental',
    title: 'La suavidad vence a la rigidez.',
    explanation: 'Aflojar la mandíbula y soltar los puños le comunica a tu cerebro que la amenaza ha terminado.'
  },
  {
    id: 'ans-30',
    quote: 'La compasión hacia uno mismo es la mejor medicina contra la autocrítica.',
    author: 'Kristin Neff',
    category: 'ansiedad',
    levelKeys: ['leve', 'moderado', 'alto'],
    school: 'humanismo',
    title: 'Hablarte con la dulzura de un buen amigo.',
    explanation: 'Sustituir el reproche duro por un tono cálido transforma tu experiencia emocional.'
  },
  {
    id: 'ans-31',
    quote: 'Ríndete a lo que es. Deja ir lo que fue. Ten fe en lo que será.',
    author: 'Sonia Ricotti',
    category: 'ansiedad',
    levelKeys: ['moderado', 'alto'],
    school: 'logoterapia',
    title: 'La postura de rendición sabia.',
    explanation: 'Aceptar el presente no es resignación, es la base sólida para empezar a construir la calma.'
  },
  {
    id: 'ans-32',
    quote: 'Un cuerpo relajado no puede sostener una mente aterrorizada.',
    author: 'Edmund Jacobson (Creador de la Relajación Progresiva)',
    category: 'ansiedad',
    levelKeys: ['leve', 'moderado', 'alto'],
    school: 'positiva',
    title: 'La vía somática hacia la calma.',
    explanation: 'Aflojar físicamente los músculos romper el bucle de retroalimentación del pánico.'
  },
  {
    id: 'ans-33',
    quote: 'La fe y el miedo tienen algo en común: ambos te piden creer en algo que no ves. Elige la fe.',
    author: 'Bob Proctor',
    category: 'ansiedad',
    levelKeys: ['leve', 'moderado'],
    school: 'logoterapia',
    title: 'Elegir el enfoque de la confianza.',
    explanation: 'Colocar tu foco mental en tus fortalezas en lugar de en la catástrofe cambia tu estado biológico.'
  },
  {
    id: 'ans-34',
    quote: 'Quien mira hacia afuera, sueña; quien mira hacia adentro, despierta.',
    author: 'Carl Gustav Jung',
    category: 'ansiedad',
    levelKeys: ['bajo', 'leve', 'moderado'],
    school: 'humanismo',
    title: 'El despertar del autoconocimiento.',
    explanation: 'Tus síntomas son invitaciones a explorar qué áreas de tu vida requieren mayor cuidado.'
  },
  {
    id: 'ans-35',
    quote: 'No puedes controlar los eventos, pero puedes controlar tu reacción a ellos.',
    author: 'Epicteto',
    category: 'ansiedad',
    levelKeys: ['bajo', 'leve'],
    school: 'stoicism',
    title: 'El centro de tu soberanía personal.',
    explanation: 'Cuidar tu respuesta ante los imprevistos sostiene tu paz inalterable.'
  },
  {
    id: 'ans-36',
    quote: 'La incertidumbre es el único lugar donde habita la posibilidad.',
    author: 'Deepak Chopra',
    category: 'ansiedad',
    levelKeys: ['leve', 'moderado'],
    school: 'oriental',
    title: 'Reencuadrar lo desconocido.',
    explanation: 'Lo no planeado no es necesariamente peligroso; también es el espacio de las sorpresas bellas.'
  },
  {
    id: 'ans-37',
    quote: 'Calma la mente y el alma hablará.',
    author: 'Maaya Angelou',
    category: 'ansiedad',
    levelKeys: ['bajo', 'leve'],
    school: 'humanismo',
    title: 'Escuchar tu sabiduría interna.',
    explanation: 'En el silencio sereno de la pausa encuentras las respuestas que estabas buscando.'
  },
  {
    id: 'ans-38',
    quote: 'La lentitud es la forma de memoria más profunda.',
    author: 'Milan Kundera',
    category: 'ansiedad',
    levelKeys: ['bajo', 'leve'],
    school: 'humanismo',
    title: 'Habitar tus actividades sin prisa.',
    explanation: 'Comer, caminar o ducharte despacio le devuelve el sabor a tu existencia.'
  },
  {
    id: 'ans-39',
    quote: 'Todo lo que necesitas para ser feliz está dentro de ti.',
    author: 'Marco Aurelio',
    category: 'ansiedad',
    levelKeys: ['bajo', 'leve', 'moderado'],
    school: 'stoicism',
    title: 'Tu riqueza interior inagotable.',
    explanation: 'Tienes todas las herramientas biológicas y psicológicas para superar esta etapa.'
  },
  {
    id: 'ans-40',
    quote: 'Estás a salvo en el abrazo de este momento.',
    author: 'Thich Nhat Hanh',
    category: 'ansiedad',
    levelKeys: ['moderado', 'alto'],
    school: 'oriental',
    title: 'Tu refugio en el presente.',
    explanation: 'Respira profundo y recuerda que en este segundo exacto tu vida está protegida.'
  },

  // --- ESTADO DE ÁNIMO & DESÁNIMO (40 CITAS) ---
  {
    id: 'anim-1',
    quote: 'En medio del invierno, aprendí por fin que había en mí un verano invencible.',
    author: 'Albert Camus (Filósofo y Premio Nobel de Literatura)',
    category: 'desanimo',
    levelKeys: ['leve', 'moderado'],
    school: 'humanismo',
    title: 'Tu vitalidad renace cuando respetas tu tiempo de pausa.',
    explanation: 'Camus comprendió que la falta temporal de fuerza no es el fin de tu luz, sino un invierno breve en tu ciclo natural. Trátate con amabilidad.'
  },
  {
    id: 'anim-2',
    quote: 'La curiosa paradoja es que cuando me acepto tal como soy, entonces puedo cambiar.',
    author: 'Carl Rogers (Padre de la Psicología Humanista)',
    category: 'desanimo',
    levelKeys: ['moderado', 'alto'],
    school: 'humanismo',
    title: 'Permítete sentir tu cansancio sin juzgarte.',
    explanation: 'Rogers demostró que luchar contra nuestra tristeza solo aumenta la frustración. Aceptar que hoy necesitas pausa es el primer paso de tu restauración.'
  },
  {
    id: 'anim-3',
    quote: 'Quien tiene un porqué para vivir, puede soportar casi cualquier cómo.',
    author: 'Friedrich Nietzsche (Filósofo y Pensador)',
    category: 'desanimo',
    levelKeys: ['moderado', 'alto'],
    school: 'logoterapia',
    title: 'Tu vida guarda un valor y propósito sagrado.',
    explanation: 'Nietzsche y Viktor Frankl descubrieron que ni la sombra más pesada puede despojar a la persona de su dignidad intrínseca.'
  },
  {
    id: 'anim-4',
    quote: 'El secreto de la felicidad no es hacer siempre lo que se quiere, sino querer siempre lo que se hace.',
    author: 'Lev Tolstói (Escritor Humanista)',
    category: 'desanimo',
    levelKeys: ['bajo', 'leve'],
    school: 'humanismo',
    title: 'Sostener la alegría cotidiana a través de la presencia.',
    explanation: 'Tolstói nos invita a apreciar el valor de las acciones conscientes. Mantener la motivación requiere conectar con lo que le da sentido a tu día.'
  },
  {
    id: 'anim-5',
    quote: 'Incluso la noche más oscura terminará y el sol saldrá.',
    author: 'Victor Hugo (Poeta y Dramaturgo)',
    category: 'desanimo',
    levelKeys: ['moderado', 'alto'],
    school: 'humanismo',
    title: 'Tu capacidad de recuperar el entusiasmo sigue intacta.',
    explanation: 'Victor Hugo nos recuerda que todo periodo de agotamiento tiene un final cuando nos abrimos a cuidar nuestro descanso.'
  },
  {
    id: 'anim-6',
    quote: 'No puedes juzgar un día por la cosecha que recoges, sino por las semillas que plantas.',
    author: 'Robert Louis Stevenson',
    category: 'desanimo',
    levelKeys: ['leve', 'moderado'],
    school: 'positiva',
    title: 'Valorar los pequeños esfuerzos invisibles.',
    explanation: 'Haberme levantado, bebido agua o respirado profundo hoy ya es una semilla victoriosa.'
  },
  {
    id: 'anim-7',
    quote: 'La esperanza es el sueño del hombre despierto.',
    author: 'Aristóteles',
    category: 'desanimo',
    levelKeys: ['bajo', 'leve'],
    school: 'stoicism',
    title: 'Cultivar la expectativa confiada en el mañana.',
    explanation: 'Mantener viva la fe en que vendrán días luminosos reconforta el alma.'
  },
  {
    id: 'anim-8',
    quote: 'Las heridas son el lugar por donde entra la luz en ti.',
    author: 'Rumi',
    category: 'desanimo',
    levelKeys: ['moderado', 'alto'],
    school: 'oriental',
    title: 'La transformación profunda del dolor.',
    explanation: 'Tus momentos difíciles están moldeando una empatía y sensibilidad más profundas.'
  },
  {
    id: 'anim-9',
    quote: 'No llores porque ya se terminó, sonríe porque sucedió.',
    author: 'Dr. Seuss',
    category: 'desanimo',
    levelKeys: ['bajo', 'leve'],
    school: 'positiva',
    title: 'Agradecer las vivencias que enriquecieron tu vida.',
    explanation: 'Honrar lo vivido permite soltar la nostalgia y abrir el corazón a nuevos comienzos.'
  },
  {
    id: 'anim-10',
    quote: 'El sol sale para todos, incluso después de la lluvia más intensa.',
    author: 'Proverbio Popular',
    category: 'desanimo',
    levelKeys: ['leve', 'moderado'],
    school: 'positiva',
    title: 'El retorno inevitable del calor vital.',
    explanation: 'Confía en que los ciclos naturales del cuerpo siempre tienden hacia la autorregulación.'
  },
  {
    id: 'anim-11',
    quote: 'El dolor es inevitable; el sufrimiento es opcional.',
    author: 'Haruki Murakami',
    category: 'desanimo',
    levelKeys: ['leve', 'moderado', 'alto'],
    school: 'oriental',
    title: 'Soltar la resistencia mental al dolor.',
    explanation: 'Aceptar el cansancio sin añadirle culpa libera gran parte de la carga emocional.'
  },
  {
    id: 'anim-12',
    quote: 'Lo que no me mata, me hace más fuerte.',
    author: 'Friedrich Nietzsche',
    category: 'desanimo',
    levelKeys: ['moderado', 'alto'],
    school: 'logoterapia',
    title: 'La alquimia de la resiliencia.',
    explanation: 'Descubrirás dentro de ti recursos de resistencia que jamás sospechabas poseer.'
  },
  {
    id: 'anim-13',
    quote: 'Caminante, no hay camino, se hace camino al andar.',
    author: 'Antonio Machado',
    category: 'desanimo',
    levelKeys: ['bajo', 'leve', 'moderado'],
    school: 'humanismo',
    title: 'El valor del paso a paso cotidiano.',
    explanation: 'No necesitas ver todo el trayecto futuro; basta con dar el siguiente paso de hoy.'
  },
  {
    id: 'anim-14',
    quote: 'No hay noche tan larga que no encuentre el día.',
    author: 'William Shakespeare',
    category: 'desanimo',
    levelKeys: ['moderado', 'alto'],
    school: 'humanismo',
    title: 'La certeza de la luz venidera.',
    explanation: 'La pesadez de hoy es un capítulo transitorio, no el libro completo de tu historia.'
  },
  {
    id: 'anim-15',
    quote: 'La mayor gloria no es no caer nunca, sino levantarse cada vez que caemos.',
    author: 'Nelson Mandela',
    category: 'desanimo',
    levelKeys: ['leve', 'moderado', 'alto'],
    school: 'logoterapia',
    title: 'El verdadero significado de la perseverancia.',
    explanation: 'Cada pequeño intento de autocuidado es una victoria de tu espíritu.'
  },
  {
    id: 'anim-16',
    quote: 'Ama la vida que tienes para poder vivir la vida que amas.',
    author: 'Hussain Volt',
    category: 'desanimo',
    levelKeys: ['bajo', 'leve'],
    school: 'positiva',
    title: 'Apreciar tu presente en su forma actual.',
    explanation: 'Hacer las paces con tu situación actual es el primer paso para transformarla.'
  },
  {
    id: 'anim-17',
    quote: 'Todo lo que se puede imaginar es real.',
    author: 'Pablo Picasso',
    category: 'desanimo',
    levelKeys: ['bajo', 'leve'],
    school: 'humanismo',
    title: 'Reabrir el espacio a la creatividad.',
    explanation: 'Visualizar momentos bellos en el futuro ayuda a tu cerebro a liberar neuroquímica positiva.'
  },
  {
    id: 'anim-18',
    quote: 'Para ver un arcoíris primero debes aguantar la lluvia.',
    author: 'Dolly Parton',
    category: 'desanimo',
    levelKeys: ['leve', 'moderado'],
    school: 'positiva',
    title: 'El contraste necesario para valorar la belleza.',
    explanation: 'Las etapas grises nos enseñan a valorar profundamente la salud y la alegría cuando retornan.'
  },
  {
    id: 'anim-19',
    quote: 'Sé el cambio que deseas ver en el mundo.',
    author: 'Mahatma Gandhi',
    category: 'desanimo',
    levelKeys: ['bajo', 'leve'],
    school: 'oriental',
    title: 'Iniciar la transformación por tu propio trato.',
    explanation: 'Empezar a tratarte a ti mismo/a con amabilidad transforma la atmósfera a tu alrededor.'
  },
  {
    id: 'anim-20',
    quote: 'No dejes que el ayer ocupe demasiado del hoy.',
    author: 'Will Rogers',
    category: 'desanimo',
    levelKeys: ['leve', 'moderado'],
    school: 'stoicism',
    title: 'Liberarte de los pesares pasados.',
    explanation: 'Hoy tienes la oportunidad limpia de comenzar de nuevo con paciencia.'
  },
  {
    id: 'anim-21',
    quote: 'La flor que florece en la adversidad es la más rara y bella de todas.',
    author: 'Mulan (Sabiduría Popular)',
    category: 'desanimo',
    levelKeys: ['moderado', 'alto'],
    school: 'positiva',
    title: 'La belleza singular de tu resiliencia.',
    explanation: 'Superar momentos difíciles le da una profundidad hermosa a tu carácter.'
  },
  {
    id: 'anim-22',
    quote: 'Nada grande se logró jamás sin entusiasmo.',
    author: 'Ralph Waldo Emerson',
    category: 'desanimo',
    levelKeys: ['bajo', 'leve'],
    school: 'humanismo',
    title: 'Reavivar la chispa del interés.',
    explanation: 'Encontrar una pequeña causa o pasatiempo que te motive renueva tu energía vital.'
  },
  {
    id: 'anim-23',
    quote: 'Donde hay vida, hay esperanza.',
    author: 'Teócrito',
    category: 'desanimo',
    levelKeys: ['moderado', 'alto'],
    school: 'logoterapia',
    title: 'El regalo sagrado de cada respiración.',
    explanation: 'Mientras tu corazón lata, tienes la posibilidad intacta de sanar y renovarte.'
  },
  {
    id: 'anim-24',
    quote: 'Incluso las piedras más duras se moldean con la constancia del agua suave.',
    author: 'Lao Tzu',
    category: 'desanimo',
    levelKeys: ['bajo', 'leve', 'moderado'],
    school: 'oriental',
    title: 'El poder transformador de la constancia suave.',
    explanation: 'Pequeños hábitos amables sostenidos cada día logran milagros en tu estado de ánimo.'
  },
  {
    id: 'anim-25',
    quote: 'Tu tiempo es limitado, no lo desperdicies viviendo la vida de alguien más.',
    author: 'Steve Jobs',
    category: 'desanimo',
    levelKeys: ['bajo', 'leve'],
    school: 'humanismo',
    title: 'Habitar tu propia autenticidad.',
    explanation: 'Alinear tus días a tus valores reales te devuelve la motivación perdida.'
  },
  {
    id: 'anim-26',
    quote: 'El éxito es ir de fracaso en fracaso sin perder el entusiasmo.',
    author: 'Winston Churchill',
    category: 'desanimo',
    levelKeys: ['leve', 'moderado'],
    school: 'positiva',
    title: 'Reencuadrar los tropezones del camino.',
    explanation: 'Los desaciertos no son finales; son valiosas lecciones de aprendizaje.'
  },
  {
    id: 'anim-27',
    quote: 'La vida es 10% lo que te pasa y 90% cómo reaccionas a ello.',
    author: 'Charles R. Swindoll',
    category: 'desanimo',
    levelKeys: ['leve', 'moderado'],
    school: 'stoicism',
    title: 'El poder soberano de tu respuesta.',
    explanation: 'Elegir tratarte con amabilidad hoy cambia por completo tu experiencia.'
  },
  {
    id: 'anim-28',
    quote: 'Sé amable con todos los que encuentres, pues cada uno libra una dura batalla.',
    author: 'Platón',
    category: 'desanimo',
    levelKeys: ['moderado', 'alto'],
    school: 'humanismo',
    title: 'Compasión universal compartida.',
    explanation: 'Recordar que otros también sufren nos conecta con la gran fraternidad humana.'
  },
  {
    id: 'anim-29',
    quote: 'No hay nada permanente excepto el cambio.',
    author: 'Heráclito',
    category: 'desanimo',
    levelKeys: ['bajo', 'leve', 'moderado', 'alto'],
    school: 'stoicism',
    title: 'La fluidez incesante de la vida.',
    explanation: 'Tu decaimiento presente también cambiará abriendo paso a la frescura.'
  },
  {
    id: 'anim-30',
    quote: 'La felicidad no es algo ya hecho. Viene de tus propias acciones.',
    author: 'Dalai Lama',
    category: 'desanimo',
    levelKeys: ['bajo', 'leve'],
    school: 'oriental',
    title: 'Sembrar pequeñas acciones de bienestar.',
    explanation: 'Un paseo, un vaso de agua o una charla amable son bloques construidos de felicidad.'
  },
  {
    id: 'anim-31',
    quote: 'Al final todo estará bien. Y si no está bien, es que todavía no es el final.',
    author: 'John Lennon',
    category: 'desanimo',
    levelKeys: ['leve', 'moderado', 'alto'],
    school: 'positiva',
    title: 'La promesa del desenlace favorable.',
    explanation: 'Mantén la confianza en el proceso de tu recuperación.'
  },
  {
    id: 'anim-32',
    quote: 'El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora.',
    author: 'Proverbio Chino',
    category: 'desanimo',
    levelKeys: ['bajo', 'leve', 'moderado'],
    school: 'oriental',
    title: 'La fuerza del comienzo en el presente.',
    explanation: 'Hoy es la oportunidad perfecta para empezar a cuidar de ti con ternura.'
  },
  {
    id: 'anim-33',
    quote: 'Tu cuerpo escucha todo lo que dice tu mente.',
    author: 'Naomi Judd',
    category: 'desanimo',
    levelKeys: ['leve', 'moderado', 'alto'],
    school: 'humanismo',
    title: 'Enviar palabras de afecto a tu fisiología.',
    explanation: 'Hablarte con amabilidad libera oxitocina y calma los órganos estresados.'
  },
  {
    id: 'anim-34',
    quote: 'Cree que puedes y ya estarás a mitad del camino.',
    author: 'Theodore Roosevelt',
    category: 'desanimo',
    levelKeys: ['bajo', 'leve'],
    school: 'positiva',
    title: 'La autoconfianza inicial.',
    explanation: 'Confiar en tu capacidad de sanar acelera tu proceso de recuperación.'
  },
  {
    id: 'anim-35',
    quote: 'La alegría de vivir se encuentra en los pequeños momentos compartidos.',
    author: 'Hermann Hesse',
    category: 'desanimo',
    levelKeys: ['bajo', 'leve'],
    school: 'humanismo',
    title: 'Nutrir tus vínculos de afecto.',
    explanation: 'Abrirte a compartir un té o una risa con un ser querido disipa la soledad.'
  },
  {
    id: 'anim-36',
    quote: 'No dejes que lo que no puedes hacer interfiera con lo que puedes hacer.',
    author: 'John Wooden',
    category: 'desanimo',
    levelKeys: ['leve', 'moderado'],
    school: 'positiva',
    title: 'Enfocarte en tu alcance posible hoy.',
    explanation: 'Si hoy solo puedes descansar 10 minutos, hazlo con total entrega y gratitud.'
  },
  {
    id: 'anim-37',
    quote: 'El único modo de hacer un gran trabajo es amar lo que haces.',
    author: 'Steve Jobs',
    category: 'desanimo',
    levelKeys: ['bajo', 'leve'],
    school: 'humanismo',
    title: 'Ponerle corazón a los pequeños actos.',
    explanation: 'Hacer tus tareas con presencia transforma el deber en satisfacción.'
  },
  {
    id: 'anim-38',
    quote: 'Abraza tu historia; es el mapa de tu resiliencia.',
    author: 'Brené Brown',
    category: 'desanimo',
    levelKeys: ['moderado', 'alto'],
    school: 'humanismo',
    title: 'Aceptar tus vulnerabilidades con orgullo.',
    explanation: 'Tus cicatrices demuestran tu capacidad de sobrevivir y transformarte.'
  },
  {
    id: 'anim-39',
    quote: 'Nada es permanente en este mundo. Todo pasa.',
    author: 'Buda',
    category: 'desanimo',
    levelKeys: ['moderado', 'alto'],
    school: 'oriental',
    title: 'La liberación de saber que el dolor concluye.',
    explanation: 'Respira profundo sabiendo que este estado de cansancio se disolverá.'
  },
  {
    id: 'anim-40',
    quote: 'La paz es el resultado de reentrenar tu mente para procesar la vida tal como es.',
    author: 'Wayne Dyer',
    category: 'desanimo',
    levelKeys: ['bajo', 'leve', 'moderado'],
    school: 'positiva',
    title: 'La paz a través de la aceptación sabia.',
    explanation: 'Abrazar tu presente con gratitud es la clave de tu bienestar.'
  },

  // --- AUTOESTIMA & VALOR PROPIO (40 CITAS) ---
  {
    id: 'aut-1',
    quote: 'No eres una gota en el océano. Eres el océano entero en una gota.',
    author: 'Rumi (Poeta y Místico)',
    category: 'autoestima',
    levelKeys: ['bajo', 'moderado'],
    school: 'oriental',
    title: 'Tu valor verdadero es sagrado e inquebrantable.',
    explanation: 'Rumi nos legó esta hermosa certeza: las heridas o críticas del pasado no disminuyen tu dignidad intrínseca. Eres completo/a en esencia.'
  },
  {
    id: 'aut-2',
    quote: 'Tú mismo, tanto como cualquier otro ser en el universo entero, mereces tu amor y afecto.',
    author: 'Buda (Maestro de la Compasión)',
    category: 'autoestima',
    levelKeys: ['leve', 'moderado'],
    school: 'oriental',
    title: 'Trátate con la misma ternura que ofrecerías a un ser querido.',
    explanation: 'A menudo ofrecemos comprensión a los demás pero nos juzgamos con dureza. Reemplazar la duda por autocompasión es tu camino de sanación.'
  },
  {
    id: 'aut-3',
    quote: 'Sé fiel a lo que existe dentro de ti mismo.',
    author: 'André Gide (Premio Nobel de Literatura)',
    category: 'autoestima',
    levelKeys: ['bajo', 'leve'],
    school: 'humanismo',
    title: 'Tu autenticidad es tu mayor fortaleza espiritual.',
    explanation: 'Gide nos invita a habitar nuestra propia verdad sin disculparnos por ser quienes somos. Tu valor no requiere la aprobación de nadie.'
  },
  {
    id: 'aut-4',
    quote: 'Amarse a uno mismo es el comienzo de un romance de por vida.',
    author: 'Oscar Wilde',
    category: 'autoestima',
    levelKeys: ['bajo', 'leve'],
    school: 'humanismo',
    title: 'Cultivar una amistad amorosa contigo mismo/a.',
    explanation: 'Ser tu propio mejor aliado transforma cada desafío en una oportunidad de crecimiento.'
  },
  {
    id: 'aut-5',
    quote: 'Nadie puede hacerte sentir inferior sin tu consentimiento.',
    author: 'Eleanor Roosevelt',
    category: 'autoestima',
    levelKeys: ['leve', 'moderado', 'alto'],
    school: 'humanismo',
    title: 'Retener la soberanía sobre tu propio valor.',
    explanation: 'Las opiniones ajenas son solo reflejos de quienes las emiten; tu valía es inalterable.'
  },
  {
    id: 'aut-6',
    quote: 'El privilegio de toda una vida es convertirse en quien realmente eres.',
    author: 'Carl Gustav Jung',
    category: 'autoestima',
    levelKeys: ['bajo', 'leve', 'moderado'],
    school: 'humanismo',
    title: 'El viaje de la individuación y la autoaceptación.',
    explanation: 'Abrazar tus luces y tus sombras es el logro más bello de la existencia.'
  },
  {
    id: 'aut-7',
    quote: 'No apruebo a nadie que no se respete a sí mismo.',
    author: 'Séneca',
    category: 'autoestima',
    levelKeys: ['bajo', 'leve'],
    school: 'stoicism',
    title: 'El autorespeto como base de la dignidad.',
    explanation: 'Establecer límites sanos con otros demuestra que valoras tu tiempo y tu paz.'
  },
  {
    id: 'aut-8',
    quote: 'La autocompasión es simplemente ser amable contigo mismo cuando sufres.',
    author: 'Kristin Neff',
    category: 'autoestima',
    levelKeys: ['leve', 'moderado', 'alto'],
    school: 'humanismo',
    title: 'Abrazarte en tus momentos de debilidad.',
    explanation: 'Cuando cometas un error, en lugar de criticarte, ofrécete un abrazo y palabras de aliento.'
  },
  {
    id: 'aut-9',
    quote: 'Lo que piensas de ti mismo es mucho más importante que lo que los demás piensen de ti.',
    author: 'Séneca',
    category: 'autoestima',
    levelKeys: ['leve', 'moderado'],
    school: 'stoicism',
    title: 'Tu propio juicio es la única brújula verdadera.',
    explanation: 'Aprender a aprobarte internamente libera la necesidad de complacer a todos.'
  },
  {
    id: 'aut-10',
    quote: 'Sé tú mismo; los demás puestos ya están ocupados.',
    author: 'Oscar Wilde',
    category: 'autoestima',
    levelKeys: ['bajo', 'leve'],
    school: 'humanismo',
    title: 'La belleza irrepetible de tu identidad.',
    explanation: 'No hay nadie en el mundo con tu combinación única de talentos y sensibilidad.'
  },
  {
    id: 'aut-11',
    quote: 'La peor soledad es no estar cómodo contigo mismo.',
    author: 'Mark Twain',
    category: 'autoestima',
    levelKeys: ['moderado', 'alto'],
    school: 'humanismo',
    title: 'Hacer las paces con tu propia compañía.',
    explanation: 'Transformar tu diálogo interno hace de tu mente un lugar cálido para habitar.'
  },
  {
    id: 'aut-12',
    quote: 'Confía en ti mismo: sabes más de lo que crees que sabes.',
    author: 'Benjamin Spock',
    category: 'autoestima',
    levelKeys: ['bajo', 'leve', 'moderado'],
    school: 'positiva',
    title: 'La sabiduría intuitiva que habita en ti.',
    explanation: 'Tienes una inteligencia biológica y emocional lista para guiarte en tus elecciones.'
  },
  {
    id: 'aut-13',
    quote: 'Quien se mira al espejo y sonríe a su reflejo ya ha ganado el día.',
    author: 'Proverbio de Sabiduría',
    category: 'autoestima',
    levelKeys: ['bajo', 'leve'],
    school: 'positiva',
    title: 'La mirada amorosa frente al espejo.',
    explanation: 'Regalarte una mirada compasiva al despertar fortalece tu autoestima corporal.'
  },
  {
    id: 'aut-14',
    quote: 'La autoestima proviene de la convicción de que eres capaz y digno de ser amado.',
    author: 'Nathaniel Branden (Psicólogo de la Autoestima)',
    category: 'autoestima',
    levelKeys: ['leve', 'moderado', 'alto'],
    school: 'humanismo',
    title: 'La doble columna del autorespeto y la autoeficacia.',
    explanation: 'Reconocer tus capacidades y tu derecho a la felicidad nutre tu confianza.'
  },
  {
    id: 'aut-15',
    quote: 'No tienes que ser perfecto para ser maravilloso.',
    author: 'Virginia Satir (Terapeuta Familiar Humanista)',
    category: 'autoestima',
    levelKeys: ['leve', 'moderado', 'alto'],
    school: 'humanismo',
    title: 'Soltar el mito del perfeccionismo.',
    explanation: 'Tu valor es pleno en tu imperfección humana; la perfección es una ilusión inexistente.'
  },
  {
    id: 'aut-16',
    quote: 'Cree en tu propio valor y el mundo empezará a reflejarlo.',
    author: 'Ralph Waldo Emerson',
    category: 'autoestima',
    levelKeys: ['bajo', 'leve'],
    school: 'positiva',
    title: 'El reflejo de la autovalía.',
    explanation: 'Tratarte con respeto inspira a las personas de tu entorno a tratarte con igual consideración.'
  },
  {
    id: 'aut-17',
    quote: 'Eres más fuerte de lo que crees, más valiente de lo que pareces y más inteligente de lo que piensas.',
    author: 'A.A. Milne',
    category: 'autoestima',
    levelKeys: ['moderado', 'alto'],
    school: 'positiva',
    title: 'Reconocer tus fortalezas ocultas.',
    explanation: 'Has superado el 100% de tus días difíciles pasados; tienes los recursos para hoy.'
  },
  {
    id: 'aut-18',
    quote: 'Para amar a alguien más, primero debes aprender a amarte a ti mismo.',
    author: 'Erich Fromm (Psicoanalista y Humanista)',
    category: 'autoestima',
    levelKeys: ['bajo', 'leve', 'moderado'],
    school: 'humanismo',
    title: 'El amor propio como fuente de relaciones sanas.',
    explanation: 'Nutrir tu propio pozo emocional te permite dar desde la abundancia y no desde la escasez.'
  },
  {
    id: 'aut-19',
    quote: 'No compares tu capítulo 1 con el capítulo 20 de alguien más.',
    author: 'Proverbio de Sabiduría',
    category: 'autoestima',
    levelKeys: ['leve', 'moderado'],
    school: 'positiva',
    title: 'Honor a tu propio proceso único.',
    explanation: 'Cada persona lleva ritmos y desafíos distintos; enfócate en tu propia evolución.'
  },
  {
    id: 'aut-20',
    quote: 'Aceptarse es darse permiso para existir en plenitud.',
    author: 'Carl Rogers',
    category: 'autoestima',
    levelKeys: ['moderado', 'alto'],
    school: 'humanismo',
    title: 'El permiso incondicional de habitar tu cuerpo.',
    explanation: 'No necesitas cambiar nada hoy para merecer paz y respeto en este instante.'
  },
  {
    id: 'aut-21',
    quote: 'Donde no hay autocompasión, florece la culpa.',
    author: 'Kristin Neff',
    category: 'autoestima',
    levelKeys: ['moderado', 'alto'],
    school: 'humanismo',
    title: 'Reemplazar la culpa por el perdón propio.',
    explanation: 'Cometer errores es el método natural de aprendizaje del ser humano; perdónate.'
  },
  {
    id: 'aut-22',
    quote: 'Tu voz merece ser escuchada con respeto.',
    author: 'Virginia Satir',
    category: 'autoestima',
    levelKeys: ['leve', 'moderado'],
    school: 'humanismo',
    title: 'El derecho a expresar tu verdad.',
    explanation: 'Expresar tus necesidades con asertividad es un acto de honestidad y dignidad.'
  },
  {
    id: 'aut-23',
    quote: 'La belleza comienza en el momento en que decides ser tú mismo.',
    author: 'Coco Chanel',
    category: 'autoestima',
    levelKeys: ['bajo', 'leve'],
    school: 'positiva',
    title: 'La belleza de la autenticidad.',
    explanation: 'Ser fiel a tus gustos e intuiciones irradia un atractivo y paz inconfundibles.'
  },
  {
    id: 'aut-24',
    quote: 'No eres lo que te sucedió; eres lo que decides ser.',
    author: 'Carl Gustav Jung',
    category: 'autoestima',
    levelKeys: ['moderado', 'alto'],
    school: 'humanismo',
    title: 'Redefinir tu historia desde el presente.',
    explanation: 'Tu pasado es aprendizaje, pero tu futuro lo construyes con tus decisiones de hoy.'
  },
  {
    id: 'aut-25',
    quote: 'Nadie puede quitarte el derecho a respetarte.',
    author: 'Epicteto',
    category: 'autoestima',
    levelKeys: ['bajo', 'leve', 'moderado'],
    school: 'stoicism',
    title: 'La fortaleza inexpugnable del autorespeto.',
    explanation: 'Mantener la dignidad intacta es una elección interior independiente de las circunstancias.'
  },
  {
    id: 'aut-26',
    quote: 'Trátate como si fueras alguien a quien tienes el deber de ayudar.',
    author: 'Jordan Peterson / Sabiduría Clínica',
    category: 'autoestima',
    levelKeys: ['leve', 'moderado', 'alto'],
    school: 'logoterapia',
    title: 'El deber sagrado del autocuidado.',
    explanation: 'Prepárate una comida nutritiva, limpia tu espacio y descansa con la misma devoción que cuidarías a un hijo.'
  },
  {
    id: 'aut-27',
    quote: 'Tu cuerpo es tu compañero de por vida; háblale con cariño.',
    author: 'Louise Hay',
    category: 'autoestima',
    levelKeys: ['bajo', 'leve', 'moderado'],
    school: 'positiva',
    title: 'Gratitud hacia tu vehículo biológico.',
    explanation: 'Agradecer a tus manos, pies y corazón su servicio incondicional restaura tu amor propio.'
  },
  {
    id: 'aut-28',
    quote: 'La verdadera nobleza es ser superior a tu yo anterior.',
    author: 'Proverbio Hindú',
    category: 'autoestima',
    levelKeys: ['bajo', 'leve'],
    school: 'oriental',
    title: 'Superarte a ti mismo con compasión.',
    explanation: 'La única comparación valiosa es mirar cuánto has aprendido respecto al año pasado.'
  },
  {
    id: 'aut-29',
    quote: 'Tu valor no disminuye por la incapacidad de alguien de ver tu belleza.',
    author: 'Sabiduría Popular',
    category: 'autoestima',
    levelKeys: ['moderado', 'alto'],
    school: 'humanismo',
    title: 'Tu brillo no depende de ojos ajenos.',
    explanation: 'Si alguien no sabe valorar tu presencia, eso habla de sus limitaciones, no de tus cualidades.'
  },
  {
    id: 'aut-30',
    quote: 'Abraza tu ritmo; no hay prisa cuando se camina hacia uno mismo.',
    author: 'Hermann Hesse',
    category: 'autoestima',
    levelKeys: ['bajo', 'leve', 'moderado'],
    school: 'humanismo',
    title: 'Paciencia en tu proceso personal.',
    explanation: 'El crecimiento de la autoestima es un árbol de raíces profundas que toma tiempo florecer.'
  },
  {
    id: 'aut-31',
    quote: 'Tu presencia es un regalo para este mundo.',
    author: 'Thich Nhat Hanh',
    category: 'autoestima',
    levelKeys: ['bajo', 'leve'],
    school: 'oriental',
    title: 'La bendición de tu existencia.',
    explanation: 'El simple hecho de estar vivo/a aporta un matiz único a la trama de la humanidad.'
  },
  {
    id: 'aut-32',
    quote: 'Acepta lo que eres y celebro lo que puedes llegar a ser.',
    author: 'Carl Rogers',
    category: 'autoestima',
    levelKeys: ['bajo', 'leve'],
    school: 'humanismo',
    title: 'Celebrar tu potencial en desarrollo.',
    explanation: 'Eres un trabajo en proceso hermoso y digno de ser admirado.'
  },
  {
    id: 'aut-33',
    quote: 'La dignidad no se negocia con nadie.',
    author: 'Séneca',
    category: 'autoestima',
    levelKeys: ['moderado', 'alto'],
    school: 'stoicism',
    title: 'Proteger tu derecho al buen trato.',
    explanation: 'Alejarte de entornos donde no te respeten es la mayor prueba de autoestima.'
  },
  {
    id: 'aut-34',
    quote: 'La paz interior comienza en el momento en que decides no permitir que otra persona controle tus emociones.',
    author: 'Pema Chödrön',
    category: 'autoestima',
    levelKeys: ['leve', 'moderado'],
    school: 'oriental',
    title: 'El dominio de tus fronteras emocionales.',
    explanation: 'Recuperar tu centro te libera de las provocaciones o juicios externos.'
  },
  {
    id: 'aut-35',
    quote: 'Ser compasivo contigo mismo no es egoísmo, es justicia.',
    author: 'Kristin Neff',
    category: 'autoestima',
    levelKeys: ['leve', 'moderado', 'alto'],
    school: 'humanismo',
    title: 'La justicia del autocuidado.',
    explanation: 'Darte prioridad cuando estás exhausto/a es necesario para sostener tu salud.'
  },
  {
    id: 'aut-36',
    quote: 'Siembra un pensamiento y cosecharás una acción; siembra un hábito y cosecharás un carácter.',
    author: 'Ralph Waldo Emerson',
    category: 'autoestima',
    levelKeys: ['bajo', 'leve'],
    school: 'positiva',
    title: 'La construcción del autorespeto mediante hábitos.',
    explanation: 'Cumplir las pequeñas promesas que te haces a ti mismo/a construye una confianza indestructible.'
  },
  {
    id: 'aut-37',
    quote: 'Tu alma merece un refugio donde no exista el juicio duro.',
    author: 'Rumi',
    category: 'autoestima',
    levelKeys: ['moderado', 'alto'],
    school: 'oriental',
    title: 'Construir tu santuario interior amigable.',
    explanation: 'Cierra los ojos y ofrece a tu niño/a interior las palabras de apoyo que siempre deseó escuchar.'
  },
  {
    id: 'aut-38',
    quote: 'El mayor éxito es ser capaz de vivir tu vida a tu manera.',
    author: 'Christopher Morley',
    category: 'autoestima',
    levelKeys: ['bajo', 'leve'],
    school: 'humanismo',
    title: 'Diseñar tu vida según tus valores.',
    explanation: 'Vivir para complacer tus convicciones y no las expectativas ajenas trae paz duradera.'
  },
  {
    id: 'aut-39',
    quote: 'Cuidar de ti es el regalo más amoroso que puedes ofrecer al mundo.',
    author: 'Erich Fromm',
    category: 'autoestima',
    levelKeys: ['bajo', 'leve', 'moderado'],
    school: 'humanismo',
    title: 'Estar bien para poder acompañar con luz.',
    explanation: 'Estar pleno/a te permite ser una presencia de paz para tu familia y amigos.'
  },
  {
    id: 'aut-40',
    quote: 'Mírate con los ojos con los que te mira el creador: con amor incondicional.',
    author: 'Sabiduría Mística',
    category: 'autoestima',
    levelKeys: ['bajo', 'leve', 'moderado', 'alto'],
    school: 'logoterapia',
    title: 'La mirada de la ternura incondicional.',
    explanation: 'Respira hondo y recuerda que tu valor trasciende cualquier logro o fracaso terrenal.'
  },

  // --- BIENESTAR GENERAL & ARMONÍA (40 CITAS) ---
  {
    id: 'bien-1',
    quote: 'La felicidad depende de nosotros mismos.',
    author: 'Aristóteles (Filósofo Griego)',
    category: 'bienestar',
    levelKeys: ['bajo', 'alto'],
    school: 'stoicism',
    title: 'La eudaimonía es la realización del alma en armonía.',
    explanation: 'Aristóteles definió el verdadero bienestar como el cultivo constante de virtudes y la paz interior. Tu vitalidad es el fruto del cuidado a tu mente y cuerpo.'
  },
  {
    id: 'bien-2',
    quote: 'Nada es suficiente para quien lo suficiente es poco.',
    author: 'Epicuro (Filósofo de la Ataraxia)',
    category: 'bienestar',
    levelKeys: ['moderado', 'bajo'],
    school: 'stoicism',
    title: 'Simplificar para recuperar la frescura en tu día.',
    explanation: 'Epicuro enseñaba que la tranquilidad nace de saborear las cosas sencillas sin sobrecargarse de expectativas. Vuelve a lo esencial: naturaleza y descanso.'
  },
  {
    id: 'bien-3',
    quote: 'La gratitud no es solo la mayor de las virtudes, sino la madre de todas las demás.',
    author: 'Cicerón',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'stoicism',
    title: 'El hábito de la apreciación consciente.',
    explanation: 'Agradecer tres detalles simples al terminar tu jornada entrena al cerebro para detectar oportunidades y bienestar.'
  },
  {
    id: 'bien-4',
    quote: 'La vida es realmente sencilla, pero insistimos en hacerla complicada.',
    author: 'Confucio',
    category: 'bienestar',
    levelKeys: ['moderado', 'bajo'],
    school: 'oriental',
    title: 'Volver a la simplicidad nutricia.',
    explanation: 'Soltar la sobreexigencia y disfrutar de un paseo o una comida consciente restaura tu energía rápidamente.'
  },
  {
    id: 'bien-5',
    quote: 'Un día sin risa es un día perdido.',
    author: 'Charlie Chaplin',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'positiva',
    title: 'La medicina del buen humor y la risa.',
    explanation: 'La risa libera endorfinas y relaja la musculatura abdominal, recargando tu vitalidad.'
  },
  {
    id: 'bien-6',
    quote: 'El secreto de la felicidad radica en la libertad, y el secreto de la libertad en el coraje.',
    author: 'Tucídides',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'stoicism',
    title: 'El coraje de elegir tu paz.',
    explanation: 'Atreverte a decir no a lo que te agota es el primer paso para proteger tu bienestar.'
  },
  {
    id: 'bien-7',
    quote: 'Estar en armonía con la naturaleza es estar en armonía con uno mismo.',
    author: 'Lao Tzu',
    category: 'bienestar',
    levelKeys: ['bajo', 'moderado'],
    school: 'oriental',
    title: 'Reconectar con los ritmos naturales.',
    explanation: 'Caminar descalzo en la hierba o recibir luz solar matutina sincroniza tus ritmos circadianos.'
  },
  {
    id: 'bien-8',
    quote: 'La salud es la mayor posesión. La alegría es el mayor tesoro.',
    author: 'Lao Tzu',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'oriental',
    title: 'Valorar la salud como tu activo supremo.',
    explanation: 'Cuidar tus horas de sueño y tu nutrición es la mejor inversión en tu calidad de vida.'
  },
  {
    id: 'bien-9',
    quote: 'El bienestar consiste en la moderación y la armonía de todos los impulsos.',
    author: 'Platón',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'stoicism',
    title: 'El equilibrio dorado en tu rutina.',
    explanation: 'Alternar trabajo enfocado con pausas de descanso absoluto sostiene tu rendimiento sin quemarte.'
  },
  {
    id: 'bien-10',
    quote: 'Disfruta de las pequeñas cosas, porque un día mirarás atrás y te darás cuenta de que eran las grandes cosas.',
    author: 'Robert Brault',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'positiva',
    title: 'La riqueza del detalle cotidiano.',
    explanation: 'El aroma del café o el abrazo de un ser querido son los cimientos reales de una vida feliz.'
  },
  {
    id: 'bien-11',
    quote: 'La verdadera riqueza es el contento con lo que se tiene.',
    author: 'Séneca',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'stoicism',
    title: 'El tesoro de la paz interior.',
    explanation: 'Sentirte en plenitud con tu presente libera la ansiedad por el consumo o la aprobación.'
  },
  {
    id: 'bien-12',
    quote: 'Un cuerpo sano es el hogar de un alma serena.',
    author: 'Francis Bacon',
    category: 'bienestar',
    levelKeys: ['bajo', 'moderado'],
    school: 'humanismo',
    title: 'Cuidar el recipiente de tu espíritu.',
    explanation: 'Un baño tibio, estiramientos suaves y beber agua son actos de amor hacia tu templo físico.'
  },
  {
    id: 'bien-13',
    quote: 'La risa es el sol que ahuyenta el invierno del rostro humano.',
    author: 'Victor Hugo',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'positiva',
    title: 'La luz de la alegría compartida.',
    explanation: 'Buscar la compañía de amigos divertidos ilumina tu paisaje emocional.'
  },
  {
    id: 'bien-14',
    quote: 'Siembra un acto de amabilidad y cosecharás una flor de felicidad.',
    author: 'Proverbio Oriental',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'oriental',
    title: 'El efecto multiplicador de la amabilidad.',
    explanation: 'Un gesto generoso hacia un desconocido eleva los niveles de serotonina en ambos.'
  },
  {
    id: 'bien-15',
    quote: 'La calma es la cuna del poder.',
    author: 'Josiah Gilbert Holland',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'stoicism',
    title: 'La fuerza que nace del silencio.',
    explanation: 'Tomarte 5 minutos de silencio antes de tomar decisiones importantes asegura claridad.'
  },
  {
    id: 'bien-16',
    quote: 'No busques que los eventos sucedan como quieres, sino desea que sucedan como suceden.',
    author: 'Epicteto',
    category: 'bienestar',
    levelKeys: ['moderado', 'bajo'],
    school: 'stoicism',
    title: 'La flexibilidad ante los imponderables.',
    explanation: 'Fluir con los imprevistos de tu día ahorra una inmensa cantidad de energía.'
  },
  {
    id: 'bien-17',
    quote: 'El arte de vivir bien es el arte de saber soltar a tiempo.',
    author: 'Hermann Hesse',
    category: 'bienestar',
    levelKeys: ['moderado', 'bajo'],
    school: 'humanismo',
    title: 'Soltar la tensión para recuperar la ligereza.',
    explanation: 'Dejar ir compromisos que no te pertenecen devuelve el aire a tus pulmones.'
  },
  {
    id: 'bien-18',
    quote: 'Un paseo en la naturaleza es el mejor tónico para el cuerpo y la mente.',
    author: 'Henry David Thoreau',
    category: 'bienestar',
    levelKeys: ['bajo', 'moderado'],
    school: 'humanismo',
    title: 'La medicina de los espacios verdes.',
    explanation: 'Los fitoncidas de los árboles y la brisa fresca disminuyen el cortisol en tu sangre.'
  },
  {
    id: 'bien-19',
    quote: 'La simplicidad es la máxima sofisticación.',
    author: 'Leonardo da Vinci',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'humanismo',
    title: 'La elegancia de una vida bien enfocada.',
    explanation: 'Eliminar el desorden visual y mental en tu entorno te da una sensación de alivio inmediato.'
  },
  {
    id: 'bien-20',
    quote: 'Aprecia el milagro de respirar en este segundo.',
    author: 'Thich Nhat Hanh',
    category: 'bienestar',
    levelKeys: ['bajo', 'moderado', 'alto'],
    school: 'oriental',
    title: 'El milagro del aliento presente.',
    explanation: 'Cada inhalación trae vida limpia y cada exhalación libera lo que ya no necesitas.'
  },
  {
    id: 'bien-21',
    quote: 'Cuidar de tu energía es tu responsabilidad más bella.',
    author: 'Deepak Chopra',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'oriental',
    title: 'Proteger tu vitalidad cotidiana.',
    explanation: 'Filtrar las noticias negativas y las charlas tóxicas sostiene tu buen estado de ánimo.'
  },
  {
    id: 'bien-22',
    quote: 'Donde reina la paz interior, no penetra el conflicto externo.',
    author: 'Séneca',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'stoicism',
    title: 'Tu fortaleza de paz inexpugnable.',
    explanation: 'Crear una rutina de autocuidado por las mañanas te blindará frente al ajetreo del día.'
  },
  {
    id: 'bien-23',
    quote: 'La sonrisa de la gratitud ilumina el alma.',
    author: 'Proverbio de Sabiduría',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'positiva',
    title: 'La vibración de la gratitud.',
    explanation: 'Sonreír levemente activa los músculos faciales que indican seguridad al cerebro.'
  },
  {
    id: 'bien-24',
    quote: 'Saber descansar es tan importante como saber trabajar.',
    author: 'John Lubbock',
    category: 'bienestar',
    levelKeys: ['moderado', 'bajo'],
    school: 'positiva',
    title: 'El valor sagrado del reposo.',
    explanation: 'El descanso no es pérdida de tiempo; es la siembra del rendimiento de mañana.'
  },
  {
    id: 'bien-25',
    quote: 'El equilibrio se encuentra en el centro de todas las cosas.',
    author: 'Buda',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'oriental',
    title: 'El camino del medio.',
    explanation: 'Evitar los extremos de sobreexigencia te permite mantener una constancia alegre.'
  },
  {
    id: 'bien-26',
    quote: 'La belleza de la vida radica en su constante movimiento hacia la luz.',
    author: 'Hermann Hesse',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'humanismo',
    title: 'Buscar activamente los momentos luminosos.',
    explanation: 'Busca la luz del sol, las lecturas inspiradoras y los diálogos edificantes.'
  },
  {
    id: 'bien-27',
    quote: 'La alegría de la vida se contagia en cada gesto de afecto.',
    author: 'Albert Schweitzer (Premio Nobel de la Paz)',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'humanismo',
    title: 'La fraternidad y la alegría compartida.',
    explanation: 'Un mensaje cariñoso a un familiar llena tu propio día de calor y satisfacción.'
  },
  {
    id: 'bien-28',
    quote: 'El sueño repararador es el bálsamo del alma fatigada.',
    author: 'William Shakespeare',
    category: 'bienestar',
    levelKeys: ['moderado', 'bajo'],
    school: 'humanismo',
    title: 'Proteger la calidad de tu descanso nocturno.',
    explanation: 'Apagar el teléfono una hora antes de dormir asegura un sueño profundo y reparador.'
  },
  {
    id: 'bien-29',
    quote: 'Un corazón agradecido es un imán de serenidad.',
    author: 'Ralph Waldo Emerson',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'positiva',
    title: 'La serenidad nacida del agradecimiento.',
    explanation: 'Enfocarte en lo que sí tienes hoy llena de abundancia tu percepción del día.'
  },
  {
    id: 'bien-30',
    quote: 'Sé amable con tu cuerpo para que tu alma quiera habitarlo.',
    author: 'Teresa de Ávila',
    category: 'bienestar',
    levelKeys: ['bajo', 'moderado', 'alto'],
    school: 'humanismo',
    title: 'El templo dichoso de la existencia.',
    explanation: 'Nutre tu cuerpo con alimentos frescos, movimiento amable y pensares benevolentes.'
  },
  {
    id: 'bien-31',
    quote: 'La verdadera felicidad es disfrutar el presente sin dependencia ansiosa del futuro.',
    author: 'Séneca',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'stoicism',
    title: 'Disfrute pleno del momento presente.',
    explanation: 'Saboréalo todo hoy como si fuera un festín único e irrepetible.'
  },
  {
    id: 'bien-32',
    quote: 'La música y el silencio son los dos alimentos más bellos del alma.',
    author: 'Hermann Hesse',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'humanismo',
    title: 'Nutrir tus oídos con notas de paz.',
    explanation: 'Escuchar tu música favorita o disfrutar del silencio de la mañana regenera tu mente.'
  },
  {
    id: 'bien-33',
    quote: 'Todo lo que se cuida con amor florece.',
    author: 'Proverbio Popular',
    category: 'bienestar',
    levelKeys: ['bajo', 'moderado', 'alto'],
    school: 'positiva',
    title: 'El principio del cultivo cariñoso.',
    explanation: 'Cuida tus espacios, tus plantas y tus hábitos con la misma delicadeza que te cuidas a ti.'
  },
  {
    id: 'bien-34',
    quote: 'El bienestar es la armonía entre lo que piensas, lo que dices y lo que haces.',
    author: 'Mahatma Gandhi',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'oriental',
    title: 'La coherencia interna como paz.',
    explanation: 'Vivir en sintonía con tus valores éticos produce una satisfacción inamovible.'
  },
  {
    id: 'bien-35',
    quote: 'La contemplación del cielo nocturno recuerda la paz de nuestra pequeñez sabia.',
    author: 'Carl Sagan',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'humanismo',
    title: 'La perspectiva cósmica de la serenidad.',
    explanation: 'Mirar las estrellas nos recuerda que nuestros problemas diarios son pequeños en el vasto cosmos.'
  },
  {
    id: 'bien-36',
    quote: 'La alegría de la mente es la medida de su fuerza.',
    author: 'Ninon de Lenclos',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'positiva',
    title: 'La fuerza alegre de la resiliencia.',
    explanation: 'Cultivar un buen estado de ánimo protege tus neuronas frente al estrés diario.'
  },
  {
    id: 'bien-37',
    quote: 'Caminar despacio es la forma más bella de llegar lejos.',
    author: 'Proverbio de Sabiduría',
    category: 'bienestar',
    levelKeys: ['bajo', 'moderado'],
    school: 'oriental',
    title: 'El valor de la marcha pausada.',
    explanation: 'Sin prisas desmedidas se llega a los destinos más valiosos con salud intacta.'
  },
  {
    id: 'bien-38',
    quote: 'El amor y la gratitud son el agua tibia que derrite cualquier hielo interno.',
    author: 'Thich Nhat Hanh',
    category: 'bienestar',
    levelKeys: ['bajo', 'moderado', 'alto'],
    school: 'oriental',
    title: 'La calidez de los afectos verdaderos.',
    explanation: 'Rodearte de abrazos y sonrisas auténticas llena de sol tu corazón.'
  },
  {
    id: 'bien-39',
    quote: 'La vida florece allí donde se le presta atención amorosa.',
    author: 'Carl Rogers',
    category: 'bienestar',
    levelKeys: ['alto', 'moderado'],
    school: 'humanismo',
    title: 'La atención plena como nutrición.',
    explanation: 'Donde pones tu atención pones tu energía; elige enfocar la belleza y la calma.'
  },
  {
    id: 'bien-40',
    quote: 'Agradece la vida que palpita en ti en este segundo sagrado.',
    author: 'Rumi',
    category: 'bienestar',
    levelKeys: ['bajo', 'moderado', 'alto'],
    school: 'oriental',
    title: 'La celebración de estar vivo/a.',
    explanation: 'Inhala profundamente y celebra la maravillosa oportunidad de estar aquí hoy.'
  }
];

export function getQuoteForEvaluation(
  category: 'ansiedad' | 'desanimo' | 'autoestima' | 'bienestar',
  levelKey: 'bajo' | 'leve' | 'moderado' | 'alto'
): WisdomQuote {
  const filtered = WISDOM_QUOTES.filter(
    q => q.category === category && q.levelKeys.includes(levelKey)
  );

  if (filtered.length > 0) {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
  }

  // Fallback to any quote matching category
  const categoryQuotes = WISDOM_QUOTES.filter(q => q.category === category);
  if (categoryQuotes.length > 0) {
    return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
  }

  return WISDOM_QUOTES[0];
}
