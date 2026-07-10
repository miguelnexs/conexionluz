import React from 'react';
import PublicLayout from '@/components/PublicLayout';
import { Shield, Lock, Eye, Database, UserX, RefreshCw, Mail, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    icon: Database,
    color: '#6366f1',
    title: '1. Información que recopilamos',
    content: `Recopilamos únicamente la información necesaria para brindarte nuestros servicios:

**Información que tú nos proporcionas:**
- Nombre, correo electrónico y teléfono al registrarte
- Información de salud relevante que compartes en el contexto de la terapia
- Mensajes, comentarios y publicaciones en nuestra plataforma

**Información recopilada automáticamente:**
- Datos de uso de la plataforma (páginas visitadas, funciones usadas)
- Información técnica del dispositivo (tipo de navegador, sistema operativo)
- Dirección IP y datos de geolocalización aproximada

**Información que NO recopilamos:**
- El contenido de tu Diario Emocional (se guarda solo en tu dispositivo)
- Contraseñas en texto plano (siempre cifradas)
- Datos financieros completos (procesados directamente por proveedores certificados)`,
  },
  {
    icon: Eye,
    color: '#10b981',
    title: '2. Cómo usamos tu información',
    content: `Utilizamos tus datos exclusivamente para:

- **Gestionar tu cuenta** y acceso a la plataforma
- **Coordinar tus citas** con nuestros terapeutas
- **Personalizar tu experiencia** y recomendarte contenido relevante
- **Comunicarnos contigo** sobre tu proceso y actualizaciones importantes
- **Mejorar nuestra plataforma** mediante análisis estadístico anónimo
- **Cumplir obligaciones legales** cuando sea requerido por ley

**Nunca usamos tus datos para:**
- Venderlos a terceros con fines comerciales
- Crear perfiles publicitarios
- Compartirlos con empresas no autorizadas`,
  },
  {
    icon: Lock,
    color: '#ec4899',
    title: '3. Seguridad y protección de tus datos',
    content: `Implementamos medidas de seguridad de nivel empresarial:

- **Cifrado en tránsito:** Toda la comunicación usa protocolo HTTPS/TLS
- **Cifrado en reposo:** Los datos sensibles se almacenan cifrados en nuestros servidores
- **Acceso restringido:** Solo los profesionales autorizados tienen acceso a información clínica
- **Auditorías regulares:** Realizamos revisiones de seguridad periódicas
- **Copias de seguridad:** Realizamos backups automáticos para proteger tu información

Tus datos de sesiones terapéuticas están protegidos adicionalmente por el **secreto profesional** que obliga a nuestros terapeutas por ley.`,
  },
  {
    icon: UserX,
    color: '#f59e0b',
    title: '4. Confidencialidad terapéutica',
    content: `La información compartida en sesiones terapéuticas es estrictamente confidencial:

**El terapeuta NUNCA podrá revelar:**
- El contenido de las sesiones
- Tu asistencia o participación
- Cualquier información personal compartida

**Excepciones legales (situaciones muy específicas):**
- Riesgo grave e inminente para tu vida o la de terceros
- Orden judicial expresa
- Abuso de menores o personas vulnerables

En cualquier caso, se buscará siempre tu consentimiento previo y se te informará sobre cualquier acción necesaria.`,
  },
  {
    icon: RefreshCw,
    color: '#0ea5e9',
    title: '5. Tus derechos sobre tus datos',
    content: `Tienes control total sobre tu información personal. Puedes ejercer los siguientes derechos:

- **Acceso:** Solicitar una copia de todos los datos que tenemos sobre ti
- **Rectificación:** Corregir información incorrecta o desactualizada
- **Eliminación:** Solicitar que borremos tu cuenta y todos tus datos
- **Portabilidad:** Recibir tus datos en un formato estándar y transferible
- **Oposición:** Oponerte al uso de tus datos para fines específicos
- **Limitación:** Solicitar que restrinjamos el procesamiento de tu información

Para ejercer cualquiera de estos derechos, escríbenos a **privacidad@conexionluz.com** o desde nuestra página de contacto.`,
  },
  {
    icon: Mail,
    color: '#8b5cf6',
    title: '6. Cookies y tecnologías similares',
    content: `Utilizamos cookies para mejorar tu experiencia:

**Cookies esenciales:** Necesarias para el funcionamiento de la plataforma (autenticación, preferencias de sesión). No pueden desactivarse.

**Cookies de análisis:** Nos ayudan a entender cómo se usa la plataforma para mejorarla (Google Analytics con IP anonimizada). Puedes desactivarlas.

**Cookies de personalización:** Recuerdan tus preferencias de idioma y configuración. Puedes desactivarlas desde la configuración de tu navegador.

No usamos cookies de rastreo publicitario ni compartimos datos de cookies con terceros con fines comerciales.`,
  },
];

