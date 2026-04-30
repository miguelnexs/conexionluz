from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0027_forumtopic_forumreply"),
    ]

    operations = [
        migrations.AddField(
            model_name="forumtopic",
            name="image_file",
            field=models.FileField(blank=True, null=True, upload_to="forum/images/"),
        ),
    ]
