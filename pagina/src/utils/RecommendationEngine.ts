import questionnairesData from '../data/questionnairesData.json';
import { WISDOM_QUOTES, getQuoteForEvaluation, WisdomQuote } from '../data/quotesData';

export interface ExerciseItem {
  title: string;
  category: string;
  duration: string;
  icon: string;
  description: string;
  steps: string[];
}

export interface EvaluationResult {
  testId: string;
  testName: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  label: string;
  levelKey: string;
  color: string;
  badgeBg: string;
  interpretation: string;
  recommendations: string[];
  exercises: ExerciseItem[];
  hopeMessage: {
    title: string;
    text: string;
    quote?: string;
    author?: string;
  };
  cta: {
    title: string;
    text: string;
    primaryButton: string;
    secondaryButton: string;
    trustBadges: string[];
  };
  finalMessage: string;
}

export function getEvaluationResult(
  testId: string,
  totalScore: number,
  maxScore: number
): EvaluationResult {
  const normalizedId = testId.toLowerCase();
  
  // Default scale fallback
  let scaleConfig = questionnairesData.scales.ansiedad;
  let category: 'ansiedad' | 'desanimo' | 'autoestima' | 'bienestar' = 'ansiedad';
  
  if (normalizedId.includes('ansiedad') || normalizedId === 'gad-7') {
    scaleConfig = questionnairesData.scales.ansiedad;
    category = 'ansiedad';
  } else if (
    normalizedId.includes('animo') ||
    normalizedId.includes('estado-animo') ||
    normalizedId.includes('phq-9') ||
    normalizedId.includes('depresi')
  ) {
    scaleConfig = questionnairesData.scales['estado-animo'];
    category = 'desanimo';
  } else if (
    normalizedId.includes('bienestar') ||
    normalizedId.includes('who-5')
  ) {
    scaleConfig = questionnairesData.scales.bienestar;
    category = 'bienestar';
  } else if (
    normalizedId.includes('autoestima') ||
    normalizedId.includes('rosenberg')
  ) {
    scaleConfig = questionnairesData.scales.autoestima;
    category = 'autoestima';
  }

  // Find matching level based on score
  const matchedLevel =
    scaleConfig.levels.find(
      (lvl) => totalScore >= lvl.minScore && totalScore <= lvl.maxScore
    ) || scaleConfig.levels[scaleConfig.levels.length - 1];

  const percentage = Math.round((totalScore / Math.max(maxScore, 1)) * 100);

  // Dynamic Quote selection from 160+ Wisdom Quotes Library
  const quoteFromLibrary = getQuoteForEvaluation(category, (matchedLevel.levelKey as any) || 'leve');

  const hopeMessage = {
    quote: (matchedLevel as any).hopeMessage?.quote || quoteFromLibrary.quote,
    author: (matchedLevel as any).hopeMessage?.author || quoteFromLibrary.author,
    title: (matchedLevel as any).hopeMessage?.title || quoteFromLibrary.title,
    text: (matchedLevel as any).hopeMessage?.text || quoteFromLibrary.explanation,
  };

  return {
    testId,
    testName: scaleConfig.name,
    totalScore,
    maxScore,
    percentage,
    label: matchedLevel.label,
    levelKey: matchedLevel.levelKey,
    color: matchedLevel.color,
    badgeBg: matchedLevel.badgeBg,
    interpretation: matchedLevel.interpretation,
    recommendations: matchedLevel.recommendations,
    exercises: (matchedLevel as any).exercises || (scaleConfig as any).exercises || [],
    hopeMessage,
    cta: questionnairesData.cta,
    finalMessage: questionnairesData.finalMessage,
  };
}

