import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Therapist

therapists_data = [
    {"name": "Dr. Carlos Mendoza", "title": "Psicólogo Clínico", "description": "Especialista en terapia cognitivo-conductual y manejo de ansiedad.", "specialties": ["Ansiedad", "Depresión", "Terapia Cognitiva"], "modality": "online", "location": "Bogotá, Colombia", "price_from_cop": 120000, "session_duration_minutes": 60},
    {"name": "Dra. Laura Restrepo", "title": "Terapeuta Holística", "description": "Sanación energética, Reiki y alineación de chakras.", "specialties": ["Reiki", "Meditación", "Terapia Energética"], "modality": "presential", "location": "Medellín, Colombia", "price_from_cop": 100000, "session_duration_minutes": 45},
    {"name": "Dra. Andrea Gomez", "title": "Psicóloga Gestalt", "description": "Acompañamiento en procesos de duelo y autoconocimiento.", "specialties": ["Gestalt", "Duelo", "Autoesteem"], "modality": "online", "location": "Cali, Colombia", "price_from_cop": 130000, "session_duration_minutes": 60},
    {"name": "Dr. Mateo Silva", "title": "Hipnoterapeuta", "description": "Especialista en hipnosis regresiva y superación de fobias.", "specialties": ["Hipnosis", "Fobias", "Regresiones"], "modality": "both", "location": "Bogotá, Colombia", "price_from_cop": 150000, "session_duration_minutes": 90},
    {"name": "Dra. Valentina Lopez", "title": "Terapeuta de Pareja", "description": "Resolución de conflictos, comunicación asertiva y terapia familiar.", "specialties": ["Parejas", "Familia", "Comunicación"], "modality": "both", "location": "Barranquilla, Colombia", "price_from_cop": 140000, "session_duration_minutes": 60},
    {"name": "Dr. Sebastian Castro", "title": "Especialista en Mindfulness", "description": "Reducción del estrés basada en la atención plena (MBSR).", "specialties": ["Mindfulness", "Estrés", "Relajación"], "modality": "online", "location": "Bogotá, Colombia", "price_from_cop": 110000, "session_duration_minutes": 50},
    {"name": "Dra. Camila Ortega", "title": "Coach de Vida", "description": "Desarrollo personal, metas profesionales y empoderamiento.", "specialties": ["Coaching", "Liderazgo", "Motivación"], "modality": "online", "location": "Manizales, Colombia", "price_from_cop": 95000, "session_duration_minutes": 60},
    {"name": "Dr. Gabriel Ruiz", "title": "Terapeuta Transpersonal", "description": "Integración psicoterapéutica de estados no ordinarios de conciencia.", "specialties": ["Transpersonal", "Espiritualidad", "Integración"], "modality": "both", "location": "Santamarta, Colombia", "price_from_cop": 160000, "session_duration_minutes": 75},
    {"name": "Dra. Sofia Mendez", "title": "Psicóloga Infantil", "description": "Terapia de juego, problemas de aprendizaje y pautas de crianza.", "specialties": ["Infantil", "Crianza", "Terapia de Juego"], "modality": "presential", "location": "Bogotá, Colombia", "price_from_cop": 125000, "session_duration_minutes": 60},
    {"name": "Dr. Alejandro Rios", "title": "Terapeuta Corporal", "description": "Liberación de tensión muscular, somatización y expresión corporal.", "specialties": ["Corporal", "Somática", "Yoga Terapia"], "modality": "presential", "location": "Envigado, Colombia", "price_from_cop": 115000, "session_duration_minutes": 60}
]

for data in therapists_data:
    Therapist.objects.update_or_create(name=data["name"], defaults=data)
print("Se crearon/actualizaron 10 profesionales exitosamente.")
