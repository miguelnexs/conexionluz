from django.db import migrations


SEED_THERAPIST_NAMES = [
    "Dra. Laura Sánchez",
    "Ps. Juan David Pérez",
    "Dra. Amparo Ruiz",
]


def remove_seed_therapists(apps, schema_editor):
    Therapist = apps.get_model("api", "Therapist")
    Therapist.objects.filter(name__in=SEED_THERAPIST_NAMES).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0004_therapist_photo_file"),
    ]

    operations = [
        migrations.RunPython(remove_seed_therapists, migrations.RunPython.noop),
    ]

