from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0026_story_author_story_category_story_tags"),
    ]

    operations = [
        migrations.CreateModel(
            name="ForumTopic",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("title", models.CharField(max_length=300)),
                ("description", models.TextField(blank=True)),
                ("category", models.CharField(blank=True, max_length=100)),
                ("is_pinned", models.BooleanField(default=False)),
                ("is_locked", models.BooleanField(default=False)),
                ("is_active", models.BooleanField(default=True)),
                ("created_by", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="forum_topics", to="api.patient")),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="ForumReply",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("content", models.TextField()),
                ("author_name", models.CharField(max_length=200)),
                ("is_active", models.BooleanField(default=True)),
                ("patient", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="forum_replies", to="api.patient")),
                ("topic", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="replies", to="api.forumtopic")),
            ],
            options={
                "abstract": False,
            },
        ),
    ]
