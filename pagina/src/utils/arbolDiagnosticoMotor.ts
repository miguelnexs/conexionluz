/**
 * CONEXIÓN LUZ® - MOTOR MAESTRO DE DIAGNÓSTICO E INFORMES AUTOMÁTICOS
 * ÁRBOL INTERIOR® (Motor ACM-1.0 / AIC-60® V2.0 / Edición Fundacional 2.0)
 *
 * Integra todos los Documentos Fundacionales:
 * 1. Diccionario Central del Motor de Diagnóstico
 * 2. Manual Oficial de Perfiles Evolutivos
 * 3. Las Heridas, la Vergüenza y la Adaptación Humana (Manto de Vergüenza®)
 * 4. Sistema Oficial de Informes Automáticos ACM-1.0 (15 Secciones Oficiales)
 * 5. Algoritmo de Interpretación AIC-60® (IGA, IAD, IPE y Clasificación por Colores)
 * 6. Inventario Oficial AIC-60® V2.0 (8 Escalas)
 */

export interface MantoVerguenzaDetail {
  nivel: 'Baja' | 'Moderada' | 'Elevada' | 'Organizadora';
  descripcionNivel: string;
  emocionOculta: string;
  necesidadVelada: string;
  identidadProtegida: string;
}

export interface AnatomiaArbolDetail {
  tierra: string;
  raices: string;
  savia: string;
  tronco: string;
  ramas: string;
  frutos: string;
  luz: string;
}

export interface ServicioRecomendado {
  titulo: string;
  descripcion: string;
  icono: string;
  ruta: string;
  badge: string;
}

export interface ArbolPerfilDefinition {
  id: string;
  nombre: string;
  definicionOficial: string;
  descripcionDetallada: string;
  mensajeInformeOficial: string;
  necesidadPrincipal: string;
  heridaOrganizadora: string;
  experienciaNuclearHerida: string;
  creenciaCentral: string;
  emocionPredominante: string;
  mantoVerguenza: MantoVerguenzaDetail;
  conductasAdaptativas: string[];
  obstaculoPrincipal: string;
  sintomasFrecuentes: string[];
  recursosNaturales: string[];
  riesgos: string[];
  objetivoTerapeutico: string;
  preguntaCentral: string;
  virtudEvolutiva: string;
  estadoEvolutivo: string;
  estadoEvolutivoDetalle: string;
  indicadoresIntegracion: string[];
  recomendacionesPersonalizadas: string[];
  serviciosRecomendados: ServicioRecomendado[];
  anatomiaArbol: AnatomiaArbolDetail;
  colorTheme: {
    badge: string;
    border: string;
    bgGradient: string;
    accentHex: string;
  };
}

