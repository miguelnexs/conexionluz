import React, { useState } from 'react';
import { Heart, Sparkles, CheckCircle2, Save, Info, Compass, HelpCircle } from 'lucide-react';

type EmotionFamily = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  secondary: string[];
  functionDesc: string;
  physicalSensations: string;
  associatedThoughts: string;
  reflectionQuestion: string;
};

const EMOTION_FAMILIES: EmotionFamily[] = [
  {
    id: "miedo",
    name: "Miedo y Ansiedad",
    emoji: "🛡️",
    color: "amber",
    secondary: ["Inquietud", "Aprensión", "Inseguridad", "Vulnerabilidad", "Alerta", "Pánico"],
    functionDesc: "Anticipar posibles peligros o incertidumbres para protegernos y movilizar recursos de seguridad.",
    physicalSensations: "Tensión muscular, aceleración cardíaca, respiración superficial, sequedad bucal.",
    associatedThoughts: "'Algo malo puede ocurrir', '¿Y si no soy capaz de resolverlo?'.",
    reflectionQuestion: "¿Qué recurso o información necesitas para sentir mayor seguridad en este momento?"
  },
  {
    id: "ira",
    name: "Ira y Frustración",
    emoji: "🔥",
    color: "rose",
    secondary: ["Irritación", "Resentimiento", "Indignación", "Rabia", "Impotencia", "Disgusto"],
    functionDesc: "Señalar la transgresión de un límite personal o una injusticia percibida para defender la propia dignidad.",
    physicalSensations: "Calor corporal, mandíbula apretada, puños cerrados, impulso de avanzar o confrontar.",
    associatedThoughts: "'Esto es injusto', 'No tienen derecho a tratarme así'.",
    reflectionQuestion: "¿Qué límite personal necesitas comunicar con firmeza y respeto?"
  },
  {
    id: "tristeza",
    name: "Tristeza y Duelo",
    emoji: "🌧️",
    color: "blue",
    secondary: ["Melancolía", "Desánimo", "Soledad", "Nostalgia", "Pesadumbre", "Vacío"],
    functionDesc: "Asimilar una pérdida, integrar un cambio y propiciar el repliegue reflexivo y la búsqueda de afecto.",
    physicalSensations: "Pesadez en el pecho o garganta, disminución de energía, ganas de llorar, lentitud motriz.",
    associatedThoughts: "'He perdido algo valioso', 'Necesito tiempo para procesar esto'.",
    reflectionQuestion: "¿Qué necesitas soltar o qué tipo de apoyo afectivo te reconfortaría hoy?"
  },
  {
    id: "alegria",
    name: "Alegría y Vitalidad",
    emoji: "☀️",
    color: "yellow",
    secondary: ["Entusiasmo", "Júbilo", "Optimismo", "Satisfacción", "Orgullo sano", "Placer"],
    functionDesc: "Reforzar conductas adaptativas, celebrar logros y estrechar los lazos sociales y de cooperación.",
    physicalSensations: "Ligereza corporal, sonrisa espontánea, expansión torácica, incremento de energía.",
    associatedThoughts: "'Esto es maravilloso', 'Valió la pena el esfuerzo'.",
    reflectionQuestion: "¿Cómo puedes saborear conscientemente este momento y compartirlo con otros?"
  },
  {
    id: "calma",
    name: "Calma y Serenidad",
    emoji: "🍃",
    color: "emerald",
    secondary: ["Paz interior", "Tranquilidad", "Armonía", "Sosiego", "Templanza", "Alivio"],
    functionDesc: "Restaurar el equilibrio del sistema nervioso autónomo (activación parasimpática) y reparar el organismo.",
    physicalSensations: "Respiración profunda y pausada, hombros relajados, ritmo cardíaco suave.",
    associatedThoughts: "'Todo está en orden en este instante', 'Puedo descansar con tranquilidad'.",
    reflectionQuestion: "¿Qué condiciones o hábitos cotidianos te facilitan regresar a este estado de paz?"
  },
  {
    id: "gratitud",
    name: "Gratitud y Conexión",
    emoji: "🙏",
    color: "teal",
    secondary: ["Agradecimiento", "Apreciación", "Ternura", "Generosidad", "Compasión", "Pertenencia"],
    functionDesc: "Reconocer los dones recibidos, valorar la contribución de los demás y fortalecer el tejido social.",
    physicalSensations: "Calidez en el centro del pecho, relajación facial, sensación de plenitud.",
    associatedThoughts: "'Agradezco contar con este apoyo', 'La vida tiene aspectos luminosos'.",
    reflectionQuestion: "¿A qué tres personas o experiencias cotidianas deseas agradecer hoy?"
  }
];

