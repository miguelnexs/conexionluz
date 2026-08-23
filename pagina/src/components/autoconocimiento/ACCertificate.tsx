import React, { useRef } from 'react';
import { Award, Printer, Heart, Sparkles, ShieldCheck } from 'lucide-react';

export default function ACCertificate({ studentName = 'Estudiante de Conexión Luz' }: { studentName?: string }) {
  const certRef = useRef<HTMLDivElement | null>(null);

  const issueDate = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const certificateCode = `CL-AC-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Action Bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200/80 p-4 rounded-2xl shadow-2xs">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
            📜 CERTIFICADO OFICIAL
          </span>
          <h3 className="text-sm font-black text-slate-900 mt-1">Certificado de Finalización de Programa</h3>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Printer className="h-4 w-4" /> Imprimir / Guardar PDF
        </button>
      </div>

      {/* Certificate Frame */}
      <div
        ref={certRef}
        className="bg-white border-8 border-slate-900 rounded-3xl p-8 sm:p-14 text-center space-y-8 shadow-xl relative overflow-hidden max-w-4xl mx-auto"
      >
        {/* Decorative Background */}
        <div className="absolute -top-12 -right-12 h-40 w-40 bg-indigo-50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 bg-purple-50 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-indigo-800 font-black tracking-widest text-xs uppercase">
            <Sparkles className="h-4 w-4" /> PLATAFORMA EDUCATIVA CONEXIÓN LUZ <Sparkles className="h-4 w-4" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">
            CERTIFICADO DE FINALIZACIÓN
          </h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
            OTORGADO CON DISTINCIÓN A
          </p>
        </div>

        {/* Student Name */}
        <div className="py-2 border-b-2 border-slate-200 inline-block px-10 min-w-[320px]">
          <h2 className="text-2xl sm:text-4xl font-black text-indigo-950 font-serif italic">
            {studentName}
          </h2>
        </div>

        {/* Certificate Text */}
        <div className="max-w-2xl mx-auto space-y-3">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            Por haber completado satisfactoriamente los 10 módulos formativos, evaluaciones teóricas, laboratorio interior de introspección, línea de vida interactiva y mapa maestro en:
          </p>
          <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl">
            <h3 className="text-lg sm:text-2xl font-black text-indigo-950 uppercase tracking-tight">
              AUTOCONOCIMIENTO
            </h3>
            <p className="text-xs text-indigo-800 font-medium mt-1">
              "Conócete, comprende tu mundo interior y construye una relación más consciente contigo mismo"
            </p>
          </div>
        </div>

        {/* Seals & Code */}
        <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">FECHA DE EMISIÓN</span>
            <p className="font-black text-slate-800">{issueDate}</p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="h-14 w-14 rounded-full bg-indigo-100 text-indigo-800 border-2 border-indigo-300 flex items-center justify-center font-black shadow-inner">
              <Award className="h-7 w-7" />
            </div>
            <span className="text-[9px] font-black uppercase text-indigo-800 tracking-wider">80 HORAS FORMATIVAS</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CÓDIGO DE VERIFICACIÓN</span>
            <p className="font-mono font-black text-slate-800 tracking-wider">{certificateCode}</p>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[10px] text-slate-600 leading-normal max-w-xl mx-auto">
            Este certificado acredita la culminación de un programa formativo de educación continua en Conexión Luz. No constituye título universitario oficial ni habilitación sanitaria regulada para el ejercicio de la psicología clínica.
          </p>
        </div>
      </div>
    </div>
  );
}
