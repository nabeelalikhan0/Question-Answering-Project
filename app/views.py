import os
import PyPDF2
import docx
from django.shortcuts import render
from . import models, forms
from .gemini import ask_gemini


# Home Page
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
    file_text = request.session.get("file_text", None)
    ai_response = None

    # Always have file upload form ready
    form = forms.TextForm()

    if request.method == "POST":
        if 'file' in request.FILES:  # File upload
            form = forms.TextForm(request.POST, request.FILES)
            if form.is_valid():
                form.save()

                model = models.PreprocessText.objects.order_by('-id').first()
                if model and model.file:
                    ext = os.path.splitext(model.file.name)[1].lower()

                    if ext == '.txt':
                        with open(model.file.path, 'r', encoding='utf-8') as f:
                            file_text = f.read()
                    elif ext == '.pdf':
                        with open(model.file.path, 'rb') as pdf_file:
                            reader = PyPDF2.PdfReader(pdf_file)
                            file_text = "".join(page.extract_text() for page in reader.pages)
                    elif ext == '.docx':
                        doc = docx.Document(model.file.path)
                        file_text = "\n".join([para.text for para in doc.paragraphs])

                    model.file_text = file_text
                    model.save()

                    # Save in session for chat use
                    request.session["file_text"] = file_text

        elif 'message' in request.POST:  # Chat message
            user_message = request.POST.get("message", "").strip()

            if file_text and user_message:
                ai_response = ask_gemini(file_text + "\n\n" + user_message)

                # Save chat in DB per session
                models.ChatHistory.objects.create(
                    session_id=request.session.session_key,
                    user_message=user_message,
                    ai_response=ai_response
                )

    # Get chat history for this session
    chat_history = models.ChatHistory.objects.filter(
        session_id=request.session.session_key
    ).order_by("created_at")

    return render(request, "chatbot.html", {
        "form": form,
        "file_text": file_text,
        "ai_response": ai_response,
        "chat_history": chat_history
    })