export default function IERuedaEmocional() {
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>("calma");
  const [reflection, setReflection] = useState<string>("");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const activeFamily = EMOTION_FAMILIES.find(f => f.id === selectedFamilyId) || EMOTION_FAMILIES[0];

  const handleSaveReflection = () => {
    if (!reflection.trim()) return;
    const key = `conexionluz:ie_wheel_${selectedFamilyId}`;
    localStorage.setItem(key, reflection);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/30 border border-teal-400/40 text-teal-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            🎡 EXPLORADOR AFECTIVO
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Rueda de Exploración Emocional</h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Navega a través de las familias emocionales principales para comprender su función evolutiva, sensaciones somáticas y enriquecer tu vocabulario afectivo.
        </p>
      </div>

      {/* Emotion Families Wheel Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {EMOTION_FAMILIES.map((fam) => {
          const isSelected = fam.id === selectedFamilyId;
          return (
            <button
              key={fam.id}
              onClick={() => {
                setSelectedFamilyId(fam.id);
                setReflection(localStorage.getItem(`conexionluz:ie_wheel_${fam.id}`) || "");
              }}
              className={`p-4 rounded-3xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5 ${
                isSelected
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md transform scale-[1.03]'
                  : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700 shadow-2xs'
              }`}
            >
              <span className="text-2xl">{fam.emoji}</span>
              <span className="text-xs font-black leading-tight">{fam.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Detail Breakdown Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{activeFamily.emoji}</span>
            <div>
              <h3 className="text-xl font-black text-slate-900">{activeFamily.name}</h3>
              <span className="text-xs text-teal-800 font-bold">Familia Emocional Primaria</span>
            </div>
          </div>
        </div>

        {/* Secondary emotions tags */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Matices y Emociones Secundarias:
          </label>
          <div className="flex flex-wrap gap-2">
            {activeFamily.secondary.map((sec, idx) => (
              <span
                key={idx}
                className="bg-teal-50 border border-teal-200 text-teal-900 font-bold text-xs px-3 py-1 rounded-full shadow-2xs"
              >
                {sec}
              </span>
            ))}
          </div>
        </div>

        {/* 3 Pillars of Emotion */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <h4 className="font-bold text-xs text-slate-900 uppercase">🎯 Función Adaptativa</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{activeFamily.functionDesc}</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <h4 className="font-bold text-xs text-slate-900 uppercase">💓 Sensaciones Corporales</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{activeFamily.physicalSensations}</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <h4 className="font-bold text-xs text-slate-900 uppercase">💭 Diálogo Interno Frecuente</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{activeFamily.associatedThoughts}</p>
          </div>
        </div>

        {/* Guided Reflection */}
        <div className="p-5 bg-teal-50/60 border border-teal-200 rounded-2xl space-y-3">
          <label className="block text-xs font-bold text-teal-950 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-teal-700" /> Pregunta de Reflexión: {activeFamily.reflectionQuestion}
          </label>
          <textarea
            rows={3}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Anota una breve reflexión personal sobre cómo vives esta emoción..."
            className="w-full bg-white border border-teal-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/20"
          />

          <div className="flex items-center justify-between pt-1">
            {savedSuccess ? (
              <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> ¡Reflexión guardada!
              </span>
            ) : (
              <span className="text-[11px] text-teal-800/80">Guarda tus notas para consultarlas cuando explores esta emoción.</span>
            )}

            <button
              onClick={handleSaveReflection}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              <Save className="h-3.5 w-3.5" /> Guardar Nota
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
