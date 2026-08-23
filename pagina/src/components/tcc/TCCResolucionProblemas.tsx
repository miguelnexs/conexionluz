import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Save, Trash2, HelpCircle, Target, ListChecks } from 'lucide-react';

type ProblemSolvePlan = {
  id: string;
  date: string;
  problem: string;
  goal: string;
  alternatives: string[];
  evaluation: string;
  chosenSolution: string;
  actionPlan: string;
  reviewDate: string;
};

export default function TCCResolucionProblemas() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [plans, setPlans] = useState<ProblemSolvePlan[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [problem, setProblem] = useState('');
  const [goal, setGoal] = useState('');
  const [alt1, setAlt1] = useState('');
  const [alt2, setAlt2] = useState('');
  const [alt3, setAlt3] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [chosenSolution, setChosenSolution] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [reviewDate, setReviewDate] = useState('');

  useEffect(() => {
    const local = localStorage.getItem('conexionluz:tcc_problem_plans');
    if (local) {
      try {
        setPlans(JSON.parse(local));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSavePlan = () => {
    if (!problem.trim() || !chosenSolution.trim()) return;

    const newPlan: ProblemSolvePlan = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      problem,
      goal,
      alternatives: [alt1, alt2, alt3].filter(Boolean),
      evaluation,
      chosenSolution,
      actionPlan,
      reviewDate
    };

    const updated = [newPlan, ...plans];
    setPlans(updated);
    localStorage.setItem('conexionluz:tcc_problem_plans', JSON.stringify(updated));

    // Reset
    setProblem('');
    setGoal('');
    setAlt1('');
    setAlt2('');
    setAlt3('');
    setEvaluation('');
    setChosenSolution('');
    setActionPlan('');
    setReviewDate('');
    setCurrentStep(1);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDelete = (id: string) => {
    const updated = plans.filter(p => p.id !== id);
    setPlans(updated);
    localStorage.setItem('conexionluz:tcc_problem_plans', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/30 border border-teal-400/40 text-teal-200 px-3 py-1 rounded-full">
            🎯 ENTRENAMIENTO EN HABILIDADES
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Asistente de Resolución de Problemas</h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Aplica el protocolo estructurado de 7 pasos de D'Zurilla y Goldfried para transformar problemas abrumadores en planes de acción concretos y evaluables.
        </p>
      </div>

      {/* Step Progress Pills */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs flex items-center justify-between overflow-x-auto gap-2">
        {[
          { num: 1, label: "1. Definir" },
          { num: 2, label: "2. Alternativas" },
          { num: 3, label: "3. Evaluación" },
          { num: 4, label: "4. Plan de Acción" }
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setCurrentStep(s.num)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              currentStep === s.num
                ? 'bg-teal-600 text-white shadow-xs'
                : currentStep > s.num
                ? 'bg-teal-50 text-teal-800'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Step Content Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                Paso 1 y 2 de 4
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">Definición Operativa del Problema y Meta</h3>
              <p className="text-xs text-slate-500 font-medium">Delimita la situación en términos concretos y alcanzables.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                1. ¿Cuál es el problema concreto en términos de hechos observables?
              </label>
              <textarea
                rows={3}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="ej: Acumulo 5 tareas pendientes del trabajo porque me cuesta empezar en las mañanas..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                2. ¿Cuál es tu objetivo o meta realista y medible?
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="ej: Completar al menos 1 tarea prioritaria cada mañana de 9:00 a 10:30."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!problem.trim()}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Siguiente: Generar Alternativas <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                Paso 3 de 4
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">Generación de Alternativas (Brainstorming)</h3>
              <p className="text-xs text-slate-500 font-medium">Escribe al menos 3 opciones distintas sin descartar ninguna por ahora.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Opción A:</label>
                <input
                  type="text"
                  value={alt1}
                  onChange={(e) => setAlt1(e.target.value)}
                  placeholder="ej: Desglosar la tarea en 3 bloques pequeños de 25 min (Método Pomodoro)."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Opción B:</label>
                <input
                  type="text"
                  value={alt2}
                  onChange={(e) => setAlt2(e.target.value)}
                  placeholder="ej: Dejar preparado el escritorio y el archivo abierto desde la noche anterior."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Opción C:</label>
                <input
                  type="text"
                  value={alt3}
                  onChange={(e) => setAlt3(e.target.value)}
                  placeholder="ej: Pedir retroalimentación breve a un compañero para desbloquear el primer párrafo."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Anterior
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Siguiente: Evaluar Opciones <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                Paso 4 y 5 de 4
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">Evaluación de Consecuencias y Decisión</h3>
              <p className="text-xs text-slate-500 font-medium">Sopesa pros y contras para seleccionar la alternativa más viable.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Evaluación de Viabilidad, Pros y Contras:
              </label>
              <textarea
                rows={3}
                value={evaluation}
                onChange={(e) => setEvaluation(e.target.value)}
                placeholder="La Opción A y B son muy fáciles de implementar de inmediato y no dependen de terceros..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-teal-950 font-black mb-1">
                Solución Elegida:
              </label>
              <input
                type="text"
                value={chosenSolution}
                onChange={(e) => setChosenSolution(e.target.value)}
                placeholder="ej: Combinar dejar preparado el material la noche anterior y trabajar en bloques de 25 min."
                className="w-full bg-teal-50/70 border border-teal-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800"
              />
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Anterior
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                disabled={!chosenSolution.trim()}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Siguiente: Plan de Acción <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                Paso 6 y 7 de 4
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">Plan de Acción y Fecha de Verificación</h3>
              <p className="text-xs text-slate-500 font-medium">Establece el primer paso inmediato y cuándo evaluarás el resultado.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                ¿Cuál es tu primer paso específico a dar hoy mismo?
              </label>
              <textarea
                rows={3}
                value={actionPlan}
                onChange={(e) => setActionPlan(e.target.value)}
                placeholder="Hoy a las 18:00 dejaré la carpeta organizada en el ordenador con los 3 títulos de los bloques."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Fecha de Revisión de Resultados:
              </label>
              <input
                type="text"
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
                placeholder="ej: Viernes próximo a las 17:00"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800"
              />
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Anterior
              </button>
              <button
                onClick={handleSavePlan}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Save className="h-4 w-4" /> Guardar Plan de Solución
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Saved Plans History */}
      {plans.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider px-1">
            Planes de Solución Guardados ({plans.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((p) => (
              <div key={p.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">{p.date}</span>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[10px] block">Problema:</span>
                    <p className="text-slate-800 font-medium">{p.problem}</p>
                  </div>
                  <div>
                    <span className="font-bold text-teal-700 uppercase text-[10px] block">Solución Elegida:</span>
                    <p className="text-teal-950 font-bold">{p.chosenSolution}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[10px] block">Primer Paso de Acción:</span>
                    <p className="text-slate-700">{p.actionPlan}</p>
                  </div>
                  {p.reviewDate && (
                    <div className="text-[11px] text-slate-500 font-semibold">
                      Revisión: {p.reviewDate}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
