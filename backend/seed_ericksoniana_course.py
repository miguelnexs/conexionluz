import os
import django
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Course

def create_ericksoniana_course():
    def gid(): return str(uuid.uuid4())

    content = {
        "version": 1,
        "sections": [
            # ══════════════════════════════════════════════════════════
            # MÓDULO 1 — INTRODUCCIÓN A LA HIPNOSIS ERICKSONIANA
            # ══════════════════════════════════════════════════════════
            {
                "id": "m1-introduccion-hipnosis-ericksoniana",
                "title": "Módulo 1: Introducción a la Hipnosis Ericksoniana",
                "items": [
                    {
                        "id": "l1-1-bienvenida",
                        "type": "html",
                        "title": "1.1 Bienvenida al Curso",
                        "html": """
                            <div class="space-y-6 select-text">
                                <div class="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 text-slate-900 rounded-3xl p-8 shadow-xs border border-emerald-100 relative overflow-hidden">
                                    <span class="text-xs font-black uppercase tracking-widest text-emerald-800 bg-white px-3.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
                                        🌿 CONEXIÓN LUZ · FORMACIÓN PROFESIONAL
                                    </span>
                                    <h2 class="text-3xl md:text-4xl font-black mt-3 mb-2 tracking-tight text-slate-900">
                                        Bienvenido al Curso de Hipnosis Ericksoniana
                                    </h2>
                                    <p class="text-slate-700 text-sm md:text-base leading-relaxed font-medium">
                                        "El arte de acompañar el cambio a través del lenguaje, la experiencia y el inconsciente."
                                    </p>
                                </div>

                                <div class="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-2xs">
                                    <h3 class="text-xl font-black text-slate-900">Objetivo del Programa</h3>
                                    <p class="text-slate-600 text-sm leading-relaxed">
                                        Aprender de manera rigurosa, progresiva y ética los fundamentos y técnicas comunicacionales desarrollados por el Dr. Milton H. Erickson. Estudiarás el lenguaje indirecto, la calibración, el pacing y leading, las metáforas terapéuticas y la utilización consciente de los recursos de cada consultante.
                                    </p>
                                </div>

                                <div class="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 space-y-2">
                                    <h4 class="font-bold text-amber-950 text-sm flex items-center gap-2">
                                        ⚠️ Marco Ético e Informativo Fundamental
                                    </h4>
                                    <p class="text-xs text-amber-900 leading-relaxed">
                                        Este programa tiene una finalidad estrictamente educativa y profesional. La adquisición de herramientas comunicacionales hipnóticas no sustituye la formación clínica universitaria regulada ni autoriza por sí misma el ejercicio de profesiones sanitarias reservadas por la ley.
                                    </p>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l1-2-que-es-hipnosis-ericksoniana",
                        "type": "html",
                        "title": "1.2 ¿Qué es la Hipnosis Ericksoniana?",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">¿Qué es la Hipnosis Ericksoniana?</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    La Hipnosis Ericksoniana es un enfoque comunicacional, naturalista y flexible de la hipnosis desarrollado por el psiquiatra norteamericano Milton H. Erickson (1901-1980). A diferencia de la hipnosis tradicional basada en sugestiones directas y autoritarias, el modelo ericksoniano concibe el trance como un estado natural de aprendizaje interno, donde el inconsciente es un reservorio inmenso de aprendizajes y recursos.
                                </p>
                                <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 space-y-3">
                                    <h3 class="text-lg font-bold text-emerald-950">💡 Tres pilares centrales del enfoque:</h3>
                                    <ul class="space-y-2 text-sm text-emerald-900 list-disc list-inside">
                                        <li><strong>Individualización:</strong> No existen recetas fijas; la intervención se diseña a la medida de la experiencia del individuo.</li>
                                        <li><strong>Utilización:</strong> Todo lo que el consultante trae (sus palabras, síntomas, dudas o respiración) se utiliza en favor de su propio proceso.</li>
                                        <li><strong>Lenguaje Permisivo:</strong> Se invita y orienta la atención en lugar de imponer u ordenar.</li>
                                    </ul>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l1-3-contexto-historico",
                        "type": "html",
                        "title": "1.3 Contexto Histórico",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Evolución Histórica de la Hipnosis</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    La hipnosis evolucionó desde el mesmerismo del siglo XVIII, pasando por las escuelas clínicas de Salpêtrière (Charcot) y Nancy (Bernheim) en el siglo XIX, hasta llegar al cambio de paradigma producido por Milton Erickson en la mitad del siglo XX.
                                </p>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                                        <span class="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Siglo XIX · Hipnosis Clásica</span>
                                        <h4 class="font-bold text-slate-800 text-base mb-2">Modelo Directivo / Autoritario</h4>
                                        <p class="text-xs text-slate-600 leading-relaxed">Centrado en la figura del hipnotizador, órdenes verbales estandarizadas y la búsqueda de dominancia o amnesia.</p>
                                    </div>
                                    <div class="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 shadow-xs">
                                        <span class="text-xs font-black text-emerald-700 uppercase tracking-widest block mb-1">Siglo XX · Enfoque Ericksoniano</span>
                                        <h4 class="font-bold text-emerald-950 text-base mb-2">Modelo Cooperativo / Permisivo</h4>
                                        <p class="text-xs text-emerald-900 leading-relaxed">Centrado en la relación, el respeto por la autonomía, la comunicación multinivel y la creatividad del propio consultante.</p>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l1-4-milton-erickson-enfoque",
                        "type": "html",
                        "title": "1.4 Milton H. Erickson y su Enfoque",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">La Vida y Resiliencia de Milton H. Erickson</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Milton Erickson superó la poliomielitis a los 17 años y nuevamente en la adultez. Sus propias limitaciones físicas (dislexia, acromatopsia, parálisis parcial) afinaron su capacidad de observación no verbal, paciencia y lenguaje sugestivo.
                                </p>
                                <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-3">
                                    <h3 class="text-base font-bold text-indigo-950">🔍 El Inconsciente según Erickson:</h3>
                                    <p class="text-sm text-indigo-900 leading-relaxed">
                                        No es un almacén reprimido y amenazante, sino una mente inteligente, creativa y sabia que trabaja incansablemente para mantener el equilibrio y la salud integral del organismo.
                                    </p>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l1-5-diferencias-clasica-vs-ericksoniana",
                        "type": "html",
                        "title": "1.5 Diferencias entre Hipnosis Clásica y Enfoque Ericksoniano",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Comparativa Fundamental de Paradigmas</h2>
                                <div class="overflow-x-auto">
                                    <table class="w-full text-left text-sm border-collapse rounded-2xl overflow-hidden border border-slate-200">
                                        <thead>
                                            <tr class="bg-slate-100 text-slate-800 font-black">
                                                <th class="p-4 border-b border-slate-200">Criterio</th>
                                                <th class="p-4 border-b border-slate-200">Hipnosis Clásica Tradicional</th>
                                                <th class="p-4 border-b border-slate-200 bg-emerald-50 text-emerald-900">Hipnosis Ericksoniana</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-slate-100 text-slate-600">
                                            <tr>
                                                <td class="p-4 font-bold text-slate-800">Estilo de Comunicación</td>
                                                <td class="p-4">Directo, imperativo ("Duerma ahora")</td>
                                                <td class="p-4 bg-emerald-50/40 font-semibold text-slate-800">Indirecto, permisivo ("Puede notar...")</td>
                                            </tr>
                                            <tr>
                                                <td class="p-4 font-bold text-slate-800">Rol del Profesional</td>
                                                <td class="p-4">Autoridad emisora de órdenes</td>
                                                <td class="p-4 bg-emerald-50/40 font-semibold text-slate-800">Facilitador y observador atento</td>
                                            </tr>
                                            <tr>
                                                <td class="p-4 font-bold text-slate-800">Uso de Resistencias</td>
                                                <td class="p-4">Se intentan vencer o confrontar</td>
                                                <td class="p-4 bg-emerald-50/40 font-semibold text-slate-800">Se aceptan y utilizan a favor del trance</td>
                                            </tr>
                                            <tr>
                                                <td class="p-4 font-bold text-slate-800">Estructura del Guion</td>
                                                <td class="p-4">Estándar y memorizado</td>
                                                <td class="p-4 bg-emerald-50/40 font-semibold text-slate-800">Flexible e improvisado en tiempo real</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l1-6-concepto-de-trance",
                        "type": "html",
                        "title": "1.6 El Concepto de Trance",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">El Trance como Estado Cotidiano y Natural</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Erickson demostró que experimentamos "trances cotidianos" múltiples veces al día: cuando conducimos en automático, al abstraernos mirando una puesta de sol o al sumergirnos en la lectura de un libro.
                                </p>
                                <div class="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-2">
                                    <h4 class="font-bold text-amber-950 text-base">📌 Característica Clave:</h4>
                                    <p class="text-sm text-amber-900">
                                        El trance ericksoniano no requiere perder la noción del entorno; es simplemente una reorientación interna de la atención enfocada.
                                    </p>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l1-7-atencion-absorcion-experiencia",
                        "type": "html",
                        "title": "1.7 Atención, Absorción y Experiencia Subjetiva",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Mecanismos de la Experiencia Hipnótica</h2>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                                        <div class="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">1. Atención</div>
                                        <h4 class="font-bold text-slate-900 text-sm mb-2">Foco Selectivo</h4>
                                        <p class="text-xs text-slate-600 leading-relaxed">Concentración reducida sobre un estímulo interno o externo particular.</p>
                                    </div>
                                    <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                                        <div class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">2. Absorción</div>
                                        <h4 class="font-bold text-slate-900 text-sm mb-2">Immersión Mental</h4>
                                        <p class="text-xs text-slate-600 leading-relaxed">Capacidad de involucrarse plenamente en la imaginería y las sensaciones.</p>
                                    </div>
                                    <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                                        <div class="text-xs font-black text-purple-600 uppercase tracking-widest mb-1">3. Subjetividad</div>
                                        <h4 class="font-bold text-slate-900 text-sm mb-2">Vivencia Única</h4>
                                        <p class="text-xs text-slate-600 leading-relaxed">Cada persona experimenta y responde al trance a su propia manera.</p>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l1-8-mitos-y-realidades",
                        "type": "html",
                        "title": "1.8 Mitos y Realidades",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Desmitificando la Hipnosis Ericksoniana</h2>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 space-y-2">
                                        <span class="text-xs font-black text-rose-700 uppercase tracking-widest">❌ Mito Frecuente</span>
                                        <h4 class="font-bold text-rose-950 text-sm">"La hipnosis es control mental o pérdida de consciencia."</h4>
                                        <p class="text-xs text-rose-900 leading-relaxed">Realidad: En el trance ericksoniano la persona mantiene pleno control, puede hablar o salir del trance si lo desea.</p>
                                    </div>
                                    <div class="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-2">
                                        <span class="text-xs font-black text-emerald-700 uppercase tracking-widest">✓ Realidad Científica</span>
                                        <h4 class="font-bold text-emerald-950 text-sm">"Es un aprendizaje colaborativo de atención enfática."</h4>
                                        <p class="text-xs text-emerald-900 leading-relaxed">La persona colabora activamente con el comunicador para acceder a sus propios recursos internos.</p>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l1-9-principios-eticos-basicos",
                        "type": "html",
                        "title": "1.9 Principios Éticos Básicos",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Ética y Responsabilidad en el Lenguaje Hipnótico</h2>
                                <div class="bg-slate-900 text-white rounded-3xl p-8 space-y-4 shadow-md">
                                    <h3 class="text-xl font-black text-emerald-400">Reglas Éticas Fundamentales</h3>
                                    <ul class="space-y-3 text-sm text-slate-300 list-disc list-inside">
                                        <li><strong>Respeto por la Autonomía:</strong> Nunca utilizar sugerencias manipuladoras ni coercitivas.</li>
                                        <li><strong>Consentimiento Informado:</strong> Explicar claramente el proceso y los objetivos al consultante.</li>
                                        <li><strong>Límites de Competencia:</strong> Reconocer la propia formación y derivar cuando corresponda a un profesional sanitario regulado.</li>
                                        <li><strong>No Promesas Mágicas:</strong> No ofrecer curaciones milagrosas ni garantías absolutas.</li>
                                    </ul>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l1-quiz-inicial",
                        "type": "quiz",
                        "title": "1.10 Evaluativo: Cuestionario Inicial del Módulo 1",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q1-1",
                                    "type": "multiple",
                                    "prompt": "¿Cuál es la característica principal del lenguaje en la Hipnosis Ericksoniana?",
                                    "choices": [
                                        { "id": "opt1", "text": "Es autoritario, directo e impositivo.", "isCorrect": False },
                                        { "id": "opt2", "text": "Es indirecto, permisivo y orientado a posibilidades.", "isCorrect": True },
                                        { "id": "opt3", "text": "Es exclusivamente técnico y académico.", "isCorrect": False },
                                        { "id": "opt4", "text": "Es impositivo mediante órdenes fijas.", "isCorrect": False }
                                    ]
                                },
                                {
                                    "id": "q1-2",
                                    "type": "truefalse",
                                    "prompt": "Según Erickson, el trance es un estado natural de aprendizaje interno que ocurre con frecuencia en la vida cotidiana.",
                                    "correctBool": True
                                },
                                {
                                    "id": "q1-3",
                                    "type": "multiple",
                                    "prompt": "¿Qué significa el principio ericksoniano de 'utilización'?",
                                    "choices": [
                                        { "id": "u1", "text": "Imponer un guion memorizado sin importar el consultante.", "isCorrect": False },
                                        { "id": "u2", "text": "Usar todo lo que trae el consultante (sus expresiones, respiración o dudas) para facilitar el proceso.", "isCorrect": True },
                                        { "id": "u3", "text": "Utilizar la hipnosis para controlar el comportamiento ajeno.", "isCorrect": False }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 2 — LA FILOSOFÍA DE ERICKSON
            # ══════════════════════════════════════════════════════════
            {
                "id": "m2-filosofia-erickson",
                "title": "Módulo 2: La Filosofía de Erickson",
                "items": [
                    {
                        "id": "l2-1-principios-fundamentales",
                        "type": "html",
                        "title": "2.1 Principios Fundamentales del Enfoque",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">La Filosofía Ericksoniana de Cambio</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Milton Erickson no intentó encajar al paciente en una teoría; creó una teoría diferente para cada paciente. Los principios fundamentales son:
                                </p>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 space-y-2">
                                        <h4 class="font-bold text-emerald-950 text-base">🌱 Orientación a Recursos</h4>
                                        <p class="text-xs text-emerald-900 leading-relaxed">El consultante ya posee internamente todos los aprendizajes y recursos necesarios para resolver su dificultad.</p>
                                    </div>
                                    <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 space-y-2">
                                        <h4 class="font-bold text-indigo-950 text-base">🔄 Flexibilidad Total</h4>
                                        <p class="text-xs text-indigo-900 leading-relaxed">El comunicador cambia de estrategia tantas veces como sea necesario para adaptarse a la respuesta del consultante.</p>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l2-2-mapa-observacion",
                        "type": "html",
                        "title": "2.2 Ejercicio Práctico: Mapa de Calibración u Observación",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">El Arte de Observar Calibraciones Fisiológicas</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    La observación ericksoniana busca notar cambios sutiles sin juzgar ni interpretar apresuradamente.
                                </p>
                                <div class="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
                                    <h3 class="text-lg font-bold text-slate-900">📋 Elementos del Mapa de Observación:</h3>
                                    <ul class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700 font-medium">
                                        <li class="bg-slate-50 p-3 rounded-xl border border-slate-100">🗣️ <strong>Lenguaje:</strong> Tono de voz, ritmo, pausas y elección de palabras sensoriales.</li>
                                        <li class="bg-slate-50 p-3 rounded-xl border border-slate-100">🫁 <strong>Respiración:</strong> Frecuencia (rápida/lenta) y ubicación (torácica/abdominal).</li>
                                        <li class="bg-slate-50 p-3 rounded-xl border border-slate-100">🧍 <strong>Postura:</strong> Tono muscular, micro-movimientos y simetría facial.</li>
                                        <li class="bg-slate-50 p-3 rounded-xl border border-slate-100">👁️ <strong>Atención:</strong> Parpadeo, foco visual y micro-cambios en la mirada.</li>
                                    </ul>
                                    <div class="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900">
                                        <strong>Advertencia de Calibración:</strong> Notar una señal (ej: bajar la mirada o suspirar) indica un cambio de estado interno, pero NUNCA permite diagnosticar con certeza absoluta qué está pensando la persona.
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l2-quiz",
                        "type": "quiz",
                        "title": "2.3 Evaluativo: Comprensión de la Filosofía Ericksoniana",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q2-1",
                                    "type": "truefalse",
                                    "prompt": "En el enfoque ericksoniano se considera que el paciente posee internamente los recursos para su propio cambio.",
                                    "correctBool": True
                                },
                                {
                                    "id": "q2-2",
                                    "type": "multiple",
                                    "prompt": "¿Qué postura debe tomar el practicante ericksoniano ante las respuestas fisiológicas observables del consultante?",
                                    "choices": [
                                        { "id": "m1", "text": "Diagnosticar con total certeza el inconsciente del sujeto.", "isCorrect": False },
                                        { "id": "m2", "text": "Observar los cambios sin juzgar y utilizarlos para acompañar el ritmo del consultante.", "isCorrect": True },
                                        { "id": "m3", "text": "Ignorarlos por completo y concentrarse en un texto escrito.", "isCorrect": False }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 3 — RAPPORT, PACING Y LEADING
            # ══════════════════════════════════════════════════════════
            {
                "id": "m3-rapport-pacing-leading",
                "title": "Módulo 3: Rapport, Pacing y Leading",
                "items": [
                    {
                        "id": "l3-1-rapport",
                        "type": "html",
                        "title": "3.1 Rapport y Sincronización Comunicacional",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Rapport: La Base de la Confianza Mútua</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    El rapport no es una técnica de simpatía superficial, sino una resonancia profunda de presencia, escucha empática y sintonía comunicacional con la experiencia del consultante.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "l3-2-pacing-leading",
                        "type": "html",
                        "title": "3.2 Pacing (Acompañar) y Leading (Liderar)",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">El Baile Comunicacional: Acompañar para Guiar</h2>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 space-y-3">
                                        <h3 class="text-lg font-black text-emerald-950">1. Pacing (Acompañamiento)</h3>
                                        <p class="text-xs text-emerald-900 leading-relaxed">
                                            Reflejar verbal y no verbalmente la experiencia indiscutible del consultante. Describir la realidad observable (ej: "Estás sentado aquí, escuchando el sonido de mi voz, sintiendo tu respiración...").
                                        </p>
                                    </div>
                                    <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-3">
                                        <h3 class="text-lg font-black text-indigo-950">2. Leading (Liderazgo)</h3>
                                        <p class="text-xs text-indigo-900 leading-relaxed">
                                            Una vez establecido el pacing, se introduce de manera suave una invitación o sugerencia para orientar la atención hacia un nuevo estado (ej: "...y puedes empezar a permitir que tus párpados se vuelvan confortablemente pesados...").
                                        </p>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l3-quiz",
                        "type": "quiz",
                        "title": "3.3 Evaluativo: Dinámica de Pacing y Leading",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q3-1",
                                    "type": "multiple",
                                    "prompt": "¿Cuál es el propósito del 'Pacing' o acompañamiento?",
                                    "choices": [
                                        { "id": "p1", "text": "Ordenar al consultante que cambie inmediatamente su comportamiento.", "isCorrect": False },
                                        { "id": "p2", "text": "Validar y acompañar la experiencia actual observable para construir rapport y receptividad.", "isCorrect": True },
                                        { "id": "p3", "text": "Convencer al sujeto mediante argumentos lógicos rígidos.", "isCorrect": False }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 4 — EL LENGUAJE ERICKSONIANO
            # ══════════════════════════════════════════════════════════
            {
                "id": "m4-lenguaje-ericksoniano",
                "title": "Módulo 4: El Lenguaje Ericksoniano",
                "items": [
                    {
                        "id": "l4-1-patrones-lenguaje",
                        "type": "html",
                        "title": "4.1 El Lenguaje Permisivo y Sugestivo",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Estructuras Lingüísticas del Enfoque Ericksoniano</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    El Milton-Modelo del lenguaje utiliza patrones de imprecisión calculada para permitir que la mente del consultante complete el significado con sus propios recuerdos y experiencias.
                                </p>
                                <div class="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
                                    <h3 class="text-lg font-bold text-slate-900">Ejemplo de Reformulación Ericksoniana:</h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                        <div class="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-950">
                                            <strong>Frase Tradicional / Directiva:</strong><br/>
                                            "Relájate ahora y no pienses en nada."
                                        </div>
                                        <div class="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-950">
                                            <strong>Formulación Ericksoniana Permisiva:</strong><br/>
                                            "Puedes comenzar a notar en qué medida alguna parte de ti ya sabe cómo relajarse a su propio ritmo..."
                                        </div>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l4-quiz",
                        "type": "quiz",
                        "title": "4.2 Evaluativo: Reconocimiento de Lenguaje Permisivo",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q4-1",
                                    "type": "multiple",
                                    "prompt": "¿Por qué la formulación permisiva suele ser más efectiva en la comunicación ericksoniana?",
                                    "choices": [
                                        { "id": "f1", "text": "Porque no genera resistencias conscientes y respeta la autonomía del sujeto.", "isCorrect": True },
                                        { "id": "f2", "text": "Porque obliga a la persona a obedecer sin dudar.", "isCorrect": False },
                                        { "id": "f3", "text": "Porque no utiliza palabras.", "isCorrect": False }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 5 — SUGESTIÓN INDIRECTA
            # ══════════════════════════════════════════════════════════
            {
                "id": "m5-sugestion-indirecta",
                "title": "Módulo 5: Sugestión Indirecta",
                "items": [
                    {
                        "id": "l5-1-tipos-sugestiones",
                        "type": "html",
                        "title": "5.1 Formas y Tipos de Sugestión Indirecta",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Mecanismos de Sugestión Indirecta</h2>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                    <div class="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs">
                                        <h4 class="font-bold text-slate-900 text-sm mb-2">1. Presuposiciones</h4>
                                        <p class="text-slate-600 leading-relaxed">Asumir un resultado beneficioso dentro de la estructura de la frase (ej: "¿Te darás cuenta de la relajación antes o después de cerrar los ojos?").</p>
                                    </div>
                                    <div class="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs">
                                        <h4 class="font-bold text-slate-900 text-sm mb-2">2. Ilusión de Alternativas</h4>
                                        <p class="text-slate-600 leading-relaxed">Ofrecer opciones donde todas conducen a una experiencia constructiva (ej: "Puedes relajarte sentado o dejar que tu espalda se acomode suavemente").</p>
                                    </div>
                                    <div class="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs">
                                        <h4 class="font-bold text-slate-900 text-sm mb-2">3. Sugestión Abierta</h4>
                                        <p class="text-slate-600 leading-relaxed">Invitar a descubrir respuestas propias (ej: "Tu mente inconsciente sabe exactamente qué recuerdo reconfortante traer ahora").</p>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l5-quiz",
                        "type": "quiz",
                        "title": "5.2 Evaluativo: Clasificación de Sugestiones Indirectas",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q5-1",
                                    "type": "multiple",
                                    "prompt": "En la frase: '¿Prefieres entrar en tranquilidad profunda ahora o darte un par de respiraciones más?', ¿qué estructura de sugestión indirecta se está empleando?",
                                    "choices": [
                                        { "id": "s1", "text": "Ilusión de alternativas con presuposición de tranquilidad.", "isCorrect": True },
                                        { "id": "s2", "text": "Una orden directa y autoritaria.", "isCorrect": False },
                                        { "id": "s3", "text": "Una confrontación negativa.", "isCorrect": False }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 6 — METÁFORAS E HISTORIAS TERAPÉUTICAS
            # ══════════════════════════════════════════════════════════
            {
                "id": "m6-metaforas-historias",
                "title": "Módulo 6: Metáforas e Historias Terapéuticas",
                "items": [
                    {
                        "id": "l6-1-estructura-metafora",
                        "type": "html",
                        "title": "6.1 Estructura y Función de la Metáfora Ericksoniana",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">La Comunicación a través del Cuento y el Símbolo</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Las historias permiten sortear la barrera del análisis consciente crítico, comunicando directamente con la mente inconsciente para ofrecer nuevas perspectivas de solución.
                                </p>
                                <div class="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 space-y-4">
                                    <h3 class="text-base font-bold text-emerald-950">Las 5 Etapas Narrativas de la Metáfora Ericksoniana:</h3>
                                    <ol class="list-decimal list-inside space-y-2 text-xs text-emerald-900 font-semibold">
                                        <li><strong>Situación Inicial:</strong> Establecer un escenario paralelo cercano a la vivencia del consultante.</li>
                                        <li><strong>Desafío / Nudo:</strong> Introducir el reto que enfrenta el personaje o elemento de la historia.</li>
                                        <li><strong>Descubrimiento del Recurso:</strong> El protagonista encuentra una habilidad interna o solución imprevista.</li>
                                        <li><strong>Transformación:</strong> Superación progresiva del obstáculo.</li>
                                        <li><strong>Integración y Cierre:</strong> Consolidación del aprendizaje extrapolable a la vida real.</li>
                                    </ol>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l6-quiz",
                        "type": "quiz",
                        "title": "6.2 Evaluativo: Arquitectura de la Metáfora Terapéutica",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q6-1",
                                    "type": "truefalse",
                                    "prompt": "Una metáfora ericksoniana eficaz permite que el consultante descubra por sí mismo el significado aplicable a su propia vida sin imponérselo de forma literal.",
                                    "correctBool": True
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 7 — INDUCCIONES ERICKSONIANAS
            # ══════════════════════════════════════════════════════════
            {
                "id": "m7-inducciones-ericksonianas",
                "title": "Módulo 7: Inducciones Ericksonianas",
                "items": [
                    {
                        "id": "l7-1-estilos-induccion",
                        "type": "html",
                        "title": "7.1 Inducción Conversacional y Naturalista",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Técnicas de Inducción Naturalista</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    La inducción ericksoniana se distingue por integrarse de manera fluida en la misma conversación, guiando suavemente la atención desde lo externo hacia la experiencia interna.
                                </p>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    <div class="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl">
                                        <h4 class="font-bold text-indigo-950 text-sm mb-1">Inducción por Focalización de Atención</h4>
                                        <p class="text-indigo-900 leading-relaxed">Invitar a fijar la vista en un punto u objeto, mientras se relata una descripción placentera y pausada.</p>
                                    </div>
                                    <div class="bg-teal-50 border border-teal-100 p-5 rounded-2xl">
                                        <h4 class="font-bold text-teal-950 text-sm mb-1">Inducción Conversacional</h4>
                                        <p class="text-teal-900 leading-relaxed">Entrelazar sugestiones permisivas dentro de un diálogo reflexivo sobre un recuerdo agradable o un aprendizaje del pasado.</p>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l7-quiz",
                        "type": "quiz",
                        "title": "7.2 Evaluativo: Inducciones Ericksonianas",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q7-1",
                                    "type": "multiple",
                                    "prompt": "¿Qué distingue a la inducción ericksoniana de una inducción tradicional por comandos?",
                                    "choices": [
                                        { "id": "ind1", "text": "Su fluidez conversacional, permisividad y adaptación constante al ritmo del consultante.", "isCorrect": True },
                                        { "id": "ind2", "text": "El uso de luces brillantes y relojes oscilantes obligatorios.", "isCorrect": False }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 8 — FENÓMENOS HIPNÓTICOS
            # ══════════════════════════════════════════════════════════
            {
                "id": "m8-fenomenos-hipnoticos",
                "title": "Módulo 8: Fenómenos Hipnóticos",
                "items": [
                    {
                        "id": "l8-1-comprension-fenomenos",
                        "type": "html",
                        "title": "8.1 Estudio de Respuestas y Fenómenos Hipnóticos",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Fenómenos Hipnóticos desde la Psicología Experimental</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Los fenómenos hipnóticos son manifestaciones de la capacidad de absorción y disociación de la mente humana. Deben entenderse como respuestas estudiadas en laboratorio y contexto clínico, no como espectáculos mágicos.
                                </p>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
                                        <strong class="text-slate-900 block mb-1">⏳ Distorsión Temporal:</strong>
                                        Percepción subjetiva de que el tiempo transcurre más rápido o más despacio durante el trance.
                                    </div>
                                    <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
                                        <strong class="text-slate-900 block mb-1">🖐️ Respuestas Ideomotoras:</strong>
                                        Movimientos corporales automáticos involuntarios (ej: elevación sutil de un dedo como señal del inconsciente).
                                    </div>
                                    <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
                                        <strong class="text-slate-900 block mb-1">🧘 Catalepsia:</strong>
                                        Inmovilidad o firmeza muscular placentera y relajada de un miembro.
                                    </div>
                                    <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
                                        <strong class="text-slate-900 block mb-1">🧩 Disociación:</strong>
                                        Separación temporal de un aspecto de la experiencia consciente para observar un problema con tranquilidad.
                                    </div>
                                </div>
                                <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900">
                                    <strong>Distinción Ética Esencial:</strong> Un fenómeno hipnótico observable no constituye por sí mismo una garantía de resultado o curación clínica. Es una manifestación de receptividad que requiere un diseño responsable.
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l8-quiz",
                        "type": "quiz",
                        "title": "8.2 Evaluativo: Fenómenos Hipnóticos",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q8-1",
                                    "type": "truefalse",
                                    "prompt": "La presencia de un fenómeno hipnótico (como una respuesta ideomotora) garantiza automáticamente la resolución definitiva de una patología médica.",
                                    "correctBool": False
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 9 — ESTRUCTURA DE UNA SESIÓN
            # ══════════════════════════════════════════════════════════
            {
                "id": "m9-estructura-sesion",
                "title": "Módulo 9: Estructura de una Sesión Ericksoniana",
                "items": [
                    {
                        "id": "l9-1-las-10-etapas",
                        "type": "html",
                        "title": "9.1 Las 10 Etapas de una Sesión Completa",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Estructura Secuencial de Acompañamiento</h2>
                                <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl"><strong>1. Preparación:</strong> Encuadre, espacio seguro y objetivos.</div>
                                        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl"><strong>2. Rapport:</strong> Sintonía verbal y no verbal.</div>
                                        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl"><strong>3. Observación:</strong> Calibración de ritmo y señales fisiológicas.</div>
                                        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl"><strong>4. Pacing:</strong> Acompañamiento de la experiencia presente.</div>
                                        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl"><strong>5. Inducción:</strong> Reorientación del foco atencional.</div>
                                        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl"><strong>6. Profundización:</strong> Estabilización del trance cómodo.</div>
                                        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl"><strong>7. Intervención:</strong> Metáforas y sugestiones ericksonianas.</div>
                                        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl"><strong>8. Integración:</strong> Consolidación de recursos descubiertos.</div>
                                        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl"><strong>9. Salida:</strong> Retorno gradual al estado habitual de alerta.</div>
                                        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl"><strong>10. Cierre:</strong> Orientación práctica hacia el aprendizaje cotidiano.</div>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l9-quiz",
                        "type": "quiz",
                        "title": "9.2 Evaluativo: Fases de la Sesión Ericksoniana",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q9-1",
                                    "type": "multiple",
                                    "prompt": "¿Por qué es crucial la etapa de 'Salida' o orientación al estado ordinario?",
                                    "choices": [
                                        { "id": "e1", "text": "Para asegurar una transición suave, segura y plenamente alerta a las actividades diarias.", "isCorrect": True },
                                        { "id": "e2", "text": "Porque el consultante no podría despertarse sin ella.", "isCorrect": False }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },

            # ══════════════════════════════════════════════════════════
            # MÓDULO 10 — INTEGRACIÓN Y PRÁCTICA
            # ══════════════════════════════════════════════════════════
            {
                "id": "m10-integracion-practica",
                "title": "Módulo 10: Integración y Práctica Profesional",
                "items": [
                    {
                        "id": "l10-1-integra-lo-aprendido",
                        "type": "html",
                        "title": "10.1 Integra lo Aprendido y Caso Práctico",
                        "html": """
                            <div class="space-y-6 select-text">
                                <div class="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-8 shadow-md">
                                    <span class="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">🎓 PROYECTO FINAL DE INTEGRACIÓN</span>
                                    <h2 class="text-3xl font-black mt-3 mb-2">Integra lo Aprendido</h2>
                                    <p class="text-emerald-100 text-sm leading-relaxed">
                                        Consolida tus competencias diseñando un mapa de sesión completo utilizando la estructura de 10 etapas estudiada en el programa.
                                    </p>
                                </div>
                                <div class="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
                                    <h3 class="text-lg font-bold text-slate-900">Caso Hipotético de Práctica:</h3>
                                    <p class="text-xs text-slate-600 leading-relaxed">
                                        "Una persona acude buscando desarrollar recursos personales para afrontar la oratoria en público con calma y naturalidad."
                                    </p>
                                    <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs text-slate-700">
                                        <strong>Pasos Sugeridos:</strong>
                                        <ul class="list-disc list-inside space-y-1">
                                            <li>Definir 3 frases de Pacing descriptivo.</li>
                                            <li>Formular 2 sugestiones permisivas con presuposición de calma.</li>
                                            <li>Bocetar una metáfora breve sobre adaptación (ej: el junco que se flexiona con el viento).</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l10-quiz-final",
                        "type": "quiz",
                        "title": "10.2 Examen Final Evaluativo de Hipnosis Ericksoniana",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q10-1",
                                    "type": "multiple",
                                    "prompt": "¿Cuál es la premisa fundamental del enfoque de Milton Erickson frente al consultante?",
                                    "choices": [
                                        { "id": "ex1", "text": "El paciente debe adaptarse a un guion autoritario estándar.", "isCorrect": False },
                                        { "id": "ex2", "text": "El consultante posee una mente inconsciente rica en recursos que pueden ser facilitados con respeto y lenguaje permisivo.", "isCorrect": True },
                                        { "id": "ex3", "text": "La hipnosis reemplaza los tratamientos sanitarios sin necesidad de formación médica.", "isCorrect": False }
                                    ]
                                },
                                {
                                    "id": "q10-2",
                                    "type": "truefalse",
                                    "prompt": "El certificado de este curso avala al estudiante como profesional sanitario o clínico regulado por la ley.",
                                    "correctBool": False
                                },
                                {
                                    "id": "q10-3",
                                    "type": "multiple",
                                    "prompt": "¿Qué actitud ética debe mantener el practicante de herramientas ericksonianas?",
                                    "choices": [
                                        { "id": "ex3_1", "text": "Respetar la autonomía, actuar con consentimiento, reconocer sus límites profesionales y derivar cuando sea necesario.", "isCorrect": True },
                                        { "id": "ex3_2", "text": "Garantizar resultados inmediatos y curaciones milagrosas.", "isCorrect": False }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    }

    course, created = Course.objects.get_or_create(
        slug="hipnosis-ericksoniana",
        defaults={
            "title": "HIPNOSIS ERICKSONIANA: El Arte de Acompañar el Cambio",
            "description": "Programa estructurado para estudiar los fundamentos de la Hipnosis Ericksoniana, el lenguaje permisivo, la utilización, el rapport, las metáforas, las inducciones y el diseño de experiencias hipnóticas.",
            "description_html": """
                <div class="space-y-4 text-slate-700">
                    <p class="text-lg font-bold text-slate-900">
                        "El arte de acompañar el cambio a través del lenguaje, la experiencia y el inconsciente."
                    </p>
                    <p>
                        Aprende de forma progresiva, rigurosa y ética las herramientas de comunicación e inducción desarrolladas por el Dr. Milton H. Erickson.
                    </p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-medium text-sm">
                        <div class="flex items-center gap-2">✓ 10 Módulos de Formación Estructurada</div>
                        <div class="flex items-center gap-2">✓ Laboratorio Ericksoniano Interactivo</div>
                        <div class="flex items-center gap-2">✓ Analizador de Lenguaje Ericksoniano</div>
                        <div class="flex items-center gap-2">✓ Constructor de Metáforas & Sesiones</div>
                        <div class="flex items-center gap-2">✓ Biblioteca de Recursos Audio/PDF</div>
                        <div class="flex items-center gap-2">✓ Certificado de Finalización Oficial</div>
                    </div>
                </div>
            """,
            "category": "Hipnosis Ericksoniana & Comunicación",
            "tags": [
                "Hipnosis Ericksoniana", "Milton Erickson", "Lenguaje Permisivo", 
                "Sugestión Indirecta", "Metáforas Terapéuticas", "Pacing y Leading", 
                "Rapport", "Trance Ericksoniano", "Conexión Luz"
            ],
            "price_cop": 0,
            "cover_url": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80",
            "status": Course.Status.PUBLISHED,
            "is_active": True,
            "draft_content": content,
            "published_content": content
        }
    )

    if not created:
        course.title = "HIPNOSIS ERICKSONIANA: El Arte de Acompañar el Cambio"
        course.description = "Programa estructurado para estudiar los fundamentos de la Hipnosis Ericksoniana, el lenguaje permisivo, la utilización, el rapport, las metáforas, las inducciones y el diseño de experiencias hipnóticas."
        course.category = "Hipnosis Ericksoniana & Comunicación"
        course.tags = [
            "Hipnosis Ericksoniana", "Milton Erickson", "Lenguaje Permisivo", 
            "Sugestión Indirecta", "Metáforas Terapéuticas", "Pacing y Leading", 
            "Rapport", "Trance Ericksoniano", "Conexión Luz"
        ]
        course.cover_url = "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80"
        course.status = Course.Status.PUBLISHED
        course.is_active = True
        course.draft_content = content
        course.published_content = content
        course.save()

    print(f"Curso Hipnosis Ericksoniana {'creado' if created else 'actualizado'} exitosamente con ID: {course.id}")

if __name__ == "__main__":
    create_ericksoniana_course()
