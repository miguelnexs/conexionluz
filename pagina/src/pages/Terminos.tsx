import React from 'react';
import PublicLayout from '@/components/PublicLayout';
import { FileText, RefreshCw, AlertTriangle, CheckCircle2, XCircle, Scale, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    icon: CheckCircle2,
    color: '#10b981',
    title: '1. Aceptación de los Términos y Condiciones',
    content: `Al acceder, registrarse o utilizar la plataforma ConexiónLuz (en adelante, "la Plataforma"), usted (en adelante, "el Usuario") acepta expresamente quedar sujeto a los presentes Términos y Condiciones, así como a nuestra Política de Privacidad. Si no está de acuerdo con la totalidad de estos términos, debe abstenerse de utilizar la Plataforma y sus servicios.

Estos Términos constituyen un contrato legalmente vinculante entre el Usuario y ConexiónLuz. Nos reservamos el derecho de modificar o actualizar estos términos en cualquier momento. Las modificaciones entrarán en vigencia de manera inmediata tras su publicación en la Plataforma. Es responsabilidad del Usuario revisar periódicamente estos términos para estar al tanto de cualquier cambio.`,
  },
  {
    icon: AlertTriangle,
    color: '#ef4444',
    title: '2. Naturaleza del Servicio y Exención de Responsabilidad Médica',
    content: `**Aviso Importante:** ConexiónLuz NO es un proveedor de servicios médicos de emergencia ni sustituye la atención médica psiquiátrica de urgencia.

La Plataforma facilita el contacto entre usuarios y profesionales independientes del bienestar emocional, psicológico y terapéutico. Las herramientas de autogestión (diario emocional, tests, meditaciones) son de carácter estrictamente educativo y de apoyo personal, y **en ningún caso constituyen un diagnóstico clínico, tratamiento médico o psicológico profesional**.

**Exención de Responsabilidad:** ConexiónLuz no asume responsabilidad alguna por las decisiones tomadas por el Usuario basadas en la información, servicios o herramientas proporcionadas en la Plataforma. Si usted está experimentando una crisis, tiene pensamientos suicidas o se encuentra en una situación de riesgo inminente, debe comunicarse inmediatamente con los servicios de emergencia de su localidad (ej. 123 en Colombia) o acudir al centro médico más cercano.`,
  },
  {
    icon: FileText,
    color: '#6366f1',
    title: '3. Registro, Cuentas de Usuario y Privacidad',
    content: `Para acceder a determinados servicios, el Usuario deberá registrarse creando una cuenta. Al hacerlo, se compromete a:

- **Veracidad:** Proporcionar información precisa, actual y completa, incluyendo nombre legal e historial médico básico si es requerido para las consultas.
- **Confidencialidad:** Mantener la total seguridad y confidencialidad de sus contraseñas. El Usuario es el único responsable de todas las actividades que ocurran bajo su cuenta.
- **Uso Personal:** La cuenta es personal e intransferible. Queda estrictamente prohibido compartir el acceso con terceros.

**Protección de Datos:** El manejo de sus datos personales y sensibles (incluyendo notas de sesiones y registros emocionales) está regido por nuestra Política de Privacidad, cumpliendo con la normatividad de protección de datos (Ley 1581 de 2012 en Colombia). Los terapeutas están sujetos al secreto profesional y acuerdos de confidencialidad estrictos.`,
  },
  {
    icon: XCircle,
    color: '#f59e0b',
    title: '4. Normas de Conducta y Usos Prohibidos',
    content: `El Usuario acepta utilizar la Plataforma de buena fe y de manera lícita. Queda terminantemente prohibido:

1. Utilizar la Plataforma para cualquier fin ilegal, fraudulento o no autorizado.
2. Acosar, intimidar, amenazar o discriminar a terapeutas, personal de soporte u otros usuarios (especialmente en foros comunitarios).
3. Publicar o transmitir contenido difamatorio, obsceno, ofensivo, que incite al odio o viole los derechos de terceros.
4. Intentar vulnerar la seguridad del sistema, introducir virus, malware o utilizar técnicas de scraping para extraer información de la base de datos.
5. Grabar o reproducir las sesiones de terapia o conversatorios sin el consentimiento expreso y por escrito del terapeuta y los demás participantes.

ConexiónLuz se reserva el derecho de suspender o cancelar de forma permanente, sin previo aviso ni derecho a reembolso, la cuenta de cualquier Usuario que viole estas normas.`,
  },
  {
    icon: Scale,
    color: '#ec4899',
    title: '5. Pagos, Suscripciones, Cancelaciones y Reembolsos',
    content: `**Procesamiento de Pagos:** Todos los pagos se realizan a través de pasarelas de pago seguras de terceros (ej. MercadoPago). ConexiónLuz no almacena datos de tarjetas de crédito.

**Política de Cancelación de Citas:**
- **Cancelaciones tempranas:** Si cancela o reprograma con al menos 24 horas de antelación a la sesión programada, no habrá penalidad y podrá agendar una nueva fecha.
- **Cancelaciones tardías:** Las cancelaciones con menos de 24 horas de anticipación generarán un cargo del 50% del valor de la sesión.
- **Inasistencia (No-show):** La inasistencia a la sesión sin previo aviso resultará en la pérdida total (100%) del valor abonado. Se considera inasistencia si el Usuario no se presenta tras 15 minutos de iniciada la sesión.

**Reembolsos y Garantías:**
- En caso de que el terapeuta no se presente a la sesión por problemas técnicos de la plataforma o fuerza mayor, se ofrecerá la reprogramación sin costo o el reembolso íntegro (100%) a petición del Usuario.
- Los cursos digitales, herramientas descargables y membresías activas no son reembolsables una vez consumido o descargado el contenido, salvo que exista una falla demostrable en la plataforma que impida el acceso.`,
  },
  {
    icon: FileText,
    color: '#0ea5e9',
    title: '6. Propiedad Intelectual',
    content: `Todos los contenidos, diseños, textos, gráficos, logotipos, íconos, código fuente, algoritmos, cursos, audios y videos presentes en ConexiónLuz son propiedad exclusiva de la Plataforma o de sus licenciantes, y están protegidos por las leyes internacionales y locales de propiedad intelectual y derechos de autor.

**Restricciones:** 
Queda expresamente prohibida la reproducción, copia, distribución, comercialización, transformación o ingeniería inversa de cualquier elemento de la Plataforma sin la autorización explícita y por escrito de ConexiónLuz. 

**Contenido Generado por el Usuario:** Al publicar en foros o testimonios, el Usuario otorga a ConexiónLuz una licencia mundial, perpetua, irrevocable y libre de regalías para utilizar, reproducir y adaptar dicho contenido estrictamente dentro de la Plataforma.`,
  },
  {
    icon: Scale,
    color: '#8b5cf6',
    title: '7. Limitación de Responsabilidad y Relación con los Terapeutas',
    content: `**Profesionales Independientes:** Los terapeutas y facilitadores que prestan servicios a través de la Plataforma son profesionales independientes y no son empleados directos de ConexiónLuz. La Plataforma actúa únicamente como intermediario tecnológico.

**Alcance de Responsabilidad:** En la máxima medida permitida por la ley aplicable, ConexiónLuz, sus directores, empleados o afiliados no serán responsables de ningún daño directo, indirecto, incidental, consecuente, especial o punitivo (incluyendo lucro cesante, pérdida de datos o agravamiento de condiciones médicas) que resulte de:
- El uso o la imposibilidad de usar la Plataforma.
- El consejo, asesoramiento, mala praxis o acciones de los terapeutas.
- Acceso no autorizado o alteración de las transmisiones de datos por terceros ajenos a la Plataforma.

El Usuario comprende y acepta que la responsabilidad máxima total de ConexiónLuz derivada de cualquier reclamación relacionada con los servicios no excederá la cantidad total pagada por el Usuario a la Plataforma en los tres (3) meses anteriores al evento.`,
  },
  {
    icon: CheckCircle2,
    color: '#10b981',
    title: '8. Ley Aplicable y Resolución de Controversias',
    content: `La validez, interpretación y ejecución de los presentes Términos y Condiciones se regirán por las leyes vigentes de la República de Colombia.

Cualquier disputa, controversia o reclamo que surja de, o esté relacionado con el uso de la Plataforma, se resolverá en primera instancia de manera directa y amigable entre las partes mediante nuestro canal oficial: **legal@conexionluz.com**.

Si transcurridos treinta (30) días calendario no se ha logrado un acuerdo, las partes acuerdan someter la controversia a los jueces y tribunales competentes de la ciudad de Bogotá, D.C., Colombia, renunciando expresamente a cualquier otro fuero que pudiera corresponderles en razón de sus domicilios presentes o futuros.`,
  },
];

