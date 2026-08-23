from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0051_courseenrollment'),
    ]

    operations = [
        migrations.AddField(
            model_name='patient',
            name='cover_picture_file',
            field=models.ImageField(blank=True, null=True, upload_to='patients/covers/'),
        ),
        migrations.AddField(
            model_name='patient',
            name='cover_picture_url',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='patient',
            name='cover_position_y',
            field=models.IntegerField(default=50),
        ),
    ]
