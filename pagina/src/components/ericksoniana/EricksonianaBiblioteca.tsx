import React, { useState } from 'react';
import { Volume2, Video, FileText, Download, Sparkles, FolderDown } from 'lucide-react';

const RESOURCES = [
  {
    category: "Audio",
    icon: Volume2,
    color: "emerald",
    items: [
      { title: "Demostración 1: Pacing verbal y ritmo respiratorio", type: "Audio MP3", duration: "12 min", desc: "Audio instructivo de acompañamiento y modulación vocal ericksoniana." },
      { title: "Demostración 2: Inducción conversacional naturalista", type: "Audio MP3", duration: "15 min", desc: "Ejemplo de reorientación de atención sostenida." },
      { title: "Ejercicio Guiado: Focalización y relajación sensorial", type: "Audio MP3", duration: "18 min", desc: "Práctica guiada para estudio personal de lenguaje indirecto." }
    ]
  },
  {
    category: "Video",
    icon: Video,
    color: "indigo",
    items: [
      { title: "Video 1: Análisis de calibración no verbal y tono muscular", type: "Video MP4", duration: "20 min", desc: "Explicación visual de señales fisiológicas observables." },
      { title: "Video 2: Demostración de inducción progresiva y metáfora", type: "Video MP4", duration: "25 min", desc: "Caso práctico analizado paso a paso." }
    ]
  },
  {
    category: "PDF",
    icon: FileText,
    color: "purple",
    items: [
      { title: "Resumen de Contenido: El Milton-Modelo del Lenguaje", type: "Documento PDF", size: "2.4 MB", desc: "Guía de referencia rápida sobre presuposiciones y patrones permisivos." },
      { title: "Manual Clínico: Principios de Milton H. Erickson", type: "Documento PDF", size: "4.1 MB", desc: "Compendio de la filosofía de utilización y flexibilidad." }
    ]
  },
  {
    category: "Plantillas",
    icon: FolderDown,
    color: "teal",
    items: [
      { title: "Plantilla 1: Ficha de Diseño de Sesión de 10 Etapas", type: "Plantilla PDF / DOC", size: "1.2 MB", desc: "Formato estructurado para planificación de intervenciones." },
      { title: "Plantilla 2: Guía de Calibración y Mapa de Observación", type: "Plantilla PDF", size: "850 KB", desc: "Ficha de registro de señales respiratorias y posturales." },
      { title: "Plantilla 3: Taller de Construcción de Metáforas Ericksonianas", type: "Plantilla PDF", size: "1.0 MB", desc: "Esquema práctico de 7 pasos para narración analógica." },
      { title: "Plantilla 4: Tabla Comparativa de Sugestiones Directas vs Indirectas", type: "Plantilla PDF", size: "900 KB", desc: "Ejemplos de reformulación permisiva orientada a posibilidades." }
    ]
  }
];

export default function EricksonianaBiblioteca() {
  const [activeCategory, setActiveCategory] = useState<string>("Plantillas");

  const activeRes = RESOURCES.find(r => r.category === activeCategory) || RESOURCES[3];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-3 py-1 rounded-full">
            📚 CENTRO DE RECURSOS Y PLANTILLAS
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Biblioteca de Hipnosis Ericksoniana</h2>
        <p className="text-slate-300 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Accede a materiales complementarios, plantillas descargables de trabajo, demostraciones en audio/video y resúmenes en PDF.
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
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{res.category}</span>
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeRes.items.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  {item.type}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {'duration' in item ? item.duration : item.size}
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900 leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Preparado para el estudiante</span>
              <button
                onClick={() => {
                  alert(`Descargando / Abriendo recurso: "${item.title}". El administrador podrá vincular archivos dinámicos.`);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> Descargar / Ver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
