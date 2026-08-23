import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from api.models import Story

def seed_stories():
    stories_data = [
        {
            "id": 1,
            "title": "El Despertar tras la Tormenta: El Sendero hacia la Paz Interior",
            "author": "Dra. Elena Ramos",
            "category": "Ansiedad & Resiliencia",
            "tags": ["Gratis", "Ansiedad", "Resiliencia", "Paz Interior", "Conexión Luz"],
            "image_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
            "content": """
<div class="space-y-10 text-slate-800 leading-relaxed font-sans">

    <!-- Header Banner -->
    <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 text-white p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/30">
            ✨ Muestra Gratuita • Lectura Transformacional Extensa
        </div>
        <h2 class="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            El Despertar tras la Tormenta: Cómo Reconstruir tu Paz Interior cuando Todo Parezca Caerse
        </h2>
        <p class="text-emerald-100 text-base md:text-xl max-w-3xl font-light">
            Una travesía real, neurobiológica y compasiva para desarmar los ataques de pánico, comprender la alquimia del sistema nervioso y habitar la calma plena en el presente.
        </p>
    </div>

    <!-- Main Section Banner Image -->
    <div class="rounded-3xl overflow-hidden shadow-lg border border-slate-200">
        <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80" alt="Mar tranquilo al amanecer" class="w-full h-72 md:h-96 object-cover" />
        <div class="bg-slate-900 text-slate-300 p-4 text-xs font-medium italic text-center">
            "La serenidad no consiste en huir de la marea, sino en recordar que eres la inmensidad del océano."
        </div>
    </div>

    <!-- Intro Quote -->
    <div class="bg-emerald-50/90 border-l-4 border-emerald-500 p-6 md:p-8 rounded-r-3xl shadow-sm space-y-3">
        <p class="text-lg md:text-xl italic font-serif text-emerald-950 leading-relaxed">
            "La ansiedad no es un defecto de tu carácter ni una falla espiritual. Es el grito desesperado de un sistema nervioso agotado que ruega que regreses al instante presente."
        </p>
        <span class="block text-xs font-bold uppercase tracking-widest text-emerald-800">— Dra. Elena Ramos</span>
    </div>

    <!-- Chapter 1 -->
    <div class="space-y-4">
        <h3 class="text-2xl md:text-3xl font-black text-slate-900 border-b border-emerald-100 pb-3 flex items-center gap-3">
            <span class="flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 text-base font-black shrink-0">1</span>
            El Día en que el Mundo se Detuvo
        </h3>
        <p class="text-slate-700 text-base md:text-lg leading-relaxed">
            Eran las tres de la mañana de un martes cualquiera cuando desperté con la sensación ineludible de que mi cuerpo sucumbía. El corazón martillaba contra mi tórax con una violencia abrumadora, el oxígeno parecía haberse evaporado de la habitación y una ola de calor helado descendió en picada por mi columna vertebral. En esos segundos, la mente no razona: la mente concluye, de manera categórica, que la vida ha llegado a su fin.
        </p>
        <p class="text-slate-700 text-base md:text-lg leading-relaxed">
            Durante más de seis meses intenté camuflar aquellos episodios bajo la etiqueta inofensiva de "estrés acumulado por el trabajo". Continué cumpliendo jornadas de catorce horas, sonriendo en videoconferencias y repitiendo de memoria que todo marchaba excelente. Sin embargo, la biología posee una contabilidad inexorable. Cuando ignoramos los avisos sutiles —la tensión en la mandíbula al despertar, la respiración superficial y la digestión continuamente alterada—, el organismo se ve obligado a provocar un cortocircuito.
        </p>
        <p class="text-slate-700 text-base md:text-lg leading-relaxed">
            Aquel ataque de pánico no fue un accidente fortuito; fue el colapso de un estilo de vida basado en la hipervigilancia permanente. Me di cuenta de que llevaba años viviendo en estado de guerra interior, exigiendo a mi cuerpo rendimientos sobrehumanos mientras ignoraba su necesidad básica de descanso y seguridad.
        </p>
    </div>

    <!-- Interactive Highlight Box -->
    <div class="bg-white rounded-3xl p-6 md:p-8 border border-emerald-200 shadow-md space-y-4">
        <h4 class="text-xl font-bold text-emerald-900 flex items-center gap-2">
            🌱 Las 3 Trampas Fundamentales de la Ansiedad Crónica
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div class="text-emerald-700 font-black text-xs uppercase tracking-wider">Trampa 1</div>
                <div class="font-bold text-slate-800 text-base">La Ilusión de Control</div>
                <p class="text-xs text-slate-600 leading-relaxed">Creer que anticipar cada catástrofe futura te protegerá del sufrimiento. Solo agota tus reservas inmunológicas.</p>
            </div>
            <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div class="text-emerald-700 font-black text-xs uppercase tracking-wider">Trampa 2</div>
                <div class="font-bold text-slate-800 text-base">Fusión Pensamiento-Realidad</div>
                <p class="text-xs text-slate-600 leading-relaxed">Confundir una suposición alarmista generada por la amígdala cerebral con un peligro inminente y palpable.</p>
            </div>
            <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div class="text-emerald-700 font-black text-xs uppercase tracking-wider">Trampa 3</div>
                <div class="font-bold text-slate-800 text-base">Resistencia al Síntoma</div>
                <p class="text-xs text-slate-600 leading-relaxed">Luchar desesperadamente contra la taquicardia o el mareo, lo cual dispara una segunda descarga de adrenalina.</p>
            </div>
        </div>
    </div>

    <!-- Chapter 2 -->
    <div class="space-y-4">
        <h3 class="text-2xl md:text-3xl font-black text-slate-900 border-b border-emerald-100 pb-3 flex items-center gap-3">
            <span class="flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 text-base font-black shrink-0">2</span>
            La Neurociencia de la Desmovilización Emocional
        </h3>
        <p class="text-slate-700 text-base md:text-lg leading-relaxed">
            El verdadero punto de inflexión ocurrió cuando decidí estudiar la fisiología del miedo en lugar de temerle. Comprendí que el nervio vago actúa como el freno biológico de nuestro cuerpo. Cuando percibimos amenaza, el sistema nervioso simpático activa la respuesta de "lucha o huida", liberando catecolaminas que aumentan la frecuencia cardíaca y redirigen la sangre hacia las extremidades.
        </p>
        <p class="text-slate-700 text-base md:text-lg leading-relaxed">
            Cuando la mente interpreta que la taquicardia es peligrosa, se genera un bucle cerrado de retroalimentación: el cerebro envía más adrenalina porque cree que el peligro aumenta. Para romper este círculo vicioso, debemos enviar señales somáticas inversas. No podemos razonar con la amígdala usando la lógica hablada; debemos hablarle a través del cuerpo, mediante la respiración extendida y el ablandamiento muscular.
        </p>
    </div>

    <!-- Mid Story Image -->
    <div class="rounded-3xl overflow-hidden border border-emerald-100 shadow-md">
        <img src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1000&q=80" alt="Luz entre los árboles del bosque" class="w-full h-64 md:h-80 object-cover" />
    </div>

    <!-- Chapter 3 -->
    <div class="space-y-4">
        <h3 class="text-2xl md:text-3xl font-black text-slate-900 border-b border-emerald-100 pb-3 flex items-center gap-3">
            <span class="flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 text-base font-black shrink-0">3</span>
            El Protocolo Práctico de la Aceptación Radical
        </h3>
        <p class="text-slate-700 text-base md:text-lg leading-relaxed">
            Desarrollé una práctica diaria basada en tres pilares que transformó mi experiencia. En lugar de huir cuando la opresión torácica aparecía, me sentaba en el suelo, apoyaba la espalda contra la pared, colocaba una mano en el corazón y otra en el diafragma y repetía internamente: <em>"Acepto esta sensación. Es solo energía atravesando mis nervios. Estoy a salvo en este instante"</em>.
        </p>
        <p class="text-slate-700 text-base md:text-lg leading-relaxed">
            Al no ofrecer resistencia, la ola biológica alcanzaba su cresta y descendía naturalmente en menos de dos minutos. Descubrí que la ansiedad alimenta su poder únicamente del pánico que sentimos ante ella. Sin miedo al miedo, la ansiedad pierde su veneno.
        </p>
    </div>

    <!-- Summary Protocol Box -->
    <div class="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-8 md:p-10 space-y-6 shadow-2xl border border-emerald-500/30">
        <h4 class="text-2xl font-black text-emerald-400 tracking-tight flex items-center gap-2">
            ✨ Tu Kit de Emergencia Somática
        </h4>
        <div class="space-y-4 text-sm md:text-base text-slate-200">
            <div class="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <span class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center shrink-0">1</span>
                <div><strong class="text-white block text-base mb-1">Exhalación Prolongada (4-8):</strong> Inhala por la nariz durante 4 segundos y exhala muy despacio por la boca durante 8 segundos. La exhalación larga estimula directamente el nervio vago vagal posterior.</div>
            </div>
            <div class="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <span class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center shrink-0">2</span>
                <div><strong class="text-white block text-base mb-1">Técnica de Orientación Espacial:</strong> Mira a tu alrededor y nombra 5 colores presentes en la habitación, 4 texturas táctiles, 3 sonidos distantes y 2 olores. Desengancha el foco atencional del diálogo interno.</div>
            </div>
            <div class="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <span class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center shrink-0">3</span>
                <div><strong class="text-white block text-base mb-1">Contacto Térmico Frío:</strong> Aplica agua fría o hielo sobre las muñecas y los pómulos. Activa el reflejo de inmersión mamífero, ralentizando automáticamente el ritmo cardiaco.</div>
            </div>
        </div>
    </div>

    <!-- Conclusion -->
    <div class="space-y-4 pt-4 border-t border-slate-200">
        <h3 class="text-2xl font-black text-slate-900">Una Nueva Arquitectura de Vida</h3>
        <p class="text-slate-700 text-base md:text-lg leading-relaxed">
            Hoy miro aquella época no como una desgracia, sino como el umbral de mi verdadera madurez. La ansiedad fue el maestro implacable que me obligó a poner límites firmes, a nutrirme con alimentos vivos, a priorizar el sueño reparador y a valorar cada respiración tranquila. La paz duradera no es la ausencia de tormentas externas, sino el saber que dentro de ti habita una calma que nada ni nadie puede arrebatarte.
        </p>
    </div>

</div>
"""
        },
        {
            "id": 2,
            "title": "La Metamorfosis del Silencio: Sanando las Heridas de la Infancia",
            "author": "Carlos Mendoza",
            "category": "Sanación Emocional & Niño Interior",
            "tags": ["Lumis: 10", "Niño Interior", "Sanación", "Autocompasión", "Trauma"],
            "image_url": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80",
            "content": """
<div class="space-y-10 text-indigo-950 font-sans leading-relaxed">

    <!-- Header Banner -->
    <div class="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white p-8 md:p-12 rounded-3xl shadow-2xl border border-indigo-500/30 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <span class="inline-block bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            ✨ Relato de Sanación Completo • ✨ 10 Lumis
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            La Metamorfosis del Silencio: Reconciliándote con tu Niño Interior
        </h2>
        <p class="text-indigo-200 text-base md:text-xl font-light max-w-3xl">
            Un análisis íntimo sobre cómo las palabras reprimidas en los primeros años esculpen los bloqueos del adulto, y la metodología poética para liberar tu voz genuina.
        </p>
    </div>

    <!-- Main Header Image -->
    <div class="rounded-3xl overflow-hidden shadow-xl border border-indigo-200">
        <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80" alt="Bosque místico iluminado por la luz del sol" class="w-full h-72 md:h-96 object-cover" />
    </div>

    <!-- Illuminated Quote -->
    <div class="bg-indigo-950 text-indigo-100 p-8 md:p-10 rounded-3xl border border-amber-400/40 shadow-xl space-y-3 relative">
        <p class="text-xl md:text-2xl font-serif italic text-amber-100 leading-snug">
            "El niño que fuiste sigue aguardando en algún rincón de tu mente a que el adulto en el que te convertiste lo tome de la mano y le diga: 'Ya no tienes que dar miedo ni complacer a nadie; yo soy tu refugio'."
        </p>
        <div class="text-right text-xs font-bold uppercase tracking-widest text-amber-300">— Carlos Mendoza</div>
    </div>

    <!-- Chapter 1 -->
    <div class="space-y-4">
        <h3 class="text-2xl md:text-3xl font-black text-indigo-950 border-b border-indigo-200 pb-3">
            1. El Escudo del 'Buen Niño' y la Complacencia Neurótica
        </h3>
        <p class="text-indigo-900/90 text-base md:text-lg leading-relaxed">
            Crecí bajo el mandato implícito de que para ser aceptado debía volverme invisible. En la estructura de mi hogar, las demostraciones de vulnerabilidad, el enojo o las contradicciones eran recibidas con el castigo de la indiferencia prolongada o la desaprobación severa. Rápidamente aprendí a perfeccionar la coraza del "niño modelo": aquel que jamás protesta, obtiene notas sobresalientes, limpia su espacio y adivina con precisión microscópica los estados de ánimo de los adultos para evitar perturbaciones.
        </p>
        <p class="text-indigo-900/90 text-base md:text-lg leading-relaxed">
            Lo que en la infancia operó como una estrategia adaptativa de supervivencia emocional se convirtió en una condena durante mi vida adulta. Me transformé en una persona incapaz de establecer límites sanos, que toleraba faltas de respeto continuas en sus vínculos afectivos y aceptaba cargas laborales desproporcionadas por el terror insoportable a decepcionar o provocar discordia. Mi complacencia constante no era bondad; era el pánico infantil al abandono desatado.
        </p>
    </div>

    <!-- Dialogue Box -->
    <div class="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 md:p-8 rounded-3xl border border-indigo-200 shadow-sm space-y-4">
        <h4 class="text-lg font-black text-indigo-950 flex items-center gap-2">
            💬 Diálogo Terapéutico con la Herida Temprana
        </h4>
        <div class="space-y-3 text-sm md:text-base">
            <div class="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
                <span class="font-bold text-purple-800">El Adulto Consciente:</span> "¿Por qué sientes tanto terror en el pecho cuando alguien muestra incomodidad con tus decisiones?"
            </div>
            <div class="bg-indigo-900 text-white p-4 rounded-2xl shadow-sm">
                <span class="font-bold text-amber-300">El Niño Herido:</span> "Porque cuando era pequeño, la molestia de los mayores significaba que se alejarían y me dejarían solo en la oscuridad. Creía que si era perfecto, nadie se iría jamás."
            </div>
            <div class="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
                <span class="font-bold text-purple-800">El Adulto Consciente:</span> "Comprendo tu temor. Pero hoy yo soy un adulto independiente y capaz. Yo no me iré de tu lado, pase lo que pase."
            </div>
        </div>
    </div>

    <!-- Chapter 2 -->
    <div class="space-y-4">
        <h3 class="text-2xl md:text-3xl font-black text-indigo-950 border-b border-indigo-200 pb-3">
            2. El Despertar de la Rabia Sagrada
        </h3>
        <p class="text-indigo-900/90 text-base md:text-lg leading-relaxed">
            El verdadero quiebre terapéutico se produjo el día en que me atreví a experimentar rabia sin culpa por primera vez. Durante años la sociedad y mi crianza me habían enseñado que la ira era una fuerza negativa y pecaminosa. Descubrí que la rabia saludable es el fuego instintivo que delimita nuestra soberanía personal y defiende nuestra dignidad mancillada.
        </p>
        <p class="text-indigo-900/90 text-base md:text-lg leading-relaxed">
            Lloré amargamente las lágrimas que el niño de ocho años tuvo que reprimirse para sobrevivir. Escribí cartas desahogando cada injusticia sufrida, permitiendo que el cuerpo descargara las memorias emocionales retenidas en la musculatura. El proceso de sanar no es volverse químicamente "positivo", sino permitirse la totalidad de la experiencia humana.
        </p>
    </div>

    <!-- Secondary Image -->
    <div class="rounded-3xl overflow-hidden border border-indigo-100 shadow-md">
        <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80" alt="Sendero entre la naturaleza verde" class="w-full h-64 md:h-80 object-cover" />
    </div>

    <!-- Guided Exercise Box -->
    <div class="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 p-8 rounded-3xl border border-amber-300/50 space-y-4">
        <h4 class="text-xl font-bold text-indigo-950">✨ Práctica Guiada de Reparentalización Consciente</h4>
        <ol class="list-decimal list-inside space-y-3 text-slate-800 text-sm md:text-base font-medium">
            <li><strong>Contacto Visual de Espejo:</strong> Dedica dos minutos al despertar para mirar tus ojos al espejo y expresarte palabras de validación incondicional.</li>
            <li><strong>Anclaje Fotográfico:</strong> Mantén una fotografía de tu infancia en tu escritorio. Cuando experimentes momentos de presión profesional, mírala y dile: "Yo me encargo de esto".</li>
            <li><strong>Límite Asertivo Diario:</strong> Practica decir "no" a una solicitud innecesaria sin redactar justificaciones ni disculpas excesivas.</li>
            <li><strong>Espacio de Juego Libre:</strong> Dedica al menos una hora a la semana a una actividad puramente lúdica sin meta ni rendimiento.</li>
        </ol>
    </div>

</div>
"""
        },
        {
            "id": 3,
            "title": "Soltar las Cadenas Invisibles: El Arte de Liberar el Control",
            "author": "Sofía Valenzuela",
            "category": "Apegos & Libertad Emocional",
            "tags": ["Gratis", "Soltar", "Desapego", "Libertad", "Paz Mental"],
            "image_url": "https://images.unsplash.com/photo-1499209974431-9dac3ada00d7?auto=format&fit=crop&w=1200&q=80",
            "content": """
<div class="space-y-10 text-amber-950 font-sans leading-relaxed">

    <!-- Header Banner -->
    <div class="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-800 text-white p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden">
        <span class="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3 border border-white/30">
            ✨ Muestra Gratuita • Filosofía de Vida Extensa
        </span>
        <h2 class="text-3xl md:text-5xl font-black leading-tight mb-3">
            Soltar las Cadenas Invisibles: Dejar Ir para Volver a Habitar la Libertad
        </h2>
        <p class="text-amber-100 text-base md:text-xl max-w-3xl font-light">
            Cómo la fijación por planificar cada resultado destruye la frescura de la existencia y las pautas para cultivar una confianza radical en el flujo de la vida.
        </p>
    </div>

    <div class="rounded-3xl overflow-hidden shadow-lg border border-amber-200">
        <img src="https://images.unsplash.com/photo-1499209974431-9dac3ada00d7?auto=format&fit=crop&w=1200&q=80" alt="Persona contemplando el amanecer en la montaña" class="w-full h-72 md:h-96 object-cover" />
    </div>

    <!-- Zen Quote -->
    <div class="bg-amber-100/70 border-l-4 border-amber-600 p-6 md:p-8 rounded-r-3xl shadow-sm">
        <p class="text-lg md:text-xl italic font-serif text-amber-950 leading-relaxed">
            "Sostener un vaso de agua por un minuto no genera esfuerzo. Sostenerlo durante tres días consecutivos inmoviliza el brazo. No es la pesadez de las situaciones lo que nos destruye, sino nuestra obstinación en no soltarlas."
        </p>
        <span class="block text-xs font-bold uppercase tracking-widest text-amber-800 mt-2">— Sofía Valenzuela</span>
    </div>

    <!-- Chapter 1 -->
    <div class="space-y-4">
        <h3 class="text-2xl md:text-3xl font-bold text-amber-950 border-b border-amber-200 pb-2">
            La Ilusión de la Garantía Absoluta
        </h3>
        <p class="text-amber-900/90 text-base md:text-lg leading-relaxed">
            Durante más de tres décadas fui una practicante fervorosa del microcontrol. Mis agendas personales y profesionales se encontraban codificadas con precisión quirúrgica; mantenía planes de contingencia para mis planes de contingencia y vivía en una guardia ininterrumpida. Si una reunión se posponía o los planes de fin de semana sufrían una modificación de último minuto, mi estructura emocional colapsaba en irritabilidad y angustia desmedida.
        </p>
        <p class="text-amber-900/90 text-base md:text-lg leading-relaxed">
            La vida, que cuenta con sus propios pedagogos, se encargó de desmantelar meticulosamente cada uno de mis esquemas. En un periodo de seis meses experimenté una reestructuración empresarial imprevista y el cierre definitivo de una relación afectiva de largo aliento. De pronto me hallé sin las certezas que me definían, enfrentando la verdad universal: nada en este mundo está bajo nuestro control absoluto.
        </p>
    </div>

    <!-- Comparison Table -->
    <div class="bg-white rounded-3xl p-6 md:p-8 border border-amber-200 shadow-md space-y-4">
        <h4 class="text-xl font-bold text-amber-900">⚖️ Control Ansioso vs. Rendición Consciente</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-5 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
                <div class="font-black text-rose-800 text-xs uppercase tracking-wider">Patrón de Control (Apego)</div>
                <ul class="text-xs md:text-sm text-rose-900 space-y-2 list-disc list-inside">
                    <li>Exige desenlaces exactos en plazos inflexibles.</li>
                    <li>Sufre frustración reactiva ante la menor alteración.</li>
                    <li>Invierte energía en cambiar las conductas ajenas.</li>
                    <li>Vive anticipando catástrofes proyectadas.</li>
                </ul>
            </div>
            <div class="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <div class="font-black text-emerald-800 text-xs uppercase tracking-wider">Patrón de Rendición (Confianza)</div>
                <ul class="text-xs md:text-sm text-emerald-900 space-y-2 list-disc list-inside">
                    <li>Establece intenciones claras y respeta el proceso.</li>
                    <li>Responde con resiliencia y gracia ante los cambios.</li>
                    <li>Acepta a los demás en su soberanía individual.</li>
                    <li>Habita el instante presente con curiosidad.</li>
                </ul>
            </div>
        </div>
    </div>

</div>
"""
        },
        {
            "id": 4,
            "title": "Viaje al Corazón de la Sombra: Reclamando tu Verdadero Poder",
            "author": "Dr. Gabriel Thorne",
            "category": "Psicología Integrativa & Sombras",
            "tags": ["Lumis: 20", "Psicología Junguiana", "Sombra", "Autoaceptación", "Integración"],
            "image_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
            "content": """
<div class="space-y-10 text-slate-100 font-sans leading-relaxed">

    <!-- Header Dark Luxe -->
    <div class="bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-8 md:p-12 rounded-3xl shadow-2xl border border-purple-500/40 relative overflow-hidden">
        <div class="absolute -top-10 -right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
        <span class="inline-block bg-purple-500/20 text-purple-300 border border-purple-400/40 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            ✨ Psicología Profunda • ✨ 20 Lumis
        </span>
        <h2 class="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight mb-4">
            Viaje al Corazón de la Sombra: Reclamando tu Totalidad
        </h2>
        <p class="text-purple-200 text-base md:text-xl font-light max-w-3xl">
            La sombra no representa maldad; es el almacén donde sepultaste tu vitalidad, tu pasión y tu poder personal por miedo a no encajar.
        </p>
    </div>

    <div class="rounded-3xl overflow-hidden shadow-2xl border border-purple-900">
        <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80" alt="Cielo nocturno estrellado y violeta sobre montañas" class="w-full h-72 md:h-96 object-cover" />
    </div>

    <!-- Dark Quote Card -->
    <div class="bg-slate-900 p-8 md:p-10 rounded-3xl border border-purple-500/30 shadow-xl space-y-3">
        <p class="text-xl md:text-2xl font-serif italic text-purple-200 leading-snug">
            "Uno no alcanza la iluminación contemplando figuras de luz, sino haciendo consciente la oscuridad reprimida. Lo que no se lleva a la conciencia se manifiesta en nuestra vida cotidiana bajo la máscara del destino."
        </p>
        <div class="text-right text-xs font-bold uppercase tracking-widest text-purple-400">— Carl Gustav Jung</div>
    </div>

    <!-- Content -->
    <div class="space-y-4">
        <h3 class="text-2xl md:text-3xl font-extrabold text-white border-b border-purple-900 pb-3">
            El Tesoro Oculto en el Sótano Inconsciente
        </h3>
        <p class="text-slate-300 text-base md:text-lg leading-relaxed">
            Desde la primera infancia somos educados para escindir nuestra psique. Las cualidades socialmente funcionales como la amabilidad, la paciencia y el altruismo son ampliamente premiadas; mientras que impulsos como la envidia, la agresividad defensiva, la ambición y la sensualidad son severamente censurados. Para garantizar la pertenencia, creamos una fachada reluciente (la Persona) y arrojamos los aspectos prohibidos al sótano inconsciente (la Sombra).
        </p>
        <p class="text-slate-300 text-base md:text-lg leading-relaxed">
            Sin embargo, la sombra no desaparece por el hecho de ignorarla. Continúa operando desde la penumbra a través de juicios desmedidos hacia los demás, lapsus linguae, autosabotajes laborales y proyecciones emocionales. Aquello que despierta en ti un rechazo visceral e irracional en otra persona es, casi invariablemente, un espejo de una facultad propia que te has negado a integrar.
        </p>
    </div>

    <!-- Integration Guide -->
    <div class="bg-gradient-to-r from-purple-900/50 to-slate-900 p-8 rounded-3xl border border-purple-500/30 space-y-4">
        <h4 class="text-xl font-black text-purple-300">🔮 Guía Práctica de Integración Junguiana</h4>
        <div class="space-y-3 text-sm md:text-base text-slate-200">
            <div class="p-4 bg-slate-950/80 rounded-2xl border border-purple-900">
                <strong class="text-purple-400">1. Desmantela tus Juicios:</strong> Anota los defectos de las personas que más te irritan. Pregúntate: "¿En qué sentido estoy reprimiendo esa misma fuerza dentro de mí?"
            </div>
            <div class="p-4 bg-slate-950/80 rounded-2xl border border-purple-900">
                <strong class="text-purple-400">2. Reivindica tu Envidia:</strong> La envidia es una señal dorada. Si envidias el carisma o el éxito de alguien, no deseas su mal; tu psique señala un potencial tuyo sin desarrollar.
            </div>
            <div class="p-4 bg-slate-950/80 rounded-2xl border border-purple-900">
                <strong class="text-purple-400">3. Honra tu Fuego Interior:</strong> La misma agresividad que juzgas es la fuerza que necesitas para decir 'hasta aquí' y construir proyectos ambiciosos.
            </div>
        </div>
    </div>

</div>
"""
        },
        {
            "id": 5,
            "title": "El Faro en el Océano de la Duda: Venciendo al Impostor Interior",
            "author": "Mariana Rios, M.Sc.",
            "category": "Autoestima & Propósito",
            "tags": ["Lumis: 30", "Síndrome del Impostor", "Autoestima", "Liderazgo", "Confianza"],
            "image_url": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
            "content": """
<div class="space-y-10 text-slate-800 font-sans leading-relaxed">

    <!-- Header Banner -->
    <div class="bg-gradient-to-br from-blue-900 via-slate-900 to-cyan-950 text-white p-8 md:p-12 rounded-3xl shadow-2xl border border-cyan-500/30 relative overflow-hidden">
        <span class="inline-block bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            ✨ Desarrollo Profesional Extenso • ✨ 30 Lumis
        </span>
        <h2 class="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight mb-4">
            El Faro en el Océano de la Duda: Desmantelando al Impostor
        </h2>
        <p class="text-cyan-100 text-base md:text-xl font-light max-w-3xl">
            Cómo las personas más brillantes sufren la angustia secreta de ser "descubiertas", y la metodología práctica para afianzar un merecimiento incondicional.
        </p>
    </div>

    <div class="rounded-3xl overflow-hidden shadow-xl border border-blue-200">
        <img src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80" alt="Faro iluminando el océano al anochecer" class="w-full h-72 md:h-96 object-cover" />
    </div>

    <!-- Quote Box -->
    <div class="bg-blue-50 border-l-4 border-blue-600 p-6 md:p-8 rounded-r-3xl shadow-sm">
        <p class="text-lg md:text-xl italic font-serif text-blue-950">
            "El síndrome del impostor es una paradoja irónica: entre mayor es tu competencia y conocimiento, más consciente eres de la inmensidad de lo que ignoras, permitiendo que la inseguridad se disfrace de falsa modestia."
        </p>
        <span class="block text-xs font-bold uppercase tracking-widest text-blue-700 mt-2">— Mariana Rios, M.Sc.</span>
    </div>

    <div class="space-y-4">
        <h3 class="text-2xl font-bold text-blue-950 border-b border-blue-200 pb-2">
            La Trampa del Perfeccionismo Paralizante
        </h3>
        <p class="text-slate-700 text-base md:text-lg leading-relaxed">
            A pesar de contar con posgrados, distinciones y años de trayectoria comprobada, cada vez que asumía un nuevo liderazgo sentía un vacío paralizante en el estómago. Una voz implacable en mi mente me susurraba: <em>"Ha sido cuestión de suerte. En esta ocasión notarán que no estás realmente a la altura"</em>. Trabajar en estado de compensación permanente me llevó al borde del agotamiento extremo (burnout).
        </p>
    </div>

</div>
"""
        },
        {
            "id": 6,
            "title": "Renacer de las Cenizas del Duelo: Transmutando la Pérdida en Amor",
            "author": "Andrés Cárdenas",
            "category": "Duelo & Sentido de Vida",
            "tags": ["Gratis", "Duelo", "Resignificación", "Amor Eterno", "Esperanza"],
            "image_url": "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80",
            "content": """
<div class="space-y-10 text-stone-800 font-serif leading-relaxed">

    <!-- Header Terracotta -->
    <div class="bg-gradient-to-r from-orange-800 via-amber-900 to-stone-900 text-white p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden">
        <span class="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3 border border-white/30">
            ✨ Muestra Gratuita • Crónica Humana Extensa
        </span>
        <h2 class="text-3xl md:text-5xl font-black leading-tight mb-3">
            Renacer de las Cenizas del Duelo: Honor, Memoria y Trascendencia
        </h2>
        <p class="text-orange-100 text-base md:text-lg max-w-2xl font-light">
            Cómo cruzar el territorio desolado de la pérdida sin sucumbir al cinismo ni a la desesperanza: el arte de convertir la ausencia física en presencia espiritual.
        </p>
    </div>

    <div class="rounded-3xl overflow-hidden shadow-xl border border-stone-300">
        <img src="https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80" alt="Atardecer sereno sobre un lago dorado" class="w-full h-72 md:h-96 object-cover" />
    </div>

    <div class="bg-stone-100 p-8 rounded-3xl border border-stone-300 shadow-sm space-y-4">
        <p class="text-xl italic text-stone-900 leading-relaxed">
            "El duelo no se 'supera' como quien concluye una carrera. El duelo se integra. Es la cicatriz luminosa que testimonia la inmensidad del amor compartido."
        </p>
        <span class="block text-xs font-bold uppercase tracking-widest text-stone-600">— Andrés Cárdenas</span>
    </div>

    <div class="space-y-4 text-sans text-stone-700 leading-relaxed">
        <p class="text-base md:text-lg">
            Cuando la persona que constituía el centro de mi mundo partió, la realidad perdió de inmediato sus colores. Durante meses, el simple hecho de despertar constituía un trámite doloroso e insoportable. Intenté buscar consuelo en tratados filosóficos, pero ninguna teoría abstracta devuelve el calor de un abrazo o llena el silencio atronador de una casa vacía.
        </p>
        <p class="text-base md:text-lg">
            La sanación verdadera no comenzó cuando intenté olvidar o distraerme, sino cuando me di permiso para sentir el desgarro completo. Comprendí que el dolor del duelo es la forma que adopta el amor cuando no dispone de un cuerpo físico donde entregarse. Aprendí a canalizar ese afecto hacia acciones con sentido, manteniendo vivo el legado espiritual de quien partió.
        </p>
    </div>

</div>
"""
        },
        {
            "id": 7,
            "title": "La Alquimia del Perdón: Rompiendo los Lazos de la Amargura",
            "author": "Dra. Camila Fuentes",
            "category": "Perdón & Liberación",
            "tags": ["Lumis: 45", "Perdón", "Liberación", "Paz Espiritual", "Alquimia Emocional"],
            "image_url": "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80",
            "content": """
<div class="space-y-10 text-amber-950 font-sans leading-relaxed">

    <!-- Header Gold Alchemical -->
    <div class="bg-gradient-to-br from-amber-700 via-amber-800 to-yellow-950 text-white p-8 md:p-12 rounded-3xl shadow-2xl border border-amber-300/40 relative overflow-hidden">
        <span class="inline-block bg-amber-400/20 text-amber-200 border border-amber-300/40 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            ✨ Alquimia Interior • ✨ 45 Lumis
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            La Alquimia del Perdón: Rompiendo las Cadenas del Rencor
        </h2>
        <p class="text-amber-100 text-base md:text-xl font-light max-w-3xl">
            Perdonar no equivale a exonerar a quien causó el daño; es arrebatarle el poder de continuar envenenando tu presente desde las sombras del pasado.
        </p>
    </div>

    <div class="rounded-3xl overflow-hidden shadow-xl border border-amber-200">
        <img src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80" alt="Rayos de luz solar atravesando árboles dorados" class="w-full h-72 md:h-96 object-cover" />
    </div>

    <div class="bg-amber-50 p-8 rounded-3xl border border-amber-200 shadow-md space-y-4">
        <h4 class="text-xl font-bold text-amber-900">📜 El Proceso de la Carta de Liberación</h4>
        <ul class="list-disc list-inside space-y-3 text-sm md:text-base text-slate-800">
            <li><strong>Desahogo Total:</strong> Vuelca en papel cada detalle del agravio sin guardarte ninguna emoción.</li>
            <li><strong>Identificación de Fronteras:</strong> Reconoce los límites que aprendiste a establecer gracias a la experiencia.</li>
            <li><strong>Cierre Solemne:</strong> Escribe: "Te libero de mis expectativas y me libero de tu sombra. Elijo vivir en paz." Quema el papel simbólicamente.</li>
        </ul>
    </div>

</div>
"""
        },
        {
            "id": 8,
            "title": "El Susurro de la Intuición: Escuchando la Sabiduría del Cuerpo",
            "author": "Lucía Morales",
            "category": "Somática & Conexión Espiritual",
            "tags": ["Lumis: 60", "Intuición", "Sabiduría Somática", "Mindfulness", "Espiritualidad"],
            "image_url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
            "content": """
<div class="space-y-10 text-emerald-950 font-sans leading-relaxed">

    <!-- Header Sage Organic -->
    <div class="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white p-8 md:p-12 rounded-3xl shadow-2xl border border-emerald-400/40 relative overflow-hidden">
        <span class="inline-block bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            ✨ Sabiduría Somática • ✨ 60 Lumis
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            El Susurro de la Intuición: El Lenguaje Somático de la Verdad
        </h2>
        <p class="text-emerald-100 text-base md:text-xl font-light max-w-3xl">
            Aprende a descifrar las respuestas viscerales de tu biología ante decisiones cruciales antes de que el ruido mental las distorsione.
        </p>
    </div>

    <div class="rounded-3xl overflow-hidden shadow-xl border border-emerald-200">
        <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80" alt="Meditación serena en medio de la naturaleza" class="w-full h-72 md:h-96 object-cover" />
    </div>

    <div class="bg-emerald-50 p-8 rounded-3xl border border-emerald-200 space-y-4">
        <h4 class="text-xl font-bold text-emerald-900">🌿 Ejercicio de Escaneo Intuitivo Somático</h4>
        <p class="text-sm md:text-base text-slate-800 leading-relaxed">
            Frente a una disyuntiva importante, visualiza asumir la alternativa A y registra la respuesta de tu cuerpo durante 30 segundos. ¿Experimentas una opresión en la garganta o una expansión en el área pectoral? Tu cuerpo registra la verdad antes que el pensamiento analítico.
        </p>
    </div>

</div>
"""
        },
        {
            "id": 9,
            "title": "Del Caos a la Coherencia: La Neurociencia del Bienestar Integral",
            "author": "Dr. Mateo Benítez",
            "category": "Neurociencia & Autorregulación",
            "tags": ["Lumis: 80", "Neurociencia", "Coherencia Cardíaca", "Estrés", "Biohacking"],
            "image_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
            "content": """
<div class="space-y-10 text-cyan-950 font-sans leading-relaxed">

    <!-- Header Tech Biohack -->
    <div class="bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 text-white p-8 md:p-12 rounded-3xl shadow-2xl border border-cyan-400/40 relative overflow-hidden">
        <span class="inline-block bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            ✨ Neurociencia Aplicada • ✨ 80 Lumis
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            Del Caos a la Coherencia: La Ciencia del Equilibrio Nervioso
        </h2>
        <p class="text-cyan-100 text-base md:text-xl font-light max-w-3xl">
            La neurobiología de la variabilidad de la frecuencia cardíaca (HRV) y las técnicas de sincronización cerebro-corazón para maximizar tu claridad mental.
        </p>
    </div>

    <div class="rounded-3xl overflow-hidden shadow-xl border border-cyan-900">
        <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80" alt="Conexión cósmica y redes de luz" class="w-full h-72 md:h-96 object-cover" />
    </div>

    <div class="bg-white rounded-3xl p-8 border border-cyan-200 shadow-md space-y-4">
        <h4 class="text-xl font-bold text-cyan-900">⚡ Protocolo de Coherencia Cardíaca a 0.1 Hz</h4>
        <p class="text-sm md:text-base text-slate-700 leading-relaxed">
            Inhala suavemente durante 5 segundos y exhala en 5 segundos durante un mínimo de 5 minutos continuos. Esta cadencia respiratoria sincroniza los ritmos autonómicos e induce un estado de alta eficiencia psicofisiológica.
        </p>
    </div>

</div>
"""
        },
        {
            "id": 10,
            "title": "La Catedral de la Calma: El Retiro Inviolable de la Mente",
            "author": "Maestro Samuel Roldán & Conexión Luz",
            "category": "Meditación Profunda & Trascendencia",
            "tags": ["Lumis: 100", "Meditación", "Maestría Mental", "Conciencia Superior", "Trascendencia"],
            "image_url": "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80",
            "content": """
<div class="space-y-12 text-purple-950 font-sans leading-relaxed">

    <!-- Header Royal Amethyst -->
    <div class="bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white p-10 md:p-16 rounded-3xl shadow-2xl border border-amber-400/50 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <span class="inline-block bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-widest px-5 py-2 rounded-full mb-6">
            👑 Masterclass Exclusiva • ✨ 100 Lumis
        </span>
        <h2 class="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight mb-6">
            La Catedral de la Calma: La Maestría Absoluta sobre la Mente
        </h2>
        <p class="text-purple-200 text-lg md:text-2xl font-light max-w-4xl leading-relaxed">
            El tratado supremo sobre la atención ecuánime, la disolución de la reactividad del ego y la edificación de un templo interno inquebrantable ante cualquier borrasca del mundo exterior.
        </p>
    </div>

    <!-- Main Header Image -->
    <div class="rounded-3xl overflow-hidden shadow-2xl border border-amber-400/30">
        <img src="https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80" alt="Templo sagrado envuelto en luz dorada" class="w-full h-80 md:h-[450px] object-cover" />
    </div>

    <!-- Imperial Quote -->
    <div class="bg-gradient-to-r from-purple-950 to-slate-950 text-amber-100 p-10 md:p-12 rounded-3xl border border-amber-400/50 shadow-2xl relative">
        <p class="text-2xl md:text-3xl font-serif italic text-amber-200 leading-relaxed mb-4">
            "Cuando cesas de identificarte compulsivamente con el torrente de tus pensamientos, descubres una verdad conmovedora: tú no eres las olas convulsas de la superficie; tú eres el océano ilimitado sobre el cual danzan las tormentas."
        </p>
        <span class="block text-right text-xs font-bold uppercase tracking-widest text-amber-400">— Maestro Samuel Roldán</span>
    </div>

    <!-- 5 Stage Guide -->
    <div class="bg-white rounded-3xl p-8 md:p-12 border border-purple-200 shadow-xl space-y-6">
        <h3 class="text-2xl font-black text-purple-950 border-b border-purple-100 pb-4">
            🏛️ Las 5 Etapas de la Edificación de la Catedral Interior
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 bg-purple-50 rounded-2xl border border-purple-100 space-y-2">
                <div class="text-purple-700 font-black text-xs uppercase tracking-widest">Etapa I</div>
                <h4 class="font-bold text-slate-900 text-lg">El Testigo Silencioso</h4>
                <p class="text-xs md:text-sm text-slate-600 leading-relaxed">Cultivar la postura de observador imparcial que contempla las fluctuaciones mentales sin aferrarse ni reaccionar.</p>
            </div>
            <div class="p-6 bg-purple-50 rounded-2xl border border-purple-100 space-y-2">
                <div class="text-purple-700 font-black text-xs uppercase tracking-widest">Etapa II</div>
                <h4 class="font-bold text-slate-900 text-lg">Desidentificación del Ego</h4>
                <p class="text-xs md:text-sm text-slate-600 leading-relaxed">Reconocer con claridad que tus etiquetas, temores aprendidos e historias pasadas no constituyen tu ser esencial.</p>
            </div>
            <div class="p-6 bg-purple-50 rounded-2xl border border-purple-100 space-y-2">
                <div class="text-purple-700 font-black text-xs uppercase tracking-widest">Etapa III</div>
                <h4 class="font-bold text-slate-900 text-lg">Ecuanimidad Somática</h4>
                <p class="text-xs md:text-sm text-slate-600 leading-relaxed">Permanecer en anclaje biológico estable aun en entornos de alta tensión o incertidumbre externa.</p>
            </div>
            <div class="p-6 bg-purple-50 rounded-2xl border border-purple-100 space-y-2">
                <div class="text-purple-700 font-black text-xs uppercase tracking-widest">Etapa IV</div>
                <h4 class="font-bold text-slate-900 text-lg">Compasión Radiante</h4>
                <p class="text-xs md:text-sm text-slate-600 leading-relaxed">Transformar el silencio interior en una fuente inagotable de servicio, empatía y amor incondicional.</p>
            </div>
        </div>
    </div>

</div>
"""
        }
    ]

    print("Actualizando las 10 historias con URLs de imágenes Unsplash reales e historias extensas...")

    for data in stories_data:
        story, created = Story.objects.update_or_create(
            id=data["id"],
            defaults={
                "title": data["title"],
                "slug": slugify(data["title"]),
                "author": data["author"],
                "category": data["category"],
                "tags": data["tags"],
                "image_url": data["image_url"],
                "content": data["content"],
                "is_active": True
            }
        )
        status = "Creada" if created else "Actualizada"
        print(f"[{status}] ID {story.id}: '{story.title}' | Slug: {story.slug}")

    print("\n¡Actualización completada exitosamente!")

if __name__ == "__main__":
    from django.utils.text import slugify
    seed_stories()
