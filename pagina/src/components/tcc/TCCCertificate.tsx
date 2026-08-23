import React, { useRef } from 'react';
import { Award, Download, Printer, Sparkles, ShieldCheck, Brain } from 'lucide-react';

export default function TCCCertificate({ studentName = 'Estudiante de Conexión Luz' }: { studentName?: string }) {
  const certRef = useRef<HTMLDivElement | null>(null);

  const issueDate = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const certificateCode = `CL-CBT-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Action Bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200/80 p-4 rounded-2xl shadow-2xs">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
            📜 CERTIFICADO OFICIAL
          </span>
          <h3 className="text-sm font-black text-slate-900 mt-1">Certificado de Finalización de Programa</h3>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
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
        <div className="absolute -top-12 -right-12 h-40 w-40 bg-teal-50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 bg-blue-50 rounded-full blur-2xl pointer-events-none" />

        {/* Certificate Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-teal-800 font-black tracking-widest text-xs uppercase">
            <Brain className="h-4 w-4" /> PLATAFORMA EDUCATIVA CONEXIÓN LUZ <Brain className="h-4 w-4" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">
            CERTIFICADO DE FINALIZACIÓN
          </h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
            OTORGADO OFICIALMENTE A
          </p>
        </div>

        {/* Student Name */}
        <div className="py-2 border-b-2 border-slate-200 inline-block px-10 min-w-[320px]">
          <h2 className="text-2xl sm:text-4xl font-black text-teal-900 font-serif italic">
            {studentName}
          </h2>
        </div>

        {/* Certificate Body Text */}
        <div className="max-w-2xl mx-auto space-y-3">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            Por haber completado satisfactoriamente los 10 módulos académicos, evaluaciones teóricas, laboratorio práctico y formulación de casos del programa educativo especializado:
          </p>
          <div className="p-4 bg-teal-50/80 border border-teal-200 rounded-2xl">
            <h3 className="text-lg sm:text-2xl font-black text-teal-950 uppercase tracking-tight">
              TERAPIA COGNITIVO-CONDUCTUAL (TCC)
            </h3>
            <p className="text-xs text-teal-800 font-medium mt-1">
              "Comprende la relación entre pensamientos, emociones, conductas y consecuencias"
            </p>
          </div>
        </div>

        {/* Details & Seals */}
        <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">FECHA DE EMISIÓN</span>
            <p className="font-black text-slate-800">{issueDate}</p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="h-14 w-14 rounded-full bg-teal-100 text-teal-800 border-2 border-teal-300 flex items-center justify-center font-black shadow-inner">
              <Award className="h-7 w-7" />
            </div>
            <span className="text-[9px] font-black uppercase text-teal-800 tracking-wider">80 HORAS LECTIVAS</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CÓDIGO DE VERIFICACIÓN</span>
            <p className="font-mono font-black text-slate-800 tracking-wider">{certificateCode}</p>
          </div>
        </div>

        {/* Educational Disclaimer Footer */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[10px] text-slate-600 leading-normal max-w-xl mx-auto">
            Este certificado acredita la finalización de un programa de formación educativa continua en Conexión Luz. No constituye título universitario oficial, licencia sanitaria ni habilitación profesional para el ejercicio de la psicología clínica reglada.
          </p>
        </div>
      </div>
    </div>
  );
}