function renderContent(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="font-black text-slate-700 mt-3 mb-1 text-sm">{line.slice(2, -2)}</p>;
    }
    if (line.startsWith('- ')) {
      const content = line.slice(2);
      const parts = content.split(/\*\*(.*?)\*\*/g);
      return (
        <li key={i} className="text-sm text-slate-600 leading-relaxed">
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-slate-700">{p}</strong> : p)}
        </li>
      );
    }
    if (line.trim() === '') return <br key={i} />;
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} className="text-sm text-slate-600 leading-relaxed">
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-slate-700">{p}</strong> : p)}
      </p>
    );
  });
}

export default function PrivacidadPage() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl mb-10 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '25px 25px' }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-bold">Tu privacidad, nuestra prioridad</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3">Política de Privacidad</h1>
            <p className="text-white/70 text-base max-w-md leading-relaxed">
              Queremos que sepas exactamente cómo protegemos tu información. Sin letra pequeña: solo claridad y transparencia.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs text-white/50">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Última actualización: Mayo 2025</span>
            </div>
          </div>
        </div>

        {/* Intro */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-8 flex items-start gap-3">
          <Lock className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-700 leading-relaxed">
            <strong>Compromiso:</strong> En ConexiónLuz tratamos la privacidad como un valor fundamental. Nunca vendemos tus datos, nunca creamos perfiles publicitarios y siempre respetamos el secreto profesional. Esta política explica con honestidad qué datos recopilamos, por qué y cómo los protegemos.
          </p>
        </div>

        {/* Table of contents */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-8">
          <h2 className="font-black text-slate-700 text-sm mb-3 uppercase tracking-widest">Contenido</h2>
          <div className="space-y-1">
            {SECTIONS.map((s, i) => {
              const Icon = s.icon;
              return (
                <a key={i} href={`#section-${i}`} className="flex items-center gap-2.5 py-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors group">
                  <Icon className="h-3.5 w-3.5 shrink-0 transition-colors" style={{ color: s.color }} />
                  <span className="group-hover:underline">{s.title}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6 mb-10">
          {SECTIONS.map((section, i) => {
            const Icon = section.icon;
            return (
              <div key={i} id={`section-${i}`} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${section.color}15` }}>
                    <Icon className="h-4.5 w-4.5" style={{ color: section.color }} />
                  </div>
                  <h3 className="font-black text-slate-800 text-base">{section.title}</h3>
                </div>
                <div className="px-6 py-5 space-y-1.5">
                  <ul className="list-disc list-inside space-y-1">
                    {renderContent(section.content)}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact */}
        <div className="bg-slate-800 rounded-2xl p-6 text-white text-center">
          <Shield className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
          <h3 className="font-black text-xl mb-2">¿Tienes preguntas sobre tu privacidad?</h3>
          <p className="text-white/70 text-sm mb-5">Nuestro equipo de privacidad responde en menos de 48 horas.</p>
          <Link to="/contacto" className="inline-flex items-center gap-2 bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-400 transition-colors shadow-md">
            Contactar al equipo <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </PublicLayout>
  );
}
