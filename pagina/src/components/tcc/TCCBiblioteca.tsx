import React, { useState } from 'react';
import { Volume2, Video, FileText, Download, Sparkles, FolderDown } from 'lucide-react';

const RESOURCES = [
  {
    category: "Documentos",
    icon: FileText,
    color: "teal",
    items: [
      { title: "Manual de Fundamentos de la TCC: De Beck a la Práctica Contemporánea", type: "Documento PDF", size: "3.8 MB", desc: "Compendio completo de los 10 módulos con esquemas teóricos e históricos." },
      { title: "Guía Rápida de Identificación de Distorsiones Cognitivas", type: "Documento PDF", size: "1.5 MB", desc: "Ficha resumen de 12 sesgos cognitivos con preguntas socráticas de reencuadre." },
      { title: "Glosario Completo de Conceptos Cognitivo-Conductuales", type: "Documento PDF", size: "2.1 MB", desc: "Diccionario de términos técnicos y aplicaciones pedagógicas." }
    ]
  },
  {
    category: "Plantillas",
    icon: FolderDown,
    color: "blue",
    items: [
      { title: "Plantilla 1: Registro de Pensamientos Automáticos (7 Columnas)", type: "Plantilla PDF / DOC", size: "950 KB", desc: "Formato estructurado imprimible para reestructuración cognitiva." },
      { title: "Plantilla 2: Hoja de Análisis Funcional ABC de la Conducta", type: "Plantilla PDF", size: "820 KB", desc: "Matriz para descomposición de antecedentes, conductas y consecuencias." },
      { title: "Plantilla 3: Guía de Resolución de Problemas en 7 Pasos", type: "Plantilla PDF", size: "1.1 MB", desc: "Esquema práctico de toma de decisiones y planes de acción." },
      { title: "Plantilla 4: Cronograma de Activación Conductual y Registro de Hábitos", type: "Plantilla PDF", size: "890 KB", desc: "Planificador semanal de actividades orientadas al bienestar." }
    ]
  },
  {
    category: "Videos",
    icon: Video,
    color: "indigo",
    items: [
      { title: "Clase Magistral: La Triada Cognitiva y el Diálogo Socrático", type: "Video MP4", duration: "28 min", desc: "Explicación detallada sobre la formulación de preguntas de evidencia." },
      { title: "Demostración: Análisis Funcional de un Patrón de Evitación", type: "Video MP4", duration: "22 min", desc: "Desglose paso a paso de un caso ficticio de procrastinación." }
    ]
  },
  {
    category: "Audios",
    icon: Volume2,
    color: "cyan",
    items: [
      { title: "Práctica Guiada: Toma de Conciencia de Pensamientos Automáticos", type: "Audio MP3", duration: "14 min", desc: "Ejercicio de atención plena para notar el flujo del diálogo interno sin juzgar." },
      { title: "Ejercicio Guiado: Respiración Diafragmática y Regulación Somática", type: "Audio MP3", duration: "16 min", desc: "Entrenamiento de modulación psicofisiológica ante picos de intensidad emocional." }
    ]
  }
];

export default function TCCBiblioteca() {
  const [activeCategory, setActiveCategory] = useState<string>("Plantillas");

  const activeRes = RESOURCES.find(r => r.category === activeCategory) || RESOURCES[1];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/30 border border-teal-400/40 text-teal-200 px-3 py-1 rounded-full">
            📚 REPOSITORIO DE RECURSOS EDUCATIVOS
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Biblioteca de Recursos TCC</h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Descarga plantillas de trabajo, guías de registro de pensamientos, fichas de análisis ABC y material complementario en PDF.
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
                  ? 'bg-teal-600 text-white shadow-xs'
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

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeRes.items.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
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
              <span className="text-[11px] text-teal-700 font-bold flex items-center gap-1">
                ✓ Disponible para estudio
              </span>
              <button
                onClick={() => alert(`Recurso educativo preparado: ${item.title}`)}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
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
