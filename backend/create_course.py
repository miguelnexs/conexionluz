import os
import django
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Course

def create_course():
    # Helper to generate ids
    def gid(): return str(uuid.uuid4())

    content = {
        "version": 1,
        "sections": [
            {
                "id": gid(),
                "title": "Módulo 1: Introducción a la Inteligencia Emocional",
                "items": [
                    {
                        "id": gid(),
                        "type": "html",
                        "title": "¿Qué es la Inteligencia Emocional?",
                        "html": "<h2>Definición y Conceptos Básicos</h2><p>La inteligencia emocional (IE) se refiere a la capacidad de reconocer, entender y manejar nuestras propias emociones, así como reconocer, entender e influir en las emociones de los demás.</p><p>En términos prácticos, esto significa ser consciente de que las emociones pueden impulsar nuestro comportamiento y afectar a las personas de manera positiva o negativa, y aprender a manejar esas emociones, tanto las nuestras como las de los demás, especialmente cuando estamos bajo presión.</p><h3>Los 5 componentes principales</h3><ul><li><strong>Autoconciencia:</strong> Conocer las propias emociones.</li><li><strong>Autorregulación:</strong> Manejar las emociones.</li><li><strong>Motivación:</strong> Utilizar las emociones para alcanzar metas.</li><li><strong>Empatía:</strong> Reconocer las emociones de los demás.</li><li><strong>Habilidades Sociales:</strong> Manejar las relaciones.</li></ul>"
                    },
                    {
                        "id": gid(),
                        "type": "html",
                        "title": "La importancia de la Autoconciencia",
                        "html": "<h2>El pilar fundamental</h2><p>La autoconciencia es el pilar sobre el que se construyen todas las demás habilidades emocionales. Sin la capacidad de reconocer lo que estamos sintiendo en el momento, es imposible manejar esas emociones de manera efectiva.</p><p>Para desarrollar la autoconciencia, es útil practicar la atención plena (mindfulness), llevar un diario emocional y pedir retroalimentación honesta a personas de confianza.</p>"
                    }
                ]
            },
            {
                "id": gid(),
                "title": "Módulo 2: Herramientas Prácticas",
                "items": [
                    {
                        "id": gid(),
                        "type": "html",
                        "title": "Técnicas de Autorregulación",
                        "html": "<h2>Manteniendo el equilibrio</h2><p>La autorregulación nos permite pausar entre un sentimiento y una acción. Es la capacidad de pensar antes de actuar.</p><h3>Técnicas efectivas:</h3><ol><li><strong>Respiración profunda:</strong> Ayuda a reducir el ritmo cardíaco y calmar el sistema nervioso.</li><li><strong>Reestructuración cognitiva:</strong> Cambiar la forma en que pensamos sobre una situación estresante.</li><li><strong>Pausa consciente:</strong> Tomarse 5 segundos antes de responder a un estímulo desencadenante.</li></ol>"
                    },
                    {
                        "id": gid(),
                        "type": "quiz",
                        "title": "Evaluación de conocimientos",
                        "quiz": {
                            "questions": [
                                {
                                    "id": gid(),
                                    "type": "multiple",
                                    "prompt": "¿Cuál de los siguientes NO es uno de los 5 componentes principales de la inteligencia emocional?",
                                    "choices": [
                                        {"id": gid(), "text": "Empatía", "isCorrect": False},
                                        {"id": gid(), "text": "Simpatía", "isCorrect": True},
                                        {"id": gid(), "text": "Autoconciencia", "isCorrect": False},
                                        {"id": gid(), "text": "Motivación", "isCorrect": False}
                                    ]
                                },
                                {
                                    "id": gid(),
                                    "type": "truefalse",
                                    "prompt": "La autoconciencia es la capacidad de manejar las emociones de los demás.",
                                    "correctBool": False
                                },
                                {
                                    "id": gid(),
                                    "type": "multiple",
                                    "prompt": "¿Qué técnica ayuda a pausar entre un sentimiento y una acción?",
                                    "choices": [
                                        {"id": gid(), "text": "Autorregulación", "isCorrect": True},
                                        {"id": gid(), "text": "Procrastinación", "isCorrect": False},
                                        {"id": gid(), "text": "Negación", "isCorrect": False}
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
        slug="inteligencia-emocional-practica",
        defaults={
            "title": "Inteligencia Emocional Práctica",
            "description": "Aprende a reconocer, comprender y gestionar tus emociones con este curso completo basado completamente en texto y lectura comprensiva.",
            "description_html": "<p>Aprende a reconocer, comprender y gestionar tus emociones con este curso completo basado completamente en texto y lectura comprensiva. Explorarás los pilares fundamentales y herramientas aplicables para mejorar tus relaciones interpersonales.</p>",
            "price_cop": 45000,
            "category": "Crecimiento Personal",
            "tags": ["Emociones", "Psicología", "Lectura"],
            "status": "published",
            "is_active": True,
            "draft_content": content,
            "published_content": content
        }
    )
    print(f"Course created/updated: {course.title} (slug: {course.slug})")

if __name__ == '__main__':
    create_course()
