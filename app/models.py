from turtle import ondrag
from django.db import models
from django.core.exceptions import ValidationError
import os
from django.contrib.auth.models import User


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


class Contact(TimeStampedModel):
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=254)
    phone = models.CharField(max_length=255)
    message = models.TextField()

    def __str__(self):
        return self.name


class PreprocessText(TimeStampedModel):
    text = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='uploads/', blank=True, null=True, validators=[validate_file_type])
    file_text = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.text[:50] if self.text else "No text"


class ChatHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_id = models.CharField(max_length=255)
    user_message = models.TextField()
    ai_response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.created_at} - {self.user_message[:50]}"

