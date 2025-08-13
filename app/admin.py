from django.contrib import admin
from . import models


@admin.register(models.PreprocessText)
class PreprocessTextAdmin(admin.ModelAdmin):
    list_display = ['file', 'short_file_text']
    # search_fields = ['text']
    list_filter = ['created_at', 'updated_at']

    def short_file_text(self, obj):
        if not obj.file_text:
            return "No file text"
        return obj.file_text[:50] + ("..." if len(obj.file_text) > 100 else "")

    short_file_text.short_description = "File Text"

    # def short_text(self, obj):
    #     if not obj.text:
    #         return "No text"
    #     return obj.text[:50] + ("..." if len(obj.text) > 50 else "")

    # short_text.short_description = "Text"


@admin.register(models.Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ["name", 'email', 'phone']
    list_filter = ["name", 'email', 'phone']
    search_fields = ["name", 'email', 'phone']


@admin.register(models.ChatHistory)
class ChatHistoryAdmin(admin.ModelAdmin):
    list_display = ["user","session_id", "user_message", "ai_response", "created_at"]
    search_fields = ["user_message", "ai_response", "session_id"]
    list_filter = ["created_at"]


@admin.register(models.subscribers)
class SubscribersAdmin(admin.ModelAdmin):
    list_display = ["user","email"]
    list_filter = ["created_at"]
    search_fields = ['user','email']