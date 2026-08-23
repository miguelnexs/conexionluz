import React, { useState } from 'react';
import { FileText, FolderDown, Video, Volume2, Download, Sparkles } from 'lucide-react';

const RESOURCES = [
  {
    category: "Documentos",
    icon: FileText,
    items: [
      { title: "Manual de Autoconocimiento: Conócete y Comprende tu Mundo Interior", type: "Documento PDF", size: "4.8 MB", desc: "Guía completa de los 10 módulos con fundamentación teórica, esquemas y ejercicios." },
      { title: "Cuaderno de Preguntas Esenciales de Autoobservación", type: "Documento PDF", size: "2.1 MB", desc: "Compendio de más de 50 preguntas poderosas para reflexionar sobre tu vida." },
      { title: "Guía para la Construcción de Límites Saludables", type: "Documento PDF", size: "1.4 MB", desc: "Estrategias de comunicación y delimitación para familia, pareja y trabajo." }
    ]
  },
  {
    category: "Plantillas",
    icon: FolderDown,
    items: [
      { title: "Plantilla 1: Mi Mapa de Identidad en Alta Resolución", type: "Plantilla PDF / Word", size: "850 KB", desc: "Formato editable e imprimible para tus 8 pilares de identidad y aspiraciones." },
      { title: "Plantilla 2: La Brújula de Valores y Cuadrante de Decisiones", type: "Plantilla PDF", size: "620 KB", desc: "Ficha de trabajo para jerarquizar tus 5 valores rectores y evaluar su coherencia." },
      { title: "Plantilla 3: Línea de Vida Cronológica y Mapa de Relaciones", type: "Plantilla PDF", size: "1.2 MB", desc: "Plantilla para estructurar tu cronología personal y mapeo de vínculos." }
    ]
  },
  {
    category: "Videos",
    icon: Video,
    items: [
      { title: "Clase Magistral: Desidentificación y el Observador Consciente", type: "Video MP4", duration: "28 min", desc: "Cómo desarrollar la capacidad de observar pensamientos sin juzgarse." },
      { title: "Taller: Identidad vs. Roles Sociales y Mandatos Familiares", type: "Video MP4", duration: "22 min", desc: "Diferenciación sana entre lo que eres y lo que otros esperan de ti." }
    ]
  },
  {
    category: "Audios",
    icon: Volume2,
    items: [
      { title: "Práctica Guiada: Pausa de Autoobservación y Respiración (5 min)", type: "Audio MP3", duration: "5 min", desc: "Espacio guiado para regresar al momento presente y notar qué sientes." },
      { title: "Meditación: Conexión con tus Valores Innegociables", type: "Audio MP3", duration: "16 min", desc: "Visualización reflexiva para clarificar prioridades y serenar la mente." }
    ]
  }
];

export default function ACBiblioteca() {
  const [activeCategory, setActiveCategory] = useState("Plantillas");
  const activeRes = RESOURCES.find(r => r.category === activeCategory) || RESOURCES[1];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            📁 REPOSITORIO FORMATIVO
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Biblioteca de Recursos Descargables</h2>
        <p className="text-indigo-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Descarga plantillas en PDF, fichas de trabajo, audios de introspección y guías complementarias de autoconocimiento.
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
                  ? 'bg-indigo-600 text-white shadow-xs'
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

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeRes.items.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
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
              <span className="text-[11px] text-indigo-700 font-bold flex items-center gap-1">
                ✓ Material formativo
              </span>
              <button
                onClick={() => alert(`Recurso preparado para estudio: ${item.title}`)}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-800 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
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
