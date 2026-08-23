import os
import django
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Course

def create_ac_course():
    def gid(): return str(uuid.uuid4())

    content = {
        "version": 1,
        "sections": [
            # ══════════════════════════════════════════════════════════
            # MÓDULO 1 — EL VIAJE HACIA EL AUTOCONOCIMIENTO
            # ══════════════════════════════════════════════════════════
            {
                "id": "m1-viaje-autoconocimiento",
                "title": "Módulo 1: El Viaje hacia el Autoconocimiento",
                "items": [
                    {
                        "id": "ac-l1-1-bienvenida",
                        "type": "html",
                        "title": "1.1 Bienvenida y Fundamentos de la Autoobservación",
                        "html": """
                            <div class="space-y-6 select-text">
                                <div class="bg-gradient-to-r from-indigo-50 via-purple-50 to-teal-50 text-slate-900 rounded-3xl p-8 shadow-xs border border-indigo-100 relative overflow-hidden">
                                    <span class="text-xs font-black uppercase tracking-widest text-indigo-800 bg-white px-3.5 py-1 rounded-full border border-indigo-200 shadow-2xs">
                                        🪞 CONEXIÓN LUZ · EXPLORACIÓN INTERIOR
                                    </span>
                                    <h2 class="text-3xl md:text-4xl font-black mt-3 mb-2 tracking-tight text-slate-900">
                                        Bienvenido a Autoconocimiento
                                    </h2>
                                    <p class="text-slate-700 text-sm md:text-base leading-relaxed font-medium">
                                        "Conócete, comprende tu mundo interior y construye una relación más consciente contigo mismo."
                                    </p>
                                </div>

                                <div class="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-2xs">
                                    <h3 class="text-xl font-black text-slate-900">Objetivo del Programa</h3>
                                    <p class="text-slate-600 text-sm leading-relaxed">
                                        Acompañarte en un proceso estructurado para explorar tu identidad, valores, creencias, fortalezas, historia personal y patrones de conducta sin etiquetas rígidas ni diagnósticos.
                                    </p>
                                </div>

                                <div class="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 space-y-2">
                                    <h4 class="font-bold text-amber-950 text-sm flex items-center gap-2">
                                        ⚠️ Marco Ético y Formativo
                                    </h4>
                                    <p class="text-xs text-amber-900 leading-relaxed font-medium">
                                        El autoconocimiento es un proceso continuo de curiosidad y autoobservación, no un test que define tu personalidad de forma inmutable. Este curso es educativo y no sustituye la psicoterapia profesional.
                                    </p>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "ac-l1-2-observacion-sin-juicio",
                        "type": "html",
                        "title": "1.2 La Autoobservación sin Juicio",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Observar con Curiosidad en Lugar de Criticar</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Conocerse no significa juzgarse. La autoobservación consciente consiste en notar nuestros pensamientos, emociones y hábitos como si fuéramos un científico neutral y compasivo.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "ac-l1-3-evaluacion-m1",
                        "type": "quiz",
                        "title": "1.3 Evaluación: Fundamentos del Autoconocimiento",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "ac-q1-1",
                                    "type": "multiple",
                                    "prompt": "¿Cuál es la actitud más constructiva para iniciar un proceso de autoconocimiento?",
                                    "choices": [
                                        {"id": "a", "text": "Curiosidad abierta, amabilidad y autoobservación sin emitir juicios destructivos.", "isCorrect": True},
                                        {"id": "b", "text": "Buscar una etiqueta definitiva para encasillarse.", "isCorrect": False},
                                        {"id": "c", "text": "Culparse por los errores del pasado.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 2 — MI IDENTIDAD
            # ══════════════════════════════════════════════════════════
            {
                "id": "m2-mi-identidad",
                "title": "Módulo 2: Mi Identidad, Autoconcepto y Roles",
                "items": [
                    {
                        "id": "ac-l2-1-autoconcepto-roles",
                        "type": "html",
                        "title": "2.1 ¿Quién Soy Más Allá de Mis Roles?",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Diferenciando el Ser de los Roles</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Desempeñamos múltiples roles (hijo, profesional, pareja, amigo), pero nuestra identidad profunda abarca nuestros intereses, capacidades, valores y la forma única en que experimentamos el mundo.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "ac-l2-2-evaluacion-m2",
                        "type": "quiz",
                        "title": "2.2 Evaluación: Identidad y Autoconcepto",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "ac-q2-1",
                                    "type": "truefalse",
                                    "prompt": "¿El autoconcepto es una estructura viva y flexible que puede enriquecerse a lo largo de las diferentes etapas de la vida?",
                                    "correctBool": True
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 3 — VALORES Y PRINCIPIOS PERSONALES
            # ══════════════════════════════════════════════════════════
            {
                "id": "m3-valores-principios",
                "title": "Módulo 3: Valores, Principios y Coherencia Vital",
                "items": [
                    {
                        "id": "ac-l3-1-brujula-valores",
                        "type": "html",
                        "title": "3.1 La Brújula de Valores Rectores",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Elegir desde tus Propios Valores</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Muchas veces actuamos por inercia o por expectativas externas. Identificar tus 5 valores fundamentales te permite tomar decisiones alineadas con tu bienestar genuino.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "ac-l3-2-evaluacion-m3",
                        "type": "quiz",
                        "title": "3.2 Evaluación: Valores y Toma de Decisiones",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "ac-q3-1",
                                    "type": "multiple",
                                    "prompt": "¿Qué ocurre cuando tomamos decisiones en coherencia con nuestros valores personales?",
                                    "choices": [
                                        {"id": "a", "text": "Experimentamos mayor serenidad, autenticidad y satisfacción vital con el rumbo de nuestras vidas.", "isCorrect": True},
                                        {"id": "b", "text": "Nunca más tendremos que esforzarnos.", "isCorrect": False},
                                        {"id": "c", "text": "Todos a nuestro alrededor estarán obligados a pensar igual que nosotros.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 4 — FORTALEZAS Y ÁREAS DE CRECIMIENTO
            # ══════════════════════════════════════════════════════════
            {
                "id": "m4-fortalezas-crecimiento",
                "title": "Módulo 4: Recursos Personales e Inventario de Fortalezas",
                "items": [
                    {
                        "id": "ac-l4-1-recursos-internos",
                        "type": "html",
                        "title": "4.1 Reconocer y Apoyarte en tus Fortalezas",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Tus Recursos ya Desarrollados</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    El cerebro tiende a enfocarse en lo que nos falta. Hacer un inventario de fortalezas reales nos da la base de seguridad para afrontar áreas que deseamos aprender.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "ac-l4-2-evaluacion-m4",
                        "type": "quiz",
                        "title": "4.2 Evaluación: Fortalezas y Recursos",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "ac-q4-1",
                                    "type": "truefalse",
                                    "prompt": "¿Identificar una dificultad personal significa que nunca podremos desarrollar esa habilidad?",
                                    "correctBool": False
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 5 — MIS EMOCIONES
            # ══════════════════════════════════════════════════════════
            {
                "id": "m5-mis-emociones",
                "title": "Módulo 5: El Mundo Afectivo y las Señales Somáticas",
                "items": [
                    {
                        "id": "ac-l5-1-el-cuerpo-siente",
                        "type": "html",
                        "title": "5.1 Cómo se Manifiestan tus Emociones en el Cuerpo",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">El Mapa Somático de tus Emociones</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Cada emoción tiene una firma física particular en tu cuerpo (pecho, garganta, estómago, hombros). Aprender a escuchar esas señales tempranas previene el desborde emocional.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "ac-l5-2-evaluacion-m5",
                        "type": "quiz",
                        "title": "5.2 Evaluación: Conciencia Somática y Afectiva",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "ac-q5-1",
                                    "type": "multiple",
                                    "prompt": "¿Por qué es valioso prestar atención a las sensaciones corporales ante una emoción?",
                                    "choices": [
                                        {"id": "a", "text": "Porque el cuerpo detecta los cambios antes de que los procesemos conscientemente con palabras.", "isCorrect": True},
                                        {"id": "b", "text": "Porque el cuerpo siempre exagera.", "isCorrect": False},
                                        {"id": "c", "text": "Para asustarnos innecesariamente.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 6 — MIS PENSAMIENTOS Y CREENCIAS
            # ══════════════════════════════════════════════════════════
            {
                "id": "m6-pensamientos-creencias",
                "title": "Módulo 6: El Observador de Pensamientos y Creencias",
                "items": [
                    {
                        "id": "ac-l6-1-pensamientos-no-son-hechos",
                        "type": "html",
                        "title": "6.1 Un Pensamiento es una Hipótesis, no una Verdad Absoluta",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Desidentificación Cognitiva</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Tener un pensamiento ('no seré capaz') no significa que sea un hecho real. Aprender a observar los pensamientos como eventos mentales pasajeros nos brinda libertad interior.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "ac-l6-2-evaluacion-m6",
                        "type": "quiz",
                        "title": "6.2 Evaluación: Observación de Diálogo Interno",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "ac-q6-1",
                                    "type": "truefalse",
                                    "prompt": "¿Observar un pensamiento sin juzgarlo permite evaluar si es útil y contrastarlo con los hechos reales?",
                                    "correctBool": True
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 7 — MI HISTORIA PERSONAL
            # ══════════════════════════════════════════════════════════
            {
                "id": "m7-mi-historia-personal",
                "title": "Módulo 7: Mi Historia de Vida y Momentos de Transformación",
                "items": [
                    {
                        "id": "ac-l7-1-linea-de-vida",
                        "type": "html",
                        "title": "7.1 La Línea de Vida: Hitos, Crisis y Aprendizajes",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Comprender tu Trayectoria</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Revisar los momentos clave de tu historia te permite notar qué recursos utilizaste para salir adelante y cómo tus vivencias moldearon tu sabiduría actual.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "ac-l7-2-evaluacion-m7",
                        "type": "quiz",
                        "title": "7.2 Evaluación: Reflexión sobre la Historia de Vida",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "ac-q7-1",
                                    "type": "multiple",
                                    "prompt": "¿Cuál es el propósito formativo de reflexionar sobre nuestra historia personal?",
                                    "choices": [
                                        {"id": "a", "text": "Reconocer nuestra resiliencia, integrar lecciones pasadas y comprender cómo hemos crecido.", "isCorrect": True},
                                        {"id": "b", "text": "Quedarnos anclados en la culpa o en el pasado.", "isCorrect": False},
                                        {"id": "c", "text": "Echar la culpa de todo a la infancia.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 8 — MIS RELACIONES Y LÍMITES
            # ══════════════════════════════════════════════════════════
            {
                "id": "m8-relaciones-limites",
                "title": "Módulo 8: Relaciones, Reciprocidad y Límites Personales",
                "items": [
                    {
                        "id": "ac-l8-1-mapa-relaciones",
                        "type": "html",
                        "title": "8.1 Mapeo de Vínculos y Necesidades",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Los Vínculos que Nutren</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    El autoconocimiento se refleja en cómo nos relacionamos. Explorar qué aportamos y qué límites necesitamos cuidar en familia, pareja y amistades fortalece la reciprocidad.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "ac-l8-2-evaluacion-m8",
                        "type": "quiz",
                        "title": "8.2 Evaluación: Vínculos y Autonomía",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "ac-q8-1",
                                    "type": "truefalse",
                                    "prompt": "¿Establecer límites claros en las relaciones protege nuestra energía y ayuda a construir vínculos más honestos?",
                                    "correctBool": True
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 9 — MIS HÁBITOS Y PATRONES
            # ══════════════════════════════════════════════════════════
            {
                "id": "m9-habitos-patrones",
                "title": "Módulo 9: Identificación de Hábitos y Patrones Repetitivos",
                "items": [
                    {
                        "id": "ac-l9-1-detector-patrones",
                        "type": "html",
                        "title": "9.1 ¿Qué Patrones Repito en Piloto Automático?",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">De la Reacción a la Elección</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Detectar la secuencia Situación → Respuesta Automática → Consecuencia te permite insertar una pausa consciente y ensayar alternativas saludables.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "ac-l9-2-evaluacion-m9",
                        "type": "quiz",
                        "title": "9.2 Evaluación: Detección de Patrones",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "ac-q9-1",
                                    "type": "multiple",
                                    "prompt": "¿Qué se necesita para transformar un patrón de conducta automático?",
                                    "choices": [
                                        {"id": "a", "text": "Hacerlo consciente, comprender su disparador y practicar deliberadamente una respuesta alternativa.", "isCorrect": True},
                                        {"id": "b", "text": "Negar que el patrón exista.", "isCorrect": False},
                                        {"id": "c", "text": "Esperar a que cambie mágicamente sin ninguna acción.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 10 — MI MAPA PERSONAL
            # ══════════════════════════════════════════════════════════
            {
                "id": "m10-mapa-personal",
                "title": "Módulo 10: Integración: Mi Mapa de Autoconocimiento",
                "items": [
                    {
                        "id": "ac-l10-1-mapa-maestro",
                        "type": "html",
                        "title": "10.1 Tu Documento Integrador de Autoconocimiento",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Consolidación de tu Mundo Interior</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Reúne tu identidad, valores, recursos, aprendizajes históricos, vínculos y siguientes pasos en tu mapa maestro de autoconocimiento consciente.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "ac-l10-2-evaluacion-final",
                        "type": "quiz",
                        "title": "10.2 Evaluación Final del Programa de Autoconocimiento",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "ac-q10-1",
                                    "type": "truefalse",
                                    "prompt": "¿El autoconocimiento es un viaje continuo de autorreflexión y práctica consciente que evoluciona a lo largo de toda la vida?",
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
            Bienvenido al <strong>Curso de Autoconocimiento</strong> de Conexión Luz, un programa educativo diseñado para acompañarte en un proceso estructurado de introspección, exploración de tu identidad, clarificación de valores, reconocimiento de emociones y comprensión de tus patrones de vida.
        </p>
        <div class="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 space-y-3">
            <h4 class="text-base font-bold text-indigo-900 flex items-center gap-2">
                🪞 ¿Qué explorarás en este programa?
            </h4>
            <ul class="list-disc list-inside space-y-2 text-sm text-indigo-800">
                <li><strong>Identidad y Autoconcepto:</strong> Reconocimiento de quién eres más allá de los roles sociales.</li>
                <li><strong>Brújula de Valores:</strong> Selección y jerarquía de tus principios innegociables.</li>
                <li><strong>Recursos y Fortalezas:</strong> Inventario de capacidades consolidadas y áreas de crecimiento.</li>
                <li><strong>Línea de Vida Interactiva:</strong> Mapeo cronológico de hitos, crisis y lecciones formativas.</li>
                <li><strong>Vínculos y Patrones:</strong> Mapa de relaciones, límites saludables y detector de hábitos.</li>
                <li><strong>Laboratorio, Retos y Certificado:</strong> Herramientas interactivas, diario reflexivo y certificado oficial.</li>
            </ul>
        </div>
    </div>
    """

    defaults = {
        "title": "AUTOCONOCIMIENTO: Conócete, comprende tu mundo interior y construye una relación más consciente contigo mismo",
        "description": "Programa educativo diseñado para acompañar al estudiante en un proceso progresivo de exploración personal mediante ejercicios de reflexión, identificación de valores, reconocimiento de emociones, observación de pensamientos, análisis de hábitos, exploración de relaciones y construcción de objetivos personales.",
        "description_html": description_html,
        "category": "Autoconocimiento & Filosofía de Vida",
        "tags": [
            "Autoconocimiento", "Identidad", "Valores", "Fortalezas",
            "Línea de Vida", "Relaciones", "Patrones", "Introspección", "Conexión Luz"
        ],
        "price_cop": 0,
        "cover_url": "/cursos/autoconocimiento_cover.png",
        "status": Course.Status.PUBLISHED,
        "is_active": True,
        "draft_content": content,
        "published_content": content
    }

    course, created = Course.objects.get_or_create(
        slug="autoconocimiento",
        defaults=defaults
    )

    if not created:
        for k, v in defaults.items():
            setattr(course, k, v)
        course.save()

    print(f"Curso Autoconocimiento {'creado' if created else 'actualizado'} exitosamente con ID: {course.id} | Slug: {course.slug}")

if __name__ == "__main__":
    create_ac_course()
