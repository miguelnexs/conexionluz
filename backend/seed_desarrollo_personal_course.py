import os
import django
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Course

def create_dp_course():
    def gid(): return str(uuid.uuid4())

    content = {
        "version": 1,
        "sections": [
            # ══════════════════════════════════════════════════════════
            # MÓDULO 1 — CONÓCETE A TI MISMO
            # ══════════════════════════════════════════════════════════
            {
                "id": "m1-conocete-a-ti-mismo",
                "title": "Módulo 1: Conócete a Ti Mismo y Autoobservación",
                "items": [
                    {
                        "id": "dp-l1-1-bienvenida",
                        "type": "html",
                        "title": "1.1 Bienvenida al Viaje del Desarrollo Personal",
                        "html": """
                            <div class="space-y-6 select-text">
                                <div class="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 text-slate-900 rounded-3xl p-8 shadow-xs border border-emerald-100 relative overflow-hidden">
                                    <span class="text-xs font-black uppercase tracking-widest text-emerald-800 bg-white px-3.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
                                        🌱 CONEXIÓN LUZ · CRECIMIENTO CONSCIENTE
                                    </span>
                                    <h2 class="text-3xl md:text-4xl font-black mt-3 mb-2 tracking-tight text-slate-900">
                                        Bienvenido a Desarrollo Personal
                                    </h2>
                                    <p class="text-slate-700 text-sm md:text-base leading-relaxed font-medium">
                                        "Un camino progresivo de autoconocimiento, claridad, hábitos y transformación consciente."
                                    </p>
                                </div>

                                <div class="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-2xs">
                                    <h3 class="text-xl font-black text-slate-900">Objetivo del Programa</h3>
                                    <p class="text-slate-600 text-sm leading-relaxed">
                                        Acompañarte en un proceso estructurado para comprender tus patrones personales, clarificar tus valores, construir hábitos sólidos, fortalecer tu inteligencia emocional y diseñar un plan de vida coherente y sostenible.
                                    </p>
                                </div>

                                <div class="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 space-y-2">
                                    <h4 class="font-bold text-amber-950 text-sm flex items-center gap-2">
                                        ⚠️ Marco Ético y Realista
                                    </h4>
                                    <p class="text-xs text-amber-900 leading-relaxed font-medium">
                                        El desarrollo personal es un camino gradual de práctica y autorreflexión, no una fórmula mágica de éxito instantáneo. Este programa es formativo y educativo, no sustituye la psicoterapia ni la atención clínica profesional.
                                    </p>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "dp-l1-2-autoconocimiento",
                        "type": "html",
                        "title": "1.2 La Importancia del Autoconocimiento",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">¿Por qué el Autoconocimiento es el Primer Paso?</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    No podemos transformar aquello que no conocemos. El autoconocimiento nos permite identificar nuestras fortalezas, áreas de mejora, valores fundamentales y los sesgos automáticos con los que respondemos ante la vida.
                                </p>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                                        <h4 class="font-bold text-emerald-950 text-sm mb-1">🔍 Autoobservación Sin Juicio</h4>
                                        <p class="text-xs text-slate-600">Aprender a notar nuestros pensamientos y reacciones con curiosidad en lugar de autocrítica destructiva.</p>
                                    </div>
                                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                                        <h4 class="font-bold text-teal-950 text-sm mb-1">🧭 Identidad y Valores</h4>
                                        <p class="text-xs text-slate-600">Reconocer qué principios éticos y humanos son verdaderamente importantes para nosotros.</p>
                                    </div>
                                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                                        <h4 class="font-bold text-indigo-950 text-sm mb-1">🎯 Responsabilidad Personal</h4>
                                        <p class="text-xs text-slate-600">Asumir la capacidad de elegir nuestra respuesta ante las circunstancias cotidianas.</p>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "dp-l1-3-evaluacion-m1",
                        "type": "quiz",
                        "title": "1.3 Evaluación: Fundamentos del Autoconocimiento",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "dp-q1-1",
                                    "type": "multiple",
                                    "prompt": "¿Por qué el autoconocimiento es la base indispensable de todo crecimiento personal genuino?",
                                    "choices": [
                                        {"id": "a", "text": "Porque permite alinear nuestras metas con lo que realmente somos y valoramos, en lugar de seguir expectativas ajenas.", "isCorrect": True},
                                        {"id": "b", "text": "Porque garantiza que nunca volveremos a cometer errores.", "isCorrect": False},
                                        {"id": "c", "text": "Porque elimina instantáneamente todas las dificultades de la vida.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 2 — AUTOESTIMA Y AUTOCONFIANZA
            # ══════════════════════════════════════════════════════════
            {
                "id": "m2-autoestima-autoconfianza",
                "title": "Módulo 2: Autoestima, Autoconfianza y Diálogo Interno",
                "items": [
                    {
                        "id": "dp-l2-1-autoestima-vs-autoconfianza",
                        "type": "html",
                        "title": "2.1 Autoestima vs. Autoconfianza",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Comprendiendo la Diferencia</h2>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="p-5 bg-teal-50 border border-teal-200 rounded-2xl">
                                        <h3 class="font-bold text-teal-950 text-base mb-1">Autoestima (Ser y Valor Incondicional)</h3>
                                        <p class="text-xs text-teal-900 leading-relaxed">El aprecio, respeto y aceptación incondicional hacia uno mismo como ser humano, independiente de los éxitos o fracasos puntuales.</p>
                                    </div>
                                    <div class="p-5 bg-indigo-50 border border-indigo-200 rounded-2xl">
                                        <h3 class="font-bold text-indigo-950 text-base mb-1">Autoconfianza (Hacer y Capacidad)</h3>
                                        <p class="text-xs text-indigo-900 leading-relaxed">La creencia en la propia capacidad para aprender, resolver desafíos y ejecutar tareas específicas basada en la práctica y experiencia.</p>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "dp-l2-2-evaluacion-m2",
                        "type": "quiz",
                        "title": "2.2 Evaluación: Diálogo Interno y Autoaceptación",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "dp-q2-1",
                                    "type": "truefalse",
                                    "prompt": "¿La autoconfianza se construye a través de la práctica, la experiencia y la acumulación gradual de evidencias reales?",
                                    "correctBool": True
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 3 — VALORES, PROPÓSITO Y DIRECCIÓN
            # ══════════════════════════════════════════════════════════
            {
                "id": "m3-valores-proposito",
                "title": "Módulo 3: Valores Personales, Propósito y Dirección",
                "items": [
                    {
                        "id": "dp-l3-1-brujula-valores",
                        "type": "html",
                        "title": "3.1 La Brújula de Valores Personales",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Valores: El Faro de Nuestras Decisiones</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Los valores no son metas que se alcanzan y se tachan; son direcciones vitales continuas que orientan nuestra conducta diaria (ej: aprendizaje, libertad, familia, honestidad, creatividad).
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "dp-l3-2-evaluacion-m3",
                        "type": "quiz",
                        "title": "3.2 Evaluación: Clarificación de Valores",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "dp-q3-1",
                                    "type": "multiple",
                                    "prompt": "¿Cuál es la diferencia fundamental entre una meta y un valor personal?",
                                    "choices": [
                                        {"id": "a", "text": "Una meta es un destino alcanzable puntual; un valor es una dirección continua que guía nuestras decisiones diarias.", "isCorrect": True},
                                        {"id": "b", "text": "Los valores solo sirven para escribir cartas.", "isCorrect": False},
                                        {"id": "c", "text": "No existe ninguna diferencia.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 4 — METAS Y OBJETIVOS
            # ══════════════════════════════════════════════════════════
            {
                "id": "m4-metas-objetivos",
                "title": "Módulo 4: Metas Claras y Planificación SMART",
                "items": [
                    {
                        "id": "dp-l4-1-metodologia-smart",
                        "type": "html",
                        "title": "4.1 Cómo Formular Objetivos Concretos (SMART)",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">De Deseos Vagos a Metas Precisas</h2>
                                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl"><strong>S</strong> - Específico</div>
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl"><strong>M</strong> - Medible</div>
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl"><strong>A</strong> - Alcanzable</div>
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl"><strong>R</strong> - Relevante</div>
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl"><strong>T</strong> - Temporal</div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "dp-l4-2-evaluacion-m4",
                        "type": "quiz",
                        "title": "4.2 Evaluación: Construcción de Objetivos",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "dp-q4-1",
                                    "type": "truefalse",
                                    "prompt": "¿Un objetivo como 'quiero ser más feliz' es un objetivo SMART bien formulado?",
                                    "correctBool": False
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 5 — HÁBITOS Y DISCIPLINA
            # ══════════════════════════════════════════════════════════
            {
                "id": "m5-habitos-disciplina",
                "title": "Módulo 5: Creación y Mantenimiento de Hábitos",
                "items": [
                    {
                        "id": "dp-l5-1-el-bucle-del-habito",
                        "type": "html",
                        "title": "5.1 La Neurobiología y el Bucle del Hábito",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Señal → Rutina → Recompensa</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    El cerebro automatiza conductas para ahorrar energía. Diseñar el entorno facilitando la señal inicial es más efectivo que depender únicamente de la fuerza de voluntad.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "dp-l5-2-evaluacion-m5",
                        "type": "quiz",
                        "title": "5.2 Evaluación: Psicología de los Hábitos",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "dp-q5-1",
                                    "type": "multiple",
                                    "prompt": "¿Cuál es la estrategia más eficaz para consolidar un hábito nuevo?",
                                    "choices": [
                                        {"id": "a", "text": "Empezar con una versión minúscula y constante vinculada a una señal existente en la rutina diaria.", "isCorrect": True},
                                        {"id": "b", "text": "Intentar cambiar 15 hábitos difíciles de golpe el mismo día.", "isCorrect": False},
                                        {"id": "c", "text": "Castigarse duramente si se olvida un día.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 6 — MOTIVACIÓN Y ACCIÓN
            # ══════════════════════════════════════════════════════════
            {
                "id": "m6-motivacion-accion",
                "title": "Módulo 6: Motivación, Acción y Superación de la Procrastinación",
                "items": [
                    {
                        "id": "dp-l6-1-del-pensamiento-a-la-accion",
                        "type": "html",
                        "title": "6.1 La Acción Precede a la Motivación",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Superando el Bloqueo Inicial</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    La trampa más habitual es creer que debemos 'sentir ganas' antes de actuar. Dar el primer paso pequeño (la regla de los 2 minutos) genera el impulso biológico que activa la motivación.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "dp-l6-2-evaluacion-m6",
                        "type": "quiz",
                        "title": "6.2 Evaluación: Iniciativa y Constancia",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "dp-q6-1",
                                    "type": "truefalse",
                                    "prompt": "¿Esperar pasivamente a que llegue la motivación perfecta suele alimentar el ciclo de la procrastinación?",
                                    "correctBool": True
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 7 — INTELIGENCIA EMOCIONAL
            # ══════════════════════════════════════════════════════════
            {
                "id": "m7-inteligencia-emocional",
                "title": "Módulo 7: Inteligencia Emocional y Autorregulación",
                "items": [
                    {
                        "id": "dp-l7-1-gestion-emocional",
                        "type": "html",
                        "title": "7.1 Nombrar para Calmar: La Neurociencia Afectiva",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Nombrar y Regular las Emociones</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Poner palabras precisas a lo que sentimos activa la corteza prefrontal y reduce la reactividad de la amígdala cerebral, permitiendo responder con serenidad.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "dp-l7-2-evaluacion-m7",
                        "type": "quiz",
                        "title": "7.2 Evaluación: Autorregulación Emocional",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "dp-q7-1",
                                    "type": "multiple",
                                    "prompt": "¿Qué significa autorregular una emoción?",
                                    "choices": [
                                        {"id": "a", "text": "Reconocer la emoción, comprender su mensaje y modular nuestra respuesta sin reprimirla ni desbordarnos.", "isCorrect": True},
                                        {"id": "b", "text": "Fingir que no sentimos nada en absoluto.", "isCorrect": False},
                                        {"id": "c", "text": "Explotar impulsivamente ante cualquier estímulo.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 8 — COMUNICACIÓN Y RELACIONES
            # ══════════════════════════════════════════════════════════
            {
                "id": "m8-comunicacion-relaciones",
                "title": "Módulo 8: Comunicación Asertiva, Empatía y Límites",
                "items": [
                    {
                        "id": "dp-l8-1-asertividad-y-limites",
                        "type": "html",
                        "title": "8.1 El Arte de Decir 'No' con Respeto y Asertividad",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Límites Personales Saludables</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    La asertividad es el punto de equilibrio entre la pasividad (anularse uno mismo) y la agresividad (atropellar a los demás). Establecer límites claros protege nuestras relaciones y nuestro bienestar.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "dp-l8-2-evaluacion-m8",
                        "type": "quiz",
                        "title": "8.2 Evaluación: Comunicación Asertiva",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "dp-q8-1",
                                    "type": "truefalse",
                                    "prompt": "¿Poner un límite con asertividad y amabilidad es una muestra de cuidado y respeto tanto por uno mismo como por la relación?",
                                    "correctBool": True
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 9 — RESILIENCIA Y CRECIMIENTO
            # ══════════════════════════════════════════════════════════
            {
                "id": "m9-resiliencia-crecimiento",
                "title": "Módulo 9: Resiliencia, Flexibilidad y Aprendizaje",
                "items": [
                    {
                        "id": "dp-l9-1-mente-flexible",
                        "type": "html",
                        "title": "9.1 Resiliencia: Flexibilidad ante la Adversidad",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Aprender de las Dificultades</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    La resiliencia no significa no sentir dolor o frustración, sino tener la capacidad psicológica de adaptarse, buscar apoyo y reconstruir el rumbo con nuevos aprendizajes.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "dp-l9-2-evaluacion-m9",
                        "type": "quiz",
                        "title": "9.2 Evaluación: Flexibilidad y Adaptabilidad",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "dp-q9-1",
                                    "type": "multiple",
                                    "prompt": "¿Qué caracteriza a una mentalidad de crecimiento ante los errores?",
                                    "choices": [
                                        {"id": "a", "text": "Percibir el error como información valiosa para ajustar la estrategia y seguir aprendiendo.", "isCorrect": True},
                                        {"id": "b", "text": "Creer que fallar una vez demuestra una incapacidad definitiva.", "isCorrect": False},
                                        {"id": "c", "text": "Negar que el error haya ocurrido.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 10 — PLAN DE DESARROLLO PERSONAL
            # ══════════════════════════════════════════════════════════
            {
                "id": "m10-plan-desarrollo-personal",
                "title": "Módulo 10: Integración y Plan Personal de Crecimiento",
                "items": [
                    {
                        "id": "dp-l10-1-disena-tu-plan",
                        "type": "html",
                        "title": "10.1 Los 10 Pilares del Plan Personal",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Integración de tu Plan Personal</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Consolida tu mapa de autoconocimiento, brújula de valores, metas SMART, hábitos prioritarios y compromisos de autocuidado en tu plan maestro de crecimiento personal.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "dp-l10-2-evaluacion-final",
                        "type": "quiz",
                        "title": "10.2 Evaluación Final del Programa de Desarrollo Personal",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "dp-q10-1",
                                    "type": "truefalse",
                                    "prompt": "¿El desarrollo personal es un proceso continuo que evoluciona a lo largo de toda la vida a través de la práctica consciente?",
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
            Bienvenido al <strong>Curso de Desarrollo Personal</strong> de Conexión Luz, un programa educativo diseñado para acompañarte en un camino estructurado de autoconocimiento, claridad de valores, construcción de hábitos y transformación consciente.
        </p>
        <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-3">
            <h4 class="text-base font-bold text-emerald-900 flex items-center gap-2">
                🌱 ¿Qué aprenderás en este programa?
            </h4>
            <ul class="list-disc list-inside space-y-2 text-sm text-emerald-800">
                <li><strong>Autoconocimiento y Fortalezas:</strong> Mapa de identidad y autoobservación consciente.</li>
                <li><strong>Autoestima y Autoconfianza:</strong> Transformación del diálogo interno y evidencias de capacidad.</li>
                <li><strong>Valores y Dirección:</strong> Brújula de prioridades y decisiones coherentes.</li>
                <li><strong>Metas y Hábitos:</strong> Metodología SMART y seguimiento diario de hábitos sostenibles.</li>
                <li><strong>Inteligencia Emocional y Asertividad:</strong> Regulación afectiva, escucha activa y límites saludables.</li>
                <li><strong>Laboratorio, Retos y Certificado:</strong> Prácticas interactivas, retos de 7 días y certificado de finalización.</li>
            </ul>
        </div>
    </div>
    """

    defaults = {
        "title": "DESARROLLO PERSONAL: Un camino de autoconocimiento, crecimiento y transformación consciente",
        "description": "Programa educativo diseñado para acompañar al estudiante en un proceso estructurado de autoconocimiento, definición de objetivos, construcción de hábitos, inteligencia emocional, comunicación, resiliencia y planificación personal.",
        "description_html": description_html,
        "category": "Desarrollo Personal & Crecimiento",
        "tags": [
            "Desarrollo Personal", "Autoconocimiento", "Autoestima", "Hábitos",
            "Metas SMART", "Valores", "Inteligencia Emocional", "Asertividad", "Resiliencia", "Conexión Luz"
        ],
        "price_cop": 0,
        "cover_url": "/cursos/desarrollo_personal_cover.png",
        "status": Course.Status.PUBLISHED,
        "is_active": True,
        "draft_content": content,
        "published_content": content
    }

    course, created = Course.objects.get_or_create(
        slug="desarrollo-personal",
        defaults=defaults
    )

    if not created:
        for k, v in defaults.items():
            setattr(course, k, v)
        course.save()

    print(f"Curso Desarrollo Personal {'creado' if created else 'actualizado'} exitosamente con ID: {course.id} | Slug: {course.slug}")

if __name__ == "__main__":
    create_dp_course()
