/**
 * CONEXIÓN LUZ® - MOTOR MAESTRO DE DIAGNÓSTICO E INFORMES AUTOMÁTICOS (MÓVIL EXPO)
 * ÁRBOL INTERIOR® (Motor ACM-1.0 / AIC-60® V2.0)
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
    badgeBg: string;
    badgeText: string;
    borderHex: string;
    bgGradient: string[];
    accentHex: string;
  };
}

export const DICCIONARIO_PERFILES: Record<string, ArbolPerfilDefinition> = {
  vigilante: {
    id: 'vigilante',
    nombre: 'EL VIGILANTE',
    definicionOficial: 'Perfil adaptativo caracterizado por una orientación constante hacia la protección, la anticipación de riesgos y la búsqueda de seguridad.',
    descripcionDetallada: 'El Vigilante ha aprendido que el mundo puede ser impredecible y que la confianza puede resultar peligrosa. Su energía está orientada a la protección y observa constantemente el entorno.',
    mensajeInformeOficial: 'Tu energía psicológica se orienta principalmente hacia la búsqueda de seguridad. Es posible que hayas desarrollado una gran capacidad para anticipar riesgos. Tu desafío consiste en transformar control en confianza.',
    necesidadPrincipal: 'Seguridad',
    heridaOrganizadora: 'Traición',
    experienciaNuclearHerida: '“No puedo confiar.”',
    creenciaCentral: '“No puedo confiar completamente / Debo mantenerme alerta para estar seguro.”',
    emocionPredominante: 'Miedo',
    mantoVerguenza: {
      nivel: 'Elevada',
      descripcionNivel: 'Una parte importante de tu adaptación parece orientada a proteger aspectos vulnerables de tu identidad ante el riesgo de traición.',
      emocionOculta: 'Miedo al daño, vulnerabilidad desprotegida.',
      necesidadVelada: 'Protección afectiva sincera y refugio seguro.',
      identidadProtegida: 'Deseo de entregarse y descansar sin estar en guardia.',
    },
    conductasAdaptativas: ['Control de variables', 'Hipervigilancia', 'Evitación de vulnerabilidad'],
    obstaculoPrincipal: 'Control excesivo',
    sintomasFrecuentes: ['Ansiedad', 'Hipervigilancia', 'Exceso de control', 'Desconfianza'],
    recursosNaturales: ['Observación', 'Prudencia', 'Responsabilidad', 'Anticipación'],
    riesgos: ['Rigidez', 'Aislamiento', 'Agotamiento psicológico'],
    objetivoTerapeutico: 'Desarrollar seguridad interna independiente del control externo.',
    preguntaCentral: '¿Qué estás intentando proteger?',
    virtudEvolutiva: 'Confianza',
    estadoEvolutivo: 'EL CONFIADO',
    estadoEvolutivoDetalle: 'Aprende a confiar sin perder discernimiento.',
    indicadoresIntegracion: ['Confianza realista', 'Regulación emocional', 'Capacidad de delegar'],
    recomendacionesPersonalizadas: [
      'Desarrollar prácticas graduales de confianza y delegación consciente.',
      'Identificar desencadenantes de hipervigilancia en entornos seguros.',
      'Aprender técnicas de regulación del sistema nervioso.',
    ],
    serviciosRecomendados: [
      {
        titulo: 'Relajación & Mindfulness',
        descripcion: 'Audios guiados para calmar la hipervigilancia.',
        icono: '🧘',
        ruta: '/(tabs)/explore',
        badge: 'Regulación del Miedo',
      },
      {
        titulo: 'Diario Emocional',
        descripcion: 'Registro de seguridad interior y desahogo.',
        icono: '📓',
        ruta: '/(tabs)/explore',
        badge: 'Desahogo de Control',
      },
      {
        titulo: 'Ejercicios Guiados',
        descripcion: 'Prácticas clínicas para cultivar Confianza.',
        icono: '🏋️',
        ruta: '/(tabs)/explore',
        badge: 'Confianza Interior',
      },
    ],
    anatomiaArbol: {
      tierra: 'Experiencias de impredecibilidad relacional.',
      raices: 'Necesidad de Seguridad y Herida de Traición.',
      savia: 'Miedo retenido y Manto de Vergüenza® ante la vulnerabilidad.',
      tronco: 'Creencia: “Debo vigilar para no ser vulnerado”.',
      ramas: 'Hipervigilancia, control, reserva emocional.',
      frutos: 'Sensación de aislamiento y tensión.',
      luz: 'Desarrollo de Confianza auténtica.',
    },
    colorTheme: {
      badgeBg: '#FEF3C7',
      badgeText: '#78350F',
      borderHex: '#F59E0B',
      bgGradient: ['#FFFBEB', '#FEF3C7'],
      accentHex: '#D97706',
    },
  },

  caminante_vacio: {
    id: 'caminante_vacio',
    nombre: 'EL CAMINANTE VACÍO',
    definicionOficial: 'Perfil adaptativo caracterizado por avanzar sintiendo que algo esencial falta, experimentando soledad interna.',
    descripcionDetallada: 'El Caminante Vacío continúa avanzando, pero siente que algo esencial falta. Experimenta soledad interna incluso acompañado.',
    mensajeInformeOficial: 'Tu adaptación parece estar influida por la búsqueda de significado y propósito. Tu desafío consiste en transformar vacío en sentido.',
    necesidadPrincipal: 'Sentido y Pertenencia',
    heridaOrganizadora: 'Abandono',
    experienciaNuclearHerida: '“Estoy solo / Algo importante falta en mi vida.”',
    creenciaCentral: '“Estoy solo / Algo fundamental falta dentro de mí.”',
    emocionPredominante: 'Tristeza y Vacío Existencial',
    mantoVerguenza: {
      nivel: 'Moderada',
      descripcionNivel: 'Ocultas la necesidad de afecto para evitar mostrar vulnerabilidad o rechazo.',
      emocionOculta: 'Tristeza por separación, añoranza de afecto.',
      necesidadVelada: 'Vínculo incondicional y significado.',
      identidadProtegida: 'Anhelo de pertenecer con propósito propio.',
    },
    conductasAdaptativas: ['Dependencia emocional', 'Autosacrificio', 'Búsqueda externa'],
    obstaculoPrincipal: 'Dependencia emocional / Desmotivación',
    sintomasFrecuentes: ['Apatía', 'Desmotivación', 'Soledad interna'],
    recursosNaturales: ['Introspección', 'Sensibilidad', 'Reflexión profunda'],
    riesgos: ['Estancamiento', 'Desconexión emocional'],
    objetivoTerapeutico: 'Reconstruir sentido, autoacompañamiento y propósito vital.',
    preguntaCentral: '¿Qué necesitas darte a ti mismo?',
    virtudEvolutiva: 'Autonomía emocional y Propósito',
    estadoEvolutivo: 'EL CREADOR DE SENTIDO',
    estadoEvolutivoDetalle: 'Desarrolla vínculos desde la plenitud y no desde la carencia.',
    indicadoresIntegracion: ['Claridad existencial', 'Relaciones profundas', 'Motivación intrínseca'],
    recomendacionesPersonalizadas: [
      'Explorar actividades diarias con significado propio e intención.',
      'Cultivar el autoacompañamiento compasivo.',
      'Construir relaciones basadas en la reciprocidad.',
    ],
    serviciosRecomendados: [
      {
        titulo: 'Diario Emocional',
        descripcion: 'Diario introspectivo para reconstruir significado.',
        icono: '📓',
        ruta: '/(tabs)/explore',
        badge: 'Autoacompañamiento',
      },
      {
        titulo: 'Relajación & Mindfulness',
        descripcion: 'Meditación para abrazar la soledad en plenitud.',
        icono: '🧘',
        ruta: '/(tabs)/explore',
        badge: 'Calma Existencial',
      },
      {
        titulo: 'Ejercicios Guiados',
        descripcion: 'Prácticas para reconstruir tu propósito.',
        icono: '🏋️',
        ruta: '/(tabs)/explore',
        badge: 'Sentido & Propósito',
      },
    ],
    anatomiaArbol: {
      tierra: 'Vivencias de separación o distancia afectiva.',
      raices: 'Necesidad de Pertenencia/Sentido y Herida de Abandono.',
      savia: 'Tristeza latente y Manto de Vergüenza®.',
      tronco: 'Creencia: “Tengo que buscar afuera mi propio calor”.',
      ramas: 'Aferramiento a vínculos, melancolía.',
      frutos: 'Sensación de vacío o fatiga relacional.',
      luz: 'Plenitud interior y autonomía afectiva.',
    },
    colorTheme: {
      badgeBg: '#CCFBF1',
      badgeText: '#134E4A',
      borderHex: '#14B8A6',
      bgGradient: ['#F0FDFA', '#CCFBF1'],
      accentHex: '#0D9488',
    },
  },

  guerrero_agotado: {
    id: 'guerrero_agotado',
    nombre: 'EL GUERRERO AGOTADO',
    definicionOficial: 'Perfil adaptativo caracterizado por haber construido su valor a través del esfuerzo constante para demostrar su valía.',
    descripcionDetallada: 'El Guerrero Agotado ha construido su valor a través del esfuerzo. Lucha para demostrar su valía, ocultando cansancio.',
    mensajeInformeOficial: 'Tu adaptación se organiza alrededor del rendimiento y la responsabilidad. Tu desafío consiste en transformar autoexigencia en autovaloración.',
    necesidadPrincipal: 'Reconocimiento',
    heridaOrganizadora: 'Humillación / Desvalorización',
    experienciaNuclearHerida: '“Hay algo malo en mí / No soy suficiente.”',
    creenciaCentral: '“Debo demostrar mi valor a través del rendimiento continuo.”',
    emocionPredominante: 'Vergüenza transformada en esfuerzo',
    mantoVerguenza: {
      nivel: 'Organizadora',
      descripcionNivel: 'La vergüenza impulsa tu rendimiento para ocultar temores de insuficiencia.',
      emocionOculta: 'Sensación de insuficiencia, temor a la falla.',
      necesidadVelada: 'Valoración intrínseca sin necesidad de demostrar.',
      identidadProtegida: 'Deseo de ser amado por ser, no por hacer.',
    },
    conductasAdaptativas: ['Autoexigencia', 'Perfeccionismo', 'Sobreesfuerzo'],
    obstaculoPrincipal: 'Perfeccionismo y sobreesfuerzo',
    sintomasFrecuentes: ['Autoexigencia', 'Agotamiento', 'Dependencia del logro'],
    recursosNaturales: ['Disciplina', 'Compromiso', 'Perseverancia'],
    riesgos: ['Burnout', 'Desconexión emocional'],
    objetivoTerapeutico: 'Reconocer valor personal independiente del rendimiento y descansar.',
    preguntaCentral: '¿Qué estás intentando demostrar?',
    virtudEvolutiva: 'Autoaceptación y Autovaloración',
    estadoEvolutivo: 'EL EQUILIBRADO',
    estadoEvolutivoDetalle: 'Aprende a valorar el ser por encima del hacer.',
    indicadoresIntegracion: ['Autoestima estable', 'Descanso saludable', 'Equilibrio personal'],
    recomendacionesPersonalizadas: [
      'Separar el valor personal único del rendimiento externo.',
      'Establecer límites claros al trabajo y priorizar descanso.',
      'Practicar la autocompasión frente a las imperfecciones.',
    ],
    serviciosRecomendados: [
      {
        titulo: 'Relajación & Mindfulness',
        descripcion: 'Descompresión profunda para soltar la autoexigencia.',
        icono: '🧘',
        ruta: '/(tabs)/explore',
        badge: 'Descanso Reparador',
      },
      {
        titulo: 'Ejercicios Guiados',
        descripcion: 'Autovaloración independiente del logro.',
        icono: '🏋️',
        ruta: '/(tabs)/explore',
        badge: 'Autovaloración',
      },
      {
        titulo: 'Mi Progreso',
        descripcion: 'Seguimiento de bienestar libre de metas rígidas.',
        icono: '📊',
        ruta: '/(tabs)/explore',
        badge: 'Equilibrio',
      },
    ],
    anatomiaArbol: {
      tierra: 'Entornos de exigencia condicionada o desvalorización.',
      raices: 'Necesidad de Reconocimiento y Herida de Humillación.',
      savia: 'Vergüenza de imperfección retenida.',
      tronco: 'Creencia: “Valgo únicamente si produzco o destaco”.',
      ramas: 'Hiperactividad, sobreesfuerzo.',
      frutos: 'Burnout, agotamiento severo.',
      luz: 'Autovaloración intrínseca y descanso merecido.',
    },
    colorTheme: {
      badgeBg: '#FFE4E6',
      badgeText: '#881337',
      borderHex: '#F43F5E',
      bgGradient: ['#FFF1F2', '#FFE4E6'],
      accentHex: '#E11D48',
    },
  },

  prisionero_invisible: {
    id: 'prisionero_invisible',
    nombre: 'EL PRISIONERO INVISIBLE',
    definicionOficial: 'Perfil adaptativo caracterizado por vivir dentro de límites construidos por exigencias internas y temor al error.',
    descripcionDetallada: 'El Prisionero Invisible vive dentro de una estructura mental basada en rigidez y temor al juicio, error o rechazo.',
    mensajeInformeOficial: 'Tu adaptación protege la pertenencia ocultando aspectos de ti mismo. Tu desafío consiste en transformar ocultamiento en autenticidad.',
    necesidadPrincipal: 'Pertenencia y Coherencia',
    heridaOrganizadora: 'Rechazo e Injusticia',
    experienciaNuclearHerida: '“No soy aceptado si me expongo.”',
    creenciaCentral: '“Si me muestro como realmente soy o cometo errores, seré rechazado.”',
    emocionPredominante: 'Vergüenza y Frustración',
    mantoVerguenza: {
      nivel: 'Organizadora',
      descripcionNivel: 'El Manto de Vergüenza® regula tus decisiones para evitar posibilidad de juicio.',
      emocionOculta: 'Miedo al juicio social, temor al ridículo.',
      necesidadVelada: 'Aceptación incondicional de la autenticidad.',
      identidadProtegida: 'Libertad de expresión y deseos genuinos.',
    },
    conductasAdaptativas: ['Complacencia', 'Invisibilidad', 'Autoocultamiento'],
    obstaculoPrincipal: 'Rigidez y Autoocultamiento',
    sintomasFrecuentes: ['Inhibición', 'Aislamiento emocional', 'Miedo a exponerse'],
    recursosNaturales: ['Empatía', 'Sensibilidad', 'Observación social'],
    riesgos: ['Autoanulación', 'Dependencia de aprobación'],
    objetivoTerapeutico: 'Desarrollar Autenticidad Segura y expresión libre.',
    preguntaCentral: '¿Qué ocurriría si avanzaras sin perfección?',
    virtudEvolutiva: 'Autoaceptación y Flexibilidad',
    estadoEvolutivo: 'EL CREADOR AUTÉNTICO',
    estadoEvolutivoDetalle: 'Utiliza la expresión auténtica como parte del crecimiento.',
    indicadoresIntegracion: ['Expresión auténtica', 'Relaciones profundas', 'Flexibilidad'],
    recomendacionesPersonalizadas: [
      'Practicar la expresión auténtica en entornos seguros.',
      'Cuestionar las reglas rígidas sobre lo que se debe mostrar.',
      'Integrar el margen de error como derecho natural.',
    ],
    serviciosRecomendados: [
      {
        titulo: 'Diario Emocional',
        descripcion: 'Espacio privado para expresar tu verdad libremente.',
        icono: '📓',
        ruta: '/(tabs)/explore',
        badge: 'Expresión Auténtica',
      },
      {
        titulo: 'Ejercicios Guiados',
        descripcion: 'Prácticas para soltar el miedo al juicio.',
        icono: '🏋️',
        ruta: '/(tabs)/explore',
        badge: 'Autenticidad Segura',
      },
      {
        titulo: 'Relajación & Mindfulness',
        descripcion: 'Liberación del perfeccionismo y la rigidez.',
        icono: '🧘',
        ruta: '/(tabs)/explore',
        badge: 'Flexibilidad Mental',
      },
    ],
    anatomiaArbol: {
      tierra: 'Experiencias de crítica temprana.',
      raices: 'Necesidad de Pertenencia y Herida de Rechazo/Injusticia.',
      savia: 'Manto de Vergüenza® bloqueando la expresión.',
      tronco: 'Creencia: “Ocultar mi verdad me mantiene a salvo”.',
      ramas: 'Invisibilidad, filtro defensivo.',
      frutos: 'Sensación de estar atrapado o autoanulación.',
      luz: 'Autenticidad radiante y libertad creativa.',
    },
    colorTheme: {
      badgeBg: '#F3E8FF',
      badgeText: '#581C87',
      borderHex: '#A855F7',
      bgGradient: ['#FAF5FF', '#F3E8FF'],
      accentHex: '#9333EA',
    },
  },

  explorador_interior: {
    id: 'explorador_interior',
    nombre: 'EL EXPLORADOR INTERIOR',
    definicionOficial: 'Perfil adaptativo caracterizado por una búsqueda constante de significado e investigación profunda.',
    descripcionDetallada: 'El Explorador Interior busca significado e investiga su historia, pero corre el riesgo de quedarse en la teoría sin transformar.',
    mensajeInformeOficial: 'Tu adaptación se orienta al análisis y la comprensión. Tu desafío consiste en transformar intelectualización en experiencia viva.',
    necesidadPrincipal: 'Coherencia y Sentido',
    heridaOrganizadora: 'Desconexión Existencial',
    experienciaNuclearHerida: '“Necesito entender para estar en paz.”',
    creenciaCentral: '“Necesito comprender racionalmente para no sentir dolor.”',
    emocionPredominante: 'Curiosidad y Racionalización',
    mantoVerguenza: {
      nivel: 'Moderada',
      descripcionNivel: 'Utilizas el análisis teórico como capa protectora para distanciarte de emociones abrumadoras.',
      emocionOculta: 'Vulnerabilidad no analizada, confusión.',
      necesidadVelada: 'Sentir sin juzgar y experimentar paz viva.',
      identidadProtegida: 'Conexión espiritual y vivencial del corazón.',
    },
    conductasAdaptativas: ['Intelectualización', 'Sobreanálisis', 'Evitación vivencial'],
    obstaculoPrincipal: 'Intelectualización (Parálisis por análisis)',
    sintomasFrecuentes: ['Sobreanálisis', 'Intelectualización', 'Indecisión'],
    recursosNaturales: ['Pensamiento analítico', 'Aprendizaje', 'Reflexión'],
    riesgos: ['Parálisis por análisis', 'Distanciamiento emocional'],
    objetivoTerapeutico: 'Transformar comprensión teórica en experiencia viva.',
    preguntaCentral: '¿Qué comprensión necesita convertirse en experiencia?',
    virtudEvolutiva: 'Integración y Flexibilidad',
    estadoEvolutivo: 'EL SABIO INTEGRADO',
    estadoEvolutivoDetalle: 'Integra conocimiento, experiencia viva y conciencia.',
    indicadoresIntegracion: ['Acción consciente', 'Flexibilidad cognitiva', 'Equilibrio'],
    recomendacionesPersonalizadas: [
      'Equilibrar el análisis teórico con experiencias corporales vivas.',
      'Pasar de la comprensión al experimento práctico.',
      'Aprender a habitar el no-saber con serenidad.',
    ],
    serviciosRecomendados: [
      {
        titulo: 'Ejercicios Guiados',
        descripcion: 'Paso de la teoría a la acción práctica consciente.',
        icono: '🏋️',
        ruta: '/(tabs)/explore',
        badge: 'Acción Consciente',
      },
      {
        titulo: 'Relajación & Mindfulness',
        descripcion: 'Mindfulness corporal para habitar la mente en calma.',
        icono: '🧘',
        ruta: '/(tabs)/explore',
        badge: 'Conexión Corporal',
      },
      {
        titulo: 'Diario Emocional',
        descripcion: 'Sincronización entre comprender y sentir.',
        icono: '📓',
        ruta: '/(tabs)/explore',
        badge: 'Integración Vivencial',
      },
    ],
    anatomiaArbol: {
      tierra: 'Momentos donde sentir resultaba confuso.',
      raices: 'Necesidad de Coherencia y Herida de Desconexión.',
      savia: 'Curiosidad sustituyendo emociones no procesadas.',
      tronco: 'Creencia: “Entender el mapa equivale a recorrer el camino”.',
      ramas: 'Lectura incesante, teorías personales.',
      frutos: 'Saber mucho pero sentir o cambiar poco.',
      luz: 'Sabiduría encarnada y fluidez vital.',
    },
    colorTheme: {
      badgeBg: '#DBEAFE',
      badgeText: '#1E40AF',
      borderHex: '#3B82F6',
      bgGradient: ['#EFF6FF', '#DBEAFE'],
      accentHex: '#2563EB',
    },
  },

  navegante: {
    id: 'navegante',
    nombre: 'EL NAVEGANTE',
    definicionOficial: 'Perfil adaptativo caracterizado por avanzar conscientemente aun en medio de la incertidumbre.',
    descripcionDetallada: 'El Navegante posee iniciativa y adaptabilidad para explorar rumbos, relacionándose con sus heridas de forma nueva.',
    mensajeInformeOficial: 'Tu adaptación se relaciona con la búsqueda de dirección y claridad. Tu desafío consiste en transformar incertidumbre en compromiso sostenido.',
    necesidadPrincipal: 'Dirección y Autonomía',
    heridaOrganizadora: 'Desorientación',
    experienciaNuclearHerida: '“No sé hacia dónde ir / Me cuesta sostener la ruta.”',
    creenciaCentral: '“Debo seguir moviéndome para no quedar estancado.”',
    emocionPredominante: 'Incertidumbre',
    mantoVerguenza: {
      nivel: 'Baja',
      descripcionNivel: 'El desafío radica en enfocar la energía dispersa en objetivos claros.',
      emocionOculta: 'Miedo al fracaso de destino.',
      necesidadVelada: 'Certeza interior y propósito firme.',
      identidadProtegida: 'Liderazgo de la propia vida con compromiso.',
    },
    conductasAdaptativas: ['Cambios de rumbo', 'Dispersión', 'Postergación'],
    obstaculoPrincipal: 'Pasividad o Dispersión',
    sintomasFrecuentes: ['Dispersión', 'Postergación', 'Falta de enfoque'],
    recursosNaturales: ['Iniciativa', 'Adaptabilidad', 'Visión de futuro'],
    riesgos: ['Inconstancia', 'Superficialidad'],
    objetivoTerapeutico: 'Desarrollar dirección interna, foco y compromiso sostenido.',
    preguntaCentral: '¿Cuál es el siguiente paso que ya conoces?',
    virtudEvolutiva: 'Acción Consciente y Compromiso',
    estadoEvolutivo: 'EL GUÍA',
    estadoEvolutivoDetalle: 'Ayuda a otros a encontrar dirección mientras continúa la propia.',
    indicadoresIntegracion: ['Objetivos claros', 'Persistencia', 'Decisión consistente'],
    recomendacionesPersonalizadas: [
      'Construir objetivos concretos y sostenibles.',
      'Practicar el enfoque unidireccional.',
      'Sostener las decisiones con disciplina consciente.',
    ],
    serviciosRecomendados: [
      {
        titulo: 'Ejercicios Guiados',
        descripcion: 'Plan de acción para definir dirección y metas.',
        icono: '🏋️',
        ruta: '/(tabs)/explore',
        badge: 'Dirección Interna',
      },
      {
        titulo: 'Mi Progreso',
        descripcion: 'Tablero de avance sostenido para constancia.',
        icono: '📊',
        ruta: '/(tabs)/explore',
        badge: 'Foco & Persistencia',
      },
      {
        titulo: 'Diario Emocional',
        descripcion: 'Clarificación de metas y superación de la postergación.',
        icono: '📓',
        ruta: '/(tabs)/explore',
        badge: 'Compromiso Consciente',
      },
    ],
    anatomiaArbol: {
      tierra: 'Momentos de giros vitales inesperados.',
      raices: 'Necesidad de Dirección y Herida de Desorientación.',
      savia: 'Incertidumbre buscando canalización.',
      tronco: 'Creencia: “El movimiento constante compensa la duda”.',
      ramas: 'Exploración de múltiples opciones.',
      frutos: 'Rumbos intermitentes.',
      luz: 'Maestría de rumbo y liderazgo guía.',
    },
    colorTheme: {
      badgeBg: '#CFFAFE',
      badgeText: '#155E75',
      borderHex: '#06B6D4',
      bgGradient: ['#ECFEFF', '#CFFAFE'],
      accentHex: '#0891B2',
    },
  },
};

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
  };
  seccion14_recomendaciones: string[];
  seccion15_conclusion: string;
  igaMetrics: {
    igaScore: number;
    igaLabel: string;
    igaColorHex: string;
    perfilGlobal: string;
  };
}

export interface DiagnosticResultEngine {
  perfilPrincipal: ArbolPerfilDefinition;
  perfilSecundario?: ArbolPerfilDefinition;
  resumenClinico: string;
  informeOficialACM10: InformeAutomaticoACM10;
  rutaTransformacion: ArbolPerfilDefinition;
}

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

  const optionMap: Record<string, keyof typeof DICCIONARIO_PERFILES> = {
    opt_stress: 'vigilante',
    opt_mood: 'caminante_vacio',
    opt_sleep: 'guerrero_agotado',
    opt_coherencia: 'prisionero_invisible',
    opt_growth: 'explorador_interior',
    opt_direccion: 'navegante',
    opt_s_mental: 'vigilante',
    opt_s_somatic: 'guerrero_agotado',
    opt_m_apathy: 'caminante_vacio',
    opt_m_grief: 'caminante_vacio',
    opt_m_burnout: 'guerrero_agotado',
    opt_sl_fatigue: 'guerrero_agotado',
    opt_s_emotional: 'prisionero_invisible',
    opt_sl_init: 'prisionero_invisible',
    opt_g_calm: 'explorador_interior',
    opt_g_journal: 'explorador_interior',
    opt_sl_interr: 'navegante',
    opt_g_guidance: 'navegante',
    opt_f_mild: 'explorador_interior',
    opt_f_mod: 'caminante_vacio',
    opt_f_high: 'vigilante',
    opt_c_step1: 'vigilante',
    opt_c_guided: 'guerrero_agotado',
    opt_c_full: 'prisionero_invisible',
    opt_ca_control: 'vigilante',
    opt_ca_complacencia: 'prisionero_invisible',
    opt_ca_autoexigencia: 'guerrero_agotado',
  };

  historyPath.forEach((item, index) => {
    const pKey = optionMap[item.optionId];
    if (pKey) {
      const weight = index === 0 ? 35 : index === 1 ? 30 : index === 2 ? 20 : 15;
      profileScores[pKey] = (profileScores[pKey] || 0) + weight;
    }
  });

  if (scores.stress > 60) profileScores.vigilante += 20;
  if (scores.energy < 30) profileScores.guerrero_agotado += 20;
  if (scores.mood < 30) profileScores.caminante_vacio += 20;
  if (scores.focus > 50) profileScores.explorador_interior += 15;

  const sortedProfiles = Object.entries(profileScores).sort((a, b) => b[1] - a[1]);
  const topKey = sortedProfiles[0][0] || 'vigilante';
  const secondKey = sortedProfiles[1][1] > 20 ? sortedProfiles[1][0] : undefined;

  const perfilPrincipal = DICCIONARIO_PERFILES[topKey] || DICCIONARIO_PERFILES.vigilante;
  const perfilSecundario = secondKey ? DICCIONARIO_PERFILES[secondKey] : undefined;

  const tierraScore = Math.min(5, Math.max(1, (100 - scores.stress) / 20));
  const troncoScore = Math.min(5, Math.max(1, scores.focus / 20));
  const ramasScore = Math.min(5, Math.max(1, (100 - scores.stress * 0.7) / 20));
  const hojasScore = Math.min(5, Math.max(1, scores.energy / 20));
  const frutosScore = Math.min(5, Math.max(1, scores.mood / 20));
  const luzScore = Math.min(5, Math.max(1, (scores.focus * 0.5 + scores.mood * 0.5) / 20));

  const igaScore = parseFloat(((tierraScore + troncoScore + ramasScore + hojasScore + frutosScore + luzScore) / 6).toFixed(1));

  let igaLabel = 'Árbol Funcional';
  let igaColorHex = '#F59E0B';
  let perfilGlobal = 'Árbol Adaptativo';

  if (igaScore >= 4.5) {
    igaLabel = 'Árbol Altamente Integrado';
    igaColorHex = '#10B981';
    perfilGlobal = 'Árbol en Crecimiento';
  } else if (igaScore >= 4.0) {
    igaLabel = 'Árbol Saludable';
    igaColorHex = '#14B8A6';
    perfilGlobal = 'Árbol en Transformación';
  } else if (igaScore >= 3.0) {
    igaLabel = 'Árbol Funcional';
    igaColorHex = '#F59E0B';
    perfilGlobal = 'Árbol Adaptativo';
  } else if (igaScore >= 2.0) {
    igaLabel = 'Árbol Vulnerable';
    igaColorHex = '#F97316';
    perfilGlobal = 'Árbol Vulnerable';
  } else {
    igaLabel = 'Árbol en Riesgo';
    igaColorHex = '#E11D48';
    perfilGlobal = 'Árbol Herido';
  }

  const iadNivel: 'Bajo' | 'Moderado' | 'Alto' = scores.stress > 60 ? 'Alto' : scores.stress > 35 ? 'Moderado' : 'Bajo';
  const iadInterpretacion = iadNivel === 'Bajo'
    ? 'La adaptación actual es relativamente flexible y receptiva.'
    : iadNivel === 'Moderado'
    ? 'Existen mecanismos de protección activos en determinadas áreas.'
    : 'La adaptación actual está fuertemente orientada hacia la protección defensiva.';

  const ipeNivel: 'Alto' | 'Medio' | 'Bajo' = (scores.energy > 50 && scores.mood > 40) ? 'Alto' : scores.energy > 30 ? 'Medio' : 'Bajo';
  const ipeInterpretacion = ipeNivel === 'Alto'
    ? 'Posees recursos importantes para facilitar procesos de transformación.'
    : ipeNivel === 'Medio'
    ? 'Existen capacidades disponibles que pueden fortalecerse de forma gradual.'
    : 'Es beneficioso comenzar fortaleciendo recursos antes de abordar desafíos mayores.';

  const informeOficialACM10: InformeAutomaticoACM10 = {
    seccion1_resumenGeneral: `Tu evaluación muestra una forma particular de adaptación para responder a necesidades de tu vida. Los resultados representan una fotografía de tu proceso actual y de las estrategias para protegerte y crecer.`,
    seccion2_perfilPrincipal: {
      nombre: perfilPrincipal.nombre,
      mensaje: perfilPrincipal.mensajeInformeOficial,
      definicion: perfilPrincipal.definicionOficial,
    },
    seccion3_perfilSecundario: perfilSecundario ? {
      nombre: perfilSecundario.nombre,
      mensaje: `Además del perfil principal, se identifican elementos de ${perfilSecundario.nombre}.`,
    } : undefined,
    seccion4_necesidadPrioritaria: {
      nombre: perfilPrincipal.necesidadPrincipal,
      descripcion: `La necesidad que requiere atención prioritaria es ${perfilPrincipal.necesidadPrincipal}.`,
    },
    seccion5_heridaDominante: {
      nombre: perfilPrincipal.heridaOrganizadora,
      experienciaNuclear: perfilPrincipal.experienciaNuclearHerida,
      descripcion: `La herida con mayor activación es ${perfilPrincipal.heridaOrganizadora}.`,
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
      cadenaRuta: `${perfilPrincipal.necesidadPrincipal} ↓ ${perfilPrincipal.heridaOrganizadora} ↓ ${perfilPrincipal.mantoVerguenza.nivel} Vergüenza ↓ ${perfilPrincipal.emocionPredominante} ↓ ${perfilPrincipal.virtudEvolutiva} ↓ ${perfilPrincipal.estadoEvolutivo}`,
    },
    seccion14_recomendaciones: perfilPrincipal.recomendacionesPersonalizadas,
    seccion15_conclusion: `Toda adaptación surge intentando proteger algo valioso. A medida que aumenta la conciencia, las estrategias se transforman en recursos para el crecimiento.`,
    igaMetrics: {
      igaScore,
      igaLabel,
      igaColorHex,
      perfilGlobal,
    },
  };

  const resumenClinico = `Perfil Dominante: ${perfilPrincipal.nombre}
Hacia el Estado Evolutivo: ${perfilPrincipal.estadoEvolutivo} (${perfilPrincipal.estadoEvolutivoDetalle})
Índice General del Árbol (IGA): ${igaScore} / 5.0 (${igaLabel})

• Necesidad Dominante: ${perfilPrincipal.necesidadPrincipal}
• Herida Principal: ${perfilPrincipal.heridaOrganizadora} ("${perfilPrincipal.experienciaNuclearHerida}")
• Creencia Núcleo: ${perfilPrincipal.creenciaCentral}
• Manto de Vergüenza®: ${perfilPrincipal.mantoVerguenza.emocionOculta}

Pregunta Central:
"${perfilPrincipal.preguntaCentral}"`;

  return {
    perfilPrincipal,
    perfilSecundario,
    resumenClinico,
    informeOficialACM10,
    rutaTransformacion: perfilPrincipal,
  };
}
