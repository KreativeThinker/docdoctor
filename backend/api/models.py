from django.db import models
from django.db.models import Manager


class Document(models.Model):
    file = models.FileField(upload_to="documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255, null=False)
    objects: Manager = models.Manager()
