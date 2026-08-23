import React, { useState } from 'react';
import { FileText, FolderDown, Video, Volume2, Download, Sparkles } from 'lucide-react';

const RESOURCES = [
  {
    category: "Documentos",
    icon: FileText,
    items: [
      { title: "Manual de Desarrollo Personal y Transformación Consciente", type: "Documento PDF", size: "4.2 MB", desc: "Guía completa que compendia los 10 módulos, esquemas teóricos y ejercicios." },
      { title: "Guía Rápida de Formulación de Metas SMART y Micro-Hábitos", type: "Documento PDF", size: "1.8 MB", desc: "Ficha sintética para estructurar proyectos personales y reducir la procrastinación." },
      { title: "Glosario Conceptual y Preguntas de Autoindagación", type: "Documento PDF", size: "2.3 MB", desc: "Diccionario de términos y cuaderno de preguntas reflexivas para la autorreflexión." }
    ]
  },
  {
    category: "Plantillas",
    icon: FolderDown,
    items: [
      { title: "Plantilla 1: Mi Mapa Personal de Identidad y Recursos", type: "Plantilla PDF / Word", size: "850 KB", desc: "Matriz imprimible para registrar fortalezas, valores y áreas de desarrollo." },
      { title: "Plantilla 2: Hoja de Trabajo de la Brújula de Valores", type: "Plantilla PDF", size: "720 KB", desc: "Herramienta visual para ordenar prioridades y evaluar coherencia vital." },
      { title: "Plantilla 3: Planificador Semanal de Hábitos y Rutinas", type: "Plantilla PDF", size: "910 KB", desc: "Cronograma de seguimiento para consolidar hábitos con la regla de los 2 minutos." },
      { title: "Plantilla 4: Formato de Diario Emocional y de Gratitud", type: "Plantilla PDF", size: "640 KB", desc: "Estructura de registro diario de aprendizajes, emociones y logros." }
    ]
  },
  {
    category: "Videos",
    icon: Video,
    items: [
      { title: "Clase Magistral: Arquitectura de Hábitos y Entorno Facilitador", type: "Video MP4", duration: "25 min", desc: "Explicación en profundidad sobre la optimización del entorno para evitar la fricción." },
      { title: "Demostración: Cómo Establecer Límites Asertivos en Relaciones", type: "Video MP4", duration: "20 min", desc: "Modelado de conversaciones difíciles con claridad, empatía y respeto mutuo." }
    ]
  },
  {
    category: "Audios",
    icon: Volume2,
    items: [
      { title: "Práctica Guiada: Claridad Matutina e Intención Diaria", type: "Audio MP3", duration: "12 min", desc: "Meditación de atención consciente para iniciar el día alineado con tus valores." },
      { title: "Ejercicio Guiado: Respiración Diafragmática y Regulación del Estrés", type: "Audio MP3", duration: "15 min", desc: "Entrenamiento psicofisiológico para desacelerar el ritmo cardíaco y calmar la mente." }
    ]
  }
];

export default function DPBiblioteca() {
  const [activeCategory, setActiveCategory] = useState("Plantillas");
  const activeRes = RESOURCES.find(r => r.category === activeCategory) || RESOURCES[1];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            📁 RECURSOS EDUCATIVOS
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Biblioteca de Recursos Descargables</h2>
        <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Descarga plantillas de trabajo en PDF, fichas de seguimiento de hábitos, audios de atención plena y materiales complementarios.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {RESOURCES.map((res) => {
          const isActive = res.category === activeCategory;
          const Icon = res.icon;
          return (
            <button
              key={res.category}
              onClick={() => setActiveCategory(res.category)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{res.category}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {res.items.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeRes.items.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {item.type}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  {(item as any).size || (item as any).duration}
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900 leading-tight">{item.title}</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                ✓ Material formativo
              </span>
              <button
                onClick={() => alert(`Recurso preparado para estudio: ${item.title}`)}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> Descargar / Abrir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
