from api.models import Course

published_content = {
    "sections": [
        {
            "id": "sec-1",
            "title": "Módulo 1: Fundamentos Neurobiológicos y Psicodinámicos de la Hipnosis",
            "items": [
                {
                    "id": "item-1-1",
                    "type": "html",
                    "title": "1.1 Mitos, Verdades Científicas y Neurobiología del Trance",
                    "html": """
                        <div class="space-y-6">
                            <h3 class="text-2xl font-black text-slate-900">1.1 Mitos, Verdades Científicas y Neurobiología del Trance Hipnótico</h3>
                            <p class="text-slate-700 leading-relaxed font-medium">
                                La hipnosis clínica no es control mental ni pérdida del conocimiento. Es un estado focalizado de atención sostenida, relajación psicofísica y mayor permeabilidad a sugestiones terapéuticas.
                            </p>
                            <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-3">
                                <h4 class="text-lg font-bold text-indigo-950">🧠 Lo que dice la neurociencia (Stanford & Harvard):</h4>
                                <ul class="list-disc list-inside space-y-2 text-sm text-indigo-900">
                                    <li><strong>Red del Modo por Defecto (DMN):</strong> Se disminuye la actividad de la rumia mental e hipervigilancia.</li>
                                    <li><strong>Corteza Cingulada Anterior:</strong> Permite mayor flexibilidad cognitiva para reinterpretar vivencias pasadas.</li>
                                    <li><strong>Ondas Alfa (8-12 Hz) y Theta (4-8 Hz):</strong> Facilitan la comunicación directa con el subconsciente.</li>
                                </ul>
                            </div>
                            <h4 class="text-xl font-bold text-slate-800">Mitos Comunes Desmentidos:</h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                    <span class="font-bold text-rose-600 block mb-1">❌ Mito: Se pierde la voluntad</span>
                                    <p class="text-slate-600">Realidad: La persona mantiene el control total en todo momento y no aceptará sugestiones contrarias a su ética.</p>
                                </div>
                                <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                    <span class="font-bold text-emerald-600 block mb-1">✓ Realidad: Foco de atención elevado</span>
                                    <p class="text-slate-600">Es un estado similar al ensimismamiento profundo al leer un buen libro o escuchar música.</p>
                                </div>
                            </div>
                        </div>
                    """
                },
                {
                    "id": "item-1-2",
                    "type": "html",
                    "title": "1.2 El Inconsciente y el Lenguaje Simbólico",
                    "html": """
                        <div class="space-y-6">
                            <h3 class="text-2xl font-black text-slate-900">1.2 El Inconsciente y el Lenguaje Simbólico</h3>
                            <p class="text-slate-700 leading-relaxed font-medium">
                                El subconsciente procesa información a través de símbolos, emociones, sensaciones corporales y metáforas, no con lógica verbal rígida.
                            </p>
                            <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 space-y-3 text-emerald-950">
                                <h4 class="text-base font-bold">Las 4 Leyes del Subconsciente:</h4>
                                <ol class="list-decimal list-inside space-y-2 text-sm">
                                    <li>El inconsciente responde a imágenes claras y cargadas de emoción.</li>
                                    <li>No distingue entre una experiencia real y una imaginada intensamente.</li>
                                    <li>Cada síntoma (ansiedad, dolor físico) tiene una intención protectora positiva original.</li>
                                    <li>Las sugestiones repetidas y compasivas crean nuevas autopistas neuronales.</li>
                                </ol>
                            </div>
                        </div>
                    """
                },
                {
                    "id": "item-1-3",
                    "type": "quiz",
                    "title": "1.3 Evaluativo de Sugestionabilidad y Conceptos Clave",
                    "quiz": {
                        "questions": [
                            {
                                "id": "q1",
                                "type": "multiple",
                                "prompt": "¿Qué ondas cerebrales predominan en un estado de trance hipnótico profundo y relajado?",
                                "choices": [
                                    {"id": "a", "text": "Ondas Beta de alta frecuencia", "isCorrect": False},
                                    {"id": "b", "text": "Ondas Alfa (8-12 Hz) y Theta (4-8 Hz)", "isCorrect": True},
                                    {"id": "c", "text": "Ondas Gamma únicamente", "isCorrect": False}
                                ]
                            },
                            {
                                "id": "q2",
                                "type": "truefalse",
                                "prompt": "¿En estado de hipnosis la persona pierde el conocimiento y el control voluntario?",
                                "correctBool": False
                            }
                        ]
                    }
                }
            ]
        },
        {
            "id": "sec-2",
            "title": "Módulo 2: Inducciones Hipnóticas, Profundización y Autohipnosis",
            "items": [
                {
                    "id": "item-2-1",
                    "type": "html",
                    "title": "2.1 Inducciones Clásicas: El Método de Dave Elman",
                    "html": """
                        <div class="space-y-6">
                            <h3 class="text-2xl font-black text-slate-900">2.1 Inducción de Dave Elman: Paso a Paso</h3>
                            <p class="text-slate-700 leading-relaxed font-medium">
                                La inducción de Dave Elman es una de las herramientas clínicas más eficaces del mundo para lograr somnambulismo terapéutico en menos de 4 minutos.
                            </p>
                            <div class="space-y-4">
                                <div class="border border-slate-200 rounded-xl p-5 bg-white shadow-sm space-y-2">
                                    <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider block">Paso 1: Catalepsia Ocular</span>
                                    <p class="text-sm text-slate-700">Pedir al sujeto que cierre sus ojos y relaje los párpados hasta tal punto que sienta que no quieren abrirse, y probarlos suavemente.</p>
                                </div>
                                <div class="border border-slate-200 rounded-xl p-5 bg-white shadow-sm space-y-2">
                                    <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider block">Paso 2: Fraccionamiento de Relajación</span>
                                    <p class="text-sm text-slate-700">Abrir y cerrar los ojos alternadamente para duplicar la profundidad de la relajación física con cada parpadeo.</p>
                                </div>
                                <div class="border border-slate-200 rounded-xl p-5 bg-white shadow-sm space-y-2">
                                    <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider block">Paso 3: Relajación Mental y Amnesia Numérica</span>
                                    <p class="text-sm text-slate-700">Contar en voz alta desde 100 hacia atrás, relajando la mente de modo que los números se borren por completo al llegar a 97.</p>
                                </div>
                            </div>
                        </div>
                    """
                },
                {
                    "id": "item-2-2",
                    "type": "html",
                    "title": "2.2 Profundizadores y Construcción del 'Lugar Seguro'",
                    "html": """
                        <div class="space-y-6">
                            <h3 class="text-2xl font-black text-slate-900">2.2 Profundizadores del Trance y Anclaje de Seguridad</h3>
                            <p class="text-slate-700 leading-relaxed font-medium">
                                Antes de explorar memorias o realizar transformaciones emocionales, es fundamental anclar un Santuario Interno donde el sujeto se sienta 100% a salvo y protegido.
                            </p>
                            <div class="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-3 text-amber-950">
                                <h4 class="text-base font-bold">🌿 Guía de Construcción del Santuario Interno:</h4>
                                <p class="text-sm leading-relaxed">
                                    "Imagina un lugar en la naturaleza o en tu espacio ideal donde solo exista paz, armonía y serenidad absoluta. Observa los colores, escucha los sonidos suaves del entorno y siente la temperatura idónea en tu piel..."
                                </p>
                            </div>
                        </div>
                    """
                },
                {
                    "id": "item-2-3",
                    "type": "html",
                    "title": "2.3 Protocolo de Autohipnosis Diaria y Autorregulación",
                    "html": """
                        <div class="space-y-6">
                            <h3 class="text-2xl font-black text-slate-900">2.3 Protocolo de Autohipnosis en 5 Minutos</h3>
                            <p class="text-slate-700 leading-relaxed font-medium">
                                Aprende a programar tu mente cada mañana o antes de dormir mediante el anclaje respiratorio y la frase de poder.
                            </p>
                            <div class="bg-slate-900 text-white rounded-2xl p-6 space-y-3">
                                <h4 class="text-base font-bold text-amber-400">Paso a paso de la práctica diaria:</h4>
                                <ol class="list-decimal list-inside space-y-2 text-sm text-slate-200">
                                    <li>Adopta una postura cómoda y realiza 3 respiraciones profundas (4 seg inhalar, 7 sostener, 8 exhalar).</li>
                                    <li>Toca pulgar con índice derecho afirmando mentalmente: "Paz, calma y foco total".</li>
                                    <li>Visualiza tu objetivo del día cumplido con éxito y tranquilidad.</li>
                                    <li>Cuenta del 1 al 5 para retornar renovado y con máxima energía.</li>
                                </ol>
                            </div>
                        </div>
                    """
                }
            ]
        },
        {
            "id": "sec-3",
            "title": "Módulo 3: Hipnoanálisis, Regresión y Terapia de Partes",
            "items": [
                {
                    "id": "item-3-1",
                    "type": "html",
                    "title": "3.1 Búsqueda del Evento Causal Inicial (ISE) y Puente Emocional",
                    "html": """
                        <div class="space-y-6">
                            <h3 class="text-2xl font-black text-slate-900">3.1 La Técnica del Puente Emocional (Afect Bridge)</h3>
                            <p class="text-slate-700 leading-relaxed font-medium">
                                El síntoma actual es una respuesta condicionada. El Puente Emocional utiliza la sensación presente en el cuerpo como hilo conductor hacia la primera vez que se sintió esa emoción.
                            </p>
                            <div class="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 space-y-3 text-indigo-950">
                                <h4 class="text-base font-bold">Fases del Hipnoanálisis:</h4>
                                <ol class="list-decimal list-inside space-y-2 text-sm">
                                    <li><strong>Focalización del síntoma:</strong> Ubicar la sensación somática en el cuerpo (nudo en el estómago, presión en el pecho).</li>
                                    <li><strong>Rastreo regresivo:</strong> Flotar hacia atrás en el tiempo siguiendo la misma huella emocional.</li>
                                    <li><strong>Identificación del ISE:</strong> Localizar la escena origen donde se formó la interpretación limitante.</li>
                                    <li><strong>Reencuadre terapéutico:</strong> Brindar recursos del adulto presente al niño del pasado.</li>
                                </ol>
                            </div>
                        </div>
                    """
                },
                {
                    "id": "item-3-2",
                    "type": "html",
                    "title": "3.2 Sanación del Niño Interno y Reencuadre Compasivo",
                    "html": """
                        <div class="space-y-6">
                            <h3 class="text-2xl font-black text-slate-900">3.2 Reparación Emocional y Sanación del Niño Interno</h3>
                            <p class="text-slate-700 leading-relaxed font-medium">
                                Bajo trance, el paciente entra en la escena del pasado como su adulto sabio actual para proteger, validar y liberar las emociones atrapadas de su infancia.
                            </p>
                            <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-3 text-emerald-950">
                                <h4 class="text-base font-bold">Frases de Reencuadre y Validación Inconsciente:</h4>
                                <ul class="list-disc list-inside space-y-2 text-sm">
                                    <li>"Hiciste lo mejor que pudiste con los recursos de ese momento. Ya estás a salvo."</li>
                                    <li>"Esa culpa/miedo no te pertenece; se la devolvemos con respeto a quien corresponde."</li>
                                    <li>"Hoy yo me hago cargo de cuidarte, amarte y protegerte."</li>
                                </ul>
                            </div>
                        </div>
                    """
                },
                {
                    "id": "item-3-3",
                    "type": "html",
                    "title": "3.3 Terapia de Partes (Parts Therapy) e Integración del Autosabotaje",
                    "html": """
                        <div class="space-y-6">
                            <h3 class="text-2xl font-black text-slate-900">3.3 Resolución de Conflictos Internos: Terapia de Partes</h3>
                            <p class="text-slate-700 leading-relaxed font-medium">
                                Cuando una persona dice "Quiero avanzar pero algo dentro de mí me detiene", existe un conflicto entre dos subpersonalidades inconscientes.
                            </p>
                            <div class="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm space-y-4">
                                <h4 class="text-lg font-bold text-slate-900">Pasos de Integración:</h4>
                                <div class="space-y-3 text-sm text-slate-700 font-medium">
                                    <p><strong>1. Nombrar las partes:</strong> La parte deseante vs. la parte protectora/temerosa.</p>
                                    <p><strong>2. Descubrir la intención positiva:</strong> Comprender que la parte protectora solo busca evitar el dolor.</p>
                                    <p><strong>3. Acuerdo de colaboración:</strong> Asignar un nuevo rol saludable a la parte protectora sin bloquear los sueños de la persona.</p>
                                </div>
                            </div>
                        </div>
                    """
                }
            ]
        },
        {
            "id": "sec-4",
            "title": "Módulo 4: Protocolos Clínicos Específicos, Ética y Certificación",
            "items": [
                {
                    "id": "item-4-1",
                    "type": "html",
                    "title": "4.1 Protocolos para Ansiedad, Crisis de Pánico e Insomnio",
                    "html": """
                        <div class="space-y-6">
                            <h3 class="text-2xl font-black text-slate-900">4.1 Protocolo Clínico para Manejo de Ansiedad y Pánico</h3>
                            <p class="text-slate-700 leading-relaxed font-medium">
                                Secuencia avanzada para restaurar la autorregulación autonómica del sistema nervioso simpático al parasimpático.
                            </p>
                            <div class="bg-teal-50 border border-teal-200 rounded-2xl p-6 space-y-3 text-teal-950">
                                <h4 class="text-base font-bold">Pasos de Intervención:</h4>
                                <ul class="list-disc list-inside space-y-2 text-sm">
                                    <li>Inducción por fijación y respiración profunda diafragmática.</li>
                                    <li>Desensibilización sistemática con ancla de seguridad activa.</li>
                                    <li>Sugestión poshipnótica de solidez y autoeficacia.</li>
                                </ul>
                            </div>
                        </div>
                    """
                },
                {
                    "id": "item-4-2",
                    "type": "html",
                    "title": "4.2 Ética Profesional, Consentimiento y Manejo de Abreacciones",
                    "html": """
                        <div class="space-y-6">
                            <h3 class="text-2xl font-black text-slate-900">4.2 Código de Ética y Seguridad en la Práctica Hipnótica</h3>
                            <p class="text-slate-700 leading-relaxed font-medium">
                                Principios éticos indispensables para ejercer con máxima responsabilidad y cuidado del paciente.
                            </p>
                            <div class="bg-slate-900 text-white rounded-2xl p-6 space-y-3">
                                <h4 class="text-base font-bold text-emerald-400">Reglas de Oro del Terapeuta:</h4>
                                <ul class="list-disc list-inside space-y-2 text-sm text-slate-200">
                                    <li>Consentimiento informado explícito antes de iniciar cualquier transe.</li>
                                    <li>Manejo seguro de abreacciones: Mantener la voz calmada, recordar que está a salvo y anclar al lugar seguro.</li>
                                    <li>Respeto irrestricto al secreto profesional y privacidad del paciente.</li>
                                </ul>
                            </div>
                        </div>
                    """
                },
                {
                    "id": "item-4-3",
                    "type": "quiz",
                    "title": "4.3 Examen de Evaluación Final y Certificación",
                    "quiz": {
                        "questions": [
                            {
                                "id": "q-final-1",
                                "type": "multiple",
                                "prompt": "¿Cuál es el objetivo principal de la Terapia de Partes (Parts Therapy)?",
                                "choices": [
                                    {"id": "a", "text": "Eliminar por completo las partes del ego que producen miedo", "isCorrect": False},
                                    {"id": "b", "text": "Descubrir la intención positiva de las partes inconscientes en conflicto e integrarlas armónicamente", "isCorrect": True},
                                    {"id": "c", "text": "Forzar la amnesia completa de la infancia", "isCorrect": False}
                                ]
                            },
                            {
                                "id": "q-final-2",
                                "type": "truefalse",
                                "prompt": "¿El Puente Emocional utiliza la sensación somática presente para rastrear el evento causal inicial (ISE)?",
                                "correctBool": True
                            }
                        ]
                    }
                }
            ]
        }
    ]
}

