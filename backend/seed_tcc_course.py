import os
import django
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Course

def create_tcc_course():
    def gid(): return str(uuid.uuid4())

    content = {
        "version": 1,
        "sections": [
            # ══════════════════════════════════════════════════════════
            # MÓDULO 1 — INTRODUCCIÓN A LA TCC
            # ══════════════════════════════════════════════════════════
            {
                "id": "m1-intro-tcc",
                "title": "Módulo 1: Introducción a la Terapia Cognitivo-Conductual",
                "items": [
                    {
                        "id": "l1-1-bienvenida",
                        "type": "html",
                        "title": "1.1 Bienvenida al Curso de TCC",
                        "html": """
                            <div class="space-y-6 select-text">
                                <div class="bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 text-slate-900 rounded-3xl p-8 shadow-xs border border-teal-100 relative overflow-hidden">
                                    <span class="text-xs font-black uppercase tracking-widest text-teal-800 bg-white px-3.5 py-1 rounded-full border border-teal-200 shadow-2xs">
                                        🧠 CONEXIÓN LUZ · PROGRAMA EDUCATIVO
                                    </span>
                                    <h2 class="text-3xl md:text-4xl font-black mt-3 mb-2 tracking-tight text-slate-900">
                                        Bienvenido a Terapia Cognitivo-Conductual (TCC)
                                    </h2>
                                    <p class="text-slate-700 text-sm md:text-base leading-relaxed font-medium">
                                        "Comprende la relación entre pensamientos, emociones, conductas y consecuencias."
                                    </p>
                                </div>

                                <div class="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-2xs">
                                    <h3 class="text-xl font-black text-slate-900">Objetivo General del Programa</h3>
                                    <p class="text-slate-600 text-sm leading-relaxed">
                                        Introducirte de manera rigurosa, progresiva y pedagógica en los fundamentos y herramientas de la Terapia Cognitivo-Conductual (TCC). A lo largo de 10 módulos temáticos, aprenderás cómo el cerebro interpreta las situaciones cotidianas, cómo surgen los pensamientos automáticos y cómo intervenir de manera estructurada en tu diálogo interno y patrones de acción.
                                    </p>
                                </div>

                                <div class="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 space-y-2">
                                    <h4 class="font-bold text-amber-950 text-sm flex items-center gap-2">
                                        ⚠️ Marco Ético e Informativo Fundamental
                                    </h4>
                                    <p class="text-xs text-amber-900 leading-relaxed font-medium">
                                        Este programa tiene una finalidad estrictamente educativa y de autorreflexión personal. Completar este curso no sustituye la formación universitaria reglada en Psicología Clínica ni habilita para realizar diagnósticos o tratamientos de salud mental reservados por ley a profesionales sanitarios.
                                    </p>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l1-2-que-es-tcc",
                        "type": "html",
                        "title": "1.2 ¿Qué es la TCC y cuál es su origen?",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">¿Qué es la TCC?</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    La Terapia Cognitivo-Conductual (TCC) es uno de los enfoques psicoterapéuticos con mayor respaldo científico y evidencia empírica en el mundo contemporáneo. Desarrollada inicialmente en la década de 1960 por el Dr. Aaron T. Beck y enriquecida por la Terapia Racional Emotiva Conductual (TREC) de Albert Ellis y la tradición conductual de B.F. Skinner y Joseph Wolpe.
                                </p>
                                
                                <div class="bg-teal-50 border border-teal-100 rounded-2xl p-6 space-y-3">
                                    <h3 class="text-lg font-bold text-teal-950">💡 La Premisa Central de la TCC:</h3>
                                    <p class="text-sm text-teal-900 font-medium leading-relaxed">
                                        <em>"No son las cosas las que atormentan a los seres humanos, sino los principios y las opiniones que sobre las cosas se forman."</em> — Epicteto (Filosofía Estoica).
                                    </p>
                                    <p class="text-xs text-teal-800 leading-relaxed">
                                        En la TCC comprendemos que nuestras emociones y conductas no están causadas directamente por los acontecimientos externos, sino por la manera en que <strong>interpretamos y procesamos</strong> dichos acontecimientos.
                                    </p>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
                                        <span class="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Pilar 1</span>
                                        <h4 class="font-bold text-slate-900 text-base mb-1">Componente Cognitivo</h4>
                                        <p class="text-xs text-slate-600 leading-relaxed">Identificación y evaluación de pensamientos automáticos, supuestos y creencias nucleares.</p>
                                    </div>
                                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
                                        <span class="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Pilar 2</span>
                                        <h4 class="font-bold text-slate-900 text-base mb-1">Componente Conductual</h4>
                                        <p class="text-xs text-slate-600 leading-relaxed">Modificación de patrones de acción, activación, experimentos conductuales y aprendizaje de nuevas respuestas.</p>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l1-3-evaluacion-m1",
                        "type": "quiz",
                        "title": "1.3 Evaluación: Fundamentos y Modelo Básico",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q1-1",
                                    "type": "multiple",
                                    "prompt": "¿Cuál es la premisa fundamental sobre la que se sustenta el modelo cognitivo de la TCC?",
                                    "choices": [
                                        {"id": "a", "text": "Las emociones son causadas directamente por los acontecimientos externos sin mediación mental.", "isCorrect": False},
                                        {"id": "b", "text": "Nuestras emociones y conductas dependen de la interpretación y significado que atribuimos a las situaciones.", "isCorrect": True},
                                        {"id": "c", "text": "El pensamiento positivo forzado elimina todos los problemas de la vida.", "isCorrect": False}
                                    ]
                                },
                                {
                                    "id": "q1-2",
                                    "type": "truefalse",
                                    "prompt": "¿Un curso educativo en TCC capacita al estudiante para diagnosticar y tratar trastornos psicológicos clínicos?",
                                    "correctBool": False
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 2 — EL MODELO COGNITIVO
            # ══════════════════════════════════════════════════════════
            {
                "id": "m2-modelo-cognitivo",
                "title": "Módulo 2: El Modelo Cognitivo en Profundidad",
                "items": [
                    {
                        "id": "l2-1-la-cadena-cognitiva",
                        "type": "html",
                        "title": "2.1 La Cadena Cognitiva Interconectada",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">La Cadena Cognitiva: Paso a Paso</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    En cada instante de nuestra vida, nuestro sistema nervioso procesa estímulos y genera una respuesta integrada compuesta por cinco eslabones fundamentales:
                                </p>

                                <div class="space-y-3">
                                    <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
                                        <div class="h-8 w-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
                                        <div>
                                            <h4 class="font-bold text-slate-900 text-sm">Situación (Estímulo)</h4>
                                            <p class="text-xs text-slate-600">El evento objetivo o hecho observable (ej: enviar un mensaje y no recibir respuesta en 2 horas).</p>
                                        </div>
                                    </div>

                                    <div class="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-start gap-3">
                                        <div class="h-8 w-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
                                        <div>
                                            <h4 class="font-bold text-teal-950 text-sm">Pensamiento Automático (Interpretación)</h4>
                                            <p class="text-xs text-teal-900">La frase, juicio o imagen mental involuntaria que surge (ej: "Se ha enfadado conmigo").</p>
                                        </div>
                                    </div>

                                    <div class="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-start gap-3">
                                        <div class="h-8 w-8 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold text-sm shrink-0">3</div>
                                        <div>
                                            <h4 class="font-bold text-indigo-950 text-sm">Emoción & Respuesta Fisiológica</h4>
                                            <p class="text-xs text-indigo-900">La experiencia afectiva y somática (ej: ansiedad 75/100, opresión en el pecho).</p>
                                        </div>
                                    </div>

                                    <div class="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                                        <div class="h-8 w-8 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-sm shrink-0">4</div>
                                        <div>
                                            <h4 class="font-bold text-amber-950 text-sm">Conducta (Acción o Inacción)</h4>
                                            <p class="text-xs text-amber-900">Lo que hacemos o dejamos de hacer (ej: insistir con 5 llamadas o aislarse).</p>
                                        </div>
                                    </div>

                                    <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                                        <div class="h-8 w-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shrink-0">5</div>
                                        <div>
                                            <h4 class="font-bold text-emerald-950 text-sm">Consecuencias (Feedback del Sistema)</h4>
                                            <p class="text-xs text-emerald-900">El resultado interpersonal, emocional y relacional que retroalimenta el ciclo.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l2-2-creencias-nucleares",
                        "type": "html",
                        "title": "2.2 Creencias Nucleares y Supuestos Intermedios",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">La Arquitectura Profunda del Pensamiento</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Los pensamientos automáticos no surgen de la nada; son la punta del iceberg de estructuras cognitivas más estables organizadas en tres niveles:
                                </p>

                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                                        <span class="text-xs font-black text-teal-600 uppercase tracking-widest block mb-2">Nivel Superficial</span>
                                        <h4 class="font-bold text-slate-900 text-sm mb-1">Pensamientos Automáticos</h4>
                                        <p class="text-xs text-slate-600 leading-relaxed">Frases rápidas, espontáneas y conscientes que surgen en situaciones puntuales.</p>
                                    </div>
                                    <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                                        <span class="text-xs font-black text-indigo-600 uppercase tracking-widest block mb-2">Nivel Intermedio</span>
                                        <h4 class="font-bold text-slate-900 text-sm mb-1">Creencias Intermedias</h4>
                                        <p class="text-xs text-slate-600 leading-relaxed">Reglas, actitudes y supuestos condicionales ("Si no lo hago todo perfecto, soy un fracaso").</p>
                                    </div>
                                    <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                                        <span class="text-xs font-black text-rose-600 uppercase tracking-widest block mb-2">Nivel Profundo</span>
                                        <h4 class="font-bold text-slate-900 text-sm mb-1">Creencias Nucleares (Esquemas)</h4>
                                        <p class="text-xs text-slate-600 leading-relaxed">Ideas globales, rígidas y absolutas sobre uno mismo, los demás y el mundo ("Soy incapaz", "El mundo es hostil").</p>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l2-3-evaluacion-m2",
                        "type": "quiz",
                        "title": "2.3 Evaluación: Niveles de Cognición",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q2-1",
                                    "type": "multiple",
                                    "prompt": "¿Qué representan las Creencias Nucleares según el modelo de Aaron Beck?",
                                    "choices": [
                                        {"id": "a", "text": "Ideas superficiales que cambian cada cinco minutos.", "isCorrect": False},
                                        {"id": "b", "text": "Estructuras profundas, globales y estables sobre uno mismo, los demás y el mundo.", "isCorrect": True},
                                        {"id": "c", "text": "Respuestas reflejas exclusivamente fisiológicas.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 3 — PENSAMIENTOS AUTOMÁTICOS
            # ══════════════════════════════════════════════════════════
            {
                "id": "m3-pensamientos-automaticos",
                "title": "Módulo 3: Identificación y Registro de Pensamientos",
                "items": [
                    {
                        "id": "l3-1-caracteristicas-pa",
                        "type": "html",
                        "title": "3.1 Características de los Pensamientos Automáticos",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Pensamientos Automáticos (P.A.)</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Los pensamientos automáticos tienen características muy particulares que los hacen pasar inadvertidos a menos que desarrollemos una atención consciente entrenada:
                                </p>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                        <h4 class="font-bold text-slate-900 text-sm mb-1">⚡ Ultrarrápidos e Involuntarios</h4>
                                        <p class="text-xs text-slate-600">Aparecen como un flash en milisegundos sin un esfuerzo deliberado de razonamiento.</p>
                                    </div>
                                    <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                        <h4 class="font-bold text-slate-900 text-sm mb-1">🎯 Aceptados como Verdades Absolutas</h4>
                                        <p class="text-xs text-slate-600">Rara vez nos detenemos a cuestionarlos; solemos creerlos de manera automática.</p>
                                    </div>
                                    <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                        <h4 class="font-bold text-slate-900 text-sm mb-1">💬 Formato Telegráfico o Imágenes</h4>
                                        <p class="text-xs text-slate-600">Pueden ser frases cortas ("No podré") o imágenes mentales fugaces de desastre.</p>
                                    </div>
                                    <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                        <h4 class="font-bold text-slate-900 text-sm mb-1">🌊 Conectores Directos con la Emoción</h4>
                                        <p class="text-xs text-slate-600">Determinan inmediatamente el tono emocional del cuerpo (ira, miedo, culpa, tristeza).</p>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l3-2-evaluacion-m3",
                        "type": "quiz",
                        "title": "3.2 Evaluación: Registro de Pensamientos",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q3-1",
                                    "type": "truefalse",
                                    "prompt": "¿Tener un pensamiento automático negativo significa obligatoriamente que ese pensamiento sea un hecho verídico comprobado?",
                                    "correctBool": False
                                },
                                {
                                    "id": "q3-2",
                                    "type": "multiple",
                                    "prompt": "¿Cuál es el primer paso al realizar un Registro de Pensamientos en TCC?",
                                    "choices": [
                                        {"id": "a", "text": "Repetir frases positivas frente a un espejo sin analizar la situación.", "isCorrect": False},
                                        {"id": "b", "text": "Identificar y describir objetivamente la situación específica y notar la emoción experimentada.", "isCorrect": True},
                                        {"id": "c", "text": "Culpar a las demás personas por la emoción sentida.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 4 — DISTORSIONES COGNITIVAS
            # ══════════════════════════════════════════════════════════
            {
                "id": "m4-distorsiones-cognitivas",
                "title": "Módulo 4: Catálogo y Detección de Distorsiones Cognitivas",
                "items": [
                    {
                        "id": "l4-1-catalogo-distorsiones",
                        "type": "html",
                        "title": "4.1 Los Patrones y Sesgos del Pensamiento",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Distorsiones Cognitivas Más Comunes</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Las distorsiones cognitivas son sesgos sistemáticos en el procesamiento de la información. Conocerlas nos permite identificarlas al instante en nuestro diálogo interno:
                                </p>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div class="p-4 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                                        <h4 class="font-bold text-teal-900">1. Pensamiento Dicotómico (Todo o Nada)</h4>
                                        <p class="text-xs text-slate-600">Ver las situaciones en categorías polarizadas de blanco o negro, sin matices intermedios.</p>
                                        <span class="text-[11px] text-slate-500 italic block">Ej: "Si no saqué la máxima nota, soy un completo fracaso."</span>
                                    </div>
                                    <div class="p-4 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                                        <h4 class="font-bold text-teal-900">2. Sobregeneralización</h4>
                                        <p class="text-xs text-slate-600">Extraer una regla universal a partir de un solo acontecimiento negativo aislado.</p>
                                        <span class="text-[11px] text-slate-500 italic block">Ej: "Nunca nadie me entenderá; siempre me pasa lo mismo."</span>
                                    </div>
                                    <div class="p-4 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                                        <h4 class="font-bold text-teal-900">3. Lectura de Mente</h4>
                                        <p class="text-xs text-slate-600">Asumir con certeza lo que otras personas piensan de nosotros sin evidencias objetivas.</p>
                                        <span class="text-[11px] text-slate-500 italic block">Ej: "Seguro que está pensando que soy aburrido."</span>
                                    </div>
                                    <div class="p-4 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                                        <h4 class="font-bold text-teal-900">4. Adivinación del Futuro (Catastrofismo)</h4>
                                        <p class="text-xs text-slate-600">Anticipar que las cosas saldrán mal y actuar como si esa predicción fuera ya un hecho.</p>
                                        <span class="text-[11px] text-slate-500 italic block">Ej: "La presentación será un desastre total y perderé mi empleo."</span>
                                    </div>
                                    <div class="p-4 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                                        <h4 class="font-bold text-teal-900">5. Descalificación de lo Positivo</h4>
                                        <p class="text-xs text-slate-600">Rechazar experiencias positivas insistiendo en que "no cuentan" o fueron por pura suerte.</p>
                                        <span class="text-[11px] text-slate-500 italic block">Ej: "Me felicitó solo por cortesía, en realidad no estuvo bien."</span>
                                    </div>
                                    <div class="p-4 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                                        <h4 class="font-bold text-teal-900">6. Afirmaciones de 'Debería' (Tiranía de los Debería)</h4>
                                        <p class="text-xs text-slate-600">Reglas rígidas e inflexibles impuestas sobre uno mismo o sobre los demás que generan culpa o frustración.</p>
                                        <span class="text-[11px] text-slate-500 italic block">Ej: "Debería ser capaz de manejar todo esto sin estresarme jamás."</span>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l4-2-evaluacion-m4",
                        "type": "quiz",
                        "title": "4.2 Evaluación: Reconocimiento de Distorsiones",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q4-1",
                                    "type": "multiple",
                                    "prompt": "¿Qué distorsión cognitiva ilustra la frase: 'No me saludó efusivamente, seguro que está muy enfadado conmigo' sin haberlo preguntado?",
                                    "choices": [
                                        {"id": "a", "text": "Lectura de mente / Inferencia arbitraria", "isCorrect": True},
                                        {"id": "b", "text": "Pensamiento de abundancia", "isCorrect": False},
                                        {"id": "c", "text": "Descalificación de lo positivo", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 5 — REESTRUCTURACIÓN COGNITIVA
            # ══════════════════════════════════════════════════════════
            {
                "id": "m5-reestructuracion-cognitiva",
                "title": "Módulo 5: Reestructuración Cognitiva y Cuestionamiento Socrático",
                "items": [
                    {
                        "id": "l5-1-el-dialogo-socratico",
                        "type": "html",
                        "title": "5.1 El Arte del Cuestionamiento Basado en Evidencia",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Reestructuración Cognitiva</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    La reestructuración cognitiva no consiste en engañarse con "pensamiento positivo ilusorio", sino en buscar la <strong>mayor precisión, realismo y flexibilidad posible</strong> mediante preguntas socráticas:
                                </p>

                                <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-4">
                                    <h3 class="text-lg font-bold text-indigo-950">🔍 Las 4 Preguntas Clave de Evaluación:</h3>
                                    <ul class="space-y-2 text-sm text-indigo-900 list-disc list-inside">
                                        <li><strong>Evidencia Objetiva:</strong> ¿Qué datos fácticos demuestran que este pensamiento es 100% real? ¿Qué datos lo contradicen?</li>
                                        <li><strong>Interpretaciones Alternativas:</strong> ¿Existe otra manera posible de entender esta situación?</li>
                                        <li><strong>Perspectiva y Descatastrofización:</strong> ¿Qué es lo peor que podría pasar de forma realista? ¿Cómo lo afrontaría?</li>
                                        <li><strong>Utilidad:</strong> ¿En qué me ayuda mantener este pensamiento en este momento?</li>
                                    </ul>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l5-2-evaluacion-m5",
                        "type": "quiz",
                        "title": "5.2 Evaluación: Reestructuración y Pensamiento Equilibrado",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q5-1",
                                    "type": "multiple",
                                    "prompt": "¿Cuál es la diferencia entre un pensamiento alternativo realista y una afirmación falsamente positiva?",
                                    "choices": [
                                        {"id": "a", "text": "El pensamiento alternativo se basa en hechos, matices y evidencia ponderada, mientras que el positivo artificial ignora la realidad.", "isCorrect": True},
                                        {"id": "b", "text": "No hay diferencia; son exactamente lo mismo.", "isCorrect": False},
                                        {"id": "c", "text": "El alternativo siempre niega las dificultades por completo.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 6 — CONDUCTA Y APRENDIZAJE
            # ══════════════════════════════════════════════════════════
            {
                "id": "m6-conducta-aprendizaje",
                "title": "Módulo 6: Principios Conductuales y Activación",
                "items": [
                    {
                        "id": "l6-1-analisis-abc",
                        "type": "html",
                        "title": "6.1 El Modelo Funcional ABC y la Activación Conductual",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Análisis Funcional de la Conducta: ABC</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Para comprender por qué una conducta se mantiene o se extingue, analizamos la triple contingencia:
                                </p>
                                
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div class="p-5 bg-teal-50 border border-teal-200 rounded-2xl">
                                        <h3 class="font-bold text-teal-950 text-base mb-1">A — Antecedente</h3>
                                        <p class="text-xs text-teal-900">El contexto, lugar, hora y desencadenante que precede al comportamiento.</p>
                                    </div>
                                    <div class="p-5 bg-blue-50 border border-blue-200 rounded-2xl">
                                        <h3 class="font-bold text-blue-950 text-base mb-1">B — Behavior (Conducta)</h3>
                                        <p class="text-xs text-blue-900">La acción observable y medible que la persona realiza o evita hacer.</p>
                                    </div>
                                    <div class="p-5 bg-indigo-50 border border-indigo-200 rounded-2xl">
                                        <h3 class="font-bold text-indigo-950 text-base mb-1">C — Consecuencia</h3>
                                        <p class="text-xs text-indigo-900">El refuerzo positivo, alivio a corto plazo o coste a largo plazo que consolida el patrón.</p>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l6-2-evaluacion-m6",
                        "type": "quiz",
                        "title": "6.2 Evaluación: Análisis Conductual",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q6-1",
                                    "type": "truefalse",
                                    "prompt": "¿La evitación conductual disminuye la ansiedad a corto plazo pero la incrementa y cronifica a largo plazo?",
                                    "correctBool": True
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 7 — EMOCIONES Y REGULACIÓN
            # ══════════════════════════════════════════════════════════
            {
                "id": "m7-emociones-regulacion",
                "title": "Módulo 7: Conexión Afectiva y Regulación Emocional",
                "items": [
                    {
                        "id": "l7-1-anatomia-emocional",
                        "type": "html",
                        "title": "7.1 Identificación y Aceptación Emocional",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Emociones Primarias y Secundarias</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Las emociones son señales biológicas de adaptación con un propósito vital. En la TCC aprendemos a calibrar su intensidad (de 0 a 100) y a responder ante ellas con sabiduría en lugar de reactividad impulsiva.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "l7-2-evaluacion-m7",
                        "type": "quiz",
                        "title": "7.2 Evaluación: Regulación Emocional",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q7-1",
                                    "type": "multiple",
                                    "prompt": "¿Cuál es la función principal de medir la intensidad de una emoción en una escala del 0 al 100?",
                                    "choices": [
                                        {"id": "a", "text": "Permitir una evaluación gradual objetiva y monitorear los cambios antes y después de intervenir.", "isCorrect": True},
                                        {"id": "b", "text": "Juzgar si la persona es buena o mala según el número.", "isCorrect": False},
                                        {"id": "c", "text": "Hacer que la emoción desaparezca en 1 segundo.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 8 — EXPOSICIÓN, EVITACIÓN Y AFRONTAMIENTO
            # ══════════════════════════════════════════════════════════
            {
                "id": "m8-exposicion-evitacion",
                "title": "Módulo 8: Exposición Pedagógica y Afrontamiento Gradual",
                "items": [
                    {
                        "id": "l8-1-principios-exposicion",
                        "type": "html",
                        "title": "8.1 Principios de Habituación y Afrontamiento",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Habituación y Aprendizaje Inhibitorio</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    La exposición gradual y sistemática permite al cerebro comprobar que la amenaza temida no ocurre o es tolerable, desactivando la respuesta conditioned de alarma.
                                </p>
                                <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-950 space-y-2">
                                    <h4 class="font-bold">⚠️ Nota Ética y de Seguridad:</h4>
                                    <p>En este curso educativo estudiamos los conceptos teóricos de la exposición. Cualquier protocolo de exposición terapéutica formal para trastornos de ansiedad severos o fobias debe ser diseñado y supervisado por un profesional clínico habilitado.</p>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l8-2-evaluacion-m8",
                        "type": "quiz",
                        "title": "8.2 Evaluación: Afrontamiento y Seguridad",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q8-1",
                                    "type": "truefalse",
                                    "prompt": "¿Las conductas de seguridad (ej: llevar siempre un amuleto o evitar mirar a la cara) ayudan a superar la ansiedad a largo plazo?",
                                    "correctBool": False
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 9 — RESOLUCIÓN DE PROBLEMAS
            # ══════════════════════════════════════════════════════════
            {
                "id": "m9-resolucion-problemas",
                "title": "Módulo 9: Técnica de Solución de Problemas en 7 Pasos",
                "items": [
                    {
                        "id": "l9-1-metodologia-7-pasos",
                        "type": "html",
                        "title": "9.1 Estructura del Método de Solución de Problemas",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Técnica de Solución de Problemas (D'Zurilla y Goldfried)</h2>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl"><strong>1. Orientación:</strong> Actitud positiva hacia el problema como reto.</div>
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl"><strong>2. Definición:</strong> Delimitar el problema en términos concretos y operativos.</div>
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl"><strong>3. Tormenta de Ideas:</strong> Generar múltiples alternativas sin juzgar.</div>
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl"><strong>4. Evaluación de Pros y Contras:</strong> Valorar consecuencias a corto y largo plazo.</div>
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl"><strong>5. Toma de Decisión:</strong> Elegir la opción más viable.</div>
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl"><strong>6. Plan de Acción:</strong> Establecer fecha, recursos y primer paso concreto.</div>
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl"><strong>7. Verificación:</strong> Evaluar los resultados obtenidos y ajustar.</div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l9-2-evaluacion-m9",
                        "type": "quiz",
                        "title": "9.2 Evaluación: Solución de Problemas",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q9-1",
                                    "type": "multiple",
                                    "prompt": "¿Por qué es crucial no juzgar ni descartar ideas durante la fase inicial de generación de alternativas?",
                                    "choices": [
                                        {"id": "a", "text": "Porque el juicio prematuro inhibe la creatividad y limita el descubrimiento de opciones novedosas.", "isCorrect": True},
                                        {"id": "b", "text": "Porque todas las ideas son exactamente iguales de eficientes.", "isCorrect": False},
                                        {"id": "c", "text": "Para evitar resolver el problema.", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 10 — INTEGRACIÓN, ÉTICA Y EVALUACIÓN FINAL
            # ══════════════════════════════════════════════════════════
            {
                "id": "m10-integracion-etica",
                "title": "Módulo 10: Integración Integral de la TCC y Proyecto Final",
                "items": [
                    {
                        "id": "l10-1-integracion-casos",
                        "type": "html",
                        "title": "10.1 Integración y Formulación de Casos Ficticios",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Integración de la TCC</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    En este módulo final consolidamos el mapa completo de la TCC: desde la detección del evento activador hasta la reestructuración del pensamiento y la consolidación de nuevos hábitos conductuales.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "l10-2-evaluacion-final",
                        "type": "quiz",
                        "title": "10.2 Evaluación Final del Programa de TCC",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q10-1",
                                    "type": "multiple",
                                    "prompt": "¿Cuál es la tríada cognitiva de Beck?",
                                    "choices": [
                                        {"id": "a", "text": "Visión negativa de uno mismo, del mundo/los demás y del futuro.", "isCorrect": True},
                                        {"id": "b", "text": "Cuerpo, mente y espíritu.", "isCorrect": False},
                                        {"id": "c", "text": "Pasado, presente y futuro.", "isCorrect": False}
                                    ]
                                },
                                {
                                    "id": "q10-2",
                                    "type": "truefalse",
                                    "prompt": "¿El objetivo final de la TCC es que la persona se convierta en su propio 'científico reflexivo' de su diálogo interno y acciones?",
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
            Bienvenido al <strong>Curso de Terapia Cognitivo-Conductual (TCC)</strong> de Conexión Luz, un programa educativo integral para comprender y transformar la relación entre pensamientos, emociones, conductas y consecuencias.
        </p>
        <div class="bg-teal-50 border border-teal-200 rounded-2xl p-6 space-y-3">
            <h4 class="text-base font-bold text-teal-900 flex items-center gap-2">
                🧠 ¿Qué aprenderás en este programa?
            </h4>
            <ul class="list-disc list-inside space-y-2 text-sm text-teal-800">
                <li><strong>El Modelo Cognitivo:</strong> Cómo los pensamientos automáticos median nuestras reacciones.</li>
                <li><strong>Distorsiones Cognitivas:</strong> Detección precisa de sesgos, catastrofismo y sobregeneralización.</li>
                <li><strong>Reestructuración Cognitiva:</strong> Cuestionamiento socrático basado en evidencia objetiva.</li>
                <li><strong>Análisis Funcional ABC:</strong> Comprensión de antecedentes, conductas y consecuencias.</li>
                <li><strong>Laboratorio y Casos Ficticios:</strong> Prácticas interactivas, herramientas de registro y resolución de problemas.</li>
                <li><strong>Certificado Oficial:</strong> Acreditación de finalización de programa educativo.</li>
            </ul>
        </div>
    </div>
    """

    defaults = {
        "title": "TERAPIA COGNITIVO-CONDUCTUAL (TCC): Comprende la relación entre pensamientos, emociones y conductas",
        "description": "Programa educativo estructurado para el estudio de los fundamentos de la Terapia Cognitivo-Conductual, el modelo cognitivo, reestructuración de pensamientos, análisis conductual ABC, laboratorio interactivo y resolución de problemas.",
        "description_html": description_html,
        "category": "Terapia Cognitivo-Conductual & Psicología",
        "tags": [
            "Terapia Cognitivo-Conductual", "TCC", "Modelo Cognitivo", "Pensamientos Automáticos",
            "Distorsiones Cognitivas", "Reestructuración Cognitiva", "Análisis ABC", "Resolución de Problemas", "Conexión Luz"
        ],
        "price_cop": 0,
        "cover_url": "/cursos/tcc_cover.png",
        "status": Course.Status.PUBLISHED,
        "is_active": True,
        "draft_content": content,
        "published_content": content
    }

    course, created = Course.objects.get_or_create(
        slug="terapia-cognitivo-conductual",
        defaults=defaults
    )

    if not created:
        for k, v in defaults.items():
            setattr(course, k, v)
        course.save()

    print(f"Curso TCC {'creado' if created else 'actualizado'} exitosamente con ID: {course.id} | Slug: {course.slug}")

if __name__ == "__main__":
    create_tcc_course()
