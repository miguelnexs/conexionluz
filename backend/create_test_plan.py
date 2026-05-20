import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import MembershipPlan

def create_plan():
    plan, created = MembershipPlan.objects.get_or_create(
        slug='hipnosis-profunda',
        defaults={
            'name': 'Plan Hipnosis Profunda',
            'description': 'Acceso a sesiones semanales de hipnosis clínica y reprogramación mental subconsciente para transformar tu vida.',
            'price_cop': 150000,
            'price_usd': 40,
            'price_eur': 35,
            'annual_price_cop': 1500000,
            'annual_price_usd': 400,
            'annual_price_eur': 350,
            'monthly_discount_percent': 0,
            'annual_discount_percent': 15,
            'sessions_per_month': 4,
            'sessions_breakdown': [
                {'name': 'Hipnosis Clínica', 'count': 4, 'description': 'Sesiones individuales de 1 hora por videollamada.'},
                {'name': 'Audios de refuerzo', 'count': 0, 'description': 'Acceso ilimitado a la biblioteca de audios mp3.'}
            ],
            'benefits': [
                '4 Sesiones privadas al mes',
                'Acceso a la biblioteca de autohipnosis',
                'Seguimiento vía WhatsApp',
                '15% de descuento en Talleres presenciales',
                'Material de apoyo en PDF'
            ],
            'is_active': True,
            'is_featured': True
        }
    )
    if created:
        print(f"Plan '{plan.name}' creado exitosamente.")
    else:
        print(f"El plan '{plan.name}' ya existe.")

if __name__ == '__main__':
    create_plan()