export const DICCIONARIO_PERFILES: Record<string, ArbolPerfilDefinition> = {
  vigilante: {
    id: 'vigilante',
    nombre: 'EL VIGILANTE',
    definicionOficial: 'Perfil adaptativo caracterizado por una orientación constante hacia la protección, la anticipación de riesgos y la búsqueda de seguridad.',
    descripcionDetallada: 'El Vigilante ha aprendido que el mundo puede ser impredecible y que la confianza puede resultar peligrosa. Su energía está orientada a la protección y observa constantemente el entorno para detectar riesgos.',
    mensajeInformeOficial: 'Tu energía psicológica se orienta principalmente hacia la búsqueda de seguridad. Es posible que hayas desarrollado una gran capacidad para anticipar riesgos y proteger aquello que consideras importante. Tu desafío consiste en transformar control en confianza.',
    necesidadPrincipal: 'Seguridad',
    heridaOrganizadora: 'Traición',
    experienciaNuclearHerida: '“No puedo confiar.”',
    creenciaCentral: '“No puedo confiar completamente / Debo mantenerme alerta para estar seguro.”',
    emocionPredominante: 'Miedo',
    mantoVerguenza: {
      nivel: 'Elevada',
      descripcionNivel: 'Una parte importante de tu adaptación parece orientada a proteger aspectos vulnerables de tu identidad ante el riesgo de traición o fallo.',
      emocionOculta: 'Miedo al daño, vulnerabilidad desprotegida.',
      necesidadVelada: 'Protección afectiva sincera y refugio seguro.',
      identidadProtegida: 'Deseo de entregarse y descansar sin estar en guardia.',
    },
    conductasAdaptativas: ['Control de variables', 'Hipervigilancia', 'Evitación de vulnerabilidad'],
    obstaculoPrincipal: 'Control excesivo',
    sintomasFrecuentes: ['Ansiedad', 'Hipervigilancia', 'Exceso de control', 'Desconfianza', 'Dificultad para delegar'],
    recursosNaturales: ['Observación', 'Prudencia', 'Responsabilidad', 'Anticipación'],
    riesgos: ['Rigidez', 'Aislamiento', 'Agotamiento psicológico', 'Sobrecarga emocional'],
    objetivoTerapeutico: 'Desarrollar seguridad interna independiente del control externo.',
    preguntaCentral: '¿Qué estás intentando proteger?',
    virtudEvolutiva: 'Confianza',
    estadoEvolutivo: 'EL CONFIADO',
    estadoEvolutivoDetalle: 'Aprende a confiar sin perder discernimiento.',
    indicadoresIntegracion: ['Confianza realista', 'Regulación emocional', 'Capacidad de delegar', 'Tolerancia a la incertidumbre'],
    recomendacionesPersonalizadas: [
      'Desarrollar prácticas graduales de confianza y delegación consciente.',
      'Identificar desencadenantes de hipervigilancia en entornos seguros.',
      'Aprender técnicas de regulación del sistema nervioso y liberación corporal.',
    ],
    serviciosRecomendados: [
      {
        titulo: 'Relajación & Mindfulness',
        descripcion: 'Audios de hipnosis guiada para calmar el sistema nervioso y soltar la hipervigilancia.',
        icono: '🧘',
        ruta: '/actividades/relajacion',
        badge: 'Regulación del Miedo',
      },
      {
        titulo: 'Diario Emocional',
        descripcion: 'Registro de seguridad interior para descargar pensamientos de control y alerta.',
        icono: '📓',
        ruta: '/actividades/diario',
        badge: 'Desahogo de Control',
      },
      {
        titulo: 'Ejercicios Guiados',
        descripcion: 'Prácticas clínicas paso a paso para cultivar la virtud de la Confianza.',
        icono: '🏋️',
        ruta: '/actividades/ejercicios',
        badge: 'Cultivo de Confianza',
      },
    ],
    anatomiaArbol: {
      tierra: 'Experiencias de impredecibilidad o quiebre de confianza relacional.',
      raices: 'Necesidad de Seguridad y Herida de Traición.',
      savia: 'Miedo retenido y Manto de Vergüenza® ante la vulnerabilidad.',
      tronco: 'Creencia: “Debo vigilar para no ser vulnerado”.',
      ramas: 'Hipervigilancia, control de variables, reserva emocional.',
      frutos: 'Sensación de aislamiento, tensión muscular y agotamiento.',
      luz: 'Desarrollo de Confianza auténtica y serenidad interior.',
    },
    colorTheme: {
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      border: 'border-amber-400',
      bgGradient: 'from-amber-50 to-orange-50/50',
      accentHex: '#d97706',
    },
  },
  caminante_vacio: {
    id: 'caminante_vacio',
    nombre: 'EL CAMINANTE VACÍO',
    definicionOficial: 'Perfil adaptativo caracterizado por continuar avanzando sintiendo que algo esencial falta, experimentando soledad interna.',
    descripcionDetallada: 'El Caminante Vacío continúa avanzando, pero siente que algo esencial falta. Experimenta soledad interna incluso cuando está acompañado y busca fuera aquello que necesita desarrollar dentro.',
    mensajeInformeOficial: 'Tu adaptación parece estar influida por la búsqueda de significado y propósito. Es posible que sientas que falta algo fundamental en tu vida. Tu desafío consiste en transformar vacío en sentido.',
    necesidadPrincipal: 'Sentido y Pertenencia',
    heridaOrganizadora: 'Abandono (o Abandono Existencial)',
    experienciaNuclearHerida: '“Estoy solo / Algo importante falta en mi vida.”',
    creenciaCentral: '“Estoy solo / Algo fundamental falta dentro de mí.”',
    emocionPredominante: 'Tristeza y Vacío Existencial',
    mantoVerguenza: {
      nivel: 'Moderada',
      descripcionNivel: 'En determinadas situaciones puedes ocultar tu necesidad de afecto o vacío interno para evitar mostrar vulnerabilidad o rechazo.',
      emocionOculta: 'Tristeza por separación, añoranza de afecto profundo.',
      necesidadVelada: 'Vínculo incondicional, significado y presencia amorosa.',
      identidadProtegida: 'Anhelo de pertenecer y florecer con propósito propio.',
    },
    conductasAdaptativas: ['Dependencia emocional', 'Autosacrificio', 'Búsqueda externa compulsiva'],
    obstaculoPrincipal: 'Dependencia emocional / Desmotivación',
    sintomasFrecuentes: ['Apatía', 'Desmotivación', 'Desesperanza', 'Soledad interna'],
    recursosNaturales: ['Introspección', 'Sensibilidad', 'Reflexión profunda', 'Búsqueda de crecimiento'],
    riesgos: ['Estancamiento', 'Nihilismo', 'Desconexión emocional'],
    objetivoTerapeutico: 'Reconstruir sentido, autoacompañamiento y propósito vital.',
    preguntaCentral: '¿Qué necesitas darte a ti mismo?',
    virtudEvolutiva: 'Autonomía emocional y Propósito',
    estadoEvolutivo: 'EL CREADOR DE SENTIDO / EL CONECTADO',
    estadoEvolutivoDetalle: 'Desarrolla vínculos y propósitos desde la plenitud y no desde la carencia.',
    indicadoresIntegracion: ['Claridad existencial', 'Relaciones profundas', 'Motivación intrínseca', 'Participación activa en la vida'],
    recomendacionesPersonalizadas: [
      'Explorar actividades diarias con significado propio e intención.',
      'Cultivar el autoacompañamiento compasivo sin juzgar los momentos de vacío.',
      'Construir relaciones basadas en la reciprocidad y la presencia consciente.',
    ],
    serviciosRecomendados: [
      {
        titulo: 'Diario Emocional',
        descripcion: 'Diario introspectivo de autoconexión para explorar tu sentir y reconstruir significado.',
        icono: '📓',
        ruta: '/actividades/diario',
        badge: 'Autoacompañamiento',
      },
      {
        titulo: 'Relajación & Mindfulness',
        descripcion: 'Meditación guiada para abrazar la soledad en plenitud y cultivar paz interior.',
        icono: '🧘',
        ruta: '/actividades/relajacion',
        badge: 'Calma Existencial',
      },
      {
        titulo: 'Ejercicios Guiados',
        descripcion: 'Prácticas para identificar tus valores fundamentales y reconstruir tu propósito.',
        icono: '🏋️',
        ruta: '/actividades/ejercicios',
        badge: 'Sentido & Propósito',
      },
    ],
    anatomiaArbol: {
      tierra: 'Vivencias de separación o distancia afectiva sostenida.',
      raices: 'Necesidad de Pertenencia/Sentido y Herida de Abandono.',
      savia: 'Tristeza latente y Manto de Vergüenza® a necesitar del otro.',
      tronco: 'Creencia: “Tengo que buscar afuera mi propio calor”.',
      ramas: 'Aferramiento a vínculos, autosacrificio, melancolía.',
      frutos: 'Sensación de vacío, desmotivación o fatiga relacional.',
      luz: 'Plenitud interior, autonomía afectiva y reconexión verdadera.',
    },
    colorTheme: {
      badge: 'bg-teal-100 text-teal-900 border-teal-300',
      border: 'border-teal-400',
      bgGradient: 'from-teal-50 to-emerald-50/50',
      accentHex: '#0d9488',
    },
  },
  guerrero_agotado: {
    id: 'guerrero_agotado',
    nombre: 'EL GUERRERO AGOTADO',
    definicionOficial: 'Perfil adaptativo caracterizado por haber construido su valor a través del esfuerzo constante para demostrar que merece reconocimiento.',
    descripcionDetallada: 'El Guerrero Agotado ha construido su valor a través del esfuerzo. Lucha constantemente para demostrar que merece reconocimiento, pero su fortaleza suele ocultar un gran cansancio emocional.',
    mensajeInformeOficial: 'Tu adaptación parece organizada alrededor del rendimiento, la responsabilidad y la necesidad de demostrar valor. Tu desafío consiste en transformar autoexigencia en autovaloración.',
    necesidadPrincipal: 'Reconocimiento',
    heridaOrganizadora: 'Humillación / Desvalorización',
    experienciaNuclearHerida: '“Hay algo malo en mí / No soy suficiente.”',
    creenciaCentral: '“Debo demostrar mi valor a través del rendimiento y el esfuerzo continuo.”',
    emocionPredominante: 'Vergüenza transformada en esfuerzo',
    mantoVerguenza: {
      nivel: 'Organizadora',
      descripcionNivel: 'La vergüenza desempeña un papel central en la forma en que impulsas tu rendimiento para ocultar temores de insuficiencia.',
      emocionOculta: 'Sensación de insuficiencia, temor a la falla.',
      necesidadVelada: 'Valoración intrínseca sin necesidad de demostrar nada.',
      identidadProtegida: 'Deseo de ser amado por ser, no por hacer.',
    },
    conductasAdaptativas: ['Autoexigencia', 'Perfeccionismo', 'Sobreesfuerzo', 'Competitividad defensiva'],
    obstaculoPrincipal: 'Perfeccionismo y sobreesfuerzo',
    sintomasFrecuentes: ['Autoexigencia', 'Perfeccionismo', 'Agotamiento', 'Dependencia de aprobación'],
    recursosNaturales: ['Disciplina', 'Compromiso', 'Productividad', 'Perseverancia'],
    riesgos: ['Burnout', 'Desconexión emocional', 'Dependencia del rendimiento'],
    objetivoTerapeutico: 'Reconocer valor personal independiente del rendimiento y descansar.',
    preguntaCentral: '¿Qué estás intentando demostrar?',
    virtudEvolutiva: 'Autoaceptación y Autovaloración',
    estadoEvolutivo: 'EL EQUILIBRADO',
    estadoEvolutivoDetalle: 'Aprende a valorar el ser por encima del hacer.',
    indicadoresIntegracion: ['Autoestima estable', 'Descanso saludable', 'Equilibrio personal', 'Menor autoexigencia'],
    recomendacionesPersonalizadas: [
      'Separar el valor personal único del rendimiento o los resultados externos.',
      'Establecer límites claros al trabajo y priorizar el descanso reparador.',
      'Practicar la autocompasión frente a las imperfecciones del camino.',
    ],
    serviciosRecomendados: [
      {
        titulo: 'Relajación & Mindfulness',
        descripcion: 'Audios de descompresión profunda para soltar la carga de autoexigencia y descansar.',
        icono: '🧘',
        ruta: '/actividades/relajacion',
        badge: 'Descanso Reparador',
      },
      {
        titulo: 'Ejercicios Guiados',
        descripcion: 'Prácticas clínicas para reconocer tu valor intrínseco independiente del rendimiento.',
        icono: '🏋️',
        ruta: '/actividades/ejercicios',
        badge: 'Autovaloración',
      },
      {
        titulo: 'Mi Progreso',
        descripcion: 'Tablero compasivo de seguimiento de bienestar libre de metas rígidas.',
        icono: '📊',
        ruta: '/actividades/progreso',
        badge: 'Equilibrio Saludable',
      },
    ],
    anatomiaArbol: {
      tierra: 'Entornos de exigencia condicionada o experiencias de desvalorización.',
      raices: 'Necesidad de Reconocimiento y Herida de Humillación.',
      savia: 'Vergüenza de imperfección y Manto de Vergüenza® ante la debilidad.',
      tronco: 'Creencia: “Valgo únicamente si produzco o destaco”.',
      ramas: 'Hiperactividad, sobreesfuerzo, dificultad para pausar.',
      frutos: 'Burnout, agotamiento severo, frustración silenciosa.',
      luz: 'Autovaloración intrínseca, paz personal y descanso merecido.',
    },
    colorTheme: {
      badge: 'bg-rose-100 text-rose-900 border-rose-300',
      border: 'border-rose-400',
      bgGradient: 'from-rose-50 to-red-50/50',
      accentHex: '#e11d48',
    },
  },
  prisionero_invisible: {
    id: 'prisionero_invisible',
    nombre: 'EL PRISIONERO INVISIBLE',
    definicionOficial: 'Perfil adaptativo caracterizado por vivir dentro de límites construidos por exigencias internas y temor al error.',
    descripcionDetallada: 'El Prisionero Invisible vive dentro de límites construidos por exigencias internas. Su prisión no es externa; es una estructura mental basada en regla, rigidez y temor al juicio, error o rechazo.',
    mensajeInformeOficial: 'Una parte importante de tu adaptación parece estar orientada a proteger la pertenencia y la aceptación. Es posible que ocultes aspectos de ti mismo para evitar rechazo o crítica. Tu desafío consiste en transformar ocultamiento en autenticidad.',
    necesidadPrincipal: 'Pertenencia y Coherencia',
    heridaOrganizadora: 'Rechazo e Injusticia',
    experienciaNuclearHerida: '“No soy aceptado si me expongo / Debe ser perfecto.”',
    creenciaCentral: '“Si me muestro como realmente soy o cometo errores, seré rechazado.”',
    emocionPredominante: 'Vergüenza y Frustración',
    mantoVerguenza: {
      nivel: 'Organizadora',
      descripcionNivel: 'El Manto de Vergüenza® regula intensamente tus decisiones para evitar cualquier posibilidad de exposición o rechazo.',
      emocionOculta: 'Miedo al juicio social, temor al ridículo.',
      necesidadVelada: 'Aceptación incondicional de la propia autenticidad.',
      identidadProtegida: 'Libertad de expresión y deseos genuinos.',
    },
    conductasAdaptativas: ['Complacencia', 'Invisibilidad', 'Autoocultamiento', 'Perfeccionismo estricto'],
    obstaculoPrincipal: 'Rigidez y Autoocultamiento',
    sintomasFrecuentes: ['Inhibición', 'Aislamiento emocional', 'Autoocultamiento', 'Miedo a la exposición'],
    recursosNaturales: ['Empatía', 'Sensibilidad', 'Adaptabilidad', 'Observación social'],
    riesgos: ['Autoanulación', 'Dependencia de aprobación', 'Pérdida de identidad'],
    objetivoTerapeutico: 'Desarrollar Autenticidad Segura, expresión libre y flexibilidad.',
    preguntaCentral: '¿Qué ocurriría si avanzaras sin perfección?',
    virtudEvolutiva: 'Autoaceptación y Flexibilidad',
    estadoEvolutivo: 'EL CREADOR / EL CONECTADO',
    estadoEvolutivoDetalle: 'Utiliza el error y la expresión auténtica como parte natural del crecimiento.',
    indicadoresIntegracion: ['Expresión auténtica', 'Relaciones profundas', 'Acción sin miedo al juicio', 'Flexibilidad cognitiva'],
    recomendacionesPersonalizadas: [
      'Practicar la expresión auténtica en entornos de confianza pequeña.',
      'Cuestionar las reglas rígidas sobre "lo que se debe mostrar o decir".',
      'Integrar el margen de error como un derecho natural de aprendizaje.',
    ],
    serviciosRecomendados: [
      {
        titulo: 'Diario Emocional',
        descripcion: 'Espacio privado totalmente seguro para expresar tu verdad y disolver la vergüenza.',
        icono: '📓',
        ruta: '/actividades/diario',
        badge: 'Expresión Auténtica',
      },
      {
        titulo: 'Ejercicios Guiados',
        descripcion: 'Prácticas clínicas para soltar el miedo al juicio social y abrazar la espontaneidad.',
        icono: '🏋️',
        ruta: '/actividades/ejercicios',
        badge: 'Autenticidad Segura',
      },
      {
        titulo: 'Relajación & Mindfulness',
        descripcion: 'Audios de liberación del perfeccionismo y flexibilización de reglas rígidas.',
        icono: '🧘',
        ruta: '/actividades/relajacion',
        badge: 'Flexibilidad Mental',
      },
    ],
    anatomiaArbol: {
      tierra: 'Experiencias de crítica temprana o entornos juiciosos.',
      raices: 'Necesidades de Pertenencia/Coherencia y Herida de Rechazo/Injusticia.',
      savia: 'Manto de Vergüenza® bloqueando el fluir espontáneo de la savia.',
      tronco: 'Creencia: “Ocultar mi verdad me mantiene a salvo”.',
      ramas: 'Invisibilidad, filtro excesivo de palabras, inhibición.',
      frutos: 'Sensación de estar atrapado, timidez o autoanulación.',
      luz: 'Autenticidad radiante, libertad creativa y libre expresión.',
    },
    colorTheme: {
      badge: 'bg-purple-100 text-purple-900 border-purple-300',
      border: 'border-purple-400',
      bgGradient: 'from-purple-50 to-indigo-50/50',
      accentHex: '#9333ea',
    },
  },
  explorador_interior: {
    id: 'explorador_interior',
    nombre: 'EL EXPLORADOR INTERIOR',
    definicionOficial: 'Perfil adaptativo caracterizado por una búsqueda constante de significado e investigación profunda de su historia.',
    descripcionDetallada: 'El Explorador Interior ha iniciado el viaje hacia la comprensión profunda. Busca significado, investiga su historia y cuestiona creencias, pero corre el riesgo de quedarse en la comprensión sin transformación real.',
    mensajeInformeOficial: 'Tu adaptación se orienta hacia la comprensión, el análisis y la búsqueda de coherencia. Es posible que investigues profundamente tu mente. Tu desafío consiste en transformar rigidez e intelectualización en flexibilidad y experiencia viva.',
    necesidadPrincipal: 'Coherencia y Sentido',
    heridaOrganizadora: 'Injusticia o Desconexión Existencial',
    experienciaNuclearHerida: '“Necesito entender el porqué de todo para estar en paz.”',
    creenciaCentral: '“Necesito comprender racionalmente para no sentir dolor o descontrol.”',
    emocionPredominante: 'Curiosidad y Racionalización',
    mantoVerguenza: {
      nivel: 'Moderada',
      descripcionNivel: 'Utilizas el análisis y las teorías como una capa protectora para distanciarte de emociones que resultan abrumadoras.',
      emocionOculta: 'Vulnerabilidad emocional no analizada, confusión.',
      necesidadVelada: 'Sentir sin juzgar y experimentar paz viva.',
      identidadProtegida: 'Conexión espiritual y vivencial del corazón.',
    },
    conductasAdaptativas: ['Intelectualización', 'Sobreanálisis', 'Evitación vivencial'],
    obstaculoPrincipal: 'Intelectualización (Parálisis por análisis)',
    sintomasFrecuentes: ['Sobreanálisis', 'Intelectualización', 'Indecisión', 'Dificultad para actuar'],
    recursosNaturales: ['Pensamiento analítico', 'Aprendizaje', 'Reflexión', 'Curiosidad'],
    riesgos: ['Parálisis por análisis', 'Distanciamiento emocional', 'Exceso de racionalización'],
    objetivoTerapeutico: 'Transformar la comprensión teórica en experiencia viva y acción corporal.',
    preguntaCentral: '¿Qué comprensión necesita convertirse en experiencia?',
    virtudEvolutiva: 'Integración y Flexibilidad',
    estadoEvolutivo: 'EL SABIO',
    estadoEvolutivoDetalle: 'Integra conocimiento, experiencia viva y conciencia.',
    indicadoresIntegracion: ['Acción consciente', 'Flexibilidad cognitiva', 'Equilibrio entre pensar y actuar'],
    recomendacionesPersonalizadas: [
      'Equilibrar el análisis teórico con experiencias corporales y emocionales vivas.',
      'Pasar de la comprensión al experimento práctico de pequeños pasos.',
      'Aprender a habitar el no-saber sin que genere ansiedad o parálisis.',
    ],
    serviciosRecomendados: [
      {
        titulo: 'Ejercicios Guiados',
        descripcion: 'Prácticas para pasar de la sobreintelectualización al experimento práctico vivencial.',
        icono: '🏋️',
        ruta: '/actividades/ejercicios',
        badge: 'Acción Consciente',
      },
      {
        titulo: 'Relajación & Mindfulness',
        descripcion: 'Mindfulness corporal e hipnosis guiada para habitar la mente en calma y sentir.',
        icono: '🧘',
        ruta: '/actividades/relajacion',
        badge: 'Conexión Corporal',
      },
      {
        titulo: 'Diario Emocional',
        descripcion: 'Registro de integración para sincronizar lo que comprendes con lo que sientes.',
        icono: '📓',
        ruta: '/actividades/diario',
        badge: 'Integración Vivencial',
      },
    ],
    anatomiaArbol: {
      tierra: 'Momentos donde sentir resultaba abrumador o confuso.',
      raices: 'Necesidad de Coherencia/Sentido y Herida de Injusticia/Desconexión.',
      savia: 'Curiosidad que sustituye a las emociones vivas no procesadas.',
      tronco: 'Creencia: “Entender el mapa equivale a recorrer el camino”.',
      ramas: 'Lectura incesante, teorías personales, postergación práctica.',
      frutos: 'Sensación de saber mucho pero sentir o cambiar poco.',
      luz: 'Sabiduría encarnada, fluidez entre mente, corazón y acción.',
    },
    colorTheme: {
      badge: 'bg-blue-100 text-blue-900 border-blue-300',
      border: 'border-blue-400',
      bgGradient: 'from-blue-50 to-sky-50/50',
      accentHex: '#2563eb',
    },
  },
  navegante: {
    id: 'navegante',
    nombre: 'EL NAVEGANTE',
    definicionOficial: 'Perfil adaptativo caracterizado por la capacidad de avanzar conscientemente aun en medio de la incertidumbre.',
    descripcionDetallada: 'El Navegante representa la capacidad de avanzar conscientemente aun en medio de la incertidumbre. No ha eliminado todas sus heridas, pero ha aprendido a relacionarse con ellas de manera diferente.',
    mensajeInformeOficial: 'Tu adaptación se relaciona con la búsqueda de dirección y claridad. Posees iniciativa y adaptabilidad para explorar rumbos. Tu desafío consiste en transformar incertidumbre y dispersión en compromiso sostenido.',
    necesidadPrincipal: 'Dirección y Autonomía',
    heridaOrganizadora: 'Desorientación',
    experienciaNuclearHerida: '“No sé hacia dónde ir / Me cuesta sostener la ruta.”',
    creenciaCentral: '“Debo seguir moviéndome para no quedar estancado.”',
    emocionPredominante: 'Incertidumbre',
    mantoVerguenza: {
      nivel: 'Baja',
      descripcionNivel: 'La vergüenza tiene poca influencia; el desafío radica en enfocar la energía dispersa en objetivos claros.',
      emocionOculta: 'Miedo al fracaso de destino o vacilación interior.',
      necesidadVelada: 'Certeza interior y propósito firme.',
      identidadProtegida: 'Liderazgo de la propia vida con compromiso.',
    },
    conductasAdaptativas: ['Cambios constantes de rumbo', 'Dispersión', 'Postergación estratégica'],
    obstaculoPrincipal: 'Pasividad o Dispersión',
    sintomasFrecuentes: ['Dispersión', 'Postergación', 'Cambios constantes de rumbo', 'Falta de enfoque'],
    recursosNaturales: ['Iniciativa', 'Adaptabilidad', 'Visión de futuro', 'Motivación'],
    riesgos: ['Impaciencia', 'Inconstancia', 'Superficialidad'],
    objetivoTerapeutico: 'Desarrollar dirección interna, foco y compromiso sostenido.',
    preguntaCentral: '¿Cuál es el siguiente paso que ya conoces?',
    virtudEvolutiva: 'Acción Consciente y Compromiso',
    estadoEvolutivo: 'EL GUÍA',
    estadoEvolutivoDetalle: 'Ayuda a otros a encontrar dirección mientras continúa desarrollando la propia.',
    indicadoresIntegracion: ['Objetivos claros', 'Persistencia', 'Toma de decisiones consistente', 'Avance sostenido'],
    recomendacionesPersonalizadas: [
      'Construir objetivos concretos, medibles y sostenibles en el tiempo.',
      'Practicar el enfoque unidireccional evitando saltar de proyecto antes de terminar.',
      'Sostener las decisiones a través de la disciplina consciente.',
    ],
    serviciosRecomendados: [
      {
        titulo: 'Ejercicios Guiados',
        descripcion: 'Plan de acción estructurado para definir dirección, enfoque y metas sostenibles.',
        icono: '🏋️',
        ruta: '/actividades/ejercicios',
        badge: 'Dirección Interna',
      },
      {
        titulo: 'Mi Progreso',
        descripcion: 'Tablero de seguimiento de avance sostenido para mantener la constancia.',
        icono: '📊',
        ruta: '/actividades/progreso',
        badge: 'Foco y Persistencia',
      },
      {
        titulo: 'Diario Emocional',
        descripcion: 'Espacio de clarificación de metas y decisiones para superar la postergación.',
        icono: '📓',
        ruta: '/actividades/diario',
        badge: 'Compromiso Consciente',
      },
    ],
    anatomiaArbol: {
      tierra: 'Momentos de pérdida de rumbo o giros vitales inesperados.',
      raices: 'Necesidad de Dirección/Autonomía y Herida de Desorientación.',
      savia: 'Incertidumbre buscando canalización en acción consciente.',
      tronco: 'Creencia: “El movimiento constante compensa la duda”.',
      ramas: 'Exploración de múltiples opciones, prueba y error.',
      frutos: 'Rumbos intermitentes, necesidad de enfoque unificado.',
      luz: 'Maestría de rumbo, compromiso inquebrantable y liderazgo guía.',
    },
    colorTheme: {
      badge: 'bg-cyan-100 text-cyan-900 border-cyan-300',
      border: 'border-cyan-400',
      bgGradient: 'from-cyan-50 to-sky-50/50',
      accentHex: '#0891b2',
    },
  },
};

