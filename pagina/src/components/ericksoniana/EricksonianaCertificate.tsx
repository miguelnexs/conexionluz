import React, { useRef } from 'react';
import { Award, Download, Printer, Sparkles, ShieldCheck } from 'lucide-react';

export default function EricksonianaCertificate({ studentName = 'Estudiante de Conexión Luz' }: { studentName?: string }) {
  const certRef = useRef<HTMLDivElement | null>(null);

  const issueDate = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const certificateCode = `CL-ERICKSONIAN-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Action Bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200/80 p-4 rounded-2xl shadow-2xs">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            📜 CERTIFICADO OFICIAL
          </span>
          <h3 className="text-sm font-black text-slate-900 mt-1">Certificado de Finalización de Programa</h3>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Printer className="h-4 w-4" /> Imprimir / Guardar PDF
        </button>
      </div>

      {/* Certificate Graphic Card */}
      <div
        ref={certRef}
        className="bg-white border-8 border-slate-900 rounded-3xl p-8 sm:p-14 text-center space-y-8 shadow-xl relative overflow-hidden max-w-4xl mx-auto"
      >
        {/* Background Decorative Seals */}
        <div className="absolute -top-12 -right-12 h-40 w-40 bg-emerald-50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 bg-indigo-50 rounded-full blur-2xl pointer-events-none" />

        {/* Certificate Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-emerald-800 font-black tracking-widest text-xs uppercase">
            <Sparkles className="h-4 w-4" /> PLATAFORMA EDUCATIVA CONEXIÓN LUZ <Sparkles className="h-4 w-4" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">
            CERTIFICADO DE FINALIZACIÓN
          </h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
            OTORGADO OFICIALMENTE A
          </p>
        </div>

        {/* Student Name */}
        <div className="py-2 border-b-2 border-emerald-600 inline-block px-8">
          <h2 className="text-2xl sm:text-4xl font-black text-emerald-950 capitalize font-serif tracking-wide">
            {studentName}
          </h2>
        </div>

        {/* Course Description */}
        <div className="max-w-2xl mx-auto space-y-3">
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
            Por haber completado satisfactoriamente la totalidad de las lecciones, laboratorios experienciales, talleres narrativos y evaluaciones del programa educativo:
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
              HIPNOSIS ERICKSONIANA
            </h3>
            <p className="text-xs text-slate-600 font-bold mt-0.5">
              "El arte de acompañar el cambio a través del lenguaje, la experiencia y el inconsciente"
            </p>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-600 max-w-2xl mx-auto">
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Duración Estimada</span>
            <span className="font-black text-slate-800">40 Horas Lectivas</span>
          </div>
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Fecha de Emisión</span>
            <span className="font-black text-slate-800">{issueDate}</span>
          </div>
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Código de Verificación</span>
            <span className="font-mono font-bold text-emerald-700">{certificateCode}</span>
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-8 flex items-center justify-around max-w-xl mx-auto border-t border-slate-200">
          <div className="space-y-1">
            <div className="font-serif italic text-base text-slate-800 font-bold">Dirección Académica</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Conexión Luz Chile / Colombia</div>
          </div>
          <div className="space-y-1">
            <ShieldCheck className="h-8 w-8 text-emerald-600 mx-auto" />
            <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Verificado por Conexión Luz</div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[10px] text-slate-500 leading-relaxed max-w-2xl mx-auto">
          <strong>Aviso Ético Legal:</strong> Este certificado acredita la culminación de un programa de formación educativa continua. No constituye por sí mismo licencia profesional regulada ni habilitación legal para ejercer una profesión sanitaria.
        </div>
      </div>
    </div>
  );
}
