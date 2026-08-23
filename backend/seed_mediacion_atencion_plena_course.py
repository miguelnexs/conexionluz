import os
import django
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Course

def create_mediacion_course():
    def gid(): return str(uuid.uuid4())

    content = {
        "version": 1,
        "sections": [
            # ══════════════════════════════════════════════════════════
            # MÓDULO 1 — EL PRESENTE COMO CAMPO DE OBSERVACIÓN
            # ══════════════════════════════════════════════════════════
            {
                "id": "m1-presente-observacion",
                "title": "Módulo 1: El Presente como Campo de Observación",
                "items": [
                    {
                        "id": "map-l1-1-bienvenida",
                        "type": "html",
                        "title": "1.1 Bienvenida y Fundamentos de la Atención Plena",
                        "html": """
                            <div class="space-y-6 select-text">
                                <div class="bg-gradient-to-r from-teal-50 via-emerald-50 to-indigo-50 text-slate-900 rounded-3xl p-8 shadow-xs border border-teal-100 relative overflow-hidden">
                                    <span class="text-xs font-black uppercase tracking-widest text-teal-800 bg-white px-3.5 py-1 rounded-full border border-teal-200 shadow-2xs">
                                        🧘 CONEXIÓN LUZ · CONCIENCIA Y PRESENCIA
                                    </span>
                                    <h2 class="text-3xl md:text-4xl font-black mt-3 mb-2 tracking-tight text-slate-900">
                                        Mediación y Atención Plena
                                    </h2>
                                    <p class="text-slate-700 text-sm md:text-base leading-relaxed font-medium">
                                        "Observación interna y externa de la realidad presente a través de la conciencia."
                                    </p>
                                </div>

                                <div class="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-2xs">
                                    <h3 class="text-xl font-black text-slate-900">¿Qué entendemos por Atención Plena en ConexiónLuz?</h3>
                                    <p class="text-slate-600 text-sm leading-relaxed">
                                        La atención plena no consiste en dejar la mente en blanco, ni en forzarte a no sentir, ni en evadir la realidad cotidiana. Consiste en la capacidad intencional de <strong>observar la experiencia tal como ocurre</strong>, en este instante exacto, con apertura, claridad y sin juicio reactivo.
                                    </p>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                            <h4 class="font-bold text-xs uppercase text-slate-500 mb-1">Lo que NO es este curso</h4>
                                            <ul class="text-xs text-slate-600 space-y-1 list-disc list-inside">
                                                <li>No es escapar de los pensamientos.</li>
                                                <li>No es eliminar o reprimir emociones.</li>
                                                <li>No es una práctica esotérica o mística.</li>
                                            </ul>
                                        </div>
                                        <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                                            <h4 class="font-bold text-xs uppercase text-emerald-800 mb-1">El Enfoque Pedagógico</h4>
                                            <ul class="text-xs text-emerald-900 space-y-1 list-disc list-inside">
                                                <li>Observar → Reconocer → Comprender.</li>
                                                <li>Integrar lo interno con lo externo.</li>
                                                <li>Responder conscientemente en el presente.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "map-l1-2-realidades",
                        "type": "html",
                        "title": "1.2 Realidad Interna y Realidad Externa",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Dos Dimensiones de la Misma Experiencia</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    En cada instante de tu vida están ocurriendo dos flujos continuos de información que convergen en tu conciencia:
                                </p>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-6 space-y-3">
                                        <h3 class="text-lg font-black text-indigo-900 flex items-center gap-2">
                                            🧠 Realidad Interna
                                        </h3>
                                        <p class="text-xs text-indigo-800 leading-relaxed">
                                            Pensamientos, emociones, sensaciones corporales, recuerdos, impulsos, interpretaciones y estados fisiológicos. Ocurren dentro del espacio subjetivo de tu mente y cuerpo.
                                        </p>
                                    </div>
                                    <div class="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 space-y-3">
                                        <h3 class="text-lg font-black text-emerald-900 flex items-center gap-2">
                                            🌍 Realidad Externa
                                        </h3>
                                        <p class="text-xs text-emerald-800 leading-relaxed">
                                            El entorno físico, sonidos, estímulos visuales, temperaturas, personas, acontecimientos y dinámicas del ambiente.
                                        </p>
                                    </div>
                                </div>
                                <div class="bg-teal-50 border border-teal-200 rounded-2xl p-5">
                                    <p class="text-sm font-bold text-teal-900">
                                        Principio Fundamental: "Observar lo que ocurre dentro de mí mientras observo lo que ocurre fuera de mí, reconociendo que ambas experiencias están ocurriendo en el presente."
                                    </p>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "map-l1-3-practica-360",
                        "type": "html",
                        "title": "1.3 Práctica: Observación 360°",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Práctica: Observación 360°</h2>
                                <p class="text-slate-700 leading-relaxed">
                                    Tómate 3 minutos para sentarte cómodamente y recorrer con tu atención estos 7 aspectos sin intentar cambiar nada:
                                </p>
                                <ol class="list-decimal list-inside space-y-2 text-slate-700 text-sm font-medium bg-white p-6 rounded-2xl border border-slate-200">
                                    <li><strong>Cuerpo:</strong> Nota los puntos de apoyo de tu cuerpo sobre la silla y el suelo.</li>
                                    <li><strong>Respiración:</strong> Siente el aire entrando y saliendo sin forzar el ritmo.</li>
                                    <li><strong>Pensamientos:</strong> Observa qué frases o imágenes cruzan por tu mente.</li>
                                    <li><strong>Emociones:</strong> Identifica el tono afectivo de este instante (calma, prisa, curiosidad).</li>
                                    <li><strong>Sonidos:</strong> Escucha los ruidos lejanos y cercanos sin etiquetarlos como molestos.</li>
                                    <li><strong>Entorno:</strong> Siente la luz, la temperatura y la amplitud del espacio.</li>
                                    <li><strong>Movimiento:</strong> Registra los micromovimientos involuntarios de tu postura.</li>
                                </ol>
                            </div>
                        """
                    },
                    {
                        "id": "map-l1-4-quiz",
                        "type": "quiz",
                        "title": "1.4 Evaluación: El Campo del Presente",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "map-q1-1",
                                    "type": "multiple",
                                    "prompt": "¿Cuál es el objetivo primordial de la atención plena en este curso?",
                                    "choices": [
                                        {"id": "a", "text": "Observar la realidad interna y externa en el presente sin quedar automáticamente absorbido por ella.", "isCorrect": True},
                                        {"id": "b", "text": "Poner la mente completamente en blanco y bloquear cualquier emoción negativa.", "isCorrect": False},
                                        {"id": "c", "text": "Aislarse del entorno exterior para concentrarse exclusivamente en visiones místicas.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 2 — MEDIACIÓN
            # ══════════════════════════════════════════════════════════
            {
                "id": "m2-mediacion-concepto",
                "title": "Módulo 2: Mediación (El Concepto Central)",
                "items": [
                    {
                        "id": "map-l2-1-que-es-mediacion",
                        "type": "html",
                        "title": "2.1 ¿Qué es Mediación y cómo se diferencia de la Meditación?",
                        "html": """
                            <div class="space-y-6 select-text">
                                <div class="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-6">
                                    <h2 class="text-2xl md:text-3xl font-black text-slate-900">La Mediación en ConexiónLuz</h2>
                                    <p class="text-slate-700 text-sm mt-2 font-medium">
                                        En ConexiónLuz, la <strong>Mediación</strong> es una práctica de observación consciente y activa en la que el ser humano aprende a colocarse en el punto de encuentro entre su mundo interno y el mundo externo.
                                    </p>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="bg-white p-5 rounded-2xl border border-slate-200">
                                        <h3 class="font-black text-slate-900 text-base mb-2">Meditación Tradicional</h3>
                                        <p class="text-xs text-slate-600 leading-relaxed">
                                            Frecuentemente enfocada en el repliegue interno, la concentración en un solo punto (mantra o respiración) o el aislamiento del estímulo exterior.
                                        </p>
                                    </div>
                                    <div class="bg-white p-5 rounded-2xl border border-teal-200">
                                        <h3 class="font-black text-teal-900 text-base mb-2">Práctica de Mediación</h3>
                                        <p class="text-xs text-teal-800 leading-relaxed">
                                            Entrenamiento de la <strong>simultaneidad</strong>: observar lo que siento y pienso MIENTRAS estoy presente en lo que ocurre a mi alrededor, permitiendo una relación lúcida y activa con la vida cotidiana.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "map-l2-2-simultaneidad",
                        "type": "html",
                        "title": "2.2 Simultaneidad: Observar Dentro y Fuera a la Vez",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl font-black text-slate-900">La Capacidad de Simultaneidad</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    La mente no entrenada tiende a oscilar de forma reactiva: o se pierde en pensamientos rumiantes ignorando lo que pasa afuera, o es arrastrada por los estímulos del entorno olvidándose de su propio estado corporal.
                                </p>
                                <p class="text-slate-700 leading-relaxed">
                                    La mediación crea un puente: amplía el campo de conciencia para abarcar tanto el sensorio interno como el sensorio externo en un solo presente integrado.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "map-l2-3-quiz",
                        "type": "quiz",
                        "title": "2.3 Evaluación: Principios de la Mediación",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "map-q2-1",
                                    "type": "multiple",
                                    "prompt": "¿Qué distingue principalmente a la 'Mediación' en este programa pedagógico?",
                                    "choices": [
                                        {"id": "a", "text": "La observación simultánea de la realidad interna y externa en el presente.", "isCorrect": True},
                                        {"id": "b", "text": "La exigencia de entrar en un trance hipnótico profundo sin recordar nada.", "isCorrect": False},
                                        {"id": "c", "text": "La búsqueda de escapar del cuerpo y las sensaciones físicas.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 3 — METACOGNICIÓN
            # ══════════════════════════════════════════════════════════
            {
                "id": "m3-metacognicion",
                "title": "Módulo 3: Metacognición",
                "items": [
                    {
                        "id": "map-l3-1-que-es-metacognicion",
                        "type": "html",
                        "title": "3.1 La Capacidad de Pensar sobre el Pensamiento",
                        "html": """
                            <div class="space-y-6 select-text">
                                <div class="bg-indigo-50 border border-indigo-200 rounded-3xl p-6">
                                    <h2 class="text-2xl font-black text-indigo-950">¿Qué es la Metacognición?</h2>
                                    <p class="text-slate-700 text-sm mt-2 font-medium">
                                        Es la habilidad humana de observar, supervisar y reflexionar sobre los propios procesos cognitivos: pensamientos, suposiciones, atajos mentales y patrones interpretativos.
                                    </p>
                                </div>
                                <div class="space-y-4">
                                    <h3 class="text-lg font-black text-slate-900">Las Preguntas Metacognitivas Clave</h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700 font-medium">
                                        <div class="p-3 bg-white border border-slate-200 rounded-xl">❓ ¿Qué estoy pensando exactamente ahora?</div>
                                        <div class="p-3 bg-white border border-slate-200 rounded-xl">❓ ¿Cómo estoy construyendo este razonamiento?</div>
                                        <div class="p-3 bg-white border border-slate-200 rounded-xl">❓ ¿Por qué interpreto esta situación de esta manera?</div>
                                        <div class="p-3 bg-white border border-slate-200 rounded-xl">❓ ¿Qué estoy dando por sentado o suponiendo?</div>
                                        <div class="p-3 bg-white border border-slate-200 rounded-xl">❓ ¿Qué datos objetivos estoy ignorando?</div>
                                        <div class="p-3 bg-white border border-slate-200 rounded-xl">❓ ¿Estoy confundiendo una interpretación subjetiva con un hecho real?</div>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "map-l3-2-observador-pensamiento",
                        "type": "html",
                        "title": "3.2 Diferenciar Pensamiento de Observación del Pensamiento",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl font-black text-slate-900">Crear Distancia Observacional</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Fusión cognitiva es decir: <em>"No soy capaz de resolver esto"</em>.
                                    Metacognición es reconocer: <strong>"Estoy observando el pensamiento de que 'no soy capaz de resolver esto'"</strong>.
                                </p>
                                <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-950 font-medium space-y-2">
                                    <p>✨ <strong>No enseñamos que los pensamientos son malos ni que deban eliminarse.</strong></p>
                                    <p>Enseñamos que un pensamiento puede ser observado antes de convertirse automáticamente en una conducta o reacción impulsiva.</p>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "map-l3-3-quiz",
                        "type": "quiz",
                        "title": "3.3 Evaluación: Procesos Metacognitivos",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "map-q3-1",
                                    "type": "multiple",
                                    "prompt": "¿Cuál de las siguientes frases ejemplifica una postura metacognitiva?",
                                    "choices": [
                                        {"id": "a", "text": "Me doy cuenta de que estoy interpretando el silencio del otro como un rechazo.", "isCorrect": True},
                                        {"id": "b", "text": "Sé con certeza absoluta que todos están en mi contra.", "isCorrect": False},
                                        {"id": "c", "text": "Tengo que obligarme a no pensar en nada durante todo el día.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 4 — METACONCIENCIA
            # ══════════════════════════════════════════════════════════
            {
                "id": "m4-metaconciencia",
                "title": "Módulo 4: Metaconciencia",
                "items": [
                    {
                        "id": "map-l4-1-esquema-niveles",
                        "type": "html",
                        "title": "4.1 El Esquema de los 4 Niveles de Conciencia",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">El Esquema Central del Curso</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    En este curso estructuramos la progresión de la conciencia a través del siguiente marco pedagógico:
                                </p>
                                <div class="space-y-3">
                                    <div class="bg-slate-100 p-4 rounded-2xl border border-slate-200">
                                        <span class="text-xs font-black text-slate-500 uppercase">1. Conciencia Básica</span>
                                        <p class="text-sm font-bold text-slate-800 mt-1">"Estoy pensando / sintiendo algo."</p>
                                    </div>
                                    <div class="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                                        <span class="text-xs font-black text-blue-700 uppercase">2. Metaconciencia</span>
                                        <p class="text-sm font-bold text-blue-900 mt-1">"Me doy cuenta de que estoy pensando y sintiendo esto en este momento."</p>
                                    </div>
                                    <div class="bg-purple-50 p-4 rounded-2xl border border-purple-200">
                                        <span class="text-xs font-black text-purple-700 uppercase">3. Metacognición</span>
                                        <p class="text-sm font-bold text-purple-900 mt-1">"Observo cómo estoy construyendo ese pensamiento y qué sesgos están operando."</p>
                                    </div>
                                    <div class="bg-emerald-50 p-4 rounded-2xl border border-emerald-300">
                                        <span class="text-xs font-black text-emerald-800 uppercase">4. Mediación</span>
                                        <p class="text-sm font-bold text-emerald-950 mt-1">"Observo mi pensamiento, mi emoción, mi cuerpo y el entorno simultáneamente, dentro de la experiencia presente."</p>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "map-l4-2-practica-me-doy-cuenta",
                        "type": "html",
                        "title": "4.2 Práctica: 'Me doy cuenta de que...'",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl font-black text-slate-900">Entrenamiento de la Metaconciencia</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Practica completar mentalmente o en tu diario las siguientes afirmaciones observacionales:
                                </p>
                                <ul class="space-y-2 text-sm text-slate-700 font-semibold bg-white p-6 rounded-2xl border border-slate-200">
                                    <li class="p-2 bg-slate-50 rounded-lg">🔹 "Me doy cuenta de que estoy pensando..."</li>
                                    <li class="p-2 bg-slate-50 rounded-lg">🔹 "Me doy cuenta de que estoy sintiendo..."</li>
                                    <li class="p-2 bg-slate-50 rounded-lg">🔹 "Me doy cuenta de que estoy interpretando..."</li>
                                    <li class="p-2 bg-slate-50 rounded-lg">🔹 "Me doy cuenta de que mi atención se había desviado hacia..."</li>
                                </ul>
                            </div>
                        """
                    },
                    {
                        "id": "map-l4-3-quiz",
                        "type": "quiz",
                        "title": "4.3 Evaluación: Niveles de Observación",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "map-q4-1",
                                    "type": "multiple",
                                    "prompt": "¿Qué representa la expresión 'Me doy cuenta de que estoy pensando'?",
                                    "choices": [
                                        {"id": "a", "text": "Metaconciencia: la observación consciente y reflexiva de la propia experiencia en curso.", "isCorrect": True},
                                        {"id": "b", "text": "Una distracción que debe ser eliminada inmediatamente.", "isCorrect": False},
                                        {"id": "c", "text": "Un fallo en la capacidad de concentración.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 5 — OBSERVACIÓN DEL SISTEMA EMOCIONAL
            # ══════════════════════════════════════════════════════════
            {
                "id": "m5-sistema-emocional",
                "title": "Módulo 5: Observación del Sistema Emocional",
                "items": [
                    {
                        "id": "map-l5-1-emocion-como-informacion",
                        "type": "html",
                        "title": "5.1 La Emoción como Fuente de Información",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl font-black text-slate-900">Las Emociones no son Enemigas de la Conciencia</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Las emociones son respuestas psicofisiológicas que nos informan sobre nuestra relación con el entorno. No podemos apagarlas con un interruptor, pero sí podemos aprender a relacionarnos con ellas de forma sabia.
                                </p>
                                <div class="bg-rose-50 border border-rose-200 rounded-2xl p-6">
                                    <h3 class="text-base font-black text-rose-950 mb-2">De la Reactividad a la Respuesta</h3>
                                    <p class="text-xs text-rose-900 leading-relaxed">
                                        Patrón reactivo automático: <strong>Sentir → Reaccionar inmediatamente</strong>.<br>
                                        Patrón consciente de mediación: <strong>Sentir → Observar → Reconocer → Comprender → Responder</strong>.
                                    </p>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "map-l5-2-practica-emocion-observada",
                        "type": "html",
                        "title": "5.2 Práctica: Registro de la Emoción Observada",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl font-black text-slate-900">Secuencia de Registro Emocional</h2>
                                <p class="text-slate-700 leading-relaxed">
                                    Ante cualquier activación emocional, sigue esta secuencia de observación:
                                </p>
                                <div class="p-6 bg-white border border-slate-200 rounded-2xl space-y-2 text-xs font-medium text-slate-700">
                                    <p>1. <strong>Situación:</strong> ¿Qué ocurrió objetivamente?</p>
                                    <p>2. <strong>Emoción:</strong> ¿Qué nombre le doy a lo que siento?</p>
                                    <p>3. <strong>Sensación Corporal:</strong> ¿Dónde se manifiesta en mi cuerpo (pecho, garganta, estómago)?</p>
                                    <p>4. <strong>Pensamiento:</strong> ¿Qué juicio o historia me estoy contando?</p>
                                    <p>5. <strong>Impulso:</strong> ¿Qué tengo ganas de hacer automáticamente?</p>
                                    <p>6. <strong>Respuesta Elegida:</strong> ¿Qué elijo hacer de manera consciente?</p>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "map-l5-3-quiz",
                        "type": "quiz",
                        "title": "5.3 Evaluación: Conciencia Emocional",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "map-q5-1",
                                    "type": "multiple",
                                    "prompt": "¿Cuál es la función pedagógica de crear un espacio entre la emoción y la reacción?",
                                    "choices": [
                                        {"id": "a", "text": "Permitir la observación consciente y elegir una respuesta constructiva en lugar de actuar por impulso automático.", "isCorrect": True},
                                        {"id": "b", "text": "Suprimir completamente la experiencia emocional para nunca sentir malestar.", "isCorrect": False},
                                        {"id": "c", "text": "Demostrar que las emociones carecen de valor adaptativo.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 6 — EL SISTEMA EMOCIONAL AL SERVICIO DE LA CONCIENCIA
            # ══════════════════════════════════════════════════════════
            {
                "id": "m6-exaptacion-emocional",
                "title": "Módulo 6: El Sistema Emocional al Servicio de la Conciencia",
                "items": [
                    {
                        "id": "map-l6-1-concepto-exaptacion",
                        "type": "html",
                        "title": "6.1 El Concepto de Exaptación en Biología y en el Modelo del Curso",
                        "html": """
                            <div class="space-y-6 select-text">
                                <div class="bg-gradient-to-r from-emerald-50 to-indigo-50 border border-emerald-200 rounded-3xl p-6">
                                    <span class="text-xs font-black text-emerald-800 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-emerald-200">
                                        🧬 MARCO CONCEPTUAL
                                    </span>
                                    <h2 class="text-2xl md:text-3xl font-black text-slate-900 mt-2">La Exaptación y la Conciencia</h2>
                                    <p class="text-slate-700 text-sm mt-2 leading-relaxed">
                                        En biología evolutiva (concepto introducido por Stephen Jay Gould y Elisabeth Vrba), la <strong>exaptación</strong> ocurre cuando una característica que evolucionó para una función específica es posteriormente cooptada para un uso diferente (como las plumas en dinosaurios que inicialmente servían para termorregulación y luego para el vuelo).
                                    </p>
                                </div>
                                <div class="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                                    <h3 class="font-black text-slate-900 text-lg">Aplicación al Modelo del Curso</h3>
                                    <p class="text-slate-600 text-sm leading-relaxed font-medium">
                                        En ConexiónLuz utilizamos esta metáfora conceptual para plantear: nuestro sistema emocional, diseñado evolutivamente para respuestas rápidas de supervivencia y adaptación, puede ser <em>utilizado conscientemente</em> como una antena de alta sensibilidad para aportar información valiosa a la metaconciencia.
                                    </p>
                                    <div class="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                                        📌 <em>Nota Pedagógica:</em> Este es un modelo conceptual y pedagógico desarrollado para este curso, no una afirmación de que la evolución biológica haya tenido como propósito consciente diseñar las emociones para la metaconciencia.
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "map-l6-2-conversion-informacion",
                        "type": "html",
                        "title": "6.2 Ejercicio: Conversión de Información Emocional",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl font-black text-slate-900">Cómo Poner la Emoción al Servicio de la Conciencia</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Aprende el algoritmo de 5 pasos para procesar la información afectiva:
                                </p>
                                <div class="space-y-3 text-xs font-semibold text-slate-800">
                                    <div class="p-3 bg-teal-50 border border-teal-200 rounded-xl">1. ¿Qué siento? (Identificación precisa)</div>
                                    <div class="p-3 bg-teal-50 border border-teal-200 rounded-xl">2. ¿Qué me está señalando esta experiencia? (Información subyacente)</div>
                                    <div class="p-3 bg-teal-50 border border-teal-200 rounded-xl">3. ¿Qué estoy pensando o interpretando? (Metacognición)</div>
                                    <div class="p-3 bg-teal-50 border border-teal-200 rounded-xl">4. ¿Qué puedo observar del entorno y de mí mismo? (Mediación)</div>
                                    <div class="p-3 bg-teal-50 border border-teal-200 rounded-xl">5. ¿Qué respuesta consciente elijo emitir? (Acción deliberada)</div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "map-l6-3-quiz",
                        "type": "quiz",
                        "title": "6.3 Evaluación: Exaptación del Sistema Emocional",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "map-q6-1",
                                    "type": "multiple",
                                    "prompt": "¿Qué postula el concepto de 'Poner el sistema emocional al servicio de la conciencia'?",
                                    "choices": [
                                        {"id": "a", "text": "Utilizar la información que aporta la emoción para ampliar la observación y orientar respuestas deliberadas.", "isCorrect": True},
                                        {"id": "b", "text": "Eliminar biológicamente todas las emociones del cerebro humano.", "isCorrect": False},
                                        {"id": "c", "text": "Reaccionar sin pensar ante el primer impulso que surja.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 7 — CONCIENCIA CORPORAL
            # ══════════════════════════════════════════════════════════
            {
                "id": "m7-conciencia-corporal",
                "title": "Módulo 7: Conciencia Corporal",
                "items": [
                    {
                        "id": "map-l7-1-cuerpo-ancla",
                        "type": "html",
                        "title": "7.1 El Cuerpo como Ancla Somática del Presente",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl font-black text-slate-900">El Cuerpo Siempre Está en el Presente</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    La mente conceptual puede viajar al pasado a través del recuerdo o proyectarse al futuro mediante la anticipación. Sin embargo, el cuerpo físico únicamente puede existir en el instante presente. Por ello, la interocepción y la propiocepción son anclas primordiales para la mediación.
                                </p>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium text-slate-700">
                                    <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                        <span class="font-black text-slate-900 block mb-1">Tensión y Relajación</span>
                                        Notar dónde se acumula la contracción muscular (mandíbula, hombros, cuello).
                                    </div>
                                    <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                        <span class="font-black text-slate-900 block mb-1">Ritmo Respiratorio</span>
                                        Observar la cadencia y profundidad sin intentar hipercontrolarla.
                                    </div>
                                    <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                        <span class="font-black text-slate-900 block mb-1">Temperatura y Apoyo</span>
                                        Sentir el calor, el frío y el peso de la gravedad en las extremidades.
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "map-l7-2-escaneo-consciente",
                        "type": "html",
                        "title": "7.2 Práctica: Escaneo Consciente Progresivo",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl font-black text-slate-900">Práctica: Escaneo de Cabeza a Pies</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Recorre mentalmente cada una de las siguientes regiones sin convertirlo en un diagnóstico médico, sino en una exploración de presencia:
                                </p>
                                <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-bold text-teal-900">
                                    <div class="p-3 bg-teal-50 border border-teal-200 rounded-xl">1. Cabeza</div>
                                    <div class="p-3 bg-teal-50 border border-teal-200 rounded-xl">2. Rostro</div>
                                    <div class="p-3 bg-teal-50 border border-teal-200 rounded-xl">3. Cuello</div>
                                    <div class="p-3 bg-teal-50 border border-teal-200 rounded-xl">4. Hombros</div>
                                    <div class="p-3 bg-teal-50 border border-teal-200 rounded-xl">5. Pecho</div>
                                    <div class="p-3 bg-teal-50 border border-teal-200 rounded-xl">6. Abdomen</div>
                                    <div class="p-3 bg-teal-50 border border-teal-200 rounded-xl">7. Brazos</div>
                                    <div class="p-3 bg-teal-50 border border-teal-200 rounded-xl">8. Manos</div>
                                    <div class="p-3 bg-teal-50 border border-teal-200 rounded-xl">9. Piernas</div>
                                    <div class="p-3 bg-teal-50 border border-teal-200 rounded-xl">10. Pies</div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "map-l7-3-quiz",
                        "type": "quiz",
                        "title": "7.3 Evaluación: Conciencia Corporal",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "map-q7-1",
                                    "type": "multiple",
                                    "prompt": "¿Por qué el cuerpo es un ancla central para la atención plena y la mediación?",
                                    "choices": [
                                        {"id": "a", "text": "Porque las sensaciones físicas solo ocurren en el tiempo presente real.", "isCorrect": True},
                                        {"id": "b", "text": "Porque sustituye la necesidad de cualquier examen médico profesional.", "isCorrect": False},
                                        {"id": "c", "text": "Porque permite levitar o anular el dolor de forma mágica.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 8 — ATENCIÓN Y DISTRACCIONES
            # ══════════════════════════════════════════════════════════
            {
                "id": "m8-atencion-distracciones",
                "title": "Módulo 8: Atención y Distracciones",
                "items": [
                    {
                        "id": "map-l8-1-normalizar-distraccion",
                        "type": "html",
                        "title": "8.1 Distraerse no es Fracasar: La Dinámica de la Atención",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl font-black text-slate-900">La Verdadera Práctica es el Retorno</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Uno de los mayores errores en la atención plena es creer que distraerse es un fracaso. El cerebro humano genera asociaciones espontáneas continuamente. La práctica no consiste en no distraerse nunca, sino en <strong>el acto consciente de notar la distracción y reorientar la atención</strong>.
                                </p>
                                <div class="bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-200 rounded-2xl p-6">
                                    <h3 class="font-black text-slate-900 text-sm uppercase tracking-wider mb-2">El Ciclo de Retorno Consciente</h3>
                                    <div class="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-800">
                                        <span class="p-2.5 bg-white border border-slate-200 rounded-xl">1. DISTRAERSE</span>
                                        <span>➔</span>
                                        <span class="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl">2. RECONOCER</span>
                                        <span>➔</span>
                                        <span class="p-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl">3. OBSERVAR</span>
                                        <span>➔</span>
                                        <span class="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl">4. VOLVER AL PRESENTE</span>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "map-l8-2-quiz",
                        "type": "quiz",
                        "title": "8.2 Evaluación: Gestión de la Atención",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "map-q8-1",
                                    "type": "multiple",
                                    "prompt": "Cuando te das cuenta de que te has distraído durante la práctica de mediación, ¿qué significa ese instante?",
                                    "choices": [
                                        {"id": "a", "text": "Es el momento exacto en que la metaconciencia se ha activado y tienes la oportunidad de volver voluntariamente.", "isCorrect": True},
                                        {"id": "b", "text": "Una señal definitiva de que no estás capacitado para la observación consciente.", "isCorrect": False},
                                        {"id": "c", "text": "Que debes suspender la práctica y castigarte mentalmente.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 9 — MEDIACIÓN EN LA VIDA COTIDIANA
            # ══════════════════════════════════════════════════════════
            {
                "id": "m9-vida-cotidiana",
                "title": "Módulo 9: Mediación en la Vida Cotidiana",
                "items": [
                    {
                        "id": "map-l9-1-aplicacion-real",
                        "type": "html",
                        "title": "9.1 La Mediación Fuera del Aislamiento",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl font-black text-slate-900">Llevar la Conciencia a la Acción</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    La mediación adquiere su valor real cuando se aplica en el dinamismo de la vida diaria: en el trabajo, en el tráfico, en la conversación con otras personas o durante una comida.
                                </p>
                                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-700 font-medium">
                                    <div class="p-3.5 bg-white border border-slate-200 rounded-xl">🚶 <strong>Caminar:</strong> Sentir el apoyo de los pies y los sonidos del camino.</div>
                                    <div class="p-3.5 bg-white border border-slate-200 rounded-xl">🍲 <strong>Comer:</strong> Notar sabores, texturas y la velocidad al masticar.</div>
                                    <div class="p-3.5 bg-white border border-slate-200 rounded-xl">🗣️ <strong>Conversar:</strong> Escuchar al otro sin formular anticipadamente la réplica.</div>
                                    <div class="p-3.5 bg-white border border-slate-200 rounded-xl">💼 <strong>Trabajar:</strong> Observar la postura y la respiración ante tareas complejas.</div>
                                    <div class="p-3.5 bg-white border border-slate-200 rounded-xl">🚗 <strong>Conducir:</strong> Mantener la visión periférica y notar la tensión muscular.</div>
                                    <div class="p-3.5 bg-white border border-slate-200 rounded-xl">⏳ <strong>Esperar:</strong> Usar las filas de espera como una pausa de observación.</div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "map-l9-2-quiz",
                        "type": "quiz",
                        "title": "9.2 Evaluación: Mediación Cotidiana",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "map-q9-1",
                                    "type": "multiple",
                                    "prompt": "¿En qué consiste la fórmula de la mediación cotidiana?",
                                    "choices": [
                                        {"id": "a", "text": "Observar simultáneamente: CUERPO + PENSAMIENTO + EMOCIÓN + ENTORNO + ACCIÓN.", "isCorrect": True},
                                        {"id": "b", "text": "Cerrar los ojos e ignorar a las personas que te rodean mientras trabajas.", "isCorrect": False},
                                        {"id": "c", "text": "Realizar múltiples tareas caóticas sin prestar atención a ninguna.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 10 — INTEGRACIÓN: CONCIENCIA EN ACCIÓN
            # ══════════════════════════════════════════════════════════
            {
                "id": "m10-integracion-conciencia",
                "title": "Módulo 10: Integración: Conciencia en Acción",
                "items": [
                    {
                        "id": "map-l10-1-mi-sistema",
                        "type": "html",
                        "title": "10.1 Construcción de 'Mi Sistema Personal de Mediación'",
                        "html": """
                            <div class="space-y-6 select-text">
                                <div class="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 shadow-md">
                                    <h2 class="text-2xl md:text-3xl font-black">Mi Sistema de Mediación</h2>
                                    <p class="text-teal-100 text-sm mt-2 leading-relaxed font-medium">
                                        Has completado la arquitectura conceptual del curso. Ahora el estudiante consolida su propio decálogo de práctica consciente.
                                    </p>
                                </div>
                                <div class="p-6 bg-white border border-slate-200 rounded-2xl space-y-3 text-xs font-semibold text-slate-800">
                                    <p>1. ¿Qué observo en mi presente?</p>
                                    <p>2. ¿Cómo observo mis pensamientos sin fusionarme con ellos?</p>
                                    <p>3. ¿Cómo observo mis emociones como información?</p>
                                    <p>4. ¿Cómo observo las señales de mi cuerpo?</p>
                                    <p>5. ¿Cómo observo mi entorno con apertura?</p>
                                    <p>6. ¿Cómo integro lo interno y lo externo simultáneamente?</p>
                                    <p>7. ¿Cómo utilizo la información emocional para la conciencia?</p>
                                    <p>8. ¿Cómo recupero mi atención cuando me distraigo?</p>
                                    <p>9. ¿Cómo respondo conscientemente antes de reaccionar?</p>
                                    <p>10. ¿Cómo llevo la mediación a mi vida cotidiana?</p>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "map-l10-2-quiz-final",
                        "type": "quiz",
                        "title": "10.2 Evaluación Final de Integración",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "map-q10-1",
                                    "type": "multiple",
                                    "prompt": "¿Cuál es la síntesis nuclear del principio de ConexiónLuz en este curso?",
                                    "choices": [
                                        {"id": "a", "text": "OBSERVAR → RECONOCER → COMPRENDER → INTEGRAR → RESPONDER CONSCIENTEMENTE.", "isCorrect": True},
                                        {"id": "b", "text": "Sentir → Reaccionar → Arrepentirse → Justificar.", "isCorrect": False},
                                        {"id": "c", "text": "Bloquear la mente y no involucrarse en ninguna actividad humana.", "isCorrect": False}
                                    ]
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
            Bienvenido al curso <strong>MEDIACIÓN Y ATENCIÓN PLENA</strong> de ConexiónLuz: <em>Observación interna y externa de la realidad presente a través de la conciencia</em>.
        </p>
        <div class="bg-teal-50 border border-teal-200 rounded-2xl p-6 space-y-3">
            <h4 class="text-base font-bold text-teal-900 flex items-center gap-2">
                🧘 ¿Qué aprenderás y entrenarás en este programa?
            </h4>
            <ul class="list-disc list-inside space-y-2 text-sm text-teal-800">
                <li><strong>El Concepto Distintivo de Mediación:</strong> La capacidad de observar simultáneamente lo que ocurre dentro (pensamientos, emociones, cuerpo) y fuera (entorno, sonidos, dinámicas) en el mismo presente.</li>
                <li><strong>Metacognición y Metaconciencia:</strong> Diferenciar el pensamiento de la observación del pensamiento ("Me doy cuenta de que estoy pensando").</li>
                <li><strong>El Sistema Emocional al Servicio de la Conciencia:</strong> Modelo de exaptación conceptual para utilizar las emociones como fuente lúcida de información y no como impulsos reactivos.</li>
                <li><strong>Laboratorio de Metaconciencia & Reto de 21 Días:</strong> 10 experimentos guiados, registro interactivo de prácticas de 5, 10 y 15 minutos, y diario de mediación.</li>
                <li><strong>Herramientas Interactivas Dedicadas:</strong> Observador del pensamiento, pantalla dividida interno/externo y mapa secuencial de mediación.</li>
            </ul>
        </div>
    </div>
    """

    defaults = {
        "title": "MEDIACIÓN Y ATENCIÓN PLENA: Observación interna y externa de la realidad presente a través de la conciencia",
        "description": "Un programa de exploración de la experiencia presente basado en la observación consciente de pensamientos, emociones, sensaciones corporales y realidad externa. El curso introduce los conceptos de mediación, metacognición y metaconciencia, desarrollando una práctica orientada a observar antes de reaccionar y a poner el sistema emocional al servicio de una conciencia más amplia de la experiencia.",
        "description_html": description_html,
        "category": "Mediación & Metaconciencia",
        "tags": [
            "Mediación", "Atención Plena", "Metacognición", "Metaconciencia",
            "Observación", "Exaptación Emocional", "Presencia", "Conexión Luz"
        ],
        "price_cop": 0,
        "cover_url": "/cursos/mediacion_cover.png",
        "status": Course.Status.PUBLISHED,
        "is_active": True,
        "draft_content": content,
        "published_content": content
    }

    course, created = Course.objects.get_or_create(
        slug="mediacion-atencion-plena",
        defaults=defaults
    )

    if not created:
        for k, v in defaults.items():
            setattr(course, k, v)
        course.save()

    print(f"Curso Mediación y Atención Plena {'creado' if created else 'actualizado'} exitosamente con ID: {course.id} | Slug: {course.slug}")

if __name__ == "__main__":
    create_mediacion_course()
