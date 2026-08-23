import os
import django
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Course

def create_ie_course():
    def gid(): return str(uuid.uuid4())

    content = {
        "version": 1,
        "sections": [
            # ══════════════════════════════════════════════════════════
            # MÓDULO 1 — ¿QUÉ ES LA INTELIGENCIA EMOCIONAL?
            # ══════════════════════════════════════════════════════════
            {
                "id": "m1-que-es-inteligencia-emocional",
                "title": "Módulo 1: Fundamentos de la Inteligencia Emocional",
                "items": [
                    {
                        "id": "ie-l1-1-bienvenida",
                        "type": "html",
                        "title": "1.1 Bienvenida y Enfoque del Curso",
                        "html": """
                            <div class="space-y-6 select-text">
                                <div class="bg-gradient-to-r from-teal-50 via-cyan-50 to-indigo-50 text-slate-900 rounded-3xl p-8 shadow-xs border border-teal-100 relative overflow-hidden">
                                    <span class="text-xs font-black uppercase tracking-widest text-teal-800 bg-white px-3.5 py-1 rounded-full border border-teal-200 shadow-2xs">
                                        🌊 CONEXIÓN LUZ · CONCIENCIA AFECTIVA
                                    </span>
                                    <h2 class="text-3xl md:text-4xl font-black mt-3 mb-2 tracking-tight text-slate-900">
                                        Bienvenido a Inteligencia Emocional
                                    </h2>
                                    <p class="text-slate-700 text-sm md:text-base leading-relaxed font-medium">
                                        "Comprende tus emociones, desarrolla conciencia y mejora tu manera de relacionarte."
                                    </p>
                                </div>

                                <div class="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-2xs">
                                    <h3 class="text-xl font-black text-slate-900">Objetivo del Programa</h3>
                                    <p class="text-slate-600 text-sm leading-relaxed">
                                        Desarrollar habilidades prácticas de autoconocimiento afectivo, autorregulación, empatía, escucha activa y resolución pacífica de conflictos para cultivar vínculos humanos saludables.
                                    </p>
                                </div>

                                <div class="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 space-y-2">
                                    <h4 class="font-bold text-amber-950 text-sm flex items-center gap-2">
                                        ⚠️ Marco Ético y Realista
                                    </h4>
                                    <p class="text-xs text-amber-900 leading-relaxed font-medium">
                                        La inteligencia emocional no busca reprimir ni eliminar las emociones difíciles, sino comprender su mensaje adaptativo. Este programa es formativo y no sustituye la psicoterapia profesional.
                                    </p>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "ie-l1-2-emocion-pensamiento-conducta",
                        "type": "html",
                        "title": "1.2 Emoción, Sentimiento y Estado de Ánimo",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Diferenciando los Estados Afectivos</h2>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                                        <h4 class="font-bold text-teal-950 text-sm mb-1">⚡ Emoción (Inmediata y Breve)</h4>
                                        <p class="text-xs text-slate-600">Respuesta psicofisiológica rápida y automática ante un estímulo relevante (ej: sobresalto por un ruido).</p>
                                    </div>
                                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                                        <h4 class="font-bold text-indigo-950 text-sm mb-1">🧠 Sentimiento (Consciente y Duradero)</h4>
                                        <p class="text-xs text-slate-600">La experiencia consciente y verbalizada tras interpretar la emoción con el pensamiento (ej: gratitud o tristeza).</p>
                                    </div>
                                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                                        <h4 class="font-bold text-cyan-950 text-sm mb-1">🌤️ Estado de Ánimo (Clima de Fondo)</h4>
                                        <p class="text-xs text-slate-600">Disposición afectiva más prolongada y difusa que tiñe nuestra percepción durante horas o días.</p>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "ie-l1-3-evaluacion-m1",
                        "type": "quiz",
                        "title": "1.3 Evaluación: Fundamentos Emocionales",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "ie-q1-1",
                                    "type": "multiple",
                                    "prompt": "¿Cuál es la función adaptativa principal de las emociones humanas?",
                                    "choices": [
                                        {"id": "a", "text": "Preparar al organismo para responder rápidamente a los cambios del entorno y comunicar necesidades.", "isCorrect": True},
                                        {"id": "b", "text": "Hacernos sufrir innecesariamente.", "isCorrect": False},
                                        {"id": "c", "text": "Bloquear la capacidad de razonamiento lógico para siempre.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 2 — AUTOCONOCIMIENTO EMOCIONAL
            # ══════════════════════════════════════════════════════════
            {
                "id": "m2-autoconocimiento-emocional",
                "title": "Módulo 2: Autoconocimiento y Vocabulario Afectivo",
                "items": [
                    {
                        "id": "ie-l2-1-vocabulario-emocional",
                        "type": "html",
                        "title": "2.1 Granularidad y Vocabulario Emocional",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">La Granularidad Emocional</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Cuanto más preciso sea el vocabulario con el que nombras lo que sientes (distinguiendo entre 'irritado', 'abrumado', 'decepcionado' o 'inquieto' en lugar de simplemente decir 'mal'), con mayor eficacia tu cerebro podrá autorregularse.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "ie-l2-2-evaluacion-m2",
                        "type": "quiz",
                        "title": "2.2 Evaluación: Identificación Afectiva",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "ie-q2-1",
                                    "type": "truefalse",
                                    "prompt": "¿Nombrar con precisión una emoción ayuda a activar la corteza prefrontal y reducir la reactividad de la amígdala cerebral?",
                                    "correctBool": True
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 3 — COMPRENDIENDO LAS EMOCIONES
            # ══════════════════════════════════════════════════════════
            {
                "id": "m3-comprendiendo-las-emociones",
                "title": "Módulo 3: El Mensaje de las Emociones Primarias y Complejas",
                "items": [
                    {
                        "id": "ie-l3-1-clasificacion-emocional",
                        "type": "html",
                        "title": "3.1 El Mensaje Oculto de Cada Emoción",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">¿Qué te está diciendo tu emoción?</h2>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div class="p-4 bg-teal-50 border border-teal-200 rounded-2xl">
                                        <h4 class="font-bold text-teal-950 text-sm">🛡️ El Miedo</h4>
                                        <p class="text-xs text-teal-900 mt-1">Señala una posible amenaza o incertidumbre. Te invita a prepararte, protegerte o evaluar recursos.</p>
                                    </div>
                                    <div class="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                                        <h4 class="font-bold text-rose-950 text-sm">🔥 La Ira o Enojo</h4>
                                        <p class="text-xs text-rose-900 mt-1">Señala que un límite personal ha sido traspasado o se percibe una injusticia. Te moviliza a proteger tu dignidad.</p>
                                    </div>
                                    <div class="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                                        <h4 class="font-bold text-blue-950 text-sm">🌧️ La Tristeza</h4>
                                        <p class="text-xs text-blue-900 mt-1">Señala una pérdida o necesidad de asimilación. Te invita a replegarte, descansar y buscar apoyo.</p>
                                    </div>
                                    <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                                        <h4 class="font-bold text-emerald-950 text-sm">✨ La Alegría y Gratitud</h4>
                                        <p class="text-xs text-emerald-900 mt-1">Señala satisfacción y conexión. Te impulsa a compartir, explorar y estrechar lazos comunitarios.</p>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "ie-l3-2-evaluacion-m3",
                        "type": "quiz",
                        "title": "3.3 Evaluación: Clasificación y Comprensión Afectiva",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "ie-q3-1",
                                    "type": "multiple",
                                    "prompt": "¿Por qué es un error clasificar emociones como la tristeza o el miedo como 'negativas o malas'?",
                                    "choices": [
                                        {"id": "a", "text": "Porque todas las emociones tienen una función protectora y adaptativa fundamental para la supervivencia humana.", "isCorrect": True},
                                        {"id": "b", "text": "Porque las emociones no existen en realidad.", "isCorrect": False},
                                        {"id": "c", "text": "Porque deberíamos sentir únicamente euforia constante.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 4 — AUTORREGULACIÓN EMOCIONAL
            # ══════════════════════════════════════════════════════════
            {
                "id": "m4-autorregulacion-emocional",
                "title": "Módulo 4: Autorregulación y la Pausa Consciente",
                "items": [
                    {
                        "id": "ie-l4-1-pausa-consciente",
                        "type": "html",
                        "title": "4.1 La Práctica de los 4 Pasos: Detener, Respirar, Observar, Elegir",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">El Espacio entre Estímulo y Respuesta</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    'Entre el estímulo y la respuesta hay un espacio. En ese espacio reside nuestro poder para elegir nuestra respuesta' (Viktor Frankl). La pausa consciente crea ese espacio salvando la reactividad impulsiva.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "ie-l4-2-evaluacion-m4",
                        "type": "quiz",
                        "title": "4.2 Evaluación: Autorregulación y Manejo del Impulso",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "ie-q4-1",
                                    "type": "truefalse",
                                    "prompt": "¿La autorregulación emocional consiste en reprimir las emociones para no sentir nada?",
                                    "correctBool": False
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 5 — PENSAMIENTO Y EMOCIÓN
            # ══════════════════════════════════════════════════════════
            {
                "id": "m5-pensamiento-emocion",
                "title": "Módulo 5: Pensamiento Flexible e Interpretación",
                "items": [
                    {
                        "id": "ie-l5-1-cambia-perspectiva",
                        "type": "html",
                        "title": "5.1 El Filtro Interpretativo",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Situación → Interpretación → Emoción</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    No nos afecta lo que sucede, sino el significado subjetivo que le atribuimos a lo que sucede. Aprender a flexibilizar nuestras interpretaciones reduce el sufrimiento estéril.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "ie-l5-2-evaluacion-m5",
                        "type": "quiz",
                        "title": "5.2 Evaluación: Flexibilidad Mental",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "ie-q5-1",
                                    "type": "multiple",
                                    "prompt": "Si alguien tarda en responder un mensaje y piensas 'seguro está ocupado' en lugar de 'no le importo', ¿qué ocurre?",
                                    "choices": [
                                        {"id": "a", "text": "Tu respuesta emocional será más tranquila y evitarás crear un conflicto innecesario.", "isCorrect": True},
                                        {"id": "b", "text": "Te obligará a llamar 10 veces seguidas.", "isCorrect": False},
                                        {"id": "c", "text": "No cambia nada.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 6 — MOTIVACIÓN Y GESTIÓN PERSONAL
            # ══════════════════════════════════════════════════════════
            {
                "id": "m6-motivacion-gestion-personal",
                "title": "Módulo 6: Emociones, Metas y Motivación Intrínseca",
                "items": [
                    {
                        "id": "ie-l6-1-gestion-frustracion",
                        "type": "html",
                        "title": "6.1 Tolerancia a la Frustración y Perseverancia",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">La Emoción como Combustible de la Acción</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Vincular nuestras metas a valores afectivos genuinos y aprender a convivir con la incomodidad temporal de la frustración permite sostener el esfuerzo en el largo plazo.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "ie-l6-2-evaluacion-m6",
                        "type": "quiz",
                        "title": "6.2 Evaluación: Motivación y Persistencia",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "ie-q6-1",
                                    "type": "truefalse",
                                    "prompt": "¿Desarrollar tolerancia a la frustración permite continuar avanzando hacia metas significativas a pesar de los tropiezos temporales?",
                                    "correctBool": True
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 7 — EMPATÍA Y CONEXIÓN HUMANA
            # ══════════════════════════════════════════════════════════
            {
                "id": "m7-empatia-conexion",
                "title": "Módulo 7: Empatía, Escucha Activa y Validación",
                "items": [
                    {
                        "id": "ie-l7-1-validacion-emocional",
                        "type": "html",
                        "title": "7.1 El Poder de la Validación Emocional",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Validar antes de Aconsejar</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Validar significa transmitir a la otra persona que su emoción es comprensible y bienvenida, sin apresurarse a darle soluciones inmediatas ni minimizar su experiencia ('no es para tanto').
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "ie-l7-2-evaluacion-m7",
                        "type": "quiz",
                        "title": "7.2 Evaluación: Escucha Activa y Empatía",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "ie-q7-1",
                                    "type": "multiple",
                                    "prompt": "¿Cuál de las siguientes frases es un ejemplo de respuesta empática y validadora?",
                                    "choices": [
                                        {"id": "a", "text": "'Veo que esto te ha dolido mucho y es comprensible que te sientas así; estoy aquí para escucharte'.", "isCorrect": True},
                                        {"id": "b", "text": "'No te quejes, hay personas que están mucho peor que tú'.", "isCorrect": False},
                                        {"id": "c", "text": "'Lo que tienes que hacer inmediatamente es olvidarte del tema'.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 8 — COMUNICACIÓN EMOCIONAL
            # ══════════════════════════════════════════════════════════
            {
                "id": "m8-comunicacion-emocional",
                "title": "Módulo 8: Comunicación Asertiva y Expresión de Necesidades",
                "items": [
                    {
                        "id": "ie-l8-1-expresion-asertiva",
                        "type": "html",
                        "title": "8.1 La Fórmula de Expresión Responsable (Hecho → Sentimiento → Necesidad → Petición)",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Comunicar sin Atacar</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Hablar desde el 'yo siento' en lugar del 'tú eres' reduce la defensividad del interlocutor y abre la puerta a la cooperación y el entendimiento mutuo.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "ie-l8-2-evaluacion-m8",
                        "type": "quiz",
                        "title": "8.2 Evaluación: Habilidades de Comunicación Afectiva",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "ie-q8-1",
                                    "type": "truefalse",
                                    "prompt": "¿Expresar una necesidad con una petición clara y concreta es más eficaz que esperar que los demás adivinen lo que queremos?",
                                    "correctBool": True
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 9 — RELACIONES Y GESTIÓN DE CONFLICTOS
            # ══════════════════════════════════════════════════════════
            {
                "id": "m9-relaciones-conflictos",
                "title": "Módulo 9: Resolución de Conflictos y Reparación Vincular",
                "items": [
                    {
                        "id": "ie-l9-1-resolucion-conflictos",
                        "type": "html",
                        "title": "9.1 El Conflicto como Oportunidad de Aprendizaje Relacional",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Desacuerdos con Respeto</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Tener diferencias es natural en cualquier relación humana. La inteligencia emocional permite separar el problema de la persona, buscar puntos de encuentro y reparar heridas cuando ha habido malentendidos.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "ie-l9-2-evaluacion-m9",
                        "type": "quiz",
                        "title": "9.2 Evaluación: Gestión Saludable de Conflictos",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "ie-q9-1",
                                    "type": "multiple",
                                    "prompt": "¿Qué actitud favorece la resolución pacífica de un desacuerdo interpersonal?",
                                    "choices": [
                                        {"id": "a", "text": "Escuchar con curiosidad el punto de vista del otro y enfocarse en buscar acuerdos mutuamente beneficiosos.", "isCorrect": True},
                                        {"id": "b", "text": "Imponer el propio criterio a gritos hasta ganar la discusión.", "isCorrect": False},
                                        {"id": "c", "text": "Retirar la palabra y guardar rencor durante semanas.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 10 — PLAN DE INTELIGENCIA EMOCIONAL
            # ══════════════════════════════════════════════════════════
            {
                "id": "m10-plan-inteligencia-emocional",
                "title": "Módulo 10: Integración y Plan Personal de Inteligencia Emocional",
                "items": [
                    {
                        "id": "ie-l10-1-plan-personal",
                        "type": "html",
                        "title": "10.1 Tu Plan Maestro de Práctica y Conciencia Afectiva",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Consolidación de Hábitos Emocionales</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Reúne tus mapas afectivos, estrategias de pausa consciente, herramientas de comunicación y compromisos relacionales en tu plan maestro de desarrollo continuo.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "ie-l10-2-evaluacion-final",
                        "type": "quiz",
                        "title": "10.2 Evaluación Final del Programa de Inteligencia Emocional",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "ie-q10-1",
                                    "type": "truefalse",
                                    "prompt": "¿La inteligencia emocional es una competencia viva que se fortalece continuamente a través de la autoobservación y la práctica cotidiana?",
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
        <p class="text-lg font-semibold text-slate-800">
            Bienvenido al <strong>Curso de Inteligencia Emocional</strong> de Conexión Luz, un programa formativo estructurado para acompañarte en el desarrollo de la autoconciencia afectiva, la autorregulación consciente, la empatía y la comunicación interpersonal saludable.
        </p>
        <div class="bg-teal-50 border border-teal-200 rounded-2xl p-6 space-y-3">
            <h4 class="text-base font-bold text-teal-900 flex items-center gap-2">
                🌊 Competencias que desarrollarás:
            </h4>
            <ul class="list-disc list-inside space-y-2 text-sm text-teal-800">
                <li><strong>Autoconocimiento Afectivo:</strong> Identificación precisa de emociones y calibración de intensidad.</li>
                <li><strong>Autorregulación y Pausa Consciente:</strong> Práctica Detener → Respirar → Observar → Elegir.</li>
                <li><strong>Pensamiento Flexible:</strong> Reevaluación cognitiva de situaciones desafiantes.</li>
                <li><strong>Empatía y Validación:</strong> Escucha activa y acompañamiento sin juicios precipitados.</li>
                <li><strong>Comunicación Asertiva:</strong> Expresión clara de necesidades y resolución pacífica de conflictos.</li>
                <li><strong>Laboratorio, Retos y Certificado:</strong> Herramientas interactivas, rueda emocional y certificado de finalización.</li>
            </ul>
        </div>
    </div>
    """

    defaults = {
        "title": "INTELIGENCIA EMOCIONAL: Comprende tus emociones, desarrolla conciencia y mejora tu manera de relacionarte",
        "description": "Programa educativo diseñado para desarrollar conocimientos y habilidades relacionadas con el autoconocimiento emocional, autorregulación, empatía, comunicación, motivación y relaciones interpersonales.",
        "description_html": description_html,
        "category": "Inteligencia Emocional & Relaciones",
        "tags": [
            "Inteligencia Emocional", "Autoconocimiento", "Autorregulación", "Empatía",
            "Comunicación Asertiva", "Gestión de Conflictos", "Pausa Consciente", "Conexión Luz"
        ],
        "price_cop": 0,
        "cover_url": "/cursos/inteligencia_emocional_cover.png",
        "status": Course.Status.PUBLISHED,
        "is_active": True,
        "draft_content": content,
        "published_content": content
    }

    course, created = Course.objects.get_or_create(
        slug="inteligencia-emocional",
        defaults=defaults
    )

    if not created:
        for k, v in defaults.items():
            setattr(course, k, v)
        course.save()

    print(f"Curso Inteligencia Emocional {'creado' if created else 'actualizado'} exitosamente con ID: {course.id} | Slug: {course.slug}")

if __name__ == "__main__":
    create_ie_course()
