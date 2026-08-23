import React, { useRef } from 'react';
import { Award, Download, Printer, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface AutohipnosisCertificateProps {
  studentName: string;
  completionDate?: string;
  certificateCode?: string;
}

export default function AutohipnosisCertificate({
  studentName,
  completionDate = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
  certificateCode = `CL-AUTH-${Math.floor(100000 + Math.random() * 900000)}`
}: AutohipnosisCertificateProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 select-text max-w-4xl mx-auto">
      
      {/* Actions Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
          <Award className="h-5 w-5 text-amber-500" />
          <span>Certificado Digital Oficial Conexión Luz</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4" /> Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      {/* Official Certificate Visual Display Frame */}
      <div 
        ref={printRef}
        className="bg-gradient-to-br from-amber-50/60 via-white to-indigo-50/50 text-slate-900 rounded-3xl p-8 sm:p-14 border-8 border-amber-400/60 relative overflow-hidden shadow-xl space-y-8 text-center select-text"
      >
        
        {/* Certificate Decorative Glow & Borders */}
        <div className="absolute inset-2 border-2 border-amber-300/40 rounded-2xl pointer-events-none" />

        {/* Header Logo */}
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 text-amber-800 text-xs font-black uppercase tracking-widest bg-amber-100 border border-amber-200 px-4 py-1.5 rounded-full shadow-2xs">
            <Sparkles className="h-4 w-4 text-amber-600" /> CONEXIÓN LUZ · ACADEMIA DIGITAL
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-widest text-amber-900 uppercase pt-2">
            CERTIFICADO DE FINALIZACIÓN
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Otorgado con Excelencia Académica</p>
        </div>

        {/* Recipient Statement */}
        <div className="space-y-4 relative z-10 max-w-2xl mx-auto">
          <p className="text-sm text-slate-600 font-medium italic">Se certifica formalmente que:</p>
          
          <div className="text-3xl sm:text-5xl font-black text-indigo-950 border-b-2 border-amber-400/60 pb-3 tracking-tight">
            {studentName || "Estudiante de Conexión Luz"}
          </div>

          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            Ha completado satisfactoriamente los 8 módulos del programa profesional de formación:
          </p>

          <div className="bg-white border border-amber-300/80 rounded-2xl p-4 sm:p-6 space-y-1 shadow-2xs">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              CURSO DE AUTOHIPNOSIS
            </h3>
            <p className="text-xs text-indigo-800 font-bold italic">
              "Aprende a transformar tu diálogo interno y dirigir tu mente"
            </p>
          </div>
        </div>

        {/* Certificate Details Footer */}
        <div className="pt-6 border-t border-amber-200/80 relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600">
          
          <div className="space-y-1 text-center sm:text-left">
            <span className="font-bold uppercase text-[10px] text-slate-400 block">Fecha de Emisión</span>
            <span className="text-slate-900 font-bold">{completionDate}</span>
          </div>

          <div className="space-y-1 text-center">
            <span className="font-bold uppercase text-[10px] text-slate-400 block">Intensidad Horaria</span>
            <span className="text-slate-900 font-bold">20 Horas Teórico-Prácticas</span>
          </div>

          <div className="space-y-1 text-center sm:text-right">
            <span className="font-bold uppercase text-[10px] text-slate-400 block">Código de Verificación</span>
            <span className="text-amber-800 font-mono font-bold">{certificateCode}</span>
          </div>

        </div>

        {/* Verification Seal Badge */}
        <div className="pt-4 flex items-center justify-center gap-2 text-xs font-bold text-emerald-700">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <span>Documento Digital Verificado y Firmado Digitalmente por Conexión Luz</span>
        </div>

      </div>

    </div>
  );
}