export default function TerminosPage() {
  const [activeSection, setActiveSection] = React.useState(0);

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl mb-8 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900 p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(45deg, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-between items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
                <FileText className="h-4 w-4 text-sky-400" />
                <span className="text-sm font-bold">Marco legal</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3">Términos y Condiciones</h1>
              <p className="text-white/70 text-base max-w-md leading-relaxed">
                Las condiciones que rigen el uso de nuestra plataforma. Escritas con claridad para proteger a ambas partes.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 text-xs text-white/50 bg-black/20 p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="font-bold">Última actualización:</span>
              </div>
              <span className="text-white/80">Agosto 2026</span>
            </div>
          </div>
        </div>

        {/* Emergency alert */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 leading-relaxed">
            <strong>⚠️ En caso de emergencia:</strong> ConexiónLuz NO es un servicio de crisis. Si estás en peligro o tienes pensamientos de hacerte daño, llama al <strong>123</strong> (Colombia) o acude al servicio de urgencias más cercano inmediatamente.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Sidebar / Index */}
          <div className="w-full md:w-1/3 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-24">
              <h2 className="font-black text-slate-700 text-sm mb-4 uppercase tracking-widest border-b border-slate-100 pb-3">Índice Legal</h2>
              <div className="space-y-1.5">
                {SECTIONS.map((s, i) => {
                  const Icon = s.icon;
                  const isActive = activeSection === i;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveSection(i);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left group ${
                        isActive ? 'bg-slate-50 border border-slate-200 shadow-sm' : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${isActive ? '' : 'opacity-60 group-hover:opacity-100'}`} style={{ color: s.color }} />
                      <span className={`text-sm ${isActive ? 'font-bold text-slate-800' : 'font-medium text-slate-500 group-hover:text-slate-700'}`}>
                        {s.title}
                      </span>
                    </button>
                  );
                })}
              </div>
              
              {/* CTA */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <p className="text-slate-500 text-xs mb-3 font-medium">¿Tienes dudas legales?</p>
                <Link to="/contacto" className="inline-flex items-center justify-center gap-2 w-full bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-slate-700 transition-colors shadow-md text-sm">
                  Contactar Soporte <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
              <div className="flex items-center gap-3 px-6 md:px-8 py-5 border-b border-slate-50 bg-slate-50/50">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner bg-white border border-slate-100">
                  {React.createElement(SECTIONS[activeSection].icon, { className: "h-5 w-5", style: { color: SECTIONS[activeSection].color } })}
                </div>
                <h3 className="font-black text-xl text-slate-800">{SECTIONS[activeSection].title}</h3>
              </div>
              
              <div className="px-6 md:px-8 py-6 md:py-8 space-y-4">
                {SECTIONS[activeSection].content.split('\n').map((line, j) => {
                  const trimmed = line.trim();
                  
                  if (trimmed === '') return <div key={j} className="h-2" />;
                  
                  if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.slice(2, -2).includes('**')) {
                    return <h4 key={j} className="font-black text-slate-800 mt-6 mb-2 text-base">{trimmed.slice(2, -2)}</h4>;
                  }
                  
                  if (trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
                    const isNumbered = /^\d+\.\s/.test(trimmed);
                    const content = isNumbered ? trimmed.replace(/^\d+\.\s/, '') : trimmed.slice(2);
                    const parts = content.split(/\*\*(.*?)\*\*/g);
                    return (
                      <div key={j} className="flex gap-3 text-sm text-slate-600 leading-relaxed ml-2 mb-2">
                        <span className="text-slate-400 shrink-0 select-none">{isNumbered ? trimmed.match(/^\d+\./)?.[0] : '•'}</span>
                        <span>
                          {parts.map((p, k) => k % 2 === 1 ? <strong key={k} className="text-slate-800 font-bold">{p}</strong> : p)}
                        </span>
                      </div>
                    );
                  }
                  
                  const parts = trimmed.split(/\*\*(.*?)\*\*/g);
                  return (
                    <p key={j} className="text-sm md:text-base text-slate-600 leading-relaxed">
                      {parts.map((p, k) => k % 2 === 1 ? <strong key={k} className="text-slate-800 font-bold">{p}</strong> : p)}
                    </p>
                  );
                })}
              </div>

              {/* Navigation Footer */}
              <div className="px-6 md:px-8 py-4 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <button 
                  onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                  disabled={activeSection === 0}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-500 flex items-center gap-1 transition-colors"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" /> Anterior
                </button>
                <button 
                  onClick={() => setActiveSection(Math.min(SECTIONS.length - 1, activeSection + 1))}
                  disabled={activeSection === SECTIONS.length - 1}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 disabled:opacity-30 disabled:hover:text-sky-600 flex items-center gap-1 transition-colors"
                >
                  Siguiente <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </PublicLayout>
  );
}
