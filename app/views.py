import os
import PyPDF2
import docx
from django.shortcuts import render,redirect,HttpResponse
from django.core.mail import send_mail
from . import models, forms
from .gemini import ask_gemini
from django.contrib.auth.forms import UserCreationForm
from .forms import StyledSignupForm, StyledLoginForm
from django.contrib.auth.views import LoginView
from django.contrib import messages
from django.db.models import Max,Q



# Home Page
def send_email(email,subject,message):
    recipient_list = [email]
    send_mail(
        subject=subject,
        message=message,
        from_email='nabeelalikhan314@gmail.com',
        recipient_list=recipient_list,
        fail_silently=False,
    )
    return HttpResponse("Message Sent! Successfully")


def index(request):
    return render(request, "index.html")

def about(request):
    return render(request,"about.html")

# Contact Form
def contact(request):
    if request.method == "POST":
        form = forms.ContactForm(request.POST)
        if form.is_valid():
            form.save()
    else:
        form = forms.ContactForm()
    return render(request, "contact.html", {"form": form})


# Chatbot (file upload + chat in one view)

def chatbot(request):
    # Determine which session to load
    selected_session_id = request.GET.get("session_id")
    if not request.session.session_key:
        request.session.create()
    if not selected_session_id:
        selected_session_id = request.session.session_key

    file_text = None
    ai_response = None
    form = forms.TextForm()

    # Fetch file_text if it exists in any uploaded file for this session
    last_file_upload = models.PreprocessText.objects.filter(session_id=selected_session_id).order_by('-id').first()
    if last_file_upload:
        file_text = last_file_upload.file_text

    if request.method == "POST":
        if 'file' in request.FILES:  # File upload
            form = forms.TextForm(request.POST, request.FILES)
            if form.is_valid():
                obj = form.save(commit=False)
                obj.session_id = selected_session_id  # attach to selected session
                obj.save()

                ext = os.path.splitext(obj.file.name)[1].lower()
                if ext == '.txt':
                    with open(obj.file.path, 'r', encoding='utf-8') as f:
                        file_text = f.read()
                elif ext == '.pdf':
                    with open(obj.file.path, 'rb') as pdf_file:
                        reader = PyPDF2.PdfReader(pdf_file)
                        file_text = "".join(page.extract_text() for page in reader.pages)
                elif ext == '.docx':
                    doc = docx.Document(obj.file.path)
                    file_text = "\n".join([para.text for para in doc.paragraphs])

                obj.file_text = file_text
                obj.save()

        elif 'message' in request.POST:
            user_message = request.POST.get("message", "").strip()
            if file_text and user_message:
                ai_response = ask_gemini(file_text + "\n\n" + user_message)
                models.ChatHistory.objects.create(
                    user=request.user if request.user.is_authenticated else None,
                    session_id=selected_session_id,  # keep old session ID
                    user_message=user_message,
                    ai_response=ai_response
                )

    # Chat history for selected session
    chat_history = models.ChatHistory.objects.filter(
        session_id=selected_session_id
    ).order_by("created_at")

    # Previous sessions list for sidebar
    previous_sessions = []
    if request.user.is_authenticated:
        previous_sessions = (
            models.ChatHistory.objects
            .filter(user=request.user)
            .values('session_id')
            .annotate(last_message_time=Max('created_at'))
            .order_by('-last_message_time')
        )

    return render(request, "chatbot.html", {
        "form": form,
        "file_text": file_text,  # always show input if a file exists
        "ai_response": ai_response,
        "chat_history": chat_history,
        "previous_sessions": previous_sessions,
        "selected_session_id": selected_session_id
    })


def signup(request):
    if request.method == "POST":
        form = StyledSignupForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = StyledSignupForm()
    return render(request, 'registration/signup.html', {'form': form})


class CustomLoginView(LoginView):
    authentication_form = StyledLoginForm
    template_name = "registration/login.html"


def subscribe(request):
    if request.method == "POST":
        email = request.POST.get("email") or (request.user.email if request.user.is_authenticated else None)
        
        if not email:
            messages.error(request, "Please enter a valid email.")
            return redirect(request.META.get("HTTP_REFERER", "/"))

        # Save email to database
        obj, created = models.subscribers.objects.get_or_create(user=request.user,email=email)

        # Send confirmation email
        subject = "RAGQA Subscription Confirmation"
        message = (
            f"Dear {request.user.first_name or 'Subscriber'},\n\n"
            "Thank you for subscribing to RAGQA.\n"
            "You’re now part of our intelligent Q&A community where knowledge meets precision.\n\n"
            "We look forward to helping you find accurate answers instantly.\n\n"
            "Best regards,\n"
            "The RAGQA Team"
        )
        send_email(email, subject, message)

        # Show success or info message
        if created:
            messages.success(request, "Subscription successful! A confirmation email has been sent.")
        else:
            messages.info(request, "You are already subscribed. We've resent your confirmation email.")

        return render(request, "subscribe.html", {"email": email})
    
    return render(request, "subscribe_failed.html")