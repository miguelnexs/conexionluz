import React from 'react';
import PublicLayout from '@/components/PublicLayout';
import { FileText, RefreshCw, AlertTriangle, CheckCircle2, XCircle, Scale, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    icon: CheckCircle2,
    color: '#10b981',
    title: '1. Aceptación de los términos',
    content: `Al acceder y utilizar la plataforma ConexiónLuz (en adelante, "la Plataforma"), aceptas quedar vinculado por estos Términos y Condiciones de uso. Si no estás de acuerdo con alguno de estos términos, te pedimos que no utilices la Plataforma.

Estos términos aplican a todos los visitantes, usuarios registrados y personas que accedan a los servicios de ConexiónLuz, ya sea a través del sitio web, aplicaciones móviles o cualquier otro canal digital de nuestra plataforma.`,
  },
  {
    icon: FileText,
    color: '#6366f1',
    title: '2. Descripción de los servicios',
    content: `ConexiónLuz ofrece los siguientes servicios:

**Servicios gratuitos:**
- Acceso al blog y artículos de bienestar
- Herramientas de autoconocimiento (tests orientativos, ejercicios, diario emocional)
- Participación en el foro comunitario
- Lectura de historias y testimonios

**Servicios de pago:**
- Sesiones de psicoterapia individual (presencial o virtual)
- Sesiones de terapia de pareja o familiar
- Cursos y talleres especializados
- Membresías con beneficios adicionales

**Importante:** Las herramientas de Actividades (tests, ejercicios, diario) son recursos de apoyo y NO constituyen terapia psicológica ni diagnóstico clínico.`,
  },
  {
    icon: AlertTriangle,
    color: '#f59e0b',
    title: '3. Obligaciones del usuario',
    content: `Al usar la Plataforma, el usuario se compromete a:

- Proporcionar información veraz y actualizada en su registro
- Mantener la confidencialidad de sus credenciales de acceso
- No compartir su cuenta con terceros
- Respetar a otros miembros de la comunidad en el foro y espacios participativos
- No publicar contenido ofensivo, difamatorio o que viole derechos de terceros
- No intentar acceder de forma no autorizada a secciones restringidas
- Notificar inmediatamente cualquier uso no autorizado de su cuenta

**Uso prohibido:** Está terminantemente prohibido usar la Plataforma para actividades ilegales, spam, acoso, suplantación de identidad o cualquier actividad que perjudique a otros usuarios.`,
  },
  {
    icon: Scale,
    color: '#ec4899',
    title: '4. Alcance y limitaciones del servicio',
    content: `**ConexiónLuz NO es un servicio de emergencias.** En caso de crisis o emergencia de salud mental, contacta los servicios de emergencia locales (123 en Colombia) o líneas de crisis disponibles 24/7.

**Limitaciones del servicio:**
- Los terapeutas ofrecen psicoterapia, no diagnóstico médico
- No prescribimos medicamentos (servicio exclusivo de psiquiatría)
- Las herramientas de autogestión son complementos, no reemplazos terapéuticos
- La disponibilidad de terapeutas está sujeta a su agenda

**Garantías:** Nos comprometemos a la calidad de nuestros servicios, pero no podemos garantizar resultados específicos en el proceso terapéutico, ya que estos dependen de múltiples factores individuales.`,
  },
  {
    icon: XCircle,
    color: '#ef4444',
    title: '5. Cancelaciones y reembolsos',
    content: `**Política de cancelación de citas:**
- Cancelación con más de 24 horas de anticipación: sin cargo
- Cancelación con 12-24 horas de anticipación: cargo del 50%
- Cancelación con menos de 12 horas o inasistencia: cargo del 100%

**Reembolsos:**
- Las sesiones no realizadas por falla del terapeuta o plataforma se reembolsan al 100%
- Los cursos adquiridos pueden reembolsarse dentro de los 7 días posteriores a la compra si no se ha accedido a más del 20% del contenido
- Las membresías pueden cancelarse en cualquier momento; no se reembolsa el período ya transcurrido

Para solicitar un reembolso, contáctanos dentro de los 30 días siguientes a la transacción.`,
  },
  {
    icon: FileText,
    color: '#0ea5e9',
    title: '6. Propiedad intelectual',
    content: `Todo el contenido de ConexiónLuz (textos, imágenes, logotipos, videos, diseños, código) es propiedad de ConexiónLuz o tiene licencia de uso. Queda prohibido:

- Reproducir o distribuir contenido sin autorización escrita
- Modificar o crear obras derivadas del contenido de la Plataforma
- Usar la marca ConexiónLuz o nuestros logotipos sin permiso
- Hacer scraping o extracción masiva de datos

**Contenido del usuario:** Al publicar en el foro o comunidad, otorgas a ConexiónLuz una licencia no exclusiva para mostrar dicho contenido en la Plataforma. Mantienes todos los derechos sobre tu contenido.`,
  },
  {
    icon: Scale,
    color: '#8b5cf6',
    title: '7. Ley aplicable y jurisdicción',
    content: `Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia se resolverá preferiblemente mediante diálogo directo con nuestro equipo de atención al usuario.

En caso de que no sea posible llegar a un acuerdo, las partes se someten a la jurisdicción de los tribunales competentes de la ciudad de Bogotá, Colombia.

**Contacto legal:** Para consultas sobre estos términos, escríbenos a legal@conexionluz.com o desde nuestra página de contacto.

Última modificación de estos términos: Mayo de 2025. ConexiónLuz se reserva el derecho de actualizar estos términos con previo aviso a los usuarios.`,
  },
];

