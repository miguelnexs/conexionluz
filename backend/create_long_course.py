import os
import django
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Course

def create_long_course():
    def gid(): return str(uuid.uuid4())

    content = {
        "version": 1,
        "sections": [
            {
                "id": gid(),
                "title": "Módulo 1: Fundamentos del Mindfulness",
                "items": [
                    {
                        "id": gid(),
                        "type": "html",
                        "title": "Orígenes y Filosofía",
                        "html": "<h2>Los orígenes históricos del Mindfulness</h2><p>El mindfulness tiene sus raíces en las tradiciones contemplativas orientales, particularmente en el budismo Vipassana. Sin embargo, en la década de 1970, Jon Kabat-Zinn introdujo esta práctica en la medicina occidental, secularizándola y enfocándose en sus beneficios terapéuticos y psicológicos.</p><p>La filosofía central del mindfulness no es poner la mente en blanco, sino observar los pensamientos y sensaciones corporales sin emitir juicios de valor. Es el arte de estar presente aquí y ahora.</p>"
                    },
                    {
                        "id": gid(),
                        "type": "html",
                        "title": "El Cerebro y la Meditación",
                        "html": "<h2>Neuroplasticidad</h2><p>La neurociencia moderna ha demostrado que la práctica constante de mindfulness altera físicamente la estructura del cerebro. Esto se conoce como neuroplasticidad.</p><ul><li><strong>Amígdala:</strong> El centro del miedo y el estrés se encoge, disminuyendo la reactividad.</li><li><strong>Corteza prefrontal:</strong> La región asociada con funciones ejecutivas, toma de decisiones y conciencia se vuelve más densa.</li><li><strong>Hipocampo:</strong> Fundamental para el aprendizaje y la memoria, aumenta de tamaño.</li></ul>"
                    },
                    {
                        "id": gid(),
                        "type": "html",
                        "title": "Mitos Comunes",
                        "html": "<h2>Desmintiendo creencias limitantes</h2><p>Existen muchos malentendidos sobre la meditación que impiden a las personas beneficiarse de ella:</p><ol><li><strong>Mito 1:</strong> Tienes que dejar de pensar. <em>Realidad:</em> El objetivo no es detener los pensamientos, sino cambiar nuestra relación con ellos.</li><li><strong>Mito 2:</strong> Es una práctica religiosa. <em>Realidad:</em> El mindfulness moderno es completamente secular y está respaldado por la ciencia médica.</li><li><strong>Mito 3:</strong> Toma demasiado tiempo. <em>Realidad:</em> Incluso 5 a 10 minutos diarios pueden producir cambios neurológicos significativos.</li></ol>"
                    },
                    {
                        "id": gid(),
                        "type": "quiz",
                        "title": "Quiz Módulo 1",
                        "quiz": {
                            "questions": [
                                {
                                    "id": gid(),
                                    "type": "multiple",
                                    "prompt": "¿Quién es conocido por haber introducido el mindfulness en la medicina occidental en los 70s?",
                                    "choices": [
                                        {"id": gid(), "text": "Jon Kabat-Zinn", "isCorrect": True},
                                        {"id": gid(), "text": "Sigmund Freud", "isCorrect": False},
                                        {"id": gid(), "text": "Dalai Lama", "isCorrect": False},
                                        {"id": gid(), "text": "Carl Jung", "isCorrect": False}
                                    ]
                                },
                                {
                                    "id": gid(),
                                    "type": "truefalse",
                                    "prompt": "El mindfulness busca poner la mente totalmente en blanco.",
                                    "correctBool": False
                                }
                            ]
                        }
                    }
                ]
            },
            {
                "id": gid(),
                "title": "Módulo 2: Anatomía del Estrés",
                "items": [
                    {
                        "id": gid(),
                        "type": "html",
                        "title": "La Respuesta de Lucha o Huida",
                        "html": "<h2>Fisiología del Estrés</h2><p>Cuando percibimos una amenaza, nuestro sistema nervioso simpático se activa instantáneamente. Esta es una respuesta evolutiva diseñada para protegernos de depredadores.</p><p>Se liberan hormonas como el cortisol y la adrenalina, aumentando el ritmo cardíaco, redirigiendo la sangre a los músculos mayores y agudizando nuestros sentidos. El problema en la vida moderna es que esta respuesta se activa por amenazas no físicas (como un correo del jefe), manteniéndonos en un estado de estrés crónico.</p>"
                    },
                    {
                        "id": gid(),
                        "type": "html",
                        "title": "Estrés Crónico vs Estrés Agudo",
                        "html": "<h2>Diferencias fundamentales</h2><p>El <strong>estrés agudo</strong> es breve y específico. Por ejemplo, tener que frenar bruscamente en el tráfico. Es útil e indispensable para la supervivencia.</p><p>El <strong>estrés crónico</strong> es prolongado. Preocupaciones financieras constantes o problemas familiares. Este tipo de estrés agota el sistema inmunológico, aumenta la presión arterial y puede llevar al síndrome de burnout y problemas cardiovasculares severos.</p>"
                    },
                    {
                        "id": gid(),
                        "type": "quiz",
                        "title": "Quiz Módulo 2",
                        "quiz": {
                            "questions": [
                                {
                                    "id": gid(),
                                    "type": "multiple",
                                    "prompt": "¿Qué hormonas principales se liberan durante la respuesta de estrés?",
                                    "choices": [
                                        {"id": gid(), "text": "Serotonina y Melatonina", "isCorrect": False},
                                        {"id": gid(), "text": "Cortisol y Adrenalina", "isCorrect": True},
                                        {"id": gid(), "text": "Insulina y Glucagón", "isCorrect": False}
                                    ]
                                },
                                {
                                    "id": gid(),
                                    "type": "truefalse",
                                    "prompt": "El estrés agudo es completamente dañino y debe evitarse a toda costa.",
                                    "correctBool": False
                                }
                            ]
                        }
                    }
                ]
            },
            {
                "id": gid(),
                "title": "Módulo 3: Prácticas Meditativas para el Día a Día",
                "items": [
                    {
                        "id": gid(),
                        "type": "html",
                        "title": "Meditación de Escaneo Corporal",
                        "html": "<h2>El Body Scan</h2><p>Esta práctica consiste en dirigir sistemáticamente la atención a diferentes partes del cuerpo. Suele comenzar desde los dedos de los pies y avanzar lentamente hacia la cabeza.</p><p>El objetivo no es relajar los músculos deliberadamente (aunque a menudo ocurre como efecto secundario), sino simplemente observar cualquier sensación presente: calor, tensión, hormigueo o incluso la ausencia de sensación.</p>"
                    },
                    {
                        "id": gid(),
                        "type": "html",
                        "title": "Mindfulness en el Trabajo",
                        "html": "<h2>Atención Plena Laboral</h2><p>La oficina suele ser el lugar de mayor desconexión con el momento presente. La multitarea, aunque glorificada, reduce la productividad hasta en un 40% y aumenta los errores.</p><p>Estrategias: Monotarea consciente, tomar micropausas de 1 minuto cada hora, y realizar respiraciones profundas antes de enviar un correo importante o entrar a una reunión tensa.</p>"
                    }
                ]
            },
            {
                "id": gid(),
                "title": "Módulo 4: Relaciones Interpersonales Conscientes",
                "items": [
                    {
                        "id": gid(),
                        "type": "html",
                        "title": "Comunicación No Violenta",
                        "html": "<h2>Los 4 Pasos de Marshall Rosenberg</h2><p>La CNV nos enseña a expresarnos desde nuestras necesidades sin culpar al otro. Consta de 4 etapas:</p><ol><li><strong>Observación:</strong> Describir los hechos sin evaluación (\"Cuando llegaste 30 minutos tarde...\").</li><li><strong>Sentimiento:</strong> Expresar cómo me siento (\"...me sentí frustrado...\").</li><li><strong>Necesidad:</strong> Identificar la necesidad no cubierta (\"...porque valoro el respeto por mi tiempo...\").</li><li><strong>Petición:</strong> Realizar un pedido claro y positivo (\"¿Podrías avisarme con antelación si te vas a retrasar?\").</li></ol>"
                    },
                    {
                        "id": gid(),
                        "type": "quiz",
                        "title": "Quiz Módulo 4",
                        "quiz": {
                            "questions": [
                                {
                                    "id": gid(),
                                    "type": "multiple",
                                    "prompt": "En la Comunicación No Violenta, ¿qué paso sigue a la Observación?",
                                    "choices": [
                                        {"id": gid(), "text": "Petición", "isCorrect": False},
                                        {"id": gid(), "text": "Sentimiento", "isCorrect": True},
                                        {"id": gid(), "text": "Necesidad", "isCorrect": False},
                                        {"id": gid(), "text": "Castigo", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },
            {
                "id": gid(),
                "title": "Módulo 5: Evaluación Final",
                "items": [
                    {
                        "id": gid(),
                        "type": "quiz",
                        "title": "Examen Integrador",
                        "quiz": {
                            "questions": [
                                {
                                    "id": gid(),
                                    "type": "truefalse",
                                    "prompt": "La neuroplasticidad significa que el cerebro puede cambiar físicamente su estructura a través de la meditación.",
                                    "correctBool": True
                                },
                                {
                                    "id": gid(),
                                    "type": "multiple",
                                    "prompt": "El objetivo principal del Escaneo Corporal es:",
                                    "choices": [
                                        {"id": gid(), "text": "Dormirse profundamente", "isCorrect": False},
                                        {"id": gid(), "text": "Relajar los músculos a la fuerza", "isCorrect": False},
                                        {"id": gid(), "text": "Observar las sensaciones corporales sin juzgar", "isCorrect": True},
                                        {"id": gid(), "text": "Dejar la mente en blanco", "isCorrect": False}
                                    ]
                                },
                                {
                                    "id": gid(),
                                    "type": "multiple",
                                    "prompt": "¿Qué técnica es efectiva para el Mindfulness en el trabajo?",
                                    "choices": [
                                        {"id": gid(), "text": "Monotarea consciente", "isCorrect": True},
                                        {"id": gid(), "text": "Multitasking constante", "isCorrect": False},
                                        {"id": gid(), "text": "Ignorar a los compañeros de trabajo", "isCorrect": False}
                                    ]
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    }

    course, created = Course.objects.update_or_create(
        slug="maestria-en-mindfulness-y-bienestar",
        defaults={
            "title": "Maestría en Mindfulness y Bienestar Integral",
            "description": "Un extenso y detallado curso que abarca desde la neurociencia del estrés hasta la comunicación consciente. Lleno de material de lectura extensa y quizes.",
            "description_html": "<p><strong>Bienvenido a la Maestría en Mindfulness.</strong> Este es un curso intensivo diseñado para sumergirte en el conocimiento teórico y práctico del bienestar mental.</p><p>A lo largo de 5 detallados módulos, explorarás las causas físicas y mentales del estrés, cómo reconfigurar la respuesta de tu cerebro y técnicas milenarias adaptadas a la modernidad para vivir una vida plena y consciente.</p>",
            "price_cop": 120000,
            "category": "Desarrollo Personal",
            "tags": ["Mindfulness", "Neurociencia", "Salud Mental", "Comunicación"],
            "status": "published",
            "is_active": True,
            "draft_content": content,
            "published_content": content
        }
    )
    print(f"Course created/updated: {course.title} (slug: {course.slug})")

if __name__ == '__main__':
    create_long_course()
