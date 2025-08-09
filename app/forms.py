from . import models
from django import forms
from django.contrib.auth.models import User


class TextForm(forms.ModelForm):
    class Meta:
        model = models.PreprocessText
        fields = '__all__'
        exclude = ['file_text']
