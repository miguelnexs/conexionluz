import React from 'react';
import { 
  FolderDown, 
  FileText, 
  Sparkles, 
  Download, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Brain,
  Compass
} from 'lucide-react';

interface ResourceItem {
  id: string;
  title: string;
  category: 'Guía de Práctica' | 'Ficha de Trabajo' | 'Lectura Complementaria';
  description: string;
  format: string;
  pages: string;
  downloadName: string;
}

const RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Manual de Prácticas de Mediación: 5, 10 y 15 Minutos',
    category: 'Guía de Práctica',
    description: 'Protocolos paso a paso con las pautas de observación interna, externa y frases de anclaje para la vida diaria.',
    format: 'PDF Guía Oficial',
    pages: '12 páginas',
    downloadName: 'manual_practicas_mediacion_conexionluz.txt'
  },
  {
    id: 'res-2',
    title: 'Ficha de Registro del Observador del Pensamiento',
    category: 'Ficha de Trabajo',
    description: 'Plantilla imprimible de 8 columnas para el desglose metacognitivo de pensamientos automáticos e impulsos.',
    format: 'Plantilla Imprimible',
    pages: '4 páginas',
    downloadName: 'ficha_observador_pensamiento.txt'
  },
  {
    id: 'res-3',
    title: 'Bitácora del Reto de 21 Días de Mediación',
    category: 'Ficha de Trabajo',
    description: 'Cuaderno estructurado con las 21 tareas y espacios de reflexión diaria para el seguimiento de hábitos conscientes.',
    format: 'Cuaderno de Trabajo',
    pages: '24 páginas',
    downloadName: 'bitacora_reto_21_dias.txt'
  },
  {
    id: 'res-4',
    title: 'Exaptación Emocional: De la Reacción a la Metaconciencia',
    category: 'Lectura Complementaria',
    description: 'Ensayo pedagógico de ConexiónLuz sobre la utilización lúcida del sistema afectivo como fuente de información.',
    format: 'Ensayo Formativo',
    pages: '16 páginas',
    downloadName: 'ensayo_exaptacion_emocional.txt'
  },
  {
    id: 'res-5',
    title: 'El Decálogo de Mi Sistema de Mediación',
    category: 'Guía de Práctica',
    description: 'Guía de síntesis del Módulo 10 con las 10 preguntas maestras para consolidar tu práctica personal de por vida.',
    format: 'Ficha de Síntesis',
    pages: '6 páginas',
    downloadName: 'decalogo_sistema_mediacion.txt'
  }
];

export default function MAPBiblioteca() {
  const handleDownloadMock = (item: ResourceItem) => {
    const textContent = `CONEXIÓNLUZ — PROGRAMA DE MEDIACIÓN Y ATENCIÓN PLENA\n\nDocumento: ${item.title}\nCategoría: ${item.category}\nDescripción: ${item.description}\n\n=======================================================\nPRINCIPIO FUNDAMENTAL:\n"Observar lo que ocurre dentro de mí mientras observo lo que ocurre fuera de mí, reconociendo que ambas experiencias están ocurriendo en el presente."\n\nCONEXIÓNLUZ — OBSERVAR · COMPRENDER · INTEGRAR · RESPONDER\n=======================================================`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/20 border border-teal-400/30 text-teal-200 px-3.5 py-1 rounded-full flex items-center gap-1.5">
            <FolderDown className="h-3.5 w-3.5 text-teal-300" />
            RECURSOS FORMATIVOS DESCARGABLES
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Biblioteca y Materiales del Curso
        </h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Descarga las guías de práctica, plantillas de trabajo y lecturas complementarias para continuar profundizando en tu mediación en cualquier momento y lugar.
        </p>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {RESOURCES.map((r) => (
          <div
            key={r.id}
            className="bg-white border border-slate-200/90 hover:border-teal-400/90 rounded-3xl p-6 shadow-2xs transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-full">
                  {r.category}
                </span>
                <span className="text-[11px] font-bold text-slate-500">{r.pages}</span>
              </div>

              <h3 className="text-base font-black text-slate-900 leading-snug">{r.title}</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{r.description}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500">{r.format}</span>
              <button
                onClick={() => handleDownloadMock(r)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <Download className="h-3.5 w-3.5" /> Descargar Ficha
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
