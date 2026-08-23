export interface ActivityHistoryItem {
  id: string;
  type: 'diario' | 'ejercicio' | 'test' | 'cita';
  title: string;
  date: string;
  details?: string;
}

export function getProgressStats() {
  if (typeof window === 'undefined') {
    return {
      diaryCount: 0,
      diaryStreak: 0,
      exerciseCount: 0,
      testCount: 0,
      avgMood: 0,
      overallProgress: 0,
      userGoal: 'Reducción de Estrés y Ansiedad',
      history: [] as ActivityHistoryItem[],
      diaryEntries: []
    };
  }

  // 1. Diario Emocional entries
  let diaryEntries: Array<{ date: string; mood: { value: number; emoji: string }; text: string; gratitude: string }> = [];
  try {
    diaryEntries = JSON.parse(localStorage.getItem('conexionluz:diario-emocional') || '[]');
  } catch {
    diaryEntries = [];
  }

  const diaryCount = diaryEntries.length;

  // Streak calculation (consecutive days)
  let diaryStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysWithEntries = new Set(diaryEntries.map((e) => new Date(e.date).toDateString()));
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (daysWithEntries.has(d.toDateString())) diaryStreak++;
    else break;
  }

  // Avg mood
  const last7 = diaryEntries.slice(0, 7);
  const avgMood = last7.length ? Math.round((last7.reduce((s, e) => s + (e.mood?.value || 3), 0) / last7.length) * 10) / 10 : 0;

  // 2. Exercise completions & unlocked practices
  let exerciseCount = 0;
  try {
    exerciseCount = parseInt(localStorage.getItem('conexionluz:ejercicios-completados') || '0', 10);
    let unlockedCount = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('conexionluz:unlocked_exercise:') || key.startsWith('conexionluz:purchased:'))) {
        unlockedCount++;
      }
    }
    exerciseCount = Math.max(exerciseCount, unlockedCount);
  } catch {
    exerciseCount = 0;
  }

  // 3. Test completions
  let testCount = 0;
  try {
    testCount = parseInt(localStorage.getItem('conexionluz:tests-completados') || '0', 10);
    let testUnlocked = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('conexionluz:purchased_test:')) {
        testUnlocked++;
      }
    }
    testCount = Math.max(testCount, testUnlocked);
  } catch {
    testCount = 0;
  }

  // 4. User Goal / Focus
  let userGoal = localStorage.getItem('conexionluz:mi-objetivo-bienestar') || 'Reducción de Estrés y Ansiedad';
  try {
    const profile = JSON.parse(localStorage.getItem('conexionluz:awe_profile') || '{}');
    if (profile && profile.focus) {
      userGoal = profile.focus;
    }
  } catch {
    /* silent */
  }

  // 5. Calculate Overall Progress Score (0% to 100%)
  const diaryPoints = Math.min(40, diaryCount * 8);
  const exercisePoints = Math.min(35, exerciseCount * 7);
  const testPoints = Math.min(25, testCount * 12.5);
  const overallProgress = Math.min(100, Math.round(diaryPoints + exercisePoints + testPoints));

  // 6. Build combined history timeline
  const history: ActivityHistoryItem[] = [];

  diaryEntries.slice(0, 5).forEach((e) => {
    history.push({
      id: `diary-${e.date}`,
      type: 'diario',
      title: 'Entrada en Diario Emocional',
      date: e.date,
      details: `${e.mood?.emoji || '📓'} ${e.text ? e.text.slice(0, 50) + '...' : 'Reflexión del día'}`
    });
  });

  try {
    const exHist: Array<{ title: string; date: string }> = JSON.parse(localStorage.getItem('conexionluz:ejercicios-historial') || '[]');
    exHist.slice(0, 5).forEach((e) => {
      history.push({
        id: `ex-${e.date}`,
        type: 'ejercicio',
        title: `Ejercicio: ${e.title}`,
        date: e.date,
        details: 'Práctica de regulación emocional completada'
      });
    });
  } catch {
    /* silent */
  }

  try {
    const testHist: Array<{ title: string; score?: number; date: string }> = JSON.parse(localStorage.getItem('conexionluz:tests-historial') || '[]');
    testHist.slice(0, 5).forEach((t) => {
      history.push({
        id: `test-${t.date}`,
        type: 'test',
        title: `Test: ${t.title}`,
        date: t.date,
        details: `Evaluación realizada con éxito`
      });
    });
  } catch {
    /* silent */
  }

  history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    diaryCount,
    diaryStreak,
    exerciseCount,
    testCount,
    avgMood,
    overallProgress,
    userGoal,
    history: history.slice(0, 10),
    diaryEntries
  };
}

export function recordExerciseActivity(title: string) {
  if (typeof window === 'undefined') return;
  try {
    const current = parseInt(localStorage.getItem('conexionluz:ejercicios-completados') || '0', 10);
    localStorage.setItem('conexionluz:ejercicios-completados', String(current + 1));
    const history = JSON.parse(localStorage.getItem('conexionluz:ejercicios-historial') || '[]');
    history.unshift({ title, date: new Date().toISOString() });
    localStorage.setItem('conexionluz:ejercicios-historial', JSON.stringify(history.slice(0, 30)));
    window.dispatchEvent(new CustomEvent('conexionluz:progreso-updated'));
  } catch (e) {
    console.error(e);
  }
}

export function recordTestActivity(title: string, score?: number) {
  if (typeof window === 'undefined') return;
  try {
    const current = parseInt(localStorage.getItem('conexionluz:tests-completados') || '0', 10);
    localStorage.setItem('conexionluz:tests-completados', String(current + 1));
    const history = JSON.parse(localStorage.getItem('conexionluz:tests-historial') || '[]');
    history.unshift({ title, score: score || 80, date: new Date().toISOString() });
    localStorage.setItem('conexionluz:tests-historial', JSON.stringify(history.slice(0, 30)));
    window.dispatchEvent(new CustomEvent('conexionluz:progreso-updated'));
  } catch (e) {
    console.error(e);
  }
}

export function setUserGoal(goal: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('conexionluz:mi-objetivo-bienestar', goal);
  window.dispatchEvent(new CustomEvent('conexionluz:progreso-updated'));
}
