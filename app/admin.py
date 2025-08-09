from django.contrib import admin
from . import models

# Register your models here.
@admin.register(models.PreprocessText)
class PreprocessTextAdmin(admin.ModelAdmin):


    list_display = ['short_text','file','short_file_text']
    search_fields = ['title']
    list_filter = ['created_at', 'updated_at']

    def short_file_text(self,obj):
        if not obj.file_text:
            return "No file text"
        return(obj.file_text[:50]+"..." if obj.file_text and len(obj.file_text)>100 else obj.file_text)
    short_file_text.short_description = "file_text"

    def short_text(self,obj):
        if not obj.text:
            return "No text"
        return obj.text[:50] + ("..." if len(obj.text) > 50 else "")

    short_text.text = "Text"


@admin.register(models.Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ["name",'email','phone']
    list_filter = ["name",'email','phone']
    search_fields = ["name",'email','phone']