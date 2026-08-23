import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from api.models import Story

def add_new_story():
    content = """
<div class="space-y-10 text-slate-800 leading-relaxed font-sans">
    <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 text-white p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden">
        <h1 class="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">Del Caos a la Coherencia: La Neurociencia del Bienestar Integral</h1>
    </div>
    
    <div class="prose prose-lg max-w-none prose-emerald">
        <p>En el ajetreado mundo moderno, nuestras mentes a menudo se asemejan a una gran ciudad en hora pico: luces parpadeantes, ruido incesante y tráfico congestionado. Este estado, que muchos experimentamos a diario, es lo que los neurocientíficos llaman un estado de "caos" neurológico. Pero, ¿qué sucede exactamente en nuestro cerebro cuando nos sentimos así, y cómo podemos navegar hacia la ansiada "coherencia"?</p>

        <h2 class="text-3xl font-black text-emerald-800 mt-10 mb-6">El Caos: La Amígdala al Mando</h2>
        <p>Cuando estamos estresados, ansiosos o abrumados, una pequeña estructura en forma de almendra en nuestro cerebro toma el control: la amígdala. Esta es nuestra alarma de incendios evolutiva. Su trabajo es detectar amenazas y activar la respuesta de "lucha o huida". En este estado, nuestro cuerpo se inunda de cortisol y adrenalina. La respiración se vuelve superficial, el ritmo cardíaco se acelera y nuestra atención se estrecha, enfocándose únicamente en la supervivencia inmediata.</p>
        <p>En el cerebro, esto se traduce en ondas cerebrales rápidas y desincronizadas (ondas Beta altas). Las diferentes áreas del cerebro dejan de comunicarse de manera eficiente. Es el caos: mucha energía gastada, pero poca claridad.</p>

        <h2 class="text-3xl font-black text-emerald-800 mt-10 mb-6">El Puente: La Respiración y el Nervio Vago</h2>
        <p>Afortunadamente, no estamos a merced de la amígdala. Tenemos un "freno de emergencia" incorporado, y la llave para activarlo es algo que hacemos automáticamente miles de veces al día: respirar.</p>
        <p>Cuando ralentizamos y profundizamos nuestra respiración, enviamos una señal a través del nervio vago, la autopista de información que conecta el cerebro con nuestros órganos internos. Este mensaje le dice al sistema nervioso parasimpático que es hora de "descansar y digerir". Lentamente, la niebla química del estrés comienza a disiparse.</p>

        <h2 class="text-3xl font-black text-emerald-800 mt-10 mb-6">El Despertar: La Corteza Prefrontal</h2>
        <p>A medida que el sistema nervioso se calma, la "dirección ejecutiva" del cerebro vuelve a encenderse: la corteza prefrontal. Esta área, ubicada justo detrás de nuestra frente, es responsable del pensamiento lógico, la empatía, la toma de decisiones y la regulación emocional.</p>
        <p>Cuando la corteza prefrontal recupera el control, comenzamos a ver el panorama general. Podemos responder a las situaciones en lugar de simplemente reaccionar ante ellas.</p>

        <h2 class="text-3xl font-black text-emerald-800 mt-10 mb-6">La Coherencia: El Estado de Flujo y Bienestar</h2>
        <p>El objetivo final no es simplemente la ausencia de estrés, sino un estado de "coherencia". En la neurociencia, la coherencia ocurre cuando los diferentes ritmos del cuerpo (el corazón, la respiración y las ondas cerebrales) se sincronizan en perfecta armonía.</p>
        <p>En este estado, las ondas cerebrales cambian a frecuencias Alfa o Theta, asociadas con la relajación profunda, la creatividad y el "estado de flujo". El corazón late con una variabilidad suave y rítmica. El cerebro y el cuerpo ya no están en conflicto, sino trabajando juntos como una orquesta bien afinada.</p>

        <h2 class="text-3xl font-black text-emerald-800 mt-10 mb-6">El Viaje Práctico</h2>
        <p>Pasar del caos a la coherencia no es un evento único, sino una práctica diaria. Aquí hay algunas formas respaldadas por la ciencia para cultivar este estado:</p>
        <ul class="list-disc pl-6 space-y-2">
            <li><strong>Mindfulness y Meditación:</strong> Entrenan la corteza prefrontal para mantener la atención y calmar la amígdala.</li>
            <li><strong>Respiración Consciente (Coherente):</strong> Respirar a un ritmo de aproximadamente 5 a 6 respiraciones por minuto sincroniza el corazón y el cerebro.</li>
            <li><strong>Conexión Social:</strong> Las interacciones positivas liberan oxitocina, que contrarresta directamente los efectos del cortisol.</li>
            <li><strong>Movimiento Físico:</strong> El ejercicio regular ayuda a metabolizar las hormonas del estrés acumuladas.</li>
        </ul>
        <p class="mt-6">El bienestar integral no es un lujo, es nuestro estado natural de diseño. Al comprender la neurociencia detrás de nuestras experiencias, podemos tomar el volante y guiar nuestra propia mente del caos agotador a una coherencia profunda y restauradora.</p>
    </div>
</div>
"""

    story = Story.objects.create(
        title="Del Caos a la Coherencia: La Neurociencia del Bienestar Integral",
        author="Antigravity",
        category="Neurociencia & Bienestar",
        tags=["Gratis", "Neurociencia", "Bienestar", "Conexión Luz"],
        image_url="https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1200&q=80",
        content=content
    )
    print(f"Created story: {story.title} with ID {story.id}")

if __name__ == "__main__":
    add_new_story()