/**
 * ESTRUCTURA OFICIAL DEL INFORME AUTOMÁTICO MOTOR ACM-1.0 (15 SECCIONES)
 */
export interface InformeAutomaticoACM10 {
  seccion1_resumenGeneral: string;
  seccion2_perfilPrincipal: {
    nombre: string;
    mensaje: string;
    definicion: string;
  };
  seccion3_perfilSecundario?: {
    nombre: string;
    mensaje: string;
  };
  seccion4_necesidadPrioritaria: {
    nombre: string;
    descripcion: string;
  };
  seccion5_heridaDominante: {
    nombre: string;
    experienciaNuclear: string;
    descripcion: string;
  };
  seccion6_mantoVerguenza: MantoVerguenzaDetail;
  seccion7_emocionDominante: string;
  seccion8_conductaAdaptativaPrincipal: string;
  seccion9_iad: {
    nivel: 'Bajo' | 'Moderado' | 'Alto';
    interpretacion: string;
  };
  seccion10_recursosPrincipales: {
    fuertes: string[];
    enDesarrollo: string[];
  };
  seccion11_ipe: {
    nivel: 'Alto' | 'Medio' | 'Bajo';
    interpretacion: string;
  };
  seccion12_estadoEvolutivo: {
    nombre: string;
    detalle: string;
  };
  seccion13_rutaTerapeutica: {
    cadenaRuta: string;
    secuencia: {
      necesidad: string;
      herida: string;
      verguenza: string;
      emocion: string;
      conducta: string;
      recurso: string;
      virtud: string;
      estadoEvolutivo: string;
    };
  };
  seccion14_recomendaciones: string[];
  seccion15_conclusion: string;
  igaMetrics: {
    igaScore: number;
    igaLabel: string;
    igaColor: string;
    perfilGlobal: string;
  };
}

