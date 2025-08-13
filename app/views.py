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
import uuid


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
    # ---------- Start New Chat (no logout) ----------
    if request.GET.get("new_chat") == "1":
        new_chat_id = uuid.uuid4().hex
        request.session["current_chat_id"] = new_chat_id
        return redirect(f"{request.path}?chat_id={new_chat_id}")

    # ---------- Determine current chat_id ----------
    chat_id = request.GET.get("chat_id") or request.session.get("current_chat_id")
    if not chat_id:
        chat_id = uuid.uuid4().hex
        request.session["current_chat_id"] = chat_id

    file_text = None
    ai_response = None
    form = forms.TextForm()  # only handles the file field

    # ---------- Handle POST ----------
    if request.method == "POST":
        # FILE UPLOAD
        if 'file' in request.FILES:
            form = forms.TextForm(request.POST, request.FILES)
            if form.is_valid():
                obj = form.save(commit=False)
                obj.session_id = chat_id
                obj.save()

                file_path = obj.file.path
                ext = os.path.splitext(file_path)[1].lower()

                try:
                    if ext == '.txt':
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            file_text = f.read()

                    elif ext == '.pdf':
                        with open(file_path, 'rb') as pdf_file:
                            reader = PyPDF2.PdfReader(pdf_file)
                            pieces = []
                            for page in reader.pages:
                                try:
                                    pieces.append(page.extract_text() or "")
                                except Exception:
                                    pieces.append("")
                            file_text = "".join(pieces)

                    elif ext == '.docx':
                        doc = docx.Document(file_path)
                        file_text = "\n".join([p.text for p in doc.paragraphs])

                    else:
                        messages.error(request, "Unsupported file type. Use .pdf, .docx, or .txt.")
                        return redirect(f"{request.path}?chat_id={chat_id}")

                except Exception as e:
                    messages.error(request, f"Could not read file: {e}")
                    return redirect(f"{request.path}?chat_id={chat_id}")

                obj.file_text = file_text or ""
                obj.save()
                return redirect(f"{request.path}?chat_id={chat_id}")
            else:
                messages.error(request, "Invalid file upload.")
                return redirect(f"{request.path}?chat_id={chat_id}")

        # SEND MESSAGE
        elif 'message' in request.POST:
            user_message = request.POST.get("message", "").strip()

            last_file_upload = models.PreprocessText.objects.filter(
                session_id=chat_id
            ).order_by('-id').first()

            file_text = last_file_upload.file_text if last_file_upload else None
            if not file_text:
                messages.error(request, "Please upload a file first.")
                return redirect(f"{request.path}?chat_id={chat_id}")

            if user_message:
                ai_response = ask_gemini(f"{file_text}\n\n{user_message}")
                models.ChatHistory.objects.create(
                    user=request.user if request.user.is_authenticated else None,
                    session_id=chat_id,
                    user_message=user_message,
                    ai_response=ai_response
                )
                return redirect(f"{request.path}?chat_id={chat_id}")

    # ---------- Always fetch latest state ----------
    last_file_upload = models.PreprocessText.objects.filter(session_id=chat_id).order_by('-id').first()
    if last_file_upload:
        file_text = last_file_upload.file_text

    chat_history = models.ChatHistory.objects.filter(session_id=chat_id).order_by("created_at")

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
        "file_text": file_text,
        "ai_response": ai_response,
        "chat_history": chat_history,
        "previous_sessions": previous_sessions,
        "chat_id": chat_id,
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


# views.py

def subscribe(request):
    if request.method == "POST":
        email = request.POST.get("email") or (request.user.email if request.user.is_authenticated else None)

        if not email:
            messages.error(request, "Please enter a valid email.")
            return redirect(request.META.get("HTTP_REFERER", "/"))

        # 🟢 Improved logic for creating a subscriber
        user_instance = request.user if request.user.is_authenticated else None
        
        # Use email as the main lookup and provide user as a default
        obj, created = models.subscribers.objects.update_or_create(
            email=email,
            defaults={'user': user_instance}
        )

        # Send confirmation email (your existing logic is fine here)
        subject = "RAGQA Subscription Confirmation"
        message = (
            f"Dear {user_instance.first_name if user_instance and user_instance.first_name else 'Subscriber'},\n\n"
            "Thank you for subscribing to RAGQA.\n"
            "You’re now part of our intelligent Q&A community where knowledge meets precision.\n\n"
            "We look forward to helping you find accurate answers instantly.\n\n"
            "Best regards,\n"
            "The RAGQA Team"
        )
        send_email(email, subject, message)

        if created:
            messages.success(request, "Subscription successful! A confirmation email has been sent.")
        else:
            messages.info(request, "You are already subscribed. We've resent your confirmation email.")

        return render(request, "subscribe.html", {"email": email})
    
    return render(request, "subscribe_failed.html")