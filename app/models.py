from django.db import models
from django.core.exceptions import ValidationError
import os


# Create your models here.

def validate_file_type(value):
    ext = os.path.splitext(value.name)[1].lower()
    allowed_extensions = ['.pdf', '.docx', '.txt']
    if ext not in allowed_extensions:
        raise ValidationError('Only PDF, DOCX, and TXT files are allowed.')



class TimeStampedModel(models.Model):
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    class Meta:
        abstract = True


class PreprocessText(TimeStampedModel):
    text = models.TextField(blank=True,null=True)
    file = models.FileField(upload_to='uploads/',blank=True,null=True)
    file_text = models.TextField(blank=True,null=True)

    def __str__(self):
        return self.text[:50] if self.text else "No text"