export interface DiagnosticResultEngine {
  perfilPrincipal: ArbolPerfilDefinition;
  perfilSecundario?: ArbolPerfilDefinition;
  puntajesPerfiles: Record<string, number>;
  resumenClinico: string;
  informeOficialACM10: InformeAutomaticoACM10;
  rutaTransformacion: {
    necesidad: string;
    herida: string;
    experienciaNuclear: string;
    creencia: string;
    mantoVerguenza: MantoVerguenzaDetail;
    conductasAdaptativas: string[];
    emocion: string;
    obstaculo: string;
    sintomas: string[];
    recursos: string[];
    preguntaCentral: string;
    objetivo: string;
    virtud: string;
    estadoEvolutivo: string;
    estadoEvolutivoDetalle: string;
    anatomiaArbol: AnatomiaArbolDetail;
  };
}

/**
 * MOTOR DE CÁLCULO E INTERPRETACIÓN ACM-1.0 / AIC-60®
 * Genera el Informe Oficial de 15 Secciones del Árbol Interior®
 */
export function calcularDiagnosticoArbol(
  historyPath: any[],
  scores: { stress: number; mood: number; sleep: number; energy: number; focus: number }
): DiagnosticResultEngine {
  const profileScores: Record<string, number> = {
    vigilante: 0,
    caminante_vacio: 0,
    guerrero_agotado: 0,
    prisionero_invisible: 0,
    explorador_interior: 0,
    navegante: 0,
  };

  // Mapeo dinámico por opciones elegidas en el árbol
  const optionMap: Record<string, keyof typeof DICCIONARIO_PERFILES> = {
    // Paso 1: Enfoque inicial
    opt_stress: 'vigilante',
    opt_mood: 'caminante_vacio',
    opt_sleep: 'guerrero_agotado',
    opt_growth: 'explorador_interior',

    // Paso 2: Manifestación
    opt_s_mental: 'vigilante',
    opt_s_somatic: 'guerrero_agotado',
    opt_s_emotional: 'prisionero_invisible',

    opt_m_apathy: 'caminante_vacio',
    opt_m_grief: 'caminante_vacio',
    opt_m_burnout: 'guerrero_agotado',

    opt_sl_init: 'vigilante',
    opt_sl_interr: 'navegante',
    opt_sl_fatigue: 'guerrero_agotado',

    opt_g_calm: 'explorador_interior',
    opt_g_journal: 'prisionero_invisible',
    opt_g_guidance: 'navegante',

    // Paso 3: Frecuencia / Intensidad
    opt_f_mild: 'explorador_interior',
    opt_f_mod: 'navegante',
    opt_f_high: 'vigilante',

    // Paso 4: Recursos / Disposición
    opt_c_step1: 'prisionero_invisible',
    opt_c_guided: 'explorador_interior',
    opt_c_full: 'navegante',
  };

  // 1. Ponderar por el camino recorrido
  historyPath.forEach((item, index) => {
    const pKey = optionMap[item.optionId];
    if (pKey) {
      const weight = index === 0 ? 35 : index === 1 ? 30 : index === 2 ? 20 : 15;
      profileScores[pKey] = (profileScores[pKey] || 0) + weight;
    }
  });

  // 2. Modificar con las métricas cuantitativas
  if (scores.stress > 60) profileScores.vigilante += 20;
  if (scores.energy < 30) profileScores.guerrero_agotado += 20;
  if (scores.mood < 30) profileScores.caminante_vacio += 20;
  if (scores.focus > 50) profileScores.explorador_interior += 15;

  // Ordenar perfiles
  const sortedProfiles = Object.entries(profileScores).sort((a, b) => b[1] - a[1]);

  const topKey = sortedProfiles[0][0] || 'vigilante';
  const secondKey = sortedProfiles[1][1] > 20 ? sortedProfiles[1][0] : undefined;

  const perfilPrincipal = DICCIONARIO_PERFILES[topKey] || DICCIONARIO_PERFILES.vigilante;
  const perfilSecundario = secondKey ? DICCIONARIO_PERFILES[secondKey] : undefined;

  // CÁLCULO DEL IGA (Índice General del Árbol) Y MÉTRICAS ACM-1.0
  const tierraScore = Math.min(5, Math.max(1, (100 - scores.stress) / 20));
  const troncoScore = Math.min(5, Math.max(1, scores.focus / 20));
  const ramasScore = Math.min(5, Math.max(1, (100 - scores.stress * 0.7) / 20));
  const hojasScore = Math.min(5, Math.max(1, scores.energy / 20));
  const frutosScore = Math.min(5, Math.max(1, scores.mood / 20));
  const luzScore = Math.min(5, Math.max(1, (scores.focus * 0.5 + scores.mood * 0.5) / 20));

  const igaScore = parseFloat(((tierraScore + troncoScore + ramasScore + hojasScore + frutosScore + luzScore) / 6).toFixed(1));

  let igaLabel = 'Árbol Funcional';
  let igaColor = 'bg-yellow-500 text-yellow-950';
  let perfilGlobal = 'Árbol Adaptativo';

  if (igaScore >= 4.5) {
    igaLabel = 'Árbol Altamente Integrado';
    igaColor = 'bg-emerald-500 text-white';
    perfilGlobal = 'Árbol en Crecimiento';
  } else if (igaScore >= 4.0) {
    igaLabel = 'Árbol Saludable';
    igaColor = 'bg-teal-500 text-white';
    perfilGlobal = 'Árbol en Transformación';
  } else if (igaScore >= 3.0) {
    igaLabel = 'Árbol Funcional';
    igaColor = 'bg-amber-500 text-slate-900';
    perfilGlobal = 'Árbol Adaptativo';
  } else if (igaScore >= 2.0) {
    igaLabel = 'Árbol Vulnerable';
    igaColor = 'bg-orange-500 text-white';
    perfilGlobal = 'Árbol Vulnerable';
  } else {
    igaLabel = 'Árbol en Riesgo';
    igaColor = 'bg-rose-600 text-white';
    perfilGlobal = 'Árbol Herido';
  }

  // IAD & IPE
  const iadNivel: 'Bajo' | 'Moderado' | 'Alto' = scores.stress > 60 ? 'Alto' : scores.stress > 35 ? 'Moderado' : 'Bajo';
  const iadInterpretacion = iadNivel === 'Bajo'
    ? 'La adaptación actual parece relativamente flexible y receptiva al cambio.'
    : iadNivel === 'Moderado'
    ? 'Existen mecanismos de protección activos en determinadas áreas del bienestar.'
    : 'La adaptación actual parece estar fuertemente orientada hacia la protección frente a experiencias dolorosas.';

  const ipeNivel: 'Alto' | 'Medio' | 'Bajo' = (scores.energy > 50 && scores.mood > 40) ? 'Alto' : scores.energy > 30 ? 'Medio' : 'Bajo';
  const ipeInterpretacion = ipeNivel === 'Alto'
    ? 'Posees recursos importantes e iniciativa disponible para facilitar procesos de transformación.'
    : ipeNivel === 'Medio'
    ? 'Existen capacidades disponibles que pueden fortalecerse de manera gradual.'
    : 'Puede ser beneficioso comenzar fortaleciendo recursos y autocompasión antes de abordar desafíos más complejos.';

  // GENERACIÓN DEL INFORME AUTOMÁTICO OFICIAL DE 15 SECCIONES
  const informeOficialACM10: InformeAutomaticoACM10 = {
    seccion1_resumenGeneral: `Tu evaluación muestra una forma particular de adaptación desarrollada para responder a necesidades importantes de tu vida. Los resultados no representan una identidad fija ni una definición permanente de quién eres. Representan una fotografía de tu proceso actual y de las estrategias que has utilizado para protegerte, crecer y relacionarte con el mundo.`,
    seccion2_perfilPrincipal: {
      nombre: perfilPrincipal.nombre,
      mensaje: perfilPrincipal.mensajeInformeOficial,
      definicion: perfilPrincipal.definicionOficial,
    },
    seccion3_perfilSecundario: perfilSecundario ? {
      nombre: perfilSecundario.nombre,
      mensaje: `Además del perfil principal, se identifican elementos asociados a ${perfilSecundario.nombre}. Esto indica que parte de tus recursos y desafíos también se relacionan con esta dimensión de desarrollo.`,
    } : undefined,
    seccion4_necesidadPrioritaria: {
      nombre: perfilPrincipal.necesidadPrincipal,
      descripcion: `La necesidad que actualmente requiere mayor atención es ${perfilPrincipal.necesidadPrincipal}. Cuando esta necesidad permanece parcialmente satisfecha, pueden aparecer estrategias destinadas a compensar dicha carencia.`,
    },
    seccion5_heridaDominante: {
      nombre: perfilPrincipal.heridaOrganizadora,
      experienciaNuclear: perfilPrincipal.experienciaNuclearHerida,
      descripcion: `La herida con mayor activación actual es ${perfilPrincipal.heridaOrganizadora}. Esta herida representa una experiencia significativa que pudo influir en la forma en que aprendiste a relacionarte contigo mismo, con los demás o con la vida.`,
    },
    seccion6_mantoVerguenza: perfilPrincipal.mantoVerguenza,
    seccion7_emocionDominante: perfilPrincipal.emocionPredominante,
    seccion8_conductaAdaptativaPrincipal: perfilPrincipal.conductasAdaptativas[0] || 'Protección adaptativa',
    seccion9_iad: {
      nivel: iadNivel,
      interpretacion: iadInterpretacion,
    },
    seccion10_recursosPrincipales: {
      fuertes: perfilPrincipal.recursosNaturales.slice(0, 2),
      enDesarrollo: perfilPrincipal.recursosNaturales.slice(2),
    },
    seccion11_ipe: {
      nivel: ipeNivel,
      interpretacion: ipeInterpretacion,
    },
    seccion12_estadoEvolutivo: {
      nombre: perfilPrincipal.estadoEvolutivo,
      detalle: perfilPrincipal.estadoEvolutivoDetalle,
    },
    seccion13_rutaTerapeutica: {
      cadenaRuta: `${perfilPrincipal.necesidadPrincipal} ↓ ${perfilPrincipal.heridaOrganizadora} ↓ ${perfilPrincipal.mantoVerguenza.nivel} Vergüenza ↓ ${perfilPrincipal.emocionPredominante} ↓ ${perfilPrincipal.conductasAdaptativas[0]} ↓ ${perfilPrincipal.recursosNaturales[0]} ↓ ${perfilPrincipal.virtudEvolutiva} ↓ ${perfilPrincipal.estadoEvolutivo}`,
      secuencia: {
        necesidad: perfilPrincipal.necesidadPrincipal,
        herida: perfilPrincipal.heridaOrganizadora,
        verguenza: perfilPrincipal.mantoVerguenza.emocionOculta,
        emocion: perfilPrincipal.emocionPredominante,
        conducta: perfilPrincipal.conductasAdaptativas[0],
        recurso: perfilPrincipal.recursosNaturales[0],
        virtud: perfilPrincipal.virtudEvolutiva,
        estadoEvolutivo: perfilPrincipal.estadoEvolutivo,
      },
    },
    seccion14_recomendaciones: perfilPrincipal.recomendacionesPersonalizadas,
    seccion15_conclusion: `Los resultados obtenidos representan una fotografía de tu proceso actual. No describen todo lo que eres ni determinan tu futuro. Toda adaptación surge intentando proteger algo valioso. A medida que aumenta la conciencia, las estrategias de protección pueden transformarse en recursos para el crecimiento y la evolución.`,
    igaMetrics: {
      igaScore,
      igaLabel,
      igaColor,
      perfilGlobal,
    },
  };

  const resumenClinico = `Perfil Adaptativo Dominante: ${perfilPrincipal.nombre}
Hacia el Estado Evolutivo: ${perfilPrincipal.estadoEvolutivo} (${perfilPrincipal.estadoEvolutivoDetalle})
Índice General del Árbol (IGA): ${igaScore} / 5.0 (${igaLabel})

• Necesidad Dominante: ${perfilPrincipal.necesidadPrincipal}
• Herida Principal: ${perfilPrincipal.heridaOrganizadora} ("${perfilPrincipal.experienciaNuclearHerida}")
• Creencia Núcleo: ${perfilPrincipal.creenciaCentral}
• Manto de Vergüenza® Oculta: ${perfilPrincipal.mantoVerguenza.emocionOculta}
• Conducta Adaptativa de Protección: ${perfilPrincipal.conductasAdaptativas.join(', ')}
• Obstáculo a Trascender: ${perfilPrincipal.obstaculoPrincipal}

Pregunta Central de Reflexión:
"${perfilPrincipal.preguntaCentral}"

Objetivo Terapéutico:
${perfilPrincipal.objetivoTerapeutico}`;

  return {
    perfilPrincipal,
    perfilSecundario,
    puntajesPerfiles: profileScores,
    resumenClinico,
    informeOficialACM10,
    rutaTransformacion: {
      necesidad: perfilPrincipal.necesidadPrincipal,
      herida: perfilPrincipal.heridaOrganizadora,
      experienciaNuclear: perfilPrincipal.experienciaNuclearHerida,
      creencia: perfilPrincipal.creenciaCentral,
      mantoVerguenza: perfilPrincipal.mantoVerguenza,
      conductasAdaptativas: perfilPrincipal.conductasAdaptativas,
      emocion: perfilPrincipal.emocionPredominante,
      obstaculo: perfilPrincipal.obstaculoPrincipal,
      sintomas: perfilPrincipal.sintomasFrecuentes,
      recursos: perfilPrincipal.recursosNaturales,
      preguntaCentral: perfilPrincipal.preguntaCentral,
      objetivo: perfilPrincipal.objetivoTerapeutico,
      virtud: perfilPrincipal.virtudEvolutiva,
      estadoEvolutivo: perfilPrincipal.estadoEvolutivo,
      estadoEvolutivoDetalle: perfilPrincipal.estadoEvolutivoDetalle,
      anatomiaArbol: perfilPrincipal.anatomiaArbol,
    },
  };
}
