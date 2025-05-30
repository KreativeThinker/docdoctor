# Generated by Django 5.2.1 on 2025-05-29 06:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Tags",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=32, unique=True)),
            ],
        ),
        migrations.AddField(
            model_name="document",
            name="tags",
            field=models.ManyToManyField(
                blank=True, related_name="documents", to="api.tags"
            ),
        ),
    ]
