import React, { useState } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  ChevronRight, 
  Brain, 
  Eye, 
  ArrowRight, 
  CheckCircle2,
  Users,
  Compass
} from 'lucide-react';

interface Caso {
  id: number;
  titulo: string;
  contexto: string;
  icono: string;
  protagonista: string;
  desafio: string;
  reaccionAutomatica: string;
  procesoMediacion: {
    interno: string;
    externo: string;
    metacognicion: string;
    exaptacion: string;
  };
  respuestaConsciente: string;
  aprendizajeClave: string;
}

const CASOS: Caso[] = [
  {
    id: 1,
    titulo: 'Caso 1: Tensión y Desacuerdo en Reunión de Equipo',
    contexto: 'Ámbito Laboral & Comunicación',
    icono: '💼',
    protagonista: 'Carlos (Líder de Proyecto)',
    desafio: 'Durante la presentación del cronograma, un colega cuestiona duramente sus estimaciones frente al director general.',
    reaccionAutomatica: 'Interrumpir a la defensiva, levantar el tono de voz, descalificar el comentario ajeno y quedar rumiando rencor el resto del día.',
    procesoMediacion: {
      interno: 'Observa calor en las mejillas, taquicardia y el pensamiento: "Quiere hacerme quedar en ridículo".',
      externo: 'Observa la mirada de los demás, el proyector encendido y el silencio expectante de la sala.',
      metacognicion: 'Se dice mentalmente: "Estoy interpretando su crítica como un ataque personal. ¿Es un hecho o una opinión?".',
      exaptacion: 'Usa la energía de la indignación como señal de su compromiso con la calidad y la prepara para responder con solidez.'
    },
    respuestaConsciente: 'Hace una pausa de 3 segundos, respira despacio y responde: "Entiendo tu preocupación por los tiempos. Revisemos juntos los supuestos de la fase 2 para ajustar lo que sea necesario".',
    aprendizajeClave: 'La pausa de mediación transforma un posible choque destructivo en una demostración de liderazgo sereno.'
  },
  {
    id: 2,
    titulo: 'Caso 2: El Mensaje sin Responder y la Rumiación Afectiva',
    contexto: 'Relaciones Personales & Vínculos',
    icono: '💬',
    protagonista: 'Elena (Diseñadora Gráfica)',
    desafio: 'Su pareja no responde un mensaje importante tras 4 horas habiendo estado en línea en la aplicación.',
    reaccionAutomatica: 'Enviar múltiples signos de interrogación, asumir desinterés, sentirse rechazada y armar un reclamo agresivo por mensaje.',
    procesoMediacion: {
      interno: 'Nota vacío en el estómago y el pensamiento: "Ya no le importo". Nombra la emoción: inseguridad y miedo.',
      externo: 'Registra la pantalla de su teléfono, la luz del atardecer en su escritorio y el trabajo pendiente.',
      metacognicion: 'Reconoce: "Estoy fusionada con la suposición de abandono. No tengo pruebas de por qué no ha contestado".',
      exaptacion: 'Acoge la vulnerabilidad que siente y decide cuidar de sí misma en lugar de perseguir una confirmación ansiosa.'
    },
    respuestaConsciente: 'Deja el teléfono a un lado, sale a caminar 10 minutos notando el aire fresco y decide conversar tranquilamente en persona por la noche.',
    aprendizajeClave: 'Diferenciar entre lo que ocurre afuera (un mensaje no respondido) y lo que inventa la mente adentro (un guión de catástrofe).'
  },
  {
    id: 3,
    titulo: 'Caso 3: Congestión Vial y Tiempo de Espera',
    contexto: 'Vida Cotidiana & Tráfico',
    icono: '🚗',
    protagonista: 'Martín (Consultor Independiente)',
    desafio: 'Queda atrapado en un embotellamiento severo rumbo a una cita médica y el GPS marca 35 minutos de retraso.',
    reaccionAutomatica: 'Tocar la bocina furiosamente, insultar al tráfico, subir la presión arterial y arruinarse la mañana.',
    procesoMediacion: {
      interno: 'Siente la mandíbula apretada y el impulso de acelerar bruscamente.',
      externo: 'Observa la fila interminable de autos, el sonido de los motores y el cielo nublado.',
      metacognicion: 'Observa el pensamiento: "Esto no debería estar pasando". Reconoce que enojarse no moverá los autos ni un milímetro.',
      exaptacion: 'Convierte el tiempo de espera forzado en una oportunidad para practicar mediación somática y escuchar una clase formativa.'
    },
    respuestaConsciente: 'Avisa con calma a la clínica por manos libres, relaja los hombros en el respaldo y practica respiración diafragmática.',
    aprendizajeClave: 'Cuando no puedes cambiar la realidad externa, la mediación te permite gobernar tu realidad interna.'
  }
];

