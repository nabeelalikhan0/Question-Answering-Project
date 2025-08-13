from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView
from django.contrib import admin

urlpatterns = [
    path("",views.index,name="index"),
    path("contact",views.contact,name="contact"),
    path("about",views.about,name="about"),
    path("chatbot",views.chatbot,name="chatbot"),
    path("profile/", views.profile_view, name="profile"),
    path("profile/edit/", views.edit_profile, name="edit_profile"),
    path("profile/change-password/", views.change_password, name="change_password"),
    
    # path("chatbot/chat/",views.chatbot_chat,name="chatbot_chat")

    path('signup/', views.signup, name='signup'),
    path('login/', views.CustomLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(next_page='index'), name='logout'),

    path("subscribe",views.subscribe,name="subscribe")
]


admin.site.site_header = "RAG Q&A" 
admin.site.site_title = "RAG Question and Answering System"
admin.site.index_title = "Welcome to RAG Q&A"
