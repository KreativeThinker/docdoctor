# Generated by Django 5.2.1 on 2025-05-29 08:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0002_tags_document_tags"),
    ]

    operations = [
        migrations.AddField(
            model_name="document",
            name="size",
            field=models.PositiveIntegerField(default=0),
        ),
    ]
