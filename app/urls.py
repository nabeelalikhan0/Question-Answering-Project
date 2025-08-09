from django.urls import path
from . import views

urlpatterns = [
    path("",views.index,name="Index"),
    path("contact",views.contact,name="contact"),
    path("about",views.about,name="about"),
    path("chatbot",views.chatbot,name="chatbot"),
    # path("chatbot/chat/",views.chatbot_chat,name="chatbot_chat")


]
