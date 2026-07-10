from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0046_patient_can_publish"),
    ]

    operations = [
        migrations.CreateModel(
            name="CommunityPost",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("author_name", models.CharField(blank=True, max_length=200)),
                ("author_avatar_url", models.CharField(blank=True, max_length=500)),
                ("author_role", models.CharField(blank=True, max_length=100)),
                ("content", models.TextField(blank=True)),
                ("image_url", models.TextField(blank=True)),
                ("feeling", models.CharField(blank=True, max_length=100)),
                ("like_patient_ids", models.JSONField(blank=True, default=list)),
                ("is_approved", models.BooleanField(default=False)),
                ("is_active", models.BooleanField(default=True)),
                ("patient", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="community_posts", to="api.patient")),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="CommunityPostComment",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("author_name", models.CharField(blank=True, max_length=200)),
                ("author_avatar_url", models.CharField(blank=True, max_length=500)),
                ("author_role", models.CharField(blank=True, max_length=100)),
                ("content", models.TextField()),
                ("is_active", models.BooleanField(default=True)),
                ("patient", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="community_post_comments", to="api.patient")),
                ("post", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="post_comments", to="api.communitypost")),
            ],
            options={
                "ordering": ["created_at"],
            },
        ),
    ]

