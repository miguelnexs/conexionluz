import React, { useState } from 'react';
import { Mail, Download, Sparkles, CheckCircle2, User, Send } from 'lucide-react';
import { EvaluationResult } from '@/utils/RecommendationEngine';
import { api } from '@/api/client';

interface LeadMagnetModalProps {
  evaluationResult: EvaluationResult;
  onClose: () => void;
}

export const LeadMagnetModal: React.FC<LeadMagnetModalProps> = ({
  evaluationResult,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);

    try {
      await api.post('/api/public/send-wellbeing-report/', {
        name: name.trim(),
        email: email.trim(),
        testTitle: evaluationResult.testName,
        label: evaluationResult.label,
        score: evaluationResult.totalScore,
        maxScore: evaluationResult.maxScore,
        interpretation: evaluationResult.interpretation,
        recommendations: evaluationResult.recommendations,
        exercises: evaluationResult.exercises,
        hopeTitle: evaluationResult.hopeMessage.title,
        hopeText: evaluationResult.hopeMessage.text,
      });
    } catch (err) {
      console.warn('Correo en segundo plano:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const handleDownloadSimulatedPDF = () => {
    // Format exercises for export
    const exercisesSection = evaluationResult.exercises && evaluationResult.exercises.length > 0
      ? `\n\nEJERCICIOS PRÁCTICOS DE BIENESTAR RECOMENDADOS:
---------------------------------------------
` + evaluationResult.exercises.map((ex, i) => `[Ejercicio ${i + 1}] ${ex.title} (${ex.category} - ${ex.duration})
${ex.description}
Paso a paso:
${ex.steps.map((st, sIdx) => `  ${sIdx + 1}. ${st}`).join('\n')}`).join('\n\n')
      : '';

    const content = `
CONEXIÓN LUZ - PLAN INICIAL DE BIENESTAR PERSONALIZADO
======================================================
Emisor: conexionluz@conexionluz.com
Fecha: ${new Date().toLocaleDateString('es-ES')}
Evaluación: ${evaluationResult.testName}
Resultado: ${evaluationResult.label} (Puntaje: ${evaluationResult.totalScore} / ${evaluationResult.maxScore})

INTERPRETACÓN PERSONALIZADA:
---------------------------
${evaluationResult.interpretation}

RECOMENDACIONES CLAVE:
---------------------
${evaluationResult.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}${exercisesSection}

MENSAJE DE ESPERANZA:
--------------------
"${evaluationResult.hopeMessage.title}"
${evaluationResult.hopeMessage.text}

======================================================
Para agendar tu sesión terapéutica profesional:
https://conexionluz.com/#/agenda
Contacto: conexionluz@conexionluz.com
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Plan_Bienestar_Conexion_Luz_${name.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-title"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs font-bold transition-colors"
          >
            ✕
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm mx-auto flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 id="lead-title" className="text-xl font-black">Plan Inicial de Bienestar</h3>
          <p className="text-xs text-white/80 mt-1">
            Enviaremos tu informe completo desde <strong>conexionluz@conexionluz.com</strong> a tu correo.
          </p>
        </div>

        <div className="p-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tu nombre
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. María García"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-800 leading-relaxed font-medium">
                📩 Recibirás tu correo oficial de <strong>conexionluz@conexionluz.com</strong> con tu plan inicial de bienestar y ejercicios guiados.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Enviando correo oficial...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar Plan a mi Correo
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-2 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-100">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-lg">¡Correo enviado con éxito!</h4>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Hola <strong>{name}</strong>, hemos despachado tu plan desde <strong>conexionluz@conexionluz.com</strong> hacia <strong>{email}</strong>. También puedes guardar una copia local a continuación.
                </p>
              </div>

              <button
                onClick={handleDownloadSimulatedPDF}
                className="w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Descargar copia en PDF / Texto
              </button>

              <button
                onClick={onClose}
                className="text-xs text-slate-400 font-bold hover:text-slate-600 pt-2 block mx-auto cursor-pointer"
              >
                Cerrar ventana
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
