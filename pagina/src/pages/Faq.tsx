import React, { useState } from 'react';
import PublicLayout from '@/components/PublicLayout';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type FaqItem = { q: string; a: string; category: string };

const FAQS: FaqItem[] = [
  // Servicios
  { category: 'Servicios', q: '¿Qué tipo de terapias ofrecen?', a: 'Ofrecemos psicoterapia individual, terapia de pareja, orientación familiar y grupos de apoyo. Nuestros enfoques incluyen Terapia Cognitivo-Conductual (TCC), Mindfulness, Terapia de Aceptación y Compromiso (ACT), terapia humanista y técnicas de relajación.' },
  { category: 'Servicios', q: '¿Las sesiones son presenciales o virtuales?', a: 'Ofrecemos ambas modalidades. Las sesiones virtuales se realizan por videollamada segura y tienen exactamente la misma calidad que las presenciales. Tú eliges la que mejor se adapte a tu estilo de vida.' },
  { category: 'Servicios', q: '¿Cuánto dura cada sesión de terapia?', a: 'La duración estándar es de 50 a 60 minutos por sesión. En algunos casos especiales (evaluaciones iniciales o sesiones de pareja/familia) pueden extenderse hasta 90 minutos.' },
  { category: 'Servicios', q: '¿Con qué frecuencia debo asistir a terapia?', a: 'La frecuencia más común es semanal, especialmente al inicio del proceso. A medida que avanzas, el terapeuta puede ajustar la periodicidad a quincenal o mensual. Todo depende de tus necesidades y objetivos.' },
  // Citas
  { category: 'Citas & Pagos', q: '¿Cómo puedo agendar una cita?', a: 'Puedes agendar directamente desde nuestra plataforma haciendo clic en "Agendar cita". También puedes escribirnos por WhatsApp o al correo de contacto. El proceso es simple y rápido — normalmente confirmamos en menos de 24 horas.' },
  { category: 'Citas & Pagos', q: '¿Cuál es el costo de las sesiones?', a: 'El costo varía según el profesional y el tipo de servicio. Contamos con tarifas accesibles y planes de membresía que reducen el costo por sesión. Escríbenos para conocer los precios actuales y opciones de pago.' },
  { category: 'Citas & Pagos', q: '¿Puedo cancelar o reprogramar mi cita?', a: 'Sí. Pedimos que nos avises con al menos 24 horas de anticipación para cancelaciones o cambios. Las cancelaciones con menos de 24 horas pueden estar sujetas a un cargo parcial según nuestra política.' },
  { category: 'Citas & Pagos', q: '¿Aceptan seguros médicos?', a: 'Trabajamos con algunas aseguradoras. Te recomendamos consultarnos directamente con el nombre de tu aseguradora para verificar la cobertura. En caso de no aplicar, ofrecemos facilidades de pago.' },
  // Privacidad
  { category: 'Privacidad & Confianza', q: '¿La información que comparto es confidencial?', a: 'Absolutamente. Todo lo que compartes en sesión es estrictamente confidencial y está protegido por el secreto profesional. Solo se rompe la confidencialidad en situaciones específicas que contempla la ley (riesgo grave para ti u otras personas), y siempre se te informará.' },
  { category: 'Privacidad & Confianza', q: '¿Mis datos personales están seguros?', a: 'Sí. Cumplimos con las normativas de protección de datos vigentes. Tu información nunca se comparte con terceros sin tu consentimiento. Consulta nuestra Política de Privacidad para más detalles.' },
  { category: 'Privacidad & Confianza', q: '¿Cómo sé si un terapeuta está certificado?', a: 'Todos nuestros terapeutas son profesionales titulados con registro activo en su respectivo colegio o junta profesional. Puedes ver el perfil completo de cada terapeuta, incluyendo su formación y experiencia, antes de agendar.' },
  // Plataforma
  { category: 'Plataforma', q: '¿Las herramientas de la sección Actividades son terapia?', a: 'No. Los tests, ejercicios y el diario emocional son herramientas de autoconocimiento y apoyo. Son complementos útiles pero no reemplazan el proceso terapéutico con un profesional. Si los resultados te preocupan, te animamos a agendar una consulta.' },
  { category: 'Plataforma', q: '¿El Diario Emocional es privado?', a: 'Sí, completamente. Las entradas de tu Diario Emocional se guardan solo en tu dispositivo (navegador) y nunca se envían a nuestros servidores. Nadie más puede acceder a ellas.' },
  { category: 'Plataforma', q: '¿Necesito crear una cuenta para acceder a los recursos?', a: 'La mayoría de los recursos como el blog, FAQ, ejercicios y tests son de acceso libre. Solo necesitas una cuenta para gestionar tus citas, acceder a tu calendario y participar en el foro.' },
];

const CATEGORIES = ['Todos', 'Servicios', 'Citas & Pagos', 'Privacidad & Confianza', 'Plataforma'];

function FaqCard({ faq }: { faq: FaqItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn('bg-white rounded-2xl border transition-all duration-200 overflow-hidden', open ? 'border-sky-200 shadow-md' : 'border-slate-100 shadow-sm hover:shadow-md')}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className={cn('font-bold text-sm leading-snug transition-colors', open ? 'text-sky-700' : 'text-slate-700')}>{faq.q}</span>
        <div className={cn('h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200', open ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-400')}>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-sky-50">
          <p className="text-sm text-slate-600 leading-relaxed mt-3">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('Todos');

  const filtered = FAQS.filter(f => {
    const matchCat = cat === 'Todos' || f.category === cat;
    const matchSearch = search === '' || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl mb-10 bg-gradient-to-br from-sky-500 to-cyan-600 p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm font-bold">Centro de ayuda</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3">Preguntas Frecuentes</h1>
            <p className="text-white/80 text-base max-w-md">Resolvemos las dudas más comunes sobre nuestros servicios, privacidad y plataforma.</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar pregunta…"
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition-all"
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8 overflow-x-auto pb-1">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn('px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap', cat === c ? 'bg-sky-500 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:border-sky-300 hover:text-sky-600')}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-xs text-slate-400 font-semibold mb-4">{filtered.length} {filtered.length === 1 ? 'pregunta' : 'preguntas'} encontradas</p>

        {/* FAQs */}
        <div className="space-y-3 mb-10">
          {filtered.length === 0 ? (
            <div className="text-center py-14">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="font-black text-slate-700">No encontramos resultados</h3>
              <p className="text-slate-400 text-sm mt-1">Intenta con otras palabras o contáctanos directamente.</p>
            </div>
          ) : filtered.map((f, i) => <FaqCard key={i} faq={f} />)}
        </div>

        {/* Contact CTA */}
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-sky-100 flex items-center justify-center shrink-0">
            <MessageCircle className="h-6 w-6 text-sky-500" />
          </div>
          <div className="text-center sm:text-left">
            <h4 className="font-black text-slate-800">¿No encontraste tu respuesta?</h4>
            <p className="text-sm text-slate-500">Escríbenos y te respondemos a la brevedad.</p>
          </div>
          <Link to="/contacto" className="ml-auto shrink-0 flex items-center gap-2 bg-sky-500 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-sky-600 transition-colors shadow-md">
            Contactar <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </PublicLayout>
  );
}