export function getRandomMotivationalMessage(): string {
  const messages = questionnairesData.motivationalMessages;
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

export function getWarmIntroData() {
  return questionnairesData.warmIntro;
}

export function syncTestResultWithAWE(result: EvaluationResult) {
  const id = result.testId.toLowerCase();
  let psychProfile = 'Buscador de Sentido';
  let emotions: string[] = [];
  let riskLevel = 'leve';
  let escuela = 'stoicism';

  let category: 'ansiedad' | 'desanimo' | 'autoestima' | 'bienestar' = 'ansiedad';

  if (id.includes('ansiedad') || id.includes('gad-7')) {
    category = 'ansiedad';
    escuela = result.percentage >= 50 ? 'tcc' : 'stoicism';
    if (result.percentage >= 50) {
      psychProfile = 'Guerrero Agotado';
      emotions = ['ansiedad', 'agotamiento'];
      riskLevel = result.percentage >= 75 ? 'alto' : 'moderado';
    } else {
      psychProfile = 'Mente Analítica';
      emotions = ['ansiedad', 'serenidad'];
      riskLevel = 'leve';
    }
  } else if (id.includes('animo') || id.includes('depresi') || id.includes('phq-9')) {
    category = 'desanimo';
    escuela = 'logoterapia';
    if (result.percentage >= 50) {
      psychProfile = 'Guerrero Agotado';
      emotions = ['tristeza', 'soledad'];
      riskLevel = result.percentage >= 75 ? 'alto' : 'moderado';
    } else {
      psychProfile = 'Buscador de Sentido';
      emotions = ['esperanza', 'serenidad'];
      riskLevel = 'leve';
    }
  } else if (id.includes('bienestar') || id.includes('who-5')) {
    category = 'bienestar';
    escuela = 'positiva';
    if (result.percentage < 50) {
      psychProfile = 'Guerrero Agotado';
      emotions = ['agotamiento', 'confusión'];
      riskLevel = 'moderado';
    } else {
      psychProfile = 'Corazón Abierto';
      emotions = ['gratitud', 'serenidad'];
      riskLevel = 'leve';
    }
  } else if (id.includes('autoestima') || id.includes('rosenberg')) {
    category = 'autoestima';
    escuela = 'humanismo';
    if (result.percentage < 50) {
      psychProfile = 'Vigilante';
      emotions = ['vergüenza', 'culpa'];
      riskLevel = 'moderado';
    } else {
      psychProfile = 'Corazón Abierto';
      emotions = ['gratitud', 'esperanza'];
      riskLevel = 'leve';
    }
  } else {
    if (result.percentage >= 50) {
      emotions = ['ansiedad', 'agotamiento'];
      riskLevel = 'moderado';
    } else {
      emotions = ['gratitud', 'serenidad'];
      riskLevel = 'leve';
    }
  }

  const profileData = {
    psych_profile: psychProfile,
    current_emotions: emotions,
    risk_level: riskLevel,
    preferred_moment: 'cualquiera',
  };

  // Derive customized practice and reflection based on test and symptom level
  const firstExercise = result.exercises?.[0];
  const actionStep = firstExercise 
    ? `${firstExercise.title}: ${firstExercise.description}`
    : (result.recommendations?.[0] || 'Dedica 5 minutos a respirar conscientemente y soltar la tensión corporal.');

  let reflectionQuestion = '¿Qué pequeño paso compasivo de autocuidado puedes regalarte hoy?';
  if (id.includes('ansiedad')) {
    reflectionQuestion = '¿Qué preocupación o pensamiento acelerado puedes pausar hoy para dar espacio a tu paz interior?';
  } else if (id.includes('animo') || id.includes('depresi')) {
    reflectionQuestion = '¿Qué aprendizaje o regalo valioso está tratando de mostrarte esta etapa de tu vida?';
  } else if (id.includes('bienestar')) {
    reflectionQuestion = '¿Qué momento sencillo de tu rutina cotidiana te genera gratitud cuando lo vives con presencia?';
  } else if (id.includes('autoestima')) {
    reflectionQuestion = '¿Qué cualidad o fortaleza propia recuerdas hoy con compasión y respeto?';
  }

  const quoteObj = getQuoteForEvaluation(category, (result.levelKey as any) || 'leve');

  const author = result.hopeMessage?.author || quoteObj.author;
  const quote = result.hopeMessage?.quote || quoteObj.quote;
  const hopeTitle = result.hopeMessage?.title || quoteObj.title;
  const hopeText = result.hopeMessage?.text || quoteObj.explanation;

  const tailoredResource = {
    id: Date.now(),
    tipo: result.percentage >= 50 ? 'consejo' : 'esperanza',
    escuela: quoteObj.school || escuela,
    tema: `${result.testName}: ${result.label}`,
    emocion: emotions,
    perfil: [psychProfile],
    nivel: 'intermedio',
    energia: 'media',
    momento: 'cualquiera',
    duracion: firstExercise?.duration || '3 min',
    semana_terapeutica: [1],
    tags: [id.slice(0, 10), emotions[0] || 'bienestar', 'awe'],
    texto: `**📜 ${author}**\n"${quote}"\n\n**${hopeTitle}**\n${hopeText}\n\n**Interpretación Personalizada**: ${result.interpretation}`,
    accion: actionStep,
    pregunta: reflectionQuestion,
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('conexionluz:awe_daily_resource', JSON.stringify(tailoredResource));
      localStorage.setItem('conexionluz:awe_profile', JSON.stringify(profileData));
    } catch { /* silent */ }
  }

  return { profileData, tailoredResource };
}
