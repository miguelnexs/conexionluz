import React, { useState } from 'react';
import { FileText, FolderDown, Video, Volume2, Download, Sparkles } from 'lucide-react';

const RESOURCES = [
  {
    category: "Documentos",
    icon: FileText,
    items: [
      { title: "Manual Integral de Inteligencia Emocional y Conciencia Afectiva", type: "Documento PDF", size: "4.5 MB", desc: "Compendio académico de los 10 módulos con esquemas teóricos y ejercicios prácticos." },
      { title: "Guía de Granularidad y Vocabulario Emocional", type: "Documento PDF", size: "1.9 MB", desc: "Diccionario visual con más de 80 matices afectivos y preguntas de autoobservación." },
      { title: "Protocolo de la Pausa Consciente y Regulación Somática", type: "Documento PDF", size: "1.2 MB", desc: "Ficha sintética para imprimir y colocar en tu espacio de trabajo o estudio." }
    ]
  },
  {
    category: "Plantillas",
    icon: FolderDown,
    items: [
      { title: "Plantilla 1: Hoja de Mapeo de Episodios Emocionales", type: "Plantilla PDF / Word", size: "780 KB", desc: "Formato estructurado para desglosar Situación → Emoción → Necesidad → Respuesta." },
      { title: "Plantilla 2: Guión de Conversación Asertiva (Modelo CNV)", type: "Plantilla PDF", size: "650 KB", desc: "Estructura para preparar peticiones claras y límites sin generar reactividad." },
      { title: "Plantilla 3: Rueda Emocional Imprimible en Alta Resolución", type: "Plantilla PDF", size: "1.1 MB", desc: "Rueda de familias afectivas para colorear o usar en autorreflexión diaria." }
    ]
  },
  {
    category: "Videos",
    icon: Video,
    items: [
      { title: "Clase Magistral: La Neurobiología de la Pausa y la Amígdala", type: "Video MP4", duration: "24 min", desc: "Explicación neurocientífica del circuito entre el estímulo estresor y la corteza prefrontal." },
      { title: "Demostración: Validación Empática vs. Optimismo Forzado", type: "Video MP4", duration: "18 min", desc: "Modelado de conversaciones empáticas y errores frecuentes al intentar consolar." }
    ]
  },
  {
    category: "Audios",
    icon: Volume2,
    items: [
      { title: "Práctica Guiada: Pausa Consciente de 3 Minutos", type: "Audio MP3", duration: "3 min", desc: "Audio breve para desactivar la reactividad y reconectar con la respiración." },
      { title: "Ejercicio Guiado: Escaneo Corporal y Nombrado Afectivo", type: "Audio MP3", duration: "14 min", desc: "Entrenamiento de atención plena para notar sensaciones corporales sin juzgarlas." }
    ]
  }
];

export default function IEBiblioteca() {
  const [activeCategory, setActiveCategory] = useState("Plantillas");
  const activeRes = RESOURCES.find(r => r.category === activeCategory) || RESOURCES[1];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/30 border border-teal-400/40 text-teal-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            📁 REPOSITORIO FORMATIVO
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Biblioteca de Recursos Descargables</h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Accede a plantillas en PDF, guías de comunicación asertiva, audios de pausas conscientes y material complementario.
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

      {/* Grid */}
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
                ✓ Material formativo
              </span>
              <button
                onClick={() => alert(`Recurso preparado para estudio: ${item.title}`)}
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