export default function MAPCasosEstudio() {
  const [selectedCasoId, setSelectedCasoId] = useState<number>(1);

  const activeCaso = CASOS.find((c) => c.id === selectedCasoId) || CASOS[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/20 border border-teal-400/30 text-teal-200 px-3.5 py-1 rounded-full flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-teal-300" />
            APLICACIÓN REAL EN EL DÍA A DÍA
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Casos de Estudio de Mediación
        </h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Analiza cómo personas reales aplican la observación interna, externa y la metaconciencia para desactivar la reactividad automática en situaciones de alta exigencia.
        </p>
      </div>

      {/* Cases Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {CASOS.map((c) => {
          const isSelected = c.id === selectedCasoId;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCasoId(c.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                  : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl">{c.icono}</span>
                  <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                    {c.contexto}
                  </span>
                </div>
                <h3 className="text-xs font-black text-slate-900 mt-2">{c.titulo}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{c.desafio}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Case Deep Dive Box */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{activeCaso.icono}</span>
            <div>
              <span className="text-[10px] font-black uppercase text-teal-700">
                Protagonista: {activeCaso.protagonista}
              </span>
              <h3 className="text-xl font-black text-slate-900">{activeCaso.titulo}</h3>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {activeCaso.contexto}
          </span>
        </div>

        {/* Desafío y Reacción Automática */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 text-xs">
            <span className="font-black text-slate-900 uppercase block">Desafío Crítico</span>
            <p className="text-slate-700 font-medium leading-relaxed">{activeCaso.desafio}</p>
          </div>
          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-1 text-xs">
            <span className="font-black text-rose-900 uppercase block">Reacción Automática Habitual (Sin Mediación)</span>
            <p className="text-rose-950 font-medium leading-relaxed">{activeCaso.reaccionAutomatica}</p>
          </div>
        </div>

        {/* Proceso de Mediación ConexiónLuz */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-700">
            Aplicación de la Mediación ConexiónLuz
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
            <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1">
              <span className="font-black text-indigo-900 block">🧠 1. Observación Interna</span>
              <p className="text-indigo-800">{activeCaso.procesoMediacion.interno}</p>
            </div>
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-1">
              <span className="font-black text-emerald-900 block">🌍 2. Observación Externa</span>
              <p className="text-emerald-800">{activeCaso.procesoMediacion.externo}</p>
            </div>
            <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-xl space-y-1">
              <span className="font-black text-purple-900 block">🔍 3. Metacognición</span>
              <p className="text-purple-800">{activeCaso.procesoMediacion.metacognicion}</p>
            </div>
            <div className="p-3.5 bg-teal-50/70 border border-teal-100 rounded-xl space-y-1">
              <span className="font-black text-teal-900 block">🧬 4. Exaptación Emocional</span>
              <p className="text-teal-800">{activeCaso.procesoMediacion.exaptacion}</p>
            </div>
          </div>
        </div>

        {/* Respuesta Consciente & Aprendizaje */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-xs">
            <span className="font-black text-emerald-950 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Respuesta Consciente Resultante
            </span>
            <p className="text-emerald-900 font-semibold leading-relaxed">
              {activeCaso.respuestaConsciente}
            </p>
          </div>
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-1 text-xs">
            <span className="font-black text-teal-950 uppercase flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-teal-600" /> Aprendizaje Clave
            </span>
            <p className="text-teal-900 font-semibold leading-relaxed">
              {activeCaso.aprendizajeClave}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
