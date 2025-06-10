from django.db import models
from django.db.models import Manager


class Document(models.Model):
    file = models.FileField(upload_to="documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255, null=False)
    tags = models.ManyToManyField("Tags", related_name="documents", blank=True)
    size = models.PositiveIntegerField(null=False, default=0)
    objects: Manager = models.Manager()


class Tags(models.Model):
    name = models.CharField(max_length=32, unique=True)
    objects: Manager = models.Manager()


class Chunk(models.Model):
    document = models.ForeignKey(
        Document, on_delete=models.CASCADE, related_name="chunks"
    )
    content = models.TextField()
    chunk_number = models.PositiveIntegerField()
    objects: Manager = models.Manager()

    class Meta:
        unique_together = ("document", "chunk_number")
