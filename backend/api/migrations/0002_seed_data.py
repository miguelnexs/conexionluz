from django.db import migrations


def seed(apps, schema_editor):
    Course = apps.get_model("api", "Course")
    Therapist = apps.get_model("api", "Therapist")
    Service = apps.get_model("api", "Service")
    Talk = apps.get_model("api", "Talk")
    Testimonial = apps.get_model("api", "Testimonial")

    if Course.objects.count() == 0:
        Course.objects.create(
            title="Hipnosis Interdimencional",
            slug="hipnosis-interdimencional",
            description="Curso guiado con contenido en video, ejercicios y herramientas.",
            price_cop=99000,
            status="published",
            is_active=True,
        )

    if Therapist.objects.count() == 0:
        Therapist.objects.create(
            name="Dra. Laura Sánchez",
            title="Psicología clínica",
            specialties=["Ansiedad", "Autoestima", "Estrés"],
            modality="Online / Presencial",
            location="Ciudad",
            is_active=True,
        )
        Therapist.objects.create(
            name="Ps. Juan David Pérez",
            title="Terapia familiar y de pareja",
            specialties=["Pareja", "Comunicación", "Límites"],
            modality="Presencial",
            location="Ciudad",
            is_active=True,
        )
        Therapist.objects.create(
            name="Dra. Amparo Ruiz",
            title="Trauma y duelo",
            specialties=["Trauma", "Duelo", "Regulación emocional"],
            modality="Online",
            location="Remoto",
            is_active=True,
        )

    if Service.objects.count() == 0:
        Service.objects.create(
            title="Terapia individual",
            description="Procesos de autoconocimiento, ansiedad, depresión, estrés y desarrollo personal.",
            price_cop=0,
            is_active=True,
        )
        Service.objects.create(
            title="Terapia de pareja",
            description="Comunicación, acuerdos, confianza y construcción de vínculos saludables.",
            price_cop=0,
            is_active=True,
        )
        Service.objects.create(
            title="Terapia familiar",
            description="Dinámicas familiares, crianza, límites y resolución de conflictos.",
            price_cop=0,
            is_active=True,
        )
        Service.objects.create(
            title="Talleres y grupos",
            description="Espacios guiados para aprender herramientas y fortalecer el bienestar.",
            price_cop=0,
            is_active=True,
        )

    if Talk.objects.count() == 0:
        Talk.objects.create(
            title="Ansiedad: entenderla y gestionarla",
            format="online",
            audience="Público general",
            is_active=True,
        )
        Talk.objects.create(
            title="Comunicación en pareja: herramientas",
            format="presential",
            audience="Parejas",
            is_active=True,
        )
        Talk.objects.create(
            title="Crianza consciente: límites con calma",
            format="online",
            audience="Padres y cuidadores",
            is_active=True,
        )

    if Testimonial.objects.count() == 0:
        Testimonial.objects.create(
            name="Mariana",
            title="Proceso individual",
            quote="Me sentí escuchada y acompañada. Aprendí herramientas para manejar la ansiedad y recuperar mi tranquilidad.",
            rating=5,
            is_active=True,
        )
        Testimonial.objects.create(
            name="Carlos",
            title="Terapia de pareja",
            quote="Volvimos a comunicarnos con respeto. El proceso fue práctico y con pasos claros para mejorar.",
            rating=5,
            is_active=True,
        )
        Testimonial.objects.create(
            name="Andrea",
            title="Duelo y resiliencia",
            quote="Pude entender mis emociones y avanzar a mi ritmo. Fue un espacio seguro y muy humano.",
            rating=5,
            is_active=True,
        )


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed, migrations.RunPython.noop),
    ]