export default function TerminosPage() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl mb-10 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900 p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(45deg, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <FileText className="h-4 w-4 text-sky-400" />
              <span className="text-sm font-bold">Marco legal</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3">Términos y Condiciones</h1>
            <p className="text-white/70 text-base max-w-md leading-relaxed">
              Las condiciones que rigen el uso de nuestra plataforma. Escritas con claridad, sin jerga legal innecesaria.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs text-white/50">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Versión vigente: Mayo 2025</span>
            </div>
          </div>
        </div>

        {/* Emergency alert */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">
            <strong>⚠️ En caso de emergencia:</strong> ConexiónLuz NO es un servicio de crisis. Si estás en peligro o tienes pensamientos de hacerte daño, llama al <strong>123</strong> (Colombia) o acude al servicio de urgencias más cercano.
          </p>
        </div>

        {/* Table of contents */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-8">
          <h2 className="font-black text-slate-700 text-sm mb-3 uppercase tracking-widest">Índice</h2>
          <div className="space-y-1">
            {SECTIONS.map((s, i) => {
              const Icon = s.icon;
              return (
                <a key={i} href={`#term-${i}`} className="flex items-center gap-2.5 py-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors group">
                  <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: s.color }} />
                  <span className="group-hover:underline">{s.title}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-5 mb-10">
          {SECTIONS.map((section, i) => {
            const Icon = section.icon;
            return (
              <div key={i} id={`term-${i}`} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${section.color}15` }}>
                    <Icon className="h-4 w-4" style={{ color: section.color }} />
                  </div>
                  <h3 className="font-black text-slate-800">{section.title}</h3>
                </div>
                <div className="px-6 py-5">
                  {section.content.split('\n').map((line, j) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={j} className="font-black text-slate-700 mt-3 mb-1 text-sm">{line.slice(2, -2)}</p>;
                    }
                    if (line.startsWith('- ')) {
                      const content = line.slice(2);
                      const parts = content.split(/\*\*(.*?)\*\*/g);
                      return (
                        <li key={j} className="text-sm text-slate-600 leading-relaxed ml-4 list-disc">
                          {parts.map((p, k) => k % 2 === 1 ? <strong key={k} className="text-slate-700">{p}</strong> : p)}
                        </li>
                      );
                    }
                    if (line.trim() === '') return <div key={j} className="h-2" />;
                    const parts = line.split(/\*\*(.*?)\*\*/g);
                    return (
                      <p key={j} className="text-sm text-slate-600 leading-relaxed">
                        {parts.map((p, k) => k % 2 === 1 ? <strong key={k} className="text-slate-700">{p}</strong> : p)}
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="bg-slate-800 rounded-2xl p-6 text-white text-center">
          <Scale className="h-8 w-8 text-sky-400 mx-auto mb-3" />
          <h3 className="font-black text-xl mb-2">¿Tienes dudas legales?</h3>
          <p className="text-white/70 text-sm mb-5">Nuestro equipo te aclara cualquier punto de estos términos.</p>
          <Link to="/contacto" className="inline-flex items-center gap-2 bg-sky-500 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-sky-400 transition-colors shadow-md">
            Contactar <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </PublicLayout>
  );
}
