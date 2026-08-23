import os
import django
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Course

def create_autohipnosis_course():
    def gid(): return str(uuid.uuid4())

    content = {
        "version": 1,
        "sections": [
            {
                "id": "m1-conociendo-tu-mente",
                "title": "Módulo 1: Conociendo tu Mente",
                "items": [
                    {
                        "id": "l1-1-bienvenida",
                        "type": "html",
                        "title": "1.1 Bienvenida al Viaje de la Autohipnosis",
                        "html": """
                            <div class="space-y-6 select-text">
                                <div class="bg-gradient-to-r from-indigo-50 via-purple-50 to-amber-50 text-slate-900 rounded-3xl p-8 shadow-xs border border-indigo-100 relative overflow-hidden">
                                    <span class="text-xs font-black uppercase tracking-widest text-indigo-700 bg-white px-3.5 py-1 rounded-full border border-indigo-200 shadow-2xs">
                                        ✨ CONEXIÓN LUZ · MÓDULO 1
                                    </span>
                                    <h2 class="text-3xl md:text-4xl font-black mt-3 mb-2 tracking-tight text-slate-900">Bienvenido a la Autohipnosis Consciente</h2>
                                    <p class="text-slate-700 text-sm md:text-base leading-relaxed font-medium">
                                        Un viaje profundo hacia la comprensión de tu propia mente, el dominio de tu atención y la transformación positiva de tu diálogo interno.
                                    </p>
                                </div>

                                <div class="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-2xs">
                                    <h3 class="text-xl font-black text-slate-900">Objetivo de aprendizaje</h3>
                                    <p class="text-slate-600 text-sm leading-relaxed">
                                        Comprender la estructura del curso, la filosofía de Conexión Luz basada en neurociencia y psicología contemporánea, y preparar tu actitud para una práctica transformadora y responsable.
                                    </p>
                                </div>

                                <div class="space-y-4">
                                    <h3 class="text-xl font-black text-slate-900">¿Por qué aprender Autohipnosis?</h3>
                                    <p class="text-slate-700 text-sm md:text-base leading-relaxed">
                                        La autohipnosis no es un acto mágico ni misterioso. Es la capacidad innata del ser humano para focalizar la atención de manera intencionada, calmar el ruido mental y enviar sugestiones constructivas al subconsciente.
                                    </p>
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                        <div class="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4">
                                            <div class="font-bold text-indigo-950 text-sm mb-1">🧠 Neurociencia Integrada</div>
                                            <p class="text-xs text-indigo-800">Modula ondas Alfa y Theta para reducir la reactividad del estrés.</p>
                                        </div>
                                        <div class="bg-purple-50/70 border border-purple-100 rounded-xl p-4">
                                            <div class="font-bold text-purple-950 text-sm mb-1">💬 Diálogo Interno</div>
                                            <p class="text-xs text-purple-800">Transforma patrones autocríticos en sugestiones de alta confianza.</p>
                                        </div>
                                        <div class="bg-emerald-50/70 border border-emerald-100 rounded-xl p-4">
                                            <div class="font-bold text-emerald-950 text-sm mb-1">🌿 Autonomía Total</div>
                                            <p class="text-xs text-emerald-800">Aprende una herramienta personal que te acompañará toda la vida.</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 space-y-2">
                                    <h4 class="font-bold text-amber-950 text-sm flex items-center gap-2">
                                        📌 Reflexión de inicio
                                    </h4>
                                    <p class="text-xs text-amber-900 leading-relaxed">
                                        ¿Qué aspecto de tu vida te gustaría transformar al aprender a dirigir tu atención consciente? Anota mentalmente o en un cuaderno tu intención principal para este programa.
                                    </p>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l1-2-que-es-hipnosis",
                        "type": "html",
                        "title": "1.2 ¿Qué es la Hipnosis?",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">¿Qué es realmente la Hipnosis?</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    La hipnosis es un estado natural de atención enfocada, receptividad aumentada y relajación física. Lejos de las representaciones dramáticas del espectáculo, en la ciencia contemporánea se define como un estado de absorción mental en el que la mente consciente se calma y permite una mejor comunicación con los procesos subconscientes.
                                </p>

                                <div class="bg-indigo-50 border border-indigo-100 text-slate-900 rounded-2xl p-6 space-y-3">
                                    <h3 class="text-lg font-bold text-indigo-950">🔍 Las 3 dimensiones del estado hipnótico:</h3>
                                    <ul class="space-y-2 text-sm text-indigo-900 list-disc list-inside">
                                        <li><strong>Focalización de la atención:</strong> Estrechamiento del foco consciente hacia un pensamiento o estímulo particular.</li>
                                        <li><strong>Disociación periférica:</strong> Reducción de la atención sobre ruidos o distracciones externas sin perder la conciencia.</li>
                                        <li><strong>Alta receptividad sugestiva:</strong> Mayor disposición de la mente para integrar imágenes e instrucciones beneficiosas.</li>
                                    </ul>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l1-3-que-es-autohipnosis",
                        "type": "html",
                        "title": "1.3 ¿Qué es la Autohipnosis?",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">La Autohipnosis: Tu Mismo como Guía</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Toda hipnosis es, en última instancia, **autohipnosis**. Cuando un profesional guía una sesión, simplemente ofrece indicaciones que el sujeto decide aceptar y llevar a cabo en su propia mente. En la autohipnosis, tú aprendes a asumir simultáneamente el rol de guía y practicante.
                                </p>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="border border-slate-200 rounded-2xl p-5 bg-white shadow-2xs">
                                        <h4 class="font-bold text-slate-900 mb-2">Heterohipnosis (Guiada por otro)</h4>
                                        <p class="text-xs text-slate-600 leading-relaxed">
                                            Una tercera persona proporciona la inducción, profundización y sugerencias mientras te relajas y sigues la voz externa.
                                        </p>
                                    </div>
                                    <div class="border border-indigo-200 rounded-2xl p-5 bg-indigo-50/50 shadow-2xs">
                                        <h4 class="font-bold text-indigo-950 mb-2">Autohipnosis (Autoguiada)</h4>
                                        <p class="text-xs text-indigo-900 leading-relaxed">
                                            Tú estableces el objetivo previo, utilizas tus propias técnicas de respiración/inducción y formulas tus propias autosugestiones.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l1-4-estados-conciencia",
                        "type": "html",
                        "title": "1.4 Hipnosis y Estados de Conciencia",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">La Neurobiología de las Ondas Cerebrales</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Durante el día, la mente oscila de forma natural entre distintos ritmos electroencefalográficos (EEG). La autohipnosis facilita la transición suave hacia frecuencias de ondas tranquilas y receptivas.
                                </p>

                                <div class="space-y-3">
                                    <div class="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between">
                                        <div>
                                            <span class="font-bold text-rose-950 text-sm">Ondas Beta (14 – 30 Hz)</span>
                                            <p class="text-xs text-rose-800">Estado de vigilia activa, alerta mental, lógica y ocasionalmente ansiedad/estrés.</p>
                                        </div>
                                        <span class="text-xs font-black bg-rose-200 text-rose-900 px-3 py-1 rounded-full">Vigilia</span>
                                    </div>

                                    <div class="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                                        <div>
                                            <span class="font-bold text-amber-950 text-sm">Ondas Alfa (8 – 13 Hz)</span>
                                            <p class="text-xs text-amber-800">Relajación ligera, meditación previa, ensoñación despierto. Puerta de entrada al trance.</p>
                                        </div>
                                        <span class="text-xs font-black bg-amber-200 text-amber-900 px-3 py-1 rounded-full">Trance Ligero</span>
                                    </div>

                                    <div class="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                                        <div>
                                            <span class="font-bold text-indigo-950 text-sm">Ondas Theta (4 – 7 Hz)</span>
                                            <p class="text-xs text-indigo-800">Trance hipnótico profundo, creatividad elevada, acceso directo a memorias y sugestiones.</p>
                                        </div>
                                        <span class="text-xs font-black bg-indigo-200 text-indigo-900 px-3 py-1 rounded-full">Trance Profundo</span>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l1-5-mitos-realidades",
                        "type": "html",
                        "title": "1.5 Mitos y Realidades de la Hipnosis",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Desmintiendo Mitos Populares</h2>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div class="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 space-y-2">
                                        <span class="font-black text-rose-700 block">❌ MITO 1: Pierdes el control de tu voluntad</span>
                                        <p class="text-slate-700 text-xs leading-relaxed">
                                            <strong>Realidad:</strong> Mantienes en todo momento tu capacidad de discernimiento y juicio moral. Jamás harás o dirás algo en trance que viole tu ética personal.
                                        </p>
                                    </div>
                                    <div class="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 space-y-2">
                                        <span class="font-black text-rose-700 block">❌ MITO 2: Te quedas atrapado en trance</span>
                                        <p class="text-slate-700 text-xs leading-relaxed">
                                            <strong>Realidad:</strong> Si dejas de prestar atención o de auto-sugerir, el estado de trance simplemente se disipa en relajación normal o en un sueño natural reparador del que despiertas normalmente.
                                        </p>
                                    </div>
                                    <div class="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-2">
                                        <span class="font-black text-emerald-700 block">✓ REALIDAD 1: Es una capacidad biológica universal</span>
                                        <p class="text-slate-700 text-xs leading-relaxed">
                                            Cualquier persona con capacidad normal de atención y deseo de practicar puede experimentar estados de trance hipnótico.
                                        </p>
                                    </div>
                                    <div class="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-2">
                                        <span class="font-black text-emerald-700 block">✓ REALIDAD 2: Reequilibrado psicoemocional</span>
                                        <p class="text-slate-700 text-xs leading-relaxed">
                                            Reduce niveles de cortisol y fortalece la autorregulación nerviosa simpática y parasimpática.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l1-6-papel-atencion",
                        "type": "html",
                        "title": "1.6 El Papel de la Atención Concentrada",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">La Atención como Linterna de la Mente</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Imagina tu atención consciente como el haz de una linterna en una habitación oscura. Allá donde apuntas el haz, la experiencia cobra nitidez e intensidad.
                                </p>
                                <div class="bg-indigo-50 border border-indigo-100 text-indigo-950 p-6 rounded-2xl space-y-3 shadow-2xs">
                                    <h4 class="text-base font-bold text-indigo-950">💡 Principio de Absorción:</h4>
                                    <p class="text-xs text-indigo-900 leading-relaxed">
                                        Cuando concentras tu atención en la calidez de tu mano, en tu respiración o en una imagen mental positiva, la mente disminuye la transmisión de señales irrelevantes y amplifica la vivencia enfocada.
                                    </p>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l1-7-expectativas-correctas",
                        "type": "html",
                        "title": "1.7 Expectativas Correctas para Tu Aprendizaje",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Construyendo una Actitud de Éxito</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Aprender autohipnosis es similar a aprender a tocar un instrumento musical o practicar un deporte. Requiere constancia, curiosidad libre de juicios y paciencia.
                                </p>

                                <div class="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl space-y-3">
                                    <h4 class="font-bold text-indigo-950">Las 3 Reglas de Oro del Practicante:</h4>
                                    <ol class="list-decimal list-inside text-xs text-indigo-900 space-y-2">
                                        <li><strong>Curiosidad en lugar de exigencia:</strong> No fuerces el trance; permite que ocurra orgánicamente.</li>
                                        <li><strong>Aceptación del nivel actual:</strong> Cada sesión es diferente; algunas serán de profunda calma y otras de relajación más ligera. Ambas son valiosas.</li>
                                        <li><strong>Práctica constante:</strong> La repetición crea autopistas neuronales sólidas.</li>
                                    </ol>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "q1-evaluacion",
                        "type": "quiz",
                        "title": "Evaluación del Módulo 1",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "q1-1",
                                    "type": "multiple",
                                    "prompt": "¿Qué tipo de ondas cerebrales caracterizan principalmente el estado de trance relajado y receptivo?",
                                    "choices": [
                                        {"id": "a", "text": "A) Ondas Beta de alta frecuencia y alerta de estrés", "isCorrect": False},
                                        {"id": "b", "text": "B) Ondas Alfa (8-13 Hz) y Theta (4-7 Hz)", "isCorrect": True},
                                        {"id": "c", "text": "C) Ondas Gamma únicamente de hiperactividad cognitiva", "isCorrect": False},
                                        {"id": "d", "text": "D) Inconsciencia anestésica profunda involuntaria", "isCorrect": False}
                                    ]
                                },
                                {
                                    "id": "q1-2",
                                    "type": "multiple",
                                    "prompt": "¿La persona pierde la voluntad o queda atrapada en trance durante la autohipnosis?",
                                    "choices": [
                                        {"id": "a", "text": "A) Sí, la mente pierde completamente la capacidad de discernimiento", "isCorrect": False},
                                        {"id": "b", "text": "B) No, la persona mantiene siempre el discernimiento y control consciente", "isCorrect": True},
                                        {"id": "c", "text": "C) Solo si se realiza la sesión durante más de una hora seguidamente", "isCorrect": False},
                                        {"id": "d", "text": "D) Depende exclusivamente del tipo de postura corporal elegida", "isCorrect": False}
                                    ]
                                },
                                {
                                    "id": "q1-3",
                                    "type": "multiple",
                                    "prompt": "¿Cuál es la actitud recomendada para aprender y practicar autohipnosis?",
                                    "choices": [
                                        {"id": "a", "text": "A) Exigencia rígida y forzar el trance a toda costa", "isCorrect": False},
                                        {"id": "b", "text": "B) Curiosidad libre de juicio, aceptación y práctica progresiva", "isCorrect": True},
                                        {"id": "c", "text": "C) Dudar constantemente de la propia capacidad mental", "isCorrect": False},
                                        {"id": "d", "text": "D) Tratar de poner la mente completamente en blanco sin respiración", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },
            {
                "id": "m2-preparando-terreno",
                "title": "Módulo 2: Preparando el Terreno",
                "items": [
                    {
                        "id": "l2-1-espacio",
                        "type": "html",
                        "title": "2.1 Preparar el Espacio Adecuado",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Creando tu Santuario de Práctica</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Para facilitar las primeras sesiones de autohipnosis, es ideal acondicionar un espacio físico libre de interrupciones que le envíe a tu mente la señal clara de tranquilidad.
                                </p>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                        <strong class="text-slate-900 block mb-1">💡 Iluminación tenue</strong>
                                        Evita luces deslumbrantes o sombras inquietantes; una luz cálida suave favorece el cierre ocular cómodo.
                                    </div>
                                    <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                        <strong class="text-slate-900 block mb-1">🔇 Control de estímulos</strong>
                                        Notificaciones telefónicas en modo no molestar. Informa a las personas de tu hogar si es necesario.
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l2-2-postura",
                        "type": "html",
                        "title": "2.2 Postura Corporal Adecuada",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">La Alineación del Cuerpo</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    La postura corporal influye directamente en el sistema nervioso. La meta es una postura que combine **comodidad extrema con la suficiente alerta consciente para no quedarse dormido**.
                                </p>
                                <div class="bg-indigo-50/70 border border-indigo-100 p-5 rounded-2xl text-xs space-y-2 text-indigo-950">
                                    <strong class="text-sm block">Recomendaciones posturales:</strong>
                                    <ul class="list-disc list-inside space-y-1">
                                        <li>Sentado en un sillón cómodo con espalda erguida pero sin tensión.</li>
                                        <li>Pies apoyados planos en el suelo o piernas cruzadas sin compresión.</li>
                                        <li>Manos descansando suavemente sobre el regazo o los muslos.</li>
                                        <li>Evitar practicar acostado en la cama al inicio para prevenir el sueño profundo inmediato.</li>
                                    </ul>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l2-3-respiracion",
                        "type": "html",
                        "title": "2.3 Respiración Consciente y Ritmo Nervioso",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">La Llave del Sistema Nervioso Parasimpático</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    La respiración diafragmática pausada es la vía más rápida para estimular el nervio vago, reducir la frecuencia cardíaca y preparar el cerebro para el trance.
                                </p>
                                <div class="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl space-y-3">
                                    <h4 class="font-bold text-emerald-950">Técnica de Respiración 4-7-8 de Relajación:</h4>
                                    <ol class="list-decimal list-inside text-xs text-emerald-900 space-y-2">
                                        <li>Inhala suavemente por la nariz contando <strong>4 segundos</strong> enviando el aire al abdomen.</li>
                                        <li>Mantiene el aire pausadamente durante <strong>7 segundos</strong>.</li>
                                        <li>Exhala lentamente por la boca en <strong>8 segundos</strong> produciendo un suave silbido.</li>
                                    </ol>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l2-4-relajacion-muscular",
                        "type": "html",
                        "title": "2.4 Relajación Muscular Progresiva",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Soltando la Tensión del Cuerpo</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Cuando los músculos se liberan de tensión micro-contráctil, el cerebro recibe información de seguridad y disminuye la vigilancia cortical.
                                </p>
                                <p class="text-slate-600 text-sm">
                                    Recorre mentalmente cada grupo muscular (cuero cabelludo, frente, mandíbula, cuello, hombros, brazos, abdomen, piernas y pies), imaginando cómo cada músculo se suaviza y afloja como una prenda tibia al sol.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "l2-5-relajacion-mental",
                        "type": "html",
                        "title": "2.5 Relajación Mental y Aquietamiento del Diálogo",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Dejar Pasar los Pensamientos</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    No luches contra los pensamientos que aparezcan. Imagina que son nubes cruzando un cielo azul claro: los observas llegar, los reconoces sin juzgarlos y los dejas marchar con la brisa de tu respiración.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "l2-6-focalizacion",
                        "type": "html",
                        "title": "2.6 Atención y Concentración",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">El Ancla de Enfoque</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Para evitar que la mente vague en automático, utiliza un **ancla sensorial**: el roce de la respiración en las fosas nasales, el peso del cuerpo sobre la silla o el sonido rítmico de un tono pacífico.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "l2-7-evitar-distracciones",
                        "type": "html",
                        "title": "2.7 Cómo Evitar y Utilizar las Distracciones",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Integración de Sonidos Externos</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    En lugar de molestarte por un ruido imprevisto fuera de tu habitación, intégralo en la sugestión: *"Cualquier sonido del exterior me ayuda a profundizar aún más en mi relajación interior"*.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "l2-ejercicio-presencia",
                        "type": "html",
                        "title": "Ejercicio Práctico: 5 Minutos de Presencia Consciente",
                        "html": """
                            <div class="space-y-6 select-text">
                                <div class="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 text-slate-900 rounded-3xl p-6 shadow-2xs">
                                    <h3 class="text-2xl font-black mb-2 text-emerald-950">🧘 Práctica Guiada: 5 Minutos de Presencia Consciente</h3>
                                    <p class="text-xs text-slate-700 leading-relaxed">
                                        Realiza este ejercicio antes de continuar con el siguiente módulo. Encuentra tu postura cómoda, cierra los ojos e inhala profundamente.
                                    </p>
                                </div>
                                <div class="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                                    <h4 class="font-bold text-slate-900 text-sm">Instrucciones del ejercicio:</h4>
                                    <ol class="list-decimal list-inside text-xs text-slate-600 space-y-2">
                                        <li>Cierra suavemente los ojos y realiza 3 respiraciones profundas (4s inhalar, 4s sostener, 6s exhalar).</li>
                                        <li>Lleva tu atención al peso de tus brazos y la soltura de tu mandíbula.</li>
                                        <li>Mantén tu atención en la respiración durante 5 minutos contados mentalmente o en silencio.</li>
                                        <li>Cuando sientas la calma, abre lentamente los ojos y marca la actividad como completada.</li>
                                    </ol>
                                </div>
                            </div>
                        """
                    }
                ]
            },
            {
                "id": "m3-entrando-en-trance",
                "title": "Módulo 3: Entrando en Trance",
                "items": [
                    {
                        "id": "l3-1-concepto-trance",
                        "type": "html",
                        "title": "3.1 Qué Significa Entrar en Trance",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">El Estado de Trance Desmitificado</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Entrar en trance no significa desmayarse ni perder la noción de dónde estás. Es un estado similar a ese instante placentero justo antes de conciliar el sueño por la noche o cuando te sumerges tan intensamente en una película que el mundo exterior se desvanece suavemente.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "l3-2-focalizacion",
                        "type": "html",
                        "title": "3.2 Focalización Intensificada",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Reduciendo el Foco de la Conciencia</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    La inducción es la técnica o puente que permite a la mente pasar del estado de vigilia activa (Ondas Beta) al estado de absorción interna (Ondas Alfa/Theta).
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "l3-3-ind-respiracion",
                        "type": "html",
                        "title": "3.3 Inducción Mediante Respiración Rítmica",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Inducción por Olas de Respiración</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Con cada exhalación, sugieres a tu mente: *"Cada vez que expulso el aire, me hundo el doble de profundo en una calma serena y placentera"*.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "l3-4-ind-relajacion",
                        "type": "html",
                        "title": "3.4 Inducción Mediante Fijación Visual y Párpados Pesados",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Fijación de la Mirada y Cierre Ocular</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Mirar fijamente un punto elevado en la pared o techo por 30 segundos fatiga suavemente los músculos oculares. Al cerrar los ojos, la sensación de alivio y pesadez desencadena el trance.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "l3-5-ind-cuenta-regresiva",
                        "type": "html",
                        "title": "3.5 Inducción Mediante Cuenta Regresiva",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">La Escalera Mental Regresiva (10 a 1)</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Visualizar descender lentamente una escalera cómoda de 10 escalones mientras cuentas regresivamente en cada exhalación profundizará la sensación de descanso y serenidad.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "l3-6-senales-relajacion",
                        "type": "html",
                        "title": "3.6 Reconocimiento de Señales de Trance",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">¿Cómo Saber que Estás en Trance?</h2>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    <div class="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                                        <strong class="text-indigo-950 block mb-1">🌡️ Cambios térmicos</strong>
                                        Sensación de calidez o agradable brisa fresca en manos y pies.
                                    </div>
                                    <div class="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                                        <strong class="text-indigo-950 block mb-1">⚖️ Alteración del peso</strong>
                                        Sensación de pesadez agradable o bien de ligereza/flotación.
                                    </div>
                                    <div class="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                                        <strong class="text-indigo-950 block mb-1">⏱️ Distorsión del tiempo</strong>
                                        15 minutos se sienten como 3 minutos de descanso.
                                    </div>
                                    <div class="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                                        <strong class="text-indigo-950 block mb-1">👁️ Movimientos oculares (REM)</strong>
                                        Pequeños aleteos o parpadeos suaves bajo los párpados cerrados.
                                    </div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l3-7-profundizacion",
                        "type": "html",
                        "title": "3.7 Técnicas de Profundización",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Duplicando el Nivel de Calma</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Para profundizar aún más, puedes utilizar la metáfora del **ascensor transparente o la playa serena**: imagínate descendiendo suavemente piso a piso a niveles más profundos de tu mente.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "l3-practica-primera-exp",
                        "type": "html",
                        "title": "Práctica Guiada: Mi Primera Experiencia de Autohipnosis",
                        "html": """
                            <div class="space-y-6 select-text">
                                <div class="bg-gradient-to-r from-purple-50 via-indigo-50 to-amber-50 text-slate-900 rounded-3xl p-8 shadow-xs border border-purple-200">
                                    <span class="text-xs font-black uppercase tracking-widest text-purple-700 bg-white px-3 py-1 rounded-full border border-purple-200 shadow-2xs">
                                        🎧 PRÁCTICA AUDIOGUIADA
                                    </span>
                                    <h3 class="text-3xl font-black mt-3 mb-2 text-slate-900">Mi Primera Experiencia de Autohipnosis</h3>
                                    <p class="text-xs md:text-sm text-slate-700 leading-relaxed">
                                        Una sesión guiada paso a paso de 10 minutos para experimentar por primera vez una inducción compasiva, profundización y retorno fresco y lleno de energía vital.
                                    </p>
                                </div>
                                <div class="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-3">
                                    <p class="text-slate-600 text-sm font-medium">
                                        Utiliza la pestaña <strong>Audios Guiados</strong> en la biblioteca del curso para reproducir esta práctica o escucha el audio integrado en tu panel de alumno.
                                    </p>
                                </div>
                            </div>
                        """
                    }
                ]
            },
            {
                "id": "m4-poder-sugestion",
                "title": "Módulo 4: El Poder de la Sugestión",
                "items": [
                    {
                        "id": "l4-1-que-es-sugestion",
                        "type": "html",
                        "title": "4.1 Qué es una Sugestión Hipnótica",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">La Semilla de Cambio en el Subconsciente</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Una sugestión es una propuesta verbal, visual o sensorial aceptada por la mente consciente e integrada por el subconsciente como una nueva realidad o programa de acción.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "l4-2-lenguaje-interno",
                        "type": "html",
                        "title": "4.2 Transformando el Diálogo Interno",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">De la Autocrítica a la Autosugestión Consciente</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Constantemente nos autosugestionamos en la vida diaria sin darnos cuenta (ej. *"Hoy me va a salir todo mal"*). La autohipnosis te enseña a tomar el control consciente de las afirmaciones que le entregas a tu mente.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "l4-3-sugestiones-positivas",
                        "type": "html",
                        "title": "4.3 Las 5 Reglas de la Formulación de Sugestiones",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Cómo Diseñar Sugestiones Irresistibles</h2>
                                <div class="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl space-y-3 text-xs text-indigo-950">
                                    <ol class="list-decimal list-inside space-y-2">
                                        <li><strong>Enunciadas en Presente:</strong> Usa *"Soy tranquilo y seguro"* en lugar de *"Seré tranquilo en el futuro"*.</li>
                                        <li><strong>Formulación Afirmativa:</strong> El subconsciente obvia el 'NO'. Di *"Conservo la calma"* en lugar de *"No voy a estar nervioso"*.</li>
                                        <li><strong>Simplicidad y Claridad:</strong> Frases breves, directas y fáciles de recordar en trance.</li>
                                        <li><strong>Conexión Emocional:</strong> Acompaña las palabras con la emoción agradable de haberlo logrado ya.</li>
                                        <li><strong>Realistas y Progresivas:</strong> *"Cada día me siento más capaz y sereno"*.</li>
                                    </ol>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l4-4-visualizacion",
                        "type": "html",
                        "title": "4.4 Visualización Multisensorial",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Ver, Sentir y Vivir en el Escenario Mental</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    No se trata solo de 'ver' imágenes en tu mente. Involucra la vista, el oído, el tacto y la sensación corporal interna (kinestesia). Cuantos más sentidos integres, mayor será el impacto neuronal.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "l4-ejercicios-creacion",
                        "type": "html",
                        "title": "Ejercicios Prácticos del Módulo 4",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Taller de Creación de Sugestiones Personalizadas</h2>
                                <div class="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 text-xs">
                                    <h4 class="font-bold text-slate-900 text-sm">Crea en tu libreta los siguientes 3 elementos:</h4>
                                    <div class="space-y-2">
                                        <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <strong>1. Mis 5 Sugestiones Personales:</strong> Escribe 5 afirmaciones breves en presente relacionadas con tu meta actual.
                                        </div>
                                        <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <strong>2. Mi Escenario de Éxito:</strong> Describe en 3 líneas qué ves, escuchas y sientes al lograr tu objetivo.
                                        </div>
                                        <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <strong>3. Frase de Identidad Positiva:</strong> Ej: *"Soy una persona serena, enfocada y dueña de mi bienestar"*.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        """
                    }
                ]
            },
            {
                "id": "m5-autosugestion-transformacion",
                "title": "Módulo 5: Autosugestión y Transformación Personal",
                "items": [
                    {
                        "id": "l5-1-autoestima",
                        "type": "html",
                        "title": "5.1 Fortalecimiento de Autoestima y Confianza",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Sanando la Relación Contigo Mismo</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Utiliza la autohipnosis para disolver condicionamientos de duda o insuficiencia aprendidos en el pasado.
                                </p>
                                <div class="bg-purple-50 border border-purple-100 p-5 rounded-2xl text-xs text-purple-950 space-y-2">
                                    <strong>Estructura de aplicación:</strong> Concepto → Explicación → Sugestión Clave → Práctica Guiada → Reflexión.
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l5-2-concentracion-enfoque",
                        "type": "html",
                        "title": "5.2 Concentración, Enfoque y Estudio",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Optimización Cognitiva y Estado de Flow</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Programa tu mente para entrar rápidamente en concentración profunda al sentarte a trabajar o estudiar, bloqueando la dispersión.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "l5-3-habitos-motivacion",
                        "type": "html",
                        "title": "5.3 Hábitos Saludables y Motivación",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Anclajes para el Cambio de Comportamiento</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Refuerza la disciplina compasiva creando anclajes cinestésicos (ej. juntar pulgar e índice) asociados a impulsos positivos de acción.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "l5-4-manejo-estres",
                        "type": "html",
                        "title": "5.4 Manejo Cotidiano del Estrés y la Ansiedad",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">El Botón de Pausa Emocional</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Desarrolla la capacidad de ejecutar una mini-autohipnosis de 2 a 5 minutos en medio de un día exigente para retornar a la calma neutra.
                                </p>
                            </div>
                        """
                    }
                ]
            },
            {
                "id": "m6-creando-tu-sesion",
                "title": "Módulo 6: Creando Tu Propia Sesión",
                "items": [
                    {
                        "id": "l6-1-estructura-sesion",
                        "type": "html",
                        "title": "6.1 La Arquitectura Completa de una Sesión",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Los 10 Pasos de una Sesión Magistral</h2>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                    <div class="p-3 border border-slate-200 rounded-xl bg-white">1. Preparación del espacio y postura</div>
                                    <div class="p-3 border border-slate-200 rounded-xl bg-white">2. Respiración diafragmática de encuadre</div>
                                    <div class="p-3 border border-slate-200 rounded-xl bg-white">3. Relajación física progresiva</div>
                                    <div class="p-3 border border-slate-200 rounded-xl bg-white">4. Inducción al trance</div>
                                    <div class="p-3 border border-slate-200 rounded-xl bg-white">5. Profundización (Escalera/Playa)</div>
                                    <div class="p-3 border border-slate-200 rounded-xl bg-white">6. Enunciado del objetivo principal</div>
                                    <div class="p-3 border border-slate-200 rounded-xl bg-white">7. Sugestiones afirmativas específicas</div>
                                    <div class="p-3 border border-slate-200 rounded-xl bg-white">8. Visualización multisensorial</div>
                                    <div class="p-3 border border-slate-200 rounded-xl bg-white">9. Reforzamiento y anclaje positivo</div>
                                    <div class="p-3 border border-slate-200 rounded-xl bg-white">10. Salida progresiva y segura (1 a 5)</div>
                                </div>
                            </div>
                        """
                    },
                    {
                        "id": "l6-2-generador-sesiones",
                        "type": "html",
                        "title": "6.2 Herramienta: Generador de Sesiones de Autohipnosis",
                        "html": """
                            <div class="space-y-6 select-text">
                                <div class="bg-gradient-to-r from-indigo-50 via-purple-50 to-amber-50 text-slate-900 rounded-3xl p-8 shadow-xs border border-indigo-200">
                                    <span class="text-xs font-black uppercase tracking-widest text-indigo-700 bg-white px-3 py-1 rounded-full border border-indigo-200 shadow-2xs">
                                        ⚡ HERRAMIENTA INTERACTIVA
                                    </span>
                                    <h3 class="text-3xl font-black mt-3 mb-2 text-slate-900">Generador de Sesiones de Autohipnosis</h3>
                                    <p class="text-xs md:text-sm text-slate-700 leading-relaxed">
                                        Diseña paso a paso un guion personalizado de autohipnosis adaptado a tu meta particular (Relajación, Autoestima, Concentración, Hábitos o Motivación).
                                    </p>
                                </div>
                                <div class="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-3">
                                    <p class="text-slate-600 text-sm font-medium">
                                        Haz clic en el botón <strong>Generar Mi Sesión</strong> en la barra superior o en el módulo interactivo para abrir el creador asistido.
                                    </p>
                                </div>
                            </div>
                        """
                    }
                ]
            },
            {
                "id": "m7-practicas-guiadas",
                "title": "Módulo 7: Prácticas Guiadas",
                "items": [
                    {
                        "id": "l7-biblioteca",
                        "type": "html",
                        "title": "7.1 Biblioteca de Prácticas de Autohipnosis",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">Biblioteca de Ejercicios y Audios Guiados</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Accede a 10 prácticas guiadas diseñadas con paisajes sonoros y guiones profesionales para tus sesiones diarias:
                                </p>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800">1. Relajación Profunda (15 min)</div>
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800">2. Autohipnosis Flash (5 min)</div>
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800">3. Reset Mental (10 min)</div>
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800">4. Trance Estándar (15 min)</div>
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800">5. Enfoque y Concentración (10 min)</div>
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800">6. Confianza y Autoestima (12 min)</div>
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800">7. Motivación de Acción (8 min)</div>
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800">8. Preparación para un Objetivo (10 min)</div>
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800">9. Liberación de Tensión Cotidiana (7 min)</div>
                                    <div class="p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800">10. Visualización Positiva (12 min)</div>
                                </div>
                            </div>
                        """
                    }
                ]
            },
            {
                "id": "m8-integracion-plan-personal",
                "title": "Módulo 8: Integración y Plan Personal",
                "items": [
                    {
                        "id": "l8-1-rutina-personal",
                        "type": "html",
                        "title": "8.1 Diseñando tu Rutina de Práctica",
                        "html": """
                            <div class="space-y-6 select-text">
                                <h2 class="text-2xl md:text-3xl font-black text-slate-900">De la Teoría al Estilo de Vida</h2>
                                <p class="text-slate-700 leading-relaxed font-medium">
                                    Para afianzar los beneficios de la autohipnosis, establece una rutina constante de 3 a 5 prácticas semanales. La constancia supera ampliamente a la intensidad esporádica.
                                </p>
                            </div>
                        """
                    },
                    {
                        "id": "l8-2-examen-final",
                        "type": "quiz",
                        "title": "Examen Final de Certificación",
                        "quiz": {
                            "questions": [
                                {
                                    "id": "qf-1",
                                    "type": "multiple",
                                    "prompt": "¿Cuál es la formulación correcta de una sugestión positiva afirmativa en autohipnosis?",
                                    "choices": [
                                        {"id": "a", "text": "A) \"No voy a sentir nervios ni ansiedad en la presentación de mañana\"", "isCorrect": False},
                                        {"id": "b", "text": "B) \"Mantengo una calma profunda, seguridad y claridad al hablar en presente\"", "isCorrect": True},
                                        {"id": "c", "text": "C) \"Ojalá en el futuro lejano deje de ser una persona insegura\"", "isCorrect": False},
                                        {"id": "d", "text": "D) \"Debo evitar cometer cualquier tipo de equivocación o error\"", "isCorrect": False}
                                    ]
                                },
                                {
                                    "id": "qf-2",
                                    "type": "multiple",
                                    "prompt": "¿Por qué se afirma en neurociencia que toda hipnosis es en última instancia autohipnosis?",
                                    "choices": [
                                        {"id": "a", "text": "A) Porque siempre se requiere de la guía constante de un hipnoterapeuta externo", "isCorrect": False},
                                        {"id": "b", "text": "B) Porque el practicante es quien decide aceptar e integrar libremente las sugestiones en su mente", "isCorrect": True},
                                        {"id": "c", "text": "C) Porque solo funciona en personas con alta sugestionabilidad genética", "isCorrect": False},
                                        {"id": "d", "text": "D) Porque únicamente se logra cuando se escuchan sonidos binaurales de fondo", "isCorrect": False}
                                    ]
                                },
                                {
                                    "id": "qf-3",
                                    "type": "multiple",
                                    "prompt": "¿Qué procedimiento es fundamental realizar al finalizar una sesión de autohipnosis?",
                                    "choices": [
                                        {"id": "a", "text": "A) Abrir abruptamente los ojos sin orientarse ni tomar aire", "isCorrect": False},
                                        {"id": "b", "text": "B) Realizar una salida progresiva contando de 1 a 5 reconectando gradualmente", "isCorrect": True},
                                        {"id": "c", "text": "C) Levantarse corriendo de inmediato a realizar actividad física intensa", "isCorrect": False},
                                        {"id": "d", "text": "D) Quedarse inmóvil sin respirar durante diez minutos adicionales", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        "id": "l8-3-certificado",
                        "type": "html",
                        "title": "Certificado de Finalización — Conexión Luz",
                        "html": """
                            <div class="space-y-6 select-text text-center">
                                <div class="bg-gradient-to-r from-amber-50 via-indigo-50 to-slate-50 text-slate-900 rounded-3xl p-8 shadow-xs border border-amber-200 space-y-4">
                                    <span class="text-xs font-black uppercase tracking-widest text-amber-800 bg-white px-4 py-1.5 rounded-full border border-amber-200 shadow-2xs">
                                        🏆 GRADUACIÓN & CERTIFICACIÓN
                                    </span>
                                    <h3 class="text-3xl font-black text-slate-900">¡Felicitaciones! Has completado el Curso de Autohipnosis</h3>
                                    <p class="text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
                                        Has recorrido satisfactoriamente los 8 módulos de formación. Ahora posees las herramientas y el conocimiento para guiar tu propia mente consciente.
                                    </p>
                                </div>
                            </div>
                        """
                    }
                ]
            }
        ]
    }

    course, created = Course.objects.update_or_create(
        slug="autohipnosis",
        defaults={
            "title": "AUTOHIPNOSIS: Aprende a transformar tu diálogo interno y dirigir tu mente",
            "description": "Un viaje hacia el conocimiento consciente de tu propia mente. Aprende a entrar en relajación profunda y utilizar la autohipnosis para cultivar hábitos, autoestima, concentración y bienestar emocional.",
            "description_html": "<p>Un viaje hacia el conocimiento consciente de tu propia mente. Aprende a entrar en relajación profunda y utilizar la autohipnosis para cultivar hábitos, autoestima, concentración y bienestar emocional.</p>",
            "cover_file": None,
            "price_cop": 0,
            "category": "Autohipnosis & Neurociencia",
            "tags": ["Autohipnosis", "Neurociencia", "Sugestión", "Relajación", "Trance", "Hábitos", "Autoestima", "Conexión Luz"],
            "status": "published",
            "is_active": True,
            "draft_content": content,
            "published_content": content
        }
    )
    # Also update coverUrl in published_content if needed or via media
    print(f"Course created/updated successfully: {course.title} (slug: {course.slug})")

if __name__ == '__main__':
    create_autohipnosis_course()
