import React, { useRef, useState } from 'react';
import { 
  Award, 
  Download, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  User,
  QrCode
} from 'lucide-react';

interface CertificateProps {
  studentName?: string;
}

export default function MAPCertificate({ studentName = 'Estudiante de ConexiónLuz' }: CertificateProps) {
  const [customName, setCustomName] = useState(studentName);
  const [isEditing, setIsEditing] = useState(false);
  const certRef = useRef<HTMLDivElement | null>(null);

  const verificationCode = 'CL-MAP-' + Math.floor(100000 + Math.random() * 900000);
  const issueDate = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Controls */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/20 border border-teal-400/30 text-teal-200 px-3.5 py-1 rounded-full flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-teal-300" />
            ACREDITACIÓN DE FINALIZACIÓN
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold bg-white/10 hover:bg-white/20 text-teal-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              {isEditing ? 'Guardar Nombre' : 'Editar Nombre'}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs font-black shadow-sm transition-all cursor-pointer"
            >
              <Printer className="h-4 w-4" /> Imprimir / Guardar PDF
            </button>
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Certificado Oficial de Finalización
        </h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Has completado satisfactoriamente los 10 módulos, las prácticas guiadas de mediación, el diario reflexivo y el laboratorio de metaconciencia.
        </p>

        {isEditing && (
          <div className="mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 max-w-md">
            <label className="text-xs font-bold text-teal-200 block mb-1">Nombre completo para el certificado:</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full p-2.5 bg-white text-slate-900 font-bold rounded-xl text-sm"
            />
          </div>
        )}
      </div>

      {/* Printable Certificate Frame */}
      <div 
        ref={certRef}
        className="bg-white border-8 border-slate-900 rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden select-text text-center space-y-8 print:border-4 print:p-8 print:shadow-none print:m-0"
      >
        {/* Subtle Watermark and Decorative Borders */}
        <div className="absolute inset-2 border-2 border-teal-600/30 rounded-2xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center justify-center gap-2 text-teal-700 font-black text-xs uppercase tracking-widest bg-teal-50 border border-teal-100 px-4 py-1 rounded-full shadow-2xs">
            <Sparkles className="h-4 w-4" /> CONEXIÓNLUZ · COMUNIDAD DE CONCIENCIA
          </div>
          <h3 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-slate-900 uppercase pt-2">
            Certificado de Finalización
          </h3>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
            Programa de Formación y Práctica Consciente
          </p>
        </div>

        {/* Student Name */}
        <div className="space-y-2 relative z-10 py-2">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Se otorga el presente reconocimiento a:
          </p>
          <div className="text-2xl sm:text-4xl font-serif font-black text-teal-950 border-b-2 border-slate-300 max-w-xl mx-auto pb-2">
            {customName || 'Estudiante ConexiónLuz'}
          </div>
        </div>

        {/* Course Description */}
        <div className="max-w-2xl mx-auto space-y-3 relative z-10 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
          <p>
            Por haber completado con éxito la totalidad de los contenidos, prácticas de simultaneidad, laboratorio de metaconciencia y evaluaciones del programa:
          </p>
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 text-teal-950 font-black text-base sm:text-lg">
            MEDIACIÓN Y ATENCIÓN PLENA
            <span className="block text-xs font-semibold text-teal-800 mt-1">
              "Observación interna y externa de la realidad presente a través de la conciencia"
            </span>
          </div>
        </div>

        {/* Signatures & Seal */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end pt-6 relative z-10 max-w-2xl mx-auto border-t border-slate-100">
          <div className="space-y-1">
            <div className="font-script text-lg text-slate-800 italic">ConexiónLuz Académica</div>
            <div className="border-t border-slate-300 pt-1 text-[11px] font-bold text-slate-600">
              Dirección de Formación
            </div>
          </div>

          {/* Golden Seal Badge */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 border-4 border-white shadow-md flex items-center justify-center text-slate-950">
              <Award className="h-10 w-10 text-white" />
            </div>
            <span className="text-[10px] font-black uppercase text-amber-800 mt-1 tracking-wider">
              VALIDADO
            </span>
          </div>

          <div className="space-y-1 text-right sm:text-right">
            <p className="text-[11px] font-bold text-slate-700">Fecha de Emisión:</p>
            <p className="text-xs font-semibold text-slate-900">{issueDate}</p>
            <p className="text-[10px] text-slate-400 font-mono">Código: {verificationCode}</p>
          </div>
        </div>

        {/* Disclaimer Footer */}
        <div className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-xl mx-auto pt-4 relative z-10 border-t border-slate-100">
          Este certificado acredita exclusivamente la finalización del programa educativo impartido por ConexiónLuz. No constituye título profesional de grado, certificación de psicoterapia clínica ni acreditación médica sanitaria.
        </div>
      </div>
    </div>
  );
}
