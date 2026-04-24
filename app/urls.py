from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView
from django.contrib import admin

urlpatterns = [
    path("",views.index,name="index"),
    path("contact/",views.contact,name="contact"),
    path("about/",views.about,name="about"),
    path("chatbot/",views.chatbot,name="chatbot"),
    path("profile/", views.profile_view, name="profile"),
    path("profile/edit/", views.edit_profile, name="edit_profile"),
    path("profile/change-password/", views.change_password, name="change_password"),
    
    # path("chatbot/chat/",views.chatbot_chat,name="chatbot_chat")

    path('signup/', views.signup, name='signup'),
    path('login/', views.CustomLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(next_page='index'), name='logout'),

    path("subscribe",views.subscribe,name="subscribe"),
    path("api/chat/", views.api_chat, name="api_chat"),
    path("api/signup/", views.api_signup, name="api_signup"),
    path("api/login/", views.api_login, name="api_login"),
    path("api/logout/", views.api_logout, name="api_logout"),
    path("api/profile/", views.api_profile, name="api_profile"),
    path("api/contact/", views.api_contact, name="api_contact"),
    path("api/subscribe/", views.api_subscribe, name="api_subscribe"),
    path("api/sessions/", views.api_sessions, name="api_sessions"),
]


admin.site.site_header = "RAG Q&A" 
admin.site.site_title = "RAG Question and Answering System"
admin.site.index_title = "Welcome to RAG Q&A"