description_html = """
    <div class="space-y-6 text-slate-700 leading-relaxed font-medium">
        <p className="text-lg font-semibold text-slate-800">
            Bienvenido al <strong>Curso Master de Hipnosis Clínica e Hipnoanálisis</strong>, el programa más completo y riguroso para comprender, dominar e integrar el trabajo con la mente inconsciente.
        </p>
        <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-3">
            <h4 class="text-base font-bold text-emerald-900 flex items-center gap-2">
                ✨ ¿Qué aprenderás en este curso máster?
            </h4>
            <ul class="list-disc list-inside space-y-2 text-sm text-emerald-800">
                <li><strong>Fundamentos neurobiológicos:</strong> Cómo opera el cerebro en estados modificados de conciencia (ondas Alfa y Theta).</li>
                <li><strong>Inducciones avanzadas:</strong> Protocolos de Dave Elman, Milton Erickson y técnicas de inducción rápida.</li>
                <li><strong>Hipnoanálisis y Regresión:</strong> Rastreo de causas raíz (ISE), trabajo con el niño interno y saneamiento de heridas emocionales.</li>
                <li><strong>Terapia de Partes:</strong> Integración de conflictos inconscientes y eliminación definitiva del autosabotaje.</li>
                <li><strong>Protocolos Clínicos:</strong> Abordaje especializado para ansiedad, crisis de pánico, insomnio y fortalecimiento de la autoestima.</li>
                <li><strong>Ética y Seguridad:</strong> Manejo compasivo de abreacciones y contención profesional.</li>
            </ul>
        </div>
        <p>
            Al completar los 4 módulos teóricos y prácticos, dominarás tanto la autohipnosis para tu propia autorregulación como las herramientas para acompañar a otros hacia una profunda sanación integral.
        </p>
    </div>
"""

defaults = {
    "title": "Curso Master: Hipnosis Clínica, Hipnoanálisis y Transformación del Inconsciente",
    "description": "Formación profesional completa en Hipnosis Clínica, Hipnoanálisis Ericksoniano y Técnicas de Reprogramación del Subconsciente. Diseñado para terapeutas, profesionales de la salud mental y buscadores de transformación profunda.",
    "description_html": description_html,
    "category": "Hipnosis Clínica & Sanación",
    "tags": ["Hipnosis", "Hipnoanálisis", "Subconsciente", "Transpersonal", "Autohipnosis", "Regresión", "Terapia", "Reprogramación Mental"],
    "price_cop": 0,
    "cover_url": "/cursos/hipnosis_cover.png",
    "status": "published",
    "is_active": True,
    "published_content": published_content
}

course, created = Course.objects.get_or_create(
    slug="hipnosis-clinica-transpersonal",
    defaults=defaults
)

if not created:
    for k, v in defaults.items():
        setattr(course, k, v)
    course.save()

print(f"Course created successfully! ID={course.id} | title={course.title} | slug={course.slug} | status={course.status}")
